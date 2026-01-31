// hooks/use-sm-selection.ts
/**
 * SM選択フック - ハイブリッドAI監査パイプライン
 * 
 * SM選択モーダルとAPIの連携を管理
 * 
 * @created 2025-01-16
 */
'use client'

import { useState, useCallback } from 'react'
import type { 
  SmSelectionResponse, 
  AiAuditStatus, 
  SafetyStatus,
  SmSelectedItem 
} from '@/types/hybrid-ai-pipeline'

interface UseSmSelectionOptions {
  onSuccess?: (response: SmSelectionResponse) => void
  onError?: (error: Error) => void
  onAuditStatusChange?: (productId: number, status: AiAuditStatus) => void
}

interface SmSelectionState {
  isLoading: boolean
  isModalOpen: boolean
  selectedProductId: number | null
  competitors: any[]
  lastResult: SmSelectionResponse | null
  error: string | null
}

export function useSmSelection(options: UseSmSelectionOptions = {}) {
  const [state, setState] = useState<SmSelectionState>({
    isLoading: false,
    isModalOpen: false,
    selectedProductId: null,
    competitors: [],
    lastResult: null,
    error: null,
  })

  /**
   * SM分析を実行して競合データを取得
   */
  const runSmAnalysis = useCallback(async (
    productId: number,
    title: string,
    categoryId?: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/ebay/sm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          ebayTitle: title,
          ebayCategoryId: categoryId,
          condition: 'Used',
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'SM分析に失敗しました')
      }

      // 競合データを正規化
      const competitors = normalizeCompetitors(result)

      setState(prev => ({
        ...prev,
        isLoading: false,
        competitors,
        selectedProductId: productId,
        isModalOpen: true,
      }))

      return { success: true, competitors }

    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }))
      options.onError?.(error)
      return { success: false, error: error.message }
    }
  }, [options])

  /**
   * SM選択を実行（API呼び出し）
   */
  const selectCompetitor = useCallback(async (
    productId: number,
    competitor: any,
    selectionType: 'exact' | 'reference'
  ): Promise<SmSelectionResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`/api/products/${productId}/sm-selection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitor: {
            itemId: competitor.itemId,
            title: competitor.title,
            price: competitor.price,
            currency: competitor.currency || 'USD',
            categoryId: competitor.categoryId,
            condition: competitor.condition,
            imageUrl: competitor.image || competitor.imageUrl,
            seller: competitor.seller ? {
              username: typeof competitor.seller === 'string' ? competitor.seller : competitor.seller.username,
              feedbackScore: competitor.sellerFeedbackScore || competitor.seller?.feedbackScore || 0,
            } : undefined,
            location: competitor.location ? {
              country: competitor.location,
            } : undefined,
            itemWebUrl: competitor.itemWebUrl,
            itemSpecifics: competitor.itemSpecifics,
            selectedAt: new Date().toISOString(),
            selectionType,
          },
          selectionType,
        }),
      })

      const result: SmSelectionResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'SM選択に失敗しました')
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        lastResult: result,
      }))

      // コールバック
      options.onSuccess?.(result)
      options.onAuditStatusChange?.(productId, result.auditStatus)

      return result

    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }))
      options.onError?.(error)
      throw error
    }
  }, [options])

  /**
   * 現在のSM選択状態を取得
   */
  const getSelectionState = useCallback(async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/sm-selection`)
      const result = await response.json()

      if (!result.success) {
        return null
      }

      return {
        smSelectedItem: result.smSelectedItem,
        smSelectedItemId: result.smSelectedItemId,
        auditStatus: result.auditStatus,
        auditReport: result.auditReport,
        confidenceScore: result.confidenceScore,
        basePriceUsd: result.basePriceUsd,
        safetyStatus: result.safetyStatus,
      }
    } catch (error) {
      return null
    }
  }, [])

  /**
   * モーダルを開く
   */
  const openModal = useCallback((productId: number, competitors: any[] = []) => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      selectedProductId: productId,
      competitors,
    }))
  }, [])

  /**
   * モーダルを閉じる
   */
  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      selectedProductId: null,
    }))
  }, [])

  /**
   * 再検索
   */
  const reSearch = useCallback(async (keywords: string) => {
    if (!state.selectedProductId) return

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch('/api/ebay/sm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: state.selectedProductId,
          ebayTitle: keywords,
          condition: 'Used',
        }),
      })

      const result = await response.json()

      if (result.success) {
        const competitors = normalizeCompetitors(result)
        setState(prev => ({
          ...prev,
          isLoading: false,
          competitors,
        }))
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }))
    }
  }, [state.selectedProductId])

  return {
    // 状態
    isLoading: state.isLoading,
    isModalOpen: state.isModalOpen,
    selectedProductId: state.selectedProductId,
    competitors: state.competitors,
    lastResult: state.lastResult,
    error: state.error,

    // アクション
    runSmAnalysis,
    selectCompetitor,
    getSelectionState,
    openModal,
    closeModal,
    reSearch,
  }
}

/**
 * 競合データを正規化
 */
function normalizeCompetitors(smResult: any): any[] {
  const browseItems = smResult.browse_result?.items || smResult.competitors || []
  const findingItems = smResult.finding_result?.items || []

  // 販売実績マップを作成
  const soldMap = new Map<string, number>()
  findingItems.forEach((item: any) => {
    if (item.title) {
      soldMap.set(item.title.toLowerCase(), item.quantitySold || 0)
    }
  })

  return browseItems.map((item: any) => ({
    itemId: item.itemId || '',
    title: item.title || '',
    price: typeof item.price === 'number' 
      ? item.price 
      : parseFloat(item.price?.value || item.price || '0'),
    currency: item.price?.currency || item.currency || 'USD',
    imageUrl: item.image?.imageUrl || item.imageUrl || item.image,
    seller: {
      username: typeof item.seller === 'string' ? item.seller : item.seller?.username || 'Unknown',
      feedbackScore: item.seller?.feedbackScore || item.sellerFeedbackScore || 0,
    },
    location: {
      country: item.location?.country || item.itemLocation?.country || '',
    },
    condition: item.condition || 'Used',
    itemWebUrl: item.itemWebUrl || item.viewItemUrl || `https://www.ebay.com/itm/${item.itemId}`,
    soldQuantity: soldMap.get((item.title || '').toLowerCase()) || 0,
    itemSpecifics: item.localizedAspects || item.itemSpecifics || {},
  }))
}

export default useSmSelection
