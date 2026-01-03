// app/tools/research-n3/components/L3Tabs/ai-proposal-tool-panel.tsx
'use client';
import React, { useState } from 'react';
import { Bot, Search, Eye, TrendingUp, Target, Calendar } from 'lucide-react';

const styles = {
  section: { padding: '12px', borderBottom: '1px solid var(--n3-panel-border)' } as React.CSSProperties,
  title: { fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
  desc: { fontSize: '11px', color: 'var(--n3-text-muted)', marginBottom: '12px' } as React.CSSProperties,
  inputRow: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' } as React.CSSProperties,
  inputGroup: (size: string) => ({ display: 'flex', flexDirection: 'column', gap: '4px', flex: size === 'full' ? '1 1 100%' : size === 'lg' ? '1' : '0 0 80px' }) as React.CSSProperties,
  label: { fontSize: '11px', color: 'var(--n3-text-muted)', fontWeight: 500 } as React.CSSProperties,
  input: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px' } as React.CSSProperties,
  select: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px' } as React.CSSProperties,
  btn: (variant: string, full?: boolean) => ({ height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, border: variant === 'secondary' ? '1px solid var(--n3-panel-border)' : 'none', borderRadius: '4px', cursor: 'pointer', background: variant === 'primary' ? 'var(--n3-accent)' : 'var(--n3-highlight)', color: variant === 'secondary' ? 'var(--n3-text)' : 'white', width: full ? '100%' : undefined }) as React.CSSProperties,
  checkboxRow: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' } as React.CSSProperties,
  checkboxItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--n3-text-muted)', cursor: 'pointer' } as React.CSSProperties,
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' } as React.CSSProperties,
  statCard: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', padding: '10px', textAlign: 'center' } as React.CSSProperties,
  statValue: (color?: string) => ({ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: color || 'var(--n3-text)' }) as React.CSSProperties,
  statLabel: { fontSize: '10px', color: 'var(--n3-text-muted)', marginTop: '2px' } as React.CSSProperties,
  resultList: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' } as React.CSSProperties,
  resultItem: { display: 'flex', padding: '8px 10px', borderBottom: '1px solid var(--n3-panel-border)', alignItems: 'center', gap: '8px', cursor: 'pointer' } as React.CSSProperties,
  resultItemInfo: { flex: 1, minWidth: 0 } as React.CSSProperties,
  resultItemTitle: { fontSize: '11px', fontWeight: 500 } as React.CSSProperties,
  resultItemMeta: { fontSize: '10px', color: 'var(--n3-text-muted)' } as React.CSSProperties,
  actionBtn: { width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--n3-highlight)', border: 'none', borderRadius: '4px', color: 'var(--n3-text-muted)', cursor: 'pointer', fontSize: '12px' } as React.CSSProperties,
};

export function AIProposalToolPanel() {
  return (
    <>
      <div style={styles.section}>
        <div style={styles.title}><Bot size={16} /> AI提案</div>
        <div style={styles.desc}>AIがトレンド分析・ニッチ市場発掘・季節商品を提案します。</div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('full')}>
            <label style={styles.label}>提案タイプ</label>
            <div style={styles.checkboxRow}>
              <label style={styles.checkboxItem}><input type="checkbox" defaultChecked /> トレンド</label>
              <label style={styles.checkboxItem}><input type="checkbox" defaultChecked /> ニッチ</label>
              <label style={styles.checkboxItem}><input type="checkbox" defaultChecked /> 季節</label>
              <label style={styles.checkboxItem}><input type="checkbox" /> 未開拓</label>
            </div>
          </div>
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>対象カテゴリ</label>
            <select style={{ ...styles.select, width: '100%' }}>
              <option>すべて</option>
              <option>日本の伝統工芸</option>
              <option>アニメ・ゲーム</option>
            </select>
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>提案数</label>
            <input type="number" style={styles.input} defaultValue={10} />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button style={styles.btn('primary', true)}><Bot size={14} /> AI提案を生成</button>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>💡 最新の提案</div>
        <div style={styles.resultList}>
          <div style={styles.resultItem}>
            <div style={{ fontSize: '18px' }}>📈</div>
            <div style={styles.resultItemInfo}>
              <div style={styles.resultItemTitle}>和紙製品（トレンド）</div>
              <div style={styles.resultItemMeta}>信頼度 92% • 競合低</div>
            </div>
            <button style={styles.actionBtn}><Eye size={12} /></button>
          </div>
          <div style={styles.resultItem}>
            <div style={{ fontSize: '18px' }}>🎯</div>
            <div style={styles.resultItemInfo}>
              <div style={styles.resultItemTitle}>ビンテージラジオ（ニッチ）</div>
              <div style={styles.resultItemMeta}>信頼度 85% • 高利益</div>
            </div>
            <button style={styles.actionBtn}><Eye size={12} /></button>
          </div>
          <div style={styles.resultItem}>
            <div style={{ fontSize: '18px' }}>🎄</div>
            <div style={styles.resultItemInfo}>
              <div style={styles.resultItemTitle}>正月飾り（季節）</div>
              <div style={styles.resultItemMeta}>信頼度 78% • 今がチャンス</div>
            </div>
            <button style={styles.actionBtn}><Eye size={12} /></button>
          </div>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>📊 提案統計</div>
        <div style={styles.statsRow}>
          <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-info)')}>45</div><div style={styles.statLabel}>総提案数</div></div>
          <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-success)')}>15</div><div style={styles.statLabel}>採用済み</div></div>
          <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-purple)')}>87%</div><div style={styles.statLabel}>平均信頼度</div></div>
        </div>
      </div>
    </>
  );
}
