// contexts/TenantContext.tsx
/**
 * 🏢 Tenant Context - マルチテナント状態管理
 * 
 * Phase 4A: Tenant Layer
 * 
 * 機能:
 * - 現在のOrganization管理
 * - Organization切替
 * - プラン・使用量情報
 * - テナントコンテキストの提供
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

// ============================================================
// 型定義
// ============================================================

export type PlanId = 'free' | 'pro' | 'empire';
export type UserRole = 'admin' | 'operator' | 'viewer';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: PlanId;
  planExpiresAt?: string;
  settings: OrganizationSettings;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  timezone?: string;
  currency?: string;
  language?: string;
  notifications?: {
    email?: boolean;
    slack?: boolean;
    chatwork?: boolean;
  };
  integrations?: {
    ebay?: boolean;
    amazon?: boolean;
    n8n?: boolean;
  };
}

export interface PlanLimits {
  dispatchPerMonth: number;  // -1 = unlimited
  concurrentJobs: number;
  storageGb: number;
  apiCallsPerDay: number;    // -1 = unlimited
}

export interface UsageStats {
  dispatchThisMonth: number;
  dispatchLimit: number;
  concurrentJobs: number;
  concurrentLimit: number;
  apiCallsToday: number;
  apiCallsLimit: number;
  storageUsedGb: number;
  storageLimit: number;
}

export interface TenantState {
  organization: Organization | null;
  organizations: Organization[];
  role: UserRole;
  plan: PlanId;
  limits: PlanLimits;
  usage: UsageStats | null;
  isLoading: boolean;
  error: string | null;
}

export interface TenantContextType extends TenantState {
  // Actions
  switchOrganization: (organizationId: string) => Promise<void>;
  refreshOrganization: () => Promise<void>;
  refreshUsage: () => Promise<void>;
  updateOrganizationSettings: (settings: Partial<OrganizationSettings>) => Promise<void>;
  
  // Helpers
  hasFeature: (featureId: string) => boolean;
  canDispatch: () => boolean;
  getPlanDisplayName: () => string;
  getUpgradeUrl: () => string;
}

// ============================================================
// プラン機能マトリックス
// ============================================================

const PLAN_FEATURES: Record<PlanId, string[]> = {
  free: [
    'research-basic',
    'listing-manual',
    'job-monitor',
    'usage-view',
  ],
  pro: [
    'research-basic',
    'research-advanced',
    'listing-manual',
    'listing-auto',
    'inventory-sync',
    'job-monitor',
    'job-retry',
    'usage-view',
    'metrics-view',
    'api-access',
  ],
  empire: [
    'research-basic',
    'research-advanced',
    'research-batch',
    'listing-manual',
    'listing-auto',
    'listing-multi-region',
    'inventory-sync',
    'inventory-bulk',
    'media-video',
    'media-audio',
    'job-monitor',
    'job-retry',
    'job-cancel',
    'kill-switch',
    'usage-view',
    'metrics-view',
    'api-access',
    'webhooks',
    'custom-integrations',
  ],
};

const DEFAULT_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    dispatchPerMonth: 500,
    concurrentJobs: 1,
    storageGb: 1,
    apiCallsPerDay: 100,
  },
  pro: {
    dispatchPerMonth: 5000,
    concurrentJobs: 5,
    storageGb: 10,
    apiCallsPerDay: 1000,
  },
  empire: {
    dispatchPerMonth: -1,  // Unlimited
    concurrentJobs: 20,
    storageGb: 100,
    apiCallsPerDay: -1,    // Unlimited
  },
};

// ============================================================
// Context
// ============================================================

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [state, setState] = useState<TenantState>({
    organization: null,
    organizations: [],
    role: 'viewer',
    plan: 'free',
    limits: DEFAULT_LIMITS.free,
    usage: null,
    isLoading: true,
    error: null,
  });
  
  // ============================================================
  // データ取得
  // ============================================================
  
  const fetchOrganizations = useCallback(async () => {
    if (!user) {
      setState(prev => ({
        ...prev,
        organization: null,
        organizations: [],
        isLoading: false,
      }));
      return;
    }
    
    try {
      const res = await fetch('/api/tenant/organizations');
      
      if (!res.ok) {
        // 組織がまだない場合は空配列を返す
        if (res.status === 404) {
          setState(prev => ({
            ...prev,
            organizations: [],
            isLoading: false,
          }));
          return;
        }
        throw new Error('Failed to fetch organizations');
      }
      
      const data = await res.json();
      
      if (data.success && data.organizations) {
        setState(prev => {
          const orgs = data.organizations;
          // 現在の組織がまだ設定されていない場合、最初の組織を選択
          const currentOrg = prev.organization || orgs[0] || null;
          const plan = (currentOrg?.plan as PlanId) || 'free';
          
          return {
            ...prev,
            organizations: orgs,
            organization: currentOrg,
            plan,
            limits: DEFAULT_LIMITS[plan],
            isLoading: false,
          };
        });
      }
    } catch (error) {
      console.error('[TenantContext] Fetch error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      }));
    }
  }, [user]);
  
  const fetchUsage = useCallback(async () => {
    if (!state.organization) return;
    
    try {
      const res = await fetch(`/api/tenant/usage?organizationId=${state.organization.id}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch usage');
      }
      
      const data = await res.json();
      
      if (data.success && data.usage) {
        setState(prev => ({
          ...prev,
          usage: data.usage,
        }));
      }
    } catch (error) {
      console.error('[TenantContext] Usage fetch error:', error);
    }
  }, [state.organization]);
  
  const fetchRole = useCallback(async () => {
    if (!user || !state.organization) return;
    
    try {
      const res = await fetch(
        `/api/tenant/role?organizationId=${state.organization.id}`
      );
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.role) {
          setState(prev => ({
            ...prev,
            role: data.role as UserRole,
          }));
        }
      }
    } catch (error) {
      console.error('[TenantContext] Role fetch error:', error);
    }
  }, [user, state.organization]);
  
  // ============================================================
  // Effects
  // ============================================================
  
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);
  
  useEffect(() => {
    if (state.organization) {
      fetchUsage();
      fetchRole();
    }
  }, [state.organization, fetchUsage, fetchRole]);
  
  // 使用量の定期更新（5分ごと）
  useEffect(() => {
    if (!state.organization) return;
    
    const interval = setInterval(fetchUsage, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state.organization, fetchUsage]);
  
  // ============================================================
  // Actions
  // ============================================================
  
  const switchOrganization = useCallback(async (organizationId: string) => {
    const org = state.organizations.find(o => o.id === organizationId);
    if (!org) {
      throw new Error('Organization not found');
    }
    
    const plan = org.plan as PlanId;
    
    setState(prev => ({
      ...prev,
      organization: org,
      plan,
      limits: DEFAULT_LIMITS[plan],
      usage: null,  // Reset usage, will be refetched
    }));
    
    // ローカルストレージに保存
    localStorage.setItem('n3_current_org', organizationId);
  }, [state.organizations]);
  
  const refreshOrganization = useCallback(async () => {
    await fetchOrganizations();
  }, [fetchOrganizations]);
  
  const refreshUsage = useCallback(async () => {
    await fetchUsage();
  }, [fetchUsage]);
  
  const updateOrganizationSettings = useCallback(async (settings: Partial<OrganizationSettings>) => {
    if (!state.organization) {
      throw new Error('No organization selected');
    }
    
    const res = await fetch('/api/tenant/organization/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationId: state.organization.id,
        settings,
      }),
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update settings');
    }
    
    // 組織情報を再取得
    await fetchOrganizations();
  }, [state.organization, fetchOrganizations]);
  
  // ============================================================
  // Helpers
  // ============================================================
  
  const hasFeature = useCallback((featureId: string): boolean => {
    const features = PLAN_FEATURES[state.plan] || [];
    return features.includes(featureId);
  }, [state.plan]);
  
  const canDispatch = useCallback((): boolean => {
    if (!state.usage) return true;  // Usage not loaded yet
    
    const { dispatchThisMonth, dispatchLimit, concurrentJobs, concurrentLimit } = state.usage;
    
    // Unlimited check
    if (dispatchLimit === -1) return true;
    
    if (dispatchThisMonth >= dispatchLimit) return false;
    if (concurrentJobs >= concurrentLimit) return false;
    
    return true;
  }, [state.usage]);
  
  const getPlanDisplayName = useCallback((): string => {
    const names: Record<PlanId, string> = {
      free: 'Free',
      pro: 'Pro',
      empire: 'Empire',
    };
    return names[state.plan] || 'Free';
  }, [state.plan]);
  
  const getUpgradeUrl = useCallback((): string => {
    const currentPlan = state.plan;
    if (currentPlan === 'free') return '/pricing?upgrade=pro';
    if (currentPlan === 'pro') return '/pricing?upgrade=empire';
    return '/pricing';
  }, [state.plan]);
  
  // ============================================================
  // Context Value
  // ============================================================
  
  const contextValue = useMemo<TenantContextType>(() => ({
    ...state,
    switchOrganization,
    refreshOrganization,
    refreshUsage,
    updateOrganizationSettings,
    hasFeature,
    canDispatch,
    getPlanDisplayName,
    getUpgradeUrl,
  }), [
    state,
    switchOrganization,
    refreshOrganization,
    refreshUsage,
    updateOrganizationSettings,
    hasFeature,
    canDispatch,
    getPlanDisplayName,
    getUpgradeUrl,
  ]);
  
  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// ============================================================
// Utility Hook: テナントコンテキスト付きDispatch
// ============================================================

export function useTenantDispatch() {
  const { organization, role, plan, canDispatch, hasFeature } = useTenant();
  
  const dispatch = useCallback(async (
    toolId: string,
    action: string,
    params: Record<string, any> = {}
  ) => {
    if (!organization) {
      throw new Error('No organization selected');
    }
    
    // 機能チェック
    const featureId = `tool-${toolId}`;
    // 基本的なツールは許可
    const isBasicTool = !featureId.includes('advanced') && !featureId.includes('batch');
    if (!isBasicTool && !hasFeature(featureId)) {
      throw new Error(`Feature "${featureId}" not available in ${plan} plan`);
    }
    
    // Dispatch可能チェック
    if (!canDispatch()) {
      throw new Error('Dispatch limit reached. Please upgrade your plan.');
    }
    
    const res = await fetch('/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolId,
        action,
        params,
        organizationId: organization.id,
        metadata: {
          plan,
          role,
        },
      }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Dispatch failed');
    }
    
    return data;
  }, [organization, role, plan, canDispatch, hasFeature]);
  
  return { dispatch, organization, canDispatch, hasFeature };
}
