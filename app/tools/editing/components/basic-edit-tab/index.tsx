// app/tools/editing/components/BasicEditTab/index.tsx
'use client'

import { useBasicEdit } from '../../hooks/use-basic-edit'
import { ToolPanel } from '../tool-panel'
import { EditingTableWithFilter } from '../editing-table-with-filter'
import type { Product } from '../../types/product'

interface BasicEditTabProps {
  products: Product[]
  selectedIds: Set<string>
  modifiedIds: Set<string>
  onSelectChange: (ids: Set<string>) => void
  onCellChange: (id: string, updates: Partial<Product>) => void
  onProductClick: (product: Product) => void
  onProductHover?: (product: Product) => void
  onShowToast: (message: string, type?: 'success' | 'error') => void
  onLoadProducts: () => Promise<void>
  updateLocalProduct: (id: string, updates: Partial<Product>) => void
  getAllSelected: () => any[]
  clearAll: () => void
  wrapText?: boolean
  viewMode: 'list' | 'card'
  onViewModeChange: (mode: 'list' | 'card') => void
  onWrapTextChange: (wrap: boolean) => void
  processing: boolean
  currentStep: string
  total: number
  pageSize: number
  currentPage: number
  onPageSizeChange: (size: number) => void
  onPageChange: (page: number) => void
  onListFilterChange: (filter: string) => void
  useVirtualScroll?: boolean // Phase 8
  // Batch処理関数
  runBatchCategory: (ids: string[]) => Promise<any>
  runBatchShipping: (ids: string[]) => Promise<any>
  runBatchProfit: (ids: string[]) => Promise<any>
  runBatchHTMLGenerate: (ids: string[]) => Promise<any>
  runBatchSellerMirror: (ids: string[]) => Promise<any>
  runBatchScores: (products: Product[]) => Promise<any>
  runAllProcesses: (products: Product[]) => Promise<any>
  // その他のハンドラー（page.tsxから渡される）
  onPaste: () => void
  onSave: () => void
  onDelete: () => void
  onExport: () => void
  onExportEbay: () => void
  onExportYahoo: () => void
  onExportMercari: () => void
  onAIExport: () => void
  onList: () => void
  onCSVUpload: () => void
  selectedMirrorCount: number
  onPricingStrategy: () => void
  onMarketResearch: () => void
  onHTSClassification: () => void
  // ツールパネル表示制御（新規追加）
  showToolPanel?: boolean
}

export function BasicEditTab(props: BasicEditTabProps) {
  // showToolPanelのデフォルト値はtrue（後方互換性）
  const showToolPanel = props.showToolPanel ?? true

  // カスタムフックからロジックを取得
  const {
    selectedProducts,
    readyCount,
    filterPassedCount,
    handleRunAll,
    handleCategory,
    handleShipping,
    handleProfit,
    handleHTML,
    handleAIEnrich,
    handleHTSFetch,
    handleDutyRatesLookup,
    handleOriginCountryFetch,
    handleMaterialFetch,
    handleTranslate,
    handleBulkResearch,
    handleBatchFetchDetails,
    handleFilterCheck,
    handleFinalProcessChain,
    handleGenerateGeminiPrompt
  } = useBasicEdit({
    products: props.products,
    selectedIds: props.selectedIds,
    onShowToast: props.onShowToast,
    onLoadProducts: props.onLoadProducts,
    updateLocalProduct: props.updateLocalProduct,
    getAllSelected: props.getAllSelected,
    clearAll: props.clearAll,
    runBatchCategory: props.runBatchCategory,
    runBatchShipping: props.runBatchShipping,
    runBatchProfit: props.runBatchProfit,
    runBatchHTMLGenerate: props.runBatchHTMLGenerate,
    runBatchSellerMirror: props.runBatchSellerMirror,
    runBatchScores: props.runBatchScores,
    runAllProcesses: props.runAllProcesses
  })

  return (
    <div className="flex flex-col gap-2">
      {/* ToolPanel - showToolPanelがtrueの場合のみ表示 */}
      {showToolPanel && (
        <ToolPanel
          modifiedCount={props.modifiedIds.size}
          readyCount={readyCount}
          processing={props.processing}
          currentStep={props.currentStep}
          onRunAll={handleRunAll}
          onPaste={props.onPaste}
          onCategory={handleCategory}
          onShipping={handleShipping}
          onProfit={handleProfit}
          onHTML={handleHTML}
          onHTSFetch={handleHTSFetch}
          onHTSClassification={props.onHTSClassification}
          onOriginCountryFetch={handleOriginCountryFetch}
          onMaterialFetch={handleMaterialFetch}
          onDutyRatesLookup={handleDutyRatesLookup}
          onSellerMirror={async () => {
            if (props.selectedIds.size === 0) {
              props.onShowToast('商品を選択してください', 'error')
              return
            }
            
            const selectedArray = Array.from(props.selectedIds)
            props.onShowToast(`🔍 ${selectedArray.length}件のSM分析を開始します...`, 'success')
            
            try {
              const result = await props.runBatchSellerMirror(selectedArray)
              if (result.success) {
                props.onShowToast(`✅ ${result.message || `SellerMirror分析完了: ${result.updated}件`}`, 'success')
                await props.onLoadProducts()
              } else {
                props.onShowToast(`❌ ${result.error || 'SellerMirror分析に失敗しました'}`, 'error')
              }
            } catch (error: any) {
              props.onShowToast(`❌ エラー: ${error.message}`, 'error')
            }
          }}
          onScores={() => props.runBatchScores(props.products)}
          onSave={props.onSave}
          onDelete={props.onDelete}
          onExport={props.onExport}
          onExportEbay={props.onExportEbay}
          onExportYahoo={props.onExportYahoo}
          onExportMercari={props.onExportMercari}
          onAIExport={props.onAIExport}
          onList={props.onList}
          onLoadData={props.onLoadProducts}
          onCSVUpload={props.onCSVUpload}
          onBulkResearch={handleBulkResearch}
          onBatchFetchDetails={handleBatchFetchDetails}
          selectedMirrorCount={props.selectedMirrorCount}
          onAIEnrich={handleAIEnrich}
          onFilterCheck={handleFilterCheck}
          onPricingStrategy={props.onPricingStrategy}
          onMarketResearch={props.onMarketResearch}
          onTranslate={handleTranslate}
          onGenerateGeminiPrompt={handleGenerateGeminiPrompt}
          onFinalProcessChain={handleFinalProcessChain}
          viewMode={props.viewMode}
          onViewModeChange={props.onViewModeChange}
          wrapText={props.wrapText}
          onWrapTextChange={props.onWrapTextChange}
        />
      )}

      {/* データテーブル/カードビュー */}
      <EditingTableWithFilter
        products={props.products}
        selectedIds={props.selectedIds}
        modifiedIds={props.modifiedIds}
        onSelectChange={props.onSelectChange}
        onCellChange={props.onCellChange}
        onProductClick={props.onProductClick}
        onProductHover={props.onProductHover}
        wrapText={props.wrapText}
        viewMode={props.viewMode}
        onViewModeChange={props.onViewModeChange}
        onSave={props.onSave}
        onExport={props.onExport}
        onDelete={props.onDelete}
        total={props.total}
        pageSize={props.pageSize}
        currentPage={props.currentPage}
        onPageSizeChange={props.onPageSizeChange}
        onPageChange={props.onPageChange}
        onListFilterChange={props.onListFilterChange}
        useVirtualScroll={props.useVirtualScroll}
      />
    </div>
  )
}
