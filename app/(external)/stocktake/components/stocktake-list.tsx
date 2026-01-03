// app/(external)/stocktake/components/stocktake-list.tsx
/**
 * 棚卸しリスト表示
 * タップで詳細モーダル表示
 */

'use client';

import React, { memo, useState } from 'react';
import { Minus, Plus, Edit3, Camera } from 'lucide-react';
import type { StocktakeProduct } from '../hooks/use-stocktake';
import { STORAGE_LOCATIONS } from '../hooks/use-stocktake';

interface StocktakeListProps {
  products: StocktakeProduct[];
  canEdit: (product: StocktakeProduct) => boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onLocationChange?: (id: string, location: string) => void;
  onEdit?: (product: StocktakeProduct) => void;
  onDetail?: (product: StocktakeProduct) => void;
}

export const StocktakeList = memo(function StocktakeList({
  products,
  canEdit,
  onQuantityChange,
  onLocationChange,
  onEdit,
  onDetail,
}: StocktakeListProps) {
  return (
    <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {/* ヘッダー */}
      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 70px 90px 40px', gap: '6px', padding: '6px 10px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '10px', fontWeight: 600, color: '#6b7280' }}>
        <div>画像</div>
        <div>商品名</div>
        <div style={{ textAlign: 'center' }}>場所</div>
        <div style={{ textAlign: 'center' }}>在庫</div>
        <div></div>
      </div>

      {products.map((product) => (
        <ListRow
          key={product.id}
          product={product}
          canEdit={canEdit(product)}
          canFullEdit={product.isStocktakeRegistered}
          onQuantityChange={onQuantityChange}
          onLocationChange={onLocationChange}
          onEdit={onEdit}
          onDetail={onDetail}
        />
      ))}
    </div>
  );
});

interface ListRowProps {
  product: StocktakeProduct;
  canEdit: boolean;
  canFullEdit?: boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onLocationChange?: (id: string, location: string) => void;
  onEdit?: (product: StocktakeProduct) => void;
  onDetail?: (product: StocktakeProduct) => void;
}

const ListRow = memo(function ListRow({
  product,
  canEdit,
  canFullEdit = false,
  onQuantityChange,
  onLocationChange,
  onEdit,
  onDetail,
}: ListRowProps) {
  const [localQty, setLocalQty] = useState(product.physical_quantity);
  const imageUrl = product.images?.[0];

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit || !onQuantityChange) return;
    const newQty = localQty + 1;
    setLocalQty(newQty);
    onQuantityChange(product.id, newQty);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit || !onQuantityChange || localQty <= 0) return;
    const newQty = localQty - 1;
    setLocalQty(newQty);
    onQuantityChange(product.id, newQty);
  };

  const handleRowClick = () => {
    onDetail?.(product);
  };

  return (
    <div
      onClick={handleRowClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '44px 1fr 70px 90px 40px',
        gap: '6px',
        padding: '6px 10px',
        borderBottom: '1px solid #f3f4f6',
        alignItems: 'center',
        background: canFullEdit ? 'rgba(34, 197, 94, 0.03)' : 'white',
        cursor: 'pointer',
      }}
    >
      {/* 画像 */}
      <div style={{ width: '40px', height: '40px', borderRadius: '5px', overflow: 'hidden', background: '#f3f4f6' }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            <Camera size={14} />
          </div>
        )}
      </div>

      {/* 商品名 */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.product_name}>
          {product.product_name || '（商品名なし）'}
        </div>
        <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#9ca3af' }}>{product.sku}</div>
      </div>

      {/* 場所 */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 500, background: product.storage_location === 'plus1' ? '#dcfce7' : '#f3f4f6', color: product.storage_location === 'plus1' ? '#16a34a' : '#6b7280' }}>
          {STORAGE_LOCATIONS.find(l => l.value === product.storage_location)?.label || 'env'}
        </span>
      </div>

      {/* 在庫数 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        {canEdit && onQuantityChange ? (
          <>
            <button onClick={handleDecrement} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' }}>
              <Minus size={11} />
            </button>
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: localQty > 0 ? '#22c55e' : '#ef4444', minWidth: '22px', textAlign: 'center' }}>
              {localQty}
            </span>
            <button onClick={handleIncrement} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' }}>
              <Plus size={11} />
            </button>
          </>
        ) : (
          <span style={{ fontSize: '12px', fontWeight: 600, color: product.physical_quantity > 0 ? '#22c55e' : '#ef4444' }}>{product.physical_quantity}</span>
        )}
      </div>

      {/* 編集 */}
      <div style={{ textAlign: 'center' }}>
        {canFullEdit && onEdit ? (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            style={{ width: '26px', height: '26px', borderRadius: '5px', border: 'none', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' }}
          >
            <Edit3 size={12} />
          </button>
        ) : null}
      </div>
    </div>
  );
});
