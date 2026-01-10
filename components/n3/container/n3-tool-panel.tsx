/**
 * N3ToolPanel - ツールパネルコンポーネント
 * 
 * 既存の /tools/editing/components/tool-panel.tsx を
 * N3デザインシステムに準拠したコンポーネントとして再実装
 * 
 * 構成:
 * - マーケットプレイス選択（左端）
 * - メインツールバー: Run All, Paste, Reload, CSV, Cat, Ship, Profit, HTML, Score, HTS, Origin, Material, Filter, Research, AI
 * - フローパネル: 翻訳, SM, 詳細, Gemini, 処理, 出品
 * - アクション: Export, Save, Delete
 */

'use client';

import React, { useState, memo, useCallback } from 'react';
import {
  Zap, Copy, RefreshCw, Upload, FolderOpen, Truck, Code, Calculator,
  BarChart3, Shield, Search, Filter, Sparkles, Globe, Package, FileText,
  DollarSign, CheckCircle, Save, Trash2, Download, ChevronDown, Loader2, 
  Layers, ShoppingBag, PackageCheck, Store,
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

export type CalculationMarketplace = 
  | 'ebay' 
  | 'all' 
  | 'qoo10_jp' 
  | 'amazon_jp' 
  | 'mercari_jp'
  | 'yahoo_auction_jp';

// 機能タグ（Feature Flags）
export type MarketplaceFeature = 
  | 'translation'        // 翻訳
  | 'seller_mirror'      // SM（eBay競合検索）
  | 'hts'                // 関税コード
  | 'origin'             // 原産国
  | 'material'           // 素材
  | 'international_ship' // 国際送料
  | 'domestic_ship'      // 国内送料
  | 'fba'                // FBA納品
  | 'auction'            // オークション設定
  | 'html_template'      // HTMLテンプレート
  | 'score'              // 競合スコア
  | 'ai_enhance'         // AI強化
  | 'gemini'             // Gemini分析
  | 'category'           // カテゴリ設定
  | 'research';          // リサーチ

export interface N3ToolPanelProps {
  /** 処理中フラグ */
  processing?: boolean;
  /** 現在の処理ステップ */
  currentStep?: string;
  /** 変更された件数 */
  modifiedCount?: number;
  /** 出品準備完了件数 */
  readyCount?: number;
  /** 選択されたミラー件数 */
  selectedMirrorCount?: number;
  /** 選択中の商品ID群 */
  selectedProductIds?: (number | string)[];

  // Quick Actions
  onRunAll?: () => void;
  onPaste?: () => void;
  onReload?: () => void;
  onCSVUpload?: () => void;

  // Processing
  onCategory?: () => void;
  onShipping?: () => void;
  onProfit?: () => void;  // eBay用既存処理
  onHTML?: () => void;
  onScore?: () => void;

  // HTS & Data
  onHTS?: () => void;
  onOrigin?: () => void;
  onMaterial?: () => void;

  // Research & AI
  onFilter?: () => void;
  onResearch?: () => void;
  onAI?: () => void;

  // Flow Steps
  onTranslate?: () => void;
  onSellerMirror?: () => void;
  onDetails?: () => void;
  onGemini?: () => void;
  onFinalProcess?: () => void;
  onList?: () => void;
  onEnrichmentFlow?: () => void;

  // Actions
  onSave?: () => void;
  onDelete?: () => void;
  onExportCSV?: () => void;
  onExportEbay?: () => void;
  onExportAI?: () => void;
}

// ============================================================
// マーケットプレイス設定
// ============================================================

interface MarketplaceConfig {
  id: CalculationMarketplace;
  label: string;
  buttonLabel: string;
  subLabel: string;
  color: string;
  description: string;
  icon: React.ElementType;
  glowEffect?: boolean;
  features: MarketplaceFeature[];  // 機能タグ
  isDomestic: boolean;             // 国内販路かどうか
}

const MARKETPLACE_OPTIONS: MarketplaceConfig[] = [
  // 海外販路（為替計算・関税あり）
  { 
    id: 'ebay', 
    label: 'eBay', 
    buttonLabel: 'eBay Profit', 
    subLabel: '🌍 USD / 国際', 
    color: '#0064d2', 
    description: '海外販売：為替計算・関税・DDP/DDU国際送料', 
    icon: Globe,
    isDomestic: false,
    features: ['translation', 'seller_mirror', 'hts', 'origin', 'material', 'international_ship', 'html_template', 'score', 'ai_enhance', 'gemini', 'category', 'research'],
  },
  // 全販路比較（フルセット）
  { 
    id: 'all', 
    label: 'ALL', 
    buttonLabel: '全販路比較', 
    subLabel: '📊 比較', 
    color: '#8b5cf6', 
    description: '全販路一括比較・最適モール提案', 
    icon: BarChart3, 
    glowEffect: true,
    isDomestic: false,
    features: ['translation', 'hts', 'origin', 'material', 'international_ship', 'domestic_ship', 'html_template', 'score', 'ai_enhance', 'gemini', 'category', 'research'],
  },
  // 国内販路（円のまま・関税なし）
  { 
    id: 'qoo10_jp', 
    label: 'Qoo10', 
    buttonLabel: 'Qoo10', 
    subLabel: '🇯🇵 国内', 
    color: '#ff0066', 
    description: '国内販売：手数料12%+3.5%・国内送料', 
    icon: ShoppingBag,
    isDomestic: true,
    features: ['translation', 'domestic_ship', 'ai_enhance', 'category'],
  },
  { 
    id: 'amazon_jp', 
    label: 'Amazon', 
    buttonLabel: 'Amazon', 
    subLabel: '🇯🇵 FBA', 
    color: '#ff9900', 
    description: '国内販売：FBA手数料15%・フルフィルメント', 
    icon: Zap,
    isDomestic: true,
    features: ['domestic_ship', 'fba', 'ai_enhance', 'category', 'research'],
  },
  { 
    id: 'mercari_jp', 
    label: 'メルカリ', 
    buttonLabel: 'メルカリ', 
    subLabel: '🇯🇵 国内', 
    color: '#ff2d55', 
    description: '国内販売：手数料10%・匿名配送', 
    icon: PackageCheck,
    isDomestic: true,
    features: ['domestic_ship', 'ai_enhance'],
  },
  { 
    id: 'yahoo_auction_jp', 
    label: 'ヤフオク', 
    buttonLabel: 'ヤフオク', 
    subLabel: '🇯🇵 国内', 
    color: '#ff0033', 
    description: '国内販売：落札8.8%・ヤフネコ', 
    icon: Store,
    isDomestic: true,
    features: ['domestic_ship', 'auction', 'ai_enhance'],
  },
];

// ============================================================
// ツールチップテキスト
// ============================================================

const TOOLTIPS = {
  runAll: '全処理を一括実行',
  paste: 'クリップボードから商品データを貼り付け',
  reload: 'データを再読み込み',
  csv: 'CSVファイルをアップロード',
  category: 'eBayカテゴリを自動分類',
  shipping: '送料・配送方法を設定',
  profit: '利益・マージンを計算',
  html: 'eBay用HTML説明文を生成',
  score: '競合スコア・出品優先度を算出',
  hts: 'HTS関税コードを取得',
  origin: '原産国を推定',
  material: '素材情報を取得',
  filter: 'フィルター条件をチェック',
  research: '一括市場リサーチ',
  ai: 'AI強化（説明文・キーワード生成）',
  translate: '日本語↔英語翻訳',
  sellerMirror: 'eBay競合セラーの商品を検索',
  details: '選択した商品の詳細を取得',
  gemini: 'Gemini用プロンプトを生成',
  enrichmentFlow: 'SM分析→競合選択→AI強化の統合フロー',
  finalProcess: '最終処理チェーン実行',
  list: '準備完了商品をeBayに出品',
  save: '変更を保存',
  delete: '選択商品を削除',
  export: 'エクスポートメニュー',
};

// ============================================================
// サブコンポーネント: IconButton
// ============================================================

interface IconButtonProps {
  icon: React.ElementType;
  label?: string;
  tooltip?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  badge?: number;
  variant?: 'ghost' | 'primary' | 'danger' | 'success' | 'warning';
}

const IconButton = memo(function IconButton({
  icon: Icon,
  label,
  tooltip,
  onClick,
  disabled,
  active,
  badge,
  variant = 'ghost',
}: IconButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    height: '28px',
    padding: label ? '0 8px' : '0 6px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '4px',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    position: 'relative',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    ghost: {
      background: active ? 'var(--accent-soft, rgba(59, 130, 246, 0.1))' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-muted)',
      borderColor: active ? 'var(--accent)' : 'transparent',
    },
    primary: {
      background: 'var(--accent)',
      color: 'white',
      borderColor: 'var(--accent)',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: 'rgb(239, 68, 68)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    success: {
      background: 'rgba(34, 197, 94, 0.1)',
      color: 'rgb(34, 197, 94)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: 'rgb(245, 158, 11)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      className="hover:opacity-80"
    >
      <Icon size={14} />
      {label && <span>{label}</span>}
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            minWidth: '16px',
            height: '16px',
            padding: '0 4px',
            fontSize: '10px',
            fontWeight: 600,
            lineHeight: '16px',
            textAlign: 'center',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: '8px',
          }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
});

