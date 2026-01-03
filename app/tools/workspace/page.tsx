// app/tools/workspace/page.tsx
/**
 * N3統合ワークスペース
 * - 9つのN3ツールをタブ切り替えで表示
 * - 一度開いたツールはメモリに保持（display: none）
 * - 最大5つまで保持（8GB RAM対策）
 */
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTabStore, N3ToolId, N3_TOOL_INFO } from '@/lib/store/use-tab-store';
import { X, Plus, Globe } from 'lucide-react';

// ローディングプレースホルダー
function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500">{label}を読み込み中...</p>
      </div>
    </div>
  );
}

// 11個のN3ツールを動的インポート
const ToolComponents: Record<N3ToolId, React.ComponentType> = {
  'editing-n3': dynamic(
    () => import('@/app/tools/editing-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="データ編集" /> }
  ),
  'research-n3': dynamic(
    () => import('@/app/tools/research-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="リサーチ" /> }
  ),
  'amazon-research-n3': dynamic(
    () => import('@/app/tools/amazon-research-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="Amazonリサーチ" /> }
  ),
  'operations-n3': dynamic(
    () => import('@/app/tools/operations-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="オペレーション" /> }
  ),
  'listing-n3': dynamic(
    () => import('@/app/tools/listing-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="出品管理" /> }
  ),
  'analytics-n3': dynamic(
    () => import('@/app/tools/analytics-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="分析" /> }
  ),
  'finance-n3': dynamic(
    () => import('@/app/tools/finance-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="会計" /> }
  ),
  'bookkeeping-n3': dynamic(
    () => import('@/app/tools/bookkeeping-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="記帳" /> }
  ),
  'settings-n3': dynamic(
    () => import('@/app/tools/settings-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="設定" /> }
  ),
  'docs-n3': dynamic(
    () => import('@/app/tools/docs-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="ドキュメント" /> }
  ),
  'global-data-pulse': dynamic(
    () => import('@/app/tools/global-data-pulse/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="GDP AI Media" /> }
  ),
};

export default function WorkspacePage() {
  const { activeTab, openTabs, setActiveTab, closeTab } = useTabStore();
  const [showToolSelector, setShowToolSelector] = useState(false);

  return (
    <div 
      className="workspace-container flex flex-col" 
      style={{ 
        background: 'var(--bg)',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* タブバー（ヘッダー代わり） */}
      <div 
        className="tab-bar flex items-center gap-1 px-4 border-b shrink-0"
        style={{ 
          background: 'var(--panel)', 
          borderColor: 'var(--panel-border)',
          height: '44px',
          minHeight: '44px',
        }}
      >
        {/* 開いているタブ */}
        <div className="flex items-center gap-1 overflow-x-auto flex-1">
          {openTabs.map(id => {
            const info = N3_TOOL_INFO[id];
            const isActive = activeTab === id;
            return (
              <div
                key={id}
                className="tab-item flex items-center gap-2 px-3 py-1.5 rounded text-sm cursor-pointer transition-all group whitespace-nowrap"
                style={{
                  background: isActive ? `${info.color}15` : 'transparent',
                  border: isActive ? `1px solid ${info.color}40` : '1px solid transparent',
                  color: isActive ? info.color : 'var(--text-muted)',
                }}
                onClick={() => setActiveTab(id)}
              >
                <span 
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: info.color }}
                />
                <span className="font-medium">{info.label}</span>
                {openTabs.length > 1 && (
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/10 rounded shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(id);
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        {/* タブ追加ボタン */}
        <button
          onClick={() => setShowToolSelector(!showToolSelector)}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors shrink-0"
          title="ツールを追加"
        >
          <Plus size={16} />
        </button>
        
        {/* タブ数表示 */}
        <div className="text-xs px-2 shrink-0" style={{ color: 'var(--text-muted)' }}>
          {openTabs.length}/5
        </div>
      </div>

      {/* ツール選択パネル */}
      {showToolSelector && (
        <div 
          className="absolute top-12 right-4 z-50 bg-white border rounded-lg shadow-lg p-4" 
          style={{ minWidth: '250px' }}
        >
          <div className="text-sm font-medium mb-3">ツールを選択</div>
          <div className="space-y-1">
            {Object.entries(N3_TOOL_INFO).map(([id, info]) => {
              const isOpen = openTabs.includes(id as N3ToolId);
              return (
                <button
                  key={id}
                  onClick={() => {
                    if (!isOpen) {
                      setActiveTab(id as N3ToolId);
                    }
                    setShowToolSelector(false);
                  }}
                  disabled={isOpen}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
                  style={{ 
                    opacity: isOpen ? 0.5 : 1,
                    cursor: isOpen ? 'default' : 'pointer'
                  }}
                >
                  <span 
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: info.color }}
                  />
                  <span className="text-sm">{info.label}</span>
                  {id === 'global-data-pulse' && (
                    <Globe size={12} className="ml-auto" style={{ color: info.color }} />
                  )}
                  {isOpen && (
                    <span className="text-xs text-gray-500 ml-auto">開いています</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ツールコンテンツエリア */}
      <div className="flex-1 relative" style={{ overflow: 'hidden' }}>
        {openTabs.map((id) => {
          const Tool = ToolComponents[id];
          const isActive = activeTab === id;
          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: isActive ? 'block' : 'none',
                overflow: 'auto',
              }}
            >
              <Tool />
            </div>
          );
        })}
      </div>
    </div>
  );
}
