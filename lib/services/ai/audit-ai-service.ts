// lib/services/ai/audit-ai-service.ts
/**
 * 監査AI サービス - Gemini/Claude APIを使用した高精度監査
 * 
 * 【設計原則】
 * - 第1層ルールエンジンで解決できない問題のみAIに送信
 * - 最小限のデータでコスト最適化
 * - JSONパッチ形式で確実な修正提案
 * 
 * 【対応AI】
 * - Gemini Pro（デフォルト・コスト効率）
 * - Claude Sonnet（高精度・フォールバック）
 */

import type { Product } from '@/app/tools/editing/types/product';
import type { 
  AiAuditRequest, 
  AiAuditResponse, 
  AiPatch,
  ProductAuditReport 
} from '../audit/audit-service';
import { extractForAiReview, generateAiPromptData, parseAiResponse } from '../audit/audit-service';

// ============================================================
// 型定義
// ============================================================

export type AiProvider = 'gemini' | 'claude';

export interface AuditAiConfig {
  provider: AiProvider;
  maxProducts: number;  // 1回のリクエストで送信する最大商品数
  minConfidenceThreshold: number;  // 自動適用の最小信頼度
  timeoutMs: number;
}

export interface AuditAiResult {
  success: boolean;
  provider: AiProvider;
  responses: AiAuditResponse[];
  tokensUsed?: number;
  costUsd?: number;
  error?: string;
  processingTimeMs: number;
}

// ============================================================
// 定数
// ============================================================

const DEFAULT_CONFIG: AuditAiConfig = {
  provider: 'gemini',
  maxProducts: 10,
  minConfidenceThreshold: 0.85,
  timeoutMs: 30000,
};

// システムプロンプト
const AUDIT_SYSTEM_PROMPT = `You are an expert e-commerce product data auditor specializing in cross-border trade compliance.

Your task is to review product data and suggest corrections for:
1. HTS (Harmonized Tariff Schedule) codes - US import classification
2. Country of Origin (COO) - Manufacturing origin
3. Material composition - For customs declaration

RULES:
- Only suggest changes when you have HIGH confidence (>0.85)
- HTS codes must be valid US import classification codes
- Country codes must be ISO 3166-1 alpha-2 format (JP, CN, US, etc.)
- Material should be the primary composition material

RESPONSE FORMAT:
Return a JSON array with one object per product:
[
  {
    "id": <product_id>,
    "patches": [
      {
        "field": "hts_code" | "origin_country" | "material",
        "currentValue": <current_value_or_null>,
        "suggestedValue": <your_suggestion>,
        "confidence": 0.0-1.0,
        "reason": "Brief explanation"
      }
    ],
    "auditNote": "Overall assessment of this product"
  }
]

Only include patches for fields that need correction. If a field is correct or you're unsure, don't include it.`;

// ============================================================
// Gemini API呼び出し
// ============================================================

async function callGeminiApi(
  promptData: string,
  config: AuditAiConfig
): Promise<{ content: string; tokensUsed?: number }> {
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
            parts: [
              { text: AUDIT_SYSTEM_PROMPT },
              { text: `\n\nProducts to audit:\n${promptData}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,  // 低温度で一貫性を確保
          topP: 0.8,
          maxOutputTokens: 4096,
        },
      }),
      signal: AbortSignal.timeout(config.timeoutMs),
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  // レスポンスからテキストを抽出
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const tokensUsed = data.usageMetadata?.totalTokenCount;
  
  return { content, tokensUsed };
}

// ============================================================
// Claude API呼び出し
// ============================================================

async function callClaudeApi(
  promptData: string,
  config: AuditAiConfig
): Promise<{ content: string; tokensUsed?: number }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: AUDIT_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Products to audit:\n${promptData}`,
        }
      ],
    }),
    signal: AbortSignal.timeout(config.timeoutMs),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  const content = data.content?.[0]?.text || '';
  const tokensUsed = data.usage?.input_tokens + data.usage?.output_tokens;
  
  return { content, tokensUsed };
}

// ============================================================
// JSONパース（マークダウンコードブロック対応）
// ============================================================

function extractJsonFromResponse(content: string): string {
  // マークダウンコードブロックを除去
  let jsonStr = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim();
  
  // 配列の開始・終了を見つける
  const startIdx = jsonStr.indexOf('[');
  const endIdx = jsonStr.lastIndexOf(']');
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    jsonStr = jsonStr.substring(startIdx, endIdx + 1);
  }
  
  return jsonStr;
}

