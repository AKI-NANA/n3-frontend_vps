// app/tools/listing-n3/components/l3-tabs/seo-tool-panel.tsx
/**
 * SEO最適化ツールパネル
 * タイトル・説明文の分析と最適化提案
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { Search, Zap, TrendingUp, AlertCircle, Check, Copy, RefreshCw } from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { N3ProgressBar } from '@/components/n3/presentational/n3-progress-bar';
import { N3Card } from '@/components/n3/container/n3-card';
import { ListingItem, SeoAnalysis } from '../../types/listing';
import { useSeoOptimization } from '../../hooks';

interface SeoToolPanelProps {
  listings: ListingItem[];
  selectedIds: string[];
  onUpdate?: (id: string, updates: Partial<ListingItem>) => void;
}

// スコアカラー
const getScoreColor = (score: number): string => {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-warning)';
  return 'var(--color-error)';
};

// スコアバッジ
const ScoreBadge = memo(function ScoreBadge({ score }: { score: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: `${getScoreColor(score)}20`,
        color: getScoreColor(score),
        fontSize: '13px',
        fontWeight: 600,
      }}
    >
      {score}
    </div>
  );
});

export const SeoToolPanel = memo(function SeoToolPanel({
  listings,
  selectedIds,
  onUpdate,
}: SeoToolPanelProps) {
  const { analyzing, results, analyzeSeo, bulkAnalyze } = useSeoOptimization();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 対象リスト
  const targetListings = selectedIds.length > 0
    ? listings.filter(l => selectedIds.includes(l.id))
    : listings.slice(0, 10);

  // 分析実行
  const handleAnalyze = useCallback(async (listing: ListingItem) => {
    await analyzeSeo({
      id: listing.id,
      title: listing.title,
      description: listing.description,
    });
    setExpandedId(listing.id);
  }, [analyzeSeo]);

  // 一括分析
  const handleBulkAnalyze = useCallback(async () => {
    await bulkAnalyze(
      targetListings.map(l => ({
        id: l.id,
        title: l.title,
        description: l.description,
      }))
    );
  }, [targetListings, bulkAnalyze]);

  // 提案適用
  const handleApplySuggestion = useCallback((listingId: string, field: string, value: string) => {
    onUpdate?.(listingId, { [field]: value });
  }, [onUpdate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--panel)',
          borderRadius: 'var(--style-radius-lg, 12px)',
          border: '1px solid var(--panel-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={20} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              SEO最適化
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {selectedIds.length > 0 ? `${selectedIds.length}件選択中` : `${targetListings.length}件表示中`}
            </div>
          </div>
        </div>

        <N3Button
          variant="primary"
          size="sm"
          onClick={handleBulkAnalyze}
          disabled={analyzing}
        >
          {analyzing ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Zap size={14} />
          )}
          一括分析
        </N3Button>
      </div>

      {/* キーワードヒント */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: 'var(--style-radius-md, 8px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
            トレンドキーワード
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {['送料無料', '即日発送', '正規品', '限定', '高品質', 'セール'].map(kw => (
            <N3Badge key={kw} variant="outline" size="sm">
              {kw}
            </N3Badge>
          ))}
        </div>
      </div>

      {/* リスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {targetListings.map(listing => {
          const analysis = results.get(listing.id);
          const isExpanded = expandedId === listing.id;

          return (
            <div
              key={listing.id}
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--panel-border)',
                borderRadius: 'var(--style-radius-lg, 12px)',
                overflow: 'hidden',
              }}
            >
              {/* アイテムヘッダー */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : listing.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <ScoreBadge score={analysis?.overallScore || listing.seoScore || 0} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {listing.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {listing.sku} • {listing.marketplace.toUpperCase()}
                  </div>
                </div>

                <N3Button
                  variant="ghost"
                  size="xs"
                  onClick={e => {
                    e.stopPropagation();
                    handleAnalyze(listing);
                  }}
                  disabled={analyzing}
                >
                  {analyzing && expandedId === listing.id ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    '分析'
                  )}
                </N3Button>
              </div>

              {/* 分析結果 */}
              {isExpanded && analysis && (
                <div
                  style={{
                    padding: '16px',
                    borderTop: '1px solid var(--panel-border)',
                    background: 'var(--highlight)',
                  }}
                >
                  {/* スコアグリッド */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    {[
                      { label: 'タイトル', score: analysis.titleScore },
                      { label: '説明文', score: analysis.descriptionScore },
                      { label: 'キーワード', score: analysis.keywordScore },
                    ].map(item => (
                      <div
                        key={item.label}
                        style={{
                          padding: '10px',
                          background: 'var(--panel)',
                          borderRadius: 'var(--style-radius-md, 8px)',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {item.label}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <N3ProgressBar
                            value={item.score}
                            max={100}
                            size="sm"
                            color={getScoreColor(item.score)}
                            style={{ width: '60px' }}
                          />
                          <span style={{ fontSize: '12px', fontWeight: 500, color: getScoreColor(item.score) }}>
                            {item.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 改善提案 */}
                  {analysis.suggestions.length > 0 && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '8px' }}>
                        改善提案
                      </div>
                      {analysis.suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '12px',
                            background: 'var(--panel)',
                            borderRadius: 'var(--style-radius-md, 8px)',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <AlertCircle size={14} style={{ color: 'var(--color-warning)' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {suggestion.reason}
                            </span>
                          </div>
                          <div
                            style={{
                              padding: '8px',
                              background: 'var(--highlight)',
                              borderRadius: 'var(--style-radius-sm, 6px)',
                              fontSize: '12px',
                              color: 'var(--text)',
                              marginBottom: '8px',
                            }}
                          >
                            {suggestion.suggested}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <N3Button
                              variant="primary"
                              size="xs"
                              onClick={() => handleApplySuggestion(listing.id, suggestion.field, suggestion.suggested)}
                            >
                              <Check size={12} />
                              適用
                            </N3Button>
                            <N3Button
                              variant="ghost"
                              size="xs"
                              onClick={() => navigator.clipboard.writeText(suggestion.suggested)}
                            >
                              <Copy size={12} />
                              コピー
                            </N3Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 競合キーワード */}
                  {analysis.competitorKeywords.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '8px' }}>
                        競合使用キーワード
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {analysis.competitorKeywords.map(kw => (
                          <N3Badge key={kw} variant="secondary" size="sm">
                            {kw}
                          </N3Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default SeoToolPanel;
