// app/tools/editing/components/tab-navigation.tsx
'use client'

import { TabConfig } from '../config/tab-configs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TabNavigationProps {
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (tabId: string) => void
  counts?: Record<string, number>
}

export function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  counts = {} 
}: TabNavigationProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center gap-1 px-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const count = tab.countKey ? counts[tab.countKey] : undefined

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap",
                "hover:bg-accent/50",
                isActive
                  ? "border-primary text-primary font-medium bg-accent/30"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive && tab.color)} />
              <span className="text-sm">{tab.label}</span>
              {count !== undefined && count > 0 && (
                <Badge 
                  variant={isActive ? "default" : "secondary"}
                  className="ml-1 h-5 px-2"
                >
                  {count}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
