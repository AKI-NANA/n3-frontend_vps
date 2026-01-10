/**
 * 多販路統一利益計算サービス
 * lib/marketplace/unified-pricing-service.ts
 * 
 * 全マーケットプレイスに対して統一的な利益計算を提供
 */

import { createClient } from '@/lib/supabase/client';
import type { 
  MarketplaceId, 
  PricingInput, 
  PricingResult,
  MultiMarketplacePricingResponse 
} from './multi-marketplace-types';
import { 
  MARKETPLACE_CONFIGS, 
  DEFAULT_EXCHANGE_RATES,
  getMarketplaceConfig,
  PRIORITY_MARKETPLACES
} from './marketplace-configs';

// =====================================================
// 為替レート取得
// =====================================================

interface ExchangeRateCache {
  rates: Record<string, number>;
  fetchedAt: number;
}

let exchangeRateCache: ExchangeRateCache | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1時間

/**
 * 為替レートを取得（キャッシュ付き）
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  // キャッシュが有効な場合はそれを返す
  if (exchangeRateCache && Date.now() - exchangeRateCache.fetchedAt < CACHE_TTL) {
    return exchangeRateCache.rates;
  }
  
  try {
    const supabase = createClient();
    
    // exchange_ratesテーブルから取得
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('currency_from, currency_to, safe_rate')
      .eq('currency_from', 'JPY');
    
    if (error) throw error;
    
    const rates: Record<string, number> = { JPY: 1 };
    
    if (data && data.length > 0) {
      data.forEach((row: any) => {
        // JPY → 各通貨のレート（1円あたり何現地通貨か）
        // 例: JPY → USD = 0.0067 (1円 = 0.0067ドル)
        // 逆算: 1ドル = 150円
        if (row.safe_rate > 0) {
          rates[row.currency_to] = 1 / row.safe_rate;
        }
      });
    }
    
    // 不足している通貨はデフォルトで補完
    Object.entries(DEFAULT_EXCHANGE_RATES).forEach(([currency, rate]) => {
      if (!rates[currency]) {
        rates[currency] = rate;
      }
    });
    
    exchangeRateCache = {
      rates,
      fetchedAt: Date.now()
    };
    
    return rates;
  } catch (error) {
    console.error('[unified-pricing] 為替レート取得エラー:', error);
    return DEFAULT_EXCHANGE_RATES;
  }
}

/**
 * JPYから指定通貨への為替レートを取得
 * @returns 1現地通貨 = X円
 */
export async function getExchangeRate(currency: string): Promise<number> {
  const rates = await getExchangeRates();
  return rates[currency] || DEFAULT_EXCHANGE_RATES[currency as keyof typeof DEFAULT_EXCHANGE_RATES] || 150;
}

// =====================================================
// 送料計算
// =====================================================

interface ShippingRateParams {
  weightGrams: number;
  country: string;
  carrier?: string;
}

/**
 * 送料を計算（概算）
 */
export async function calculateShippingCost(params: ShippingRateParams): Promise<number> {
  const { weightGrams, country, carrier } = params;
  
  // 国別の基本送料（概算、実際はshipping_rate_masterから取得）
  const baseRates: Record<string, number> = {
    'US': 2000,   // 円
    'UK': 2500,
    'DE': 2500,
    'AU': 2200,
    'SG': 1500,
    'MY': 1500,
    'TH': 1500,
    'PH': 1500,
    'TW': 1200,
    'VN': 1500,
    'KR': 1200,
    'JP': 500,    // 国内
  };
  
  const baseRate = baseRates[country] || 2000;
  
  // 重量による追加料金（500gごとに+500円）
  const weightSurcharge = Math.floor(weightGrams / 500) * 500;
  
  return baseRate + weightSurcharge;
}

// =====================================================
// 単一マーケットプレイス利益計算
// =====================================================

/**
 * 単一マーケットプレイスの利益を計算
 */
