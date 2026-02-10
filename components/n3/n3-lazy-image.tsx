// components/n3/n3-lazy-image.tsx
/**
 * N3 遅延読み込み画像コンポーネント
 * 
 * 機能:
 * 1. Intersection Observerによる遅延読み込み
 * 2. サムネイル自動生成
 * 3. ローディング・エラー状態表示
 * 4. ズーム機能
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { ImageOff, ZoomIn, Loader2 } from 'lucide-react';
import {
  getThumbnailUrl,
  PLACEHOLDER_IMAGE,
  ERROR_PLACEHOLDER,
  LAZY_LOAD_OPTIONS,
  IMAGE_SIZES,
} from '@/lib/services/image/image-optimization';

// ============================================================
// 型定義
// ============================================================

export interface N3LazyImageProps {
  /** 画像URL */
  src: string;
  /** altテキスト */
  alt?: string;
  /** サイズプリセット */
  size?: keyof typeof IMAGE_SIZES;
  /** カスタム幅 */
  width?: number;
  /** カスタム高さ */
  height?: number;
  /** クリック時のコールバック */
  onClick?: () => void;
  /** ズーム有効化 */
  enableZoom?: boolean;
  /** 追加のクラス名 */
  className?: string;
  /** 追加のスタイル */
  style?: React.CSSProperties;
  /** フォールバック画像 */
  fallbackSrc?: string;
  /** 角丸 */
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';
  /** オブジェクトフィット */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

// ============================================================
// コンポーネント
// ============================================================

export const N3LazyImage = memo(function N3LazyImage({
  src,
  alt = '',
  size = 'thumbnail',
  width,
  height,
  onClick,
  enableZoom = false,
  className = '',
  style,
  fallbackSrc,
  rounded = 'md',
  objectFit = 'cover',
}: N3LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  
  // サイズ計算
  const sizeConfig = IMAGE_SIZES[size];
  const finalWidth = width || sizeConfig.width;
  const finalHeight = height || sizeConfig.height;
  
  // サムネイルURL生成
  const thumbnailUrl = src ? getThumbnailUrl(src, size) : '';
  
  // Intersection Observer
  useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      LAZY_LOAD_OPTIONS
    );
    
    observer.observe(imgRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  // 画像読み込み完了
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
  }, []);
  
  // 画像読み込みエラー
  const handleError = useCallback(() => {
    setIsLoaded(true);
    setIsError(true);
  }, []);
  
  // 角丸クラス
  const getRoundedClass = () => {
    if (rounded === true || rounded === 'md') return 'rounded-md';
    if (rounded === 'sm') return 'rounded-sm';
    if (rounded === 'lg') return 'rounded-lg';
    if (rounded === 'full') return 'rounded-full';
    return '';
  };
  
  // 表示する画像URL
  const displayUrl = isError 
    ? (fallbackSrc || ERROR_PLACEHOLDER)
    : (isInView ? thumbnailUrl : PLACEHOLDER_IMAGE);
  
  return (
    <>
      <div
        ref={imgRef}
        className={`relative overflow-hidden ${getRoundedClass()} ${className}`}
        style={{
          width: finalWidth,
          height: finalHeight,
          backgroundColor: 'var(--panel-border)',
          cursor: onClick || enableZoom ? 'pointer' : 'default',
          ...style,
        }}
        onClick={() => {
          if (enableZoom && !isError) {
            setShowZoom(true);
          }
          onClick?.();
        }}
      >
        {/* ローディングインジケーター */}
        {!isLoaded && isInView && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 
              size={Math.min(finalWidth, finalHeight) * 0.3} 
              className="animate-spin"
              style={{ color: 'var(--text-muted)' }}
            />
          </div>
        )}
        
        {/* 画像 */}
        {(isInView || isLoaded) && (
          <img
            src={displayUrl}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
            className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ objectFit }}
          />
        )}
        
        {/* エラー表示 */}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ImageOff 
              size={Math.min(finalWidth, finalHeight) * 0.3} 
              style={{ color: 'var(--text-muted)' }}
            />
          </div>
        )}
        
        {/* ズームアイコン */}
        {enableZoom && isLoaded && !isError && (
          <div 
            className="absolute bottom-1 right-1 p-1 rounded bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
          >
            <ZoomIn size={14} className="text-white" />
          </div>
        )}
      </div>
      
      {/* ズームモーダル */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowZoom(false)}
        >
          <img
            src={src} // オリジナル画像
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full"
            onClick={() => setShowZoom(false)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
});

// ============================================================
// 画像グリッドコンポーネント
// ============================================================

export interface N3ImageGridProps {
  images: string[];
  columns?: number;
  gap?: number;
  imageSize?: keyof typeof IMAGE_SIZES;
  maxImages?: number;
  onImageClick?: (index: number, url: string) => void;
  enableZoom?: boolean;
}

export const N3ImageGrid = memo(function N3ImageGrid({
  images,
  columns = 4,
  gap = 8,
  imageSize = 'small',
  maxImages = 12,
  onImageClick,
  enableZoom = true,
}: N3ImageGridProps) {
  const displayImages = images.slice(0, maxImages);
  const remainingCount = images.length - maxImages;
  
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {displayImages.map((url, index) => (
        <div key={`${url}-${index}`} className="relative">
          <N3LazyImage
            src={url}
            size={imageSize}
            enableZoom={enableZoom}
            onClick={() => onImageClick?.(index, url)}
            rounded="sm"
          />
          
          {/* 残り枚数表示 */}
          {index === maxImages - 1 && remainingCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-sm">
              <span className="text-white font-bold">+{remainingCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

// ============================================================
// エクスポート
// ============================================================

export default N3LazyImage;
