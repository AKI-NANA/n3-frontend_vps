// app/tools/editing/components/sm-competitor-selection-modal.tsx
/**
 * SM分析後の競合選択モーダル
 * 
 * フロー:
 * 1. SM分析結果（ebay_api_data.browse_result.items）を表示
 * 2. 人間が適切な競合商品を選択
 * 3. 選択した商品の詳細を取得
 * 4. AIデータ強化へ進む
 */
'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  X, Search, ExternalLink, CheckCircle2, AlertCircle, 
  Star, Users, MapPin, DollarSign, Package, ArrowRight,
  Filter, SortAsc, SortDesc, Loader2, Info, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '../types/product'

interface SMCompetitorSelectionModalProps {
  product: Product
  onClose: () => void
  onSelect: (selectedItem: CompetitorItem, itemDetails?: ItemDetails) => void
  onSkip: () => void // 詳細取得をスキップしてAI処理へ
}

interface CompetitorItem {
  itemId: string
  title: string
  price: {
    value: string
    currency: string
  }
  image?: {
    imageUrl: string
  }
  seller?: {
    username: string
    feedbackScore?: number
    feedbackPercentage?: string
  }
  itemLocation?: {
    country: string
    city?: string
  }
  condition?: string
  conditionId?: string
  itemWebUrl?: string
  matchLevel?: number
  matchReason?: string
  isRecommended?: boolean
  // Browse APIから追加
  categories?: Array<{ categoryId: string; categoryName: string }>
  itemSpecifics?: Record<string, string>
}

interface ItemDetails {
  itemId: string
  title: string
  itemSpecifics: Record<string, string>
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  shippingOptions?: any[]
  categoryId?: string
  categoryName?: string
}

type SortField = 'price' | 'matchLevel' | 'feedbackScore' | 'country'
type SortOrder = 'asc' | 'desc'

