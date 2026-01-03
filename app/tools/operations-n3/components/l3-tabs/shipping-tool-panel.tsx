// app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx
/**
 * ShippingToolPanel - 出荷ツールパネル (Container)
 */

'use client';

import React, { memo } from 'react';
import {
  RefreshCw,
  Printer,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { N3Button, N3StatsBar } from '@/components/n3';
import type { ShippingStats } from '../../types/operations';

export interface ShippingToolPanelProps {
  stats: ShippingStats;
  loading?: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onPrintLabels: () => void;
  onBulkShip: () => void;
  onOpenExternalService: (service: 'eloi' | 'cpas' | 'japanpost') => void;
}

export const ShippingToolPanel = memo(function ShippingToolPanel({
  stats,
  loading = false,
  selectedCount,
  onRefresh,
  onPrintLabels,
  onBulkShip,
  onOpenExternalService,
}: ShippingToolPanelProps) {
  return (
    <div style={{ padding: '12px' }}>
      {/* 統計バー */}
      <N3StatsBar
        stats={[
          { label: '総件数', value: stats.total, color: 'default' },
          { label: '出荷待ち', value: stats.pending, color: 'default' },
          { label: 'ピッキング', value: stats.picking, color: 'yellow' },
          { label: '梱包完了', value: stats.packed, color: 'blue' },
          { label: '出荷済', value: stats.shipped, color: 'green' },
          { label: '緊急', value: stats.urgent, color: 'red' },
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
          variant="secondary"
          size="sm"
          onClick={onPrintLabels}
          disabled={selectedCount === 0}
        >
          <Printer size={14} />
          ラベル印刷 {selectedCount > 0 && `(${selectedCount})`}
        </N3Button>

        <N3Button
          variant="success"
          size="sm"
          onClick={onBulkShip}
          disabled={selectedCount === 0}
        >
          <Truck size={14} />
          一括出荷 {selectedCount > 0 && `(${selectedCount})`}
        </N3Button>

        <div style={{ width: '1px', height: '20px', background: 'var(--panel-border)' }} />

        {/* 外部サービス */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '4px' }}>
            伝票発行:
          </span>
          <button
            onClick={() => onOpenExternalService('eloi')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 500,
              background: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            eLoi
          </button>
          <button
            onClick={() => onOpenExternalService('cpas')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 500,
              background: '#ff6b00',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cpas
          </button>
          <button
            onClick={() => onOpenExternalService('japanpost')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 500,
              background: '#cc0000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            日本郵便
          </button>
        </div>
      </div>

      {/* 緊急アラート */}
      {stats.urgent > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '12px',
            padding: '8px 12px',
            background: 'rgba(220, 38, 38, 0.1)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <AlertTriangle size={16} style={{ color: 'var(--color-error)' }} />
          <span style={{ color: 'var(--color-error)', fontWeight: 500 }}>
            緊急対応が必要な出荷が {stats.urgent}件 あります
          </span>
        </div>
      )}
    </div>
  );
});

export default ShippingToolPanel;
