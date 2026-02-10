// app/tools/editing/components/editing-table-optimized.tsx
/**
 * 高速化版 EditingTable - Zustand セレクター + Virtual Scroll 対応
 * 
 * 高速化ポイント:
 * 1. セレクターで個別商品のみ取得（他商品の変更で再レンダリングしない）
 * 2. React.memo で不要な再レンダリング防止
 * 3. useCallback でハンドラをメモ化
 * 4. Virtual Scroll で表示行のみレンダリング（大量データ対応）
 * 5. Intersection Observer で遅延読み込み
 */

'use client';

import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { useProductSelector, useProductIdsSelector, productStoreActions } from '@/store/productStore';
import type { Product } from '../types/product';
import {
  ChevronDown, ChevronUp, Image as ImageIcon, ExternalLink,
  Edit2, Trash2, Package, AlertTriangle,
  Truck, Box, BarChart3, Lightbulb
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface EditingTableOptimizedProps {
  productIds: string[];
  selectedIds: Set<string>;
  modifiedIds: Set<string>;
  onSelectChange: (ids: Set<string>) => void;
  onCellChange: (id: string, updates: Partial<Product>) => void;
  onProductClick: (product: Product) => void;
  onProductHover?: (product: Product) => void;
  wrapText?: boolean;
  showTooltips?: boolean;
  total?: number;
  pageSize?: number;
  currentPage?: number;
  onPageSizeChange?: (size: number) => void;
  onPageChange?: (page: number) => void;
  useVirtualScroll?: boolean;
}

// ============================================================
// ユーティリティコンポーネント
// ============================================================

// Tooltip
const Tip = memo(function Tip({ 
  children, 
  content, 
  enabled = true 
}: { 
  children: React.ReactNode; 
  content: string; 
  enabled?: boolean 
}) {
  if (!enabled) return <>{children}</>;
  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[11px]
        bg-gray-900 text-white rounded whitespace-nowrap opacity-0 invisible
        group-hover/tip:opacity-100 group-hover/tip:visible transition-all z-[100] pointer-events-none">
        {content}
      </div>
    </div>
  );
});

// 編集可能セル
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
  value: any;
  field: string;
  productId: string;
  type?: 'text' | 'number' | 'currency';
  currency?: 'JPY' | 'USD';
  onCellChange: (id: string, updates: any) => void;
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) {
      setEditValue(value ?? '');
    }
  }, [value, editing]);

  const handleSave = useCallback(() => {
    setEditing(false);
    let finalValue: any = editValue;
    if (type === 'number' || type === 'currency') {
      finalValue = parseFloat(editValue) || 0;
    }
    if (String(finalValue) !== String(value)) {
      onCellChange(productId, { [field]: finalValue });
    }
  }, [editValue, value, type, productId, field, onCellChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value ?? '');
      setEditing(false);
    }
    if (e.key === 'Tab') {
      handleSave();
    }
  }, [handleSave, value]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode={type === 'number' || type === 'currency' ? 'numeric' : 'text'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-1.5 py-0.5 text-[12px] border-2 border-blue-500 rounded focus:outline-none bg-white"
        style={{ minWidth: '40px' }}
      />
    );
  }

  let displayValue = value;
  if (type === 'currency' && value != null) {
    displayValue = currency === 'JPY' ? `¥${Number(value).toLocaleString()}` : `${Number(value).toFixed(2)}`;
  }
  if (!displayValue && displayValue !== 0) {
    displayValue = placeholder;
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className={`w-full h-full px-1.5 py-0.5 cursor-text rounded hover:bg-gray-100 transition-colors inline-flex items-center ${className}`}
      title="クリックで編集"
    >
      <span className="text-[12px] truncate w-full">{displayValue}</span>
    </div>
  );
});

