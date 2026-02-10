'use client';

import React, { memo, useMemo } from 'react';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 出品先情報の型定義
// ============================================================

interface ListingInfo {
  platform: 'ebay' | 'amazon' | 'qoo10' | 'shopee';
  account: string;         // MJT, GREEN, etc.
  itemId: string | null;
  status: 'active' | 'pending' | 'ended' | 'error';
  url?: string;
}

// ============================================================
// プラットフォーム別の設定
// ============================================================

const PLATFORM_CONFIG = {
  ebay: {
    label: 'eBay',
    shortLabel: 'eB',
    color: '#0064d2',      // eBay青
    bgColor: 'rgba(0, 100, 210, 0.12)',
  },
  amazon: {
    label: 'Amazon',
    shortLabel: 'Az',
    color: '#ff9900',      // Amazon オレンジ
    bgColor: 'rgba(255, 153, 0, 0.12)',
  },
  qoo10: {
    label: 'Qoo10',
    shortLabel: 'Q10',
    color: '#e31837',      // Qoo10 赤
    bgColor: 'rgba(227, 24, 55, 0.12)',
  },
  shopee: {
    label: 'Shopee',
    shortLabel: 'Sp',
    color: '#ee4d2d',      // Shopee オレンジ
    bgColor: 'rgba(238, 77, 45, 0.12)',
  },
};

const ACCOUNT_CONFIG: Record<string, { label: string; color: string }> = {
  mjt: { label: 'MJT', color: '#3b82f6' },       // 青
  MJT: { label: 'MJT', color: '#3b82f6' },
  green: { label: 'GREEN', color: '#22c55e' },   // 緑
  GREEN: { label: 'GREEN', color: '#22c55e' },
  default: { label: 'DEFAULT', color: '#6b7280' },
};

// ============================================================
// 商品から出品情報を抽出
// ============================================================

export function extractListingInfo(product: Product): ListingInfo[] {
  const listings: ListingInfo[] = [];
  const listingData = (product as any)?.listing_data || {};
  const ebayApiData = (product as any)?.ebay_api_data || {};
  
  // eBay出品情報
  if (product.ebay_item_id) {
    const account = 
      (product as any).ebay_account || 
      listingData.ebay_account ||
      ebayApiData.account ||
      'MJT';  // デフォルト
    
    listings.push({
      platform: 'ebay',
      account: account.toUpperCase(),
      itemId: product.ebay_item_id,
      status: 'active',
      url: product.ebay_listing_url || `https://www.ebay.com/itm/${product.ebay_item_id}`,
    });
    
    // 複数アカウントに出品している場合
    const additionalEbayListings = ebayApiData.additional_listings || [];
    for (const listing of additionalEbayListings) {
      if (listing.item_id && listing.account !== account) {
        listings.push({
          platform: 'ebay',
          account: listing.account.toUpperCase(),
          itemId: listing.item_id,
          status: listing.status || 'active',
          url: listing.url,
        });
      }
    }
  }
  
  // Amazon出品情報
  if ((product as any).amazon_asin) {
    listings.push({
      platform: 'amazon',
      account: (product as any).amazon_account || 'DEFAULT',
      itemId: (product as any).amazon_asin,
      status: 'active',
      url: `https://www.amazon.com/dp/${(product as any).amazon_asin}`,
    });
  }
  
  // Qoo10出品情報
  if ((product as any).qoo10_item_code) {
    listings.push({
      platform: 'qoo10',
      account: (product as any).qoo10_account || 'DEFAULT',
      itemId: (product as any).qoo10_item_code,
      status: 'active',
    });
  }
  
  // Shopee出品情報
  if ((product as any).shopee_item_id) {
    listings.push({
      platform: 'shopee',
      account: (product as any).shopee_account || 'DEFAULT',
      itemId: (product as any).shopee_item_id,
      status: 'active',
    });
  }
  
  return listings;
}

// ============================================================
// 単一出品バッジ
// ============================================================

interface SingleListingBadgeProps {
  listing: ListingInfo;
  compact?: boolean;
}

