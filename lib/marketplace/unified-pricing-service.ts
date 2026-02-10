/**
 * 多販路統一利益計算サービス v2
 * lib/marketplace/unified-pricing-service.ts
 * 
 * Phase 1 拡張版:
 * - shipping_rate_master からのDBルックアップ
 * - marketplace_fee_master からのDBルックアップ
 * - 容積重量計算（FedEx/UPS対応）
 * - 燃油サーチャージ対応
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
// 型定義
// =====================================================

export interface ShippingRate {
  id: number;
  carrier: string;
  carrier_display_name: string;
  service_type: string;
  destination_country: string;
  zone: number | null;
  weight_min_grams: number;
  weight_max_grams: number;
  price_jpy: number;
  volumetric_divisor: number | null;
  use_volumetric_weight: boolean;
  fuel_surcharge_rate: number;
  remote_area_surcharge: number;
  estimated_days_min: number | null;
  estimated_days_max: number | null;
}

export interface MarketplaceFee {
  id: number;
  marketplace_id: string;
  marketplace_display_name: string;
  category_id: string | null;
  category_name: string | null;
  platform_fee_percent: number;
  platform_fee_min: number | null;
  platform_fee_max: number | null;
  payment_fee_percent: number;
  payment_fee_fixed: number;
  listing_fee: number;
  promoted_fee_percent: number;
  international_fee_percent: number;
  vat_rate: number;
  gst_rate: number;
  currency: string;
  min_price: number | null;
  max_price: number | null;
}

export interface ShippingRateParams {
  weightGrams: number;
  country: string;
  carrier?: string;
  serviceType?: 'EXPRESS' | 'STANDARD' | 'ECONOMY';
  // 容積重量計算用
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
}

export interface ShippingRateResult {
  carrier: string;
  carrierDisplayName: string;
  serviceType: string;
  priceJpy: number;
  fuelSurcharge: number;
  totalPriceJpy: number;
  estimatedDaysMin: number | null;
  estimatedDaysMax: number | null;
  usedVolumetricWeight: boolean;
  actualWeightGrams: number;
  chargeableWeightGrams: number;
}

// =====================================================
// キャッシュ管理
// =====================================================

interface ExchangeRateCache {
  rates: Record<string, number>;
  fetchedAt: number;
}

interface ShippingRateCache {
  data: ShippingRate[];
  fetchedAt: number;
}

interface MarketplaceFeeCache {
  data: MarketplaceFee[];
  fetchedAt: number;
}

let exchangeRateCache: ExchangeRateCache | null = null;
let shippingRateCache: ShippingRateCache | null = null;
let marketplaceFeeCache: MarketplaceFeeCache | null = null;

const CACHE_TTL = 60 * 60 * 1000; // 1時間
const SHIPPING_CACHE_TTL = 24 * 60 * 60 * 1000; // 24時間（送料は頻繁に変わらない）

/**
 * キャッシュをクリア
 */
export function clearPricingCache(): void {
  exchangeRateCache = null;
  shippingRateCache = null;
  marketplaceFeeCache = null;
}

// =====================================================
// 為替レート取得
// =====================================================

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
// 送料計算（DBルックアップ版）
// =====================================================

/**
 * shipping_rate_master からデータを取得
 */
async function fetchShippingRates(): Promise<ShippingRate[]> {
  // キャッシュが有効な場合はそれを返す
  if (shippingRateCache && Date.now() - shippingRateCache.fetchedAt < SHIPPING_CACHE_TTL) {
    return shippingRateCache.data;
  }
  
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('shipping_rate_master')
      .select('*')
      .eq('active', true)
      .order('carrier')
      .order('destination_country')
      .order('weight_min_grams');
    
    if (error) throw error;
    
    shippingRateCache = {
      data: data || [],
      fetchedAt: Date.now()
    };
    
    return data || [];
  } catch (error) {
    console.error('[unified-pricing] 送料マスター取得エラー:', error);
    return [];
  }
}

/**
 * 容積重量を計算
 * @param lengthCm 長さ (cm)
 * @param widthCm 幅 (cm)
 * @param heightCm 高さ (cm)
 * @param divisor 容積重量除数（FedEx/UPS: 5000）
 * @returns 容積重量 (grams)
 */
