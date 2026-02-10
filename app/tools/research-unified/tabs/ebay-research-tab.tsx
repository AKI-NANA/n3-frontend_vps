/**
 * eBay Research Tab
 * eBay売れ筋分析、セラー分析、キーワード検索
 */

'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Users, Package, DollarSign, Globe, Filter, AlertCircle, Info, Copy, FileDown, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface EbayItem {
  id: string
  itemId: string
  title: string
  price: number
  currency: string
  soldCount?: number
  sellerName?: string
  condition?: string
  imageUrl?: string
  listingUrl?: string
  profitScore?: number
  endTime?: string
}

export default function EbayResearchTab() {
  const [items, setItems] = useState<EbayItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchMode, setSearchMode] = useState<'sold' | 'seller' | 'keyword'>('sold')
  const [searchInput, setSearchInput] = useState('')
  const [marketplace, setMarketplace] = useState('EBAY_US')
  const [apiStatus, setApiStatus] = useState(false)
  const [filters, setFilters] = useState({
    condition: 'ALL',
    listingType: 'ALL',
    priceMin: '',
    priceMax: '',
    sortBy: 'BEST_MATCH'
  })

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/ebay/auth/status')
      setApiStatus(response.ok)
    } catch (error) {
      console.error('API status check error:', error)
      setApiStatus(false)
    }
  }

  const handleSearch = async () => {
    if (!searchInput.trim()) return

    try {
      setLoading(true)
      
      let endpoint = ''
      let body = {}
      
      switch (searchMode) {
        case 'sold':
          endpoint = '/api/research-table/ebay-sold'
          body = {
            keywords: searchInput,
            marketplace,
            filters
          }
          break
        case 'seller':
          endpoint = '/api/research-table/ebay-seller-batch'
          body = {
            sellerIds: searchInput.split('\n').filter(l => l.trim()),
            marketplace
          }
          break
        case 'keyword':
          endpoint = '/api/research-table/product-search'
          body = {
            keywords: searchInput,
            marketplace: 'ebay',
            region: marketplace,
            filters
          }
          break
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      } else {
        throw new Error('Search failed')
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
      ['Item ID', 'Title', 'Price', 'Sold Count', 'Seller', 'Score'].join(','),
      ...items.map(item => [
        item.itemId,
        `"${item.title}"`,
        `${item.price} ${item.currency}`,
        item.soldCount || 0,
        item.sellerName || '',
        item.profitScore || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ebay-research-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="space-y-4">
      {/* API状態 */}
      {!apiStatus && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>eBay API未認証</AlertTitle>
          <AlertDescription>
            eBay APIの認証が必要です。
            <a href="/tools/settings-n3?tab=ebay" className="underline ml-1">
              設定画面から認証
            </a>
          </AlertDescription>
        </Alert>
      )}

      {/* 検索パネル */}
      <Card>
        <CardHeader>
          <CardTitle>eBay商品リサーチ</CardTitle>
          <CardDescription>
            売れ筋商品の分析、セラー分析、キーワード検索
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 検索モード */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={searchMode === 'sold' ? 'default' : 'outline'}
              onClick={() => setSearchMode('sold')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              売れ筋分析
            </Button>
            <Button
              variant={searchMode === 'seller' ? 'default' : 'outline'}
              onClick={() => setSearchMode('seller')}
            >
              <Users className="w-4 h-4 mr-2" />
              セラー分析
            </Button>
            <Button
              variant={searchMode === 'keyword' ? 'default' : 'outline'}
              onClick={() => setSearchMode('keyword')}
            >
              <Search className="w-4 h-4 mr-2" />
              キーワード
            </Button>
          </div>

          {/* マーケット選択 */}
          <div>
            <Label>マーケットプレイス</Label>
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EBAY_US">🇺🇸 United States</SelectItem>
                <SelectItem value="EBAY_UK">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="EBAY_DE">🇩🇪 Germany</SelectItem>
                <SelectItem value="EBAY_AU">🇦🇺 Australia</SelectItem>
                <SelectItem value="EBAY_CA">🇨🇦 Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* フィルター */}
          {searchMode !== 'seller' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>商品状態</Label>
                <Select 
                  value={filters.condition} 
                  onValueChange={(v) => setFilters({...filters, condition: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">すべて</SelectItem>
                    <SelectItem value="NEW">新品</SelectItem>
                    <SelectItem value="USED">中古</SelectItem>
                    <SelectItem value="REFURBISHED">整備済み</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>出品形式</Label>
                <Select 
                  value={filters.listingType} 
                  onValueChange={(v) => setFilters({...filters, listingType: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">すべて</SelectItem>
                    <SelectItem value="AUCTION">オークション</SelectItem>
                    <SelectItem value="BUY_IT_NOW">即決</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>最低価格</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                />
              </div>

              <div>
                <Label>最高価格</Label>
                <Input
                  type="number"
                  placeholder="999999"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* 入力フィールド */}
          <div>
            <Label>
              {searchMode === 'sold' && '検索キーワード（売れ筋商品）'}
              {searchMode === 'seller' && 'セラーID（1行に1つ）'}
              {searchMode === 'keyword' && '検索キーワード'}
            </Label>
            {searchMode === 'seller' ? (
              <Textarea
                placeholder={`seller_name_1\nseller_name_2\n...`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-32 font-mono text-sm"
              />
            ) : (
              <Input
                placeholder={searchMode === 'sold' ? 'vintage rolex watch' : 'wireless headphones'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            )}
          </div>

          {/* 検索ボタン */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={loading || !apiStatus}
              className="flex-1"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? '検索中...' : '検索開始'}
            </Button>
            {items.length > 0 && (
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

      {/* 結果表示 */}
      <Card>
        <CardHeader>
          <CardTitle>検索結果（{items.length}件）</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">検索中...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">商品が見つかりません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  {/* 画像 */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 商品情報 */}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        ID: {item.itemId}
                      </span>
                      {item.sellerName && (
                        <span className="text-xs text-muted-foreground">
                          Seller: {item.sellerName}
                        </span>
                      )}
                      {item.condition && (
                        <Badge variant="outline" className="text-xs">
                          {item.condition}
                        </Badge>
                      )}
                    </div>
                    {item.soldCount && (
                      <p className="text-xs text-green-600 mt-1">
                        {item.soldCount} sold
                      </p>
                    )}
                  </div>

                  {/* 価格とスコア */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {item.currency} {item.price.toLocaleString()}
                      </p>
                      {item.endTime && (
                        <p className="text-xs text-muted-foreground">
                          終了: {new Date(item.endTime).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {item.profitScore !== undefined && (
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white
                        ${item.profitScore >= 80 ? 'bg-green-500' : 
                          item.profitScore >= 60 ? 'bg-blue-500' : 
                          item.profitScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                      `}>
                        {item.profitScore}
                      </div>
                    )}
                    {item.listingUrl && (
                      <a
                        href={item.listingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ヘルプ */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            eBayリサーチのポイント
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• 売れ筋分析: Sold Listingsから需要の高い商品を発見</p>
          <p>• セラー分析: 成功セラーの商品ラインナップを研究</p>
          <p>• 価格帯設定: 利益が出やすい$50-$500がおすすめ</p>
          <p>• API制限: 1日5,000コールまで</p>
        </CardContent>
      </Card>
    </div>
  )
}
