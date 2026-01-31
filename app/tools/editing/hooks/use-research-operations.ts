// app/tools/editing/hooks/use-research-operations.ts
/**
 * useResearchOperations - 競合分析・詳細取得フック
 * 
 * ③詳細ボタンの動作:
 * 1. Mirrorタブで選択された競合商品がある場合 → その詳細を取得
 * 2. 商品がチェック選択されている場合 → SM分析結果から自動的に競合商品を選択
 * 3. Item Specifics、Condition等をDBに自動保存
 * 4. 画面をリロードして反映
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

/**
 * 単一のitemIdから詳細を取得（Trading API → Browse API の順で試す）
 */
async function fetchItemDetails(itemId: string): Promise<any> {
  let itemDetails: any = null

  // 1. まずTrading APIを試す（より詳細な情報が取れる可能性）
  try {
    console.log(`🔍 Trading API で詳細取得を試行: ${itemId}`)
    const tradingResponse = await fetch('/api/ebay/get-item-details-trading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId })
    })
    const tradingData = await tradingResponse.json()
    
    if (tradingData.success && tradingData.itemDetails) {
      console.log('✅ Trading API 成功')
      itemDetails = { ...tradingData.itemDetails, dataSource: 'trading_api' }
      return itemDetails
    }
  } catch (tradingErr) {
    console.log('⚠️ Trading API 失敗、Browse APIにフォールバック')
  }

  // 2. Trading APIが失敗した場合、Browse APIを試す
  try {
    console.log(`🔍 Browse API で詳細取得: ${itemId}`)
    const browseResponse = await fetch('/api/ebay/get-item-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId })
    })
    const browseData = await browseResponse.json()
    
    if (browseData.success && browseData.itemDetails) {
      console.log('✅ Browse API 成功')
      itemDetails = { ...browseData.itemDetails, dataSource: 'browse_api' }
      return itemDetails
    }
  } catch (browseErr) {
    console.log('❌ Browse API も失敗')
  }

  return null
}

/**
 * 競合データをDBに保存
 */
