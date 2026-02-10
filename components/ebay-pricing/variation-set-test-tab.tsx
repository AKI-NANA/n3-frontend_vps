/**
 * バリエーション/セット商品 計算テストタブ
 * 
 * eBay価格計算ツールに組み込んで、
 * 新しい計算エンジンをテストするためのコンポーネント
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Package,
  Layers,
  DollarSign,
  Calculator
} from 'lucide-react'
import {
  calculateSingleProductDDP,
  calculateVariationGroup,
  calculateSetProductPrice,
  testVariationCalculation,
  testSetCalculation,
  VariationProduct,
  VariationGroupResult,
  SetProductCalculationResult
} from '@/lib/ebay-pricing/variation-set-calculator'

export function VariationSetTestTab() {
  const [loading, setLoading] = useState(false)
  const [activeTest, setActiveTest] = useState<'none' | 'variation' | 'set' | 'custom'>('none')
  
  // テスト結果
  const [variationResult, setVariationResult] = useState<VariationGroupResult | null>(null)
  const [setResult, setSetResult] = useState<SetProductCalculationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // カスタム入力
  const [customProducts, setCustomProducts] = useState<VariationProduct[]>([
    {
      id: '1',
      sku: 'CUSTOM-001',
      product_name: '商品1',
      cost_price: 30,
      weight_g: 500,
      hts_code: '9503.00.00',
      origin_country: 'JP'
    },
    {
      id: '2',
      sku: 'CUSTOM-002',
      product_name: '商品2',
      cost_price: 40,
      weight_g: 600,
      hts_code: '9503.00.00',
      origin_country: 'JP'
    }
  ])

  // バリエーションテスト実行
  const runVariationTest = async () => {
    setLoading(true)
    setActiveTest('variation')
    setError(null)
    setVariationResult(null)
    
    try {
      const result = await testVariationCalculation()
      if (result.success && result.result) {
        setVariationResult(result.result)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // セットテスト実行
  const runSetTest = async () => {
    setLoading(true)
    setActiveTest('set')
    setError(null)
    setSetResult(null)
    
    try {
      const result = await testSetCalculation()
      if (result.success && result.result) {
        setSetResult(result.result)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // カスタム計算実行
  const runCustomCalculation = async () => {
    setLoading(true)
    setActiveTest('custom')
    setError(null)
    setVariationResult(null)
    
    try {
      const result = await calculateVariationGroup(customProducts, 'CUSTOM-VAR-TEST')
      setVariationResult(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // カスタム商品の更新
  const updateCustomProduct = (index: number, field: keyof VariationProduct, value: any) => {
    const updated = [...customProducts]
    updated[index] = { ...updated[index], [field]: value }
    setCustomProducts(updated)
  }

  // 商品追加
  const addCustomProduct = () => {
    setCustomProducts([
      ...customProducts,
      {
        id: String(customProducts.length + 1),
        sku: `CUSTOM-00${customProducts.length + 1}`,
        product_name: `商品${customProducts.length + 1}`,
        cost_price: 30,
        weight_g: 500,
        hts_code: '9503.00.00',
        origin_country: 'JP'
      }
    ])
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <Layers className="w-8 h-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            バリエーション/セット商品 計算テスト
          </h2>
          <p className="text-gray-600">
            既存のDDP計算エンジンを使用したバリエーション・セット商品の価格計算テスト
          </p>
        </div>
      </div>

      {/* テストボタン */}
      <div className="flex gap-4">
        <Button 
          onClick={runVariationTest} 
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading && activeTest === 'variation' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Layers className="w-4 h-4 mr-2" />
          )}
          バリエーションテスト
        </Button>
        
        <Button 
          onClick={runSetTest} 
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {loading && activeTest === 'set' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Package className="w-4 h-4 mr-2" />
          )}
          セット商品テスト
        </Button>
      </div>

      {/* エラー表示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">エラー:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* バリエーション結果 */}
      {variationResult && (
        <Card className="border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Layers className="w-5 h-5" />
              バリエーション計算結果
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* サマリー */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-purple-600">基準価格</div>
                <div className="text-2xl font-bold text-purple-800">
                  ${variationResult.basePrice.toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-600">成功</div>
                <div className="text-2xl font-bold text-green-800">
                  {variationResult.successCount}/{variationResult.totalProducts}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-600">平均利益率</div>
                <div className="text-2xl font-bold text-blue-800">
                  {variationResult.avgProfitMargin.toFixed(1)}%
                </div>
              </div>
              <div className={`p-3 rounded-lg ${variationResult.hasHighRisk ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className={`text-sm ${variationResult.hasHighRisk ? 'text-red-600' : 'text-gray-600'}`}>
                  最大サーチャージ
                </div>
                <div className={`text-2xl font-bold ${variationResult.hasHighRisk ? 'text-red-800' : 'text-gray-800'}`}>
                  ${variationResult.maxSurcharge.toFixed(2)}
                </div>
              </div>
            </div>

            {/* 高リスク警告 */}
            {variationResult.hasHighRisk && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-5 h-5" />
                <span>送料サーチャージが$50を超える商品があります。価格設定の見直しを推奨します。</span>
              </div>
            )}

            {/* 子商品一覧 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">子商品詳細</h4>
              {variationResult.children.map((child, index) => (
                <div 
                  key={child.productId} 
                  className={`border rounded-lg p-3 ${
                    child.productId === variationResult.baseProductId 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{child.sku}</span>
                      {child.productId === variationResult.baseProductId && (
                        <Badge className="bg-purple-600">基準</Badge>
                      )}
                      {child.success ? (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          成功
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-500 text-red-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          失敗
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${child.recommendedTotal.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        サーチャージ: +${child.shippingSurcharge.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-5 gap-2 text-sm text-gray-600">
                    <div>コスト: ${child.costUSD.toFixed(2)}</div>
                    <div>DDP: ${child.ddpTotal.toFixed(2)}</div>
                    <div>関税: {child.tariffRate.toFixed(1)}%</div>
                    <div>送料: ${child.totalShipping.toFixed(2)}</div>
                    <div>利益率: {child.profitMargin.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* セット結果 */}
      {setResult && (
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Package className="w-5 h-5" />
              セット商品計算結果
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* サマリー */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="text-sm text-amber-600">推奨価格</div>
                <div className="text-2xl font-bold text-amber-800">
                  ${setResult.recommendedTotal.toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-600">利益率</div>
                <div className="text-2xl font-bold text-green-800">
                  {setResult.profitMargin.toFixed(1)}%
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-600">利益額</div>
                <div className="text-2xl font-bold text-blue-800">
                  ${setResult.profitUSD.toFixed(2)}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-purple-600">DDP合計</div>
                <div className="text-2xl font-bold text-purple-800">
                  ${setResult.ddpTotal.toFixed(2)}
                </div>
              </div>
            </div>

            {/* 内訳 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">計算内訳</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>構成商品数:</span>
                    <span className="font-semibold">{setResult.componentCount}種類</span>
                  </div>
                  <div className="flex justify-between">
                    <span>合計コスト:</span>
                    <span className="font-semibold">${setResult.totalCostUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>合計重量:</span>
                    <span className="font-semibold">{setResult.totalWeightG}g</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>関税率:</span>
                    <span className="font-semibold">{setResult.tariffRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>関税額:</span>
                    <span className="font-semibold">${setResult.tariffAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MPF:</span>
                    <span className="font-semibold">${setResult.mpf.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 計算ステップ */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">計算ステップ</h4>
              {setResult.calculationSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <Badge variant="outline">{step.step}</Badge>
                  <span className="font-mono font-semibold">{step.value}</span>
                  <span className="text-gray-500">{step.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* カスタム計算 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            カスタム計算
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {customProducts.map((product, index) => (
              <div key={product.id} className="grid grid-cols-6 gap-2 items-center">
                <Input
                  placeholder="SKU"
                  value={product.sku}
                  onChange={(e) => updateCustomProduct(index, 'sku', e.target.value)}
                />
                <Input
                  placeholder="商品名"
                  value={product.product_name}
                  onChange={(e) => updateCustomProduct(index, 'product_name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="コスト($)"
                  value={product.cost_price}
                  onChange={(e) => updateCustomProduct(index, 'cost_price', parseFloat(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  placeholder="重量(g)"
                  value={product.weight_g}
                  onChange={(e) => updateCustomProduct(index, 'weight_g', parseInt(e.target.value) || 0)}
                />
                <Input
                  placeholder="HTSコード"
                  value={product.hts_code}
                  onChange={(e) => updateCustomProduct(index, 'hts_code', e.target.value)}
                />
                <Input
                  placeholder="原産国"
                  value={product.origin_country}
                  onChange={(e) => updateCustomProduct(index, 'origin_country', e.target.value)}
                />
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={addCustomProduct}>
              + 商品追加
            </Button>
            <Button 
              onClick={runCustomCalculation} 
              disabled={loading || customProducts.length < 2}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading && activeTest === 'custom' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calculator className="w-4 h-4 mr-2" />
              )}
              カスタム計算実行
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 使い方ガイド */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-800 mb-2">📖 使い方</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• <strong>バリエーションテスト:</strong> サンプルのトレーディングカード3種類で計算をテストします</li>
            <li>• <strong>セット商品テスト:</strong> サンプルのゲームソフト2本セットで計算をテストします</li>
            <li>• <strong>カスタム計算:</strong> 任意の商品データを入力してバリエーション計算をテストできます</li>
            <li>• 計算結果はコンソールにも詳細ログが出力されます（開発者ツールで確認）</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
