// app/tools/editing-n3/components/header/n3-page-header.tsx
/**
 * N3PageHeader - ページヘッダーコンポーネント
 * 
 * 責務:
 * - パネルタブ（ツール/フロー/統計/フィルター）
 * - 検索バー
 * - 言語切替/時計/通貨/テーマ切替
 * - 通知/ユーザーメニュー
 */

'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { User, LogOut, Settings, HelpCircle, Wrench, GitBranch, BarChart3, Filter, Palette, Package, ExternalLink, Database, FileSpreadsheet, RefreshCw, Upload, Download, Send } from 'lucide-react';
import {
  N3HeaderTab, N3PinButton, N3LanguageSwitch, N3WorldClock, N3CurrencyDisplay,
  N3NotificationBell, N3UserAvatar, N3Divider, N3HeaderSearchInput,
} from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

export type PanelTabId = 'tools' | 'flow' | 'stats' | 'filter';

export interface N3PageHeaderProps {
  user: { username?: string; email?: string } | null;
  onLogout: () => void;
  language: 'ja' | 'en';
  onLanguageToggle: () => void;
  pinnedTab: PanelTabId | null;
  onPinnedTabChange: (tab: PanelTabId | null) => void;
  hoveredTab: PanelTabId | null;
  onHoveredTabChange: (tab: PanelTabId | null) => void;
  isHeaderHovered: boolean;
  onHeaderHoveredChange: (hovered: boolean) => void;
  // 今すぐ出品ボタン用props
  selectedCount?: number;
  onListNow?: () => void;
  isListing?: boolean;
}

// ============================================================
// 定数
// ============================================================

const PANEL_TABS: { id: PanelTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'tools', label: 'ツール', icon: <Wrench size={14} /> },
  { id: 'flow', label: 'フロー', icon: <GitBranch size={14} /> },
  { id: 'stats', label: '統計', icon: <BarChart3 size={14} /> },
  { id: 'filter', label: 'マーケットプレイス', icon: <Filter size={14} /> },
];

const CLOCKS_CONFIG = [
  { label: "LA", tz: "America/Los_Angeles" },
  { label: "NY", tz: "America/New_York" },
  { label: "DE", tz: "Europe/Berlin" },
  { label: "JP", tz: "Asia/Tokyo" },
];

export const HEADER_HEIGHT = 48;

// ============================================================
// メインコンポーネント
// ============================================================

