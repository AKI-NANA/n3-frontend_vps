/**
 * Batch Process Tab
 * 大量ASIN/商品ID一括処理
 */

'use client'

import { useState, useRef } from 'react'
import { Upload, FileDown, Play, Pause, RefreshCw, AlertCircle, CheckCircle, Clock, Package, Copy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'

interface BatchJob {
  id: string
  name: string
  type: 'amazon' | 'ebay' | 'mixed'
  status: 'pending' | 'processing' | 'completed' | 'error'
  total: number
  processed: number
  success: number
  failed: number
  startedAt?: Date
  completedAt?: Date
}

export default function BatchProcessTab() {
  const [jobs, setJobs] = useState<BatchJob[]>([])
  const [currentJob, setCurrentJob] = useState<BatchJob | null>(null)
  const [inputData, setInputData] = useState('')
  const [jobName, setJobName] = useState('')
  const [marketplace, setMarketplace] = useState('amazon')
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setInputData(text)
      setJobName(file.name.replace(/\.[^/.]+$/, ''))
    }
    reader.readAsText(file)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputData(text)
    } catch (error) {
      console.error('Paste error:', error)
    }
  }

  const startBatchProcess = async () => {
    if (!inputData.trim()) return

    const lines = inputData.split('\n').filter(l => l.trim())
    if (lines.length === 0) return

    const job: BatchJob = {
      id: Date.now().toString(),
      name: jobName || `Batch-${new Date().toLocaleString()}`,
      type: marketplace as 'amazon' | 'ebay',
      status: 'processing',
      total: lines.length,
      processed: 0,
      success: 0,
      failed: 0,
      startedAt: new Date()
    }

    setCurrentJob(job)
    setJobs(prev => [job, ...prev])
    setProcessing(true)

    // バッチ処理実行
    try {
      for (let i = 0; i < lines.length; i++) {
        const identifier = lines[i].trim()
        
        // APIコール
        const response = await fetch('/api/research-table/amazon-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asins: [identifier],
            marketplace: marketplace === 'amazon' ? 'JP' : 'EBAY_US',
            useKeepa: true
          })
        })

        // 進捗更新
        const success = response.ok
        setCurrentJob(prev => {
          if (!prev) return null
          return {
            ...prev,
            processed: i + 1,
            success: prev.success + (success ? 1 : 0),
            failed: prev.failed + (success ? 0 : 1)
          }
        })

        // レート制限対策
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // 完了
      setCurrentJob(prev => {
        if (!prev) return null
        return {
          ...prev,
          status: 'completed',
          completedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Batch process error:', error)
      setCurrentJob(prev => {
        if (!prev) return null
        return {
          ...prev,
          status: 'error'
        }
      })
    } finally {
      setProcessing(false)
    }
  }

  const exportResults = () => {
    const csv = [
      ['Job Name', 'Type', 'Status', 'Total', 'Success', 'Failed', 'Started', 'Completed'].join(','),
      ...jobs.map(job => [
        job.name,
        job.type,
        job.status,
        job.total,
        job.success,
        job.failed,
        job.startedAt?.toLocaleString() || '',
        job.completedAt?.toLocaleString() || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `batch-results-${Date.now()}.csv`
    a.click()
  }

  const getStatusBadge = (status: BatchJob['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />待機中</Badge>
      case 'processing':
        return <Badge variant="default"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />処理中</Badge>
      case 'completed':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />完了</Badge>
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />エラー</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* 入力パネル */}
      <Card>
        <CardHeader>
          <CardTitle>バッチ処理設定</CardTitle>
          <CardDescription>
            ASIN/商品IDを一括で処理（最大1000件）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ジョブ名 */}
          <div>
            <Label>ジョブ名</Label>
            <Input
              placeholder="例: 2024年12月 Amazon新商品"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
            />
          </div>

          {/* マーケットプレイス */}
          <div>
            <Label>マーケットプレイス</Label>
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amazon">Amazon (ASIN)</SelectItem>
                <SelectItem value="ebay">eBay (Item ID)</SelectItem>
                <SelectItem value="mixed">混合</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* データ入力 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>データ入力（1行に1つ）</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  CSVアップロード
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePaste}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  貼り付け
                </Button>
              </div>
            </div>
            <Textarea
              placeholder={marketplace === 'amazon' ? 
                `B08N5WRWNW\nB07XJ8BKDS\nB09YV3K3SY\n...` :
                `123456789012\n234567890123\n...`
              }
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="h-40 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {inputData.split('\n').filter(l => l.trim()).length} 件のデータ
            </p>
          </div>

          {/* ファイル入力（非表示） */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* 実行ボタン */}
          <Button
            onClick={startBatchProcess}
            disabled={processing || !inputData.trim()}
            className="w-full"
          >
            {processing ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                処理中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                バッチ処理開始
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 現在のジョブ進捗 */}
      {currentJob && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>現在の処理: {currentJob.name}</span>
              {getStatusBadge(currentJob.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={(currentJob.processed / currentJob.total) * 100} />
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">総数</p>
                <p className="text-xl font-bold">{currentJob.total}</p>
              </div>
              <div>
                <p className="text-muted-foreground">処理済み</p>
                <p className="text-xl font-bold">{currentJob.processed}</p>
              </div>
              <div>
                <p className="text-muted-foreground">成功</p>
                <p className="text-xl font-bold text-green-600">{currentJob.success}</p>
              </div>
              <div>
                <p className="text-muted-foreground">失敗</p>
                <p className="text-xl font-bold text-red-600">{currentJob.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ジョブ履歴 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ジョブ履歴</CardTitle>
            <CardDescription>過去のバッチ処理結果</CardDescription>
          </div>
          {jobs.length > 0 && (
            <Button variant="outline" onClick={exportResults}>
              <FileDown className="w-4 h-4 mr-2" />
              エクスポート
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">まだジョブがありません</p>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map(job => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{job.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.startedAt?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm">
                        {job.success}/{job.total} 成功
                      </p>
                      <p className="text-xs text-muted-foreground">
                        成功率: {((job.success / job.total) * 100).toFixed(1)}%
                      </p>
                    </div>
                    {getStatusBadge(job.status)}
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
        <AlertTitle>バッチ処理のヒント</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>CSVファイルの1列目にASIN/商品IDを配置</li>
            <li>Excelから直接コピー&ペースト可能</li>
            <li>処理中はブラウザを閉じないでください</li>
            <li>API制限により、大量データは時間がかかります</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
