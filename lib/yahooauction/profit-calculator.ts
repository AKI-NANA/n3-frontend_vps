/**
 * Yahoo Auction (ヤフオク) 利益計算モジュール
 * 
 * 機能:
 * - 目標回収率からの必要販売価格逆算
 * - 損益分岐点計算
 * - 価格シミュレーション
 * - 市場相場との比較分析
 * - 利益率ベース計算（V2追加）
 * 
 * 手数料体系（2024年時点）:
 * - LYPプレミアム会員: 8.8%
 * - 通常会員: 10%
 */

import {
  YahooAuctionProfitParams,
  YahooAuctionProfitResult,
  PriceSimulationParams,
  PriceSimulationResult,
  YahooAuctionMemberType,
  YAHOO_AUCTION_FEE_RATES,
  DEFAULT_PACKAGING_COST,
  ProfitRateCalcParams,
  ProfitRateCalcResult,
} from './types';

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 手数料率を取得
 */
export function getFeeRate(memberType: YahooAuctionMemberType): number {
  return YAHOO_AUCTION_FEE_RATES[memberType];
}

/**
 * 手数料を計算
 */
export function calculateFee(sellingPrice: number, memberType: YahooAuctionMemberType): number {
  const feeRate = getFeeRate(memberType);
  return Math.round(sellingPrice * feeRate);
}

/**
 * 手残り現金を計算
 * 手残り = 販売価格 - 手数料 - 送料 - 梱包材費
 */
export function calculateNetProceeds(
  sellingPrice: number,
  memberType: YahooAuctionMemberType,
  shippingCost: number,
  packagingCost: number = DEFAULT_PACKAGING_COST
): number {
  const fee = calculateFee(sellingPrice, memberType);
  return sellingPrice - fee - shippingCost - packagingCost;
}

/**
 * 目標回収額から必要販売価格を逆算
 * 
 * 計算式:
 * 目標手残り = 販売価格 × (1 - 手数料率) - 送料 - 梱包材費
 * 販売価格 = (目標手残り + 送料 + 梱包材費) / (1 - 手数料率)
 */
export function calculateRequiredSellingPrice(
  targetNetProceeds: number,
  memberType: YahooAuctionMemberType,
  shippingCost: number,
  packagingCost: number = DEFAULT_PACKAGING_COST
): number {
  const feeRate = getFeeRate(memberType);
  const requiredPrice = (targetNetProceeds + shippingCost + packagingCost) / (1 - feeRate);
  return Math.ceil(requiredPrice);  // 切り上げ
}

/**
 * 損益分岐点価格を計算（仕入れ価格100%回収に必要な価格）
 */
export function calculateBreakEvenPrice(
  costPrice: number,
  memberType: YahooAuctionMemberType,
  shippingCost: number,
  packagingCost: number = DEFAULT_PACKAGING_COST
): number {
  return calculateRequiredSellingPrice(costPrice, memberType, shippingCost, packagingCost);
}

// ============================================================
// メイン計算関数
// ============================================================

/**
 * ヤフオク利益計算（メイン関数）
 * 
 * 目標回収率から必要販売価格を逆算し、損益を分析する
 * 
 * @example
 * // 11万円で仕入れた商品を30%回収で損切りする場合
 * const result = calculateYahooAuctionProfit({
 *   costPrice: 111000,
 *   targetRecoveryRate: 30,
 *   memberType: 'lyp_premium',
 *   shippingCost: 1650,
 *   marketPrice: 32000
 * });
 * // result.minimumSellingPrice: 38,597円
 * // result.netProceeds: 33,350円
 * // result.lossAmount: 77,650円
 */
