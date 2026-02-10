/**
 * 統合リサーチシステム 型定義
 * research_repository テーブルに対応
 * 
 * @description
 * - research-table と research-n3 で共有
 * - 全てのリサーチ関連コンポーネントはこのファイルから型をインポート
 * 
 * @updated 2024-12-14 統合版
 */

// ============================================
// 基本型定義
// ============================================

/** ソースタイプ */
export type ResearchSource =
  | 'ebay_sold'
  | 'ebay_seller'
  | 'amazon'
  | 'yahoo_auction'
  | 'rakuten'
  | 'manual'
  | 'batch';

/** リスクレベル */
export type RiskLevel = 'low' | 'medium' | 'high';

/** 刈り取りステータス */
export type KaritoriStatus = 'none' | 'watching' | 'alert' | 'purchased' | 'skipped';

/** 購入ステータス（自動判定） */
export type PurchaseStatus = 'pending' | 'auto-bought' | 'manual-skipped';

/** ワークフローステータス */
export type WorkflowStatus = 'new' | 'analyzing' | 'approved' | 'rejected' | 'promoted';

/** ワークフロータイプ */
export type WorkflowType = '無在庫' | '有在庫' | '未定';

/** コンタクトステータス */
export type ContactStatus = 'pending' | 'contacted' | 'replied' | 'negotiating' | 'confirmed' | 'rejected';

// ============================================
// メインエンティティ
// ============================================

/**
 * ResearchItem: メインエンティティ
 * research_repository テーブルのレコード型
 */
export interface ResearchItem {
  id: string;

  // 基本情報
  source: ResearchSource;
  source_url?: string;
  ebay_item_id?: string;
  asin?: string;

  // 商品情報
  title: string;
  english_title?: string;
  title_ja?: string;
  description?: string;
  image_url?: string;
  image_urls?: string[];
  images?: string[];
  thumbnail?: string;
  category_name?: string;
  category_id?: string;
  brand?: string;
  condition_name?: string;

  // 販売データ
  sold_price_usd?: number;
  sold_price_jpy?: number;
  sold_count?: number;
  competitor_count?: number;
  average_price_usd?: number;
  lowest_price_usd?: number;
  ebay_average_price_usd?: number;
  ebay_sold_count?: number;

  // 仕入先情報
  supplier_source?: string;
  supplier_price_jpy?: number;
  supplier_url?: string;
  supplier_stock?: number;
  supplier_confidence?: number;
  supplier_name?: string;

  // 利益計算
  estimated_cost_jpy?: number;
  estimated_profit_jpy?: number;
  estimated_profit_usd?: number;
  profit_margin?: number;

  // 坂路計算結果
  shipping_routes?: ShippingRoute[];
  selected_route?: string;
  usa_viable?: boolean;
  ddp_price_usd?: number;
  shipping_cost_usd?: number;
  calculated_at?: string;

  // 重量・関税情報
  weight_g?: number;
  weight_kg?: number;

  // スコア
  total_score?: number;
  profit_score?: number;
  sales_score?: number;
  risk_score?: number;
  research_score?: number;

  // リスク
  risk_level?: RiskLevel;
  section_301_risk?: boolean;
  vero_risk?: boolean;
  hts_code?: string;
  hs_code?: string;
  origin_country?: string;

  // 刈り取り関連
  karitori_status: KaritoriStatus;
  target_price_jpy?: number;
  current_price_jpy?: number;
  price_drop_percent?: number;
  bsr_rank?: number;
  karitori_reason?: string;
  purchase_status?: PurchaseStatus;

  // ワークフロー
  status: WorkflowStatus;
  workflow_type?: WorkflowType;
  promoted_product_id?: string;

  // リスティングデータ（JSONBからのマッピング）
  listing_data?: {
    weight_g?: number;
    hs_code?: string;
    origin_country?: string;
    category_id?: string;
    ebay_category_id?: string;
    [key: string]: unknown;
  };

  // メタ
  created_at: string;
  updated_at: string;
  analyzed_at?: string;
  approved_at?: string;
  calculation_error?: string;
  raw_data?: Record<string, unknown>;
}

// ============================================
// 坂路計算関連
// ============================================

/**
 * ShippingRoute: 坂路計算結果
 * USA DDP価格計算の結果を格納
 */
export interface ShippingRoute {
  route_name: string;
  carrier: string;
  carrier_name?: string;
  service_name?: string;

  // 価格情報
  product_price_usd?: number;
  shipping_cost_usd: number;
  ddp_cost_usd: number;
  total_cost_usd: number;
  total_price_usd?: number;

  // 利益情報
  profit_usd: number;
  profit_margin: number;
  profit_margin_with_refund?: number;

  // コスト内訳
  cost_breakdown?: {
    cost_jpy: number;
    cost_usd: number;
    base_shipping_usd: number;
    ddp_fee_usd: number;
    tariff_usd: number;
    ebay_fees_usd: number;
  };

