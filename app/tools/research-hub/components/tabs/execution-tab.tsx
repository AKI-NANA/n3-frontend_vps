// app/tools/research-hub/components/tabs/execution-tab.tsx
'use client'

import { useState } from 'react'
import { Search, ShoppingCart, Package, AlertCircle } from 'lucide-react'

interface ExecutionTabProps {
  onSearchComplete: () => void
}

export function ExecutionTab({ onSearchComplete }: ExecutionTabProps) {
  const [activeSearch, setActiveSearch] = useState<'ebay' | 'amazon' | 'batch'>('ebay')
  const [loading, setLoading] = useState(false)
  
  // eBay form
  const [ebayKeyword, setEbayKeyword] = useState('')
  const [ebayCategory, setEbayCategory] = useState('')
  const [ebayMinPrice, setEbayMinPrice] = useState('')
  const [ebayMaxPrice, setEbayMaxPrice] = useState('')
  const [ebaySoldOnly, setEbaySoldOnly] = useState(true)

  // Check if Amazon PA API is configured
  const amazonConfigured = false // PA-API認証情報が未設定

  const handleEbaySearch = async () => {
    if (!ebayKeyword.trim()) {
      alert('キーワードを入力してください')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/research/ebay/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: ebayKeyword,
          category: ebayCategory || undefined,
          minPrice: ebayMinPrice ? parseFloat(ebayMinPrice) : undefined,
          maxPrice: ebayMaxPrice ? parseFloat(ebayMaxPrice) : undefined,
          soldOnly: ebaySoldOnly
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(`${data.count}件の商品を取得しました`)
        onSearchComplete()
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (error: any) {
      alert(`エラー: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-4">
      {/* Search Type Tabs - Compact */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setActiveSearch('ebay')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeSearch === 'ebay' ? 'text-white' : ''
          }`}
          style={{
            background: activeSearch === 'ebay' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: activeSearch === 'ebay' ? 'white' : 'var(--text-muted)'
          }}
        >
          <Search size={13} />
          eBay Sold検索
        </button>
        <button
          onClick={() => setActiveSearch('amazon')}
          disabled={!amazonConfigured}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            !amazonConfigured ? 'opacity-50 cursor-not-allowed' : ''
          } ${activeSearch === 'amazon' ? 'text-white' : ''}`}
          style={{
            background: activeSearch === 'amazon' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: activeSearch === 'amazon' ? 'white' : 'var(--text-muted)'
          }}
        >
          <ShoppingCart size={13} />
          Amazon検索
          {!amazonConfigured && <AlertCircle size={11} />}
        </button>
        <button
          onClick={() => setActiveSearch('batch')}
          disabled={!amazonConfigured}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            !amazonConfigured ? 'opacity-50 cursor-not-allowed' : ''
          } ${activeSearch === 'batch' ? 'text-white' : ''}`}
          style={{
            background: activeSearch === 'batch' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: activeSearch === 'batch' ? 'white' : 'var(--text-muted)'
          }}
        >
          <Package size={13} />
          バッチ検索
          {!amazonConfigured && <AlertCircle size={11} />}
        </button>
      </div>

      {/* Amazon未設定の警告 */}
      {!amazonConfigured && (activeSearch === 'amazon' || activeSearch === 'batch') && (
        <div className="mb-4 p-3 rounded text-xs" style={{ 
          background: 'var(--warning-bg)', 
          border: '1px solid var(--warning)',
          color: 'var(--warning)' 
        }}>
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Amazon PA-API 未設定</div>
              <div className="text-[10px] opacity-90">
                Amazon Product Advertising APIの認証情報が必要です。<br/>
                .env.localに以下を設定してください：<br/>
                <code className="block mt-1 p-1 bg-black/10 rounded">
                  AMAZON_ACCESS_KEY=your_access_key<br/>
                  AMAZON_SECRET_KEY=your_secret_key<br/>
                  AMAZON_PARTNER_TAG=your_associate_tag
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* eBay Form */}
      {activeSearch === 'ebay' && (
        <div className="max-w-2xl space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              キーワード <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <input
              type="text"
              value={ebayKeyword}
              onChange={(e) => setEbayKeyword(e.target.value)}
              placeholder="例: Nintendo Switch"
              className="n3-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                カテゴリID（オプション）
              </label>
              <input
                type="text"
                value={ebayCategory}
                onChange={(e) => setEbayCategory(e.target.value)}
                placeholder="例: 139973"
                className="n3-input text-xs"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={ebaySoldOnly}
                  onChange={(e) => setEbaySoldOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Soldアイテムのみ検索</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                最小価格（USD）
              </label>
              <input
                type="number"
                value={ebayMinPrice}
                onChange={(e) => setEbayMinPrice(e.target.value)}
                placeholder="0"
                className="n3-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                最大価格（USD）
              </label>
              <input
                type="number"
                value={ebayMaxPrice}
                onChange={(e) => setEbayMaxPrice(e.target.value)}
                placeholder="1000"
                className="n3-input text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleEbaySearch}
            disabled={loading}
            className="n3-btn n3-btn-primary text-xs"
          >
            {loading ? '検索中...' : 'eBay検索開始'}
          </button>

          <div className="p-2.5 rounded text-[10px]" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
            💡 検索した商品は自動的に「リサーチ結果」タブに保存されます
          </div>
        </div>
      )}

      {/* Amazon/Batch - Disabled State */}
      {(activeSearch === 'amazon' || activeSearch === 'batch') && !amazonConfigured && (
        <div className="max-w-2xl">
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm font-medium mb-1">Amazon検索は現在利用できません</div>
            <div className="text-xs">PA-API認証情報を設定してください</div>
          </div>
        </div>
      )}
    </div>
  )
}
