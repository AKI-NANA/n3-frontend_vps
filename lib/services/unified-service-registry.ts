// lib/services/unified-service-registry.ts
/**
 * N3 統合サービスレジストリ
 * 
 * 【目的】
 * - 未稼働機能の発掘と再起動
 * - 既存サービスの統合
 * - 重量計算マージン、スケジュール設定の有効化
 * 
 * 【発掘された機能】
 * 1. shipping-delay-predictor.ts - 出荷遅延予測（未使用）
 * 2. auction-cycle-manager.ts - オークションサイクル管理
 * 3. health-score-service.ts - ヘルススコア
 * 4. profit-calculator.ts - 利益計算（部分使用）
 * 5. image-processor-service.ts - P1/P2/P3ズーム（未統合）
 */

import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 重量計算マージン設定
// ============================================================

export interface WeightMarginConfig {
  percentageMargin: number;    // パーセントマージン（デフォルト: 10%）
  packingMaterialG: number;    // 梱包材重量（デフォルト: 200g）
  minimumWeightG: number;      // 最小重量（デフォルト: 100g）
  maximumWeightG: number;      // 最大重量（デフォルト: 30000g）
}

export const DEFAULT_WEIGHT_MARGIN: WeightMarginConfig = {
  percentageMargin: 0.10,      // 10%
  packingMaterialG: 200,       // 200g
  minimumWeightG: 100,         // 100g
  maximumWeightG: 30000,       // 30kg
};

/**
 * 安全な発送重量を計算
 * 「想定重量の10% + 梱包材200g」を自動加算
 */
export function calculateSafeShippingWeight(
  estimatedWeightG: number,
  config: Partial<WeightMarginConfig> = {}
): number {
  const cfg = { ...DEFAULT_WEIGHT_MARGIN, ...config };
  
  // 最小重量チェック
  if (estimatedWeightG < cfg.minimumWeightG) {
    estimatedWeightG = cfg.minimumWeightG;
  }
  
  // マージンを追加
  const withMargin = estimatedWeightG * (1 + cfg.percentageMargin);
  const withPacking = withMargin + cfg.packingMaterialG;
  
  // 最大重量チェック
  const finalWeight = Math.min(withPacking, cfg.maximumWeightG);
  
  return Math.ceil(finalWeight);
}

// ============================================================
// 出品スケジュール設定
// ============================================================

export interface ListingScheduleConfig {
  enabled: boolean;
  times: string[];             // HH:MM形式の時刻リスト
  timezone: string;            // タイムゾーン（デフォルト: Asia/Tokyo）
  maxPerBatch: number;         // 1バッチあたりの最大出品数
  intervalMinutes: number;     // バッチ間隔（分）
  daysOfWeek: number[];        // 曜日（0=日, 1=月, ...）
  avoidWeekends: boolean;      // 週末を避ける
  avoidHolidays: boolean;      // 祝日を避ける
}

export const DEFAULT_LISTING_SCHEDULE: ListingScheduleConfig = {
  enabled: true,
  times: ['10:00', '14:00', '19:00'],  // 1日3回
  timezone: 'Asia/Tokyo',
  maxPerBatch: 30,
  intervalMinutes: 10,
  daysOfWeek: [1, 2, 3, 4, 5],  // 平日のみ
  avoidWeekends: true,
  avoidHolidays: true,
};

/**
 * 次の出品スケジュール時刻を計算
 */
export function getNextScheduledTime(
  config: Partial<ListingScheduleConfig> = {}
): Date | null {
  const cfg = { ...DEFAULT_LISTING_SCHEDULE, ...config };
  
  if (!cfg.enabled || cfg.times.length === 0) {
    return null;
  }
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // 今日の残り時刻をチェック
  for (const time of cfg.times.sort()) {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduleTime = new Date(todayStart);
    scheduleTime.setHours(hours, minutes, 0, 0);
    
    if (scheduleTime > now) {
      // 曜日チェック
      if (cfg.daysOfWeek.includes(scheduleTime.getDay())) {
        return scheduleTime;
      }
    }
  }
  
  // 翌日以降の最初の時刻
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(tomorrow);
    checkDate.setDate(checkDate.getDate() + i);
    
    if (cfg.daysOfWeek.includes(checkDate.getDay())) {
      const [hours, minutes] = cfg.times[0].split(':').map(Number);
      checkDate.setHours(hours, minutes, 0, 0);
      return checkDate;
    }
  }
  
  return null;
}

// ============================================================
// サービス統合：監査 + VeRO + 利益計算
// ============================================================

import { auditProduct, type ProductAuditReport } from './audit/audit-service';
import { checkVeroPatentRisk, type VeroCheckResult } from './audit/vero-patent-service';
import { ProfitCalculator, type OrderCalculationResult } from './profit-calculator';

export interface UnifiedAuditResult {
  productId: string | number;
  auditReport: ProductAuditReport;
  veroCheck: VeroCheckResult;
  profitAnalysis: OrderCalculationResult | null;
  safeShippingWeightG: number;
  overallStatus: 'ready' | 'warning' | 'block' | 'error';
  blockReasons: string[];
  warnings: string[];
  recommendations: string[];
}

/**
 * 統合監査を実行
 * - 監査サービス
 * - VeRO/パテントチェック
 * - 利益計算
 * - 重量マージン計算
 */
