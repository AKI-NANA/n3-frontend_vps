'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { InventoryProduct, InventoryFilter, InventoryStats } from '@/types/inventory'
import { StatsHeader } from './components/stats-header'
import { FilterPanel } from './components/filter-panel'
import { ProductCard } from './components/product-card'
import { ViewToggle } from './components/view-toggle'
import { ProductTable } from './components/product-table'
import { ProductRegistrationModal } from './components/product-registration-modal'
import { SetProductModal } from './components/set-product-modal'
import { BulkImageUpload } from './components/bulk-image-upload'
// P0-12: MarketplaceSelectorを削除し、FilterPanel.tsxに統合
// import { MarketplaceSelector } from './components/marketplace-selector'
import { InventoryAlerts } from './components/inventory-alerts'
import { GroupingBoxSidebar } from './components/grouping-box-sidebar'
import { TabNav } from './components/tab-nav'
import { ApprovalTab } from './components/approval-tab'
import { InventoryMasterTab } from './components/inventory-master-tab'
import { MercariSyncModal } from './components/mercari-sync-modal'
import { EbayCSVExportModal } from './components/ebay-csv-export-modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  calculateInventoryOptimizationStats,
  daysSinceAcquisition,
  determinePricePhase
} from '@/lib/services/inventory/automatic-price-reduction-service'
import {
  Package,
  ClipboardCheck,
  Database,
  Plus,
  Images,
  Layers,
  Zap,
  X,
  CloudDownload,
  Trash2,
  Store,
  RefreshCw,
  Loader2,
  BoxIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileSpreadsheet
} from 'lucide-react'

