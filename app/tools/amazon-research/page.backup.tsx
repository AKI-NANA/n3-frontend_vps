'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, TrendingUp, DollarSign, Package, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AmazonProduct } from '@/types/amazon'
import { AmazonProductCard } from '@/components/amazon/amazon-product-card'
import { AmazonSearchFilters } from '@/components/amazon/amazon-search-filters'
import { AmazonProfitChart } from '@/components/amazon/amazon-profit-chart'
import { StrategyConfigPanel } from '@/components/amazon/strategy-config-panel'
import { QueueManagementPanel } from '@/components/amazon/queue-management-panel'

export default function AmazonResearchPage() {
  const [products, setProducts] = useState<AmazonProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeywords, setSearchKeywords] = useState('')
  const [filters, setFilters] = useState({
    minPrice: undefined,
    maxPrice: undefined,
    category: undefined,
    primeOnly: false,
    minRating: undefined
  })

  const [stats, setStats] = useState({
    totalProducts: 0,
    avgProfitScore: 0,
    highProfitCount: 0,
    inStockCount: 0
  })

  useEffect(() => {
    loadProducts()
    loadStats()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/amazon/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Load products error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/amazon/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Load stats error:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchKeywords.trim()) return

    try {
      setLoading(true)
      const response = await fetch('/api/amazon/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: searchKeywords,
          ...filters
        })
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      await loadProducts()
      await loadStats()
    } catch (error) {
      console.error('Search error:', error)
      alert('検索に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products
    .filter(p => {
      if (filters.minRating && p.star_rating && p.star_rating < filters.minRating) {
        return false
      }
      if (filters.primeOnly && !p.is_prime_eligible) {
        return false
      }
      return true
    })
    .sort((a, b) => (b.profit_score || 0) - (a.profit_score || 0))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Amazon リサーチツール</h1>
        <p className="text-muted-foreground mt-2">
          Amazon商品を検索・分析して利益計算を実行
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">登録商品数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均スコア</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProfitScore.toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高利益商品</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highProfitCount}</div>
            <p className="text-xs text-muted-foreground">スコア80以上</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在庫あり</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inStockCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* 検索バー */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="商品名、ASIN、キーワードを入力..."
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? '検索中...' : '検索'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* フィルター */}
      <AmazonSearchFilters 
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* 商品タブ */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">グリッド表示</TabsTrigger>
          <TabsTrigger value="list">リスト表示</TabsTrigger>
          <TabsTrigger value="chart">利益分析チャート</TabsTrigger>
          <TabsTrigger value="strategy">戦略設定</TabsTrigger>
          <TabsTrigger value="queue">処理キュー</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => (
              <AmazonProductCard 
                key={product.asin}
                product={product}
                onSendToEditing={handleSendToEditing}
                onCalculateProfit={handleCalculateProfit}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">商品が見つかりません</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <div key={product.asin} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">ASIN: {product.asin}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={product.profit_score && product.profit_score > 80 ? 'default' : 'secondary'}>
                        スコア: {product.profit_score || 0}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleSendToEditing(product)}>
                        編集へ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <AmazonProfitChart products={filteredProducts} />
        </TabsContent>

        <TabsContent value="strategy">
          <StrategyConfigPanel />
        </TabsContent>

        <TabsContent value="queue">
          <QueueManagementPanel />
        </TabsContent>
      </Tabs>
    </div>
  )

  async function handleSendToEditing(product: AmazonProduct) {
    try {
      const response = await fetch('/api/amazon/send-to-editing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.asin })
      })

      if (!response.ok) {
        throw new Error('Send to editing failed')
      }

      alert('編集ツールに送信しました')
    } catch (error) {
      console.error('Send to editing error:', error)
      alert('送信に失敗しました')
    }
  }

  async function handleCalculateProfit(product: AmazonProduct) {
    try {
      const response = await fetch('/api/amazon/calculate-profit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      })

      if (!response.ok) {
        throw new Error('Calculate profit failed')
      }

      const data = await response.json()
      alert(`利益計算完了: ¥${data.profit}`)
    } catch (error) {
      console.error('Calculate profit error:', error)
      alert('利益計算に失敗しました')
    }
  }
}
