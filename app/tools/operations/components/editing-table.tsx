// app/tools/operations/components/editing-table.tsx
// コピー元: editing/components/editing-table.tsx

'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import type { Product } from '../types/product'
import {
  ChevronDown, ChevronUp, Image as ImageIcon, ExternalLink,
  Edit2, Trash2, Package, AlertTriangle,
  Truck, Box, BarChart3, Eye, EyeOff
} from 'lucide-react'

interface EditingTableProps {
  products: Product[]
  selectedIds: Set<string>
  modifiedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onCellChange: (id: string, updates: Partial<Product>) => void
  onProductClick: (product: Product) => void
  wrapText?: boolean
  showTooltips?: boolean
  language?: 'ja' | 'en'
}

function Tip({ children, content, enabled = true }: { children: React.ReactNode; content: string; enabled?: boolean }) {
  if (!enabled) return <>{children}</>
  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[10px]
        bg-gray-900 text-white rounded whitespace-nowrap opacity-0 invisible
        group-hover/tip:opacity-100 group-hover/tip:visible transition-all z-[100] pointer-events-none">
        {content}
      </div>
    </div>
  )
}

function EditableCell({
  value,
  field,
  productId,
  type = 'text',
  currency,
  onCellChange,
  className = ''
}: {
  value: any
  field: string
  productId: string
  type?: 'text' | 'number' | 'currency'
  currency?: 'JPY' | 'USD'
  onCellChange: (id: string, updates: any) => void
  className?: string
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
    if (e.key === 'Enter') { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') { setEditValue(value ?? ''); setEditing(false) }
    if (e.key === 'Tab') { handleSave() }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type === 'number' || type === 'currency' ? 'number' : 'text'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-1 py-0.5 text-[11px] border border-indigo-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
        style={{ minWidth: '50px' }}
      />
    )
  }

  let displayValue = value
  if (type === 'currency' && value != null) {
    displayValue = currency === 'JPY' ? `¥${Number(value).toLocaleString()}` : `$${Number(value).toFixed(2)}`
  }

  return (
    <span
      onDoubleClick={() => setEditing(true)}
      className={`cursor-pointer hover:bg-indigo-50 px-0.5 rounded ${className}`}
      title="ダブルクリックで編集"
    >
      {displayValue ?? '-'}
    </span>
  )
}

function StatusLight({ product, showTip = true }: { product: Product; showTip?: boolean }) {
  const isOK = product.filter_passed || product.ready_to_list
  const isError = product.workflow_status === 'error' || product.status === 'error'

  let color = 'bg-gray-300'
  let tip = '未処理'

  if (isError) { color = 'bg-red-500'; tip = 'エラー' }
  else if (isOK) { color = 'bg-emerald-500'; tip = '準備完了' }

  const el = <span className={`w-2.5 h-2.5 rounded-full inline-block ${color}`} />
  if (!showTip) return el
  return <Tip content={tip}>{el}</Tip>
}

function FilterLight({ passed, showTip = true }: { passed?: boolean | null; showTip?: boolean }) {
  const color = passed ? 'bg-emerald-500' : 'bg-gray-300'
  const tip = passed ? 'フィルター通過 - 出品可能' : '未通過 / 未チェック'
  const el = <span className={`w-2.5 h-2.5 rounded-full inline-block ${color}`} />
  if (!showTip) return el
  return <Tip content={tip}>{el}</Tip>
}

function TypeBadge({ type, showTip = true }: { type?: string | null; showTip?: boolean }) {
  if (!type || type === 'unclassified') return <span className="text-gray-400 text-[9px]">-</span>
  const config: Record<string, { icon: typeof Package; color: string; bg: string; tip: string }> = {
    stock: { icon: Box, color: '#059669', bg: '#d1fae5', tip: '有在庫' },
    dropship: { icon: Truck, color: '#7c3aed', bg: '#ede9fe', tip: '無在庫' },
    set: { icon: Package, color: '#d97706', bg: '#fef3c7', tip: 'セット' },
  }
  const c = config[type] || config.stock
  const Icon = c.icon
  const badge = (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded" style={{ background: c.bg, color: c.color }}>
      <Icon size={11} />
    </span>
  )
  return showTip ? <Tip content={c.tip}>{badge}</Tip> : badge
}

