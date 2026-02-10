/**
 * eBay Trading API 経由での出品同期（高速版）
 * 
 * 改善点:
 * 1. 並列処理（10件同時）で高速化
 * 2. 基本情報のみモード（skipDetails=true）
 * 3. バッチサイズ制限でタイムアウト防止
 * 
 * POST /api/sync/ebay-trading
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { syncCurrencyForNewRecord } from '@/lib/utils/currency-sync'

interface TradingSyncRequest {
  account: 'mjt' | 'green' | 'all'
  limit?: number
  autoClassify?: 'stock' | 'dropship'
  forceUpdate?: boolean
  skipDetails?: boolean  // true: 基本情報のみ（高速）、false: 詳細も取得
  batchSize?: number     // 一度に処理する件数（デフォルト50）
  offset?: number        // オフセット（ページネーション用）
}

// GetItem で取得する完全なデータ構造
interface EbayFullItemData {
  ItemID: string
  Title: string
  SKU: string | null
  CurrentPrice: number
  Currency: string
  Quantity: number
  QuantityAvailable: number
  QuantitySold: number
  ConditionID: string | null
  ConditionDisplayName: string | null
  ConditionDescription: string | null
  PrimaryCategoryID: string | null
  PrimaryCategoryName: string | null
  SecondaryCategoryID: string | null
  SecondaryCategoryName: string | null
  ItemSpecifics: Record<string, string>
  Description: string | null
  ListingType: string | null
  ListingDuration: string | null
  StartTime: string | null
  EndTime: string | null
  TimeLeft: string | null
  WatchCount: number
  HitCount: number
  QuestionCount: number
  PictureURLs: string[]
  GalleryURL: string | null
  ShippingType: string | null
  ShippingServiceCost: number | null
  ShippingServiceName: string | null
  ShipToLocations: string[]
  ExcludeShipToLocations: string[]
  DispatchTimeMax: number | null
  Location: string | null
  Country: string | null
  PostalCode: string | null
  BestOfferEnabled: boolean
  BuyItNowAvailable: boolean
  ReturnsAccepted: boolean
  Site: string | null
  ListingURL: string | null
  BuyItNowPrice: number | null
  ReservePrice: number | null
  StartPrice: number | null
  PaymentMethods: string[]
}

export const maxDuration = 300 // 5分タイムアウト

export async function POST(req: NextRequest) {
  try {
    const body: TradingSyncRequest = await req.json()
    const { 
      account, 
      limit, 
      autoClassify = 'stock', 
      forceUpdate = false, 
      skipDetails = true  // デフォルトは高速モード
    } = body

    if (!account) {
      return NextResponse.json(
        { error: 'accountパラメータが必要です (mjt, green, all)' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const accounts: string[] = account === 'all' ? ['mjt', 'green'] : [account]

    let totalSynced = 0
    let totalUpdated = 0
    let totalSkipped = 0
    let totalErrors = 0
    let totalDetailsFetched = 0
    let totalFetched = 0

    for (const accountName of accounts) {
      console.log(`\n=== eBay Trading API ${accountName.toUpperCase()} 同期開始 ===`)

      try {
        // Step 1: GetMyeBaySelling でリスト取得
        console.log(`📋 [${accountName}] Step 1: GetMyeBaySelling でリスト取得...`)
        const basicListings = await fetchActiveListings(accountName, limit)
        console.log(`📦 [${accountName}] 基本リスト取得: ${basicListings.length}件`)
        totalFetched += basicListings.length

        // 全件処理
        const targetListings = basicListings
        console.log(`🎯 [${accountName}] 処理対象: ${targetListings.length}件`)

        // Step 2: 詳細取得（必要な場合のみ、並列処理）
        const fullListings: EbayFullItemData[] = []
        
        if (!skipDetails && targetListings.length > 0) {
          console.log(`🔍 [${accountName}] Step 2: GetItem で詳細取得（並列処理）...`)
          
          // 10件ずつ並列処理
          const parallelSize = 10
          for (let i = 0; i < targetListings.length; i += parallelSize) {
            const batch = targetListings.slice(i, i + parallelSize)
            
            const results = await Promise.allSettled(
              batch.map(basic => fetchItemDetails(accountName, basic.ItemID))
            )
            
            for (let j = 0; j < results.length; j++) {
              const result = results[j]
              if (result.status === 'fulfilled') {
                fullListings.push(result.value)
                totalDetailsFetched++
              } else {
                console.error(`   ⚠️ 詳細取得エラー [${batch[j].ItemID}]: ${result.reason}`)
                fullListings.push(convertBasicToFull(batch[j]))
              }
            }
            
            console.log(`   詳細取得: ${Math.min(i + parallelSize, targetListings.length)}/${targetListings.length}件完了`)
          }
        } else {
          // 基本情報のみ
          for (const basic of targetListings) {
            fullListings.push(convertBasicToFull(basic))
          }
        }

        // Step 3: inventory_master に保存（欠落データ補完更新対応）
        console.log(`💾 [${accountName}] Step 3: inventory_master に保存...`)

        for (const listing of fullListings) {
          try {
            const uniqueId = `ebay-${accountName}-${listing.ItemID}`

            // 既存データを詳細に取得（欠落チェック用）
            const { data: existing } = await supabase
              .from('inventory_master')
              .select('id, images, selling_price, condition_name, category, source_data, ebay_data')
              .eq('unique_id', uniqueId)
              .maybeSingle()

            const saveData = buildFullSaveData(listing, accountName, autoClassify)

            if (existing) {
              // 欠落データがあるかチェック
              const needsUpdate = forceUpdate ||
                // 画像がない場合
                (!existing.images || existing.images.length === 0) && saveData.images?.length > 0 ||
                // 価格がない場合
                (!existing.selling_price || existing.selling_price === 0) && saveData.selling_price > 0 ||
                // コンディションがない場合
                !existing.condition_name && saveData.condition_name ||
                // カテゴリがない場合
                !existing.category && saveData.category ||
                // source_dataが24時間以上古い場合
                shouldRefreshSourceData(existing.source_data)

              if (!needsUpdate) {
                totalSkipped++
                continue
              }

              // マージ更新（既存データを保持しつつ新データで補完）
              const mergedData = {
                ...saveData,
                // 既存の手動入力値は保持
                cost_price: existing.source_data?.cost_price || saveData.cost_price,
                // 画像はマージ（重複除去）
                images: mergeUniqueImages(existing.images, saveData.images),
                // source_dataはディープマージ
                source_data: {
                  ...(existing.source_data || {}),
                  ...saveData.source_data,
                  previous_sync_at: existing.source_data?.synced_at
                },
                // ebay_dataもディープマージ
                ebay_data: {
                  ...(existing.ebay_data || {}),
                  ...saveData.ebay_data
                },
                updated_at: new Date().toISOString()
              }

              const { error: updateError } = await supabase
                .from('inventory_master')
                .update(mergedData)
                .eq('id', existing.id)

              if (updateError) {
                console.error(`更新エラー [${listing.ItemID}]:`, updateError.message)
                totalErrors++
              } else {
                // 通貨・サイト情報を同期
                await syncCurrencyForNewRecord(
                  supabase,
                  saveData.unique_id,
                  { currency: listing.Currency, site: listing.Site || 'US' },
                  {}
                )
                console.log(`   補完更新: ${listing.ItemID}`)
                totalUpdated++
              }
              continue
            }

            // 新規作成
            const { error: insertError } = await supabase
              .from('inventory_master')
              .insert(saveData)

            if (insertError) {
              console.error(`登録エラー [${listing.ItemID}]:`, insertError.message)
              totalErrors++
            } else {
              // 通貨・サイト情報を同期
              await syncCurrencyForNewRecord(
                supabase,
                saveData.unique_id,
                { currency: listing.Currency, site: listing.Site || 'US' },
                {}
              )
              totalSynced++
            }

          } catch (itemError: any) {
            console.error(`処理エラー [${listing.ItemID}]:`, itemError.message)
            totalErrors++
          }
        }

      } catch (accountError: any) {
        console.error(`[${accountName}] アカウントエラー:`, accountError.message)
        totalErrors++
      }
    }

    console.log(`\n✅ Trading API同期完了`)
    console.log(`取得: ${totalFetched}件`)
    console.log(`新規登録: ${totalSynced}件`)
    console.log(`更新: ${totalUpdated}件`)
    console.log(`スキップ: ${totalSkipped}件`)
    console.log(`詳細取得: ${totalDetailsFetched}件`)
    console.log(`エラー: ${totalErrors}件`)

    return NextResponse.json({
      success: true,
      total_fetched: totalFetched,
      total_synced: totalSynced,
      total_updated: totalUpdated,
      total_skipped: totalSkipped,
      total_details_fetched: totalDetailsFetched,
      total_errors: totalErrors,
      accounts,
      mode: skipDetails ? 'basic' : 'full'
    })

  } catch (error: any) {
    console.error('Trading API同期エラー:', error)
    return NextResponse.json(
      { error: `同期失敗: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * GetItem API で商品詳細を取得
 */
