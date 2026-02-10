/**
 * N3InventoryCard - 在庫商品カードコンポーネント
 * 
 * 棚卸し画面のProductCardを汎用化
 * フェーズ表示、利益率、経過日数、マーケットプレイスバッジ対応
 * 
 * @example
 * <N3InventoryCard
 *   product={product}
 *   isSelected={isSelected}
 *   onSelect={handleSelect}
 *   onEdit={handleEdit}
 *   marketplace="ebay"
 *   account="MJT"
 * />
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import { 
  Edit, 
  ExternalLink, 
  Package, 
  Clock, 
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

export type PricePhase = 'NORMAL' | 'WARNING' | 'LIQUIDATION';
export type Marketplace = 'ebay' | 'mercari' | 'manual' | 'unknown';
export type EbayAccount = 'MJT' | 'GREEN' | 'manual' | 'UNKNOWN';
export type ProductType = 'stock' | 'dropship' | 'set' | 'variation' | 'unknown';

export interface N3InventoryCardProduct {
  id: string | number;
  name: string;
  sku?: string;
  images?: string[];
  sellingPrice?: number;
  costPrice?: number;
  listingQuantity?: number;
  physicalQuantity?: number;
  condition?: string;
  category?: string;
  daysHeld?: number;
  remainingDays?: number;
  pricePhase?: PricePhase;
  profitMargin?: number;
  inventoryType?: 'ROTATION_90_DAYS' | 'INVESTMENT_10_PERCENT';
  marketplace?: Marketplace;
  account?: EbayAccount;
  productType?: ProductType;
  ebayItemId?: string;
  externalUrl?: string;
  sellerHubUrl?: string;
}

export interface N3InventoryCardProps {
  /** 商品データ */
  product: N3InventoryCardProduct;
  /** 選択状態 */
  isSelected?: boolean;
  /** 選択ハンドラ */
  onSelect?: () => void;
  /** 編集ハンドラ */
  onEdit?: () => void;
  /** 削除ハンドラ */
  onDelete?: () => void;
  /** カードクリックハンドラ */
  onClick?: () => void;
  /** 通貨（デフォルト: USD） */
  currency?: 'USD' | 'JPY';
  /** 追加のアクションボタン */
  additionalActions?: ReactNode;
  /** サイズ指定 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Helper Functions
// ============================================================

const getPhaseInfo = (phase?: PricePhase) => {
  switch (phase) {
    case 'NORMAL':
      return { label: '✅ 通常販売', color: 'success' };
    case 'WARNING':
      return { label: '⚠️ 警戒販売', color: 'warning' };
    case 'LIQUIDATION':
      return { label: '🔴 損切り実行', color: 'error' };
    default:
      return null;
  }
};

const getMarketplaceBadge = (marketplace?: Marketplace, account?: EbayAccount) => {
  switch (marketplace) {
    case 'ebay':
      const accountUpper = (account || 'UNKNOWN').toUpperCase();
      const badgeType = accountUpper === 'GREEN' ? 'success' : accountUpper === 'MJT' ? 'info' : 'gray';
      return { label: `eBay ${accountUpper}`, type: badgeType };
    case 'mercari':
      return { label: '🔴 メルカリ', type: 'error' };
    case 'manual':
      return { label: '✏️ 手動登録', type: 'gray' };
    default:
      return { label: '不明', type: 'warning', icon: AlertTriangle };
  }
};

const getProductTypeBadge = (productType?: ProductType) => {
  switch (productType) {
    case 'stock':
      return { label: '📦 有在庫', type: 'success' };
    case 'dropship':
      return { label: '❓ 未判定', type: 'gray' };
    case 'set':
      return { label: '📦 セット品', type: 'primary' };
    default:
      return { label: '⚠️ 未設定', type: 'gray' };
  }
};

const getStockBadge = (quantity?: number) => {
  if (!quantity || quantity === 0) {
    return { label: '在庫なし', type: 'error' };
  } else if (quantity < 5) {
    return { label: `少量 (${quantity})`, type: 'warning' };
  }
  return { label: `在庫 ${quantity}`, type: 'success' };
};

// ============================================================
// Main Component
// ============================================================

export const N3InventoryCard = memo(function N3InventoryCard({
  product,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onClick,
  currency = 'USD',
  additionalActions,
  size,
  className = '',
}: N3InventoryCardProps) {
  const sizeClass = size ? `n3-size-${size}` : '';
  const classes = [
    'n3-inventory-card',
    isSelected ? 'n3-inventory-card--selected' : '',
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  const imageUrl = product.images?.[0] || '';
  const phaseInfo = getPhaseInfo(product.pricePhase);
  const marketplaceBadge = getMarketplaceBadge(product.marketplace, product.account);
  const stockBadge = getStockBadge(product.physicalQuantity);

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return '未設定';
    if (currency === 'JPY' || product.marketplace === 'mercari') {
      return `¥${price.toLocaleString()}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // ボタンクリック時はカード全体のクリックを無効化
    if ((e.target as HTMLElement).closest('button')) return;
    if (onSelect) {
      onSelect();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className={classes} onClick={handleCardClick}>
      {/* 画像エリア */}
      <div className="n3-inventory-card__image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="n3-inventory-card__image"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image';
            }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--highlight)'
          }}>
            <Package style={{ width: 48, height: 48, color: 'var(--text-muted)' }} />
          </div>
        )}
        <div className="n3-inventory-card__overlay" />

        {/* 上部バッジ */}
        <div className="n3-inventory-card__top-badges">
          <span className={`n3-badge n3-badge-${marketplaceBadge.type}`}>
            {marketplaceBadge.label}
          </span>
          {phaseInfo && (
            <span className={`n3-badge n3-badge-${phaseInfo.color}`}>
              {phaseInfo.label}
            </span>
          )}
        </div>

        {/* 左下: 経過日数 */}
        {product.daysHeld !== undefined && (
          <div className="n3-inventory-card__bottom-left">
            <span 
              className="n3-badge" 
              style={{ 
                background: 'rgba(0,0,0,0.7)', 
                color: 'white',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Clock style={{ width: 12, height: 12, marginRight: 4 }} />
              {product.daysHeld}日経過
            </span>
            {product.remainingDays !== undefined && product.remainingDays > 0 && product.remainingDays < 90 && (
              <span 
                className="n3-badge" 
                style={{ 
                  background: 'rgba(234, 88, 12, 0.7)', 
                  color: 'white',
                  backdropFilter: 'blur(4px)'
                }}
              >
                残り{product.remainingDays}日
              </span>
            )}
          </div>
        )}

        {/* 右下: 在庫バッジ */}
        <div className="n3-inventory-card__bottom-right">
          <span className={`n3-badge n3-badge-${stockBadge.type}`}>
            {stockBadge.label}
          </span>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="n3-inventory-card__body">
        <h3 className="n3-inventory-card__title">{product.name}</h3>
        
        {product.sku && (
          <p className="n3-inventory-card__sku">SKU: {product.sku}</p>
        )}

        {/* 価格情報 */}
        <div className="n3-inventory-card__prices">
          <div className="n3-inventory-card__price-row">
            <span className="n3-inventory-card__price-label">販売価格</span>
            <span className={`n3-inventory-card__price-value n3-inventory-card__price-value--${product.marketplace === 'mercari' ? 'mercari' : 'primary'}`}>
              {formatPrice(product.sellingPrice)}
            </span>
          </div>
          <div className="n3-inventory-card__price-row">
            <span className="n3-inventory-card__price-label">出品数</span>
            <span className="n3-inventory-card__price-value" style={{ color: 'var(--text)' }}>
              {product.listingQuantity || 0}
            </span>
          </div>
        </div>

        {/* バッジ */}
        <div className="n3-inventory-card__badges">
          <span className={`n3-badge ${
            !product.condition ? 'n3-badge-gray' :
            product.condition.toLowerCase() === 'new' ? 'n3-badge-success' : 'n3-badge-warning'
          }`} style={{ fontSize: 'calc(var(--n3-font) * 0.85)' }}>
            {product.condition || '状態不明'}
          </span>

          {product.profitMargin !== undefined && (
            <span className={`n3-badge ${
              product.profitMargin < 5 ? 'n3-badge-error' :
              product.profitMargin < 10 ? 'n3-badge-warning' : 'n3-badge-success'
            }`} style={{ fontSize: 'calc(var(--n3-font) * 0.85)' }}>
              利益率 {product.profitMargin.toFixed(1)}%
            </span>
          )}

          {product.inventoryType && (
            <span className={`n3-badge ${
              product.inventoryType === 'ROTATION_90_DAYS' ? 'n3-badge-info' : 'n3-badge-purple'
            }`} style={{ fontSize: 'calc(var(--n3-font) * 0.85)' }}>
              {product.inventoryType === 'ROTATION_90_DAYS' ? '⚡ 回転商品' : '💎 投資商品'}
            </span>
          )}
        </div>

        {/* アクションボタン */}
        <div className="n3-inventory-card__actions">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="n3-btn n3-btn-outline n3-btn-sm"
              style={{ flex: 1 }}
            >
              <Edit style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', marginRight: 4 }} />
              詳細
            </button>
          )}
          
          {product.sellerHubUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); window.open(product.sellerHubUrl, '_blank'); }}
              className="n3-btn n3-btn-ghost n3-btn-sm"
              title="Seller Hubで編集"
            >
              <Settings style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)' }} />
            </button>
          )}
          
          {product.externalUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); window.open(product.externalUrl, '_blank'); }}
              className="n3-btn n3-btn-ghost n3-btn-sm"
              title="外部サイトで開く"
            >
              <ExternalLink style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)' }} />
            </button>
          )}

          {additionalActions}
        </div>
      </div>
    </div>
  );
});

N3InventoryCard.displayName = 'N3InventoryCard';

// ============================================================
// Grid Component
// ============================================================

export interface N3InventoryCardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const N3InventoryCardGrid = memo(function N3InventoryCardGrid({
  children,
  columns = 4,
  gap = 'md',
  className = '',
}: N3InventoryCardGridProps) {
  const gapSizes = { sm: '8px', md: '16px', lg: '24px' };
  
  return (
    <div
      className={className}
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

N3InventoryCardGrid.displayName = 'N3InventoryCardGrid';
