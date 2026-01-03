// app/tools/editing/config/tab-configs.ts
import { 
  FileEdit, 
  Store, 
  Package, 
  ClipboardCheck,
  LucideIcon 
} from 'lucide-react'

export type TabId = 'editing' | 'listed' | 'inventory' | 'approval'

export interface TabConfig {
  id: TabId
  label: string
  description: string
  icon: LucideIcon
  color: string
  countKey?: string  // データ統計のキー
}

export const tabConfigs: TabConfig[] = [
  {
    id: 'editing',
    label: 'データ編集中',
    description: '未出品の編集中商品',
    icon: FileEdit,
    color: 'text-blue-600',
    countKey: 'editing'
  },
  {
    id: 'listed',
    label: '出品中',
    description: '各マーケットプレースに出品済み',
    icon: Store,
    color: 'text-green-600',
    countKey: 'listed'
  },
  {
    id: 'inventory',
    label: '有在庫のみ',
    description: '物理在庫を持つ商品の棚卸し',
    icon: Package,
    color: 'text-orange-600',
    countKey: 'inventory'
  },
  {
    id: 'approval',
    label: '承認待ち',
    description: 'ワークフロー内で承認が必要な商品',
    icon: ClipboardCheck,
    color: 'text-purple-600',
    countKey: 'approval'
  }
]

export const getTabConfig = (id: TabId): TabConfig | undefined => {
  return tabConfigs.find(tab => tab.id === id)
}
