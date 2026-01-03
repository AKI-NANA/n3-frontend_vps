/**
 * バリエーション商品作成モーダル
 * 選択した商品をバリエーション（親子関係）として束ねる
 */

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { InventoryProduct } from '@/types/inventory'
import { Button } from '@/components/ui/button'
import { X, GitBranch, AlertCircle, Info } from 'lucide-react'

interface VariationModalProps {
  selectedProducts: InventoryProduct[]
  onClose: () => void
  onSuccess: (parentId: string) => void
}

interface VariationAttribute {
  name: string
  values: { productId: string; value: string }[]
}

export function VariationModal({
  selectedProducts,
  onClose,
  onSuccess
}: VariationModalProps) {
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    parent_name: '',
    parent_sku: ''
  })

  const [attributes, setAttributes] = useState<VariationAttribute[]>([
    { name: 'Color', values: [] },
    { name: 'Size', values: [] }
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // 初期化: 親SKU名を生成
    if (selectedProducts.length > 0) {
      const firstProduct = selectedProducts[0]
      const baseName = firstProduct.product_name.split(' ').slice(0, 5).join(' ')
      
      setFormData({
        parent_name: `${baseName} (${selectedProducts.length} Variations)`,
        parent_sku: `VAR-${Date.now()}`
      })

      // 各商品にバリエーション値を初期設定
      setAttributes([
        {
          name: 'Type',
          values: selectedProducts.map((p, i) => ({
            productId: p.id,
            value: `Variant ${i + 1}`
          }))
        }
      ])
    }
  }, [selectedProducts])

  const addAttribute = () => {
    setAttributes(prev => [
      ...prev,
      {
        name: '',
        values: selectedProducts.map(p => ({ productId: p.id, value: '' }))
      }
    ])
  }

  const removeAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== index))
  }

  const updateAttributeName = (index: number, name: string) => {
    setAttributes(prev =>
      prev.map((attr, i) => (i === index ? { ...attr, name } : attr))
    )
  }

  const updateAttributeValue = (attrIndex: number, productId: string, value: string) => {
    setAttributes(prev =>
      prev.map((attr, i) =>
        i === attrIndex
          ? {
              ...attr,
              values: attr.values.map(v =>
                v.productId === productId ? { ...v, value } : v
              )
            }
          : attr
      )
    )
  }

  // 最小DDPコストを計算
  const calculateMinDDPCost = () => {
    return Math.min(
      ...selectedProducts.map(p => p.selling_price || p.cost_price || 0)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // バリデーション
      if (!formData.parent_name.trim()) {
        throw new Error('親SKU名を入力してください')
      }
      if (selectedProducts.length < 2) {
        throw new Error('バリエーションには2つ以上の商品が必要です')
      }

      // 属性名のチェック
      for (const attr of attributes) {
        if (!attr.name.trim()) {
          throw new Error('バリエーション属性名を入力してください')
        }
      }

      // APIを呼び出してバリエーションを作成
      const response = await fetch('/api/products/create-variation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedItemIds: selectedProducts.map(p => p.id),
          parentSkuName: formData.parent_sku || formData.parent_name,
          attributes: attributes.reduce((acc, attr) => {
            acc[attr.name] = attr.values.reduce((vals, v) => {
              vals[v.productId] = v.value
              return vals
            }, {} as any)
            return acc
          }, {} as any),
          composition: selectedProducts.map((p, i) => ({
            id: p.id,
            name: p.product_name,
            sku: p.sku || '',
            quantity: 1
          }))
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'バリエーション作成に失敗しました')
      }

      console.log('✅ バリエーション作成成功:', result)
      onSuccess(result.parentId)

    } catch (err: any) {
      console.error('バリエーション作成エラー:', err)
      setError(err.message || 'バリエーション作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const minDDPCost = calculateMinDDPCost()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー - グラデーションデザイン */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center z-10 rounded-t-xl">
          <div className="flex items-center gap-2 text-white">
            <GitBranch className="h-6 w-6" />
            <h2 className="text-xl font-bold">バリエーション作成</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* 説明 */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-purple-800">
                <p className="font-semibold mb-1">バリエーションについて</p>
                <ul className="list-disc list-inside space-y-1 text-purple-700">
                  <li>選択した商品を1つのバリエーション商品としてeBayに出品できます</li>
                  <li>最も安い商品の価格がBase Priceとなり、他は送料サーチャージで調整されます</li>
                  <li>バリエーション作成後、子SKUは個別出品できなくなります</li>
                </ul>
              </div>
            </div>
          </div>

          {/* サマリー */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-slate-600 mb-1">子SKU数</p>
                <p className="text-2xl font-bold text-slate-900">{selectedProducts.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Base Price (最小DDP)</p>
                <p className="text-2xl font-bold text-green-600">${minDDPCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">合計在庫</p>
                <p className="text-2xl font-bold text-slate-900">
                  {selectedProducts.reduce((sum, p) => sum + (p.physical_quantity || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          {/* 親SKU設定 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">
              親SKU設定
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  親SKU名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="バリエーション商品名"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  親SKU
                </label>
                <input
                  type="text"
                  value={formData.parent_sku}
                  onChange={(e) => setFormData({ ...formData, parent_sku: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="自動生成されます"
                />
              </div>
            </div>
          </div>

          {/* バリエーション属性 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-semibold text-lg text-slate-900">
                バリエーション属性
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttribute}
              >
                <i className="fas fa-plus mr-2"></i>
                属性追加
              </Button>
            </div>

            {attributes.map((attr, attrIndex) => (
              <div key={attrIndex} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    value={attr.name}
                    onChange={(e) => updateAttributeName(attrIndex, e.target.value)}
                    placeholder="属性名 (例: Color, Size)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  {attributes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttribute(attrIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedProducts.map(product => {
                    const attrValue = attr.values.find(v => v.productId === product.id)?.value || ''
                    
                    return (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center">
                              <i className="fas fa-image text-slate-300 text-xs"></i>
                            </div>
                          )}
                        </div>
                        <span className="flex-1 text-sm text-slate-700 truncate" title={product.product_name}>
                          {product.product_name.substring(0, 40)}...
                        </span>
                        <input
                          type="text"
                          value={attrValue}
                          onChange={(e) => updateAttributeValue(attrIndex, product.id, e.target.value)}
                          placeholder={`${attr.name || '属性'}の値`}
                          className="w-40 px-3 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 子SKU一覧 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">
              子SKU一覧 ({selectedProducts.length}個)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left">商品</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-right">在庫</th>
                    <th className="px-4 py-2 text-right">価格</th>
                    <th className="px-4 py-2 text-right">送料サーチャージ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedProducts.map(product => {
                    const price = product.selling_price || product.cost_price || 0
                    const surcharge = price - minDDPCost
                    
                    return (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt=""
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center">
                                  <i className="fas fa-image text-slate-300"></i>
                                </div>
                              )}
                            </div>
                            <span className="truncate max-w-[200px]" title={product.product_name}>
                              {product.product_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {product.sku || '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {product.physical_quantity || 0}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          ${price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {surcharge > 0 ? (
                            <span className="text-orange-600 font-semibold">
                              +${surcharge.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-green-600">$0.00 (Base)</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedProducts.length < 2}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  作成中...
                </>
              ) : (
                <>
                  <i className="fas fa-object-group mr-2"></i>
                  バリエーションを作成
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
