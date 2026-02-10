// app/tools/editing/hooks/use-taxonomy-operations.ts
import { useState, useCallback } from 'react'
import type { Product } from '../types/product'

interface UseTaxonomyOperationsProps {
  products: Product[]
  selectedIds: Set<string>
  onShowToast: (message: string, type?: 'success' | 'error') => void
  onLoadProducts: () => Promise<void>
  updateLocalProduct: (id: string, updates: Partial<Product>) => void
}

export function useTaxonomyOperations({
  products,
  selectedIds,
  onShowToast,
  onLoadProducts,
  updateLocalProduct
}: UseTaxonomyOperationsProps) {
  const [htsLoading, setHtsLoading] = useState(false)

  // HTS取得ハンドラー - AIでHTSコードを推定
  const handleHTSFetch = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    const selectedProducts = products.filter(p => selectedIds.has(String(p.id)))
    setHtsLoading(true)
    onShowToast(`${selectedProducts.length}件のHTSコードを推定中...`, 'success')

    try {
      let updatedCount = 0
      let uncertainCount = 0

      for (const product of selectedProducts) {
        const response = await fetch('/api/hts/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            title: product.title || product.english_title,
            categoryName: product.category_name || product.ebay_api_data?.category_name,
            categoryId: product.category_id || product.ebay_api_data?.category_id,
            material: product.material,
            description: product.description
          })
        })

        if (!response.ok) continue

        const data = await response.json()

        if (data.success && data.htsCode) {
          updateLocalProduct(product.id, {
            hts_code: data.htsCode,
            hts_description: data.htsDescription || '',
            hts_duty_rate: data.dutyRate || null,
            hts_confidence: data.confidence || 'uncertain'
          })

          // データベースに保存
          await fetch('/api/products/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: product.id,
              updates: {
                hts_code: data.htsCode,
                hts_description: data.htsDescription || '',
                hts_duty_rate: data.dutyRate || null,
                hts_confidence: data.confidence || 'uncertain'
              }
            })
          })

          if (data.confidence === 'uncertain' || data.confidence === 'low') {
            uncertainCount++
          }
          updatedCount++
        } else {
          updateLocalProduct(product.id, {
            hts_code: '要確認',
            hts_confidence: 'uncertain'
          })
          uncertainCount++
        }
      }

      if (updatedCount > 0) {
        const message = uncertainCount > 0
          ? `${updatedCount}件更新（うち${uncertainCount}件は要確認）`
          : `${updatedCount}件のHTSコードを更新しました`
        onShowToast(message, 'success')
        await onLoadProducts()
      } else {
        onShowToast('HTSコードを推定できませんでした', 'error')
      }
    } catch (error: any) {
      onShowToast(error.message || 'HTS取得中にエラーが発生しました', 'error')
    } finally {
      setHtsLoading(false)
    }
  }, [selectedIds, products, onShowToast, onLoadProducts, updateLocalProduct])

  // 関税率自動取得ハンドラー
  const handleDutyRatesLookup = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    const selectedArray = Array.from(selectedIds)
    onShowToast(`${selectedArray.length}件の関税率を検索中...`, 'success')

    try {
      const response = await fetch('/api/hts/lookup-duty-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedArray })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        onShowToast(`✅ ${data.updated}件の関税率を更新しました`, 'success')
        await onLoadProducts()
      } else {
        throw new Error(data.error || '関税率検索に失敗しました')
      }
    } catch (error: any) {
      onShowToast(error.message || '関税率検索中にエラーが発生しました', 'error')
    }
  }, [selectedIds, onShowToast, onLoadProducts])

  // 原産国取得ハンドラー（関税率も同時取得）
  const handleOriginCountryFetch = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    onShowToast('原産国情報を取得中...', 'success')

    try {
      const selectedArray = Array.from(selectedIds)
      let updatedCount = 0

      for (const productId of selectedArray) {
        const product = products.find(p => String(p.id) === productId)
        if (!product) continue

        let originCountry = product.origin_country

        if (!originCountry) {
          // eBay APIデータから取得
          let referenceItems = product.ebay_api_data?.listing_reference?.referenceItems || []
          
          // scraped_dataからも確認（Yahoo商品の場合）
          if (referenceItems.length === 0 && product.scraped_data?.reference_items) {
            referenceItems = product.scraped_data.reference_items
          }
          
          if (referenceItems.length === 0) {
            console.log(`⏭️ ${productId}: 参照商品なし - Yahoo商品の場合はeBay検索が必要`)
            
            // データベースに「参照データなし」を記録
            updateLocalProduct(productId, {
              origin_country: '参照データなし'
            })
            
            await fetch('/api/products/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: productId,
                updates: { origin_country: '参照データなし' }
              })
            })
            
            continue
          }

          const countries = referenceItems
            .map((item: any) => item.itemLocation?.country)
            .filter((c: string) => c)

          if (countries.length === 0) continue

          const countryCount: Record<string, number> = {}
          countries.forEach((c: string) => {
            countryCount[c] = (countryCount[c] || 0) + 1
          })

          originCountry = Object.entries(countryCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0]
        }

        if (originCountry) {
          let dutyRate = 0
          try {
            const dutyResponse = await fetch('/api/hts/lookup-duty-rates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productIds: [productId],
                onlyOriginCountry: true
              })
            })

            if (dutyResponse.ok) {
              const dutyData = await dutyResponse.json()
              if (dutyData.success && dutyData.results?.[0]?.updates?.origin_country_duty_rate != null) {
                dutyRate = dutyData.results[0].updates.origin_country_duty_rate
              }
            }
          } catch (dutyError) {
            console.warn('関税率取得スキップ:', dutyError)
          }

          updateLocalProduct(productId, {
            origin_country: originCountry,
            origin_country_duty_rate: dutyRate
          })

          const response = await fetch('/api/products/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: productId,
              updates: {
                origin_country: originCountry,
                origin_country_duty_rate: dutyRate
              }
            })
          })

          if (response.ok) {
            updatedCount++
          }
        }
      }

      if (updatedCount > 0) {
        onShowToast(`${updatedCount}件の原産国・関税率を更新しました`, 'success')
        await onLoadProducts()
      } else {
        onShowToast('更新する原産国データがありませんでした', 'error')
      }
    } catch (error: any) {
      onShowToast(error.message || '原産国取得に失敗しました', 'error')
    }
  }, [selectedIds, products, onShowToast, onLoadProducts, updateLocalProduct])

  // 素材取得ハンドラー（関税率も同時取得）
  const handleMaterialFetch = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    onShowToast('素材情報を取得中...', 'success')

    try {
      const selectedArray = Array.from(selectedIds)
      let updatedCount = 0
      let skippedCount = 0
      let noDataCount = 0

      for (const productId of selectedArray) {
        const product = products.find(p => String(p.id) === productId)
        if (!product) continue
        
        // 既に素材がある場合はスキップ
        if (product.material) {
          console.log(`⏭️ ${productId}: 素材既存 (${product.material})`)
          skippedCount++
          continue
        }

        // eBay APIデータから取得
        let referenceItems = product.ebay_api_data?.listing_reference?.referenceItems || []
        
        // scraped_dataからも確認（Yahoo商品の場合）
        if (referenceItems.length === 0 && product.scraped_data?.reference_items) {
          referenceItems = product.scraped_data.reference_items
        }
        
        // 参照商品がない場合は「データなし」として記録
        if (referenceItems.length === 0) {
          console.log(`⏭️ ${productId}: 参照商品なし - Yahoo商品の場合はeBay検索が必要`)
          noDataCount++
          
          // データベースに「参照データなし」を記録
          updateLocalProduct(productId, {
            material: '参照データなし'
          })
          
          await fetch('/api/products/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: productId,
              updates: { material: '参照データなし' }
            })
          })
          
          continue
        }

        const materials = referenceItems
          .map((item: any) => item.itemSpecifics?.Material)
          .filter((m: string) => m)

        if (materials.length === 0) continue

        const materialCount: Record<string, number> = {}
        materials.forEach((m: string) => {
          materialCount[m] = (materialCount[m] || 0) + 1
        })

        const mostCommonMaterial = Object.entries(materialCount)
          .sort((a, b) => b[1] - a[1])[0]?.[0]

        if (mostCommonMaterial) {
          let materialDutyRate = 0
          const materialLower = mostCommonMaterial.toLowerCase()

          if (materialLower.includes('aluminum') || materialLower.includes('アルミ')) {
            materialDutyRate = 10
          } else if (materialLower.includes('steel') || materialLower.includes('stainless') || materialLower.includes('鉄') || materialLower.includes('ステンレス')) {
            materialDutyRate = 25
          }

          updateLocalProduct(productId, {
            material: mostCommonMaterial,
            material_duty_rate: materialDutyRate
          })

          const response = await fetch('/api/products/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: productId,
              updates: {
                material: mostCommonMaterial,
                material_duty_rate: materialDutyRate
              }
            })
          })

          if (response.ok) {
            updatedCount++
          }
        }
      }

      if (updatedCount > 0 || noDataCount > 0) {
        let message = ''
        if (updatedCount > 0) {
          message += `${updatedCount}件更新`
        }
        if (noDataCount > 0) {
          if (message) message += '、'
          message += `${noDataCount}件は参照データなし`
        }
        if (skippedCount > 0) {
          if (message) message += '、'
          message += `${skippedCount}件はスキップ`
        }
        onShowToast(message, updatedCount > 0 ? 'success' : 'error')
        await onLoadProducts()
      } else {
        onShowToast(`更新する素材データがありませんでした（${skippedCount}件は既存）`, 'error')
      }
    } catch (error: any) {
      onShowToast(error.message || '素材取得に失敗しました', 'error')
    }
  }, [selectedIds, products, onShowToast, onLoadProducts, updateLocalProduct])

  return {
    htsLoading,
    handleHTSFetch,
    handleDutyRatesLookup,
    handleOriginCountryFetch,
    handleMaterialFetch
  }
}
