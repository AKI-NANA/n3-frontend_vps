'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckSquare, Square, Check, ExternalLink, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { ResearchProduct } from '../page'

interface SupplierMatchingTabProps {
  products: ResearchProduct[]
  onProductsUpdated: (products: ResearchProduct[]) => void
  selectedProducts: string[]
  onToggleSelection: (productId: string) => void
  onToggleSelectAll: (products: ResearchProduct[]) => void
  onApprove: (productIds: string[]) => void
}

// モック仕入れ先データ生成
function generateMockSuppliers(product: ResearchProduct) {
  const suppliers = [
    {
      source: 'Taobao',
      price: product.price * 0.3 + Math.random() * 5,
      url: `https://taobao.com/item/${Math.random().toString(36).substring(7)}`,
      confidence: 85 + Math.random() * 15,
      shipping: 3 + Math.random() * 2,
      leadTime: '7-14日',
      rating: 4.5 + Math.random() * 0.5,
    },
    {
      source: 'Alibaba',
      price: product.price * 0.35 + Math.random() * 5,
      url: `https://alibaba.com/product/${Math.random().toString(36).substring(7)}`,
      confidence: 80 + Math.random() * 15,
      shipping: 4 + Math.random() * 3,
      leadTime: '10-20日',
      rating: 4.3 + Math.random() * 0.5,
    },
    {
      source: 'AliExpress',
      price: product.price * 0.4 + Math.random() * 5,
      url: `https://aliexpress.com/item/${Math.random().toString(36).substring(7)}`,
      confidence: 75 + Math.random() * 15,
      shipping: 2 + Math.random() * 2,
      leadTime: '5-10日',
      rating: 4.2 + Math.random() * 0.5,
    },
  ]

  return suppliers.sort((a, b) => a.price - b.price)
}

// 利益計算（簡易版）
function calculateProfit(salePrice: number, costPrice: number, shipping: number) {
  const totalCost = costPrice + shipping
  const ebayFee = salePrice * 0.13 // eBay手数料 13%
  const paypalFee = salePrice * 0.029 + 0.3 // PayPal手数料
  const totalFees = ebayFee + paypalFee

  const netProfit = salePrice - totalCost - totalFees
  const profitRate = (netProfit / salePrice) * 100
  const roi = (netProfit / totalCost) * 100

  return {
    totalCost,
    totalFees,
    netProfit,
    profitRate,
    roi,
    isBlackInk: netProfit > 0 && profitRate > 15, // 利益率15%以上で黒字判定
  }
}