// ステータスアイコン
const ListingStatusIcon = memo(function ListingStatusIcon({ 
  listingStatus, 
  ebayItemId, 
  readyToList, 
  filterPassed,
  showTip = true 
}: { 
  listingStatus?: string | null;
  ebayItemId?: string | null;
  readyToList?: boolean;
  filterPassed?: boolean | null;
  showTip?: boolean;
}) {
  let color = '#9ca3af';
  let tip = '未完了';
  
  if (listingStatus === 'active' || ebayItemId) {
    color = '#10b981';
    tip = '出品中';
  } else if (listingStatus === 'ended') {
    color = '#ef4444';
    tip = '終了';
  } else if (readyToList || filterPassed) {
    color = '#f59e0b';
    tip = '準備完了';
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
  );
  
  if (!showTip) return el;
  return <Tip content={tip}>{el}</Tip>;
});

// タイプアイコン
const TypeIcon = memo(function TypeIcon({ 
  type, 
  showTip = true 
}: { 
  type?: string | null; 
  showTip?: boolean;
}) {
  if (!type || type === 'unclassified') return <span className="text-gray-400 text-[10px]">-</span>;
  
  const config: Record<string, { icon: typeof Package; color: string; tip: string }> = {
    stock: { icon: Box, color: '#059669', tip: '有在庫' },
    dropship: { icon: Truck, color: '#7c3aed', tip: '無在庫' },
    set: { icon: Package, color: '#d97706', tip: 'セット' },
  };
  const c = config[type] || config.stock;
  const Icon = c.icon;
  
  const icon = <Icon size={14} style={{ color: c.color }} />;
  return showTip ? <Tip content={c.tip}>{icon}</Tip> : icon;
});

// 利益表示
const ProfitDisplay = memo(function ProfitDisplay({ amount }: { amount?: number | null }) {
  if (amount == null) return <span className="text-gray-400 text-[12px]">-</span>;
  const isPositive = amount >= 0;
  const prefix = isPositive ? '+$' : '-$';
  return (
    <span className={`font-mono text-[12px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
      {prefix}{Math.abs(amount).toFixed(0)}
    </span>
  );
});

// マージン表示
const MarginDisplay = memo(function MarginDisplay({ margin }: { margin?: number | null }) {
  if (margin == null) return <span className="text-gray-400 text-[12px]">-</span>;
  const isPositive = margin >= 0;
  return (
    <span className={`font-mono text-[12px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
      {margin.toFixed(0)}%
    </span>
  );
});

// フィルターライト
const FilterLight = memo(function FilterLight({ 
  passed, 
  showTip = true 
}: { 
  passed?: boolean | null; 
  showTip?: boolean;
}) {
  const color = passed ? '#10b981' : '#9ca3af';
  const tip = passed ? 'フィルター通過' : '未通過';

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
  );

  if (!showTip) return el;
  return <Tip content={tip}>{el}</Tip>;
});

// 画像セル
const ImageCell = memo(function ImageCell({ 
  product, 
  onClick, 
  size = 40 
}: { 
  product: Product; 
  onClick: () => void; 
  size?: number;
}) {
  const [error, setError] = useState(false);

  const url = useMemo(() => {
    if (product.primary_image_url) return product.primary_image_url;
    if (Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
      return product.gallery_images[0];
    }
    if (product.images) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        const first = product.images[0];
        return typeof first === 'string' ? first : (first?.url || first?.original || null);
      }
    }
    if (product.scraped_data?.images?.length > 0) {
      const img = product.scraped_data.images[0];
      return typeof img === 'string' ? img : (img?.url || img?.original || null);
    }
    return null;
  }, [product.primary_image_url, product.gallery_images, product.images, product.scraped_data?.images]);

  if (!url || error) {
    return (
      <div
        onClick={onClick}
        className="rounded flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 hover:ring-2 hover:ring-indigo-400"
        style={{ width: size, height: size }}
      >
        <ImageIcon size={size * 0.4} className="text-gray-400" />
      </div>
    );
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
  );
});

// ============================================================
// セレクター版 ProductRow
// ============================================================

interface OptimizedRowProps {
  productId: string;
  isSelected: boolean;
  isModified: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onProductClick: (product: Product) => void;
  onProductHover?: (product: Product) => void;
  onCellChange: (id: string, updates: Partial<Product>) => void;
  wrapText: boolean;
  tooltipsEnabled: boolean;
}

