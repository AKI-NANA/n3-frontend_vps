// components/layout/n3-icon-nav.tsx
/**
 * N3統合ページ専用アイコンナビゲーション
 * 🚀 Workspace対応: タブ切り替えで高速表示
 * 
 * Empire OS: 物販・メディア・投資の三本柱を統合
 */

'use client';

import React, { memo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Edit3,
  Search,
  Truck,
  ShoppingBag,
  BarChart3,
  Calculator,
  Settings,
  Menu,
  X,
  BookOpen,
  Package,
  Terminal,
  Film,
  TrendingUp,
  Map,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { navigationItems } from './sidebar-config';
import { useTabStore, N3ToolId } from '@/lib/store/use-tab-store';

interface N3NavItem {
  id: string;
  toolId: N3ToolId | 'command-center' | 'media-hub' | 'stock-n3' | 'blueprint-n3';
  label: string;
  link: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  description: string;
  isExternal?: boolean;
  isSeparatorBefore?: boolean;
}

const N3_PAGES: N3NavItem[] = [
  // ============================================================
  // 🔥 メイン5タブ (MAIN_TOOL_IDS 順序) - 物販コア
  // ============================================================
  {
    id: 'editing',
    toolId: 'editing-n3',
    label: 'データ編集',
    link: '/tools/editing-n3',
    icon: Edit3,
    color: '#8b5cf6',
    description: '商品データ編集・在庫管理',
  },
  {
    id: 'research',
    toolId: 'research-n3',
    label: 'リサーチ',
    link: '/tools/research-n3',
    icon: Search,
    color: '#06b6d4',
    description: 'リサーチ・仕入れ管理',
  },
  {
    id: 'operations',
    toolId: 'operations-n3',
    label: 'オペレーション',
    link: '/tools/operations-n3',
    icon: Truck,
    color: '#f59e0b',
    description: '受注・出荷・CS管理',
  },
  {
    id: 'finance',
    toolId: 'finance-n3',
    label: 'ファイナンス',
    link: '/tools/finance-n3',
    icon: Calculator,
    color: '#22c55e',
    description: '売上分析・会計',
  },
  {
    id: 'control',
    toolId: 'control-n3',
    label: 'コントロール',
    link: '/tools/control-n3',
    icon: Terminal,
    color: '#ef4444',
    description: 'n8n監視・Bot管理',
  },
  // ============================================================
  // 🏰 Empire OS 三本柱（メディア・投資）
  // ============================================================
  {
    id: 'media-hub',
    toolId: 'media-hub' as any,
    label: 'YouTube',
    link: '/tools/media-hub',
    icon: Film,
    color: '#ec4899',
    description: 'YouTube動画・音声・脚本生成',
    isSeparatorBefore: true,
  },
  {
    id: 'stock-n3',
    toolId: 'stock-n3' as any,
    label: '株式投資',
    link: '/tools/stock-n3',
    icon: TrendingUp,
    color: '#14b8a6',
    description: 'Global Oracle：自律投資OS',
  },
  // ============================================================
  // 📊 追加ツール（サブ）
  // ============================================================
  {
    id: 'amazon-research',
    toolId: 'amazon-research-n3',
    label: 'Amazon',
    link: '/tools/amazon-research-n3',
    icon: Package,
    color: '#FF9900',
    description: 'Amazonリサーチ・N3スコアリング',
    isSeparatorBefore: true,
  },
  {
    id: 'listing',
    toolId: 'listing-n3',
    label: '出品管理',
    link: '/tools/listing-n3',
    icon: ShoppingBag,
    color: '#10b981',
    description: 'SEO・価格戦略・一括出品',
  },
  {
    id: 'analytics',
    toolId: 'analytics-n3',
    label: '分析',
    link: '/tools/analytics-n3',
    icon: BarChart3,
    color: '#3b82f6',
    description: '売上・利益・AI品質管理',
  },
  {
    id: 'bookkeeping',
    toolId: 'bookkeeping-n3',
    label: '記帳',
    link: '/tools/bookkeeping-n3',
    icon: BookOpen,
    color: '#ec4899',
    description: '記帳オートメーション・MF連携',
  },
  {
    id: 'settings',
    toolId: 'settings-n3',
    label: '設定',
    link: '/tools/settings-n3',
    icon: Settings,
    color: '#6b7280',
    description: 'HTS・連携・自動化設定',
  },
  // ============================================================
  // 🗺️ システム・開発ツール
  // ============================================================
  {
    id: 'blueprint',
    toolId: 'blueprint-n3' as any,
    label: '設計図',
    link: '/tools/blueprint-n3',
    icon: Map,
    color: '#6366f1',
    description: '全機能監査・実装状況マップ',
    isSeparatorBefore: true,
  },
  {
    id: 'n8n-workflows',
    toolId: 'n8n-workflows' as any,
    label: 'n8nワークフロー',
    link: '/tools/n8n-workflows',
    icon: Zap,
    color: '#f97316',
    description: '170+ワークフロー管理・監視',
  },
  {
    id: 'docs',
    toolId: 'docs-n3',
    label: 'ドキュメント',
    link: '/tools/docs-n3',
    icon: BookOpen,
    color: '#f97316',
    description: 'エラー集・ガイド・仕様書',
  },
  {
    id: 'command-center',
    toolId: 'command-center' as any,
    label: 'コマンドセンター',
    link: '/tools/command-center',
    icon: Terminal,
    color: '#9333ea',
    description: '開発・デプロイ・Git操作',
  },
];

// 拡張ツールチップ（全ツール一覧表示）
const ExpandedTooltip = memo(function ExpandedTooltip({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 1998,
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: '56px',
          top: 0,
          width: '280px',
          height: '100vh',
          background: 'var(--panel)',
          borderRight: '1px solid var(--panel-border)',
          boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
          zIndex: 1999,
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>全ツール</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
        
        {navigationItems.map((section) => (
          <div key={section.id} style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {section.label}
            </div>
            {section.link && (
              <Link
                href={section.link}
                prefetch={false}
                onClick={onClose}
                style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: 'var(--text)', textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--highlight)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {section.label}
              </Link>
            )}
            {section.submenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {section.submenu.map((item) => (
                  <Link
                    key={item.link}
                    href={item.link}
                    prefetch={false}
                    onClick={onClose}
                    style={{ display: 'block', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--highlight)'; e.currentTarget.style.color = 'var(--text)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    {item.text}
                    {item.status === 'new' && (
                      <span style={{ marginLeft: '6px', fontSize: '10px', padding: '2px 6px', background: '#10b981', color: 'white', borderRadius: '4px' }}>NEW</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
});

// ツールチップ
const Tooltip = memo(function Tooltip({
  children,
  label,
  description,
  visible,
  isExternal,
}: {
  children: React.ReactNode;
  label: string;
  description: string;
  visible: boolean;
  isExternal?: boolean;
}) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {visible && (
        <div
          style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: '12px',
            padding: '8px 12px',
            background: 'var(--panel)',
            border: '1px solid var(--panel-border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
            zIndex: 2000,
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {label}
            {isExternal && <ExternalLink size={12} style={{ opacity: 0.5 }} />}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>
        </div>
      )}
    </div>
  );
});

export const N3IconNav = memo(function N3IconNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showFullSidebar, setShowFullSidebar] = useState(false);
  
  // 🚀 Workspace用タブ管理
  const { activeTab, setActiveTab } = useTabStore();
  const isWorkspace = pathname === '/tools/workspace';

  // 直接ページ遷移するツール（Workspaceではない）
  const directNavigateTools = ['command-center', 'media-hub', 'stock-n3', 'blueprint-n3', 'docs-n3'];

  // N3ツールクリック時の処理
  const handleN3Click = (e: React.MouseEvent, item: N3NavItem) => {
    e.preventDefault();
    
    // 外部リンクは新しいタブで開く
    if (item.isExternal) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // 特定のツールは直接ページ遷移
    if (directNavigateTools.includes(item.id)) {
      router.push(item.link);
      return;
    }
    
    // Workspaceモード: タブ切り替え（高速）
    if (isWorkspace) {
      setActiveTab(item.toolId as N3ToolId);
    } else {
      // 初回はWorkspaceに遷移してタブをセット
      setActiveTab(item.toolId as N3ToolId);
      router.push('/tools/workspace');
    }
  };

  // n8n外部リンクを開く
  const openN8n = () => {
    window.open('http://160.16.120.186:5678', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <ExpandedTooltip visible={showFullSidebar} onClose={() => setShowFullSidebar(false)} />

      <nav
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          width: '56px',
          height: '100vh',
          background: 'var(--panel)',
          borderRight: '1px solid var(--panel-border)',
          zIndex: 1000,
        }}
      >
        {/* ヘッダー */}
        <div style={{ padding: '12px', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            N3
          </div>
        </div>

        {/* N3ページナビ */}
        <div style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {N3_PAGES.map((item) => {
            const Icon = item.icon;
            // WorkspaceモードならactiveTabで判定、それ以外はpathnameで判定
            const isActive = !item.isExternal && (
              isWorkspace && !directNavigateTools.includes(item.id)
                ? activeTab === item.toolId
                : pathname === item.link || pathname?.startsWith(item.link + '/')
            );
            const isHovered = hoveredId === item.id;

            return (
              <React.Fragment key={item.id}>
                {/* セパレーター */}
                {item.isSeparatorBefore && (
                  <div style={{ height: '1px', background: 'var(--panel-border)', margin: '6px 0' }} />
                )}
                <Tooltip label={item.label} description={item.description} visible={isHovered} isExternal={item.isExternal}>
                  <button
                    onClick={(e) => handleN3Click(e, item)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isActive ? `${item.color}20` : isHovered ? 'var(--highlight)' : 'transparent',
                      color: isActive ? item.color : item.isExternal ? `${item.color}99` : 'var(--text-muted)',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={20} />
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '-8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '3px',
                          height: '20px',
                          background: item.color,
                          borderRadius: '0 2px 2px 0',
                        }}
                      />
                    )}
                  </button>
                </Tooltip>
              </React.Fragment>
            );
          })}
        </div>

        {/* 下部ボタン群 */}
        <div style={{ padding: '8px', borderTop: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* n8n外部リンク */}
          <Tooltip label="n8n Dashboard" description="ワークフロー自動化エンジン（外部）" visible={hoveredId === 'n8n'}>
            <button
              onClick={openN8n}
              onMouseEnter={() => setHoveredId('n8n')}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'transparent',
                color: '#FF6D5A',
                transition: 'all 0.15s ease',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Zap size={20} />
              <div
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  width: '6px',
                  height: '6px',
                  background: '#FF6D5A',
                  borderRadius: '50%',
                }}
              />
            </button>
          </Tooltip>

          {/* 全ツールボタン */}
          <Tooltip label="全ツール" description="従来のツール一覧" visible={hoveredId === 'tools'}>
            <button
              onClick={() => setShowFullSidebar(!showFullSidebar)}
              onMouseEnter={() => setHoveredId('tools')}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: showFullSidebar ? 'var(--accent)' : 'var(--highlight)',
                color: showFullSidebar ? 'white' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showFullSidebar ? <X size={18} /> : <Menu size={18} />}
            </button>
          </Tooltip>
        </div>
      </nav>
    </>
  );
});

export default N3IconNav;
