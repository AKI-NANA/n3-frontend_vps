// app/(external)/stocktake/components/stocktake-card.tsx
/**
 * 棚卸し商品カード（超高速版）
 * 
 * 高速化テクニック:
 * 1. 画像URLの最適化（サムネイル版に変換）
 * 2. CSS content-visibility: auto（レンダリング最適化）
 * 3. will-change: transform（GPU最適化）
 * 4. 画像のdecoding="async"
 * 5. 仮想化検討（大量データ時）
 */

'use client';

import React, { memo, useState, useEffect, useRef } from 'react';
import { Minus, Plus, Edit3, Package, MapPin, Camera } from 'lucide-react';
import type { StocktakeProduct } from '../hooks/use-stocktake';
import { STORAGE_LOCATIONS } from '../hooks/use-stocktake';

interface StocktakeCardProps {
  product: StocktakeProduct;
  canEdit: boolean;
  canFullEdit?: boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onEdit?: (product: StocktakeProduct) => void;
  onTap?: (product: StocktakeProduct) => void;
}

// 画像URL最適化（サムネイル版に変換）
function getOptimizedImageUrl(url: string): string {
  if (!url) return '';
  
  // Supabase Storage
  if (url.includes('supabase.co/storage')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?width=120&height=120&resize=contain&quality=50`;
  }
  
  // Yahoo画像 → サムネイル版
  if (url.includes('auctions.c.yimg.jp')) {
    // /i/ を /t/ に変換（サムネイル）
    return url.replace(/\/i\//, '/t/').replace(/\?.*$/, '');
  }
  
  // eBay画像 → 小サイズ
  if (url.includes('ebayimg.com')) {
    return url.replace(/s-l\d+/, 's-l140');
  }
  
  return url;
}

// 超軽量カードコンポーネント
export const StocktakeCard = memo(function StocktakeCard({
  product,
  canEdit,
  canFullEdit = false,
  onQuantityChange,
  onEdit,
  onTap,
}: StocktakeCardProps) {
  const [localQuantity, setLocalQuantity] = useState(product.physical_quantity);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalQuantity(product.physical_quantity);
  }, [product.physical_quantity]);

  // Intersection Observer（ビューポート内のみ画像読み込み）
  useEffect(() => {
    if (!cardRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );
    
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit || !onQuantityChange) return;
    const newQty = localQuantity + 1;
    setLocalQuantity(newQty);
    onQuantityChange(product.id, newQty);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit || !onQuantityChange || localQuantity <= 0) return;
    const newQty = localQuantity - 1;
    setLocalQuantity(newQty);
    onQuantityChange(product.id, newQty);
  };

  const imageUrl = product.images?.[0] || '';
  const optimizedUrl = getOptimizedImageUrl(imageUrl);
  const imageCount = product.images?.length || 0;
  const locationLabel = STORAGE_LOCATIONS.find(l => l.value === product.storage_location)?.label || product.storage_location || 'env';

  return (
    <div
      ref={cardRef}
      onClick={() => onTap?.(product)}
      style={{
        background: 'white',
        border: canFullEdit ? '2px solid #22c55e' : '1px solid #e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        // GPU最適化
        willChange: 'transform',
        // コンテンツ可視性最適化
        contentVisibility: 'auto',
        containIntrinsicSize: '0 180px',
      }}
    >
      {/* 画像エリア */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        paddingBottom: '100%',
        background: '#f5f5f5',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* ビューポート内のみ画像読み込み */}
          {inView && imageUrl && !imageError ? (
            <img
              src={optimizedUrl}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.1s',
              }}
            />
          ) : (
            <Package size={20} style={{ color: '#d1d5db' }} />
          )}
        </div>

        {/* バッジ類 */}
        <div style={{ 
          position: 'absolute', top: '3px', right: '3px', 
          padding: '2px 5px', borderRadius: '4px', 
          fontSize: '10px', fontWeight: 700, 
          background: localQuantity > 0 ? '#22c55e' : '#ef4444', 
          color: 'white',
          zIndex: 2,
        }}>
          {localQuantity}個
        </div>

        <div style={{ 
          position: 'absolute', top: '3px', left: '3px', 
          padding: '2px 4px', borderRadius: '3px', 
          fontSize: '8px', fontWeight: 600, 
          background: product.storage_location === 'plus1' ? 'rgba(34,197,94,0.9)' : 'rgba(59,130,246,0.9)', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2px',
          zIndex: 2,
        }}>
          <MapPin size={7} />{locationLabel}
        </div>

        {imageCount > 0 && (
          <div style={{ 
            position: 'absolute', bottom: '3px', left: '3px', 
            padding: '2px 3px', borderRadius: '3px', 
            fontSize: '7px', fontWeight: 600, 
            background: 'rgba(0,0,0,0.5)', color: 'white', 
            display: 'flex', alignItems: 'center', gap: '2px',
            zIndex: 2,
          }}>
            <Camera size={6} />{imageCount}
          </div>
        )}

        {canFullEdit && onEdit && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(product); }} 
            style={{ 
              position: 'absolute', bottom: '3px', right: '3px', 
              width: '18px', height: '18px', borderRadius: '50%', 
              background: 'rgba(0,0,0,0.5)', border: 'none', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer', color: 'white',
              zIndex: 2,
            }}
          >
            <Edit3 size={9} />
          </button>
        )}
      </div>

      {/* コンテンツ */}
      <div style={{ padding: '4px 5px', flexShrink: 0 }}>
        <div 
          style={{ 
            fontSize: '10px', fontWeight: 600, color: '#1f2937', 
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }} 
          title={product.product_name}
        >
          {product.product_name || '（商品名なし）'}
        </div>

        <div style={{ 
          fontSize: '8px', fontFamily: 'monospace', color: '#9ca3af', 
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.2,
          marginBottom: '3px',
        }}>
          {product.sku || '-'}
        </div>

        {canEdit && onQuantityChange && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <button 
              onClick={handleDecrement} 
              style={{ 
                width: '20px', height: '20px', borderRadius: '4px', 
                border: '1px solid #d1d5db', background: '#f9fafb', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                cursor: 'pointer', color: '#374151' 
              }}
            >
              <Minus size={11} />
            </button>
            <span style={{ 
              fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', 
              color: localQuantity > 0 ? '#22c55e' : '#ef4444', 
              minWidth: '24px', textAlign: 'center' 
            }}>
              {localQuantity}
            </span>
            <button 
              onClick={handleIncrement} 
              style={{ 
                width: '20px', height: '20px', borderRadius: '4px', 
                border: '1px solid #d1d5db', background: '#f9fafb', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                cursor: 'pointer', color: '#374151' 
              }}
            >
              <Plus size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