export function calculateVolumetricWeight(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  divisor: number = 5000
): number {
  // 容積重量(kg) = L × W × H / divisor
  const volumetricKg = (lengthCm * widthCm * heightCm) / divisor;
  return Math.ceil(volumetricKg * 1000); // グラムに変換
}

/**
 * 送料を計算（DBルックアップ版）
 */
export async function calculateShippingCost(params: ShippingRateParams): Promise<ShippingRateResult | null> {
  const { 
    weightGrams, 
    country, 
    carrier = 'EMS',
    serviceType,
    lengthCm,
    widthCm,
    heightCm
  } = params;
  
  const rates = await fetchShippingRates();
  
  if (rates.length === 0) {
    // DBにデータがない場合はフォールバック
    return calculateShippingCostFallback(params);
  }
  
  // マッチする送料レートを検索
  let matchingRates = rates.filter(r => 
    r.destination_country === country &&
    weightGrams >= r.weight_min_grams &&
    weightGrams <= r.weight_max_grams
  );
  
  // キャリア指定がある場合
  if (carrier) {
    const carrierFiltered = matchingRates.filter(r => 
      r.carrier.toLowerCase() === carrier.toLowerCase()
    );
    if (carrierFiltered.length > 0) {
      matchingRates = carrierFiltered;
    }
  }
  
  // サービスタイプ指定がある場合
  if (serviceType) {
    const serviceFiltered = matchingRates.filter(r => 
      r.service_type === serviceType
    );
    if (serviceFiltered.length > 0) {
      matchingRates = serviceFiltered;
    }
  }
  
  if (matchingRates.length === 0) {
    // マッチするレートがない場合はフォールバック
    return calculateShippingCostFallback(params);
  }
  
  // 最初のマッチを使用
  const rate = matchingRates[0];
  
  // 容積重量計算
  let chargeableWeight = weightGrams;
  let usedVolumetricWeight = false;
  
  if (rate.use_volumetric_weight && lengthCm && widthCm && heightCm) {
    const divisor = rate.volumetric_divisor || 5000;
    const volumetricWeight = calculateVolumetricWeight(lengthCm, widthCm, heightCm, divisor);
    
    if (volumetricWeight > weightGrams) {
      chargeableWeight = volumetricWeight;
      usedVolumetricWeight = true;
    }
  }
  
  // 容積重量で再検索（重量範囲が変わる場合）
  if (usedVolumetricWeight && chargeableWeight > rate.weight_max_grams) {
    const adjustedRates = rates.filter(r =>
      r.carrier === rate.carrier &&
      r.destination_country === country &&
      chargeableWeight >= r.weight_min_grams &&
      chargeableWeight <= r.weight_max_grams
    );
    if (adjustedRates.length > 0) {
      // 容積重量に合ったレートを使用
      const adjustedRate = adjustedRates[0];
      const fuelSurcharge = adjustedRate.price_jpy * (adjustedRate.fuel_surcharge_rate / 100);
      const totalPrice = adjustedRate.price_jpy + fuelSurcharge + adjustedRate.remote_area_surcharge;
      
      return {
        carrier: adjustedRate.carrier,
        carrierDisplayName: adjustedRate.carrier_display_name || adjustedRate.carrier,
        serviceType: adjustedRate.service_type,
        priceJpy: adjustedRate.price_jpy,
        fuelSurcharge,
        totalPriceJpy: totalPrice,
        estimatedDaysMin: adjustedRate.estimated_days_min,
        estimatedDaysMax: adjustedRate.estimated_days_max,
        usedVolumetricWeight,
        actualWeightGrams: weightGrams,
        chargeableWeightGrams: chargeableWeight,
      };
    }
  }
  
  // 燃油サーチャージ計算
  const fuelSurcharge = rate.price_jpy * (rate.fuel_surcharge_rate / 100);
  const totalPrice = rate.price_jpy + fuelSurcharge + rate.remote_area_surcharge;
  
  return {
    carrier: rate.carrier,
    carrierDisplayName: rate.carrier_display_name || rate.carrier,
    serviceType: rate.service_type,
    priceJpy: rate.price_jpy,
    fuelSurcharge,
    totalPriceJpy: totalPrice,
    estimatedDaysMin: rate.estimated_days_min,
    estimatedDaysMax: rate.estimated_days_max,
    usedVolumetricWeight,
    actualWeightGrams: weightGrams,
    chargeableWeightGrams: chargeableWeight,
  };
}

