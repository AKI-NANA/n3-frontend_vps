// lib/state-machines/control-center-machine.ts
/**
 * 🎛️ Phase H-5 + H-6: Control Center State Machine
 * 
 * 完全版：
 * - タブ制御 + KillSwitch連動 + 実行状態同期 + API Polling
 * - 二重確認（Confirm Required）
 * - Audit Log連携
 * - SSE リアルタイム連携
 */

// ============================================================
// 型定義
// ============================================================

export type TabId = 
  | 'monitor' 
  | 'failed' 
  | 'workflows' 
  | 'tools' 
  | 'automation' 
  | 'health' 
  | 'metrics' 
  | 'usage' 
  | 'approvals' 
  | 'status' 
  | 'manual';

export type SystemState = 'idle' | 'ready' | 'executing' | 'killed' | 'error' | 'confirming';

export type JobType = 'scheduler' | 'pipeline' | 'dispatch' | 'startup' | null;

// 二重確認が必要なアクション（H-5）
export type ConfirmableAction = 
  | 'startup'
  | 'kill_deactivate'
  | 'manual_execute'
  | 'bulk_retry'
  | 'scheduler_start';

// 危険タブ
export const DANGEROUS_TABS: TabId[] = ['manual', 'workflows', 'automation'];

// 実行中ロックタブ
export const EXECUTION_LOCKED_TABS: TabId[] = ['manual', 'workflows', 'automation', 'tools'];

// 安全タブ
export const SAFE_TABS: TabId[] = ['monitor', 'failed', 'health', 'metrics', 'usage', 'approvals', 'status'];

// API Health Status
export type HealthStatus = 'online' | 'offline' | 'degraded' | 'unknown';

export interface ApiHealthState {
  n8n: HealthStatus;
  database: HealthStatus;
  api: HealthStatus;
  scheduler: HealthStatus;
  lastChecked: Date | null;
}

// 確認モーダル状態（H-5）
export interface ConfirmState {
  isOpen: boolean;
  action: ConfirmableAction | null;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: (() => void) | null;
  metadata?: Record<string, any>;
}

// Audit Log Entry（H-5）
export interface AuditEntry {
  action: string;
  action_category: 'kill_switch' | 'execution' | 'startup' | 'config' | 'approval' | 'system';
  target_type?: string;
  target_id?: string;
  before_state?: Record<string, any>;
  after_state?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ControlCenterContext {
  // タブ状態
  activeTab: TabId;
  previousTab: TabId | null;
  lastSafeTab: TabId;
  
  // システム状態
  systemState: SystemState;
  
  // KillSwitch状態
  isKilled: boolean;
  killReason: string | null;
  killedAt: Date | null;
  
  // 実行状態（H-3）
  isExecuting: boolean;
  activeJobType: JobType;
  activeJobId: string | null;
  progress: number;
  progressMessage: string | null;
  executionStartedAt: Date | null;
  
  // API状態（H-4）
  apiHealth: ApiHealthState;
  isPolling: boolean;
  lastPollAt: Date | null;
  pollErrors: number;
  
  // 確認モーダル状態（H-5）
  confirm: ConfirmState;
  pendingAuditLogs: AuditEntry[];
  
  // SSE状態（H-6）
  sseConnected: boolean;
  lastSseEvent: Date | null;
  
  // エラー状態
  hasError: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  isCritical: boolean;
  
  // Preflight状態（H-5）
  preflightPassed: boolean;
  preflightErrors: string[];
}

export type ControlCenterEvent =
  // タブ操作
  | { type: 'TAB_CLICK'; tabId: TabId }
  | { type: 'INIT' }
  
  // KillSwitch
  | { type: 'KILL_SWITCH_ON'; reason?: string }
  | { type: 'KILL_SWITCH_OFF' }
  | { type: 'SYNC_KILL_STATE'; isKilled: boolean; reason?: string }
  
  // 実行状態（H-3）
  | { type: 'EXECUTION_START'; jobType: JobType; jobId?: string; message?: string }
  | { type: 'EXECUTION_PROGRESS'; progress: number; message?: string }
  | { type: 'EXECUTION_COMPLETE'; jobId?: string }
  | { type: 'EXECUTION_FAILED'; error: string; code?: string }
  
  // API状態（H-4）
  | { type: 'API_HEALTH_UPDATE'; health: Partial<ApiHealthState> }
  | { type: 'POLL_START' }
  | { type: 'POLL_STOP' }
  | { type: 'POLL_ERROR' }
  | { type: 'POLL_SUCCESS' }
  
