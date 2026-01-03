// app/tools/operations-n3/components/cards/shipping-card.tsx
/**
 * ShippingCard - 出荷カード (Presentational)
 * React.memo + 外部マージン禁止
 */

'use client';

import React, { memo } from 'react';
import { Package, Truck, MapPin } from 'lucide-react';
import { N3Checkbox } from '@/components/n3';
import {
  ShippingStatusBadge,
  MarketplaceBadge,
  DeadlineDisplay,
  PriorityBadge,
} from './operations-badges';
import type { ShippingItem } from '../../types/operations';

export interface ShippingCardProps {
  item: ShippingItem;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (item: ShippingItem) => void;
}

export const ShippingCard = memo(function ShippingCard({
  item,
  selected = false,
  onSelect,
  onClick,
}: ShippingCardProps) {
  return (
    <div
      style={{
        background: selected ? 'rgba(59, 130, 246, 0.05)' : 'var(--panel)',
        border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--panel-border)'}`,
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onClick={() => onClick?.(item)}
    >
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {onSelect && (
          <N3Checkbox
            checked={selected}
            onChange={() => onSelect(item.id)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <MarketplaceBadge marketplace={item.marketplace} />
        {item.priority === 'critical' || item.priority === 'high' ? (
          <PriorityBadge priority={item.priority} />
        ) : null}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          <DeadlineDisplay deadline={item.deadline} />
          <ShippingStatusBadge status={item.status} />
        </div>
      </div>

      {/* 商品情報 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '6px',
            background: 'var(--highlight)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Package size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.productTitle}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            SKU: {item.productSku} • 数量: {item.quantity}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            顧客: {item.customerName}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid var(--panel-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <MapPin size={12} />
            {item.destinationCountry}
          </div>
          {item.shippingMethod && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Truck size={12} />
              {item.shippingMethod}
            </div>
          )}
        </div>

        {item.trackingNumber && (
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {item.trackingNumber}
          </div>
        )}
      </div>

      {/* チェックリスト進捗 */}
      {(item.packingChecklist || item.shippingChecklist) && (
        <div style={{ marginTop: '8px' }}>
          <div
            style={{
              height: '4px',
              background: 'var(--highlight)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'var(--color-primary)',
                borderRadius: '2px',
                width: `${calculateProgress(item)}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
            {calculateProgress(item)}% 完了
          </div>
        </div>
      )}
    </div>
  );
});

function calculateProgress(item: ShippingItem): number {
  const packing = item.packingChecklist || [];
  const shipping = item.shippingChecklist || [];
  const total = packing.length + shipping.length;
  if (total === 0) return 0;
  const checked = [...packing, ...shipping].filter(c => c.checked).length;
  return Math.round((checked / total) * 100);
}

export default ShippingCard;
