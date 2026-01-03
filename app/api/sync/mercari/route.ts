/**
 * メルカリ出品同期API
 * HTMLペースト方式でメルカリ出品データを同期
 * 
 * POST /api/sync/mercari
 * 
 * Body:
 * {
 *   html: string,          // メルカリ出品一覧ページのHTML
 *   account?: string,      // アカウント名（オプション）
 *   forceUpdate?: boolean  // 既存データも更新するか
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  parseMercariListingsHtml, 
  convertToInventoryFormat,
  MercariParseResult 
} from '@/lib/mercari/html-parser'

interface MercariSyncRequest {
  html: string
  account?: string
  forceUpdate?: boolean
}

export async function POST(req: NextRequest) {
  try {
    const body: MercariSyncRequest = await req.json()
    const { html, account = 'default', forceUpdate = false } = body

    if (!html || html.trim().length === 0) {
      return NextResponse.json(
        { error: 'HTMLが必要です' },
        { status: 400 }
      )
    }

    console.log(`\n=== メルカリ同期開始 [${account}] ===`)
    console.log(`HTML長: ${html.length}文字`)

    // HTMLをパース
    const parseResult: MercariParseResult = parseMercariListingsHtml(html)

    console.log(`📦 パース結果:`)
    console.log(`   方式: ${parseResult.parse_method}`)
    console.log(`   件数: ${parseResult.total_found}件`)
    if (parseResult.errors.length > 0) {
      console.log(`   エラー: ${parseResult.errors.join(', ')}`)
    }

    if (!parseResult.success || parseResult.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'HTMLから商品を抽出できませんでした',
        parse_method: parseResult.parse_method,
        errors: parseResult.errors
      }, { status: 400 })
    }

    // inventory_master形式に変換
    const inventoryData = convertToInventoryFormat(parseResult.items, account)

    // Supabaseに登録/更新
    const supabase = await createClient()
    let totalSynced = 0
    let totalUpdated = 0
    let totalSkipped = 0
    let totalErrors = 0
    const syncedItems: any[] = []

    for (const item of inventoryData) {
      try {
        // 既存チェック
        const { data: existing } = await supabase
          .from('inventory_master')
          .select('id')
          .eq('unique_id', item.unique_id)
          .maybeSingle()

        if (existing) {
          if (forceUpdate) {
            // 既存データを更新
            const { error: updateError } = await supabase
              .from('inventory_master')
              .update({
                product_name: item.product_name,
                selling_price: item.selling_price,
                images: item.images,
                source_data: item.source_data,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id)

            if (updateError) {
              console.error(`更新エラー [${item.sku}]:`, updateError.message)
              totalErrors++
            } else {
              totalUpdated++
              syncedItems.push({
                id: existing.id,
                mercari_item_id: item.sku,
                product_name: item.product_name,
                price_jpy: item.selling_price,
                status: 'updated'
              })
            }
          } else {
            totalSkipped++
          }
          continue
        }

        // 新規登録
        const { data, error: insertError } = await supabase
          .from('inventory_master')
          .insert(item)
          .select('id')
          .single()

        if (insertError) {
          console.error(`登録エラー [${item.sku}]:`, insertError.message)
          totalErrors++
        } else {
          totalSynced++
          syncedItems.push({
            id: data.id,
            mercari_item_id: item.sku,
            product_name: item.product_name,
            price_jpy: item.selling_price,
            status: 'created'
          })
        }

      } catch (itemError: any) {
        console.error(`処理エラー [${item.sku}]:`, itemError.message)
        totalErrors++
      }
    }

    console.log(`\n✅ メルカリ同期完了`)
    console.log(`新規登録: ${totalSynced}件`)
    console.log(`更新: ${totalUpdated}件`)
    console.log(`スキップ: ${totalSkipped}件`)
    console.log(`エラー: ${totalErrors}件`)

    // 抽出した商品のサマリ
    const priceSummary = parseResult.items.reduce((acc, item) => {
      acc.total += item.price_jpy
      acc.min = Math.min(acc.min, item.price_jpy)
      acc.max = Math.max(acc.max, item.price_jpy)
      return acc
    }, { total: 0, min: Infinity, max: 0 })

    return NextResponse.json({
      success: true,
      parse_method: parseResult.parse_method,
      total_parsed: parseResult.total_found,
      total_synced: totalSynced,
      total_updated: totalUpdated,
      total_skipped: totalSkipped,
      total_errors: totalErrors,
      price_summary: {
        total_jpy: priceSummary.total,
        min_jpy: priceSummary.min === Infinity ? 0 : priceSummary.min,
        max_jpy: priceSummary.max,
        avg_jpy: parseResult.items.length > 0 
          ? Math.round(priceSummary.total / parseResult.items.length) 
          : 0
      },
      items: syncedItems.slice(0, 20),  // 最初の20件のみ返す
      account
    })

  } catch (error: any) {
    console.error('メルカリ同期エラー:', error)
    return NextResponse.json(
      { error: `同期失敗: ${error.message}` },
      { status: 500 }
    )
  }
}

// GETは許可しない
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with HTML body.' },
    { status: 405 }
  )
}
