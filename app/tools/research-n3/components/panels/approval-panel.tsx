// app/tools/research-n3/components/panels/approval-panel.tsx
/**
 * 承認ワークフロー ツールパネル
 */

'use client';

import React from 'react';
import { CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';
import { N3Button } from '@/components/n3';

interface ApprovalPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
  onApproveSelected?: () => void;
  onRejectSelected?: () => void;
}

export default function ApprovalPanel({
  filter,
  selectedCount = 0,
  onRefresh,
  onApproveSelected,
  onRejectSelected,
}: ApprovalPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">承認ワークフロー</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          リサーチ結果を確認し、products_masterへ登録
        </p>
        
        {/* ワークフロー統計 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-warning)]">45</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">承認待ち</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-success)]">234</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">承認済</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-error)]">23</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">却下</div>
          </div>
        </div>
      </div>
      
      {/* 一括アクション */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="text-xs font-semibold mb-2">⚡ 一括アクション</div>
        {selectedCount > 0 ? (
          <div className="text-xs text-[var(--n3-accent)] mb-2">
            選択中: <strong>{selectedCount}件</strong>
          </div>
        ) : (
          <div className="text-xs text-[var(--n3-text-muted)] mb-2">
            アイテムを選択してください
          </div>
        )}
        
        <N3Button
          variant="success"
          size="sm"
          icon={<CheckCircle size={14} />}
          className="w-full mb-2"
          onClick={onApproveSelected}
          disabled={selectedCount === 0}
        >
          選択を一括承認
        </N3Button>
        
        <N3Button
          variant="error"
          size="sm"
          icon={<XCircle size={14} />}
          className="w-full"
          onClick={onRejectSelected}
          disabled={selectedCount === 0}
        >
          選択を一括却下
        </N3Button>
      </div>
      
      {/* 承認後のフロー */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">📋 承認後のフロー</div>
        <div className="p-3 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-xs">
          {[
            { step: 1, color: 'var(--n3-color-success)', text: '承認 → products_master登録' },
            { step: 2, color: 'var(--n3-color-info)', text: 'Editing N3 で詳細編集' },
            { step: 3, color: 'var(--n3-color-purple)', text: 'Listing N3 で出品' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2 mb-2 last:mb-0">
              <span
                className="w-5 h-5 flex items-center justify-center rounded-full text-white text-[10px]"
                style={{ background: item.color }}
              >
                {item.step}
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        
        <N3Button
          variant="secondary"
          size="sm"
          icon={<ExternalLink size={14} />}
          className="w-full mt-3"
        >
          Editing N3 を開く
        </N3Button>
      </div>
    </div>
  );
}
