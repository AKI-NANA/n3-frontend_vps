// app/tools/editing/hooks/use-basic-edit.ts
import { useState, useMemo, useCallback } from 'react'
import { useTaxonomyOperations } from './use-taxonomy-operations'
import { useTranslationOperations } from './use-translation-operations'
import { useResearchOperations } from './use-research-operations'
import { useFlowLogic } from './use-flow-logic'
import type { Product } from '../types/product'

interface UseBasicEditProps {
  products: Product[]
  selectedIds: Set<string>
  onShowToast: (message: string, type?: 'success' | 'error') => void
  onLoadProducts: () => Promise<void>
  updateLocalProduct: (id: string, updates: Partial<Product>) => void
  getAllSelected: () => any[]
  clearAll: () => void
  // Batch処理関数
  runBatchCategory: (ids: string[]) => Promise<any>
  runBatchShipping: (ids: string[]) => Promise<any>
  runBatchProfit: (ids: string[]) => Promise<any>
  runBatchHTMLGenerate: (ids: string[]) => Promise<any>
  runBatchSellerMirror: (ids: string[]) => Promise<any>
  runBatchScores: (products: Product[]) => Promise<any>
  runAllProcesses: (products: Product[]) => Promise<any>
}

export function useBasicEdit({
  products,
  selectedIds,
  onShowToast,
  onLoadProducts,
  updateLocalProduct,
  getAllSelected,
  clearAll,
  runBatchCategory,
  runBatchShipping,
  runBatchProfit,
  runBatchHTMLGenerate,
  runBatchSellerMirror,
  runBatchScores,
  runAllProcesses
}: UseBasicEditProps) {
  // 専門フックを統合
  const taxonomyOps = useTaxonomyOperations({
    products,
    selectedIds,
    onShowToast,
    onLoadProducts,
    updateLocalProduct
  })

  const translationOps = useTranslationOperations({
    products,
    selectedIds,
    onShowToast,
    onLoadProducts,
    updateLocalProduct
  })

  const researchOps = useResearchOperations({
    products,
    selectedIds,
    onShowToast,
    onLoadProducts,
    getAllSelected,
    clearAll
  })

  const flowLogic = useFlowLogic({
    selectedIds,
    onShowToast,
    onLoadProducts
  })

  // 状態管理
  const [showHTMLPanel, setShowHTMLPanel] = useState(false)
  const [showPricingPanel, setShowPricingPanel] = useState(false)
  const [showAIEnrichModal, setShowAIEnrichModal] = useState(false)
  const [showMarketResearchModal, setShowMarketResearchModal] = useState(false)
  const [showGeminiBatchModal, setShowGeminiBatchModal] = useState(false)
  const [showHTSClassificationModal, setShowHTSClassificationModal] = useState(false)
  const [enrichTargetProduct, setEnrichTargetProduct] = useState<Product | null>(null)
  const [htsTargetProduct, setHTSTargetProduct] = useState<Product | null>(null)

  // 派生データ
  const selectedProducts = useMemo(() => {
    return products.filter(p => selectedIds.has(String(p.id)))
  }, [products, selectedIds])

  const readyCount = useMemo(() => {
    return products.filter(p => p.ready_to_list).length
  }, [products])

  const filterPassedCount = useMemo(() => {
    return products.filter(p => p.filter_passed).length
  }, [products])

  // Run All（全処理実行）
  const handleRunAll = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    const selectedProductIds = Array.from(selectedIds)
    onShowToast(`${selectedProductIds.length}件の商品に対して全処理を開始します...`, 'success')

    try {
      // ステップ1: カテゴリ分析
      onShowToast('1/6: カテゴリ分析中...', 'success')
      const categoryResult = await runBatchCategory(selectedProductIds)
      if (!categoryResult.success) {
        throw new Error(`カテゴリ分析失敗: ${categoryResult.error}`)
      }

      // ステップ2: 送料計算
      onShowToast('2/6: 送料計算中...', 'success')
      const shippingResult = await runBatchShipping(selectedProductIds)
      if (!shippingResult.success) {
        throw new Error(`送料計算失敗: ${shippingResult.error}`)
      }

      // ステップ3: 利益計算
      onShowToast('3/6: 利益計算中...', 'success')
      const profitResult = await runBatchProfit(selectedProductIds)
      if (!profitResult.success) {
        throw new Error(`利益計算失敗: ${profitResult.error}`)
      }

      // ステップ4: SellerMirror分析
      onShowToast('4/6: SellerMirror分析中...', 'success')
      const smResult = await runBatchSellerMirror(selectedProductIds)
      if (!smResult.success) {
        throw new Error(`SellerMirror分析失敗: ${smResult.error}`)
      }

      // ステップ5: HTML生成
      onShowToast('5/6: HTML生成中...', 'success')
      const htmlResult = await runBatchHTMLGenerate(selectedProductIds)
      if (!htmlResult.success) {
        throw new Error(`HTML生成失敗: ${htmlResult.error}`)
      }

      // ステップ6: スコア計算
      onShowToast('6/6: スコア計算中...', 'success')
      const scoresResult = await runBatchScores(selectedProducts)
      if (!scoresResult.success) {
        throw new Error(`スコア計算失敗: ${scoresResult.error}`)
      }

      onShowToast(`✅ 全処理完了！${selectedProductIds.length}件の商品を処理しました`, 'success')
      await onLoadProducts()
    } catch (error: any) {
      onShowToast(error.message || '処理中にエラーが発生しました', 'error')
    }
  }, [selectedIds, selectedProducts, onShowToast, onLoadProducts, runBatchCategory, runBatchShipping, runBatchProfit, runBatchHTMLGenerate, runBatchSellerMirror, runBatchScores])

  // カテゴリ分析
  const handleCategory = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }
    const productIds = Array.from(selectedIds)
    onShowToast(`📋 ${productIds.length}件のカテゴリ分析を開始...`, 'success')
    const result = await runBatchCategory(productIds)
    if (result.success) {
      onShowToast(`✅ カテゴリ分析完了: ${result.updated}件`, 'success')
      await onLoadProducts()
    } else {
      onShowToast(`❌ ${result.error || 'カテゴリ分析に失敗しました'}`, 'error')
    }
  }, [selectedIds, onShowToast, onLoadProducts, runBatchCategory])

  // 送料計算
  const handleShipping = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }
    const productIds = Array.from(selectedIds)
    onShowToast(`🚚 ${productIds.length}件の送料計算を開始...`, 'success')
    const result = await runBatchShipping(productIds)
    if (result.success) {
      onShowToast(`✅ ${result.message || `送料計算完了: ${result.updated}件`}`, 'success')
      await onLoadProducts()
    } else {
      onShowToast(`❌ ${result.error || '送料計算に失敗しました'}`, 'error')
    }
  }, [selectedIds, onShowToast, onLoadProducts, runBatchShipping])

  // 利益計算
  const handleProfit = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }
    const productIds = Array.from(selectedIds)
    onShowToast(`💰 ${productIds.length}件の利益計算を開始...`, 'success')
    const result = await runBatchProfit(productIds)
    if (result.success) {
      onShowToast(`✅ 利益計算完了: ${result.updated}件`, 'success')
      await onLoadProducts()
    } else {
      onShowToast(`❌ ${result.error || '利益計算に失敗しました'}`, 'error')
    }
  }, [selectedIds, onShowToast, onLoadProducts, runBatchProfit])

  // HTML生成パネルを開く
  const handleHTML = useCallback(() => {
    setShowHTMLPanel(true)
  }, [])

  // AI強化モーダルを開く
  const handleAIEnrich = useCallback(() => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }
    const firstId = Array.from(selectedIds)[0]
    const product = products.find(p => String(p.id) === firstId)
    if (product) {
      setEnrichTargetProduct(product)
      setShowAIEnrichModal(true)
    }
  }, [selectedIds, products, onShowToast])

  return {
    // データ
    selectedProducts,
    readyCount,
    filterPassedCount,
    
    // モーダル状態
    showHTMLPanel,
    showPricingPanel,
    showAIEnrichModal,
    showMarketResearchModal,
    showGeminiBatchModal,
    showHTSClassificationModal,
    enrichTargetProduct,
    htsTargetProduct,
    
    // モーダル制御
    setShowHTMLPanel,
    setShowPricingPanel,
    setShowAIEnrichModal,
    setShowMarketResearchModal,
    setShowGeminiBatchModal,
    setShowHTSClassificationModal,
    
    // アクション
    handleRunAll,
    handleCategory,
    handleShipping,
    handleProfit,
    handleHTML,
    handleAIEnrich,
    
    // 専門フックの機能を公開
    ...taxonomyOps,
    ...translationOps,
    ...researchOps,
    ...flowLogic
  }
}
