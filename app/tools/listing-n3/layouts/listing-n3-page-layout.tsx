// app/tools/listing-n3/layouts/listing-n3-page-layout.tsx
/**
 * Listing N3 ページレイアウト
 * 出品管理の統合レイアウト
 */

'use client';

import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import {
  Search,
  Target,
  DollarSign,
  Upload,
  Edit3,
  Layers,
  Filter,
  RefreshCw,
  ChevronDown,
  Package,
  ShoppingBag,
  Clock,
  FileText,
  Cog,
  Loader2,
} from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Input } from '@/components/n3/presentational/n3-input';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { N3Tabs } from '@/components/n3/container/n3-tabs';
import { N3FilterBar } from '@/components/n3/container/n3-filter-bar';
import { N3MarketplaceSelector } from '@/components/n3/container/n3-marketplace-selector';
import {
  SeoToolPanel,
  PricingToolPanel,
  BulkListingToolPanel,
  ListingEditorToolPanel,
  VariationsToolPanel,
} from '../components/l3-tabs';
import { useListingIntegrated } from '../hooks';
import type { ListingL3Tab, Marketplace, ListingItem } from '../types/listing';

// L3タブ設定
const L3_TABS: { id: ListingL3Tab | 'automation'; label: string; icon: React.ReactNode }[] = [
  { id: 'seo', label: 'SEO最適化', icon: <Target size={14} /> },
  { id: 'pricing', label: '価格戦略', icon: <DollarSign size={14} /> },
  { id: 'bulk', label: '一括出品', icon: <Upload size={14} /> },
  { id: 'editor', label: '出品エディタ', icon: <Edit3 size={14} /> },
  { id: 'variations', label: 'バリエーション', icon: <Layers size={14} /> },
  { id: 'automation', label: 'Automation', icon: <Cog size={14} /> },
];

// ============================================================
// Automation Panel Tab (Extension Slot)
// ============================================================

