// app/tools/research-n3/components/l3-tabs/reverse-research-tool-panel.tsx
'use client';
import React, { useState } from 'react';
import { RefreshCw, Search, Bot, TrendingUp } from 'lucide-react';

const styles = {
  section: { padding: '12px', borderBottom: '1px solid var(--n3-panel-border)' } as React.CSSProperties,
  title: { fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' } as React.CSSProperties,
  desc: { fontSize: '11px', color: 'var(--n3-text-muted)', marginBottom: '12px' } as React.CSSProperties,
  inputRow: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' } as React.CSSProperties,
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 } as React.CSSProperties,
  label: { fontSize: '11px', color: 'var(--n3-text-muted)', fontWeight: 500 } as React.CSSProperties,
  input: { height: '32px', padding: '0 10px', background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', color: 'var(--n3-text)', fontSize: '12px' } as React.CSSProperties,
  btn: (variant: string, full?: boolean) => ({ height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, border: variant === 'secondary' ? '1px solid var(--n3-panel-border)' : 'none', borderRadius: '4px', cursor: 'pointer', background: variant === 'primary' ? 'var(--n3-accent)' : variant === 'success' ? 'var(--n3-color-success)' : 'var(--n3-highlight)', color: variant === 'secondary' ? 'var(--n3-text)' : 'white', width: full ? '100%' : undefined }) as React.CSSProperties,
  checkboxRow: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' } as React.CSSProperties,
  checkboxItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--n3-text-muted)', cursor: 'pointer' } as React.CSSProperties,
  supplierCard: { background: 'var(--n3-bg)', border: '1px solid var(--n3-panel-border)', borderRadius: '4px', padding: '10px', marginBottom: '8px' } as React.CSSProperties,
  supplierHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } as React.CSSProperties,
  supplierSite: (site: string) => ({ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 500, background: site === 'amazon' ? '#ff9900' : site === 'rakuten' ? '#bf0000' : '#ff0033', color: site === 'amazon' ? '#000' : '#fff' }) as React.CSSProperties,
  supplierTitle: { flex: 1, fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } as React.CSSProperties,
  supplierBody: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties,
  supplierPrice: { fontFamily: 'monospace', fontWeight: 600 } as React.CSSProperties,
  supplierProfit: { fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--n3-color-success-light)', color: 'var(--n3-color-success)' } as React.CSSProperties,
  divider: { textAlign: 'center', color: 'var(--n3-text-muted)', fontSize: '11px', margin: '8px 0' } as React.CSSProperties,
};

export function ReverseResearchToolPanel() {
  const [ebayUrl, setEbayUrl] = useState('');
  const [asin, setAsin] = useState('');

  return (
    <>
      <div style={styles.section}>
        <div style={styles.title}><RefreshCw size={16} /> 逆リサーチ</div>
        <div style={styles.desc}>売れている商品から仕入先を逆算。eBay商品URL/ASINから自動で仕入先候補を検索します。</div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>eBay商品URL</label>
            <input type="text" style={styles.input} placeholder="https://www.ebay.com/itm/123456789" value={ebayUrl} onChange={(e) => setEbayUrl(e.target.value)} />
          </div>
        </div>
        
        <div style={styles.divider as any}>または</div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ASIN / JAN / UPC</label>
            <input type="text" style={styles.input} placeholder="B08N5WRWNW, 4902370550733" value={asin} onChange={(e) => setAsin(e.target.value)} />
          </div>
        </div>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>検索サイト</label>
            <div style={styles.checkboxRow}>
              <label style={styles.checkboxItem}><input type="checkbox" defaultChecked /> Amazon JP</label>
              <label style={styles.checkboxItem}><input type="checkbox" defaultChecked /> 楽天</label>
              <label style={styles.checkboxItem}><input type="checkbox" defaultChecked /> ヤフオク</label>
              <label style={styles.checkboxItem}><input type="checkbox" /> メルカリ</label>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button style={styles.btn('primary', true)}><Search size={14} /> 仕入先を検索</button>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>🏭 仕入先候補</div>
        <div style={styles.supplierCard}>
          <div style={styles.supplierHeader}>
            <span style={styles.supplierSite('amazon')}>Amazon</span>
            <span style={styles.supplierTitle}>同一商品 - 正規品</span>
          </div>
          <div style={styles.supplierBody}>
            <span style={styles.supplierPrice}>¥8,500</span>
            <span style={styles.supplierProfit}>+$42.30</span>
          </div>
        </div>
        <div style={styles.supplierCard}>
          <div style={styles.supplierHeader}>
            <span style={styles.supplierSite('rakuten')}>楽天</span>
            <span style={styles.supplierTitle}>類似商品 - 送料無料</span>
          </div>
          <div style={styles.supplierBody}>
            <span style={styles.supplierPrice}>¥7,800</span>
            <span style={styles.supplierProfit}>+$48.50</span>
          </div>
        </div>
        <div style={styles.supplierCard}>
          <div style={styles.supplierHeader}>
            <span style={styles.supplierSite('yahoo')}>ヤフオク</span>
            <span style={styles.supplierTitle}>中古品 - 状態良好</span>
          </div>
          <div style={styles.supplierBody}>
            <span style={styles.supplierPrice}>¥5,200</span>
            <span style={styles.supplierProfit}>+$65.80</span>
          </div>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.title}>⚡ アクション</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button style={styles.btn('secondary')}><Bot size={14} /> AI探索</button>
          <button style={styles.btn('secondary')}><TrendingUp size={14} /> 利益比較</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button style={styles.btn('success', true)}>✓ 最安を承認待ちへ</button>
        </div>
      </div>
    </>
  );
}
