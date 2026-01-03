// app/api/ai/image-analysis/route.ts
/**
 * AI画像解析API
 * 
 * 機能:
 * 1. Gemini Vision APIで商品画像を解析
 * 2. 英語タイトル、素材、原産国、重量等を自動推定
 * 3. 信頼度スコア付き
 * 4. DB自動保存オプション
 * 
 * エンドポイント: POST /api/ai/image-analysis
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ============================================================
// 設定
// ============================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ============================================================
// プロンプト定義
// ============================================================

const PRODUCT_ANALYSIS_PROMPT = `
あなたは越境EC（特にeBay向け）の商品分析専門家です。
この商品画像を分析し、以下のJSON形式で情報を出力してください。

【出力形式】
{
  "english_title": "英語の商品タイトル（eBay向け、SEO最適化、80文字以内、ブランド名+商品名+特徴）",
  "japanese_title": "日本語の商品タイトル（推測）",
  "category_suggestion": "推定eBayカテゴリ（例: Collectible Card Games, Action Figures, Video Games）",
  "subcategory_suggestion": "推定サブカテゴリ（例: Pokemon, Dragon Ball, Nintendo）",
  "condition_suggestion": "推定コンディション（New/Like New/Very Good/Good/Acceptable）",
  "brand": "ブランド名（例: Nintendo, Bandai, Takara Tomy）",
  "material": "主な素材（例: Plastic, Metal, Paper, Cardboard, PVC, Resin）",
  "origin_country": "推定原産国（ISO 2文字コード、例: JP, CN, TW）",
  "estimated_weight_g": 推定重量（グラム、整数）,
  "dimensions_cm": {
    "width": 幅（cm、小数点1桁）,
    "height": 高さ（cm、小数点1桁）,
    "depth": 奥行き（cm、小数点1桁）
  },
  "keywords": ["英語キーワード1", "英語キーワード2", "英語キーワード3", "英語キーワード4", "英語キーワード5"],
  "item_specifics": {
    "Character": "キャラクター名（該当する場合）",
    "Series": "シリーズ名（該当する場合）",
    "Year": "年代（該当する場合）",
    "Type": "タイプ（例: Figure, Card, Plush）"
  },
  "confidence": 信頼度スコア（0.0〜1.0）,
  "analysis_notes": "分析に関するメモ（不確かな点など）"
}

【注意事項】
- 商品が特定できない場合はconfidenceを0.3以下にしてください
- 日本語商品の場合は日本製(JP)を優先的に推測
- トレーディングカードの場合はスリーブや箱を含めた重量を推測
- フィギュアの場合は箱入り重量を推測
- 必ず有効なJSONのみを出力してください（説明文は不要）
`;

const SIMPLE_TITLE_PROMPT = `
この商品画像から、eBay出品用の英語タイトルを生成してください。

【要件】
- 80文字以内
- SEO最適化（検索されやすいキーワードを含む）
- ブランド名 + 商品名 + 特徴の形式
- 大文字小文字は適切に使用

【出力形式】
{
  "english_title": "生成したタイトル",
  "confidence": 0.0-1.0
}

JSONのみを出力してください。
`;

// ============================================================
// 型定義
// ============================================================

interface ImageAnalysisRequest {
  imageUrl?: string;
  imageBase64?: string;
  productId?: string | number;
  mode?: 'full' | 'title_only' | 'preview';
  saveToDb?: boolean;
  targetTable?: 'products_master' | 'inventory_master';
}

interface ImageAnalysisResult {
  english_title?: string;
  japanese_title?: string;
  category_suggestion?: string;
  subcategory_suggestion?: string;
  condition_suggestion?: string;
  brand?: string;
  material?: string;
  origin_country?: string;
  estimated_weight_g?: number;
  dimensions_cm?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  keywords?: string[];
  item_specifics?: Record<string, string>;
  confidence: number;
  analysis_notes?: string;
}

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 画像URLからBase64データを取得
 */
async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; N3Bot/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  } catch (error: any) {
    console.error('[AI Analysis] Image fetch error:', error.message);
    return null;
  }
}

/**
 * MIMEタイプを推定
 */
function getMimeType(imageUrl?: string, base64Data?: string): string {
  if (imageUrl) {
    const ext = imageUrl.split('.').pop()?.toLowerCase().split('?')[0];
    switch (ext) {
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'webp': return 'image/webp';
      default: return 'image/jpeg';
    }
  }
  // Base64のヘッダーから判定
  if (base64Data?.startsWith('/9j/')) return 'image/jpeg';
  if (base64Data?.startsWith('iVBOR')) return 'image/png';
  if (base64Data?.startsWith('R0lGOD')) return 'image/gif';
  return 'image/jpeg';
}

/**
 * Gemini APIを呼び出し
 */
