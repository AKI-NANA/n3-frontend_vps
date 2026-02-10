/**
 * N3ImageGallery - 画像ギャラリーコンポーネント
 * 
 * /tools/editing の ProductModal で使用
 * メイン画像 + サムネイルグリッド
 */

'use client';

import React, { memo, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface N3ImageGalleryProps {
  /** 画像URLリスト */
  images: string[];
  /** 初期選択インデックス */
  initialIndex?: number;
  /** サムネイル表示数 */
  thumbnailCount?: number;
  /** アスペクト比 */
  aspectRatio?: string;
  /** クリックハンドラ（ライトボックス等） */
  onImageClick?: (index: number) => void;
  /** 空の時のテキスト */
  emptyText?: string;
}

export const N3ImageGallery = memo(function N3ImageGallery({
  images,
  initialIndex = 0,
  thumbnailCount = 4,
  aspectRatio = '4/3',
  onImageClick,
  emptyText = 'No Image',
}: N3ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleMainImageClick = () => {
    if (onImageClick && images.length > 0) {
      onImageClick(selectedIndex);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* メイン画像 */}
      <div
        onClick={handleMainImageClick}
        style={{
          aspectRatio,
          borderRadius: '6px',
          background: 'var(--highlight)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: images.length > 0 && onImageClick ? 'pointer' : 'default',
        }}
      >
        {images.length > 0 ? (
          <img
            src={images[selectedIndex]}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-subtle)' }}>
            <ImageIcon size={32} />
            <div style={{ fontSize: '10px', marginTop: '0.5rem' }}>{emptyText}</div>
          </div>
        )}
      </div>

      {/* サムネイル */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '4px' }}>
          {images.slice(0, thumbnailCount).map((url, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              style={{
                flex: 1,
                aspectRatio: '1',
                borderRadius: '4px',
                overflow: 'hidden',
                border:
                  idx === selectedIndex
                    ? '2px solid var(--accent)'
                    : '1px solid var(--panel-border)',
                padding: 0,
                cursor: 'pointer',
                background: 'var(--highlight)',
              }}
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </button>
          ))}
          {images.length > thumbnailCount && (
            <div
              style={{
                flex: 1,
                aspectRatio: '1',
                borderRadius: '4px',
                background: 'var(--highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-muted)',
              }}
            >
              +{images.length - thumbnailCount}
            </div>
          )}
        </div>
      )}

      {/* 画像数表示 */}
      {images.length > 0 && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            background: 'var(--panel)',
            border: '1px solid var(--panel-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Images</span>
          <span style={{ fontSize: '11px', fontWeight: 600 }}>{images.length}</span>
        </div>
      )}
    </div>
  );
});
