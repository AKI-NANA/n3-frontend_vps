// app/tools/control-n3/page.tsx
/**
 * Control N3 - コマンドセンター統合ページ
 * 
 * Phase I Task Group C: Control Center 再設計
 * 
 * 正式タブ構成:
 * - System Status: システム全体の稼働状況
 * - Automation Control: n8n自動化の管理
 * - Tool Registry: 登録済みツール一覧
 * - API & Integrations: 外部API連携状況
 * - Logs & Audit: 実行ログと監査
 * - Startup / KillSwitch: システム起動/緊急停止
 */

'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, Clock, Loader2, RefreshCw,
  Server, XCircle, BarChart3, Terminal, Power, Zap, RotateCcw,
  Database, Link, FileText, ExternalLink, Grid, AlertCircle, Pause,
  StopCircle, PlayCircle, Wifi, WifiOff, GitBranch, Rocket,
} from 'lucide-react';
import { N3WorkspaceLayout, type L2Tab } from '@/components/layouts';
import { ToolExecutionPanel } from '@/components/tools';
import { WorkflowRegistryPanel } from './components/panels/workflow-registry-panel';

// ============================================================
// タブ定義
// ============================================================

const CONTROL_TABS: L2Tab[] = [
  { id: 'status', label: 'System Status', labelEn: 'Status', icon: Activity, color: '#3B82F6' },
  { id: 'automation', label: 'Automation Control', labelEn: 'Auto', icon: Zap, color: '#10B981' },
  { id: 'registry', label: 'Tool Registry', labelEn: 'Tools', icon: Grid, color: '#8B5CF6' },
  { id: 'integrations', label: 'API & Integrations', labelEn: 'API', icon: Link, color: '#F59E0B' },
  { id: 'logs', label: 'Logs & Audit', labelEn: 'Logs', icon: FileText, color: '#6B7280' },
  { id: 'killswitch', label: 'Startup / KillSwitch', labelEn: 'Power', icon: Power, color: '#EF4444' },
];

// 外部リンク定義
const EXTERNAL_LINKS = {
  n8n: { label: 'n8n Dashboard', url: '`http://${process.env.N3_INTERNAL_API_HOST}`:5678', icon: Zap, description: 'ワークフロー自動化' },
  supabase: { label: 'Supabase', url: 'https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil', icon: Database, description: 'データベース' },
  vercel: { label: 'Vercel', url: 'https://vercel.com/aki-nanas-projects/n3-frontend-vercel', icon: Rocket, description: 'デプロイ' },
  github: { label: 'GitHub', url: 'https://github.com/AKI-NANA/n3-frontend_new', icon: GitBranch, description: 'ソースコード' },
};

// ============================================================
// 型定義
// ============================================================

interface Job {
  jobId: string;
  toolId: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout' | 'cancelled';
  progress: number;
  retryCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  error?: string;
}

interface SystemStatus {
  jobs: { running: number; pending: number; failed: number; completed: number; total24h: number };
  health: { n8n: string; database: string; api: string };
  updatedAt: string;
}

interface KillSwitchState {
  isActive: boolean;
  activatedAt: string | null;
  reason: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  running: '#3B82F6',
  completed: '#10B981',
  failed: '#EF4444',
  timeout: '#8B5CF6',
  cancelled: '#6B7280',
  online: '#10B981',
  offline: '#EF4444',
  degraded: '#F59E0B',
};

// ============================================================
// サブコンポーネント
// ============================================================

const StatCard = memo(function StatCard({
  label, value, color = 'var(--text)', icon: Icon,
}: { label: string; value: number | string; color?: string; icon?: React.ElementType; }) {
  return (
    <div style={{ padding: '16px 20px', background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {Icon && <Icon size={14} style={{ color, opacity: 0.7 }} />}
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
    </div>
  );
});

const ExternalLinkButton = memo(function ExternalLinkButton({
  label, url, icon: Icon, description,
}: { label: string; url: string; icon: React.ElementType; description: string; }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: 16,
      background: 'var(--panel)', border: '1px solid var(--panel-border)',
      borderRadius: 8, textDecoration: 'none', color: 'var(--text)',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} style={{ color: 'white' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{description}</div>
      </div>
      <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
    </a>
  );
});

const HealthIndicator = memo(function HealthIndicator({ service, status }: { service: string; status: string; }) {
  const isOnline = status === 'online';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16,
      background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 8 }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: STATUS_COLORS[status] || '#6B7280',
        boxShadow: isOnline ? `0 0 8px ${STATUS_COLORS[status]}` : 'none' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, textTransform: 'uppercase' }}>{service}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {isOnline ? 'Operational' : status === 'degraded' ? 'Degraded' : 'Offline'}
        </div>
      </div>
      {isOnline ? <Wifi size={16} style={{ color: STATUS_COLORS[status] }} />
        : <WifiOff size={16} style={{ color: STATUS_COLORS[status] }} />}
    </div>
  );
});

