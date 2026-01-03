// app/tools/amazon-research-n3/store/use-amazon-research-store.ts
/**
 * Amazon Research N3 - Zustand Store
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useMemo } from 'react';
import type { 
  AmazonResearchItem, 
  ResearchFilter, 
  ResearchSortType, 
  ResearchStats,
  AutoResearchConfig,
  ResearchFilterType,
} from '../types';

// ============================================================
// State型定義
// ============================================================

interface AmazonResearchState {
  // データ
  items: AmazonResearchItem[];
  
  // ローディング
  isLoading: boolean;
  isProcessing: boolean;
  loadingMessage: string;
  
  // エラー
  error: string | null;
  
  // バッチ処理
  batchProgress: { current: number; total: number; message: string } | null;
  
  // フィルター・ソート
  filter: ResearchFilter;
  sortType: ResearchSortType;
  searchQuery: string;
  
  // 選択
  selectedIds: Set<string>;
  
  // 詳細パネル
  selectedItem: AmazonResearchItem | null;
  showDetailPanel: boolean;
  
  // 統計
  stats: ResearchStats;
  
  // 表示設定
  viewMode: 'list' | 'card';
  pageSize: number;
  currentPage: number;
  
  // 自動化設定
  autoConfigs: AutoResearchConfig[];
  
  // アクション
  setItems: (items: AmazonResearchItem[]) => void;
  addItems: (items: AmazonResearchItem[]) => void;
  updateItem: (id: string, updates: Partial<AmazonResearchItem>) => void;
  removeItems: (ids: string[]) => void;
  
  setIsLoading: (loading: boolean) => void;
  setIsProcessing: (processing: boolean) => void;
  setLoadingMessage: (message: string) => void;
  setError: (error: string | null) => void;
  setBatchProgress: (progress: { current: number; total: number; message: string } | null) => void;
  
  setFilter: (filter: Partial<ResearchFilter>) => void;
  setSortType: (sortType: ResearchSortType) => void;
  setSearchQuery: (query: string) => void;
  
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  selectByFilter: (filterFn: (item: AmazonResearchItem) => boolean) => void;
  
  setSelectedItem: (item: AmazonResearchItem | null) => void;
  setShowDetailPanel: (show: boolean) => void;
  
  setStats: (stats: ResearchStats) => void;
  recalculateStats: () => void;
  
  setViewMode: (mode: 'list' | 'card') => void;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  
  setAutoConfigs: (configs: AutoResearchConfig[]) => void;
  addAutoConfig: (config: AutoResearchConfig) => void;
  updateAutoConfig: (id: string, updates: Partial<AutoResearchConfig>) => void;
  removeAutoConfig: (id: string) => void;
  
  reset: () => void;
}

// ============================================================
// 初期値
// ============================================================

const initialStats: ResearchStats = {
  total: 0,
  completed: 0,
  pending: 0,
  errors: 0,
  high_score_count: 0,
  medium_score_count: 0,
  low_score_count: 0,
  profitable_count: 0,
  marginal_count: 0,
  unprofitable_count: 0,
  high_sales_count: 0,
  medium_sales_count: 0,
  low_sales_count: 0,
  low_competition_count: 0,
  medium_competition_count: 0,
  high_competition_count: 0,
  new_products_count: 0,
  variation_candidates_count: 0,
  set_candidates_count: 0,
  risky_count: 0,
  exists_in_db_count: 0,
  auto_tracked_count: 0,
  avg_score: 0,
  avg_profit_margin: 0,
  avg_monthly_sales: 0,
  avg_bsr: 0,
  avg_review_count: 0,
  top_categories: [],
  top_brands: [],
};

const initialFilter: ResearchFilter = {
  type: 'all',
};

// ============================================================
// Store
// ============================================================

export const useAmazonResearchStore = create<AmazonResearchState>()(
  devtools(
    (set, get) => ({
      // 初期状態
      items: [],
      isLoading: false,
      isProcessing: false,
      loadingMessage: '',
      error: null,
      batchProgress: null,
      filter: initialFilter,
      sortType: 'score_desc',
      searchQuery: '',
      selectedIds: new Set(),
      selectedItem: null,
      showDetailPanel: false,
      stats: initialStats,
      viewMode: 'list',
      pageSize: 100,
      currentPage: 1,
      autoConfigs: [],

      // データ操作
      setItems: (items) => set({ items, currentPage: 1 }),
      
      addItems: (newItems) => set((state) => ({
        items: [...state.items, ...newItems],
      })),
      
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
        ),
        selectedItem: state.selectedItem?.id === id 
          ? { ...state.selectedItem, ...updates } 
          : state.selectedItem,
      })),
      
      removeItems: (ids) => set((state) => ({
        items: state.items.filter((item) => !ids.includes(item.id)),
        selectedIds: new Set([...state.selectedIds].filter((id) => !ids.includes(id))),
      })),

      // ローディング
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setLoadingMessage: (loadingMessage) => set({ loadingMessage }),
      setError: (error) => set({ error }),
      setBatchProgress: (batchProgress) => set({ batchProgress }),

      // フィルター・ソート
      setFilter: (filter) => set((state) => ({
        filter: { ...state.filter, ...filter },
        currentPage: 1,
      })),
      setSortType: (sortType) => set({ sortType }),
      setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),

      // 選択
      toggleSelection: (id) => set((state) => {
        const newSet = new Set(state.selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        return { selectedIds: newSet };
      }),
      
      selectAll: () => set((state) => ({
        selectedIds: new Set(state.items.map((i) => i.id)),
      })),
      
      deselectAll: () => set({ selectedIds: new Set() }),
      
      selectByFilter: (filterFn) => set((state) => ({
        selectedIds: new Set(state.items.filter(filterFn).map((i) => i.id)),
      })),

      // 詳細パネル
      setSelectedItem: (selectedItem) => set({ selectedItem }),
      setShowDetailPanel: (showDetailPanel) => set({ showDetailPanel }),

      // 統計
      setStats: (stats) => set({ stats }),
      
      recalculateStats: () => set((state) => {
        const items = state.items;
        const total = items.length;
        
        if (total === 0) {
          set({ stats: initialStats });
          return {};
        }
        
        const displayScore = (i: AmazonResearchItem) => i.n3_keepa_score ?? i.n3_score ?? 0;
        
        const stats: ResearchStats = {
          total,
          completed: items.filter((i) => i.status === 'completed').length,
          pending: items.filter((i) => i.status === 'pending' || i.status === 'processing').length,
          errors: items.filter((i) => i.status === 'error').length,
          
          high_score_count: items.filter((i) => displayScore(i) >= 80).length,
          medium_score_count: items.filter((i) => displayScore(i) >= 60 && displayScore(i) < 80).length,
          low_score_count: items.filter((i) => displayScore(i) < 60).length,
          
          profitable_count: items.filter((i) => (i.estimated_profit_margin || 0) >= 20).length,
          marginal_count: items.filter((i) => {
            const m = i.estimated_profit_margin || 0;
            return m >= 10 && m < 20;
          }).length,
          unprofitable_count: items.filter((i) => (i.estimated_profit_margin || 0) < 10).length,
          
          high_sales_count: items.filter((i) => (i.monthly_sales_estimate || 0) >= 100).length,
          medium_sales_count: items.filter((i) => {
            const s = i.monthly_sales_estimate || 0;
            return s >= 30 && s < 100;
          }).length,
          low_sales_count: items.filter((i) => (i.monthly_sales_estimate || 0) < 30).length,
          
          low_competition_count: items.filter((i) => (i.fba_offer_count || 0) <= 5).length,
          medium_competition_count: items.filter((i) => {
            const c = i.fba_offer_count || 0;
            return c > 5 && c <= 15;
          }).length,
          high_competition_count: items.filter((i) => (i.fba_offer_count || 0) > 15).length,
          
          new_products_count: items.filter((i) => i.is_new_product).length,
          variation_candidates_count: items.filter((i) => i.is_variation_candidate).length,
          set_candidates_count: items.filter((i) => i.is_set_candidate).length,
          risky_count: items.filter((i) => i.risk_level === 'high' || i.risk_level === 'medium').length,
          
          exists_in_db_count: items.filter((i) => i.status === 'exists').length,
          auto_tracked_count: items.filter((i) => i.is_auto_tracked).length,
          
          avg_score: Math.round(items.reduce((sum, i) => sum + displayScore(i), 0) / total),
          avg_profit_margin: Math.round(items.reduce((sum, i) => sum + (i.estimated_profit_margin || 0), 0) / total * 10) / 10,
          avg_monthly_sales: Math.round(items.reduce((sum, i) => sum + (i.monthly_sales_estimate || 0), 0) / total),
          avg_bsr: Math.round(items.reduce((sum, i) => sum + (i.bsr_current || 0), 0) / total),
          avg_review_count: Math.round(items.reduce((sum, i) => sum + (i.review_count || 0), 0) / total),
          
          top_categories: calculateTopItems(items, 'category'),
          top_brands: calculateTopItems(items, 'brand'),
        };
        
        return { stats };
      }),

      // 表示設定
      setViewMode: (viewMode) => set({ viewMode }),
      setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),
      setCurrentPage: (currentPage) => set({ currentPage }),

      // 自動化
      setAutoConfigs: (autoConfigs) => set({ autoConfigs }),
      addAutoConfig: (config) => set((state) => ({
        autoConfigs: [...state.autoConfigs, config],
      })),
      updateAutoConfig: (id, updates) => set((state) => ({
        autoConfigs: state.autoConfigs.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      })),
      removeAutoConfig: (id) => set((state) => ({
        autoConfigs: state.autoConfigs.filter((c) => c.id !== id),
      })),

      // リセット
      reset: () => set({
        items: [],
        isLoading: false,
        isProcessing: false,
        loadingMessage: '',
        error: null,
        batchProgress: null,
        filter: initialFilter,
        sortType: 'score_desc',
        searchQuery: '',
        selectedIds: new Set(),
        selectedItem: null,
        showDetailPanel: false,
        stats: initialStats,
        currentPage: 1,
      }),
    }),
    { name: 'amazon-research-store' }
  )
);

// ============================================================
// ユーティリティ
// ============================================================

function calculateTopItems(
  items: AmazonResearchItem[],
  field: 'category' | 'brand'
): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const value = item[field];
    if (value) counts[value] = (counts[value] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// ============================================================
// セレクター（フィルタリング・ソート済みアイテム）
// ============================================================

export function useFilteredItems(): AmazonResearchItem[] {
  const { items, filter, sortType, searchQuery } = useAmazonResearchStore();
  
  return useMemo(() => {
    let filtered = [...items];
    
    // 検索フィルター
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((i) =>
        i.asin?.toLowerCase().includes(q) ||
        i.title?.toLowerCase().includes(q) ||
        i.brand?.toLowerCase().includes(q)
      );
    }
    
    // タイプフィルター
    const displayScore = (i: AmazonResearchItem) => i.n3_keepa_score ?? i.n3_score ?? 0;
    
    switch (filter.type) {
      case 'high_score':
        filtered = filtered.filter((i) => displayScore(i) >= 80);
        break;
      case 'profitable':
        filtered = filtered.filter((i) => (i.estimated_profit_margin || 0) >= 20);
        break;
      case 'high_sales':
        filtered = filtered.filter((i) => (i.monthly_sales_estimate || 0) >= 100);
        break;
      case 'low_competition':
        filtered = filtered.filter((i) => (i.fba_offer_count || 0) <= 5);
        break;
      case 'new_products':
        filtered = filtered.filter((i) => i.is_new_product);
        break;
      case 'risky':
        filtered = filtered.filter((i) => i.risk_level === 'high' || i.risk_level === 'medium');
        break;
      case 'exists':
        filtered = filtered.filter((i) => i.status === 'exists');
        break;
      case 'variation_candidates':
        filtered = filtered.filter((i) => i.is_variation_candidate);
        break;
      case 'set_candidates':
        filtered = filtered.filter((i) => i.is_set_candidate);
        break;
      case 'auto_tracked':
        filtered = filtered.filter((i) => i.is_auto_tracked);
        break;
    }
    
    // カスタムフィルター
    if (filter.category) {
      filtered = filtered.filter((i) => i.category === filter.category);
    }
    if (filter.brand) {
      filtered = filtered.filter((i) => i.brand === filter.brand);
    }
    if (filter.minScore !== undefined) {
      filtered = filtered.filter((i) => displayScore(i) >= filter.minScore!);
    }
    if (filter.maxScore !== undefined) {
      filtered = filtered.filter((i) => displayScore(i) <= filter.maxScore!);
    }
    if (filter.minProfit !== undefined) {
      filtered = filtered.filter((i) => (i.estimated_profit_margin || 0) >= filter.minProfit!);
    }
    if (filter.minBsr !== undefined) {
      filtered = filtered.filter((i) => (i.bsr_current || 999999) >= filter.minBsr!);
    }
    if (filter.maxBsr !== undefined) {
      filtered = filtered.filter((i) => (i.bsr_current || 0) <= filter.maxBsr!);
    }
    
    // ソート
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'score_desc':
          return displayScore(b) - displayScore(a);
        case 'score_asc':
          return displayScore(a) - displayScore(b);
        case 'profit_desc':
          return (b.estimated_profit_margin || 0) - (a.estimated_profit_margin || 0);
        case 'profit_asc':
          return (a.estimated_profit_margin || 0) - (b.estimated_profit_margin || 0);
        case 'sales_desc':
          return (b.monthly_sales_estimate || 0) - (a.monthly_sales_estimate || 0);
        case 'sales_asc':
          return (a.monthly_sales_estimate || 0) - (b.monthly_sales_estimate || 0);
        case 'bsr_asc':
          return (a.bsr_current || 999999) - (b.bsr_current || 999999);
        case 'bsr_desc':
          return (b.bsr_current || 0) - (a.bsr_current || 0);
        case 'review_desc':
          return (b.review_count || 0) - (a.review_count || 0);
        case 'price_desc':
          return (b.amazon_price_jpy || 0) - (a.amazon_price_jpy || 0);
        case 'price_asc':
          return (a.amazon_price_jpy || 0) - (b.amazon_price_jpy || 0);
        case 'date_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [items, filter, sortType, searchQuery]);
}

// ページネーション済みアイテム
export function usePaginatedItems(): AmazonResearchItem[] {
  const filteredItems = useFilteredItems();
  const { pageSize, currentPage } = useAmazonResearchStore();
  
  return useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, pageSize, currentPage]);
}

// 選択されたアイテム
export function useSelectedItems(): AmazonResearchItem[] {
  const { items, selectedIds } = useAmazonResearchStore();
  return useMemo(() => 
    items.filter((i) => selectedIds.has(i.id)),
    [items, selectedIds]
  );
}
