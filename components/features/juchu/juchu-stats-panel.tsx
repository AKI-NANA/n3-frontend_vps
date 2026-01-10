'use client';

import React, { memo } from 'react';
import { ShoppingCart, Clock, Truck, DollarSign } from 'lucide-react';
import { N3StatCard, N3Button } from '@/components/n3';

// ============================================================
// JuchuStatsPanel - Container Component
// ============================================================
// 受注管理の統計・クイックアクションパネル
// N3StatCardを組み合わせて受注統計を表示
// ============================================================

export interface JuchuStats {
  newOrders: number;
  processing: number;
  shipped: number;
  totalRevenue: string;
}

export interface JuchuStatsPanelProps {
  stats: JuchuStats;
  onShowUrgent?: () => void;
  onShowUnpaid?: () => void;
  onShowShippingToday?: () => void;
  onExport?: () => void;
  className?: string;
}

export const JuchuStatsPanel = memo(function JuchuStatsPanel({
  stats,
  onShowUrgent,
  onShowUnpaid,
  onShowShippingToday,
  onExport,
  className = '',
}: JuchuStatsPanelProps) {
  return (
    <div className={`juchu-stats-panel ${className}`}>
      <div className="juchu-stats-panel__header">
        <h3 className="juchu-stats-panel__title">今日の受注状況</h3>
      </div>

      <div className="juchu-stats-panel__grid">
        <N3StatCard
          value={stats.newOrders}
          label="新規注文"
          variant="warning"
          icon={ShoppingCart}
        />
        <N3StatCard
          value={stats.processing}
          label="処理中"
          variant="info"
          icon={Clock}
        />
        <N3StatCard
          value={stats.shipped}
          label="出荷済み"
          variant="success"
          icon={Truck}
        />
        <N3StatCard
          value={stats.totalRevenue}
          label="今日の売上"
          variant="primary"
          icon={DollarSign}
        />
      </div>

      <div className="juchu-stats-panel__actions">
        <N3Button variant="ghost" size="sm" onClick={onShowUrgent} className="juchu-stats-panel__action-btn">
          緊急対応必要
        </N3Button>
        <N3Button variant="ghost" size="sm" onClick={onShowUnpaid} className="juchu-stats-panel__action-btn">
          未入金注文
        </N3Button>
        <N3Button variant="ghost" size="sm" onClick={onShowShippingToday} className="juchu-stats-panel__action-btn">
          今日出荷予定
        </N3Button>
        <N3Button variant="ghost" size="sm" onClick={onExport} className="juchu-stats-panel__action-btn">
          データエクスポート
        </N3Button>
      </div>
    </div>
  );
});

JuchuStatsPanel.displayName = 'JuchuStatsPanel';

export default JuchuStatsPanel;
