/**
 * メルカリAPI クライアント
 * 
 * 注意: メルカリは公式APIを提供していないため、
 * 以下のアプローチが必要:
 * 1. 手動CSV/データインポート
 * 2. ブラウザ自動化（Playwright/Puppeteer）
 * 3. 通知メール解析
 * 
 * このファイルは将来のAPI対応に備えた基盤実装
 */

import { createClient } from '@/lib/supabase/client'

// ==============================================
// 型定義
// ==============================================

export interface MercariListing {
  id: string
  name: string
  price: number
  status: 'on_sale' | 'trading' | 'sold_out' | 'stop'
  description?: string
  category_id?: string
  item_condition?: string
  shipping_method?: string
  shipping_payer?: string
  images?: string[]
  created_at?: string
  updated_at?: string
}

export interface MercariOrder {
  id: string
  item_id: string
  item_name: string
  price: number
  buyer_name: string
  order_date: string
  status: 'waiting_payment' | 'waiting_shipment' | 'shipped' | 'completed' | 'cancelled'
  shipping_address?: {
    name: string
    postal_code: string
    prefecture: string
    city: string
    address: string
  }
}

// ==============================================
// 手動データインポート
// ==============================================

/**
 * メルカリ商品データをインポート
 * CSVまたはJSONデータを受け取り、products_masterに登録
 */
export async function importMercariListings(
  listings: MercariListing[]
): Promise<{
  imported: number
  skipped: number
  errors: any[]
}> {
  const supabase = createClient()
  let imported = 0
  let skipped = 0
  const errors: any[] = []

  for (const listing of listings) {
    try {
      const uniqueId = `mercari-${listing.id}`

      // 既存チェック
      const { data: existing } = await supabase
        .from('products_master')
        .select('id')
        .eq('unique_id', uniqueId)
        .maybeSingle()

      if (existing) {
        skipped++
        continue
      }

      // products_masterに登録
      const { error: insertError } = await supabase
        .from('products_master')
        .insert({
          unique_id: uniqueId,
          source: 'mercari',
          source_item_id: listing.id,
          title: listing.name,
          price_jpy: listing.price,
          product_type: 'stock', // メルカリは全て有在庫
          is_stock_master: true,
          physical_quantity: listing.status === 'on_sale' ? 1 : 0,
          current_stock: listing.status === 'on_sale' ? 1 : 0,
          listing_status: listing.status,
          condition: listing.item_condition,
          image_urls: listing.images,
          source_data: listing
        })

      if (insertError) {
        errors.push({ id: listing.id, error: insertError.message })
        continue
      }

      imported++
    } catch (error: any) {
      errors.push({ id: listing.id, error: error.message })
    }
  }

  console.log(`✅ メルカリインポート完了: ${imported}件追加, ${skipped}件スキップ`)

  return { imported, skipped, errors }
}

/**
 * メルカリ受注データをインポート
 */
export async function importMercariOrders(
  orders: MercariOrder[]
): Promise<{
  imported: number
  skipped: number
  inventoryProcessed: number
  errors: any[]
}> {
  const supabase = createClient()
  let imported = 0
  let skipped = 0
  let inventoryProcessed = 0
  const errors: any[] = []

  for (const order of orders) {
    try {
      // 既存チェック
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('marketplace', 'mercari_jp')
        .eq('order_id', order.id)
        .maybeSingle()

      if (existing) {
        skipped++
        continue
      }

      // マスター商品を検索
      const { data: master } = await supabase
        .from('products_master')
        .select('id')
        .eq('source', 'mercari')
        .eq('source_item_id', order.item_id)
        .maybeSingle()

      // 受注を登録
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          marketplace: 'mercari_jp',
          account_key: 'default',
          order_id: order.id,
          buyer_name: order.buyer_name,
          shipping_address: order.shipping_address,
          order_date: order.order_date,
          total_amount: order.price,
          currency: 'JPY',
          order_status: mapMercariStatus(order.status),
          order_data: order
        })
        .select()
        .single()

      if (orderError) {
        errors.push({ id: order.id, error: orderError.message })
        continue
      }

      // 受注明細を登録
      const { data: orderItem, error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: newOrder.id,
          stock_master_id: master?.id,
          sku: order.item_id,
          title: order.item_name,
          quantity: 1,
          unit_price: order.price,
          item_data: order
        })
        .select()
        .single()

      if (itemError) {
        errors.push({ id: order.id, error: itemError.message })
        continue
      }

      // 在庫処理（マスターが見つかった場合）
      if (master?.id) {
        const { error: stockError } = await supabase
          .from('products_master')
          .update({
            physical_quantity: 0,
            current_stock: 0,
            listing_status: 'sold_out',
            updated_at: new Date().toISOString()
          })
          .eq('id', master.id)

        if (!stockError) {
          // 変動履歴を記録
          await supabase
            .from('stock_movements')
            .insert({
              stock_master_id: master.id,
              order_item_id: orderItem.id,
              movement_type: 'sale',
              quantity_before: 1,
              quantity_after: 0,
              quantity_change: -1,
              source_marketplace: 'mercari_jp',
              source_order_id: order.id
            })

          // 明細の処理済みフラグを更新
          await supabase
            .from('order_items')
            .update({
              inventory_processed: true,
              inventory_processed_at: new Date().toISOString()
            })
            .eq('id', orderItem.id)

          inventoryProcessed++
        }
      }

      imported++
    } catch (error: any) {
      errors.push({ id: order.id, error: error.message })
    }
  }

  console.log(`✅ メルカリ受注インポート完了: ${imported}件追加, ${inventoryProcessed}件在庫処理`)

  return { imported, skipped, inventoryProcessed, errors }
}

// ==============================================
// ステータスマッピング
// ==============================================

function mapMercariStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'waiting_payment': 'pending',
    'waiting_shipment': 'paid',
    'shipped': 'shipped',
    'completed': 'completed',
    'cancelled': 'cancelled'
  }
  return statusMap[status] || 'pending'
}

// ==============================================
// 将来のAPI対応用プレースホルダー
// ==============================================

/**
 * メルカリAPIクライアント（将来用）
 * メルカリが公式APIを提供した場合に実装
 */
export class MercariApiClient {
  private accessToken: string | null = null

  constructor(private config: {
    clientId?: string
    clientSecret?: string
  }) {}

  async authenticate(): Promise<boolean> {
    // メルカリOAuth実装（将来用）
    console.warn('⚠️ メルカリAPIは現在利用不可です')
    return false
  }

  async getListings(): Promise<MercariListing[]> {
    throw new Error('メルカリAPIは現在利用不可です')
  }

  async getOrders(): Promise<MercariOrder[]> {
    throw new Error('メルカリAPIは現在利用不可です')
  }

  async updateListing(id: string, data: Partial<MercariListing>): Promise<boolean> {
    throw new Error('メルカリAPIは現在利用不可です')
  }
}
