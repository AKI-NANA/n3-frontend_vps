// app/tools/editing-n3/components/stats/inventory-stats-panel.tsx
/**
 * 棚卸し統計パネル
 * 
 * Phase 5: 統計機能の拡張
 * - L1属性別の商品数・仕入れ値集計
 * - カテゴリ別の集計
 * - 保管場所別の集計
 * - 画像登録状況
 */

'use client';

import React, { memo, useMemo, useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Image as ImageIcon, 
  MapPin, 
  Tag, 
  ChevronDown, 
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import type { InventoryProduct } from '../../hooks';

interface StatItem {
  name: string;
  count: number;
  totalCost: number;
}

interface InventoryStats {
  byL1: StatItem[];
  byL2: StatItem[];
  byCategory: StatItem[];
  byLocation: { name: string; count: number }[];
  imageStats: { withImage: number; withoutImage: number };
  totalStats: {
    totalCount: number;
    totalCost: number;
    avgCost: number;
    inStockCount: number;
    outOfStockCount: number;
  };
}

interface InventoryStatsPanelProps {
  products: InventoryProduct[];
  isOpen?: boolean;
  onToggle?: () => void;
}

// 統計計算関数
function calculateStats(products: InventoryProduct[]): InventoryStats {
  // L1属性別
  const l1Map = new Map<string, { count: number; totalCost: number }>();
  // L2属性別
  const l2Map = new Map<string, { count: number; totalCost: number }>();
  // カテゴリ別
  const categoryMap = new Map<string, { count: number; totalCost: number }>();
  // 保管場所別
  const locationMap = new Map<string, number>();
  
  let withImage = 0;
  let withoutImage = 0;
  let totalCost = 0;
  let inStockCount = 0;
  let outOfStockCount = 0;
  
  for (const p of products) {
    const cost = (p.cost_jpy || p.cost_price || 0) * (p.physical_quantity || 0);
    totalCost += cost;
    
    // 在庫状況
    if ((p.physical_quantity || 0) > 0) {
      inStockCount++;
    } else {
      outOfStockCount++;
    }
    
    // L1属性
    const l1 = (p as any).attr_l1 || '未分類';
    const l1Data = l1Map.get(l1) || { count: 0, totalCost: 0 };
    l1Data.count++;
    l1Data.totalCost += cost;
    l1Map.set(l1, l1Data);
    
    // L2属性
    const l2 = (p as any).attr_l2 || '未分類';
    const l2Data = l2Map.get(l2) || { count: 0, totalCost: 0 };
    l2Data.count++;
    l2Data.totalCost += cost;
    l2Map.set(l2, l2Data);
    
    // カテゴリ
    const category = p.category || '未分類';
    const catData = categoryMap.get(category) || { count: 0, totalCost: 0 };
    catData.count++;
    catData.totalCost += cost;
    categoryMap.set(category, catData);
    
    // 保管場所
    const location = p.storage_location || '未設定';
    locationMap.set(location, (locationMap.get(location) || 0) + 1);
    
    // 画像
    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      withImage++;
    } else {
      withoutImage++;
    }
  }
  
  // ソートして配列に変換
  const byL1: StatItem[] = Array.from(l1Map.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);
  
  const byL2: StatItem[] = Array.from(l2Map.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);
  
  const byCategory: StatItem[] = Array.from(categoryMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);
  
  const byLocation = Array.from(locationMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    byL1,
    byL2,
    byCategory,
    byLocation,
    imageStats: { withImage, withoutImage },
    totalStats: {
      totalCount: products.length,
      totalCost,
      avgCost: products.length > 0 ? totalCost / products.length : 0,
      inStockCount,
      outOfStockCount,
    },
  };
}

