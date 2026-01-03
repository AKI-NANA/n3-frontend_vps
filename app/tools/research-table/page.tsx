/**
 * 統合リサーチテーブル メインページ
 * タブ構成: リサーチ | 刈り取り | 仕入先探索 | 承認待ち
 */

'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Download, Settings, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResearchData } from './hooks/use-research-data';
import { useKaritoriActions } from './hooks/use-karitori-actions';
import { ResearchTable } from './components/research-table';
import { KaritoriTable } from './components/karitori-table';
import { SupplierTable } from './components/supplier-table';
import { ApprovalTable } from './components/approval-table';
import type { ResearchTab, TabConfig } from './types/research';

export default function ResearchTablePage() {
  const [activeTab, setActiveTab] = useState<ResearchTab>('research');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // リサーチデータフック
  const research = useResearchData({
    initialFilters: {},
    pageSize: 50,
  });

  // 刈り取りフック
  const karitori = useKaritoriActions();

  // 初回ロード
  useEffect(() => {
    if (activeTab === 'karitori') {
      karitori.loadAlerts();
      karitori.loadCategories();
    }
  }, [activeTab]);

  // 検索適用
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== research.filters.search) {
        research.updateFilters({ search: searchQuery || undefined });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // タブ設定
  const tabs: TabConfig[] = [
    { id: 'research', label: 'リサーチ結果', icon: 'search', count: research.stats?.total },
    { id: 'karitori', label: '刈り取り監視', icon: 'zap', count: (research.stats?.watching || 0) + (research.stats?.alert || 0) },
    { id: 'supplier', label: '仕入先探索', icon: 'package', count: undefined },
    { id: 'approval', label: '承認待ち', icon: 'check-circle', count: (research.stats?.new || 0) + (research.stats?.analyzing || 0) },
  ];

  // Toast表示
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <div className="border-b border-panel-border bg-panel">
        <div className="px-4 py-2">
          {/* タイトル行 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-foreground">統合リサーチテーブル</h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-highlight text-text-muted">
                {research.total}件
              </span>
            </div>

            {/* ツールバー */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => research.loadData()}
                className="n3-btn n3-btn-ghost n3-btn-icon"
                title="更新"
                disabled={research.loading}
              >
                <RefreshCw className={cn('w-3.5 h-3.5', research.loading && 'animate-spin')} />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn('n3-btn n3-btn-ghost n3-btn-icon', showFilters && 'bg-highlight')}
                title="フィルター"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
              <button className="n3-btn n3-btn-ghost n3-btn-icon" title="エクスポート">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="n3-btn n3-btn-ghost n3-btn-icon" title="設定">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* タブ */}
          <div className="flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-background text-foreground border-t border-l border-r border-panel-border'
                    : 'text-text-muted hover:text-foreground hover:bg-highlight'
                )}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={cn(
                    'px-1.5 py-0.5 rounded-full text-[9px]',
                    activeTab === tab.id
                      ? 'bg-accent text-white'
                      : 'bg-highlight text-text-muted'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 検索・フィルターバー */}
      <div className="px-4 py-2 border-b border-panel-border bg-panel">
        <div className="flex items-center gap-2">
          {/* 検索 */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="商品名、ASIN、eBay IDで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="n3-input pl-8 w-full"
            />
          </div>

          {/* クイックフィルター */}
          {activeTab === 'research' && (
            <div className="flex items-center gap-1">
              <select
                value={research.filters.source || ''}
                onChange={(e) => research.updateFilters({ source: e.target.value as any || undefined })}
                className="n3-input n3-input-xs w-24"
              >
                <option value="">全ソース</option>
                <option value="ebay_sold">eBay Sold</option>
                <option value="ebay_seller">eBay Seller</option>
                <option value="amazon">Amazon</option>
                <option value="yahoo_auction">Yahoo!</option>
                <option value="rakuten">楽天</option>
              </select>

              <select
                value={research.filters.status || ''}
                onChange={(e) => research.updateFilters({ status: e.target.value as any || undefined })}
                className="n3-input n3-input-xs w-24"
              >
                <option value="">全ステータス</option>
                <option value="new">新規</option>
                <option value="analyzing">分析中</option>
                <option value="approved">承認済</option>
                <option value="rejected">却下</option>
              </select>

              <select
                value={research.filters.risk_level || ''}
                onChange={(e) => research.updateFilters({ risk_level: e.target.value as any || undefined })}
                className="n3-input n3-input-xs w-24"
              >
                <option value="">全リスク</option>
                <option value="low">低リスク</option>
                <option value="medium">中リスク</option>
                <option value="high">高リスク</option>
              </select>
            </div>
          )}

          {/* 選択数表示 */}
          {research.selectedIds.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[10px] text-text-muted">
                {research.selectedIds.size}件選択
              </span>
              <button
                onClick={() => research.clearSelection()}
                className="n3-btn n3-btn-ghost n3-btn-xs"
              >
                クリア
              </button>
            </div>
          )}
        </div>

        {/* 詳細フィルター（展開時） */}
        {showFilters && (
          <div className="mt-2 pt-2 border-t border-panel-border grid grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-text-muted">最小利益率 (%)</label>
              <input
                type="number"
                placeholder="0"
                value={research.filters.min_profit_margin || ''}
                onChange={(e) => research.updateFilters({
                  min_profit_margin: e.target.value ? Number(e.target.value) : undefined
                })}
                className="n3-input n3-input-xs w-full mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted">最大利益率 (%)</label>
              <input
                type="number"
                placeholder="100"
                value={research.filters.max_profit_margin || ''}
                onChange={(e) => research.updateFilters({
                  max_profit_margin: e.target.value ? Number(e.target.value) : undefined
                })}
                className="n3-input n3-input-xs w-full mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted">最小スコア</label>
              <input
                type="number"
                placeholder="0"
                value={research.filters.min_score || ''}
                onChange={(e) => research.updateFilters({
                  min_score: e.target.value ? Number(e.target.value) : undefined
                })}
                className="n3-input n3-input-xs w-full mt-0.5"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  research.updateFilters({});
                  setSearchQuery('');
                }}
                className="n3-btn n3-btn-secondary n3-btn-xs w-full"
              >
                フィルターをリセット
              </button>
            </div>
          </div>
        )}
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        {research.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-xs">
            {research.error}
          </div>
        )}

        {/* タブコンテンツ */}
        {activeTab === 'research' && (
          <ResearchTable
            items={research.items}
            loading={research.loading}
            selectedIds={research.selectedIds}
            sort={research.sort}
            onToggleSelect={research.toggleSelect}
            onSelectAll={research.selectAll}
            onSort={research.updateSort}
            onUpdateItem={research.updateItem}
            showToast={showToast}
          />
        )}

        {activeTab === 'karitori' && (
          <KaritoriTable
            alerts={karitori.alerts}
            categories={karitori.categories}
            loading={karitori.loading}
            processing={karitori.processing}
            onLoadAlerts={karitori.loadAlerts}
            onLoadCategories={karitori.loadCategories}
            onAddCategory={karitori.addCategory}
            onDeleteCategory={karitori.removeCategory}
            onPurchaseDecision={karitori.handlePurchaseDecision}
            onStartWatching={karitori.startWatching}
            showToast={showToast}
          />
        )}

        {activeTab === 'supplier' && (
          <SupplierTable
            items={research.items.filter(i => i.status !== 'rejected')}
            loading={research.loading}
            onUpdateItem={research.updateItem}
            showToast={showToast}
          />
        )}

        {activeTab === 'approval' && (
          <ApprovalTable
            items={research.items.filter(i => i.status === 'new' || i.status === 'analyzing')}
            loading={research.loading}
            selectedIds={research.selectedIds}
            onToggleSelect={research.toggleSelect}
            onSelectAll={research.selectAll}
            onBulkUpdate={research.bulkUpdate}
            onUpdateItem={research.updateItem}
            showToast={showToast}
          />
        )}

        {/* ページネーション */}
        {activeTab === 'research' && research.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-[10px] text-text-muted">
              全{research.total}件中 {(research.page - 1) * research.pageSize + 1}-{Math.min(research.page * research.pageSize, research.total)}件を表示
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => research.setPage(Math.max(1, research.page - 1))}
                disabled={research.page === 1}
                className="n3-btn n3-btn-secondary n3-btn-xs"
              >
                前へ
              </button>
              <span className="text-xs px-2">
                {research.page} / {research.totalPages}
              </span>
              <button
                onClick={() => research.setPage(Math.min(research.totalPages, research.page + 1))}
                disabled={research.page === research.totalPages}
                className="n3-btn n3-btn-secondary n3-btn-xs"
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast通知 */}
      {toast && (
        <div className={cn(
          'fixed bottom-8 right-8 px-4 py-2 rounded-lg shadow-lg text-white z-50 text-xs',
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        )}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
