/**
 * Batch Process Tab
 */

'use client'

import { useState } from 'react'
import { Upload, Package, Copy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function BatchProcessTab() {
  const [batchData, setBatchData] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleProcess = async () => {
    setProcessing(true)
    setProgress(0)
    
    // プログレスシミュレーション
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setProcessing(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText()
    setBatchData(text)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>バッチ処理</CardTitle>
          <CardDescription>
            複数のASINやキーワードを一括処理
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handlePaste}>
              <Copy className="h-4 w-4 mr-2" />
              貼り付け
            </Button>
          </div>
          
          <Textarea
            placeholder="ASIN、キーワードを1行に1つずつ入力..."
            value={batchData}
            onChange={(e) => setBatchData(e.target.value)}
            className="h-48"
          />
          
          {processing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">
                処理中... {progress}%
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleProcess}
            disabled={processing || !batchData.trim()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {processing ? '処理中...' : 'バッチ処理開始'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
