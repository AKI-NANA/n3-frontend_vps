// components/n3/n3-inventory-table.tsx
/**
 * 棚卸し専用テーブルコンポーネント v2
 * 
 * 機能:
 * - Excel風のリスト表示
 * - 在庫数・原価のインライン編集
 * - 属性（attr_l1/l2/l3）のインライン編集
 * - eBayアカウント、保有日数、商品タイプ表示
 * - 確定フラグ（is_verified）表示
 */

'use client';

import React, { useState, memo, useCallback } from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import type { InventoryProduct } from '@/app/tools/editing-n3/hooks/use-inventory-data';

// L4販路オプション
const L4_CHANNEL_OPTIONS = [
  { value: 'ebay_us', label: 'eBay US' },
  { value: 'ebay_uk', label: 'eBay UK' },
  { value: 'ebay_au', label: 'eBay AU' },
  { value: 'amazon_us', label: 'Amazon US' },
  { value: 'amazon_jp', label: 'Amazon JP' },
  { value: 'qoo10_jp', label: 'Qoo10 JP' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'mercari', label: 'メルカリ' },
  { value: 'undecided', label: '未定' },
];

interface N3InventoryTableProps {
  items: InventoryProduct[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onDetail: (id: string) => void;
  onStockChange: (id: string, newQuantity: number) => void;
  onCostChange?: (id: string, newCost: number) => void;
  /** 属性変更ハンドラー */
  onAttributeChange?: (id: string, level: 'l1' | 'l2' | 'l3', value: string) => void;
  /** L4属性変更ハンドラー（販売予定販路・配列） */
  onL4Change?: (id: string, channels: string[]) => void;
  /** 確定フラグ変更ハンドラー */
  onVerifiedChange?: (id: string, verified: boolean) => void;
  /** 属性オプション（プルダウン用） */
  attributeOptions?: {
    l1: string[];
    l2: string[];
    l3: string[];
  };
  /** 属性カラムを表示するか */
  showAttributeColumns?: boolean;
}

// 保有日数を計算
function calculateDaysHeld(dateAcquired?: string | null): number | null {
  if (!dateAcquired) return null;
  const acquired = new Date(dateAcquired);
  const now = new Date();
  const diff = now.getTime() - acquired.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// 保有日数の色
function getDaysHeldColor(days: number | null): string {
  if (days === null) return 'var(--text-muted)';
  if (days <= 90) return 'var(--success)';
  if (days <= 180) return 'var(--warning)';
  return 'var(--error)';
}

// eBayアカウントの色
function getAccountColor(account?: string | null): string {
  if (!account) return 'var(--text-muted)';
  const lower = account.toLowerCase();
  if (lower === 'mjt') return 'rgb(59, 130, 246)';
  if (lower === 'green') return 'rgb(34, 197, 94)';
  return 'var(--text-muted)';
}

// 商品タイプのラベル
function getProductTypeLabel(product: InventoryProduct): string {
  if (product.product_type === 'set') return 'SET';
  if (product.is_variation_parent) return '親';
  if (product.is_variation_member || product.is_variation_child) return '子';
  return '単';
}

// 商品タイプの色
function getProductTypeColor(product: InventoryProduct): string {
  if (product.product_type === 'set') return 'rgb(168, 85, 247)';
  if (product.is_variation_parent) return 'rgb(249, 115, 22)';
  if (product.is_variation_member || product.is_variation_child) return 'rgb(59, 130, 246)';
  return 'var(--text-muted)';
}

// 在庫ステータスの色
function getStockStatusColor(status?: string): string {
  switch (status) {
    case 'in_stock': return 'var(--success)';
    case 'low_stock': return 'var(--warning)';
    case 'out_of_stock': return 'var(--error)';
    default: return 'var(--text-muted)';
  }
}

// ============================================================
// 属性セル（インライン編集可能）
// ============================================================

interface AttributeCellProps {
  value: string | null;
  options: string[];
  onSave: (value: string) => void;
  placeholder?: string;
}

const AttributeCell = memo(function AttributeCell({
  value,
  options,
  onSave,
  placeholder = '未設定',
}: AttributeCellProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  
  const handleSave = useCallback(() => {
    setEditing(false);
    if (inputValue !== (value || '')) {
      onSave(inputValue);
    }
  }, [inputValue, value, onSave]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setInputValue(value || '');
    }
  }, [handleSave, value]);
  
  if (editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {options.length > 0 ? (
          <select
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              flex: 1,
              padding: '4px 6px',
              fontSize: 11,
              border: '1px solid var(--accent)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
              minWidth: 60,
            }}
          >
            <option value="">選択</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              flex: 1,
              padding: '4px 6px',
              fontSize: 11,
              border: '1px solid var(--accent)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
              minWidth: 60,
            }}
          />
        )}
      </div>
    );
  }
  
  return (
    <span
      onClick={() => setEditing(true)}
      style={{
        fontSize: 11,
        color: value ? 'var(--text)' : 'var(--text-muted)',
        cursor: 'pointer',
        padding: '2px 4px',
        borderRadius: 4,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
      className="hover:bg-[var(--highlight)]"
      title="クリックして編集"
    >
      {value || placeholder}
      <Edit2 size={10} style={{ opacity: 0.5 }} />
    </span>
  );
});

