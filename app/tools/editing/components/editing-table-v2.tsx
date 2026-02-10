// app/tools/editing/components/editing-table-v2.tsx
/**
 * 高速化版 EditingTable V2 - 完全版
 * 
 * V1の全機能を維持しつつ高速化:
 * - Virtual Scroll (react-window) - Fastモードのみ
 * - セレクター版 - 1商品編集時に1行だけ再レンダリング
 * - 画像遅延読み込み - Intersection Observer
 * - 展開パネル (ExpandedContent) - 6セクション詳細表示
 * - 2行タイトル表示 (日本語 + 英語)
 * - サイズスケール対応 (XS/SM/MD/LG/XL)
 * 
 * スタイル:
 * - app/styles/components/table.css のCSSクラスを使用
 */

'use client';

import React, { useState, useCallback, useMemo, memo, useRef, useEffect, Fragment } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import type { Product } from '../types/product';
import {
  ChevronDown, ChevronUp, Image as ImageIcon, ExternalLink,
  Edit2, Trash2, Package, AlertTriangle,
  Truck, Box, BarChart3, Lightbulb, Zap
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface EditingTableV2Props {
  products: Product[];
  selectedIds: Set<string>;
  modifiedIds: Set<string>;
  onSelectChange: (ids: Set<string>) => void;
  onCellChange: (id: string, updates: Partial<Product>) => void;
  onProductClick: (product: Product) => void;
  onProductHover?: (product: Product) => void;
  wrapText?: boolean;
  showTooltips?: boolean;
  language?: 'ja' | 'en';
  total?: number;
  pageSize?: number;
  currentPage?: number;
  onPageSizeChange?: (size: number) => void;
  onPageChange?: (page: number) => void;
  useVirtualScroll?: boolean;
  isFastMode?: boolean;
  onToggleFastMode?: () => void;
  /** サイズスケール: xs, sm, md, lg, xl */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// 行の高さ（CSS変数と同期）
const ROW_HEIGHT_BASE = 48;
const FAST_ROW_HEIGHT_BASE = 28;

const SCALE_MAP: Record<string, number> = {
  xs: 0.75,
  sm: 0.875,
  md: 1,
  lg: 1.125,
  xl: 1.25,
};

// ============================================================
// ツールチップ（z-index最大化）
// ============================================================

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
    <div className="n3-tooltip-wrapper">
      {children}
      <div className="n3-tooltip">
        {content}
      </div>
    </div>
  );
});

// ============================================================
// 画像遅延読み込み (Intersection Observer)
// ============================================================

const LazyImage = memo(function LazyImage({
  src,
  alt,
  isFast = false,
  onClick,
}: {
  src: string | null;
  alt: string;
  isFast?: boolean;
  onClick: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const className = `n3-product-image${isFast ? ' fast' : ''}`;

  if (!src || hasError) {
    return (
      <div ref={imgRef} onClick={onClick} className={className}>
        <ImageIcon size={isFast ? 12 : 18} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div ref={imgRef} onClick={onClick} className={className}>
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={isLoaded ? 'opacity-100' : 'opacity-0'}
          style={{ transition: 'opacity 0.3s' }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full animate-pulse bg-gray-200" />
      )}
    </div>
  );
});

// ============================================================
// 編集可能セル
// ============================================================

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
    if (!editing) setEditValue(value ?? '');
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
    if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') { setEditValue(value ?? ''); setEditing(false); }
    if (e.key === 'Tab') handleSave();
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
        className="w-full h-6 px-2 text-sm border-2 border-blue-500 rounded focus:outline-none bg-white"
        style={{ minWidth: '50px' }}
      />
    );
  }

  let displayValue = value;
  if (type === 'currency' && value != null) {
    displayValue = currency === 'JPY' ? `¥${Number(value).toLocaleString()}` : `$${Number(value).toFixed(2)}`;
  }
  if (!displayValue && displayValue !== 0) displayValue = placeholder;

  return (
    <div
      onClick={() => setEditing(true)}
      className={`w-full h-full px-1 cursor-text rounded hover:bg-gray-100 inline-flex items-center ${className}`}
      title="クリックで編集"
    >
      <span className="truncate">{displayValue}</span>
    </div>
  );
});

