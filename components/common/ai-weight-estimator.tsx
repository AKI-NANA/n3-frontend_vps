// components/common/ai-weight-estimator.tsx
/**
 * AI重量推定コンポーネント
 * 
 * Gemini APIを使用して商品の重量を推定し、
 * ユーザーに確認の上でDBに保存する
 */
'use client';

import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2, Check, AlertCircle, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ============================================================
// 型定義
// ============================================================

export interface WeightEstimationResult {
  weight: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  unit: string;
}

export interface AIWeightEstimatorProps {
  productId: number;
  productTitle: string;
  productDescription?: string;
  categoryName?: string;
  currentWeight?: number;
  onEstimationComplete?: (result: WeightEstimationResult) => void;
  onSaveComplete?: (productId: number, newWeight: number) => void;
  variant?: 'button' | 'inline' | 'compact';
  autoSave?: boolean;
  className?: string;
}

// 信頼度の色
const CONFIDENCE_COLORS = {
  high: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
  medium: { bg: '#fef9c3', text: '#ca8a04', border: '#fde047' },
  low: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
};

// ============================================================
// メインコンポーネント
// ============================================================

export const AIWeightEstimator: React.FC<AIWeightEstimatorProps> = ({
  productId,
  productTitle,
  productDescription,
  categoryName,
  currentWeight,
  onEstimationComplete,
  onSaveComplete,
  variant = 'button',
  autoSave = false,
  className,
}) => {
  const [isEstimating, setIsEstimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [estimation, setEstimation] = useState<WeightEstimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 重量推定実行
  const handleEstimate = useCallback(async () => {
    setIsEstimating(true);
    setError(null);
    setEstimation(null);

    try {
      const response = await fetch('/api/ai/weight-estimation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          title: productTitle,
          description: productDescription,
          categoryName,
          currentWeight,
          saveToDb: autoSave,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to estimate weight');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      setEstimation(data.estimation);
      onEstimationComplete?.(data.estimation);

      if (autoSave && data.saved) {
        onSaveComplete?.(productId, data.estimation.weight);
        toast.success(`重量を${data.estimation.weight}gに更新しました`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`重量推定エラー: ${errorMessage}`);
    } finally {
      setIsEstimating(false);
    }
  }, [productId, productTitle, productDescription, categoryName, currentWeight, autoSave, onEstimationComplete, onSaveComplete]);

  // 推定結果を保存
  const handleSave = useCallback(async () => {
    if (!estimation) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/ai/weight-estimation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          title: productTitle,
          description: productDescription,
          categoryName,
          currentWeight: estimation.weight,
          saveToDb: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save weight');
      }

      onSaveComplete?.(productId, estimation.weight);
      toast.success(`重量を${estimation.weight}gに保存しました`);
    } catch (err) {
      toast.error('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  }, [estimation, productId, productTitle, productDescription, categoryName, onSaveComplete]);

  // Compact表示（インラインボタンのみ）
  if (variant === 'compact') {
    return (
      <button
        onClick={handleEstimate}
        disabled={isEstimating}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors',
          'bg-purple-100 text-purple-700 hover:bg-purple-200',
          isEstimating && 'opacity-50 cursor-not-allowed',
          className
        )}
        title="AIで重量を推定"
      >
        {isEstimating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Sparkles className="w-3 h-3" />
        )}
        AI推定
      </button>
    );
  }

  // Inline表示（推定結果も表示）
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {/* 推定ボタン */}
        <button
          onClick={handleEstimate}
          disabled={isEstimating}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors',
            'bg-purple-100 text-purple-700 hover:bg-purple-200',
            isEstimating && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isEstimating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {isEstimating ? '推定中...' : 'AI推定'}
        </button>

        {/* 結果表示 */}
        {estimation && (
          <div 
            className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded-md"
            style={{
              background: CONFIDENCE_COLORS[estimation.confidence].bg,
              color: CONFIDENCE_COLORS[estimation.confidence].text,
              border: `1px solid ${CONFIDENCE_COLORS[estimation.confidence].border}`,
            }}
          >
            <Scale className="w-3 h-3" />
            <span className="font-bold">{estimation.weight}g</span>
            <span className="opacity-75">({estimation.confidence})</span>
            
            {!autoSave && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="ml-1 p-0.5 rounded hover:bg-white/50"
                title="この値を保存"
              >
                {isSaving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </span>
        )}
      </div>
    );
  }

  // Button表示（デフォルト、フルUIカード）
  return (
    <div className={cn('p-4 border border-gray-200 rounded-lg bg-white', className)}>
      {/* ヘッダー */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span className="font-semibold text-sm">AI重量推定</span>
      </div>

      {/* 現在の重量 */}
      {currentWeight !== undefined && (
        <div className="mb-3 text-xs text-gray-600">
          現在の重量: <span className="font-mono font-bold">{currentWeight}g</span>
          {currentWeight < 10 && (
            <span className="ml-2 text-orange-500">⚠️ 異常に軽い</span>
          )}
        </div>
      )}

      {/* 推定ボタン */}
      <button
        onClick={handleEstimate}
        disabled={isEstimating}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors',
          'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium',
          'hover:from-purple-600 hover:to-indigo-600',
          isEstimating && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isEstimating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            推定中...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            AIで重量を推定
          </>
        )}
      </button>

      {/* 推定結果 */}
      {estimation && (
        <div 
          className="mt-3 p-3 rounded-md"
          style={{
            background: CONFIDENCE_COLORS[estimation.confidence].bg,
            border: `1px solid ${CONFIDENCE_COLORS[estimation.confidence].border}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" style={{ color: CONFIDENCE_COLORS[estimation.confidence].text }} />
              <span 
                className="text-lg font-bold"
                style={{ color: CONFIDENCE_COLORS[estimation.confidence].text }}
              >
                {estimation.weight}g
              </span>
            </div>
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ 
                background: CONFIDENCE_COLORS[estimation.confidence].text,
                color: 'white',
              }}
            >
              {estimation.confidence === 'high' ? '高精度' : 
               estimation.confidence === 'medium' ? '中精度' : '低精度'}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 mb-3">
            💡 {estimation.reasoning}
          </p>

          {!autoSave && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md',
                'bg-white border border-gray-300 text-sm font-medium',
                'hover:bg-gray-50 transition-colors',
                isSaving && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Check className="w-3 h-3" />
                  この値を保存
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

// ============================================================
// 一括推定用コンポーネント
// ============================================================

export interface BulkWeightEstimatorProps {
  products: Array<{
    id: number;
    title: string;
    description?: string;
    categoryName?: string;
    currentWeight?: number;
  }>;
  onComplete?: (results: Map<number, WeightEstimationResult>) => void;
  className?: string;
}

export const BulkWeightEstimator: React.FC<BulkWeightEstimatorProps> = ({
  products,
  onComplete,
  className,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<Map<number, WeightEstimationResult>>(new Map());

  const handleBulkEstimate = useCallback(async () => {
    setIsRunning(true);
    setProgress({ current: 0, total: products.length });
    const newResults = new Map<number, WeightEstimationResult>();

    try {
      const response = await fetch('/api/ai/weight-estimation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: products.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            categoryName: p.categoryName,
            currentWeight: p.currentWeight,
          })),
          saveToDb: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Bulk estimation failed');
      }

      const data = await response.json();
      
      for (const result of data.results) {
        if (result.status === 'success') {
          newResults.set(result.productId, result.estimation);
        }
        setProgress(prev => ({ ...prev, current: prev.current + 1 }));
      }

      setResults(newResults);
      onComplete?.(newResults);
      
      toast.success(`${data.summary.success}件の重量を推定しました`);
      if (data.summary.failed > 0) {
        toast.warning(`${data.summary.failed}件の推定に失敗しました`);
      }

    } catch (err) {
      toast.error('一括推定に失敗しました');
    } finally {
      setIsRunning(false);
    }
  }, [products, onComplete]);

  return (
    <div className={cn('p-4 border border-gray-200 rounded-lg bg-white', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span className="font-semibold text-sm">一括AI重量推定</span>
        <span className="text-xs text-gray-500">({products.length}件)</span>
      </div>

      {isRunning && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>処理中...</span>
            <span>{progress.current}/{progress.total}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleBulkEstimate}
        disabled={isRunning || products.length === 0}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors',
          'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium',
          'hover:from-purple-600 hover:to-indigo-600',
          (isRunning || products.length === 0) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            推定中...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            一括推定を実行
          </>
        )}
      </button>

      {results.size > 0 && (
        <div className="mt-3 text-xs text-gray-600">
          ✓ {results.size}件の重量を推定・保存しました
        </div>
      )}
    </div>
  );
};

export default AIWeightEstimator;
