/**
 * Amazon API 統合モジュール
 * 
 * このファイルは以下のAPIを統合してエクスポートします:
 * - SP-API (Seller Partner API) - 出品・在庫管理用
 * - PA-API (Product Advertising API) - 商品リサーチ用
 */

// SP-API (出品・在庫管理用)
export {
  SecureAmazonTokenManager,
  amazonTokenManager,
  AmazonSpApiClient,
  AMAZON_MARKETPLACES,
  type MarketplaceCode
} from './sp-api/secure-amazon-token-manager'

// PA-API (商品リサーチ用) - 既存
export { AmazonAPIClient } from './amazon-api-client'

// 利益計算 - 既存
export { calculateAmazonProfit } from './profit-calculator'
