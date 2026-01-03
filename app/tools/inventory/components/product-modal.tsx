// app/tools/editing/components/product-modal.tsx
// V8.3 - FullFeaturedModal V8.3対応
'use client'

import { FullFeaturedModal } from '@/components/product-modal/full-featured-modal'
import type { Product, ProductUpdate } from '../types/product'

interface ProductModalProps {
  product: Product
  onClose: () => void
  onSave: (updates: ProductUpdate) => void
}

export function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  // 保存ハンドラー（Supabaseに保存）
  const handleSave = async (updates: ProductUpdate) => {
    try {
      const response = await fetch('/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          updates
        })
      })
      
      if (!response.ok) {
        console.error('❌ 保存APIエラー:', await response.text())
        return
      }
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ 保存成功:', result)
        onSave(updates)
        window.dispatchEvent(new CustomEvent('product-updated', { 
          detail: { productId: product.id } 
        }))
      }
    } catch (error: any) {
      console.error('❌ 保存エラー:', error)
    }
  }
  
  return (
    <FullFeaturedModal
      isOpen={true}
      onClose={onClose}
      product={product as any}
      onSave={handleSave}
    />
  )
}
