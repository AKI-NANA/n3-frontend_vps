// app/tools/editing/components/product-enrichment-flow.tsx
/**
 * 商品データ強化フロー統合コンポーネント
 * 
 * 完全なフロー:
 * 1. 自動英語翻訳（前提条件：既に実行済み）
 * 2. SM分析実行（必要な場合）
 * 3. 競合商品選択（SMCompetitorSelectionModal）
 * 4. 詳細取得（選択した競合のItem Specifics）
 * 5. AIデータ強化（AIEnrichmentWithAnthropicModal）
 * 6. 残り計算実行（送料・利益・DDP）
 * 7. フィルター → スコア → 完成
 */
'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Play, ArrowRight, CheckCircle2, AlertCircle, Loader2,
  Search, Sparkles, Calculator, Filter, Award, X
} from 'lucide-react'
import type { Product } from '../types/product'
import { SMCompetitorSelectionModal } from './sm-competitor-selection-modal'
import { AIEnrichmentWithAnthropicModal } from './ai-enrichment-with-anthropic-modal'
import { ItemSpecificsEditorModal } from './item-specifics-editor-modal'

interface ProductEnrichmentFlowProps {
  product: Product
  onClose: () => void
  onComplete: () => Promise<void>
  // 各ステップの実行関数（親から渡される）
  onRunSMAnalysis?: (productId: string) => Promise<boolean>
  onRunCalculations?: (productId: string) => Promise<boolean>
  onRunFilter?: (productId: string) => Promise<boolean>
  onRunScore?: (productId: string) => Promise<boolean>
}

type FlowStep = 
  | 'check' 
  | 'sm_analysis' 
  | 'competitor_selection' 
  | 'ai_enrichment' 
  | 'calculations' 
  | 'filter' 
  | 'score' 
  | 'complete'

interface StepStatus {
  id: FlowStep
  label: string
  icon: React.ReactNode
  status: 'pending' | 'running' | 'done' | 'error' | 'skipped'
  message?: string
}