async function fetchItemDetails(account: string, itemId: string): Promise<EbayFullItemData> {
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
    throw new Error(`${account}のリフレッシュトークンが見つかりません`)
  }

  const clientId = process.env[`EBAY_CLIENT_ID_${accountUpper}`] || process.env.EBAY_CLIENT_ID!
  const clientSecret = process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] || process.env.EBAY_CLIENT_SECRET!
  const devId = process.env.EBAY_DEV_ID!

  const accessToken = await getAccessToken(clientId, clientSecret, tokenData.refresh_token)

  const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${accessToken}</eBayAuthToken>
  </RequesterCredentials>
  <ErrorLanguage>en_US</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
  <ItemID>${itemId}</ItemID>
  <DetailLevel>ReturnAll</DetailLevel>
  <IncludeItemSpecifics>true</IncludeItemSpecifics>
</GetItemRequest>`

  const response = await fetch('https://api.ebay.com/ws/api.dll', {
    method: 'POST',
    headers: {
      'X-EBAY-API-SITEID': '0',
      'X-EBAY-API-COMPATIBILITY-LEVEL': '1193',
      'X-EBAY-API-CALL-NAME': 'GetItem',
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
    throw new Error(`GetItem失敗: ${errorMatch ? errorMatch[1] : ack}`)
  }

  return parseGetItemResponse(xmlResponse)
}

/**
 * GetItem レスポンスをパース
 */
function parseGetItemResponse(xml: string): EbayFullItemData {
  const itemMatch = xml.match(/<Item>([\s\S]*?)<\/Item>/)
  if (!itemMatch) {
    throw new Error('Item要素が見つかりません')
  }
  const itemXml = itemMatch[1]

  const itemSpecifics: Record<string, string> = {}
  const specificsMatch = itemXml.match(/<ItemSpecifics>([\s\S]*?)<\/ItemSpecifics>/)
  if (specificsMatch) {
    const nameValueMatches = specificsMatch[1].matchAll(/<NameValueList>([\s\S]*?)<\/NameValueList>/g)
    for (const nvMatch of nameValueMatches) {
      const name = extractValue(nvMatch[1], 'Name')
      const value = extractValue(nvMatch[1], 'Value')
      if (name && value) {
        itemSpecifics[name] = value
      }
    }
  }

  const pictureURLs: string[] = []
  const pictureDetailsMatch = itemXml.match(/<PictureDetails>([\s\S]*?)<\/PictureDetails>/)
  if (pictureDetailsMatch) {
    const urls = extractAllValues(pictureDetailsMatch[1], 'PictureURL')
    pictureURLs.push(...urls)
  }

  const shipToLocations: string[] = extractAllValues(itemXml, 'ShipToLocations')
  const excludeLocations: string[] = extractAllValues(itemXml, 'ExcludeShipToLocation')
  const paymentMethods: string[] = extractAllValues(itemXml, 'PaymentMethods')

  return {
    ItemID: extractValue(itemXml, 'ItemID') || '',
    Title: extractValue(itemXml, 'Title') || '',
    SKU: extractValue(itemXml, 'SKU'),
    CurrentPrice: parseFloat(extractValue(itemXml, 'CurrentPrice') || '0'),
    Currency: extractAttribute(itemXml, 'CurrentPrice', 'currencyID') || 'USD',
    Quantity: parseInt(extractValue(itemXml, 'Quantity') || '1'),
    QuantityAvailable: parseInt(extractValue(itemXml, 'QuantityAvailable') || '1'),
    QuantitySold: parseInt(extractValue(itemXml, 'QuantitySold') || '0'),
    ConditionID: extractValue(itemXml, 'ConditionID'),
    ConditionDisplayName: extractValue(itemXml, 'ConditionDisplayName'),
    ConditionDescription: extractValue(itemXml, 'ConditionDescription'),
    PrimaryCategoryID: extractNestedValue(itemXml, 'PrimaryCategory', 'CategoryID'),
    PrimaryCategoryName: extractNestedValue(itemXml, 'PrimaryCategory', 'CategoryName'),
    SecondaryCategoryID: extractNestedValue(itemXml, 'SecondaryCategory', 'CategoryID'),
    SecondaryCategoryName: extractNestedValue(itemXml, 'SecondaryCategory', 'CategoryName'),
    ItemSpecifics: itemSpecifics,
    Description: extractCDATA(itemXml, 'Description'),
    ListingType: extractValue(itemXml, 'ListingType'),
    ListingDuration: extractValue(itemXml, 'ListingDuration'),
    StartTime: extractValue(itemXml, 'StartTime'),
    EndTime: extractValue(itemXml, 'EndTime'),
    TimeLeft: extractValue(itemXml, 'TimeLeft'),
    WatchCount: parseInt(extractValue(itemXml, 'WatchCount') || '0'),
    HitCount: parseInt(extractValue(itemXml, 'HitCount') || '0'),
    QuestionCount: parseInt(extractValue(itemXml, 'QuestionCount') || '0'),
    PictureURLs: pictureURLs,
    GalleryURL: extractValue(itemXml, 'GalleryURL'),
    ShippingType: extractValue(itemXml, 'ShippingType'),
    ShippingServiceCost: parseFloatOrNull(extractNestedValue(itemXml, 'ShippingServiceOptions', 'ShippingServiceCost')),
    ShippingServiceName: extractNestedValue(itemXml, 'ShippingServiceOptions', 'ShippingService'),
    ShipToLocations: shipToLocations,
    ExcludeShipToLocations: excludeLocations,
    DispatchTimeMax: parseInt(extractValue(itemXml, 'DispatchTimeMax') || '0') || null,
    Location: extractValue(itemXml, 'Location'),
    Country: extractValue(itemXml, 'Country'),
    PostalCode: extractValue(itemXml, 'PostalCode'),
    BestOfferEnabled: extractValue(itemXml, 'BestOfferEnabled') === 'true',
    BuyItNowAvailable: extractValue(itemXml, 'BuyItNowAvailable') === 'true',
    ReturnsAccepted: extractNestedValue(itemXml, 'ReturnPolicy', 'ReturnsAcceptedOption') === 'ReturnsAccepted',
    Site: extractValue(itemXml, 'Site'),
    ListingURL: extractValue(itemXml, 'ViewItemURL'),
    BuyItNowPrice: parseFloatOrNull(extractValue(itemXml, 'BuyItNowPrice')),
    ReservePrice: parseFloatOrNull(extractValue(itemXml, 'ReservePrice')),
    StartPrice: parseFloatOrNull(extractValue(itemXml, 'StartPrice')),
    PaymentMethods: paymentMethods
  }
}

/**
 * 完全なデータでDB保存用オブジェクトを構築
 */
function buildFullSaveData(listing: EbayFullItemData, accountName: string, autoClassify: string) {
  const brand = listing.ItemSpecifics['Brand'] || listing.ItemSpecifics['ブランド'] || null
  const mpn = listing.ItemSpecifics['MPN'] || listing.ItemSpecifics['製造番号'] || null
  const type = listing.ItemSpecifics['Type'] || listing.ItemSpecifics['タイプ'] || null

  return {
    unique_id: `ebay-${accountName}-${listing.ItemID}`,
    product_name: listing.Title || '商品名未設定',
    sku: listing.SKU || listing.ItemID,
    product_type: autoClassify,
    physical_quantity: listing.Quantity || 1,
    listing_quantity: listing.QuantityAvailable || listing.Quantity || 1,
    cost_price: 0,
    selling_price: listing.CurrentPrice || 0,
    condition_name: listing.ConditionDisplayName || null,
    category: listing.PrimaryCategoryName || null,
    subcategory: listing.SecondaryCategoryName || null,
    images: listing.PictureURLs || [],

    source_data: {
      marketplace: 'ebay',
      ebay_account: accountName,
      site: listing.Site || 'US',
      listing_id: listing.ItemID,
      ebay_item_id: listing.ItemID,
      ebay_url: listing.ListingURL || `https://www.ebay.com/itm/${listing.ItemID}`,
      original_price: listing.CurrentPrice,
      currency: listing.Currency,
      start_time: listing.StartTime,
      end_time: listing.EndTime,
      time_left: listing.TimeLeft,
      listing_type: listing.ListingType,
      listing_duration: listing.ListingDuration,
      watch_count: listing.WatchCount,
      hit_count: listing.HitCount,
      question_count: listing.QuestionCount,
      quantity_sold: listing.QuantitySold,
      best_offer_enabled: listing.BestOfferEnabled,
      buy_it_now_available: listing.BuyItNowAvailable,
      buy_it_now_price: listing.BuyItNowPrice,
      reserve_price: listing.ReservePrice,
      start_price: listing.StartPrice,
      shipping_type: listing.ShippingType,
      gallery_url: listing.GalleryURL,
      synced_at: new Date().toISOString()
    },

    marketplace: 'ebay',
    account: accountName,

    ebay_data: {
      item_id: listing.ItemID,
      listing_id: listing.ItemID,
      title: listing.Title,
      sku: listing.SKU,
      price: listing.CurrentPrice,
      currency: listing.Currency,
      buy_it_now_price: listing.BuyItNowPrice,
      reserve_price: listing.ReservePrice,
      start_price: listing.StartPrice,
      quantity: listing.Quantity,
      quantity_available: listing.QuantityAvailable,
      quantity_sold: listing.QuantitySold,
      condition_id: listing.ConditionID,
      condition_name: listing.ConditionDisplayName,
      condition_description: listing.ConditionDescription,
      primary_category_id: listing.PrimaryCategoryID,
      primary_category_name: listing.PrimaryCategoryName,
      secondary_category_id: listing.SecondaryCategoryID,
      secondary_category_name: listing.SecondaryCategoryName,
      item_specifics: listing.ItemSpecifics,
      brand: brand,
      mpn: mpn,
      type: type,
      description: listing.Description,
      listing_type: listing.ListingType,
      listing_duration: listing.ListingDuration,
      start_time: listing.StartTime,
      end_time: listing.EndTime,
      time_left: listing.TimeLeft,
      watch_count: listing.WatchCount,
      hit_count: listing.HitCount,
      question_count: listing.QuestionCount,
      images: listing.PictureURLs,
      gallery_url: listing.GalleryURL,
      shipping_type: listing.ShippingType,
      shipping_service_cost: listing.ShippingServiceCost,
      shipping_service_name: listing.ShippingServiceName,
      ship_to_locations: listing.ShipToLocations,
      exclude_ship_to_locations: listing.ExcludeShipToLocations,
      dispatch_time_max: listing.DispatchTimeMax,
      location: listing.Location,
      country: listing.Country,
      postal_code: listing.PostalCode,
      best_offer_enabled: listing.BestOfferEnabled,
      buy_it_now_available: listing.BuyItNowAvailable,
      returns_accepted: listing.ReturnsAccepted,
      site: listing.Site,
      url: listing.ListingURL,
      payment_methods: listing.PaymentMethods
    },

    is_manual_entry: false,
    priority_score: listing.WatchCount > 0 ? Math.min(listing.WatchCount, 100) : 0,
    notes: `${accountName.toUpperCase()} Trading API同期 (${new Date().toISOString()})`
  }
}

