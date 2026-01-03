import { InventoryProduct } from '@/types/inventory'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, XCircle } from 'lucide-react'
import { getAlertProducts } from '@/lib/services/inventory/automatic-price-reduction-service'

interface InventoryAlertsProps {
  products: InventoryProduct[]
  onProductClick?: (product: InventoryProduct) => void
}

export function InventoryAlerts({ products, onProductClick }: InventoryAlertsProps) {
  const { warning, danger } = getAlertProducts(products)

  // アラートがない場合は何も表示しない
  if (warning.length === 0 && danger.length === 0) {
    return null
  }

  return (
    <div className="mb-6 space-y-4">
      {/* 🔴 危険レベル: 損切り実行中 */}
      {danger.length > 0 && (
        <Alert variant="destructive" className="border-red-500 bg-red-50">
          <XCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold flex items-center gap-2">
            🔴 緊急: 損切り実行中の在庫
            <Badge variant="destructive" className="text-sm">
              {danger.length}件
            </Badge>
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-3 text-red-800">
              以下の商品は在庫保有期間が180日を超えており、原価割れでの現金化を実行しています。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {danger.slice(0, 10).map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-red-200 rounded-lg p-3 hover:bg-red-50 transition-colors cursor-pointer"
                  onClick={() => onProductClick?.(product)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">
                        {product.product_name}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-slate-500 font-mono">
                          SKU: {product.sku}
                        </p>
                      )}
                    </div>
                    <Badge variant="destructive" className="shrink-0 text-xs">
                      損切り中
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>在庫数: {product.physical_quantity}</span>
                    <span className="font-semibold text-red-600">
                      ${(product.selling_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {danger.length > 10 && (
              <p className="mt-3 text-sm text-red-700 font-semibold">
                他 {danger.length - 10}件の損切り商品があります
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* ⚠️ 警告レベル: 警戒販売中 */}
      {warning.length > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-lg font-bold flex items-center gap-2 text-yellow-900">
            ⚠️ 警告: 警戒販売フェーズの在庫
            <Badge className="bg-yellow-600 hover:bg-yellow-700 text-sm">
              {warning.length}件
            </Badge>
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-3 text-yellow-800">
              以下の商品は在庫保有期間が4ヶ月を超えており、利益率5%まで引き下げて販売中です。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {warning.slice(0, 9).map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-yellow-200 rounded-lg p-3 hover:bg-yellow-50 transition-colors cursor-pointer"
                  onClick={() => onProductClick?.(product)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">
                        {product.product_name}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-slate-500 font-mono">
                          SKU: {product.sku}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-yellow-600 hover:bg-yellow-700 shrink-0 text-xs">
                      警戒中
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>在庫数: {product.physical_quantity}</span>
                    <span className="font-semibold text-yellow-700">
                      ${(product.selling_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {warning.length > 9 && (
              <p className="mt-3 text-sm text-yellow-700 font-semibold">
                他 {warning.length - 9}件の警戒商品があります
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
