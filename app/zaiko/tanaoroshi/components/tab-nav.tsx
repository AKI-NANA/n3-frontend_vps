'use client'

import { Badge } from '@/components/ui/badge'
import { Package, Database, ClipboardCheck, LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: string
  badge?: number
}

interface TabNavProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

// Font Awesome → Lucide マッピング
const iconMap: Record<string, LucideIcon> = {
  'fas fa-boxes': Package,
  'fas fa-database': Database,
  'fas fa-clipboard-check': ClipboardCheck,
}

export function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6">
      <div className="flex gap-2">
        {tabs.map(tab => {
          const IconComponent = iconMap[tab.icon] || Package
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }
              `}
            >
              <IconComponent className="h-5 w-5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <Badge
                  className={
                    activeTab === tab.id
                      ? 'bg-white/90 text-indigo-600'
                      : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  }
                >
                  {tab.badge}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
