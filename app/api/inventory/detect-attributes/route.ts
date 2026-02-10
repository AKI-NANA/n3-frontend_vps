// app/api/inventory/detect-attributes/route.ts
/**
 * 属性検知エンジンAPI
 * 
 * 商品タイトル・SKUをスキャンし、以下の属性を自動検出:
 * - PSA 10 → grade: "PSA10"
 * - セット/まとめ/2枚組 → product_type: "set"
 * - SET- prefix → product_type: "set"
 * 
 * @version 1.0.0
 * @date 2026-01-14
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// 検知パターン
// ============================================================

// PSA検知パターン
const PSA_PATTERNS = [
  /PSA\s*10/i,
  /PSA\s*9/i,
  /PSA\s*8/i,
  /BGS\s*10/i,
  /BGS\s*9\.5/i,
  /BGS\s*9/i,
  /CGC\s*10/i,
  /CGC\s*9\.5/i,
];

// セット品検知パターン
const SET_PATTERNS = [
  /セット/,
  /まとめ/,
  /まとめ売り/,
  /\d+枚組/,
  /\d+枚セット/,
  /\d+個セット/,
  /bundle/i,
  /lot\s*of\s*\d+/i,
  /set\s*of\s*\d+/i,
  /\d+\s*cards?$/i,
  /\d+\s*pieces?$/i,
];

// バリエーション検知パターン
const VARIATION_PATTERNS = [
  /サイズ違い/,
  /色違い/,
  /カラー:/,
  /size:/i,
  /color:/i,
];

// ============================================================
// 検知関数
// ============================================================

interface DetectionResult {
  product_type?: 'unit' | 'set';
  grade?: string;
  is_graded?: boolean;
  is_variation_candidate?: boolean;
  detected_keywords: string[];
  confidence: number;  // 0-100
}

function detectAttributes(
  title: string, 
  sku: string, 
  englishTitle?: string,
  description?: string
): DetectionResult {
  const result: DetectionResult = {
    detected_keywords: [],
    confidence: 0,
  };
  
  const textToScan = [
    title || '',
    sku || '',
    englishTitle || '',
    description || '',
  ].join(' ');
  
  let confidencePoints = 0;
  
  // SKUにSET-がある場合は確実にセット品
  if (sku?.toUpperCase().startsWith('SET-')) {
    result.product_type = 'set';
    result.detected_keywords.push('SKU: SET-');
    confidencePoints += 100;
  }
  
  // PSA検知
  for (const pattern of PSA_PATTERNS) {
    const match = textToScan.match(pattern);
    if (match) {
      result.grade = match[0].toUpperCase().replace(/\s+/g, ' ');
      result.is_graded = true;
      result.detected_keywords.push(`グレード: ${match[0]}`);
      confidencePoints += 80;
      break; // 最初のマッチのみ
    }
  }
  
  // セット品検知（SKUで既に確定していない場合）
  if (result.product_type !== 'set') {
    for (const pattern of SET_PATTERNS) {
      const match = textToScan.match(pattern);
      if (match) {
        result.product_type = 'set';
        result.detected_keywords.push(`セット: ${match[0]}`);
        confidencePoints += 70;
        break;
      }
    }
  }
  
  // バリエーション候補検知
  for (const pattern of VARIATION_PATTERNS) {
    if (pattern.test(textToScan)) {
      result.is_variation_candidate = true;
      result.detected_keywords.push('バリエーション候補');
      confidencePoints += 30;
      break;
    }
  }
  
  // デフォルトは単体商品
  if (!result.product_type) {
    result.product_type = 'unit';
  }
  
  result.confidence = Math.min(confidencePoints, 100);
  
  return result;
}

// ============================================================
// POST: 属性検知実行
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      ids,              // 対象商品ID配列
      applyToDb = false, // trueの場合はDBに反映
      autoSetSku = false, // trueの場合はセット品にSET-プレフィックスを付与
    } = body;
    
    // 全商品または指定商品を取得
    let query = supabase
      .from('inventory_master')
      .select('id, sku, product_name, english_title, description, product_type, grade, is_variation_parent');
    
    if (ids && Array.isArray(ids) && ids.length > 0) {
      query = query.in('id', ids);
    }
    
    const { data: products, error } = await query.limit(1000);
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    const results: any[] = [];
    const updates: any[] = [];
    
    for (const product of products || []) {
      const detection = detectAttributes(
        product.product_name,
        product.sku,
        product.english_title,
        product.description
      );
      
      const productResult = {
        id: product.id,
        sku: product.sku,
        product_name: product.product_name,
        current: {
          product_type: product.product_type,
          grade: product.grade,
        },
        detected: detection,
        changed: false,
      };
      
      // 変更があるか確認
      const needsUpdate = 
        (detection.product_type === 'set' && product.product_type !== 'set') ||
        (detection.grade && product.grade !== detection.grade);
      
      if (needsUpdate) {
        productResult.changed = true;
        
        const updateData: any = {};
        
        if (detection.product_type === 'set' && product.product_type !== 'set') {
          updateData.product_type = 'set';
          
          // SKUにSET-プレフィックスを付与
          if (autoSetSku && product.sku && !product.sku.toUpperCase().startsWith('SET-')) {
            updateData.sku = `SET-${product.sku}`;
          }
        }
        
        if (detection.grade && product.grade !== detection.grade) {
          updateData.grade = detection.grade;
          updateData.is_graded = true;
        }
        
        if (Object.keys(updateData).length > 0 && applyToDb) {
          updateData.updated_at = new Date().toISOString();
          updateData.attribute_detection_at = new Date().toISOString();
          
          const { error: updateError } = await supabase
            .from('inventory_master')
            .update(updateData)
            .eq('id', product.id);
          
          if (!updateError) {
            updates.push({
              id: product.id,
              sku: product.sku,
              updates: updateData,
            });
          }
        }
      }
      
      results.push(productResult);
    }
    
    // 統計
    const stats = {
      total: results.length,
      setDetected: results.filter(r => r.detected.product_type === 'set').length,
      gradedDetected: results.filter(r => r.detected.is_graded).length,
      variationCandidates: results.filter(r => r.detected.is_variation_candidate).length,
      changed: results.filter(r => r.changed).length,
      updated: updates.length,
    };
    
    return NextResponse.json({
      success: true,
      applyToDb,
      autoSetSku,
      stats,
      results: results.slice(0, 100), // 最大100件まで
      updates,
      message: applyToDb
        ? `${stats.updated}件のレコードを更新しました`
        : `${stats.changed}件の変更を検出しました（プレビューモード）`,
    });
    
  } catch (error: any) {
    console.error('[DetectAttributes] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// GET: 単一商品の属性検知
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title') || '';
    const sku = searchParams.get('sku') || '';
    const englishTitle = searchParams.get('english_title') || '';
    
    const detection = detectAttributes(title, sku, englishTitle);
    
    return NextResponse.json({
      success: true,
      input: { title, sku, englishTitle },
      detection,
      suggestedSku: detection.product_type === 'set' && sku && !sku.toUpperCase().startsWith('SET-')
        ? `SET-${sku}`
        : sku,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
