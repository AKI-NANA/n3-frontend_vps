// lib/ai/asset-pilot.ts
// ========================================
// 💰 N3 Empire OS V8.2.1-Autonomous
// Asset Pilot v3.0 - 歪み検知型・自律投資知能
// ========================================

import { SupabaseClient } from '@supabase/supabase-js';

// ========================================
// 型定義
// ========================================

/** 歪み検知シグナル */
export interface DistortionSignal {
  /** シグナルID */
  id: string;
  /** シグナルタイプ */
  type: DistortionType;
  /** 対象商品/カテゴリ */
  target: {
    productId?: string;
    sku?: string;
    category?: string;
    brand?: string;
  };
  /** 歪み強度（0-100） */
  intensity: number;
  /** 検知時刻 */
  detectedAt: Date;
  /** シグナルソース */
  source: SignalSource;
  /** 詳細データ */
  data: Record<string, unknown>;
  /** 累積時間（時間） */
  accumulatedHours: number;
  /** 信頼度 */
  confidence: number;
}

/** 歪みタイプ */
export type DistortionType =
  | 'price_gap'           // 価格乖離（仕入値と販売価格の歪み）
  | 'supply_shortage'     // 供給不足
  | 'demand_surge'        // 需要急増
  | 'eol_approaching'     // 生産終了接近
  | 'reprint_dip'         // 再販後の価格下落
  | 'grade_scarcity'      // 鑑定品希少化
  | 'market_inefficiency' // 市場非効率
  | 'arbitrage_window';   // 裁定機会

/** シグナルソース */
export type SignalSource =
  | 'price_tracker'       // 価格追跡
  | 'inventory_monitor'   // 在庫監視
  | 'eol_tracker'         // 廃盤追跡
  | 'pop_report'          // 鑑定レポート
  | 'news_scanner'        // ニューススキャン
  | 'social_sentiment'    // SNS分析
  | 'competitor_watch';   // 競合監視

/** アセットスコア計算入力 */
export interface AssetScoreInput {
  /** 期待販売数（E_sales） */
  expectedSales: number;
  /** 単価利益（P_unit） */
  unitProfit: number;
  /** 販売確率（P_st: sell-through rate） */
  sellThroughRate: number;
  /** 保有日数予測（D_holding） */
  holdingDays: number;
  /** 資本ロック率（R_capital_lock） */
  capitalLockRate: number;
  /** 競争度（S_competition） */
  competitionScore: number;
}

/** アセットスコア結果 */
export interface AssetScoreResult {
  /** 総合スコア */
  score: number;
  /** ランク */
  rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  /** 推奨アクション */
  action: 'strong_buy' | 'buy' | 'hold' | 'reduce' | 'sell' | 'avoid';
  /** スコア内訳 */
  breakdown: {
    profitPotential: number;
    riskAdjustment: number;
    liquidityFactor: number;
  };
  /** 推奨仕入れ数 */
  recommendedQuantity: number;
  /** 推奨仕入れ価格上限 */
  maxBuyPrice: number;
  /** リスク警告 */
  warnings: string[];
}

/** EOL（生産終了）情報 */
export interface EOLInfo {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  /** 生産終了日（確定/予測） */
  eolDate: Date | null;
  /** 確定フラグ */
  isConfirmed: boolean;
  /** 供給減衰速度（%/月） */
  supplyDecayRate: number;
  /** 高騰確定予測日 */
  predictedSurgeDate: Date | null;
  /** 現在の市場価格 */
  currentPrice: number;
  /** 予測高騰価格 */
  predictedPeakPrice: number;
  /** 予測ROI */
  predictedROI: number;
}

/** Pop Report（鑑定レポート） */
export interface PopReportData {
  cardName: string;
  setName: string;
  gradingCompany: 'PSA' | 'BGS' | 'CGC';
  grade: string;
  /** 現在の鑑定枚数 */
  population: number;
  /** 前月比変化 */
  monthlyChange: number;
  /** 年間増加率 */
  yearlyGrowthRate: number;
  /** 現在の平均価格 */
  avgPrice: number;
  /** 価格との相関係数 */
  priceCorrelation: number;
  /** 希少度スコア（0-100） */
  scarcityScore: number;
}

