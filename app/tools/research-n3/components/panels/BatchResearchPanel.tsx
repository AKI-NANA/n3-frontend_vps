// app/tools/research-n3/components/panels/batch-research-panel.tsx
/**
 * バッチリサーチ ツールパネル
 */

'use client';

import React, { useState } from 'react';
import { Package, Play, Pause } from 'lucide-react';
import { N3Button } from '@/components/n3';

interface BatchResearchPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

export default function BatchResearchPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: BatchResearchPanelProps) {
  const [jobName, setJobName] = useState('');
  const [jobType, setJobType] = useState('seller');
  const [inputData, setInputData] = useState('');
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Package size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">バッチリサーチ</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          大量のセラーID/キーワード/ASINを一括処理
        </p>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">ジョブ名</label>
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            placeholder="日本骨董品セラー一括"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">タイプ</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          >
            <option value="seller">セラーID一括</option>
            <option value="keyword">キーワード一括</option>
            <option value="asin">ASIN一括</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">入力データ（1行1件）</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder={"japan-collector\ntokyo-antiques"}
            rows={3}
            className="w-full px-2 py-1.5 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)] resize-y"
          />
        </div>
        
        <N3Button variant="primary" size="sm" icon={<Package size={14} />} className="w-full">
          ジョブ作成・実行
        </N3Button>
      </div>
      
      {/* 実行中ジョブ */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">▶ 実行中ジョブ</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-warning)]">3</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">実行中</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-success)]">8,234</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">完了</div>
          </div>
        </div>
        
        <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)]">
          <div className="flex justify-between text-xs mb-1.5">
            <span>japan-collector 30日</span>
            <span>65%</span>
          </div>
          <div className="h-1.5 rounded bg-[var(--n3-panel-border)] overflow-hidden">
            <div className="h-full w-[65%] bg-[var(--n3-accent)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