// ============================================================
// タブコンテンツ
// ============================================================

const SystemStatusTab = memo(function SystemStatusTab({ systemStatus, isLoading }: { systemStatus: SystemStatus | null; isLoading: boolean; }) {
  if (isLoading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}><Loader2 size={24} className="animate-spin" /></div>;
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>Quick Access</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        {Object.entries(EXTERNAL_LINKS).map(([key, link]) => (
          <ExternalLinkButton key={key} label={link.label} url={link.url} icon={link.icon} description={link.description} />
        ))}
      </div>
      {systemStatus && (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>Job Statistics (24h)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label="Running" value={systemStatus.jobs.running} color="#3B82F6" icon={Loader2} />
            <StatCard label="Pending" value={systemStatus.jobs.pending} color="#F59E0B" icon={Clock} />
            <StatCard label="Failed" value={systemStatus.jobs.failed} color="#EF4444" icon={XCircle} />
            <StatCard label="Completed" value={systemStatus.jobs.completed} color="#10B981" icon={CheckCircle} />
            <StatCard label="Total 24h" value={systemStatus.jobs.total24h} color="var(--text)" icon={BarChart3} />
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>System Health</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <HealthIndicator service="n8n" status={systemStatus.health.n8n} />
            <HealthIndicator service="Database" status={systemStatus.health.database} />
            <HealthIndicator service="API" status={systemStatus.health.api} />
          </div>
        </>
      )}
    </div>
  );
});

