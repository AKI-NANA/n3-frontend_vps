'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, TrendingUp, TrendingDown, Info } from 'lucide-react'

// Amazon販売手数料カテゴリ
const AMAZON_CATEGORIES = [
  { id: 'electronics', name: '家電・カメラ', rate: 0.08 },
  { id: 'toys', name: 'おもちゃ・ホビー', rate: 0.10 },
  { id: 'fashion', name: 'ファッション', rate: 0.15 },
  { id: 'books', name: '本・CD・DVD', rate: 0.15 },
  { id: 'sports', name: 'スポーツ', rate: 0.10 },
  { id: 'home', name: 'ホーム＆キッチン', rate: 0.15 },
  { id: 'beauty', name: 'ビューティー', rate: 0.10 },
  { id: 'other', name: 'その他', rate: 0.15 },
]

// FBA手数料（サイズ別）
const FBA_FEES: Record<string, { name: string; fee: number; maxWeight: number; maxSize: number }> = {
  small: { name: '小型', fee: 290, maxWeight: 0.25, maxSize: 25 },
  standard: { name: '標準', fee: 421, maxWeight: 2, maxSize: 45 },
  large: { name: '大型', fee: 589, maxWeight: 9, maxSize: 80 },
  extraLarge: { name: '特大型', fee: 1756, maxWeight: 40, maxSize: 200 },
}

interface FormData {
  purchasePrice: string
  domesticShipping: string
  sellingPrice: string
  category: string
  weight: string
  longestSide: string
  useFba: boolean
}

interface CalculationResult {
  sellingPrice: number
  referralFee: number
  fbaFee: number
  closingFee: number
  totalFees: number
  totalCost: number
  profit: number
  profitRate: number
}

interface AmazonJPCalculatorProps {
  exchangeRates?: Record<string, number>
}

export function AmazonJPCalculator({ exchangeRates }: AmazonJPCalculatorProps) {
  const [formData, setFormData] = useState<FormData>({
    purchasePrice: '',
    domesticShipping: '800',
    sellingPrice: '',
    category: 'electronics',
    weight: '0.5',
    longestSide: '30',
    useFba: true
  })
  const [result, setResult] = useState<CalculationResult | null>(null)

  // FBAサイズ区分判定
  const determineFbaSize = (weight: number, longestSide: number): string => {
    if (weight <= 0.25 && longestSide <= 25) return 'small'
    if (weight <= 2 && longestSide <= 45) return 'standard'
    if (weight <= 9 && longestSide <= 80) return 'large'
    return 'extraLarge'
  }

  const calculate = () => {
    const purchasePrice = parseFloat(formData.purchasePrice) || 0
    const domesticShipping = parseFloat(formData.domesticShipping) || 0
    const sellingPrice = parseFloat(formData.sellingPrice) || 0
    const weight = parseFloat(formData.weight) || 0.5
    const longestSide = parseFloat(formData.longestSide) || 30

    if (!purchasePrice || !sellingPrice) return

    // カテゴリ手数料率
    const category = AMAZON_CATEGORIES.find(c => c.id === formData.category)
    const referralRate = category?.rate || 0.15

    // 販売手数料
    const referralFee = Math.round(sellingPrice * referralRate)

    // FBA手数料
    let fbaFee = 0
    if (formData.useFba) {
      const sizeType = determineFbaSize(weight, longestSide)
      fbaFee = FBA_FEES[sizeType].fee
    }

    // カテゴリ成約料（メディア商品のみ、ここでは0）
    const closingFee = 0

    // 総手数料
    const totalFees = referralFee + fbaFee + closingFee

    // 総コスト
    const totalCost = purchasePrice + domesticShipping + totalFees

    // 利益
    const profit = sellingPrice - totalCost
    const profitRate = (profit / sellingPrice) * 100

    setResult({
      sellingPrice,
      referralFee,
      fbaFee,
      closingFee,
      totalFees,
      totalCost: Math.round(totalCost),
      profit: Math.round(profit),
      profitRate: Math.round(profitRate * 10) / 10
    })
  }

  // 推奨価格逆算
  const calculateRecommendedPrice = () => {
    const purchasePrice = parseFloat(formData.purchasePrice) || 0
    const domesticShipping = parseFloat(formData.domesticShipping) || 0
    const weight = parseFloat(formData.weight) || 0.5
    const longestSide = parseFloat(formData.longestSide) || 30
    const targetProfitRate = 0.20 // 20%目標

    if (!purchasePrice) return

    const category = AMAZON_CATEGORIES.find(c => c.id === formData.category)
    const referralRate = category?.rate || 0.15

    let fbaFee = 0
    if (formData.useFba) {
      const sizeType = determineFbaSize(weight, longestSide)
      fbaFee = FBA_FEES[sizeType].fee
    }

    const baseCost = purchasePrice + domesticShipping + fbaFee

    // 推奨価格 = baseCost / (1 - 目標利益率 - 販売手数料率)
    const recommendedPrice = Math.ceil(baseCost / (1 - targetProfitRate - referralRate))

    setFormData({ ...formData, sellingPrice: recommendedPrice.toString() })

    // 自動計算
    setTimeout(calculate, 100)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Amazon JP 利益計算
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>仕入れ価格（円）</Label>
              <Input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                placeholder="10000"
              />
            </div>
            <div>
              <Label>国内送料（円）</Label>
              <Input
                type="number"
                value={formData.domesticShipping}
                onChange={(e) => setFormData({ ...formData, domesticShipping: e.target.value })}
              />
            </div>
            <div>
              <Label>カテゴリ</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AMAZON_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({cat.rate * 100}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>重量（kg）</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div>
              <Label>最長辺（cm）</Label>
              <Input
                type="number"
                value={formData.longestSide}
                onChange={(e) => setFormData({ ...formData, longestSide: e.target.value })}
              />
            </div>
            <div>
              <Label>販売価格（円）</Label>
              <Input
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="15000"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="useFba"
              checked={formData.useFba}
              onChange={(e) => setFormData({ ...formData, useFba: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="useFba">FBA利用</Label>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={calculate}>計算実行</Button>
            <Button variant="outline" onClick={calculateRecommendedPrice}>
              推奨価格算出（利益率20%）
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 結果 */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>計算結果</CardTitle>
              <Badge variant={result.profitRate >= 20 ? 'default' : result.profitRate >= 10 ? 'secondary' : 'destructive'}>
                {result.profitRate >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                利益率 {result.profitRate}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">販売価格</span>
                  <span className="font-bold">¥{result.sellingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">販売手数料</span>
                  <span>-¥{result.referralFee.toLocaleString()}</span>
                </div>
                {result.fbaFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FBA手数料</span>
                    <span>-¥{result.fbaFee.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">総コスト</span>
                  <span>¥{result.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>利益</span>
                  <span className={result.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ¥{result.profit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 注意事項 */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p>※ 月額登録料（大口出品: ¥4,900/月）は含まれていません</p>
              <p>※ FBA在庫保管手数料は含まれていません</p>
              <p>※ カテゴリ成約料（本・CD等）は別途発生する場合があります</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
