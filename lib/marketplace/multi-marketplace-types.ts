/**
 * 多販路統一型定義
 * lib/marketplace/multi-marketplace-types.ts
 * 
 * Phase 1 拡張版:
 * - 容積重量計算対応
 * - DBルックアップ結果型
 * - 送料詳細情報
 */

// =====================================================
// マーケットプレイス識別子
// =====================================================
export type MarketplaceId =
  // eBay
  | 'ebay_us' | 'ebay_uk' | 'ebay_de' | 'ebay_au' | 'ebay_fr' | 'ebay_it' | 'ebay_es' | 'ebay_ca'
  // Qoo10
  | 'qoo10_jp' | 'qoo10_sg'
  // Amazon
  | 'amazon_jp' | 'amazon_us' | 'amazon_au' | 'amazon_uk' | 'amazon_de'
  // Shopee
  | 'shopee_sg' | 'shopee_my' | 'shopee_th' | 'shopee_ph' | 'shopee_tw' | 'shopee_vn' | 'shopee_id'
  // Lazada
  | 'lazada_sg' | 'lazada_my' | 'lazada_th' | 'lazada_ph'
  // 国内
  | 'yahoo_auction_jp' | 'yahoo_shopping_jp' | 'rakuten_jp' | 'mercari_jp'
  // その他
  | 'shopify' | 'coupang' | 'mercari_us'
  // トレカ専門
  | 'tcgplayer' | 'cardmarket';

export type Currency = 'USD' | 'JPY' | 'GBP' | 'EUR' | 'AUD' | 'CAD' | 'SGD' | 'MYR' | 'THB' | 'PHP' | 'TWD' | 'VND' | 'KRW' | 'IDR';
export type Language = 'en' | 'ja' | 'ko' | 'zh' | 'th' | 'vi' | 'de' | 'fr' | 'it' | 'es';

// =====================================================
// マーケットプレイス設定
// =====================================================
export interface MarketplaceConfig {
  id: MarketplaceId;
  name: string;
  displayName: string;
  currency: Currency;
  language: Language;
  region: string; // ISO 3166-1 alpha-2 国コード
  
  // 手数料構造
  fees: {
    platformFeePercent: number;      // プラットフォーム手数料 (%)
    paymentFeePercent: number;       // 決済手数料 (%)
    paymentFeeFixed?: number;        // 決済固定手数料 (現地通貨)
    internationalFeePercent?: number; // 国際販売追加手数料 (%)
    categoryFees?: Record<string, number>; // カテゴリ別手数料
  };
  
  // 画像要件
  maxImages: number;
  imageRequirements?: {
    minWidth: number;
    minHeight: number;
    maxFileSizeMB: number;
    allowedFormats?: string[];
  };
  
  // 出品要件
  requiredFields: string[];
  
  // API情報
  apiType: 'trading' | 'rest' | 'graphql' | 'csv_upload' | 'sp-api';
  enabled: boolean;
  
  // 追加設定
  taxInfo?: {
    vatRequired: boolean;
    vatRate?: number;
    gstRequired: boolean;
    gstRate?: number;
  };
}

// =====================================================
// 利益計算入力
// =====================================================
export interface PricingInput {
  // 原価情報
  costPriceJpy: number;              // 仕入れ価格（円）
  
  // 配送情報
  weightGrams?: number;              // 重量（g）
  
  // サイズ（容積重量計算用）
  lengthCm?: number;                 // 長さ（cm）
  widthCm?: number;                  // 幅（cm）
  heightCm?: number;                 // 高さ（cm）
  
  // 旧形式（後方互換性）
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  shippingCarrier?: string;          // 配送業者（EMS, FedEx等）
  shippingServiceType?: 'EXPRESS' | 'STANDARD' | 'ECONOMY';
  
  // オプション
  targetMarketplaces?: MarketplaceId[];
  targetCountry?: string;
  
  // カテゴリ（手数料計算用）
  categoryId?: string;
  category?: string;
  
  // 梱包費
  packagingCostJpy?: number;
}

