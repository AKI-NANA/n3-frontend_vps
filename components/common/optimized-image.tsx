// components/common/optimized-image.tsx
/**
 * OptimizedImage コンポーネント
 * 
 * 機能:
 * - next/image を使用した最適化
 * - WebP形式の自動変換
 * - Lazy loading によるパフォーマンス向上
 * - プレースホルダー表示
 * - エラー時のフォールバック
 * - 400件以上のリストでもスムーズにスクロール
 */
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

// ============================================================
// 型定義
// ============================================================

export interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
  showLoadingIndicator?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  unoptimized?: boolean;
}

// ============================================================
// デフォルト値
// ============================================================

// プレースホルダー画像（SVG Base64）- 事前エンコード済み
const PLACEHOLDER_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZTVlN2ViIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5Y2EzYWYiIGZvbnQtc2l6ZT0iMTAiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

// ローディングプレースホルダー - 事前エンコード済み
const LOADING_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZmFmYiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMyI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIxNTsyNTsxNSIgZHVyPSIxLjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswLjU7MSIgZHVyPSIxLjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvY2lyY2xlPjwvc3ZnPg==';

// エラープレースホルダー - 事前エンコード済み
const ERROR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZlZjJmMiIvPjx0ZXh0IHg9IjUwIiB5PSI0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2VmNDQ0NCIgZm9udC1zaXplPSIyNCI+ITwvdGV4dD48dGV4dCB4PSI1MCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtc2l6ZT0iMTAiPkVycm9yPC90ZXh0Pjwvc3ZnPg==';

// ============================================================
// メインコンポーネント
// ============================================================

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  priority = false,
  quality = 75, // WebP品質（バランス重視）
  placeholder = 'empty',
  objectFit = 'cover',
  fallbackSrc = PLACEHOLDER_SVG,
  showLoadingIndicator = true,
  onLoad,
  onError,
  sizes,
  unoptimized = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // 画像URLの正規化
  const normalizedSrc = useMemo(() => {
    if (!currentSrc) return fallbackSrc;
    
    // 既にBase64またはData URLの場合はそのまま
    if (currentSrc.startsWith('data:')) return currentSrc;
    
    // 相対パスを絶対パスに変換
    if (currentSrc.startsWith('/')) {
      return currentSrc;
    }
    
    // 外部URLはそのまま
    return currentSrc;
  }, [currentSrc, fallbackSrc]);

  // ローディング完了ハンドラー
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // エラーハンドラー
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    
    // フォールバック画像に切り替え
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    
    onError?.();
  }, [currentSrc, fallbackSrc, onError]);

  // サイズの計算
  const computedSizes = useMemo(() => {
    if (sizes) return sizes;
    if (fill) return '100vw';
    if (width) {
      if (width <= 64) return '64px';
      if (width <= 128) return '128px';
      if (width <= 256) return '256px';
      if (width <= 512) return '512px';
      return `${width}px`;
    }
    return '100vw';
  }, [sizes, fill, width]);

  // コンテナスタイル
  const containerStyle = useMemo(() => {
    if (fill) {
      return {
        position: 'relative' as const,
        width: '100%',
        height: '100%',
      };
    }
    return {
      position: 'relative' as const,
      width: width ? `${width}px` : 'auto',
      height: height ? `${height}px` : 'auto',
    };
  }, [fill, width, height]);

  // 画像のobject-fitスタイル
  const imageStyle = useMemo(() => ({
    objectFit,
  }), [objectFit]);

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-100',
        containerClassName
      )}
      style={containerStyle}
    >
      {/* ローディングインジケーター */}
      {showLoadingIndicator && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {/* エラー表示 */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <span className="text-red-400 text-xs">Load Error</span>
        </div>
      )}

      {/* メイン画像 */}
      {fill ? (
        <Image
          src={normalizedSrc}
          alt={alt}
          fill
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          style={imageStyle}
          priority={priority}
          quality={quality}
          sizes={computedSizes}
          onLoad={handleLoad}
          onError={handleError}
          unoptimized={unoptimized}
        />
      ) : (
        <Image
          src={normalizedSrc}
          alt={alt}
          width={width || 100}
          height={height || 100}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          style={imageStyle}
          priority={priority}
          quality={quality}
          sizes={computedSizes}
          onLoad={handleLoad}
          onError={handleError}
          unoptimized={unoptimized}
        />
      )}
    </div>
  );
};

