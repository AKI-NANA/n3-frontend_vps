// app/tools/operations/components/ai-data-enrichment-modal.tsx
// コピー元: editing/components/ai-data-enrichment-modal.tsx

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Copy, CheckCircle2, AlertCircle, Sparkles, Database, RefreshCw, ExternalLink } from 'lucide-react'
import type { Product } from '../types/product'

interface AIDataEnrichmentModalProps {
  product: Product
  onClose: () => void
  onSave: (success: boolean) => Promise<void>
}

interface AIResult {
  dimensions: { weight_g: number; length_cm: number; width_cm: number; height_cm: number; verification_source?: string; confidence?: string }
  hts_candidates: Array<{ code: string; description: string; reasoning: string; confidence: number }>
  origin_country: { code: string; name: string; reasoning: string }
  english_title: string
  title_reasoning?: string
}

type Step = 'loading' | 'prompt' | 'paste' | 'verify' | 'complete'

export function AIDataEnrichmentModal({ product, onClose, onSave }: AIDataEnrichmentModalProps) {
  const [step, setStep] = useState<Step>('loading')
  const [promptData, setPromptData] = useState<any>(null)
  const [prompt, setPrompt] = useState('')
  const [promptCopied, setPromptCopied] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [parsedResult, setParsedResult] = useState<AIResult | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadPromptData() }, [product.id])

  const loadPromptData = async () => {
    try {
      setError(null)
      const sellerMirrorData = product.ebay_api_data?.listing_reference || null
      const existingDimensions = product.listing_data || {}
      const htsCandidates = await fetchHTSCandidates()
      const countries = await fetchCountries()
      
      const data = {
        product: { id: product.id, title: product.title, description: product.scraped_data?.description || '', price_jpy: product.price_jpy, images: product.scraped_data?.image_urls || [], category: product.scraped_data?.category || '' },
        existingData: { weight_g: existingDimensions.weight_g || null, length_cm: existingDimensions.length_cm || null, width_cm: existingDimensions.width_cm || null, height_cm: existingDimensions.height_cm || null, cost_jpy: existingDimensions.cost_jpy || null },
        sellerMirror: sellerMirrorData ? { referenceCount: sellerMirrorData.referenceItems?.length || 0, averagePrice: calculateAveragePrice(sellerMirrorData.referenceItems), categoryId: sellerMirrorData.suggestedCategory, categoryPath: sellerMirrorData.suggestedCategoryPath, topTitles: sellerMirrorData.referenceItems?.slice(0, 3).map((item: any) => item.title) || [] } : null,
        databaseReferences: { htsCandidates: htsCandidates.slice(0, 10), countries: countries.slice(0, 15) }
      }
      
      setPromptData(data)
      setPrompt(generateAIPrompt(data))
      setStep('prompt')
    } catch (err: any) { setError(err.message); setStep('prompt') }
  }

  const fetchHTSCandidates = async () => { try { const response = await fetch('/api/hts-codes'); if (!response.ok) return []; const data = await response.json(); return data.map((hts: any) => ({ code: hts.hts_code, description: hts.description, category: hts.category, baseDuty: hts.base_duty || 0, section301Rate: hts.section301_rate || 0 })) } catch { return [] } }
  const fetchCountries = async () => { try { const response = await fetch('/api/hts-countries'); if (!response.ok) return []; const data = await response.json(); return data.map((c: any) => ({ code: c.country_code, name: c.country_name })) } catch { return [] } }
  const calculateAveragePrice = (items: any[]): number | null => { if (!items || items.length === 0) return null; const prices = items.map(item => item.price).filter(price => typeof price === 'number' && price > 0); if (prices.length === 0) return null; return prices.reduce((sum, price) => sum + price, 0) / prices.length }

  const generateAIPrompt = (data: any): string => {
    const { product, existingData, sellerMirror, databaseReferences } = data
    return `# 商品データ強化タスク\n\n## 📦 商品基本情報\n- **商品名**: ${product.title}\n- **説明**: ${product.description || '（なし）'}\n- **価格**: ¥${product.price_jpy?.toLocaleString() || '不明'}\n- **画像URL**: ${product.images[0] || '（なし）'}\n\n${existingData.weight_g ? `## 📏 既存の寸法データ（確認が必要）\n- 重量: ${existingData.weight_g}g\n- サイズ: ${existingData.length_cm}×${existingData.width_cm}×${existingData.height_cm}cm\n\n⚠️ **重要**: この寸法データが正確か、Web検索で必ず確認してください。\n` : ''}${sellerMirror ? `\n## 🔍 eBay競合分析データ（SellerMirror）\n- 類似商品数: ${sellerMirror.referenceCount}件\n- 平均価格: $${sellerMirror.averagePrice?.toFixed(2) || '不明'}\n- eBayカテゴリ: ${sellerMirror.categoryPath}\n\n**競合商品の英語タイトル例**:\n${sellerMirror.topTitles.map((title: string, i: number) => `${i + 1}. ${title}`).join('\n')}\n` : ''}\n\n## 🗂️ データベース参照（以下から選択）\n\n### HTSコード候補\n${databaseReferences.htsCandidates.map((hts: any) => `- **${hts.code}**: ${hts.description}`).join('\n')}\n\n### 原産国候補\n${databaseReferences.countries.map((c: any) => `- **${c.code}**: ${c.name}`).join('\n')}\n\n---\n\n## 📋 実行タスク\n\n### 1. 寸法データの確認・取得\n${existingData.weight_g ? '既存データをWeb検索で確認' : 'Web検索で実物の寸法を取得'}\n- 重量（g）、長さ×幅×高さ（cm）\n\n### 2. HTSコード判定\n上記の候補から **最も適切な3つ** を選んでください。\n\n### 3. 原産国判定\n上記の候補から選択してください。\n\n### 4. SEO最適化英語タイトル生成\n多販路で使える汎用性重視（最大80文字）\n\n---\n\n## 📤 回答フォーマット\n\n\`\`\`json\n{\n  "dimensions": {\n    "weight_g": 250,\n    "length_cm": 20.5,\n    "width_cm": 15.0,\n    "height_cm": 5.0,\n    "verification_source": "公式サイト名",\n    "confidence": "verified"\n  },\n  "hts_candidates": [\n    {\n      "code": "8471.30.0100",\n      "description": "portable automatic data processing machines",\n      "reasoning": "選定理由",\n      "confidence": 85\n    },\n    {\n      "code": "8517.62.0050",\n      "description": "smartphones",\n      "reasoning": "選定理由",\n      "confidence": 70\n    },\n    {\n      "code": "6204.62.4031",\n      "description": "women's trousers",\n      "reasoning": "選定理由",\n      "confidence": 60\n    }\n  ],\n  "origin_country": {\n    "code": "CN",\n    "name": "China",\n    "reasoning": "判定根拠"\n  },\n  "english_title": "premium wireless bluetooth headphones with noise cancellation"\n}\n\`\`\``
  }

  const handleCopyPrompt = async () => { try { await navigator.clipboard.writeText(prompt); setPromptCopied(true); setTimeout(() => setPromptCopied(false), 2000) } catch (err) { const textArea = document.createElement('textarea'); textArea.value = prompt; textArea.style.position = 'fixed'; textArea.style.left = '-999999px'; document.body.appendChild(textArea); textArea.select(); try { document.execCommand('copy'); setPromptCopied(true); setTimeout(() => setPromptCopied(false), 2000) } catch (e) { setError('コピーに失敗しました') } document.body.removeChild(textArea) } }
  const handleOpenGemini = () => { window.open('https://gemini.google.com/', '_blank') }
  const handleOpenClaude = () => { window.open('https://claude.ai/', '_blank') }

  const handlePasteJSON = () => {
    try {
      setError(null)
      let jsonText = jsonInput.trim()
      if (jsonText.startsWith('```')) { jsonText = jsonText.replace(/^```json?\s*\n/, '').replace(/\n```\s*$/, '') }
      const parsed: AIResult = JSON.parse(jsonText)
      if (!parsed.dimensions || !parsed.hts_candidates || !parsed.origin_country || !parsed.english_title) { throw new Error('必須フィールドが不足しています') }
      if (parsed.hts_candidates.length < 3) { throw new Error('HTSコード候補は3つ必要です') }
      setParsedResult(parsed)
      setStep('verify')
      setTimeout(() => handleVerify(parsed), 500)
    } catch (err: any) { setError('JSON形式が正しくありません: ' + err.message) }
  }

  const handleVerify = async (result: AIResult = parsedResult!) => {
    if (!result) return
    setVerifying(true); setError(null)
    try {
      const response = await fetch('/api/ai-enrichment/save-result', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id, ...result }) })
      const data = await response.json()
      if (!data.success) { throw new Error(data.error || '検証に失敗しました') }
      setVerificationResult(data); setStep('complete')
      await onSave(true)
    } catch (err: any) { setError(err.message); setStep('verify') } finally { setVerifying(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-indigo-600">
          <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-white" /><h2 className="text-lg font-semibold text-white">AI商品データ強化（無料）</h2></div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 text-sm">
          <div className={`flex items-center gap-2 ${step === 'prompt' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>1. プロンプト</div>
          <div className={`flex items-center gap-2 ${step === 'paste' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>2. JSON貼り付け</div>
          <div className={`flex items-center gap-2 ${step === 'verify' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>3. 検証</div>
          <div className={`flex items-center gap-2 ${step === 'complete' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>4. 完了</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /><div><p className="font-semibold text-red-800">エラー</p><p className="text-sm text-red-600">{error}</p></div></div>)}

          {step === 'prompt' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Database className="w-5 h-5" />📋 統合データ概要</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-600">商品タイトル:</p><p className="font-medium">{product.title}</p></div>
                  {promptData?.sellerMirror && (<div><p className="text-gray-600">セルミラーデータ:</p><p className="font-medium">{promptData.sellerMirror.referenceCount}件の競合商品</p></div>)}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold mb-2 text-lg">🚀 使い方（3ステップ）</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2"><div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">1</div><div><p className="font-semibold">プロンプトをコピー</p></div></div>
                  <div className="flex items-start gap-2"><div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">2</div><div><p className="font-semibold">AIに貼り付けて実行</p></div></div>
                  <div className="flex items-start gap-2"><div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">3</div><div><p className="font-semibold">JSONをこのモーダルに貼り付け</p></div></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleOpenGemini} variant="outline" size="sm" className="flex-1"><ExternalLink className="w-4 h-4 mr-1" />Gemini を開く</Button>
                  <Button onClick={handleOpenClaude} variant="outline" size="sm" className="flex-1"><ExternalLink className="w-4 h-4 mr-1" />Claude を開く</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">AI用プロンプト</label>
                <div className="relative">
                  <textarea readOnly value={prompt} className="w-full h-96 p-3 border rounded-lg font-mono text-xs resize-none bg-gray-50" />
                  <Button onClick={handleCopyPrompt} className="absolute top-2 right-2" size="sm">{promptCopied ? (<><CheckCircle2 className="w-4 h-4 mr-1" />コピー済み</>) : (<><Copy className="w-4 h-4 mr-1" />コピー</>)}</Button>
                </div>
              </div>
              <div className="flex gap-2"><Button onClick={() => setStep('paste')} className="flex-1 bg-green-600 hover:bg-green-700" size="lg">✅ プロンプトをコピーしたら「次へ」</Button></div>
            </div>
          )}

          {step === 'paste' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 text-lg">📋 AIの回答を貼り付け</h3>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between"><span>AIの回答 (JSON)</span><span className="text-xs text-gray-500">{jsonInput.length > 0 ? `${jsonInput.length}文字入力済み` : '待機中...'}</span></label>
                <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder='AIの回答をここに貼り付けてください...' className="w-full h-64 p-3 border-2 border-blue-300 rounded-lg font-mono text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-200" autoFocus />
              </div>
              {jsonInput.length > 0 && (<div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">✅ JSONデータが検出されました。</div>)}
              <div className="flex gap-2">
                <Button onClick={() => setStep('prompt')} variant="outline">← 戻る</Button>
                <Button onClick={handlePasteJSON} className="flex-1 bg-green-600 hover:bg-green-700" size="lg" disabled={jsonInput.length === 0}>💾 保存してSupabaseに更新</Button>
              </div>
            </div>
          )}

          {step === 'verify' && (<div className="flex flex-col items-center justify-center py-12"><RefreshCw className="w-16 h-16 text-purple-600 animate-spin mb-4" /><p className="text-lg font-semibold mb-2">Supabaseで検証中...</p></div>)}

          {step === 'complete' && verificationResult && (
            <div className="space-y-4">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI商品データ強化完了！</h3>
                <div className="w-full max-w-md space-y-2 text-left">
                  <div className="flex justify-between text-sm"><span>HTSコード:</span><span className="font-mono font-semibold">{verificationResult.verification.hts_code}</span></div>
                  <div className="flex justify-between text-sm"><span>原産国:</span><span className="font-semibold">{verificationResult.verification.origin_country}</span></div>
                  <div className="flex justify-between text-sm"><span>関税率:</span><span className="font-semibold text-red-600">{(verificationResult.verification.duty_rate * 100).toFixed(2)}%</span></div>
                </div>
              </div>
              <Button onClick={onClose} className="w-full" size="lg">閉じる</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
