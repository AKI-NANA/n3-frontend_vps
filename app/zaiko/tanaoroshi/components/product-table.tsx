'use client'

import { InventoryProduct } from '@/types/inventory'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, ExternalLink, Settings, Package } from 'lucide-react'
import {
  daysSinceAcquisition,
  determinePricePhase,
  getPhaseName,
  getPhaseColor,
  calculateFinalProfitMargin
} from '@/lib/services/inventory/automatic-price-reduction-service'

interface ProductTableProps {
  products: InventoryProduct[]
  onEdit: (product: InventoryProduct) => void
  onDelete: (product: InventoryProduct) => void
  selectedProducts: Set<string>
  onToggleSelect: (sku: string) => void
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  selectedProducts,
  onToggleSelect
}: ProductTableProps) {

  const formatPrice = (price: number, marketplace?: string) => {
    if (!price || price === 0) return '未設定'
    if (marketplace === 'mercari') {
      return `¥${price.toLocaleString()}`
    }
    return `$${price.toFixed(2)}`
  }

  const getMarketplaceBadge = (product: InventoryProduct) => {
    if (product.marketplace === 'mercari') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
          🔴 メルカリ
        </Badge>
      )
    }

    if (product.marketplace === 'ebay') {
      const account = product.account || product.source_data?.ebay_account || 'UNKNOWN'
      const accountUpper = account.toUpperCase()
      const badgeClass = accountUpper === 'GREEN'
        ? 'bg-green-50 text-green-700 border-green-200'
        : accountUpper === 'MJT'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-slate-50 text-slate-700 border-slate-200'

      return (
        <Badge variant="outline" className={`${badgeClass} text-xs`}>
          eBay {accountUpper}
        </Badge>
      )
    }

    if (product.marketplace === 'manual' || product.is_manual_entry) {
      return (
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
          ✏️ 手動
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
        不明
      </Badge>
    )
  }

  const getProductTypeBadge = (product: InventoryProduct) => {
    const sku = product.sku?.toLowerCase() || ''

    if (sku.includes('stock') || product.product_type === 'stock') {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
          📦 有在庫
        </Badge>
      )
    } else if (product.product_type === 'dropship') {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300 text-xs">
          ❓ 未判定
        </Badge>
      )
    } else if (product.product_type === 'set') {
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
          📦 セット
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300 text-xs">
        ⚠️ 未設定
      </Badge>
    )
  }

  const getStockBadge = (qty: number) => {
    if (qty === 0) {
      return <Badge variant="destructive" className="text-xs">在庫なし</Badge>
    } else if (qty < 5) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
          少量 ({qty})
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
          在庫 {qty}
        </Badge>
      )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-slate-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      products.forEach(p => onToggleSelect(p.sku))
                    } else {
                      products.forEach(p => onToggleSelect(p.sku))
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">画像</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">商品名 / SKU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">販売元</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">タイプ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">状態</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">販売価格</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">在庫</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">出品数</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">経過日数</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const daysHeld = daysSinceAcquisition(product.date_acquired || null)
              const currentPhase = product.current_price_phase || determinePricePhase(product.date_acquired || null)
              const phaseColors = getPhaseColor(currentPhase)
              const profitMargin = calculateFinalProfitMargin(product)
              const ebayItemId = product.source_data?.ebay_item_id
              const ebayUrl = ebayItemId ? `https://www.ebay.com/itm/${ebayItemId}` : null
              const sellerHubUrl = ebayItemId ? `https://www.ebay.com/sh/lst/active?q=${ebayItemId}` : null
              const imageUrl = Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Image'

              return (
                <tr
                  key={product.sku}
                  className={`hover:bg-indigo-50/50 transition-colors cursor-pointer ${
                    selectedProducts.has(product.sku) ? 'bg-indigo-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.sku)}
                      onChange={() => onToggleSelect(product.sku)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={imageUrl}
                      alt={product.product_name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Image'
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">
                        {product.product_name}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-slate-500 font-mono mt-1">
                          {product.sku}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {getMarketplaceBadge(product)}
                      {product.date_acquired && (
                        <Badge variant="outline" className={`${phaseColors.bg} ${phaseColors.text} ${phaseColors.border} text-xs`}>
                          {getPhaseName(currentPhase)}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getProductTypeBadge(product)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        !product.condition_name
                          ? 'bg-slate-100 text-slate-500'
                          : product.condition_name.toLowerCase() === 'new'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {product.condition_name || '状態不明'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${
                      product.marketplace === 'mercari' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatPrice(product.selling_price, product.marketplace)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStockBadge(product.physical_quantity || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium">
                      {product.listing_quantity || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.date_acquired ? (
                      <div className="flex flex-col gap-1 items-center">
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-xs">
                          {daysHeld}日
                        </Badge>
                        {profitMargin > 0 && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              profitMargin >= 10
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : profitMargin >= 5
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {profitMargin.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="h-8"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      {sellerHubUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(sellerHubUrl, '_blank')}
                          title="Seller Hubで編集"
                          className="h-8 text-blue-600 hover:text-blue-800"
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                      )}
                      {ebayUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(ebayUrl, '_blank')}
                          title="eBayで開く"
                          className="h-8"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p>商品が見つかりません</p>
        </div>
      )}
    </div>
  )
}
