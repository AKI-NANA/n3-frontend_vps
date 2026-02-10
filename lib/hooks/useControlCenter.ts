// lib/hooks/useControlCenter.ts
/**
 * 🎛️ Phase H-5 + H-6: Control Center Hook (完全版)
 * 
 * - タブ制御 + KillSwitch + 実行状態 + API Polling
 * - 二重確認モーダル（H-5）
 * - Audit Log（H-5）
 * - SSE リアルタイム（H-6）
 */

'use client';

import { useReducer, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  TabId,
  SystemState,
  JobType,
  HealthStatus,
  ApiHealthState,
  ConfirmableAction,
  ConfirmState,
  AuditEntry,
  ControlCenterContext,
  ControlCenterAction,
  controlCenterReducer,
  initialContext,
  selectors,
  guards,
  DANGEROUS_TABS,
  EXECUTION_LOCKED_TABS,
  SAFE_TABS,
  CONFIRMABLE_ACTIONS,
} from '@/lib/state-machines/control-center-machine';

// ============================================================
// 型定義
// ============================================================

export interface UseControlCenterReturn {
  // 状態
  state: ControlCenterContext;
  currentTab: TabId;
  previousTab: TabId | null;
  lastSafeTab: TabId;
  systemState: SystemState;
  
  // KillSwitch状態
  isKilled: boolean;
  killReason: string | null;
  
  // 実行状態
  isExecuting: boolean;
  activeJobType: JobType;
  progress: number;
  progressMessage: string | null;
  canExecute: boolean;
  canStartup: boolean;
  
  // API状態
  apiHealth: ApiHealthState;
  isPolling: boolean;
  pollErrors: number;
  
  // 確認モーダル状態（H-5）
  isConfirming: boolean;
  confirmState: ConfirmState;
  
  // Preflight状態（H-5）
  preflightPassed: boolean;
  preflightErrors: string[];
  
  // SSE状態（H-6）
  sseConnected: boolean;
  
  // エラー状態
  hasError: boolean;
  isCriticalError: boolean;
  errorMessage: string | null;
  
  // タブアクション
  send: (event: ControlCenterAction) => void;
  sendTabChange: (tabId: TabId) => void;
  
  // KillSwitchアクション
  sendKillOn: (reason?: string) => void;
  sendKillOff: () => void;
  syncKillState: (isKilled: boolean, reason?: string) => void;
  
  // 実行アクション
  startExecution: (jobType: JobType, jobId?: string, message?: string) => void;
  updateProgress: (progress: number, message?: string) => void;
  completeExecution: () => void;
  failExecution: (error: string, code?: string) => void;
  
  // Pollingアクション
  startPolling: () => void;
  stopPolling: () => void;
  updateApiHealth: (health: Partial<ApiHealthState>) => void;
  
  // 確認モーダルアクション（H-5）
  requestConfirm: (action: ConfirmableAction, metadata?: Record<string, any>) => void;
  confirmAccept: () => void;
  confirmCancel: () => void;
  
  // Preflightアクション（H-5）
  preflightPass: () => void;
  preflightFail: (errors: string[]) => void;
  
  // Audit Logアクション（H-5）
  logAudit: (entry: AuditEntry) => Promise<void>;
  
  // エラーアクション
  sendCriticalError: (message: string, code?: string) => void;
  sendClearError: () => void;
  
  // ユーティリティ
  isTabActive: (tabId: TabId) => boolean;
  isTabDisabled: (tabId: TabId) => boolean;
  isDangerousTab: (tabId: TabId) => boolean;
  isExecutionLockedTab: (tabId: TabId) => boolean;
  canNavigateTo: (tabId: TabId) => boolean;
  requiresConfirmation: (action: ConfirmableAction) => boolean;
}