/**
 * 基本情報のみのデータをFullデータ形式に変換
 */
function convertBasicToFull(basic: any): EbayFullItemData {
  return {
    ItemID: basic.ItemID,
    Title: basic.Title,
    SKU: basic.SKU,
    CurrentPrice: basic.CurrentPrice,
    Currency: basic.Currency,
    Quantity: basic.Quantity,
    QuantityAvailable: basic.QuantityAvailable,
    QuantitySold: basic.QuantitySold,
    ConditionID: basic.ConditionID,
    ConditionDisplayName: basic.ConditionDisplayName,
    ConditionDescription: null,
    PrimaryCategoryID: basic.PrimaryCategoryID,
    PrimaryCategoryName: basic.PrimaryCategoryName,
    SecondaryCategoryID: basic.SecondaryCategoryID,
    SecondaryCategoryName: basic.SecondaryCategoryName,
    ItemSpecifics: {},
    Description: null,
    ListingType: basic.ListingType,
    ListingDuration: basic.ListingDuration,
    StartTime: basic.StartTime,
    EndTime: basic.EndTime,
    TimeLeft: basic.TimeLeft,
    WatchCount: basic.WatchCount,
    HitCount: basic.HitCount,
    QuestionCount: basic.QuestionCount,
    PictureURLs: basic.PictureURLs,
    GalleryURL: basic.GalleryURL,
    ShippingType: basic.ShippingType,
    ShippingServiceCost: null,
    ShippingServiceName: null,
    ShipToLocations: [],
    ExcludeShipToLocations: [],
    DispatchTimeMax: null,
    Location: null,
    Country: null,
    PostalCode: null,
    BestOfferEnabled: basic.BestOfferEnabled,
    BuyItNowAvailable: basic.BuyItNowAvailable,
    ReturnsAccepted: false,
    Site: basic.Site,
    ListingURL: basic.ListingURL,
    BuyItNowPrice: basic.BuyItNowPrice,
    ReservePrice: basic.ReservePrice,
    StartPrice: basic.StartPrice,
    PaymentMethods: []
  }
}

