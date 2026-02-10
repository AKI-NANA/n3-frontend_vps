// app/tools/research-n3/components/tables/reverse-research-table.tsx
'use client';

import React from 'react';
import { Eye, ShoppingCart } from 'lucide-react';
import { N3Checkbox, N3Badge, N3Button } from '@/components/n3';

interface ReverseResearchTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

const MOCK_DATA = [
  { id: '1', image: '⚔️', title: 'Japanese Samurai Sword Katana Authentic Blade', ebayPrice: 450.00, supplierSite: 'ヤフオク', supplierSiteBg: '#ff0033', supplierPrice: '¥28,000', profit: 120.00, status: '仕入先発見', statusVariant: 'success' as const },
  { id: '2', image: '🎌', title: 'Vintage Japanese Flag Rising Sun WWII Era', ebayPrice: 180.00, supplierSite: 'Amazon', supplierSiteBg: '#ff9900', supplierPrice: '¥8,500', profit: 55.00, status: '仕入先発見', statusVariant: 'success' as const },
  { id: '3', image: '🏺', title: 'Antique Imari Porcelain Plate Meiji Period', ebayPrice: 320.00, supplierSite: '楽天', supplierSiteBg: '#bf0000', supplierPrice: '¥18,000', profit: 85.00, status: '価格調査中', statusVariant: 'warning' as const },
];

export default function ReverseResearchTable({ filter, selectedIds = [], onSelect, onSelectAll }: ReverseResearchTableProps) {
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
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">eBay商品</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">販売価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">仕入先</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">仕入価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">利益見込</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">ステータス</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">アクション</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((item) => (
            <tr key={item.id} className={`border-b border-[var(--n3-panel-border)] hover:bg-[var(--n3-highlight)] ${selectedIds.includes(item.id) ? 'bg-[rgba(99,102,241,0.05)]' : ''}`}>
              <td className="p-2.5"><N3Checkbox checked={selectedIds.includes(item.id)} onChange={() => onSelect?.(item.id)} /></td>
              <td className="p-2.5"><div className="w-12 h-12 flex items-center justify-center rounded bg-[var(--n3-panel)] text-xl">{item.image}</div></td>
              <td className="p-2.5"><div className="max-w-[250px] truncate">{item.title}</div></td>
              <td className="p-2.5"><span className="font-mono font-semibold">${item.ebayPrice.toFixed(2)}</span></td>
              <td className="p-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium text-white" style={{ background: item.supplierSiteBg }}>{item.supplierSite}</span>
              </td>
              <td className="p-2.5"><span className="font-mono font-semibold">{item.supplierPrice}</span></td>
              <td className="p-2.5"><span className="font-mono font-semibold text-[var(--n3-color-success)]">+${item.profit.toFixed(2)}</span></td>
              <td className="p-2.5"><N3Badge variant={item.statusVariant} size="sm">{item.status}</N3Badge></td>
              <td className="p-2.5">
                <div className="flex gap-1">
                  <N3Button variant="ghost" size="xs" icon={<Eye size={14} />} />
                  <N3Button variant="ghost" size="xs" icon={<ShoppingCart size={14} />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
