'use client'

/**
 * UI-5: AI改善提案の最終統合
 * 自動購入承認UIにAIリスク分析を統合
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Shield, Target } from 'lucide-react'

export interface RiskAnalysis {
  overallScore: number // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  factors: {
    name: string
    score: number
    impact: 'positive' | 'negative' | 'neutral'
    description: string
  }[]
  recommendations: {
    category: string
    suggestion: string
    priority: 'low' | 'medium' | 'high'
    estimatedImpact: string
  }[]
  confidence: number // AI分析の信頼度 0-1
}

interface RiskAnalysisPanelProps {
  analysis: RiskAnalysis
  productId?: string
}

export function RiskAnalysisPanel({ analysis, productId }: RiskAnalysisPanelProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-600'
      case 'medium':
        return 'bg-yellow-600'
      case 'high':
        return 'bg-orange-600'
      case 'critical':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="text-green-600" size={24} />
      case 'medium':
      case 'high':
        return <AlertTriangle className="text-yellow-600" size={24} />
      case 'critical':
        return <AlertTriangle className="text-red-600" size={24} />
      default:
        return <Shield className="text-gray-600" size={24} />
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="text-green-600" size={16} />
      case 'negative':
        return <TrendingDown className="text-red-600" size={16} />
      default:
        return <Target className="text-gray-600" size={16} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600'
      case 'medium':
        return 'bg-yellow-600'
      case 'low':
        return 'bg-blue-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div className="space-y-4">
      {/* Overall Risk Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getRiskIcon(analysis.riskLevel)}
              <div>
                <CardTitle>AIリスク分析</CardTitle>
                <CardDescription>
                  信頼度: {(analysis.confidence * 100).toFixed(0)}%
                </CardDescription>
              </div>
            </div>
            <Badge className={getRiskColor(analysis.riskLevel)}>
              {analysis.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">総合スコア</span>
              <span className="text-2xl font-bold">{analysis.overallScore}/100</span>
            </div>
            <Progress value={analysis.overallScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">リスク要因分析</CardTitle>
          <CardDescription>各要因の詳細評価</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.factors.map((factor, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getImpactIcon(factor.impact)}
                    <span className="font-medium text-sm">{factor.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{factor.score}/100</span>
                </div>
                <Progress value={factor.score} className="h-1 mb-2" />
                <p className="text-xs text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI推奨戦略</CardTitle>
          <CardDescription>リスク軽減とパフォーマンス向上のための提案</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getPriorityColor(rec.priority)} variant="outline">
                        {rec.priority.toUpperCase()}
                      </Badge>
                      <span className="font-semibold text-sm">{rec.category}</span>
                    </div>
                    <p className="text-sm text-gray-700">{rec.suggestion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="text-xs text-gray-600">
                    推定効果: {rec.estimatedImpact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * サンプルデータ生成関数（実際のAI分析APIに置き換え）
 */
export function generateMockRiskAnalysis(productData: any): RiskAnalysis {
  const baseScore = 65 + Math.random() * 30

  return {
    overallScore: Math.round(baseScore),
    riskLevel: baseScore > 80 ? 'low' : baseScore > 60 ? 'medium' : 'high',
    factors: [
      {
        name: '価格競争力',
        score: Math.round(70 + Math.random() * 30),
        impact: 'positive',
        description: '市場価格と比較して競争力のある価格設定です'
      },
      {
        name: '在庫リスク',
        score: Math.round(50 + Math.random() * 30),
        impact: 'neutral',
        description: '在庫回転率は適正範囲内ですが、改善の余地があります'
      },
      {
        name: 'VERO侵害リスク',
        score: Math.round(80 + Math.random() * 20),
        impact: 'positive',
        description: 'VEROリストとのマッチングなし、安全性が高いです'
      },
      {
        name: '利益率',
        score: Math.round(60 + Math.random() * 25),
        impact: 'neutral',
        description: '目標利益率を達成していますが、最適化可能です'
      }
    ],
    recommendations: [
      {
        category: '価格戦略',
        suggestion: '競合の価格変動をモニターし、15%の値下げで売上を30%向上できる可能性があります',
        priority: 'high',
        estimatedImpact: '+30% 売上増加'
      },
      {
        category: '出品最適化',
        suggestion: 'タイトルにキーワード「限定版」を追加することで検索順位が向上します',
        priority: 'medium',
        estimatedImpact: '+15% 表示回数増加'
      },
      {
        category: '在庫管理',
        suggestion: '発注サイクルを2週間から10日に短縮することで在庫コストを削減できます',
        priority: 'low',
        estimatedImpact: '-8% 在庫コスト削減'
      }
    ],
    confidence: 0.87 + Math.random() * 0.13
  }
}
