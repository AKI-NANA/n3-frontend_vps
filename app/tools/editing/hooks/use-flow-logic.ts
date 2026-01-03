// app/tools/editing/hooks/use-flow-logic.ts
import { useState, useCallback } from 'react'

interface UseFlowLogicProps {
  selectedIds: Set<string>
  onShowToast: (message: string, type?: 'success' | 'error') => void
  onLoadProducts: () => Promise<void>
}

export function useFlowLogic({
  selectedIds,
  onShowToast,
  onLoadProducts
}: UseFlowLogicProps) {
  const [processing, setProcessing] = useState(false)

  // フィルターチェック
  const handleFilterCheck = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    const productIds = Array.from(selectedIds)
    setProcessing(true)
    onShowToast(`${productIds.length}件の商品をフィルターチェック中...`, 'success')

    try {
      const response = await fetch('/api/filter-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ APIエラー:', errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const summary = data.summary || {}
        onShowToast(
          `✅ フィルターチェック完了！\n通過: ${summary.passed || 0}件 / 不合格: ${summary.failed || 0}件`,
          'success'
        )
        await onLoadProducts()
      } else {
        throw new Error(data.error || 'フィルターチェックに失敗しました')
      }
    } catch (error: any) {
      console.error('Filter check error:', error)
      onShowToast(error.message || 'フィルターチェック中にエラーが発生しました', 'error')
    } finally {
      setProcessing(false)
    }
  }, [selectedIds, onShowToast, onLoadProducts])

  // 最終処理チェーン
  const handleFinalProcessChain = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    const selectedArray = Array.from(selectedIds)

    if (!confirm(`${selectedArray.length}件の商品に対して最終処理（送料/利益/HTML/スコア/フィルター）を実行しますか？`)) {
      return
    }

    setProcessing(true)
    onShowToast(`${selectedArray.length}件の最終処理を開始します...`, 'success')

    try {
      const response = await fetch('/api/final-process-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedArray,
          baseUrl: window.location.origin
        })
      })

      if (!response.ok) {
        throw new Error('最終処理に失敗しました')
      }

      const data = await response.json()

      if (data.success) {
        const summary = data.summary
        onShowToast(
          `✅ 最終処理完了！\n通過: ${summary.passed_filter}件 / 不合格: ${summary.failed_filter}件\n\n承認ツールに移動してください。`,
          'success'
        )
        await onLoadProducts()

        // 承認ツールへの自動遷移確認
        if (summary.passed_filter > 0) {
          if (confirm('承認ツールに移動しますか？')) {
            window.location.href = '/tools/approval'
          }
        }
      }
    } catch (error: any) {
      onShowToast(error.message || '最終処理中にエラーが発生しました', 'error')
    } finally {
      setProcessing(false)
    }
  }, [selectedIds, onShowToast, onLoadProducts])

  // Geminiプロンプト生成（AI解析用CSVエクスポート）
  const handleGenerateGeminiPrompt = useCallback(() => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    // Note: この機能は BasicEditTab で直接モーダルを開くため、
    // ここではフラグのみ返す
    return true
  }, [selectedIds, onShowToast])

  return {
    processing,
    handleFilterCheck,
    handleFinalProcessChain,
    handleGenerateGeminiPrompt
  }
}
