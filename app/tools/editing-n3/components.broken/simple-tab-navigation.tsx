// app/tools/editing/components/simple-tab-navigation.tsx
'use client'

import { FileEdit, Package, ClipboardCheck, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabId = 'editing' | 'inventory' | 'approval' | 'image-register'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

interface SimpleTabNavigationProps {
  activeTab: TabId
  onTabChange: (tabId: TabId) => void
}

const tabs: Tab[] = [
  {
    id: 'editing',
    label: 'データ編集中',
    icon: <FileEdit className="w-3.5 h-3.5" />
  },
  {
    id: 'inventory',
    label: '有在庫管理',
    icon: <Package className="w-3.5 h-3.5" />
  },
  {
    id: 'approval',
    label: '承認待ち',
    icon: <ClipboardCheck className="w-3.5 h-3.5" />
  },
  {
    id: 'image-register',
    label: '画像商品登録',
    icon: <ImagePlus className="w-3.5 h-3.5" />
  }
]

export function SimpleTabNavigation({ activeTab, onTabChange }: SimpleTabNavigationProps) {
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