export function SMCompetitorSelectionModal({
  product,
  onClose,
  onSelect,
  onSkip
}: SMCompetitorSelectionModalProps) {
  const [items, setItems] = useState<CompetitorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<CompetitorItem | null>(null)
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('matchLevel')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [filterJpOnly, setFilterJpOnly] = useState(false)
  const [filterRecommendedOnly, setFilterRecommendedOnly] = useState(false)

  // SM分析結果を取得
  useEffect(() => {
    loadBrowseResult()
  }, [product.id])

  const loadBrowseResult = async () => {
    setLoading(true)
    setError(null)

    try {
      // ebay_api_data.browse_result.items から取得
      const browseResult = product.ebay_api_data?.browse_result
      
      if (!browseResult || !browseResult.items || browseResult.items.length === 0) {
        // SM分析がまだ実行されていない場合
        setError('SM分析結果がありません。先にSM分析を実行してください。')
        setItems([])
      } else {
        setItems(browseResult.items)
      }
    } catch (err: any) {
      setError(err.message || 'データ取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // フィルタリング＆ソート
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items]

    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(item => 
        item.title?.toLowerCase().includes(query)
      )
    }

    // 日本セラーフィルター
    if (filterJpOnly) {
      result = result.filter(item => 
        item.itemLocation?.country === 'JP'
      )
    }

    // 推奨のみフィルター
    if (filterRecommendedOnly) {
      result = result.filter(item => item.isRecommended)
    }

    // ソート
    result.sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'price':
          aVal = parseFloat(a.price?.value || '999999')
          bVal = parseFloat(b.price?.value || '999999')
          break
        case 'matchLevel':
          aVal = a.matchLevel || 999
          bVal = b.matchLevel || 999
          break
        case 'feedbackScore':
          aVal = a.seller?.feedbackScore || 0
          bVal = b.seller?.feedbackScore || 0
          break
        case 'country':
          aVal = a.itemLocation?.country === 'JP' ? 0 : 1
          bVal = b.itemLocation?.country === 'JP' ? 0 : 1
          break
        default:
          aVal = 0
          bVal = 0
      }

      if (sortOrder === 'asc') {
        return aVal - bVal
      } else {
        return bVal - aVal
      }
    })

    return result
  }, [items, searchQuery, sortField, sortOrder, filterJpOnly, filterRecommendedOnly])

  // 詳細取得（Trading API → Browse API の順で試す）
  const handleFetchDetails = async () => {
    if (!selectedItem) return

    setFetchingDetails(true)
    setError(null)

    let itemDetails: any = null
    let dataSource = 'none'

    try {
      // 1. まずTrading APIを試す（より詳細な情報が取れる可能性）
      console.log('🔍 Trading API で詳細取得を試行...')
      try {
        const tradingResponse = await fetch('/api/ebay/get-item-details-trading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: selectedItem.itemId })
        })
        const tradingData = await tradingResponse.json()
        
        if (tradingData.success && tradingData.itemDetails) {
          console.log('✅ Trading API 成功')
          itemDetails = tradingData.itemDetails
          dataSource = 'trading_api'
        }
      } catch (tradingErr) {
        console.log('⚠️ Trading API 失敗、Browse APIにフォールバック')
      }

      // 2. Trading APIが失敗した場合、Browse APIを試す
      if (!itemDetails) {
        console.log('🔍 Browse API で詳細取得...')
        const browseResponse = await fetch('/api/ebay/get-item-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: selectedItem.itemId })
        })
        const browseData = await browseResponse.json()
        
        if (browseData.success && browseData.itemDetails) {
          console.log('✅ Browse API 成功')
          itemDetails = browseData.itemDetails
          dataSource = 'browse_api'
        }
      }

      // 3. 詳細が取得できた場合、DBに保存
      if (itemDetails) {
        console.log('💾 競合データをDBに保存...')
        try {
          const saveResponse = await fetch('/api/products/save-competitor-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              competitorData: {
                itemId: selectedItem.itemId,
                title: selectedItem.title,
                itemSpecifics: itemDetails.itemSpecifics || {},
                weight: itemDetails.weight,
                dimensions: itemDetails.dimensions,
                categoryId: itemDetails.categoryId,
                categoryName: itemDetails.categoryName,
                brand: itemDetails.brand,
                model: itemDetails.model,
                countryOfManufacture: itemDetails.countryOfManufacture,
                price: parseFloat(selectedItem.price?.value || '0'),
                currency: selectedItem.price?.currency || 'USD'
              },
              overwrite: false // 既存データを上書きしない
            })
          })
          const saveData = await saveResponse.json()
          
          if (saveData.success) {
            console.log('✅ 競合データ保存成功:', saveData.savedFields)
          } else {
            console.warn('⚠️ 競合データ保存失敗:', saveData.error)
          }
        } catch (saveErr) {
          console.warn('⚠️ 競合データ保存エラー:', saveErr)
        }

        // 詳細付きで選択完了
        itemDetails.dataSource = dataSource
        onSelect(selectedItem, itemDetails)
      } else {
        // 詳細取得に完全に失敗した場合
        throw new Error('詳細取得に失敗しました')
      }
    } catch (err: any) {
      // エラーでも選択を許可（詳細なしで続行）
      console.error('詳細取得エラー:', err)
      const proceed = confirm(`詳細取得に失敗しました: ${err.message}\n\n詳細なしで続行しますか？`)
      if (proceed) {
        onSelect(selectedItem, undefined)
      }
    } finally {
      setFetchingDetails(false)
    }
  }

  // 精度レベルのラベル
  const getMatchLevelLabel = (level?: number) => {
    switch (level) {
      case 1: return { label: '完全一致', color: 'bg-green-500', textColor: 'text-green-700' }
      case 2: return { label: '高精度', color: 'bg-blue-500', textColor: 'text-blue-700' }
      case 3: return { label: '中精度', color: 'bg-yellow-500', textColor: 'text-yellow-700' }
      default: return { label: '低精度', color: 'bg-gray-400', textColor: 'text-gray-600' }
    }
  }

  // 統計情報
  const stats = useMemo(() => {
    const jpCount = items.filter(i => i.itemLocation?.country === 'JP').length
    const recommendedCount = items.filter(i => i.isRecommended).length
    const prices = items.map(i => parseFloat(i.price?.value || '0')).filter(p => p > 0)
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0

    return {
      total: items.length,
      jpCount,
      recommendedCount,
      avgPrice,
      minPrice
    }
  }, [items])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-cyan-600">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-lg font-semibold text-white">競合商品を選択</h2>
              <p className="text-xs text-blue-100">
                Item Specificsの参照元として最適な商品を選んでください
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 商品情報バー */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b">
          <div className="flex items-center gap-4">
            {product.primary_image_url && (
              <img 
                src={product.primary_image_url} 
                alt="" 
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.english_title || product.title}</p>
              <p className="text-xs text-gray-500">
                ¥{product.price_jpy?.toLocaleString()} | 
                カテゴリ: {product.ebay_category_id || '未設定'}
              </p>
            </div>
            <div className="text-right text-xs">
              <p className="text-gray-500">SM分析日時</p>
              <p className="font-mono">
                {product.ebay_api_data?.browse_result?.searchedAt 
                  ? new Date(product.ebay_api_data.browse_result.searchedAt).toLocaleString('ja-JP')
                  : '未実行'
                }
              </p>
            </div>
          </div>
        </div>

        {/* 統計バー */}
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span>検索結果: <strong>{stats.total}件</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>日本セラー: <strong>{stats.jpCount}件</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-600" />
            <span>推奨: <strong>{stats.recommendedCount}件</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span>最安: <strong>${stats.minPrice.toFixed(2)}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <span>平均: <strong>${stats.avgPrice.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* フィルター＆ソート */}
        <div className="px-4 py-2 border-b flex items-center gap-4 flex-wrap">
          {/* 検索 */}
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

          {/* フィルター */}
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

          {/* ソート */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="matchLevel">精度順</option>
              <option value="price">価格順</option>
              <option value="feedbackScore">評価順</option>
              <option value="country">国順</option>
            </select>
            <button
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>

          {/* 再読み込み */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadBrowseResult}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            更新
          </Button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">SM分析結果を読み込み中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium mb-2">エラー</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button variant="outline" onClick={onSkip}>
                スキップしてAI処理へ進む
              </Button>
            </div>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-2">該当する商品がありません</p>
              <p className="text-sm text-gray-500 mb-4">フィルター条件を変更してみてください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedItems.map((item) => {
                const isSelected = selectedItem?.itemId === item.itemId
                const matchInfo = getMatchLevelLabel(item.matchLevel)

                return (
                  <div
                    key={item.itemId}
                    onClick={() => setSelectedItem(item)}
                    className={`
                      border rounded-lg p-3 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                  >
                    {/* 画像＆タイトル */}
                    <div className="flex gap-3 mb-2">
                      {item.image?.imageUrl ? (
                        <img 
                          src={item.image.imageUrl} 
                          alt="" 
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2 mb-1">{item.title}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${matchInfo.color} text-white`}>
                            {matchInfo.label}
                          </span>
                          {item.isRecommended && (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 詳細情報 */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">価格:</span>
                        <span className="font-semibold text-green-600">
                          ${parseFloat(item.price?.value || '0').toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">出品地:</span>
                        <span className={item.itemLocation?.country === 'JP' ? 'text-red-600 font-medium' : ''}>
                          {item.itemLocation?.country || '不明'}
                          {item.itemLocation?.city && ` (${item.itemLocation.city})`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">セラー:</span>
                        <span>
                          {item.seller?.username || '不明'}
                          {item.seller?.feedbackScore && (
                            <span className="text-yellow-600 ml-1">
                              ({item.seller.feedbackScore})
                            </span>
                          )}
                        </span>
                      </div>
                      {item.matchReason && (
                        <div className="mt-1 pt-1 border-t">
                          <span className="text-gray-500">一致項目: </span>
                          <span className={matchInfo.textColor}>{item.matchReason}</span>
                        </div>
                      )}
                    </div>

                    {/* アクション */}
                    <div className="mt-2 pt-2 border-t flex justify-between items-center">
                      {isSelected ? (
                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
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
                        eBayで見る
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
                ? `「${selectedItem.title?.slice(0, 30)}...」を選択中`
                : '商品を選択してください'
              }
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onSkip}>
              スキップ（AI処理へ）
            </Button>
            <Button
              onClick={handleFetchDetails}
              disabled={!selectedItem || fetchingDetails}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {fetchingDetails ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  詳細取得中...
                </>
              ) : (
                <>
                  詳細を取得して次へ
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