export interface UseControlCenterOptions {
  initialTab?: TabId;
  enablePolling?: boolean;
  pollingInterval?: number;
  enableSSE?: boolean;
  onKillStateChange?: (isKilled: boolean, reason?: string) => void;
  onExecutionStart?: (jobType: JobType) => void;
  onExecutionComplete?: () => void;
  onExecutionFailed?: (error: string) => void;
  onCriticalError?: (message: string, code?: string) => void;
  onTabChange?: (newTab: TabId, previousTab: TabId | null) => void;
  onApiHealthChange?: (health: ApiHealthState) => void;
  onConfirmRequired?: (action: ConfirmableAction) => void;
  onSSEEvent?: (eventType: string, data: any) => void;
}

// ============================================================
// API Functions
// ============================================================

async function fetchSystemStatus(): Promise<{
  killSwitch: { active: boolean; reason?: string };
  scheduler: { running: boolean; jobType?: JobType; progress?: number };
  health: Partial<ApiHealthState>;
  preflight?: { passed: boolean; errors?: string[] };
} | null> {
  try {
    const [killRes, statusRes, healthRes, preflightRes] = await Promise.all([
      fetch('/api/dispatch/kill-switch').catch(() => null),
      fetch('/api/dispatch/status').catch(() => null),
      fetch('/api/health/apis').catch(() => null),
      fetch('/api/system/preflight').catch(() => null),
    ]);
    
    const killData = killRes?.ok ? await killRes.json() : null;
    const statusData = statusRes?.ok ? await statusRes.json() : null;
    const healthData = healthRes?.ok ? await healthRes.json() : null;
    const preflightData = preflightRes?.ok ? await preflightRes.json() : null;
    
    return {
      killSwitch: { active: killData?.killSwitchActive || false, reason: killData?.reason },
      scheduler: { running: statusData?.jobs?.running > 0 || false, progress: statusData?.progress },
      health: {
        n8n: healthData?.health?.n8n || 'unknown',
        database: healthData?.health?.database || 'unknown',
        api: healthData?.health?.api || 'unknown',
        scheduler: statusData?.health?.scheduler || 'unknown',
      },
      preflight: preflightData ? { passed: preflightData.passed, errors: preflightData.errors } : undefined,
    };
  } catch {
    return null;
  }
}

