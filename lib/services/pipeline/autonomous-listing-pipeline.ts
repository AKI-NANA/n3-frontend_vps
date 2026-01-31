// lib/services/pipeline/autonomous-listing-pipeline.ts
/**
 * 自律出品パイプライン
 * 
 * 【フロー】
 * 1. リサーチデータから「出品」を選択
 * 2. AIタイトル英語化
 * 3. SM（ヤフオク）自動マッチング
 * 4. データ欠落箇所のAI補填
 * 5. VeRO/パテントチェック
 * 6. 統合監査（利益計算含む）
 * 7. 出品（またはスケジュール予約）
 */

import type { Product } from '@/app/tools/editing/types/product';
import { runUnifiedAudit, calculateSafeShippingWeight, getNextScheduledTime } from '../unified-service-registry';
import { completeProductFields, extractMissingFieldsFromAudit, type CompletableField } from '../ai/field-completion-service';
import { checkVeroPatentRisk, aiVeroPatentCheck } from '../audit/vero-patent-service';
import { auditProduct } from '../audit/audit-service';

// ============================================================
// 型定義
// ============================================================

export type PipelineStage = 
  | 'initialized'
  | 'title_translation'
  | 'sm_matching'
  | 'ai_completion'
  | 'vero_check'
  | 'unified_audit'
  | 'pricing'
  | 'scheduling'
  | 'completed'
  | 'manual_review'
  | 'blocked'
  | 'error';

export interface PipelineContext {
  productId: string | number;
  product: Product;
  stage: PipelineStage;
  progress: number;
  logs: PipelineLog[];
  errors: string[];
  warnings: string[];
  startedAt: string;
  completedAt?: string;
  result?: PipelineResult;
}

export interface PipelineResult {
  listingScheduled: boolean;
  scheduledAt?: string;
  requiresManualReview: boolean;
  blocked: boolean;
  blockReason?: string;
}

export interface PipelineLog {
  timestamp: string;
  stage: PipelineStage;
  message: string;
  data?: any;
}

export interface PipelineOptions {
  autoSchedule: boolean;
  skipAiCompletion: boolean;
  skipVeroCheck: boolean;
  strictVeroMode: boolean;
  targetAccount: 'MJT' | 'GREEN';
  notifyOnComplete: boolean;
  dryRun: boolean;
}

export const DEFAULT_PIPELINE_OPTIONS: PipelineOptions = {
  autoSchedule: true,
  skipAiCompletion: false,
  skipVeroCheck: false,
  strictVeroMode: false,
  targetAccount: 'MJT',
  notifyOnComplete: true,
  dryRun: false,
};

// ============================================================
// ログヘルパー
// ============================================================

function addLog(context: PipelineContext, message: string, data?: any): void {
  context.logs.push({
    timestamp: new Date().toISOString(),
    stage: context.stage,
    message,
    data,
  });
  console.log(`[Pipeline:${context.productId}] [${context.stage}] ${message}`);
}

// ============================================================
// パイプラインステップ実装
// ============================================================

async function translateTitle(context: PipelineContext): Promise<void> {
  context.stage = 'title_translation';
  context.progress = 10;
  
  if (context.product.english_title || context.product.title_en) {
    addLog(context, 'English title exists, skipping');
    return;
  }
  
  const japaneseTitle = context.product.title || '';
  if (!japaneseTitle) {
    context.errors.push('No title to translate');
    return;
  }
  
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: japaneseTitle, targetLang: 'en', optimize: true }),
    });
    
    const result = await response.json();
    if (result.success && result.translatedText) {
      context.product.english_title = result.translatedText;
      addLog(context, `Translated: ${result.translatedText}`);
    } else {
      context.warnings.push('Translation failed');
    }
  } catch (error) {
    context.warnings.push('Translation error');
    addLog(context, 'Translation error', error);
  }
}

async function matchSmSource(context: PipelineContext): Promise<void> {
  context.stage = 'sm_matching';
  context.progress = 20;
  
  if (context.product.yahoo_auction_url || context.product.sm_source_url) {
    addLog(context, 'SM source exists');
    return;
  }
  
  try {
    const response = await fetch('/api/sm/auto-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: context.product.title,
        category: context.product.category_name || context.product.category,
        priceRange: {
          min: (context.product.price_jpy || 0) * 0.3,
          max: (context.product.price_jpy || 0) * 1.5,
        },
      }),
    });
    
    const result = await response.json();
    if (result.success && result.matches?.length > 0) {
      const bestMatch = result.matches[0];
      context.product.yahoo_auction_url = bestMatch.url;
      addLog(context, `SM matched: ${bestMatch.url}`);
    } else {
      context.warnings.push('No SM source found');
    }
  } catch (error) {
    context.warnings.push('SM matching error');
    addLog(context, 'SM error', error);
  }
}

