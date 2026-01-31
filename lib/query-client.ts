// lib/query-client.ts
/**
 * N3 Empire OS - React Query Client設定
 * 
 * Phase I Task Group F: UI高速化
 * 
 * 機能:
 * - グローバルキャッシュ設定
 * - Tab Prefetch対応
 * - デフォルトStale Time設定
 */

import { QueryClient } from '@tanstack/react-query';

// キャッシュ時間設定
export const CACHE_TIME = {
  // 頻繁に更新されるデータ
  REALTIME: 1000 * 10, // 10秒
  // 通常のデータ
  NORMAL: 1000 * 60 * 5, // 5分
  // ほぼ静的なデータ
  STATIC: 1000 * 60 * 30, // 30分
  // マスターデータ
  MASTER: 1000 * 60 * 60, // 1時間
};

// キーファクトリー
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    list: (filters?: Record<string, unknown>) => ['products', 'list', filters] as const,
    detail: (id: number) => ['products', 'detail', id] as const,
    stats: () => ['products', 'stats'] as const,
  },
  // Orders
  orders: {
    all: ['orders'] as const,
    list: (filters?: Record<string, unknown>) => ['orders', 'list', filters] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    pending: () => ['orders', 'pending'] as const,
  },
  // Inventory
  inventory: {
    all: ['inventory'] as const,
    list: (filters?: Record<string, unknown>) => ['inventory', 'list', filters] as const,
    alerts: () => ['inventory', 'alerts'] as const,
  },
  // Finance
  finance: {
    all: ['finance'] as const,
    summary: (period?: string) => ['finance', 'summary', period] as const,
    transactions: (filters?: Record<string, unknown>) => ['finance', 'transactions', filters] as const,
  },
  // Research
  research: {
    all: ['research'] as const,
    results: (filters?: Record<string, unknown>) => ['research', 'results', filters] as const,
  },
  // System
  system: {
    health: () => ['system', 'health'] as const,
    jobs: () => ['system', 'jobs'] as const,
    metrics: () => ['system', 'metrics'] as const,
  },
  // eBay
  ebay: {
    tokens: () => ['ebay', 'tokens'] as const,
    policies: () => ['ebay', 'policies'] as const,
  },
};

// Query Client インスタンス生成
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_TIME.NORMAL,
        gcTime: CACHE_TIME.MASTER, // cacheTime の新名称
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        refetchOnWindowFocus: false, // パフォーマンス優先
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// シングルトンインスタンス（CSR用）
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // SSR: 毎回新しいインスタンス
    return createQueryClient();
  }
  // CSR: シングルトン
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}

// Prefetch ヘルパー
export async function prefetchProducts(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.stats(),
    queryFn: async () => {
      const res = await fetch('/api/products/stats');
      return res.json();
    },
    staleTime: CACHE_TIME.NORMAL,
  });
}

export async function prefetchOrders(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.orders.pending(),
    queryFn: async () => {
      const res = await fetch('/api/orders?status=pending&limit=20');
      return res.json();
    },
    staleTime: CACHE_TIME.REALTIME,
  });
}

export async function prefetchSystemHealth(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.system.health(),
    queryFn: async () => {
      const res = await fetch('/api/dispatch/status');
      return res.json();
    },
    staleTime: CACHE_TIME.REALTIME,
  });
}

// Tab Prefetch マッピング
export const TAB_PREFETCH_MAP: Record<string, (qc: QueryClient) => Promise<void>> = {
  'editing-n3': prefetchProducts,
  'operations-n3': prefetchOrders,
  'control-n3': prefetchSystemHealth,
};

// onMouseEnter で呼び出すPrefetch関数
export function prefetchForTab(tabId: string, queryClient: QueryClient) {
  const prefetchFn = TAB_PREFETCH_MAP[tabId];
  if (prefetchFn) {
    prefetchFn(queryClient);
  }
}