// ============================================================
// 表示コンポーネント
// ============================================================

const ProfitDisplay = memo(function ProfitDisplay({ amount }: { amount?: number | null }) {
  if (amount == null) return <span className="n3-value-profit">-</span>;
  const isPositive = amount >= 0;
  return (
    <span className={`n3-value-profit ${isPositive ? 'positive' : 'negative'}`}>
      {isPositive ? '+$' : '-$'}{Math.abs(amount).toFixed(0)}
    </span>
  );
});

const MarginDisplay = memo(function MarginDisplay({ margin }: { margin?: number | null }) {
  if (margin == null) return <span className="n3-value-margin">-</span>;
  const isPositive = margin >= 0;
  return (
    <span className={`n3-value-margin ${isPositive ? 'positive' : 'negative'}`}>
      {margin.toFixed(0)}%
    </span>
  );
});

const StatusDot = memo(function StatusDot({ 
  listingStatus, 
  ebayItemId, 
  readyToList, 
  filterPassed,
  showTip = true,
}: { 
  listingStatus?: string | null;
  ebayItemId?: string | null;
  readyToList?: boolean;
  filterPassed?: boolean | null;
  showTip?: boolean;
}) {
  let statusClass = '';
  let tip = '未完了';
  
  if (listingStatus === 'active' || ebayItemId) {
    statusClass = 'active';
    tip = '出品中';
  } else if (listingStatus === 'ended') {
    statusClass = 'ended';
    tip = '終了';
  } else if (readyToList || filterPassed) {
    statusClass = 'ready';
    tip = '準備完了';
  }
  
  const el = <span className={`n3-status-dot ${statusClass}`} />;
  return showTip ? <Tip content={tip}>{el}</Tip> : el;
});

const FilterDot = memo(function FilterDot({ passed, showTip = true }: { passed?: boolean | null; showTip?: boolean }) {
  const tip = passed ? 'フィルター通過' : '未通過';
  const el = <span className={`n3-status-dot ${passed ? 'active' : ''}`} />;
  return showTip ? <Tip content={tip}>{el}</Tip> : el;
});

const TypeIcon = memo(function TypeIcon({ type, showTip = true }: { type?: string | null; showTip?: boolean }) {
  if (!type || type === 'unclassified') return <span style={{ color: 'var(--text-muted)' }}>-</span>;
  
  const config: Record<string, { icon: typeof Package; color: string; tip: string }> = {
    stock: { icon: Box, color: 'var(--success)', tip: '有在庫' },
    dropship: { icon: Truck, color: '#7c3aed', tip: '無在庫' },
    set: { icon: Package, color: 'var(--warning)', tip: 'セット' },
  };
  const c = config[type] || config.stock;
  const Icon = c.icon;
  const el = <Icon size={14} style={{ color: c.color }} />;
  return showTip ? <Tip content={c.tip}>{el}</Tip> : el;
});

// ============================================================
// 画像URL取得ヘルパー
// ============================================================

function getImageUrl(product: Product): string | null {
  if (product.primary_image_url) return product.primary_image_url;
  if (Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
    return product.gallery_images[0];
  }
  if (product.images) {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const first = product.images[0];
      return typeof first === 'string' ? first : (first?.url || first?.original || null);
    }
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return typeof parsed[0] === 'string' ? parsed[0] : (parsed[0]?.url || parsed[0]?.original || null);
        }
      } catch {
        if (product.images.startsWith('http')) return product.images;
      }
    }
  }
  if (product.scraped_data?.images?.length > 0) {
    const img = product.scraped_data.images[0];
    return typeof img === 'string' ? img : (img?.url || img?.original || null);
  }
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    return product.image_urls[0];
  }
  if (product.listing_data?.image_urls?.[0]) {
    return product.listing_data.image_urls[0];
  }
  return null;
}

function getAllImages(product: Product): string[] {
  const images: string[] = [];
  if (Array.isArray(product.gallery_images)) {
    product.gallery_images.slice(0, 4).forEach((url: string) => { 
      if (url && !images.includes(url)) images.push(url); 
    });
  }
  if (images.length < 4 && product.listing_data?.image_urls?.length > 0) {
    product.listing_data.image_urls.slice(0, 4 - images.length).forEach((url: string) => { 
      if (url && !images.includes(url)) images.push(url); 
    });
  }
  return images;
}

