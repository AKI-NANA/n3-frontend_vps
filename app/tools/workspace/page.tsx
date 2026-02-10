// app/tools/workspace/page.tsx
/**
 * N3統合ワークスペース（5タブ構成）
 * 
 * Phase 4.5: UI統一＆二重スクロール修正
 * 
 * メインタブ:
 * - Catalog(editing-n3): 商品・在庫・出品
 * - Sourcing(research-n3): リサーチ
 * - Execution(operations-n3): 受注・配送・CS
 * - Finance(finance-n3): 分析+会計
 * - Control(control-n3): n8n監視・Bot管理
 * 
 * 一度開いたツールはメモリに保持（display: none）
 * 最大5つまで保持（8GB RAM対策）
 */
'use client';

import { useState, memo } from 'react';
import dynamic from 'next/dynamic';
import { 
  useTabStore, 
  N3ToolId, 
  N3_TOOL_INFO, 
  N3_MAIN_TOOLS,
  MAIN_TOOL_IDS,
  isMainTool,
} from '@/lib/store/use-tab-store';
import { prefetchForTab } from '@/lib/query-client';
import { getQueryClient } from '@/lib/query-client';
import { X, Plus, LayoutGrid, List, Loader2, AlertCircle } from 'lucide-react';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';

// ローディングプレースホルダー（軽量版）
const LoadingPlaceholder = memo(function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
        background: 'var(--bg)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Loader2 
          className="animate-spin" 
          style={{ 
            width: 24, 
            height: 24, 
            margin: '0 auto 8px', 
            color: 'var(--accent)' 
          }} 
        />
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );
});

// 未登録ツール用のフォールバックコンポーネント
const UnregisteredToolPlaceholder = memo(function UnregisteredToolPlaceholder({ toolId }: { toolId: string }) {
  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
        background: 'var(--bg)',
      }}
    >
      <div style={{ textAlign: 'center', padding: 32 }}>
        <AlertCircle 
          style={{ 
            width: 48, 
            height: 48, 
            margin: '0 auto 16px', 
            color: '#F59E0B',
            opacity: 0.5,
          }} 
        />
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
          ツール未登録
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          ID: {toolId}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          このツールはWorkspaceに登録されていません。
          <br />
          直接ページにアクセスしてください。
        </p>
      </div>
    </div>
  );
});

// メインタブはdynamic importで高速切り替え（SSR無効化でチャンクロードエラー回避）
const EditingN3 = dynamic(
  () => import('@/app/tools/editing-n3/page').then(mod => ({ default: mod.default })),
  { ssr: false, loading: () => <LoadingPlaceholder label="商品管理" /> }
);
const ResearchN3 = dynamic(
  () => import('@/app/tools/research-n3/page').then(mod => ({ default: mod.default })),
  { ssr: false, loading: () => <LoadingPlaceholder label="リサーチ" /> }
);
const OperationsN3 = dynamic(
  () => import('@/app/tools/operations-n3/page').then(mod => ({ default: mod.default })),
  { ssr: false, loading: () => <LoadingPlaceholder label="オペレーション" /> }
);
const FinanceN3 = dynamic(
  () => import('@/app/tools/finance-n3/page').then(mod => ({ default: mod.default })),
  { ssr: false, loading: () => <LoadingPlaceholder label="会計・分析" /> }
);
const ControlN3 = dynamic(
  () => import('@/app/tools/control-n3/page').then(mod => ({ default: mod.default })),
  { ssr: false, loading: () => <LoadingPlaceholder label="管理" /> }
);

