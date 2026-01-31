// app/tools/listing-n3/extension-slot/auto-listing-panel.tsx
/**
 * 🤖 Auto Listing Panel
 * 
 * 自動出品パネル
 * - 商品ID指定出品
 * - プラットフォーム選択
 * - ワンクリック出品
 * 
 * 接続: UI → Dispatch API → n8n
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Rocket, Play, Loader2, CheckCircle, AlertCircle, ShoppingBag, Plus, Trash2 } from 'lucide-react';

// ============================================================
// 型定義（独立state）
// ============================================================

interface ListingJob {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  completedCount: number;
  totalCount: number;
  errors: string[];
}

type Platform = 'ebay' | 'amazon' | 'mercari' | 'qoo10';

// ============================================================
// Auto Listing Panel Component
// ============================================================

export function AutoListingPanel() {
  // 独立state（既存store/contextに依存しない）
  const [productIds, setProductIds] = useState<string>('');
  const [platform, setPlatform] = useState<Platform>('ebay');
  const [account, setAccount] = useState<string>('mjt');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentJob, setCurrentJob] = useState<ListingJob | null>(null);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const platforms: { id: Platform; label: string; color: string }[] = [
    { id: 'ebay', label: 'eBay', color: '#0064D2' },
    { id: 'amazon', label: 'Amazon', color: '#FF9900' },
    { id: 'mercari', label: 'Mercari', color: '#FF0211' },
    { id: 'qoo10', label: 'Qoo10', color: '#E91E63' },
  ];
  
  const accounts = [
    { id: 'mjt', label: 'MJT (メイン)' },
    { id: 'green', label: 'GREEN' },
    { id: 'mystical', label: 'Mystical Japan' },
  ];
  
  const parsedIds = productIds
    .split(/[\n,\s]+/)
    .map(id => id.trim())
    .filter(id => id.length > 0);
  
  // 出品実行
  const executeAutoListing = useCallback(async () => {
    if (parsedIds.length === 0) return;
    
    setIsExecuting(true);
    setError(null);
    setResult(null);
    
    try {
      // Dispatch API経由で実行
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'listing-auto',
          action: 'execute',
          params: {
            productIds: parsedIds,
            platform,
            account,
            options: {
              dryRun: false,
              skipValidation: false,
            },
          },
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Listing failed');
      }
      
      // Job IDがある場合はポーリング
      if (data.jobId) {
        setCurrentJob({
          jobId: data.jobId,
          status: 'pending',
          progress: 0,
          completedCount: 0,
          totalCount: parsedIds.length,
          errors: [],
        });
        
        // ポーリング
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/dispatch/${data.jobId}`);
            const status = await statusRes.json();
            
            setCurrentJob(prev => ({
              ...prev!,
              status: status.status,
              progress: status.progress || 0,
              completedCount: status.result?.completed || 0,
              errors: status.result?.errors || [],
            }));
            
            if (status.status === 'completed') {
              clearInterval(pollInterval);
              setResult({
                success: status.result?.completed || 0,
                failed: status.result?.failed || 0,
              });
              setCurrentJob(null);
              setIsExecuting(false);
            } else if (status.status === 'failed') {
              clearInterval(pollInterval);
              setError(status.error || 'Job failed');
              setCurrentJob(null);
              setIsExecuting(false);
            }
          } catch (err) {
            clearInterval(pollInterval);
            setError('Polling error');
            setIsExecuting(false);
          }
        }, 2000);
        
        // タイムアウト（10分）
        setTimeout(() => {
          clearInterval(pollInterval);
          if (isExecuting) {
            setError('Timeout');
            setIsExecuting(false);
          }
        }, 600000);
      } else {
        // 即時結果
        setResult({
          success: data.result?.completed || parsedIds.length,
          failed: data.result?.failed || 0,
        });
        setIsExecuting(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsExecuting(false);
    }
  }, [parsedIds, platform, account, isExecuting]);
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: 8, 
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Rocket size={18} style={{ color: 'white' }} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Auto Listing</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            自動出品（Dispatch API経由）
          </p>
        </div>
      </div>
      
      {/* 入力フォーム */}
      <div style={{ 
        padding: 16, background: 'var(--highlight)', borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        {/* プラットフォーム選択 */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            プラットフォーム
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                style={{
                  flex: 1, padding: '8px 12px', fontSize: 11, fontWeight: 500,
                  background: platform === p.id ? p.color : 'var(--panel)',
                  color: platform === p.id ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--panel-border)', borderRadius: 6,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* アカウント選択 */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            出品アカウント
          </label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            style={{
              width: '100%', height: 36, padding: '0 12px', fontSize: 12,
              background: 'var(--bg)', border: '1px solid var(--panel-border)',
              borderRadius: 6, color: 'var(--text)', outline: 'none',
            }}
          >
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        </div>
        
        {/* 商品ID入力 */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            商品ID（改行/カンマ区切り）
          </label>
          <textarea
            value={productIds}
            onChange={(e) => setProductIds(e.target.value)}
            placeholder="商品IDを入力&#10;例: 12345&#10;67890&#10;11111"
            style={{
              width: '100%', height: 100, padding: 10, fontSize: 12,
              fontFamily: 'var(--font-mono)', background: 'var(--bg)',
              border: '1px solid var(--panel-border)', borderRadius: 6,
              color: 'var(--text)', resize: 'none', outline: 'none',
            }}
          />
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
            {parsedIds.length > 0 ? (
              <span style={{ color: 'var(--accent)' }}>{parsedIds.length}件の商品ID</span>
            ) : '商品IDを入力してください'}
          </div>
        </div>
        
        {/* 実行ボタン */}
        <button
          onClick={executeAutoListing}
          disabled={parsedIds.length === 0 || isExecuting}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 16px', fontSize: 13, fontWeight: 600,
            background: isExecuting ? 'var(--panel)' : 'var(--accent)',
            color: isExecuting ? 'var(--text-muted)' : 'white',
            border: 'none', borderRadius: 6, cursor: isExecuting ? 'not-allowed' : 'pointer',
          }}
        >
          {isExecuting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              出品中... {currentJob?.progress || 0}%
            </>
          ) : (
            <>
              <Play size={16} />
              {parsedIds.length}件を出品
            </>
          )}
        </button>
      </div>
      
      {/* 進行状況 */}
      {currentJob && (
        <div style={{
          padding: 12, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8,
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgb(59, 130, 246)' }}>
              出品処理中
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {currentJob.completedCount}/{currentJob.totalCount}
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--panel-border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ 
              width: `${currentJob.progress}%`, height: '100%', 
              background: 'rgb(59, 130, 246)', transition: 'width 0.3s',
            }} />
          </div>
        </div>
      )}
      
      {/* エラー表示 */}
      {error && (
        <div style={{
          padding: 12, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8,
          border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertCircle size={16} style={{ color: 'rgb(239, 68, 68)' }} />
          <span style={{ fontSize: 12, color: 'rgb(239, 68, 68)' }}>{error}</span>
        </div>
      )}
      
      {/* 結果表示 */}
      {result && (
        <div style={{
          padding: 12, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 8,
          border: '1px solid rgba(34, 197, 94, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CheckCircle size={16} style={{ color: 'rgb(34, 197, 94)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgb(34, 197, 94)' }}>
              出品完了
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{result.success}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>成功</div>
            </div>
            {result.failed > 0 && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--error)' }}>{result.failed}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>失敗</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
