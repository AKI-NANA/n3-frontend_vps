// app/tools/editing/components/view-toggle.tsx
'use client'

import { Button } from '@/components/ui/button'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'card' | 'list'

interface ViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export function ViewToggle({ viewMode, onViewModeChange, className }: ViewToggleProps) {
  return (
    <div className={cn("inline-flex items-center border rounded-lg", className)}>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="rounded-r-none"
      >
        <List className="w-4 h-4" />
        <span className="ml-2 hidden sm:inline">リスト</span>
      </Button>
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('card')}
        className="rounded-l-none"
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="ml-2 hidden sm:inline">カード</span>
      </Button>
    </div>
  )
}
