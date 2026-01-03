'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, AlertTriangle, Eye, RefreshCw } from 'lucide-react'

interface ApprovalProduct {
  id: number
  sku: string
  title: string
  title_en?: string
  images?: string[]
  primary_image_url?: string
  gallery_images?: string[]
  scraped_data?: { images?: string[] }
  condition?: string
  condition_name?: string
  category_name?: string
  category?: string
  profit_margin_percent?: number
  profit_margin?: number
  ai_confidence_score?: number
  approval_status: string
  listing_price?: number
  ddp_price_usd?: number
  filter_passed?: boolean
  filter_reasons?: string[] | string
  origin_country?: string
  inventory_quantity?: number
  stock_quantity?: number
  source?: string
}

// 不完全なフィールドを検出する関数
function getIncompleteFields(product: ApprovalProduct): string[] {
  const incomplete: string[] = []
  
  if (!product.sku) incomplete.push('SKU')
  if (!product.title && !product.title_en) incomplete.push('商品タイトル')
  if (!product.condition && !product.condition_name) incomplete.push('コンディション')
  if (!product.category_name && !product.category) incomplete.push('カテゴリー')
  
  const hasImages = (product.images && product.images.length > 0) || 
                    (product.gallery_images && product.gallery_images.length > 0) ||
                    product.primary_image_url
  if (!hasImages) incomplete.push('商品画像')
  
  if (!product.ddp_price_usd && product.ddp_price_usd !== 0) incomplete.push('DDP価格')
  if (!product.profit_margin_percent && product.profit_margin_percent !== 0) incomplete.push('利益率')
  if (!product.origin_country) incomplete.push('原産国')
  
  if (product.filter_passed === null || product.filter_passed === undefined) {
    incomplete.push('フィルターチェック未実行')
  }
  
  return incomplete
}

function isDataComplete(product: ApprovalProduct): boolean {
  return getIncompleteFields(product).length === 0
}

