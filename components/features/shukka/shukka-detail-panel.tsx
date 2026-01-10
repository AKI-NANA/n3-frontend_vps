'use client';

import React, { memo } from 'react';
import { Info, RefreshCw, Mail, Check } from 'lucide-react';
import {
  N3PanelHeader,
  N3DetailRow,
  N3TimelineEvent,
  N3Button,
} from '@/components/n3';
import type { N3TimelineEventStatus } from '@/components/n3/presentational/n3-timeline-event';

// ============================================================
// ShukkaDetailPanel - Container Component
// ============================================================
// 出荷詳細・追跡パネル
// N3PanelHeader + N3DetailRow + N3TimelineEventを組み合わせ
// ============================================================

export interface ShukkaDetailInfo {
  shippingId: string;
  orderId: string;
  productName: string;
  destination: string;
  shippingMethod: string;
  deadline: string;
  dimensions?: string;
  weight?: string;
  shippingCost?: number;
}

export interface TrackingEvent {
  id: string;
  status: string;
  date: string;
  location: string;
  eventStatus: N3TimelineEventStatus;
}

export interface ShukkaDetailPanelProps {
  detail: ShukkaDetailInfo | null;
  trackingEvents: TrackingEvent[];
  onUpdateTracking?: () => void;
  onNotifyCustomer?: () => void;
  onCompleteShipping?: () => void;
  className?: string;
}

export const ShukkaDetailPanel = memo(function ShukkaDetailPanel({
  detail,
  trackingEvents,
  onUpdateTracking,
  onNotifyCustomer,
  onCompleteShipping,
  className = '',
}: ShukkaDetailPanelProps) {
  if (!detail) {
    return (
      <div className={`shukka-detail-panel ${className}`}>
        <N3PanelHeader
          title="出荷詳細・追跡"
          icon={Info}
          variant="purple"
        />
        <div className="shukka-detail-panel__empty">
          アイテムを選択してください
        </div>
      </div>
    );
  }

  return (
    <div className={`shukka-detail-panel ${className}`}>
      <N3PanelHeader
        title="出荷詳細・追跡"
        icon={Info}
        variant="purple"
      />

      <div className="shukka-detail-panel__content">
        {/* 出荷情報セクション */}
        <div className="shukka-detail-panel__section">
          <h4 className="shukka-detail-panel__section-title">出荷情報</h4>
          <N3DetailRow label="出荷番号" value={detail.shippingId} copyable />
          <N3DetailRow label="注文番号" value={detail.orderId} copyable />
          <N3DetailRow label="商品名" value={detail.productName} />
          <N3DetailRow label="配送先" value={detail.destination} />
          <N3DetailRow label="配送方法" value={detail.shippingMethod} />
          <N3DetailRow label="出荷期限" value={detail.deadline} />
        </div>

        {/* 梱包詳細セクション */}
        {(detail.dimensions || detail.weight || detail.shippingCost) && (
          <div className="shukka-detail-panel__section">
            <h4 className="shukka-detail-panel__section-title">梱包詳細</h4>
            {detail.dimensions && (
              <N3DetailRow label="寸法" value={detail.dimensions} />
            )}
            {detail.weight && (
              <N3DetailRow label="重量" value={detail.weight} />
            )}
            {detail.shippingCost && (
              <N3DetailRow
                label="配送料"
                value={`¥${detail.shippingCost.toLocaleString()}`}
              />
            )}
          </div>
        )}

        {/* 追跡情報セクション */}
        {trackingEvents.length > 0 && (
          <div className="shukka-detail-panel__section">
            <h4 className="shukka-detail-panel__section-title">追跡情報</h4>
            <div className="shukka-detail-panel__timeline">
              {trackingEvents.map((event, index) => (
                <N3TimelineEvent
                  key={event.id}
                  status={event.status}
                  date={event.date}
                  location={event.location}
                  eventStatus={event.eventStatus}
                  isLast={index === trackingEvents.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="shukka-detail-panel__actions">
        <N3Button variant="primary" onClick={onUpdateTracking}>
          <RefreshCw size={14} />
          追跡更新
        </N3Button>
        <N3Button variant="secondary" onClick={onNotifyCustomer}>
          <Mail size={14} />
          顧客通知
        </N3Button>
        <N3Button variant="success" onClick={onCompleteShipping}>
          <Check size={14} />
          出荷完了
        </N3Button>
      </div>
    </div>
  );
});

ShukkaDetailPanel.displayName = 'ShukkaDetailPanel';

export default ShukkaDetailPanel;
