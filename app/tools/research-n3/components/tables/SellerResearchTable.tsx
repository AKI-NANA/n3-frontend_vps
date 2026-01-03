// app/tools/research-n3/components/tables/seller-research-table.tsx
/**
 * セラーリサーチ テーブル
 */

'use client';

import React from 'react';
import { Eye, Copy, Search } from 'lucide-react';
import { N3Checkbox, N3Badge, N3Button } from '@/components/n3';

interface SellerResearchTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

const MOCK_DATA = [
  { id: '1', image: '🏺', title: 'Antique Japanese Tea Bowl Raku Ware Chawan', price: 150.00, sales: 15, competitors: 3, profit: 38.00, seller: 'japan-treasures' },
  { id: '2', image: '🎨', title: 'Vintage Ukiyo-e Print Hokusai Great Wave', price: 280.00, sales: 8, competitors: 5, profit: 65.00, seller: 'japan-treasures' },
  { id: '3', image: '⚔️', title: 'Japanese Katana Sword Stand Display Rack', price: 45.00, sales: 32, competitors: 12, profit: 12.50, seller: 'japan-treasures' },
];

export default function SellerResearchTable({
  filter,
  selectedIds = [],
  onSelect,
  onSelectAll,
}: SellerResearchTableProps) {
  const allSelected = MOCK_DATA.length > 0 && MOCK_DATA.every(item => selectedIds.includes(item.id));
  
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
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">出品価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">販売数/月</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">競合</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">利益見込</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">セラー</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">アクション</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((item) => (
            <tr key={item.id} className={`border-b border-[var(--n3-panel-border)] hover:bg-[var(--n3-highlight)] ${selectedIds.includes(item.id) ? 'bg-[rgba(99,102,241,0.05)]' : ''}`}>
              <td className="p-2.5"><N3Checkbox checked={selectedIds.includes(item.id)} onChange={() => onSelect?.(item.id)} /></td>
              <td className="p-2.5"><div className="w-12 h-12 flex items-center justify-center rounded bg-[var(--n3-panel)] text-xl">{item.image}</div></td>
              <td className="p-2.5"><div className="max-w-[300px] truncate">{item.title}</div></td>
              <td className="p-2.5"><span className="font-mono font-semibold">${item.price.toFixed(2)}</span></td>
              <td className="p-2.5">{item.sales}</td>
              <td className="p-2.5">{item.competitors}</td>
              <td className="p-2.5"><span className="font-mono font-semibold text-[var(--n3-color-success)]">+${item.profit.toFixed(2)}</span></td>
              <td className="p-2.5"><N3Badge variant="info" size="sm">{item.seller}</N3Badge></td>
              <td className="p-2.5">
                <div className="flex gap-1">
                  <N3Button variant="ghost" size="xs" icon={<Search size={14} />} />
                  <N3Button variant="ghost" size="xs" icon={<Copy size={14} />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
