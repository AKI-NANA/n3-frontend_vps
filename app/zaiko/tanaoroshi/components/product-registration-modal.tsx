import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { InventoryProduct, ProductType, ConditionType } from '@/types/inventory'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Edit, Plus, ExternalLink, BarChart3, AlertCircle, Package } from 'lucide-react'

interface ProductRegistrationModalProps {
  product: InventoryProduct | null
  onClose: () => void
  onSuccess: () => void
}

export function ProductRegistrationModal({
  product,
  onClose,
  onSuccess
}: ProductRegistrationModalProps) {
  const supabase = createClientComponentClient()
  const isEdit = !!product

  // source_dataからマーケットプレイス情報を抽出
  const sourceData = product?.source_data || {}
  const marketplace = sourceData.marketplace || product?.marketplace || 'manual'
  const ebayAccount = sourceData.ebay_account || product?.account || ''
  const ebayItemId = sourceData.ebay_item_id || ''
  const ebayUrl = sourceData.ebay_url || (ebayItemId ? `https://www.ebay.com/itm/${ebayItemId}` : '')
  // Seller Hub の商品編集ページURL
  const sellerHubUrl = ebayItemId ? `https://www.ebay.com/sh/lst/active/listing/${ebayItemId}` : ''

  const [formData, setFormData] = useState<{
    product_name: string
    sku: string
    product_type: ProductType
    cost_price: number | string
    selling_price: number | string
    physical_quantity: number | string
    condition_name: string  // ConditionType から string に変更（eBayの状態に対応）
    category: string
    subcategory: string
    images: string[]
    supplier_url: string
    tracking_id: string
    notes: string
  }>({
    product_name: '',
    sku: '',
    product_type: 'stock',
    cost_price: 0,
    selling_price: 0,
    physical_quantity: 0,
    condition_name: '',  // デフォルトは空文字（nullエラー対策）
    category: '',  // デフォルトは空文字（nullエラー対策）
    subcategory: '',
    images: [],
    supplier_url: '',
    tracking_id: '',
    notes: ''
  })

  const [imageInput, setImageInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || '',
        sku: product.sku || '',
        product_type: product.product_type || 'stock',
        cost_price: product.cost_price || 0,
        selling_price: product.selling_price || 0,
        physical_quantity: product.physical_quantity || 0,
        condition_name: product.condition_name || '',  // null/undefinedは空文字に
        category: product.category || '',  // null/undefinedは空文字に
        subcategory: product.subcategory || '',
        images: product.images || [],
        supplier_url: product.supplier_info?.url || '',
        tracking_id: product.supplier_info?.tracking_id || '',
        notes: product.notes || ''
      })
    }
  }, [product])

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()]
      })
      setImageInput('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // バリデーション
      if (!formData.product_name.trim()) {
        throw new Error('商品名を入力してください')
      }
      const costPrice = typeof formData.cost_price === 'string' ? parseFloat(formData.cost_price) || 0 : formData.cost_price
      const sellingPrice = typeof formData.selling_price === 'string' ? parseFloat(formData.selling_price) || 0 : formData.selling_price
      const physicalQty = typeof formData.physical_quantity === 'string' ? parseInt(formData.physical_quantity) || 0 : formData.physical_quantity

      if (costPrice < 0 || sellingPrice < 0) {
        throw new Error('価格は0以上で入力してください')
      }
      if (physicalQty < 0) {
        throw new Error('在庫数は0以上で入力してください')
      }

      const productData = {
        unique_id: isEdit ? product.unique_id : `ITEM-${Date.now()}`,
        product_name: formData.product_name,
        sku: formData.sku || null,
        product_type: formData.product_type,
        cost_price: typeof formData.cost_price === 'string' ? parseFloat(formData.cost_price) || 0 : formData.cost_price,
        selling_price: typeof formData.selling_price === 'string' ? parseFloat(formData.selling_price) || 0 : formData.selling_price,
        physical_quantity: typeof formData.physical_quantity === 'string' ? parseInt(formData.physical_quantity) || 0 : formData.physical_quantity,
        listing_quantity: product?.listing_quantity || 0,
        condition_name: formData.condition_name || null,
        category: formData.category || null,
        subcategory: formData.subcategory || null,
        images: formData.images,
        supplier_info: {
          url: formData.supplier_url || undefined,
          tracking_id: formData.tracking_id || undefined
        },
        is_manual_entry: marketplace === 'manual',
        notes: formData.notes || null
      }

      if (isEdit) {
        // 更新
        const { error: updateError } = await supabase
          .from('inventory_master')
          .update(productData)
          .eq('id', product.id)

        if (updateError) throw updateError

        // 在庫変更履歴を記録
        if (formData.physical_quantity !== product.physical_quantity) {
          await supabase.from('inventory_changes').insert({
            product_id: product.id,
            change_type: 'manual',
            quantity_before: product.physical_quantity,
            quantity_after: formData.physical_quantity,
            source: 'manual_edit',
            notes: '手動編集による在庫調整'
          })
        }
      } else {
        // 新規作成
        const { data: newProduct, error: insertError } = await supabase
          .from('inventory_master')
          .insert(productData)
          .select()
          .single()

        if (insertError) throw insertError

        // 初回在庫履歴
        if (formData.physical_quantity > 0) {
          await supabase.from('inventory_changes').insert({
            product_id: newProduct.id,
            change_type: 'import',
            quantity_before: 0,
            quantity_after: formData.physical_quantity,
            source: 'manual_registration',
            notes: '新規登録'
          })
        }
      }

      onSuccess()
    } catch (err: any) {
      console.error('Save error:', err)
      setError(err.message || '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // マーケットプレイスバッジ
  const getMarketplaceBadge = () => {
    if (marketplace === 'ebay') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          eBay {ebayAccount?.toUpperCase() || ''}
        </Badge>
      )
    } else if (marketplace === 'mercari') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          メルカリ
        </Badge>
      )
    } else if (marketplace === 'amazon') {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          Amazon
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
        手動登録
      </Badge>
    )
  }

  // SKUに"stock"が含まれる場合の有在庫バッジ
  const hasStockSku = formData.sku?.toLowerCase().includes('stock')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* P5-6: 横長3カラムレイアウト */}
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー - グラデーションデザイン */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center z-10 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              {isEdit ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
              <h2 className="text-xl font-bold">
                {isEdit ? '商品編集' : '新規商品登録'}
              </h2>
            </div>
            {getMarketplaceBadge()}
            {hasStockSku && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <Package className="h-3 w-3 mr-1" />
                有在庫
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* P5-4: eBayリンクセクション */}
        {marketplace === 'ebay' && ebayItemId && (
          <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-indigo-900">eBayリンク:</span>
              {ebayUrl && (
                <a
                  href={ebayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  商品ページ
                </a>
              )}
              {sellerHubUrl && (
                <a
                  href={sellerHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                >
                  <BarChart3 className="h-3 w-3" />
                  Seller Hub
                </a>
              )}
              <span className="text-slate-500">
                Item ID: {ebayItemId}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* P5-6: 3カラムレイアウト */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 左カラム: 基本情報 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">
                基本情報
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  商品名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => handleChange('product_name', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: iPhone 14 Pro Max 256GB"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: APL-IP14PM-256"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  商品タイプ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.product_type || 'stock'}
                  onChange={(e) => handleChange('product_type', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isEdit && product?.product_type === 'set'}
                >
                  <option value="stock">有在庫</option>
                  <option value="dropship">無在庫</option>
                  <option value="hybrid">ハイブリッド</option>
                  {isEdit && product?.product_type === 'set' && (
                    <option value="set">セット商品</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  商品状態
                </label>
                <input
                  type="text"
                  value={formData.condition_name}
                  onChange={(e) => handleChange('condition_name', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: Used, New, Refurbished"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  カテゴリ
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: Electronics, Clothing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  サブカテゴリ
                </label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => handleChange('subcategory', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: Smartphones"
                />
              </div>
            </div>

            {/* 中央カラム: 価格・在庫 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">
                価格・在庫
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  原価 (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost_price || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    handleChange('cost_price', val === '' ? '' : parseFloat(val))
                  }}
                  onBlur={(e) => {
                    const val = e.target.value
                    if (val === '' || isNaN(parseFloat(val))) {
                      handleChange('cost_price', 0)
                    }
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  販売価格 (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.selling_price || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    handleChange('selling_price', val === '' ? '' : parseFloat(val))
                  }}
                  onBlur={(e) => {
                    const val = e.target.value
                    if (val === '' || isNaN(parseFloat(val))) {
                      handleChange('selling_price', 0)
                    }
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  現在庫数
                </label>
                <input
                  type="number"
                  value={formData.physical_quantity || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    handleChange('physical_quantity', val === '' ? '' : parseInt(val))
                  }}
                  onBlur={(e) => {
                    const val = e.target.value
                    if (val === '' || isNaN(parseInt(val))) {
                      handleChange('physical_quantity', 0)
                    }
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 利益計算 */}
              {Number(formData.selling_price) > 0 && Number(formData.cost_price) > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-blue-900">利益率:</span>
                    <span className="text-blue-700">
                      {(((Number(formData.selling_price) - Number(formData.cost_price)) / Number(formData.selling_price)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-900">利益額:</span>
                    <span className="text-blue-700">
                      ${(Number(formData.selling_price) - Number(formData.cost_price)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* 仕入先情報 */}
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 pt-4">
                仕入先情報
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  仕入先URL
                </label>
                <input
                  type="url"
                  value={formData.supplier_url}
                  onChange={(e) => handleChange('supplier_url', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  トラッキングID
                </label>
                <input
                  type="text"
                  value={formData.tracking_id}
                  onChange={(e) => handleChange('tracking_id', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: AMZN-123456"
                />
              </div>
            </div>

            {/* 右カラム: 画像・メモ */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2">
                商品画像
              </h3>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="画像URLを入力..."
                />
                <Button type="button" onClick={handleAddImage} variant="outline" size="sm">
                  追加
                </Button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.jpg'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-400">
                  画像なし
                </div>
              )}

              {/* メモ */}
              <h3 className="font-semibold text-lg text-slate-900 border-b pb-2 pt-4">
                メモ
              </h3>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="商品に関するメモを入力..."
              />

              {/* データソース情報（読み取り専用） */}
              {isEdit && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                  <div className="font-medium mb-2">データソース情報</div>
                  <div className="space-y-1">
                    <div>マーケット: {marketplace}</div>
                    {ebayAccount && <div>アカウント: {ebayAccount.toUpperCase()}</div>}
                    {ebayItemId && <div>Item ID: {ebayItemId}</div>}
                    <div>手動登録: {product?.is_manual_entry ? 'はい' : 'いいえ'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200">
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
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  保存中...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  {isEdit ? '更新' : '登録'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