async function callGeminiVision(
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const response = await fetch(`${API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3, // 低めで安定性重視
          maxOutputTokens: 2048,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Analysis] Gemini API Error:', response.status, errorText);
      return { success: false, error: `Gemini API Error: ${response.status}` };
    }
    
    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      return { success: false, error: 'No response from Gemini' };
    }
    
    return { success: true, response: textResponse };
  } catch (error: any) {
    console.error('[AI Analysis] Gemini call error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * JSONをパース（マークダウンコードブロック対応）
 */
function parseJsonResponse(text: string): ImageAnalysisResult | null {
  try {
    // マークダウンのコードブロックを除去
    let jsonText = text.trim();
    
    // ```json ... ``` パターン
    const jsonBlockMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      jsonText = jsonBlockMatch[1].trim();
    }
    // ``` ... ``` パターン
    else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
    }
    
    // { から始まる部分を抽出
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('[AI Analysis] JSON parse error:', error);
    console.error('[AI Analysis] Raw text:', text.substring(0, 500));
    return null;
  }
}

// ============================================================
// メインハンドラ
// ============================================================

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const body: ImageAnalysisRequest = await request.json();
    const { 
      imageUrl, 
      imageBase64, 
      productId, 
      mode = 'full',
      saveToDb = false,
      targetTable = 'products_master'
    } = body;
    
    // バリデーション
    if (!imageUrl && !imageBase64) {
      return NextResponse.json(
        { success: false, error: '画像URLまたはBase64データが必要です' },
        { status: 400 }
      );
    }
    
    // API Key確認
    if (!GEMINI_API_KEY) {
      console.warn('[AI Analysis] GEMINI_API_KEY not configured');
      return NextResponse.json({
        success: true,
        mode: 'mock',
        analysis: {
          english_title: 'Japanese Collectible Item - Authentic Product',
          confidence: 0,
          analysis_notes: 'Gemini API Keyが設定されていません。手動入力をご利用ください。'
        },
        processingTime: Date.now() - startTime
      });
    }
    
    // 画像データ準備
    let base64Data = imageBase64;
    if (!base64Data && imageUrl) {
      base64Data = await fetchImageAsBase64(imageUrl);
      if (!base64Data) {
        return NextResponse.json(
          { success: false, error: '画像の取得に失敗しました' },
          { status: 400 }
        );
      }
    }
    
    // MIMEタイプ判定
    const mimeType = getMimeType(imageUrl, base64Data);
    
    // プロンプト選択
    const prompt = mode === 'title_only' ? SIMPLE_TITLE_PROMPT : PRODUCT_ANALYSIS_PROMPT;
    
    // Gemini API呼び出し
    console.log(`[AI Analysis] Calling Gemini (mode: ${mode})...`);
    const geminiResult = await callGeminiVision(base64Data!, mimeType, prompt);
    
    if (!geminiResult.success) {
      return NextResponse.json(
        { success: false, error: geminiResult.error },
        { status: 500 }
      );
    }
    
    // JSONパース
    const analysis = parseJsonResponse(geminiResult.response!);
    
    if (!analysis) {
      return NextResponse.json({
        success: true,
        mode: 'raw',
        rawResponse: geminiResult.response,
        analysis: {
          confidence: 0.1,
          analysis_notes: 'JSON解析に失敗しました。手動で確認してください。'
        },
        processingTime: Date.now() - startTime
      });
    }
    
    console.log(`[AI Analysis] Analysis complete (confidence: ${analysis.confidence})`);
    
    // DB保存（オプション）
    let savedToDb = false;
    if (saveToDb && productId && analysis.confidence >= 0.5) {
      try {
        const supabase = await createClient();
        
        const updateData: Record<string, any> = {
          ai_analyzed_at: new Date().toISOString(),
          ai_confidence: analysis.confidence,
          updated_at: new Date().toISOString()
        };
        
        // 解析結果をマッピング
        if (analysis.english_title) {
          updateData.english_title = analysis.english_title;
        }
        if (analysis.origin_country) {
          updateData.origin_country = analysis.origin_country;
        }
        if (analysis.material) {
          updateData.material = analysis.material;
        }
        if (analysis.brand) {
          updateData.brand = analysis.brand;
        }
        
        // listing_data への保存
        if (analysis.estimated_weight_g || analysis.dimensions_cm) {
          updateData.listing_data = {
            weight_g: analysis.estimated_weight_g,
            width_cm: analysis.dimensions_cm?.width,
            height_cm: analysis.dimensions_cm?.height,
            length_cm: analysis.dimensions_cm?.depth
          };
        }
        
        // AI分析メタデータ
        updateData.ai_analysis_data = {
          category_suggestion: analysis.category_suggestion,
          subcategory_suggestion: analysis.subcategory_suggestion,
          condition_suggestion: analysis.condition_suggestion,
          keywords: analysis.keywords,
          item_specifics: analysis.item_specifics,
          analyzed_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from(targetTable)
          .update(updateData)
          .eq('id', productId);
        
        if (error) {
          console.error('[AI Analysis] DB update error:', error);
        } else {
          savedToDb = true;
          console.log(`[AI Analysis] Saved to ${targetTable} (id: ${productId})`);
        }
      } catch (dbError: any) {
        console.error('[AI Analysis] DB error:', dbError);
      }
    }
    
    return NextResponse.json({
      success: true,
      mode: 'ai',
      analysis,
      savedToDb,
      processingTime: Date.now() - startTime
    });
    
  } catch (error: any) {
    console.error('[AI Analysis] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '不明なエラーが発生しました' },
      { status: 500 }
    );
  }
}

// ============================================================
// GETハンドラ（ヘルスチェック用）
// ============================================================

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Image Analysis',
    model: GEMINI_MODEL,
    apiKeyConfigured: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
}
