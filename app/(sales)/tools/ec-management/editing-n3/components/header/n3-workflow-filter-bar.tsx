// app/tools/editing-n3/components/header/n3-workflow-filter-bar.tsx
/**
 * N3 工程別フィルターバー（v7.0）
 * 
 * v7.0:
 * - 🔥 counts APIからの工程カウントを使用（表示中の商品からの計算ではない）
 * - workflowCountsPropを追加
 * 
 * v6.0:
 * - 「📦アーカイブ」タブを常時表示
 * - L3フィルターの `archived` タブと連携
 * 
 * v5.0:
 * - 手動移動ボタンに「→アーカイブ」追加
 */

'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { Languages, Search, MousePointer, Sparkles, CheckCircle2, Zap, X, AlertTriangle, ArrowRight, Archive, Send, Package } from 'lucide-react';
import type { Product } from '@/app/tools/editing/types/product';
import { getProductPhase, getPhaseSummary, type ProductPhase } from '@/lib/product/phase-status';

// ============================================================
// 型定義
// ============================================================

export interface WorkflowPhaseFilter {
  phase: ProductPhase | null;
  isArchiveView: boolean;
}

// 🔥 v7.0: counts APIからの工程カウント型
export interface WorkflowCountsFromAPI {
  translation: number;
  search: number;
  selection: number;
  details: number;
  enrichment: number;
  approval: number;
  listed: number;
  others: number;
}

export interface N3WorkflowFilterBarProps {
  products: Product[];
  activePhase: ProductPhase | null;
  onPhaseChange: (phase: ProductPhase | null) => void;
  tipsEnabled: boolean;
  onTipsToggle: () => void;
  onBulkTranslate?: (productIds: number[]) => Promise<void>;
  onBulkSMSearch?: (productIds: number[]) => Promise<void>;
  onBulkFetchDetails?: (productIds: number[]) => Promise<void>;
  onBulkAIEnrich?: (productIds: number[]) => Promise<void>;
  onBulkApprove?: (productIds: number[]) => Promise<void>;
  // ✨ 手動移動ハンドラー
  selectedIds?: Set<string>;
  onMoveToOther?: (productIds: string[]) => Promise<void>;
  onMoveToListed?: (productIds: string[]) => Promise<void>;
  onMoveToArchive?: (productIds: string[]) => Promise<void>;
  // ✨ アーカイブフィルター
  isArchiveFilterActive?: boolean;
  onArchiveFilterToggle?: () => void;
  // ✨ アーカイブ件数（外部から渡す）
  archivedCount?: number;
  // ✨ SM連続選択モーダルを開く
  onOpenSMSequentialModal?: (products: Product[]) => void;
  // 🔥 詳細取得ハンドラー
  onDetails?: () => void;
  // 🔥 v7.0: counts APIからの工程カウント（外部から渡す）
  workflowCountsProp?: WorkflowCountsFromAPI;
}

// ============================================================
// 工程定義（薄い色バージョン）
// ============================================================

interface PhaseConfig {
  phase: ProductPhase;
  number: number;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  dotColor: string;
  bgColor: string;
  activeBgColor: string;
  tooltip: string;
  bulkActionLabel: string | null;
  // 🔥 v7.0: counts APIのキー名
  apiKey?: keyof WorkflowCountsFromAPI;
}

