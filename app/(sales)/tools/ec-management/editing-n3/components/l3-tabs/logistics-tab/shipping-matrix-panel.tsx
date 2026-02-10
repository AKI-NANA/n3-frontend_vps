// app/tools/editing-n3/components/l3-tabs/LogisticsTab/shipping-matrix-panel.tsx
'use client';

import React, { useState } from 'react';
import { Grid3X3, Download } from 'lucide-react';
import { N3Button, N3Select } from '@/components/n3';

const COUNTRIES = ['US', 'UK', 'DE', 'FR', 'AU', 'CA'];
const WEIGHT_RANGES = ['0.5kg', '1kg', '2kg', '5kg', '10kg', '20kg'];

// デモマトリクスデータ
const generateMatrixData = () => {
  const data: Record<string, Record<string, number>> = {};
  COUNTRIES.forEach(country => {
    data[country] = {};
    WEIGHT_RANGES.forEach((weight, index) => {
      data[country][weight] = Math.round((1000 + index * 800 + Math.random() * 500) / 10) * 10;
    });
  });
  return data;
};

export function ShippingMatrixPanel() {
  const [matrixData] = useState(generateMatrixData);
  const [selectedCarrier, setSelectedCarrier] = useState('Japan Post');

  // 最安値を見つける
  const findLowestInColumn = (weight: string) => {
    let lowest = Infinity;
    COUNTRIES.forEach(country => {
      if (matrixData[country][weight] < lowest) {
        lowest = matrixData[country][weight];
      }
    });
    return lowest;
  };

  const handleExportCSV = () => {
    const header = ['Country', ...WEIGHT_RANGES].join(',');
    const rows = COUNTRIES.map(country => {
      return [country, ...WEIGHT_RANGES.map(w => matrixData[country][w])].join(',');
    });
    const csv = [header, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipping_matrix.csv';
    a.click();
  };

  return (
    <div style={{ padding: 16 }}>
      {/* ツールバー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        padding: 12,
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        <Grid3X3 size={16} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>送料マトリクス</span>
        
        <div style={{ flex: 1 }} />
        
        <N3Select
          value={selectedCarrier}
          onChange={(e) => setSelectedCarrier(e.target.value)}
          size="sm"
          style={{ width: 150 }}
        >
          <option value="Japan Post">Japan Post</option>
          <option value="FedEx">FedEx</option>
          <option value="DHL">DHL</option>
        </N3Select>
        
        <N3Button size="sm" variant="ghost" onClick={handleExportCSV}>
          <Download size={14} />
          CSV出力
        </N3Button>
      </div>

      {/* マトリクステーブル */}
      <div style={{
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
        overflow: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{
                padding: 12,
                textAlign: 'left',
                background: 'var(--highlight)',
                borderBottom: '1px solid var(--panel-border)',
                position: 'sticky',
                left: 0,
                zIndex: 1,
              }}>
                国
              </th>
              {WEIGHT_RANGES.map(weight => (
                <th key={weight} style={{
                  padding: 12,
                  textAlign: 'right',
                  background: 'var(--highlight)',
                  borderBottom: '1px solid var(--panel-border)',
                  minWidth: 80,
                }}>
                  {weight}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COUNTRIES.map((country, rowIndex) => (
              <tr key={country}>
                <td style={{
                  padding: 12,
                  borderBottom: '1px solid var(--panel-border)',
                  fontWeight: 600,
                  background: rowIndex % 2 === 0 ? 'var(--highlight)' : 'var(--panel)',
                  position: 'sticky',
                  left: 0,
                }}>
                  {country}
                </td>
                {WEIGHT_RANGES.map(weight => {
                  const price = matrixData[country][weight];
                  const isLowest = price === findLowestInColumn(weight);
                  return (
                    <td key={weight} style={{
                      padding: 12,
                      borderBottom: '1px solid var(--panel-border)',
                      textAlign: 'right',
                      fontFamily: 'monospace',
                      background: isLowest 
                        ? 'rgba(34, 197, 94, 0.15)' 
                        : (rowIndex % 2 === 0 ? 'var(--highlight)' : 'transparent'),
                      color: isLowest ? 'rgb(34, 197, 94)' : 'var(--text)',
                      fontWeight: isLowest ? 600 : 400,
                    }}>
                      ¥{price.toLocaleString()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 凡例 */}
      <div style={{
        marginTop: 12,
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontSize: 11,
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 12, background: 'rgba(34, 197, 94, 0.15)', borderRadius: 2 }} />
          <span>各重量帯の最安値</span>
        </div>
        <span>※ キャリア: {selectedCarrier}</span>
      </div>
    </div>
  );
}
