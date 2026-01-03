// app/tools/editing/hooks/use-active-listings.ts
import { useState, useMemo, useCallback } from 'react'
import type { Product } from '../types/product'

interface UseActiveListingsProps {
  products: Product[]
  onShowToast: (message: string, type?: 'success' | 'error') => void
  onLoadProducts: () => Promise<void>
}

export function useActiveListings({ 
  products, 
  onShowToast,
  onLoadProducts 
}: UseActiveListingsProps) {
  // 状態管理
  const [accountFilter, setAccountFilter] = useState<'all' | 'MJT' | 'GREEN'>('all')
  const [isSyncing, setIsSyncing] = useState(false)

  // 出品中商品のフィルタリング
  const activeListings = useMemo(() => {
    return products.filter(p => (p as any).listing_status === 'active')
  }, [products])

  // アカウント別フィルタリング
  const filteredListings = useMemo(() => {
    if (accountFilter === 'all') return activeListings
    return activeListings.filter(p => (p as any).ebay_account === accountFilter)
  }, [activeListings, accountFilter])

  // 統計情報の計算
  const stats = useMemo(() => {
    const mjtListings = activeListings.filter(p => (p as any).ebay_account === 'MJT')
    const greenListings = activeListings.filter(p => (p as any).ebay_account === 'GREEN')
    const manualListings = activeListings.filter(p => !(p as any).ebay_account)

    const calculateTotal = (items: Product[]) => {
      return items.reduce((sum, p) => sum + (p.price || 0), 0)
    }

    return {
      total: activeListings.length,
      mjt: {
        count: mjtListings.length,
        total: calculateTotal(mjtListings)
      },
      green: {
        count: greenListings.length,
        total: calculateTotal(greenListings)
      },
      manual: {
        count: manualListings.length,
        total: calculateTotal(manualListings)
      }
    }
  }, [activeListings])

  // バリエーション統計
  const variationStats = useMemo(() => {
    const parent = activeListings.filter(p => (p as any).variation_type === 'parent').length
    const member = activeListings.filter(p => (p as any).variation_type === 'member').length
    const standalone = activeListings.filter(p => !(p as any).variation_type).length
    const candidate = activeListings.filter(p => (p as any).variation_candidate === true).length

    return { parent, member, standalone, candidate }
  }, [activeListings])

  // 差分同期ハンドラー
  const handleSync = useCallback(async () => {
    setIsSyncing(true)
    onShowToast('eBayとの差分同期を開始します...', 'success')

    try {
      const response = await fetch('/api/ebay/sync-active-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          listingIds: filteredListings.map(p => p.id) 
        })
      })

      if (!response.ok) {
        throw new Error('同期に失敗しました')
      }

      const data = await response.json()
      onShowToast(`✅ ${data.updated}件の商品を同期しました`, 'success')
      await onLoadProducts()
    } catch (error: any) {
      onShowToast(error.message || '同期中にエラーが発生しました', 'error')
    } finally {
      setIsSyncing(false)
    }
  }, [filteredListings, onShowToast, onLoadProducts])

  // メルカリ同期ハンドラー
  const handleMercariSync = useCallback(async () => {
    onShowToast('メルカリ同期機能は開発中です', 'error')
  }, [onShowToast])

  // 削除ハンドラー
  const handleDelete = useCallback(async (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      onShowToast('削除する商品を選択してください', 'error')
      return
    }

    if (!confirm(`${selectedIds.length}件の出品を削除しますか？`)) {
      return
    }

    try {
      const response = await fetch('/api/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })

      if (!response.ok) {
        throw new Error('削除に失敗しました')
      }

      onShowToast(`✅ ${selectedIds.length}件を削除しました`, 'success')
      await onLoadProducts()
    } catch (error: any) {
      onShowToast(error.message || '削除中にエラーが発生しました', 'error')
    }
  }, [onShowToast, onLoadProducts])

  // 更新ハンドラー
  const handleRefresh = useCallback(async () => {
    onShowToast('データを再読み込み中...', 'success')
    await onLoadProducts()
    onShowToast('✅ データを更新しました', 'success')
  }, [onShowToast, onLoadProducts])

  return {
    // データ
    filteredListings,
    stats,
    variationStats,
    
    // 状態
    accountFilter,
    isSyncing,
    
    // アクション
    setAccountFilter,
    handleSync,
    handleMercariSync,
    handleDelete,
    handleRefresh
  }
}
