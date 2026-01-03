/**
 * eBay Research Tab
 * Amazon Researchのコンポーネントスタイルを踏襲
 */

'use client'

import { useState } from 'react'
import { Search, TrendingUp, DollarSign, Package, ExternalLink, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface EbayItem {
  id: string
  itemId: string
  title: string
  price: number
  soldPrice?: number
  currency: string
  condition: string
  seller: string
  soldCount: number
  imageUrl?: string
  listingUrl?: string
  profitScore?: number
}

export default function EbayResearchTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<EbayItem[]>([])
  const [loading, setLoading] = useState(false)
  const [marketplace, setMarketplace] = useState('US')
  const [filters, setFilters] = useState({
    condition: 'all',
    minPrice: 0,
    maxPrice: 10000,
    soldOnly: true
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/research-table/ebay-sold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: searchQuery,
          marketplace,
          ...filters
        })
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 検索セクション */}
      <Card>
        <CardHeader>
          <CardTitle>eBay売れ筋リサーチ</CardTitle>
          <CardDescription>
            eBayの売れ筋商品を分析して利益の高い商品を発見
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">eBay.com</SelectItem>
                <SelectItem value="UK">eBay.co.uk</SelectItem>
                <SelectItem value="DE">eBay.de</SelectItem>
                <SelectItem value="AU">eBay.com.au</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="キーワード、商品名、カテゴリーを入力..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* 結果表示 */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">eBay商品を検索してください</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    ${item.soldPrice || item.price}
                  </span>
                  <Badge variant="outline">{item.condition}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>販売者: {item.seller}</p>
                  <p>販売数: {item.soldCount}個</p>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  eBayで確認
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
