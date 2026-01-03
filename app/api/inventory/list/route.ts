/**
 * 棚卸しリスト取得API（サーバーサイドページネーション）
 * GET /api/inventory/list
 *
 * パラメータ:
 * - page: ページ番号（デフォルト: 1）
 * - limit: 1ページあたりの件数（デフォルト: 50）
 * - marketplace: マーケットプレイス（all, ebay, mercari, manual）
 * - stock_status: 在庫状態（all, in_stock, out_of_stock）
 * - product_type: 商品タイプ（all, stock, dropship, set, variation）
 * - search: 検索ワード（商品名・SKU）
 * - sort_by: ソート列（created_at, product_name, selling_price など）
 * - sort_order: ソート順（asc, desc）
 * - ebay_account: eBayアカウント（all, MJT, GREEN, manual）
 * - site: サイト（all, US, UK, AU）
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // パラメータ取得
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const marketplace = searchParams.get('marketplace') || 'all'
    const stockStatus = searchParams.get('stock_status') || 'all'
    const productType = searchParams.get('product_type') || 'all'
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const ebayAccount = searchParams.get('ebay_account') || 'all'
    const site = searchParams.get('site') || 'all'
    const condition = searchParams.get('condition') || 'all'
    const inventoryType = searchParams.get('inventory_type') || 'all'
    const pricePhase = searchParams.get('price_phase') || 'all'
    const daysHeld = searchParams.get('days_held') || 'all'
    const variationStatus = searchParams.get('variation_status') || 'all'
    const groupingCandidate = searchParams.get('grouping_candidate') === 'true'

    // ページネーション計算
    const from = (page - 1) * limit
    const to = from + limit - 1

    // クエリ構築
    let query = supabase
      .from('inventory_master')
      .select('*', { count: 'exact' })

    // マーケットプレイスフィルター
    if (marketplace !== 'all') {
      if (marketplace === 'manual') {
        // 手動登録 = marketplaceがnullまたはmanual
        query = query.or('source_data->>marketplace.is.null,source_data->>marketplace.eq.manual')
      } else {
        query = query.eq('source_data->>marketplace', marketplace)
      }
    }

    // eBayアカウントフィルター
    if (ebayAccount !== 'all') {
      if (ebayAccount === 'manual') {
        query = query.or('source_data->>ebay_account.is.null,source_data->>ebay_account.eq.')
      } else {
        query = query.ilike('source_data->>ebay_account', ebayAccount)
      }
    }

    // サイトフィルター
    if (site !== 'all') {
      query = query.eq('source_data->>site', site)
    }

    // 在庫状態フィルター
    if (stockStatus === 'in_stock') {
      query = query.gt('physical_quantity', 0)
    } else if (stockStatus === 'out_of_stock') {
      query = query.eq('physical_quantity', 0)
    }

    // 商品タイプフィルター
    if (productType !== 'all' && productType !== 'unknown') {
      query = query.eq('product_type', productType)
    } else if (productType === 'unknown') {
      query = query.is('product_type', null)
    }

    // コンディションフィルター
    if (condition !== 'all') {
      query = query.ilike('condition_name', condition)
    }

    // 在庫タイプフィルター
    if (inventoryType !== 'all') {
      query = query.eq('inventory_type', inventoryType)
    }

    // 価格フェーズフィルター
    if (pricePhase !== 'all') {
      query = query.eq('current_price_phase', pricePhase)
    }

    // 経過日数フィルター
    if (daysHeld !== 'all') {
      const now = new Date()
      if (daysHeld === '0-90') {
        const date90DaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        query = query.gte('date_acquired', date90DaysAgo.toISOString())
      } else if (daysHeld === '91-180') {
        const date90DaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        const date180DaysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
        query = query.lt('date_acquired', date90DaysAgo.toISOString())
        query = query.gte('date_acquired', date180DaysAgo.toISOString())
      } else if (daysHeld === '180+') {
        const date180DaysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
        query = query.lt('date_acquired', date180DaysAgo.toISOString())
      }
    }

    // バリエーション状態フィルター
    if (variationStatus !== 'all') {
      if (variationStatus === 'parent') {
        query = query.eq('is_variation_parent', true)
      } else if (variationStatus === 'member') {
        query = query.or('is_variation_member.eq.true,is_variation_child.eq.true')
      } else if (variationStatus === 'standalone') {
        query = query.is('is_variation_parent', null)
        query = query.is('is_variation_member', null)
        query = query.is('is_variation_child', null)
      }
    }

    // グルーピング候補フィルター
    if (groupingCandidate) {
      query = query.gt('physical_quantity', 0)
      query = query.not('category', 'is', null)
      query = query.neq('product_type', 'set')
      query = query.is('is_variation_parent', null)
      query = query.is('is_variation_member', null)
      query = query.is('is_variation_child', null)
    }

    // 検索フィルター
    if (search) {
      // SQLインジェクション対策のためワイルドカードをエスケープ
      const escapedSearch = search.replace(/[%_]/g, '\\$&')
      query = query.or(`product_name.ilike.%${escapedSearch}%,sku.ilike.%${escapedSearch}%`)
    }

    // ソートとページネーション
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Inventory list error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`[inventory/list] ページ${page}: ${data?.length || 0}件取得 (総数: ${count}件)`)

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error: any) {
    console.error('Inventory list API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || '不明なエラー' },
      { status: 500 }
    )
  }
}
