'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { InventoryProduct } from '@/types/inventory'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Search } from 'lucide-react'

interface SkuGroup {
  sku: string
  product_name: string
  images: string[]
  total_quantity: number
  total_listing_quantity: number
  total_selling_value: number
  marketplaces: {
    ebay_mjt: number
    ebay_green: number
    mercari: number
    manual: number
  }
  condition_name: string | null
  category: string | null
  product_type: string | null
}

interface InventoryMasterTabProps {
  onRefresh?: () => void
}

export function InventoryMasterTab({ onRefresh }: InventoryMasterTabProps) {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [skuGroups, setSkuGroups] = useState<SkuGroup[]>([])
  const [filteredGroups, setFilteredGroups] = useState<SkuGroup[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadInventoryMaster()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = skuGroups.filter(group =>
        group.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredGroups(filtered)
    } else {
      setFilteredGroups(skuGroups)
    }
  }, [searchQuery, skuGroups])

  const loadInventoryMaster = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('inventory_master')
        .select('*')
        .order('sku', { ascending: true })

      if (error) throw error

      // SKUごとにグループ化
      const groupedBySku = new Map<string, SkuGroup>()

      data?.forEach((product: any) => {
        const sku = product.sku
        if (!sku) return

        const existing = groupedBySku.get(sku)
        const marketplace = product.marketplace || 'manual'
        const account = product.account || product.source_data?.ebay_account || 'unknown'
        const quantity = product.physical_quantity || 0
        const listingQty = product.listing_quantity || 0
        const sellingPrice = product.selling_price || 0

        if (existing) {
          // 既存SKUに追加
          existing.total_quantity += quantity
          existing.total_listing_quantity += listingQty
          existing.total_selling_value += sellingPrice * listingQty

          // マーケットプレイス別カウント
          if (marketplace === 'ebay') {
            if (account.toUpperCase() === 'MJT') {
              existing.marketplaces.ebay_mjt += listingQty
            } else if (account.toUpperCase() === 'GREEN') {
              existing.marketplaces.ebay_green += listingQty
            }
          } else if (marketplace === 'mercari') {
            existing.marketplaces.mercari += listingQty
          } else {
            existing.marketplaces.manual += listingQty
          }
        } else {
          // 新規SKU
          const newGroup: SkuGroup = {
            sku,
            product_name: product.product_name || '',
            images: product.images || [],
            total_quantity: quantity,
            total_listing_quantity: listingQty,
            total_selling_value: sellingPrice * listingQty,
            marketplaces: {
              ebay_mjt: 0,
              ebay_green: 0,
              mercari: 0,
              manual: 0
            },
            condition_name: product.condition_name,
            category: product.category,
            product_type: product.product_type
          }

          // マーケットプレイス別カウント
          if (marketplace === 'ebay') {
            if (account.toUpperCase() === 'MJT') {
              newGroup.marketplaces.ebay_mjt = listingQty
            } else if (account.toUpperCase() === 'GREEN') {
              newGroup.marketplaces.ebay_green = listingQty
            }
          } else if (marketplace === 'mercari') {
            newGroup.marketplaces.mercari = listingQty
          } else {
            newGroup.marketplaces.manual = listingQty
          }

          groupedBySku.set(sku, newGroup)
        }
      })

      const groups = Array.from(groupedBySku.values())
        .sort((a, b) => b.total_selling_value - a.total_selling_value)

      setSkuGroups(groups)
      setFilteredGroups(groups)
    } catch (error: any) {
      console.error('在庫マスター取得エラー:', error)
      alert(`データ取得エラー: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'SKU',
      '商品名',
      '在庫数',
      '出品数',
      '出品総額($)',
      'eBay MJT',
      'eBay GREEN',
      'メルカリ',
      '手動',
      '商品状態',
      'カテゴリ',
      '商品タイプ'
    ]

    const rows = filteredGroups.map(group => [
      group.sku,
      group.product_name,
      group.total_quantity,
      group.total_listing_quantity,
      group.total_selling_value.toFixed(2),
      group.marketplaces.ebay_mjt,
      group.marketplaces.ebay_green,
      group.marketplaces.mercari,
      group.marketplaces.manual,
      group.condition_name || '',
      group.category || '',
      group.product_type || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inventory_master_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
        <p className="text-slate-600">在庫マスターを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              <i className="fas fa-database mr-2 text-blue-600"></i>
              在庫マスター（SKU統合ビュー）
            </h2>
            <p className="text-sm text-slate-600">
              全マーケットプレイスのSKUを統合表示。同じSKUの在庫を一元管理できます。
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadInventoryMaster}
              variant="outline"
              size="sm"
            >
              <i className="fas fa-sync mr-2"></i>
              更新
            </Button>
            <Button
              onClick={exportToCSV}
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV出力
            </Button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SKUまたは商品名で検索..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-slate-600 mb-1">総SKU数</p>
          <p className="text-2xl font-bold text-slate-900">{filteredGroups.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-slate-600 mb-1">総在庫数</p>
          <p className="text-2xl font-bold text-slate-900">
            {filteredGroups.reduce((sum, g) => sum + g.total_quantity, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-sm text-slate-600 mb-1">総出品数</p>
          <p className="text-2xl font-bold text-slate-900">
            {filteredGroups.reduce((sum, g) => sum + g.total_listing_quantity, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
          <p className="text-sm text-slate-600 mb-1">出品総額</p>
          <p className="text-2xl font-bold text-slate-900">
            ${filteredGroups.reduce((sum, g) => sum + g.total_selling_value, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">画像</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">商品名</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">在庫数</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">出品数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">出品総額</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">🔵 MJT</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">🟢 GREEN</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">🔴 メルカリ</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">✏️ 手動</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">商品状態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGroups.map((group) => {
                const imageUrl = Array.isArray(group.images) && group.images.length > 0
                  ? group.images[0]
                  : 'https://placehold.co/80x80/e2e8f0/64748b?text=No+Image'

                return (
                  <tr key={group.sku} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <img
                        src={imageUrl}
                        alt={group.product_name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=No+Image'
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-medium text-slate-900">
                        {group.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-900 line-clamp-2 max-w-xs">
                        {group.product_name}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="outline"
                        className={
                          group.total_quantity === 0
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : group.total_quantity < 5
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }
                      >
                        {group.total_quantity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-slate-900">
                        {group.total_listing_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-green-600">
                        ${group.total_selling_value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.marketplaces.ebay_mjt > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          {group.marketplaces.ebay_mjt}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.marketplaces.ebay_green > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                          {group.marketplaces.ebay_green}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.marketplaces.mercari > 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                          {group.marketplaces.mercari}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {group.marketplaces.manual > 0 && (
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                          {group.marketplaces.manual}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          !group.condition_name
                            ? 'bg-slate-100 text-slate-500'
                            : group.condition_name.toLowerCase() === 'new'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {group.condition_name || '不明'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <i className="fas fa-inbox text-4xl mb-4"></i>
            <p>在庫が見つかりません</p>
          </div>
        )}
      </div>
    </div>
  )
}