export const N3PageHeader = memo(function N3PageHeader({
  user, onLogout, language, onLanguageToggle,
  pinnedTab, onPinnedTabChange, hoveredTab, onHoveredTabChange,
  isHeaderHovered, onHeaderHoveredChange,
  selectedCount = 0, onListNow, isListing = false,
}: N3PageHeaderProps) {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentColorTheme, setCurrentColorTheme] = useState<'dawn' | 'light' | 'dark' | 'cyber'>('dawn');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isPinned = pinnedTab !== null;
  const activeTab = pinnedTab || hoveredTab;

  useEffect(() => {
    const theme = localStorage.getItem('n3-color-theme') as 'dawn' | 'light' | 'dark' | 'cyber' || 'dawn';
    setCurrentColorTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    const update = () => {
      const t: Record<string, string> = {};
      CLOCKS_CONFIG.forEach(c => { t[c.label] = new Date().toLocaleTimeString("en-US", { timeZone: c.tz, hour: "2-digit", minute: "2-digit", hour12: false }); });
      setTimes(t);
    };
    update();
    const i = setInterval(update, 30000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { return () => { if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current); }; }, []);

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

  const handleThemeToggle = useCallback(() => {
    const ts: ('dawn' | 'light' | 'dark' | 'cyber')[] = ['dawn', 'light', 'dark', 'cyber'];
    const n = ts[(ts.indexOf(currentColorTheme) + 1) % ts.length];
    setCurrentColorTheme(n);
    document.documentElement.setAttribute('data-theme', n);
    localStorage.setItem('n3-color-theme', n);
  }, [currentColorTheme]);

  const clocksData = CLOCKS_CONFIG.map(c => ({ label: c.label, time: times[c.label] || '--:--' }));

  return (
    <header style={{ height: HEADER_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--glass-border)', padding: '0 12px', flexShrink: 0 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0 }}>
        <N3PinButton pinned={isPinned} onClick={handlePinToggle} />
        {PANEL_TABS.map((tab) => <N3HeaderTab key={tab.id} id={tab.id} label={tab.label} icon={tab.icon} active={activeTab === tab.id} pinned={pinnedTab === tab.id} onMouseEnter={() => handleTabMouseEnter(tab.id)} onClick={() => handleTabClick(tab.id)} />)}
        
        {/* 今すぐ出品ボタン */}
        {onListNow && (
          <>
            <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />
            <button
              onClick={onListNow}
              disabled={selectedCount === 0 || isListing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: selectedCount > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--panel-border)',
                background: selectedCount > 0
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)'
                  : 'var(--panel)',
                color: selectedCount > 0 ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
                cursor: selectedCount > 0 && !isListing ? 'pointer' : 'not-allowed',
                opacity: selectedCount === 0 ? 0.5 : 1,
                transition: 'all 0.2s ease',
                ...(selectedCount > 0 && !isListing && {
                  ':hover': {
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
                  }
                }),
              }}
              onMouseEnter={(e) => {
                if (selectedCount > 0 && !isListing) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCount > 0 && !isListing) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <Send size={12} />
              <span>
                {isListing ? '出品中...' : `今すぐ出品 (${selectedCount})`}
              </span>
            </button>
          </>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><N3HeaderSearchInput placeholder="Search..." shortcut="⌘K" width={240} /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* スプレッドシートリンク */}
        <a
          href="https://docs.google.com/spreadsheets/d/1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM/edit"
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
            transition: 'all 0.2s ease',
          }}
          className="hover:opacity-80"
          title="棚卸しスプレッドシート（新しいタブで開く）"
        >
          <FileSpreadsheet size={14} />
          <span>シート</span>
          <ExternalLink size={10} style={{ opacity: 0.6 }} />
        </a>
        {/* Supabaseダッシュボードリンク */}
        <a
          href="https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            fontSize: 11,
            fontWeight: 500,
            background: 'linear-gradient(135deg, rgba(62, 207, 142, 0.15), rgba(62, 207, 142, 0.25))',
            border: '1px solid rgba(62, 207, 142, 0.3)',
            borderRadius: 6,
            color: 'var(--text)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          className="hover:opacity-80"
          title="Supabaseダッシュボード（新しいタブで開く）"
        >
          <Database size={14} />
          <span>Supabase</span>
          <ExternalLink size={10} style={{ opacity: 0.6 }} />
        </a>
        {/* 外注ツールリンク */}
        <a
          href="/stocktake"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            fontSize: 11,
            fontWeight: 500,
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 6,
            color: 'var(--text)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          className="hover:opacity-80"
          title="外注用棚卸しツール（新しいタブで開く）"
        >
          <Package size={14} />
          <span>外注ツール</span>
          <ExternalLink size={10} style={{ opacity: 0.6 }} />
        </a>
        <N3Divider orientation="vertical" />
        <N3LanguageSwitch language={language} onToggle={onLanguageToggle} />
        <N3Divider orientation="vertical" />
        <N3WorldClock clocks={clocksData} />
        <N3Divider orientation="vertical" />
        <N3CurrencyDisplay value={149.50} trend="up" />
        <N3Divider orientation="vertical" />
        <button onClick={handleThemeToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid var(--panel-border)', cursor: 'pointer' }} title={`Theme: ${currentColorTheme}`}><Palette size={14} /></button>
        <N3Divider orientation="vertical" />
        <div className="relative" ref={notifRef}>
          <N3NotificationBell count={3} active={showNotifications} onClick={() => setShowNotifications(!showNotifications)} />
          {showNotifications && <div className="n3-dropdown" style={{ width: 280, right: 0 }}><div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}><span className="text-xs font-semibold">Notifications</span></div></div>}
        </div>
        <div className="relative" ref={userMenuRef}>
          <N3UserAvatar name={user?.username || 'User'} onClick={() => setShowUserMenu(!showUserMenu)} />
          {showUserMenu && <div className="n3-dropdown" style={{ width: 180 }}><div className="n3-dropdown-item" onClick={() => { setShowUserMenu(false); onLogout(); }}><LogOut size={14} /> Sign out</div></div>}
        </div>
      </div>
    </header>
  );
});

export default N3PageHeader;
