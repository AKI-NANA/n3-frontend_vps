'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from '@/lib/utils'

interface Product {
  id: string
  sku: string
  product_name: string
  current_quantity: number
  storage_location: string | null
  last_counted_at: string | null
  counted_by: string | null
  images: string[] | null
  product_type: string | null
  condition: string | null
}

interface ProductSearchProps {
  onSelect: (product: Product) => void
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [uncountedOnly, setUncountedOnly] = useState(false)
  
  // 検索実行
  const fetchProducts = useCallback(async (searchTerm: string, pageNum: number, uncounted: boolean) => {
    setLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        page: pageNum.toString(),
        limit: '20',
        uncounted_only: uncounted.toString()
      })
      
      const res = await fetch(`/api/inventory-count/products?${params}`)
      const data = await res.json()
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || '検索に失敗しました')
      }
      
      setProducts(data.data)
      setTotalPages(data.pagination.totalPages)
      setTotal(data.pagination.total)
      
    } catch (err: any) {
      setError(err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])
  
  // デバウンス付き検索
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string, uncounted: boolean) => {
      setPage(1)
      fetchProducts(term, 1, uncounted)
    }, 300),
    [fetchProducts]
  )
  
  // 初回読み込み
  useEffect(() => {
    fetchProducts('', 1, false)
  }, [fetchProducts])
  
  // 検索ワード変更時
  useEffect(() => {
    debouncedSearch(search, uncountedOnly)
  }, [search, uncountedOnly, debouncedSearch])
  
  // ページ変更時
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchProducts(search, newPage, uncountedOnly)
  }
  
  // 日付フォーマット
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '未実施'
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
  }
  
  return (
    <div className="space-y-4">
      {/* 検索バー */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SKU または 商品名で検索..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            autoFocus
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* フィルター */}
        <div className="flex items-center justify-between mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uncountedOnly}
              onChange={(e) => setUncountedOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">未棚卸しのみ表示</span>
          </label>
          
          <span className="text-sm text-gray-500">
            {total}件中 {products.length}件表示
          </span>
        </div>
      </div>
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* ローディング */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
      
      {/* 商品リスト */}
      {!loading && products.length > 0 && (
        <div className="space-y-2">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelect(product)}
              className="w-full bg-white rounded-lg shadow-sm p-4 text-left hover:bg-blue-50 hover:border-blue-300 border border-transparent transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {product.sku}
                    </span>
                    {!product.last_counted_at && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                        未棚卸し
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 font-medium line-clamp-2">
                    {product.product_name || '（商品名なし）'}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>在庫: {product.current_quantity}個</span>
                    {product.storage_location && (
                      <span>📍 {product.storage_location}</span>
                    )}
                    <span>最終: {formatDate(product.last_counted_at)}</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* 検索結果なし */}
      {!loading && products.length === 0 && search && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>「{search}」に一致する商品が見つかりません</p>
        </div>
      )}
      
      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前へ
          </button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  )
}
