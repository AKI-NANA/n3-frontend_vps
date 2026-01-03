/**
 * Amazon SP-API 受注取得API
 * GET /api/amazon/orders - 受注一覧取得
 * POST /api/amazon/orders - 受注同期実行
 * 
 * Amazon Selling Partner API Orders API を使用
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SecureAmazonTokenManager, AMAZON_MARKETPLACES, MarketplaceCode } from '@/lib/amazon/sp-api/secure-amazon-token-manager'

// ==============================================
// 型定義
// ==============================================

interface AmazonOrder {
  AmazonOrderId: string
  PurchaseDate: string
  LastUpdateDate: string
  OrderStatus: string
  FulfillmentChannel: string
  SalesChannel: string
  ShipServiceLevel: string
  OrderTotal?: {
    CurrencyCode: string
    Amount: string
  }
  NumberOfItemsShipped: number
  NumberOfItemsUnshipped: number
  PaymentMethod: string
  MarketplaceId: string
  ShippingAddress?: {
    Name?: string
    AddressLine1?: string
    AddressLine2?: string
    City?: string
    StateOrRegion?: string
    PostalCode?: string
    CountryCode?: string
  }
  BuyerInfo?: {
    BuyerEmail?: string
    BuyerName?: string
  }
}

interface AmazonOrderItem {
  ASIN: string
  SellerSKU?: string
  OrderItemId: string
  Title: string
  QuantityOrdered: number
  QuantityShipped: number
  ItemPrice?: {
    CurrencyCode: string
    Amount: string
  }
}

// ==============================================
// GET: 受注一覧取得（DB）
// ==============================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const marketplace = searchParams.get('marketplace') || 'US'
    const limit = parseInt(searchParams.get('limit') || '50')

    const supabase = await createClient()

    // DBから受注を取得
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          sku,
          title,
          quantity,
          unit_price,
          inventory_processed,
          stock_master_id
        )
      `)
      .eq('marketplace', `amazon_${marketplace.toLowerCase()}`)
      .order('order_date', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        orders: orders || [],
        total: orders?.length || 0,
        marketplace
      }
    })

  } catch (error: any) {
    console.error('❌ Amazon受注取得エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// ==============================================
// POST: 受注同期実行
// ==============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      marketplace = 'US',
      accountName = 'default',
      days = 7,
      processInventory = true
    } = body

    console.log(`🔄 Amazon受注同期開始: ${marketplace}, 過去${days}日間`)

    const supabase = await createClient()
    const tokenManager = new SecureAmazonTokenManager()

    // アクセストークン取得
    const tokenResult = await tokenManager.getAccessToken(accountName, marketplace as MarketplaceCode)

    if (!tokenResult.success || !tokenResult.accessToken) {
      return NextResponse.json(
        { success: false, error: 'Amazonアクセストークンの取得に失敗しました', details: tokenResult.error },
        { status: 401 }
      )
    }

    const marketplaceConfig = AMAZON_MARKETPLACES[marketplace as MarketplaceCode]
    if (!marketplaceConfig) {
      return NextResponse.json(
        { success: false, error: `不明なマーケットプレイス: ${marketplace}` },
        { status: 400 }
      )
    }

    // 日付フィルター
    const createdAfter = new Date()
    createdAfter.setDate(createdAfter.getDate() - days)

    // Amazon Orders API呼び出し
    const ordersUrl = `${marketplaceConfig.endpoint}/orders/v0/orders?MarketplaceIds=${marketplaceConfig.id}&CreatedAfter=${createdAfter.toISOString()}`

    const response = await fetch(ordersUrl, {
      headers: {
        'Authorization': `Bearer ${tokenResult.accessToken}`,
        'x-amz-access-token': tokenResult.accessToken,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Amazon API エラー:', errorText)
      return NextResponse.json(
        { success: false, error: `Amazon API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const ordersData = await response.json()
    const orders: AmazonOrder[] = ordersData.payload?.Orders || []

    console.log(`📦 Amazonから${orders.length}件の受注を取得`)

    let syncedCount = 0
    let skippedCount = 0
    let inventoryProcessedCount = 0
    const errors: any[] = []

    // 各受注を処理
    for (const amazonOrder of orders) {
      try {
        // 既存チェック
        const { data: existing } = await supabase
          .from('orders')
          .select('id')
          .eq('marketplace', `amazon_${marketplace.toLowerCase()}`)
          .eq('order_id', amazonOrder.AmazonOrderId)
          .maybeSingle()

        if (existing) {
          // ステータス更新
          await supabase
            .from('orders')
            .update({
              order_status: mapAmazonStatus(amazonOrder.OrderStatus),
              order_data: amazonOrder,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)

          skippedCount++
          continue
        }

        // 受注を登録
        const { data: newOrder, error: insertError } = await supabase
          .from('orders')
          .insert({
            marketplace: `amazon_${marketplace.toLowerCase()}`,
            account_key: accountName,
            order_id: amazonOrder.AmazonOrderId,
            buyer_id: amazonOrder.BuyerInfo?.BuyerEmail,
            buyer_name: amazonOrder.ShippingAddress?.Name || amazonOrder.BuyerInfo?.BuyerName,
            shipping_address: amazonOrder.ShippingAddress,
            order_date: amazonOrder.PurchaseDate,
            total_amount: amazonOrder.OrderTotal ? parseFloat(amazonOrder.OrderTotal.Amount) : 0,
            currency: amazonOrder.OrderTotal?.CurrencyCode || 'USD',
            order_status: mapAmazonStatus(amazonOrder.OrderStatus),
            order_data: amazonOrder
          })
          .select()
          .single()

        if (insertError) {
          errors.push({ order_id: amazonOrder.AmazonOrderId, error: insertError.message })
          continue
        }

        // 受注明細を取得
        const orderItems = await fetchOrderItems(
          tokenResult.accessToken,
          marketplaceConfig.endpoint,
          amazonOrder.AmazonOrderId
        )

        // 各明細を処理
        for (const item of orderItems) {
          // SKUからマスター商品を検索
          let stockMasterId = null
          if (item.SellerSKU) {
            const { data: master } = await supabase
              .from('products_master')
              .select('id')
              .eq('sku', item.SellerSKU)
              .maybeSingle()

            stockMasterId = master?.id
          }

          const { data: orderItem, error: itemError } = await supabase
            .from('order_items')
            .insert({
              order_id: newOrder.id,
              stock_master_id: stockMasterId,
              sku: item.SellerSKU,
              title: item.Title,
              quantity: item.QuantityOrdered,
              unit_price: item.ItemPrice ? parseFloat(item.ItemPrice.Amount) : 0,
              item_data: item
            })
            .select()
            .single()

          if (itemError) {
            console.error('明細登録エラー:', itemError)
            continue
          }

          // 在庫処理
          if (processInventory && stockMasterId) {
            const inventoryResult = await processOrderInventory(
              supabase,
              stockMasterId,
              orderItem.id,
              item.QuantityOrdered,
              `amazon_${marketplace.toLowerCase()}`,
              amazonOrder.AmazonOrderId
            )

            if (inventoryResult.success) {
              inventoryProcessedCount++
            }
          }
        }

        syncedCount++
      } catch (orderError: any) {
        console.error(`受注処理エラー (${amazonOrder.AmazonOrderId}):`, orderError)
        errors.push({ order_id: amazonOrder.AmazonOrderId, error: orderError.message })
      }
    }

    console.log(`✅ Amazon受注同期完了: 新規${syncedCount}件, スキップ${skippedCount}件, 在庫処理${inventoryProcessedCount}件`)

    return NextResponse.json({
      success: true,
      data: {
        total_fetched: orders.length,
        synced: syncedCount,
        skipped: skippedCount,
        inventory_processed: inventoryProcessedCount,
        errors: errors.length > 0 ? errors : undefined
      }
    })

  } catch (error: any) {
    console.error('❌ Amazon受注同期エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// ==============================================
// ヘルパー関数
// ==============================================

/**
 * 受注明細を取得
 */
