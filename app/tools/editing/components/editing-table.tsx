// app/tools/editing/components/editing-table.tsx
// V10 - 在庫カラム削除、項目名横文字化、画像連携修正、フォントサイズアップ

'use client'

import { useState, useEffect, useRef, Fragment, memo, useCallback, useMemo } from 'react'
import type { Product } from '../types/product'
import { optimizeImageUrl, THUMBNAIL_SIZES } from '@/lib/image-optimization'
import {
  ChevronDown, ChevronUp, Image as ImageIcon, ExternalLink,
  Edit2, Trash2, Package, AlertTriangle,
  Truck, Box, BarChart3, Lightbulb
} from 'lucide-react'

interface EditingTableProps {
  products: Product[]
  selectedIds: Set<string>
  modifiedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onCellChange: (id: string, updates: Partial<Product>) => void
  onProductClick: (product: Product) => void
  onProductHover?: (product: Product) => void
  wrapText?: boolean
  showTooltips?: boolean
  language?: 'ja' | 'en'
  total?: number
  pageSize?: number
  currentPage?: number
  onPageSizeChange?: (size: number) => void
  onPageChange?: (page: number) => void
}

// ===== TOOLTIP =====
const Tip = memo(function Tip({ children, content, enabled = true }: { children: React.ReactNode; content: string; enabled?: boolean }) {
  if (!enabled) return <>{children}</>
  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[11px]
        bg-gray-900 text-white rounded whitespace-nowrap opacity-0 invisible
        group-hover/tip:opacity-100 group-hover/tip:visible transition-all z-[100] pointer-events-none">
        {content}
      </div>
    </div>
  )
})

