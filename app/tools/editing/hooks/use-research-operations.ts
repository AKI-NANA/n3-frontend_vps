// app/tools/editing/hooks/use-research-operations.ts
/**
 * useResearchOperations - 競合分析・詳細取得フック
 * 
 * ③詳細ボタンの動作:
 * 1. Mirrorタブで選択された競合商品がある場合 → その詳細を取得
 * 2. 商品がチェック選択されている場合 → SM分析結果から自動的に競合商品を選択
 * 3. Item Specifics、Condition等をDBに自動保存
 * 4. 画面をリロードして反映
 * 
 * ※ モーダルは開かない（データは自動的に保存される）
 */
import { useState, useCallback } from 'react'
import type { Product } from '../types/product'

interface UseResearchOperationsProps {
  products: Product[]
  selectedIds: Set<string>
  onShowToast: (message: string, type?: 'success' | 'error') => void
  onLoadProducts: () => Promise<void>
  getAllSelected: () => any[]
  clearAll: () => void
}

export function useResearchOperations({
  products,
  selectedIds,
  onShowToast,
  onLoadProducts,
  getAllSelected,
  clearAll,
}: UseResearchOperationsProps) {
  const [researching, setResearching] = useState(false)

  // 一括競合分析
  const handleBulkResearch = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    const productIds = Array.from(selectedIds)
    setResearching(true)
    onShowToast(`${productIds.length}件の商品を競合分析します...`, 'success')

    try {
      const response = await fetch('/api/bulk-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productIds: productIds,
          includeFields: {
            category: true,
            shipping: true,
            research: true,
            sellerMirror: true
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const successCount = data.results.filter((r: any) => r.success).length
        const failCount = data.results.length - successCount

        if (failCount > 0) {
          onShowToast(`✅ 完了: 成功${successCount}件、失敗${failCount}件`, 'success')
        } else {
          onShowToast(`✅ 競合分析完了！${successCount}件の商品を処理しました`, 'success')
        }

        await onLoadProducts()
      } else {
        throw new Error(data.error || '競合分析に失敗しました')
      }
    } catch (error: any) {
      console.error('Bulk research error:', error)
      onShowToast(error.message || '競合分析中にエラーが発生しました', 'error')
    } finally {
      setResearching(false)
    }
  }, [selectedIds, onShowToast, onLoadProducts])

  // SellerMirror詳細一括取得（③詳細ボタン）
  // - 競合商品の詳細情報（Item Specifics, Condition等）を取得
  // - DBに自動保存して画面リロード
  // - モーダルは開かない
  const handleBatchFetchDetails = useCallback(async () => {
    // 1. まずMirrorタブで選択された競合商品をチェック
    const selectedMirrorItems = getAllSelected()
    
    console.log('🔍 handleBatchFetchDetails 呼び出し:')
    console.log('  - selectedMirrorItems:', selectedMirrorItems.length, '件')
    console.log('  - selectedIds (商品選択):', selectedIds.size, '件')

    // 2. Mirrorで選択がある場合はそれを使用
    if (selectedMirrorItems.length > 0) {
      await fetchDetailsFromMirrorSelection(selectedMirrorItems)
      return
    }

    // 3. 商品がチェック選択されている場合、SM分析結果から自動取得
    if (selectedIds.size > 0) {
      await fetchDetailsFromProductSelection()
      return
    }

    // 4. どちらも選択されていない場合
    onShowToast('商品を選択するか、Mirrorタブで競合商品を選択してください。', 'error')
  }, [getAllSelected, selectedIds, products, onShowToast, onLoadProducts, clearAll])

  // Mirrorで選択された競合商品から詳細取得
  const fetchDetailsFromMirrorSelection = useCallback(async (selectedItems: any[]) => {
    setResearching(true)
    onShowToast(`${selectedItems.length}件の詳細情報を取得します...`, 'success')

    try {
      // 商品ごとにグループ化
      const groupedByProduct: Record<string, string[]> = {}
      selectedItems.forEach(item => {
        if (!groupedByProduct[item.productId]) {
          groupedByProduct[item.productId] = []
        }
        groupedByProduct[item.productId].push(item.itemId)
      })

      // 各商品の詳細を並行取得（APIがDBに自動保存）
      const fetchPromises = Object.entries(groupedByProduct).map(async ([productId, itemIds]) => {
        const response = await fetch('/api/sellermirror/batch-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemIds, productId })
        })

        if (!response.ok) {
          throw new Error(`商品ID${productId}の詳細取得失敗`)
        }

        return response.json()
      })

      const results = await Promise.all(fetchPromises)

      const totalSuccess = results.reduce((sum, r) => sum + (r.summary?.success || 0), 0)
      const totalFailed = results.reduce((sum, r) => sum + (r.summary?.failed || 0), 0)
      
      // 取得したItem Specificsの数を集計
      let totalItemSpecifics = 0
      results.forEach(r => {
        if (r.itemSpecificsCount) {
          totalItemSpecifics += r.itemSpecificsCount
        }
      })

      // 選択をクリア
      clearAll()

      // 成功メッセージ
      if (totalFailed > 0) {
        onShowToast(`✅ 詳細取得完了: 成功${totalSuccess}件、失敗${totalFailed}件`, 'success')
      } else if (totalItemSpecifics > 0) {
        onShowToast(`✅ 詳細取得完了！Item Specifics ${totalItemSpecifics}件を自動保存しました`, 'success')
      } else {
        onShowToast(`✅ 詳細取得完了！${totalSuccess}件の商品詳細をDBに保存しました`, 'success')
      }

      // 画面をリロードして最新データを表示
      await onLoadProducts()

    } catch (error: any) {
      console.error('Batch fetch error:', error)
      onShowToast(error.message || '詳細取得中にエラーが発生しました', 'error')
    } finally {
      setResearching(false)
    }
  }, [onShowToast, onLoadProducts, clearAll])

  // 商品選択からSM分析結果を使用して詳細取得
  const fetchDetailsFromProductSelection = useCallback(async () => {
    const selectedProductIds = Array.from(selectedIds)
    const selectedProducts = products.filter(p => selectedIds.has(String(p.id)))

    console.log('📦 商品選択から競合情報を自動取得:')
    console.log('  - 選択商品数:', selectedProducts.length)

    // SM分析結果から競合商品のitemIdを抽出
    const itemsToFetch: { productId: string; itemIds: string[] }[] = []

    for (const product of selectedProducts) {
      // ✅ 修正: sm_selected_itemはトップレベルカラム
      const smSelectedItem = (product as any).sm_selected_item
      
      // SM分析結果から競合商品を取得
      const ebayData = (product as any).ebay_api_data || {}
      const referenceItems = ebayData.listing_reference?.referenceItems || []
      
      let itemIds: string[] = []

      if (smSelectedItem?.itemId) {
        // ✅ 明示的に選択された競合商品がある
        itemIds = [smSelectedItem.itemId]
        console.log(`  - ${product.id}: SM選択済み商品を使用 (${smSelectedItem.itemId})`)
      } else if (referenceItems.length > 0) {
        // SM分析結果からItem Specificsが多い商品を選択
        const sortedItems = [...referenceItems].sort((a: any, b: any) => {
          // Item Specifics件数でソート（降順）
          const aCount = a.itemSpecificsCount || (a.itemSpecifics ? Object.keys(a.itemSpecifics).length : 0)
          const bCount = b.itemSpecificsCount || (b.itemSpecifics ? Object.keys(b.itemSpecifics).length : 0)
          return bCount - aCount
        })
        itemIds = [sortedItems[0].itemId]
        const specsCount = sortedItems[0].itemSpecificsCount || 0
        console.log(`  - ${product.id}: SM分析結果から自動選択 (${itemIds[0]}, Specs: ${specsCount}件)`)
      } else {
        console.log(`  - ${product.id}: 競合商品なし（SM分析未実行?）`)
      }

      if (itemIds.length > 0) {
        itemsToFetch.push({
          productId: String(product.id),
          itemIds
        })
      }
    }

    if (itemsToFetch.length === 0) {
      onShowToast('選択した商品にSM分析結果がありません。先に①SM分析を実行してください。', 'error')
      return
    }

    setResearching(true)
    onShowToast(`${itemsToFetch.length}件の商品詳細を取得します...`, 'success')

    try {
      // 各商品の詳細を並行取得
      const fetchPromises = itemsToFetch.map(async ({ productId, itemIds }) => {
        const response = await fetch('/api/sellermirror/batch-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemIds, productId })
        })

        if (!response.ok) {
          throw new Error(`商品ID${productId}の詳細取得失敗`)
        }

        return response.json()
      })

      const results = await Promise.all(fetchPromises)

      const totalSuccess = results.reduce((sum, r) => sum + (r.summary?.success || 0), 0)
      const totalFailed = results.reduce((sum, r) => sum + (r.summary?.failed || 0), 0)
      
      let totalItemSpecifics = 0
      results.forEach(r => {
        if (r.itemSpecificsCount) {
          totalItemSpecifics += r.itemSpecificsCount
        }
      })

      // 成功メッセージ
      if (totalFailed > 0) {
        onShowToast(`✅ 詳細取得完了: 成功${totalSuccess}件、失敗${totalFailed}件`, 'success')
      } else if (totalItemSpecifics > 0) {
        onShowToast(`✅ Item Specifics ${totalItemSpecifics}件を自動保存しました`, 'success')
      } else {
        onShowToast(`✅ 詳細取得完了！${itemsToFetch.length}件処理`, 'success')
      }

      await onLoadProducts()

    } catch (error: any) {
      console.error('Batch fetch error:', error)
      onShowToast(error.message || '詳細取得中にエラーが発生しました', 'error')
    } finally {
      setResearching(false)
    }
  }, [selectedIds, products, onShowToast, onLoadProducts])

  return {
    researching,
    handleBulkResearch,
    handleBatchFetchDetails,
  }
}
