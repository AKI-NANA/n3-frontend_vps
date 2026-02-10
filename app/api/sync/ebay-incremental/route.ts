/**
 * eBay 差分同期API
 * 最終同期以降に変更があった商品のみ取得
 * 
 * POST /api/sync/ebay-incremental
 * 
 * 特徴:
 * - ModTimeFrom を使用して差分のみ取得
 * - 終了した商品を自動検出して ended マーク
 * - 同期履歴を保存
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { syncCurrencyForNewRecord } from '@/lib/utils/currency-sync'

interface IncrementalSyncRequest {
  account: 'mjt' | 'green' | 'all'
  forceFullSync?: boolean  // true: 全件取得（差分ではなく）
  detectEnded?: boolean    // true: 終了商品を検出
}

export const maxDuration = 300

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body: IncrementalSyncRequest = await req.json()
    const { account, forceFullSync = false, detectEnded = true } = body

    if (!account) {
      return NextResponse.json(
        { error: 'accountパラメータが必要です (mjt, green, all)' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const accounts: string[] = account === 'all' ? ['mjt', 'green'] : [account]

    const results: Record<string, any> = {}

    for (const accountName of accounts) {
      console.log(`\n=== eBay 差分同期 ${accountName.toUpperCase()} ===`)

      try {
        // 最終同期日時を取得
        const { data: syncStatus } = await supabase
          .from('sync_status')
          .select('last_sync_at, last_full_sync_at')
          .eq('account', accountName)
          .eq('marketplace', 'ebay')
          .maybeSingle()

        const lastSyncAt = forceFullSync ? null : syncStatus?.last_sync_at
        const syncType = lastSyncAt ? 'incremental' : 'full'

        console.log(`📅 最終同期: ${lastSyncAt || 'なし（全件取得）'}`)
        console.log(`🔄 同期タイプ: ${syncType}`)

        // 同期履歴に開始を記録
        const { data: historyRecord } = await supabase
          .from('sync_history')
          .insert({
            account: accountName,
            marketplace: 'ebay',
            sync_type: syncType,
            started_at: new Date().toISOString(),
            status: 'running',
            triggered_by: 'manual'
          })
          .select('id')
          .single()

        const historyId = historyRecord?.id

        // GetMyeBaySelling で商品取得
        const listings = await fetchListings(accountName, lastSyncAt)
        console.log(`📦 取得件数: ${listings.length}件`)

        // アクティブなItemIDリスト
        const activeItemIds = listings.map(l => l.ItemID)

        let itemsAdded = 0
        let itemsUpdated = 0
        let itemsSkipped = 0
        let itemsErrors = 0
        let itemsEnded = 0

        // 商品を保存
        for (const listing of listings) {
          try {
            const uniqueId = `ebay-${accountName}-${listing.ItemID}`

            const { data: existing } = await supabase
              .from('inventory_master')
              .select('id')
              .eq('unique_id', uniqueId)
              .maybeSingle()

            const saveData = buildSaveData(listing, accountName)

            if (existing) {
              // 更新
              const { error } = await supabase
                .from('inventory_master')
                .update({
                  ...saveData,
                  listing_status: 'active',
                  updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)

              if (error) {
                itemsErrors++
              } else {
                // 通貨・サイト情報を同期
                await syncCurrencyForNewRecord(
                  supabase,
                  saveData.unique_id,
                  { currency: listing.Currency, site: listing.Site },
                  {}
                )
                itemsUpdated++
              }
            } else {
              // 新規
              const { error } = await supabase
                .from('inventory_master')
                .insert({
                  ...saveData,
                  listing_status: 'active'
                })

              if (error) {
                itemsErrors++
              } else {
                // 通貨・サイト情報を同期
                await syncCurrencyForNewRecord(
                  supabase,
                  saveData.unique_id,
                  { currency: listing.Currency, site: listing.Site },
                  {}
                )
                itemsAdded++
              }
            }
          } catch (err) {
            itemsErrors++
          }
        }

        // 終了商品の検出（全件同期時のみ）
        if (detectEnded && syncType === 'full' && activeItemIds.length > 0) {
          console.log(`🔍 終了商品を検出中...`)
          
          const { data: endedResult } = await supabase
            .rpc('mark_ended_listings', {
              p_account: accountName,
              p_active_item_ids: activeItemIds
            })

          itemsEnded = endedResult || 0
          console.log(`📴 終了商品: ${itemsEnded}件`)
        }

        // 同期ステータス更新
        await supabase.rpc('update_sync_status', {
          p_account: accountName,
          p_marketplace: 'ebay',
          p_sync_type: syncType,
          p_total_items: listings.length,
          p_items_added: itemsAdded,
          p_items_updated: itemsUpdated,
          p_items_ended: itemsEnded,
          p_status: 'completed'
        })

        // 同期履歴を完了に更新
        const executionTime = Math.round((Date.now() - startTime) / 1000)
        
        if (historyId) {
          await supabase
            .from('sync_history')
            .update({
              completed_at: new Date().toISOString(),
              total_fetched: listings.length,
              items_added: itemsAdded,
              items_updated: itemsUpdated,
              items_skipped: itemsSkipped,
              items_ended: itemsEnded,
              items_errors: itemsErrors,
              status: 'completed',
              execution_time_seconds: executionTime
            })
            .eq('id', historyId)
        }

        results[accountName] = {
          success: true,
          sync_type: syncType,
          total_fetched: listings.length,
          items_added: itemsAdded,
          items_updated: itemsUpdated,
          items_ended: itemsEnded,
          items_errors: itemsErrors,
          execution_time_seconds: executionTime
        }

        console.log(`✅ [${accountName}] 完了: 追加=${itemsAdded}, 更新=${itemsUpdated}, 終了=${itemsEnded}`)

      } catch (accountError: any) {
        console.error(`[${accountName}] エラー:`, accountError.message)
        results[accountName] = {
          success: false,
          error: accountError.message
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      total_execution_time_seconds: Math.round((Date.now() - startTime) / 1000)
    })

  } catch (error: any) {
    console.error('差分同期エラー:', error)
    return NextResponse.json(
      { error: `同期失敗: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * GetMyeBaySelling で商品取得
 */
