// app/tools/operations/components/paste-modal.tsx
// コピー元: editing/components/paste-modal.tsx

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { Product, ProductUpdate } from '../types/product'

interface PasteModalProps {
  products: Product[]
  onClose: () => void
  onApply: (updates: { id: string; data: ProductUpdate }[]) => void
  onShowToast?: (message: string, type: 'success' | 'error') => void
  onReload?: () => Promise<void>
}

export function PasteModal({ products, onClose, onApply, onShowToast, onReload }: PasteModalProps) {
  const [pasteData, setPasteData] = useState('')
  const [startColumn, setStartColumn] = useState(0)
  const [isGeminiMode, setIsGeminiMode] = useState(false)
  const [preview, setPreview] = useState<string[][] | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const geminiColumns = ['sku', 'english_title', 'hts_code', 'hts_confidence', 'origin_country', 'material', 'length_cm', 'width_cm', 'height_cm', 'weight_g']
  const geminiColumnLabels = ['SKU', '英語タイトル', 'HTSコード', 'HTS信頼度', '原産国', '素材', '長さ(cm)', '幅(cm)', '高さ(cm)', '重さ(g)']

  const columnNames = isGeminiMode ? geminiColumns : [
    'item_id', 'sku', 'title', 'acquired_price_jpy', 'length_cm', 'width_cm', 'height_cm', 'weight_g',
    'condition', 'image_count', 'ddp_price_usd', 'ddu_price_usd', 'shipping_service', 'shipping_cost_usd',
    'shipping_policy', 'stock_quantity', 'category_name', 'category_number', 'handling_time'
  ]

  const columnLabels = isGeminiMode ? geminiColumnLabels : [
    'Item ID', 'SKU', '商品名', '取得価格(JPY)', '長さ(cm)', '幅(cm)', '高さ(cm)', '重さ(g)', '状態',
    '画像枚数', 'DDP価格(USD)', 'DDU価格(USD)', '配送サービス', '送料(USD)', '配送ポリシー', '在庫数',
    'カテゴリ名', 'カテゴリ番号', 'ハンドリングタイム'
  ]

  const handlePasteChange = (value: string) => {
    setPasteData(value)
    if (!value.trim()) { setPreview(null); return }
    const lines = value.trim().split('\n')
    let rows = lines.map(row => row.split('\t'))
    if (rows[0]?.[0]?.toLowerCase().includes('sku')) {
      setIsGeminiMode(true)
      setStartColumn(0)
      rows = rows.slice(1)
    }
    setPreview(rows)
  }

  const handleApply = async () => {
    if (!preview || preview.length === 0) return
    if (isGeminiMode) { await handleGeminiBatchUpdate(); return }

    const updates: { id: string; data: ProductUpdate }[] = []
    preview.forEach((row, rowIndex) => {
      if (rowIndex >= products.length) return
      const product = products[rowIndex]
      const data: ProductUpdate = {}
      row.forEach((value, colOffset) => {
        const columnIndex = startColumn + colOffset
        if (columnIndex >= columnNames.length) return
        const field = columnNames[columnIndex]
        const trimmedValue = value.trim()
        const numericFields = ['acquired_price_jpy', 'ddp_price_usd', 'ddu_price_usd', 'length_cm', 'width_cm', 'height_cm', 'weight_g', 'image_count', 'shipping_cost_usd', 'stock_quantity']
        if (numericFields.includes(field)) {
          data[field] = trimmedValue === '' ? null : parseFloat(trimmedValue)
        } else {
          data[field] = trimmedValue
        }
      })
      if (Object.keys(data).length > 0) {
        updates.push({ id: String(product.id), data })
      }
    })
    onApply(updates)
  }

  const handleGeminiBatchUpdate = async () => {
    setSaving(true)
    try {
      const jsonUpdates = convertTSVtoJSON()
      if (jsonUpdates.length === 0) { onShowToast?.('更新するデータがありません', 'error'); return }
      const response = await fetch('/api/products/batch-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: jsonUpdates })
      })
      if (!response.ok) throw new Error('一括更新APIが失敗しました')
      const result = await response.json()
      if (result.failed === 0) {
        onShowToast?.(`✅ ${result.succeeded}件を保存しました`, 'success')
      } else {
        onShowToast?.(`⚠️ ${result.succeeded}件保存、${result.failed}件失敗`, 'error')
      }
      if (onReload) await onReload()
      onClose()
    } catch (error: any) {
      onShowToast?.(error.message || '保存に失敗しました', 'error')
    } finally {
      setSaving(false)
    }
  }

  const convertTSVtoJSON = () => {
    if (!preview || preview.length === 0) return []
    const jsonArray: any[] = []
    preview.forEach((row) => {
      const obj: any = {}
      let hasData = false
      geminiColumns.forEach((columnName, colIndex) => {
        const value = row[colIndex]?.trim()
        if (value === undefined || value === '') return
        if (columnName === 'sku') { obj.sku = value; hasData = true; return }
        if (['length_cm', 'width_cm', 'height_cm', 'weight_g'].includes(columnName)) {
          const numValue = parseFloat(value)
          if (!isNaN(numValue)) { obj[columnName] = numValue; hasData = true }
        } else {
          obj[columnName] = value; hasData = true
        }
      })
      if (hasData && obj.sku) jsonArray.push(obj)
    })
    return jsonArray
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{isGeminiMode ? '🤖 Gemini出力貼り付け' : 'Excel貼り付け'}</h2>
            {isGeminiMode && <p className="text-sm text-green-600 mt-1">✅ GeminiのTSV出力を検出しました</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isGeminiMode && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">貼り付け開始列:</label>
              <select value={startColumn} onChange={(e) => setStartColumn(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {columnLabels.map((label, index) => (<option key={index} value={index}>{label}</option>))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2">データ (Excelから貼り付け):</label>
            <textarea value={pasteData} onChange={(e) => handlePasteChange(e.target.value)}
              placeholder="Excelデータをコピーして貼り付けてください"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px] resize-y font-mono text-sm" />
          </div>

          {preview && (
            <div className="bg-gray-50 rounded-md p-4 max-h-[200px] overflow-auto">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">プレビュー</h3>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    {preview[0]?.map((_, colIndex) => (
                      <th key={colIndex} className="p-2 border text-left">
                        {isGeminiMode ? geminiColumnLabels[colIndex] : (columnLabels[startColumn + colIndex] || `列${startColumn + colIndex}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {row.map((cell, cellIndex) => (<td key={cellIndex} className="p-2 border">{cell || '(空)'}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button onClick={onClose} variant="outline">キャンセル</Button>
          <Button onClick={handleApply} disabled={!preview || preview.length === 0 || saving} variant="default" className="bg-green-600 hover:bg-green-700">
            {saving ? '🔄 保存中...' : (isGeminiMode ? '💾 Supabaseに一括保存' : '貼り付け実行')}
          </Button>
        </div>
      </div>
    </div>
  )
}
