'use client';

import React, { useState, useCallback } from 'react';
import type { Product } from '@/app/tools/editing/types/product';
import { auditProducts, generateAuditSummary, type ProductAuditReport } from '@/lib/services/audit';

// ============================================================
// 型定義
// ============================================================

interface BulkAuditButtonProps {
  selectedProducts: Product[];
  onAuditComplete?: (reports: ProductAuditReport[]) => void;
  onOpenAuditPanel?: (product: Product) => void;
  onRefresh?: () => void;
  disabled?: boolean;
  compact?: boolean;  // 🔥 コンパクトモード追加
}

interface BulkAuditResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ProductAuditReport[];
  products: Product[];
  onOpenAuditPanel: (product: Product) => void;
  onApplyAutoFixes: (productIds: (string | number)[]) => Promise<void>;
}

// ============================================================
// アイコン
// ============================================================

const IconAudit = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 12l2 2 4-4" />
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);

const IconWarning = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconAutoFix = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

// ============================================================
// バルク監査結果ダイアログ
// ============================================================

export function BulkAuditResultDialog({
  isOpen,
  onClose,
  reports,
  products,
  onOpenAuditPanel,
  onApplyAutoFixes,
}: BulkAuditResultDialogProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [selectedForAutoFix, setSelectedForAutoFix] = useState<Set<string | number>>(new Set());
  
  const summary = generateAuditSummary(reports);
  const autoFixableReports = reports.filter(r => r.autoFixSuggestions.length > 0);
  
  const toggleSelection = useCallback((productId: string | number) => {
    setSelectedForAutoFix(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);
  
  const selectAll = useCallback((selected: boolean) => {
    if (selected) setSelectedForAutoFix(new Set(autoFixableReports.map(r => r.productId)));
    else setSelectedForAutoFix(new Set());
  }, [autoFixableReports]);
  
  const handleApplyAutoFixes = useCallback(async () => {
    if (selectedForAutoFix.size === 0) return;
    setIsApplying(true);
    try {
      await onApplyAutoFixes(Array.from(selectedForAutoFix));
      onClose();
    } catch (error) {
      console.error('Failed to apply auto fixes:', error);
    } finally {
      setIsApplying(false);
    }
  }, [selectedForAutoFix, onApplyAutoFixes, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, maxHeight: '80vh', background: 'var(--background)', borderRadius: 12, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--panel-border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>一括監査結果</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer' }}><IconClose /></button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, padding: '16px 20px', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{summary.total}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>監査対象</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{summary.errorCount}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Error</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{summary.warningCount}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Warning</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{summary.okCount}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>OK</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{summary.autoFixableCount}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>自動修正可</div></div>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {autoFixableReports.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}><IconAutoFix />自動修正可能 ({autoFixableReports.length}件)</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => selectAll(true)} style={{ fontSize: 11, padding: '4px 8px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer' }}>全選択</button>
                  <button onClick={() => selectAll(false)} style={{ fontSize: 11, padding: '4px 8px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer' }}>全解除</button>
                </div>
              </div>
              <div style={{ background: 'var(--panel)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
                {autoFixableReports.map((report) => {
                  const product = products.find(p => p.id === report.productId);
                  if (!product) return null;
                  const isSelected = selectedForAutoFix.has(report.productId);
                  return (
                    <div key={String(report.productId)} onClick={() => toggleSelection(report.productId)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderBottom: '1px solid var(--panel-border)', cursor: 'pointer', background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isSelected ? '#3b82f6' : 'var(--text-subtle)'}`, background: isSelected ? '#3b82f6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title?.slice(0, 50)}{(product.title?.length || 0) > 50 ? '...' : ''}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{report.autoFixSuggestions.map(s => s.field).join(', ')}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); onOpenAuditPanel(product); onClose(); }} style={{ fontSize: 10, padding: '4px 8px', background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer' }}>詳細</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {reports.filter(r => r.overallSeverity !== 'ok' && r.autoFixSuggestions.length === 0).length > 0 && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px 0' }}><IconWarning />要確認（手動対応）</h3>
              <div style={{ background: 'var(--panel)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
                {reports.filter(r => r.overallSeverity !== 'ok' && r.autoFixSuggestions.length === 0).slice(0, 10).map((report) => {
                  const product = products.find(p => p.id === report.productId);
                  if (!product) return null;
                  return (
                    <div key={String(report.productId)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderBottom: '1px solid var(--panel-border)' }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: report.overallSeverity === 'error' ? '#ef444420' : '#f59e0b20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: report.overallSeverity === 'error' ? '#ef4444' : '#f59e0b', fontSize: 11, fontWeight: 700 }}>{report.score}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title?.slice(0, 50)}{(product.title?.length || 0) > 50 ? '...' : ''}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{report.results.length}件の問題</div>
                      </div>
                      <button onClick={() => { onOpenAuditPanel(product); onClose(); }} style={{ fontSize: 10, padding: '4px 8px', background: 'var(--background)', border: '1px solid var(--panel-border)', borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer' }}>詳細</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedForAutoFix.size > 0 && `${selectedForAutoFix.size}件を選択中`}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>閉じる</button>
            {autoFixableReports.length > 0 && (
              <button onClick={handleApplyAutoFixes} disabled={selectedForAutoFix.size === 0 || isApplying} style={{ padding: '10px 20px', background: selectedForAutoFix.size > 0 ? '#10b981' : 'var(--text-subtle)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: selectedForAutoFix.size > 0 ? 'pointer' : 'not-allowed', opacity: isApplying ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}><IconAutoFix />{isApplying ? '適用中...' : `${selectedForAutoFix.size}件を自動修正`}</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// バルク監査ボタン
// ============================================================

export function BulkAuditButton({
  selectedProducts,
  onAuditComplete,
  onOpenAuditPanel,
  onRefresh,
  disabled,
  compact = false,  // 🔥 デフォルトはfalse
}: BulkAuditButtonProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [auditReports, setAuditReports] = useState<ProductAuditReport[]>([]);
  
  const handleAudit = useCallback(async () => {
    if (selectedProducts.length === 0) return;
    setIsAuditing(true);
    try {
      const reports = auditProducts(selectedProducts);
      setAuditReports(reports);
      setShowResults(true);
      onAuditComplete?.(reports);
      try {
        await fetch('/api/products/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: selectedProducts.map(p => p.id), saveToDb: true }),
        });
      } catch (error) {
        console.warn('Failed to save audit results to DB:', error);
      }
    } catch (error) {
      console.error('Failed to audit products:', error);
    } finally {
      setIsAuditing(false);
    }
  }, [selectedProducts, onAuditComplete]);
  
  const handleApplyAutoFixes = useCallback(async (productIds: (string | number)[]) => {
    const updates: Array<{ id: string | number; patches: Array<{ field: string; suggestedValue: any; confidence: number; reason: string }> }> = [];
    for (const productId of productIds) {
      const report = auditReports.find(r => r.productId === productId);
      if (!report || report.autoFixSuggestions.length === 0) continue;
      updates.push({ id: productId, patches: report.autoFixSuggestions.map(s => ({ field: s.field, suggestedValue: s.suggestedValue, confidence: s.confidence, reason: s.reason })) });
    }
    if (updates.length === 0) return;
    const response = await fetch('/api/products/audit-patch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updates, source: 'rule_auto', model: 'audit-service' }),
    });
    if (!response.ok) throw new Error('Failed to apply auto fixes');
    const result = await response.json();
    console.log('Auto fix result:', result);
    onRefresh?.();
  }, [auditReports, onRefresh]);
  
  const isDisabled = disabled || selectedProducts.length === 0 || isAuditing;
  
  // 🔥 コンパクトモード用スタイル
  const buttonStyle: React.CSSProperties = compact
    ? {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 24,
        padding: '0 8px',
        background: isDisabled ? 'var(--text-subtle)' : 'rgba(59, 130, 246, 0.1)',
        border: '1px solid',
        borderColor: isDisabled ? 'var(--panel-border)' : 'rgba(59, 130, 246, 0.3)',
        borderRadius: 4,
        color: isDisabled ? 'var(--text-muted)' : '#3b82f6',
        fontSize: 11,
        fontWeight: 500,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isAuditing ? 0.7 : 1,
      }
    : {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        background: isDisabled ? 'var(--text-subtle)' : '#3b82f6',
        border: 'none',
        borderRadius: 6,
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isAuditing ? 0.7 : 1,
      };
  
  return (
    <>
      <button
        onClick={handleAudit}
        disabled={isDisabled}
        style={buttonStyle}
        title={selectedProducts.length === 0 ? '商品を選択してください' : `${selectedProducts.length}件を監査`}
      >
        <IconAudit size={compact ? 11 : 16} />
        {isAuditing ? (compact ? '...' : '監査中...') : (compact ? `監査${selectedProducts.length}` : `監査 (${selectedProducts.length})`)}
      </button>
      
      <BulkAuditResultDialog
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        reports={auditReports}
        products={selectedProducts}
        onOpenAuditPanel={(product) => { onOpenAuditPanel?.(product); }}
        onApplyAutoFixes={handleApplyAutoFixes}
      />
    </>
  );
}

export default BulkAuditButton;
