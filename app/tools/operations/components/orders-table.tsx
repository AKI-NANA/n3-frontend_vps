// app/tools/operations/components/orders-table.tsx
// 受注一覧テーブル
'use client'

import { useState } from 'react'
import { RefreshCw, LayoutGrid, ChevronUp, ChevronDown } from 'lucide-react'
import type { Order, OrderStatus, PaymentStatus, SalesChannel } from '../types/order'

interface OrdersTableProps {
  orders: Order[]
  loading?: boolean
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  onOrderSelect: (order: Order) => void
  onRefresh: () => void
  onBulkShip: () => void
  onBulkPrint: () => void
  onExport: () => void
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function OrdersTable({
  orders,
  loading,
  selectedIds,
  onSelectionChange,
  onOrderSelect,
  onRefresh,
  onBulkShip,
  onBulkPrint,
  onExport,
  total,
  currentPage,
  pageSize,
  onPageChange
}: OrdersTableProps) {
  const [sortKey, setSortKey] = useState<string>('order_date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.size === orders.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(orders.map(o => o.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    onSelectionChange(newSet)
  }

  // 国旗取得
  const getFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'AU': '🇦🇺', 'JP': '🇯🇵', 'SG': '🇸🇬',
      'IT': '🇮🇹', 'ES': '🇪🇸'
    }
    return flags[countryCode] || '🌍'
  }

  // ステータスバッジ
  const getStatusBadge = (status: OrderStatus) => {
    const config: Record<OrderStatus, { bg: string; label: string }> = {
      new: { bg: 'bg-yellow-100 text-yellow-800', label: '出荷待ち' },
      processing: { bg: 'bg-blue-100 text-blue-800', label: '処理中' },
      shipped: { bg: 'bg-green-100 text-green-800', label: '出荷済み' },
      delivered: { bg: 'bg-purple-100 text-purple-800', label: '配送完了' },
      cancelled: { bg: 'bg-gray-100 text-gray-800', label: 'キャンセル' }
    }
    return config[status] || config.new
  }

  // 支払いバッジ
  const getPaymentBadge = (status: PaymentStatus) => {
    const config: Record<PaymentStatus, { bg: string; label: string }> = {
      pending: { bg: 'bg-yellow-100 text-yellow-800', label: '支払待ち' },
      paid: { bg: 'bg-green-100 text-green-800', label: '支払完了' },
      failed: { bg: 'bg-red-100 text-red-800', label: '支払失敗' },
      refunded: { bg: 'bg-gray-100 text-gray-800', label: '返金済み' }
    }
    return config[status] || config.pending
  }

  // チャネルバッジ
  const getChannelBadge = (channel: SalesChannel) => {
    const config: Record<SalesChannel, { bg: string; label: string }> = {
      ebay: { bg: 'bg-blue-500 text-white', label: 'eBay' },
      amazon: { bg: 'bg-orange-500 text-white', label: 'Amazon' },
      shopee: { bg: 'bg-orange-600 text-white', label: 'Shopee' },
      shopify: { bg: 'bg-green-600 text-white', label: 'Shopify' }
    }
    return config[channel] || { bg: 'bg-gray-500 text-white', label: channel }
  }

  // スコア色
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">≡ 受注一覧</span>
          <span className="text-blue-200 text-xs">({total}件)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            更新
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-medium transition-colors">
            <LayoutGrid className="w-3.5 h-3.5" />
            田表示
          </button>
        </div>
      </div>

      {/* 一括操作バー */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedIds.size === orders.length && orders.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-gray-300"
          />
          <button
            onClick={onBulkShip}
            disabled={selectedIds.size === 0}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            一括出荷完了
          </button>
          <button
            onClick={onBulkPrint}
            disabled={selectedIds.size === 0}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            一括ラベル印刷
          </button>
          <button
            onClick={onExport}
            disabled={selectedIds.size === 0}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            選択エクスポート
          </button>
        </div>
      </div>

      {/* テーブル */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.size === orders.length && orders.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('order_id')}
              >
                <div className="flex items-center gap-1">
                  注文番号
                  {sortKey === 'order_id' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('order_date')}
              >
                <div className="flex items-center gap-1">
                  日時
                  {sortKey === 'order_date' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">商品情報</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">金額・利益</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">支払い</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">スコア</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">配送先</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const statusBadge = getStatusBadge(order.order_status)
              const paymentBadge = getPaymentBadge(order.payment_status)
              const channelBadge = getChannelBadge(order.channel)
              
              return (
                <tr
                  key={order.id}
                  onClick={() => onOrderSelect(order)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  {/* チェックボックス */}
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => handleSelectOne(order.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>

                  {/* 注文番号 */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-blue-600 font-semibold text-xs">{order.order_id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded w-fit mt-0.5 ${channelBadge.bg}`}>
                        {channelBadge.label}
                      </span>
                    </div>
                  </td>

                  {/* 日時 */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col text-xs">
                      <span className="text-gray-900">{formatDate(order.order_date)}</span>
                      <span className="text-gray-500">{formatTime(order.order_date)}</span>
                    </div>
                  </td>

                  {/* 商品情報 */}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                        {order.product_image ? (
                          <img src={order.product_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-gray-900 truncate max-w-[200px]">{order.product_title}</span>
                        <span className="text-[10px] text-gray-500">{order.sku}</span>
                      </div>
                    </div>
                  </td>

                  {/* 金額・利益 */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-semibold text-gray-900">¥{order.sale_price.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-500">利益率: {order.profit_rate.toFixed(1)}%</span>
                    </div>
                  </td>

                  {/* 支払い */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded text-center ${paymentBadge.bg}`}>
                        {paymentBadge.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded text-center ${statusBadge.bg}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </td>

                  {/* スコア */}
                  <td className="px-3 py-2 text-center">
                    {order.ai_score !== undefined && (
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${getScoreColor(order.ai_score)}`}>
                        {order.ai_score}
                      </span>
                    )}
                  </td>

                  {/* 配送先 */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900">
                        {getFlag(order.destination_country_code)} {order.destination_country}
                      </span>
                      <span className="text-[10px] text-orange-600">
                        期限: {formatDeadline(order.shipping_deadline)}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} / {total}件
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
          >
            ←
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 text-xs rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            )
          })}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

// ヘルパー関数
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function formatDeadline(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export default OrdersTable
