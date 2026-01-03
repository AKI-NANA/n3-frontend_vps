// app/tools/research-n3/components/panels/scraping-panel.tsx
/**
 * スクレイピング ツールパネル
 */

'use client';

import React, { useState } from 'react';
import { Bug, Package } from 'lucide-react';
import { N3Button } from '@/components/n3';

interface ScrapingPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

export default function ScrapingPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: ScrapingPanelProps) {
  const [platform, setPlatform] = useState('ヤフオク');
  const [taskName, setTaskName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('09:00');
  
  const PLATFORMS = ['ヤフオク', '楽天', 'メルカリ'];
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Bug size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">スクレイピング</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          ヤフオク/楽天/メルカリから商品データを自動取得
        </p>
        
        {/* プラットフォーム選択 */}
        <div className="flex gap-1 mb-3">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`
                flex-1 h-7 text-xs font-medium rounded border transition-colors
                ${platform === p
                  ? 'bg-[var(--n3-accent)] border-[var(--n3-accent)] text-white'
                  : 'bg-[var(--n3-bg)] border-[var(--n3-panel-border)] text-[var(--n3-text-muted)]'
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">タスク名</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="骨董品 毎日取得"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">キーワード（カンマ区切り）</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="骨董品, 茶道具"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">実行頻度</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            >
              <option value="hourly">毎時</option>
              <option value="6hours">6時間毎</option>
              <option value="daily">毎日</option>
            </select>
          </div>
          <div className="w-20">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">時刻</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        <N3Button variant="primary" size="sm" icon={<Package size={14} />} className="w-full">
          タスク作成
        </N3Button>
      </div>
      
      {/* 実行中タスク統計 */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">▶ 実行中タスク</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-success)]">2</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">実行中</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-warning)]">3</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">停止中</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-info)]">1,890</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">本日取得</div>
          </div>
        </div>
      </div>
    </div>
  );
}
