// app/tools/editing/components/product-card-view.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Edit, 
  BarChart3, 
  ExternalLink, 
  Package,
  Calendar,
  DollarSign,
  MapPin,
  TrendingDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '../types/product'
import type { TabId } from '../config/tab-configs'
import Image from 'next/image'

interface ProductCardViewProps {
  products: Product[]
  selectedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onProductClick: (product: Product) => void
  viewType: TabId
}

export function ProductCardView({
  products,
  selectedIds,
  onSelectChange,
  onProductClick,
  viewType
}: ProductCardViewProps) {
  
  const handleSelectToggle = (productId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    onSelectChange(newSelected)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedIds.has(product.id)}
          onSelectToggle={handleSelectToggle}
          onProductClick={onProductClick}
          viewType={viewType}
        />
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onSelectToggle: (id: string) => void
  onProductClick: (product: Product) => void
  viewType: TabId
}

function ProductCard({
  product,
  isSelected,
  onSelectToggle,
  onProductClick,
  viewType
}: ProductCardProps) {
  
  const imageUrl = product.main_image_url || '/placeholder.png'
  const title = product.title || 'No Title'
  const price = product.sell_price || 0

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
    >
      {/* Card Header */}
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelectToggle(product.id)}
              onClick={(e) => e.stopPropagation()}
            />
            {viewType === 'listed' && (
              <MarketplaceBadges product={product} />
            )}
          </div>
          <StatusBadge product={product} viewType={viewType} />
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent 
        className="p-3 space-y-3"
        onClick={() => onProductClick(product)}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            unoptimized
          />
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>

        {/* Product Info */}
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">価格</span>
            <span className="font-semibold flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {price.toFixed(2)}
            </span>
          </div>
          
          {viewType === 'inventory' && (
            <InventoryInfo product={product} />
          )}
          
          {viewType === 'editing' && (
            <EditingInfo product={product} />
          )}
          
          {viewType === 'approval' && (
            <ApprovalInfo product={product} />
          )}
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-3 pt-0">
        <QuickActions product={product} viewType={viewType} />
      </CardFooter>
    </Card>
  )
}

// Marketplace Badges Component
function MarketplaceBadges({ product }: { product: Product }) {
  const marketplaces = []
  
  // Check which marketplaces this product is listed on
  // This is placeholder logic - adjust based on your actual data structure
  if ((product as any).ebay_listing_id) {
    marketplaces.push({ name: 'eBay', color: 'bg-blue-500' })
  }
  if ((product as any).amazon_listing_id) {
    marketplaces.push({ name: 'Amazon', color: 'bg-orange-500' })
  }
  if ((product as any).shopee_listing_id) {
    marketplaces.push({ name: 'Shopee', color: 'bg-red-500' })
  }

  return (
    <div className="flex gap-1">
      {marketplaces.map((mp) => (
        <Badge 
          key={mp.name} 
          className={cn("text-xs px-1.5 py-0", mp.color)}
        >
          {mp.name}
        </Badge>
      ))}
    </div>
  )
}

// Status Badge Component
function StatusBadge({ product, viewType }: { product: Product; viewType: TabId }) {
  if (viewType === 'editing') {
    const isComplete = product.ready_to_publish
    return (
      <Badge variant={isComplete ? "default" : "secondary"} className="text-xs">
        {isComplete ? '完成' : '未完成'}
      </Badge>
    )
  }
  
  if (viewType === 'inventory') {
    const stockType = (product as any).stock_type
    return (
      <Badge 
        variant={stockType === 'stock' ? "default" : "outline"} 
        className="text-xs"
      >
        {stockType === 'stock' ? '有在庫' : '無在庫'}
      </Badge>
    )
  }

  return null
}

// Inventory Info Component
function InventoryInfo({ product }: { product: Product }) {
  const location = (product as any).storage_location || 'N/A'
  const daysInStock = (product as any).days_in_stock || 0
  
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1">
          <Package className="w-3 h-3" />
          在庫
        </span>
        <span className="font-medium">{(product as any).stock_quantity || 0}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          保管場所
        </span>
        <span className="font-medium text-xs">{location}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          滞留日数
        </span>
        <Badge variant={daysInStock > 60 ? "destructive" : daysInStock > 30 ? "secondary" : "default"}>
          {daysInStock}日
        </Badge>
      </div>
    </>
  )
}

// Editing Info Component
function EditingInfo({ product }: { product: Product }) {
  const updatedAt = product.updated_at 
    ? new Date(product.updated_at).toLocaleDateString('ja-JP')
    : 'N/A'
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        最終更新
      </span>
      <span className="text-xs">{updatedAt}</span>
    </div>
  )
}

// Approval Info Component
function ApprovalInfo({ product }: { product: Product }) {
  const requestedAt = (product as any).approval_requested_at
    ? new Date((product as any).approval_requested_at).toLocaleDateString('ja-JP')
    : 'N/A'
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        申請日
      </span>
      <span className="text-xs">{requestedAt}</span>
    </div>
  )
}

// Quick Actions Component
function QuickActions({ product, viewType }: { product: Product; viewType: TabId }) {
  return (
    <div className="flex gap-2 w-full">
      <Button 
        size="sm" 
        variant="outline" 
        className="flex-1 gap-1"
        onClick={(e) => {
          e.stopPropagation()
          // Handle edit action
        }}
      >
        <Edit className="w-3 h-3" />
        編集
      </Button>
      
      {viewType === 'listed' && (
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation()
            // Handle external link
          }}
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      )}
      
      {viewType === 'inventory' && (
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation()
            // Handle price reduction
          }}
        >
          <TrendingDown className="w-3 h-3" />
        </Button>
      )}
    </div>
  )
}