// ============================================
// 既存のヘルパー関数
// ============================================

interface BasicListingData {
  ItemID: string
  Title: string
  SKU: string | null
  CurrentPrice: number
  Currency: string
  Quantity: number
  QuantityAvailable: number
  QuantitySold: number
  ConditionID: string | null
  ConditionDisplayName: string | null
  PrimaryCategoryID: string | null
  PrimaryCategoryName: string | null
  SecondaryCategoryID: string | null
  SecondaryCategoryName: string | null
  ListingType: string | null
  ListingDuration: string | null
  StartTime: string | null
  EndTime: string | null
  TimeLeft: string | null
  WatchCount: number
  HitCount: number
  QuestionCount: number
  PictureURLs: string[]
  GalleryURL: string | null
  ShippingType: string | null
  BestOfferEnabled: boolean
  BuyItNowAvailable: boolean
  Site: string | null
  ListingURL: string | null
  BuyItNowPrice: number | null
  ReservePrice: number | null
  StartPrice: number | null
}

async function fetchActiveListings(account: string, limit?: number): Promise<BasicListingData[]> {
  const accountUpper = account.toUpperCase()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

  const { data: tokenData } = await supabase
    .from('ebay_tokens')
    .select('refresh_token, access_token, expires_at')
    .eq('account', account)
    .maybeSingle()

  if (!tokenData?.refresh_token) {
    throw new Error(`${account}のリフレッシュトークンが見つかりません`)
  }

  const clientId = process.env[`EBAY_CLIENT_ID_${accountUpper}`] || process.env.EBAY_CLIENT_ID!
  const clientSecret = process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] || process.env.EBAY_CLIENT_SECRET!
  const devId = process.env.EBAY_DEV_ID!

  const accessToken = await getAccessToken(clientId, clientSecret, tokenData.refresh_token)

  const allItems: BasicListingData[] = []
  let pageNumber = 1
  let hasMore = true
  const entriesPerPage = 200

  while (hasMore) {
    console.log(`📦 [${account}] GetMyeBaySelling page=${pageNumber}...`)

    const xmlRequest = buildGetMyeBaySellingXml(accessToken, pageNumber, entriesPerPage)

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
      throw new Error(`GetMyeBaySelling失敗: ${errorMatch ? errorMatch[1] : ack}`)
    }

    const items = parseActiveListItems(xmlResponse)
    allItems.push(...items)

    const totalPagesMatch = xmlResponse.match(/<TotalNumberOfPages>(\d+)<\/TotalNumberOfPages>/)
    const totalPages = totalPagesMatch ? parseInt(totalPagesMatch[1]) : 1

    if (pageNumber >= totalPages || (limit && allItems.length >= limit)) {
      hasMore = false
    } else {
      pageNumber++
    }

    if (allItems.length >= 10000) {
      console.warn(`⚠️ [${account}] 安全上限10000件に達しました`)
      hasMore = false
    }
  }

  return limit ? allItems.slice(0, limit) : allItems
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
    const error = await response.text()
    throw new Error(`トークン取得失敗: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

function buildGetMyeBaySellingXml(token: string, pageNumber: number, entriesPerPage: number): string {
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
  </ActiveList>
  <DetailLevel>ReturnAll</DetailLevel>
</GetMyeBaySellingRequest>`
}