/**
 * 送料計算のフォールバック（DB未設定時）
 */
function calculateShippingCostFallback(params: ShippingRateParams): ShippingRateResult {
  const { weightGrams, country } = params;
  
  // 国別の基本送料（概算）
  const baseRates: Record<string, number> = {
    'US': 2900,
    'GB': 3600,
    'DE': 3600,
    'FR': 3600,
    'AU': 2000,
    'CA': 2900,
    'SG': 1900,
    'MY': 1900,
    'TH': 1900,
    'PH': 1900,
    'TW': 1450,
    'VN': 1900,
    'KR': 1450,
    'CN': 1450,
    'HK': 1450,
    'JP': 500,
  };
  
  const baseRate = baseRates[country] || 2500;
  
  // 重量による追加料金（500gごとに+500円）
  const weightSurcharge = Math.floor(weightGrams / 500) * 500;
  const totalPrice = baseRate + weightSurcharge;
  
  return {
    carrier: 'EMS',
    carrierDisplayName: 'EMS（概算）',
    serviceType: 'EXPRESS',
    priceJpy: totalPrice,
    fuelSurcharge: 0,
    totalPriceJpy: totalPrice,
    estimatedDaysMin: 3,
    estimatedDaysMax: 7,
    usedVolumetricWeight: false,
    actualWeightGrams: weightGrams,
    chargeableWeightGrams: weightGrams,
  };
}

/**
 * 複数キャリアの送料を比較取得
 */
export async function getShippingOptions(
  weightGrams: number,
  country: string,
  dimensions?: { lengthCm: number; widthCm: number; heightCm: number }
): Promise<ShippingRateResult[]> {
  const rates = await fetchShippingRates();
  
  // 国と重量でフィルタリング
  const matchingRates = rates.filter(r =>
    r.destination_country === country &&
    weightGrams >= r.weight_min_grams &&
    weightGrams <= r.weight_max_grams
  );
  
  // キャリアごとに最適なレートを選択
  const carrierBestRates = new Map<string, ShippingRate>();
  
  matchingRates.forEach(rate => {
    const key = `${rate.carrier}-${rate.service_type}`;
    const existing = carrierBestRates.get(key);
    if (!existing || rate.price_jpy < existing.price_jpy) {
      carrierBestRates.set(key, rate);
    }
  });
  
  // 結果を整形
  const results: ShippingRateResult[] = [];
  
  carrierBestRates.forEach(rate => {
    let chargeableWeight = weightGrams;
    let usedVolumetricWeight = false;
    
    if (rate.use_volumetric_weight && dimensions) {
      const divisor = rate.volumetric_divisor || 5000;
      const volumetricWeight = calculateVolumetricWeight(
        dimensions.lengthCm,
        dimensions.widthCm,
        dimensions.heightCm,
        divisor
      );
      if (volumetricWeight > weightGrams) {
        chargeableWeight = volumetricWeight;
        usedVolumetricWeight = true;
      }
    }
    
    const fuelSurcharge = rate.price_jpy * (rate.fuel_surcharge_rate / 100);
    const totalPrice = rate.price_jpy + fuelSurcharge + rate.remote_area_surcharge;
    
    results.push({
      carrier: rate.carrier,
      carrierDisplayName: rate.carrier_display_name || rate.carrier,
      serviceType: rate.service_type,
      priceJpy: rate.price_jpy,
      fuelSurcharge,
      totalPriceJpy: totalPrice,
      estimatedDaysMin: rate.estimated_days_min,
      estimatedDaysMax: rate.estimated_days_max,
      usedVolumetricWeight,
      actualWeightGrams: weightGrams,
      chargeableWeightGrams: chargeableWeight,
    });
  });
  
  // 価格順にソート
  return results.sort((a, b) => a.totalPriceJpy - b.totalPriceJpy);
}

