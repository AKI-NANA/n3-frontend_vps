'use client';

import { useState } from 'react';
import { COLORS, FONTS, SPACING, RADIUS } from './styles';

// 画像ギャラリー（左カラム用）
interface ImageGalleryProps {
  images: string[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

export function ImageGallery({ images, selectedIndex = 0, onSelect }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
    onSelect?.(index);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
      {/* メイン画像 */}
      <div
        style={{
          aspectRatio: '4/3',
          borderRadius: RADIUS.lg,
          overflow: 'hidden',
          background: COLORS.bgInput,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        {images.length > 0 ? (
          <img
            src={images[currentIndex]}
            alt="商品画像"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
            }}
          >
            <i className="fas fa-image" style={{ fontSize: '2.5rem' }} />
          </div>
        )}
      </div>

      {/* サムネイル */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: SPACING.xs }}>
          {images.slice(0, 4).map((url, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                flex: 1,
                aspectRatio: '1',
                borderRadius: RADIUS.sm,
                overflow: 'hidden',
                border: idx === currentIndex 
                  ? `2px solid ${COLORS.primary}` 
                  : `1px solid ${COLORS.border}`,
                padding: 0,
                cursor: 'pointer',
                background: COLORS.bgInput,
              }}
            >
              <img 
                src={url} 
                alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </button>
          ))}
        </div>
      )}

      {/* 画像枚数 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: FONTS.sizeSm,
          color: COLORS.textSecondary,
        }}
      >
        <i className="fas fa-images" style={{ marginRight: SPACING.xs }} />
        {images.length}枚
      </div>
    </div>
  );
}

// 画像重複排除ユーティリティ
export function getUniqueImages(product: any): string[] {
  if (!product) return [];
  const seen = new Set<string>();
  const images: string[] = [];

  const sources = [
    product.gallery_images,
    product?.scraped_data?.images,
    product.images,
    product?.image_urls,
  ];

  for (const source of sources) {
    if (Array.isArray(source)) {
      for (const item of source) {
        const url = typeof item === 'string' ? item : item?.url || item?.original;
        if (url && typeof url === 'string' && url.startsWith('http') && !seen.has(url)) {
          seen.add(url);
          images.push(url);
        }
      }
    }
  }

  return images;
}