// ============================================================
// サムネイル専用コンポーネント（リスト表示に最適化）
// ============================================================

export interface ThumbnailImageProps {
  src: string | null | undefined;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
}

const SIZE_MAP = {
  xs: { width: 32, height: 32 },
  sm: { width: 48, height: 48 },
  md: { width: 64, height: 64 },
  lg: { width: 96, height: 96 },
  xl: { width: 128, height: 128 },
};

export const ThumbnailImage: React.FC<ThumbnailImageProps> = ({
  src,
  alt,
  size = 'md',
  className,
  onClick,
  showBadge = false,
  badgeText,
  badgeColor = '#ef4444',
}) => {
  const { width, height } = SIZE_MAP[size];

  return (
    <div 
      className={cn(
        'relative rounded-md overflow-hidden border border-gray-200',
        onClick && 'cursor-pointer hover:ring-2 hover:ring-blue-400 transition-shadow',
        className
      )}
      style={{ width, height }}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={60} // サムネイルは品質を下げる
        objectFit="cover"
        showLoadingIndicator={false}
      />
      
      {/* バッジ */}
      {showBadge && badgeText && (
        <div 
          className="absolute top-0 right-0 px-1 py-0.5 text-[10px] text-white font-bold rounded-bl"
          style={{ backgroundColor: badgeColor }}
        >
          {badgeText}
        </div>
      )}
    </div>
  );
};

// ============================================================
// ギャラリー画像コンポーネント
// ============================================================

export interface GalleryImageProps {
  images: (string | null | undefined)[];
  alt: string;
  maxDisplay?: number;
  thumbnailSize?: 'xs' | 'sm' | 'md';
  onImageClick?: (index: number) => void;
  className?: string;
}

export const GalleryImages: React.FC<GalleryImageProps> = ({
  images,
  alt,
  maxDisplay = 4,
  thumbnailSize = 'sm',
  onImageClick,
  className,
}) => {
  const validImages = images.filter(img => img && img.trim() !== '');
  const displayImages = validImages.slice(0, maxDisplay);
  const remainingCount = validImages.length - maxDisplay;

  if (displayImages.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-md', className)}>
        <span className="text-gray-400 text-xs">No Images</span>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-1', className)}>
      {displayImages.map((img, index) => (
        <ThumbnailImage
          key={index}
          src={img}
          alt={`${alt} - ${index + 1}`}
          size={thumbnailSize}
          onClick={() => onImageClick?.(index)}
        />
      ))}
      
      {remainingCount > 0 && (
        <div 
          className={cn(
            'flex items-center justify-center bg-gray-200 rounded-md text-gray-600 text-xs font-medium',
            thumbnailSize === 'xs' && 'w-8 h-8',
            thumbnailSize === 'sm' && 'w-12 h-12',
            thumbnailSize === 'md' && 'w-16 h-16',
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// ============================================================
// 遅延読み込み画像（仮想リスト用）
// ============================================================

export interface LazyImageProps extends OptimizedImageProps {
  threshold?: number;
  rootMargin?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  threshold = 0.1,
  rootMargin = '200px',
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={containerRef}>
      {isInView ? (
        <OptimizedImage {...props} />
      ) : (
        <div 
          className={cn(
            'bg-gray-100 animate-pulse',
            props.containerClassName
          )}
          style={{
            width: props.width,
            height: props.height,
          }}
        />
      )}
    </div>
  );
};

// ============================================================
// エクスポート
// ============================================================

export default OptimizedImage;
