/**
 * 統一利益計算エンジン
 * lib/pricing/pricing-engine.ts
 * 
 * eBayの計算ロジックを基盤として、全モール共通で使用
 * 各モールの手数料・送料を設定で切り替え可能
 */

import { createClient } from '@supabase/supabase-js';

// =====================================================
// 型定義
// =====================================================

export type MarketplaceId = 
  | 'ebay_us' | 'ebay_uk' | 'ebay_de' | 'ebay_au'
  | 'qoo10_jp' | 'qoo10_sg'
  | 'amazon_jp' | 'amazon_us'
  | 'shopee_sg' | 'shopee_my' | 'shopee_th';

export type Currency = 'USD' | 'JPY' | 'GBP' | 'EUR' | 'SGD' | 'MYR' | 'THB' | 'AUD';

export interface ProductCostData {
  purchasePriceJpy: number;      // 仕入れ価格（円）
  weightGrams: number;            // 重量（g）
  otherCostJpy?: number;          // その他経費（円）
  dutyRate?: number;              // 関税率（%）
  htsCode?: string;               // HTSコード
}

export interface ShippingRate {
  shippingCode: string;
  shippingName: string;
  shippingType: 'free' | 'fixed' | 'weight_based' | 'region_based';
  baseCost: number;
  currency: Currency;
  perKgRate?: number;
  carrier?: string;
  estimatedDays?: string;
}

export interface FeeRate {
  platformFeePercent: number;     // モール手数料 (%)
  paymentFeePercent: number;      // 決済手数料 (%)
  paymentFeeFixed: number;        // 決済固定費
  categoryCode?: string;
}

export interface PricingInput {
  productCost: ProductCostData;
  marketplace: MarketplaceId;
  targetPriceLocal?: number;      // 指定価格（現地通貨）
  targetMargin?: number;          // 目標利益率 (%)
  shippingCode?: string;          // 送料コード
  categoryCode?: string;          // カテゴリコード
}

export interface PricingResult {
  marketplace: MarketplaceId;
  currency: Currency;
  exchangeRate: number;
  
  // コスト内訳
  costBreakdown: {
    purchaseCostLocal: number;    // 仕入れ原価（現地通貨換算）
    shippingCostLocal: number;    // 送料（現地通貨）
    otherCostLocal: number;       // その他経費（現地通貨）
    dutyAmount: number;           // 関税額
    platformFee: number;          // モール手数料
    paymentFee: number;           // 決済手数料
    totalCost: number;            // 総コスト
  };
  
  // 価格・利益
  suggestedPrice: number;         // 推奨販売価格
  breakEvenPrice: number;         // 損益分岐価格
  profitLocal: number;            // 利益（現地通貨）
  profitJpy: number;              // 利益（円換算）
  profitMargin: number;           // 利益率 (%)
  
  // ステータス
  isProfitable: boolean;
  isRedFlag: boolean;             // 赤字警告
  warnings: string[];
  
  // 送料情報
  shippingInfo: {
    code: string;
    name: string;
    type: string;
    cost: number;
    carrier?: string;
  };
  
  // 手数料情報
  feeInfo: {
    platformPercent: number;
    paymentPercent: number;
    paymentFixed: number;
    totalPercent: number;
  };
}

// =====================================================
// デフォルト為替レート
// =====================================================

const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 150,
  JPY: 1,
  GBP: 190,
  EUR: 165,
  SGD: 112,
  MYR: 32,
  THB: 4.3,
  AUD: 98,
};

// =====================================================
// マーケットプレイス設定
// =====================================================

const MARKETPLACE_CONFIG: Record<MarketplaceId, { currency: Currency; isDomestic: boolean }> = {
  ebay_us: { currency: 'USD', isDomestic: false },
  ebay_uk: { currency: 'GBP', isDomestic: false },
  ebay_de: { currency: 'EUR', isDomestic: false },
  ebay_au: { currency: 'AUD', isDomestic: false },
  qoo10_jp: { currency: 'JPY', isDomestic: true },
  qoo10_sg: { currency: 'SGD', isDomestic: false },
  amazon_jp: { currency: 'JPY', isDomestic: true },
  amazon_us: { currency: 'USD', isDomestic: false },
  shopee_sg: { currency: 'SGD', isDomestic: false },
  shopee_my: { currency: 'MYR', isDomestic: false },
  shopee_th: { currency: 'THB', isDomestic: false },
};

