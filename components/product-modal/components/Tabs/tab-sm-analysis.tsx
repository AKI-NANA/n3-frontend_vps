// components/product-modal/components/Tabs/tab-sm-analysis.tsx
/**
 * SM分析タブ - n8nデータ対応版 v2.0
 * 
 * 機能強化:
 * - Finding API統合（販売実績データ表示）
 * - Browse API統合（現在出品データ表示）
 * - 再検索機能（キーワード変更可能）
 * - AIレコメンドスコア表示
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

// カラーテーマ
const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444',
  conditionNew: '#10b981', conditionUsed: '#f59e0b',
};

export interface TabSMAnalysisProps {
  product: Product | null;
  onSelectComplete?: (selectedCompetitorId: string) => void;
  onSkip?: () => void;
  isSequentialMode?: boolean;
  sequentialProgress?: { current: number; total: number };
  onPrev?: () => void;
  onNext?: () => void;
  onSave?: (updates: any) => void;
  onAutoResumeNext?: () => void;
}

interface CompetitorItem {
  itemId: string;
  title: string;
  price: string | number;
  priceNum?: number;
  currency?: string;
  image?: string;
  seller?: string | { username: string; feedbackScore?: number };
  sellerFeedbackScore?: number;
  itemLocation?: { country: string; city?: string };
  condition?: string;
  conditionNormalized?: string;
  itemWebUrl?: string;
  matchLevel?: number;
  quantityAvailable?: number;
  soldCount?: number;
  avgSoldPrice?: number;
  aiRecommendScore?: number;
}

type SortField = 'price' | 'matchLevel' | 'feedbackScore' | 'country' | 'aiScore';
type SortOrder = 'asc' | 'desc';

export function TabSMAnalysis({
  product,
  onSelectComplete,
  onSkip,
  isSequentialMode = false,
  sequentialProgress,
  onPrev,
  onNext,
  onSave,
  onAutoResumeNext,
}: TabSMAnalysisProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [researchKeyword, setResearchKeyword] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [sortField, setSortField] = useState<SortField>('aiScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterJpOnly, setFilterJpOnly] = useState(false);
  const [excludeWords, setExcludeWords] = useState('');
  const [excludedItemIds, setExcludedItemIds] = useState<Set<string>>(new Set());
  const [isN8nProcessing, setIsN8nProcessing] = useState(false);
  
  // 🔥 URL直接登録用ステート
  const [directUrl, setDirectUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlFetchedItem, setUrlFetchedItem] = useState<CompetitorItem | null>(null);

  // データソースの判定と競合アイテムの取得
  const { items, dataSource, syncStatus, analysisStats } = useMemo(() => {
    if (!product) {
      return { items: [], dataSource: 'none', syncStatus: 'idle', analysisStats: null };
    }

    const apiData = (product as any).ebay_api_data || {};
    const browseItems = apiData.browse_result?.items || [];
    const referenceItems = apiData.listing_reference?.referenceItems || [];
    const smAnalysis = apiData.sm_analysis || {};
    const status = (product as any).sync_status || 'idle';
    
    const stats = {
      soldLast30d: smAnalysis.sold_last_30d || apiData.finding_result?.soldLast30Days || 0,
      soldLast90d: smAnalysis.sold_last_90d || apiData.finding_result?.soldLast90Days || 0,
      avgSoldPrice: smAnalysis.avg_sold_price || apiData.finding_result?.averageSoldPrice || 0,
      recommendedPrice: smAnalysis.recommended_price || 0,
      demandScore: smAnalysis.demand_score || 0,
      confidenceLevel: smAnalysis.confidence_level || 'unknown',
    };
    
    if (browseItems.length > 0) {
      return { items: browseItems, dataSource: 'n8n_browse', syncStatus: status, analysisStats: stats };
    }
    if (referenceItems.length > 0) {
      return { items: referenceItems, dataSource: 'legacy_reference', syncStatus: status, analysisStats: stats };
    }
    return { items: [], dataSource: 'none', syncStatus: status, analysisStats: stats };
  }, [product]);

  // 選択済み競合の復元
  useEffect(() => {
    if (!product) return;
    
    const loadSavedSelection = async () => {
      try {
        const savedId = (product as any).listing_data?.selected_competitor_id ||
                       (product as any).ebay_api_data?.selected_competitor?.itemId;
        if (savedId) setSelectedItemId(savedId);

        const excludeData = (product as any).listing_data?.sm_exclude_settings;
        if (excludeData) {
          if (excludeData.excludeWords) setExcludeWords(excludeData.excludeWords);
          if (excludeData.excludedItemIds?.length > 0) {
            setExcludedItemIds(new Set(excludeData.excludedItemIds));
          }
        }
      } catch (error) {
        console.error('[TabSMAnalysis] 復元エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedSelection();
  }, [product?.id]);

  // アイテムの正規化
  const normalizedItems = useMemo(() => {
    const apiData = (product as any)?.ebay_api_data || {};
    const findingItems = apiData.finding_result?.items || [];
    const smAnalysis = apiData.sm_analysis || {};
    
    const soldMap = new Map<string, any>();
    findingItems.forEach((item: any) => {
      const titleKey = (item.title || '').toLowerCase().substring(0, 50);
      soldMap.set(titleKey, {
        soldCount: item.quantitySold || 1,
        avgSoldPrice: item.soldPrice || 0,
      });
    });
    
    return items.map((item: any): CompetitorItem => {
      const priceNum = typeof item.price === 'number' 
        ? item.price 
        : parseFloat(item.price?.value || item.price || '0');
      
      const titleKey = (item.title || '').toLowerCase().substring(0, 50);
      const soldData = soldMap.get(titleKey);
      
      let aiScore = 50;
      if (priceNum < (smAnalysis.current_average_price || priceNum)) aiScore += 10;
      if ((item.itemLocation?.country || item.location?.country) === 'JP') aiScore -= 20;
      if ((item.seller?.feedbackScore || item.sellerFeedbackScore || 0) > 1000) aiScore += 5;
      if (soldData?.soldCount > 0) aiScore += 15;
      aiScore = Math.max(0, Math.min(100, aiScore));
      
      return {
        itemId: item.itemId,
        title: item.title || '',
        price: item.price,
        priceNum,
        currency: item.price?.currency || item.currency || 'USD',
        image: item.image?.imageUrl || item.image || item.imageUrl,
        seller: item.seller,
        sellerFeedbackScore: item.sellerFeedbackScore || item.seller?.feedbackScore || 0,
        itemLocation: item.itemLocation || { country: item.location?.country || '' },
        condition: item.condition,
        conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
        itemWebUrl: item.itemWebUrl || `https://www.ebay.com/itm/${item.itemId?.split('|')[1] || item.itemId}`,
        matchLevel: item.matchLevel,
        quantityAvailable: item.quantityAvailable,
        soldCount: soldData?.soldCount,
        avgSoldPrice: soldData?.avgSoldPrice,
        aiRecommendScore: aiScore,
      };
    });
  }, [items, product]);

  // フィルタリング＆ソート
  const filteredAndSortedItems = useMemo(() => {
    let result = [...normalizedItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(query));
    }
    if (filterJpOnly) {
      result = result.filter(item => item.itemLocation?.country === 'JP');
    }
    if (excludeWords) {
      const words = excludeWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
      result = result.filter(item => {
        const title = item.title.toLowerCase();
        return !words.some(word => title.includes(word));
      });
    }
    result = result.filter(item => !excludedItemIds.has(item.itemId));

    result.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortField) {
        case 'price': aVal = a.priceNum || 0; bVal = b.priceNum || 0; break;
        case 'matchLevel': aVal = a.matchLevel || 999; bVal = b.matchLevel || 999; break;
        case 'feedbackScore': aVal = a.sellerFeedbackScore || 0; bVal = b.sellerFeedbackScore || 0; break;
        case 'country': aVal = a.itemLocation?.country === 'JP' ? 0 : 1; bVal = b.itemLocation?.country === 'JP' ? 0 : 1; break;
        case 'aiScore': aVal = a.aiRecommendScore || 0; bVal = b.aiRecommendScore || 0; break;
        default: aVal = 0; bVal = 0;
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [normalizedItems, searchQuery, filterJpOnly, excludeWords, excludedItemIds, sortField, sortOrder]);

  // 統計
  const stats = useMemo(() => {
    const prices = filteredAndSortedItems.map(i => i.priceNum || 0).filter(p => p > 0);
    return {
      total: normalizedItems.length,
      filtered: filteredAndSortedItems.length,
      excluded: normalizedItems.length - filteredAndSortedItems.length,
      jpCount: normalizedItems.filter(i => i.itemLocation?.country === 'JP').length,
      lowest: prices.length > 0 ? Math.min(...prices) : 0,
      average: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
    };
  }, [normalizedItems, filteredAndSortedItems]);

  const myCondition = ((product as any)?.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used';
  const newItems = filteredAndSortedItems.filter(i => i.conditionNormalized === 'New');
  const usedItems = filteredAndSortedItems.filter(i => i.conditionNormalized === 'Used');

  // 再検索機能
  const handleResearch = useCallback(async () => {
    if (!product) return;
    setIsResearching(true);
    toast.info('SM再分析を開始...');

    try {
      const ebayTitle = researchKeyword || (product as any).english_title || (product as any).title_en || product.title;
      
      const response = await fetch('/api/ebay/sm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ebayTitle: ebayTitle,
          ebayCategoryId: (product as any).ebay_category_id,
          condition: (product as any).condition_name || 'New',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`SM再分析完了: 競合${result.competitor_count}件, 過去90日${result.sold_last_90d}件`);
        window.location.reload();
      } else {
        toast.error(result.error || '再分析に失敗しました');
      }
    } catch (error: any) {
      toast.error(`エラー: ${error.message}`);
    } finally {
      setIsResearching(false);
    }
  }, [product, researchKeyword]);

  // 🔥 URL直接登録ハンドラー
  const handleFetchFromUrl = useCallback(async () => {
    if (!directUrl.trim()) {
      toast.error('URLを入力してください');
      return;
    }
    
    setIsFetchingUrl(true);
    toast.info('eBayから商品情報を取得中...');
    
    try {
      const response = await fetch('/api/ebay/get-item-by-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: directUrl.trim(),
          productId: product?.id 
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.item) {
        const item = result.item;
        const fetchedItem: CompetitorItem = {
          itemId: item.itemId || item.legacyItemId,
          title: item.title,
          price: item.price?.value || '0',
          priceNum: parseFloat(item.price?.value || '0'),
          currency: item.price?.currency || 'USD',
          image: item.image,
          seller: item.seller?.username || 'Unknown',
          sellerFeedbackScore: item.seller?.feedbackScore || 0,
          itemLocation: item.itemLocation,
          condition: item.condition,
          conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
          itemWebUrl: item.itemWebUrl || directUrl,
          matchLevel: 1, // 手動登録は最高精度
          aiRecommendScore: 100, // 手動登録は最高推奨
        };
        
        setUrlFetchedItem(fetchedItem);
        toast.success(`✅ 取得成功: "${item.title?.substring(0, 40)}..." (Specs: ${item.itemSpecificsCount}件)`);
        setDirectUrl('');
      } else {
        toast.error(result.error || '商品情報の取得に失敗しました');
      }
    } catch (error: any) {
      console.error('URL取得エラー:', error);
      toast.error(`エラー: ${error.message}`);
    } finally {
      setIsFetchingUrl(false);
    }
  }, [directUrl, product?.id]);
  
  // n8n SM分析をトリガー
  const handleTriggerN8nAnalysis = useCallback(async () => {
    if (!product) return;
    setIsN8nProcessing(true);
    toast.info('SM分析を開始しています...');

    try {
      const response = await fetch('/api/n8n/sm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [product.id], options: { batchSize: 1 } }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('SM分析を開始しました。完了までお待ちください。');
      } else {
        toast.error(result.error || 'SM分析の開始に失敗しました');
      }
    } catch (error: any) {
      toast.error(`エラー: ${error.message}`);
    } finally {
      setIsN8nProcessing(false);
    }
  }, [product]);

  // 競合選択を保存
  const handleSelect = useCallback(async (item: CompetitorItem) => {
    if (!product) return;
    setSelectedItemId(item.itemId);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/products/${product.id}/price-target`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.itemId,
          title: item.title,
          price: item.priceNum,
          condition: item.conditionNormalized,
          seller: typeof item.seller === 'string' ? item.seller : (item.seller as any)?.username || 'Unknown',
        }),
      });

      if (response.ok) {
        toast.success('価格ターゲットを設定しました');
        if (onSave) onSave({ selected_competitor_id: item.itemId, sm_target_price: item.priceNum });
        
        // Auto-Resume: 選択完了後に次フェーズを自動実行
        if (onAutoResumeNext) {
          toast.info('🚀 次フェーズを自動実行中...');
          await onAutoResumeNext();
        }
        
        if (isSequentialMode && onSelectComplete) onSelectComplete(item.itemId);
      }
    } catch (error: any) {
      toast.error(`保存エラー: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [product, isSequentialMode, onSelectComplete, onSave, onAutoResumeNext]);

  // 🔥 URL取得した商品を選択
  const handleSelectUrlFetchedItem = useCallback(async () => {
    if (!urlFetchedItem || !product) return;
    await handleSelect(urlFetchedItem);
    setUrlFetchedItem(null);
  }, [urlFetchedItem, product, handleSelect]);

  const toggleExclude = useCallback((itemId: string) => {
    setExcludedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) { next.delete(itemId); toast.info('除外を解除しました'); }
      else { next.add(itemId); toast.info('除外しました'); }
      return next;
    });
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
        読み込み中...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '1.5rem', background: T.bg, height: '100%' }}>
        {syncStatus === 'processing' && (
          <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '6px', background: '#dbeafe', border: '1px solid #93c5fd', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ color: '#2563eb' }}></i>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af' }}>SM分析処理中...</div>
              <div style={{ fontSize: '11px', color: '#3b82f6' }}>n8nで処理しています。完了後に自動更新されます。</div>
            </div>
          </div>
        )}
        <div style={{ padding: '2rem', borderRadius: '8px', background: `${T.warning}15`, border: `1px solid ${T.warning}40`, textAlign: 'center' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: T.warning, marginBottom: '12px' }}></i>
          <p style={{ fontSize: '13px', fontWeight: 600, color: T.text, marginBottom: '0.5rem' }}>SM分析データがありません</p>
          <p style={{ fontSize: '11px', color: T.textMuted, marginBottom: '1rem' }}>SM分析を実行して競合商品を取得してください</p>
          <button onClick={handleTriggerN8nAnalysis} disabled={isN8nProcessing} style={{ padding: '0.75rem 1.5rem', fontSize: '12px', fontWeight: 600, background: isN8nProcessing ? T.highlight : T.accent, color: 'white', border: 'none', borderRadius: '6px', cursor: isN8nProcessing ? 'not-allowed' : 'pointer' }}>
            {isN8nProcessing ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>分析開始中...</> : <><i className="fas fa-search" style={{ marginRight: '0.5rem' }}></i>SM分析を実行</>}
          </button>
        </div>
      </div>
    );
  }

  const selectedItem = filteredAndSortedItems.find(i => i.itemId === selectedItemId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: T.bg }}>
      {/* 連続選択モードヘッダー */}
      {isSequentialMode && sequentialProgress && (
        <div style={{ padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={onPrev} disabled={sequentialProgress.current <= 1} style={{ padding: '0.375rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', cursor: sequentialProgress.current <= 1 ? 'not-allowed' : 'pointer', opacity: sequentialProgress.current <= 1 ? 0.5 : 1, color: 'white' }}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>連続選択モード</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{sequentialProgress.current} / {sequentialProgress.total}</div>
            </div>
            <button onClick={onNext} disabled={sequentialProgress.current >= sequentialProgress.total} style={{ padding: '0.375rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', cursor: sequentialProgress.current >= sequentialProgress.total ? 'not-allowed' : 'pointer', opacity: sequentialProgress.current >= sequentialProgress.total ? 0.5 : 1, color: 'white' }}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <button onClick={onSkip} style={{ padding: '0.375rem 0.75rem', fontSize: '11px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}>スキップ</button>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
        {/* 🔥 eBay URL直接登録セクション */}
        <div style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: '#f0f9ff', border: '1px dashed #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-link" style={{ color: '#3b82f6' }}></i>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6' }}>eBay URLから直接登録</span>
          </div>
          <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '0.5rem' }}>
            競合商品が見つからない場合、eBay商品ページのURLを直接入力して参照データを追加できます。
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchFromUrl()}
              placeholder="https://www.ebay.com/itm/..."
              style={{ 
                flex: 1, 
                padding: '0.5rem', 
                fontSize: '11px', 
                border: '1px solid #e2e8f0', 
                borderRadius: '4px',
                background: 'white'
              }}
            />
            <button
              onClick={handleFetchFromUrl}
              disabled={isFetchingUrl || !directUrl.trim()}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '11px',
                fontWeight: 600,
                background: isFetchingUrl ? '#94a3b8' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (isFetchingUrl || !directUrl.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isFetchingUrl || !directUrl.trim()) ? 0.6 : 1,
              }}
            >
              {isFetchingUrl ? (
                <><i className="fas fa-spinner fa-spin" style={{ marginRight: '0.25rem' }}></i>取得中...</>
              ) : (
                <><i className="fas fa-download" style={{ marginRight: '0.25rem' }}></i>取得</>
              )}
            </button>
          </div>
          
          {/* 🔥 URL取得結果表示 */}
          {urlFetchedItem && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '6px', background: 'white', border: '2px solid #10b981' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem' }}>
                ✅ 取得成功 - この商品を参照データとして登録しますか？
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {urlFetchedItem.image && (
                  <img 
                    src={urlFetchedItem.image} 
                    alt="" 
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {urlFetchedItem.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>${urlFetchedItem.priceNum?.toFixed(2)}</span>
                    <span>{urlFetchedItem.conditionNormalized}</span>
                    <span>{urlFetchedItem.itemLocation?.country || '-'}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleSelectUrlFetchedItem}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fas fa-check" style={{ marginRight: '0.25rem' }}></i>
                  この商品を選択
                </button>
                <button
                  onClick={() => setUrlFetchedItem(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '11px',
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 🔥 eBay Product Researchリンク */}
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: '#fefce8', border: '1px solid #fde047', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-chart-line" style={{ color: '#ca8a04' }}></i>
            <span style={{ fontSize: '11px', color: '#854d0e' }}>
              手動で競合を探す場合はeBay公式リサーチツールを使用
            </span>
          </div>
          <a
            href="https://www.ebay.com/sh/research?marketplace=EBAY-US&tabName=SOLD"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '10px',
              fontWeight: 600,
              background: '#eab308',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <i className="fas fa-external-link-alt"></i>
            Product Research
          </a>
        </div>

        {/* データソース表示 */}
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '4px', background: dataSource === 'n8n_browse' ? '#dcfce7' : '#fef3c7', border: `1px solid ${dataSource === 'n8n_browse' ? '#86efac' : '#fcd34d'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: dataSource === 'n8n_browse' ? '#166534' : '#92400e' }}>
            データソース: {dataSource === 'n8n_browse' ? 'n8n Browse API（統合分析）' : '従来のSM分析'}
          </span>
          <button onClick={handleTriggerN8nAnalysis} disabled={isN8nProcessing || syncStatus === 'processing'} style={{ padding: '0.25rem 0.5rem', fontSize: '9px', background: T.accent, color: 'white', border: 'none', borderRadius: '4px', cursor: (isN8nProcessing || syncStatus === 'processing') ? 'not-allowed' : 'pointer', opacity: (isN8nProcessing || syncStatus === 'processing') ? 0.6 : 1 }}>
            <i className={`fas fa-sync-alt ${isN8nProcessing ? 'fa-spin' : ''}`} style={{ marginRight: '0.25rem' }}></i>再分析
          </button>
        </div>

        {/* 🔥 販売実績パネル（Finding API統合） */}
        {analysisStats && (
          <div style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: `${T.accent}10`, border: `1px solid ${T.accent}30` }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: T.accent, marginBottom: '0.5rem' }}>📊 販売実績（Finding API統合）</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
              <StatBox label="30日販売" value={analysisStats.soldLast30d} color={T.warning} />
              <StatBox label="90日販売" value={analysisStats.soldLast90d} color={T.warning} />
              <StatBox label="販売平均" value={`$${analysisStats.avgSoldPrice.toFixed(2)}`} color={T.success} />
              <StatBox label="推奨価格" value={`$${analysisStats.recommendedPrice.toFixed(2)}`} color={T.accent} />
              <StatBox label="需要スコア" value={`${analysisStats.demandScore}/100`} color={analysisStats.demandScore >= 70 ? T.success : T.warning} />
              <StatBox label="信頼度" value={analysisStats.confidenceLevel} color={T.textMuted} />
            </div>
          </div>
        )}

        {/* 統計 */}
        <div style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}`, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
          <StatBox label="Total" value={stats.total} />
          <StatBox label="日本" value={stats.jpCount} color={T.error} />
          <StatBox label="除外" value={stats.excluded} color={stats.excluded > 0 ? T.warning : T.textMuted} />
          <StatBox label="最安" value={`$${stats.lowest.toFixed(2)}`} color={T.success} />
          <StatBox label="平均" value={`$${stats.average.toFixed(2)}`} />
        </div>

        {/* 再検索バー */}
        <div style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: T.textMuted }}></i>
              <input
                type="text"
                value={researchKeyword}
                onChange={(e) => setResearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                placeholder="再検索キーワード（Enterで実行）..."
                style={{ width: '100%', padding: '0.375rem 0.5rem 0.375rem 1.75rem', fontSize: '11px', border: `1px solid ${T.panelBorder}`, borderRadius: '4px' }}
              />
            </div>
            <button
              onClick={handleResearch}
              disabled={isResearching}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '11px',
                fontWeight: 600,
                background: T.accent,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isResearching ? 'not-allowed' : 'pointer',
                opacity: isResearching ? 0.6 : 1,
              }}
            >
              {isResearching ? <i className="fas fa-spinner fa-spin"></i> : '再分析'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '150px' }}>
              <i className="fas fa-filter" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: T.textMuted }}></i>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="タイトルフィルター..." style={{ width: '100%', padding: '0.375rem 0.5rem 0.375rem 1.75rem', fontSize: '11px', border: `1px solid ${T.panelBorder}`, borderRadius: '4px' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={filterJpOnly} onChange={(e) => setFilterJpOnly(e.target.checked)} />
              <i className="fas fa-map-marker-alt" style={{ color: T.error }}></i> 日本のみ
            </label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)} style={{ padding: '0.375rem', fontSize: '10px', border: `1px solid ${T.panelBorder}`, borderRadius: '4px' }}>
              <option value="aiScore">AI推奨順</option>
              <option value="price">価格順</option>
              <option value="matchLevel">精度順</option>
              <option value="feedbackScore">評価順</option>
              <option value="country">国順</option>
            </select>
            <button onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')} style={{ padding: '0.375rem', background: T.highlight, border: `1px solid ${T.panelBorder}`, borderRadius: '4px', cursor: 'pointer' }}>
              <i className={`fas fa-sort-amount-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
            </button>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <input type="text" value={excludeWords} onChange={(e) => setExcludeWords(e.target.value)} placeholder="除外ワード（カンマ区切り）: PSA, BGS, Lot..." style={{ width: '100%', padding: '0.375rem 0.5rem', fontSize: '10px', border: `1px solid ${T.panelBorder}`, borderRadius: '4px' }} />
          </div>
        </div>

        {/* 選択中のターゲット */}
        {selectedItem && (
          <div style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '6px', background: `${T.accent}10`, border: `2px solid ${T.accent}` }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: T.accent, marginBottom: '0.5rem' }}>🎯 価格ターゲット（{myCondition}）</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: T.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedItem.title}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: T.accent, marginLeft: '1rem' }}>${selectedItem.priceNum?.toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* 競合リスト */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: T.conditionNew, marginBottom: '0.5rem', padding: '0.375rem 0.5rem', background: `${T.conditionNew}15`, borderRadius: '4px' }}>
              ✨ New ({newItems.length}) {myCondition === 'New' && '← Your'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {newItems.slice(0, 10).map((item, idx) => (
                <CompetitorCard key={item.itemId} item={item} rank={idx + 1} isSelected={selectedItemId === item.itemId} onSelect={() => handleSelect(item)} onExclude={() => toggleExclude(item.itemId)} isSaving={isSaving && selectedItemId === item.itemId} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: T.conditionUsed, marginBottom: '0.5rem', padding: '0.375rem 0.5rem', background: `${T.conditionUsed}15`, borderRadius: '4px' }}>
              📦 Used ({usedItems.length}) {myCondition === 'Used' && '← Your'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {usedItems.slice(0, 10).map((item, idx) => (
                <CompetitorCard key={item.itemId} item={item} rank={idx + 1} isSelected={selectedItemId === item.itemId} onSelect={() => handleSelect(item)} onExclude={() => toggleExclude(item.itemId)} isSaving={isSaving && selectedItemId === item.itemId} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompetitorCard({ item, rank, isSelected, onSelect, onExclude, isSaving }: { item: CompetitorItem; rank: number; isSelected: boolean; onSelect: () => void; onExclude: () => void; isSaving: boolean; }) {
  const seller = typeof item.seller === 'string' ? item.seller : (item.seller as any)?.username || 'Unknown';
  const ebayUrl = item.itemWebUrl || `https://www.ebay.com/itm/${item.itemId}`;

  return (
    <div onClick={onSelect} style={{ padding: '0.5rem', borderRadius: '6px', background: isSelected ? `${T.accent}15` : T.panel, border: `2px solid ${isSelected ? T.accent : T.panelBorder}`, cursor: 'pointer', transition: 'all 0.15s' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: rank === 1 ? '#ffd700' : (rank === 2 ? '#c0c0c0' : (rank === 3 ? '#cd7f32' : T.textMuted)) }}>#{rank}</div>
        <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: T.highlight, flexShrink: 0 }}>
          {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="fas fa-box" style={{ width: '20px', height: '20px', margin: '10px', color: T.textSubtle }}></i>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: T.accent }}>${item.priceNum?.toFixed(2)}</span>
            {/* 🔥 販売実績バッジ */}
            {item.soldCount && item.soldCount > 0 && (
              <span style={{ fontSize: '8px', padding: '1px 4px', background: `${T.warning}30`, color: T.warning, borderRadius: '3px' }}>
                🔥 {item.soldCount}個販売
              </span>
            )}
            {/* AI推奨バッジ */}
            {item.aiRecommendScore && item.aiRecommendScore >= 70 && (
              <span style={{ fontSize: '8px', padding: '1px 4px', background: `${T.success}30`, color: T.success, borderRadius: '3px' }}>
                ✨ AI推奨
              </span>
            )}
          </div>
          <div style={{ fontSize: '8px', color: T.textMuted, display: 'flex', gap: '0.5rem' }}>
            <span>{seller}</span>
            <span style={{ color: item.itemLocation?.country === 'JP' ? T.error : 'inherit' }}>{item.itemLocation?.country || '-'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {isSelected && <i className="fas fa-check-circle" style={{ color: T.accent }}></i>}
          {isSaving && <i className="fas fa-spinner fa-spin" style={{ color: T.accent }}></i>}
          <button onClick={(e) => { e.stopPropagation(); onExclude(); }} style={{ padding: '0.125rem', background: 'transparent', border: 'none', cursor: 'pointer', color: T.error, opacity: 0.6 }} title="除外">
            <i className="fas fa-ban" style={{ fontSize: '12px' }}></i>
          </button>
        </div>
      </div>
      <a href={ebayUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: 'block', marginTop: '0.375rem', padding: '0.25rem', borderRadius: '4px', background: T.highlight, textAlign: 'center', fontSize: '8px', fontWeight: 600, color: T.accent, textDecoration: 'none' }}>
        <i className="fas fa-external-link-alt" style={{ marginRight: '0.25rem' }}></i>eBayで見る
      </a>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ padding: '0.375rem', borderRadius: '4px', background: T.highlight, textAlign: 'center' }}>
      <div style={{ fontSize: '8px', textTransform: 'uppercase', color: T.textSubtle }}>{label}</div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: color || T.text }}>{value}</div>
    </div>
  );
}

export default TabSMAnalysis;
