'use client';

// TabCompetitors - V11.0 - 除外機能追加
// デザインシステムV4準拠
// 機能: 除外ワード入力、SM分析再実行、個別除外、統計再計算

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444',
  conditionNew: '#10b981', conditionUsed: '#f59e0b',
};

// デフォルト除外ワード
const DEFAULT_EXCLUDE_WORDS = ['PSA', 'BGS', 'CGC', 'Graded', 'Lot', 'Bundle', 'Set of'];

export interface TabCompetitorsProps {
  product: Product | null;
}

export function TabCompetitors({ product }: TabCompetitorsProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dbSelectedItem, setDbSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 除外機能の状態
  const [excludeWords, setExcludeWords] = useState<string>('');
  const [excludedItemIds, setExcludedItemIds] = useState<Set<string>>(new Set());
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  // DBから選択済みアイテムと除外設定を復元
  useEffect(() => {
    if (!product) return;

    const loadData = async () => {
      try {
        // 価格ターゲット復元
        const response = await fetch(`/api/products/${product.id}/price-target`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setDbSelectedItem(result.data);
          setSelectedItemId(result.data.itemId);
        }

        // ✅ 除外設定をAPIから復元（最新データを取得）
        const excludeResponse = await fetch(`/api/products/${product.id}/exclude-settings`);
        const excludeResult = await excludeResponse.json();
        
        if (excludeResult.success && excludeResult.data) {
          console.log('✅ [除外設定] 復元:', excludeResult.data);
          if (excludeResult.data.excludeWords) {
            setExcludeWords(excludeResult.data.excludeWords);
          }
          if (excludeResult.data.excludedItemIds && excludeResult.data.excludedItemIds.length > 0) {
            setExcludedItemIds(new Set(excludeResult.data.excludedItemIds));
          }
        }
      } catch (error) {
        console.error('❌ [Competitors] DB復元エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [product?.id]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  const referenceItems = (product as any)?.ebay_api_data?.listing_reference?.referenceItems || [];
  const myCondition = ((product as any)?.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used';

  // 除外ワードでフィルタ + 個別除外を適用
  const filteredItems = useMemo(() => {
    const words = excludeWords
      .split(',')
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 0);

    return referenceItems.filter((item: any) => {
      // 個別除外チェック
      if (excludedItemIds.has(item.itemId)) return false;
      
      // ワード除外チェック
      const title = (item.title || '').toLowerCase();
      for (const word of words) {
        if (title.includes(word)) return false;
      }
      return true;
    });
  }, [referenceItems, excludeWords, excludedItemIds]);

  // 価格でソート + コンディション正規化
  const sortedItems = useMemo(() => {
    const items = filteredItems.map((item: any) => ({
      ...item,
      priceNum: parseFloat(item.price) || 0,
      conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
      feedbackScore: item.sellerFeedbackScore || item.seller?.feedbackScore || 0,
      feedbackPercentage: parseFloat(item.sellerFeedbackPercentage || item.seller?.feedbackPercentage || '0'),
      soldQuantity: item.soldQuantity || 0,
      quantityAvailable: item.quantityAvailable || null,
    }));

    items.sort((a: any, b: any) => a.priceNum - b.priceNum);
    return items;
  }, [filteredItems]);

  // 全アイテム（除外前）をソート
  const allSortedItems = useMemo(() => {
    return referenceItems
      .map((item: any) => ({
        ...item,
        priceNum: parseFloat(item.price) || 0,
        conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
      }))
      .sort((a: any, b: any) => a.priceNum - b.priceNum);
  }, [referenceItems]);

  const newItems = sortedItems.filter((item: any) => item.conditionNormalized === 'New');
  const usedItems = sortedItems.filter((item: any) => item.conditionNormalized === 'Used');

  // 統計計算（除外後）
  const stats = useMemo(() => {
    const prices = sortedItems.map((item: any) => item.priceNum).filter((p: number) => p > 0);
    return {
      count: sortedItems.length,
      lowest: prices.length > 0 ? Math.min(...prices) : 0,
      average: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      highest: prices.length > 0 ? Math.max(...prices) : 0,
      excludedCount: referenceItems.length - sortedItems.length,
    };
  }, [sortedItems, referenceItems.length]);

  // SM分析再実行（除外ワード適用）
  const handleReanalyze = useCallback(async () => {
    if (!product) return;

    setIsReanalyzing(true);
    toast.info('SM分析を再実行中...');

    try {
      const ebayTitle = (product as any)?.english_title || product?.title || '';
      
      const response = await fetch('/api/sellermirror/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ebayTitle,
          excludeWords: excludeWords.split(',').map(w => w.trim()).filter(w => w),
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`SM分析完了: ${result.listingData?.referenceItems?.length || 0}件取得`);
        // ページリロードして最新データを表示
        window.location.reload();
      } else {
        toast.error(result.error || 'SM分析に失敗しました');
      }
    } catch (error: any) {
      toast.error(`エラー: ${error.message}`);
    } finally {
      setIsReanalyzing(false);
    }
  }, [product, excludeWords]);

  // ✅ 一括除外（チェックした商品をまとめて除外）
  const [checkedItemIds, setCheckedItemIds] = useState<Set<string>>(new Set());

  const toggleCheck = useCallback((itemId: string) => {
    setCheckedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleBulkExclude = useCallback(async () => {
    if (checkedItemIds.size === 0) {
      toast.warning('除外する商品を選択してください');
      return;
    }

    // チェックした商品を除外リストに追加
    const newExcludedIds = new Set(excludedItemIds);
    checkedItemIds.forEach(id => newExcludedIds.add(id));
    
    setExcludedItemIds(newExcludedIds);
    setCheckedItemIds(new Set()); // チェックをクリア
    
    toast.success(`${checkedItemIds.size}件を除外しました`);

    // DB保存
    if (product) {
      try {
        await fetch(`/api/products/${product.id}/exclude-settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            excludeWords,
            excludedItemIds: Array.from(newExcludedIds),
          })
        });
        console.log('✅ 一括除外を保存しました');
      } catch (error) {
        console.error('一括除外保存エラー:', error);
      }
    }
  }, [checkedItemIds, excludedItemIds, excludeWords, product]);

  const handleSelectAll = useCallback(() => {
    const allIds = sortedItems.map((item: any) => item.itemId);
    setCheckedItemIds(new Set(allIds));
  }, [sortedItems]);

  const handleDeselectAll = useCallback(() => {
    setCheckedItemIds(new Set());
  }, []);

  // 個別除外トグル（即座に保存）
  const toggleExclude = useCallback(async (itemId: string) => {
    // 新しい除外IDセットを先に計算
    const newExcludedIds = new Set(excludedItemIds);
    if (newExcludedIds.has(itemId)) {
      newExcludedIds.delete(itemId);
      toast.info('除外を解除しました');
    } else {
      newExcludedIds.add(itemId);
      toast.info('除外しました');
    }
    
    // stateを更新
    setExcludedItemIds(newExcludedIds);
    
    // 即座にDB保存
    if (product) {
      try {
        await fetch(`/api/products/${product.id}/exclude-settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            excludeWords,
            excludedItemIds: Array.from(newExcludedIds),
          })
        });
        console.log('✅ 除外設定を保存しました');
      } catch (error) {
        console.error('除外設定保存エラー:', error);
      }
    }
  }, [product, excludeWords, excludedItemIds]);

  // 除外設定を保存
  const saveExcludeSettings = useCallback(async () => {
    if (!product) return;

    try {
      const response = await fetch(`/api/products/${product.id}/exclude-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          excludeWords,
          excludedItemIds: Array.from(excludedItemIds),
        })
      });

      if (response.ok) {
        toast.success('除外設定を保存しました');
      }
    } catch (error) {
      console.error('除外設定保存エラー:', error);
    }
  }, [product, excludeWords, excludedItemIds]);

  // 除外設定変更時に自動保存（初期ロード後のみ）
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      setHasInitialized(true);
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (hasInitialized && product) {
      const timer = setTimeout(() => {
        console.log('🔄 除外設定を自動保存中...');
        saveExcludeSettings();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [excludeWords, excludedItemIds, hasInitialized, product, saveExcludeSettings]);

  const saveTargetPrice = useCallback(async (item: any) => {
    try {
      const response = await fetch(`/api/products/${product.id}/price-target`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.itemId,
          title: item.title,
          price: item.priceNum,
          condition: item.conditionNormalized,
          seller: typeof item.seller === 'string' ? item.seller : item.seller?.username || 'Unknown',
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDbSelectedItem({
            itemId: item.itemId,
            title: item.title,
            price: item.priceNum,
            condition: item.conditionNormalized,
          });
          toast.success('価格ターゲットを設定しました');
        }
      }
    } catch (error) {
      console.error('❌ 価格ターゲット保存エラー:', error);
    }
  }, [product?.id]);

  // デフォルト選択
  useEffect(() => {
    if (selectedItemId !== null) return;
    if (sortedItems.length === 0) return;
    if (isLoading) return;
    
    const sameConditionItems = sortedItems.filter(
      (item: any) => item.conditionNormalized === myCondition
    );
    
    if (sameConditionItems.length > 0) {
      const cheapest = sameConditionItems[0];
      setSelectedItemId(cheapest.itemId);
      saveTargetPrice(cheapest);
    }
  }, [sortedItems.length, myCondition, saveTargetPrice, isLoading, selectedItemId]);

  const handleSelect = (item: any) => {
    setSelectedItemId(item.itemId);
    saveTargetPrice(item);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
        読み込み中...
      </div>
    );
  }

  if (referenceItems.length === 0) {
    return (
      <div style={{ padding: '1.5rem', background: T.bg, height: '100%' }}>
        <div style={{
          padding: '1rem',
          borderRadius: '6px',
          background: `${T.warning}15`,
          border: `1px solid ${T.warning}40`,
          textAlign: 'center',
        }}>
          <i className="fas fa-exclamation-triangle" style={{ color: T.warning, marginRight: '0.5rem' }}></i>
          <span style={{ fontSize: '11px', color: T.warning }}>
            競合データがありません。「ツール」タブからSM分析を実行してください。
          </span>
        </div>
      </div>
    );
  }

  const selectedItem = sortedItems.find((item: any) => item.itemId === selectedItemId);

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      
      {/* ===== 除外ワード入力セクション ===== */}
      <div style={{
        marginBottom: '0.75rem',
        padding: '0.75rem',
        borderRadius: '6px',
        background: T.panel,
        border: `1px solid ${T.panelBorder}`,
      }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: T.text, marginBottom: '0.5rem' }}>
          <i className="fas fa-filter" style={{ marginRight: '0.5rem', color: T.accent }}></i>
          除外フィルタ
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={excludeWords}
            onChange={(e) => setExcludeWords(e.target.value)}
            placeholder="除外ワード（カンマ区切り）: PSA, BGS, Lot, Bundle..."
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '11px',
              border: `1px solid ${T.panelBorder}`,
              borderRadius: '4px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleReanalyze}
            disabled={isReanalyzing}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '11px',
              fontWeight: 600,
              background: isReanalyzing ? T.highlight : T.accent,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isReanalyzing ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {isReanalyzing ? (
              <><i className="fas fa-spinner fa-spin"></i> 分析中...</>
            ) : (
              <><i className="fas fa-sync-alt"></i> 再分析</>
            )}
          </button>
        </div>
        <div style={{ fontSize: '9px', color: T.textMuted }}>
          <i className="fas fa-info-circle" style={{ marginRight: '0.25rem' }}></i>
          例: PSA, BGS, CGC（鑑定品除外）、Lot, Bundle（セット除外）
        </div>
      </div>

      {/* ===== 統計サマリー ===== */}
      <div style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
          <StatBox label="Total" value={stats.count} />
          <StatBox label="Excluded" value={stats.excludedCount} color={stats.excludedCount > 0 ? T.error : T.textMuted} />
          <StatBox label="Lowest" value={`${stats.lowest.toFixed(2)}`} color={T.success} />
          <StatBox label="Average" value={`${stats.average.toFixed(2)}`} />
          <StatBox label="Highest" value={`${stats.highest.toFixed(2)}`} color={T.warning} />
          <StatBox label="Condition" value={myCondition} color={myCondition === 'New' ? T.conditionNew : T.conditionUsed} />
        </div>
      </div>

      {/* ===== 原産国・素材情報（SM分析結果） ===== */}
      <SMAttributesPanel product={product} referenceItems={referenceItems} />

      {/* ===== 一括除外ボタン ===== */}
      <div style={{
        marginBottom: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '6px',
        background: T.panel,
        border: `1px solid ${T.panelBorder}`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{ fontSize: '10px', fontWeight: 600, color: T.text }}>
          選択: {checkedItemIds.size}件
        </span>
        <button
          onClick={handleSelectAll}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '9px',
            background: T.highlight,
            border: `1px solid ${T.panelBorder}`,
            borderRadius: '4px',
            cursor: 'pointer',
            color: T.text,
          }}
        >
          全選択
        </button>
        <button
          onClick={handleDeselectAll}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '9px',
            background: T.highlight,
            border: `1px solid ${T.panelBorder}`,
            borderRadius: '4px',
            cursor: 'pointer',
            color: T.text,
          }}
        >
          選択解除
        </button>
        <button
          onClick={handleBulkExclude}
          disabled={checkedItemIds.size === 0}
          style={{
            padding: '0.25rem 0.75rem',
            fontSize: '10px',
            fontWeight: 600,
            background: checkedItemIds.size > 0 ? T.error : T.highlight,
            color: checkedItemIds.size > 0 ? 'white' : T.textMuted,
            border: 'none',
            borderRadius: '4px',
            cursor: checkedItemIds.size > 0 ? 'pointer' : 'not-allowed',
            marginLeft: 'auto',
          }}
        >
          <i className="fas fa-ban" style={{ marginRight: '0.25rem' }}></i>
          一括除外 ({checkedItemIds.size})
        </button>
      </div>

      {/* ===== 価格ターゲット ===== */}
      {selectedItem && (
        <div style={{
          marginBottom: '0.75rem',
          padding: '0.75rem',
          borderRadius: '6px',
          background: `${T.accent}10`,
          border: `2px solid ${T.accent}`,
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: T.accent, marginBottom: '0.5rem' }}>
            🎯 価格ターゲット（{myCondition}の最安値）
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: T.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedItem.title}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: T.accent, marginLeft: '1rem' }}>
              ${selectedItem.priceNum.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* ===== 競合リスト（2カラム） ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* New Condition */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: T.conditionNew,
            marginBottom: '0.5rem',
            padding: '0.375rem 0.5rem',
            background: `${T.conditionNew}15`,
            borderRadius: '4px',
          }}>
            ✨ New ({newItems.length}) {myCondition === 'New' && '← Your Condition'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {newItems.map((item: any, idx: number) => (
              <CompetitorRow
                key={item.itemId || `new-${idx}`}
                item={item}
                isSelected={selectedItemId === item.itemId}
                isExcluded={excludedItemIds.has(item.itemId)}
                isChecked={checkedItemIds.has(item.itemId)}
                onSelect={() => handleSelect(item)}
                onToggleExclude={() => toggleExclude(item.itemId)}
                onToggleCheck={() => toggleCheck(item.itemId)}
                rank={idx + 1}
              />
            ))}
          </div>
        </div>

        {/* Used Condition */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: T.conditionUsed,
            marginBottom: '0.5rem',
            padding: '0.375rem 0.5rem',
            background: `${T.conditionUsed}15`,
            borderRadius: '4px',
          }}>
            📦 Used ({usedItems.length}) {myCondition === 'Used' && '← Your Condition'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {usedItems.map((item: any, idx: number) => (
              <CompetitorRow
                key={item.itemId || `used-${idx}`}
                item={item}
                isSelected={selectedItemId === item.itemId}
                isExcluded={excludedItemIds.has(item.itemId)}
                isChecked={checkedItemIds.has(item.itemId)}
                onSelect={() => handleSelect(item)}
                onToggleExclude={() => toggleExclude(item.itemId)}
                onToggleCheck={() => toggleCheck(item.itemId)}
                rank={newItems.length + idx + 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== 除外済みアイテム表示 ===== */}
      {stats.excludedCount > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            color: T.error,
            marginBottom: '0.5rem',
            padding: '0.375rem 0.5rem',
            background: `${T.error}15`,
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            🚫 除外済み ({stats.excludedCount}件) - クリックで復元可能
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {allSortedItems
              .filter((item: any) => 
                excludedItemIds.has(item.itemId) || 
                excludeWords.split(',').some(w => 
                  w.trim() && (item.title || '').toLowerCase().includes(w.trim().toLowerCase())
                )
              )
              .map((item: any, idx: number) => (
                <ExcludedRow
                  key={item.itemId || `excluded-${idx}`}
                  item={item}
                  onRestore={() => toggleExclude(item.itemId)}
                  isManuallyExcluded={excludedItemIds.has(item.itemId)}
                />
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// 競合商品行コンポーネント
function CompetitorRow({ item, isSelected, isExcluded, isChecked, onSelect, onToggleExclude, onToggleCheck, rank }: {
  item: any;
  isSelected: boolean;
  isExcluded: boolean;
  isChecked: boolean;
  onSelect: () => void;
  onToggleExclude: () => void;
  onToggleCheck: () => void;
  rank: number;
}) {
  const seller = typeof item.seller === 'string' ? item.seller : item.seller?.username || item.seller || 'Unknown';
  const feedbackScore = item.feedbackScore || item.sellerFeedbackScore || 0;
  const feedbackPercentage = item.feedbackPercentage || parseFloat(item.sellerFeedbackPercentage || '0');
  const quantityAvailable = item.quantityAvailable;
  const ebayUrl = item.itemWebUrl || `https://www.ebay.com/itm/${item.itemId?.split('|')[1] || ''}`;

  return (
    <div
      style={{
        padding: '0.5rem',
        borderRadius: '6px',
        background: isSelected ? `${T.accent}15` : (isChecked ? `${T.warning}10` : T.panel),
        border: `2px solid ${isSelected ? T.accent : (isChecked ? T.warning : T.panelBorder)}`,
        opacity: isExcluded ? 0.5 : 1,
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {/* チェックボックス（一括除外用） */}
        <div
          onClick={(e) => { e.stopPropagation(); onToggleCheck(); }}
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '3px',
            border: `2px solid ${isChecked ? T.warning : T.panelBorder}`,
            background: isChecked ? T.warning : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {isChecked && (
            <i className="fas fa-check" style={{ fontSize: '10px', color: 'white' }}></i>
          )}
        </div>
        {/* ラジオボタン */}
        <div 
          onClick={onSelect}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '0.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            border: `2px solid ${isSelected ? T.accent : T.panelBorder}`,
            background: isSelected ? T.accent : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {isSelected && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
            )}
          </div>
          <div style={{
            fontSize: '9px',
            fontWeight: 700,
            color: rank === 1 ? '#ffd700' : (rank === 2 ? '#c0c0c0' : (rank === 3 ? '#cd7f32' : T.textMuted)),
          }}>
            #{rank}
          </div>
        </div>

        {/* 画像 */}
        <div 
          onClick={onSelect}
          style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', background: T.highlight, flexShrink: 0, cursor: 'pointer' }}
        >
          {item.image ? (
            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-image" style={{ fontSize: '12px', color: T.textSubtle }}></i>
            </div>
          )}
        </div>

        {/* 情報 */}
        <div onClick={onSelect} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
            {item.title || 'No title'}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: T.accent, marginBottom: '0.25rem' }}>
            ${item.priceNum.toFixed(2)}
          </div>
          <div style={{ fontSize: '8px', color: T.textMuted, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span><i className="fas fa-user" style={{ width: '10px' }}></i> {seller}</span>
            <span><i className="fas fa-star" style={{ width: '10px', color: T.warning }}></i> {feedbackScore.toLocaleString()}</span>
            <span style={{ color: quantityAvailable > 0 ? T.text : T.textSubtle }}>
              <i className="fas fa-box" style={{ width: '10px' }}></i> {quantityAvailable > 0 ? quantityAvailable : '-'}
            </span>
          </div>
        </div>

        {/* 除外ボタン */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleExclude(); }}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '9px',
            background: T.highlight,
            border: `1px solid ${T.panelBorder}`,
            borderRadius: '4px',
            cursor: 'pointer',
            color: T.error,
            alignSelf: 'flex-start',
          }}
          title="この商品を除外"
        >
          <i className="fas fa-ban"></i>
        </button>
      </div>

      {/* eBayリンク */}
      <a
        href={ebayUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'block',
          padding: '0.25rem',
          borderRadius: '4px',
          background: T.highlight,
          textAlign: 'center',
          fontSize: '8px',
          fontWeight: 600,
          color: T.accent,
          textDecoration: 'none',
        }}
      >
        <i className="fas fa-external-link-alt" style={{ marginRight: '0.25rem' }}></i>
        View on eBay
      </a>
    </div>
  );
}

// 除外済みアイテム行
function ExcludedRow({ item, onRestore, isManuallyExcluded }: {
  item: any;
  onRestore: () => void;
  isManuallyExcluded: boolean;
}) {
  return (
    <div style={{
      padding: '0.375rem 0.5rem',
      borderRadius: '4px',
      background: `${T.error}10`,
      border: `1px solid ${T.error}30`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      opacity: 0.7,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '9px', color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </div>
        <div style={{ fontSize: '10px', fontWeight: 600, color: T.error }}>
          ${item.priceNum?.toFixed(2) || '0.00'}
        </div>
      </div>
      {isManuallyExcluded && (
        <button
          onClick={onRestore}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '9px',
            background: T.success,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <i className="fas fa-undo"></i> 復元
        </button>
      )}
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

// ✅ SM分析の原産国・素材情報パネル + HTS表示
function SMAttributesPanel({ product, referenceItems }: { product: any; referenceItems: any[] }) {
  const listingData = product?.listing_data || {};
  
  // ✅ 保存済みのSM分析結果を優先使用（再計算しない）
  const smOriginCountry = listingData.sm_origin_country || null;
  const smMaterial = listingData.sm_material || null;
  const smBrand = listingData.sm_brand || null;
  const smCountryStats = listingData.sm_country_stats || {};
  const smMaterialStats = listingData.sm_material_stats || {};
  const smBrandStats = listingData.sm_brand_stats || {};
  
  // ✅ HTS・関税情報（AI判定結果）
  const htsCode = product?.hts_code || listingData.claude_analysis?.hts_code || null;
  const htsDescription = listingData.hts_description || listingData.claude_analysis?.hts_description || null;
  const dutyRate = product?.duty_rate || listingData.duty_rate || null;
  const veroRiskLevel = listingData.vero_risk_level || listingData.claude_analysis?.vero_risk_level || null;
  const htsSource = listingData.data_sources?.hts_code || null; // 'ai_claude', 'ai_gemini', 'manual'
  
  // ✅ origin_countryはトップレベルカラムも確認
  const originCountry = product?.origin_country || smOriginCountry || null;
  
  // 統計をソート（件数降順）
  const sortedCountries = Object.entries(smCountryStats).sort((a, b) => (b[1] as number) - (a[1] as number));
  const sortedMaterials = Object.entries(smMaterialStats).sort((a, b) => (b[1] as number) - (a[1] as number));
  const sortedBrands = Object.entries(smBrandStats).sort((a, b) => (b[1] as number) - (a[1] as number));
  
  const topCountry = originCountry || (sortedCountries[0]?.[0] || '-');
  const topMaterial = smMaterial || (sortedMaterials[0]?.[0] || '-');
  const topBrand = smBrand || (sortedBrands[0]?.[0] || '-');
  
  // データが全くない場合はプレースホルダー表示
  const hasSmData = smOriginCountry || smMaterial || Object.keys(smCountryStats).length > 0;
  const hasHtsData = htsCode;
  
  return (
    <div style={{
      marginBottom: '0.75rem',
      padding: '0.75rem',
      borderRadius: '6px',
      background: '#f0fdf4',
      border: '1px solid #86efac',
    }}>
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
        <i className="fas fa-globe" style={{ marginRight: '0.5rem' }}></i>
        原産国・素材・HTS情報
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {/* 原産国 */}
        <div style={{ padding: '0.5rem', borderRadius: '4px', background: 'white' }}>
          <div style={{ fontSize: '8px', color: T.textMuted, marginBottom: '0.25rem' }}>
            原産国
            {originCountry && <span style={{ marginLeft: '0.25rem', color: smOriginCountry ? '#10b981' : '#3b82f6' }}>
              {smOriginCountry ? '(SM)' : '(AI)'}
            </span>}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: topCountry !== '-' ? T.text : T.textSubtle }}>
            {topCountry}
          </div>
          {sortedCountries.length > 1 && (
            <div style={{ fontSize: '8px', color: T.textSubtle, marginTop: '0.25rem' }}>
              {sortedCountries.slice(0, 3).map(([c, n]) => `${c}(${n})`).join(', ')}
            </div>
          )}
        </div>
        
        {/* 素材 */}
        <div style={{ padding: '0.5rem', borderRadius: '4px', background: 'white' }}>
          <div style={{ fontSize: '8px', color: T.textMuted, marginBottom: '0.25rem' }}>
            素材
            {smMaterial && <span style={{ marginLeft: '0.25rem', color: '#10b981' }}>(SM)</span>}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: topMaterial !== '-' ? T.text : T.textSubtle }}>
            {topMaterial}
          </div>
          {sortedMaterials.length > 1 && (
            <div style={{ fontSize: '8px', color: T.textSubtle, marginTop: '0.25rem' }}>
              {sortedMaterials.slice(0, 3).map(([m, n]) => `${m}(${n})`).join(', ')}
            </div>
          )}
        </div>
        
        {/* HTSコード */}
        <div style={{ padding: '0.5rem', borderRadius: '4px', background: htsCode ? 'white' : '#fef3c7' }}>
          <div style={{ fontSize: '8px', color: T.textMuted, marginBottom: '0.25rem' }}>
            HTSコード
            {htsSource && <span style={{ marginLeft: '0.25rem', color: '#f97316' }}>({htsSource === 'ai_claude' ? 'AI' : htsSource})</span>}
          </div>
          <div style={{ 
            fontSize: htsCode ? '11px' : '10px', 
            fontWeight: 700, 
            fontFamily: htsCode ? 'monospace' : 'inherit',
            color: htsCode ? T.accent : T.warning 
          }}>
            {htsCode || 'AI判定必要'}
          </div>
          {htsDescription && (
            <div style={{ fontSize: '7px', color: T.textSubtle, marginTop: '0.25rem', lineHeight: 1.3 }}>
              {htsDescription.substring(0, 50)}...
            </div>
          )}
        </div>
        
        {/* 関税率・VERO */}
        <div style={{ padding: '0.5rem', borderRadius: '4px', background: 'white' }}>
          <div style={{ fontSize: '8px', color: T.textMuted, marginBottom: '0.25rem' }}>関税率 / VERO</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 700, 
              color: dutyRate ? (dutyRate > 10 ? T.error : T.success) : T.textSubtle 
            }}>
              {dutyRate ? `${dutyRate}%` : '-'}
            </span>
            {veroRiskLevel && (
              <span style={{ 
                fontSize: '9px', 
                fontWeight: 600,
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                background: veroRiskLevel === 'High' ? '#fee2e2' : (veroRiskLevel === 'Medium' ? '#fef3c7' : '#dcfce7'),
                color: veroRiskLevel === 'High' ? '#dc2626' : (veroRiskLevel === 'Medium' ? '#d97706' : '#16a34a'),
              }}>
                VERO: {veroRiskLevel}
              </span>
            )}
          </div>
          {!htsCode && (
            <div style={{ fontSize: '8px', color: T.warning, marginTop: '0.25rem' }}>
              → ToolsタブでAI分析
            </div>
          )}
        </div>
      </div>
      
      {/* ブランド（あれば表示） */}
      {topBrand !== '-' && (
        <div style={{ marginTop: '0.5rem', padding: '0.375rem 0.5rem', borderRadius: '4px', background: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '8px', color: T.textMuted }}>ブランド:</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: T.text }}>{topBrand}</span>
          {sortedBrands.length > 1 && (
            <span style={{ fontSize: '8px', color: T.textSubtle }}>
              (他: {sortedBrands.slice(1, 3).map(([b]) => b).join(', ')})
            </span>
          )}
        </div>
      )}
      
      {/* データがない場合のヒント */}
      {!hasSmData && !hasHtsData && (
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', background: '#fef3c7', border: '1px solid #fcd34d' }}>
          <div style={{ fontSize: '9px', color: '#92400e' }}>
            <i className="fas fa-info-circle" style={{ marginRight: '0.25rem' }}></i>
            SM分析を実行すると原産国・素材情報が取得されます。HTSはToolsタブの「Claude AI分析」で判定できます。
          </div>
        </div>
      )}
    </div>
  );
}
