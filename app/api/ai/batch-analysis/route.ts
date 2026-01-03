// app/api/ai/batch-analysis/route.ts
/**
 * AI一括画像解析API
 * 
 * 複数商品の画像を順次解析してDBに保存
 * 
 * エンドポイント: POST /api/ai/batch-analysis
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// レート制限対策（1秒あたり1リクエスト程度）
const DELAY_BETWEEN_REQUESTS = 1500;

const BATCH_ANALYSIS_PROMPT = `
この商品画像を分析し、以下のJSON形式で出力してください。

{
  "english_title": "英語タイトル（eBay向け、80文字以内）",
  "category_suggestion": "推定カテゴリ",
  "material": "素材",
  "origin_country": "原産国（2文字ISOコード）",
  "estimated_weight_g": 重量（グラム、整数）,
  "confidence": 信頼度（0.0-1.0）
}

JSONのみを出力してください。
`;

interface BatchRequest {
  productIds: (string | number)[];
  targetTable?: 'products_master' | 'inventory_master';
  mode?: 'full' | 'title_only';
}

interface BatchResult {
  productId: string;
  success: boolean;
  englishTitle?: string;
  confidence?: number;
  error?: string;
}

// 遅延関数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 画像取得
async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; N3Bot/1.0)' }
    });
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  } catch {
    return null;
  }
}

// Gemini呼び出し
async function analyzeImage(base64Data: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: BATCH_ANALYSIS_PROMPT },
            { inline_data: { mime_type: 'image/jpeg', data: base64Data } }
          ]
        }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
      })
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    
    // JSONパース
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const body: BatchRequest = await request.json();
    const { 
      productIds, 
      targetTable = 'products_master',
      mode = 'full'
    } = body;
    
    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '商品IDが指定されていません' },
        { status: 400 }
      );
    }
    
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API Keyが設定されていません' },
        { status: 500 }
      );
    }
    
    const supabase = await createClient();
    const results: BatchResult[] = [];
    
    // 商品データ取得
    const { data: products, error: fetchError } = await supabase
      .from(targetTable)
      .select('id, images, primary_image_url, gallery_images, product_name, title')
      .in('id', productIds);
    
    if (fetchError || !products) {
      return NextResponse.json(
        { success: false, error: '商品データの取得に失敗しました' },
        { status: 500 }
      );
    }
    
    console.log(`[Batch AI] Processing ${products.length} products...`);
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productId = String(product.id);
      
      // 画像URL取得
      const imageUrl = product.primary_image_url 
        || product.images?.[0] 
        || product.gallery_images?.[0];
      
      if (!imageUrl) {
        results.push({
          productId,
          success: false,
          error: '画像がありません'
        });
        continue;
      }
      
      // 画像取得
      const base64Data = await fetchImageAsBase64(imageUrl);
      if (!base64Data) {
        results.push({
          productId,
          success: false,
          error: '画像の取得に失敗'
        });
        continue;
      }
      
      // AI解析
      const analysis = await analyzeImage(base64Data);
      
      if (!analysis || analysis.confidence < 0.3) {
        results.push({
          productId,
          success: false,
          error: '解析できませんでした',
          confidence: analysis?.confidence
        });
        continue;
      }
      
      // DB更新
      const updateData: Record<string, any> = {
        ai_analyzed_at: new Date().toISOString(),
        ai_confidence: analysis.confidence,
        updated_at: new Date().toISOString()
      };
      
      if (analysis.english_title) {
        updateData.english_title = analysis.english_title;
      }
      if (analysis.origin_country) {
        updateData.origin_country = analysis.origin_country;
      }
      if (analysis.material) {
        updateData.material = analysis.material;
      }
      if (analysis.estimated_weight_g) {
        updateData.listing_data = {
          weight_g: analysis.estimated_weight_g
        };
      }
      
      const { error: updateError } = await supabase
        .from(targetTable)
        .update(updateData)
        .eq('id', productId);
      
      if (updateError) {
        results.push({
          productId,
          success: false,
          error: 'DB更新失敗'
        });
      } else {
        results.push({
          productId,
          success: true,
          englishTitle: analysis.english_title,
          confidence: analysis.confidence
        });
      }
      
      // レート制限対策
      if (i < products.length - 1) {
        await delay(DELAY_BETWEEN_REQUESTS);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`[Batch AI] Complete: ${successCount} success, ${failCount} failed`);
    
    return NextResponse.json({
      success: true,
      total: products.length,
      succeeded: successCount,
      failed: failCount,
      results,
      processingTime: Date.now() - startTime
    });
    
  } catch (error: any) {
    console.error('[Batch AI] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