/** 再販サイクル情報 */
export interface ReprintCycle {
  productLine: string;
  brand: string;
  /** 平均再販サイクル（月） */
  avgCycleMonths: number;
  /** 最終再販日 */
  lastReprintDate: Date;
  /** 次回再販予測日 */
  nextPredictedDate: Date;
  /** 再販後の価格下落率 */
  avgPriceDropPercent: number;
  /** 回復期間（月） */
  recoveryMonths: number;
  /** 買い場フラグ */
  isDipBuyZone: boolean;
  /** 推奨買値（再販後） */
  recommendedBuyPrice: number;
}

/** ポートフォリオリスク */
export interface PortfolioRisk {
  /** ジャンル集中度 */
  categoryConcentration: Record<string, number>;
  /** メーカー集中度 */
  brandConcentration: Record<string, number>;
  /** 最大集中度（警告閾値: 30%） */
  maxConcentration: number;
  /** 集中リスク警告 */
  concentrationWarnings: string[];
  /** 流動性リスク */
  liquidityRisk: number;
  /** 総リスクスコア */
  totalRiskScore: number;
}

// ========================================
// 定数
// ========================================

/** アセットスコアのランク閾値 */
const ASSET_SCORE_THRESHOLDS = {
  S: 8.0,   // 8.0以上: 強力な買い
  A: 5.0,   // 5.0-8.0: 買い
  B: 3.0,   // 3.0-5.0: ホールド
  C: 1.5,   // 1.5-3.0: 削減検討
  D: 0.5,   // 0.5-1.5: 売却
  F: 0      // 0.5未満: 回避
};

/** デフォルトのリスクパラメータ */
const DEFAULT_RISK_PARAMS = {
  maxCategoryConcentration: 0.30,  // 30%
  maxBrandConcentration: 0.20,     // 20%
  minLiquidityScore: 0.5,
  maxHoldingDays: 90
};

// ========================================
// Asset Pilot メインクラス
// ========================================

