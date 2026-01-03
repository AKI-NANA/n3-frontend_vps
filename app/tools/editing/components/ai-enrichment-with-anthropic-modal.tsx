// app/tools/editing/components/ai-enrichment-with-anthropic-modal.tsx
/**
 * AIデータ強化モーダル（Anthropic API in Artifacts対応）
 * 
 * 3つの処理方法を提供:
 * A) 手動プロンプト - Claude Webにコピペ
 * B) Gemini API - 課金して自動処理
 * C) Anthropic API - Claude Pro/Team範囲内で自動処理
 * 
 * フロー:
 * 1. 競合商品の詳細（Item Specifics）を参照データとして表示
 * 2. AI処理方法を選択
 * 3. 重量・寸法・HTSコード・原産国を推定
 * 4. 結果を検証して保存
 */
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  X, Copy, CheckCircle2, AlertCircle, Sparkles, Database, 
  RefreshCw, ExternalLink, Cpu, Bot, Clipboard, ArrowRight,
  Loader2, Zap, DollarSign, Crown
} from 'lucide-react'
import type { Product } from '../types/product'

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

interface AIEnrichmentWithAnthropicModalProps {
  product: Product
  competitorDetails?: CompetitorDetails
  onClose: () => void
  onSave: (success: boolean) => Promise<void>
}

interface AIResult {
  dimensions: {
    weight_g: number
    length_cm: number
    width_cm: number
    height_cm: number
    verification_source?: string
    confidence?: string
  }
  hts_candidates: Array<{
    code: string
    description: string
    reasoning: string
    confidence: number
  }>
  origin_country: {
    code: string
    name: string
    reasoning: string
  }
  english_title: string
  title_reasoning?: string
}

type ProcessMethod = 'manual' | 'gemini' | 'anthropic'
type Step = 'select' | 'processing' | 'paste' | 'verify' | 'complete'

