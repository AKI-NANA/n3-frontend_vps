/**
 * N3CardList - 商品カードリストコンポーネント
 * 
 * 汎用的なカードグリッド表示
 * /approval や /zaiko/tanaoroshi などで使用
 */

'use client';

import React, { ReactNode } from 'react';
import { N3Badge } from '../presentational/n3-badge';

// ============================================================
// Types
// ============================================================

export interface N3CardItem {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  statusLabel?: string;
  badges?: Array<{ label: string; variant?: 'primary' | 'success' | 'warning' | 'danger' | 'muted' }>;
  metrics?: Array<{ label: string; value: string | number; color?: string }>;
  metadata?: Record<string, string | number>;
}

export interface N3CardListProps {
  items: N3CardItem[];
  selectedIds?: Set<string | number>;
  onSelect?: (id: string | number) => void;
  onItemClick?: (item: N3CardItem) => void;
  columns?: 2 | 3 | 4 | 5 | 6 | 'auto';
  cardSize?: 'sm' | 'md' | 'lg';
  selectable?: boolean;
  renderActions?: (item: N3CardItem) => ReactNode;
  emptyMessage?: string;
}

// ============================================================
// Status Config
// ============================================================

const STATUS_CONFIG = {
  pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', border: '#fcd34d', label: '⏳ 保留中' },
  approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: '#86efac', label: '✅ 承認済み' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: '#fca5a5', label: '❌ 否認済み' },
  active: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: '#93c5fd', label: '🟢 有効' },
  inactive: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#d1d5db', label: '⚪ 無効' },
};

// ============================================================
// Component
// ============================================================

export function N3CardList({
  items,
  selectedIds = new Set(),
  onSelect,
  onItemClick,
  columns = 'auto',
  cardSize = 'md',
  selectable = false,
  renderActions,
  emptyMessage = '表示するアイテムがありません',
}: N3CardListProps) {
  // サイズ設定
  const sizeConfig = {
    sm: { minWidth: 180, imageHeight: 120, padding: 12, fontSize: 11 },
    md: { minWidth: 240, imageHeight: 160, padding: 16, fontSize: 13 },
    lg: { minWidth: 300, imageHeight: 200, padding: 20, fontSize: 14 },
  };

  const config = sizeConfig[cardSize];

  // グリッドスタイル
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: 16,
    gridTemplateColumns:
      columns === 'auto'
        ? `repeat(auto-fill, minmax(${config.minWidth}px, 1fr))`
        : `repeat(${columns}, 1fr)`,
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[var(--text-muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {items.map((item) => {
        const isSelected = selectedIds.has(item.id);
        const statusConfig = item.status ? STATUS_CONFIG[item.status] : null;

        return (
          <div
            key={item.id}
            className="relative bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg overflow-hidden transition-all hover:shadow-lg cursor-pointer"
            style={{
              boxShadow: isSelected ? '0 0 0 3px var(--accent)' : undefined,
            }}
            onClick={() => onItemClick?.(item)}
          >
            {/* 選択チェックボックス */}
            {selectable && (
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelect?.(item.id);
                  }}
                  className="w-5 h-5 cursor-pointer accent-[var(--accent)]"
                  style={{ accentColor: 'var(--accent)' }}
                />
              </div>
            )}

            {/* ステータスバッジ */}
            {statusConfig && (
              <div className="absolute top-3 right-3 z-10">
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: statusConfig.bg,
                    color: statusConfig.text,
                    border: `1px solid ${statusConfig.border}`,
                  }}
                >
                  {item.statusLabel || statusConfig.label}
                </span>
              </div>
            )}

            {/* 画像 */}
            {item.image && (
              <div
                className="bg-[var(--highlight)]"
                style={{ height: config.imageHeight }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                  }}
                />
              </div>
            )}

            {/* コンテンツ */}
            <div style={{ padding: config.padding }}>
              {/* タイトル */}
              <h3
                className="font-bold text-[var(--text)] line-clamp-2"
                style={{ fontSize: config.fontSize + 1, minHeight: '2.5em' }}
                title={item.title}
              >
                {item.title}
              </h3>

              {/* サブタイトル */}
              {item.subtitle && (
                <p
                  className="text-[var(--text-muted)] mt-1 line-clamp-1"
                  style={{ fontSize: config.fontSize - 1 }}
                >
                  {item.subtitle}
                </p>
              )}

              {/* バッジ */}
              {item.badges && item.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.badges.map((badge, idx) => (
                    <N3Badge key={idx} variant={badge.variant || 'muted'} size="sm">
                      {badge.label}
                    </N3Badge>
                  ))}
                </div>
              )}

              {/* メトリクス */}
              {item.metrics && item.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {item.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="text-center p-2 bg-[var(--highlight)] rounded"
                    >
                      <div
                        className="font-bold"
                        style={{
                          fontSize: config.fontSize + 2,
                          color: metric.color || 'var(--text)',
                        }}
                      >
                        {metric.value}
                      </div>
                      <div
                        className="text-[var(--text-muted)]"
                        style={{ fontSize: config.fontSize - 2 }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* メタデータ */}
              {item.metadata && Object.keys(item.metadata).length > 0 && (
                <div className="mt-3 space-y-1">
                  {Object.entries(item.metadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-[var(--text-muted)]"
                      style={{ fontSize: config.fontSize - 2 }}
                    >
                      <span>{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* カスタムアクション */}
              {renderActions && (
                <div className="mt-3 pt-3 border-t border-[var(--panel-border)]">
                  {renderActions(item)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default N3CardList;
