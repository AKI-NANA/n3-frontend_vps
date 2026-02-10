// app/tools/editing/components/active-listings-panel.tsx
'use client'

/**
 * 出品中タブ専用パネル - レイヤー2: コンテキスト・アクション
 * 出品管理に特化（グローバル統計は除外）
 */
export function ActiveListingsPanel() {
  return (
    <div className="space-y-2 mb-3">
      {/* アカウント別統計 - コンパクト表示 */}
      <div 
        className="rounded-lg p-3"
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--panel-border)'
        }}
      >
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          {/* 左: ラベル */}
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            アカウント別
          </div>

          {/* 右: 3カラム統計 */}
          <div className="grid grid-cols-3 gap-3">
            {/* MJT */}
            <div 
              className="px-3 py-2 rounded flex items-center justify-between"
              style={{ background: 'rgba(59, 130, 246, 0.1)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }}></div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>MJT</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>909</div>
                <div className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>$183,961</div>
              </div>
            </div>

            {/* GREEN */}
            <div 
              className="px-3 py-2 rounded flex items-center justify-between"
              style={{ background: 'rgba(34, 197, 94, 0.1)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }}></div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>GREEN</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>88</div>
                <div className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>$35,874</div>
              </div>
            </div>

            {/* 手動入力 */}
            <div 
              className="px-3 py-2 rounded flex items-center justify-between"
              style={{ background: 'rgba(168, 85, 247, 0.1)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#a855f7' }}></div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>手動入力</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>0</div>
                <div className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>$0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* バリエーション統計 - 1行コンパクト */}
      <div 
        className="rounded-lg p-3"
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--panel-border)'
        }}
      >
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
          {/* 左: ラベル */}
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            バリエーション
          </div>

          {/* 右: 4カラム統計 */}
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>👑 親</span>
              <span className="text-lg font-bold" style={{ color: 'var(--text-muted)' }}>0</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>🔗 メンバー</span>
              <span className="text-lg font-bold" style={{ color: 'var(--text-muted)' }}>0</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>◆ 単独</span>
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>997</span>
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded" style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
              <span className="text-[10px] font-semibold" style={{ color: '#eab308' }}>🍇 候補</span>
              <span className="text-lg font-bold" style={{ color: '#eab308' }}>393</span>
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div 
        className="rounded-lg p-3"
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--panel-border)'
        }}
      >
        <div className="flex items-center gap-2">
          {/* 差分同期グループ */}
          <div className="flex items-center gap-1">
            <button 
              className="px-3 py-1.5 text-xs font-semibold rounded transition-colors"
              style={{
                background: 'var(--accent)',
                color: 'white'
              }}
            >
              ⚡ 差分同期
            </button>
            <div className="h-4 w-px" style={{ background: 'var(--panel-border)' }}></div>
            <button 
              className="px-2 py-1.5 text-[10px] font-medium rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: 'var(--text-muted)' }}
            >
              全件
            </button>
            <button 
              className="px-2 py-1.5 text-[10px] font-medium rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: '#3b82f6' }}
            >
              🔵 MJT
            </button>
            <button 
              className="px-2 py-1.5 text-[10px] font-medium rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: '#22c55e' }}
            >
              🟢 GREEN
            </button>
          </div>

          <div className="h-4 w-px" style={{ background: 'var(--panel-border)' }}></div>

          {/* メルカリ同期 */}
          <button 
            className="px-3 py-1.5 text-xs font-semibold rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--text)' }}
          >
            🛍️ メルカリ
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* 削除 */}
            <button 
              className="px-3 py-1.5 text-xs font-semibold rounded transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              style={{ color: 'var(--destructive)' }}
            >
              削除
            </button>

            {/* 更新 */}
            <button 
              className="px-3 py-1.5 text-xs font-semibold rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: 'var(--text)' }}
            >
              🔄 更新
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