const PHASE_CONFIGS: PhaseConfig[] = [
  {
    phase: 'TRANSLATE',
    number: 1,
    label: '翻訳待ち',
    shortLabel: '翻訳',
    icon: Languages,
    dotColor: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.08)',
    activeBgColor: 'rgba(239, 68, 68, 0.15)',
    tooltip: '英語タイトルが未設定。「一括翻訳」で自動翻訳。',
    bulkActionLabel: '一括翻訳',
    apiKey: 'translation',
  },
  {
    phase: 'SCOUT',
    number: 2,
    label: '検索待ち',
    shortLabel: '検索',
    icon: Search,
    dotColor: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    activeBgColor: 'rgba(245, 158, 11, 0.15)',
    tooltip: 'SM候補を検索。「一括SM分析」で類似商品を検索。',
    bulkActionLabel: '一括SM',
    apiKey: 'search',
  },
  {
    phase: 'SELECT_SM',
    number: 3,
    label: '選択待ち',
    shortLabel: '選択',
    icon: MousePointer,
    dotColor: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.08)',
    activeBgColor: 'rgba(59, 130, 246, 0.15)',
    tooltip: 'SM候補から1つ選択してください（手動）。',
    bulkActionLabel: null,
    apiKey: 'selection',
  },
  {
    phase: 'FETCH_DETAILS',
    number: 3.5,
    label: '詳細待ち',
    shortLabel: '詳細',
    icon: Package,
    dotColor: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.08)',
    activeBgColor: 'rgba(6, 182, 212, 0.15)',
    tooltip: 'SM選択済み。「一括詳細」でItem Specificsを取得。',
    bulkActionLabel: '一括詳細',
    apiKey: 'details',
  },
  {
    phase: 'ENRICH',
    number: 4,
    label: '補完待ち',
    shortLabel: '補完',
    icon: Sparkles,
    dotColor: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.08)',
    activeBgColor: 'rgba(168, 85, 247, 0.15)',
    tooltip: '重量・HTS・価格計算が未完了。「一括AI強化」で補完。',
    bulkActionLabel: '一括AI',
    apiKey: 'enrichment',
  },
  {
    phase: 'READY',
    number: 5,
    label: '承認待ち',
    shortLabel: '承認',
    icon: CheckCircle2,
    dotColor: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.08)',
    activeBgColor: 'rgba(34, 197, 94, 0.15)',
    tooltip: '全データ完了！出品可能です。',
    bulkActionLabel: '一括承認',
    apiKey: 'approval',
  },
];

const OTHER_CONFIG: PhaseConfig = {
  phase: 'OTHER',
  number: 0,
  label: 'その他',
  shortLabel: 'その他',
  icon: CheckCircle2,
  dotColor: '#6b7280',
  bgColor: 'rgba(107, 114, 128, 0.08)',
  activeBgColor: 'rgba(107, 114, 128, 0.15)',
  tooltip: 'タイトル未設定・エラー等、1-5の工程外の商品',
  bulkActionLabel: null,
  apiKey: 'others',
};

const LISTED_CONFIG: PhaseConfig = {
  phase: 'LISTED',
  number: 6,
  label: '出品済',
  shortLabel: '出品済',
  icon: CheckCircle2,
  dotColor: '#06b6d4',
  bgColor: 'rgba(6, 182, 212, 0.08)',
  activeBgColor: 'rgba(6, 182, 212, 0.15)',
  tooltip: 'eBay/Amazon等に出品済みの商品',
  bulkActionLabel: null,
  apiKey: 'listed',
};

// ✨ アーカイブ設定
const ARCHIVE_CONFIG = {
  dotColor: '#8b5cf6',
  bgColor: 'rgba(139, 92, 246, 0.08)',
  activeBgColor: 'rgba(139, 92, 246, 0.15)',
  tooltip: 'データ整理用の保管場所。不要な商品をここに移動。',
};

// ============================================================
// メインコンポーネント
// ============================================================