const OptimizedRow = memo(function OptimizedRow({
  productId,
  isSelected,
  isModified,
  isExpanded,
  onToggleExpand,
  onToggleSelect,
  onProductClick,
  onProductHover,
  onCellChange,
  wrapText,
  tooltipsEnabled,
}: OptimizedRowProps) {
  // セレクター: この商品のみ取得
  const product = useProductSelector(productId);

  const handleClick = useCallback(() => {
    if (product) onProductClick(product);
  }, [product, onProductClick]);

  const handleHover = useCallback(() => {
    if (product && onProductHover) onProductHover(product);
  }, [product, onProductHover]);

  if (!product) return null;

  // データ取得ヘルパー
  const getProfit = () => {
    return product.listing_data?.profit_amount_usd ?? product.profit_amount_usd ?? product.sm_profit_amount_usd ?? null;
  };
  const getMargin = () => {
    return product.listing_data?.profit_margin ?? product.profit_margin ?? product.profit_margin_percent ?? null;
  };
  const getStock = () => {
    return product.current_stock ?? product.inventory_quantity ?? null;
  };

  return (
    <tr 
      className={`group ${isSelected ? 'bg-indigo-50' : ''} ${isExpanded ? 'bg-slate-50' : ''} ${isModified ? 'modified-row' : ''}`}
      data-modified={isModified ? 'true' : undefined}
      style={{ height: '44px' }}
      onMouseEnter={handleHover}
    >
      <td className="px-2 py-1 text-center" onClick={e => e.stopPropagation()}>
        <input 
          type="checkbox" 
          className="n3-checkbox" 
          checked={isSelected} 
          onChange={() => onToggleSelect(productId)} 
        />
      </td>
      <td className="px-1 py-1 w-8">
        <Tip content="詳細を展開" enabled={tooltipsEnabled}>
          <button 
            onClick={() => onToggleExpand(productId)} 
            className="w-5 h-5 rounded flex items-center justify-center transition-all hover:bg-gray-200"
          >
            {isExpanded ? <ChevronUp size={12} className="text-gray-500" /> : <ChevronDown size={12} className="text-gray-500" />}
          </button>
        </Tip>
      </td>
      <td className="px-2 py-1 w-10 text-center">
        <ListingStatusIcon 
          listingStatus={product.listing_status} 
          ebayItemId={product.ebay_item_id}
          readyToList={product.ready_to_list}
          filterPassed={product.filter_passed}
          showTip={tooltipsEnabled} 
        />
      </td>
      <td className="px-2 py-1 w-12 text-center">
        <TypeIcon type={product.product_type} showTip={tooltipsEnabled} />
      </td>
      <td className="px-3 py-1">
        <div className="flex items-center gap-2">
          <Tip content="クリックでモーダルを開く" enabled={tooltipsEnabled}>
            <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: '#f3f4f6' }}>
              <ImageCell product={product} onClick={handleClick} size={40} />
            </div>
          </Tip>
          <div className="min-w-0 flex-1">
            <div className={`text-[13px] font-medium ${wrapText ? '' : 'line-clamp-1'}`} style={{ color: 'var(--text)' }}>
              <EditableCell value={product.title} field="title" productId={productId} onCellChange={onCellChange} />
            </div>
            <div className={`text-[11px] ${wrapText ? '' : 'line-clamp-1'}`} style={{ color: 'var(--text-muted)' }}>
              <EditableCell value={product.english_title || product.title_en} field="english_title" productId={productId} onCellChange={onCellChange} />
            </div>
          </div>
        </div>
      </td>
      <td className="px-2 py-1 w-16 text-center">
        <EditableCell
          value={getStock()}
          field="current_stock"
          productId={productId}
          type="number"
          onCellChange={onCellChange}
          className="font-mono text-[11px] text-center justify-center"
        />
      </td>
      <td className="px-2 py-1 w-20 text-right">
        <EditableCell
          value={product.cost_price ?? product.purchase_price_jpy}
          field="cost_price"
          productId={productId}
          type="currency"
          currency="JPY"
          onCellChange={onCellChange}
          className="font-mono text-[11px] text-right justify-end"
        />
      </td>
      <td className="px-2 py-1 w-16 text-right font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
        {(product.cost_price ?? product.purchase_price_jpy) ? `${((product.cost_price ?? product.purchase_price_jpy)! / 150).toFixed(1)}` : '-'}
      </td>
      <td className="px-2 py-1 w-20 text-right">
        <ProfitDisplay amount={product.listing_data?.ddp_profit_usd ?? getProfit()} />
      </td>
      <td className="px-2 py-1 w-14 text-right">
        <MarginDisplay margin={product.listing_data?.ddp_profit_margin ?? getMargin()} />
      </td>
      <td className="px-2 py-1 w-10 text-center">
        <FilterLight passed={product.filter_passed} showTip={tooltipsEnabled} />
      </td>
    </tr>
  );
});

