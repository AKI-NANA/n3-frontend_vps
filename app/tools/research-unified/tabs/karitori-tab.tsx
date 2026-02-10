/**
 * Karitori Tab
 * 刈り取り（価格監視）管理
 */

'use client'

import { useState, useEffect } from 'react'
import { Clock, Bell, TrendingDown, AlertCircle, Plus, Pause, Play, Trash2, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface KaritoriItem {
  id: string
  asin: string
  title: string
  currentPrice: number
  targetPrice: number
  originalPrice: number
  status: 'active' | 'paused' | 'triggered'
  checkInterval: number // hours
  lastChecked: Date
  priceHistory: { date: Date; price: number }[]
}

export default function KaritoriTab() {
  const [items, setItems] = useState<KaritoriItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    asin: '',
    targetPrice: '',
    checkInterval: '12'
  })

  useEffect(() => {
    loadKaritoriItems()
  }, [])

  const loadKaritoriItems = async () => {
    try {
      const response = await fetch('/api/research-table/karitori-check')
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Load karitori items error:', error)
    }
  }

  const handleAdd = async () => {
    if (!newItem.asin || !newItem.targetPrice) return

    try {
      const response = await fetch('/api/research-table/karitori-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asin: newItem.asin,
          targetPrice: parseFloat(newItem.targetPrice),
          checkInterval: parseInt(newItem.checkInterval)
        })
      })

      if (response.ok) {
        loadKaritoriItems()
        setShowAddForm(false)
        setNewItem({ asin: '', targetPrice: '', checkInterval: '12' })
      }
    } catch (error) {
      console.error('Add karitori error:', error)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ))
    
    // API更新
    await fetch(`/api/research-table/karitori-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    })
  }

  const deleteItem = async (id: string) => {
    if (!confirm('この監視を削除しますか？')) return

    setItems(prev => prev.filter(item => item.id !== id))
    
    await fetch(`/api/research-table/karitori-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success"><Play className="w-3 h-3 mr-1" />監視中</Badge>
      case 'paused':
        return <Badge variant="secondary"><Pause className="w-3 h-3 mr-1" />一時停止</Badge>
      case 'triggered':
        return <Badge variant="destructive"><Bell className="w-3 h-3 mr-1" />通知済</Badge>
    }
  }

  const triggeredCount = items.filter(i => i.status === 'triggered').length
  const activeCount = items.filter(i => i.status === 'active').length

  return (
    <div className="space-y-4">
      {/* 統計 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">監視中</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">通知済み</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{triggeredCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">総監視数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{items.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* 通知アラート */}
      {triggeredCount > 0 && (
        <Alert variant="destructive">
          <Bell className="h-4 w-4" />
          <AlertTitle>価格アラート!</AlertTitle>
          <AlertDescription>
            {triggeredCount}件の商品が目標価格に到達しました。すぐに確認してください。
          </AlertDescription>
        </Alert>
      )}

      {/* 新規追加フォーム */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>新規監視追加</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>ASIN</Label>
                <Input
                  placeholder="B08N5WRWNW"
                  value={newItem.asin}
                  onChange={(e) => setNewItem({...newItem, asin: e.target.value})}
                />
              </div>
              <div>
                <Label>目標価格</Label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={newItem.targetPrice}
                  onChange={(e) => setNewItem({...newItem, targetPrice: e.target.value})}
                />
              </div>
              <div>
                <Label>チェック間隔</Label>
                <Select 
                  value={newItem.checkInterval}
                  onValueChange={(v) => setNewItem({...newItem, checkInterval: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1時間</SelectItem>
                    <SelectItem value="6">6時間</SelectItem>
                    <SelectItem value="12">12時間</SelectItem>
                    <SelectItem value="24">24時間</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>追加</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>キャンセル</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* アクションバー */}
      <div className="flex justify-between">
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          新規監視追加
        </Button>
        <Button variant="outline" onClick={loadKaritoriItems}>
          <Clock className="w-4 h-4 mr-2" />
          更新
        </Button>
      </div>

      {/* 監視リスト */}
      <Card>
        <CardHeader>
          <CardTitle>監視リスト</CardTitle>
          <CardDescription>
            価格が目標値に達すると自動で通知されます
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">監視中の商品がありません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`
                    p-4 border rounded-lg
                    ${item.status === 'triggered' ? 'border-red-500 bg-red-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">ASIN: {item.asin}</p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">現在価格</p>
                      <p className="text-lg font-bold">
                        ¥{item.currentPrice?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">目標価格</p>
                      <p className="text-lg font-bold text-green-600">
                        ¥{item.targetPrice?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">元価格</p>
                      <p className="text-lg">
                        ¥{item.originalPrice?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">下落率</p>
                      <p className="text-lg font-bold text-red-600">
                        {item.originalPrice && item.currentPrice ? 
                          `-${((1 - item.currentPrice / item.originalPrice) * 100).toFixed(1)}%` : 
                          '-'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">
                      最終チェック: {item.lastChecked ? new Date(item.lastChecked).toLocaleString() : '-'}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(item.id, item.status)}
                      >
                        {item.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ヘルプ */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>刈り取り機能の使い方</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>ASINと目標価格を設定して監視開始</li>
            <li>設定した間隔で自動的に価格をチェック</li>
            <li>目標価格に達すると通知（メール/Slack）</li>
            <li>価格急落商品を逃さずキャッチ</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
