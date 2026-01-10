'use client';

// TabTools - V10.3 - 0円仕入れ確認ダイアログ対応
// 
// 機能:
// - 既存API活用（profit-calculate, filter-check, score/calculate）
// - 0円仕入れ時の確認ダイアログ
// - 状態サマリー表示

import { useState, memo, useCallback } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';
import { 
  Calculator, Shield, Brain, Languages, Truck, Globe, Barcode, Search,
  FolderOpen, Sparkles, FileText, Type, RefreshCw, Wand2, ExternalLink,
  CheckCircle, AlertCircle, Copy, FileDown, ChevronDown, ChevronRight,
  Play, Zap, ArrowRight, Rocket, Package, AlertTriangle
} from 'lucide-react';

const C = {
  bg: '#f8fafc',
  panel: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  muted: '#64748b',
  done: '#10b981',
  running: '#f59e0b',
  pending: '#94a3b8',
  error: '#ef4444',
  primary: '#3b82f6',
};

export interface TabToolsProps {
  product: Product | null;
  onSave?: (updates: any) => void;
  onRefresh?: () => void;
}

function getStepStatus(product: any, stepKey: string): 'done' | 'running' | 'pending' | 'error' {
  if (!product) return 'pending';
  const ld = product.listing_data || {};
  
  switch (stepKey) {
    case 'title': return product.english_title ? 'done' : 'pending';
    case 'hts': return product.hts_code ? 'done' : 'pending';
    case 'origin': return product.origin_country ? 'done' : 'pending';
    case 'category': return (product.ebay_category_id && product.ebay_category_id !== '99999') ? 'done' : 'pending';
    case 'shipping_policy': return product.shipping_policy ? 'done' : ld.usa_shipping_policy_name ? 'done' : 'pending';
    case 'duty': return (product.duty_amount_usd > 0 || ld.ddp_price_usd) ? 'done' : 'pending';
    case 'shipping': return (product.shipping_cost_usd > 0 || ld.shipping_cost_usd > 0) ? 'done' : 'pending';
    case 'profit': return (product.profit_margin > 0 || product.profit_amount_usd > 0 || ld.profit_margin > 0) ? 'done' : 'pending';
    case 'html': return ld.html_description ? 'done' : 'pending';
    case 'filter': 
      if (product.filter_passed === true || ld.filter_passed === true) return 'done';
      if (product.filter_passed === false || ld.filter_passed === false) return 'error';
      return 'pending';
    case 'score': return product.listing_score > 0 ? 'done' : 'pending';
    case 'sm': return (product.sm_competitor_count > 0 || ld.referenceItems?.length > 0) ? 'done' : 'pending';
    default: return 'pending';
  }
}