async function fetchListings(account: string, modTimeFrom: string | null): Promise<any[]> {
  const accountUpper = account.toUpperCase()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

  const { data: tokenData } = await supabase
    .from('ebay_tokens')
    .select('refresh_token')
    .eq('account', account)
    .maybeSingle()

  if (!tokenData?.refresh_token) {
    throw new Error(`${account}のトークンがありません`)
  }

  const clientId = process.env[`EBAY_CLIENT_ID_${accountUpper}`] || process.env.EBAY_CLIENT_ID!
  const clientSecret = process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] || process.env.EBAY_CLIENT_SECRET!
  const devId = process.env.EBAY_DEV_ID!

  const accessToken = await getAccessToken(clientId, clientSecret, tokenData.refresh_token)

  const allItems: any[] = []
  let pageNumber = 1
  let hasMore = true
  const entriesPerPage = 200

  while (hasMore) {
    console.log(`📦 [${account}] page=${pageNumber}...`)

    const xmlRequest = buildXmlRequest(accessToken, pageNumber, entriesPerPage, modTimeFrom)

    const response = await fetch('https://api.ebay.com/ws/api.dll', {
      method: 'POST',
      headers: {
        'X-EBAY-API-SITEID': '0',
        'X-EBAY-API-COMPATIBILITY-LEVEL': '1193',
        'X-EBAY-API-CALL-NAME': 'GetMyeBaySelling',
        'X-EBAY-API-APP-NAME': clientId,
        'X-EBAY-API-DEV-NAME': devId,
        'X-EBAY-API-CERT-NAME': clientSecret,
        'Content-Type': 'text/xml; charset=utf-8'
      },
      body: xmlRequest
    })

    const xmlResponse = await response.text()

    const ackMatch = xmlResponse.match(/<Ack>(.*?)<\/Ack>/)
    const ack = ackMatch ? ackMatch[1] : 'Unknown'

    if (ack !== 'Success' && ack !== 'Warning') {
      const errorMatch = xmlResponse.match(/<LongMessage>(.*?)<\/LongMessage>/)
      throw new Error(`API失敗: ${errorMatch ? errorMatch[1] : ack}`)
    }

    const items = parseItems(xmlResponse)
    allItems.push(...items)

    const totalPagesMatch = xmlResponse.match(/<TotalNumberOfPages>(\d+)<\/TotalNumberOfPages>/)
    const totalPages = totalPagesMatch ? parseInt(totalPagesMatch[1]) : 1

    if (pageNumber >= totalPages) {
      hasMore = false
    } else {
      pageNumber++
    }

    if (allItems.length >= 50000) {
      hasMore = false
    }
  }

  return allItems
}

