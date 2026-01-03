// app/tools/editing/components/layouts/tools-nav-panel.tsx
/**
 * ToolsNavPanel - ページ内上部のTools/Flow/Filterナビゲーション
 * 
 * 機能:
 * - Tools/Flow/Filterタブの切り替え
 * - ホバー時にパネル表示（ピン留めで固定）
 * - ToolPanelやMarketplaceSelectorをパネル内に表示
 */

'use client';

import { ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { Pin, PinOff, Wrench, GitBranch, Filter as FilterIcon } from 'lucide-react';

export type PanelTabId = 'tools' | 'flow' | 'filter';

interface PanelTab {
  id: PanelTabId;
  label: string;
  icon: typeof Wrench;
}

const PANEL_TABS: PanelTab[] = [
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'flow', label: 'FLOW', icon: GitBranch },
  { id: 'filter', label: 'Filter', icon: FilterIcon },
];

interface ToolsNavPanelProps {
  toolsPanel?: ReactNode;
  flowPanel?: ReactNode;
  filterPanel?: ReactNode;
  className?: string;
  defaultPinned?: boolean;
}

export function ToolsNavPanel({
  toolsPanel,
  flowPanel,
  filterPanel,
  className = '',
  defaultPinned = true
}: ToolsNavPanelProps) {
  // ホバー中のタブ
  const [hoveredTab, setHoveredTab] = useState<PanelTabId | null>(null);
  // ピン留め（クリック固定）されたタブ
  const [pinnedTab, setPinnedTab] = useState<PanelTabId | null>(defaultPinned ? 'tools' : null);
  // 全体のホバー状態
  const [isNavHovered, setIsNavHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 表示するタブ（ピン留め優先）
  const activeTab = pinnedTab || hoveredTab;

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // コンテナ全体にホバーしたら表示を維持
  const handleContainerMouseEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsNavHovered(true);
  }, []);

  // コンテナから離れたら少し遅延して非表示（ピン留め中は除く）
  const handleContainerMouseLeave = useCallback(() => {
    if (pinnedTab) return;
    
    leaveTimeoutRef.current = setTimeout(() => {
      setIsNavHovered(false);
      setHoveredTab(null);
    }, 100);
  }, [pinnedTab]);

  // タブにホバーしたら即時表示
  const handleTabMouseEnter = useCallback((tabId: PanelTabId) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHoveredTab(tabId);
  }, []);

  // タブをクリックしたらピン留めトグル
  const handleTabClick = useCallback((tabId: PanelTabId) => {
    if (pinnedTab === tabId) {
      setPinnedTab(null);
    } else {
      setPinnedTab(tabId);
    }
  }, [pinnedTab]);

  // ピン留め/解除ボタン
  const handlePinToggle = useCallback(() => {
    if (pinnedTab) {
      setPinnedTab(null);
    } else if (activeTab) {
      setPinnedTab(activeTab);
    }
  }, [pinnedTab, activeTab]);

  // アクティブなパネルコンテンツを取得
  const getActivePanel = () => {
    switch (activeTab) {
      case 'tools':
        return toolsPanel;
      case 'flow':
        return flowPanel;
      case 'filter':
        return filterPanel;
      default:
        return null;
    }
  };

  const activePanelContent = getActivePanel();
  const showPanel = activePanelContent && (activeTab !== null);
  const isPinned = pinnedTab !== null;

  return (
    <div 
      className={`n3-tools-nav-panel ${isPinned ? 'pinned' : ''} ${className}`.trim()} 
      ref={containerRef}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      {/* ナビゲーションバー */}
      <div className="n3-tools-nav-panel__bar">
        {/* ピン留めボタン */}
        <button
          className={`n3-tools-nav-panel__pin ${isPinned ? 'active' : ''}`}
          onClick={handlePinToggle}
          title={isPinned ? 'パネルを解除' : 'パネルを固定'}
        >
          {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
        </button>

        {/* タブ */}
        <div className="n3-tools-nav-panel__tabs">
          {PANEL_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isTabPinned = pinnedTab === tab.id;

            return (
              <button
                key={tab.id}
                className={`n3-tools-nav-panel__tab ${isActive ? 'active' : ''} ${isTabPinned ? 'pinned' : ''}`}
                onMouseEnter={() => handleTabMouseEnter(tab.id)}
                onClick={() => handleTabClick(tab.id)}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* パネル */}
      {showPanel && (
        <div className={`n3-tools-nav-panel__content ${isPinned ? 'pinned' : ''}`}>
          {activePanelContent}
        </div>
      )}
    </div>
  );
}
