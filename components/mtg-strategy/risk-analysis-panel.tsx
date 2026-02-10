/**
 * リスク分析パネル
 *
 * 機能：
 * - キラーデッキ警告（勝率35%未満）
 * - サイドボードカードの汎用性スコア
 * - メタゲームでの立ち位置分析
 */

'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// 型定義
interface MTGCard {
  id: string
  name: string
  nameJp?: string
  manaCost: string
  cmc: number
  type: string
  rarity: string
  colors: string[]
  quantity: number
  tags: string[]
  synergyScore?: number
  versatilityScore?: number
}

interface DeckList {
  id: string
  name: string
  archetype: string
  format: string
  mainDeck: MTGCard[]
  sideboard: MTGCard[]
  stabilityScore: number
  synergyScore: number
  mulliganRate: number
}

interface MetaDeck {
  id: string
  name: string
  archetype: string
  metaShare: number
  g1WinRate: number
  expectedCards: MTGCard[]
}

interface MatchupAnalysis {
  opponentDeck: MetaDeck
  g1Ewr: number
  g2Strategy: string
  g3Strategy: string
  mwe: number
  sideboardIn: MTGCard[]
  sideboardOut: MTGCard[]
  g3Transform?: {
    additionalIn: MTGCard[]
    additionalOut: MTGCard[]
    winPattern: string
  }
}

interface RiskAnalysisPanelProps {
  deck: DeckList | null
  matchupResults: MatchupAnalysis[]
  metaDecks: MetaDeck[]
}

// カードタグと対策対象のマッピング
const TAG_TARGETS: Record<string, string[]> = {
  '墓地対策': ['デルバー系', 'リアニメイト', '探査', 'フェニックス'],
  'エンチャント対策': ['エンチャントレス', 'サーガ系', 'オース'],
  'アーティファクト対策': ['親和', 'アーティファクトコンボ', '宝物系'],
  'クリーチャー除去': ['アグロ', 'ミッドレンジ', 'クリーチャーコンボ'],
  'カウンター': ['コンボ', 'コントロール', 'ランプ'],
  'ディスカード': ['コントロール', 'コンボ'],
  '全体除去': ['アグロ', '横並べ', 'トークン'],
  'プレインズウォーカー対策': ['スーパーフレンズ', 'コントロール'],
  'ライフゲイン': ['バーン', 'アグロ'],
}