export async function calculateSingleMarketplace(
  input: PricingInput,
  marketplaceId: MarketplaceId
): Promise<PricingResult> {
  const config = getMarketplaceConfig(marketplaceId);
  const warnings: string[] = [];
  
  // 為替レート取得
  const exchangeRate = await getExchangeRate(config.currency);
  
  // 送料計算
  const shippingCostJpy = await calculateShippingCost({
    weightGrams: input.weightGrams || 500,
    country: config.region,
    carrier: input.shippingCarrier,
  });
  const shippingCostLocal = shippingCostJpy / exchangeRate;
  
  // 原価（円）
  const costJpy = input.costPriceJpy;
  
  // 最低利益率（15%）を確保した推奨価格を計算
  const minProfitMargin = 0.15;
  const totalFeePercent = (config.fees.platformFeePercent + config.fees.paymentFeePercent) / 100;
  
  // 推奨価格計算（現地通貨）
  // 売上 - 手数料 - 原価 - 送料 >= 売上 * 最低利益率
  // 売上 * (1 - 手数料率 - 最低利益率) >= 原価 + 送料
  // 売上 >= (原価 + 送料) / (1 - 手数料率 - 最低利益率)
  const costLocalEquivalent = costJpy / exchangeRate;
  const denominador = 1 - totalFeePercent - minProfitMargin;
  
  let suggestedPriceLocal: number;
  if (denominador > 0) {
    suggestedPriceLocal = (costLocalEquivalent + shippingCostLocal) / denominador;
  } else {
    // 手数料が高すぎる場合
    suggestedPriceLocal = (costLocalEquivalent + shippingCostLocal) * 1.5;
    warnings.push(`手数料率が高いため、推奨利益率を確保できません`);
  }
  
  // 価格を整数に丸める
  suggestedPriceLocal = Math.ceil(suggestedPriceLocal * 100) / 100;
  
  // 手数料計算
  const platformFeeLocal = suggestedPriceLocal * (config.fees.platformFeePercent / 100);
  const paymentFeeLocal = suggestedPriceLocal * (config.fees.paymentFeePercent / 100) + (config.fees.paymentFeeFixed || 0);
  const totalFeesLocal = platformFeeLocal + paymentFeeLocal;
  
  // 利益計算（現地通貨）
  const profitLocal = suggestedPriceLocal - costLocalEquivalent - shippingCostLocal - totalFeesLocal;
  
  // JPY換算
  const suggestedPriceJpy = suggestedPriceLocal * exchangeRate;
  const platformFeeJpy = platformFeeLocal * exchangeRate;
  const paymentFeeJpy = paymentFeeLocal * exchangeRate;
  const totalFeesJpy = totalFeesLocal * exchangeRate;
  const profitJpy = profitLocal * exchangeRate;
  
  // 利益率
  const profitMargin = (profitLocal / suggestedPriceLocal) * 100;
  
  // 警告チェック
  if (profitMargin < 10) {
    warnings.push(`利益率が${profitMargin.toFixed(1)}%と低めです`);
  }
  if (profitJpy < 500) {
    warnings.push(`利益額が¥${Math.round(profitJpy)}と低めです`);
  }
  
  return {
    marketplace: marketplaceId,
    marketplaceName: config.displayName,
    currency: config.currency,
    exchangeRate,
    
    suggestedPrice: suggestedPriceLocal,
    suggestedPriceJpy,
    
    shippingCost: shippingCostLocal,
    shippingCostJpy,
    platformFee: platformFeeLocal,
    platformFeeJpy,
    paymentFee: paymentFeeLocal,
    paymentFeeJpy,
    totalFees: totalFeesLocal,
    totalFeesJpy,
    
    profitLocal,
    profitJpy,
    profitMargin,
    
    isProfitable: profitJpy > 0,
    warnings,
    
    breakdown: {
      costJpy,
      shippingJpy: shippingCostJpy,
      feesJpy: totalFeesJpy,
      revenueJpy: suggestedPriceJpy,
    },
  };
}

// =====================================================
// 複数マーケットプレイス一括計算
// =====================================================

