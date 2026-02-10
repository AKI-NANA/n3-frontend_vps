/**
 * N3VercelTabs - Vercel風タブナビゲーション
 * 
 * 特徴:
 * - ホバー時に背景がスムーズにスライド
 * - 方向認識アニメーション
 * - パネル展開のスムーズなアニメーション
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

// ============================================================
// Types
// ============================================================

export interface VercelTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  panel?: React.ReactNode;
}

export interface N3VercelTabsProps {
  tabs: VercelTab[];
  activeTab?: string | null;
  onTabChange?: (tabId: string | null) => void;
  className?: string;
}

// ============================================================
// N3VercelTabs Component
// ============================================================

export function N3VercelTabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: N3VercelTabsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ホバー位置を計算
  useEffect(() => {
    if (hoveredIndex !== null && buttonRefs.current[hoveredIndex]) {
      const rect = buttonRefs.current[hoveredIndex]!.getBoundingClientRect();
      setHoverRect(rect);
    }
  }, [hoveredIndex]);

  const navRect = navRef.current?.getBoundingClientRect();

  // ホバー背景のスタイル計算
  let hoverStyles: React.CSSProperties = {
    opacity: 0,
    transform: 'translateX(0)',
    width: 0,
  };

  if (navRect && hoverRect && isHovering) {
    hoverStyles = {
      opacity: 1,
      width: hoverRect.width,
      transform: `translateX(${hoverRect.left - navRect.left}px)`,
      transition: 'all 0.15s ease-out',
    };
  }

  // アクティブタブの背景スタイル
  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  let activeStyles: React.CSSProperties = { opacity: 0 };

  if (activeIndex !== -1 && buttonRefs.current[activeIndex] && navRect) {
    const activeRect = buttonRefs.current[activeIndex]!.getBoundingClientRect();
    activeStyles = {
      opacity: 1,
      width: activeRect.width,
      transform: `translateX(${activeRect.left - navRect.left}px)`,
      transition: 'all 0.2s ease-out',
    };
  }

  const handleTabClick = (tabId: string) => {
    if (activeTab === tabId) {
      onTabChange?.(null);
    } else {
      onTabChange?.(tabId);
    }
  };

  const activePanel = tabs.find(t => t.id === activeTab)?.panel;

  return (
    <div className={`n3-vercel-tabs ${className}`}>
      {/* タブナビゲーション */}
      <nav
        ref={navRef}
        className="n3-vercel-tabs__nav"
        onMouseLeave={() => {
          setIsHovering(false);
          setHoveredIndex(null);
        }}
      >
        {/* ホバー背景 */}
        <div className="n3-vercel-tabs__hover-bg" style={hoverStyles} />

        {/* アクティブ背景 */}
        <div className="n3-vercel-tabs__active-bg" style={activeStyles} />

        {/* タブボタン */}
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => { buttonRefs.current[index] = el; }}
            className={`n3-vercel-tabs__tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            onMouseEnter={() => {
              setHoveredIndex(index);
              setIsHovering(true);
            }}
          >
            {tab.icon && <span className="n3-vercel-tabs__icon">{tab.icon}</span>}
            <span className="n3-vercel-tabs__label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* パネル（アニメーション付き） */}
      <div className={`n3-vercel-tabs__panel-wrapper ${activePanel ? 'open' : ''}`}>
        <div className="n3-vercel-tabs__panel">
          {activePanel}
        </div>
      </div>
    </div>
  );
}

export default N3VercelTabs;
