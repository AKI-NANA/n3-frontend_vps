// app/tools/research-hub/components/tool-panel.tsx
'use client'

import { useState } from 'react'
import {
  Zap, RefreshCw, Search, ShoppingCart, TrendingUp, Target,
  BarChart3, CheckCircle, Save, Trash2, Download, ChevronDown, Loader2,
  List, LayoutGrid, WrapText, Package
} from 'lucide-react'

const TOOLTIPS = {
  runAll: '全処理を一括実行（分析→スコアリング→完了）',
  reload: '最新データを再読み込み',
  ebaySearch: 'eBay Sold商品検索',
  amazonSearch: 'Amazon商品検索',
  batchSearch: 'バッチ検索実行',
  karitori: '刈り取り価格監視',
  supplier: '仕入先探索',
  analytics: '分析ダッシュボード',
  approve: '承認してeditingに移動',
  save: '変更を保存',
  delete: '選択商品を削除',
  viewList: 'リスト表示',
  viewCard: 'カード表示',
  wrapText: 'テキスト折り返し'
}

interface ToolPanelProps {
  modifiedCount: number
  readyCount: number
  processing: boolean
  currentStep: string
  selectedCount: number
  onRunAll: () => void
  onApprove: () => void
  onSave: () => void
  onDelete: () => void
  onRefresh: () => void
  viewMode: "list" | "card"
  onViewModeChange: (mode: "list" | "card") => void
  wrapText: boolean
  onWrapTextChange: (wrap: boolean) => void
}

const IconBtn = ({
  icon: Icon,
  label,
  tooltip,
  onClick,
  disabled,
  badge,
  variant = "ghost"
}: {
  icon: any
  label: string
  tooltip?: string
  onClick: () => void
  disabled?: boolean
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
      color: variant === "ghost" ? 'var(--text-muted)' : undefined
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
  const {
    processing, currentStep, modifiedCount, readyCount, selectedCount,
    onRunAll, onApprove, onSave, onDelete, onRefresh,
    viewMode, onViewModeChange, wrapText, onWrapTextChange
  } = props

  return (
    <div className="space-y-2 mb-2">
      {/* Main Toolbar */}
      <div className="n3-toolbar flex-wrap">
        {/* Quick Actions */}
        <IconBtn 
          icon={processing ? Loader2 : Zap} 
          label="Run All" 
          tooltip={TOOLTIPS.runAll} 
          onClick={onRunAll} 
          disabled={processing} 
          variant="primary" 
        />
        <IconBtn 
          icon={RefreshCw} 
          label="Reload" 
          tooltip={TOOLTIPS.reload} 
          onClick={onRefresh} 
          disabled={processing} 
        />

        <div className="n3-toolbar-divider" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* View Controls */}
        <div className="n3-view-switch mr-2">
          <button
            className={`n3-view-switch-item ${viewMode === "list" ? "active" : ""}`}
            onClick={() => onViewModeChange("list")}
            title={TOOLTIPS.viewList}
          >
            <List size={12} /> List
          </button>
          <button
            className={`n3-view-switch-item ${viewMode === "card" ? "active" : ""}`}
            onClick={() => onViewModeChange("card")}
            title={TOOLTIPS.viewCard}
          >
            <LayoutGrid size={12} /> Card
          </button>
        </div>

        <button
          onClick={() => onWrapTextChange(!wrapText)}
          className={`n3-btn n3-btn-ghost n3-btn-icon ${wrapText ? "bg-[var(--highlight)]" : ""}`}
          title={TOOLTIPS.wrapText}
        >
          <WrapText size={14} style={{ color: wrapText ? 'var(--accent)' : 'var(--text-muted)' }} />
        </button>

        <div className="n3-toolbar-divider" />

        {/* Actions */}
        <button
          onClick={onApprove}
          disabled={processing || selectedCount === 0}
          className="n3-btn n3-btn-primary"
          title={TOOLTIPS.approve}
        >
          <CheckCircle size={12} />
          Approve {selectedCount > 0 && <span className="ml-1 opacity-80">({selectedCount})</span>}
        </button>

        <button
          onClick={onSave}
          disabled={processing || modifiedCount === 0}
          className="n3-btn n3-btn-secondary"
          title={TOOLTIPS.save}
        >
          <Save size={12} />
          Save {modifiedCount > 0 && <span className="ml-1 opacity-80">({modifiedCount})</span>}
        </button>

        <IconBtn 
          icon={Trash2} 
          label="" 
          tooltip={TOOLTIPS.delete} 
          onClick={onDelete} 
          disabled={processing || selectedCount === 0} 
          variant="danger" 
        />
      </div>

      {/* Processing Indicator */}
      {processing && currentStep && (
        <div className="n3-flow-panel">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--accent)' }}>
            <Loader2 size={12} className="animate-spin" />
            <span>{currentStep}</span>
          </div>
        </div>
      )}
    </div>
  )
}
