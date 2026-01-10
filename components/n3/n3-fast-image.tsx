// components/n3/n3-fast-image.tsx
/**
 * N3 Fast Image Component - 超軽量・高速画像コンポーネント
 * 
 * 🚀 スピード最優先設計:
 * - 一覧表示専用（詳細モーダルでは N3LazyImage を使用）
 * - Intersection Observer なし（純粋な lazy loading 属性のみ）
 * - 状態管理最小化（loading/error のみ）
 * - CSSでレイアウトシフト防止
 * 
 * パフォーマンス特性:
 * - 1000件表示でも滑らか
 * - メモリ消費最小化
 * - React再レンダリング最小化
 * 
 * @version 1.0.0
 * @date 2025-12-22
 */

'use client';

import React, { useState, useMemo, memo } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import { getCachedThumbnail, PLACEHOLDER_IMAGE } from '@/lib/services/image/image-optimization';

// ============================================================
// 型定義
// ============================================================

export interface N3FastImageProps {
  /** 画像URL */
  src: string | null | undefined;
  /** altテキスト */
  alt?: string;
  /** サイズプリセット */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** 追加のクラス名 */
  className?: string;
  /** クリック時のコールバック */
  onClick?: () => void;
}

// ============================================================
// サイズマップ
// ============================================================

const SIZE_MAP = {
  xs: 32,  // 極小（アイコン用）
  sm: 48,  // 小（リストビュー行内）
  md: 80,  // 中（標準一覧）
  lg: 120, // 大（カードビュー）
} as const;

// サイズからサムネイルサイズキーへのマッピング
const SIZE_TO_THUMBNAIL = {
  xs: 'thumbnail',
  sm: 'thumbnail',
  md: 'thumbnail',
  lg: 'small',
} as const;

// ============================================================
// コンポーネント
// ============================================================

/**
 * 超軽量・高速画像コンポーネント
 * 
 * 使用例:
 * ```tsx
 * <N3FastImage src={product.primary_image_url} size="md" />
 * ```
 */
export const N3FastImage = memo(function N3FastImage({
  src,
  alt = '',
  size = 'md',
  className = '',
  onClick,
}: N3FastImageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  const px = SIZE_MAP[size];
  
  // 🚀 サムネイルURLをキャッシュから取得（計算済みを再利用）
  const thumbnailUrl = useMemo(() => {
    if (!src) return null;
    const sizeKey = SIZE_TO_THUMBNAIL[size];
    return getCachedThumbnail(src, sizeKey);
  }, [src, size]);
  
  // 画像がない場合のプレースホルダー
  if (!src || !thumbnailUrl) {
    return (
      <div
        className={`n3-fast-image n3-fast-image--empty ${className}`}
        style={{ width: px, height: px }}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <ImageOff size={px * 0.4} strokeWidth={1.5} />
      </div>
    );
  }
  
  return (
    <div
      className={`n3-fast-image ${className}`}
      style={{ width: px, height: px }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* ローディング表示（CSSアニメーション） */}
      {status === 'loading' && (
        <div className="n3-fast-image__loader">
          <Loader2 size={16} className="animate-spin" />
        </div>
      )}
      
      {/* エラー表示 */}
      {status === 'error' && (
        <div className="n3-fast-image__error">
          <ImageOff size={px * 0.3} />
        </div>
      )}
      
      {/* 画像本体 */}
      <img
        src={thumbnailUrl}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`n3-fast-image__img ${status === 'success' ? 'n3-fast-image__img--loaded' : ''}`}
        onLoad={() => setStatus('success')}
        onError={() => setStatus('error')}
      />
    </div>
  );
});

// ============================================================
// スタイル（CSS-in-JS は避け、グローバルCSSを使用推奨）
// ============================================================

// グローバルCSS用のスタイル定義（globals.cssに追加推奨）
export const N3FastImageStyles = `
/* N3 Fast Image - 超軽量画像コンポーネント */
.n3-fast-image {
  position: relative;
  overflow: hidden;
  background: var(--panel-border, #e5e7eb);
  border-radius: 6px;
  flex-shrink: 0;
  /* aspect-ratio でガタつき防止 */
  aspect-ratio: 1 / 1;
}

.n3-fast-image[role="button"] {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.n3-fast-image[role="button"]:hover {
  transform: scale(1.02);
}

.n3-fast-image--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #9ca3af);
}

.n3-fast-image__loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #9ca3af);
}

.n3-fast-image__error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef2f2;
  color: #ef4444;
}

.n3-fast-image__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.n3-fast-image__img--loaded {
  opacity: 1;
}
`;

// ============================================================
// ギャラリー用（複数画像の軽量表示）
// ============================================================

export interface N3FastGalleryProps {
  images: string[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  maxVisible?: number;
  gap?: number;
  onImageClick?: (index: number, url: string) => void;
}

export const N3FastGallery = memo(function N3FastGallery({
  images,
  size = 'sm',
  maxVisible = 4,
  gap = 4,
  onImageClick,
}: N3FastGalleryProps) {
  const visibleImages = images.slice(0, maxVisible);
  const remainingCount = images.length - maxVisible;
  
  return (
    <div className="n3-fast-gallery" style={{ display: 'flex', gap }}>
      {visibleImages.map((url, index) => (
        <div key={`${url}-${index}`} style={{ position: 'relative' }}>
          <N3FastImage
            src={url}
            size={size}
            onClick={() => onImageClick?.(index, url)}
          />
          
          {/* 残り枚数表示（最後の画像のみ） */}
          {index === maxVisible - 1 && remainingCount > 0 && (
            <div className="n3-fast-gallery__more">
              +{remainingCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

// ギャラリー用スタイル
export const N3FastGalleryStyles = `
.n3-fast-gallery__more {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
}
`;

// ============================================================
// エクスポート
// ============================================================

export default N3FastImage;
