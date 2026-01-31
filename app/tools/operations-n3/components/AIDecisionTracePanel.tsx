// app/tools/operations-n3/components/AIDecisionTracePanel.tsx
// ========================================
// 🧠 N3 Empire OS V8.2.1-Autonomous
// UI-002: AI判断証跡ビューア
// ========================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ========================================
// 型定義
// ========================================

interface AIDecisionTrace {
  id: string;
  tenant_id: string;
  decision_type: string;
  decision_category: string;
  input_summary: string;
  ai_model: string;
  ai_confidence_score: number;
  final_decision: string;
  decision_reasoning: string;
  requires_hitl: boolean;
  hitl_reason: string | null;
  human_override: boolean;
  human_decision: string | null;
  was_executed: boolean;
  workflow_id: string | null;
  api_cost_usd: number | null;
  tokens_used: number | null;
  created_at: string;
  score_breakdown: Record<string, number>;
  alternatives: Array<{ name: string; score: number }>;
}

interface FilterState {
  decisionType: string;
  aiModel: string;
  dateFrom: string;
  dateTo: string;
  minConfidence: number;
  requiresHitl: boolean | null;
  wasExecuted: boolean | null;
}

// ========================================
// スタイル
// ========================================

const styles = {
  container: {
    padding: '24px',
    height: '100%',
    overflow: 'auto',
    background: '#0f172a',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  } as React.CSSProperties,
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: '12px',
  } as React.CSSProperties,
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
    padding: '16px',
    background: '#1e293b',
    borderRadius: '8px',
    border: '1px solid #334155',
  } as React.CSSProperties,
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  } as React.CSSProperties,
  filterLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  filterInput: {
    padding: '8px 12px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    minWidth: '150px',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  } as React.CSSProperties,
  tableHeader: {
    background: '#1e293b',
    position: 'sticky',
    top: 0,
  } as React.CSSProperties,
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    borderBottom: '1px solid #334155',
  } as React.CSSProperties,
  tr: {
    borderBottom: '1px solid #1e293b',
    cursor: 'pointer',
    transition: 'background 0.2s',
  } as React.CSSProperties,
  trHover: {
    background: '#1e293b',
  } as React.CSSProperties,
  td: {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#e2e8f0',
  } as React.CSSProperties,
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
  } as React.CSSProperties,
  badgeSuccess: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
  } as React.CSSProperties,
  badgeWarning: {
    background: 'rgba(234, 179, 8, 0.1)',
    color: '#eab308',
  } as React.CSSProperties,
  badgeError: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
  } as React.CSSProperties,
  badgeInfo: {
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
  } as React.CSSProperties,
  confidenceBar: {
    width: '60px',
    height: '6px',
    background: '#334155',
    borderRadius: '3px',
    overflow: 'hidden',
  } as React.CSSProperties,
  confidenceFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s',
  } as React.CSSProperties,
  detailPanel: {
    background: '#1e293b',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '20px',
    border: '1px solid #334155',
  } as React.CSSProperties,
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #334155',
  } as React.CSSProperties,
  detailTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
  } as React.CSSProperties,
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  } as React.CSSProperties,
  detailSection: {
    background: '#0f172a',
    borderRadius: '6px',
    padding: '16px',
  } as React.CSSProperties,
  detailSectionTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: '12px',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  detailText: {
    fontSize: '13px',
    color: '#e2e8f0',
    lineHeight: '1.6',
  } as React.CSSProperties,
  scoreBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as React.CSSProperties,
  scoreItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
  } as React.CSSProperties,
  scoreLabel: {
    color: '#9ca3af',
  } as React.CSSProperties,
  scoreValue: {
    color: '#fff',
    fontWeight: '500',
  } as React.CSSProperties,
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  buttonPrimary: {
    background: '#3b82f6',
    color: '#fff',
  } as React.CSSProperties,
  buttonSecondary: {
    background: '#334155',
    color: '#fff',
  } as React.CSSProperties,
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    padding: '16px',
    background: '#1e293b',
    borderRadius: '8px',
  } as React.CSSProperties,
  paginationInfo: {
    color: '#9ca3af',
    fontSize: '13px',
  } as React.CSSProperties,
  paginationButtons: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af',
  } as React.CSSProperties,
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af',
  } as React.CSSProperties,
};

// ========================================
// モックデータ（API未実装時）
// ========================================

