// lib/services/ai/field-completion-service.ts
/**
 * フィールド補完サービス - ピンポイントAI補完
 * 
 * 【目的】
 * - audit-serviceで「欠落」と判定されたフィールドのみを補完
 * - 全データ取得ではなく、最小限のAPI呼び出し
 * - 格安モデル（Gemini 1.5 Flash）固定でコスト最小化
 * 
 * 【対応フィールド】
 * - hts_code: HTSコード（関税分類）
 * - origin_country: 原産国
 * - material: 素材
 * - weight_g: 重量
 * - condition: コンディション
 * 
 * 【コスト概算】
 * - Gemini 1.5 Flash: 約$0.075/1M tokens (input), $0.30/1M tokens (output)
 * - 1商品あたり: 入力500 tokens + 出力100 tokens ≈ $0.00007
 */

import type { Product } from '@/app/tools/editing/types/product';
import type { ProductAuditReport } from '../audit/audit-service';

// ============================================================
// 型定義
// ============================================================

/** 補完対象フィールド */
export type CompletableField = 
  | 'hts_code'
  | 'origin_country'
  | 'material'
  | 'weight_g'
  | 'dimensions'
  | 'condition_description';

/** 補完リクエスト */
export interface FieldCompletionRequest {
  productId: string;
  title: string;
  category?: string;
  existingData: Partial<Product>;
  missingFields: CompletableField[];
}

/** 補完結果 */
export interface FieldCompletionResult {
  productId: string;
  completions: Record<CompletableField, {
    value: string | number | null;
    confidence: number;
    reason: string;
  }>;
  tokensUsed: number;
  costUsd: number;
  processingTimeMs: number;
}

/** バッチ補完結果 */
export interface BatchCompletionResult {
  success: boolean;
  results: FieldCompletionResult[];
  totalTokens: number;
  totalCostUsd: number;
  totalTimeMs: number;
  errors: string[];
}

// ============================================================
// プロンプトテンプレート
// ============================================================

const FIELD_PROMPTS: Record<CompletableField, string> = {
  hts_code: `Determine the US HTS (Harmonized Tariff Schedule) code for this product. 
Return a 6-digit or 10-digit code like "9504.40" or "9504.40.0000" for trading cards.
Provide the most accurate HTS code based on product type.
Only return the code, no explanation.`,

  origin_country: `Determine the country of origin (manufacturing country) for this product.
Return the ISO 3166-1 alpha-2 code (e.g., "JP" for Japan, "CN" for China, "US" for USA).
If the product is typically Japanese (anime, manga, Japanese collectibles), use "JP".
Only return the 2-letter code, no explanation.`,

  material: `Determine the primary material composition of this product.
Examples: "Plastic", "Metal", "Cardstock/Paper", "Cotton", "Leather", "PVC", "ABS Plastic"
Only return the material name, no explanation.`,

  weight_g: `Estimate the TOTAL PACKAGED weight of this product in grams, including packaging materials.
Consider:
1. Product weight (main item)
2. Packaging materials (box, bubble wrap, padding): add 50-100g for small items, 100-300g for medium items
3. Safety margin: add 10% to the total
4. Category-specific weights:
   - Trading cards (single): 10-15g packaged
   - Trading card box (36 packs): 800-1200g packaged
   - Small figures (5-10cm): 100-200g packaged
   - Medium figures (15-30cm): 300-800g packaged
   - Large figures (30cm+): 1000-3000g packaged
   - Plushies (small): 150-300g packaged
   - Books (manga): 200-400g packaged
   - Electronics (small): 300-600g packaged

Return ONLY a number (no units). Example: 450`,

  dimensions: `Estimate the PACKAGED dimensions (Length × Width × Height) in centimeters.
Consider:
1. Product size
2. Packaging box size (add 2-5cm to each dimension for padding)
3. Use standard shipping box sizes when possible

Category-specific dimensions:
- Trading card pack: 10 × 7 × 2 cm
- Trading card box: 25 × 20 × 15 cm
- Small figure box: 20 × 15 × 15 cm
- Medium figure box: 30 × 25 × 20 cm
- Large figure box: 50 × 40 × 30 cm
- Manga book: 20 × 15 × 3 cm
- Plushie (small): 25 × 20 × 15 cm

Return in this exact JSON format:
{
  "length_cm": <number>,
  "width_cm": <number>,
  "height_cm": <number>
}
Only return the JSON, no explanation.`,

  condition_description: `Write a brief condition description for eBay listing.
Examples: "Brand new, sealed", "Used, excellent condition", "Pre-owned, tested working"
Keep it under 50 characters.`,
};

/**
 * 単一フィールド用プロンプトを生成
 */
function buildSingleFieldPrompt(
  field: CompletableField,
  product: FieldCompletionRequest
): string {
  return `Product Title: ${product.title}
Category: ${product.category || 'Unknown'}
${product.existingData.hts_code ? `Existing HTS: ${product.existingData.hts_code}` : ''}
${product.existingData.origin_country ? `Existing Origin: ${product.existingData.origin_country}` : ''}

Task: ${FIELD_PROMPTS[field]}`;
}

