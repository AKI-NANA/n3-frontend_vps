'use client'

import React, { useState, useEffect } from 'react'
import {
  ListingItem,
  PriceChangeLog,
  StockChangeLog,
  OrderHistoryItem,
  StockDetail
} from '@/lib/types/listing'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { X, TrendingUp, TrendingDown, Package, ShoppingCart, Lightbulb, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface AIImprovement {
  id: string
  type: 'image_quality' | 'title_optimization' | 'description_enhancement' | 'pricing_suggestion'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  current_value?: string
  suggested_value?: string
  image_analysis?: {
    quality_score: number
    issues: string[]
    suggestions: string[]
  }
}

interface ListingDetailPanelProps {
  sku: string
  listing: ListingItem | null
  isOpen: boolean
  onClose: () => void
}

export function ListingDetailPanel({ sku, listing, isOpen, onClose }: ListingDetailPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [priceLogs, setPriceLogs] = useState<PriceChangeLog[]>([])
  const [stockLogs, setStockLogs] = useState<StockChangeLog[]>([])
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([])
  const [aiImprovements, setAiImprovements] = useState<AIImprovement[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (isOpen && sku) {
      fetchLogs()
      fetchAIImprovements()
    }
  }, [isOpen, sku])

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/listing/logs/${sku}?type=all&limit=50`)
      const result = await response.json()

      if (result.success) {
        setPriceLogs(result.data.price_logs || [])
        setStockLogs(result.data.stock_logs || [])
        setOrderHistory(result.data.order_history || [])
      } else {
        toast.error('履歴データの取得に失敗しました')
      }
    } catch (error) {
      console.error('履歴データ取得エラー:', error)
      toast.error('履歴データの取得中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAIImprovements = async () => {
    try {
      const response = await fetch(`/api/listing/ai-improvements/${sku}`)
      const result = await response.json()

      if (result.success) {
        setAiImprovements(result.data || [])
      }
    } catch (error) {
      console.error('AI改善提案取得エラー:', error)
    }
  }

  const analyzeWithGeminiVision = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/listing/analyze-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Gemini Visionによる画像分析が完了しました')
        fetchAIImprovements()
      } else {
        toast.error('画像分析に失敗しました')
      }
    } catch (error) {
      console.error('画像分析エラー:', error)
      toast.error('画像分析中にエラーが発生しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const applyImprovement = async (improvementId: string) => {
    try {
      const response = await fetch('/api/listing/apply-improvement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ improvement_id: improvementId })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('改善提案を適用しました')
        fetchAIImprovements()
      } else {
        toast.error('改善提案の適用に失敗しました')
      }
    } catch (error) {
      console.error('改善提案適用エラー:', error)
      toast.error('改善提案の適用中にエラーが発生しました')
    }
  }

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`
  }

  return (
    <div className={`fixed right-0 top-0 h-screen w-[600px] bg-white shadow-2xl border-l z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold">出品詳細</h2>
            <p className="text-sm text-gray-600 font-mono">{sku}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* コンテンツ */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* 在庫詳細セクション */}
            {listing && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  在庫詳細
                </h3>
                <div className="space-y-2">
                  {listing.stock_details.map((detail, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        detail.is_active_pricing ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{detail.source}</div>
                        <div className="text-xs text-gray-600">
                          優先度: {detail.priority}
                          {detail.is_active_pricing && (
                            <Badge className="ml-2 bg-green-600 text-white text-xs">
                              価格計算中
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        {detail.count}個
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200 font-bold">
                    <span>合計在庫数</span>
                    <span className="text-xl">{listing.total_stock_count}個</span>
                  </div>
                </div>
              </Card>
            )}

            {/* タブセクション */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">読み込み中...</div>
              </div>
            ) : (
              <Tabs defaultValue="price" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="price">
                    価格履歴 ({priceLogs.length})
                  </TabsTrigger>
                  <TabsTrigger value="stock">
                    在庫変動 ({stockLogs.length})
                  </TabsTrigger>
                  <TabsTrigger value="orders">
                    受注履歴 ({orderHistory.length})
                  </TabsTrigger>
                  <TabsTrigger value="ai">
                    AI改善提案 ({aiImprovements.length})
                  </TabsTrigger>
                </TabsList>

                {/* 価格変動履歴 */}
                <TabsContent value="price" className="space-y-3">
                  {priceLogs.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      価格変動履歴がありません
                    </div>
                  ) : (
                    priceLogs.map((log) => (
                      <Card key={log.id} className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {log.change_percentage > 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                              )}
                              <Badge variant={log.triggered_by === '自動' ? 'default' : 'secondary'}>
                                {log.triggered_by}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDate(log.created_at)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {log.change_reason}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="line-through text-gray-500">
                                {formatPrice(log.old_price)}
                              </span>
                              <span>→</span>
                              <span className="font-bold">
                                {formatPrice(log.new_price)}
                              </span>
                              <Badge
                                variant={log.change_percentage > 0 ? 'default' : 'destructive'}
                                className="ml-2"
                              >
                                {log.change_percentage > 0 ? '+' : ''}
                                {log.change_percentage.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* 在庫変動ログ */}
                <TabsContent value="stock" className="space-y-3">
                  {stockLogs.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      在庫変動ログがありません
                    </div>
                  ) : (
                    stockLogs.map((log) => (
                      <Card key={log.id} className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>{log.source}</Badge>
                              <Badge
                                variant={
                                  log.change_type === 'increase'
                                    ? 'default'
                                    : log.change_type === 'decrease'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                              >
                                {log.change_type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDate(log.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span>{log.old_count}個</span>
                              <span>→</span>
                              <span className="font-bold">{log.new_count}個</span>
                            </div>
                            {log.notes && (
                              <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                ⚠️ {log.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* 受注履歴 */}
                <TabsContent value="orders">
                  {orderHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      受注履歴がありません
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>日時</TableHead>
                            <TableHead>モール</TableHead>
                            <TableHead>注文ID</TableHead>
                            <TableHead>数量</TableHead>
                            <TableHead>金額</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderHistory.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="text-xs">
                                {formatDate(order.order_date)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {order.mall.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {order.order_id}
                              </TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell className="font-semibold">
                                {formatPrice(order.price)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* AI改善提案 */}
                <TabsContent value="ai" className="space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600">
                      Gemini Visionによる画像分析と最適化提案
                    </p>
                    <Button
                      size="sm"
                      onClick={analyzeWithGeminiVision}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          分析中...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 mr-1" />
                          画像を再分析
                        </>
                      )}
                    </Button>
                  </div>

                  {aiImprovements.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      AI改善提案がありません
                      <br />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={analyzeWithGeminiVision}
                        disabled={isAnalyzing}
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        分析を開始
                      </Button>
                    </div>
                  ) : (
                    aiImprovements.map((improvement) => (
                      <Card key={improvement.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                <h4 className="font-semibold">{improvement.title}</h4>
                                <Badge
                                  variant={
                                    improvement.impact === 'high'
                                      ? 'default'
                                      : improvement.impact === 'medium'
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                >
                                  {improvement.impact === 'high' && '高影響'}
                                  {improvement.impact === 'medium' && '中影響'}
                                  {improvement.impact === 'low' && '低影響'}
                                </Badge>
                                <Badge variant="outline">
                                  信頼度: {(improvement.confidence * 100).toFixed(0)}%
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">
                                {improvement.description}
                              </p>

                              {improvement.current_value && improvement.suggested_value && (
                                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                                  <div>
                                    <span className="text-xs font-semibold text-gray-600">現在:</span>
                                    <p className="text-sm mt-1">{improvement.current_value}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-green-600">提案:</span>
                                    <p className="text-sm mt-1 text-green-700">{improvement.suggested_value}</p>
                                  </div>
                                </div>
                              )}

                              {improvement.image_analysis && (
                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="text-sm font-semibold">
                                      画像品質スコア: {(improvement.image_analysis.quality_score * 100).toFixed(0)}%
                                    </span>
                                  </div>

                                  {improvement.image_analysis.issues.length > 0 && (
                                    <div className="bg-red-50 p-2 rounded">
                                      <p className="text-xs font-semibold text-red-600 mb-1">検出された問題:</p>
                                      <ul className="text-xs text-red-700 space-y-1">
                                        {improvement.image_analysis.issues.map((issue, idx) => (
                                          <li key={idx}>• {issue}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {improvement.image_analysis.suggestions.length > 0 && (
                                    <div className="bg-green-50 p-2 rounded">
                                      <p className="text-xs font-semibold text-green-600 mb-1">改善提案:</p>
                                      <ul className="text-xs text-green-700 space-y-1">
                                        {improvement.image_analysis.suggestions.map((suggestion, idx) => (
                                          <li key={idx}>• {suggestion}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <Button
                              size="sm"
                              onClick={() => applyImprovement(improvement.id)}
                              className="ml-4"
                            >
                              適用
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
