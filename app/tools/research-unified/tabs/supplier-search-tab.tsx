/**
 * Supplier Search Tab
 * AI仕入先探索
 */

'use client'

import { useState } from 'react'
import { Search, Store, Globe, Package, TrendingUp, ExternalLink, Star, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

interface Supplier {
  id: string
  name: string
  type: 'amazon' | 'rakuten' | 'yahoo' | 'mercari' | 'other'
  price: number
  currency: string
  availability: 'in_stock' | 'limited' | 'out_of_stock'
  rating: number
  shipping: string
  url: string
  matchScore: number
}

interface SearchTarget {
  asin?: string
  title: string
  targetPrice: number
}

export default function SupplierSearchTab() {
  const [searchTarget, setSearchTarget] = useState<SearchTarget>({
    asin: '',
    title: '',
    targetPrice: 0
  })
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleSearch = async () => {
    if (!searchTarget.title && !searchTarget.asin) return

    setLoading(true)
    setProgress(0)

    // プログレス表示
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 15
      })
    }, 500)

    try {
      const response = await fetch('/api/research-table/supplier-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchTarget)
      })

      if (response.ok) {
        const data = await response.json()
        setSuppliers(data.suppliers || [
          // ダミーデータ
          {
            id: '1',
            name: 'Amazon Japan',
            type: 'amazon',
            price: 5980,
            currency: 'JPY',
            availability: 'in_stock',
            rating: 4.5,
            shipping: '翌日配送',
            url: 'https://amazon.co.jp',
            matchScore: 95
          },
          {
            id: '2',
            name: '楽天市場',
            type: 'rakuten',
            price: 5500,
            currency: 'JPY',
            availability: 'in_stock',
            rating: 4.2,
            shipping: '2-3日',
            url: 'https://rakuten.co.jp',
            matchScore: 88
          },
          {
            id: '3',
            name: 'Yahoo!ショッピング',
            type: 'yahoo',
            price: 5780,
            currency: 'JPY',
            availability: 'limited',
            rating: 4.0,
            shipping: '2-3日',
            url: 'https://shopping.yahoo.co.jp',
            matchScore: 82
          }
        ])
      }
    } catch (error) {
      console.error('Supplier search error:', error)
    } finally {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 500)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'amazon':
        return <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">A</div>
      case 'rakuten':
        return <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">R</div>
      case 'yahoo':
        return <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">Y</div>
      case 'mercari':
        return <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">M</div>
      default:
        return <Store className="w-8 h-8 text-gray-400" />
    }
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return <Badge variant="success">在庫あり</Badge>
      case 'limited':
        return <Badge variant="warning">残りわずか</Badge>
      case 'out_of_stock':
        return <Badge variant="destructive">在庫切れ</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* 検索フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>仕入先探索</CardTitle>
          <CardDescription>
            AIが最適な仕入先を自動で検索します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ASIN（オプション）</Label>
              <Input
                placeholder="B08N5WRWNW"
                value={searchTarget.asin}
                onChange={(e) => setSearchTarget({...searchTarget, asin: e.target.value})}
              />
            </div>
            <div>
              <Label>目標仕入価格</Label>
              <Input
                type="number"
                placeholder="5000"
                value={searchTarget.targetPrice || ''}
                onChange={(e) => setSearchTarget({...searchTarget, targetPrice: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <Label>商品名 / キーワード</Label>
            <Input
              placeholder="Echo Dot 第4世代 スマートスピーカー"
              value={searchTarget.title}
              onChange={(e) => setSearchTarget({...searchTarget, title: e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <Button 
            onClick={handleSearch}
            disabled={loading || (!searchTarget.title && !searchTarget.asin)}
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? '検索中...' : '仕入先を探す'}
          </Button>

          {loading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-center text-muted-foreground">
                複数のマーケットプレイスを検索中...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 検索結果 */}
      {suppliers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>仕入先候補（{suppliers.length}件）</CardTitle>
            <CardDescription>
              マッチ度の高い順に表示
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suppliers
                .sort((a, b) => b.matchScore - a.matchScore)
                .map(supplier => (
                  <div
                    key={supplier.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {getTypeIcon(supplier.type)}
                        <div>
                          <h4 className="font-medium">{supplier.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{supplier.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {supplier.shipping}
                            </span>
                            {getAvailabilityBadge(supplier.availability)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {supplier.currency === 'JPY' ? '¥' : '$'}
                          {supplier.price.toLocaleString()}
                        </p>
                        {searchTarget.targetPrice > 0 && (
                          <p className={`text-sm ${
                            supplier.price <= searchTarget.targetPrice ? 
                            'text-green-600' : 'text-red-600'
                          }`}>
                            {supplier.price <= searchTarget.targetPrice ? 
                              `目標価格以下 (-¥${(searchTarget.targetPrice - supplier.price).toLocaleString()})` :
                              `目標価格超過 (+¥${(supplier.price - searchTarget.targetPrice).toLocaleString()})`
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Progress value={supplier.matchScore} className="w-32" />
                        <span className="text-sm font-medium">{supplier.matchScore}% マッチ</span>
                      </div>
                      <a
                        href={supplier.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        商品ページ
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ヘルプ */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>仕入先探索のコツ</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>ASINがあると精度が大幅に向上します</li>
            <li>目標価格を設定すると利益計算が自動化されます</li>
            <li>複数の仕入先を比較して最安値を見つけましょう</li>
            <li>在庫状況と配送スピードも考慮してください</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
