// app/tools/research-n3/components/tables/scraping-table.tsx
'use client';

import React from 'react';
import { Pause, Play, Pencil } from 'lucide-react';
import { N3Badge, N3Button } from '@/components/n3';

interface ScrapingTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

const MOCK_DATA = [
  { id: '1', name: '骨董品 毎日取得', site: 'ヤフオク', siteBg: '#ff0033', keywords: '骨董品, 茶道具', frequency: '毎日 9:00', lastRun: '今日 9:00', count: 1234, status: '実行中', statusVariant: 'success' as const },
  { id: '2', name: 'MAFEX フィギュア', site: '楽天', siteBg: '#bf0000', keywords: 'MAFEX, メディコム', frequency: '毎時', lastRun: '1時間前', count: 567, status: '実行中', statusVariant: 'success' as const },
  { id: '3', name: 'ブランドバッグ監視', site: 'メルカリ', siteBg: '#ff0211', keywords: 'エルメス, シャネル', frequency: '6時間毎', lastRun: '3時間前', count: 890, status: '停止中', statusVariant: 'warning' as const },
];

export default function ScrapingTable({ filter, selectedIds = [], onSelect, onSelectAll }: ScrapingTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[var(--n3-panel)]">
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">タスク名</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">サイト</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">キーワード/条件</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">頻度</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">最終実行</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">取得数</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">ステータス</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">アクション</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((item) => (
            <tr key={item.id} className="border-b border-[var(--n3-panel-border)] hover:bg-[var(--n3-highlight)]">
              <td className="p-2.5">{item.name}</td>
              <td className="p-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium text-white" style={{ background: item.siteBg }}>{item.site}</span>
              </td>
              <td className="p-2.5">{item.keywords}</td>
              <td className="p-2.5">{item.frequency}</td>
              <td className="p-2.5">{item.lastRun}</td>
              <td className="p-2.5 font-mono">{item.count.toLocaleString()}</td>
              <td className="p-2.5"><N3Badge variant={item.statusVariant} size="sm">{item.status === '実行中' ? '▶ ' : '⏸ '}{item.status}</N3Badge></td>
              <td className="p-2.5">
                <div className="flex gap-1">
                  {item.status === '実行中' ? (
                    <N3Button variant="ghost" size="xs" icon={<Pause size={14} />} />
                  ) : (
                    <N3Button variant="ghost" size="xs" icon={<Play size={14} />} />
                  )}
                  <N3Button variant="ghost" size="xs" icon={<Pencil size={14} />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
