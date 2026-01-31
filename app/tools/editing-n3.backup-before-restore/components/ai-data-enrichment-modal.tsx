// app/tools/editing/components/ai-data-enrichment-modal.tsx
// シンプル版: JSON貼り付け専用モーダル
'use client'

import { useState } from 'react'
import { X, CheckCircle2, AlertCircle, Sparkles, ExternalLink } from 'lucide-react'
import type { Product } from '../types/product'

interface AIDataEnrichmentModalProps {
  product: Product
  onClose: () => void
  onSave: (success: boolean) => Promise<void>
}

interface AIResult {
  dimensions?: {
    weight_g: number
    length_cm: number
    width_cm: number
    height_cm: number
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
}

export function AIDataEnrichmentModal({ product, onClose, onSave }: AIDataEnrichmentModalProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSave = async () => {
    if (!jsonInput.trim()) {
      setError('JSONを入力してください')
      return
    }

    setError(null)
    setSaving(true)

    try {
      // JSONをパース
      let jsonText = jsonInput.trim()
      
      // ```json ... ``` のマークダウンを削除
      if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```json?\s*\n?/g, '').replace(/```\s*$/g, '').trim()
      }
      
      const parsed: AIResult = JSON.parse(jsonText)

      // 必須フィールドの検証
      if (!parsed.hts_candidates || !parsed.origin_country || !parsed.english_title) {
        throw new Error('必須フィールドが不足: hts_candidates, origin_country, english_title')
      }

      // APIに送信
      const response = await fetch('/api/ai-enrichment/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ...parsed
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '保存に失敗しました')
      }

      setResult(data)
      setSuccess(true)
      await onSave(true)

    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError('JSON形式が正しくありません。Geminiの回答をそのままコピペしてください。')
      } else {
        setError(err.message)
      }
    } finally {
      setSaving(false)
    }
  }

  // 成功画面
  if (success && result) {
    return (
      <div 
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
        }}>
          <CheckCircle2 style={{ width: '64px', height: '64px', color: '#10b981', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>保存完了！</h2>
          
          <div style={{ textAlign: 'left', background: '#f0fdf4', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>HTSコード:</span>
              <strong style={{ fontFamily: 'monospace' }}>{result.verification?.hts_code || 'N/A'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>原産国:</span>
              <strong>{result.verification?.origin_country || 'N/A'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>関税率:</span>
              <strong style={{ color: '#dc2626' }}>
                {result.verification?.duty_rate ? `${(result.verification.duty_rate * 100).toFixed(2)}%` : 'N/A'}
              </strong>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    )
  }

  // メイン画面（JSON貼り付け）
  return (
    <div 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
          color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles style={{ width: '20px', height: '20px' }} />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>AIデータ貼り付け</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          {/* 商品情報 */}
          <div style={{
            background: '#f8fafc',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
          }}>
            <strong>商品:</strong> {product.title}
          </div>

          {/* クイックリンク */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <a
              href="https://gemini.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                background: '#4285f4',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              <ExternalLink style={{ width: '14px', height: '14px' }} />
              Gemini
            </a>
            <a
              href="https://claude.ai/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                background: '#f97316',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              <ExternalLink style={{ width: '14px', height: '14px' }} />
              Claude
            </a>
          </div>

          {/* エラー表示 */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '16px',
              color: '#991b1b',
              fontSize: '13px',
            }}>
              <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* JSON入力 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              AIの回答（JSON）を貼り付け:
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`GeminiまたはClaudeの回答をここにコピペ

例:
\`\`\`json
{
  "hts_candidates": [...],
  "origin_country": {...},
  "english_title": "..."
}
\`\`\``}
              style={{
                width: '100%',
                height: '250px',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                resize: 'none',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* ヒント */}
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: '#fefce8',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#854d0e',
          }}>
            💡 <strong>ヒント:</strong> AIの回答全体をコピペしてOK。```json タグは自動で除去されます。
          </div>
        </div>

        {/* フッター */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '12px',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: '#f1f5f9',
              color: '#475569',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !jsonInput.trim()}
            style={{
              flex: 2,
              padding: '12px',
              background: saving ? '#94a3b8' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? '保存中...' : '💾 保存してDBに反映'}
          </button>
        </div>
      </div>
    </div>
  )
}
