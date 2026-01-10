/**
 * 戦略アドバイスコンポーネント
 *
 * 機能：
 * - G1推奨プレイ（ヒューリスティクス）
 * - G2最適サイドボード
 * - G3変形サイドボード（勝ちパターンへのシフト）
 */

'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

interface StrategyAdvisorProps {
  deck: DeckList | null
  matchupResults: MatchupAnalysis[]
  metaDecks: MetaDeck[]
}

// アーキタイプ別ヒューリスティクス
const ARCHETYPE_HEURISTICS: Record<string, {
  g1Priority: string[]
  keyPlays: string[]
  mulliganGuide: string[]
  winCondition: string
}> = {
  aggro: {
    g1Priority: [
      '1ターン目からクリーチャーを展開',
      '相手のライフを早期に削る',
      '除去は最小限、攻撃を優先',
      'ブロッカーは無視してダメージを通す',
    ],
    keyPlays: [
      '先手1ターン目のクリーチャー',
      '速攻クリーチャーの連打',
      '火力呪文でのフィニッシュ',
    ],
    mulliganGuide: [
      '1-2マナのクリーチャーが2枚以上',
      '土地2-3枚',
      '火力呪文があれば理想的',
    ],
    winCondition: '4-5ターン目にライフを削り切る',
  },
  control: {
    g1Priority: [
      '序盤は除去と打ち消しで凌ぐ',
      'カードアドバンテージを稼ぐ',
      '相手のリソースを枯渇させる',
      'フィニッシャーは安全に着地させる',
    ],
    keyPlays: [
      '全体除去のタイミング',
      'カウンターの対象選択',
      'プレインズウォーカーの着地',
    ],
    mulliganGuide: [
      '土地3-4枚',
      '序盤の除去かカウンター',
      'ドローソースがあれば理想的',
    ],
    winCondition: 'リソース差をつけてから安全にフィニッシュ',
  },
  midrange: {
    g1Priority: [
      '効率的なカード交換',
      '質の高いクリーチャーで盤面制圧',
      'アドバンテージを取りながら攻める',
      '相手のプランに応じて攻守切替',
    ],
    keyPlays: [
      '除去とクリーチャー展開のバランス',
      'プレインズウォーカーでアドバンテージ',
      '相手の計算を狂わせるプレイ',
    ],
    mulliganGuide: [
      '土地3枚',
      'マナカーブに沿った展開が可能',
      '除去かアドバンテージ源があれば理想的',
    ],
    winCondition: 'カード質と効率的な交換で勝つ',
  },
  combo: {
    g1Priority: [
      'コンボパーツを集める',
      'ドローと探索を最優先',
      '妨害への対策を準備',
      'コンボ成立を最短ルートで目指す',
    ],
    keyPlays: [
      'コンボパーツの探索',
      'プロテクションの確保',
      'コンボターンの見極め',
    ],
    mulliganGuide: [
      'コンボパーツの一部',
      '探索/ドローソース',
      '適切なマナベース',
    ],
    winCondition: 'コンボを決めて一撃で勝つ',
  },
  ramp: {
    g1Priority: [
      '序盤はマナ加速に集中',
      '大型脅威を早期に展開',
      '全体除去で盤面をリセット',
      'カードアドバンテージ源を活用',
    ],
    keyPlays: [
      '2ターン目のマナ加速',
      '4-5ターン目の大型脅威',
      '全体除去のタイミング',
    ],
    mulliganGuide: [
      '土地3-4枚',
      'マナ加速カード',
      'フィニッシャーか全体除去',
    ],
    winCondition: 'マナアドバンテージから大型脅威を連打',
  },
  tempo: {
    g1Priority: [
      '効率的なクリーチャーで攻撃',
      'バウンスや打ち消しでテンポを取る',
      '相手の計算を狂わせる',
      'ダメージレースを意識',
    ],
    keyPlays: [
      '軽量クリーチャーの早期展開',
      '相手のターンに動く',
      'バウンスでテンポアドバンテージ',
    ],
    mulliganGuide: [
      '軽量クリーチャー',
      '土地2-3枚',
      'インスタント呪文',
    ],
    winCondition: 'テンポアドバンテージを維持して勝ち切る',
  },
}

