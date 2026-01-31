// app/tools/deploy-center/page.tsx
/**
 * N3 デプロイセンター - 不沈艦管理パネル（完全版 v2）
 * 
 * 機能:
 * - 2リポジトリ管理（n3-frontend_new: 保存用 / n3-frontend_vps: VPSデプロイ用）
 * - ローカル/VPS同期状態の可視化
 * - 野良ファイルスキャン & 整理
 * - ルート → 01_PRODUCT 同期
 * - 02_DEV_LAB → 01_PRODUCT 昇格
 * - Git操作（push/pull）
 * - VPS操作（pull/clean-deploy）
 * - リアルタイムログ表示
 * - 自動バックアップ設定ガイド
 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Ship, GitBranch, Upload, Download, FolderSync, AlertTriangle, 
  CheckCircle2, XCircle, RefreshCw, Terminal, FileCode, 
  Folder, ArrowRight, Clock, Zap, Shield, Database,
  Play, Loader2, ExternalLink, Copy, Check, Info, Trash2,
  FolderUp, Server, HardDrive, GitCommit, AlertCircle,
  RotateCcw, Rocket, FileWarning, Save, Calendar
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface GitStatus {
  branch: string;
  commit: string;
  remote: string;
  hasChanges: boolean;
  changeCount: number;
  changes: string[];
  error?: string;
}

interface VpsRepoStatus {
  path: string;
  branch: string;
  commit: string;
  remote: string;
  hasChanges: boolean;
  changeCount: number;
  changes: string[];
  error?: string;
}

interface VpsStatus {
  reachable: boolean;
  commit: string;
  host: string;
  path: string;
  pm2?: {
    status: string;
    uptime: number;
    restarts: number;
    memory: number;
  };
  error?: string;
}

interface OrphanFile {
  name: string;
  path: string;
  destination: string;
  reason: string;
  category: 'dev' | 'archive' | 'unknown';
  isDirectory: boolean;
}

interface DeployLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'success' | 'error' | 'running' | 'info';
  message: string;
  details?: string;
}

// API設定
const ADMIN_KEY = 'n3-deploy-2026';

// シェルコマンド定数（JSX内でのシンタックスエラー回避）
const SHELL_COMMANDS = {
  syncToVpsRepo: "rsync -av --delete --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.env*' --exclude='01_PRODUCT' --exclude='02_DEV_LAB' --exclude='03_VAULT' ~/n3-frontend_new/ ~/n3-frontend_vps/",
  pushVpsRepo: "cd ~/n3-frontend_vps && git add -A && git commit -m \"deploy: \\$(date '+%Y%m%d_%H%M%S')\" && git push origin main",
  vpsPull: "ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && git pull origin main && pm2 restart n3'",
  fullDeploy: "rsync -av --delete --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.env*' --exclude='01_PRODUCT' --exclude='02_DEV_LAB' --exclude='03_VAULT' ~/n3-frontend_new/ ~/n3-frontend_vps/ && cd ~/n3-frontend_vps && git add -A && git commit -m \"deploy: \\$(date '+%Y%m%d_%H%M%S')\" && git push origin main && ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && git pull origin main && pm2 restart n3'",
  cleanDeploy: "ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && rm -rf app lib components config contexts hooks layouts services store types && git checkout . && git pull origin main && npm install && pm2 restart n3'",
  syncRoot: "cd ~/n3-frontend_new && bash scripts/n3-sync-root.sh",
  promote: "cd ~/n3-frontend_new && bash scripts/n3-promote.sh",
  backupPush: "cd ~/n3-frontend_new && git add -A && git commit -m \"backup: \\$(date '+%Y%m%d_%H%M%S')\" && git push origin main",
  crontabEdit: "crontab -e",
  crontabLine: "0 3 * * * ~/n3-frontend_new/scripts/n3-auto-deploy.sh >> ~/n3-deploy.log 2>&1",
  legacyPromote: "cd ~/n3-frontend_new && bash scripts/n3-promote.sh",
  legacyPush: "cd ~/n3-frontend_new && bash scripts/n3-push.sh",
  legacyOneliner: "cd ~/n3-frontend_new && bash scripts/n3-push.sh -y && ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && git pull && pm2 restart n3'",
};

// ============================================================
// API呼び出しフック
// ============================================================

function useDeployApi() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const callApi = useCallback(async (action: string, params?: any) => {
    setLoading(prev => ({ ...prev, [action]: true }));
    
    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, params, adminKey: ADMIN_KEY }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      return data;
    } finally {
      setLoading(prev => ({ ...prev, [action]: false }));
    }
  }, []);

  const getStatus = useCallback(async () => {
    const response = await fetch('/api/admin/deploy');
    return response.json();
  }, []);

  return { callApi, getStatus, loading };
}

// ============================================================
// サブコンポーネント
// ============================================================

function StatusCard({ 
  title, 
  value, 
  icon: Icon, 
  status,
  subtitle,
  onClick,
  loading,
}: { 
  title: string; 
  value: string; 
  icon: React.ComponentType<{ size?: number }>; 
  status: 'ok' | 'warning' | 'error' | 'info';
  subtitle?: string;
  onClick?: () => void;
  loading?: boolean;
}) {
  const statusColors = {
    ok: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
    warning: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', text: '#f97316' },
    error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
    info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' },
  };
  const colors = statusColors[status];

  return (
    <div 
      onClick={onClick}
      style={{
        padding: 16,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        flex: 1,
        minWidth: 160,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: colors.border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {loading ? <Loader2 size={18} style={{ color: colors.text }} className="animate-spin" /> : <Icon size={18} style={{ color: colors.text }} />}
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{title}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{value}</div>
        </div>
      </div>
      {subtitle && (
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{subtitle}</div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  variant = 'default',
  loading = false,
  disabled = false,
  size = 'normal',
}: {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'success';
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'normal';
}) {
  const variants = {
    default: { bg: 'var(--panel)', text: 'var(--text)', border: 'var(--panel-border)' },
    primary: { bg: '#6366f1', text: 'white', border: '#6366f1' },
    danger: { bg: '#ef4444', text: 'white', border: '#ef4444' },
    success: { bg: '#22c55e', text: 'white', border: '#22c55e' },
  };
  const style = variants[variant];
  const padding = size === 'small' ? '8px 14px' : '12px 20px';
  const fontSize = size === 'small' ? 12 : 14;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding,
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        borderRadius: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize,
        fontWeight: 600,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
      }}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
      {label}
    </button>
  );
}

function CommandCopyCard({ command, description, highlight }: { command: string; description: string; highlight?: 'green' | 'blue' | 'red' | 'orange' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightColors: Record<string, { bg: string; border: string }> = {
    green: { bg: 'rgba(34, 197, 94, 0.05)', border: 'rgba(34, 197, 94, 0.2)' },
    blue: { bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.2)' },
    red: { bg: 'rgba(239, 68, 68, 0.05)', border: 'rgba(239, 68, 68, 0.2)' },
    orange: { bg: 'rgba(249, 115, 22, 0.05)', border: 'rgba(249, 115, 22, 0.2)' },
  };
  const colors = highlight ? highlightColors[highlight] : { bg: 'var(--panel)', border: 'var(--panel-border)' };

  return (
    <div style={{
      padding: 14,
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: 10,
    }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
        {description}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <code style={{
          flex: 1,
          fontSize: 10,
          background: 'var(--highlight)',
          padding: '8px 10px',
          borderRadius: 6,
          color: '#22c55e',
          fontFamily: 'monospace',
          overflow: 'auto',
          whiteSpace: 'nowrap',
        }}>
          {command}
        </code>
        <button
          onClick={handleCopy}
          style={{
            padding: '8px 12px',
            background: copied ? '#22c55e' : 'var(--highlight)',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: copied ? 'white' : 'var(--text)',
            fontSize: 11,
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}

function OrphanFilesList({ 
  files, 
  onMove, 
  onMoveAll,
  loading 
}: { 
  files: OrphanFile[]; 
  onMove: (file: OrphanFile) => void;
  onMoveAll: () => void;
  loading: boolean;
}) {
  const categoryColors = {
    dev: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6', label: 'DEV' },
    archive: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', text: '#8b5cf6', label: 'ARCHIVE' },
    unknown: { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)', text: '#6b7280', label: '???' },
  };

  if (files.length === 0) {
    return (
      <div style={{
        padding: 40,
        textAlign: 'center',
        background: 'rgba(34, 197, 94, 0.05)',
        borderRadius: 12,
        border: '1px dashed rgba(34, 197, 94, 0.3)',
      }}>
        <CheckCircle2 size={48} style={{ color: '#22c55e', marginBottom: 12 }} />
        <div style={{ fontSize: 16, fontWeight: 600, color: '#22c55e' }}>野良ファイルなし！</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          ディレクトリは整理されています
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{files.length}件の野良ファイル</span>
        <ActionButton label="すべて移動" icon={FolderSync} onClick={onMoveAll} variant="primary" size="small" loading={loading} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {files.map((file, idx) => {
          const colors = categoryColors[file.category];
          return (
            <div key={idx} style={{ padding: 12, background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 6px', background: colors.border, color: colors.text, borderRadius: 4 }}>{colors.label}</span>
              {file.isDirectory ? <Folder size={14} /> : <FileCode size={14} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ArrowRight size={10} />{file.destination}
                </div>
              </div>
              <button onClick={() => onMove(file)} style={{ padding: '6px 10px', background: colors.text, color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>移動</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeployLogs({ logs, onClear }: { logs: DeployLog[]; onClear: () => void }) {
  const statusIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 size={14} style={{ color: '#22c55e' }} />,
    error: <XCircle size={14} style={{ color: '#ef4444' }} />,
    running: <Loader2 size={14} style={{ color: '#6366f1' }} />,
    info: <Info size={14} style={{ color: '#3b82f6' }} />,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>実行ログ</span>
        <button onClick={onClear} style={{ padding: '4px 10px', background: 'var(--highlight)', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: 'var(--text-muted)' }}>クリア</button>
      </div>
      <div style={{ background: '#0d1117', borderRadius: 8, padding: 12, maxHeight: 200, overflowY: 'auto', fontFamily: 'monospace' }}>
        {logs.length === 0 ? (
          <div style={{ color: '#6b7280', fontSize: 11, textAlign: 'center', padding: 16 }}>ログはまだありません</div>
        ) : (
          logs.map(log => (
            <div key={log.id} style={{ marginBottom: 8, fontSize: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {statusIcons[log.status]}
                <span style={{ color: '#6b7280' }}>{new Date(log.timestamp).toLocaleTimeString('ja-JP')}</span>
                <span style={{ color: '#8b5cf6', fontWeight: 600 }}>[{log.action}]</span>
                <span style={{ color: '#e5e7eb' }}>{log.message}</span>
              </div>
              {log.details && <div style={{ color: '#6b7280', marginLeft: 20, marginTop: 2, fontSize: 10 }}>{log.details}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function DeployCenterPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'sync' | 'orphans' | 'vps' | 'scripts'>('overview');
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [vpsRepoStatus, setVpsRepoStatus] = useState<VpsRepoStatus | null>(null);
  const [vpsStatus, setVpsStatus] = useState<VpsStatus | null>(null);
  const [orphanFiles, setOrphanFiles] = useState<OrphanFile[]>([]);
  const [logs, setLogs] = useState<DeployLog[]>([]);
  const { callApi, getStatus, loading } = useDeployApi();

  const addLog = useCallback((action: string, status: DeployLog['status'], message: string, details?: string) => {
    const log: DeployLog = { id: Date.now().toString(), timestamp: new Date().toISOString(), action, status, message, details };
    setLogs(prev => [log, ...prev].slice(0, 50));
    return log.id;
  }, []);

  const updateLog = useCallback((id: string, updates: Partial<DeployLog>) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const result = await getStatus();
        if (result.success) {
          setGitStatus(result.data.git);
          setVpsRepoStatus(result.data.vpsRepo);
          setVpsStatus(result.data.vps);
          setOrphanFiles(result.data.orphans?.orphans || []);
        }
      } catch (error) {
        console.error('Status load error:', error);
      }
    };
    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [getStatus]);

  // アクションハンドラー
  const handleScan = useCallback(async () => {
    const logId = addLog('scan', 'running', 'スキャン中...');
    try {
      const result = await callApi('scan');
      setOrphanFiles(result.data.orphans);
      updateLog(logId, { status: 'success', message: `${result.data.count}件の野良ファイルを検出` });
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  const handleMoveOrphan = useCallback(async (file: OrphanFile) => {
    const logId = addLog('move', 'running', `${file.name} を移動中...`);
    try {
      await callApi('move-orphans', { files: [file.name] });
      setOrphanFiles(prev => prev.filter(f => f.name !== file.name));
      updateLog(logId, { status: 'success', message: `${file.name} → ${file.destination}` });
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  const handleMoveAllOrphans = useCallback(async () => {
    const logId = addLog('move-all', 'running', '全ての野良ファイルを移動中...');
    try {
      const result = await callApi('move-orphans');
      setOrphanFiles([]);
      updateLog(logId, { status: 'success', message: `${result.data.moved}件を移動完了` });
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  const handleSyncRoot = useCallback(async () => {
    const logId = addLog('sync-root', 'running', 'ルート → 01_PRODUCT 同期中...');
    try {
      const result = await callApi('sync-root');
      updateLog(logId, { status: 'success', message: `${result.data.synced}/${result.data.total} 同期完了` });
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  const handlePromote = useCallback(async (type?: 'n8n' | 'sql' | 'all') => {
    const logId = addLog('promote', 'running', `昇格中 (${type || 'all'})...`);
    try {
      const result = await callApi('promote', { type });
      updateLog(logId, { status: 'success', message: `${result.data.promoted}件を昇格完了` });
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  const handlePush = useCallback(async () => {
    const logId = addLog('push', 'running', 'n3-frontend_new Push中...');
    try {
      const result = await callApi('push');
      if (result.data.pushed) {
        updateLog(logId, { status: 'success', message: `Push完了: ${result.data.newCommit}`, details: `${result.data.changesCommitted}件の変更` });
        setGitStatus(prev => prev ? { ...prev, commit: result.data.newCommit, hasChanges: false, changeCount: 0 } : null);
      } else { updateLog(logId, { status: 'info', message: '変更なし' }); }
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  const handleSyncToVpsRepo = useCallback(async () => {
    const logId = addLog('sync-to-vps-repo', 'running', '開発 → VPSリポジトリ同期中...');
    try {
      const result = await callApi('sync-to-vps-repo');
      updateLog(logId, { status: 'success', message: `同期完了: ${result.data.changesInVpsRepo}件の変更` });
      // VPSリポジトリステータス更新
      const statusResult = await getStatus();
      if (statusResult.success) setVpsRepoStatus(statusResult.data.vpsRepo);
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, getStatus, addLog, updateLog]);

  const handlePushVpsRepo = useCallback(async () => {
    const logId = addLog('push-vps-repo', 'running', 'n3-frontend_vps Push中...');
    try {
      const result = await callApi('push-vps-repo');
      if (result.data.pushed) {
        updateLog(logId, { status: 'success', message: `Push完了: ${result.data.newCommit}`, details: `${result.data.changesCommitted}件の変更` });
        setVpsRepoStatus(prev => prev ? { ...prev, commit: result.data.newCommit, hasChanges: false, changeCount: 0 } : null);
      } else { updateLog(logId, { status: 'info', message: '変更なし' }); }
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  const handleVpsPull = useCallback(async () => {
    const logId = addLog('vps-pull', 'running', 'VPS Pull中...');
    try {
      const result = await callApi('vps-pull');
      updateLog(logId, { status: 'success', message: `VPS更新完了: ${result.data.newCommit}` });
      setVpsStatus(prev => prev ? { ...prev, commit: result.data.newCommit } : null);
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  const handleCleanDeploy = useCallback(async () => {
    if (!confirm('⚠️ クリーンデプロイを実行しますか？\n\nVPSの全ファイルを削除して再構築します。')) return;
    const logId = addLog('clean-deploy', 'running', 'クリーンデプロイ中...');
    try {
      const result = await callApi('clean-deploy');
      updateLog(logId, { status: 'success', message: `クリーンデプロイ完了: ${result.data.newCommit}` });
      setVpsStatus(prev => prev ? { ...prev, commit: result.data.newCommit } : null);
    } catch (error: any) { updateLog(logId, { status: 'error', message: error.message }); }
  }, [callApi, addLog, updateLog]);

  // フルデプロイ（同期→Push→VPS Pull）
  const handleFullDeploy = useCallback(async () => {
    if (!confirm('🚀 フルデプロイを実行しますか？\n\n1. 開発 → VPSリポジトリ同期\n2. VPSリポジトリ Push\n3. VPS Pull & Restart')) return;
    
    const logId = addLog('full-deploy', 'running', 'フルデプロイ開始...');
    try {
      // 1. 同期
      updateLog(logId, { message: '1/3: VPSリポジトリへ同期中...' });
      await callApi('sync-to-vps-repo');
      
      // 2. Push
      updateLog(logId, { message: '2/3: GitHubへPush中...' });
      await callApi('push-vps-repo');
      
      // 3. VPS Pull
      updateLog(logId, { message: '3/3: VPS Pull中...' });
      const result = await callApi('vps-pull');
      
      updateLog(logId, { status: 'success', message: `フルデプロイ完了: ${result.data.newCommit}` });
      
      // ステータス更新
      const statusResult = await getStatus();
      if (statusResult.success) {
        setVpsRepoStatus(statusResult.data.vpsRepo);
        setVpsStatus(statusResult.data.vps);
      }
    } catch (error: any) {
      updateLog(logId, { status: 'error', message: error.message });
    }
  }, [callApi, getStatus, addLog, updateLog]);

  const isSynced = vpsRepoStatus && vpsStatus && vpsRepoStatus.commit === vpsStatus.commit;

  const tabs = [
    { id: 'overview' as const, label: '概要', icon: Ship },
    { id: 'branches' as const, label: 'ブランチ運用', icon: GitBranch },
    { id: 'sync' as const, label: '同期', icon: FolderSync },
    { id: 'orphans' as const, label: '野良ファイル', icon: FileWarning, badge: orphanFiles.length },
    { id: 'vps' as const, label: 'VPS', icon: Server },
    { id: 'scripts' as const, label: 'スクリプト', icon: Terminal },
  ];

  return (
    <div style={{ height: '100%', background: 'var(--bg)', overflow: 'auto' }}>
      {/* ヘッダー */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--panel-border)', background: 'var(--panel)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ship size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>🚢 不沈艦N3 デプロイセンター</h1>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>2リポジトリ管理 + VPS同期</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <ActionButton label="スキャン" icon={RefreshCw} onClick={handleScan} loading={loading.scan} size="small" />
            <ActionButton label="フルデプロイ" icon={Rocket} onClick={handleFullDeploy} variant="success" loading={loading['full-deploy']} size="small" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: activeTab === tab.id ? '#6366f1' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span style={{ background: '#ef4444', color: 'white', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 8 }}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツ */}
      <div style={{ padding: 20 }}>
        {/* 概要タブ */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <StatusCard title="開発 (n3-frontend_new)" value={gitStatus?.commit || '---'} icon={GitCommit} status={gitStatus?.hasChanges ? 'warning' : 'ok'} subtitle={gitStatus?.hasChanges ? `${gitStatus.changeCount}件の変更` : '変更なし'} />
              <StatusCard title="VPSリポ (n3-frontend_vps)" value={vpsRepoStatus?.commit || '---'} icon={GitBranch} status={vpsRepoStatus?.hasChanges ? 'warning' : 'info'} subtitle={vpsRepoStatus?.hasChanges ? `${vpsRepoStatus.changeCount}件の変更` : 'ローカル'} />
              <StatusCard title="VPS本番" value={vpsStatus?.commit || '---'} icon={Server} status={vpsStatus?.reachable ? (isSynced ? 'ok' : 'warning') : 'error'} subtitle={vpsStatus?.reachable ? (isSynced ? '同期済み' : 'ローカルと差分') : '接続不可'} />
              <StatusCard title="野良ファイル" value={`${orphanFiles.length}件`} icon={FileWarning} status={orphanFiles.length === 0 ? 'ok' : 'warning'} onClick={() => setActiveTab('orphans')} />
            </div>

            {/* 2リポジトリ構成の説明 */}
            <div style={{ padding: 16, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 10, marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Info size={16} />リポジトリ構成</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 11 }}>
                <div style={{ padding: 10, background: 'var(--panel)', borderRadius: 6 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>📦 n3-frontend_new（保存用）</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>開発作業 + 毎日自動バックアップ</div>
                </div>
                <div style={{ padding: 10, background: 'var(--panel)', borderRadius: 6 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>🖥️ n3-frontend_vps（VPS用）</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>VPS本番へのデプロイ専用</div>
                </div>
              </div>
            </div>

            {/* デプロイフロー */}
            <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12, marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>🚀 VPSデプロイフロー（推奨）</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap', fontSize: 10 }}>
                {[
                  { icon: '💻', label: 'n3-frontend_new', desc: '開発' },
                  { icon: '📤', label: 'rsync', desc: '同期' },
                  { icon: '📦', label: 'n3-frontend_vps', desc: 'ローカル' },
                  { icon: '⬆️', label: 'git push', desc: 'GitHub' },
                  { icon: '⬇️', label: 'git pull', desc: 'VPS' },
                  { icon: '🖥️', label: 'VPS本番', desc: 'PM2' },
                ].map((step, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 4 }}>{step.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text)' }}>{step.label}</div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{step.desc}</div>
                    </div>
                    {idx < arr.length - 1 && <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <DeployLogs logs={logs} onClear={() => setLogs([])} />
          </div>
        )}

        {/* ブランチ運用タブ */}
        {activeTab === 'branches' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>🌿 ブランチ運用（develop / main）</h2>
            
            {/* 3段階フロー説明 */}
            <div style={{ padding: 16, background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: 10, marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Info size={16} />3段階確認フロー</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap', fontSize: 10, marginBottom: 16 }}>
                {[
                  { icon: '💻', label: 'ローカル', desc: 'localhost:3000', color: '#3b82f6' },
                  { icon: '→', label: '', desc: '', color: 'var(--text-muted)' },
                  { icon: '🧪', label: 'VPS (develop)', desc: '毎日3時自動', color: '#f97316' },
                  { icon: '→', label: '', desc: '', color: 'var(--text-muted)' },
                  { icon: '✅', label: 'VPS (main)', desc: '手動昇格', color: '#22c55e' },
                ].map((step, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    {step.label ? (
                      <>
                        <div style={{ width: 50, height: 50, borderRadius: 10, background: `${step.color}15`, border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 4 }}>{step.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: step.color }}>{step.label}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{step.desc}</div>
                      </>
                    ) : (
                      <div style={{ fontSize: 20, color: 'var(--text-muted)' }}>{step.icon}</div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                <strong>運用方法:</strong><br/>
                1️⃣ ローカルで開発（developブランチ）<br/>
                2️⃣ 毎日午前3時に自動でVPSにdevelopデプロイ<br/>
                3️⃣ VPSで確認してOKなら「本番昇格」ボタンでmainにマージ
              </div>
            </div>

            {/* セットアップ */}
            <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>🛠️ 初回セットアップ</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>まだブランチを作成していない場合はこれを実行</p>
              <CommandCopyCard 
                description="developブランチを作成して切り替え" 
                command="cd ~/n3-frontend_new && bash scripts/n3-setup-branches.sh" 
                highlight="blue"
              />
            </div>

            {/* 日常運用 */}
            <div style={{ padding: 16, background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 12 }}>🚀 日常運用コマンド</h3>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>✅ 本番昇格（VPSで確認OK後）</div>
                <CommandCopyCard 
                  description="develop → main マージ＆本番VPSデプロイ" 
                  command="cd ~/n3-frontend_new && bash scripts/n3-promote-to-main.sh && bash scripts/n3-deploy-production.sh" 
                  highlight="green"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>🔄 手動でdevelopをVPSにデプロイ</div>
                <CommandCopyCard 
                  description="今すぐdevelopをVPSに反映（自動を待たずに確認したい場合）" 
                  command="cd ~/n3-frontend_new && bash scripts/n3-auto-deploy.sh" 
                  highlight="blue"
                />
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>💾 developをGitHubに保存</div>
                <CommandCopyCard 
                  description="開発中の変更をGitHubにバックアップ" 
                  command="cd ~/n3-frontend_new && git add -A && git commit -m 'wip' && git push origin develop" 
                />
              </div>
            </div>

            {/* n8n自動化 */}
            <div style={{ padding: 16, background: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: 10 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f97316', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16} />n8n自動デプロイ設定</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>毎日午前3:00にdevelopブランチを自動でVPSにデプロイ</p>
              
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>n8nワークフローファイル:</div>
                <code style={{ display: 'block', fontSize: 10, background: 'var(--highlight)', padding: 8, borderRadius: 4, color: '#22c55e' }}>
                  ~/n3-frontend_new/n8n-workflows/N3-AUTO-DEPLOY-DEVELOP.json
                </code>
              </div>

              <div style={{ padding: 10, background: 'var(--panel)', borderRadius: 6, fontSize: 10 }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>📌 n8nでの設定方法:</div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  1. n8nの管理画面を開く<br/>
                  2. 「Import from File」で上記JSONを読み込み<br/>
                  3. 環境変数を設定：<br/>
                  &nbsp;&nbsp;- N3_DEPLOY_SCRIPT: ~/n3-frontend_new/scripts/n3-auto-deploy.sh<br/>
                  &nbsp;&nbsp;- CHATWORK_ROOM_ID / CHATWORK_API_KEY（通知用）<br/>
                  4. ワークフローを有効化
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 同期タブ */}
        {activeTab === 'sync' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>📁 ファイル同期 & Git操作</h2>
            
            {/* ローカル整理 */}
            <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>🧹 ローカル整理</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>ルート → 01_PRODUCT</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>app/, lib/などを01_PRODUCTへ同期</div>
                  <ActionButton label="同期" icon={FolderSync} onClick={handleSyncRoot} loading={loading['sync-root']} size="small" />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>DEV_LAB → PRODUCT 昇格</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>n8n/SQLを本番候補へ</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <ActionButton label="n8n" icon={Zap} onClick={() => handlePromote('n8n')} size="small" loading={loading.promote} />
                    <ActionButton label="SQL" icon={Database} onClick={() => handlePromote('sql')} size="small" loading={loading.promote} />
                  </div>
                </div>
              </div>
            </div>

            {/* VPSデプロイ（メイン） */}
            <div style={{ padding: 16, background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 12 }}>🚀 VPSデプロイ（推奨フロー）</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 150, padding: 12, background: 'var(--panel)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>① 開発 → VPSリポジトリ</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 8 }}>n3-frontend_new → n3-frontend_vps</div>
                  <ActionButton label="同期" icon={FolderSync} onClick={handleSyncToVpsRepo} loading={loading['sync-to-vps-repo']} size="small" variant="primary" />
                </div>
                <div style={{ flex: 1, minWidth: 150, padding: 12, background: 'var(--panel)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>② VPSリポジトリ Push</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 8 }}>n3-frontend_vps → GitHub</div>
                  <ActionButton label="Push" icon={Upload} onClick={handlePushVpsRepo} loading={loading['push-vps-repo']} size="small" variant="primary" disabled={!vpsRepoStatus?.hasChanges} />
                </div>
                <div style={{ flex: 1, minWidth: 150, padding: 12, background: 'var(--panel)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>③ VPS Pull</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 8 }}>GitHub → VPS本番</div>
                  <ActionButton label="Pull" icon={Download} onClick={handleVpsPull} loading={loading['vps-pull']} size="small" variant="success" />
                </div>
              </div>
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <ActionButton label="🚀 フルデプロイ（①②③一括）" icon={Rocket} onClick={handleFullDeploy} variant="success" loading={loading['full-deploy']} />
              </div>
            </div>

            {/* 開発リポジトリ保存（バックアップ） */}
            <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>💾 開発リポジトリ保存（バックアップ用）</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>n3-frontend_new をGitHubへ保存（VPSデプロイとは別）</div>
              <ActionButton label="n3-frontend_new Push" icon={Save} onClick={handlePush} loading={loading.push} disabled={!gitStatus?.hasChanges} />
              {gitStatus?.hasChanges && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>{gitStatus.changeCount}件の変更あり</div>}
            </div>
          </div>
        )}

        {/* 野良ファイルタブ */}
        {activeTab === 'orphans' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>🧹 野良ファイル整理</h2>
            <OrphanFilesList files={orphanFiles} onMove={handleMoveOrphan} onMoveAll={handleMoveAllOrphans} loading={loading['move-orphans']} />
          </div>
        )}

        {/* VPSタブ */}
        {activeTab === 'vps' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>🖥️ VPS管理</h2>
            
            <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>ステータス</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                <div style={{ padding: 12, background: 'var(--highlight)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Host</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{vpsStatus?.host || '---'}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--highlight)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Commit</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isSynced ? '#22c55e' : '#f97316' }}>{vpsStatus?.commit || '---'}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--highlight)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>PM2</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: vpsStatus?.pm2?.status === 'online' ? '#22c55e' : '#ef4444' }}>{vpsStatus?.pm2?.status || '---'}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, padding: 16, background: 'var(--panel)', borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>📥 VPS Pull</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>GitHubから最新をプル（差分のみ）</div>
                <ActionButton label="Pull & Restart" icon={Download} onClick={handleVpsPull} variant="success" loading={loading['vps-pull']} />
              </div>
              
              <div style={{ flex: 1, minWidth: 200, padding: 16, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>🔥 クリーンデプロイ</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>VPSの全ファイル削除→再構築</div>
                <ActionButton label="クリーンデプロイ" icon={Trash2} onClick={handleCleanDeploy} variant="danger" loading={loading['clean-deploy']} />
              </div>
            </div>
          </div>
        )}

        {/* スクリプトタブ */}
        {activeTab === 'scripts' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>📜 シェルスクリプト</h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>ターミナルから直接実行する場合はこちらをコピー</p>
            
            {/* VPSデプロイ（メイン） */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 12 }}>🚀 VPSデプロイ（推奨）</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <CommandCopyCard 
                  description="① 開発 → VPSリポジトリ同期" 
                  command="rsync -av --delete --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.env*' --exclude='01_PRODUCT' --exclude='02_DEV_LAB' --exclude='03_VAULT' ~/n3-frontend_new/ ~/n3-frontend_vps/" 
                  highlight="blue"
                />
                <CommandCopyCard 
                  description="② VPSリポジトリ Push（n3-frontend_vps → GitHub）" 
                  command={SHELL_COMMANDS.pushVpsRepo.replace(/\\\\/g, '')} 
                  highlight="blue"
                />
                <CommandCopyCard 
                  description="③ VPS Pull & Restart（GitHub → VPS本番）" 
                  command="ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && git pull origin main && pm2 restart n3'" 
                  highlight="blue"
                />
                <CommandCopyCard 
                  description="🚀 フルデプロイ（①②③一括）" 
                  command={SHELL_COMMANDS.fullDeploy.replace(/\\\\/g, '')} 
                  highlight="green"
                />
              </div>
            </div>

            {/* クリーンデプロイ */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 12 }}>🔥 クリーンデプロイ</h3>
              <CommandCopyCard 
                description="VPS完全再構築（古いファイル削除）" 
                command="ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && rm -rf app lib components config contexts hooks layouts services store types && git checkout . && git pull origin main && npm install && pm2 restart n3'" 
                highlight="red"
              />
            </div>

            {/* ローカル整理 */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>🧹 ローカル整理</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <CommandCopyCard description="ルート → 01_PRODUCT 同期" command="cd ~/n3-frontend_new && bash scripts/n3-sync-root.sh" />
                <CommandCopyCard description="昇格（DEV_LAB → PRODUCT）" command="cd ~/n3-frontend_new && bash scripts/n3-promote.sh" />
              </div>
            </div>

            {/* 開発リポジトリ保存 */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>💾 開発リポジトリ保存（バックアップ）</h3>
              <CommandCopyCard 
                description="n3-frontend_new → GitHub（毎日の保存用）" 
                command={SHELL_COMMANDS.backupPush.replace(/\\\\/g, '')} 
                highlight="orange"
              />
            </div>

            {/* 夜間自動デプロイ設定（VPSまで自動） */}
            <div style={{ padding: 16, background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: 10, marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16} />🌙 夜間自動デプロイ設定（VPSまで自動）</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>毎日午前3:00にローカル同期→GitHub Push→VPS Pullを自動実行</p>
              
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>ステップ1: 自動デプロイスクリプトを作成</div>
                <CommandCopyCard 
                  description="スクリプトを作成（コピーしてターミナルで実行）" 
                  command={`cat > ~/n3-frontend_new/scripts/n3-auto-deploy.sh << 'EOF'
#!/bin/bash
set -e
log() { echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1"; }
log "🚀 N3 自動デプロイ開始"
rsync -av --delete --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.env*' --exclude='01_PRODUCT' --exclude='02_DEV_LAB' --exclude='03_VAULT' ~/n3-frontend_new/ ~/n3-frontend_vps/
cd ~/n3-frontend_vps
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A && git commit -m "auto-deploy: \$(date '+%Y%m%d_%H%M%S')" && git push origin main
  log "✅ GitHub Push完了"
else
  log "ℹ️ 変更なし"
fi
ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && git pull origin main && pm2 restart n3'
log "🎉 VPS更新完了"
EOF
chmod +x ~/n3-frontend_new/scripts/n3-auto-deploy.sh`}
                  highlight="green"
                />
              </div>
              
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>ステップ2: crontabに登録</div>
                <CommandCopyCard 
                  description="crontab編集を開く" 
                  command="crontab -e" 
                />
                <div style={{ marginTop: 8 }}>
                  <CommandCopyCard 
                    description="以下の行を追加（毎日午前3:00に実行）" 
                    command="0 3 * * * ~/n3-frontend_new/scripts/n3-auto-deploy.sh >> ~/n3-deploy.log 2>&1" 
                    highlight="green"
                  />
                </div>
              </div>
              
              <div style={{ padding: 10, background: 'var(--panel)', borderRadius: 6, fontSize: 10 }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>📌 動作確認:</div>
                <div style={{ color: 'var(--text-muted)' }}>
                  ・手動テスト: <code style={{ background: 'var(--highlight)', padding: '2px 4px', borderRadius: 3 }}>bash ~/n3-frontend_new/scripts/n3-auto-deploy.sh</code><br/>
                  ・ログ確認: <code style={{ background: 'var(--highlight)', padding: '2px 4px', borderRadius: 3 }}>tail -f ~/n3-deploy.log</code>
                </div>
              </div>
            </div>

            {/* 開発リポジトリのみの自動バックアップ */}
            <div style={{ padding: 16, background: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: 10 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f97316', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16} />毎日自動バックアップ（開発リポジトリのみ）</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>VPSにはデプロイせず、n3-frontend_new のみGitHubへ保存（午前3:00）</p>
              <CommandCopyCard 
                description="crontab編集を開く" 
                command="crontab -e" 
              />
              <div style={{ marginTop: 10 }}>
                <CommandCopyCard 
                  description="以下の行を追加して保存" 
                  command="0 3 * * * cd ~/n3-frontend_new && git add -A && git commit -m 'auto-backup' && git push origin main >> ~/n3-backup.log 2>&1" 
                />
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text-muted)' }}>
                ※ こちらはVPSへのデプロイなし。開発リポジトリの保存のみ。
              </div>
            </div>

            {/* レガシーコマンド（既存維持） */}
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>📚 レガシーコマンド（旧バージョン）</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.7 }}>
                <CommandCopyCard description="旧: 昇格（02_DEV_LAB → 01_PRODUCT）" command="cd ~/n3-frontend_new && bash scripts/n3-promote.sh" />
                <CommandCopyCard description="旧: Git Push（n3-frontend_new）" command="cd ~/n3-frontend_new && bash scripts/n3-push.sh" />
                <CommandCopyCard description="旧: ワンライナー（全工程）" command="cd ~/n3-frontend_new && bash scripts/n3-push.sh -y && ssh ubuntu@160.16.120.186 'cd ~/n3-frontend-vps && git pull && pm2 restart n3'" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
