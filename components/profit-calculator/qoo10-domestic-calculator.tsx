'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, TrendingUp, TrendingDown, Truck } from 'lucide-react'

// Qoo10手数料区分
const QOO10_FEE_TYPES = [
  { id: 'standard', name: '通常販売', rate: 0.10, description: '標準手数料10%' },
  { id: 'timesale', name: 'タイムセール', rate: 0.12, description: '+2%追加' },
  { id: 'megawari', name: 'メガ割', rate: 0.13, description: '+3%追加' },
  { id: 'group', name: '共同購入', rate: 0.12, description: '+2%追加' },
]

// 国内送料（ヤマト・日本郵便）
const DOMESTIC_SHIPPING_RATES: Record<string, { name: string; rates: { maxWeight?: number; maxSize?: number; maxThickness?: number; fee: number }[] }> = {
  yamato: {
    name: 'ヤマト宅急便',
    rates: [
      { maxWeight: 2, fee: 930 },    // 60サイズ
      { maxWeight: 5, fee: 1150 },   // 80サイズ
      { maxWeight: 10, fee: 1390 },  // 100サイズ
      { maxWeight: 15, fee: 1610 },  // 120サイズ
      { maxWeight: 20, fee: 1850 },  // 140サイズ
      { maxWeight: 25, fee: 2070 },  // 160サイズ
    ]
  },
  yupack: {
    name: 'ゆうパック',
    rates: [
      { maxWeight: 25, maxSize: 60, fee: 820 },
      { maxWeight: 25, maxSize: 80, fee: 1030 },
      { maxWeight: 25, maxSize: 100, fee: 1280 },
      { maxWeight: 25, maxSize: 120, fee: 1530 },
      { maxWeight: 25, maxSize: 140, fee: 1780 },
      { maxWeight: 25, maxSize: 160, fee: 2010 },
    ]
  },
  nekopos: {
    name: 'ネコポス',
    rates: [{ maxWeight: 1, fee: 385 }]
  },
  yumail: {
    name: 'ゆうパケット',
    rates: [
      { maxThickness: 1, fee: 250 },
      { maxThickness: 2, fee: 310 },
      { maxThickness: 3, fee: 360 },
    ]
  }
}

interface FormData {
  purchasePrice: string
  sellingPrice: string
  feeType: string
  shippingMethod: string
  weight: string
  size: string
}

interface CalculationResult {
  sellingPrice: number
  platformFee: number
  paymentFee: number
  shippingFee: number
  totalFees: number
  totalCost: number
  profit: number
  profitRate: number
}

interface Qoo10DomesticCalculatorProps {
  exchangeRates?: Record<string, number>
}

export function Qoo10DomesticCalculator({ exchangeRates }: Qoo10DomesticCalculatorProps) {
  const [formData, setFormData] = useState<FormData>({
    purchasePrice: '',
    sellingPrice: '',
    feeType: 'standard',
    shippingMethod: 'yamato',
    weight: '1',
    size: '60'
  })
  const [result, setResult] = useState<CalculationResult | null>(null)

  // 送料計算
  const calculateShipping = (): number => {
    const weight = parseFloat(formData.weight) || 1
    const size = parseFloat(formData.size) || 60
    const method = formData.shippingMethod

    if (method === 'yamato') {
      const rate = DOMESTIC_SHIPPING_RATES.yamato.rates.find(r => r.maxWeight && weight <= r.maxWeight)
      return rate?.fee || 2070
    } else if (method === 'yupack') {
      const rate = DOMESTIC_SHIPPING_RATES.yupack.rates.find(r => r.maxSize && size <= r.maxSize)
      return rate?.fee || 2010
    } else if (method === 'nekopos') {
      return weight <= 1 ? 385 : 930
    } else if (method === 'yumail') {
      return 360
    }
    return 1000
  }

  const calculate = () => {
    const purchasePrice = parseFloat(formData.purchasePrice) || 0
    const sellingPrice = parseFloat(formData.sellingPrice) || 0

    if (!purchasePrice || !sellingPrice) return

    // 手数料率
    const feeType = QOO10_FEE_TYPES.find(f => f.id === formData.feeType)
    const platformRate = feeType?.rate || 0.10

    // 送料
    const shippingFee = calculateShipping()

    // 手数料計算
    const platformFee = Math.round(sellingPrice * platformRate)
    const paymentFee = Math.round(sellingPrice * 0.035) // 決済手数料3.5%

    // 総手数料
    const totalFees = platformFee + paymentFee

    // 総コスト
    const totalCost = purchasePrice + shippingFee + totalFees

    // 利益
    const profit = sellingPrice - totalCost
    const profitRate = (profit / sellingPrice) * 100

    setResult({
      sellingPrice,
      platformFee,
      paymentFee,
      shippingFee,
      totalFees: totalFees + shippingFee,
      totalCost: Math.round(totalCost),
      profit: Math.round(profit),
      profitRate: Math.round(profitRate * 10) / 10
    })
  }

  // 推奨価格算出
  const calculateRecommendedPrice = () => {
    const purchasePrice = parseFloat(formData.purchasePrice) || 0
    const targetProfitRate = 0.20

    if (!purchasePrice) return

    const feeType = QOO10_FEE_TYPES.find(f => f.id === formData.feeType)
    const platformRate = feeType?.rate || 0.10
    const paymentRate = 0.035
    const shippingFee = calculateShipping()

    const baseCost = purchasePrice + shippingFee
    const recommendedPrice = Math.ceil(baseCost / (1 - targetProfitRate - platformRate - paymentRate))

    setFormData({ ...formData, sellingPrice: recommendedPrice.toString() })
    setTimeout(calculate, 100)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Qoo10 国内販売 利益計算
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
                placeholder="5000"
              />
            </div>
            <div>
              <Label>販売価格（円）</Label>
              <Input
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="8000"
              />
            </div>
            <div>
              <Label>販売形態</Label>
              <Select
                value={formData.feeType}
                onValueChange={(v) => setFormData({ ...formData, feeType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QOO10_FEE_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.rate * 100}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>配送方法</Label>
              <Select
                value={formData.shippingMethod}
                onValueChange={(v) => setFormData({ ...formData, shippingMethod: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yamato">ヤマト宅急便</SelectItem>
                  <SelectItem value="yupack">ゆうパック</SelectItem>
                  <SelectItem value="nekopos">ネコポス</SelectItem>
                  <SelectItem value="yumail">ゆうパケット</SelectItem>
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
              <Label>サイズ（cm）</Label>
              <Input
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="60"
              />
            </div>
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
                  <span className="text-muted-foreground">プラットフォーム手数料</span>
                  <span>-¥{result.platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">決済手数料（3.5%）</span>
                  <span>-¥{result.paymentFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3" />送料
                  </span>
                  <span>-¥{result.shippingFee.toLocaleString()}</span>
                </div>
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
    </div>
  )
}
