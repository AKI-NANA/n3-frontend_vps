// app/tools/editing-n3/components/l3-tabs/LogisticsTab/shipping-calculator-panel.tsx
'use client';

import React, { useState } from 'react';
import { Calculator, Package, Globe, DollarSign, Truck } from 'lucide-react';
import { N3Button, N3Input, N3Select, N3Checkbox, N3Divider } from '@/components/n3';
import { N3StatsGrid, N3StatItem } from '@/components/n3/container/n3-stats-grid';

interface ShippingResult {
  carrier: string;
  service: string;
  price: number;
  currency: string;
  deliveryDays: string;
  isLowest?: boolean;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
];

const CARRIERS = ['FedEx', 'DHL', 'UPS', 'USPS', 'Japan Post'];

export function ShippingCalculatorPanel() {
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [weight, setWeight] = useState('');
  const [destination, setDestination] = useState('US');
  const [declaredValue, setDeclaredValue] = useState('');
  const [withSignature, setWithSignature] = useState(false);
  const [withInsurance, setWithInsurance] = useState(false);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>(CARRIERS);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShippingResult[]>([]);
  const [calculatedWeights, setCalculatedWeights] = useState<{
    actual: number;
    volumetric: number;
    chargeable: number;
  } | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    
    // デモ計算
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const l = parseFloat(dimensions.length) || 0;
    const w = parseFloat(dimensions.width) || 0;
    const h = parseFloat(dimensions.height) || 0;
    const actualWeight = parseFloat(weight) || 0;
    const volumetricWeight = (l * w * h) / 5000;
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);
    
    setCalculatedWeights({
      actual: actualWeight,
      volumetric: Math.round(volumetricWeight * 100) / 100,
      chargeable: Math.round(chargeableWeight * 100) / 100,
    });
    
    // デモ結果
    const demoResults: ShippingResult[] = [
      { carrier: 'Japan Post', service: 'EMS', price: 2800, currency: 'JPY', deliveryDays: '3-5' },
      { carrier: 'FedEx', service: 'International Economy', price: 4200, currency: 'JPY', deliveryDays: '4-6' },
      { carrier: 'DHL', service: 'Express', price: 5100, currency: 'JPY', deliveryDays: '2-3' },
      { carrier: 'UPS', service: 'Worldwide Expedited', price: 4800, currency: 'JPY', deliveryDays: '3-5' },
    ].filter(r => selectedCarriers.includes(r.carrier));
    
    // 最安値にフラグ
    const sorted = [...demoResults].sort((a, b) => a.price - b.price);
    if (sorted.length > 0) {
      sorted[0].isLowest = true;
    }
    
    setResults(sorted);
    setLoading(false);
  };

  const handleClear = () => {
    setDimensions({ length: '', width: '', height: '' });
    setWeight('');
    setDeclaredValue('');
    setWithSignature(false);
    setWithInsurance(false);
    setResults([]);
    setCalculatedWeights(null);
  };

  return (
    <div style={{ padding: 16, display: 'flex', gap: 16 }}>
      {/* 左: 入力フォーム */}
      <div style={{ width: 320, flexShrink: 0 }}>
        <div style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          padding: 16,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={16} />
            パッケージ情報
          </h3>
          
          {/* 寸法 */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              寸法 (cm)
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <N3Input
                placeholder="L"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                size="sm"
                type="number"
              />
              <N3Input
                placeholder="W"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                size="sm"
                type="number"
              />
              <N3Input
                placeholder="H"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                size="sm"
                type="number"
              />
            </div>
          </div>
          
          {/* 重量 */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              重量 (kg)
            </label>
            <N3Input
              placeholder="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              size="sm"
              type="number"
              step="0.1"
            />
          </div>
          
          <N3Divider style={{ margin: '16px 0' }} />
          
          {/* 配送先 */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              <Globe size={12} style={{ display: 'inline', marginRight: 4 }} />
              配送先国
            </label>
            <N3Select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              size="sm"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </N3Select>
          </div>
          
          {/* 申告価格 */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              <DollarSign size={12} style={{ display: 'inline', marginRight: 4 }} />
              申告価格 (USD)
            </label>
            <N3Input
              placeholder="100"
              value={declaredValue}
              onChange={(e) => setDeclaredValue(e.target.value)}
              size="sm"
              type="number"
            />
          </div>
          
          {/* オプション */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
              オプション
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <N3Checkbox
                checked={withSignature}
                onChange={(e) => setWithSignature(e.target.checked)}
                label="署名確認"
              />
              <N3Checkbox
                checked={withInsurance}
                onChange={(e) => setWithInsurance(e.target.checked)}
                label="保険付き"
              />
            </div>
          </div>
          
          <N3Divider style={{ margin: '16px 0' }} />
          
          {/* キャリアフィルター */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>
              キャリア
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CARRIERS.map(carrier => (
                <N3Checkbox
                  key={carrier}
                  checked={selectedCarriers.includes(carrier)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCarriers([...selectedCarriers, carrier]);
                    } else {
                      setSelectedCarriers(selectedCarriers.filter(c => c !== carrier));
                    }
                  }}
                  label={carrier}
                />
              ))}
            </div>
          </div>
          
          {/* ボタン */}
          <div style={{ display: 'flex', gap: 8 }}>
            <N3Button
              variant="primary"
              size="sm"
              onClick={handleCalculate}
              disabled={loading}
              loading={loading}
              style={{ flex: 1 }}
            >
              <Calculator size={14} />
              計算
            </N3Button>
            <N3Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              クリア
            </N3Button>
          </div>
        </div>
      </div>
      
      {/* 右: 結果 */}
      <div style={{ flex: 1 }}>
        {/* 計算済み重量 */}
        {calculatedWeights && (
          <div style={{ marginBottom: 16 }}>
            <N3StatsGrid columns={3} gap={8} size="compact">
              <N3StatItem label="実重量" value={`${calculatedWeights.actual} kg`} color="blue" />
              <N3StatItem label="容積重量" value={`${calculatedWeights.volumetric} kg`} color="purple" />
              <N3StatItem label="課金重量" value={`${calculatedWeights.chargeable} kg`} color="green" />
            </N3StatsGrid>
          </div>
        )}
        
        {/* 結果一覧 */}
        {results.length > 0 ? (
          <div style={{
            background: 'var(--panel)',
            borderRadius: 8,
            border: '1px solid var(--panel-border)',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>キャリア</th>
                  <th style={{ padding: 12, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>サービス</th>
                  <th style={{ padding: 12, textAlign: 'right', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>料金</th>
                  <th style={{ padding: 12, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>配送日数</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} style={{
                    background: result.isLowest ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  }}>
                    <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Truck size={14} />
                        {result.carrier}
                        {result.isLowest && (
                          <span style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            background: 'rgb(34, 197, 94)',
                            color: 'white',
                            borderRadius: 4,
                          }}>
                            最安値
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', color: 'var(--text-muted)' }}>
                      {result.service}
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'right', fontWeight: 600, fontFamily: 'monospace' }}>
                      ¥{result.price.toLocaleString()}
                    </td>
                    <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                      {result.deliveryDays}日
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <div>パッケージ情報を入力して「計算」をクリックしてください</div>
          </div>
        )}
      </div>
    </div>
  );
}