  // メタ情報
  exchange_rate?: number;
  hs_code?: string;
  tariff_rate?: number;
  is_viable: boolean;
  is_selected?: boolean;
  is_recommended?: boolean;
}

/** 坂路計算リクエスト */
export interface CalculateRoutesRequest {
  itemIds: string[];
  targetMargin?: number;
}

/** 坂路計算レスポンス */
export interface CalculateRoutesResponse {
  success: boolean;
  calculated: number;
  failed: number;
  results: CalculationResult[];
  error?: string;
}

/** 個別計算結果 */
export interface CalculationResult {
  id: string;
  success: boolean;
  routes?: ShippingRoute[];
  error?: string;
}

// ============================================
// 刈り取り・仕入先関連
// ============================================

/**
 * KaritoriCategory: 刈り取りカテゴリ
 */
export interface KaritoriCategory {
  id: string;
  category_name: string;
  search_keyword: string;
  manufacturer?: string;
  high_profits_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * SupplierContact: 仕入先コンタクト
 */
export interface SupplierContact {
  id: string;
  research_item_id: string;
  supplier_name: string;
  contact_email?: string;
  contact_phone?: string;
  contact_status: ContactStatus;
  generated_email?: string;
  email_template?: string;
  sent_at?: string;
  replied_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// 統計・フィルター・ページネーション
// ============================================

/**
 * ResearchStats: 統計情報
 */
export interface ResearchStats {
  total: number;
  new: number;
  analyzing: number;
  approved: number;
  rejected: number;
  promoted: number;
  watching: number;
  alert: number;
  avg_profit_margin: number;
  avg_total_score: number;
}

/**
 * フィルター型
 */
export interface ResearchFilters {
  source?: ResearchSource;
  status?: WorkflowStatus;
  karitori_status?: KaritoriStatus;
  risk_level?: RiskLevel;
  min_profit_margin?: number;
  max_profit_margin?: number;
  min_score?: number;
  search?: string;
  usa_viable?: boolean | null;
  has_shipping_routes?: boolean;
}

/**
 * ソート型
 */
export interface ResearchSort {
  field: keyof ResearchItem;
  direction: 'asc' | 'desc';
}

/**
 * ページネーション
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

// ============================================
// API関連
// ============================================

/**
 * API レスポンス
 */
export interface ResearchApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

/**
 * ResearchActionResult: アクション結果型
 */
export interface ResearchActionResult {
  success: boolean;
  count?: number;
  found?: number;
  error?: string;
}

/**
 * リサーチテーブルのデータ取得結果
 */
export interface ResearchTableData {
  items: ResearchItem[];
  pagination: Pagination;
}

// ============================================
// タブ・UI関連
// ============================================

/**
 * タブ定義
 */
export type ResearchTab = 'research' | 'karitori' | 'supplier' | 'approval';

export interface TabConfig {
  id: ResearchTab;
  label: string;
  icon: string;
  count?: number;
}

// ============================================
// 定数定義
// ============================================

/**
 * 刈り取り判定基準
 */
export const KARITORI_CRITERIA = {
  MIN_PROFIT_RATE: 20, // 20%
  MAX_BSR_FOR_AUTO: 5000, // 5000位以下
} as const;

/**
 * ステータスカラー定義
 */
export const STATUS_COLORS = {
  new: 'bg-gray-300',
  analyzing: 'bg-yellow-500 animate-pulse',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
  promoted: 'bg-blue-500',
} as const;

export const RISK_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
} as const;

export const KARITORI_STATUS_COLORS = {
  none: 'bg-gray-200 text-gray-600',
  watching: 'bg-blue-100 text-blue-800',
  alert: 'bg-orange-100 text-orange-800',
  purchased: 'bg-green-100 text-green-800',
  skipped: 'bg-red-100 text-red-800',
} as const;

/**
 * ソースラベル
 */
export const SOURCE_LABELS: Record<ResearchSource, string> = {
  ebay_sold: 'eBay Sold',
  ebay_seller: 'eBay Seller',
  amazon: 'Amazon',
  yahoo_auction: 'Yahoo!',
  rakuten: '楽天',
  manual: '手動',
  batch: 'バッチ',
};

/**
 * N3用CSS変数カラー定義
 */
export const N3_STATUS_COLORS = {
  new: 'var(--text-muted)',
  analyzing: 'var(--warning)',
  approved: 'var(--success)',
  rejected: 'var(--error)',
  promoted: 'var(--accent)',
} as const;

export const N3_RISK_COLORS = {
  low: 'var(--success)',
  medium: 'var(--warning)',
  high: 'var(--error)',
} as const;

export const N3_KARITORI_COLORS = {
  none: 'var(--panel-border)',
  watching: 'var(--info)',
  alert: 'var(--warning)',
  purchased: 'var(--success)',
  skipped: 'var(--error)',
} as const;
