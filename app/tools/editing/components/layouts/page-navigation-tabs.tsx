// app/tools/editing/components/layouts/page-navigation-tabs.tsx
/**
 * PageNavigationTabs - 他ページへのナビゲーションタブ
 * 
 * HeaderLayoutの右側に配置される
 * 背景色なしのフラットなタブデザイン
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  CheckCircle,
  Package,
  Calculator,
  TrendingUp,
  Settings,
  type LucideIcon
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

// ナビゲーション項目の定義
const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    href: '/tools',
    icon: LayoutDashboard,
    description: 'ツール一覧'
  },
  {
    id: 'research',
    label: 'リサーチ',
    href: '/tools/research-hub',
    icon: Search,
    description: '市場調査'
  },
  {
    id: 'approval',
    label: '承認',
    href: '/tools/approval',
    icon: CheckCircle,
    description: '商品承認'
  },
  {
    id: 'inventory',
    label: '在庫',
    href: '/tools/inventory',
    icon: Package,
    description: '在庫管理'
  },
  {
    id: 'profit',
    label: '利益計算',
    href: '/tools/profit-calculator',
    icon: Calculator,
    description: '利益シミュレーション'
  },
  {
    id: 'analytics',
    label: '分析',
    href: '/tools/analytics',
    icon: TrendingUp,
    description: 'パフォーマンス分析'
  },
  {
    id: 'settings',
    label: '設定',
    href: '/settings',
    icon: Settings,
    description: 'システム設定'
  }
];

interface PageNavigationTabsProps {
  /** タイトルを表示するか */
  showTitle?: boolean;
  /** カスタムのナビ項目（オプション） */
  items?: NavItem[];
  /** 追加のクラス名 */
  className?: string;
}

export function PageNavigationTabs({
  showTitle = true,
  items = NAV_ITEMS,
  className = ''
}: PageNavigationTabsProps) {
  const pathname = usePathname();

  // 現在のパスがアクティブかどうかを判定
  const isActive = (href: string) => {
    if (href === '/tools') {
      return pathname === '/tools';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={`n3-page-nav ${className}`.trim()}>
      {showTitle && (
        <span className="n3-page-nav__title">ナビゲーション</span>
      )}
      <div className="n3-page-nav__list">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`n3-page-nav__item ${active ? 'active' : ''}`}
              title={item.description}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ナビ項目をエクスポート（カスタマイズ用）
export { NAV_ITEMS };
export type { NavItem };
