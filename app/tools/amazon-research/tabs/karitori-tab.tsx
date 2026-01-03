/**
 * Karitori Tab
 */

'use client'

import { useState } from 'react'
import { Clock, Bell, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

export default function KaritoriTab() {
  const [asin, setAsin] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [items, setItems] = useState<any[]>([])

  const handleAdd = () => {
    if (asin && targetPrice) {
      setItems([...items, {
        id: Date.now(),
        asin,
        targetPrice: Number(targetPrice),
        currentPrice: Math.random() * 10000 + 1000,
        status: 'active'
      }])
      setAsin('')
      setTargetPrice('')
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>価格監視（刈り取り）</CardTitle>
          <CardDescription>
            目標価格に達したら自動通知
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ASIN</Label>
              <Input
                placeholder="B08N5WRWNW"
                value={asin}
                onChange={(e) => setAsin(e.target.value)}
              />
            </div>
            <div>
              <Label>目標価格</Label>
              <Input
                type="number"
                placeholder="5000"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            監視追加
          </Button>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <div className="grid gap-4">
          {items.map(item => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">ASIN: {item.asin}</p>
                    <p className="text-sm text-muted-foreground">
                      現在: ¥{item.currentPrice.toFixed(0)} → 目標: ¥{item.targetPrice}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    <Clock className="h-3 w-3 mr-1" />
                    監視中
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
