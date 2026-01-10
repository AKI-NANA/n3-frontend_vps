'use client';

import React, { useState } from 'react';
import { Box, Component, Layout, Plus } from 'lucide-react';
import {
  N3Button,
  N3Badge,
  N3HeaderTab,
  N3L2Tab,
  N3HeaderSearchInput,
  N3HeaderTabs,
  N3L2TabNavigation,
  N3GlobalHeader,
} from '@/components/n3';

// ============================================================
// Header 3層アーキテクチャ デモコンポーネント
// ============================================================

// パターン定義（将来的に増やせる）
const PRESENTATIONAL_PATTERNS = [
  { id: 'default', label: 'Default', description: '標準スタイル' },
  { id: 'minimal', label: 'Minimal', description: 'ミニマル' },
  { id: 'bold', label: 'Bold', description: '太字強調' },
];

const CONTAINER_PATTERNS = [
  { id: 'tab-switch', label: 'タブ切替', description: 'クリックで切り替え' },
  { id: 'hover-panel', label: 'ホバーパネル', description: 'ホバーで表示' },
];

const LAYOUT_PATTERNS = [
  { id: 'standard', label: 'Standard', description: '標準レイアウト' },
  { id: 'compact', label: 'Compact', description: 'コンパクト' },
  { id: 'full-width', label: 'Full-width', description: '全幅' },
];

interface HeaderPreviewProps {
  size: string;
  style: string;
}

