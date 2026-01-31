// app/tools/editing-n3/components/pipeline/smart-pipeline-button.tsx
/**
 * 🚀 スマートパイプラインボタン v2.0
 * 
 * 半自動パイプライン実行：
 * - 翻訳 → SM分析 → AI補完を自動実行
 * - SM選択待ち（SELECT_SM）で自動停止 → SM選択モーダル自動表示
 * - AI推定データがある場合は承認待ちで停止
 * 
 * v2.0 新機能:
 * - Auto-Resume: SM選択完了後に次フェーズを自動実行
 * - SM選択モーダル統合
 * - 販売実績データ（Finding API）表示
 */

'use client';

import React, { memo, useMemo, useState, useCallback } from 'react';
import type { Product } from '../types/product';
import { 
  getProductPhase,
  createSmartProcessPlan, 
  getPhaseSummary, 
  PHASE_INFO,
  type ProductPhase 
} from '@/lib/product/phase-status';
import { 
  Zap, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertTriangle,
  Users,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { SmSelectionModal } from './sm';
import { toast } from 'sonner';

// ============================================================
// 型定義
// ============================================================

interface SmartPipelineButtonProps {
  selectedProducts: Product[];
  onComplete?: () => void;
  onRefresh?: () => Promise<void>;
  disabled?: boolean;
  /** 外部からSM選択モーダルを開く（互換性のため維持） */
  onOpenSMSelection?: (products: Product[]) => void;
}

interface PipelineResult {
  success: boolean;
  processed: number;
  smSelectionRequired: number;
  approvalRequired: number;
  failed: number;
  skipped: number;
  errors: string[];
  duration: number;
  /** SM選択待ちの商品リスト */
  smPendingProducts?: Product[];
}

// ============================================================
// パイプライン実行フック（Auto-Resume対応）
// ============================================================

function usePipeline(onRefresh?: () => Promise<void>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  const runPipeline = useCallback(async (products: Product[]): Promise<PipelineResult> => {
    const startTime = Date.now();
    setIsProcessing(true);
    
    const result: PipelineResult = {
      success: true,
      processed: 0,
      smSelectionRequired: 0,
      approvalRequired: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      duration: 0,
      smPendingProducts: [],
    };
    
    try {
      console.log('========================================');
      console.log('🚀 [Pipeline] パイプライン開始');
      console.log(`📦 対象商品: ${products.length}件`);
      
      // フェーズ別に商品を分類
      const phaseGroups = {
        translate: [] as Product[],
        scout: [] as Product[],
        selectSM: [] as Product[],
        enrich: [] as Product[],
        ready: [] as Product[],
        other: [] as Product[],
      };
      
      for (const product of products) {
        const { phase } = getProductPhase(product);
        console.log(`  - ${(product as any).sku || product.id}: フェーズ=${phase}`);
        
        switch (phase) {
          case 'TRANSLATE':
          case 'NO_TITLE':
            phaseGroups.translate.push(product);
            break;
          case 'SCOUT':
            phaseGroups.scout.push(product);
            break;
          case 'SELECT_SM':
          case 'FETCH_DETAILS':
            phaseGroups.selectSM.push(product);
            break;
          case 'ENRICH':
            phaseGroups.enrich.push(product);
            break;
          case 'READY':
          case 'APPROVAL_PENDING':
          case 'LISTED':
            phaseGroups.ready.push(product);
            break;
          default:
            phaseGroups.other.push(product);
            result.skipped++;
        }
      }
      
      console.log('📊 フェーズ別分類:');
      console.log(`   翻訳待ち: ${phaseGroups.translate.length}件`);
      console.log(`   SM検索待ち: ${phaseGroups.scout.length}件`);
      console.log(`   SM選択待ち: ${phaseGroups.selectSM.length}件`);
      console.log(`   補完待ち: ${phaseGroups.enrich.length}件`);
      console.log(`   完了済み: ${phaseGroups.ready.length}件`);
      console.log(`   その他: ${phaseGroups.other.length}件`);
      
      const totalSteps = 
        (phaseGroups.translate.length > 0 ? 1 : 0) +
        (phaseGroups.scout.length > 0 ? 1 : 0) +
        (phaseGroups.enrich.length > 0 ? 1 : 0);
      
      let currentStep = 0;
      
      // ============================================================
      // Phase 1: 翻訳
      // ============================================================
      if (phaseGroups.translate.length > 0) {
        currentStep++;
        setCurrentPhase('翻訳中...');
        setProgress({ current: currentStep, total: totalSteps });
        
        console.log('----------------------------------------');
        console.log(`🌐 [Phase 1] 翻訳フェーズ: ${phaseGroups.translate.length}件`);
        
        for (const product of phaseGroups.translate) {
          try {
            // 日本語タイトルがない場合はスキップ
            if (!product.title) {
              console.log(`  ⏭️ ${(product as any).sku}: タイトルなし、スキップ`);
              result.skipped++;
              continue;
            }
            
            // 既に英語タイトルがある場合はスキップ
            if ((product as any).english_title || (product as any).title_en) {
              console.log(`  ⏭️ ${(product as any).sku}: 英語タイトル既存、スキップ`);
              result.skipped++;
              continue;
            }
            
            console.log(`  🔄 ${(product as any).sku}: 翻訳中... "${product.title?.substring(0, 30)}..."`);
            
            const response = await fetch('/api/tools/translate-product', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: product.id,
                title: product.title,
              }),
            });
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`  ✅ ${(product as any).sku}: 翻訳完了 → "${data.englishTitle?.substring(0, 30)}..."`);
            result.processed++;
            
          } catch (error: any) {
            console.error(`  ❌ ${(product as any).sku}: 翻訳失敗 - ${error.message}`);
            result.failed++;
            result.errors.push(`${(product as any).sku || product.id}: 翻訳失敗 - ${error.message}`);
          }
        }
        
        // リフレッシュ
        if (onRefresh) {
          console.log('  ♻️ データリフレッシュ中...');
          await onRefresh();
        }
      }
      
      // ============================================================
      // Phase 2: SM分析（統合API: Finding + Browse 並列実行）
      // ============================================================
      if (phaseGroups.scout.length > 0) {
        currentStep++;
        setCurrentPhase('SM分析中...');
        setProgress({ current: currentStep, total: totalSteps });
        
        console.log('----------------------------------------');
        console.log(`🔍 [Phase 2] SM分析フェーズ: ${phaseGroups.scout.length}件`);
        console.log('  🔥 統合API: Finding API（販売実績）+ Browse API（現在出品）並列実行');
        
        for (const product of phaseGroups.scout) {
          try {
            const ebayTitle = (product as any).english_title || (product as any).title_en || product.title;
            
            if (!ebayTitle) {
              console.log(`  ⏭️ ${(product as any).sku}: タイトルなし、スキップ`);
              result.skipped++;
              continue;
            }
            
            console.log(`  🔄 ${(product as any).sku}: SM分析中... "${ebayTitle?.substring(0, 30)}..."`);
            
            // 🔥 統合SM分析APIを使用（Finding + Browse並列）
            const response = await fetch('/api/ebay/sm-analysis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: product.id,
                ebayTitle: ebayTitle,
                ebayCategoryId: (product as any).category_id || (product as any).ebay_category_id || undefined,
                condition: (product as any).condition_name || 'New'
              }),
            });
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              const errorMsg = errorData.error || `HTTP ${response.status}`;
              
              // レート制限エラーの場合は長めに待機してスキップ
              if (response.status === 429 || errorMsg.includes('レート制限')) {
                console.warn(`  ⚠️ ${(product as any).sku}: レート制限 - 30秒待機後スキップ`);
                result.errors.push(`${(product as any).sku}: eBayレート制限（後で再試行）`);
                result.skipped++;
                await new Promise(resolve => setTimeout(resolve, 30000));
                continue;
              }
              
              throw new Error(errorMsg);
            }
            
            const data = await response.json();
            
            // 🔥 統合結果を表示
            console.log(`  ✅ ${(product as any).sku}: SM分析完了`);
            console.log(`     競合: ${data.competitor_count || 0}件, 過去90日: ${data.sold_last_90d || 0}件`);
            console.log(`     推奨価格: ${data.recommended_price || 0}, スコア: ${data.demand_score || 0}/100`);
            console.log(`     信頼度: ${data.confidence_level || 'unknown'}`);
            
            result.processed++;
            
            // レートリミット対策（成功時も2秒待機）
            await new Promise(resolve => setTimeout(resolve, 2000));
            
          } catch (error: any) {
            console.error(`  ❌ ${(product as any).sku}: SM分析失敗 - ${error.message}`);
            // SM分析失敗は「スキップ」扱いにして、後で再試行可能にする
            result.skipped++;
            result.errors.push(`${(product as any).sku || product.id}: SM分析スキップ - ${error.message}`);
          }
        }
        
        // リフレッシュ
        if (onRefresh) {
          console.log('  ♻️ データリフレッシュ中...');
          await onRefresh();
        }
      }
      
      // ============================================================
      // 🚨 停止ポイント: SM選択待ち
      // ============================================================
      // SM分析完了後、全商品をSM選択待ちとしてカウント
      const totalSMSelection = phaseGroups.selectSM.length + phaseGroups.scout.length;
      if (totalSMSelection > 0) {
        console.log('----------------------------------------');
        console.log(`🚨 [停止] SM選択待ち: ${totalSMSelection}件`);
        result.smSelectionRequired = totalSMSelection;
        
        // 🔥 SM選択待ちの商品リストを返す（モーダル表示用）
        result.smPendingProducts = [...phaseGroups.selectSM, ...phaseGroups.scout];
      }
      
      // ============================================================
      // Phase 3: AI補完・計算
      // ============================================================
      if (phaseGroups.enrich.length > 0) {
        currentStep++;
        setCurrentPhase('AI補完中...');
        setProgress({ current: currentStep, total: totalSteps });
        
        console.log('----------------------------------------');
        console.log(`🤖 [Phase 3] AI補完フェーズ: ${phaseGroups.enrich.length}件`);
        
        for (const product of phaseGroups.enrich) {
          try {
            console.log(`  🔄 ${(product as any).sku}: バッチ処理中...`);
            
            const response = await fetch('/api/tools/batch-process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productIds: [product.id],
                skipSM: true, // SM分析はスキップ
              }),
            });
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || `HTTP ${response.status}`);
            }
            
            console.log(`  ✅ ${(product as any).sku}: AI補完完了`);
            result.processed++;
            
          } catch (error: any) {
            console.error(`  ❌ ${(product as any).sku}: AI補完失敗 - ${error.message}`);
            result.failed++;
            result.errors.push(`${(product as any).sku || product.id}: AI補完失敗 - ${error.message}`);
          }
        }
        
        // 承認待ちとしてカウント
        result.approvalRequired = phaseGroups.enrich.length;
        console.log(`🚨 [停止] 承認待ち: ${result.approvalRequired}件`);
        
        // リフレッシュ
        if (onRefresh) {
          console.log('  ♻️ データリフレッシュ中...');
          await onRefresh();
        }
      }
      
      // 既にREADYの商品
      result.skipped += phaseGroups.ready.length;
      
      console.log('========================================');
      console.log('✅ [Pipeline] パイプライン完了');
      console.log(`   処理: ${result.processed}件`);
      console.log(`   SM選択待ち: ${result.smSelectionRequired}件`);
      console.log(`   承認待ち: ${result.approvalRequired}件`);
      console.log(`   スキップ: ${result.skipped}件`);
      console.log(`   失敗: ${result.failed}件`);
      if (result.errors.length > 0) {
        console.log('   エラー詳細:');
        result.errors.forEach(e => console.log(`     - ${e}`));
      }
      console.log('========================================');
      
    } finally {
      setIsProcessing(false);
      setCurrentPhase(null);
      setProgress({ current: 0, total: 0 });
    }
    
    result.duration = Date.now() - startTime;
    result.success = result.failed === 0;
    
    return result;
  }, [onRefresh]);
  
  // 🔥 Auto-Resume: SM選択完了後に次フェーズを自動実行
  const runAutoResume = useCallback(async (productIds: (string | number)[]): Promise<void> => {
    if (productIds.length === 0) return;
    
    setIsProcessing(true);
    setCurrentPhase('Auto-Resume: 次フェーズ実行中...');
    
    try {
      console.log('========================================');
      console.log('🔄 [Auto-Resume] 次フェーズ自動実行開始');
      console.log(`📦 対象商品: ${productIds.length}件`);
      
      // 詳細取得（SM選択後のフェーズ）
      for (const productId of productIds) {
        try {
          console.log(`  🔄 ${productId}: 詳細取得・AI補完中...`);
          
          const response = await fetch('/api/tools/batch-process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productIds: [productId],
              skipSM: true, // SM分析はスキップ
            }),
          });
          
          if (response.ok) {
            console.log(`  ✅ ${productId}: 完了`);
          }
        } catch (error) {
          console.error(`  ⚠️ ${productId}: エラー`, error);
        }
      }
      
      // リフレッシュ
      if (onRefresh) {
        console.log('  ♻️ データリフレッシュ中...');
        await onRefresh();
      }
      
      console.log('========================================');
      console.log('✅ [Auto-Resume] 完了');
      
    } finally {
      setIsProcessing(false);
      setCurrentPhase(null);
    }
  }, [onRefresh]);
  
  const abort = useCallback(() => {
    setIsProcessing(false);
  }, []);
  
  return {
    isProcessing,
    currentPhase,
    progress,
    runPipeline,
    runAutoResume,
    abort,
  };
}

