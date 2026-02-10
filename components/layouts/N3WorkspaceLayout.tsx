// components/layouts/N3WorkspaceLayout.tsx
/**
 * N3 Workspace 統合レイアウトテンプレート
 * 
 * Phase 4.5: editing-n3 の構造を抽出した共通テンプレート
 * 
 * 特徴:
 * - シンプルなヘッダー
 * - L2 タブナビゲーション
 * - Filter Bar
 * - 3 Column Layout対応
 * - Scroll Container
 */

'use client';

import React, { memo, useState, useCallback, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';

// ============================================================
// 型定義
// ============================================================

export interface L2Tab {
  id: string;
  label: string;
  labelEn?: string;
  icon?: LucideIcon;
  badge?: number | string;
  color?: string;
}

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

export interface N3WorkspaceLayoutProps {
  /** ページタイトル */
  title: string;
  /** ページサブタイトル */
  subtitle?: string;
  /** アクセントカラー */
  accentColor?: string;
  /** L2タブ定義 */
  tabs: L2Tab[];
  /** アクティブタブID */
  activeTab?: string;
  /** タブ変更ハンドラ */
  onTabChange?: (tabId: string) => void;
  /** L3フィルタータブ（オプション） */
  filters?: FilterTab[];
  /** アクティブフィルターID */
  activeFilter?: string;
  /** フィルター変更ハンドラ */
  onFilterChange?: (filterId: string) => void;
  /** ツールバー（タブの右側に表示） */
  toolbar?: ReactNode;
  /** メインコンテンツ */
  children: ReactNode;
  /** 右パネル（オプション） */
  rightPanel?: ReactNode;
  /** 右パネル幅 */
  rightPanelWidth?: number;
  /** 右パネル表示制御 */
  showRightPanel?: boolean;
  /** カスタムクラス */
  className?: string;
}

// ============================================================
// サブコンポーネント
// ============================================================

const TabButton = memo(function TabButton({
  tab,
  isActive,
  onClick,
}: {
  tab: L2Tab;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;
  
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        fontSize: 12,
        fontWeight: isActive ? 600 : 400,
        background: isActive ? (tab.color || 'var(--accent)') : 'transparent',
        color: isActive ? 'white' : 'var(--text)',
        transition: 'all 0.15s ease',
      }}
    >
      {Icon && <Icon size={14} />}
      <span>{tab.label}</span>
      {tab.badge !== undefined && (
        <span
          style={{
            padding: '1px 6px',
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 600,
            background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--panel-alt)',
            color: isActive ? 'white' : 'var(--text-muted)',
          }}
        >
          {tab.badge}
        </span>
      )}
    </button>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const N3WorkspaceLayout = memo(function N3WorkspaceLayout({
  title,
  subtitle,
  accentColor,
  tabs,
  activeTab: externalActiveTab,
  onTabChange,
  filters,
  activeFilter: externalActiveFilter,
  onFilterChange,
  toolbar,
  children,
  rightPanel,
  rightPanelWidth = 320,
  showRightPanel = false,
  className = '',
}: N3WorkspaceLayoutProps) {
  const { isInWorkspace } = useWorkspace();
  
  // 内部ステート（外部制御がない場合のフォールバック）
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  const [internalActiveFilter, setInternalActiveFilter] = useState(filters?.[0]?.id || 'all');
  
  // 実際に使用する値
  const activeTab = externalActiveTab ?? internalActiveTab;
  const activeFilter = externalActiveFilter ?? internalActiveFilter;
  
  // タブ変更ハンドラ
  const handleTabChange = useCallback((tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  }, [onTabChange]);
  
  // フィルター変更ハンドラ
  const handleFilterChange = useCallback((filterId: string) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    } else {
      setInternalActiveFilter(filterId);
    }
  }, [onFilterChange]);

  return (
    <div
      className={`n3-workspace-layout ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* タイトル + タブバー統合（コンパクト版） */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '8px 12px',
          background: 'var(--panel)',
          borderBottom: '1px solid var(--panel-border)',
          flexShrink: 0,
          minHeight: 44,
        }}
      >
        {/* タイトル部分（Workspace外のみ表示、コンパクト） */}
        {!isInWorkspace && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {accentColor && (
              <div
                style={{
                  width: 4,
                  height: 24,
                  borderRadius: 2,
                  background: accentColor,
                }}
              />
            )}
            <div>
              <h1 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* タブ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
            />
          ))}
        </div>
        
        {/* ツールバー */}
        {toolbar && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {toolbar}
          </div>
        )}
      </div>

      {/* L3 フィルターバー（オプション） */}
      {filters && filters.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 12px',
            background: 'var(--panel-alt)',
            borderBottom: '1px solid var(--panel-border)',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 10px',
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: activeFilter === filter.id ? 600 : 400,
                background: activeFilter === filter.id ? 'var(--accent)' : 'transparent',
                color: activeFilter === filter.id ? 'white' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{filter.label}</span>
              {filter.count !== undefined && (
                <span
                  style={{
                    padding: '1px 5px',
                    borderRadius: 6,
                    fontSize: 9,
                    background: activeFilter === filter.id ? 'rgba(255,255,255,0.2)' : 'var(--panel)',
                  }}
                >
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* メインコンテンツエリア */}
      <div
        id="workspace-scroll-container"
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* メインコンテンツ */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          {children}
        </div>

        {/* 右パネル（オプション） */}
        {showRightPanel && rightPanel && (
          <div
            style={{
              width: rightPanelWidth,
              flexShrink: 0,
              borderLeft: '1px solid var(--panel-border)',
              background: 'var(--panel)',
              overflow: 'auto',
            }}
          >
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
});

export default N3WorkspaceLayout;
