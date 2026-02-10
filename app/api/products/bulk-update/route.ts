/**
 * 商品一括更新API
 * POST /api/products/bulk-update
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { products } = body

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: '更新する商品データが必要です' },
        { status: 400 }
      )
    }

    console.log(`📦 一括更新開始: ${products.length}件`)
    console.log('📦 更新データサンプル:', JSON.stringify(products[0], null, 2))

    const supabase = await createClient()
    
    const results: { id: string; success: boolean; error?: string }[] = []
    let successCount = 0
    let errorCount = 0

    for (const product of products) {
      const { id, ...updateData } = product

      if (!id) {
        results.push({ id: 'unknown', success: false, error: 'IDが指定されていません' })
        errorCount++
        continue
      }

      try {
        // updated_atを追加
        const dataToUpdate = {
          ...updateData,
          updated_at: new Date().toISOString(),
        }

        // 空の値・undefinedを除外、nullは許可
        const cleanedData = Object.fromEntries(
          Object.entries(dataToUpdate).filter(([_, v]) => v !== undefined)
        )

        // 更新対象フィールドがあるか確認
        const updateFields = Object.keys(cleanedData).filter(k => k !== 'updated_at')
        if (updateFields.length === 0) {
          console.log(`⚠️ 商品[${id}]: 更新フィールドなし、スキップ`)
          results.push({ id: String(id), success: true })
          successCount++
          continue
        }

        console.log(`📝 商品[${id}] 更新フィールド:`, updateFields)

        const { data, error } = await supabase
          .from('products_master')
          .update(cleanedData)
          .eq('id', id)
          .select('id')

        if (error) {
          console.error(`❌ 商品更新エラー [${id}]:`, error)
          results.push({ id: String(id), success: false, error: error.message })
          errorCount++
        } else {
          console.log(`✅ 商品[${id}] 更新成功`)
          results.push({ id: String(id), success: true })
          successCount++
        }
      } catch (err: any) {
        console.error(`❌ 商品処理エラー [${id}]:`, err)
        results.push({ id: String(id), success: false, error: err.message })
        errorCount++
      }
    }

    console.log(`✅ 一括更新完了: 成功=${successCount}, エラー=${errorCount}`)

    // 一部でもエラーがあっても、successは成功数を返す
    // successはエラーが0の場合のみtrue
    return NextResponse.json({
      success: successCount > 0,  // 1件でも成功したらtrue
      updated: successCount,
      errorCount,
      total: products.length,
      errors: errorCount > 0 ? results.filter(r => !r.success).map(r => `${r.id}: ${r.error}`) : undefined,
      results,
    })

  } catch (error: any) {
    console.error('❌ 一括更新エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || '一括更新に失敗しました' },
      { status: 500 }
    )
  }
}
