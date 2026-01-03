/**
 * 一括適用タブコンポーネント
 *
 * 複数商品に対してAI最適化を一括適用
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Zap,
  Search,
  Sparkles,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  title?: string;
  title_en?: string;
  ai_health_score?: {
    overallScore: number;
  };
}

interface BatchResult {
  sku: string;
  success: boolean;
  message?: string;
  scoreBefore?: number;
  scoreAfter?: number;
}

interface BatchApplyTabProps {
  selectedProducts: Product[];
  onBatchAnalyze: () => Promise<void>;
  onBatchApply: (type: 'all' | 'high-confidence') => Promise<void>;
  results?: BatchResult[];
}

export function BatchApplyTab({
  selectedProducts,
  onBatchAnalyze,
  onBatchApply,
  results = [],
}: BatchApplyTabProps) {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [selectedForBatch, setSelectedForBatch] = useState<Set<string>>(
    new Set(selectedProducts.map(p => p.id))
  );

  const handleBatchAnalyze = async () => {
    setProcessing(true);
    setCurrentAction('分析中...');
    setProgress(0);

    try {
      // 進捗シミュレーション
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }
      await onBatchAnalyze();
    } finally {
      setProcessing(false);
      setCurrentAction('');
      setProgress(0);
    }
  };

  const handleBatchApply = async (type: 'all' | 'high-confidence') => {
    setProcessing(true);
    setCurrentAction(type === 'all' ? '全て適用中...' : '高信頼度のみ適用中...');
    setProgress(0);

    try {
      // 進捗シミュレーション
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i);
      }
      await onBatchApply(type);
    } finally {
      setProcessing(false);
      setCurrentAction('');
      setProgress(0);
    }
  };

  const toggleProduct = (id: string) => {
    const newSet = new Set(selectedForBatch);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedForBatch(newSet);
  };

  const selectAll = () => {
    setSelectedForBatch(new Set(selectedProducts.map(p => p.id)));
  };

  const deselectAll = () => {
    setSelectedForBatch(new Set());
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          一括適用
        </CardTitle>
        <CardDescription>
          複数商品に対してAI最適化を一括適用
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 選択状況 */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">選択中の商品</span>
            <Badge variant="secondary">{selectedForBatch.size}件</Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={selectAll}>
              全て選択
            </Button>
            <Button size="sm" variant="outline" onClick={deselectAll}>
              選択解除
            </Button>
          </div>
        </div>

        {/* 商品リスト */}
        {selectedProducts.length > 0 ? (
          <ScrollArea className="h-[200px] border rounded-lg p-2">
            <div className="space-y-2">
              {selectedProducts.map((product) => {
                const score = product.ai_health_score?.overallScore || 0;
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Checkbox
                      checked={selectedForBatch.has(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.title_en || product.title || product.sku}
                      </p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                      {score}点
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              商品リストで商品を選択してください
            </p>
          </div>
        )}

        {/* 進捗表示 */}
        {processing && (
          <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {currentAction}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">{progress}%</p>
          </div>
        )}

        {/* 一括分析 */}
        <Button
          onClick={handleBatchAnalyze}
          disabled={selectedForBatch.size === 0 || processing}
          className="w-full"
          variant="outline"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          一括AI分析（{selectedForBatch.size}件）
        </Button>

        {/* 一括適用オプション */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleBatchApply('high-confidence')}
            disabled={selectedForBatch.size === 0 || processing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="text-sm">高信頼度のみ</div>
              <div className="text-xs opacity-80">90%以上</div>
            </div>
          </Button>

          <Button
            onClick={() => handleBatchApply('all')}
            disabled={selectedForBatch.size === 0 || processing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="text-sm">全て適用</div>
              <div className="text-xs opacity-80">全提案</div>
            </div>
          </Button>
        </div>

        {/* 結果表示 */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">適用結果</h4>
              <div className="flex gap-2">
                <Badge className="bg-green-500">{successCount}件成功</Badge>
                {failCount > 0 && <Badge className="bg-red-500">{failCount}件失敗</Badge>}
              </div>
            </div>
            <ScrollArea className="h-[200px] border rounded-lg">
              <div className="p-2 space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded ${
                      result.success
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">{result.sku}</span>
                    </div>
                    {result.scoreBefore !== undefined && result.scoreAfter !== undefined && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-slate-500">{result.scoreBefore}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                        <span className={`font-bold ${getScoreColor(result.scoreAfter)}`}>
                          {result.scoreAfter}
                        </span>
                      </div>
                    )}
                    {!result.success && result.message && (
                      <span className="text-xs text-red-600">{result.message}</span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* 注意事項 */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">一括適用の注意事項</p>
              <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                <li>適用後の変更は手動で元に戻す必要があります</li>
                <li>高信頼度のみ適用を推奨します</li>
                <li>一度に処理できる商品数は100件までです</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
