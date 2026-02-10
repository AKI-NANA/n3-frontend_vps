'use client';

import React, { memo } from 'react';
import { RefreshCw, Search, Mail, Phone, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';
import type { ContactStatus } from '@/app/tools/research-table/types/research';

// ============================================================
// SupplierToolPanel - Container Component
// ============================================================
// 仕入先タブ用ツールパネル
// ============================================================

export interface SupplierToolPanelProps {
  // 統計
  stats: {
    total: number;
    pending: number;
    contacted: number;
    replied: number;
    confirmed: number;
    rejected: number;
  };
  // 状態
  loading?: boolean;
  searching?: boolean;
  selectedCount: number;
  // ハンドラー
  onRefresh: () => void;
  onSearchSuppliers: () => void;
  onGenerateEmail: () => void;
  onSendEmail: () => void;
  onUpdateStatus: (status: ContactStatus) => void;
  onExportContacts: () => void;
}

const STATUS_CONFIG: Record<ContactStatus, { label: string; color: string }> = {
  pending: { label: '未連絡', color: 'var(--text-muted)' },
  contacted: { label: '連絡済', color: 'var(--color-info)' },
  replied: { label: '返信あり', color: 'var(--color-warning)' },
  negotiating: { label: '交渉中', color: 'var(--color-primary)' },
  confirmed: { label: '確定', color: 'var(--color-success)' },
  rejected: { label: '不成立', color: 'var(--color-error)' },
};

export const SupplierToolPanel = memo(function SupplierToolPanel({
  stats,
  loading = false,
  searching = false,
  selectedCount,
  onRefresh,
  onSearchSuppliers,
  onGenerateEmail,
  onSendEmail,
  onUpdateStatus,
  onExportContacts,
}: SupplierToolPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
      {/* Stats Row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: '8px 12px',
          background: 'var(--highlight)',
          borderRadius: 6,
          fontSize: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)' }}>総件数: </span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{stats.total}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>未連絡: </span>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{stats.pending}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>連絡済: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-info)' }}>{stats.contacted}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>返信あり: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>{stats.replied}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>確定: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{stats.confirmed}</span>
        </div>
        {selectedCount > 0 && (
          <>
            <N3Divider orientation="vertical" style={{ height: 16 }} />
            <div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                {selectedCount}件選択中
              </span>
            </div>
          </>
        )}
      </div>

      {/* Searching Indicator */}
      {searching && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 6,
            fontSize: 12,
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              border: '2px solid var(--color-primary)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          AI仕入先検索中...
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <N3Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={loading || searching}
        >
          <RefreshCw size={14} />
          更新
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        {/* Search Operations */}
        <N3Button
          variant="primary"
          size="sm"
          onClick={onSearchSuppliers}
          disabled={selectedCount === 0 || searching}
        >
          <Search size={14} />
          AI仕入先検索
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        {/* Email Operations */}
        <N3Button
          variant="secondary"
          size="sm"
          onClick={onGenerateEmail}
          disabled={selectedCount === 0 || searching}
        >
          <MessageSquare size={14} />
          メール生成
        </N3Button>

        <N3Button
          variant="secondary"
          size="sm"
          onClick={onSendEmail}
          disabled={selectedCount === 0 || searching}
        >
          <Mail size={14} />
          メール送信
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        {/* Status Updates */}
        <N3Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateStatus('contacted')}
          disabled={selectedCount === 0}
        >
          <Phone size={14} />
          連絡済み
        </N3Button>

        <N3Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateStatus('confirmed')}
          disabled={selectedCount === 0}
          style={{ color: 'var(--color-success)' }}
        >
          <CheckCircle size={14} />
          確定
        </N3Button>

        <N3Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateStatus('rejected')}
          disabled={selectedCount === 0}
          style={{ color: 'var(--color-error)' }}
        >
          <XCircle size={14} />
          不成立
        </N3Button>
      </div>

      {/* Status Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          padding: '6px 12px',
          background: 'var(--highlight)',
          borderRadius: 6,
          fontSize: 10,
        }}
      >
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: config.color,
              }}
            />
            <span style={{ color: 'var(--text-muted)' }}>{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

SupplierToolPanel.displayName = 'SupplierToolPanel';

export default SupplierToolPanel;
