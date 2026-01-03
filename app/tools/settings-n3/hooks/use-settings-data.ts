// app/tools/settings-n3/hooks/use-settings-data.ts
/**
 * Settings N3 データフック
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  HTSCode,
  EbaySettings,
  AmazonSettings,
  AutomationRule,
  Credential,
  SystemSetting,
} from '../types/settings';

// モックHTSデータ
const mockHTS: HTSCode[] = [
  {
    id: 'hts-1',
    code: '42',
    description: '革製品、旅行用品、ハンドバッグ類',
    level: 1,
    children: [
      {
        id: 'hts-1-1',
        code: '4202',
        description: 'トランク、スーツケース、ハンドバッグ',
        parentId: 'hts-1',
        level: 2,
        children: [
          { id: 'hts-1-1-1', code: '4202.11', description: '外面が革製のもの', parentId: 'hts-1-1', level: 3, rate: 8 },
          { id: 'hts-1-1-2', code: '4202.12', description: '外面がプラスチック製のもの', parentId: 'hts-1-1', level: 3, rate: 5.3 },
        ],
      },
    ],
  },
  {
    id: 'hts-2',
    code: '91',
    description: '時計及びその部品',
    level: 1,
    children: [
      {
        id: 'hts-2-1',
        code: '9101',
        description: '腕時計（ケースが貴金属製）',
        parentId: 'hts-2',
        level: 2,
        rate: 6.4,
      },
      {
        id: 'hts-2-2',
        code: '9102',
        description: '腕時計（その他）',
        parentId: 'hts-2',
        level: 2,
        rate: 5.3,
      },
    ],
  },
];

// モックeBay設定
const mockEbaySettings: EbaySettings[] = [
  {
    id: 'ebay-1',
    accountName: 'MainStore',
    siteId: 'EBAY_US',
    paymentPolicy: 'PayPal Immediate',
    shippingPolicy: 'Free Shipping',
    returnPolicy: '30 Days Return',
    isActive: true,
    lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'ebay-2',
    accountName: 'JapanStore',
    siteId: 'EBAY_JP',
    paymentPolicy: 'PayPal',
    shippingPolicy: 'Standard',
    returnPolicy: '14 Days Return',
    isActive: false,
  },
];

// モック自動化ルール
const mockAutomationRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: '在庫切れ通知',
    trigger: 'condition',
    triggerConfig: { field: 'quantity', operator: 'lte', value: 5 },
    actions: [{ id: 'action-1', type: 'notification', config: { channel: 'email' } }],
    isActive: true,
    lastRun: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    runCount: 156,
  },
  {
    id: 'rule-2',
    name: '価格自動調整',
    trigger: 'time',
    triggerConfig: { cron: '0 */6 * * *' },
    actions: [{ id: 'action-2', type: 'price_update', config: { strategy: 'competitive' } }],
    isActive: true,
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    runCount: 89,
  },
  {
    id: 'rule-3',
    name: '在庫同期',
    trigger: 'time',
    triggerConfig: { cron: '0 0 * * *' },
    actions: [{ id: 'action-3', type: 'inventory_sync', config: { platforms: ['ebay', 'amazon'] } }],
    isActive: false,
    runCount: 45,
  },
];

// モック認証情報
const mockCredentials: Credential[] = [
  { id: 'cred-1', name: 'eBay API', type: 'oauth', platform: 'ebay', status: 'active', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cred-2', name: 'Amazon MWS', type: 'api_key', platform: 'amazon', status: 'active' },
  { id: 'cred-3', name: 'Mercari API', type: 'oauth', platform: 'mercari', status: 'expired', expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
];

export function useSettingsData() {
  const [htsData, setHtsData] = useState<HTSCode[]>(mockHTS);
  const [ebaySettings, setEbaySettings] = useState<EbaySettings[]>(mockEbaySettings);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [credentials, setCredentials] = useState<Credential[]>(mockCredentials);
  const [loading, setLoading] = useState(false);

  // HTS検索
  const searchHTS = useCallback((query: string): HTSCode[] => {
    const search = (nodes: HTSCode[]): HTSCode[] => {
      return nodes.flatMap(node => {
        const matches = node.code.includes(query) || node.description.includes(query);
        const childMatches = node.children ? search(node.children) : [];
        return matches ? [node, ...childMatches] : childMatches;
      });
    };
    return query ? search(htsData) : htsData;
  }, [htsData]);

  // 自動化ルール切り替え
  const toggleAutomationRule = useCallback((id: string) => {
    setAutomationRules(prev =>
      prev.map(rule => (rule.id === id ? { ...rule, isActive: !rule.isActive } : rule))
    );
  }, []);

  // eBay設定切り替え
  const toggleEbayAccount = useCallback((id: string) => {
    setEbaySettings(prev =>
      prev.map(setting => (setting.id === id ? { ...setting, isActive: !setting.isActive } : setting))
    );
  }, []);

  // 認証情報更新
  const refreshCredential = useCallback(async (id: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCredentials(prev =>
      prev.map(cred =>
        cred.id === id
          ? { ...cred, status: 'active' as const, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
          : cred
      )
    );
    setLoading(false);
  }, []);

  // リフレッシュ
  const refresh = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  }, []);

  return {
    htsData,
    ebaySettings,
    automationRules,
    credentials,
    searchHTS,
    toggleAutomationRule,
    toggleEbayAccount,
    refreshCredential,
    loading,
    refresh,
  };
}

export default useSettingsData;