// =====================================================
// Supabaseクライアント
// =====================================================

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

// =====================================================
// 為替レート取得
// =====================================================

export async function getExchangeRate(currency: Currency): Promise<number> {
  if (currency === 'JPY') return 1;
  
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('exchange_rates')
      .select('rate')
      .eq('currency', currency)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    return data?.rate || DEFAULT_EXCHANGE_RATES[currency];
  } catch {
    return DEFAULT_EXCHANGE_RATES[currency];
  }
}

export async function getAllExchangeRates(): Promise<Record<Currency, number>> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('exchange_rates')
      .select('currency, rate')
      .order('updated_at', { ascending: false });
    
    const rates = { ...DEFAULT_EXCHANGE_RATES };
    if (data) {
      data.forEach((row: any) => {
        rates[row.currency as Currency] = row.rate;
      });
    }
    return rates;
  } catch {
    return DEFAULT_EXCHANGE_RATES;
  }
}

// =====================================================
// 送料取得
// =====================================================

export async function getShippingRate(
  marketplace: MarketplaceId,
  shippingCode?: string,
  weightGrams?: number
): Promise<ShippingRate> {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from('marketplace_shipping_rates')
    .select('*')
    .eq('marketplace', marketplace)
    .eq('active', true);
  
  if (shippingCode) {
    query = query.eq('shipping_code', shippingCode);
  } else {
    query = query.eq('is_default', true);
  }
  
  const { data } = await query.limit(1).single();
  
  if (!data) {
    // フォールバック：デフォルト値
    const config = MARKETPLACE_CONFIG[marketplace];
    return {
      shippingCode: 'DEFAULT',
      shippingName: 'Standard Shipping',
      shippingType: 'fixed',
      baseCost: config.isDomestic ? 500 : 10,
      currency: config.currency,
      perKgRate: 0,
    };
  }
  
  // 重量ベースの場合、追加料金を計算
  let calculatedCost = data.base_cost;
  if (data.shipping_type === 'weight_based' && weightGrams && data.per_kg_rate) {
    const additionalKg = Math.max(0, Math.ceil((weightGrams - 500) / 1000));
    calculatedCost += additionalKg * data.per_kg_rate;
  }
  
  return {
    shippingCode: data.shipping_code,
    shippingName: data.shipping_name,
    shippingType: data.shipping_type,
    baseCost: calculatedCost,
    currency: data.currency,
    perKgRate: data.per_kg_rate,
    carrier: data.carrier,
    estimatedDays: data.estimated_days_min && data.estimated_days_max 
      ? `${data.estimated_days_min}-${data.estimated_days_max}日`
      : undefined,
  };
}

export async function getShippingRates(marketplace: MarketplaceId): Promise<ShippingRate[]> {
  const supabase = getSupabaseClient();
  
  const { data } = await supabase
    .from('marketplace_shipping_rates')
    .select('*')
    .eq('marketplace', marketplace)
    .eq('active', true)
    .order('is_default', { ascending: false });
  
  if (!data || data.length === 0) {
    return [];
  }
  
  return data.map(row => ({
    shippingCode: row.shipping_code,
    shippingName: row.shipping_name,
    shippingType: row.shipping_type,
    baseCost: row.base_cost,
    currency: row.currency,
    perKgRate: row.per_kg_rate,
    carrier: row.carrier,
    estimatedDays: row.estimated_days_min && row.estimated_days_max 
      ? `${row.estimated_days_min}-${row.estimated_days_max}日`
      : undefined,
  }));
}

// =====================================================
// 手数料取得
// =====================================================

