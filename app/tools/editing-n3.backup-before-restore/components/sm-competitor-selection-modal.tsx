// app/tools/editing/components/sm-competitor-selection-modal.tsx
/**
 * SM分析後の競合選択モーダル v2.0
 * 
 * 🔥 Gemini指針に基づく改善:
 * - 背景: bg-black/80 + backdrop-blur-md（集中力向上）
 * - 再検索機能: キーワード変更して再検索可能
 * - 販売実績表示: Finding APIデータを表示
 * - 自動継続: 選択完了後に次フェーズを自動キック
 * 
 * フロー:
 * 1. SM分析結果（browse_result + finding_result）を表示
 * 2. 人間が適切な競合商品を選択
 * 3. 選択した商品の詳細を取得
 * 4. onSelectWithContinue で次フェーズを自動キック
 */
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  X, Search, ExternalLink, CheckCircle2, AlertCircle, 
  Star, Users, MapPin, DollarSign, Package, ArrowRight,
  Filter, SortAsc, SortDesc, Loader2, Info, RefreshCw,
  TrendingUp, ShoppingCart, BarChart2, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '../types/product'

interface SMCompetitorSelectionModalProps {
  product: Product
  onClose: () => void
  onSelect: (selectedItem: CompetitorItem, itemDetails?: ItemDetails) => void
  onSkip: () => void
  // 🔥 新規: 自動継続コールバック
  onSelectWithContinue?: (selectedItem: CompetitorItem, itemDetails?: ItemDetails) => Promise<void>
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
  matchScore?: number
  isRecommended?: boolean
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

// 🔥 販売実績データ
interface SalesData {
  soldLast30Days: number
  soldLast90Days: number
  avgSoldPrice: number
  recommendedPrice: number
  demandScore: number
  confidenceLevel: 'high' | 'mid' | 'low'
}

type SortField = 'price' | 'matchLevel' | 'feedbackScore' | 'country'
type SortOrder = 'asc' | 'desc'

export function SMCompetitorSelectionModal({
  product,
  onClose,
  onSelect,
  onSkip,
  onSelectWithContinue
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
  
  // 🔥 再検索用ステート
  const [reSearchKeyword, setReSearchKeyword] = useState('')
  const [reSearching, setReSearching] = useState(false)
  
  // 🔥 販売実績データ
  const [salesData, setSalesData] = useState<SalesData | null>(null)

  // SM分析結果を取得
  useEffect(() => {
    loadBrowseResult()
  }, [product.id])

  const loadBrowseResult = async () => {
    setLoading(true)
    setError(null)

    try {
      // 🔥 統合SM分析結果から取得
      const smAnalysis = product.ebay_api_data?.sm_analysis
      const browseResult = product.ebay_api_data?.browse_result
      const findingResult = product.ebay_api_data?.finding_result
      const listingReference = product.ebay_api_data?.listing_reference
      
      // 🔥 販売実績データを設定
      if (smAnalysis || findingResult) {
        setSalesData({
          soldLast30Days: smAnalysis?.sold_last_30d || findingResult?.soldLast30Days || product.sm_sold_last_30d || 0,
          soldLast90Days: smAnalysis?.sold_last_90d || findingResult?.soldLast90Days || product.sm_sold_last_90d || 0,
          avgSoldPrice: smAnalysis?.avg_sold_price || findingResult?.averageSoldPrice || product.sm_avg_sold_price || 0,
          recommendedPrice: smAnalysis?.recommended_price || product.sm_recommended_price || 0,
          demandScore: smAnalysis?.demand_score || product.sm_demand_score || 0,
          confidenceLevel: smAnalysis?.confidence_level || product.sm_confidence_level || 'low'
        })
      }
      
      const browseItems = browseResult?.items || smAnalysis?.browse_items || []
      const referenceItems = listingReference?.referenceItems || []
      
      // 重複を除外して統合
      const existingIds = new Set(browseItems.map((item: any) => item.itemId))
      const additionalItems = referenceItems
        .filter((item: any) => !existingIds.has(item.itemId))
        .map((item: any) => ({
          ...item,
          itemId: item.itemId,
          title: item.title,
          price: typeof item.price === 'object' ? item.price : { value: String(item.price || '0'), currency: 'USD' },
          image: item.image ? { imageUrl: item.image } : undefined,
          condition: item.condition || item.conditionNormalized,
          seller: typeof item.seller === 'string' ? { username: item.seller } : item.seller,
          itemLocation: item.itemLocation || { country: 'Unknown' },
          itemSpecifics: item.itemSpecifics || {},
          itemWebUrl: item.itemWebUrl,
          isFromReference: true,
        }))
      
      const allItems = [...browseItems, ...additionalItems]
      
      if (allItems.length === 0) {
        setError('SM分析結果がありません。再検索してください。')
        setItems([])
        // 🔥 再検索用にデフォルトキーワードを設定
        setReSearchKeyword(product.english_title || product.title_en || product.title || '')
      } else {
        console.log(`✅ SMデータ統合: browse=${browseItems.length}件, reference=${additionalItems.length}件, total=${allItems.length}件`)
        setItems(allItems)
      }
    } catch (err: any) {
      setError(err.message || 'データ取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 🔥 再検索機能
  const handleReSearch = useCallback(async () => {
    if (!reSearchKeyword.trim()) {
      alert('検索キーワードを入力してください')
      return
    }
    
    setReSearching(true)
    setError(null)
    
    try {
      console.log(`🔄 再検索開始: "${reSearchKeyword}"`)
      
      const response = await fetch('/api/ebay/sm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ebayTitle: reSearchKeyword,
          ebayCategoryId: product.ebay_category_id || product.ebay_api_data?.category_id,
          condition: product.condition_name || 'New'
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ 再検索完了: 競合${data.competitor_count}件, 過去90日${data.sold_last_90d}件`)
        
        // 販売実績データを更新
        setSalesData({
          soldLast30Days: data.sold_last_30d || 0,
          soldLast90Days: data.sold_last_90d || 0,
          avgSoldPrice: data.avg_sold_price || 0,
          recommendedPrice: data.recommended_price || 0,
          demandScore: data.demand_score || 0,
          confidenceLevel: data.confidence_level || 'low'
        })
        
        // 競合商品リストを更新
        const newItems = data.browse_items || []
        if (newItems.length > 0) {
          setItems(newItems)
          setError(null)
        } else {
          setError('検索結果が0件でした。キーワードを変えて再試行してください。')
        }
      } else {
        throw new Error(data.error || '再検索に失敗しました')
      }
    } catch (err: any) {
      console.error('❌ 再検索エラー:', err)
      setError(`再検索エラー: ${err.message}`)
    } finally {
      setReSearching(false)
    }
  }, [reSearchKeyword, product])

  // フィルタリング＆ソート
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(item => 
        item.title?.toLowerCase().includes(query)
      )
    }

    if (filterJpOnly) {
      result = result.filter(item => 
        item.itemLocation?.country === 'JP'
      )
    }

    if (filterRecommendedOnly) {
      result = result.filter(item => item.isRecommended)
    }

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

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    return result
  }, [items, searchQuery, sortField, sortOrder, filterJpOnly, filterRecommendedOnly])

  // 詳細取得＆自動継続
  const handleFetchDetails = async () => {
    if (!selectedItem) return

    setFetchingDetails(true)
    setError(null)

    let itemDetails: any = null
    let dataSource = 'none'

    try {
      // Trading API → Browse API の順で試す
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

      if (itemDetails) {
        console.log('💾 競合データをDBに保存...')
        try {
          await fetch('/api/products/save-competitor-data', {
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
              overwrite: false
            })
          })
          console.log('✅ 競合データ保存成功')
        } catch (saveErr) {
          console.warn('⚠️ 競合データ保存エラー:', saveErr)
        }

        itemDetails.dataSource = dataSource
        
        // 🔥 自動継続コールバックがあれば実行
        if (onSelectWithContinue) {
          console.log('🚀 自動継続: 次フェーズへ...')
          await onSelectWithContinue(selectedItem, itemDetails)
        } else {
          onSelect(selectedItem, itemDetails)
        }
      } else {
        throw new Error('詳細取得に失敗しました')
      }
    } catch (err: any) {
      console.error('詳細取得エラー:', err)
      const proceed = confirm(`詳細取得に失敗しました: ${err.message}\n\n詳細なしで続行しますか？`)
      if (proceed) {
        if (onSelectWithContinue) {
          await onSelectWithContinue(selectedItem, undefined)
        } else {
          onSelect(selectedItem, undefined)
        }
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

  // 売れ筋スコアの色
  const getDemandScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 50) return 'text-blue-600 bg-blue-100'
    if (score >= 20) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  // 統計情報
  const stats = useMemo(() => {
    const jpCount = items.filter(i => i.itemLocation?.country === 'JP').length
    const recommendedCount = items.filter(i => i.isRecommended).length
    const prices = items.map(i => parseFloat(i.price?.value || '0')).filter(p => p > 0)
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0

    return { total: items.length, jpCount, recommendedCount, avgPrice, minPrice }
  }, [items])

  return (
    // 🔥 背景改善: bg-black/80 + backdrop-blur-md
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-lg font-semibold text-white">競合商品を選択</h2>
              <p className="text-xs text-blue-100">
                Item Specificsの参照元として最適な商品を選んでください
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors">
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
                {product.sm_analyzed_at 
                  ? new Date(product.sm_analyzed_at).toLocaleString('ja-JP')
                  : product.ebay_api_data?.browse_result?.searchedAt 
                    ? new Date(product.ebay_api_data.browse_result.searchedAt).toLocaleString('ja-JP')
                    : '未実行'
                }
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 販売実績パネル（Finding APIデータ） */}
        {salesData && (salesData.soldLast90Days > 0 || salesData.demandScore > 0) && (
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600">過去90日:</span>
                <span className="font-bold text-purple-700">{salesData.soldLast90Days}件</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">平均販売価格:</span>
                <span className="font-bold text-green-700">${salesData.avgSoldPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">推奨価格:</span>
                <span className="font-bold text-blue-700">${salesData.recommendedPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-orange-600" />
                <span className="text-gray-600">売れ筋:</span>
                <span className={`font-bold px-2 py-0.5 rounded ${getDemandScoreColor(salesData.demandScore)}`}>
                  {salesData.demandScore}/100
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-600">信頼度:</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  salesData.confidenceLevel === 'high' ? 'bg-green-100 text-green-700' :
                  salesData.confidenceLevel === 'mid' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {salesData.confidenceLevel === 'high' ? '高' : salesData.confidenceLevel === 'mid' ? '中' : '低'}
                </span>
              </div>
            </div>
          </div>
        )}

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

        {/* 🔥 再検索パネル */}
        <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border-b">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200 flex-shrink-0">再検索:</span>
            <input
              type="text"
              value={reSearchKeyword}
              onChange={(e) => setReSearchKeyword(e.target.value)}
              placeholder="検索キーワードを入力..."
              className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              onKeyDown={(e) => e.key === 'Enter' && handleReSearch()}
            />
            <Button
              onClick={handleReSearch}
              disabled={reSearching || !reSearchKeyword.trim()}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {reSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  検索中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-1" />
                  再検索
                </>
              )}
            </Button>
          </div>
        </div>

        {/* フィルター＆ソート */}
        <div className="px-4 py-2 border-b flex items-center gap-4 flex-wrap bg-gray-50 dark:bg-gray-900">
          {/* 検索 */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="結果内を検索..."
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
              className="p-1 hover:bg-gray-200 rounded"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>

          {/* 更新 */}
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
              <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
              <p className="text-yellow-600 font-medium mb-2">検索結果がありません</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <p className="text-xs text-gray-500 mb-4">上部の再検索機能でキーワードを変えて検索してください</p>
              <Button variant="outline" onClick={onSkip}>
                スキップしてAI処理へ進む
              </Button>
            </div>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-2">該当する商品がありません</p>
              <p className="text-sm text-gray-500 mb-4">フィルター条件を変更するか、上部で再検索してください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                        ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50 dark:bg-blue-900/30 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700'
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${matchInfo.color} text-white`}>
                            {matchInfo.label}
                          </span>
                          {item.isRecommended && (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          )}
                          {item.matchScore && (
                            <span className="text-xs text-gray-500">
                              {Math.round(item.matchScore * 100)}%
                            </span>
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
                          (item.itemSpecifics && Object.keys(item.itemSpecifics).length >= 5)
                            ? 'text-green-600'
                            : (item.itemSpecifics && Object.keys(item.itemSpecifics).length > 0)
                              ? 'text-yellow-600'
                              : 'text-gray-400'
                        }`}>
                          {item.itemSpecifics ? `${Object.keys(item.itemSpecifics).length}件` : '0件'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">出品地:</span>
                        <span className={item.itemLocation?.country === 'JP' ? 'text-red-600 font-medium' : ''}>
                          {item.itemLocation?.country || '不明'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">セラー:</span>
                        <span>
                          {item.seller?.username?.slice(0, 15) || '不明'}
                          {item.seller?.feedbackScore && (
                            <span className="text-yellow-600 ml-1">
                              ({item.seller.feedbackScore})
                            </span>
                          )}
                        </span>
                      </div>
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
                ? `「${selectedItem.title?.slice(0, 40)}...」を選択中`
                : '商品を選択してください'
              }
            </span>
          </div>
          <div className="flex gap-3">
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
                  <Zap className="w-4 h-4 mr-2" />
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
