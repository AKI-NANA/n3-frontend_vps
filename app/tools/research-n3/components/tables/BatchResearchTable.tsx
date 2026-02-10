// app/tools/research-n3/components/tables/batch-research-table.tsx
'use client';

import React from 'react';
import { Pause, Eye, RotateCcw } from 'lucide-react';
import { N3Badge, N3Button } from '@/components/n3';

interface BatchResearchTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

const MOCK_DATA = [
  { id: '1', name: 'japan-collector 30日分析', type: 'セラー', typeVariant: 'info' as const, target: 'japan-collector', progress: 65, count: 1234, startTime: '2時間前', status: '実行中', statusVariant: 'success' as const },
  { id: '2', name: 'Pokemon キーワード一括', type: 'キーワード', typeVariant: 'purple' as const, target: 'pokemon, charizard', progress: 100, count: 5678, startTime: '昨日', status: '完了', statusVariant: 'muted' as const },
  { id: '3', name: 'ASIN一括取得', type: 'ASIN', typeVariant: 'warning' as const, target: 'B08xxx, B09xxx', progress: 30, count: 456, startTime: '30分前', status: '実行中', statusVariant: 'success' as const },
];

export default function BatchResearchTable({ filter, selectedIds = [], onSelect, onSelectAll }: BatchResearchTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[var(--n3-panel)]">
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">ジョブ名</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">タイプ</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">ターゲット</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] w-36">進捗</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">取得数</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">開始</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">ステータス</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">アクション</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((item) => (
            <tr key={item.id} className="border-b border-[var(--n3-panel-border)] hover:bg-[var(--n3-highlight)]">
              <td className="p-2.5">{item.name}</td>
              <td className="p-2.5"><N3Badge variant={item.typeVariant} size="sm">{item.type}</N3Badge></td>
              <td className="p-2.5 max-w-[200px] truncate">{item.target}</td>
              <td className="p-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded bg-[var(--n3-panel-border)] overflow-hidden">
                    <div className="h-full bg-[var(--n3-accent)]" style={{ width: `${item.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-[var(--n3-text-muted)]">{item.progress}%</span>
                </div>
              </td>
              <td className="p-2.5 font-mono">{item.count.toLocaleString()}</td>
              <td className="p-2.5">{item.startTime}</td>
              <td className="p-2.5"><N3Badge variant={item.statusVariant} size="sm">{item.status === '実行中' ? '▶ ' : '✓ '}{item.status}</N3Badge></td>
              <td className="p-2.5">
                <div className="flex gap-1">
                  {item.status === '実行中' ? (
                    <N3Button variant="ghost" size="xs" icon={<Pause size={14} />} />
                  ) : (
                    <N3Button variant="ghost" size="xs" icon={<RotateCcw size={14} />} />
                  )}
                  <N3Button variant="ghost" size="xs" icon={<Eye size={14} />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
