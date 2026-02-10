// app/tools/research-table/components/research-status-bar.tsx
'use client'

import type { ResearchStats } from '../types/research'

interface ResearchStatusBarProps {
  total: number
  selected: number
  stats: ResearchStats
}

function StatItem({
  color,
  label,
  value,
  tip
}: {
  color: string
  label: string
  value: number
  tip?: string
}) {
  return (
    <span
      className="flex items-center gap-1 group relative cursor-help"
      style={{ color }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: color }}
      />
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
      {tip && (
        <div className="absolute bottom-full left-0 mb-1 px-2 py-1 text-[10px]
          bg-gray-800 text-white rounded whitespace-nowrap opacity-0 invisible
          group-hover:opacity-100 group-hover:visible transition-all z-50">
          {tip}
        </div>
      )}
    </span>
  )
}

export function ResearchStatusBar({
  total,
  selected,
  stats,
}: ResearchStatusBarProps) {
  return (
    <div
      className="flex items-center gap-4 px-3 py-2 mb-2 text-[11px]"
      style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)' }}
    >
      <span style={{ color: 'var(--text-muted)' }}>
        Total <span className="font-semibold" style={{ color: 'var(--text)' }}>{total}</span>
      </span>

      <StatItem
        color="#3b82f6"
        label="新規"
        value={stats.newCount}
        tip="未分析の商品"
      />

      <StatItem
        color="#f59e0b"
        label="分析中"
        value={stats.analyzingCount}
        tip="AI分析処理中"
      />

      <StatItem
        color="#10b981"
        label="承認済"
        value={stats.approvedCount}
        tip="編集待ち"
      />

      <StatItem
        color="#6366f1"
        label="スコア70+"
        value={stats.highScoreCount}
        tip="高スコア商品"
      />

      <StatItem
        color="#8b5cf6"
        label="仕入先あり"
        value={stats.supplierFoundCount}
        tip="仕入先発見済み"
      />

      <div className="ml-auto flex items-center gap-2">
        <span style={{ color: 'var(--text-muted)' }}>選択中</span>
        <span
          className="font-mono font-semibold px-2 py-0.5 rounded"
          style={{
            background: selected > 0 ? 'rgba(99, 102, 241, 0.12)' : 'var(--highlight)',
            color: selected > 0 ? 'var(--accent)' : 'var(--text)'
          }}
        >
          {selected}
        </span>
      </div>
    </div>
  )
}
