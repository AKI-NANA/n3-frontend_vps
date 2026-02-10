// app/tools/editing-n3/components/views/n3-research-pending-view.tsx
/**
 * Research Pending View - research_tableからの承認待ちリスト表示
 * 
 * データフロー:
 * 1. research-n3: 「Send to Catalog」 → /api/research/send-to-catalog → status = 'pending'
 * 2. editing-n3: このビューで表示 → Approve/Reject操作
 * 3. Approve: /api/research/catalog-decision → products_master へ転送
 * 4. 学習: 承認/却下の決定がlearning_memoryに反映
 */

'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { 
  CheckCircle2, XCircle, ExternalLink, Package, Loader2,
  TrendingUp, DollarSign, AlertTriangle, RefreshCw, Search,
  Sparkles, Shield, Users
} from 'lucide-react';
import { N3Button, N3Badge, N3Input, N3Tooltip } from '@/components/n3';

interface ResearchItem {
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
      profit_score: number;
      demand_score: number;
      competition_score: number;
      risk_penalty: number;
      learning_bonus: number;
    };
  };
  created_at?: string;
  updated_at?: string;
}

interface N3ResearchPendingViewProps {
  onRefresh?: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export const N3ResearchPendingView = memo(function N3ResearchPendingView({
  onRefresh,
  showToast = () => {},
}: N3ResearchPendingViewProps) {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // データ取得 - 新API使用
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/research/catalog-decision?status=pending&limit=100');
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      } else {
        throw new Error(data.error || 'データ取得に失敗');
      }
    } catch (err: any) {
      setError(err.message);
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 選択操作
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const filtered = getFilteredItems();
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(item => item.id)));
    }
  }, [selectedIds.size, searchQuery, items]);

  // フィルタリング
  const getFilteredItems = useCallback(() => {
    return items.filter(item => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.asin?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  const filteredItems = getFilteredItems();

  // 承認処理 - 新API使用
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
        setItems(prev => prev.filter(item => item.id !== id));
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        onRefresh?.();
      } else {
        throw new Error(data.error || '承認に失敗しました');
      }
    } catch (err: any) {
      showToast(`❌ ${err.message}`, 'error');
    }
    setProcessingId(null);
  }, [onRefresh, showToast]);

  // 却下処理 - 新API使用
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
        setItems(prev => prev.filter(item => item.id !== id));
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        onRefresh?.();
      } else {
        throw new Error(data.error || '却下に失敗しました');
      }
    } catch (err: any) {
      showToast(`❌ ${err.message}`, 'error');
    }
    setProcessingId(null);
  }, [onRefresh, showToast]);

  // 一括承認（高スコア・低リスクのみ）
  const handleBulkApprove = useCallback(async () => {
    const targets = filteredItems.filter(item => 
      selectedIds.has(item.id) && 
      (item.listing_score ?? 0) >= 60 && 
      (item.risk_score ?? 100) < 50
    );
    
    if (targets.length === 0) {
      showToast('承認可能なアイテムがありません（スコア60+、リスク50未満）', 'warning');
      return;
    }
    
    for (const item of targets) {
      await handleApprove(item.id);
    }
  }, [filteredItems, selectedIds, handleApprove, showToast]);

  // 一括却下
  const handleBulkReject = useCallback(async () => {
    const targets = Array.from(selectedIds);
    if (targets.length === 0) return;
    
    for (const id of targets) {
      await handleReject(id);
    }
  }, [selectedIds, handleReject]);

  // スコア色判定
  const getScoreColor = (score?: number) => {
    if (score == null) return 'var(--text-muted)';
    if (score >= 70) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  // リスク色判定
  const getRiskColor = (risk?: number) => {
    if (risk == null) return 'var(--text-muted)';
    if (risk >= 50) return 'var(--error)';
    if (risk >= 30) return 'var(--warning)';
    return 'var(--success)';
  };

  // ローディング
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  // エラー
  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <AlertTriangle size={48} style={{ color: 'var(--error)', marginBottom: 12 }} />
        <div style={{ fontSize: 14, color: 'var(--text)' }}>{error}</div>
        <N3Button variant="secondary" size="sm" onClick={loadData} style={{ marginTop: 12 }}>
          再読み込み
        </N3Button>
      </div>
    );
  }

  // 統計
  const stats = {
    total: items.length,
    highScore: items.filter(i => (i.listing_score ?? 0) >= 70).length,
    highRisk: items.filter(i => (i.risk_score ?? 0) >= 50).length,
    similarGroups: new Set(items.map(i => i.same_group_id).filter(Boolean)).size,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ツールバー */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            Research Candidates
          </span>
          <N3Badge variant="primary" size="sm">{stats.total}件</N3Badge>
          {selectedIds.size > 0 && (
            <N3Badge variant="secondary" size="sm">{selectedIds.size}件選択</N3Badge>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <N3Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ASIN/タイトル/ブランド..."
            style={{ width: 200, height: 30, fontSize: 11 }}
          />
          <N3Button 
            variant="secondary" 
            size="sm" 
            icon={<RefreshCw size={12} />}
            onClick={loadData}
            disabled={loading}
          >
            更新
          </N3Button>
        </div>
      </div>

      {/* 統計バー */}
      {stats.total > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: 24, 
          padding: '8px 12px',
          background: 'var(--highlight)',
          borderBottom: '1px solid var(--panel-border)',
          fontSize: 11,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>待機中:</span>
            <span style={{ fontWeight: 600 }}>{stats.total}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={12} style={{ color: 'var(--success)' }} />
            <span style={{ color: 'var(--text-muted)' }}>高スコア(70+):</span>
            <span style={{ fontWeight: 600, color: 'var(--success)' }}>{stats.highScore}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shield size={12} style={{ color: 'var(--error)' }} />
            <span style={{ color: 'var(--text-muted)' }}>高リスク(50+):</span>
            <span style={{ fontWeight: 600, color: 'var(--error)' }}>{stats.highRisk}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={12} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-muted)' }}>類似グループ:</span>
            <span style={{ fontWeight: 600 }}>{stats.similarGroups}</span>
          </div>
        </div>
      )}

      {/* 一括操作バー */}
      {selectedIds.size > 0 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--accent-subtle)',
          borderBottom: '1px solid var(--panel-border)',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text)' }}>
            {selectedIds.size}件選択中
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <N3Button
              variant="primary"
              size="sm"
              icon={processingId ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
              onClick={handleBulkApprove}
              disabled={!!processingId}
            >
              一括承認（スコア60+/リスク50未満）
            </N3Button>
            <N3Button
              variant="secondary"
              size="sm"
              icon={<XCircle size={12} />}
              onClick={handleBulkReject}
              disabled={!!processingId}
            >
              一括却下
            </N3Button>
          </div>
        </div>
      )}

      {/* テーブル */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {filteredItems.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Package size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div style={{ fontSize: 14, fontWeight: 500 }}>承認待ちの商品がありません</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Research画面で商品を選択し「🔬Catalogへ」ボタンで送信してください
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--panel)', zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <th style={{ padding: 8, width: 32, textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                    onChange={selectAll}
                  />
                </th>
                <th style={{ padding: 8, width: 50, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)' }}>画像</th>
                <th style={{ padding: 8, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)' }}>商品情報</th>
                <th style={{ padding: 8, width: 60, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>スコア</th>
                <th style={{ padding: 8, width: 60, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>リスク</th>
                <th style={{ padding: 8, width: 90, textAlign: 'right', fontSize: 10, color: 'var(--text-muted)' }}>利益</th>
                <th style={{ padding: 8, width: 150, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)' }}>スコア内訳</th>
                <th style={{ padding: 8, width: 120, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr 
                  key={item.id}
                  style={{ 
                    borderBottom: '1px solid var(--panel-border)',
                    background: selectedIds.has(item.id) ? 'var(--accent-subtle)' : 'transparent',
                  }}
                >
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td style={{ padding: 8 }}>
                    {item.main_image_url || item.image_url ? (
                      <img 
                        src={item.main_image_url || item.image_url} 
                        alt="" 
                        style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, background: '#fff' }}
                      />
                    ) : (
                      <div style={{ width: 40, height: 40, background: 'var(--panel-border)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={16} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title || item.asin || '-'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, marginTop: 2 }}>
                      {item.asin && (
                        <a 
                          href={`https://www.amazon.co.jp/dp/${item.asin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 2 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.asin} <ExternalLink size={9} />
                        </a>
                      )}
                      {item.brand && <span style={{ color: 'var(--text-muted)' }}>• {item.brand}</span>}
                      {item.same_group_id && (
                        <N3Badge variant="secondary" size="sm">類似</N3Badge>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <N3Tooltip content={`Listing Score: ${item.listing_score ?? 0}`}>
                      <div style={{ 
                        width: 38, 
                        height: 38, 
                        borderRadius: '50%',
                        background: `${getScoreColor(item.listing_score)}15`,
                        border: `2px solid ${getScoreColor(item.listing_score)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: getScoreColor(item.listing_score),
                        margin: '0 auto',
                      }}>
                        {Math.round(item.listing_score ?? 0)}
                      </div>
                    </N3Tooltip>
                  </td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <N3Tooltip content={`Risk Score: ${item.risk_score ?? 0} (低いほど安全)`}>
                      <div style={{ 
                        width: 38, 
                        height: 38, 
                        borderRadius: '50%',
                        background: `${getRiskColor(item.risk_score)}15`,
                        border: `2px solid ${getRiskColor(item.risk_score)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: getRiskColor(item.risk_score),
                        margin: '0 auto',
                      }}>
                        {Math.round(item.risk_score ?? 0)}
                      </div>
                    </N3Tooltip>
                  </td>
                  <td style={{ padding: 8, textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: 12, 
                      fontWeight: 600,
                      color: (item.estimated_profit_margin ?? 0) >= 20 ? 'var(--success)' : 'var(--text)',
                    }}>
                      ¥{(item.estimated_profit_jpy ?? 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {(item.estimated_profit_margin ?? 0).toFixed(1)}%
                    </div>
                  </td>
                  <td style={{ padding: 8 }}>
                    {item.learning_data?.score_breakdown ? (
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span>利益:{item.learning_data.score_breakdown.profit_score}</span>
                        <span>需要:{item.learning_data.score_breakdown.demand_score}</span>
                        <span>競合:{item.learning_data.score_breakdown.competition_score}</span>
                        <span style={{ color: item.learning_data.score_breakdown.risk_penalty < 0 ? 'var(--error)' : 'var(--text-muted)' }}>
                          リスク:{item.learning_data.score_breakdown.risk_penalty}
                        </span>
                        {item.learning_data.score_breakdown.learning_bonus !== 0 && (
                          <span style={{ color: item.learning_data.score_breakdown.learning_bonus > 0 ? 'var(--success)' : 'var(--error)' }}>
                            学習:{item.learning_data.score_breakdown.learning_bonus > 0 ? '+' : ''}{item.learning_data.score_breakdown.learning_bonus}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <N3Tooltip content="承認してCatalogに追加（学習に反映）">
                        <N3Button
                          variant="primary"
                          size="sm"
                          icon={processingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                          onClick={() => handleApprove(item.id)}
                          disabled={!!processingId}
                        >
                          承認
                        </N3Button>
                      </N3Tooltip>
                      <N3Tooltip content="却下（学習に反映）">
                        <N3Button
                          variant="secondary"
                          size="sm"
                          icon={<XCircle size={12} />}
                          onClick={() => handleReject(item.id)}
                          disabled={!!processingId}
                        >
                          却下
                        </N3Button>
                      </N3Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

export default N3ResearchPendingView;
