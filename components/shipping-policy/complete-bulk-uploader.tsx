'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Upload, Loader2, CheckCircle, XCircle, Pause, Play, 
  RefreshCw, AlertTriangle, Database, Globe, Settings
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface UploadProgress {
  total: number
  success: number
  failed: number
  skipped: number
  current: number
  currentPolicyName: string
}

interface RateTableMapping {
  [key: string]: string // rate_table_name -> ebay_rate_table_id
}

interface WorkflowStatus {
  stage1: 'pending' | 'running' | 'completed' | 'error'
  stage2: 'pending' | 'running' | 'completed' | 'error'
  stage3: 'pending' | 'running' | 'completed' | 'error'
  stage4: 'pending' | 'running' | 'completed' | 'error'
}

export function CompleteBulkUploader() {
  const [selectedAccount, setSelectedAccount] = useState<'mjt' | 'green'>('green')
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>({
    stage1: 'pending',
    stage2: 'pending',
    stage3: 'pending',
    stage4: 'pending'
  })
  
  // 段階I: Rate Table
  const [rateTableMapping, setRateTableMapping] = useState<RateTableMapping>({})
  const [rateTableStatus, setRateTableStatus] = useState<string>('')
  const [missingRateTables, setMissingRateTables] = useState<string[]>([])
  
  // 段階II: 除外国
  const [excludedCountries, setExcludedCountries] = useState<string[]>([])
  
  // 段階III: 既存ポリシー
  const [existingPolicies, setExistingPolicies] = useState<Set<string>>(new Set())
  const [newPoliciesCount, setNewPoliciesCount] = useState(0)
  
  // 段階IV: アップロード
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0, success: 0, failed: 0, skipped: 0, current: 0, currentPolicyName: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [intervalMs, setIntervalMs] = useState(1200)
  
  const pausedRef = useRef(false)
  const abortRef = useRef(false)

  // ========================================
  // 段階 I: Rate Table ID取得
  // ========================================
  const executeStage1 = async () => {
    setWorkflowStatus(prev => ({ ...prev, stage1: 'running' }))
    setRateTableStatus('eBayからRate Table一覧を取得中...')
    
    try {
      const response = await fetch(`/api/ebay/sync-rate-tables?account=${selectedAccount}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Rate Table取得に失敗しました')
      }
      
      setRateTableMapping(data.mapping || {})
      setMissingRateTables(data.missingTables || [])
      
      const count = Object.keys(data.mapping || {}).length
      setRateTableStatus(`${count}個のRate Tableを取得完了`)
      
      if (data.missingTables?.length > 0) {
        setRateTableStatus(`${count}個取得 / ${data.missingTables.length}個が未登録`)
        setWorkflowStatus(prev => ({ ...prev, stage1: 'error' }))
      } else {
        setWorkflowStatus(prev => ({ ...prev, stage1: 'completed' }))
      }
      
      return data.mapping || {}
    } catch (error: any) {
      setRateTableStatus(`エラー: ${error.message}`)
      setWorkflowStatus(prev => ({ ...prev, stage1: 'error' }))
      return {}
    }
  }

  // ========================================
  // 段階 II: 除外国リスト取得
  // ========================================
  const executeStage2 = async () => {
    setWorkflowStatus(prev => ({ ...prev, stage2: 'running' }))
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('excluded_countries_master')
        .select('country_code')
        .order('country_code')

      if (error) throw error
      
      const countries = data.map(item => item.country_code)
      setExcludedCountries(countries)
      setWorkflowStatus(prev => ({ ...prev, stage2: 'completed' }))
      
      return countries
    } catch (error: any) {
      console.error('除外国リスト取得エラー:', error)
      setWorkflowStatus(prev => ({ ...prev, stage2: 'error' }))
      return []
    }
  }

  // ========================================
  // 段階 III: 既存ポリシー確認
  // ========================================
  const executeStage3 = async () => {
    setWorkflowStatus(prev => ({ ...prev, stage3: 'running' }))
    
    try {
      // eBayから既存ポリシーを取得
      const response = await fetch(`/api/ebay/list-policies?account=${selectedAccount}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '既存ポリシー取得に失敗しました')
      }
      
      // ポリシー名のSetを作成
      const existingNames = new Set<string>(
        (data.policies || []).map((p: any) => p.name)
      )
      setExistingPolicies(existingNames)
      
      // DBの全ポリシー数を取得
      const supabase = createClient()
      const { count } = await supabase
        .from('shipping_policies')
        .select('*', { count: 'exact', head: true })
      
      const newCount = (count || 0) - existingNames.size
      setNewPoliciesCount(Math.max(0, newCount))
      
      setWorkflowStatus(prev => ({ ...prev, stage3: 'completed' }))
      
      return existingNames
    } catch (error: any) {
      console.error('既存ポリシー確認エラー:', error)
      setWorkflowStatus(prev => ({ ...prev, stage3: 'error' }))
      return new Set<string>()
    }
  }

  // ========================================
  // 段階 IV: 配送ポリシー一括登録
  // ========================================
  const executeStage4 = async (
    mapping: RateTableMapping, 
    countries: string[], 
    existing: Set<string>
  ) => {
    setWorkflowStatus(prev => ({ ...prev, stage4: 'running' }))
    setUploading(true)
    pausedRef.current = false
    abortRef.current = false
    setErrors([])
    
    try {
      const supabase = createClient()
      
      // 全ポリシーを取得
      let allPolicies: any[] = []
      let from = 0
      const limit = 1000

      while (true) {
        const { data, error } = await supabase
          .from('shipping_policies')
          .select('*')
          .order('id', { ascending: true })
          .range(from, from + limit - 1)

        if (error) throw error
        if (!data || data.length === 0) break

        allPolicies = [...allPolicies, ...data]
        if (data.length < limit) break
        from += limit
      }

      console.log(`✅ ${allPolicies.length}件のポリシーを読み込みました`)

      setProgress({
        total: allPolicies.length,
        success: 0,
        failed: 0,
        skipped: 0,
        current: 0,
        currentPolicyName: ''
      })

      let successCount = 0
      let failedCount = 0
      let skippedCount = 0
      const errorLog: string[] = []

      for (let i = 0; i < allPolicies.length; i++) {
        // 中断チェック
        if (abortRef.current) {
          console.log('⏹ アップロード中断')
          break
        }

        // 一時停止チェック
        while (pausedRef.current) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        const policy = allPolicies[i]

        setProgress(prev => ({
          ...prev,
          current: i + 1,
          currentPolicyName: policy.policy_name
        }))

        // 既存チェック
        if (existing.has(policy.policy_name)) {
          skippedCount++
          console.log(`⏭ スキップ（既存）: ${policy.policy_name}`)
          setProgress(prev => ({ ...prev, skipped: skippedCount }))
          continue
        }

        try {
          // ★重要: rate_table_name をeBay rateTableId に変換
          const rateTableName = policy.rate_table_name
          const ebayRateTableId = mapping[rateTableName]

          if (!ebayRateTableId) {
            failedCount++
            const errorMsg = `❌ ${policy.policy_name}: Rate Table "${rateTableName}"のIDが見つかりません`
            errorLog.push(errorMsg)
            console.error(errorMsg)
            continue
          }

          // 配送オプション構築
          const shippingOptions: any[] = [
            // USA向け（固定料金）
            {
              costType: 'FLAT_RATE',
              optionType: 'DOMESTIC',
              shippingServices: [
                {
                  shippingCarrierCode: 'OTHER',
                  shippingServiceCode: 'ExpeditedShippingFromOutsideUS',
                  sortOrder: 1,
                  freeShipping: false,
                  shippingCost: {
                    value: policy.flat_shipping_cost?.toFixed(2) || '10.00',
                    currency: 'USD'
                  },
                  additionalShippingCost: {
                    value: policy.flat_shipping_cost?.toFixed(2) || '10.00',
                    currency: 'USD'
                  },
                  shipToLocations: {
                    regionIncluded: [{ regionName: 'US', regionType: 'COUNTRY' }]
                  }
                }
              ]
            },
            // 国際配送（Rate Table使用）
            {
              costType: 'CALCULATED',
              optionType: 'INTERNATIONAL',
              rateTableId: ebayRateTableId, // ★システムIDを使用
              shippingServices: [
                {
                  shippingCarrierCode: 'OTHER',
                  shippingServiceCode: 'ExpeditedShippingFromOutsideUS',
                  sortOrder: 1,
                  freeShipping: false,
                  shipToLocations: {
                    regionIncluded: [{ regionName: 'WORLDWIDE', regionType: 'WORLD_REGION' }],
                    regionExcluded: [
                      { regionName: 'US', regionType: 'COUNTRY' },
                      ...countries.map(code => ({ regionName: code, regionType: 'COUNTRY' }))
                    ]
                  }
                }
              ]
            }
          ]

          const payload = {
            name: policy.policy_name,
            description: policy.description || `Shipping policy for ${policy.policy_name}`,
            marketplaceId: 'EBAY_US',
            categoryTypes: [{ name: 'ALL_EXCLUDING_MOTORS_VEHICLES', default: false }],
            handlingTime: { value: policy.handling_time_days || 3, unit: 'DAY' },
            shippingOptions
          }

          console.log(`📤 [${i + 1}/${allPolicies.length}] ${policy.policy_name} (Rate Table ID: ${ebayRateTableId})`)

          const response = await fetch('/api/ebay/shipping-policy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-eBay-Account': selectedAccount
            },
            body: JSON.stringify(payload)
          })

          const responseData = await response.json()

          if (response.ok) {
            successCount++
            console.log(`✅ 成功: ${policy.policy_name}`)

            // DBに成功を記録
            await supabase
              .from('shipping_policies')
              .update({
                ebay_policy_id: responseData.fulfillmentPolicyId,
                status: 'uploaded',
                updated_at: new Date().toISOString()
              })
              .eq('id', policy.id)

          } else {
            // 重複エラーの場合はスキップ扱い
            const errorMessage = responseData.error || ''
            if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
              skippedCount++
              console.log(`⏭ スキップ（重複）: ${policy.policy_name}`)
            } else {
              failedCount++
              const errorMsg = `❌ ${policy.policy_name}: ${errorMessage}`
              errorLog.push(errorMsg)
              console.error(errorMsg)

              await supabase
                .from('shipping_policies')
                .update({
                  status: 'failed',
                  error_message: errorMessage,
                  updated_at: new Date().toISOString()
                })
                .eq('id', policy.id)
            }
          }

        } catch (error: any) {
          failedCount++
          const errorMsg = `❌ ${policy.policy_name}: ${error.message}`
          errorLog.push(errorMsg)
          console.error(errorMsg)
        }

        setProgress(prev => ({
          ...prev,
          success: successCount,
          failed: failedCount,
          skipped: skippedCount
        }))

        // Rate limit対策
        if (i < allPolicies.length - 1) {
          await new Promise(resolve => setTimeout(resolve, intervalMs))
        }
      }

      console.log(`🎉 完了: 成功${successCount} / スキップ${skippedCount} / 失敗${failedCount}`)
      setErrors(errorLog)
      setWorkflowStatus(prev => ({ ...prev, stage4: 'completed' }))

    } catch (error: any) {
      console.error('❌ 一括アップロードエラー:', error)
      setErrors([error.message])
      setWorkflowStatus(prev => ({ ...prev, stage4: 'error' }))
    } finally {
      setUploading(false)
    }
  }

  // ========================================
  // 全段階実行
  // ========================================
  const executeAllStages = async () => {
    // 段階I
    const mapping = await executeStage1()
    if (Object.keys(mapping).length === 0) {
      alert('Rate Tableの取得に失敗しました。eBayにRate Tableが登録されているか確認してください。')
      return
    }

    // 段階II
    const countries = await executeStage2()

    // 段階III
    const existing = await executeStage3()

    // 段階IV
    await executeStage4(mapping, countries, existing)
  }

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'running': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          完全版：配送ポリシー一括登録
        </h2>
        <p className="text-sm opacity-90">
          4段階ワークフロー: Rate Table ID取得 → 除外国設定 → 既存確認 → 一括登録
        </p>
      </div>

      {/* アカウント選択 */}
      <Card>
        <CardHeader>
          <CardTitle>eBayアカウント選択</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedAccount === 'green' ? 'default' : 'outline'}
              onClick={() => setSelectedAccount('green')}
              disabled={uploading}
              className="h-20"
            >
              <div>
                <div className="font-bold text-lg">GREEN</div>
                <div className="text-xs opacity-70">メインアカウント</div>
              </div>
            </Button>
            <Button
              variant={selectedAccount === 'mjt' ? 'default' : 'outline'}
              onClick={() => setSelectedAccount('mjt')}
              disabled={uploading}
              className="h-20"
            >
              <div>
                <div className="font-bold text-lg">MJT</div>
                <div className="text-xs opacity-70">mystical-japan-treasures</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ワークフロー状態 */}
      <Card>
        <CardHeader>
          <CardTitle>ワークフロー状態</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 段階I */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStageIcon(workflowStatus.stage1)}
            <div className="flex-1">
              <div className="font-medium">段階I: Rate Table ID取得</div>
              <div className="text-sm text-gray-600">
                {rateTableStatus || '60種類のRate TableのシステムIDを取得'}
              </div>
              {missingRateTables.length > 0 && (
                <div className="text-xs text-red-500 mt-1">
                  未登録: {missingRateTables.slice(0, 5).join(', ')}
                  {missingRateTables.length > 5 && `...他${missingRateTables.length - 5}個`}
                </div>
              )}
            </div>
            <div className="text-sm font-mono text-gray-500">
              {Object.keys(rateTableMapping).length}/60
            </div>
          </div>

          {/* 段階II */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStageIcon(workflowStatus.stage2)}
            <div className="flex-1">
              <div className="font-medium">段階II: 除外国設定</div>
              <div className="text-sm text-gray-600">
                国際配送の除外国リストを準備
              </div>
            </div>
            <div className="text-sm font-mono text-gray-500">
              {excludedCountries.length}カ国
            </div>
          </div>

          {/* 段階III */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStageIcon(workflowStatus.stage3)}
            <div className="flex-1">
              <div className="font-medium">段階III: 既存ポリシー確認</div>
              <div className="text-sm text-gray-600">
                eBay登録済みポリシーと比較、新規登録対象を抽出
              </div>
            </div>
            <div className="text-sm font-mono text-gray-500">
              既存: {existingPolicies.size}件 / 新規: {newPoliciesCount}件
            </div>
          </div>

          {/* 段階IV */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStageIcon(workflowStatus.stage4)}
            <div className="flex-1">
              <div className="font-medium">段階IV: 一括登録実行</div>
              <div className="text-sm text-gray-600">
                Rate Table IDを置換し、バッチ処理で登録
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            アップロード設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-2">
              API呼び出し間隔（ミリ秒）
            </label>
            <input
              type="number"
              value={intervalMs}
              onChange={(e) => setIntervalMs(parseInt(e.target.value))}
              disabled={uploading}
              min={500}
              max={5000}
              step={100}
              className="w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              推奨: 1200ms = 約24分で1,200件完了
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 進捗表示 */}
      {uploading && (
        <Card>
          <CardHeader>
            <CardTitle>アップロード進捗</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  {progress.current} / {progress.total} ポリシー
                </span>
                <span className="text-sm text-gray-600">
                  {progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%
                </span>
              </div>
              <Progress value={progress.total > 0 ? (progress.current / progress.total) * 100 : 0} />
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{progress.current}</div>
                <div className="text-xs text-gray-600">処理中</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{progress.success}</div>
                <div className="text-xs text-gray-600">成功</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">{progress.skipped}</div>
                <div className="text-xs text-gray-600">スキップ</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">{progress.failed}</div>
                <div className="text-xs text-gray-600">失敗</div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">現在処理中:</div>
              <div className="text-xs font-mono text-gray-600 mt-1">{progress.currentPolicyName}</div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => { pausedRef.current = !pausedRef.current }}
                variant="outline"
                className="flex-1"
              >
                {pausedRef.current ? (
                  <><Play className="w-4 h-4 mr-2" />再開</>
                ) : (
                  <><Pause className="w-4 h-4 mr-2" />一時停止</>
                )}
              </Button>
              <Button
                onClick={() => { abortRef.current = true }}
                variant="destructive"
                className="flex-1"
              >
                中断
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 開始ボタン */}
      {!uploading && (
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={executeAllStages}
              size="lg"
              className="w-full"
              disabled={uploading}
            >
              <Upload className="w-5 h-5 mr-2" />
              {selectedAccount.toUpperCase()}に配送ポリシーを一括登録
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              4段階ワークフローを自動実行します
            </p>
          </CardContent>
        </Card>
      )}

      {/* エラーログ */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">エラーログ ({errors.length}件)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="text-xs font-mono text-red-600 p-2 bg-red-50 rounded">
                  {error}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 完了メッセージ */}
      {!uploading && progress.total > 0 && workflowStatus.stage4 === 'completed' && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="font-bold mb-2">✅ アップロード完了</div>
            <div>
              成功: {progress.success}件 / スキップ: {progress.skipped}件 / 
              失敗: {progress.failed}件 / 合計: {progress.total}件
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
