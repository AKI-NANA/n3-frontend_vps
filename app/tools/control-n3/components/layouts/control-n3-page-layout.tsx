// app/tools/control-n3/components/layouts/control-n3-page-layout.tsx
/**
 * Control N3 ページレイアウト
 * - editing-n3のEditingN3PageLayoutをベースに
 * - L2タブ：Monitor / Bots / Audit / Jobs
 */
'use client';

import React, { useState, useCallback, memo } from 'react';
import { Activity, Play, History, Clock, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/error';

// N3コンポーネント
import { N3FilterTab, N3Pagination, N3Footer, N3CollapsibleHeader, N3Divider } from '@/components/n3';

// Control N3 コンポーネント
import { ControlN3PageHeader, HEADER_HEIGHT } from '../header';
import type { ControlPanelTabId } from '../header';
import { WorkflowMonitorView } from '../views';
import { IssueDetailModal } from '../panels/issue-detail-modal';

// フック
import { useControlData } from '../../hooks';
import type { AuditIssue } from '../../hooks';

// ============================================================================
// L2タブ定義
// ============================================================================
type L2TabId = 'monitor' | 'bots' | 'audit' | 'jobs';

const L2_TABS: { id: L2TabId; label: string; labelEn: string; icon: React.ElementType }[] = [
  { id: 'monitor', label: 'ワークフロー監視', labelEn: 'Workflow', icon: Activity },
  { id: 'bots', label: 'Bot管理', labelEn: 'Bots', icon: Play },
  { id: 'audit', label: '監査ログ', labelEn: 'Audit', icon: History },
  { id: 'jobs', label: 'ジョブキュー', labelEn: 'Jobs', icon: Clock },
];

// ============================================================================
// パネルコンテンツ
// ============================================================================
const MonitorPanelContent = memo(function MonitorPanelContent({ stats }: { stats: any }) {
  if (!stats) return null;
  
  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
        システム統計
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div style={{ 
          padding: 12, 
          background: 'var(--panel-alt)', 
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>本日の監査</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
            {stats.total_audits_today.toLocaleString()}
          </div>
        </div>
        <div style={{ 
          padding: 12, 
          background: 'var(--panel-alt)', 
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>成功率</div>
          <div style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: stats.pass_rate_today >= 90 ? '#10b981' :
                   stats.pass_rate_today >= 70 ? '#f59e0b' : '#ef4444',
          }}>
            {stats.pass_rate_today.toFixed(1)}%
          </div>
        </div>
        <div style={{ 
          padding: 12, 
          background: 'var(--panel-alt)', 
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>LLMキャッシュ</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#8b5cf6' }}>
            {stats.llm_cache_hit_rate.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
});

const BotsPanelContent = memo(function BotsPanelContent() {
  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
        Bot制御
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
        Bot ON/OFF機能は次のバージョンで実装予定です。
      </div>
    </div>
  );
});

const StatsPanelContent = memo(function StatsPanelContent({ stats }: { stats: any }) {
  if (!stats) return null;
  
  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
        ワークフロー状態
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>正常稼働</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>{stats.healthy_count}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>警告あり</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>{stats.warning_count}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>エラー発生</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#ef4444' }}>{stats.error_count}</span>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// メインレイアウト
// ============================================================================
export function ControlN3PageLayout() {
  const { user, logout } = useAuth();
  
  // UI状態
  const [pinnedTab, setPinnedTab] = useState<ControlPanelTabId | null>(null);
  const [hoveredTab, setHoveredTab] = useState<ControlPanelTabId | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [activeL2Tab, setActiveL2Tab] = useState<L2TabId>('monitor');
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  
  // フィルター状態
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // モーダル状態
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);
  
  // データフック
  const {
    stats,
    workflows,
    issues,
    loading,
    error,
    lastUpdated,
    autoRefresh,
    setAutoRefresh,
    refresh,
  } = useControlData();
  
  const isPinned = pinnedTab !== null;
  const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;
  
  // パネルコンテンツ取得
  const getPanelContent = useCallback((tabId: ControlPanelTabId | null) => {
    switch (tabId) {
      case 'monitor': return <MonitorPanelContent stats={stats} />;
      case 'bots': return <BotsPanelContent />;
      case 'stats': return <StatsPanelContent stats={stats} />;
      case 'settings': return (
        <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 12 }}>
          設定パネル（実装予定）
        </div>
      );
      default: return null;
    }
  }, [stats]);
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh', 
      overflow: 'hidden', 
      background: 'var(--bg)',
    }}>
      {/* コラプシブルヘッダー */}
      <N3CollapsibleHeader 
        scrollContainerId="control-main-content" 
        threshold={10} 
        transitionDuration={200}
        zIndex={40}
      >
        {/* ページヘッダー */}
        <ControlN3PageHeader
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
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
          onManualRefresh={refresh}
          lastUpdated={lastUpdated}
          healthyCount={stats?.healthy_count}
          warningCount={stats?.warning_count}
          errorCount={stats?.error_count}
        />
        
        {/* ホバーパネル */}
        {showHoverPanel && (
          <div style={{
            position: 'absolute',
            top: HEADER_HEIGHT,
            left: 0,
            right: 0,
            padding: 6,
            zIndex: 60,
            maxHeight: '60vh',
            overflowY: 'auto',
            background: 'var(--panel)',
            borderBottom: '1px solid var(--panel-border)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            {getPanelContent(hoveredTab)}
          </div>
        )}
        
        {/* ピン留めパネル */}
        {isPinned && (
          <div style={{ flexShrink: 0, padding: 6 }}>
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
          flexShrink: 0,
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
                  gap: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                  background: activeL2Tab === tab.id ? 'var(--accent)' : 'transparent',
                  color: activeL2Tab === tab.id ? 'white' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                <span>{language === 'ja' ? tab.label : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </N3CollapsibleHeader>

      {/* メインコンテンツ */}
      <ErrorBoundary componentName="ControlN3MainContent">
        <div 
          id="control-main-content"
          style={{ 
            flex: 1, 
            overflow: 'auto',
            padding: 16,
          }}
        >
          {activeL2Tab === 'monitor' && (
            <WorkflowMonitorView
              workflows={workflows}
              issues={issues}
              loading={loading}
              error={error}
              filterStatus={filterStatus}
              filterCategory={filterCategory}
              searchQuery={searchQuery}
              onFilterStatusChange={setFilterStatus}
              onFilterCategoryChange={setFilterCategory}
              onSearchQueryChange={setSearchQuery}
              onViewIssueDetails={setSelectedIssue}
            />
          )}
          
          {activeL2Tab === 'bots' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: 300,
              color: 'var(--text-muted)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <Play size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <div>Bot管理機能は次のバージョンで実装予定です</div>
              </div>
            </div>
          )}
          
          {activeL2Tab === 'audit' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: 300,
              color: 'var(--text-muted)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <History size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <div>監査ログビューは次のバージョンで実装予定です</div>
              </div>
            </div>
          )}
          
          {activeL2Tab === 'jobs' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: 300,
              color: 'var(--text-muted)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <Clock size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <div>ジョブキュービューは次のバージョンで実装予定です</div>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>

      {/* フッター */}
      <N3Footer 
        copyright="© 2025 N3 Platform" 
        version="v3.0.0 (Control)" 
        status={{ label: 'n8n', connected: !error }}
        links={[{ id: 'docs', label: 'ドキュメント', href: '#' }]}
      />

      {/* 問題詳細モーダル */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
