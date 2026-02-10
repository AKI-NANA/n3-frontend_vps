// app/tools/control-n3/components/header/control-n3-page-header.tsx
/**
 * Control N3 ページヘッダー
 * - editing-n3のN3PageHeaderをベースに
 * - Control専用のパネルタブを持つ
 */
'use client';

import React, { memo } from 'react';
import { 
  Activity, Settings, RefreshCw, Bell, BellOff,
  Play, Pause, AlertTriangle, CheckCircle
} from 'lucide-react';
import { 
  N3LanguageSwitch, N3WorldClock, N3CurrencyDisplay, 
  N3UserAvatar, N3PinButton, N3Divider 
} from '@/components/n3';

// ============================================================================
// 型定義
// ============================================================================
export type ControlPanelTabId = 'monitor' | 'bots' | 'stats' | 'settings';

export interface ControlN3PageHeaderProps {
  // ユーザー情報
  user: any;
  onLogout: () => void;
  
  // 言語
  language: 'ja' | 'en';
  onLanguageToggle: () => void;
  
  // パネル制御
  pinnedTab: ControlPanelTabId | null;
  onPinnedTabChange: (tab: ControlPanelTabId | null) => void;
  hoveredTab: ControlPanelTabId | null;
  onHoveredTabChange: (tab: ControlPanelTabId | null) => void;
  isHeaderHovered: boolean;
  onHeaderHoveredChange: (hovered: boolean) => void;
  
  // 自動更新
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
  onManualRefresh: () => void;
  lastUpdated: Date | null;
  
  // 統計サマリー
  healthyCount?: number;
  warningCount?: number;
  errorCount?: number;
}

// ============================================================================
// パネルタブ定義
// ============================================================================
const PANEL_TABS: { id: ControlPanelTabId; icon: React.ReactNode; label: string }[] = [
  { id: 'monitor', icon: <Activity size={14} />, label: 'Monitor' },
  { id: 'bots', icon: <Play size={14} />, label: 'Bots' },
  { id: 'stats', icon: <AlertTriangle size={14} />, label: 'Stats' },
  { id: 'settings', icon: <Settings size={14} />, label: 'Settings' },
];

// ============================================================================
// ヘッダー高さ
// ============================================================================
export const HEADER_HEIGHT = 52;

// ============================================================================
// メインコンポーネント
// ============================================================================
export const ControlN3PageHeader = memo(function ControlN3PageHeader({
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
  autoRefresh,
  onAutoRefreshToggle,
  onManualRefresh,
  lastUpdated,
  healthyCount = 0,
  warningCount = 0,
  errorCount = 0,
}: ControlN3PageHeaderProps) {
  
  return (
    <header 
      className="n3-page-header"
      style={{ 
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
        flexShrink: 0,
      }}
      onMouseEnter={() => onHeaderHoveredChange(true)}
      onMouseLeave={() => onHeaderHoveredChange(false)}
    >
      {/* 左側: ロゴ + パネルタブ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* ロゴ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={20} style={{ color: 'var(--accent)' }} />
          <span style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            color: 'var(--text)',
          }}>
            Control
          </span>
        </div>

        <N3Divider orientation="vertical" style={{ height: 24 }} />

        {/* パネルタブ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {PANEL_TABS.map(tab => {
            const isPinned = pinnedTab === tab.id;
            const isHovered = hoveredTab === tab.id;
            const isActive = isPinned || isHovered;
            
            return (
              <div key={tab.id} style={{ position: 'relative' }}>
                <button
                  onClick={() => onPinnedTabChange(isPinned ? null : tab.id)}
                  onMouseEnter={() => !pinnedTab && onHoveredTabChange(tab.id)}
                  onMouseLeave={() => !pinnedTab && onHoveredTabChange(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 500,
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
                {isPinned && <N3PinButton isPinned onToggle={() => onPinnedTabChange(null)} />}
              </div>
            );
          })}
        </div>

        <N3Divider orientation="vertical" style={{ height: 24 }} />

        {/* ステータスサマリー */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 8, height: 8, borderRadius: '50%', 
              background: '#10b981' 
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{healthyCount}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 8, height: 8, borderRadius: '50%', 
              background: '#f59e0b' 
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{warningCount}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 8, height: 8, borderRadius: '50%', 
              background: '#ef4444' 
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{errorCount}</span>
          </div>
        </div>
      </div>

      {/* 右側: 更新制御 + ユーティリティ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* 最終更新時刻 */}
        {lastUpdated && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            更新: {lastUpdated.toLocaleTimeString('ja-JP')}
          </span>
        )}

        {/* 自動更新トグル */}
        <button
          onClick={onAutoRefreshToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            background: autoRefresh ? 'rgba(16, 185, 129, 0.2)' : 'var(--panel-alt)',
            color: autoRefresh ? '#10b981' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
          title={autoRefresh ? '自動更新ON (30秒)' : '自動更新OFF'}
        >
          {autoRefresh ? <Bell size={16} /> : <BellOff size={16} />}
        </button>

        {/* 手動更新 */}
        <button
          onClick={onManualRefresh}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            background: 'var(--panel-alt)',
            color: 'var(--text-muted)',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
          title="手動更新"
        >
          <RefreshCw size={16} />
        </button>

        <N3Divider orientation="vertical" style={{ height: 24 }} />

        {/* 言語切り替え */}
        <N3LanguageSwitch language={language} onToggle={onLanguageToggle} />
        
        {/* 世界時計 */}
        <N3WorldClock />
        
        {/* 通貨表示 */}
        <N3CurrencyDisplay />

        <N3Divider orientation="vertical" style={{ height: 24 }} />

        {/* ユーザーアバター */}
        <N3UserAvatar user={user} onLogout={onLogout} />
      </div>
    </header>
  );
});
