/**
 * N3EditingLayout - /tools/editing用の共通レイアウトコンポーネント
 * 
 * Design CatalogとEditingページの両方で使用される
 * コンポーネントを修正すれば両方に反映される
 */

'use client';

import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { Wrench, GitBranch, Filter, LogOut } from 'lucide-react';
import {
  N3Button,
  N3Badge,
  N3HeaderTab,
  N3HeaderSearchInput,
  N3L2TabNavigation,
  N3PinButton,
  N3LanguageSwitch,
  N3WorldClock,
  N3CurrencyDisplay,
  N3NotificationBell,
  N3UserAvatar,
  N3Divider,
  N3Toolbar,
} from '@/components/n3';

// ============================================================
// Types
// ============================================================

export type PanelTabId = 'tools' | 'flow' | 'filter';
export type L2TabId = 'basic-edit' | 'logistics' | 'compliance' | 'media' | 'history';
export type Language = 'ja' | 'en';

export interface N3EditingLayoutProps {
  /** 子要素（メインコンテンツ） */
  children: ReactNode;
  /** ユーザー名 */
  userName?: string;
  /** ログアウトハンドラ */
  onLogout?: () => void;
  /** L2タブ変更ハンドラ */
  onL2TabChange?: (tabId: L2TabId) => void;
  /** 初期L2タブ */
  initialL2Tab?: L2TabId;
  /** 言語 */
  language?: Language;
  /** 言語変更ハンドラ */
  onLanguageChange?: (lang: Language) => void;
  /** ツールパネルの内容 */
  toolsPanel?: ReactNode;
  /** フローパネルの内容 */
  flowPanel?: ReactNode;
  /** フィルターパネルの内容 */
  filterPanel?: ReactNode;
  /** デモモード（高さ制限あり） */
  demoMode?: boolean;
  /** デモモードの高さ */
  demoHeight?: number;
}

// ============================================================
// Constants
// ============================================================

const PANEL_TABS: { id: PanelTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'tools', label: 'ツール', icon: <Wrench size={14} /> },
  { id: 'flow', label: 'フロー', icon: <GitBranch size={14} /> },
  { id: 'filter', label: 'マーケットプレイス', icon: <Filter size={14} /> },
];

const L2_TABS = [
  { id: 'basic-edit' as L2TabId, label: '基本編集', labelEn: 'Basic' },
  { id: 'logistics' as L2TabId, label: 'ロジスティクス', labelEn: 'Logistics' },
  { id: 'compliance' as L2TabId, label: '関税・法令', labelEn: 'Compliance' },
  { id: 'media' as L2TabId, label: 'メディア', labelEn: 'Media' },
  { id: 'history' as L2TabId, label: '履歴・監査', labelEn: 'History' },
];

const CLOCKS_CONFIG = [
  { label: "LA", tz: "America/Los_Angeles" },
  { label: "NY", tz: "America/New_York" },
  { label: "DE", tz: "Europe/Berlin" },
  { label: "JP", tz: "Asia/Tokyo" },
];

const HEADER_HEIGHT = 48;

// ============================================================
// Main Component
// ============================================================

