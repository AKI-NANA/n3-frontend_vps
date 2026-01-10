/**
 * AI最適化タブ
 * ✅ UI-5: AI改善提案の最終統合
 *
 * 機能:
 * - SEOヘルススコア表示
 * - Gemini Vision画像品質評価
 * - AIタイトル・説明文最適化
 * - ワンクリック適用
 */

import { useState, useEffect } from 'react';
import styles from './tab-ai-optimization.module.css';

interface TabAIOptimizationProps {
  product: any;
  onSave: (updates: any) => Promise<void>;
}

interface HealthScore {
  overall_score: number;
  seo_score: number;
  policy_score: number;
  image_score: number;
  title_issues: string[];
  description_issues: string[];
  image_violations: string[];
  suggestions: string[];
  last_updated: string;
}

interface AIOptimization {
  optimized_title: string;
  optimized_description: string;
  keywords: string[];
  improvements: string[];
  confidence: number;
}

export function TabAIOptimization({ product, onSave }: TabAIOptimizationProps) {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [aiOptimization, setAIOptimization] = useState<AIOptimization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // ヘルススコアを取得
  const fetchHealthScore = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/ai/health-score?sku=${product.sku}`);
      const data = await response.json();

      if (data.success) {
        setHealthScore(data.healthScore);
      }
    } catch (error) {
      console.error('[AI Optimization] ヘルススコア取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // AI最適化を取得
  const generateAIOptimization = async () => {
    try {
      setIsAnalyzing(true);
      const response = await fetch('/api/ai/optimize-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: product.sku,
          current_title: product.title || product.name,
          current_description: product.description || '',
          images: product.images || [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAIOptimization(data.optimization);
      } else {
        alert(`AI最適化に失敗しました: ${data.error}`);
      }
    } catch (error: any) {
      console.error('[AI Optimization] AI最適化エラー:', error);
      alert(`AI最適化に失敗しました: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 最適化を適用
  const applyOptimization = async () => {
    if (!aiOptimization) return;

    const confirmed = confirm(
      'AIが提案するタイトルと説明文を適用しますか？\n\n' +
      `新しいタイトル: ${aiOptimization.optimized_title}\n\n` +
      '※ 元のデータは上書きされます。'
    );

    if (!confirmed) return;

    try {
      setIsApplying(true);

      await onSave({
        title: aiOptimization.optimized_title,
        description: aiOptimization.optimized_description,
        ai_optimized: true,
        ai_optimized_at: new Date().toISOString(),
      });

      alert('✅ AI最適化を適用しました！');

      // ヘルススコアを再取得
      setTimeout(() => {
        fetchHealthScore();
      }, 1000);
    } catch (error: any) {
      console.error('[AI Optimization] 適用エラー:', error);
      alert(`適用に失敗しました: ${error.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  // 初回ロード
  useEffect(() => {
    fetchHealthScore();
  }, [product.sku]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🤖 AI最適化 & ヘルススコア</h2>
        <button
          className={styles.refreshButton}
          onClick={fetchHealthScore}
          disabled={isLoading}
        >
          {isLoading ? '読み込み中...' : '🔄 更新'}
        </button>
      </div>

      {/* ヘルススコア */}
      {healthScore ? (
        <div className={styles.healthScoreSection}>
          <h3 className={styles.sectionTitle}>📊 SEO健全性スコア</h3>

          <div className={styles.scoreCards}>
            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>総合スコア</div>
              <div
                className={`${styles.scoreValue} ${
                  healthScore.overall_score >= 80
                    ? styles.excellent
                    : healthScore.overall_score >= 60
                    ? styles.good
                    : styles.poor
                }`}
              >
                {healthScore.overall_score}/100
              </div>
            </div>

            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>SEOスコア</div>
              <div className={styles.scoreValue}>{healthScore.seo_score}/100</div>
            </div>

            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>ポリシー順守</div>
              <div className={styles.scoreValue}>{healthScore.policy_score}/100</div>
            </div>

            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>画像品質</div>
              <div className={styles.scoreValue}>{healthScore.image_score}/100</div>
            </div>
          </div>

          {/* 問題点 */}
          {(healthScore.title_issues.length > 0 ||
            healthScore.description_issues.length > 0 ||
            healthScore.image_violations.length > 0) && (
            <div className={styles.issuesSection}>
              <h4 className={styles.issuesTitle}>⚠️ 検出された問題</h4>

              {healthScore.title_issues.length > 0 && (
                <div className={styles.issueGroup}>
                  <div className={styles.issueGroupTitle}>タイトル:</div>
                  <ul className={styles.issueList}>
                    {healthScore.title_issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {healthScore.description_issues.length > 0 && (
                <div className={styles.issueGroup}>
                  <div className={styles.issueGroupTitle}>説明文:</div>
                  <ul className={styles.issueList}>
                    {healthScore.description_issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {healthScore.image_violations.length > 0 && (
                <div className={styles.issueGroup}>
                  <div className={styles.issueGroupTitle}>画像:</div>
                  <ul className={styles.issueList}>
                    {healthScore.image_violations.map((violation, idx) => (
                      <li key={idx}>{violation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 改善提案 */}
          {healthScore.suggestions.length > 0 && (
            <div className={styles.suggestionsSection}>
              <h4 className={styles.suggestionsTitle}>💡 改善提案</h4>
              <ul className={styles.suggestionsList}>
                {healthScore.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.loadingState}>
          {isLoading ? '読み込み中...' : 'ヘルススコアを取得できませんでした'}
        </div>
      )}

      {/* AI最適化 */}
      <div className={styles.aiOptimizationSection}>
        <h3 className={styles.sectionTitle}>✨ AI自動最適化</h3>
        <p className={styles.sectionDescription}>
          Gemini AIがタイトルと説明文を分析し、SEOに最適化された文章を提案します
        </p>

        {!aiOptimization ? (
          <button
            className={styles.generateButton}
            onClick={generateAIOptimization}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '分析中...' : '🤖 AI最適化を実行'}
          </button>
        ) : (
          <div className={styles.optimizationResults}>
            <div className={styles.confidenceBar}>
              <span className={styles.confidenceLabel}>信頼度:</span>
              <div className={styles.confidenceProgress}>
                <div
                  className={styles.confidenceFill}
                  style={{ width: `${aiOptimization.confidence}%` }}
                />
              </div>
              <span className={styles.confidenceValue}>
                {aiOptimization.confidence}%
              </span>
            </div>

            <div className={styles.comparison}>
              <div className={styles.comparisonColumn}>
                <h4 className={styles.comparisonTitle}>現在のタイトル</h4>
                <div className={styles.comparisonContent}>
                  {product.title || product.name}
                </div>
              </div>

              <div className={styles.comparisonArrow}>→</div>

              <div className={styles.comparisonColumn}>
                <h4 className={styles.comparisonTitle}>最適化後のタイトル</h4>
                <div className={`${styles.comparisonContent} ${styles.optimized}`}>
                  {aiOptimization.optimized_title}
                </div>
              </div>
            </div>

            <div className={styles.comparison}>
              <div className={styles.comparisonColumn}>
                <h4 className={styles.comparisonTitle}>現在の説明文</h4>
                <div className={styles.comparisonContent}>
                  {product.description || '(なし)'}
                </div>
              </div>

              <div className={styles.comparisonArrow}>→</div>

              <div className={styles.comparisonColumn}>
                <h4 className={styles.comparisonTitle}>最適化後の説明文</h4>
                <div className={`${styles.comparisonContent} ${styles.optimized}`}>
                  {aiOptimization.optimized_description}
                </div>
              </div>
            </div>

            {aiOptimization.keywords.length > 0 && (
              <div className={styles.keywords}>
                <h4 className={styles.keywordsTitle}>🔑 最適化キーワード:</h4>
                <div className={styles.keywordTags}>
                  {aiOptimization.keywords.map((keyword, idx) => (
                    <span key={idx} className={styles.keywordTag}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {aiOptimization.improvements.length > 0 && (
              <div className={styles.improvements}>
                <h4 className={styles.improvementsTitle}>📈 改善点:</h4>
                <ul className={styles.improvementsList}>
                  {aiOptimization.improvements.map((improvement, idx) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.actions}>
              <button
                className={styles.applyButton}
                onClick={applyOptimization}
                disabled={isApplying}
              >
                {isApplying ? '適用中...' : '✅ この最適化を適用'}
              </button>
              <button
                className={styles.regenerateButton}
                onClick={generateAIOptimization}
                disabled={isAnalyzing}
              >
                🔄 再生成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
