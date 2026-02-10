/**
 * N3ProductCard - 商品表示用カードコンポーネント
 * 
 * N3CardGridと組み合わせて使用する商品カード
 */

'use client';

import React, { memo, useState } from 'react';
import { Check, AlertTriangle, FileText, Truck, Globe, Tag } from 'lucide-react';

export interface N3ProductCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  price: number;
  currency?: 'USD' | 'JPY';
  profitAmount?: number;
  profitMargin?: number;
  sku?: string;
  filterPassed?: boolean;
  category?: string;
  categoryId?: string | number;
  htsCode?: string;
  originCountry?: string;
  hasEnglishTitle?: boolean;
  hasHtml?: boolean;
  hasShipping?: boolean;
  isVeroBrand?: boolean;
  selected?: boolean;
  compact?: boolean;
  onSelect?: (id: string) => void;
  onDetail?: (id: string) => void;
}

export const N3ProductCard = memo(function N3ProductCard({
  id,
  title,
  imageUrl,
  price,
  currency = 'USD',
  profitAmount,
  profitMargin,
  sku,
  filterPassed,
  category,
  categoryId,
  htsCode,
  originCountry,
  hasEnglishTitle,
  hasHtml,
  hasShipping,
  isVeroBrand,
  selected = false,
  compact = false,
  onSelect,
  onDetail,
}: N3ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDetail) {
      onDetail(id);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(id);
    }
  };

  // 利益マージンの色
  const getMarginColor = (margin?: number) => {
    if (margin === undefined) return 'var(--text-muted)';
    if (margin >= 30) return 'var(--color-success)';
    if (margin >= 15) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  // フィルターパス状態の色
  const getFilterColor = (passed?: boolean) => {
    if (passed === undefined) return 'var(--text-muted)';
    return passed ? 'var(--color-success)' : 'var(--color-error)';
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: selected ? 'rgba(99, 102, 241, 0.08)' : 'var(--panel)',
        border: `1px solid ${selected ? 'var(--accent)' : isHovered ? 'var(--panel-border-hover, var(--accent))' : 'var(--panel-border)'}`,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {/* 画像エリア */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 1:1 アスペクト比
          background: 'var(--highlight)',
          overflow: 'hidden',
        }}
      >
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageError(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
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
              color: 'var(--text-muted)',
              fontSize: 11,
            }}
          >
            No Image
          </div>
        )}

        {/* 選択チェックボックス */}
        <div
          onClick={handleSelect}
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            width: 20,
            height: 20,
            borderRadius: 4,
            background: selected ? 'var(--accent)' : 'rgba(255,255,255,0.9)',
            border: `1px solid ${selected ? 'var(--accent)' : 'var(--panel-border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {selected && <Check size={12} color="white" />}
        </div>

        {/* VERO警告バッジ */}
        {isVeroBrand && (
          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'rgba(239, 68, 68, 0.9)',
              color: 'white',
              fontSize: 9,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <AlertTriangle size={10} />
            VERO
          </div>
        )}

        {/* フィルターパス状態 */}
        {filterPassed !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: getFilterColor(filterPassed),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={10} color="white" />
          </div>
        )}
      </div>

      {/* 情報エリア */}
      <div style={{ padding: compact ? 8 : 10 }}>
        {/* タイトル */}
        <div
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 500,
            color: 'var(--text)',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: compact ? 28 : 32,
            marginBottom: 6,
          }}
          title={title}
        >
          {title || 'No Title'}
        </div>

        {/* 価格・利益 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div
            style={{
              fontSize: compact ? 13 : 14,
              fontWeight: 700,
              color: 'var(--text)',
              fontFamily: 'monospace',
            }}
          >
            {currency === 'USD' ? '$' : '¥'}
            {price.toLocaleString(undefined, { minimumFractionDigits: currency === 'USD' ? 2 : 0, maximumFractionDigits: currency === 'USD' ? 2 : 0 })}
          </div>
          {profitMargin !== undefined && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: getMarginColor(profitMargin),
                fontFamily: 'monospace',
              }}
            >
              {profitMargin.toFixed(1)}%
            </div>
          )}
        </div>

        {/* ステータスアイコン */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* 英語タイトル */}
          <StatusIcon
            icon={<Globe size={10} />}
            active={hasEnglishTitle}
            title="英語タイトル"
          />
          {/* HTML */}
          <StatusIcon
            icon={<FileText size={10} />}
            active={hasHtml}
            title="HTML説明"
          />
          {/* 配送 */}
          <StatusIcon
            icon={<Truck size={10} />}
            active={hasShipping}
            title="配送設定"
          />
          {/* カテゴリ */}
          <StatusIcon
            icon={<Tag size={10} />}
            active={!!categoryId}
            title={category || 'カテゴリ'}
          />
        </div>

        {/* SKU（非コンパクト時のみ） */}
        {!compact && sku && (
          <div
            style={{
              marginTop: 6,
              fontSize: 10,
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            SKU: {sku}
          </div>
        )}
      </div>
    </div>
  );
});

// ステータスアイコン
const StatusIcon = memo(function StatusIcon({
  icon,
  active,
  title,
}: {
  icon: React.ReactNode;
  active?: boolean;
  title: string;
}) {
  return (
    <div
      title={title}
      style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
        color: active ? 'var(--color-success)' : 'var(--text-muted)',
      }}
    >
      {icon}
    </div>
  );
});

export default N3ProductCard;
