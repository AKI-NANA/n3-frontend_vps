/**
 * AI Analysis Tab
 * AI自動分析・トレンド予測
 */

'use client'

import { useState } from 'react'
import { Brain, TrendingUp, Lightbulb, Sparkles, AlertCircle, Play, FileText, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

interface AIProposal {
  id: string
  type: 'trend' | 'niche' | 'seasonal' | 'competitor'
  title: string
  description: string
  confidence: number
  potentialProfit: string
  riskLevel: 'low' | 'medium' | 'high'
  recommendations: string[]
}

export default function AIAnalysisTab() {
  const [proposals, setProposals] = useState<AIProposal[]>([])
  const [loading, setLoading] = useState(false)
  const [analysisType, setAnalysisType] = useState('trend')
  const [inputData, setInputData] = useState('')
  const [progress, setProgress] = useState(0)

  const handleAnalysis = async () => {
    setLoading(true)
    setProgress(0)

    // プログレスシミュレーション
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      const response = await fetch('/api/research-table/ai-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: analysisType,
          data: inputData,
          model: 'claude-3'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setProposals(data.proposals || [
          // ダミーデータ
          {
            id: '1',
            type: 'trend',
            title: 'ワイヤレスイヤホン市場の急成長',
            description: 'リモートワーク増加により、ノイズキャンセリング機能付きワイヤレスイヤホンの需要が継続的に増加',
            confidence: 85,
            potentialProfit: '35-45%',
            riskLevel: 'low',
            recommendations: [
              'Apple AirPods Pro互換品を重点的にリサーチ',
              '価格帯$50-150の商品に注力',
              '充電ケース付きモデルを優先'
            ]
          },
          {
            id: '2',
            type: 'niche',
            title: 'ペット用スマートデバイス',
            description: 'GPSトラッカー、自動給餌器などのペット用IoTデバイスが急成長中',
            confidence: 72,
            potentialProfit: '40-55%',
            riskLevel: 'medium',
            recommendations: [
              '小型犬・猫用製品に特化',
              'アプリ連携機能は必須',
              '防水機能付きを優先'
            ]
          }
        ])
      }
    } catch (error) {
      console.error('AI analysis error:', error)
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 500)
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge variant="success">低リスク</Badge>
      case 'medium':
        return <Badge variant="warning">中リスク</Badge>
      case 'high':
        return <Badge variant="destructive">高リスク</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* AI設定 */}
      <Card>
        <CardHeader>
          <CardTitle>AI分析設定</CardTitle>
          <CardDescription>
            Claude/Gemini APIを使用した高度な市場分析
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 分析タイプ */}
          <div>
            <Label>分析タイプ</Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trend">トレンド予測</SelectItem>
                <SelectItem value="niche">ニッチ市場発見</SelectItem>
                <SelectItem value="seasonal">季節商品分析</SelectItem>
                <SelectItem value="competitor">競合分析</SelectItem>
                <SelectItem value="pricing">価格戦略提案</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* データ入力 */}
          <div>
            <Label>分析対象データ（オプション）</Label>
            <Textarea
              placeholder="特定のカテゴリ、ASIN、キーワードなどを入力..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="h-24"
            />
          </div>

          {/* 実行ボタン */}
          <Button
            onClick={handleAnalysis}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                分析中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI分析開始
              </>
            )}
          </Button>

          {/* プログレスバー */}
          {loading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-center text-muted-foreground">
                AIがデータを分析しています...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI提案結果 */}
      {proposals.length > 0 && (
        <div className="space-y-4">
          {proposals.map(proposal => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {proposal.type === 'trend' && <TrendingUp className="w-5 h-5" />}
                      {proposal.type === 'niche' && <Lightbulb className="w-5 h-5" />}
                      {proposal.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {proposal.description}
                    </CardDescription>
                  </div>
                  {getRiskBadge(proposal.riskLevel)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">確信度</p>
                    <div className="flex items-center gap-2">
                      <Progress value={proposal.confidence} className="flex-1" />
                      <span className="text-sm font-bold">{proposal.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">想定利益率</p>
                    <p className="text-lg font-bold text-green-600">{proposal.potentialProfit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">リスクレベル</p>
                    <p className="text-lg font-bold">{proposal.riskLevel}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">推奨アクション:</p>
                  <ul className="space-y-1">
                    {proposal.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ヘルプ */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>AI分析の活用方法</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>トレンド予測: 今後3-6ヶ月の市場動向を予測</li>
            <li>ニッチ市場: 競合が少ない高利益商品を発見</li>
            <li>季節分析: 季節商品の最適な仕入れ時期を提案</li>
            <li>価格戦略: 競合と差別化できる価格設定を提案</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
