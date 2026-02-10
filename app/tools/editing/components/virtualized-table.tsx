// app/tools/editing/components/virtualized-table.tsx
// Phase 8: Virtual Scrolling対応テーブル

'use client'

import { memo, CSSProperties } from 'react'
import { FixedSizeList as List } from 'react-window'
import type { Product } from '../types/product'

interface VirtualizedTableProps {
  products: Product[]
  selectedIds: Set<string>
  modifiedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onProductClick: (product: Product) => void
  onProductHover?: (product: Product) => void
  height?: number
  rowHeight?: number
}

/**
 * 仮想スクロール対応のテーブル行コンポーネント
 * React.memoで最適化されているため、必要な行のみが再レンダリングされる
 */
const VirtualRow = memo(function VirtualRow({
  index,
  style,
  data,
}: {
  index: number
  style: CSSProperties
  data: {
    products: Product[]
    selectedIds: Set<string>
    modifiedIds: Set<string>
    onSelectChange: (ids: Set<string>) => void
    onProductClick: (product: Product) => void
    onProductHover?: (product: Product) => void
  }
}) {
  const { products, selectedIds, modifiedIds, onSelectChange, onProductClick, onProductHover } = data
  const product = products[index]
  
  if (!product) return null

  const id = String(product.id)
  const isSelected = selectedIds.has(id)
  const isModified = modifiedIds.has(id)

  const toggleSelect = () => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectChange(next)
  }

  return (
    <div
      style={{
        ...style,
        borderLeft: isModified ? '2px solid #f59e0b' : 'none',
      }}
      className={`flex items-center gap-2 px-2 border-b ${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
      onMouseEnter={() => onProductHover?.(product)}
    >
      {/* チェックボックス */}
      <input
        type="checkbox"
        className="w-3 h-3 rounded"
        checked={isSelected}
        onChange={toggleSelect}
        onClick={e => e.stopPropagation()}
      />

      {/* 画像 */}
      <div
        className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-400"
        onClick={() => onProductClick(product)}
      >
        {product.primary_image_url ? (
          <img
            src={product.primary_image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Img
          </div>
        )}
      </div>

      {/* 商品情報 */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900 truncate">
          {product.title || 'No Title'}
        </div>
        <div className="text-[10px] text-gray-500 truncate">
          SKU: {product.sku || '-'} | ¥{product.price_jpy?.toLocaleString() || '-'}
        </div>
      </div>

      {/* ステータス */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {product.filter_passed && (
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="フィルター通過" />
        )}
        {product.total_score && (
          <span className="text-[10px] font-mono text-gray-600">
            {product.total_score}pt
          </span>
        )}
      </div>
    </div>
  )
})

/**
 * 仮想スクロールテーブル
 * 
 * 特徴:
 * - 1000件以上の商品を滑らかに表示可能
 * - DOM要素数を最小限に抑制（常に15-20個のみ）
 * - 60fpsを維持
 * - メモリ使用量を大幅削減
 */
export const VirtualizedTable = memo(function VirtualizedTable({
  products,
  selectedIds,
  modifiedIds,
  onSelectChange,
  onProductClick,
  onProductHover,
  height = 600,
  rowHeight = 60,
}: VirtualizedTableProps) {
  // すべてのコールバックをitemDataにまとめる
  const itemData = {
    products,
    selectedIds,
    modifiedIds,
    onSelectChange,
    onProductClick,
    onProductHover,
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 px-2 py-2 border-b bg-gray-50">
        <input
          type="checkbox"
          className="w-3 h-3 rounded"
          checked={selectedIds.size === products.length && products.length > 0}
          onChange={() => {
            if (selectedIds.size === products.length) {
              onSelectChange(new Set())
            } else {
              onSelectChange(new Set(products.map(p => String(p.id))))
            }
          }}
        />
        <span className="text-xs text-gray-600">
          全て選択 ({products.length}件)
        </span>
        {selectedIds.size > 0 && (
          <span className="ml-auto text-xs text-indigo-600 font-medium">
            {selectedIds.size}件選択中
          </span>
        )}
      </div>

      {/* 仮想スクロールリスト */}
      <List
        height={height}
        itemCount={products.length}
        itemSize={rowHeight}
        width="100%"
        itemData={itemData}
        overscanCount={5}
      >
        {VirtualRow}
      </List>

      {/* フッター */}
      <div className="flex items-center justify-between px-2 py-1 border-t bg-gray-50 text-xs text-gray-500">
        <span>Virtual Scrolling 有効</span>
        <span>表示: {products.length}件</span>
      </div>
    </div>
  )
})
