/**
 * Yahoo Research Tab
 */

'use client';

import React, { useState } from 'react';
import { Search, Package, Loader2 } from 'lucide-react';
import { N3Button, N3Input, N3Badge } from '@/components/n3';

export function YahooResearchTab() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ padding: 20 }}>
      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8, 
        padding: 16, 
        marginBottom: 20,
        border: '1px solid var(--panel-border)'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <N3Input
            placeholder="Yahoo Auctionの商品を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <N3Button
            variant="primary"
            disabled={loading || !searchQuery.trim()}
            icon={loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          >
            {loading ? '検索中...' : '検索'}
          </N3Button>
        </div>
      </div>

      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8, 
        padding: 60,
        textAlign: 'center',
        border: '1px solid var(--panel-border)'
      }}>
        <Package size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Yahoo Auctionの商品検索機能
        </div>
      </div>
    </div>
  );
}
