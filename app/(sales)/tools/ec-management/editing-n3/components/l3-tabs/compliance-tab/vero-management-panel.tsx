// app/tools/editing-n3/components/l3-tabs/ComplianceTab/vero-management-panel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Search, Plus, AlertTriangle, Check } from 'lucide-react';
import { N3Button, N3Input, N3Select } from '@/components/n3';
import { N3StatsGrid, N3StatItem } from '@/components/n3/container/n3-stats-grid';

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

interface VeroBrand {
  id: string;
  brand_name: string;
  risk_level: RiskLevel;
  category: string;
  detection_count: number;
  notes?: string;
}

export function VeroManagementPanel() {
  const [brands, setBrands] = useState<VeroBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterRisk, setFilterRisk] = useState<'ALL' | RiskLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // VEROチェック
  const [checkInput, setCheckInput] = useState('');
  const [checkResult, setCheckResult] = useState<{ found: boolean; matches: string[] } | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setBrands([
      { id: '1', brand_name: 'Nike', risk_level: 'HIGH', category: 'Apparel', detection_count: 234, notes: 'Active enforcement' },
      { id: '2', brand_name: 'Louis Vuitton', risk_level: 'HIGH', category: 'Luxury', detection_count: 189 },
      { id: '3', brand_name: 'Pokemon Company', risk_level: 'HIGH', category: 'Entertainment', detection_count: 156 },
      { id: '4', brand_name: 'Disney', risk_level: 'HIGH', category: 'Entertainment', detection_count: 312 },
      { id: '5', brand_name: 'Sanrio', risk_level: 'MEDIUM', category: 'Entertainment', detection_count: 87 },
      { id: '6', brand_name: 'Adidas', risk_level: 'MEDIUM', category: 'Apparel', detection_count: 65 },
      { id: '7', brand_name: 'Sony', risk_level: 'MEDIUM', category: 'Electronics', detection_count: 43 },
      { id: '8', brand_name: 'Generic Brand', risk_level: 'LOW', category: 'General', detection_count: 12 },
    ]);
    setLoading(false);
  };

  const handleVeroCheck = async () => {
    if (!checkInput.trim()) return;
    
    setChecking(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const input = checkInput.toLowerCase();
    const matches = brands
      .filter(b => input.includes(b.brand_name.toLowerCase()))
      .map(b => b.brand_name);
    
    setCheckResult({
      found: matches.length > 0,
      matches,
    });
    setChecking(false);
  };

  const filteredBrands = brands.filter(b => {
    if (filterRisk !== 'ALL' && b.risk_level !== filterRisk) return false;
    if (searchQuery && !b.brand_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: brands.length,
    high: brands.filter(b => b.risk_level === 'HIGH').length,
    medium: brands.filter(b => b.risk_level === 'MEDIUM').length,
    low: brands.filter(b => b.risk_level === 'LOW').length,
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'HIGH': return 'rgb(239, 68, 68)';
      case 'MEDIUM': return 'rgb(245, 158, 11)';
      case 'LOW': return 'rgb(34, 197, 94)';
    }
  };

  return (
    <div style={{ padding: 16 }}>
      {/* 統計 */}
      <div style={{ marginBottom: 16 }}>
        <N3StatsGrid columns={4} gap={8} size="compact">
          <N3StatItem label="総ブランド" value={stats.total} color="blue" />
          <N3StatItem label="高リスク" value={stats.high} color="red" />
          <N3StatItem label="中リスク" value={stats.medium} color="yellow" />
          <N3StatItem label="低リスク" value={stats.low} color="green" />
        </N3StatsGrid>
      </div>

      {/* VEROチェック */}
      <div style={{
        marginBottom: 16,
        padding: 16,
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Shield size={16} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>VEROチェック</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <N3Input
            placeholder="商品タイトルやブランド名を入力..."
            value={checkInput}
            onChange={(e) => { setCheckInput(e.target.value); setCheckResult(null); }}
            size="sm"
            style={{ flex: 1 }}
          />
          <N3Button
            size="sm"
            variant="primary"
            onClick={handleVeroCheck}
            disabled={checking || !checkInput.trim()}
            loading={checking}
          >
            <Search size={14} />
            チェック
          </N3Button>
        </div>
        
        {checkResult && (
          <div style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 6,
            background: checkResult.found ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${checkResult.found ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
          }}>
            {checkResult.found ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgb(239, 68, 68)' }}>
                <AlertTriangle size={16} />
                <span style={{ fontWeight: 600 }}>VEROブランド検出:</span>
                <span>{checkResult.matches.join(', ')}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgb(34, 197, 94)' }}>
                <Check size={16} />
                <span style={{ fontWeight: 600 }}>VEROブランドは検出されませんでした</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* フィルター */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
      }}>
        <N3Input
          placeholder="ブランド検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          style={{ width: 200 }}
        />
        
        <N3Select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value as any)}
          size="sm"
          style={{ width: 130 }}
        >
          <option value="ALL">全リスクレベル</option>
          <option value="HIGH">高リスク</option>
          <option value="MEDIUM">中リスク</option>
          <option value="LOW">低リスク</option>
        </N3Select>
        
        <div style={{ flex: 1 }} />
        
        <N3Button size="sm" variant="secondary">
          <Plus size={14} />
          ブランド追加
        </N3Button>
      </div>

      {/* ブランドリスト */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          読み込み中...
        </div>
      ) : (
        <div style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: 12, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>ブランド名</th>
                <th style={{ padding: 12, textAlign: 'center', width: 100, background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>リスク</th>
                <th style={{ padding: 12, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>カテゴリ</th>
                <th style={{ padding: 12, textAlign: 'center', width: 80, background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>検出数</th>
                <th style={{ padding: 12, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>備考</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand, index) => (
                <tr key={brand.id} style={{ background: index % 2 === 0 ? 'var(--highlight)' : 'transparent' }}>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', fontWeight: 600 }}>
                    {brand.brand_name}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      background: `${getRiskColor(brand.risk_level)}20`,
                      color: getRiskColor(brand.risk_level),
                    }}>
                      {brand.risk_level}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', color: 'var(--text-muted)' }}>
                    {brand.category}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center', fontFamily: 'monospace' }}>
                    {brand.detection_count}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', fontSize: 12, color: 'var(--text-muted)' }}>
                    {brand.notes || '-'}
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
