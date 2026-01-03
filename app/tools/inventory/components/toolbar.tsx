"use client"

import { 
  List, 
  LayoutGrid, 
  AlignLeft, 
  WrapText, 
  Filter, 
  Download, 
  Upload, 
  ChevronDown, 
  RefreshCw,
  Columns,
  SlidersHorizontal,
  MoreHorizontal
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface ToolbarProps {
  viewMode: "list" | "card"
  setViewMode: (mode: "list" | "card") => void
  density: "compact" | "comfortable"
  setDensity: (density: "compact" | "comfortable") => void
  wrapText: boolean
  setWrapText: (wrap: boolean) => void
  selectedCount: number
  onRefresh: () => void
  processing: boolean
  onExport: () => void
  onCSVUpload: () => void
}

export function Toolbar({
  viewMode,
  setViewMode,
  density,
  setDensity,
  wrapText,
  setWrapText,
  selectedCount,
  onRefresh,
  processing,
  onExport,
  onCSVUpload,
}: ToolbarProps) {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showExportMenu])

  return (
    <div className="n3-toolbar">
      {/* View Mode Toggle */}
      <div className="n3-toggle">
        <button
          onClick={() => setViewMode("list")}
          className={`n3-toggle-item flex items-center gap-1.5 ${viewMode === "list" ? "active" : ""}`}
        >
          <List size={14} />
          <span>List</span>
        </button>
        <button
          onClick={() => setViewMode("card")}
          className={`n3-toggle-item flex items-center gap-1.5 ${viewMode === "card" ? "active" : ""}`}
        >
          <LayoutGrid size={14} />
          <span>Card</span>
        </button>
      </div>

      <div className="n3-toolbar-divider" />

      {/* List View Options */}
      {viewMode === "list" && (
        <div className="n3-toolbar-group">
          <button
            onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}
            className={`n3-btn n3-btn-sm ${density === "compact" ? "n3-btn-secondary" : "n3-btn-ghost"}`}
            title={density === "compact" ? "Compact Mode" : "Comfortable Mode"}
          >
            <AlignLeft size={14} />
            <span className="hidden sm:inline">{density === "compact" ? "Compact" : "Comfy"}</span>
          </button>

          <button
            onClick={() => setWrapText(!wrapText)}
            className={`n3-btn n3-btn-sm ${wrapText ? "n3-btn-primary" : "n3-btn-ghost"}`}
            title="Wrap Text"
          >
            <WrapText size={14} />
            <span className="hidden sm:inline">Wrap</span>
          </button>

          <button className="n3-btn n3-btn-sm n3-btn-ghost" title="Column Settings">
            <Columns size={14} />
          </button>
        </div>
      )}

      {/* Selection Info */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 n3-animate-scale-in">
          <span className="n3-badge n3-badge-primary">
            {selectedCount} selected
          </span>
          <button className="text-xs text-blue-600 hover:underline">
            Bulk Actions
          </button>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={onRefresh}
          disabled={processing}
          className="n3-btn n3-btn-sm n3-btn-secondary"
        >
          <RefreshCw size={14} className={processing ? "n3-animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button className="n3-btn n3-btn-sm n3-btn-ghost">
          <Filter size={14} />
          <span className="hidden sm:inline">Filter</span>
        </button>

        {/* Export Dropdown */}
        <div className="n3-dropdown" ref={exportRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="n3-btn n3-btn-sm n3-btn-secondary"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown size={12} />
          </button>
          <div className={`n3-dropdown-menu ${showExportMenu ? "open" : ""}`}>
            <button className="n3-dropdown-item" onClick={() => { onExport(); setShowExportMenu(false) }}>
              <Download size={14} />
              Export All (CSV)
            </button>
            <button className="n3-dropdown-item" onClick={() => setShowExportMenu(false)}>
              <Download size={14} />
              Export eBay Format
            </button>
            <div className="n3-dropdown-divider" />
            <button className="n3-dropdown-item" onClick={() => setShowExportMenu(false)}>
              <Download size={14} />
              🤖 AI Analysis Format
            </button>
          </div>
        </div>

        <button
          onClick={onCSVUpload}
          disabled={processing}
          className="n3-btn n3-btn-sm n3-btn-secondary"
        >
          <Upload size={14} />
          <span className="hidden sm:inline">Import</span>
        </button>

        <button className="n3-btn n3-btn-sm n3-btn-ghost n3-btn-icon">
          <SlidersHorizontal size={14} />
        </button>
      </div>
    </div>
  )
}
