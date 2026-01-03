'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { InventoryProduct } from '@/types/inventory'
import { Button } from '@/components/ui/button'
// ✅ 既存の計算エンジンをラップした新しいユーティリティを使用
import {
  calculateSetProductPrice,
  VariationProduct,
  SetProductCalculationResult
} from '@/lib/ebay-pricing/variation-set-calculator'
import { X, Layers, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react'

interface SetProductModalProps {
  selectedProducts: InventoryProduct[]
  onClose: () => void
  onSuccess: (setProductId: string) => void
}

interface ComponentQuantity {
  productId: string
  quantity: number
}

export function SetProductModal({
  selectedProducts,
  onClose,
  onSuccess
}: SetProductModalProps) {
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    product_name: '',
    sku: '',
    selling_price: 0
  })

  const [componentQuantities, setComponentQuantities] = useState<ComponentQuantity[]>([])
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState('')
  const [calculationResult, setCalculationResult] = useState<SetProductCalculationResult | null>(null)

  useEffect(() => {
    // 初期化: 各商品の数量を1に設定
    setComponentQuantities(
      selectedProducts.map(p => ({
        productId: p.id,
        quantity: 1
      }))
    )

    // 自動的にセット商品名を生成（英語化: SET: プレフィックス）
    if (selectedProducts.length > 0) {
      const names = selectedProducts.map(p => p.product_name).join(' + ')
      setFormData(prev => ({
        ...prev,
        product_name: `SET: ${names.substring(0, 100)}`,  // ✅ P0-7: 英語化
        sku: `SET-${Date.now()}`
      }))
    }
  }, [selectedProducts])

  // ✅ 価格自動計算（既存エンジン使用）
  useEffect(() => {
    if (componentQuantities.length > 0 && selectedProducts.length > 0) {
      calculateRecommendedPrice()
    }
  }, [componentQuantities, selectedProducts])

  const calculateRecommendedPrice = async () => {
    if (componentQuantities.length === 0) return

    try {
      setCalculating(true)
      console.log('🧮 セット商品価格計算開始（既存エンジン使用）...')

      // InventoryProduct を VariationProduct 形式に変換
      const components = componentQuantities.map(cq => {
        const product = selectedProducts.find(p => p.id === cq.productId)
        if (!product) return null

        const variationProduct: VariationProduct = {
          id: product.id,
          sku: product.sku || `SKU-${product.id}`,
          product_name: product.product_name,
          cost_price: product.cost_price || 0,
          weight_g: product.weight_g || 500,
          hts_code: product.hts_code || '9503.00.00',
          origin_country: product.origin_country || 'JP',
          category: product.category
        }

        return {
          product: variationProduct,
          quantity: cq.quantity
        }
      }).filter(Boolean) as Array<{ product: VariationProduct, quantity: number }>

      // ✅ 既存の計算エンジンを使用
      const result = await calculateSetProductPrice(components, 0.20) // 20%マージン
      setCalculationResult(result)

      if (result.success && result.recommendedTotal > 0) {
        // 推奨価格を自動設定
        setFormData(prev => ({
          ...prev,
          selling_price: Math.ceil(result.recommendedTotal)
        }))
        console.log(`✅ 推奨価格計算完了: $${result.recommendedTotal.toFixed(2)}`)
      } else {
        console.warn('⚠️ 価格計算失敗、フォールバック使用')
        // フォールバック: 原価の1.5倍
        const fallbackPrice = Math.ceil(calculateTotalCost() * 1.5)
        setFormData(prev => ({
          ...prev,
          selling_price: fallbackPrice
        }))
      }
    } catch (err: any) {
      console.error('価格計算エラー:', err)
      // フォールバック
      const fallbackPrice = Math.ceil(calculateTotalCost() * 1.5)
      setFormData(prev => ({
        ...prev,
        selling_price: fallbackPrice
      }))
    } finally {
      setCalculating(false)
    }
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setComponentQuantities(prev =>
      prev.map(cq =>
        cq.productId === productId ? { ...cq, quantity: Math.max(1, quantity) } : cq
      )
    )
  }

  // 原価計算（構成商品の合計）
  const calculateTotalCost = () => {
    return selectedProducts.reduce((sum, product) => {
      const qty = componentQuantities.find(cq => cq.productId === product.id)?.quantity || 1
      return sum + (product.cost_price * qty)
    }, 0)
  }

  // 作成可能なセット数を計算
  const calculateAvailableSets = () => {
    let minSets = Infinity

    selectedProducts.forEach(product => {
      const qty = componentQuantities.find(cq => cq.productId === product.id)?.quantity || 1
      const possibleSets = Math.floor(product.physical_quantity / qty)
      minSets = Math.min(minSets, possibleSets)
    })

    return minSets === Infinity ? 0 : minSets
  }

  const availableSets = calculateAvailableSets()
  const totalCost = calculateTotalCost()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // バリデーション
      if (!formData.product_name.trim()) {
        throw new Error('セット商品名を入力してください')
      }
      if (formData.selling_price <= 0) {
        throw new Error('販売価格を入力してください')
      }
      if (availableSets === 0) {
        throw new Error('在庫不足によりセット商品を作成できません')
      }

      // 利益率チェック
      const profitMargin = ((formData.selling_price - totalCost) / formData.selling_price) * 100
      if (profitMargin < 10) {
        if (!confirm(`⚠️ 警告: 利益率が${profitMargin.toFixed(1)}%と低くなっています。\n赤字リスクがあります。続行しますか？`)) {
          setLoading(false)
          return
        }
      }

      // セット商品を作成
      const setProductData = {
        unique_id: `SET-${Date.now()}`,
        product_name: formData.product_name,
        sku: formData.sku || null,
        product_type: 'set',
        cost_price: totalCost,
        selling_price: formData.selling_price,
        physical_quantity: 0, // セット商品の在庫は自動計算される
        listing_quantity: 0,
        condition_name: 'new', // セット商品は新品扱い
        category: selectedProducts[0]?.category || 'Electronics',
        images: selectedProducts[0]?.images || [],
        is_manual_entry: true,
        notes: `構成商品: ${selectedProducts.map(p => p.product_name).join(', ')}`,
        // DDP計算結果を保存
        ddp_total: calculationResult?.ddpTotal || 0,
        tariff_rate: calculationResult?.tariffRate || 0
      }

      const { data: setProduct, error: insertError } = await supabase
        .from('inventory_master')
        .insert(setProductData)
        .select()
        .single()

      if (insertError) throw insertError

      // セット構成を登録
      const componentInserts = componentQuantities.map(cq => ({
        set_product_id: setProduct.id,
        component_product_id: cq.productId,
        quantity_required: cq.quantity
      }))

      const { error: componentsError } = await supabase
        .from('set_components')
        .insert(componentInserts)

      if (componentsError) throw componentsError

      // P4-D: 構成商品の個別出品をブロック
      const blockListingPromises = componentQuantities.map(cq =>
        supabase
          .from('inventory_master')
          .update({ is_individual_listing_blocked: true })
          .eq('id', cq.productId)
      )

      const blockResults = await Promise.all(blockListingPromises)
      const blockErrors = blockResults.filter(r => r.error)

      if (blockErrors.length > 0) {
        console.warn('⚠️ 一部の構成商品のブロックに失敗しました:', blockErrors)
      } else {
        console.log(`✅ セット構成商品 ${componentQuantities.length}個の個別出品をブロックしました`)
      }

      onSuccess(setProduct.id)
    } catch (err: any) {
      console.error('Create set error:', err)
      setError(err.message || 'セット商品の作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー - グラデーションデザイン */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-2 text-white">
            <Layers className="h-6 w-6" />
            <h2 className="text-xl font-bold">セット商品作成</h2>
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

          {/* 計算エンジン情報 */}
          {calculationResult && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                ✅ 既存計算エンジン使用 | 
                関税率: {calculationResult.tariffRate?.toFixed(1) || '?'}% | 
                DDP: ${calculationResult.ddpTotal?.toFixed(2) || '?'} | 
                推奨利益率: {calculationResult.profitMargin?.toFixed(1) || '?'}%
              </p>
            </div>
          )}

          {/* 在庫アラート */}
          {availableSets === 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center text-red-800 mb-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="font-semibold">在庫不足</span>
              </div>
              <p className="text-sm text-red-700">
                構成商品の在庫が不足しているため、セット商品を作成できません。
              </p>
            </div>
          )}

          {/* セット情報 */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-amber-700 mb-1">構成商品数</p>
                <p className="text-2xl font-bold text-amber-900">{selectedProducts.length}</p>
              </div>
              <div>
                <p className="text-sm text-amber-700 mb-1">作成可能セット数</p>
                <p className={`text-2xl font-bold ${availableSets > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {availableSets}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700 mb-1">原価合計</p>
                <p className="text-2xl font-bold text-amber-900">${totalCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-amber-700 mb-1">推奨販売価格</p>
                <p className="text-2xl font-bold text-green-600">
                  {calculating ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    `$${calculationResult?.recommendedTotal?.toFixed(2) || '---'}`
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 構成商品リスト */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">
              構成商品 ({selectedProducts.length}個)
            </h3>

            <div className="space-y-3">
              {selectedProducts.map((product, index) => {
                const qty = componentQuantities.find(cq => cq.productId === product.id)?.quantity || 1
                const possibleSets = Math.floor(product.physical_quantity / qty)

                return (
                  <div key={product.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {/* 画像 */}
                      <div className="w-16 h-16 flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.product_name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center">
                            <i className="fas fa-image text-slate-300"></i>
                          </div>
                        )}
                      </div>

                      {/* 商品情報 */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">
                          {product.product_name}
                        </h4>
                        <div className="flex gap-3 mt-1 text-sm text-slate-600">
                          <span>原価: ${product.cost_price?.toFixed(2) || '0.00'}</span>
                          <span>在庫: {product.physical_quantity || 0}個</span>
                          {product.sku && <span className="font-mono">SKU: {product.sku}</span>}
                        </div>
                      </div>

                      {/* 数量設定 */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                          必要数:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-slate-500">
                          → <span className={possibleSets > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {possibleSets}セット可
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* セット商品設定 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">
              セット商品設定
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                セット商品名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: SET: Apple Complete Bundle (iPhone + AirPods + Watch)"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                ✅ 英語で「SET:」プレフィックスを使用してください
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="自動生成されます"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  販売価格 (USD) <span className="text-red-500">*</span>
                  {calculating && <i className="fas fa-spinner fa-spin ml-2 text-blue-500"></i>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.selling_price}
                  onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
                {calculationResult?.success && (
                  <p className="text-xs text-green-600 mt-1">
                    💡 推奨価格: ${calculationResult.recommendedTotal.toFixed(2)} (利益率{calculationResult.profitMargin.toFixed(1)}%)
                  </p>
                )}
              </div>
            </div>

            {/* 利益計算 */}
            {formData.selling_price > 0 && totalCost > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">原価合計:</span>
                    <span className="ml-2 font-bold text-blue-900">${totalCost.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">DDP費用:</span>
                    <span className="ml-2 font-bold text-blue-900">
                      ${calculationResult?.ddpTotal?.toFixed(2) || '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">利益額:</span>
                    <span className="ml-2 font-bold text-blue-900">
                      ${(formData.selling_price - totalCost - (calculationResult?.ddpTotal || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">利益率:</span>
                    <span className={`ml-2 font-bold ${
                      formData.selling_price > totalCost ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(((formData.selling_price - totalCost) / formData.selling_price) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DDP計算ステップ表示 */}
          {calculationResult?.calculationSteps && calculationResult.calculationSteps.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-700 mb-2">📊 計算ステップ</h4>
              <div className="space-y-1 text-sm">
                {calculationResult.calculationSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-mono">
                      {step.step}
                    </span>
                    <span className="font-semibold">{step.value}</span>
                    <span className="text-slate-500">{step.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
            <div className="flex items-start gap-2">
              <i className="fas fa-info-circle mt-0.5"></i>
              <div>
                <p className="font-semibold mb-1">セット商品について</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>セット商品の在庫数は構成商品から自動計算されます</li>
                  <li>セット商品を出品する際、構成商品の出品は自動的に停止されます</li>
                  <li>セット商品が販売されると、構成商品の在庫が自動的に減算されます</li>
                  <li>✅ 価格は既存のDDP計算エンジンを使用して自動計算されます</li>
                </ul>
              </div>
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
              disabled={loading || availableSets === 0 || calculating}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  作成中...
                </>
              ) : (
                <>
                  <i className="fas fa-layer-group mr-2"></i>
                  セット商品を作成
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
