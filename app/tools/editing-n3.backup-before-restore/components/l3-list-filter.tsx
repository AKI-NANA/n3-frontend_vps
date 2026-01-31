// app/tools/editing/components/l3-list-filter.tsx
'use client'

import { ReactNode } from 'react'

export type ListFilter = 'all' | 'data_editing' | 'approval_pending' | 'active_listings' | 'in_stock_master' | 'back_order_only' | 'delisted_only'

interface FilterOption {
  id: ListFilter
  label: string
}

interface L3ListFilterProps {
  activeFilter: ListFilter
  onFilterChange: (filter: ListFilter) => void
  counts?: {
    all: number
    data_editing: number
    approval_pending: number
    active_listings: number
    in_stock_master: number
    back_order_only: number
    delisted_only: number
  }
  /** 左側に表示するアクション要素 */
  leftActions?: ReactNode
  /** 右側に表示するアクション要素 */
  rightActions?: ReactNode
}

const filters: FilterOption[] = [
  { id: 'all', label: '全商品' },
  { id: 'data_editing', label: 'データ編集' },
  { id: 'approval_pending', label: '承認待ち' },
  { id: 'active_listings', label: '出品中' },
  { id: 'in_stock_master', label: '有在庫マスター' },
  { id: 'back_order_only', label: '無在庫（受注発注）' },
  { id: 'delisted_only', label: '出品停止中' }
]

export function L3ListFilter({ activeFilter, onFilterChange, counts, leftActions, rightActions }: L3ListFilterProps) {
  return (
    <div className="n3-l3-filter-bar">
      {/* 左側: アクション + フィルタータブ */}
      <div className="flex items-center gap-3">
        {leftActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {leftActions}
          </div>
        )}
        <div className="n3-filter-tabs">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id
            const count = counts?.[filter.id]

            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`n3-filter-tab ${isActive ? 'active' : ''}`}
              >
                <span>{filter.label}</span>
                {count !== undefined && (
                  <span className="n3-filter-tab-count">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 右側: アクションボタン */}
      {rightActions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {rightActions}
        </div>
      )}
    </div>
  )
}
