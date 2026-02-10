// app/tools/listing-hub/tools/error-recovery-tool.tsx
/**
 * ⚠️ Error Recovery Tool
 * 出品エラーの自動復旧
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, Loader2, Zap, Info } from 'lucide-react';
import { useDispatch, ToolExecutionPanel } from '@/components/n3/empire/base-hub-layout';

interface ErrorItem {
  id: string;
  productId: number;
  productTitle: string;
  marketplace: string;
  errorType: string;
  errorMessage: string;
  occurredAt: string;
  retryCount: number;
  canAutoFix: boolean;
  suggestedFix?: string;
}

export function ErrorRecoveryTool() {
  const { execute, loading, activeJobs } = useDispatch();
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
  const [autoFixMode, setAutoFixMode] = useState(false);
  
  // エラー取得（モック）
  useEffect(() => {
    setErrors([
      {
        id: 'e1',
        productId: 1,
        productTitle: 'ポケモンカード 25周年記念セット',
        marketplace: 'eBay US',
        errorType: 'CATEGORY_NOT_FOUND',
        errorMessage: 'Category ID 123456 not found',
        occurredAt: '2026-01-26T14:30:00',
        retryCount: 2,
        canAutoFix: true,
        suggestedFix: 'AI自動カテゴリマッピングで修正可能',
      },
      {
        id: 'e2',
        productId: 2,
        productTitle: 'ドラゴンボール 一番くじ フィギュア',
        marketplace: 'Amazon US',
        errorType: 'IMAGE_VALIDATION_FAILED',
        errorMessage: 'Image does not meet requirements',
        occurredAt: '2026-01-26T13:00:00',
        retryCount: 1,
        canAutoFix: true,
        suggestedFix: '画像リサイズで修正可能',
      },
      {
        id: 'e3',
        productId: 3,
        productTitle: '鬼滅の刃 炭治郎 フィギュア',
        marketplace: 'Qoo10',
        errorType: 'API_RATE_LIMIT',
        errorMessage: 'Rate limit exceeded',
        occurredAt: '2026-01-26T12:00:00',
        retryCount: 3,
        canAutoFix: true,
        suggestedFix: '再試行で解決可能',
      },
      {
        id: 'e4',
        productId: 4,
        productTitle: 'ワンピース ルフィ ギア5',
        marketplace: 'Shopify',
        errorType: 'VERO_VIOLATION',
        errorMessage: 'Potential trademark violation detected',
        occurredAt: '2026-01-26T11:00:00',
        retryCount: 0,
        canAutoFix: false,
        suggestedFix: '手動確認が必要',
      },
    ]);
  }, []);
  
  const toggleError = (errorId: string) => {
    setSelectedErrors(prev =>
      prev.includes(errorId)
        ? prev.filter(id => id !== errorId)
        : [...prev, errorId]
    );
  };
  
  const handleAutoFix = async () => {
    const fixableErrors = selectedErrors.filter(id => 
      errors.find(e => e.id === id)?.canAutoFix
    );
    
    if (fixableErrors.length === 0) {
      alert('自動修正可能なエラーを選択してください');
      return;
    }
    
    try {
      await execute('listing-error-recovery', 'execute', {
        errorIds: fixableErrors,
        mode: 'auto_fix',
      });
      
      alert('自動修正を開始しました');
      setSelectedErrors([]);
    } catch (err) {
      console.error('Auto fix error:', err);
    }
  };
  
  const handleRetry = async (errorId: string) => {
    try {
      await execute('listing-error-recovery', 'execute', {
        errorIds: [errorId],
        mode: 'retry',
      });
    } catch (err) {
      console.error('Retry error:', err);
    }
  };
  
  const handleBatchAutoFix = async () => {
    const fixableErrors = errors.filter(e => e.canAutoFix).map(e => e.id);
    
    if (fixableErrors.length === 0) {
      alert('自動修正可能なエラーがありません');
      return;
    }
    
    try {
      await execute('listing-error-recovery', 'execute', {
        errorIds: fixableErrors,
        mode: 'auto_fix_all',
      });
      
      alert('一括自動修正を開始しました');
    } catch (err) {
      console.error('Batch auto fix error:', err);
    }
  };
  
  const getErrorTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      CATEGORY_NOT_FOUND: 'bg-yellow-500/20 text-yellow-500',
      IMAGE_VALIDATION_FAILED: 'bg-orange-500/20 text-orange-500',
      API_RATE_LIMIT: 'bg-blue-500/20 text-blue-500',
      VERO_VIOLATION: 'bg-red-500/20 text-red-500',
    };
    return styles[type] || 'bg-gray-500/20 text-gray-500';
  };
  
  const autoFixableCount = errors.filter(e => e.canAutoFix).length;
  
  return (
    <div className="space-y-6">
      {/* 統計 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{errors.length}</div>
          <div className="text-xs text-[var(--text-muted)]">未解決エラー</div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{autoFixableCount}</div>
          <div className="text-xs text-[var(--text-muted)]">自動修正可能</div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">{errors.length - autoFixableCount}</div>
          <div className="text-xs text-[var(--text-muted)]">要手動確認</div>
        </div>
      </div>
      
      {/* 一括処理 */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBatchAutoFix}
          disabled={loading || autoFixableCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          全て自動修正 ({autoFixableCount}件)
        </button>
        
        {selectedErrors.length > 0 && (
          <button
            onClick={handleAutoFix}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--highlight)] rounded font-medium hover:bg-[var(--panel-border)]"
          >
            選択を修正 ({selectedErrors.length}件)
          </button>
        )}
      </div>
      
      {/* エラーリスト */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            出品エラー一覧
          </h3>
        </div>
        
        {errors.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)]">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <div>エラーはありません</div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--panel-border)]">
            {errors.map(error => (
              <div
                key={error.id}
                className={`
                  p-4 transition-colors
                  ${selectedErrors.includes(error.id) ? 'bg-[var(--accent)]/10' : 'hover:bg-[var(--highlight)]'}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* チェックボックス */}
                  {error.canAutoFix && (
                    <div
                      onClick={() => toggleError(error.id)}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer flex-shrink-0 mt-1
                        ${selectedErrors.includes(error.id)
                          ? 'bg-[var(--accent)] border-[var(--accent)]'
                          : 'border-[var(--panel-border)]'
                        }
                      `}
                    >
                      {selectedErrors.includes(error.id) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}
                  
                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getErrorTypeBadge(error.errorType)}`}>
                        {error.errorType}
                      </span>
                      {error.canAutoFix ? (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded text-xs">
                          自動修正可
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-500 rounded text-xs">
                          手動確認要
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-sm">{error.productTitle}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      {error.marketplace} • {new Date(error.occurredAt).toLocaleString('ja-JP')} • 再試行: {error.retryCount}回
                    </div>
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-500">
                      {error.errorMessage}
                    </div>
                    {error.suggestedFix && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-blue-500">
                        <Info className="w-3 h-3" />
                        {error.suggestedFix}
                      </div>
                    )}
                  </div>
                  
                  {/* アクション */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRetry(error.id)}
                      disabled={loading}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[var(--highlight)] rounded text-xs hover:bg-[var(--panel-border)]"
                    >
                      <RefreshCw className="w-3 h-3" />
                      再試行
                    </button>
                    {error.canAutoFix && (
                      <button
                        onClick={() => {
                          setSelectedErrors([error.id]);
                          handleAutoFix();
                        }}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[var(--accent)] text-white rounded text-xs hover:opacity-90"
                      >
                        <Zap className="w-3 h-3" />
                        自動修正
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorRecoveryTool;
