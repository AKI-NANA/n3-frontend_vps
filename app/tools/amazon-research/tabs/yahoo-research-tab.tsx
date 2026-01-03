/**
 * Yahoo Research Tab
 */

'use client'

import { useState } from 'react'
import { Search, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function YahooResearchTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Yahoo Auctionsリサーチ</CardTitle>
          <CardDescription>
            ヤフオクの落札相場を分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="商品名、キーワードを入力..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              検索
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Yahoo Auction商品を検索してください</p>
        </CardContent>
      </Card>
    </div>
  )
}
