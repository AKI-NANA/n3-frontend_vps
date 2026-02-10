// app/tools/operations/hooks/use-auto-trigger.ts
// コピー元: editing/hooks/use-auto-trigger.ts
import { useEffect, useRef } from 'react'
import type { Product } from '../types/product'

interface UseAutoTriggerProps {
  products: Product[]
  selectedIds: Set<string>
  onTranslate: () => Promise<void>
  onSMAnalyze: () => Promise<void>
  onShowToast: (message: string, type?: 'success' | 'error') => void
}

/**
 * 自動トリガーシステム
 * フロー: 1. データ取得 → 自動翻訳  2. 翻訳完了 → 自動SM分析
 */
export function useAutoTrigger({ products, selectedIds, onTranslate, onSMAnalyze, onShowToast }: UseAutoTriggerProps) {
  const hasTriggeredTranslation = useRef(false)
  const hasTriggeredSM = useRef(false)

  // Step 1 → Step 2: 新商品が追加されたら自動翻訳
  useEffect(() => {
    if (products.length === 0) return
    if (hasTriggeredTranslation.current) return
    const needsTranslation = products.some(p => !p.english_title)
    if (needsTranslation) {
      console.log('🔄 自動トリガー: 翻訳開始')
      hasTriggeredTranslation.current = true
      const untranslatedIds = products.filter(p => !p.english_title).map(p => String(p.id))
      if (untranslatedIds.length > 0) {
        onShowToast(`${untranslatedIds.length}件の商品を自動翻訳中...`, 'success')
      }
    }
  }, [products])

  // Step 2 → Step 3: 翻訳完了後に自動SM分析
  useEffect(() => {
    if (products.length === 0) return
    if (hasTriggeredSM.current) return
    const allTranslated = products.every(p => p.english_title)
    const needsSM = products.some(p => { const ebayData = p.ebay_api_data as any; return !ebayData?.listing_reference?.referenceItems?.length })
    if (allTranslated && needsSM) {
      console.log('🔄 自動トリガー: SM分析開始')
      hasTriggeredSM.current = true
      onShowToast(`${products.length}件の商品をSM分析中...`, 'success')
      onSMAnalyze()
    }
  }, [products])

  const reset = () => { hasTriggeredTranslation.current = false; hasTriggeredSM.current = false }
  return { reset }
}
