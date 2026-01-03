// app/tools/operations-n3/components/cards/order-card.tsx
/**
 * OrderCard - 注文カード (Presentational)
 * React.memo + 外部マージン禁止
 */

'use client';

import React, { memo } from 'react';
import { Package, MessageSquare, ExternalLink } from 'lucide-react';
import { N3Checkbox } from '@/components/n3';
import {
  OrderStatusBadge,
  MarketplaceBadge,
  DeadlineDisplay,
  ProfitDisplay,
} from './operations-badges';
import type { Order } from '../../types/operations';

export interface OrderCardProps {
  order: Order;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (order: Order) => void;
  onOpenLinkedData?: (order: Order) => void;
}

export const OrderCard = memo(function OrderCard({
  order,
  selected = false,
  onSelect,
  onClick,
  onOpenLinkedData,
}: OrderCardProps) {
  const mainItem = order.items[0];
  const itemCount = order.items.length;

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
      onClick={() => onClick?.(order)}
    >
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {onSelect && (
          <N3Checkbox
            checked={selected}
            onChange={() => onSelect(order.id)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <MarketplaceBadge marketplace={order.marketplace} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          {order.orderId}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          <DeadlineDisplay deadline={order.shippingDeadline} />
          <OrderStatusBadge status={order.orderStatus} />
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
          {mainItem?.imageUrl ? (
            <img
              src={mainItem.imageUrl}
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
            {mainItem?.title || '商品情報なし'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {mainItem?.sku && <span>SKU: {mainItem.sku}</span>}
            {itemCount > 1 && <span style={{ marginLeft: '8px' }}>他{itemCount - 1}点</span>}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            顧客: {order.customerName} • {order.destinationCountry}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>売上</div>
            <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>
              {order.currency}{order.totalAmount.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {order.isProfitConfirmed ? '確定利益' : '見込利益'}
            </div>
            <ProfitDisplay
              amount={order.isProfitConfirmed ? (order.confirmedProfit || 0) : order.estimatedProfit}
              isConfirmed={order.isProfitConfirmed}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {order.inquiryCount > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: 'var(--color-warning)',
              }}
            >
              <MessageSquare size={14} />
              {order.inquiryCount}
            </div>
          )}
          {onOpenLinkedData && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenLinkedData(order);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="連動データを表示"
            >
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default OrderCard;
