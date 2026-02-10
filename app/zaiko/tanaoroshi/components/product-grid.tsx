'use client'

import { InventoryProduct } from '@/types/inventory'
import { ProductCard } from './product-card'
import { PackageOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductGridProps {
  products: InventoryProduct[]
  loading: boolean
  selectedIds?: Set<string>
  onSelect?: (id: string) => void
  onEdit?: (product: InventoryProduct) => void
  onDelete?: (product: InventoryProduct) => void
  onNewProduct?: () => void
}

export function ProductGrid({
  products,
  loading,
  selectedIds = new Set(),
  onSelect,
  onEdit,
  onDelete,
  onNewProduct
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">読み込み中...</span>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-12 text-center">
        <PackageOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <p className="text-xl text-muted-foreground mb-2">商品がありません</p>
        <p className="text-sm text-muted-foreground/70 mb-6">
          新規商品を登録するか、他のモールからデータを同期してください
        </p>
        {onNewProduct && (
          <Button onClick={onNewProduct} className="bg-blue-600 hover:bg-blue-700">
            最初の商品を登録
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedIds.has(product.id)}
          onSelect={() => onSelect?.(product.id)}
          onEdit={() => onEdit?.(product)}
          onDelete={() => onDelete?.(product)}
        />
      ))}
    </div>
  )
}
