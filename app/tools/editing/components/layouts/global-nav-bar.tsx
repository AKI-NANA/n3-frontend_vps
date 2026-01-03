// app/tools/editing/components/layouts/global-nav-bar.tsx
/**
 * GlobalNavBar - TOPバー
 * 
 * 修正後:
 * - Basic/Logistics/Compliance/Media/Historyタブを表示
 * - ピン留め機能で現在のタブを固定
 * - L2タブナビゲーションとして機能
 */

'use client';

import { useCallback } from 'react';
import { Edit3, Truck, Shield, Image as ImageIcon, History, Pin, PinOff } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

// L2タブの定義
export type L2TabId = 'basic-edit' | 'logistics' | 'compliance' | 'media' | 'history';

interface NavTab {
  id: L2TabId;
  label: string;
  labelEn: string;
  icon: typeof Edit3;
}

const NAV_TABS: NavTab[] = [
  { id: 'basic-edit', label: '基本編集', labelEn: 'Basic', icon: Edit3 },
  { id: 'logistics', label: 'ロジスティクス', labelEn: 'Logistics', icon: Truck },
  { id: 'compliance', label: '関税・法令', labelEn: 'Compliance', icon: Shield },
  { id: 'media', label: 'メディア', labelEn: 'Media', icon: ImageIcon },
  { id: 'history', label: '履歴・監査', labelEn: 'History', icon: History },
];

interface GlobalNavBarProps {
  className?: string;
  language?: 'ja' | 'en';
  onLanguageChange?: (lang: 'ja' | 'en') => void;
}

export function GlobalNavBar({
  className = '',
  language = 'ja',
  onLanguageChange
}: GlobalNavBarProps) {
  // サイドバーストアから現在のタブを取得
  const { currentTab, setCurrentTab } = useSidebarStore();
  const activeTab = currentTab as L2TabId;

  // タブクリックハンドラー
  const handleTabClick = useCallback((tabId: L2TabId) => {
    setCurrentTab(tabId);
  }, [setCurrentTab]);

  return (
    <div className={`n3-global-nav-bar ${className}`.trim()}>
      {/* タブナビゲーション */}
      <div className="n3-global-nav-bar__tabs">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`n3-global-nav-bar__tab ${isActive ? 'active' : ''}`}
              title={tab.label}
            >
              <Icon size={14} />
              <span>{language === 'ja' ? tab.label : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 右側: 言語切り替え等 */}
      <div className="n3-global-nav-bar__right">
        {onLanguageChange && (
          <button
            onClick={() => onLanguageChange(language === 'ja' ? 'en' : 'ja')}
            className="n3-global-nav-bar__lang-btn"
            title="言語を切り替え"
          >
            {language === 'ja' ? 'EN' : 'JA'}
          </button>
        )}
      </div>
    </div>
  );
}
