// app/(external)/stocktake/components/location-stats-panel.tsx
/**
 * 保管場所別 在庫統計パネル
 * 
 * 表示内容:
 * - 各保管場所の商品数と総数量
 * - バーチャートで視覚化
 * - クリックでフィルター適用
 */

'use client';

import React, { memo, useMemo } from 'react';
import { MapPin, Package, ChevronDown, ChevronUp, Warehouse } from 'lucide-react';
import { STORAGE_LOCATIONS, type LocationStat } from '../hooks/use-stocktake';

interface LocationStatsPanelProps {
  locationStats: Record<string, LocationStat>;
  totalCount: number;
  totalQuantity: number;
  currentFilter: string;
  onFilterChange: (location: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const LocationStatsPanel = memo(function LocationStatsPanel({
  locationStats,
  totalCount,
  totalQuantity,
  currentFilter,
  onFilterChange,
  collapsed = false,
  onToggleCollapse,
}: LocationStatsPanelProps) {
  
  // 最大数量（バーチャート用）
  const maxQuantity = useMemo(() => {
    return Math.max(...Object.values(locationStats).map(s => s.quantity), 1);
  }, [locationStats]);

  // ソートされた場所リスト（数量順）
  const sortedLocations = useMemo(() => {
    const allLocations = [
      ...STORAGE_LOCATIONS,
      { value: '未設定', label: '未設定' },
    ];
    
    return allLocations
      .map(loc => ({
        ...loc,
        stat: locationStats[loc.value] || { count: 0, quantity: 0 },
      }))
      .sort((a, b) => b.stat.quantity - a.stat.quantity);
  }, [locationStats]);

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          background: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          fontSize: 11,
          color: '#374151',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        <Warehouse size={14} />
        <span style={{ fontWeight: 600 }}>保管場所別統計</span>
        <span style={{ marginLeft: 'auto', color: '#6b7280' }}>
          {totalCount}件 / {totalQuantity}個
        </span>
        <ChevronDown size={14} />
      </button>
    );
  }

  return (
    <div style={{
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: 10,
      marginBottom: 8,
    }}>
      {/* ヘッダー */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 8,
          cursor: onToggleCollapse ? 'pointer' : 'default',
        }}
        onClick={onToggleCollapse}
      >
        <Warehouse size={14} style={{ color: '#6b7280' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>
          保管場所別 在庫状況
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#6b7280' }}>
            合計: <strong style={{ color: '#374151' }}>{totalCount}</strong>件 / 
            <strong style={{ color: '#22c55e' }}>{totalQuantity}</strong>個
          </span>
          {onToggleCollapse && <ChevronUp size={14} style={{ color: '#6b7280' }} />}
        </div>
      </div>

      {/* 統計リスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* 全て表示ボタン */}
        <button
          onClick={() => onFilterChange('all')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 8px',
            background: currentFilter === 'all' ? '#3b82f6' : 'white',
            border: `1px solid ${currentFilter === 'all' ? '#3b82f6' : '#e5e7eb'}`,
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <Package size={12} style={{ color: currentFilter === 'all' ? 'white' : '#6b7280' }} />
          <span style={{ 
            fontSize: 11, 
            fontWeight: 600, 
            color: currentFilter === 'all' ? 'white' : '#374151',
            flex: 1,
            textAlign: 'left',
          }}>
            全ての場所
          </span>
          <span style={{ 
            fontSize: 10, 
            color: currentFilter === 'all' ? 'rgba(255,255,255,0.8)' : '#6b7280',
            fontFamily: 'monospace',
          }}>
            {totalCount}件
          </span>
        </button>

        {/* 各保管場所 */}
        {sortedLocations.map(({ value, label, stat }) => {
          const isActive = currentFilter === value;
          const barWidth = stat.quantity > 0 ? (stat.quantity / maxQuantity) * 100 : 0;
          
          // 0件の場所は薄く表示
          if (stat.count === 0) {
            return (
              <div
                key={value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  opacity: 0.4,
                  fontSize: 10,
                  color: '#9ca3af',
                }}
              >
                <MapPin size={10} />
                <span>{label}</span>
                <span style={{ marginLeft: 'auto' }}>0件</span>
              </div>
            );
          }
          
          return (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 8px',
                background: isActive ? '#3b82f6' : 'white',
                border: `1px solid ${isActive ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'all 0.15s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* バーチャート背景 */}
              {!isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${barWidth}%`,
                  background: value === 'plus1' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                  transition: 'width 0.3s',
                }} />
              )}
              
              <MapPin 
                size={12} 
                style={{ 
                  color: isActive ? 'white' : (value === 'plus1' ? '#22c55e' : '#3b82f6'),
                  position: 'relative',
                  zIndex: 1,
                }} 
              />
              <span style={{ 
                fontSize: 11, 
                fontWeight: 600, 
                color: isActive ? 'white' : '#374151',
                flex: 1,
                textAlign: 'left',
                position: 'relative',
                zIndex: 1,
              }}>
                {label}
              </span>
              <span style={{ 
                fontSize: 10, 
                color: isActive ? 'rgba(255,255,255,0.8)' : '#6b7280',
                fontFamily: 'monospace',
                position: 'relative',
                zIndex: 1,
              }}>
                {stat.count}件
              </span>
              <span style={{ 
                fontSize: 10, 
                fontWeight: 700,
                color: isActive ? 'white' : '#22c55e',
                fontFamily: 'monospace',
                minWidth: 40,
                textAlign: 'right',
                position: 'relative',
                zIndex: 1,
              }}>
                {stat.quantity}個
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
