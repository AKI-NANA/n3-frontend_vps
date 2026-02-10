// app/tools/editing/components/tool-panel.tsx
// V6 - Minimal & Icon-focused + Full Japanese tooltips

'use client'

import { useState } from 'react'
import {
  Zap, Copy, RefreshCw, Upload, FolderOpen, Truck, Calculator, Code,
  BarChart3, Shield, Search, Filter, Sparkles, Globe, Package, FileText,
  DollarSign, CheckCircle, Save, Trash2, Download, ChevronDown, Loader2,
  List, LayoutGrid, WrapText, AlignJustify
} from 'lucide-react'

// ===== TOOLTIP TEXTS =====
const TOOLTIPS = {
  runAll: '全処理を一括実行（カテゴリ→送料→利益計算→HTML→スコア）',
  paste: 'クリップボードから商品データを貼り付け',
  reload: 'Supabaseから最新データを再読み込み',
  csv: 'CSVファイルをアップロード',
  category: 'eBayカテゴリを自動分類',
  shipping: '送料・配送方法を設定',
  profit: '利益・マージンを計算',
  html: 'eBay用HTML説明文を生成',
  score: '競合スコア・出品優先度を算出',
  hts: 'HTS関税コードを取得',
  origin: '原産国を推定',
  material: '素材情報を取得',
  filter: 'フィルター条件をチェック',
  research: '一括市場リサーチ',
  ai: 'AI強化（説明文・キーワード生成）',
  translate: '日本語↔英語翻訳',
  sellerMirror: 'eBay競合セラーの商品を検索',
  details: '選択した商品の詳細を取得',
  gemini: 'Gemini用プロンプトを生成',
  finalProcess: '最終処理チェーン実行',
  list: '準備完了商品をeBayに出品',
  save: '変更をSupabaseに保存',
  delete: '選択商品を削除',
  export: 'エクスポートメニュー',
  viewList: 'リスト表示モード',
  viewCard: 'カード表示モード',
  wrapText: 'テキスト折り返し切替',
}

interface ToolPanelProps {
  modifiedCount: number
  readyCount: number
  processing: boolean
  currentStep: string
  onRunAll: () => void
  onPaste: () => void
  onCategory: () => void
  onShipping: () => void
  onProfit: () => void
  onHTML: () => void
  onSellerMirror: () => void
  onScores: () => void
  onSave: () => void
  onDelete: () => void
  onExport: () => void
  onExportEbay?: () => void
  onExportYahoo?: () => void
  onExportMercari?: () => void
  onAIExport: () => void
  onList: () => void
  onLoadData: () => void
  onCSVUpload: () => void
  onBulkResearch: () => void
  onBatchFetchDetails: () => void
  selectedMirrorCount: number
  onAIEnrich: () => void
  onFilterCheck: () => void
  onPricingStrategy?: () => void
  onMarketResearch: () => void
  onHTSFetch?: () => void
  onHTSClassification?: () => void
  onOriginCountryFetch?: () => void
  onMaterialFetch?: () => void
  onDutyRatesLookup?: () => void
  onTranslate?: () => void
  onGenerateGeminiPrompt?: () => void
  onFinalProcessChain?: () => void
  // View controls
  viewMode?: "list" | "card"
  onViewModeChange?: (mode: "list" | "card") => void
  wrapText?: boolean
  onWrapTextChange?: (wrap: boolean) => void
}

