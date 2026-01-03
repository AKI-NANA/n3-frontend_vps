// app/tools/research-n3/components/tables/ai-proposal-table.tsx
'use client';

import React from 'react';
import { Search, Check } from 'lucide-react';
import { N3Badge, N3Button } from '@/components/n3';

interface AIProposalTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

const MOCK_DATA = [
  { id: '1', category: '日本の伝統工芸', type: 'トレンド', typeVariant: 'success' as const, keywords: '和紙, 漆器, 有田焼', marketSize: '$2.3M/月', competition: '低', competitionVariant: 'success' as const, reason: '米国で日本文化への関心が高まっている', confidence: 92 },
  { id: '2', category: 'ビンテージオーディオ', type: 'ニッチ', typeVariant: 'info' as const, keywords: 'DENON, SANSUI, Pioneer', marketSize: '$890K/月', competition: '中', competitionVariant: 'warning' as const, reason: 'コレクター需要', confidence: 85 },
  { id: '3', category: '季節装飾', type: '季節', typeVariant: 'purple' as const, keywords: 'こいのぼり, 雛人形', marketSize: '$1.2M/月', competition: '低', competitionVariant: 'success' as const, reason: '3-5月の季節需要', confidence: 78 },
];

export default function AIProposalTable({ filter, selectedIds = [], onSelect, onSelectAll }: AIProposalTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[var(--n3-panel)]">
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">提案カテゴリ</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">タイプ</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">キーワード/商品</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">市場規模</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">競合度</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">推奨理由</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">信頼度</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">アクション</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((item) => (
            <tr key={item.id} className="border-b border-[var(--n3-panel-border)] hover:bg-[var(--n3-highlight)]">
              <td className="p-2.5">{item.category}</td>
              <td className="p-2.5"><N3Badge variant={item.typeVariant} size="sm">{item.type}</N3Badge></td>
              <td className="p-2.5">{item.keywords}</td>
              <td className="p-2.5 font-mono">{item.marketSize}</td>
              <td className="p-2.5"><N3Badge variant={item.competitionVariant} size="sm">{item.competition}</N3Badge></td>
              <td className="p-2.5 max-w-[200px] text-[11px]">{item.reason}</td>
              <td className="p-2.5"><N3Badge variant="purple" size="sm">{item.confidence}%</N3Badge></td>
              <td className="p-2.5">
                <div className="flex gap-1">
                  <N3Button variant="ghost" size="xs" icon={<Search size={14} />} />
                  <N3Button variant="ghost" size="xs" icon={<Check size={14} />} className="text-[var(--n3-color-success)]" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
