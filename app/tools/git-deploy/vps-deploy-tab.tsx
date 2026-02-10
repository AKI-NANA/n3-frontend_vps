'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Server,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Rocket,
  Terminal,
  BookOpen,
} from 'lucide-react'

export default function VPSDeployTab() {
  const [checking, setChecking] = useState(false)
  const [checks, setChecks] = useState<any>(null)
  const [deploying, setDeploying] = useState(false)
  const [deployLogs, setDeployLogs] = useState<string[]>([])
  const [deployResult, setDeployResult] = useState<any>(null)
  const [cleanBuild, setCleanBuild] = useState(false)

  const runChecks = async () => {
    setChecking(true)
    setChecks(null)
    try {
      const response = await fetch('/api/vps/check')
      const data = await response.json()
      setChecks(data)
    } catch (error) {
      console.error('Check failed:', error)
    } finally {
      setChecking(false)
    }
  }

  const runDeploy = async () => {
    setDeploying(true)
    setDeployLogs([])
    setDeployResult(null)

    try {
      const response = await fetch('/api/vps/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cleanBuild,
        }),
      })

      const data = await response.json()
      setDeployResult(data)
      if (data.logs) {
        setDeployLogs(data.logs)
      }
    } catch (error: any) {
      setDeployResult({
        success: false,
        error: error.message,
      })
    } finally {
      setDeploying(false)
    }
  }

  const renderCheckStatus = (status: string) => {
    if (status === 'ok') {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    } else if (status === 'warning') {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* マニュアルセクション */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <CardTitle>VPSデプロイマニュアル</CardTitle>
          </div>
          <CardDescription>
            ワンクリックでVPSに安全にデプロイできます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold">デプロイ手順</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>事前チェックを実行</strong> - システム状態を確認</li>
              <li><strong>エラーがあれば修正</strong> - 表示された修正コマンドを実行</li>
              <li><strong>デプロイボタンをクリック</strong> - 自動で全ての手順を実行</li>
              <li><strong>完了を確認</strong> - ログで正常に起動したことを確認</li>
            </ol>

            <h3 className="text-lg font-semibold mt-6">よくあるエラーと対処法</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4">
                <p className="font-semibold">❌ Node.jsバージョンが古い</p>
                <p className="text-sm text-gray-600">対処法: <code className="bg-gray-100 px-1">nvm install 20 && nvm use 20</code></p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <p className="font-semibold">❌ 無限再起動ループ</p>
                <p className="text-sm text-gray-600">原因: .nextディレクトリが壊れている、またはNode.jsバージョン不一致</p>
                <p className="text-sm text-gray-600">対処法: クリーンビルドを有効にしてデプロイ</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="font-semibold">⚠️ lightningcssエラー</p>
                <p className="text-sm text-gray-600">原因: node_modulesが別環境（Mac）のもの</p>
                <p className="text-sm text-gray-600">対処法: クリーンビルドを有効にしてデプロイ</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="font-semibold">⚠️ 環境変数が不足</p>
                <p className="text-sm text-gray-600">対処法: ローカルの.env.localをVPSにコピー</p>
                <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto">
                  scp .env.local ubuntu@your-vps:/home/ubuntu/n3-frontend_new/
                </pre>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6">注意事項</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>デプロイ中はサイトが一時的にダウンします（通常1-3分）</li>
              <li>クリーンビルドは時間がかかりますが、問題解決に有効です</li>
              <li>環境変数やデータベース設定は自動では同期されません</li>
              <li>PM2無限ループを検知した場合、自動で停止します</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 事前チェックセクション */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              <CardTitle>事前チェック</CardTitle>
            </div>
            <Button
              onClick={runChecks}
              disabled={checking}
              size="sm"
            >
              {checking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  チェック中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  チェック実行
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            デプロイ前にシステム状態を確認します
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!checks && !checking && (
            <Alert>
              <AlertDescription>
                チェックを実行してVPSの状態を確認してください
              </AlertDescription>
            </Alert>
          )}

          {checking && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {checks && (
            <div className="space-y-4">
              {/* サマリー */}
              <Alert variant={checks.allPassed ? 'default' : checks.hasWarnings ? 'default' : 'destructive'}>
                <AlertDescription className="font-semibold">
                  {checks.summary}
                </AlertDescription>
              </Alert>

              {/* 詳細チェック結果 */}
              <div className="space-y-3">
                {/* Node.jsバージョン */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  {renderCheckStatus(checks.checks.nodeVersion.status)}
                  <div className="flex-1">
                    <p className="font-medium">Node.jsバージョン</p>
                    <p className="text-sm text-gray-600">{checks.checks.nodeVersion.message}</p>
                    {checks.checks.nodeVersion.fix && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                        {checks.checks.nodeVersion.fix}
                      </code>
                    )}
                  </div>
                </div>

                {/* PM2状態 */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  {renderCheckStatus(checks.checks.pm2Status.status)}
                  <div className="flex-1">
                    <p className="font-medium">PM2プロセス</p>
                    <p className="text-sm text-gray-600">{checks.checks.pm2Status.message}</p>
                    {checks.checks.pm2Status.fix && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                        {checks.checks.pm2Status.fix}
                      </code>
                    )}
                  </div>
                </div>

                {/* 環境変数 */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  {renderCheckStatus(checks.checks.envFiles.status)}
                  <div className="flex-1">
                    <p className="font-medium">環境変数</p>
                    <p className="text-sm text-gray-600">{checks.checks.envFiles.message}</p>
                    {checks.checks.envFiles.found && (
                      <p className="text-xs text-gray-500 mt-1">
                        検出: {checks.checks.envFiles.found.join(', ')}
                      </p>
                    )}
                    {checks.checks.envFiles.fix && (
                      <p className="text-xs text-red-600 mt-1">{checks.checks.envFiles.fix}</p>
                    )}
                  </div>
                </div>

                {/* .nextビルド */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  {renderCheckStatus(checks.checks.nextBuild.status)}
                  <div className="flex-1">
                    <p className="font-medium">.nextディレクトリ</p>
                    <p className="text-sm text-gray-600">{checks.checks.nextBuild.message}</p>
                    {checks.checks.nextBuild.fix && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                        {checks.checks.nextBuild.fix}
                      </code>
                    )}
                  </div>
                </div>

                {/* node_modules */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  {renderCheckStatus(checks.checks.nodeModules.status)}
                  <div className="flex-1">
                    <p className="font-medium">node_modules</p>
                    <p className="text-sm text-gray-600">{checks.checks.nodeModules.message}</p>
                    {checks.checks.nodeModules.fix && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                        {checks.checks.nodeModules.fix}
                      </code>
                    )}
                  </div>
                </div>

                {/* Git状態 */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  {renderCheckStatus(checks.checks.gitStatus.status)}
                  <div className="flex-1">
                    <p className="font-medium">Git状態</p>
                    <p className="text-sm text-gray-600">{checks.checks.gitStatus.message}</p>
                    {checks.checks.gitStatus.branch && (
                      <p className="text-xs text-gray-500 mt-1">
                        ブランチ: {checks.checks.gitStatus.branch}
                      </p>
                    )}
                    {checks.checks.gitStatus.fix && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                        {checks.checks.gitStatus.fix}
                      </code>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* デプロイセクション */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            <CardTitle>ワンクリックデプロイ</CardTitle>
          </div>
          <CardDescription>
            自動でVPSにデプロイします
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cleanBuild}
                onChange={(e) => setCleanBuild(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                クリーンビルド（node_modules再インストール）
              </span>
            </label>
          </div>

          <Alert>
            <AlertDescription>
              デプロイを実行すると以下が自動実行されます：
              <ol className="list-decimal list-inside mt-2 text-sm space-y-1">
                <li>PM2停止</li>
                <li>Git pull（最新コード取得）</li>
                <li>{cleanBuild ? 'node_modules削除 → npm install' : 'npm install'}</li>
                <li>.next削除</li>
                <li>npm run build</li>
                <li>PM2再起動</li>
                <li>ヘルスチェック</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Button
            onClick={runDeploy}
            disabled={deploying}
            size="lg"
            className="w-full"
          >
            {deploying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                デプロイ中...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                デプロイ実行
              </>
            )}
          </Button>

          {/* デプロイログ */}
          {deployLogs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="font-medium text-sm">デプロイログ</span>
              </div>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
                {deployLogs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* デプロイ結果 */}
          {deployResult && (
            <Alert variant={deployResult.success ? 'default' : 'destructive'}>
              <AlertDescription>
                {deployResult.success ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">{deployResult.message}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold">デプロイ失敗: {deployResult.error}</span>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