function buildXmlRequest(token: string, pageNumber: number, entriesPerPage: number, modTimeFrom: string | null): string {
  const modTimeFilter = modTimeFrom 
    ? `<ModTimeFrom>${modTimeFrom}</ModTimeFrom>` 
    : ''

  return `<?xml version="1.0" encoding="utf-8"?>
<GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${token}</eBayAuthToken>
  </RequesterCredentials>
  <ErrorLanguage>en_US</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
  <ActiveList>
    <Include>true</Include>
    <Pagination>
      <EntriesPerPage>${entriesPerPage}</EntriesPerPage>
      <PageNumber>${pageNumber}</PageNumber>
    </Pagination>
    <Sort>TimeLeft</Sort>
    ${modTimeFilter}
  </ActiveList>
  <DetailLevel>ReturnAll</DetailLevel>
</GetMyeBaySellingRequest>`
}

function parseItems(xml: string): any[] {
  const items: any[] = []
  const itemMatches = xml.matchAll(/<Item>([\s\S]*?)<\/Item>/g)

  for (const match of itemMatches) {
    const itemXml = match[1]

    const item = {
      ItemID: extractValue(itemXml, 'ItemID') || '',
      Title: extractValue(itemXml, 'Title') || '',
      SKU: extractValue(itemXml, 'SKU'),
      CurrentPrice: parseFloat(extractValue(itemXml, 'CurrentPrice') || '0'),
      Currency: extractAttribute(itemXml, 'CurrentPrice', 'currencyID') || 'USD',
      Quantity: parseInt(extractValue(itemXml, 'Quantity') || '1'),
      QuantityAvailable: parseInt(extractValue(itemXml, 'QuantityAvailable') || '1'),
      QuantitySold: parseInt(extractValue(itemXml, 'QuantitySold') || '0'),
      WatchCount: parseInt(extractValue(itemXml, 'WatchCount') || '0'),
      ListingURL: extractValue(itemXml, 'ViewItemURL'),
      GalleryURL: extractValue(itemXml, 'GalleryURL'),
      Site: extractValue(itemXml, 'Site') || 'US'
    }

    if (item.ItemID) {
      items.push(item)
    }
  }

  return items
}

function buildSaveData(listing: any, accountName: string) {
  return {
    unique_id: `ebay-${accountName}-${listing.ItemID}`,
    product_name: listing.Title || '商品名未設定',
    sku: listing.SKU || listing.ItemID,
    product_type: 'stock',
    physical_quantity: listing.Quantity || 1,
    listing_quantity: listing.QuantityAvailable || listing.Quantity || 1,
    selling_price: listing.CurrentPrice || 0,
    images: listing.GalleryURL ? [listing.GalleryURL.replace('/thumbs/', '/').replace(/s-l\d+\./, 's-l1600.')] : [],
    source_data: {
      marketplace: 'ebay',
      ebay_account: accountName,
      site: listing.Site || 'US',
      ebay_item_id: listing.ItemID,
      ebay_url: listing.ListingURL,
      original_price: listing.CurrentPrice,
      currency: listing.Currency,
      watch_count: listing.WatchCount,
      quantity_sold: listing.QuantitySold,
      synced_at: new Date().toISOString()
    },
    ebay_data: {
      item_id: listing.ItemID,
      title: listing.Title,
      sku: listing.SKU,
      price: listing.CurrentPrice,
      currency: listing.Currency,
      quantity: listing.Quantity,
      quantity_available: listing.QuantityAvailable,
      quantity_sold: listing.QuantitySold,
      watch_count: listing.WatchCount,
      site: listing.Site,
      url: listing.ListingURL,
      gallery_url: listing.GalleryURL
    },
    marketplace: 'ebay',
    account: accountName,
    is_manual_entry: false
  }
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    throw new Error('トークン取得失敗')
  }

  const data = await response.json()
  return data.access_token
}

function extractValue(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`))
  return match ? match[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : null
}

function extractAttribute(xml: string, tag: string, attr: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>`))
  return match ? match[1] : null
}
