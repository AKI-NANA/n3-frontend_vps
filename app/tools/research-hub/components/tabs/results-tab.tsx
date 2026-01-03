// app/tools/research-hub/components/tabs/results-tab.tsx
'use client'

import { useState } from 'react'
import type { ResearchItem } from '../../types/research'
import { ExternalLink, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface ResultsTabProps {
  items: ResearchItem[]
  selectedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onUpdateItem: (id: string, updates: Partial<ResearchItem>) => void
  viewMode: "list" | "card"
  wrapText: boolean
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function ResultsTab({ 
  items, 
  selectedIds, 
  onSelectChange,
  onUpdateItem,
  viewMode,
  wrapText,
  showToast 
}: ResultsTabProps) {
  const [sortField, setSortField] = useState<keyof ResearchItem>('total_score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

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
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          リサーチ結果がありません。「リサーチ実行」タブから検索を開始してください。
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
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
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>販売価格</th>
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>仕入価格</th>
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>利益</th>
              <th className="p-2 text-right" style={{ color: 'var(--text-muted)' }}>利益率</th>
              <th className="p-2 text-center" style={{ color: 'var(--text-muted)' }}>スコア</th>
              <th className="p-2 text-center" style={{ color: 'var(--text-muted)' }}>リスク</th>
              <th className="p-2 text-center" style={{ color: 'var(--text-muted)' }}>ステータス</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
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
                  <div className={wrapText ? '' : 'truncate'}>
                    {item.title}
                  </div>
                  {item.source_url && (
                    <a 
                      href={item.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] flex items-center gap-1 mt-1"
                      style={{ color: 'var(--accent)' }}
                    >
                      <ExternalLink size={10} />
                      詳細を見る
                    </a>
                  )}
                </td>
                <td className="p-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-medium" 
                    style={{ 
                      background: item.source === 'ebay' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(251, 146, 60, 0.12)',
                      color: item.source === 'ebay' ? 'var(--accent)' : '#ea580c'
                    }}>
                    {item.source.toUpperCase()}
                  </span>
                </td>
                <td className="p-2 text-right font-mono">
                  {item.sold_price_usd ? `$${item.sold_price_usd.toFixed(2)}` : '-'}
                </td>
                <td className="p-2 text-right font-mono">
                  {item.supplier_price_jpy ? `¥${item.supplier_price_jpy.toLocaleString()}` : '-'}
                </td>
                <td className="p-2 text-right font-mono">
                  {item.estimated_profit_jpy ? (
                    <span style={{ color: item.estimated_profit_jpy > 0 ? 'var(--success)' : 'var(--error)' }}>
                      {item.estimated_profit_jpy > 0 ? <TrendingUp size={10} className="inline mr-1" /> : <TrendingDown size={10} className="inline mr-1" />}
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
                  <span className="px-2 py-0.5 rounded text-[9px] font-medium"
                    style={{
                      background: item.status === 'new' ? 'rgba(99, 102, 241, 0.12)' :
                                 item.status === 'approved' ? 'rgba(34, 197, 94, 0.12)' :
                                 item.status === 'promoted' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(156, 163, 175, 0.12)',
                      color: item.status === 'new' ? 'var(--accent)' :
                            item.status === 'approved' ? 'var(--success)' :
                            item.status === 'promoted' ? '#9333ea' : 'var(--text-muted)'
                    }}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
