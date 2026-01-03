'use client'

import { LayoutGrid, List } from 'lucide-react'

interface ViewToggleProps {
  viewMode: 'card' | 'table'
  onViewModeChange: (mode: 'card' | 'table') => void
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      <button
        onClick={() => onViewModeChange('card')}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
          transition-all duration-200
          ${viewMode === 'card'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
          }
        `}
      >
        <LayoutGrid className="h-4 w-4" />
        カード
      </button>
      <button
        onClick={() => onViewModeChange('table')}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
          transition-all duration-200
          ${viewMode === 'table'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
          }
        `}
      >
        <List className="h-4 w-4" />
        テーブル
      </button>
    </div>
  )
}
