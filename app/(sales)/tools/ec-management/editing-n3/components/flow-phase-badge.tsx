// app/tools/editing-n3/components/flow-phase-badge.tsx
/**
 * FLOWボタン連動フェーズバッジ
 * 
 * FLOWバーのボタンと連動:
 * - ① 翻訳 → Phase 1
 * - ② SM → Phase 2
 * - ③ 詳細 → Phase 3 (SM選択)
 * - ④ Gemini / ⓪ AI強化 → Phase 4
 * - ⑤ $ 処理 → Phase 4.5 (計算)
 * - ⑥⑦ 出品 → Phase 5
 */
'use client';

import React, { memo, useMemo, useState } from 'react';
import type { Product } from '@/app/tools/editing/types/product';
import { getProductPhase, PHASE_INFO, type ProductPhase } from '@/lib/product/phase-status';

// ============================================================
// FLOWボタンとの対応マッピング
// ============================================================

interface FlowButtonMapping {
  phase: ProductPhase;
  flowStep: string;      // FLOWバーのステップ番号
  flowLabel: string;     // FLOWバーのラベル
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
  description: string;
  buttonHint: string;    // 「押すべきボタン」のヒント
}

const FLOW_MAPPING: Record<ProductPhase, FlowButtonMapping> = {
  NO_TITLE: {
    phase: 'NO_TITLE',
    flowStep: '❓',
    flowLabel: '未設定',
    color: '#94a3b8',
    bgColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    emoji: '❓',
    description: 'タイトルが未設定',
    buttonHint: '商品をクリックしてタイトルを入力',
  },
  TRANSLATE: {
    phase: 'TRANSLATE',
    flowStep: '①',
    flowLabel: '翻訳',
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    emoji: '🔴',
    description: '英語タイトルが未設定',
    buttonHint: 'FLOW「① 翻訳」ボタンを押してください',
  },
  SCOUT: {
    phase: 'SCOUT',
    flowStep: '②',
    flowLabel: 'SM',
    color: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#fdba74',
    emoji: '🟠',
    description: 'SM類似品を検索中',
    buttonHint: 'FLOW「② SM」ボタンを押してください',
  },
  SELECT_SM: {
    phase: 'SELECT_SM',
    flowStep: '③',
    flowLabel: '詳細',
    color: '#eab308',
    bgColor: '#fefce8',
    borderColor: '#fde047',
    emoji: '🟡',
    description: 'SM候補から1つ選択してください',
    buttonHint: '商品をクリックして「③ 詳細」でSM選択',
  },
  FETCH_DETAILS: {
    phase: 'FETCH_DETAILS',
    flowStep: '③.5',
    flowLabel: '詳細取得',
    color: '#06b6d4',
    bgColor: '#ecfeff',
    borderColor: '#67e8f9',
    emoji: '📦',
    description: 'SM選択済み、Item Specifics取得中',
    buttonHint: '自動的に詳細データを取得中...',
  },
  ENRICH: {
    phase: 'ENRICH',
    flowStep: '④⑤',
    flowLabel: 'AI/計算',
    color: '#a855f7',
    bgColor: '#faf5ff',
    borderColor: '#d8b4fe',
    emoji: '🟣',
    description: 'AI補完と価格計算が必要',
    buttonHint: 'FLOW「④ Gemini」または「⑤ $ 処理」を押してください',
  },
  READY: {
    phase: 'READY',
    flowStep: '⑥⑦',
    flowLabel: '出品',
    color: '#22c55e',
    bgColor: '#f0fdf4',
    borderColor: '#86efac',
    emoji: '🟢',
    description: '出品可能',
    buttonHint: '✨ 出品準備完了！「⑥⑦ 出品」ボタンへ',
  },
  ERROR: {
    phase: 'ERROR',
    flowStep: '⚠️',
    flowLabel: 'エラー',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#f87171',
    emoji: '⚠️',
    description: 'エラーがあります',
    buttonHint: '商品をクリックしてエラーを確認',
  },
  LISTED: {
    phase: 'LISTED',
    flowStep: '✅',
    flowLabel: '出品済',
    color: '#06b6d4',
    bgColor: '#ecfeff',
    borderColor: '#67e8f9',
    emoji: '✅',
    description: '既に出品済み',
    buttonHint: 'eBayに出品済みです',
  },
  OTHER: {
    phase: 'OTHER',
    flowStep: '⚙',
    flowLabel: 'その他',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    borderColor: '#d1d5db',
    emoji: '📦',
    description: '分類外の商品',
    buttonHint: '商品をクリックして確認',
  },
  APPROVAL_PENDING: {
    phase: 'APPROVAL_PENDING',
    flowStep: '✅',
    flowLabel: '承認済',
    color: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#fdba74',
    emoji: '🟠',
    description: '承認済み・出品待ち',
    buttonHint: '出品予約に追加できます',
  },
};