// 確認モーダルコンポーネント
function ConfirmApprovalModal({ 
  incompleteProducts, 
  onConfirm, 
  onCancel 
}: { 
  incompleteProducts: Array<{ product: ApprovalProduct; missing: string[] }>, 
  onConfirm: () => void, 
  onCancel: () => void 
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <h2 className="text-xl font-bold text-slate-900">データ不完全な商品の承認確認</h2>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded p-4 mb-4">
            <p className="text-sm text-orange-800 mb-3">
              以下の商品はデータが不完全ですが、承認して出品スケジュールに追加しますか?
            </p>
            <p className="text-xs text-orange-700">
              ※ 不完全な状態で出品すると、リスティングエラーや販売機会の損失につながる可能性があります。
            </p>
          </div>

          <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
            {incompleteProducts.map(({ product, missing }) => (
              <div key={product.id} className="bg-slate-50 rounded p-3 border border-slate-200">
                <div className="font-semibold text-sm mb-2 text-slate-900">
                  {product.sku} - {product.title_en || product.title || '(タイトルなし)'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {missing.map((field) => (
                    <span 
                      key={field} 
                      className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition-colors text-slate-700"
            >
              キャンセル
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors font-semibold"
            >
              不完全なまま承認する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 商品詳細モーダル
function ProductDetailModal({ product, onClose }: { product: ApprovalProduct, onClose: () => void }) {
  const getImageUrl = (product: ApprovalProduct) => {
    if (product.primary_image_url) return product.primary_image_url
    if (product.gallery_images?.[0]) return product.gallery_images[0]
    if (product.images?.[0]) return product.images[0]
    if (product.scraped_data?.images?.[0]) return product.scraped_data.images[0]
    return 'https://via.placeholder.com/300x300/e2e8f0/64748b?text=No+Image'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">商品詳細</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={getImageUrl(product)}
                alt={product.title_en || product.title}
                className="w-full aspect-square object-cover rounded-lg border border-slate-200"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">SKU</p>
                <p className="font-bold text-lg">{product.sku}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-500">商品名</p>
                <p className="font-semibold">{product.title_en || product.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">カテゴリー</p>
                  <p className="font-semibold">{product.category_name || product.category || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">コンディション</p>
                  <p className="font-semibold">{product.condition || product.condition_name || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">DDP価格</p>
                  <p className="font-semibold text-lg">${product.ddp_price_usd?.toFixed(2) || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">利益率</p>
                  <p className={`font-semibold text-lg ${(product.profit_margin_percent || 0) >= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                    {product.profit_margin_percent?.toFixed(1) || '-'}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">原産国</p>
                  <p className="font-semibold">{product.origin_country || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">AIスコア</p>
                  <p className="font-semibold">{product.ai_confidence_score || 0}</p>
                </div>
              </div>
              
              {product.filter_passed !== undefined && (
                <div className="p-3 rounded-lg border border-slate-200">
                  {product.filter_passed ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">フィルター通過</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">フィルター不合格</span>
                      </div>
                      {product.filter_reasons && (
                        <p className="text-sm text-slate-600">
                          理由: {Array.isArray(product.filter_reasons) ? product.filter_reasons.join(', ') : product.filter_reasons}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 商品カードコンポーネント（グリッド表示用）
function ProductCard({ 
  product, 
  isSelected, 
  onToggleSelect, 
  onOpenModal, 
  isComplete 
}: { 
  product: ApprovalProduct
  isSelected: boolean
  onToggleSelect: () => void
  onOpenModal: () => void
  isComplete: boolean
}) {
  const getImageUrl = (product: ApprovalProduct) => {
    if (product.primary_image_url) return product.primary_image_url
    if (product.gallery_images?.[0]) return product.gallery_images[0]
    if (product.images?.[0]) return product.images[0]
    if (product.scraped_data?.images?.[0]) return product.scraped_data.images[0]
    return 'https://via.placeholder.com/300x300/e2e8f0/64748b?text=No+Image'
  }

  const stockType = (product.inventory_quantity || product.stock_quantity || 0) > 0 ? '有' : '無'
  const score = product.ai_confidence_score || 0
  const profitMargin = product.profit_margin_percent || product.profit_margin || 0

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500/70'
    if (score >= 70) return 'bg-teal-500/70'
    if (score >= 55) return 'bg-amber-400/70'
    if (score >= 40) return 'bg-orange-400/70'
    return 'bg-rose-400/70'
  }

  return (
    <div
      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all group ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-slate-300'
      } ${!isComplete ? 'opacity-60' : ''}`}
      onClick={onToggleSelect}
    >
      {/* 不完全バッジ */}
      {!isComplete && (
        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded z-10 shadow-lg">
          不完全
        </div>
      )}
      
      {/* フィルター停止バッジ */}
      {product.filter_passed === false && (
        <div className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded z-10 shadow-lg">
          フィルター停止
        </div>
      )}

      {/* 画像 */}
      <img
        src={getImageUrl(product)}
        alt={product.title_en || product.title}
        className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm"
      />

      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

      {/* 詳細ボタン */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onOpenModal()
        }}
        className="absolute bottom-1.5 right-1.5 px-2 py-1 bg-blue-600 text-white text-[10px] font-semibold rounded hover:bg-blue-700 transition-all z-10 shadow-lg"
      >
        詳細
      </button>

      {/* 情報オーバーレイ */}
      <div className="absolute inset-0 p-2 flex flex-col justify-between text-white transition-opacity duration-300 group-hover:opacity-50" 
           style={{ textShadow: '0 2px 4px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.7)' }}>
        {/* 上部：スコアとSKU */}
        <div className="flex items-start gap-1">
          <div className={`px-1.5 py-0.5 rounded text-[11px] font-bold shadow-lg ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-[9px] font-mono opacity-90">
            {product.sku}
          </div>
        </div>

        {/* 下部：商品情報 */}
        <div>
          <div className="font-bold line-clamp-1 mb-1 text-[11px] leading-tight">
            {product.title_en || product.title}
          </div>

          <div className="grid grid-cols-2 gap-0.5 text-[9px] mb-0.5">
            <div className="truncate">
              {product.condition || product.condition_name || '不明'}
            </div>
            <div className="text-right">
              {stockType}在庫
            </div>
          </div>

          <div className="mb-0.5 truncate text-[9px]">
            📁 {product.category_name || product.category || 'カテゴリ不明'}
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold">
            <div className="flex-1 text-center" style={{ color: profitMargin >= 10 ? '#4ade80' : profitMargin > 0 ? '#fbbf24' : '#ef4444' }}>
              {profitMargin.toFixed(1)}%
            </div>
            <div className="flex-1 text-center">
              {product.origin_country || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ApprovalTab() {
  const supabase = createClientComponentClient()
  const [products, setProducts] = useState<ApprovalProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ApprovalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<ApprovalProduct | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [incompleteProductsToApprove, setIncompleteProductsToApprove] = useState<Array<{ product: ApprovalProduct; missing: string[] }>>([])

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, activeStatus])

  const loadProducts = async () => {
    setLoading(true)
    try {
      // 1. 出品済みのSKU一覧を取得（inventory_masterから）
      const { data: listedData } = await supabase
        .from('inventory_master')
        .select('sku, source_data')
        .or('listing_status.eq.active,source_data->ebay_item_id.not.is.null')

      // SKUとeBay Item IDの両方で出品済み判定
      const listedSKUs = new Set<string>()
      const listedEbayIds = new Set<string>()

      listedData?.forEach(item => {
        if (item.sku) listedSKUs.add(item.sku)
        if (item.source_data?.ebay_item_id) {
          listedEbayIds.add(item.source_data.ebay_item_id)
        }
      })

      console.log(`📦 出品済み: SKU ${listedSKUs.size}件, eBay ID ${listedEbayIds.size}件`)

      // 2. products_masterから商品を取得
      const { data, error } = await supabase
        .from('products_master')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)

      if (error) throw error

      // 3. 出品済みを除外
      const pendingOnly = (data || []).filter(p => {
        // SKUで判定
        if (p.sku && listedSKUs.has(p.sku)) return false
        // eBay Item IDで判定（products_masterにあれば）
        if (p.ebay_item_id && listedEbayIds.has(p.ebay_item_id)) return false
        return true
      })

      console.log(`📋 承認対象（出品済み除外後）: ${pendingOnly.length}件 / 全${data?.length || 0}件`)

      setProducts(pendingOnly as ApprovalProduct[])
    } catch (error: any) {
      console.error('承認データ取得エラー:', error)
      alert(`データ取得エラー: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]
    
    if (activeStatus !== 'all') {
      filtered = filtered.filter(p => p.approval_status === activeStatus)
    }
    
    setFilteredProducts(filtered)
  }

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleApprove = async () => {
    if (selectedIds.size === 0) {
      alert('商品を選択してください')
      return
    }

    // データ完全性チェック
    const selectedProducts = products.filter(p => selectedIds.has(p.id))
    const incompleteProducts = selectedProducts
      .map(product => ({
        product,
        missing: getIncompleteFields(product)
      }))
      .filter(item => item.missing.length > 0)
    
    if (incompleteProducts.length > 0) {
      setIncompleteProductsToApprove(incompleteProducts)
      setShowConfirmModal(true)
      return
    }

    await executeApproval()
  }

  const executeApproval = async () => {
    try {
      const { error } = await supabase
        .from('products_master')
        .update({
          approval_status: 'approved',
          approved_at: new Date().toISOString()
        })
        .in('id', Array.from(selectedIds))

      if (error) throw error

      alert(`✅ ${selectedIds.size}件の商品を承認しました`)
      setSelectedIds(new Set())
      setShowConfirmModal(false)
      setIncompleteProductsToApprove([])
      await loadProducts()
    } catch (error: any) {
      console.error('承認エラー:', error)
      alert(`承認エラー: ${error.message}`)
    }
  }

  const handleReject = async () => {
    if (selectedIds.size === 0) {
      alert('商品を選択してください')
      return
    }

    const reason = prompt('却下理由を入力してください:')
    if (!reason) return

    try {
      const { error } = await supabase
        .from('products_master')
        .update({
          approval_status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date().toISOString()
        })
        .in('id', Array.from(selectedIds))

      if (error) throw error

      alert(`❌ ${selectedIds.size}件を却下しました`)
      setSelectedIds(new Set())
      await loadProducts()
    } catch (error: any) {
      console.error('却下エラー:', error)
      alert(`却下エラー: ${error.message}`)
    }
  }

  const handleUnapprove = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`${selectedIds.size}件の承認を取り消しますか？`)) return

    try {
      const { error } = await supabase
        .from('products_master')
        .update({
          approval_status: 'pending',
          approved_at: null
        })
        .in('id', Array.from(selectedIds))

      if (error) throw error

      alert(`↩️ ${selectedIds.size}件の承認を取り消しました`)
      setSelectedIds(new Set())
      await loadProducts()
    } catch (error: any) {
      console.error('承認取消エラー:', error)
      alert(`承認取消エラー: ${error.message}`)
    }
  }

  const stats = {
    total: products.length,
    pending: products.filter(p => p.approval_status === 'pending' || !p.approval_status).length,
    approved: products.filter(p => p.approval_status === 'approved').length,
    rejected: products.filter(p => p.approval_status === 'rejected').length,
    complete: products.filter(p => isDataComplete(p)).length,
    incomplete: products.filter(p => !isDataComplete(p)).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-lg text-slate-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* データ完全性サマリー */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-medium">完全: {stats.complete}件</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-orange-700 font-medium">不完全: {stats.incomplete}件</span>
          </div>
          <div className="text-xs text-slate-500 ml-auto">
            ※不完全なデータも確認後に承認可能です
          </div>
        </div>
      </div>

      {/* ステータスタブ */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => setActiveStatus('all')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeStatus === 'all'
              ? 'bg-blue-600 text-white font-medium'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          全て: {stats.total}
        </button>
        <button
          onClick={() => setActiveStatus('pending')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeStatus === 'pending'
              ? 'bg-orange-500 text-white font-medium'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          承認待ち: {stats.pending}
        </button>
        <button
          onClick={() => setActiveStatus('approved')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeStatus === 'approved'
              ? 'bg-green-600 text-white font-medium'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          承認済み: {stats.approved}
        </button>
        <button
          onClick={() => setActiveStatus('rejected')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeStatus === 'rejected'
              ? 'bg-red-600 text-white font-medium'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          却下: {stats.rejected}
        </button>
        <div className="ml-auto text-xs text-slate-500">
          選択: <span className="font-semibold text-blue-600">{selectedIds.size}</span> 件
        </div>
      </div>

      {/* コントロールバー */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedIds(selectedIds.size === filteredProducts.length ? new Set() : new Set(filteredProducts.map(p => p.id)))}
          className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 transition-colors text-sm"
        >
          {selectedIds.size === filteredProducts.length ? '全解除' : '全選択'}
        </button>
        
        <Button
          onClick={handleApprove}
          disabled={selectedIds.size === 0}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          size="sm"
        >
          <i className="fas fa-check mr-2"></i>
          一括承認
        </Button>
        
        <Button
          onClick={handleReject}
          disabled={selectedIds.size === 0}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
          size="sm"
        >
          <i className="fas fa-times mr-2"></i>
          一括却下
        </Button>
        
        <Button
          onClick={handleUnapprove}
          disabled={selectedIds.size === 0}
          variant="outline"
          className="border-orange-300 text-orange-700 hover:bg-orange-50 disabled:opacity-50"
          size="sm"
        >
          <i className="fas fa-undo mr-2"></i>
          承認取消
        </Button>
        
        <div className="flex-1"></div>
        
        <Button
          onClick={loadProducts}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          更新
        </Button>
      </div>

      {/* 商品グリッド */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <i className="fas fa-inbox text-6xl text-slate-300 mb-4"></i>
          <p className="text-xl text-slate-600 mb-2">
            {activeStatus === 'pending' ? '承認待ちの商品がありません' : '商品がありません'}
          </p>
          <p className="text-slate-400">
            フィルターを変更して他の商品を表示できます
          </p>
        </div>
      ) : (
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedIds.has(product.id)}
              onToggleSelect={() => toggleSelect(product.id)}
              onOpenModal={() => setSelectedProduct(product)}
              isComplete={isDataComplete(product)}
            />
          ))}
        </div>
      )}

      {/* 確認モーダル（不完全データ） */}
      {showConfirmModal && (
        <ConfirmApprovalModal
          incompleteProducts={incompleteProductsToApprove}
          onConfirm={executeApproval}
          onCancel={() => {
            setShowConfirmModal(false)
            setIncompleteProductsToApprove([])
          }}
        />
      )}

      {/* 商品詳細モーダル */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