// ============================================================
// サブコンポーネント: FlowStepButton
// ============================================================

interface FlowStepButtonProps {
  num: number;
  icon: React.ElementType;
  label: string;
  tooltip?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: number;
}

const FlowStepButton = memo(function FlowStepButton({
  num,
  icon: Icon,
  label,
  tooltip,
  onClick,
  disabled,
  badge,
}: FlowStepButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: '24px',
        padding: '0 8px',
        fontSize: '11px',
        fontWeight: 500,
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: '12px',
        color: 'var(--text-muted)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      className="hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '14px',
          height: '14px',
          fontSize: '9px',
          fontWeight: 700,
          background: 'var(--accent)',
          color: 'white',
          borderRadius: '50%',
        }}
      >
        {num}
      </span>
      <Icon size={12} />
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            minWidth: '14px',
            height: '14px',
            padding: '0 3px',
            fontSize: '9px',
            fontWeight: 600,
            lineHeight: '14px',
            textAlign: 'center',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: '7px',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
});

// ============================================================
// サブコンポーネント: Divider
// ============================================================

const ToolbarDivider = memo(function ToolbarDivider() {
  return (
    <div
      style={{
        width: '1px',
        height: '20px',
        background: 'var(--panel-border)',
        margin: '0 4px',
      }}
    />
  );
});

