/**
 * 支払い承認ワークフローの型定義
 * Phase 1 - ツール2: 支払い承認ワークフロー
 */

// 支払い目的
export type PaymentPurpose = 'purchase' | 'expense' | 'transfer' | 'other'

// 承認ステータス
export type ApprovalStatus =
  | 'pending'              // 申請中（承認待ち）
  | 'president_approved'   // 社長承認済み（財務承認待ち）
  | 'finance_approved'     // 財務承認済み（支払い可能）
  | 'rejected'             // 却下
  | 'paid'                 // 支払い完了
  | 'cancelled'            // キャンセル

/**
 * 支払い承認リクエスト
 */
export interface PaymentApprovalRequest {
  id: string

  // 申請者情報
  requester_id: string
  requester_company: string

  // 支払い情報
  amount_jpy: number
  purpose: PaymentPurpose
  supplier_name: string | null
  description: string
  evidence_urls: string[]

  // ワークフロー状態
  status: ApprovalStatus
  president_approved_at: string | null
  president_approved_by: string | null
  finance_approved_at: string | null
  finance_approved_by: string | null
  rejection_reason: string | null
  rejected_by: string | null
  rejected_at: string | null
  paid_at: string | null

  // AI異常検知結果
  anomaly_score: number | null
  anomaly_reasons: string[] | null
  ai_analyzed_at: string | null

  // メタ情報
  created_at: string
  updated_at: string
}

/**
 * 支払い承認履歴
 */
export interface PaymentApprovalHistory {
  id: string
  request_id: string
  action: PaymentApprovalAction
  performed_by: string
  comment: string | null
  created_at: string
}

// 承認アクション
export type PaymentApprovalAction =
  | 'submitted'
  | 'president_approved'
  | 'finance_approved'
  | 'rejected'
  | 'cancelled'
  | 'paid'

/**
 * 支払い承認申請リクエスト（API用）
 */
export interface CreatePaymentApprovalRequest {
  requester_id: string
  requester_company: string
  amount_jpy: number
  purpose: PaymentPurpose
  supplier_name?: string
  description: string
  evidence_urls?: string[]
}

/**
 * 支払い承認申請レスポンス
 */
export interface CreatePaymentApprovalResponse {
  success: boolean
  message: string
  request?: PaymentApprovalRequest
  requires_ai_review?: boolean
  anomaly_detected?: boolean
}

/**
 * 承認実行リクエスト
 */
export interface ApprovePaymentRequest {
  request_id: string
  approver_id: string
  approver_role: 'president' | 'finance'
  comment?: string
}

/**
 * 承認実行レスポンス
 */
export interface ApprovePaymentResponse {
  success: boolean
  message: string
  updated_request?: PaymentApprovalRequest
  next_step?: string // 次に必要なアクション
}

/**
 * 却下実行リクエスト
 */
export interface RejectPaymentRequest {
  request_id: string
  rejector_id: string
  rejection_reason: string
}

/**
 * 却下実行レスポンス
 */
export interface RejectPaymentResponse {
  success: boolean
  message: string
  updated_request?: PaymentApprovalRequest
}

/**
 * 支払い承認統計
 */
export interface PaymentApprovalStats {
  total_requests: number
  pending_requests: number
  president_approval_pending: number
  finance_approval_pending: number
  approved_this_month: number
  rejected_this_month: number
  total_amount_pending_jpy: number
  total_amount_approved_this_month_jpy: number
  high_anomaly_count: number // 異常スコア80以上の件数
}

/**
 * 支払い承認ダッシュボードデータ
 */
export interface PaymentApprovalDashboard {
  stats: PaymentApprovalStats
  pending_requests: PaymentApprovalRequest[]
  recent_approvals: PaymentApprovalRequest[]
  high_anomaly_requests: PaymentApprovalRequest[]
  rejection_reasons_summary: { reason: string; count: number }[]
}

/**
 * AI異常検知結果
 */
export interface PaymentAnomalyDetection {
  is_anomaly: boolean
  anomaly_score: number // 0-100
  reasons: string[]
  recommendation: string
  requires_manual_review: boolean
}
