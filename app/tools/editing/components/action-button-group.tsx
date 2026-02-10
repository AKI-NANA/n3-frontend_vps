// app/tools/editing/components/action-button-group.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Layers,
  GitBranch,
  Zap,
  Download,
  Trash2,
  RefreshCw,
  Edit3,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionButton {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive'
  requiresSelection?: boolean
  disabled?: boolean
}

interface ActionButtonGroupProps {
  selectedCount: number
  onNewProduct: () => void
  onCreateSet: () => void
  onCreateVariation: () => void
  onAIExport?: () => void
  onBulkExport?: () => void
  onBulkDelete?: () => void
  onBulkUpdate?: () => void
  className?: string
}

export function ActionButtonGroup({
  selectedCount,
  onNewProduct,
  onCreateSet,
  onCreateVariation,
  onAIExport,
  onBulkExport,
  onBulkDelete,
  onBulkUpdate,
  className
}: ActionButtonGroupProps) {
  
  const primaryButtons: ActionButton[] = [
    {
      id: 'new-product',
      label: '新規商品登録',
      icon: <Plus className="w-4 h-4" />,
      onClick: onNewProduct,
      variant: 'default',
      requiresSelection: false
    },
    {
      id: 'create-set',
      label: 'セット品作成',
      icon: <Layers className="w-4 h-4" />,
      onClick: onCreateSet,
      variant: 'outline',
      requiresSelection: true,
      disabled: selectedCount < 2
    },
    {
      id: 'create-variation',
      label: 'バリエーション作成',
      icon: <GitBranch className="w-4 h-4" />,
      onClick: onCreateVariation,
      variant: 'outline',
      requiresSelection: true,
      disabled: selectedCount < 1
    }
  ]

  const bulkActions = [
    {
      id: 'ai-export',
      label: 'AIエクスポート',
      icon: <Sparkles className="w-4 h-4 mr-2" />,
      onClick: onAIExport,
      disabled: selectedCount < 1
    },
    {
      id: 'bulk-export',
      label: 'CSV出力',
      icon: <Download className="w-4 h-4 mr-2" />,
      onClick: onBulkExport,
      disabled: selectedCount < 1
    },
    {
      id: 'bulk-update',
      label: '一括更新',
      icon: <Edit3 className="w-4 h-4 mr-2" />,
      onClick: onBulkUpdate,
      disabled: selectedCount < 1
    },
    {
      id: 'bulk-delete',
      label: '一括削除',
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      onClick: onBulkDelete,
      disabled: selectedCount < 1,
      variant: 'destructive' as const
    }
  ]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Primary Action Buttons */}
      {primaryButtons.map((button) => (
        <Button
          key={button.id}
          variant={button.variant}
          onClick={button.onClick}
          disabled={button.requiresSelection && button.disabled}
          className="gap-2"
        >
          {button.icon}
          <span className="hidden sm:inline">{button.label}</span>
        </Button>
      ))}

      {/* Bulk Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            disabled={selectedCount < 1}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">一括操作</span>
            {selectedCount > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {selectedCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            {selectedCount}件選択中
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {bulkActions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "cursor-pointer",
                action.variant === 'destructive' && "text-destructive focus:text-destructive"
              )}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
