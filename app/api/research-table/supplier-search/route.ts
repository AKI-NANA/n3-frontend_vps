// app/api/research-table/supplier-search/route.ts
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

    // 対象アイテムを取得
    const { data: items, error: fetchError } = await supabase
      .from('research_repository')
      .select('*')
      .in('id', ids)

    if (fetchError) throw fetchError

    let foundCount = 0
    for (const item of items || []) {
      // 既存のAI仕入先探索APIを呼び出し
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/research/ai-supplier-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_name: item.title || item.english_title,
            keywords: [item.category_name, item.brand].filter(Boolean)
          })
        })

        if (response.ok) {
          const result = await response.json()

          if (result.success && result.data?.suppliers?.length > 0) {
            const bestSupplier = result.data.suppliers[0]

            // DBを更新
            const { error: updateError } = await supabase
              .from('research_repository')
              .update({
                supplier_source: bestSupplier.source || 'Amazon.jp',
                supplier_price_jpy: bestSupplier.price,
                supplier_url: bestSupplier.url,
                supplier_stock: bestSupplier.in_stock ? 'あり' : '不明',
                supplier_confidence: bestSupplier.confidence || 70,
                updated_at: new Date().toISOString()
              })
              .eq('id', item.id)

            if (!updateError) foundCount++
          }
        }
      } catch (apiError) {
        console.error('Supplier search API error:', apiError)
        // 個別のエラーは無視して続行
      }
    }

    return NextResponse.json({
      success: true,
      found: foundCount,
      message: `${foundCount}件の仕入先を発見しました`
    })

  } catch (error: any) {
    console.error('Supplier search error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
