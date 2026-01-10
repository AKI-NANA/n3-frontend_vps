/**
 * 多販路マーケットプレイスシステム
 * lib/marketplace/index.ts
 */

// 型定義
export * from './multi-marketplace-types';

// マーケットプレイス設定
export * from './marketplace-configs';

// 利益計算サービス
export {
  getExchangeRates,
  getExchangeRate,
  calculateShippingCost,
  calculateSingleMarketplace,
  calculateMultiMarketplace,
  calculateFromEbayData,
  generateComparisonMatrix,
} from './unified-pricing-service';

// 既存の型定義（互換性のため）
export * from './types';
