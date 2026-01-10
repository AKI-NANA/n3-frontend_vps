// ============================================
// UI-5: AI改善提案パネル（商品編集モーダル用）
// ============================================

'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface AIImprovementPanelProps {
  productId: string;
  currentTitle: string;
  currentDescription: string;
  currentImages?: string[];
  healthScore?: number;
  onApplyTitle?: (newTitle: string) => void;
  onApplyDescription?: (newDescription: string) => void;
}

interface TitleOptimization {
  success: boolean;
  original_title: string;
  optimized_title: string;
  improvements: string[];
  seo_score: number;
}

interface DescriptionOptimization {
  success: boolean;
  original_description: string;
  optimized_description: string;
  improvements: string[];
  seo_score: number;
}

interface ImageAnalysis {
  success: boolean;
  is_compliant: boolean;
  issues: string[];
  suggestions: string[];
  quality_score: number;
}

export default function AIImprovementPanel({
  productId,
  currentTitle,
  currentDescription,
  currentImages = [],
  healthScore = 50,
  onApplyTitle,
  onApplyDescription,
}: AIImprovementPanelProps) {
  const [loading, setLoading] = useState(false);
  const [titleOptimization, setTitleOptimization] = useState<TitleOptimization | null>(null);
  const [descriptionOptimization, setDescriptionOptimization] = useState<DescriptionOptimization | null>(null);
  const [imageAnalyses, setImageAnalyses] = useState<ImageAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<'title' | 'description' | 'images'>('title');

  const generateImprovements = async () => {
    setLoading(true);
    try {
      // 実際の実装ではAPIエンドポイントを呼び出し
      // const response = await fetch('/api/seo/optimize', { method: 'POST', body: JSON.stringify({ productId, currentTitle, currentDescription, currentImages }) });

      // モック実装
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTitleOpt: TitleOptimization = {
        success: true,
        original_title: currentTitle,
        optimized_title: `${currentTitle} - NEW Limited Edition Authentic`,
        improvements: [
          'タイトルを簡潔化',
          '希少性キーワードを追加',
          '検索キーワードを増加',
        ],
        seo_score: 85,
      };

      const mockDescriptionOpt: DescriptionOptimization = {
        success: true,
        original_description: currentDescription,
        optimized_description: `【商品説明】\n${currentDescription}\n\n【商品仕様】\n- 高品質素材使用\n- 新品未使用\n- 正規品保証\n\n【配送について】\n追跡番号付きで発送いたします。安心してご購入ください。\n\n【返品・交換】\n30日間の返品保証付き`,
        improvements: [
          '検索キーワードの最適化',
          '構造化された説明文',
          '商品の魅力を強調',
        ],
        seo_score: 78,
      };

      const mockImageAnalyses: ImageAnalysis[] = currentImages.map((_, index) => ({
        success: true,
        is_compliant: index % 2 === 0,
        issues: index % 2 === 0 ? [] : ['ウォーターマークが含まれています', '背景に不要な要素があります'],
        suggestions: index % 2 === 0 ? ['画質は良好です'] : ['ウォーターマークを除去してください', '白背景に変更することを推奨'],
        quality_score: index % 2 === 0 ? 90 : 55,
      }));

      setTitleOptimization(mockTitleOpt);
      setDescriptionOptimization(mockDescriptionOpt);
      setImageAnalyses(mockImageAnalyses);
    } catch (error) {
      console.error('Failed to generate improvements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            AI改善提案
          </h3>
        </div>

        {/* 健全性スコア */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">健全性スコア:</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getHealthScoreBg(healthScore)}`}
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
            <span className={`text-lg font-bold ${getHealthScoreColor(healthScore)}`}>
              {healthScore}
            </span>
          </div>
        </div>
      </div>

      {/* 生成ボタン */}
      {!titleOptimization && !descriptionOptimization && (
        <button
          onClick={generateImprovements}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition mb-6"
        >
          {loading ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              AI分析中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              AI改善提案を生成
            </>
          )}
        </button>
      )}

      {/* タブ */}
      {(titleOptimization || descriptionOptimization || imageAnalyses.length > 0) && (
        <>
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('title')}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === 'title'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              タイトル
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === 'description'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              説明文
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === 'images'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              画像（{currentImages.length}枚）
            </button>
          </div>

          {/* タイトル最適化 */}
          {activeTab === 'title' && titleOptimization && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold text-gray-900">
                  SEOスコア: {titleOptimization.seo_score}/100
                </span>
              </div>

              <div className="space-y-4">
                {/* 現在のタイトル */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    現在のタイトル
                  </label>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm text-gray-800">{titleOptimization.original_title}</p>
                  </div>
                </div>

                {/* 最適化されたタイトル */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI最適化タイトル
                  </label>
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-sm text-gray-800 font-medium">{titleOptimization.optimized_title}</p>
                  </div>
                </div>

                {/* 改善点 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    改善点
                  </label>
                  <ul className="space-y-1">
                    {titleOptimization.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 適用ボタン */}
                <button
                  onClick={() => onApplyTitle?.(titleOptimization.optimized_title)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  <CheckCircle className="w-5 h-5" />
                  このタイトルを適用
                </button>
              </div>
            </div>
          )}

          {/* 説明文最適化 */}
          {activeTab === 'description' && descriptionOptimization && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold text-gray-900">
                  SEOスコア: {descriptionOptimization.seo_score}/100
                </span>
              </div>

              <div className="space-y-4">
                {/* 現在の説明文 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    現在の説明文
                  </label>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{descriptionOptimization.original_description}</p>
                  </div>
                </div>

                {/* 最適化された説明文 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI最適化説明文
                  </label>
                  <div className="p-3 bg-green-50 rounded border border-green-200 max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{descriptionOptimization.optimized_description}</p>
                  </div>
                </div>

                {/* 改善点 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    改善点
                  </label>
                  <ul className="space-y-1">
                    {descriptionOptimization.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 適用ボタン */}
                <button
                  onClick={() => onApplyDescription?.(descriptionOptimization.optimized_description)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  <CheckCircle className="w-5 h-5" />
                  この説明文を適用
                </button>
              </div>
            </div>
          )}

          {/* 画像分析 */}
          {activeTab === 'images' && imageAnalyses.length > 0 && (
            <div className="space-y-4">
              {imageAnalyses.map((analysis, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* 画像サムネイル */}
                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {currentImages[index] ? (
                        <img
                          src={currentImages[index]}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* 分析結果 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          画像 {index + 1}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${analysis.is_compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {analysis.is_compliant ? '適合' : '要改善'}
                        </span>
                        <span className="text-xs text-gray-600">
                          品質スコア: {analysis.quality_score}/100
                        </span>
                      </div>

                      {/* 問題点 */}
                      {analysis.issues.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">問題点:</p>
                          <ul className="space-y-0.5">
                            {analysis.issues.map((issue, i) => (
                              <li key={i} className="flex items-start gap-1 text-xs text-red-600">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 改善提案 */}
                      {analysis.suggestions.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">改善提案:</p>
                          <ul className="space-y-0.5">
                            {analysis.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-start gap-1 text-xs text-gray-600">
                                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-500" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
