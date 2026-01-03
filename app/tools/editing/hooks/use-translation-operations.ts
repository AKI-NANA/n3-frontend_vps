// app/tools/editing/hooks/use-translation-operations.ts
import { useState, useCallback } from 'react'
import type { Product } from '../types/product'

interface UseTranslationOperationsProps {
  products: Product[]
  selectedIds: Set<string>
  onShowToast: (message: string, type?: 'success' | 'error') => void
  onLoadProducts: () => Promise<void>
  updateLocalProduct: (id: string, updates: Partial<Product>) => void
}

export function useTranslationOperations({
  products,
  selectedIds,
  onShowToast,
  onLoadProducts,
  updateLocalProduct
}: UseTranslationOperationsProps) {
  const [translating, setTranslating] = useState(false)

  // 翻訳ハンドラー（改善版：並列処理 + 進捗表示）
  const handleTranslate = useCallback(async () => {
    if (selectedIds.size === 0) {
      onShowToast('商品を選択してください', 'error')
      return
    }

    const selectedArray = Array.from(selectedIds)
    const targetProducts = products.filter(p => selectedIds.has(String(p.id)))

    // 翻訳が必要な商品のみフィルタリング
    const productsNeedingTranslation = targetProducts.filter(p =>
      !p.english_title || !p.english_description
    )

    if (productsNeedingTranslation.length === 0) {
      onShowToast(`${targetProducts.length}件は既に翻訳済みです`, 'error')
      return
    }

    console.log(`🌍 翻訳開始: ${productsNeedingTranslation.length}件（${selectedArray.length}件中）`)
    setTranslating(true)
    onShowToast(`${productsNeedingTranslation.length}件の商品を翻訳中...`, 'success')

    try {
      let translatedCount = 0
      let failedCount = 0
      const batchSize = 5 // 5件ずつ並列処理

      // 5件ずつバッチ処理
      for (let i = 0; i < productsNeedingTranslation.length; i += batchSize) {
        const batch = productsNeedingTranslation.slice(i, i + batchSize)

        // 進捗表示
        const progress = Math.min(i + batchSize, productsNeedingTranslation.length)
        onShowToast(`翻訳中... ${progress}/${productsNeedingTranslation.length}件`, 'success')

        // 並列実行
        const batchPromises = batch.map(async (product) => {
          try {
            // 翻訳API呼び出し
            const response = await fetch('/api/tools/translate-product', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: product.id,
                title: product.title,
                description: product.description,
                condition: product.condition_name
              })
            })

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
              console.log(`  ✅ ${product.id}: 翻訳完了`)

              // ローカル状態を即座に更新（テーブルに反映）
              updateLocalProduct(String(product.id), {
                english_title: result.translations.title,
                english_description: result.translations.description,
                english_condition: result.translations.condition
              })

              return { success: true, productId: product.id }
            } else {
              throw new Error(result.error || '翻訳失敗')
            }
          } catch (error: any) {
            console.error(`  ❌ ${product.id}: ${error.message}`)
            return { success: false, productId: product.id, error: error.message }
          }
        })

        // バッチの結果を集計
        const batchResults = await Promise.all(batchPromises)
        const successCount = batchResults.filter(r => r.success).length
        const failCount = batchResults.filter(r => !r.success).length

        translatedCount += successCount
        failedCount += failCount

        console.log(`📊 バッチ${Math.floor(i / batchSize) + 1}完了: 成功${successCount}件、失敗${failCount}件`)
      }

      // データベースから最新データを再読み込み
      await onLoadProducts()

      // 最終結果表示
      if (translatedCount > 0) {
        const message = failedCount > 0
          ? `✅ ${translatedCount}件の翻訳が完了しました（失敗: ${failedCount}件）`
          : `✅ ${translatedCount}件の翻訳が完了しました`
        onShowToast(message, 'success')
      } else {
        onShowToast('翻訳に失敗しました', 'error')
      }

      console.log(`🎉 翻訳完了: 成功${translatedCount}件、失敗${failedCount}件`)

    } catch (error: any) {
      console.error('Translation error:', error)
      onShowToast(error.message || '翻訳中にエラーが発生しました', 'error')
    } finally {
      setTranslating(false)
    }
  }, [selectedIds, products, onShowToast, onLoadProducts, updateLocalProduct])

  return {
    translating,
    handleTranslate
  }
}
