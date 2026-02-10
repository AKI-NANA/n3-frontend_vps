// app/api/research-table/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const minScore = searchParams.get('minScore')
    const status = searchParams.get('status')
    const keyword = searchParams.get('keyword')
    const source = searchParams.get('source')
    const riskLevel = searchParams.get('riskLevel')

    const supabase = await createClient()

    let query = supabase
      .from('research_repository')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (minScore) {
      query = query.gte('total_score', parseInt(minScore))
    }

    if (status) {
      query = query.in('status', status.split(','))
    }

    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,english_title.ilike.%${keyword}%,asin.ilike.%${keyword}%`)
    }

    if (source) {
      query = query.in('source', source.split(','))
    }

    if (riskLevel) {
      query = query.in('risk_level', riskLevel.split(','))
    }

    const { data, error, count } = await query

    if (error) throw error

    // 統計計算
    const statsQuery = await supabase
      .from('research_repository')
      .select('status, total_score, supplier_source, risk_score')

    const statsData = statsQuery.data || []
    const stats = {
      total: count || 0,
      newCount: statsData.filter(i => i.status === 'new').length,
      analyzingCount: statsData.filter(i => i.status === 'analyzing').length,
      approvedCount: statsData.filter(i => i.status === 'approved').length,
      rejectedCount: statsData.filter(i => i.status === 'rejected').length,
      promotedCount: statsData.filter(i => i.status === 'promoted').length,
      researchPendingCount: statsData.filter(i => i.status === 'research_pending').length,
      highScoreCount: statsData.filter(i => (i.total_score || 0) >= 70).length,
      supplierFoundCount: statsData.filter(i => i.supplier_source).length,
      // 自動承認候補: ai_score >= 85 AND risk_score < 30
      autoApproveCandidate: statsData.filter(i => 
        i.status === 'new' && 
        (i.total_score || 0) >= 85 && 
        ((i.risk_score || 0) < 30)
      ).length,
    }

    return NextResponse.json({
      success: true,
      items: data,
      total: count,
      stats
    })

  } catch (error: any) {
    console.error('Research list error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
