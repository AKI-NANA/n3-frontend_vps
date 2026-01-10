'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2, CheckCircle, XCircle, Pause, Play, RefreshCw, AlertTriangle, Download, SkipForward } from 'lucide-react'
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
  startedAt?: string
  estimatedEndAt?: string
}

interface ExistingPolicy {
  fulfillmentPolicyId: string
  name: string
}

interface PolicyStatus {
  policy_name: string
  status: 'pending' | 'uploaded' | 'skipped' | 'failed'
  ebay_policy_id?: string
  error_message?: string
  account: string
}

export function AdvancedBulkPolicyUploader() {
  const [uploading, setUploading] = useState(false)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const abortRef = useRef(false)
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    success: 0,
    failed: 0,
    skipped: 0,
    current: 0,
    currentPolicyName: ''
  })
  const [selectedAccount, setSelectedAccount] = useState<'mjt' | 'green'>('green')
  const [errors, setErrors] = useState<string[]>([])
  const [intervalMs, setIntervalMs] = useState(1200) // デフォルト1.2秒間隔
  const [existingPolicies, setExistingPolicies] = useState<Map<string, ExistingPolicy>>(new Map())
  const [loadingExisting, setLoadingExisting] = useState(false)
  const [skipExisting, setSkipExisting] = useState(true)
  const [syncProgress, setSyncProgress] = useState<{ green: number; mjt: number }>({ green: 0, mjt: 0 })
  const [lastUploadedIndex, setLastUploadedIndex] = useState<number>(0)
  const [resumeFromLast, setResumeFromLast] = useState(false)

  // 一時停止フラグの同期
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  // 除外国リストを取得
  const loadExcludedCountries = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('excluded_countries_master')
        .select('country_code')
        .order('country_code')

      if (error) throw error
      return data.map(item => item.country_code)
    } catch (error) {
      console.error('Failed to load excluded countries:', error)
      return []
    }
  }

  // eBay既存ポリシーを取得（アカウント別）
  const fetchExistingPolicies = async (account: 'mjt' | 'green') => {
    setLoadingExisting(true)
    try {
      console.log(`📥 Fetching existing policies for ${account}...`)
      
      const response = await fetch(`/api/ebay/list-policies?account=${account}`, {
        method: 'GET',
        headers: {
          'X-eBay-Account': account
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch existing policies')
      }

      const data = await response.json()
      const policies = data.policies || []
      
      // ポリシー名でマップを作成
      const policyMap = new Map<string, ExistingPolicy>()
      policies.forEach((policy: any) => {
        policyMap.set(policy.name, {
          fulfillmentPolicyId: policy.fulfillmentPolicyId,
          name: policy.name
        })
      })

      console.log(`✅ Found ${policyMap.size} existing policies for ${account}`)
      setExistingPolicies(policyMap)
      
      return policyMap
    } catch (error: any) {
      console.error(`❌ Failed to fetch existing policies for ${account}:`, error)
      throw error
    } finally {
      setLoadingExisting(false)
    }
  }

  // 既存ポリシーIDをSupabaseに同期保存
  const syncPolicyIdsToDatabase = async (account: 'mjt' | 'green') => {
    try {
      const policyMap = await fetchExistingPolicies(account)
      const supabase = createClient()
      
      let syncedCount = 0
      const total = policyMap.size

      for (const [policyName, policyData] of policyMap.entries()) {
        // shipping_policiesテーブルにeBay IDを保存
        const { error } = await supabase
          .from('shipping_policies')
          .update({
            ebay_policy_id: policyData.fulfillmentPolicyId,
            status: 'uploaded',
            updated_at: new Date().toISOString()
          })
          .eq('policy_name', policyName)
          .eq('account', account === 'green' ? 'account2' : 'account1')

        if (!error) {
          syncedCount++
        }
        
        // 進捗更新
        setSyncProgress(prev => ({
          ...prev,
          [account]: Math.round((syncedCount / total) * 100)
        }))
      }

      console.log(`✅ Synced ${syncedCount}/${total} policy IDs to database for ${account}`)
      return syncedCount
    } catch (error: any) {
      console.error(`❌ Failed to sync policy IDs:`, error)
      throw error
    }
  }

  // メイン一括アップロード処理（1,000件制限解除版）
  const startBulkUpload = async () => {
    setUploading(true)
    setPaused(false)
    pausedRef.current = false
    abortRef.current = false
    setErrors([])

    const startTime = new Date()
    const supabase = createClient()

    try {
      // 1. 既存ポリシーを取得（スキップ判定用）
      console.log(`🔍 Fetching existing policies for ${selectedAccount}...`)
      let existingMap = new Map<string, ExistingPolicy>()
      if (skipExisting) {
        try {
          existingMap = await fetchExistingPolicies(selectedAccount)
          console.log(`✅ Found ${existingMap.size} existing policies to skip`)
        } catch (error) {
          console.warn('⚠️ Could not fetch existing policies, proceeding without skip logic')
        }
      }

      // 2. 全ポリシーをDBから取得
      let allPolicies: any[] = []
      let from = 0
      const limit = 1000

      console.log('🚀 全ポリシーを読み込み中...')

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

      console.log(`✅ ${allPolicies.length}個のポリシーを読み込みました`)

      // 3. 除外国リストを取得
      const excludedCountries = await loadExcludedCountries()
      console.log(`✅ ${excludedCountries.length}カ国の除外国を読み込みました`)

      // 4. 開始位置の決定（途中再開対応）
      const startIndex = resumeFromLast ? lastUploadedIndex : 0
      const remainingPolicies = allPolicies.slice(startIndex)

      console.log(`📍 Starting from index ${startIndex}, ${remainingPolicies.length} policies to process`)

      setProgress({
        total: allPolicies.length,
        success: 0,
        failed: 0,
        skipped: startIndex, // 以前の分をスキップとしてカウント
        current: startIndex,
        currentPolicyName: '',
        startedAt: startTime.toISOString()
      })

      let successCount = 0
      let failedCount = 0
      let skippedCount = startIndex
      const errorLog: string[] = []

      // 5. 各ポリシーをアップロード（バッチ処理）
      for (let i = 0; i < remainingPolicies.length; i++) {
        // 中断チェック
        if (abortRef.current) {
          console.log('🛑 Upload aborted by user')
          break
        }

        // 一時停止チェック
        while (pausedRef.current && !abortRef.current) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        const policy = remainingPolicies[i]
        const absoluteIndex = startIndex + i

        setProgress(prev => ({
          ...prev,
          current: absoluteIndex + 1,
          currentPolicyName: policy.policy_name
        }))

        // 既存ポリシーチェック（スキップロジック）
        if (skipExisting && existingMap.has(policy.policy_name)) {
          console.log(`⏭️ [${absoluteIndex + 1}/${allPolicies.length}] Skipping (already exists): ${policy.policy_name}`)
          skippedCount++
          
          // DBにeBay IDを保存
          const existingPolicy = existingMap.get(policy.policy_name)!
          await supabase
            .from('shipping_policies')
            .update({
              ebay_policy_id: existingPolicy.fulfillmentPolicyId,
              status: 'skipped',
              updated_at: new Date().toISOString()
            })
            .eq('id', policy.id)

          setProgress(prev => ({
            ...prev,
            skipped: skippedCount
          }))

          continue // スキップしてAPIコールしない
        }

        // API呼び出し（リトライ付き）
        let retryCount = 0
        const maxRetries = 3
        let success = false

        while (retryCount < maxRetries && !success) {
          try {
            const payload = buildPolicyPayload(policy, excludedCountries)

            console.log(`📤 [${absoluteIndex + 1}/${allPolicies.length}] Uploading: ${policy.policy_name}`)

            const response = await fetch('/api/ebay/shipping-policy', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-eBay-Account': selectedAccount
              },
              body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (response.ok) {
              successCount++
              success = true
              console.log(`✅ [${absoluteIndex + 1}/${allPolicies.length}] Success: ${policy.policy_name}`)

              // DBに成功を記録
              await supabase
                .from('shipping_policies')
                .update({
                  ebay_policy_id: data.fulfillmentPolicyId,
                  status: 'uploaded',
                  updated_at: new Date().toISOString()
                })
                .eq('id', policy.id)

              // 既存マップに追加（後続の重複チェック用）
              existingMap.set(policy.policy_name, {
                fulfillmentPolicyId: data.fulfillmentPolicyId,
                name: policy.policy_name
              })

            } else {
              // 重複エラーの場合はスキップ扱い
              if (response.status === 409 || 
                  data.error?.includes('already exists') ||
                  data.error?.includes('duplicate')) {
                console.log(`⏭️ [${absoluteIndex + 1}/${allPolicies.length}] Already exists: ${policy.policy_name}`)
                skippedCount++
                success = true
                
                await supabase
                  .from('shipping_policies')
                  .update({
                    status: 'skipped',
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', policy.id)
              } else if (response.status === 429) {
                // Rate limit - 長めに待機してリトライ
                console.log(`⏳ Rate limited, waiting 30 seconds before retry...`)
                await new Promise(resolve => setTimeout(resolve, 30000))
                retryCount++
              } else {
                throw new Error(data.error || `HTTP ${response.status}`)
              }
            }

          } catch (error: any) {
            retryCount++
            if (retryCount >= maxRetries) {
              failedCount++
              const errorMsg = `❌ ${policy.policy_name}: ${error.message}`
              errorLog.push(errorMsg)
              console.error(errorMsg)

              await supabase
                .from('shipping_policies')
                .update({
                  status: 'failed',
                  error_message: error.message,
                  updated_at: new Date().toISOString()
                })
                .eq('id', policy.id)
            } else {
              console.log(`🔄 Retry ${retryCount}/${maxRetries} for ${policy.policy_name}`)
              await new Promise(resolve => setTimeout(resolve, 5000))
            }
          }
        }

        setProgress(prev => ({
          ...prev,
          success: successCount,
          failed: failedCount,
          skipped: skippedCount
        }))

        // 進捗をローカルストレージに保存（途中再開用）
        setLastUploadedIndex(absoluteIndex + 1)

        // Rate limit対策：指定された間隔で待機
        if (i < remainingPolicies.length - 1 && success) {
          await new Promise(resolve => setTimeout(resolve, intervalMs))
        }
      }

      console.log(`🎉 アップロード完了: 成功 ${successCount}件、失敗 ${failedCount}件、スキップ ${skippedCount}件`)
      setErrors(errorLog)

    } catch (error: any) {
      console.error('❌ 一括アップロードエラー:', error)
      setErrors([error.message])
    } finally {
      setUploading(false)
    }
  }

  // ポリシーペイロード構築
  const buildPolicyPayload = (policy: any, excludedCountries: string[]) => {
    // 配送オプション構築
    const shippingOptions: any[] = [
      // USA向け（固定料金・DDP込み）
      {
        costType: 'FLAT_RATE',
        optionType: 'DOMESTIC',
        shippingServices: [
          {
            shippingCarrierCode: 'OTHER',
            shippingServiceCode: 'ExpeditedShippingFromOutsideUS',
            deliveryTimeMin: 1,
            deliveryTimeMax: 4,
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
              regionIncluded: [
                {
                  regionName: 'US',
                  regionType: 'COUNTRY'
                }
              ]
            }
          }
        ]
      }
    ]

    // 国際配送オプション（Rate Tableがある場合のみ）
    if (policy.rate_table_name) {
      shippingOptions.push({
        costType: 'CALCULATED',
        optionType: 'INTERNATIONAL',
        rateTableId: policy.rate_table_name,
        shippingServices: [
          {
            shippingCarrierCode: 'OTHER',
            shippingServiceCode: 'ExpeditedShippingFromOutsideUS',
            deliveryTimeMin: 7,
            deliveryTimeMax: 15,
            freeShipping: false,
            shipToLocations: {
              regionIncluded: [
                {
                  regionName: 'WORLDWIDE',
                  regionType: 'WORLD_REGION'
                }
              ],
              regionExcluded: [
                {
                  regionName: 'US',
                  regionType: 'COUNTRY'
                },
                ...excludedCountries.map(code => ({
                  regionName: code,
                  regionType: 'COUNTRY_CODE'
                }))
              ]
            }
          }
        ]
      })
    }

    return {
      name: policy.policy_name,
      description: policy.description || `Shipping policy ${policy.policy_name}`,
      marketplaceId: 'EBAY_US',
      categoryTypes: [
        {
          name: 'ALL_EXCLUDING_MOTORS_VEHICLES',
          default: false
        }
      ],
      handlingTime: {
        value: policy.handling_time_days || 3,
        unit: 'DAY'
      },
      shippingOptions
    }
  }

  // 中断処理
  const handleAbort = () => {
    abortRef.current = true
    setPaused(false)
    pausedRef.current = false
  }

  // 推定完了時間を計算
  const calculateEstimatedTime = () => {
    if (!progress.total || progress.current === 0) return null
    const elapsed = progress.current * intervalMs
    const remaining = (progress.total - progress.current) * intervalMs
    return Math.round(remaining / 60000) // 分単位
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          高機能一括ポリシーアップロード
        </h2>
        <p className="text-sm opacity-90">
          全1,200ポリシーをeBay APIに自動アップロード（1,000件制限解除・既存スキップ対応）
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">アップロード</TabsTrigger>
          <TabsTrigger value="sync">ID同期</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
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

          {/* 詳細設定 */}
          <Card>
            <CardHeader>
              <CardTitle>アップロード設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  推奨: 1200ms (1.2秒) = 約24分で完了
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="skipExisting"
                  checked={skipExisting}
                  onChange={(e) => setSkipExisting(e.target.checked)}
                  disabled={uploading}
                  className="w-4 h-4"
                />
                <label htmlFor="skipExisting" className="text-sm">
                  既存ポリシーをスキップ（重複登録を防止）
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="resumeFromLast"
                  checked={resumeFromLast}
                  onChange={(e) => setResumeFromLast(e.target.checked)}
                  disabled={uploading}
                  className="w-4 h-4"
                />
                <label htmlFor="resumeFromLast" className="text-sm">
                  前回の続きから再開（インデックス: {lastUploadedIndex}）
                </label>
              </div>

              {skipExisting && (
                <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                  <SkipForward className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    既存ポリシー: {existingPolicies.size}件がスキップされます
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchExistingPolicies(selectedAccount)}
                    disabled={loadingExisting}
                    className="ml-auto"
                  >
                    {loadingExisting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 進捗表示 */}
          {(uploading || progress.total > 0) && (
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
                      {Math.round((progress.current / (progress.total || 1)) * 100)}%
                    </span>
                  </div>
                  <Progress value={(progress.current / (progress.total || 1)) * 100} />
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {progress.current}
                    </div>
                    <div className="text-xs text-gray-600">処理中</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {progress.success}
                    </div>
                    <div className="text-xs text-gray-600">成功</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {progress.skipped}
                    </div>
                    <div className="text-xs text-gray-600">スキップ</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {progress.failed}
                    </div>
                    <div className="text-xs text-gray-600">失敗</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">
                    現在処理中:
                  </div>
                  <div className="text-xs font-mono text-gray-600 mt-1">
                    {progress.currentPolicyName || '-'}
                  </div>
                </div>

                {uploading && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPaused(!paused)}
                      variant="outline"
                      className="flex-1"
                    >
                      {paused ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          再開
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          一時停止
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleAbort}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      中断
                    </Button>
                  </div>
                )}

                {calculateEstimatedTime() !== null && (
                  <p className="text-xs text-gray-500 text-center">
                    推定残り時間: 約{calculateEstimatedTime()}分
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* 開始ボタン */}
          {!uploading && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={startBulkUpload}
                  size="lg"
                  className="w-full"
                  disabled={uploading}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {selectedAccount.toUpperCase()}に1,200ポリシーを一括アップロード
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  推定時間: 約{Math.round((1200 * intervalMs) / 60000)}分
                </p>
              </CardContent>
            </Card>
          )}

          {/* エラーログ */}
          {errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  エラーログ ({errors.length}件)
                </CardTitle>
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
          {!uploading && progress.total > 0 && progress.current >= progress.total && (
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
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          {/* 既存ポリシーID同期 */}
          <Card>
            <CardHeader>
              <CardTitle>eBay既存ポリシーID同期</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                eBayに既に登録されているポリシーのIDを取得し、Supabaseに保存します。
                これにより出品時に正しいポリシーIDを使用できます。
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Button
                    onClick={() => syncPolicyIdsToDatabase('green')}
                    disabled={loadingExisting}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    GREEN同期
                  </Button>
                  {syncProgress.green > 0 && (
                    <Progress value={syncProgress.green} />
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => syncPolicyIdsToDatabase('mjt')}
                    disabled={loadingExisting}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    MJT同期
                  </Button>
                  {syncProgress.mjt > 0 && (
                    <Progress value={syncProgress.mjt} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
