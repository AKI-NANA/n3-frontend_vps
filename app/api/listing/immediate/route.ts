// app/api/listing/immediate/route.ts
/**
 * 今すぐ出品API
 * 承認済み商品を即座にeBayに出品する
 * 
 * POST /api/listing/immediate
 * Body: { productIds: number[], marketplace: string, account: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { listProductToEbay } from '@/lib/ebay/inventory'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds, marketplace = 'ebay', account = 'mjt' } = body

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { error: '商品が選択されていません' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. 選択された商品を取得
    // workflow_status または approval_status が approved のもののみ
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .in('id', productIds)
      .or('workflow_status.eq.approved,approval_status.eq.approved')

    if (fetchError) {
      console.error('商品取得エラー:', fetchError)
      return NextResponse.json(
        { error: '商品の取得に失敗しました', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: '承認済み商品が見つかりません' },
        { status: 404 }
      )
    }

    // 2. 出品実行
    let successCount = 0
    let failedCount = 0
    const errors: string[] = []
    const successfulListings: any[] = []

    // アカウントマッピング
    const accountMap: Record<string, 'account1' | 'account2'> = {
      'account1': 'account1',
      'account2': 'account2',
      'mjt': 'account1',
      'green': 'account2'
    }

    for (const product of products) {
      try {
        // eBay出品実行
        if (marketplace === 'ebay') {
          const ebayAccount = accountMap[account] || 'account1'
          const result = await listProductToEbay(product, ebayAccount)

          if (result.success) {
            // 商品ステータスを更新
            await supabase
              .from('products_master')
              .update({
                workflow_status: 'listed',
                listing_status: 'active',
                listed_at: new Date().toISOString(),
                ebay_item_id: result.listingId,
                updated_at: new Date().toISOString()
              })
              .eq('id', product.id)

            // 出品履歴を記録
            await supabase
              .from('listing_history')
              .insert({
                product_id: product.id,
                marketplace: marketplace,
                account: account,
                listed_at: new Date().toISOString(),
                listing_id: result.listingId,
                status: 'success'
              })

            successfulListings.push({
              productId: product.id,
              sku: product.sku,
              listingId: result.listingId
            })

            successCount++
          } else {
            throw new Error(result.error || '出品失敗')
          }
        } else {
          // 他のマーケットプレイスは未実装
          throw new Error(`${marketplace}への出品は未実装です`)
        }

        // API制限対策: 2秒待機
        await sleep(2000)

      } catch (error: any) {
        console.error(`商品${product.id}の出品エラー:`, error)
        
        // エラー履歴を記録
        await supabase
          .from('listing_history')
          .insert({
            product_id: product.id,
            marketplace: marketplace,
            account: account,
            listed_at: new Date().toISOString(),
            status: 'failed',
            error_message: error.message
          })

        errors.push(`${product.sku || product.id}: ${error.message}`)
        failedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `出品完了: 成功${successCount}件、失敗${failedCount}件`,
      data: {
        successCount,
        failedCount,
        total: products.length,
        successfulListings,
        errors: errors.length > 0 ? errors : undefined
      }
    })

  } catch (error: any) {
    console.error('即座出品エラー:', error)
    return NextResponse.json(
      { error: '出品処理に失敗しました', details: error.message },
      { status: 500 }
    )
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
