// app/tools/research-hub/hooks/use-batch-process.ts
'use client'

import { useState, useCallback } from 'react'

export function useBatchProcess(onComplete?: () => void) {
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState('')

  // バッチ分析実行
  const runBatchAnalysis = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return { success: false, error: 'IDが指定されていません' }
    
    setProcessing(true)
    setCurrentStep('分析中...')
    
    try {
      const response = await fetch('/api/research/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })
      
      const data = await response.json()
      
      if (data.success) {
        onComplete?.()
        return { success: true, count: data.count }
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('分析エラー:', err)
      return { success: false, error: err.message }
    } finally {
      setProcessing(false)
      setCurrentStep('')
    }
  }, [onComplete])

  // 全処理実行
  const runAllProcesses = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return { success: false, error: 'IDが指定されていません' }
    
    setProcessing(true)
    
    try {
      // ステップ1: 分析
      setCurrentStep('1/3: データ分析中...')
      await runBatchAnalysis(ids)
      
      // ステップ2: スコアリング
      setCurrentStep('2/3: スコア計算中...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // ステップ3: 完了
      setCurrentStep('3/3: 完了')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onComplete?.()
      return { success: true, count: ids.length }
    } catch (err: any) {
      console.error('処理エラー:', err)
      return { success: false, error: err.message }
    } finally {
      setProcessing(false)
      setCurrentStep('')
    }
  }, [runBatchAnalysis, onComplete])

  return {
    processing,
    currentStep,
    runBatchAnalysis,
    runAllProcesses
  }
}
