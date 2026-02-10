'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  GitBranch,
  Upload,
  RefreshCw,
  Terminal,
  BookOpen,
  CheckCircle,
  XCircle,
  Loader2,
  Server,
  Code,
  FileText,
  AlertCircle,
  Eye,
  Key,
  Database,
  Trash2,
  GitMerge
} from 'lucide-react'
import CleanupTab from './cleanup-tab'
import LocalSyncTab from './local-sync-tab'
import VPSDeployTab from './vps-deploy-tab'
import IntegratedSyncTab from './integrated-sync-tab'

interface GitStatus {
  hasChanges: boolean
  hasUnpushedCommits?: boolean
  commitsAhead?: number
  files: string[]
  branch: string
}

export default function GitDeployPage() {
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'deploy' | 'commands' | 'guide' | 'cleanup' | 'local-sync' | 'vps-deploy' | 'integrated-sync'>('integrated-sync')
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null)
  const [commitMessage, setCommitMessage] = useState('')
  const [diffInfo, setDiffInfo] = useState<any>(null)
  const [showingDiff, setShowingDiff] = useState(false)
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [checkingEnv, setCheckingEnv] = useState(false)
  const [syncingEnv, setSyncingEnv] = useState(false)
  const [showEnvContent, setShowEnvContent] = useState(false)
  const [envContent, setEnvContent] = useState('')
  const [syncMode, setSyncMode] = useState<'safe' | 'force'>('safe')
  const [syncSteps, setSyncSteps] = useState<string[]>([])
  const [syncing, setSyncing] = useState(false)
  const [showSyncConfirm, setShowSyncConfirm] = useState(false)
  const [macCommandCopied, setMacCommandCopied] = useState(false)
  const [macFullSyncCopied, setMacFullSyncCopied] = useState(false)
  const [isLocalhost, setIsLocalhost] = useState(false)
  const [currentHost, setCurrentHost] = useState("")
  const [syncStatus, setSyncStatus] = useState<any>(null)
  const [checkingSyncStatus, setCheckingSyncStatus] = useState(false)
  const [remoteDiff, setRemoteDiff] = useState<any>(null)
  const [checkingRemoteDiff, setCheckingRemoteDiff] = useState(false)

  // ワンクリック完全同期用の状態
  const [fullSyncRunning, setFullSyncRunning] = useState(false)
  const [fullSyncLogs, setFullSyncLogs] = useState<string[]>([])
  const [fullSyncWithBackup, setFullSyncWithBackup] = useState(true)
  const [showFullSyncConfirm, setShowFullSyncConfirm] = useState(false)

  // 完全クリーンデプロイ用の状態
  const [cleanDeployLoading, setCleanDeployLoading] = useState(false)
  const [cleanDeployResult, setCleanDeployResult] = useState<any>(null)
  const [showCleanDeployConfirm, setShowCleanDeployConfirm] = useState(false)
  const [cleanDeployLogs, setCleanDeployLogs] = useState<string[]>([])

  // クリーンアップタブ用の状態
  const [cleanupData, setCleanupData] = useState<any>(null)
  const [loadingCleanup, setLoadingCleanup] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [updateGitignore, setUpdateGitignore] = useState(true)
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false)
  const [cleanupResult, setCleanupResult] = useState<any>(null)

  // ヘルパー関数: コミット済みの変更があるかチェック（新しいAPIに対応）
  const hasLocalCommits = () => {
    // 新しいAPIのhasUnpushedCommitsを優先
    if (gitStatus?.hasUnpushedCommits !== undefined) {
      return gitStatus.hasUnpushedCommits
    }
    // フォールバック: 従来のlongStatusからチェック
    return gitStatus?.branch && 
           (gitStatus as any)?.debug?.longStatus?.includes('Your branch is ahead')
  }

  // Git状態をチェック
  useEffect(() => {
    const hostname = window.location.hostname
    setCurrentHost(hostname)
    setIsLocalhost(hostname === "localhost" || hostname === "127.0.0.1")
  }, [])


  const checkGitStatus = async () => {
    setCheckingStatus(true)
    setResult(null)
    try {
      console.log('Fetching git status...')
      const response = await fetch('/api/git/status')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Git status API error:', errorData)
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Git status data:', data)
      
      if (data.error) {
        console.error('Git status error:', data.error)
        setResult({ success: false, message: `Git状態の取得に失敗: ${data.error}` })
        setGitStatus(null)
      } else {
        console.log('Setting git status:', {
          hasChanges: data.hasChanges,
          hasUnpushedCommits: data.hasUnpushedCommits,
          commitsAhead: data.commitsAhead,
          filesCount: data.files?.length || 0,
          branch: data.branch
        })
        setGitStatus(data)
      }
    } catch (error) {
      console.error('Git status check failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Git状態の取得に失敗しました'
      setResult({ success: false, message: errorMessage })
      setGitStatus(null)
    } finally {
      setCheckingStatus(false)
    }
  }

  useEffect(() => {
    checkGitStatus()
  }, [])

  const handleGitPush = async () => {
    // コミット済みの変更があるか確認
    const localCommits = hasLocalCommits()

    if (!localCommits && !commitMessage.trim() && !gitStatus?.hasChanges) {
      setResult({ 
        success: false, 
        message: 'プッシュする変更がありません' 
      })
      return
    }

    // コミット済みの変更があればメッセージなしでもOK
    if (!localCommits && gitStatus?.hasChanges && !commitMessage.trim()) {
      setResult({ 
        success: false, 
        message: 'コミットメッセージを入力してください' 
      })
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/git/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: commitMessage }),
      })
      
      const data = await response.json()
      setResult({ 
        success: response.ok, 
        message: data.message || data.error 
      })
      
      if (response.ok) {
        setCommitMessage('')
        await checkGitStatus()
      }
    } catch (error) {
      setResult({ success: false, message: 'Git pushに失敗しました' })
    } finally {
      setLoading(false)
    }
  }

  const handleVPSDeploy = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/deploy/vps', {
        method: 'POST',
      })

      const data = await response.json()

      // 手動デプロイの案内を表示
      if (data.commands) {
        const fullMessage = `${data.message}\n\n以下のコマンドを実行してください：\n\n${data.commands}`
        setResult({ success: false, message: fullMessage })
      } else {
        setResult({ success: response.ok, message: data.message || data.error })
      }
    } catch (error) {
      setResult({ success: false, message: 'VPSデプロイに失敗しました' })
    } finally {
      setLoading(false)
    }
  }

  const handleGitPull = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/git/pull', { method: 'POST' })
      const data = await response.json()
      setResult({ success: response.ok, message: data.message || data.error })
      if (response.ok) {
        await checkGitStatus()
      }
    } catch (error) {
      setResult({ success: false, message: 'Git pullに失敗しました' })
    } finally {
      setLoading(false)
    }
  }

  const checkDiff = async () => {
    setShowingDiff(true)
    try {
      const response = await fetch('/api/git/diff')
      const data = await response.json()
      setDiffInfo(data)
    } catch (error) {
      console.error('Diff check failed:', error)
    } finally {
      setShowingDiff(false)
    }
  }

  const checkEnvStatus = async () => {
    setCheckingEnv(true)
    try {
      const response = await fetch('/api/env/sync')
      const data = await response.json()
      setEnvInfo(data)
    } catch (error) {
      console.error('Env check failed:', error)
    } finally {
      setCheckingEnv(false)
    }
  }

  const loadEnvContent = async () => {
    try {
      const response = await fetch('/api/env/content')
      const data = await response.json()
      if (data.success) {
        setEnvContent(data.content)
        setShowEnvContent(true)
      }
    } catch (error) {
      console.error('Failed to load env content:', error)
    }
  }

  const copyEnvContent = () => {
    navigator.clipboard.writeText(envContent)
    setResult({
      success: true,
      message: '環境変数の内容をクリップボードにコピーしました！VPSで貼り付けてください。'
    })
  }

  const handleSyncFromGit = async () => {
    if (!showSyncConfirm) {
      setShowSyncConfirm(true)
      return
    }

    setSyncing(true)
    setSyncSteps([])
    setResult(null)

    try {
      const response = await fetch('/api/git/sync-from-remote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: syncMode })
      })

      const data = await response.json()

      if (response.ok) {
        setSyncSteps(data.steps || [])
        setResult({ success: true, message: data.message })
        await checkGitStatus()
      } else {
        setResult({ success: false, message: data.error || 'Git同期に失敗しました' })
      }
    } catch (error) {
      setResult({ success: false, message: 'Git同期に失敗しました' })
    } finally {
      setSyncing(false)
      setShowSyncConfirm(false)
    }
  }

  const copyMacSyncCommand = () => {
    const currentBranch = gitStatus?.branch || 'main'
    const commands = `cd ~/n3-frontend_new && ./sync-mac.sh`

    navigator.clipboard.writeText(commands)
    setMacCommandCopied(true)
    setResult({
      success: true,
      message: 'Mac同期コマンドをコピーしました！Macのターミナルで貼り付けて実行してください。'
    })

    setTimeout(() => setMacCommandCopied(false), 3000)
  }

  const copyMacFullSyncCommand = () => {
    const command = `cd ~ && mv n3-frontend_new n3-frontend_new.backup.$(date +%Y%m%d_%H%M%S) && git clone https://github.com/AKI-NANA/n3-frontend_new.git && cd n3-frontend_new && git checkout claude/fix-database-schema-011CUSEGuXMNhFc8xKiQv2DG && npm install && echo "✅ 完全同期完了！npm run dev を実行してください"`
    navigator.clipboard.writeText(command)
    setMacFullSyncCopied(true)
    setResult({ success: true, message: "完全同期コマンドをコピーしました！" })
    setTimeout(() => setMacFullSyncCopied(false), 3000)
  }

  const checkSyncStatus = async () => {
    setCheckingSyncStatus(true)
    try {
      const response = await fetch('/api/git/sync-status')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      if (data.error) {
        setSyncStatus({ error: data.error })
      } else {
        setSyncStatus(data)
      }
    } catch (error) {
      console.error('Sync status check failed:', error)
      const errorMessage = error instanceof Error ? error.message : '同期状態の確認に失敗しました'
      setSyncStatus({ error: `同期状態の確認に失敗しました: ${errorMessage}` })
    } finally {
      setCheckingSyncStatus(false)
    }
  }

  const checkRemoteDiff = async () => {
    setCheckingRemoteDiff(true)
    try {
      const response = await fetch('/api/git/remote-diff')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      if (data.error) {
        setRemoteDiff({ error: data.error })
      } else {
        setRemoteDiff(data)
      }
    } catch (error) {
      console.error('Remote diff check failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'リモート差分の確認に失敗しました'
      setRemoteDiff({ error: `リモート差分の確認に失敗しました: ${errorMessage}` })
    } finally {
      setCheckingRemoteDiff(false)
    }
  }

  useEffect(() => {
    checkEnvStatus()
  }, [])

  // ワンクリック完全同期関数
  const handleFullSync = async () => {
    if (!showFullSyncConfirm) {
      setShowFullSyncConfirm(true)
      return
    }

    setFullSyncRunning(true)
    setFullSyncLogs([])
    setResult(null)

    const addLog = (message: string) => {
      setFullSyncLogs(prev => [...prev, message])
    }

    try {
      addLog('🚀 完全同期を開始します...')

      // ステップ1: ローカルの変更をチェック
      addLog('🔍 ステップ1: ローカルの変更をチェック中...')
      const statusResponse = await fetch('/api/git/status')
      const statusData = await statusResponse.json()

      if (statusData.hasChanges) {
        addLog(`✅ ${statusData.files.length}ファイルの変更を検出`)
        
        // コミットメッセージが必要
        if (!commitMessage.trim()) {
          throw new Error('コミットメッセージが必要です。入力してから再実行してください。')
        }

        addLog('💾 ステップ2: ローカル変更をGitにコミット&プッシュ中...')
        const pushResponse = await fetch('/api/git/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: commitMessage })
        })
        
        if (!pushResponse.ok) {
          const errorData = await pushResponse.json()
          throw new Error(`Gitプッシュ失敗: ${errorData.error}`)
        }
        
        addLog('✅ GitHubにプッシュ完了')
        setCommitMessage('') // メッセージをクリア
      } else {
        addLog('✅ ローカルに未コミットの変更なし')
      }

      // ステップ3: Gitから最新を取得
      addLog('🔄 ステップ3: GitHubから最新データを取得中...')
      const pullResponse = await fetch('/api/git/pull', { method: 'POST' })
      if (!pullResponse.ok) {
        const errorData = await pullResponse.json()
        throw new Error(`Git Pull失敗: ${errorData.error}`)
      }
      addLog('✅ ローカルを最新状態に更新')

      // ステップ4: VPSにデプロイ
      addLog('🚀 ステップ4: VPSにデプロイ中...')
      const deployResponse = await fetch('/api/deploy/full-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          createBackup: fullSyncWithBackup,
          branch: statusData.branch || 'main'
        })
      })

      const deployData = await deployResponse.json()
      
      if (!deployResponse.ok) {
        // APIが存在しない場合は手動手順を表示
        if (deployResponse.status === 404) {
          addLog('⚠️ VPS自動デプロイAPIが未実装です')
          addLog('📝 VPSで以下のコマンドを実行してください:')
          addLog('ssh ubuntu@n3.emverze.com')
          addLog('cd ~/n3-frontend_new')
          if (fullSyncWithBackup) {
            addLog(`cp -r ~/n3-frontend_new ~/n3-frontend_new.backup.$(date +%Y%m%d_%H%M%S)`)
          }
          addLog(`git pull origin ${statusData.branch || 'main'}`)
          addLog('npm install')
          addLog('npm run build')
          addLog('pm2 restart n3-frontend')
          setResult({ 
            success: false, 
            message: 'VPS自動デプロイは未対応です。上記コマンドをVPSで実行してください。' 
          })
        } else {
          throw new Error(deployData.error || 'VPSデプロイ失敗')
        }
      } else {
        // デプロイログを追加
        if (deployData.logs) {
          deployData.logs.forEach((log: string) => addLog(log))
        }
        addLog('✅ VPSデプロイ完了')
      }

      // 最終確認
      addLog('🔄 最終確認中...')
      await checkGitStatus()
      
      addLog('')
      addLog('🎉 完全同期が完了しました！')
      addLog('✅ Mac ↔ GitHub ↔ VPS すべて同期済み')
      
      setResult({ 
        success: true, 
        message: '完全同期が成功しました！Mac、GitHub、VPSすべてが同じ状態になりました。' 
      })

    } catch (error: any) {
      console.error('Full sync error:', error)
      addLog('')
      addLog(`❌ エラー: ${error.message}`)
      setResult({ 
        success: false, 
        message: `完全同期に失敗しました: ${error.message}` 
      })
    } finally {
      setFullSyncRunning(false)
      setShowFullSyncConfirm(false)
    }
  }

  // 完全クリーンデプロイ関数
  const handleCleanDeploy = async () => {
    if (!showCleanDeployConfirm) {
      setShowCleanDeployConfirm(true)
      return
    }

    setCleanDeployLoading(true)
    setCleanDeployResult(null)
    setCleanDeployLogs([])

    const addLog = (message: string) => {
      setCleanDeployLogs(prev => [...prev, message])
    }

    try {
      addLog('🧹 完全クリーンデプロイを開始します...')

      const response = await fetch('/api/deploy/clean-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sshHost: 'tk2-236-27682.vs.sakura.ne.jp',
          sshUser: 'ubuntu',
          projectPath: '~/n3-frontend_new',
          githubRepo: 'https://github.com/AKI-NANA/n3-frontend_new.git'
        })
      })

      const data = await response.json()
      
      // ログを追加
      if (data.results) {
        data.results.forEach((r: any) => {
          if (r.success) {
            addLog(`✅ ${r.phase}: ${r.stdout}`)
          } else {
            addLog(`❌ ${r.phase}: ${r.error}`)
          }
        })
      }

      if (response.ok) {
        addLog('🎉 完全クリーンデプロイが完了しました！')
      }

      setCleanDeployResult({
        success: response.ok,
        message: data.message,
        results: data.results,
        backupBranch: data.backupBranch,
        vpsBackupPath: data.vpsBackupPath
      })
    } catch (error) {
      addLog('❌ エラーが発生しました')
      setCleanDeployResult({
        success: false,
        message: '完全クリーンデプロイに失敗しました'
      })
    } finally {
      setCleanDeployLoading(false)
      setShowCleanDeployConfirm(false)
    }
  }

  const commands = [
    {
      title: 'ローカル開発',
      commands: [
        { cmd: 'npm run dev', desc: '開発サーバー起動' },
        { cmd: 'npm run build', desc: '本番ビルド' },
        { cmd: 'npm run lint', desc: 'リント実行' },
      ]
    },
    {
      title: 'Git操作（推奨）',
      commands: [
        { cmd: 'git status', desc: '変更状況確認' },
        { cmd: 'git add .', desc: '全ファイルをステージング' },
        { cmd: 'git commit -m "message"', desc: 'コミット' },
        { cmd: 'git pull origin main', desc: '最新を取得（重要！）' },
        { cmd: 'git push origin main', desc: 'GitHubへプッシュ' },
      ]
    },
    {
      title: 'VPS操作',
      commands: [
        { cmd: 'ssh ubuntu@tk2-236-27682.vs.sakura.ne.jp', desc: 'VPS接続' },
        { cmd: 'cd ~/n3-frontend_new', desc: 'プロジェクトディレクトリへ移動' },
        { cmd: 'git pull origin main', desc: '最新コード取得' },
        { cmd: 'npm install', desc: '依存関係インストール' },
        { cmd: 'npm run build', desc: 'ビルド実行' },
        { cmd: 'pm2 restart n3-frontend', desc: 'アプリ再起動' },
        { cmd: 'pm2 logs n3-frontend --lines 50', desc: 'ログ確認' },
      ]
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Git & デプロイ管理</h1>
        <p className="text-muted-foreground mt-2">
          安全なGitプッシュとVPSデプロイ
        </p>
      </div>

      {/* タブ */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('integrated-sync')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'integrated-sync'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <RefreshCw className="inline-block w-4 h-4 mr-2" />
          🚀 統合同期
        </button>
        <button
          onClick={() => setActiveTab('deploy')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'deploy'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="inline-block w-4 h-4 mr-2" />
          デプロイ
        </button>
        <button
          onClick={() => setActiveTab('commands')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'commands'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Terminal className="inline-block w-4 h-4 mr-2" />
          コマンド集
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'guide'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="inline-block w-4 h-4 mr-2" />
          ガイド
        </button>
        <button
          onClick={() => setActiveTab('cleanup')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'cleanup'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Trash2 className="inline-block w-4 h-4 mr-2" />
          不要ファイル削除
        </button>
        <button
          onClick={() => setActiveTab('local-sync')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'local-sync'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <GitMerge className="inline-block w-4 h-4 mr-2" />
          Local Sync
        </button>
        <button
          onClick={() => setActiveTab('vps-deploy')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'vps-deploy'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Server className="inline-block w-4 h-4 mr-2" />
          VPSデプロイ
        </button>
      </div>

      {/* 結果表示 */}
      {result && (
        <Alert variant={result.success ? 'default' : 'destructive'}>
          {result.success ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <AlertDescription className="whitespace-pre-wrap">{result.message}</AlertDescription>
        </Alert>
      )}

      {/* Git状態表示カード（全タブ共通） */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Git 状態
            </CardTitle>
            <Button 
              size="sm" 
              variant="outline"
              onClick={checkGitStatus}
              disabled={checkingStatus}
            >
              {checkingStatus ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {gitStatus ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  {gitStatus.branch || 'main'} ブランチ
                </Badge>
                {gitStatus.hasChanges ? (
                  <Badge variant="default" className="bg-yellow-500">
                    📝 {gitStatus.files?.length || 0} ファイル変更あり
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-green-500">
                    ✅ 変更なし
                  </Badge>
                )}
                {/* 未プッシュコミットの表示 */}
                {gitStatus.hasUnpushedCommits && (
                  <Badge variant="default" className="bg-blue-500">
                    🚀 {gitStatus.commitsAhead} コミット未プッシュ
                  </Badge>
                )}
              </div>
              
              {gitStatus.files && gitStatus.files.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">変更されたファイル:</p>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 max-h-40 overflow-y-auto">
                    {gitStatus.files.slice(0, 10).map((file, idx) => (
                      <div key={idx} className="text-xs font-mono text-slate-600 dark:text-slate-400">
                        {file}
                      </div>
                    ))}
                    {gitStatus.files.length > 10 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        ... 他 {gitStatus.files.length - 10} ファイル
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 未プッシュコミットがある場合の案内 */}
              {gitStatus.hasUnpushedCommits && !gitStatus.hasChanges && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-xs">
                    🚀 {gitStatus.commitsAhead}個のコミットがGitHubにプッシュされていません。<br/>
                    「Git Push」ボタンでプッシュできます（コミットメッセージ不要）
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">読み込み中...</p>
          )}
        </CardContent>
      </Card>

      {/* 統合同期タブ */}
      {activeTab === 'integrated-sync' && <IntegratedSyncTab />}

      {/* デプロイタブ */}
      {activeTab === 'deploy' && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Git Push */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Git Push
              </CardTitle>
              <CardDescription>
                変更をGitHubにプッシュ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commit-message">コミットメッセージ</Label>
                <Textarea
                  id="commit-message"
                  placeholder="例: feat: 新機能を追加"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  rows={3}
                  disabled={!gitStatus?.hasChanges && !hasLocalCommits()}
                />
                {gitStatus?.hasUnpushedCommits && !gitStatus?.hasChanges && (
                  <p className="text-xs text-blue-600">
                    ✅ コミット済みの変更があるため、メッセージは不要です
                  </p>
                )}
              </div>

              <Button 
                onClick={handleGitPush} 
                disabled={loading || (!gitStatus?.hasChanges && !hasLocalCommits())}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    実行中...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {hasLocalCommits() && !gitStatus?.hasChanges 
                      ? `Git Push (${gitStatus?.commitsAhead}コミット)` 
                      : 'Git Push 実行'}
                  </>
                )}
              </Button>

              <Button 
                onClick={handleGitPull}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Git Pull（最新を取得）
              </Button>
            </CardContent>
          </Card>

          {/* VPS Deploy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                VPS デプロイ
              </CardTitle>
              <CardDescription>
                VPSに最新コードをデプロイ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Git Pushが完了してからVPSにデプロイしてください
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleVPSDeploy}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    デプロイ中...
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4 mr-2" />
                    VPSデプロイ実行
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground">
                <p className="font-medium">実行されるコマンド：</p>
                <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded mt-1">
                  git pull → npm install → npm run build → pm2 restart
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* コマンド集タブ */}
      {activeTab === 'commands' && (
        <div className="space-y-6">
          {commands.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.commands.map((item, cmdIdx) => (
                    <div key={cmdIdx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded">
                      <Terminal className="w-4 h-4 mt-1 text-slate-500" />
                      <div className="flex-1 min-w-0">
                        <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                          {item.cmd}
                        </code>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.desc}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigator.clipboard.writeText(item.cmd)}
                      >
                        <Code className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ガイドタブ */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>デプロイ手順</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>ローカルで開発・テスト</li>
                <li>Git状態を確認（このページ上部）</li>
                <li>コミットメッセージを入力してGit Push</li>
                <li>VPSデプロイを実行</li>
                <li>本番サイトで動作確認</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>コミットメッセージの書き方</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><code className="bg-slate-100 px-1 rounded">feat:</code> 新機能追加</p>
                <p><code className="bg-slate-100 px-1 rounded">fix:</code> バグ修正</p>
                <p><code className="bg-slate-100 px-1 rounded">docs:</code> ドキュメント変更</p>
                <p><code className="bg-slate-100 px-1 rounded">style:</code> スタイル変更</p>
                <p><code className="bg-slate-100 px-1 rounded">refactor:</code> リファクタリング</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* クリーンアップタブ */}
      {activeTab === 'cleanup' && <CleanupTab />}

      {/* Local Sync タブ */}
      {activeTab === 'local-sync' && <LocalSyncTab />}

      {/* VPS デプロイタブ */}
      {activeTab === 'vps-deploy' && <VPSDeployTab />}
    </div>
  )
}
