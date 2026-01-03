/**
 * 棚卸しツール用 商品検索API
 * GET: SKU/商品名で検索（必要最小限の情報のみ返す）
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 外注担当者に公開する情報のみ選択
const ALLOWED_FIELDS = `
  id,
  sku,
  product_name,
  physical_quantity,
  storage_location,
  last_counted_at,
  counted_by,
  inventory_images,
  product_type,
  condition_name
`

/**
 * GET /api/inventory-count/products
 * クエリパラメータ:
 * - search: 検索ワード（SKU or 商品名）
 * - page: ページ番号
 * - limit: 1ページあたりの件数
 * - uncounted_only: true の場合、未棚卸しのみ
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const uncountedOnly = searchParams.get('uncounted_only') === 'true'
    const hasStockOnly = searchParams.get('has_stock_only') !== 'false' // デフォルトtrue
    
    // ページネーション計算
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    // クエリ構築
    let query = supabase
      .from('inventory_master')
      .select(ALLOWED_FIELDS, { count: 'exact' })
    
    // 在庫ありのみ（デフォルト）
    if (hasStockOnly) {
      query = query.gt('physical_quantity', 0)
    }
    
    // 未棚卸しのみ
    if (uncountedOnly) {
      query = query.is('last_counted_at', null)
    }
    
    // 検索フィルター
    if (search) {
      const escapedSearch = search.replace(/[%_]/g, '\\$&')
      query = query.or(`product_name.ilike.%${escapedSearch}%,sku.ilike.%${escapedSearch}%`)
    }
    
    // ソートとページネーション
    query = query
      .order('last_counted_at', { ascending: true, nullsFirst: true }) // 未棚卸しを先に
      .order('sku', { ascending: true })
      .range(from, to)
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('[InventoryCount] Products search error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    // 機密情報を除外したレスポンス
    const safeData = (data || []).map(item => ({
      id: item.id,
      sku: item.sku,
      product_name: item.product_name,
      current_quantity: item.physical_quantity,
      storage_location: item.storage_location,
      last_counted_at: item.last_counted_at,
      counted_by: item.counted_by,
      images: item.inventory_images,
      product_type: item.product_type,
      condition: item.condition_name
    }))
    
    return NextResponse.json({
      success: true,
      data: safeData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error: any) {
    console.error('[InventoryCount] Products API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || '不明なエラー' },
      { status: 500 }
    )
  }
}