// ============================================================
// メイン関数：AI監査実行
// ============================================================

/**
 * AI監査を実行
 * @param products 監査対象の商品リスト
 * @param auditReports 第1層ルールエンジンの監査結果
 * @param config 設定（オプション）
 */
export async function runAiAudit(
  products: Product[],
  auditReports: ProductAuditReport[],
  config: Partial<AuditAiConfig> = {}
): Promise<AuditAiResult> {
  const startTime = Date.now();
  const finalConfig: AuditAiConfig = { ...DEFAULT_CONFIG, ...config };
  
  try {
    // 1. AI審査が必要な商品を抽出
    const aiRequests = extractForAiReview(products, auditReports);
    
    if (aiRequests.length === 0) {
      return {
        success: true,
        provider: finalConfig.provider,
        responses: [],
        processingTimeMs: Date.now() - startTime,
      };
    }
    
    // 2. バッチ分割（最大商品数に制限）
    const batches: AiAuditRequest[][] = [];
    for (let i = 0; i < aiRequests.length; i += finalConfig.maxProducts) {
      batches.push(aiRequests.slice(i, i + finalConfig.maxProducts));
    }
    
    const allResponses: AiAuditResponse[] = [];
    let totalTokens = 0;
    
    // 3. バッチごとにAPI呼び出し
    for (const batch of batches) {
      const promptData = generateAiPromptData(batch);
      
      let apiResult: { content: string; tokensUsed?: number };
      
      try {
        if (finalConfig.provider === 'gemini') {
          apiResult = await callGeminiApi(promptData, finalConfig);
        } else {
          apiResult = await callClaudeApi(promptData, finalConfig);
        }
      } catch (primaryError) {
        // フォールバック：別のプロバイダーを試行
        console.warn(`Primary provider ${finalConfig.provider} failed, trying fallback...`, primaryError);
        
        try {
          if (finalConfig.provider === 'gemini') {
            apiResult = await callClaudeApi(promptData, finalConfig);
          } else {
            apiResult = await callGeminiApi(promptData, finalConfig);
          }
        } catch (fallbackError) {
          throw new Error(`Both AI providers failed. Primary: ${primaryError}, Fallback: ${fallbackError}`);
        }
      }
      
      // 4. レスポンスをパース
      const jsonStr = extractJsonFromResponse(apiResult.content);
      const batchResponses = parseAiResponse(jsonStr);
      
      allResponses.push(...batchResponses);
      totalTokens += apiResult.tokensUsed || 0;
    }
    
    // 5. コスト計算（概算）
    const costUsd = finalConfig.provider === 'gemini'
      ? totalTokens * 0.00001  // Gemini: 約$0.01/1K tokens
      : totalTokens * 0.00003;  // Claude: 約$0.03/1K tokens (Sonnet)
    
    return {
      success: true,
      provider: finalConfig.provider,
      responses: allResponses,
      tokensUsed: totalTokens,
      costUsd,
      processingTimeMs: Date.now() - startTime,
    };
    
  } catch (error) {
    return {
      success: false,
      provider: finalConfig.provider,
      responses: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * 単一商品のAI監査
 */
export async function runSingleProductAiAudit(
  product: Product,
  auditReport: ProductAuditReport,
  config: Partial<AuditAiConfig> = {}
): Promise<AuditAiResult> {
  return runAiAudit([product], [auditReport], config);
}

/**
 * AI提案を商品に適用する更新データを生成
 */
export function generateUpdatesFromAiPatches(
  patches: AiPatch[],
  minConfidence: number = 0.85
): Partial<Product> {
  const updates: Partial<Product> = {};
  
  for (const patch of patches) {
    if (!patch.selected && patch.confidence < minConfidence) continue;
    if (patch.suggestedValue === null) continue;
    
    switch (patch.field) {
      case 'hts_code':
        updates.hts_code = String(patch.suggestedValue);
        break;
      case 'origin_country':
        updates.origin_country = String(patch.suggestedValue);
        break;
      case 'material':
        updates.material = String(patch.suggestedValue);
        break;
    }
  }
  
  return updates;
}

export default {
  runAiAudit,
  runSingleProductAiAudit,
  generateUpdatesFromAiPatches,
};