const AutomationPanelTab = memo(function AutomationPanelTab() {
  // Lazy load extension slot components
  const [AutoListingPanel, setAutoListingPanel] = useState<React.ComponentType | null>(null);
  const [QueueMonitorPanel, setQueueMonitorPanel] = useState<React.ComponentType | null>(null);
  const [ErrorRecoveryPanel, setErrorRecoveryPanel] = useState<React.ComponentType | null>(null);
  const [BatchExecutePanel, setBatchExecutePanel] = useState<React.ComponentType | null>(null);
  const [activePanel, setActivePanel] = useState<'auto' | 'queue' | 'error' | 'batch'>('auto');
  
  useEffect(() => {
    // Dynamic import for extension slot components
    import('../extension-slot/auto-listing-panel').then(m => setAutoListingPanel(() => m.AutoListingPanel));
    import('../extension-slot/queue-monitor-panel').then(m => setQueueMonitorPanel(() => m.QueueMonitorPanel));
    import('../extension-slot/error-recovery-panel').then(m => setErrorRecoveryPanel(() => m.ErrorRecoveryPanel));
    import('../extension-slot/batch-execute-panel').then(m => setBatchExecutePanel(() => m.BatchExecutePanel));
  }, []);
  
  const panels = [
    { id: 'auto' as const, label: 'Auto Listing', icon: <ShoppingBag size={14} />, color: '#3B82F6' },
    { id: 'queue' as const, label: 'Queue Monitor', icon: <Clock size={14} />, color: '#10B981' },
    { id: 'error' as const, label: 'Error Recovery', icon: <RefreshCw size={14} />, color: '#EF4444' },
    { id: 'batch' as const, label: 'Batch Execute', icon: <Package size={14} />, color: '#8B5CF6' },
  ];
  
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* 左サイドバー */}
      <div style={{ 
        width: 180, borderRight: '1px solid var(--panel-border)', 
        background: 'var(--panel)', padding: 12, display: 'flex', flexDirection: 'column' 
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Cog size={12} /> Automation Tools
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {panels.map(({ id, label, icon, color }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 6,
                background: activePanel === id ? `${color}15` : 'transparent',
                border: activePanel === id ? `1px solid ${color}40` : '1px solid transparent',
                color: activePanel === id ? color : 'var(--text-muted)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                fontSize: 11, fontWeight: 500,
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        
        <div style={{ marginTop: 'auto', padding: 8, background: 'var(--highlight)', borderRadius: 6 }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>💡 Dispatch API経由</div>
        </div>
      </div>
      
      {/* メインパネル */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activePanel === 'auto' && AutoListingPanel && <AutoListingPanel />}
        {activePanel === 'queue' && QueueMonitorPanel && <QueueMonitorPanel />}
        {activePanel === 'error' && ErrorRecoveryPanel && <ErrorRecoveryPanel />}
        {activePanel === 'batch' && BatchExecutePanel && <BatchExecutePanel />}
        
        {/* ローディング */}
        {!AutoListingPanel && !QueueMonitorPanel && !ErrorRecoveryPanel && !BatchExecutePanel && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        )}
      </div>
    </div>
  );
});

// 統計カード
const StatCard = memo(function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-lg, 12px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  );
});

export const ListingN3PageLayout = memo(function ListingN3PageLayout() {
  const {
    listings,
    stats,
    filters,
    setFilters,
    updateFilter,
    selectedIds,
    selectItem,
    handleSelectAll,
    clearSelection,
    updateListing,
    isLoading,
    refresh,
  } = useListingIntegrated();

  const [activeTab, setActiveTab] = useState<ListingL3Tab | 'automation'>('seo');
  const [searchValue, setSearchValue] = useState('');

  // 検索
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    updateFilter('search', value);
  }, [updateFilter]);

  // マーケットプレイス選択
  const handleMarketplaceChange = useCallback((marketplaces: Marketplace[]) => {
    updateFilter('marketplace', marketplaces.length > 0 ? marketplaces : undefined);
  }, [updateFilter]);

  // タブコンテンツ
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'seo':
        return (
          <SeoToolPanel
            listings={listings}
            selectedIds={selectedIds}
            onUpdate={updateListing}
          />
        );
      case 'pricing':
        return (
          <PricingToolPanel
            listings={listings}
            selectedIds={selectedIds}
            onUpdate={updateListing}
          />
        );
      case 'bulk':
        return <BulkListingToolPanel onComplete={refresh} />;
      case 'editor':
        return (
          <ListingEditorToolPanel
            listings={listings}
            selectedIds={selectedIds}
            onUpdate={updateListing}
            onDelete={() => {}}
          />
        );
      case 'variations':
        return (
          <VariationsToolPanel
            listings={listings}
            selectedIds={selectedIds}
            onUpdate={updateListing}
          />
        );
      case 'automation':
        return <AutomationPanelTab />;
      default:
        return null;
    }
  }, [activeTab, listings, selectedIds, updateListing, refresh]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--panel-border)',
          background: 'var(--panel)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-success))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                出品管理 (N3)
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                SEO最適化・価格戦略・一括出品の統合ツール
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <N3Button variant="secondary" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              更新
            </N3Button>
          </div>
        </div>

        {/* 統計カード */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <StatCard label="全出品" value={stats?.total || 0} icon={Package} color="var(--color-primary)" />
          <StatCard label="出品中" value={stats?.active || 0} icon={ShoppingBag} color="var(--color-success)" />
          <StatCard label="予約済み" value={stats?.scheduled || 0} icon={Clock} color="var(--color-warning)" />
          <StatCard label="下書き" value={stats?.draft || 0} icon={FileText} color="var(--text-muted)" />
          <StatCard label="平均SEOスコア" value={stats?.avgSeoScore || 0} icon={Target} color="var(--color-info)" />
        </div>

        {/* フィルター */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <N3Input
              value={searchValue}
              onChange={handleSearch}
              placeholder="SKU、タイトルで検索..."
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <N3MarketplaceSelector
            selected={(filters.marketplace as Marketplace[]) || []}
            onChange={handleMarketplaceChange}
            multiple
          />

          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <N3Badge variant="primary">
                {selectedIds.length}件選択中
              </N3Badge>
              <N3Button variant="ghost" size="xs" onClick={clearSelection}>
                選択解除
              </N3Button>
            </div>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左サイドバー - L3タブ */}
        <div
          style={{
            width: '200px',
            borderRight: '1px solid var(--panel-border)',
            background: 'var(--panel)',
            padding: '12px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', padding: '0 8px' }}>
            ツール
          </div>
          {L3_TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--style-radius-md, 8px)',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text)',
                marginBottom: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400 }}>
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {/* コンテンツエリア */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--bg)',
          }}
        >
          {renderTabContent}
        </div>
      </div>
    </div>
  );
});

export default ListingN3PageLayout;
