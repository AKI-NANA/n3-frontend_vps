// app/tools/research-table/hooks/use-shipping-calculation.ts
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { CalculationResult, CalculateRoutesResponse } from '@/types/research'

interface UseShippingCalculationOptions {
  targetMargin?: number
  onProgress?: (current: number, total: number) => void
  onComplete?: (result: CalculateRoutesResponse) => void
}

export function useShippingCalculation() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [progress, setProgress] = useState(0)

  const calculateRoutes = useCallback(async (
    itemIds: string[],
    options?: UseShippingCalculationOptions
  ): Promise<CalculateRoutesResponse> => {
    if (itemIds.length === 0) {
      toast.error('商品が選択されていません')
      return { success: false, calculated: 0, failed: 0, results: [] }
    }

    setIsCalculating(true)
    setProgress(0)

    try {
      // バッチ処理（50件ずつ）
      const batchSize = 50
      const batches: string[][] = []
      for (let i = 0; i < itemIds.length; i += batchSize) {
        batches.push(itemIds.slice(i, i + batchSize))
      }

      const allResults: CalculationResult[] = []
      let totalCalculated = 0
      let totalFailed = 0

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]

        const response = await fetch('/api/research/calculate-routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemIds: batch,
            targetMargin: options?.targetMargin || 15
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || '坂路計算に失敗しました')
        }

        const result: CalculateRoutesResponse = await response.json()
        allResults.push(...result.results)
        totalCalculated += result.calculated
        totalFailed += result.failed

        // 進捗更新
        const currentProgress = Math.round(((i + 1) / batches.length) * 100)
        setProgress(currentProgress)
        options?.onProgress?.(i + 1, batches.length)
      }

      const finalResult: CalculateRoutesResponse = {
        success: true,
        calculated: totalCalculated,
        failed: totalFailed,
        results: allResults
      }

      toast.success(`坂路計算完了: ${totalCalculated}件成功, ${totalFailed}件失敗`)
      options?.onComplete?.(finalResult)

      return finalResult

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '坂路計算に失敗しました'
      console.error('坂路計算エラー:', error)
      toast.error(errorMessage)
      return { success: false, calculated: 0, failed: 0, results: [] }
    } finally {
      setIsCalculating(false)
      setProgress(0)
    }
  }, [])

  return {
    calculateRoutes,
    isCalculating,
    progress
  }
}
