// app/api/inventory/update-sku-prefix/route.ts
/**
 * SKUプレフィックス自動付与API
 * 
 * セット品フラグがONの商品にSET-プレフィックスを自動付与
 * PSA10フラグがONの商品にPSA10-プレフィックスを推奨
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
// SKUプレフィックス定義
// ============================================================
const SKU_PREFIXES = {
  set: 'SET-',
  psa10: 'PSA10-',
  psa9: 'PSA9-',
  bgs10: 'BGS10-',
  graded: 'GRD-',  // 汎用グレード
  variation_parent: 'VAR-',
} as const;

// ============================================================
// POST: SKUプレフィックス付与
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      ids,              // 対象商品ID配列
      prefixType,       // 'set' | 'graded' | 'variation_parent' | 'auto'
      dryRun = true,    // trueの場合は変更を適用せず差分のみ返す
    } = body;
    
    if (!prefixType) {
      return NextResponse.json(
        { success: false, error: 'prefixTypeが指定されていません' },
        { status: 400 }
      );
    }
    
    // 対象商品を取得
    let query = supabase
      .from('inventory_master')
      .select('id, sku, product_name, product_type, grade, is_variation_parent');
    
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
      const currentSku = product.sku || '';
      let newSku = currentSku;
      let shouldUpdate = false;
      let reason = '';
      
      // 自動判定モード
      if (prefixType === 'auto') {
        // セット品
        if (product.product_type === 'set' && !currentSku.toUpperCase().startsWith(SKU_PREFIXES.set)) {
          newSku = `${SKU_PREFIXES.set}${currentSku}`;
          shouldUpdate = true;
          reason = 'セット品にSET-プレフィックスを付与';
        }
        // PSA10
        else if (product.grade === 'PSA 10' || product.grade === 'PSA10') {
          if (!currentSku.toUpperCase().startsWith(SKU_PREFIXES.psa10) && 
              !currentSku.toUpperCase().startsWith(SKU_PREFIXES.set)) {
            newSku = `${SKU_PREFIXES.psa10}${currentSku}`;
            shouldUpdate = true;
            reason = 'PSA10にPSA10-プレフィックスを付与';
          }
        }
        // バリエーション親
        else if (product.is_variation_parent && 
                 !currentSku.toUpperCase().startsWith(SKU_PREFIXES.variation_parent) &&
                 !currentSku.toUpperCase().startsWith(SKU_PREFIXES.set)) {
          newSku = `${SKU_PREFIXES.variation_parent}${currentSku}`;
          shouldUpdate = true;
          reason = 'バリエーション親にVAR-プレフィックスを付与';
        }
      }
      // 指定モード
      else {
        const prefix = SKU_PREFIXES[prefixType as keyof typeof SKU_PREFIXES];
        if (prefix && !currentSku.toUpperCase().startsWith(prefix)) {
          newSku = `${prefix}${currentSku}`;
          shouldUpdate = true;
          reason = `${prefix}プレフィックスを付与`;
        }
      }
      
      if (shouldUpdate) {
        results.push({
          id: product.id,
          currentSku,
          newSku,
          reason,
          product_name: product.product_name,
        });
        
        if (!dryRun) {
          const { error: updateError } = await supabase
            .from('inventory_master')
            .update({
              sku: newSku,
              updated_at: new Date().toISOString(),
            })
            .eq('id', product.id);
          
          if (!updateError) {
            updates.push({
              id: product.id,
              oldSku: currentSku,
              newSku,
            });
          }
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      dryRun,
      prefixType,
      stats: {
        total: products?.length || 0,
        changed: results.length,
        updated: updates.length,
      },
      results,
      updates,
      message: dryRun
        ? `${results.length}件のSKU変更を検出しました（プレビューモード）`
        : `${updates.length}件のSKUを更新しました`,
    });
    
  } catch (error: any) {
    console.error('[UpdateSkuPrefix] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH: 単一商品のSKU更新
// ============================================================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, newSku } = body;
    
    if (!id || !newSku) {
      return NextResponse.json(
        { success: false, error: 'idとnewSkuが必要です' },
        { status: 400 }
      );
    }
    
    // SKU重複チェック
    const { data: existing } = await supabase
      .from('inventory_master')
      .select('id')
      .eq('sku', newSku)
      .neq('id', id)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: `SKU "${newSku}" は既に使用されています` },
        { status: 400 }
      );
    }
    
    // 更新
    const { error: updateError } = await supabase
      .from('inventory_master')
      .update({
        sku: newSku,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `SKUを "${newSku}" に更新しました`,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// GET: SKUプレフィックス統計
// ============================================================
export async function GET() {
  try {
    // 各プレフィックスの使用状況
    const { data: allSkus } = await supabase
      .from('inventory_master')
      .select('sku, product_type, grade, is_variation_parent');
    
    const stats = {
      total: allSkus?.length || 0,
      withSetPrefix: 0,
      withPsa10Prefix: 0,
      withVarPrefix: 0,
      setWithoutPrefix: 0,  // セット品だがSET-プレフィックスがない
      gradedWithoutPrefix: 0,  // グレード品だがプレフィックスがない
    };
    
    for (const item of allSkus || []) {
      const sku = (item.sku || '').toUpperCase();
      
      if (sku.startsWith(SKU_PREFIXES.set)) {
        stats.withSetPrefix++;
      }
      if (sku.startsWith(SKU_PREFIXES.psa10)) {
        stats.withPsa10Prefix++;
      }
      if (sku.startsWith(SKU_PREFIXES.variation_parent)) {
        stats.withVarPrefix++;
      }
      
      // セット品だがプレフィックスがない
      if (item.product_type === 'set' && !sku.startsWith(SKU_PREFIXES.set)) {
        stats.setWithoutPrefix++;
      }
      
      // グレード品だがプレフィックスがない
      if (item.grade && !sku.startsWith(SKU_PREFIXES.psa10) && !sku.startsWith(SKU_PREFIXES.graded)) {
        stats.gradedWithoutPrefix++;
      }
    }
    
    return NextResponse.json({
      success: true,
      prefixes: SKU_PREFIXES,
      stats,
      recommendations: {
        setNeedsPrefix: stats.setWithoutPrefix,
        gradedNeedsPrefix: stats.gradedWithoutPrefix,
      },
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
