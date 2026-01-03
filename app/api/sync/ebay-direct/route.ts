/**
 * eBay→inventory_master 直接同期API（P0-1対応）
 * POST /api/sync/ebay-direct
 *
 * eBay出品データを自動分類してinventory_masterに直接登録
 * 手動分類キューをバイパスし、即座に在庫管理画面に表示
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { EbayApiClient } from '@/lib/ebay/oauth2-token-manager'
import { SecureEbayApiClient } from '@/lib/ebay/secure-ebay-token-manager'
import { syncCurrencyForNewRecord } from '@/lib/utils/currency-sync'

const USE_SECURE_CREDENTIALS = true

interface DirectSyncRequest {
  account: 'mjt' | 'green' | 'all'
  limit?: number
  autoClassify?: 'stock' | 'dropship'  // 自動分類タイプ（デフォルト: stock）
}

export async function POST(req: NextRequest) {
  try {
    const body: DirectSyncRequest = await req.json()
    const { account, limit, autoClassify = 'stock' } = body

    if (!account) {
      return NextResponse.json(
        { error: 'accountパラメータが必要です (mjt, green, all)' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 同期対象アカウントの決定
    let accounts: string[] = []

    if (account === 'all') {
      const { data: ebayAccounts } = await supabase
        .from('ebay_accounts')
        .select('account_key')
        .eq('is_active', true)
        .eq('auth_status', 'active')

      if (ebayAccounts && ebayAccounts.length > 0) {
        accounts = ebayAccounts.map(a => a.account_key)
      } else {
        accounts = ['mjt', 'green']  // フォールバック
      }
    } else {
      accounts = [account]
    }

    let totalSynced = 0
    let totalSkipped = 0
    let totalErrors = 0

    for (const accountName of accounts) {
      console.log(`\n=== eBay ${accountName.toUpperCase()} 直接同期開始 ===`)

      // eBay Inventory APIからデータ取得
      const listings = await fetchEbayInventory(accountName, limit)
      console.log(`取得件数: ${listings.length}件`)

      // 各リストを inventory_master に直接登録
      for (const listing of listings) {
        try {
          // unique_id生成（アカウント名を含む）
          const uniqueId = `ebay-${accountName}-${listing.listing_id}`

          // 既存チェック
          const { data: existing } = await supabase
            .from('inventory_master')
            .select('id')
            .eq('unique_id', uniqueId)
            .maybeSingle()

          if (existing) {
            totalSkipped++
            continue
          }

          // P0-1: アカウント名を含めてDBに登録
          const { error: insertError } = await supabase
            .from('inventory_master')
            .insert({
              unique_id: uniqueId,
              product_name: listing.product_name || '商品名未設定',
              sku: listing.sku || null,
              product_type: autoClassify,  // 自動分類
              physical_quantity: listing.quantity || 1,
              listing_quantity: listing.quantity || 1,
              cost_price: listing.price ? listing.price * 0.7 : 0,  // 仮原価
              selling_price: listing.price || 0,
              condition_name: listing.condition || 'used',
              category: listing.category || 'Electronics',
              images: listing.images || [],

              // P1-2対応: source_dataにebay_account情報を格納
              source_data: {
                ebay_account: accountName,  // MJT or GREEN
                site: listing.site || 'US',
                condition_name: listing.condition || 'used',
                listing_id: listing.listing_id,
                url: listing.url,
                original_price: listing.price
              },

              marketplace: 'ebay',
              account: accountName,  // P1-2: account フィールドにも格納

              ebay_data: {
                listing_id: listing.listing_id,
                item_id: listing.item_id,
                condition: listing.condition,
                price: listing.price,
                quantity: listing.quantity,
                url: listing.url,
                site: listing.site
              },

              is_manual_entry: false,
              priority_score: 0,
              notes: `${accountName.toUpperCase()}アカウントから自動同期`
            })

          if (insertError) {
            console.error(`登録エラー [${listing.listing_id}]:`, insertError.message)
            totalErrors++
          } else {
            // 通貨・サイト情報を同期
            await syncCurrencyForNewRecord(
              supabase,
              uniqueId,
              { currency: 'USD', site: listing.site || 'US' },
              {}
            )
            totalSynced++
          }

        } catch (itemError: any) {
          console.error(`処理エラー [${listing.listing_id}]:`, itemError.message)
          totalErrors++
        }
      }
    }

    console.log(`\n✅ 直接同期完了`)
    console.log(`新規登録: ${totalSynced}件`)
    console.log(`スキップ: ${totalSkipped}件`)
    console.log(`エラー: ${totalErrors}件`)

    return NextResponse.json({
      success: true,
      total_synced: totalSynced,
      total_skipped: totalSkipped,
      total_errors: totalErrors,
      accounts: accounts
    })

  } catch (error: any) {
    console.error('直接同期エラー:', error)
    return NextResponse.json(
      { error: `同期失敗: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * eBay Inventory APIから出品データを取得
 */
async function fetchEbayInventory(account: string, limit?: number): Promise<any[]> {
  try {
    // セキュアクライアント使用
    const client = USE_SECURE_CREDENTIALS
      ? new SecureEbayApiClient(account)
      : new EbayApiClient(account)

    const inventoryItems = await client.getInventoryItems()

    if (!inventoryItems || inventoryItems.length === 0) {
      console.warn(`⚠️ ${account}: 出品データが見つかりませんでした`)
      return []
    }

    // limit適用
    const items = limit ? inventoryItems.slice(0, limit) : inventoryItems

    // データ変換
    return items.map((item: any) => ({
      listing_id: item.offerId || item.sku || String(Math.random()),
      item_id: item.product?.aspects?.find((a: any) => a.name === 'ItemID')?.values?.[0] || null,
      product_name: item.product?.title || 'タイトル未設定',
      sku: item.sku,
      condition: item.condition || 'USED_GOOD',
      price: item.pricingSummary?.price?.value || 0,
      quantity: item.availability?.shipToLocationAvailability?.quantity || 1,
      category: item.product?.aspects?.find((a: any) => a.name === 'Category')?.values?.[0] || 'Electronics',
      images: item.product?.imageUrls || [],
      url: `https://www.ebay.com/itm/${item.offerId}`,
      site: 'US'  // デフォルトUS
    }))

  } catch (error: any) {
    console.error(`eBay API取得エラー [${account}]:`, error.message)
    return []
  }
}
