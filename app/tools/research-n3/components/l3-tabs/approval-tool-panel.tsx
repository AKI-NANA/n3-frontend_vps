'use client';

import React, { memo, useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Upload, Filter, ChevronDown } from 'lucide-react';
import { N3Button, N3Divider, N3Select } from '@/components/n3';
import type { WorkflowType } from '@/app/tools/research-table/types/research';

// ============================================================
// ApprovalToolPanel - Container Component
// ============================================================
// 承認タブ用ツールパネル
// ============================================================

export interface ApprovalToolPanelProps {
  // 統計
  stats: {
    pendingApproval: number;
    approved: number;
    rejected: number;
    promoted: number;
    completeData: number;
    incompleteData: number;
  };
  // 状態
  loading?: boolean;
  processing?: boolean;
  selectedCount: number;
  dataFilter: 'all' | 'complete' | 'incomplete';
  // ハンドラー
  onRefresh: () => void;
  onApproveSelected: (workflowType: WorkflowType) => void;
  onRejectSelected: (reason?: string) => void;
  onPromoteSelected: () => void;
  onDataFilterChange: (filter: 'all' | 'complete' | 'incomplete') => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const ApprovalToolPanel = memo(function ApprovalToolPanel({
  stats,
  loading = false,
  processing = false,
  selectedCount,
  dataFilter,
  onRefresh,
  onApproveSelected,
  onRejectSelected,
  onPromoteSelected,
  onDataFilterChange,
  onSelectAll,
  onDeselectAll,
}: ApprovalToolPanelProps) {
  const [workflowType, setWorkflowType] = useState<WorkflowType>('未定');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    onApproveSelected(workflowType);
  };

  const handleReject = () => {
    onRejectSelected(rejectReason || undefined);
    setShowRejectModal(false);
    setRejectReason('');
  };

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
          <span style={{ color: 'var(--text-muted)' }}>承認待ち: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>{stats.pendingApproval}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>承認済: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{stats.approved}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>却下: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-error)' }}>{stats.rejected}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>昇格済: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-info)' }}>{stats.promoted}</span>
        </div>
        <N3Divider orientation="vertical" style={{ height: 16 }} />
        <div>
          <span style={{ color: 'var(--text-muted)' }}>データ完全: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{stats.completeData}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>不完全: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-error)' }}>{stats.incompleteData}</span>
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

      {/* Data Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          background: 'var(--panel)',
          border: '1px solid var(--panel-border)',
          borderRadius: 6,
        }}
      >
        <Filter size={14} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>データ完全性:</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'complete', 'incomplete'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => onDataFilterChange(filter)}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 500,
                background: dataFilter === filter ? 'var(--color-primary)' : 'transparent',
                color: dataFilter === filter ? 'white' : 'var(--text-muted)',
                border: `1px solid ${dataFilter === filter ? 'var(--color-primary)' : 'var(--panel-border)'}`,
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {filter === 'all' ? '全て' : filter === 'complete' ? '完全' : '不完全'}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={onSelectAll}
            style={{
              padding: '4px 8px',
              fontSize: 10,
              background: 'transparent',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            全選択
          </button>
          <button
            onClick={onDeselectAll}
            style={{
              padding: '4px 8px',
              fontSize: 10,
              background: 'transparent',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            解除
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {processing && (
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
          処理中...
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <N3Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={loading || processing}
        >
          <RefreshCw size={14} />
          更新
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        {/* Workflow Type Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>フロー:</span>
          <select
            value={workflowType}
            onChange={(e) => setWorkflowType(e.target.value as WorkflowType)}
            style={{
              height: 28,
              padding: '0 24px 0 8px',
              fontSize: 11,
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <option value="未定">未定</option>
            <option value="無在庫">無在庫（ドロップシップ）</option>
            <option value="有在庫">有在庫</option>
          </select>
        </div>

        <N3Button
          variant="primary"
          size="sm"
          onClick={handleApprove}
          disabled={selectedCount === 0 || processing}
        >
          <CheckCircle size={14} />
          承認 ({selectedCount})
        </N3Button>

        <N3Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRejectModal(true)}
          disabled={selectedCount === 0 || processing}
          style={{ color: 'var(--color-error)' }}
        >
          <XCircle size={14} />
          却下
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        <N3Button
          variant="secondary"
          size="sm"
          onClick={onPromoteSelected}
          disabled={selectedCount === 0 || processing}
        >
          <Upload size={14} />
          products_masterへ昇格
        </N3Button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowRejectModal(false)}
        >
          <div
            style={{
              width: 400,
              padding: 20,
              background: 'var(--panel)',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
              却下理由
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="却下理由を入力（任意）"
              style={{
                width: '100%',
                height: 100,
                padding: 12,
                fontSize: 13,
                border: '1px solid var(--panel-border)',
                borderRadius: 6,
                background: 'var(--bg)',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <N3Button variant="ghost" size="sm" onClick={() => setShowRejectModal(false)}>
                キャンセル
              </N3Button>
              <N3Button
                variant="primary"
                size="sm"
                onClick={handleReject}
                style={{ background: 'var(--color-error)' }}
              >
                却下する
              </N3Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ApprovalToolPanel.displayName = 'ApprovalToolPanel';

export default ApprovalToolPanel;
