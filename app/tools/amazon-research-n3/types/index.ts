// app/tools/amazon-research-n3/types/index.ts
/**
 * Amazon Research N3 - 型定義
 * 
 * PA-API / SP-API / Keepa から取得可能なデータを網羅
 */

// ============================================================
// リスクフラグ
// ============================================================

export type RiskFlag = 
  | 'ip_risk'           // 知的財産リスク（VeRO等）
  | 'hazmat'            // 危険物
  | 'restricted'        // 出品制限
  | 'approval_required' // 承認必要
  | 'amazon_sell'       // Amazon直販
  | 'high_competition'  // 競合多
  | 'price_volatile'    // 価格変動大
  | 'low_margin'        // 低利益率
  | 'seasonal'          // 季節商品
  | 'high_return'       // 返品率高
  | 'new_product'       // 新製品（情報）
  | 'variation';        // バリエーション（情報）

export type RiskLevel = 'low' | 'medium' | 'high';

// ============================================================
// Amazon商品データ（PA-API + SP-API）
// ============================================================

export interface AmazonProductData {
  // 基本情報
  asin: string;
  parent_asin?: string;
  title: string;
  title_ja?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  part_number?: string;
  color?: string;
  size?: string;
  
  // カテゴリ
  browse_node_id?: string;
  browse_node_name?: string;
  browse_node_path?: string;
  product_group?: string;
  category?: string;
  sub_category?: string;
  
  // 画像
  main_image_url?: string;
  image_urls?: string[];
  image_height?: number;
  image_width?: number;
  
  // 価格（日本円）
  list_price_jpy?: number;
  amazon_price_jpy?: number;
  buy_box_price_jpy?: number;
  lowest_new_price_jpy?: number;
  lowest_used_price_jpy?: number;
  savings_amount?: number;
  savings_percentage?: number;
  
  // 価格（USD - 参考）
  amazon_price_usd?: number;
  buy_box_price_usd?: number;
  
  // 在庫/出品者
  availability?: string;
  is_prime?: boolean;
  merchant_name?: string;
  is_amazon?: boolean;
  
  // FBA関連
  is_fba_eligible?: boolean;
  fba_fees_jpy?: number;
  referral_fee_percent?: number;
  storage_fee_jpy?: number;
  
  // 物理情報
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  weight_g?: number;
  package_length_cm?: number;
  package_width_cm?: number;
  package_height_cm?: number;
  package_weight_g?: number;
  
  // 出品者数
  new_offer_count?: number;
  used_offer_count?: number;
  fba_offer_count?: number;
  fbm_offer_count?: number;
  
  // 制限
  is_restricted?: boolean;
  restriction_reason?: string;
  requires_approval?: boolean;
  hazmat_type?: string;
  is_adult_product?: boolean;
  
  // その他
  release_date?: string;
  warranty?: string;
  features?: string[];
  description?: string;
}

// ============================================================
// Keepaデータ（履歴・推定値）
// ============================================================

export interface KeepaData {
  // BSR
  bsr_current?: number;
  bsr_30d_avg?: number;
  bsr_90d_avg?: number;
  bsr_drops_30d?: number;
  bsr_drops_90d?: number;
  bsr_category?: string;
  
  // 価格履歴
  price_amazon_30d_avg?: number;
  price_amazon_90d_avg?: number;
  price_amazon_min?: number;
  price_amazon_max?: number;
  price_new_30d_avg?: number;
  
  // 販売推定
  monthly_sales_estimate?: number;
  monthly_revenue_estimate?: number;
  
  // 在庫履歴
  out_of_stock_percentage_30d?: number;
  out_of_stock_percentage_90d?: number;
  
  // レビュー
  review_count?: number;
  star_rating?: number;
  rating_count_30d?: number;
  rating_avg_30d?: number;
  
  // その他
  first_available?: string;
  last_price_change?: string;
  buy_box_seller_id?: string;
}

// ============================================================
// N3計算値
// ============================================================

