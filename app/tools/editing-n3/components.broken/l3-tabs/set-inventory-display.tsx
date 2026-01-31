// app/tools/editing-n3/components/index/set-inventory-display.tsx
/**
 * SetInventoryDisplay - セット商品の在庫連動表示コンポーネント
 * 
 * フェーズ2: セット品在庫連動
 * 
 * - 構成パーツの在庫状況を表示
 * - 販売可能数を自動計算（MINロジック）
 * - ボトルネックとなっているパーツをハイライト
 * - 連動マーク（🔗）で自動計算であることを明示
 */

'use client';

import React, { memo, useMemo } from 'react';
import { Link2, AlertTriangle, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateSetAvailability, createProductMap } from '@/lib/inventory/set-inventory-calculator';
import type { SetMemberInfoExtended, SetAvailabilityCalculation } from '@/types/inventory-extended';

// ============================================================
// 型定義
// ============================================================

export interface SetProductData {
  id: string;
  product_name?: string;
  set_members?: SetMemberInfoExtended[] | null;
}

export interface AllProductsData {
  id: string;
  product_name?: string;
  physical_quantity?: number;
}

export interface SetInventoryDisplayProps {
  /** セット商品データ */
  setProduct: SetProductData;
  /** 全商品データ（構成パーツの在庫取得用） */
  allProducts: AllProductsData[];
  /** コンパクト表示モード */
  compact?: boolean;
  /** 詳細展開状態 */
  expanded?: boolean;
  /** 展開トグル */
  onToggleExpand?: () => void;
  /** クリック時のコールバック */
  onClick?: () => void;
}

// ============================================================
// サブコンポーネント
// ============================================================

interface MemberRowProps {
  member: SetAvailabilityCalculation['members'][0];
  compact?: boolean;
}

