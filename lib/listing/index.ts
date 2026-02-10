// lib/listing/index.ts
/**
 * 出品関連ライブラリ - エクスポート
 * 
 * 設計書: docs/LISTING_SAFETY_DESIGN_V1.md
 */

// 状態遷移
export {
  LISTING_STATE_MACHINE,
  canTransition,
  canList,
  canApprove,
  canRevert,
  getAllowedNextStates,
  getStatusCategory,
  getStatusLabel,
  type WorkflowStatus,
  type TransitionContext,
  type TransitionResult,
} from './state-machine';

// ガード
export {
  runListingGuards,
  validateListingClient,
  filterListableProducts,
  type ListingGuardContext,
  type ListingGuardResult,
  type ListingBlocker,
  type ListingWarning,
} from './guards';

// Kill Switch
export {
  checkKillSwitch,
  checkKillSwitchSync,
  getKillSwitchState,
  activateKillSwitch,
  deactivateKillSwitch,
  type KillSwitchScope,
  type KillSwitchState,
  type KillSwitchResult,
} from './kill-switch';
