/**
 * 在庫価格改定エンジンの型定義
 * Phase 1 - ツール1: 在庫価格改定エンジン
 */

// 改定ステージ
export type RevisionStage = 0 | 3 | 7

// 改定緊急度
export type RevisionUrgency = 'normal' | 'due_3month' | 'overdue_7month'

// 改定タイプ
export type RevisionType =
  | 'auto_3month'      // 3ヶ月自動改定
  | 'auto_7month'      // 7ヶ月自動改定（原価割れ）
  | 'manual_extension' // 手動延長
  | 'manual_adjustment' // 手動調整

/**
 * 在庫価格改定ルール
 */
export interface InventoryPricingRule {
  id: string
  product_id: string

  // 仕入情報
  purchase_date: string // YYYY-MM-DD
  original_cost_jpy: number
  current_price_usd: number | null

  // 改定ステージ
  revision_stage: RevisionStage
  next_revision_date: string | null

  // 設定
  auto_revision_enabled: boolean
  manual_extension_until: string | null
  extension_reason: string | null
  approved_by: string | null

  // メタ情報
  created_at: string
  updated_at: string
}

/**
 * 在庫価格改定履歴
 */
export interface InventoryPricingHistory {
  id: string
  pricing_rule_id: string
  product_id: string

  // 改定内容
  revision_type: RevisionType
  old_price_usd: number | null
  new_price_usd: number | null
  old_revision_stage: RevisionStage | null
  new_revision_stage: RevisionStage | null

  // 理由・メモ
  reason: string | null
  performed_by: string | null

  // メタ情報
  created_at: string
}

/**
 * 改定が必要な商品（ビューの型）
 */
export interface InventoryPricingDueForRevision {
  pricing_rule_id: string
  product_id: string
  product_name: string
  sku: string | null
  purchase_date: string
  original_cost_jpy: number
  current_price_usd: number | null
  revision_stage: RevisionStage
  next_revision_date: string | null
  days_since_purchase: number
  revision_urgency: RevisionUrgency
}

/**
 * 価格改定計算結果
 */
export interface PriceRevisionCalculation {
  product_id: string
  current_price_usd: number
  recommended_price_usd: number
  revision_type: RevisionType
  reason: string
  profit_margin_before: number // %
  profit_margin_after: number // %
  should_revise: boolean
}

/**
 * 価格改定実行リクエスト
 */
export interface ExecutePriceRevisionRequest {
  product_id: string
  new_price_usd: number
  revision_type: RevisionType
  reason?: string
  performed_by: string
}

/**
 * 価格改定実行レスポンス
 */
export interface ExecutePriceRevisionResponse {
  success: boolean
  message: string
  updated_rule?: InventoryPricingRule
  history_entry?: InventoryPricingHistory
  marketplace_updates?: {
    marketplace: string
    success: boolean
    error?: string
  }[]
}

/**
 * 一括価格改定リクエスト
 */
export interface BatchPriceRevisionRequest {
  product_ids: string[]
  revision_type: RevisionType
  performed_by: string
  dry_run?: boolean // trueの場合、実際には更新せずシミュレーションのみ
}

/**
 * 一括価格改定レスポンス
 */
export interface BatchPriceRevisionResponse {
  total_products: number
  successful_revisions: number
  failed_revisions: number
  skipped_products: number
  details: {
    product_id: string
    success: boolean
    error?: string
    old_price_usd?: number
    new_price_usd?: number
  }[]
}

/**
 * 延長申請リクエスト
 */
export interface ExtensionRequest {
  pricing_rule_id: string
  extension_until: string // YYYY-MM-DD
  reason: string
  requested_by: string
}

/**
 * 延長申請レスポンス
 */
export interface ExtensionResponse {
  success: boolean
  message: string
  approval_required: boolean // 親会社承認が必要か
  updated_rule?: InventoryPricingRule
}

/**
 * 価格改定統計
 */
export interface PricingRevisionStats {
  total_products_with_rules: number
  products_due_for_revision: number
  products_3month_stage: number
  products_7month_stage: number
  products_extended: number
  average_days_since_purchase: number
  total_inventory_value_jpy: number

  // 緊急度別
  normal: number
  due_3month: number
  overdue_7month: number
}

/**
 * 価格改定ダッシュボードデータ
 */
export interface PricingRevisionDashboard {
  stats: PricingRevisionStats
  due_for_revision: InventoryPricingDueForRevision[]
  recent_revisions: InventoryPricingHistory[]
  pending_extensions: InventoryPricingRule[]
}
