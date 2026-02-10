// app/tools/editing/hooks/use-ui-state.ts
/**
 * UI状態管理フック
 * 
 * 責務:
 * - 表示モード（リスト/カード）
 * - テキスト折り返し
 * - 言語設定
 * - 仮想スクロール
 * - L2タブ状態
 */

import { useState, useCallback, useEffect } from 'react';

export type L2TabId = 'basic-edit' | 'logistics' | 'compliance' | 'media' | 'history' | 'inventory-ai';
export type ViewMode = 'list' | 'card';
export type Language = 'ja' | 'en';

interface UseUIStateReturn {
  // L2タブ
  activeL2Tab: L2TabId;
  setActiveL2Tab: (tab: L2TabId) => void;
  
  // 表示モード
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // テキスト折り返し
  wrapText: boolean;
  setWrapText: (wrap: boolean) => void;
  
  // 言語
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // 仮想スクロール
  useVirtualScroll: boolean;
  setUseVirtualScroll: (use: boolean) => void;
  
  // リストフィルター
  listFilter: string;
  setListFilter: (filter: string) => void;
}

export function useUIState(productCount: number = 0): UseUIStateReturn {
  const [activeL2Tab, setActiveL2Tab] = useState<L2TabId>('basic-edit');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [wrapText, setWrapText] = useState(false);
  const [language, setLanguage] = useState<Language>('ja');
  const [useVirtualScroll, setUseVirtualScroll] = useState(false);
  const [listFilter, setListFilter] = useState('all');

  // 商品数が多い場合は自動で仮想スクロールを有効化
  useEffect(() => {
    if (productCount > 100 && !useVirtualScroll) {
      setUseVirtualScroll(true);
    }
  }, [productCount, useVirtualScroll]);

  return {
    activeL2Tab,
    setActiveL2Tab,
    viewMode,
    setViewMode,
    wrapText,
    setWrapText,
    language,
    setLanguage,
    useVirtualScroll,
    setUseVirtualScroll,
    listFilter,
    setListFilter,
  };
}