/**
 * 複数フィールド用プロンプトを生成
 */
function buildMultiFieldPrompt(product: FieldCompletionRequest): string {
  const fieldInstructions = product.missingFields.map(field => 
    `- ${field}: ${FIELD_PROMPTS[field]}`
  ).join('\n');
  
  return `Product Title: ${product.title}
Category: ${product.category || 'Unknown'}
${product.existingData.hts_code ? `Existing HTS: ${product.existingData.hts_code}` : ''}
${product.existingData.origin_country ? `Existing Origin: ${product.existingData.origin_country}` : ''}
${product.existingData.material ? `Existing Material: ${product.existingData.material}` : ''}

Please determine the following missing data fields:
${fieldInstructions}

Respond in this exact JSON format:
{
${product.missingFields.map(f => `  "${f}": { "value": <value>, "confidence": <0.0-1.0>, "reason": "<brief reason>" }`).join(',\n')}
}`;
}

// ============================================================
// API呼び出し
// ============================================================

/**
 * Gemini 1.5 Flash APIを呼び出し（コスト最小化）
 */
async function callGeminiFlash(
  prompt: string,
  timeoutMs: number = 15000
): Promise<{ content: string; tokensUsed: number }> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,  // 低温度で安定出力
          topP: 0.8,
          maxOutputTokens: 256,  // 出力は短く
        },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const tokensUsed = data.usageMetadata?.totalTokenCount || 0;
  
  return { content, tokensUsed };
}

// ============================================================
// メイン関数
// ============================================================

/**
 * 単一商品の欠落フィールドを補完
 */
