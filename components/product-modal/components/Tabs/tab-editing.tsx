// components/product-modal/components/Tabs/tab-editing.tsx
'use client'

import { useState } from 'react'
import styles from '../../full-featured-modal.module.css'
import type { Product } from '@/types/product'
import type { HtsCandidate } from '@/lib/tariff-service'

export interface TabEditingProps {
  product: Product | null
  onSave?: (updates: Partial<Product>) => Promise<void>
}

export function TabEditing({ product, onSave }: TabEditingProps) {
  // フォーム状態
  const [formData, setFormData] = useState({
    // 通関情報
    material: product?.material || '',
    origin_country: product?.origin_country || '',
    hts_code: product?.hts_code || '',
    
    // AI活用情報（手動入力）
    lookup_keywords: '', // 内部state（DBに保存しない）
    rewritten_english_title: product?.rewritten_english_title || '',
    market_research_summary: product?.market_research_summary || ''
  })

  // HTS候補リスト
  const [htsCandidates, setHtsCandidates] = useState<HtsCandidate[]>([])
  
  // ローディング状態
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // エラー・成功メッセージ
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null)

  // フィールド変更ハンドラー
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // サンプルキーワード生成
  const handleGenerateSampleKeywords = () => {
    if (!product?.title) {
      setMessage({ type: 'error', text: '商品タイトルがありません' })
      return
    }

    // 簡易的なキーワード生成
    const titleLower = product.title.toLowerCase()
    const keywords: string[] = []

    if (titleLower.includes('card') || titleLower.includes('カード')) {
      keywords.push('trading cards', 'game cards', 'paper')
    }
    if (titleLower.includes('pokemon') || titleLower.includes('ポケモン')) {
      keywords.push('pokemon', 'collectible')
    }
    if (titleLower.includes('phone') || titleLower.includes('iphone')) {
      keywords.push('smartphone', 'mobile phone', 'electronic')
    }
    if (titleLower.includes('shirt') || titleLower.includes('シャツ')) {
      keywords.push('apparel', 'clothing', 'textile')
    }
    if (titleLower.includes('toy') || titleLower.includes('おもちゃ')) {
      keywords.push('toy', 'game', 'plastic')
    }

    if (keywords.length === 0) {
      setFormData(prev => ({
        ...prev,
        lookup_keywords: 'trading cards, collectible, paper (例)'
      }))
      setMessage({
        type: 'info',
        text: 'サンプルキーワードを生成しました。商品に合わせて編集してください。'
      })
    } else {
      setFormData(prev => ({
        ...prev,
        lookup_keywords: keywords.join(', ')
      }))
      setMessage({
        type: 'success',
        text: 'サンプルキーワードを生成しました'
      })
    }
  }

  // HTS候補検索ボタン
  const handleSearchHts = async () => {
    if (!formData.lookup_keywords || formData.lookup_keywords.trim().length === 0) {
      setMessage({
        type: 'error',
        text: '推論用キーワードを入力してください'
      })
      return
    }

    setSearching(true)
    setMessage(null)
    setHtsCandidates([])

    try {
      const response = await fetch('/api/products/hts-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: formData.lookup_keywords
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'HTS検索に失敗しました')
      }

      if (result.success && result.data.candidates.length > 0) {
        setHtsCandidates(result.data.candidates)
        setMessage({
          type: 'success',
          text: `${result.data.candidates.length}件のHTS候補が見つかりました`
        })
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'HTS候補が見つかりませんでした'
        })
        
        // 提案を表示
        if (result.suggestions) {
          console.log('💡 改善提案:', result.suggestions)
        }
      }

    } catch (error: any) {
      console.error('❌ HTS検索エラー:', error)
      setMessage({
        type: 'error',
        text: error.message || 'HTS検索中にエラーが発生しました'
      })
    } finally {
      setSearching(false)
    }
  }

  // HTS候補を選択
  const handleSelectHtsCandidate = (candidate: HtsCandidate) => {
    setFormData(prev => ({
      ...prev,
      hts_code: candidate.hts_number
    }))
    setMessage({
      type: 'success',
      text: `HTSコード ${candidate.hts_number} を選択しました`
    })
  }

  // 保存ボタン
  const handleSave = async () => {
    if (!product?.id) {
      setMessage({ type: 'error', text: '商品IDが不明です' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const updates: Partial<Product> = {
        material: formData.material || null,
        origin_country: formData.origin_country || null,
        hts_code: formData.hts_code || null,
        rewritten_english_title: formData.rewritten_english_title || null,
        market_research_summary: formData.market_research_summary || null
      }

      // 親コンポーネントの保存関数を呼び出し
      if (onSave) {
        await onSave(updates)
        setMessage({
          type: 'success',
          text: 'HTS情報を保存しました'
        })
      } else {
        // フォールバック: 直接APIを呼び出し
        const response = await fetch('/api/products/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: product.id,
            updates
          })
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '保存に失敗しました')
        }

        setMessage({
          type: 'success',
          text: 'HTS情報を保存しました'
        })
      }

    } catch (error: any) {
      console.error('❌ 保存エラー:', error)
      setMessage({
        type: 'error',
        text: error.message || '保存中にエラーが発生しました'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.tabContent}>
      {/* ヘッダー */}
      <div className={styles.sectionHeader}>
        <h3>📦 HTS分類・関税情報（手動運用版）</h3>
        <p className={styles.sectionDescription}>
          無料AIで生成したキーワードとデータを貼り付けて、正確なHTS分類を行います（外部API課金なし）
        </p>
      </div>

      {/* メッセージ表示 */}
      {message && (
        <div className={
          message.type === 'error' ? styles.errorMessage :
          message.type === 'success' ? styles.successMessage :
          styles.infoMessage
        }>
          {message.text}
        </div>
      )}

      {/* ガイド */}
      <div style={{
        background: '#f0f9ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#1e40af' }}>
          💡 使い方ガイド
        </h4>
        <ol style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569', margin: 0, paddingLeft: '20px' }}>
          <li>商品タイトルと素材から、無料AI（Gemini/ChatGPT/Claude）でキーワードを生成</li>
          <li>生成されたキーワードを「推論用キーワード」欄に貼り付け</li>
          <li>「HTS候補を検索」ボタンをクリック</li>
          <li>候補リストから最適なHTSコードを選択</li>
          <li>原産国・素材も入力して保存</li>
        </ol>
        <div style={{ 
          marginTop: '12px', 
          padding: '8px 12px', 
          background: '#dbeafe', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>🎯 AIプロンプト例:</strong> 「この商品のHTS分類に最適な英語キーワードを3-7個、カンマ区切りで生成してください。商品: {'{'}商品タイトル{'}'}, 素材: {'{'}素材{'}'}」
        </div>
      </div>

      {/* フォーム: AI活用情報 */}
      <div className={styles.section}>
        <h4 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 600 }}>
          🤖 AI活用情報（無料AIで生成して貼り付け）
        </h4>

        <div className={styles.formGrid}>
          {/* 推論用キーワード */}
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.formLabel}>
              推論用キーワード <span className={styles.required}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={formData.lookup_keywords}
                onChange={(e) => handleChange('lookup_keywords', e.target.value)}
                placeholder="例: trading cards, game cards, collectible, paper"
                className={styles.formInput}
                style={{ flex: 1 }}
              />
              <button
                onClick={handleGenerateSampleKeywords}
                className={styles.secondaryButton}
                style={{ whiteSpace: 'nowrap' }}
              >
                📝 サンプル生成
              </button>
              <button
                onClick={handleSearchHts}
                disabled={searching || !formData.lookup_keywords}
                className={styles.primaryButton}
                style={{ whiteSpace: 'nowrap', minWidth: '140px' }}
              >
                {searching ? '検索中...' : '🔍 HTS候補を検索'}
              </button>
            </div>
            <p className={styles.formHint}>
              無料AI（Gemini/ChatGPT/Claude）で生成したキーワードをカンマ区切りで貼り付けてください
            </p>
          </div>

          {/* リライト英語タイトル */}
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.formLabel}>
              リライト英語タイトル <span className={styles.optional}>(オプション)</span>
            </label>
            <input
              type="text"
              value={formData.rewritten_english_title}
              onChange={(e) => handleChange('rewritten_english_title', e.target.value)}
              placeholder="AIでSEO最適化された英語タイトルを貼り付け"
              className={styles.formInput}
            />
            <p className={styles.formHint}>
              無料AIに「この商品タイトルをSEO最適化された英語タイトルにリライトしてください」と依頼
            </p>
          </div>

          {/* 市場調査サマリー */}
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.formLabel}>
              市場調査サマリー <span className={styles.optional}>(オプション)</span>
            </label>
            <textarea
              value={formData.market_research_summary}
              onChange={(e) => handleChange('market_research_summary', e.target.value)}
              placeholder="AIによる市場調査結果を貼り付け（競合分析、価格帯、需要等）"
              className={styles.formTextarea}
              rows={4}
            />
            <p className={styles.formHint}>
              無料AIに「この商品の市場調査を行い、競合分析・価格帯・需要をサマリーしてください」と依頼
            </p>
          </div>
        </div>
      </div>

      {/* HTS候補リスト */}
      {htsCandidates.length > 0 && (
        <div className={styles.section}>
          <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
            📋 HTS候補リスト（クリックして選択）
          </h4>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {htsCandidates.map((candidate, index) => (
              <div
                key={candidate.hts_number}
                onClick={() => handleSelectHtsCandidate(candidate)}
                style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: formData.hts_code === candidate.hts_number ? '#dbeafe' : '#fff'
                }}
                onMouseEnter={(e) => {
                  if (formData.hts_code !== candidate.hts_number) {
                    e.currentTarget.style.background = '#f8fafc'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.hts_code !== candidate.hts_number) {
                    e.currentTarget.style.background = '#fff'
                  }
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '4px'
                }}>
                  <strong style={{ fontSize: '14px', color: '#1e40af' }}>
                    {candidate.hts_number}
                  </strong>
                  {candidate.relevance_score !== undefined && (
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      background: '#e0f2fe',
                      borderRadius: '12px',
                      color: '#075985'
                    }}>
                      関連度: {candidate.relevance_score}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                  {candidate.heading_description}
                </div>
                {candidate.subheading_description && (
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    → {candidate.subheading_description}
                  </div>
                )}
                {candidate.detail_description && (
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    → {candidate.detail_description}
                  </div>
                )}
                {candidate.description_ja && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#22c55e', 
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>
                    📝 {candidate.description_ja}
                  </div>
                )}
                {candidate.general_rate_of_duty && (
                  <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                    <strong>関税率:</strong> {candidate.general_rate_of_duty}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フォーム: 通関情報 */}
      <div className={styles.section}>
        <h4 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 600 }}>
          📋 通関情報
        </h4>

        <div className={styles.formGrid}>
          {/* 素材 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              素材 <span className={styles.optional}>(オプション)</span>
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => handleChange('material', e.target.value)}
              placeholder="例: Cotton, Plastic, Metal"
              className={styles.formInput}
            />
            <p className={styles.formHint}>
              商品の主要な素材を入力してください
            </p>
          </div>

          {/* 原産国 */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              原産国 <span className={styles.optional}>(オプション)</span>
            </label>
            <input
              type="text"
              value={formData.origin_country}
              onChange={(e) => handleChange('origin_country', e.target.value)}
              placeholder="例: JP, CN, US"
              className={styles.formInput}
              maxLength={2}
            />
            <p className={styles.formHint}>
              ISO 3166-1 alpha-2コード（2文字）で入力してください
            </p>
          </div>

          {/* HTSコード */}
          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.formLabel}>
              HTSコード <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.hts_code}
              onChange={(e) => handleChange('hts_code', e.target.value)}
              placeholder="例: 9504.90.3000（上記の候補リストから選択）"
              className={styles.formInput}
              maxLength={12}
            />
            <p className={styles.formHint}>
              10桁のHTSコードを入力するか、上記の候補リストから選択してください
            </p>
          </div>
        </div>
      </div>

      {/* 保存ボタン */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '12px',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className={styles.primaryButton}
        >
          {saving ? '保存中...' : '💾 全ての情報を保存'}
        </button>
      </div>

      {/* デバッグ情報（開発用） */}
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '24px', fontSize: '12px' }}>
          <summary style={{ cursor: 'pointer', color: '#64748b' }}>
            🔧 デバッグ情報
          </summary>
          <pre style={{ 
            background: '#f8fafc', 
            padding: '12px', 
            borderRadius: '4px',
            overflow: 'auto',
            marginTop: '8px'
          }}>
            {JSON.stringify({
              productId: product?.id,
              productTitle: product?.title,
              formData,
              candidatesCount: htsCandidates.length
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