export function ProductEnrichmentFlow({
  product,
  onClose,
  onComplete,
  onRunSMAnalysis,
  onRunCalculations,
  onRunFilter,
  onRunScore
}: ProductEnrichmentFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('check')
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([
    { id: 'check', label: '前提条件確認', icon: <CheckCircle2 className="w-4 h-4" />, status: 'pending' },
    { id: 'sm_analysis', label: 'SM分析', icon: <Search className="w-4 h-4" />, status: 'pending' },
    { id: 'competitor_selection', label: '競合選択', icon: <Search className="w-4 h-4" />, status: 'pending' },
    { id: 'ai_enrichment', label: 'AIデータ強化', icon: <Sparkles className="w-4 h-4" />, status: 'pending' },
    { id: 'calculations', label: '計算実行', icon: <Calculator className="w-4 h-4" />, status: 'pending' },
    { id: 'filter', label: 'フィルター', icon: <Filter className="w-4 h-4" />, status: 'pending' },
    { id: 'score', label: 'スコア付け', icon: <Award className="w-4 h-4" />, status: 'pending' },
    { id: 'complete', label: '完了', icon: <CheckCircle2 className="w-4 h-4" />, status: 'pending' },
  ])

  // モーダル表示状態
  const [showCompetitorModal, setShowCompetitorModal] = useState(false)
  const [showAIEnrichmentModal, setShowAIEnrichmentModal] = useState(false)
  const [showItemSpecificsModal, setShowItemSpecificsModal] = useState(false)
  const [competitorDetails, setCompetitorDetails] = useState<any>(null)
  const [selectedCompetitor, setSelectedCompetitor] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  // ステップ状態更新
  const updateStepStatus = useCallback((stepId: FlowStep, status: StepStatus['status'], message?: string) => {
    setStepStatuses(prev => prev.map(s => 
      s.id === stepId ? { ...s, status, message } : s
    ))
  }, [])

  // 前提条件チェック
  const checkPrerequisites = useCallback((): { valid: boolean; issues: string[] } => {
    const issues: string[] = []

    if (!product.english_title && !product.title_en) {
      issues.push('英語タイトルがありません。先に翻訳を実行してください。')
    }

    if (!product.ebay_category_id) {
      issues.push('eBayカテゴリが設定されていません。')
    }

    return { valid: issues.length === 0, issues }
  }, [product])

  // フロー開始
  const startFlow = useCallback(async () => {
    setProcessing(true)
    setError(null)

    // 1. 前提条件チェック
    setCurrentStep('check')
    updateStepStatus('check', 'running')

    const prereq = checkPrerequisites()
    if (!prereq.valid) {
      updateStepStatus('check', 'error', prereq.issues.join(' '))
      setError(prereq.issues.join('\n'))
      setProcessing(false)
      return
    }
    updateStepStatus('check', 'done')

    // 2. SM分析チェック
    setCurrentStep('sm_analysis')
    updateStepStatus('sm_analysis', 'running')

    const hasSMData = product.ebay_api_data?.browse_result?.items?.length > 0

    if (!hasSMData) {
      // SM分析が必要
      if (onRunSMAnalysis) {
        try {
          const success = await onRunSMAnalysis(String(product.id))
          if (!success) {
            updateStepStatus('sm_analysis', 'error', 'SM分析に失敗しました')
            setError('SM分析に失敗しました。手動で実行してください。')
            setProcessing(false)
            return
          }
        } catch (err: any) {
          updateStepStatus('sm_analysis', 'error', err.message)
          setError(err.message)
          setProcessing(false)
          return
        }
      } else {
        updateStepStatus('sm_analysis', 'error', 'SM分析が未実行です')
        setError('SM分析が必要です。先にSM分析を実行してください。')
        setProcessing(false)
        return
      }
    }
    updateStepStatus('sm_analysis', 'done')

    // 3. 競合選択モーダルを表示
    setCurrentStep('competitor_selection')
    updateStepStatus('competitor_selection', 'running')
    setShowCompetitorModal(true)
    setProcessing(false)
  }, [product, checkPrerequisites, onRunSMAnalysis, updateStepStatus])

  // 競合選択完了
  const handleCompetitorSelected = useCallback(async (selectedItem: any, itemDetails?: any) => {
    setShowCompetitorModal(false)
    setCompetitorDetails(itemDetails)
    setSelectedCompetitor(selectedItem)
    updateStepStatus('competitor_selection', 'done', `選択: ${selectedItem.title?.slice(0, 30)}...`)

    // 4. Item Specifics編集モーダルを表示（競合データで初期化）
    setCurrentStep('ai_enrichment')
    updateStepStatus('ai_enrichment', 'running')
    setShowItemSpecificsModal(true)
  }, [updateStepStatus])

  // 競合選択スキップ
  const handleCompetitorSkipped = useCallback(() => {
    setShowCompetitorModal(false)
    updateStepStatus('competitor_selection', 'skipped', 'スキップ')

    // Item Specifics編集モーダルを表示（競合データなし）
    setCurrentStep('ai_enrichment')
    updateStepStatus('ai_enrichment', 'running')
    setShowItemSpecificsModal(true)
  }, [updateStepStatus])

  // Item Specifics保存完了
  const handleItemSpecificsSave = useCallback(async (data: {
    english_title: string
    item_specifics: Record<string, string>
    missing_required: string[]
  }) => {
    setShowItemSpecificsModal(false)
    
    try {
      // APIを呼んで保存
      const response = await fetch('/api/products/save-item-specifics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ...data
        })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '保存に失敗しました')
      }
      
      const message = data.missing_required.length > 0
        ? `保存完了（未入力: ${data.missing_required.length}件）`
        : '保存完了'
      updateStepStatus('ai_enrichment', 'done', message)
      
    } catch (err: any) {
      updateStepStatus('ai_enrichment', 'error', err.message)
      setError(err.message)
      return
    }
    
    setProcessing(true)

    // 5. 計算実行へ進む
    setCurrentStep('calculations')
    updateStepStatus('calculations', 'running')

    if (onRunCalculations) {
      try {
        await onRunCalculations(String(product.id))
        updateStepStatus('calculations', 'done')
      } catch (err: any) {
        updateStepStatus('calculations', 'error', err.message)
      }
    } else {
      updateStepStatus('calculations', 'skipped')
    }

    // 6. フィルター
    setCurrentStep('filter')
    updateStepStatus('filter', 'running')

    if (onRunFilter) {
      try {
        await onRunFilter(String(product.id))
        updateStepStatus('filter', 'done')
      } catch (err: any) {
        updateStepStatus('filter', 'error', err.message)
      }
    } else {
      updateStepStatus('filter', 'skipped')
    }

    // 7. スコア
    setCurrentStep('score')
    updateStepStatus('score', 'running')

    if (onRunScore) {
      try {
        await onRunScore(String(product.id))
        updateStepStatus('score', 'done')
      } catch (err: any) {
        updateStepStatus('score', 'error', err.message)
      }
    } else {
      updateStepStatus('score', 'skipped')
    }

    // 8. 完了
    setCurrentStep('complete')
    updateStepStatus('complete', 'done')
    setProcessing(false)

    await onComplete()
  }, [product.id, onRunCalculations, onRunFilter, onRunScore, onComplete, updateStepStatus])

  // AIデータ強化完了（旧モーダル用・後方互換）
  const handleAIEnrichmentComplete = useCallback(async (success: boolean) => {
    setShowAIEnrichmentModal(false)

    if (!success) {
      updateStepStatus('ai_enrichment', 'error', '処理失敗')
      setError('AIデータ強化に失敗しました')
      return
    }

    updateStepStatus('ai_enrichment', 'done')
    setProcessing(true)

    // 5. 計算実行
    setCurrentStep('calculations')
    updateStepStatus('calculations', 'running')

    if (onRunCalculations) {
      try {
        await onRunCalculations(String(product.id))
        updateStepStatus('calculations', 'done')
      } catch (err: any) {
        updateStepStatus('calculations', 'error', err.message)
        // エラーでも続行
      }
    } else {
      updateStepStatus('calculations', 'skipped')
    }

    // 6. フィルター
    setCurrentStep('filter')
    updateStepStatus('filter', 'running')

    if (onRunFilter) {
      try {
        await onRunFilter(String(product.id))
        updateStepStatus('filter', 'done')
      } catch (err: any) {
        updateStepStatus('filter', 'error', err.message)
      }
    } else {
      updateStepStatus('filter', 'skipped')
    }

    // 7. スコア
    setCurrentStep('score')
    updateStepStatus('score', 'running')

    if (onRunScore) {
      try {
        await onRunScore(String(product.id))
        updateStepStatus('score', 'done')
      } catch (err: any) {
        updateStepStatus('score', 'error', err.message)
      }
    } else {
      updateStepStatus('score', 'skipped')
    }

    // 8. 完了
    setCurrentStep('complete')
    updateStepStatus('complete', 'done')
    setProcessing(false)

    await onComplete()
  }, [product.id, onRunCalculations, onRunFilter, onRunScore, onComplete, updateStepStatus])

  // ステップのアイコン色
  const getStatusColor = (status: StepStatus['status']) => {
    switch (status) {
      case 'done': return 'text-green-600 bg-green-100'
      case 'running': return 'text-blue-600 bg-blue-100 animate-pulse'
      case 'error': return 'text-red-600 bg-red-100'
      case 'skipped': return 'text-gray-400 bg-gray-100'
      default: return 'text-gray-400 bg-gray-100'
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl overflow-hidden">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">商品データ強化フロー</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 商品情報 */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b">
            <div className="flex items-center gap-3">
              {product.primary_image_url && (
                <img src={product.primary_image_url} alt="" className="w-12 h-12 object-cover rounded" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.title}</p>
                <p className="text-xs text-gray-500">
                  {product.english_title ? '✓ 英語タイトルあり' : '✗ 英語タイトルなし'}
                  {' | '}
                  {product.ebay_category_id ? `カテゴリ: ${product.ebay_category_id}` : 'カテゴリ未設定'}
                </p>
              </div>
            </div>
          </div>

          {/* フローステップ */}
          <div className="p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              {stepStatuses.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    currentStep === step.id ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200' : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                    {step.status === 'running' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.label}</p>
                    {step.message && (
                      <p className={`text-xs ${step.status === 'error' ? 'text-red-600' : 'text-gray-500'}`}>
                        {step.message}
                      </p>
                    )}
                  </div>
                  {step.status === 'done' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {step.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                </div>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 flex justify-between">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            
            {currentStep === 'check' && (
              <Button onClick={startFlow} disabled={processing}>
                {processing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />処理中...</>
                ) : (
                  <>フロー開始 <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            )}

            {currentStep === 'complete' && (
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                完了
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 競合選択モーダル */}
      {showCompetitorModal && (
        <SMCompetitorSelectionModal
          product={product}
          onClose={() => {
            setShowCompetitorModal(false)
            updateStepStatus('competitor_selection', 'error', 'キャンセル')
          }}
          onSelect={handleCompetitorSelected}
          onSkip={handleCompetitorSkipped}
        />
      )}

      {/* AIデータ強化モーダル（後方互換用） */}
      {showAIEnrichmentModal && (
        <AIEnrichmentWithAnthropicModal
          product={product}
          competitorDetails={competitorDetails}
          onClose={() => {
            setShowAIEnrichmentModal(false)
            updateStepStatus('ai_enrichment', 'error', 'キャンセル')
          }}
          onSave={handleAIEnrichmentComplete}
        />
      )}

      {/* Item Specifics編集モーダル */}
      {showItemSpecificsModal && (
        <ItemSpecificsEditorModal
          product={product}
          competitorDetails={competitorDetails}
          onClose={() => {
            setShowItemSpecificsModal(false)
            updateStepStatus('ai_enrichment', 'error', 'キャンセル')
          }}
          onSave={handleItemSpecificsSave}
        />
      )}
    </>
  )
}
