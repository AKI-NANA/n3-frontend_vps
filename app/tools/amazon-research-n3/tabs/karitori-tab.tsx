/**
 * Karitori Tab
 */

'use client';

import React, { useState } from 'react';
import { Clock, Bell, Plus, AlertCircle } from 'lucide-react';
import { N3Button, N3Input, N3Badge } from '@/components/n3';

export function KaritoriTab() {
  const [asin, setAsin] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [monitors, setMonitors] = useState<any[]>([]);

  const handleAdd = () => {
    if (asin && targetPrice) {
      setMonitors([...monitors, {
        id: Date.now(),
        asin,
        targetPrice: Number(targetPrice),
        currentPrice: Math.random() * 10000 + 1000,
        status: 'active'
      }]);
      setAsin('');
      setTargetPrice('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8, 
        padding: 20,
        marginBottom: 20,
        border: '1px solid var(--panel-border)'
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>価格監視設定</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>ASIN</label>
            <N3Input
              placeholder="B08N5WRWNW"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>目標価格</label>
            <N3Input
              type="number"
              placeholder="5000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>
          <N3Button
            variant="primary"
            onClick={handleAdd}
            icon={<Plus size={16} />}
          >
            監視追加
          </N3Button>
        </div>
      </div>

      {monitors.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {monitors.map(monitor => (
            <div key={monitor.id} style={{ 
              background: 'var(--panel)', 
              borderRadius: 8, 
              padding: 16,
              border: '1px solid var(--panel-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>ASIN: {monitor.asin}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  現在: ¥{monitor.currentPrice.toFixed(0)} → 目標: ¥{monitor.targetPrice}
                </div>
              </div>
              <N3Badge variant="success">
                <Clock size={12} style={{ marginRight: 4 }} />
                監視中
              </N3Badge>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          background: 'var(--panel)', 
          borderRadius: 8, 
          padding: 40,
          textAlign: 'center',
          border: '1px solid var(--panel-border)'
        }}>
          <AlertCircle size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            価格監視が設定されていません
          </div>
        </div>
      )}
    </div>
  );
}
