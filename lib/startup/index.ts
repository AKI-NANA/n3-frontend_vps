// lib/startup/index.ts
/**
 * 🚀 Phase G: Startup Module
 * 
 * 本番起動フェーズの統合エクスポート
 */

// Operation Mode
export {
  type OperationMode,
  type OperationModeConfig,
  type ModeStatus,
  type ModeChangeResult,
  MODE_CONFIGS,
  getCurrentMode,
  changeMode,
  getModeConfig,
  isAutomationAllowed,
  isPipelineAllowed,
  getDispatchTarget,
} from './operation-mode';

// Pre-flight Check
export {
  type CheckStatus,
  type CheckResult,
  type PreflightResult,
  runPreflightCheck,
  checkSecrets,
  checkApiHealth,
  checkDatabaseIntegrity,
  checkN8nStatus,
  checkDispatchReady,
} from './preflight-check';

// Startup Engine
export {
  type StartupPhase,
  type StartupStep,
  type StartupState,
  type StartupResult,
  getStartupState,
  startSystem,
  stopSystem,
  resetStartupState,
} from './startup-engine';

// Safety Guards
export {
  type SafetyGuardConfig,
  type SafetyStatus,
  DEFAULT_SAFETY_CONFIG,
  SAFETY_CONFIG,
  startFirstRunMode,
  isInFirstRunMode,
  recordFirstRunExecution,
  getFirstRunLimits,
  checkCollision,
  recordExecution,
  validateWriteData,
  checkBulkOperationLimit,
  getSafetyStatus,
} from './safety-guards';
