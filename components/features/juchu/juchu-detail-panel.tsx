'use client';

import React, { memo } from 'react';
import { Info, Play, Truck, Printer, MessageSquare, ExternalLink } from 'lucide-react';
import {
  N3PanelHeader,
  N3DetailRow,
  N3Button,
  N3Badge,
} from '@/components/n3';

// ============================================================
// JuchuDetailPanel - Container Component
// ============================================================
// 受注詳細・アクションパネル
// N3PanelHeader + N3DetailRow + N3Buttonを組み合わせ
// ============================================================

export interface JuchuDetailInfo {
  orderId: string;
  orderDate: string;
  channel: string;
  deadline: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  fees: number;
  shippingCost: number;
  profit: number;
  profitRate: number;
  country: string;
  shippingMethod: string;
  trackingNumber: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingStatus: 'new' | 'processing' | 'shipped' | 'delivered';
}

export interface JuchuDetailPanelProps {
  detail: JuchuDetailInfo | null;
  onProcessOrder?: () => void;
  onMarkShipped?: () => void;
  onPrintLabel?: () => void;
  onOpenInquiry?: () => void;
  onViewListing?: () => void;
  className?: string;
}

const paymentStatusMap = {
  pending: { label: '支払い待ち', variant: 'warning' as const },
  completed: { label: '支払い完了', variant: 'success' as const },
  failed: { label: '支払い失敗', variant: 'error' as const },
};

const shippingStatusMap = {
  new: { label: '未処理', variant: 'warning' as const },
  processing: { label: '処理中', variant: 'info' as const },
  shipped: { label: '出荷済み', variant: 'success' as const },
  delivered: { label: '配送完了', variant: 'purple' as const },
};

export const JuchuDetailPanel = memo(function JuchuDetailPanel({
  detail,
  onProcessOrder,
  onMarkShipped,
  onPrintLabel,
  onOpenInquiry,
  onViewListing,
  className = '',
}: JuchuDetailPanelProps) {
  if (!detail) {
    return (
      <div className={`juchu-detail-panel ${className}`}>
        <N3PanelHeader
          title="注文詳細"
          icon={Info}
          variant="primary"
        />
        <div className="juchu-detail-panel__empty">
          注文を選択してください
        </div>
      </div>
    );
  }

  const paymentInfo = paymentStatusMap[detail.paymentStatus];
  const shippingInfo = shippingStatusMap[detail.shippingStatus];

  return (
    <div className={`juchu-detail-panel ${className}`}>
      <N3PanelHeader
        title="注文詳細"
        icon={Info}
        variant="primary"
      />

      <div className="juchu-detail-panel__content">
        {/* 基本情報 */}
        <div className="juchu-detail-panel__section">
          <h4 className="juchu-detail-panel__section-title">基本情報</h4>
          <N3DetailRow label="注文番号" value={detail.orderId} copyable />
          <N3DetailRow label="注文日時" value={detail.orderDate} />
          <N3DetailRow label="販売チャネル" value={detail.channel} />
          <N3DetailRow label="出荷期限" value={detail.deadline} />
          <N3DetailRow
            label="支払い状況"
            value={<N3Badge variant={paymentInfo.variant}>{paymentInfo.label}</N3Badge>}
          />
          <N3DetailRow
            label="出荷状況"
            value={<N3Badge variant={shippingInfo.variant}>{shippingInfo.label}</N3Badge>}
          />
        </div>

        {/* 商品情報 */}
        <div className="juchu-detail-panel__section">
          <h4 className="juchu-detail-panel__section-title">商品情報</h4>
          <N3DetailRow label="商品名" value={detail.productName} />
          <N3DetailRow label="SKU" value={detail.sku} copyable />
          <N3DetailRow label="数量" value={`${detail.quantity}個`} />
        </div>

        {/* 金額・利益 */}
        <div className="juchu-detail-panel__section">
          <h4 className="juchu-detail-panel__section-title">金額・利益</h4>
          <N3DetailRow label="販売価格" value={`¥${detail.price.toLocaleString()}`} />
          <N3DetailRow label="手数料" value={`¥${detail.fees.toLocaleString()}`} />
          <N3DetailRow label="配送料" value={`¥${detail.shippingCost.toLocaleString()}`} />
          <N3DetailRow
            label="予想利益"
            value={`¥${detail.profit.toLocaleString()} (${detail.profitRate}%)`}
            valueClassName="juchu-detail-panel__profit"
          />
        </div>

        {/* 配送情報 */}
        <div className="juchu-detail-panel__section">
          <h4 className="juchu-detail-panel__section-title">配送情報</h4>
          <N3DetailRow label="配送先国" value={detail.country} />
          <N3DetailRow label="配送方法" value={detail.shippingMethod || '-'} />
          <N3DetailRow
            label="追跡番号"
            value={detail.trackingNumber || '-'}
            copyable={!!detail.trackingNumber}
          />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="juchu-detail-panel__actions">
        <N3Button variant="primary" onClick={onProcessOrder}>
          <Play size={14} />
          注文処理開始
        </N3Button>
        <N3Button variant="success" onClick={onMarkShipped}>
          <Truck size={14} />
          出荷完了マーク
        </N3Button>
        <N3Button variant="secondary" onClick={onPrintLabel}>
          <Printer size={14} />
          配送ラベル印刷
        </N3Button>
        <N3Button variant="secondary" onClick={onOpenInquiry}>
          <MessageSquare size={14} />
          問い合わせ確認
        </N3Button>
        <N3Button variant="secondary" onClick={onViewListing}>
          <ExternalLink size={14} />
          eBay商品ページ
        </N3Button>
      </div>
    </div>
  );
});

JuchuDetailPanel.displayName = 'JuchuDetailPanel';

export default JuchuDetailPanel;
