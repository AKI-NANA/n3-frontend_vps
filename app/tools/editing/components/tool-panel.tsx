// app/tools/editing/components/tool-panel.tsx
// V8 - n3-btnベースに統一 + CSS変数で完全制御

'use client'

import { useState, memo } from 'react'
import {
  Zap, Copy, RefreshCw, Upload, FolderOpen, Truck, Calculator, Code,
  BarChart3, Shield, Search, Filter, Sparkles, Globe, Package, FileText,
  DollarSign, CheckCircle, Save, Trash2, Download, ChevronDown, Loader2,
  List, LayoutGrid, WrapText, AlignJustify, HelpCircle
} from 'lucide-react'
import { getButtonStatus } from '../config/button-status'

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
  hints: 'ツールチップのオン/オフ',
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

// ============================================================
// Icon Button - n3-btnベースに統一
// ============================================================
const IconBtn = memo(function IconBtn({
  icon: Icon,
  label,
  tooltip,
  onClick,
  disabled,
  active,
  badge,
  variant = "ghost",
  statusKey
}: {
  icon: any
  label: string
  tooltip?: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
  badge?: number
  variant?: "ghost" | "primary" | "danger" | "success" | "warning"
  statusKey?: string
}) {
  const buttonStatus = statusKey ? getButtonStatus(statusKey) : null
  
  // n3-btnクラスを組み立て
  const btnClasses = [
    'n3-btn',
    'n3-btn-sm', // 統一サイズ: 28px
    variant === 'primary' ? 'n3-btn-primary' :
    variant === 'danger' ? 'n3-btn-soft-danger' :
    variant === 'success' ? 'n3-btn-soft-success' :
    variant === 'warning' ? 'n3-btn-soft-warning' :
    active ? 'n3-btn-soft-primary' : 'n3-btn-ghost',
  ].join(' ')

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={btnClasses}
      style={buttonStatus ? {
        borderColor: buttonStatus.borderColor,
      } : undefined}
      title={buttonStatus?.tooltip || tooltip || label}
    >
      <Icon size={14} />
      {label && <span className="hidden sm:inline">{label}</span>}
      {badge !== undefined && badge > 0 && (
        <span className="n3-btn-badge">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
});

// ============================================================
// Flow Step Button - n3-flow-stepベース
// ============================================================
const FlowStepBtn = memo(function FlowStepBtn({
  num,
  icon: Icon,
  label,
  tooltip,
  onClick,
  disabled,
  badge,
  statusKey
}: {
  num: number
  icon: any
  label: string
  tooltip?: string
  onClick: () => void
  disabled?: boolean
  badge?: number
  statusKey?: string
}) {
  const buttonStatus = statusKey ? getButtonStatus(statusKey) : null

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="n3-flow-step"
      style={buttonStatus ? {
        borderColor: buttonStatus.borderColor,
      } : undefined}
      title={buttonStatus?.tooltip || tooltip || label}
    >
      <span className="n3-flow-step-num">{num}</span>
      <Icon size={12} />
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="n3-flow-step-badge">{badge}</span>
      )}
    </button>
  );
});