function parseActiveListItems(xml: string): BasicListingData[] {
  const items: BasicListingData[] = []
  const itemMatches = xml.matchAll(/<Item>([\s\S]*?)<\/Item>/g)

  for (const match of itemMatches) {
    const itemXml = match[1]
    const { pictureURLs, galleryURL } = extractPictureData(itemXml)

    const item: BasicListingData = {
      ItemID: extractValue(itemXml, 'ItemID') || '',
      Title: extractValue(itemXml, 'Title') || '',
      SKU: extractValue(itemXml, 'SKU'),
      CurrentPrice: parseFloat(extractValue(itemXml, 'CurrentPrice') || '0'),
      Currency: extractAttribute(itemXml, 'CurrentPrice', 'currencyID') || 'USD',
      Quantity: parseInt(extractValue(itemXml, 'Quantity') || '1'),
      QuantityAvailable: parseInt(extractValue(itemXml, 'QuantityAvailable') || '1'),
      QuantitySold: parseInt(extractValue(itemXml, 'QuantitySold') || '0'),
      ConditionID: extractValue(itemXml, 'ConditionID'),
      ConditionDisplayName: extractValue(itemXml, 'ConditionDisplayName'),
      PrimaryCategoryID: extractNestedValue(itemXml, 'PrimaryCategory', 'CategoryID'),
      PrimaryCategoryName: extractNestedValue(itemXml, 'PrimaryCategory', 'CategoryName'),
      SecondaryCategoryID: extractNestedValue(itemXml, 'SecondaryCategory', 'CategoryID'),
      SecondaryCategoryName: extractNestedValue(itemXml, 'SecondaryCategory', 'CategoryName'),
      ListingType: extractValue(itemXml, 'ListingType'),
      ListingDuration: extractValue(itemXml, 'ListingDuration'),
      StartTime: extractValue(itemXml, 'StartTime'),
      EndTime: extractValue(itemXml, 'EndTime'),
      TimeLeft: extractValue(itemXml, 'TimeLeft'),
      WatchCount: parseInt(extractValue(itemXml, 'WatchCount') || '0'),
      HitCount: parseInt(extractValue(itemXml, 'HitCount') || '0'),
      QuestionCount: parseInt(extractValue(itemXml, 'QuestionCount') || '0'),
      PictureURLs: pictureURLs,
      GalleryURL: galleryURL,
      ShippingType: extractValue(itemXml, 'ShippingType'),
      BestOfferEnabled: extractValue(itemXml, 'BestOfferEnabled') === 'true',
      BuyItNowAvailable: extractValue(itemXml, 'BuyItNowAvailable') === 'true',
      Site: extractValue(itemXml, 'Site'),
      ListingURL: extractValue(itemXml, 'ViewItemURL'),
      BuyItNowPrice: parseFloatOrNull(extractValue(itemXml, 'BuyItNowPrice')),
      ReservePrice: parseFloatOrNull(extractValue(itemXml, 'ReservePrice')),
      StartPrice: parseFloatOrNull(extractValue(itemXml, 'StartPrice'))
    }

    if (item.ItemID) {
      items.push(item)
    }
  }

  return items
}