// =====================================================
// 手数料計算（DBルックアップ版）
// =====================================================

/**
 * marketplace_fee_master からデータを取得
 */
async function fetchMarketplaceFees(): Promise<MarketplaceFee[]> {
  // キャッシュが有効な場合はそれを返す
  if (marketplaceFeeCache && Date.now() - marketplaceFeeCache.fetchedAt < CACHE_TTL) {
    return marketplaceFeeCache.data;
  }
  
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('marketplace_fee_master')
      .select('*')
      .eq('active', true);
    
    if (error) throw error;
    
    marketplaceFeeCache = {
      data: data || [],
      fetchedAt: Date.now()
    };
    
    return data || [];
  } catch (error) {
    console.error('[unified-pricing] 手数料マスター取得エラー:', error);
    return [];
  }
}

/**
 * マーケットプレイスの手数料を取得
 */
export async function getMarketplaceFee(
  marketplaceId: string,
  categoryId?: string
): Promise<MarketplaceFee | null> {
  const fees = await fetchMarketplaceFees();
  
  // カテゴリ指定がある場合はそのカテゴリを優先
  if (categoryId) {
    const categoryFee = fees.find(f => 
      f.marketplace_id === marketplaceId && 
      f.category_id === categoryId
    );
    if (categoryFee) return categoryFee;
  }
  
  // 共通手数料（category_id = null）を返す
  return fees.find(f => 
    f.marketplace_id === marketplaceId && 
    !f.category_id
  ) || null;
}

/**
 * 全マーケットプレイスの手数料を取得
 */
export async function getAllMarketplaceFees(): Promise<Record<string, MarketplaceFee>> {
  const fees = await fetchMarketplaceFees();
  
  const result: Record<string, MarketplaceFee> = {};
  
  // 共通手数料（category_id = null）のみを返す
  fees.filter(f => !f.category_id).forEach(fee => {
    result[fee.marketplace_id] = fee;
  });
  
  return result;
}

// =====================================================
// 単一マーケットプレイス利益計算
// =====================================================

/**
 * 単一マーケットプレイスの利益を計算（DB版）
 */
