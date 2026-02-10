'use client'

import { InventoryStats } from '@/types/inventory'
import {
  Package,
  CheckCircle,
  XCircle,
  Layers,
  DollarSign,
  JapaneseYen,
  CheckSquare,
  AlertTriangle,
  Store,
  GitBranch,
  Calendar,
  Box,
  Info
} from 'lucide-react'

interface StatsHeaderProps {
  stats: InventoryStats
  selectedCount: number
}

export function StatsHeader({ stats, selectedCount }: StatsHeaderProps) {
  const hasOptimizationData = stats.warning_inventory !== undefined || stats.liquidation_inventory !== undefined
  const hasAccountStats = stats.account_stats !== undefined
  const hasVariationStats = stats.variation_stats !== undefined

  return (
    <div className="space-y-4 mb-6">
      {/* 基本統計 */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4`}>
        {/* 総商品数 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-indigo-500 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">総商品数</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-xs">
            <span className="text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              在庫あり: {stats.in_stock}
            </span>
            <span className="text-red-600 flex items-center">
              <XCircle className="h-3 w-3 mr-1" />
              欠品: {stats.out_of_stock}
            </span>
          </div>
        </div>

        {/* 商品タイプ別 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-green-500 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">商品タイプ</p>
              <div className="flex gap-2 mt-2">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-700">{stats.stock_count}</p>
                  <p className="text-xs text-slate-500">有在庫</p>
                </div>
                <div className="border-l border-slate-200 mx-2"></div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-700">{stats.dropship_count}</p>
                  <p className="text-xs text-slate-500">無在庫</p>
                </div>
                <div className="border-l border-slate-200 mx-2"></div>
                <div className="text-center">
                  <p className="text-xl font-bold text-amber-700">{stats.set_count}</p>
                  <p className="text-xs text-slate-500">セット</p>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Layers className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* 在庫総額（出品価格ベース） */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-amber-500 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">出品総額</p>
              <p className="text-3xl font-bold text-slate-900">
                ${((stats as any).total_selling_value || stats.total_value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center">
            <Box className="h-3 w-3 mr-1" />
            販売価格 × 出品数量
          </div>
          {/* 原価ベースがある場合は小さく表示 */}
          {stats.total_value > 0 && (stats as any).total_selling_value !== stats.total_value && (
            <div className="mt-1 text-xs text-green-600 flex items-center">
              <Store className="h-3 w-3 mr-1" />
              原価評価: ${stats.total_value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          )}
        </div>

        {/* P0-4: 仕入れ代金総額（円） */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-rose-500 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">仕入れ代金総額</p>
              <p className="text-3xl font-bold text-slate-900">
                ¥{((stats as any).total_cost_jpy || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <JapaneseYen className="h-6 w-6 text-rose-600" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center">
            <Box className="h-3 w-3 mr-1" />
            有在庫商品の原価合計（円）
          </div>
          {(stats as any).stock_with_cost_count !== undefined && (
            <div className="mt-1 text-xs text-rose-600 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              対象: {(stats as any).stock_with_cost_count}件
            </div>
          )}
        </div>

        {/* 選択中 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-purple-500 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">選択中</p>
              <p className="text-3xl font-bold text-slate-900">{selectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          {selectedCount >= 2 && (
            <div className="mt-3 text-xs text-purple-600 font-semibold flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              セット商品作成が可能
            </div>
          )}
        </div>

        {/* 要注意在庫（警戒フェーズ） */}
        {stats.warning_inventory !== undefined && stats.warning_inventory > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-yellow-500 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">⚠️ 要注意在庫</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.warning_inventory}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              警戒販売（4-6ヶ月経過）
            </div>
          </div>
        )}
      </div>

      {/* P0-7: アカウント別統計 */}
      {hasAccountStats && stats.account_stats && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Store className="h-5 w-5 text-slate-600" />
            <h3 className="font-semibold text-slate-700">アカウント別統計</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* MJT */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-800">🔵 MJT</span>
                <span className="text-2xl font-bold text-blue-700">{stats.account_stats.MJT.total}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-blue-600">在庫あり:</span>
                  <span className="ml-1 font-semibold">{stats.account_stats.MJT.in_stock}</span>
                </div>
                <div>
                  <span className="text-blue-600">出品中:</span>
                  <span className="ml-1 font-semibold">{stats.account_stats.MJT.listing_count}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-blue-600">出品総額:</span>
                  <span className="ml-1 font-semibold">${stats.account_stats.MJT.total_selling_value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            {/* GREEN */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-green-800">🟢 GREEN</span>
                <span className="text-2xl font-bold text-green-700">{stats.account_stats.GREEN.total}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-green-600">在庫あり:</span>
                  <span className="ml-1 font-semibold">{stats.account_stats.GREEN.in_stock}</span>
                </div>
                <div>
                  <span className="text-green-600">出品中:</span>
                  <span className="ml-1 font-semibold">{stats.account_stats.GREEN.listing_count}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-green-600">出品総額:</span>
                  <span className="ml-1 font-semibold">${stats.account_stats.GREEN.total_selling_value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            {/* 手動入力 */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800">✏️ 手動入力</span>
                <span className="text-2xl font-bold text-slate-700">{stats.account_stats.manual.total}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-600">在庫あり:</span>
                  <span className="ml-1 font-semibold">{stats.account_stats.manual.in_stock}</span>
                </div>
                <div>
                  <span className="text-slate-600">出品中:</span>
                  <span className="ml-1 font-semibold">{stats.account_stats.manual.listing_count}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">出品総額:</span>
                  <span className="ml-1 font-semibold">${stats.account_stats.manual.total_selling_value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* バリエーション統計 */}
      {hasVariationStats && stats.variation_stats && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-slate-700">バリエーション統計</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 親SKU */}
            <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
              <p className="text-2xl font-bold text-purple-700">{stats.variation_stats.parent_count}</p>
              <p className="text-xs text-purple-600">👑 バリエーション親</p>
            </div>

            {/* メンバー */}
            <div className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-200">
              <p className="text-2xl font-bold text-indigo-700">{stats.variation_stats.member_count}</p>
              <p className="text-xs text-indigo-600">🔗 メンバーSKU</p>
            </div>

            {/* 単独SKU */}
            <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
              <p className="text-2xl font-bold text-slate-700">{stats.variation_stats.standalone_count}</p>
              <p className="text-xs text-slate-600">🔹 単独SKU</p>
            </div>

            {/* グルーピング候補 */}
            <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
              <p className="text-2xl font-bold text-amber-700">{stats.variation_stats.grouping_candidates}</p>
              <p className="text-xs text-amber-600">🎯 グルーピング候補</p>
              {stats.variation_stats.grouping_candidates > 0 && (
                <p className="text-xs text-amber-500 mt-1">
                  バリエーション化可能
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 平均在庫日数（独立表示） */}
      {stats.avg_days_held !== undefined && stats.avg_days_held > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">平均在庫日数</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{stats.avg_days_held}日</p>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  stats.avg_days_held <= 90 ? 'bg-green-100 text-green-700' :
                  stats.avg_days_held <= 180 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {stats.avg_days_held <= 90 ? '✅ 良好' :
                   stats.avg_days_held <= 180 ? '⚠️ 警戒' : '🔴 要注意'}
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-slate-500">目標: 90日以内</p>
              {stats.rotation_90_count !== undefined && (
                <p className="text-xs text-green-600">
                  回転商品: {stats.rotation_90_count}件
                </p>
              )}
              {stats.investment_10_count !== undefined && (
                <p className="text-xs text-purple-600">
                  投資商品: {stats.investment_10_count}件
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
