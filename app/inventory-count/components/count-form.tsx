'use client'

import { useState, useRef } from 'react'

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

interface CountFormProps {
  product: Product
  onComplete: (result: any) => void
  onCancel: () => void
}

export function CountForm({ product, onComplete, onCancel }: CountFormProps) {
  const [quantity, setQuantity] = useState<number>(product.current_quantity)
  const [location, setLocation] = useState(product.storage_location || '')
  const [notes, setNotes] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 画像アップロード
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploading(true)
    setError('')
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('inventory_master_id', product.id)
        
        const res = await fetch('/api/inventory-count/upload', {
          method: 'POST',
          body: formData
        })
        
        const data = await res.json()
        
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'アップロードに失敗しました')
        }
        
        setImages(prev => [...prev, data.data.url])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  // 画像削除
  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }
  
  // 送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      const res = await fetch('/api/inventory-count/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory_master_id: product.id,
          counted_quantity: quantity,
          location: location || null,
          images,
          notes: notes || null
        })
      })
      
      const data = await res.json()
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || '保存に失敗しました')
      }
      
      onComplete(data.data)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }
  
  // 数量調整
  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.max(0, prev + delta))
  }
  
  // 差分表示
  const quantityDiff = quantity - product.current_quantity
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {product.sku}
            </span>
            <h2 className="mt-2 text-lg font-medium text-gray-800 line-clamp-2">
              {product.product_name || '（商品名なし）'}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span>登録在庫: {product.current_quantity}個</span>
              {product.condition && <span>状態: {product.condition}</span>}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* フォーム */}
      <form onSubmit={handleSubmit} className="p-4 space-y-5">
        {/* 在庫数入力 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            実際の在庫数 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => adjustQuantity(-1)}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl font-bold text-gray-600 transition-colors"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
              min={0}
              className="flex-1 text-center text-3xl font-bold py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => adjustQuantity(1)}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg text-2xl font-bold text-gray-600 transition-colors"
            >
              ＋
            </button>
          </div>
          
          {/* 差分表示 */}
          {quantityDiff !== 0 && (
            <div className={`mt-2 text-center text-sm font-medium ${
              quantityDiff > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {quantityDiff > 0 ? '+' : ''}{quantityDiff} 個の差異
            </div>
          )}
        </div>
        
        {/* 保管場所 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            保管場所
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例: A-1-3, B棚上段"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* 写真撮影 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            写真
          </label>
          
          {/* アップロード済み画像 */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img 
                    src={url} 
                    alt={`アップロード ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* アップロードボタン */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 w-full justify-center disabled:opacity-50"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                アップロード中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                写真を撮影・選択
              </>
            )}
          </button>
        </div>
        
        {/* メモ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メモ（任意）
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="破損、差異の理由など"
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
        
        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* 送信ボタン */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '保存中...' : '棚卸しを記録'}
          </button>
        </div>
      </form>
    </div>
  )
}
