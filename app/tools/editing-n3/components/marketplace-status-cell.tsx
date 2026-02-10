/**
 * MarketplaceStatusCell - 販路ステータスセルコンポーネント
 * 
 * ProductRowで使用する販路ステータス表示セル
 * 各販路のステータスをアイコンで一覧表示
 */

'use client';

import React, { memo } from 'react';
import { MarketplaceStatusChips } from '@/components/n3/ui/marketplace-status-chips';

interface MarketplaceListings {
  [key: string]: {
    price_jpy?: number;
    profit_jpy?: number;
    profit_margin?: number;
    status: 'none' | 'calculated' | 'ready' | 'listed' | 'error';
    last_calculated_at?: string;
    error_message?: string;
  };
}

interface MarketplaceStatusCellProps {
  marketplaceListings?: MarketplaceListings;
  onMarketplaceClick?: (marketplaceId: string) => void;
}

export const MarketplaceStatusCell = memo(function MarketplaceStatusCell({
  marketplaceListings,
  onMarketplaceClick,
}: MarketplaceStatusCellProps) {
  // データがない場合は空表示
  if (!marketplaceListings || Object.keys(marketplaceListings).length === 0) {
    return (
      <div style={{ 
        fontSize: '10px', 
        color: '#94a3b8',
        padding: '4px 8px',
      }}>
        未計算
      </div>
    );
  }

  return (
    <div style={{ padding: '4px 0' }}>
      <MarketplaceStatusChips
        marketplaceListings={marketplaceListings}
        compact={true}
        onMarketplaceClick={onMarketplaceClick}
      />
    </div>
  );
});

export default MarketplaceStatusCell;