function extractPictureData(itemXml: string): { pictureURLs: string[], galleryURL: string | null } {
  const urls: string[] = []
  const seen = new Set<string>()
  let galleryURL: string | null = null

  const pictureDetailsMatch = itemXml.match(/<PictureDetails>([\s\S]*?)<\/PictureDetails>/)
  if (pictureDetailsMatch) {
    const detailsXml = pictureDetailsMatch[1]
    galleryURL = extractValue(detailsXml, 'GalleryURL')
    
    const pictureUrls = extractAllValues(detailsXml, 'PictureURL')
    for (const url of pictureUrls) {
      if (url && !seen.has(url)) {
        seen.add(url)
        urls.push(url)
      }
    }
    
    if (urls.length === 0 && galleryURL) {
      const fullSizeUrl = convertGalleryToFullSize(galleryURL)
      if (!seen.has(fullSizeUrl)) {
        seen.add(fullSizeUrl)
        urls.push(fullSizeUrl)
      }
    }
  }

  const directPictureUrls = extractAllValues(itemXml, 'PictureURL')
  for (const url of directPictureUrls) {
    if (url && !seen.has(url)) {
      seen.add(url)
      urls.push(url)
    }
  }

  if (!galleryURL) {
    galleryURL = extractValue(itemXml, 'GalleryURL')
    if (galleryURL && urls.length === 0) {
      const fullSizeUrl = convertGalleryToFullSize(galleryURL)
      if (!seen.has(fullSizeUrl)) {
        seen.add(fullSizeUrl)
        urls.push(fullSizeUrl)
      }
    }
  }

  return { pictureURLs: urls, galleryURL }
}

