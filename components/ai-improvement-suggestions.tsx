'use client';

import React, { useState, useEffect } from 'react';
import { HealthScoreService, HealthScoreResult, Improvement } from '@/lib/services/health-score-service';

interface AIImprovementSuggestionsProps {
  product: {
    title: string;
    description: string;
    images: string[];
    price: number;
    category?: string;
  };
  onApplySuggestion?: (improvement: Improvement) => void;
}

/**
 * AI改善提案コンポーネント
 * Health Score Serviceを使用してGemini Vision画像分析結果とAI改善提案を表示
 */
export default function AIImprovementSuggestions({
  product,
  onApplySuggestion,
}: AIImprovementSuggestionsProps) {
  const [healthScore, setHealthScore] = useState<HealthScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedImprovements, setExpandedImprovements] = useState<Set<string>>(new Set());

  useEffect(() => {
    analyzeProduct();
  }, [product]);

  const analyzeProduct = async () => {
    setLoading(true);
    try {
      const result = await HealthScoreService.calculateHealthScore(product);
      setHealthScore(result);
    } catch (error) {
      console.error('[AIImprovementSuggestions] Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleImprovement = (id: string) => {
    setExpandedImprovements((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleApply = (improvement: Improvement) => {
    if (onApplySuggestion) {
      onApplySuggestion(improvement);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!healthScore) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Health Score ヘッダー */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">AI品質分析 & 改善提案</h3>
          <button
            onClick={analyzeProduct}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            再分析
          </button>
        </div>

        {/* スコア表示 */}
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">Health Score</div>
            <div className="flex items-end gap-2">
              <div
                className={`text-5xl font-bold ${HealthScoreService.getCategoryColor(
                  healthScore.category
                )}`}
              >
                {healthScore.score}
              </div>
              <div className="text-lg text-gray-400 mb-2">/ 100</div>
            </div>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${HealthScoreService.getCategoryColor(
                  healthScore.category
                )}`}
              >
                {HealthScoreService.getCategoryLabel(healthScore.category)}
              </span>
            </div>
          </div>

          {/* 画像分析サマリー */}
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-semibold mb-2">画像品質</div>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-500">品質:</span>{' '}
                <span className="font-semibold">{healthScore.imageAnalysis.quality}</span>
              </div>
              <div>
                <span className="text-gray-500">背景:</span> {healthScore.imageAnalysis.background}
              </div>
              <div>
                <span className="text-gray-500">照明:</span> {healthScore.imageAnalysis.lighting}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 改善提案リスト */}
      <div className="p-6">
        <h4 className="font-semibold mb-4">
          改善提案 ({healthScore.improvements.length}件)
        </h4>

        {healthScore.improvements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <div>改善提案はありません。素晴らしい商品登録です！</div>
          </div>
        ) : (
          <div className="space-y-3">
            {healthScore.improvements.map((improvement) => {
              const isExpanded = expandedImprovements.has(improvement.id);
              return (
                <div key={improvement.id} className="border rounded-lg">
                  {/* 改善項目ヘッダー */}
                  <div
                    onClick={() => toggleImprovement(improvement.id)}
                    className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${HealthScoreService.getPriorityColor(
                            improvement.priority
                          )}`}
                        >
                          優先度: {HealthScoreService.getPriorityLabel(improvement.priority)}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">
                          {improvement.type}
                        </span>
                      </div>
                      <div className="font-semibold">{improvement.reason}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        期待効果: {improvement.impact}
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>

                  {/* 改善詳細（展開時） */}
                  {isExpanded && (
                    <div className="p-4 border-t bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">現在の値</div>
                          <div className="bg-white p-3 rounded border text-sm">
                            {improvement.currentValue}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">
                            推奨される値
                          </div>
                          <div className="bg-white p-3 rounded border text-sm border-green-300">
                            {improvement.suggestedValue}
                          </div>
                        </div>
                      </div>
                      {onApplySuggestion && (
                        <button
                          onClick={() => handleApply(improvement)}
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
                        >
                          この提案を適用
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 画像分析詳細 */}
      {healthScore.imageAnalysis.suggestions.length > 0 && (
        <div className="p-6 border-t bg-blue-50">
          <h4 className="font-semibold mb-3">画像改善のヒント</h4>
          <ul className="space-y-2">
            {healthScore.imageAnalysis.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-blue-600">💡</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* タイムスタンプ */}
      <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-500">
        最終分析: {healthScore.timestamp.toLocaleString('ja-JP')}
      </div>
    </div>
  );
}
