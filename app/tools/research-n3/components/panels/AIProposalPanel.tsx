// app/tools/research-n3/components/panels/ai-proposal-panel.tsx
/**
 * AI提案 ツールパネル
 */

'use client';

import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { N3Button } from '@/components/n3';

interface AIProposalPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

export default function AIProposalPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: AIProposalPanelProps) {
  const [proposalTypes, setProposalTypes] = useState({
    trend: true,
    niche: true,
    seasonal: true,
    unexplored: false,
  });
  const [category, setCategory] = useState('all');
  const [proposalCount, setProposalCount] = useState('10');
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">AI提案</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          AIがトレンド分析・ニッチ市場発掘・季節商品を提案
        </p>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">提案タイプ</label>
          <div className="flex flex-wrap gap-3 mt-1">
            {[
              { key: 'trend', label: 'トレンド' },
              { key: 'niche', label: 'ニッチ' },
              { key: 'seasonal', label: '季節' },
              { key: 'unexplored', label: '未開拓' },
            ].map((type) => (
              <label key={type.key} className="flex items-center gap-1.5 text-xs text-[var(--n3-text-muted)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={proposalTypes[type.key as keyof typeof proposalTypes]}
                  onChange={(e) => setProposalTypes(prev => ({ ...prev, [type.key]: e.target.checked }))}
                  className="w-3.5 h-3.5"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">対象カテゴリ</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            >
              <option value="all">すべて</option>
              <option value="traditional">日本の伝統工芸</option>
              <option value="vintage">ビンテージ品</option>
            </select>
          </div>
          <div className="w-20">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">提案数</label>
            <input
              type="number"
              value={proposalCount}
              onChange={(e) => setProposalCount(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        <N3Button variant="primary" size="sm" icon={<Sparkles size={14} />} className="w-full">
          AI提案を生成
        </N3Button>
      </div>
      
      {/* 提案統計 */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">📊 提案統計</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-info)]">45</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">総提案数</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-success)]">15</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">採用済み</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-purple)]">87%</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">平均信頼度</div>
          </div>
        </div>
      </div>
    </div>
  );
}
