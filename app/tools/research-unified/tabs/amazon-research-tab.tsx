/**
 * Amazon Research Tab
 * 既存のAmazon Research機能をそのまま活用
 */

'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Package, DollarSign, Star, TrendingUp, AlertCircle, Info, Copy, FileDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// 既存のコンポーネントをインポート
import { AmazonProductCard } from '@/components/amazon/amazon-product-card'
import { AmazonSearchFilters } from '@/components/amazon/amazon-search-filters'
import { AmazonProfitChart } from '@/components/amazon/amazon-profit-chart'
import { StrategyConfigPanel } from '@/components/amazon/strategy-config-panel'

interface AmazonProduct {
  id: string
  asin: string
  title: string
  brand?: string
  current_price?: number
  images_primary?: any
  profit_score?: number
  profit_amount?: number
  is_prime_eligible?: boolean
  star_rating?: number
}

export default function AmazonResearchTab() {
  const [products, setProducts] = useState<AmazonProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [searchMode, setSearchMode] = useState<'keyword' | 'asin' | 'batch'>('asin')
  const [searchInput, setSearchInput] = useState('')
  const [batchInput, setBatchInput] = useState('')
  const [marketplace, setMarketplace] = useState('JP')
  const [apiStatus, setApiStatus] = useState({ keepa: false, paapi: false })
  const [filters, setFilters] = useState({
    minPrice: undefined,
    maxPrice: undefined,
    category: undefined,
    primeOnly: false,
    minRating: undefined
  })

  useEffect(() => {
    loadProducts()
    checkApiStatus()
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

  const checkApiStatus = async () => {
    try {
      const keepaRes = await fetch('/api/keepa/token-status').catch(() => null)
      setApiStatus({
        keepa: keepaRes?.ok || false,
        paapi: !!process.env.NEXT_PUBLIC_AMAZON_ACCESS_KEY
      })
    } catch (error) {
      console.error('API status check error:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchInput.trim() && !batchInput.trim()) return

    try {
      setLoading(true)
      
      if (searchMode === 'batch') {
        // バッチ処理
        const asins = batchInput.split('\n').filter(line => line.trim())
        const response = await fetch('/api/research-table/amazon-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asins,
            marketplace,
            useKeepa: apiStatus.keepa
          })
        })
        
        if (response.ok) {
          await loadProducts()
        }
      } else {
        // 通常検索
        const response = await fetch('/api/amazon/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keywords: searchInput,
            mode: searchMode,
            marketplace,
            ...filters
          })
        })

        if (response.ok) {
          await loadProducts()
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('検索に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['ASIN', 'Title', 'Price', 'Profit Score', 'Profit Amount'].join(','),
      ...products.map(p => [
        p.asin,
        `"${p.title}"`,
        p.current_price || 0,
        p.profit_score || 0,
        p.profit_amount || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `amazon-research-${Date.now()}.csv`
    a.click()
  }

  const handlePasteASINs = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setBatchInput(text)
    } catch (error) {
      console.error('Paste error:', error)
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
    <div className="space-y-4">
      {/* API状態表示 */}
      {!apiStatus.keepa && !apiStatus.paapi && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API未設定</AlertTitle>
          <AlertDescription>
            Keepa APIまたはPA-APIの設定が必要です。
            .env.localに KEEPA_API_KEY を追加してください。
          </AlertDescription>
        </Alert>
      )}

      {/* 検索パネル */}
      <Card>
        <CardHeader>
          <CardTitle>Amazon商品検索</CardTitle>
          <CardDescription>
            ASIN、キーワード、またはバッチ処理で商品を検索
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 検索モード選択 */}
          <div className="flex gap-2">
            <Button
              variant={searchMode === 'asin' ? 'default' : 'outline'}
              onClick={() => setSearchMode('asin')}
              className="flex-1"
            >
              ASIN検索
            </Button>
            <Button
              variant={searchMode === 'keyword' ? 'default' : 'outline'}
              onClick={() => setSearchMode('keyword')}
              className="flex-1"
            >
              キーワード検索
            </Button>
            <Button
              variant={searchMode === 'batch' ? 'default' : 'outline'}
              onClick={() => setSearchMode('batch')}
              className="flex-1"
            >
              バッチ処理
            </Button>
          </div>

          {/* マーケットプレイス選択 */}
          <div>
            <Label>マーケットプレイス</Label>
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JP">🇯🇵 日本</SelectItem>
                <SelectItem value="US">🇺🇸 アメリカ</SelectItem>
                <SelectItem value="UK">🇬🇧 イギリス</SelectItem>
                <SelectItem value="DE">🇩🇪 ドイツ</SelectItem>
                <SelectItem value="FR">🇫🇷 フランス</SelectItem>
                <SelectItem value="CA">🇨🇦 カナダ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 入力フィールド */}
          {searchMode === 'batch' ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>ASIN一括入力（1行に1つ）</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePasteASINs}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  貼り付け
                </Button>
              </div>
              <Textarea
                placeholder={`B08N5WRWNW\nB07XJ8BKDS\nB09YV3K3SY\n...`}
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                className="h-32 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {batchInput.split('\n').filter(l => l.trim()).length} ASINs
              </p>
            </div>
          ) : (
            <div>
              <Label>{searchMode === 'asin' ? 'ASIN' : 'キーワード'}</Label>
              <Input
                placeholder={searchMode === 'asin' ? 'B08N5WRWNW' : 'wireless headphones'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          )}

          {/* フィルター */}
          {searchMode !== 'batch' && (
            <AmazonSearchFilters
              filters={filters}
              onChange={setFilters}
            />
          )}

          {/* 検索ボタン */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="flex-1"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? '検索中...' : '検索開始'}
            </Button>
            {products.length > 0 && (
              <Button
                variant="outline"
                onClick={handleExport}
              >
                <FileDown className="w-4 h-4 mr-2" />
                エクスポート
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 結果表示タブ */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">グリッド表示</TabsTrigger>
          <TabsTrigger value="list">リスト表示</TabsTrigger>
          <TabsTrigger value="chart">分析チャート</TabsTrigger>
          <TabsTrigger value="strategy">戦略設定</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">商品が見つかりません</p>
              <p className="text-sm text-muted-foreground mt-2">
                検索条件を変更して再度お試しください
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <AmazonProductCard
                  key={product.id}
                  product={product as any}
                  onUpdate={loadProducts}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>商品リスト（{filteredProducts.length}件）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{product.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">{product.asin}</span>
                        {product.brand && (
                          <span className="text-xs text-muted-foreground">{product.brand}</span>
                        )}
                        {product.is_prime_eligible && (
                          <Badge variant="outline" className="text-xs">Prime</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {marketplace === 'JP' ? '¥' : '$'}
                          {product.current_price?.toLocaleString()}
                        </p>
                        {product.profit_amount !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            利益: {marketplace === 'JP' ? '¥' : '$'}
                            {product.profit_amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {product.profit_score !== undefined && (
                        <div className={`
                          w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white
                          ${product.profit_score >= 80 ? 'bg-green-500' : 
                            product.profit_score >= 60 ? 'bg-blue-500' : 
                            product.profit_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                        `}>
                          {product.profit_score}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <AmazonProfitChart products={filteredProducts as any} />
        </TabsContent>

        <TabsContent value="strategy">
          <StrategyConfigPanel />
        </TabsContent>
      </Tabs>

      {/* ヘルプ情報 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            使い方のヒント
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• ASINは10文字の英数字です（例: B08N5WRWNW）</p>
          <p>• バッチ処理では最大1000個まで一括処理可能</p>
          <p>• ExcelやGoogleスプレッドシートからコピペできます</p>
          <p>• API制限: Keepa月間トークン制限あり</p>
        </CardContent>
      </Card>
    </div>
  )
}
