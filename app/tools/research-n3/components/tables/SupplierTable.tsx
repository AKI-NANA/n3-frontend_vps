// app/tools/research-n3/components/tables/supplier-table.tsx
'use client';

import React from 'react';
import { Copy, Mail } from 'lucide-react';
import { N3Checkbox, N3Badge, N3Button } from '@/components/n3';

interface SupplierTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

const MOCK_DATA = [
  { id: '1', image: '🍵', title: 'Japanese Cast Iron Teapot Tetsubin Traditional', sellPrice: 120.00, supplierCount: 5, lowestPrice: '¥4,500', profit: 72.00, reliability: '高', reliabilityVariant: 'success' as const },
  { id: '2', image: '🎎', title: 'Kokeshi Doll Set Traditional Japanese Craft', sellPrice: 85.00, supplierCount: 3, lowestPrice: '¥3,200', profit: 45.50, reliability: '高', reliabilityVariant: 'success' as const },
  { id: '3', image: '🏺', title: 'Arita Porcelain Bowl Blue White Pattern', sellPrice: 150.00, supplierCount: 2, lowestPrice: '¥8,500', profit: 55.00, reliability: '中', reliabilityVariant: 'warning' as const },
];

export default function SupplierTable({ filter, selectedIds = [], onSelect, onSelectAll }: SupplierTableProps) {
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
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">販売価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">仕入先候補数</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">最安仕入価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">利益見込</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">信頼度</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">アクション</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((item) => (
            <tr key={item.id} className={`border-b border-[var(--n3-panel-border)] hover:bg-[var(--n3-highlight)] ${selectedIds.includes(item.id) ? 'bg-[rgba(99,102,241,0.05)]' : ''}`}>
              <td className="p-2.5"><N3Checkbox checked={selectedIds.includes(item.id)} onChange={() => onSelect?.(item.id)} /></td>
              <td className="p-2.5"><div className="w-12 h-12 flex items-center justify-center rounded bg-[var(--n3-panel)] text-xl">{item.image}</div></td>
              <td className="p-2.5"><div className="max-w-[250px] truncate">{item.title}</div></td>
              <td className="p-2.5"><span className="font-mono font-semibold">${item.sellPrice.toFixed(2)}</span></td>
              <td className="p-2.5"><N3Badge variant="success" size="sm">{item.supplierCount}件</N3Badge></td>
              <td className="p-2.5"><span className="font-mono font-semibold">{item.lowestPrice}</span></td>
              <td className="p-2.5"><span className="font-mono font-semibold text-[var(--n3-color-success)]">+${item.profit.toFixed(2)}</span></td>
              <td className="p-2.5"><N3Badge variant={item.reliabilityVariant} size="sm">{item.reliability}</N3Badge></td>
              <td className="p-2.5">
                <div className="flex gap-1">
                  <N3Button variant="ghost" size="xs" icon={<Copy size={14} />} />
                  <N3Button variant="ghost" size="xs" icon={<Mail size={14} />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
