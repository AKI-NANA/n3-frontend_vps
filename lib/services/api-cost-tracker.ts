// lib/services/api-cost-tracker.ts
/**
 * APIコスト追跡サービス
 * 
 * 🔥 機能:
 * - API呼び出しごとの推定コスト計算
 * - セッション/日次のコスト集計
 * - コンソール＆DBへのログ出力
 */

// ============================================================
// API料金定義（2024年1月時点）
// ============================================================

export const API_PRICING = {
  // Gemini 1.5 Flash
  GEMINI_FLASH: {
    name: 'Gemini 1.5 Flash',
    inputPerToken: 0.000075 / 1000,   // $0.075/1M tokens
    outputPerToken: 0.0003 / 1000,     // $0.30/1M tokens
    estimatedOutputRatio: 0.3,         // 出力は入力の約30%
  },
  
  // Gemini 1.5 Pro
  GEMINI_PRO: {
    name: 'Gemini 1.5 Pro',
    inputPerToken: 0.00125 / 1000,     // $1.25/1M tokens
    outputPerToken: 0.005 / 1000,      // $5.00/1M tokens
    estimatedOutputRatio: 0.3,
  },
  
  // Google Translate
  GOOGLE_TRANSLATE: {
    name: 'Google Translate',
    perCharacter: 0.00002,             // $20/1M characters
  },
  
  // SellerMirror（固定料金）
  SELLERMIRROR: {
    name: 'SellerMirror',
    perRequest: 0.01,                  // 推定: $0.01/request
  },
  
  // eBay API（無料、参考値）
  EBAY_API: {
    name: 'eBay API',
    perRequest: 0,
  },
} as const;

// ============================================================
// コスト追跡クラス
// ============================================================

export interface ApiCallLog {
  timestamp: Date;
  apiType: string;
  inputTokens?: number;
  inputCharacters?: number;
  estimatedCost: number;
  productId?: number;
  sku?: string;
  metadata?: Record<string, any>;
}

class ApiCostTracker {
  private logs: ApiCallLog[] = [];
  private sessionStart: Date;
  
  constructor() {
    this.sessionStart = new Date();
  }
  
  /**
   * Gemini API呼び出しを記録
   */
  trackGeminiCall(
    inputTokens: number,
    productId?: number,
    sku?: string,
    model: 'GEMINI_FLASH' | 'GEMINI_PRO' = 'GEMINI_FLASH',
    metadata?: Record<string, any>
  ): number {
    const pricing = API_PRICING[model];
    const estimatedOutputTokens = inputTokens * pricing.estimatedOutputRatio;
    const cost = (inputTokens * pricing.inputPerToken) + (estimatedOutputTokens * pricing.outputPerToken);
    
    this.addLog({
      timestamp: new Date(),
      apiType: pricing.name,
      inputTokens,
      estimatedCost: cost,
      productId,
      sku,
      metadata,
    });
    
    console.log(`💰 [API Cost] ${pricing.name}: ~$${cost.toFixed(4)} (入力: ${inputTokens}トークン)`);
    
    return cost;
  }
  
  /**
   * Google翻訳API呼び出しを記録
   */
  trackTranslateCall(
    characters: number,
    productId?: number,
    sku?: string
  ): number {
    const cost = characters * API_PRICING.GOOGLE_TRANSLATE.perCharacter;
    
    this.addLog({
      timestamp: new Date(),
      apiType: API_PRICING.GOOGLE_TRANSLATE.name,
      inputCharacters: characters,
      estimatedCost: cost,
      productId,
      sku,
    });
    
    console.log(`💰 [API Cost] ${API_PRICING.GOOGLE_TRANSLATE.name}: ~$${cost.toFixed(4)} (${characters}文字)`);
    
    return cost;
  }
  
  /**
   * SellerMirror API呼び出しを記録
   */
  trackSellerMirrorCall(
    productId?: number,
    sku?: string
  ): number {
    const cost = API_PRICING.SELLERMIRROR.perRequest;
    
    this.addLog({
      timestamp: new Date(),
      apiType: API_PRICING.SELLERMIRROR.name,
      estimatedCost: cost,
      productId,
      sku,
    });
    
    console.log(`💰 [API Cost] ${API_PRICING.SELLERMIRROR.name}: ~$${cost.toFixed(4)}`);
    
    return cost;
  }
  
  /**
   * 汎用API呼び出しを記録
   */
  trackGenericCall(
    apiType: string,
    estimatedCost: number,
    productId?: number,
    sku?: string,
    metadata?: Record<string, any>
  ): number {
    this.addLog({
      timestamp: new Date(),
      apiType,
      estimatedCost,
      productId,
      sku,
      metadata,
    });
    
    console.log(`💰 [API Cost] ${apiType}: ~$${estimatedCost.toFixed(4)}`);
    
    return estimatedCost;
  }
  
  /**
   * ログを追加
   */
  private addLog(log: ApiCallLog): void {
    this.logs.push(log);
  }
  
  /**
   * セッションの総コストを取得
   */
  getSessionTotal(): number {
    return this.logs.reduce((sum, log) => sum + log.estimatedCost, 0);
  }
  
