// app/tools/operations-n3/components/linked/inventory-status-panel.tsx
/**
 * InventoryStatusPanel - 在庫状況パネル (Container)
 * 在庫の詳細情報、変動履歴、発注推奨など
 */

'use client';

import React, { memo } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  ArrowRight,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { N3Badge, N3DetailRow, N3Button, N3ProgressBar } from '@/components/n3';
import type { LinkedInventoryData, StockMovement } from '../../types/operations';

export interface InventoryStatusPanelProps {
  inventory: LinkedInventoryData | null;
  movements?: StockMovement[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onOrderStock?: () => void;
}

const MOVEMENT_TYPE_CONFIG = {
  sale: { label: '販売', icon: TrendingDown, color: 'var(--color-error)' },
  purchase: { label: '入荷', icon: TrendingUp, color: 'var(--color-success)' },
  adjustment: { label: '調整', icon: RefreshCw, color: 'var(--color-warning)' },
  return: { label: '返品', icon: Package, color: 'var(--color-primary)' },
};

export const InventoryStatusPanel = memo(function InventoryStatusPanel({
  inventory,
  movements = [],
  isLoading = false,
  onRefresh,
  onOrderStock,
}: InventoryStatusPanelProps) {
  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        読み込み中...
      </div>
    );
  }

  if (!inventory) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        在庫情報がありません
      </div>
    );
  }

  const stockLevel = inventory.reorderPoint
    ? (inventory.currentStock / inventory.reorderPoint) * 100
    : 100;
  const isLowStock = inventory.currentStock <= (inventory.reorderPoint || 0);
  const isOutOfStock = inventory.currentStock === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 在庫サマリー */}
      <div
        style={{
          padding: '16px',
          background: isOutOfStock
            ? 'rgba(239, 68, 68, 0.1)'
            : isLowStock
            ? 'rgba(245, 158, 11, 0.1)'
            : 'var(--highlight)',
          borderRadius: '12px',
          border: `1px solid ${
            isOutOfStock
              ? 'rgba(239, 68, 68, 0.3)'
              : isLowStock
              ? 'rgba(245, 158, 11, 0.3)'
              : 'var(--panel-border)'
          }`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>現在庫数</span>
          {isLowStock && (
            <N3Badge variant={isOutOfStock ? 'error' : 'warning'}>
              <AlertTriangle size={10} />
              {isOutOfStock ? '在庫切れ' : '在庫少'}
            </N3Badge>
          )}
        </div>
        <div
          style={{
            fontSize: '32px',
            fontWeight: 700,
            fontFamily: 'monospace',
            color: isOutOfStock ? 'var(--color-error)' : isLowStock ? 'var(--color-warning)' : 'var(--text)',
            marginBottom: '8px',
          }}
        >
          {inventory.currentStock}
          <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>
            個
          </span>
        </div>
        {inventory.reorderPoint !== undefined && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>発注点: {inventory.reorderPoint}</span>
              <span style={{ color: 'var(--text-muted)' }}>{Math.round(stockLevel)}%</span>
            </div>
            <N3ProgressBar
              value={Math.min(stockLevel, 100)}
              variant={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* 在庫詳細 */}
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
          <Layers size={14} />
          在庫詳細
        </h4>
        <div style={{ display: 'grid', gap: '4px' }}>
          <N3DetailRow label="物理在庫" value={inventory.physicalStock?.toString() || '-'} />
          <N3DetailRow label="予約済み" value={inventory.reservedStock?.toString() || '0'} />
          <N3DetailRow label="利用可能" value={inventory.availableStock?.toString() || inventory.currentStock.toString()} />
          <N3DetailRow label="入荷予定" value={inventory.incomingStock?.toString() || '0'} />
          {inventory.location && (
            <N3DetailRow label="保管場所" value={inventory.location} />
          )}
        </div>
      </div>

      {/* 販売実績 */}
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
          <TrendingUp size={14} />
          販売実績
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
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
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>今日</div>
            <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>
              {inventory.salesToday || 0}
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
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>週間</div>
            <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>
              {inventory.salesWeek || 0}
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
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>月間</div>
            <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>
              {inventory.salesMonth || 0}
            </div>
          </div>
        </div>
        {inventory.averageDailySales !== undefined && (
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            平均日販: {inventory.averageDailySales.toFixed(1)} 個/日
            {inventory.currentStock > 0 && inventory.averageDailySales > 0 && (
              <span style={{ marginLeft: '8px' }}>
                (残り約 {Math.floor(inventory.currentStock / inventory.averageDailySales)} 日分)
              </span>
            )}
          </div>
        )}
      </div>

      {/* 在庫変動履歴 */}
      {movements.length > 0 && (
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
            変動履歴
          </h4>
          <div
            style={{
              background: 'var(--highlight)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {movements.slice(0, 5).map((movement, index) => {
              const config = MOVEMENT_TYPE_CONFIG[movement.type];
              const Icon = config.icon;
              return (
                <div
                  key={movement.id}
                  style={{
                    padding: '10px 12px',
                    borderBottom: index < movements.length - 1 ? '1px solid var(--panel-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: `${config.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={12} style={{ color: config.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>
                      {config.label}
                      {movement.source && (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '6px' }}>
                          ({movement.source})
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {new Date(movement.createdAt).toLocaleString('ja-JP')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{movement.quantityBefore}</span>
                    <ArrowRight size={10} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontWeight: 600 }}>{movement.quantityAfter}</span>
                    <span
                      style={{
                        marginLeft: '6px',
                        fontWeight: 600,
                        color: movement.quantityChange > 0 ? 'var(--color-success)' : 'var(--color-error)',
                      }}
                    >
                      {movement.quantityChange > 0 ? '+' : ''}{movement.quantityChange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <N3Button variant="secondary" size="sm" onClick={onRefresh} style={{ flex: 1 }}>
          <RefreshCw size={14} />
          更新
        </N3Button>
        {isLowStock && (
          <N3Button variant="warning" size="sm" onClick={onOrderStock} style={{ flex: 1 }}>
            <Package size={14} />
            発注
          </N3Button>
        )}
      </div>
    </div>
  );
});

export default InventoryStatusPanel;