/**
 * 複数マーケットプレイスの利益を一括計算
 */
export async function calculateMultiMarketplace(
  input: PricingInput
): Promise<MultiMarketplacePricingResponse> {
  const targetMarketplaces = input.targetMarketplaces || PRIORITY_MARKETPLACES;
  
  try {
    // 並列で全マーケットプレイスを計算
    const results = await Promise.all(
      targetMarketplaces.map(mpId => calculateSingleMarketplace(input, mpId))
    );
    
    // 統計計算
    const profitableResults = results.filter(r => r.isProfitable);
    const profitJpyValues = results.map(r => r.profitJpy);
    const maxProfitJpy = Math.max(...profitJpyValues);
    const maxProfitResult = results.find(r => r.profitJpy === maxProfitJpy);
    
    return {
      success: true,
      results,
      bestMarketplace: maxProfitResult?.marketplace || null,
      summary: {
        totalMarketplaces: results.length,
        profitableCount: profitableResults.length,
        averageProfitJpy: profitJpyValues.reduce((a, b) => a + b, 0) / results.length,
        maxProfitJpy,
        maxProfitMarketplace: maxProfitResult?.marketplace || null,
      },
      calculatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[unified-pricing] 計算エラー:', error);
    return {
      success: false,
      results: [],
      summary: {
        totalMarketplaces: 0,
        profitableCount: 0,
        averageProfitJpy: 0,
        maxProfitJpy: 0,
        maxProfitMarketplace: null,
      },
      calculatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : '計算エラー',
    };
  }
}

// =====================================================
// eBayデータからの利益計算
// =====================================================

/**
 * eBay SM分析結果から多販路利益を計算
 * （既存のeBay計算結果を元に他販路の価格を算出）
 */
export async function calculateFromEbayData(
  ebayPriceUsd: number,
  costPriceJpy: number,
  weightGrams: number = 500
): Promise<MultiMarketplacePricingResponse> {
  // eBayの価格を基準に、各マーケットプレイスの推奨価格を計算
  const input: PricingInput = {
    costPriceJpy,
    weightGrams,
  };
  
  return calculateMultiMarketplace(input);
}

// =====================================================
// 価格比較マトリックス生成
// =====================================================

export interface PriceComparisonRow {
  marketplace: MarketplaceId;
  marketplaceName: string;
  currency: string;
  price: string;           // フォーマット済み価格
  shippingCost: string;    // フォーマット済み送料
  fees: string;            // フォーマット済み手数料
  profitJpy: number;
  profitMargin: number;
  isProfitable: boolean;
  rank: number;            // 利益順位
}

/**
 * 利益比較マトリックスを生成
 */
export function generateComparisonMatrix(results: PricingResult[]): PriceComparisonRow[] {
  // 利益順にソート
  const sorted = [...results].sort((a, b) => b.profitJpy - a.profitJpy);
  
  return sorted.map((result, index) => ({
    marketplace: result.marketplace,
    marketplaceName: result.marketplaceName,
    currency: result.currency,
    price: formatPrice(result.suggestedPrice, result.currency),
    shippingCost: formatPrice(result.shippingCost, result.currency),
    fees: formatPrice(result.totalFees, result.currency),
    profitJpy: Math.round(result.profitJpy),
    profitMargin: Math.round(result.profitMargin * 10) / 10,
    isProfitable: result.isProfitable,
    rank: index + 1,
  }));
}

/**
 * 通貨フォーマット
 */
function formatPrice(value: number, currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'JPY': '¥',
    'GBP': '£',
    'EUR': '€',
    'AUD': 'A$',
    'SGD': 'S$',
    'MYR': 'RM',
    'THB': '฿',
    'PHP': '₱',
    'TWD': 'NT$',
    'VND': '₫',
    'KRW': '₩',
  };
  
  const symbol = symbols[currency] || currency;
  
  if (currency === 'JPY' || currency === 'KRW' || currency === 'VND') {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  
  return `${symbol}${value.toFixed(2)}`;
}
