'use client'

import { useState } from 'react'
import { Zap, Settings, BarChart3, Grid3x3, Calculator, FileSpreadsheet, Upload, Eye, Play, DollarSign, Database, Globe } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EbayStylePolicyCreator } from '@/components/shipping-policy/ebay-style-policy-creator'
import { AutoPolicyGenerator } from '@/components/shipping-policy/auto-policy-generator'
import { PolicyMatrixViewer } from '@/components/shipping-policy/policy-matrix-viewer'
import { RateTableMatrix60 } from '@/components/shipping-policy/rate-table-matrix60'
import { ShippingPolicyDistribution } from '@/components/shipping-policy/shipping-policy-distribution'
import { DDPCostMatrix } from '@/components/shipping-policy/ddp-cost-matrix'
import { EbayPolicyUploader } from '@/components/shipping-policy/ebay-policy-uploader'
import { PolicyPreview } from '@/components/shipping-policy/policy-preview'
import { PolicyTestUploader } from '@/components/shipping-policy/policy-test-uploader'
import { EbayPolicyList } from '@/components/shipping-policy/ebay-policy-list'
import { UsaDdpCostTable } from '@/components/shipping-policy/usa-ddp-cost-table'
import { RateTableViewer } from '@/components/shipping-policy/rate-table-viewer'
import { UsaDdpPolicyCreator } from '@/components/shipping-policy/usa-ddp-policy-creator'
import { ExcludedCountriesManager } from '@/components/shipping-policy/excluded-countries-manager'
import { ShippingPolicyTable } from '@/components/shipping-policy/shipping-policy-table'
import { BulkPolicyUploader } from '@/components/shipping-policy/bulk-policy-uploader'
// import { RateTableIdFetcher } from '@/components/shipping-policy/rate-table-id-fetcher' // 廃止: PartialBulkUploaderに統合済み
import { PartialBulkUploader } from '@/components/shipping-policy/partial-bulk-uploader'
import { AdvancedBulkPolicyUploader } from '@/components/shipping-policy/advanced-bulk-policy-uploader'
import { CompleteBulkUploader } from '@/components/shipping-policy/complete-bulk-uploader'
import { PolicyIdSyncButton } from '@/components/shipping-policy/policy-id-sync-button'
import { AllPoliciesSyncButton } from '@/components/shipping-policy/all-policies-sync-button'

export default function ShippingPolicyManagerPage() {
  const [activeTab, setActiveTab] = useState<'usa-cost' | 'usa-ddp-creator' | 'rate-tables' | 'excluded-countries' | 'test' | 'preview' | 'uploader' | 'bulk-advanced' | 'ddp-matrix' | 'distribution' | 'manual' | 'auto' | 'matrix' | 'full-matrix'>('usa-cost')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">配送ポリシー管理</h1>
          <p className="text-gray-600">eBay配送ポリシーの作成・管理・分析</p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as any)} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-14 max-w-full mb-6">
            <TabsTrigger value="usa-cost" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              USA料金表
            </TabsTrigger>
            <TabsTrigger value="usa-ddp-creator" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              DDP作成
            </TabsTrigger>
            <TabsTrigger value="rate-tables" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Rate Tables
            </TabsTrigger>
            <TabsTrigger value="excluded-countries" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              除外国
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              ポリシー一覧
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              プレビュー
            </TabsTrigger>
            <TabsTrigger value="uploader" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              アップロード
            </TabsTrigger>
            <TabsTrigger value="bulk-advanced" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              一括登録Pro
            </TabsTrigger>
            <TabsTrigger value="ddp-matrix" className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              DDPマトリックス
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              分布計画
            </TabsTrigger>
            <TabsTrigger value="full-matrix" className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              60重量帯
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              手動作成
            </TabsTrigger>
            <TabsTrigger value="auto" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              自動生成
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              概要
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usa-cost" className="space-y-6">
            <UsaDdpCostTable />
          </TabsContent>

          <TabsContent value="usa-ddp-creator">
            <UsaDdpPolicyCreator />
          </TabsContent>

          <TabsContent value="rate-tables">
            <RateTableViewer />
          </TabsContent>

          <TabsContent value="excluded-countries">
            <ExcludedCountriesManager />
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <ShippingPolicyTable />
            <EbayPolicyList />
            <PolicyTestUploader />
          </TabsContent>

          <TabsContent value="preview">
            <PolicyPreview />
          </TabsContent>

          <TabsContent value="uploader">
            {/* <RateTableIdFetcher /> */}
            <PartialBulkUploader />
            
            {/* Policy ID同期セクション */}
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Database className="w-5 h-5" />
                🔄 全ポリシーID 同期
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                アップロード完了後、eBayに登録されたShipping・Payment・Return PolicyのIDを一括取得してデータベースに反映します
              </p>
              
              <div className="bg-white p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-sm mb-2">✨ 機能</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>🚚 Shipping Policy (配送ポリシー)</li>
                  <li>💰 Payment Policy (支払いポリシー)</li>
                  <li>🔄 Return Policy (返品ポリシー)</li>
                  <li>• policy_nameでマッチングしてebay_policy_idを更新</li>
                  <li>• RT29-60追加後も繰り返し使用可能</li>
                  <li>• 複数アカウント対応（green, mjt, mystical）</li>
                </ul>
              </div>

              <AllPoliciesSyncButton account="green" className="mb-4" />
              
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-700 mb-2 font-semibold">個別同期（Shipping Policyのみ）</p>
                <PolicyIdSyncButton account="green" size="default" className="w-full" variant="outline" />
              </div>
            </div>
            
            <div className="mt-6">
              <BulkPolicyUploader />
            </div>
            <div className="mt-6">
              <EbayPolicyUploader />
            </div>
          </TabsContent>

          <TabsContent value="bulk-advanced">
            <CompleteBulkUploader />
            <div className="mt-6">
              <AdvancedBulkPolicyUploader />
            </div>
          </TabsContent>

          <TabsContent value="ddp-matrix">
            <DDPCostMatrix />
          </TabsContent>

          <TabsContent value="distribution">
            <ShippingPolicyDistribution />
          </TabsContent>

          <TabsContent value="full-matrix">
            <RateTableMatrix60 />
          </TabsContent>

          <TabsContent value="manual">
            <EbayStylePolicyCreator />
          </TabsContent>

          <TabsContent value="auto">
            <AutoPolicyGenerator />
          </TabsContent>

          <TabsContent value="matrix">
            <PolicyMatrixViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
