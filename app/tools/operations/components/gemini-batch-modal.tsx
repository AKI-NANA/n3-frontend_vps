// app/tools/operations/components/gemini-batch-modal.tsx
// コピー元: editing/components/gemini-batch-modal.tsx

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Copy, CheckCircle2, ExternalLink, Loader2, AlertCircle } from 'lucide-react'

interface GeminiBatchModalProps {
  selectedIds: Set<string>
  onClose: () => void
  onComplete: () => Promise<void>
}

type Step = 'select' | 'prompt' | 'paste' | 'saving' | 'complete'
type DataType = 'basic' | 'customs' | 'market' | 'both'

export function GeminiBatchModal({ selectedIds, onClose, onComplete }: GeminiBatchModalProps) {
  const [step, setStep] = useState<Step>('select')
  const [dataType, setDataType] = useState<DataType>('both')
  const [prompt, setPrompt] = useState('')
  const [promptCopied, setPromptCopied] = useState(false)
  const [pasteData, setPasteData] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (step === 'prompt') { handleGeneratePrompt() } }, [step, dataType])

  const handleSelectDataType = (type: DataType) => { setDataType(type); setStep('prompt') }

  const handleGeneratePrompt = async () => {
    try {
      setError(null)
      const response = await fetch('/api/gemini-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds: Array.from(selectedIds).map(Number), dataType: dataType }) })
      if (!response.ok) { throw new Error('プロンプト生成に失敗しました') }
      const data = await response.json()
      setPrompt(data.prompt)
    } catch (error: any) { setError(error.message); console.error('Prompt generation error:', error) }
  }

  const handleCopyPrompt = async () => { try { await navigator.clipboard.writeText(prompt); setPromptCopied(true); setTimeout(() => setPromptCopied(false), 2000) } catch (err) { const textArea = document.createElement('textarea'); textArea.value = prompt; textArea.style.position = 'fixed'; textArea.style.left = '-999999px'; document.body.appendChild(textArea); textArea.select(); try { document.execCommand('copy'); setPromptCopied(true); setTimeout(() => setPromptCopied(false), 2000) } catch (e) { setError('コピーに失敗しました') } document.body.removeChild(textArea) } }
  const handleOpenGemini = () => { window.open('https://gemini.google.com/', '_blank') }
  const handleNextToPaste = () => { setStep('paste') }

  const handleSave = async () => {
    if (!pasteData.trim()) { setError('Geminiの出力を貼り付けてください'); return }
    setStep('saving'); setError(null)
    try {
      let jsonText = pasteData.trim()
      if (jsonText.startsWith('```')) { jsonText = jsonText.replace(/^```json?\s*\n/, '').replace(/\n```\s*$/, '') }
      const jsonData = JSON.parse(jsonText)
      if (!Array.isArray(jsonData)) { throw new Error('JSON配列である必要があります') }
      const response = await fetch('/api/products/batch-update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates: jsonData }) })
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || '保存に失敗しました') }
      const result = await response.json()
      setResult(result); setStep('complete')
      await onComplete()
      setTimeout(() => { onClose() }, 2000)
    } catch (error: any) { console.error('❌ 保存エラー:', error); setError(error.message); setStep('paste') }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-indigo-600">
          <div className="flex items-center gap-2"><h2 className="text-lg font-semibold text-white">🤖 Gemini一括データ取得（{selectedIds.size}件）</h2></div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 text-sm">
          <div className={`flex items-center gap-2 ${step === 'select' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>0. データ選択</div>
          <div className={`flex items-center gap-2 ${step === 'prompt' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>1. プロンプト</div>
          <div className={`flex items-center gap-2 ${step === 'paste' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>2. 貼り付け</div>
          <div className={`flex items-center gap-2 ${step === 'saving' ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>3. 保存中</div>
          <div className={`flex items-center gap-2 ${step === 'complete' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>4. 完了</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /><div><p className="font-semibold text-red-800">エラー</p><p className="text-sm text-red-600">{error}</p></div></div>)}

          {step === 'select' && (
            <div className="space-y-6">
              <div className="text-center mb-6"><h3 className="text-xl font-semibold mb-2">どのデータを取得しますか？</h3><p className="text-sm text-gray-600">{selectedIds.size}件の商品を処理します</p></div>
              <button onClick={() => handleSelectDataType('both')} className="w-full p-6 text-left border-2 border-purple-300 hover:border-purple-500 rounded-lg transition-all hover:shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-start gap-4"><div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xl font-bold">🚀</div><div className="flex-1"><div className="flex items-center gap-2 mb-2"><h4 className="font-semibold text-lg">全データ取得（推奨）</h4><span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">推奨</span></div><p className="text-sm text-gray-600 mb-3">基本情報 + 関税 + 市場調査を一度に取得</p></div></div>
              </button>
              <button onClick={() => handleSelectDataType('basic')} className="w-full p-6 text-left border-2 border-blue-200 hover:border-blue-400 rounded-lg transition-all hover:shadow-lg bg-blue-50">
                <div className="flex items-start gap-4"><div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">⚡</div><div className="flex-1"><h4 className="font-semibold text-lg mb-2">基本データのみ（速い）</h4><p className="text-sm text-gray-600 mb-2">英語タイトル、サイズ、重さ</p></div></div>
              </button>
              <button onClick={() => handleSelectDataType('customs')} className="w-full p-6 text-left border-2 border-orange-200 hover:border-orange-400 rounded-lg transition-all hover:shadow-lg bg-orange-50">
                <div className="flex items-start gap-4"><div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">📊</div><div className="flex-1"><h4 className="font-semibold text-lg mb-2">関税情報のみ</h4><p className="text-sm text-gray-600 mb-2">HTSコード、原産国、素材、関税率</p></div></div>
              </button>
              <button onClick={() => handleSelectDataType('market')} className="w-full p-6 text-left border-2 border-green-200 hover:border-green-400 rounded-lg transition-all hover:shadow-lg bg-green-50">
                <div className="flex items-start gap-4"><div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">📊</div><div className="flex-1"><h4 className="font-semibold text-lg mb-2">市場調査のみ</h4><p className="text-sm text-gray-600 mb-2">プレミア率、コミュニティスコア、競合数、供給状況</p></div></div>
              </button>
            </div>
          )}

          {step === 'prompt' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold mb-2 text-lg">🚀 使い方（3ステップ）</h3>
                <div className="flex gap-2 mt-3"><Button onClick={handleOpenGemini} variant="outline" size="sm" className="flex-1"><ExternalLink className="w-4 h-4 mr-1" />Gemini Webを開く</Button></div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gemini用プロンプト</label>
                <div className="relative">
                  <textarea readOnly value={prompt || 'プロンプトを生成中...'} className="w-full h-96 p-3 border rounded-lg font-mono text-xs resize-none bg-gray-50" />
                  <Button onClick={handleCopyPrompt} className="absolute top-2 right-2" size="sm" disabled={!prompt}>{promptCopied ? (<><CheckCircle2 className="w-4 h-4 mr-1" />コピー済み</>) : (<><Copy className="w-4 h-4 mr-1" />コピー</>)}</Button>
                </div>
              </div>
              <div className="flex gap-2"><Button onClick={handleNextToPaste} className="flex-1 bg-green-600 hover:bg-green-700" size="lg">✅ コピーしたら「次へ」</Button></div>
            </div>
          )}

          {step === 'paste' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200"><h3 className="font-semibold mb-2 text-lg">📋 Geminiの出力を貼り付け</h3></div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between"><span>Geminiの出力（JSON）</span><span className="text-xs text-gray-500">{pasteData.length > 0 ? `${pasteData.length}文字入力済み` : '待機中...'}</span></label>
                <textarea value={pasteData} onChange={(e) => setPasteData(e.target.value)} placeholder='Geminiの回答をここに貼り付けてください...' className="w-full h-96 p-3 border-2 border-blue-300 rounded-lg font-mono text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-200" autoFocus />
              </div>
              {pasteData.length > 0 && (<div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">✅ JSONデータが検出されました。「保存」ボタンをクリックしてください。</div>)}
              <div className="flex gap-2">
                <Button onClick={() => setStep('prompt')} variant="outline">← 戻る</Button>
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700" size="lg" disabled={pasteData.length === 0}>💾 Supabaseに保存</Button>
              </div>
            </div>
          )}

          {step === 'saving' && (<div className="flex flex-col items-center justify-center py-12"><Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" /><p className="text-lg font-semibold mb-2">Supabaseに保存中...</p></div>)}

          {step === 'complete' && result && (
            <div className="space-y-4">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">保存完了！</h3>
                <div className="w-full max-w-md space-y-2 text-left mt-4">
                  <div className="flex justify-between text-sm"><span>処理件数:</span><span className="font-semibold">{result.total}件</span></div>
                  <div className="flex justify-between text-sm"><span>成功:</span><span className="font-semibold text-green-600">{result.succeeded}件</span></div>
                  {result.failed > 0 && (<div className="flex justify-between text-sm"><span>失敗:</span><span className="font-semibold text-red-600">{result.failed}件</span></div>)}
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
