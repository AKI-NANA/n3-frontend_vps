// app/tools/editing/types/product.ts
/**
 * Product型定義 - 厳格版
 * 
 * 設計原則:
 * 1. `any` を完全排除
 * 2. 全フィールドを明示的に型定義
 * 3. ネストされたオブジェクトも完全に型定義
 * 4. 再利用可能なサブタイプを分離
 */

// ============================================================
// 基本型（再利用可能）
// ============================================================

/** ISO 8601 日時文字列 */
export type ISODateString = string;

/** UUID または 数値ID */
export type ProductId = string | number;

/** 通貨コード */
export type CurrencyCode = 'JPY' | 'USD' | 'EUR' | 'GBP';

/** 商品タイプ */
export type ProductType = 'stock' | 'dropship' | 'set' | 'unclassified';

/** ワークフローステータス */
export type WorkflowStatus = 
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'listed'
  | 'ended'
  | 'archived';

/** 出品ステータス */
export type ListingStatus = 
  | 'draft'
  | 'pending_approval'
  | 'active'
  | 'ended'
  | 'delisted'
  | 'error';

/** フィルターステータス */
export type FilterStatus = 'passed' | 'failed' | 'pending' | 'skipped';

/** HTS精度レベル */
export type HTSConfidence = 'uncertain' | 'low' | 'medium' | 'high';

/** VEROリスクレベル */
export type VeroRiskLevel = 'none' | 'low' | 'medium' | 'high' | 'blocked';

/** マーケットプレイス */
export type Marketplace = 'ebay' | 'shopee' | 'shopify' | 'amazon' | 'mercari';

/** 商品コンディション */
export type ProductCondition = 
  | 'new'
  | 'like_new'
  | 'very_good'
  | 'good'
  | 'acceptable'
  | 'for_parts';

/** 監査重大度 */
export type AuditSeverity = 'ok' | 'info' | 'warning' | 'error';

/** データ出所タイプ */
export type DataProvenanceSource = 'manual' | 'ai_fixed' | 'rule_auto' | 'scraped' | 'api';

// ============================================================
// サブタイプ（ネストされたオブジェクト）
// ============================================================

/** 画像データ */
export interface ProductImage {
  url: string;
  original?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  order?: number;
  alt?: string;
}

/** SellerMirror分析データ */
export interface SellerMirrorData {
  sales_count?: number;
  lowest_price?: number;
  average_price?: number;
  highest_price?: number;
  competitor_count?: number;
  profit_margin?: number;
  profit_amount_usd?: number;
  market_trend?: 'rising' | 'stable' | 'declining';
  fetched_at?: ISODateString;
  raw_data?: Record<string, unknown>;
}

/** 競合分析データ */
export interface CompetitorData {
  lowest_price?: number;
  average_price?: number;
  highest_price?: number;
  count?: number;
  listings?: Array<{
    seller_id?: string;
    price?: number;
    condition?: string;
    url?: string;
  }>;
}

/** リサーチデータ */
export interface ResearchData {
  sold_count?: number;
  competitor_count?: number;
  lowest_price?: number;
  average_price?: number;
  profit_margin?: number;
  profit_amount?: number;
  completed?: boolean;
  updated_at?: ISODateString;
  raw_data?: Record<string, unknown>;
}

/** カテゴリ候補 */
export interface CategoryCandidate {
  id: string;
  name: string;
  path?: string;
  confidence?: number;
}

/** 出品データ（listing_data JSONB） */
export interface ListingData {
  // 価格
  price_usd?: number;
  recommended_price_usd?: number;
  break_even_price_usd?: number;
  
  // 利益計算
  profit_amount_usd?: number;
  profit_margin?: number;
  ddu_profit_usd?: number;
  ddu_profit_margin?: number;
  ddp_profit_usd?: number;
  ddp_profit_margin?: number;
  
  // 送料
  shipping_cost_usd?: number;
  shipping_method?: string;
  shipping_policy_id?: string;
  
  // サイズ・重量
  width_cm?: number;
  length_cm?: number;
  height_cm?: number;
  weight_g?: number;
  
  // 画像
  image_urls?: string[];
  
  // その他
  quantity?: number;
  handling_time?: number;
  return_policy_id?: string;
  
  // 拡張フィールド
  [key: string]: unknown;
}

/** スクレイピングデータ */
export interface ScrapedData {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: Array<string | ProductImage>;
  seller?: string;
  location?: string;
  condition?: string;
  bid_count?: number;
  end_time?: ISODateString;
  url?: string;
  scraped_at?: ISODateString;
  raw_html?: string;
  [key: string]: unknown;
}