export function RiskAnalysisPanel({ deck, matchupResults, metaDecks }: RiskAnalysisPanelProps) {
  // キラーデッキ（勝率35%未満）
  const killerMatchups = useMemo(() => {
    return matchupResults.filter(m => m.mwe < 35)
      .sort((a, b) => a.mwe - b.mwe)
  }, [matchupResults])

  // 苦手マッチアップ（35-45%）
  const difficultMatchups = useMemo(() => {
    return matchupResults.filter(m => m.mwe >= 35 && m.mwe < 45)
      .sort((a, b) => a.mwe - b.mwe)
  }, [matchupResults])

  // 有利マッチアップ（55%以上）
  const favorableMatchups = useMemo(() => {
    return matchupResults.filter(m => m.mwe >= 55)
      .sort((a, b) => b.mwe - a.mwe)
  }, [matchupResults])

  // サイドボードカードの汎用性スコア計算
  const sideboardVersatility = useMemo(() => {
    if (!deck) return []

    return deck.sideboard.map(card => {
      // タグに基づく汎用性計算
      let versatility = 0
      let effectiveAgainst: string[] = []

      card.tags.forEach(tag => {
        const targets = TAG_TARGETS[tag] || []
        effectiveAgainst.push(...targets)

        // メタデッキの中で効果的なデッキをカウント
        const relevantDecks = metaDecks.filter(meta =>
          targets.some(t => meta.name.toLowerCase().includes(t.toLowerCase()) ||
            meta.archetype.toLowerCase().includes(t.toLowerCase()))
        )
        versatility += relevantDecks.reduce((sum, d) => sum + d.metaShare, 0)
      })

      // タグがない場合はデフォルトの汎用性
      if (card.tags.length === 0) {
        versatility = 20 // ベースライン
      }

      return {
        card,
        versatilityScore: Math.min(100, versatility),
        effectiveAgainst: [...new Set(effectiveAgainst)],
        metaRelevance: versatility > 30 ? 'high' : versatility > 15 ? 'medium' : 'low',
      }
    }).sort((a, b) => b.versatilityScore - a.versatilityScore)
  }, [deck, metaDecks])

  // メタゲームポジション分析
  const metaPosition = useMemo(() => {
    if (matchupResults.length === 0) return null

    const avgMwe = matchupResults.reduce((sum, m) => sum + m.mwe, 0) / matchupResults.length
    const weightedMwe = matchupResults.reduce((sum, m) =>
      sum + m.mwe * (m.opponentDeck.metaShare / 100), 0)

    // メタシェア上位5デッキに対する勝率
    const top5Decks = [...metaDecks].sort((a, b) => b.metaShare - a.metaShare).slice(0, 5)
    const top5Mwe = matchupResults
      .filter(m => top5Decks.some(d => d.id === m.opponentDeck.id))
      .reduce((sum, m) => sum + m.mwe, 0) / Math.max(1, matchupResults.filter(m =>
        top5Decks.some(d => d.id === m.opponentDeck.id)).length)

    return {
      avgMwe,
      weightedMwe,
      top5Mwe,
      killerCount: killerMatchups.length,
      favorableCount: favorableMatchups.length,
      position: weightedMwe >= 55 ? 'Tier 1' :
        weightedMwe >= 50 ? 'Tier 2' :
          weightedMwe >= 45 ? 'Tier 3' : 'Tier 4+',
      recommendation: weightedMwe >= 55 ? '現在のメタに非常にマッチしています' :
        weightedMwe >= 50 ? 'メタに適しています。微調整で更に改善可能' :
          weightedMwe >= 45 ? 'メタに対してやや不利。サイドボードの見直しを推奨' :
            'メタに対して厳しい状況。デッキ選択の見直しを推奨',
    }
  }, [matchupResults, metaDecks, killerMatchups, favorableMatchups])

  if (!deck) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            デッキを構築してからリスク分析を確認してください
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* キラーデッキ警告 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            キラーデッキ警告
          </CardTitle>
          <CardDescription>
            勝率35%未満の危険なマッチアップ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {killerMatchups.length === 0 ? (
            <div className="text-center py-6 text-green-600">
              <p className="text-lg font-semibold">キラーデッキは検出されませんでした</p>
              <p className="text-sm text-muted-foreground">
                全てのマッチアップで35%以上の勝率を維持しています
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">
                  {killerMatchups.length}個のキラーマッチアップが検出されました
                </p>
                <p className="text-sm text-red-600 mt-1">
                  これらのデッキに対して特別な対策が必要です
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {killerMatchups.map(matchup => (
                  <div key={matchup.opponentDeck.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{matchup.opponentDeck.name}</p>
                        <Badge variant="outline">{matchup.opponentDeck.archetype}</Badge>
                      </div>
                      <Badge className="bg-red-500 text-white">
                        {matchup.mwe.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={matchup.mwe} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      メタシェア: {matchup.opponentDeck.metaShare.toFixed(1)}%
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      推奨: サイドボードで{matchup.opponentDeck.archetype}対策を増量
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* メタゲームポジション */}
      <Card>
        <CardHeader>
          <CardTitle>メタゲームポジション</CardTitle>
          <CardDescription>
            現在のメタゲームでの立ち位置
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metaPosition ? (
            <div className="space-y-4">
              {/* ティア表示 */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg">
                <p className="text-sm text-muted-foreground">現在のポジション</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {metaPosition.position}
                </p>
              </div>

              {/* 詳細スコア */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 border rounded text-center">
                  <p className="text-xs text-muted-foreground">平均MWE</p>
                  <p className="text-xl font-bold">{metaPosition.avgMwe.toFixed(1)}%</p>
                </div>
                <div className="p-3 border rounded text-center bg-blue-50">
                  <p className="text-xs text-muted-foreground">加重MWE</p>
                  <p className="text-xl font-bold">{metaPosition.weightedMwe.toFixed(1)}%</p>
                </div>
                <div className="p-3 border rounded text-center">
                  <p className="text-xs text-muted-foreground">Top5対戦</p>
                  <p className="text-xl font-bold">{metaPosition.top5Mwe.toFixed(1)}%</p>
                </div>
              </div>

              {/* マッチアップ分布 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">有利 (55%+)</span>
                  <span className="font-bold">{metaPosition.favorableCount}個</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">キラー (&lt;35%)</span>
                  <span className="font-bold">{metaPosition.killerCount}個</span>
                </div>
              </div>

              {/* 推奨アクション */}
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium">推奨アクション</p>
                <p className="text-sm text-muted-foreground">{metaPosition.recommendation}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              シミュレーションを実行してください
            </p>
          )}
        </CardContent>
      </Card>

      {/* サイドボード汎用性スコア */}
      <Card>
        <CardHeader>
          <CardTitle>サイドボード汎用性分析</CardTitle>
          <CardDescription>
            各カードのメタゲームでの有効性
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deck.sideboard.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              サイドボードにカードを追加してください
            </p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {sideboardVersatility.map(({ card, versatilityScore, effectiveAgainst, metaRelevance }) => (
                <div key={card.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{card.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {card.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {card.tags.length === 0 && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            タグなし
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        metaRelevance === 'high' ? 'bg-green-500' :
                          metaRelevance === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                      }>
                        {versatilityScore.toFixed(0)}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        x{card.quantity}
                      </p>
                    </div>
                  </div>
                  <Progress value={versatilityScore} className="h-1.5 mb-2" />
                  {effectiveAgainst.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      有効: {effectiveAgainst.slice(0, 3).join(', ')}
                      {effectiveAgainst.length > 3 && ` +${effectiveAgainst.length - 3}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* マッチアップ分布 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>マッチアップ分布</CardTitle>
          <CardDescription>
            勝率別のマッチアップ分類
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 有利マッチアップ */}
            <div>
              <h4 className="font-semibold mb-3 text-green-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                有利 (55%+)
              </h4>
              <div className="space-y-2">
                {favorableMatchups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">なし</p>
                ) : (
                  favorableMatchups.slice(0, 5).map(m => (
                    <div key={m.opponentDeck.id} className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <div className="flex justify-between">
                        <span>{m.opponentDeck.name}</span>
                        <Badge className="bg-green-500">{m.mwe.toFixed(1)}%</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 互角マッチアップ */}
            <div>
              <h4 className="font-semibold mb-3 text-yellow-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                互角 (45-55%)
              </h4>
              <div className="space-y-2">
                {matchupResults.filter(m => m.mwe >= 45 && m.mwe < 55).length === 0 ? (
                  <p className="text-sm text-muted-foreground">なし</p>
                ) : (
                  matchupResults.filter(m => m.mwe >= 45 && m.mwe < 55).slice(0, 5).map(m => (
                    <div key={m.opponentDeck.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <div className="flex justify-between">
                        <span>{m.opponentDeck.name}</span>
                        <Badge className="bg-yellow-500">{m.mwe.toFixed(1)}%</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 不利マッチアップ */}
            <div>
              <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                不利 (&lt;45%)
              </h4>
              <div className="space-y-2">
                {[...killerMatchups, ...difficultMatchups].length === 0 ? (
                  <p className="text-sm text-muted-foreground">なし</p>
                ) : (
                  [...killerMatchups, ...difficultMatchups].slice(0, 5).map(m => (
                    <div key={m.opponentDeck.id} className={`p-2 border rounded text-sm ${m.mwe < 35 ? 'bg-red-100 border-red-300' : 'bg-red-50 border-red-200'
                      }`}>
                      <div className="flex justify-between">
                        <span>{m.opponentDeck.name}</span>
                        <Badge className={m.mwe < 35 ? 'bg-red-600' : 'bg-red-400'}>
                          {m.mwe.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
