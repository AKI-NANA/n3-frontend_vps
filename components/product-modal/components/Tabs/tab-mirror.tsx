'use client';

// TabMirror - V11.0 - URL登録機能追加
// デザインシステムV4準拠

import { useMemo, useEffect, useState, useCallback } from 'react';
import type { Product } from '@/types/product';
import { useMirrorSelectionStore } from '@/store/mirrorSelectionStore';
import { toast } from 'sonner';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444', purple: '#7c3aed',
  conditionNew: '#10b981', conditionUsed: '#f59e0b',
};

export interface TabMirrorProps {
  product: Product | null;
}

export function TabMirror({ product }: TabMirrorProps) {
  const { selectedItems, setSelectedItem, getSelectedByProduct } = useMirrorSelectionStore();
  const [dbSelectedItem, setDbSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // URL登録機能の状態
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [manualItems, setManualItems] = useState<any[]>([]);
  const [freshReferenceItems, setFreshReferenceItems] = useState<any[]>([]);

  // DBから選択済みアイテム + 手動追加アイテムを復元
  useEffect(() => {
    if (!product) return;

    const loadData = async () => {
      try {
        // 選択済みアイテムを復元
        const selectedResponse = await fetch(`/api/products/${product.id}/sm-selected-item`);
        const selectedResult = await selectedResponse.json();
        
        if (selectedResult.success && selectedResult.data) {
          setDbSelectedItem(selectedResult.data);
          console.log('✅ [Mirror] DB復元 (選択):', selectedResult.data.itemId);
        }

        // 最新の商品データをAPIから取得（手動追加アイテム含む）
        const productResponse = await fetch(`/api/products/${product.id}`);
        const productResult = await productResponse.json();
        
        if (productResult.success && productResult.data) {
          const freshProduct = productResult.data;
          const ebayData = freshProduct?.ebay_api_data || {};
          const listingRef = ebayData?.listing_reference || {};
          const refItems = listingRef?.referenceItems || [];
          
          // isManual: true のアイテムを手動追加リストに復元
          const manualFromDb = refItems.filter((item: any) => item.isManual === true);
          if (manualFromDb.length > 0) {
            setManualItems(manualFromDb);
            console.log('✅ [Mirror] DB復元 (手動追加):', manualFromDb.length, '件');
          }
          
          // 最新のreferenceItemsもstateに保存（propsの古いデータを上書き）
          setFreshReferenceItems(refItems.filter((item: any) => !item.isManual));
        }
      } catch (error) {
        console.error('❌ [Mirror] DB復元エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [product?.id]);

  // eBay URLからItem IDを抽出
  const extractItemId = useCallback((url: string): string | null => {
    // パターン1: https://www.ebay.com/itm/123456789
    // パターン2: https://www.ebay.com/itm/title-here/123456789
    // パターン3: https://www.ebay.com/itm/123456789?...
    const patterns = [
      /ebay\.com\/itm\/(\d+)/,
      /ebay\.com\/itm\/[^\/]+\/(\d+)/,
      /ebay\.com\/itm\/(\d+)\?/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }, []);

  // URLから商品情報を取得
  const handleFetchFromUrl = useCallback(async () => {
    if (!urlInput.trim()) {
      toast.error('URLを入力してください');
      return;
    }
    
    const legacyItemId = extractItemId(urlInput.trim());
    if (!legacyItemId) {
      toast.error('有効なeBay URLを入力してください');
      return;
    }
    
    setUrlLoading(true);
    console.log('🔍 [Mirror] URL取得開始:', legacyItemId);
    
    try {
      // Browse APIのItem IDフォーマット: v1|{legacyItemId}|0
      const itemId = `v1|${legacyItemId}|0`;
      
      const response = await fetch('/api/sellermirror/item-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });
      
      const result = await response.json();
      
      if (result.success && result.detailedItem) {
        const item = result.detailedItem;
        
        // 手動追加アイテムとして追加
        const newManualItem = {
          itemId: item.itemId,
          title: item.title,
          price: item.price,
          priceNum: parseFloat(item.price) || 0,
          currency: item.currency,
          condition: item.condition,
          conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
          categoryId: item.categoryId,
          categoryPath: item.categoryPath,
          image: item.image,
          seller: item.seller?.username || 'Unknown',
          sellerFeedbackScore: item.seller?.feedbackScore || 0,
          sellerFeedbackPercentage: item.seller?.feedbackPercentage || 0,
          shippingCost: item.shippingOptions?.[0]?.shippingCost || 0,
          quantityAvailable: item.quantityAvailable,
          quantitySold: item.quantitySold,
          itemWebUrl: item.itemWebUrl,
          itemSpecifics: item.itemSpecifics,
          hasDetails: true,
          isManual: true,  // 手動追加フラグ
        };
        
        setManualItems(prev => {
          // 重複チェック
          if (prev.some(i => i.itemId === newManualItem.itemId)) {
            toast.warning('この商品は既に追加されています');
            return prev;
          }
          return [...prev, newManualItem];
        });
        
        setUrlInput('');
        toast.success(`商品を追加・保存しました: ${item.title?.substring(0, 40)}...`);
        
        // DBにも保存（ebay_api_dataに追加）
        if (product?.id) {
          await saveManualItemToDb(product.id, newManualItem);
        }
        
      } else {
        toast.error(result.error || '商品情報の取得に失敗しました');
      }
    } catch (error: any) {
      console.error('❌ [Mirror] URL取得エラー:', error);
      toast.error(`取得エラー: ${error.message}`);
    } finally {
      setUrlLoading(false);
    }
  }, [urlInput, extractItemId, product?.id]);

  // 手動追加アイテムをDBに保存
  const saveManualItemToDb = async (productId: string | number, item: any) => {
    try {
      const response = await fetch(`/api/products/${productId}/sm-add-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })
      });
      
      const result = await response.json();
      if (!result.success) {
        console.error('❌ [Mirror] DB保存エラー:', result.error);
      } else {
        console.log('✅ [Mirror] DB保存成功');
      }
    } catch (error) {
      console.error('❌ [Mirror] DB保存例外:', error);
    }
  };

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  const ebayData = (product as any)?.ebay_api_data || {};
  const listingReference = ebayData?.listing_reference;
  const referenceItems = listingReference?.referenceItems || [];
  const categoryId = ebayData?.category_id || listingReference?.suggestedCategory;
  const categoryName = ebayData?.category_name || listingReference?.suggestedCategoryPath;

  // Store + DBから選択されたアイテムID
  const selectedItemIds = useMemo(() => {
    return getSelectedByProduct(product.id);
  }, [selectedItems, product.id, getSelectedByProduct]);

  const selectedItemId = dbSelectedItem?.itemId || (selectedItemIds.length > 0 ? selectedItemIds[0] : null);

  // 全アイテム = API取得（最新） + 手動追加
  const allItems = useMemo(() => {
    // freshReferenceItemsがあればそれを使用（最新データ）
    const apiItems = freshReferenceItems.length > 0 ? freshReferenceItems : referenceItems;
    const combined = [...apiItems, ...manualItems];
    return combined;
  }, [referenceItems, freshReferenceItems, manualItems]);

  // 価格でソート + コンディション別にグループ化
  const sortedItems = useMemo(() => {
    const items = allItems.map((item: any) => ({
      ...item,
      priceNum: parseFloat(item.price) || 0,
      conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
      feedbackScore: item.sellerFeedbackScore || item.seller?.feedbackScore || 0,
      feedbackPercentage: parseFloat(item.sellerFeedbackPercentage || item.seller?.feedbackPercentage || '0'),
      soldQuantity: item.soldQuantity || 0,
      quantityAvailable: item.quantityAvailable || null,
      sellerLocation: item.seller?.sellerBusinessType || item.location || 'Unknown',
    }));

    items.sort((a: any, b: any) => a.priceNum - b.priceNum);

    return items;
  }, [allItems]);

  const newItems = sortedItems.filter((item: any) => item.conditionNormalized === 'New');
  const usedItems = sortedItems.filter((item: any) => item.conditionNormalized === 'Used');

  const handleSelect = (item: any) => {
    const seller = typeof item.seller === 'string' ? item.seller : item.seller?.username || 'Unknown';
    
    console.log('🖱️ [TabMirror] Item selected:', {
      productId: product.id,
      itemId: item.itemId,
      title: item.title,
      price: item.price,
      condition: item.conditionNormalized,
    });

    // ✅ 即座にUI状態を更新
    const selectedData = {
      productId: product.id,
      itemId: item.itemId,
      title: item.title,
      price: item.priceNum,
      image: item.image,
      seller: seller,
      condition: item.conditionNormalized,
      hasDetails: item.hasDetails || false,
      itemSpecifics: item.itemSpecifics,
    };

    setSelectedItem(product.id, selectedData);
    
    // ✅ dbSelectedItemも即座に更新（UIが即反映されるように）
    setDbSelectedItem(selectedData);
    
    // DBにも保存
    saveSelectedItemToDb(product.id, item);
  };

  // 選択アイテムをDBに保存
  const saveSelectedItemToDb = async (productId: string | number, item: any) => {
    try {
      const response = await fetch(`/api/products/${productId}/sm-select-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemId: item.itemId,
          title: item.title,
          price: item.priceNum || item.price,
          image: item.image,
          seller: typeof item.seller === 'string' ? item.seller : item.seller?.username,
          condition: item.conditionNormalized,
          itemSpecifics: item.itemSpecifics,
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('✅ SM選択を保存しました');
      }
    } catch (error) {
      console.error('❌ [Mirror] 選択保存エラー:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
        読み込み中...
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      
      {/* ===== URL登録セクション ===== */}
      <div style={{
        marginBottom: '1rem',
        padding: '0.75rem',
        borderRadius: '6px',
        background: `${T.purple}10`,
        border: `1px solid ${T.purple}40`,
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: T.purple, marginBottom: '0.5rem' }}>
          <i className="fas fa-link" style={{ marginRight: '0.5rem' }}></i>
          eBay URLから直接登録
        </div>
        <div style={{ fontSize: '10px', color: T.textMuted, marginBottom: '0.5rem' }}>
          競合商品が見つからない場合、eBay商品ページのURLを直接入力して参照データを追加できます。
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://www.ebay.com/itm/..."
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '11px',
              border: `1px solid ${T.panelBorder}`,
              borderRadius: '4px',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFetchFromUrl();
              }
            }}
          />
          <button
            onClick={handleFetchFromUrl}
            disabled={urlLoading}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '11px',
              fontWeight: 600,
              background: urlLoading ? T.highlight : T.purple,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: urlLoading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {urlLoading ? (
              <><i className="fas fa-spinner fa-spin"></i> 取得中...</>
            ) : (
              <><i className="fas fa-plus"></i> 追加</>
            )}
          </button>
        </div>
      </div>

      {/* ===== データなしの場合 ===== */}
      {allItems.length === 0 && (
        <div style={{
          padding: '1rem',
          borderRadius: '6px',
          background: `${T.warning}15`,
          border: `1px solid ${T.warning}40`,
          textAlign: 'center',
        }}>
          <i className="fas fa-exclamation-triangle" style={{ color: T.warning, marginRight: '0.5rem' }}></i>
          <span style={{ fontSize: '11px', color: T.warning }}>
            Mirror分析データがありません。「ツール」タブからSM分析を実行するか、上のURL入力から直接追加してください。
          </span>
        </div>
      )}

      {/* ===== データありの場合 ===== */}
      {allItems.length > 0 && (
        <>
          {/* ヘッダー情報 */}
          <div style={{
            marginBottom: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            background: `${T.success}15`,
            border: `1px solid ${T.success}40`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '10px', color: T.success, fontWeight: 600 }}>
                ✅ Mirror分析データ: {allItems.length}件
                {manualItems.length > 0 && (
                  <span style={{ color: T.purple, marginLeft: '0.5rem' }}>
                    (手動追加: {manualItems.length}件)
                  </span>
                )}
              </div>
              <div style={{ fontSize: '9px', color: T.textMuted, marginTop: '0.25rem' }}>
                New: {newItems.length}件 / Used: {usedItems.length}件
              </div>
            </div>
            {selectedItemId && (
              <div style={{ fontSize: '9px', color: T.accent, fontWeight: 600 }}>
                ✓ SM選択済み
              </div>
            )}
          </div>

          {/* カテゴリ情報 */}
          {(categoryId || categoryName) && (
            <div style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle }}>
                Suggested Category
              </div>
              <div style={{ fontSize: '11px', color: T.text, marginTop: '0.25rem' }}>
                {categoryName || 'Unknown'} <span style={{ color: T.textMuted }}>({categoryId})</span>
              </div>
            </div>
          )}

          {/* New Condition */}
          {newItems.length > 0 && (
            <>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: T.conditionNew,
                marginBottom: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: `${T.conditionNew}15`,
                borderRadius: '4px',
                display: 'inline-block',
              }}>
                ✨ New Condition ({newItems.length}件)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                {newItems.map((item: any, idx: number) => (
                  <CompetitorCard
                    key={item.itemId || `new-${idx}`}
                    item={item}
                    isSelected={selectedItemId === item.itemId}
                    onSelect={() => handleSelect(item)}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </>
          )}

          {/* Used Condition */}
          {usedItems.length > 0 && (
            <>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: T.conditionUsed,
                marginBottom: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: `${T.conditionUsed}15`,
                borderRadius: '4px',
                display: 'inline-block',
              }}>
                📦 Used Condition ({usedItems.length}件)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {usedItems.map((item: any, idx: number) => (
                  <CompetitorCard
                    key={item.itemId || `used-${idx}`}
                    item={item}
                    isSelected={selectedItemId === item.itemId}
                    onSelect={() => handleSelect(item)}
                    rank={newItems.length + idx + 1}
                  />
                ))}
              </div>
            </>
          )}

          {/* 選択サマリー */}
          {selectedItemId && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: '6px',
              background: `${T.accent}10`,
              border: `2px solid ${T.accent}`,
            }}>
              {(() => {
                const selected = sortedItems.find((item: any) => item.itemId === selectedItemId);
                if (!selected) return null;
                
                return (
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: T.accent, marginBottom: '0.5rem' }}>
                      🎯 SM選択商品（詳細データ参照用）:
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', color: T.text }}>
                        {selected.title?.substring(0, 50)}...
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: T.accent }}>
                        ${selected.priceNum.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontSize: '9px', color: T.textMuted, marginTop: '0.25rem' }}>
                      Condition: {selected.conditionNormalized} | Seller: {typeof selected.seller === 'string' ? selected.seller : selected.seller?.username || 'Unknown'}
                    </div>
                    {/* Item Specifics表示 */}
                    {selected.itemSpecifics && Object.keys(selected.itemSpecifics).length > 0 && (
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${T.panelBorder}` }}>
                        <div style={{ fontSize: '9px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>
                          Item Specifics:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {Object.entries(selected.itemSpecifics).slice(0, 6).map(([key, value]) => (
                            <span key={key} style={{
                              fontSize: '8px',
                              padding: '0.125rem 0.25rem',
                              background: T.highlight,
                              borderRadius: '2px',
                              color: T.text,
                            }}>
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 競合商品カードコンポーネント
function CompetitorCard({ item, isSelected, onSelect, rank }: {
  item: any;
  isSelected: boolean;
  onSelect: () => void;
  rank: number;
}) {
  const seller = typeof item.seller === 'string' ? item.seller : item.seller?.username || item.seller || 'Unknown';
  const feedbackScore = item.feedbackScore || item.sellerFeedbackScore || 0;
  const feedbackPercentage = item.feedbackPercentage || parseFloat(item.sellerFeedbackPercentage || '0');
  const soldQuantity = item.soldQuantity || 0;
  const quantityAvailable = item.quantityAvailable;
  const sellerLocation = item.sellerLocation || item.seller?.sellerBusinessType || item.location || 'Unknown';
  const conditionColor = item.conditionNormalized === 'New' ? T.conditionNew : T.conditionUsed;
  const isManual = item.isManual;
  
  // ✅ Item Specifics件数を取得
  const itemSpecificsCount = item.itemSpecificsCount || 
    (item.itemSpecifics ? Object.keys(item.itemSpecifics).length : 0);
  const hasGoodSpecs = itemSpecificsCount >= 5;  // 5件以上あれば良好
  
  // eBay URLを生成
  const ebayUrl = item.itemWebUrl || `https://www.ebay.com/itm/${item.itemId?.split('|')[1] || ''}`;

  // ✅ 枠色: 選択済み（青）> 未選択（グレー）
  // 手動追加かどうかは枠色ではなくバッジで表示
  const borderColor = isSelected ? T.accent : T.panelBorder;

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '0.75rem',
        borderRadius: '6px',
        background: T.panel,
        border: `2px solid ${borderColor}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
        boxShadow: isSelected ? `0 4px 12px ${T.accent}40` : 'none',
      }}
    >
      {/* ランク表示 */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        left: '0.5rem',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: rank === 1 ? '#ffd700' : (rank === 2 ? '#c0c0c0' : (rank === 3 ? '#cd7f32' : T.highlight)),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 700,
        color: rank <= 3 ? '#fff' : T.text,
        zIndex: 1,
      }}>
        {rank}
      </div>

      {/* 手動追加バッジ */}
      {isManual && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          left: '2.5rem',
          padding: '0.125rem 0.375rem',
          borderRadius: '3px',
          background: T.purple,
          color: 'white',
          fontSize: '8px',
          fontWeight: 600,
        }}>
          手動
        </div>
      )}

      {/* ✅ Item Specifics件数バッジ */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        left: isManual ? '4.5rem' : '2.5rem',
        padding: '0.125rem 0.375rem',
        borderRadius: '3px',
        background: hasGoodSpecs ? T.success : (itemSpecificsCount > 0 ? T.warning : T.error),
        color: 'white',
        fontSize: '8px',
        fontWeight: 600,
      }}>
        {hasGoodSpecs ? '⭐' : ''} Specs: {itemSpecificsCount}
      </div>

      {/* 選択ラジオボタン */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: `2px solid ${isSelected ? T.accent : T.panelBorder}`,
        background: isSelected ? T.accent : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        {isSelected && (
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#fff',
          }} />
        )}
      </div>

      {/* 画像 */}
      <div style={{ aspectRatio: '4/3', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem', background: T.highlight }}>
        {item.image ? (
          <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-image" style={{ fontSize: '1.5rem', color: T.textSubtle }}></i>
          </div>
        )}
      </div>

      {/* タイトル */}
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        color: T.text,
        marginBottom: '0.5rem',
        lineHeight: 1.3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {item.title || 'No title'}
      </div>

      {/* 価格 + 配送料 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: T.accent }}>
          ${item.priceNum.toFixed(2)}
        </span>
        {item.shippingCost && (
          <span style={{ fontSize: '9px', color: T.textMuted, background: T.highlight, padding: '0.125rem 0.375rem', borderRadius: '3px' }}>
            +${item.shippingCost} ship
          </span>
        )}
      </div>

      {/* コンディション */}
      <div style={{
        fontSize: '9px',
        fontWeight: 600,
        color: conditionColor,
        background: `${conditionColor}15`,
        padding: '0.125rem 0.375rem',
        borderRadius: '3px',
        display: 'inline-block',
        marginBottom: '0.5rem',
      }}>
        {item.conditionNormalized}
      </div>

      {/* セラー情報 */}
      <div style={{ fontSize: '9px', color: T.textMuted, marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.125rem' }}>
          <i className="fas fa-user" style={{ width: '12px' }}></i>
          <span>{seller}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.125rem' }}>
          <i className="fas fa-star" style={{ width: '12px', color: T.warning }}></i>
          <span>{feedbackScore.toLocaleString()} ({feedbackPercentage.toFixed(1)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <i className="fas fa-box" style={{ width: '12px', color: quantityAvailable > 0 ? T.success : T.textSubtle }}></i>
          <span style={{ color: quantityAvailable > 0 ? T.text : T.textSubtle }}>
            {quantityAvailable > 0 ? `${quantityAvailable.toLocaleString()} available` : '- available'}
          </span>
        </div>
      </div>

      {/* eBayリンク */}
      <a
        href={ebayUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'block',
          padding: '0.375rem',
          borderRadius: '4px',
          background: T.highlight,
          textAlign: 'center',
          fontSize: '9px',
          fontWeight: 600,
          color: T.accent,
          textDecoration: 'none',
          marginBottom: isSelected ? '0.5rem' : 0,
        }}
      >
        <i className="fas fa-external-link-alt" style={{ marginRight: '0.25rem' }}></i>
        View on eBay
      </a>

      {/* 選択インジケーター */}
      {isSelected && (
        <div style={{
          padding: '0.375rem',
          borderRadius: '4px',
          background: `${T.accent}20`,
          textAlign: 'center',
          fontSize: '10px',
          fontWeight: 700,
          color: T.accent,
        }}>
          🎯 SM選択商品（詳細参照用）
        </div>
      )}
    </div>
  );
}