/** eBay APIデータ */
export interface EbayApiData {
  item_id?: string;
  listing_id?: string;
  title?: string;
  price?: number;
  currency?: string;
  condition_id?: number;
  condition_name?: string;
  category_id?: string;
  category_name?: string;
  images?: string[];
  listing_url?: string;
  start_time?: ISODateString;
  end_time?: ISODateString;
  quantity_available?: number;
  quantity_sold?: number;
  watch_count?: number;
  [key: string]: unknown;
}

/** HTMLテンプレート */
export interface HTMLTemplate {
  id?: number;
  name?: string;
  content?: string;
  variables?: Record<string, string>;
  created_at?: ISODateString;
  updated_at?: ISODateString;
}

/** 出品履歴エントリ */
export interface ListingHistoryEntry {
  marketplace: Marketplace;
  account: string;
  listing_id: string | null;
  status: 'success' | 'failed' | 'pending';
  error_message?: string | null;
  listed_at: ISODateString;
  ended_at?: ISODateString;
  price?: number;
  currency?: CurrencyCode;
}

/** 監査ログエントリ */
export interface AuditLogEntry {
  timestamp: ISODateString;
  ruleId: string;
  severity: AuditSeverity;
  field: string;
  currentValue: string | number | null;
  expectedValue?: string | number | null;
  message: string;
}

/** データ出所情報 */
export interface DataProvenanceEntry {
  source: DataProvenanceSource;
  model?: string;
  updatedAt: ISODateString;
  updatedBy?: string;
  confidence?: number;
}

/** データ出所マップ */
export interface ProductDataProvenance {
  hts_code?: DataProvenanceEntry;
  origin_country?: DataProvenanceEntry;
  material?: DataProvenanceEntry;
  weight_g?: DataProvenanceEntry;
  condition?: DataProvenanceEntry;
  [key: string]: DataProvenanceEntry | undefined;
}

/** eBay出品状態（国別） */
export interface EbayListingStatusEntry {
  itemId?: string;
  offerId?: string;
  status: 'active' | 'ended' | 'draft' | 'error';
  listingUrl?: string;
  listedAt?: ISODateString;
  endedAt?: ISODateString;
  errorMessage?: string;
}

/** eBay出品状態マップ */
export interface EbayListingStatusMap {
  US?: EbayListingStatusEntry;
  UK?: EbayListingStatusEntry;
  DE?: EbayListingStatusEntry;
  AU?: EbayListingStatusEntry;
  [country: string]: EbayListingStatusEntry | undefined;
}

// ============================================================
// メイン Product 型
// ============================================================

export interface Product {
  // ========================================
  // 基本識別情報
  // ========================================
  id: ProductId;
  sku: string | null;
  master_key?: string | null;
  source_system?: string | null;
  source_id?: string | null;
  source_item_id?: string | null;
  
  // ========================================
  // タイトル・説明
  // ========================================
  title: string;
  title_en?: string | null;
  english_title?: string | null;
  rewritten_english_title?: string | null;
  description?: string | null;
  description_en?: string | null;
  
  // ========================================
  // 価格
  // ========================================
  price_jpy?: number | null;
  price_usd?: number | null;
  current_price?: number | null;
  suggested_price?: number | null;
  cost_price?: number | null;
  listing_price?: number | null;
  purchase_price_jpy?: number | null;
  recommended_price_usd?: number | null;
  break_even_price_usd?: number | null;
  ddp_price_usd?: number | null;
  currency?: CurrencyCode | null;
  
  // ========================================
  // 在庫
  // ========================================
  current_stock?: number | null;
  inventory_quantity?: number | null;
  inventory_location?: string | null;
  last_stock_check?: ISODateString | null;
  stock_status?: string | null;
  physical_quantity?: number | null;
  
  // ========================================
  // 商品分類
  // ========================================
  product_type?: ProductType | null;
  is_stock_master?: boolean | null;
  
  // ========================================
  // ステータス
  // ========================================
  status?: string | null;
  workflow_status?: WorkflowStatus | null;
  approval_status?: string | null;
  listing_status?: ListingStatus | null;
  
  // ========================================
  // 利益計算
  // ========================================
  profit_margin?: number | null;
  profit_amount?: number | null;
  profit_amount_usd?: number | null;
  profit_margin_percent?: number | null;
  