export function StrategyAdvisor({ deck, matchupResults, metaDecks }: StrategyAdvisorProps) {
  const [selectedOpponent, setSelectedOpponent] = useState<string>('')

  // 選択中のマッチアップ
  const selectedMatchup = useMemo(() => {
    return matchupResults.find(m => m.opponentDeck.id === selectedOpponent) || null
  }, [matchupResults, selectedOpponent])

  // 自デッキのヒューリスティクス
  const deckHeuristics = useMemo(() => {
    const archetype = deck?.archetype || 'midrange'
    return ARCHETYPE_HEURISTICS[archetype] || ARCHETYPE_HEURISTICS.midrange
  }, [deck])

  // 相手アーキタイプに対する戦略調整
  const getMatchupStrategy = (opponentArchetype: string) => {
    const strategies: Record<string, Record<string, string>> = {
      aggro: {
        aggro: 'レース戦。先手が有利。火力を相手クリーチャーに向けず、顔を狙う。',
        control: 'スピード勝負。全体除去の前に勝負を決める。火力は温存してフィニッシュに。',
        midrange: '早期のダメージが重要。除去されにくいクリーチャーを優先。',
        combo: '最速で倒す。相手のコンボより早くゲームを終わらせる。',
        ramp: 'マナ加速を許さない。アグレッシブにライフを詰める。',
        tempo: '似たレースになる。効率の良いカードで差をつける。',
      },
      control: {
        aggro: '序盤を耐える。除去を温存せず使う。全体除去を最優先で狙う。',
        control: 'リソース勝負。カウンター戦に備える。プレインズウォーカーが重要。',
        midrange: '1対1交換を避ける。アドバンテージ源を守る。',
        combo: 'カウンターを温存。コンボパーツを狙って打ち消す。',
        ramp: 'マナ加速を妨害。大型脅威には打ち消しを構える。',
        tempo: '序盤を耐える。全体除去で逆転を狙う。',
      },
      midrange: {
        aggro: '序盤は除去優先。ライフ管理が重要。盤面を取り返す。',
        control: '脅威を途切れさせない。プレッシャーを維持。',
        midrange: 'カード質の勝負。効率的な交換を心がける。',
        combo: '可能なら妨害しつつクロックを刻む。',
        ramp: '中盤の盤面優位を活かす。大型脅威が出る前に勝負。',
        tempo: '効率的な除去でテンポを取り返す。',
      },
      combo: {
        aggro: 'なるべく早くコンボを決める。ライフ管理に注意。',
        control: 'カウンターをケア。複数の脅威でリソースを分散させる。',
        midrange: 'コンボ成立を最優先。妨害は最小限に。',
        combo: '先にコンボを決める。相手のパーツを妨害できれば理想。',
        ramp: 'スピード勝負。大型脅威が出る前にコンボを決める。',
        tempo: 'バウンスをケア。コンボ成立のタイミングを見極める。',
      },
      ramp: {
        aggro: '序盤を耐える。全体除去を最優先。ライフゲインがあれば活用。',
        control: '大型脅威を連打。1枚で対処されない状況を作る。',
        midrange: 'マナ差をつけて大型脅威で圧倒。',
        combo: '可能なら妨害。大型脅威でプレッシャーをかける。',
        ramp: 'より大きな脅威を出す。カードアドバンテージが重要。',
        tempo: '全体除去でリセット。大型脅威を安全に着地。',
      },
      tempo: {
        aggro: 'レース戦。バウンスでテンポを取る。',
        control: 'プレッシャーを維持。カウンターをケアしつつ攻める。',
        midrange: 'テンポで勝負。効率的なカードで差をつける。',
        combo: '妨害しながらクロック。相手のコンボを遅らせる。',
        ramp: 'マナ加速を妨害。早期にダメージを与える。',
        tempo: '似た戦略。カード効率が勝負を分ける。',
      },
    }

    const myArchetype = deck?.archetype || 'midrange'
    return strategies[myArchetype]?.[opponentArchetype] || '状況に応じて柔軟に対応'
  }

  // G3変形戦略の生成
  const getG3TransformStrategy = (matchup: MatchupAnalysis | null) => {
    if (!matchup || !deck) return null

    const myArchetype = deck.archetype
    const oppArchetype = matchup.opponentDeck.archetype

    // アーキタイプの組み合わせに応じた変形戦略
    const transformStrategies: Record<string, Record<string, {
      direction: string
      rationale: string
      targetWinRate: string
    }>> = {
      control: {
        aggro: {
          direction: 'よりアグレッシブなフィニッシャーを増量',
          rationale: '相手が除去を減らした場合に有効。クロックを早める。',
          targetWinRate: '+5-8%',
        },
        control: {
          direction: 'プレインズウォーカー重視にシフト',
          rationale: 'クリーチャー除去が腐る相手にはPWが強い',
          targetWinRate: '+3-5%',
        },
        midrange: {
          direction: 'カウンター増量、全体除去維持',
          rationale: '相手の脅威を個別に対処していく',
          targetWinRate: '+2-4%',
        },
      },
      aggro: {
        control: {
          direction: 'より軽いカーブにシフト、プロテクション追加',
          rationale: '全体除去を意識しつつ最速を目指す',
          targetWinRate: '+4-6%',
        },
        aggro: {
          direction: 'よりバーン重視、ブロッカー対策追加',
          rationale: 'レース戦を制するための調整',
          targetWinRate: '+2-3%',
        },
        midrange: {
          direction: '粘り強さを追加、後半の決定力を維持',
          rationale: '中盤以降のトップデッキ勝負に備える',
          targetWinRate: '+3-5%',
        },
      },
      midrange: {
        aggro: {
          direction: '除去と全体除去を増量',
          rationale: '序盤を耐えてカード質で勝つ',
          targetWinRate: '+5-7%',
        },
        control: {
          direction: 'ディスカードと脅威を増量',
          rationale: 'リソース勝負に持ち込む',
          targetWinRate: '+4-6%',
        },
        combo: {
          direction: '妨害を増量、クロックを維持',
          rationale: 'コンボを遅らせながら倒す',
          targetWinRate: '+6-8%',
        },
      },
    }

    return transformStrategies[myArchetype]?.[oppArchetype] || {
      direction: '状況に応じた微調整',
      rationale: '相手の調整を読んで対応',
      targetWinRate: '+2-4%',
    }
  }

  if (!deck) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            デッキを構築してから戦略アドバイスを確認してください
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 基本戦略（自デッキのアーキタイプに基づく） */}
      <Card>
        <CardHeader>
          <CardTitle>基本戦略ガイド</CardTitle>
          <CardDescription>
            {deck.name || 'あなたのデッキ'} ({ARCHETYPE_HEURISTICS[deck.archetype] ? deck.archetype : 'midrange'})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* G1優先事項 */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Badge className="bg-blue-500">G1</Badge>
                プレボード優先事項
              </h4>
              <ul className="space-y-2">
                {deckHeuristics.g1Priority.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 font-bold">{idx + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* キープレイ */}
            <div>
              <h4 className="font-semibold mb-3">キープレイ</h4>
              <ul className="space-y-2">
                {deckHeuristics.keyPlays.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* マリガンガイド */}
            <div>
              <h4 className="font-semibold mb-3">マリガンガイド</h4>
              <ul className="space-y-2">
                {deckHeuristics.mulliganGuide.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 勝利条件 */}
            <div>
              <h4 className="font-semibold mb-3">勝利条件</h4>
              <p className="p-3 bg-purple-50 border border-purple-200 rounded">
                {deckHeuristics.winCondition}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* マッチアップ別戦略 */}
      <Card>
        <CardHeader>
          <CardTitle>マッチアップ別戦略</CardTitle>
          <CardDescription>
            対戦相手を選択して詳細な戦略を確認
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 対戦相手選択 */}
          <div className="mb-6">
            <Select value={selectedOpponent} onValueChange={setSelectedOpponent}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="対戦相手を選択..." />
              </SelectTrigger>
              <SelectContent>
                {metaDecks.map(meta => (
                  <SelectItem key={meta.id} value={meta.id}>
                    {meta.name} ({meta.archetype}) - {meta.metaShare.toFixed(1)}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMatchup ? (
            <Tabs defaultValue="g1">
              <TabsList className="mb-4">
                <TabsTrigger value="g1">G1 戦略</TabsTrigger>
                <TabsTrigger value="g2">G2 サイドボード</TabsTrigger>
                <TabsTrigger value="g3">G3 変形戦略</TabsTrigger>
              </TabsList>

              {/* G1戦略 */}
              <TabsContent value="g1" className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold mb-2">対{selectedMatchup.opponentDeck.name}のG1戦略</h5>
                  <p className="text-sm">
                    {getMatchupStrategy(selectedMatchup.opponentDeck.archetype)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <p className="text-sm text-muted-foreground">G1期待勝率</p>
                    <p className="text-2xl font-bold">{selectedMatchup.g1Ewr.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="text-sm text-muted-foreground">相手のG1勝率</p>
                    <p className="text-2xl font-bold">{selectedMatchup.opponentDeck.g1WinRate.toFixed(1)}%</p>
                  </div>
                </div>
              </TabsContent>

              {/* G2サイドボード */}
              <TabsContent value="g2" className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-semibold mb-2">G2 標準サイドボードプラン</h5>
                  <p className="text-sm">{selectedMatchup.g2Strategy}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-700 mb-2">IN</h5>
                    <div className="space-y-1">
                      {selectedMatchup.sideboardIn.length > 0 ? (
                        selectedMatchup.sideboardIn.map(card => (
                          <div key={card.id} className="text-sm p-2 bg-green-50 border border-green-200 rounded">
                            +{card.quantity} {card.name}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground p-2">
                          シミュレーション後に表示されます
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-700 mb-2">OUT</h5>
                    <div className="space-y-1">
                      {selectedMatchup.sideboardOut.length > 0 ? (
                        selectedMatchup.sideboardOut.map(card => (
                          <div key={card.id} className="text-sm p-2 bg-red-50 border border-red-200 rounded">
                            -{card.quantity} {card.name}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground p-2">
                          シミュレーション後に表示されます
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* G3変形戦略 */}
              <TabsContent value="g3" className="space-y-4">
                {(() => {
                  const g3Strategy = getG3TransformStrategy(selectedMatchup)
                  return (
                    <>
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                          <Badge className="bg-purple-500">G3変形</Badge>
                          MWE最大化戦略
                        </h5>
                        <p className="text-sm">{selectedMatchup.g3Strategy}</p>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="font-semibold mb-2">変形方向</h5>
                        <p className="text-sm font-medium">{g3Strategy?.direction}</p>
                        <p className="text-sm text-muted-foreground mt-1">{g3Strategy?.rationale}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-green-700">
                            期待勝率向上: {g3Strategy?.targetWinRate}
                          </Badge>
                        </div>
                      </div>

                      {selectedMatchup.g3Transform && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <h5 className="font-semibold mb-2">勝ちパターン</h5>
                          <p className="text-sm">{selectedMatchup.g3Transform.winPattern}</p>
                        </div>
                      )}

                      <div className="p-4 bg-gray-100 rounded-lg text-sm">
                        <h5 className="font-semibold mb-2">G3変形の考え方</h5>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• G2で相手が何をサイドインしたか予測する</li>
                          <li>• 相手のサイドボード後の弱点を突く</li>
                          <li>• 「G2と同じ」ではなく「G3で勝つ」構築を目指す</li>
                          <li>• 10パターンの相手サイドボードを想定してベスト解を探す</li>
                        </ul>
                      </div>
                    </>
                  )
                })()}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              対戦相手を選択してください
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
