'use client';

/**
 * N3ProductCell - 商品セル（画像 + 2行タイトル）
 * 
 * 用途:
 * - テーブル行での商品情報表示
 * - 日本語タイトル + 英語タイトルの2行表示
 * - 画像クリックでモーダル/アクション
 * 
 * Design Spec:
 * - 画像: 32x32px (default), 40x40px (large), 22x22px (compact)
 * - タイトル: 11px (main), 10px (sub)
 * - ホバー時: 画像にリング表示
 */

import React, { memo, useState, useRef, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

// ============================================
// LazyImage - 遅延読み込み画像
// ============================================
interface LazyImageProps {
  src: string | null;
  alt?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
}

const LazyImage = memo(function LazyImage({
  src,
  alt = '',
  size = 32,
  onClick,
  className = '',
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0,
    borderRadius: 'var(--radius-sm, 4px)',
    overflow: 'hidden',
    background: 'var(--highlight, #f3f4f6)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'box-shadow 0.15s ease',
  };

  const hoverStyle: React.CSSProperties = {
    boxShadow: '0 0 0 2px var(--accent, #6366f1)',
  };

  const [hovered, setHovered] = useState(false);

  if (!src || hasError) {
    return (
      <div
        ref={imgRef}
        onClick={onClick}
        className={className}
        style={{ ...containerStyle, ...(hovered ? hoverStyle : {}) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ImageIcon size={size * 0.4} style={{ color: 'var(--text-subtle, #9ca3af)' }} />
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      onClick={onClick}
      className={className}
      style={{ ...containerStyle, ...(hovered ? hoverStyle : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--highlight, #e5e7eb)',
            animation: 'pulse 2s infinite',
          }}
        />
      )}
    </div>
  );
});

// ============================================
// N3ProductCell - メインコンポーネント
// ============================================
export interface N3ProductCellProps {
  /** 画像URL */
  imageUrl?: string | null;
  /** メインタイトル（日本語） */
  title: string;
  /** サブタイトル（英語） */
  subTitle?: string;
  /** 画像サイズ */
  imageSize?: 'sm' | 'md' | 'lg';
  /** タイトル折り返し */
  wrapText?: boolean;
  /** 画像クリック */
  onImageClick?: () => void;
  /** タイトル編集可能 */
  editable?: boolean;
  /** タイトル変更コールバック */
  onTitleChange?: (title: string) => void;
  /** サブタイトル変更コールバック */
  onSubTitleChange?: (subTitle: string) => void;
  className?: string;
}

export const N3ProductCell = memo(function N3ProductCell({
  imageUrl,
  title,
  subTitle,
  imageSize = 'md',
  wrapText = false,
  onImageClick,
  editable = false,
  onTitleChange,
  onSubTitleChange,
  className = '',
}: N3ProductCellProps) {
  const sizeMap = { sm: 22, md: 32, lg: 40 };
  const size = sizeMap[imageSize];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    height: '100%',
    padding: '0 4px',
    minWidth: 0,
  };

  const titleContainerStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text, #1f2937)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: wrapText ? 'normal' : 'nowrap',
    lineHeight: '1.3',
  };

  const subTitleStyle: React.CSSProperties = {
    fontSize: '10px',
    color: 'var(--text-muted, #6b7280)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: wrapText ? 'normal' : 'nowrap',
    lineHeight: '1.3',
  };

  return (
    <div style={containerStyle} className={className}>
      <LazyImage
        src={imageUrl || null}
        alt={title}
        size={size}
        onClick={onImageClick}
      />
      <div style={titleContainerStyle}>
        {editable ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            style={{
              ...titleStyle,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              padding: 0,
              cursor: 'text',
            }}
          />
        ) : (
          <div style={titleStyle} title={title}>
            {title || '-'}
          </div>
        )}
        {subTitle !== undefined && (
          editable ? (
            <input
              type="text"
              value={subTitle}
              onChange={(e) => onSubTitleChange?.(e.target.value)}
              style={{
                ...subTitleStyle,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                padding: 0,
                cursor: 'text',
              }}
              placeholder="English title"
            />
          ) : (
            <div style={subTitleStyle} title={subTitle}>
              {subTitle || '-'}
            </div>
          )
        )}
      </div>
    </div>
  );
});

export default N3ProductCell;
