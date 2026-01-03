'use client'

/**
 * N3 システムテストダッシュボード
 * 
 * 全てのAPIをブラウザから実行・テストできるページ
 * URL: /dev/test-dashboard
 */

import { useState, useCallback } from 'react'
import { 
  Play, RefreshCw, Trash2, CheckCircle, XCircle, 
  AlertTriangle, Clock, Zap, Package, Calendar, Settings
} from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  response?: any
  error?: string
  duration?: number
}

export default function TestDashboard() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateResult = useCallback((name: string, update: Partial<TestResult>) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name)
      if (existing) {
        return prev.map(r => r.name === name ? { ...r, ...update } : r)
      }
      return [...prev, { name, status: 'pending', ...update }]
    })
  }, [])

  const runTest = async (name: string, endpoint: string, method = 'GET', body?: any) => {
    updateResult(name, { status: 'running' })
    const start = Date.now()
    
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      }
      if (body) {
        options.body = JSON.stringify(body)
      }
      
      const res = await fetch(endpoint, options)
      const data = await res.json()
      const duration = Date.now() - start
      
      updateResult(name, {
        status: res.ok ? 'success' : 'error',
        response: data,
        duration,
        error: res.ok ? undefined : data.error || `HTTP ${res.status}`
      })
    } catch (e: any) {
      updateResult(name, {
        status: 'error',
        error: e.message,
        duration: Date.now() - start
      })
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setResults([])
    
    // 1. ヘルスチェック
    await runTest('ヘルスチェック', '/api/health')
    
    // 2. 自動化設定
    await runTest('自動化設定取得', '/api/automation/settings')
    await runTest('Cron設定取得', '/api/automation/cron-settings')
    
    // 3. スケジュール関連
    await runTest('スケジュール一覧 (listing_schedule)', '/api/listing/execute-schedule-v2?status=PENDING')
    await runTest('スケジュール確認 (v2)', '/api/listing/execute-schedule-v2')
    
    // 4. 在庫監視
    await runTest('在庫監視統計', '/api/inventory-monitoring/stats')
    await runTest('在庫監視ログ', '/api/inventory-monitoring/logs')
    await runTest('在庫変更検出', '/api/inventory-monitoring/changes')
    
    // 5. 商品データ
    await runTest('商品データ取得', '/api/products?limit=3')
    await runTest('在庫データ取得', '/api/inventory?limit=3')
    
    setIsRunning(false)
  }

  const runInventoryMonitoring = async () => {
    await runTest('在庫監視実行', '/api/inventory-monitoring/execute')
  }

  const runAutoApprove = async () => {
    await runTest('自動承認実行', '/api/automation/auto-approve', 'POST', { dryRun: true })
  }

  const runAutoSchedule = async () => {
    await runTest('自動スケジュール実行', '/api/automation/auto-schedule', 'POST', { dryRun: true })
  }

  const runScheduleExecution = async (dryRun: boolean = true) => {
    await runTest(
      `スケジュール出品${dryRun ? '(ドライラン)' : '(実行)'}`,
      '/api/listing/execute-schedule-v2',
      'POST',
      { dry_run: dryRun, limit: 10, status_filter: 'PENDING' }
    )
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              N3 システムテスト ダッシュボード
            </h1>
            <p className="text-slate-400 mt-1">全APIをブラウザから実行・テスト</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-green-400">{successCount} 成功</span>
              {' / '}
              <span className="text-red-400">{errorCount} エラー</span>
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 transition"
          >
            <Play className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">全テスト実行</div>
              <div className="text-xs text-blue-200">基本APIチェック</div>
            </div>
          </button>

          <button
            onClick={runInventoryMonitoring}
            disabled={isRunning}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl hover:from-green-500 hover:to-green-600 disabled:opacity-50 transition"
          >
            <Package className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">在庫監視実行</div>
              <div className="text-xs text-green-200">手動トリガー</div>
            </div>
          </button>

          <button
            onClick={runAutoApprove}
            disabled={isRunning}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 transition"
          >
            <CheckCircle className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">自動承認テスト</div>
              <div className="text-xs text-purple-200">ドライラン</div>
            </div>
          </button>

          <button
            onClick={runAutoSchedule}
            disabled={isRunning}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 transition"
          >
            <Calendar className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">自動スケジュール</div>
              <div className="text-xs text-orange-200">ドライラン</div>
            </div>
          </button>
        </div>

        {/* スケジュール出品実行ボタン */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => runScheduleExecution(true)}
            disabled={isRunning}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 transition"
          >
            <Zap className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">スケジュール出品 (ドライラン)</div>
              <div className="text-xs text-cyan-200">PENDINGステータスを確認</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (confirm('❗ 実際にeBayに出品します。よろしいですか？')) {
                runScheduleExecution(false)
              }
            }}
            disabled={isRunning}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-red-600 to-red-700 rounded-xl hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition"
          >
            <Zap className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">スケジュール出品 (実行)</div>
              <div className="text-xs text-red-200">❗ 実際に出品されます</div>
            </div>
          </button>
        </div>

        {/* 個別APIテスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <TestButton
            label="今すぐ出品（テスト）"
            description="dryRun: true"
            icon={<Zap className="w-5 h-5" />}
            onClick={() => runTest(
              '今すぐ出品テスト',
              '/api/listing/immediate',
              'POST',
              { productIds: [1], marketplace: 'ebay', account: 'mjt', dryRun: true }
            )}
            disabled={isRunning}
          />
          <TestButton
            label="スケジュール追加（テスト）"
            description="scheduled mode"
            icon={<Calendar className="w-5 h-5" />}
            onClick={() => runTest(
              'スケジュール追加テスト',
              '/api/approval/create-schedule',
              'POST',
              { productIds: [1], strategy: { mode: 'scheduled' } }
            )}
            disabled={isRunning}
          />
          <TestButton
            label="設定初期化"
            description="デフォルト設定作成"
            icon={<Settings className="w-5 h-5" />}
            onClick={() => runTest(
              '設定初期化',
              '/api/automation/settings',
              'POST',
              { type: 'both' }
            )}
            disabled={isRunning}
          />
        </div>

        {/* 結果表示 */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="font-semibold">テスト結果</h2>
            <button
              onClick={() => setResults([])}
              className="text-sm text-slate-400 hover:text-white"
            >
              クリア
            </button>
          </div>
          
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              テストを実行するとここに結果が表示されます
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {results.map((result, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                    </div>
                    {result.duration && (
                      <span className="text-xs text-slate-400">{result.duration}ms</span>
                    )}
                  </div>
                  
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-sm text-red-300">
                      {result.error}
                    </div>
                  )}
                  
                  {result.response && (
                    <details className="mt-2">
                      <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                        レスポンス詳細
                      </summary>
                      <pre className="mt-2 p-2 bg-slate-900 rounded text-xs overflow-auto max-h-60">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SQL参考 */}
        <div className="mt-8 bg-slate-800 rounded-xl p-4">
          <h3 className="font-semibold mb-4">📋 Supabase SQL（手動実行用）</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-slate-400 mb-1">スケジュールデータ確認:</div>
              <pre className="p-3 bg-slate-900 rounded overflow-x-auto text-green-400">
{`SELECT id, product_id, marketplace, status, scheduled_at, created_at
FROM listing_schedule
ORDER BY created_at DESC LIMIT 20;`}
              </pre>
            </div>
            
            <div>
              <div className="text-slate-400 mb-1">サンプルデータ削除 (古いデータ):</div>
              <pre className="p-3 bg-slate-900 rounded overflow-x-auto text-yellow-400">
{`-- テスト・サンプルデータ削除
DELETE FROM listing_schedule
WHERE 
  status = 'ERROR' 
  OR (status IN ('PENDING', 'SCHEDULED') AND scheduled_at < NOW() - INTERVAL '3 days');

-- 削除後確認
SELECT COUNT(*) as remaining FROM listing_schedule;`}
              </pre>
            </div>

            <div>
              <div className="text-slate-400 mb-1">全スケジュール削除 (注意!):</div>
              <pre className="p-3 bg-slate-900 rounded overflow-x-auto text-red-400">
{`-- 全削除前にバックアップ
CREATE TABLE IF NOT EXISTS listing_schedule_backup AS
SELECT * FROM listing_schedule;

-- 全削除
TRUNCATE TABLE listing_schedule;

-- 確認
SELECT COUNT(*) FROM listing_schedule;`}
              </pre>
            </div>
            
            <div>
              <div className="text-slate-400 mb-1">自動化設定確認:</div>
              <pre className="p-3 bg-slate-900 rounded overflow-x-auto text-blue-400">
{`SELECT * FROM auto_approval_settings;
SELECT * FROM default_schedule_settings;`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestButton({ 
  label, 
  description, 
  icon, 
  onClick, 
  disabled 
}: { 
  label: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition text-left"
    >
      <div className="text-slate-400">{icon}</div>
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
    </button>
  )
}
