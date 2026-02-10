/**
 * N3ExpandPanel - テーブル行展開パネル
 * 
 * EditingTableV2から抽出
 * テーブル行をクリックした時に展開される詳細パネル
 * 6列グリッド: SKU/画像 | 市場データ | サイズ | HTS | VERO | アクション
 * 
 * CSS: app/styles/components/table.css の .n3-expanded-* を使用
 */

'use client';

import React, { memo, ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import {
  BarChart3, Package, AlertTriangle, ExternalLink,
  Edit2, Trash2, Image as ImageIcon
} from 'lucide-react';

// ============================================
// 型定義
// ============================================
export interface MarketData {
  lowestPrice?: number | null;
  avgPrice?: number | null;
  competitorCount?: number | null;
  salesCount?: number | null;
}

export interface SizeData {
  widthCm?: number | null;
  lengthCm?: number | null;
  heightCm?: number | null;
  weightG?: number | null;
}

export interface HTSData {
  htsCode?: string | null;
  htsDutyRate?: string | number | null;
  originCountry?: string | null;
  originDutyRate?: number | null;
  material?: string | null;
}

export interface VeroData {
  isVeroBrand?: boolean;
  categoryId?: string | null;
  categoryName?: string | null;
  hasHtml?: boolean;
}

export interface ExpandPanelProduct {
  id: string | number;
  sku?: string;
  masterKey?: string;
  title?: string;
  englishTitle?: string;
  priceJpy?: number;
  currentStock?: number;
  mainImageUrl?: string | null;
  galleryImages?: string[];
  market?: MarketData;
  size?: SizeData;
  hts?: HTSData;
  vero?: VeroData;
  dduProfitUsd?: number;
  dduProfitMargin?: number;
}

export interface N3ExpandPanelProps {
  /** 商品データ */
  product: ExpandPanelProduct;
  /** 編集ボタンクリック */
  onEdit?: () => void;
  /** 削除ボタンクリック */
  onDelete?: () => void;
  /** eBay検索クリック */
  onEbaySearch?: () => void;
  /** セル編集コールバック */
  onCellChange?: (id: string, field: string, value: any) => void;
  /** カスタムアクション */
  customActions?: ReactNode;
  /** 追加クラス */
  className?: string;
}

// ============================================
// EditableCell - インライン編集セル
// ============================================
const EditableCell = memo(function EditableCell({
  value,
  field,
  productId,
  type = 'text',
  currency,
  onCellChange,
  placeholder = '-'
}: {
  value: any;
  field: string;
  productId: string;
  type?: 'text' | 'number' | 'currency';
  currency?: 'JPY' | 'USD';
  onCellChange?: (id: string, field: string, value: any) => void;
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
    if (String(finalValue) !== String(value) && onCellChange) {
      onCellChange(productId, field, finalValue);
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
        style={{
          width: '100%',
          height: '24px',
          padding: '0 8px',
          fontSize: '12px',
          border: '2px solid var(--accent)',
          borderRadius: 'var(--radius-sm, 4px)',
          background: 'var(--panel)',
          color: 'var(--text)',
          outline: 'none',
        }}
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
      onClick={() => onCellChange && setEditing(true)}
      style={{
        padding: '2px 4px',
        cursor: onCellChange ? 'text' : 'default',
        borderRadius: 'var(--radius-sm)',
        transition: 'background 0.1s ease',
      }}
      onMouseEnter={(e) => onCellChange && (e.currentTarget.style.background = 'var(--highlight)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      title={onCellChange ? 'クリックで編集' : undefined}
    >
      {displayValue}
    </div>
  );
});

// ============================================
// DataRow - データ行
// ============================================
const DataRow = memo(function DataRow({
  label,
  value,
  valueColor,
  mono = false,
  editable,
  field,
  productId,
  type,
  currency,
  onCellChange,
}: {
  label: string;
  value: ReactNode;
  valueColor?: string;
  mono?: boolean;
  editable?: boolean;
  field?: string;
  productId?: string;
  type?: 'text' | 'number' | 'currency';
  currency?: 'JPY' | 'USD';
  onCellChange?: (id: string, field: string, value: any) => void;
}) {
  return (
    <div className="n3-expanded-row">
      <span className="n3-expanded-label">{label}</span>
      {editable && field && productId ? (
        <EditableCell
          value={value}
          field={field}
          productId={productId}
          type={type}
          currency={currency}
          onCellChange={onCellChange}
        />
      ) : (
        <span
          className={mono ? 'n3-expanded-value' : ''}
          style={{ color: valueColor }}
        >
          {value ?? '-'}
        </span>
      )}
    </div>
  );
});

// ============================================
// SectionCard - セクションカード
// ============================================
const SectionCard = memo(function SectionCard({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ComponentType<{ size: number }>;
  title: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div className="n3-expanded-section">
      <div className="n3-expanded-section-header" style={{ color }}>
        <Icon size={12} />
        {title}
      </div>
      {children}
    </div>
  );
});

// ============================================
// N3ExpandPanel - メインコンポーネント
// ============================================
export const N3ExpandPanel = memo(function N3ExpandPanel({
  product,
  onEdit,
  onDelete,
  onEbaySearch,
  onCellChange,
  customActions,
  className = '',
}: N3ExpandPanelProps) {
  const productId = String(product.id);

  const handleEbaySearch = () => {
    if (onEbaySearch) {
      onEbaySearch();
    } else {
      const query = product.englishTitle || product.title || '';
      window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div className={`n3-expanded-panel ${className}`}>
      <div className="grid">
        {/* 1. SKU + 画像 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="n3-expanded-section" style={{ fontSize: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '4px' }}>
              SKU / Master Key
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
              {product.sku || '-'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '11px' }}>
              {product.masterKey || '-'}
            </div>
          </div>

          {/* メイン画像 */}
          <div className="n3-expanded-main-image">
            {product.mainImageUrl ? (
              <img src={product.mainImageUrl} alt="" loading="lazy" />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--highlight)',
              }}>
                <ImageIcon size={24} style={{ color: 'var(--text-subtle)' }} />
              </div>
            )}
          </div>

          {/* ギャラリー */}
          {product.galleryImages && product.galleryImages.length > 0 && (
            <div className="n3-expanded-gallery">
              {product.galleryImages.slice(0, 4).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  loading="lazy"
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. 市場データ + DDU */}
        <SectionCard icon={BarChart3} title="市場データ + DDU" color="#3b82f6">
          <DataRow
            label="最安値"
            value={product.market?.lowestPrice ? `$${product.market.lowestPrice.toFixed(2)}` : null}
            valueColor="var(--success)"
            mono
          />
          <DataRow
            label="平均"
            value={product.market?.avgPrice ? `$${product.market.avgPrice.toFixed(2)}` : null}
            mono
          />
          <DataRow
            label="競合"
            value={product.market?.competitorCount}
            valueColor="#d97706"
            mono
          />
          <DataRow
            label="販売"
            value={product.market?.salesCount}
            valueColor="var(--success)"
            mono
          />
          <div className="n3-expanded-divider" />
          <DataRow
            label="販売(円)"
            value={product.priceJpy}
            mono
            editable={!!onCellChange}
            field="priceJpy"
            productId={productId}
            type="currency"
            currency="JPY"
            onCellChange={onCellChange}
          />
          <DataRow
            label="DDU利益"
            value={product.dduProfitUsd ? `$${product.dduProfitUsd.toFixed(0)}` : null}
            valueColor="var(--success)"
            mono
          />
          <DataRow
            label="DDU率"
            value={product.dduProfitMargin ? `${product.dduProfitMargin.toFixed(0)}%` : null}
            valueColor="var(--success)"
            mono
          />
        </SectionCard>

        {/* 3. サイズ・重量 */}
        <SectionCard icon={Package} title="サイズ・重量" color="#d97706">
          <DataRow
            label="幅(cm)"
            value={product.size?.widthCm}
            mono
            editable={!!onCellChange}
            field="widthCm"
            productId={productId}
            type="number"
            onCellChange={onCellChange}
          />
          <DataRow
            label="奥行(cm)"
            value={product.size?.lengthCm}
            mono
            editable={!!onCellChange}
            field="lengthCm"
            productId={productId}
            type="number"
            onCellChange={onCellChange}
          />
          <DataRow
            label="高さ(cm)"
            value={product.size?.heightCm}
            mono
            editable={!!onCellChange}
            field="heightCm"
            productId={productId}
            type="number"
            onCellChange={onCellChange}
          />
          <DataRow
            label="重量(g)"
            value={product.size?.weightG}
            mono
            editable={!!onCellChange}
            field="weightG"
            productId={productId}
            type="number"
            onCellChange={onCellChange}
          />
        </SectionCard>

        {/* 4. HTS・関税 */}
        <SectionCard icon={Package} title="HTS・関税" color="#d97706">
          <DataRow
            label="HTSコード"
            value={product.hts?.htsCode}
            mono
            editable={!!onCellChange}
            field="htsCode"
            productId={productId}
            onCellChange={onCellChange}
          />
          <DataRow
            label="HTS関税率"
            value={product.hts?.htsDutyRate}
            mono
            editable={!!onCellChange}
            field="htsDutyRate"
            productId={productId}
            type="number"
            onCellChange={onCellChange}
          />
          <DataRow
            label="原産国"
            value={product.hts?.originCountry}
            editable={!!onCellChange}
            field="originCountry"
            productId={productId}
            onCellChange={onCellChange}
          />
          <DataRow
            label="原産国関税"
            value={product.hts?.originDutyRate ? `${product.hts.originDutyRate}%` : null}
            valueColor="#d97706"
            mono
          />
          <DataRow
            label="素材"
            value={product.hts?.material}
            editable={!!onCellChange}
            field="material"
            productId={productId}
            onCellChange={onCellChange}
          />
        </SectionCard>

        {/* 5. VERO・カテゴリ */}
        <SectionCard icon={AlertTriangle} title="VERO・カテゴリ" color="#ef4444">
          <DataRow
            label="VERO"
            value={product.vero?.isVeroBrand ? '要注意' : 'OK'}
            valueColor={product.vero?.isVeroBrand ? '#ef4444' : 'var(--success)'}
          />
          <DataRow label="カテゴリID" value={product.vero?.categoryId} mono />
          <DataRow label="カテゴリ" value={product.vero?.categoryName} />
          <DataRow
            label="HTML"
            value={product.vero?.hasHtml ? '✓ 生成済み' : '未生成'}
            valueColor={product.vero?.hasHtml ? 'var(--success)' : 'var(--text-subtle)'}
          />
        </SectionCard>

        {/* 6. アクション */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            ACTIONS
          </div>

          <button className="n3-expanded-btn secondary" onClick={handleEbaySearch}>
            <ExternalLink size={12} /> eBay検索
          </button>

          <button className="n3-expanded-btn primary" onClick={onEdit}>
            <Edit2 size={12} /> 編集
          </button>

          <button className="n3-expanded-btn danger" onClick={onDelete}>
            <Trash2 size={12} /> 削除
          </button>

          {customActions}
        </div>
      </div>
    </div>
  );
});

export default N3ExpandPanel;
