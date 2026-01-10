// app/(external)/stocktake/components/stocktake-card.tsx
/**
 * 棚卸し商品カード（超高速版 + フラグ・メモ対応）
 * 
 * 機能:
 * 1. 要確認フラグ（赤枠 + 「要確認」バッジ）
 * 2. 確定フラグ（グレーアウト + ✓マーク）
 * 3. メモアイコン（クリックで表示）
 * 4. 画像URLの最適化（サムネイル版に変換）
 * 5. CSS content-visibility: auto（レンダリング最適化）
 */

'use client';

import React, { memo, useState, useEffect, useRef } from 'react';
import { Minus, Plus, Edit3, Package, MapPin, Camera, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
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
  const [showMemo, setShowMemo] = useState(false);
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

  const handleMemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMemo(!showMemo);
  };

  const imageUrl = product.images?.[0] || '';
  const optimizedUrl = getOptimizedImageUrl(imageUrl);
  const imageCount = product.images?.length || 0;
  const locationLabel = STORAGE_LOCATIONS.find(l => l.value === product.storage_location)?.label || product.storage_location || 'env';

  // フラグ状態
  const needsCheck = product.needs_count_check || false;
  const isConfirmed = product.stock_confirmed || false;
  const hasMemo = !!product.stock_memo;

  // ボーダースタイル決定
  const getBorderStyle = () => {
    if (needsCheck) {
      return '3px solid #ef4444'; // 赤枠（要確認）
    }
    if (canFullEdit) {
      return '2px solid #22c55e'; // 緑枠（編集可能）
    }
    return '1px solid #e5e7eb'; // デフォルト
  };

  // 確定時のオーバーレイ
  const confirmedOverlay = isConfirmed ? {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.6)',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none' as const,
  } : null;

  return (
    <div
      ref={cardRef}
      onClick={() => onTap?.(product)}
      style={{
        background: isConfirmed ? '#f9fafb' : 'white',
        border: getBorderStyle(),
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // GPU最適化
        willChange: 'transform',
        // コンテンツ可視性最適化
        contentVisibility: 'auto',
        containIntrinsicSize: '0 180px',
        // 確定時の透明度
        opacity: isConfirmed ? 0.7 : 1,
      }}
    >
      {/* 確定オーバーレイ */}
      {isConfirmed && (
        <div style={confirmedOverlay!}>
          <CheckCircle size={32} style={{ color: '#22c55e', opacity: 0.8 }} />
        </div>
      )}

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

        {/* 要確認バッジ（左上、最優先表示） */}
        {needsCheck && (
          <div style={{ 
            position: 'absolute', 
            top: '3px', 
            left: '3px', 
            padding: '2px 5px', 
            borderRadius: '4px', 
            fontSize: '9px', 
            fontWeight: 700, 
            background: '#ef4444', 
            color: 'white',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            animation: 'pulse 2s infinite',
          }}>
            <AlertTriangle size={9} />
            要確認
          </div>
        )}

        {/* 確定バッジ */}
        {isConfirmed && !needsCheck && (
          <div style={{ 
            position: 'absolute', 
            top: '3px', 
            left: '3px', 
            padding: '2px 5px', 
            borderRadius: '4px', 
            fontSize: '9px', 
            fontWeight: 700, 
            background: '#22c55e', 
            color: 'white',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}>
            <CheckCircle size={9} />
            確定
          </div>
        )}

        {/* 保管場所バッジ（要確認/確定がない場合のみ左上に表示） */}
        {!needsCheck && !isConfirmed && (
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
        )}

        {/* 数量バッジ（右上） */}
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

        {/* 画像枚数（左下） */}
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

        {/* メモアイコン（右下、メモがある場合） */}
        {hasMemo && (
          <button 
            onClick={handleMemoClick}
            style={{ 
              position: 'absolute', bottom: '3px', right: canFullEdit ? '24px' : '3px', 
              width: '18px', height: '18px', borderRadius: '50%', 
              background: '#f59e0b', border: 'none', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer', color: 'white',
              zIndex: 6,
            }}
            title={product.stock_memo}
          >
            <MessageSquare size={9} />
          </button>
        )}

        {/* 編集ボタン（右下） */}
        {canFullEdit && onEdit && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(product); }} 
            style={{ 
              position: 'absolute', bottom: '3px', right: '3px', 
              width: '18px', height: '18px', borderRadius: '50%', 
              background: 'rgba(0,0,0,0.5)', border: 'none', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer', color: 'white',
              zIndex: 6,
            }}
          >
            <Edit3 size={9} />
          </button>
        )}
      </div>

      {/* メモ表示（展開時） */}
      {showMemo && hasMemo && (
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            position: 'absolute', 
            bottom: '100%', 
            left: 0, 
            right: 0, 
            background: '#fffbeb', 
            border: '1px solid #f59e0b', 
            borderRadius: '4px', 
            padding: '6px 8px', 
            fontSize: '10px', 
            color: '#92400e',
            zIndex: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            marginBottom: '4px',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageSquare size={10} /> メモ
          </div>
          {product.stock_memo}
        </div>
      )}

      {/* コンテンツ */}
      <div style={{ padding: '4px 5px', flexShrink: 0 }}>
        {/* 保管場所（要確認/確定の場合はここに表示） */}
        {(needsCheck || isConfirmed) && (
          <div style={{ 
            fontSize: '8px', 
            color: '#6b7280', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2px',
            marginBottom: '2px',
          }}>
            <MapPin size={8} />{locationLabel}
          </div>
        )}

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

      {/* パルスアニメーション */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
});
