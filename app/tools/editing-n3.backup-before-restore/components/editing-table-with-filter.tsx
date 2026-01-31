// app/tools/editing/components/editing-table-with-filter.tsx
'use client'

import { useState, useMemo, useEffect, useCallback, memo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { EditingTable } from './editing-table'
import { EditingTableV2 } from './editing-table-v2'
import { L3ListFilter, ListFilter } from './l3-list-filter'
import { Pagination } from './pagination'
import { List, LayoutGrid, Download, Save, Trash2, ChevronDown, Zap }  from 'lucide-react'
import { productApi } from '../services/product-api'

import type { Product } from '../types/product'

interface EditingTableWithFilterProps {
  products: Product[]
  selectedIds: Set<string>
  modifiedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onCellChange: (id: string, updates: Partial<Product>) => void
  onProductClick: (product: Product) => void
  onProductHover?: (product: Product) => void
  wrapText?: boolean
  viewMode?: 'list' | 'card'
  showTooltips?: boolean
  language?: 'ja' | 'en'
  total?: number
  pageSize?: number
  currentPage?: number
  onPageSizeChange?: (size: number) => void
  onPageChange?: (page: number) => void
  onListFilterChange?: (filter: ListFilter) => void
  useVirtualScroll?: boolean
  onViewModeChange?: (mode: 'list' | 'card') => void
  onSave?: () => void
  onExport?: () => void
  onDelete?: () => void
}

// カードビューコンポーネント（メモ化）
const ProductCardGrid = memo(function ProductCardGrid({ 
  products, 
  selectedIds, 
  onSelectChange, 
  onProductClick 
}: {
  products: Product[]
  selectedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onProductClick: (product: Product) => void
}) {
  const toggleSelection = useCallback((id: string) => {
    const newIds = new Set(selectedIds)
    if (newIds.has(id)) {
      newIds.delete(id)
    } else {
      newIds.add(id)
    }
    onSelectChange(newIds)
  }, [selectedIds, onSelectChange])

  const getImageUrl = (product: Product): string | null => {
    if (product.primary_image_url) return product.primary_image_url
    if (Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
      return product.gallery_images[0]
    }
    if (product.images) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        const first = product.images[0]
        return typeof first === 'string' ? first : (first?.url || first?.original || null)
      }
    }
    if (product.scraped_data?.images?.length > 0) {
      const img = product.scraped_data.images[0]
      return typeof img === 'string' ? img : (img?.url || img?.original || null)
    }
    return null
  }

  return (
    <div 
      className="grid gap-2 p-2" 
      style={{ 
        gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
        maxHeight: 'calc(100vh - 300px)',
        overflowY: 'auto'
      }}
    >
      {products.map((product) => {
        const isSelected = selectedIds.has(product.id)
        const imageUrl = getImageUrl(product)
        const title = product.ebay_title || product.title || 'No Title'
        const priceJpy = product.price_jpy || product.cost_price || 0
        const profitRate = (product as any).profit_rate || product.listing_data?.profit_margin || 0
        const sku = product.sku || '-'
        
        return (
          <div
            key={product.id}
            className={`n3-card cursor-pointer p-0 overflow-hidden ${isSelected ? 'ring-2 ring-accent' : ''}`}
            onClick={() => onProductClick(product)}
          >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                  No Image
                </div>
              )}
              <div
                className="absolute top-1 left-1"
                onClick={(e) => { e.stopPropagation(); toggleSelection(product.id) }}
              >
                <input type="checkbox" checked={isSelected} onChange={() => {}} className="n3-checkbox" />
              </div>
            </div>
            <div className="p-1.5">
              <h3 className="text-[10px] font-medium line-clamp-2 mb-0.5">{title}</h3>
              <div className="flex items-center justify-between text-[9px] mb-0.5">
                <span className="truncate">{sku}</span>
                <span className={`n3-badge text-[8px] px-1 py-0 ${profitRate >= 15 ? 'n3-badge-success' : 'n3-badge-warning'}`}>
                  {typeof profitRate === 'number' ? profitRate.toFixed(0) : '0'}%
                </span>
              </div>
              <div className="text-[10px] font-mono">¥{priceJpy.toLocaleString()}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
})

export function EditingTableWithFilter(props: EditingTableWithFilterProps) {
  const [listFilter, setListFilter] = useState<ListFilter>('all')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [useV2Table, setUseV2Table] = useState(true) // V2テーブル使用フラグ
  const viewMode = props.viewMode || 'list'
  
  // React Query Client for Prefetch
  const queryClient = useQueryClient()

  // 🚀 高速化: 次ページを先読み
  useEffect(() => {
    if (props.currentPage && props.total && props.pageSize) {
      const hasNextPage = props.currentPage * props.pageSize < props.total
      if (hasNextPage) {
        const nextPage = props.currentPage + 1
        const timer = setTimeout(() => {
          queryClient.prefetchQuery({
            queryKey: ['products', nextPage, props.pageSize],
            queryFn: () => productApi.fetchProducts({ page: nextPage, pageSize: props.pageSize }),
            staleTime: 30 * 1000,
          })
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [props.currentPage, props.total, props.pageSize, queryClient])

  const handleFilterChange = useCallback((filter: ListFilter) => {
    setListFilter(filter)
    props.onListFilterChange?.(filter)
  }, [props.onListFilterChange])

  const filteredProducts = useMemo(() => {
    let filtered = [...props.products]
    if (listFilter === 'data_editing') {
      filtered = filtered.filter(p => !(p as any).listing_status || (p as any).listing_status === 'draft')
    } else if (listFilter === 'approval_pending') {
      filtered = filtered.filter(p => (p as any).filter_passed === true && (p as any).listing_status === 'pending_approval')
    } else if (listFilter === 'active_listings') {
      filtered = filtered.filter(p => (p as any).listing_status === 'active')
    } else if (listFilter === 'in_stock_master') {
      filtered = filtered.filter(p => (p as any).inventory_source === 'tanaoroshi' || (p as any).is_in_warehouse === true)
    } else if (listFilter === 'back_order_only') {
      filtered = filtered.filter(p => (p as any).listing_status === 'active' && (p as any).is_in_warehouse === false)
    } else if (listFilter === 'delisted_only') {
      filtered = filtered.filter(p => (p as any).listing_status === 'delisted')
    }
    return filtered.sort((a, b) => (a.sku || '').localeCompare(b.sku || ''))
  }, [props.products, listFilter])

  const counts = useMemo(() => ({
    all: props.total || props.products.length,
    data_editing: props.products.filter(p => !(p as any).listing_status || (p as any).listing_status === 'draft').length,
    approval_pending: props.products.filter(p => (p as any).filter_passed === true && (p as any).listing_status === 'pending_approval').length,
    active_listings: props.products.filter(p => (p as any).listing_status === 'active').length,
    in_stock_master: props.products.filter(p => (p as any).inventory_source === 'tanaoroshi' || (p as any).is_in_warehouse === true).length,
    back_order_only: props.products.filter(p => (p as any).listing_status === 'active' && (p as any).is_in_warehouse === false).length,
    delisted_only: props.products.filter(p => (p as any).listing_status === 'delisted').length
  }), [props.products, props.total])

  // Fast モード切り替えハンドラー
  const handleToggleFastMode = useCallback(() => {
    setUseV2Table(!useV2Table)
  }, [useV2Table])

  // 右側アクション
  const rightActions = useMemo(() => (
    <>
      {/* ビュー切替 */}
      <div className="n3-view-switch">
        <button
          className={`n3-view-switch-item ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => props.onViewModeChange?.('list')}
          title="リスト表示"
        >
          <List size={14} />
        </button>
        <button
          className={`n3-view-switch-item ${viewMode === 'card' ? 'active' : ''}`}
          onClick={() => props.onViewModeChange?.('card')}
          title="カード表示"
        >
          <LayoutGrid size={14} />
        </button>
      </div>

      {/* Export */}
      {props.onExport && (
        <div className="relative">
          <button onClick={() => setShowExportMenu(prev => !prev)} className="n3-btn n3-btn-secondary n3-btn-xs">
            <Download size={11} /> Export <ChevronDown size={9} />
          </button>
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 py-1 rounded-lg shadow-lg z-50 min-w-[100px]" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
              <button onClick={() => { props.onExport?.(); setShowExportMenu(false) }} className="w-full px-3 py-1.5 text-left text-xs hover:bg-[var(--highlight)]">CSV All</button>
            </div>
          )}
        </div>
      )}

      {/* Save */}
      {props.onSave && (
        <button onClick={props.onSave} disabled={props.modifiedIds.size === 0} className="n3-btn n3-btn-primary n3-btn-xs">
          <Save size={11} /> Save {props.modifiedIds.size > 0 && `(${props.modifiedIds.size})`}
        </button>
      )}

      {/* 削除 */}
      {props.onDelete && (
        <button onClick={props.onDelete} disabled={props.selectedIds.size === 0} className="n3-btn n3-btn-xs" style={{ color: 'var(--error)' }}>
          <Trash2 size={11} />
        </button>
      )}
    </>
  ), [viewMode, props.onViewModeChange, props.onExport, props.onSave, props.onDelete, props.modifiedIds.size, props.selectedIds.size, showExportMenu])

  return (
    <div className="h-full flex flex-col gap-2">
      {/* L3フィルター */}
      <div className="flex-shrink-0">
        <L3ListFilter 
          activeFilter={listFilter} 
          onFilterChange={handleFilterChange} 
          counts={counts} 
          rightActions={rightActions} 
        />
      </div>

      {/* テーブル/カードビュー */}
      <div className="flex-1 min-h-0">
        {viewMode === 'card' ? (
          <div className="n3-table-container h-full">
            <ProductCardGrid products={filteredProducts} selectedIds={props.selectedIds} onSelectChange={props.onSelectChange} onProductClick={props.onProductClick} />
          </div>
        ) : useV2Table ? (
          // V2テーブル（Virtual Scroll + セレクター + 遅延読み込み）
          <EditingTableV2
            products={filteredProducts}
            selectedIds={props.selectedIds}
            modifiedIds={props.modifiedIds}
            onSelectChange={props.onSelectChange}
            onCellChange={props.onCellChange}
            onProductClick={props.onProductClick}
            onProductHover={props.onProductHover}
            wrapText={props.wrapText}
            showTooltips={props.showTooltips}
            total={props.total}
            pageSize={props.pageSize}
            currentPage={props.currentPage}
            onPageSizeChange={props.onPageSizeChange}
            onPageChange={props.onPageChange}
            useVirtualScroll={true}
          />
        ) : (
          // 従来版テーブル
          <EditingTable {...props} products={filteredProducts} />
        )}
      </div>

      {/* ページネーション（V2使用時は内蔵） */}
      {!useV2Table && props.total !== undefined && props.pageSize !== undefined && props.currentPage !== undefined && props.onPageChange && props.onPageSizeChange && (
        <div className="flex-shrink-0">
          <Pagination
            total={props.total}
            pageSize={props.pageSize}
            currentPage={props.currentPage}
            onPageSizeChange={props.onPageSizeChange}
            onPageChange={props.onPageChange}
          />
        </div>
      )}
    </div>
  )
}
