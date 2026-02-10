// app/tools/cron-management/page.tsx
/**
 * N3 Empire OS V8 - Cron Job管理UI
 * 
 * 機能:
 * 1. Cron Job一覧表示
 * 2. 有効/無効切替
 * 3. 新規作成・編集
 * 4. 手動実行
 * 5. 実行履歴表示
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock, Play, Pause, RefreshCw, Plus, Settings, CheckCircle,
  XCircle, AlertCircle, Loader2, Calendar, ChevronDown, ChevronRight,
  Trash2, Edit2, Zap, Bell, BellOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { N3CollapsibleHeader, N3Footer } from '@/components/n3';
import { createClient } from '@/lib/supabase/client';

// ============================================================
// 型定義
// ============================================================

interface CronJob {
  id: string;
  name: string;
  description: string | null;
  workflow_id: string | null;
  webhook_path: string | null;
  cron_expression: string;
  timezone: string;
  enabled: boolean;
  category: string | null;
  last_run_at: string | null;
  last_run_status: string | null;
  last_run_duration_ms: number | null;
  last_run_error: string | null;
  next_run_at: string | null;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  retry_on_failure: boolean;
  max_retries: number;
  timeout_seconds: number;
  notify_on_failure: boolean;
  notify_on_success: boolean;
  notification_channels: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================
// 定数
// ============================================================

const CATEGORY_COLORS: Record<string, string> = {
  research: '#8b5cf6',
  inventory: '#10b981',
  listing: '#3b82f6',
  media: '#f59e0b',
  defense: '#14b8a6',
  system: '#6b7280',
};

const CATEGORY_LABELS: Record<string, string> = {
  research: 'リサーチ',
  inventory: '在庫',
  listing: '出品',
  media: 'メディア',
  defense: '防衛',
  system: 'システム',
};

const CRON_PRESETS = [
  { label: '毎分', value: '* * * * *' },
  { label: '5分ごと', value: '*/5 * * * *' },
  { label: '15分ごと', value: '*/15 * * * *' },
  { label: '30分ごと', value: '*/30 * * * *' },
  { label: '1時間ごと', value: '0 * * * *' },
  { label: '毎日3:00', value: '0 3 * * *' },
  { label: '毎日8:00', value: '0 8 * * *' },
  { label: '毎日10:00', value: '0 10 * * *' },
  { label: '毎週月曜9:00', value: '0 9 * * 1' },
];

// ============================================================
// Cron式を人間読み可能な形式に変換
// ============================================================

