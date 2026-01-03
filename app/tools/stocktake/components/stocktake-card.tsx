// app/tools/stocktake/components/stocktake-card.tsx
/**
 * 棚卸し商品カード（外注用）
 * シンプルな表示・編集UI
 */

'use client';

import React, { memo, useState } from 'react';
import { Minus, Plus, Edit3, Check, X, Package } from 'lucide-react';
import type { StocktakeProduct } from '../hooks/use-stocktake';
import { getProductColor, getProductSize } from '../hooks';

interface StocktakeCardProps {
  product: StocktakeProduct;
  onQuantityChange: (id: string, quantity: number) => void;
  onEdit: (product: StocktakeProduct) => void;
}

export const StocktakeCard = memo(function StocktakeCard({
  product,
  onQuantityChange,
  onEdit,
}: StocktakeCardProps) {
  const [localQuantity, setLocalQuantity] = useState(product.physical_quantity);

  const handleIncrement = () => {
    const newQty = localQuantity + 1;
    setLocalQuantity(newQty);
    onQuantityChange(product.id, newQty);
  };

  const handleDecrement = () => {
    if (localQuantity > 0) {
      const newQty = localQuantity - 1;
      setLocalQuantity(newQty);
      onQuantityChange(product.id, newQty);
    }
  };

  const imageUrl = product.image_url || product.images?.[0];

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {/* 画像エリア */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '100%',
          background: '#f3f4f6',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.product_name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
            }}
          >
            <Package size={32} />
          </div>
        )}

        {/* 在庫数バッジ */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            background: localQuantity > 0 ? '#22c55e' : '#ef4444',
            color: 'white',
          }}
        >
          {localQuantity}個
        </div>

        {/* 編集ボタン */}
        <button
          onClick={() => onEdit(product)}
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          <Edit3 size={16} />
        </button>
      </div>

      {/* コンテンツ */}
      <div style={{ padding: '12px' }}>
        {/* タイトル */}
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.3',
            minHeight: '34px',
          }}
          title={product.product_name}
        >
          {product.product_name}
        </div>

        {/* SKU */}
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#6b7280',
            marginBottom: '8px',
          }}
        >
          {product.sku}
        </div>

        {/* 色・サイズ */}
        {(getProductColor(product) || getProductSize(product)) && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '8px',
              fontSize: '11px',
            }}
          >
            {getProductColor(product) && (
              <span style={{ color: '#6b7280' }}>
                色: <span style={{ color: '#1f2937', fontWeight: 500 }}>{getProductColor(product)}</span>
              </span>
            )}
            {getProductSize(product) && (
              <span style={{ color: '#6b7280' }}>
                サイズ: <span style={{ color: '#1f2937', fontWeight: 500 }}>{getProductSize(product)}</span>
              </span>
            )}
          </div>
        )}

        {/* 数量調整 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            paddingTop: '8px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <button
            onClick={handleDecrement}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            <Minus size={18} />
          </button>
          
          <span
            style={{
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#1f2937',
              minWidth: '40px',
              textAlign: 'center',
            }}
          >
            {localQuantity}
          </span>
          
          <button
            onClick={handleIncrement}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
});
