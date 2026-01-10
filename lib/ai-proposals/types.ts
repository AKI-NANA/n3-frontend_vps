/**
 * AI提案管理システム - TypeScript型定義
 *
 * 統合リサーチシステムからの出品提案、MFクラウドからの記帳ルール提案などを一元管理
 */

// 提案タイプ
export type ProposalType =
  | 'research_proposal'      // 出品提案（リサーチから）
  | 'bookkeeping_proposal'   // 記帳ルール提案（MFクラウドから、将来実装）
  | 'inventory_alert'        // 在庫アラート
  | 'pricing_suggestion'     // 価格変更提案

// 提案ステータス
export type ProposalStatus =
  | 'pending'      // 承認待ち
  | 'approved'     // 承認済み
  | 'rejected'     // 却下
  | 'expired'      // 期限切れ

// 提案優先度
export type ProposalPriority =
  | 'high'         // 高
  | 'medium'       // 中
  | 'low'          // 低

// リサーチ提案データ（proposal_data の型）
export interface ResearchProposalData {
  product_id: string
  source: 'ebay' | 'amazon'
  ebay_item_id?: string
  asin?: string
  title: string
  title_jp?: string
  price: number
  cost_price: number
  supplier: string
  supplier_url?: string
  image?: string

  // スコア情報
  total_score: number
  profit_score?: number
  demand_score?: number
  competition_score?: number
  risk_level?: 'low' | 'medium' | 'high'

  // 利益計算
  estimated_profit: number
  profit_rate: number
  estimated_revenue: number

  // メタデータ
  sold_count?: number
  competitor_count?: number
  category?: string
  url?: string
}

// 記帳ルール提案データ（将来実装）
export interface BookkeepingProposalData {
  rule_id: string
  description: string
  account_from: string
  account_to: string
  amount_pattern?: string
  confidence: number
}

// AI提案の基本型
export interface AIProposal {
  id: string
  type: ProposalType
  title: string
  description?: string
  status: ProposalStatus
  priority: ProposalPriority

  source_system: string           // 'unified_research', 'mf_cloud', etc.
  source_reference_id?: string

  proposal_data: ResearchProposalData | BookkeepingProposalData | Record<string, unknown>

  estimated_profit?: number
  estimated_revenue?: number
  risk_level?: string
  confidence_score?: number        // 0-100

  created_at: string
  updated_at: string
  expires_at?: string

  reviewed_at?: string
  reviewed_by?: string
  review_comment?: string
}

// リサーチ提案（型ガード付き）
export interface ResearchProposal extends AIProposal {
  type: 'research_proposal'
  proposal_data: ResearchProposalData
}

// 記帳ルール提案（型ガード付き）
export interface BookkeepingProposal extends AIProposal {
  type: 'bookkeeping_proposal'
  proposal_data: BookkeepingProposalData
}

// 型ガード関数
export function isResearchProposal(proposal: AIProposal): proposal is ResearchProposal {
  return proposal.type === 'research_proposal'
}

export function isBookkeepingProposal(proposal: AIProposal): proposal is BookkeepingProposal {
  return proposal.type === 'bookkeeping_proposal'
}

// 提案統計情報
export interface ProposalStatistics {
  total: number
  pending: number
  approved: number
  rejected: number
  total_estimated_profit: number
  total_estimated_revenue: number
  high_priority: number
  by_type: Record<ProposalType, {
    count: number
    pending: number
  }>
}

// 提案フィルター
export interface ProposalFilters {
  type?: ProposalType
  status?: ProposalStatus
  priority?: ProposalPriority
  limit?: number
  offset?: number
}

// 提案作成リクエスト
export interface CreateProposalRequest {
  type: ProposalType
  title: string
  description?: string
  priority?: ProposalPriority
  source_system: string
  source_reference_id?: string
  proposal_data: Record<string, unknown>
  estimated_profit?: number
  estimated_revenue?: number
  risk_level?: string
  confidence_score?: number
  expires_at?: string
}

// 提案承認リクエスト
export interface ApproveProposalRequest {
  proposal_id: string
  reviewed_by: string
  review_comment?: string
}

// 提案却下リクエスト
export interface RejectProposalRequest {
  proposal_id: string
  reviewed_by: string
  review_comment?: string
}

// API レスポンス
export interface ProposalActionResponse {
  success: boolean
  error?: string
  proposal_id?: string
  type?: ProposalType
  proposal_data?: Record<string, unknown>
}
