// components/modals/sm-selection-modal.tsx
/**
 * SM選択モーダル - ハイブリッドAI監査パイプライン
 * 
 * 機能:
 * - 競合商品リスト表示（マッチスコア付き）
 * - 「完全一致」「参考」選択ボタン
 * - 再検索機能
 * - 安全装置ステータス表示
 * 
 * @created 2025-01-16
 */
'use client'

import { useState, useCallback } from 'react'
import { 
  X, 
  Check, 
  BookOpen, 
  Search, 
  AlertTriangle, 
  Shield, 
  Lock, 
  DollarSign,
  Loader2,
  ExternalLink,
  Star,
  Package
} from 'lucide-react'
import type { 
  SmSelectedItem, 
  SmSelectionResponse, 
  AiAuditStatus,
  SafetyStatus 
} from '@/types/hybrid-ai-pipeline'

// =====================================================
// 型定義
// =====================================================

interface Competitor {
  itemId: string
  title: string
  price: number
  currency?: string
  imageUrl?: string
  seller?: { 
    username: string
    feedbackScore: number
    feedbackPercentage?: number 
  }
  location?: { 
    country: string
    city?: string 
  }
  condition?: string
  conditionDescription?: string
  itemWebUrl?: string
  soldQuantity?: number
  itemSpecifics?: Record<string, string>
}

interface SmSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  productId: number
  competitors: Competitor[]
  onSelect: (competitor: Competitor, type: 'exact' | 'reference') => Promise<SmSelectionResponse>
  onReSearch: (keywords: string) => void
  currentTitle: string
  isSearching?: boolean
}

// =====================================================
// マッチスコア計算
// =====================================================

function calculateMatchScore(currentTitle: string, competitorTitle: string): number {
  const titleLower = currentTitle.toLowerCase()
  const compTitleLower = competitorTitle.toLowerCase()
  
  // 型番マッチ（30点）
  const modelMatch = titleLower.match(/\b[A-Z0-9]{3,}-?[A-Z0-9]+\b/gi) || []
  const compModelMatch = compTitleLower.match(/\b[A-Z0-9]{3,}-?[A-Z0-9]+\b/gi) || []
  const modelScore = modelMatch.some(m => 
    compModelMatch.some(cm => cm.toLowerCase() === m.toLowerCase())
  ) ? 30 : 0
  
  // ブランドマッチ（20点）
  const brands = [
    'pokemon', 'nintendo', 'sony', 'bandai', 'konami', 'wizards',
    'topps', 'panini', 'upper deck', 'magic', 'yugioh', 'one piece',
    'sanrio', 'hello kitty', 'disney', 'marvel', 'dc comics'
  ]
  const brandScore = brands.some(b => 
    titleLower.includes(b) && compTitleLower.includes(b)
  ) ? 20 : 0
  
  // キーワードオーバーラップ（50点）
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'new', 'with']
  const words1 = titleLower.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w))
  const words2 = compTitleLower.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w))
  const overlap = words1.filter(w => words2.includes(w)).length
  const keywordScore = Math.min(50, (overlap / Math.max(words1.length, 1)) * 50)
  
  return Math.round(modelScore + brandScore + keywordScore)
}

function getBorderClass(score: number): string {
  if (score >= 90) return 'border-yellow-400 bg-yellow-400/5 shadow-yellow-400/20'
  if (score >= 70) return 'border-green-400 bg-green-400/5'
  if (score >= 50) return 'border-blue-400 bg-blue-400/5'
  return 'border-zinc-600 bg-zinc-800/50'
}

function getScoreBadgeClass(score: number): string {
  if (score >= 90) return 'bg-yellow-500 text-black'
  if (score >= 70) return 'bg-green-500 text-white'
  if (score >= 50) return 'bg-blue-500 text-white'
  return 'bg-zinc-700 text-zinc-300'
}

// =====================================================
// コンポーネント
// =====================================================

