'use client'

import { useState, useEffect, useCallback } from 'react'
import { InventoryProduct, InventoryFilter, InventoryStats, Marketplace, EbayAccount, ProductType } from '@/types/inventory'

interface UseInventoryOptions {
  initialPage?: number
  initialLimit?: number
}

interface UseInventoryReturn {
  products: InventoryProduct[]
  stats: InventoryStats | null
  categories: string[]
  loading: boolean
  statsLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filter: InventoryFilter
  setFilter: (filter: InventoryFilter) => void
  setPage: (page: number) => void
  refresh: () => Promise<void>
  refreshStats: () => Promise<void>
}

export function useInventory(options: UseInventoryOptions = {}): UseInventoryReturn {
  const { initialPage = 1, initialLimit = 50 } = options

  const [products, setProducts] = useState<InventoryProduct[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0
  })
  const [filter, setFilterState] = useState<InventoryFilter>({
    product_type: 'all',
    stock_status: 'all',
    condition: 'all',
    site: 'US',
    marketplace: 'ebay',
    ebay_account: 'all',
    inventory_type: 'all',
    price_phase: 'all',
    days_held: 'all',
    variation_status: 'all',
    grouping_candidate: false
  })

  // 商品データ取得
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        marketplace: filter.marketplace || 'all',
        stock_status: filter.stock_status || 'all',
        product_type: filter.product_type || 'all',
        search: filter.search || '',
        ebay_account: filter.ebay_account || 'all',
        site: filter.site || 'all',
        condition: filter.condition || 'all',
        inventory_type: filter.inventory_type || 'all',
        price_phase: filter.price_phase || 'all',
        days_held: filter.days_held || 'all',
        variation_status: filter.variation_status || 'all',
        grouping_candidate: filter.grouping_candidate ? 'true' : 'false',
        sort_by: 'created_at',
        sort_order: 'desc'
      })

      const response = await fetch(`/api/inventory/list?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'データ取得に失敗しました')
      }

      // データ変換（APIレスポンスをInventoryProduct型に変換）
      const inventoryProducts: InventoryProduct[] = data.data.map((item: any) => {
        const sourceData = item.source_data || {}
        const marketplace = sourceData.marketplace || 'manual'
        const account = sourceData.ebay_account || sourceData.mercari_account || null

        const ebayData = marketplace === 'ebay' ? {
          listing_id: sourceData.ebay_item_id,
          item_id: sourceData.ebay_item_id,
          url: sourceData.ebay_url,
          site: sourceData.site
        } : undefined

        return {
          id: item.id,
          unique_id: item.unique_id,
          product_name: item.product_name,
          sku: item.sku,
          product_type: item.product_type,
          physical_quantity: item.physical_quantity || 0,
          listing_quantity: item.listing_quantity || 0,
          cost_price: item.cost_price || 0,
          selling_price: item.selling_price || 0,
          condition_name: item.condition_name || '',
          category: item.category || '',
          subcategory: item.subcategory,
          images: item.images || [],
          source_data: item.source_data,
          supplier_info: item.supplier_info,
          is_manual_entry: item.is_manual_entry ?? (marketplace === 'manual'),
          priority_score: item.priority_score || 0,
          notes: item.notes,
          created_at: item.created_at,
          updated_at: item.updated_at,
          marketplace: marketplace as Marketplace,
          account: account,
          ebay_data: ebayData,
          date_acquired: item.date_acquired,
          target_sale_deadline: item.target_sale_deadline,
          inventory_type: item.inventory_type,
          current_price_phase: item.current_price_phase,
          parent_sku: item.parent_sku,
          variation_attributes: item.variation_attributes,
          is_variation_parent: item.is_variation_parent || false,
          is_variation_child: item.is_variation_child || false,
          is_variation_member: item.is_variation_member || false,
          variation_parent_id: item.variation_parent_id || null
        }
      })

      setProducts(inventoryProducts)
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }))
    } catch (err) {
      console.error('Inventory fetch error:', err)
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filter])

  // 統計取得
  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const response = await fetch('/api/inventory/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
        // カテゴリリストを設定
        if (data.stats.categories) {
          setCategories(data.stats.categories)
        }
      }
    } catch (err) {
      console.error('Stats fetch error:', err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  // ページ変更
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  // フィルター変更時にページを1に戻す
  const setFilter = useCallback((newFilter: InventoryFilter) => {
    setFilterState(newFilter)
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  // リフレッシュ
  const refresh = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchStats()])
  }, [fetchProducts, fetchStats])

  // 統計のみリフレッシュ
  const refreshStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  // 初回ロード & フィルター/ページ変更時
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // 統計は初回のみ
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    products,
    stats,
    categories,
    loading,
    statsLoading,
    error,
    pagination,
    filter,
    setFilter,
    setPage,
    refresh,
    refreshStats
  }
}
