// contexts/HeaderPanelContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type PanelTabId = 'tools' | 'flow' | 'filter' | null;

interface HeaderPanelContextType {
  toolsPanel: ReactNode | null;
  flowPanel: ReactNode | null;
  filterPanel: ReactNode | null;
  setToolsPanel: (panel: ReactNode | null) => void;
  setFlowPanel: (panel: ReactNode | null) => void;
  setFilterPanel: (panel: ReactNode | null) => void;
  // ピン留め状態
  pinnedTab: PanelTabId;
  setPinnedTab: (tab: PanelTabId) => void;
  pinnedPanel: ReactNode | null;
}

const HeaderPanelContext = createContext<HeaderPanelContextType | null>(null);

export function HeaderPanelProvider({ children }: { children: ReactNode }) {
  const [toolsPanel, setToolsPanel] = useState<ReactNode | null>(null);
  const [flowPanel, setFlowPanel] = useState<ReactNode | null>(null);
  const [filterPanel, setFilterPanel] = useState<ReactNode | null>(null);
  const [pinnedTab, setPinnedTab] = useState<PanelTabId>(null);

  // ピン留めされたパネルのコンテンツ
  const pinnedPanel = pinnedTab === 'tools' ? toolsPanel
    : pinnedTab === 'flow' ? flowPanel
    : pinnedTab === 'filter' ? filterPanel
    : null;

  return (
    <HeaderPanelContext.Provider value={{
      toolsPanel,
      flowPanel,
      filterPanel,
      setToolsPanel,
      setFlowPanel,
      setFilterPanel,
      pinnedTab,
      setPinnedTab,
      pinnedPanel,
    }}>
      {children}
    </HeaderPanelContext.Provider>
  );
}

export function useHeaderPanel() {
  const context = useContext(HeaderPanelContext);
  if (!context) {
    throw new Error('useHeaderPanel must be used within HeaderPanelProvider');
  }
  return context;
}