export function N3EditingLayout({
  children,
  userName = 'User',
  onLogout,
  onL2TabChange,
  initialL2Tab = 'basic-edit',
  language: externalLanguage,
  onLanguageChange,
  toolsPanel,
  flowPanel,
  filterPanel,
  demoMode = false,
  demoHeight = 400,
}: N3EditingLayoutProps) {
  // ========================================
  // 状態管理
  // ========================================
  const [pinnedTab, setPinnedTab] = useState<PanelTabId | null>(null);
  const [hoveredTab, setHoveredTab] = useState<PanelTabId | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [activeL2Tab, setActiveL2Tab] = useState<L2TabId>(initialL2Tab);
  const [internalLanguage, setInternalLanguage] = useState<Language>('ja');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [times, setTimes] = useState<Record<string, string>>({});
  
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const language = externalLanguage ?? internalLanguage;
  const isPinned = pinnedTab !== null;
  const activeTab = pinnedTab || hoveredTab;

  // ========================================
  // Effects
  // ========================================
  
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // 時計更新
  useEffect(() => {
    const update = () => {
      const newTimes: Record<string, string> = {};
      CLOCKS_CONFIG.forEach(c => {
        newTimes[c.label] = new Date().toLocaleTimeString("en-US", { 
          timeZone: c.tz, hour: "2-digit", minute: "2-digit", hour12: false 
        });
      });
      setTimes(newTimes);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // クリック外側でメニュー閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ========================================
  // ハンドラー
  // ========================================
  const handleMouseEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHeaderHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (pinnedTab) return;
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
      setIsHeaderHovered(false);
    }, 150);
  }, [pinnedTab]);

  const handleTabMouseEnter = useCallback((tabId: PanelTabId) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (!pinnedTab) setHoveredTab(tabId);
    setIsHeaderHovered(true);
  }, [pinnedTab]);

  const handleTabClick = useCallback((tabId: PanelTabId) => {
    if (pinnedTab === tabId) {
      setPinnedTab(null);
      setHoveredTab(null);
      setIsHeaderHovered(false);
    } else {
      setPinnedTab(tabId);
      setHoveredTab(null);
    }
  }, [pinnedTab]);

  const handlePinToggle = useCallback(() => {
    if (pinnedTab) {
      setPinnedTab(null);
      setHoveredTab(null);
      setIsHeaderHovered(false);
    } else if (hoveredTab) {
      setPinnedTab(hoveredTab);
      setHoveredTab(null);
    }
  }, [pinnedTab, hoveredTab]);

  const handleL2TabChange = useCallback((tabId: string) => {
    const id = tabId as L2TabId;
    setActiveL2Tab(id);
    onL2TabChange?.(id);
  }, [onL2TabChange]);

  const handleLanguageToggle = useCallback(() => {
    const newLang = language === 'ja' ? 'en' : 'ja';
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      setInternalLanguage(newLang);
    }
  }, [language, onLanguageChange]);

  // ========================================
  // パネルコンテンツ
  // ========================================
  const getPanelContent = (tabId: PanelTabId | null) => {
    switch (tabId) {
      case 'tools':
        return toolsPanel || (
          <N3Toolbar variant="default" size="sm">
            <N3Button variant="primary" size="sm">カテゴリ</N3Button>
            <N3Button variant="secondary" size="sm">送料</N3Button>
            <N3Button variant="success" size="sm">利益</N3Button>
          </N3Toolbar>
        );
      case 'flow':
        return flowPanel || (
          <div className="p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            FLOWパネル（実装予定）
          </div>
        );
      case 'filter':
        return filterPanel || (
          <div className="p-3">
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Marketplaces</div>
            <div className="flex gap-2">
              {['eBay', 'Amazon', 'メルカリ', 'ヤフオク'].map(mp => (
                <N3Badge key={mp} variant="muted">{mp}</N3Badge>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;
  const clocksData = CLOCKS_CONFIG.map(c => ({ label: c.label, time: times[c.label] || '--:--' }));

  // ========================================
  // スタイル
  // ========================================
  const containerStyle: React.CSSProperties = demoMode
    ? {
        display: 'flex',
        flexDirection: 'column',
        height: demoHeight,
        border: '1px solid var(--panel-border)',
        borderRadius: '8px',
        overflow: 'hidden',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        marginLeft: 'var(--sidebar-width)',
        paddingTop: HEADER_HEIGHT,
      };

  const headerStyle: React.CSSProperties = demoMode
    ? {
        display: 'flex',
        alignItems: 'stretch',
        height: HEADER_HEIGHT,
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--glass-border)',
        flexShrink: 0,
      }
    : {
        position: 'fixed',
        top: 0,
        left: 'var(--sidebar-width)',
        right: 0,
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--glass-border)',
        zIndex: 40,
      };

  const hoverPanelStyle: React.CSSProperties = demoMode
    ? {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        padding: 6,
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 100,
      }
    : {
        position: 'fixed',
        top: HEADER_HEIGHT,
        left: 'var(--sidebar-width)',
        right: 0,
        padding: 6,
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 100,
      };

  // ========================================
  // レンダリング
  // ========================================
  return (
    <div style={containerStyle}>
      {/* ヘッダーエリア */}
      <div 
        className={demoMode ? 'relative flex-shrink-0' : ''}
        onMouseLeave={handleMouseLeave}
      >
        {/* ヘッダーバー */}
        <header style={headerStyle} onMouseEnter={handleMouseEnter}>
          {/* Left - タブ */}
          <div style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
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

          {/* Center - Search */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <N3HeaderSearchInput placeholder="Search..." shortcut="⌘K" width={240} />
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 16 }}>
            <N3LanguageSwitch language={language} onToggle={handleLanguageToggle} />
            <N3Divider orientation="vertical" />
            <N3WorldClock clocks={clocksData} />
            <N3Divider orientation="vertical" />
            <N3CurrencyDisplay value={149.50} trend="up" />
            <N3Divider orientation="vertical" />
            <N3NotificationBell count={3} />
            
            <div className="relative" ref={userMenuRef}>
              <N3UserAvatar name={userName} onClick={() => setShowUserMenu(!showUserMenu)} />
              {showUserMenu && (
                <div 
                  className="absolute right-0 top-full mt-1 bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg shadow-lg py-1 z-50"
                  style={{ width: 160 }}
                >
                  <button
                    className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--highlight)]"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout?.();
                    }}
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ホバーパネル (absolute - コンテンツに重なる) */}
        {showHoverPanel && (
          <div style={hoverPanelStyle} onMouseEnter={handleMouseEnter}>
            {getPanelContent(hoveredTab)}
          </div>
        )}
      </div>

      {/* ピン留めパネル (通常フロー - コンテンツを押し下げる) */}
      {isPinned && (
        <div style={{ 
          flexShrink: 0, 
          padding: 6, 
          background: 'var(--panel)', 
          borderBottom: '1px solid var(--panel-border)' 
        }}>
          {getPanelContent(pinnedTab)}
        </div>
      )}

      {/* メインコンテンツ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* L2タブ */}
        <N3L2TabNavigation
          tabs={L2_TABS.map(t => ({ id: t.id, label: t.label, labelEn: t.labelEn }))}
          activeTab={activeL2Tab}
          onTabChange={handleL2TabChange}
          language={language}
        />

        {/* 子要素 */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default N3EditingLayout;
