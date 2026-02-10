/**
 * Cron設定タブコンポーネント
 * 
 * VPSで実行されるcronジョブの設定を管理
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Timer,
  Package,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Save,
  Play,
  Info,
  Server,
  Clock,
} from 'lucide-react'

interface CronSetting {
  id: string
  cron_type: 'listing' | 'inventory_monitoring' | 'inventory_sync'
  enabled: boolean
  interval_minutes: number
  description: string
  last_run_at: string | null
  next_run_at: string | null
  run_count: number
  success_count: number
  error_count: number
  last_error: string | null
  updated_at: string
}

export default function CronSettingsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [settings, setSettings] = useState<CronSetting[]>([])
  const [tableExists, setTableExists] = useState(true)
  const [testingJob, setTestingJob] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{
    type: string
    success: boolean
    message: string
    data?: any
  } | null>(null)

  // 設定を取得
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/automation/cron-settings')
      const data = await response.json()

      if (data.success) {
        setSettings(data.settings || [])
        setTableExists(data.table_exists !== false)
      }
    } catch (error) {
      console.error('設定取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // 設定を更新
  const updateSetting = async (cronType: string, updates: Partial<CronSetting>) => {
    try {
      setSaving(cronType)
      
      const response = await fetch('/api/automation/cron-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cron_type: cronType,
          ...updates,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // ローカル状態を更新
        setSettings(prev => prev.map(s => 
          s.cron_type === cronType ? { ...s, ...updates, ...data.setting } : s
        ))
      } else {
        alert(`設定の更新に失敗しました: ${data.error}`)
      }
    } catch (error) {
      console.error('設定更新エラー:', error)
      alert('設定の更新に失敗しました')
    } finally {
      setSaving(null)
    }
  }

  // テスト実行
  const runTestJob = async (cronType: string) => {
    try {
      setTestingJob(cronType)
      setTestResult(null)
      
      let endpoint = ''
      let method = 'GET'
      let body: any = undefined
      
      switch (cronType) {
        case 'listing':
          endpoint = '/api/listing/execute-scheduled'
          method = 'POST'
          body = { dry_run: true, limit: 5 }
          break
        case 'inventory_monitoring':
          endpoint = '/api/inventory-monitoring/execute'
          break
        case 'inventory_sync':
          endpoint = '/api/inventory-sync/worker?max_items=5'
          break
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body && { body: JSON.stringify(body) }),
      })
      
      const data = await response.json()
      
      setTestResult({
        type: cronType,
        success: data.success !== false,
        message: data.message || (data.success !== false ? '実行完了' : 'エラーが発生しました'),
        data,
      })
    } catch (error: any) {
      setTestResult({
        type: cronType,
        success: false,
        message: error.message || '実行に失敗しました',
      })
    } finally {
      setTestingJob(null)
    }
  }

  // アイコンを取得
  const getIcon = (cronType: string) => {
    switch (cronType) {
      case 'listing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'inventory_monitoring':
        return <Eye className="h-5 w-5 text-yellow-500" />
      case 'inventory_sync':
        return <RefreshCw className="h-5 w-5 text-green-500" />
      default:
        return <Timer className="h-5 w-5" />
    }
  }

  // ラベルを取得
  const getLabel = (cronType: string) => {
    switch (cronType) {
      case 'listing':
        return 'スケジュール出品'
      case 'inventory_monitoring':
        return '在庫監視（無在庫）'
      case 'inventory_sync':
        return '在庫同期（有在庫）'
      default:
        return cronType
    }
  }

  // 最終実行時刻をフォーマット
  const formatLastRun = (dateStr: string | null) => {
    if (!dateStr) return '未実行'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'たった今'
    if (diffMins < 60) return `${diffMins}分前`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}時間前`
    return date.toLocaleString('ja-JP')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">設定を読み込み中...</span>
      </div>
    )
  }

  if (!tableExists) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            マイグレーションが必要です
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Cron設定テーブルが存在しません。以下のSQLを実行してください：
            </AlertDescription>
          </Alert>
          <pre className="mt-4 p-4 bg-muted rounded-lg text-xs overflow-auto">
{`-- migrations/20241215_automation_schema.sql を実行`}
          </pre>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー説明 */}
      <Alert>
        <Server className="h-4 w-4" />
        <AlertDescription>
          VPSで実行される自動化ジョブの設定です。間隔を変更すると、次回の実行から反映されます。
        </AlertDescription>
      </Alert>

      {/* Cron設定カード */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settings.map((setting) => (
          <Card key={setting.cron_type}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(setting.cron_type)}
                  <div>
                    <CardTitle className="text-lg">{getLabel(setting.cron_type)}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {setting.description}
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={(checked) => updateSetting(setting.cron_type, { enabled: checked })}
                  disabled={saving === setting.cron_type}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 間隔設定 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">実行間隔</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={1440}
                    value={setting.interval_minutes}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 10
                      setSettings(prev => prev.map(s => 
                        s.cron_type === setting.cron_type ? { ...s, interval_minutes: value } : s
                      ))
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">分ごと</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetting(setting.cron_type, { interval_minutes: setting.interval_minutes })}
                    disabled={saving === setting.cron_type}
                  >
                    {saving === setting.cron_type ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {setting.cron_type === 'listing' && '推奨: 5〜15分（出品タイミングの精度）'}
                  {setting.cron_type === 'inventory_monitoring' && '推奨: 30〜60分（スクレイピング負荷軽減）'}
                  {setting.cron_type === 'inventory_sync' && '推奨: 10〜30分（在庫ズレ防止）'}
                </p>
              </div>

              <Separator />

              {/* 統計 */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted rounded">
                  <div className="text-lg font-bold">{setting.run_count || 0}</div>
                  <div className="text-xs text-muted-foreground">実行回数</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">{setting.success_count || 0}</div>
                  <div className="text-xs text-muted-foreground">成功</div>
                </div>
                <div className="p-2 bg-red-50 rounded">
                  <div className="text-lg font-bold text-red-600">{setting.error_count || 0}</div>
                  <div className="text-xs text-muted-foreground">エラー</div>
                </div>
              </div>

              {/* 最終実行 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">最終実行:</span>
                  <span className="font-medium">{formatLastRun(setting.last_run_at)}</span>
                </div>
                {setting.last_error && (
                  <Badge variant="destructive" className="text-xs">
                    エラーあり
                  </Badge>
                )}
              </div>

              {/* 最終エラー表示 */}
              {setting.last_error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {setting.last_error}
                  </AlertDescription>
                </Alert>
              )}

              {/* テスト実行ボタン */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => runTestJob(setting.cron_type)}
                disabled={testingJob === setting.cron_type}
              >
                {testingJob === setting.cron_type ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                テスト実行（ドライラン）
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* テスト結果 */}
      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              テスト結果: {getLabel(testResult.type)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant={testResult.success ? 'default' : 'destructive'}>
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
            {testResult.data && (
              <pre className="mt-4 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-64">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      )}

      {/* VPS設定ガイド */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            VPS設定ガイド
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cronジョブを自動実行するには、VPSでCronワーカーを起動してください。
          </p>
          <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto">
{`# PM2でCronワーカーを起動
pm2 start ecosystem.config.js

# ログを確認
pm2 logs n3-cron

# 停止
pm2 stop n3-cron`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