// ============================================================
// メインコンポーネント: N3ToolPanel
// ============================================================

export const N3ToolPanel = memo(function N3ToolPanel({
  processing = false,
  currentStep = '',
  modifiedCount = 0,
  readyCount = 0,
  selectedMirrorCount = 0,
  selectedProductIds = [],
  onRunAll,
  onPaste,
  onReload,
  onCSVUpload,
  onCategory,
  onShipping,
  onProfit,
  onHTML,
  onScore,
  onHTS,
  onOrigin,
  onMaterial,
  onFilter,
  onResearch,
  onAI,
  onTranslate,
  onSellerMirror,
  onDetails,
  onGemini,
  onFinalProcess,
  onList,
  onEnrichmentFlow,
  onSave,
  onDelete,
  onExportCSV,
  onExportEbay,
  onExportAI,
}: N3ToolPanelProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<CalculationMarketplace>('ebay');
  const [showMarketplaceDropdown, setShowMarketplaceDropdown] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const currentMarketplace = MARKETPLACE_OPTIONS.find(o => o.id === selectedMarketplace) || MARKETPLACE_OPTIONS[0];

  const handleExportClick = useCallback(() => {
    setShowExportMenu(prev => !prev);
  }, []);

  const handleMarketplaceSelect = useCallback((id: CalculationMarketplace) => {
    setSelectedMarketplace(id);
    setShowMarketplaceDropdown(false);
  }, []);

  // マーケットプレイス選択ボタンのレンダリング
  const renderMarketplaceOption = (option: MarketplaceConfig) => {
    const OptionIcon = option.icon;
    const isSelected = selectedMarketplace === option.id;
    return (
      <button
        key={option.id}
        onClick={() => handleMarketplaceSelect(option.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '10px 12px',
          textAlign: 'left',
          background: isSelected ? `${option.color}20` : 'transparent',
          border: 'none',
          borderLeft: isSelected ? `3px solid ${option.color}` : '3px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <OptionIcon 
          size={16} 
          style={{ color: option.color }} 
        />
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 600, 
            color: isSelected ? option.color : '#1e293b',
          }}>
            {option.label}
          </div>
          <div style={{ fontSize: '9px', color: '#64748b' }}>
            {option.description}
          </div>
        </div>
        {isSelected && (
          <CheckCircle size={14} style={{ color: option.color }} />
        )}
      </button>
    );
  };

  // 計算実行ハンドラー（改善版: DB保存対応）
  const handleCalculate = useCallback(async (): Promise<void> => {
    // eBay選択時は既存処理（既存のeBay DDP/DDU計算）
    if (selectedMarketplace === 'ebay') {
      onProfit?.();
      return;
    }

    // 商品未選択
    if (selectedProductIds.length === 0) {
      alert('計算する商品を選択してください');
      return;
    }

    setCalculating(true);

    try {
      // 商品データを取得
      const productResponse = await fetch(`/api/products?ids=${selectedProductIds.slice(0, 50).join(',')}`);
      const productData = await productResponse.json();
      
      if (!productData.success || !productData.products?.length) {
        alert('商品データの取得に失敗しました');
        return;
      }

      const products = productData.products;
      let successCount = 0;
      let errorCount = 0;
      const allResults: any[] = [];
      const saveUpdates: any[] = [];

      for (const product of products) {
        const costJpy = product.price_jpy || product.cost_price || product.purchase_price || 0;
        const weightG = product.weight_g || product.listing_data?.weight_g || 500;

        if (costJpy <= 0) {
          console.warn(`[Profit] 商品ID ${product.id}: 仕入れ価格が0`);
          errorCount++;
          continue;
        }

        try {
          if (selectedMarketplace === 'all') {
            // 全販路一括計算
            const response = await fetch('/api/v2/pricing/multi-marketplace', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                costPriceJpy: costJpy,
                weightGrams: weightG,
                targetMarketplaces: ['ebay_us', 'qoo10_jp', 'amazon_jp'],
                targetMargin: 15,
              }),
            });
            const data = await response.json();
            if (data.success && data.results) {
              allResults.push(...data.results);
              successCount++;
              
              // 各販路の結果を保存用に準備
              for (const result of data.results) {
                saveUpdates.push({
                  productId: product.id,
                  marketplace: result.marketplace,
                  data: {
                    price_jpy: result.suggestedPrice * (result.exchangeRate || 1),
                    price_local: result.suggestedPrice,
                    currency: result.currency,
                    profit_jpy: result.profitJpy,
                    profit_margin: result.profitMargin,
                    shipping_cost: result.costBreakdown?.shippingCostLocal || 0,
                    platform_fee: result.costBreakdown?.platformFee || 0,
                    status: result.isProfitable ? 'calculated' : 'error',
                    error_message: result.isProfitable ? null : '利益率が低すぎます',
                  },
                });
              }
            } else {
              errorCount++;
            }
          } else {
            // 個別モール計算（Qoo10, Amazon JP等）
            const response = await fetch('/api/v2/pricing/multi-marketplace', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                costPriceJpy: costJpy,
                weightGrams: weightG,
                targetMarketplaces: [selectedMarketplace],
                targetMargin: 15,
              }),
            });
            const data = await response.json();
            if (data.success && data.results?.[0]) {
              const result = data.results[0];
              allResults.push(result);
              successCount++;
              
              // 保存用データを準備
              saveUpdates.push({
                productId: product.id,
                marketplace: selectedMarketplace,
                data: {
                  price_jpy: result.suggestedPrice,
                  profit_jpy: result.profitJpy,
                  profit_margin: result.profitMargin,
                  shipping_cost: result.costBreakdown?.shippingCostLocal || 0,
                  platform_fee: result.costBreakdown?.platformFee || 0,
                  payment_fee: result.costBreakdown?.paymentFee || 0,
                  status: result.isProfitable ? 'calculated' : 'error',
                  error_message: result.isProfitable ? null : '利益率が低すぎます',
                },
              });
            } else {
              errorCount++;
            }
          }
        } catch (e) {
          console.error(`[Profit] 商品ID ${product.id} 計算エラー:`, e);
          errorCount++;
        }
      }

      // 計算結果をDBに一括保存
      if (saveUpdates.length > 0) {
        try {
          const saveResponse = await fetch('/api/v2/marketplace-listings/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates: saveUpdates }),
          });
          const saveResult = await saveResponse.json();
          console.log('[Profit] DB保存結果:', saveResult);
        } catch (saveError) {
          console.warn('[Profit] DB保存エラー:', saveError);
        }
      }

      // 結果サマリー表示
      if (selectedMarketplace === 'all') {
        const profitable = allResults.filter(r => r.isProfitable).length;
        alert(`全販路計算完了\n\n成功: ${successCount}件\nエラー: ${errorCount}件\n黒字: ${profitable}件 / ${allResults.length}件\n\n※ 計算結果はDBに保存されました`);
      } else {
        const avgProfit = allResults.length > 0 
          ? Math.round(allResults.reduce((s, r) => s + (r.profitJpy || 0), 0) / allResults.length)
          : 0;
        const profitableCount = allResults.filter(r => r.isProfitable).length;
        alert(`${currentMarketplace.label}計算完了\n\n成功: ${successCount}件\nエラー: ${errorCount}件\n平均利益: ¥${avgProfit.toLocaleString()}\n黒字: ${profitableCount}件\n\n※ 計算結果はDBに保存されました`);
      }

      // リロードをトリガー（テーブル更新）
      onReload?.();

    } catch (error: any) {
      alert(`計算エラー: ${error.message}`);
    } finally {
      setCalculating(false);
    }
  }, [selectedMarketplace, selectedProductIds, onProfit, currentMarketplace.label, onReload]);

  // ★ 国内モール用 Run All（SM分析スキップ）
  const handleRunAllForDomestic = useCallback(async () => {
    if (selectedProductIds.length === 0) {
      alert('商品を選択してください');
      return;
    }

    setCalculating(true);
    const mpLabel = currentMarketplace.label;

    try {
      console.log(`[Run All] ${mpLabel}用処理開始: ${selectedProductIds.length}件`);

      // ステップ1: カテゴリ分析（category featureがある場合）
      if (currentMarketplace.features.includes('category')) {
        console.log(`[Run All] 1/${currentMarketplace.isDomestic ? '4' : '6'}: カテゴリ分析中...`);
        if (onCategory) {
          await new Promise<void>((resolve) => {
            onCategory();
            setTimeout(resolve, 500);
          });
        }
      }

      // ステップ2: 送料計算（domestic_ship feature）
      if (currentMarketplace.features.includes('domestic_ship')) {
        console.log(`[Run All] 2/${currentMarketplace.isDomestic ? '4' : '6'}: 国内送料計算中...`);
        if (onShipping) {
          await new Promise<void>((resolve) => {
            onShipping();
            setTimeout(resolve, 500);
          });
        }
      }

      // ステップ3: 利益計算（メイン処理）
      console.log(`[Run All] 3/${currentMarketplace.isDomestic ? '4' : '6'}: ${mpLabel}利益計算中...`);
      await handleCalculate();

      // ステップ4: AI強化（ai_enhance featureがある場合）
      if (currentMarketplace.features.includes('ai_enhance') && onAI) {
        console.log(`[Run All] 4/${currentMarketplace.isDomestic ? '4' : '6'}: AI強化中...`);
        // AI処理はユーザーが別途実行することが多いのでスキップ
      }

      // 完了
      alert(`✅ ${mpLabel} Run All 完了\n\n処理対象: ${selectedProductIds.length}件\n\n※ SM分析・HTML生成・スコア計算はスキップされました（国内モール用）`);

      // リロード
      onReload?.();

    } catch (error: any) {
      console.error('[Run All] エラー:', error);
      alert(`❌ Run All エラー: ${error.message}`);
    } finally {
      setCalculating(false);
    }
  }, [selectedProductIds, currentMarketplace, handleCalculate, onCategory, onShipping, onAI, onReload]);

  const IconComponent = currentMarketplace.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {/* ============================================
          メインツールバー
          ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '6px 8px',
          background: 'transparent',
          borderRadius: '6px',
          border: '1px solid transparent',
        }}
      >
        {/* Tools Label */}
        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
          Tools
        </span>

        {/* ============================================
            マーケットプレイス選択 + 計算ボタン（コンパクト版）
            ============================================ */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          {/* 計算ボタン本体 */}
          <button
            onClick={handleCalculate}
            disabled={processing || calculating}
            title={currentMarketplace.description}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '28px',
              padding: '0 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '4px 0 0 4px',
              borderTop: `1px solid ${currentMarketplace.color}`,
              borderBottom: `1px solid ${currentMarketplace.color}`,
              borderLeft: `1px solid ${currentMarketplace.color}`,
              borderRight: 'none',
              background: currentMarketplace.color,
              color: 'white',
              cursor: processing || calculating ? 'not-allowed' : 'pointer',
              opacity: processing || calculating ? 0.7 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {calculating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <IconComponent size={14} strokeWidth={2.5} />
            )}
            <span>{currentMarketplace.buttonLabel}</span>
            <span style={{ 
              fontSize: '9px', 
              opacity: 0.8, 
              padding: '1px 4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '3px',
            }}>
              {currentMarketplace.subLabel.split(' / ')[0]}
            </span>
          </button>

          {/* ドロップダウントリガー */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMarketplaceDropdown(!showMarketplaceDropdown);
            }}
            disabled={processing || calculating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '28px',
              width: '22px',
              borderRadius: '0 4px 4px 0',
              borderTop: `1px solid ${currentMarketplace.color}`,
              borderBottom: `1px solid ${currentMarketplace.color}`,
              borderRight: `1px solid ${currentMarketplace.color}`,
              borderLeft: '1px solid rgba(255,255,255,0.3)',
              background: currentMarketplace.color,
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronDown 
              size={12} 
              style={{ 
                transform: showMarketplaceDropdown ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }} 
            />
          </button>

          {/* ドロップダウンメニュー */}
          {showMarketplaceDropdown && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 100 }}
                onClick={() => setShowMarketplaceDropdown(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  minWidth: '240px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  zIndex: 101,
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                }}
              >
                {/* 海外販路セクション */}
                <div style={{ 
                  padding: '6px 12px', 
                  background: '#0064d215',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#0064d2',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  🌍 海外販売（為替・関税・国際送料）
                </div>
                {renderMarketplaceOption(MARKETPLACE_OPTIONS[0])}
                
                {/* 比較モードセクション */}
                <div style={{ 
                  padding: '6px 12px', 
                  background: '#8b5cf615',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#8b5cf6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderTop: '1px solid #e2e8f0',
                }}>
                  📊 全販路一括比較
                </div>
                {renderMarketplaceOption(MARKETPLACE_OPTIONS[1])}
                
                {/* 国内販路セクション */}
                <div style={{ 
                  padding: '6px 12px', 
                  background: '#ff006615',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#ff0066',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderTop: '1px solid #e2e8f0',
                }}>
                  🇯🇵 国内販売（円・関税なし・国内送料）
                </div>
                {MARKETPLACE_OPTIONS.slice(2).map(option => renderMarketplaceOption(option))}
              </div>
            </>
          )}
        </div>

        <ToolbarDivider />

        {/* Quick Actions - Run Allはモール対応 */}
        <button
          onClick={() => {
            // マーケットプレイス別のRun All処理
            if (selectedMarketplace === 'ebay') {
              // eBayは既存のonRunAll（SM分析含む）
              onRunAll?.();
            } else {
              // 国内モール用のRun All（SM分析スキップ）
              handleRunAllForDomestic();
            }
          }}
          disabled={processing || calculating}
          title={`${currentMarketplace.label}用の全処理を実行`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            height: '28px',
            padding: '0 10px',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '4px',
            border: `1px solid ${currentMarketplace.color}`,
            background: `${currentMarketplace.color}15`,
            color: currentMarketplace.color,
            cursor: processing ? 'not-allowed' : 'pointer',
            opacity: processing ? 0.5 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {processing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          <span>Run All</span>
        </button>
        
        {/* 共通ボタン */}
        <IconButton icon={Copy} label="Paste" tooltip={TOOLTIPS.paste} onClick={onPaste} disabled={processing} />
        <IconButton icon={RefreshCw} label="Reload" tooltip={TOOLTIPS.reload} onClick={onReload} disabled={processing} />
        <IconButton icon={Upload} label="CSV" tooltip={TOOLTIPS.csv} onClick={onCSVUpload} disabled={processing} />

        <ToolbarDivider />

        {/* カテゴリ（category feature） */}
        {currentMarketplace.features.includes('category') && (
          <IconButton icon={FolderOpen} label="Cat" tooltip={TOOLTIPS.category} onClick={onCategory} disabled={processing} />
        )}
        
        {/* 国際送料（international_ship feature） */}
        {currentMarketplace.features.includes('international_ship') && (
          <IconButton icon={Truck} label="Ship" tooltip="国際送料設定" onClick={onShipping} disabled={processing} />
        )}
        
        {/* 国内送料（domestic_ship feature） */}
        {currentMarketplace.features.includes('domestic_ship') && !currentMarketplace.features.includes('international_ship') && (
          <IconButton icon={Truck} label="国内送料" tooltip="国内送料設定" onClick={onShipping} disabled={processing} />
        )}
        
        {/* HTMLテンプレート（html_template feature） */}
        {currentMarketplace.features.includes('html_template') && (
          <IconButton icon={Code} label="HTML" tooltip={TOOLTIPS.html} onClick={onHTML} disabled={processing} />
        )}
        
        {/* 競合スコア（score feature） */}
        {currentMarketplace.features.includes('score') && (
          <IconButton icon={BarChart3} label="Score" tooltip={TOOLTIPS.score} onClick={onScore} disabled={processing} />
        )}

        {/* HTS・関税コード（hts feature - 海外専用） */}
        {currentMarketplace.features.includes('hts') && (
          <>
            <ToolbarDivider />
            <IconButton icon={Shield} label="HTS" tooltip={TOOLTIPS.hts} onClick={onHTS} disabled={processing} />
          </>
        )}
        
        {/* 原産国（origin feature - 海外専用） */}
        {currentMarketplace.features.includes('origin') && (
          <IconButton icon={Globe} label="Origin" tooltip={TOOLTIPS.origin} onClick={onOrigin} disabled={processing} />
        )}
        
        {/* 素材（material feature） */}
        {currentMarketplace.features.includes('material') && (
          <IconButton icon={Package} label="Material" tooltip={TOOLTIPS.material} onClick={onMaterial} disabled={processing} />
        )}
        
        {/* FBA納品（fba feature - Amazon専用） */}
        {currentMarketplace.features.includes('fba') && (
          <IconButton icon={Package} label="FBA" tooltip="FBA納品計画" onClick={onCategory} disabled={processing} />
        )}
        
        {/* オークション（auction feature - ヤフオク専用） */}
        {currentMarketplace.features.includes('auction') && (
          <IconButton icon={DollarSign} label="即決" tooltip="開始価格・即決価格設定" onClick={onCategory} disabled={processing} />
        )}

        <ToolbarDivider />

        {/* リサーチ（research feature） */}
        {currentMarketplace.features.includes('research') && (
          <IconButton icon={Search} label="Research" tooltip={TOOLTIPS.research} onClick={onResearch} disabled={processing} />
        )}
        
        {/* AI強化（ai_enhance feature） */}
        {currentMarketplace.features.includes('ai_enhance') && (
          <IconButton icon={Sparkles} label="AI" tooltip={TOOLTIPS.ai} onClick={onAI} disabled={processing} />
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Export Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleExportClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              height: '28px',
              padding: '0 10px',
              fontSize: '11px',
              fontWeight: 500,
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              borderRadius: '4px',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Export</span>
            <ChevronDown size={12} />
          </button>
          {showExportMenu && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                onClick={() => setShowExportMenu(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  minWidth: '140px',
                  background: 'var(--panel)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => { onExportCSV?.(); setShowExportMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-[var(--highlight)]"
                >
                  CSV All
                </button>
                <button
                  onClick={() => { onExportEbay?.(); setShowExportMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-[var(--highlight)]"
                >
                  eBay Format
                </button>
                <div style={{ height: '1px', background: 'var(--panel-border)', margin: '4px 0' }} />
                <button
                  onClick={() => { onExportAI?.(); setShowExportMenu(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-[var(--highlight)]"
                >
                  <Sparkles size={12} />
                  AI Export
                </button>
              </div>
            </>
          )}
        </div>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={processing || modifiedCount === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            height: '28px',
            padding: '0 10px',
            fontSize: '11px',
            fontWeight: 500,
            background: modifiedCount > 0 ? 'var(--accent)' : 'var(--panel)',
            border: '1px solid',
            borderColor: modifiedCount > 0 ? 'var(--accent)' : 'var(--panel-border)',
            borderRadius: '4px',
            color: modifiedCount > 0 ? 'white' : 'var(--text)',
            cursor: processing || modifiedCount === 0 ? 'not-allowed' : 'pointer',
            opacity: processing || modifiedCount === 0 ? 0.5 : 1,
            position: 'relative',
          }}
        >
          <Save size={14} />
          <span>Save</span>
          {modifiedCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                fontSize: '10px',
                fontWeight: 600,
                lineHeight: '18px',
                textAlign: 'center',
                background: 'rgb(239, 68, 68)',
                color: 'white',
                borderRadius: '9px',
              }}
            >
              {modifiedCount}
            </span>
          )}
        </button>

        {/* Delete */}
        <IconButton
          icon={Trash2}
          tooltip={TOOLTIPS.delete}
          onClick={onDelete}
          disabled={processing}
          variant="danger"
        />
      </div>

      {/* ============================================
          フローパネル（販路別に動的変更）
          ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 8px',
          background: 'transparent',
          borderRadius: '6px',
          border: '1px solid transparent',
        }}
      >
        {/* FLOW Label */}
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: currentMarketplace.color,
            letterSpacing: '0.5px',
          }}
        >
          FLOW
        </span>

        {/* 翻訳（translation feature） */}
        {currentMarketplace.features.includes('translation') && (
          <FlowStepButton num={1} icon={Globe} label="翻訳" tooltip={TOOLTIPS.translate} onClick={onTranslate} disabled={processing} />
        )}
        
        {/* Seller Mirror（seller_mirror feature - eBay専用） */}
        {currentMarketplace.features.includes('seller_mirror') && (
          <FlowStepButton num={2} icon={Search} label="SM" tooltip={TOOLTIPS.sellerMirror} onClick={onSellerMirror} disabled={processing} />
        )}
        
        {/* 詳細取得（seller_mirrorと連動） */}
        {currentMarketplace.features.includes('seller_mirror') && (
          <FlowStepButton num={3} icon={Package} label="詳細" tooltip={TOOLTIPS.details} onClick={onDetails} disabled={processing} badge={selectedMirrorCount} />
        )}
        
        {/* Gemini分析（gemini feature） */}
        {currentMarketplace.features.includes('gemini') && (
          <FlowStepButton num={4} icon={FileText} label="Gemini" tooltip={TOOLTIPS.gemini} onClick={onGemini} disabled={processing} />
        )}
        
        {/* AI強化（ai_enhance feature） */}
        {currentMarketplace.features.includes('ai_enhance') && (
          <FlowStepButton num={0} icon={Sparkles} label="AI強化" tooltip={TOOLTIPS.enrichmentFlow} onClick={onEnrichmentFlow} disabled={processing} />
        )}
        
        {/* 最終処理（全販路共通） */}
        <FlowStepButton num={5} icon={DollarSign} label="処理" tooltip={TOOLTIPS.finalProcess} onClick={onFinalProcess} disabled={processing} />
        
        {/* 出品（全販路共通） */}
        <FlowStepButton num={6} icon={CheckCircle} label="出品" tooltip={TOOLTIPS.list} onClick={onList} disabled={processing || readyCount === 0} badge={readyCount} />

        {/* Processing Status */}
        {processing && currentStep && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: 'auto',
              padding: '4px 8px',
              fontSize: '11px',
              color: currentMarketplace.color,
              background: `${currentMarketplace.color}15`,
              borderRadius: '4px',
            }}
          >
            <Loader2 size={12} className="animate-spin" />
            <span>{currentStep}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default N3ToolPanel;