export async function getFeeRate(
  marketplace: MarketplaceId,
  categoryCode?: string
): Promise<FeeRate> {
  const supabase = getSupabaseClient();
  
  // カテゴリ別手数料を優先して取得
  let query = supabase
    .from('marketplace_fee_rates')
    .select('*')
    .eq('marketplace', marketplace)
    .eq('active', true);
  
  if (categoryCode) {
    query = query.eq('category_code', categoryCode);
  } else {
    query = query.is('category_code', null);
  }
  
  const { data } = await query.limit(1).single();
  
  if (!data) {
    // カテゴリ別がなければデフォルトを取得
    const { data: defaultData } = await supabase
      .from('marketplace_fee_rates')
      .select('*')
      .eq('marketplace', marketplace)
      .is('category_code', null)
      .eq('active', true)
      .limit(1)
      .single();
    
    if (defaultData) {
      return {
        platformFeePercent: defaultData.platform_fee_percent,
        paymentFeePercent: defaultData.payment_fee_percent,
        paymentFeeFixed: defaultData.payment_fee_fixed || 0,
        categoryCode: undefined,
      };
    }
    
    // 完全フォールバック
    return getDefaultFeeRate(marketplace);
  }
  
  return {
    platformFeePercent: data.platform_fee_percent,
    paymentFeePercent: data.payment_fee_percent,
    paymentFeeFixed: data.payment_fee_fixed || 0,
    categoryCode: data.category_code,
  };
}

function getDefaultFeeRate(marketplace: MarketplaceId): FeeRate {
  const defaults: Record<string, FeeRate> = {
    ebay_us: { platformFeePercent: 12.9, paymentFeePercent: 2.9, paymentFeeFixed: 0.30 },
    ebay_uk: { platformFeePercent: 12.9, paymentFeePercent: 2.9, paymentFeeFixed: 0.25 },
    ebay_de: { platformFeePercent: 12.0, paymentFeePercent: 2.9, paymentFeeFixed: 0.35 },
    ebay_au: { platformFeePercent: 12.9, paymentFeePercent: 2.9, paymentFeeFixed: 0.30 },
    qoo10_jp: { platformFeePercent: 12.0, paymentFeePercent: 3.5, paymentFeeFixed: 0 },
    qoo10_sg: { platformFeePercent: 12.0, paymentFeePercent: 3.5, paymentFeeFixed: 0 },
    amazon_jp: { platformFeePercent: 15.0, paymentFeePercent: 0, paymentFeeFixed: 0 },
    amazon_us: { platformFeePercent: 15.0, paymentFeePercent: 0, paymentFeeFixed: 0 },
    shopee_sg: { platformFeePercent: 5.0, paymentFeePercent: 2.0, paymentFeeFixed: 0 },
    shopee_my: { platformFeePercent: 5.0, paymentFeePercent: 2.0, paymentFeeFixed: 0 },
    shopee_th: { platformFeePercent: 5.0, paymentFeePercent: 2.0, paymentFeeFixed: 0 },
  };
  
  return defaults[marketplace] || { platformFeePercent: 15, paymentFeePercent: 3, paymentFeeFixed: 0 };
}

// =====================================================
// メイン計算エンジン
// =====================================================

/**
 * 利益計算（メイン関数）
 * eBayのTabPricingStrategyと同じロジックを使用
 */