  // 確認モーダル（H-5）
  | { type: 'CONFIRM_REQUIRED'; action: ConfirmableAction; title: string; message: string; confirmText: string; metadata?: Record<string, any> }
  | { type: 'CONFIRM_ACCEPT' }
  | { type: 'CONFIRM_CANCEL' }
  
  // Preflight（H-5）
  | { type: 'PREFLIGHT_PASS' }
  | { type: 'PREFLIGHT_FAIL'; errors: string[] }
  
  // Audit Log（H-5）
  | { type: 'AUDIT_LOG'; entry: AuditEntry }
  | { type: 'AUDIT_LOG_SENT' }
  
  // SSE（H-6）
  | { type: 'SSE_CONNECTED' }
  | { type: 'SSE_DISCONNECTED' }
  | { type: 'SSE_EVENT'; eventType: string; data: any }
  
  // エラー
  | { type: 'CRITICAL_ERROR'; message: string; code?: string }
  | { type: 'CLEAR_ERROR' };

// ============================================================
// 初期Context
// ============================================================

export const initialContext: ControlCenterContext = {
  activeTab: 'monitor',
  previousTab: null,
  lastSafeTab: 'monitor',
  
  systemState: 'ready',
  
  isKilled: false,
  killReason: null,
  killedAt: null,
  
  isExecuting: false,
  activeJobType: null,
  activeJobId: null,
  progress: 0,
  progressMessage: null,
  executionStartedAt: null,
  
  apiHealth: {
    n8n: 'unknown',
    database: 'unknown',
    api: 'unknown',
    scheduler: 'unknown',
    lastChecked: null,
  },
  isPolling: false,
  lastPollAt: null,
  pollErrors: 0,
  
  confirm: {
    isOpen: false,
    action: null,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: null,
    metadata: undefined,
  },
  pendingAuditLogs: [],
  
  sseConnected: false,
  lastSseEvent: null,
  
  hasError: false,
  errorMessage: null,
  errorCode: null,
  isCritical: false,
  
  preflightPassed: false,
  preflightErrors: [],
};

// ============================================================
// 確認が必要なアクションの設定（H-5）
// ============================================================

export const CONFIRMABLE_ACTIONS: Record<ConfirmableAction, {
  title: string;
  message: string;
  confirmText: string;
}> = {
  startup: {
    title: 'Start System?',
    message: 'This will initialize all automation services.',
    confirmText: 'START',
  },
  kill_deactivate: {
    title: 'Deactivate Kill Switch?',
    message: 'This will re-enable all automation services.',
    confirmText: 'DEACTIVATE',
  },
  manual_execute: {
    title: 'Execute Manual Dispatch?',
    message: 'This will trigger the specified tool action.',
    confirmText: 'EXECUTE',
  },
  bulk_retry: {
    title: 'Retry All Failed Jobs?',
    message: 'This will retry all failed jobs.',
    confirmText: 'RETRY ALL',
  },
  scheduler_start: {
    title: 'Start Scheduler?',
    message: 'This will start the automated scheduler.',
    confirmText: 'START',
  },
};

// ============================================================
// Guards
// ============================================================

export const guards = {
  canNavigateToTab: (ctx: ControlCenterContext, event: { type: 'TAB_CLICK'; tabId: TabId }): boolean => {
    const { tabId } = event;
    if (ctx.isKilled && DANGEROUS_TABS.includes(tabId)) return false;
    if (ctx.isExecuting && EXECUTION_LOCKED_TABS.includes(tabId)) return false;
    if (ctx.isCritical && DANGEROUS_TABS.includes(tabId)) return false;
    return true;
  },
  
  canExecute: (ctx: ControlCenterContext): boolean => {
    return !ctx.isKilled && !ctx.isExecuting && !ctx.isCritical && ctx.preflightPassed;
  },
  
  canDeactivateKill: (ctx: ControlCenterContext): boolean => {
    return ctx.isKilled && !ctx.isExecuting;
  },
  
  canStartup: (ctx: ControlCenterContext): boolean => {
    return !ctx.isKilled && !ctx.isExecuting && ctx.preflightPassed;
  },
  
  isTabDisabled: (ctx: ControlCenterContext, tabId: TabId): boolean => {
    if (ctx.isKilled && DANGEROUS_TABS.includes(tabId)) return true;
    if (ctx.isExecuting && EXECUTION_LOCKED_TABS.includes(tabId)) return true;
    if (ctx.isCritical && DANGEROUS_TABS.includes(tabId)) return true;
    return false;
  },
  
  isDangerousTab: (tabId: TabId): boolean => DANGEROUS_TABS.includes(tabId),
  isExecutionLockedTab: (tabId: TabId): boolean => EXECUTION_LOCKED_TABS.includes(tabId),
  
  requiresConfirmation: (action: ConfirmableAction): boolean => {
    return action in CONFIRMABLE_ACTIONS;
  },
};

// ============================================================
// Actions
// ============================================================

export const actions = {
  setActiveTab: (ctx: ControlCenterContext, event: { type: 'TAB_CLICK'; tabId: TabId }): ControlCenterContext => {
    const newCtx = { ...ctx, previousTab: ctx.activeTab, activeTab: event.tabId };
    if (SAFE_TABS.includes(event.tabId)) newCtx.lastSafeTab = event.tabId;
    return newCtx;
  },
  
  activateKill: (ctx: ControlCenterContext, event: { type: 'KILL_SWITCH_ON'; reason?: string }): ControlCenterContext => {
    const lastSafeTab = SAFE_TABS.includes(ctx.activeTab) ? ctx.activeTab : ctx.lastSafeTab;
    const activeTab = DANGEROUS_TABS.includes(ctx.activeTab) ? lastSafeTab : ctx.activeTab;
    return {
      ...ctx,
      systemState: 'killed',
      isKilled: true,
      killReason: event.reason || 'Manual activation',
      killedAt: new Date(),
      isExecuting: false,
      activeJobType: null,
      activeJobId: null,
      progress: 0,
      progressMessage: null,
      executionStartedAt: null,
      lastSafeTab,
      activeTab,
      previousTab: ctx.activeTab,
    };
  },
  
  deactivateKill: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    systemState: 'ready',
    isKilled: false,
    killReason: null,
    killedAt: null,
  }),
  
  startExecution: (ctx: ControlCenterContext, event: { type: 'EXECUTION_START'; jobType: JobType; jobId?: string; message?: string }): ControlCenterContext => {
    const activeTab = EXECUTION_LOCKED_TABS.includes(ctx.activeTab) ? ctx.lastSafeTab : ctx.activeTab;
    return {
      ...ctx,
      systemState: 'executing',
      isExecuting: true,
      activeJobType: event.jobType,
      activeJobId: event.jobId || null,
      progress: 0,
      progressMessage: event.message || `Starting ${event.jobType}...`,
      executionStartedAt: new Date(),
      activeTab,
      previousTab: ctx.activeTab !== activeTab ? ctx.activeTab : ctx.previousTab,
    };
  },
  
  updateProgress: (ctx: ControlCenterContext, event: { type: 'EXECUTION_PROGRESS'; progress: number; message?: string }): ControlCenterContext => ({
    ...ctx,
    progress: Math.min(100, Math.max(0, event.progress)),
    progressMessage: event.message || ctx.progressMessage,
  }),
  
  completeExecution: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    systemState: ctx.isKilled ? 'killed' : 'ready',
    isExecuting: false,
    activeJobType: null,
    activeJobId: null,
    progress: 100,
    progressMessage: 'Completed',
    executionStartedAt: null,
  }),
  
  failExecution: (ctx: ControlCenterContext, event: { type: 'EXECUTION_FAILED'; error: string; code?: string }): ControlCenterContext => ({
    ...ctx,
    systemState: 'error',
    isExecuting: false,
    activeJobType: null,
    activeJobId: null,
    progress: 0,
    progressMessage: null,
    executionStartedAt: null,
    hasError: true,
    errorMessage: event.error,
    errorCode: event.code || 'EXECUTION_FAILED',
    isCritical: false,
    previousTab: ctx.activeTab,
    activeTab: 'health',
  }),
  
  updateApiHealth: (ctx: ControlCenterContext, event: { type: 'API_HEALTH_UPDATE'; health: Partial<ApiHealthState> }): ControlCenterContext => ({
    ...ctx,
    apiHealth: { ...ctx.apiHealth, ...event.health, lastChecked: new Date() },
    lastPollAt: new Date(),
    pollErrors: 0,
  }),
  
  startPolling: (ctx: ControlCenterContext): ControlCenterContext => ({ ...ctx, isPolling: true, pollErrors: 0 }),
  stopPolling: (ctx: ControlCenterContext): ControlCenterContext => ({ ...ctx, isPolling: false }),
  pollError: (ctx: ControlCenterContext): ControlCenterContext => {
    const pollErrors = ctx.pollErrors + 1;
    return { ...ctx, pollErrors, isPolling: pollErrors < 5 ? ctx.isPolling : false };
  },
  
  // 確認モーダル（H-5）
  openConfirm: (ctx: ControlCenterContext, event: { type: 'CONFIRM_REQUIRED'; action: ConfirmableAction; title: string; message: string; confirmText: string; metadata?: Record<string, any> }): ControlCenterContext => ({
    ...ctx,
    systemState: 'confirming',
    confirm: {
      isOpen: true,
      action: event.action,
      title: event.title,
      message: event.message,
      confirmText: event.confirmText,
      onConfirm: null,
      metadata: event.metadata,
    },
  }),
  
  closeConfirm: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    systemState: ctx.isKilled ? 'killed' : ctx.isExecuting ? 'executing' : 'ready',
    confirm: { ...initialContext.confirm },
  }),
  
  // Preflight（H-5）
  preflightPass: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    preflightPassed: true,
    preflightErrors: [],
  }),
  
  preflightFail: (ctx: ControlCenterContext, event: { type: 'PREFLIGHT_FAIL'; errors: string[] }): ControlCenterContext => ({
    ...ctx,
    preflightPassed: false,
    preflightErrors: event.errors,
  }),
  
  // Audit Log（H-5）
  addAuditLog: (ctx: ControlCenterContext, event: { type: 'AUDIT_LOG'; entry: AuditEntry }): ControlCenterContext => ({
    ...ctx,
    pendingAuditLogs: [...ctx.pendingAuditLogs, event.entry],
  }),
  
  clearAuditLogs: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    pendingAuditLogs: [],
  }),
  
  // SSE（H-6）
  sseConnect: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    sseConnected: true,
    lastSseEvent: new Date(),
  }),
  
  sseDisconnect: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    sseConnected: false,
  }),
  
  sseEvent: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    lastSseEvent: new Date(),
  }),
  
  setCriticalError: (ctx: ControlCenterContext, event: { type: 'CRITICAL_ERROR'; message: string; code?: string }): ControlCenterContext => ({
    ...ctx,
    systemState: 'error',
    hasError: true,
    errorMessage: event.message,
    errorCode: event.code || 'CRITICAL_ERROR',
    isCritical: true,
    isExecuting: false,
    activeJobType: null,
    activeJobId: null,
    progress: 0,
    progressMessage: null,
    executionStartedAt: null,
    previousTab: ctx.activeTab,
    activeTab: 'health',
  }),
  
  clearError: (ctx: ControlCenterContext): ControlCenterContext => ({
    ...ctx,
    systemState: ctx.isKilled ? 'killed' : 'ready',
    hasError: false,
    errorMessage: null,
    errorCode: null,
    isCritical: false,
  }),
  
  syncKillState: (ctx: ControlCenterContext, event: { type: 'SYNC_KILL_STATE'; isKilled: boolean; reason?: string }): ControlCenterContext => {
    if (event.isKilled && !ctx.isKilled) {
      return actions.activateKill(ctx, { type: 'KILL_SWITCH_ON', reason: event.reason });
    } else if (!event.isKilled && ctx.isKilled) {
      return actions.deactivateKill(ctx);
    }
    return ctx;
  },
};

