// app/tools/operations/components/order-filter-panel.tsx
// 受注検索・フィルターパネル（左側）
'use client'

import { useState } from 'react'
import { Search, Calendar, AlertTriangle, CreditCard, Truck, Download, X } from 'lucide-react'
import type { OrderFilter, OrderStats, SalesChannel, OrderStatus, PaymentStatus } from '../types/order'

interface OrderFilterPanelProps {
  filter: OrderFilter
  stats: OrderStats
  onFilterChange: (filter: OrderFilter) => void
  onSearch: () => void
  onClear: () => void
  onQuickAction: (action: 'urgent' | 'unpaid' | 'shipping_today' | 'export') => void
}

export function OrderFilterPanel({
  filter,
  stats,
  onFilterChange,
  onSearch,
  onClear,
  onQuickAction
}: OrderFilterPanelProps) {
  const handleInputChange = (key: keyof OrderFilter, value: string) => {
    onFilterChange({ ...filter, [key]: value })
  }

  return (
    <div className="w-[240px] bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden h-full">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4" />
          <span className="font-semibold text-sm">検索・フィルター</span>
        </div>
        <input
          type="text"
          placeholder="注文ID・商品名・顧客名で検索..."
          value={filter.search || ''}
          onChange={(e) => handleInputChange('search', e.target.value)}
          className="w-full px-3 py-1.5 bg-white/10 border border-white/30 rounded text-xs placeholder-white/60 text-white focus:outline-none focus:bg-white/20"
        />
      </div>

      {/* フィルター項目 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 期間設定 */}
        <FilterSection label="期間設定">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filter.date_from || ''}
              onChange={(e) => handleInputChange('date_from', e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={filter.date_to || ''}
              onChange={(e) => handleInputChange('date_to', e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </FilterSection>

        {/* 販売チャネル */}
        <FilterSection label="販売チャネル">
          <select
            value={filter.channel || 'all'}
            onChange={(e) => handleInputChange('channel', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">全てのチャネル</option>
            <option value="ebay">eBay</option>
            <option value="amazon">Amazon</option>
            <option value="shopee">Shopee</option>
            <option value="shopify">Shopify</option>
          </select>
        </FilterSection>

        {/* 注文ステータス */}
        <FilterSection label="注文ステータス">
          <select
            value={filter.order_status || 'all'}
            onChange={(e) => handleInputChange('order_status', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">全てのステータス</option>
            <option value="new">新規注文</option>
            <option value="processing">処理中</option>
            <option value="shipped">出荷済み</option>
            <option value="delivered">配達完了</option>
          </select>
        </FilterSection>

        {/* 支払い状況 */}
        <FilterSection label="支払い状況">
          <select
            value={filter.payment_status || 'all'}
            onChange={(e) => handleInputChange('payment_status', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">全ての支払い状況</option>
            <option value="pending">支払待ち</option>
            <option value="paid">支払完了</option>
            <option value="failed">支払失敗</option>
          </select>
        </FilterSection>

        {/* 配送先国 */}
        <FilterSection label="配送先国">
          <select
            value={filter.country || 'all'}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">全ての国</option>
            <option value="US">アメリカ</option>
            <option value="CA">カナダ</option>
            <option value="GB">イギリス</option>
            <option value="DE">ドイツ</option>
            <option value="AU">オーストラリア</option>
            <option value="FR">フランス</option>
            <option value="SG">シンガポール</option>
          </select>
        </FilterSection>
      </div>

      {/* 今日の受注状況 */}
      <div className="px-4 py-3 border-t border-gray-100">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">今日の受注状況</h3>
        <div className="grid grid-cols-2 gap-2">
          <StatCard value={stats.new_orders} label="新規注文" color="text-blue-600" />
          <StatCard value={stats.processing} label="処理中" color="text-yellow-600" />
          <StatCard value={stats.shipped} label="出荷済み" color="text-green-600" />
          <StatCard 
            value={`¥${stats.today_revenue.toLocaleString()}`} 
            label="今日の売上" 
            color="text-indigo-600"
            highlight
          />
        </div>
      </div>

      {/* クイックアクション */}
      <div className="px-4 py-3 border-t border-gray-100 space-y-2">
        <QuickActionButton
          icon={AlertTriangle}
          label="緊急対応必要"
          count={stats.urgent_count}
          color="text-red-600 bg-red-50 hover:bg-red-100"
          onClick={() => onQuickAction('urgent')}
        />
        <QuickActionButton
          icon={CreditCard}
          label="未入金注文"
          count={stats.unpaid_count}
          color="text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
          onClick={() => onQuickAction('unpaid')}
        />
        <QuickActionButton
          icon={Truck}
          label="今日出荷予定"
          count={stats.shipping_today_count}
          color="text-blue-600 bg-blue-50 hover:bg-blue-100"
          onClick={() => onQuickAction('shipping_today')}
        />
        <QuickActionButton
          icon={Download}
          label="データエクスポート"
          color="text-gray-600 bg-gray-50 hover:bg-gray-100"
          onClick={() => onQuickAction('export')}
        />
      </div>

      {/* 検索・クリアボタン */}
      <div className="px-4 py-3 border-t border-gray-200 grid grid-cols-2 gap-2">
        <button
          onClick={onSearch}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          検索
        </button>
        <button
          onClick={onClear}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          クリア
        </button>
      </div>
    </div>
  )
}

// フィルターセクション
function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// 統計カード
function StatCard({ 
  value, 
  label, 
  color,
  highlight
}: { 
  value: string | number
  label: string
  color: string
  highlight?: boolean
}) {
  return (
    <div className={`bg-gray-50 rounded px-3 py-2 ${highlight ? 'col-span-2' : ''}`}>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  )
}

// クイックアクションボタン
function QuickActionButton({
  icon: Icon,
  label,
  count,
  color,
  onClick
}: {
  icon: any
  label: string
  count?: number
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${color}`}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="bg-white/80 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
          {count}
        </span>
      )}
    </button>
  )
}

export default OrderFilterPanel
