/**
 * デッキ構築支援パネル
 *
 * 機能：
 * - カード追加・削除
 * - マリガン率（安定性）のリアルタイム計算
 * - シナジースコアの計算
 * - カード機能タグの管理
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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

interface DeckBuilderPanelProps {
  deck: DeckList | null
  onDeckUpdate: (deck: DeckList) => void
  format: string
}

// 機能タグ一覧
const CARD_TAGS = [
  '墓地対策', 'エンチャント対策', 'アーティファクト対策', 'クリーチャー除去',
  'カウンター', 'ドロー', 'マナ加速', 'ディスカード', 'ライフゲイン',
  'パーマネント除去', 'プレインズウォーカー対策', '全体除去', 'スイーパー',
  '追放効果', 'アドバンテージ源', 'フィニッシャー', 'コンボパーツ',
  '軽量クリーチャー', '中堅クリーチャー', '大型クリーチャー', '飛行',
  '到達', 'トランプル', '絆魂', '速攻', '警戒', '先制攻撃', '二段攻撃',
  '接死', '呪禁', '護法', '破壊不能'
]

// アーキタイプ一覧
const ARCHETYPES = [
  { value: 'aggro', label: 'アグロ' },
  { value: 'midrange', label: 'ミッドレンジ' },
  { value: 'control', label: 'コントロール' },
  { value: 'combo', label: 'コンボ' },
  { value: 'ramp', label: 'ランプ' },
  { value: 'tempo', label: 'テンポ' },
]

export function DeckBuilderPanel({ deck, onDeckUpdate, format }: DeckBuilderPanelProps) {
  const [deckName, setDeckName] = useState(deck?.name || '')
  const [archetype, setArchetype] = useState(deck?.archetype || 'midrange')
  const [mainDeckText, setMainDeckText] = useState('')
  const [sideboardText, setSideboardText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [localDeck, setLocalDeck] = useState<DeckList>({
    id: deck?.id || crypto.randomUUID(),
    name: deck?.name || '',
    archetype: deck?.archetype || 'midrange',
    format: format,
    mainDeck: deck?.mainDeck || [],
    sideboard: deck?.sideboard || [],
    stabilityScore: deck?.stabilityScore || 0,
    synergyScore: deck?.synergyScore || 0,
    mulliganRate: deck?.mulliganRate || 0
  })

  // マナカーブ計算
  const manaCurve = useMemo(() => {
    const curve: number[] = [0, 0, 0, 0, 0, 0, 0]
    localDeck.mainDeck.forEach(card => {
      const idx = Math.min(card.cmc, 6)
      curve[idx] += card.quantity
    })
    return curve
  }, [localDeck.mainDeck])

  // 安定性スコア計算
  const calculateStabilityScore = (cards: MTGCard[]): number => {
    if (cards.length === 0) return 0

    const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0)
    const lands = cards.filter(c => c.type.includes('Land')).reduce((sum, c) => sum + c.quantity, 0)
    const landRatio = lands / totalCards

    // 理想的な土地比率（約40%）との差分で評価
    const idealLandRatio = 0.4
    const landScore = 100 - Math.abs(landRatio - idealLandRatio) * 200

    // マナカーブの評価
    const avgCmc = cards.reduce((sum, c) => sum + c.cmc * c.quantity, 0) / totalCards
    const cmcScore = avgCmc <= 3 ? 100 : Math.max(0, 100 - (avgCmc - 3) * 20)

    return Math.max(0, Math.min(100, (landScore + cmcScore) / 2))
  }

  // シナジースコア計算
  const calculateSynergyScore = (cards: MTGCard[]): number => {
    if (cards.length === 0) return 0

    // タグの重複度でシナジーを評価
    const tagCounts: Record<string, number> = {}
    cards.forEach(card => {
      card.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + card.quantity
      })
    })

    const synergisticTags = Object.values(tagCounts).filter(count => count >= 4).length
    return Math.min(100, synergisticTags * 15)
  }

  // マリガン率計算
  const calculateMulliganRate = (cards: MTGCard[]): number => {
    const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0)
    if (totalCards < 60) return 50

    const lands = cards.filter(c => c.type.includes('Land')).reduce((sum, c) => sum + c.quantity, 0)

    // 簡略化されたマリガン率計算
    // 土地が24枚前後で最適（約25%のマリガン率）
    const idealLands = 24
    const deviation = Math.abs(lands - idealLands)
    return Math.min(80, 25 + deviation * 2)
  }

  // デッキ更新時の処理
  useEffect(() => {
    const stabilityScore = calculateStabilityScore(localDeck.mainDeck)
    const synergyScore = calculateSynergyScore(localDeck.mainDeck)
    const mulliganRate = calculateMulliganRate(localDeck.mainDeck)

    const updatedDeck = {
      ...localDeck,
      stabilityScore,
      synergyScore,
      mulliganRate
    }

    setLocalDeck(updatedDeck)
    onDeckUpdate(updatedDeck)
  }, [localDeck.mainDeck, localDeck.sideboard])

  // カード検索
  const searchCards = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/mtg/search-cards?q=${encodeURIComponent(searchQuery)}&format=${format}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.cards || [])
      } else {
        // サンプルカード
        setSearchResults([
          { id: '1', name: searchQuery, manaCost: '{2}{U}', cmc: 3, type: 'Creature', rarity: 'rare', colors: ['U'] },
        ])
      }
    } catch (error) {
      console.error('カード検索エラー:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // デッキリストをテキストから解析
  const parseDeckList = (text: string): MTGCard[] => {
    const lines = text.trim().split('\n')
    const cards: MTGCard[] = []

    lines.forEach(line => {
      const match = line.match(/^(\d+)\s+(.+)$/)
      if (match) {
        const quantity = parseInt(match[1])
        const name = match[2].trim()
        cards.push({
          id: crypto.randomUUID(),
          name,
          manaCost: '',
          cmc: 0,
          type: 'Unknown',
          rarity: 'common',
          colors: [],
          quantity,
          tags: []
        })
      }
    })

    return cards
  }

  // デッキリストをインポート
  const importDeckList = () => {
    const mainDeck = parseDeckList(mainDeckText)
    const sideboard = parseDeckList(sideboardText)

    setLocalDeck(prev => ({
      ...prev,
      name: deckName,
      archetype,
      mainDeck,
      sideboard
    }))
  }

  // カード追加
  const addCard = (card: any, toSideboard: boolean = false) => {
    const newCard: MTGCard = {
      id: crypto.randomUUID(),
      name: card.name,
      manaCost: card.manaCost || card.mana_cost || '',
      cmc: card.cmc || 0,
      type: card.type || card.type_line || 'Unknown',
      rarity: card.rarity || 'common',
      colors: card.colors || [],
      quantity: 1,
      tags: []
    }

    if (toSideboard) {
      setLocalDeck(prev => ({
        ...prev,
        sideboard: [...prev.sideboard, newCard]
      }))
    } else {
      setLocalDeck(prev => ({
        ...prev,
        mainDeck: [...prev.mainDeck, newCard]
      }))
    }
  }

  // カード削除
  const removeCard = (cardId: string, fromSideboard: boolean = false) => {
    if (fromSideboard) {
      setLocalDeck(prev => ({
        ...prev,
        sideboard: prev.sideboard.filter(c => c.id !== cardId)
      }))
    } else {
      setLocalDeck(prev => ({
        ...prev,
        mainDeck: prev.mainDeck.filter(c => c.id !== cardId)
      }))
    }
  }

  // カード枚数変更
  const updateCardQuantity = (cardId: string, quantity: number, inSideboard: boolean = false) => {
    if (quantity < 1) return

    if (inSideboard) {
      setLocalDeck(prev => ({
        ...prev,
        sideboard: prev.sideboard.map(c => c.id === cardId ? { ...c, quantity } : c)
      }))
    } else {
      setLocalDeck(prev => ({
        ...prev,
        mainDeck: prev.mainDeck.map(c => c.id === cardId ? { ...c, quantity } : c)
      }))
    }
  }

  // タグ追加
  const addTag = (cardId: string, tag: string, inSideboard: boolean = false) => {
    const updateFn = (cards: MTGCard[]) =>
      cards.map(c => c.id === cardId && !c.tags.includes(tag)
        ? { ...c, tags: [...c.tags, tag] }
        : c)

    if (inSideboard) {
      setLocalDeck(prev => ({ ...prev, sideboard: updateFn(prev.sideboard) }))
    } else {
      setLocalDeck(prev => ({ ...prev, mainDeck: updateFn(prev.mainDeck) }))
    }
  }

  // タグ削除
  const removeTag = (cardId: string, tag: string, inSideboard: boolean = false) => {
    const updateFn = (cards: MTGCard[]) =>
      cards.map(c => c.id === cardId
        ? { ...c, tags: c.tags.filter(t => t !== tag) }
        : c)

    if (inSideboard) {
      setLocalDeck(prev => ({ ...prev, sideboard: updateFn(prev.sideboard) }))
    } else {
      setLocalDeck(prev => ({ ...prev, mainDeck: updateFn(prev.mainDeck) }))
    }
  }

  const totalMainDeck = localDeck.mainDeck.reduce((sum, c) => sum + c.quantity, 0)
  const totalSideboard = localDeck.sideboard.reduce((sum, c) => sum + c.quantity, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* デッキ情報 */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>デッキ情報</CardTitle>
          <CardDescription>基本設定とインポート</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>デッキ名</Label>
            <Input
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
              placeholder="例: Azorius Control"
            />
          </div>

          <div>
            <Label>アーキタイプ</Label>
            <Select value={archetype} onValueChange={setArchetype}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ARCHETYPES.map(a => (
                  <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>メインデッキ (テキスト入力)</Label>
            <Textarea
              value={mainDeckText}
              onChange={e => setMainDeckText(e.target.value)}
              placeholder="4 Lightning Bolt&#10;4 Monastery Swiftspear&#10;..."
              rows={8}
            />
          </div>

          <div>
            <Label>サイドボード (テキスト入力)</Label>
            <Textarea
              value={sideboardText}
              onChange={e => setSideboardText(e.target.value)}
              placeholder="2 Rest in Peace&#10;3 Mystical Dispute&#10;..."
              rows={4}
            />
          </div>

          <Button onClick={importDeckList} className="w-full">
            デッキリストをインポート
          </Button>

          {/* スコア表示 */}
          <div className="pt-4 space-y-3 border-t">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>安定性スコア</span>
                <span className="font-bold">{localDeck.stabilityScore.toFixed(1)}%</span>
              </div>
              <Progress value={localDeck.stabilityScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>シナジースコア</span>
                <span className="font-bold">{localDeck.synergyScore.toFixed(1)}</span>
              </div>
              <Progress value={localDeck.synergyScore} className="h-2" />
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">予測マリガン率:</span>
              <span className="ml-2 font-bold">{localDeck.mulliganRate.toFixed(1)}%</span>
            </div>
          </div>

          {/* マナカーブ */}
          <div className="pt-4 border-t">
            <Label className="mb-2 block">マナカーブ</Label>
            <div className="flex items-end gap-1 h-20">
              {manaCurve.map((count, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${Math.min(100, count * 5)}%` }}
                  />
                  <span className="text-xs mt-1">{idx === 6 ? '6+' : idx}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* カード検索 */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>カード検索</CardTitle>
          <CardDescription>Scryfall APIでカード検索</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="カード名を入力..."
              onKeyDown={e => e.key === 'Enter' && searchCards()}
            />
            <Button onClick={searchCards} disabled={isSearching}>
              {isSearching ? '...' : '検索'}
            </Button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {searchResults.map(card => (
              <div key={card.id} className="p-2 border rounded hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{card.name}</p>
                    <p className="text-xs text-muted-foreground">{card.manaCost || card.mana_cost}</p>
                    <p className="text-xs text-muted-foreground">{card.type || card.type_line}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => addCard(card, false)}>
                      メイン
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addCard(card, true)}>
                      サイド
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* デッキリスト表示 */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>
            デッキリスト
            <Badge className="ml-2" variant="outline">{totalMainDeck}/60</Badge>
            <Badge className="ml-1" variant="outline">SB: {totalSideboard}/15</Badge>
          </CardTitle>
          <CardDescription>メインデッキとサイドボード</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* メインデッキ */}
            <div>
              <h4 className="font-semibold mb-2">メインデッキ ({totalMainDeck})</h4>
              <div className="space-y-1">
                {localDeck.mainDeck.map(card => (
                  <div key={card.id} className="flex items-center gap-2 p-1 border rounded text-sm">
                    <Input
                      type="number"
                      value={card.quantity}
                      onChange={e => updateCardQuantity(card.id, parseInt(e.target.value) || 1)}
                      className="w-12 h-6 text-center p-1"
                      min={1}
                      max={4}
                    />
                    <span className="flex-1 truncate">{card.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500"
                      onClick={() => removeCard(card.id)}
                    >
                      x
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* サイドボード */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">サイドボード ({totalSideboard})</h4>
              <div className="space-y-1">
                {localDeck.sideboard.map(card => (
                  <div key={card.id} className="flex items-center gap-2 p-1 border rounded text-sm">
                    <Input
                      type="number"
                      value={card.quantity}
                      onChange={e => updateCardQuantity(card.id, parseInt(e.target.value) || 1, true)}
                      className="w-12 h-6 text-center p-1"
                      min={1}
                      max={4}
                    />
                    <span className="flex-1 truncate">{card.name}</span>
                    <div className="flex flex-wrap gap-0.5">
                      {card.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs cursor-pointer"
                          onClick={() => removeTag(card.id, tag, true)}
                        >
                          {tag} x
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500"
                      onClick={() => removeCard(card.id, true)}
                    >
                      x
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* タグ追加セクション */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">カードタグ一覧</h4>
              <p className="text-xs text-muted-foreground mb-2">
                サイドボードカードの役割を明確にするタグ
              </p>
              <div className="flex flex-wrap gap-1">
                {CARD_TAGS.slice(0, 15).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
