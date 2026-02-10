// app/tools/research-n3/components/L3Tabs/seller-research-tool-panel.tsx
/**
 * セラーリサーチ ToolPanel
 * 成功セラーの販売履歴を分析
 */

'use client';

import React, { useState } from 'react';
import { Search, User, Eye, Star } from 'lucide-react';

const styles = {
  section: { padding: '12px', borderBottom: '1px solid var(--n3-panel-border)' } as React.CSSProperties,
  title: { fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
  desc: { fontSize: '11px', color: 'var(--n3-text-muted)', marginBottom: '12px', lineHeight: 1.5 } as React.CSSProperties,
  inputRow: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' } as React.CSSProperties,
  inputGroup: (size: string) => ({ display: 'flex', flexDirection: 'column', gap: '4px', flex: size === 'xl' ? '1' : size === 'lg' ? '1' : '0 0 80px', minWidth: size === 'lg' ? '120px' : undefined }) as React.CSSProperties,
  label: { fontSize: '11px', color: 'var(--n3-text-muted)', fontWeight: 500 } as React.CSSProperties,
  input: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px', outline: 'none' } as React.CSSProperties,
  select: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px' } as React.CSSProperties,
  btn: (variant: string) => ({ height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, border: variant === 'secondary' ? '1px solid var(--n3-panel-border)' : 'none', borderRadius: '4px', cursor: 'pointer', background: variant === 'primary' ? 'var(--n3-accent)' : 'var(--n3-highlight)', color: variant === 'secondary' ? 'var(--n3-text)' : 'white' }) as React.CSSProperties,
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' } as React.CSSProperties,
  statCard: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', padding: '10px', textAlign: 'center' } as React.CSSProperties,
  statValue: (color?: string) => ({ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: color || 'var(--n3-text)' }) as React.CSSProperties,
  statLabel: { fontSize: '10px', color: 'var(--n3-text-muted)', marginTop: '2px' } as React.CSSProperties,
  sellerInfo: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', padding: '12px' } as React.CSSProperties,
  sellerHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' } as React.CSSProperties,
  sellerAvatar: { width: '48px', height: '48px', background: 'var(--n3-panel)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' } as React.CSSProperties,
  resultList: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' } as React.CSSProperties,
  resultItem: { display: 'flex', padding: '8px 10px', borderBottom: '1px solid var(--n3-panel-border)', alignItems: 'center', gap: '8px', cursor: 'pointer' } as React.CSSProperties,
  resultItemInfo: { flex: 1, minWidth: 0 } as React.CSSProperties,
  resultItemTitle: { fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } as React.CSSProperties,
  resultItemMeta: { fontSize: '10px', color: 'var(--n3-text-muted)' } as React.CSSProperties,
  actionBtn: { width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--n3-highlight)', border: 'none', borderRadius: '4px', color: 'var(--n3-text-muted)', cursor: 'pointer', fontSize: '12px' } as React.CSSProperties,
};

export function SellerResearchToolPanel() {
  const [sellerId, setSellerId] = useState('');
  const [analysisType, setAnalysisType] = useState('all');

  return (
    <>
      <div style={styles.section}>
        <div style={styles.title}><User size={16} /> セラーリサーチ</div>
        <div style={styles.desc}>成功しているセラーの販売履歴を分析し、売れ筋商品を発掘します。</div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('xl')}>
            <label style={styles.label}>セラーID</label>
            <input type="text" style={styles.input} placeholder="例: japan-treasures" value={sellerId} onChange={(e) => setSellerId(e.target.value)} />
          </div>
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>分析タイプ</label>
            <select style={{ ...styles.select, width: '100%' }} value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
              <option value="all">全商品取得</option>
              <option value="bestseller">売れ筋のみ</option>
              <option value="new">新着のみ</option>
            </select>
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>期間</label>
            <select style={{ ...styles.select, width: '100%' }}><option>30日</option><option>60日</option><option>90日</option></select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button style={{ ...styles.btn('primary'), width: '100%' }}><Search size={14} /> セラー分析開始</button>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>📋 セラー情報</div>
        <div style={styles.sellerInfo}>
          <div style={styles.sellerHeader}>
            <div style={styles.sellerAvatar}>👤</div>
            <div>
              <div style={{ fontWeight: 600 }}>japan-treasures</div>
              <div style={{ fontSize: '11px', color: 'var(--n3-text-muted)' }}>⭐ 99.8% (12,345)</div>
            </div>
          </div>
          <div style={styles.statsRow}>
            <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-info)')}>1,234</div><div style={styles.statLabel}>出品数</div></div>
            <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-success)')}>456</div><div style={styles.statLabel}>月間販売</div></div>
          </div>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>👥 監視中のセラー</div>
        <div style={styles.resultList}>
          <div style={styles.resultItem}>
            <div style={{ fontSize: '18px' }}>👤</div>
            <div style={styles.resultItemInfo}>
              <div style={styles.resultItemTitle}>japan-collector</div>
              <div style={styles.resultItemMeta}>⭐ 99.5% • 567商品</div>
            </div>
            <button style={styles.actionBtn}><Search size={12} /></button>
          </div>
          <div style={styles.resultItem}>
            <div style={{ fontSize: '18px' }}>👤</div>
            <div style={styles.resultItemInfo}>
              <div style={styles.resultItemTitle}>tokyo-antiques</div>
              <div style={styles.resultItemMeta}>⭐ 99.9% • 890商品</div>
            </div>
            <button style={styles.actionBtn}><Search size={12} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
