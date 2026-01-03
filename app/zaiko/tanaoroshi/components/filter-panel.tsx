'use client'

import { InventoryFilter, ProductType, ConditionType, EbayAccount } from '@/types/inventory'
import {
  Search,
  ShoppingCart,
  Store,
  Tag,
  Package,
  Folder,
  Award,
  Layers,
  TrendingUp,
  Clock,
  Globe,
  GitBranch,
  Lightbulb,
  RotateCcw
} from 'lucide-react'

interface FilterPanelProps {
  filter: InventoryFilter
  onFilterChange: (filter: InventoryFilter) => void
  categories: string[]
}

export function FilterPanel({ filter, onFilterChange, categories }: FilterPanelProps) {
  const handleChange = (key: keyof InventoryFilter, value: any) => {
    onFilterChange({ ...filter, [key]: value })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* 検索 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Search className="h-4 w-4 mr-2 inline" />
            商品名・SKU検索
          </label>
          <input
            type="text"
            value={filter.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="商品名またはSKUを入力..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* P0-6A: マーケットプレイスフィルター（メルカリ対応） */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <ShoppingCart className="h-4 w-4 mr-2 inline" />
            販売モール
          </label>
          <select
            value={filter.marketplace || 'all'}
            onChange={(e) => handleChange('marketplace', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="ebay">🛒 eBay</option>
            <option value="mercari">🔴 メルカリ</option>
            <option value="manual">✏️ 手動登録</option>
          </select>
        </div>

        {/* P0-5: eBayアカウントフィルター */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Store className="h-4 w-4 mr-2 inline" />
            eBayアカウント
          </label>
          <select
            value={filter.ebay_account || 'all'}
            onChange={(e) => handleChange('ebay_account', e.target.value as EbayAccount)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="MJT">🔵 MJT</option>
            <option value="GREEN">🟢 GREEN</option>
            <option value="manual">✏️ 手動入力</option>
          </select>
        </div>

        {/* 商品タイプ */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Tag className="h-4 w-4 mr-2 inline" />
            商品タイプ
          </label>
          <select
            value={filter.product_type || 'all'}
            onChange={(e) => handleChange('product_type', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="stock">有在庫</option>
            <option value="dropship">無在庫</option>
            <option value="set">セット商品</option>
            <option value="variation">バリエーション</option>
            <option value="hybrid">ハイブリッド</option>
          </select>
        </div>

        {/* 在庫状態 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Package className="h-4 w-4 mr-2 inline" />
            在庫状態
          </label>
          <select
            value={filter.stock_status || 'all'}
            onChange={(e) => handleChange('stock_status', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="in_stock">在庫あり</option>
            <option value="out_of_stock">欠品</option>
          </select>
        </div>
      </div>

      {/* 2行目: 商品状態・在庫最適化フィルター */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
        {/* カテゴリ */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Folder className="h-4 w-4 mr-2 inline" />
            カテゴリ
          </label>
          <select
            value={filter.category || ''}
            onChange={(e) => handleChange('category', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">すべて</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Award className="h-4 w-4 mr-2 inline" />
            商品状態
          </label>
          <select
            value={filter.condition || 'all'}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="new">新品</option>
            <option value="used">中古</option>
            <option value="refurbished">整備済</option>
          </select>
        </div>

        {/* 在庫タイプ */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Layers className="h-4 w-4 mr-2 inline" />
            在庫タイプ
          </label>
          <select
            value={filter.inventory_type || 'all'}
            onChange={(e) => handleChange('inventory_type', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="ROTATION_90_DAYS">⚡ 回転商品（90日）</option>
            <option value="INVESTMENT_10_PERCENT">💎 投資商品（10%）</option>
          </select>
        </div>

        {/* 価格フェーズ */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <TrendingUp className="h-4 w-4 mr-2 inline" />
            価格フェーズ
          </label>
          <select
            value={filter.price_phase || 'all'}
            onChange={(e) => handleChange('price_phase', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="NORMAL">✅ 通常販売</option>
            <option value="WARNING">⚠️ 警戒販売</option>
            <option value="LIQUIDATION">🔴 損切り実行</option>
          </select>
        </div>

        {/* 経過日数 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Clock className="h-4 w-4 mr-2 inline" />
            経過日数
          </label>
          <select
            value={filter.days_held || 'all'}
            onChange={(e) => handleChange('days_held', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="0-90">0-90日（通常）</option>
            <option value="91-180">91-180日（警戒）</option>
            <option value="180+">180日超（損切り）</option>
          </select>
        </div>

        {/* サイトフィルター */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Globe className="h-4 w-4 mr-2 inline" />
            販売サイト
          </label>
          <select
            value={filter.site || 'all'}
            onChange={(e) => handleChange('site', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="US">🇺🇸 USA (eBay.com)</option>
            <option value="UK">🇬🇧 UK (eBay.co.uk)</option>
            <option value="AU">🇦🇺 AU (eBay.com.au)</option>
          </select>
        </div>
      </div>

      {/* 3行目: P0-4 バリエーション候補フィルター */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4 pt-4 border-t border-slate-200">
        {/* P0-4: バリエーション候補のみ表示 */}
        <div className="lg:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.grouping_candidate || false}
              onChange={(e) => handleChange('grouping_candidate', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">
              <GitBranch className="h-4 w-4 mr-2 inline text-purple-600" />
              バリエーション候補のみ表示
            </span>
          </label>
          <p className="text-xs text-slate-500 mt-1 ml-8">
            同カテゴリ・類似価格帯の商品をフィルター
          </p>
        </div>

        {/* P0-4: バリエーション状態フィルター */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <GitBranch className="h-4 w-4 mr-2 inline text-purple-600" />
            バリエーション状態
          </label>
          <select
            value={filter.variation_status || 'all'}
            onChange={(e) => handleChange('variation_status', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            <option value="all">すべて</option>
            <option value="standalone">🔹 単独SKU</option>
            <option value="parent">👑 バリエーション親</option>
            <option value="member">🔗 バリエーションメンバー</option>
          </select>
        </div>

        {/* クリアボタン */}
        <div className="flex items-end">
          <button
            onClick={() => onFilterChange({
              product_type: 'all',
              stock_status: 'all',
              condition: 'all',
              inventory_type: 'all',
              price_phase: 'all',
              days_held: 'all',
              site: 'all',
              marketplace: 'all',
              ebay_account: 'all',
              grouping_candidate: false,
              variation_status: 'all'
            })}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2 inline" />
            フィルタークリア
          </button>
        </div>

        {/* グルーピングのヒント */}
        <div className="lg:col-span-2 flex items-center">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-700 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <span>
              <strong>ヒント:</strong> 同じカテゴリで価格帯が近い商品をバリエーションにまとめると、
              送料サーチャージを最小化できます。
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
