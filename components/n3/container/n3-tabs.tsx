'use client';

import React, { memo, ReactNode, useState, useCallback, createContext, useContext } from 'react';

// ============================================
// Context for Tabs
// ============================================
interface TabsContextValue {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within N3Tabs');
  }
  return context;
};

// ============================================
// N3Tabs - shadcn/ui style Tabs Root
// ============================================
export interface N3TabsRootProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const N3TabsRoot = memo(function N3TabsRoot({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = '',
}: N3TabsRootProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const activeTab = controlledValue ?? internalValue;

  const handleTabChange = useCallback(
    (tabId: string) => {
      setInternalValue(tabId);
      onValueChange?.(tabId);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
      <div className={`n3-tabs-root ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
});

// ============================================
// N3TabsList
// ============================================
export interface N3TabsListProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const N3TabsList = memo(function N3TabsList({
  children,
  className = '',
  style,
}: N3TabsListProps) {
  return (
    <div className={`n3-tabs-list ${className}`} role="tablist" style={style}>
      {children}
    </div>
  );
});

// ============================================
// N3TabsTrigger
// ============================================
export interface N3TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export const N3TabsTrigger = memo(function N3TabsTrigger({
  value,
  children,
  disabled = false,
  className = '',
}: N3TabsTriggerProps) {
  const { activeTab, onTabChange } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      className={`n3-tab-trigger ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && onTabChange(value)}
    >
      {children}
    </button>
  );
});

// ============================================
// N3TabsContent
// ============================================
export interface N3TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const N3TabsContent = memo(function N3TabsContent({
  value,
  children,
  className = '',
  style,
}: N3TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div className={`n3-tabs-content ${className}`} role="tabpanel" style={style}>
      {children}
    </div>
  );
});

// ============================================
// Legacy N3Tabs - 既存のタブコンポーネント
// ============================================
export interface N3TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
  content?: ReactNode;
}

export interface N3TabsProps {
  tabs: N3TabItem[];
  activeTab?: string;
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'boxed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string;
}

export const N3Tabs = memo(function N3Tabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
}: N3TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = useCallback(
    (tabId: string) => {
      if (tabs.find((t) => t.id === tabId)?.disabled) return;

      setInternalActiveTab(tabId);
      onChange?.(tabId);
    },
    [tabs, onChange]
  );

  const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={`n3-tabs ${className}`}>
      <div
        className={`n3-tabs-list ${variant} ${size} ${fullWidth ? 'full-width' : ''}`}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`n3-tab ${activeTab === tab.id ? 'active' : ''} ${
              tab.disabled ? 'disabled' : ''
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            tabIndex={tab.disabled ? -1 : 0}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span className="n3-tab-icon">{tab.icon}</span>}
            <span className="n3-tab-label">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="n3-tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {(activeTabContent || children) && (
        <div className="n3-tabs-content" role="tabpanel">
          {activeTabContent || children}
        </div>
      )}
    </div>
  );
});

export default N3Tabs;
