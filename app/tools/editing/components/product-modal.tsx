// app/tools/editing/components/product-modal.tsx
/**
 * ProductModal - 高速化版
 * 
 * 高速化ポイント:
 * 1. Prefetchデータを信頼（二重API呼び出し削除）
 * 2. React.memo でメモ化
 * 3. 初期表示を即座に行い、詳細は非同期更新
 */

'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import { FullFeaturedModal } from '@/components/product-modal/full-featured-modal'
import { productApi } from '../services/product-api'
import type { Product, ProductUpdate } from '../types/product'

interface ProductModalProps {
  product: Product
  onClose: () => void
  onSave: (updates: ProductUpdate) => void
  onRefresh?: () => void
}

export const ProductModal = memo(function ProductModal({ 
  product, 
  onClose, 
  onSave,
  onRefresh
}: ProductModalProps) {
  // propsのproductをそのまま使用（Prefetch済みデータを信頼）
  const [currentProduct, setCurrentProduct] = useState<Product>(product)

  // productが変わったら更新（ただしAPI呼び出しなし）
  useEffect(() => {
    setCurrentProduct(product)
  }, [product])

  // 保存ハンドラー（services経由）
  const handleSave = useCallback(async (updates: ProductUpdate) => {
    try {
      // 不正なカラムを除外
      const { product_id, marketplace, ...cleanUpdates } = updates as any
      
      // services経由でAPI呼び出し
      await productApi.updateProduct(String(currentProduct.id), cleanUpdates)
      
      // 親に通知
      onSave(cleanUpdates)
      
      // イベント発行
      window.dispatchEvent(new CustomEvent('product-updated', { 
        detail: { productId: currentProduct.id } 
      }))
    } catch (error: any) {
      console.error('❌ 保存エラー:', error)
    }
  }, [currentProduct.id, onSave])

  // リフレッシュハンドラー
  const handleRefresh = useCallback(async () => {
    try {
      // 最新データを取得（getProductDetail を使用）
      const result = await productApi.getProductDetail(String(currentProduct.id))
      if (result.success && result.data) {
        setCurrentProduct(result.data)
      }
      // 親に通知
      onRefresh?.()
    } catch (error: any) {
      console.error('❌ リフレッシュエラー:', error)
    }
  }, [currentProduct.id, onRefresh])

  // ローディング表示なし（即座に表示）
  return (
    <FullFeaturedModal
      isOpen={true}
      onClose={onClose}
      product={currentProduct as any}
      onSave={handleSave}
      onRefresh={handleRefresh}
    />
  )
})
