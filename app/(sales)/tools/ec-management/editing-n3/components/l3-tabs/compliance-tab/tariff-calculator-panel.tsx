// app/tools/editing-n3/components/l3-tabs/ComplianceTab/tariff-calculator-panel.tsx
'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, Globe, ArrowRight } from 'lucide-react';
import { N3Button, N3Input, N3Select } from '@/components/n3';

const COUNTRIES = [
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TH', name: 'Thailand' },
  { code: 'IT', name: 'Italy' },
];

const DEST_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
];

interface TariffResult {
  dutyAmount: number;
  mpfAmount: number;
  totalTax: number;
  ddpPrice: number;
  dutyRate: string;
  mpfRate: string;
}

export function TariffCalculatorPanel() {
  const [htsCode, setHtsCode] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'JPY'>('USD');
  const [originCountry, setOriginCountry] = useState('JP');
  const [destCountry, setDestCountry] = useState('US');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TariffResult | null>(null);

  const handleCalculate = async () => {
    if (!htsCode || !declaredValue) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const value = parseFloat(declaredValue);
    const valueUsd = currency === 'JPY' ? value / 150 : value;
    
    const dutyRate = 0.035;
    const mpfRate = 0.003464;
    const mpfMax = 575.35;
    
    const dutyAmount = valueUsd * dutyRate;
    const mpfAmount = Math.min(valueUsd * mpfRate, mpfMax);
    const totalTax = dutyAmount + mpfAmount;
    const ddpPrice = valueUsd + totalTax;
    
    setResult({
      dutyAmount: Math.round(dutyAmount * 100) / 100,
      mpfAmount: Math.round(mpfAmount * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      ddpPrice: Math.round(ddpPrice * 100) / 100,
      dutyRate: '3.5%',
      mpfRate: '0.3464%',
    });
    
    setLoading(false);
  };

  return (
    <div style={{ padding: 16, display: 'flex', gap: 24 }}>
      {/* 入力フォーム */}
      <div style={{ width: 350, flexShrink: 0 }}>
        <div style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          padding: 20,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calculator size={16} />
            関税計算
          </h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              HTSコード (10桁)
            </label>
            <N3Input
              placeholder="9504.50.0000"
              value={htsCode}
              onChange={(e) => setHtsCode(e.target.value)}
              size="sm"
              style={{ fontFamily: 'monospace' }}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              申告価格
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <N3Input
                placeholder="100.00"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(e.target.value)}
                size="sm"
                type="number"
                style={{ flex: 1 }}
              />
              <N3Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'JPY')}
                size="sm"
                style={{ width: 80 }}
              >
                <option value="USD">USD</option>
                <option value="JPY">JPY</option>
              </N3Select>
            </div>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              原産国 → 仕向国
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <N3Select
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                size="sm"
                style={{ flex: 1 }}
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </N3Select>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              <N3Select
                value={destCountry}
                onChange={(e) => setDestCountry(e.target.value)}
                size="sm"
                style={{ flex: 1 }}
              >
                {DEST_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </N3Select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            <N3Button
              variant="primary"
              size="sm"
              onClick={handleCalculate}
              disabled={loading || !htsCode || !declaredValue}
              loading={loading}
              style={{ flex: 1 }}
            >
              計算
            </N3Button>
            <N3Button
              variant="ghost"
              size="sm"
              onClick={() => { setHtsCode(''); setDeclaredValue(''); setResult(null); }}
            >
              クリア
            </N3Button>
          </div>
        </div>
      </div>
      
      {/* 結果 */}
      <div style={{ flex: 1 }}>
        {result ? (
          <div style={{
            background: 'var(--panel)',
            borderRadius: 8,
            border: '1px solid var(--panel-border)',
            padding: 24,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>計算結果</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={{ padding: 16, background: 'var(--highlight)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>関税額 (Duty)</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace' }}>
                  ${result.dutyAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>税率: {result.dutyRate}</div>
              </div>
              
              <div style={{ padding: 16, background: 'var(--highlight)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>MPF</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace' }}>
                  ${result.mpfAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>税率: {result.mpfRate} (上限$575.35)</div>
              </div>
            </div>
            
            <div style={{
              padding: 20,
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 8,
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>税金合計:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>${result.totalTax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'rgb(34, 197, 94)' }}>DDP価格:</span>
                <span style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: 'rgb(34, 197, 94)' }}>
                  ${result.ddpPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            padding: 48,
            textAlign: 'center',
            color: 'var(--text-muted)',
            background: 'var(--panel)',
            borderRadius: 8,
            border: '1px solid var(--panel-border)',
          }}>
            <Calculator size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <div>HTSコードと申告価格を入力して「計算」をクリックしてください</div>
          </div>
        )}
      </div>
    </div>
  );
}
