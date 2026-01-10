/**
 * N3ProductCard - 汎用商品カードコンポーネント
 * 
 * 商品情報を表示するカード。バッジやアクションはスロットで渡す
 * マーケットプレイス固有のロジックは含まない
 * 
 * @example
 * <N3ProductCard
 *   image={product.image}
 *   title={product.name}
 *   subtitle={product.sku}
 *   topBadges={<N3Badge>eBay</N3Badge>}
 *   bottomLeftBadges={<N3Badge>45日経過</N3Badge>}
 *   priceDisplay={<PriceRow price={299.99} />}
 *   tags={[<N3Tag>New</N3Tag>, <N3Tag>利益率 25%</N3Tag>]}
 *   actions={<button>編集</button>}
 *   isSelected={isSelected}
 *   onClick={handleClick}
 * />
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import { Package } from 'lucide-react';

// ============================================================
// N3ProductCard
// ============================================================

export interface N3ProductCardProps {
  /** 商品画像URL */
  image?: string;
  /** 商品タイトル */
  title: string;
  /** サブタイトル（SKUなど） */
  subtitle?: string;
  /** 画像上部のバッジ（左上） */
  topBadges?: ReactNode;
  /** 画像左下のバッジ */
  bottomLeftBadges?: ReactNode;
  /** 画像右下のバッジ */
  bottomRightBadges?: ReactNode;
  /** 価格表示エリア */
  priceDisplay?: ReactNode;
  /** タグ/バッジ行 */
  tags?: ReactNode;
  /** アクションボタン */
  actions?: ReactNode;
  /** 選択状態 */
  isSelected?: boolean;
  /** クリックハンドラ */
  onClick?: () => void;
  /** ホバー時にズームするか */
  hoverZoom?: boolean;
  /** アスペクト比 */
  aspectRatio?: '1' | '4/3' | '16/9' | 'auto';
  /** 追加のクラス名 */
  className?: string;
}

export const N3ProductCard = memo(function N3ProductCard({
  image,
  title,
  subtitle,
  topBadges,
  bottomLeftBadges,
  bottomRightBadges,
  priceDisplay,
  tags,
  actions,
  isSelected = false,
  onClick,
  hoverZoom = true,
  aspectRatio = '1',
  className = '',
}: N3ProductCardProps) {
  const classes = [
    'n3-product-card',
    isSelected && 'n3-product-card--selected',
    onClick && 'n3-product-card--clickable',
    hoverZoom && 'n3-product-card--hover-zoom',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    // ボタンクリック時はカード全体のクリックを無効化
    if ((e.target as HTMLElement).closest('button, a')) return;
    onClick?.();
  };

  return (
    <div className={classes} onClick={handleClick}>
      {/* 画像エリア */}
      <div 
        className="n3-product-card__image-wrapper"
        style={{ aspectRatio }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="n3-product-card__image"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image';
            }}
          />
        ) : (
          <div className="n3-product-card__image-placeholder">
            <Package className="n3-product-card__image-placeholder-icon" />
          </div>
        )}
        <div className="n3-product-card__overlay" />

        {/* バッジ配置 */}
        {topBadges && (
          <div className="n3-product-card__top-badges">{topBadges}</div>
        )}
        {bottomLeftBadges && (
          <div className="n3-product-card__bottom-left">{bottomLeftBadges}</div>
        )}
        {bottomRightBadges && (
          <div className="n3-product-card__bottom-right">{bottomRightBadges}</div>
        )}
      </div>

      {/* コンテンツエリア */}
      <div className="n3-product-card__body">
        <h3 className="n3-product-card__title">{title}</h3>
        {subtitle && <p className="n3-product-card__subtitle">{subtitle}</p>}
        
        {/* 価格表示 */}
        {priceDisplay && (
          <div className="n3-product-card__prices">{priceDisplay}</div>
        )}

        {/* タグ/バッジ */}
        {tags && (
          <div className="n3-product-card__tags">{tags}</div>
        )}

        {/* アクション */}
        {actions && (
          <div className="n3-product-card__actions">{actions}</div>
        )}
      </div>
    </div>
  );
});

N3ProductCard.displayName = 'N3ProductCard';

// ============================================================
// N3ProductCardGrid - 商品カードグリッド
// ============================================================

export interface N3ProductCardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const N3ProductCardGrid = memo(function N3ProductCardGrid({
  children,
  columns = 4,
  gap = 'md',
  className = '',
}: N3ProductCardGridProps) {
  const gapSizes = { sm: '8px', md: '16px', lg: '24px' };
  
  return (
    <div
      className={`n3-product-card-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gapSizes[gap],
      }}
    >
      {children}
    </div>
  );
});

N3ProductCardGrid.displayName = 'N3ProductCardGrid';

// ============================================================
// N3ProductCardPriceRow - 価格行（ヘルパー）
// ============================================================

export interface N3ProductCardPriceRowProps {
  label: string;
  value: string | number;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export const N3ProductCardPriceRow = memo(function N3ProductCardPriceRow({
  label,
  value,
  color = 'default',
}: N3ProductCardPriceRowProps) {
  return (
    <div className="n3-product-card__price-row">
      <span className="n3-product-card__price-label">{label}</span>
      <span className={`n3-product-card__price-value n3-product-card__price-value--${color}`}>
        {value}
      </span>
    </div>
  );
});

N3ProductCardPriceRow.displayName = 'N3ProductCardPriceRow';
