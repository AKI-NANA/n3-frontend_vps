// app/tools/research-n3/components/panels/karitori-panel.tsx
/**
 * 刈り取り監視 ツールパネル
 */

'use client';

import React, { useState } from 'react';
import { Clock, Eye, ShoppingCart, SkipForward } from 'lucide-react';
import { N3Button, N3Badge } from '@/components/n3';

interface KaritoriPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

export default function KaritoriPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: KaritoriPanelProps) {
  const [productUrl, setProductUrl] = useState('');
  const [site, setSite] = useState('amazon');
  const [targetPrice, setTargetPrice] = useState('');
  const [frequency, setFrequency] = useState('15min');
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">刈り取り監視</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          Amazon/楽天の価格を監視し、目標価格を下回ったらアラート
        </p>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">ASIN / 商品URL</label>
          <input
            type="text"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="B08N5WRWNW または URL"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">サイト</label>
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            >
              <option value="amazon">Amazon JP</option>
              <option value="rakuten">楽天</option>
            </select>
          </div>
          <div className="w-20">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">目標価格</label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="5000"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">監視頻度</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          >
            <option value="15min">15分毎</option>
            <option value="30min">30分毎</option>
            <option value="1hour">1時間毎</option>
          </select>
        </div>
        
        <N3Button variant="primary" size="sm" icon={<Eye size={14} />} className="w-full">
          監視登録
        </N3Button>
      </div>
      
      {/* アラート */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="text-xs font-semibold mb-2">🔔 アラート（2件）</div>
        <div className="p-3 rounded bg-[var(--n3-color-warning-light)] border border-[var(--n3-color-warning)]">
          <div className="flex items-center gap-2 mb-2">
            <N3Badge variant="warning" size="sm">🔔</N3Badge>
            <span className="text-xs font-medium">Nintendo Switch Pro Controller</span>
          </div>
          <div className="flex gap-4 text-xs mb-2">
            <div>
              <span className="text-[var(--n3-text-muted)]">現在: </span>
              <span className="text-[var(--n3-color-success)] font-semibold">¥6,480</span>
            </div>
            <div>
              <span className="text-[var(--n3-text-muted)]">目標: </span>
              <span className="font-semibold">¥7,000</span>
            </div>
            <div>
              <span className="text-[var(--n3-text-muted)]">差額: </span>
              <span className="text-[var(--n3-color-success)] font-semibold">+¥520</span>
            </div>
          </div>
          <div className="flex gap-2">
            <N3Button variant="success" size="xs" icon={<ShoppingCart size={12} />}>
              即購入
            </N3Button>
            <N3Button variant="secondary" size="xs" icon={<SkipForward size={12} />}>
              スキップ
            </N3Button>
          </div>
        </div>
      </div>
      
      {/* 監視統計 */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">📊 監視統計</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-info)]">156</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">監視中</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-success)]">34</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">購入済</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-success)]">¥45,800</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">節約額</div>
          </div>
        </div>
      </div>
    </div>
  );
}
