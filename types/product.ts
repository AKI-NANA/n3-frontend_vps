/**
 * 商品データ型定義
 * NAGANO-3モーダルシステム用
 */

/**
 * 参照URL（仕入れ先候補）
 */
export interface ReferenceUrl {
  url: string;
  price: number;
}

/**
 * 仕入れ先プラットフォーム
 */
export type SupplierSource = 
  | 'yahoo_auction'    // ヤフオク
  | 'amazon_jp'        // Amazon JP
  | 'rakuten'          // 楽天
  | 'mercari'          // メルカリ
  | 'yahoo_shopping'   // Yahoo!ショッピング
  | 'au_pay_market'    // au PAYマーケット
  | 'other';           // その他

/**
 * 仕入れ先スクレイピングデータ（Amazon JP基準）
 */
export interface ScrapedSupplierData {
  source: SupplierSource;
  source_url: string;
  scraped_at: string;
  
  // 基本情報
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  
  // 識別情報
  asin?: string;               // Amazon ASIN
  jan_code?: string;           // JANコード
  isbn?: string;               // ISBN
  sku?: string;                // SKU
  item_id?: string;            // オークションID等
  
  // ブランド・メーカー
  brand?: string;
  manufacturer?: string;
  model_number?: string;
  
  // 在庫・販売情報
  in_stock?: boolean;
  stock_quantity?: number;
  seller_name?: string;
  seller_rating?: number;
  
  // レビュー情報（Amazon等）
  review_count?: number;
  star_rating?: number;
  
  // 配送情報
  shipping_fee?: number;
  prime_eligible?: boolean;
  estimated_delivery?: string;
  
  // 画像
  images?: string[];
  main_image?: string;
  
  // 商品仕様（Amazon詳細）
  specifications?: Record<string, string>;
  
  // 生データ（バックアップ用）
  raw_data?: Record<string, any>;
}

/**
 * 出品先マーケットプレイスID
 */
export type ListingMarketplace = 
  | 'ebay_us' 
  | 'ebay_uk' 
  | 'ebay_de' 
  | 'ebay_au'
  | 'qoo10_jp'
  | 'amazon_jp'
  | 'mercari_jp'
  | 'rakuma_jp'
  | 'yahoo_auction_jp'
  | 'shopee_sg';

/**
 * 統一出品ステータス
 */
export interface UnifiedListingStatus {
  marketplace: ListingMarketplace;
  status: 'not_listed' | 'draft' | 'pending' | 'listed' | 'ended' | 'error';
  listing_id?: string;           // モールID
  external_listing_id?: string;  // 外部ID（ベキ等性確保用）
  listed_price?: number;
  currency: string;
  listed_at?: string;
  updated_at?: string;
  error_message?: string;
}

/**
 * 各マーケットプレイス出品データ（一元管理）
 */
export interface MarketplaceListings {
  ebay_us?: UnifiedListingStatus;
  ebay_uk?: UnifiedListingStatus;
  ebay_de?: UnifiedListingStatus;
  ebay_au?: UnifiedListingStatus;
  qoo10_jp?: UnifiedListingStatus;
  amazon_jp?: UnifiedListingStatus;
  mercari_jp?: UnifiedListingStatus;
  rakuma_jp?: UnifiedListingStatus;
  yahoo_auction_jp?: UnifiedListingStatus;
  shopee_sg?: UnifiedListingStatus;
}

/**
 * Qoo10出品データ（Product内埋め込み用）
 */
export interface Qoo10ProductData {
  item_code?: string;
  category_code: string;
  category_name?: string;
  selling_price: number;
  market_price?: number;
  cost_price?: number;
  stock_quantity: number;
  shipping_carrier: 'yamato' | 'jp_post' | 'sagawa';
  shipping_size: string;
  shipping_fee: number;
  is_free_shipping: boolean;
  qoo10_fee_percent: number;
  payment_fee_percent: number;
  net_profit?: number;
  profit_margin_percent?: number;
  html_description?: string;
  listing_status: 'draft' | 'pending' | 'listed' | 'error';
  listed_at?: string;
}

/**
 * リサーチステータス（統一型）
 */
export type ResearchStatus = 'Pending' | 'Promoted' | 'Rejected' | 'Draft';

/**
 * 商品ステータス（ワークフロー全体）
 */
