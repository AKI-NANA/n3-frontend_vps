// app/tools/editing-n3/components/l3-tabs/LogisticsTab/shipping-policies-panel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, FileText, Check, Globe } from 'lucide-react';
import { N3Button, N3Select } from '@/components/n3';
import { N3StatsGrid, N3StatItem } from '@/components/n3/container/n3-stats-grid';

interface ShippingPolicy {
  id: string;
  name: string;
  marketplace_id: string;
  account: string;
  domestic_services: number;
  intl_services: number;
  is_default: boolean;
}

export function ShippingPoliciesPanel() {
  const [policies, setPolicies] = useState<ShippingPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<'mjt' | 'green' | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<'all' | 'mjt' | 'green'>('all');

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    // デモデータ
    await new Promise(resolve => setTimeout(resolve, 500));
    setPolicies([
      { id: '1', name: 'Economy Shipping', marketplace_id: 'EBAY_US', account: 'MJT', domestic_services: 2, intl_services: 3, is_default: true },
      { id: '2', name: 'Express Shipping', marketplace_id: 'EBAY_US', account: 'MJT', domestic_services: 1, intl_services: 2, is_default: false },
      { id: '3', name: 'Free Shipping', marketplace_id: 'EBAY_US', account: 'GREEN', domestic_services: 1, intl_services: 4, is_default: true },
      { id: '4', name: 'Standard International', marketplace_id: 'EBAY_UK', account: 'GREEN', domestic_services: 2, intl_services: 5, is_default: false },
    ]);
    setLoading(false);
  };

  const handleSync = async (account: 'mjt' | 'green') => {
    setSyncing(account);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await loadPolicies();
    setSyncing(null);
  };

  const filteredPolicies = selectedAccount === 'all' 
    ? policies 
    : policies.filter(p => p.account.toLowerCase() === selectedAccount);

  return (
    <div style={{ padding: 16 }}>
      {/* 統計 */}
      <div style={{ marginBottom: 16 }}>
        <N3StatsGrid columns={4} gap={8} size="compact">
          <N3StatItem label="総ポリシー数" value={policies.length} color="blue" />
          <N3StatItem label="MJT" value={policies.filter(p => p.account === 'MJT').length} color="purple" />
          <N3StatItem label="GREEN" value={policies.filter(p => p.account === 'GREEN').length} color="green" />
          <N3StatItem label="デフォルト" value={policies.filter(p => p.is_default).length} color="yellow" />
        </N3StatsGrid>
      </div>

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
        <N3Button
          size="sm"
          variant="primary"
          onClick={() => handleSync('mjt')}
          disabled={syncing !== null}
          loading={syncing === 'mjt'}
        >
          <RefreshCw size={14} />
          MJT同期
        </N3Button>
        <N3Button
          size="sm"
          variant="secondary"
          onClick={() => handleSync('green')}
          disabled={syncing !== null}
          loading={syncing === 'green'}
        >
          <RefreshCw size={14} />
          GREEN同期
        </N3Button>
        
        <div style={{ flex: 1 }} />
        
        <N3Select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value as any)}
          size="sm"
          style={{ width: 120 }}
        >
          <option value="all">全アカウント</option>
          <option value="mjt">MJT</option>
          <option value="green">GREEN</option>
        </N3Select>
      </div>

      {/* ポリシー一覧 */}
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
                <th style={{ padding: 12, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>ポリシー名</th>
                <th style={{ padding: 12, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>アカウント</th>
                <th style={{ padding: 12, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>マーケット</th>
                <th style={{ padding: 12, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>国内</th>
                <th style={{ padding: 12, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>国際</th>
                <th style={{ padding: 12, textAlign: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>デフォルト</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy, index) => (
                <tr key={policy.id} style={{ background: index % 2 === 0 ? 'var(--highlight)' : 'transparent' }}>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={14} />
                      <span style={{ fontWeight: 500 }}>{policy.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      background: policy.account === 'MJT' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: policy.account === 'MJT' ? 'rgb(139, 92, 246)' : 'rgb(34, 197, 94)',
                    }}>
                      {policy.account}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <Globe size={12} />
                      {policy.marketplace_id}
                    </div>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center', fontFamily: 'monospace' }}>
                    {policy.domestic_services}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center', fontFamily: 'monospace' }}>
                    {policy.intl_services}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    {policy.is_default && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgb(34, 197, 94)',
                        color: 'white',
                      }}>
                        <Check size={12} />
                      </span>
                    )}
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
