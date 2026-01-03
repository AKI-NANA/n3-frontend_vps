// app/tools/research-hub/hooks/use-research-data.ts
'use client'

import { useState, useCallback } from 'react'
import type { ResearchItem, ResearchStats, FilterOptions, SortOptions } from '../types/research'

export function useResearchData() {
  const [items, setItems] = useState<ResearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set())
  
  // ページネーション
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)
  
  // フィルター・ソート
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sort, setSort] = useState<SortOptions>({ field: 'created_at', direction: 'desc' })
  
  // 統計
  const [stats, setStats] = useState<ResearchStats>({
    total: 0,
    new: 0,
    analyzing: 0,
    approved: 0,
    rejected: 0,
    promoted: 0,
    watching: 0,
    alert: 0,
    highScore: 0,
    avgProfit: 0,
    avgMargin: 0
  })

  // データ読み込み
  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sort_field: sort.field as string,
        sort_direction: sort.direction,
        ...filters
      })
      
      const response = await fetch(`/api/research/list?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setItems(result.data || [])
        setTotal(result.count || 0)
        setStats(result.stats || stats)
      } else {
        throw new Error(result.error || 'データ取得に失敗しました')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('データ取得エラー:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, filters, sort])

  // ローカルアイテム更新
  const updateLocalItem = useCallback((id: string, updates: Partial<ResearchItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
    setModifiedIds(prev => new Set(prev).add(id))
  }, [])

  // 全変更を保存
  const saveAllModified = useCallback(async () => {
    if (modifiedIds.size === 0) return
    
    setLoading(true)
    try {
      const itemsToSave = items.filter(item => modifiedIds.has(item.id))
      
      const response = await fetch('/api/research/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToSave })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setModifiedIds(new Set())
        return { success: true, count: itemsToSave.length }
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('保存エラー:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [items, modifiedIds])

  // 選択アイテムを削除
  const deleteSelected = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/research/items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadItems()
        return { success: true, count: ids.length }
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('削除エラー:', err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [loadItems])

  return {
    items,
    loading,
    error,
    modifiedIds,
    total,
    pageSize,
    currentPage,
    filters,
    sort,
    stats,
    setPageSize,
    setCurrentPage,
    setFilters,
    setSort,
    loadItems,
    updateLocalItem,
    saveAllModified,
    deleteSelected
  }
}
