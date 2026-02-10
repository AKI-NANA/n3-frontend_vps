// app/tools/research-n3/components/tables/product-research-table.tsx
/**
 * 商品リサーチ テーブル
 * 
 * カラム:
 * - チェックボックス
 * - 画像
 * - 商品名
 * - 販売価格
 * - 販売数
 * - 競合
 * - 推定利益
 * - 利益率
 * - リスク
 * - スコア
 * - アクション
 */

'use client';

import React, { useMemo } from 'react';
import { Eye, Check, X } from 'lucide-react';

// N3コンポーネント
import {
  N3Checkbox,
  N3Badge,
  N3Button,
} from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

interface ProductResearchTableProps {
  filter?: string;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
  onDetail?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

interface ProductItem {
  id: string;
  image: string;
  title: string;
  price: number;
  salesCount: number;
  competitorCount: number;
  profit: number;
  profitRate: number;
  risk: 'low' | 'medium' | 'high';
  score: string;
}

// ============================================================
// モックデータ
// ============================================================

const MOCK_DATA: ProductItem[] = [
  {
    id: '1',
    image: '🎨',
    title: 'Vintage Japanese Ceramic Vase Edo Period Blue White',
    price: 189.00,
    salesCount: 12,
    competitorCount: 5,
    profit: 45.20,
    profitRate: 24,
    risk: 'low',
    score: 'A+',
  },
  {
    id: '2',
    image: '⌚',
    title: 'Seiko 5 Sports Automatic Watch SRPD79 Japan Made',
    price: 245.00,
    salesCount: 28,
    competitorCount: 12,
    profit: 62.30,
    profitRate: 25,
    risk: 'medium',
    score: 'A',
  },
  {
    id: '3',
    image: '🎎',
    title: 'Pokemon Card Japanese Charizard VMAX Rainbow Rare',
    price: 320.00,
    salesCount: 8,
    competitorCount: 25,
    profit: -12.50,
    profitRate: -4,
    risk: 'high',
    score: 'C',
  },
  {
    id: '4',
    image: '🏺',
    title: 'Antique Japanese Tea Bowl Raku Ware Chawan',
    price: 150.00,
    salesCount: 15,
    competitorCount: 3,
    profit: 38.00,
    profitRate: 25,
    risk: 'low',
    score: 'A',
  },
  {
    id: '5',
    image: '📱',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 349.99,
    salesCount: 42,
    competitorCount: 18,
    profit: 55.00,
    profitRate: 16,
    risk: 'low',
    score: 'B+',
  },
];

// ============================================================
// コンポーネント
// ============================================================

export default function ProductResearchTable({
  filter,
  selectedIds = [],
  onSelect,
  onSelectAll,
  onDetail,
  onApprove,
  onReject,
}: ProductResearchTableProps) {
  // フィルター適用
  const filteredData = useMemo(() => {
    if (!filter || filter === 'all') return MOCK_DATA;
    
    switch (filter) {
      case 'high-profit':
        return MOCK_DATA.filter(item => item.profitRate >= 20);
      case 'low-risk':
        return MOCK_DATA.filter(item => item.risk === 'low');
      case 'ai-recommended':
        return MOCK_DATA.filter(item => item.score.startsWith('A'));
      default:
        return MOCK_DATA;
    }
  }, [filter]);
  
  // 全選択状態
  const allSelected = filteredData.length > 0 && filteredData.every(item => selectedIds.includes(item.id));
  
  // 全選択ハンドラ
  const handleSelectAll = () => {
    if (allSelected) {
      onSelectAll?.([]);
    } else {
      onSelectAll?.(filteredData.map(item => item.id));
    }
  };
  
  // リスクバッジのバリアント
  const getRiskVariant = (risk: string): 'success' | 'warning' | 'error' => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'warning';
    }
  };
  
  // リスクラベル
  const getRiskLabel = (risk: string): string => {
    switch (risk) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      default: return risk;
    }
  };
  
  // スコアバッジのバリアント
  const getScoreVariant = (score: string): 'purple' | 'warning' | 'muted' => {
    if (score.startsWith('A')) return 'purple';
    if (score.startsWith('B')) return 'warning';
    return 'muted';
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[var(--n3-panel)]">
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">
              <N3Checkbox
                checked={allSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">画像</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">商品名</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">販売価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">販売数</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">競合</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">推定利益</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">利益率</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">リスク</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">スコア</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-[var(--n3-text-muted)] border-b border-[var(--n3-panel-border)] whitespace-nowrap">アクション</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isProfit = item.profit >= 0;
            
            return (
              <tr
                key={item.id}
                className={`
                  border-b border-[var(--n3-panel-border)]
                  hover:bg-[var(--n3-highlight)]
                  ${isSelected ? 'bg-[rgba(99,102,241,0.05)]' : ''}
                `}
              >
                <td className="p-2.5">
                  <N3Checkbox
                    checked={isSelected}
                    onChange={() => onSelect?.(item.id)}
                  />
                </td>
                <td className="p-2.5">
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-[var(--n3-panel)] text-xl">
                    {item.image}
                  </div>
                </td>
                <td className="p-2.5">
                  <div className="max-w-[300px] truncate">{item.title}</div>
                </td>
                <td className="p-2.5">
                  <span className="font-mono font-semibold">${item.price.toFixed(2)}</span>
                </td>
                <td className="p-2.5">{item.salesCount}</td>
                <td className="p-2.5">{item.competitorCount}</td>
                <td className="p-2.5">
                  <span className={`font-mono font-semibold ${isProfit ? 'text-[var(--n3-color-success)]' : 'text-[var(--n3-color-error)]'}`}>
                    {isProfit ? '+' : ''}{item.profit.toFixed(2)}
                  </span>
                </td>
                <td className="p-2.5">
                  <N3Badge variant={isProfit ? 'success' : 'error'} size="sm">
                    {item.profitRate}%
                  </N3Badge>
                </td>
                <td className="p-2.5">
                  <N3Badge variant={getRiskVariant(item.risk)} size="sm">
                    {getRiskLabel(item.risk)}
                  </N3Badge>
                </td>
                <td className="p-2.5">
                  <N3Badge variant={getScoreVariant(item.score)} size="sm">
                    {item.score}
                  </N3Badge>
                </td>
                <td className="p-2.5">
                  <div className="flex items-center gap-1">
                    <N3Button
                      variant="ghost"
                      size="xs"
                      icon={<Eye size={14} />}
                      onClick={() => onDetail?.(item.id)}
                    />
                    <N3Button
                      variant="ghost"
                      size="xs"
                      icon={<Check size={14} />}
                      onClick={() => onApprove?.(item.id)}
                      className="text-[var(--n3-color-success)]"
                    />
                    <N3Button
                      variant="ghost"
                      size="xs"
                      icon={<X size={14} />}
                      onClick={() => onReject?.(item.id)}
                      className="text-[var(--n3-color-error)]"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {filteredData.length === 0 && (
        <div className="py-12 text-center text-[var(--n3-text-muted)]">
          データがありません
        </div>
      )}
    </div>
  );
}
