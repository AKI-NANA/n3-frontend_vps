'use client'

import React from 'react'
import { Calculator, RefreshCw, CheckSquare, Square, Download, Upload, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResearchToolPanelProps {
  selectedCount: number
  isCalculating: boolean
  progress: number
  onCalculateRoutes: () => void
  onRefresh: () => void
  onSelectAll: () => void
  onClearSelection: () => void
}

export function ResearchToolPanel({
  selectedCount,
  isCalculating,
  progress,
  onCalculateRoutes,
  onRefresh,
  onSelectAll,
  onClearSelection
}: ResearchToolPanelProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左側: 選択情報とアクション */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectAll}
                className="p-2 rounded hover:bg-gray-100"
                title="全て選択"
              >
                <CheckSquare className="h-4 w-4" />
              </button>
              <button
                onClick={onClearSelection}
                className="p-2 rounded hover:bg-gray-100"
                title="選択解除"
              >
                <Square className="h-4 w-4" />
              </button>
              {selectedCount > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedCount}件選択中
                </span>
              )}
            </div>

            {/* 区切り線 */}
            <div className="h-6 w-px bg-gray-200" />

            {/* 坂路計算ボタン */}
            <button
              onClick={onCalculateRoutes}
              disabled={selectedCount === 0 || isCalculating}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors',
                selectedCount > 0 && !isCalculating
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              )}
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>計算中... ({progress}%)</span>
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  <span>坂路計算</span>
                  {selectedCount > 0 && (
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                      {selectedCount}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {/* 右側: その他のアクション */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 rounded hover:bg-gray-100"
              title="更新"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-100"
              title="CSVエクスポート"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-100"
              title="CSVインポート"
            >
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 計算進捗バー */}
        {isCalculating && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
