'use client'

import { useState } from 'react'
import { Send, CheckSquare, Square, Package, DollarSign, TrendingUp, ExternalLink, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { ResearchProduct } from '../page'

interface DataExportTabProps {
  products: ResearchProduct[]
  selectedProducts: string[]
  onToggleSelection: (productId: string) => void
  onToggleSelectAll: (products: ResearchProduct[]) => void
  onExport: (productIds: string[]) => void
}

export default function DataExportTab({
  products,
  selectedProducts,
  onToggleSelection,
  onToggleSelectAll,
  onExport,
}: DataExportTabProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 統計計算
  const totalProducts = products.length
  const totalEstimatedProfit = products.reduce(
    (sum, p) => sum + (p.profitCalculation?.netProfit || 0),
    0
  )
  const avgProfitRate = products.length > 0
    ? products.reduce((sum, p) => sum + (p.profitCalculation?.profitRate || 0), 0) / products.length
    : 0
  const totalEstimatedRevenue = products.reduce((sum, p) => sum + p.price, 0)

  // AIメッセージハブへ提案を送信
  const handleExport = async () => {
    if (selectedProducts.length === 0) {
      toast.error('送信する商品を選択してください')
      return
    }

    setLoading(true)
    try {
      // 選択された商品を取得
      const productsToExport = products.filter(p => selectedProducts.includes(p.id))

      // AIメッセージハブへ提案を作成
      const proposals = productsToExport.map(product => ({
        type: 'research_proposal',
        title: `${product.titleJP || product.title}`,
        description: `スコア: ${product.totalScore?.toFixed(1) || 'N/A'} | 利益率: ${product.profitCalculation?.profitRate?.toFixed(1) || 'N/A'}% | リスク: ${product.riskLevel || 'N/A'}`,
        priority: (product.totalScore || 0) >= 80 ? 'high' : (product.totalScore || 0) >= 60 ? 'medium' : 'low',
        source_system: 'unified_research',
        source_reference_id: product.id,
        proposal_data: {
          product_id: product.id,
          source: product.source,
          ebay_item_id: product.ebayItemId,
          asin: product.asin,
          title: product.title,
          title_jp: product.titleJP,
          price: product.price,
          cost_price: product.profitCalculation?.costPrice || 0,
          supplier: product.bestSupplier?.source || 'Unknown',
          supplier_url: product.bestSupplier?.url,
          image: product.image,
          total_score: product.totalScore || 0,
          profit_score: product.profitScore,
          demand_score: product.demandScore,
          competition_score: product.competitionScore,
          risk_level: product.riskLevel,
          estimated_profit: product.profitCalculation?.netProfit || 0,
          profit_rate: product.profitCalculation?.profitRate || 0,
          estimated_revenue: product.price,
          sold_count: product.soldCount,
          competitor_count: product.competitorCount,
          category: product.category,
          url: product.url,
        },
        estimated_profit: product.profitCalculation?.netProfit || 0,
        estimated_revenue: product.price,
        risk_level: product.riskLevel || 'medium',
        confidence_score: product.totalScore || 0,
      }))

      // 一括送信
      const response = await fetch('/api/proposals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposals),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '送信に失敗しました')
      }

      // ステータスを更新
      onExport(selectedProducts)

      toast.success(`${selectedProducts.length}件の商品をAI提案管理ハブへ送信しました`, {
        action: {
          label: 'AI提案管理を開く',
          onClick: () => router.push('/ai-hub/proposals'),
        },
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error(error instanceof Error ? error.message : '送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 送信済み商品
  const sentProducts = products.filter(p => p.status === 'sent')

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">承認済み商品</div>
                <div className="text-2xl font-bold">{totalProducts}件</div>
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
                <div className="text-sm text-gray-500">推定利益合計</div>
                <div className="text-2xl font-bold text-green-600">
                  ${totalEstimatedProfit.toFixed(0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">平均利益率</div>
                <div className="text-2xl font-bold">{avgProfitRate.toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">推定売上合計</div>
                <div className="text-2xl font-bold">${totalEstimatedRevenue.toFixed(0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 送信コントロール */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI提案管理ハブへ送信</CardTitle>
              <CardDescription>
                承認済み商品をAI提案管理ハブへ送信し、最終承認後に出品管理システムへ連携されます
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleSelectAll(products)}
              >
                {selectedProducts.length === products.length ? (
                  <CheckSquare className="w-4 h-4 mr-2" />
                ) : (
                  <Square className="w-4 h-4 mr-2" />
                )}
                全選択
              </Button>
              <Button
                onClick={handleExport}
                disabled={selectedProducts.length === 0 || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    AI提案管理へ送信 ({selectedProducts.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 承認済み商品リスト */}
      <Card>
        <CardHeader>
          <CardTitle>承認済み商品一覧</CardTitle>
          <CardDescription>{products.length}件の商品が送信可能です</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>仕入れ先マッチングタブで商品を承認してください</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all ${
                    product.status === 'sent'
                      ? 'opacity-50 bg-gray-50'
                      : selectedProducts.includes(product.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => product.status !== 'sent' && onToggleSelection(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* 選択状態 */}
                      {product.status !== 'sent' && (
                        <div className="pt-2">
                          {selectedProducts.includes(product.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      )}

                      {/* ランク */}
                      <div className="text-center min-w-[50px]">
                        <div className="text-2xl font-bold text-gray-300">#{index + 1}</div>
                        {product.status === 'sent' && (
                          <Badge className="bg-green-100 text-green-700 mt-2">
                            <Check className="w-3 h-3 mr-1" />
                            送信済み
                          </Badge>
                        )}
                      </div>

                      {/* 商品画像 */}
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className={`w-24 h-24 object-cover rounded ${
                            product.status === 'sent' ? 'grayscale' : ''
                          }`}
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
                              {product.bestSupplier && (
                                <Badge variant="outline" className="bg-yellow-50">
                                  仕入先: {product.bestSupplier.source}
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">
                              {product.titleJP || product.title}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                              <div>
                                <div className="text-gray-500 text-xs">販売価格</div>
                                <div className="font-bold text-blue-600">
                                  ${product.price.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 text-xs">仕入価格</div>
                                <div className="font-semibold">
                                  ${(product.profitCalculation?.costPrice || 0).toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 text-xs">利益額</div>
                                <div className="font-bold text-green-600">
                                  ${(product.profitCalculation?.netProfit || 0).toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 text-xs">利益率</div>
                                <div className="font-bold text-green-600">
                                  {(product.profitCalculation?.profitRate || 0).toFixed(1)}%
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 text-xs">スコア</div>
                                <div className="font-bold text-purple-600">
                                  {(product.totalScore || 0).toFixed(1)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* リンク */}
                        <div className="flex gap-3 mt-3">
                          {product.url && (
                            <a
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {product.source === 'ebay' ? 'eBay商品ページ' : 'Amazon商品ページ'}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {product.bestSupplier?.url && (
                            <a
                              href={product.bestSupplier.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green-600 hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              仕入先ページ
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
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

      {/* 送信済み履歴 */}
      {sentProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>送信済み履歴</CardTitle>
            <CardDescription>{sentProducts.length}件の商品を送信済み</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-3">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded grayscale"
                      />
                    )}
                    <div>
                      <div className="font-medium text-sm line-clamp-1">
                        {product.titleJP || product.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(product.updatedAt).toLocaleString('ja-JP')}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    <Check className="w-3 h-3 mr-1" />
                    送信済み
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
