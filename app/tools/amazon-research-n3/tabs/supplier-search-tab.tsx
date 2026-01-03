/**
 * Supplier Search Tab
 */

'use client';

import React, { useState } from 'react';
import { Store, Search, Loader2, ExternalLink } from 'lucide-react';
import { N3Button, N3Input, N3Badge } from '@/components/n3';

export function SupplierSearchTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setSuppliers([
        {
          id: 1,
          name: 'Amazon Japan',
          price: 5980,
          availability: 'in_stock',
          rating: 4.5,
          url: 'https://amazon.co.jp'
        },
        {
          id: 2,
          name: '楽天市場',
          price: 5500,
          availability: 'in_stock',
          rating: 4.2,
          url: 'https://rakuten.co.jp'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

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
            placeholder="商品名、ASINで仕入先を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <N3Button
            variant="primary"
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            icon={loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          >
            {loading ? '検索中...' : '仕入先探索'}
          </N3Button>
        </div>
      </div>

      {suppliers.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          {suppliers.map(supplier => (
            <div key={supplier.id} style={{ 
              background: 'var(--panel)', 
              borderRadius: 8, 
              padding: 16,
              border: '1px solid var(--panel-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Store size={32} style={{ color: 'var(--accent)' }} />
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{supplier.name}</h4>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>¥{supplier.price}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <N3Badge variant="success">在庫あり</N3Badge>
                <N3Button
                  variant="ghost"
                  size="sm"
                  icon={<ExternalLink size={14} />}
                  onClick={() => window.open(supplier.url, '_blank')}
                >
                  サイトへ
                </N3Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
