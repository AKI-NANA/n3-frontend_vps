'use client'

import { useState } from 'react'
import { Search, Loader2, CheckSquare, Square, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { ResearchProduct } from '../page'

interface DataAcquisitionTabProps {
  products: ResearchProduct[]
  onProductsAdded: (products: ResearchProduct[]) => void
  selectedProducts: string[]
  onToggleSelection: (productId: string) => void
  onToggleSelectAll: (products: ResearchProduct[]) => void
  onMoveToScoring: (productIds: string[]) => void
}

export default function DataAcquisitionTab({
  products,
  onProductsAdded,
  selectedProducts,
  onToggleSelection,
  onToggleSelectAll,
  onMoveToScoring,
}: DataAcquisitionTabProps) {
  const [loading, setLoading] = useState(false)
  const [searchSource, setSearchSource] = useState<'ebay' | 'amazon'>('ebay')

  // eBay検索フォーム
  const [ebayForm, setEbayForm] = useState({
    keyword: '',
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    minSold: '1',
  })

  // Amazon検索フォーム
  const [amazonForm, setAmazonForm] = useState({
    keywords: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    primeOnly: false,
  })

  // eBay検索実行
  const handleEbaySearch = async () => {
    if (!ebayForm.keyword) {
      toast.error('キーワードを入力してください')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ebay/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: ebayForm.keyword,
          categoryId: ebayForm.category || undefined,
          condition: ebayForm.condition || undefined,
          minPrice: ebayForm.minPrice || undefined,
          maxPrice: ebayForm.maxPrice || undefined,
          minSold: ebayForm.minSold || '1',
        }),
      })

      if (!response.ok) {
        throw new Error('eBay検索に失敗しました')
      }

      const data = await response.json()
      const newProducts: ResearchProduct[] = data.products.map((p: Record<string, unknown>) => ({
        id: `ebay-${p.ebayItemId || p.id}`,
        source: 'ebay' as const,
        ebayItemId: p.ebayItemId,
        title: p.title,
        titleJP: p.titleJP,
        price: p.price,
        soldCount: p.soldCount || 0,
        competitorCount: p.competitorCount,
        image: p.image,
        url: p.viewItemURL,
        category: p.category,
        condition: p.condition,
        seller: p.seller,
        status: 'fetched' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      onProductsAdded(newProducts)
      toast.success(`${newProducts.length}件の商品を取得しました`)
    } catch (error) {
      console.error('eBay search error:', error)
      toast.error('eBay検索に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // Amazon検索実行
  const handleAmazonSearch = async () => {
    if (!amazonForm.keywords) {
      toast.error('キーワードを入力してください')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/amazon/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(amazonForm),
      })

      if (!response.ok) {
        throw new Error('Amazon検索に失敗しました')
      }

      const data = await response.json()
      const newProducts: ResearchProduct[] = data.products.map((p: Record<string, unknown>) => ({
        id: `amazon-${p.asin || p.id}`,
        source: 'amazon' as const,
        asin: p.asin,
        title: p.title,
        price: p.price,
        soldCount: 0,
        image: p.image_url,
        url: p.detail_page_url,
        category: p.product_group,
        condition: 'New',
        status: 'fetched' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      onProductsAdded(newProducts)
      toast.success(`${newProducts.length}件の商品を取得しました`)
    } catch (error) {
      console.error('Amazon search error:', error)
      toast.error('Amazon検索に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // スコアリングへ移動
  const handleMoveToScoring = () => {
    if (selectedProducts.length === 0) {
      toast.error('商品を選択してください')
      return
    }
    onMoveToScoring(selectedProducts)
    toast.success(`${selectedProducts.length}件をスコアリングタブへ移動しました`)
  }

  return (
    <div className="space-y-6">
      {/* 検索フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>データ取得</CardTitle>
          <CardDescription>eBayまたはAmazonから商品データを検索・取得します</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={searchSource} onValueChange={(v) => setSearchSource(v as 'ebay' | 'amazon')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ebay">eBay検索</TabsTrigger>
              <TabsTrigger value="amazon">Amazon検索</TabsTrigger>
            </TabsList>

            {/* eBay検索フォーム */}
            <TabsContent value="ebay" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">キーワード</label>
                  <Input
                    placeholder="例: Vintage Camera"
                    value={ebayForm.keyword}
                    onChange={(e) => setEbayForm({ ...ebayForm, keyword: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleEbaySearch()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">カテゴリ</label>
                  <Select value={ebayForm.category} onValueChange={(v) => setEbayForm({ ...ebayForm, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">すべて</SelectItem>
                      <SelectItem value="293">Electronics</SelectItem>
                      <SelectItem value="11450">Clothing</SelectItem>
                      <SelectItem value="11700">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">コンディション</label>
                  <Select value={ebayForm.condition} onValueChange={(v) => setEbayForm({ ...ebayForm, condition: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">すべて</SelectItem>
                      <SelectItem value="New">新品</SelectItem>
                      <SelectItem value="Used">中古</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">最低価格 ($)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={ebayForm.minPrice}
                    onChange={(e) => setEbayForm({ ...ebayForm, minPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">最高価格 ($)</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={ebayForm.maxPrice}
                    onChange={(e) => setEbayForm({ ...ebayForm, maxPrice: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleEbaySearch} disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                eBayで検索
              </Button>
            </TabsContent>

            {/* Amazon検索フォーム */}
            <TabsContent value="amazon" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">キーワード</label>
                  <Input
                    placeholder="例: Wireless Headphones"
                    value={amazonForm.keywords}
                    onChange={(e) => setAmazonForm({ ...amazonForm, keywords: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAmazonSearch()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">最低価格 ($)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amazonForm.minPrice}
                    onChange={(e) => setAmazonForm({ ...amazonForm, minPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">最高価格 ($)</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={amazonForm.maxPrice}
                    onChange={(e) => setAmazonForm({ ...amazonForm, maxPrice: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAmazonSearch} disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Amazonで検索
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 取得結果 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>取得結果</CardTitle>
              <CardDescription>{products.length}件の商品</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleSelectAll(products)}
              >
                {selectedProducts.length === products.length ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
                全選択
              </Button>
              <Button
                onClick={handleMoveToScoring}
                disabled={selectedProducts.length === 0}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                スコアリングへ ({selectedProducts.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              検索を実行して商品を取得してください
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all ${
                    selectedProducts.includes(product.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => onToggleSelection(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={product.source === 'ebay' ? 'default' : 'secondary'}>
                            {product.source.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-blue-600">${product.price}</span>
                          {product.soldCount > 0 && (
                            <span className="text-gray-500">販売: {product.soldCount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