export function calculateYahooAuctionProfit(
  params: YahooAuctionProfitParams
): YahooAuctionProfitResult {
  const {
    costPrice,
    targetRecoveryRate,
    memberType,
    shippingCost,
    packagingCost = DEFAULT_PACKAGING_COST,
    marketPrice,
  } = params;

  const feeRate = getFeeRate(memberType);
  const warnings: string[] = [];

  // 目標回収額（仕入れ価格 × 目標回収率）
  const targetNetProceeds = costPrice * (targetRecoveryRate / 100);

  // 必要販売価格（目標回収を達成するために必要な価格）
  const minimumSellingPrice = calculateRequiredSellingPrice(
    targetNetProceeds,
    memberType,
    shippingCost,
    packagingCost
  );

  // 実際の手残り（端数の関係で目標と若干異なる場合がある）
  const fee = calculateFee(minimumSellingPrice, memberType);
  const netProceeds = minimumSellingPrice - fee - shippingCost - packagingCost;

  // 損失額
  const lossAmount = costPrice - netProceeds;

  // 実際の回収率
  const actualRecoveryRate = (netProceeds / costPrice) * 100;

  // 損益分岐点価格
  const breakEvenPrice = calculateBreakEvenPrice(costPrice, memberType, shippingCost, packagingCost);

  // 黒字判定
  const isProfitable = lossAmount <= 0;

  // 警告生成
  if (lossAmount > costPrice * 0.7) {
    warnings.push(`⚠️ 損失が仕入れ価格の70%以上です（¥${lossAmount.toLocaleString()}）`);
  } else if (lossAmount > costPrice * 0.5) {
    warnings.push(`⚠️ 損失が仕入れ価格の50%以上です（¥${lossAmount.toLocaleString()}）`);
  }

  if (targetRecoveryRate < 30) {
    warnings.push(`⚠️ 目標回収率が30%未満です（${targetRecoveryRate}%）`);
  }

  // 市場相場との比較
  let marketComparison: YahooAuctionProfitResult['marketComparison'];
  if (marketPrice && marketPrice > 0) {
    const marketFee = calculateFee(marketPrice, memberType);
    const marketNetProceeds = marketPrice - marketFee - shippingCost - packagingCost;
    const marketRecoveryRate = (marketNetProceeds / costPrice) * 100;
    const isBelowMarket = minimumSellingPrice > marketPrice;

    marketComparison = {
      marketPrice,
      marketNetProceeds,
      marketRecoveryRate,
      isBelowMarket,
    };

    if (isBelowMarket) {
      warnings.push(
        `⚠️ 市場相場¥${marketPrice.toLocaleString()}では目標回収率${targetRecoveryRate}%を達成できません` +
        `（相場での回収率: ${marketRecoveryRate.toFixed(1)}%）`
      );
    }

    if (marketRecoveryRate < 0) {
      warnings.push(`🚨 市場相場では赤字になります（手残り: ¥${marketNetProceeds.toLocaleString()}）`);
    }
  }

  return {
    minimumSellingPrice,
    netProceeds,
    lossAmount,
    breakEvenPrice,
    actualRecoveryRate,
    isProfitable,
    fee,
    feeRate: feeRate * 100,
    warnings,
    marketComparison,
  };
}

/**
 * 価格シミュレーション
 * 
 * 指定した販売価格での損益を計算する
 * 
 * @example
 * const result = simulatePrice({
 *   costPrice: 111000,
 *   sellingPrice: 32000,
 *   memberType: 'lyp_premium',
 *   shippingCost: 1650
 * });
 * // result.netProceeds: 27,034円
 * // result.recoveryRate: 24.4%
 */
export function simulatePrice(params: PriceSimulationParams): PriceSimulationResult {
  const {
    costPrice,
    sellingPrice,
    memberType,
    shippingCost,
    packagingCost = DEFAULT_PACKAGING_COST,
  } = params;

  const fee = calculateFee(sellingPrice, memberType);
  const netProceeds = sellingPrice - fee - shippingCost - packagingCost;
  const profit = netProceeds - costPrice;
  const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const recoveryRate = costPrice > 0 ? (netProceeds / costPrice) * 100 : 0;
  const isProfitable = profit >= 0;

  return {
    sellingPrice,
    fee,
    netProceeds,
    profit,
    profitMargin,
    recoveryRate,
    isProfitable,
  };
}

