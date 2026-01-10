'use client';

// TabNavigation - V9.0 - 国内/海外タブ完全切り替え版

import { memo, useMemo } from 'react';
import { DOMESTIC_MARKETPLACE_IDS } from './marketplace-selector';

interface TabDefinition {
  id: string;
  labelJa: string;
  labelEn: string;
  icon: string;
  marketplaces?: string[];
}

// 海外販路用タブ
const GLOBAL_TABS: TabDefinition[] = [
  { id: 'overview', labelJa: '概要', labelEn: 'Overview', icon: 'fa-chart-pie' },
  { id: 'data', labelJa: 'データ', labelEn: 'Data', icon: 'fa-database' },
  { id: 'images', labelJa: '画像', labelEn: 'Images', icon: 'fa-images' },
  { id: 'tools', labelJa: 'ツール', labelEn: 'Tools', icon: 'fa-tools' },
  { id: 'mirror', labelJa: 'SM分析', labelEn: 'SM Analysis', icon: 'fa-search-dollar' },
  { id: 'competitors', labelJa: '競合', labelEn: 'Competitors', icon: 'fa-chart-bar' },
  { id: 'pricing', labelJa: '価格', labelEn: 'Pricing', icon: 'fa-dollar-sign' },
  { id: 'shipping', labelJa: '配送', labelEn: 'Shipping', icon: 'fa-shipping-fast' },
  { id: 'html', labelJa: 'HTML', labelEn: 'HTML', icon: 'fa-code' },
  { id: 'tax', labelJa: '関税', labelEn: 'Tax/Duty', icon: 'fa-balance-scale' },
  { id: 'final', labelJa: '確認', labelEn: 'Confirm', icon: 'fa-check-circle' },
  { id: 'multi-listing', labelJa: '多販路', labelEn: 'Multi', icon: 'fa-store' },
];

// 国内販路用タブ
const DOMESTIC_TABS: TabDefinition[] = [
  { id: 'overview', labelJa: '概要', labelEn: 'Overview', icon: 'fa-chart-pie' },
  { id: 'data', labelJa: 'データ', labelEn: 'Data', icon: 'fa-database' },
  { id: 'images', labelJa: '画像', labelEn: 'Images', icon: 'fa-images' },
  { id: 'pricing', labelJa: '価格', labelEn: 'Pricing', icon: 'fa-yen-sign' },
  { id: 'qoo10', labelJa: 'Qoo10', labelEn: 'Qoo10', icon: 'fa-shopping-cart', marketplaces: ['qoo10-jp'] },
  { id: 'shipping', labelJa: '配送', labelEn: 'Shipping', icon: 'fa-truck' },
  { id: 'html', labelJa: 'HTML', labelEn: 'HTML', icon: 'fa-code' },
  { id: 'final', labelJa: '確認', labelEn: 'Confirm', icon: 'fa-check-circle' },
  { id: 'multi-listing', labelJa: '多販路', labelEn: 'Multi', icon: 'fa-store' },
];

export interface TabNavigationProps {
  current: string;
  onChange: (tab: string) => void;
  marketplace?: string;
  isDomestic?: boolean;
}

export const TabNavigation = memo(function TabNavigation({ 
  current, onChange, marketplace = 'ebay-us', isDomestic: isDomesticProp 
}: TabNavigationProps) {
  const isDomestic = isDomesticProp ?? DOMESTIC_MARKETPLACE_IDS.includes(marketplace);

  const visibleTabs = useMemo(() => {
    const baseTabs = isDomestic ? DOMESTIC_TABS : GLOBAL_TABS;
    return baseTabs.filter(tab => {
      if (tab.marketplaces?.length) return tab.marketplaces.includes(marketplace);
      return true;
    });
  }, [isDomestic, marketplace]);

  return (
    <nav style={{
      display: 'flex',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      minHeight: '40px',
      maxHeight: '40px',
      overflowX: 'auto',
      overflowY: 'hidden',
      flexShrink: 0,
      padding: '0 0.5rem',
    }}>
      {visibleTabs.map(tab => {
        const isActive = current === tab.id;
        const isQoo10 = tab.id === 'qoo10';
        const activeColor = isQoo10 ? '#ff0066' : (isDomestic ? '#ff0066' : '#3b82f6');
        const label = isDomestic ? tab.labelJa : tab.labelEn;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '10px',
              fontWeight: 600,
              color: isActive ? activeColor : '#64748b',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${isActive ? activeColor : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.125rem',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#1e293b'; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#64748b'; }}
          >
            <i className={`fas ${tab.icon}`} style={{ fontSize: '12px' }}></i>
            {label}
          </button>
        );
      })}
    </nav>
  );
});