export function SmSelectionModal({
  isOpen,
  onClose,
  productId,
  competitors,
  onSelect,
  onReSearch,
  currentTitle,
  isSearching = false,
}: SmSelectionModalProps) {
  const [searchKeywords, setSearchKeywords] = useState(currentTitle)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SmSelectionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 選択処理
  const handleSelect = useCallback(async (competitor: Competitor, type: 'exact' | 'reference') => {
    setIsLoading(true)
    setSelectedId(competitor.itemId)
    setError(null)
    
    try {
      const response = await onSelect(competitor, type)
      setResult(response)
      
      // 成功したら少し待ってから閉じる
      if (response.success) {
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (err: any) {
      console.error('選択エラー:', err)
      setError(err.message || '選択処理でエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }, [onSelect, onClose])

  // 再検索処理
  const handleReSearch = useCallback(() => {
    if (searchKeywords.trim()) {
      setResult(null)
      setError(null)
      onReSearch(searchKeywords.trim())
    }
  }, [searchKeywords, onReSearch])

  // モーダルが閉じている場合は何も表示しない
  if (!isOpen) return null

  // 競合リストをスコア順にソート
  const sortedCompetitors = [...competitors].sort((a, b) => {
    const scoreA = calculateMatchScore(currentTitle, a.title)
    const scoreB = calculateMatchScore(currentTitle, b.title)
    return scoreB - scoreA
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* モーダル本体 */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-700">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700 bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              SM選択 - 競合データを参照
            </h2>
            <span className="px-2 py-0.5 text-xs bg-zinc-700 rounded-full text-zinc-300">
              {competitors.length}件
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 安全装置の説明 */}
        <div className="p-3 bg-blue-900/20 border-b border-blue-800/50">
          <div className="flex items-start gap-2 text-xs text-blue-300">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">安全装置稼働中:</p>
              <ul className="list-disc list-inside text-blue-300/80 space-y-0.5">
                <li>「完全一致」選択後は自動的に「要確認」状態になり、AI監査完了まで出品がブロックされます</li>
                <li>価格は自動的にUSD基準に変換され、他国出品時に為替変換されます</li>
                <li>VeROブランドが検出された場合、出品が制限されます</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 再検索バー */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-800/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="キーワードを修正して再検索..."
              onKeyDown={(e) => e.key === 'Enter' && handleReSearch()}
            />
            <button
              onClick={handleReSearch}
              disabled={isSearching}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              再検索
            </button>
          </div>
        </div>
        
        {/* 選択結果表示 */}
        {result && (
          <ResultBanner result={result} />
        )}
        
        {/* エラー表示 */}
        {error && (
          <div className="p-4 bg-red-900/30 border-b border-red-800">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* 競合リスト */}
        <div className="p-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>検索中...</p>
            </div>
          ) : sortedCompetitors.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">競合データがありません</p>
              <p className="text-sm mt-2">キーワードを変更して再検索してください</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCompetitors.map((competitor) => (
                <CompetitorCard
                  key={competitor.itemId}
                  competitor={competitor}
                  currentTitle={currentTitle}
                  isSelected={selectedId === competitor.itemId}
                  isLoading={isLoading && selectedId === competitor.itemId}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* 注意事項 */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-800/50">
          <div className="flex items-start gap-2 text-xs text-zinc-400">
            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                <strong className="text-zinc-300">「完全一致」</strong>: 
                Item Specifics、原産国、カテゴリを競合からコピーします。
                <span className="text-yellow-400 ml-1">
                  VeROチェック・AI監査が自動実行され、完了まで出品はブロックされます。
                </span>
              </p>
              <p>
                <strong className="text-zinc-300">「参考にする」</strong>: 
                データはコピーせず、AI補完時のヒントとしてのみ使用します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// =====================================================
// サブコンポーネント
// =====================================================

function ResultBanner({ result }: { result: SmSelectionResponse }) {
  const statusConfig: Record<AiAuditStatus, { bg: string; icon: React.ReactNode; message: string }> = {
    clear: {
      bg: 'bg-green-900/30 border-green-800',
      icon: <Check className="w-5 h-5 text-green-400" />,
      message: '✅ 監査完了 - 出品可能',
    },
    warning: {
      bg: 'bg-yellow-900/30 border-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      message: '⚠️ 要確認 - AI監査後に出品可能',
    },
    manual_check: {
      bg: 'bg-red-900/30 border-red-800',
      icon: <Lock className="w-5 h-5 text-red-400" />,
      message: '🚫 手動確認必須',
    },
    processing_batch: {
      bg: 'bg-blue-900/30 border-blue-800',
      icon: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
      message: '⏳ バッチ処理中...',
    },
    pending: {
      bg: 'bg-zinc-800/50 border-zinc-700',
      icon: <Package className="w-5 h-5 text-zinc-400" />,
      message: '⏳ 監査待ち',
    },
  }

  const config = statusConfig[result.auditStatus]

  return (
    <div className={`p-4 border-b ${config.bg}`}>
      <div className="flex items-center gap-3">
        {config.icon}
        
        <div className="flex-1">
          <p className="text-white font-medium">{config.message}</p>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mt-1">
            <span>Item Specifics: {result.itemSpecificsCopied}項目コピー</span>
            <span>スコア: {result.auditScore}/100</span>
            <span>自動修正: {result.autoFixApplied}件</span>
            {result.veroRisk !== 'safe' && (
              <span className="text-yellow-400">
                VeROリスク: {result.veroRisk}
              </span>
            )}
            {result.basePriceUsd && (
              <span className="text-green-400">
                💱 基準価格: ${result.basePriceUsd} USD
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompetitorCard({
  competitor,
  currentTitle,
  isSelected,
  isLoading,
  onSelect,
}: {
  competitor: Competitor
  currentTitle: string
  isSelected: boolean
  isLoading: boolean
  onSelect: (competitor: Competitor, type: 'exact' | 'reference') => void
}) {
  const matchScore = calculateMatchScore(currentTitle, competitor.title)
  const borderClass = getBorderClass(matchScore)
  const scoreBadgeClass = getScoreBadgeClass(matchScore)

  return (
    <div
      className={`p-4 border-2 rounded-lg transition-all ${borderClass} ${
        isSelected ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-zinc-900' : ''
      } ${isLoading ? 'opacity-70' : ''}`}
    >
      <div className="flex gap-4">
        {/* 画像 */}
        {competitor.imageUrl ? (
          <img
            src={competitor.imageUrl}
            alt={competitor.title}
            className="w-24 h-24 object-cover rounded-lg bg-zinc-800"
            loading="lazy"
          />
        ) : (
          <div className="w-24 h-24 bg-zinc-800 rounded-lg flex items-center justify-center">
            <Package className="w-8 h-8 text-zinc-600" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {/* タイトルとスコア */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium line-clamp-2 leading-tight">
                {competitor.title}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-green-400 font-bold text-lg flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {competitor.price.toFixed(2)}
                  <span className="text-sm font-normal text-zinc-400">
                    {competitor.currency || 'USD'}
                  </span>
                </span>
                {competitor.soldQuantity && competitor.soldQuantity > 0 && (
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                    {competitor.soldQuantity}個販売
                  </span>
                )}
              </div>
            </div>
            
            {/* マッチスコアバッジ */}
            <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${scoreBadgeClass} flex-shrink-0`}>
              {matchScore}%
            </div>
          </div>
          
          {/* メタ情報 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-zinc-400">
            {competitor.seller && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                {competitor.seller.username}
                <span className="text-zinc-500">
                  ({competitor.seller.feedbackScore}
                  {competitor.seller.feedbackPercentage && (
                    <span> / {competitor.seller.feedbackPercentage}%</span>
                  )})
                </span>
              </span>
            )}
            {competitor.location?.country && (
              <span>📍 {competitor.location.country}</span>
            )}
            {competitor.condition && (
              <span className="bg-zinc-700 px-1.5 py-0.5 rounded">
                {competitor.condition}
              </span>
            )}
          </div>
          
          {/* アクションボタン */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => onSelect(competitor, 'exact')}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              これと同じ商品
            </button>
            
            <button
              onClick={() => onSelect(competitor, 'reference')}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              参考にする
            </button>
            
            {competitor.itemWebUrl && (
              <a
                href={competitor.itemWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                title="eBayで開く"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// スタイル用のCSS（globals.cssに追加推奨）
// .custom-scrollbar::-webkit-scrollbar { width: 8px; }
// .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
// .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }

export default SmSelectionModal
