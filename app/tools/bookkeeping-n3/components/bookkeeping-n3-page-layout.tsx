// app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx
/**
 * N3 記帳オートメーション - ページレイアウト
 * 
 * editing-n3と同じアーキテクチャ:
 * - N3CollapsibleHeader (スクロールで縮小)
 * - L2タブ（取引マッパー / ルール管理 / MF連携 / 履歴）
 * - L3フィルター
 * - 2パネル構造
 */

'use client';

import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { 
  BookOpen, 
  FileText, 
  Link2, 
  History,
  Sparkles,
  Wrench,
  GitBranch,
  BarChart3,
  Filter,
  RefreshCw,
  Upload,
  Settings,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  N3FilterTab, 
  N3Pagination, 
  N3Footer, 
  N3CollapsibleHeader, 
  N3Divider,
  N3HeaderTab,
  N3PinButton,
  N3LanguageSwitch,
  N3WorldClock,
  N3CurrencyDisplay,
  N3NotificationBell,
  N3UserAvatar,
  N3HeaderSearchInput,
  N3ViewModeToggle,
  N3Tooltip,
} from '@/components/n3';
import { ErrorBoundary } from '@/components/error';
import { useBookkeepingData, useBookkeepingStore } from '../hooks';
import { TransactionListPanel } from './transaction-list-panel';
import { RuleBuilderPanel } from './rule-builder-panel';
import { RulesManagementPanel } from './rules-management-panel';

// ============================================================
// 型定義
// ============================================================

type L2TabId = 'mapper' | 'rules' | 'mf-sync' | 'history';
type PanelTabId = 'tools' | 'flow' | 'stats' | 'filter';
type TransactionFilterId = 'all' | 'pending' | 'simulated' | 'submitted' | 'ignored';

// ============================================================
// 定数
// ============================================================

const L2_TABS: { id: L2TabId; label: string; labelEn: string; icon: React.ElementType }[] = [
  { id: 'mapper', label: '取引マッパー', labelEn: 'Mapper', icon: BookOpen },
  { id: 'rules', label: 'ルール管理', labelEn: 'Rules', icon: FileText },
  { id: 'mf-sync', label: 'MF連携', labelEn: 'MF Sync', icon: Link2 },
  { id: 'history', label: '履歴', labelEn: 'History', icon: History },
];

const FILTER_TABS: { id: TransactionFilterId; label: string }[] = [
  { id: 'all', label: '全取引' },
  { id: 'pending', label: '未処理' },
  { id: 'simulated', label: 'ルール適用済' },
  { id: 'submitted', label: '記帳完了' },
  { id: 'ignored', label: '除外' },
];

const PANEL_TABS: { id: PanelTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'tools', label: 'ツール', icon: <Wrench size={14} /> },
  { id: 'flow', label: 'フロー', icon: <GitBranch size={14} /> },
  { id: 'stats', label: '統計', icon: <BarChart3 size={14} /> },
  { id: 'filter', label: 'フィルター', icon: <Filter size={14} /> },
];

const CLOCKS_CONFIG = [
  { label: "LA", tz: "America/Los_Angeles" },
  { label: "NY", tz: "America/New_York" },
  { label: "DE", tz: "Europe/Berlin" },
  { label: "JP", tz: "Asia/Tokyo" },
];

const HEADER_HEIGHT = 48;

// ============================================================
// サブコンポーネント
// ============================================================

