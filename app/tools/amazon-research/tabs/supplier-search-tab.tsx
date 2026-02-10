/**
 * Supplier Search Tab
 */

'use client'

import { useState } from 'react'
import { Store, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function SupplierSearchTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    setLoading(true)
    
    setTimeout(() => {
      setSuppliers([
        {
          id: 1,
          name: 'Amazon Japan',
          price: 5980,
          availability: 'in_stock',
          rating: 4.5
        },
        {
          id: 2,
          name: '楽天市場',
          price: 5500,
          availability: 'in_stock',
          rating: 4.2
        }
      ])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>仕入先探索</CardTitle>
          <CardDescription>
            最適な仕入先を自動検索
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="商品名、ASINを入力..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? '検索中...' : '探索'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {suppliers.length > 0 && (
        <div className="grid gap-4">
          {suppliers.map(supplier => (
            <Card key={supplier.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{supplier.name}</h3>
                    <p className="text-2xl font-bold mt-1">¥{supplier.price}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-green-50">
                      在庫あり
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      評価: {supplier.rating}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
