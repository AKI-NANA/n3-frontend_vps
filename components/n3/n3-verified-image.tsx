// components/n3/n3-verified-image.tsx
/**
 * N3 Verified Image Component
 * 
 * 機能:
 * 1. 超軽量画像表示（N3FastImage拡張）
 * 2. 確定ステータス視覚化（エメラルドグリーン枠）
 * 3. UID表示・コピー対応
 * 
 * 「真実の在庫」ステータス:
 * - 原価、個数、タイトルが揃い、人間が「確定」チェックを入れたデータ
 * - 枠色がエメラルドグリーンに変化
 * - チェックアイコン表示
 * 
 * @version 1.0.0
 * @date 2025-12-22
 */

'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import { ImageOff, Loader2, Check, Copy, CheckCircle } from 'lucide-react';
import { getCachedThumbnail } from '@/lib/services/image/image-optimization';

// ============================================================
// 型定義
// ============================================================

export interface N3VerifiedImageProps {
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
  
  // 🚀 新機能: 確定ステータス
  /** データ確定済みフラグ（真実の在庫） */
  isVerified?: boolean;
  
  // 🚀 新機能: UID表示
  /** UID（一意識別子） */
  uid?: string;
  /** UIDを表示するか */
  showUid?: boolean;
}

// ============================================================
// サイズマップ
// ============================================================

const SIZE_MAP = {
  xs: 32,
  sm: 48,
  md: 80,
  lg: 120,
} as const;

const SIZE_TO_THUMBNAIL = {
  xs: 'thumbnail',
  sm: 'thumbnail',
  md: 'thumbnail',
  lg: 'small',
} as const;

// ============================================================
// コンポーネント
// ============================================================

export const N3VerifiedImage = memo(function N3VerifiedImage({
  src,
  alt = '',
  size = 'md',
  className = '',
  onClick,
  isVerified = false,
  uid,
  showUid = false,
}: N3VerifiedImageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [copied, setCopied] = useState(false);
  
  const px = SIZE_MAP[size];
  
  const thumbnailUrl = useMemo(() => {
    if (!src) return null;
    const sizeKey = SIZE_TO_THUMBNAIL[size];
    return getCachedThumbnail(src, sizeKey);
  }, [src, size]);
  
  // UIDコピー機能
  const handleCopyUid = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!uid) return;
    
    try {
      await navigator.clipboard.writeText(uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy UID:', err);
    }
  }, [uid]);
  
  // 確定ステータスのスタイル
  const verifiedStyle = isVerified ? {
    borderColor: '#10b981', // エメラルドグリーン
    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(16, 185, 129, 0.15)',
  } : {};
  
  // 画像がない場合のプレースホルダー
  if (!src || !thumbnailUrl) {
    return (
      <div
        className={`n3-verified-image n3-verified-image--empty ${isVerified ? 'n3-verified-image--verified' : ''} ${className}`}
        style={{ width: px, height: px, ...verifiedStyle }}
        onClick={onClick}
        data-uid={uid}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <ImageOff size={px * 0.4} strokeWidth={1.5} />
        
        {/* 確定バッジ */}
        {isVerified && (
          <div className="n3-verified-image__badge">
            <Check size={10} />
          </div>
        )}
        
        {/* UID表示 */}
        {showUid && uid && (
          <UidDisplay uid={uid} onCopy={handleCopyUid} copied={copied} />
        )}
      </div>
    );
  }
  
  return (
    <div
      className={`n3-verified-image ${isVerified ? 'n3-verified-image--verified' : ''} ${className}`}
      style={{ width: px, height: px, ...verifiedStyle }}
      onClick={onClick}
      data-uid={uid}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* ローディング表示 */}
      {status === 'loading' && (
        <div className="n3-verified-image__loader">
          <Loader2 size={16} className="animate-spin" />
        </div>
      )}
      
      {/* エラー表示 */}
      {status === 'error' && (
        <div className="n3-verified-image__error">
          <ImageOff size={px * 0.3} />
        </div>
      )}
      
      {/* 画像本体 */}
      <img
        src={thumbnailUrl}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`n3-verified-image__img ${status === 'success' ? 'n3-verified-image__img--loaded' : ''}`}
        onLoad={() => setStatus('success')}
        onError={() => setStatus('error')}
      />
      
      {/* 確定バッジ */}
      {isVerified && status === 'success' && (
        <div className="n3-verified-image__badge">
          <CheckCircle size={12} />
        </div>
      )}
      
      {/* UID表示 */}
      {showUid && uid && (
        <UidDisplay uid={uid} onCopy={handleCopyUid} copied={copied} />
      )}
    </div>
  );
});

// ============================================================
// UID表示コンポーネント
// ============================================================

interface UidDisplayProps {
  uid: string;
  onCopy: (e: React.MouseEvent) => void;
  copied: boolean;
}

const UidDisplay = memo(function UidDisplay({ uid, onCopy, copied }: UidDisplayProps) {
  // UIDを短縮表示（最初の8文字）
  const shortUid = uid.length > 8 ? `${uid.slice(0, 8)}...` : uid;
  
  return (
    <div className="n3-verified-image__uid" onClick={onCopy} title={`UID: ${uid}`}>
      <span className="n3-verified-image__uid-text">{shortUid}</span>
      {copied ? (
        <Check size={10} className="n3-verified-image__uid-icon n3-verified-image__uid-icon--copied" />
      ) : (
        <Copy size={10} className="n3-verified-image__uid-icon" />
      )}
    </div>
  );
});

// ============================================================
// スタイル（CSS-in-JS回避、グローバルCSS推奨）
// ============================================================

export const N3VerifiedImageStyles = `
/* N3 Verified Image - 確定ステータス付き画像コンポーネント */
.n3-verified-image {
  position: relative;
  overflow: hidden;
  background: var(--panel-border, #e5e7eb);
  border-radius: 6px;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  border: 2px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.n3-verified-image[role="button"] {
  cursor: pointer;
}

.n3-verified-image[role="button"]:hover {
  transform: scale(1.02);
}

/* 確定済みスタイル */
.n3-verified-image--verified {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(16, 185, 129, 0.15);
}

.n3-verified-image--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #9ca3af);
}

.n3-verified-image__loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #9ca3af);
}

.n3-verified-image__error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef2f2;
  color: #ef4444;
}

.n3-verified-image__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.n3-verified-image__img--loaded {
  opacity: 1;
}

/* 確定バッジ */
.n3-verified-image__badge {
  position: absolute;
  top: 2px;
  right: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* UID表示 */
.n3-verified-image__uid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 9px;
  font-family: monospace;
  cursor: pointer;
  transition: background 0.15s ease;
}

.n3-verified-image__uid:hover {
  background: rgba(0, 0, 0, 0.85);
}

.n3-verified-image__uid-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.n3-verified-image__uid-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.n3-verified-image__uid-icon--copied {
  color: #10b981;
  opacity: 1;
}
`;

export default N3VerifiedImage;
