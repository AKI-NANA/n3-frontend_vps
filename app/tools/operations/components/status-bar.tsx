// app/tools/operations/components/status-bar.tsx
// コピー元: editing/components/status-bar.tsx

'use client'

import { Info } from 'lucide-react'

interface StatusBarProps {
  total: number
  unsaved: number
  ready: number
  incomplete: number
  selected: number
  euResponsibleCount?: number
  filterPassedCount?: number
}

function StatItem({ color, label, value, tip }: { color: string; label: string; value: number; tip?: string }) {
  return (
    <span className="flex items-center gap-1 group relative cursor-help" style={{ color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
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

export function StatusBar({
  total, unsaved, ready, incomplete, selected, euResponsibleCount = 0, filterPassedCount = 0,
}: StatusBarProps) {
  return (
    <div 
      className="flex items-center gap-4 px-3 py-2 mb-2 text-[11px]" 
      style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)' }}
    >
      <span style={{ color: 'var(--text-muted)' }}>
        Total <span className="font-semibold" style={{ color: 'var(--text)' }}>{total}</span>
      </span>
      
      {unsaved > 0 && <StatItem color="var(--warning)" label="Unsaved" value={unsaved} tip="未保存の変更があります" />}
      <StatItem color="var(--success)" label="Ready" value={ready} tip="出品準備完了" />
      {incomplete > 0 && <StatItem color="var(--error)" label="Incomplete" value={incomplete} tip="必須項目が未入力" />}
      {filterPassedCount > 0 && <StatItem color="#9333ea" label="Filter通過" value={filterPassedCount} tip="出品フィルター通過済み" />}

      <div className="ml-auto flex items-center gap-2">
        <span style={{ color: 'var(--text-muted)' }}>Selected</span>
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
