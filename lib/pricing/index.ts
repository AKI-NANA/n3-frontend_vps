/**
 * 利益計算エンジン
 * lib/pricing/index.ts
 */

// メイン計算エンジン
export {
  calculateProfit,
  calculateMultiMarketplace,
  getExchangeRate,
  getAllExchangeRates,
  getShippingRate,
  getShippingRates,
  getFeeRate,
  calculateStrategyPrice,
  type MarketplaceId,
  type Currency,
  type ProductCostData,
  type ShippingRate,
  type FeeRate,
  type PricingInput,
  type PricingResult,
  type PricingStrategy,
  type CompetitorPrices,
} from './pricing-engine';
