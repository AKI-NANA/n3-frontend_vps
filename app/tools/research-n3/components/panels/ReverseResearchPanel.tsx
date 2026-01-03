// app/tools/research-n3/components/panels/reverse-research-panel.tsx
/**
 * 逆リサーチ ツールパネル
 */

'use client';

import React, { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { N3Button, N3Checkbox } from '@/components/n3';

interface ReverseResearchPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

export default function ReverseResearchPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: ReverseResearchPanelProps) {
  const [ebayUrl, setEbayUrl] = useState('');
  const [productCode, setProductCode] = useState('');
  const [searchSites, setSearchSites] = useState({
    amazonJp: true,
    rakuten: true,
    yahoo: true,
    mercari: false,
  });
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">逆リサーチ</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          売れている商品から仕入先を逆算
        </p>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">eBay商品URL</label>
          <input
            type="text"
            value={ebayUrl}
            onChange={(e) => setEbayUrl(e.target.value)}
            placeholder="https://www.ebay.com/itm/123456789"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        <div className="text-center text-xs text-[var(--n3-text-muted)] my-2">または</div>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">ASIN / JAN / UPC</label>
          <input
            type="text"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="B08N5WRWNW"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        <div className="mb-3">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">検索サイト</label>
          <div className="flex flex-wrap gap-3 mt-1">
            {[
              { key: 'amazonJp', label: 'Amazon JP' },
              { key: 'rakuten', label: '楽天' },
              { key: 'yahoo', label: 'ヤフオク' },
              { key: 'mercari', label: 'メルカリ' },
            ].map((site) => (
              <label key={site.key} className="flex items-center gap-1.5 text-xs text-[var(--n3-text-muted)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={searchSites[site.key as keyof typeof searchSites]}
                  onChange={(e) => setSearchSites(prev => ({ ...prev, [site.key]: e.target.checked }))}
                  className="w-3.5 h-3.5"
                />
                {site.label}
              </label>
            ))}
          </div>
        </div>
        
        <N3Button variant="primary" size="sm" icon={<Search size={14} />} className="w-full">
          仕入先を検索
        </N3Button>
      </div>
      
      {/* 仕入先候補 */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">🏭 仕入先候補</div>
        {[
          { site: 'Amazon', siteBg: '#ff9900', siteColor: '#000', title: '同一商品 - 正規品', price: '¥8,500', profit: '+$42.30' },
          { site: '楽天', siteBg: '#bf0000', siteColor: '#fff', title: '類似商品 - 送料無料', price: '¥7,800', profit: '+$48.50' },
          { site: 'ヤフオク', siteBg: '#ff0033', siteColor: '#fff', title: '中古品 - 状態良好', price: '¥5,200', profit: '+$65.80' },
        ].map((supplier, idx) => (
          <div key={idx} className="p-2 mb-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)]">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{ background: supplier.siteBg, color: supplier.siteColor }}
              >
                {supplier.site}
              </span>
              <span className="text-xs flex-1 truncate">{supplier.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono font-semibold text-sm">{supplier.price}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[var(--n3-color-success-light)] text-[var(--n3-color-success)]">
                {supplier.profit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
