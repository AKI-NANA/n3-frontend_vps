// app/tools/editing/components/ActiveListingsTab/index.tsx
'use client'

import { useActiveListings } from '../../hooks/use-active-listings'
import { ActiveListingsActionBar } from '../active-listings-action-bar'
import { EditingTableWithFilter } from '../editing-table-with-filter'
import type { Product } from '../../types/product'

interface ActiveListingsTabProps {
  products: Product[]
  selectedIds: Set<string>
  modifiedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onCellChange: (id: string, updates: Partial<Product>) => void
  onProductClick: (product: Product) => void
  onShowToast: (message: string, type?: 'success' | 'error') => void
  onLoadProducts: () => Promise<void>
  wrapText?: boolean
  onListFilterChange?: (filter: string) => void  // ✅ 追加
}

export function ActiveListingsTab({
  products,
  selectedIds,
  modifiedIds,
  onSelectChange,
  onCellChange,
  onProductClick,
  onShowToast,
  onLoadProducts,
  wrapText,
  onListFilterChange  // ✅ 追加
}: ActiveListingsTabProps) {
  // カスタムフックからロジックを取得
  const {
    filteredListings,
    stats,
    variationStats,
    accountFilter,
    isSyncing,
    setAccountFilter,
    handleSync,
    handleMercariSync,
    handleDelete,
    handleRefresh
  } = useActiveListings({
    products,
    onShowToast,
    onLoadProducts
  })

  return (
    <div className="flex flex-col gap-2">
      {/* アクションバー */}
      <ActiveListingsActionBar
        stats={stats}
        variationStats={variationStats}
        accountFilter={accountFilter}
        isSyncing={isSyncing}
        onAccountFilterChange={setAccountFilter}
        onSync={handleSync}
        onMercariSync={handleMercariSync}
        onDelete={() => handleDelete(Array.from(selectedIds))}
        onRefresh={handleRefresh}
      />

      {/* データテーブル（L3フィルター付き） ✅ 変更 */}
      <EditingTableWithFilter
        products={filteredListings}
        selectedIds={selectedIds}
        modifiedIds={modifiedIds}
        onSelectChange={onSelectChange}
        onCellChange={onCellChange}
        onProductClick={onProductClick}
        wrapText={wrapText}
        onListFilterChange={onListFilterChange}
      />
    </div>
  )
}
