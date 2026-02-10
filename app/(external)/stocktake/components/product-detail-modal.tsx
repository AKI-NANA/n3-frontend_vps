// app/(external)/stocktake/components/product-detail-modal.tsx
/**
 * 商品詳細モーダル（外注用）
 * 
 * - 画像を大きく表示
 * - タイトル全文表示
 * - SKU表示
 * - 在庫数調整
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, MapPin, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import type { StocktakeProduct } from '../hooks/use-stocktake';
import { STORAGE_LOCATIONS } from '../hooks/use-stocktake';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: StocktakeProduct | null;
  onClose: () => void;
  onQuantityChange?: (id: string, quantity: number) => void;
  onLocationChange?: (id: string, location: string) => void;
}

export function ProductDetailModal({
  isOpen,
  product,
  onClose,
  onQuantityChange,
  onLocationChange,
}: ProductDetailModalProps) {
  const [localQty, setLocalQty] = useState(0);
  const [localLocation, setLocalLocation] = useState('env');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setLocalQty(product.physical_quantity);
      setLocalLocation(product.storage_location || 'env');
      setCurrentImageIndex(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const handleIncrement = () => {
    const newQty = localQty + 1;
    setLocalQty(newQty);
    onQuantityChange?.(product.id, newQty);
  };

  const handleDecrement = () => {
    if (localQty <= 0) return;
    const newQty = localQty - 1;
    setLocalQty(newQty);
    onQuantityChange?.(product.id, newQty);
  };

  const handleLocationChange = (location: string) => {
    setLocalLocation(location);
    onLocationChange?.(product.id, location);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 画像エリア */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', background: '#f3f4f6' }}>
          {images.length > 0 ? (
            <img
              src={images[currentImageIndex]}
              alt={product.product_name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                background: '#f3f4f6',
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
              <Package size={60} />
            </div>
          )}

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '36px',
              height: '36px',
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
            <X size={20} />
          </button>

          {/* 画像ナビゲーション */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                <ChevronRight size={20} />
              </button>
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* 在庫バッジ */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '6px 12px',
              borderRadius: '12px',
              background: localQty > 0 ? '#22c55e' : '#ef4444',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            在庫: {localQty}個
          </div>
        </div>

        {/* 商品情報 */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {/* SKU */}
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#6b7280',
              marginBottom: '6px',
              padding: '4px 8px',
              background: '#f3f4f6',
              borderRadius: '4px',
              display: 'inline-block',
            }}
          >
            {product.sku}
          </div>

          {/* 商品名（全文表示） */}
          <div
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#1f2937',
              lineHeight: 1.4,
              marginBottom: '16px',
            }}
          >
            {product.product_name || '（商品名なし）'}
          </div>

          {/* 保管場所 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
              保管場所
            </label>
            <select
              value={localLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {STORAGE_LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>

          {/* 在庫数調整 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
              <Package size={14} style={{ display: 'inline', marginRight: '4px' }} />
              在庫数
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={handleDecrement}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  border: '2px solid #d1d5db',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#374151',
                  fontSize: '24px',
                  fontWeight: 700,
                }}
              >
                <Minus size={24} />
              </button>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: localQty > 0 ? '#22c55e' : '#ef4444',
                  minWidth: '60px',
                  textAlign: 'center',
                }}
              >
                {localQty}
              </span>
              <button
                onClick={handleIncrement}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  border: '2px solid #d1d5db',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#374151',
                  fontSize: '24px',
                  fontWeight: 700,
                }}
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* 閉じるボタン */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
}