// ============================================================
// Pure Reducer
// ============================================================

export type ControlCenterAction = ControlCenterEvent;

export function controlCenterReducer(state: ControlCenterContext, action: ControlCenterAction): ControlCenterContext {
  switch (action.type) {
    case 'TAB_CLICK':
      if (!guards.canNavigateToTab(state, action)) return state;
      return actions.setActiveTab(state, action);
    case 'INIT': return state;
    case 'KILL_SWITCH_ON':
      if (state.isKilled) return state;
      return actions.activateKill(state, action);
    case 'KILL_SWITCH_OFF':
      if (!guards.canDeactivateKill(state)) return state;
      return actions.deactivateKill(state);
    case 'SYNC_KILL_STATE':
      return actions.syncKillState(state, action);
    case 'EXECUTION_START':
      if (!guards.canExecute(state)) return state;
      return actions.startExecution(state, action);
    case 'EXECUTION_PROGRESS':
      if (!state.isExecuting) return state;
      return actions.updateProgress(state, action);
    case 'EXECUTION_COMPLETE':
      if (!state.isExecuting) return state;
      return actions.completeExecution(state);
    case 'EXECUTION_FAILED':
      return actions.failExecution(state, action);
    case 'API_HEALTH_UPDATE':
      return actions.updateApiHealth(state, action);
    case 'POLL_START':
      return actions.startPolling(state);
    case 'POLL_STOP':
      return actions.stopPolling(state);
    case 'POLL_ERROR':
      return actions.pollError(state);
    case 'POLL_SUCCESS':
      return { ...state, pollErrors: 0, lastPollAt: new Date() };
    case 'CONFIRM_REQUIRED':
      return actions.openConfirm(state, action);
    case 'CONFIRM_ACCEPT':
    case 'CONFIRM_CANCEL':
      return actions.closeConfirm(state);
    case 'PREFLIGHT_PASS':
      return actions.preflightPass(state);
    case 'PREFLIGHT_FAIL':
      return actions.preflightFail(state, action);
    case 'AUDIT_LOG':
      return actions.addAuditLog(state, action);
    case 'AUDIT_LOG_SENT':
      return actions.clearAuditLogs(state);
    case 'SSE_CONNECTED':
      return actions.sseConnect(state);
    case 'SSE_DISCONNECTED':
      return actions.sseDisconnect(state);
    case 'SSE_EVENT':
      return actions.sseEvent(state);
    case 'CRITICAL_ERROR':
      return actions.setCriticalError(state, action);
    case 'CLEAR_ERROR':
      return actions.clearError(state);
    default:
      return state;
  }
}

