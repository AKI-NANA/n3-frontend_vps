// app/tools/editing/components/item-specifics-editor-modal.tsx
/**
 * Item Specifics 編集モーダル
 * 
 * 機能:
 * 1. カテゴリ別の必須/推奨項目を取得して表示
 * 2. 未入力の必須項目を赤枠で警告
 * 3. 競合から取得したデータで自動入力
 * 4. 手動編集も可能
 */
'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { 
  X, CheckCircle2, AlertCircle, Loader2, Save, 
  AlertTriangle, ChevronDown, ChevronRight, Search,
  Copy, Sparkles, RefreshCw
} from 'lucide-react'
import type { Product } from '../types/product'

interface ItemSpecific {
  name: string
  label: string
  type: 'text' | 'select' | 'number'
  required: boolean
  cardinality?: 'SINGLE' | 'MULTI'
  options?: string[]
  maxLength?: number
}

interface CompetitorDetails {
  itemId: string
  title: string
  itemSpecifics: Record<string, string>
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  categoryId?: string
  categoryName?: string
  brand?: string
  model?: string
  countryOfManufacture?: string
}

interface ItemSpecificsEditorModalProps {
  product: Product
  competitorDetails?: CompetitorDetails
  onClose: () => void
  onSave: (data: SaveData) => Promise<void>
}

interface SaveData {
  english_title: string
  item_specifics: Record<string, string>
  missing_required: string[]
}

