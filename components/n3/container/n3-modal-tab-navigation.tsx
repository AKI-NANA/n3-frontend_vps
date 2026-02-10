/**
 * N3ModalTabNavigation - モーダルタブナビゲーション
 * 
 * /tools/editing の ProductModal で使用
 * アイコン付きタブ、マーケットプレイス別表示制御
 */

'use client';

import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

export interface ModalTab {
  id: string;
  labelJa: string;
  labelEn: string;
  icon?: string | LucideIcon;
  /** 特定マーケットプレイスのみ表示 */
  marketplaces?: string[];
  /** 特定マーケットプレイスで非表示 */
  excludeMarketplaces?: string[];
  /** 国内マーケットプレイスのみ */
  domesticOnly?: boolean;
  /** 海外マーケットプレイスのみ */
  overseasOnly?: boolean;
  /** バッジ数 */
  badge?: number;
  /** 無効化 */
  disabled?: boolean;
}

export interface N3ModalTabNavigationProps {
  tabs: ModalTab[];
  current: string;
  onChange: (tabId: string) => void;
  /** 現在のマーケットプレイス */
  marketplace?: string;
  /** 国内マーケットプレイスIDリスト */
  domesticMarketplaces?: string[];
  /** 言語設定 */
  language?: 'ja' | 'en';
  /** アクセントカラー（特定タブ用） */
  accentColor?: string;
  /** サイズ */
  size?: 'sm' | 'md';
}

// Font Awesomeアイコンマッピング（後方互換性のため）
const FA_TO_LUCIDE: Record<string, keyof typeof Icons> = {
  'fa-chart-pie': 'PieChart',
  'fa-database': 'Database',
  'fa-images': 'Images',
  'fa-tools': 'Wrench',
  'fa-search-dollar': 'Search',
  'fa-chart-bar': 'BarChart3',
  'fa-dollar-sign': 'DollarSign',
  'fa-shopping-cart': 'ShoppingCart',
  'fa-edit': 'Edit',
  'fa-shipping-fast': 'Truck',
  'fa-balance-scale': 'Scale',
  'fa-code': 'Code',
  'fa-check-circle': 'CheckCircle',
};

export const N3ModalTabNavigation = memo(function N3ModalTabNavigation({
  tabs,
  current,
  onChange,
  marketplace = 'ebay-us',
  domesticMarketplaces = [],
  language = 'en',
  accentColor,
  size = 'sm',
}: N3ModalTabNavigationProps) {
  const isDomestic = domesticMarketplaces.includes(marketplace);

  // タブのフィルタリング
  const visibleTabs = tabs.filter((tab) => {
    if (tab.marketplaces?.length && !tab.marketplaces.includes(marketplace)) return false;
    if (tab.excludeMarketplaces?.includes(marketplace)) return false;
    if (tab.domesticOnly && !isDomestic) return false;
    if (tab.overseasOnly && isDomestic) return false;
    return true;
  });

  const renderIcon = (tab: ModalTab, isActive: boolean, activeColor: string) => {
    if (!tab.icon) return null;

    // LucideIcon の場合
    if (typeof tab.icon !== 'string') {
      const IconComponent = tab.icon;
      return <IconComponent size={size === 'sm' ? 12 : 14} />;
    }

    // Font Awesome クラス名の場合 -> Lucide に変換
    const lucideIconName = FA_TO_LUCIDE[tab.icon];
    if (lucideIconName) {
      const IconComponent = Icons[lucideIconName] as LucideIcon;
      if (IconComponent) {
        return <IconComponent size={size === 'sm' ? 12 : 14} />;
      }
    }

    // フォールバック: Font Awesome
    return <i className={`fas ${tab.icon}`} style={{ fontSize: size === 'sm' ? '12px' : '14px' }} />;
  };

  return (
    <nav
      style={{
        display: 'flex',
        background: 'var(--bg-solid)',
        borderBottom: '1px solid var(--panel-border)',
        minHeight: size === 'sm' ? '40px' : '44px',
        maxHeight: size === 'sm' ? '40px' : '44px',
        overflowX: 'auto',
        overflowY: 'hidden',
        flexShrink: 0,
        padding: '0 0.5rem',
      }}
    >
      {visibleTabs.map((tab) => {
        const isActive = current === tab.id;
        const activeColor = accentColor || 'var(--accent)';
        const label = language === 'ja' ? tab.labelJa : tab.labelEn;

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            style={{
              padding: size === 'sm' ? '0.5rem 0.75rem' : '0.625rem 1rem',
              fontSize: size === 'sm' ? '10px' : '11px',
              fontWeight: 600,
              color: isActive ? activeColor : 'var(--text-muted)',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${isActive ? activeColor : 'transparent'}`,
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              opacity: tab.disabled ? 0.5 : 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.125rem',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              position: 'relative',
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
            {renderIcon(tab, isActive, activeColor)}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  style={{
                    fontSize: '8px',
                    fontWeight: 700,
                    padding: '1px 4px',
                    borderRadius: '9999px',
                    background: isActive ? activeColor : 'var(--text-muted)',
                    color: 'var(--bg-solid)',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
});

// デフォルトタブ定義（ProductModal用）
export const DEFAULT_PRODUCT_MODAL_TABS: ModalTab[] = [
  { id: 'overview', labelJa: '概要', labelEn: 'Overview', icon: 'fa-chart-pie' },
  { id: 'data', labelJa: 'データ', labelEn: 'Data', icon: 'fa-database' },
  { id: 'images', labelJa: '画像', labelEn: 'Images', icon: 'fa-images' },
  { id: 'tools', labelJa: 'ツール', labelEn: 'Tools', icon: 'fa-tools' },
  { id: 'mirror', labelJa: 'Mirror', labelEn: 'Mirror', icon: 'fa-search-dollar', overseasOnly: true },
  { id: 'competitors', labelJa: '競合', labelEn: 'Competitors', icon: 'fa-chart-bar' },
  { id: 'pricing', labelJa: '価格', labelEn: 'Pricing', icon: 'fa-dollar-sign' },
  // 国内販路専用タブ
  { id: 'qoo10', labelJa: 'Qoo10', labelEn: 'Qoo10', icon: 'fa-shopping-cart', marketplaces: ['qoo10-jp'] },
  { id: 'amazon-jp', labelJa: 'Amazon', labelEn: 'Amazon', icon: 'fa-shopping-cart', marketplaces: ['amazon-jp'] },
  { id: 'mercari', labelJa: 'メルカリ', labelEn: 'Mercari', icon: 'fa-shopping-cart', marketplaces: ['mercari-jp'] },
  { id: 'yahoo', labelJa: 'ヤフオク', labelEn: 'Yahoo', icon: 'fa-shopping-cart', marketplaces: ['yahoo-auction'] },
  // 共通タブ
  { id: 'listing', labelJa: '出品', labelEn: 'Listing', icon: 'fa-edit' },
  { id: 'shipping', labelJa: '配送', labelEn: 'Shipping', icon: 'fa-shipping-fast' },
  { id: 'tax', labelJa: '関税', labelEn: 'Tax/Duty', icon: 'fa-balance-scale', overseasOnly: true },
  { id: 'html', labelJa: 'HTML', labelEn: 'HTML', icon: 'fa-code' },
  { id: 'final', labelJa: '確認', labelEn: 'Final', icon: 'fa-check-circle' },
];