export type ProductStatus =
  | '取得完了'                  // スクレイピング完了
  | '優先度決定済'              // 優先度スコア算出完了
  | 'AI処理中'                  // Gemini AI処理中
  | '外注処理完了'              // 外注作業完了
  | '戦略決定済'                // 戦略エンジン実行完了
  | '編集完了'                  // データ編集完了（Phase 5）
  | '出品スケジュール待ち'      // 承認済み・バッチ出品待ち（Phase 5）
  | '出品中'                    // 実際に出品中
  | '出品停止'                  // 出品停止
  | '戦略キャンセル'            // 承認却下（Phase 5）
  | 'APIリトライ待ち';          // API一時エラー

/**
 * 実行ステータス（Phase 5: バッチ出品の結果）
 */
export type ExecutionStatus =
  | 'pending'                   // 実行待ち
  | 'processing'                // 実行中
  | 'listed'                    // 出品成功
  | 'api_retry_pending'         // リトライ待ち
  | 'listing_failed'            // 出品失敗
  | 'skipped';                  // スキップ

export interface Product {
  id: string;
  asin: string;
  sku: string;
  master_key?: string; // Master Key追加
  title: string;
  description?: string;
  price: number;
  cost?: number;
  profit?: number;

  // HTS分類情報（学習システム用）
  category_name?: string | null;
  brand_name?: string | null;
  material?: string | null;
  hts_code?: string | null;
  origin_country?: string | null;

  // HTS自動判定結果
  suggested_category?: string;
  suggested_brand?: string;
  suggested_material?: string;
  suggested_hts?: string;
  hts_score?: number;
  hts_confidence?: 'very_high' | 'high' | 'medium' | 'low' | 'uncertain';
  hts_source?: 'learning' | 'category_master' | 'brand_master' | 'material_pattern' | 'official';
  origin_country_hint?: string;

  // 確認状態
  hts_needs_review?: boolean;
  hts_is_approved?: boolean;

  // 画像データ
  images: ProductImage[];
  selectedImages: string[];

  // カテゴリ情報
  category?: Category;

  // 在庫情報
  stock?: StockInfo;

  // マーケットプレイス情報
  marketplace?: MarketplaceData;

  // --- 無在庫輸入システム用フィールド ---
  // スコアリングと分析
  arbitrage_score?: number | null;
  keepa_data?: Record<string, any> | null;

  // 無在庫に必要なリードタイムと価格情報
  potential_supplier?: 'Amazon_US' | 'Amazon_EU' | 'AliExpress';
  supplier_current_price?: number; // 仕入れ元の現在価格 (USD/EURなど)
  estimated_lead_time_days?: number; // 仕入れ元から日本倉庫への到着予測日数

  // 販売チャネルとステータス
  amazon_jp_listing_id?: string | null;
  ebay_jp_listing_id?: string | null;

  // ステータス追跡（無在庫フロー）
  arbitrage_status?: 'in_research' | 'tracked' | 'listed_on_multi' | 'order_received_and_purchased' |
                    'in_transit_to_japan' | 'awaiting_inspection' | 'shipped_to_customer';

  // === 新しいバックエンド機能 (B-1, B-2, B-3) のためのフィールド ===
  // B-1: 商品データ取得と重複排除エンジン
  external_url?: string; // 外部サイトURL (Primary Key)
  asin_sku?: string | null; // 外部サイトのASIN または SKU (Fallback Key)
  ranking?: number | null; // 商品ランキング
  sales_count?: number | null; // 販売数 (Ebay Sold数など)
  release_date?: string | null; // 発売日
  is_duplicate?: boolean; // 重複フラグ
  status?: ProductStatus; // データ処理ステータス
  execution_status?: ExecutionStatus; // 実行ステータス（Phase 5）

  // B-2: AI処理優先度決定ロジック
  priority_score?: number | null; // 優先度スコア (0〜1000)

  // B-3: 在庫・価格追従システム (回転率対策)
  reference_urls?: ReferenceUrl[]; // 複数の参照URL（仕入先候補）
  median_price?: number | null; // 参照URL群の価格中央値
  current_stock_count?: number | null; // 現在の在庫数
  last_check_time?: string | null; // 最終チェック時刻
  check_frequency?: '通常' | '高頻度' | string; // 在庫チェック間隔

  // 多販路出品戦略システム (Strategy Engine)
  recommended_platform?: string | null; // 推奨プラットフォーム
  recommended_account_id?: number | null; // 推奨アカウントID
  strategy_score?: number | null; // 戦略スコア
  strategy_decision_data?: any; // JSONB: 全候補と除外理由

