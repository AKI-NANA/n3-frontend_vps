// lib/guards/index.ts
/**
 * 🛡️ Guards - System Guard Layer Export
 * 
 * Phase 3A: Rate Limit & Job Guard
 * Phase 3B: RBAC (Permission Layer)
 * Phase 4B: Billing Guard
 * Phase 4E: Webhook Firewall & API Key Manager
 * Phase D-Core: Admin Guard, Kill Switch, Concurrency, Execution Mode, Audit Log
 * Phase E-5: Rate Limit Protection
 */

// Rate Limiter
export {
  RateLimiter,
  ipRateLimiter,
  userRateLimiter,
  toolIdRateLimiter,
  globalRateLimiter,
  checkDispatchRateLimit,
  DEFAULT_RATE_LIMITS,
  type DispatchRateLimitContext,
  type DispatchRateLimitResult,
} from './rate-limiter';

// Job Guard
export {
  JobGuard,
  jobGuard,
  checkDispatchJobGuard,
  registerDispatchJob,
  releaseDispatchJob,
  type DispatchJobGuardContext,
  type DispatchJobGuardResult,
} from './job-guard';

// RBAC
export {
  checkPermission,
  checkToolPermission,
  checkPermissions,
  checkAnyPermission,
  isRoleAtLeast,
  createPermissionError,
  PERMISSIONS,
  type UserRole,
  type Permission,
  type RBACCheckResult,
} from './rbac';

// Billing Guard
export {
  checkDispatchQuota,
  checkConcurrentJobs,
  checkApiCallQuota,
  checkFeatureAccess,
  checkToolAccess,
  checkDispatchBilling,
  recordUsage,
  getMonthlyDispatchCount,
  getConcurrentJobCount,
  getDailyApiCallCount,
  type BillingCheckResult,
  type FeatureAccess,
  type DispatchBillingContext,
  type DispatchBillingResult,
} from './billing-guard';

// Webhook Firewall
export {
  checkWebhookFirewall,
  verifyWebhookSignature,
  verifyApiKey,
  generateWebhookSignature,
  type WebhookFirewallConfig,
  type WebhookFirewallResult,
} from './webhook-firewall';

// API Key Manager (Phase 4E)
export {
  generateApiKey,
  validateApiKey,
  rotateApiKey,
  revokeApiKey,
  listApiKeys,
  cleanupExpiredKeys,
  type ApiKey,
  type CreateApiKeyResult,
  type ApiKeyValidation,
} from './api-key-manager';

// ============================================================
// Phase D-Core: 運用耐性レイヤー
// ============================================================

// Admin Guard
export {
  getCurrentUser,
  getCurrentUserFromRequest,
  requireAdmin,
  requireOperator,
  checkAdminAccess,
  isAdminOnlyResource,
  withAdminGuard,
  withOperatorGuard,
  AdminGuardError,
  ADMIN_ONLY_RESOURCES,
  type CurrentUser,
  type AdminGuardResult,
} from './admin-guard';

// Kill Switch
export {
  getKillSwitchStatus,
  activateKillSwitch,
  deactivateKillSwitch,
  checkKillSwitch,
  isSystemHalted,
  pauseTool,
  resumeTool,
  KillSwitchActiveError,
  type SystemFlags,
  type KillSwitchStatus,
  type KillSwitchActivateParams,
} from './kill-switch';

// Concurrency Guard
export {
  acquireJobLock,
  releaseJobLock,
  getJobLockStatus,
  resetJobLocks,
  checkConcurrencyLimit,
  canExecute,
  withConcurrencyGuard,
  getConcurrencyLimit,
  ConcurrencyLimitError,
  CONCURRENCY_LIMITS,
  type JobLock,
  type ConcurrencyCheckResult,
} from './concurrency-guard';

// Execution Mode
export {
  getExecutionMode,
  checkLocalExecution,
  checkN8nExecution,
  isLocalExecutionAllowed,
  isN8nExecutionAllowed,
  withLocalExecutionGuard,
  withN8nExecutionGuard,
  selectExecutionTarget,
  getExecutionModeInfo,
  ExecutionModeError,
  type ExecutionMode,
  type ExecutionModeConfig,
} from './execution-mode';

// Audit Log
export {
  logExecution,
  logDispatchStart,
  logDispatchComplete,
  logKillSwitchOperation,
  logPermissionDenied,
  getExecutionLogs,
  getTodayJobCount,
  getToolStats,
  type AuditLogType,
  type AuditLogStatus,
  type AuditLogEntry,
  type AuditLogFilter,
} from './audit-log';

// ============================================================
// Phase E-5: Rate Limit Protection
// ============================================================

// Rate Limit Protection
export {
  isRateLimitError,
  calculateBackoff,
  getToolState,
  canExecuteTool,
  recordSuccess,
  recordFailure,
  getRateLimitStatus,
  resetRateLimitState,
  persistRateLimitState,
  loadRateLimitState,
  type RateLimitState,
  type CircuitBreakerState,
} from './rate-limit-protection';