  // ========================================
  // SellerMirror分析
  // ========================================
  sm_sales_count?: number | null;
  sm_lowest_price?: number | null;
  sm_average_price?: number | null;
  sm_competitor_count?: number | null;
  sm_profit_margin?: number | null;
  sm_profit_amount_usd?: number | null;
  sm_data?: SellerMirrorData | null;
  sm_fetched_at?: ISODateString | null;
  
  // ========================================
  // 競合分析
  // ========================================
  competitors_lowest_price?: number | null;
  competitors_average_price?: number | null;
  competitors_count?: number | null;
  competitors_data?: CompetitorData | null;
  
  // ========================================
  // リサーチ
  // ========================================
  research_sold_count?: number | null;
  research_competitor_count?: number | null;
  research_lowest_price?: number | null;
  research_profit_margin?: number | null;
  research_profit_amount?: number | null;
  research_data?: ResearchData | null;
  research_completed?: boolean | null;
  research_updated_at?: ISODateString | null;
  market_research_summary?: string | null;
  
  // ========================================
  // カテゴリ
  // ========================================
  category?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_number?: string | null;
  category_confidence?: number | null;
  category_candidates?: CategoryCandidate[] | null;
  ebay_category_id?: string | null;
  ebay_category_path?: string | null;
  
  // ========================================
  // コンディション
  // ========================================
  condition?: ProductCondition | string | null;
  condition_name?: string | null;
  recommended_condition?: ProductCondition | null;
  
  // ========================================
  // HTS・関税
  // ========================================
  hts_code?: string | null;
  hts_description?: string | null;
  hts_duty_rate?: number | null;
  hts_confidence?: HTSConfidence | null;
  hts_candidates?: Array<{
    code: string;
    description: string;
    confidence: number;
  }> | null;
  origin_country?: string | null;
  origin_country_name?: string | null;
  origin_country_duty_rate?: number | null;
  material?: string | null;
  material_duty_rate?: number | null;
  duty_rate?: number | null;
  base_duty_rate?: number | null;
  additional_duty_rate?: number | null;
  
  // ========================================
  // 送料
  // ========================================
  shipping_cost?: number | null;
  shipping_cost_usd?: number | null;
  shipping_method?: string | null;
  shipping_policy?: string | null;
  shipping_service?: string | null;
  usa_shipping_policy_name?: string | null;
  
  // ========================================
  // フィルター
  // ========================================
  filter_passed?: boolean | null;
  filter_checked_at?: ISODateString | null;
  export_filter_status?: FilterStatus | null;
  patent_filter_status?: FilterStatus | null;
  mall_filter_status?: FilterStatus | null;
  final_judgment?: string | null;
  
  // ========================================
  // VERO
  // ========================================
  is_vero_brand?: boolean | null;
  vero_brand_name?: string | null;
  vero_risk_level?: VeroRiskLevel | null;
  vero_notes?: string | null;
  vero_checked_at?: ISODateString | null;
  
  // ========================================
  // AI
  // ========================================
  ai_confidence_score?: number | null;
  ai_recommendation?: string | null;
  ai_enriched_at?: ISODateString | null;
  
  // ========================================
  // 承認
  // ========================================
  approved_at?: ISODateString | null;
  approved_by?: string | null;
  rejected_at?: ISODateString | null;
  rejected_by?: string | null;
  rejection_reason?: string | null;
  
  // ========================================
  // 出品
  // ========================================
  listing_priority?: string | null;
  selected_mall?: Marketplace | null;
  target_marketplaces?: Marketplace[] | null;
  scheduled_listing_date?: ISODateString | null;
  listing_session_id?: string | null;
  ebay_item_id?: string | null;
  ebay_listing_url?: string | null;
  listed_at?: ISODateString | null;
  ready_to_list?: boolean | null;
  
  // ========================================
  // ソース情報
  // ========================================
  source?: string | null;
  source_table?: string | null;
  source_url?: string | null;
  seller?: string | null;
  location?: string | null;
  bid_count?: string | number | null;
  
  // ========================================
  // 画像
  // ========================================
  primary_image_url?: string | null;
  images?: Array<string | ProductImage> | null;
  image_urls?: string[] | null;
  gallery_images?: string[] | null;
  image_count?: number | null;
  
  // ========================================
  // JSONBデータ（型付き）
  // ========================================
  listing_data?: ListingData | null;
  scraped_data?: ScrapedData | null;
  ebay_api_data?: EbayApiData | null;
  html_templates?: HTMLTemplate[] | null;
  
  // ========================================
  // HTML
  // ========================================
  html_content?: string | null;
  html_template_id?: number | null;
  
