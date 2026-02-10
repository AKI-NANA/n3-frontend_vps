// app/tools/listing-n3/extension-slot/batch-execute-panel.tsx
/**
 * 📦 Batch Execute Panel
 * 
 * バッチ出品パネル
 * - CSV/改行ID一括入力
 * - 大量出品
 * - 進行状況監視
 * 
 * 接続: UI → Dispatch API → n8n
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Package, Play, Loader2, Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface BatchJob {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  total: number;
  completed: number;
  failed: number;
  errors: string[];
}

type Platform = 'ebay' | 'amazon' | 'mercari' | 'qoo10';

// ============================================================
// Batch Execute Panel Component
// ============================================================

export function BatchExecutePanel() {
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState<Platform>('ebay');
  const [account, setAccount] = useState('mjt');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<BatchJob | null>(null);
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  
  // ID解析
  const parsedIds = useMemo(() => {
    return inputText
      .split(/[\n,\s]+/)
      .map(id => id.trim())
      .filter(id => /^\d+$/.test(id));
  }, [inputText]);
  
  // バッチ実行
  const executeBatch = useCallback(async () => {
    if (parsedIds.length === 0) return;
    
    setIsExecuting(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'listing-batch',
          action: 'execute',
          params: {
            productIds: parsedIds,
            platform,
            account,
            options: {
              batchSize: 10,
              delayMs: 500,
            },
          },
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Batch listing failed');
      }
      
      if (data.jobId) {
        setCurrentBatch({
          jobId: data.jobId,
          status: 'pending',
          progress: 0,
          total: parsedIds.length,
          completed: 0,
          failed: 0,
          errors: [],
        });
        
        // ポーリング
        const poll = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/dispatch/${data.jobId}`);
            const status = await statusRes.json();
            
            setCurrentBatch(prev => ({
              ...prev!,
              status: status.status,
              progress: status.progress || 0,
              completed: status.result?.completed || 0,
              failed: status.result?.failed || 0,
              errors: status.result?.errors || [],
            }));
            
            if (status.status === 'completed' || status.status === 'failed') {
              clearInterval(poll);
              setResult({
                success: status.result?.completed || 0,
                failed: status.result?.failed || 0,
                errors: status.result?.errors || [],
              });
              setCurrentBatch(null);
              setIsExecuting(false);
            }
          } catch (err) {
            clearInterval(poll);
            setIsExecuting(false);
          }
        }, 3000);
        
        setTimeout(() => clearInterval(poll), 1800000); // 30分タイムアウト
      } else {
        setResult({
          success: data.result?.completed || parsedIds.length,
          failed: data.result?.failed || 0,
          errors: data.result?.errors || [],
        });
        setIsExecuting(false);
      }
    } catch (err) {
      setResult({
        success: 0,
        failed: parsedIds.length,
        errors: [err instanceof Error ? err.message : 'Unknown error'],
      });
      setIsExecuting(false);
    }
  }, [parsedIds, platform, account]);
  
  // CSVダウンロード
  const downloadTemplate = useCallback(() => {
    const csv = 'product_id\n12345\n67890\n11111';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'listing_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, []);
  
  // ファイルアップロード
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(prev => prev + '\n' + text);
    };
    reader.readAsText(file);
  }, []);
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 8, 
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Package size={18} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Batch Execute</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
              大量一括出品
            </p>
          </div>
        </div>
        
        <button
          onClick={downloadTemplate}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 10px', fontSize: 11, fontWeight: 500,
            background: 'var(--panel)', color: 'var(--text-muted)',
            border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
          }}
        >
          <Download size={12} />
          テンプレート
        </button>
      </div>
      
      {/* 入力エリア */}
      <div style={{ 
        padding: 16, background: 'var(--highlight)', borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        {/* プラットフォーム & アカウント */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              プラットフォーム
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              style={{
                width: '100%', height: 36, padding: '0 12px', fontSize: 12,
                background: 'var(--bg)', border: '1px solid var(--panel-border)',
                borderRadius: 6, color: 'var(--text)', outline: 'none',
              }}
            >
              <option value="ebay">eBay</option>
              <option value="amazon">Amazon</option>
              <option value="mercari">Mercari</option>
              <option value="qoo10">Qoo10</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              アカウント
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
              <option value="mjt">MJT (メイン)</option>
              <option value="green">GREEN</option>
              <option value="mystical">Mystical Japan</option>
            </select>
          </div>
        </div>
        
        {/* ID入力 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              商品ID（CSV/改行区切り）
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
            placeholder="商品IDを入力（改行/カンマ区切り）&#10;&#10;例:&#10;12345&#10;67890&#10;11111, 22222, 33333"
            style={{
              width: '100%', height: 150, padding: 10, fontSize: 12,
              fontFamily: 'var(--font-mono)', background: 'var(--bg)',
              border: '1px solid var(--panel-border)', borderRadius: 6,
              color: 'var(--text)', resize: 'none', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {parsedIds.length > 0 ? (
                <span style={{ color: 'var(--accent)' }}>{parsedIds.length}件の商品ID検出</span>
              ) : 'IDを入力してください'}
            </span>
            {parsedIds.length > 100 && (
              <span style={{ fontSize: 10, color: 'var(--warning)' }}>
                ⚠️ 大量処理は時間がかかります
              </span>
            )}
          </div>
        </div>
        
        {/* 実行ボタン */}
        <button
          onClick={executeBatch}
          disabled={parsedIds.length === 0 || isExecuting}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 16px', fontSize: 13, fontWeight: 600,
            background: isExecuting ? 'var(--panel)' : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            color: isExecuting ? 'var(--text-muted)' : 'white',
            border: 'none', borderRadius: 6, cursor: isExecuting ? 'not-allowed' : 'pointer',
          }}
        >
          {isExecuting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              バッチ処理中... {currentBatch?.progress || 0}%
            </>
          ) : (
            <>
              <Play size={16} />
              {parsedIds.length}件をバッチ出品
            </>
          )}
        </button>
      </div>
      
      {/* 進行状況 */}
      {currentBatch && (
        <div style={{
          padding: 16, background: 'var(--panel)', borderRadius: 8,
          border: '1px solid var(--panel-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>バッチ処理中</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {currentBatch.completed + currentBatch.failed}/{currentBatch.total}
            </span>
          </div>
          
          <div style={{ height: 8, background: 'var(--panel-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ 
              width: `${currentBatch.progress}%`, height: '100%', 
              background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', 
              transition: 'width 0.3s',
            }} />
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>{currentBatch.completed}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>成功</div>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--error)' }}>{currentBatch.failed}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>失敗</div>
            </div>
          </div>
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
              バッチ処理完了
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: 24, marginBottom: result.errors.length > 0 ? 12 : 0 }}>
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
              padding: 8, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 4,
              maxHeight: 100, overflow: 'auto',
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
