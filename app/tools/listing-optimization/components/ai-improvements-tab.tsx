/**
 * AI改善提案タブコンポーネント
 *
 * listing-editorの機能を統合
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles,
  FileText,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Loader2,
  Lightbulb,
} from 'lucide-react';

interface AIImprovement {
  type: 'title' | 'description' | 'keywords' | 'images';
  original: string;
  suggested: string;
  confidence: number;
  reason: string;
}

interface AIImprovementsTabProps {
  productId?: string;
  onApply?: (improvement: AIImprovement) => void;
  onReject?: (improvement: AIImprovement) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'title':
      return <FileText className="w-5 h-5 text-blue-600" />;
    case 'description':
      return <FileText className="w-5 h-5 text-green-600" />;
    case 'keywords':
      return <TrendingUp className="w-5 h-5 text-orange-600" />;
    case 'images':
      return <ImageIcon className="w-5 h-5 text-purple-600" />;
    default:
      return <Sparkles className="w-5 h-5 text-purple-600" />;
  }
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'title':
      return 'タイトル改善';
    case 'description':
      return '説明文改善';
    case 'keywords':
      return 'キーワード最適化';
    case 'images':
      return '画像改善';
    default:
      return 'その他';
  }
};

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'text-green-600';
  if (confidence >= 70) return 'text-yellow-600';
  return 'text-orange-600';
};

const getConfidenceBadge = (confidence: number) => {
  if (confidence >= 90) return <Badge className="bg-green-500">高信頼度</Badge>;
  if (confidence >= 70) return <Badge className="bg-yellow-500">中信頼度</Badge>;
  return <Badge className="bg-orange-500">要確認</Badge>;
};

export function AIImprovementsTab({
  productId,
  onApply,
  onReject,
}: AIImprovementsTabProps) {
  const [improvements, setImprovements] = useState<AIImprovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (productId) {
      loadImprovements();
    }
  }, [productId]);

  const loadImprovements = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/ai-suggestions?product_id=${productId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.suggestions) {
          // AIサジェスションをAIImprovement形式に変換
          const converted: AIImprovement[] = data.suggestions.map((s: any) => ({
            type: s.suggestion_type || 'title',
            original: s.original_value || '',
            suggested: s.suggested_value || '',
            confidence: s.confidence || 80,
            reason: s.reason || 'AI分析による提案',
          }));
          setImprovements(converted);
        }
      }
    } catch (error) {
      console.error('Failed to load improvements:', error);
      // デモ用のサンプルデータ
      setImprovements([
        {
          type: 'title',
          original: '商品タイトル',
          suggested: 'SEO最適化された商品タイトル - ブランド名 | 特徴キーワード',
          confidence: 95,
          reason: 'SEO最適化: ブランド名、特徴を含めることで検索順位が向上します',
        },
        {
          type: 'description',
          original: '商品説明',
          suggested: '詳細な商品説明：\n- 特徴1\n- 特徴2\n- 商品状態\n- 付属品情報',
          confidence: 88,
          reason: '詳細な説明により、購入者の信頼性とSEOスコアが向上します',
        },
        {
          type: 'keywords',
          original: 'keyword1',
          suggested: 'keyword1, keyword2, keyword3, ロングテールキーワード',
          confidence: 92,
          reason: 'ロングテールキーワードでニッチな検索ボリュームを獲得',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (improvement: AIImprovement, index: number) => {
    setAppliedIds(prev => new Set([...prev, index]));
    onApply?.(improvement);
  };

  const handleReject = (improvement: AIImprovement, index: number) => {
    setRejectedIds(prev => new Set([...prev, index]));
    onReject?.(improvement);
  };

  if (!productId) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold">商品を選択してください</p>
          <p className="text-sm text-muted-foreground mt-1">
            左のリストから商品を選択すると、AI改善提案が表示されます
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg font-semibold">AI改善提案を読み込み中...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI改善提案
        </CardTitle>
        <CardDescription>
          タイトル、説明文、キーワードの改善提案を確認・適用
        </CardDescription>
      </CardHeader>
      <CardContent>
        {improvements.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-green-900 dark:text-green-100">改善提案はありません</p>
            <p className="text-sm text-muted-foreground mt-1">
              この商品は十分に最適化されています
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {improvements.map((improvement, index) => {
                const isApplied = appliedIds.has(index);
                const isRejected = rejectedIds.has(index);

                return (
                  <Card
                    key={index}
                    className={`border ${
                      isApplied
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                        : isRejected
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20 opacity-50'
                          : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(improvement.type)}
                          <CardTitle className="text-base">{getTypeLabel(improvement.type)}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getConfidenceBadge(improvement.confidence)}
                          <span className={`text-sm font-medium ${getConfidenceColor(improvement.confidence)}`}>
                            {improvement.confidence}%
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* 現在の値 */}
                      <div>
                        <label className="text-xs font-medium text-slate-500 uppercase">現在</label>
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-sm line-through text-slate-500">
                          {improvement.original || '(なし)'}
                        </div>
                      </div>

                      {/* 提案値 */}
                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI提案
                        </label>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded text-sm whitespace-pre-wrap">
                          {improvement.suggested}
                        </div>
                      </div>

                      {/* 理由 */}
                      <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">{improvement.reason}</p>
                      </div>

                      {/* アクションボタン */}
                      {!isApplied && !isRejected && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApply(improvement, index)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            この提案を適用
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReject(improvement, index)}
                            className="text-slate-600"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            却下
                          </Button>
                        </div>
                      )}

                      {/* 適用済み表示 */}
                      {isApplied && (
                        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                          <CheckCircle className="w-5 h-5" />
                          適用済み
                        </div>
                      )}

                      {/* 却下済み表示 */}
                      {isRejected && (
                        <div className="flex items-center justify-center gap-2 text-red-600 font-medium">
                          <XCircle className="w-5 h-5" />
                          却下済み
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
