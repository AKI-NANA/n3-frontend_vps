/**
 * Qoo10 Profit Calculator
 * Calculate profit margins and recommended prices for Qoo10 listings
 */

import type {
  Qoo10ProfitCalculation,
  Qoo10ProfitCalculatorParams,
  DomesticCarrier,
  ShippingSize,
  ShippingRegion,
} from '@/types/qoo10';
import { getShippingRate } from './shipping-rates';

// =============================================================================
// Constants
// =============================================================================

// Default Qoo10 fee rates
export const DEFAULT_QOO10_FEE_RATE = 0.10;       // 10%
export const DEFAULT_PAYMENT_FEE_RATE = 0.035;    // 3.5%
export const DEFAULT_PACKAGING_COST = 100;        // 100 JPY

// Fee rate by category (Qoo10 2024)
export const QOO10_CATEGORY_FEE_RATES: Record<string, number> = {
  '001': 0.10,    // ファッション
  '002': 0.10,    // ビューティー
  '003': 0.08,    // デジタル・家電
  '004': 0.10,    // スポーツ・アウトドア
  '005': 0.10,    // 生活雑貨・日用品
  '006': 0.10,    // ベビー・キッズ
  '007': 0.12,    // 食品・飲料
  '008': 0.10,    // ホビー・コレクション
  '009': 0.10,    // インテリア・家具
};

// Warning thresholds
export const PROFIT_WARNING_THRESHOLD = 10;       // Warn if margin < 10%
export const PROFIT_DANGER_THRESHOLD = 0;         // Danger if margin <= 0%
export const RECOMMENDED_TARGET_MARGIN = 20;      // Target 20% margin

// =============================================================================
// Main Calculator Function
// =============================================================================

/**
 * Calculate profit for a Qoo10 listing
 */