// ============================================================
// Main ToolPanel
// ============================================================
export const ToolPanel = memo(function ToolPanel(props: ToolPanelProps) {
  const [showExportMenu, setShowExportMenu] = useState(false)

  const {
    processing, currentStep, modifiedCount, readyCount, selectedMirrorCount,
    onRunAll, onPaste, onLoadData, onCSVUpload,
    onCategory, onShipping, onProfit, onHTML, onScores,
    onHTSFetch, onOriginCountryFetch, onMaterialFetch,
    onFilterCheck, onBulkResearch, onAIEnrich,
    onSellerMirror, onBatchFetchDetails, onTranslate, onGenerateGeminiPrompt, onFinalProcessChain,
    onSave, onDelete, onExport, onExportEbay, onAIExport, onList
  } = props

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {/* Main Toolbar */}
      <div className="n3-toolbar flex-wrap">
        {/* Tools Label */}
        <span className="text-[10px] font-semibold text-gray-400 mr-1">Tools</span>
        
        {/* Quick Actions */}
        <IconBtn 
          icon={processing ? Loader2 : Zap} 
          label="Run All" 
          tooltip={TOOLTIPS.runAll} 
          onClick={onRunAll} 
          disabled={processing} 
          variant="primary"
          statusKey="runAll"
        />
        <IconBtn 
          icon={Copy} 
          label="Paste" 
          tooltip={TOOLTIPS.paste} 
          onClick={onPaste} 
          disabled={processing}
          statusKey="paste"
        />
        <IconBtn 
          icon={RefreshCw} 
          label="Reload" 
          tooltip={TOOLTIPS.reload} 
          onClick={onLoadData} 
          disabled={processing}
          statusKey="reload"
        />
        <IconBtn 
          icon={Upload} 
          label="CSV" 
          tooltip={TOOLTIPS.csv} 
          onClick={onCSVUpload} 
          disabled={processing}
          statusKey="csv"
        />

        <div className="n3-toolbar-divider" />

        {/* Processing */}
        <IconBtn 
          icon={FolderOpen} 
          label="Cat" 
          tooltip={TOOLTIPS.category} 
          onClick={onCategory} 
          disabled={processing}
          statusKey="category"
        />
        <IconBtn 
          icon={Truck} 
          label="Ship" 
          tooltip={TOOLTIPS.shipping} 
          onClick={onShipping} 
          disabled={processing}
          statusKey="shipping"
        />
        <IconBtn 
          icon={Calculator} 
          label="Profit" 
          tooltip={TOOLTIPS.profit} 
          onClick={onProfit} 
          disabled={processing}
          statusKey="profit"
        />
        <IconBtn 
          icon={Code} 
          label="HTML" 
          tooltip={TOOLTIPS.html} 
          onClick={onHTML} 
          disabled={processing}
          statusKey="html"
        />
        <IconBtn 
          icon={BarChart3} 
          label="Score" 
          tooltip={TOOLTIPS.score} 
          onClick={onScores} 
          disabled={processing}
          statusKey="score"
        />

        <div className="n3-toolbar-divider" />

        {/* HTS & Data */}
        {onHTSFetch && (
          <IconBtn 
            icon={Shield} 
            label="HTS" 
            tooltip={TOOLTIPS.hts} 
            onClick={onHTSFetch} 
            disabled={processing}
            statusKey="hts"
          />
        )}
        {onOriginCountryFetch && (
          <IconBtn 
            icon={Globe} 
            label="Origin" 
            tooltip={TOOLTIPS.origin} 
            onClick={onOriginCountryFetch} 
            disabled={processing}
            statusKey="origin"
          />
        )}
        {onMaterialFetch && (
          <IconBtn 
            icon={Package} 
            label="Material" 
            tooltip={TOOLTIPS.material} 
            onClick={onMaterialFetch} 
            disabled={processing}
            statusKey="material"
          />
        )}

        <div className="n3-toolbar-divider" />

        {/* Research & AI */}
        <IconBtn 
          icon={Filter} 
          label="Filter" 
          tooltip={TOOLTIPS.filter} 
          onClick={onFilterCheck} 
          disabled={processing}
          statusKey="filter"
        />
        <IconBtn 
          icon={Search} 
          label="Research" 
          tooltip={TOOLTIPS.research} 
          onClick={onBulkResearch} 
          disabled={processing}
          statusKey="research"
        />
        <IconBtn 
          icon={Sparkles} 
          label="AI" 
          tooltip={TOOLTIPS.ai} 
          onClick={onAIEnrich} 
          disabled={processing}
          statusKey="ai"
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Export Dropdown */}
        <div className="n3-dropdown">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="n3-btn n3-btn-sm n3-btn-secondary"
            title={TOOLTIPS.export}
          >
            <Download size={14} />
            <span>Export</span>
            <ChevronDown size={12} />
          </button>
          {showExportMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowExportMenu(false)} 
              />
              <div className="n3-dropdown-menu right-0">
                <button 
                  onClick={() => { onExport(); setShowExportMenu(false) }} 
                  className="n3-dropdown-item"
                >
                  CSV All
                </button>
                {onExportEbay && (
                  <button 
                    onClick={() => { onExportEbay(); setShowExportMenu(false) }} 
                    className="n3-dropdown-item"
                  >
                    eBay
                  </button>
                )}
                <div className="n3-dropdown-divider" />
                <button 
                  onClick={() => { onAIExport(); setShowExportMenu(false) }} 
                  className="n3-dropdown-item n3-dropdown-item-primary"
                >
                  <Sparkles size={12} />
                  <span>AI Export</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Save & Delete */}
        <button
          onClick={onSave}
          disabled={processing || modifiedCount === 0}
          className="n3-btn n3-btn-sm n3-btn-primary"
          title={TOOLTIPS.save}
        >
          <Save size={14} />
          <span>Save</span>
          {modifiedCount > 0 && (
            <span className="n3-btn-badge">{modifiedCount}</span>
          )}
        </button>
        <IconBtn 
          icon={Trash2} 
          label="" 
          tooltip={TOOLTIPS.delete} 
          onClick={onDelete} 
          disabled={processing} 
          variant="danger"
          statusKey="delete"
        />
      </div>

      {/* Flow Panel */}
      <div className="n3-flow-panel">
        <span className="n3-flow-label">FLOW</span>

        {onTranslate && (
          <FlowStepBtn
            num={1}
            icon={Globe}
            label="翻訳"
            tooltip={TOOLTIPS.translate}
            onClick={onTranslate}
            disabled={processing}
            statusKey="translate"
          />
        )}
        <FlowStepBtn
          num={2}
          icon={Search}
          label="SM"
          tooltip={TOOLTIPS.sellerMirror}
          onClick={onSellerMirror}
          disabled={processing}
          statusKey="sellerMirror"
        />
        <FlowStepBtn
          num={3}
          icon={Package}
          label="詳細"
          tooltip={TOOLTIPS.details}
          onClick={onBatchFetchDetails}
          disabled={processing}
          badge={selectedMirrorCount}
          statusKey="details"
        />
        {onGenerateGeminiPrompt && (
          <FlowStepBtn
            num={4}
            icon={FileText}
            label="Gemini"
            tooltip={TOOLTIPS.gemini}
            onClick={onGenerateGeminiPrompt}
            disabled={processing}
            statusKey="gemini"
          />
        )}
        {onFinalProcessChain && (
          <FlowStepBtn
            num={5}
            icon={DollarSign}
            label="処理"
            tooltip={TOOLTIPS.finalProcess}
            onClick={onFinalProcessChain}
            disabled={processing}
            statusKey="finalProcess"
          />
        )}
        <FlowStepBtn
          num={6}
          icon={CheckCircle}
          label="出品"
          tooltip={TOOLTIPS.list}
          onClick={onList}
          disabled={processing || readyCount === 0}
          badge={readyCount}
          statusKey="list"
        />

        {processing && currentStep && (
          <div className="n3-flow-status">
            <Loader2 size={12} className="animate-spin" />
            <span>{currentStep}</span>
          </div>
        )}
      </div>
    </div>
  )
});