export const TabTools = memo(function TabTools({ product, onSave, onRefresh }: TabToolsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ai: true,
    auto: true,
    flow: false,
    other: false,
  });
  
  // AIエンリッチメント用
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [enrichmentSaving, setEnrichmentSaving] = useState(false);
  const [enrichmentError, setEnrichmentError] = useState<string | null>(null);
  const [autoFlowRunning, setAutoFlowRunning] = useState(false);
  
  // 🔥 0円確認ダイアログ
  const [showZeroCostDialog, setShowZeroCostDialog] = useState(false);
  const [zeroCostProducts, setZeroCostProducts] = useState<any[]>([]);

  const toggleSection = useCallback((key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // プロンプト生成
  const handleGeneratePrompt = useCallback(async () => {
    if (!product?.id) return;
    setPromptLoading(true);
    setGeneratedPrompt('');
    try {
      const res = await fetch('/api/gemini-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [product.id], dataType: 'both' })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPrompt(data.prompt);
        toast.success('✅ プロンプト生成完了');
      } else throw new Error(data.error);
    } catch (e: any) {
      toast.error(`エラー: ${e.message}`);
    } finally {
      setPromptLoading(false);
    }
  }, [product?.id]);

  // プロンプトコピー
  const handleCopyPrompt = useCallback(async () => {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt);
    setPromptCopied(true);
    toast.success('📋 コピーしました');
    setTimeout(() => setPromptCopied(false), 2000);
  }, [generatedPrompt]);

  // 🔥 利益計算実行（0円確認対応）
  const runProfitCalculation = useCallback(async (forceZeroCost = false) => {
    if (!product?.id) return false;
    
    const res = await fetch('/api/tools/profit-calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productIds: [String(product.id)],
        forceZeroCost 
      })
    });
    
    const data = await res.json();
    
    // 🔥 0円警告がある場合
    if (data.requiresZeroCostConfirmation && data.zeroCostWarnings?.length > 0) {
      setZeroCostProducts(data.zeroCostWarnings);
      setShowZeroCostDialog(true);
      return false;
    }
    
    if (data.updated > 0) {
      return true;
    }
    
    if (data.errors?.length > 0) {
      throw new Error(data.errors[0].error);
    }
    
    return false;
  }, [product?.id]);

  // 🔥 出品準備自動化
  const runAutoPreparation = useCallback(async (forceZeroCost = false) => {
    if (!product?.id) return;
    setAutoFlowRunning(true);
    
    try {
      // Step 1: 利益計算
      toast.loading('利益計算中...', { id: 'auto-prep' });
      const profitSuccess = await runProfitCalculation(forceZeroCost);
      
      if (!profitSuccess && !forceZeroCost) {
        // 0円確認ダイアログが表示された場合は中断
        setAutoFlowRunning(false);
        toast.dismiss('auto-prep');
        return;
      }
      
      // Step 2: フィルターチェック
      toast.loading('フィルターチェック中...', { id: 'auto-prep' });
      await fetch('/api/filter-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [String(product.id)] })
      });
      
      // Step 3: スコア計算
      toast.loading('スコア計算中...', { id: 'auto-prep' });
      await fetch('/api/score/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [String(product.id)] })
      });
      
      toast.success('✅ 出品準備完了！', { id: 'auto-prep' });
      onRefresh?.();
      
    } catch (e: any) {
      toast.error(`エラー: ${e.message}`, { id: 'auto-prep' });
    } finally {
      setAutoFlowRunning(false);
    }
  }, [product?.id, onRefresh, runProfitCalculation]);

  // 🔥 0円確認後の続行
  const handleConfirmZeroCost = useCallback(async () => {
    setShowZeroCostDialog(false);
    setZeroCostProducts([]);
    await runAutoPreparation(true);
  }, [runAutoPreparation]);

  // AIエンリッチメント保存 + 自動準備
  const handleEnrichmentSave = useCallback(async () => {
    if (!jsonInput.trim() || !product?.id) {
      setEnrichmentError('JSONを入力してください');
      return;
    }
    setEnrichmentError(null);
    setEnrichmentSaving(true);

    try {
      let jsonText = jsonInput.trim().replace(/```json?\s*\n?/g, '').replace(/```\s*$/g, '').trim();
      const parsed = JSON.parse(jsonText);
      const data = Array.isArray(parsed) ? parsed[0] : parsed;

      const res = await fetch('/api/ai-enrichment/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, ...data })
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      setJsonInput('');
      toast.success('✅ AI データ保存完了');
      onRefresh?.();
      
      // 出品準備自動化を実行
      await runAutoPreparation();
      
    } catch (e: any) {
      setEnrichmentError(e instanceof SyntaxError ? 'JSON形式エラー' : e.message);
      toast.error(`エラー: ${e.message}`);
    } finally {
      setEnrichmentSaving(false);
    }
  }, [jsonInput, product?.id, onRefresh, runAutoPreparation]);

  // 個別ツール実行
  const runTool = useCallback(async (toolKey: string, api: string, body?: any) => {
    if (!product?.id) return;
    setLoading(toolKey);
    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || { productIds: [String(product.id)] })
      });
      const data = await res.json();
      if (data.success || data.updated) {
        toast.success(`✅ ${toolKey} 完了`);
        onRefresh?.();
      } else {
        throw new Error(data.error || '処理に失敗しました');
      }
    } catch (e: any) {
      toast.error(`${toolKey} エラー: ${e.message}`);
    } finally {
      setLoading(null);
    }
  }, [product?.id, onRefresh]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: C.muted }}>商品データがありません</div>;
  }

  const p = product as any;
  const ld = p.listing_data || {};
  
  const dataStatus = {
    title: getStepStatus(p, 'title'),
    hts: getStepStatus(p, 'hts'),
    origin: getStepStatus(p, 'origin'),
    category: getStepStatus(p, 'category'),
    shipping_policy: getStepStatus(p, 'shipping_policy'),
    duty: getStepStatus(p, 'duty'),
    shipping: getStepStatus(p, 'shipping'),
    profit: getStepStatus(p, 'profit'),
    html: getStepStatus(p, 'html'),
    filter: getStepStatus(p, 'filter'),
    score: getStepStatus(p, 'score'),
    sm: getStepStatus(p, 'sm'),
  };

  const doneCount = Object.values(dataStatus).filter(s => s === 'done').length;
  const totalCount = Object.keys(dataStatus).length;

  const profitMargin = ld.profit_margin || p.profit_margin || 0;
  const profitAmount = ld.profit_amount_usd || p.profit_amount_usd || 0;
  const shippingPolicy = ld.usa_shipping_policy_name || p.shipping_policy || '';
  const shippingCost = ld.shipping_cost_usd || p.shipping_cost_usd || 0;
  const ddpPrice = ld.ddp_price_usd || p.ddp_price_usd || 0;
  const filterPassed = ld.filter_passed ?? p.filter_passed;
  const costJpy = ld.cost_jpy || p.price_jpy || 0;
  const isZeroCost = ld.is_zero_cost || costJpy <= 0;

  return (
    <div style={{ padding: '12px', background: C.bg, height: '100%', overflow: 'auto' }}>
      
      {/* 🔥 0円確認ダイアログ */}
      {showZeroCostDialog && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: C.panel, borderRadius: '12px', padding: '24px',
            maxWidth: '400px', width: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={32} color={C.running} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: C.text }}>
                  仕入れ価格が0円です
                </div>
                <div style={{ fontSize: '12px', color: C.muted }}>
                  本当に0円仕入れとして計算しますか？
                </div>
              </div>
            </div>
            
            <div style={{ 
              background: '#fef3c7', padding: '12px', borderRadius: '8px', 
              marginBottom: '16px', fontSize: '11px', color: '#92400e' 
            }}>
              ⚠️ <strong>注意:</strong> 誤って0円で計算すると大赤字になる可能性があります。<br/>
              0円仕入れ（自社在庫、サンプル品など）の場合のみ続行してください。
            </div>
            
            {zeroCostProducts.map((p, i) => (
              <div key={i} style={{ 
                padding: '8px', background: C.bg, borderRadius: '4px', 
                marginBottom: '8px', fontSize: '11px' 
              }}>
                <strong>{p.sku}</strong>: {p.title?.substring(0, 40)}...
              </div>
            ))}
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => { setShowZeroCostDialog(false); setZeroCostProducts([]); }}
                style={{
                  padding: '8px 16px', borderRadius: '6px', border: `1px solid ${C.border}`,
                  background: C.panel, color: C.text, cursor: 'pointer', fontSize: '12px'
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmZeroCost}
                style={{
                  padding: '8px 16px', borderRadius: '6px', border: 'none',
                  background: C.running, color: 'white', cursor: 'pointer', 
                  fontSize: '12px', fontWeight: 600
                }}
              >
                0円仕入れで計算する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 仕入れ価格警告 */}
      {isZeroCost && (
        <div style={{ 
          background: '#fef3c7', padding: '8px 12px', borderRadius: '6px', 
          marginBottom: '10px', fontSize: '11px', color: '#92400e',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <AlertTriangle size={16} />
          <span>
            <strong>仕入れ価格: ¥0</strong> - 
            {ld.is_zero_cost_confirmed ? ' ✓ 0円仕入れ確認済み' : ' 利益計算時に確認が必要です'}
          </span>
        </div>
      )}

      {/* 状態サマリー 行1 */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '8px',
        background: C.panel, padding: '10px', borderRadius: '8px', border: `1px solid ${C.border}`
      }}>
        <StatusBadge label="タイトル" status={dataStatus.title} value={p.english_title ? '✓' : '-'} />
        <StatusBadge label="HTS" status={dataStatus.hts} value={p.hts_code?.substring(0, 12) || '-'} />
        <StatusBadge label="原産国" status={dataStatus.origin} value={p.origin_country || '-'} />
        <StatusBadge label="カテゴリ" status={dataStatus.category} value={p.ebay_category_id && p.ebay_category_id !== '99999' ? p.ebay_category_id : '-'} />
        <StatusBadge label="配送ポリシー" status={dataStatus.shipping_policy} value={shippingPolicy?.substring(0, 12) || '-'} />
        <StatusBadge label="完了度" status={doneCount >= 10 ? 'done' : 'pending'} value={`${doneCount}/${totalCount}`} />
      </div>

      {/* 状態サマリー 行2 */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '12px',
        background: C.panel, padding: '10px', borderRadius: '8px', border: `1px solid ${C.border}`
      }}>
        <StatusBadge label="仕入" status={costJpy > 0 ? 'done' : 'pending'} value={costJpy > 0 ? `¥${costJpy.toLocaleString()}` : '¥0'} />
        <StatusBadge label="送料" status={dataStatus.shipping} value={shippingCost ? `$${shippingCost.toFixed(2)}` : '-'} />
        <StatusBadge label="DDP価格" status={dataStatus.duty} value={ddpPrice ? `$${ddpPrice.toFixed(2)}` : '-'} />
        <StatusBadge label="利益率" status={dataStatus.profit} value={profitMargin ? `${profitMargin.toFixed(1)}%` : '-'} />
        <StatusBadge label="フィルター" status={dataStatus.filter} value={filterPassed === true ? '✓通過' : filterPassed === false ? '✗' : '-'} />
        <StatusBadge label="スコア" status={dataStatus.score} value={p.listing_score || '-'} />
      </div>

      {/* AIデータエンリッチメント */}
      <CollapsibleSection 
        title="✨ AIデータエンリッチメント" 
        expanded={expandedSections.ai} 
        onToggle={() => toggleSection('ai')}
        badge="推奨"
        badgeColor={C.primary}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <StepNumber n={1} />
            <CompactButton onClick={handleGeneratePrompt} loading={promptLoading} icon={<FileDown size={12} />}>
              プロンプト生成
            </CompactButton>
            {generatedPrompt && (
              <CompactButton 
                onClick={handleCopyPrompt}
                variant={promptCopied ? 'success' : 'secondary'}
                icon={promptCopied ? <CheckCircle size={12} /> : <Copy size={12} />}
              >
                {promptCopied ? 'コピー済' : 'コピー'}
              </CompactButton>
            )}
            <CompactButton 
              onClick={() => window.open('https://gemini.google.com/', '_blank')}
              variant="outline"
              icon={<ExternalLink size={12} />}
            >
              Gemini
            </CompactButton>
          </div>

          {generatedPrompt && (
            <textarea
              readOnly value={generatedPrompt}
              style={{
                width: '100%', height: '80px', padding: '6px',
                border: `1px solid ${C.border}`, borderRadius: '4px',
                fontSize: '9px', fontFamily: 'monospace', resize: 'vertical', background: '#f8fafc',
              }}
            />
          )}

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <StepNumber n={2} />
            <div style={{ flex: 1 }}>
              <textarea
                placeholder="AIの回答JSONをここに貼り付け..."
                value={jsonInput} onChange={(e) => setJsonInput(e.target.value)}
                style={{
                  width: '100%', height: '60px', padding: '6px',
                  border: `1px solid ${enrichmentError ? C.error : C.border}`,
                  borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace', resize: 'vertical',
                }}
              />
              {enrichmentError && (
                <div style={{ fontSize: '10px', color: C.error, marginTop: '2px' }}>⚠️ {enrichmentError}</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <StepNumber n={3} />
            <CompactButton 
              onClick={handleEnrichmentSave}
              loading={enrichmentSaving || autoFlowRunning}
              disabled={!jsonInput.trim()}
              variant="primary"
              icon={<Rocket size={12} />}
              style={{ flex: 1 }}
            >
              保存 → 利益計算 → フィルター → スコア（自動実行）
            </CompactButton>
          </div>
        </div>
      </CollapsibleSection>

      {/* 出品準備ボタン */}
      <CollapsibleSection 
        title="🚀 出品準備（ワンクリック）" 
        expanded={expandedSections.auto} 
        onToggle={() => toggleSection('auto')}
        badge={`${doneCount}/${totalCount}`}
        badgeColor={doneCount >= 10 ? C.done : C.running}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: C.muted }}>
            <strong>利益計算</strong>（配送ポリシー選択・関税計算含む） → <strong>フィルターチェック</strong> → <strong>スコア計算</strong>
          </div>
          <CompactButton 
            onClick={() => runAutoPreparation()}
            loading={autoFlowRunning}
            variant="primary"
            icon={<Rocket size={14} />}
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            出品準備を実行
          </CompactButton>
        </div>
      </CollapsibleSection>

      {/* 個別ツール */}
      <CollapsibleSection 
        title="🔄 個別ツール" 
        expanded={expandedSections.flow} 
        onToggle={() => toggleSection('flow')}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          <FlowButton label="利益計算" status={dataStatus.profit} loading={loading === 'profit'}
            onClick={() => runTool('profit', '/api/tools/profit-calculate')} />
          <FlowButton label="フィルター" status={dataStatus.filter} loading={loading === 'filter'}
            onClick={() => runTool('filter', '/api/filter-check')} />
          <FlowButton label="スコア" status={dataStatus.score} loading={loading === 'score'}
            onClick={() => runTool('score', '/api/score/calculate')} />
          <FlowButton label="カテゴリ" status={dataStatus.category} loading={loading === 'category'}
            onClick={() => runTool('category', '/api/tools/category-analyze')} />
        </div>
        <CompactButton onClick={onRefresh} variant="outline" icon={<RefreshCw size={12} />}>
          データ更新
        </CompactButton>
      </CollapsibleSection>

      {/* その他 */}
      <CollapsibleSection 
        title="🔧 その他" 
        expanded={expandedSections.other} 
        onToggle={() => toggleSection('other')}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <FlowButton label="SM分析" status={dataStatus.sm} loading={loading === 'sm'}
            onClick={() => runTool('sm', '/api/sellermirror/analyze', { 
              productId: product.id, ebayTitle: p.english_title || p.title
            })} />
        </div>
      </CollapsibleSection>
    </div>
  );
});

