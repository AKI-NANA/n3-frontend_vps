/**
 * Approval Management Tab
 * リサーチ結果の承認・却下管理
 */

'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Send, Filter, RefreshCw, Package, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

interface ResearchItem {
  id: string
  asin?: string
  title: string
  titleEn?: string
  marketplace: string
  price: number
  supplierPrice: number
  profitMargin: number
  profitScore: number
  status: 'new' | 'approved' | 'rejected' | 'promoted'
  imageUrl?: string
  createdAt: string
  analyzedAt?: string
}

export default function ApprovalManagementTab() {
  const router = useRouter()
  const [items, setItems] = useState<ResearchItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('score')

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/research-table/list')
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Load items error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch('/api/research-table/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (response.ok) {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'approved' } : item
        ))
      }
    } catch (error) {
      console.error('Approve error:', error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch('/api/research-table/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (response.ok) {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'rejected' } : item
        ))
      }
    } catch (error) {
      console.error('Reject error:', error)
    }
  }

  const handleBulkApprove = async () => {
    for (const id of selectedItems) {
      await handleApprove(id)
    }
    setSelectedItems(new Set())
  }

  const handleBulkReject = async () => {
    for (const id of selectedItems) {
      await handleReject(id)
    }
    setSelectedItems(new Set())
  }

  const handleSendToEditing = async () => {
    const approvedIds = Array.from(selectedItems).filter(id => {
      const item = items.find(i => i.id === id)
      return item?.status === 'approved'
    })

    if (approvedIds.length === 0) {
      alert('承認済みの商品を選択してください')
      return
    }

    try {
      const response = await fetch('/api/research-table/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: approvedIds })
      })
      
      if (response.ok) {
        alert(`${approvedIds.length}件をEditing N3に送信しました`)
        router.push('/tools/editing-n3')
      }
    } catch (error) {
      console.error('Promote error:', error)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map(i => i.id)))
    }
  }

  // フィルターとソート
  const filteredItems = items
    .filter(item => {
      if (filter === 'all') return true
      return item.status === filter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.profitScore || 0) - (a.profitScore || 0)
        case 'margin':
          return (b.profitMargin || 0) - (a.profitMargin || 0)
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const stats = {
    total: items.length,
    new: items.filter(i => i.status === 'new').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length,
    promoted: items.filter(i => i.status === 'promoted').length
  }

  const getStatusBadge = (status: ResearchItem['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />新規</Badge>
      case 'approved':
        return <Badge className="success"><CheckCircle className="w-3 h-3 mr-1" />承認</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />却下</Badge>
      case 'promoted':
        return <Badge variant="default"><Send className="w-3 h-3 mr-1" />送信済</Badge>
      default:
        return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-blue-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-4">
      {/* 統計 */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">総数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">新規</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-600">{stats.new}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">承認</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">却下</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">送信済</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.promoted}</p>
          </CardContent>
        </Card>
      </div>

      {/* アクションバー */}
      <Card>
        <CardHeader>
          <CardTitle>一括操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={selectAll}
              >
                {selectedItems.size === filteredItems.length ? '選択解除' : 'すべて選択'}
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleBulkApprove}
                disabled={selectedItems.size === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                一括承認（{selectedItems.size}件）
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkReject}
                disabled={selectedItems.size === 0}
              >
                <XCircle className="w-4 h-4 mr-2" />
                一括却下（{selectedItems.size}件）
              </Button>
              <Button
                onClick={handleSendToEditing}
                disabled={selectedItems.size === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Editing N3へ送信
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="new">新規</SelectItem>
                  <SelectItem value="approved">承認</SelectItem>
                  <SelectItem value="rejected">却下</SelectItem>
                  <SelectItem value="promoted">送信済</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">スコア順</SelectItem>
                  <SelectItem value="margin">利益率順</SelectItem>
                  <SelectItem value="date">日付順</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={loadItems}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* テーブル */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">データがありません</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                        onCheckedChange={() => selectAll()}
                      />
                    </th>
                    <th className="p-3 text-left text-sm font-medium">画像</th>
                    <th className="p-3 text-left text-sm font-medium">商品情報</th>
                    <th className="p-3 text-left text-sm font-medium">価格</th>
                    <th className="p-3 text-left text-sm font-medium">利益</th>
                    <th className="p-3 text-center text-sm font-medium">スコア</th>
                    <th className="p-3 text-left text-sm font-medium">状態</th>
                    <th className="p-3 text-center text-sm font-medium">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleSelect(item.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                        {item.titleEn && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.titleEn}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {item.asin && (
                            <Badge variant="outline" className="text-xs">{item.asin}</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">{item.marketplace}</Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold">${item.price}</p>
                        <p className="text-xs text-muted-foreground">
                          仕入: ¥{item.supplierPrice}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className={`font-semibold ${item.profitMargin >= 30 ? 'text-green-600' : ''}`}>
                          {item.profitMargin.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${((item.price - item.supplierPrice) * 0.01).toFixed(2)}
                        </p>
                      </td>
                      <td className="p-3 text-center">
                        <div className={`
                          inline-flex items-center justify-center
                          w-10 h-10 rounded-lg text-white font-bold
                          ${getScoreColor(item.profitScore)}
                        `}>
                          {item.profitScore}
                        </div>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(item.id)}
                            disabled={item.status === 'approved' || item.status === 'promoted'}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(item.id)}
                            disabled={item.status === 'rejected'}
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ヘルプ */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>承認管理フロー</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2 text-sm">
            <p>1. リサーチ結果が自動的に「新規」として登録</p>
            <p>2. スコアと利益率を確認して承認/却下を判断</p>
            <p>3. 承認済み商品はEditing N3へ送信可能</p>
            <p>4. 送信済み商品は自動的に「promoted」ステータスに</p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
