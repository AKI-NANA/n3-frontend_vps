// app/tools/research-n3/components/L3Tabs/batch-research-tool-panel.tsx
'use client';
import React, { useState } from 'react';
import { Package, Play, Pause } from 'lucide-react';

const styles = {
  section: { padding: '12px', borderBottom: '1px solid var(--n3-panel-border)' } as React.CSSProperties,
  title: { fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
  desc: { fontSize: '11px', color: 'var(--n3-text-muted)', marginBottom: '12px' } as React.CSSProperties,
  inputRow: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' } as React.CSSProperties,
  inputGroup: (size: string) => ({ display: 'flex', flexDirection: 'column', gap: '4px', flex: size === 'full' ? '1 1 100%' : size === 'lg' ? '1' : '0 0 80px' }) as React.CSSProperties,
  label: { fontSize: '11px', color: 'var(--n3-text-muted)', fontWeight: 500 } as React.CSSProperties,
  input: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px' } as React.CSSProperties,
  select: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px' } as React.CSSProperties,
  textarea: { padding: '8px 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px', resize: 'vertical', minHeight: '60px' } as React.CSSProperties,
  btn: (variant: string) => ({ height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, border: variant === 'secondary' ? '1px solid var(--n3-panel-border)' : 'none', borderRadius: '4px', cursor: 'pointer', background: variant === 'primary' ? 'var(--n3-accent)' : variant === 'warning' ? 'var(--n3-color-warning)' : 'var(--n3-highlight)', color: variant === 'secondary' ? 'var(--n3-text)' : 'white' }) as React.CSSProperties,
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' } as React.CSSProperties,
  statCard: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', padding: '10px', textAlign: 'center' } as React.CSSProperties,
  statValue: (color?: string) => ({ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: color || 'var(--n3-text)' }) as React.CSSProperties,
  statLabel: { fontSize: '10px', color: 'var(--n3-text-muted)', marginTop: '2px' } as React.CSSProperties,
  progress: { height: '6px', background: 'var(--n3-panel-border)', borderRadius: '3px', overflow: 'hidden' } as React.CSSProperties,
  progressBar: (width: number) => ({ height: '100%', width: `${width}%`, background: 'var(--n3-accent)' }) as React.CSSProperties,
  jobCard: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', padding: '10px', marginBottom: '8px' } as React.CSSProperties,
};

export function BatchResearchToolPanel() {
  const [jobName, setJobName] = useState('');
  const [jobType, setJobType] = useState('seller');
  const [inputData, setInputData] = useState('');

  return (
    <>
      <div style={styles.section}>
        <div style={styles.title}><Package size={16} /> バッチリサーチ</div>
        <div style={styles.desc}>大量のセラーID/キーワード/ASINを一括で処理します。日付分割で安全に実行。</div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('full')}>
            <label style={styles.label}>ジョブ名</label>
            <input type="text" style={styles.input} placeholder="例: 日本骨董品セラー一括" value={jobName} onChange={(e) => setJobName(e.target.value)} />
          </div>
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>タイプ</label>
            <select style={{ ...styles.select, width: '100%' }} value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="seller">セラーID一括</option>
              <option value="keyword">キーワード一括</option>
              <option value="asin">ASIN一括</option>
            </select>
          </div>
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('full')}>
            <label style={styles.label}>入力データ（1行1件）</label>
            <textarea style={styles.textarea as any} rows={3} placeholder="japan-collector&#10;tokyo-antiques" value={inputData} onChange={(e) => setInputData(e.target.value)} />
          </div>
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>期間</label>
            <select style={{ ...styles.select, width: '100%' }}><option>30日</option><option>60日</option><option>90日</option></select>
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>分割単位</label>
            <select style={{ ...styles.select, width: '100%' }}><option>7日</option><option>14日</option><option>30日</option></select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button style={{ ...styles.btn('primary'), width: '100%' }}><Package size={14} /> ジョブ作成・実行</button>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>▶ 実行中ジョブ</div>
        <div style={styles.statsRow}>
          <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-warning)')}>3</div><div style={styles.statLabel}>実行中</div></div>
          <div style={styles.statCard}><div style={styles.statValue()}>12,456</div><div style={styles.statLabel}>タスク総数</div></div>
          <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-success)')}>8,234</div><div style={styles.statLabel}>完了</div></div>
        </div>
        
        <div style={styles.jobCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
            <span>japan-collector 30日</span><span>65%</span>
          </div>
          <div style={styles.progress}><div style={styles.progressBar(65)} /></div>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>⚡ アクション</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={styles.btn('warning')}><Pause size={14} /> 全て一時停止</button>
          <button style={styles.btn('secondary')}>📋 ログ確認</button>
        </div>
      </div>
    </>
  );
}
