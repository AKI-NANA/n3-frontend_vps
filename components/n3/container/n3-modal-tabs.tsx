/**
 * N3ModalTabs - シンプルなモーダルタブコンポーネント
 * 
 * 用途:
 * - モーダル内のタブ切り替え
 * - N3ModalTabNavigation のシンプル版
 * - より汎用的な用途に対応
 * 
 * 注: マーケットプレイス対応が必要な場合は N3ModalTabNavigation を使用
 */

'use client';

import React, { memo, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// ============================================
// 型定義
// ============================================
export interface TabItem {
  /** タブID */
  id: string;
  /** ラベル（日本語） */
  label: string;
  /** ラベル（英語）- 省略時はlabelを使用 */
  labelEn?: string;
  /** アイコン */
  icon?: LucideIcon | ReactNode;
  /** バッジ数 */
  badge?: number;
  /** タブコンテンツ */
  content?: ReactNode;
  /** 無効化 */
  disabled?: boolean;
}

export interface N3ModalTabsProps {
  /** タブ定義 */
  tabs: TabItem[];
  /** 現在のアクティブタブID */
  activeTab: string;
  /** タブ変更ハンドラ */
  onTabChange: (tabId: string) => void;
  /** 言語設定 */
  language?: 'ja' | 'en';
  /** アクセントカラー */
  accentColor?: string;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** タブの配置 */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** カスタムスタイル */
  style?: React.CSSProperties;
  /** カスタムクラス */
  className?: string;
}

// ============================================
// サイズ設定
// ============================================
const SIZE_CONFIG = {
  sm: {
    padding: '0.375rem 0.75rem',
    fontSize: '11px',
    iconSize: 12,
    gap: '0.25rem',
    height: '36px',
  },
  md: {
    padding: '0.5rem 1rem',
    fontSize: '12px',
    iconSize: 14,
    gap: '0.375rem',
    height: '40px',
  },
  lg: {
    padding: '0.625rem 1.25rem',
    fontSize: '13px',
    iconSize: 16,
    gap: '0.5rem',
    height: '44px',
  },
};

// ============================================
// N3ModalTabs - メインコンポーネント
// ============================================
export const N3ModalTabs = memo(function N3ModalTabs({
  tabs,
  activeTab,
  onTabChange,
  language = 'ja',
  accentColor,
  size = 'sm',
  align = 'start',
  style,
  className = '',
}: N3ModalTabsProps) {
  const config = SIZE_CONFIG[size];
  const activeColorValue = accentColor || 'var(--accent)';

  const alignStyles: Record<string, React.CSSProperties> = {
    start: { justifyContent: 'flex-start' },
    center: { justifyContent: 'center' },
    end: { justifyContent: 'flex-end' },
    stretch: { justifyContent: 'stretch' },
  };

  const renderIcon = (tab: TabItem) => {
    if (!tab.icon) return null;

    // LucideIcon の場合（関数コンポーネント）
    if (typeof tab.icon === 'function') {
      const IconComponent = tab.icon as React.ComponentType<{ size: number }>;
      return <IconComponent size={config.iconSize} />;
    }

    // ReactNode の場合（既にレンダリング済みの要素）
    if (React.isValidElement(tab.icon)) {
      return tab.icon;
    }

    return null;
  };

  return (
    <nav
      className={`n3-modal-tabs ${className}`}
      style={{
        display: 'flex',
        background: 'var(--bg-solid)',
        borderBottom: '1px solid var(--panel-border)',
        minHeight: config.height,
        maxHeight: config.height,
        overflowX: 'auto',
        overflowY: 'hidden',
        flexShrink: 0,
        padding: '0 0.5rem',
        ...alignStyles[align],
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const label = language === 'ja' ? tab.label : (tab.labelEn || tab.label);

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: config.gap,
              padding: config.padding,
              fontSize: config.fontSize,
              fontWeight: 600,
              color: isActive ? activeColorValue : 'var(--text-muted)',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${isActive ? activeColorValue : 'transparent'}`,
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              opacity: tab.disabled ? 0.5 : 1,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive && !tab.disabled) {
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && !tab.disabled) {
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            {renderIcon(tab)}
            <span>{label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '9999px',
                  background: isActive ? activeColorValue : 'var(--text-muted)',
                  color: 'var(--bg-solid)',
                  marginLeft: '2px',
                }}
              >
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
});

// ============================================
// N3TabPanel - タブパネル（タブコンテンツ表示用）
// ============================================
export interface N3TabPanelProps {
  /** タブID（activeTabと比較して表示制御） */
  tabId: string;
  /** 現在のアクティブタブID */
  activeTab: string;
  /** 子要素 */
  children: ReactNode;
  /** 非アクティブ時もDOMに残す（遅延読み込みしない） */
  keepMounted?: boolean;
  /** カスタムスタイル */
  style?: React.CSSProperties;
  /** カスタムクラス */
  className?: string;
}

export const N3TabPanel = memo(function N3TabPanel({
  tabId,
  activeTab,
  children,
  keepMounted = false,
  style,
  className = '',
}: N3TabPanelProps) {
  const isActive = activeTab === tabId;

  if (!isActive && !keepMounted) {
    return null;
  }

  return (
    <div
      className={`n3-tab-panel ${className}`}
      role="tabpanel"
      hidden={!isActive}
      style={{
        display: isActive ? 'block' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
});

export default N3ModalTabs;