export async function completeProductFields(
  request: FieldCompletionRequest
): Promise<FieldCompletionResult> {
  const startTime = Date.now();
  
  if (request.missingFields.length === 0) {
    return {
      productId: request.productId,
      completions: {} as any,
      tokensUsed: 0,
      costUsd: 0,
      processingTimeMs: 0,
    };
  }
  
  try {
    const prompt = buildMultiFieldPrompt(request);
    const { content, tokensUsed } = await callGeminiFlash(prompt);
    
    // JSONパース
    let parsed: any;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('[FieldCompletion] Failed to parse JSON, using fallback:', content);
      parsed = {};
    }
    
    // 結果を構築
    const completions: FieldCompletionResult['completions'] = {} as any;
    
    for (const field of request.missingFields) {
      const fieldData = parsed[field];
      
      // dimensionsフィールドは特別処理（JSONオブジェクト）
      if (field === 'dimensions') {
        // 直接JSONが返ってくる場合
        if (fieldData && typeof fieldData === 'object' && 'length_cm' in fieldData) {
          completions[field] = {
            value: fieldData,
            confidence: 0.8,
            reason: 'AI estimated dimensions',
          };
        } else if (fieldData?.value && typeof fieldData.value === 'object') {
          completions[field] = {
            value: fieldData.value,
            confidence: fieldData.confidence ?? 0.8,
            reason: fieldData.reason ?? 'AI estimated dimensions',
          };
        } else {
          // フォールバック：文字列からJSONを抽出
          try {
            const dimMatch = content.match(/"length_cm"\s*:\s*(\d+)[,}]/i);
            const widthMatch = content.match(/"width_cm"\s*:\s*(\d+)[,}]/i);
            const heightMatch = content.match(/"height_cm"\s*:\s*(\d+)[,}]/i);
            
            if (dimMatch && widthMatch && heightMatch) {
              completions[field] = {
                value: {
                  length_cm: parseInt(dimMatch[1]),
                  width_cm: parseInt(widthMatch[1]),
                  height_cm: parseInt(heightMatch[1]),
                },
                confidence: 0.7,
                reason: 'AI estimated dimensions (fallback)',
              };
            } else {
              completions[field] = {
                value: null,
                confidence: 0,
                reason: 'Failed to parse dimensions',
              };
            }
          } catch {
            completions[field] = {
              value: null,
              confidence: 0,
              reason: 'Failed to parse dimensions',
            };
          }
        }
      } else {
        // 他のフィールドは通常処理
        completions[field] = {
          value: fieldData?.value ?? null,
          confidence: fieldData?.confidence ?? 0.5,
          reason: fieldData?.reason ?? 'AI generated',
        };
      }
    }
    
    // コスト計算（Gemini 1.5 Flash）
    const costUsd = tokensUsed * 0.00000015;  // 概算
    
    return {
      productId: request.productId,
      completions,
      tokensUsed,
      costUsd,
      processingTimeMs: Date.now() - startTime,
    };
    
  } catch (error) {
    console.error('[FieldCompletion] Error:', error);
    
    // エラー時は空の結果を返す
    const completions: FieldCompletionResult['completions'] = {} as any;
    for (const field of request.missingFields) {
      completions[field] = {
        value: null,
        confidence: 0,
        reason: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
    
    return {
      productId: request.productId,
      completions,
      tokensUsed: 0,
      costUsd: 0,
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * 監査レポートから欠落フィールドを抽出
 */
export function extractMissingFieldsFromAudit(
  product: Product,
  auditReport: ProductAuditReport
): CompletableField[] {
  const missing: CompletableField[] = [];
  
  // 監査結果から欠落フィールドを特定
  for (const field of auditReport.aiReviewFields) {
    if (field === 'hts_code' && !product.hts_code) {
      missing.push('hts_code');
    }
    if (field === 'origin_country' && !product.origin_country) {
      missing.push('origin_country');
    }
    if (field === 'material' && !product.material) {
      missing.push('material');
    }
    if (field === 'weight_g' && !product.listing_data?.weight_g) {
      missing.push('weight_g');
    }
  }
  
  // サイズが欠落している場合
  if (!product.listing_data?.length_cm || 
      !product.listing_data?.width_cm || 
      !product.listing_data?.height_cm) {
    missing.push('dimensions');
  }
  
  return missing;
}

/**
 * 複数商品の欠落フィールドを一括補完
 */
export async function completeProductsFields(
  products: Product[],
  auditReports: ProductAuditReport[],
  onProgress?: (completed: number, total: number) => void
): Promise<BatchCompletionResult> {
  const startTime = Date.now();
  const results: FieldCompletionResult[] = [];
  const errors: string[] = [];
  let totalTokens = 0;
  let totalCost = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const auditReport = auditReports.find(r => r.productId === product.id);
    
    if (!auditReport) {
      errors.push(`No audit report found for product ${product.id}`);
      continue;
    }
    
    const missingFields = extractMissingFieldsFromAudit(product, auditReport);
    
    if (missingFields.length === 0) {
      continue;
    }
    
    try {
      const request: FieldCompletionRequest = {
        productId: String(product.id),
        title: product.title || '',
        category: product.category_name || product.category,
        existingData: product,
        missingFields,
      };
      
      const result = await completeProductFields(request);
      results.push(result);
      totalTokens += result.tokensUsed;
      totalCost += result.costUsd;
      
      onProgress?.(i + 1, products.length);
      
      // レートリミット対策（1秒間に10リクエストまで）
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error) {
      errors.push(`Failed to complete fields for product ${product.id}: ${error}`);
    }
  }
  
  return {
    success: errors.length === 0,
    results,
    totalTokens,
    totalCostUsd: totalCost,
    totalTimeMs: Date.now() - startTime,
    errors,
  };
}

/**
 * 補完結果を商品データに適用
 */
export function applyCompletionToProduct(
  product: Product,
  completion: FieldCompletionResult,
  minConfidence: number = 0.7
): Partial<Product> {
  const updates: Partial<Product> = {};
  
  for (const [field, data] of Object.entries(completion.completions)) {
    if (data.value === null || data.confidence < minConfidence) continue;
    
    switch (field as CompletableField) {
      case 'hts_code':
        updates.hts_code = String(data.value);
        break;
      case 'origin_country':
        updates.origin_country = String(data.value);
        break;
      case 'material':
        updates.material = String(data.value);
        break;
      case 'weight_g':
        updates.listing_data = {
          ...product.listing_data,
          weight_g: Number(data.value),
          weight_source: 'ai_estimated',
        };
        break;
      case 'dimensions':
        if (typeof data.value === 'object' && data.value !== null) {
          const dims = data.value as any;
          updates.listing_data = {
            ...product.listing_data,
            length_cm: Number(dims.length_cm),
            width_cm: Number(dims.width_cm),
            height_cm: Number(dims.height_cm),
            dimensions_source: 'ai_estimated',
          };
        }
        break;
    }
  }
  
  // Provenance情報を追加
  if (Object.keys(updates).length > 0) {
    updates.provenance = {
      ...product.provenance,
      ...Object.keys(updates).reduce((acc, key) => ({
        ...acc,
        [key]: {
          source: 'ai_completion',
          model: 'gemini-1.5-flash',
          updatedAt: new Date().toISOString(),
          confidence: completion.completions[key as CompletableField]?.confidence,
        },
      }), {}),
    };
  }
  
  return updates;
}

// ============================================================
// コスト見積もり
// ============================================================

/**
 * 補完コストの見積もり
 */
export function estimateCompletionCost(
  productCount: number,
  averageFieldsPerProduct: number = 2
): { estimatedTokens: number; estimatedCostUsd: number } {
  // 1商品あたり: 入力500 tokens + 出力100 tokens
  const tokensPerProduct = 600 * averageFieldsPerProduct / 2;
  const totalTokens = productCount * tokensPerProduct;
  
  // Gemini 1.5 Flash料金
  const costUsd = totalTokens * 0.00000015;
  
  return {
    estimatedTokens: Math.round(totalTokens),
    estimatedCostUsd: Math.round(costUsd * 10000) / 10000,
  };
}

// ============================================================
// エクスポート
// ============================================================

export default {
  completeProductFields,
  completeProductsFields,
  extractMissingFieldsFromAudit,
  applyCompletionToProduct,
  estimateCompletionCost,
};