  /**
   * API種類別のコストを取得
   */
  getCostByApiType(): Record<string, { calls: number; cost: number }> {
    const result: Record<string, { calls: number; cost: number }> = {};
    
    for (const log of this.logs) {
      if (!result[log.apiType]) {
        result[log.apiType] = { calls: 0, cost: 0 };
      }
      result[log.apiType].calls++;
      result[log.apiType].cost += log.estimatedCost;
    }
    
    return result;
  }
  
  /**
   * セッションサマリーを取得
   */
  getSessionSummary(): {
    sessionStart: Date;
    totalCalls: number;
    totalCost: number;
    byApiType: Record<string, { calls: number; cost: number }>;
    durationMinutes: number;
  } {
    const now = new Date();
    const durationMs = now.getTime() - this.sessionStart.getTime();
    
    return {
      sessionStart: this.sessionStart,
      totalCalls: this.logs.length,
      totalCost: this.getSessionTotal(),
      byApiType: this.getCostByApiType(),
      durationMinutes: Math.round(durationMs / 60000),
    };
  }
  
  /**
   * ログをクリア（新しいセッション開始）
   */
  reset(): void {
    this.logs = [];
    this.sessionStart = new Date();
  }
  
  /**
   * 全ログを取得
   */
  getLogs(): ApiCallLog[] {
    return [...this.logs];
  }
  
  /**
   * サマリーをコンソールに出力
   */
  printSummary(): void {
    const summary = this.getSessionSummary();
    
    console.log(`\n========================================`);
    console.log(`📊 APIコストサマリー`);
    console.log(`========================================`);
    console.log(`開始時刻: ${summary.sessionStart.toISOString()}`);
    console.log(`経過時間: ${summary.durationMinutes}分`);
    console.log(`総呼び出し: ${summary.totalCalls}回`);
    console.log(`総コスト: $${summary.totalCost.toFixed(4)}`);
    console.log(`----------------------------------------`);
    console.log(`API種類別:`);
    for (const [apiType, data] of Object.entries(summary.byApiType)) {
      console.log(`  ${apiType}: ${data.calls}回 / $${data.cost.toFixed(4)}`);
    }
    console.log(`========================================\n`);
  }
}

// シングルトンインスタンス
export const apiCostTracker = new ApiCostTracker();

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 推定トークン数を計算（日本語テキスト用）
 * 日本語は1文字あたり約2-3トークン
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  
  // 日本語文字をカウント
  const japaneseChars = (text.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g) || []).length;
  const otherChars = text.length - japaneseChars;
  
  // 日本語: 1文字 ≈ 2.5トークン、英語: 4文字 ≈ 1トークン
  return Math.ceil((japaneseChars * 2.5) + (otherChars / 4));
}

/**
 * Gemini呼び出しの事前コスト見積もり
 */
export function estimateGeminiCost(
  inputText: string,
  model: 'GEMINI_FLASH' | 'GEMINI_PRO' = 'GEMINI_FLASH'
): { tokens: number; cost: number } {
  const tokens = estimateTokens(inputText);
  const pricing = API_PRICING[model];
  const estimatedOutputTokens = tokens * pricing.estimatedOutputRatio;
  const cost = (tokens * pricing.inputPerToken) + (estimatedOutputTokens * pricing.outputPerToken);
  
  return { tokens, cost };
}

/**
 * バッチ処理の総コスト見積もり
 */
export function estimateBatchCost(
  productCount: number,
  operations: {
    translate?: boolean;
    scout?: boolean;
    geminiHts?: boolean;
    geminiWeight?: boolean;
    geminiCategory?: boolean;
  }
): { breakdown: Record<string, number>; total: number } {
  const breakdown: Record<string, number> = {};
  
  if (operations.translate) {
    // 平均100文字/商品として
    breakdown['Google Translate'] = productCount * 100 * API_PRICING.GOOGLE_TRANSLATE.perCharacter;
  }
  
  if (operations.scout) {
    breakdown['SellerMirror'] = productCount * API_PRICING.SELLERMIRROR.perRequest;
  }
  
  if (operations.geminiHts) {
    // HTS推定: 約500トークン/商品
    const tokens = 500;
    const pricing = API_PRICING.GEMINI_FLASH;
    breakdown['Gemini (HTS)'] = productCount * ((tokens * pricing.inputPerToken) + (tokens * pricing.estimatedOutputRatio * pricing.outputPerToken));
  }
  
  if (operations.geminiWeight) {
    // 重量推定: 約400トークン/商品
    const tokens = 400;
    const pricing = API_PRICING.GEMINI_FLASH;
    breakdown['Gemini (Weight)'] = productCount * ((tokens * pricing.inputPerToken) + (tokens * pricing.estimatedOutputRatio * pricing.outputPerToken));
  }
  
  if (operations.geminiCategory) {
    // カテゴリ分析: 約600トークン/商品
    const tokens = 600;
    const pricing = API_PRICING.GEMINI_FLASH;
    breakdown['Gemini (Category)'] = productCount * ((tokens * pricing.inputPerToken) + (tokens * pricing.estimatedOutputRatio * pricing.outputPerToken));
  }
  
  const total = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
  
  return { breakdown, total };
}

export default apiCostTracker;
