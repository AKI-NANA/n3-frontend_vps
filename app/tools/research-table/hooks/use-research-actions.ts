// app/tools/research-table/hooks/use-research-actions.ts
'use client'

import { useCallback } from 'react'
import type { ResearchActionResult } from '../types/research'

export function useResearchActions(onRefresh: () => void) {

  // 承認 → products_master へコピー
  const approveSelected = useCallback(async (ids: string[]): Promise<ResearchActionResult> => {
    try {
      const response = await fetch('/api/research-table/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '承認に失敗しました')
      }

      const data = await response.json()
      return { success: true, count: data.count }

    } catch (error: any) {
      console.error('Approve error:', error)
      return { success: false, error: error.message }
    }
  }, [])

  // 却下
  const rejectSelected = useCallback(async (ids: string[]): Promise<ResearchActionResult> => {
    try {
      const response = await fetch('/api/research-table/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '却下に失敗しました')
      }

      const data = await response.json()
      return { success: true, count: data.count }

    } catch (error: any) {
      console.error('Reject error:', error)
      return { success: false, error: error.message }
    }
  }, [])

  // AI分析実行
  const analyzeSelected = useCallback(async (ids: string[]): Promise<ResearchActionResult> => {
    try {
      const response = await fetch('/api/research-table/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '分析に失敗しました')
      }

      const data = await response.json()
      onRefresh()
      return { success: true, count: data.count }

    } catch (error: any) {
      console.error('Analyze error:', error)
      return { success: false, error: error.message }
    }
  }, [onRefresh])

  // 仕入先探索
  const searchSuppliers = useCallback(async (ids: string[]): Promise<ResearchActionResult> => {
    try {
      const response = await fetch('/api/research-table/supplier-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '仕入先探索に失敗しました')
      }

      const data = await response.json()
      return { success: true, found: data.found }

    } catch (error: any) {
      console.error('Supplier search error:', error)
      return { success: false, error: error.message }
    }
  }, [])

  // 刈り取り登録
  const registerKaritori = useCallback(async (ids: string[]): Promise<ResearchActionResult> => {
    try {
      const response = await fetch('/api/research-table/karitori-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '登録に失敗しました')
      }

      const data = await response.json()
      return { success: true, count: data.count }

    } catch (error: any) {
      console.error('Karitori register error:', error)
      return { success: false, error: error.message }
    }
  }, [])

  return {
    approveSelected,
    rejectSelected,
    analyzeSelected,
    searchSuppliers,
    registerKaritori
  }
}