function StockDisplay({ stock, type, showTip = true }: { stock?: number | null; type?: string | null; showTip?: boolean }) {
  if (type === 'dropship') {
    const el = <span className="text-purple-600 font-mono text-[11px]">∞</span>
    return showTip ? <Tip content="無在庫">{el}</Tip> : el
  }
  if (stock == null) return <span className="text-gray-400 text-[11px]">-</span>
  if (stock === 0) return <span className="text-red-600 font-bold text-[11px]">0</span>
  return <span className={`font-mono text-[11px] ${stock < 5 ? 'text-amber-600' : 'text-gray-700'}`}>{stock}</span>
}

function ProfitDisplay({ amount }: { amount?: number | null }) {
  if (amount == null) return <span className="text-gray-400 text-[11px]">-</span>
  const isPositive = amount >= 0
  const prefix = isPositive ? '+$' : '-$'
  return (
    <span className={`font-mono text-[11px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
      {prefix}{Math.abs(amount).toFixed(0)}
    </span>
  )
}

function MarginDisplay({ margin }: { margin?: number | null }) {
  if (margin == null) return <span className="text-gray-400 text-[11px]">-</span>
  const isPositive = margin >= 0
  return (
    <span className={`font-mono text-[11px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
      {margin.toFixed(0)}%
    </span>
  )
}

function ScoreDisplay({ score, showTip = true }: { score?: number | null; showTip?: boolean }) {
  if (score == null) return <span className="text-gray-400 text-[11px]">-</span>
  const color = score >= 70 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'
  const bg = score >= 70 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2'
  const tipText = `スコア: ${score}点\n70+: 出品推奨\n50-69: 要検討\n50未満: 再考`
  const el = (
    <span className="inline-flex items-center justify-center w-5 h-4 rounded text-[9px] font-bold" style={{ background: bg, color }}>
      {score}
    </span>
  )
  return showTip ? <Tip content={tipText}>{el}</Tip> : el
}

function ImageCell({ product, onClick, size = 40 }: { product: Product; onClick: () => void; size?: number }) {
  const [error, setError] = useState(false)

  const getImageUrl = (): string | null => {
    if (product.primary_image_url) return product.primary_image_url
    if (Array.isArray(product.gallery_images) && product.gallery_images.length > 0) return product.gallery_images[0]
    if (product.scraped_data?.images?.length > 0) {
      const img = product.scraped_data.images[0]
      return typeof img === 'string' ? img : img?.url || img?.original || null
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      const first = product.images[0]
      return typeof first === 'string' ? first : first?.url || first?.original || null
    }
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) return product.image_urls[0]
    if (product.listing_data?.image_urls?.[0]) return product.listing_data.image_urls[0]
    if (product.ebay_api_data?.images?.[0]) return product.ebay_api_data.images[0]
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
      className="rounded object-cover cursor-pointer hover:ring-2 hover:ring-indigo-500"
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  )
}

function ExpandedContent({ product, onOpenModal }: { product: Product; onOpenModal: () => void }) {
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

  return (
    <tr>
      <td colSpan={12} className="p-0 bg-slate-50/50">
        <div className="p-3 grid grid-cols-6 gap-4">
          <div className="space-y-2">
            <div className="bg-white rounded p-2 border text-[11px]">
              <div className="text-[9px] text-gray-500 mb-1">SKU / Master Key</div>
              <div className="font-mono text-gray-700">{product.sku || '-'}</div>
              <div className="font-mono text-gray-500 text-[10px]">{product.master_key || '-'}</div>
            </div>
            <div className="w-20 h-20 rounded overflow-hidden bg-white border">
              {getImageUrl() ? <img src={getImageUrl()!} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-gray-100"><ImageIcon size={24} className="text-gray-300" /></div>}
            </div>
            <div className="flex gap-1">
              {getAllImages().map((url, i) => (
                <img key={i} src={url} alt="" className="w-10 h-10 rounded object-cover border hover:border-indigo-400 cursor-pointer"
                  onClick={() => window.open(url, '_blank')} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded p-2 border text-[12px]">
            <div className="flex items-center gap-1 mb-2 text-blue-600 font-semibold text-[10px]">
              <BarChart3 size={12} /> 市場データ
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">最安値</span><span className="font-mono text-emerald-600">${lowestPrice?.toFixed(2) ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">平均</span><span className="font-mono">${avgPrice?.toFixed(2) ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">競合</span><span className="font-mono text-amber-600">{competitorCount ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">販売</span><span className="font-mono text-emerald-600">{salesCount ?? '-'}</span></div>
            </div>
          </div>

          <div className="bg-white rounded p-2 border text-[12px]">
            <div className="flex items-center gap-1 mb-2 text-amber-600 font-semibold text-[10px]">
              <Package size={12} /> サイズ・重量
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">サイズ</span>
                <span className="font-mono">{product.listing_data?.length_cm ?? '-'}x{product.listing_data?.width_cm ?? '-'}x{product.listing_data?.height_cm ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">重量</span><span className="font-mono">{product.listing_data?.weight_g ?? '-'}g</span></div>
            </div>
          </div>

          <div className="bg-white rounded p-2 border text-[12px]">
            <div className="flex items-center gap-1 mb-2 text-amber-600 font-semibold text-[10px]">
              <Package size={12} /> HTS・関税
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">HTSコード</span><span className="font-mono">{product.hts_code || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">HTS関税率</span><span className="font-mono">{product.hts_duty_rate ? `${product.hts_duty_rate}%` : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">原産国</span><span>{product.origin_country || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">原産国関税</span><span className="font-mono text-amber-600">{product.origin_country_duty_rate ? `${product.origin_country_duty_rate}%` : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">素材</span><span>{product.material || '-'}</span></div>
            </div>
          </div>

          <div className="bg-white rounded p-2 border text-[12px]">
            <div className="flex items-center gap-1 mb-2 text-red-500 font-semibold text-[10px]">
              <AlertTriangle size={12} /> VERO・カテゴリ
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">VERO</span>
                {product.is_vero_brand ? <span className="text-red-600 font-semibold">要注意</span> : <span className="text-emerald-600">OK</span>}</div>
              <div className="flex justify-between"><span className="text-gray-500">カテゴリID</span><span className="font-mono">{product.category_id || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">カテゴリ</span><span className="text-[10px] truncate max-w-[100px]">{product.category_name || '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">HTML</span>
                {product.html_content ? <span className="text-emerald-600">✓ 生成済み</span> : <span className="text-gray-400">未生成</span>}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold text-gray-500 mb-1">ACTIONS</div>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-[11px] text-gray-700"
              onClick={() => window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.english_title || product.title || '')}`, '_blank')}>
              <ExternalLink size={12} /> eBay検索
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-[11px] text-white"
              onClick={onOpenModal}>
              <Edit2 size={12} /> 編集
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-[11px] text-red-600">
              <Trash2 size={12} /> 削除
            </button>
          </div>
        </div>
      </td>
    </tr>
  )
}

const LABELS = {
  ja: { title: '商品名', type: 'T', status: 'ST', price: 'JPY', profit: '$', margin: '%', stock: '在', score: 'S', filter: '✓' },
  en: { title: 'Title', type: 'T', status: 'ST', price: 'JPY', profit: '$', margin: '%', stock: 'Qty', score: 'S', filter: '✓' }
}

export function EditingTable({
  products, selectedIds, modifiedIds, onSelectChange, onCellChange, onProductClick, wrapText = false, showTooltips = true, language = 'ja'
}: EditingTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [tooltipsEnabled, setTooltipsEnabled] = useState(showTooltips)
  const L = LABELS[language]

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

  const getJPY = (p: Product) => p.price_jpy ?? p.current_price ?? p.cost_price ?? null
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
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="flex items-center justify-end px-3 py-1.5 border-b bg-gray-50/50">
        <button onClick={() => setTooltipsEnabled(!tooltipsEnabled)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${tooltipsEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
          {tooltipsEnabled ? <Eye size={10} /> : <EyeOff size={10} />} ヒント
        </button>
      </div>

      <div style={{ maxHeight: 'calc(100vh - 260px)', overflow: 'auto' }}>
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 z-10 bg-gray-50 border-b">
            <tr>
              <th className="w-8 px-1 py-1.5 text-center">
                <input type="checkbox" className="w-3 h-3 rounded" checked={selectedIds.size === products.length && products.length > 0} onChange={toggleSelectAll} />
              </th>
              <th className="w-6 px-1 py-1.5"></th>
              <th className="w-12 px-1 py-1.5 text-[9px] text-gray-500">IMG</th>
              <th className="min-w-[200px] max-w-[300px] px-2 py-1.5 text-left text-[9px] text-gray-500">{L.title}</th>
              <th className="w-8 px-1 py-1.5 text-center text-[9px] text-gray-500">{L.type}</th>
              <th className="w-10 px-1 py-1.5 text-center text-[9px] text-gray-500">{L.status}</th>
              <th className="w-16 px-1 py-1.5 text-right text-[9px] text-gray-500">{L.price}</th>
              <th className="w-12 px-1 py-1.5 text-right text-[9px] text-gray-500">{L.profit}</th>
              <th className="w-10 px-1 py-1.5 text-right text-[9px] text-gray-500">{L.margin}</th>
              <th className="w-8 px-1 py-1.5 text-right text-[9px] text-gray-500">{L.stock}</th>
              <th className="w-8 px-1 py-1.5 text-center text-[9px] text-gray-500">{L.score}</th>
              <th className="w-8 px-1 py-1.5 text-center text-[9px] text-gray-500">{L.filter}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const id = String(product.id)
              const isSelected = selectedIds.has(id)
              const isExpanded = expandedIds.has(id)
              const isModified = modifiedIds.has(id)

              return (
                <Fragment key={id}>
                  <tr className={`group ${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'} ${isExpanded ? 'bg-slate-50' : ''}`}
                    style={{ borderLeft: isModified ? '2px solid #f59e0b' : 'none' }}>
                    <td className="px-1 py-1 text-center" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="w-3 h-3 rounded" checked={isSelected} onChange={() => toggleSelect(id)} />
                    </td>
                    <td className="px-1 py-1 text-center">
                      <Tip content="詳細を展開" enabled={tooltipsEnabled}>
                        <button onClick={() => toggleExpand(id)} className="p-0.5 rounded hover:bg-gray-200">
                          {isExpanded ? <ChevronUp size={12} className="text-gray-400" /> : <ChevronDown size={12} className="text-gray-400" />}
                        </button>
                      </Tip>
                    </td>
                    <td className="px-1 py-1">
                      <Tip content="クリックでモーダルを開く" enabled={tooltipsEnabled}>
                        <ImageCell product={product} onClick={() => onProductClick(product)} size={40} />
                      </Tip>
                    </td>
                    <td className="px-2 py-1 min-w-[200px] max-w-[300px]">
                      <div className={`text-[11px] font-medium text-gray-900 ${wrapText ? '' : 'line-clamp-1'}`}>
                        <EditableCell value={product.title} field="title" productId={id} onCellChange={onCellChange} />
                      </div>
                      <div className={`text-[10px] text-gray-500 ${wrapText ? '' : 'line-clamp-1'}`}>
                        <EditableCell value={product.english_title || product.title_en} field="english_title" productId={id} onCellChange={onCellChange} />
                      </div>
                    </td>
                    <td className="px-1 py-1 text-center"><TypeBadge type={product.product_type} showTip={tooltipsEnabled} /></td>
                    <td className="px-1 py-1 text-center"><StatusLight product={product} showTip={tooltipsEnabled} /></td>
                    <td className="px-1 py-1 text-right">
                      <EditableCell value={getJPY(product)} field="price_jpy" productId={id} type="currency" currency="JPY" onCellChange={onCellChange} className="font-mono text-[11px]" />
                    </td>
                    <td className="px-1 py-1 text-right"><ProfitDisplay amount={getProfit(product)} /></td>
                    <td className="px-1 py-1 text-right"><MarginDisplay margin={getMargin(product)} /></td>
                    <td className="px-1 py-1 text-right">
                      <EditableCell value={getStock(product)} field="current_stock" productId={id} type="number" onCellChange={onCellChange} className="font-mono text-[11px]" />
                    </td>
                    <td className="px-1 py-1 text-center"><ScoreDisplay score={getScore(product)} showTip={tooltipsEnabled} /></td>
                    <td className="px-1 py-1 text-center"><FilterLight passed={product.filter_passed} showTip={tooltipsEnabled} /></td>
                  </tr>
                  {isExpanded && <ExpandedContent product={product} onOpenModal={() => onProductClick(product)} />}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="py-16 text-center">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">商品がありません</p>
        </div>
      )}
    </div>
  )
}
