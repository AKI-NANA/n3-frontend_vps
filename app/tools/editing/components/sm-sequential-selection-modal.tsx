// app/tools/editing/components/sm-sequential-selection-modal.tsx
/**
 * SM連続選択モーダル
 * 
 * SM分析結果から競合商品を連続で選択するためのモーダル
 * ワンクリックで次の商品に移動し、効率的に競合選択を完了できる
 * 
 * フロー:
 * 1. SM分析が実行済みで、競合未選択の商品一覧を表示
 * 2. 各商品に対して、SM分析結果から競合を選択
 * 3. 選択後、自動的に次の商品へ進む
 * 4. すべて完了したら閉じる
 */
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle,
  Search, ExternalLink, Star, Users, MapPin, DollarSign, 
  Package, Loader2, SkipForward, Check, Info, Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '../types/product'

interface SMSequentialSelectionModalProps {
  /** SM分析済みで競合未選択の商品リスト */
  products: Product[]
  /** 閉じる */
  onClose: () => void
  /** 競合選択完了（商品ID → 選択した競合データ） */
  onComplete: (selections: Map<string, CompetitorSelection>) => void
  /** 商品データ更新時のコールバック */
  onProductUpdate?: (productId: string, updates: Partial<Product>) => void
}

interface CompetitorItem {
  itemId: string
  title: string
  price: { value: string; currency: string }
  image?: { imageUrl: string }
  seller?: { username: string; feedbackScore?: number }
  itemLocation?: { country: string; city?: string }
  condition?: string
  conditionId?: string
  itemWebUrl?: string
  matchLevel?: number
  matchReason?: string
  isRecommended?: boolean
  itemSpecifics?: Record<string, string>
}

interface CompetitorSelection {
  itemId: string
  title: string
  price: number
  currency: string
  condition?: string
  itemSpecifics?: Record<string, string>
  skipped?: boolean
}

