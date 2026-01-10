/**
 * ワークフロー自動化システム型定義
 * 自動承認・自動スケジュール生成
 */

// ===========================
// 自動承認設定
// ===========================

export type AutoApprovalLevel = 'conservative' | 'moderate' | 'aggressive'

export interface PriceRange {
  min: number
  max: number | null
}

export interface AutoApprovalSettings {
  id: string
  user_id: string

  // 基本設定
  enabled: boolean
  auto_approval_level: AutoApprovalLevel

  // 条件設定
  min_seo_score: number
  min_ai_confidence: number
  min_profit_margin: number

  // 必須フィールド
  required_fields: string[]

  // 除外設定
  excluded_categories: string[]
  excluded_price_ranges: PriceRange[]

  // 通知設定
  notification_on_approval: boolean
  notification_on_rejection: boolean
  daily_summary_email: boolean

  // 監査
  created_at: string
  updated_at: string
}

export type AutoApprovalAction = 'auto_approved' | 'auto_rejected' | 'manual_required'

export interface CheckResult {
  value: number
  required: number
  passed: boolean
}

export interface FieldCheckResult {
  missing: string[]
  passed: boolean
}

export interface ExclusionCheckResult {
  matched: string[]
  passed: boolean
}

export interface EvaluationChecks {
  seo_score: CheckResult
  ai_confidence: CheckResult
  profit_margin: CheckResult
  required_fields: FieldCheckResult
  exclusions: ExclusionCheckResult
}

export interface EvaluationResult {
  decision: AutoApprovalAction
  score: number
  checks: EvaluationChecks
  reason: string
}

export interface AutoApprovalLog {
  id: string
  product_id: string
  user_id: string
  action: AutoApprovalAction
  evaluation_data: EvaluationResult
  settings_snapshot: AutoApprovalSettings
  created_at: string
}

// ===========================
// デフォルトスケジュール設定
// ===========================

export type TriggerCondition = 'immediate' | 'daily_batch' | 'weekly_batch'

export interface PlatformScheduleSettings {
  max_per_day: number
  preferred_hours: number[]
  enabled?: boolean
}

export interface DefaultScheduleSettings {
  id: string
  user_id: string

  // 基本設定
  enabled: boolean

  // 出品数設定
  items_per_day: number
  sessions_per_day_min: number
  sessions_per_day_max: number

  // 間隔設定（秒）
  item_interval_min: number
  item_interval_max: number
  session_interval_min: number
  session_interval_max: number

  // 優先時間帯
  preferred_hours: number[]

  // 曜日別設定
  weekday_multiplier: number
  weekend_multiplier: number

  // トリガー条件
  trigger_condition: TriggerCondition
  batch_time: string

  // プラットフォーム別設定
  platform_settings: Record<string, PlatformScheduleSettings>

  // 監査
  created_at: string
  updated_at: string
}

export type ScheduleExecutionType = 'batch' | 'immediate' | 'manual'

export interface AutoScheduleLogDetails {
  scheduled_products: string[]
  skipped_reasons: Record<string, string>
  errors: Record<string, string>
}

export interface AutoScheduleLog {
  id: string
  user_id: string
  execution_type: ScheduleExecutionType
  total_products: number
  scheduled_count: number
  skipped_count: number
  error_count: number
  details: AutoScheduleLogDetails
  settings_snapshot: DefaultScheduleSettings
  started_at: string
  completed_at: string | null
  duration_ms: number | null
  created_at: string
}

// ===========================
// API リクエスト/レスポンス型
// ===========================

export interface AutoApprovalSettingsResponse {
  success: boolean
  data?: AutoApprovalSettings
  error?: string
}

export interface UpdateAutoApprovalSettingsRequest {
  enabled?: boolean
  auto_approval_level?: AutoApprovalLevel
  min_seo_score?: number
  min_ai_confidence?: number
  min_profit_margin?: number
  required_fields?: string[]
  excluded_categories?: string[]
  excluded_price_ranges?: PriceRange[]
  notification_on_approval?: boolean
  notification_on_rejection?: boolean
  daily_summary_email?: boolean
}

export interface DefaultScheduleSettingsResponse {
  success: boolean
  data?: DefaultScheduleSettings
  error?: string
}

export interface UpdateDefaultScheduleSettingsRequest {
  enabled?: boolean
  items_per_day?: number
  sessions_per_day_min?: number
  sessions_per_day_max?: number
  item_interval_min?: number
  item_interval_max?: number
  session_interval_min?: number
  session_interval_max?: number
  preferred_hours?: number[]
  weekday_multiplier?: number
  weekend_multiplier?: number
  trigger_condition?: TriggerCondition
  batch_time?: string
  platform_settings?: Record<string, PlatformScheduleSettings>
}

export interface ExecuteAutoApprovalRequest {
  dry_run?: boolean
  product_ids?: string[]
  limit?: number
}

export interface ExecuteAutoApprovalResponse {
  success: boolean
  results: {
    total: number
    approved: number
    rejected: number
    manual_required: number
    errors: number
  }
  logs: AutoApprovalLog[]
  error?: string
}

export interface ExecuteAutoScheduleRequest {
  dry_run?: boolean
  product_ids?: string[]
  platform?: string
  date?: string
}

export interface ScheduledItem {
  product_id: string
  scheduled_time: string
  platform: string
}

export interface ExecuteAutoScheduleResponse {
  success: boolean
  results: {
    total: number
    scheduled: number
    skipped: number
    errors: number
  }
  scheduled_items: ScheduledItem[]
  error?: string
}

// ===========================
// 商品評価用型（products_masterから取得）
// ===========================

export interface ProductForApproval {
  id: string
  sku: string
  title: string | null
  title_en: string | null
  ddp_price_usd: number | null
  category_name: string | null
  primary_image_url: string | null
  images: string[] | null

  // スコア情報
  seo_health_score: number | null
  ai_confidence_score: number | null
  profit_margin_percent: number | null
  listing_score: number | null

  // ステータス
  status: string | null
  approval_status: string | null

  // その他
  recommended_platform: string | null
  updated_at: string
}

// ===========================
// ダッシュボード統計型
// ===========================

export interface AutomationStats {
  // 自動承認統計
  auto_approval: {
    enabled: boolean
    total_processed: number
    auto_approved: number
    auto_rejected: number
    manual_required: number
    approval_rate: number
  }

  // 自動スケジュール統計
  auto_schedule: {
    enabled: boolean
    total_scheduled: number
    pending_schedule: number
    scheduled_today: number
    scheduled_week: number
  }

  // 直近のログ
  recent_logs: {
    approval_logs: AutoApprovalLog[]
    schedule_logs: AutoScheduleLog[]
  }
}