const MemberRow = memo(function MemberRow({ member, compact }: MemberRowProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: compact ? '4px 0' : '6px 8px',
      background: member.is_bottleneck ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
      borderRadius: 4,
      borderLeft: member.is_bottleneck ? '3px solid #f59e0b' : '3px solid transparent',
    }}>
      {/* パーツ名 */}
      <div style={{
        flex: 1,
        fontSize: compact ? 10 : 11,
        color: member.is_bottleneck ? '#f59e0b' : 'var(--text)',
        fontWeight: member.is_bottleneck ? 600 : 400,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {member.is_bottleneck && '⚠️ '}
        {member.product_name || member.product_id}
      </div>
      
      {/* 必要数 */}
      <div style={{
        fontSize: compact ? 9 : 10,
        color: 'var(--text-muted)',
        minWidth: 40,
        textAlign: 'right',
      }}>
        ×{member.required_quantity}
      </div>
      
      {/* 現在庫 */}
      <div style={{
        fontSize: compact ? 10 : 11,
        fontWeight: 600,
        fontFamily: 'monospace',
        color: member.current_stock === 0 ? '#ef4444' : 
               member.current_stock < member.required_quantity ? '#f59e0b' : 
               '#22c55e',
        minWidth: 40,
        textAlign: 'right',
      }}>
        {member.current_stock}
      </div>
      
      {/* 作成可能セット数 */}
      <div style={{
        fontSize: compact ? 9 : 10,
        color: 'var(--text-muted)',
        minWidth: 50,
        textAlign: 'right',
      }}>
        →{member.available_sets}set
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const SetInventoryDisplay = memo(function SetInventoryDisplay({
  setProduct,
  allProducts,
  compact = false,
  expanded = false,
  onToggleExpand,
  onClick,
}: SetInventoryDisplayProps) {
  // 在庫計算
  const calculation = useMemo(() => {
    const productMap = createProductMap(allProducts);
    return calculateSetAvailability(setProduct, productMap);
  }, [setProduct, allProducts]);
  
  // 構成パーツがない場合
  if (!setProduct.set_members || setProduct.set_members.length === 0) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        background: 'rgba(107, 114, 128, 0.1)',
        borderRadius: 4,
        fontSize: compact ? 10 : 11,
        color: 'var(--text-muted)',
      }}>
        <Package size={compact ? 10 : 12} />
        構成品未設定
      </div>
    );
  }
  
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 4 : 8,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {/* メインの在庫数表示 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        {/* 連動マーク */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: compact ? 18 : 22,
          height: compact ? 18 : 22,
          background: 'rgba(168, 85, 247, 0.1)',
          borderRadius: 4,
          color: '#a855f7',
        }}>
          <Link2 size={compact ? 10 : 12} />
        </div>
        
        {/* 販売可能数 */}
        <div style={{
          fontSize: compact ? 14 : 16,
          fontWeight: 700,
          fontFamily: 'monospace',
          color: calculation.available_quantity === 0 ? '#ef4444' :
                 calculation.available_quantity < 3 ? '#f59e0b' :
                 '#22c55e',
        }}>
          {calculation.available_quantity}
        </div>
        
        <span style={{
          fontSize: compact ? 10 : 11,
          color: 'var(--text-muted)',
        }}>
          セット
        </span>
        
        {/* ボトルネック警告 */}
        {calculation.bottleneck && calculation.available_quantity < 5 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '1px 4px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: 3,
            fontSize: 9,
            color: '#f59e0b',
          }}>
            <AlertTriangle size={9} />
            {calculation.bottleneck.product_name?.slice(0, 10) || 'パーツ'}不足
          </div>
        )}
        
        {/* 展開ボタン */}
        {onToggleExpand && calculation.members.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              marginLeft: 'auto',
              background: 'var(--highlight)',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>
      
      {/* 構成パーツ詳細（展開時） */}
      {expanded && calculation.members.length > 0 && (
        <div style={{
          padding: compact ? '4px 0' : '8px',
          background: 'var(--highlight)',
          borderRadius: 4,
          marginTop: 4,
        }}>
          <div style={{
            fontSize: 9,
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            構成パーツ ({calculation.members.length}点)
          </div>
          
          {calculation.members.map((member, index) => (
            <MemberRow 
              key={member.product_id || index} 
              member={member} 
              compact={compact} 
            />
          ))}
          
          <div style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid var(--panel-border)',
            fontSize: 9,
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}>
            💡 販売可能数 = MIN(各パーツの在庫 ÷ 必要数)
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================================
// コンパクトバージョン（テーブル行用）
// ============================================================

export interface SetInventoryBadgeProps {
  /** 販売可能数 */
  availableQuantity: number;
  /** ボトルネック情報 */
  hasBottleneck?: boolean;
  /** クリック時のコールバック */
  onClick?: () => void;
}

export const SetInventoryBadge = memo(function SetInventoryBadge({
  availableQuantity,
  hasBottleneck,
  onClick,
}: SetInventoryBadgeProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        background: availableQuantity === 0 ? 'rgba(239, 68, 68, 0.1)' :
                    availableQuantity < 3 ? 'rgba(245, 158, 11, 0.1)' :
                    'rgba(168, 85, 247, 0.1)',
        borderRadius: 4,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      title={`セット販売可能数: ${availableQuantity}`}
    >
      <Link2 
        size={10} 
        style={{ 
          color: availableQuantity === 0 ? '#ef4444' :
                 availableQuantity < 3 ? '#f59e0b' :
                 '#a855f7' 
        }} 
      />
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'monospace',
        color: availableQuantity === 0 ? '#ef4444' :
               availableQuantity < 3 ? '#f59e0b' :
               '#a855f7',
      }}>
        {availableQuantity}
      </span>
      {hasBottleneck && availableQuantity > 0 && availableQuantity < 5 && (
        <AlertTriangle size={10} style={{ color: '#f59e0b' }} />
      )}
    </div>
  );
});

export default SetInventoryDisplay;