export default function SupplierMatchingTab({
  products,
  onProductsUpdated,
  selectedProducts,
  onToggleSelection,
  onToggleSelectAll,
  onApprove,
}: SupplierMatchingTabProps) {
  const [loading, setLoading] = useState(false)
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

  // 初回マッチング実行
  useEffect(() => {
    const unmatchedProducts = products.filter(p => !p.supplierMatches || p.supplierMatches.length === 0)
    if (unmatchedProducts.length > 0) {
      handleAutoMatch(unmatchedProducts)
    }
  }, [products.length])

  // 自動マッチング
  const handleAutoMatch = async (productsToMatch: ResearchProduct[]) => {
    setLoading(true)
    try {
      // モックデータ生成のため少し待機
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedProducts: ResearchProduct[] = productsToMatch.map(product => {
        const suppliers = generateMockSuppliers(product)
        const bestSupplier = suppliers[0]

        const profitCalc = calculateProfit(
          product.price,
          bestSupplier.price,
          bestSupplier.shipping
        )

        return {
          ...product,
          supplierMatches: suppliers.map(s => ({
            source: s.source,
            price: s.price,
            url: s.url,
            confidence: s.confidence,
          })),
          bestSupplier: {
            source: bestSupplier.source,
            price: bestSupplier.price,
            url: bestSupplier.url,
          },
          profitCalculation: {
            isBlackInk: profitCalc.isBlackInk,
            profitRate: profitCalc.profitRate,
            netProfit: profitCalc.netProfit,
            costPrice: bestSupplier.price,
          },
        }
      })

      onProductsUpdated(updatedProducts)
      toast.success(`${updatedProducts.length}件の商品に仕入れ先をマッチングしました`)
    } catch (error) {
      console.error('Matching error:', error)
      toast.error('マッチングに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 承認して次へ
  const handleApprove = () => {
    const selectedBlackInk = products
      .filter(p => selectedProducts.includes(p.id))
      .filter(p => p.profitCalculation?.isBlackInk)

    if (selectedBlackInk.length === 0) {
      toast.error('黒字商品を選択してください')
      return
    }

    if (selectedBlackInk.length < selectedProducts.length) {
      toast.warning(`${selectedProducts.length - selectedBlackInk.length}件の赤字商品は除外されます`)
    }

    onApprove(selectedBlackInk.map(p => p.id))
    toast.success(`${selectedBlackInk.length}件を承認しました`)
  }

  // 黒字/赤字でフィルター
  const blackInkProducts = products.filter(p => p.profitCalculation?.isBlackInk)
  const redInkProducts = products.filter(p => p.profitCalculation && !p.profitCalculation.isBlackInk)

  return (
    <div className="space-y-6">
      {/* サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">黒字商品</div>
                <div className="text-2xl font-bold text-green-600">{blackInkProducts.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">赤字商品</div>
                <div className="text-2xl font-bold text-red-600">{redInkProducts.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">平均利益率</div>
                <div className="text-2xl font-bold">
                  {(
                    blackInkProducts.reduce((sum, p) => sum + (p.profitCalculation?.profitRate || 0), 0) /
                    blackInkProducts.length || 0
                  ).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* コントロール */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>仕入れ先マッチング</CardTitle>
              <CardDescription>
                日本の仕入れ先から最適な供給元を選択し、利益計算を確認
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleSelectAll(blackInkProducts)}
              >
                {selectedProducts.length === blackInkProducts.length ? (
                  <CheckSquare className="w-4 h-4 mr-2" />
                ) : (
                  <Square className="w-4 h-4 mr-2" />
                )}
                黒字商品を全選択
              </Button>
              <Button onClick={handleApprove} disabled={selectedProducts.length === 0}>
                <Check className="w-4 h-4 mr-2" />
                承認して次へ ({selectedProducts.length})
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 商品リスト */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
              <p className="text-gray-500">仕入れ先をマッチング中...</p>
            </CardContent>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              スコアリングタブから商品を移動してください
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 黒字商品 */}
            {blackInkProducts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">
                  ✓ 黒字商品 ({blackInkProducts.length}件)
                </h3>
                <div className="space-y-3">
                  {blackInkProducts.map((product) => (
                    <Card
                      key={product.id}
                      className={`transition-all ${
                        selectedProducts.includes(product.id)
                          ? 'ring-2 ring-green-500 bg-green-50'
                          : 'hover:shadow-lg'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* 選択チェックボックス */}
                          <div
                            className="pt-2 cursor-pointer"
                            onClick={() => onToggleSelection(product.id)}
                          >
                            {selectedProducts.includes(product.id) ? (
                              <CheckSquare className="w-5 h-5 text-green-600" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400" />
                            )}
                          </div>

                          {/* 商品画像 */}
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}

                          {/* 商品情報 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm line-clamp-2 mb-2">
                                  {product.titleJP || product.title}
                                </h4>
                                <div className="flex items-center gap-3 text-sm mb-3">
                                  <span className="font-bold text-blue-600">
                                    販売価格: ${product.price.toFixed(2)}
                                  </span>
                                  <span className="text-green-600 font-semibold">
                                    利益率: {product.profitCalculation?.profitRate.toFixed(1)}%
                                  </span>
                                  <span className="text-green-600 font-semibold">
                                    利益: ${product.profitCalculation?.netProfit.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 仕入れ先情報 */}
                            <div className="bg-gray-50 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">
                                  最安仕入れ先: {product.bestSupplier?.source}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setExpandedProduct(
                                      expandedProduct === product.id ? null : product.id
                                    )
                                  }
                                >
                                  {expandedProduct === product.id ? '閉じる' : '詳細を見る'}
                                </Button>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span>
                                  仕入価格: ${product.bestSupplier?.price.toFixed(2)}
                                </span>
                                {product.bestSupplier?.url && (
                                  <a
                                    href={product.bestSupplier.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    商品ページ <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>

                              {/* 展開時の詳細情報 */}
                              {expandedProduct === product.id && (
                                <div className="mt-3 pt-3 border-t space-y-2">
                                  <div className="text-sm font-medium mb-2">
                                    その他の仕入れ先候補:
                                  </div>
                                  {product.supplierMatches
                                    ?.slice(1)
                                    .map((supplier, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between text-sm bg-white p-2 rounded"
                                      >
                                        <div>
                                          <span className="font-medium">{supplier.source}</span>
                                          <span className="text-gray-500 ml-2">
                                            ${supplier.price.toFixed(2)}
                                          </span>
                                        </div>
                                        <Badge variant="outline">
                                          信頼度: {supplier.confidence.toFixed(0)}%
                                        </Badge>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 赤字商品 */}
            {redInkProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-red-600">
                  ✗ 赤字商品 ({redInkProducts.length}件)
                </h3>
                <div className="space-y-3">
                  {redInkProducts.map((product) => (
                    <Card key={product.id} className="opacity-60">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-20 h-20 object-cover rounded grayscale"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">
                              {product.titleJP || product.title}
                            </h4>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-bold text-blue-600">
                                販売価格: ${product.price.toFixed(2)}
                              </span>
                              <span className="text-red-600 font-semibold">
                                利益率: {product.profitCalculation?.profitRate.toFixed(1)}%
                              </span>
                              <Badge variant="destructive">推奨しない</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
