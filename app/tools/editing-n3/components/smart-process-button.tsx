// app/tools/editing-n3/components/smart-process-button.tsx
/**
 * スマート一括処理ボタン（コンパクト版）
 * 
 * 選択された商品のフェーズを分析し、最適な処理を自動実行
 * 他のボタンとサイズ感を合わせた設計
 */
'use client';

import React, { memo, useMemo, useState } from 'react';
import type { Product } from '@/app/tools/editing/types/product';
import { 
  createSmartProcessPlan, 
  getPhaseSummary, 
  PHASE_INFO,
  type ProductPhase 
} from '@/lib/product/phase-status';
import { useSmartProcess } from '../hooks/use-smart-process';
import { 
  Zap, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface SmartProcessButtonProps {
  selectedProducts: Product[];
  onComplete?: () => void;
  onRefresh?: () => Promise<void>;
  disabled?: boolean;
}

// ============================================================
// メインコンポーネント（コンパクト版）
// ============================================================

export const SmartProcessButton = memo(function SmartProcessButton({
  selectedProducts,
  onComplete,
  onRefresh,
  disabled = false,
}: SmartProcessButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const smartProcess = useSmartProcess(onRefresh);
  const { isProcessing, progress, runSmartProcess, abort } = smartProcess;
  
  // 処理計画を生成
  const plan = useMemo(() => {
    if (selectedProducts.length === 0) return null;
    return createSmartProcessPlan(selectedProducts);
  }, [selectedProducts]);
  
  // フェーズサマリー
  const phaseSummary = useMemo(() => {
    if (selectedProducts.length === 0) return null;
    return getPhaseSummary(selectedProducts);
  }, [selectedProducts]);
  
  // 処理実行
  const handleRun = async () => {
    if (!plan || plan.autoProcessable === 0) return;
    
    setResult(null);
    const processResult = await runSmartProcess(selectedProducts);
    setResult(processResult);
    
    if (onComplete) {
      onComplete();
    }
  };
  
  // 処理中止
  const handleAbort = () => {
    abort();
  };
  
  // 選択なしの場合
  if (selectedProducts.length === 0) {
    return null;
  }
  
  // 処理不要の場合（全てREADY）
  if (plan && plan.autoProcessable === 0 && plan.manualRequired === 0) {
    return (
      <div 
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium"
        style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)' }}
        title="全商品の処理が完了しています"
      >
        <CheckCircle size={12} />
        <span>処理完了</span>
      </div>
    );
  }
  
  return (
    <div className="relative inline-flex items-center">
      {/* メインボタン */}
      {isProcessing ? (
        // 処理中
        <button
          onClick={handleAbort}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded text-[11px] font-medium
                     bg-red-500 text-white hover:bg-red-600 transition-colors"
          title="処理を中止"
        >
          <Pause size={12} />
          <span>中止</span>
        </button>
      ) : (
        // 待機中
        <button
          onClick={handleRun}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => !result && setIsExpanded(false)}
          disabled={disabled || !plan || plan.autoProcessable === 0}
          className={`
            inline-flex items-center gap-1.5 h-7 px-2.5 rounded
            text-[11px] font-medium transition-all duration-200
            ${disabled || !plan || plan.autoProcessable === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
            }
          `}
          title={`スマート処理: ${plan?.autoProcessable || 0}件を自動処理\n・翻訳待ち→翻訳API\n・SM検索待ち→SM分析\n・補完待ち→AI補完`}
        >
          <Zap size={12} />
          <span>スマート処理</span>
          {plan && plan.autoProcessable > 0 && (
            <span className="px-1 py-0.5 rounded bg-white/20 text-[10px]">
              {plan.autoProcessable}
            </span>
          )}
        </button>
      )}
      
      {/* 進捗表示 */}
      {isProcessing && progress && (
        <div className="absolute top-full left-0 mt-1 p-2 rounded-lg
                        bg-white border border-gray-200 shadow-lg z-50 whitespace-nowrap"
             style={{ minWidth: '200px' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Loader2 size={12} className="animate-spin text-blue-500" />
            <span className="text-xs font-medium" style={{ color: PHASE_INFO[progress.phase].color }}>
              {PHASE_INFO[progress.phase].emoji} {PHASE_INFO[progress.phase].label}
            </span>
          </div>
          
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress.percentage}%`,
                backgroundColor: PHASE_INFO[progress.phase].color,
              }}
            />
          </div>
          
          <div className="text-[10px] text-gray-500">
            {progress.current} / {progress.total} 件
          </div>
        </div>
      )}
      
      {/* ホバー時の詳細パネル */}
      {isExpanded && !isProcessing && plan && (
        <div className="absolute top-full left-0 mt-1 p-2 rounded-lg
                        bg-white border border-gray-200 shadow-lg z-50"
             style={{ minWidth: '220px' }}
             onMouseEnter={() => setIsExpanded(true)}
             onMouseLeave={() => !result && setIsExpanded(false)}>
          <div className="text-[10px] font-medium text-gray-500 mb-1.5">処理プレビュー</div>
          
          {/* フェーズ別件数 */}
          {phaseSummary && (
            <div className="space-y-1 mb-2">
              {(Object.entries(phaseSummary) as [ProductPhase, number][])
                .filter(([_, count]) => count > 0)
                .map(([phase, count]) => {
                  const info = PHASE_INFO[phase];
                  return (
                    <div
                      key={phase}
                      className="flex items-center justify-between px-2 py-1 rounded text-[10px]"
                      style={{ backgroundColor: info.bgColor }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{info.emoji}</span>
                        <span style={{ color: info.color }}>{info.label}</span>
                      </div>
                      <span 
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-medium text-white"
                        style={{ backgroundColor: info.color }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
          
          {/* 手動確認が必要な件数 */}
          {plan.manualRequired > 0 && (
            <div className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded">
              💡 {plan.manualRequired}件は手動でSM選択が必要
            </div>
          )}
        </div>
      )}
      
      {/* 結果表示 */}
      {result && !isProcessing && (
        <div className={`absolute top-full left-0 mt-1 p-2 rounded-lg
                        border shadow-lg z-50 ${
                          result.success 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
             style={{ minWidth: '180px' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            {result.success ? (
              <CheckCircle size={12} className="text-green-500" />
            ) : (
              <XCircle size={12} className="text-yellow-500" />
            )}
            <span className="text-[11px] font-medium">
              完了 ({Math.round(result.duration / 1000)}秒)
            </span>
          </div>
          
          <div className="text-[10px] space-y-0.5">
            <div>✅ 成功: {result.processed}件</div>
            {result.failed > 0 && (
              <div className="text-red-600">❌ 失敗: {result.failed}件</div>
            )}
            {result.skipped > 0 && (
              <div className="text-blue-600">⏭️ スキップ: {result.skipped}件</div>
            )}
          </div>
          
          <button
            onClick={() => { setResult(null); setIsExpanded(false); }}
            className="mt-1.5 text-[9px] text-gray-500 hover:text-gray-700"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
});

// ============================================================
// 監査ボタン用コンパクト版
// ============================================================

interface SmartProcessCompactProps {
  selectedCount: number;
  autoProcessableCount: number;
  onRun: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const SmartProcessCompact = memo(function SmartProcessCompact({
  selectedCount,
  autoProcessableCount,
  onRun,
  isProcessing,
  disabled = false,
}: SmartProcessCompactProps) {
  if (selectedCount === 0) {
    return null;
  }
  
  return (
    <button
      onClick={onRun}
      disabled={disabled || isProcessing || autoProcessableCount === 0}
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded
        text-[11px] font-medium transition-all duration-200
        ${disabled || isProcessing || autoProcessableCount === 0
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-purple-500 text-white hover:bg-purple-600'
        }
      `}
      title="スマート処理を実行"
    >
      {isProcessing ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Zap size={12} />
      )}
      <span>スマート処理</span>
      {autoProcessableCount > 0 && (
        <span className="px-1 py-0.5 rounded bg-white/20 text-[10px]">
          {autoProcessableCount}
        </span>
      )}
    </button>
  );
});