export async function calculateSingleMarketplace(
  input: PricingInput,
  marketplaceId: MarketplaceId
): Promise<PricingResult> {
  const config = getMarketplaceConfig(marketplaceId);
  const warnings: string[] = [];
  
  // 為替レート取得
  const exchangeRate = await getExchangeRate(config.currency);
  
  // DBから手数料を取得（フォールバックとしてconfig使用）
  const dbFee = await getMarketplaceFee(marketplaceId, input.categoryId);
  
  const platformFeePercent = dbFee?.platform_fee_percent ?? config.fees.platformFeePercent;
  const paymentFeePercent = dbFee?.payment_fee_percent ?? config.fees.paymentFeePercent;
  const paymentFeeFixed = dbFee?.payment_fee_fixed ?? (config.fees.paymentFeeFixed || 0);
  const internationalFeePercent = dbFee?.international_fee_percent ?? 0;
  const vatRate = dbFee?.vat_rate ?? 0;
  const gstRate = dbFee?.gst_rate ?? 0;
  
  // 送料計算（DBルックアップ版）
  const shippingResult = await calculateShippingCost({
    weightGrams: input.weightGrams || 500,
    country: config.region,
    carrier: input.shippingCarrier,
    lengthCm: input.lengthCm,
    widthCm: input.widthCm,
    heightCm: input.heightCm,
  });
  
  const shippingCostJpy = shippingResult?.totalPriceJpy || 2000;
  const shippingCostLocal = shippingCostJpy / exchangeRate;
  
  // 容積重量使用の警告
  if (shippingResult?.usedVolumetricWeight) {
    warnings.push(`容積重量適用: 実重量 ${shippingResult.actualWeightGrams}g → 課金重量 ${shippingResult.chargeableWeightGrams}g`);
  }
  
  // 原価（円）
  const costJpy = input.costPriceJpy;
  
  // 合計手数料率
  const totalFeePercent = (platformFeePercent + paymentFeePercent + internationalFeePercent) / 100;
  const taxRate = (vatRate + gstRate) / 100;
  
  // 最低利益率（15%）を確保した推奨価格を計算
  const minProfitMargin = 0.15;
  
  // 推奨価格計算（現地通貨）
  // 売上 - 手数料 - 税 - 原価 - 送料 - 決済固定費 >= 売上 * 最低利益率
  // 売上 * (1 - 手数料率 - 税率 - 最低利益率) >= 原価 + 送料 + 決済固定費
  const costLocalEquivalent = costJpy / exchangeRate;
  const fixedCostsLocal = paymentFeeFixed;
  const denominador = 1 - totalFeePercent - taxRate - minProfitMargin;
  
  let suggestedPriceLocal: number;
  if (denominador > 0) {
    suggestedPriceLocal = (costLocalEquivalent + shippingCostLocal + fixedCostsLocal) / denominador;
  } else {
    // 手数料が高すぎる場合
    suggestedPriceLocal = (costLocalEquivalent + shippingCostLocal + fixedCostsLocal) * 1.5;
    warnings.push(`手数料率が高いため、推奨利益率を確保できません`);
  }
  
  // 価格を整数に丸める
  suggestedPriceLocal = Math.ceil(suggestedPriceLocal * 100) / 100;
  
  // 最低価格チェック
  if (dbFee?.min_price && suggestedPriceLocal < dbFee.min_price) {
    warnings.push(`最低出品価格 ${formatPrice(dbFee.min_price, config.currency)} を下回っています`);
  }
  
  // 手数料計算
  const platformFeeLocal = suggestedPriceLocal * (platformFeePercent / 100);
  const paymentFeeLocal = suggestedPriceLocal * (paymentFeePercent / 100) + paymentFeeFixed;
  const internationalFeeLocal = suggestedPriceLocal * (internationalFeePercent / 100);
  const taxLocal = suggestedPriceLocal * taxRate;
  const totalFeesLocal = platformFeeLocal + paymentFeeLocal + internationalFeeLocal + taxLocal;
  
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
    
    // 追加情報
    feeDetails: {
      platformFeePercent,
      paymentFeePercent,
      paymentFeeFixed,
      internationalFeePercent,
      vatRate,
      gstRate,
    },
    shippingDetails: shippingResult || undefined,
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
  weightGrams: number = 500,
  dimensions?: { lengthCm: number; widthCm: number; heightCm: number }
): Promise<MultiMarketplacePricingResponse> {
  const input: PricingInput = {
    costPriceJpy,
    weightGrams,
    lengthCm: dimensions?.lengthCm,
    widthCm: dimensions?.widthCm,
    heightCm: dimensions?.heightCm,
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
  carrier?: string;        // 使用キャリア
  estimatedDays?: string;  // 配送日数
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
    carrier: result.shippingDetails?.carrier,
    estimatedDays: result.shippingDetails?.estimatedDaysMin && result.shippingDetails?.estimatedDaysMax
      ? `${result.shippingDetails.estimatedDaysMin}-${result.shippingDetails.estimatedDaysMax}日`
      : undefined,
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
    'IDR': 'Rp',
  };
  
  const symbol = symbols[currency] || currency;
  
  if (currency === 'JPY' || currency === 'KRW' || currency === 'VND' || currency === 'IDR') {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  
  return `${symbol}${value.toFixed(2)}`;
}

// =====================================================
// デバッグ・管理用関数
// =====================================================

/**
 * 送料マスターの状態を確認
 */
export async function getShippingRateStats(): Promise<{
  totalRates: number;
  carriers: string[];
  countries: string[];
}> {
  const rates = await fetchShippingRates();
  
  const carriers = [...new Set(rates.map(r => r.carrier))];
  const countries = [...new Set(rates.map(r => r.destination_country))];
  
  return {
    totalRates: rates.length,
    carriers,
    countries,
  };
}

/**
 * 手数料マスターの状態を確認
 */
export async function getMarketplaceFeeStats(): Promise<{
  totalFees: number;
  marketplaces: string[];
}> {
  const fees = await fetchMarketplaceFees();
  
  const marketplaces = [...new Set(fees.map(f => f.marketplace_id))];
  
  return {
    totalFees: fees.length,
    marketplaces,
  };
}
