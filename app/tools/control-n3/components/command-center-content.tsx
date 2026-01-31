// app/tools/control-n3/components/command-center-content.tsx
/**
 * 🎛️ Command Center Content - Final Version (H-5 + H-6)
 * 
 * 完全版 Empire Command Center
 * - タブ制御 + KillSwitch + 実行状態 + API Polling
 * - 二重確認モーダル（H-5）
 * - Audit Log（H-5）
 * - SSE リアルタイム（H-6）
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, Clock, Command, Loader2, Play, RefreshCw,
  Server, XCircle, BarChart3, Terminal, RotateCcw, Eye, TrendingUp, Power,
  Gauge, UserCheck, Settings, Zap, HeartPulse, ShieldOff, Lock, Radio, Wifi, WifiOff,
} from 'lucide-react';

import { 
  useControlCenter, 
  DANGEROUS_TABS, 
  EXECUTION_LOCKED_TABS,
} from '@/lib/hooks/useControlCenter';
import type { TabId, JobType, HealthStatus } from '@/lib/state-machines/control-center-machine';

import { ConfirmModal } from './confirm-modal';
import { UsageDashboard } from '@/components/tenant';
import { WorkflowManagerPanel } from './panels/workflow-manager-panel';
import { ToolsRegistryPanel } from './panels/tools-registry-panel';
import { AutomationControlPanel } from './panels/automation-control-panel';
import { SystemHealthPanel } from './panels/system-health-panel';

// 型定義
interface Job {
  jobId: string; toolId: string; action: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout' | 'cancelled' | 'retried';
  progress: number; retryCount: number;
  startedAt: string | null; finishedAt: string | null; createdAt: string;
  error?: string; metadata?: Record<string, any>;
}

interface SystemStatus {
  jobs: { running: number; pending: number; failed: number; completed: number; timeout: number; total24h: number; };
  hubs: { research: { active: number; errors: number }; listing: { active: number; errors: number; queue: number }; inventory: { active: number; errors: number; alerts: number }; media: { active: number; errors: number }; finance: { active: number; errors: number }; };
  alerts: { total: number; critical: number; warning: number; info: number; };
  health: { n8n: 'online' | 'offline' | 'degraded'; database: 'online' | 'offline' | 'degraded'; api: 'online' | 'offline' | 'degraded'; };
  updatedAt: string;
}

interface Metrics {
  period: string; totalJobs: number; successRate: number; errorRate: number; avgDurationMs: number;
  toolMetrics: { toolId: string; totalCount: number; successCount: number; failedCount: number; successRate: number; errorRate: number; avgDurationMs: number; }[];
  topErrors: { toolId: string; error: string; count: number }[];
}

const COLORS: Record<string, string> = {
  pending: '#F59E0B', running: '#3B82F6', completed: '#10B981', failed: '#EF4444',
  timeout: '#8B5CF6', cancelled: '#6B7280', retried: '#06B6D4',
  online: '#10B981', offline: '#EF4444', degraded: '#F59E0B', unknown: '#6B7280',
};

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'monitor', label: 'Monitor', icon: Activity },
  { id: 'failed', label: 'Failed', icon: AlertTriangle },
  { id: 'workflows', label: 'Workflows', icon: Server },
  { id: 'tools', label: 'Tools', icon: Settings },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'metrics', label: 'Metrics', icon: TrendingUp },
  { id: 'usage', label: 'Usage', icon: Gauge },
  { id: 'approvals', label: 'Approvals', icon: UserCheck },
  { id: 'status', label: 'System', icon: BarChart3 },
  { id: 'manual', label: 'Manual', icon: Terminal },
];

const JOB_TYPE_LABELS: Record<string, string> = { scheduler: 'Scheduler', pipeline: 'Pipeline', dispatch: 'Dispatch', startup: 'Startup' };

// Progress Bar
function ExecutionProgressBar({ jobType, progress, message }: { jobType: JobType; progress: number; message: string | null; }) {
  if (!jobType) return null;
  return (
    <div style={{ padding: '8px 24px', background: 'rgba(59, 130, 246, 0.15)', borderBottom: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.running, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontWeight: 600, color: COLORS.running }}>Running {JOB_TYPE_LABELS[jobType] || jobType}...</span>
      </div>
      <div style={{ flex: 1, maxWidth: 300 }}>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.running}, #8B5CF6)`, borderRadius: 3, transition: 'width 0.3s ease' }} />
        </div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.running }}>{progress}%</span>
      {message && <span style={{ fontSize: 12, opacity: 0.7 }}>{message}</span>}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}

// API Health Badge
function ApiHealthBadge({ name, status }: { name: string; status: HealthStatus; }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[status] || COLORS.unknown, boxShadow: status === 'online' ? `0 0 8px ${COLORS.online}` : 'none' }} />
      <span style={{ fontSize: 12, opacity: 0.8 }}>{name}</span>
    </div>
  );
}

// メインコンポーネント
export function CommandCenterContent() {
  const {
    currentTab, sendTabChange, isTabActive, isTabDisabled, isDangerousTab, isExecutionLockedTab,
    isKilled, killReason, sendKillOn, sendKillOff,
    isExecuting, activeJobType, progress, progressMessage, canExecute,
    startExecution, completeExecution, failExecution,
    apiHealth, isPolling, pollErrors, sseConnected,
    isConfirming, confirmState, requestConfirm, confirmAccept, confirmCancel,
    preflightPassed, preflightErrors,
    isCriticalError, errorMessage, sendClearError,
    logAudit, systemState,
  } = useControlCenter({ initialTab: 'monitor', enablePolling: true, pollingInterval: 5000, enableSSE: true });
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const [manualToolId, setManualToolId] = useState('');
  const [manualAction, setManualAction] = useState('execute');
  const [manualParams, setManualParams] = useState('{}');
  const [isManualExecuting, setIsManualExecuting] = useState(false);
  const [manualResult, setManualResult] = useState<any>(null);
  const [pendingConfirmCallback, setPendingConfirmCallback] = useState<(() => void) | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [jobsRes, statusRes, metricsRes] = await Promise.all([
        fetch('/api/dispatch/jobs?limit=100&sortOrder=desc'),
        fetch('/api/dispatch/status'),
        fetch('/api/dispatch/metrics?period=24h'),
      ]);
      if (jobsRes.ok) { const d = await jobsRes.json(); if (d.success) setJobs(d.jobs || []); }
      if (statusRes.ok) { const d = await statusRes.json(); if (d.success) setSystemStatus(d); }
      if (metricsRes.ok) { const d = await metricsRes.json(); if (d.success) setMetrics(d); }
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  }, []);
  
  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) interval = setInterval(fetchData, 5000);
    return () => { if (interval) clearInterval(interval); };
  }, [fetchData, autoRefresh]);
  
  const handleRetry = async (jobId: string) => {
    if (!canExecute) return alert('Cannot retry: System is locked');
    const res = await fetch('/api/dispatch/retry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId }) });
    const data = await res.json();
    if (data.success) { await logAudit({ action: 'JOB_RETRY', action_category: 'execution', target_type: 'job', target_id: jobId }); await fetchData(); }
    else alert(`Retry failed: ${data.error}`);
  };
  
  const handleCancel = async (jobId: string) => {
    if (!confirm('Cancel this job?')) return;
    const res = await fetch('/api/dispatch/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId }) });
    const data = await res.json();
    if (data.success) { await logAudit({ action: 'JOB_CANCEL', action_category: 'execution', target_type: 'job', target_id: jobId }); await fetchData(); }
    else alert(`Cancel failed: ${data.error}`);
  };
  
  const handleKillSwitch = async (activate: boolean) => {
    if (activate) {
      const reason = prompt('Reason for activating Kill Switch:');
      if (!reason) return;
      const res = await fetch('/api/dispatch/kill-switch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: false, reason }) });
      const data = await res.json();
      if (data.success) { sendKillOn(reason); await logAudit({ action: 'KILL_SWITCH_ACTIVATE', action_category: 'kill_switch', before_state: { isKilled: false }, after_state: { isKilled: true, reason }, metadata: { reason } }); }
      else alert(`Failed: ${data.error}`);
    } else {
      requestConfirm('kill_deactivate');
      setPendingConfirmCallback(() => async () => {
        const res = await fetch('/api/dispatch/kill-switch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: true }) });
        const data = await res.json();
        if (data.success) { sendKillOff(); await logAudit({ action: 'KILL_SWITCH_DEACTIVATE', action_category: 'kill_switch', before_state: { isKilled: true, reason: killReason }, after_state: { isKilled: false } }); }
        else alert(`Failed: ${data.error}`);
      });
    }
  };
  
  const handleManualExecute = async () => {
    if (!manualToolId) return alert('Tool ID required');
    if (!canExecute) return alert('Cannot execute: System is locked');
    let params: Record<string, any>;
    try { params = JSON.parse(manualParams); } catch { return alert('Invalid JSON'); }
    
    requestConfirm('manual_execute', { toolId: manualToolId, action: manualAction });
    setPendingConfirmCallback(() => async () => {
      startExecution('dispatch', undefined, `Executing ${manualToolId}...`);
      setIsManualExecuting(true);
      setManualResult(null);
      try {
        const res = await fetch('/api/dispatch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toolId: manualToolId, action: manualAction, params }) });
        const result = await res.json();
        setManualResult(result);
        if (result.success) { completeExecution(); await logAudit({ action: 'MANUAL_EXECUTE', action_category: 'execution', target_type: 'tool', target_id: manualToolId, metadata: { action: manualAction, params }, after_state: { success: true } }); }
        else { failExecution(result.error || 'Execution failed'); await logAudit({ action: 'MANUAL_EXECUTE_FAILED', action_category: 'execution', target_type: 'tool', target_id: manualToolId, metadata: { action: manualAction, error: result.error } }); }
        await fetchData();
      } catch (err: any) { setManualResult({ success: false, error: err.message }); failExecution(err.message); }
      finally { setIsManualExecuting(false); }
    });
  };
  
  const handleConfirmAccept = () => { confirmAccept(); if (pendingConfirmCallback) { pendingConfirmCallback(); setPendingConfirmCallback(null); } };
  const handleConfirmCancel = () => { confirmCancel(); setPendingConfirmCallback(null); };
  
  const failedJobs = useMemo(() => jobs.filter(j => j.status === 'failed' || j.status === 'timeout'), [jobs]);
  const isOperationLocked = isKilled || isExecuting;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white' }}>
      <ConfirmModal isOpen={isConfirming} title={confirmState.title} message={confirmState.message} confirmText={confirmState.confirmText} onConfirm={handleConfirmAccept} onCancel={handleConfirmCancel} variant={confirmState.action === 'kill_deactivate' ? 'warning' : 'danger'} metadata={confirmState.metadata} />
      
      {isKilled && (
        <div style={{ padding: '12px 24px', background: '#EF4444', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldOff size={20} /><span style={{ fontWeight: 600 }}>KILL SWITCH ACTIVE - All Dispatch disabled</span>
          {killReason && <span style={{ opacity: 0.8 }}>• {killReason}</span>}
          <button onClick={() => handleKillSwitch(false)} disabled={isExecuting} style={{ marginLeft: 'auto', padding: '6px 12px', background: 'white', color: '#EF4444', border: 'none', borderRadius: 6, fontWeight: 600, cursor: isExecuting ? 'not-allowed' : 'pointer', opacity: isExecuting ? 0.5 : 1 }}>Deactivate</button>
        </div>
      )}
      
      {isExecuting && <ExecutionProgressBar jobType={activeJobType} progress={progress} message={progressMessage} />}
      
      {isCriticalError && (
        <div style={{ padding: '12px 24px', background: '#DC2626', display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={20} /><span style={{ fontWeight: 600 }}>CRITICAL ERROR: {errorMessage}</span>
          <button onClick={sendClearError} style={{ marginLeft: 'auto', padding: '6px 12px', background: 'white', color: '#DC2626', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}
      
      {/* Preflight Errors */}
      {!preflightPassed && preflightErrors.length > 0 && (
        <div style={{ padding: '12px 24px', background: 'rgba(245,158,11,0.2)', borderBottom: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={16} color={COLORS.pending} />
          <span style={{ fontSize: 13 }}>Preflight check failed: {preflightErrors.join(', ')}</span>
        </div>
      )}
      
      {/* Header */}
      <header style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: isKilled ? '#EF4444' : isExecuting ? COLORS.running : 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isExecuting ? 'pulse 1.5s ease-in-out infinite' : 'none' }}>
            {isKilled ? <ShieldOff size={22} /> : isExecuting ? <Loader2 size={22} className="animate-spin" /> : <Command size={22} />}
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Empire Command Center</h1>
            <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>Phase H-6 Final • State: {systemState.toUpperCase()}{isKilled && ' • KILLED'}{isExecuting && ` • EXECUTING`}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* SSE Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}>
            {sseConnected ? <Wifi size={12} color={COLORS.completed} /> : <WifiOff size={12} color={COLORS.failed} />}
            <span style={{ fontSize: 11, opacity: 0.7 }}>{sseConnected ? 'Realtime' : 'Offline'}</span>
          </div>
          
          {/* Polling Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}>
            <Radio size={12} color={isPolling ? COLORS.completed : COLORS.cancelled} />
            <span style={{ fontSize: 11, opacity: 0.7 }}>{isPolling ? 'Live' : 'Paused'}{pollErrors > 0 && ` (${pollErrors})`}</span>
          </div>
          
          {/* Kill Switch Button */}
          {!isKilled ? (
            <button onClick={() => handleKillSwitch(true)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><Power size={14} /> Kill Switch</button>
          ) : (
            <div style={{ padding: '8px 16px', borderRadius: 8, background: '#EF4444', color: 'white', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}><Lock size={14} /> KILLED</div>
          )}
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} style={{ width: 16, height: 16 }} />Auto
          </label>
          
          <button onClick={fetchData} disabled={isLoading} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <ApiHealthBadge name="n8n" status={apiHealth.n8n} />
            <ApiHealthBadge name="DB" status={apiHealth.database} />
            <ApiHealthBadge name="API" status={apiHealth.api} />
          </div>
        </div>
      </header>
      
      {/* Quick Stats */}
      {systemStatus && (
        <div style={{ padding: '12px 24px', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: 24, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { label: 'Running', value: systemStatus.jobs.running, color: COLORS.running, icon: Loader2 },
            { label: 'Pending', value: systemStatus.jobs.pending, color: COLORS.pending, icon: Clock },
            { label: 'Failed', value: systemStatus.jobs.failed, color: COLORS.failed, icon: XCircle },
            { label: 'Completed', value: systemStatus.jobs.completed, color: COLORS.completed, icon: CheckCircle },
            { label: '24h', value: systemStatus.jobs.total24h, color: '#94A3B8', icon: BarChart3 },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={16} color={color} /><span style={{ fontSize: 13, color }}>{value}</span><span style={{ fontSize: 12, opacity: 0.5 }}>{label}</span></div>
          ))}
        </div>
      )}
      
      {/* Tab Navigation */}
      <nav style={{ padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.id);
          const isDisabled = isTabDisabled(tab.id);
          return (
            <button key={tab.id} onClick={() => !isDisabled && sendTabChange(tab.id)} disabled={isDisabled}
              style={{ padding: '12px 16px', border: 'none', background: 'transparent', color: isDisabled ? 'rgba(255,255,255,0.25)' : isActive ? 'white' : 'rgba(255,255,255,0.5)', cursor: isDisabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: isActive ? 600 : 400, borderBottom: isActive ? '2px solid #3B82F6' : '2px solid transparent', marginBottom: -1, opacity: isDisabled ? 0.4 : 1, whiteSpace: 'nowrap' }}>
              <Icon size={14} />{tab.label}
              {isDisabled && <Lock size={10} style={{ color: isKilled ? '#EF4444' : COLORS.running }} />}
              {tab.id === 'failed' && failedJobs.length > 0 && <span style={{ background: COLORS.failed, color: 'white', fontSize: 10, padding: '1px 5px', borderRadius: 10 }}>{failedJobs.length}</span>}
            </button>
          );
        })}
      </nav>
      
      {/* Main Content */}
      <main style={{ padding: 24 }}>
        {error && <div style={{ padding: 16, background: 'rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={16} color={COLORS.failed} /><span>{error}</span></div>}
        
        {currentTab === 'monitor' && <JobMonitorPanel jobs={jobs} onRetry={handleRetry} onCancel={handleCancel} onSelect={setSelectedJob} isLocked={isOperationLocked} />}
        {currentTab === 'failed' && <FailedJobsPanel jobs={failedJobs} onRetry={handleRetry} isLocked={isOperationLocked} />}
        {currentTab === 'workflows' && <WorkflowManagerPanel />}
        {currentTab === 'tools' && <ToolsRegistryPanel />}
        {currentTab === 'automation' && <AutomationControlPanel />}
        {currentTab === 'health' && <SystemHealthPanel />}
        {currentTab === 'metrics' && metrics && <MetricsPanel metrics={metrics} />}
        {currentTab === 'usage' && <UsageDashboard />}
        {currentTab === 'approvals' && <ApprovalsPanel />}
        {currentTab === 'status' && systemStatus && <SystemStatusPanel status={systemStatus} />}
        {currentTab === 'manual' && <ManualTriggerPanel toolId={manualToolId} setToolId={setManualToolId} action={manualAction} setAction={setManualAction} params={manualParams} setParams={setManualParams} isExecuting={isManualExecuting} onExecute={handleManualExecute} result={manualResult} isLocked={isOperationLocked} canExecute={canExecute} />}
      </main>
      
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}

// Sub Components
function JobMonitorPanel({ jobs, onRetry, onCancel, onSelect, isLocked }: { jobs: Job[]; onRetry: (id: string) => void; onCancel: (id: string) => void; onSelect: (job: Job) => void; isLocked: boolean }) {
  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>All Jobs ({jobs.length})</h2>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 160px 80px 90px 60px 140px 100px', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', fontSize: 12, fontWeight: 600, opacity: 0.7 }}>
          <div>Job ID</div><div>Tool ID</div><div>Action</div><div>Status</div><div>Retry</div><div>Created</div><div>Actions</div>
        </div>
        <div style={{ maxHeight: 450, overflow: 'auto' }}>
          {jobs.length === 0 ? <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>No jobs found</div> : jobs.map(job => (
            <div key={job.jobId} onClick={() => onSelect(job)} style={{ display: 'grid', gridTemplateColumns: '100px 160px 80px 90px 60px 140px 100px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13, alignItems: 'center', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, opacity: 0.7 }}>{job.jobId.slice(0, 8)}...</div>
              <div style={{ fontWeight: 500 }}>{job.toolId}</div>
              <div style={{ opacity: 0.7 }}>{job.action}</div>
              <div><span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${COLORS[job.status] || '#6B7280'}20`, color: COLORS[job.status] || '#6B7280' }}>{job.status}</span></div>
              <div style={{ opacity: 0.7 }}>{job.retryCount || 0}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>{new Date(job.createdAt).toLocaleString('ja-JP')}</div>
              <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                {['failed', 'timeout'].includes(job.status) && !isLocked && <button onClick={() => onRetry(job.jobId)} style={{ padding: '4px 8px', borderRadius: 4, border: 'none', background: 'rgba(59,130,246,0.2)', color: COLORS.running, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><RotateCcw size={12} /></button>}
                {['pending', 'running'].includes(job.status) && !isLocked && <button onClick={() => onCancel(job.jobId)} style={{ padding: '4px 8px', borderRadius: 4, border: 'none', background: 'rgba(239,68,68,0.2)', color: COLORS.failed, cursor: 'pointer', fontSize: 11 }}><XCircle size={12} /></button>}
                <button onClick={() => onSelect(job)} style={{ padding: '4px 8px', borderRadius: 4, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: 11 }}><Eye size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FailedJobsPanel({ jobs, onRetry, isLocked }: { jobs: Job[]; onRetry: (id: string) => void; isLocked: boolean }) {
  const handleRetryAll = () => { if (isLocked) return alert('System is locked'); if (confirm(`Retry all ${jobs.length} failed jobs?`)) jobs.forEach(j => onRetry(j.jobId)); };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Failed Jobs ({jobs.length})</h2>
        {jobs.length > 0 && !isLocked && <button onClick={handleRetryAll} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: COLORS.running, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><RotateCcw size={14} />Retry All</button>}
      </div>
      {jobs.length === 0 ? <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}><CheckCircle size={48} color={COLORS.completed} style={{ marginBottom: 16 }} /><p style={{ fontSize: 16, fontWeight: 500 }}>No failed jobs!</p></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{jobs.map(job => (
          <div key={job.jobId} style={{ padding: 16, background: 'rgba(239,68,68,0.1)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div><div style={{ fontSize: 15, fontWeight: 600 }}>{job.toolId}</div><div style={{ fontSize: 12, opacity: 0.6 }}>{job.action} • {new Date(job.createdAt).toLocaleString('ja-JP')}</div></div>
              {!isLocked && <button onClick={() => onRetry(job.jobId)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: COLORS.running, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><RotateCcw size={14} /></button>}
            </div>
            {job.error && <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', color: COLORS.failed }}>{job.error}</div>}
          </div>
        ))}</div>
      )}
    </div>
  );
}

function MetricsPanel({ metrics }: { metrics: Metrics }) {
  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Metrics ({metrics.period})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[{ label: 'Total Jobs', value: metrics.totalJobs, color: '#94A3B8' }, { label: 'Success Rate', value: `${metrics.successRate}%`, color: COLORS.completed }, { label: 'Error Rate', value: `${metrics.errorRate}%`, color: COLORS.failed }, { label: 'Avg Duration', value: `${Math.round(metrics.avgDurationMs / 1000)}s`, color: COLORS.running }].map(({ label, value, color }) => (
          <div key={label} style={{ padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, textAlign: 'center' }}><div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div><div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div></div>
        ))}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, opacity: 0.7 }}>Tool Performance</h3>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 100px', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', fontSize: 12, fontWeight: 600, opacity: 0.7 }}><div>Tool ID</div><div>Total</div><div>Failed</div><div>Success Rate</div><div>Avg Time</div></div>
        {metrics.toolMetrics.slice(0, 10).map(t => (<div key={t.toolId} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 100px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}><div style={{ fontWeight: 500 }}>{t.toolId}</div><div>{t.totalCount}</div><div style={{ color: t.failedCount > 0 ? COLORS.failed : 'inherit' }}>{t.failedCount}</div><div style={{ color: t.successRate >= 90 ? COLORS.completed : t.successRate >= 70 ? COLORS.pending : COLORS.failed }}>{t.successRate}%</div><div>{Math.round(t.avgDurationMs / 1000)}s</div></div>))}
      </div>
    </div>
  );
}

function SystemStatusPanel({ status }: { status: SystemStatus }) {
  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>System Status</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {(['n8n', 'database', 'api'] as const).map(service => (<div key={service} style={{ padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, textAlign: 'center' }}><Server size={24} color={COLORS[status.health[service]]} style={{ marginBottom: 8 }} /><div style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase' }}>{service}</div><div style={{ marginTop: 8, padding: '4px 12px', borderRadius: 4, background: `${COLORS[status.health[service]]}20`, color: COLORS[status.health[service]], fontSize: 12, fontWeight: 600, display: 'inline-block' }}>{status.health[service]}</div></div>))}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, opacity: 0.7 }}>Hub Status</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {(Object.entries(status.hubs) as [string, any][]).map(([hub, data]) => (<div key={hub} style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}><div style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize', marginBottom: 8 }}>{hub}</div><div style={{ fontSize: 12 }}><span style={{ opacity: 0.5 }}>Active:</span> {data.active}</div><div style={{ fontSize: 12, color: data.errors > 0 ? COLORS.failed : 'inherit' }}><span style={{ opacity: 0.5 }}>Errors:</span> {data.errors}</div></div>))}
      </div>
    </div>
  );
}

function ManualTriggerPanel({ toolId, setToolId, action, setAction, params, setParams, isExecuting, onExecute, result, isLocked, canExecute }: any) {
  const presets = [{ toolId: 'inventory-sync', action: 'execute', params: { platform: 'ebay' } }, { toolId: 'research-agent', action: 'analyze', params: { query: 'test' } }];
  const isDisabled = isLocked || !canExecute;
  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Manual Dispatch</h2>
      {isLocked && <div style={{ padding: 16, background: 'rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={16} color={COLORS.failed} /><span>System is locked. Manual execution is disabled.</span></div>}
      <div style={{ marginBottom: 16, opacity: isDisabled ? 0.5 : 1, pointerEvents: isDisabled ? 'none' : 'auto' }}><div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>Presets:</div><div style={{ display: 'flex', gap: 8 }}>{presets.map((p, i) => (<button key={i} onClick={() => { setToolId(p.toolId); setAction(p.action); setParams(JSON.stringify(p.params, null, 2)); }} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: 12 }}>{p.toolId}</button>))}</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16, opacity: isDisabled ? 0.5 : 1 }}><div><label style={{ display: 'block', fontSize: 12, marginBottom: 6, opacity: 0.7 }}>Tool ID</label><input type="text" value={toolId} onChange={(e) => setToolId(e.target.value)} placeholder="e.g. inventory-sync" disabled={isDisabled} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 14 }} /></div><div><label style={{ display: 'block', fontSize: 12, marginBottom: 6, opacity: 0.7 }}>Action</label><input type="text" value={action} onChange={(e) => setAction(e.target.value)} placeholder="e.g. execute" disabled={isDisabled} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 14 }} /></div></div>
      <div style={{ marginBottom: 16, opacity: isDisabled ? 0.5 : 1 }}><label style={{ display: 'block', fontSize: 12, marginBottom: 6, opacity: 0.7 }}>Params (JSON)</label><textarea value={params} onChange={(e) => setParams(e.target.value)} rows={6} disabled={isDisabled} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 13, fontFamily: 'monospace', resize: 'vertical' }} /></div>
      <button onClick={onExecute} disabled={isExecuting || !toolId || isDisabled} style={{ padding: '12px 24px', borderRadius: 8, border: 'none', background: isDisabled ? 'rgba(255,255,255,0.1)' : COLORS.running, color: 'white', cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{isDisabled ? <><Lock size={16} />Locked</> : isExecuting ? <><Loader2 size={16} className="animate-spin" />Executing...</> : <><Play size={16} />Execute</>}</button>
      {result && <div style={{ marginTop: 16, padding: 16, background: result.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 8, border: `1px solid ${result.success ? COLORS.completed : COLORS.failed}30` }}><div style={{ fontSize: 13, fontWeight: 600, color: result.success ? COLORS.completed : COLORS.failed, marginBottom: 8 }}>{result.success ? '✓ Success' : '✗ Failed'}</div><pre style={{ fontSize: 12, fontFamily: 'monospace', overflow: 'auto', maxHeight: 200, margin: 0 }}>{JSON.stringify(result, null, 2)}</pre></div>}
    </div>
  );
}

interface PendingAction { id: string; action_code: string; action_type: string; target_type: string; target_id: string; target_title: string; request_reason: string; status: string; expires_at: string; created_at: string; }

function ApprovalsPanel() {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchPendingActions = useCallback(async () => { try { setError(null); const res = await fetch('/api/hitl/pending'); const data = await res.json(); if (data.success) setPendingActions(data.actions || []); else setError(data.error); } catch (err: any) { setError(err.message); } finally { setIsLoading(false); } }, []);
  useEffect(() => { fetchPendingActions(); const interval = setInterval(fetchPendingActions, 10000); return () => clearInterval(interval); }, [fetchPendingActions]);
  const handleApprove = async (actionCode: string) => { const res = await fetch(`/api/hitl/approve/${actionCode}`, { method: 'POST' }); const data = await res.json(); if (data.success) await fetchPendingActions(); else alert(`Approve failed: ${data.error}`); };
  const handleReject = async (actionCode: string) => { if (!confirm('Reject?')) return; const res = await fetch(`/api/hitl/reject/${actionCode}`, { method: 'POST' }); const data = await res.json(); if (data.success) await fetchPendingActions(); else alert(`Reject failed: ${data.error}`); };
  if (isLoading) return <div style={{ textAlign: 'center', padding: 60 }}><Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 16px' }} /><p style={{ opacity: 0.6 }}>Loading...</p></div>;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><h2 style={{ fontSize: 16, fontWeight: 600 }}>Pending Approvals ({pendingActions.length})</h2></div>
      {error && <div style={{ padding: 16, background: 'rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 16 }}><span style={{ color: COLORS.failed }}>{error}</span></div>}
      {pendingActions.length === 0 ? <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}><CheckCircle size={48} color={COLORS.completed} style={{ marginBottom: 16 }} /><p>No pending approvals</p></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{pendingActions.map(action => (
          <div key={action.id} style={{ padding: 16, background: 'rgba(245,158,11,0.1)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div><div style={{ fontSize: 15, fontWeight: 600 }}>{action.target_title || action.target_id}</div><div style={{ fontSize: 12, opacity: 0.6 }}>{action.action_type} • {action.target_type}</div></div>
              <div style={{ display: 'flex', gap: 8 }}><button onClick={() => handleApprove(action.action_code)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: COLORS.completed, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><CheckCircle size={14} /></button><button onClick={() => handleReject(action.action_code)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.2)', color: COLORS.failed, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><XCircle size={14} /></button></div>
            </div>
            {action.request_reason && <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, fontSize: 12 }}><span style={{ opacity: 0.6 }}>Reason:</span> {action.request_reason}</div>}
          </div>
        ))}</div>
      )}
    </div>
  );
}

function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ width: 600, maxHeight: '80vh', background: '#1E293B', borderRadius: 16, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Job Details</h3><button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>✕</button></div>
        <div style={{ padding: 20, overflow: 'auto', maxHeight: 'calc(80vh - 60px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>{[{ label: 'Job ID', value: job.jobId }, { label: 'Tool ID', value: job.toolId }, { label: 'Action', value: job.action }, { label: 'Status', value: job.status }, { label: 'Retry Count', value: String(job.retryCount || 0) }, { label: 'Created', value: new Date(job.createdAt).toLocaleString('ja-JP') }].map(({ label, value }) => (<div key={label}><div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>{label}</div><div style={{ fontSize: 13 }}>{value}</div></div>))}</div>
          {job.error && <div><div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Error</div><div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', color: COLORS.failed }}>{job.error}</div></div>}
        </div>
      </div>
    </div>
  );
}