// ============================================================
// Selectors
// ============================================================

export const selectors = {
  getActiveTab: (ctx: ControlCenterContext): TabId => ctx.activeTab,
  getPreviousTab: (ctx: ControlCenterContext): TabId | null => ctx.previousTab,
  getLastSafeTab: (ctx: ControlCenterContext): TabId => ctx.lastSafeTab,
  isTabActive: (ctx: ControlCenterContext, tabId: TabId): boolean => ctx.activeTab === tabId,
  isTabDisabled: (ctx: ControlCenterContext, tabId: TabId): boolean => guards.isTabDisabled(ctx, tabId),
  getSystemState: (ctx: ControlCenterContext): SystemState => ctx.systemState,
  isKilled: (ctx: ControlCenterContext): boolean => ctx.isKilled,
  getKillReason: (ctx: ControlCenterContext): string | null => ctx.killReason,
  isExecuting: (ctx: ControlCenterContext): boolean => ctx.isExecuting,
  getActiveJobType: (ctx: ControlCenterContext): JobType => ctx.activeJobType,
  getProgress: (ctx: ControlCenterContext): number => ctx.progress,
  getProgressMessage: (ctx: ControlCenterContext): string | null => ctx.progressMessage,
  canExecute: (ctx: ControlCenterContext): boolean => guards.canExecute(ctx),
  canStartup: (ctx: ControlCenterContext): boolean => guards.canStartup(ctx),
  getApiHealth: (ctx: ControlCenterContext): ApiHealthState => ctx.apiHealth,
  isPolling: (ctx: ControlCenterContext): boolean => ctx.isPolling,
  getPollErrors: (ctx: ControlCenterContext): number => ctx.pollErrors,
  isConfirming: (ctx: ControlCenterContext): boolean => ctx.confirm.isOpen,
  getConfirmState: (ctx: ControlCenterContext): ConfirmState => ctx.confirm,
  isPreflightPassed: (ctx: ControlCenterContext): boolean => ctx.preflightPassed,
  getPreflightErrors: (ctx: ControlCenterContext): string[] => ctx.preflightErrors,
  isSseConnected: (ctx: ControlCenterContext): boolean => ctx.sseConnected,
  hasError: (ctx: ControlCenterContext): boolean => ctx.hasError,
  isCriticalError: (ctx: ControlCenterContext): boolean => ctx.isCritical,
  getErrorMessage: (ctx: ControlCenterContext): string | null => ctx.errorMessage,
};

// ============================================================
// Export
// ============================================================

export const ControlCenterMachine = {
  guards,
  actions,
  selectors,
  reducer: controlCenterReducer,
  initialContext,
  DANGEROUS_TABS,
  EXECUTION_LOCKED_TABS,
  SAFE_TABS,
  CONFIRMABLE_ACTIONS,
};
