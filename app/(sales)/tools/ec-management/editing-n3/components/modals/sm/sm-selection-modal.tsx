// app/tools/editing-n3/components/modals/sm/sm-selection-modal.tsx
/**
 * 🎯 SM選択モーダル v2.0
 * 
 * パイプライン連携:
 * - SM分析完了後に自動表示
 * - 競合選択完了 → 次フェーズ自動実行（Auto-Resume）
 * - 再検索機能統合
 * - 販売実績データ表示（Finding API統合）
 * 
 * デザイン改善:
 * - bg-black/80 + backdrop-blur-md で没入感強化
 * - AIレコメンド表示
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Search, RefreshCw, ExternalLink, Check, Ban, TrendingUp, Clock, Users, DollarSign, Loader2, ChevronLeft, ChevronRight, Sparkles, Filter, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface SmSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectComplete?: (productId: string | number, selectedCompetitorId: string) => void;
  onSelectionCompleteAll?: () => void;
  /** Auto-Resume: 選択完了後に次フェーズを自動実行 */
  onAutoResumeNext?: (productIds: (string | number)[]) => Promise<void>;
}

interface CompetitorItem {
  itemId: string;
  title: string;
  price: number;
  currency?: string;
  image?: string;
  seller?: string;
  sellerFeedbackScore?: number;
  location?: string;
  condition?: string;
  itemWebUrl?: string;
  // 販売実績（Finding API）
  soldCount?: number;
  soldLast30Days?: number;
  soldLast90Days?: number;
  avgSoldPrice?: number;
  // マッチレベル
  matchLevel?: number;
  // AIスコア
  aiRecommendScore?: number;
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
// メインコンポーネント
// ============================================================

export function SmSelectionModal({
  isOpen,
  onClose,
  products,
  onSelectComplete,
  onSelectionCompleteAll,
  onAutoResumeNext,
}: SmSelectionModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Map<string | number, string>>(new Map());
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [excludeWords, setExcludeWords] = useState('');
  const [excludedItemIds, setExcludedItemIds] = useState<Set<string>>(new Set());
  const [filterJpOnly, setFilterJpOnly] = useState(false);
  const [isAutoResuming, setIsAutoResuming] = useState(false);

  const currentProduct = products[currentIndex];

  // 競合データを取得
  const competitorData = useMemo(() => {
    if (!currentProduct) return { items: [], stats: null };

    const apiData = (currentProduct as any).ebay_api_data || {};
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
      seller: typeof item.seller === 'string' ? item.seller : item.seller?.username || 'Unknown',
      sellerFeedbackScore: item.seller?.feedbackScore || item.sellerFeedbackScore || 0,
      location: item.location?.country || item.itemLocation?.country || '',
      condition: item.condition || 'Used',
      itemWebUrl: item.itemWebUrl || item.viewItemUrl || `https://www.ebay.com/itm/${item.itemId}`,
      matchLevel: item.matchLevel,
    }));

    // 販売実績データをマージ（Finding APIのデータ）
    const soldMap = new Map<string, any>();
    findingItems.forEach((item: any) => {
      soldMap.set(item.title?.toLowerCase() || '', {
        soldCount: item.quantitySold || 1,
        avgSoldPrice: item.soldPrice || 0,
      });
    });

    // マッチングして販売実績を追加
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
      let score = 50; // ベーススコア
      
      // 価格が平均より低い → +10
      if (item.price < (smAnalysis.current_average_price || item.price)) score += 10;
      
      // 日本セラー → -20（競合しやすい）
      if (item.location === 'JP') score -= 20;
      
      // フィードバックスコアが高い → +5
      if ((item.sellerFeedbackScore || 0) > 1000) score += 5;
      
      // 販売実績がある → +15
      if (item.soldCount && item.soldCount > 0) score += 15;
      