const SingleListingBadge = memo(function SingleListingBadge({ listing, compact }: SingleListingBadgeProps) {
  const platformConfig = PLATFORM_CONFIG[listing.platform];
  const accountConfig = ACCOUNT_CONFIG[listing.account] || ACCOUNT_CONFIG.default;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (listing.url) {
      window.open(listing.url, '_blank');
    }
  };
  
  if (compact) {
    // コンパクト表示: 丸いドット
    return (
      <div
        onClick={handleClick}
        title={`${platformConfig.label} (${accountConfig.label})`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: platformConfig.color,
          color: 'white',
          fontSize: '8px',
          fontWeight: 700,
          cursor: listing.url ? 'pointer' : 'default',
          border: `2px solid ${accountConfig.color}`,
        }}
      >
        {platformConfig.shortLabel.charAt(0)}
      </div>
    );
  }
  
  // フル表示: プラットフォーム + アカウント
  return (
    <div
      onClick={handleClick}
      title={listing.url ? 'クリックで出品ページを開く' : `${platformConfig.label} (${accountConfig.label})`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        height: 18,
        padding: '0 4px',
        borderRadius: 4,
        background: platformConfig.bgColor,
        cursor: listing.url ? 'pointer' : 'default',
        border: `1px solid ${platformConfig.color}30`,
      }}
    >
      {/* プラットフォーム略称 */}
      <span style={{
        fontSize: '9px',
        fontWeight: 700,
        color: platformConfig.color,
      }}>
        {platformConfig.shortLabel}
      </span>
      
      {/* アカウント */}
      <span style={{
        fontSize: '8px',
        fontWeight: 600,
        color: accountConfig.color,
        padding: '0 3px',
        borderRadius: 2,
        background: `${accountConfig.color}15`,
      }}>
        {accountConfig.label}
      </span>
    </div>
  );
});

// ============================================================
// 出品状況バッジグループ
// ============================================================

interface ListingStatusBadgesProps {
  product: Product;
  maxDisplay?: number;    // 最大表示数（超えたら+Nで表示）
  compact?: boolean;      // コンパクト表示
}

export const ListingStatusBadges = memo(function ListingStatusBadges({ 
  product, 
  maxDisplay = 3,
  compact = false,
}: ListingStatusBadgesProps) {
  const listings = useMemo(() => extractListingInfo(product), [product]);
  
  if (listings.length === 0) {
    return null;
  }
  
  const displayListings = listings.slice(0, maxDisplay);
  const remainingCount = listings.length - maxDisplay;
  
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: compact ? 2 : 4,
      flexWrap: 'wrap',
    }}>
      {displayListings.map((listing, index) => (
        <SingleListingBadge 
          key={`${listing.platform}-${listing.account}-${index}`}
          listing={listing}
          compact={compact}
        />
      ))}
      
      {remainingCount > 0 && (
        <span style={{
          fontSize: '9px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          padding: '0 4px',
        }}>
          +{remainingCount}
        </span>
      )}
    </div>
  );
});

// ============================================================
// 出品先サマリー（ホバー用）
// ============================================================

interface ListingSummaryTooltipProps {
  product: Product;
}

export const ListingSummaryTooltip = memo(function ListingSummaryTooltip({ product }: ListingSummaryTooltipProps) {
  const listings = useMemo(() => extractListingInfo(product), [product]);
  
  if (listings.length === 0) {
    return (
      <div style={{ padding: '8px 12px', fontSize: '11px', color: '#9ca3af' }}>
        未出品
      </div>
    );
  }
  
  return (
    <div style={{ padding: '8px 12px' }}>
      <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '11px', color: '#fff' }}>
        出品先 ({listings.length}件)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {listings.map((listing, index) => {
          const platformConfig = PLATFORM_CONFIG[listing.platform];
          const accountConfig = ACCOUNT_CONFIG[listing.account] || ACCOUNT_CONFIG.default;
          
          return (
            <div 
              key={`${listing.platform}-${listing.account}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '10px',
              }}
            >
              <span style={{ 
                color: platformConfig.color, 
                fontWeight: 600,
                minWidth: 36,
              }}>
                {platformConfig.label}
              </span>
              <span style={{ 
                color: accountConfig.color,
                fontWeight: 500,
              }}>
                {accountConfig.label}
              </span>
              {listing.itemId && (
                <span style={{ 
                  color: '#9ca3af',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                }}>
                  #{listing.itemId.slice(-6)}
                </span>
              )}
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: listing.status === 'active' ? '#22c55e' : 
                           listing.status === 'pending' ? '#f59e0b' : '#6b7280',
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ListingStatusBadges;
