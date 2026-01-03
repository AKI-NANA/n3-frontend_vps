// app/tools/research-n3/components/tables/analysis-table.tsx
/**
 * 分析・計算 表示パネル（テーブルではなく計算結果表示）
 */
'use client';

import React from 'react';

interface AnalysisTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
}

export default function AnalysisTable({ filter }: AnalysisTableProps) {
  return (
    <div className="p-4">
      {/* 利益計算結果 */}
      <div className="p-4 rounded-lg bg-[var(--n3-panel)] border border-[var(--n3-panel-border)] mb-4">
        <h3 className="text-sm font-semibold mb-3">📊 利益計算結果</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: '$145.00', label: '販売価格' },
            { value: '¥8,500', label: '仕入価格' },
            { value: '$28.50', label: '送料（DDP）' },
            { value: '$42.30', label: '純利益', color: 'var(--n3-color-success)' },
          ].map((stat, idx) => (
            <div key={idx} className="p-3 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
              <div className="text-lg font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-[var(--n3-text-muted)] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* リスク評価 */}
      <div className="p-4 rounded-lg bg-[var(--n3-panel)] border border-[var(--n3-panel-border)]">
        <h3 className="text-sm font-semibold mb-3">⚠️ リスク評価</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: '✓ VERO', desc: '問題なし', color: 'var(--n3-color-success)', bg: 'var(--n3-color-success-light)' },
            { title: '✓ Section 301', desc: '対象外', color: 'var(--n3-color-success)', bg: 'var(--n3-color-success-light)' },
            { title: '⚠ 競合', desc: '12人が出品中', color: 'var(--n3-color-warning)', bg: 'var(--n3-color-warning-light)' },
          ].map((risk, idx) => (
            <div key={idx} className="p-3 rounded" style={{ background: risk.bg }}>
              <div className="text-xs font-semibold" style={{ color: risk.color }}>{risk.title}</div>
              <div className="text-[11px] text-[var(--n3-text-muted)]">{risk.desc}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 送料比較表 */}
      <div className="mt-4 p-4 rounded-lg bg-[var(--n3-panel)] border border-[var(--n3-panel-border)]">
        <h3 className="text-sm font-semibold mb-3">🚚 送料比較（アメリカ向け）</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--n3-panel-border)]">
              <th className="text-left p-2 text-[var(--n3-text-muted)]">配送方法</th>
              <th className="text-left p-2 text-[var(--n3-text-muted)]">送料</th>
              <th className="text-left p-2 text-[var(--n3-text-muted)]">到着日数</th>
              <th className="text-left p-2 text-[var(--n3-text-muted)]">追跡</th>
              <th className="text-left p-2 text-[var(--n3-text-muted)]">純利益</th>
            </tr>
          </thead>
          <tbody>
            {[
              { method: 'DDP (FedEx)', cost: '$28.50', days: '3-5日', tracking: '✓', profit: '$42.30', recommended: true },
              { method: 'DDU (EMS)', cost: '$22.00', days: '7-14日', tracking: '✓', profit: '$48.80', recommended: false },
              { method: 'SAL', cost: '$12.50', days: '2-4週', tracking: '△', profit: '$58.30', recommended: false },
            ].map((row, idx) => (
              <tr key={idx} className={`border-b border-[var(--n3-panel-border)] ${row.recommended ? 'bg-[var(--n3-highlight)]' : ''}`}>
                <td className="p-2">
                  {row.method}
                  {row.recommended && <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-[var(--n3-accent)] text-white">推奨</span>}
                </td>
                <td className="p-2 font-mono">{row.cost}</td>
                <td className="p-2">{row.days}</td>
                <td className="p-2">{row.tracking}</td>
                <td className="p-2 font-mono text-[var(--n3-color-success)]">{row.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
