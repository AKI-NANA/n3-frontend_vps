// app/api/research-table/karitori-register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { ids, targetPricePercent = 20 } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDが指定されていません' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 対象アイテムを取得
    const { data: items, error: fetchError } = await supabase
      .from('research_repository')
      .select('*')
      .in('id', ids)

    if (fetchError) throw fetchError

    let registeredCount = 0
    for (const item of items || []) {
      // 目標価格を計算（現在価格から指定%引き）
      const currentPrice = item.supplier_price_jpy || item.estimated_cost_jpy
      const targetPrice = currentPrice
        ? Math.round(currentPrice * (1 - targetPricePercent / 100))
        : null

      const { error: updateError } = await supabase
        .from('research_repository')
        .update({
          karitori_status: 'watching',
          target_price_jpy: targetPrice,
          current_amazon_price: currentPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)

      if (!updateError) registeredCount++
    }

    return NextResponse.json({
      success: true,
      count: registeredCount,
      message: `${registeredCount}件を刈り取り監視に登録しました`
    })

  } catch (error: any) {
    console.error('Karitori register error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
