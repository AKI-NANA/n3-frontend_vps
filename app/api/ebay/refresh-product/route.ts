/**
 * eBay商品詳細取得・更新API
 * POST /api/ebay/refresh-product
 * 
 * 既存のproducts_masterのeBay商品に対して、
 * eBay APIから最新の詳細データを取得して更新する
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SecureEbayApiClient } from '@/lib/ebay/secure-ebay-token-manager'

interface RefreshRequest {
  productId?: number        // 単一商品ID
  productIds?: number[]     // 複数商品ID
  sku?: string              // SKUで指定
  refreshAll?: boolean      // eBayソースの全商品を更新
  account?: 'mjt' | 'green' // アカウント指定
}

export async function POST(req: NextRequest) {
  try {
    const body: RefreshRequest = await req.json()
    const { productId, productIds, sku, refreshAll, account } = body

    const supabase = await createClient()
    
    // 対象商品を特定
    let targetProducts: any[] = []
    
    if (productId) {
      const { data } = await supabase
        .from('products_master')
        .select('*')
        .eq('id', productId)
        .single()
      if (data) targetProducts = [data]
    } else if (productIds && productIds.length > 0) {
      const { data } = await supabase
        .from('products_master')
        .select('*')
        .in('id', productIds)
      if (data) targetProducts = data
    } else if (sku) {
      const { data } = await supabase
        .from('products_master')
        .select('*')
        .eq('sku', sku)
        .single()
      if (data) targetProducts = [data]
    } else if (refreshAll) {
      // eBayからインポートされた商品を全て取得
      let query = supabase
        .from('products_master')
        .select('*')
        .or('sku.ilike.INV-ebay-%,source_platform.eq.ebay_import')
        .limit(500)
      
      const { data } = await query
      if (data) targetProducts = data
    }

    if (targetProducts.length === 0) {
      return NextResponse.json(
        { error: '対象商品が見つかりません' },
        { status: 404 }
      )
    }

    console.log(`🔄 ${targetProducts.length}件の商品を更新します`)

    let updated = 0
    let errors = 0
    const results: any[] = []

    for (const product of targetProducts) {
      try {
        // SKUからeBay情報を抽出
        const ebayInfo = extractEbayInfoFromSku(product.sku)
        
        if (!ebayInfo) {
          console.warn(`⚠️ eBay情報を抽出できません: ${product.sku}`)
          errors++
          results.push({ id: product.id, sku: product.sku, status: 'skipped', reason: 'not_ebay_product' })
          continue
        }

        const { accountName, listingId } = ebayInfo
        const targetAccount = account || accountName

        console.log(`📦 [${product.id}] ${product.sku} - Account: ${targetAccount}, ListingID: ${listingId}`)

        // eBay APIから詳細取得
        const client = new SecureEbayApiClient(targetAccount)
        const details = await fetchEbayItemDetails(client, listingId)

        if (!details) {
          console.warn(`⚠️ eBay詳細取得失敗: ${product.sku}`)
          errors++
          results.push({ id: product.id, sku: product.sku, status: 'error', reason: 'api_fetch_failed' })
          continue
        }

        // products_masterを更新
        const updateData: any = {
          // 基本情報
          title: details.title || product.title,
          description: details.description || product.description,
          
          // 価格情報
          price_usd: details.price || null,
          price_jpy: details.price ? Math.round(details.price * 150) : null, // 仮の為替レート
          
          // 画像
          images: details.images?.length > 0 ? details.images : product.images,
          image_urls: details.images?.length > 0 ? details.images : product.image_urls,
          
          // eBay API データ
          ebay_api_data: {
            listing_id: listingId,
            item_id: details.itemId,
            title: details.title,
            subtitle: details.subtitle,
            description: details.description,
            condition: details.condition,
            condition_description: details.conditionDescription,
            price: details.price,
            currency: details.currency,
            quantity: details.quantity,
            quantity_sold: details.quantitySold,
            images: details.images,
            brand: details.brand,
            mpn: details.mpn,
            upc: details.upc,
            category_id: details.categoryId,
            category_name: details.categoryName,
            aspects: details.aspects,
            listing_url: details.url,
            listing_status: details.status,
            start_time: details.startTime,
            end_time: details.endTime,
            fetched_at: new Date().toISOString()
          },
          
          // listing_dataを更新
          listing_data: {
            ...(product.listing_data || {}),
            ebay_listing_id: listingId,
            ebay_item_id: details.itemId,
            ebay_price_usd: details.price,
            ebay_quantity: details.quantity,
            ebay_condition: details.condition,
            image_urls: details.images || [],
            image_count: details.images?.length || 0
          },
          
          // ソース情報
          source_platform: 'ebay_import',
          source_item_id: listingId,
          
          // メタ
          updated_at: new Date().toISOString()
        }

        // Item Specificsからブランド等を抽出
        if (details.aspects) {
          if (details.aspects.Brand) {
            updateData.brand = Array.isArray(details.aspects.Brand) 
              ? details.aspects.Brand[0] 
              : details.aspects.Brand
          }
          if (details.aspects.MPN) {
            updateData.mpn = Array.isArray(details.aspects.MPN) 
              ? details.aspects.MPN[0] 
              : details.aspects.MPN
          }
        }

        const { error: updateError } = await supabase
          .from('products_master')
          .update(updateData)
          .eq('id', product.id)

        if (updateError) {
          console.error(`❌ 更新エラー [${product.id}]:`, updateError.message)
          errors++
          results.push({ id: product.id, sku: product.sku, status: 'error', reason: updateError.message })
        } else {
          console.log(`✅ 更新成功 [${product.id}]: ${details.title?.substring(0, 40)}...`)
          updated++
          results.push({ 
            id: product.id, 
            sku: product.sku, 
            status: 'updated',
            title: details.title,
            price: details.price
          })
        }

      } catch (itemError: any) {
        console.error(`❌ 処理エラー [${product.id}]:`, itemError.message)
        errors++
        results.push({ id: product.id, sku: product.sku, status: 'error', reason: itemError.message })
      }
    }

    return NextResponse.json({
      success: true,
      total: targetProducts.length,
      updated,
      errors,
      results
    })

  } catch (error: any) {
    console.error('リフレッシュエラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * SKUからeBay情報を抽出
 * 例: INV-ebay-green-376570080207 → { accountName: 'green', listingId: '376570080207' }
 */
