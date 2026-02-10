// components/layout/hub-sidebar.tsx
/**
 * 🏰 Hub Sidebar - 統合サイドバー（本番用）
 * 
 * ⚠️ IMPORTANT:
 * - *-hub ページは DEV REFERENCE のみ（サイドバーに表示しない）
 * - 既存UI (amazonrisa-mini, listing-n3, editing-n3) へリンク
 * - Phase 2B で extension-slot 統合完了後に更新
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search, Edit, Rocket, Package, Film, DollarSign,
  Monitor, Cog, Shield, Settings, ChevronRight, ChevronDown,
  Home, Menu, X, Zap, FileText, BarChart3, Command
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface NavItem {
  id: string;
  title: string;
  titleEn?: string;
  icon: React.ReactNode;
  href: string;
  role?: string[];
  children?: NavChild[];
  badge?: string;
  description?: string;
  devOnly?: boolean;  // 開発用フラグ
}

interface NavChild {
  title: string;
  href: string;
  devOnly?: boolean;
}

// ============================================================
// Sidebar構成（本番用 - 既存UIへリンク）
// ============================================================

export const HUB_SIDEBAR_ITEMS: NavItem[] = [
  // ========================================
  // Home
  // ========================================
  {
    id: 'home',
    title: 'ホーム',
    titleEn: 'Home',
    icon: <Home className="w-5 h-5" />,
    href: '/tools',
    description: 'ダッシュボード',
  },
  
  // ========================================
  // Research Hub → amazonrisa-mini (既存UI)
  // ========================================
  {
    id: 'research-hub',
    title: 'Research Hub',
    titleEn: 'Research Hub',
    icon: <Search className="w-5 h-5" />,
    href: '/tools/amazon-research-n3',  // ← 既存UI
    role: ['admin', 'operator'],
    description: 'リサーチ統合（amazonrisa-mini）',
    children: [
      { title: 'Amazon Research', href: '/tools/amazon-research-n3' },
      { title: 'Batch Research', href: '/tools/batch-research-n3' },
      { title: 'Arbitrage Scan', href: '/tools/arbitrage-scan' },
      // DEV: { title: '[DEV] Research Hub', href: '/tools/research-hub', devOnly: true },
    ],
  },
  
  // ========================================
  // Data Editor Hub → editing-n3 (既存UI・変更禁止)
  // ========================================
  {
    id: 'editing-core',
    title: 'Data Editor',
    titleEn: 'Data Editor Hub',
    icon: <Edit className="w-5 h-5" />,
    href: '/tools/editing-n3',  // ← 既存UI（変更禁止）
    role: ['admin', 'operator'],
    description: '商品データ編集',
  },
  
  // ========================================
  // Listing Hub → listing-n3 (既存UI)
  // ========================================
  {
    id: 'listing-hub',
    title: 'Listing Hub',
    titleEn: 'Listing Hub',
    icon: <Rocket className="w-5 h-5" />,
    href: '/tools/listing-n3',  // ← 既存UI
    role: ['admin', 'operator'],
    description: '出品管理',
    children: [
      { title: '出品管理', href: '/tools/listing-n3' },
      { title: 'LP自動生成', href: '/tools/listing-lp-auto' },
      { title: 'エラー復旧', href: '/tools/listing-error-recovery' },
      // DEV: { title: '[DEV] Listing Hub', href: '/tools/listing-hub', devOnly: true },
    ],
  },
  
  // ========================================
  // Inventory Hub → editing-n3 Inventory タブ (既存UI拡張)
  // ========================================
  {
    id: 'inventory-hub',
    title: 'Inventory Hub',
    titleEn: 'Inventory Hub',
    icon: <Package className="w-5 h-5" />,
    href: '/tools/editing-n3?tab=inventory',  // ← editing-n3のタブとして統合予定
    role: ['admin', 'operator'],
    description: '在庫管理',
    children: [
      { title: 'Inventory', href: '/tools/inventory' },
      { title: 'Stock Monitor', href: '/tools/stocktake' },
      { title: '仕入先管理', href: '/tools/product-sourcing-n3' },
      // DEV: { title: '[DEV] Inventory Hub', href: '/tools/inventory-hub', devOnly: true },
    ],
  },
  
  // ========================================
  // Media Hub → 新規 (Empire OS用)
  // ========================================
  {
    id: 'media-hub',
    title: 'Media Hub',
    titleEn: 'Media Hub',
    icon: <Film className="w-5 h-5" />,
    href: '/tools/media-hub',  // ← 新規（BaseToolLayout）
    role: ['admin', 'operator'],
    badge: 'NEW',
    description: 'メディア生成（Empire OS）',
    children: [
      { title: 'Video Generator', href: '/tools/media-video-gen' },
      { title: 'Audio Generator', href: '/tools/media-audio-gen' },
      { title: 'Script Writer', href: '/tools/media-script' },
      { title: 'Thumbnail', href: '/tools/media-thumbnail' },
    ],
  },
  
  // ========================================
  // Finance Hub → finance-n3 (既存UI)
  // ========================================
  {
    id: 'finance-hub',
    title: 'Finance Hub',
    titleEn: 'Finance Hub',
    icon: <DollarSign className="w-5 h-5" />,
    href: '/tools/finance-n3',  // ← 既存UI
    role: ['admin', 'operator'],
    description: '経理・会計',
    children: [
      { title: '利益計算', href: '/tools/finance-n3' },
      { title: '帳簿管理', href: '/tools/bookkeeping-n3' },
      { title: 'キャッシュフロー', href: '/tools/cash-flow-forecast' },
      // DEV: { title: '[DEV] Finance Hub', href: '/tools/finance-hub', devOnly: true },
    ],
  },
  
  // ========================================
  // Command Center (Phase 2C - 統合司令塔)
  // ========================================
  {
    id: 'command-center',
    title: 'Command Center',
    titleEn: 'Command Center',
    icon: <Command className="w-5 h-5" />,
    href: '/tools/control-n3',  // ← Phase 2C 新規
    role: ['admin'],  // Adminのみ
    badge: 'NEW',
    description: '統合司令塔（Job監視・Retry・Cancel）',
  },
  
  // ========================================
  // Operations (既存)
  // ========================================
  {
    id: 'operations',
    title: 'Operations',
    titleEn: 'Operations',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/tools/operations-n3',
    role: ['admin', 'operator'],
    description: '運用管理',
    children: [
      { title: '運用管理', href: '/tools/operations-n3' },
      { title: '分析', href: '/tools/analytics-n3' },
      { title: '監視', href: '/tools/monitoring-n3' },
    ],
  },
  
  // ========================================
  // Admin セクション（Admin専用）
  // ========================================
  {
    id: 'automation-hub',
    title: 'Automation',
    titleEn: 'Automation Hub',
    icon: <Cog className="w-5 h-5" />,
    href: '/tools/automation-settings',  // ← 既存
    role: ['admin'],
    description: '自動化設定（Admin専用）',
    children: [
      { title: '自動化設定', href: '/tools/automation-settings' },
      { title: 'ガバナンス', href: '/tools/governance-rules' },
      // DEV: { title: '[DEV] Automation Hub', href: '/tools/automation-hub', devOnly: true },
    ],
  },
  {
    id: 'defense-hub',
    title: 'Defense',
    titleEn: 'Defense Hub',
    icon: <Shield className="w-5 h-5" />,
    href: '/tools/defense-ban',  // ← 既存
    role: ['admin'],
    description: '防衛（Admin専用）',
    children: [
      { title: 'BAN監視', href: '/tools/defense-ban' },
      { title: '著作権', href: '/tools/defense-copyright' },
      { title: 'Sentinel', href: '/tools/sentinel' },
      // DEV: { title: '[DEV] Defense Hub', href: '/tools/defense-hub', devOnly: true },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    titleEn: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/tools/settings-n3',
    role: ['admin', 'operator', 'viewer'],
    description: 'システム設定',
  },
];

// ============================================================
// DEV用サイドバー項目（開発時のみ表示）
// ============================================================

export const DEV_SIDEBAR_ITEMS: NavItem[] = [
  {
    id: 'dev-hub-reference',
    title: '🔧 DEV Reference',
    icon: <FileText className="w-5 h-5" />,
    href: '#',
    role: ['admin'],
    description: '開発用参照ページ',
    children: [
      { title: 'Research Hub (DEV)', href: '/tools/research-hub' },
      { title: 'Listing Hub (DEV)', href: '/tools/listing-hub' },
      { title: 'Inventory Hub (DEV)', href: '/tools/inventory-hub' },
      { title: 'Media Hub (DEV)', href: '/tools/media-hub' },
      { title: 'Finance Hub (DEV)', href: '/tools/finance-hub' },
      { title: 'Defense Hub (DEV)', href: '/tools/defense-hub' },
      { title: 'Automation Hub (DEV)', href: '/tools/automation-hub' },
    ],
  },
];

// ============================================================
// HubSidebar Component
// ============================================================

interface HubSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  userRole?: 'admin' | 'operator' | 'viewer';
  showDevItems?: boolean;  // 開発用表示フラグ
}

export function HubSidebar({ 
  collapsed = false, 
  onToggle, 
  userRole = 'admin',
  showDevItems = false 
}: HubSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const toggleExpand = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  // メインアイテム + 開発用アイテム（フラグONの場合）
  const allItems = showDevItems 
    ? [...HUB_SIDEBAR_ITEMS, ...DEV_SIDEBAR_ITEMS]
    : HUB_SIDEBAR_ITEMS;
  
  // 権限フィルタリング
  const filteredItems = allItems.filter(item => {
    if (!item.role) return true;
    return item.role.includes(userRole);
  });
  
  const isActive = (href: string) => {
    if (href === '/tools') return pathname === '/tools';
    if (href.includes('?')) {
      const baseHref = href.split('?')[0];
      return pathname?.startsWith(baseHref);
    }
    return pathname?.startsWith(href);
  };
  
  return (
    <aside
      className={`
        flex flex-col bg-[var(--glass)] border-r border-[var(--glass-border)]
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-[var(--accent)]" />
            <span className="font-bold text-lg">N3 Empire</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded hover:bg-[var(--highlight)] transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>
      
      {/* ナビゲーション */}
      <nav className="flex-1 overflow-y-auto py-4">
        {filteredItems.map(item => (
          <div key={item.id}>
            {/* メインアイテム */}
            <div className="px-2">
              {item.href === '#' ? (
                // リンクなし（展開のみ）
                <button
                  onClick={() => toggleExpand(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                    text-[var(--text-muted)] hover:bg-[var(--highlight)] hover:text-[var(--text)]
                  `}
                >
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium text-left">{item.title}</span>
                      {item.children && (
                        <span className="p-1">
                          {expandedItems.includes(item.id) 
                            ? <ChevronDown className="w-4 h-4" />
                            : <ChevronRight className="w-4 h-4" />
                          }
                        </span>
                      )}
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                    ${isActive(item.href)
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-muted)] hover:bg-[var(--highlight)] hover:text-[var(--text)]'
                    }
                  `}
                >
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-xs bg-[var(--accent)] text-white rounded">
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleExpand(item.id);
                          }}
                          className="p-1"
                        >
                          {expandedItems.includes(item.id) 
                            ? <ChevronDown className="w-4 h-4" />
                            : <ChevronRight className="w-4 h-4" />
                          }
                        </button>
                      )}
                    </>
                  )}
                </Link>
              )}
            </div>
            
            {/* 子アイテム */}
            {!collapsed && item.children && expandedItems.includes(item.id) && (
              <div className="ml-4 pl-4 border-l border-[var(--panel-border)] mt-1 mb-2">
                {item.children.filter(child => !child.devOnly || showDevItems).map(child => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`
                      block px-3 py-1.5 text-sm rounded transition-colors
                      ${pathname === child.href
                        ? 'bg-[var(--highlight)] text-[var(--text)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }
                    `}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      {/* フッター */}
      {!collapsed && (
        <div className="p-4 border-t border-[var(--glass-border)]">
          <div className="text-xs text-[var(--text-muted)]">
            <div>N3 Empire OS v9.2</div>
            <div>Phase 2C: Command Center</div>
            {showDevItems && <div className="text-yellow-500 mt-1">🔧 DEV Mode</div>}
          </div>
        </div>
      )}
    </aside>
  );
}

export default HubSidebar;
