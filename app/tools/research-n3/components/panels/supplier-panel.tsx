// app/tools/research-n3/components/panels/supplier-panel.tsx
/**
 * 仕入先探索 ツールパネル
 */

'use client';

import React, { useState } from 'react';
import { Factory, Search, Bot, Mail } from 'lucide-react';
import { N3Button, N3Badge } from '@/components/n3';

interface SupplierPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

export default function SupplierPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: SupplierPanelProps) {
  const [keyword, setKeyword] = useState('');
  const [searchSites, setSearchSites] = useState({
    amazon: true,
    rakuten: true,
    mercari: true,
    wholesale: false,
  });
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Factory size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">仕入先探索</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          AIで最適な仕入先を自動探索
        </p>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">商品名 / キーワード</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="南部鉄瓶"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        <div className="mb-3">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">検索サイト</label>
          <div className="flex flex-wrap gap-3 mt-1">
            {[
              { key: 'amazon', label: 'Amazon' },
              { key: 'rakuten', label: '楽天' },
              { key: 'mercari', label: 'メルカリ' },
              { key: 'wholesale', label: '卸サイト' },
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
        
        <div className="flex gap-2">
          <N3Button variant="primary" size="sm" icon={<Search size={14} />}>
            仕入先検索
          </N3Button>
          <N3Button variant="secondary" size="sm" icon={<Bot size={14} />}>
            AI探索
          </N3Button>
        </div>
      </div>
      
      {/* 仕入先候補 */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="text-xs font-semibold mb-2">📋 仕入先候補</div>
        {[
          { site: 'Amazon', siteBg: '#ff9900', siteColor: '#000', title: '南部鉄器 急須 0.9L', badge: '高信頼', badgeVariant: 'success' as const, price: '¥4,500', profit: '+$72.00' },
          { site: '楽天', siteBg: '#bf0000', siteColor: '#fff', title: '岩鋳 南部鉄瓶 1L', badge: '中信頼', badgeVariant: 'warning' as const, price: '¥5,200', profit: '+$65.50' },
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
              <N3Badge variant={supplier.badgeVariant} size="sm">{supplier.badge}</N3Badge>
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
      
      {/* 卸先・問屋 */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">🏢 卸先・問屋</div>
        <div className="flex flex-col gap-2">
          <N3Button variant="secondary" size="sm" icon={<Search size={14} />} className="w-full">
            卸先を検索
          </N3Button>
          <N3Button variant="secondary" size="sm" icon={<Mail size={14} />} className="w-full">
            交渉メール生成
          </N3Button>
        </div>
      </div>
    </div>
  );
}