export function calculateQoo10Profit(
  params: Qoo10ProfitCalculatorParams
): Qoo10ProfitCalculation {
  const {
    selling_price,
    cost_price,
    shipping_carrier,
    shipping_size,
    shipping_region = 'kanto',
    qoo10_fee_rate = DEFAULT_QOO10_FEE_RATE,
    payment_fee_rate = DEFAULT_PAYMENT_FEE_RATE,
    packaging_cost = DEFAULT_PACKAGING_COST,
    is_free_shipping = false,
    target_margin = RECOMMENDED_TARGET_MARGIN / 100,
  } = params;

  const warnings: string[] = [];

  // Calculate fees
  const qoo10_fee = Math.floor(selling_price * qoo10_fee_rate);
  const payment_fee = Math.floor(selling_price * payment_fee_rate);

  // Get shipping fee
  const shipping_fee = is_free_shipping
    ? getShippingRate(shipping_carrier, shipping_size, shipping_region)
    : 0; // If buyer pays, seller doesn't deduct from profit

  // Calculate totals
  const total_deductions = cost_price + qoo10_fee + payment_fee + shipping_fee + packaging_cost;
  const net_profit = selling_price - total_deductions;
  const profit_margin_percent = selling_price > 0
    ? (net_profit / selling_price) * 100
    : 0;

  // Check profitability and add warnings
  const is_profitable = net_profit > 0;

  if (profit_margin_percent <= PROFIT_DANGER_THRESHOLD) {
    warnings.push('赤字です！販売価格を見直してください。');
  } else if (profit_margin_percent < PROFIT_WARNING_THRESHOLD) {
    warnings.push('利益率が低すぎます。販売価格の再検討を推奨します。');
  }

  if (selling_price < cost_price) {
    warnings.push('販売価格が仕入原価を下回っています。');
  }

  // Calculate recommended price for target margin
  const recommended_price_for_target_margin = calculateRecommendedPrice(
    cost_price,
    shipping_carrier,
    shipping_size,
    shipping_region,
    qoo10_fee_rate,
    payment_fee_rate,
    packaging_cost,
    is_free_shipping,
    target_margin
  );

  return {
    selling_price,
    cost_price,
    qoo10_fee,
    payment_fee,
    shipping_fee,
    packaging_cost,
    total_deductions,
    net_profit,
    profit_margin_percent: Math.round(profit_margin_percent * 10) / 10,
    recommended_price_for_target_margin,
    is_profitable,
    warnings,
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate recommended selling price to achieve target margin
 */
export function calculateRecommendedPrice(
  cost_price: number,
  shipping_carrier: DomesticCarrier,
  shipping_size: ShippingSize | string,
  shipping_region: ShippingRegion = 'kanto',
  qoo10_fee_rate: number = DEFAULT_QOO10_FEE_RATE,
  payment_fee_rate: number = DEFAULT_PAYMENT_FEE_RATE,
  packaging_cost: number = DEFAULT_PACKAGING_COST,
  is_free_shipping: boolean = false,
  target_margin: number = RECOMMENDED_TARGET_MARGIN / 100
): number {
  // Get shipping cost if seller pays
  const shipping_fee = is_free_shipping
    ? getShippingRate(shipping_carrier, shipping_size, shipping_region)
    : 0;

  // Fixed costs that don't depend on price
  const fixed_costs = cost_price + shipping_fee + packaging_cost;

  // Price formula: price = fixed_costs / (1 - qoo10_rate - payment_rate - target_margin)
  const rate_multiplier = 1 - qoo10_fee_rate - payment_fee_rate - target_margin;

  if (rate_multiplier <= 0) {
    // Invalid configuration - rates too high
    return Math.ceil(fixed_costs * 2); // Return at least 2x costs
  }

  const recommended_price = Math.ceil(fixed_costs / rate_multiplier);

  // Round up to nearest 10 yen for nicer pricing
  return Math.ceil(recommended_price / 10) * 10;
}

/**
 * Get Qoo10 fee rate for a category
 */
export function getQoo10FeeRate(category_code: string): number {
  // Extract main category (first 3 digits)
  const main_category = category_code.substring(0, 3);
  return QOO10_CATEGORY_FEE_RATES[main_category] || DEFAULT_QOO10_FEE_RATE;
}

/**
 * Calculate break-even price (0% profit margin)
 */
export function calculateBreakEvenPrice(
  cost_price: number,
  shipping_carrier: DomesticCarrier,
  shipping_size: ShippingSize | string,
  shipping_region: ShippingRegion = 'kanto',
  qoo10_fee_rate: number = DEFAULT_QOO10_FEE_RATE,
  payment_fee_rate: number = DEFAULT_PAYMENT_FEE_RATE,
  packaging_cost: number = DEFAULT_PACKAGING_COST,
  is_free_shipping: boolean = false
): number {
  return calculateRecommendedPrice(
    cost_price,
    shipping_carrier,
    shipping_size,
    shipping_region,
    qoo10_fee_rate,
    payment_fee_rate,
    packaging_cost,
    is_free_shipping,
    0 // 0% target margin = break-even
  );
}

/**
 * Calculate multiple price points for different margins
 */
export function calculatePricePoints(
  cost_price: number,
  shipping_carrier: DomesticCarrier,
  shipping_size: ShippingSize | string,
  shipping_region: ShippingRegion = 'kanto',
  qoo10_fee_rate: number = DEFAULT_QOO10_FEE_RATE,
  is_free_shipping: boolean = false
): { margin: number; price: number; profit: number }[] {
  const margins = [0, 10, 15, 20, 25, 30];

  return margins.map(margin => {
    const price = calculateRecommendedPrice(
      cost_price,
      shipping_carrier,
      shipping_size,
      shipping_region,
      qoo10_fee_rate,
      DEFAULT_PAYMENT_FEE_RATE,
      DEFAULT_PACKAGING_COST,
      is_free_shipping,
      margin / 100
    );

    const calculation = calculateQoo10Profit({
      selling_price: price,
      cost_price,
      shipping_carrier,
      shipping_size,
      shipping_region,
      qoo10_fee_rate,
      is_free_shipping,
    });

    return {
      margin,
      price,
      profit: calculation.net_profit,
    };
  });
}

/**
 * Format currency for display
 */
export function formatJPY(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// =============================================================================
// Validation Functions
// =============================================================================

/**
 * Validate listing data for Qoo10
 */
export function validateQoo10Listing(data: {
  title_ja?: string;
  selling_price?: number;
  cost_price?: number;
  stock_quantity?: number;
  qoo10_category_code?: string;
  shipping_carrier?: string;
  shipping_size?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Title validation (max 100 chars)
  if (!data.title_ja) {
    errors.push('商品タイトルは必須です。');
  } else if (data.title_ja.length > 100) {
    errors.push('商品タイトルは100文字以内にしてください。');
  }

  // Price validation
  if (!data.selling_price || data.selling_price < 100) {
    errors.push('販売価格は100円以上を設定してください。');
  }

  // Stock validation
  if (!data.stock_quantity || data.stock_quantity < 1) {
    errors.push('在庫数は1以上を設定してください。');
  }

  // Category validation
  if (!data.qoo10_category_code) {
    errors.push('カテゴリを選択してください。');
  }

  // Shipping validation
  if (!data.shipping_carrier) {
    errors.push('配送業者を選択してください。');
  }
  if (!data.shipping_size) {
    errors.push('梱包サイズを選択してください。');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
