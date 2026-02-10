'use client'

import React, { useState } from 'react'
import { Truck, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ShippingRoute } from '@/types/research'

interface ShippingRouteDisplayProps {
  routes: ShippingRoute[]
  calculatedAt?: string
}

export function ShippingRouteDisplay({ routes, calculatedAt }: ShippingRouteDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (!routes || routes.length === 0) {
    return null
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      {/* ヘッダー */}
      <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-sm">USA DDP 坂路計算結果</h4>
        </div>
        {calculatedAt && (
          <span className="text-xs text-gray-500">
            計算日時: {new Date(calculatedAt).toLocaleString('ja-JP')}
          </span>
        )}
      </div>

      {/* ルート一覧 */}
      <div className="p-4 space-y-3">
        {routes.map((route, idx) => (
          <div
            key={idx}
            className={cn(
              'rounded-lg border p-4',
              route.is_recommended ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'
            )}
          >
            {/* 推奨バッジ */}
            {route.is_recommended && (
              <div className="flex items-center gap-1 text-emerald-700 text-xs mb-2">
                <Check className="h-3 w-3" />
                <span>推奨ルート</span>
              </div>
            )}

            {/* 基本情報グリッド */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {/* ルート情報 */}
              <div>
                <span className="text-gray-500">ポリシー:</span>
                <span className="ml-2 font-medium">{route.route_name}</span>
              </div>
              <div>
                <span className="text-gray-500">配送会社:</span>
                <span className="ml-2">{route.carrier_name}</span>
              </div>

              {/* 価格情報 */}
              <div>
                <span className="text-gray-500">商品価格:</span>
                <span className="ml-2 font-medium">${route.product_price_usd.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">送料:</span>
                <span className="ml-2">${route.shipping_cost_usd.toFixed(2)}</span>
              </div>

              {/* 利益情報 */}
              <div>
                <span className="text-gray-500">総売価:</span>
                <span className="ml-2 font-bold">${route.total_price_usd.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">利益:</span>
                <span className={cn(
                  'ml-2 font-bold',
                  route.profit_usd > 0 ? 'text-emerald-600' : 'text-red-600'
                )}>
                  ${route.profit_usd.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">利益率:</span>
                <span className={cn(
                  'ml-2 font-bold',
                  route.profit_margin >= 15 ? 'text-emerald-600' :
                    route.profit_margin >= 10 ? 'text-yellow-600' : 'text-red-600'
                )}>
                  {route.profit_margin.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">還付後:</span>
                <span className="ml-2 text-emerald-600 font-medium">
                  {route.profit_margin_with_refund.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* コスト内訳（トグル） */}
            <div className="mt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                コスト内訳を{showDetails ? '隠す' : '表示'}
              </button>

              {showDetails && (
                <div className="mt-2 pt-2 border-t grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div>仕入: ¥{route.cost_breakdown.cost_jpy.toLocaleString()}</div>
                  <div>実送料: ${route.cost_breakdown.base_shipping_usd.toFixed(2)}</div>
                  <div>DDP手数料: ${route.cost_breakdown.ddp_fee_usd.toFixed(2)}</div>
                  <div>関税: ${route.cost_breakdown.tariff_usd.toFixed(2)} ({route.tariff_rate.toFixed(1)}%)</div>
                  <div>eBay手数料: ${route.cost_breakdown.ebay_fees_usd.toFixed(2)}</div>
                  <div>為替: ¥{route.exchange_rate}/USD</div>
                  <div>HSコード: {route.hs_code}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
