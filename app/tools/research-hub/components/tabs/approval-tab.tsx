// app/tools/research-hub/components/tabs/approval-tab.tsx
'use client'

import type { ResearchItem } from '../../types/research'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'

interface ApprovalTabProps {
  items: ResearchItem[]
  selectedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onApprove: () => void
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function ApprovalTab({ 
  items, 
  selectedIds, 
  onSelectChange,
  onApprove,
  showToast 
}: ApprovalTabProps) {
  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      onSelectChange(new Set())
    } else {
      onSelectChange(new Set(items.map(i => i.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectChange(newSelected)
  }

  if (items.length === 0) {
    return (
      <div className="p-12 text-center">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--success)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          承認待ちの商品はありません
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          承認待ち商品 ({items.length}件)
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (selectedIds.size === 0) {
                showToast('商品を選択してください', 'error')
                return
              }
              onApprove()
            }}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--success)] text-white hover:opacity-90 transition-all disabled:opacity-50"
          >
            <CheckCircle size={14} />
            承認 ({selectedIds.size})
          </button>
        </div>
      </div>

      {/* 説明 */}
      <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--highlight)' }}>
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          💡 承認すると、選択した商品が <span className="font-semibold">products_master</span> に
          コピーされ、<span className="font-semibold">/tools/editing</span> で編集できるようになります。
        </p>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
              <th className="p-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.size === items.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-2 text-left" style={{ color: 'var(--text-muted)' }}>画像</th>
              <th className="p-2 text-left" style={{ color: 'var(--text-muted)' }}>タイトル</th>
              <th className="p-2 text-left" style={{ color: 'var(--text-muted)' }}>ソース</th>
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>利益</th>
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>利益率</th>
              <th className="p-2 text-center" style={{ color: 'var(--text-muted)' }}>スコア</th>
              <th className="p-2 text-center" style={{ color: 'var(--text-muted)' }}>リスク</th>
              <th className="p-2 text-center" style={{ color: 'var(--text-muted)' }}>推奨</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const shouldApprove = 
                (item.total_score || 0) >= 70 && 
                (item.profit_margin || 0) >= 20 &&
                item.risk_level !== 'high'

              return (
                <tr 
                  key={item.id} 
                  className="hover:bg-[var(--highlight)] transition-colors"
                  style={{ borderBottom: '1px solid var(--panel-border)' }}
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                    />
                  </td>
                  <td className="p-2">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt="" 
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-[var(--highlight)]" />
                    )}
                  </td>
                  <td className="p-2 max-w-xs">
                    <div className="truncate">{item.title}</div>
                    {item.source_url && (
                      <a 
                        href={item.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] flex items-center gap-1 mt-1"
                        style={{ color: 'var(--accent)' }}
                      >
                        <ExternalLink size={10} />
                        詳細
                      </a>
                    )}
                  </td>
                  <td className="p-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-medium"
                      style={{
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: 'var(--accent)'
                      }}>
                      {item.source.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-2 text-right font-mono">
                    {item.estimated_profit_jpy ? (
                      <span style={{ color: item.estimated_profit_jpy > 0 ? 'var(--success)' : 'var(--error)' }}>
                        ¥{item.estimated_profit_jpy.toLocaleString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-2 text-right font-mono">
                    {item.profit_margin ? (
                      <span style={{ color: item.profit_margin > 20 ? 'var(--success)' : 'var(--warning)' }}>
                        {item.profit_margin.toFixed(1)}%
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-2 text-center">
                    {item.total_score !== null && item.total_score !== undefined ? (
                      <span className="px-2 py-0.5 rounded font-mono font-semibold"
                        style={{
                          background: item.total_score >= 80 ? 'rgba(34, 197, 94, 0.12)' : 
                                     item.total_score >= 60 ? 'rgba(251, 146, 60, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: item.total_score >= 80 ? 'var(--success)' :
                                item.total_score >= 60 ? 'var(--warning)' : 'var(--error)'
                        }}>
                        {item.total_score}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-2 text-center">
                    {item.risk_level && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium"
                        style={{
                          background: item.risk_level === 'low' ? 'rgba(34, 197, 94, 0.12)' :
                                     item.risk_level === 'medium' ? 'rgba(251, 146, 60, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: item.risk_level === 'low' ? 'var(--success)' :
                                item.risk_level === 'medium' ? 'var(--warning)' : 'var(--error)'
                        }}>
                        {item.risk_level.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    {shouldApprove ? (
                      <CheckCircle size={16} style={{ color: 'var(--success)' }} className="mx-auto" />
                    ) : (
                      <XCircle size={16} style={{ color: 'var(--error)' }} className="mx-auto" />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
