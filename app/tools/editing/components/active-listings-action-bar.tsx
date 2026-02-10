// app/tools/editing/components/active-listings-action-bar.tsx
'use client'

/**
 * 出品中タブ専用アクションバー（N3デザインシステムV4準拠）
 */
interface ActiveListingsActionBarProps {
  stats: {
    total: number
    mjt: { count: number; total: number }
    green: { count: number; total: number }
    manual: { count: number; total: number }
  }
  variationStats: {
    parent: number
    member: number
    standalone: number
    candidate: number
  }
  accountFilter: 'all' | 'MJT' | 'GREEN'
  isSyncing: boolean
  onAccountFilterChange: (filter: 'all' | 'MJT' | 'GREEN') => void
  onSync: () => void
  onMercariSync: () => void
  onDelete: () => void
  onRefresh: () => void
}

export function ActiveListingsActionBar({
  stats,
  variationStats,
  accountFilter,
  isSyncing,
  onAccountFilterChange,
  onSync,
  onMercariSync,
  onDelete,
  onRefresh
}: ActiveListingsActionBarProps) {
  return (
    <div 
      className="mb-2 px-3 py-2 rounded-lg flex items-center gap-2"
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)'
      }}
    >
      {/* アカウント別統計 - インライン表示 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Account
        </span>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }}></div>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--text)' }}>MJT</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--text)' }}>{stats.mjt.count}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }}></div>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--text)' }}>GREEN</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--text)' }}>{stats.green.count}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#a855f7' }}></div>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--text)' }}>手動</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--text)' }}>{stats.manual.count}</span>
          </div>
        </div>
      </div>

      <div className="h-5 w-px" style={{ background: 'var(--panel-border)' }}></div>

      {/* バリエーション統計 - インライン表示 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Variation
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>親</span>
            <span className="text-xs font-bold font-mono" style={{ color: 'var(--text-muted)' }}>{variationStats.parent}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>メンバー</span>
            <span className="text-xs font-bold font-mono" style={{ color: 'var(--text-muted)' }}>{variationStats.member}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>単独</span>
            <span className="text-xs font-bold font-mono" style={{ color: 'var(--text)' }}>{variationStats.standalone}</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
            <span className="text-[9px] font-semibold" style={{ color: '#c79100' }}>候補</span>
            <span className="text-xs font-bold font-mono" style={{ color: '#c79100' }}>{variationStats.candidate}</span>
          </div>
        </div>
      </div>

      <div className="h-5 w-px ml-auto" style={{ background: 'var(--panel-border)' }}></div>

      {/* アクションボタン */}
      <div className="flex items-center gap-1.5">
        {/* 差分同期 */}
        <button 
          onClick={onSync}
          disabled={isSyncing}
          className="px-2.5 py-1 text-[10px] font-semibold rounded transition-colors disabled:opacity-50"
          style={{
            background: 'var(--accent)',
            color: 'white'
          }}
        >
          {isSyncing ? '同期中...' : '差分同期'}
        </button>

        {/* アカウント別 */}
        <button 
          onClick={() => onAccountFilterChange('all')}
          className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
            accountFilter === 'all' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ color: '#64748b' }}
        >
          全件
        </button>
        <button 
          onClick={() => onAccountFilterChange('MJT')}
          className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
            accountFilter === 'MJT' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ color: '#64748b' }}
        >
          MJT
        </button>
        <button 
          onClick={() => onAccountFilterChange('GREEN')}
          className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
            accountFilter === 'GREEN' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ color: '#64748b' }}
        >
          GREEN
        </button>

        <div className="h-5 w-px" style={{ background: 'var(--panel-border)' }}></div>

        {/* メルカリ同期 */}
        <button 
          onClick={onMercariSync}
          className="px-2.5 py-1 text-[10px] font-semibold rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: 'var(--text)' }}
        >
          メルカリ
        </button>

        <div className="h-5 w-px" style={{ background: 'var(--panel-border)' }}></div>

        {/* 削除 */}
        <button 
          onClick={onDelete}
          className="px-2.5 py-1 text-[10px] font-semibold rounded transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          style={{ color: '#94a3b8' }}
        >
          削除
        </button>

        {/* 更新 */}
        <button 
          onClick={onRefresh}
          className="px-2.5 py-1 text-[10px] font-semibold rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: 'var(--text)' }}
        >
          更新
        </button>
      </div>
    </div>
  )
}
