// app/tools/editing-n3/components/modals/sm/sm-selection-modal-v2.tsx
/**
 * 🎯 SM選択モーダル v3.0 - ハイブリッドAI監査パイプライン対応
 * 
 * 新機能:
 * - SM選択API連携（/api/products/[id]/sm-selection）
 * - 3つの安全装置対応
 *   1. バッチ実行中ロック
 *   2. 通貨変換の明示
 *   3. 監査前出品ブロック
 * - VeROチェック・ルールエンジン自動実行
 * - Item Specifics完全コピー機能
 * 
 * @created 2025-01-16
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  X, Search, RefreshCw, ExternalLink, Check, Ban, TrendingUp, 
  Clock, Users, DollarSign, Loader2, ChevronLeft, ChevronRight, 
  Sparkles, AlertTriangle, Shield, Lock, BookOpen, Copy
} from 'lucide-react';
import { toast } from 'sonner';
import type { SmSelectionResponse, AiAuditStatus, SafetyStatus } from '@/types/hybrid-ai-pipeline';

// ============================================================
// 型定義
// ============================================================

export interface SmSelectionModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onSelectComplete?: (productId: number, result: SmSelectionResponse) => void;
  onSelectionCompleteAll?: (results: Map<number, SmSelectionResponse>) => void;
  /** 自動パイプライン継続 */
  onAutoResumeNext?: (productIds: number[]) => Promise<void>;
}

interface CompetitorItem {
  itemId: string;
  title: string;
  price: number;
  currency?: string;
  image?: string;
  imageUrl?: string;
  seller?: string | { username: string; feedbackScore: number };
  sellerFeedbackScore?: number;
  location?: string | { country: string };
  condition?: string;
  itemWebUrl?: string;
  soldCount?: number;
  avgSoldPrice?: number;
  matchLevel?: number;
  aiRecommendScore?: number;
  itemSpecifics?: Record<string, string>;
}

// ============================================================
// カラーテーマ
// ============================================================

const T = {
  bg: '#0f172a',
  panel: '#1e293b',
  panelBorder: '#334155',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textSubtle: '#64748b',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  conditionNew: '#10b981',
  conditionUsed: '#f59e0b',
};

// ============================================================
// マッチスコア計算
// ============================================================

function calculateMatchScore(currentTitle: string, competitorTitle: string): number {
  const titleLower = currentTitle.toLowerCase();
  const compTitleLower = competitorTitle.toLowerCase();
  
  // 型番マッチ（30点）
  const modelMatch = titleLower.match(/\b[A-Z0-9]{3,}-?[A-Z0-9]+\b/gi) || [];
  const compModelMatch = compTitleLower.match(/\b[A-Z0-9]{3,}-?[A-Z0-9]+\b/gi) || [];
  const modelScore = modelMatch.some(m => 
    compModelMatch.some(cm => cm.toLowerCase() === m.toLowerCase())
  ) ? 30 : 0;
  
  // ブランドマッチ（20点）
  const brands = ['pokemon', 'nintendo', 'sony', 'bandai', 'konami', 'wizards', 'topps', 'panini'];
  const brandScore = brands.some(b => titleLower.includes(b) && compTitleLower.includes(b)) ? 20 : 0;
  
  // キーワードオーバーラップ（50点）
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'new', 'with'];
  const words1 = titleLower.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
  const words2 = compTitleLower.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
  const overlap = words1.filter(w => words2.includes(w)).length;
  const keywordScore = Math.min(50, (overlap / Math.max(words1.length, 1)) * 50);
  
  return Math.round(modelScore + brandScore + keywordScore);
}

// ============================================================
// メインコンポーネント
// ============================================================