const MOCK_TRACES: AIDecisionTrace[] = [
  {
    id: '1',
    tenant_id: '00000000-0000-0000-0000-000000000000',
    decision_type: 'selsimilar',
    decision_category: 'research',
    input_summary: 'LEGO Star Wars 75192 Millennium Falcon - 類似商品検索',
    ai_model: 'gpt-4o',
    ai_confidence_score: 0.82,
    final_decision: 'auto_approved',
    decision_reasoning: '確信度82%が閾値75%を超えたため自動承認。次点との差は15pt。',
    requires_hitl: false,
    hitl_reason: null,
    human_override: false,
    human_decision: null,
    was_executed: true,
    workflow_id: 'wf_selsimilar_001',
    api_cost_usd: 0.015,
    tokens_used: 1250,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    score_breakdown: { title: 78, image: 85, price: 75, brand: 90 },
    alternatives: [
      { name: 'LEGO 75192 (eBay #1)', score: 82 },
      { name: 'LEGO 75192 (eBay #2)', score: 67 },
      { name: 'Similar Set 75257', score: 45 },
    ],
  },
  {
    id: '2',
    tenant_id: '00000000-0000-0000-0000-000000000000',
    decision_type: 'exit_strategy',
    decision_category: 'operations',
    input_summary: 'SKU: ABC123 - 45日間停滞、撤退判定',
    ai_model: 'gpt-4o-mini',
    ai_confidence_score: 0.65,
    final_decision: 'hitl_required',
    decision_reasoning: '確信度65%が閾値75%未満のためHitL承認を要求。',
    requires_hitl: true,
    hitl_reason: '損失額が閾値を超過（予想: ¥12,500）',
    human_override: false,
    human_decision: null,
    was_executed: false,
    workflow_id: 'wf_exit_001',
    api_cost_usd: 0.008,
    tokens_used: 850,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    score_breakdown: { stagnation: 90, market_trend: 45, recovery_chance: 30 },
    alternatives: [
      { name: 'Soft Exit (15%値下げ)', score: 65 },
      { name: 'Hard Exit (オークション)', score: 55 },
      { name: 'Hold (様子見)', score: 40 },
    ],
  },
  {
    id: '3',
    tenant_id: '00000000-0000-0000-0000-000000000000',
    decision_type: 'price_optimization',
    decision_category: 'listing',
    input_summary: '100商品の価格最適化バッチ処理',
    ai_model: 'gemini-2.0-flash',
    ai_confidence_score: 0.91,
    final_decision: 'auto_approved',
    decision_reasoning: '全商品の価格調整が市場相場の±5%以内。高確信度のため自動承認。',
    requires_hitl: false,
    hitl_reason: null,
    human_override: false,
    human_decision: null,
    was_executed: true,
    workflow_id: 'wf_price_001',
    api_cost_usd: 0.042,
    tokens_used: 3200,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    score_breakdown: { market_alignment: 95, profit_margin: 88, competition: 90 },
    alternatives: [],
  },
];

// ========================================
// コンポーネント
// ========================================