export interface N3ScoreBreakdown {
  profit_score: number;      // 利益スコア（0-30）
  demand_score: number;      // 需要スコア（0-30）
  competition_score: number; // 競合スコア（0-20）
  risk_score: number;        // リスクスコア（0-20）
}

export interface N3Calculations {
  // N3基本スコア (PA-API)
  n3_score?: number;
  n3_score_breakdown?: N3ScoreBreakdown;
  
  // N3 Keepaスコア (履歴データ)
  n3_keepa_score?: number;
  n3_keepa_breakdown?: N3ScoreBreakdown;
  
  // N3 AIスコア (将来)
  n3_ai_score?: number;
  n3_ai_breakdown?: N3ScoreBreakdown & { ai_bonus?: number };
  
  // 表示用スコア
  display_score?: number;
  score_confidence?: 'low' | 'medium' | 'high';
  
  // 利益計算
  estimated_cost_jpy?: number;        // 推定仕入れ原価
  estimated_profit_jpy?: number;      // 推定利益（円）
  estimated_profit_usd?: number;      // 推定利益（USD）
  estimated_profit_margin?: number;   // 推定利益率（%）
  
  // eBay向け
  ebay_estimated_price_usd?: number;  // eBay想定販売価格
  ebay_estimated_profit_usd?: number; // eBay想定利益
  
  // 送料
  estimated_shipping_jpy?: number;    // 推定送料
  shipping_method?: string;           // 推奨配送方法
}

// ============================================================
// 統合リサーチアイテム
// ============================================================

export interface AmazonResearchItem extends AmazonProductData, KeepaData, N3Calculations {
  id: string;
  
  // リスク評価
  risk_flags?: RiskFlag[];
  risk_level?: RiskLevel;
  risk_notes?: string;
  
  // 特殊判定
  is_new_product?: boolean;      // 新製品（3ヶ月以内）
  is_variation?: boolean;        // バリエーション商品
  is_variation_candidate?: boolean; // バリエーション候補
  is_set_candidate?: boolean;    // セット候補
  variation_attributes?: string[]; // バリエーション属性
  
  // カテゴリ評価
  category_popularity?: 'high' | 'medium' | 'low';
  category_multiplier?: number;
  
  // 状態
  status: 'pending' | 'processing' | 'completed' | 'error' | 'exists' | 'archived';
  error_message?: string;
  
  // 自動追跡
  is_auto_tracked?: boolean;
  auto_track_interval?: string;
  last_auto_update?: string;
  
  // メタ
  source?: 'manual' | 'batch' | 'auto' | 'seller_mirror';
  source_reference?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// ============================================================
// フィルター・ソート
// ============================================================

export type ResearchFilterType = 
  | 'all'
  | 'high_score'         // N3スコア80+
  | 'profitable'         // 利益率20%+
  | 'high_sales'         // 月販100+
  | 'low_competition'    // FBA出品者5以下
  | 'new_products'       // 新製品
  | 'risky'              // リスクあり
  | 'exists'             // DB登録済み
  | 'variation_candidates' // バリエーション候補
  | 'set_candidates'     // セット候補
  | 'auto_tracked';      // 自動追跡中

export type ResearchSortType = 
  | 'score_desc'         // N3スコア高い順
  | 'score_asc'
  | 'profit_desc'        // 利益率高い順
  | 'profit_asc'
  | 'sales_desc'         // 月販多い順
  | 'sales_asc'
  | 'bsr_asc'            // BSR良い順
  | 'bsr_desc'
  | 'review_desc'        // レビュー多い順
  | 'price_desc'         // 価格高い順
  | 'price_asc'
  | 'date_desc'          // 取得日新しい順
  | 'date_asc';

export interface ResearchFilter {
  type: ResearchFilterType;
  category?: string;
  brand?: string;
  minScore?: number;
  maxScore?: number;
  minProfit?: number;
  maxProfit?: number;
  minBsr?: number;
  maxBsr?: number;
  minSales?: number;
  maxSales?: number;
}

// ============================================================
// 統計
// ============================================================

export interface ResearchStats {
  total: number;
  completed: number;
  pending: number;
  errors: number;
  