const BookkeepingHeader = memo(function BookkeepingHeader({
  user,
  onLogout,
  language,
  onLanguageToggle,
  pinnedTab,
  onPinnedTabChange,
  hoveredTab,
  onHoveredTabChange,
  isHeaderHovered,
  onHeaderHoveredChange,
}: {
  user: any;
  onLogout: () => void;
  language: 'ja' | 'en';
  onLanguageToggle: () => void;
  pinnedTab: PanelTabId | null;
  onPinnedTabChange: (tab: PanelTabId | null) => void;
  hoveredTab: PanelTabId | null;
  onHoveredTabChange: (tab: PanelTabId | null) => void;
  isHeaderHovered: boolean;
  onHeaderHoveredChange: (hovered: boolean) => void;
}) {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isPinned = pinnedTab !== null;
  const activeTab = pinnedTab || hoveredTab;

  useEffect(() => {
    const update = () => {
      const t: Record<string, string> = {};
      CLOCKS_CONFIG.forEach(c => { 
        t[c.label] = new Date().toLocaleTimeString("en-US", { 
          timeZone: c.tz, hour: "2-digit", minute: "2-digit", hour12: false 
        }); 
      });
      setTimes(t);
    };
    update();
    const i = setInterval(update, 30000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimeoutRef.current) { clearTimeout(leaveTimeoutRef.current); leaveTimeoutRef.current = null; }
    onHeaderHoveredChange(true);
  }, [onHeaderHoveredChange]);

  const handleMouseLeave = useCallback(() => {
    if (pinnedTab) return;
    leaveTimeoutRef.current = setTimeout(() => { onHoveredTabChange(null); onHeaderHoveredChange(false); }, 150);
  }, [pinnedTab, onHoveredTabChange, onHeaderHoveredChange]);

  const handleTabMouseEnter = useCallback((tabId: PanelTabId) => {
    if (leaveTimeoutRef.current) { clearTimeout(leaveTimeoutRef.current); leaveTimeoutRef.current = null; }
    if (!pinnedTab) onHoveredTabChange(tabId);
    onHeaderHoveredChange(true);
  }, [pinnedTab, onHoveredTabChange, onHeaderHoveredChange]);

  const handleTabClick = useCallback((tabId: PanelTabId) => {
    if (pinnedTab === tabId) { onPinnedTabChange(null); onHoveredTabChange(null); onHeaderHoveredChange(false); }
    else { onPinnedTabChange(tabId); onHoveredTabChange(null); }
  }, [pinnedTab, onPinnedTabChange, onHoveredTabChange, onHeaderHoveredChange]);

  const handlePinToggle = useCallback(() => {
    if (pinnedTab) { onPinnedTabChange(null); onHoveredTabChange(null); onHeaderHoveredChange(false); }
    else if (hoveredTab) { onPinnedTabChange(hoveredTab); onHoveredTabChange(null); }
  }, [pinnedTab, hoveredTab, onPinnedTabChange, onHoveredTabChange, onHeaderHoveredChange]);

  const clocksData = CLOCKS_CONFIG.map(c => ({ label: c.label, time: times[c.label] || '--:--' }));

  return (
    <header 
      style={{ 
        height: HEADER_HEIGHT, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        background: 'var(--glass)', 
        backdropFilter: 'blur(12px)', 
        borderBottom: '1px solid var(--glass-border)', 
        padding: '0 12px', 
        flexShrink: 0 
      }} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {/* 左: パネルタブ */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0 }}>
        <N3PinButton pinned={isPinned} onClick={handlePinToggle} />
        {PANEL_TABS.map((tab) => (
          <N3HeaderTab 
            key={tab.id} 
            id={tab.id} 
            label={tab.label} 
            icon={tab.icon} 
            active={activeTab === tab.id} 
            pinned={pinnedTab === tab.id} 
            onMouseEnter={() => handleTabMouseEnter(tab.id)} 
            onClick={() => handleTabClick(tab.id)} 
          />
        ))}
      </div>
      
      {/* 中央: 検索 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <N3HeaderSearchInput placeholder="Search..." shortcut="⌘K" width={240} />
      </div>
      
      {/* 右: ユーティリティ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* ルールシートリンク */}
        <a
          href="https://docs.google.com/spreadsheets/d/14c0kwE-jhrMkqhRe96XcR78Y5XOQH0o7qsJfRBcmM80/edit?gid=1127843525#gid=1127843525"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            fontSize: 11,
            fontWeight: 500,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 6,
            color: 'var(--text)',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          <FileText size={14} />
          <span>ルールシート</span>
          <ExternalLink size={10} style={{ opacity: 0.6 }} />
        </a>
        
        {/* MFクラウドリンク */}
        <a
          href="https://biz.moneyforward.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            fontSize: 11,
            fontWeight: 500,
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.25))',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 6,
            color: 'var(--text)',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          <Database size={14} />
          <span>MFクラウド</span>
          <ExternalLink size={10} style={{ opacity: 0.6 }} />
        </a>
        
        <N3Divider orientation="vertical" />
        <N3LanguageSwitch language={language} onToggle={onLanguageToggle} />
        <N3Divider orientation="vertical" />
        <N3WorldClock clocks={clocksData} />
        <N3Divider orientation="vertical" />
        <N3CurrencyDisplay value={149.50} trend="up" />
        <N3Divider orientation="vertical" />
        
        <div className="relative" ref={userMenuRef}>
          <N3UserAvatar name={user?.username || 'User'} onClick={() => setShowUserMenu(!showUserMenu)} />
          {showUserMenu && (
            <div className="n3-dropdown" style={{ width: 180 }}>
              <div 
                className="n3-dropdown-item" 
                onClick={() => { setShowUserMenu(false); onLogout(); }}
              >
                Sign out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

const BookkeepingSubToolbar = memo(function BookkeepingSubToolbar({
  pageSize,
  onPageSizeChange,
  displayCount,
  totalCount,
  onRefresh,
  onSync,
  loading,
}: {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  displayCount: number;
  totalCount: number;
  onRefresh: () => void;
  onSync: () => void;
  loading: boolean;
}) {
  return (
    <div style={{ 
      height: 44, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      background: 'var(--panel)', 
      borderBottom: '1px solid var(--panel-border)', 
      padding: '0 12px', 
      flexShrink: 0 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <N3Tooltip content="データ更新">
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              padding: '4px 8px', 
              fontSize: '11px',
              background: 'transparent',
              border: '1px solid var(--panel-border)',
              borderRadius: '4px', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>更新</span>
          </button>
        </N3Tooltip>
        
        <button
          onClick={onSync}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            padding: '4px 8px', 
            fontSize: '11px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '4px', 
            color: 'rgb(59, 130, 246)', 
            cursor: 'pointer',
          }}
        >
          <Upload size={12} />
          <span>MF同期</span>
        </button>
        
        <N3Divider orientation="vertical" style={{ height: 20 }} />
        
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ 
            height: 28, 
            padding: '0 8px', 
            fontSize: '11px', 
            border: '1px solid var(--panel-border)', 
            borderRadius: '4px', 
            background: 'var(--panel)', 
            color: 'var(--text)' 
          }}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {displayCount}/{totalCount}件
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            padding: '4px 8px', 
            fontSize: '11px',
            background: 'transparent',
            border: '1px solid var(--panel-border)',
            borderRadius: '4px', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
          }}
        >
          <Settings size={12} />
          <span>設定</span>
        </button>
      </div>
    </div>
  );
});

