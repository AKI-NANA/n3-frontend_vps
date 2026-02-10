// app/tools/operations-n3/components/linked/customer-info-panel.tsx
/**
 * CustomerInfoPanel - 顧客情報パネル (Container)
 * 顧客の詳細情報、購入履歴、問い合わせ履歴
 */

'use client';

import React, { memo } from 'react';
import {
  User,
  Mail,
  MapPin,
  ShoppingCart,
  MessageSquare,
  Star,
  AlertTriangle,
  Clock,
  DollarSign,
  ExternalLink,
} from 'lucide-react';
import { N3Badge, N3DetailRow, N3Button } from '@/components/n3';
import { MarketplaceBadge } from '../cards';
import type { LinkedCustomerData, CustomerOrderHistory } from '../../types/operations';

export interface CustomerInfoPanelProps {
  customer: LinkedCustomerData | null;
  orderHistory?: CustomerOrderHistory[];
  isLoading?: boolean;
  onViewOrders?: () => void;
  onViewInquiries?: () => void;
  onSendMessage?: () => void;
}

// 顧客ステータス設定
const CUSTOMER_STATUS_CONFIG = {
  vip: { label: 'VIP', color: 'var(--color-warning)', icon: Star },
  regular: { label: '通常', color: 'var(--text-muted)', icon: User },
  new: { label: '新規', color: 'var(--color-primary)', icon: User },
  problem: { label: '注意', color: 'var(--color-error)', icon: AlertTriangle },
};

export const CustomerInfoPanel = memo(function CustomerInfoPanel({
  customer,
  orderHistory = [],
  isLoading = false,
  onViewOrders,
  onViewInquiries,
  onSendMessage,
}: CustomerInfoPanelProps) {
  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        読み込み中...
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        顧客情報がありません
      </div>
    );
  }

  const statusConfig = CUSTOMER_STATUS_CONFIG[customer.status || 'regular'];
  const StatusIcon = statusConfig.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 顧客プロファイル */}
      <div
        style={{
          padding: '16px',
          background: 'var(--highlight)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--panel)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={28} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>{customer.name}</span>
            <N3Badge
              variant={customer.status === 'vip' ? 'warning' : customer.status === 'problem' ? 'error' : 'secondary'}
            >
              <StatusIcon size={10} />
              {statusConfig.label}
            </N3Badge>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {customer.customerId}
          </div>
          {customer.marketplace && (
            <div style={{ marginTop: '6px' }}>
              <MarketplaceBadge marketplace={customer.marketplace} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* 連絡先情報 */}
      <div>
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Mail size={14} />
          連絡先
        </h4>
        <div style={{ display: 'grid', gap: '4px' }}>
          {customer.email && (
            <N3DetailRow label="メール" value={customer.email} copyable />
          )}
          {customer.phone && (
            <N3DetailRow label="電話" value={customer.phone} copyable />
          )}
        </div>
      </div>

      {/* 住所情報 */}
      {customer.address && (
        <div>
          <h4
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MapPin size={14} />
            配送先住所
          </h4>
          <div
            style={{
              padding: '12px',
              background: 'var(--highlight)',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {customer.address}
            {customer.country && (
              <div style={{ marginTop: '8px' }}>
                <N3Badge variant="secondary">{customer.country}</N3Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 購入統計 */}
      <div>
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ShoppingCart size={14} />
          購入統計
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}
        >
          <div
            style={{
              padding: '10px',
              background: 'var(--highlight)',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>総購入回数</div>
            <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'monospace' }}>
              {customer.totalOrders || 0}
            </div>
          </div>
          <div
            style={{
              padding: '10px',
              background: 'var(--highlight)',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>総購入金額</div>
            <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'monospace' }}>
              ${customer.totalSpent?.toLocaleString() || 0}
            </div>
          </div>
          <div
            style={{
              padding: '10px',
              background: 'var(--highlight)',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>問い合わせ数</div>
            <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'monospace' }}>
              {customer.totalInquiries || 0}
            </div>
          </div>
          <div
            style={{
              padding: '10px',
              background: 'var(--highlight)',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>平均購入額</div>
            <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'monospace' }}>
              ${customer.averageOrderValue?.toLocaleString() || 0}
            </div>
          </div>
        </div>
        {customer.firstOrderDate && (
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            初回購入: {new Date(customer.firstOrderDate).toLocaleDateString('ja-JP')}
            {customer.lastOrderDate && (
              <span style={{ marginLeft: '12px' }}>
                最終購入: {new Date(customer.lastOrderDate).toLocaleDateString('ja-JP')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 購入履歴 */}
      {orderHistory.length > 0 && (
        <div>
          <h4
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Clock size={14} />
            最近の購入
          </h4>
          <div
            style={{
              background: 'var(--highlight)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {orderHistory.slice(0, 5).map((order, index) => (
              <div
                key={order.orderId}
                style={{
                  padding: '10px 12px',
                  borderBottom: index < orderHistory.length - 1 ? '1px solid var(--panel-border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'monospace' }}>
                    {order.orderId}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(order.orderDate).toLocaleDateString('ja-JP')}
                    {order.itemCount && (
                      <span style={{ marginLeft: '8px' }}>{order.itemCount}点</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>
                    ${order.totalAmount.toLocaleString()}
                  </div>
                  <N3Badge
                    variant={
                      order.status === 'completed' || order.status === 'delivered'
                        ? 'success'
                        : order.status === 'cancelled'
                        ? 'error'
                        : 'secondary'
                    }
                  >
                    {order.status}
                  </N3Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ノート・メモ */}
      {customer.notes && (
        <div>
          <h4
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '8px',
            }}
          >
            メモ
          </h4>
          <div
            style={{
              padding: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: 1.5,
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            {customer.notes}
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <N3Button variant="secondary" size="sm" onClick={onViewOrders} style={{ flex: 1 }}>
          <ShoppingCart size={14} />
          注文履歴
        </N3Button>
        <N3Button variant="secondary" size="sm" onClick={onViewInquiries} style={{ flex: 1 }}>
          <MessageSquare size={14} />
          問い合わせ
        </N3Button>
        <N3Button variant="primary" size="sm" onClick={onSendMessage}>
          <Mail size={14} />
        </N3Button>
      </div>
    </div>
  );
});

export default CustomerInfoPanel;
