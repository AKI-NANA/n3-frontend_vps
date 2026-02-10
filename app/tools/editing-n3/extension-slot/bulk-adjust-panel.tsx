// app/tools/editing-n3/extension-slot/bulk-adjust-panel.tsx
/**
 * 📦 Bulk Adjust Panel
 * 
 * 一括数量補正パネル
 * - SKU/商品ID配列入力
 * - 一括数量変更
 * - 一括原価変更
 * 
 * 接続: UI → Dispatch API → n8n
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Package, Play, Loader2, CheckCircle, AlertCircle, Upload, Plus, Minus, DollarSign } from 'lucide-react';

// ============================================================
// 型定義（独立state）
// ============================================================

type AdjustMode = 'set' | 'add' | 'subtract';
type AdjustTarget = 'quantity' | 'cost';

interface AdjustJob {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  processedCount: number;
  totalCount: number;
}

// ============================================================
// Bulk Adjust Panel Component
// ============================================================

export function BulkAdjustPanel() {
  // 独立state
  const [inputText, setInputText] = useState('');
  const [adjustTarget, setAdjustTarget] = useState<AdjustTarget>('quantity');
  const [adjustMode, setAdjustMode] = useState<AdjustMode>('set');
  const [adjustValue, setAdjustValue] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentJob, setCurrentJob] = useState<AdjustJob | null>(null);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // SKU/ID解析
  const parsedItems = useMemo(() => {
    return inputText
      .split(/[\n,\s]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }, [inputText]);
  
  // 一括補正実行
  const executeAdjust = useCallback(async () => {
    if (parsedItems.length === 0 || adjustValue === 0) return;
    
    setIsExecuting(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'inventory-bulk-adjust',
          action: 'execute',
          params: {
            skuList: parsedItems,
            target: adjustTarget,
            mode: adjustMode,
            value: adjustValue,
          },
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Adjust failed');
      }
      
      if (data.jobId) {
        setCurrentJob({
          jobId: data.jobId,
          status: 'pending',
          progress: 0,
          processedCount: 0,
          totalCount: parsedItems.length,
        });
        
        const poll = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/dispatch/${data.jobId}`);
            const status = await statusRes.json();
            
            setCurrentJob(prev => ({
              ...prev!,
              status: status.status,
              progress: status.progress || 0,
              processedCount: status.result?.processed || 0,
            }));
            
            if (status.status === 'completed' || status.status === 'failed') {
              clearInterval(poll);
              if (status.status === 'completed') {
                setResult({
                  success: status.result?.success || 0,
                  failed: status.result?.failed || 0,
                  errors: status.result?.errors || [],
                });
              } else {
                setError(status.error || 'Failed');
              }
              setCurrentJob(null);
              setIsExecuting(false);
            }
          } catch (err) {
            clearInterval(poll);
            setError('Polling error');
            setIsExecuting(false);
          }
        }, 2000);
        
        setTimeout(() => clearInterval(poll), 600000);
      } else {
        setResult({
          success: data.result?.success || parsedItems.length,
          failed: data.result?.failed || 0,
          errors: data.result?.errors || [],
        });
        setIsExecuting(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsExecuting(false);
    }
  }, [parsedItems, adjustTarget, adjustMode, adjustValue]);
  
  // ファイルアップロード
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(prev => prev + (prev ? '\n' : '') + text);
    };
    reader.readAsText(file);
  }, []);
  
  const getModeLabel = (mode: AdjustMode) => {
    switch (mode) {
      case 'set': return '設定';
      case 'add': return '加算';
      case 'subtract': return '減算';
    }
  };
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: 8, 
          background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Package size={18} style={{ color: 'white' }} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Bulk Adjust</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            一括数量補正（Dispatch API経由）
          </p>
        </div>
      </div>
      
      {/* 設定フォーム */}
      <div style={{ 
        padding: 16, background: 'var(--highlight)', borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        {/* 補正対象 */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            補正対象
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setAdjustTarget('quantity')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 12px', fontSize: 12, fontWeight: 500,
                background: adjustTarget === 'quantity' ? 'rgba(59, 130, 246, 0.15)' : 'var(--panel)',
                color: adjustTarget === 'quantity' ? 'rgb(59, 130, 246)' : 'var(--text-muted)',
                border: adjustTarget === 'quantity' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--panel-border)',
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              <Package size={14} />
              在庫数
            </button>
            <button
              onClick={() => setAdjustTarget('cost')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 12px', fontSize: 12, fontWeight: 500,
                background: adjustTarget === 'cost' ? 'rgba(34, 197, 94, 0.15)' : 'var(--panel)',
                color: adjustTarget === 'cost' ? 'rgb(34, 197, 94)' : 'var(--text-muted)',
                border: adjustTarget === 'cost' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--panel-border)',
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              <DollarSign size={14} />
              原価
            </button>
          </div>
        </div>
        
        {/* 補正モード */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            補正モード
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['set', 'add', 'subtract'] as AdjustMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setAdjustMode(mode)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  padding: '8px 10px', fontSize: 11, fontWeight: 500,
                  background: adjustMode === mode ? 'var(--accent)' : 'var(--panel)',
                  color: adjustMode === mode ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
                }}
              >
                {mode === 'set' ? '=' : mode === 'add' ? <Plus size={12} /> : <Minus size={12} />}
                {getModeLabel(mode)}
              </button>
            ))}
          </div>
        </div>
        
        {/* 補正値 */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            {adjustTarget === 'quantity' ? '数量' : '金額（円）'}
          </label>
          <input
            type="number"
            value={adjustValue}
            onChange={(e) => setAdjustValue(parseInt(e.target.value) || 0)}
            min={0}
            style={{
              width: '100%', height: 40, padding: '0 12px', fontSize: 14, fontWeight: 600,
              background: 'var(--bg)', border: '1px solid var(--panel-border)',
              borderRadius: 6, color: 'var(--text)', outline: 'none', textAlign: 'center',
            }}
          />
        </div>
        
        {/* SKU/ID入力 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              SKU / 商品ID（改行区切り）
            </label>
            <label style={{ 
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 8px', fontSize: 10, fontWeight: 500,
              background: 'var(--panel)', color: 'var(--accent)',
              borderRadius: 4, cursor: 'pointer',
            }}>
              <Upload size={10} />
              CSVアップロード
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="SKUまたは商品IDを入力&#10;&#10;例:&#10;JP-001&#10;JP-002&#10;12345"
            style={{
              width: '100%', height: 120, padding: 10, fontSize: 12,
              fontFamily: 'var(--font-mono)', background: 'var(--bg)',
              border: '1px solid var(--panel-border)', borderRadius: 6,
              color: 'var(--text)', resize: 'none', outline: 'none',
            }}
          />
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
            {parsedItems.length > 0 ? (
              <span style={{ color: 'var(--accent)' }}>{parsedItems.length}件検出</span>
            ) : 'SKU/IDを入力してください'}
          </div>
        </div>
        
        {/* プレビュー */}
        <div style={{ 
          padding: 10, background: 'var(--panel)', borderRadius: 6, marginBottom: 12,
          fontSize: 11, color: 'var(--text-muted)',
        }}>
          <span style={{ fontWeight: 600 }}>プレビュー:</span>{' '}
          {parsedItems.length}件の{adjustTarget === 'quantity' ? '在庫数' : '原価'}を{' '}
          {adjustMode === 'set' 
            ? `${adjustValue}${adjustTarget === 'cost' ? '円' : '個'}に設定` 
            : adjustMode === 'add' 
              ? `${adjustValue}${adjustTarget === 'cost' ? '円' : '個'}加算` 
              : `${adjustValue}${adjustTarget === 'cost' ? '円' : '個'}減算`}
        </div>
        
        {/* 実行ボタン */}
        <button
          onClick={executeAdjust}
          disabled={parsedItems.length === 0 || adjustValue === 0 || isExecuting}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 16px', fontSize: 13, fontWeight: 600,
            background: isExecuting || parsedItems.length === 0 ? 'var(--panel)' : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            color: isExecuting || parsedItems.length === 0 ? 'var(--text-muted)' : 'white',
            border: 'none', borderRadius: 6, cursor: isExecuting || parsedItems.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {isExecuting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              補正中... {currentJob?.progress || 0}%
            </>
          ) : (
            <>
              <Play size={16} />
              {parsedItems.length}件を一括補正
            </>
          )}
        </button>
      </div>
      
      {/* 進行状況 */}
      {currentJob && (
        <div style={{
          padding: 12, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 8,
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgb(139, 92, 246)' }}>
              補正処理中
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {currentJob.processedCount}/{currentJob.totalCount}
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--panel-border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ 
              width: `${currentJob.progress}%`, height: '100%', 
              background: 'rgb(139, 92, 246)', transition: 'width 0.3s',
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
          padding: 16, background: 'var(--panel)', borderRadius: 8,
          border: `1px solid ${result.failed > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            {result.failed === 0 ? (
              <CheckCircle size={20} style={{ color: 'var(--success)' }} />
            ) : (
              <AlertCircle size={20} style={{ color: 'var(--warning)' }} />
            )}
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              補正完了
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{result.success}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>成功</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--error)' }}>{result.failed}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>失敗</div>
            </div>
          </div>
          
          {result.errors.length > 0 && (
            <div style={{ 
              marginTop: 12, padding: 8, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 4,
              maxHeight: 80, overflow: 'auto',
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--error)', marginBottom: 4 }}>
                エラー詳細:
              </div>
              {result.errors.slice(0, 5).map((err, i) => (
                <div key={i} style={{ fontSize: 10, color: 'var(--error)' }}>• {err}</div>
              ))}
              {result.errors.length > 5 && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  ...他{result.errors.length - 5}件
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
