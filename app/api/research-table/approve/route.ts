// app/api/research-table/approve/route.ts
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

    // 1. research_repository から対象データを取得
    const { data: researchItems, error: fetchError } = await supabase
      .from('research_repository')
      .select('*')
      .in('id', ids)

    if (fetchError) throw fetchError

    if (!researchItems || researchItems.length === 0) {
      return NextResponse.json(
        { success: false, error: '対象データが見つかりません' },
        { status: 404 }
      )
    }

    // 2. products_master にコピー
    const productsToInsert = researchItems.map(item => ({
      title: item.title,
      english_title: item.english_title,
      price_jpy: item.estimated_cost_jpy || item.supplier_price_jpy,
      primary_image_url: item.image_url,
      source_url: item.source_url,
      research_repository_id: item.id,
      workflow_status: 'pending',
      category_name: item.category_name,
      category_id: item.category_id,
      brand_name: item.brand,
      condition: item.condition,
      weight_g: item.weight_g,
      length_cm: item.length_cm,
      width_cm: item.width_cm,
      height_cm: item.height_cm,
      hts_code: item.hts_code,
      origin_country: item.origin_country,
      research_sold_count: item.sold_count,
      sm_competitor_count: item.competitor_count,
      sm_lowest_price: item.sold_price_usd,
      profit_margin: item.profit_margin,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { error: insertError } = await supabase
      .from('products_master')
      .insert(productsToInsert)

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    // 3. research_repository のステータスを更新
    const { error: updateError } = await supabase
      .from('research_repository')
      .update({
        status: 'promoted',
        approved_at: new Date().toISOString()
      })
      .in('id', ids)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      count: ids.length,
      message: `${ids.length}件を承認し、編集画面に追加しました`
    })

  } catch (error: any) {
    console.error('Research approve error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