// ============================================================
// 確定フラグセル
// ============================================================

interface VerifiedCellProps {
  verified: boolean;
  onToggle: () => void;
}

const VerifiedCell = memo(function VerifiedCell({
  verified,
  onToggle,
}: VerifiedCellProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: 4,
        border: verified ? '2px solid #10b981' : '1px solid var(--panel-border)',
        background: verified ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      title={verified ? '確定済み' : '未確定'}
    >
      {verified ? (
        <Check size={14} style={{ color: '#10b981' }} />
      ) : (
        <X size={14} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
      )}
    </button>
  );
});

// ============================================================
// L4販路セル（複数選択ドロップダウン）
// ============================================================

interface L4CellProps {
  channels: string[];
  onSave: (channels: string[]) => void;
}

const L4Cell = memo(function L4Cell({
  channels,
  onSave,
}: L4CellProps) {
  const [editing, setEditing] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(channels || []);
  
  const handleToggle = useCallback((value: string) => {
    setSelectedChannels(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  }, []);
  
  const handleSave = useCallback(() => {
    setEditing(false);
    const sortedCurrent = [...(channels || [])].sort().join(',');
    const sortedNew = [...selectedChannels].sort().join(',');
    if (sortedCurrent !== sortedNew) {
      onSave(selectedChannels);
    }
  }, [channels, selectedChannels, onSave]);
  
  // ラベル表示（短縮形）
  const displayLabel = channels && channels.length > 0
    ? channels.length <= 2
      ? channels.map(c => L4_CHANNEL_OPTIONS.find(o => o.value === c)?.label || c).join(', ')
      : `${channels.length}販路`
    : '未設定';
  
  if (editing) {
    return (
      <div 
        style={{
          position: 'relative',
          background: 'var(--panel)',
          border: '1px solid var(--accent)',
          borderRadius: 4,
          padding: 4,
          minWidth: 120,
          zIndex: 100,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {L4_CHANNEL_OPTIONS.map(opt => (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 4px',
                cursor: 'pointer',
                fontSize: 10,
                borderRadius: 2,
              }}
              className="hover:bg-[var(--highlight)]"
            >
              <input
                type="checkbox"
                checked={selectedChannels.includes(opt.value)}
                onChange={() => handleToggle(opt.value)}
                style={{ width: 12, height: 12 }}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4, gap: 4 }}>
          <button
            onClick={() => { setEditing(false); setSelectedChannels(channels || []); }}
            style={{
              padding: '2px 8px',
              fontSize: 10,
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              background: 'var(--panel)',
              cursor: 'pointer',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '2px 8px',
              fontSize: 10,
              border: 'none',
              borderRadius: 4,
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <span
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      style={{
        fontSize: 10,
        color: channels && channels.length > 0 ? 'var(--text)' : 'var(--text-muted)',
        cursor: 'pointer',
        padding: '2px 4px',
        borderRadius: 4,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: channels && channels.length > 0 ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
        border: channels && channels.length > 0 ? '1px solid rgba(168, 85, 247, 0.3)' : '1px dashed var(--panel-border)',
      }}
      className="hover:bg-[var(--highlight)]"
      title={channels && channels.length > 0 ? channels.map(c => L4_CHANNEL_OPTIONS.find(o => o.value === c)?.label || c).join(', ') : 'クリックして販路を選択'}
    >
      {displayLabel}
      <Edit2 size={10} style={{ opacity: 0.5 }} />
    </span>
  );
});

// ============================================================
// 行コンポーネント
// ============================================================

const TableRow = memo(function TableRow({
  item,
  isSelected,
  onSelect,
  onDetail,
  onStockChange,
  onCostChange,
  onAttributeChange,
  onL4Change,
  onVerifiedChange,
  attributeOptions,
  showAttributeColumns,
}: {
  item: InventoryProduct;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDetail: (id: string) => void;
  onStockChange: (id: string, newQuantity: number) => void;
  onCostChange?: (id: string, newCost: number) => void;
  onAttributeChange?: (id: string, level: 'l1' | 'l2' | 'l3', value: string) => void;
  onL4Change?: (id: string, channels: string[]) => void;
  onVerifiedChange?: (id: string, verified: boolean) => void;
  attributeOptions?: { l1: string[]; l2: string[]; l3: string[] };
  showAttributeColumns?: boolean;
}) {
  const [editingStock, setEditingStock] = useState(false);
  const [stockValue, setStockValue] = useState(item.current_stock || 0);
  const [editingCost, setEditingCost] = useState(false);
  const [costValue, setCostValue] = useState(item.cost_jpy || 0);
  
  const daysHeld = calculateDaysHeld(item.date_acquired);
  const id = String(item.id);
  
  // 確定済み商品のスタイル（エメラルド枠）
  const isVerified = (item as any).is_verified === true;
  const verifiedStyle = isVerified ? {
    boxShadow: 'inset 0 0 0 2px #10b981',
  } : {};
  
  const handleStockBlur = () => {
    setEditingStock(false);
    if (stockValue !== (item.current_stock || 0)) {
      onStockChange(id, stockValue);
    }
  };
  
  const handleStockKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingStock(false);
      if (stockValue !== (item.current_stock || 0)) {
        onStockChange(id, stockValue);
      }
    } else if (e.key === 'Escape') {
      setEditingStock(false);
      setStockValue(item.current_stock || 0);
    }
  };
  
  const handleCostBlur = () => {
    setEditingCost(false);
    if (costValue !== (item.cost_jpy || 0) && onCostChange) {
      onCostChange(id, costValue);
    }
  };
  
  const handleCostKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingCost(false);
      if (costValue !== (item.cost_jpy || 0) && onCostChange) {
        onCostChange(id, costValue);
      }
    } else if (e.key === 'Escape') {
      setEditingCost(false);
      setCostValue(item.cost_jpy || 0);
    }
  };
  
  return (
    <tr
      style={{
        background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
        borderBottom: '1px solid var(--panel-border)',
        cursor: 'pointer',
        ...verifiedStyle,
      }}
      className="hover:bg-[var(--highlight)]"
    >
      {/* チェックボックス */}
      <td style={{ width: 40, textAlign: 'center', padding: '8px 4px' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(id)}
          onClick={(e) => e.stopPropagation()}
          style={{ width: 14, height: 14, cursor: 'pointer' }}
        />
      </td>
      
      {/* 確定フラグ */}
      {showAttributeColumns && (
        <td style={{ width: 40, textAlign: 'center', padding: '4px' }} onClick={(e) => e.stopPropagation()}>
          <VerifiedCell
            verified={isVerified}
            onToggle={() => onVerifiedChange?.(id, !isVerified)}
          />
        </td>
      )}
      
      {/* 画像 + 商品名 */}
      <td 
        style={{ padding: '8px', minWidth: 200 }}
        onClick={() => onDetail(id)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 4,
            overflow: 'hidden',
            background: 'var(--panel)',
            flexShrink: 0,
            border: isVerified ? '2px solid #10b981' : '1px solid var(--panel-border)',
          }}>
            {item.image_url && (
              <img 
                src={item.image_url} 
                alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ 
              fontSize: 12, 
              fontWeight: 500,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {item.title || item.product_name || '-'}
            </div>
            <div style={{ 
              fontSize: 10, 
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {item.sku || '-'}
            </div>
          </div>
        </div>
      </td>
      
      {/* 属性 L1 */}
      {showAttributeColumns && (
        <td style={{ width: 80, padding: '4px 8px' }} onClick={(e) => e.stopPropagation()}>
          <AttributeCell
            value={(item as any).attr_l1 || null}
            options={attributeOptions?.l1 || []}
            onSave={(v) => onAttributeChange?.(id, 'l1', v)}
            placeholder="L1"
          />
        </td>
      )}
      
      {/* 属性 L2 */}
      {showAttributeColumns && (
        <td style={{ width: 80, padding: '4px 8px' }} onClick={(e) => e.stopPropagation()}>
          <AttributeCell
            value={(item as any).attr_l2 || null}
            options={attributeOptions?.l2 || []}
            onSave={(v) => onAttributeChange?.(id, 'l2', v)}
            placeholder="L2"
          />
        </td>
      )}
      
      {/* 属性 L3 */}
      {showAttributeColumns && (
        <td style={{ width: 80, padding: '4px 8px' }} onClick={(e) => e.stopPropagation()}>
          <AttributeCell
            value={(item as any).attr_l3 || null}
            options={attributeOptions?.l3 || []}
            onSave={(v) => onAttributeChange?.(id, 'l3', v)}
            placeholder="L3"
          />
        </td>
      )}
      
      {/* 属性 L4（販売予定販路） */}
      {showAttributeColumns && (
        <td style={{ width: 100, padding: '4px 8px' }} onClick={(e) => e.stopPropagation()}>
          <L4Cell
            channels={(item as any).attr_l4 || []}
            onSave={(channels) => onL4Change?.(id, channels)}
          />
        </td>
      )}
      
      {/* 在庫数 - インライン編集 */}
      <td 
        style={{ width: 80, textAlign: 'center', padding: '4px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {editingStock ? (
          <input
            type="number"
            value={stockValue}
            onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
            onBlur={handleStockBlur}
            onKeyDown={handleStockKeyDown}
            autoFocus
            style={{
              width: '100%',
              padding: '4px 8px',
              fontSize: 12,
              textAlign: 'center',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <button
              onClick={() => {
                const newValue = Math.max(0, (item.current_stock || 0) - 1);
                setStockValue(newValue);
                onStockChange(id, newValue);
              }}
              style={{
                width: 20,
                height: 20,
                fontSize: 14,
                fontWeight: 600,
                border: '1px solid var(--panel-border)',
                borderRadius: 4,
                background: 'var(--panel)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              −
            </button>
            <span 
              onClick={() => setEditingStock(true)}
              style={{ 
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'monospace',
                color: getStockStatusColor(item.stock_status),
                minWidth: 24,
                cursor: 'text',
              }}
              title={item.product_type === 'set' && item.set_available_quantity !== undefined 
                ? `構成品在庫: ${item.current_stock || 0} / セット販売可能: ${item.set_available_quantity}`
                : undefined
              }
            >
              {item.product_type === 'set' && item.set_available_quantity !== undefined ? (
                <span style={{ color: item.set_available_quantity > 0 ? 'var(--success)' : 'var(--error)' }}>
                  {item.set_available_quantity}
                </span>
              ) : (
                item.current_stock || 0
              )}
            </span>
            <button
              onClick={() => {
                const newValue = (item.current_stock || 0) + 1;
                setStockValue(newValue);
                onStockChange(id, newValue);
              }}
              style={{
                width: 20,
                height: 20,
                fontSize: 14,
                fontWeight: 600,
                border: '1px solid var(--panel-border)',
                borderRadius: 4,
                background: 'var(--panel)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        )}
      </td>
      
      {/* 原価 - インライン編集 */}
      <td 
        style={{ width: 80, textAlign: 'right', padding: '4px 8px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {editingCost ? (
          <input
            type="number"
            value={costValue}
            onChange={(e) => setCostValue(parseInt(e.target.value) || 0)}
            onBlur={handleCostBlur}
            onKeyDown={handleCostKeyDown}
            autoFocus
            style={{
              width: '100%',
              padding: '4px 8px',
              fontSize: 12,
              textAlign: 'right',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
              fontFamily: 'monospace',
            }}
          />
        ) : (
          <span 
            onClick={() => onCostChange && setEditingCost(true)}
            style={{ 
              fontFamily: 'monospace', 
              fontSize: 12,
              cursor: onCostChange ? 'pointer' : 'default',
              padding: '4px 8px',
              borderRadius: 4,
              display: 'inline-block',
            }}
            className={onCostChange ? 'hover:bg-[var(--highlight)]' : ''}
            title={onCostChange ? 'クリックして編集' : undefined}
          >
            ¥{(item.cost_jpy || 0).toLocaleString()}
          </span>
        )}
      </td>
      
      {/* その他経費 */}
      <td style={{ width: 70, textAlign: 'right', padding: '4px 8px' }}>
        {(() => {
          // additional_costsから合計を計算
          const additionalCosts = (item as any).additional_costs;
          let totalExpense = 0;
          if (additionalCosts && typeof additionalCosts === 'object') {
            totalExpense = Object.values(additionalCosts).reduce((sum: number, val) => {
              const numVal = typeof val === 'number' ? val : parseFloat(String(val)) || 0;
              return sum + numVal;
            }, 0);
          }
          return (
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                color: totalExpense > 0 ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
              }}
              title={additionalCosts ? Object.entries(additionalCosts).map(([k, v]) => `${k}: ¥${v}`).join(', ') : '経費なし'}
            >
              {totalExpense > 0 ? `¥${totalExpense.toLocaleString()}` : '-'}
            </span>
          );
        })()}
      </td>
      
      {/* eBayアカウント */}
      <td style={{ width: 70, textAlign: 'center', padding: '8px' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: 4,
          background: `${getAccountColor(item.ebay_account)}20`,
          color: getAccountColor(item.ebay_account),
        }}>
          {item.ebay_account || '手動'}
        </span>
      </td>
      
      {/* 保有日数 */}
      <td style={{ width: 60, textAlign: 'right', padding: '8px', fontFamily: 'monospace', fontSize: 12 }}>
        <span style={{ color: getDaysHeldColor(daysHeld) }}>
          {daysHeld !== null ? `${daysHeld}d` : '-'}
        </span>
      </td>
      
      {/* タイプ */}
      <td style={{ width: 50, textAlign: 'center', padding: '8px' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: 4,
          background: `${getProductTypeColor(item)}20`,
          color: getProductTypeColor(item),
        }}>
          {getProductTypeLabel(item)}
        </span>
      </td>
    </tr>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const N3InventoryTable = memo(function N3InventoryTable({
  items,
  selectedIds,
  onSelect,
  onDetail,
  onStockChange,
  onCostChange,
  onAttributeChange,
  onL4Change,
  onVerifiedChange,
  attributeOptions,
  showAttributeColumns = false,
}: N3InventoryTableProps) {
  return (
    <div style={{ 
      background: 'var(--panel)',
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid var(--panel-border)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ 
            background: 'var(--highlight)',
            borderBottom: '1px solid var(--panel-border)',
          }}>
            <th style={{ 
              width: 40, 
              textAlign: 'center', 
              padding: '10px 4px',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}>
              <input
                type="checkbox"
                checked={selectedIds.size === items.length && items.length > 0}
                onChange={() => {
                  if (selectedIds.size === items.length) {
                    items.forEach(item => onSelect(String(item.id)));
                  } else {
                    items.forEach(item => {
                      if (!selectedIds.has(String(item.id))) {
                        onSelect(String(item.id));
                      }
                    });
                  }
                }}
                style={{ width: 14, height: 14, cursor: 'pointer' }}
              />
            </th>
            {showAttributeColumns && (
              <th style={{ width: 40, textAlign: 'center', padding: '10px 4px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                ✓
              </th>
            )}
            <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              商品
            </th>
            {showAttributeColumns && (
              <>
                <th style={{ width: 80, textAlign: 'left', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#10b981' }}>
                  L1
                </th>
                <th style={{ width: 80, textAlign: 'left', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#10b981' }}>
                  L2
                </th>
                <th style={{ width: 80, textAlign: 'left', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#10b981' }}>
                  L3
                </th>
                <th style={{ width: 100, textAlign: 'left', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: 'rgb(168, 85, 247)' }}>
                  L4販路
                </th>
              </>
            )}
            <th style={{ width: 80, textAlign: 'center', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              在庫
            </th>
            <th style={{ width: 80, textAlign: 'right', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              原価¥
            </th>
            <th style={{ width: 70, textAlign: 'right', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: 'rgb(245, 158, 11)' }}>
              経費
            </th>
            <th style={{ width: 70, textAlign: 'center', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              Account
            </th>
            <th style={{ width: 60, textAlign: 'right', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              保有
            </th>
            <th style={{ width: 50, textAlign: 'center', padding: '10px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <TableRow
              key={item.id}
              item={item}
              isSelected={selectedIds.has(String(item.id))}
              onSelect={onSelect}
              onDetail={onDetail}
              onStockChange={onStockChange}
              onCostChange={onCostChange}
              onAttributeChange={onAttributeChange}
              onL4Change={onL4Change}
              onVerifiedChange={onVerifiedChange}
              attributeOptions={attributeOptions}
              showAttributeColumns={showAttributeColumns}
            />
          ))}
        </tbody>
      </table>
      
      {items.length === 0 && (
        <div style={{ 
          padding: 24, 
          textAlign: 'center', 
          color: 'var(--text-muted)',
          fontSize: 14,
        }}>
          データがありません
        </div>
      )}
    </div>
  );
});

export default N3InventoryTable;
