// app/tools/operations-n3/components/linked/history-panel.tsx
/**
 * HistoryPanel - 履歴パネル (Container)
 * 受注・出荷・問い合わせの履歴を時系列で表示
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import {
  Clock,
  ShoppingCart,
  Truck,
  MessageSquare,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import { N3Badge, N3Button, N3Tabs } from '@/components/n3';
import type { HistoryItem, HistoryType } from '../../types/operations';

export interface HistoryPanelProps {
  items: HistoryItem[];
  isLoading?: boolean;
  onItemClick?: (item: HistoryItem) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// 履歴タイプ設定
const HISTORY_TYPE_CONFIG: Record<HistoryType, {
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
}> = {
  order: { label: '受注', icon: ShoppingCart, color: 'var(--color-primary)' },
  shipping: { label: '出荷', icon: Truck, color: 'var(--color-success)' },
  inquiry: { label: '問合せ', icon: MessageSquare, color: 'var(--color-warning)' },
  status_change: { label: 'ステータス', icon: CheckCircle, color: 'var(--text-muted)' },
  note: { label: 'メモ', icon: Package, color: 'var(--text-muted)' },
};

// ステータスアイコン
const STATUS_ICON_CONFIG = {
  success: { icon: CheckCircle, color: 'var(--color-success)' },
  error: { icon: XCircle, color: 'var(--color-error)' },
  warning: { icon: AlertTriangle, color: 'var(--color-warning)' },
  info: { icon: Clock, color: 'var(--color-primary)' },
};

export const HistoryPanel = memo(function HistoryPanel({
  items,
  isLoading = false,
  onItemClick,
  onLoadMore,
  hasMore = false,
}: HistoryPanelProps) {
  const [filter, setFilter] = useState<HistoryType | 'all'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.type === filter);

  // 日付でグループ化
  const groupedItems = filteredItems.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString('ja-JP');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  if (isLoading && items.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        読み込み中...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        履歴がありません
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* フィルター */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          padding: '8px 0',
          borderBottom: '1px solid var(--panel-border)',
        }}
      >
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            border: 'none',
            background: filter === 'all' ? 'var(--color-primary)' : 'var(--highlight)',
            color: filter === 'all' ? 'white' : 'var(--text-muted)',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          すべて
        </button>
        {(Object.keys(HISTORY_TYPE_CONFIG) as HistoryType[]).map((type) => {
          const config = HISTORY_TYPE_CONFIG[type];
          const count = items.filter(i => i.type === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                border: 'none',
                background: filter === type ? config.color : 'var(--highlight)',
                color: filter === type ? 'white' : 'var(--text-muted)',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {config.label}
              <span style={{ opacity: 0.7 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* タイムライン */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(groupedItems).map(([date, dateItems]) => (
          <div key={date}>
            {/* 日付ヘッダー */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Clock size={12} />
              {date}
            </div>

            {/* その日のアイテム */}
            <div
              style={{
                position: 'relative',
                paddingLeft: '20px',
              }}
            >
              {/* タイムラインの縦線 */}
              <div
                style={{
                  position: 'absolute',
                  left: '6px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  background: 'var(--panel-border)',
                }}
              />

              {dateItems.map((item, index) => {
                const typeConfig = HISTORY_TYPE_CONFIG[item.type];
                const TypeIcon = typeConfig.icon;
                const statusConfig = item.statusIcon
                  ? STATUS_ICON_CONFIG[item.statusIcon]
                  : null;
                const isExpanded = expandedItems.has(item.id);

                return (
                  <div
                    key={item.id}
                    style={{
                      position: 'relative',
                      marginBottom: index < dateItems.length - 1 ? '12px' : 0,
                    }}
                  >
                    {/* タイムラインのドット */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-14px',
                        top: '10px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: typeConfig.color,
                        border: '2px solid var(--panel)',
                      }}
                    />

                    {/* アイテムカード */}
                    <div
                      style={{
                        background: 'var(--highlight)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        cursor: item.details ? 'pointer' : 'default',
                      }}
                      onClick={() => {
                        if (item.details) toggleExpand(item.id);
                        onItemClick?.(item);
                      }}
                    >
                      {/* ヘッダー */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: `${typeConfig.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <TypeIcon size={12} style={{ color: typeConfig.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 500 }}>
                              {item.title}
                            </span>
                            {statusConfig && (
                              <statusConfig.icon size={12} style={{ color: statusConfig.color }} />
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {item.description}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {new Date(item.timestamp).toLocaleTimeString('ja-JP', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {item.actor && (
                              <span style={{ marginLeft: '8px' }}>by {item.actor}</span>
                            )}
                          </div>
                        </div>
                        {item.details && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(item.id);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: '2px',
                              cursor: 'pointer',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                      </div>

                      {/* 詳細 (展開時) */}
                      {isExpanded && item.details && (
                        <div
                          style={{
                            marginTop: '10px',
                            paddingTop: '10px',
                            borderTop: '1px solid var(--panel-border)',
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            lineHeight: 1.5,
                          }}
                        >
                          {typeof item.details === 'string' ? (
                            item.details
                          ) : (
                            <div style={{ display: 'grid', gap: '4px' }}>
                              {Object.entries(item.details).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{key}</span>
                                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                                    {String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 関連ID */}
                      {item.relatedId && (
                        <div style={{ marginTop: '8px' }}>
                          <N3Badge variant="secondary" style={{ fontSize: '9px' }}>
                            {item.relatedId}
                          </N3Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* さらに読み込む */}
      {hasMore && (
        <N3Button
          variant="secondary"
          size="sm"
          onClick={onLoadMore}
          disabled={isLoading}
          style={{ alignSelf: 'center' }}
        >
          {isLoading ? '読み込み中...' : 'さらに表示'}
        </N3Button>
      )}
    </div>
  );
});

export default HistoryPanel;