// 追加ツールは動的インポート（必要時のみロード）
const ToolComponents: Partial<Record<N3ToolId, React.ComponentType>> = {
  // メインタブ（5タブ）- dynamic import
  'editing-n3': EditingN3,
  'research-n3': ResearchN3,
  'operations-n3': OperationsN3,
  'finance-n3': FinanceN3,
  'control-n3': ControlN3,
  // 追加ツール - dynamic import
  'amazon-research-n3': dynamic(
    () => import('@/app/tools/amazon-research-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="Amazonリサーチ" /> }
  ),
  'listing-n3': dynamic(
    () => import('@/app/tools/listing-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="出品管理" /> }
  ),
  'analytics-n3': dynamic(
    () => import('@/app/tools/analytics-n3/page').then(mod => ({ default: mod.default })), 
    { ssr: false, loading: () => <LoadingPlaceholder label="分析" /> }
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
  const { 
    activeTab, 
    openTabs, 
    setActiveTab, 
    closeTab,
    showMainTabsOnly,
    setShowMainTabsOnly,
  } = useTabStore();
  const [showToolSelector, setShowToolSelector] = useState(false);

  return (
    <WorkspaceProvider>
      {/* 
        🔥 Phase 4.5: 二重スクロール修正
        - workspace-container: height: 100vh, overflow: hidden
        - workspace-tool-container: flex: 1, overflow: hidden
        - 各ツール内で個別にスクロール制御
      */}
      <div 
        className="workspace-container"
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg)',
          height: '100vh',
          width: '100%',
          overflow: 'hidden', // 🔥 ルートでスクロール禁止
        }}
      >
        {/* タブバー（5タブ固定表示） */}
        <div 
          className="workspace-tab-bar"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 8px',
            background: 'var(--panel)', 
            borderBottom: '1px solid var(--panel-border)',
            height: '44px',
            minHeight: '44px',
            flexShrink: 0,
          }}
        >
          {/* メインタブ（常に5タブ表示） */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            {MAIN_TOOL_IDS.map(id => {
              const info = N3_MAIN_TOOLS[id];
              const isActive = activeTab === id;
              const isOpen = openTabs.includes(id);
              
              return (
                <button
                  key={id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: isActive ? `${info.color}15` : 'transparent',
                    border: isActive ? `1px solid ${info.color}40` : '1px solid transparent',
                    color: isActive ? info.color : isOpen ? 'var(--text)' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onClick={() => setActiveTab(id)}
                  title={info.description}
                >
                  <span 
                    style={{ 
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: info.color,
                      opacity: isActive || isOpen ? 1 : 0.5,
                    }}
                  />
                  <span>{info.label}</span>
                  {isActive && (
                    <span 
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: `${info.color}20`,
                        color: info.color,
                      }}
                    >
                      {info.labelEn}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* 追加ツール開いている場合の表示 */}
          {!showMainTabsOnly && openTabs.filter(id => !isMainTool(id)).length > 0 && (
            <>
              <div 
                style={{ 
                  width: '1px', 
                  height: '20px', 
                  background: 'var(--panel-border)',
                  margin: '0 8px',
                }} 
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {openTabs.filter(id => !isMainTool(id)).map(id => {
                  const info = N3_TOOL_INFO[id];
                  if (!info) return null; // Guard against undefined
                  const isActive = activeTab === id;
                  return (
                    <div
                      key={id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                        background: isActive ? `${info.color}15` : 'transparent',
                        border: isActive ? `1px solid ${info.color}40` : '1px solid transparent',
                        color: isActive ? info.color : 'var(--text-muted)',
                      }}
                      onClick={() => setActiveTab(id)}
                    >
                      <span 
                        style={{ 
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: info.color,
                        }}
                      />
                      <span style={{ fontWeight: 500 }}>{info.label}</span>
                      <button
                        style={{
                          opacity: 0.5,
                          padding: '2px',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(id);
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* 右側コントロール */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>
            {/* 表示モード切り替え */}
            <button
              onClick={() => setShowMainTabsOnly(!showMainTabsOnly)}
              style={{
                padding: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
                flexShrink: 0,
                border: 'none',
                background: showMainTabsOnly ? 'var(--accent)' : 'var(--panel-alt)',
                color: showMainTabsOnly ? 'white' : 'var(--text-muted)',
              }}
              title={showMainTabsOnly ? '5タブ固定モード' : 'フリーモード'}
            >
              {showMainTabsOnly ? <LayoutGrid size={14} /> : <List size={14} />}
            </button>

            {/* タブ追加（フリーモード時） */}
            {!showMainTabsOnly && (
              <button
                onClick={() => setShowToolSelector(!showToolSelector)}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                }}
                title="ツールを追加"
              >
                <Plus size={16} />
              </button>
            )}
            
            {/* タブ数表示 */}
            <div 
              style={{ 
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                flexShrink: 0,
                color: 'var(--text-muted)',
                background: 'var(--panel-alt)',
              }}
            >
              {openTabs.length}/5
            </div>
          </div>
        </div>

        {/* ツール選択パネル（フリーモード時） */}
        {showToolSelector && !showMainTabsOnly && (
          <div 
            style={{ 
              position: 'absolute',
              top: '56px',
              right: '16px',
              zIndex: 50,
              minWidth: '250px',
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '16px',
            }}
          >
            <div 
              style={{ 
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '12px',
                color: 'var(--text)',
              }}
            >
              ツールを選択
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.entries(N3_TOOL_INFO).map(([id, info]) => {
                const isOpen = openTabs.includes(id as N3ToolId);
                const isMain = isMainTool(id);
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id as N3ToolId);
                      setShowToolSelector(false);
                    }}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: 'none',
                      opacity: isOpen ? 0.5 : 1,
                      background: isOpen ? 'var(--panel-alt)' : 'transparent',
                      color: 'var(--text)',
                    }}
                  >
                    <span 
                      style={{ 
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: info.color,
                      }}
                    />
                    <span style={{ fontSize: '13px' }}>{info.label}</span>
                    {isMain && (
                      <span 
                        style={{ 
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginLeft: 'auto',
                          background: 'var(--accent)',
                          color: 'white',
                        }}
                      >
                        メイン
                      </span>
                    )}
                    {isOpen && !isMain && (
                      <span 
                        style={{ 
                          fontSize: '11px',
                          marginLeft: 'auto',
                          color: 'var(--text-muted)',
                        }}
                      >
                        開いています
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 
          🔥 Phase 4.5: ツールコンテンツエリア
          - flex: 1 で残りスペースを埋める
          - overflow: hidden でスクロールは各ツール内で制御
          - minHeight: 0 で flex 子要素の縮小を許可
        */}
        <div 
          className="workspace-tool-container" 
          style={{ 
            flex: 1, 
            position: 'relative', 
            overflow: 'hidden', 
            minHeight: 0,
          }}
        >
          {openTabs.map((id) => {
            const Tool = ToolComponents[id];
            const isActive = activeTab === id;
            
            // ツールが登録されていない場合はフォールバック表示
            if (!Tool) {
              return (
                <div
                  key={id}
                  className="workspace-tool-wrapper"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: isActive ? 'flex' : 'none',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  <UnregisteredToolPlaceholder toolId={id} />
                </div>
              );
            }
            
            return (
              <div
                key={id}
                className="workspace-tool-wrapper"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: isActive ? 'flex' : 'none',
                  flexDirection: 'column',
                  overflow: 'hidden', // 🔥 各ツールでスクロール制御
                }}
              >
                {/* dynamic import に loading オプションがあるため Suspense 不要 */}
                <Tool />
              </div>
            );
          })}
        </div>
      </div>
    </WorkspaceProvider>
  );
}
