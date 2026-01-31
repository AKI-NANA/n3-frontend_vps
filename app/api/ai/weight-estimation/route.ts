// app/api/ai/weight-estimation/route.ts
/**
 * AI重量推定API
 * - Gemini APIを使用して商品タイトル・説明文から重量を推定
 * - カテゴリー情報を考慮した精度の高い推定
 * - 推定結果をDBに自動保存するオプション
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Gemini API設定
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// カテゴリー別の重量範囲参考値
const CATEGORY_WEIGHT_HINTS: Record<string, { typical: number; min: number; max: number; unit: string }> = {
  // トレーディングカード
  'trading_card': { typical: 2, min: 1, max: 5, unit: '1枚あたり約1-2g' },
  'card_deck': { typical: 150, min: 80, max: 300, unit: 'デッキ（約60枚）で100-200g' },
  'card_booster': { typical: 15, min: 10, max: 30, unit: 'パック1つ約15g' },
  
  // マグカップ・食器
  'mug': { typical: 350, min: 200, max: 600, unit: '標準マグ300-400g' },
  'ceramic': { typical: 400, min: 100, max: 2000, unit: 'サイズにより大きく変動' },
  
  // フィギュア
  'figure_small': { typical: 100, min: 30, max: 300, unit: '小型フィギュア50-200g' },
  'figure_large': { typical: 500, min: 200, max: 2000, unit: '大型フィギュア300-1000g' },
  
  // 衣類
  'tshirt': { typical: 200, min: 100, max: 400, unit: 'Tシャツ150-250g' },
  'hoodie': { typical: 500, min: 300, max: 800, unit: 'パーカー400-600g' },
  
  // 電子機器
  'electronics_small': { typical: 200, min: 50, max: 500, unit: '小型電子機器100-300g' },
  'electronics_large': { typical: 1000, min: 500, max: 5000, unit: '大型電子機器500g-2kg' },
  
  // デフォルト
  'default': { typical: 200, min: 10, max: 5000, unit: '一般的な小物100-500g' },
};

// カテゴリーを推測
function inferCategory(title: string, description: string, categoryName?: string): string {
  const combined = `${title} ${description} ${categoryName || ''}`.toLowerCase();
  
  // トレーディングカード
  if (/trading card|tcg|mtg|pokemon card|yugioh|magic.the.gathering|final fantasy.*card/i.test(combined)) {
    if (/deck|デッキ/i.test(combined)) return 'card_deck';
    if (/booster|pack|パック/i.test(combined)) return 'card_booster';
    return 'trading_card';
  }
  
  // マグカップ
  if (/mug|マグ|coffee cup|tea cup/i.test(combined)) {
    return 'mug';
  }
  
  // 陶器
  if (/ceramic|porcelain|陶器|磁器/i.test(combined)) {
    return 'ceramic';
  }
  
  // フィギュア
  if (/figure|figurine|フィギュア|statue|スタチュー/i.test(combined)) {
    if (/mini|small|ミニ|small/i.test(combined)) return 'figure_small';
    if (/large|big|大型|1\/4|1\/6/i.test(combined)) return 'figure_large';
    return 'figure_small';
  }
  
  // 衣類
  if (/t-shirt|tシャツ|tee/i.test(combined)) return 'tshirt';
  if (/hoodie|パーカー|sweatshirt/i.test(combined)) return 'hoodie';
  
  // 電子機器
  if (/electronics|電子|gadget|device/i.test(combined)) {
    if (/small|mini|compact/i.test(combined)) return 'electronics_small';
    return 'electronics_large';
  }
  
  return 'default';
}

// Geminiでの重量推定
async function estimateWeightWithGemini(
  title: string,
  description: string,
  categoryName?: string,
  currentWeight?: number
): Promise<{ weight: number; confidence: 'high' | 'medium' | 'low'; reasoning: string }> {
  
  const inferredCategory = inferCategory(title, description, categoryName);
  const hints = CATEGORY_WEIGHT_HINTS[inferredCategory] || CATEGORY_WEIGHT_HINTS['default'];
  
  const prompt = `あなたは商品の重量を推定する専門家です。

以下の商品情報から、この商品の重量（グラム単位）を推定してください。

【商品情報】
- タイトル: ${title}
- 説明: ${description || '(説明なし)'}
- カテゴリー: ${categoryName || '不明'}
${currentWeight ? `- 現在の登録重量: ${currentWeight}g（この値は不正確な可能性があります）` : ''}

【参考情報】
- 推定カテゴリー: ${inferredCategory}
- 典型的な重量範囲: ${hints.min}g〜${hints.max}g
- 参考: ${hints.unit}

【回答形式】
必ず以下のJSON形式で回答してください。他の文章は不要です。

{
  "weight": 推定重量（整数、グラム単位）,
  "confidence": "high" または "medium" または "low",
  "reasoning": "推定理由を1-2文で"
}

重要：
- トレーディングカード1枚なら1-3g程度
- マグカップは空の状態で300-400g程度
- 小さなフィギュアは50-200g程度
- 実際に発送可能な範囲（10g〜10kg）で推定してください`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // バリデーション
    const weight = Math.max(1, Math.min(10000, Math.round(result.weight)));
    
    return {
      weight,
      confidence: result.confidence || 'medium',
      reasoning: result.reasoning || '自動推定',
    };
  } catch (error) {
    console.error('[AI Weight] Gemini error:', error);
    
    // フォールバック：カテゴリーベースの推定
    return {
      weight: hints.typical,
      confidence: 'low',
      reasoning: `Gemini APIエラーのため、カテゴリー「${inferredCategory}」の典型値を使用`,
    };
  }
}

// POST: 重量推定実行
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productId, 
      title, 
      description, 
      categoryName, 
      currentWeight,
      saveToDb = false,
    } = body;

    // バリデーション
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // Gemini API キーチェック
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // 重量推定
    const estimation = await estimateWeightWithGemini(
      title,
      description || '',
      categoryName,
      currentWeight
    );

    // DBに保存する場合
    if (saveToDb && productId) {
      const supabase = await createClient();
      
      // 既存データを取得して更新
      const { data: product, error: fetchError } = await supabase
        .from('products_master')
        .select('listing_data')
        .eq('id', productId)
        .single();

      if (!fetchError && product) {
        const updatedListingData = {
          ...(product.listing_data || {}),
          weight_g: estimation.weight,
          weight_estimated_by_ai: true,
          weight_estimation_confidence: estimation.confidence,
          weight_estimation_reasoning: estimation.reasoning,
          weight_estimated_at: new Date().toISOString(),
        };

        await supabase
          .from('products_master')
          .update({
            listing_data: updatedListingData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', productId);

        console.log(`[AI Weight] Saved estimation for product ${productId}: ${estimation.weight}g`);
      }
    }

    return NextResponse.json({
      success: true,
      estimation: {
        weight: estimation.weight,
        confidence: estimation.confidence,
        reasoning: estimation.reasoning,
        unit: 'grams',
      },
      saved: saveToDb && !!productId,
    });

  } catch (error) {
    console.error('[AI Weight] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// PATCH: 一括推定
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { products, saveToDb = false } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Products array is required' },
        { status: 400 }
      );
    }

    const results = [];
    const supabase = saveToDb ? await createClient() : null;

    for (const product of products) {
      try {
        const estimation = await estimateWeightWithGemini(
          product.title || '',
          product.description || '',
          product.categoryName,
          product.currentWeight
        );

        // DB保存
        if (saveToDb && supabase && product.id) {
          const { data: existingProduct } = await supabase
            .from('products_master')
            .select('listing_data')
            .eq('id', product.id)
            .single();

          if (existingProduct) {
            const updatedListingData = {
              ...(existingProduct.listing_data || {}),
              weight_g: estimation.weight,
              weight_estimated_by_ai: true,
              weight_estimation_confidence: estimation.confidence,
              weight_estimated_at: new Date().toISOString(),
            };

            await supabase
              .from('products_master')
              .update({
                listing_data: updatedListingData,
                updated_at: new Date().toISOString(),
              })
              .eq('id', product.id);
          }
        }

        results.push({
          productId: product.id,
          status: 'success',
          estimation,
        });

        // レート制限対策
        await new Promise(r => setTimeout(r, 200));

      } catch (error) {
        results.push({
          productId: product.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: products.length,
        success: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
      },
    });

  } catch (error) {
    console.error('[AI Weight Batch] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