  // メタデータ
  createdAt?: string;
  updatedAt?: string;
  lastEditedBy?: string;

  // 新しい統一ステータスフィールド
  research_status?: ResearchStatus; // リサーチステータス（既存のstatusと共存）

  // === 多販路出品システム拡張（V9.3追加） ===
  
  // 仕入れ先スクレイピングデータ（Amazon JP等の詳細データ）
  scraped_data?: ScrapedSupplierData;
  
  // 各マーケットプレイス出品データ（一元管理）
  marketplace_listings?: MarketplaceListings;
  
  // 国内販売用フィールド
  japanese_title?: string;           // 日本語タイトル
  description_ja?: string;           // 日本語説明文
  purchase_price_jpy?: number;       // 仕入れ価格（円）
  domestic_price_jpy?: number;       // 国内販売価格（円）
  jan_code?: string;                 // JANコード
  model_number?: string;             // 型番
  manufacturer?: string;             // メーカー
  
  // サイズ・重量（国内送料計算用）
  weight_g?: number;                 // 重量（グラム）
  length_cm?: number;                // 縦（cm）
  width_cm?: number;                 // 横（cm）
  height_cm?: number;                // 高さ（cm）
  
  // Qoo10用フィールド
  qoo10_category_code?: string;      // Qoo10カテゴリコード
  qoo10_html?: string;               // Qoo10用HTML説明文
  qoo10_data?: Qoo10ProductData;     // Qoo10出品データ
}

export interface ProductImage {
  id: string;
  url: string;
  thumbnail?: string;
  isMain: boolean;
  order: number;
  alt?: string;
  selected?: boolean;
}

export interface Category {
  id: string;
  name: string;
  path: string[];
  confidence?: number;
  suggestedBy?: 'ai' | 'manual' | 'rule';
}

export interface StockInfo {
  available: number;
  reserved: number;
  incoming?: number;
  location?: string;
  lastUpdated?: string;
}

export interface MarketplaceData {
  id: string;
  name: string;
  listingId?: string;
  status: 'draft' | 'active' | 'paused' | 'ended';
  listedPrice?: number;
  fees?: MarketplaceFees;
}

export interface MarketplaceFees {
  commission: number;
  shipping?: number;
  other?: number;
  total: number;
}

/**
 * API リクエスト/レスポンス型
 */

export interface GetProductRequest {
  id?: string;
  asin?: string;
  sku?: string;
}

export interface GetProductResponse {
  success: boolean;
  data?: Product;
  error?: string;
  message?: string;
}

export interface UpdateProductRequest {
  id: string;
  updates: Partial<Product>;
}

export interface UpdateProductResponse {
  success: boolean;
  data?: Product;
  error?: string;
  message?: string;
}

export interface SaveImagesRequest {
  productId: string;
  images: string[];
  marketplace?: string;
}

export interface SaveImagesResponse {
  success: boolean;
  savedCount?: number;
  error?: string;
  message?: string;
}

/**
 * モーダル状態型
 */

export interface ProductModalState {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'create';
  product: Product | null;
  loading: boolean;
  error: string | null;
  isDirty: boolean;
}

export interface ProductModalActions {
  open: (productId: string, mode?: 'view' | 'edit') => Promise<void>;
  close: () => void;
  save: () => Promise<void>;
  reset: () => void;
  updateField: (field: keyof Product, value: any) => void;
}

/**
 * HTS学習システム型
 */

export interface HtsSearchResult {
  hts_code: string;
  score: number;
  confidence: 'very_high' | 'high' | 'medium' | 'low' | 'uncertain';
  source: 'learning' | 'category_master' | 'brand_master' | 'material_pattern' | 'official';
  description: string;
  general_rate?: string;
  origin_country_hint?: string;
}

export interface HtsSearchRequest {
  title_ja?: string;
  category?: string;
  brand?: string;
  material?: string;
  keywords?: string;
}

export interface HtsSearchResponse {
  success: boolean;
  data?: {
    candidates: HtsSearchResult[];
    count: number;
    autoSelected?: {
      hts_code: string;
      confidence: string;
      score: number;
    };
  };
  error?: string;
}

export interface HtsLearningRecord {
  product_title: string;
  category: string;
  brand: string;
  material: string;
  hts_code: string;
  origin_country: string;
  keywords: string;
  score: number;
}
