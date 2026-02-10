// lib/tenant/tenant-service.ts
/**
 * 🏢 Tenant Service - マルチテナント管理
 * 
 * Phase 4A: Tenant Layer
 * 
 * 機能:
 * - Organization CRUD
 * - User-Organization関連
 * - プラン管理
 * - テナント切替
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  invitedAt: string;
  acceptedAt?: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  limits: PlanLimits;
  features: string[];
}

export interface PlanLimits {
  dispatchPerMonth: number;  // -1 = unlimited
  concurrentJobs: number;
  storageGb: number;
  apiCallsPerDay: number;    // -1 = unlimited
}

export interface TenantContext {
  organizationId: string;
  userId: string;
  role: UserRole;
  plan: PlanId;
  limits: PlanLimits;
}

// ============================================================
// Supabase Client
// ============================================================

function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// ============================================================
// Organization CRUD
// ============================================================

export async function createOrganization(
  name: string,
  ownerId: string,
  plan: PlanId = 'free'
): Promise<Organization> {
  const supabase = getSupabaseClient();
  
  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36);
  
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name,
      slug,
      plan,
      settings: {},
      metadata: {},
    })
    .select()
    .single();
  
  if (orgError) {
    throw new Error(`Failed to create organization: ${orgError.message}`);
  }
  
  // Add owner as admin member
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: org.id,
      user_id: ownerId,
      role: 'admin',
      accepted_at: new Date().toISOString(),
    });
  
  if (memberError) {
    // Rollback org creation
    await supabase.from('organizations').delete().eq('id', org.id);
    throw new Error(`Failed to add owner: ${memberError.message}`);
  }
  
  return transformOrganization(org);
}

export async function getOrganization(id: string): Promise<Organization | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  
  return transformOrganization(data);
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !data) return null;
  
  return transformOrganization(data);
}

export async function updateOrganization(
  id: string,
  updates: Partial<Pick<Organization, 'name' | 'settings' | 'metadata'>>
): Promise<Organization> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('organizations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to update organization: ${error.message}`);
  }
  
  return transformOrganization(data);
}

// ============================================================
// User Organizations
// ============================================================

export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  const supabase = getSupabaseClient();
  
  const { data: members, error } = await supabase
    .from('organization_members')
    .select('organization_id, role, organizations(*)')
    .eq('user_id', userId)
    .not('accepted_at', 'is', null);
  
  if (error) {
    throw new Error(`Failed to get user organizations: ${error.message}`);
  }
  
  return (members || []).map((m: any) => transformOrganization(m.organizations));
}

export async function getUserRole(
  userId: string,
  organizationId: string
): Promise<UserRole | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .single();
  
  if (error || !data) return null;
  
  return data.role as UserRole;
}

export async function addMember(
  organizationId: string,
  userId: string,
  role: UserRole,
  invitedBy: string
): Promise<OrganizationMember> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('organization_members')
    .insert({
      organization_id: organizationId,
      user_id: userId,
      role,
      invited_by: invitedBy,
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to add member: ${error.message}`);
  }
  
  return {
    id: data.id,
    organizationId: data.organization_id,
    userId: data.user_id,
    role: data.role,
    invitedAt: data.invited_at,
    acceptedAt: data.accepted_at,
  };
}

// ============================================================
// Plan Management
// ============================================================

export async function getPlans(): Promise<Plan[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  
  if (error) {
    throw new Error(`Failed to get plans: ${error.message}`);
  }
  
  return (data || []).map(transformPlan);
}

export async function getPlan(id: PlanId): Promise<Plan | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  
  return transformPlan(data);
}

export async function updateOrganizationPlan(
  organizationId: string,
  plan: PlanId,
  expiresAt?: string
): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('organizations')
    .update({
      plan,
      plan_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', organizationId);
  
  if (error) {
    throw new Error(`Failed to update plan: ${error.message}`);
  }
  
  // Log audit
  await supabase.from('audit_logs').insert({
    organization_id: organizationId,
    action: 'plan_changed',
    resource_type: 'organization',
    resource_id: organizationId,
    details: { plan, expiresAt },
  });
}

// ============================================================
// Tenant Context
// ============================================================

export async function getTenantContext(
  userId: string,
  organizationId: string
): Promise<TenantContext | null> {
  const supabase = getSupabaseClient();
  
  // Get organization with plan
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('*, plans(*)')
    .eq('id', organizationId)
    .single();
  
  if (orgError || !org) return null;
  
  // Get user role
  const { data: member, error: memberError } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .single();
  
  if (memberError || !member) return null;
  
  const planLimits = org.plans?.limits || {
    dispatch_per_month: 500,
    concurrent_jobs: 1,
    storage_gb: 1,
    api_calls_per_day: 100,
  };
  
  return {
    organizationId,
    userId,
    role: member.role as UserRole,
    plan: org.plan as PlanId,
    limits: {
      dispatchPerMonth: planLimits.dispatch_per_month,
      concurrentJobs: planLimits.concurrent_jobs,
      storageGb: planLimits.storage_gb,
      apiCallsPerDay: planLimits.api_calls_per_day,
    },
  };
}

// ============================================================
// Transform Functions
// ============================================================

function transformOrganization(data: any): Organization {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    plan: data.plan as PlanId,
    planExpiresAt: data.plan_expires_at,
    settings: data.settings || {},
    metadata: data.metadata || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function transformPlan(data: any): Plan {
  return {
    id: data.id as PlanId,
    name: data.name,
    description: data.description,
    priceMonthly: parseFloat(data.price_monthly),
    priceYearly: parseFloat(data.price_yearly),
    limits: {
      dispatchPerMonth: data.limits.dispatch_per_month,
      concurrentJobs: data.limits.concurrent_jobs,
      storageGb: data.limits.storage_gb,
      apiCallsPerDay: data.limits.api_calls_per_day,
    },
    features: data.features || [],
  };
}
