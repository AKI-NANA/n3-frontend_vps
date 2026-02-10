'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  GitBranch,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Server,
  Globe,
  AlertCircle,
  Zap,
  Clock,
  Database,
  Download,
  Upload,
  ArrowDown,
  ArrowUp,
  Eye
} from 'lucide-react'

interface SyncResult {
  success: boolean
  message: string
  timestamp: Date
}

interface SyncStatus {
  local: SyncResult | null
  vercel: SyncResult | null
  vps: SyncResult | null
  gitToLocal: SyncResult | null
  localToGit: SyncResult | null
}

interface GitStatus {
  hasChanges: boolean
  files: string[]
  branch: string
}

export default function IntegratedSyncTab() {
  const [isSyncingLocal, setIsSyncingLocal] = useState(false)
  const [isSyncingVercel, setIsSyncingVercel] = useState(false)
  const [isSyncingVPS, setIsSyncingVPS] = useState(false)
  const [isSyncingAll, setIsSyncingAll] = useState(false)
  const [isSyncingGitToLocal, setIsSyncingGitToLocal] = useState(false)
  const [isSyncingLocalToGit, setIsSyncingLocalToGit] = useState(false)
  const [isCheckingGitStatus, setIsCheckingGitStatus] = useState(false)

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    local: null,
    vercel: null,
    vps: null,
    gitToLocal: null,
    localToGit: null
  })

  // Git状態
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null)
  const [commitMessage, setCommitMessage] = useState('')

  // Auto-sync settings
  const [vercelAutoSync, setVercelAutoSync] = useState(false)
  const [vercelSyncInterval, setVercelSyncInterval] = useState(30) // minutes
  const [vpsAutoSync, setVpsAutoSync] = useState(false)
  const [vpsNextSync, setVpsNextSync] = useState<Date | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)

  // 設定が変更されたかどうか追跡
  const [settingsChanged, setSettingsChanged] = useState(false)
  const initialSettingsRef = useRef<{
    vercelAutoSync: boolean
    vercelSyncInterval: number
    vpsAutoSync: boolean
  } | null>(null)

  // Vercel環境判定
  const [isVercel, setIsVercel] = useState(false)
  const [envDebug, setEnvDebug] = useState<any>(null)

  // Git状態をチェック
  const checkGitStatus = async () => {
    setIsCheckingGitStatus(true)
    try {
      const response = await fetch('/api/git/status')
      if (response.ok) {
        const data = await response.json()
        setGitStatus(data)
      }
    } catch (error) {
      console.error('[IntegratedSync] Git状態の取得に失敗:', error)
    } finally {
      setIsCheckingGitStatus(false)
    }
  }

  // 初回ロード時にGit状態をチェック
  useEffect(() => {
    checkGitStatus()
  }, [])

  // 自動同期設定を読み込む
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings/auto-sync')
        const data = await response.json()
        if (data.success && data.settings) {
          setVercelAutoSync(data.settings.vercelAutoSync)
          setVercelSyncInterval(data.settings.vercelSyncInterval)
          setVpsAutoSync(data.settings.vpsAutoSync)
          
          // 初期値を保存
          initialSettingsRef.current = {
            vercelAutoSync: data.settings.vercelAutoSync,
            vercelSyncInterval: data.settings.vercelSyncInterval,
            vpsAutoSync: data.settings.vpsAutoSync
          }
          
          console.log('[IntegratedSync] 自動同期設定を読み込みました:', data.settings)
        }
      } catch (error) {
        console.error('[IntegratedSync] 自動同期設定の読み込みに失敗:', error)
      }
    }
    loadSettings()
  }, [])

  // 設定変更の検出
  useEffect(() => {
    if (initialSettingsRef.current) {
      const changed = 
        vercelAutoSync !== initialSettingsRef.current.vercelAutoSync ||
        vercelSyncInterval !== initialSettingsRef.current.vercelSyncInterval ||
        vpsAutoSync !== initialSettingsRef.current.vpsAutoSync
      setSettingsChanged(changed)
    }
  }, [vercelAutoSync, vercelSyncInterval, vpsAutoSync])

  // 自動同期設定を保存する
  const saveSettings = async () => {
    setSavingSettings(true)
    setSettingsSaved(false)
    setSettingsError(null)

    try {
      const response = await fetch('/api/settings/auto-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vercelAutoSync,
          vercelSyncInterval,
          vpsAutoSync
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSettingsSaved(true)
        setSettingsChanged(false)
        
        // 初期値を更新
        initialSettingsRef.current = {
          vercelAutoSync,
          vercelSyncInterval,
          vpsAutoSync
        }
        
        console.log('[IntegratedSync] 自動同期設定を保存しました')

        // 5秒後にメッセージを消す
        setTimeout(() => {
          setSettingsSaved(false)
        }, 5000)
      } else {
        const errorMsg = data.error || '設定の保存に失敗しました'
        setSettingsError(errorMsg)
        console.error('[IntegratedSync] 設定保存エラー:', data)
      }
    } catch (error) {
      console.error('[IntegratedSync] 自動同期設定の保存に失敗:', error)
      setSettingsError('ネットワークエラー: 設定の保存に失敗しました')
    } finally {
      setSavingSettings(false)
    }
  }

  useEffect(() => {
    // サーバーサイドから環境情報を取得
    const fetchEnvironment = async () => {
      try {
        const response = await fetch('/api/environment')
        const data = await response.json()
        console.log('[IntegratedSync] Environment data:', data)
        setIsVercel(data.isVercel)
        setEnvDebug(data)
      } catch (error) {
        console.error('[IntegratedSync] Failed to fetch environment:', error)
        // フォールバック: クライアントサイドでの判定
        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname
          const isVercelDomain = hostname.endsWith('.vercel.app') ||
                                hostname.includes('vercel.app')
          console.log('[IntegratedSync] Fallback hostname detection:', hostname, isVercelDomain)
          setIsVercel(isVercelDomain)
        }
      }
    }
    fetchEnvironment()
  }, [])

  // Vercel定期同期
  useEffect(() => {
    if (!vercelAutoSync) return

    const interval = setInterval(() => {
      syncToVercel()
    }, vercelSyncInterval * 60 * 1000)

    return () => clearInterval(interval)
  }, [vercelAutoSync, vercelSyncInterval])

  // VPS 1日2回自動同期（9:00 と 21:00）
  useEffect(() => {
    if (!vpsAutoSync) return

    const checkAndSync = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      // 9:00 または 21:00 に実行
      if ((hours === 9 || hours === 21) && minutes === 0) {
        syncToVPS()
      }

      // 次回同期時刻を計算
      const next = new Date()
      if (hours < 9) {
        next.setHours(9, 0, 0, 0)
      } else if (hours < 21) {
        next.setHours(21, 0, 0, 0)
      } else {
        next.setDate(next.getDate() + 1)
        next.setHours(9, 0, 0, 0)
      }
      setVpsNextSync(next)
    }

    checkAndSync()
    const interval = setInterval(checkAndSync, 60 * 1000) // Check every minute

    return () => clearInterval(interval)
  }, [vpsAutoSync])

  // ローカル → GitHub プッシュ
  const syncLocalToGit = async () => {
    if (!commitMessage.trim() && gitStatus?.hasChanges) {
      setSyncStatus(prev => ({
        ...prev,
        localToGit: {
          success: false,
          message: '❌ コミットメッセージを入力してください',
          timestamp: new Date()
        }
      }))
      return
    }

    setIsSyncingLocalToGit(true)

    setSyncStatus(prev => ({
      ...prev,
      localToGit: {
        success: false,
        message: '同期中... (git add → commit → push)',
        timestamp: new Date()
      }
    }))

    try {
      const response = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMessage })
      })

      const data = await response.json()

      let message = ''
      if (!response.ok) {
        message = data.error || 'Git Pushに失敗しました'
        if (data.details) {
          message += `\n詳細: ${data.details}`
        }
      } else {
        message = data.message || 'Git Push完了'
        setCommitMessage('') // 成功したらクリア
      }

      setSyncStatus(prev => ({
        ...prev,
        localToGit: {
          success: response.ok,
          message,
          timestamp: new Date()
        }
      }))

      // Git状態を更新
      if (response.ok) {
        await checkGitStatus()
      }
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        localToGit: {
          success: false,
          message: error instanceof Error ? error.message : '同期エラー',
          timestamp: new Date()
        }
      }))
    } finally {
      setIsSyncingLocalToGit(false)
    }
  }

  // GitHub → ローカル同期
  const syncGitToLocal = async () => {
    setIsSyncingGitToLocal(true)

    setSyncStatus(prev => ({
      ...prev,
      gitToLocal: {
        success: false,
        message: '同期中... (git pull origin main)',
        timestamp: new Date()
      }
    }))

    try {
      const response = await fetch('/api/git/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      let message = ''
      if (!response.ok) {
        message = data.error || 'Git Pullに失敗しました'
        if (data.details) {
          message += `\n詳細: ${data.details}`
        }
      } else {
        message = data.message || 'Git Pull完了'
        if (data.output) {
          message += `\n${data.output}`
        }
      }

      setSyncStatus(prev => ({
        ...prev,
        gitToLocal: {
          success: response.ok,
          message,
          timestamp: new Date()
        }
      }))

      // Git状態を更新
      if (response.ok) {
        await checkGitStatus()
      }
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        gitToLocal: {
          success: false,
          message: error instanceof Error ? error.message : '同期エラー',
          timestamp: new Date()
        }
      }))
    } finally {
      setIsSyncingGitToLocal(false)
    }
  }

  // Git main → DB同期（GitHub API経由）
  const syncToLocal = async () => {
    setIsSyncingLocal(true)

    // 即座に進行中メッセージを表示
    setSyncStatus(prev => ({
      ...prev,
      local: {
        success: false,
        message: '同期中... (GitHub API → DB)',
        timestamp: new Date()
      }
    }))

    try {
      const response = await fetch('/api/git/sync-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      // エラーメッセージを詳細に構築
      let message = ''
      if (!response.ok) {
        message = data.error || 'DB同期に失敗しました'
        if (data.details) {
          message += `\n詳細: ${data.details}`
        }
        if (data.suggestion) {
          message += `\n${data.suggestion}`
        }
      } else {
        message = data.message || 'DB同期完了'
        if (data.commit) {
          message += `\nコミット: ${data.commit.sha} - ${data.commit.message}`
        }
      }

      setSyncStatus(prev => ({
        ...prev,
        local: {
          success: response.ok,
          message,
          timestamp: new Date()
        }
      }))
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        local: {
          success: false,
          message: error instanceof Error ? error.message : '同期エラー',
          timestamp: new Date()
        }
      }))
    } finally {
      setIsSyncingLocal(false)
    }
  }

  // Git main → Vercel同期
  const syncToVercel = async () => {
    setIsSyncingVercel(true)

    // 即座に進行中メッセージを表示
    setSyncStatus(prev => ({
      ...prev,
      vercel: {
        success: false,
        message: '同期中... (Deploy Hookトリガー)',
        timestamp: new Date()
      }
    }))

    try {
      const response = await fetch('/api/deployment/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: 'main' })
      })

      const data = await response.json()

      setSyncStatus(prev => ({
        ...prev,
        vercel: {
          success: response.ok,
          message: data.message || data.error || 'Vercel同期完了',
          timestamp: new Date()
        }
      }))
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        vercel: {
          success: false,
          message: error instanceof Error ? error.message : '同期エラー',
          timestamp: new Date()
        }
      }))
    } finally {
      setIsSyncingVercel(false)
    }
  }

  // Git main → VPS同期
  const syncToVPS = async () => {
    setIsSyncingVPS(true)

    // 即座に進行中メッセージを表示
    setSyncStatus(prev => ({
      ...prev,
      vps: {
        success: false,
        message: '同期中... (git pull → npm install → npm build → pm2 restart) 最大5分',
        timestamp: new Date()
      }
    }))

    try {
      const response = await fetch('/api/deployment/vps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: 'main' })
      })

      const data = await response.json()

      // エラーメッセージを詳細に構築
      let errorMessage = ''
      if (!response.ok) {
        errorMessage = data.error || 'VPSデプロイに失敗しました'
        if (data.details) {
          errorMessage += `\n詳細: ${data.details}`
        }
        if (data.suggestion) {
          errorMessage += `\n${data.suggestion}`
        }
      } else {
        errorMessage = data.message || 'VPS同期完了'
      }

      setSyncStatus(prev => ({
        ...prev,
        vps: {
          success: response.ok,
          message: errorMessage,
          timestamp: new Date()
        }
      }))
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        vps: {
          success: false,
          message: error instanceof Error ? error.message : '同期エラー',
          timestamp: new Date()
        }
      }))
    } finally {
      setIsSyncingVPS(false)
    }
  }

  // 全て同期
  const syncAll = async () => {
    setIsSyncingAll(true)

    // DB同期（GitHub API経由）
    await syncToLocal()
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Vercel同期
    await syncToVercel()
    await new Promise(resolve => setTimeout(resolve, 1000))

    // VPS同期
    await syncToVPS()

    setIsSyncingAll(false)
  }

  const getStatusIcon = (result: SyncResult | null) => {
    if (!result) return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    if (result.success) return <CheckCircle className="w-5 h-5 text-green-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const isSyncing = isSyncingLocal || isSyncingVercel || isSyncingVPS || isSyncingAll || isSyncingGitToLocal || isSyncingLocalToGit

  return (
    <div className="space-y-6">
      {/* 実行環境表示 */}
      <Alert className={isVercel ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'}>
        <AlertCircle className={`w-4 h-4 ${isVercel ? 'text-purple-600' : 'text-blue-600'}`} />
        <AlertDescription className="text-sm">
          <strong>実行環境:</strong> {isVercel ? '🌐 Vercel (本番環境)' : '💻 ローカル環境'}<br/>
          すべての同期機能は GitHub API ベースで動作するため、全環境で使用可能です
          {envDebug && (
            <div className="mt-2 text-xs font-mono bg-white p-2 rounded border">
              <strong>Debug:</strong><br/>
              Environment: {envDebug.environment}<br/>
              Has Deploy Hook: {envDebug.debug?.hasDeployHook ? '✅' : '❌'}<br/>
              Has VPS Config: {envDebug.debug?.hasVPSConfig ? '✅' : '❌'}<br/>
              Has Git Dir: {envDebug.hasGitDir ? '✅' : '❌'}
            </div>
          )}
        </AlertDescription>
      </Alert>

      {/* ローカル ↔ GitHub 双方向同期 */}
      <Card className="border-2 border-orange-300">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <GitBranch className="w-6 h-6 text-orange-600" />
                ローカル ↔ GitHub 双方向同期
              </CardTitle>
              <CardDescription>
                ローカルの変更をGitHubにPush / GitHubの最新をローカルにPull
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkGitStatus}
              disabled={isCheckingGitStatus}
            >
              {isCheckingGitStatus ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span className="ml-2">状態更新</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Git状態表示 */}
          {gitStatus && (
            <div className="p-3 bg-slate-100 rounded-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-sm">
                  📌 {gitStatus.branch || 'main'} ブランチ
                </Badge>
                {gitStatus.hasChanges ? (
                  <Badge className="bg-yellow-500">
                    📝 {gitStatus.files?.length || 0} ファイル変更あり
                  </Badge>
                ) : (
                  <Badge className="bg-green-500">
                    ✅ 変更なし
                  </Badge>
                )}
              </div>
              {gitStatus.hasChanges && gitStatus.files && gitStatus.files.length > 0 && (
                <div className="mt-2 text-xs text-gray-600 max-h-20 overflow-y-auto">
                  {gitStatus.files.slice(0, 5).map((file, idx) => (
                    <div key={idx} className="font-mono">{file}</div>
                  ))}
                  {gitStatus.files.length > 5 && (
                    <div className="text-gray-400">... 他 {gitStatus.files.length - 5} ファイル</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ローカル → GitHub (Push) */}
          <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex-shrink-0 pt-2">
              {isSyncingLocalToGit ? (
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              ) : (
                getStatusIcon(syncStatus.localToGit)
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">ローカル → GitHub (Push)</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commit-message" className="text-sm">
                  コミットメッセージ {gitStatus?.hasChanges && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id="commit-message"
                  placeholder="例: feat: 新機能追加"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  rows={2}
                  className="text-sm"
                  disabled={isSyncingLocalToGit}
                />
              </div>

              {syncStatus.localToGit && (
                <div className={`text-sm whitespace-pre-wrap ${
                  isSyncingLocalToGit
                    ? 'text-blue-600 font-semibold'
                    : syncStatus.localToGit.success
                      ? 'text-green-600'
                      : 'text-red-600'
                }`}>
                  {syncStatus.localToGit.message}
                  <div className="text-xs text-gray-500 mt-1">
                    {syncStatus.localToGit.timestamp.toLocaleString('ja-JP')}
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={syncLocalToGit}
              disabled={isSyncing || (gitStatus?.hasChanges && !commitMessage.trim())}
              className="flex-shrink-0 bg-orange-600 hover:bg-orange-700"
            >
              {isSyncingLocalToGit ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Push中
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  ローカル → GitHub
                </>
              )}
            </Button>
          </div>

          {/* GitHub → ローカル (Pull) */}
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-shrink-0">
              {isSyncingGitToLocal ? (
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
              ) : (
                getStatusIcon(syncStatus.gitToLocal)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDown className="w-5 h-5 text-green-600" />
                <span className="font-semibold">GitHub → ローカル (Pull)</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                git pull origin main を実行して最新コードを取得
              </div>
              {syncStatus.gitToLocal && (
                <div className={`text-sm whitespace-pre-wrap ${
                  isSyncingGitToLocal
                    ? 'text-blue-600 font-semibold'
                    : syncStatus.gitToLocal.success
                      ? 'text-green-600'
                      : 'text-red-600'
                }`}>
                  {syncStatus.gitToLocal.message}
                  <div className="text-xs text-gray-500 mt-1">
                    {syncStatus.gitToLocal.timestamp.toLocaleString('ja-JP')}
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={syncGitToLocal}
              disabled={isSyncing}
              className="flex-shrink-0 bg-green-600 hover:bg-green-700"
            >
              {isSyncingGitToLocal ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Pull中
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  GitHub → ローカル
                </>
              )}
            </Button>
          </div>

          <Alert className="bg-orange-50 border-orange-200">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-xs">
              <strong>💡 使い方:</strong><br/>
              • <strong>Push:</strong> ローカルで編集した内容をGitHubに送信<br/>
              • <strong>Pull:</strong> Claude Codeや他の場所での変更をローカルに取り込む<br/>
              • 変更がある場合はコミットメッセージが必須です
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 個別同期ボタン */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <GitBranch className="w-6 h-6 text-blue-600" />
            Git (main) → 各環境へ同期
          </CardTitle>
          <CardDescription>
            GitHub mainブランチから各環境へ個別に同期
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* DB同期 (GitHub API) */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex-shrink-0">
              {isSyncingLocal ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                getStatusIcon(syncStatus.local)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">DBに最新のGitステータスを同期</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                GitHub API経由でmainブランチの最新コミット情報を取得してDBに保存
              </div>
              {syncStatus.local && (
                <div className={`text-sm whitespace-pre-wrap ${
                  isSyncingLocal
                    ? 'text-blue-600 font-semibold'
                    : syncStatus.local.success
                      ? 'text-green-600'
                      : 'text-red-600'
                }`}>
                  {syncStatus.local.message}
                  <div className="text-xs text-gray-500 mt-1">
                    {syncStatus.local.timestamp.toLocaleString('ja-JP')}
                  </div>
                  {isSyncingLocal && (
                    <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      処理中... しばらくお待ちください
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={syncToLocal}
              disabled={isSyncing}
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
            >
              {isSyncingLocal ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  同期中
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  DB同期
                </>
              )}
            </Button>
          </div>

          {/* Vercel同期 */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex-shrink-0">
              {isSyncingVercel ? (
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
              ) : (
                getStatusIcon(syncStatus.vercel)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Vercel</span>
              </div>
              {syncStatus.vercel && (
                <div className={`text-sm ${
                  isSyncingVercel
                    ? 'text-blue-600 font-semibold'
                    : syncStatus.vercel.success
                      ? 'text-green-600'
                      : 'text-red-600'
                }`}>
                  {syncStatus.vercel.message}
                  <div className="text-xs text-gray-500 mt-1">
                    {syncStatus.vercel.timestamp.toLocaleString('ja-JP')}
                  </div>
                  {isSyncingVercel && (
                    <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      処理中... しばらくお待ちください
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={syncToVercel}
              disabled={isSyncing}
              className="flex-shrink-0 bg-green-600 hover:bg-green-700"
            >
              {isSyncingVercel ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  同期中
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Git → Vercel
                </>
              )}
            </Button>
          </div>

          {/* VPS同期 */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex-shrink-0">
              {isSyncingVPS ? (
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              ) : (
                getStatusIcon(syncStatus.vps)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Server className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">VPS (Sakura)</span>
              </div>
              {syncStatus.vps && (
                <div className={`text-sm whitespace-pre-wrap ${
                  isSyncingVPS
                    ? 'text-blue-600 font-semibold'
                    : syncStatus.vps.success
                      ? 'text-green-600'
                      : 'text-red-600'
                }`}>
                  {syncStatus.vps.message}
                  <div className="text-xs text-gray-500 mt-1">
                    {syncStatus.vps.timestamp.toLocaleString('ja-JP')}
                  </div>
                  {isSyncingVPS && (
                    <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      処理中... しばらくお待ちください
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={syncToVPS}
              disabled={isSyncing}
              className="flex-shrink-0 bg-purple-600 hover:bg-purple-700"
            >
              {isSyncingVPS ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  同期中
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Git → VPS
                </>
              )}
            </Button>
          </div>

          {/* 全て同期ボタン */}
          <div className="pt-4 border-t-2 border-gray-200">
            <Button
              onClick={syncAll}
              disabled={isSyncing}
              className="w-full h-16 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              {isSyncingAll ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  全環境同期中...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 mr-3" />
                  ⚡ 全て同期（一括実行）
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 自動同期設定 */}
      <Card className="border-2 border-purple-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-6 h-6 text-purple-600" />
            ⏰ 自動同期設定
          </CardTitle>
          <CardDescription>
            各環境の自動同期スケジュール
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Vercel定期同期 */}
          <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  <Label htmlFor="vercel-auto" className="text-base font-semibold">
                    Vercel 定期同期
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  指定した間隔で自動的にGitHubから同期
                </p>
              </div>
              <Switch
                id="vercel-auto"
                checked={vercelAutoSync}
                onCheckedChange={setVercelAutoSync}
              />
            </div>

            {vercelAutoSync && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="vercel-interval">同期間隔（分）</Label>
                <Input
                  id="vercel-interval"
                  type="number"
                  min="5"
                  max="120"
                  value={vercelSyncInterval}
                  onChange={(e) => setVercelSyncInterval(Number(e.target.value))}
                  className="max-w-xs"
                />
                <p className="text-xs text-gray-500">
                  {vercelSyncInterval}分ごとに自動同期します
                </p>
              </div>
            )}
          </div>

          {/* VPS 1日2回自動同期 */}
          <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-600" />
                  <Label htmlFor="vps-auto" className="text-base font-semibold">
                    VPS 定時同期
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  毎日9:00と21:00に自動同期
                </p>
              </div>
              <Switch
                id="vps-auto"
                checked={vpsAutoSync}
                onCheckedChange={setVpsAutoSync}
              />
            </div>

            {vpsAutoSync && vpsNextSync && (
              <Alert className="bg-white border-purple-200">
                <Clock className="w-4 h-4 text-purple-600" />
                <AlertDescription className="text-sm">
                  <strong>次回同期:</strong> {vpsNextSync.toLocaleString('ja-JP')}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-xs">
              <strong>💡 同期の仕組み:</strong><br/>
              • <strong>GitHub (main)</strong> が常に最新の真実（Source of Truth）<br/>
              • 各ボタンでGitHub mainから対象環境へ同期<br/>
              • 「全て同期」ボタンで一括実行<br/>
              • 自動同期で定期的に最新状態を保持
            </AlertDescription>
          </Alert>

          {/* 設定保存ボタン */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Button
                onClick={saveSettings}
                disabled={savingSettings || !settingsChanged}
                className={`${
                  settingsChanged 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-400'
                }`}
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    設定を保存
                  </>
                )}
              </Button>
              
              {settingsChanged && (
                <span className="text-sm text-orange-600 font-medium">
                  ⚠️ 未保存の変更があります
                </span>
              )}
            </div>

            {settingsSaved && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold animate-pulse">
                <CheckCircle className="w-4 h-4" />
                ✅ 設定を保存しました！
              </div>
            )}
          </div>

          {/* エラー表示 */}
          {settingsError && (
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-sm text-red-700">
                <strong>エラー:</strong> {settingsError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