async function sendAuditLog(entry: AuditEntry): Promise<boolean> {
  try {
    const res = await fetch('/api/system/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch {
    console.error('[Audit] Failed to send audit log:', entry);
    return false;
  }
}

// ============================================================
// Hook実装
// ============================================================

export function useControlCenter(initialTabOrOptions?: TabId | UseControlCenterOptions): UseControlCenterReturn {
  const options: UseControlCenterOptions = typeof initialTabOrOptions === 'string'
    ? { initialTab: initialTabOrOptions }
    : initialTabOrOptions || {};
  
  const {
    initialTab,
    enablePolling = true,
    pollingInterval = 5000,
    enableSSE = true,
    onKillStateChange,
    onExecutionStart,
    onExecutionComplete,
    onExecutionFailed,
    onCriticalError,
    onTabChange,
    onApiHealthChange,
    onConfirmRequired,
    onSSEEvent,
  } = options;
  
  // Refs
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const isVisibleRef = useRef(true);
  const confirmCallbackRef = useRef<(() => void) | null>(null);
  
  // 初期状態
  const init: ControlCenterContext = useMemo(() => ({
    ...initialContext,
    activeTab: initialTab || initialContext.activeTab,
    lastSafeTab: initialTab && SAFE_TABS.includes(initialTab) ? initialTab : initialContext.lastSafeTab,
  }), [initialTab]);
  
  const [state, dispatch] = useReducer(controlCenterReducer, init);
  
  // ========================================
  // コールバック発火
  // ========================================
  
  useEffect(() => { onKillStateChange?.(state.isKilled, state.killReason || undefined); }, [state.isKilled, state.killReason, onKillStateChange]);
  useEffect(() => { if (state.isExecuting && state.activeJobType) onExecutionStart?.(state.activeJobType); }, [state.isExecuting, state.activeJobType, onExecutionStart]);
  useEffect(() => { if (!state.isExecuting && state.progress === 100) onExecutionComplete?.(); }, [state.isExecuting, state.progress, onExecutionComplete]);
  useEffect(() => { if (state.hasError && state.errorCode === 'EXECUTION_FAILED') onExecutionFailed?.(state.errorMessage || 'Unknown error'); }, [state.hasError, state.errorCode, state.errorMessage, onExecutionFailed]);
  useEffect(() => { if (state.isCritical && state.errorMessage) onCriticalError?.(state.errorMessage, state.errorCode || undefined); }, [state.isCritical, state.errorMessage, state.errorCode, onCriticalError]);
  useEffect(() => { if (state.previousTab !== null) onTabChange?.(state.activeTab, state.previousTab); }, [state.activeTab, state.previousTab, onTabChange]);
  useEffect(() => { onApiHealthChange?.(state.apiHealth); }, [state.apiHealth, onApiHealthChange]);
  useEffect(() => { if (state.confirm.isOpen && state.confirm.action) onConfirmRequired?.(state.confirm.action); }, [state.confirm.isOpen, state.confirm.action, onConfirmRequired]);
  
  // ========================================
  // Polling（H-4）
  // ========================================
  
  const poll = useCallback(async () => {
    if (!isVisibleRef.current) return;
    
    const data = await fetchSystemStatus();
    
    if (data) {
      dispatch({ type: 'POLL_SUCCESS' });
      dispatch({ type: 'SYNC_KILL_STATE', isKilled: data.killSwitch.active, reason: data.killSwitch.reason });
      dispatch({ type: 'API_HEALTH_UPDATE', health: data.health });
      
      // Preflight状態同期
      if (data.preflight) {
        if (data.preflight.passed) {
          dispatch({ type: 'PREFLIGHT_PASS' });
        } else {
          dispatch({ type: 'PREFLIGHT_FAIL', errors: data.preflight.errors || [] });
        }
      }
      
      // 実行状態同期
      if (data.scheduler.running && !state.isExecuting) {
        dispatch({ type: 'EXECUTION_START', jobType: 'scheduler', message: 'Scheduler running...' });
      } else if (!data.scheduler.running && state.isExecuting && state.activeJobType === 'scheduler') {
        dispatch({ type: 'EXECUTION_COMPLETE' });
      }
      
      // Health Critical Check
      const hasCritical = Object.values(data.health).some(s => s === 'offline');
      if (hasCritical && !state.isCritical) {
        dispatch({ type: 'CRITICAL_ERROR', message: 'Critical service offline detected', code: 'SERVICE_OFFLINE' });
      }
    } else {
      dispatch({ type: 'POLL_ERROR' });
    }
  }, [state.isExecuting, state.activeJobType, state.isCritical]);
  
  useEffect(() => {
    if (!enablePolling || !state.isPolling) {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
      return;
    }
    poll();
    pollingRef.current = setInterval(poll, pollingInterval);
    return () => { if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; } };
  }, [enablePolling, state.isPolling, pollingInterval, poll]);
  
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      if (isVisibleRef.current && state.isPolling) poll();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [state.isPolling, poll]);
  
  useEffect(() => { if (enablePolling) dispatch({ type: 'POLL_START' }); }, [enablePolling]);
  
  // ========================================
  // SSE（H-6）
  // ========================================
  
  useEffect(() => {
    if (!enableSSE) return;
    
    const connectSSE = () => {
      if (sseRef.current) { sseRef.current.close(); sseRef.current = null; }
      
      try {
        const sse = new EventSource('/api/system/events');
        
        sse.onopen = () => {
          dispatch({ type: 'SSE_CONNECTED' });
          console.log('[SSE] Connected');
        };
        
        sse.onerror = () => {
          dispatch({ type: 'SSE_DISCONNECTED' });
          console.warn('[SSE] Connection error, reconnecting in 5s...');
          setTimeout(connectSSE, 5000);
        };
        
        sse.addEventListener('connected', () => {
          dispatch({ type: 'SSE_CONNECTED' });
        });
        
        sse.addEventListener('system_status', (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: 'SSE_EVENT', eventType: 'system_status', data });
            
            // Kill状態同期
            if (data.killSwitch) {
              dispatch({ type: 'SYNC_KILL_STATE', isKilled: data.killSwitch.killSwitchActive, reason: data.killSwitch.reason });
            }
            
            onSSEEvent?.('system_status', data);
          } catch (e) {
            console.error('[SSE] Parse error:', e);
          }
        });
        
        sse.addEventListener('kill_switch', (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: 'SYNC_KILL_STATE', isKilled: data.data?.active, reason: data.data?.reason });
            onSSEEvent?.('kill_switch', data);
          } catch (e) {}
        });
        
        sse.addEventListener('execution_start', (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: 'EXECUTION_START', jobType: data.data?.jobType, message: data.data?.message });
            onSSEEvent?.('execution_start', data);
          } catch (e) {}
        });
        
        sse.addEventListener('execution_progress', (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: 'EXECUTION_PROGRESS', progress: data.data?.progress, message: data.data?.message });
            onSSEEvent?.('execution_progress', data);
          } catch (e) {}
        });
        
        sse.addEventListener('execution_complete', (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: 'EXECUTION_COMPLETE' });
            onSSEEvent?.('execution_complete', data);
          } catch (e) {}
        });
        
        sse.addEventListener('execution_failed', (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: 'EXECUTION_FAILED', error: data.data?.error, code: data.data?.code });
            onSSEEvent?.('execution_failed', data);
          } catch (e) {}
        });
        
        sse.addEventListener('health_update', (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: 'API_HEALTH_UPDATE', health: data.data });
            onSSEEvent?.('health_update', data);
          } catch (e) {}
        });
        
        sse.addEventListener('error', (event) => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: 'CRITICAL_ERROR', message: data.data?.message, code: data.data?.code });
            onSSEEvent?.('error', data);
          } catch (e) {}
        });
        
        sseRef.current = sse;
      } catch (e) {
        console.error('[SSE] Failed to connect:', e);
      }
    };
    
    connectSSE();
    
    return () => {
      if (sseRef.current) { sseRef.current.close(); sseRef.current = null; }
    };
  }, [enableSSE, onSSEEvent]);
  
  // ========================================
  // アクション
  // ========================================
  
  const send = useCallback((event: ControlCenterAction) => dispatch(event), []);
  const sendTabChange = useCallback((tabId: TabId) => dispatch({ type: 'TAB_CLICK', tabId }), []);
  const sendKillOn = useCallback((reason?: string) => dispatch({ type: 'KILL_SWITCH_ON', reason }), []);
  const sendKillOff = useCallback(() => dispatch({ type: 'KILL_SWITCH_OFF' }), []);
  const syncKillState = useCallback((isKilled: boolean, reason?: string) => dispatch({ type: 'SYNC_KILL_STATE', isKilled, reason }), []);
  
  const startExecution = useCallback((jobType: JobType, jobId?: string, message?: string) => dispatch({ type: 'EXECUTION_START', jobType, jobId, message }), []);
  const updateProgress = useCallback((progress: number, message?: string) => dispatch({ type: 'EXECUTION_PROGRESS', progress, message }), []);
  const completeExecution = useCallback(() => dispatch({ type: 'EXECUTION_COMPLETE' }), []);
  const failExecution = useCallback((error: string, code?: string) => dispatch({ type: 'EXECUTION_FAILED', error, code }), []);
  
  const startPolling = useCallback(() => dispatch({ type: 'POLL_START' }), []);
  const stopPolling = useCallback(() => dispatch({ type: 'POLL_STOP' }), []);
  const updateApiHealth = useCallback((health: Partial<ApiHealthState>) => dispatch({ type: 'API_HEALTH_UPDATE', health }), []);
  
  // 確認モーダル（H-5）
  const requestConfirm = useCallback((action: ConfirmableAction, metadata?: Record<string, any>) => {
    const config = CONFIRMABLE_ACTIONS[action];
    dispatch({
      type: 'CONFIRM_REQUIRED',
      action,
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
      metadata,
    });
  }, []);
  
  const confirmAccept = useCallback(() => {
    dispatch({ type: 'CONFIRM_ACCEPT' });
    if (confirmCallbackRef.current) {
      confirmCallbackRef.current();
      confirmCallbackRef.current = null;
    }
  }, []);
  
  const confirmCancel = useCallback(() => {
    dispatch({ type: 'CONFIRM_CANCEL' });
    confirmCallbackRef.current = null;
  }, []);
  
  // Preflight（H-5）
  const preflightPass = useCallback(() => dispatch({ type: 'PREFLIGHT_PASS' }), []);
  const preflightFail = useCallback((errors: string[]) => dispatch({ type: 'PREFLIGHT_FAIL', errors }), []);
  
  // Audit Log（H-5）
  const logAudit = useCallback(async (entry: AuditEntry) => {
    dispatch({ type: 'AUDIT_LOG', entry });
    await sendAuditLog(entry);
    dispatch({ type: 'AUDIT_LOG_SENT' });
  }, []);
  
  const sendCriticalError = useCallback((message: string, code?: string) => dispatch({ type: 'CRITICAL_ERROR', message, code }), []);
  const sendClearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);
  
  // ユーティリティ
  const isTabActive = useCallback((tabId: TabId) => selectors.isTabActive(state, tabId), [state]);
  const isTabDisabled = useCallback((tabId: TabId) => selectors.isTabDisabled(state, tabId), [state]);
  const isDangerousTab = useCallback((tabId: TabId) => guards.isDangerousTab(tabId), []);
  const isExecutionLockedTab = useCallback((tabId: TabId) => guards.isExecutionLockedTab(tabId), []);
  const canNavigateTo = useCallback((tabId: TabId) => state.activeTab === tabId || !selectors.isTabDisabled(state, tabId), [state]);
  const requiresConfirmation = useCallback((action: ConfirmableAction) => guards.requiresConfirmation(action), []);
  
  return {
    state,
    currentTab: selectors.getActiveTab(state),
    previousTab: selectors.getPreviousTab(state),
    lastSafeTab: selectors.getLastSafeTab(state),
    systemState: selectors.getSystemState(state),
    isKilled: selectors.isKilled(state),
    killReason: selectors.getKillReason(state),
    isExecuting: selectors.isExecuting(state),
    activeJobType: selectors.getActiveJobType(state),
    progress: selectors.getProgress(state),
    progressMessage: selectors.getProgressMessage(state),
    canExecute: selectors.canExecute(state),
    canStartup: selectors.canStartup(state),
    apiHealth: selectors.getApiHealth(state),
    isPolling: selectors.isPolling(state),
    pollErrors: selectors.getPollErrors(state),
    isConfirming: selectors.isConfirming(state),
    confirmState: selectors.getConfirmState(state),
    preflightPassed: selectors.isPreflightPassed(state),
    preflightErrors: selectors.getPreflightErrors(state),
    sseConnected: selectors.isSseConnected(state),
    hasError: selectors.hasError(state),
    isCriticalError: selectors.isCriticalError(state),
    errorMessage: selectors.getErrorMessage(state),
    send, sendTabChange, sendKillOn, sendKillOff, syncKillState,
    startExecution, updateProgress, completeExecution, failExecution,
    startPolling, stopPolling, updateApiHealth,
    requestConfirm, confirmAccept, confirmCancel,
    preflightPass, preflightFail, logAudit,
    sendCriticalError, sendClearError,
    isTabActive, isTabDisabled, isDangerousTab, isExecutionLockedTab, canNavigateTo, requiresConfirmation,
  };
}

export default useControlCenter;
export type { TabId, SystemState, JobType, HealthStatus, ApiHealthState, ConfirmableAction, ConfirmState, AuditEntry, ControlCenterContext };
export { DANGEROUS_TABS, EXECUTION_LOCKED_TABS, SAFE_TABS, CONFIRMABLE_ACTIONS };
