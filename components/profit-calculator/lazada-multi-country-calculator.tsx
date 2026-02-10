'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calculator, TrendingUp, TrendingDown } from 'lucide-react'
import { getEmsShippingBulk, EmsShippingRate } from '@/lib/shipping/ems-from-master'

// Lazada対応6カ国
const LAZADA_COUNTRIES = [
  { code: 'SG', name: 'シンガポール', currency: 'SGD', rate: 110, feeRate: 0.02, minFee: 0 },
  { code: 'MY', name: 'マレーシア', currency: 'MYR', rate: 32, feeRate: 0.03, minFee: 0 },
  { code: 'TH', name: 'タイ', currency: 'THB', rate: 4.2, feeRate: 0.02, minFee: 0 },
  { code: 'VN', name: 'ベトナム', currency: 'VND', rate: 0.006, feeRate: 0.05, minFee: 0 },
  { code: 'PH', name: 'フィリピン', currency: 'PHP', rate: 2.7, feeRate: 0.04, minFee: 0 },
  { code: 'ID', name: 'インドネシア', currency: 'IDR', rate: 0.0095, feeRate: 0.01, minFee: 0 },
]

// 関税免税枠（USD換算）
const DUTY_FREE_THRESHOLDS: Record<string, number> = {
  SG: 307,   // 400 SGD
  MY: 106,   // 500 MYR
  TH: 43,    // 1,500 THB
  VN: 43,    // 1,000,000 VND
  PH: 36,    // 2,000 PHP
  ID: 3,     // 3 USD
}

interface FormData {
  yahooPrice: string
  domesticShipping: string
  weight: string
  targetProfitRate: string
}

interface CountryResult {
  code: string
  name: string
  currency: string
  emsShipping: EmsShippingRate
  platformFee: number
  paymentFee: number
  estimatedDuty: number
  totalCostJPY: number
  recommendedPriceLocal: number
  recommendedPriceJPY: number
  profitJPY: number
  profitRate: number
}

interface LazadaMultiCountryCalculatorProps {
  exchangeRates?: Record<string, number>
}

export function LazadaMultiCountryCalculator({ exchangeRates }: LazadaMultiCountryCalculatorProps) {
  const [formData, setFormData] = useState<FormData>({
    yahooPrice: '',
    domesticShipping: '800',
    weight: '0.5',
    targetProfitRate: '20'
  })
  const [results, setResults] = useState<CountryResult[]>([])
  const [loading, setLoading] = useState(false)
  const exchangeRate = exchangeRates?.USD || 150 // USD/JPY

  const calculate = async () => {
    if (!formData.yahooPrice || !formData.weight) return

    setLoading(true)
    try {
      const yahooPrice = parseFloat(formData.yahooPrice)
      const domesticShipping = parseFloat(formData.domesticShipping) || 0
      const weight = parseFloat(formData.weight)
      const targetProfitRate = parseFloat(formData.targetProfitRate) / 100

      // EMS送料一括取得
      const countryCodes = LAZADA_COUNTRIES.map(c => c.code)
      const emsRates = await getEmsShippingBulk(countryCodes, weight)

      const newResults: CountryResult[] = LAZADA_COUNTRIES.map(country => {
        const emsShipping = emsRates[country.code]

        // 基本コスト（円）
        const baseCostJPY = yahooPrice + domesticShipping + emsShipping.costJPY

        // 目標販売価格（円）= 基本コスト / (1 - 目標利益率 - 手数料率 - 決済手数料率)
        const totalFeeRate = country.feeRate + 0.02 // プラットフォーム + 決済2%
        const targetPriceJPY = baseCostJPY / (1 - targetProfitRate - totalFeeRate)

        // 現地通貨換算
        const targetPriceLocal = targetPriceJPY / country.rate

        // 関税計算（免税枠超過時のみ）
        const priceUSD = targetPriceJPY / exchangeRate
        const dutyFreeThreshold = DUTY_FREE_THRESHOLDS[country.code] || 0
        const estimatedDuty = priceUSD > dutyFreeThreshold
          ? (priceUSD - dutyFreeThreshold) * 0.1 * exchangeRate // 10%関税想定
          : 0

        // 手数料計算
        const platformFee = targetPriceJPY * country.feeRate
        const paymentFee = targetPriceJPY * 0.02

        // 総コスト
        const totalCostJPY = baseCostJPY + platformFee + paymentFee + estimatedDuty

        // 利益
        const profitJPY = targetPriceJPY - totalCostJPY
        const profitRate = (profitJPY / targetPriceJPY) * 100

        return {
          code: country.code,
          name: country.name,
          currency: country.currency,
          emsShipping,
          platformFee: Math.round(platformFee),
          paymentFee: Math.round(paymentFee),
          estimatedDuty: Math.round(estimatedDuty),
          totalCostJPY: Math.round(totalCostJPY),
          recommendedPriceLocal: Math.round(targetPriceLocal),
          recommendedPriceJPY: Math.round(targetPriceJPY),
          profitJPY: Math.round(profitJPY),
          profitRate: Math.round(profitRate * 10) / 10
        }
      })

      setResults(newResults)
    } catch (error) {
      console.error('計算エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 入力フォーム */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Lazada 6カ国利益計算
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>仕入れ価格（円）</Label>
              <Input
                type="number"
                value={formData.yahooPrice}
                onChange={(e) => setFormData({ ...formData, yahooPrice: e.target.value })}
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
              <Label>重量（kg）</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div>
              <Label>目標利益率（%）</Label>
              <Input
                type="number"
                value={formData.targetProfitRate}
                onChange={(e) => setFormData({ ...formData, targetProfitRate: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={calculate} className="mt-4" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            計算実行
          </Button>
        </CardContent>
      </Card>

      {/* 結果表示 */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => (
            <Card key={result.code} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{result.name}</CardTitle>
                  <Badge variant={result.profitRate >= 20 ? 'default' : result.profitRate >= 10 ? 'secondary' : 'destructive'}>
                    {result.profitRate >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {result.profitRate}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">推奨価格</span>
                  <span className="font-bold text-lg">
                    {result.currency} {result.recommendedPriceLocal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">（円換算）</span>
                  <span>¥{result.recommendedPriceJPY.toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EMS送料</span>
                  <span>¥{result.emsShipping.costJPY.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">プラットフォーム手数料</span>
                  <span>¥{result.platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">決済手数料</span>
                  <span>¥{result.paymentFee.toLocaleString()}</span>
                </div>
                {result.estimatedDuty > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>関税（概算）</span>
                    <span>¥{result.estimatedDuty.toLocaleString()}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>利益</span>
                  <span className={result.profitJPY >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ¥{result.profitJPY.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