async function fetchOrderItems(
  accessToken: string,
  endpoint: string,
  orderId: string
): Promise<AmazonOrderItem[]> {
  try {
    const url = `${endpoint}/orders/v0/orders/${orderId}/orderItems`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('明細取得エラー:', await response.text())
      return []
    }

    const data = await response.json()
    return data.payload?.OrderItems || []
  } catch (error) {
    console.error('明細取得エラー:', error)
    return []
  }
}

/**
 * Amazonステータスのマッピング
 */
function mapAmazonStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'Pending': 'pending',
    'Unshipped': 'paid',
    'PartiallyShipped': 'shipped',
    'Shipped': 'shipped',
    'Canceled': 'cancelled',
    'Unfulfillable': 'cancelled'
  }
  return statusMap[status] || 'pending'
}

/**
 * 在庫処理
 */
async function processOrderInventory(
  supabase: any,
  stockMasterId: string,
  orderItemId: string,
  quantity: number,
  marketplace: string,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 現在の在庫を取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('id, physical_quantity, current_stock, product_type, title')
      .eq('id', stockMasterId)
      .single()

    if (fetchError || !product) {
      return { success: false, error: '商品が見つかりません' }
    }

    // 無在庫商品はスキップ
    if (product.product_type === 'dropship') {
      return { success: true }
    }

    const currentQuantity = product.physical_quantity || product.current_stock || 0
    const newQuantity = Math.max(currentQuantity - quantity, 0)

    // 在庫更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        physical_quantity: newQuantity,
        current_stock: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', stockMasterId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // 変動履歴を記録
    await supabase
      .from('stock_movements')
      .insert({
        stock_master_id: stockMasterId,
        order_item_id: orderItemId,
        movement_type: 'sale',
        quantity_before: currentQuantity,
        quantity_after: newQuantity,
        quantity_change: -quantity,
        source_marketplace: marketplace,
        source_order_id: orderId
      })

    // 明細の処理済みフラグを更新
    await supabase
      .from('order_items')
      .update({
        inventory_processed: true,
        inventory_processed_at: new Date().toISOString()
      })
      .eq('id', orderItemId)

    console.log(`✅ Amazon在庫処理完了: ${product.title}, ${currentQuantity} → ${newQuantity}`)

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
