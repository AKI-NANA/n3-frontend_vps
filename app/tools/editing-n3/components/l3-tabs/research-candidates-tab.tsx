// app/tools/editing-n3/components/l3-tabs/research-candidates-tab.tsx
/**
 * Research Candidates Tab
 * research_table.status='pending' のアイテムを表示
 * Approve/Reject ボタンで承認・却下
 */

'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Package, Check, X, Loader2, RefreshCw, AlertTriangle,
  ExternalLink, TrendingUp, DollarSign, Shield, Sparkles,
} from 'lucide-react';
import { N3Button, N3Badge, useToast } from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

interface ResearchCandidate {
  id: string;
  asin?: string;
  title?: string;
  brand?: string;
  category?: string;
  main_image_url?: string;
  image_url?: string;
  amazon_price_jpy?: number;
  estimated_profit_jpy?: number;
  estimated_profit_margin?: number;
  listing_score?: number;
  risk_score?: number;
  same_group_id?: string;
  status?: string;
  learning_data?: {
    score_breakdown?: {
      profit: number;
      demand: number;
      competition: number;
      risk_penalty: number;
      learning_bonus: number;
    };
  };
  created_at?: string;
}

// ============================================================
// サブコンポーネント
// ============================================================

// スコア表示
const ScoreCircle = memo(function ScoreCircle({ 
  score, 
  label, 
  color 
}: { 
  score?: number; 
  label: string; 
  color: string;
}) {
  const displayScore = score ?? 0;
  const bgColor = displayScore >= 70 ? 'rgba(16, 185, 129, 0.15)' : 
                  displayScore >= 50 ? 'rgba(245, 158, 11, 0.15)' : 
                  'rgba(239, 68, 68, 0.15)';
  const borderColor = displayScore >= 70 ? 'rgb(16, 185, 129)' : 
                      displayScore >= 50 ? 'rgb(245, 158, 11)' : 
                      'rgb(239, 68, 68)';
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: bgColor, border: `2px solid ${borderColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, color: borderColor,
        margin: '0 auto',
      }}>
        {Math.round(displayScore)}
      </div>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
});

// 候補カード
const CandidateCard = memo(function CandidateCard({
  item,
  onApprove,
  onReject,
  isProcessing,
}: {
  item: ResearchCandidate;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  isProcessing: boolean;
}) {
  const fmtY = (n?: number) => n ? `¥${n.toLocaleString()}` : '-';
  
  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--panel-border)',
      borderRadius: 8,
      padding: 12,
      display: 'flex',
      gap: 12,
    }}>
      {/* 画像 */}
      <div style={{
        width: 80, height: 80, flexShrink: 0,
        borderRadius: 6, overflow: 'hidden',
        background: '#fff', border: '1px solid var(--panel-border)',
      }}>
        {(item.main_image_url || item.image_url) ? (
          <img 
            src={item.main_image_url || item.image_url} 
            alt="" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--highlight)',
          }}>
            <Package size={24} style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
      </div>
      
      {/* 情報 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {item.title || item.asin || 'No Title'}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 11 }}>
          {item.asin && (
            <a 
              href={`https://www.amazon.co.jp/dp/${item.asin}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              {item.asin}<ExternalLink size={10} />
            </a>
          )}
          {item.brand && <span style={{ color: 'var(--text-muted)' }}>• {item.brand}</span>}
          {item.same_group_id && (
            <N3Badge variant="secondary" size="sm">類似グループ</N3Badge>
          )}
        </div>
        
        {/* スコア情報 */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={12} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>スコア:</span>
            <span style={{ 
              fontSize: 12, fontWeight: 600, 
              color: (item.listing_score ?? 0) >= 70 ? 'var(--success)' : 
                     (item.listing_score ?? 0) >= 50 ? 'var(--warning)' : 'var(--error)'
            }}>{item.listing_score ?? 0}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shield size={12} style={{ color: (item.risk_score ?? 0) >= 50 ? 'var(--error)' : 'var(--success)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>リスク:</span>
            <span style={{ 
              fontSize: 12, fontWeight: 600,
              color: (item.risk_score ?? 0) >= 50 ? 'var(--error)' : 'var(--success)'
            }}>{item.risk_score ?? 0}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <DollarSign size={12} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>利益:</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)' }}>
              {fmtY(item.estimated_profit_jpy)} ({item.estimated_profit_margin?.toFixed(1) ?? 0}%)
            </span>
          </div>
        </div>
        
        {/* スコア内訳 */}
        {item.learning_data?.score_breakdown && (
          <div style={{ 
            display: 'flex', gap: 8, marginTop: 6, 
            fontSize: 10, color: 'var(--text-muted)' 
          }}>
            <span>利益: {item.learning_data.score_breakdown.profit}</span>
            <span>需要: {item.learning_data.score_breakdown.demand}</span>
            <span>競合: {item.learning_data.score_breakdown.competition}</span>
            <span>リスク: {item.learning_data.score_breakdown.risk_penalty}</span>
            {item.learning_data.score_breakdown.learning_bonus !== 0 && (
              <span style={{ color: item.learning_data.score_breakdown.learning_bonus > 0 ? 'var(--success)' : 'var(--error)' }}>
                学習: {item.learning_data.score_breakdown.learning_bonus > 0 ? '+' : ''}{item.learning_data.score_breakdown.learning_bonus}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* アクションボタン */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
        <N3Button
          variant="primary"
          size="sm"
          icon={isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          onClick={() => onApprove(item.id)}
          disabled={isProcessing}
          style={{ minWidth: 100 }}
        >
          Approve
        </N3Button>
        <N3Button
          variant="secondary"
          size="sm"
          icon={<X size={14} />}
          onClick={() => onReject(item.id)}
          disabled={isProcessing}
          style={{ minWidth: 100 }}
        >
          Reject
        </N3Button>
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export function ResearchCandidatesTab() {
  const [candidates, setCandidates] = useState<ResearchCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast: showToast } = useToast();
  
  // データ読み込み
  const loadCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/research/catalog-decision?status=pending&limit=100');
      const data = await res.json();
      if (data.success) {
        setCandidates(data.data || []);
      }
    } catch (err) {
      console.error('Load candidates error:', err);
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);
  
  // Approve処理
  const handleApprove = useCallback(async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/research/catalog-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision: 'approved' }),
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('✅ 承認しました。products_masterに追加されました。', 'success');
        setCandidates(prev => prev.filter(c => c.id !== id));
      } else {
        showToast(`❌ ${data.error || 'エラーが発生しました'}`, 'error');
      }
    } catch (err) {
      showToast('❌ エラーが発生しました', 'error');
    }
    setProcessingId(null);
  }, [showToast]);
  
  // Reject処理
  const handleReject = useCallback(async (id: string, reason?: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/research/catalog-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision: 'rejected', reject_reason: reason }),
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('❌ 却下しました。学習データに反映されます。', 'success');
        setCandidates(prev => prev.filter(c => c.id !== id));
      } else {
        showToast(`❌ ${data.error || 'エラーが発生しました'}`, 'error');
      }
    } catch (err) {
      showToast('❌ エラーが発生しました', 'error');
    }
    setProcessingId(null);
  }, [showToast]);
  
  // 一括Approve（上位N件）
  const handleBulkApprove = useCallback(async (count: number) => {
    const topItems = candidates
      .filter(c => (c.listing_score ?? 0) >= 70 && (c.risk_score ?? 0) < 50)
      .slice(0, count);
    
    if (topItems.length === 0) {
      showToast('承認可能なアイテムがありません（スコア70+、リスク50未満）', 'warning');
      return;
    }
    
    for (const item of topItems) {
      await handleApprove(item.id);
    }
  }, [candidates, handleApprove, showToast]);
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        height: 300, color: 'var(--text-muted)' 
      }}>
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }
  
  return (
    <div style={{ padding: 16 }}>
      {/* ヘッダー */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        marginBottom: 16 
      }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: 'var(--accent)' }} />
            Research Candidates
            <N3Badge variant="primary">{candidates.length}</N3Badge>
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            リサーチから送信された商品候補を承認・却下
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <N3Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={loadCandidates}
          >
            更新
          </N3Button>
          <N3Button
            variant="primary"
            size="sm"
            icon={<Check size={14} />}
            onClick={() => handleBulkApprove(10)}
            disabled={candidates.length === 0}
          >
            上位10件を一括承認
          </N3Button>
        </div>
      </div>
      
      {/* 統計 */}
      {candidates.length > 0 && (
        <div style={{ 
          display: 'flex', gap: 16, marginBottom: 16, 
          padding: 12, background: 'var(--highlight)', borderRadius: 8 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{candidates.length}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>待機中</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>
              {candidates.filter(c => (c.listing_score ?? 0) >= 70).length}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>高スコア (70+)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--error)' }}>
              {candidates.filter(c => (c.risk_score ?? 0) >= 50).length}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>高リスク (50+)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
              {new Set(candidates.map(c => c.same_group_id).filter(Boolean)).size}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>類似グループ</div>
          </div>
        </div>
      )}
      
      {/* リスト */}
      {candidates.length === 0 ? (
        <div style={{ 
          textAlign: 'center', padding: 60, color: 'var(--text-muted)' 
        }}>
          <Package size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>承認待ちの商品がありません</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            Research から「Send to Catalog」で送信してください
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {candidates.map(item => (
            <CandidateCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              isProcessing={processingId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ResearchCandidatesTab;
