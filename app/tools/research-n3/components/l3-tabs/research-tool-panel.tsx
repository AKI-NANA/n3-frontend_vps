'use client';

import React, { memo } from 'react';
import { RefreshCw, Search, Calculator, Zap, FileDown, Trash2, CheckCircle } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';

// ============================================================
// ResearchToolPanel - Container Component
// ============================================================
// リサーチタブ用ツールパネル
// - Hooksを呼び出せる
// - 子要素間のgap/marginを定義
// - 状態とロジックを子に注入
// ============================================================

export interface ResearchToolPanelProps {
  // 統計
  stats: {
    total: number;
    new: number;
    analyzing: number;
    approved: number;
  };
  // 状態
  loading?: boolean;
  processing?: boolean;
  currentStep?: string;
  selectedCount: number;
  // ハンドラー
  onRefresh: () => void;
  onCalculateShipping: () => void;
  onSearchSupplier: () => void;
  onAnalyzeAI: () => void;
  onApproveSelected: () => void;
  onRejectSelected: () => void;
  onExportCSV: () => void;
  onDeleteSelected: () => void;
}

export const ResearchToolPanel = memo(function ResearchToolPanel({
  stats,
  loading = false,
  processing = false,
  currentStep,
  selectedCount,
  onRefresh,
  onCalculateShipping,
  onSearchSupplier,
  onAnalyzeAI,
  onApproveSelected,
  onRejectSelected,
  onExportCSV,
  onDeleteSelected,
}: ResearchToolPanelProps) {
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
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)' }}>総件数: </span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{stats.total}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>新規: </span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{stats.new}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>分析中: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>{stats.analyzing}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>承認済: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{stats.approved}</span>
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

      {/* Processing Indicator */}
      {processing && currentStep && (
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
          {currentStep}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {/* Data Operations */}
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

        {/* Batch Operations */}
        <N3Button
          variant="secondary"
          size="sm"
          onClick={onCalculateShipping}
          disabled={selectedCount === 0 || processing}
        >
          <Calculator size={14} />
          送料計算
        </N3Button>

        <N3Button
          variant="secondary"
          size="sm"
          onClick={onSearchSupplier}
          disabled={selectedCount === 0 || processing}
        >
          <Search size={14} />
          仕入先検索
        </N3Button>

        <N3Button
          variant="secondary"
          size="sm"
          onClick={onAnalyzeAI}
          disabled={selectedCount === 0 || processing}
        >
          <Zap size={14} />
          AI分析
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        {/* Approval Operations */}
        <N3Button
          variant="primary"
          size="sm"
          onClick={onApproveSelected}
          disabled={selectedCount === 0 || processing}
        >
          <CheckCircle size={14} />
          承認 ({selectedCount})
        </N3Button>

        <N3Button
          variant="ghost"
          size="sm"
          onClick={onRejectSelected}
          disabled={selectedCount === 0 || processing}
          style={{ color: 'var(--color-error)' }}
        >
          却下
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        {/* Export/Delete */}
        <N3Button
          variant="ghost"
          size="sm"
          onClick={onExportCSV}
          disabled={processing}
        >
          <FileDown size={14} />
          CSV出力
        </N3Button>

        <N3Button
          variant="ghost"
          size="sm"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0 || processing}
          style={{ color: 'var(--color-error)' }}
        >
          <Trash2 size={14} />
          削除
        </N3Button>
      </div>
    </div>
  );
});

ResearchToolPanel.displayName = 'ResearchToolPanel';

export default ResearchToolPanel;