/**
 * 複数価格帯のシミュレーション
 * 
 * 価格帯ごとの損益を一覧で計算する
 */
export function simulatePriceRange(
  costPrice: number,
  memberType: YahooAuctionMemberType,
  shippingCost: number,
  packagingCost: number = DEFAULT_PACKAGING_COST,
  options: {
    minRate?: number;  // 最小回収率（%）デフォルト: 20
    maxRate?: number;  // 最大回収率（%）デフォルト: 120
    step?: number;     // 刻み（%）デフォルト: 10
  } = {}
): PriceSimulationResult[] {
  const { minRate = 20, maxRate = 120, step = 10 } = options;
  const results: PriceSimulationResult[] = [];

  for (let rate = minRate; rate <= maxRate; rate += step) {
    const targetNetProceeds = costPrice * (rate / 100);
    const sellingPrice = calculateRequiredSellingPrice(
      targetNetProceeds,
      memberType,
      shippingCost,
      packagingCost
    );
    const result = simulatePrice({
      costPrice,
      sellingPrice,
      memberType,
      shippingCost,
      packagingCost,
    });
    results.push(result);
  }

  return results;
}

/**
 * 推奨販売価格を計算
 * 
 * 市場相場、損益分岐点、目標利益率を考慮して推奨価格を算出
 */
export function calculateRecommendedPrice(
  costPrice: number,
  memberType: YahooAuctionMemberType,
  shippingCost: number,
  packagingCost: number = DEFAULT_PACKAGING_COST,
  options: {
    marketPrice?: number;           // 市場相場
    targetProfitMargin?: number;    // 目標利益率（%）デフォルト: 15
    minimumRecoveryRate?: number;   // 最低回収率（%）デフォルト: 50
  } = {}
): {
  recommendedPrice: number;
  strategy: 'profit' | 'break_even' | 'loss_cut' | 'market';
  description: string;
  simulation: PriceSimulationResult;
} {
  const {
    marketPrice,
    targetProfitMargin = 15,
    minimumRecoveryRate = 50,
  } = options;

  // 1. 目標利益率を達成する価格を計算
  // 利益率 = (手残り - 仕入れ) / 販売価格
  // 販売価格 = 仕入れ / (1 - 手数料率 - 利益率) - 送料 - 梱包材費 ... 複雑なので逆算
  const feeRate = getFeeRate(memberType);
  
  // 目標利益価格: 手残り = 仕入れ + (販売価格 × 目標利益率)
  // (1 - feeRate) × 販売価格 - 送料 - 梱包材費 = 仕入れ + 販売価格 × 目標利益率
  // 販売価格 × (1 - feeRate - 目標利益率) = 仕入れ + 送料 + 梱包材費
  // 販売価格 = (仕入れ + 送料 + 梱包材費) / (1 - feeRate - 目標利益率/100)
  const profitTargetPrice = Math.ceil(
    (costPrice + shippingCost + packagingCost) / (1 - feeRate - targetProfitMargin / 100)
  );

  // 2. 損益分岐点価格
  const breakEvenPrice = calculateBreakEvenPrice(costPrice, memberType, shippingCost, packagingCost);

  // 3. 最低回収率での価格
  const lossCutPrice = calculateRequiredSellingPrice(
    costPrice * (minimumRecoveryRate / 100),
    memberType,
    shippingCost,
    packagingCost
  );

  // 戦略決定
  let recommendedPrice: number;
  let strategy: 'profit' | 'break_even' | 'loss_cut' | 'market';
  let description: string;

  if (marketPrice) {
    // 市場相場がある場合
    if (marketPrice >= profitTargetPrice) {
      // 相場が目標利益を上回る → 目標利益価格で出品
      recommendedPrice = profitTargetPrice;
      strategy = 'profit';
      description = `目標利益率${targetProfitMargin}%を達成する価格です`;
    } else if (marketPrice >= breakEvenPrice) {
      // 相場が損益分岐点を上回る → 相場価格で出品
      recommendedPrice = marketPrice;
      strategy = 'market';
      description = `市場相場に合わせた価格です（黒字可能）`;
    } else if (marketPrice >= lossCutPrice) {
      // 相場が最低回収率を上回る → 相場価格で出品（損切り）
      recommendedPrice = marketPrice;
      strategy = 'market';
      description = `市場相場に合わせた価格です（損切り）`;
    } else {
      // 相場が最低回収率を下回る → 損切り価格で出品
      recommendedPrice = lossCutPrice;
      strategy = 'loss_cut';
      description = `最低回収率${minimumRecoveryRate}%を確保する損切り価格です`;
    }
  } else {
    // 市場相場がない場合
    recommendedPrice = profitTargetPrice;
    strategy = 'profit';
    description = `目標利益率${targetProfitMargin}%を達成する価格です`;
  }

  const simulation = simulatePrice({
    costPrice,
    sellingPrice: recommendedPrice,
    memberType,
    shippingCost,
    packagingCost,
  });

  return {
    recommendedPrice,
    strategy,
    description,
    simulation,
  };
}