async function saveCompetitorData(productId: string | number, competitorData: any): Promise<boolean> {
  try {
    const saveResponse = await fetch('/api/products/save-competitor-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        competitorData,
        overwrite: false
      })
    })
    const saveData = await saveResponse.json()
    
    if (saveData.success) {
      console.log('✅ 競合データ保存成功:', saveData.savedFields)
      return true
    } else {
      console.warn('⚠️ 競合データ保存失敗:', saveData.error)
      return false
    }
  } catch (saveErr) {
    console.warn('⚠️ 競合データ保存エラー:', saveErr)
    return false
  }
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
  const handleBatchFetchDetails = useCallback(async () => {
    // 1. まずMirrorタブで選択された競合商品をチェック
    const allMirrorItems = getAllSelected()
    
    // 現在チェックされている商品に関連するMirror選択のみを使用
    const selectedProductIdSet = new Set(Array.from(selectedIds).map(id => String(id)))
    const selectedMirrorItems = selectedIds.size > 0
      ? allMirrorItems.filter(item => selectedProductIdSet.has(String(item.productId)))
      : allMirrorItems
    
    console.log('🔍 handleBatchFetchDetails 呼び出し:')
    console.log('  - allMirrorItems (localStorage):', allMirrorItems.length, '件')
    console.log('  - selectedMirrorItems (フィルター後):', selectedMirrorItems.length, '件')
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

    let successCount = 0
    let failedCount = 0
    let totalItemSpecifics = 0

    try {
      // 商品ごとにグループ化
      const groupedByProduct: Record<string, { itemIds: string[], product: any }> = {}
      selectedItems.forEach(item => {
        if (!groupedByProduct[item.productId]) {
          const product = products.find(p => String(p.id) === String(item.productId))
          groupedByProduct[item.productId] = { itemIds: [], product }
        }
        groupedByProduct[item.productId].itemIds.push(item.itemId)
      })

      // 各商品の詳細を順次取得
      for (const [productId, { itemIds, product }] of Object.entries(groupedByProduct)) {
        for (const itemId of itemIds) {
          try {
            // 詳細を取得
            const itemDetails = await fetchItemDetails(itemId)
            
            if (itemDetails) {
              // DBに保存
              const saved = await saveCompetitorData(productId, {
                itemId,
                title: itemDetails.title,
                itemSpecifics: itemDetails.itemSpecifics || {},
                weight: itemDetails.weight,
                dimensions: itemDetails.dimensions,
                categoryId: itemDetails.categoryId,
                categoryName: itemDetails.categoryName,
                brand: itemDetails.brand,
                model: itemDetails.model,
                countryOfManufacture: itemDetails.countryOfManufacture,
                condition: itemDetails.condition,
                conditionId: itemDetails.conditionId,
                price: itemDetails.price?.value || 0,
                currency: itemDetails.price?.currency || 'USD',
                image: itemDetails.image,
                dataSource: itemDetails.dataSource
              })

              if (saved) {
                successCount++
                const specsCount = Object.keys(itemDetails.itemSpecifics || {}).length
                totalItemSpecifics += specsCount
                console.log(`✅ ${productId}: ${specsCount}件のItem Specifics取得`)
              } else {
                failedCount++
              }
            } else {
              failedCount++
              console.log(`❌ ${productId}: 詳細取得失敗`)
            }
          } catch (err: any) {
            failedCount++
            console.error(`❌ ${productId}: ${err.message}`)
          }
        }
      }

      // 選択をクリア
      clearAll()

      // 成功メッセージ
      if (failedCount > 0) {
        onShowToast(`✅ 詳細取得完了: 成功${successCount}件、失敗${failedCount}件`, 'success')
      } else if (totalItemSpecifics > 0) {
        onShowToast(`✅ 詳細取得完了！Item Specifics ${totalItemSpecifics}件を自動保存しました`, 'success')
      } else {
        onShowToast(`✅ 詳細取得完了！${successCount}件の商品詳細をDBに保存しました`, 'success')
      }

      // 画面をリロードして最新データを表示
      await onLoadProducts()

    } catch (error: any) {
      console.error('Batch fetch error:', error)
      onShowToast(error.message || '詳細取得中にエラーが発生しました', 'error')
    } finally {
      setResearching(false)
    }
  }, [products, onShowToast, onLoadProducts, clearAll])

  // 商品選択からSM分析結果を使用して詳細取得
  const fetchDetailsFromProductSelection = useCallback(async () => {
    const selectedProducts = products.filter(p => selectedIds.has(String(p.id)))

    console.log('📦 商品選択から競合情報を自動取得:')
    console.log('  - 選択商品数:', selectedProducts.length)

    // SM分析結果から競合商品のitemIdを抽出
    const itemsToFetch: { productId: string; itemId: string; product: any }[] = []

    for (const product of selectedProducts) {
      const smSelectedItem = (product as any).sm_selected_item
      const ebayData = (product as any).ebay_api_data || {}
      const referenceItems = ebayData.listing_reference?.referenceItems || []
      
      let itemId: string | null = null

      if (smSelectedItem?.itemId) {
        itemId = smSelectedItem.itemId
        console.log(`  - ${product.id}: SM選択済み商品を使用 (${itemId})`)
      } else if (referenceItems.length > 0) {
        // SM分析結果からItem Specificsが多い商品を選択
        const sortedItems = [...referenceItems].sort((a: any, b: any) => {
          const aCount = a.itemSpecificsCount || (a.itemSpecifics ? Object.keys(a.itemSpecifics).length : 0)
          const bCount = b.itemSpecificsCount || (b.itemSpecifics ? Object.keys(b.itemSpecifics).length : 0)
          return bCount - aCount
        })
        itemId = sortedItems[0].itemId
        console.log(`  - ${product.id}: SM分析結果から自動選択 (${itemId})`)
      } else {
        console.log(`  - ${product.id}: 競合商品なし（SM分析未実行?）`)
      }

      if (itemId) {
        itemsToFetch.push({
          productId: String(product.id),
          itemId,
          product
        })
      }
    }

    if (itemsToFetch.length === 0) {
      onShowToast('選択した商品にSM分析結果がありません。先に①SM分析を実行してください。', 'error')
      return
    }

    setResearching(true)
    onShowToast(`${itemsToFetch.length}件の商品詳細を取得します...`, 'success')

    let successCount = 0
    let failedCount = 0
    let totalItemSpecifics = 0

    try {
      for (const { productId, itemId } of itemsToFetch) {
        try {
          const itemDetails = await fetchItemDetails(itemId)
          
          if (itemDetails) {
            const saved = await saveCompetitorData(productId, {
              itemId,
              title: itemDetails.title,
              itemSpecifics: itemDetails.itemSpecifics || {},
              weight: itemDetails.weight,
              dimensions: itemDetails.dimensions,
              categoryId: itemDetails.categoryId,
              categoryName: itemDetails.categoryName,
              brand: itemDetails.brand,
              model: itemDetails.model,
              countryOfManufacture: itemDetails.countryOfManufacture,
              condition: itemDetails.condition,
              conditionId: itemDetails.conditionId,
              price: itemDetails.price?.value || 0,
              currency: itemDetails.price?.currency || 'USD',
              image: itemDetails.image,
              dataSource: itemDetails.dataSource
            })

            if (saved) {
              successCount++
              const specsCount = Object.keys(itemDetails.itemSpecifics || {}).length
              totalItemSpecifics += specsCount
            } else {
              failedCount++
            }
          } else {
            failedCount++
          }
        } catch (err: any) {
          failedCount++
          console.error(`❌ ${productId}: ${err.message}`)
        }
      }

      // 成功メッセージ
      if (failedCount > 0) {
        onShowToast(`✅ 詳細取得完了: 成功${successCount}件、失敗${failedCount}件`, 'success')
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
