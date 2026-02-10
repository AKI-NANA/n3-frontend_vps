'use client'

import { useState, useEffect } from 'react'
import { InventoryProduct } from '@/types/inventory'
import { Button } from '@/components/ui/button'
import {
  Download,
  X,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Globe,
  User
} from 'lucide-react'

interface EbayCSVExportModalProps {
  selectedProducts: InventoryProduct[]
  onClose: () => void
}

type ActionType = 'Add' | 'Revise' | 'Relist' | 'VerifyAdd'
type SiteType = 'US' | 'UK' | 'AU'
type AccountType = 'MJT' | 'GREEN'

export function EbayCSVExportModal({
  selectedProducts,
  onClose
}: EbayCSVExportModalProps) {
  const [action, setAction] = useState<ActionType>('Add')
  const [site, setSite] = useState<SiteType>('US')
  const [account, setAccount] = useState<AccountType>('MJT')
  const [overrideQuantity, setOverrideQuantity] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 選択商品からアカウント/サイトを自動判定
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const firstProduct = selectedProducts[0]
      const sourceData = firstProduct.source_data || {}
      
      // アカウント判定
      const detectedAccount = sourceData.ebay_account?.toUpperCase() || 
                             firstProduct.account?.toUpperCase()
      if (detectedAccount === 'MJT' || detectedAccount === 'GREEN') {
        setAccount(detectedAccount)
      }
      
      // サイト判定
      const detectedSite = sourceData.site || firstProduct.ebay_data?.site
      if (detectedSite === 'US' || detectedSite === 'UK' || detectedSite === 'AU') {
        setSite(detectedSite)
      }
      
      // 既存ItemIDがあればReviseを推奨
      const hasItemId = selectedProducts.some(p => 
        p.source_data?.ebay_item_id || p.ebay_data?.item_id
      )
      if (hasItemId) {
        setAction('Revise')
      }
    }
  }, [selectedProducts])

  const handleExport = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const productIds = selectedProducts.map(p => p.id)
      
      const options: any = {}
      if (overrideQuantity && !isNaN(Number(overrideQuantity))) {
        options.overrideQuantity = Number(overrideQuantity)
      }

      const response = await fetch('/api/export/ebay-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds,
          account,
          action,
          site,
          options
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'エクスポートに失敗しました')
      }

      // CSVファイルをダウンロード
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Content-Dispositionからファイル名を取得
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `ebay_export_${new Date().toISOString().slice(0, 10)}.csv`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/)
        if (match) filename = match[1]
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (err: any) {
      console.error('エクスポートエラー:', err)
      setError(err.message || 'エクスポートに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 既存ItemIDを持つ商品数をカウント
  const itemsWithId = selectedProducts.filter(p => 
    p.source_data?.ebay_item_id || p.ebay_data?.item_id
  ).length

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            eBay CSV エクスポート
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* 選択件数 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">
                  {selectedProducts.length}件の商品を出力
                </p>
                {itemsWithId > 0 && (
                  <p className="text-sm text-blue-600">
                    うち{itemsWithId}件は既存eBay出品（ItemID保有）
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* アクション選択 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Settings className="h-4 w-4 inline mr-1" />
              アクション
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'Add', label: '新規出品', desc: '新しく出品する' },
                { value: 'Revise', label: '既存更新', desc: '既存出品を更新' },
                { value: 'Relist', label: '再出品', desc: '終了後に再出品' },
                { value: 'VerifyAdd', label: '検証のみ', desc: 'エラーチェック' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAction(opt.value as ActionType)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    action === opt.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* サイト選択 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Globe className="h-4 w-4 inline mr-1" />
              eBayサイト
            </label>
            <div className="flex gap-2">
              {[
                { value: 'US', label: 'US (アメリカ)', flag: '🇺🇸' },
                { value: 'UK', label: 'UK (イギリス)', flag: '🇬🇧' },
                { value: 'AU', label: 'AU (オーストラリア)', flag: '🇦🇺' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSite(opt.value as SiteType)}
                  className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                    site === opt.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{opt.flag}</span>
                  <p className="text-sm font-medium mt-1">{opt.value}</p>
                </button>
              ))}
            </div>
          </div>

          {/* アカウント選択 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              eBayアカウント
            </label>
            <div className="flex gap-2">
              {[
                { value: 'MJT', color: 'blue' },
                { value: 'GREEN', color: 'green' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAccount(opt.value as AccountType)}
                  className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                    account === opt.value
                      ? opt.color === 'blue' 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className={`font-bold ${
                    opt.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {opt.value}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 在庫数上書き（オプション） */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              在庫数上書き（オプション）
            </label>
            <input
              type="number"
              min="0"
              value={overrideQuantity}
              onChange={(e) => setOverrideQuantity(e.target.value)}
              placeholder="空欄の場合は商品ごとの在庫数を使用"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 mt-1">
              全商品の在庫数を統一したい場合に入力
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* 成功表示 */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700 text-sm">CSVファイルをダウンロードしました</p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleExport}
            disabled={loading || selectedProducts.length === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                エクスポート中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                CSVをダウンロード
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
