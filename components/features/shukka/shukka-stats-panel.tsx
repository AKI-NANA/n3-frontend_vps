'use client';

import React, { memo } from 'react';
import { Package, Truck, Clock, AlertTriangle } from 'lucide-react';
import { N3StatCard } from '@/components/n3';

// ============================================================
// ShukkaStatsPanel - Container Component
// ============================================================
// 出荷管理の統計パネル
// N3StatCardを組み合わせて出荷統計を表示
// ============================================================

export interface ShukkaStats {
  pending: number;
  ready: number;
  shippedToday: number;
  urgent: number;
}

export interface ShukkaStatsPanelProps {
  stats: ShukkaStats;
  onStatClick?: (type: keyof ShukkaStats) => void;
  className?: string;
}

export const ShukkaStatsPanel = memo(function ShukkaStatsPanel({
  stats,
  onStatClick,
  className = '',
}: ShukkaStatsPanelProps) {
  return (
    <div className={`shukka-stats-panel ${className}`}>
      <div className="shukka-stats-panel__grid">
        <N3StatCard
          value={stats.pending}
          label="出荷待ち"
          variant="warning"
          icon={Clock}
          compact
          onClick={onStatClick ? () => onStatClick('pending') : undefined}
        />
        <N3StatCard
          value={stats.ready}
          label="準備完了"
          variant="success"
          icon={Package}
          compact
          onClick={onStatClick ? () => onStatClick('ready') : undefined}
        />
        <N3StatCard
          value={stats.shippedToday}
          label="本日出荷"
          variant="info"
          icon={Truck}
          compact
          onClick={onStatClick ? () => onStatClick('shippedToday') : undefined}
        />
        <N3StatCard
          value={stats.urgent}
          label="緊急対応"
          variant="error"
          icon={AlertTriangle}
          compact
          onClick={onStatClick ? () => onStatClick('urgent') : undefined}
        />
      </div>
    </div>
  );
});

ShukkaStatsPanel.displayName = 'ShukkaStatsPanel';

export default ShukkaStatsPanel;