export async function calculateProfit(input: PricingInput): Promise<PricingResult> {
  const { productCost, marketplace, targetPriceLocal, targetMargin, shippingCode, categoryCode } = input;
  const warnings: string[] = [];
  
  // 1. マーケットプレイス設定
  const mpConfig = MARKETPLACE_CONFIG[marketplace];
  const currency = mpConfig.currency;
  const isDomestic = mpConfig.isDomestic;
  
  // 2. 為替レート取得
  const exchangeRate = await getExchangeRate(currency);
  
  // 3. 送料取得
  const shippingRate = await getShippingRate(marketplace, shippingCode, productCost.weightGrams);
  
  // 4. 手数料取得
  const feeRate = await getFeeRate(marketplace, categoryCode);
  
  // 5. コスト計算（円ベース → 現地通貨変換）
  const purchaseCostJpy = productCost.purchasePriceJpy;
  const otherCostJpy = productCost.otherCostJpy || 0;
  
  // 現地通貨換算
  const purchaseCostLocal = purchaseCostJpy / exchangeRate;
  const otherCostLocal = otherCostJpy / exchangeRate;
  const shippingCostLocal = shippingRate.baseCost;
  
  // 6. 手数料率
  const totalFeePercent = feeRate.platformFeePercent + feeRate.paymentFeePercent;
  const totalFeeRate = totalFeePercent / 100;
  
  // 7. 関税計算（海外販売の場合）
  const dutyRate = isDomestic ? 0 : (productCost.dutyRate || 0);
  
  // 8. 価格決定
  let suggestedPrice: number;
  
  if (targetPriceLocal && targetPriceLocal > 0) {
    // 指定価格がある場合
    suggestedPrice = targetPriceLocal;
  } else if (targetMargin && targetMargin > 0) {
    // 目標利益率から逆算
    // 売価 = (原価 + 送料) / (1 - 手数料率 - 利益率 - 関税率)
    const marginRate = targetMargin / 100;
    const dutyRateDecimal = dutyRate / 100;
    const divisor = 1 - totalFeeRate - marginRate - dutyRateDecimal;
    
    if (divisor <= 0) {
      warnings.push(`目標利益率${targetMargin}%は達成不可能です`);
      suggestedPrice = (purchaseCostLocal + shippingCostLocal + otherCostLocal) * 2; // フォールバック
    } else {
      suggestedPrice = (purchaseCostLocal + shippingCostLocal + otherCostLocal) / divisor;
    }
  } else {
    // デフォルト: 15%利益率で計算
    const defaultMarginRate = 0.15;
    const dutyRateDecimal = dutyRate / 100;
    const divisor = 1 - totalFeeRate - defaultMarginRate - dutyRateDecimal;
    suggestedPrice = (purchaseCostLocal + shippingCostLocal + otherCostLocal) / divisor;
  }
  
  // 9. 損益分岐価格
  const dutyRateDecimal = dutyRate / 100;
  const breakEvenDivisor = 1 - totalFeeRate - dutyRateDecimal;
  const breakEvenPrice = breakEvenDivisor > 0 
    ? (purchaseCostLocal + shippingCostLocal + otherCostLocal) / breakEvenDivisor 
    : suggestedPrice;
  
  // 10. 各種費用計算
  const platformFee = suggestedPrice * (feeRate.platformFeePercent / 100);
  const paymentFee = suggestedPrice * (feeRate.paymentFeePercent / 100) + feeRate.paymentFeeFixed;
  const dutyAmount = suggestedPrice * dutyRateDecimal;
  
  const totalCost = purchaseCostLocal + shippingCostLocal + otherCostLocal + platformFee + paymentFee + dutyAmount;
  
  // 11. 利益計算
  const profitLocal = suggestedPrice - totalCost;
  const profitJpy = profitLocal * exchangeRate;
  const profitMargin = suggestedPrice > 0 ? (profitLocal / suggestedPrice) * 100 : 0;
  
  // 12. ステータス判定
  const isProfitable = profitLocal > 0;
  const isRedFlag = profitMargin < 5 || profitLocal < 0;
  
  if (isRedFlag) {
    warnings.push('⚠️ 赤字警告: 利益率が5%未満です');
  }
  
  if (profitMargin < 10 && profitMargin >= 5) {
    warnings.push('注意: 利益率が10%未満です');
  }
  
  return {
    marketplace,
    currency,
    exchangeRate,
    costBreakdown: {
      purchaseCostLocal,
      shippingCostLocal,
      otherCostLocal,
      dutyAmount,
      platformFee,
      paymentFee,
      totalCost,
    },
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
    profitLocal: Math.round(profitLocal * 100) / 100,
    profitJpy: Math.round(profitJpy),
    profitMargin: Math.round(profitMargin * 10) / 10,
    isProfitable,
    isRedFlag,
    warnings,
    shippingInfo: {
      code: shippingRate.shippingCode,
      name: shippingRate.shippingName,
      type: shippingRate.shippingType,
      cost: shippingRate.baseCost,
      carrier: shippingRate.carrier,
    },
    feeInfo: {
      platformPercent: feeRate.platformFeePercent,
      paymentPercent: feeRate.paymentFeePercent,
      paymentFixed: feeRate.paymentFeeFixed,
      totalPercent: totalFeePercent,
    },
  };
}

