// app/api/research-table/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDが指定されていません' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. ステータスを「分析中」に変更
    const { error: updateStatusError } = await supabase
      .from('research_repository')
      .update({
        status: 'analyzing',
        updated_at: new Date().toISOString()
      })
      .in('id', ids)

    if (updateStatusError) throw updateStatusError

    // 2. 対象アイテムを取得
    const { data: items, error: fetchError } = await supabase
      .from('research_repository')
      .select('*')
      .in('id', ids)

    if (fetchError) throw fetchError

    // 3. スコア計算（シンプル版）
    let analyzedCount = 0
    for (const item of items || []) {
      const profitScore = calculateProfitScore(item.profit_margin)
      const salesScore = calculateSalesScore(item.sold_count)
      const riskScore = calculateRiskScore(item)
      const totalScore = Math.round((profitScore + salesScore + riskScore) / 3)

      const { error: updateError } = await supabase
        .from('research_repository')
        .update({
          profit_score: profitScore,
          sales_score: salesScore,
          risk_score: riskScore,
          total_score: totalScore,
          risk_level: totalScore >= 70 ? 'low' : totalScore >= 50 ? 'medium' : 'high',
          status: 'new',
          analyzed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)

      if (!updateError) analyzedCount++
    }

    return NextResponse.json({
      success: true,
      count: analyzedCount,
      message: `${analyzedCount}件の分析が完了しました`
    })

  } catch (error: any) {
    console.error('Research analyze error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// スコア計算ヘルパー関数
function calculateProfitScore(profitMargin?: number): number {
  if (!profitMargin) return 30
  if (profitMargin >= 40) return 100
  if (profitMargin >= 30) return 80
  if (profitMargin >= 20) return 60
  if (profitMargin >= 10) return 40
  return 20
}

function calculateSalesScore(soldCount?: number): number {
  if (!soldCount) return 30
  if (soldCount >= 100) return 100
  if (soldCount >= 50) return 80
  if (soldCount >= 20) return 60
  if (soldCount >= 5) return 40
  return 20
}

function calculateRiskScore(item: any): number {
  let score = 100
  if (item.section_301_risk) score -= 30
  if (item.vero_risk) score -= 20
  if (item.competitor_count && item.competitor_count > 20) score -= 10
  if (item.competitor_count && item.competitor_count > 50) score -= 20
  return Math.max(0, score)
}
