"use client";

/**
 * A.3: SEO改善提案パネル
 * 商品編集画面に統合するAIフィードバックコンポーネント
 */

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";

interface SEOSuggestion {
  category: string;
  priority: "high" | "medium" | "low";
  suggestion: string;
  expectedImpact: string;
  actionRequired: string;
}

interface HealthScore {
  overall: number;
  title: number;
  pricing: number;
  engagement: number;
  freshness: number;
  quality: number;
}

interface SEOFeedbackProps {
  listingId?: string;
  sku?: string;
}

export function SEOFeedbackPanel({ listingId, sku }: SEOFeedbackProps) {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [suggestions, setSuggestions] = useState<SEOSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (listingId || sku) {
      fetchSEOFeedback();
    }
  }, [listingId, sku]);

  const fetchSEOFeedback = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際のAPI呼び出し
      // const response = await fetch(`/api/seo/analyze?sku=${sku}`);
      // const data = await response.json();

      // モックデータ
      setHealthScore({
        overall: 72,
        title: 65,
        pricing: 85,
        engagement: 60,
        freshness: 80,
        quality: 75,
      });

      setSuggestions([
        {
          category: "title",
          priority: "high",
          suggestion: "タイトルにブランド名とモデル番号を追加",
          expectedImpact: "検索結果での表示回数が30%増加する見込み",
          actionRequired: "タイトルの先頭にブランド名を追加してください",
        },
        {
          category: "images",
          priority: "medium",
          suggestion: "商品画像を5枚以上追加",
          expectedImpact: "コンバージョン率が15%改善する見込み",
          actionRequired: "異なる角度からの商品画像を追加してください",
        },
        {
          category: "description",
          priority: "low",
          suggestion: "商品説明を200文字以上に拡充",
          expectedImpact: "購入意欲が高まる",
          actionRequired: "商品の特徴や使用方法を詳しく記載してください",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch SEO feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  const ScoreBar = ({ label, score }: { label: string; score: number }) => {
    const getColor = (score: number) => {
      if (score >= 80) return "bg-green-500";
      if (score >= 60) return "bg-yellow-500";
      return "bg-red-500";
    };

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="font-medium">{score}/100</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor(score)} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors: Record<string, string> = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    };

    return <Badge variant={colors[priority] as any}>{priority.toUpperCase()}</Badge>;
  };

  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI SEO分析
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 健全性スコア */}
        {healthScore && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">総合スコア</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-3xl font-bold text-purple-600">
                  {healthScore.overall}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreBar label="タイトル" score={healthScore.title} />
              <ScoreBar label="価格設定" score={healthScore.pricing} />
              <ScoreBar label="エンゲージメント" score={healthScore.engagement} />
              <ScoreBar label="鮮度" score={healthScore.freshness} />
              <ScoreBar label="品質" score={healthScore.quality} />
            </div>
          </div>
        )}

        {/* 改善提案 */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            改善提案 ({suggestions.length})
          </h3>

          {suggestions.map((suggestion, index) => (
            <Alert key={index} className="border-l-4 border-l-purple-500">
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{suggestion.suggestion}</p>
                    <PriorityBadge priority={suggestion.priority} />
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 mt-0.5 text-green-600" />
                      <span className="text-green-700">{suggestion.expectedImpact}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                      <span className="text-blue-700">{suggestion.actionRequired}</span>
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2">
          <Button
            onClick={fetchSEOFeedback}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            再分析
          </Button>
          <Button size="sm" className="flex-1">
            詳細を表示
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
