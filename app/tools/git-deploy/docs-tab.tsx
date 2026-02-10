'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  BookOpen,
  Rocket,
  Globe,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DocsTab() {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          📚 開発ドキュメント
        </h2>
        <p className="text-sm opacity-90">
          Vercel-First開発フローとデプロイ戦略の完全ガイド
        </p>
      </div>

      {/* サブタブ */}
      <Tabs defaultValue="quickstart" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quickstart">
            <Rocket className="w-4 h-4 mr-2" />
            クイックスタート
          </TabsTrigger>
          <TabsTrigger value="domain">
            <Globe className="w-4 h-4 mr-2" />
            ドメイン設定
          </TabsTrigger>
          <TabsTrigger value="workflow">
            <GitBranch className="w-4 h-4 mr-2" />
            ワークフロー
          </TabsTrigger>
        </TabsList>

        {/* クイックスタート */}
        <TabsContent value="quickstart" className="space-y-4">
          <QuickStartGuide />
        </TabsContent>

        {/* ドメイン設定 */}
        <TabsContent value="domain" className="space-y-4">
          <DomainSetupGuide />
        </TabsContent>

        {/* ワークフロー */}
        <TabsContent value="workflow" className="space-y-4">
          <WorkflowGuide />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// クイックスタートガイド
function QuickStartGuide() {
  return (
    <div className="space-y-4">
      {/* 現在のデプロイ構成 */}
      <Card>
        <CardHeader>
          <CardTitle>📌 現在のデプロイ構成</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">環境</th>
                  <th className="text-left p-2">URL</th>
                  <th className="text-left p-2">更新方法</th>
                  <th className="text-left p-2">頻度</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-semibold">本番環境</td>
                  <td className="p-2">
                    <a href="https://n3.emverze.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      https://n3.emverze.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-2">Vercel自動デプロイ</td>
                  <td className="p-2">mainへのpush時</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">プレビュー環境</td>
                  <td className="p-2">
                    <a href="https://n3-frontend-new.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      https://n3-frontend-new.vercel.app
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-2">Vercel自動デプロイ</td>
                  <td className="p-2">devブランチpush時</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">VPSバックアップ</td>
                  <td className="p-2">
                    <a href="https://vps.n3.emverze.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      https://vps.n3.emverze.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-2">手動デプロイ</td>
                  <td className="p-2">月1回程度</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">ローカル開発</td>
                  <td className="p-2">http://localhost:3000</td>
                  <td className="p-2">自動同期</td>
                  <td className="p-2">5分間隔</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 推奨開発フロー */}
      <Card>
        <CardHeader>
          <CardTitle>✨ 推奨開発フロー（最も簡単！）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold">Web Claudeでコード修正</h4>
                <p className="text-sm text-gray-600">Web Claudeを開いて「このファイルを修正してください」と指示</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold">Git commit & push（Web Claudeに依頼）</h4>
                <p className="text-sm text-gray-600 mb-2">「変更をコミットしてpushしてください」</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono">
                  git add .<br />
                  git commit -m &quot;feat: 修正内容の説明&quot;<br />
                  git push origin claude/dev-01CBXEFn6RZ3Zb7uDtsizasB
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold">Vercelが自動デプロイ（1〜2分）</h4>
                <p className="text-sm text-gray-600">GitHubにpush完了後、Vercelが自動的にビルド開始</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold">プレビューURLで動作確認</h4>
                <p className="text-sm text-gray-600">ブラウザでアクセスして動作確認</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h4 className="font-semibold">mainにマージ（Web Claudeに依頼）</h4>
                <p className="text-sm text-gray-600 mb-2">「テストOKなのでmainにマージしてpushしてください」</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono">
                  git checkout main<br />
                  git merge claude/dev-01CBXEFn6RZ3Zb7uDtsizasB<br />
                  git push origin main
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                6
              </div>
              <div>
                <h4 className="font-semibold text-green-600">本番環境に自動デプロイ 🎉</h4>
                <p className="text-sm text-gray-600">https://n3.emverze.com に自動的に反映（1〜2分）</p>
              </div>
            </div>
          </div>

          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>所要時間:</strong> 合計 5〜15分で本番環境に反映可能！
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* よくある作業パターン */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 よくある作業パターン</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-2">パターン1: 簡単な修正（Web Claudeのみで完結）</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Web Claudeで修正依頼</li>
                <li>「コミットしてpushしてください」</li>
                <li>Vercelプレビューで確認</li>
                <li>「mainにマージしてpushしてください」</li>
                <li>本番反映 ✅</li>
              </ol>
              <p className="text-xs text-gray-500 mt-2">所要時間: 5〜10分</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-2">パターン2: ローカルで確認してから本番反映</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Web Claudeで修正依頼</li>
                <li>「devブランチにpushしてください」</li>
                <li>Macで自動同期（5分以内）</li>
                <li>ローカルで npm run dev で確認</li>
                <li>「mainにマージしてpushしてください」</li>
                <li>本番反映 ✅</li>
              </ol>
              <p className="text-xs text-gray-500 mt-2">所要時間: 10〜15分</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold mb-2">パターン3: 大規模な変更（慎重にテスト）</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Web Claudeで修正依頼</li>
                <li>「devブランチにpushしてください」</li>
                <li>Vercelプレビューで動作確認</li>
                <li>ローカルでも確認（npm run dev）</li>
                <li>「mainにマージしてpushしてください」</li>
                <li>本番反映 ✅</li>
              </ol>
              <p className="text-xs text-gray-500 mt-2">所要時間: 15〜30分</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ドメイン設定ガイド
function DomainSetupGuide() {
  return (
    <div className="space-y-4">
      {/* 現在の状態 */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="font-bold mb-2">📌 現在の状態</div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Vercel URL</strong>: https://n3-frontend-new.vercel.app ✅ 動作確認済み</li>
            <li><strong>カスタムドメイン</strong>: n3.emverze.com（設定中）</li>
            <li><strong>VPS</strong>: vps.n3.emverze.com（バックアップ用に移行予定）</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* ステップ1 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              1
            </div>
            Vercelでドメインを追加
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold">1.1 Vercelダッシュボードにアクセス</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
              <li>
                <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://vercel.com/dashboard <ExternalLink className="w-3 h-3 inline" />
                </a> にアクセス
              </li>
              <li>プロジェクト <strong>n3-frontend_new</strong> を選択</li>
              <li><strong>Settings</strong> タブをクリック</li>
              <li>左メニューから <strong>Domains</strong> を選択</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">1.2 ドメインを追加</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
              <li>「Add Domain」ボタンをクリック</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded text-xs">n3.emverze.com</code> を入力</li>
              <li>「Add」をクリック</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">1.3 Production環境に接続</h4>
            <p className="text-sm text-gray-600">
              「Connect to an environment」で <strong>Production</strong> を選択してください。
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              追加後、Vercelが以下のようなDNS設定値を表示します：
              <div className="bg-gray-900 text-gray-100 p-3 rounded mt-2 text-xs font-mono">
                Type: CNAME<br />
                Name: n3<br />
                Value: cname.vercel-dns.com
              </div>
              または
              <div className="bg-gray-900 text-gray-100 p-3 rounded mt-2 text-xs font-mono">
                Type: A<br />
                Name: @<br />
                Value: 76.76.21.21
              </div>
              <p className="mt-2"><strong>この値をメモしてください！</strong> 次のステップで使用します。</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* ステップ2 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              2
            </div>
            DNS設定を変更
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold">2.1 現在のDNS設定（変更前）</h4>
            <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
              <div className="font-mono text-xs space-y-1">
                <div><strong>Host:</strong> n3.emverze.com</div>
                <div><strong>Type:</strong> A</div>
                <div><strong>Value:</strong> 160.16.120.186 (VPS)</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2.2 新しいDNS設定（変更後）</h4>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold mb-2">パターンA: CNAMEレコードの場合（推奨）</p>
                <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                  <div className="font-mono text-xs space-y-1">
                    <div><strong>Host:</strong> n3.emverze.com</div>
                    <div><strong>Type:</strong> CNAME</div>
                    <div><strong>Value:</strong> cname.vercel-dns.com</div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">パターンB: Aレコードの場合</p>
                <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                  <div className="font-mono text-xs space-y-1">
                    <div><strong>Host:</strong> n3.emverze.com</div>
                    <div><strong>Type:</strong> A</div>
                    <div><strong>Value:</strong> 76.76.21.21</div>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>注意:</strong> Vercelが指定する実際の値を使用してください。上記は例です。
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2.3 VPS用の新しいレコードを追加</h4>
            <p className="text-sm text-gray-600">VPSをバックアップ用に残すため、新しいサブドメインを追加します：</p>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
              <div className="font-mono text-xs space-y-1">
                <div><strong>Host:</strong> vps.n3.emverze.com</div>
                <div><strong>Type:</strong> A</div>
                <div><strong>Value:</strong> 160.16.120.186</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ステップ3 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              3
            </div>
            反映待ち（15分〜48時間）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            DNS設定の変更は即座には反映されません。通常：
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
            <li><strong>最短</strong>: 15分〜1時間</li>
            <li><strong>通常</strong>: 2〜6時間</li>
            <li><strong>最長</strong>: 48時間</li>
          </ul>

          <div className="space-y-2">
            <h4 className="font-semibold">反映状況を確認する方法</h4>
            <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono">
              nslookup n3.emverze.com
            </div>
            <p className="text-xs text-gray-500">
              または <a href="https://dnschecker.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                https://dnschecker.org/ <ExternalLink className="w-3 h-3 inline" />
              </a> で確認
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 最終確認 */}
      <Card>
        <CardHeader>
          <CardTitle>✅ 最終確認チェックリスト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold mb-2">DNS設定</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>n3.emverze.com がCNAME（またはA）レコードでVercelを指している</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>vps.n3.emverze.com がAレコードで 160.16.120.186 を指している</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>nslookupで正しいIPアドレス/CNAMEが返ってくる</span>
              </li>
            </ul>

            <h4 className="font-semibold mb-2 mt-4">Vercel設定</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>Vercel Domains画面で「Valid Configuration ✅」と表示される</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>https://n3.emverze.com でサイトが表示される</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>SSL証明書（🔒）が有効になっている</span>
              </li>
            </ul>

            <h4 className="font-semibold mb-2 mt-4">VPS設定</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>https://vps.n3.emverze.com でVPSにアクセスできる</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>SSH接続が ssh root@vps.n3.emverze.com で可能</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ワークフローガイド
function WorkflowGuide() {
  return (
    <div className="space-y-4">
      {/* デプロイ戦略 */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 デプロイ戦略</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">環境</th>
                  <th className="text-left p-2">URL</th>
                  <th className="text-left p-2">デプロイ方法</th>
                  <th className="text-left p-2">頻度</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-semibold">本番環境</td>
                  <td className="p-2">https://n3.emverze.com</td>
                  <td className="p-2">Vercel自動デプロイ</td>
                  <td className="p-2">mainへのpush時（即座）</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">プレビュー環境</td>
                  <td className="p-2">https://n3-frontend-new.vercel.app</td>
                  <td className="p-2">Vercel自動デプロイ</td>
                  <td className="p-2">devブランチpush時</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">VPSバックアップ</td>
                  <td className="p-2">https://vps.n3.emverze.com</td>
                  <td className="p-2">手動デプロイ</td>
                  <td className="p-2">月1回程度</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">ローカル開発</td>
                  <td className="p-2">http://localhost:3000</td>
                  <td className="p-2">自動同期（5分間隔）</td>
                  <td className="p-2">常時</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 2ブランチ戦略 */}
      <Card>
        <CardHeader>
          <CardTitle>🌿 2ブランチ戦略</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold mb-2">1. main ブランチ（本番環境）</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>用途</strong>: 本番環境にデプロイされるコード</li>
              <li><strong>Vercelデプロイ</strong>: https://n3.emverze.com</li>
              <li><strong>自動デプロイ</strong>: mainへのpushで1〜2分で自動デプロイ</li>
              <li><strong>直接編集禁止</strong>: mainブランチには直接pushしない</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold mb-2">2. claude/dev-01CBXEFn6RZ3Zb7uDtsizasB ブランチ（開発環境）</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>用途</strong>: すべての開発・修正作業を行うブランチ</li>
              <li><strong>Vercelデプロイ</strong>: プレビューURL（自動生成）</li>
              <li><strong>自動デプロイ</strong>: プッシュ時に自動的にプレビュー環境を作成</li>
              <li><strong>作業フロー</strong>: このブランチで開発 → Vercelプレビューでテスト → mainにマージ → 本番デプロイ</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 環境変数管理 */}
      <Card>
        <CardHeader>
          <CardTitle>🔐 環境変数管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">Vercel環境変数（100+個設定済み）</h4>
            <p className="text-sm text-gray-600 mb-2">Vercel Settings → Environment Variables で管理</p>
            <div className="bg-gray-100 p-3 rounded text-xs space-y-1">
              <div>• NEXT_PUBLIC_SUPABASE_URL</div>
              <div>• NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
              <div>• SUPABASE_SERVICE_ROLE_KEY</div>
              <div>• JWT_SECRET</div>
              <div>• eBay関連（10+個）</div>
              <div>• その他API keys（90+個）</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">ローカル環境変数</h4>
            <p className="text-sm text-gray-600">.env.local ファイルで管理（Gitにコミットしない）</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">VPS環境変数</h4>
            <p className="text-sm text-gray-600">.env.local または .env.production で管理</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>環境変数を更新したら:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Vercel</strong>: 自動的に再デプロイ</li>
                <li><strong>VPS</strong>: pm2 restart n3-frontend</li>
                <li><strong>ローカル</strong>: 開発サーバーを再起動</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* ベストプラクティス */}
      <Card>
        <CardHeader>
          <CardTitle>💡 ベストプラクティス</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">✅ 推奨される行動</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>常にdevブランチで作業（Web Claudeに「devブランチで修正してpushしてください」）</li>
                <li>Vercelプレビューで必ずテスト（mainにマージする前に必ず動作確認）</li>
                <li>こまめにコミット（小さな変更ごとにコミット、コミットメッセージは明確に）</li>
                <li>環境変数の管理（.env.localはGitにコミットしない、Vercelには必要な環境変数をすべて追加）</li>
                <li>VPSは月1回バックアップ（通常はVercelのみ使用、VPSは緊急時のバックアップ）</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-red-600">❌ 避けるべき行動</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>mainに直接push（必ずdevブランチで作業してからマージ）</li>
                <li>環境変数をハードコード（必ず.env.localまたはVercel環境変数を使用）</li>
                <li>outputFileTracingRootの設定（next.config.tsに絶対パスを書かない）</li>
                <li>VPSでPM2起動中にビルド（必ず pm2 stop してからビルド）</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