function convertGalleryToFullSize(galleryUrl: string): string {
  return galleryUrl
    .replace('/thumbs/', '/')
    .replace(/s-l\d+\./, 's-l1600.')
    .replace(/\$_\d+\./, '$_57.')
}

function extractValue(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`))
  return match ? decodeXmlEntities(match[1]) : null
}

function extractCDATA(xml: string, tag: string): string | null {
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`))
  if (cdataMatch) {
    return cdataMatch[1]
  }
  const textMatch = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return textMatch ? decodeXmlEntities(textMatch[1]) : null
}

function extractNestedValue(xml: string, parentTag: string, childTag: string): string | null {
  const parentMatch = xml.match(new RegExp(`<${parentTag}>([\\s\\S]*?)</${parentTag}>`))
  if (!parentMatch) return null
  return extractValue(parentMatch[1], childTag)
}

function extractAttribute(xml: string, tag: string, attr: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>`))
  return match ? match[1] : null
}

function extractAllValues(xml: string, tag: string): string[] {
  const values: string[] = []
  const matches = xml.matchAll(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'g'))
  for (const match of matches) {
    if (match[1]) values.push(decodeXmlEntities(match[1]))
  }
  return values
}

function parseFloatOrNull(value: string | null): number | null {
  if (!value) return null
  const parsed = parseFloat(value)
  return isNaN(parsed) ? null : parsed
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

/**
 * source_dataの更新が必要か判定（24時間以上経過していたら更新）
 */
function shouldRefreshSourceData(sourceData: any): boolean {
  if (!sourceData?.synced_at) return true

  const lastSynced = new Date(sourceData.synced_at)
  const now = new Date()
  const hoursDiff = (now.getTime() - lastSynced.getTime()) / (1000 * 60 * 60)

  // 24時間以上経過していたら更新
  return hoursDiff > 24
}

/**
 * 画像配列をマージ（重複除去）
 */
function mergeUniqueImages(existing: string[] | null, incoming: string[] | null): string[] {
  const all = [...(existing || []), ...(incoming || [])]
  const seen = new Set<string>()
  const unique: string[] = []

  for (const url of all) {
    if (!url) continue
    // URLを正規化して比較
    const normalized = url.split('?')[0].toLowerCase()
    if (!seen.has(normalized)) {
      seen.add(normalized)
      unique.push(url)
    }
  }

  return unique
}
