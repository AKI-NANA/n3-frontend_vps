// lib/tenant/index.ts
/**
 * 🏢 Tenant Layer Export
 * 
 * Phase 4A: Tenant Layer
 * Phase 4B: Plan & Billing Guard
 * Phase 4C: Usage Metering
 * Phase 4D: Self Onboarding
 */

export {
  // Types
  type PlanId,
  type UserRole,
  type Organization,
  type OrganizationSettings,
  type OrganizationMember,
  type Plan,
  type PlanLimits,
  type TenantContext,
  
  // Organization functions
  createOrganization,
  getOrganization,
  getOrganizationBySlug,
  updateOrganization,
  
  // User functions
  getUserOrganizations,
  getUserRole,
  addMember,
  
  // Plan functions
  getPlans,
  getPlan,
  updateOrganizationPlan,
  
  // Context
  getTenantContext,
} from './tenant-service';

// Plan Limits Constants
export const PLAN_LIMITS = {
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
} as const;

// Plan Features Matrix
export const PLAN_FEATURES = {
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
} as const;

// Helper: Check if plan has feature
export function hasPlanFeature(plan: string, feature: string): boolean {
  const features = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || [];
  return features.includes(feature);
}

// Helper: Get required plan for feature
export function getRequiredPlanForFeature(feature: string): string | null {
  for (const [plan, features] of Object.entries(PLAN_FEATURES)) {
    if (features.includes(feature)) {
      return plan;
    }
  }
  return null;
}
