/**
 * N3Tabs - N3デザインシステムのタブコンポーネント
 */

'use client';

import React, { useState } from 'react';

export interface N3TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

export interface N3TabsProps {
  tabs: N3TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function N3Tabs({ 
  tabs, 
  defaultTab, 
  activeTab: controlledActiveTab,
  onChange,
  size = 'md',
}: N3TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const sizes = {
    sm: { height: 32, fontSize: 12, padding: '6px 12px' },
    md: { height: 36, fontSize: 13, padding: '8px 16px' },
    lg: { height: 40, fontSize: 14, padding: '10px 20px' },
  };

  const sizeConfig = sizes[size];

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        background: 'var(--highlight)',
        padding: 4,
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && handleTabClick(tab.id)}
          disabled={tab.disabled}
          style={{
            height: sizeConfig.height,
            padding: sizeConfig.padding,
            fontSize: sizeConfig.fontSize,
            fontWeight: activeTab === tab.id ? 600 : 500,
            color: tab.disabled ? 'var(--muted)' : activeTab === tab.id ? 'white' : 'var(--text)',
            background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
            border: 'none',
            borderRadius: 6,
            cursor: tab.disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          {tab.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge !== undefined && tab.badge > 0 && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--accent)',
                color: activeTab === tab.id ? 'white' : 'white',
                padding: '2px 6px',
                borderRadius: 10,
                minWidth: 18,
                textAlign: 'center',
              }}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export interface N3TabPanelProps {
  children: React.ReactNode;
  activeTab: string;
  tabId: string;
}

export function N3TabPanel({ children, activeTab, tabId }: N3TabPanelProps) {
  if (activeTab !== tabId) return null;
  
  return (
    <div style={{ marginTop: 16 }}>
      {children}
    </div>
  );
}