// ============================================================
// メインコンポーネント
// ============================================================

export const SmartPipelineButton = memo(function SmartPipelineButton({
  selectedProducts,
  onComplete,
  onRefresh,
  disabled = false,
  onOpenSMSelection,
}: SmartPipelineButtonProps) {
  const [showResult, setShowResult] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  
  // 🔥 SM選択モーダルの状態
  const [showSMModal, setShowSMModal] = useState(false);
  const [smPendingProducts, setSmPendingProducts] = useState<Product[]>([]);
  
  const { isProcessing, currentPhase, progress, runPipeline, runAutoResume, abort } = usePipeline(onRefresh);
  
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
  const handleRun = useCallback(async () => {
    if (selectedProducts.length === 0) return;
    
    setResult(null);
    setShowResult(false);
    setShowErrors(false);
    
    const processResult = await runPipeline(selectedProducts);
    setResult(processResult);
    setShowResult(true);
    
    // 🔥 SM選択待ちがある場合、自動でモーダルを表示
    if (processResult.smSelectionRequired > 0 && processResult.smPendingProducts && processResult.smPendingProducts.length > 0) {
      setSmPendingProducts(processResult.smPendingProducts);
      setShowSMModal(true);
      toast.info(`🎯 SM選択モーダルを開きます（${processResult.smPendingProducts.length}件）`);
    }
    
    if (onComplete) {
      onComplete();
    }
  }, [selectedProducts, runPipeline, onComplete]);
  
  // SM選択モーダルを外部から開く（結果パネルからクリック）
  const handleOpenSMModal = useCallback(() => {
    if (result?.smPendingProducts && result.smPendingProducts.length > 0) {
      setSmPendingProducts(result.smPendingProducts);
      setShowSMModal(true);
      setShowResult(false);
    } else if (onOpenSMSelection) {
      // 外部ハンドラがある場合はそちらを使用
      const smProducts = selectedProducts.filter(p => {
        const { phase } = getProductPhase(p);
        return phase === 'SELECT_SM' || phase === 'SCOUT' || phase === 'FETCH_DETAILS';
      });
      onOpenSMSelection(smProducts);
    }
  }, [result, selectedProducts, onOpenSMSelection]);
  
  // 選択なしの場合
  if (selectedProducts.length === 0) {
    return null;
  }
  
  // 処理不要の場合（全てREADY/LISTED）
  const allReady = phaseSummary && 
    (phaseSummary.READY + phaseSummary.LISTED + phaseSummary.APPROVAL_PENDING) === selectedProducts.length;
  
  if (allReady) {
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
    <>
      <div className="relative inline-flex items-center">
        {/* メインボタン */}
        {isProcessing ? (
          <button
            onClick={abort}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded text-[11px] font-medium transition-colors"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              color: 'white',
            }}
            title="パイプライン実行中..."
          >
            <Loader2 size={12} className="animate-spin" />
            <span>{currentPhase || '処理中...'}</span>
            {progress.total > 0 && (
              <span className="px-1 py-0.5 rounded bg-white/20 text-[10px]">
                {progress.current}/{progress.total}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={handleRun}
            disabled={disabled || !plan || (plan.autoProcessable === 0 && plan.manualRequired === 0)}
            className={`
              inline-flex items-center gap-1.5 h-7 px-3 rounded
              text-[11px] font-medium transition-all duration-200
              ${disabled || !plan || (plan.autoProcessable === 0 && plan.manualRequired === 0)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : ''
              }
            `}
            style={{
              background: disabled || !plan || (plan.autoProcessable === 0 && plan.manualRequired === 0)
                ? undefined
                : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              color: disabled || !plan || (plan.autoProcessable === 0 && plan.manualRequired === 0)
                ? undefined
                : 'white',
              boxShadow: disabled || !plan || (plan.autoProcessable === 0 && plan.manualRequired === 0)
                ? undefined
                : '0 2px 4px rgba(139, 92, 246, 0.3)',
            }}
            title={`🚀 半自動パイプライン\n・自動処理: ${plan?.autoProcessable || 0}件\n・SM選択必要: ${plan?.manualRequired || 0}件`}
          >
            <Sparkles size={12} />
            <span>パイプライン</span>
            {plan && (plan.autoProcessable > 0 || plan.manualRequired > 0) && (
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-semibold">
                {plan.autoProcessable + plan.manualRequired}
              </span>
            )}
          </button>
        )}
        
        {/* 結果表示 */}
        {showResult && result && (
          <div 
            className="absolute top-full left-0 mt-2 p-3 rounded-lg border shadow-lg z-50"
            style={{ 
              background: 'white',
              minWidth: '280px',
              maxWidth: '360px',
              borderColor: result.success ? '#86efac' : '#fde047',
            }}
          >
            {/* ヘッダー */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b">
              {result.failed === 0 ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <AlertTriangle size={16} className="text-yellow-500" />
              )}
              <span className="text-sm font-semibold">
                パイプライン完了
              </span>
              <span className="text-[10px] text-gray-500 ml-auto">
                {Math.round(result.duration / 1000)}秒
              </span>
            </div>
            
            {/* 結果詳細 */}
            <div className="space-y-1.5 text-[11px]">
              {result.processed > 0 && (
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>自動処理完了: {result.processed}件</span>
                </div>
              )}
              
              {result.smSelectionRequired > 0 && (
                <div 
                  className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-blue-100"
                  style={{ background: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={handleOpenSMModal}
                >
                  <Users size={12} className="text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    🚨 SM選択待ち: {result.smSelectionRequired}件
                  </span>
                  <span className="text-[10px] text-blue-500 ml-auto">→ クリックで選択</span>
                </div>
              )}
              
              {result.approvalRequired > 0 && (
                <div 
                  className="flex items-center gap-2 px-2 py-1.5 rounded"
                  style={{ background: 'rgba(249, 115, 22, 0.1)' }}
                >
                  <AlertTriangle size={12} className="text-orange-500" />
                  <span className="text-orange-700 font-medium">
                    🚨 承認待ち: {result.approvalRequired}件
                  </span>
                </div>
              )}
              
              {result.skipped > 0 && (
                <div className="flex items-center gap-2 text-gray-500">
                  <span>⏭️ スキップ: {result.skipped}件</span>
                </div>
              )}
              
              {result.failed > 0 && (
                <div className="mt-2">
                  <div 
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                    onClick={() => setShowErrors(!showErrors)}
                  >
                    <XCircle size={12} />
                    <span>失敗: {result.failed}件</span>
                    <ChevronDown 
                      size={12} 
                      className={`ml-auto transition-transform ${showErrors ? 'rotate-180' : ''}`}
                    />
                  </div>
                  
                  {showErrors && result.errors.length > 0 && (
                    <div 
                      className="mt-2 p-2 rounded text-[10px] max-h-32 overflow-y-auto"
                      style={{ background: 'rgba(239, 68, 68, 0.05)' }}
                    >
                      {result.errors.map((err, i) => (
                        <div key={i} className="text-red-600 mb-1">
                          • {err}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 閉じるボタン */}
            <button
              onClick={() => setShowResult(false)}
              className="mt-3 w-full text-center text-[10px] text-gray-500 hover:text-gray-700 py-1"
            >
              閉じる
            </button>
          </div>
        )}
      </div>
      
      {/* 🔥 SM選択モーダル（Auto-Resume対応） */}
      <SmSelectionModal
        isOpen={showSMModal}
        onClose={() => setShowSMModal(false)}
        products={smPendingProducts}
        onSelectComplete={(productId, competitorId) => {
          console.log(`[Pipeline] SM選択完了: ${productId} → ${competitorId}`);
        }}
        onSelectionCompleteAll={() => {
          console.log('[Pipeline] 全SM選択完了');
        }}
        onAutoResumeNext={runAutoResume}
      />
    </>
  );
});

export default SmartPipelineButton;