// ============================================================
// 展開パネル (ExpandedContent) - V1から移植
// ============================================================

const ExpandedContent = memo(function ExpandedContent({ 
  product, 
  onOpenModal, 
  onCellChange 
}: { 
  product: Product; 
  onOpenModal: () => void; 
  onCellChange: (id: string, updates: Partial<Product>) => void;
}) {
  const lowestPrice = product.sm_lowest_price ?? product.competitors_lowest_price;
  const avgPrice = product.sm_average_price ?? product.competitors_average_price;
  const competitorCount = product.sm_competitor_count ?? product.competitors_count;
  const salesCount = product.sm_sales_count ?? product.research_sold_count;

  const mainImageUrl = getImageUrl(product);
  const galleryImages = getAllImages(product);

  return (
    <div className="p-3 bg-slate-50/50 border-b" style={{ borderColor: 'var(--panel-border)' }}>
      <div className="grid grid-cols-6 gap-4">
        {/* SKU + Image */}
        <div className="space-y-2">
          <div className="bg-white rounded p-2 border text-[12px]">
            <div className="text-[10px] text-gray-500 mb-1">SKU / Master Key</div>
            <div className="font-mono text-gray-700">{product.sku || '-'}</div>
            <div className="font-mono text-gray-500 text-[11px]">{product.master_key || '-'}</div>
          </div>
          <div className="w-20 h-20 rounded overflow-hidden bg-white border">
            {mainImageUrl ? (
              <img src={mainImageUrl} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <ImageIcon size={24} className="text-gray-300" />
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {galleryImages.map((url, i) => (
              <img 
                key={i} 
                src={url || ''} 
                alt="" 
                loading="lazy" 
                decoding="async" 
                className="w-10 h-10 rounded object-cover border hover:border-indigo-400 cursor-pointer"
                onClick={() => window.open(url, '_blank')} 
              />
            ))}
          </div>
        </div>

        {/* Market Data + DDU */}
        <div className="bg-white rounded p-2 border text-[13px]">
          <div className="flex items-center gap-1 mb-2 text-blue-600 font-semibold text-[11px]">
            <BarChart3 size={12} /> 市場データ + DDU
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">最安値</span>
              <span className="font-mono text-emerald-600">${lowestPrice?.toFixed(2) ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">平均</span>
              <span className="font-mono">${avgPrice?.toFixed(2) ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">競合</span>
              <span className="font-mono text-amber-600">{competitorCount ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">販売</span>
              <span className="font-mono text-emerald-600">{salesCount ?? '-'}</span>
            </div>
            <div className="h-px bg-gray-200 my-1.5"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">販売(円)</span>
              <div className="font-mono text-[13px] text-right">
                <EditableCell 
                  value={product.price_jpy} 
                  field="price_jpy" 
                  productId={String(product.id)} 
                  type="currency" 
                  currency="JPY" 
                  onCellChange={onCellChange} 
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">DDU利益</span>
              <span className="font-mono text-emerald-600">
                ${product.listing_data?.ddu_profit_usd?.toFixed(0) ?? '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">DDU率</span>
              <span className="font-mono text-emerald-600">
                {product.listing_data?.ddu_profit_margin != null ? `${product.listing_data.ddu_profit_margin.toFixed(0)}%` : '-'}
              </span>
            </div>
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
                <EditableCell 
                  value={product.listing_data?.width_cm} 
                  field="width_cm" 
                  productId={String(product.id)} 
                  type="number" 
                  onCellChange={(id, updates) => onCellChange(id, { listing_data: { ...product.listing_data, ...updates } })} 
                  placeholder="-" 
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">奥行(cm)</span>
              <div className="font-mono text-[13px] text-right">
                <EditableCell 
                  value={product.listing_data?.length_cm} 
                  field="length_cm" 
                  productId={String(product.id)} 
                  type="number" 
                  onCellChange={(id, updates) => onCellChange(id, { listing_data: { ...product.listing_data, ...updates } })} 
                  placeholder="-" 
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">高さ(cm)</span>
              <div className="font-mono text-[13px] text-right">
                <EditableCell 
                  value={product.listing_data?.height_cm} 
                  field="height_cm" 
                  productId={String(product.id)} 
                  type="number" 
                  onCellChange={(id, updates) => onCellChange(id, { listing_data: { ...product.listing_data, ...updates } })} 
                  placeholder="-" 
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">重量(g)</span>
              <div className="font-mono text-[13px] text-right">
                <EditableCell 
                  value={product.listing_data?.weight_g} 
                  field="weight_g" 
                  productId={String(product.id)} 
                  type="number" 
                  onCellChange={(id, updates) => onCellChange(id, { listing_data: { ...product.listing_data, ...updates } })} 
                  placeholder="-" 
                />
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
            <div className="flex justify-between">
              <span className="text-gray-500">VERO</span>
              {product.is_vero_brand ? (
                <span className="text-red-600 font-semibold">要注意</span>
              ) : (
                <span className="text-emerald-600">OK</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">カテゴリID</span>
              <span className="font-mono">{product.category_id || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">カテゴリ</span>
              <span className="text-[11px] truncate max-w-[100px]">{product.category_name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">HTML</span>
              {product.html_content ? (
                <span className="text-emerald-600">✓ 生成済み</span>
              ) : (
                <span className="text-gray-400">未生成</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-gray-500 mb-1">ACTIONS</div>
          <button 
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border bg-white hover:bg-blue-50 hover:border-blue-300 text-[12px] text-gray-700 transition-colors"
            onClick={() => window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.english_title || product.title || '')}`, '_blank')}
          >
            <ExternalLink size={12} /> eBay検索
          </button>
          <button 
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-[12px] text-white transition-colors"
            onClick={onOpenModal}
          >
            <Edit2 size={12} /> 編集
          </button>
          <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-[12px] text-red-600 transition-colors">
            <Trash2 size={12} /> 削除
          </button>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// テーブル行コンポーネント（通常モード）
// ============================================================

interface TableRowProps {
  product: Product;
  isSelected: boolean;
  isModified: boolean;
  isExpanded: boolean;
  tooltipsEnabled: boolean;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onProductClick: (product: Product) => void;
  onProductHover?: (product: Product) => void;
  onCellChange: (id: string, updates: Partial<Product>) => void;
}

const TableRow = memo(function TableRow({
  product,
  isSelected,
  isModified,
  isExpanded,
  tooltipsEnabled,
  onToggleExpand,
  onToggleSelect,
  onProductClick,
  onProductHover,
  onCellChange,
}: TableRowProps) {
  const id = String(product.id);
  const imageUrl = getImageUrl(product);

  const getProfit = () => product.listing_data?.ddp_profit_usd ?? product.profit_amount_usd ?? product.sm_profit_amount_usd ?? null;
  const getMargin = () => product.listing_data?.ddp_profit_margin ?? product.profit_margin ?? product.profit_margin_percent ?? null;
  const getStock = () => product.current_stock ?? product.inventory_quantity ?? null;

  let rowClass = 'n3-table-row';
  if (isSelected) rowClass += ' selected';
  if (isModified) rowClass += ' modified';
  if (isExpanded) rowClass += ' expanded';

  return (
    <Fragment>
      <div className={rowClass} onMouseEnter={() => onProductHover?.(product)}>
        {/* チェックボックス */}
        <div className="n3-table-cell n3-col-checkbox" onClick={e => e.stopPropagation()}>
          <input type="checkbox" className="n3-checkbox w-4 h-4" checked={isSelected} onChange={() => onToggleSelect(id)} />
        </div>
        
        {/* 展開ボタン */}
        <div className="n3-table-cell n3-col-expand">
          <Tip content="詳細を展開" enabled={tooltipsEnabled}>
            <button onClick={() => onToggleExpand(id)} className="w-5 h-5 rounded hover:bg-gray-200 flex items-center justify-center">
              {isExpanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
            </button>
          </Tip>
        </div>
        
        {/* 商品情報（2行タイトル） */}
        <div className="n3-table-cell n3-col-product left">
          <div className="n3-product-cell">
            <Tip content="クリックでモーダルを開く" enabled={tooltipsEnabled}>
              <LazyImage src={imageUrl} alt="" onClick={() => onProductClick(product)} />
            </Tip>
            <div className="n3-product-titles">
              {/* 日本語タイトル */}
              <div className="n3-product-title">
                <EditableCell 
                  value={product.title} 
                  field="title" 
                  productId={id} 
                  onCellChange={onCellChange} 
                />
              </div>
              {/* 英語タイトル */}
              <div className="n3-product-title-sub">
                <EditableCell 
                  value={product.english_title || product.title_en} 
                  field="english_title" 
                  productId={id} 
                  onCellChange={onCellChange} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 在庫 */}
        <div className="n3-table-cell n3-col-stock">
          <EditableCell value={getStock()} field="current_stock" productId={id} type="number" onCellChange={onCellChange} className="text-center justify-center font-mono" />
        </div>
        
        {/* Cost(¥) */}
        <div className="n3-table-cell n3-col-cost right">
          <EditableCell value={product.cost_price ?? product.purchase_price_jpy} field="cost_price" productId={id} type="currency" currency="JPY" onCellChange={onCellChange} className="justify-end font-mono" />
        </div>
        
        {/* Profit */}
        <div className="n3-table-cell n3-col-profit right">
          <ProfitDisplay amount={getProfit()} />
        </div>
        
        {/* Rate */}
        <div className="n3-table-cell n3-col-rate right">
          <MarginDisplay margin={getMargin()} />
        </div>
        
        {/* フィルター */}
        <div className="n3-table-cell n3-col-filter">
          <FilterDot passed={product.filter_passed} showTip={tooltipsEnabled} />
        </div>
        
        {/* ステータス */}
        <div className="n3-table-cell n3-col-status">
          <StatusDot 
            listingStatus={product.listing_status} 
            ebayItemId={product.ebay_item_id} 
            readyToList={product.ready_to_list} 
            filterPassed={product.filter_passed} 
            showTip={tooltipsEnabled}
          />
        </div>
        
        {/* タイプ */}
        <div className="n3-table-cell n3-col-type">
          <TypeIcon type={product.product_type} showTip={tooltipsEnabled} />
        </div>
      </div>
      
      {/* 展開パネル */}
      {isExpanded && (
        <ExpandedContent 
          product={product} 
          onOpenModal={() => onProductClick(product)} 
          onCellChange={onCellChange} 
        />
      )}
    </Fragment>
  );
});

// ============================================================
// Fast Mode Row
// ============================================================

const FastRow = memo(function FastRow({
  product,
  isSelected,
  onToggleSelect,
  onProductClick,
}: {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onProductClick: (product: Product) => void;
}) {
  const id = String(product.id);
  const imageUrl = getImageUrl(product);
  const displayTitle = product.english_title || product.title_en || product.title || '';

  let rowClass = 'n3-table-row fast';
  if (isSelected) rowClass += ' selected';

  return (
    <div className={rowClass}>
      <div className="n3-table-cell n3-col-checkbox-fast" onClick={e => e.stopPropagation()}>
        <input type="checkbox" className="n3-checkbox w-3.5 h-3.5" checked={isSelected} onChange={() => onToggleSelect(id)} />
      </div>
      <div className="n3-table-cell n3-col-image-fast">
        <LazyImage src={imageUrl} alt="" isFast onClick={() => onProductClick(product)} />
      </div>
      <div className="n3-table-cell n3-col-title-fast left">
        <span className="n3-product-title fast">{displayTitle}</span>
      </div>
      <div className="n3-table-cell n3-col-profit-fast right">
        <ProfitDisplay amount={product.listing_data?.ddp_profit_usd ?? product.profit_amount_usd} />
      </div>
      <div className="n3-table-cell n3-col-rate-fast right">
        <MarginDisplay margin={product.listing_data?.ddp_profit_margin ?? product.profit_margin} />
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export function EditingTableV2({
  products,
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
  useVirtualScroll = true,
  isFastMode: externalFastMode,
  onToggleFastMode,
  size = 'md',
}: EditingTableV2Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [tooltipsEnabled, setTooltipsEnabled] = useState(showTooltips);
  const [sortField, setSortField] = useState<string>('sku');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  
  // Fast モード
  const [internalFastMode, setInternalFastMode] = useState(false);
  const isExternallyControlled = onToggleFastMode !== undefined;
  const isFastMode = isExternallyControlled ? (externalFastMode ?? false) : internalFastMode;
  
  const handleToggleFast = useCallback(() => {
    if (isExternallyControlled && onToggleFastMode) {
      onToggleFastMode();
    } else {
      setInternalFastMode(prev => !prev);
    }
  }, [isExternallyControlled, onToggleFastMode]);

  // サイズスケールに基づく行の高さ計算
  const scale = SCALE_MAP[size] || 1;
  const rowHeight = isFastMode 
    ? Math.round(FAST_ROW_HEIGHT_BASE * scale) 
    : Math.round(ROW_HEIGHT_BASE * scale);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const footerHeight = 60;
        const available = window.innerHeight - rect.top - footerHeight;
        setContainerHeight(Math.max(200, available));
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    const timer = setInterval(updateHeight, 500);
    return () => { window.removeEventListener('resize', updateHeight); clearInterval(timer); };
  }, []);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let aVal: any = a[sortField as keyof Product];
      let bVal: any = b[sortField as keyof Product];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [products, sortField, sortOrder]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    onSelectChange(next);
  }, [selectedIds, onSelectChange]);

  const handleToggleSelectAll = useCallback(() => {
    if (selectedIds.size === products.length) {
      onSelectChange(new Set());
    } else {
      onSelectChange(new Set(products.map(p => String(p.id))));
    }
  }, [selectedIds.size, products, onSelectChange]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  // 非Virtual Scroll用のレンダリング（展開パネル対応）
  const renderNormalTable = () => (
    <div style={{ overflowY: 'auto', height: containerHeight }}>
      {sortedProducts.map((product) => (
        <TableRow
          key={String(product.id)}
          product={product}
          isSelected={selectedIds.has(String(product.id))}
          isModified={modifiedIds.has(String(product.id))}
          isExpanded={expandedIds.has(String(product.id))}
          tooltipsEnabled={tooltipsEnabled}
          onToggleExpand={handleToggleExpand}
          onToggleSelect={handleToggleSelect}
          onProductClick={onProductClick}
          onProductHover={onProductHover}
          onCellChange={onCellChange}
        />
      ))}
    </div>
  );

  // Fastモード用のレンダリング（Virtual Scroll対応）
  const renderFastTable = () => {
    if (useVirtualScroll && sortedProducts.length > 0) {
      return (
        <List 
          height={containerHeight} 
          itemCount={sortedProducts.length} 
          itemSize={rowHeight} 
          width="100%" 
          overscanCount={5}
        >
          {({ index, style }) => {
            const product = sortedProducts[index];
            if (!product) return null;
            return (
              <div style={style}>
                <FastRow
                  product={product}
                  isSelected={selectedIds.has(String(product.id))}
                  onToggleSelect={handleToggleSelect}
                  onProductClick={onProductClick}
                />
              </div>
            );
          }}
        </List>
      );
    }
    
    return (
      <div style={{ overflowY: 'auto', height: containerHeight }}>
        {sortedProducts.map((product) => (
          <FastRow
            key={String(product.id)}
            product={product}
            isSelected={selectedIds.has(String(product.id))}
            onToggleSelect={handleToggleSelect}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="n3-table" data-size={size}>
      {/* ツールバー */}
      <div className="n3-table-toolbar">
        <div className="n3-table-toolbar-left">
          <button 
            onClick={() => setTooltipsEnabled(!tooltipsEnabled)}
            className={`n3-table-toggle ${tooltipsEnabled ? 'active' : ''}`}
          >
            <Lightbulb /> Tips
          </button>
          <button 
            onClick={handleToggleFast}
            className={`n3-table-toggle fast ${isFastMode ? 'active' : ''}`}
          >
            <Zap /> Fast
          </button>
          <span className="n3-table-toolbar-divider" />
          <select value={pageSize} onChange={(e) => onPageSizeChange?.(Number(e.target.value))} className="n3-table-select">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="99999">全件</option>
          </select>
          <span className="n3-table-info">{sortedProducts.length}/{total}件</span>
        </div>
        
        <div className="n3-table-toolbar-right">
          <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="n3-table-select">
            <option value="sku">SKU</option>
            <option value="title">タイトル</option>
            <option value="price_jpy">価格</option>
            <option value="created_at">作成日</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="n3-table-sort-btn">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
          <span className="n3-table-toolbar-divider" />
          <div className="n3-table-pagination">
            <button onClick={() => onPageChange?.(1)} disabled={currentPage === 1} className="n3-table-page-btn">«</button>
            <button onClick={() => onPageChange?.(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="n3-table-page-btn">‹</button>
            <span className="n3-table-page-btn active">{currentPage}</span>
            {currentPage < totalPages && <span className="n3-table-page-info">{currentPage + 1}{currentPage + 2 <= totalPages && ` ... ${totalPages}`}</span>}
            <button onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="n3-table-page-btn">›</button>
            <button onClick={() => onPageChange?.(totalPages)} disabled={currentPage >= totalPages} className="n3-table-page-btn">»</button>
          </div>
        </div>
      </div>

      {/* ヘッダー */}
      {isFastMode ? (
        <div className="n3-table-header fast">
          <div className="n3-table-header-cell n3-col-checkbox-fast">
            <input type="checkbox" className="n3-checkbox w-3.5 h-3.5" checked={selectedIds.size === products.length && products.length > 0} onChange={handleToggleSelectAll} />
          </div>
          <div className="n3-table-header-cell n3-col-image-fast">🖼️</div>
          <div className="n3-table-header-cell n3-col-title-fast left">English Title</div>
          <div className="n3-table-header-cell n3-col-profit-fast right">Profit</div>
          <div className="n3-table-header-cell n3-col-rate-fast right">Rate</div>
        </div>
      ) : (
        <div className="n3-table-header">
          <div className="n3-table-header-cell n3-col-checkbox">
            <input type="checkbox" className="n3-checkbox w-4 h-4" checked={selectedIds.size === products.length && products.length > 0} onChange={handleToggleSelectAll} />
          </div>
          <div className="n3-table-header-cell n3-col-expand">▼</div>
          <div className="n3-table-header-cell n3-col-product left">Product</div>
          <div className="n3-table-header-cell n3-col-stock">Stock</div>
          <div className="n3-table-header-cell n3-col-cost right">Cost¥</div>
          <div className="n3-table-header-cell n3-col-profit right">Profit</div>
          <div className="n3-table-header-cell n3-col-rate right">Rate</div>
          <div className="n3-table-header-cell n3-col-filter">✓</div>
          <div className="n3-table-header-cell n3-col-status">ST</div>
          <div className="n3-table-header-cell n3-col-type">Type</div>
        </div>
      )}

      {/* テーブル本体 */}
      <div ref={containerRef} style={{ flex: 1, minHeight: 200 }}>
        {isFastMode ? renderFastTable() : renderNormalTable()}
      </div>

      {/* フッター */}
      <div className="n3-table-footer">
        <span className="n3-table-info">{sortedProducts.length}/{total}件</span>
        <div className="n3-table-pagination">
          <button onClick={() => onPageChange?.(1)} disabled={currentPage === 1} className="n3-table-page-btn">«</button>
          <button onClick={() => onPageChange?.(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="n3-table-page-btn">‹</button>
          <span className="n3-table-page-btn active">{currentPage}</span>
          {currentPage < totalPages && <span className="n3-table-page-info">{currentPage + 1}{currentPage + 2 <= totalPages && ` ... ${totalPages}`}</span>}
          <button onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="n3-table-page-btn">›</button>
          <button onClick={() => onPageChange?.(totalPages)} disabled={currentPage >= totalPages} className="n3-table-page-btn">»</button>
        </div>
      </div>

      {/* 空状態 */}
      {sortedProducts.length === 0 && (
        <div className="n3-table-empty">
          <Package size={40} className="n3-table-empty-icon" />
          <p className="n3-table-empty-text">商品がありません</p>
        </div>
      )}
    </div>
  );
}

export default EditingTableV2;