// ============================================================
// タイトル未設定警告（特別扱い）
// ============================================================

interface TitleWarningBadgeProps {
  product: Product;
}

export const TitleWarningBadge = memo(function TitleWarningBadge({ product }: TitleWarningBadgeProps) {
  const hasJapaneseTitle = !!product.title;
  const hasEnglishTitle = !!(product.english_title || product.title_en);
  
  if (hasJapaneseTitle && hasEnglishTitle) {
    return null; // 両方あれば表示しない
  }
  
  if (!hasJapaneseTitle) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2,
          padding: '1px 6px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 500,
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fca5a5',
        }}
        title="日本語タイトルを入力してください"
      >
        ⚠️ タイトル未設定
      </span>
    );
  }
  
  return null;
});

// ============================================================
// FLOW連動フェーズバッジ（メイン）
// ============================================================

interface FlowPhaseBadgeProps {
  product: Product;
  size?: 'sm' | 'md';
  showHint?: boolean;
  onClick?: () => void;
}

export const FlowPhaseBadge = memo(function FlowPhaseBadge({
  product,
  size = 'md',
  showHint = false,
  onClick,
}: FlowPhaseBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const phaseResult = useMemo(() => getProductPhase(product), [product]);
  const mapping = FLOW_MAPPING[phaseResult.phase];
  
  const sizeStyles = {
    sm: { padding: '1px 4px', fontSize: '9px', minWidth: 20, height: 18 },
    md: { padding: '2px 6px', fontSize: '10px', minWidth: 24, height: 20 },
  };
  
  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          borderRadius: '4px',
          fontWeight: 600,
          fontFamily: 'monospace',
          background: mapping.bgColor,
          color: mapping.color,
          border: `1px solid ${mapping.borderColor}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.15s ease',
          ...sizeStyles[size],
        }}
        title={`${mapping.description}\n${mapping.buttonHint}`}
      >
        {mapping.flowStep}
      </button>
      
      {/* ホバー時のツールチップ */}
      {isHovered && (
        <div
          className="absolute z-50 left-full ml-2 top-1/2 -translate-y-1/2
                     bg-gray-900 text-white text-xs rounded-lg px-3 py-2
                     shadow-lg whitespace-nowrap"
          style={{ minWidth: 200 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span style={{ 
              padding: '1px 4px', 
              borderRadius: '3px', 
              background: mapping.color,
              color: 'white',
              fontSize: '10px',
              fontWeight: 600,
            }}>
              {mapping.flowStep} {mapping.flowLabel}
            </span>
            <span className="font-medium">{mapping.description}</span>
          </div>
          
          {phaseResult.missingFields.length > 0 && (
            <div className="text-gray-400 text-[10px] mb-1">
              不足: {phaseResult.missingFields.join(', ')}
            </div>
          )}
          
          <div className="pt-1 border-t border-gray-700 text-gray-300">
            💡 {mapping.buttonHint}
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================================
// ミニバッジ（テーブル行用）
// ============================================================

interface MiniFlowBadgeProps {
  product: Product;
}

export const MiniFlowBadge = memo(function MiniFlowBadge({ product }: MiniFlowBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const phaseResult = useMemo(() => getProductPhase(product), [product]);
  const mapping = FLOW_MAPPING[phaseResult.phase];
  
  return (
    <div className="relative inline-flex">
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 18,
          borderRadius: '3px',
          fontSize: '9px',
          fontWeight: 700,
          fontFamily: 'monospace',
          background: mapping.bgColor,
          color: mapping.color,
          border: `1px solid ${mapping.borderColor}`,
          cursor: 'help',
        }}
        title={`${mapping.flowStep} ${mapping.flowLabel}: ${mapping.buttonHint}`}
      >
        {mapping.flowStep.charAt(0)}
      </span>
      
      {/* ホバー時のツールチップ */}
      {isHovered && (
        <div
          className="absolute z-50 left-full ml-1 top-1/2 -translate-y-1/2
                     bg-gray-900 text-white text-[10px] rounded px-2 py-1.5
                     shadow-lg whitespace-nowrap"
        >
          <div className="font-medium mb-0.5">{mapping.emoji} {mapping.description}</div>
          <div className="text-gray-300">→ {mapping.buttonHint}</div>
        </div>
      )}
    </div>
  );
});

// ============================================================
// フェーズ別ソート用の数値変換
// ============================================================

export function getPhaseOrder(phase: ProductPhase): number {
  const order: Record<ProductPhase, number> = {
    NO_TITLE: 0,
    ERROR: 0.5,  // エラーは最優先で表示
    TRANSLATE: 1,
    SCOUT: 2,
    SELECT_SM: 3,
    FETCH_DETAILS: 3.5,
    ENRICH: 4,
    READY: 5,
    APPROVAL_PENDING: 5.5,
    LISTED: 6,
    OTHER: 9,
  };
  return order[phase] ?? 9; // undefinedの場合はその他扱い
}

export function sortProductsByPhase(products: Product[], order: 'asc' | 'desc' = 'asc'): Product[] {
  return [...products].sort((a, b) => {
    const phaseA = getPhaseOrder(getProductPhase(a).phase);
    const phaseB = getPhaseOrder(getProductPhase(b).phase);
    return order === 'asc' ? phaseA - phaseB : phaseB - phaseA;
  });
}

// ============================================================
// フェーズサマリーバー（FLOWボタン連動版）
// ============================================================

interface FlowPhaseSummaryProps {
  products: Product[];
  onPhaseClick?: (phase: ProductPhase) => void;
}

export const FlowPhaseSummary = memo(function FlowPhaseSummary({
  products,
  onPhaseClick,
}: FlowPhaseSummaryProps) {
  const summary = useMemo(() => {
    const counts: Record<ProductPhase, number> = {
      NO_TITLE: 0,
      TRANSLATE: 0,
      SCOUT: 0,
      SELECT_SM: 0,
      FETCH_DETAILS: 0,
      ENRICH: 0,
      READY: 0,
      APPROVAL_PENDING: 0,
      LISTED: 0,
      OTHER: 0,
      ERROR: 0,
    };
    
    for (const product of products) {
      const { phase } = getProductPhase(product);
      counts[phase]++;
    }
    
    return counts;
  }, [products]);
  
  const phases: ProductPhase[] = ['ERROR', 'NO_TITLE', 'TRANSLATE', 'SCOUT', 'SELECT_SM', 'FETCH_DETAILS', 'ENRICH', 'READY', 'APPROVAL_PENDING', 'LISTED'];
  
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {phases.map((phase) => {
        const count = summary[phase];
        if (count === 0) return null;
        
        const mapping = FLOW_MAPPING[phase];
        
        return (
          <button
            key={phase}
            onClick={() => onPhaseClick?.(phase)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded
                       text-[10px] font-medium transition-all duration-200
                       hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: mapping.bgColor,
              color: mapping.color,
              border: `1px solid ${mapping.borderColor}`,
            }}
            title={`${count}件: ${mapping.buttonHint}`}
          >
            <span className="font-bold">{mapping.flowStep}</span>
            <span
              className="px-1 rounded text-[9px] font-bold"
              style={{ backgroundColor: mapping.color, color: 'white' }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
});
