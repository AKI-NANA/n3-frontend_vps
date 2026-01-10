/**
 * 多販路統一型定義
 * lib/marketplace/multi-marketplace-types.ts
 */

// =====================================================
// マーケットプレイス識別子
// =====================================================
export type MarketplaceId =
  // eBay
  | 'ebay_us' | 'ebay_uk' | 'ebay_de' | 'ebay_au'
  // Qoo10
  | 'qoo10_jp' | 'qoo10_sg'
  // Amazon
  | 'amazon_jp' | 'amazon_us' | 'amazon_au'
  // Shopee
  | 'shopee_sg' | 'shopee_my' | 'shopee_th' | 'shopee_ph' | 'shopee_tw' | 'shopee_vn'
  // その他
  | 'shopify' | 'coupang' | 'mercari_jp' | 'mercari_us'
  | 'yahoo_auction' | 'yahoo_shopping' | 'rakuten';

export type Currency = 'USD' | 'JPY' | 'GBP' | 'EUR' | 'AUD' | 'SGD' | 'MYR' | 'THB' | 'PHP' | 'TWD' | 'VND' | 'KRW';
export type Language = 'en' | 'ja' | 'ko' | 'zh' | 'th' | 'vi';

// =====================================================
// マーケットプレイス設定
// =====================================================
export interface MarketplaceConfig {
  id: MarketplaceId;
  name: string;
  displayName: string;
  currency: Currency;
  language: Language;
  region: string;
  
  // 手数料構造
  fees: {
    platformFeePercent: number;      // プラットフォーム手数料 (%)
    paymentFeePercent: number;       // 決済手数料 (%)
    paymentFeeFixed?: number;        // 決済固定手数料 (現地通貨)
    categoryFees?: Record<string, number>; // カテゴリ別手数料
  };
  
  // 画像要件
  maxImages: number;
  imageRequirements?: {
    minWidth: number;
    minHeight: number;
    maxFileSizeMB: number;
  };
  
  // 出品要件
  requiredFields: string[];
  
  // API情報
  apiType: 'trading' | 'rest' | 'graphql' | 'csv_upload';
  enabled: boolean;
}

// =====================================================
// 利益計算入力
// =====================================================
export interface PricingInput {
  // 原価情報
  costPriceJpy: number;              // 仕入れ価格（円）
  
  // 配送情報
  weightGrams?: number;              // 重量（g）
  dimensions?: {                     // サイズ（cm）
    length: number;
    width: number;
    height: number;
  };
  shippingCarrier?: string;          // 配送業者
  
  // オプション
  targetMarketplaces?: MarketplaceId[];
  targetCountry?: string;
  category?: string;
}

// =====================================================
// 利益計算結果
// =====================================================
export interface PricingResult {
  marketplace: MarketplaceId;
  marketplaceName: string;
  currency: Currency;
  exchangeRate: number;
  
  // 価格
  suggestedPrice: number;            // 推奨販売価格（現地通貨）
  suggestedPriceJpy: number;         // 推奨販売価格（円換算）
  
  // コスト内訳
  shippingCost: number;              // 送料（現地通貨）
  shippingCostJpy: number;           // 送料（円）
  platformFee: number;               // プラットフォーム手数料
  platformFeeJpy: number;
  paymentFee: number;                // 決済手数料
  paymentFeeJpy: number;
  totalFees: number;                 // 合計手数料
  totalFeesJpy: number;
  
  // 利益
  profitLocal: number;               // 純利益（現地通貨）
  profitJpy: number;                 // 純利益（円）
  profitMargin: number;              // 利益率（%）
  
  // ステータス
  isProfitable: boolean;
  warnings: string[];
  
  // 内訳詳細
  breakdown: {
    costJpy: number;
    shippingJpy: number;
    feesJpy: number;
    revenueJpy: number;
  };
}

// =====================================================
// 出品キュー
// =====================================================
export type ListingQueueStatus = 
  | 'draft'       // 下書き
  | 'scheduled'   // スケジュール済み
  | 'pending'     // 実行待ち
  | 'running'     // 実行中
  | 'completed'   // 完了
  | 'error'       // エラー
  | 'cancelled';  // キャンセル

export interface ListingQueueItem {
  id: string;
  productMasterId: string;
  marketplace: MarketplaceId;
  status: ListingQueueStatus;
  scheduledAt?: Date;
  
  // 出品データ
  listingData: {
    title: string;
    description: string;
    price: number;
    quantity: number;
    categoryId?: string;
    images: string[];
    itemSpecifics?: Record<string, string>;
    shippingPolicy?: Record<string, any>;
    marketplaceSpecific?: Record<string, any>;
  };
  
  // 利益計算結果
  profitCalculation?: PricingResult;
  
  // 実行結果
  marketplaceItemId?: string;
  marketplaceUrl?: string;
  executedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  
  // 監査
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// =====================================================
// API レスポンス
// =====================================================
export interface MultiMarketplacePricingResponse {
  success: boolean;
  results: PricingResult[];
  bestMarketplace?: MarketplaceId;
  summary: {
    totalMarketplaces: number;
    profitableCount: number;
    averageProfitJpy: number;
    maxProfitJpy: number;
    maxProfitMarketplace: MarketplaceId | null;
  };
  calculatedAt: string;
  error?: string;
}

export interface ListingQueueResponse {
  success: boolean;
  items?: ListingQueueItem[];
  total?: number;
  error?: string;
}