  // ========================================
  // タイムスタンプ
  // ========================================
  created_at?: ISODateString;
  updated_at?: ISODateString;
  
  // ========================================
  // 出品履歴（仮想フィールド）
  // ========================================
  listing_history?: ListingHistoryEntry[] | null;
  
  // ========================================
  // スコアリング
  // ========================================
  total_score?: number | null;
  listing_score?: number | null;
  
  // ========================================
  // 監査・追跡（N3出品監査システム）
  // ========================================
  /** 監査ログ配列 */
  audit_logs?: AuditLogEntry[] | null;
  /** データ出所マップ */
  data_provenance?: ProductDataProvenance | null;
  /** eBay出品状態（国別） */
  ebay_listing_status?: EbayListingStatusMap | null;
  /** 生成済みHTMLキャッシュ */
  generated_html?: string | null;
  /** HTML生成日時 */
  generated_html_at?: ISODateString | null;
  
  // ========================================
  // リスクフラグ（監査結果）
  // ========================================
  /** 高関税リスク（5%超） */
  has_high_duty_risk?: boolean | null;
  /** 素材リスク（革、絹など） */
  has_material_risk?: boolean | null;
  /** バッテリーリスク（リチウム電池） */
  has_battery_risk?: boolean | null;
  /** 原産国矛盾（タイトルと設定値の不一致） */
  has_origin_mismatch?: boolean | null;
  /** タイトルから検出した原産国コード（2桁） */
  origin_detected?: string | null;
  /** 原産国検出の信頼度（0.00-1.00） */
  origin_detection_confidence?: number | null;
  /** タイトルから検出した素材 */
  material_detected?: string | null;
  
  // ========================================
  // 監査スコア
  // ========================================
  /** 監査スコア（0-100、100が完璧） */
  audit_score?: number | null;
  /** 監査重大度（ok, info, warning, error） */
  audit_severity?: AuditSeverity | null;
  /** 最終監査日時 */
  last_audit_at?: ISODateString | null;
  
  // ========================================
  // クライアントサイド専用（Storeでのみ使用）
  // ========================================
  isModified?: boolean;
}

// ============================================================
// 更新用の部分型
// ============================================================

/** Product の部分更新型 */
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at'>>;

/** 一括更新用 */
export interface ProductBulkUpdate {
  id: ProductId;
  updates: ProductUpdate;
}

// ============================================================
// API レスポンス型
// ============================================================

/** 商品一覧レスポンス */
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** 商品詳細レスポンス */
export interface ProductDetailResponse {
  product: Product;
}

/** 一括処理結果 */
export interface BatchProcessResult {
  success: number;
  failed: number;
  errors: Array<{
    id: ProductId;
    message: string;
  }>;
  processedIds: ProductId[];
}

/** 保存結果 */
export interface SaveResult {
  success: boolean;
  updated: number;
  errors?: Array<{
    id: ProductId;
    message: string;
  }>;
}

/** 削除結果 */
export interface DeleteResult {
  success: boolean;
  deleted: number;
  errors?: Array<{
    id: ProductId;
    message: string;
  }>;
}

// ============================================================
// フィルター・検索用型
// ============================================================

/** 商品フィルターパラメータ */
export interface ProductFilterParams {
  status?: ListingStatus | ListingStatus[];
  workflow_status?: WorkflowStatus | WorkflowStatus[];
  product_type?: ProductType | ProductType[];
  filter_passed?: boolean;
  is_vero_brand?: boolean;
  has_hts_code?: boolean;
  has_images?: boolean;
  price_min?: number;
  price_max?: number;
  profit_margin_min?: number;
  search?: string;
  category_id?: string;
  marketplace?: Marketplace;
}

/** ソートパラメータ */
export interface ProductSortParams {
  field: keyof Product;
  order: 'asc' | 'desc';
}

/** ページネーションパラメータ */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 商品取得パラメータ */
export interface FetchProductsParams extends PaginationParams {
  filters?: ProductFilterParams;
  sort?: ProductSortParams;
  listFilter?: string;
}

// ============================================================
// マーケットプレイス選択
// ============================================================

export interface MarketplaceSelection {
  all: boolean;
  ebay: boolean;
  shopee: boolean;
  shopify: boolean;
  amazon: boolean;
  mercari: boolean;
}

// ============================================================
// ユーティリティ型
// ============================================================

/** 商品IDの配列 */
export type ProductIds = ProductId[];

/** 正規化された商品マップ */
export type ProductMap = Record<string, Product>;

/** 商品ID文字列（常に string） */
export type ProductIdString = string;
