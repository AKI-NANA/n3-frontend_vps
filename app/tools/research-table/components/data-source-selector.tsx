// app/tools/research-table/components/data-source-selector.tsx
'use client'

import { useState } from 'react'
import { Database, Globe, ShoppingCart, Search } from 'lucide-react'
import type { ResearchFilters } from '../types/research'

interface DataSourceSelectorProps {
  onFetch: (filters?: ResearchFilters) => void
  filters: ResearchFilters
  onFiltersChange: (filters: ResearchFilters) => void
}

export function DataSourceSelector({
  onFetch,
  filters,
  onFiltersChange
}: DataSourceSelectorProps) {
  const [keyword, setKeyword] = useState('')

  const sources = [
    { id: 'all', label: '全て', icon: Database },
    { id: 'ebay_sold', label: 'eBay販売', icon: Globe },
    { id: 'ebay_seller', label: 'eBayセラー', icon: ShoppingCart },
    { id: 'amazon', label: 'Amazon', icon: ShoppingCart },
    { id: 'yahoo_auction', label: 'ヤフオク', icon: ShoppingCart },
  ]

  const handleSourceChange = (sourceId: string) => {
    const newFilters = {
      ...filters,
      source: sourceId === 'all' ? undefined : [sourceId]
    }
    onFiltersChange(newFilters)
    onFetch(newFilters)
  }

  const handleSearch = () => {
    const newFilters = {
      ...filters,
      keyword: keyword || undefined
    }
    onFiltersChange(newFilters)
    onFetch(newFilters)
  }

  return (
    <div className="flex items-center gap-3 mb-3">
      {/* ソース選択 */}
      <div className="flex items-center gap-1 bg-white rounded-lg border px-2 py-1">
        <span className="text-[10px] text-gray-500 mr-2">ソース:</span>
        {sources.map(source => {
          const Icon = source.icon
          const isActive = source.id === 'all'
            ? !filters.source || filters.source.length === 0
            : filters.source?.includes(source.id)

          return (
            <button
              key={source.id}
              onClick={() => handleSourceChange(source.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={12} />
              {source.label}
            </button>
          )
        })}
      </div>

      {/* キーワード検索 */}
      <div className="flex items-center gap-1 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="キーワードで検索..."
            className="w-full pl-8 pr-3 py-1.5 text-[11px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-medium hover:bg-indigo-700"
        >
          検索
        </button>
      </div>
    </div>
  )
}
