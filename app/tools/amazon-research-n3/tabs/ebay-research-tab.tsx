/**
 * eBay Research Tab
 * 
 * 【Phase 4 帝国公用語マイグレーション済】
 * 生fetch → Server Action (searchEbaySold) 経由
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Search, Package, ExternalLink, Loader2,
} from 'lucide-react';
import {
  N3Button,
  N3Input,
  N3Badge,
  useToast,
} from '@/components/n3';
import { searchEbaySold } from '../actions';

interface EbayItem {
  id: string;
  itemId: string;
  title: string;
  price: number;
  soldPrice?: number;
  currency: string;
  condition: string;
  seller: string;
  soldCount: number;
  imageUrl?: string;
  listingUrl?: string;
  profitScore?: number;
  marketplace?: string;
}

export function EbayResearchTab() {
  const [items, setItems] = useState<EbayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplace, setMarketplace] = useState('US');
  const { showToast } = useToast();

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const result = await searchEbaySold(searchQuery, marketplace);

      if (result.success && result.data) {
        setItems(result.data.items || []);
        showToast({ type: 'success', message: `${result.data.items?.length || 0}件の商品を取得しました` });
      } else {
        showToast({ type: 'error', message: result.error || '検索に失敗しました' });
      }
    } catch {
      showToast({ type: 'error', message: '検索に失敗しました' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, marketplace, showToast]);

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
          <select
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--panel-border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: 14,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="US">eBay.com</option>
            <option value="UK">eBay.co.uk</option>
            <option value="DE">eBay.de</option>
            <option value="AU">eBay.com.au</option>
          </select>
          
          <N3Input
            placeholder="キーワード、商品名、カテゴリーを入力..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
          />
          
          <N3Button
            variant="primary"
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            icon={loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          >
            {loading ? '検索中...' : '検索'}
          </N3Button>
        </div>
      </div>

      {items.length > 0 ? (
        <div style={{ 
          background: 'var(--panel)', 
          borderRadius: 8, 
          overflow: 'hidden',
          border: '1px solid var(--panel-border)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--panel-border)', borderBottom: '2px solid var(--panel-border)' }}>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>商品</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>販売価格</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>販売数</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>コンディション</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>スコア</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>アクション</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ 
                        width: 48, 
                        height: 48, 
                        background: 'var(--panel-border)', 
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                        ) : (
                          <Package size={20} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          ID: {item.itemId} • Seller: {item.seller}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>
                      ${item.soldPrice || item.price}
                    </div>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <N3Badge variant="secondary">{item.soldCount}個</N3Badge>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <N3Badge variant={item.condition === 'New' ? 'primary' : 'default'}>
                      {item.condition}
                    </N3Badge>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%',
                      background: item.profitScore && item.profitScore >= 80 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 146, 60, 0.1)',
                      border: `2px solid ${item.profitScore && item.profitScore >= 80 ? 'rgb(34, 197, 94)' : 'rgb(251, 146, 60)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      color: item.profitScore && item.profitScore >= 80 ? 'rgb(34, 197, 94)' : 'rgb(251, 146, 60)',
                      margin: '0 auto'
                    }}>
                      {item.profitScore || '-'}
                    </div>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <N3Button
                      variant="ghost"
                      size="sm"
                      icon={<ExternalLink size={14} />}
                      onClick={() => window.open(`https://www.ebay.com/itm/${item.itemId}`, '_blank')}
                    >
                      eBay
                    </N3Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ 
          background: 'var(--panel)', 
          borderRadius: 8, 
          padding: 60,
          textAlign: 'center',
          border: '1px solid var(--panel-border)'
        }}>
          <Package size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            eBay商品を検索してください
          </div>
        </div>
      )}
    </div>
  );
}
