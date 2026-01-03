// app/tools/research-hub/components/tabs/karitori-tab.tsx
'use client'

import type { ResearchItem } from '../../types/research'
import { TrendingDown } from 'lucide-react'

interface KaritoriTabProps {
  items: ResearchItem[]
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function KaritoriTab({ items, showToast }: KaritoriTabProps) {
  return (
    <div className="p-12 text-center">
      <TrendingDown size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
        刈り取り監視
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        実装予定（Price Tracking & Alert System）
      </p>
    </div>
  )
}
