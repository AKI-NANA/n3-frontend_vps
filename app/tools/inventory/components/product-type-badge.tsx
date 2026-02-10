// app/tools/editing/components/product-type-badge.tsx
'use client'

interface ProductTypeBadgeProps {
  productType?: 'stock' | 'dropship' | 'set' | 'unclassified' | null
  isStockMaster?: boolean | null
  className?: string
}

/**
 * 有在庫/無在庫バッジ
 * - stock (有在庫): 緑バッジ
 * - dropship (無在庫): グレーバッジ  
 * - set (セット商品): 紫バッジ
 * - unclassified (未分類): 黄色バッジ
 * - null/undefined: 未判定
 */
export function ProductTypeBadge({ productType, isStockMaster, className = '' }: ProductTypeBadgeProps) {
  const getBadgeStyle = () => {
    switch (productType) {
      case 'stock':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          label: '有在庫',
          icon: '📦'
        }
      case 'dropship':
        return {
          bg: 'bg-slate-100 dark:bg-slate-700/50',
          text: 'text-slate-600 dark:text-slate-300',
          label: '無在庫',
          icon: '🚚'
        }
      case 'set':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-800 dark:text-purple-300',
          label: 'セット',
          icon: '📚'
        }
      case 'unclassified':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-800 dark:text-yellow-300',
          label: '未分類',
          icon: '❓'
        }
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-500 dark:text-gray-400',
          label: '未判定',
          icon: '−'
        }
    }
  }

  const style = getBadgeStyle()

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${style.bg} ${style.text}`}
        title={isStockMaster ? '有在庫マスター登録済み' : ''}
      >
        <span className="mr-0.5">{style.icon}</span>
        {style.label}
      </span>
      {isStockMaster && (
        <span className="text-green-600 dark:text-green-400 text-[10px]" title="マスター登録済">
          ✓
        </span>
      )}
    </div>
  )
}

/**
 * 有在庫判定セレクトボックス
 */
interface ProductTypeSelectorProps {
  value?: 'stock' | 'dropship' | 'set' | 'unclassified' | null
  onChange: (value: 'stock' | 'dropship' | 'set' | 'unclassified') => void
  disabled?: boolean
}

export function ProductTypeSelector({ value, onChange, disabled }: ProductTypeSelectorProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value as any)}
      disabled={disabled}
      className="w-full px-1 py-0.5 text-[10px] border border-border rounded bg-card hover:bg-muted/50 focus:outline focus:outline-2 focus:outline-primary"
    >
      <option value="">未判定</option>
      <option value="stock">📦 有在庫</option>
      <option value="dropship">🚚 無在庫</option>
      <option value="set">📚 セット</option>
      <option value="unclassified">❓ 未分類</option>
    </select>
  )
}
