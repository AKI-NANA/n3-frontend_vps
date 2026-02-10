// app/tools/hitl-dashboard/page.tsx
/**
 * N3 Empire OS V8 - HitL (Human-in-the-Loop) Dashboard
 * 
 * 機能:
 * 1. 承認待ちリクエスト一覧
 * 2. ワンクリック承認/拒否
 * 3. AIの判断理由表示
 * 4. 履歴表示
 * 5. リアルタイム更新
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, CheckCircle, XCircle, AlertCircle, Clock, Loader2,
  ThumbsUp, ThumbsDown, Eye, RefreshCw, Bell, ChevronDown, 
  ChevronRight, ExternalLink, Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { N3CollapsibleHeader, N3Footer } from '@/components/n3';
import { createClient } from '@/lib/supabase/client';

interface HitLRequest {
  id: string;
  request_code: string;
  agent_name: string;
  workflow_id: string | null;
  execution_id: string | null;
  confidence_score: number | null;
  input_data: any;
  ai_reasoning: string | null;
  recommended_action: string | null;
  status: string;
  priority: string;
  created_at: string;
  expires_at: string;
  decided_at: string | null;
  decided_by: string | null;
  decision_reason: string | null;
  callback_url: string | null;
  callback_triggered: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high: '#f59e0b',
  normal: '#3b82f6',
  low: '#6b7280'
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  approved: '#22c55e',
  rejected: '#ef4444',
  expired: '#6b7280',
  auto_approved: '#14b8a6'
};

export default function HitLDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HitLRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  
  const supabase = createClient();

  // データ取得
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('hitl_requests')
        .select('*')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (filter === 'pending') {
        query = query.eq('status', 'pending');
      }
      
      const { data, error } = await query.limit(100);
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Failed to fetch HitL requests:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase, filter]);

  useEffect(() => {
    fetchRequests();
    
    // リアルタイム更新
    const channel = supabase
      .channel('hitl_requests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hitl_requests'
      }, () => {
        fetchRequests();
      })
      .subscribe();
    
    return () => { channel.unsubscribe(); };
  }, [fetchRequests, supabase]);

  // 承認処理
  const handleDecision = useCallback(async (
    request: HitLRequest,
    decision: 'approved' | 'rejected',
    reason?: string
  ) => {
    setProcessing(request.id);
    
    try {
      const response = await fetch(`/api/hitl/${decision === 'approved' ? 'approve' : 'reject'}/${request.request_code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decided_by: user?.email || 'dashboard',
          reason
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setRequests(prev => prev.map(r => 
          r.id === request.id 
            ? { ...r, status: decision, decided_at: new Date().toISOString(), decided_by: user?.email || 'dashboard' }
            : r
        ));
        
        // コールバック実行後に通知
        if (result.callback_triggered) {
          console.log('Callback triggered for', request.request_code);
        }
      } else {
        alert(`エラー: ${result.error}`);
      }
    } catch (err) {
      console.error('Decision failed:', err);
      alert('処理に失敗しました');
    } finally {
      setProcessing(null);
    }
  }, [user]);

  // 統計
  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    expired: requests.filter(r => r.status === 'expired').length,
    urgent: requests.filter(r => r.status === 'pending' && r.priority === 'urgent').length
  };

  // 残り時間計算
  const getTimeRemaining = (expiresAt: string) => {
    const remaining = new Date(expiresAt).getTime() - Date.now();
    if (remaining <= 0) return '期限切れ';
    const minutes = Math.floor(remaining / 60000);
    if (minutes < 60) return `${minutes}分`;
    return `${Math.floor(minutes / 60)}時間${minutes % 60}分`;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div id="main-scroll-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
        
        <N3CollapsibleHeader scrollContainerId="main-scroll-container" threshold={10}>
          <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)' }}>
            <div className="flex items-center gap-3">
              <Shield size={24} style={{ color: '#14b8a6' }} />
              <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>🛡️ HitL Dashboard</h1>
              <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#14b8a6', color: 'white' }}>Human-in-the-Loop</span>
              
              {stats.urgent > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs animate-pulse" style={{ background: '#ef4444', color: 'white' }}>
                  <Bell size={12} />
                  緊急: {stats.urgent}件
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'pending' | 'all')}
                className="px-3 py-1.5 rounded text-sm"
                style={{ background: 'var(--highlight)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
              >
                <option value="pending">承認待ちのみ</option>
                <option value="all">全て表示</option>
              </select>
              
              <button onClick={fetchRequests} className="flex items-center gap-1 px-3 py-1.5 rounded text-sm" style={{ background: 'var(--highlight)', border: '1px solid var(--panel-border)' }}>
                <RefreshCw size={14} />
                更新
              </button>
            </div>
          </div>
          
          {/* 統計バー */}
          <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)', fontSize: 13 }}>
            <span style={{ color: '#f59e0b' }}>承認待ち: <strong>{stats.pending}</strong></span>
            <span style={{ color: '#22c55e' }}>承認済: <strong>{stats.approved}</strong></span>
            <span style={{ color: '#ef4444' }}>拒否: <strong>{stats.rejected}</strong></span>
            <span style={{ color: '#6b7280' }}>期限切れ: <strong>{stats.expired}</strong></span>
          </div>
        </N3CollapsibleHeader>

        {/* メインコンテンツ */}
        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
              <Shield size={48} className="mx-auto mb-4 opacity-30" />
              <p>{filter === 'pending' ? '承認待ちのリクエストはありません' : 'リクエストがありません'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map(request => (
                <div
                  key={request.id}
                  className="rounded-lg overflow-hidden"
                  style={{ 
                    background: 'var(--panel)',
                    border: `2px solid ${request.status === 'pending' ? PRIORITY_COLORS[request.priority] : 'var(--panel-border)'}`,
                    opacity: request.status === 'pending' ? 1 : 0.7
                  }}
                >
                  {/* ヘッダー行 */}
                  <div 
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                  >
                    {expandedRequest === request.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    
                    {/* 優先度バッジ */}
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: PRIORITY_COLORS[request.priority], color: 'white' }}
                    >
                      {request.priority}
                    </span>
                    
                    {/* ステータスバッジ */}
                    <span 
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: `${STATUS_COLORS[request.status]}20`, color: STATUS_COLORS[request.status] }}
                    >
                      {request.status}
                    </span>
                    
                    {/* Agent名 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium" style={{ color: 'var(--text)' }}>{request.agent_name}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        コード: {request.request_code}
                        {request.confidence_score !== null && ` • 確信度: ${request.confidence_score}%`}
                      </p>
                    </div>
                    
                    {/* 残り時間 */}
                    {request.status === 'pending' && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={12} />
                        {getTimeRemaining(request.expires_at)}
                      </span>
                    )}
                    
                    {/* アクションボタン（pendingのみ） */}
                    {request.status === 'pending' && (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDecision(request, 'approved')}
                          disabled={processing === request.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium"
                          style={{ background: '#22c55e', color: 'white' }}
                        >
                          {processing === request.id ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
                          承認
                        </button>
                        <button
                          onClick={() => handleDecision(request, 'rejected')}
                          disabled={processing === request.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium"
                          style={{ background: '#ef4444', color: 'white' }}
                        >
                          {processing === request.id ? <Loader2 size={14} className="animate-spin" /> : <ThumbsDown size={14} />}
                          拒否
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* 詳細パネル */}
                  {expandedRequest === request.id && (
                    <div className="p-4 border-t" style={{ background: 'var(--highlight)', borderColor: 'var(--panel-border)' }}>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Workflow ID</p>
                          <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--panel)' }}>
                            {request.workflow_id || '-'}
                          </code>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>作成日時</p>
                          <span>{new Date(request.created_at).toLocaleString('ja-JP')}</span>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>有効期限</p>
                          <span>{new Date(request.expires_at).toLocaleString('ja-JP')}</span>
                        </div>
                        {request.decided_at && (
                          <div>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>決定日時</p>
                            <span>{new Date(request.decided_at).toLocaleString('ja-JP')}</span>
                            {request.decided_by && <span className="ml-2">by {request.decided_by}</span>}
                          </div>
                        )}
                      </div>
                      
                      {/* AIの判断理由 */}
                      {request.ai_reasoning && (
                        <div className="mt-4">
                          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text)' }}>🤖 AIの判断理由</p>
                          <div className="p-3 rounded text-sm" style={{ background: 'var(--panel)' }}>
                            {request.ai_reasoning}
                          </div>
                        </div>
                      )}
                      
                      {/* 入力データ */}
                      {request.input_data && (
                        <div className="mt-4">
                          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text)' }}>📦 入力データ</p>
                          <pre className="p-3 rounded text-xs overflow-auto max-h-48" style={{ background: 'var(--panel)' }}>
                            {JSON.stringify(request.input_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {/* 推奨アクション */}
                      {request.recommended_action && (
                        <div className="mt-4">
                          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text)' }}>💡 推奨アクション</p>
                          <span className="px-2 py-1 rounded text-sm" style={{ 
                            background: request.recommended_action === 'approve' ? '#dcfce7' : 
                                       request.recommended_action === 'reject' ? '#fee2e2' : '#fef3c7',
                            color: request.recommended_action === 'approve' ? '#166534' : 
                                   request.recommended_action === 'reject' ? '#991b1b' : '#92400e'
                          }}>
                            {request.recommended_action}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <N3Footer copyright="© 2025 N3 Empire" version="v8.0.0" status={{ label: 'HitL', connected: true }} />
      </div>
    </div>
  );
}
