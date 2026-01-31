// app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx
/**
 * 仮想スクロール対応棚卸しリスト
 * 
 * Phase 4: パフォーマンス最適化
 * - react-windowによる仮想スクロール
 * - 大量データ（10,000件以上）でもスムーズにスクロール
 * - メモリ使用量を大幅削減
 */

'use client';

import React, { memo, useCallback, useRef, useEffect, useState } from 'react';
import { FixedSizeList, VariableSizeList, ListChildComponentProps } from 'react-window';
import { 
  Package, 
  Image as ImageIcon, 
  MoreVertical, 
  Check, 
  MapPin,
  Tag,
  DollarSign,
  Boxes,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import type { InventoryProduct } from '../../hooks';

interface VirtualInventoryListProps {
  products: InventoryProduct[];
  selectedIds: Set<string>;
  height?: number;
  itemSize?: number;
  onSelect: (id: string) => void;
  onDetail: (id: string) => void;
  onStockChange?: (id: string, quantity: number) => void;
  onCostChange?: (id: string, cost: number) => void;
}

// 個別行コンポーネント（メモ化）
const InventoryRow = memo(function InventoryRow({
  product,
  isSelected,
  onSelect,
  onDetail,
  onStockChange,
  onCostChange,
  style,
}: {
  product: InventoryProduct;
  isSelected: boolean;
  onSelect: () => void;
  onDetail: () => void;
  onStockChange?: (quantity: number) => void;
  onCostChange?: (cost: number) => void;
  style: React.CSSProperties;
}) {
  const [isEditing, setIsEditing] = useState<'stock' | 'cost' | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const handleStartEdit = (type: 'stock' | 'cost') => {
    setIsEditing(type);
    setEditValue(
      type === 'stock' 
        ? String(product.physical_quantity || 0)
        : String(product.cost_jpy || product.cost_price || 0)
    );
  };
  
  const handleSaveEdit = () => {
    if (isEditing === 'stock' && onStockChange) {
      const newQty = parseInt(editValue) || 0;
      onStockChange(newQty);
    } else if (isEditing === 'cost' && onCostChange) {
      const newCost = parseInt(editValue) || 0;
      onCostChange(newCost);
    }
    setIsEditing(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(null);
    }
  };
  
  // 画像URL
  const imageUrl = product.image_url || product.images?.[0] || null;
  
  // 在庫ステータスの色
  const stockColor = product.physical_quantity > 5 
    ? 'var(--success)' 
    : product.physical_quantity > 0 
      ? 'var(--warning)' 
      : 'var(--danger)';
  
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 12px',
        background: isSelected ? 'var(--highlight)' : 'transparent',
        borderBottom: '1px solid var(--panel-border)',
        cursor: 'pointer',
      }}
      onClick={onDetail}
    >
      {/* 選択チェックボックス */}
      <div
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--text-muted)'}`,
          background: isSelected ? 'var(--accent)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {isSelected && <Check size={14} color="white" />}
      </div>
      
      {/* サムネイル */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 6,
          background: 'var(--panel)',
          border: '1px solid var(--panel-border)',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <ImageIcon size={20} style={{ color: 'var(--text-muted)' }} />
        )}
      </div>
      
      {/* 商品情報 */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.product_name || product.title || '（無題）'}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {product.sku || '—'}
          </span>
          {product.attr_l1 && (
            <span style={{ fontSize: 10, padding: '1px 4px', background: 'var(--highlight)', borderRadius: 2, color: 'var(--text-muted)' }}>
              {product.attr_l1}
            </span>
          )}
        </div>
      </div>
      
      {/* 在庫数 */}
      <div style={{ width: 70, textAlign: 'center', flexShrink: 0 }}>
        {isEditing === 'stock' ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            style={{
              width: '100%',
              padding: '2px 4px',
              fontSize: 13,
              textAlign: 'center',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
            }}
          />
        ) : (
          <div
            onClick={(e) => { e.stopPropagation(); handleStartEdit('stock'); }}
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              background: 'var(--panel)',
              cursor: 'text',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: stockColor }}>
              {product.physical_quantity || 0}
            </span>
          </div>
        )}
      </div>
      
      {/* 原価 */}
      <div style={{ width: 80, textAlign: 'right', flexShrink: 0 }}>
        {isEditing === 'cost' ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            style={{
              width: '100%',
              padding: '2px 4px',
              fontSize: 12,
              textAlign: 'right',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
            }}
          />
        ) : (
          <div
            onClick={(e) => { e.stopPropagation(); handleStartEdit('cost'); }}
            style={{ cursor: 'text' }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              ¥{(product.cost_jpy || product.cost_price || 0).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      
      {/* 保管場所 */}
      <div style={{ width: 60, textAlign: 'center', flexShrink: 0 }}>
        {product.storage_location ? (
          <span style={{ fontSize: 11, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <MapPin size={10} />
            {product.storage_location}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
        )}
      </div>
      
      {/* アクションボタン */}
      <button
        onClick={(e) => { e.stopPropagation(); onDetail(); }}
        style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <MoreVertical size={16} />
      </button>
    </div>
  );
});

// メインコンポーネント
export const N3VirtualInventoryList = memo(function N3VirtualInventoryList({
  products,
  selectedIds,
  height = 600,
  itemSize = 64,
  onSelect,
  onDetail,
  onStockChange,
  onCostChange,
}: VirtualInventoryListProps) {
  const listRef = useRef<FixedSizeList>(null);
  
  // リサイズ対応
  const [containerHeight, setContainerHeight] = useState(height);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 50; // 50px margin for footer
        setContainerHeight(Math.max(400, availableHeight));
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  
  // 行レンダラー
  const Row = useCallback(({ index, style }: ListChildComponentProps) => {
    const product = products[index];
    if (!product) return null;
    
    const id = String(product.id);
    const isSelected = selectedIds.has(id);
    
    return (
      <InventoryRow
        product={product}
        isSelected={isSelected}
        onSelect={() => onSelect(id)}
        onDetail={() => onDetail(id)}
        onStockChange={onStockChange ? (qty) => onStockChange(id, qty) : undefined}
        onCostChange={onCostChange ? (cost) => onCostChange(id, cost) : undefined}
        style={style}
      />
    );
  }, [products, selectedIds, onSelect, onDetail, onStockChange, onCostChange]);
  
  if (products.length === 0) {
    return (
      <div
        style={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Package size={48} style={{ opacity: 0.3, marginBottom: 8 }} />
          <div>商品が見つかりません</div>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'var(--panel)',
          borderBottom: '1px solid var(--panel-border)',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ width: 20 }}></div>
        <div style={{ width: 48 }}>画像</div>
        <div style={{ flex: 1 }}>商品名 / SKU</div>
        <div style={{ width: 70, textAlign: 'center' }}>在庫</div>
        <div style={{ width: 80, textAlign: 'right' }}>原価</div>
        <div style={{ width: 60, textAlign: 'center' }}>場所</div>
        <div style={{ width: 28 }}></div>
      </div>
      
      {/* 仮想スクロールリスト */}
      <FixedSizeList
        ref={listRef}
        height={containerHeight}
        width="100%"
        itemCount={products.length}
        itemSize={itemSize}
        overscanCount={5}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
});

export default N3VirtualInventoryList;