async function completeDataWithAi(context: PipelineContext, options: PipelineOptions): Promise<void> {
  context.stage = 'ai_completion';
  context.progress = 35;
  
  if (options.skipAiCompletion) {
    addLog(context, 'AI completion skipped');
    return;
  }
  
  const auditReport = auditProduct(context.product);
  const missingFields = extractMissingFieldsFromAudit(context.product, auditReport);
  
  if (missingFields.length === 0) {
    addLog(context, 'No missing fields');
    return;
  }
  
  addLog(context, `Completing: ${missingFields.join(', ')}`);
  
  try {
    const completionResult = await completeProductFields({
      productId: String(context.product.id),
      title: context.product.title || '',
      category: context.product.category_name || context.product.category,
      existingData: context.product,
      missingFields: missingFields as CompletableField[],
    });
    
    for (const [field, data] of Object.entries(completionResult.completions)) {
      if (data.value !== null && data.confidence >= 0.7) {
        switch (field) {
          case 'hts_code':
            context.product.hts_code = String(data.value);
            addLog(context, `Completed ${field}: ${data.value}`);
            break;
          case 'origin_country':
            context.product.origin_country = String(data.value);
            addLog(context, `Completed ${field}: ${data.value}`);
            break;
          case 'material':
            context.product.material = String(data.value);
            addLog(context, `Completed ${field}: ${data.value}`);
            break;
          case 'weight_g':
            context.product.listing_data = {
              ...context.product.listing_data,
              weight_g: Number(data.value),
              weight_source: 'ai_estimated',
            };
            addLog(context, `AI推定重量: ${data.value}g (信頼度: ${(data.confidence * 100).toFixed(0)}%)`);
            break;
          case 'dimensions':
            if (typeof data.value === 'object' && data.value !== null) {
              const dims = data.value as any;
              context.product.listing_data = {
                ...context.product.listing_data,
                length_cm: Number(dims.length_cm),
                width_cm: Number(dims.width_cm),
                height_cm: Number(dims.height_cm),
                dimensions_source: 'ai_estimated',
              };
              addLog(context, `AI推定サイズ: ${dims.length_cm}×${dims.width_cm}×${dims.height_cm}cm`);
            }
            break;
        }
      }
    }
  } catch (error) {
    context.warnings.push('AI completion error');
    addLog(context, 'AI error', error);
  }
}

async function runVeroCheck(context: PipelineContext, options: PipelineOptions): Promise<boolean> {
  context.stage = 'vero_check';
  context.progress = 50;
  
  if (options.skipVeroCheck) {
    addLog(context, 'VeRO check skipped');
    return true;
  }
  
  const veroResult = checkVeroPatentRisk(context.product, { strictMode: options.strictVeroMode });
  addLog(context, `VeRO risk: ${veroResult.riskLevel}`, veroResult.reasons);
  
  if (veroResult.riskLevel === 'block') {
    context.stage = 'blocked';
    context.result = {
      listingScheduled: false,
      requiresManualReview: false,
      blocked: true,
      blockReason: veroResult.reasons.join('; '),
    };
    addLog(context, `BLOCKED: ${veroResult.detectedBrand}`);
    return false;
  }
  
  if (veroResult.requiresManualReview) {
    const aiCheck = await aiVeroPatentCheck(context.product);
    if (aiCheck?.aiRisk) {
      addLog(context, `AI VeRO: ${aiCheck.aiReason}`);
      veroResult.reasons.push(aiCheck.aiReason);
    }
    
    context.stage = 'manual_review';
    context.result = {
      listingScheduled: false,
      requiresManualReview: true,
      blocked: false,
    };
    context.warnings.push(...veroResult.reasons);
    addLog(context, 'Manual review required');
    return false;
  }
  
  if (veroResult.riskLevel === 'medium') {
    context.warnings.push(...veroResult.reasons);
  }
  
  return true;
}