export function runUnifiedAudit(product: Product): UnifiedAuditResult {
  const blockReasons: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // 1. 基本監査
  const auditReport = auditProduct(product);
  
  // 2. VeRO/パテントチェック
  const veroCheck = checkVeroPatentRisk(product);
  
  // 3. 利益計算
  let profitAnalysis: OrderCalculationResult | null = null;
  if (product.price_jpy || product.cost_price) {
    profitAnalysis = ProfitCalculator.calculate({
      marketplace: 'ebay',
      sale_price: product.ddp_price_usd ? product.ddp_price_usd * 150 : product.price_jpy || 0,
      items: [{
        sku: product.sku || '',
        name: product.title || '',
        quantity: 1,
        sale_price: product.price_jpy || 0,
      }],
      estimated_cost_price: product.cost_price || product.price_jpy,
      estimated_shipping_cost: product.shipping_cost_jpy || 1500,
    });
  }
  
  // 4. 安全な発送重量を計算
  const estimatedWeight = product.listing_data?.weight_g || product.weight_g || 500;
  const safeShippingWeightG = calculateSafeShippingWeight(estimatedWeight);
  
  // 5. 総合ステータス判定
  let overallStatus: UnifiedAuditResult['overallStatus'] = 'ready';
  
  // VeROブロック
  if (veroCheck.riskLevel === 'block') {
    overallStatus = 'block';
    blockReasons.push(`VeROブランド検出: ${veroCheck.detectedBrand}`);
  }
  
  // VeRO高リスク / パテントトロール
  if (veroCheck.riskLevel === 'high' || veroCheck.patentTrollRisk) {
    if (overallStatus !== 'block') overallStatus = 'warning';
    warnings.push(...veroCheck.reasons);
  }
  
  // 監査エラー
  if (auditReport.overallSeverity === 'error') {
    if (overallStatus === 'ready') overallStatus = 'warning';
    warnings.push(`監査スコア: ${auditReport.score}/100`);
  }
  
  // 赤字リスク
  if (profitAnalysis?.is_negative_profit_risk) {
    if (overallStatus === 'ready') overallStatus = 'warning';
    warnings.push(profitAnalysis.risk_reason || '赤字リスクあり');
  }
  
  // 推奨事項
  if (auditReport.autoFixSuggestions.length > 0) {
    recommendations.push(`${auditReport.autoFixSuggestions.length}件の自動修正が利用可能`);
  }
  
  if (auditReport.needsAiReview) {
    recommendations.push('AI審査を推奨');
  }
  
  if (veroCheck.requiresManualReview) {
    recommendations.push('手動レビューを推奨');
  }
  
  return {
    productId: product.id,
    auditReport,
    veroCheck,
    profitAnalysis,
    safeShippingWeightG,
    overallStatus,
    blockReasons,
    warnings,
    recommendations,
  };
}

/**
 * 複数商品の統合監査
 */
export function batchUnifiedAudit(products: Product[]): Map<string | number, UnifiedAuditResult> {
  const results = new Map<string | number, UnifiedAuditResult>();
  
  for (const product of products) {
    results.set(product.id, runUnifiedAudit(product));
  }
  
  return results;
}

// ============================================================
// サービス発見・ヘルスチェック
// ============================================================

export interface ServiceHealthStatus {
  serviceName: string;
  status: 'active' | 'inactive' | 'error';
  lastUsed?: string;
  description: string;
}

/**
 * 利用可能なサービス一覧を取得
 */
export function getAvailableServices(): ServiceHealthStatus[] {
  return [
    {
      serviceName: 'audit-service',
      status: 'active',
      description: '商品監査サービス（HTS/原産国/素材）',
    },
    {
      serviceName: 'vero-patent-service',
      status: 'active',
      description: 'VeRO/パテントトロールチェック',
    },
    {
      serviceName: 'profit-calculator',
      status: 'active',
      description: '利益計算エンジン',
    },
    {
      serviceName: 'field-completion-service',
      status: 'active',
      description: 'AI欠落フィールド補完',
    },
    {
      serviceName: 'bundle-variation-service',
      status: 'active',
      description: 'セット品/バリエーション/オークション',
    },
    {
      serviceName: 'bulk-listing-service',
      status: 'active',
      description: '一括出品（レートリミット対応）',
    },
    {
      serviceName: 'job-queue-service',
      status: 'active',
      description: '非同期ジョブキュー',
    },
    {
      serviceName: 'yahoo-auction-sync',
      status: 'active',
      description: 'ヤフオク在庫同期',
    },
    {
      serviceName: 'bundle-image-generator',
      status: 'active',
      description: 'セット品画像生成',
    },
    {
      serviceName: 'image-optimization',
      status: 'active',
      description: '画像最適化（サムネイル生成）',
    },
    {
      serviceName: 'shipping-delay-predictor',
      status: 'inactive',
      description: '出荷遅延予測（要統合）',
    },
    {
      serviceName: 'image-processor-service',
      status: 'inactive',
      description: 'P1/P2/P3ズーム処理（要統合）',
    },
    {
      serviceName: 'n8n-integration',
      status: 'active',
      description: 'n8nワークフロー連携',
    },
  ];
}

// ============================================================
// エクスポート
// ============================================================

export default {
  // 重量計算
  calculateSafeShippingWeight,
  DEFAULT_WEIGHT_MARGIN,
  // スケジュール
  getNextScheduledTime,
  DEFAULT_LISTING_SCHEDULE,
  // 統合監査
  runUnifiedAudit,
  batchUnifiedAudit,
  // サービス発見
  getAvailableServices,
};
