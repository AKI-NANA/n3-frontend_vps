'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckSquare, Square, ArrowRight, TrendingUp, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { calculateProductScore, DEFAULT_WEIGHTS } from '@/lib/research/scoring-engine'
import type { ResearchProduct } from '../page'

interface ScoringResultsTabProps {
  products: ResearchProduct[]
  onProductsUpdated: (products: ResearchProduct[]) => void
  selectedProducts: string[]
  onToggleSelection: (productId: string) => void
  onToggleSelectAll: (products: ResearchProduct[]) => void
  onMoveToMatching: (productIds: string[]) => void
}

export default function ScoringResultsTab({
  products,
  onProductsUpdated,
  selectedProducts,
  onToggleSelection,
  onToggleSelectAll,
  onMoveToMatching,
}: ScoringResultsTabProps) {
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'score' | 'profit' | 'risk' | 'sales'>('score')
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  // 初回スコアリング実行
  useEffect(() => {
    const unscoreProducts = products.filter(p => !p.totalScore)
    if (unscoreProducts.length > 0) {
      handleAutoScore(unscoreProducts)
    }
  }, [products.length])

  // 自動スコアリング
  const handleAutoScore = async (productsToScore: ResearchProduct[]) => {
    setLoading(true)
    try {
      const updatedProducts: ResearchProduct[] = []

      for (const product of productsToScore) {
        const scoredProduct = await calculateProductScore(
          {
            id: product.id,
            ebayItemId: product.ebayItemId,
            title: product.title,
            titleJP: product.titleJP,
            price: product.price,
            soldCount: product.soldCount,
            competitorCount: product.competitorCount || 0,
            originCountry: 'CN', // デフォルト
          },
          DEFAULT_WEIGHTS,
          product.supplierMatches || []
        )

        updatedProducts.push({
          ...product,
          totalScore: scoredProduct.totalScore,
          profitScore: scoredProduct.scoreBreakdown.profitRateScore,
          demandScore: scoredProduct.scoreBreakdown.salesVolumeScore,
          competitionScore: scoredProduct.scoreBreakdown.competitionScore,
          riskLevel: scoredProduct.riskLevel,
          profitCalculation: scoredProduct.profitCalculation,
        })
      }

      onProductsUpdated(updatedProducts)
      toast.success(`${updatedProducts.length}件の商品をスコアリングしました`)
    } catch (error) {
      console.error('Scoring error:', error)
      toast.error('スコアリングに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 再スコアリング
  const handleRescore = () => {
    handleAutoScore(products)
  }

  // スコアリングへ移動
  const handleMoveToMatching = () => {
    if (selectedProducts.length === 0) {
      toast.error('商品を選択してください')
      return
    }
    onMoveToMatching(selectedProducts)
    toast.success(`${selectedProducts.length}件を仕入れ先マッチングタブへ移動しました`)
  }

  // フィルター&ソート適用
  const filteredAndSortedProducts = products
    .filter(p => {
      if (filterRisk === 'all') return true
      return p.riskLevel === filterRisk
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.totalScore || 0) - (a.totalScore || 0)
        case 'profit':
          return (b.profitCalculation?.profitRate || 0) - (a.profitCalculation?.profitRate || 0)
        case 'risk':
          const riskOrder = { low: 1, medium: 2, high: 3 }
          return riskOrder[a.riskLevel || 'medium'] - riskOrder[b.riskLevel || 'medium']
        case 'sales':
          return b.soldCount - a.soldCount
        default:
          return 0
      }
    })

  // リスクバッジカラー
  const getRiskBadgeVariant = (risk?: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'default'
      case 'medium':
        return 'secondary'
      case 'high':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  // スコアバッジカラー
  const getScoreBadgeColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600'
    if (score >= 80) return 'bg-green-100 text-green-700'
    if (score >= 60) return 'bg-blue-100 text-blue-700'
    if (score >= 40) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="space-y-6">
      {/* コントロールパネル */}
      <Card>
        <CardHeader>
          <CardTitle>スコアリング結果</CardTitle>
          <CardDescription>自動スコアリングによる商品分析結果</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">並び替え</label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'score' | 'profit' | 'risk' | 'sales')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">総合スコア順</SelectItem>
                    <SelectItem value="profit">利益率順</SelectItem>
                    <SelectItem value="risk">リスク順</SelectItem>
                    <SelectItem value="sales">販売数順</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">リスクフィルター</label>
                <Select value={filterRisk} onValueChange={(v) => setFilterRisk(v as 'all' | 'low' | 'medium' | 'high')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="low">低リスクのみ</SelectItem>
                    <SelectItem value="medium">中リスクのみ</SelectItem>
                    <SelectItem value="high">高リスクのみ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRescore} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                再スコアリング
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">平均スコア</div>
                <div className="text-2xl font-bold">
                  {(products.reduce((sum, p) => sum + (p.totalScore || 0), 0) / products.length || 0).toFixed(1)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">平均利益率</div>
                <div className="text-2xl font-bold">
                  {(products.reduce((sum, p) => sum + (p.profitCalculation?.profitRate || 0), 0) / products.length || 0).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">低リスク商品</div>
                <div className="text-2xl font-bold">
                  {products.filter(p => p.riskLevel === 'low').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">高得点商品</div>
                <div className="text-2xl font-bold">
                  {products.filter(p => (p.totalScore || 0) >= 70).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 商品リスト */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>スコアリング済み商品</CardTitle>
              <CardDescription>{filteredAndSortedProducts.length}件の商品</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleSelectAll(filteredAndSortedProducts)}
              >
                {selectedProducts.length === filteredAndSortedProducts.length ? (
                  <CheckSquare className="w-4 h-4 mr-2" />
                ) : (
                  <Square className="w-4 h-4 mr-2" />
                )}
                全選択
              </Button>
              <Button onClick={handleMoveToMatching} disabled={selectedProducts.length === 0}>
                <ArrowRight className="w-4 h-4 mr-2" />
                マッチングへ ({selectedProducts.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
              <p className="text-gray-500">スコアリング中...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {filterRisk !== 'all'
                ? 'フィルター条件に一致する商品がありません'
                : 'データ取得タブから商品を移動してください'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all ${
                    selectedProducts.includes(product.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => onToggleSelection(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* ランク表示 */}
                      <div className="flex flex-col items-center justify-center min-w-[60px]">
                        <div className="text-3xl font-bold text-gray-300">#{index + 1}</div>
                        <Badge className={`${getScoreBadgeColor(product.totalScore)} mt-2`}>
                          {product.totalScore?.toFixed(1) || 'N/A'}
                        </Badge>
                      </div>

                      {/* 商品画像 */}
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}

                      {/* 商品情報 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={product.source === 'ebay' ? 'default' : 'secondary'}>
                                {product.source.toUpperCase()}
                              </Badge>
                              <Badge variant={getRiskBadgeVariant(product.riskLevel)}>
                                {product.riskLevel === 'low' && '低リスク'}
                                {product.riskLevel === 'medium' && '中リスク'}
                                {product.riskLevel === 'high' && '高リスク'}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-sm line-clamp-2 mb-2">
                              {product.titleJP || product.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-bold text-blue-600">${product.price}</span>
                              <span className="text-gray-500">販売: {product.soldCount}</span>
                              {product.competitorCount !== undefined && (
                                <span className="text-gray-500">競合: {product.competitorCount}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* スコア詳細 */}
                        <div className="grid grid-cols-5 gap-2 mt-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">利益</div>
                            <div className="font-semibold text-sm">
                              {product.profitScore?.toFixed(0) || '-'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">需要</div>
                            <div className="font-semibold text-sm">
                              {product.demandScore?.toFixed(0) || '-'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">競合</div>
                            <div className="font-semibold text-sm">
                              {product.competitionScore?.toFixed(0) || '-'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">利益率</div>
                            <div className="font-semibold text-sm text-green-600">
                              {product.profitCalculation?.profitRate
                                ? `${product.profitCalculation.profitRate.toFixed(1)}%`
                                : '-'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">利益額</div>
                            <div className="font-semibold text-sm text-green-600">
                              {product.profitCalculation?.netProfit
                                ? `$${product.profitCalculation.netProfit.toFixed(0)}`
                                : '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