const AutomationTab = memo(function AutomationTab({ jobs, onCancel }: { jobs: Job[]; onCancel: (id: string) => void; }) {
  const runningJobs = jobs.filter(j => j.status === 'running');
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Active Automations</h3>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Loader2 size={16} style={{ color: '#3B82F6' }} className="animate-spin" />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Running ({runningJobs.length})</span>
        </div>
        {runningJobs.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--panel)', borderRadius: 8 }}>No running jobs</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {runningJobs.map((job) => (
              <div key={job.jobId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{job.toolId}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{job.action}</div>
                </div>
                <button onClick={() => onCancel(job.jobId)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none',
                  background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', fontSize: 12, cursor: 'pointer' }}>
                  <Pause size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Clock size={16} style={{ color: '#F59E0B' }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Pending ({pendingJobs.length})</span>
        </div>
        {pendingJobs.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--panel)', borderRadius: 8 }}>No pending jobs</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingJobs.map((job) => (
              <div key={job.jobId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{job.toolId}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{job.action}</div>
                </div>
                <button onClick={() => onCancel(job.jobId)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none',
                  background: 'var(--panel-alt)', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const ToolRegistryTab = memo(function ToolRegistryTab() {
  return <WorkflowRegistryPanel />;
});

const IntegrationsTab = memo(function IntegrationsTab() {
  const integrations = [
    { id: 'ebay', name: 'eBay Trading API', status: 'online', lastSync: '2 min ago' },
    { id: 'amazon', name: 'Amazon SP-API', status: 'online', lastSync: '5 min ago' },
    { id: 'supabase', name: 'Supabase', status: 'online', lastSync: '1 min ago' },
    { id: 'n8n', name: 'n8n Webhooks', status: 'online', lastSync: '30 sec ago' },
    { id: 'elevenlabs', name: 'ElevenLabs', status: 'degraded', lastSync: '10 min ago' },
    { id: 'openai', name: 'OpenAI GPT', status: 'online', lastSync: '1 min ago' },
  ];
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>API & Integrations</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {integrations.map((int) => (
          <div key={int.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16,
            background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[int.status] || '#6B7280' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{int.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last sync: {int.lastSync}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const LogsTab = memo(function LogsTab({ jobs }: { jobs: Job[] }) {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Execution Logs</h3>
      <div style={{ background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 80px 100px 140px', padding: '12px 16px',
          background: 'var(--panel-alt)', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
          <div>Job ID</div><div>Tool</div><div>Status</div><div>Duration</div><div>Time</div>
        </div>
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {jobs.slice(0, 50).map((job) => (
            <div key={job.jobId} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 80px 100px 140px',
              padding: '12px 16px', borderBottom: '1px solid var(--panel-border)', fontSize: 13 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, opacity: 0.7 }}>{job.jobId.slice(0, 8)}</div>
              <div style={{ fontWeight: 500 }}>{job.toolId}</div>
              <div><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                background: `${STATUS_COLORS[job.status]}20`, color: STATUS_COLORS[job.status] }}>{job.status}</span></div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {job.finishedAt && job.startedAt ? `${Math.round((new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)}s` : '-'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(job.createdAt).toLocaleString('ja-JP')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const KillSwitchTab = memo(function KillSwitchTab({ killSwitchState, onToggle }: { killSwitchState: KillSwitchState; onToggle: () => void; }) {
  const [confirmDialog, setConfirmDialog] = useState(false);
  const handleToggle = () => { if (!killSwitchState.isActive) { setConfirmDialog(true); } else { onToggle(); } };
  const confirmActivate = () => { setConfirmDialog(false); onToggle(); };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48,
        background: killSwitchState.isActive ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))' : 'var(--panel)',
        border: `2px solid ${killSwitchState.isActive ? '#EF4444' : 'var(--panel-border)'}`, borderRadius: 16, marginBottom: 24 }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: killSwitchState.isActive ? '#EF4444' : 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, cursor: 'pointer',
          boxShadow: killSwitchState.isActive ? '0 0 40px rgba(239, 68, 68, 0.5)' : '0 0 40px rgba(139, 92, 246, 0.3)' }}
          onClick={handleToggle}>
          {killSwitchState.isActive ? <StopCircle size={48} style={{ color: 'white' }} /> : <PlayCircle size={48} style={{ color: 'white' }} />}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: killSwitchState.isActive ? '#EF4444' : 'var(--text)', marginBottom: 8 }}>
          {killSwitchState.isActive ? 'SYSTEM HALTED' : 'SYSTEM OPERATIONAL'}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
          {killSwitchState.isActive ? 'All automations stopped. Click to resume.' : 'Click the button to activate emergency stop.'}
        </p>
        {killSwitchState.isActive && killSwitchState.activatedAt && (
          <div style={{ marginTop: 16, padding: '8px 16px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: 8, fontSize: 12, color: '#EF4444' }}>
            Activated: {new Date(killSwitchState.activatedAt).toLocaleString('ja-JP')}
          </div>
        )}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>Affected Systems</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {['n8n Workflows', 'Scheduled Tasks', 'API Webhooks', 'Inventory Sync', 'Order Processing', 'Notifications'].map((system) => (
          <div key={system} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
            background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: killSwitchState.isActive ? '#EF4444' : '#10B981' }} />
            <span style={{ fontSize: 13 }}>{system}</span>
          </div>
        ))}
      </div>
      {confirmDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 16, padding: 32, maxWidth: 400, textAlign: 'center' }}>
            <AlertCircle size={48} style={{ color: '#EF4444', marginBottom: 16 }} />
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Activate KillSwitch?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
              This will stop all running automations. Are you sure?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDialog(false)} style={{ padding: '12px 24px', borderRadius: 8,
                border: '1px solid var(--panel-border)', background: 'var(--panel-alt)', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmActivate} style={{ padding: '12px 24px', borderRadius: 8, border: 'none',
                background: '#EF4444', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Activate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export default function ControlN3Page() {
  const [activeTab, setActiveTab] = useState('status');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [killSwitchState, setKillSwitchState] = useState<KillSwitchState>({ isActive: false, activatedAt: null, reason: null });

  const fetchData = useCallback(async () => {
    try {
      const [jobsRes, statusRes] = await Promise.all([
        fetch('/api/dispatch/jobs?limit=100&sortOrder=desc'),
        fetch('/api/dispatch/status'),
      ]);
      if (jobsRes.ok) { const d = await jobsRes.json(); if (d.success) setJobs(d.jobs || []); }
      if (statusRes.ok) { const d = await statusRes.json(); if (d.success) setSystemStatus(d); }
    } catch (err) { console.error('Failed to fetch data:', err); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) interval = setInterval(fetchData, 5000);
    return () => { if (interval) clearInterval(interval); };
  }, [fetchData, autoRefresh]);

  const handleCancel = useCallback(async (jobId: string) => {
    if (!confirm('Cancel this job?')) return;
    await fetch('/api/dispatch/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId }) });
    fetchData();
  }, [fetchData]);

  const handleKillSwitchToggle = useCallback(async () => {
    const newState = !killSwitchState.isActive;
    setKillSwitchState({ isActive: newState, activatedAt: newState ? new Date().toISOString() : null, reason: newState ? 'Manual activation' : null });
    try {
      await fetch('/api/killswitch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: newState }) });
    } catch (err) { console.error('KillSwitch error:', err); }
  }, [killSwitchState.isActive]);

  const toolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
        <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />Auto Refresh
      </label>
      <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 6,
        border: 'none', background: 'var(--panel-alt)', color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />Refresh
      </button>
    </div>
  );

  return (
    <N3WorkspaceLayout title="Control Center" subtitle="System Monitor & Management" tabs={CONTROL_TABS} activeTab={activeTab} onTabChange={setActiveTab} toolbar={toolbar}>
      {activeTab === 'status' && <SystemStatusTab systemStatus={systemStatus} isLoading={isLoading} />}
      {activeTab === 'automation' && <AutomationTab jobs={jobs} onCancel={handleCancel} />}
      {activeTab === 'registry' && <ToolRegistryTab />}
      {activeTab === 'integrations' && <IntegrationsTab />}
      {activeTab === 'logs' && <LogsTab jobs={jobs} />}
      {activeTab === 'killswitch' && <KillSwitchTab killSwitchState={killSwitchState} onToggle={handleKillSwitchToggle} />}
    </N3WorkspaceLayout>
  );
}
