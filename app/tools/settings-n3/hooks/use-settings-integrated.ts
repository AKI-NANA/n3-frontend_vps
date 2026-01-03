// app/tools/settings-n3/hooks/use-settings-integrated.ts
/**
 * Settings N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - Domain State: React Query (サーバーデータ)
 * - UI State: Zustand (タブ、検索、展開状態)
 * - 統合フックでマージして単一インターフェースを提供
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import {
  useSettingsUIStore,
  useSettingsActiveTab,
  useSettingsActiveSection,
  useSettingsHtsSearch,
  useSettingsHtsSelectedCategory,
  useSettingsHasUnsavedChanges,
  useSettingsValidationErrors,
  useSettingsCredentialFilter,
  type SettingsTabId,
  type SettingsSectionId,
} from '@/store/n3';
import type {
  HTSCategory,
  EbaySettings,
  AutomationRule,
  Credential,
} from '../types/settings';

// ============================================================
// API関数
// ============================================================

interface FetchHTSResponse {
  categories: HTSCategory[];
  total: number;
}

async function fetchHTSCategories(search: string): Promise<FetchHTSResponse> {
  // 実API呼び出し: /api/hts/search
  if (!search) {
    return { categories: [], total: 0 };
  }

  const response = await fetch(`/api/hts/search?keyword=${encodeURIComponent(search)}&limit=20`);
  if (!response.ok) {
    throw new Error('Failed to fetch HTS categories');
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'API returned error');
  }

  const categories: HTSCategory[] = (json.results || []).map((item: any, index: number) => ({
    id: `hts-${index}`,
    code: item.hts_code || '',
    name: item.notes || '',
    description: item.notes || '',
    dutyRate: item.countries?.[0]?.duty_rate || 0,
    children: [],
  }));

  return { categories, total: categories.length };
}

interface FetchEbaySettingsResponse {
  settings: EbaySettings;
  accounts: { id: string; name: string; status: 'active' | 'expired' }[];
}

async function fetchEbaySettings(): Promise<FetchEbaySettingsResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    settings: {
      defaultShipping: {
        domestic: 'FedEx',
        international: 'DHL',
      },
      returnPolicy: {
        accepted: true,
        period: 30,
        paidBy: 'buyer',
      },
      paymentPolicy: 'immediate',
      listingDuration: 'GTC',
      autoRelist: true,
      bestOfferEnabled: true,
      bestOfferAutoAcceptPercent: 90,
      bestOfferAutoDeclinePercent: 70,
    },
    accounts: [
      { id: 'acc-1', name: 'MainStore', status: 'active' },
      { id: 'acc-2', name: 'SecondaryStore', status: 'active' },
      { id: 'acc-3', name: 'TestStore', status: 'expired' },
    ],
  };
}

interface FetchAutomationRulesResponse {
  rules: AutomationRule[];
  stats: {
    active: number;
    disabled: number;
    lastRun: string;
    successRate: number;
  };
}

async function fetchAutomationRules(): Promise<FetchAutomationRulesResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const rules: AutomationRule[] = [
    {
      id: 'rule-1',
      name: '価格自動調整',
      description: '競合より5%安く自動調整',
      enabled: true,
      trigger: 'competitor_price_change',
      action: 'adjust_price',
      conditions: { minMargin: 20, maxDiscount: 15 },
      lastRun: new Date().toISOString(),
      runCount: 150,
      successCount: 145,
    },
    {
      id: 'rule-2',
      name: '在庫切れアラート',
      description: '在庫が5個以下になったら通知',
      enabled: true,
      trigger: 'low_stock',
      action: 'send_notification',
      conditions: { threshold: 5 },
      lastRun: new Date().toISOString(),
      runCount: 30,
      successCount: 30,
    },
    {
      id: 'rule-3',
      name: '自動出品',
      description: '新商品を自動的に全マーケットプレイスに出品',
      enabled: false,
      trigger: 'new_product',
      action: 'create_listing',
      conditions: { marketplaces: ['ebay', 'amazon', 'mercari'] },
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      runCount: 50,
      successCount: 48,
    },
  ];

  return {
    rules,
    stats: {
      active: rules.filter(r => r.enabled).length,
      disabled: rules.filter(r => !r.enabled).length,
      lastRun: new Date().toISOString(),
      successRate: 96.5,
    },
  };
}

interface FetchCredentialsResponse {
  credentials: Credential[];
}

async function fetchCredentials(filter: string): Promise<FetchCredentialsResponse> {
  // 実API呼び出し: /api/credentials
  const response = await fetch('/api/credentials');
  if (!response.ok) {
    throw new Error('Failed to fetch credentials');
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'API returned error');
  }

  const now = new Date();
  const allCredentials: Credential[] = (json.credentials || []).map((cred: any) => {
    let status: 'valid' | 'expiring' | 'expired' = 'valid';
    if (cred.token_expires_at) {
      const expiresAt = new Date(cred.token_expires_at);
      const daysUntilExpiry = (expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
      if (daysUntilExpiry < 0) {
        status = 'expired';
      } else if (daysUntilExpiry < 7) {
        status = 'expiring';
      }
    }
    if (cred.is_token_valid === false) {
      status = 'expired';
    }

    return {
      id: String(cred.id),
      name: cred.marketplace_name || 'Unknown',
      type: cred.has_api_key ? 'api_key' : 'oauth',
      status,
      expiresAt: cred.token_expires_at || '',
      lastUsed: cred.last_token_validation_at || cred.updated_at || '',
    } as Credential;
  });

  const filtered = filter === 'all'
    ? allCredentials
    : allCredentials.filter(c => c.status === filter);

  return { credentials: filtered };
}

async function saveSettings(data: Record<string, unknown>): Promise<void> {
  // 設定保存API（汎用）
  console.log('Settings saved:', data);
}

async function toggleAutomationRule(id: string, enabled: boolean): Promise<void> {
  // 自動化ルールのトグルAPI
  console.log('Toggle rule:', id, enabled);
}

async function refreshCredential(id: string): Promise<void> {
  // 認証情報リフレッシュAPI
  const response = await fetch('/api/credentials?action=health');
  if (!response.ok) {
    throw new Error('Failed to refresh credential');
  }
}

// ============================================================
// 統合フック
// ============================================================

export function useSettingsIntegrated() {
  const queryClient = useQueryClient();

  // ===== UI State (Zustand) =====
  const activeTab = useSettingsActiveTab();
  const activeSection = useSettingsActiveSection();
  const htsSearch = useSettingsHtsSearch();
  const htsSelectedCategory = useSettingsHtsSelectedCategory();
  const hasUnsavedChanges = useSettingsHasUnsavedChanges();
  const validationErrors = useSettingsValidationErrors();
  const credentialFilter = useSettingsCredentialFilter();

  // ===== UI Actions =====
  const store = useSettingsUIStore();
  const {
    setActiveTab,
    setActiveSection,
    setHtsSearch,
    setHtsSelectedCategory,
    toggleHtsNode,
    setEbayActiveAccount,
    toggleEbayAdvanced,
    setAutomationActiveRule,
    toggleAutomationShowDisabled,
    setCredentialFilter,
    setCredentialSearch,
    setHasUnsavedChanges,
    setLastSavedAt,
    setValidationError,
    clearValidationErrors,
    reset,
  } = store;

  // ===== Domain State (React Query) =====

  // HTS分類
  const htsQuery = useQuery({
    queryKey: ['settings', 'hts', htsSearch],
    queryFn: () => fetchHTSCategories(htsSearch),
    enabled: activeTab === 'hts',
    staleTime: 5 * 60 * 1000, // 5分
  });

  // eBay設定
  const ebayQuery = useQuery({
    queryKey: ['settings', 'ebay'],
    queryFn: fetchEbaySettings,
    enabled: activeTab === 'ebay',
    staleTime: 60 * 1000,
  });

  // 自動化ルール
  const automationQuery = useQuery({
    queryKey: ['settings', 'automation'],
    queryFn: fetchAutomationRules,
    enabled: activeTab === 'automation',
    staleTime: 30 * 1000,
  });

  // 認証情報
  const credentialsQuery = useQuery({
    queryKey: ['settings', 'credentials', credentialFilter],
    queryFn: () => fetchCredentials(credentialFilter),
    enabled: activeTab === 'credentials',
    staleTime: 30 * 1000,
  });

  // ===== Mutations =====
  const saveMutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      setLastSavedAt(new Date().toISOString());
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const toggleRuleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      toggleAutomationRule(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'automation'] });
    },
  });

  const refreshCredentialMutation = useMutation({
    mutationFn: refreshCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'credentials'] });
    },
  });

  // ===== マージされたデータ =====
  const htsCategories = useMemo(() => htsQuery.data?.categories ?? [], [htsQuery.data]);
  const ebaySettings = useMemo(() => ebayQuery.data?.settings ?? null, [ebayQuery.data]);
  const ebayAccounts = useMemo(() => ebayQuery.data?.accounts ?? [], [ebayQuery.data]);
  const automationRules = useMemo(() => automationQuery.data?.rules ?? [], [automationQuery.data]);
  const automationStats = useMemo(() => automationQuery.data?.stats ?? null, [automationQuery.data]);
  const credentials = useMemo(() => credentialsQuery.data?.credentials ?? [], [credentialsQuery.data]);

  // ===== コールバック =====
  const handleSave = useCallback((data: Record<string, unknown>) => {
    clearValidationErrors();
    saveMutation.mutate(data);
  }, [saveMutation, clearValidationErrors]);

  const handleToggleRule = useCallback((id: string, enabled: boolean) => {
    toggleRuleMutation.mutate({ id, enabled });
  }, [toggleRuleMutation]);

  const handleRefreshCredential = useCallback((id: string) => {
    refreshCredentialMutation.mutate(id);
  }, [refreshCredentialMutation]);

  const handleRefresh = useCallback(() => {
    if (activeTab === 'hts') htsQuery.refetch();
    if (activeTab === 'ebay') ebayQuery.refetch();
    if (activeTab === 'automation') automationQuery.refetch();
    if (activeTab === 'credentials') credentialsQuery.refetch();
  }, [activeTab, htsQuery, ebayQuery, automationQuery, credentialsQuery]);

  // ===== 返却値 =====
  return {
    // HTS
    htsCategories,
    htsSearch,
    htsSelectedCategory,

    // eBay
    ebaySettings,
    ebayAccounts,

    // 自動化
    automationRules,
    automationStats,

    // 認証情報
    credentials,
    credentialFilter,

    // UI状態
    activeTab,
    activeSection,
    hasUnsavedChanges,
    validationErrors,

    // ローディング・エラー
    isLoading: htsQuery.isLoading || ebayQuery.isLoading || automationQuery.isLoading || credentialsQuery.isLoading,
    isFetching: htsQuery.isFetching || ebayQuery.isFetching || automationQuery.isFetching || credentialsQuery.isFetching,
    isSaving: saveMutation.isPending,
    isRefreshingCredential: refreshCredentialMutation.isPending,
    error: (
      htsQuery.error instanceof Error ? htsQuery.error.message :
      ebayQuery.error instanceof Error ? ebayQuery.error.message :
      automationQuery.error instanceof Error ? automationQuery.error.message :
      credentialsQuery.error instanceof Error ? credentialsQuery.error.message : null
    ),

    // アクション
    setActiveTab,
    setActiveSection,
    setHtsSearch,
    setHtsSelectedCategory,
    toggleHtsNode,
    setEbayActiveAccount,
    toggleEbayAdvanced,
    setAutomationActiveRule,
    toggleAutomationShowDisabled,
    setCredentialFilter,
    setCredentialSearch,
    setHasUnsavedChanges,
    setValidationError,
    clearValidationErrors,
    reset,

    // データ操作
    save: handleSave,
    toggleRule: handleToggleRule,
    refreshCredential: handleRefreshCredential,
    refresh: handleRefresh,
  };
}

export default useSettingsIntegrated;