// ========== サブコンポーネント ==========

function StatusBadge({ label, status, value }: { label: string; status: string; value: string | number }) {
  const color = status === 'done' ? C.done : status === 'error' ? C.error : C.muted;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '8px', color: C.muted, marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '10px', fontWeight: 600, color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </div>
    </div>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <div style={{
      width: '18px', height: '18px', borderRadius: '50%',
      background: C.primary, color: 'white',
      fontSize: '10px', fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {n}
    </div>
  );
}

function CompactButton({ children, onClick, loading, disabled, variant = 'secondary', icon, style }: { 
  children: React.ReactNode; onClick: () => void; loading?: boolean; disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'outline'; icon?: React.ReactNode; style?: React.CSSProperties;
}) {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { background: C.primary, color: 'white' },
    secondary: { background: '#e2e8f0', color: C.text },
    success: { background: C.done, color: 'white' },
    outline: { background: 'transparent', border: `1px solid ${C.border}`, color: C.text },
  };
  return (
    <button onClick={onClick} disabled={disabled || loading}
      style={{
        padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: '4px', border: 'none',
        opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
        ...variantStyles[variant], ...style,
      }}
    >
      {loading ? '⏳' : icon}
      {children}
    </button>
  );
}

function FlowButton({ label, status, loading, onClick }: { 
  label: string; status: 'done' | 'running' | 'pending' | 'error'; loading?: boolean; onClick: () => void;
}) {
  const colors = {
    done: { bg: '#dcfce7', border: C.done, text: '#166534' },
    running: { bg: '#fef3c7', border: C.running, text: '#92400e' },
    pending: { bg: '#f1f5f9', border: C.border, text: C.muted },
    error: { bg: '#fee2e2', border: C.error, text: '#991b1b' },
  };
  const c = colors[loading ? 'running' : status];
  return (
    <button onClick={onClick} disabled={loading}
      style={{
        padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 500,
        background: c.bg, border: `1px solid ${c.border}`, color: c.text,
        cursor: loading ? 'wait' : 'pointer', transition: 'all 0.15s',
      }}
    >
      {loading ? '...' : status === 'done' ? '✓ ' : status === 'error' ? '✗ ' : ''}{label}
    </button>
  );
}

function CollapsibleSection({ title, expanded, onToggle, children, badge, badgeColor }: { 
  title: string; expanded: boolean; onToggle: () => void; 
  children: React.ReactNode; badge?: string; badgeColor?: string;
}) {
  return (
    <div style={{ marginBottom: '10px', background: C.panel, borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div onClick={onToggle}
        style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', background: expanded ? '#f8fafc' : 'transparent',
          borderBottom: expanded ? `1px solid ${C.border}` : 'none',
        }}
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{title}</span>
        {badge && (
          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: badgeColor || C.primary, color: 'white', fontWeight: 500 }}>
            {badge}
          </span>
        )}
      </div>
      {expanded && <div style={{ padding: '10px 12px' }}>{children}</div>}
    </div>
  );
}