// =====================================================
// 送料詳細情報
// =====================================================
export interface ShippingDetails {
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
// 手数料詳細情報
// =====================================================
export interface FeeDetails {
  platformFeePercent: number;
  paymentFeePercent: number;
  paymentFeeFixed: number;
  internationalFeePercent: number;
  vatRate: number;
  gstRate: number;
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
  
  // Phase 1 追加: 詳細情報
  feeDetails?: FeeDetails;
  shippingDetails?: ShippingDetails;
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
// マーケットプレイス出品レコード
// =====================================================
export interface MarketplaceListing {
  id: number;
  productMasterId: number;
  marketplaceId: MarketplaceId;
  
  // 外部ID
  itemId: string | null;
  sku: string | null;
  listingUrl: string | null;
  
  // ステータス
  status: 'draft' | 'pending' | 'active' | 'ended' | 'error' | 'suspended';
  
  // 価格・在庫
  currentPrice: number | null;
  currency: Currency | null;
  stockQuantity: number;
  reservedQuantity: number;
  
  // 同期情報
  lastSyncAt: Date | null;
  lastPriceUpdateAt: Date | null;
  lastStockUpdateAt: Date | null;
  syncStatus: 'pending' | 'synced' | 'error';
  
  // 販売統計
  totalSold: number;
  totalViews: number;
  totalWatches: number;
  
  // エラー情報
  errorMessage: string | null;
  errorCode: string | null;
  errorCount: number;
  lastErrorAt: Date | null;
  
  // メタ情報
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// カテゴリマッピング
// =====================================================
export interface CategoryMapping {
  id: number;
  
  // eBay（ソースカテゴリ）
  ebayCategoryId: string | null;
  ebayCategoryName: string | null;
  
  // 各販路カテゴリ
  shopeeCategoryId: string | null;
  shopeeCategoryName: string | null;
  
  amazonNodeId: string | null;
  amazonCategoryName: string | null;
  
  qoo10CategoryId: string | null;
  qoo10CategoryName: string | null;
  
  shopifyCollectionId: string | null;
  shopifyCollectionName: string | null;
  
  lazadaCategoryId: string | null;
  lazadaCategoryName: string | null;
  
  tcgplayerCategoryId: string | null;
  tcgplayerCategoryName: string | null;
  
  cardmarketCategoryId: string | null;
  cardmarketCategoryName: string | null;
  
  // マッピング情報
  createdBy: 'ai' | 'manual';
  confidenceScore: number | null;
  verified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  
  // メタ情報
  active: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// API レスポンス
// =====================================================
export interface MultiMarketplacePricingResponse {
  success: boolean;
  results: PricingResult[];
  bestMarketplace?: MarketplaceId | null;
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

// =====================================================
// 在庫同期関連
// =====================================================
export interface StockSyncEvent {
  eventType: 'sale' | 'return' | 'cancel' | 'adjustment';
  sourceMarketplace: MarketplaceId;
  productMasterId: number;
  quantityChange: number; // 負数=減少、正数=増加
  orderNumber?: string;
  timestamp: Date;
}

export interface StockSyncResult {
  success: boolean;
  productMasterId: number;
  affectedMarketplaces: {
    marketplaceId: MarketplaceId;
    itemId: string | null;
    previousQuantity: number;
    newQuantity: number;
    status: 'success' | 'error' | 'skipped';
    errorMessage?: string;
  }[];
  executionTimeMs: number;
  timestamp: Date;
}

// =====================================================
// スコアリング関連
// =====================================================
export interface ProductScore {
  productMasterId: number;
  
  // eBay統計（スコアのベース）
  ebayViews: number;
  ebayWatches: number;
  ebaySoldSimilar: number;
  
  // 計算スコア
  calculatedScore: number;
  
  // 出品優先度
  tier: 'immediate' | 'high' | 'medium' | 'low';
  
  // 推奨販路
  recommendedMarketplaces: MarketplaceId[];
  
  updatedAt: Date;
}