// ============================================================
// ツールパネルコンテンツ
// ============================================================

const ToolsPanelContent = memo(function ToolsPanelContent({
  transactionStats,
  rulesCount,
  onApplyRules,
  isApplying,
}: {
  transactionStats: { pending: number; simulated: number; submitted: number; ignored: number; total: number };
  rulesCount: number;
  onApplyRules: () => void;
  isApplying: boolean;
}) {
  return (
    <div style={{ padding: 12 }}>
      {/* 統計 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
          取引統計
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { label: '未処理', value: transactionStats.pending, color: 'var(--warning)' },
            { label: '適用済', value: transactionStats.simulated, color: 'var(--accent)' },
            { label: '完了', value: transactionStats.submitted, color: 'var(--success)' },
            { label: '除外', value: transactionStats.ignored, color: 'var(--text-muted)' },
          ].map((stat) => (
            <div 
              key={stat.label}
              style={{ 
                padding: 8, 
                background: 'var(--highlight)', 
                borderRadius: 6, 
                textAlign: 'center' 
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* アクション */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
          一括操作
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onApplyRules}
            disabled={isApplying || transactionStats.pending === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 500,
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: transactionStats.pending === 0 ? 'not-allowed' : 'pointer',
              opacity: transactionStats.pending === 0 ? 0.5 : 1,
            }}
          >
            <Sparkles size={14} />
            <span>{isApplying ? '適用中...' : `全ルール適用 (${rulesCount}ルール)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export function BookkeepingN3PageLayout() {
  const { user, logout } = useAuth();
  
  // UI状態
  const [pinnedTab, setPinnedTab] = useState<PanelTabId | null>(null);
  const [hoveredTab, setHoveredTab] = useState<PanelTabId | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [activeL2Tab, setActiveL2Tab] = useState<L2TabId>('mapper');
  const [activeFilter, setActiveFilter] = useState<TransactionFilterId>('pending');
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [pageSize, setPageSize] = useState(50);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  const isPinned = pinnedTab !== null;
  
  // データフック
  const {
    transactions,
    transactionsLoading,
    transactionsError,
    transactionStats,
    rules,
    selectedTransaction,
    draftRule,
    extractedKeywords,
    suggestedAccounts,
    aiLoading,
    isCreatingRule,
    isApplyingRules,
    filter,
    loadTransactions,
    loadRules,
    saveRule,
    applyRulesToPendingTransactions,
    selectTransaction,
    setFilter,
    updateDraftRule,
    selectKeyword,
    selectAccount,
    cancelCreatingRule,
    fetchAISuggestions,
  } = useBookkeepingData();
  
  const { openMFSyncModal } = useBookkeepingStore();
  
  // フィルター変更
  const handleFilterChange = useCallback((filterId: TransactionFilterId) => {
    setActiveFilter(filterId);
    setFilter({ status: filterId === 'all' ? 'all' : filterId });
  }, [setFilter]);
  
  // パネルコンテンツ取得
  const getPanelContent = (tabId: PanelTabId | null) => {
    if (tabId === 'tools') {
      return (
        <ToolsPanelContent
          transactionStats={transactionStats}
          rulesCount={rules.length}
          onApplyRules={applyRulesToPendingTransactions}
          isApplying={isApplyingRules}
        />
      );
    }
    if (tabId === 'stats') {
      return (
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>統計パネル（開発中）</div>
        </div>
      );
    }
    return null;
  };
  
  const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;
  
  // 🔥 v3: height: 100% に変更（workspaceからの埋め込み時に親要素に従う）
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div 
        ref={mainContentRef} 
        id="main-scroll-container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          height: '100%', 
          minWidth: 0, 
          overflow: 'auto' 
        }}
      >
        <N3CollapsibleHeader scrollContainerId="main-scroll-container" threshold={10} transitionDuration={200} zIndex={40}>
          {/* ヘッダー */}
          <BookkeepingHeader
            user={user}
            onLogout={logout}
            language={language}
            onLanguageToggle={() => setLanguage(l => l === 'ja' ? 'en' : 'ja')}
            pinnedTab={pinnedTab}
            onPinnedTabChange={setPinnedTab}
            hoveredTab={hoveredTab}
            onHoveredTabChange={setHoveredTab}
            isHeaderHovered={isHeaderHovered}
            onHeaderHoveredChange={setIsHeaderHovered}
          />
          
          {/* ホバーパネル */}
          {showHoverPanel && (
            <div style={{ 
              position: 'absolute', 
              top: HEADER_HEIGHT, 
              left: 0, 
              right: 0, 
              padding: 6, 
              zIndex: 100, 
              maxHeight: '60vh', 
              overflowY: 'auto',
              background: 'var(--panel)',
              borderBottom: '1px solid var(--panel-border)',
            }}>
              {getPanelContent(hoveredTab)}
            </div>
          )}
          
          {/* ピン固定パネル */}
          {isPinned && (
            <div style={{ flexShrink: 0, padding: 6, background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)' }}>
              {getPanelContent(pinnedTab)}
            </div>
          )}

          {/* L2タブ */}
          <div style={{ 
            height: 36, 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--panel)', 
            borderBottom: '1px solid var(--panel-border)', 
            padding: '0 12px', 
            flexShrink: 0 
          }}>
            {L2_TABS.map((tab) => { 
              const Icon = tab.icon; 
              return (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveL2Tab(tab.id)} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 4, 
                    padding: '6px 12px', 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    background: activeL2Tab === tab.id ? 'var(--accent)' : 'transparent', 
                    color: activeL2Tab === tab.id ? 'white' : 'var(--text-muted)', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  <Icon size={14} />
                  <span>{language === 'ja' ? tab.label : tab.labelEn}</span>
                </button>
              ); 
            })}
          </div>

          {/* L3フィルター */}
          {activeL2Tab === 'mapper' && (
            <div style={{ 
              height: 36, 
              display: 'flex', 
              alignItems: 'center', 
              background: 'var(--highlight)', 
              borderBottom: '1px solid var(--panel-border)', 
              padding: '0 12px', 
              flexShrink: 0, 
              overflowX: 'auto' 
            }}>
              {FILTER_TABS.map(tab => (
                <N3FilterTab 
                  key={tab.id} 
                  id={tab.id} 
                  label={tab.label} 
                  count={
                    tab.id === 'all' ? transactionStats.total :
                    tab.id === 'pending' ? transactionStats.pending :
                    tab.id === 'simulated' ? transactionStats.simulated :
                    tab.id === 'submitted' ? transactionStats.submitted :
                    transactionStats.ignored
                  } 
                  active={activeFilter === tab.id} 
                  onClick={() => handleFilterChange(tab.id)} 
                />
              ))}
            </div>
          )}

          {/* サブツールバー */}
          <BookkeepingSubToolbar
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            displayCount={transactions.length}
            totalCount={transactionStats.total}
            onRefresh={loadTransactions}
            onSync={() => openMFSyncModal()}
            loading={transactionsLoading}
          />
        </N3CollapsibleHeader>

        {/* メインコンテンツ */}
        <ErrorBoundary componentName="BookkeepingMainContent">
          <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {activeL2Tab === 'mapper' && (
              <>
                {/* 左パネル: 取引リスト */}
                <div style={{ width: 420, flexShrink: 0 }}>
                  <TransactionListPanel
                    transactions={transactions}
                    loading={transactionsLoading}
                    error={transactionsError}
                    selectedId={selectedTransaction?.id || null}
                    filter={filter}
                    stats={transactionStats}
                    onSelect={selectTransaction}
                    onFilterChange={setFilter}
                    onRefresh={loadTransactions}
                    onSync={() => openMFSyncModal()}
                  />
                </div>
                
                {/* 右パネル: ルール作成 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <RuleBuilderPanel
                    transaction={selectedTransaction}
                    draftRule={draftRule}
                    extractedKeywords={extractedKeywords}
                    suggestedAccounts={suggestedAccounts}
                    aiLoading={aiLoading}
                    isCreatingRule={isCreatingRule}
                    onUpdateDraft={updateDraftRule}
                    onSelectKeyword={selectKeyword}
                    onSelectAccount={selectAccount}
                    onSave={saveRule}
                    onCancel={cancelCreatingRule}
                    onRequestAI={() => {
                      if (selectedTransaction?.raw_memo) {
                        fetchAISuggestions(selectedTransaction.raw_memo);
                      }
                    }}
                  />
                </div>
              </>
            )}
            
            {activeL2Tab === 'rules' && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <RulesManagementPanel />
              </div>
            )}
            
            {activeL2Tab === 'mf-sync' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <div style={{ textAlign: 'center' }}>
                  <Link2 size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <div style={{ fontSize: 14, marginBottom: 8 }}>MFクラウド連携</div>
                  <div style={{ fontSize: 12 }}>API連携設定・同期履歴</div>
                </div>
              </div>
            )}
            
            {activeL2Tab === 'history' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <div style={{ textAlign: 'center' }}>
                  <History size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <div style={{ fontSize: 14, marginBottom: 8 }}>履歴</div>
                  <div style={{ fontSize: 12 }}>操作ログ・変更履歴</div>
                </div>
              </div>
            )}
          </main>
        </ErrorBoundary>

        {/* フッター */}
        <N3Footer 
          copyright="© 2025 N3 Platform" 
          version="Bookkeeping v1.0.0" 
          status={{ label: 'DB', connected: !transactionsError }} 
          links={[{ id: 'mf', label: 'MFクラウド', href: 'https://biz.moneyforward.com/' }]} 
        />
      </div>
    </div>
  );
}