export function HeaderPreview({ size, style }: HeaderPreviewProps) {
  const headerSize = size as 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // パターン選択状態
  const [presentationalPattern, setPresentationalPattern] = useState('default');
  const [containerPattern, setContainerPattern] = useState('tab-switch');
  const [layoutPattern, setLayoutPattern] = useState('standard');
  
  // Container用の状態
  const [activeL2Tab, setActiveL2Tab] = useState('basic');

  return (
    <div className="space-y-8">
      {/* 現在の設定表示 */}
      <div className="flex items-center gap-4 p-3 bg-[var(--highlight)] rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">サイズ:</span>
          <N3Badge variant="solid-primary">{size.toUpperCase()}</N3Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">スタイル:</span>
          <N3Badge variant="outline-success">{style}</N3Badge>
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          ※右上のボタンで切り替えると、全てのコンポーネントに反映されます
        </div>
      </div>

      {/* ========================================
          1. Presentational（デザインのみ）
          ======================================== */}
      <section className="border-2 border-[var(--color-success)] rounded-lg overflow-hidden">
        {/* セクションヘッダー */}
        <div className="bg-[var(--color-success-light)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Box size={20} className="text-[var(--color-success)]" />
            <div>
              <h3 className="font-bold text-[var(--color-success)]">🎨 Presentational（デザインのみ）</h3>
              <p className="text-xs text-[var(--text-muted)]">純粋なUI部品。クリックしても動かない。見た目のみ。</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">パターン:</span>
            {PRESENTATIONAL_PATTERNS.map(p => (
              <button
                key={p.id}
                onClick={() => setPresentationalPattern(p.id)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  presentationalPattern === p.id
                    ? 'bg-[var(--color-success)] text-white'
                    : 'bg-white/50 text-[var(--text-muted)] hover:bg-white'
                }`}
                title={p.description}
              >
                {p.label}
              </button>
            ))}
            <button className="px-2 py-1 text-xs rounded bg-white/50 text-[var(--text-muted)] hover:bg-white">
              <Plus size={12} />
            </button>
          </div>
        </div>
        
        {/* コンテンツ */}
        <div className="p-4 bg-[var(--panel)] space-y-4">
          {/* N3HeaderTab 単体 */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">N3HeaderTab（タブ単体 - 動かない）</p>
            <div className="flex gap-0 h-10 border border-[var(--panel-border)] rounded bg-[var(--glass)]">
              <N3HeaderTab id="tab1" label="ツール" size={headerSize} />
              <N3HeaderTab id="tab2" label="FLOW" size={headerSize} active />
              <N3HeaderTab id="tab3" label="フィルター" size={headerSize} />
            </div>
          </div>

          {/* N3L2Tab 単体 */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">N3L2Tab（L2タブ単体 - 動かない）</p>
            <div className="flex gap-0 border-b border-[var(--panel-border)]">
              <N3L2Tab id="basic" label="基本編集" labelEn="Basic" size={headerSize} />
              <N3L2Tab id="logistics" label="ロジスティクス" labelEn="Logistics" size={headerSize} active badge={3} />
              <N3L2Tab id="compliance" label="関税・法令" labelEn="Compliance" size={headerSize} />
            </div>
          </div>

          {/* N3HeaderSearchInput 単体 */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">N3HeaderSearchInput（検索入力 - 入力はできるがイベントなし）</p>
            <N3HeaderSearchInput 
              placeholder="商品を検索..." 
              shortcut="⌘K"
              width={300}
              size={headerSize}
            />
          </div>
        </div>
      </section>

      {/* ========================================
          2. Container（動きあり）
          ======================================== */}
      <section className="border-2 border-[var(--color-info)] rounded-lg overflow-hidden">
        {/* セクションヘッダー */}
        <div className="bg-[var(--color-info-light)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Component size={20} className="text-[var(--color-info)]" />
            <div>
              <h3 className="font-bold text-[var(--color-info)]">⚡ Container（動きあり）</h3>
              <p className="text-xs text-[var(--text-muted)]">状態管理あり。クリックでタブが切り替わる。</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">パターン:</span>
            {CONTAINER_PATTERNS.map(p => (
              <button
                key={p.id}
                onClick={() => setContainerPattern(p.id)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  containerPattern === p.id
                    ? 'bg-[var(--color-info)] text-white'
                    : 'bg-white/50 text-[var(--text-muted)] hover:bg-white'
                }`}
                title={p.description}
              >
                {p.label}
              </button>
            ))}
            <button className="px-2 py-1 text-xs rounded bg-white/50 text-[var(--text-muted)] hover:bg-white">
              <Plus size={12} />
            </button>
          </div>
        </div>
        
        {/* コンテンツ */}
        <div className="p-4 bg-[var(--panel)] space-y-4">
          {/* N3L2TabNavigation */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              N3L2TabNavigation（クリックで切り替わる）
              <span className="ml-2 text-[var(--color-info)]">現在: {activeL2Tab}</span>
            </p>
            <div className="border-b border-[var(--panel-border)]">
              <N3L2TabNavigation
                tabs={[
                  { id: 'basic', label: '基本編集', labelEn: 'Basic' },
                  { id: 'logistics', label: 'ロジスティクス', labelEn: 'Logistics', badge: 3 },
                  { id: 'compliance', label: '関税・法令', labelEn: 'Compliance' },
                  { id: 'media', label: 'メディア', labelEn: 'Media' },
                  { id: 'history', label: '履歴', labelEn: 'History' },
                ]}
                activeTab={activeL2Tab}
                onTabChange={setActiveL2Tab}
                size={headerSize}
              />
            </div>
            {/* タブ内容 */}
            <div className="mt-3 p-3 bg-[var(--highlight)] rounded text-sm text-[var(--text-muted)]">
              {activeL2Tab === 'basic' && '基本編集タブの内容がここに表示されます'}
              {activeL2Tab === 'logistics' && 'ロジスティクス（配送設定等）がここに表示されます'}
              {activeL2Tab === 'compliance' && '関税・法令（HSコード等）がここに表示されます'}
              {activeL2Tab === 'media' && 'メディア（画像等）がここに表示されます'}
              {activeL2Tab === 'history' && '履歴がここに表示されます'}
            </div>
          </div>

          {/* N3HeaderTabs */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">N3HeaderTabs（ホバーでパネル表示）</p>
            <div className="border border-[var(--panel-border)] rounded-lg overflow-visible" style={{ minHeight: '120px' }}>
              <N3HeaderTabs
                tabs={[
                  { id: 'tools', label: 'ツール' },
                  { id: 'flow', label: 'FLOW' },
                  { id: 'filter', label: 'フィルター' },
                ]}
                panels={{
                  tools: (
                    <div className="p-3">
                      <p className="text-sm font-semibold text-[var(--text)] mb-2">ツールパネル</p>
                      <div className="flex gap-2">
                        <N3Button variant="primary" size="xs">カテゴリ</N3Button>
                        <N3Button variant="secondary" size="xs">送料</N3Button>
                      </div>
                    </div>
                  ),
                  flow: <div className="p-3 text-sm">FLOWパネル</div>,
                  filter: <div className="p-3 text-sm">フィルターパネル</div>,
                }}
                size={headerSize}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          3. Layout（ページ構成 + パネル）
          ======================================== */}
      <section className="border-2 border-[var(--color-purple)] rounded-lg overflow-hidden">
        {/* セクションヘッダー */}
        <div className="bg-[var(--color-purple-light)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout size={20} className="text-[var(--color-purple)]" />
            <div>
              <h3 className="font-bold text-[var(--color-purple)]">📐 Layout（ページ構成 + パネル）</h3>
              <p className="text-xs text-[var(--text-muted)]">ページ全体のレイアウト。ホバーでパネル開閉。</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">パターン:</span>
            {LAYOUT_PATTERNS.map(p => (
              <button
                key={p.id}
                onClick={() => setLayoutPattern(p.id)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  layoutPattern === p.id
                    ? 'bg-[var(--color-purple)] text-white'
                    : 'bg-white/50 text-[var(--text-muted)] hover:bg-white'
                }`}
                title={p.description}
              >
                {p.label}
              </button>
            ))}
            <button className="px-2 py-1 text-xs rounded bg-white/50 text-[var(--text-muted)] hover:bg-white">
              <Plus size={12} />
            </button>
          </div>
        </div>
        
        {/* コンテンツ */}
        <div className="p-4 bg-[var(--panel)]">
          <p className="text-xs text-[var(--text-muted)] mb-3">
            N3GlobalHeader（完全なヘッダー - ホバーでパネル表示、検索、ページナビ統合）
          </p>
          <div className="border border-[var(--panel-border)] rounded-lg overflow-visible" style={{ minHeight: '200px' }}>
            <N3GlobalHeader
              size={headerSize}
              navTabs={[
                { id: 'tools', label: 'ツール' },
                { id: 'flow', label: 'FLOW' },
                { id: 'filter', label: 'フィルター' },
              ]}
              panels={{
                tools: (
                  <div className="p-4">
                    <div className="text-sm font-semibold text-[var(--text)] mb-2">ツールパネル</div>
                    <div className="flex gap-2 flex-wrap">
                      <N3Button variant="primary" size="xs">カテゴリ</N3Button>
                      <N3Button variant="secondary" size="xs">送料</N3Button>
                      <N3Button variant="success" size="xs">利益</N3Button>
                      <N3Button variant="warning" size="xs">HTML</N3Button>
                    </div>
                  </div>
                ),
                flow: (
                  <div className="p-4">
                    <div className="text-sm font-semibold text-[var(--text)] mb-2">FLOWパネル</div>
                    <p className="text-xs text-[var(--text-muted)]">ワークフロー設定</p>
                  </div>
                ),
                filter: (
                  <div className="p-4">
                    <div className="text-sm font-semibold text-[var(--text)] mb-2">フィルターパネル</div>
                    <p className="text-xs text-[var(--text-muted)]">検索条件</p>
                  </div>
                ),
              }}
              pageNavigation={
                <N3L2TabNavigation
                  tabs={[
                    { id: 'basic', label: '基本編集' },
                    { id: 'logistics', label: 'ロジスティクス' },
                    { id: 'compliance', label: '関税・法令' },
                  ]}
                  activeTab="basic"
                  onTabChange={(id) => console.log('Tab changed:', id)}
                  size={headerSize}
                />
              }
              searchPlaceholder="商品を検索..."
              searchShortcut="⌘K"
              rightActions={
                <N3Badge variant="outline-success">editing style</N3Badge>
              }
            />
          </div>
        </div>
      </section>

      {/* サイズ比較 */}
      <section className="border border-[var(--panel-border)] rounded-lg overflow-hidden">
        <div className="bg-[var(--highlight)] px-4 py-3">
          <h3 className="font-bold text-[var(--text)]">📏 サイズ比較（xs / sm / md / lg / xl）</h3>
          <p className="text-xs text-[var(--text-muted)]">各サイズの高さ比較。右上のサイズボタンとは別に、固定で5サイズを表示。</p>
        </div>
        <div className="p-4 bg-[var(--panel)] space-y-2">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((sz) => (
            <div key={sz} className="flex items-center gap-3">
              <span className="w-8 text-xs font-mono text-[var(--text-muted)]">{sz}</span>
              <div className="flex-1 border border-[var(--panel-border)] rounded overflow-hidden">
                <N3GlobalHeader
                  size={sz}
                  navTabs={[
                    { id: 'tools', label: 'ツール' },
                    { id: 'flow', label: 'FLOW' },
                  ]}
                  panels={{}}
                  searchPlaceholder={`${sz.toUpperCase()}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HeaderPreview;
