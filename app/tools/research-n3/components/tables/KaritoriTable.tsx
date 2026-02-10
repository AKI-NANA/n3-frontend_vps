// app/tools/research-n3/components/tables/karitori-table.tsx
'use client';

import React from 'react';
import { Pencil, StopCircle, ShoppingCart } from 'lucide-react';
import { N3Checkbox, N3Badge, N3Button } from '@/components/n3';

interface KaritoriTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

const MOCK_DATA = [
  { id: '1', image: '📱', title: 'Sony WH-1000XM5 Wireless Headphones', site: 'Amazon', siteBg: '#ff9900', currentPrice: '¥38,800', targetPrice: '¥35,000', diff: '-¥3,800', diffPositive: false, status: '監視中', statusVariant: 'info' as const, isAlert: false },
  { id: '2', image: '🎮', title: 'Nintendo Switch Pro Controller', site: 'Amazon', siteBg: '#ff9900', currentPrice: '¥6,480', targetPrice: '¥7,000', diff: '+¥520', diffPositive: true, status: 'アラート!', statusVariant: 'warning' as const, isAlert: true },
  { id: '3', image: '⌚', title: 'Apple Watch SE 2nd Gen 40mm', site: '楽天', siteBg: '#bf0000', currentPrice: '¥32,800', targetPrice: '¥30,000', diff: '-¥2,800', diffPositive: false, status: '監視中', statusVariant: 'info' as const, isAlert: false },
];

// Keepaグラフのモック
const KeepaGraph = ({ isAlert }: { isAlert: boolean }) => {
  const bars = isAlert ? [90, 60, 40] : [80, 70, 90, 60, 75];
  return (
    <div className="h-14 flex items-end gap-0.5 p-2 rounded bg-[var(--n3-panel)]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${h}%`,
            background: isAlert ? 'var(--n3-color-success)' : 'var(--n3-accent)',
          }}
        />
      ))}
    </div>
  );
};

export default function KaritoriTable({ filter, selectedIds = [], onSelect, onSelectAll }: KaritoriTableProps) {
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
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">サイト</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">現在価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">目標価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">差額</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">Keepa</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">ステータス</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)]">アクション</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DATA.map((item) => (
            <tr
              key={item.id}
              className={`border-b border-[var(--n3-panel-border)] hover:bg-[var(--n3-highlight)] ${item.isAlert ? 'bg-[var(--n3-color-warning-light)]' : ''} ${selectedIds.includes(item.id) ? 'bg-[rgba(99,102,241,0.05)]' : ''}`}
            >
              <td className="p-2.5"><N3Checkbox checked={selectedIds.includes(item.id)} onChange={() => onSelect?.(item.id)} /></td>
              <td className="p-2.5"><div className="w-12 h-12 flex items-center justify-center rounded bg-[var(--n3-panel)] text-xl">{item.image}</div></td>
              <td className="p-2.5"><div className="max-w-[200px] truncate">{item.title}</div></td>
              <td className="p-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium text-black" style={{ background: item.siteBg }}>{item.site}</span>
              </td>
              <td className="p-2.5"><span className={`font-mono font-semibold ${item.diffPositive ? 'text-[var(--n3-color-success)]' : ''}`}>{item.currentPrice}</span></td>
              <td className="p-2.5"><span className="font-mono font-semibold">{item.targetPrice}</span></td>
              <td className="p-2.5"><span className={`font-mono font-semibold ${item.diffPositive ? 'text-[var(--n3-color-success)]' : 'text-[var(--n3-color-warning)]'}`}>{item.diff}</span></td>
              <td className="p-2.5"><KeepaGraph isAlert={item.isAlert} /></td>
              <td className="p-2.5"><N3Badge variant={item.statusVariant} size="sm">{item.status === '監視中' ? '👀 ' : '🔔 '}{item.status}</N3Badge></td>
              <td className="p-2.5">
                {item.isAlert ? (
                  <N3Button variant="success" size="xs" icon={<ShoppingCart size={12} />}>即購入</N3Button>
                ) : (
                  <div className="flex gap-1">
                    <N3Button variant="ghost" size="xs" icon={<Pencil size={14} />} />
                    <N3Button variant="ghost" size="xs" icon={<StopCircle size={14} />} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
