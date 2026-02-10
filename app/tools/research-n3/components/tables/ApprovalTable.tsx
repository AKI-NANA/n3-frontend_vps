// app/tools/research-n3/components/tables/approval-table.tsx
'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { N3Checkbox, N3Badge, N3Button } from '@/components/n3';

interface ApprovalTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

const MOCK_DATA = [
  { id: '1', image: '🏺', title: 'Antique Japanese Imari Porcelain Bowl Meiji Period', source: 'eBay Sold', sourceVariant: 'info' as const, price: 320.00, profit: 85.00, score: 'A+', date: '今日' },
  { id: '2', image: '🎎', title: 'Vintage Japanese Kokeshi Doll Set Traditional Craft', source: 'セラー', sourceVariant: 'purple' as const, price: 95.00, profit: 32.00, score: 'A', date: '昨日' },
  { id: '3', image: '⚔️', title: 'Japanese Sword Katana Display Stand Wooden Rack', source: 'AI提案', sourceVariant: 'success' as const, price: 45.00, profit: 15.50, score: 'B+', date: '2日前' },
];

export default function ApprovalTable({ filter, selectedIds = [], onSelect, onSelectAll }: ApprovalTableProps) {
  const allSelected = MOCK_DATA.length > 0 && MOCK_DATA.every(item => selectedIds.includes(item.id));
  
  const getScoreVariant = (score: string): 'purple' | 'warning' | 'muted' => {
    if (score.startsWith('A')) return 'purple';
    if (score.startsWith('B')) return 'warning';
    return 'muted';
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[var(--n3-panel)]">
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">
              <N3Checkbox checked={allSelected} onChange={() => onSelectAll?.(allSelected ? [] : MOCK_DATA.map(i => i.id))} />
            </th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">画像</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">商品名</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">リサーチ元</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">販売価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">利益見込</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">スコア</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">リサーチ日</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">アクション</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((item) => (
            <tr key={item.id} className={`border-b border-[var(--n3-panel-border)] hover:bg-[var(--n3-highlight)] ${selectedIds.includes(item.id) ? 'bg-[rgba(99,102,241,0.05)]' : ''}`}>
              <td className="p-2.5"><N3Checkbox checked={selectedIds.includes(item.id)} onChange={() => onSelect?.(item.id)} /></td>
              <td className="p-2.5"><div className="w-12 h-12 flex items-center justify-center rounded bg-[var(--n3-panel)] text-xl">{item.image}</div></td>
              <td className="p-2.5"><div className="max-w-[250px] truncate">{item.title}</div></td>
              <td className="p-2.5"><N3Badge variant={item.sourceVariant} size="sm">{item.source}</N3Badge></td>
              <td className="p-2.5"><span className="font-mono font-semibold">${item.price.toFixed(2)}</span></td>
              <td className="p-2.5"><span className="font-mono font-semibold text-[var(--n3-color-success)]">+${item.profit.toFixed(2)}</span></td>
              <td className="p-2.5"><N3Badge variant={getScoreVariant(item.score)} size="sm">{item.score}</N3Badge></td>
              <td className="p-2.5">{item.date}</td>
              <td className="p-2.5">
                <div className="flex gap-1">
                  <N3Button variant="success" size="xs" icon={<Check size={12} />}>承認</N3Button>
                  <N3Button variant="error" size="xs" icon={<X size={12} />}>却下</N3Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