// ===== EDITABLE CELL =====
const EditableCell = memo(function EditableCell({
  value,
  field,
  productId,
  type = 'text',
  currency,
  onCellChange,
  className = '',
  placeholder = '-'
}: {
  value: any
  field: string
  productId: string
  type?: 'text' | 'number' | 'currency'
  currency?: 'JPY' | 'USD'
  onCellChange: (id: string, updates: any) => void
  className?: string
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(value ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  useEffect(() => {
    if (!editing) {
      setEditValue(value ?? '')
    }
  }, [value, editing])

  const handleSave = () => {
    setEditing(false)

    let finalValue: any = editValue
    if (type === 'number' || type === 'currency') {
      finalValue = parseFloat(editValue) || 0
    }

    if (String(finalValue) !== String(value)) {
      onCellChange(productId, { [field]: finalValue })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      setEditValue(value ?? '')
      setEditing(false)
    }
    if (e.key === 'Tab') {
      handleSave()
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode={type === 'number' || type === 'currency' ? 'numeric' : 'text'}
        pattern={type === 'number' || type === 'currency' ? '[0-9.]*' : undefined}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-1.5 py-0.5 text-[12px] border-2 border-blue-500 rounded focus:outline-none bg-white"
        style={{ minWidth: '40px' }}
      />
    )
  }

  let displayValue = value
  if (type === 'currency' && value != null) {
    displayValue = currency === 'JPY' ? `¥${Number(value).toLocaleString()}` : `${Number(value).toFixed(2)}`
  }
  if (!displayValue && displayValue !== 0) {
    displayValue = placeholder
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className={`
        w-full h-full px-1.5 py-0.5 cursor-text rounded
        hover:bg-gray-100 transition-colors
        inline-flex items-center
        ${className}
      `}
      title="クリックで編集"
    >
      <span className="text-[12px] truncate w-full">{displayValue}</span>
    </div>
  )
})

// ===== LISTING STATUS ICON - 小さく、影つき =====
const ListingStatusIcon = memo(function ListingStatusIcon({ product, showTip = true }: { product: Product; showTip?: boolean }) {
  let color = '#9ca3af'
  let tip = '未完了'
  
  if (product.listing_status === 'active' || product.ebay_item_id) {
    color = '#10b981'
    tip = '出品中'
  } else if (product.listing_status === 'ended') {
    color = '#ef4444'
    tip = '終了'
  } else if (product.ready_to_list || product.filter_passed) {
    color = '#f59e0b'
    tip = '準備完了'
  }
  
  const el = (
    <span 
      className="inline-block rounded-full" 
      style={{ 
        width: '6px',
        height: '6px',
        background: color,
        boxShadow: `0 0 3px ${color}, 0 0 6px ${color}30`
      }} 
    />
  )
  
  if (!showTip) return el
  return <Tip content={tip}>{el}</Tip>
})

// ===== TYPE ICON (有在庫/無在庫) =====
const TypeIcon = memo(function TypeIcon({ type, showTip = true }: { type?: string | null; showTip?: boolean }) {
  if (!type || type === 'unclassified') return <span className="text-gray-400 text-[10px]">-</span>
  
  const config: Record<string, { icon: typeof Package; color: string; tip: string }> = {
    stock: { icon: Box, color: '#059669', tip: '有在庫' },
    dropship: { icon: Truck, color: '#7c3aed', tip: '無在庫' },
    set: { icon: Package, color: '#d97706', tip: 'セット' },
  }
  const c = config[type] || config.stock
  const Icon = c.icon
  
  const icon = <Icon size={14} style={{ color: c.color }} />
  
  return showTip ? <Tip content={c.tip}>{icon}</Tip> : icon
})

// ===== PROFIT =====
const ProfitDisplay = memo(function ProfitDisplay({ amount }: { amount?: number | null }) {
  if (amount == null) return <span className="text-gray-400 text-[12px]">-</span>
  const isPositive = amount >= 0
  const prefix = isPositive ? '+$' : '-$'
  return (
    <span className={`font-mono text-[12px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
      {prefix}{Math.abs(amount).toFixed(0)}
    </span>
  )
})

// ===== MARGIN =====
const MarginDisplay = memo(function MarginDisplay({ margin }: { margin?: number | null }) {
  if (margin == null) return <span className="text-gray-400 text-[12px]">-</span>
  const isPositive = margin >= 0
  return (
    <span className={`font-mono text-[12px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
      {margin.toFixed(0)}%
    </span>
  )
})

// ===== SCORE =====
const ScoreDisplay = memo(function ScoreDisplay({ score, showTip = true }: { score?: number | null; showTip?: boolean }) {
  if (score == null) return <span className="text-gray-400 text-[12px]">-</span>
  const color = score >= 70 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'
  const bg = score >= 70 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2'
  const tipText = `スコア: ${score}点`
  const el = (
    <span className="inline-flex items-center justify-center w-6 h-5 rounded text-[10px] font-bold" style={{ background: bg, color }}>
      {score}
    </span>
  )
  return showTip ? <Tip content={tipText}>{el}</Tip> : el
})

// ===== FILTER LIGHT - 小さく、影つき =====
const FilterLight = memo(function FilterLight({ passed, showTip = true }: { passed?: boolean | null; showTip?: boolean }) {
  const color = passed ? '#10b981' : '#9ca3af'
  const tip = passed ? 'フィルター通過' : '未通過'

  const el = (
    <span 
      className="inline-block rounded-full" 
      style={{ 
        width: '6px',
        height: '6px',
        background: color,
        boxShadow: passed ? `0 0 3px ${color}, 0 0 6px ${color}30` : 'none'
      }} 
    />
  )

  if (!showTip) return el
  return <Tip content={tip}>{el}</Tip>
})

// ===== IMAGE CELL - 画像URL取得を強化 =====
const ImageCell = memo(function ImageCell({ product, onClick, size = 40 }: { product: Product; onClick: () => void; size?: number }) {
  const [error, setError] = useState(false)

  const getImageUrl = (): string | null => {
    // 優先順位1: primary_image_url
    if (product.primary_image_url) {
      return product.primary_image_url
    }

    // 優先順位2: gallery_images
    if (Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
      return product.gallery_images[0]
    }

    // 優先順位3: images フィールド（配列、JSON文字列、またはJSONB）
    if (product.images) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        const first = product.images[0]
        const url = typeof first === 'string' ? first : (first?.url || first?.original || null)
        if (url) return url
      }
      if (typeof product.images === 'string') {
        try {
          const parsed = JSON.parse(product.images)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const url = typeof parsed[0] === 'string' ? parsed[0] : (parsed[0]?.url || parsed[0]?.original || null)
            if (url) return url
          }
        } catch (e) {
          if (product.images.startsWith('http')) {
            return product.images
          }
        }
      }
    }

    // 優先順位4: scraped_data.images
    if (product.scraped_data?.images?.length > 0) {
      const img = product.scraped_data.images[0]
      const url = typeof img === 'string' ? img : (img?.url || img?.original || null)
      if (url) return url
    }

    // 優先順位5: image_urls
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      return product.image_urls[0]
    }

    // 優先順位6: listing_data.image_urls
    if (product.listing_data?.image_urls?.[0]) {
      return product.listing_data.image_urls[0]
    }

    // 優先順位7: ebay_api_data.images
    if (product.ebay_api_data?.images?.[0]) {
      return product.ebay_api_data.images[0]
    }

    // 優先順位8: main_image_url (カードビュー用に追加)
    if ((product as any).main_image_url) {
      return (product as any).main_image_url
    }

    // 優先順位9: image_url
    if ((product as any).image_url) {
      return (product as any).image_url
    }

    return null
  }

  const url = getImageUrl()

  if (!url || error) {
    return (
      <div
        onClick={onClick}
        className="rounded flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 hover:ring-2 hover:ring-indigo-400"
        style={{ width: size, height: size }}
      >
        <ImageIcon size={size * 0.4} className="text-gray-400" />
      </div>
    )
  }

  return (
    <img
      src={url}
      alt=""
      onClick={onClick}
      loading="lazy"
      decoding="async"
      className="rounded object-cover cursor-pointer hover:ring-2 hover:ring-indigo-500"
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  )
})

