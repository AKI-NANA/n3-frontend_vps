/**
 * AI提案管理システム - API Client
 *
 * Supabase RPC関数との連携
 */

import { createClient } from '@supabase/supabase-js'
import type {
  AIProposal,
  ProposalFilters,
  ProposalStatistics,
  CreateProposalRequest,
  ApproveProposalRequest,
  RejectProposalRequest,
  ProposalActionResponse,
} from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * 提案統計情報を取得
 */
export async function getProposalStatistics(): Promise<ProposalStatistics> {
  const { data, error } = await supabase.rpc('get_proposal_statistics')

  if (error) {
    console.error('Failed to get proposal statistics:', error)
    throw new Error('提案統計情報の取得に失敗しました')
  }

  return data as ProposalStatistics
}

/**
 * 提案一覧を取得（フィルター付き）
 */
export async function getProposals(filters: ProposalFilters = {}): Promise<AIProposal[]> {
  const { data, error } = await supabase.rpc('get_proposals', {
    p_type: filters.type || null,
    p_status: filters.status || null,
    p_priority: filters.priority || null,
    p_limit: filters.limit || 50,
    p_offset: filters.offset || 0,
  })

  if (error) {
    console.error('Failed to get proposals:', error)
    throw new Error('提案一覧の取得に失敗しました')
  }

  return (data || []) as AIProposal[]
}

/**
 * 提案を作成
 */
export async function createProposal(
  request: CreateProposalRequest
): Promise<AIProposal> {
  const { data, error } = await supabase
    .from('ai_proposals')
    .insert({
      type: request.type,
      title: request.title,
      description: request.description,
      priority: request.priority || 'medium',
      source_system: request.source_system,
      source_reference_id: request.source_reference_id,
      proposal_data: request.proposal_data,
      estimated_profit: request.estimated_profit,
      estimated_revenue: request.estimated_revenue,
      risk_level: request.risk_level,
      confidence_score: request.confidence_score,
      expires_at: request.expires_at,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create proposal:', error)
    throw new Error('提案の作成に失敗しました')
  }

  return data as AIProposal
}

/**
 * 複数提案を一括作成
 */
export async function createProposalsBatch(
  requests: CreateProposalRequest[]
): Promise<AIProposal[]> {
  const insertData = requests.map(request => ({
    type: request.type,
    title: request.title,
    description: request.description,
    priority: request.priority || 'medium',
    source_system: request.source_system,
    source_reference_id: request.source_reference_id,
    proposal_data: request.proposal_data,
    estimated_profit: request.estimated_profit,
    estimated_revenue: request.estimated_revenue,
    risk_level: request.risk_level,
    confidence_score: request.confidence_score,
    expires_at: request.expires_at,
    status: 'pending',
  }))

  const { data, error } = await supabase
    .from('ai_proposals')
    .insert(insertData)
    .select()

  if (error) {
    console.error('Failed to create proposals batch:', error)
    throw new Error('一括提案の作成に失敗しました')
  }

  return (data || []) as AIProposal[]
}

/**
 * 提案を承認
 */
export async function approveProposal(
  request: ApproveProposalRequest
): Promise<ProposalActionResponse> {
  const { data, error } = await supabase.rpc('approve_proposal', {
    p_proposal_id: request.proposal_id,
    p_reviewed_by: request.reviewed_by,
    p_review_comment: request.review_comment || null,
  })

  if (error) {
    console.error('Failed to approve proposal:', error)
    throw new Error('提案の承認に失敗しました')
  }

  return data as ProposalActionResponse
}

/**
 * 提案を却下
 */
export async function rejectProposal(
  request: RejectProposalRequest
): Promise<ProposalActionResponse> {
  const { data, error } = await supabase.rpc('reject_proposal', {
    p_proposal_id: request.proposal_id,
    p_reviewed_by: request.reviewed_by,
    p_review_comment: request.review_comment || null,
  })

  if (error) {
    console.error('Failed to reject proposal:', error)
    throw new Error('提案の却下に失敗しました')
  }

  return data as ProposalActionResponse
}

/**
 * 提案を取得（ID指定）
 */
export async function getProposalById(proposalId: string): Promise<AIProposal | null> {
  const { data, error } = await supabase
    .from('ai_proposals')
    .select('*')
    .eq('id', proposalId)
    .is('deleted_at', null)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    console.error('Failed to get proposal:', error)
    throw new Error('提案の取得に失敗しました')
  }

  return data as AIProposal
}

/**
 * 提案を削除（ソフトデリート）
 */
export async function deleteProposal(proposalId: string): Promise<void> {
  const { error } = await supabase
    .from('ai_proposals')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', proposalId)

  if (error) {
    console.error('Failed to delete proposal:', error)
    throw new Error('提案の削除に失敗しました')
  }
}
