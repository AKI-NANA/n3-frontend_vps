// app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx
/**
 * OrdersToolPanel - 受注ツールパネル (Container)
 */

'use client';

import React, { memo } from 'react';
import {
  RefreshCw,
  Download,
  Truck,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { N3Button, N3StatsBar } from '@/components/n3';
import type { OrderStats } from '../../types/operations';

export interface OrdersToolPanelProps {
  stats: OrderStats;
  loading?: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onProcessSelected: () => void;
  onMarkShipped: () => void;
  onExportCSV: () => void;
}

export const OrdersToolPanel = memo(function OrdersToolPanel({
  stats,
  loading = false,
  selectedCount,
  onRefresh,
  onProcessSelected,
  onMarkShipped,
  onExportCSV,
}: OrdersToolPanelProps) {
  return (
    <div style={{ padding: '12px' }}>
      {/* 統計バー */}
      <N3StatsBar
        stats={[
          { label: '総件数', value: stats.total, color: 'default' },
          { label: '新規', value: stats.new, color: 'default' },
          { label: '支払済', value: stats.paid, color: 'blue' },
          { label: '処理中', value: stats.processing, color: 'yellow' },
          { label: '出荷済', value: stats.shipped, color: 'green' },
          { label: '本日期限', value: stats.todayDeadline, color: 'yellow' },
          { label: '未仕入', value: stats.unpurchased, color: 'red' },
        ]}
        size="compact"
        gap={8}
      />

      {/* アクションボタン */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
        <N3Button variant="secondary" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          更新
        </N3Button>

        <div style={{ width: '1px', height: '20px', background: 'var(--panel-border)' }} />

        <N3Button
          variant="primary"
          size="sm"
          onClick={onProcessSelected}
          disabled={selectedCount === 0}
        >
          <ShoppingCart size={14} />
          仕入処理 {selectedCount > 0 && `(${selectedCount})`}
        </N3Button>

        <N3Button
          variant="success"
          size="sm"
          onClick={onMarkShipped}
          disabled={selectedCount === 0}
        >
          <Truck size={14} />
          出荷完了 {selectedCount > 0 && `(${selectedCount})`}
        </N3Button>

        <div style={{ marginLeft: 'auto' }} />

        <N3Button variant="secondary" size="sm" onClick={onExportCSV}>
          <Download size={14} />
          CSV出力
        </N3Button>
      </div>

      {/* アラート */}
      {(stats.todayDeadline > 0 || stats.unpurchased > 0) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '12px',
            padding: '8px 12px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />
          {stats.todayDeadline > 0 && (
            <span style={{ color: 'var(--color-warning)' }}>
              本日期限: {stats.todayDeadline}件
            </span>
          )}
          {stats.unpurchased > 0 && (
            <span style={{ color: 'var(--color-error)' }}>
              未仕入れ: {stats.unpurchased}件
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default OrdersToolPanel;
