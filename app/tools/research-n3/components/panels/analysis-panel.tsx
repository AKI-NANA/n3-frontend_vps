// app/tools/research-n3/components/panels/analysis-panel.tsx
/**
 * 分析・計算 ツールパネル
 */

'use client';

import React, { useState } from 'react';
import { BarChart3, Calculator, Truck, Users, AlertTriangle } from 'lucide-react';
import { N3Button } from '@/components/n3';

interface AnalysisPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

export default function AnalysisPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: AnalysisPanelProps) {
  const [sellPrice, setSellPrice] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [shippingMethod, setShippingMethod] = useState('ddp');
  const [destination, setDestination] = useState('us');
  
  const [result, setResult] = useState<{
    sellPrice: string;
    buyPrice: string;
    shipping: string;
    profit: string;
    margin: number;
  } | null>({
    sellPrice: '$145.00',
    buyPrice: '$57.80',
    shipping: '$28.50',
    profit: '$42.30',
    margin: 29.2,
  });
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">分析・計算</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          利益計算、坂路比較、競合分析、リスク評価
        </p>
        
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">販売価格（USD）</label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="145.00"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">仕入価格（JPY）</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="8500"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mb-2">
          <div className="w-[70px]">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">重量(g)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="500"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div className="w-[70px]">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">長(cm)</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="20"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div className="w-[70px]">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">幅(cm)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="15"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div className="w-[70px]">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">高(cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="10"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">配送方法</label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            >
              <option value="ddp">DDP (FedEx)</option>
              <option value="ddu">DDU (EMS)</option>
              <option value="sal">SAL</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">発送先</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            >
              <option value="us">アメリカ</option>
              <option value="uk">イギリス</option>
              <option value="de">ドイツ</option>
            </select>
          </div>
        </div>
        
        <N3Button variant="primary" size="sm" icon={<Calculator size={14} />} className="w-full">
          利益計算
        </N3Button>
      </div>
      
      {/* 計算結果 */}
      {result && (
        <div className="p-3 border-b border-[var(--n3-panel-border)]">
          <div className="text-xs font-semibold mb-2">💰 計算結果</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
              <div className="text-sm font-bold font-mono">{result.sellPrice}</div>
              <div className="text-[10px] text-[var(--n3-text-muted)]">販売価格</div>
            </div>
            <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
              <div className="text-sm font-bold font-mono">{result.buyPrice}</div>
              <div className="text-[10px] text-[var(--n3-text-muted)]">仕入</div>
            </div>
            <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
              <div className="text-sm font-bold font-mono">{result.shipping}</div>
              <div className="text-[10px] text-[var(--n3-text-muted)]">送料</div>
            </div>
            <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
              <div className="text-sm font-bold font-mono text-[var(--n3-color-success)]">{result.profit}</div>
              <div className="text-[10px] text-[var(--n3-text-muted)]">純利益</div>
            </div>
          </div>
          
          <div className="p-3 rounded bg-[var(--n3-color-success-light)] text-center">
            <div className="text-[10px] text-[var(--n3-text-muted)]">利益率</div>
            <div className="text-2xl font-bold text-[var(--n3-color-success)]">{result.margin}%</div>
          </div>
        </div>
      )}
      
      {/* 追加分析 */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">⚡ 追加分析</div>
        <div className="flex flex-wrap gap-2">
          <N3Button variant="secondary" size="sm" icon={<Truck size={14} />}>
            坂路比較
          </N3Button>
          <N3Button variant="secondary" size="sm" icon={<Users size={14} />}>
            競合分析
          </N3Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <N3Button variant="secondary" size="sm" icon={<AlertTriangle size={14} />}>
            リスク評価
          </N3Button>
          <N3Button variant="secondary" size="sm" icon={<BarChart3 size={14} />}>
            統計表示
          </N3Button>
        </div>
      </div>
    </div>
  );
}