export function ItemSpecificsEditorModal({
  product,
  competitorDetails,
  onClose,
  onSave
}: ItemSpecificsEditorModalProps) {
  // 状態
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // カテゴリ必須項目
  const [requiredFields, setRequiredFields] = useState<ItemSpecific[]>([])
  const [recommendedFields, setRecommendedFields] = useState<ItemSpecific[]>([])
  
  // 編集データ
  const [englishTitle, setEnglishTitle] = useState(
    product.english_title || product.title_en || ''
  )
  const [itemSpecifics, setItemSpecifics] = useState<Record<string, string>>({})
  
  // UI状態
  const [showRecommended, setShowRecommended] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // カテゴリ必須項目を取得
  useEffect(() => {
    loadCategorySpecifics()
  }, [product.ebay_category_id])

  // 競合データで初期化
  useEffect(() => {
    if (competitorDetails?.itemSpecifics) {
      setItemSpecifics(prev => ({
        ...competitorDetails.itemSpecifics,
        ...prev // 既存データを優先
      }))
    }
    if (competitorDetails?.title && !englishTitle) {
      // 競合タイトルを参考に（そのまま使わない）
    }
  }, [competitorDetails])

  const loadCategorySpecifics = async () => {
    if (!product.ebay_category_id) {
      setError('eBayカテゴリが設定されていません')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ebay/category-specifics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: product.ebay_category_id })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '必須項目の取得に失敗しました')
      }

      setRequiredFields(data.requiredFields || [])
      setRecommendedFields(data.recommendedFields || [])

      console.log(`✅ 必須項目: ${data.requiredFields?.length || 0}件`)
      console.log(`✅ 推奨項目: ${data.recommendedFields?.length || 0}件`)

    } catch (err: any) {
      console.error('カテゴリ必須項目取得エラー:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 値の更新
  const handleValueChange = (name: string, value: string) => {
    setItemSpecifics(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 競合の値をコピー
  const handleCopyFromCompetitor = (name: string) => {
    const value = competitorDetails?.itemSpecifics?.[name]
    if (value) {
      handleValueChange(name, value)
    }
  }

  // 未入力の必須項目
  const missingRequired = useMemo(() => {
    return requiredFields.filter(field => {
      const value = itemSpecifics[field.name]
      return !value || value.trim() === ''
    })
  }, [requiredFields, itemSpecifics])

  // 入力済みの必須項目
  const filledRequired = useMemo(() => {
    return requiredFields.filter(field => {
      const value = itemSpecifics[field.name]
      return value && value.trim() !== ''
    })
  }, [requiredFields, itemSpecifics])

  // フィルタリング
  const filteredRecommended = useMemo(() => {
    if (!searchQuery) return recommendedFields
    const q = searchQuery.toLowerCase()
    return recommendedFields.filter(f => 
      f.name.toLowerCase().includes(q) || f.label.toLowerCase().includes(q)
    )
  }, [recommendedFields, searchQuery])

  // 保存
  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      await onSave({
        english_title: englishTitle,
        item_specifics: itemSpecifics,
        missing_required: missingRequired.map(f => f.name)
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // フィールドレンダリング
  const renderField = (field: ItemSpecific, isRequired: boolean) => {
    const value = itemSpecifics[field.name] || ''
    const competitorValue = competitorDetails?.itemSpecifics?.[field.name]
    const isEmpty = !value || value.trim() === ''
    const hasSuggestion = competitorValue && competitorValue !== value

    return (
      <div 
        key={field.name}
        className={`
          p-3 rounded-lg border-2 transition-all
          ${isRequired && isEmpty 
            ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
            : value 
              ? 'border-green-300 bg-green-50 dark:bg-green-900/10' 
              : 'border-gray-200 bg-white dark:bg-gray-800'
          }
        `}
      >
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium flex items-center gap-2">
            {field.name}
            {isRequired && (
              <span className="text-xs px-1.5 py-0.5 bg-red-600 text-white rounded">必須</span>
            )}
            {isEmpty && isRequired && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            {!isEmpty && (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
          </label>
          {hasSuggestion && (
            <button
              onClick={() => handleCopyFromCompetitor(field.name)}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              title={`競合の値: ${competitorValue}`}
            >
              <Copy className="w-3 h-3" />
              競合から取得
            </button>
          )}
        </div>

        {field.type === 'select' && field.options && field.options.length > 0 ? (
          <select
            value={value}
            onChange={(e) => handleValueChange(field.name, e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-lg text-sm
              ${isRequired && isEmpty ? 'border-red-400' : 'border-gray-300'}
            `}
          >
            <option value="">-- 選択してください --</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => handleValueChange(field.name, e.target.value)}
            placeholder={hasSuggestion ? `例: ${competitorValue}` : `${field.name}を入力`}
            maxLength={field.maxLength}
            className={`
              w-full px-3 py-2 border rounded-lg text-sm
              ${isRequired && isEmpty ? 'border-red-400' : 'border-gray-300'}
            `}
          />
        )}

        {hasSuggestion && (
          <p className="text-xs text-blue-600 mt-1">
            💡 競合: {competitorValue}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Item Specifics 編集</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ステータスバー */}
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>未入力必須: <strong className="text-red-600">{missingRequired.length}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>入力済み必須: <strong className="text-green-600">{filledRequired.length}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span>推奨: <strong>{recommendedFields.length}</strong></span>
          </div>
          {competitorDetails && (
            <div className="ml-auto text-blue-600">
              📦 競合データ参照可能
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">カテゴリ必須項目を取得中...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800">エラー</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
              <Button 
                onClick={loadCategorySpecifics} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                再試行
              </Button>
            </div>
          ) : (
            <>
              {/* 英語タイトル */}
              <div className={`
                p-4 rounded-lg border-2
                ${!englishTitle ? 'border-red-400 bg-red-50' : 'border-green-300 bg-green-50'}
              `}>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  英語タイトル
                  <span className="text-xs px-1.5 py-0.5 bg-red-600 text-white rounded">必須</span>
                  {!englishTitle && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {englishTitle && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </label>
                <input
                  type="text"
                  value={englishTitle}
                  onChange={(e) => setEnglishTitle(e.target.value)}
                  placeholder="eBay用の英語タイトル（最大80文字）"
                  maxLength={80}
                  className={`
                    w-full px-3 py-2 border rounded-lg
                    ${!englishTitle ? 'border-red-400' : 'border-gray-300'}
                  `}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{englishTitle.length}/80文字</span>
                  {competitorDetails?.title && (
                    <button
                      onClick={() => setEnglishTitle(competitorDetails.title.slice(0, 80))}
                      className="text-blue-600 hover:underline"
                    >
                      競合タイトルを参考にする
                    </button>
                  )}
                </div>
              </div>

              {/* 必須項目 */}
              {requiredFields.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    必須項目 ({requiredFields.length})
                    {missingRequired.length > 0 && (
                      <span className="text-sm font-normal text-red-600">
                        ⚠️ {missingRequired.length}件が未入力
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {requiredFields.map(field => renderField(field, true))}
                  </div>
                </div>
              )}

              {/* 推奨項目（折りたたみ） */}
              {recommendedFields.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowRecommended(!showRecommended)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between hover:bg-gray-100"
                  >
                    <span className="font-medium flex items-center gap-2">
                      {showRecommended ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      推奨項目 ({recommendedFields.length})
                    </span>
                    <span className="text-xs text-gray-500">クリックで展開</span>
                  </button>
                  
                  {showRecommended && (
                    <div className="p-4 space-y-3">
                      {/* 検索 */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="項目名で検索..."
                          className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {filteredRecommended.map(field => renderField(field, false))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
          <div className="text-sm">
            {missingRequired.length > 0 ? (
              <span className="text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                必須項目が{missingRequired.length}件未入力です
              </span>
            ) : (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                全ての必須項目が入力されています
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || (!englishTitle)}
              className={missingRequired.length > 0 ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />保存中...</>
              ) : missingRequired.length > 0 ? (
                <><AlertTriangle className="w-4 h-4 mr-2" />警告付きで保存</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />保存</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