export class AssetPilot {
  private supabase: SupabaseClient;
  private signals: DistortionSignal[] = [];
  
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }
  
  // ========================================
  // 歪み検知（Distortion Scanner）
  // ========================================
  
  /**
   * 72時間の累積シグナルから歪みを検知
   */
  async scanDistortions(options?: {
    categories?: string[];
    minIntensity?: number;
    lookbackHours?: number;
  }): Promise<DistortionSignal[]> {
    const lookback = options?.lookbackHours || 72;
    const minIntensity = options?.minIntensity || 30;
    const since = new Date(Date.now() - lookback * 60 * 60 * 1000);
    
    const signals: DistortionSignal[] = [];
    
    // 1. 価格乖離検知
    const priceGaps = await this.detectPriceGaps(since, options?.categories);
    signals.push(...priceGaps);
    
    // 2. 供給不足検知
    const supplyShortages = await this.detectSupplyShortages(since, options?.categories);
    signals.push(...supplyShortages);
    
    // 3. EOL接近検知
    const eolApproaching = await this.detectEOLApproaching();
    signals.push(...eolApproaching);
    
    // 4. 再販Dip検知
    const reprintDips = await this.detectReprintDips();
    signals.push(...reprintDips);
    
    // フィルタリング・集計
    const aggregated = this.aggregateSignals(signals, lookback);
    
    return aggregated.filter(s => s.intensity >= minIntensity);
  }
  
  /** 価格乖離を検知 */
  private async detectPriceGaps(since: Date, categories?: string[]): Promise<DistortionSignal[]> {
    // 仕入値と販売価格の乖離を検索
    const query = this.supabase
      .from('products_master')
      .select('id, sku, title, source_price, selling_price, category, brand')
      .gt('selling_price', 0)
      .gt('source_price', 0);
    
    if (categories?.length) {
      query.in('category', categories);
    }
    
    const { data, error } = await query;
    if (error || !data) return [];
    
    return data
      .map(p => {
        const profitMargin = (p.selling_price - p.source_price) / p.source_price * 100;
        if (profitMargin < 30) return null; // 30%未満は除外
        
        return {
          id: `price_gap_${p.id}`,
          type: 'price_gap' as DistortionType,
          target: { productId: p.id, sku: p.sku, category: p.category, brand: p.brand },
          intensity: Math.min(profitMargin, 100),
          detectedAt: new Date(),
          source: 'price_tracker' as SignalSource,
          data: { sourcePrice: p.source_price, sellingPrice: p.selling_price, margin: profitMargin },
          accumulatedHours: 0,
          confidence: 0.8
        };
      })
      .filter((s): s is DistortionSignal => s !== null);
  }
  
  /** 供給不足を検知 */
  private async detectSupplyShortages(since: Date, categories?: string[]): Promise<DistortionSignal[]> {
    // 在庫監視テーブルから供給減少を検出
    const { data, error } = await this.supabase
      .from('commerce.inventory_monitoring_config')
      .select('*, products_master(*)')
      .eq('is_active', true)
      .eq('last_status', 'out_of_stock');
    
    if (error || !data) return [];
    
    return data.map(item => ({
      id: `supply_shortage_${item.product_id}`,
      type: 'supply_shortage' as DistortionType,
      target: { productId: item.product_id },
      intensity: 70, // 在庫切れは高強度
      detectedAt: new Date(),
      source: 'inventory_monitor' as SignalSource,
      data: { sourceUrl: item.source_url, lastCheckAt: item.last_check_at },
      accumulatedHours: 0,
      confidence: 0.9
    }));
  }
  
  /** EOL接近を検知 */
  private async detectEOLApproaching(): Promise<DistortionSignal[]> {
    // EOLテーブルから3ヶ月以内の廃盤を検出
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    
    const { data, error } = await this.supabase
      .from('commerce.eol_tracking')
      .select('*')
      .lte('eol_date', threeMonthsLater.toISOString())
      .eq('is_confirmed', true);
    
    if (error || !data) return [];
    
    return data.map(eol => {
      const daysUntilEOL = Math.ceil((new Date(eol.eol_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const intensity = Math.max(0, 100 - daysUntilEOL); // EOLが近いほど高強度
      
      return {
        id: `eol_${eol.product_id}`,
        type: 'eol_approaching' as DistortionType,
        target: { productId: eol.product_id, brand: eol.brand, category: eol.category },
        intensity,
        detectedAt: new Date(),
        source: 'eol_tracker' as SignalSource,
        data: { eolDate: eol.eol_date, daysUntilEOL, supplyDecayRate: eol.supply_decay_rate },
        accumulatedHours: 0,
        confidence: 0.95
      };
    });
  }
  
  /** 再販Dipを検知 */
  private async detectReprintDips(): Promise<DistortionSignal[]> {
    // 再販後30日以内で価格が下落している商品を検出
    const { data, error } = await this.supabase
      .from('commerce.reprint_cycles')
      .select('*')
      .eq('is_dip_buy_zone', true);
    
    if (error || !data) return [];
    
    return data.map(reprint => ({
      id: `reprint_dip_${reprint.id}`,
      type: 'reprint_dip' as DistortionType,
      target: { brand: reprint.brand, category: reprint.product_line },
      intensity: Math.min(reprint.avg_price_drop_percent, 100),
      detectedAt: new Date(),
      source: 'price_tracker' as SignalSource,
      data: { 
        lastReprintDate: reprint.last_reprint_date, 
        avgPriceDrop: reprint.avg_price_drop_percent,
        recommendedBuyPrice: reprint.recommended_buy_price 
      },
      accumulatedHours: 0,
      confidence: 0.85
    }));
  }
  
  /** シグナル集計 */
  private aggregateSignals(signals: DistortionSignal[], lookbackHours: number): DistortionSignal[] {
    const grouped = new Map<string, DistortionSignal[]>();
    
    // 同一ターゲットのシグナルをグループ化
    signals.forEach(s => {
      const key = `${s.type}_${s.target.productId || s.target.category || s.target.brand}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(s);
    });
    
    // グループごとに集計
    return Array.from(grouped.entries()).map(([key, sigs]) => {
      const latest = sigs.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())[0];
      const avgIntensity = sigs.reduce((sum, s) => sum + s.intensity, 0) / sigs.length;
      const avgConfidence = sigs.reduce((sum, s) => sum + s.confidence, 0) / sigs.length;
      
      return {
        ...latest,
        intensity: avgIntensity,
        confidence: avgConfidence,
        accumulatedHours: lookbackHours,
        data: { ...latest.data, signalCount: sigs.length }
      };
    });
  }
  
  // ========================================
  // アセットスコア計算（Asset Score v3.0）
  // ========================================
  
  /**
   * アセットスコアを計算
   * AssetScore = (E_sales × P_unit × P_st) / (D_holding × R_capital_lock × S_competition)
   */
  calculateAssetScore(input: AssetScoreInput): AssetScoreResult {
    const {
      expectedSales,
      unitProfit,
      sellThroughRate,
      holdingDays,
      capitalLockRate,
      competitionScore
    } = input;
    
    // 分子: 期待収益
    const numerator = expectedSales * unitProfit * sellThroughRate;
    
    // 分母: リスク調整係数
    const denominator = Math.max(1, holdingDays) * Math.max(0.1, capitalLockRate) * Math.max(0.1, competitionScore);
    
    // スコア計算
    const rawScore = numerator / denominator;
    const score = Math.round(rawScore * 100) / 100;
    
    // ランク判定
    const rank = this.determineRank(score);
    
    // 推奨アクション
    const action = this.determineAction(rank);
    
    // 内訳計算
    const breakdown = {
      profitPotential: expectedSales * unitProfit,
      riskAdjustment: holdingDays * capitalLockRate,
      liquidityFactor: sellThroughRate / competitionScore
    };
    
    // 推奨仕入れ数（スコアとリスクに基づく）
    const recommendedQuantity = this.calculateRecommendedQuantity(score, capitalLockRate);
    
    // 推奨仕入れ価格上限
    const maxBuyPrice = unitProfit > 0 ? unitProfit * 0.7 : 0; // 目標利益の70%まで
    
    // リスク警告
    const warnings = this.generateWarnings(input, score);
    
    return {
      score,
      rank,
      action,
      breakdown,
      recommendedQuantity,
      maxBuyPrice,
      warnings
    };
  }
  
  private determineRank(score: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= ASSET_SCORE_THRESHOLDS.S) return 'S';
    if (score >= ASSET_SCORE_THRESHOLDS.A) return 'A';
    if (score >= ASSET_SCORE_THRESHOLDS.B) return 'B';
    if (score >= ASSET_SCORE_THRESHOLDS.C) return 'C';
    if (score >= ASSET_SCORE_THRESHOLDS.D) return 'D';
    return 'F';
  }
  
  private determineAction(rank: string): 'strong_buy' | 'buy' | 'hold' | 'reduce' | 'sell' | 'avoid' {
    switch (rank) {
      case 'S': return 'strong_buy';
      case 'A': return 'buy';
      case 'B': return 'hold';
      case 'C': return 'reduce';
      case 'D': return 'sell';
      default: return 'avoid';
    }
  }
  
  private calculateRecommendedQuantity(score: number, capitalLockRate: number): number {
    if (score < ASSET_SCORE_THRESHOLDS.B) return 0;
    
    // 基本数量（スコアに応じて1-10）
    const baseQty = Math.min(10, Math.max(1, Math.floor(score)));
    
    // 資本ロック率で調整
    const adjustedQty = Math.floor(baseQty * (1 - capitalLockRate));
    
    return Math.max(1, adjustedQty);
  }
  
  private generateWarnings(input: AssetScoreInput, score: number): string[] {
    const warnings: string[] = [];
    
    if (input.holdingDays > DEFAULT_RISK_PARAMS.maxHoldingDays) {
      warnings.push(`保有日数が長期化（${input.holdingDays}日）。キャッシュ回転率に注意。`);
    }
    
    if (input.capitalLockRate > 0.5) {
      warnings.push(`資本ロック率が高い（${(input.capitalLockRate * 100).toFixed(0)}%）。流動性リスクあり。`);
    }
    
    if (input.competitionScore > 0.8) {
      warnings.push(`競争が激しい市場。価格競争による利益圧縮の可能性。`);
    }
    
    if (input.sellThroughRate < 0.3) {
      warnings.push(`販売確率が低い（${(input.sellThroughRate * 100).toFixed(0)}%）。在庫滞留リスク。`);
    }
    
    return warnings;
  }
  
  // ========================================
  // EOLトラッカー
  // ========================================
  
  /**
   * 生産終了情報を取得し、高騰確定日を予測
   */
  async getEOLPredictions(options?: {
    brands?: string[];
    categories?: string[];
    minPredictedROI?: number;
  }): Promise<EOLInfo[]> {
    let query = this.supabase
      .from('commerce.eol_tracking')
      .select('*')
      .eq('is_confirmed', true)
      .order('eol_date', { ascending: true });
    
    if (options?.brands?.length) {
      query = query.in('brand', options.brands);
    }
    
    if (options?.categories?.length) {
      query = query.in('category', options.categories);
    }
    
    const { data, error } = await query;
    if (error || !data) return [];
    
    return data
      .map(eol => {
        // 高騰確定日の予測（EOL後、供給減衰により需要超過になる日）
        const daysToSurge = this.predictDaysToSurge(eol.supply_decay_rate);
        const predictedSurgeDate = new Date(eol.eol_date);
        predictedSurgeDate.setDate(predictedSurgeDate.getDate() + daysToSurge);
        
        // 予測高騰価格
        const predictedPeakPrice = eol.current_price * (1 + eol.supply_decay_rate / 100 * 12);
        
        // 予測ROI
        const predictedROI = ((predictedPeakPrice - eol.current_price) / eol.current_price) * 100;
        
        return {
          productId: eol.product_id,
          productName: eol.product_name,
          brand: eol.brand,
          category: eol.category,
          eolDate: new Date(eol.eol_date),
          isConfirmed: eol.is_confirmed,
          supplyDecayRate: eol.supply_decay_rate,
          predictedSurgeDate,
          currentPrice: eol.current_price,
          predictedPeakPrice,
          predictedROI
        };
      })
      .filter(eol => !options?.minPredictedROI || eol.predictedROI >= options.minPredictedROI);
  }
  
  private predictDaysToSurge(supplyDecayRate: number): number {
    // 供給が50%減少するまでの日数を計算
    // 月間減衰率から日数を逆算
    const monthsTo50Percent = Math.log(0.5) / Math.log(1 - supplyDecayRate / 100);
    return Math.ceil(monthsTo50Percent * 30);
  }
  
  // ========================================
  // Pop Report Monitor（鑑定品用）
  // ========================================
  
  /**
   * 鑑定レポートを分析し、希少度と価格相関を計算
   */
  async analyzePopReport(options?: {
    gradingCompany?: 'PSA' | 'BGS' | 'CGC';
    minScarcityScore?: number;
  }): Promise<PopReportData[]> {
    let query = this.supabase
      .from('commerce.pop_reports')
      .select('*')
      .order('scarcity_score', { ascending: false });
    
    if (options?.gradingCompany) {
      query = query.eq('grading_company', options.gradingCompany);
    }
    
    const { data, error } = await query;
    if (error || !data) return [];
    
    return data
      .map(pop => ({
        cardName: pop.card_name,
        setName: pop.set_name,
        gradingCompany: pop.grading_company,
        grade: pop.grade,
        population: pop.population,
        monthlyChange: pop.monthly_change,
        yearlyGrowthRate: pop.yearly_growth_rate,
        avgPrice: pop.avg_price,
        priceCorrelation: pop.price_correlation,
        scarcityScore: pop.scarcity_score
      }))
      .filter(pop => !options?.minScarcityScore || pop.scarcityScore >= options.minScarcityScore);
  }
  
  // ========================================
  // Reprint Cycle Guard
  // ========================================
  
  /**
   * 再販サイクルを分析し、買い場を特定
   */
  async findReprintDips(options?: {
    brands?: string[];
    maxDipPercent?: number;
  }): Promise<ReprintCycle[]> {
    const { data, error } = await this.supabase
      .from('commerce.reprint_cycles')
      .select('*')
      .eq('is_dip_buy_zone', true)
      .order('avg_price_drop_percent', { ascending: false });
    
    if (error || !data) return [];
    
    return data
      .filter(r => !options?.brands?.length || options.brands.includes(r.brand))
      .filter(r => !options?.maxDipPercent || r.avg_price_drop_percent <= options.maxDipPercent)
      .map(r => ({
        productLine: r.product_line,
        brand: r.brand,
        avgCycleMonths: r.avg_cycle_months,
        lastReprintDate: new Date(r.last_reprint_date),
        nextPredictedDate: new Date(r.next_predicted_date),
        avgPriceDropPercent: r.avg_price_drop_percent,
        recoveryMonths: r.recovery_months,
        isDipBuyZone: r.is_dip_buy_zone,
        recommendedBuyPrice: r.recommended_buy_price
      }));
  }
  
  // ========================================
  // ポートフォリオリスク管理
  // ========================================
  
  /**
   * ポートフォリオのリスクを分析
   */
  async analyzePortfolioRisk(tenantId: string): Promise<PortfolioRisk> {
    // 在庫データを取得
    const { data: inventory, error } = await this.supabase
      .from('inventory_master')
      .select('*, products_master(category, brand)')
      .eq('tenant_id', tenantId)
      .gt('quantity', 0);
    
    if (error || !inventory) {
      return {
        categoryConcentration: {},
        brandConcentration: {},
        maxConcentration: 0,
        concentrationWarnings: [],
        liquidityRisk: 0,
        totalRiskScore: 0
      };
    }
    
    // 総在庫金額
    const totalValue = inventory.reduce((sum, item) => sum + (item.value || 0), 0);
    
    // カテゴリ別集中度
    const categoryConcentration: Record<string, number> = {};
    inventory.forEach(item => {
      const category = item.products_master?.category || 'unknown';
      categoryConcentration[category] = (categoryConcentration[category] || 0) + (item.value || 0);
    });
    Object.keys(categoryConcentration).forEach(k => {
      categoryConcentration[k] = categoryConcentration[k] / totalValue;
    });
    
    // メーカー別集中度
    const brandConcentration: Record<string, number> = {};
    inventory.forEach(item => {
      const brand = item.products_master?.brand || 'unknown';
      brandConcentration[brand] = (brandConcentration[brand] || 0) + (item.value || 0);
    });
    Object.keys(brandConcentration).forEach(k => {
      brandConcentration[k] = brandConcentration[k] / totalValue;
    });
    
    // 最大集中度
    const maxCategoryConc = Math.max(...Object.values(categoryConcentration), 0);
    const maxBrandConc = Math.max(...Object.values(brandConcentration), 0);
    const maxConcentration = Math.max(maxCategoryConc, maxBrandConc);
    
    // 警告生成
    const warnings: string[] = [];
    Object.entries(categoryConcentration).forEach(([cat, conc]) => {
      if (conc > DEFAULT_RISK_PARAMS.maxCategoryConcentration) {
        warnings.push(`カテゴリ「${cat}」の集中度が${(conc * 100).toFixed(1)}%（閾値: ${DEFAULT_RISK_PARAMS.maxCategoryConcentration * 100}%）`);
      }
    });
    Object.entries(brandConcentration).forEach(([brand, conc]) => {
      if (conc > DEFAULT_RISK_PARAMS.maxBrandConcentration) {
        warnings.push(`ブランド「${brand}」の集中度が${(conc * 100).toFixed(1)}%（閾値: ${DEFAULT_RISK_PARAMS.maxBrandConcentration * 100}%）`);
      }
    });
    
    // 流動性リスク（長期在庫の割合）
    const longTermItems = inventory.filter(item => {
      const days = item.days_in_stock || 0;
      return days > DEFAULT_RISK_PARAMS.maxHoldingDays;
    });
    const liquidityRisk = longTermItems.length / inventory.length;
    
    // 総合リスクスコア
    const totalRiskScore = (maxConcentration * 0.4 + liquidityRisk * 0.6) * 100;
    
    return {
      categoryConcentration,
      brandConcentration,
      maxConcentration,
      concentrationWarnings: warnings,
      liquidityRisk,
      totalRiskScore
    };
  }
  
  // ========================================
  // AI判断証跡記録
  // ========================================
  
  /**
   * 投資判断をAI判断証跡として記録
   */
  async recordInvestmentDecision(
    tenantId: string,
    decisionType: 'buy' | 'hold' | 'sell',
    targetProduct: { id: string; name: string },
    assetScore: AssetScoreResult,
    distortionSignals: DistortionSignal[],
    executionId: string
  ): Promise<void> {
    await this.supabase.from('core.ai_decision_traces').insert({
      tenant_id: tenantId,
      decision_type: `investment_${decisionType}`,
      decision_context: {
        module: 'asset_pilot',
        version: '3.0',
        signals: distortionSignals.map(s => ({ type: s.type, intensity: s.intensity }))
      },
      input_data: {
        product: targetProduct,
        assetScore: assetScore.score,
        rank: assetScore.rank
      },
      input_summary: `${targetProduct.name} - ${assetScore.rank}ランク（スコア: ${assetScore.score}）`,
      ai_model: 'asset_pilot_v3',
      ai_confidence_score: Math.min(1, assetScore.score / 10),
      final_decision: assetScore.action,
      decision_reasoning: `AssetScore=${assetScore.score}, 推奨=${assetScore.action}, 警告=${assetScore.warnings.join('; ')}`,
      was_executed: decisionType !== 'hold',
      execution_id: executionId
    });
  }
}

// ========================================
// エクスポート
// ========================================

export function createAssetPilot(supabase: SupabaseClient): AssetPilot {
  return new AssetPilot(supabase);
}

export default {
  AssetPilot,
  createAssetPilot,
  ASSET_SCORE_THRESHOLDS,
  DEFAULT_RISK_PARAMS
};
