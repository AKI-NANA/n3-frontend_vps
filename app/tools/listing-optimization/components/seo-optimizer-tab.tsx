/**
 * SEO最適化タブコンポーネント
 *
 * seo-optimizerの機能を統合
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Sparkles, FileText, Tag, Image as ImageIcon } from 'lucide-react';

interface SEOSuggestions {
  suggested_title?: string;
  seo_keywords?: string[];
  title_feedback?: string;
  image_feedback?: string;
}

interface SEOOptimizerTabProps {
  productId?: string;
  currentData: {
    title: string;
    keywords: string[];
    description: string;
  };
  suggestions: SEOSuggestions | null;
  healthScore: number;
  loading?: boolean;
  onAnalyze: () => Promise<void>;
  onApply: (type: 'title' | 'keywords' | 'full') => Promise<void>;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function SEOOptimizerTab({
  productId,
  currentData,
  suggestions,
  healthScore,
  loading = false,
  onAnalyze,
  onApply,
}: SEOOptimizerTabProps) {
  if (!productId) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold">商品を選択してください</p>
          <p className="text-sm text-muted-foreground mt-1">
            左のリストから商品を選択すると、SEO分析が可能になります
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-600" />
              SEO最適化
            </CardTitle>
            <CardDescription>
              Gemini VisionでSEO健全性を分析し、ワンクリック最適化
            </CardDescription>
          </div>
          <Button onClick={onAnalyze} variant="outline" size="sm" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            AI分析
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 現在のスコア */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <span className="text-sm font-medium">SEO健全性スコア</span>
          <span className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
            {healthScore}/100
          </span>
        </div>

        {/* 現在のデータ */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              現在のタイトル
            </label>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded mt-1 text-sm">
              {currentData.title || '未設定'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Tag className="h-4 w-4" />
              現在のキーワード
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {currentData.keywords && currentData.keywords.length > 0 ? (
                currentData.keywords.map((kw, i) => (
                  <Badge key={i} variant="outline">{kw}</Badge>
                ))
              ) : (
                <span className="text-sm text-slate-400">なし</span>
              )}
            </div>
          </div>
        </div>

        {/* AI提案 */}
        {suggestions && (
          <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI最適化提案（Gemini Vision）
            </h4>

            {/* タイトル提案 */}
            {suggestions.suggested_title && (
              <div className="bg-white dark:bg-slate-800 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-1">
                    <FileText className="h-4 w-4 text-purple-600" />
                    推奨タイトル
                  </span>
                  <Button size="sm" onClick={() => onApply('title')} disabled={loading}>
                    適用
                  </Button>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 bg-purple-50 dark:bg-purple-900/30 p-2 rounded">
                  {suggestions.suggested_title}
                </p>
                {suggestions.title_feedback && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    {suggestions.title_feedback}
                  </p>
                )}
              </div>
            )}

            {/* キーワード提案 */}
            {suggestions.seo_keywords && suggestions.seo_keywords.length > 0 && (
              <div className="bg-white dark:bg-slate-800 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-1">
                    <Tag className="h-4 w-4 text-purple-600" />
                    推奨キーワード
                  </span>
                  <Button size="sm" onClick={() => onApply('keywords')} disabled={loading}>
                    適用
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.seo_keywords.map((kw, i) => (
                    <Badge key={i} className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 画像フィードバック */}
            {suggestions.image_feedback && (
              <div className="bg-white dark:bg-slate-800 p-3 rounded">
                <div className="flex items-center gap-1 mb-2">
                  <ImageIcon className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">画像品質評価</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{suggestions.image_feedback}</p>
              </div>
            )}

            {/* 一括適用 */}
            <Button
              onClick={() => onApply('full')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              全ての提案を適用
            </Button>
          </div>
        )}

        {/* 最適化未実行時のヒント */}
        {!suggestions && (
          <div className="text-center p-6 border-2 border-dashed rounded-lg">
            <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              「AI分析」ボタンをクリックして最適化提案を取得
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
