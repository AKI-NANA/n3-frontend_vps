'use client';

// TabFinal - V10.0 - n8n統合対応
// 🔥 n8n経由で出品（USE_N8N=trueの場合）
// 🔥 HTMLがない場合は生成ボタンを表示
// デザインシステムV4準拠 + N3コンポーネント使用

import { useState, useEffect, memo } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';
import { N3Button, N3Badge, N3SectionCard, N3StatBox, N3StatGrid } from '@/components/n3';
import { Rocket, Eye, Clock, AlertTriangle, CheckCircle, XCircle, Loader2, FileText, Zap } from 'lucide-react';
import { N8nListingService } from '@/lib/services/n8n';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444',
};

export interface TabFinalProps {
  product: Product | null;
  marketplace: string;
  marketplaceName: string;
  onSave?: (updates: any) => void;
}

export const TabFinal = memo(function TabFinal({ product, marketplace, marketplaceName, onSave }: TabFinalProps) {
  const [publishing, setPublishing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [hasHtml, setHasHtml] = useState<boolean | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [generatingHtml, setGeneratingHtml] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('mjt');
  const [selectedMarketplace, setSelectedMarketplace] = useState('EBAY_US');

  // アカウント・マーケットプレイスのオプション
  const accounts = [
    { value: 'mjt', label: 'MJT Account' },
    { value: 'green', label: 'Green Account' },
    { value: 'mystical-japan-treasures', label: 'Mystical Japan Treasures' },
  ];

  const marketplaces = [
    { value: 'EBAY_US', label: 'eBay US' },
    { value: 'EBAY_UK', label: 'eBay UK' },
    { value: 'EBAY_DE', label: 'eBay Germany' },
    { value: 'EBAY_AU', label: 'eBay Australia' },
  ];

  // 🔥 HTML生成関数
  const generateHTML = async () => {
    if (!product?.id) return;
    
    setGeneratingHtml(true);
    try {
      const response = await fetch('/api/tools/html-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [product.id] })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('✅ HTML生成完了');
        // 再チェック
        checkHtml();
      } else {
        throw new Error(result.error || 'HTML生成失敗');
      }
    } catch (err: any) {
      console.error('[TabFinal] HTML生成エラー:', err);
      toast.error(`HTML生成エラー: ${err.message}`);
    } finally {
      setGeneratingHtml(false);
    }
  };

  // 🔥 HTML存在確認（改善版）
  const checkHtml = async () => {
    if (!product?.id) {
      setHasHtml(false);
      return;
    }

    try {
      // API経由でHTML取得
      const response = await fetch(`/api/products/${product.id}/html?marketplace=ebay`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.html || data.generated_html) {
          setHasHtml(true);
          setHtmlContent(data.html || data.generated_html);
          console.log('✅ [TabFinal] HTML存在確認 (API経由)');
          return;
        }
      }
      
      // フォールバック: listing_dataから確認
      const listingData = (product as any)?.listing_data || {};
      const htmlInData = listingData.html_description || 
                        listingData.html_description_en || 
                        listingData.description_html;
      
      if (htmlInData) {
        setHasHtml(true);
        setHtmlContent(htmlInData);
        console.log('✅ [TabFinal] HTML存在確認 (listing_data)');
      } else {
        setHasHtml(false);
        console.log('⚠️ [TabFinal] HTMLなし - 生成が必要');
      }
    } catch (err) {
      console.warn('[TabFinal] HTML確認失敗:', err);
      setHasHtml(false);
    }
  };

  // 初回チェック
  useEffect(() => {
    checkHtml();
  }, [product?.id, product]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  // ==========================================
  // 🔥 データソース - 複数の場所から取得
  // ==========================================
  const listingData = (product as any)?.listing_data || {};
  const ebayApiData = (product as any)?.ebay_api_data || {};
  const scrapedData = (product as any)?.scraped_data || {};

  // 英語タイトル（複数ソース）
  const englishTitle = 
    (product as any)?.english_title || 
    listingData.english_title || 
    product?.title || 
    '';

  // SKU
  const sku = product?.sku || '';

  // 利益（複数ソース）
  const profitAmount = 
    parseFloat((product as any)?.profit_amount_usd) || 
    parseFloat(listingData.profit_amount_usd) || 
    0;

  const profitMargin = 
    parseFloat((product as any)?.profit_margin) || 
    parseFloat(listingData.profit_margin) || 
    0;

  // カテゴリ（複数ソース）
  const categoryId = 
    ebayApiData.category_id || 
    listingData.category_id || 
    listingData.ebay_category_id ||
    (product as any)?.ebay_category_id ||
    (product as any)?.category_id ||
    '';

  // HTML説明（非同期取得 or listing_data）
  const htmlDescription = htmlContent || listingData.html_description || '';

  // 数量
  const quantity = 
    (product as any)?.stock?.available || 
    listingData.quantity || 
    1;

  // 価格（複数ソース）
  const priceUsd = 
    parseFloat(listingData.ddp_price_usd) || 
    parseFloat((product as any)?.ddp_price_usd) || 
    parseFloat((product as any)?.price_usd) || 
    0;

  // 配送サービス（複数ソース）
  const shippingService = 
    listingData.shipping_service || 
    listingData.usa_shipping_policy_name ||
    listingData.carrier_service ||
    (product as any)?.shipping_policy ||
    '';

  // 画像（複数ソース）
  const imageUrls = 
    listingData.image_urls || 
    (product as any)?.image_urls ||
    (product as any)?.images ||
    scrapedData.images ||
    [];

  // 既存の出品ID
  const existingListingId = (product as any)?.ebay_listing_id || listingData.ebay_listing_id;

  // ==========================================
  // 🔥 バリデーション
  // ==========================================
  const validation = {
    hasTitle: englishTitle.length > 0,
    hasSKU: sku.length > 0,
    hasPrice: priceUsd > 0,
    hasProfit: profitAmount > 0,
    hasCategory: !!categoryId,
    hasShipping: !!shippingService,
    hasHTML: hasHtml === true,
    hasImages: Array.isArray(imageUrls) && imageUrls.length > 0,
  };

  const allValid = Object.values(validation).every(v => v);
  const isProfitable = profitAmount > 0;
  const validCount = Object.values(validation).filter(v => v).length;
  const totalCount = Object.keys(validation).length;

  // n8n使用フラグ
  const useN8n = process.env.NEXT_PUBLIC_USE_N8N === 'true';

  // 即時出品ハンドラー（n8n対応）
  const handlePublish = async () => {
    if (!allValid) {
      toast.error('必須項目が不足しています');
      return;
    }
    
    if (!isProfitable) {
      const confirmed = window.confirm('⚠️ 利益がマイナスです。本当に出品しますか？');
      if (!confirmed) return;
    }

    if (existingListingId) {
      const confirmed = window.confirm(`⚠️ この商品は既に出品済みです（ID: ${existingListingId}）。再出品しますか？`);
      if (!confirmed) return;
    }

    setPublishing(true);
    
    try {
      const euInfo = {
        eu_responsible_company_name: listingData.eu_responsible_company_name,
        eu_responsible_address_line1: listingData.eu_responsible_address_line1,
        eu_responsible_address_line2: listingData.eu_responsible_address_line2,
        eu_responsible_city: listingData.eu_responsible_city,
        eu_responsible_state_or_province: listingData.eu_responsible_state_or_province,
        eu_responsible_postal_code: listingData.eu_responsible_postal_code,
        eu_responsible_country: listingData.eu_responsible_country,
        eu_responsible_email: listingData.eu_responsible_email,
        eu_responsible_phone: listingData.eu_responsible_phone,
        eu_responsible_contact_url: listingData.eu_responsible_contact_url,
      };

      // 🔥 n8n経由で出品（USE_N8N=trueの場合）
      if (useN8n) {
        console.log('[Publish] Using n8n backend...');
        const n8nResult = await N8nListingService.publishNow({
          productId: product.id,
          action: 'list_now',
          target: 'ebay',
          account: selectedAccount,
          marketplace: selectedMarketplace,
          options: {
            title: englishTitle,
            description: htmlDescription,
            price: priceUsd,
            quantity: quantity,
            categoryId: categoryId,
            sku: sku,
            brand: (product as any)?.brand || listingData.brand || listingData.manufacturer || '',
            manufacturer: (product as any)?.manufacturer || listingData.manufacturer || listingData.brand || '',
            imageUrls: imageUrls,
            condition: listingData.condition || 'USED_EXCELLENT',
            ...euInfo,
          },
        });

        if (n8nResult.success) {
          toast.success('🚀 n8n経由で出品リクエストを送信しました！');
          toast.info(`ジョブID: ${n8nResult.jobId}`);
          
          // n8nは非同期処理なので、ジョブIDを保存
          onSave?.({
            listing_data: {
              ...listingData,
              n8n_job_id: n8nResult.jobId,
              listing_status: 'processing',
              submitted_at: new Date().toISOString(),
            }
          });
        } else {
          throw new Error(n8nResult.error || 'n8n出品リクエスト失敗');
        }
      } else {
        // 🔥 従来のAPI直接呼び出し（フォールバック）
        console.log('[Publish] Using internal API backend...');
        const response = await fetch('/api/ebay/create-listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            title: englishTitle,
            description: htmlDescription,
            price: priceUsd,
            quantity: quantity,
            category: categoryId,
            sku: sku,
            brand: (product as any)?.brand || listingData.brand || listingData.manufacturer || '',
            manufacturer: (product as any)?.manufacturer || listingData.manufacturer || listingData.brand || '',
            imageUrls: imageUrls,
            condition: listingData.condition || 'USED_EXCELLENT',
            accountId: selectedAccount,
            marketplace: selectedMarketplace,
            ...euInfo,
          })
        });

        const result = await response.json();

        if (result.success) {
          toast.success('🚀 出品が完了しました！');
          
          const listingId = result.data?.listingId || result.data?.ItemID || result.data?.inventoryItemGroupKey;
          if (listingId) {
            onSave?.({
              ebay_listing_id: listingId,
              listing_data: {
                ...listingData,
                ebay_listing_id: listingId,
                listed_at: new Date().toISOString(),
                listing_status: 'active',
              }
            });
            toast.info(`出品ID: ${listingId}`);
          }
        } else {
          console.error('[Publish] API Response:', JSON.stringify(result, null, 2));
          let errorMessage = result.error || '出品に失敗しました';
          
          if (result.step) {
            switch (result.step) {
              case 'INVENTORY_ITEM_CREATION':
                errorMessage = `在庫アイテム作成失敗: ${result.errorMessage || result.error}`;
                break;
              case 'OFFER_CREATION':
                errorMessage = `オファー作成失敗: ${result.errorMessage || result.error}`;
                break;
              case 'PUBLISH':
                errorMessage = `出品実行失敗: ${result.errorMessage || result.error}`;
                break;
            }
          }
          
          if (result.missing) {
            const missingPolicies = Object.entries(result.missing)
              .filter(([_, v]) => v)
              .map(([k]) => k);
            if (missingPolicies.length > 0) {
              errorMessage = `ポリシー未設定: ${missingPolicies.join(', ')}`;
            }
          }
          
          throw new Error(errorMessage);
        }
      }
    } catch (error: any) {
      console.error('[Publish] Error:', error);
      toast.error(`出品エラー: ${error.message}`);
    } finally {
      setPublishing(false);
    }
  };

  const handlePreview = () => {
    if (existingListingId) {
      window.open(`https://www.ebay.com/itm/${existingListingId}`, '_blank');
    } else {
      toast.info('出品完了後にプレビューできます');
    }
  };

  const handleSchedule = () => {
    toast.info('スケジュール出品機能は現在開発中です');
  };

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 200px', gap: '1rem', height: '100%' }}>
        
        {/* 左: チェックリスト */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <N3SectionCard title={`Validation (${validCount}/${totalCount})`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <CheckRow label="English Title" ok={validation.hasTitle} value={englishTitle ? `${englishTitle.substring(0, 20)}...` : ''} />
              <CheckRow label="SKU" ok={validation.hasSKU} value={sku} />
              <CheckRow label="Price (USD)" ok={validation.hasPrice} value={priceUsd > 0 ? `$${priceUsd.toFixed(2)}` : ''} />
              <CheckRow label="Profit > 0" ok={validation.hasProfit} value={profitAmount > 0 ? `$${profitAmount.toFixed(2)}` : ''} />
              <CheckRow label="Category" ok={validation.hasCategory} value={categoryId} />
              <CheckRow label="Shipping" ok={validation.hasShipping} value={shippingService ? shippingService.substring(0, 15) : ''} />
              <CheckRow 
                label="HTML Description" 
                ok={validation.hasHTML} 
                value={hasHtml === null ? 'Checking...' : hasHtml ? '✓' : 'Generate'} 
                loading={hasHtml === null}
              />
              <CheckRow label="Images" ok={validation.hasImages} value={imageUrls?.length ? `${imageUrls.length}枚` : ''} />
            </div>
          </N3SectionCard>

          {/* 🔥 HTML生成ボタン（HTMLがない場合のみ表示） */}
          {hasHtml === false && (
            <N3Button
              variant="warning"
              onClick={generateHTML}
              disabled={generatingHtml}
              loading={generatingHtml}
              leftIcon={<FileText size={14} />}
              fullWidth
              size="sm"
            >
              {generatingHtml ? 'Generating...' : 'Generate HTML'}
            </N3Button>
          )}

          {/* Status */}
          <div style={{
            padding: '0.75rem',
            borderRadius: '6px',
            background: allValid ? `${T.success}15` : `${T.error}15`,
            border: `1px solid ${allValid ? T.success : T.error}40`,
          }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 600, 
              color: allValid ? T.success : T.error, 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem'
            }}>
              {hasHtml === null ? (
                <><Loader2 size={14} className="animate-spin" /> Checking...</>
              ) : allValid ? (
                <><CheckCircle size={14} /> Ready to List</>
              ) : (
                <><XCircle size={14} /> Not Ready</>
              )}
            </div>
          </div>

          {existingListingId && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '6px',
              background: `${T.accent}10`,
              border: `1px solid ${T.accent}40`,
            }}>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', color: T.accent, marginBottom: '0.25rem' }}>
                Existing Listing
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: T.text, fontFamily: 'monospace' }}>
                {existingListingId}
              </div>
            </div>
          )}
        </div>

        {/* 中央: プレビュー */}
        <N3SectionCard title="Listing Preview">
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
            <div style={{ aspectRatio: '1', borderRadius: '6px', background: T.highlight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imageUrls?.[0] ? (
                <img src={imageUrls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
              ) : (
                <i className="fas fa-image" style={{ fontSize: '2rem', color: T.textSubtle }}></i>
              )}
            </div>
            
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: T.text, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {englishTitle || 'No title'}
              </div>
              <div style={{ fontSize: '10px', color: T.textMuted, marginBottom: '0.5rem' }}>
                SKU: {sku}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: T.accent }}>
                  ${priceUsd.toFixed(2)}
                </span>
                <N3Badge variant={profitMargin >= 15 ? 'success' : 'warning'} size="xs">
                  {profitMargin.toFixed(1)}% margin
                </N3Badge>
              </div>
              <div style={{ fontSize: '10px', color: T.textMuted }}>
                Profit: <span style={{ color: profitAmount > 0 ? T.success : T.error, fontWeight: 600 }}>${profitAmount.toFixed(2)}</span>
              </div>
              {categoryId && (
                <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '0.25rem' }}>
                  Category: {categoryId}
                </div>
              )}
              {shippingService && (
                <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '0.25rem' }}>
                  Shipping: {shippingService}
                </div>
              )}
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '0.5rem',
            borderRadius: '4px',
            background: T.highlight,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <i className="fab fa-ebay" style={{ fontSize: '14px', color: '#0064d2' }}></i>
            <span style={{ fontSize: '11px', fontWeight: 600, color: T.text }}>{marketplaceName}</span>
            {existingListingId && (
              <N3Badge variant="info" size="xs">Listed</N3Badge>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <N3StatGrid columns={4} gap="0.5rem">
              <N3StatBox label="Qty" value={quantity} size="sm" />
              <N3StatBox 
                label="Filter" 
                value={listingData.filter_passed === true ? '✓' : listingData.filter_passed === false ? '✗' : '-'} 
                size="sm"
                color={listingData.filter_passed === true ? T.success : listingData.filter_passed === false ? T.error : undefined}
              />
              <N3StatBox 
                label="VERO" 
                value={listingData.vero_risk_level || '-'} 
                size="sm"
                color={listingData.vero_risk_level === 'High' ? T.error : listingData.vero_risk_level === 'Medium' ? T.warning : undefined}
              />
              <N3StatBox 
                label="HTS" 
                value={(product as any)?.hts_code ? '✓' : '-'} 
                size="sm"
                color={(product as any)?.hts_code ? T.success : undefined}
              />
            </N3StatGrid>
          </div>
        </N3SectionCard>

        {/* 右: アクション */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* アカウント選択 */}
          <div>
            <label style={{ fontSize: '10px', color: T.textMuted, marginBottom: '0.25rem', display: 'block' }}>
              Account
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '11px',
                borderRadius: '4px',
                border: `1px solid ${T.panelBorder}`,
                background: T.panel,
                color: T.text,
                cursor: 'pointer',
              }}
            >
              {accounts.map(acc => (
                <option key={acc.value} value={acc.value}>{acc.label}</option>
              ))}
            </select>
          </div>

          {/* マーケットプレイス選択 */}
          <div>
            <label style={{ fontSize: '10px', color: T.textMuted, marginBottom: '0.25rem', display: 'block' }}>
              Marketplace
            </label>
            <select
              value={selectedMarketplace}
              onChange={(e) => setSelectedMarketplace(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '11px',
                borderRadius: '4px',
                border: `1px solid ${T.panelBorder}`,
                background: T.panel,
                color: T.text,
                cursor: 'pointer',
              }}
            >
              {marketplaces.map(mp => (
                <option key={mp.value} value={mp.value}>{mp.label}</option>
              ))}
            </select>
          </div>

          <N3Button
            variant={allValid ? 'success' : 'secondary'}
            onClick={handlePublish}
            disabled={!allValid || publishing}
            loading={publishing}
            leftIcon={<Rocket size={14} />}
            fullWidth
          >
            {publishing ? 'Publishing...' : existingListingId ? 'Re-publish' : 'Publish'}
          </N3Button>

          <N3Button
            variant="ghost"
            onClick={handlePreview}
            leftIcon={<Eye size={14} />}
            fullWidth
            disabled={!existingListingId}
          >
            Preview on eBay
          </N3Button>

          <N3Button
            variant="ghost"
            onClick={handleSchedule}
            leftIcon={<Clock size={14} />}
            fullWidth
          >
            Schedule
          </N3Button>

          {!isProfitable && (
            <div style={{
              marginTop: 'auto',
              padding: '0.5rem',
              borderRadius: '4px',
              background: `${T.error}15`,
              border: `1px solid ${T.error}40`,
              fontSize: '9px',
              color: T.error,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
            }}>
              <AlertTriangle size={12} /> Negative profit
            </div>
          )}

          {listingData.filter_passed === false && (
            <div style={{
              padding: '0.5rem',
              borderRadius: '4px',
              background: `${T.warning}15`,
              border: `1px solid ${T.warning}40`,
              fontSize: '9px',
              color: T.warning,
              textAlign: 'center',
            }}>
              ⚠️ Filter check failed
            </div>
          )}

          {listingData.vero_risk_level === 'High' && (
            <div style={{
              padding: '0.5rem',
              borderRadius: '4px',
              background: `${T.error}15`,
              border: `1px solid ${T.error}40`,
              fontSize: '9px',
              color: T.error,
              textAlign: 'center',
            }}>
              🚫 High VERO Risk
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

function CheckRow({ label, ok, value, loading }: { label: string; ok: boolean; value?: string; loading?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
      <span style={{ color: T.textMuted }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {value && <span style={{ fontSize: '8px', color: T.textSubtle, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>}
        {loading ? (
          <Loader2 size={12} className="animate-spin" style={{ color: T.accent }} />
        ) : (
          <span style={{ color: ok ? T.success : T.error, fontWeight: 600 }}>
            {ok ? <CheckCircle size={12} /> : <XCircle size={12} />}
          </span>
        )}
      </div>
    </div>
  );
}
