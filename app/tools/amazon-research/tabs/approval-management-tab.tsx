/**
 * Approval Management Tab
 */

'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

export default function ApprovalManagementTab() {
  const [items, setItems] = useState([
    {
      id: 1,
      asin: 'B08N5WRWNW',
      title: 'Echo Dot (第4世代)',
      profitScore: 85,
      status: 'pending'
    },
    {
      id: 2,
      asin: 'B09V2KXJPB',
      title: 'Fire TV Stick 4K Max',
      profitScore: 72,
      status: 'pending'
    }
  ])
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

  const handleApprove = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ))
  }

  const handleReject = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ))
  }

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>承認管理</CardTitle>
          <CardDescription>
            リサーチ結果の承認・却下・編集送信
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-green-50">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              一括承認
            </Button>
            <Button variant="outline" className="bg-red-50">
              <XCircle className="h-4 w-4 mr-2 text-red-600" />
              一括却下
            </Button>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              編集へ送信
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {items.map(item => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      ASIN: {item.asin} | スコア: {item.profitScore}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.status === 'approved' && (
                    <Badge className="bg-green-100 text-green-700">承認済</Badge>
                  )}
                  {item.status === 'rejected' && (
                    <Badge className="bg-red-100 text-red-700">却下済</Badge>
                  )}
                  {item.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApprove(item.id)}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReject(item.id)}
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
