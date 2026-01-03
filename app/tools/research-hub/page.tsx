// app/tools/research-hub/page.tsx
'use client'

import { useState } from 'react'
import { ToolPanel } from './components/tool-panel'
import { StatusBar } from './components/status-bar'
import { ExecutionTab } from './components/tabs/execution-tab'
import { ResultsTab } from './components/tabs/results-tab'
import { KaritoriTab } from './components/tabs/karitori-tab'
import { SupplierTab } from './components/tabs/supplier-tab'
import { AnalyticsTab } from './components/tabs/analytics-tab'
import { ApprovalTab } from './components/tabs/approval-tab'
import { useResearchData } from './hooks/use-research-data'
import { useBatchProcess } from './hooks/use-batch-process'
import { 
  Search, ShoppingBag, Target, Factory, TrendingUp, CheckSquare 
} from 'lucide-react'

type TabType = 'execution' | 'results' | 'karitori' | 'supplier' | 'analytics' | 'approval'

export default function ResearchHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('execution')
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [wrapText, setWrapText] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const {
    items,
    total,
    loading,
    error,
    stats,
    filters,
    setFilters,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    refresh,
    deleteItems,
    bulkApprove,
    modifiedIds
  } = useResearchData()

  const {
    processing,
    currentStep,
    runBatchAnalysis,
    runBatchScoring
  } = useBatchProcess()

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSelectedIds(new Set())
  }

  const handleRunAll = async () => {
    if (selectedIds.size === 0) {
      showToast('商品を選択してください', 'error')
      return
    }

    try {
      await runBatchAnalysis(Array.from(selectedIds))
      await runBatchScoring(Array.from(selectedIds))
      showToast('全処理完了')
      refresh()
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  }

  const handleApprove = async () => {
    if (selectedIds.size === 0) {
      showToast('商品を選択してください', 'error')
      return
    }

    try {
      await bulkApprove(Array.from(selectedIds))
      showToast(`${selectedIds.size}件を承認しました`)
      setSelectedIds(new Set())
      refresh()
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  }

  const handleDelete = async () => {
    if (selectedIds.size === 0) {
      showToast('商品を選択してください', 'error')
      return
    }

    if (!confirm(`${selectedIds.size}件を削除しますか？`)) return

    try {
      await deleteItems(Array.from(selectedIds))
      showToast(`${selectedIds.size}件を削除しました`)
      setSelectedIds(new Set())
      refresh()
    } catch (error: any) {
      showToast(error.message, 'error')
    }
  }

  const readyCount = items.filter(item => 
    item.status === 'new' || item.status === 'analyzing'
  ).length

  const tabs = [
    { id: 'execution' as TabType, label: 'リサーチ実行', icon: Search },
    { id: 'results' as TabType, label: 'リサーチ結果', icon: ShoppingBag },
    { id: 'karitori' as TabType, label: '刈り取り監視', icon: Target },
    { id: 'supplier' as TabType, label: '仕入先探索', icon: Factory },
    { id: 'analytics' as TabType, label: '分析', icon: TrendingUp },
    { id: 'approval' as TabType, label: '承認', icon: CheckSquare },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>読み込み中...</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>データを取得しています</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Tab Navigation - Compact like editing */}
      <div className="border-b sticky top-0 z-10" style={{ 
        background: 'var(--bg-secondary)', 
        borderColor: 'var(--border)' 
      }}>
        <div className="flex gap-1 px-4 py-1.5">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white'
                    : ''
                }`}
                style={{
                  background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-muted)'
                }}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tool Panel */}
      <ToolPanel
        modifiedCount={modifiedIds.size}
        readyCount={readyCount}
        processing={processing}
        currentStep={currentStep}
        selectedCount={selectedIds.size}
        onRunAll={handleRunAll}
        onApprove={handleApprove}
        onSave={refresh}
        onDelete={handleDelete}
        onRefresh={refresh}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        wrapText={wrapText}
        onWrapTextChange={setWrapText}
      />

      {/* Status Bar */}
      <StatusBar stats={stats} />

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-4 p-3 rounded text-sm" style={{ 
          background: 'var(--error-bg)', 
          border: '1px solid var(--error-border)',
          color: 'var(--error)' 
        }}>
          {error}
        </div>
      )}

      {/* Tab Content */}
      <div className="px-4 pb-8">
        {activeTab === 'execution' && (
          <ExecutionTab onSearchComplete={refresh} />
        )}
        
        {activeTab === 'results' && (
          <ResultsTab
            items={items}
            total={total}
            loading={loading}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            filters={filters}
            onFiltersChange={setFilters}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            viewMode={viewMode}
            wrapText={wrapText}
          />
        )}
        
        {activeTab === 'karitori' && (
          <KaritoriTab items={items.filter(item => item.karitori_status !== 'none')} />
        )}
        
        {activeTab === 'supplier' && (
          <SupplierTab />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsTab items={items} stats={stats} />
        )}
        
        {activeTab === 'approval' && (
          <ApprovalTab
            items={items.filter(item => item.status === 'new' || item.status === 'analyzing')}
            onApprove={async (ids) => {
              await bulkApprove(ids)
              refresh()
            }}
          />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div 
          className="fixed bottom-8 right-8 px-4 py-2.5 rounded shadow-lg text-white text-sm z-50"
          style={{
            background: toast.type === 'error' ? 'var(--error)' : 'var(--success)'
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