  // スコア別
  high_score_count: number;     // 80+
  medium_score_count?: number;  // 60-79
  low_score_count?: number;     // <60
  
  // 利益別
  profitable_count: number;     // 20%+
  marginal_count?: number;      // 10-19%
  unprofitable_count?: number;  // <10%
  
  // 需要別
  high_sales_count: number;     // 100+/月
  medium_sales_count?: number;  // 30-99/月
  low_sales_count?: number;     // <30/月
  
  // 競合別
  low_competition_count?: number;    // FBA 5以下
  medium_competition_count?: number; // FBA 6-15
  high_competition_count?: number;   // FBA 16+
  
  // 特殊
  new_products_count?: number;
  variation_candidates_count?: number;
  set_candidates_count?: number;
  risky_count?: number;
  
  // DB関連
  exists_in_db_count: number;
  auto_tracked_count: number;
  
  // 平均値
  avg_score: number;
  avg_profit_margin: number;
  avg_monthly_sales: number;
  avg_bsr?: number;
  avg_review_count?: number;
  
  // カテゴリ・ブランド分布
  top_categories: { name: string; count: number }[];
  top_brands: { name: string; count: number }[];
}

// ============================================================
// 自動化設定
// ============================================================

export interface AutoResearchConfig {
  id: string;
  name: string;
  enabled: boolean;
  
  // スケジュール
  schedule_type: 'daily' | 'weekly' | 'hourly';
  schedule_time?: string;
  schedule_days?: number[];
  
  // ソース
  source_type: 'seller_ids' | 'keywords' | 'category' | 'asin_list';
  source_config: {
    seller_ids?: string[];
    keywords?: string[];
    category_id?: string;
    asin_list?: string[];
  };
  
  // フィルター
  filter_config: {
    min_score?: number;
    min_profit_margin?: number;
    max_bsr?: number;
    max_fba_sellers?: number;
    exclude_brands?: string[];
    exclude_categories?: string[];
  };
  
  // 通知
  notify_on_new_high_score?: boolean;
  notify_email?: string;
  
  // 統計
  last_run?: string;
  last_run_count?: number;
  total_items_added?: number;
  
  created_at: string;
  updated_at: string;
}

// ============================================================
// API関連
// ============================================================

export interface BatchResearchRequest {
  asins: string[];
  options?: {
    fetch_keepa?: boolean;
    calculate_profit?: boolean;
    check_restrictions?: boolean;
  };
}

export interface BatchResearchResponse {
  success: boolean;
  total: number;
  completed: number;
  failed: number;
  results: AmazonResearchItem[];
  errors?: { asin: string; error: string }[];
}

// ============================================================
// エクスポート設定
// ============================================================

export interface ExportConfig {
  format: 'csv' | 'xlsx' | 'json';
  columns: (keyof AmazonResearchItem)[];
  includeScoreBreakdown?: boolean;
  includeRiskDetails?: boolean;
  filename?: string;
}

export const DEFAULT_EXPORT_COLUMNS: (keyof AmazonResearchItem)[] = [
  'asin', 'parent_asin', 'title', 'brand', 'manufacturer', 'model', 'category',
  'browse_node_id', 'main_image_url', 'amazon_price_jpy', 'buy_box_price_jpy',
  'lowest_new_price_jpy', 'ebay_estimated_price_usd', 'estimated_profit_jpy',
  'estimated_profit_usd', 'estimated_profit_margin', 'fba_fees_jpy',
  'referral_fee_percent', 'bsr_current', 'bsr_30d_avg', 'bsr_drops_30d',
  'monthly_sales_estimate', 'monthly_revenue_estimate', 'new_offer_count',
  'fba_offer_count', 'is_amazon', 'review_count', 'star_rating',
  'length_cm', 'width_cm', 'height_cm', 'weight_g', 'release_date',
  'first_available', 'is_restricted', 'hazmat_type', 'is_adult_product',
  'out_of_stock_percentage_30d', 'n3_score', 'risk_flags',
  'is_new_product', 'is_variation', 'features', 'description', 'created_at'
];