// ============================================================
// バッチ計算
// ============================================================

/**
 * 複数商品の一括利益計算
 */
export function calculateBatchProfit(
  items: Array<{
    id: number | string;
    costPrice: number;
    shippingCost: number;
    marketPrice?: number;
    packagingCost?: number;
  }>,
  memberType: YahooAuctionMemberType,
  targetRecoveryRate: number
): Array<{
  id: number | string;
  result: YahooAuctionProfitResult;
}> {
  return items.map(item => ({
    id: item.id,
    result: calculateYahooAuctionProfit({
      costPrice: item.costPrice,
      targetRecoveryRate,
      memberType,
      shippingCost: item.shippingCost,
      packagingCost: item.packagingCost,
      marketPrice: item.marketPrice,
    }),
  }));
}

/**
 * 総損益サマリーを計算
 */
export function calculateProfitSummary(
  results: Array<{ result: YahooAuctionProfitResult }>
): {
  totalCostPrice: number;
  totalNetProceeds: number;
  totalLoss: number;
  averageRecoveryRate: number;
  profitableCount: number;
  lossCount: number;
  totalWarnings: number;
} {
  const summary = results.reduce(
    (acc, { result }) => {
      const costPrice = result.netProceeds / (result.actualRecoveryRate / 100);
      acc.totalCostPrice += costPrice;
      acc.totalNetProceeds += result.netProceeds;
      acc.totalLoss += result.lossAmount;
      acc.recoveryRates.push(result.actualRecoveryRate);
      if (result.isProfitable) acc.profitableCount++;
      else acc.lossCount++;
      acc.totalWarnings += result.warnings.length;
      return acc;
    },
    {
      totalCostPrice: 0,
      totalNetProceeds: 0,
      totalLoss: 0,
      recoveryRates: [] as number[],
      profitableCount: 0,
      lossCount: 0,
      totalWarnings: 0,
    }
  );

  const averageRecoveryRate =
    summary.recoveryRates.length > 0
      ? summary.recoveryRates.reduce((a, b) => a + b, 0) / summary.recoveryRates.length
      : 0;

  return {
    totalCostPrice: Math.round(summary.totalCostPrice),
    totalNetProceeds: Math.round(summary.totalNetProceeds),
    totalLoss: Math.round(summary.totalLoss),
    averageRecoveryRate: Math.round(averageRecoveryRate * 10) / 10,
    profitableCount: summary.profitableCount,
    lossCount: summary.lossCount,
    totalWarnings: summary.totalWarnings,
  };
}

// ============================================================
// 利益率ベース計算（V2追加）
// ============================================================

