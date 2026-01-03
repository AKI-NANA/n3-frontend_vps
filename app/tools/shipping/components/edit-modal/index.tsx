// app/tools/editing/components/EditModal/index.tsx
// V8 - デザインシステム準拠の新モーダル
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import type { Product, ProductUpdate } from '../../types/product'
import { 
  X, Save, ExternalLink, Copy, TrendingUp, Trash2,
  Globe, Image as ImageIcon, Clock, AlertTriangle,
  Check, Loader2, ChevronDown, Languages
} from 'lucide-react'

// ==========================================
// 型定義
// ==========================================
interface EditModalProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updates: ProductUpdate) => Promise<{ success: boolean; error?: string }>
}

type Language = 'ja' | 'en'

// ==========================================
// ユーティリティ: 画像重複排除
// ==========================================
function getAllUniqueGalleryImages(product: Product): string[] {
  const seen = new Set<string>()
  const images: string[] = []
  
  const sources = [
    product.gallery_images,
    product.scraped_data?.images,
    product.images,
    product.image_urls
  ]
  
  for (const source of sources) {
    if (Array.isArray(source)) {
      for (const item of source) {
        const url = typeof item === 'string' ? item : item?.url || item?.original
        if (url && typeof url === 'string' && url.startsWith('http') && !seen.has(url)) {
          seen.add(url)
          images.push(url)
        }
      }
    }
  }
  
  return images
}

// ==========================================
// ツールチップコンポーネント
// ==========================================
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="relative group/tooltip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs
        bg-gray-900 text-white rounded-md whitespace-nowrap opacity-0 invisible 
        group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[200] pointer-events-none
        shadow-lg">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  )
}

// ==========================================
// 入力フィールドコンポーネント
// ==========================================
function FormInput({ 
  label, 
  value, 
  onChange, 
  disabled = false,
  tooltip,
  type = 'text',
  placeholder,
  className = ''
}: { 
  label: string
  value: string | number
  onChange?: (value: string) => void
  disabled?: boolean
  tooltip?: string
  type?: 'text' | 'number' | 'textarea'
  placeholder?: string
  className?: string
}) {
  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`
  
  const LabelContent = (
    <label 
      htmlFor={inputId}
      className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block"
    >
      {label}
    </label>
  )
  
  const inputClasses = `w-full px-3 py-2 text-sm rounded-md border transition-all
    ${disabled 
      ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' 
      : 'bg-white border-gray-300 text-gray-900 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
    } ${className}`
  
  return (
    <div>
      {tooltip ? (
        <Tooltip content={tooltip}>{LabelContent}</Tooltip>
      ) : LabelContent}
      
      {type === 'textarea' ? (
        <textarea
          id={inputId}
          className={inputClasses}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          className={inputClasses}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

// ==========================================
// アクションボタンコンポーネント
// ==========================================
function ActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  tooltip,
  variant = 'default',
  disabled = false,
  loading = false
}: { 
  icon: React.ElementType
  label: string
  onClick: () => void
  tooltip: string
  variant?: 'default' | 'primary' | 'danger' | 'success'
  disabled?: boolean
  loading?: boolean
}) {
  const variants = {
    default: 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50',
    primary: 'border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-600',
    danger: 'border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50',
    success: 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
  }
  
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg border flex items-center gap-2.5 
          transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${variants[variant]}`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Icon size={16} />
        )}
        {label}
      </button>
    </Tooltip>
  )
}

