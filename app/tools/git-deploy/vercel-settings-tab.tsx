'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, ExternalLink, Copy, Settings, GitBranch, AlertCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function VercelSettingsTab() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const ignoredBuildStepScript = `#!/bin/bash
if [[ "$VERCEL_GIT_COMMIT_REF" != "main" && "$VERCEL_GIT_COMMIT_REF" != "claude/dev-01CBXEFn6RZ3Zb7uDtsizasB" ]] ; then
  echo "🚫 Skipping build for branch: $VERCEL_GIT_COMMIT_REF"
  exit 0
else
  echo "✅ Building branch: $VERCEL_GIT_COMMIT_REF"
  exit 1
fi`

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Zap className="w-7 h-7" />
          Vercel 設定ガイド
        </h2>
        <p className="text-sm opacity-90">
          自動デプロイ設定とブランチ管理の完全ガイド
        </p>
      </div>

      {/* 概要 */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-bold">✨ Vercelの利点</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>Gitにpushするだけで自動的にビルド・デプロイ</li>
              <li>ブランチごとにプレビューURLが自動生成</li>
              <li>本番環境とプレビュー環境を自動的に分離</li>
              <li>VPSへの手動デプロイ作業が不要</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* 2ブランチ戦略 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            2ブランチ戦略
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Badge className="bg-green-600 mt-1">本番</Badge>
              <div className="flex-1">
                <div className="font-bold text-green-900">main ブランチ</div>
                <div className="text-sm text-green-700 mt-1">
                  • 本番環境: https://n3.emverze.com<br />
                  • 直接編集禁止（開発ブランチからマージのみ）<br />
                  • Vercelが自動的に本番環境にデプロイ
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Badge className="bg-blue-600 mt-1">開発</Badge>
              <div className="flex-1">
                <div className="font-bold text-blue-900">claude/dev-01CBXEFn6RZ3Zb7uDtsizasB ブランチ</div>
                <div className="text-sm text-blue-700 mt-1">
                  • プレビュー環境: 自動生成されるプレビューURL<br />
                  • すべての開発作業はこのブランチで実施<br />
                  • Vercelが自動的にプレビュー環境にデプロイ
                </div>
              </div>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              <strong>ポイント:</strong> 開発ブランチでテスト完了後、mainにマージすることで本番環境を更新します。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 作業フロー */}
      <Card>
        <CardHeader>
          <CardTitle>🔄 日常の作業フロー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="bg-gray-700 mt-1">1</Badge>
                <div className="flex-1">
                  <div className="font-semibold">開発ブランチで作業</div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded mt-2 font-mono text-sm">
                    git checkout claude/dev-01CBXEFn6RZ3Zb7uDtsizasB<br />
                    git pull
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-gray-700 mt-1">2</Badge>
                <div className="flex-1">
                  <div className="font-semibold">コード編集・コミット・プッシュ</div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded mt-2 font-mono text-sm">
                    git add .<br />
                    git commit -m "変更内容"<br />
                    git push
                  </div>
                  <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Vercelが自動的にプレビュー環境をビルド・デプロイ
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-gray-700 mt-1">3</Badge>
                <div className="flex-1">
                  <div className="font-semibold">プレビュー環境でテスト</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Vercelダッシュボードまたはプッシュ後に表示されるURLでプレビューを確認
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-green-600 mt-1">4</Badge>
                <div className="flex-1">
                  <div className="font-semibold">テストOKなら本番環境にマージ</div>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded mt-2 font-mono text-sm">
                    git checkout main<br />
                    git pull<br />
                    git merge claude/dev-01CBXEFn6RZ3Zb7uDtsizasB<br />
                    git push
                  </div>
                  <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Vercelが自動的に本番環境を更新
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vercel設定: 不要なブランチのビルドをスキップ */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            重要: 不要なブランチのビルドをスキップ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              この設定により、<strong>main</strong> と <strong>dev</strong> ブランチ以外の自動ビルドを防ぎます。<br />
              ブランチが大量に作成されてもVercelのビルド時間とコストを節約できます。
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="font-semibold">設定手順:</div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">1.</span>
                <div>
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Vercelダッシュボード
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  にアクセス
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">2.</span>
                <div>プロジェクト <code className="bg-gray-800 text-white px-2 py-0.5 rounded">n3-frontend_new</code> を選択</div>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">3.</span>
                <div><strong>Settings</strong> → <strong>Git</strong> に移動</div>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">4.</span>
                <div><strong>Ignored Build Step</strong> セクションを見つける</div>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">5.</span>
                <div>以下のスクリプトをコピーして貼り付け:</div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-x-auto">
                <pre className="whitespace-pre">{ignoredBuildStepScript}</pre>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-white"
                onClick={() => copyToClipboard(ignoredBuildStepScript, 'ignored-build')}
              >
                {copiedSection === 'ignored-build' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                    コピー済み
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    コピー
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-gray-600 bg-white p-3 rounded border">
              <strong>動作:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 ml-2">
                <li><code>main</code> または <code>claude/dev-01CBXEFn6RZ3Zb7uDtsizasB</code> の場合: ビルド実行</li>
                <li>その他のブランチ: ビルドスキップ（コスト削減）</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 環境変数設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            環境変数の設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p>Vercelで環境変数を設定する手順:</p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">1.</span>
                <div>Vercelダッシュボード → プロジェクト選択</div>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">2.</span>
                <div><strong>Settings</strong> → <strong>Environment Variables</strong> に移動</div>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold min-w-[20px]">3.</span>
                <div>必要な環境変数を追加:</div>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs mt-3">
              <div className="text-green-400"># Supabase</div>
              <div>NEXT_PUBLIC_SUPABASE_URL</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
              <div className="mt-2 text-green-400"># eBay API</div>
              <div>EBAY_CLIENT_ID_MJT</div>
              <div>EBAY_CERT_ID</div>
              <div>EBAY_DEV_ID</div>
              <div>EBAY_REDIRECT_URI_PRODUCTION</div>
              <div>EBAY_REDIRECT_URI</div>
              <div className="mt-2 text-green-400"># アプリケーションURL</div>
              <div>NEXT_PUBLIC_APP_URL</div>
            </div>

            <Alert className="mt-3">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                環境変数を更新すると、Vercelが自動的に再デプロイを実行します。
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* よくある質問 */}
      <Card>
        <CardHeader>
          <CardTitle>❓ よくある質問</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="font-semibold text-blue-900">Q: プレビューURLはどこで確認できますか？</div>
              <div className="text-sm text-gray-600 mt-1">
                A: GitにプッシュするとVercelから通知が届きます。また、Vercelダッシュボードの「Deployments」タブで確認できます。
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="font-semibold text-blue-900">Q: ビルドエラーが発生した場合は？</div>
              <div className="text-sm text-gray-600 mt-1">
                A: Vercelダッシュボードの「Deployments」から該当のデプロイを選択し、ログを確認できます。<br />
                よくあるエラー: <code className="bg-gray-100 px-1">outputFileTracingRoot</code> がnext.config.tsに設定されている場合は削除してください。
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="font-semibold text-blue-900">Q: VPSは使わなくなりますか？</div>
              <div className="text-sm text-gray-600 mt-1">
                A: Vercelを本番環境として使用する場合、VPSは不要になります。ただし、特殊な要件（カスタムサーバー設定など）がある場合はVPSも併用できます。
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="font-semibold text-blue-900">Q: ブランチを削除したらデプロイも消えますか？</div>
              <div className="text-sm text-gray-600 mt-1">
                A: はい。ブランチを削除すると、そのブランチのプレビューデプロイも自動的に削除されます。
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 関連リンク */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle>🔗 関連リンク</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Vercelダッシュボード
            </a>
            <a
              href="https://vercel.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Vercel公式ドキュメント
            </a>
            <a
              href="/tools/git-deploy"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Git Deploy ツール（このページ）
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