function extractEbayInfoFromSku(sku: string): { accountName: string; listingId: string } | null {
  if (!sku) return null

  // パターン1: INV-ebay-{account}-{listingId}
  const invMatch = sku.match(/^INV-ebay-(\w+)-(\d+)$/)
  if (invMatch) {
    return { accountName: invMatch[1], listingId: invMatch[2] }
  }

  // パターン2: ebay-{account}-{listingId}
  const simpleMatch = sku.match(/^ebay-(\w+)-(\d+)$/)
  if (simpleMatch) {
    return { accountName: simpleMatch[1], listingId: simpleMatch[2] }
  }

  // パターン3: 数字のみ（Listing IDとみなす）
  if (/^\d{10,15}$/.test(sku)) {
    return { accountName: 'mjt', listingId: sku } // デフォルトアカウント
  }

  return null
}

/**
 * eBay GetItem APIで詳細データを取得
 */
async function fetchEbayItemDetails(
  client: SecureEbayApiClient,
  listingId: string
): Promise<any | null> {
  try {
    // Browse API を使用（GetItem相当）
    const response = await client.callApi(
      `/buy/browse/v1/item/v1|${listingId}|0`
    )

    if (!response || response.errors) {
      console.warn(`Browse API失敗、Trading APIを試行...`)
      return await fetchViaGetItem(client, listingId)
    }

    return {
      itemId: response.itemId,
      title: response.title,
      subtitle: response.subtitle,
      description: response.description || response.shortDescription,
      condition: response.condition,
      conditionDescription: response.conditionDescription,
      price: parseFloat(response.price?.value || '0'),
      currency: response.price?.currency || 'USD',
      quantity: response.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity || 1,
      quantitySold: response.estimatedAvailabilities?.[0]?.estimatedSoldQuantity || 0,
      images: response.image ? [response.image.imageUrl, ...(response.additionalImages?.map((i: any) => i.imageUrl) || [])] : [],
      brand: response.brand,
      mpn: response.mpn,
      upc: response.gtin,
      categoryId: response.categoryId,
      categoryName: response.categoryPath,
      aspects: response.localizedAspects?.reduce((acc: any, aspect: any) => {
        acc[aspect.name] = aspect.value
        return acc
      }, {}) || {},
      url: response.itemWebUrl,
      status: 'active',
      startTime: response.itemCreationDate,
      endTime: response.itemEndDate
    }

  } catch (error: any) {
    console.error(`詳細取得エラー [${listingId}]:`, error.message)
    return null
  }
}

/**
 * Trading API GetItem（フォールバック）
 */
async function fetchViaGetItem(
  client: SecureEbayApiClient,
  listingId: string
): Promise<any | null> {
  try {
    // Trading API は別の呼び出し方法が必要な場合がある
    // ここでは簡易的にnullを返す
    console.warn(`Trading API GetItem は未実装: ${listingId}`)
    return null
  } catch (error) {
    return null
  }
}
