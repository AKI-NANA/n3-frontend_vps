'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ProductSearch } from './components/product-search'
import { CountForm } from './components/count-form'
import { CompletedList } from './components/completed-list'

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

interface CompletedItem {
  id: string
  sku: string
  product_name: string
  previous_quantity: number
  new_quantity: number
  location: string | null
  counted_at: string
}

export default function InventoryCountPage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [completedItems, setCompletedItems] = useState<CompletedItem[]>([])
  const [view, setView] = useState<'search' | 'count' | 'completed'>('search')
  const [userName, setUserName] = useState<string>('')
  
  // セッション情報を取得（表示用）
  useEffect(() => {
    // Cookieからユーザー名は取れないので、APIで確認するか、
    // または後で表示される名前を使用する
    // ここではlocalStorageに保存する方法を使用
    const storedName = localStorage.getItem('inventory_count_name')
    if (storedName) {
      setUserName(storedName)
    }
  }, [])
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setView('count')
  }
  
  const handleCountComplete = useCallback((result: any) => {
    const newItem: CompletedItem = {
      id: result.sku,
      sku: result.sku,
      product_name: result.product_name,
      previous_quantity: result.previous_quantity,
      new_quantity: result.new_quantity,
      location: result.location,
      counted_at: result.counted_at
    }
    
    setCompletedItems(prev => [newItem, ...prev])
    setSelectedProduct(null)
    setView('search')
    
    // ユーザー名を保存
    if (result.counted_by) {
      localStorage.setItem('inventory_count_name', result.counted_by)
      setUserName(result.counted_by)
    }
  }, [])
  
  const handleLogout = async () => {
    try {
      await fetch('/api/inventory-count/auth', { method: 'DELETE' })
      localStorage.removeItem('inventory_count_name')
      router.push('/inventory-count/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">棚卸しツール</h1>
                {userName && (
                  <p className="text-xs text-gray-500">担当: {userName}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* 完了件数バッジ */}
              {completedItems.length > 0 && (
                <button
                  onClick={() => setView('completed')}
                  className="relative px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  完了 {completedItems.length}件
                </button>
              )}
              
              {/* ログアウト */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title="ログアウト"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* ナビゲーションタブ */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setView('search'); setSelectedProduct(null); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'search' || view === 'count'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            商品を探す
          </button>
          <button
            onClick={() => setView('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            完了リスト ({completedItems.length})
          </button>
        </div>
        
        {/* ビュー切り替え */}
        {view === 'search' && (
          <ProductSearch onSelect={handleProductSelect} />
        )}
        
        {view === 'count' && selectedProduct && (
          <CountForm 
            product={selectedProduct} 
            onComplete={handleCountComplete}
            onCancel={() => { setSelectedProduct(null); setView('search'); }}
          />
        )}
        
        {view === 'completed' && (
          <CompletedList 
            items={completedItems} 
            onBack={() => setView('search')}
          />
        )}
      </main>
    </div>
  )
}