// 統計バーコンポーネント
const StatBar = memo(function StatBar({
  label,
  count,
  total,
  cost,
  color = 'var(--accent)',
}: {
  label: string;
  count: number;
  total: number;
  cost?: number;
  color?: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 12, color: 'var(--text)' }}>
          {label}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {count}件
          {cost !== undefined && (
            <span style={{ marginLeft: 8, color: 'var(--success)' }}>
              ¥{cost.toLocaleString()}
            </span>
          )}
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: 'var(--panel-border)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
});

// 折りたたみセクション
const CollapsibleSection = memo(function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
        }}
      >
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Icon size={14} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
      </button>
      {isOpen && (
        <div style={{ paddingLeft: 24 }}>
          {children}
        </div>
      )}
    </div>
  );
});

export const InventoryStatsPanel = memo(function InventoryStatsPanel({
  products,
  isOpen = true,
  onToggle,
}: InventoryStatsPanelProps) {
  const stats = useMemo(() => calculateStats(products), [products]);
  
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        style={{
          padding: '8px 12px',
          background: 'var(--panel)',
          border: '1px solid var(--panel-border)',
          borderRadius: 6,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text)',
        }}
      >
        <BarChart3 size={14} />
        <span style={{ fontSize: 12 }}>統計を表示</span>
      </button>
    );
  }
  
  return (
    <div
      style={{
        padding: 12,
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}
    >
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BarChart3 size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>棚卸し統計</span>
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            style={{
              padding: '4px 8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            閉じる
          </button>
        )}
      </div>
      
      {/* サマリーカード */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ padding: 8, background: 'var(--highlight)', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>総商品数</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
            {stats.totalStats.totalCount.toLocaleString()}
          </div>
        </div>
        <div style={{ padding: 8, background: 'var(--highlight)', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>有在庫</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>
            {stats.totalStats.inStockCount.toLocaleString()}
          </div>
        </div>
        <div style={{ padding: 8, background: 'var(--highlight)', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>総仕入れ額</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
            ¥{stats.totalStats.totalCost.toLocaleString()}
          </div>
        </div>
        <div style={{ padding: 8, background: 'var(--highlight)', borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>平均原価</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
            ¥{Math.round(stats.totalStats.avgCost).toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* 画像登録状況 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <ImageIcon size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>画像登録状況</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <StatBar
              label="登録済み"
              count={stats.imageStats.withImage}
              total={stats.totalStats.totalCount}
              color="var(--success)"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatBar
              label="未登録"
              count={stats.imageStats.withoutImage}
              total={stats.totalStats.totalCount}
              color="var(--warning)"
            />
          </div>
        </div>
      </div>
      
      {/* L1属性別 */}
      <CollapsibleSection title="L1属性別" icon={Tag} defaultOpen={true}>
        {stats.byL1.slice(0, 10).map((item) => (
          <StatBar
            key={item.name}
            label={item.name}
            count={item.count}
            total={stats.totalStats.totalCount}
            cost={item.totalCost}
          />
        ))}
        {stats.byL1.length > 10 && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
            他 {stats.byL1.length - 10} 件
          </div>
        )}
      </CollapsibleSection>
      
      {/* カテゴリ別 */}
      <CollapsibleSection title="カテゴリ別" icon={Package}>
        {stats.byCategory.slice(0, 10).map((item) => (
          <StatBar
            key={item.name}
            label={item.name}
            count={item.count}
            total={stats.totalStats.totalCount}
            cost={item.totalCost}
            color="var(--info)"
          />
        ))}
        {stats.byCategory.length > 10 && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
            他 {stats.byCategory.length - 10} 件
          </div>
        )}
      </CollapsibleSection>
      
      {/* 保管場所別 */}
      <CollapsibleSection title="保管場所別" icon={MapPin}>
        {stats.byLocation.slice(0, 10).map((item) => (
          <StatBar
            key={item.name}
            label={item.name}
            count={item.count}
            total={stats.totalStats.totalCount}
            color="var(--warning)"
          />
        ))}
        {stats.byLocation.length > 10 && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
            他 {stats.byLocation.length - 10} 件
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
});

export default InventoryStatsPanel;