async function runAudit(context: PipelineContext): Promise<boolean> {
  context.stage = 'unified_audit';
  context.progress = 65;
  
  const auditResult = runUnifiedAudit(context.product);
  addLog(context, `Audit score: ${auditResult.auditReport.score}/100`);
  addLog(context, `Status: ${auditResult.overallStatus}`);
  
  context.product.listing_data = {
    ...context.product.listing_data,
    weight_g: auditResult.safeShippingWeightG,
  };
  addLog(context, `Safe weight: ${auditResult.safeShippingWeightG}g`);
  
  if (auditResult.profitAnalysis) {
    addLog(context, `Profit margin: ${(auditResult.profitAnalysis.profit_margin * 100).toFixed(1)}%`);
    if (auditResult.profitAnalysis.is_negative_profit_risk) {
      context.warnings.push(auditResult.profitAnalysis.risk_reason || '赤字リスク');
    }
  }
  
  if (auditResult.overallStatus === 'block') {
    context.stage = 'blocked';
    context.result = {
      listingScheduled: false,
      requiresManualReview: false,
      blocked: true,
      blockReason: auditResult.blockReasons.join('; '),
    };
    return false;
  }
  
  context.warnings.push(...auditResult.warnings);
  return true;
}

async function calculatePricing(context: PipelineContext): Promise<void> {
  context.stage = 'pricing';
  context.progress = 80;
  
  if (!context.product.ddp_price_usd) {
    try {
      const response = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: context.product.id,
          costPriceJpy: context.product.cost_price || context.product.price_jpy,
          weightG: context.product.listing_data?.weight_g,
          htsCode: context.product.hts_code,
          originCountry: context.product.origin_country,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        context.product.ddp_price_usd = result.ddpPriceUsd;
        context.product.profit_margin = result.profitMargin;
        addLog(context, `DDP price: $${result.ddpPriceUsd}`);
      }
    } catch (error) {
      context.warnings.push('Pricing error');
      addLog(context, 'Pricing error', error);
    }
  }
}

async function scheduleListing(context: PipelineContext, options: PipelineOptions): Promise<void> {
  context.stage = 'scheduling';
  context.progress = 90;
  
  if (options.dryRun) {
    addLog(context, 'Dry run - skipping');
    context.result = { listingScheduled: false, requiresManualReview: false, blocked: false };
    return;
  }
  
  if (!options.autoSchedule) {
    addLog(context, 'Auto-schedule disabled');
    context.result = { listingScheduled: false, requiresManualReview: false, blocked: false };
    return;
  }
  
  const nextSchedule = getNextScheduledTime();
  if (!nextSchedule) {
    addLog(context, 'No schedule time');
    context.result = { listingScheduled: false, requiresManualReview: false, blocked: false };
    return;
  }
  
  try {
    const response = await fetch('/api/listing/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: context.product.id,
        scheduledAt: nextSchedule.toISOString(),
        account: options.targetAccount,
        product: context.product,
      }),
    });
    
    const result = await response.json();
    if (result.success) {
      context.result = {
        listingScheduled: true,
        scheduledAt: nextSchedule.toISOString(),
        requiresManualReview: false,
        blocked: false,
      };
      addLog(context, `Scheduled: ${nextSchedule.toISOString()}`);
    } else {
      context.warnings.push('Scheduling failed');
      context.result = { listingScheduled: false, requiresManualReview: false, blocked: false };
    }
  } catch (error) {
    context.warnings.push('Scheduling error');
    addLog(context, 'Scheduling error', error);
    context.result = { listingScheduled: false, requiresManualReview: false, blocked: false };
  }
}

// ============================================================
// メインパイプライン実行
// ============================================================

/**
 * 単一商品の自律パイプラインを実行
 */