function parseCronExpression(cron: string): string {
  const parts = cron.split(' ');
  if (parts.length !== 5) return cron;
  
  const [minute, hour, day, month, weekday] = parts;
  
  // よくあるパターンをマッチ
  if (cron === '* * * * *') return '毎分';
  if (minute.startsWith('*/')) return `${minute.replace('*/', '')}分ごと`;
  if (hour === '*' && minute === '0') return '毎時';
  if (weekday === '*' && day === '*') {
    return `毎日 ${hour}:${minute.padStart(2, '0')}`;
  }
  if (weekday !== '*' && day === '*') {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `毎週${weekdays[parseInt(weekday)] || weekday}曜 ${hour}:${minute.padStart(2, '0')}`;
  }
  
  return cron;
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function CronManagementPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<CronJob | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  
  const supabase = createClient();

  // ============================================================
  // データ取得
  // ============================================================
  
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cron_jobs')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to fetch cron jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchJobs();
    
    // リアルタイム更新
    const channel = supabase
      .channel('cron_jobs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cron_jobs'
      }, () => {
        fetchJobs();
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, [fetchJobs, supabase]);

  // ============================================================
  // 有効/無効切替
  // ============================================================
  
  const toggleJob = useCallback(async (job: CronJob) => {
    try {
      const { error } = await supabase
        .from('cron_jobs')
        .update({ enabled: !job.enabled })
        .eq('id', job.id);
      
      if (error) throw error;
      
      setJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, enabled: !j.enabled } : j
      ));
    } catch (err) {
      console.error('Failed to toggle job:', err);
    }
  }, [supabase]);

  // ============================================================
  // 手動実行
  // ============================================================
  
  const executeJob = useCallback(async (job: CronJob) => {
    if (!job.webhook_path) {
      alert('Webhook pathが設定されていません');
      return;
    }
    
    setExecuting(job.id);
    
    try {
      const response = await fetch('/api/n8n-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: job.webhook_path,
          data: {
            trigger: 'manual',
            source: 'cron-management-ui',
            job_id: job.id,
            timestamp: new Date().toISOString()
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // ステータス更新
        await supabase
          .from('cron_jobs')
          .update({
            last_run_at: new Date().toISOString(),
            last_run_status: 'success',
            total_runs: job.total_runs + 1,
            successful_runs: job.successful_runs + 1
          })
          .eq('id', job.id);
        
        fetchJobs();
        alert('実行完了');
      } else {
        throw new Error(result.error || '実行失敗');
      }
    } catch (err: any) {
      console.error('Failed to execute job:', err);
      
      await supabase
        .from('cron_jobs')
        .update({
          last_run_at: new Date().toISOString(),
          last_run_status: 'error',
          last_run_error: err.message,
          total_runs: job.total_runs + 1,
          failed_runs: job.failed_runs + 1
        })
        .eq('id', job.id);
      
      fetchJobs();
      alert(`実行エラー: ${err.message}`);
    } finally {
      setExecuting(null);
    }
  }, [supabase, fetchJobs]);

  // ============================================================
  // 削除
  // ============================================================
  
  const deleteJob = useCallback(async (job: CronJob) => {
    if (!confirm(`「${job.name}」を削除しますか？`)) return;
    
    try {
      const { error } = await supabase
        .from('cron_jobs')
        .delete()
        .eq('id', job.id);
      
      if (error) throw error;
      
      setJobs(prev => prev.filter(j => j.id !== job.id));
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  }, [supabase]);

  // ============================================================
  // 統計
  // ============================================================
  
  const stats = {
    total: jobs.length,
    enabled: jobs.filter(j => j.enabled).length,
    disabled: jobs.filter(j => !j.enabled).length,
    running: jobs.filter(j => j.last_run_status === 'running').length,
    errors: jobs.filter(j => j.last_run_status === 'error').length
  };

  // ============================================================
  // レンダリング
  // ============================================================
  
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div 
        id="main-scroll-container"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          height: '100%',
          overflow: 'auto'
        }}
      >
        {/* ヘッダー */}
        <N3CollapsibleHeader scrollContainerId="main-scroll-container" threshold={10}>
          <div style={{ 
            height: 56, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 16px',
            background: 'var(--panel)', 
            borderBottom: '1px solid var(--panel-border)' 
          }}>
            <div className="flex items-center gap-3">
              <Clock size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                ⏰ Cron Job管理
              </h1>
              <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#3b82f6', color: 'white' }}>
                P0 必須機能
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchJobs}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-sm"
                style={{ 
                  background: 'var(--highlight)',
                  color: 'var(--text)',
                  border: '1px solid var(--panel-border)'
                }}
              >
                <RefreshCw size={14} />
                更新
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                <Plus size={14} />
                新規作成
              </button>
            </div>
          </div>
          
          {/* 統計バー */}
          <div style={{ 
            height: 40, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16,
            padding: '0 16px',
            background: 'var(--highlight)', 
            borderBottom: '1px solid var(--panel-border)',
            fontSize: 13
          }}>
            <span style={{ color: 'var(--text-muted)' }}>
              総数: <strong style={{ color: 'var(--text)' }}>{stats.total}</strong>
            </span>
            <span style={{ color: '#22c55e' }}>
              有効: <strong>{stats.enabled}</strong>
            </span>
            <span style={{ color: '#6b7280' }}>
              無効: <strong>{stats.disabled}</strong>
            </span>
            {stats.running > 0 && (
              <span style={{ color: '#3b82f6' }}>
                実行中: <strong>{stats.running}</strong>
              </span>
            )}
            {stats.errors > 0 && (
              <span style={{ color: '#ef4444' }}>
                エラー: <strong>{stats.errors}</strong>
              </span>
            )}
          </div>
        </N3CollapsibleHeader>

        {/* メインコンテンツ */}
        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
              <Clock size={48} className="mx-auto mb-4 opacity-30" />
              <p>Cron Jobが登録されていません</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 rounded"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                最初のCron Jobを作成
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <div
                  key={job.id}
                  className="rounded-lg overflow-hidden"
                  style={{ 
                    background: 'var(--panel)',
                    border: '1px solid var(--panel-border)'
                  }}
                >
                  {/* Job ヘッダー */}
                  <div 
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    {/* 展開アイコン */}
                    {expandedJob === job.id ? (
                      <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                    )}
                    
                    {/* 有効/無効トグル */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleJob(job); }}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        job.enabled ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      <div 
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          job.enabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    
                    {/* カテゴリバッジ */}
                    {job.category && (
                      <span 
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ 
                          background: CATEGORY_COLORS[job.category] || '#6b7280',
                          color: 'white'
                        }}
                      >
                        {CATEGORY_LABELS[job.category] || job.category}
                      </span>
                    )}
                    
                    {/* Job名 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate" style={{ color: 'var(--text)' }}>
                        {job.name}
                      </h3>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {parseCronExpression(job.cron_expression)}
                        {job.description && ` • ${job.description}`}
                      </p>
                    </div>
                    
                    {/* ステータスバッジ */}
                    {job.last_run_status && (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                        job.last_run_status === 'success' ? 'bg-green-100 text-green-700' :
                        job.last_run_status === 'error' ? 'bg-red-100 text-red-700' :
                        job.last_run_status === 'running' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.last_run_status === 'success' && <CheckCircle size={12} />}
                        {job.last_run_status === 'error' && <XCircle size={12} />}
                        {job.last_run_status === 'running' && <Loader2 size={12} className="animate-spin" />}
                        {job.last_run_status}
                      </span>
                    )}
                    
                    {/* 次回実行 */}
                    {job.enabled && job.next_run_at && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        次回: {new Date(job.next_run_at).toLocaleString('ja-JP')}
                      </span>
                    )}
                    
                    {/* アクションボタン */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); executeJob(job); }}
                        disabled={executing === job.id}
                        className="p-2 rounded hover:bg-gray-100"
                        title="手動実行"
                      >
                        {executing === job.id ? (
                          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />
                        ) : (
                          <Play size={16} style={{ color: '#22c55e' }} />
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingJob(job); }}
                        className="p-2 rounded hover:bg-gray-100"
                        title="編集"
                      >
                        <Edit2 size={16} style={{ color: 'var(--text-muted)' }} />
                      </button>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteJob(job); }}
                        className="p-2 rounded hover:bg-red-50"
                        title="削除"
                      >
                        <Trash2 size={16} style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                  
                  {/* 詳細パネル */}
                  {expandedJob === job.id && (
                    <div 
                      className="p-4 border-t"
                      style={{ 
                        background: 'var(--highlight)',
                        borderColor: 'var(--panel-border)'
                      }}
                    >
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Webhook Path</p>
                          <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--panel)' }}>
                            {job.webhook_path || '未設定'}
                          </code>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Cron式</p>
                          <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--panel)' }}>
                            {job.cron_expression}
                          </code>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>タイムゾーン</p>
                          <span>{job.timezone}</span>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>実行統計</p>
                          <span>
                            総数: {job.total_runs} / 
                            成功: <span style={{ color: '#22c55e' }}>{job.successful_runs}</span> / 
                            失敗: <span style={{ color: '#ef4444' }}>{job.failed_runs}</span>
                          </span>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>最終実行</p>
                          <span>
                            {job.last_run_at 
                              ? new Date(job.last_run_at).toLocaleString('ja-JP')
                              : '未実行'}
                            {job.last_run_duration_ms && ` (${(job.last_run_duration_ms / 1000).toFixed(1)}s)`}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>通知設定</p>
                          <span className="flex items-center gap-2">
                            {job.notify_on_failure ? (
                              <span className="flex items-center gap-1 text-red-500">
                                <Bell size={12} /> 失敗時通知
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-gray-400">
                                <BellOff size={12} /> 失敗時通知OFF
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      {job.last_run_error && (
                        <div className="mt-4 p-3 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
                          <p className="text-xs font-medium mb-1" style={{ color: '#ef4444' }}>最終エラー</p>
                          <pre className="text-xs whitespace-pre-wrap" style={{ color: '#ef4444' }}>
                            {job.last_run_error}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <N3Footer 
          copyright="© 2025 N3 Empire"
          version="v8.0.0"
          status={{ label: 'Cron', connected: true }}
        />
      </div>

      {/* 作成/編集モーダル */}
      {(showCreateModal || editingJob) && (
        <CronJobModal
          job={editingJob}
          onClose={() => { setShowCreateModal(false); setEditingJob(null); }}
          onSave={fetchJobs}
        />
      )}
    </div>
  );
}

// ============================================================
// Cron Job作成/編集モーダル
// ============================================================

interface CronJobModalProps {
  job: CronJob | null;
  onClose: () => void;
  onSave: () => void;
}

function CronJobModal({ job, onClose, onSave }: CronJobModalProps) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: job?.name || '',
    description: job?.description || '',
    webhook_path: job?.webhook_path || '',
    cron_expression: job?.cron_expression || '0 3 * * *',
    timezone: job?.timezone || 'Asia/Tokyo',
    category: job?.category || 'system',
    enabled: job?.enabled ?? false,
    notify_on_failure: job?.notify_on_failure ?? true,
    notify_on_success: job?.notify_on_success ?? false,
    retry_on_failure: job?.retry_on_failure ?? true,
    max_retries: job?.max_retries || 3,
    timeout_seconds: job?.timeout_seconds || 3600
  });

  const handleSave = async () => {
    if (!formData.name || !formData.cron_expression) {
      alert('名前とCron式は必須です');
      return;
    }
    
    setSaving(true);
    
    try {
      if (job) {
        // 更新
        const { error } = await supabase
          .from('cron_jobs')
          .update(formData)
          .eq('id', job.id);
        
        if (error) throw error;
      } else {
        // 新規作成
        const { error } = await supabase
          .from('cron_jobs')
          .insert(formData);
        
        if (error) throw error;
      }
      
      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to save cron job:', err);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-lg shadow-xl"
        style={{ background: 'var(--panel)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--panel-border)' }}>
          <h2 className="font-bold" style={{ color: 'var(--text)' }}>
            {job ? 'Cron Job編集' : '新規Cron Job作成'}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <XCircle size={20} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ 
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)'
              }}
              placeholder="リサーチAgent毎日実行"
            />
          </div>
          
          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
              説明
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ 
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)'
              }}
              placeholder="毎日3:00にeBay商品リサーチを実行"
            />
          </div>
          
          {/* Webhook Path */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
              Webhook Path <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.webhook_path}
              onChange={(e) => setFormData({ ...formData, webhook_path: e.target.value })}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ 
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)'
              }}
              placeholder="research-agent"
            />
          </div>
          
          {/* Cron式 */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
              Cron式 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.cron_expression}
                onChange={(e) => setFormData({ ...formData, cron_expression: e.target.value })}
                className="flex-1 px-3 py-2 rounded text-sm font-mono"
                style={{ 
                  background: 'var(--input-bg)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
                placeholder="0 3 * * *"
              />
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    setFormData({ ...formData, cron_expression: e.target.value });
                  }
                }}
                className="px-3 py-2 rounded text-sm"
                style={{ 
                  background: 'var(--input-bg)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              >
                <option value="">プリセット</option>
                {CRON_PRESETS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              {parseCronExpression(formData.cron_expression)}（分 時 日 月 曜日）
            </p>
          </div>
          
          {/* カテゴリ */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
              カテゴリ
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ 
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)'
              }}
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          {/* チェックボックス */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              <span className="text-sm" style={{ color: 'var(--text)' }}>有効</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.notify_on_failure}
                onChange={(e) => setFormData({ ...formData, notify_on_failure: e.target.checked })}
              />
              <span className="text-sm" style={{ color: 'var(--text)' }}>失敗時に通知</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.retry_on_failure}
                onChange={(e) => setFormData({ ...formData, retry_on_failure: e.target.checked })}
              />
              <span className="text-sm" style={{ color: 'var(--text)' }}>失敗時にリトライ（最大{formData.max_retries}回）</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: 'var(--panel-border)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm"
            style={{ 
              background: 'var(--highlight)',
              color: 'var(--text)',
              border: '1px solid var(--panel-border)'
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {job ? '更新' : '作成'}
          </button>
        </div>
      </div>
    </div>
  );
}
