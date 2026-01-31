// app/tools/editing-n3/components/phase-badge.tsx
/**
 * 商品フェーズステータスバッジ
 * 
 * 5フェーズモデルに基づく進捗表示:
 * - 🔴 翻訳待ち
 * - 🟡 SM検索待ち
 * - 🔵 SM選択待ち（要人間操作）
 * - 🟣 補完待ち
 * - 🟢 出品OK
 */
'use client';

import React, { memo, useMemo, useState } from 'react';
import type { Product } from '@/app/tools/editing/types/product';
import { getProductPhase, getNextAction, PHASE_INFO } from '@/lib/product/phase-status';
import type { ProductPhase, PhaseCheckResult, NextAction } from '@/lib/product/phase-status';
import { 
  Globe, 
  Search, 
  MousePointerClick, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

// ============================================================
// アイコンマッピング
// ============================================================

const PHASE_ICONS: Record<ProductPhase, React.ElementType> = {
  TRANSLATE: Globe,
  SCOUT: Search,
  SELECT_SM: MousePointerClick,
  ENRICH: Sparkles,
  READY: CheckCircle,
  ERROR: AlertTriangle,
};

// ============================================================
// コンパクトバッジ（テーブル行用）
// ============================================================

interface PhaseBadgeProps {
  product: Product;
  showAction?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (product: Product, action: NextAction) => void;
}

export const PhaseBadge = memo(function PhaseBadge({
  product,
  showAction = true,
  size = 'md',
  onClick,
}: PhaseBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const phaseResult = useMemo(() => getProductPhase(product), [product]);
  const nextAction = useMemo(() => getNextAction(product), [product]);
  
  const { phase, info, missingFields, progress } = phaseResult;
  const Icon = PHASE_ICONS[phase];
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };
  
  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };
  
  const handleClick = () => {
    if (onClick && nextAction.type !== 'none') {
      onClick(product, nextAction);
    }
  };
  
  return (
    <div className="relative inline-flex items-center">
      {/* メインバッジ */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={nextAction.type === 'none'}
        className={`
          inline-flex items-center rounded-full font-medium
          transition-all duration-200
          ${sizeClasses[size]}
          ${nextAction.type !== 'none' ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
        `}
        style={{
          backgroundColor: info.bgColor,
          color: info.color,
          border: `1px solid ${info.borderColor}`,
        }}
      >
        <Icon size={iconSizes[size]} />
        <span>{info.label}</span>
        {showAction && nextAction.type !== 'none' && (
          <ChevronRight size={iconSizes[size]} className="opacity-60" />
        )}
      </button>
      
      {/* ホバー時のツールチップ */}
      {isHovered && missingFields.length > 0 && (
        <div
          className="absolute z-50 left-full ml-2 top-1/2 -translate-y-1/2
                     bg-gray-900 text-white text-xs rounded-lg px-3 py-2
                     shadow-lg whitespace-nowrap"
        >
          <div className="font-medium mb-1">不足項目:</div>
          <ul className="space-y-0.5">
            {missingFields.map((field, i) => (
              <li key={i} className="flex items-center gap-1">
                <span className="w-1 h-1 bg-red-400 rounded-full" />
                {field}
              </li>
            ))}
          </ul>
          {nextAction.type !== 'none' && (
            <div className="mt-2 pt-2 border-t border-gray-700 text-gray-300">
              クリックで「{nextAction.label}」
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================================
// 詳細バッジ（カード表示用）
// ============================================================

interface PhaseDetailBadgeProps {
  product: Product;
  onActionClick?: (product: Product, action: NextAction) => void;
}

export const PhaseDetailBadge = memo(function PhaseDetailBadge({
  product,
  onActionClick,
}: PhaseDetailBadgeProps) {
  const phaseResult = useMemo(() => getProductPhase(product), [product]);
  const nextAction = useMemo(() => getNextAction(product), [product]);
  
  const { phase, info, missingFields, progress } = phaseResult;
  const Icon = PHASE_ICONS[phase];
  
  return (
    <div
      className="rounded-lg p-3"
      style={{
        backgroundColor: info.bgColor,
        border: `1px solid ${info.borderColor}`,
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: info.color }} />
          <span className="font-medium" style={{ color: info.color }}>
            {info.emoji} {info.label}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {progress.current}/{progress.total}
        </span>
      </div>
      
      {/* プログレスバー */}
      <div className="h-1.5 bg-gray-200 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress.percentage}%`,
            backgroundColor: info.color,
          }}
        />
      </div>
      
      {/* 不足項目 */}
      {missingFields.length > 0 && (
        <div className="text-xs text-gray-600 mb-2">
          <span className="font-medium">不足:</span>{' '}
          {missingFields.join(', ')}
        </div>
      )}
      
      {/* アクションボタン */}
      {nextAction.type !== 'none' && (
        <button
          onClick={() => onActionClick?.(product, nextAction)}
          className={`
            w-full flex items-center justify-center gap-2
            px-3 py-1.5 rounded-md text-sm font-medium
            transition-all duration-200
            ${nextAction.type === 'manual' 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <span>{nextAction.icon}</span>
          <span>{nextAction.label}</span>
        </button>
      )}
    </div>
  );
});

// ============================================================
// フェーズサマリーバー（ヘッダー用）
// ============================================================

interface PhaseSummaryBarProps {
  products: Product[];
  onPhaseClick?: (phase: ProductPhase) => void;
}

export const PhaseSummaryBar = memo(function PhaseSummaryBar({
  products,
  onPhaseClick,
}: PhaseSummaryBarProps) {
  const summary = useMemo(() => {
    const counts: Record<ProductPhase, number> = {
      TRANSLATE: 0,
      SCOUT: 0,
      SELECT_SM: 0,
      ENRICH: 0,
      READY: 0,
      ERROR: 0,
    };
    
    for (const product of products) {
      const { phase } = getProductPhase(product);
      counts[phase]++;
    }
    
    return counts;
  }, [products]);
  
  const phases: ProductPhase[] = ['TRANSLATE', 'SCOUT', 'SELECT_SM', 'ENRICH', 'READY', 'ERROR'];
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {phases.map((phase) => {
        const count = summary[phase];
        if (count === 0) return null;
        
        const info = PHASE_INFO[phase];
        const Icon = PHASE_ICONS[phase];
        
        return (
          <button
            key={phase}
            onClick={() => onPhaseClick?.(phase)}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md
                       text-xs font-medium transition-all duration-200
                       hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: info.bgColor,
              color: info.color,
              border: `1px solid ${info.borderColor}`,
            }}
          >
            <Icon size={12} />
            <span>{info.label}</span>
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{ backgroundColor: info.color, color: 'white' }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
});

// ============================================================
// ミニバッジ（リスト内インライン用）
// ============================================================

interface MiniPhaseBadgeProps {
  product: Product;
}

export const MiniPhaseBadge = memo(function MiniPhaseBadge({
  product,
}: MiniPhaseBadgeProps) {
  const { phase, info } = useMemo(() => getProductPhase(product), [product]);
  const Icon = PHASE_ICONS[phase];
  
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full"
      style={{ backgroundColor: info.bgColor }}
      title={info.label}
    >
      <Icon size={12} style={{ color: info.color }} />
    </span>
  );
});