// Icon Button component with tooltip
const IconBtn = ({
  icon: Icon,
  label,
  tooltip,
  onClick,
  disabled,
  active,
  badge,
  variant = "ghost"
}: {
  icon: any
  label: string
  tooltip?: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
  badge?: number
  variant?: "ghost" | "primary" | "danger"
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative h-7 px-2 rounded-md flex items-center gap-1.5 text-[11px] font-medium transition-all ${
      variant === "primary" ? "bg-[var(--accent)] text-white" :
      variant === "danger" ? "text-[var(--error)] hover:bg-red-50" :
      "hover:bg-[var(--highlight)]"
    }`}
    style={{
      color: variant === "ghost" ? (active ? 'var(--accent)' : 'var(--text-muted)') : undefined,
      background: active ? 'rgba(0, 112, 243, 0.08)' : undefined
    }}
    title={tooltip || label}
  >
    <Icon size={13} />
    <span className="hidden sm:inline">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center bg-[var(--warning)] text-white">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </button>
)

export function ToolPanel(props: ToolPanelProps) {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showMoreTools, setShowMoreTools] = useState(false)

  const {
    processing, currentStep, modifiedCount, readyCount, selectedMirrorCount,
    onRunAll, onPaste, onLoadData, onCSVUpload,
    onCategory, onShipping, onProfit, onHTML, onScores,
    onHTSFetch, onHTSClassification, onOriginCountryFetch, onMaterialFetch, onDutyRatesLookup,
    onFilterCheck, onBulkResearch, onMarketResearch, onAIEnrich,
    onSellerMirror, onBatchFetchDetails, onTranslate, onGenerateGeminiPrompt, onFinalProcessChain,
    onSave, onDelete, onExport, onExportEbay, onExportYahoo, onExportMercari, onAIExport, onList,
    viewMode = "list", onViewModeChange, wrapText = false, onWrapTextChange
  } = props

  return (
    <div className="space-y-2 mb-2">
      {/* Main Toolbar */}
      <div className="n3-toolbar flex-wrap">
        {/* Quick Actions */}
        <IconBtn icon={processing ? Loader2 : Zap} label="Run All" tooltip={TOOLTIPS.runAll} onClick={onRunAll} disabled={processing} variant="primary" />
        <IconBtn icon={Copy} label="Paste" tooltip={TOOLTIPS.paste} onClick={onPaste} disabled={processing} />
        <IconBtn icon={RefreshCw} label="Reload" tooltip={TOOLTIPS.reload} onClick={onLoadData} disabled={processing} />
        <IconBtn icon={Upload} label="CSV" tooltip={TOOLTIPS.csv} onClick={onCSVUpload} disabled={processing} />

        <div className="n3-toolbar-divider" />

        {/* Processing */}
        <IconBtn icon={FolderOpen} label="Cat" tooltip={TOOLTIPS.category} onClick={onCategory} disabled={processing} />
        <IconBtn icon={Truck} label="Ship" tooltip={TOOLTIPS.shipping} onClick={onShipping} disabled={processing} />
        <IconBtn icon={Calculator} label="Profit" tooltip={TOOLTIPS.profit} onClick={onProfit} disabled={processing} />
        <IconBtn icon={Code} label="HTML" tooltip={TOOLTIPS.html} onClick={onHTML} disabled={processing} />
        <IconBtn icon={BarChart3} label="Score" tooltip={TOOLTIPS.score} onClick={onScores} disabled={processing} />

        <div className="n3-toolbar-divider" />

        {/* HTS & Data */}
        {onHTSFetch && <IconBtn icon={Shield} label="HTS" tooltip={TOOLTIPS.hts} onClick={onHTSFetch} disabled={processing} />}
        {onOriginCountryFetch && <IconBtn icon={Globe} label="Origin" tooltip={TOOLTIPS.origin} onClick={onOriginCountryFetch} disabled={processing} />}
        {onMaterialFetch && <IconBtn icon={Package} label="Material" tooltip={TOOLTIPS.material} onClick={onMaterialFetch} disabled={processing} />}

        <div className="n3-toolbar-divider" />

        {/* Research & AI */}
        <IconBtn icon={Filter} label="Filter" tooltip={TOOLTIPS.filter} onClick={onFilterCheck} disabled={processing} />
        <IconBtn icon={Search} label="Research" tooltip={TOOLTIPS.research} onClick={onBulkResearch} disabled={processing} />
        <IconBtn icon={Sparkles} label="AI" tooltip={TOOLTIPS.ai} onClick={onAIEnrich} disabled={processing} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* View Controls */}
        <div className="n3-view-switch mr-2">
          <button
            className={`n3-view-switch-item ${viewMode === "list" ? "active" : ""}`}
            onClick={() => onViewModeChange?.("list")}
            title={TOOLTIPS.viewList}
          >
            <List size={12} /> List
          </button>
          <button
            className={`n3-view-switch-item ${viewMode === "card" ? "active" : ""}`}
            onClick={() => onViewModeChange?.("card")}
            title={TOOLTIPS.viewCard}
          >
            <LayoutGrid size={12} /> Card
          </button>
        </div>

        <button
          onClick={() => onWrapTextChange?.(!wrapText)}
          className={`n3-btn n3-btn-ghost n3-btn-icon ${wrapText ? "bg-[var(--highlight)]" : ""}`}
          title={TOOLTIPS.wrapText}
        >
          <WrapText size={14} style={{ color: wrapText ? 'var(--accent)' : 'var(--text-muted)' }} />
        </button>

        <div className="n3-toolbar-divider" />

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="n3-btn n3-btn-secondary"
            title={TOOLTIPS.export}
          >
            <Download size={12} /> Export <ChevronDown size={10} />
          </button>
          {showExportMenu && (
            <div 
              className="absolute right-0 top-full mt-1 py-1 rounded-lg shadow-lg z-50 min-w-[120px] animate-fade-in"
              style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}
            >
              <button onClick={() => { onExport(); setShowExportMenu(false) }} 
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-[var(--highlight)]">CSV All</button>
              {onExportEbay && <button onClick={() => { onExportEbay(); setShowExportMenu(false) }} 
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-[var(--highlight)]">eBay</button>}
              <div className="border-t my-1" style={{ borderColor: 'var(--panel-border)' }} />
              <button onClick={() => { onAIExport(); setShowExportMenu(false) }} 
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-[var(--highlight)]" style={{ color: 'var(--accent)' }}>
                <Sparkles size={10} className="inline mr-1" /> AI Export
              </button>
            </div>
          )}
        </div>

        {/* Save & Delete */}
        <button
          onClick={onSave}
          disabled={processing || modifiedCount === 0}
          className="n3-btn n3-btn-primary"
          title={TOOLTIPS.save}
        >
          <Save size={12} />
          Save {modifiedCount > 0 && <span className="ml-1 opacity-80">({modifiedCount})</span>}
        </button>
        <IconBtn icon={Trash2} label="" tooltip={TOOLTIPS.delete} onClick={onDelete} disabled={processing} variant="danger" />
      </div>

      {/* Flow Panel - Compact */}
      <div className="n3-flow-panel">
        <span className="text-[10px] font-semibold mr-2" style={{ color: 'var(--accent)' }}>FLOW</span>

        {onTranslate && (
          <button onClick={onTranslate} disabled={processing} className="n3-flow-step" title={TOOLTIPS.translate}>
            <span className="n3-flow-step-num">1</span>
            <Globe size={11} />
            <span>翻訳</span>
          </button>
        )}
        <button onClick={onSellerMirror} disabled={processing} className="n3-flow-step" title={TOOLTIPS.sellerMirror}>
          <span className="n3-flow-step-num">2</span>
          <Search size={11} />
          <span>SM</span>
        </button>
        <button onClick={onBatchFetchDetails} disabled={processing} className="n3-flow-step" title={TOOLTIPS.details}>
          <span className="n3-flow-step-num">3</span>
          <Package size={11} />
          <span>詳細</span>
          {selectedMirrorCount > 0 && <span className="n3-flow-step-badge">{selectedMirrorCount}</span>}
        </button>
        {onGenerateGeminiPrompt && (
          <button onClick={onGenerateGeminiPrompt} disabled={processing} className="n3-flow-step" title={TOOLTIPS.gemini}>
            <span className="n3-flow-step-num">4</span>
            <FileText size={11} />
            <span>Gemini</span>
          </button>
        )}
        {onFinalProcessChain && (
          <button onClick={onFinalProcessChain} disabled={processing} className="n3-flow-step" title={TOOLTIPS.finalProcess}>
            <span className="n3-flow-step-num">5</span>
            <DollarSign size={11} />
            <span>処理</span>
          </button>
        )}
        <button onClick={onList} disabled={processing || readyCount === 0} className="n3-flow-step" title={TOOLTIPS.list}>
          <span className="n3-flow-step-num">6</span>
          <CheckCircle size={11} />
          <span>出品</span>
          {readyCount > 0 && <span className="n3-flow-step-badge">{readyCount}</span>}
        </button>

        {processing && currentStep && (
          <div className="ml-auto flex items-center gap-2 text-xs" style={{ color: 'var(--accent)' }}>
            <Loader2 size={12} className="animate-spin" />
            <span>{currentStep}</span>
          </div>
        )}
      </div>
    </div>
  )
}
