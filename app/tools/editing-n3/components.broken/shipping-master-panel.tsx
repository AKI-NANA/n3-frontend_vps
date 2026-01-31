// app/tools/editing-n3/components/l3-tabs/LogisticsTab/shipping-master-panel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Database, Search, RefreshCw } from 'lucide-react';
import { N3Button, N3Input, N3Select } from '@/components/n3';
import { N3StatsGrid, N3StatItem } from '@/components/n3/container/n3-stats-grid';

interface MasterRecord {
  id: string;
  carrier: string;
  service: string;
  type: string;
  country: string;
  weightMin: number;
  weightMax: number;
  price: number;
  deliveryDays: string;
}

const CARRIERS = ['All', 'Japan Post', 'FedEx', 'DHL', 'UPS'];
const COUNTRIES = ['All', 'US', 'UK', 'DE', 'FR', 'AU', 'CA'];

export function ShippingMasterPanel() {
  const [records, setRecords] = useState<MasterRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCarrier, setFilterCarrier] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');

  const [stats, setStats] = useState({
    totalRecords: 0,
    carriers: 0,
    countries: 0,
    lastUpdated: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // デモデータ生成
    const demoRecords: MasterRecord[] = [];
    const carriers = ['Japan Post', 'FedEx', 'DHL', 'UPS'];
    const services = ['Economy', 'Standard', 'Express', 'Priority'];
    const countries = ['US', 'UK', 'DE', 'FR', 'AU', 'CA'];
    
    carriers.forEach(carrier => {
      services.forEach(service => {
        countries.forEach(country => {
          demoRecords.push({
            id: `${carrier}-${service}-${country}`,
            carrier,
            service,
            type: service === 'Economy' ? 'surface' : 'air',
            country,
            weightMin: 0,
            weightMax: 2,
            price: Math.round(1500 + Math.random() * 3000),
            deliveryDays: service === 'Express' ? '2-3' : service === 'Priority' ? '1-2' : '5-10',
          });
        });
      });
    });
    
    setRecords(demoRecords);
    setStats({
      totalRecords: demoRecords.length,
      carriers: carriers.length,
      countries: countries.length,
      lastUpdated: new Date().toLocaleDateString('ja-JP'),
    });
    setLoading(false);
  };

  const filteredRecords = records.filter(r => {
    if (filterCarrier !== 'All' && r.carrier !== filterCarrier) return false;
    if (filterCountry !== 'All' && r.country !== filterCountry) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.carrier.toLowerCase().includes(q) && 
          !r.service.toLowerCase().includes(q) &&
          !r.country.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div style={{ padding: 16 }}>
      {/* 統計 */}
      <div style={{ marginBottom: 16 }}>
        <N3StatsGrid columns={4} gap={8} size="compact">
          <N3StatItem label="総レコード" value={stats.totalRecords} color="blue" />
          <N3StatItem label="キャリア数" value={stats.carriers} color="purple" />
          <N3StatItem label="対応国数" value={stats.countries} color="green" />
          <N3StatItem label="最終更新" value={stats.lastUpdated} color="gray" />
        </N3StatsGrid>
      </div>

      {/* フィルター */}
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
        <N3Input
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          style={{ width: 200 }}
        />
        
        <N3Select
          value={filterCarrier}
          onChange={(e) => setFilterCarrier(e.target.value)}
          size="sm"
          style={{ width: 130 }}
        >
          {CARRIERS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </N3Select>
        
        <N3Select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          size="sm"
          style={{ width: 100 }}
        >
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </N3Select>
        
        <div style={{ flex: 1 }} />
        
        <N3Button size="sm" variant="ghost" onClick={loadData} disabled={loading}>
          <RefreshCw size={14} />
          更新
        </N3Button>
        
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {filteredRecords.length}件表示
        </span>
      </div>

      {/* テーブル */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          読み込み中...
        </div>
      ) : (
        <div style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          overflow: 'auto',
          maxHeight: 500,
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ padding: 10, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>キャリア</th>
                <th style={{ padding: 10, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>サービス</th>
                <th style={{ padding: 10, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>タイプ</th>
                <th style={{ padding: 10, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>国</th>
                <th style={{ padding: 10, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>重量範囲</th>
                <th style={{ padding: 10, textAlign: 'right', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>料金</th>
                <th style={{ padding: 10, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>配送日数</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.slice(0, 100).map((record, index) => (
                <tr key={record.id} style={{ background: index % 2 === 0 ? 'var(--highlight)' : 'transparent' }}>
                  <td style={{ padding: 10, borderBottom: '1px solid var(--panel-border)', fontWeight: 500 }}>
                    {record.carrier}
                  </td>
                  <td style={{ padding: 10, borderBottom: '1px solid var(--panel-border)' }}>
                    {record.service}
                  </td>
                  <td style={{ padding: 10, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10,
                      background: record.type === 'air' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                      color: record.type === 'air' ? 'rgb(59, 130, 246)' : 'var(--text-muted)',
                    }}>
                      {record.type}
                    </span>
                  </td>
                  <td style={{ padding: 10, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    {record.country}
                  </td>
                  <td style={{ padding: 10, borderBottom: '1px solid var(--panel-border)', textAlign: 'center', fontFamily: 'monospace' }}>
                    {record.weightMin}-{record.weightMax}kg
                  </td>
                  <td style={{ padding: 10, borderBottom: '1px solid var(--panel-border)', textAlign: 'right', fontFamily: 'monospace', fontWeight: 500 }}>
                    ¥{record.price.toLocaleString()}
                  </td>
                  <td style={{ padding: 10, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    {record.deliveryDays}日
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