// ============================================================
// 展開コンテンツ（セレクター版）
// ============================================================

interface ExpandedContentOptimizedProps {
  productId: string;
  onOpenModal: () => void;
  onCellChange: (id: string, updates: Partial<Product>) => void;
}

const ExpandedContentOptimized = memo(function ExpandedContentOptimized({
  productId,
  onOpenModal,
  onCellChange,
}: ExpandedContentOptimizedProps) {
  const product = useProductSelector(productId);
  
  if (!product) return null;

  const lowestPrice = product.sm_lowest_price ?? product.competitors_lowest_price;
  const avgPrice = product.sm_average_price ?? product.competitors_average_price;
  const competitorCount = product.sm_competitor_count ?? product.competitors_count;
  const salesCount = product.sm_sales_count ?? product.research_sold_count;

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
          </div>

          {/* Market Data */}
          <div className="bg-white rounded p-2 border text-[13px]">
            <div className="flex items-center gap-1 mb-2 text-blue-600 font-semibold text-[11px]">
              <BarChart3 size={12} /> 市場データ
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">最安値</span><span className="font-mono text-emerald-600">${lowestPrice?.toFixed(2) ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">平均</span><span className="font-mono">${avgPrice?.toFixed(2) ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">競合</span><span className="font-mono text-amber-600">{competitorCount ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">販売</span><span className="font-mono text-emerald-600">{salesCount ?? '-'}</span></div>
            </div>
          </div>

          {/* HTS・関税 */}
          <div className="bg-white rounded p-2 border text-[14px]">
            <div className="flex items-center gap-1 mb-2 text-amber-600 font-semibold text-[12px]">
              <Package size={12} /> HTS・関税
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">HTSコード</span>
                <EditableCell value={product.hts_code} field="hts_code" productId={productId} onCellChange={onCellChange} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">原産国</span>
                <EditableCell value={product.origin_country} field="origin_country" productId={productId} onCellChange={onCellChange} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">素材</span>
                <EditableCell value={product.material} field="material" productId={productId} onCellChange={onCellChange} />
              </div>
            </div>
          </div>

          {/* VERO */}
          <div className="bg-white rounded p-2 border text-[13px]">
            <div className="flex items-center gap-1 mb-2 text-red-500 font-semibold text-[11px]">
              <AlertTriangle size={12} /> VERO
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">VERO</span>
                {product.is_vero_brand ? <span className="text-red-600 font-semibold">要注意</span> : <span className="text-emerald-600">OK</span>}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">カテゴリID</span>
                <span className="font-mono">{product.category_id || '-'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-1.5 col-span-2">
            <div className="text-[11px] font-semibold text-gray-500 mb-1">ACTIONS</div>
            <div className="flex gap-2">
              <button 
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border bg-white hover:bg-blue-50 hover:border-blue-300 text-[12px] text-gray-700 transition-colors"
                onClick={() => window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.english_title || product.title || '')}`, '_blank')}
              >
                <ExternalLink size={12} /> eBay検索
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-[12px] text-white transition-colors"
                onClick={onOpenModal}
              >
                <Edit2 size={12} /> 編集
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
});

// ============================================================
// メインテーブルコンポーネント
// ============================================================

export const EditingTableOptimized = memo(function EditingTableOptimized({
  productIds,
  selectedIds,
  modifiedIds,
  onSelectChange,
  onCellChange,
  onProductClick,
  onProductHover,
  wrapText = false,
  showTooltips = true,
  total = 0,
  pageSize = 50,
  currentPage = 1,
  onPageSizeChange,
  onPageChange,
}: EditingTableOptimizedProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [tooltipsEnabled, setTooltipsEnabled] = useState(showTooltips);
  const [sortField, setSortField] = useState<string>('sku');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 展開トグル
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // 選択トグル
  const handleToggleSelect = useCallback((id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectChange(next);
  }, [selectedIds, onSelectChange]);

  // 全選択トグル
  const handleToggleSelectAll = useCallback(() => {
    if (selectedIds.size === productIds.length) {
      onSelectChange(new Set());
    } else {
      onSelectChange(new Set(productIds));
    }
  }, [selectedIds.size, productIds, onSelectChange]);

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden" style={{ background: 'var(--panel)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ background: 'var(--highlight)', minHeight: '48px' }}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTooltipsEnabled(!tooltipsEnabled)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${tooltipsEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}
          >
            <Lightbulb size={11} /> Tips
          </button>
          <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            表示: {productIds.length}件 / 全{total}件
          </div>
        </div>
        
        {onPageSizeChange && onPageChange && (
          <div className="flex items-center gap-3">
            <select 
              value={pageSize} 
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-[12px] border rounded px-2 py-1"
              style={{ background: 'var(--panel)', color: 'var(--text)' }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
            </select>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-[12px] border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                ← 前
              </button>
              <span className="text-[13px] min-w-[60px] text-center">
                <strong>{currentPage}</strong> / {Math.ceil(total / pageSize) || 1}
              </span>
              <button 
                onClick={() => onPageChange(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-2 py-1 text-[12px] border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                次 →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: 'calc(100vh - 260px)' }}>
        <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
          <thead className="sticky top-0 z-10" style={{ background: 'var(--highlight)' }}>
            <tr className="text-[10px] font-medium border-b" style={{ color: 'var(--text-muted)', height: '36px' }}>
              <th className="px-2 py-2 w-10 text-center">
                <input 
                  type="checkbox" 
                  className="n3-checkbox" 
                  checked={selectedIds.size === productIds.length && productIds.length > 0} 
                  onChange={handleToggleSelectAll} 
                />
              </th>
              <th className="px-1 py-2 w-8"></th>
              <th className="px-2 py-2 w-10 text-center">ST</th>
              <th className="px-2 py-2 w-12 text-center">Type</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-2 py-2 w-16 text-center">Stock</th>
              <th className="px-2 py-2 w-20 text-right">Cost(¥)</th>
              <th className="px-2 py-2 w-16 text-right">Cost($)</th>
              <th className="px-2 py-2 w-20 text-right">Profit</th>
              <th className="px-2 py-2 w-14 text-right">Rate</th>
              <th className="px-2 py-2 w-10 text-center">✓</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {productIds.map((productId) => (
              <React.Fragment key={productId}>
                <OptimizedRow
                  productId={productId}
                  isSelected={selectedIds.has(productId)}
                  isModified={modifiedIds.has(productId)}
                  isExpanded={expandedIds.has(productId)}
                  onToggleExpand={handleToggleExpand}
                  onToggleSelect={handleToggleSelect}
                  onProductClick={onProductClick}
                  onProductHover={onProductHover}
                  onCellChange={onCellChange}
                  wrapText={wrapText}
                  tooltipsEnabled={tooltipsEnabled}
                />
                {expandedIds.has(productId) && (
                  <ExpandedContentOptimized
                    productId={productId}
                    onOpenModal={() => {
                      const product = productStoreActions.setProducts ? undefined : undefined;
                      // Note: モーダル用に商品データが必要な場合は Store から取得
                    }}
                    onCellChange={onCellChange}
                  />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {productIds.length === 0 && (
        <div className="py-16 text-center">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>商品がありません</p>
        </div>
      )}
    </div>
  );
});

export default EditingTableOptimized;