export function AIDecisionTracePanel() {
  const [traces, setTraces] = useState<AIDecisionTrace[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<AIDecisionTrace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    decisionType: '',
    aiModel: '',
    dateFrom: '',
    dateTo: '',
    minConfidence: 0,
    requiresHitl: null,
    wasExecuted: null,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  const pageSize = 20;
  
  // データ取得
  const fetchTraces = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // const response = await fetch(`/api/ai/decision-traces?page=${page}&pageSize=${pageSize}&...filters`);
      // const data = await response.json();
      
      // モックデータを使用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredTraces = [...MOCK_TRACES];
      
      if (filters.decisionType) {
        filteredTraces = filteredTraces.filter(t => t.decision_type === filters.decisionType);
      }
      if (filters.aiModel) {
        filteredTraces = filteredTraces.filter(t => t.ai_model === filters.aiModel);
      }
      if (filters.minConfidence > 0) {
        filteredTraces = filteredTraces.filter(t => t.ai_confidence_score >= filters.minConfidence / 100);
      }
      if (filters.requiresHitl !== null) {
        filteredTraces = filteredTraces.filter(t => t.requires_hitl === filters.requiresHitl);
      }
      
      setTraces(filteredTraces);
      setTotalPages(Math.ceil(filteredTraces.length / pageSize));
      
    } catch (error) {
      console.error('Failed to fetch decision traces:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);
  
  useEffect(() => {
    fetchTraces();
  }, [fetchTraces]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return '#22c55e';
    if (score >= 0.6) return '#eab308';
    return '#ef4444';
  };
  
  const getDecisionTypeName = (type: string) => {
    const names: Record<string, string> = {
      selsimilar: '類似商品特定',
      exit_strategy: '撤退判定',
      price_optimization: '価格最適化',
      listing: '出品判定',
      research: 'リサーチ',
    };
    return names[type] || type;
  };
  
  const handleExportCSV = () => {
    const headers = ['ID', '日時', 'タイプ', 'モデル', '確信度', '決定', 'HitL', '理由'];
    const rows = traces.map(t => [
      t.id,
      t.created_at,
      t.decision_type,
      t.ai_model,
      (t.ai_confidence_score * 100).toFixed(1) + '%',
      t.final_decision,
      t.requires_hitl ? 'Yes' : 'No',
      t.decision_reasoning,
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ai_decision_traces_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };
  
  return (
    <div style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          🧠 AI判断証跡ビューア
        </h2>
        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={fetchTraces}
          >
            🔄 更新
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={handleExportCSV}
          >
            📥 CSV出力
          </button>
        </div>
      </div>
      
      {/* フィルターバー */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup as React.CSSProperties}>
          <label style={styles.filterLabel as React.CSSProperties}>決定タイプ</label>
          <select
            style={styles.filterInput}
            value={filters.decisionType}
            onChange={e => setFilters(f => ({ ...f, decisionType: e.target.value }))}
          >
            <option value="">すべて</option>
            <option value="selsimilar">類似商品特定</option>
            <option value="exit_strategy">撤退判定</option>
            <option value="price_optimization">価格最適化</option>
            <option value="listing">出品判定</option>
          </select>
        </div>
        
        <div style={styles.filterGroup as React.CSSProperties}>
          <label style={styles.filterLabel as React.CSSProperties}>AIモデル</label>
          <select
            style={styles.filterInput}
            value={filters.aiModel}
            onChange={e => setFilters(f => ({ ...f, aiModel: e.target.value }))}
          >
            <option value="">すべて</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          </select>
        </div>
        
        <div style={styles.filterGroup as React.CSSProperties}>
          <label style={styles.filterLabel as React.CSSProperties}>最低確信度</label>
          <input
            type="number"
            style={{ ...styles.filterInput, width: '80px' }}
            value={filters.minConfidence || ''}
            onChange={e => setFilters(f => ({ ...f, minConfidence: parseInt(e.target.value) || 0 }))}
            placeholder="0"
            min={0}
            max={100}
          />
        </div>
        
        <div style={styles.filterGroup as React.CSSProperties}>
          <label style={styles.filterLabel as React.CSSProperties}>HitL必要</label>
          <select
            style={styles.filterInput}
            value={filters.requiresHitl === null ? '' : filters.requiresHitl ? 'yes' : 'no'}
            onChange={e => setFilters(f => ({
              ...f,
              requiresHitl: e.target.value === '' ? null : e.target.value === 'yes'
            }))}
          >
            <option value="">すべて</option>
            <option value="yes">HitL必要</option>
            <option value="no">自動承認</option>
          </select>
        </div>
      </div>
      
      {/* テーブル */}
      {isLoading ? (
        <div style={styles.loading as React.CSSProperties}>読み込み中...</div>
      ) : traces.length === 0 ? (
        <div style={styles.emptyState as React.CSSProperties}>
          <p>🔍 該当する判断証跡がありません</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>フィルター条件を変更してみてください</p>
        </div>
      ) : (
        <>
          <table style={styles.table}>
            <thead style={styles.tableHeader as React.CSSProperties}>
              <tr>
                <th style={styles.th as React.CSSProperties}>日時</th>
                <th style={styles.th as React.CSSProperties}>タイプ</th>
                <th style={styles.th as React.CSSProperties}>概要</th>
                <th style={styles.th as React.CSSProperties}>モデル</th>
                <th style={styles.th as React.CSSProperties}>確信度</th>
                <th style={styles.th as React.CSSProperties}>決定</th>
                <th style={styles.th as React.CSSProperties}>コスト</th>
              </tr>
            </thead>
            <tbody>
              {traces.map(trace => (
                <tr
                  key={trace.id}
                  style={{
                    ...styles.tr,
                    ...(hoveredRow === trace.id ? styles.trHover : {}),
                    ...(selectedTrace?.id === trace.id ? { background: '#1e293b' } : {})
                  }}
                  onClick={() => setSelectedTrace(trace)}
                  onMouseEnter={() => setHoveredRow(trace.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.td as React.CSSProperties}>{formatDate(trace.created_at)}</td>
                  <td style={styles.td as React.CSSProperties}>
                    <span style={{
                      ...styles.badge,
                      ...styles.badgeInfo
                    }}>
                      {getDecisionTypeName(trace.decision_type)}
                    </span>
                  </td>
                  <td style={{ ...styles.td as React.CSSProperties, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trace.input_summary}
                  </td>
                  <td style={styles.td as React.CSSProperties}>{trace.ai_model}</td>
                  <td style={styles.td as React.CSSProperties}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={styles.confidenceBar}>
                        <div
                          style={{
                            ...styles.confidenceFill,
                            width: `${trace.ai_confidence_score * 100}%`,
                            background: getConfidenceColor(trace.ai_confidence_score)
                          }}
                        />
                      </div>
                      <span style={{ color: getConfidenceColor(trace.ai_confidence_score), fontWeight: '500' }}>
                        {(trace.ai_confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td style={styles.td as React.CSSProperties}>
                    <span style={{
                      ...styles.badge,
                      ...(trace.requires_hitl ? styles.badgeWarning : styles.badgeSuccess)
                    }}>
                      {trace.requires_hitl ? '⏳ HitL待ち' : '✓ 自動承認'}
                    </span>
                  </td>
                  <td style={styles.td as React.CSSProperties}>
                    {trace.api_cost_usd ? `$${trace.api_cost_usd.toFixed(3)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* 詳細パネル */}
          {selectedTrace && (
            <div style={styles.detailPanel}>
              <div style={styles.detailHeader}>
                <h3 style={styles.detailTitle}>
                  {getDecisionTypeName(selectedTrace.decision_type)} - 詳細
                </h3>
                <button
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                  onClick={() => setSelectedTrace(null)}
                >
                  ✕ 閉じる
                </button>
              </div>
              
              <div style={styles.detailGrid}>
                {/* 入力サマリー */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle as React.CSSProperties}>入力データ</h4>
                  <p style={styles.detailText as React.CSSProperties}>{selectedTrace.input_summary}</p>
                </div>
                
                {/* 決定理由 */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle as React.CSSProperties}>決定理由</h4>
                  <p style={styles.detailText as React.CSSProperties}>{selectedTrace.decision_reasoning}</p>
                </div>
                
                {/* スコア内訳 */}
                {Object.keys(selectedTrace.score_breakdown).length > 0 && (
                  <div style={styles.detailSection}>
                    <h4 style={styles.detailSectionTitle as React.CSSProperties}>スコア内訳</h4>
                    <div style={styles.scoreBreakdown as React.CSSProperties}>
                      {Object.entries(selectedTrace.score_breakdown).map(([key, value]) => (
                        <div key={key} style={styles.scoreItem}>
                          <span style={styles.scoreLabel as React.CSSProperties}>{key}</span>
                          <span style={styles.scoreValue as React.CSSProperties}>{value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 代替案 */}
                {selectedTrace.alternatives.length > 0 && (
                  <div style={styles.detailSection}>
                    <h4 style={styles.detailSectionTitle as React.CSSProperties}>検討された選択肢</h4>
                    <div style={styles.scoreBreakdown as React.CSSProperties}>
                      {selectedTrace.alternatives.map((alt, idx) => (
                        <div key={idx} style={styles.scoreItem}>
                          <span style={{
                            ...styles.scoreLabel as React.CSSProperties,
                            fontWeight: idx === 0 ? '600' : '400',
                            color: idx === 0 ? '#22c55e' : '#9ca3af'
                          }}>
                            {idx === 0 ? '✓ ' : ''}{alt.name}
                          </span>
                          <span style={styles.scoreValue as React.CSSProperties}>{alt.score}pt</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* メタ情報 */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle as React.CSSProperties}>実行情報</h4>
                  <div style={styles.scoreBreakdown as React.CSSProperties}>
                    <div style={styles.scoreItem}>
                      <span style={styles.scoreLabel as React.CSSProperties}>ワークフローID</span>
                      <span style={styles.scoreValue as React.CSSProperties}>{selectedTrace.workflow_id || '-'}</span>
                    </div>
                    <div style={styles.scoreItem}>
                      <span style={styles.scoreLabel as React.CSSProperties}>トークン使用量</span>
                      <span style={styles.scoreValue as React.CSSProperties}>{selectedTrace.tokens_used?.toLocaleString() || '-'}</span>
                    </div>
                    <div style={styles.scoreItem}>
                      <span style={styles.scoreLabel as React.CSSProperties}>APIコスト</span>
                      <span style={styles.scoreValue as React.CSSProperties}}>
                        {selectedTrace.api_cost_usd ? `$${selectedTrace.api_cost_usd.toFixed(4)}` : '-'}
                      </span>
                    </div>
                    <div style={styles.scoreItem}>
                      <span style={styles.scoreLabel as React.CSSProperties}>実行済み</span>
                      <span style={styles.scoreValue as React.CSSProperties}}>
                        {selectedTrace.was_executed ? '✓ はい' : '✗ いいえ'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* ページネーション */}
          <div style={styles.pagination}>
            <span style={styles.paginationInfo as React.CSSProperties}>
              全{traces.length}件
            </span>
            <div style={styles.paginationButtons}>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  ...(page === 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                }}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← 前へ
              </button>
              <span style={{ color: '#fff', padding: '0 12px' }}>
                {page} / {totalPages}
              </span>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  ...(page === totalPages ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                }}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                次へ →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AIDecisionTracePanel;
