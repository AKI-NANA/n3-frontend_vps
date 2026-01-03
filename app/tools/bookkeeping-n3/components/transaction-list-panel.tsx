// app/tools/bookkeeping-n3/components/transaction-list-panel.tsx
/**
 * 左パネル: 未処理取引リスト
 * 
 * - pending 状態の取引を一覧表示
 * - クリックで右パネルにデータを流す
 * - フィルター・検索機能
 */

'use client';

import React, { memo } from 'react';
import { Search, Filter, RefreshCw, Upload, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { N3Input, N3Select, N3Button, N3Badge, N3Skeleton } from '@/components/n3';
import type { RawTransaction, TransactionStatus } from '../types';

// ============================================================
// Props
// ============================================================

interface TransactionListPanelProps {
  transactions: RawTransaction[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  filter: {
    status: TransactionStatus | 'all';
    sourceName: string;
    searchKeyword: string;
  };
  stats: {
    pending: number;
    simulated: number;
    submitted: number;
    ignored: number;
    total: number;
  };
  onSelect: (id: string) => void;
  onFilterChange: (filter: Partial<TransactionListPanelProps['filter']>) => void;
  onRefresh: () => void;
  onSync: () => void;
}

// ============================================================
// Status Config
// ============================================================

const STATUS_CONFIG: Record<TransactionStatus, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: '未処理', icon: Clock, color: 'var(--warning)' },
  simulated: { label: 'ルール適用済', icon: CheckCircle2, color: 'var(--accent)' },
  submitted: { label: '記帳完了', icon: CheckCircle2, color: 'var(--success)' },
  ignored: { label: '除外', icon: XCircle, color: 'var(--text-muted)' },
};

// ============================================================
// Sub Components
// ============================================================

const TransactionRow = memo(function TransactionRow({
  transaction,
  isSelected,
  onClick,
}: {
  transaction: RawTransaction;
  isSelected: boolean;
  onClick: () => void;
}) {
  const config = STATUS_CONFIG[transaction.status];
  const StatusIcon = config.icon;
  const isIncome = transaction.amount > 0;
  
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        background: isSelected ? 'var(--accent-subtle)' : 'transparent',
        borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
        cursor: 'pointer',
        borderBottom: '1px solid var(--panel-border)',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'var(--highlight)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* ステータスアイコン */}
      <div style={{ flexShrink: 0 }}>
        <StatusIcon size={16} style={{ color: config.color }} />
      </div>
      
      {/* メインコンテンツ */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 摘要テキスト */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {transaction.raw_memo}
        </div>
        
        {/* 日付・取引元 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 2,
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          <span>{transaction.transaction_date}</span>
          <span>•</span>
          <span>{transaction.source_name}</span>
        </div>
      </div>
      
      {/* 金額 */}
      <div
        style={{
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          color: isIncome ? 'var(--success)' : 'var(--text)',
        }}
      >
        {isIncome ? '+' : ''}¥{Math.abs(transaction.amount).toLocaleString()}
      </div>
    </div>
  );
});

const StatsBar = memo(function StatsBar({
  stats,
  currentFilter,
  onFilterChange,
}: {
  stats: TransactionListPanelProps['stats'];
  currentFilter: TransactionStatus | 'all';
  onFilterChange: (status: TransactionStatus | 'all') => void;
}) {
  const items: { key: TransactionStatus | 'all'; label: string; count: number; color: string }[] = [
    { key: 'all', label: '全て', count: stats.total, color: 'var(--text)' },
    { key: 'pending', label: '未処理', count: stats.pending, color: 'var(--warning)' },
    { key: 'simulated', label: '適用済', count: stats.simulated, color: 'var(--accent)' },
    { key: 'submitted', label: '完了', count: stats.submitted, color: 'var(--success)' },
  ];
  
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: '8px 12px',
        borderBottom: '1px solid var(--panel-border)',
        overflowX: 'auto',
      }}
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onFilterChange(item.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            fontSize: 11,
            fontWeight: 500,
            background: currentFilter === item.key ? 'var(--accent)' : 'var(--highlight)',
            color: currentFilter === item.key ? 'white' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{item.label}</span>
          <span
            style={{
              padding: '1px 4px',
              fontSize: 10,
              background: currentFilter === item.key ? 'rgba(255,255,255,0.2)' : 'var(--panel)',
              borderRadius: 3,
            }}
          >
            {item.count}
          </span>
        </button>
      ))}
    </div>
  );
});

// ============================================================
// Main Component
// ============================================================

export const TransactionListPanel = memo(function TransactionListPanel({
  transactions,
  loading,
  error,
  selectedId,
  filter,
  stats,
  onSelect,
  onFilterChange,
  onRefresh,
  onSync,
}: TransactionListPanelProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--panel)',
        borderRight: '1px solid var(--panel-border)',
      }}
    >
      {/* ステータスフィルター */}
      <StatsBar
        stats={stats}
        currentFilter={filter.status}
        onFilterChange={(status) => onFilterChange({ status })}
      />
      
      {/* 検索 */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--panel-border)' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="摘要を検索..."
            value={filter.searchKeyword}
            onChange={(e) => onFilterChange({ searchKeyword: e.target.value })}
            style={{
              width: '100%',
              padding: '6px 8px 6px 28px',
              fontSize: 12,
              background: 'var(--highlight)',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>
      </div>
      
      {/* リスト */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && transactions.length === 0 ? (
          <div style={{ padding: 12 }}>
            {[...Array(5)].map((_, i) => (
              <N3Skeleton key={i} style={{ height: 56, marginBottom: 8 }} />
            ))}
          </div>
        ) : error ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              gap: 8,
              color: 'var(--error)',
            }}
          >
            <AlertCircle size={24} />
            <span style={{ fontSize: 12 }}>{error}</span>
            <N3Button variant="ghost" size="sm" onClick={onRefresh}>
              再試行
            </N3Button>
          </div>
        ) : transactions.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              gap: 8,
              color: 'var(--text-muted)',
            }}
          >
            <CheckCircle2 size={24} />
            <span style={{ fontSize: 12 }}>取引データがありません</span>
            <N3Button variant="ghost" size="sm" onClick={onSync}>
              MFから同期
            </N3Button>
          </div>
        ) : (
          transactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              isSelected={tx.id === selectedId}
              onClick={() => onSelect(tx.id)}
            />
          ))
        )}
      </div>
    </div>
  );
});