// =====================================================
// 複数モール一括計算
// =====================================================

export async function calculateMultiMarketplace(
  productCost: ProductCostData,
  targetMarketplaces?: MarketplaceId[]
): Promise<{
  results: PricingResult[];
  summary: {
    bestMarketplace: MarketplaceId | null;
    maxProfitJpy: number;
    profitableCount: number;
  };
}> {
  const marketplaces = targetMarketplaces || ['ebay_us', 'qoo10_jp', 'shopee_sg'];
  
  const results: PricingResult[] = [];
  
  for (const mp of marketplaces) {
    try {
      const result = await calculateProfit({
        productCost,
        marketplace: mp,
        targetMargin: 15, // デフォルト15%
      });
      results.push(result);
    } catch (error) {
      console.error(`[PricingEngine] ${mp} 計算エラー:`, error);
    }
  }
  
  // 利益順でソート
  results.sort((a, b) => b.profitJpy - a.profitJpy);
  
  const profitableResults = results.filter(r => r.isProfitable);
  const bestResult = profitableResults[0];
  
  return {
    results,
    summary: {
      bestMarketplace: bestResult?.marketplace || null,
      maxProfitJpy: bestResult?.profitJpy || 0,
      profitableCount: profitableResults.length,
    },
  };
}

// =====================================================
// 価格戦略計算（eBay TabPricingStrategy互換）
// =====================================================

export type PricingStrategy = 
  | 'lowest' | 'lowest-5' | 'lowest+5'
  | 'average' | 'avg-10' | 'avg+10'
  | 'margin-15' | 'margin-20' | 'margin-25'
  | 'undercut-1' | 'undercut-5'
  | 'premium' | 'competitive' | 'breakeven' | 'custom';

export interface CompetitorPrices {
  lowest: number;
  average: number;
  highest: number;
}

export function calculateStrategyPrice(
  strategy: PricingStrategy,
  productCost: ProductCostData,
  feeRate: FeeRate,
  exchangeRate: number,
  competitorPrices?: CompetitorPrices,
  customPrice?: number
): number {
  const { purchasePriceJpy, otherCostJpy = 0 } = productCost;
  const totalFeeRate = (feeRate.platformFeePercent + feeRate.paymentFeePercent) / 100;
  const baseCostLocal = (purchasePriceJpy + otherCostJpy) / exchangeRate;
  
  const calculateMarginPrice = (marginPercent: number): number => {
    const divisor = 1 - totalFeeRate - (marginPercent / 100);
    if (divisor <= 0) return 0;
    return baseCostLocal / divisor;
  };
  
  const smLowest = competitorPrices?.lowest || 0;
  const smAverage = competitorPrices?.average || 0;
  const smHighest = competitorPrices?.highest || 0;
  
  switch (strategy) {
    case 'lowest': return smLowest;
    case 'lowest-5': return smLowest * 0.95;
    case 'lowest+5': return smLowest * 1.05;
    case 'average': return smAverage;
    case 'avg-10': return smAverage * 0.90;
    case 'avg+10': return smAverage * 1.10;
    case 'undercut-1': return Math.max(0, smLowest - 1);
    case 'undercut-5': return Math.max(0, smLowest - 5);
    case 'premium': return smHighest * 0.95;
    case 'margin-15': return calculateMarginPrice(15);
    case 'margin-20': return calculateMarginPrice(20);
    case 'margin-25': return calculateMarginPrice(25);
    case 'breakeven': return calculateMarginPrice(0);
    case 'competitive': return smLowest > 0 ? smLowest * 0.98 : smAverage * 0.95;
    case 'custom': return customPrice || 0;
    default: return 0;
  }
}
