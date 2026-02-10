// components/n3/empire/base-hub-layout.tsx
/**
 * 🏰 BaseHubLayout - Hub統合UIの共通レイアウト
 * 
 * 全Hubで使用する統一レイアウト
 * - タブによるツール切り替え
 * - Dispatch API自動呼び出し
 * - Job状態管理
 * - Realtime購読対応
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Search, Package, Rocket, DollarSign, Film, Shield,
  Monitor, Settings, Cog, ChevronRight, Loader2, CheckCircle,
  XCircle, Clock, Play, Pause, RefreshCw
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

export interface HubTool {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
  requiresJob?: boolean;
  category?: string;
}

export interface BaseHubLayoutProps {
  title: string;
  titleEn?: string;
  description?: string;
  icon?: React.ReactNode;
  tools: HubTool[];
  defaultTool?: string;
  showJobMonitor?: boolean;
}

interface JobState {
  jobId: string;
  toolId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout';
  progress: number;
  result?: any;
  error?: string;
  createdAt: string;
}

// ============================================================
// Dispatch Hook
// ============================================================

export function useDispatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeJobs, setActiveJobs] = useState<JobState[]>([]);
  
  const execute = useCallback(async (
    toolId: string,
    action: string = 'execute',
    params: Record<string, any> = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, action, params }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Dispatch failed');
      }
      
      // Job IDがある場合はポーリング開始
      if (data.jobId) {
        const newJob: JobState = {
          jobId: data.jobId,
          toolId,
          status: 'pending',
          progress: 0,
          createdAt: new Date().toISOString(),
        };
        
        setActiveJobs(prev => [...prev, newJob]);
        pollJobStatus(data.jobId, data.pollInterval || 2);
        
        return { jobId: data.jobId, status: 'pending' };
      }
      
      // 即時結果
      return data.result;
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const pollJobStatus = useCallback(async (jobId: string, interval: number) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/dispatch/${jobId}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }
        
        setActiveJobs(prev => 
          prev.map(job => 
            job.jobId === jobId
              ? { ...job, status: data.status, progress: data.progress, result: data.result, error: data.error }
              : job
          )
        );
        
        // 完了/失敗/タイムアウトならポーリング停止
        if (['completed', 'failed', 'timeout'].includes(data.status)) {
          return;
        }
        
        // 継続ポーリング
        setTimeout(poll, interval * 1000);
        
      } catch (err) {
        console.error('[Dispatch Poll] Error:', err);
      }
    };
    
    poll();
  }, []);
  
  const cancelJob = useCallback(async (jobId: string) => {
    try {
      await fetch(`/api/dispatch/${jobId}`, { method: 'DELETE' });
      setActiveJobs(prev => prev.filter(job => job.jobId !== jobId));
    } catch (err) {
      console.error('[Dispatch Cancel] Error:', err);
    }
  }, []);
  
  const clearCompletedJobs = useCallback(() => {
    setActiveJobs(prev => prev.filter(job => !['completed', 'failed', 'timeout'].includes(job.status)));
  }, []);
  
  return {
    execute,
    loading,
    error,
    activeJobs,
    cancelJob,
    clearCompletedJobs,
  };
}

// ============================================================
// Job Monitor Component
// ============================================================

function JobMonitor({ jobs, onCancel, onClear }: {
  jobs: JobState[];
  onCancel: (jobId: string) => void;
  onClear: () => void;
}) {
  if (jobs.length === 0) return null;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'timeout': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };
  
  const completedCount = jobs.filter(j => ['completed', 'failed', 'timeout'].includes(j.status)).length;
  
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b border-[var(--panel-border)]">
        <span className="text-sm font-medium">実行中のジョブ ({jobs.length})</span>
        {completedCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            完了をクリア
          </button>
        )}
      </div>
      <div className="max-h-60 overflow-y-auto">
        {jobs.map(job => (
          <div key={job.jobId} className="p-2 border-b border-[var(--panel-border)] last:border-0">
            <div className="flex items-center gap-2">
              {getStatusIcon(job.status)}
              <span className="text-xs flex-1 truncate">{job.toolId}</span>
              {['pending', 'running'].includes(job.status) && (
                <button
                  onClick={() => onCancel(job.jobId)}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  キャンセル
                </button>
              )}
            </div>
            {job.status === 'running' && job.progress > 0 && (
              <div className="mt-1 h-1 bg-[var(--highlight)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] transition-all"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            )}
            {job.error && (
              <div className="mt-1 text-xs text-red-500 truncate">{job.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// BaseHubLayout Component
// ============================================================

export function BaseHubLayout({
  title,
  titleEn,
  description,
  icon,
  tools,
  defaultTool,
  showJobMonitor = true,
}: BaseHubLayoutProps) {
  const [activeToolId, setActiveToolId] = useState(defaultTool || tools[0]?.id);
  const { activeJobs, cancelJob, clearCompletedJobs } = useDispatch();
  
  const activeTool = tools.find(t => t.id === activeToolId) || tools[0];
  
  return (
    <div className="h-full flex flex-col bg-[var(--background)]" data-theme="dark">
      {/* ヘッダー */}
      <header className="flex-shrink-0 border-b border-[var(--panel-border)] bg-[var(--glass)]">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {icon && <div className="text-[var(--accent)]">{icon}</div>}
            <div>
              <h1 className="text-lg font-bold">{title}</h1>
              {titleEn && <span className="text-xs text-[var(--text-muted)]">{titleEn}</span>}
            </div>
          </div>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
        
        {/* ツールタブ */}
        <div className="flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${activeToolId === tool.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:bg-[var(--panel)] hover:text-[var(--text)]'
                }
              `}
            >
              {tool.icon && <span className="w-4 h-4">{tool.icon}</span>}
              {tool.name}
            </button>
          ))}
        </div>
      </header>
      
      {/* コンテンツエリア */}
      <main className="flex-1 overflow-auto p-4">
        {activeTool?.component}
      </main>
      
      {/* Job Monitor */}
      {showJobMonitor && (
        <JobMonitor
          jobs={activeJobs}
          onCancel={cancelJob}
          onClear={clearCompletedJobs}
        />
      )}
    </div>
  );
}

// ============================================================
// ToolExecutionPanel - ツール実行共通パネル
// ============================================================

interface ToolExecutionPanelProps {
  toolId: string;
  title: string;
  description?: string;
  fields: ToolField[];
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
}

interface ToolField {
  id: string;
  label: string;
  labelEn?: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'json' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  required?: boolean;
}

export function ToolExecutionPanel({
  toolId,
  title,
  description,
  fields,
  onSuccess,
  onError,
}: ToolExecutionPanelProps) {
  const { execute, loading, error } = useDispatch();
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach(f => {
      initial[f.id] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
    });
    return initial;
  });
  const [result, setResult] = useState<any>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    
    try {
      const res = await execute(toolId, 'execute', formData);
      setResult(res);
      onSuccess?.(res);
    } catch (err: any) {
      onError?.(err.message);
    }
  };
  
  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };
  
  return (
    <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-muted)] mb-4">{description}</p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(field => (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'text' && (
              <input
                type="text"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded text-sm"
              />
            )}
            
            {field.type === 'number' && (
              <input
                type="number"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, Number(e.target.value))}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded text-sm"
              />
            )}
            
            {field.type === 'select' && (
              <select
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded text-sm"
              >
                <option value="">選択してください</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            
            {field.type === 'checkbox' && (
              <input
                type="checkbox"
                checked={formData[field.id] || false}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                className="w-4 h-4"
              />
            )}
            
            {field.type === 'date' && (
              <input
                type="date"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded text-sm"
              />
            )}
            
            {field.type === 'textarea' && (
              <textarea
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded text-sm"
              />
            )}
            
            {field.type === 'json' && (
              <textarea
                value={typeof formData[field.id] === 'object' 
                  ? JSON.stringify(formData[field.id], null, 2) 
                  : formData[field.id] || ''
                }
                onChange={(e) => {
                  try {
                    handleChange(field.id, JSON.parse(e.target.value));
                  } catch {
                    handleChange(field.id, e.target.value);
                  }
                }}
                placeholder={field.placeholder || '{ "key": "value" }'}
                rows={4}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded text-sm font-mono"
              />
            )}
          </div>
        ))}
        
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                実行中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                実行
              </>
            )}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded">
          <div className="text-green-500 text-sm font-medium mb-2">実行完了</div>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default BaseHubLayout;