export const N3WorkflowFilterBar = memo(function N3WorkflowFilterBar({
  products,
  activePhase,
  onPhaseChange,
  tipsEnabled,
  onTipsToggle,
  onBulkTranslate,
  onBulkSMSearch,
  onBulkFetchDetails,
  onBulkAIEnrich,
  onBulkApprove,
  selectedIds,
  onMoveToOther,
  onMoveToListed,
  onMoveToArchive,
  isArchiveFilterActive,
  onArchiveFilterToggle,
  archivedCount: archivedCountProp,
  onOpenSMSequentialModal,
  workflowCountsProp,
}: N3WorkflowFilterBarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredPhase, setHoveredPhase] = useState<ProductPhase | null>(null);

  // 🔥 v7.0: counts APIから渡されたカウントを優先、なければproductsから計算
  const phaseCounts = useMemo(() => {
    // 外部からカウントが渡された場合はそれを使用
    if (workflowCountsProp) {
      return {
        TRANSLATE: workflowCountsProp.translation,
        SCOUT: workflowCountsProp.search,
        SELECT_SM: workflowCountsProp.selection,
        FETCH_DETAILS: workflowCountsProp.details,
        ENRICH: workflowCountsProp.enrichment,
        READY: workflowCountsProp.approval,
        LISTED: workflowCountsProp.listed,
        OTHER: workflowCountsProp.others,
        NO_TITLE: 0,  // othersに含まれる
        ERROR: 0,     // othersに含まれる
        APPROVAL_PENDING: 0,  // listedに含まれる
      } as Record<ProductPhase, number>;
    }
    // フォールバック: productsから計算
    return getPhaseSummary(products);
  }, [products, workflowCountsProp]);
  
  // 「その他」の件数
  const otherCount = useMemo(() => {
    if (workflowCountsProp) {
      return workflowCountsProp.others;
    }
    return (phaseCounts['NO_TITLE'] || 0) +
           (phaseCounts['OTHER'] || 0) + 
           (phaseCounts['ERROR'] || 0);
  }, [phaseCounts, workflowCountsProp]);
  
  // 「出品済」の件数
  const listedCount = useMemo(() => {
    if (workflowCountsProp) {
      return workflowCountsProp.listed;
    }
    return (phaseCounts['LISTED'] || 0) + 
           (phaseCounts['APPROVAL_PENDING'] || 0);
  }, [phaseCounts, workflowCountsProp]);

  // ✨ 「アーカイブ」の件数（propsから渡された値を優先）
  const archiveCount = useMemo(() => {
    if (archivedCountProp !== undefined) return archivedCountProp;
    return products.filter(p => p.is_archived === true).length;
  }, [products, archivedCountProp]);

  // アクティブフェーズの商品を取得（表示中の商品からフィルタリング）
  const activePhaseProducts = useMemo(() => {
    if (!activePhase) return [];
    return products.filter(p => getProductPhase(p).phase === activePhase);
  }, [products, activePhase]);
  
  // アクティブフェーズの設定を取得
  const activeConfig = useMemo(() => {
    if (!activePhase) return null;
    if (activePhase === 'OTHER' || activePhase === 'NO_TITLE' || activePhase === 'ERROR') {
      return OTHER_CONFIG;
    }
    if (activePhase === 'LISTED' || activePhase === 'APPROVAL_PENDING') {
      return LISTED_CONFIG;
    }
    return PHASE_CONFIGS.find(p => p.phase === activePhase) || null;
  }, [activePhase]);
  
  const isOtherActive = activePhase === 'OTHER' || activePhase === 'NO_TITLE' || activePhase === 'ERROR';
  const isListedActive = activePhase === 'LISTED' || activePhase === 'APPROVAL_PENDING';
  
  // 選択件数
  const selectedCount = selectedIds?.size || 0;

  // 一括処理実行
  const handleBulkAction = useCallback(async () => {
    if (!activePhase || activePhaseProducts.length === 0) return;

    setIsProcessing(true);
    const productIds = activePhaseProducts.map(p => p.id);

    try {
      switch (activePhase) {
        case 'TRANSLATE':
          if (onBulkTranslate) await onBulkTranslate(productIds);
          break;
        case 'SCOUT':
          if (onBulkSMSearch) await onBulkSMSearch(productIds);
          break;
        case 'FETCH_DETAILS':
          if (onBulkFetchDetails) await onBulkFetchDetails(productIds);
          break;
        case 'ENRICH':
          if (onBulkAIEnrich) await onBulkAIEnrich(productIds);
          break;
        case 'READY':
          if (onBulkApprove) await onBulkApprove(productIds);
          break;
      }
    } catch (error) {
      console.error('[N3WorkflowFilterBar] Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [activePhase, activePhaseProducts, onBulkTranslate, onBulkSMSearch, onBulkFetchDetails, onBulkAIEnrich, onBulkApprove]);

  // ✨ その他に移動
  const handleMoveToOther = useCallback(async () => {
    if (!selectedIds || selectedIds.size === 0 || !onMoveToOther) return;
    setIsProcessing(true);
    try {
      await onMoveToOther(Array.from(selectedIds));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, onMoveToOther]);

  // ✨ 出品済に移動
  const handleMoveToListed = useCallback(async () => {
    if (!selectedIds || selectedIds.size === 0 || !onMoveToListed) return;
    setIsProcessing(true);
    try {
      await onMoveToListed(Array.from(selectedIds));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, onMoveToListed]);

  // ✨ アーカイブに移動
  const handleMoveToArchive = useCallback(async () => {
    if (!selectedIds || selectedIds.size === 0 || !onMoveToArchive) return;
    setIsProcessing(true);
    try {
      await onMoveToArchive(Array.from(selectedIds));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, onMoveToArchive]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        background: 'var(--highlight)',
        borderBottom: '1px solid var(--panel-border)',
        height: 32,
        flexShrink: 0,
      }}
    >
      {/* 🔥 一括処理ボタン（左端・アクティブ時のみ） */}
      {activePhase && activeConfig && (
        <>
          {activeConfig.bulkActionLabel ? (
            <button
              onClick={handleBulkAction}
              disabled={isProcessing || activePhaseProducts.length === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                height: 24,
                padding: '0 10px',
                fontSize: '11px',
                fontWeight: 600,
                background: activeConfig.dotColor,
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: isProcessing || activePhaseProducts.length === 0 ? 'not-allowed' : 'pointer',
                opacity: isProcessing || activePhaseProducts.length === 0 ? 0.6 : 1,
              }}
            >
              {isProcessing ? (
                <>⏳ 処理中...</>
              ) : (
                <>
                  <Zap size={11} />
                  {activeConfig.bulkActionLabel}
                  <span style={{
                    padding: '0 4px',
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: 3,
                    fontSize: '10px',
                  }}>
                    {activePhaseProducts.length}
                  </span>
                </>
              )}
            </button>
          ) : activePhase === 'SELECT_SM' ? (
            <button
              onClick={() => {
                console.log('[N3WorkflowFilterBar] 連続選択ボタンがクリックされました');
                console.log('[N3WorkflowFilterBar] activePhaseProducts.length:', activePhaseProducts.length);
                
                // SM分析済みの商品（選択待ち）のみ対象
                const smProducts = activePhaseProducts.filter(p => {
                  const ebayData = (p as any)?.ebay_api_data || {};
                  const browseItems = ebayData?.browse_result?.items || [];
                  const refItems = ebayData?.listing_reference?.referenceItems || [];
                  const hasSMData = browseItems.length > 0 || refItems.length > 0;
                  console.log(`[N3WorkflowFilterBar] 商品ID=${p.id}: browseItems=${browseItems.length}, refItems=${refItems.length}, hasSMData=${hasSMData}`);
                  return hasSMData;
                });
                
                console.log('[N3WorkflowFilterBar] SM分析結果あり商品数:', smProducts.length);
                
                if (!onOpenSMSequentialModal) {
                  console.error('[N3WorkflowFilterBar] onOpenSMSequentialModalが未定義です');
                  return;
                }
                
                // SM分析結果がある商品のみ対象
                if (smProducts.length > 0) {
                  console.log('[N3WorkflowFilterBar] モーダルを開きます');
                  onOpenSMSequentialModal(smProducts);
                } else {
                  // SM分析結果がないが、選択待ちの商品はある場合
                  // → 全商品を対象にする（SMSequentialSelectionModal内で「SM結果なし」として表示）
                  console.log('[N3WorkflowFilterBar] SM分析結果がない商品も含めてモーダルを開きます');
                  onOpenSMSequentialModal(activePhaseProducts);
                }
              }}
              disabled={activePhaseProducts.length === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                height: 24,
                padding: '0 10px',
                fontSize: '11px',
                fontWeight: 600,
                background: activeConfig.dotColor,
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: activePhaseProducts.length === 0 ? 'not-allowed' : 'pointer',
                opacity: activePhaseProducts.length === 0 ? 0.6 : 1,
              }}
            >
              <MousePointer size={11} />
              連続選択
              <span style={{
                padding: '0 4px',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 3,
                fontSize: '10px',
              }}>
                {activePhaseProducts.length}
              </span>
            </button>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                height: 24,
                padding: '0 8px',
                fontSize: '10px',
                color: activeConfig.dotColor,
                background: activeConfig.bgColor,
                border: `1px solid ${activeConfig.dotColor}30`,
                borderRadius: 4,
              }}
            >
              <AlertTriangle size={11} />
              手動選択が必要
            </span>
          )}
          
          {/* リセットボタン */}
          <button
            onClick={() => onPhaseChange(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              padding: 0,
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
            title="フィルター解除"
          >
            <X size={12} />
          </button>
          
          {/* セパレーター */}
          <div style={{ width: 1, height: 16, background: 'var(--panel-border)', margin: '0 4px' }} />
        </>
      )}
      
      {/* フェーズボタン群（1-5） */}
      {PHASE_CONFIGS.map((config) => {
        // 🔥 v7.0: counts APIから取得したカウントを使用
        const count = phaseCounts[config.phase] || 0;
        const isActive = activePhase === config.phase;
        const isHovered = hoveredPhase === config.phase;
        
        return (
          <div key={config.phase} style={{ position: 'relative' }}>
            <button
              onClick={() => onPhaseChange(isActive ? null : config.phase)}
              onMouseEnter={() => tipsEnabled && setHoveredPhase(config.phase)}
              onMouseLeave={() => setHoveredPhase(null)}
              disabled={count === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                height: 24,
                padding: '0 8px',
                fontSize: '11px',
                fontWeight: 500,
                background: isActive ? config.activeBgColor : 'transparent',
                color: 'var(--text-muted)',
                border: isActive ? `1px solid ${config.dotColor}40` : '1px solid transparent',
                borderRadius: 4,
                cursor: count === 0 ? 'not-allowed' : 'pointer',
                opacity: count === 0 ? 0.4 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: config.dotColor,
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 700,
                  opacity: count === 0 ? 0.5 : 1,
                }}
              >
                {config.number}
              </span>
              <span>{config.shortLabel}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: isActive ? config.dotColor : 'var(--text-muted)' }}>
                {count}
              </span>
            </button>
            
            {isHovered && tipsEnabled && (
              <div
                className="n3-tooltip"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: config.number === 1 ? 0 : config.number >= 4 ? 'auto' : 0,
                  right: config.number >= 4 ? 0 : 'auto',
                  marginTop: 6,
                  padding: '8px 12px',
                  background: '#1f2937',
                  color: 'white',
                  borderRadius: 6,
                  fontSize: '10px',
                  lineHeight: 1.4,
                  maxWidth: 200,
                  zIndex: 'var(--z-tooltip, 100)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  whiteSpace: 'normal',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{config.number}. {config.label}</div>
                <div style={{ color: '#d1d5db' }}>{config.tooltip}</div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* セパレーター */}
      <div style={{ width: 1, height: 16, background: 'var(--panel-border)', margin: '0 4px' }} />
      
      {/* ✨ 「その他」タブ */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => onPhaseChange(isOtherActive ? null : 'OTHER')}
          onMouseEnter={() => tipsEnabled && setHoveredPhase('OTHER')}
          onMouseLeave={() => setHoveredPhase(null)}
          disabled={otherCount === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 24,
            padding: '0 8px',
            fontSize: '11px',
            fontWeight: 500,
            background: isOtherActive ? OTHER_CONFIG.activeBgColor : 'transparent',
            color: 'var(--text-muted)',
            border: isOtherActive ? `1px solid ${OTHER_CONFIG.dotColor}40` : '1px solid transparent',
            borderRadius: 4,
            cursor: otherCount === 0 ? 'not-allowed' : 'pointer',
            opacity: otherCount === 0 ? 0.4 : 1,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: OTHER_CONFIG.dotColor, color: 'white', fontSize: '9px', fontWeight: 700 }}>⚙</span>
          <span>その他</span>
          <span style={{ fontSize: '10px', fontWeight: 600, color: isOtherActive ? OTHER_CONFIG.dotColor : 'var(--text-muted)' }}>{otherCount}</span>
        </button>
        
        {hoveredPhase === 'OTHER' && tipsEnabled && (
          <div className="n3-tooltip" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, padding: '8px 12px', background: '#1f2937', color: 'white', borderRadius: 6, fontSize: '10px', maxWidth: 200, zIndex: 100, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>その他</div>
            <div style={{ color: '#d1d5db' }}>{OTHER_CONFIG.tooltip}</div>
          </div>
        )}
      </div>
      
      {/* ✨ 「出品済」タブ */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => onPhaseChange(isListedActive ? null : 'LISTED')}
          onMouseEnter={() => tipsEnabled && setHoveredPhase('LISTED')}
          onMouseLeave={() => setHoveredPhase(null)}
          disabled={listedCount === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 24,
            padding: '0 8px',
            fontSize: '11px',
            fontWeight: 500,
            background: isListedActive ? LISTED_CONFIG.activeBgColor : 'transparent',
            color: 'var(--text-muted)',
            border: isListedActive ? `1px solid ${LISTED_CONFIG.dotColor}40` : '1px solid transparent',
            borderRadius: 4,
            cursor: listedCount === 0 ? 'not-allowed' : 'pointer',
            opacity: listedCount === 0 ? 0.4 : 1,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: LISTED_CONFIG.dotColor, color: 'white', fontSize: '9px', fontWeight: 700 }}>✓</span>
          <span>出品済</span>
          <span style={{ fontSize: '10px', fontWeight: 600, color: isListedActive ? LISTED_CONFIG.dotColor : 'var(--text-muted)' }}>{listedCount}</span>
        </button>
        
        {hoveredPhase === 'LISTED' && tipsEnabled && (
          <div className="n3-tooltip" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, padding: '8px 12px', background: '#1f2937', color: 'white', borderRadius: 6, fontSize: '10px', maxWidth: 200, zIndex: 100, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>出品済</div>
            <div style={{ color: '#d1d5db' }}>{LISTED_CONFIG.tooltip}</div>
          </div>
        )}
      </div>
      
      {/* ✨ 「📦アーカイブ」タブ（常時表示） */}
      {onArchiveFilterToggle && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={onArchiveFilterToggle}
            onMouseEnter={() => tipsEnabled && setHoveredPhase('ARCHIVE' as any)}
            onMouseLeave={() => setHoveredPhase(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              height: 24,
              padding: '0 8px',
              fontSize: '11px',
              fontWeight: 500,
              background: isArchiveFilterActive ? ARCHIVE_CONFIG.activeBgColor : 'transparent',
              color: 'var(--text-muted)',
              border: isArchiveFilterActive ? `1px solid ${ARCHIVE_CONFIG.dotColor}40` : '1px solid transparent',
              borderRadius: 4,
              cursor: 'pointer',
              opacity: archiveCount === 0 && !isArchiveFilterActive ? 0.5 : 1,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: ARCHIVE_CONFIG.dotColor, color: 'white', fontSize: '9px', fontWeight: 700 }}>📦</span>
            <span>アーカイブ</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: isArchiveFilterActive ? ARCHIVE_CONFIG.dotColor : 'var(--text-muted)' }}>{archiveCount}</span>
          </button>
          
          {hoveredPhase === ('ARCHIVE' as any) && tipsEnabled && (
            <div className="n3-tooltip" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, padding: '8px 12px', background: '#1f2937', color: 'white', borderRadius: 6, fontSize: '10px', maxWidth: 200, zIndex: 100, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>📦 アーカイブ</div>
              <div style={{ color: '#d1d5db' }}>{ARCHIVE_CONFIG.tooltip}</div>
            </div>
          )}
        </div>
      )}
      
      {/* ✨ 手動移動ボタン群（選択時のみ表示） */}
      {selectedCount > 0 && onMoveToOther && onMoveToListed && (
        <>
          <div style={{ width: 1, height: 16, background: 'var(--panel-border)', margin: '0 8px' }} />
          
          {/* →その他に移動 */}
          <button
            onClick={handleMoveToOther}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 24,
              padding: '0 8px',
              fontSize: '10px',
              fontWeight: 500,
              background: 'rgba(107, 114, 128, 0.1)',
              color: '#6b7280',
              border: '1px solid rgba(107, 114, 128, 0.3)',
              borderRadius: 4,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
            }}
            title={`選択中の${selectedCount}件を「その他」に移動`}
          >
            <Archive size={11} />
            <ArrowRight size={10} />
            <span>その他</span>
            <span style={{ padding: '0 3px', background: 'rgba(107, 114, 128, 0.2)', borderRadius: 2, fontSize: '9px' }}>{selectedCount}</span>
          </button>
          
          {/* →出品済に移動 */}
          <button
            onClick={handleMoveToListed}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 24,
              padding: '0 8px',
              fontSize: '10px',
              fontWeight: 500,
              background: 'rgba(6, 182, 212, 0.1)',
              color: '#06b6d4',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 4,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
            }}
            title={`選択中の${selectedCount}件を「出品済」に移動`}
          >
            <Send size={11} />
            <ArrowRight size={10} />
            <span>出品済</span>
            <span style={{ padding: '0 3px', background: 'rgba(6, 182, 212, 0.2)', borderRadius: 2, fontSize: '9px' }}>{selectedCount}</span>
          </button>
          
          {/* →アーカイブに移動（データ整理用） */}
          {onMoveToArchive && (
            <button
              onClick={handleMoveToArchive}
              disabled={isProcessing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                height: 24,
                padding: '0 8px',
                fontSize: '10px',
                fontWeight: 500,
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#8b5cf6',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 4,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.6 : 1,
              }}
              title={`選択中の${selectedCount}件を「アーカイブ」に保管`}
            >
              <Archive size={11} />
              <ArrowRight size={10} />
              <span>アーカイブ</span>
              <span style={{ padding: '0 3px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: 2, fontSize: '9px' }}>{selectedCount}</span>
            </button>
          )}
        </>
      )}
    </div>
  );
});

export default N3WorkflowFilterBar;
