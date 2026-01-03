/**
 * eBay Orders API
 * GET /api/ebay/orders - 受注一覧取得
 * POST /api/ebay/orders - 受注同期実行
 * 
 * eBay Fulfillment API を使用して受注データを取得し、
 * 在庫連動システムと連携
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAccessToken } from '@/lib/ebay/oauth'

const EBAY_API_BASE = 'https://api.ebay.com'

// ==============================================
// 型定義
// ==============================================

interface EbayOrder {
  orderId: string
  legacyOrderId?: string
  creationDate: string
  lastModifiedDate: string
  orderFulfillmentStatus: string
  orderPaymentStatus: string
  buyer: {
    username: string
    buyerRegistrationAddress?: {
      fullName?: string
      contactAddress?: {
        addressLine1?: string
        addressLine2?: string
        city?: string
        stateOrProvince?: string
        postalCode?: string
        countryCode?: string
      }
    }
  }
  pricingSummary: {
    total: {
      value: string
      currency: string
    }
  }
  lineItems: {
    lineItemId: string
    legacyItemId?: string
    sku?: string
    title: string
    quantity: number
    lineItemCost: {
      value: string
      currency: string
    }
  }[]
  fulfillmentStartInstructions?: {
    shippingStep?: {
      shipTo?: {
        fullName?: string
        contactAddress?: {
          addressLine1?: string
          addressLine2?: string
          city?: string
          stateOrProvince?: string
          postalCode?: string
          countryCode?: string
        }
      }
    }
  }[]
}

interface EbayOrdersResponse {
  href: string
  total: number
  limit: number
  offset: number
  orders: EbayOrder[]
}

// ==============================================
// GET: 受注一覧取得
// ==============================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const account = searchParams.get('account') || 'mjt'
    const status = searchParams.get('status') || 'NOT_STARTED,IN_PROGRESS'
    const days = parseInt(searchParams.get('days') || '30')
    const limit = parseInt(searchParams.get('limit') || '50')

    const supabase = await createClient()

    // DBから既存の受注を取得
    const { data: dbOrders, error: dbError } = await supabase
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
      .eq('marketplace', `ebay_${account}`)
      .order('order_date', { ascending: false })
      .limit(limit)

    if (dbError) {
      console.error('DB受注取得エラー:', dbError)
    }

    return NextResponse.json({
      success: true,
      data: {
        orders: dbOrders || [],
        total: dbOrders?.length || 0,
        account
      }
    })

  } catch (error: any) {
    console.error('❌ 受注取得エラー:', error)
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
      account = 'mjt',
      days = 7,
      processInventory = true,
      status = 'NOT_STARTED,IN_PROGRESS'
    } = body

    console.log(`🔄 eBay受注同期開始: ${account}, 過去${days}日間`)

    const supabase = await createClient()

    // eBay Access Token取得
    const accessToken = await getAccessToken(account)

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'eBayアクセストークンの取得に失敗しました' },
        { status: 401 }
      )
    }

    // 日付フィルター
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)
    const filter = `creationdate:[${fromDate.toISOString()}..${new Date().toISOString()}]`

    // eBay APIから受注を取得
    const ordersUrl = `${EBAY_API_BASE}/sell/fulfillment/v1/order?filter=${encodeURIComponent(filter)}&limit=50`
    
    const response = await fetch(ordersUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('eBay API エラー:', errorText)
      return NextResponse.json(
        { success: false, error: `eBay API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const ordersData: EbayOrdersResponse = await response.json()
    const orders = ordersData.orders || []

    console.log(`📦 eBayから${orders.length}件の受注を取得`)

    let syncedCount = 0
    let skippedCount = 0
    let inventoryProcessedCount = 0
    const errors: any[] = []

    // 各受注を処理
    for (const ebayOrder of orders) {
      try {
        // 既存チェック
        const { data: existing } = await supabase
          .from('orders')
          .select('id, order_status')
          .eq('marketplace', `ebay_${account}`)
          .eq('order_id', ebayOrder.orderId)
          .maybeSingle()

        if (existing) {
          // ステータス更新のみ
          await supabase
            .from('orders')
            .update({
              order_status: mapEbayStatus(ebayOrder.orderFulfillmentStatus),
              order_data: ebayOrder,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
          
          skippedCount++
          continue
        }

        // 配送先情報を取得
        const shippingAddress = ebayOrder.fulfillmentStartInstructions?.[0]?.shippingStep?.shipTo

        // 受注を登録
        const { data: newOrder, error: insertError } = await supabase
          .from('orders')
          .insert({
            marketplace: `ebay_${account}`,
            account_key: account,
            order_id: ebayOrder.orderId,
            buyer_id: ebayOrder.buyer.username,
            buyer_name: shippingAddress?.fullName || ebayOrder.buyer.buyerRegistrationAddress?.fullName,
            shipping_address: shippingAddress?.contactAddress || null,
            order_date: ebayOrder.creationDate,
            total_amount: parseFloat(ebayOrder.pricingSummary.total.value),
            currency: ebayOrder.pricingSummary.total.currency,
            order_status: mapEbayStatus(ebayOrder.orderFulfillmentStatus),
            order_data: ebayOrder
          })
          .select()
          .single()

        if (insertError) {
          console.error('受注登録エラー:', insertError)
          errors.push({ order_id: ebayOrder.orderId, error: insertError.message })
          continue
        }

        // 受注明細を登録
        for (const lineItem of ebayOrder.lineItems) {
          // SKUからマスター商品を検索
          let stockMasterId = null
          if (lineItem.sku) {
            const { data: master } = await supabase
              .from('products_master')
              .select('id')
              .eq('sku', lineItem.sku)
              .maybeSingle()
            
            stockMasterId = master?.id
          }

          const { data: orderItem, error: itemError } = await supabase
            .from('order_items')
            .insert({
              order_id: newOrder.id,
              stock_master_id: stockMasterId,
              sku: lineItem.sku,
              title: lineItem.title,
              quantity: lineItem.quantity,
              unit_price: parseFloat(lineItem.lineItemCost.value),
              item_data: lineItem
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
              lineItem.quantity,
              `ebay_${account}`,
              ebayOrder.orderId
            )

            if (inventoryResult.success) {
              inventoryProcessedCount++
            }
          }
        }

        syncedCount++
      } catch (orderError: any) {
        console.error(`受注処理エラー (${ebayOrder.orderId}):`, orderError)
        errors.push({ order_id: ebayOrder.orderId, error: orderError.message })
      }
    }

    console.log(`✅ eBay受注同期完了: 新規${syncedCount}件, スキップ${skippedCount}件, 在庫処理${inventoryProcessedCount}件`)

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
    console.error('❌ 受注同期エラー:', error)
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
 * eBayのステータスを内部ステータスにマッピング
 */
function mapEbayStatus(ebayStatus: string): string {
  const statusMap: Record<string, string> = {
    'NOT_STARTED': 'pending',
    'IN_PROGRESS': 'paid',
    'FULFILLED': 'shipped',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
  }
  return statusMap[ebayStatus] || 'pending'
}

/**
 * 受注に対する在庫処理
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
      console.log(`⏭️ 無在庫商品のためスキップ: ${product.title}`)
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

    // 受注明細の処理済みフラグを更新
    await supabase
      .from('order_items')
      .update({
        inventory_processed: true,
        inventory_processed_at: new Date().toISOString()
      })
      .eq('id', orderItemId)

    console.log(`✅ 在庫処理完了: ${product.title}, ${currentQuantity} → ${newQuantity}`)

    return { success: true }
  } catch (error: any) {
    console.error('在庫処理エラー:', error)
    return { success: false, error: error.message }
  }
}
