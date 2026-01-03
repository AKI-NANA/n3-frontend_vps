// app/tools/research-n3/components/L3Tabs/analysis-tool-panel.tsx
/**
 * 分析・計算 ToolPanel
 * 利益計算、坂路比較、競合分析、リスク評価
 */

'use client';

import React, { useState } from 'react';
import { BarChart3, Calculator, Truck, Users, AlertTriangle } from 'lucide-react';

const styles = {
  section: { padding: '12px', borderBottom: '1px solid var(--n3-panel-border, #32323c)' } as React.CSSProperties,
  title: { fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
  desc: { fontSize: '11px', color: 'var(--n3-text-muted, #9ca3af)', marginBottom: '12px', lineHeight: 1.5 } as React.CSSProperties,
  inputRow: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' } as React.CSSProperties,
  inputGroup: (size: string) => ({ display: 'flex', flexDirection: 'column', gap: '4px', flex: size === 'full' ? '1 1 100%' : size === 'lg' ? '1' : '0 0 70px', minWidth: size === 'lg' ? '100px' : undefined }) as React.CSSProperties,
  label: { fontSize: '11px', color: 'var(--n3-text-muted, #9ca3af)', fontWeight: 500 } as React.CSSProperties,
  input: { height: '32px', padding: '0 10px', background: 'var(--n3-bg, #14141a)', border: '1px solid var(--n3-panel-border, #32323c)', borderRadius: '4px', color: 'var(--n3-text, #f4f4f5)', fontSize: '12px', outline: 'none' } as React.CSSProperties,
  select: { height: '32px', padding: '0 10px', background: 'var(--n3-bg, #14141a)', border: '1px solid var(--n3-panel-border, #32323c)', borderRadius: '4px', color: 'var(--n3-text, #f4f4f5)', fontSize: '12px' } as React.CSSProperties,
  btn: (variant: string, full?: boolean) => ({ height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, border: variant === 'secondary' ? '1px solid var(--n3-panel-border, #32323c)' : 'none', borderRadius: '4px', cursor: 'pointer', background: variant === 'primary' ? 'var(--n3-accent, #818cf8)' : 'var(--n3-highlight, rgba(129,140,248,0.08))', color: variant === 'secondary' ? 'var(--n3-text, #f4f4f5)' : 'white', width: full ? '100%' : undefined }) as React.CSSProperties,
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' } as React.CSSProperties,
  statCard: { background: 'var(--n3-bg, #14141a)', border: '1px solid var(--n3-panel-border, #32323c)', borderRadius: '4px', padding: '10px', textAlign: 'center' } as React.CSSProperties,
  statValue: (color?: string) => ({ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: color || 'var(--n3-text, #f4f4f5)' }) as React.CSSProperties,
  statLabel: { fontSize: '10px', color: 'var(--n3-text-muted, #9ca3af)', marginTop: '2px' } as React.CSSProperties,
  resultBox: { background: 'rgba(16,185,129,0.1)', borderRadius: '4px', padding: '12px', textAlign: 'center' } as React.CSSProperties,
};

export function AnalysisToolPanel() {
  const [sellPrice, setSellPrice] = useState('145');
  const [buyPrice, setBuyPrice] = useState('8500');
  const [weight, setWeight] = useState('500');
  const [shipping, setShipping] = useState('dhl');
  const [destination, setDestination] = useState('us');

  return (
    <>
      {/* 利益計算フォーム */}
      <div style={styles.section}>
        <div style={styles.title}>
          <BarChart3 size={16} />
          分析・計算
        </div>
        <div style={styles.desc}>
          利益計算、坂路比較、競合分析、リスク評価を行います。
        </div>

        <div style={styles.inputRow}>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>販売価格（USD）</label>
            <input
              type="number"
              style={styles.input}
              placeholder="145.00"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>仕入価格（JPY）</label>
            <input
              type="number"
              style={styles.input}
              placeholder="8500"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.inputRow}>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>重量(g)</label>
            <input
              type="number"
              style={styles.input}
              placeholder="500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>長(cm)</label>
            <input type="number" style={styles.input} placeholder="20" />
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>幅(cm)</label>
            <input type="number" style={styles.input} placeholder="15" />
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>高(cm)</label>
            <input type="number" style={styles.input} placeholder="10" />
          </div>
        </div>

        <div style={styles.inputRow}>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>配送方法</label>
            <select
              style={{ ...styles.select, width: '100%' }}
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            >
              <option value="dhl">DDP (FedEx/DHL)</option>
              <option value="ems">DDU (EMS)</option>
              <option value="sal">SAL</option>
              <option value="ship">船便</option>
            </select>
          </div>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>発送先</label>
            <select
              style={{ ...styles.select, width: '100%' }}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="us">アメリカ</option>
              <option value="uk">イギリス</option>
              <option value="au">オーストラリア</option>
              <option value="de">ドイツ</option>
              <option value="fr">フランス</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button style={styles.btn('primary', true)}>
            <Calculator size={14} />
            利益計算
          </button>
        </div>
      </div>

      {/* 計算結果 */}
      <div style={styles.section}>
        <div style={styles.title}>💰 計算結果</div>
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue()}>$145.00</div>
            <div style={styles.statLabel}>販売価格</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue()}>$57.80</div>
            <div style={styles.statLabel}>仕入</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue()}>$28.50</div>
            <div style={styles.statLabel}>送料</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue('var(--n3-color-success, #10b981)')}>$42.30</div>
            <div style={styles.statLabel}>純利益</div>
          </div>
        </div>
        <div style={styles.resultBox as any}>
          <div style={{ fontSize: '11px', color: 'var(--n3-text-muted, #9ca3af)' }}>利益率</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--n3-color-success, #10b981)' }}>29.2%</div>
        </div>
      </div>

      {/* 追加分析 */}
      <div style={styles.section}>
        <div style={styles.title}>⚡ 追加分析</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button style={styles.btn('secondary')}>
            <Truck size={14} />
            坂路比較
          </button>
          <button style={styles.btn('secondary')}>
            <Users size={14} />
            競合分析
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          <button style={styles.btn('secondary')}>
            <AlertTriangle size={14} />
            リスク評価
          </button>
          <button style={styles.btn('secondary')}>
            <BarChart3 size={14} />
            統計表示
          </button>
        </div>
      </div>
    </>
  );
}

export default AnalysisToolPanel;
