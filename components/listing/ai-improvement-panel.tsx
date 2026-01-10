/**
 * AI改善提案パネル
 *
 * Gemini Vision画像分析結果とAI改善提案を表示
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  FileText,
  DollarSign,
  Search,
  TrendingUp,
  Loader2,
  RefreshCw,
  ChevronRight,
  Lightbulb,
  Camera,
  Eye,
} from 'lucide-react';
import type { HealthScoreResult, AIImprovement, VisionAnalysisResult } from '@/lib/services/ai/health-score-service';

interface AIImprovementPanelProps {
  productId: string;
  productTitle?: string;
  primaryImage?: string;
  onApplyImprovement?: (improvement: AIImprovement) => void;
}

const PRIORITY_CONFIG = {
  critical: { label: '緊急', color: 'bg-red-500', icon: AlertTriangle },
  high: { label: '高', color: 'bg-orange-500', icon: AlertTriangle },
  medium: { label: '中', color: 'bg-yellow-500', icon: TrendingUp },
  low: { label: '低', color: 'bg-blue-500', icon: Lightbulb },
};

const CATEGORY_CONFIG = {
  image: { label: '画像', icon: ImageIcon, color: 'text-purple-600' },
  title: { label: 'タイトル', icon: FileText, color: 'text-blue-600' },
  description: { label: '説明文', icon: FileText, color: 'text-green-600' },
  price: { label: '価格', icon: DollarSign, color: 'text-orange-600' },
  seo: { label: 'SEO', icon: Search, color: 'text-pink-600' },
  category: { label: 'カテゴリ', icon: TrendingUp, color: 'text-indigo-600' },
};

export function AIImprovementPanel({
  productId,
  productTitle,
  primaryImage,
  onApplyImprovement,
}: AIImprovementPanelProps) {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [healthScore, setHealthScore] = useState<HealthScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHealthScore();
  }, [productId]);

  const loadHealthScore = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}/health-score`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setHealthScore(data);
    } catch (err: any) {
      console.error('Health score load error:', err);
      setError(err.message || 'スコアの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}/analyze`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setHealthScore(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || '分析に失敗しました');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">分析中...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">エラー</h4>
              <p className="text-sm text-red-800 mt-1">{error}</p>
              <Button variant="outline" size="sm" onClick={loadHealthScore} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-1" />
                再試行
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI改善提案
          </CardTitle>
          <CardDescription>商品を分析して改善提案を取得します</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Gemini Visionで分析開始
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 総合スコア */}
      <Card className="border-t-4 border-t-purple-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI品質スコア
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              再分析
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 総合スコア */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(healthScore.overallScore)}`}>
              {healthScore.overallScore}
            </div>
            <p className="text-sm text-muted-foreground mt-1">総合スコア / 100</p>
            <Progress
              value={healthScore.overallScore}
              className="mt-4"
              indicatorClassName={getScoreBgColor(healthScore.overallScore)}
            />
          </div>

          {/* スコア内訳 */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {Object.entries(healthScore.breakdown).map(([key, score]) => {
              const labels: Record<string, string> = {
                imageQuality: '画像品質',
                titleQuality: 'タイトル',
                descriptionQuality: '説明文',
                pricingStrategy: '価格戦略',
                seoOptimization: 'SEO',
              };

              return (
                <div key={key} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-medium">{labels[key]}</span>
                  <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* タブ: 改善提案 / Vision分析 */}
      <Tabs defaultValue="improvements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="improvements">
            改善提案 ({healthScore.improvements.length})
          </TabsTrigger>
          <TabsTrigger value="vision" disabled={!healthScore.visionAnalysis}>
            <Eye className="h-4 w-4 mr-1" />
            画像分析
          </TabsTrigger>
        </TabsList>

        {/* 改善提案タブ */}
        <TabsContent value="improvements" className="space-y-3">
          <ScrollArea className="h-[500px] pr-4">
            {healthScore.improvements.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-green-900">完璧です！</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    改善提案はありません
                  </p>
                </CardContent>
              </Card>
            ) : (
              healthScore.improvements.map((improvement, index) => {
                const priorityConfig = PRIORITY_CONFIG[improvement.priority];
                const categoryConfig = CATEGORY_CONFIG[improvement.category];
                const PriorityIcon = priorityConfig.icon;
                const CategoryIcon = categoryConfig.icon;

                return (
                  <Card key={index} className="mb-3">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <PriorityIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={priorityConfig.color}>
                                {priorityConfig.label}優先度
                              </Badge>
                              <Badge variant="outline" className={categoryConfig.color}>
                                <CategoryIcon className="h-3 w-3 mr-1" />
                                {categoryConfig.label}
                              </Badge>
                            </div>
                            <CardTitle className="text-base">{improvement.issue}</CardTitle>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h5 className="text-sm font-semibold text-green-700 mb-1 flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          改善提案
                        </h5>
                        <p className="text-sm">{improvement.suggestion}</p>
                      </div>

                      {improvement.example && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                          <h5 className="text-sm font-semibold text-blue-700 mb-1">具体例</h5>
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            {improvement.example}
                          </p>
                        </div>
                      )}

                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded">
                        <h5 className="text-sm font-semibold text-purple-700 mb-1 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          期待効果
                        </h5>
                        <p className="text-sm text-purple-900 dark:text-purple-100">
                          {improvement.impact}
                        </p>
                      </div>

                      {onApplyImprovement && (
                        <Button
                          onClick={() => onApplyImprovement(improvement)}
                          className="w-full"
                          variant="outline"
                        >
                          <ChevronRight className="h-4 w-4 mr-1" />
                          この提案を適用
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </ScrollArea>
        </TabsContent>

        {/* Vision分析タブ */}
        <TabsContent value="vision">
          {healthScore.visionAnalysis && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {/* 画像プレビュー */}
                {primaryImage && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">分析対象画像</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={primaryImage}
                        alt="Product"
                        className="w-full h-auto rounded border"
                      />
                    </CardContent>
                  </Card>
                )}

                {/* 商品識別 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">商品識別</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">カテゴリ:</span>{' '}
                        {healthScore.visionAnalysis.productIdentification.category}
                      </div>
                      {healthScore.visionAnalysis.productIdentification.brand && (
                        <div>
                          <span className="font-medium">ブランド:</span>{' '}
                          {healthScore.visionAnalysis.productIdentification.brand}
                        </div>
                      )}
                      {healthScore.visionAnalysis.productIdentification.model && (
                        <div>
                          <span className="font-medium">モデル:</span>{' '}
                          {healthScore.visionAnalysis.productIdentification.model}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">状態:</span>{' '}
                        <Badge variant="outline">
                          {healthScore.visionAnalysis.productIdentification.condition}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 画像品質評価 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">画像品質評価</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">プロフェッショナルグレード</span>
                        <span className={`text-lg font-bold ${getScoreColor(healthScore.visionAnalysis.imageQuality.professionalGrade)}`}>
                          {healthScore.visionAnalysis.imageQuality.professionalGrade}
                        </span>
                      </div>
                      <Progress
                        value={healthScore.visionAnalysis.imageQuality.professionalGrade}
                        className="h-2"
                        indicatorClassName={getScoreBgColor(healthScore.visionAnalysis.imageQuality.professionalGrade)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">解像度:</span>{' '}
                        <Badge variant="outline">{healthScore.visionAnalysis.imageQuality.resolution}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">照明:</span>{' '}
                        <Badge variant="outline">{healthScore.visionAnalysis.imageQuality.lighting}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">背景:</span>{' '}
                        <Badge variant="outline">{healthScore.visionAnalysis.imageQuality.background}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">アングル:</span>{' '}
                        <Badge variant="outline">{healthScore.visionAnalysis.imageQuality.angle}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 検出された特徴 */}
                {healthScore.visionAnalysis.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">検出された特徴</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {healthScore.visionAnalysis.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* 検出された問題 */}
                {healthScore.visionAnalysis.issues.length > 0 && (
                  <Card className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-sm text-orange-700">検出された問題</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {healthScore.visionAnalysis.issues.map((issue, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* 改善推奨事項 */}
                {healthScore.visionAnalysis.recommendations.length > 0 && (
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-sm text-green-700">改善推奨事項</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {healthScore.visionAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
