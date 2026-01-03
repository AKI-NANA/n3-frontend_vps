// app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx
/**
 * InquiryToolPanel - 問い合わせツールパネル (Container)
 */

'use client';

import React, { memo } from 'react';
import {
  RefreshCw,
  Bot,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { N3Button, N3StatsBar } from '@/components/n3';
import type { InquiryStats } from '../../types/operations';

export interface InquiryToolPanelProps {
  stats: InquiryStats;
  loading?: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onBulkApproveAI: () => void;
  onOpenTemplates: () => void;
  onGenerateDrafts: () => void;
}

export const InquiryToolPanel = memo(function InquiryToolPanel({
  stats,
  loading = false,
  selectedCount,
  onRefresh,
  onBulkApproveAI,
  onOpenTemplates,
  onGenerateDrafts,
}: InquiryToolPanelProps) {
  return (
    <div style={{ padding: '12px' }}>
      {/* 統計バー */}
      <N3StatsBar
        stats={[
          { label: '総件数', value: stats.total, color: 'default' },
          { label: '未読', value: stats.unread, color: 'default' },
          { label: 'AI対応済', value: stats.aiResponded, color: 'blue' },
          { label: '手動待ち', value: stats.pendingManual, color: 'yellow' },
          { label: '完了', value: stats.completed, color: 'green' },
          { label: '緊急', value: stats.critical, color: 'red' },
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
          onClick={onGenerateDrafts}
          disabled={stats.unread === 0}
        >
          <Bot size={14} />
          AI回答生成
        </N3Button>

        <N3Button
          variant="success"
          size="sm"
          onClick={onBulkApproveAI}
          disabled={stats.aiResponded === 0}
        >
          <CheckCircle size={14} />
          AI提案を一括承認 {stats.aiResponded > 0 && `(${stats.aiResponded})`}
        </N3Button>

        <div style={{ width: '1px', height: '20px', background: 'var(--panel-border)' }} />

        <N3Button variant="secondary" size="sm" onClick={onOpenTemplates}>
          <FileText size={14} />
          テンプレート管理
        </N3Button>
      </div>

      {/* 緊急・手動対応待ちアラート */}
      {(stats.critical > 0 || stats.pendingManual > 0) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '12px',
            padding: '8px 12px',
            background: stats.critical > 0 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          <AlertTriangle size={16} style={{ color: stats.critical > 0 ? 'var(--color-error)' : 'var(--color-warning)' }} />
          {stats.critical > 0 && (
            <span style={{ color: 'var(--color-error)', fontWeight: 500 }}>
              緊急対応: {stats.critical}件
            </span>
          )}
          {stats.pendingManual > 0 && (
            <span style={{ color: 'var(--color-warning)' }}>
              手動対応待ち: {stats.pendingManual}件
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default InquiryToolPanel;
