/**
 * メタゲーム分析コンポーネント
 *
 * 機能：
 * - EWR/MWEシミュレーション
 * - メタデッキとの対戦勝率表示
 * - G1/G2/G3の期待勝率計算
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

interface MetaGameAnalysisProps {
  deck: DeckList | null
  metaDecks: MetaDeck[]
  matchupResults: MatchupAnalysis[]
  onSimulate: () => void
  isSimulating: boolean
}

export function MetaGameAnalysis({
  deck,
  metaDecks,
  matchupResults,
  onSimulate,
  isSimulating
}: MetaGameAnalysisProps) {
  const [selectedMatchup, setSelectedMatchup] = useState<MatchupAnalysis | null>(null)

  // 勝率に応じた色を返す
  const getWinRateColor = (rate: number): string => {
    if (rate >= 55) return 'text-green-600'
    if (rate >= 45) return 'text-yellow-600'
    return 'text-red-600'
  }

  // 勝率に応じたバッジ色を返す
  const getWinRateBadgeClass = (rate: number): string => {
    if (rate >= 55) return 'bg-green-100 text-green-800'
    if (rate >= 45) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  // 平均MWE計算
  const averageMwe = matchupResults.length > 0
    ? matchupResults.reduce((sum, m) => sum + m.mwe, 0) / matchupResults.length
    : 0

  // メタシェア加重平均MWE
  const weightedMwe = matchupResults.length > 0
    ? matchupResults.reduce((sum, m) => sum + m.mwe * (m.opponentDeck.metaShare / 100), 0)
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* メタゲーム概要 */}
      <Card>
        <CardHeader>
          <CardTitle>メタゲーム概要</CardTitle>
          <CardDescription>
            現在のメタデッキ分布とシミュレーション結果
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* シミュレーションボタン */}
          <div className="mb-6">
            <Button
              onClick={onSimulate}
              disabled={!deck || isSimulating}
              className="w-full"
            >
              {isSimulating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  MWEシミュレーション中...
                </>
              ) : (
                'MWEシミュレーション実行'
              )}
            </Button>
            {!deck && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                デッキを構築してからシミュレーションを実行してください
              </p>
            )}
          </div>

          {/* 総合スコア */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">平均MWE</p>
              <p className={`text-3xl font-bold ${getWinRateColor(averageMwe)}`}>
                {averageMwe.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">加重平均MWE</p>
              <p className={`text-3xl font-bold ${getWinRateColor(weightedMwe)}`}>
                {weightedMwe.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">メタシェア考慮</p>
            </div>
          </div>

          {/* メタデッキ一覧 */}
          <h4 className="font-semibold mb-3">メタデッキ分布 (Top 10)</h4>
          <div className="space-y-2">
            {metaDecks.slice(0, 10).map((meta, idx) => {
              const matchup = matchupResults.find(m => m.opponentDeck.id === meta.id)
              return (
                <div
                  key={meta.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMatchup?.opponentDeck.id === meta.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => matchup && setSelectedMatchup(matchup)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-6">#{idx + 1}</span>
                      <div>
                        <p className="font-medium">{meta.name}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{meta.archetype}</Badge>
                          <span>メタシェア: {meta.metaShare.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    {matchup && (
                      <div className="text-right">
                        <Badge className={getWinRateBadgeClass(matchup.mwe)}>
                          MWE: {matchup.mwe.toFixed(1)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  {matchup && (
                    <div className="mt-2">
                      <Progress value={matchup.mwe} className="h-1.5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* マッチアップ詳細 */}
      <Card>
        <CardHeader>
          <CardTitle>マッチアップ詳細</CardTitle>
          <CardDescription>
            各ゲームの期待勝率とサイドボード戦略
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedMatchup ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>左のリストからマッチアップを選択してください</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 対戦相手情報 */}
              <div className="p-4 bg-gray-50 border rounded-lg">
                <h4 className="font-bold text-lg">{selectedMatchup.opponentDeck.name}</h4>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{selectedMatchup.opponentDeck.archetype}</Badge>
                  <Badge variant="outline">
                    メタシェア: {selectedMatchup.opponentDeck.metaShare.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              {/* 各ゲームの勝率 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">G1 EWR</p>
                  <p className={`text-2xl font-bold ${getWinRateColor(selectedMatchup.g1Ewr)}`}>
                    {selectedMatchup.g1Ewr.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">プレボード</p>
                </div>
                <div className="p-4 border rounded-lg text-center bg-blue-50">
                  <p className="text-sm text-muted-foreground mb-1">G2/G3</p>
                  <p className={`text-2xl font-bold ${getWinRateColor((selectedMatchup.mwe * 3 - selectedMatchup.g1Ewr) / 2)}`}>
                    {((selectedMatchup.mwe * 3 - selectedMatchup.g1Ewr) / 2).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">サイド後平均</p>
                </div>
                <div className="p-4 border rounded-lg text-center bg-purple-50">
                  <p className="text-sm text-muted-foreground mb-1">MWE</p>
                  <p className={`text-2xl font-bold ${getWinRateColor(selectedMatchup.mwe)}`}>
                    {selectedMatchup.mwe.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">マッチ勝利期待値</p>
                </div>
              </div>

              {/* 戦略ガイド */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    G2 サイドボード戦略
                  </h5>
                  <p className="text-sm bg-gray-50 p-3 rounded">
                    {selectedMatchup.g2Strategy}
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    G3 変形戦略 (MWE最大化)
                  </h5>
                  <p className="text-sm bg-purple-50 p-3 rounded border border-purple-200">
                    {selectedMatchup.g3Strategy}
                  </p>
                  {selectedMatchup.g3Transform && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm font-medium">勝ちパターン:</p>
                      <p className="text-sm">{selectedMatchup.g3Transform.winPattern}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* サイドボードガイド */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-sm mb-2 text-green-700">IN</h5>
                  <div className="space-y-1">
                    {selectedMatchup.sideboardIn.length > 0 ? (
                      selectedMatchup.sideboardIn.map(card => (
                        <div key={card.id} className="text-sm p-1 bg-green-50 border border-green-200 rounded">
                          +{card.quantity} {card.name}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">サイドボードから追加なし</p>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-sm mb-2 text-red-700">OUT</h5>
                  <div className="space-y-1">
                    {selectedMatchup.sideboardOut.length > 0 ? (
                      selectedMatchup.sideboardOut.map(card => (
                        <div key={card.id} className="text-sm p-1 bg-red-50 border border-red-200 rounded">
                          -{card.quantity} {card.name}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">メインから抜くカードなし</p>
                    )}
                  </div>
                </div>
              </div>

              {/* MWE計算式の説明 */}
              <div className="p-4 bg-gray-100 rounded-lg text-sm">
                <h5 className="font-semibold mb-2">MWE計算式</h5>
                <p className="text-muted-foreground">
                  MWE = P(2-0) + P(2-1) = G1 × G2 + G1 × (1-G2) × G3 + (1-G1) × G2 × G3
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ※ G3変形戦略により、サイド後の勝率を最大化
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