      item.aiRecommendScore = Math.max(0, Math.min(100, score));
    });

    // 統計情報
    const stats = {
      total: normalizedItems.length,
      jpCount: normalizedItems.filter(i => i.location === 'JP').length,
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

    // キーワードフィルター
    if (searchKeyword) {
      const query = searchKeyword.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(query));
    }

    // 日本のみ
    if (filterJpOnly) {
      result = result.filter(item => item.location === 'JP');
    }

    // 除外ワード
    if (excludeWords) {
      const words = excludeWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
      result = result.filter(item => {
        const title = item.title.toLowerCase();
        return !words.some(word => title.includes(word));
      });
    }

    // 除外アイテム
    result = result.filter(item => !excludedItemIds.has(item.itemId));

    // AIスコアでソート
    result.sort((a, b) => (b.aiRecommendScore || 0) - (a.aiRecommendScore || 0));

    return result;
  }, [competitorData.items, searchKeyword, filterJpOnly, excludeWords, excludedItemIds]);

  // コンディション別に分類
  const newItems = filteredItems.filter(i => (i.condition || '').toLowerCase().includes('new'));
  const usedItems = filteredItems.filter(i => !(i.condition || '').toLowerCase().includes('new'));

  // 再検索
  const handleResearch = useCallback(async () => {
    if (!currentProduct) return;

    setIsSearching(true);
    toast.info('SM再分析を開始...');

    try {
      const ebayTitle = (currentProduct as any).english_title || (currentProduct as any).title_en || currentProduct.title;
      
      const response = await fetch('/api/ebay/sm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentProduct.id,
          ebayTitle: searchKeyword || ebayTitle,
          ebayCategoryId: (currentProduct as any).ebay_category_id,
          condition: (currentProduct as any).condition_name || 'New',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`SM再分析完了: 競合${result.competitor_count}件, 過去90日${result.sold_last_90d}件`);
        // ページリロードまたは親に通知
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

  // 競合選択
  const handleSelect = useCallback(async (item: CompetitorItem) => {
    if (!currentProduct) return;

    try {
      // APIで保存
      const response = await fetch(`/api/products/${currentProduct.id}/price-target`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.itemId,
          title: item.title,
          price: item.price,
          condition: item.condition,
          seller: item.seller,
        }),
      });

      if (response.ok) {
        setSelectedItems(prev => {
          const next = new Map(prev);
          next.set(currentProduct.id, item.itemId);
          return next;
        });

        toast.success('価格ターゲットを設定しました');

        if (onSelectComplete) {
          onSelectComplete(currentProduct.id, item.itemId);
        }

        // 次の商品へ自動遷移
        if (currentIndex < products.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      }
    } catch (error: any) {
      toast.error(`保存エラー: ${error.message}`);
    }
  }, [currentProduct, currentIndex, products.length, onSelectComplete]);

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

  // 全選択完了 → Auto-Resume
  const handleCompleteAll = useCallback(async () => {
    if (onSelectionCompleteAll) {
      onSelectionCompleteAll();
    }

    // Auto-Resume: 選択完了した商品の次フェーズを自動実行
    if (onAutoResumeNext && selectedItems.size > 0) {
      setIsAutoResuming(true);
      toast.info('🚀 次フェーズを自動実行中...');

      try {
        const completedProductIds = Array.from(selectedItems.keys());
        await onAutoResumeNext(completedProductIds);
        toast.success('✅ パイプライン自動継続完了');
      } catch (error: any) {
        toast.error(`Auto-Resumeエラー: ${error.message}`);
      } finally {
        setIsAutoResuming(false);
      }
    }

    onClose();
  }, [onSelectionCompleteAll, onAutoResumeNext, selectedItems, onClose]);

  // スキップ
  const handleSkip = useCallback(() => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(prev => prev + 1);
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
      } else if (e.key === 'ArrowRight' && currentIndex < products.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, products.length, onClose]);

  if (!isOpen) return null;

  const selectedItemId = currentProduct ? selectedItems.get(currentProduct.id) : null;
  const selectedItem = selectedItemId ? filteredItems.find(i => i.itemId === selectedItemId) : null;
  const myCondition = ((currentProduct as any)?.condition_name || 'Used').toLowerCase().includes('new') ? 'New' : 'Used';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // 🔥 改善: より濃い背景 + ぼかし
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
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
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
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
                <div style={{ fontSize: '12px', opacity: 0.8, color: 'white' }}>SM選択</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>
                  {currentIndex + 1} / {products.length}
                </div>
              </div>
              <button
                onClick={() => setCurrentIndex(prev => Math.min(products.length - 1, prev + 1))}
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
                SKU: {(currentProduct as any)?.sku || '-'}
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
                  完了 ({selectedItems.size}件)
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

        {/* 再検索バー */}
        <div style={{ padding: '12px 24px', background: T.panel, borderBottom: `1px solid ${T.panelBorder}` }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.textSubtle }} />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="キーワードで再検索（Enter で SM分析実行）..."
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
              {isSearching ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              再分析
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: T.textMuted, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filterJpOnly}
                onChange={(e) => setFilterJpOnly(e.target.checked)}
              />
              🇯🇵 日本のみ
            </label>
          </div>
          <div style={{ marginTop: '8px' }}>
            <input
              type="text"
              value={excludeWords}
              onChange={(e) => setExcludeWords(e.target.value)}
              placeholder="除外ワード（カンマ区切り）: PSA, BGS, Lot, USED..."
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

        {/* 🔥 販売実績パネル（Finding API統合データ） */}
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
            {/* AIレコメンド */}
            <div style={{ marginTop: '8px', padding: '8px 12px', background: `${T.accent}20`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} style={{ color: T.accent }} />
              <span style={{ fontSize: '11px', color: T.text }}>
                <strong style={{ color: T.accent }}>AI分析:</strong>{' '}
                売れ筋スコア {competitorData.stats.demandScore}/100（{competitorData.stats.confidenceLevel}）
                {competitorData.stats.demandScore >= 70 && ' - 高需要商品です 🔥'}
                {competitorData.stats.demandScore < 30 && ' - 需要低め、価格戦略が重要 ⚠️'}
              </span>
            </div>
          </div>
        )}

        {/* 選択中のターゲット */}
        {selectedItem && (
          <div style={{ padding: '12px 24px', background: `${T.accent}15`, borderBottom: `1px solid ${T.accent}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Check size={16} style={{ color: T.accent }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: T.accent }}>🎯 選択中:</span>
              <span style={{ fontSize: '12px', color: T.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedItem.title}
              </span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: T.accent }}>${selectedItem.price.toFixed(2)}</span>
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
                      isSelected={selectedItemId === item.itemId}
                      onSelect={() => handleSelect(item)}
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
                      isSelected={selectedItemId === item.itemId}
                      onSelect={() => handleSelect(item)}
                      onExclude={() => handleExclude(item.itemId)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// サブコンポーネント
// ============================================================

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

function CompetitorCard({ item, rank, isSelected, onSelect, onExclude }: { item: CompetitorItem; rank: number; isSelected: boolean; onSelect: () => void; onExclude: () => void }) {
  const rankColor = rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : T.textSubtle;

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '12px',
        borderRadius: '8px',
        background: isSelected ? `${T.accent}20` : T.panel,
        border: `2px solid ${isSelected ? T.accent : T.panelBorder}`,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* ランク */}
        <div style={{ fontSize: '12px', fontWeight: 700, color: rankColor, width: '20px' }}>#{rank}</div>
        
        {/* 画像 */}
        <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', background: T.bg, flexShrink: 0 }}>
          {item.image ? (
            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSubtle }}>
              📦
            </div>
          )}
        </div>

        {/* 情報 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
            {item.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: T.accent }}>${item.price.toFixed(2)}</span>
            {/* 🔥 販売実績 */}
            {item.soldCount && item.soldCount > 0 && (
              <span style={{ fontSize: '9px', padding: '2px 6px', background: `${T.warning}30`, color: T.warning, borderRadius: '4px' }}>
                🔥 {item.soldCount}個販売
              </span>
            )}
          </div>
          <div style={{ fontSize: '9px', color: T.textSubtle, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span>{item.seller}</span>
            <span style={{ color: item.location === 'JP' ? T.error : 'inherit' }}>{item.location || '-'}</span>
            <span>⭐ {item.sellerFeedbackScore}</span>
            {item.aiRecommendScore && item.aiRecommendScore >= 70 && (
              <span style={{ color: T.success }}>✨ AI推奨</span>
            )}
          </div>
        </div>

        {/* アクション */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          {isSelected && <Check size={16} style={{ color: T.accent }} />}
          <button
            onClick={(e) => { e.stopPropagation(); onExclude(); }}
            style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: T.error, opacity: 0.6 }}
            title="除外"
          >
            <Ban size={14} />
          </button>
          <a
            href={item.itemWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '4px', color: T.accent, opacity: 0.8 }}
            title="eBayで見る"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default SmSelectionModal;
