// app/tools/editing/components/l2-tab-navigation.tsx
'use client'

import { Edit3, Truck, Shield, Image as ImageIcon, History } from 'lucide-react'
import { cn } from '@/lib/utils'

export type L2TabId = 'basic-edit' | 'logistics' | 'compliance' | 'media' | 'history'

interface L2Tab {
  id: L2TabId
  label: string
  icon: React.ReactNode
}

interface L2TabNavigationProps {
  activeTab: L2TabId
  onTabChange: (tabId: L2TabId) => void
}

const tabs: L2Tab[] = [
  {
    id: 'basic-edit',
    label: '基本編集',
    icon: <Edit3 className="w-3.5 h-3.5" />
  },
  {
    id: 'logistics',
    label: 'ロジスティクス',
    icon: <Truck className="w-3.5 h-3.5" />
  },
  {
    id: 'compliance',
    label: '関税・法令',
    icon: <Shield className="w-3.5 h-3.5" />
  },
  {
    id: 'media',
    label: 'メディア',
    icon: <ImageIcon className="w-3.5 h-3.5" />
  },
  {
    id: 'history',
    label: '履歴・監査',
    icon: <History className="w-3.5 h-3.5" />
  }
]

export function L2TabNavigation({ activeTab, onTabChange }: L2TabNavigationProps) {
  return (
    <div 
      className="flex items-center gap-1 px-3 py-1.5 mb-2"
      style={{ 
        background: 'var(--panel)', 
        border: '1px solid var(--panel-border)', 
        borderRadius: 'var(--radius-md)' 
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all whitespace-nowrap",
              isActive
                ? "text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            style={isActive ? {
              background: 'var(--accent)',
              color: 'white'
            } : {
              color: 'var(--text-muted)'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
