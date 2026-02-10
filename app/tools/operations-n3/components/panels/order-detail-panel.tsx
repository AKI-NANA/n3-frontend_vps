// app/tools/operations-n3/components/panels/order-detail-panel.tsx
/**
 * OrderDetailPanel - 受注詳細パネル (Container)
 * 既存のJuchuDetailPanelをN3対応で再構築
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import {
  Package,
  Truck,
  MessageSquare,
  ExternalLink,
  ShoppingCart,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import {
  N3Button,
  N3Input,
  N3DetailRow,
  N3Badge,
  N3PanelHeader,
} from '@/components/n3';
import {
  OrderStatusBadge,
  MarketplaceBadge,
  DeadlineDisplay,
  ProfitDisplay,
} from '../cards';
import type { Order, PurchaseStatus } from '../../types/operations';

export interface OrderDetailPanelProps {
  order: Order | null;
  onUpdateOrder?: (id: string, updates: Partial<Order>) => void;
  onMarkShipped?: (id: string) => void;
  onOpenInquiry?: (order: Order) => void;
  onOpenLinkedData?: (order: Order) => void;
}

export const OrderDetailPanel = memo(function OrderDetailPanel({
  order,
  onUpdateOrder,
  onMarkShipped,
  onOpenInquiry,
  onOpenLinkedData,
}: OrderDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    actualPurchaseUrl: '',
    actualPurchaseCostJpy: 0,
  });

  const handleStartEdit = useCallback(() => {
    if (order) {
      setEditData({
        actualPurchaseUrl: order.actualPurchaseUrl || order.estimatedPurchaseUrl || '',
        actualPurchaseCostJpy: order.actualPurchaseCostJpy || 0,
      });
      setIsEditing(true);
    }
  }, [order]);

  const handleSave = useCallback(() => {
    if (order && onUpdateOrder) {
      onUpdateOrder(order.id, {
        actualPurchaseUrl: editData.actualPurchaseUrl,
        actualPurchaseCostJpy: editData.actualPurchaseCostJpy,
        purchaseStatus: '仕入れ済み',
      });
    }
    setIsEditing(false);
  }, [order, editData, onUpdateOrder]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  if (!order) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        注文を選択してください
      </div>
    );
  }

  const mainItem = order.items[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ヘッダー */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <MarketplaceBadge marketplace={order.marketplace} size="md" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>
            {order.orderId}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {new Date(order.orderDate).toLocaleDateString('ja-JP')}
          </div>
        </div>
        <DeadlineDisplay deadline={order.shippingDeadline} size="md" />
        <OrderStatusBadge status={order.orderStatus} size="md" />
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* 商品情報 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            商品情報
          </h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                background: 'var(--highlight)',
                overflow: 'hidden',
              }}
            >
              {mainItem?.imageUrl ? (
                <img src={mainItem.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Package size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{mainItem?.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                SKU: {mainItem?.sku}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                数量: {mainItem?.quantity}
              </div>
              {order.items.length > 1 && (
                <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px' }}>
                  他 {order.items.length - 1} 点
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 顧客・配送情報 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            顧客・配送情報
          </h4>
          <div style={{ display: 'grid', gap: '4px' }}>
            <N3DetailRow label="顧客名" value={order.customerName} />
            <N3DetailRow label="顧客ID" value={order.customerId} copyable />
            <N3DetailRow label="配送先" value={order.destinationCountry} />
            <N3DetailRow label="配送方法" value={order.shippingMethod || '-'} />
            <N3DetailRow label="追跡番号" value={order.trackingNumber || '-'} copyable={!!order.trackingNumber} />
          </div>
        </div>

        {/* 金額・利益 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            金額・利益
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '12px',
              background: 'var(--highlight)',
              borderRadius: '8px',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>売上</div>
              <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'monospace' }}>
                {order.currency}{order.totalAmount.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {order.isProfitConfirmed ? '確定利益' : '見込利益'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                <ProfitDisplay
                  amount={order.isProfitConfirmed ? (order.confirmedProfit || 0) : order.estimatedProfit}
                  isConfirmed={order.isProfitConfirmed}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 仕入れ情報 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              仕入れ情報
            </h4>
            <N3Badge
              variant={
                order.purchaseStatus === '仕入れ済み' ? 'success' :
                order.purchaseStatus === 'キャンセル' ? 'error' : 'warning'
              }
            >
              {order.purchaseStatus}
            </N3Badge>
          </div>

          {isEditing ? (
            <div style={{ display: 'grid', gap: '8px' }}>
              <N3Input
                label="仕入れ先URL"
                value={editData.actualPurchaseUrl}
                onValueChange={(v) => setEditData(prev => ({ ...prev, actualPurchaseUrl: v }))}
                placeholder="https://..."
              />
              <N3Input
                type="number"
                label="仕入れ原価 (JPY)"
                value={String(editData.actualPurchaseCostJpy)}
                onValueChange={(v) => setEditData(prev => ({ ...prev, actualPurchaseCostJpy: Number(v) }))}
                placeholder="0"
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <N3Button variant="primary" size="sm" onClick={handleSave}>
                  <Save size={14} />
                  保存
                </N3Button>
                <N3Button variant="secondary" size="sm" onClick={handleCancel}>
                  <X size={14} />
                  キャンセル
                </N3Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '4px' }}>
              <N3DetailRow
                label="仕入れ先"
                value={
                  order.actualPurchaseUrl || order.estimatedPurchaseUrl ? (
                    <a
                      href={order.actualPurchaseUrl || order.estimatedPurchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-primary)', fontSize: '12px' }}
                    >
                      リンクを開く <ExternalLink size={10} style={{ marginLeft: '4px' }} />
                    </a>
                  ) : '-'
                }
              />
              <N3DetailRow
                label="仕入れ原価"
                value={order.actualPurchaseCostJpy ? `¥${order.actualPurchaseCostJpy.toLocaleString()}` : '-'}
              />
              {order.purchaseStatus === '未仕入れ' && (
                <N3Button variant="secondary" size="sm" onClick={handleStartEdit} style={{ marginTop: '8px' }}>
                  <Edit2 size={14} />
                  仕入れ情報を入力
                </N3Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--panel-border)',
          display: 'flex',
          gap: '8px',
        }}
      >
        <N3Button
          variant="success"
          size="sm"
          onClick={() => onMarkShipped?.(order.id)}
          disabled={order.orderStatus === 'shipped' || order.orderStatus === 'delivered'}
        >
          <Truck size={14} />
          出荷完了
        </N3Button>
        {order.inquiryCount > 0 && (
          <N3Button variant="secondary" size="sm" onClick={() => onOpenInquiry?.(order)}>
            <MessageSquare size={14} />
            問い合わせ ({order.inquiryCount})
          </N3Button>
        )}
        <N3Button variant="secondary" size="sm" onClick={() => onOpenLinkedData?.(order)}>
          <Package size={14} />
          商品詳細
        </N3Button>
      </div>
    </div>
  );
});

export default OrderDetailPanel;
