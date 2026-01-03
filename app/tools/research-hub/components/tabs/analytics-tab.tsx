// app/tools/research-hub/components/tabs/analytics-tab.tsx
'use client'

import type { ResearchItem, ResearchStats } from '../../types/research'
import { BarChart3 } from 'lucide-react'

interface AnalyticsTabProps {
  items: ResearchItem[]
  stats: ResearchStats | null
}

export function AnalyticsTab({ items, stats }: AnalyticsTabProps) {
  return (
    <div className="p-12 text-center">
      <BarChart3 size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
        分析ダッシュボード
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        実装予定（Trend Analysis & Performance Metrics）
      </p>
      {stats && (
        <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-lg" style={{ background: 'var(--panel)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{stats.total}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>総商品数</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'var(--panel)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{stats.highScore}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>高スコア商品</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'var(--panel)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>{stats.avgMargin.toFixed(1)}%</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>平均利益率</div>
          </div>
        </div>
      )}
    </div>
  )
}
