/**
 * Yahoo Research Tab
 * Yahoo Auctions リサーチ
 */

'use client'

import { useState } from 'react'
import { Search, Package, TrendingUp, Gavel, Info, Copy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface YahooItem {
  id: string
  auctionId: string
  title: string
  currentPrice: number
  bidCount: number
  endTime: string
  sellerRating: number
  imageUrl?: string
  url?: string
}

export default function YahooResearchTab() {
  const [items, setItems] = useState<YahooItem[]>([])
  const [loading, setLoading] = useState(false)
  const [inputData, setInputData] = useState('')
  const [searchMode, setSearchMode] = useState<'id' | 'url' | 'keyword'>('keyword')

  const handleSearch = async () => {
    if (!inputData.trim()) return

    setLoading(true)
    try {
      // スクレイピングAPIコール（仮実装）
      const response = await fetch('/api/scraping/yahoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: searchMode,
          data: inputData.split('\n').filter(l => l.trim())
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputData(text)
    } catch (error) {
      console.error('Paste error:', error)
    }
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Yahoo Auctionsリサーチ</AlertTitle>
        <AlertDescription>
          ヤフオクの落札相場や出品者情報を分析します。
          スクレイピングによるデータ取得のため、レート制限にご注意ください。
        </AlertDescription>
      </Alert>

      {/* 検索パネル */}
      <Card>
        <CardHeader>
          <CardTitle>Yahoo Auctions検索</CardTitle>
          <CardDescription>
            商品ID、URL、またはキーワードで検索
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 検索モード */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={searchMode === 'keyword' ? 'default' : 'outline'}
              onClick={() => setSearchMode('keyword')}
            >
              キーワード
            </Button>
            <Button
              variant={searchMode === 'id' ? 'default' : 'outline'}
              onClick={() => setSearchMode('id')}
            >
              商品ID
            </Button>
            <Button
              variant={searchMode === 'url' ? 'default' : 'outline'}
              onClick={() => setSearchMode('url')}
            >
              URL
            </Button>
          </div>

          {/* 入力 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>
                {searchMode === 'keyword' && 'キーワード入力'}
                {searchMode === 'id' && '商品ID入力（1行に1つ）'}
                {searchMode === 'url' && 'URL入力（1行に1つ）'}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
              >
                <Copy className="w-4 h-4 mr-2" />
                貼り付け
              </Button>
            </div>
            {searchMode === 'keyword' ? (
              <Input
                placeholder="例: ロレックス サブマリーナ"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            ) : (
              <Textarea
                placeholder={searchMode === 'id' ? 
                  'n123456789\nm987654321\n...' :
                  'https://page.auctions.yahoo.co.jp/jp/auction/...\n...'
                }
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="h-32 font-mono text-sm"
              />
            )}
          </div>

          {/* カテゴリ選択 */}
          <div>
            <Label>カテゴリ</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="antique">アンティーク</SelectItem>
                <SelectItem value="brand">ブランド品</SelectItem>
                <SelectItem value="electronics">家電</SelectItem>
                <SelectItem value="fashion">ファッション</SelectItem>
                <SelectItem value="hobby">ホビー</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 検索ボタン */}
          <Button 
            onClick={handleSearch}
            disabled={loading || !inputData.trim()}
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? '検索中...' : '検索開始'}
          </Button>
        </CardContent>
      </Card>

      {/* 結果表示 */}
      <Card>
        <CardHeader>
          <CardTitle>検索結果</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Gavel className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">オークションデータがありません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-8 h-8 m-auto mt-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>ID: {item.auctionId}</span>
                      <span>入札: {item.bidCount}件</span>
                      <span>評価: ⭐{item.sellerRating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      終了: {new Date(item.endTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-purple-600">
                      ¥{item.currentPrice.toLocaleString()}
                    </p>
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        商品ページ →
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
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            Yahoo Auctionsリサーチのポイント
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• 終了済みオークションで落札相場を確認</p>
          <p>• 出品者の評価が1000以上が信頼できる</p>
          <p>• 入札件数が多い = 需要が高い</p>
          <p>• スクレイピング制限: 1分間に10リクエストまで</p>
        </CardContent>
      </Card>
    </div>
  )
}