export function SMSequentialSelectionModal({
  products,
  onClose,
  onComplete,
  onProductUpdate
}: SMSequentialSelectionModalProps) {
  // 現在のインデックス
  const [currentIndex, setCurrentIndex] = useState(0)
  // 選択結果マップ
  const [selections, setSelections] = useState<Map<string, CompetitorSelection>>(new Map())
  // 現在選択中のアイテム
  const [selectedItem, setSelectedItem] = useState<CompetitorItem | null>(null)
  // 詳細取得中フラグ
  const [fetchingDetails, setFetchingDetails] = useState(false)
  // フィルター: 日本のみ
  const [filterJpOnly, setFilterJpOnly] = useState(false)
  // フィルター: 推奨のみ
  const [filterRecommendedOnly, setFilterRecommendedOnly] = useState(false)
  // 検索クエリ
  const [searchQuery, setSearchQuery] = useState('')

  // 現在の商品
  const currentProduct = products[currentIndex] || null

  // 現在の商品のSM分析結果
  const competitorItems: CompetitorItem[] = useMemo(() => {
    if (!currentProduct) return []
    
    const browseResult = currentProduct.ebay_api_data?.browse_result
    const listingReference = currentProduct.ebay_api_data?.listing_reference
    
    const browseItems = browseResult?.items || []
    const referenceItems = listingReference?.referenceItems || []
    
    // 重複を除外して統合
    const existingIds = new Set(browseItems.map((item: any) => item.itemId))
    const additionalItems = referenceItems
      .filter((item: any) => !existingIds.has(item.itemId))
      .map((item: any) => ({
        itemId: item.itemId,
        title: item.title,
        price: typeof item.price === 'object' ? item.price : { value: String(item.price || '0'), currency: 'USD' },
        image: item.image ? { imageUrl: item.image } : undefined,
        condition: item.condition || item.conditionNormalized,
        seller: typeof item.seller === 'string' ? { username: item.seller } : item.seller,
        itemLocation: item.itemLocation || { country: 'Unknown' },
        itemSpecifics: item.itemSpecifics || {},
        itemWebUrl: item.itemWebUrl,
      }))
    
    return [...browseItems, ...additionalItems]
  }, [currentProduct])

  // フィルタリング
  const filteredItems = useMemo(() => {
    let result = [...competitorItems]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(item => item.title?.toLowerCase().includes(query))
    }
    
    if (filterJpOnly) {
      result = result.filter(item => item.itemLocation?.country === 'JP')
    }
    
    if (filterRecommendedOnly) {
      result = result.filter(item => item.isRecommended)
    }
    
    // 精度順でソート
    result.sort((a, b) => (a.matchLevel || 999) - (b.matchLevel || 999))
    
    return result
  }, [competitorItems, searchQuery, filterJpOnly, filterRecommendedOnly])

  // 進捗状況
  const progress = useMemo(() => {
    const completed = selections.size
    const total = products.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }, [selections.size, products.length])

  // 次へ移動
  const goToNext = useCallback(() => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedItem(null)
      setSearchQuery('')
    }
  }, [currentIndex, products.length])

  // 前へ移動
  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setSelectedItem(null)
      setSearchQuery('')
    }
  }, [currentIndex])

  // 競合を選択して保存
  const handleSelectCompetitor = useCallback(async () => {
    if (!selectedItem || !currentProduct) return
    
    setFetchingDetails(true)
    
    try {
      // 詳細取得（Trading API → Browse API）
      let itemDetails: any = null
      
      // Trading API試行
      try {
        const tradingRes = await fetch('/api/ebay/get-item-details-trading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: selectedItem.itemId })
        })
        const tradingData = await tradingRes.json()
        if (tradingData.success && tradingData.itemDetails) {
          itemDetails = tradingData.itemDetails
        }
      } catch (e) {
        console.log('Trading API失敗、Browse APIにフォールバック')
      }
      
      // Browse API試行
      if (!itemDetails) {
        const browseRes = await fetch('/api/ebay/get-item-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: selectedItem.itemId })
        })
        const browseData = await browseRes.json()
        if (browseData.success && browseData.itemDetails) {
          itemDetails = browseData.itemDetails
        }
      }
      
      // 競合データをDBに保存
      const saveRes = await fetch('/api/products/save-competitor-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentProduct.id,
          competitorData: {
            itemId: selectedItem.itemId,
            title: selectedItem.title,
            itemSpecifics: itemDetails?.itemSpecifics || selectedItem.itemSpecifics || {},
            weight: itemDetails?.weight,
            dimensions: itemDetails?.dimensions,
            categoryId: itemDetails?.categoryId,
            categoryName: itemDetails?.categoryName,
            brand: itemDetails?.brand,
            model: itemDetails?.model,
            countryOfManufacture: itemDetails?.countryOfManufacture,
            price: parseFloat(selectedItem.price?.value || '0'),
            currency: selectedItem.price?.currency || 'USD'
          },
          overwrite: false
        })
      })
      
      const saveData = await saveRes.json()
      
      // 選択結果を保存
      const selection: CompetitorSelection = {
        itemId: selectedItem.itemId,
        title: selectedItem.title,
        price: parseFloat(selectedItem.price?.value || '0'),
        currency: selectedItem.price?.currency || 'USD',
        condition: selectedItem.condition,
        itemSpecifics: itemDetails?.itemSpecifics || selectedItem.itemSpecifics,
      }
      
      setSelections(prev => {
        const next = new Map(prev)
        next.set(String(currentProduct.id), selection)
        return next
      })
      
      // 親に通知（DBに存在するカラムを使用）
      // 🔥 v2.1: sm_selected_id はDBに存在しない、sm_reference_item_id を使用
      if (onProductUpdate) {
        onProductUpdate(String(currentProduct.id), {
          sm_reference_item_id: selectedItem.itemId,
          // sm_lowest_price や sm_average_price は save-competitor-data APIで更新済み
        } as any)
      }
      
      // 次の商品へ
      goToNext()
      
    } catch (error: any) {
      console.error('競合選択エラー:', error)
      // エラーでも次へ進めるようにする
      const proceed = confirm(`詳細取得に失敗しました: ${error.message}\n\n選択なしで次へ進みますか？`)
      if (proceed) {
        goToNext()
      }
    } finally {
      setFetchingDetails(false)
    }
  }, [selectedItem, currentProduct, goToNext, onProductUpdate])

  // スキップ
  const handleSkip = useCallback(() => {
    if (!currentProduct) return
    
    // スキップとして記録
    setSelections(prev => {
      const next = new Map(prev)
      next.set(String(currentProduct.id), {
        itemId: '',
        title: '',
        price: 0,
        currency: 'USD',
        skipped: true
      })
      return next
    })
    
    goToNext()
  }, [currentProduct, goToNext])

  // 完了
  const handleComplete = useCallback(() => {
    onComplete(selections)
    onClose()
  }, [selections, onComplete, onClose])

  // 精度レベルのラベル
  const getMatchLevelLabel = (level?: number) => {
    switch (level) {
      case 1: return { label: '完全一致', color: 'bg-green-500' }
      case 2: return { label: '高精度', color: 'bg-blue-500' }
      case 3: return { label: '中精度', color: 'bg-yellow-500' }
      default: return { label: '低精度', color: 'bg-gray-400' }
    }
  }

  // 現在の商品が既に選択済みかチェック
  const currentSelection = currentProduct ? selections.get(String(currentProduct.id)) : null

  if (products.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">対象商品がありません</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            SM分析済みで競合未選択の商品がありません。
          </p>
          <Button onClick={onClose}>閉じる</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-lg font-semibold text-white">SM連続選択モード</h2>
              <p className="text-xs text-purple-100">
                {progress.completed}/{progress.total}件完了 ({progress.percentage}%)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* プログレスバー */}
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
            <div className="flex gap-1">
              {products.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx < currentIndex ? 'bg-green-500' :
                    idx === currentIndex ? 'bg-blue-500 scale-125' :
                    'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 現在の商品情報 */}
        {currentProduct && (
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b">
            <div className="flex items-center gap-4">
              {/* ナビゲーション */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {/* 商品情報 */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {currentProduct.primary_image_url ? (
                  <img 
                    src={currentProduct.primary_image_url} 
                    alt="" 
                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    <span className="text-blue-600 mr-2">[{currentIndex + 1}/{products.length}]</span>
                    {currentProduct.english_title || currentProduct.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    SKU: {currentProduct.sku} | 
                    ¥{currentProduct.price_jpy?.toLocaleString()} |
                    SM結果: {competitorItems.length}件
                  </p>
                </div>
              </div>
              
              {/* 選択状態表示 */}
              {currentSelection && (
                <div className={`px-3 py-1 rounded text-xs font-medium ${
                  currentSelection.skipped 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {currentSelection.skipped ? 'スキップ済み' : '✓ 選択済み'}
                </div>
              )}
              
              {/* ナビゲーション */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentIndex === products.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* フィルター */}
        <div className="px-4 py-2 border-b flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タイトルで検索..."
              className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg"
            />
          </div>
          
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filterJpOnly}
              onChange={(e) => setFilterJpOnly(e.target.checked)}
              className="rounded"
            />
            <MapPin className="w-4 h-4 text-red-600" />
            日本のみ
          </label>
          
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={filterRecommendedOnly}
              onChange={(e) => setFilterRecommendedOnly(e.target.checked)}
              className="rounded"
            />
            <Star className="w-4 h-4 text-yellow-600" />
            推奨のみ
          </label>
          
          <div className="text-sm text-gray-500">
            {filteredItems.length}/{competitorItems.length}件表示
          </div>
        </div>

        {/* 競合リスト */}
        <div className="flex-1 overflow-y-auto p-4">
          {competitorItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
              <p className="text-gray-600 font-medium mb-2">SM分析結果がありません</p>
              <p className="text-sm text-gray-500 mb-4">
                この商品にはSM分析結果がないか、まだ実行されていません。
              </p>
              <Button variant="outline" onClick={handleSkip}>
                <SkipForward className="w-4 h-4 mr-2" />
                スキップして次へ
              </Button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-2">該当する商品がありません</p>
              <p className="text-sm text-gray-500">フィルター条件を変更してみてください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.itemId === item.itemId
                const matchInfo = getMatchLevelLabel(item.matchLevel)
                const itemSpecificsCount = Object.keys(item.itemSpecifics || {}).length
                
                return (
                  <div
                    key={item.itemId}
                    onClick={() => setSelectedItem(item)}
                    className={`
                      border rounded-lg p-3 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                  >
                    {/* 画像＆タイトル */}
                    <div className="flex gap-2 mb-2">
                      {item.image?.imageUrl ? (
                        <img 
                          src={item.image.imageUrl} 
                          alt="" 
                          className="w-14 h-14 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2 mb-1">{item.title}</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${matchInfo.color} text-white`}>
                            {matchInfo.label}
                          </span>
                          {item.isRecommended && (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 詳細情報 */}
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">価格:</span>
                        <span className="font-semibold text-green-600">
                          ${parseFloat(item.price?.value || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Condition:</span>
                        <span className={`font-medium ${
                          (item.condition || '').toLowerCase().includes('new') 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {item.condition || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Item Specifics:</span>
                        <span className={`font-medium ${
                          itemSpecificsCount >= 5 ? 'text-green-600' :
                          itemSpecificsCount > 0 ? 'text-yellow-600' : 'text-gray-400'
                        }`}>
                          {itemSpecificsCount}件
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">出品地:</span>
                        <span className={item.itemLocation?.country === 'JP' ? 'text-red-600 font-medium' : ''}>
                          {item.itemLocation?.country || '不明'}
                        </span>
                      </div>
                    </div>

                    {/* 選択表示 */}
                    <div className="mt-2 pt-2 border-t flex justify-between items-center">
                      {isSelected ? (
                        <span className="text-xs text-purple-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          選択中
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">クリックで選択</span>
                      )}
                      <a
                        href={item.itemWebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        eBay
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>
              {selectedItem 
                ? `「${selectedItem.title?.slice(0, 25)}...」を選択中`
                : '競合商品を選択してください'
              }
            </span>
          </div>
          
          <div className="flex gap-2">
            {/* スキップボタン */}
            <Button variant="outline" onClick={handleSkip}>
              <SkipForward className="w-4 h-4 mr-2" />
              スキップ
            </Button>
            
            {/* 選択＆次へボタン */}
            <Button
              onClick={handleSelectCompetitor}
              disabled={!selectedItem || fetchingDetails}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {fetchingDetails ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  選択＆次へ
                </>
              )}
            </Button>
            
            {/* 完了ボタン（最後の商品の場合） */}
            {currentIndex === products.length - 1 && (
              <Button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                完了 ({selections.size}件)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
