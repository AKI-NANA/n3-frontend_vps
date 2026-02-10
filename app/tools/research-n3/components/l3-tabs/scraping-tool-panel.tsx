// app/tools/research-n3/components/l3-tabs/scraping-tool-panel.tsx
'use client';
import React, { useState } from 'react';
import { Bug, Package, Play, Pause } from 'lucide-react';

const styles = {
  section: { padding: '12px', borderBottom: '1px solid var(--n3-panel-border)' } as React.CSSProperties,
  title: { fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
  desc: { fontSize: '11px', color: 'var(--n3-text-muted)', marginBottom: '12px' } as React.CSSProperties,
  platformTabs: { display: 'flex', gap: '4px', marginBottom: '12px' } as React.CSSProperties,
  platformTab: (isActive: boolean) => ({ flex: 1, height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: isActive ? 'white' : 'var(--n3-text-muted)', background: isActive ? 'var(--n3-accent)' : 'var(--n3-bg)', border: `1px solid ${isActive ? 'var(--n3-accent)' : 'var(--n3-panel-border)'}`, borderRadius: '4px', cursor: 'pointer' }) as React.CSSProperties,
  inputRow: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' } as React.CSSProperties,
  inputGroup: (size: string) => ({ display: 'flex', flexDirection: 'column', gap: '4px', flex: size === 'full' ? '1 1 100%' : size === 'lg' ? '1' : '0 0 80px' }) as React.CSSProperties,
  label: { fontSize: '11px', color: 'var(--n3-text-muted)', fontWeight: 500 } as React.CSSProperties,
  input: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px' } as React.CSSProperties,
  select: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px' } as React.CSSProperties,
  btn: (variant: string, full?: boolean) => ({ height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, border: variant === 'secondary' ? '1px solid var(--n3-panel-border)' : 'none', borderRadius: '4px', cursor: 'pointer', background: variant === 'primary' ? 'var(--n3-accent)' : 'var(--n3-highlight)', color: variant === 'secondary' ? 'var(--n3-text)' : 'white', width: full ? '100%' : undefined }) as React.CSSProperties,
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' } as React.CSSProperties,
  statCard: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', padding: '10px', textAlign: 'center' } as React.CSSProperties,
  statValue: (color?: string) => ({ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: color || 'var(--n3-text)' }) as React.CSSProperties,
  statLabel: { fontSize: '10px', color: 'var(--n3-text-muted)', marginTop: '2px' } as React.CSSProperties,
};

export function ScrapingToolPanel() {
  const [platform, setPlatform] = useState<'yahoo' | 'rakuten' | 'mercari'>('yahoo');

  return (
    <>
      <div style={styles.section}>
        <div style={styles.title}><Bug size={16} /> スクレイピング</div>
        <div style={styles.desc}>ヤフオク/楽天/メルカリから商品データを自動取得。スケジュール設定で定期実行。</div>
        
        <div style={styles.platformTabs}>
          {(['yahoo', 'rakuten', 'mercari'] as const).map((p) => (
            <button key={p} style={styles.platformTab(platform === p)} onClick={() => setPlatform(p)}>
              {p === 'yahoo' ? 'ヤフオク' : p === 'rakuten' ? '楽天' : 'メルカリ'}
            </button>
          ))}
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('full')}>
            <label style={styles.label}>タスク名</label>
            <input type="text" style={styles.input} placeholder="例: 骨董品 毎日取得" />
          </div>
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('full')}>
            <label style={styles.label}>キーワード（カンマ区切り）</label>
            <input type="text" style={styles.input} placeholder="骨董品, 茶道具, 花瓶" />
          </div>
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>実行頻度</label>
            <select style={{ ...styles.select, width: '100%' }}>
              <option>毎時</option>
              <option>6時間毎</option>
              <option>毎日</option>
              <option>週1回</option>
            </select>
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>時刻</label>
            <input type="time" style={styles.input} defaultValue="09:00" />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button style={styles.btn('primary', true)}><Package size={14} /> タスク作成</button>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>▶ 実行中タスク</div>
        <div style={styles.statsRow}>
          <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-success)')}>2</div><div style={styles.statLabel}>実行中</div></div>
          <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-warning)')}>3</div><div style={styles.statLabel}>停止中</div></div>
          <div style={styles.statCard}><div style={styles.statValue('var(--n3-color-info)')}>1,890</div><div style={styles.statLabel}>本日取得</div></div>
        </div>
      </div>
    </>
  );
}
