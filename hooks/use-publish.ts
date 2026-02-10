// hooks/use-publish.ts
/**
 * 出品フック - ハイブリッドAI監査パイプライン
 * 
 * AI監査ステータスに基づいた出品制御
 * 
 * @created 2025-01-16
 */
'use client'

import { useState, useCallback } from 'react'
import type { 
  AiAuditStatus, 
  SafetyStatus,
  ConvertedPrice 
} from '@/types/hybrid-ai-pipeline'

interface UsePublishOptions {
  onSuccess?: (productId: number, listingId: string) => void
  onError?: (error: Error) => void
  onWarningConfirm?: (productId: number) => Promise<boolean>
}

interface PublishState {
  isLoading: boolean
  currentProductId: number | null
  error: string | null
}

export function usePublish(options: UsePublishOptions = {}) {
  const [state, setState] = useState<PublishState>({
    isLoading: false,
    currentProductId: null,
    error: null,
  })

  /**
   * 出品可能かチェック
   */
  const canPublish = useCallback((auditStatus: AiAuditStatus | null | undefined): boolean => {
    return auditStatus === 'clear' || auditStatus === 'warning'
  }, [])

  /**
   * 安全装置ステータスを取得
   */
  const getSafetyStatus = useCallback((auditStatus: AiAuditStatus | null | undefined): SafetyStatus => {
    const status = auditStatus || 'pending'
    return {
      editLocked: status === 'processing_batch',
      canPublish: status === 'clear',
      needsWarning: status === 'warning',
      isBlocked: status === 'manual_check' || status === 'processing_batch',
    }
  }, [])

  /**
   * 出品を実行
   */
  const publish = useCallback(async (
    productId: number,
    account: string = 'mjt',
    marketplaceId: string = 'EBAY_US'
  ) => {
    setState({ isLoading: true, currentProductId: productId, error: null })

    try {
      // まず監査ステータスを確認
      const statusResponse = await fetch(`/api/products/${productId}/sm-selection`)
      const statusResult = await statusResponse.json()

      if (statusResult.success) {
        const { auditStatus, safetyStatus } = statusResult

        // 出品ブロックチェック
        if (safetyStatus?.isBlocked) {
          throw new Error(
            auditStatus === 'processing_batch'
              ? 'AI監査処理中のため出品できません。処理完了までお待ちください。'
              : '手動確認が必要なため出品できません。監査レポートを確認してください。'
          )
        }

        // 警告ありの場合は確認
        if (safetyStatus?.needsWarning) {
          if (options.onWarningConfirm) {
            const confirmed = await options.onWarningConfirm(productId)
            if (!confirmed) {
              setState({ isLoading: false, currentProductId: null, error: null })
              return { success: false, cancelled: true }
            }
          }
        }
      }

      // 出品API呼び出し
      const response = await fetch('/api/ebay/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          account,
          marketplaceId,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '出品に失敗しました')
      }

      setState({ isLoading: false, currentProductId: null, error: null })
      options.onSuccess?.(productId, result.listingId)

      return { 
        success: true, 
        listingId: result.listingId,
        offerId: result.offerId,
      }

    } catch (error: any) {
      setState({ isLoading: false, currentProductId: null, error: error.message })
      options.onError?.(error)
      return { success: false, error: error.message }
    }
  }, [options])

  /**
   * 一括出品
   */
  const publishBatch = useCallback(async (
    productIds: number[],
    account: string = 'mjt',
    marketplaceId: string = 'EBAY_US'
  ) => {
    const results: { productId: number; success: boolean; listingId?: string; error?: string }[] = []

    for (const productId of productIds) {
      const result = await publish(productId, account, marketplaceId)
      results.push({
        productId,
        success: result.success,
        listingId: result.listingId,
        error: result.error,
      })

      // 少し待機（API制限対策）
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return results
  }, [publish])

  /**
   * 価格変換（USD → 各国通貨）
   */
  const convertPrice = useCallback(async (
    basePriceUsd: number,
    targetMarketplace: string
  ): Promise<ConvertedPrice | null> => {
    try {
      const response = await fetch('/api/currency/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basePriceUsd,
          targetMarketplace,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        return null
      }

      return result.convertedPrice
    } catch (error) {
      return null
    }
  }, [])

  /**
   * AI監査をリクエスト
   */
  const requestAudit = useCallback(async (productId: number) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch(`/api/products/${productId}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '監査リクエストに失敗しました')
      }

      setState(prev => ({ ...prev, isLoading: false }))
      return { success: true, auditStatus: result.auditStatus }

    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }, [])

  return {
    // 状態
    isLoading: state.isLoading,
    currentProductId: state.currentProductId,
    error: state.error,

    // アクション
    publish,
    publishBatch,
    canPublish,
    getSafetyStatus,
    convertPrice,
    requestAudit,
  }
}

export default usePublish
