'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { Product } from '@/app/tools/editing/types/product';
import {
  auditProduct,
  getAuditSeverityColor,
  getAuditScoreColor,
  type ProductAuditReport,
  type AuditResult,
  type AutoFixSuggestion,
  type AuditSeverity,
} from '@/lib/services/audit';

// ============================================================
// 型定義
// ============================================================

interface AuditPanelProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onApplyFixes: (productId: string | number, updates: Partial<Product>) => Promise<void>;
  onRefresh?: () => void;
}

interface PatchSelection {
  field: string;
  selected: boolean;
  currentValue: string | number | null;
  suggestedValue: string | number;
  confidence: number;
  reason: string;
  source: 'rule' | 'ai';
}

// ============================================================
// アイコンコンポーネント
// ============================================================

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconError = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconAutoFix = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconAI = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </svg>
);

// ============================================================
// サブコンポーネント
// ============================================================

/** 重大度アイコン */
const SeverityIcon = ({ severity }: { severity: AuditSeverity }) => {
  switch (severity) {
    case 'error': return <IconError />;
    case 'warning': return <IconWarning />;
    case 'info': return <IconInfo />;
    case 'ok': return <IconCheck />;
    default: return null;
  }
};

/** 監査結果カード */
const AuditResultCard = ({ result }: { result: AuditResult }) => {
  const color = getAuditSeverityColor(result.severity);
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        background: `${color}10`,
        borderLeft: `3px solid ${color}`,
        borderRadius: '0 8px 8px 0',
        marginBottom: 8,
      }}
    >
      <div style={{ color, marginTop: 2 }}>
        <SeverityIcon severity={result.severity} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontSize: 13, 
          fontWeight: 600, 
          color: 'var(--text)',
          marginBottom: 4,
        }}>
          {result.field}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
          {result.messageJa}
        </div>
        {result.currentValue !== null && result.expectedValue && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            fontSize: 11,
            fontFamily: 'monospace',
          }}>
            <span style={{ 
              padding: '2px 6px', 
              background: 'var(--panel)', 
              borderRadius: 4,
              color: 'var(--text-muted)',
              textDecoration: 'line-through',
            }}>
              {String(result.currentValue)}
            </span>
            <IconArrowRight />
            <span style={{ 
              padding: '2px 6px', 
              background: `${color}20`, 
              borderRadius: 4,
              color,
              fontWeight: 600,
            }}>
              {String(result.expectedValue)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/** 修正提案カード */
const FixSuggestionCard = ({
  patch,
  onToggle,
}: {
  patch: PatchSelection;
  onToggle: () => void;
}) => {
  const confidenceColor = patch.confidence >= 0.9 ? '#10b981' : patch.confidence >= 0.7 ? '#f59e0b' : '#6b7280';
  
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        background: patch.selected ? 'rgba(59, 130, 246, 0.1)' : 'var(--panel)',
        border: `2px solid ${patch.selected ? '#3b82f6' : 'transparent'}`,
        borderRadius: 8,
        marginBottom: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {/* チェックボックス */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: `2px solid ${patch.selected ? '#3b82f6' : 'var(--text-subtle)'}`,
          background: patch.selected ? '#3b82f6' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {patch.selected && <IconCheck />}
      </div>
      
      {/* 内容 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          marginBottom: 6,
        }}>
          <span style={{ 
            fontSize: 13, 
            fontWeight: 600, 
            color: 'var(--text)',
          }}>
            {patch.field}
          </span>
          <span style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 10,
            background: patch.source === 'rule' ? '#3b82f620' : '#8b5cf620',
            color: patch.source === 'rule' ? '#3b82f6' : '#8b5cf6',
            fontWeight: 600,
          }}>
            {patch.source === 'rule' ? 'Rule' : 'AI'}
          </span>
          <span style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 10,
            background: `${confidenceColor}20`,
            color: confidenceColor,
            fontWeight: 600,
          }}>
            {Math.round(patch.confidence * 100)}%
          </span>
        </div>
        
        {/* Before → After */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          fontSize: 12,
          fontFamily: 'monospace',
        }}>
          <span style={{ 
            padding: '4px 8px', 
            background: 'var(--background)', 
            borderRadius: 4,
            color: 'var(--text-muted)',
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {patch.currentValue !== null ? String(patch.currentValue) : '(未設定)'}
          </span>
          <IconArrowRight />
          <span style={{ 
            padding: '4px 8px', 
            background: '#10b98120', 
            borderRadius: 4,
            color: '#10b981',
            fontWeight: 600,
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {String(patch.suggestedValue)}
          </span>
        </div>
        
        {/* 理由 */}
        {patch.reason && (
          <div style={{ 
            fontSize: 11, 
            color: 'var(--text-muted)', 
            marginTop: 6,
            fontStyle: 'italic',
          }}>
            {patch.reason}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// メインコンポーネント
// ============================================================

export function AuditPanel({
  product,
  isOpen,
  onClose,
  onApplyFixes,
  onRefresh,
}: AuditPanelProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiCost, setAiCost] = useState<{ tokens?: number; costUsd?: number } | null>(null);
  const [patchSelections, setPatchSelections] = useState<PatchSelection[]>([]);
  
  // 監査実行
  const auditReport = useMemo<ProductAuditReport>(() => {
    return auditProduct(product);
  }, [product]);
  
  // パッチ選択の初期化
  useMemo(() => {
    const patches: PatchSelection[] = auditReport.autoFixSuggestions.map(suggestion => ({
      field: suggestion.field,
      selected: suggestion.confidence >= 0.9,  // 高信頼度は自動選択
      currentValue: suggestion.currentValue,
      suggestedValue: suggestion.suggestedValue,
      confidence: suggestion.confidence,
      reason: suggestion.reason,
      source: 'rule' as const,
    }));
    setPatchSelections(patches);
  }, [auditReport]);
  
  // パッチ選択のトグル
  const togglePatch = useCallback((index: number) => {
    setPatchSelections(prev => prev.map((p, i) => 
      i === index ? { ...p, selected: !p.selected } : p
    ));
  }, []);
  
  // 全選択/全解除
  const selectAll = useCallback((selected: boolean) => {
    setPatchSelections(prev => prev.map(p => ({ ...p, selected })));
  }, []);
  
  // 🔥 AI審査を実行
  const runAiAudit = useCallback(async () => {
    setIsAiProcessing(true);
    setAiError(null);
    setAiCost(null);
    
    try {
      const response = await fetch('/api/audit/ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [product],
          auditReports: [auditReport],
          provider: 'gemini',  // or 'claude'
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'AI審査に失敗しました');
      }
      
      // AI提案をパッチリストに追加
      if (result.responses && result.responses.length > 0) {
        const aiPatches: PatchSelection[] = result.responses[0].patches.map((p: any) => ({
          field: p.field,
          selected: p.confidence >= 0.85,
          currentValue: p.currentValue,
          suggestedValue: p.suggestedValue,
          confidence: p.confidence,
          reason: p.reason,
          source: 'ai' as const,
        }));
        
        // 既存のパッチとマージ（同じフィールドはAIで上書き）
        setPatchSelections(prev => {
          const existingFields = new Set(aiPatches.map(p => p.field));
          const filteredPrev = prev.filter(p => !existingFields.has(p.field));
          return [...filteredPrev, ...aiPatches];
        });
      }
      
      setAiCost({
        tokens: result.tokensUsed,
        costUsd: result.costUsd,
      });
      
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'AI審査エラー');
    } finally {
      setIsAiProcessing(false);
    }
  }, [product, auditReport]);
  
  // 選択したパッチを適用
  const applySelectedPatches = useCallback(async () => {
    const selectedPatches = patchSelections.filter(p => p.selected);
    if (selectedPatches.length === 0) return;
    
    setIsApplying(true);
    try {
      const updates: Partial<Product> = {};
      
      for (const patch of selectedPatches) {
        switch (patch.field) {
          case 'hts_code':
            updates.hts_code = String(patch.suggestedValue);
            break;
          case 'origin_country':
            updates.origin_country = String(patch.suggestedValue);
            break;
          case 'material':
            updates.material = String(patch.suggestedValue);
            break;
        }
      }
      
      await onApplyFixes(product.id, updates);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to apply patches:', error);
    } finally {
      setIsApplying(false);
    }
  }, [patchSelections, product.id, onApplyFixes, onRefresh]);
  
  // 選択数
  const selectedCount = patchSelections.filter(p => p.selected).length;
  const aiPatchCount = patchSelections.filter(p => p.source === 'ai').length;
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
      />
      
      {/* パネル */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 480,
          height: '100vh',
          background: 'var(--background)',
          borderLeft: '1px solid var(--panel-border)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--panel-border)',
            background: 'var(--panel)',
          }}
        >
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              商品監査
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {product.title?.slice(0, 40)}{(product.title?.length || 0) > 40 ? '...' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <IconClose />
          </button>
        </div>
        
        {/* スコアヘッダー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: `${getAuditSeverityColor(auditReport.overallSeverity)}10`,
            borderBottom: '1px solid var(--panel-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: getAuditScoreColor(auditReport.score),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {auditReport.score}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                監査スコア
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {auditReport.results.length}件の問題を検出
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#ef4444' }}>
                {auditReport.results.filter(r => r.severity === 'error').length}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Error</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>
                {auditReport.results.filter(r => r.severity === 'warning').length}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Warning</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6' }}>
                {auditReport.results.filter(r => r.severity === 'info').length}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Info</div>
            </div>
          </div>
        </div>
        
        {/* コンテンツ（スクロール領域） */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          
          {/* 🔥 AI審査セクション */}
          {auditReport.needsAiReview && (
            <div style={{ 
              marginBottom: 24,
              padding: 16,
              background: 'linear-gradient(135deg, #8b5cf610 0%, #6366f110 100%)',
              border: '1px solid #8b5cf630',
              borderRadius: 12,
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconAI />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                    AI審査が推奨されます
                  </span>
                </div>
                <button
                  onClick={runAiAudit}
                  disabled={isAiProcessing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    background: isAiProcessing ? 'var(--text-subtle)' : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: isAiProcessing ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isAiProcessing ? <IconSpinner /> : <IconAI />}
                  {isAiProcessing ? 'AI分析中...' : 'AI審査を実行'}
                </button>
              </div>
              
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                以下のフィールドは自動推定が困難です:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {auditReport.aiReviewFields.map(field => (
                  <span
                    key={field}
                    style={{
                      fontSize: 11,
                      padding: '4px 10px',
                      background: '#8b5cf620',
                      color: '#8b5cf6',
                      borderRadius: 12,
                      fontWeight: 500,
                    }}
                  >
                    {field}
                  </span>
                ))}
              </div>
              
              {/* AI結果表示 */}
              {aiError && (
                <div style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  background: '#ef444420',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#ef4444',
                }}>
                  ⚠️ {aiError}
                </div>
              )}
              
              {aiCost && (
                <div style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  gap: 12,
                }}>
                  {aiCost.tokens && <span>🔢 {aiCost.tokens} tokens</span>}
                  {aiCost.costUsd && <span>💰 ${aiCost.costUsd.toFixed(4)}</span>}
                  {aiPatchCount > 0 && <span>✅ {aiPatchCount}件の提案を追加</span>}
                </div>
              )}
            </div>
          )}
          
          {/* 修正提案セクション */}
          {patchSelections.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <h3 style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  margin: 0,
                }}>
                  <IconAutoFix />
                  修正提案
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: '#10b98120',
                    color: '#10b981',
                  }}>
                    {patchSelections.length}件
                  </span>
                  {aiPatchCount > 0 && (
                    <span style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 10,
                      background: '#8b5cf620',
                      color: '#8b5cf6',
                    }}>
                      AI: {aiPatchCount}件
                    </span>
                  )}
                </h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => selectAll(true)}
                    style={{
                      fontSize: 11,
                      padding: '4px 8px',
                      background: 'var(--panel)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: 4,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    全選択
                  </button>
                  <button
                    onClick={() => selectAll(false)}
                    style={{
                      fontSize: 11,
                      padding: '4px 8px',
                      background: 'var(--panel)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: 4,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    全解除
                  </button>
                </div>
              </div>
              
              {patchSelections.map((patch, index) => (
                <FixSuggestionCard
                  key={`${patch.field}-${index}`}
                  patch={patch}
                  onToggle={() => togglePatch(index)}
                />
              ))}
            </div>
          )}
          
          {/* 監査結果セクション */}
          <div>
            <h3 style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: 'var(--text)',
              marginBottom: 12,
              margin: '0 0 12px 0',
            }}>
              監査結果
            </h3>
            
            {auditReport.results.length === 0 ? (
              <div style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)',
                background: 'var(--panel)',
                borderRadius: 8,
              }}>
                <div style={{ color: '#10b981', marginBottom: 8 }}>
                  <IconCheck />
                </div>
                問題は検出されませんでした
              </div>
            ) : (
              auditReport.results.map((result, index) => (
                <AuditResultCard key={`${result.ruleId}-${index}`} result={result} />
              ))
            )}
          </div>
          
          {/* 現在の商品データセクション */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: 'var(--text)',
              marginBottom: 12,
              margin: '0 0 12px 0',
            }}>
              現在のデータ
            </h3>
            
            <div style={{
              background: 'var(--panel)',
              borderRadius: 8,
              padding: 16,
              fontSize: 12,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px 12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>原産国:</span>
                <span style={{ fontFamily: 'monospace' }}>{product.origin_country || '(未設定)'}</span>
                
                <span style={{ color: 'var(--text-muted)' }}>HTSコード:</span>
                <span style={{ fontFamily: 'monospace' }}>{product.hts_code || '(未設定)'}</span>
                
                <span style={{ color: 'var(--text-muted)' }}>関税率:</span>
                <span style={{ fontFamily: 'monospace' }}>
                  {product.hts_duty_rate ? `${(product.hts_duty_rate * 100).toFixed(1)}%` : '(未設定)'}
                </span>
                
                <span style={{ color: 'var(--text-muted)' }}>素材:</span>
                <span style={{ fontFamily: 'monospace' }}>{product.material || '(未設定)'}</span>
                
                <span style={{ color: 'var(--text-muted)' }}>重量:</span>
                <span style={{ fontFamily: 'monospace' }}>
                  {product.listing_data?.weight_g ? `${product.listing_data.weight_g}g` : '(未設定)'}
                </span>
                
                <span style={{ color: 'var(--text-muted)' }}>利益率:</span>
                <span style={{ 
                  fontFamily: 'monospace',
                  color: (product.profit_margin || 0) >= 0.15 ? '#10b981' : (product.profit_margin || 0) >= 0 ? '#f59e0b' : '#ef4444',
                }}>
                  {product.profit_margin ? `${(product.profit_margin * 100).toFixed(1)}%` : '(未設定)'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* フッター */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--panel-border)',
            background: 'var(--panel)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {selectedCount > 0 && `${selectedCount}件の修正を選択中`}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: 'var(--background)',
                border: '1px solid var(--panel-border)',
                borderRadius: 8,
                color: 'var(--text)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              キャンセル
            </button>
            <button
              onClick={applySelectedPatches}
              disabled={selectedCount === 0 || isApplying}
              style={{
                padding: '10px 20px',
                background: selectedCount > 0 ? '#3b82f6' : 'var(--text-subtle)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                opacity: isApplying ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <IconAutoFix />
              {isApplying ? '適用中...' : `${selectedCount}件を適用`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuditPanel;
