// app/tools/listing-n3/types/listing.ts
/**
 * Listing N3 型定義
 * 出品管理・SEO最適化・価格戦略の型
 */

// マーケットプレイス
export type Marketplace = 'ebay' | 'amazon' | 'mercari' | 'yahoo' | 'rakuten';

// 出品ステータス
export type ListingStatus =
  | 'draft'
  | 'pending'
  | 'scheduled'
  | 'active'
  | 'sold'
  | 'ended'
  | 'error';

// SEO最適化
export interface SeoSuggestion {
  field: 'title' | 'description' | 'keywords' | 'category';
  original: string;
  suggested: string;
  score: number;
  reason: string;
}

export interface SeoAnalysis {
  overallScore: number;
  titleScore: number;
  descriptionScore: number;
  keywordScore: number;
  suggestions: SeoSuggestion[];
  competitorKeywords: string[];
}

// 価格戦略
export interface PricePoint {
  marketplace: Marketplace;
  currentPrice: number;
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  competitorPrices: number[];
  currency: string;
}

export interface PricingStrategy {
  id: string;
  name: string;
  type: 'fixed' | 'competitive' | 'dynamic' | 'time-based';
  rules: PricingRule[];
  isActive: boolean;
}

export interface PricingRule {
  id: string;
  condition: string;
  action: 'set' | 'increase' | 'decrease';
  value: number;
  valueType: 'fixed' | 'percentage';
}

// 出品アイテム
export interface ListingItem {
  id: string;
  productId: string;
  sku: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  quantity: number;
  marketplace: Marketplace;
  status: ListingStatus;
  seoScore?: number;
  scheduledAt?: string;
  listedAt?: string;
  updatedAt: string;
  category?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  variations?: ListingVariation[];
}

export interface ListingVariation {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  quantity: number;
  images?: string[];
}

// 一括出品
export interface BulkListingJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalItems: number;
  processedItems: number;
  successItems: number;
  failedItems: number;
  marketplace: Marketplace;
  createdAt: string;
  completedAt?: string;
  errors?: BulkListingError[];
}

export interface BulkListingError {
  row: number;
  sku?: string;
  error: string;
}

// スケジュール
export interface ListingSchedule {
  id: string;
  listingId: string;
  marketplace: Marketplace;
  scheduledAt: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  error?: string;
}

// フィルター
export interface ListingFilter {
  marketplace?: Marketplace[];
  status?: ListingStatus[];
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  seoScoreMin?: number;
}

// 統計
export interface ListingStats {
  total: number;
  active: number;
  scheduled: number;
  draft: number;
  ended: number;
  avgSeoScore: number;
  totalRevenue: number;
  byMarketplace: Record<Marketplace, number>;
}

// L3タブ
export type ListingL3Tab =
  | 'seo'
  | 'pricing'
  | 'bulk'
  | 'editor'
  | 'variations';

export interface ListingL3TabConfig {
  id: ListingL3Tab;
  label: string;
  icon: string;
  count?: number;
}