// ===== EXPANDED CONTENT =====
const ExpandedContent = memo(function ExpandedContent({ product, onOpenModal, onCellChange }: { product: Product; onOpenModal: () => void; onCellChange: (id: string, updates: Partial<Product>) => void }) {
  const lowestPrice = product.sm_lowest_price ?? product.competitors_lowest_price
  const avgPrice = product.sm_average_price ?? product.competitors_average_price
  const competitorCount = product.sm_competitor_count ?? product.competitors_count
  const salesCount = product.sm_sales_count ?? product.research_sold_count

  const getImageUrl = (): string | null => {
    if (product.primary_image_url) return product.primary_image_url
    if (Array.isArray(product.gallery_images) && product.gallery_images.length > 0) return product.gallery_images[0]
    if (product.listing_data?.image_urls?.[0]) return product.listing_data.image_urls[0]
    return null
  }

  const getAllImages = (): string[] => {
    const images: string[] = []
    if (Array.isArray(product.gallery_images)) {
      product.gallery_images.slice(0, 4).forEach((url: string) => { if (url && !images.includes(url)) images.push(url) })
    }
    if (images.length < 4 && product.listing_data?.image_urls?.length > 0) {
      product.listing_data.image_urls.slice(0, 4 - images.length).forEach((url: string) => { if (url && !images.includes(url)) images.push(url) })
    }
    return images
  }

  const mainImageUrl = getImageUrl()
  const galleryImages = getAllImages()

  return (
    <tr>
      <td colSpan={11} className="p-0 bg-slate-50/50">
        <div className="p-3 grid grid-cols-6 gap-4">
          {/* SKU + Image */}
          <div className="space-y-2">
            <div className="bg-white rounded p-2 border text-[12px]">
              <div className="text-[10px] text-gray-500 mb-1">SKU / Master Key</div>
              <div className="font-mono text-gray-700">{product.sku || '-'}</div>
              <div className="font-mono text-gray-500 text-[11px]">{product.master_key || '-'}</div>
            </div>
            <div className="w-20 h-20 rounded overflow-hidden bg-white border">
              {mainImageUrl ? <img src={mainImageUrl} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-gray-100"><ImageIcon size={24} className="text-gray-300" /></div>}
            </div>
            <div className="flex gap-1">
              {galleryImages.map((url, i) => (
                <img key={i} src={url || ''} alt="" loading="lazy" decoding="async" className="w-10 h-10 rounded object-cover border hover:border-indigo-400 cursor-pointer"
                  onClick={() => window.open(url, '_blank')} />
              ))}
            </div>
          </div>

          {/* Market Data + DDU */}
          <div className="bg-white rounded p-2 border text-[13px]">
            <div className="flex items-center gap-1 mb-2 text-blue-600 font-semibold text-[11px]">
              <BarChart3 size={12} /> 市場データ + DDU
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">最安値</span><span className="font-mono text-emerald-600">${lowestPrice?.toFixed(2) ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">平均</span><span className="font-mono">${avgPrice?.toFixed(2) ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">競合</span><span className="font-mono text-amber-600">{competitorCount ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">販売</span><span className="font-mono text-emerald-600">{salesCount ?? '-'}</span></div>
              <div className="h-px bg-gray-200 my-1.5"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">販売(円)</span>
                <div className="font-mono text-[13px] text-right">
                  <EditableCell value={product.price_jpy} field="price_jpy" productId={String(product.id)} type="currency" currency="JPY" onCellChange={onCellChange} />
                </div>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">DDU利益</span><span className="font-mono text-emerald-600">${product.listing_data?.ddu_profit_usd?.toFixed(0) ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">DDU率</span><span className="font-mono text-emerald-600">{product.listing_data?.ddu_profit_margin != null ? `${product.listing_data.ddu_profit_margin.toFixed(0)}%` : '-'}</span></div>
            </div>
          </div>

          {/* Size & Weight */}
          <div className="bg-white rounded p-2 border text-[13px]">
            <div className="flex items-center gap-1 mb-2 text-amber-600 font-semibold text-[11px]">
              <Package size={12} /> サイズ・重量
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">幅(cm)</span>
                <div className="font-mono text-[13px] text-right">
                  <EditableCell value={product.listing_data?.width_cm} field="width_cm" productId={String(product.id)} type="number" onCellChange={(id, updates) => onCellChange(id, {listing_data: {...product.listing_data, ...updates}})} placeholder="-" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">奥行(cm)</span>
                <div className="font-mono text-[13px] text-right">
                  <EditableCell value={product.listing_data?.length_cm} field="length_cm" productId={String(product.id)} type="number" onCellChange={(id, updates) => onCellChange(id, {listing_data: {...product.listing_data, ...updates}})} placeholder="-" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">高さ(cm)</span>
                <div className="font-mono text-[13px] text-right">
                  <EditableCell value={product.listing_data?.height_cm} field="height_cm" productId={String(product.id)} type="number" onCellChange={(id, updates) => onCellChange(id, {listing_data: {...product.listing_data, ...updates}})} placeholder="-" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">重量(g)</span>
                <div className="font-mono text-[13px] text-right">
                  <EditableCell value={product.listing_data?.weight_g} field="weight_g" productId={String(product.id)} type="number" onCellChange={(id, updates) => onCellChange(id, {listing_data: {...product.listing_data, ...updates}})} placeholder="-" />
                </div>
              </div>
            </div>
          </div>

          {/* HTS・関税情報 */}
          <div className="bg-white rounded p-2 border text-[14px]">
            <div className="flex items-center gap-1 mb-2 text-amber-600 font-semibold text-[12px]">
              <Package size={12} /> HTS・関税
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">HTSコード</span>
                <div className="font-mono text-[14px]">
                  <EditableCell
                    value={product.hts_code}
                    field="hts_code"
                    productId={String(product.id)}
                    onCellChange={onCellChange}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">HTS関税率</span>
                <div className="font-mono text-[14px]">
                  <EditableCell
                    value={product.hts_duty_rate}
                    field="hts_duty_rate"
                    productId={String(product.id)}
                    type="number"
                    onCellChange={onCellChange}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">原産国</span>
                <div className="text-[14px]">
                  <EditableCell
                    value={product.origin_country}
                    field="origin_country"
                    productId={String(product.id)}
                    onCellChange={onCellChange}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">原産国関税</span>
                <span className="font-mono text-amber-600 text-[14px]">
                  {product.origin_country_duty_rate != null ? `${product.origin_country_duty_rate}%` : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">素材</span>
                <div className="text-[14px]">
                  <EditableCell
                    value={product.material}
                    field="material"
                    productId={String(product.id)}
                    onCellChange={onCellChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VERO & Category */}
          <div className="bg-white rounded p-2 border text-[13px]">
            <div className="flex items-center gap-1 mb-2 text-red-500 font-semibold text-[11px]">
              <AlertTriangle size={12} /> VERO・カテゴリ
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">VERO</span>
                {product.is_vero_brand ? <span className="text-red-600 font-semibold">要注意</span> : <span className="text-emerald-600">OK</span>}</div>
              <div className="flex justify-between"><span className="text-gray-500">カテゴリID</span><span className="font-mono">{product.category_id || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">カテゴリ</span><span className="text-[11px] truncate max-w-[100px]">{product.category_name || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">HTML</span>
                {product.html_content ? <span className="text-emerald-600">✓ 生成済み</span> : <span className="text-gray-400">未生成</span>}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-gray-500 mb-1">ACTIONS</div>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border bg-white hover:bg-blue-50 hover:border-blue-300 text-[12px] text-gray-700 transition-colors"
              onClick={() => window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.english_title || product.title || '')}`, '_blank')}>
              <ExternalLink size={12} /> eBay検索
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-[12px] text-white transition-colors"
              onClick={onOpenModal}>
              <Edit2 size={12} /> 編集
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-[12px] text-red-600 transition-colors">
              <Trash2 size={12} /> 削除
            </button>
          </div>
        </div>
      </td>
    </tr>
  )
})

// ===== MAIN TABLE =====
export function EditingTable({
  products, selectedIds, modifiedIds, onSelectChange, onCellChange, onProductClick, onProductHover, wrapText = false, showTooltips = true, language = 'ja',
  total = 0, pageSize = 50, currentPage = 1, onPageSizeChange, onPageChange
}: EditingTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [tooltipsEnabled, setTooltipsEnabled] = useState(showTooltips)
  const [sortField, setSortField] = useState<string>('sku')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // 並び替え処理
  const sortedProducts = [...products].sort((a, b) => {
    let aVal: any = a[sortField as keyof Product]
    let bVal: any = b[sortField as keyof Product]
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (aVal == null) return 1
    if (bVal == null) return -1
    
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectChange(next)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      onSelectChange(new Set())
    } else {
      onSelectChange(new Set(products.map(p => String(p.id))))
    }
  }

  // Data getters
  const getProfit = (p: Product) => {
    const v = p.listing_data?.profit_amount_usd ?? p.profit_amount_usd ?? p.sm_profit_amount_usd
    return v !== undefined ? v : null
  }
  const getMargin = (p: Product) => {
    const v = p.listing_data?.profit_margin ?? p.profit_margin ?? p.profit_margin_percent
    return v !== undefined ? v : null
  }
  const getScore = (p: Product) => {
    const v = p.total_score ?? p.listing_score
    return v !== undefined ? v : null
  }
  const getStock = (p: Product) => {
    const v = p.current_stock ?? p.inventory_quantity
    return v !== undefined ? v : null
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden" style={{ background: 'var(--panel)', boxShadow: 'none' }}>
      {/* Header - コンパクト版 */}
      <div className="flex items-center justify-between px-1.5 border-b" style={{ background: 'var(--highlight)', height: '26px' }}>
        <div className="flex items-center gap-2">
          <button onClick={() => setTooltipsEnabled(!tooltipsEnabled)}
            className={`flex items-center gap-1 px-2 rounded text-[10px] font-medium h-[22px] ${tooltipsEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
            <Lightbulb size={10} /> Tips
          </button>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {sortedProducts.length}/{total}件
          </div>
        </div>
        
        {/* ページネーション */}
        {onPageSizeChange && onPageChange && (
          <div className="flex items-center gap-2">
            <select 
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="text-[10px] border rounded px-1.5 py-0.5 h-[20px]"
              style={{ background: 'var(--panel)', color: 'var(--text)' }}
            >
              <option value="sku">SKU</option>
              <option value="title">タイトル</option>
              <option value="price_jpy">価格</option>
              <option value="created_at">作成日</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-[10px] border rounded px-1.5 py-0.5 h-[20px] hover:bg-gray-100"
              style={{ background: 'var(--panel)', color: 'var(--text)' }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <div className="w-px h-4" style={{ background: 'var(--panel-border)' }} />
            <select 
              value={pageSize} 
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-[10px] border rounded px-1.5 py-0.5 h-[20px]"
              style={{ background: 'var(--panel)', color: 'var(--text)' }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="99999">全件</option>
            </select>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-50 hover:bg-gray-50 h-[20px]"
                style={{ background: 'var(--panel)', color: 'var(--text)' }}
              >
                ←
              </button>
              <span className="text-[10px] min-w-[50px] text-center" style={{ color: 'var(--text)' }}>
                {currentPage}/{Math.ceil(total / pageSize) || 1}
              </span>
              <button 
                onClick={() => onPageChange(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-50 hover:bg-gray-50 h-[20px]"
                style={{ background: 'var(--panel)', color: 'var(--text)' }}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* テーブル本体 - スクロールコンテナ（横スクロール無効） */}
      <div style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: 'calc(100vh - 260px)' }} className="n3-table-scroll">
        <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
          <thead className="sticky top-0 z-10" style={{ background: 'var(--highlight)' }}>
            <tr className="text-[10px] font-medium border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--panel-border)', height: '28px' }}>
              <th className="px-1 py-1 w-8 text-center">
                <input type="checkbox" className="n3-checkbox" checked={selectedIds.size === products.length && products.length > 0} onChange={toggleSelectAll} />
              </th>
              <th className="px-1 py-1 w-6"></th>
              <th className="px-2 py-1">Product</th>
              <th className="px-1 py-1 w-14 text-center">Stock</th>
              <th className="px-1 py-1 w-16 text-right">Cost¥</th>
              <th className="px-1 py-1 w-14 text-right">Cost$</th>
              <th className="px-1 py-1 w-16 text-right">Profit</th>
              <th className="px-1 py-1 w-12 text-right">Rate</th>
              <th className="px-1 py-1 w-8 text-center">✓</th>
              <th className="px-1 py-1 w-8 text-center">ST</th>
              <th className="px-1 py-1 w-10 text-center">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--panel-border)' }}>
            {sortedProducts.map((product) => {
              const id = String(product.id)
              const isSelected = selectedIds.has(id)
              const isExpanded = expandedIds.has(id)
              const isModified = modifiedIds.has(id)

              return (
                <Fragment key={id}>
                  <tr 
                    className={`group ${isSelected ? 'bg-indigo-50' : ''} ${isExpanded ? 'bg-slate-50' : ''} ${isModified ? 'modified-row' : ''}`}
                    data-modified={isModified ? 'true' : undefined}
                    style={{ height: '34px' }}
                    onMouseEnter={() => onProductHover?.(product)}
                  >
                    <td className="px-1 py-1 text-center" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="n3-checkbox" checked={isSelected} onChange={() => toggleSelect(id)} />
                    </td>
                    <td className="px-1 py-1 w-6">
                      <Tip content="詳細を展開" enabled={tooltipsEnabled}>
                        <button onClick={() => toggleExpand(id)} className="w-4 h-4 rounded flex items-center justify-center transition-all hover:bg-gray-200">
                          {isExpanded ? <ChevronUp size={10} className="text-gray-500" /> : <ChevronDown size={10} className="text-gray-500" />}
                        </button>
                      </Tip>
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex items-center gap-2">
                        <Tip content="クリックでモーダルを開く" enabled={tooltipsEnabled}>
                          <div className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: '#f3f4f6' }}>
                            <ImageCell product={product} onClick={() => onProductClick(product)} size={28} />
                          </div>
                        </Tip>
                        <div className="min-w-0 flex-1">
                          <div className={`text-[11px] font-medium ${wrapText ? '' : 'line-clamp-1'}`} style={{ color: 'var(--text)' }}>
                            <EditableCell
                              value={product.title}
                              field="title"
                              productId={id}
                              onCellChange={onCellChange}
                            />
                          </div>
                          <div className={`text-[9px] ${wrapText ? '' : 'line-clamp-1'}`} style={{ color: 'var(--text-muted)' }}>
                            <EditableCell
                              value={product.english_title || product.title_en}
                              field="english_title"
                              productId={id}
                              onCellChange={onCellChange}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-1 w-14 text-center">
                      <EditableCell
                        value={getStock(product)}
                        field="current_stock"
                        productId={id}
                        type="number"
                        onCellChange={onCellChange}
                        className="font-mono text-[10px] text-center justify-center"
                      />
                    </td>
                    <td className="px-1 py-1 w-16 text-right">
                      <EditableCell
                        value={product.cost_price ?? product.purchase_price_jpy}
                        field="cost_price"
                        productId={id}
                        type="currency"
                        currency="JPY"
                        onCellChange={onCellChange}
                        className="font-mono text-[10px] text-right justify-end"
                      />
                    </td>
                    <td className="px-1 py-1 w-14 text-right font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {(product.cost_price ?? product.purchase_price_jpy) ? `${((product.cost_price ?? product.purchase_price_jpy)! / 150).toFixed(1)}` : '-'}
                    </td>
                    <td className="px-1 py-1 w-16 text-right"><ProfitDisplay amount={product.listing_data?.ddp_profit_usd ?? getProfit(product)} /></td>
                    <td className="px-1 py-1 w-12 text-right"><MarginDisplay margin={product.listing_data?.ddp_profit_margin ?? getMargin(product)} /></td>
                    <td className="px-1 py-1 w-8 text-center"><FilterLight passed={product.filter_passed} showTip={tooltipsEnabled} /></td>
                    <td className="px-1 py-1 w-8 text-center"><ListingStatusIcon product={product} showTip={tooltipsEnabled} /></td>
                    <td className="px-1 py-1 w-10 text-center"><TypeIcon type={product.product_type} showTip={tooltipsEnabled} /></td>
                  </tr>
                  {isExpanded && <ExpandedContent product={product} onOpenModal={() => onProductClick(product)} onCellChange={onCellChange} />}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {sortedProducts.length === 0 && (
        <div className="py-16 text-center">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>商品がありません</p>
        </div>
      )}
    </div>
  )
}