export default function TanaoroshiPage() {
  const supabase = createClientComponentClient()
  
  // State
  const [products, setProducts] = useState<InventoryProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<InventoryProduct[]>([])
  const [stats, setStats] = useState<InventoryStats>({
    total: 0,
    in_stock: 0,
    out_of_stock: 0,
    stock_count: 0,
    dropship_count: 0,
    set_count: 0,
    total_value: 0
  })
  const [filter, setFilter] = useState<InventoryFilter>({
    product_type: 'all',
    stock_status: 'all',
    condition: 'all',
    site: 'US',  // TASK 3: デフォルトでUSAを選択
    marketplace: 'ebay'  // TASK 3: デフォルトでeBayを選択
  })
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)

  // 同期ボタンの状態をアカウント別に分離
  const [ebaySyncingMjt, setEbaySyncingMjt] = useState(false)
  const [ebaySyncingGreen, setEbaySyncingGreen] = useState(false)
  const [mercariSyncing, setMercariSyncing] = useState(false)
  const [incrementalSyncing, setIncrementalSyncing] = useState(false)

  // 全eBay同期の状態（いずれかが同期中ならtrue）
  const ebaySyncing = ebaySyncingMjt || ebaySyncingGreen || incrementalSyncing

  // Modal State
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showSetModal, setShowSetModal] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null)
  // P0-12: selectedMarketplace を filter.marketplace に統合済み
  // const [selectedMarketplace, setSelectedMarketplace] = useState('all')

  // DDPグループ化サイドバー
  const [showGroupingSidebar, setShowGroupingSidebar] = useState(false)

  // メルカリ同期モーダル
  const [showMercariSyncModal, setShowMercariSyncModal] = useState(false)

  // eBay CSV出力モーダル
  const [showEbayCSVModal, setShowEbayCSVModal] = useState(false)

  // タブ管理
  const [activeTab, setActiveTab] = useState<'inventory' | 'approval' | 'master'>('inventory')
  const [approvalPendingCount, setApprovalPendingCount] = useState(0)

  // TASK 4: 表示モード管理
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  // ページネーション管理
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50)
  const [totalItems, setTotalItems] = useState(0)

  // データ取得（全件取得 + ページネーション表示）
  const loadProducts = async () => {
    setLoading(true)
    try {
      // 総件数を取得（is_inactive条件を削除）
      const { count, error: countError } = await supabase
        .from('inventory_master')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('カウント取得エラー:', countError)
      } else {
        setTotalItems(count || 0)
        console.log(`📊 総商品数: ${count}件`)
      }

      // 全データを分割取得（Supabaseの1000件上限対策）
      const allData: any[] = []
      let pageIndex = 0
      const pageSize = 1000
      let hasMore = true
      
      while (hasMore) {
        const from = pageIndex * pageSize
        const to = from + pageSize - 1
        
        console.log(`[loadProducts] ページ${pageIndex + 1}取得中... (${from}-${to})`)
        
        // is_inactive条件を削除
        const { data: pageData, error: pageError } = await supabase
          .from('inventory_master')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, to)
        
        if (pageError) throw pageError
        
        if (pageData && pageData.length > 0) {
          allData.push(...pageData)
          console.log(`[loadProducts] ページ${pageIndex + 1}: ${pageData.length}件取得 (累計: ${allData.length}件)`)
          
          if (pageData.length < pageSize) {
            hasMore = false
          } else {
            pageIndex++
          }
        } else {
          hasMore = false
        }
        
        // 安全上限10000件（10ページ）
        if (pageIndex >= 10) {
          console.warn('[loadProducts] 安全上限10000件に達しました')
          hasMore = false
        }
      }
      
      console.log(`📊 DB取得完了: 合計${allData.length}件`)

      // データ変換
      const inventoryProducts: InventoryProduct[] = allData.map(item => {
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
          marketplace: marketplace,
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
          // P0-3: バリエーション関連フィールドを追加
          is_variation_member: item.is_variation_member || false,
          variation_parent_id: item.variation_parent_id || null
        }
      })

      setProducts(inventoryProducts)

      // カテゴリリストを抽出
      const uniqueCategories = [...new Set(inventoryProducts.map(p => p.category))]
      setCategories(uniqueCategories.filter(Boolean))

      // 統計計算（アカウント別集計）
      const mjtProducts = inventoryProducts.filter(p => 
        p.account?.toLowerCase() === 'mjt' || 
        p.source_data?.ebay_account?.toLowerCase() === 'mjt'
      )
      const greenProducts = inventoryProducts.filter(p => 
        p.account?.toLowerCase() === 'green' || 
        p.source_data?.ebay_account?.toLowerCase() === 'green'
      )
      const mercariProducts = inventoryProducts.filter(p => 
        p.marketplace === 'mercari'
      )
      const manualProducts = inventoryProducts.filter(p => 
        p.marketplace === 'manual' || p.is_manual_entry
      )

      // 在庫総額計算（原価ベース）
      const costBasedValue = inventoryProducts.reduce(
        (sum, p) => sum + ((p.cost_price || 0) * (p.physical_quantity || 0)),
        0
      )

      // 出品総額計算（販売価格ベース）
      const sellingBasedValue = inventoryProducts.reduce(
        (sum, p) => sum + ((p.selling_price || 0) * (p.listing_quantity || 0)),
        0
      )

      console.log(`[統計] MJT: ${mjtProducts.length}件, GREEN: ${greenProducts.length}件, メルカリ: ${mercariProducts.length}件, 手動: ${manualProducts.length}件`)
      console.log(`[在庫総額] 原価ベース: $${costBasedValue.toFixed(0)}, 販売価格ベース: $${sellingBasedValue.toFixed(0)}`)

      // 基本統計
      const basicStats = {
        total: count || inventoryProducts.length,
        in_stock: inventoryProducts.filter(p => p.physical_quantity > 0).length,
        out_of_stock: inventoryProducts.filter(p => p.physical_quantity === 0).length,
        stock_count: inventoryProducts.filter(p => p.product_type === 'stock' || p.sku?.toLowerCase().includes('stock')).length,
        dropship_count: inventoryProducts.filter(p => p.product_type === 'dropship').length,
        set_count: inventoryProducts.filter(p => p.product_type === 'set').length,
        total_value: costBasedValue,
        total_selling_value: sellingBasedValue
      }

      // 在庫最適化統計を追加
      const optimizationStats = calculateInventoryOptimizationStats(inventoryProducts)

      // P0-5, P0-7: アカウント別統計を計算
      const calculateAccountStats = (products: InventoryProduct[]) => ({
        total: products.length,
        in_stock: products.filter(p => p.physical_quantity > 0).length,
        out_of_stock: products.filter(p => p.physical_quantity === 0).length,
        total_value: products.reduce((sum, p) => sum + ((p.cost_price || 0) * (p.physical_quantity || 0)), 0),
        total_selling_value: products.reduce((sum, p) => sum + ((p.selling_price || 0) * (p.listing_quantity || 0)), 0),
        listing_count: products.filter(p => p.listing_quantity > 0).length
      })

      const accountStats = {
        MJT: calculateAccountStats(mjtProducts),
        GREEN: calculateAccountStats(greenProducts),
        manual: calculateAccountStats(manualProducts)
      }

      // P0-4: バリエーション統計を計算
      const variationStats = {
        parent_count: inventoryProducts.filter(p => p.is_variation_parent).length,
        member_count: inventoryProducts.filter(p => p.is_variation_member || p.is_variation_child).length,
        standalone_count: inventoryProducts.filter(p => !p.is_variation_parent && !p.is_variation_member && !p.is_variation_child && p.product_type !== 'set').length,
        grouping_candidates: inventoryProducts.filter(p => {
          // グルーピング候補: カテゴリあり、在庫あり、未グループ化
          return p.category && 
                 p.physical_quantity > 0 && 
                 !p.is_variation_parent && 
                 !p.is_variation_member && 
                 !p.is_variation_child &&
                 p.product_type !== 'set'
        }).length
      }

      console.log(`[バリエーション統計] 親: ${variationStats.parent_count}, メンバー: ${variationStats.member_count}, 単独: ${variationStats.standalone_count}, 候補: ${variationStats.grouping_candidates}`)

      // P0-4: 仕入れ代金総額（円）を計算
      // 有在庫商品（physical_quantity > 0）の原価合計
      const EXCHANGE_RATE_USD_JPY = 150 // 仮の為替レート
      const stockProductsWithCost = inventoryProducts.filter(p => 
        p.physical_quantity > 0 && p.cost_price > 0
      )
      // cost_price が USD の場合は円に変換（1000以下はUSDと判定）
      const totalCostJpy = stockProductsWithCost.reduce((sum, p) => {
        const costPrice = p.cost_price || 0
        const costInJpy = costPrice < 1000 ? costPrice * EXCHANGE_RATE_USD_JPY : costPrice
        return sum + (costInJpy * (p.physical_quantity || 0))
      }, 0)

      console.log(`[仕入れ代金] 対象: ${stockProductsWithCost.length}件, 総額: ¥${totalCostJpy.toLocaleString()}`)

      const newStats: InventoryStats = {
        ...basicStats,
        ...optimizationStats,
        account_stats: accountStats,
        variation_stats: variationStats,
        // P0-4: 仕入れ代金総額（円）を追加
        total_cost_jpy: Math.round(totalCostJpy),
        stock_with_cost_count: stockProductsWithCost.length
      } as InventoryStats & { total_cost_jpy: number; stock_with_cost_count: number }
      setStats(newStats)

    } catch (error: any) {
      console.error('データ取得エラー:', error?.message || error?.code || JSON.stringify(error))
      alert(`データ取得失敗: ${error?.message || error?.code || '不明なエラー'}`)
    } finally {
      setLoading(false)
    }
  }

  // フィルター適用
  useEffect(() => {
    let filtered = [...products]

    // P0-12: マーケットプレイスフィルター（filter.marketplaceに統合）
    if (filter.marketplace && filter.marketplace !== 'all') {
      if (filter.marketplace === 'unknown') {
        filtered = filtered.filter(p => !p.marketplace || p.marketplace === 'manual')
      } else {
        filtered = filtered.filter(p => p.marketplace === filter.marketplace)
      }
    }

    // 商品タイプフィルター
    if (filter.product_type && filter.product_type !== 'all') {
      filtered = filtered.filter(p => {
        const sku = p.sku?.toLowerCase() || ''
        
        if (filter.product_type === 'stock') {
          return p.product_type === 'stock' || sku.includes('stock')
        } else if (filter.product_type === 'dropship') {
          return p.product_type === 'dropship'
        } else if (filter.product_type === 'set') {
          return p.product_type === 'set'
        } else if (filter.product_type === 'unclassified') {
          return p.product_type === 'unclassified'
        } else if (filter.product_type === 'unknown') {
          return !p.product_type && !sku.includes('stock')
        }
        return p.product_type === filter.product_type
      })
    }

    // 在庫状態フィルター
    if (filter.stock_status && filter.stock_status !== 'all') {
      if (filter.stock_status === 'in_stock') {
        filtered = filtered.filter(p => p.physical_quantity > 0)
      } else {
        filtered = filtered.filter(p => p.physical_quantity === 0)
      }
    }

    // コンディションフィルター
    if (filter.condition && filter.condition !== 'all') {
      filtered = filtered.filter(p => {
        const normalizedCondition = p.condition_name?.toLowerCase()
        const targetCondition = filter.condition?.toLowerCase()
        return normalizedCondition === targetCondition
      })
    }

    // カテゴリフィルター
    if (filter.category) {
      if (filter.category === 'unknown') {
        filtered = filtered.filter(p => !p.category)
      } else {
        filtered = filtered.filter(p => p.category === filter.category)
      }
    }

    // 検索フィルター
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      filtered = filtered.filter(p =>
        p.product_name.toLowerCase().includes(searchLower) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower))
      )
    }

    // 在庫タイプフィルター
    if (filter.inventory_type && filter.inventory_type !== 'all') {
      filtered = filtered.filter(p => p.inventory_type === filter.inventory_type)
    }

    // 価格フェーズフィルター
    if (filter.price_phase && filter.price_phase !== 'all') {
      filtered = filtered.filter(p => {
        const phase = p.current_price_phase || determinePricePhase(p.date_acquired || null)
        return phase === filter.price_phase
      })
    }

    // 経過日数フィルター
    if (filter.days_held && filter.days_held !== 'all') {
      filtered = filtered.filter(p => {
        if (!p.date_acquired) return false
        const days = daysSinceAcquisition(p.date_acquired)

        if (filter.days_held === '0-90') {
          return days <= 90
        } else if (filter.days_held === '91-180') {
          return days > 90 && days <= 180
        } else if (filter.days_held === '180+') {
          return days > 180
        }
        return true
      })
    }

    // P0-7: サイトフィルター（修正）
    if (filter.site && filter.site !== 'all') {
      filtered = filtered.filter(p => {
        // source_data.site または ebay_data.site を参照
        const site = p.source_data?.site || p.ebay_data?.site
        return site === filter.site
      })
    }

    // P0-7: eBayアカウントフィルター（修正）
    if (filter.ebay_account && filter.ebay_account !== 'all') {
      filtered = filtered.filter(p => {
        // source_data.ebay_account を参照
        const account = p.account?.toLowerCase() || p.source_data?.ebay_account?.toLowerCase()
        
        if (filter.ebay_account === 'manual') {
          return p.marketplace === 'manual' || p.is_manual_entry || !account
        }
        return account === filter.ebay_account?.toLowerCase()
      })
    }

    // P0-4: バリエーション候補フィルター
    if (filter.grouping_candidate) {
      // 同じカテゴリで価格帯が近い商品をフィルタ
      // バリエーションになっていない単独商品のみ
      filtered = filtered.filter(p => {
        // 既にバリエーションメンバーの場合は除外
        if (p.is_variation_member || p.is_variation_child) return false
        // 既にバリエーション親の場合は除外
        if (p.is_variation_parent) return false
        // セット商品は除外
        if (p.product_type === 'set') return false
        // カテゴリがあり、在庫がある商品のみ
        return p.category && p.physical_quantity > 0
      })
    }

    // P0-4: バリエーション状態フィルター
    if (filter.variation_status && filter.variation_status !== 'all') {
      filtered = filtered.filter(p => {
        switch (filter.variation_status) {
          case 'parent':
            return p.is_variation_parent === true
          case 'member':
            return p.is_variation_member === true || p.is_variation_child === true
          case 'standalone':
            return !p.is_variation_parent && !p.is_variation_member && !p.is_variation_child
          default:
            return true
        }
      })
    }

    setFilteredProducts(filtered)
  }, [products, filter])  // P0-12: selectedMarketplaceを削除

  // フィルター変更時にページをリセット
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])  // P0-12: selectedMarketplaceを削除

  // 判定待ち件数取得
  const loadPendingCount = async () => {
    try {
      const { count, error } = await supabase
        .from('stock_classification_queue')
        .select('*', { count: 'exact', head: true })
        .is('is_stock', null)
      
      if (!error && count !== null) {
        setPendingCount(count)
      }
    } catch (error) {
      console.error('判定待ち件数取得エラー:', error)
    }
  }

  // 承認待ち件数取得
  const loadApprovalPendingCount = async () => {
    try {
      const { count, error } = await supabase
        .from('products_master')
        .select('*', { count: 'exact', head: true })
        .eq('approval_status', 'pending')

      if (!error && count !== null) {
        setApprovalPendingCount(count)
      }
    } catch (error) {
      console.error('承認待ち件数取得エラー:', error)
    }
  }

  // 初回ロード
  useEffect(() => {
    loadProducts()
    loadPendingCount()
    loadApprovalPendingCount()
  }, [])

  // 商品選択トグル
  const toggleProductSelection = (productId: string) => {
    const newSelection = new Set(selectedProducts)
    if (newSelection.has(productId)) {
      newSelection.delete(productId)
    } else {
      newSelection.add(productId)
    }
    setSelectedProducts(newSelection)
  }

  // P0-8: 選択解除
  const clearSelection = () => {
    setSelectedProducts(new Set())
  }

  // 商品編集
  const handleEdit = (product: InventoryProduct) => {
    setEditingProduct(product)
    setShowRegistrationModal(true)
  }

  // 商品削除
  const handleDelete = async (product: InventoryProduct) => {
    if (!confirm(`「${product.product_name}」を削除しますか？`)) return

    try {
      const { error } = await supabase
        .from('inventory_master')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      alert('商品を削除しました')
      loadProducts()
    } catch (error: any) {
      console.error('削除エラー:', error)
      alert(`削除失敗: ${error.message}`)
    }
  }

  // モーダル成功時
  const handleModalSuccess = () => {
    setShowRegistrationModal(false)
    setShowSetModal(false)
    setShowBulkUpload(false)
    setEditingProduct(null)
    loadProducts()
    loadPendingCount()
  }

  // eBay直接同期実行
  const handleEbaySync = async (account: 'mjt' | 'green' | 'all') => {
    const accountLabel = account === 'all' ? 'MJT+GREEN全' : account.toUpperCase()
    if (!confirm(`eBay ${accountLabel}アカウントのデータを同期しますか？\n※自動的にinventory_masterに登録されます`)) return

    if (account === 'mjt' || account === 'all') setEbaySyncingMjt(true)
    if (account === 'green' || account === 'all') setEbaySyncingGreen(true)
    
    try {
      // 🔧 Trading APIを使用（REST APIより多くのデータを取得可能）
      const response = await fetch('/api/sync/ebay-trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ eBay同期完了\n新規登録: ${data.total_synced || 0}件\nスキップ: ${data.total_skipped || 0}件\nエラー: ${data.total_errors || 0}件`)
        loadProducts()
      } else {
        alert(`❌ 同期エラー: ${data.error}`)
      }
    } catch (error: any) {
      console.error('eBay同期エラー:', error)
      alert(`同期エラー: ${error.message}`)
    } finally {
      setEbaySyncingMjt(false)
      setEbaySyncingGreen(false)
    }
  }

  // eBay差分同期実行
  const handleEbayIncrementalSync = async (account: 'mjt' | 'green' | 'all') => {
    const accountLabel = account === 'all' ? 'MJT+GREEN全' : account.toUpperCase()
    if (!confirm(`eBay ${accountLabel}アカウントの差分同期を実行しますか？\n※最終同期以降の変更のみ取得します`)) return

    setIncrementalSyncing(true)
    
    try {
      const response = await fetch('/api/sync/ebay-incremental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account,
          detectEnded: true
        })
      })

      const data = await response.json()

      if (data.success) {
        const results = data.results
        let message = '✅ 差分同期完了\n\n'
        for (const [acc, result] of Object.entries(results)) {
          if ((result as any).success) {
            const r = result as any
            message += `【${acc.toUpperCase()}】\n`
            message += `  同期タイプ: ${r.sync_type === 'full' ? '全件' : '差分'}\n`
            message += `  取得: ${r.total_fetched}件\n`
            message += `  追加: ${r.items_added}件\n`
            message += `  更新: ${r.items_updated}件\n`
            message += `  終了検出: ${r.items_ended}件\n\n`
          } else {
            message += `【${acc.toUpperCase()}】エラー: ${(result as any).error}\n\n`
          }
        }
        message += `実行時間: ${data.total_execution_time_seconds}秒`
        alert(message)
        loadProducts()
      } else {
        alert(`❌ 同期エラー: ${data.error}`)
      }
    } catch (error: any) {
      console.error('差分同期エラー:', error)
      alert(`同期エラー: ${error.message}`)
    } finally {
      setIncrementalSyncing(false)
    }
  }

  // バリエーション作成ハンドラー
  const handleCreateVariation = async (parentName: string, selectedProductsList: InventoryProduct[]) => {
    try {
      const response = await fetch('/api/products/create-variation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedItemIds: selectedProductsList.map(p => p.id),
          parentSkuName: parentName,
          attributes: {},
          composition: selectedProductsList.map(p => ({
            id: p.id,
            name: p.product_name,
            sku: p.sku,
            quantity: 1
          }))
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ バリエーション作成成功\n親SKU: ${data.parentSku}\n基準価格: $${data.minPrice}`)
        setShowGroupingSidebar(false)
        setSelectedProducts(new Set())
        loadProducts()
      } else {
        throw new Error(data.error || 'バリエーション作成に失敗しました')
      }
    } catch (error: any) {
      console.error('バリエーション作成エラー:', error)
      throw error
    }
  }

  // メルカリ同期実行
  const handleMercariSync = async () => {
    if (!confirm('メルカリの商品データを棚卸しシステムに同期しますか？')) return

    setMercariSyncing(true)
    try {
      const response = await fetch('/api/sync/mercari-to-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: false })
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ メルカリ同期完了\n新規: ${data.total_synced}件\nスキップ: ${data.total_skipped}件`)
        loadProducts()
      } else {
        alert(`❌ 同期エラー: ${data.error}`)
      }
    } catch (error: any) {
      console.error('メルカリ同期エラー:', error)
      alert(`同期エラー: ${error.message}`)
    } finally {
      setMercariSyncing(false)
    }
  }

  // ページネーション計算
  const displayTotalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 mb-4 mx-auto animate-spin" />
          <p className="text-lg text-slate-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ページヘッダー */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">棚卸し管理</h1>
                <p className="text-indigo-200 text-sm">在庫データの統合管理</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        {/* タブナビゲーション */}
        <TabNav
          tabs={[
            {
              id: 'inventory',
              label: '在庫管理',
              icon: 'fas fa-boxes'
            },
            {
              id: 'master',
              label: '在庫マスター',
              icon: 'fas fa-database'
            },
            {
              id: 'approval',
              label: '承認待ちアイテム',
              icon: 'fas fa-clipboard-check',
              badge: approvalPendingCount
            }
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'inventory' | 'approval' | 'master')}
        />

      {/* タブコンテンツ */}
      {activeTab === 'inventory' ? (
        <>
          {/* 統計ヘッダー */}
          <StatsHeader stats={stats} selectedCount={selectedProducts.size} />

          {/* アラートセクション */}
          <InventoryAlerts
            products={products}
            onProductClick={(product) => handleEdit(product)}
          />

          {/* P0-12: MarketplaceSelectorを削除し、FilterPanelの販売モールフィルターに統合済み */}

          {/* フィルターパネル */}
          <FilterPanel
            filter={filter}
            onFilterChange={setFilter}
            categories={categories}
          />

          {/* アクションボタン */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex gap-3 flex-wrap">
            {/* 有在庫判定バッジ */}
            {pendingCount > 0 && (
              <Link href="/zaiko/tanaoroshi/classification">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 relative">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  有在庫判定
                  <Badge className="ml-2 bg-white text-orange-600 hover:bg-white">
                    {pendingCount}
                  </Badge>
                </Button>
              </Link>
            )}

            <Button
              onClick={() => {
                setEditingProduct(null)
                setShowRegistrationModal(true)
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規商品登録
            </Button>

            <Button
              onClick={() => setShowBulkUpload(true)}
              variant="outline"
              className="border-slate-200 hover:border-slate-300"
            >
              <Images className="h-4 w-4 mr-2" />
              画像一括登録
            </Button>

            <Button
              onClick={() => setShowSetModal(true)}
              disabled={selectedProducts.size < 2}
              variant="outline"
              className="border-slate-200 hover:border-slate-300"
            >
              <Layers className="h-4 w-4 mr-2" />
              セット商品作成 ({selectedProducts.size})
            </Button>

            {/* DDPグループ化ボタン */}
            <Button
              onClick={() => setShowGroupingSidebar(true)}
              disabled={selectedProducts.size < 2}
              variant="outline"
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              <Zap className="h-4 w-4 mr-2" />
              バリエーション作成 ({selectedProducts.size})
            </Button>

            {/* P0-8: 選択解除ボタン */}
            {selectedProducts.size > 0 && (
              <Button
                onClick={clearSelection}
                variant="outline"
                className="border-slate-400 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4 mr-2" />
                選択解除 ({selectedProducts.size})
              </Button>
            )}

            {/* eBay同期ボタン */}
            <div className="flex flex-col gap-2">
              {/* 差分同期（高速） */}
              <div className="flex gap-2">
                <span className="text-xs text-slate-500 self-center min-w-[60px]">差分同期:</span>
                <Button
                  onClick={() => handleEbayIncrementalSync('all')}
                  disabled={ebaySyncing}
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  title="最終同期以降の変更のみ取得（高速）"
                >
                  {incrementalSyncing ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" />同期中...</>
                  ) : (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      差分同期
                    </>
                  )}
                </Button>
              </div>

              {/* 全件同期 */}
              <div className="flex gap-2">
                <span className="text-xs text-slate-500 self-center min-w-[60px]">全件同期:</span>
                <Button
                  onClick={() => handleEbaySync('mjt')}
                  disabled={ebaySyncing}
                  size="sm"
                  variant="outline"
                  className="border-blue-400 text-blue-700 hover:bg-blue-50"
                  title="MJTアカウントのeBayデータを全件同期"
                >
                  {ebaySyncingMjt ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" />同期中</>
                  ) : (
                    <>
                      <CloudDownload className="h-3 w-3 mr-1" />
                      MJT
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleEbaySync('green')}
                  disabled={ebaySyncing}
                  size="sm"
                  variant="outline"
                  className="border-green-400 text-green-700 hover:bg-green-50"
                  title="GREENアカウントのeBayデータを全件同期"
                >
                  {ebaySyncingGreen ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" />同期中</>
                  ) : (
                    <>
                      <CloudDownload className="h-3 w-3 mr-1" />
                      GREEN
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleEbaySync('all')}
                  disabled={ebaySyncing}
                  size="sm"
                  variant="outline"
                  className="border-purple-400 text-purple-700 hover:bg-purple-50"
                  title="全アカウントを一括同期"
                >
                  {ebaySyncing && !ebaySyncingMjt && !ebaySyncingGreen && !incrementalSyncing ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" />同期中</>
                  ) : (
                    <>
                      <CloudDownload className="h-3 w-3 mr-1" />
                      全件
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* データ削除ボタン */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-xs text-slate-500 font-medium">データ削除:</span>
              <Button
                onClick={async () => {
                  const choice = prompt(
                    '⚠️ データ削除\n\n削除対象を選択してください:\n\n' +
                    '1 = MJTデータのみ削除\n' +
                    '2 = GREENデータのみ削除\n' +
                    '3 = eBay全データ削除（MJT+GREEN）\n' +
                    '4 = 全データ削除（手動登録含む）\n\n' +
                    '番号を入力:'
                  )
                  if (!choice) return

                  let target = ''
                  let confirmMsg = ''

                  switch (choice) {
                    case '1':
                      target = 'mjt'
                      confirmMsg = 'MJTのeBayデータ'
                      break
                    case '2':
                      target = 'green'
                      confirmMsg = 'GREENのeBayデータ'
                      break
                    case '3':
                      target = 'ebay'
                      confirmMsg = 'eBay全データ（MJT+GREEN）'
                      break
                    case '4':
                      target = 'all'
                      confirmMsg = '全データ（手動登録含む）'
                      break
                    default:
                      alert('無効な選択です')
                      return
                  }

                  if (!confirm(`🚨 本当に「${confirmMsg}」を削除しますか？\n\nこの操作は取り消せません！`)) return

                  try {
                    const response = await fetch('/api/inventory/bulk-delete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ target })
                    })
                    const data = await response.json()
                    if (data.success) {
                      alert(`✅ ${data.deleted}件のデータを削除しました`)
                      loadProducts()
                    } else {
                      alert(`❌ エラー: ${data.error}`)
                    }
                  } catch (error: any) {
                    alert(`❌ 削除エラー: ${error.message}`)
                  }
                }}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />削除
              </Button>
            </div>

            {/* eBay CSV出力ボタン */}
            <Button
              onClick={() => setShowEbayCSVModal(true)}
              disabled={selectedProducts.size === 0}
              variant="outline"
              className="border-blue-400 text-blue-700 hover:bg-blue-50"
              title="選択した商品をeBay File Exchange CSVで出力"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              eBay CSV出力 ({selectedProducts.size})
            </Button>

            {/* メルカリ同期ボタン */}
            <Button
              onClick={() => setShowMercariSyncModal(true)}
              variant="outline"
              className="border-red-400 text-red-700 hover:bg-red-50"
              title="メルカリの出品データを同期"
            >
              <Store className="h-4 w-4 mr-2" />
              メルカリ同期
            </Button>

            <div className="flex-1"></div>

            <Button
              onClick={() => loadProducts()}
              variant="outline"
              className="border-slate-200 hover:border-slate-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              更新
            </Button>
          </div>

          {/* 商品一覧 */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <BoxIcon className="h-16 w-16 text-slate-300 mb-4 mx-auto" />
              <p className="text-xl text-slate-600 mb-2">商品がありません</p>
              <p className="text-slate-400 mb-6">
                新規商品を登録するか、他のモールからデータを同期してください
              </p>
              <Button
                onClick={() => setShowRegistrationModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                最初の商品を登録
              </Button>
            </div>
          ) : (
            <>
              {/* ページネーション情報 + 表示切替（上部） */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4 flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-slate-600">
                  全 <span className="font-bold text-slate-900">{filteredProducts.length.toLocaleString()}</span> 件中、
                  <span className="font-bold text-indigo-600">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length).toLocaleString()}
                  </span> ～
                  <span className="font-bold text-indigo-600">
                    {Math.min(currentPage * itemsPerPage, filteredProducts.length).toLocaleString()}
                  </span> 件を表示
                  {totalItems > filteredProducts.length && (
                    <span className="ml-2 text-slate-400">
                      (DB総数: {totalItems.toLocaleString()}件)
                    </span>
                  )}
                </div>

                {/* TASK 4: 表示切替 */}
                <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />前へ
                  </Button>
                  <span className="px-3 py-1 bg-slate-100 rounded text-sm font-medium">
                    {currentPage} / {displayTotalPages || 1}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(p => Math.min(displayTotalPages, p + 1))}
                    disabled={currentPage >= displayTotalPages}
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                  >
                    次へ<ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
              
              {/* TASK 4: カード表示 or テーブル表示 */}
              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                  {paginatedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={() => handleEdit(product)}
                      onDelete={() => handleDelete(product)}
                      isSelected={selectedProducts.has(product.id)}
                      onSelect={() => toggleProductSelection(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <ProductTable
                  products={paginatedProducts}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  selectedProducts={selectedProducts}
                  onToggleSelect={toggleProductSelection}
                />
              )}
              
              {/* ページネーション（下部） */}
              {displayTotalPages > 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mt-4 flex items-center justify-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* ページ番号 */}
                  {Array.from({ length: Math.min(7, displayTotalPages) }, (_, i) => {
                    let pageNum: number
                    if (displayTotalPages <= 7) {
                      pageNum = i + 1
                    } else if (currentPage <= 4) {
                      pageNum = i + 1
                    } else if (currentPage >= displayTotalPages - 3) {
                      pageNum = displayTotalPages - 6 + i
                    } else {
                      pageNum = currentPage - 3 + i
                    }

                    if (pageNum < 1 || pageNum > displayTotalPages) return null

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        size="sm"
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={currentPage === pageNum ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "border-slate-200"}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  <Button
                    onClick={() => setCurrentPage(p => Math.min(displayTotalPages, p + 1))}
                    disabled={currentPage >= displayTotalPages}
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(displayTotalPages)}
                    disabled={currentPage >= displayTotalPages}
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>

                  {/* 総件数表示 */}
                  <div className="ml-4 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    ページ <span className="font-semibold text-indigo-600">{currentPage}</span> / {displayTotalPages}
                    <span className="mx-2">·</span>
                    全 <span className="font-semibold text-indigo-600">{filteredProducts.length.toLocaleString()}</span> 件
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : activeTab === 'master' ? (
        <InventoryMasterTab onRefresh={loadProducts} />
      ) : (
        <ApprovalTab />
      )}

      {/* モーダル */}
      {showRegistrationModal && (
        <ProductRegistrationModal
          product={editingProduct}
          onClose={() => {
            setShowRegistrationModal(false)
            setEditingProduct(null)
          }}
          onSuccess={handleModalSuccess}
        />
      )}

      {showSetModal && (
        <SetProductModal
          selectedProducts={products.filter(p => selectedProducts.has(p.id))}
          onClose={() => setShowSetModal(false)}
          onSuccess={(setProductId) => {
            handleModalSuccess()
            setSelectedProducts(new Set())
          }}
        />
      )}

      {showBulkUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Images className="h-5 w-5" />
                画像一括登録
              </h2>
              <button
                onClick={() => setShowBulkUpload(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <BulkImageUpload />
            </div>
          </div>
        </div>
      )}

      {/* DDPグループ化サイドバー */}
      {showGroupingSidebar && (
        <GroupingBoxSidebar
          selectedProducts={products.filter(p => selectedProducts.has(p.id))}
          onClose={() => setShowGroupingSidebar(false)}
          onCreateVariation={handleCreateVariation}
        />
      )}

      {/* メルカリ同期モーダル */}
      <MercariSyncModal
        isOpen={showMercariSyncModal}
        onClose={() => setShowMercariSyncModal(false)}
        onSyncComplete={() => loadProducts()}
      />

      {/* eBay CSV出力モーダル */}
      {showEbayCSVModal && (
        <EbayCSVExportModal
          selectedProducts={products.filter(p => selectedProducts.has(p.id))}
          onClose={() => setShowEbayCSVModal(false)}
        />
      )}
      </div>
    </div>
  )
}