export function AIEnrichmentWithAnthropicModal({
  product,
  competitorDetails,
  onClose,
  onSave
}: AIEnrichmentWithAnthropicModalProps) {
  const [step, setStep] = useState<Step>('select')
  const [method, setMethod] = useState<ProcessMethod | null>(null)
  const [prompt, setPrompt] = useState('')
  const [promptCopied, setPromptCopied] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [parsedResult, setParsedResult] = useState<AIResult | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  // プロンプト生成
  useEffect(() => {
    generatePrompt()
  }, [product, competitorDetails])

  const generatePrompt = () => {
    const competitorInfo = competitorDetails ? `
## 🔍 競合商品データ（参照用）
- **タイトル**: ${competitorDetails.title}
- **カテゴリ**: ${competitorDetails.categoryName} (ID: ${competitorDetails.categoryId})
${competitorDetails.weight ? `- **重量**: ${competitorDetails.weight}g` : ''}
${competitorDetails.dimensions ? `- **寸法**: ${competitorDetails.dimensions.length}×${competitorDetails.dimensions.width}×${competitorDetails.dimensions.height}cm` : ''}
${competitorDetails.brand ? `- **ブランド**: ${competitorDetails.brand}` : ''}
${competitorDetails.countryOfManufacture ? `- **製造国**: ${competitorDetails.countryOfManufacture}` : ''}

### Item Specifics（詳細属性）
${Object.entries(competitorDetails.itemSpecifics || {})
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}
` : ''

    const generatedPrompt = `# 商品データ強化タスク

## 📦 対象商品
- **日本語タイトル**: ${product.title}
- **価格**: ¥${product.price_jpy?.toLocaleString() || '不明'}
- **画像**: ${product.primary_image_url || '（なし）'}
- **カテゴリ**: ${product.category_name || product.scraped_data?.category || '未分類'}

${competitorInfo}

## 📋 実行タスク

### 1. 寸法データの推定
${competitorDetails?.weight 
  ? `競合商品の重量（${competitorDetails.weight}g）を参考に、この商品の正確な重量を推定してください。`
  : 'Web検索で実物の寸法を取得してください。'
}
- 重量（g）、長さ×幅×高さ（cm）

### 2. HTSコード判定
米国への輸入時に適用されるHTSコードを3つ推定してください。
${competitorDetails?.categoryName ? `eBayカテゴリ「${competitorDetails.categoryName}」を参考に。` : ''}

### 3. 原産国判定
製造国を判定してください。
${competitorDetails?.countryOfManufacture 
  ? `競合商品の製造国は「${competitorDetails.countryOfManufacture}」です。`
  : ''
}

### 4. SEO最適化英語タイトル
eBayで検索されやすい英語タイトルを生成（最大80文字）

---

## 📤 回答フォーマット（JSON）

\`\`\`json
{
  "dimensions": {
    "weight_g": 250,
    "length_cm": 20.5,
    "width_cm": 15.0,
    "height_cm": 5.0,
    "verification_source": "競合商品参照 or Web検索",
    "confidence": "high"
  },
  "hts_candidates": [
    {
      "code": "9503.00.0090",
      "description": "toys and models",
      "reasoning": "選定理由",
      "confidence": 85
    },
    {
      "code": "9504.90.0000",
      "description": "articles for games",
      "reasoning": "選定理由",
      "confidence": 70
    },
    {
      "code": "9505.90.4000",
      "description": "festive articles",
      "reasoning": "選定理由",
      "confidence": 55
    }
  ],
  "origin_country": {
    "code": "CN",
    "name": "China",
    "reasoning": "判定根拠"
  },
  "english_title": "Japanese Product Title Optimized for eBay SEO"
}
\`\`\`

**重要**: 必ず上記のJSON形式で回答してください。`

    setPrompt(generatedPrompt)
  }

  // プロンプトコピー
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2000)
    } catch (err) {
      setError('コピーに失敗しました')
    }
  }

  // 手動処理を選択
  const handleSelectManual = () => {
    setMethod('manual')
    setStep('paste')
  }

  // Gemini API処理
  const handleSelectGemini = async () => {
    setMethod('gemini')
    setStep('processing')
    setProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/gemini/enrich-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          prompt,
          competitorDetails
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Gemini API エラー')
      }

      setParsedResult(data.result)
      setStep('verify')
      handleVerify(data.result)

    } catch (err: any) {
      setError(err.message)
      setStep('select')
    } finally {
      setProcessing(false)
    }
  }

  // Anthropic API処理（Claude Pro/Team範囲内）
  const handleSelectAnthropic = async () => {
    setMethod('anthropic')
    setStep('processing')
    setProcessing(true)
    setError(null)

    try {
      // Anthropic API を直接呼び出し（Artifacts内では課金なし）
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: APIキーは自動で処理される（Artifacts内）
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt + '\n\n必ずJSON形式のみで回答してください。説明文は不要です。'
            }
          ]
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Anthropic API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const text = data.content?.[0]?.text || ''

      // JSONを抽出
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('JSON形式の回答が得られませんでした')
      }

      const jsonText = jsonMatch[1] || jsonMatch[0]
      const result: AIResult = JSON.parse(jsonText.replace(/```/g, '').trim())

      setParsedResult(result)
      setStep('verify')
      handleVerify(result)

    } catch (err: any) {
      console.error('Anthropic API Error:', err)
      setError(err.message)
      setStep('select')
    } finally {
      setProcessing(false)
    }
  }

  // JSONペースト処理（手動用）
  const handlePasteJSON = () => {
    try {
      setError(null)
      
      let jsonText = jsonInput.trim()
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```json?\s*\n/, '').replace(/\n```\s*$/, '')
      }
      
      const parsed: AIResult = JSON.parse(jsonText)

      if (!parsed.dimensions || !parsed.hts_candidates || !parsed.origin_country || !parsed.english_title) {
        throw new Error('必須フィールドが不足しています')
      }

      setParsedResult(parsed)
      setStep('verify')
      handleVerify(parsed)

    } catch (err: any) {
      setError('JSON形式が正しくありません: ' + err.message)
    }
  }

  // 検証＆保存
  const handleVerify = async (result: AIResult) => {
    setProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai-enrichment/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ...result
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '保存に失敗しました')
      }

      setVerificationResult(data)
      setStep('complete')
      await onSave(true)

    } catch (err: any) {
      setError(err.message)
      setStep('verify')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h2 className="text-lg font-semibold text-white">AIデータ強化</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 商品＆競合情報 */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b">
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">対象商品</p>
              <p className="text-sm font-medium truncate">{product.title}</p>
            </div>
            {competitorDetails && (
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">参照競合</p>
                <p className="text-sm font-medium truncate text-blue-600">
                  {competitorDetails.title?.slice(0, 40)}...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* プログレスバー */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 text-xs">
          <div className={`flex items-center gap-1 ${step === 'select' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
            1. 方法選択
          </div>
          <div className={`flex items-center gap-1 ${step === 'processing' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
            2. AI処理
          </div>
          <div className={`flex items-center gap-1 ${step === 'paste' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
            3. 結果入力
          </div>
          <div className={`flex items-center gap-1 ${step === 'verify' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
            4. 検証
          </div>
          <div className={`flex items-center gap-1 ${step === 'complete' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
            5. 完了
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">エラー</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* ステップ1: 処理方法選択 */}
          {step === 'select' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">AI処理方法を選択</h3>

              {/* 競合参照情報 */}
              {competitorDetails && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 mb-6">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    参照データ（競合商品から取得済み）
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {competitorDetails.weight && (
                      <div>重量: <strong>{competitorDetails.weight}g</strong></div>
                    )}
                    {competitorDetails.dimensions && (
                      <div>寸法: <strong>{competitorDetails.dimensions.length}×{competitorDetails.dimensions.width}×{competitorDetails.dimensions.height}cm</strong></div>
                    )}
                    {competitorDetails.brand && (
                      <div>ブランド: <strong>{competitorDetails.brand}</strong></div>
                    )}
                    {competitorDetails.countryOfManufacture && (
                      <div>製造国: <strong>{competitorDetails.countryOfManufacture}</strong></div>
                    )}
                  </div>
                  {Object.keys(competitorDetails.itemSpecifics || {}).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer">
                        Item Specifics ({Object.keys(competitorDetails.itemSpecifics).length}件)
                      </summary>
                      <div className="mt-2 text-xs space-y-1 max-h-32 overflow-y-auto">
                        {Object.entries(competitorDetails.itemSpecifics).map(([k, v]) => (
                          <div key={k}><strong>{k}:</strong> {v}</div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}

              {/* 処理方法カード */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Anthropic API（推奨） */}
                <div
                  onClick={handleSelectAnthropic}
                  className="border-2 border-purple-300 hover:border-purple-500 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg bg-purple-50 dark:bg-purple-900/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-700">Anthropic API</span>
                    <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded-full">推奨</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Claude Pro/Team契約範囲内で自動処理。追加課金なし。
                  </p>
                  <div className="flex items-center gap-2 text-xs text-purple-600">
                    <Zap className="w-4 h-4" />
                    <span>自動・高速・無料</span>
                  </div>
                </div>

                {/* Gemini API */}
                <div
                  onClick={handleSelectGemini}
                  className="border-2 border-gray-200 hover:border-blue-400 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Gemini API</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Google Gemini APIで自動処理。従量課金。
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span>自動・有料</span>
                  </div>
                </div>

                {/* 手動 */}
                <div
                  onClick={handleSelectManual}
                  className="border-2 border-gray-200 hover:border-gray-400 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clipboard className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold">手動コピペ</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Claude/Gemini Webにプロンプトをコピペ。完全無料。
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Copy className="w-4 h-4" />
                    <span>手動・無料</span>
                  </div>
                </div>
              </div>

              {/* プロンプトプレビュー */}
              <details className="mt-4">
                <summary className="text-sm text-gray-600 cursor-pointer">
                  生成されるプロンプトを確認
                </summary>
                <div className="mt-2">
                  <textarea
                    readOnly
                    value={prompt}
                    className="w-full h-48 p-3 border rounded-lg font-mono text-xs bg-gray-50"
                  />
                </div>
              </details>
            </div>
          )}

          {/* ステップ2: 処理中 */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
              <p className="text-lg font-semibold mb-2">
                {method === 'anthropic' ? 'Claude AI' : 'Gemini AI'} で処理中...
              </p>
              <p className="text-sm text-gray-600">
                重量・寸法・HTSコード・原産国を推定しています
              </p>
            </div>
          )}

          {/* ステップ3: 手動入力（手動モード用） */}
          {step === 'paste' && method === 'manual' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold mb-2">🚀 3ステップで完了</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <div>
                      <p>下のプロンプトをコピー</p>
                      <Button onClick={handleCopyPrompt} size="sm" className="mt-1">
                        {promptCopied ? <><CheckCircle2 className="w-4 h-4 mr-1" />コピー済み</> : <><Copy className="w-4 h-4 mr-1" />コピー</>}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <div>
                      <p>AIに貼り付けて実行</p>
                      <div className="flex gap-2 mt-1">
                        <Button onClick={() => window.open('https://claude.ai', '_blank')} variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />Claude
                        </Button>
                        <Button onClick={() => window.open('https://gemini.google.com', '_blank')} variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />Gemini
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <p>AIの回答（JSON）を下に貼り付け</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">プロンプト</label>
                <textarea
                  readOnly
                  value={prompt}
                  className="w-full h-48 p-3 border rounded-lg font-mono text-xs bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">AIの回答（JSON）</label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="AIの回答をここに貼り付け..."
                  className="w-full h-40 p-3 border-2 border-blue-300 rounded-lg font-mono text-xs focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep('select')} variant="outline">← 戻る</Button>
                <Button onClick={handlePasteJSON} className="flex-1 bg-green-600 hover:bg-green-700" disabled={!jsonInput}>
                  保存 <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ステップ4: 検証中 */}
          {step === 'verify' && (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-16 h-16 text-purple-600 animate-spin mb-4" />
              <p className="text-lg font-semibold mb-2">検証＆保存中...</p>
              <p className="text-sm text-gray-600">HTSコードと関税率を確認しています</p>
            </div>
          )}

          {/* ステップ5: 完了 */}
          {step === 'complete' && verificationResult && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AIデータ強化完了！</h3>
                <p className="text-sm text-gray-600 mb-4">商品データが正常に更新されました</p>
                
                <div className="w-full max-w-md mx-auto space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span>HTSコード:</span>
                    <span className="font-mono font-semibold">{verificationResult.verification?.hts_code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>原産国:</span>
                    <span className="font-semibold">{verificationResult.verification?.origin_country}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>関税率:</span>
                    <span className="font-semibold text-red-600">
                      {((verificationResult.verification?.duty_rate || 0) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200">
                <p className="text-sm">
                  <strong>使用方法:</strong> {method === 'anthropic' ? 'Anthropic API（無料）' : method === 'gemini' ? 'Gemini API' : '手動コピペ'}
                </p>
              </div>

              <Button onClick={onClose} className="w-full" size="lg">閉じる</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
