// app/tools/operations/components/order-detail-panel.tsx
// 受注詳細サイドパネル（右から重なって表示）
'use client'

import { X, Play, Truck, Printer, MessageCircle, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Order, COUNTRY_FLAGS, CHANNEL_COLORS, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '../types/order'

interface OrderDetailPanelProps {
  order: Order | null
  onClose: () => void
  onProcessOrder?: (orderId: string) => void
  onMarkShipped?: (orderId: string) => void
  onPrintLabel?: (orderId: string) => void
  onOpenInquiry?: (orderId: string) => void
  onOpenEbayPage?: (orderId: string) => void
}

export function OrderDetailPanel({
  order,
  onClose,
  onProcessOrder,
  onMarkShipped,
  onPrintLabel,
  onOpenInquiry,
  onOpenEbayPage
}: OrderDetailPanelProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!order) return null

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
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

  // チャネルバッジ
  const getChannelBadge = (channel: string) => {
    const colors: Record<string, string> = {
      ebay: 'bg-blue-500',
      amazon: 'bg-orange-500',
      shopee: 'bg-orange-600',
      shopify: 'bg-green-600'
    }
    return colors[channel] || 'bg-gray-500'
  }

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-semibold text-sm">注文詳細</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto">
        {/* 基本情報 */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">基本情報</h3>
          <div className="space-y-2">
            <DetailRow label="注文番号" value={order.order_id} copyable onCopy={() => handleCopy(order.order_id, 'order_id')} copied={copiedField === 'order_id'} />
            <DetailRow label="注文日時" value={order.order_date} />
            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-gray-500">販売チャネル</span>
              <span className={`text-xs px-2 py-0.5 rounded text-white ${getChannelBadge(order.channel)}`}>
                {order.channel.toUpperCase()}
              </span>
            </div>
            <DetailRow 
              label="出荷期限" 
              value={order.shipping_deadline} 
              highlight={isDeadlineClose(order.shipping_deadline)}
            />
          </div>
        </div>

        {/* 商品情報 */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">商品情報</h3>
          <div className="space-y-2">
            <DetailRow label="商品名" value={order.product_title} truncate />
            <DetailRow label="SKU" value={order.sku} copyable onCopy={() => handleCopy(order.sku, 'sku')} copied={copiedField === 'sku'} />
            <DetailRow label="数量" value={order.quantity.toString()} />
          </div>
        </div>

        {/* 金額・利益 */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">金額・利益</h3>
          <div className="space-y-2">
            <DetailRow label="販売価格" value={`¥${order.sale_price.toLocaleString()}`} />
            <DetailRow label="手数料" value={`-¥${Math.abs(order.fees).toLocaleString()}`} negative />
            <DetailRow label="配送料" value={`-¥${Math.abs(order.shipping_cost).toLocaleString()}`} negative />
            <div className="border-t border-gray-100 pt-2 mt-2">
              <DetailRow 
                label="予想利益" 
                value={`¥${order.profit.toLocaleString()}`} 
                highlight 
                positive={order.profit > 0}
              />
            </div>
          </div>
        </div>

        {/* 配送情報 */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">配送情報</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-gray-500">配送先国</span>
              <span className="text-sm font-medium">
                {getFlag(order.destination_country_code)} {order.destination_country}
              </span>
            </div>
            <DetailRow label="配送方法" value={order.shipping_method || '-'} />
            {order.tracking_number ? (
              <DetailRow 
                label="追跡番号" 
                value={order.tracking_number} 
                copyable 
                onCopy={() => handleCopy(order.tracking_number!, 'tracking')} 
                copied={copiedField === 'tracking'}
              />
            ) : (
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-500">追跡番号</span>
                <input 
                  type="text"
                  placeholder="追跡番号を入力..."
                  className="text-xs border border-gray-200 rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
        <button
          onClick={() => onProcessOrder?.(order.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Play className="w-4 h-4" />
          注文処理開始
        </button>
        
        <button
          onClick={() => onMarkShipped?.(order.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Truck className="w-4 h-4" />
          出荷完了マーク
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onPrintLabel?.(order.id)}
            className="flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            配送ラベル印刷
          </button>
          
          <button
            onClick={() => onOpenInquiry?.(order.id)}
            className="flex items-center justify-center gap-1.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            問い合わせ確認
          </button>
        </div>

        <button
          onClick={() => onOpenEbayPage?.(order.id)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          eBay商品ページ
        </button>
      </div>
    </div>
  )
}

// 詳細行コンポーネント
function DetailRow({ 
  label, 
  value, 
  copyable, 
  onCopy, 
  copied,
  truncate,
  highlight,
  positive,
  negative
}: { 
  label: string
  value: string
  copyable?: boolean
  onCopy?: () => void
  copied?: boolean
  truncate?: boolean
  highlight?: boolean
  positive?: boolean
  negative?: boolean
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${
          truncate ? 'max-w-[180px] truncate' : ''
        } ${
          highlight ? 'text-green-600 font-semibold' : ''
        } ${
          negative ? 'text-red-500' : ''
        } ${
          positive ? 'text-green-600' : ''
        }`}>
          {value}
        </span>
        {copyable && (
          <button
            onClick={onCopy}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// 期限が近いかチェック
function isDeadlineClose(deadline: string): boolean {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 3
}

export default OrderDetailPanel