export function SmSelectionModalV2({
  isOpen,
  onClose,
  products,
  onSelectComplete,
  onSelectionCompleteAll,
  onAutoResumeNext,
}: SmSelectionModalV2Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectionResults, setSelectionResults] = useState<Map<number, SmSelectionResponse>>(new Map());
  const [isSearching, setIsSearching] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [excludeWords, setExcludeWords] = useState('');
  const [excludedItemIds, setExcludedItemIds] = useState<Set<string>>(new Set());
  const [filterJpOnly, setFilterJpOnly] = useState(false);
  const [isAutoResuming, setIsAutoResuming] = useState(false);
  const [lastResult, setLastResult] = useState<SmSelectionResponse | null>(null);

  const currentProduct = products[currentIndex];

  // 競合データを取得
  const competitorData = useMemo(() => {
    if (!currentProduct) return { items: [], stats: null };

    const apiData = currentProduct.ebay_api_data || {};
    const browseItems = apiData.browse_result?.items || [];
    const findingItems = apiData.finding_result?.items || [];
    const smAnalysis = apiData.sm_analysis || {};

    // Browse Items を正規化
    const normalizedItems: CompetitorItem[] = browseItems.map((item: any) => ({
      itemId: item.itemId || '',
      title: item.title || '',
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price?.value || item.price || '0'),
      currency: item.price?.currency || item.currency || 'USD',
      image: item.image?.imageUrl || item.imageUrl || item.image,
      imageUrl: item.image?.imageUrl || item.imageUrl || item.image,
      seller: typeof item.seller === 'string' ? item.seller : item.seller?.username || 'Unknown',
      sellerFeedbackScore: item.seller?.feedbackScore || item.sellerFeedbackScore || 0,
      location: item.location?.country || item.itemLocation?.country || '',
      condition: item.condition || 'Used',
      itemWebUrl: item.itemWebUrl || item.viewItemUrl || `https://www.ebay.com/itm/${item.itemId}`,
      matchLevel: item.matchLevel,
      itemSpecifics: item.localizedAspects || item.itemSpecifics || {},
    }));

    // 販売実績データをマージ
    const soldMap = new Map<string, any>();
    findingItems.forEach((item: any) => {
      soldMap.set(item.title?.toLowerCase() || '', {
        soldCount: item.quantitySold || 1,
        avgSoldPrice: item.soldPrice || 0,
      });
    });

    normalizedItems.forEach(item => {
      const titleLower = item.title.toLowerCase();
      const soldData = soldMap.get(titleLower);
      if (soldData) {
        item.soldCount = soldData.soldCount;
        item.avgSoldPrice = soldData.avgSoldPrice;
      }
    });

    // AIレコメンドスコアを計算
    normalizedItems.forEach(item => {
      let score = 50;
      if (item.price < (smAnalysis.current_average_price || item.price)) score += 10;
      if (typeof item.location === 'string' && item.location === 'JP') score -= 20;
      if ((item.sellerFeedbackScore || 0) > 1000) score += 5;
      if (item.soldCount && item.soldCount > 0) score += 15;
      item.aiRecommendScore = Math.max(0, Math.min(100, score));
    });

    // 統計情報
    const stats = {
      total: normalizedItems.length,
      jpCount: normalizedItems.filter(i => (typeof i.location === 'string' ? i.location : i.location) === 'JP').length,
      lowestPrice: smAnalysis.current_lowest_price || (normalizedItems.length > 0 ? Math.min(...normalizedItems.map(i => i.price)) : 0),
      avgPrice: smAnalysis.current_average_price || 0,
      soldLast30d: smAnalysis.sold_last_30d || apiData.finding_result?.soldLast30Days || 0,
      soldLast90d: smAnalysis.sold_last_90d || apiData.finding_result?.soldLast90Days || 0,
      avgSoldPrice: smAnalysis.avg_sold_price || apiData.finding_result?.averageSoldPrice || 0,
      demandScore: smAnalysis.demand_score || 0,
      recommendedPrice: smAnalysis.recommended_price || 0,
      confidenceLevel: smAnalysis.confidence_level || 'unknown',
    };

    return { items: normalizedItems, stats };
  }, [currentProduct]);

  // フィルター＆ソート
  const filteredItems = useMemo(() => {
    let result = [...competitorData.items];

    if (searchKeyword) {
      const query = searchKeyword.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(query));
    }

    if (filterJpOnly) {
      result = result.filter(item => (typeof item.location === 'string' ? item.location : '') === 'JP');
    }

    if (excludeWords) {
      const words = excludeWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
      result = result.filter(item => {
        const title = item.title.toLowerCase();
        return !words.some(word => title.includes(word));
      });
    }

    result = result.filter(item => !excludedItemIds.has(item.itemId));
    result.sort((a, b) => (b.aiRecommendScore || 0) - (a.aiRecommendScore || 0));

    return result;
  }, [competitorData.items, searchKeyword, filterJpOnly, excludeWords, excludedItemIds]);

  const newItems = filteredItems.filter(i => (i.condition || '').toLowerCase().includes('new'));
  const usedItems = filteredItems.filter(i => !(i.condition || '').toLowerCase().includes('new'));

  // 🔥 SM選択API呼び出し
  const handleSelect = useCallback(async (item: CompetitorItem, selectionType: 'exact' | 'reference') => {
    if (!currentProduct || isSelecting) return;

    setIsSelecting(true);
    const toastId = toast.loading(
      selectionType === 'exact' 
        ? '🔄 Item Specificsをコピー中...' 
        : '📖 参考データを保存中...'
    );

    try {
      const response = await fetch(`/api/products/${currentProduct.id}/sm-selection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitor: {
            itemId: item.itemId,
            title: item.title,
            price: item.price,
            currency: item.currency || 'USD',
            condition: item.condition,
            imageUrl: item.image || item.imageUrl,
            seller: typeof item.seller === 'string' 
              ? { username: item.seller, feedbackScore: item.sellerFeedbackScore || 0 }
              : item.seller,
            location: typeof item.location === 'string'
              ? { country: item.location }
              : item.location,
            itemWebUrl: item.itemWebUrl,
            itemSpecifics: item.itemSpecifics,
            selectedAt: new Date().toISOString(),
            selectionType,
          },
          selectionType,
        }),
      });

      const result: SmSelectionResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'SM選択に失敗しました');
      }

      // 結果を保存
      setSelectionResults(prev => {
        const next = new Map(prev);
        next.set(currentProduct.id, result);
        return next;
      });
      setLastResult(result);

      // トーストを更新
      const statusMessage = {
        clear: '✅ 監査完了 - 出品可能',
        warning: '⚠️ 要確認 - AI監査推奨',
        manual_check: '🚫 手動確認必須',
        processing_batch: '⏳ バッチ処理中',
        pending: '⏳ 監査待ち',
      }[result.auditStatus] || '完了';

      toast.success(
        `${selectionType === 'exact' ? '完全コピー' : '参考保存'}完了\n` +
        `Item Specifics: ${result.itemSpecificsCopied}項目\n` +
        `VeROリスク: ${result.veroRisk}\n` +
        `${statusMessage}`,
        { id: toastId, duration: 4000 }
      );

      // コールバック
      if (onSelectComplete) {
        onSelectComplete(currentProduct.id, result);
      }

      // 次の商品へ自動遷移
      if (currentIndex < products.length - 1) {
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setLastResult(null);
        }, 1500);
      }

    } catch (error: any) {
      toast.error(`エラー: ${error.message}`, { id: toastId });
    } finally {
      setIsSelecting(false);
    }
  }, [currentProduct, currentIndex, products.length, isSelecting, onSelectComplete]);

  // 再検索
  const handleResearch = useCallback(async () => {
    if (!currentProduct) return;

    setIsSearching(true);
    toast.info('SM再分析を開始...');

    try {
      const ebayTitle = currentProduct.english_title || currentProduct.title_en || currentProduct.title;
      
      const response = await fetch('/api/ebay/sm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentProduct.id,
          ebayTitle: searchKeyword || ebayTitle,
          ebayCategoryId: currentProduct.ebay_category_id,
          condition: currentProduct.condition_name || 'New',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`SM再分析完了: 競合${result.competitor_count}件`);
        window.location.reload();
      } else {
        toast.error(result.error || '再分析に失敗しました');
      }
    } catch (error: any) {
      toast.error(`エラー: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  }, [currentProduct, searchKeyword]);

  // 除外トグル
  const handleExclude = useCallback((itemId: string) => {
    setExcludedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
        toast.info('除外を解除しました');
      } else {
        next.add(itemId);
        toast.info('除外しました');
      }
      return next;
    });
  }, []);

  // 全選択完了
  const handleCompleteAll = useCallback(async () => {
    if (onSelectionCompleteAll) {
      onSelectionCompleteAll(selectionResults);
    }

    if (onAutoResumeNext && selectionResults.size > 0) {
      setIsAutoResuming(true);
      toast.info('🚀 次フェーズを自動実行中...');

      try {
        const completedProductIds = Array.from(selectionResults.keys());
        await onAutoResumeNext(completedProductIds);
        toast.success('✅ パイプライン自動継続完了');
      } catch (error: any) {
        toast.error(`Auto-Resumeエラー: ${error.message}`);
      } finally {
        setIsAutoResuming(false);
      }
    }

    onClose();
  }, [onSelectionCompleteAll, onAutoResumeNext, selectionResults, onClose]);

  // スキップ
  const handleSkip = useCallback(() => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setLastResult(null);
    }
  }, [currentIndex, products.length]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setLastResult(null);
      } else if (e.key === 'ArrowRight' && currentIndex < products.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setLastResult(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, products.length, onClose]);

  if (!isOpen) return null;

  const existingResult = currentProduct ? selectionResults.get(currentProduct.id) : null;
  const myCondition = (currentProduct?.condition_name || 'Used').toLowerCase().includes('new') ? 'New' : 'Used';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '95vw',
          maxWidth: '1400px',
          maxHeight: '90vh',
          background: T.bg,
          borderRadius: '16px',
          border: `1px solid ${T.panelBorder}`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => { setCurrentIndex(prev => Math.max(0, prev - 1)); setLastResult(null); }}
                disabled={currentIndex === 0}
                style={{
                  padding: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentIndex === 0 ? 0.5 : 1,
                  color: 'white',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', opacity: 0.8, color: 'white' }}>SM選択 v3</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>
                  {currentIndex + 1} / {products.length}
                </div>
              </div>
              <button
                onClick={() => { setCurrentIndex(prev => Math.min(products.length - 1, prev + 1)); setLastResult(null); }}
                disabled={currentIndex === products.length - 1}
                style={{
                  padding: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentIndex === products.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentIndex === products.length - 1 ? 0.5 : 1,
                  color: 'white',
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                SKU: {currentProduct?.sku || '-'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentProduct?.title || '-'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleSkip}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              スキップ
            </button>
            <button
              onClick={handleCompleteAll}
              disabled={isAutoResuming}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                background: isAutoResuming ? 'rgba(255,255,255,0.3)' : T.success,
                border: 'none',
                borderRadius: '8px',
                cursor: isAutoResuming ? 'not-allowed' : 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isAutoResuming ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  自動処理中...
                </>
              ) : (
                <>
                  <Check size={14} />
                  完了 ({selectionResults.size}件)
                </>
              )}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 🔥 安全装置説明バナー */}
        <div style={{ padding: '10px 24px', background: `${T.accent}15`, borderBottom: `1px solid ${T.accent}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: T.accent }}>
            <Shield size={14} />
            <span><strong>安全装置稼働中:</strong> 「完全コピー」選択後はVeROチェック・ルールエンジンが自動実行され、監査完了まで出品がブロックされます。価格はUSD基準で保存されます。</span>
          </div>
        </div>

        {/* 🔥 選択結果表示（lastResult） */}
        {(lastResult || existingResult) && (
          <ResultBanner result={lastResult || existingResult!} />
        )}

        {/* 再検索バー */}
        <div style={{ padding: '12px 24px', background: T.panel, borderBottom: `1px solid ${T.panelBorder}` }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.textSubtle }} />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="キーワードで再検索..."
                onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  fontSize: '13px',
                  background: T.bg,
                  border: `1px solid ${T.panelBorder}`,
                  borderRadius: '8px',
                  color: T.text,
                }}
              />
            </div>
            <button
              onClick={handleResearch}
              disabled={isSearching}
              style={{
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 600,
                background: T.accent,
                border: 'none',
                borderRadius: '8px',
                cursor: isSearching ? 'not-allowed' : 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isSearching ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              再分析
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: T.textMuted, cursor: 'pointer' }}>
              <input type="checkbox" checked={filterJpOnly} onChange={(e) => setFilterJpOnly(e.target.checked)} />
              🇯🇵 日本のみ
            </label>
          </div>
          <div style={{ marginTop: '8px' }}>
            <input
              type="text"
              value={excludeWords}
              onChange={(e) => setExcludeWords(e.target.value)}
              placeholder="除外ワード（カンマ区切り）: PSA, BGS, Lot..."
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '11px',
                background: T.bg,
                border: `1px solid ${T.panelBorder}`,
                borderRadius: '6px',
                color: T.text,
              }}
            />
          </div>
        </div>

        {/* 販売実績パネル */}
        {competitorData.stats && (
          <div style={{ padding: '12px 24px', background: T.bg, borderBottom: `1px solid ${T.panelBorder}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px' }}>
              <StatCard icon={<Users size={14} />} label="競合" value={competitorData.stats.total} color={T.accent} />
              <StatCard icon={<span>🇯🇵</span>} label="日本" value={competitorData.stats.jpCount} color={T.error} />
              <StatCard icon={<DollarSign size={14} />} label="最安" value={`$${competitorData.stats.lowestPrice.toFixed(2)}`} color={T.success} />
              <StatCard icon={<TrendingUp size={14} />} label="平均" value={`$${competitorData.stats.avgPrice.toFixed(2)}`} color={T.textMuted} />
              <StatCard icon={<Clock size={14} />} label="30日販売" value={competitorData.stats.soldLast30d} color={T.warning} highlight />
              <StatCard icon={<Clock size={14} />} label="90日販売" value={competitorData.stats.soldLast90d} color={T.warning} highlight />
              <StatCard icon={<DollarSign size={14} />} label="販売平均" value={`$${competitorData.stats.avgSoldPrice.toFixed(2)}`} color={T.success} />
              <StatCard icon={<Sparkles size={14} />} label="推奨価格" value={`$${competitorData.stats.recommendedPrice.toFixed(2)}`} color={T.accent} highlight />
            </div>
          </div>
        )}

        {/* コンテンツ: 競合リスト */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {competitorData.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: T.textMuted }}>
              <AlertTriangle size={48} style={{ marginBottom: '12px', color: T.warning }} />
              <p style={{ fontSize: '14px', fontWeight: 600 }}>SM分析データがありません</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>上部の再分析ボタンからキーワードを変えて検索してください</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* New Items */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: T.conditionNew, marginBottom: '12px', padding: '8px 12px', background: `${T.conditionNew}20`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✨ New ({newItems.length})</span>
                  {myCondition === 'New' && <span style={{ fontSize: '10px', background: T.conditionNew, color: 'white', padding: '2px 6px', borderRadius: '4px' }}>あなたの商品</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {newItems.slice(0, 15).map((item, idx) => (
                    <CompetitorCard
                      key={item.itemId}
                      item={item}
                      rank={idx + 1}
                      currentTitle={currentProduct?.english_title || currentProduct?.title || ''}
                      isSelected={existingResult?.productId === currentProduct?.id}
                      isLoading={isSelecting}
                      onSelectExact={() => handleSelect(item, 'exact')}
                      onSelectReference={() => handleSelect(item, 'reference')}
                      onExclude={() => handleExclude(item.itemId)}
                    />
                  ))}
                </div>
              </div>

              {/* Used Items */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: T.conditionUsed, marginBottom: '12px', padding: '8px 12px', background: `${T.conditionUsed}20`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📦 Used ({usedItems.length})</span>
                  {myCondition === 'Used' && <span style={{ fontSize: '10px', background: T.conditionUsed, color: 'white', padding: '2px 6px', borderRadius: '4px' }}>あなたの商品</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {usedItems.slice(0, 15).map((item, idx) => (
                    <CompetitorCard
                      key={item.itemId}
                      item={item}
                      rank={idx + 1}
                      currentTitle={currentProduct?.english_title || currentProduct?.title || ''}
                      isSelected={existingResult?.productId === currentProduct?.id}
                      isLoading={isSelecting}
                      onSelectExact={() => handleSelect(item, 'exact')}
                      onSelectReference={() => handleSelect(item, 'reference')}
                      onExclude={() => handleExclude(item.itemId)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 注意事項 */}
        <div style={{ padding: '12px 24px', borderTop: `1px solid ${T.panelBorder}`, background: T.panel }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '11px', color: T.textMuted }}>
            <AlertTriangle size={14} style={{ color: T.warning, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p><strong style={{ color: T.text }}>「完全コピー」</strong>: Item Specifics、原産国、カテゴリを競合からコピー。<span style={{ color: T.warning }}>VeROチェック・AI監査が自動実行され、完了まで出品ブロック。</span></p>
              <p style={{ marginTop: '4px' }}><strong style={{ color: T.text }}>「参考にする」</strong>: データはコピーせず、AI補完時のヒントとしてのみ使用。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// サブコンポーネント
// ============================================================

function ResultBanner({ result }: { result: SmSelectionResponse }) {
  const config: Record<AiAuditStatus, { bg: string; border: string; icon: React.ReactNode; message: string }> = {
    clear: {
      bg: `${T.success}15`,
      border: T.success,
      icon: <Check size={16} style={{ color: T.success }} />,
      message: '✅ 監査完了 - 出品可能',
    },
    warning: {
      bg: `${T.warning}15`,
      border: T.warning,
      icon: <AlertTriangle size={16} style={{ color: T.warning }} />,
      message: '⚠️ 要確認 - AI監査後に出品可能',
    },
    manual_check: {
      bg: `${T.error}15`,
      border: T.error,
      icon: <Lock size={16} style={{ color: T.error }} />,
      message: '🚫 手動確認必須',
    },
    processing_batch: {
      bg: `${T.accent}15`,
      border: T.accent,
      icon: <Loader2 size={16} style={{ color: T.accent }} className="animate-spin" />,
      message: '⏳ バッチ処理中...',
    },
    pending: {
      bg: `${T.textSubtle}15`,
      border: T.textSubtle,
      icon: <Clock size={16} style={{ color: T.textSubtle }} />,
      message: '⏳ 監査待ち',
    },
  };

  const c = config[result.auditStatus];

  return (
    <div style={{ padding: '12px 24px', background: c.bg, borderBottom: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {c.icon}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, color: T.text, fontSize: '13px' }}>{c.message}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px', fontSize: '11px', color: T.textMuted }}>
            <span>Item Specifics: {result.itemSpecificsCopied}項目コピー</span>
            <span>スコア: {result.auditScore}/100</span>
            <span>自動修正: {result.autoFixApplied}件</span>
            {result.veroRisk !== 'safe' && (
              <span style={{ color: T.warning }}>VeROリスク: {result.veroRisk}</span>
            )}
            {result.basePriceUsd && (
              <span style={{ color: T.success }}>💱 基準価格: ${result.basePriceUsd} USD</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, highlight }: { icon: React.ReactNode; label: string; value: string | number; color: string; highlight?: boolean }) {
  return (
    <div style={{
      padding: '8px 12px',
      background: highlight ? `${color}20` : T.panel,
      border: `1px solid ${highlight ? color : T.panelBorder}`,
      borderRadius: '8px',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px', color }}>
        {icon}
        <span style={{ fontSize: '9px', color: T.textSubtle }}>{label}</span>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: highlight ? color : T.text }}>{value}</div>
    </div>
  );
}

function CompetitorCard({ 
  item, 
  rank, 
  currentTitle,
  isSelected, 
  isLoading,
  onSelectExact, 
  onSelectReference,
  onExclude 
}: { 
  item: CompetitorItem; 
  rank: number; 
  currentTitle: string;
  isSelected: boolean; 
  isLoading: boolean;
  onSelectExact: () => void; 
  onSelectReference: () => void;
  onExclude: () => void;
}) {
  const matchScore = calculateMatchScore(currentTitle, item.title);
  const rankColor = rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : T.textSubtle;

  const getBorderColor = () => {
    if (isSelected) return T.accent;
    if (matchScore >= 90) return '#ffd700';
    if (matchScore >= 70) return T.success;
    if (matchScore >= 50) return T.accent;
    return T.panelBorder;
  };

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '8px',
        background: isSelected ? `${T.accent}20` : T.panel,
        border: `2px solid ${getBorderColor()}`,
        transition: 'all 0.15s',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: rankColor, width: '20px' }}>#{rank}</div>
        
        <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', background: T.bg, flexShrink: 0 }}>
          {(item.image || item.imageUrl) ? (
            <img src={item.image || item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSubtle }}>📦</div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
            {item.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: T.accent }}>${item.price.toFixed(2)}</span>
            <span style={{ 
              fontSize: '10px', 
              padding: '2px 8px', 
              borderRadius: '10px',
              background: matchScore >= 90 ? '#ffd70030' : matchScore >= 70 ? `${T.success}30` : matchScore >= 50 ? `${T.accent}30` : `${T.textSubtle}30`,
              color: matchScore >= 90 ? '#ffd700' : matchScore >= 70 ? T.success : matchScore >= 50 ? T.accent : T.textSubtle,
              fontWeight: 700,
            }}>
              {matchScore}% match
            </span>
            {item.soldCount && item.soldCount > 0 && (
              <span style={{ fontSize: '9px', padding: '2px 6px', background: `${T.warning}30`, color: T.warning, borderRadius: '4px' }}>
                🔥 {item.soldCount}個販売
              </span>
            )}
          </div>
          <div style={{ fontSize: '9px', color: T.textSubtle, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span>{typeof item.seller === 'string' ? item.seller : item.seller?.username}</span>
            <span style={{ color: (typeof item.location === 'string' ? item.location : '') === 'JP' ? T.error : 'inherit' }}>
              {typeof item.location === 'string' ? item.location : item.location?.country || '-'}
            </span>
            <span>⭐ {item.sellerFeedbackScore}</span>
          </div>

          {/* 🔥 アクションボタン */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button
              onClick={onSelectExact}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                background: T.success,
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Copy size={12} />}
              完全コピー
            </button>
            <button
              onClick={onSelectReference}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                background: T.textSubtle,
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <BookOpen size={12} />
              参考
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onExclude(); }}
              style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: T.error, opacity: 0.6 }}
              title="除外"
            >
              <Ban size={14} />
            </button>
            <a
              href={item.itemWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ padding: '6px', color: T.accent, opacity: 0.8 }}
              title="eBayで見る"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmSelectionModalV2;