export async function runAutonomousPipeline(
  product: Product,
  options: Partial<PipelineOptions> = {}
): Promise<PipelineContext> {
  const opts = { ...DEFAULT_PIPELINE_OPTIONS, ...options };
  
  const context: PipelineContext = {
    productId: product.id,
    product: { ...product },
    stage: 'initialized',
    progress: 0,
    logs: [],
    errors: [],
    warnings: [],
    startedAt: new Date().toISOString(),
  };
  
  addLog(context, `Pipeline started for product ${product.id}`);
  
  try {
    // Step 1: タイトル翻訳
    await translateTitle(context);
    if (context.stage === 'error') return context;
    
    // Step 2: SM マッチング
    await matchSmSource(context);
    if (context.stage === 'error') return context;
    
    // Step 3: AI補完
    await completeDataWithAi(context, opts);
    if (context.stage === 'error') return context;
    
    // Step 4: VeRO チェック
    const veroOk = await runVeroCheck(context, opts);
    if (!veroOk) {
      context.completedAt = new Date().toISOString();
      context.progress = 100;
      return context;
    }
    
    // Step 5: 統合監査
    const auditOk = await runAudit(context);
    if (!auditOk) {
      context.completedAt = new Date().toISOString();
      context.progress = 100;
      return context;
    }
    
    // Step 6: 価格計算
    await calculatePricing(context);
    if (context.stage === 'error') return context;
    
    // Step 7: スケジュール
    await scheduleListing(context, opts);
    
    // 完了
    context.stage = 'completed';
    context.progress = 100;
    context.completedAt = new Date().toISOString();
    addLog(context, 'Pipeline completed successfully');
    
  } catch (error) {
    context.stage = 'error';
    context.errors.push(error instanceof Error ? error.message : 'Unknown error');
    context.completedAt = new Date().toISOString();
    addLog(context, 'Pipeline error', error);
  }
  
  // 通知
  if (opts.notifyOnComplete) {
    await notifyPipelineResult(context);
  }
  
  return context;
}

/**
 * 複数商品のバッチパイプライン実行
 */
export async function runBatchPipeline(
  products: Product[],
  options: Partial<PipelineOptions> = {},
  onProgress?: (completed: number, total: number, context: PipelineContext) => void
): Promise<PipelineContext[]> {
  const results: PipelineContext[] = [];
  
  for (let i = 0; i < products.length; i++) {
    const context = await runAutonomousPipeline(products[i], options);
    results.push(context);
    onProgress?.(i + 1, products.length, context);
    
    // レートリミット対策
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * パイプライン結果のサマリーを生成
 */
export function summarizePipelineResults(contexts: PipelineContext[]): {
  total: number;
  completed: number;
  scheduled: number;
  manualReview: number;
  blocked: number;
  errors: number;
  totalWarnings: number;
} {
  return {
    total: contexts.length,
    completed: contexts.filter(c => c.stage === 'completed').length,
    scheduled: contexts.filter(c => c.result?.listingScheduled).length,
    manualReview: contexts.filter(c => c.result?.requiresManualReview).length,
    blocked: contexts.filter(c => c.result?.blocked).length,
    errors: contexts.filter(c => c.stage === 'error').length,
    totalWarnings: contexts.reduce((sum, c) => sum + c.warnings.length, 0),
  };
}

/**
 * ChatWork通知
 */
async function notifyPipelineResult(context: PipelineContext): Promise<void> {
  const chatworkToken = process.env.CHATWORK_API_TOKEN;
  const chatworkRoomId = process.env.CHATWORK_ROOM_ID;
  
  if (!chatworkToken || !chatworkRoomId) return;
  
  let status = '✅ 完了';
  if (context.stage === 'blocked') status = '🚫 ブロック';
  else if (context.stage === 'manual_review') status = '⚠️ 要確認';
  else if (context.stage === 'error') status = '❌ エラー';
  
  const message = `[info][title]自律パイプライン ${status}[/title]
商品ID: ${context.productId}
ステージ: ${context.stage}
${context.result?.listingScheduled ? `予約: ${context.result.scheduledAt}` : ''}
${context.warnings.length > 0 ? `警告: ${context.warnings.length}件` : ''}
${context.errors.length > 0 ? `エラー: ${context.errors.join(', ')}` : ''}[/info]`;
  
  try {
    await fetch(`https://api.chatwork.com/v2/rooms/${chatworkRoomId}/messages`, {
      method: 'POST',
      headers: {
        'X-ChatWorkToken': chatworkToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `body=${encodeURIComponent(message)}`,
    });
  } catch (error) {
    console.error('[Pipeline] ChatWork notification failed:', error);
  }
}

// ============================================================
// エクスポート
// ============================================================

export default {
  runAutonomousPipeline,
  runBatchPipeline,
  summarizePipelineResults,
  DEFAULT_PIPELINE_OPTIONS,
};