/**
 * 利益率ベースで販売価格を計算
 * 
 * 数式: 販売価格 = (仕入 + 送料 + 梱包費) ÷ (1 - 手数料率 - 利益率)
 * 
 * @example
 * // 仕入れ10,000円、送料800円、梱包150円、利益率15%の場合
 * const result = calculatePriceByProfitRate({
 *   costPrice: 10000,
 *   shippingCost: 800,
 *   packagingCost: 150,
 *   minProfitRate: 15,
 *   memberType: 'lyp_premium',
 * });
 * // result.sellingPrice: 14,375円
 * // result.profitAmount: 2,156円
 * // result.profitRate: 15.0%
 */
export function calculatePriceByProfitRate(params: ProfitRateCalcParams): ProfitRateCalcResult {
  const { costPrice, shippingCost, packagingCost, minProfitRate, memberType } = params;
  
  const feeRate = getFeeRate(memberType);
  const profitRateDecimal = minProfitRate / 100;
  
  // 総コスト
  const totalCost = costPrice + shippingCost + packagingCost;
  
  // 販売価格逆算
  // 利益 = 手残り - 仕入れ
  // 手残り = 販売価格 × (1 - 手数料率) - 送料 - 梱包費
  // 利益率 = 利益 / 販売価格
  // 販売価格 × 利益率 = 販売価格 × (1 - 手数料率) - 送料 - 梱包費 - 仕入れ
  // 販売価格 = (仕入れ + 送料 + 梱包費) / (1 - 手数料率 - 利益率)
  
  const denominator = 1 - feeRate - profitRateDecimal;
  
  if (denominator <= 0) {
    throw new Error(`利益率 ${minProfitRate}% は手数料率 ${(feeRate * 100).toFixed(1)}% と合計で100%を超えるため計算できません`);
  }
  
  const sellingPrice = Math.ceil(totalCost / denominator);
  const fee = Math.round(sellingPrice * feeRate);
  const netProceeds = sellingPrice - fee - shippingCost - packagingCost;
  const profitAmount = netProceeds - costPrice;
  const actualProfitRate = (profitAmount / sellingPrice) * 100;
  
  return {
    sellingPrice,
    profitAmount,
    profitRate: Math.round(actualProfitRate * 100) / 100,
    fee,
    netProceeds,
    breakdown: {
      costPrice,
      shippingCost,
      packagingCost,
      totalCost,
      feeRate: feeRate * 100,
      minProfitRate,
    },
  };
}

/**
 * 販売価格から利益率を検証（ガード条件チェック用）
 */
export function validateProfitRate(
  sellingPrice: number,
  costPrice: number,
  shippingCost: number,
  packagingCost: number,
  memberType: YahooAuctionMemberType,
  minProfitRate: number
): {
  isValid: boolean;
  actualProfitRate: number;
  profitAmount: number;
  message: string;
} {
  const feeRate = getFeeRate(memberType);
  const fee = Math.round(sellingPrice * feeRate);
  const netProceeds = sellingPrice - fee - shippingCost - packagingCost;
  const profitAmount = netProceeds - costPrice;
  const actualProfitRate = (profitAmount / sellingPrice) * 100;
  
  const isValid = actualProfitRate >= minProfitRate;
  
  let message = '';
  if (profitAmount < 0) {
    message = `⚠️ 赤字出品: ¥${Math.abs(profitAmount).toLocaleString()}の損失`;
  } else if (!isValid) {
    message = `⚠️ 利益率不足: ${actualProfitRate.toFixed(1)}% < ${minProfitRate}%`;
  } else {
    message = `✅ OK: 利益率 ${actualProfitRate.toFixed(1)}%`;
  }
  
  return {
    isValid,
    actualProfitRate: Math.round(actualProfitRate * 100) / 100,
    profitAmount,
    message,
  };
}

// ============================================================
// エクスポート
// ============================================================

export default {
  calculateYahooAuctionProfit,
  simulatePrice,
  simulatePriceRange,
  calculateRecommendedPrice,
  calculateBatchProfit,
  calculateProfitSummary,
  getFeeRate,
  calculateFee,
  calculateNetProceeds,
  calculateRequiredSellingPrice,
  calculateBreakEvenPrice,
  // V2追加
  calculatePriceByProfitRate,
  validateProfitRate,
};