// ==========================================
// メインモーダルコンポーネント
// ==========================================
export function EditModal({ product, open, onOpenChange, onSave }: EditModalProps) {
  const [language, setLanguage] = useState<Language>('ja')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [translating, setTranslating] = useState(false)
  
  // フォームデータ状態
  const [formData, setFormData] = useState({
    title: product.title || '',
    english_title: product.english_title || product.title_en || '',
    description: product.description || '',
    english_description: product.english_description || product.description_en || '',
    price_jpy: product.price_jpy || product.current_price || 0,
    price_usd: product.listing_data?.ddp_price_usd || product.price_usd || 0,
    condition: product.condition_name || product.condition || '',
    english_condition: product.english_condition || '',
    weight_g: product.listing_data?.weight_g || '',
    length_cm: product.listing_data?.length_cm || '',
    width_cm: product.listing_data?.width_cm || '',
    height_cm: product.listing_data?.height_cm || '',
  })
  
  // 画像データ（重複排除済み）
  const images = useMemo(() => getAllUniqueGalleryImages(product), [product])
  
  // 利益データ
  const profitMargin = product.listing_data?.profit_margin || product.profit_margin || product.profit_margin_percent || 0
  const profitAmount = product.listing_data?.profit_amount_usd || product.profit_amount_usd || 0
  
  // SM分析データ
  const smData = {
    lowestPrice: product.sm_lowest_price || product.competitors_lowest_price || 0,
    averagePrice: product.sm_average_price || product.competitors_average_price || 0,
    competitorCount: product.sm_competitor_count || product.competitors_count || 0,
    salesCount: product.sm_sales_count || product.research_sold_count || 0,
  }
  
  // productが変更されたらformDataを更新
  useEffect(() => {
    setFormData({
      title: product.title || '',
      english_title: product.english_title || product.title_en || '',
      description: product.description || '',
      english_description: product.english_description || product.description_en || '',
      price_jpy: product.price_jpy || product.current_price || 0,
      price_usd: product.listing_data?.ddp_price_usd || product.price_usd || 0,
      condition: product.condition_name || product.condition || '',
      english_condition: product.english_condition || '',
      weight_g: product.listing_data?.weight_g || '',
      length_cm: product.listing_data?.length_cm || '',
      width_cm: product.listing_data?.width_cm || '',
      height_cm: product.listing_data?.height_cm || '',
    })
  }, [product])
  
  // フィールド更新
  const updateField = useCallback((field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])
  
  // 翻訳実行
  const handleTranslate = async () => {
    if (!formData.title && !formData.description) {
      alert('翻訳する日本語データがありません')
      return
    }
    
    setTranslating(true)
    try {
      const response = await fetch('/api/tools/translate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          title: formData.title,
          description: formData.description,
          condition: formData.condition,
        })
      })
      
      if (!response.ok) throw new Error('翻訳APIエラー')
      
      const result = await response.json()
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          english_title: result.translations.title || prev.english_title,
          english_description: result.translations.description || prev.english_description,
          english_condition: result.translations.condition || prev.english_condition,
        }))
      }
    } catch (error) {
      console.error('Translation error:', error)
      alert('翻訳に失敗しました')
    } finally {
      setTranslating(false)
    }
  }
  
  // 保存実行
  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    
    try {
      const updates: ProductUpdate = {
        title: formData.title,
        english_title: formData.english_title,
        title_en: formData.english_title,
        description: formData.description,
        english_description: formData.english_description,
        description_en: formData.english_description,
        condition_name: formData.condition,
        english_condition: formData.english_condition,
        price_jpy: Number(formData.price_jpy),
        listing_data: {
          ...product.listing_data,
          ddp_price_usd: Number(formData.price_usd),
          weight_g: formData.weight_g ? Number(formData.weight_g) : null,
          length_cm: formData.length_cm ? Number(formData.length_cm) : null,
          width_cm: formData.width_cm ? Number(formData.width_cm) : null,
          height_cm: formData.height_cm ? Number(formData.height_cm) : null,
        }
      }
      
      const result = await onSave(updates)
      
      if (result.success) {
        setSaveStatus('success')
        // イベント発行
        window.dispatchEvent(new CustomEvent('product-updated', { 
          detail: { productId: product.id } 
        }))
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }
  
  // eBay検索
  const handleEbaySearch = () => {
    const query = formData.english_title || formData.title
    window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`, '_blank')
  }
  
  // 複製
  const handleDuplicate = () => {
    alert('複製機能は実装中です')
  }
  
  // 価格履歴
  const handlePriceHistory = () => {
    alert('価格履歴機能は実装中です')
  }
  
  // 削除
  const handleDelete = () => {
    if (confirm('本当にこの商品を削除しますか？')) {
      alert('削除機能は実装中です')
    }
  }
  
  // ステータスバッジ
  const getStatusBadge = () => {
    if (product.filter_passed) {
      return { label: '出品可', color: 'bg-emerald-500', textColor: 'text-white' }
    }
    if (product.workflow_status === 'error') {
      return { label: 'エラー', color: 'bg-red-500', textColor: 'text-white' }
    }
    return { label: '下書き', color: 'bg-gray-400', textColor: 'text-white' }
  }
  
  const status = getStatusBadge()
  
  // 翻訳ラベル
  const labels = {
    ja: {
      title: 'タイトル (日本語)',
      description: '説明 (日本語)',
      condition: '状態',
    },
    en: {
      title: 'Title (English)',
      description: 'Description (English)',
      condition: 'Condition',
    }
  }
  
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* オーバーレイ */}
        <DialogPrimitive.Overlay 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        />
        
        {/* コンテンツ */}
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]
            w-[96vw] max-w-[1600px] h-[92vh] outline-none animate-in zoom-in-95 duration-200"
        >
          <VisuallyHidden>
            <DialogPrimitive.Title>
              {product.title || '商品編集'}
            </DialogPrimitive.Title>
          </VisuallyHidden>
          
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
            
            {/* ========== ヘッダー ========== */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-4">
                {/* ステータスバッジ */}
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${status.color} ${status.textColor}`}>
                  {status.label}
                </span>
                
                {/* SKU */}
                <span className="font-mono text-sm text-gray-500">
                  {product.sku || 'SKU未設定'}
                </span>
                
                {/* タイトル */}
                <h2 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {language === 'ja' ? formData.title : formData.english_title || formData.title}
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                {/* 言語切り替え */}
                <Tooltip content="日本語/英語切り替え">
                  <button
                    onClick={() => setLanguage(prev => prev === 'ja' ? 'en' : 'ja')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 
                      text-sm font-medium hover:border-indigo-400 hover:text-indigo-600 transition-all"
                  >
                    <Languages size={16} />
                    {language === 'ja' ? '日本語' : 'English'}
                  </button>
                </Tooltip>
                
                {/* 閉じるボタン */}
                <Tooltip content="閉じる（変更は保存されません）">
                  <button 
                    onClick={() => onOpenChange(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </Tooltip>
              </div>
            </div>
            
            {/* ========== ボディ: 3カラムレイアウト ========== */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-[240px_1fr_240px] gap-6 h-full">
                
                {/* ========== 左カラム: 画像 + 利益サマリー ========== */}
                <div className="space-y-4">
                  {/* メイン画像 */}
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {images.length > 0 ? (
                      <img 
                        src={images[selectedImageIndex]} 
                        alt="商品画像" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                  
                  {/* サムネイル */}
                  {images.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {images.slice(0, 6).map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all
                            ${idx === selectedImageIndex 
                              ? 'border-indigo-500 ring-2 ring-indigo-200' 
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {images.length > 6 && (
                        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          +{images.length - 6}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 利益サマリー */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-3">
                      Profit Summary
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500 mb-1">利益率</div>
                        <div className={`text-2xl font-bold font-mono ${profitMargin >= 15 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {profitMargin.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500 mb-1">利益額</div>
                        <div className={`text-2xl font-bold font-mono ${profitAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          ${profitAmount.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 画像枚数 */}
                  <div className="text-center text-sm text-gray-500">
                    <ImageIcon size={14} className="inline mr-1" />
                    {images.length}枚の画像
                  </div>
                </div>
                
                {/* ========== 中央カラム: フォーム ========== */}
                <div className="space-y-4 overflow-y-auto pr-2">
                  
                  {/* Basic Info */}
                  <div className="p-4 rounded-xl border border-gray-200">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-3">
                      Basic Info
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <FormInput
                        label="SKU"
                        value={product.sku || ''}
                        disabled
                        tooltip="SKUは自動生成されます"
                      />
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1 block">
                          Stock Type
                        </label>
                        <div className="mt-1">
                          <span className={`px-3 py-1.5 text-xs font-semibold rounded-md inline-block
                            ${product.product_type === 'stock' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-purple-100 text-purple-700'
                            }`}>
                            {product.product_type === 'stock' ? '有在庫' : '無在庫'}
                          </span>
                        </div>
                      </div>
                      <FormInput
                        label="JPY"
                        value={formData.price_jpy}
                        onChange={v => updateField('price_jpy', v)}
                        type="number"
                        tooltip="仕入れ価格（日本円）"
                      />
                      <FormInput
                        label="Category"
                        value={product.category_name || ''}
                        disabled
                        tooltip="カテゴリは別途設定してください"
                      />
                    </div>
                  </div>
                  
                  {/* タイトル（日本語） */}
                  <div className="p-4 rounded-xl border border-gray-200">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-3">
                      {labels.ja.title}
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 
                        hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      value={formData.title}
                      onChange={e => updateField('title', e.target.value)}
                      placeholder="日本語タイトルを入力"
                    />
                  </div>
                  
                  {/* タイトル（英語）+ 翻訳ボタン */}
                  <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600">
                        {labels.en.title}
                      </div>
                      <Tooltip content="日本語のタイトル・説明・状態を英語に翻訳します">
                        <button
                          onClick={handleTranslate}
                          disabled={translating}
                          className="px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5
                            bg-indigo-500 text-white hover:bg-indigo-600 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {translating ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Languages size={12} />
                          )}
                          日→英
                        </button>
                      </Tooltip>
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-indigo-300 
                        bg-white hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      value={formData.english_title}
                      onChange={e => updateField('english_title', e.target.value)}
                      placeholder="English title"
                    />
                  </div>
                  
                  {/* SellerMirror Analysis */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-purple-600 mb-3">
                      SellerMirror Analysis
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-white text-center">
                        <div className="text-[9px] uppercase text-gray-500 mb-1">Lowest</div>
                        <div className="text-lg font-bold font-mono text-indigo-600">
                          ${smData.lowestPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white text-center">
                        <div className="text-[9px] uppercase text-gray-500 mb-1">Average</div>
                        <div className="text-lg font-bold font-mono text-gray-700">
                          ${smData.averagePrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white text-center">
                        <div className="text-[9px] uppercase text-gray-500 mb-1">Competitors</div>
                        <div className="text-lg font-bold text-amber-600">
                          {smData.competitorCount}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-white text-center">
                        <div className="text-[9px] uppercase text-gray-500 mb-1">Sales (90d)</div>
                        <div className="text-lg font-bold text-emerald-600">
                          {smData.salesCount}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* サイズ・重量 */}
                  <div className="p-4 rounded-xl border border-gray-200">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-3">
                      Size & Weight
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <FormInput
                        label="Length (cm)"
                        value={formData.length_cm}
                        onChange={v => updateField('length_cm', v)}
                        type="number"
                        tooltip="配送料計算に使用"
                        placeholder="長さ"
                      />
                      <FormInput
                        label="Width (cm)"
                        value={formData.width_cm}
                        onChange={v => updateField('width_cm', v)}
                        type="number"
                        tooltip="配送料計算に使用"
                        placeholder="幅"
                      />
                      <FormInput
                        label="Height (cm)"
                        value={formData.height_cm}
                        onChange={v => updateField('height_cm', v)}
                        type="number"
                        tooltip="配送料計算に使用"
                        placeholder="高さ"
                      />
                      <FormInput
                        label="Weight (g)"
                        value={formData.weight_g}
                        onChange={v => updateField('weight_g', v)}
                        type="number"
                        tooltip="配送料計算に使用"
                        placeholder="重さ"
                      />
                    </div>
                  </div>
                  
                  {/* HTS / 関税情報 */}
                  {(product.hts_code || product.origin_country) && (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 mb-3">
                        <AlertTriangle size={12} className="inline mr-1" />
                        HTS / Customs
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">HTS Code:</span>
                          <span className="ml-2 font-mono font-semibold">{product.hts_code || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Origin:</span>
                          <span className="ml-2 font-semibold">{product.origin_country || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duty Rate:</span>
                          <span className="ml-2 font-semibold">{product.hts_duty_rate || 0}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* ========== 右カラム: Quick Actions ========== */}
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2">
                    Quick Actions
                  </div>
                  
                  <ActionButton
                    icon={ExternalLink}
                    label="View on eBay"
                    onClick={handleEbaySearch}
                    tooltip="eBayでこの商品を検索します"
                  />
                  
                  <ActionButton
                    icon={Copy}
                    label="Duplicate"
                    onClick={handleDuplicate}
                    tooltip="この商品を複製して新規作成します"
                  />
                  
                  <ActionButton
                    icon={TrendingUp}
                    label="Price History"
                    onClick={handlePriceHistory}
                    tooltip="価格履歴と変動グラフを表示します"
                  />
                  
                  <div className="border-t border-gray-200 my-4" />
                  
                  <ActionButton
                    icon={Trash2}
                    label="Delete Item"
                    onClick={handleDelete}
                    tooltip="この商品を完全に削除します（元に戻せません）"
                    variant="danger"
                  />
                  
                  {/* 追加情報 */}
                  <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2">
                      Info
                    </div>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Master Key:</span>
                        <span className="font-mono">{product.master_key || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Source:</span>
                        <span>{product.source_system || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span className="font-semibold">
                          {product.product_type === 'dropship' ? '∞' : product.current_stock || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ========== フッター ========== */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={14} />
                Last updated: {product.updated_at ? new Date(product.updated_at).toLocaleString('ja-JP') : '-'}
              </div>
              
              <div className="flex items-center gap-3">
                {/* 保存状態表示 */}
                {saveStatus === 'success' && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                    <Check size={16} />
                    保存完了
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-1.5 text-sm text-red-600">
                    <AlertTriangle size={16} />
                    保存失敗
                  </span>
                )}
                
                <button
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                
                <Tooltip content="すべての変更をデータベースに保存します">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2
                      bg-indigo-500 text-white hover:bg-indigo-600 transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
