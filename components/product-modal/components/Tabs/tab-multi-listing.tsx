/**
 * TabMultiListing - 多販路一括出品タブ
 * 
 * 機能:
 * - マーケットプレイス選択（チェックボックス）
 * - 一括利益計算
 * - 利益比較マトリックス表示
 * - 下書き保存 / スケジュール / 即時出品
 */

'use client';

import { useState, useCallback, memo } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';
import { 
  Calculator, 
  Save, 
  Clock, 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Loader2,
  TrendingUp,
  TrendingDown,
  Store,
  AlertTriangle
} from 'lucide-react';
import type { 
  MarketplaceId, 
  PricingResult 
} from '@/lib/marketplace/multi-marketplace-types';
import { 
  MARKETPLACE_CONFIGS, 
  PRIORITY_MARKETPLACES,
  getEnabledMarketplaces
} from '@/lib/marketplace/marketplace-configs';

// =====================================================
// スタイル定数
// =====================================================
const T = {
  bg: '#F1F5F9',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  highlight: '#f1f5f9',
  text: '#1e293b',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  qoo10: '#ff0066',
  shopee: '#ee4d2d',
  amazon: '#ff9900',
  ebay: '#0064d2',
};

// マーケットプレイスのカラー
const MP_COLORS: Record<string, string> = {
  ebay_us: '#0064d2',
  ebay_uk: '#0064d2',
  ebay_de: '#0064d2',
  ebay_au: '#0064d2',
  qoo10_jp: '#ff0066',
  qoo10_sg: '#ff0066',
  amazon_jp: '#ff9900',
  amazon_us: '#ff9900',
  shopee_sg: '#ee4d2d',
  shopee_my: '#ee4d2d',
  shopee_th: '#ee4d2d',
};

// =====================================================
// Props定義
// =====================================================
export interface TabMultiListingProps {
  product: Product | null;
  onSave?: (updates: any) => void;
  onRefresh?: () => void;
}

// =====================================================
// メインコンポーネント
// =====================================================
export const TabMultiListing = memo(function TabMultiListing({ 
  product, 
  onSave,
  onRefresh 
}: TabMultiListingProps) {
  // ステート
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<MarketplaceId[]>(['ebay_us', 'qoo10_jp']);
  const [pricingResults, setPricingResults] = useState<PricingResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  
  // 商品データ（拡張型対応）
  const costPriceJpy = 
    (product as any)?.purchase_price_jpy ||  // 新型定義
    (product as any)?.price_jpy || 
    (product as any)?.cost_price_jpy || 
    (product as any)?.cost ||
    (product as any)?.scraped_data?.price ||  // 仕入れ先データから
    0;
  const weightGrams = (product as any)?.weight_g || (product as any)?.weight_grams || 500;
  const englishTitle = (product as any)?.english_title || product?.title || '';
  const japaneseTitle = (product as any)?.japanese_title || (product as any)?.title_ja || '';
  const imageUrls = 
    product?.selectedImages || 
    (product as any)?.image_urls || 
    (product as any)?.gallery_images || 
    product?.images?.map(img => img.url) ||
    [];
  
  // 有効なマーケットプレイス
  const enabledMarketplaces = getEnabledMarketplaces();
  
  // =====================================================
  // マーケットプレイス選択
  // =====================================================
  const toggleMarketplace = useCallback((mpId: MarketplaceId) => {
    setSelectedMarketplaces(prev => {
      if (prev.includes(mpId)) {
        return prev.filter(id => id !== mpId);
      } else {
        return [...prev, mpId];
      }
    });
  }, []);
  
  const selectAllMarketplaces = useCallback(() => {
    setSelectedMarketplaces(enabledMarketplaces.map(mp => mp.id));
  }, [enabledMarketplaces]);
  
  const clearSelection = useCallback(() => {
    setSelectedMarketplaces([]);
  }, []);
  
  // =====================================================
  // 一括利益計算
  // =====================================================
  const handleCalculate = useCallback(async () => {
    if (!product?.id || costPriceJpy <= 0) {
      toast.error('商品データまたは仕入れ価格がありません');
      return;
    }
    
    if (selectedMarketplaces.length === 0) {
      toast.error('計算するマーケットプレイスを選択してください');
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const response = await fetch('/api/v2/pricing/multi-marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costPriceJpy,
          weightGrams,
          targetMarketplaces: selectedMarketplaces,
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPricingResults(result.results);
        toast.success(`${result.results.length}件のマーケットプレイスを計算しました`);
        
        if (result.bestMarketplace) {
          const bestConfig = MARKETPLACE_CONFIGS[result.bestMarketplace as MarketplaceId];
          toast.info(`最高利益: ${bestConfig?.displayName} (¥${Math.round(result.summary.maxProfitJpy).toLocaleString()})`);
        }
      } else {
        throw new Error(result.error || '計算に失敗しました');
      }
    } catch (error: any) {
      console.error('[TabMultiListing] 計算エラー:', error);
      toast.error(`計算エラー: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  }, [product?.id, costPriceJpy, weightGrams, selectedMarketplaces]);
  
  // =====================================================
  // キューに保存
  // =====================================================
  const saveToQueue = useCallback(async (status: 'draft' | 'scheduled' | 'pending') => {
    if (!product?.id) {
      toast.error('商品が選択されていません');
      return;
    }
    
    if (pricingResults.length === 0) {
      toast.error('先に利益計算を実行してください');
      return;
    }
    
    if (status === 'scheduled' && !scheduleDate) {
      toast.error('スケジュール日時を選択してください');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const profitMap = pricingResults.reduce((acc, r) => {
        acc[r.marketplace] = r;
        return acc;
      }, {} as Record<string, PricingResult>);
      
      const response = await fetch('/api/v2/listing-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productMasterId: product.id,
          marketplaces: selectedMarketplaces,
          status,
          scheduledAt: status === 'scheduled' ? new Date(scheduleDate).toISOString() : undefined,
          listingData: {
            title: englishTitle,
            images: imageUrls,
            sku: product.sku,
          },
          profitCalculation: profitMap,
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const messages = {
          draft: '下書きを保存しました',
          scheduled: `${new Date(scheduleDate).toLocaleString('ja-JP')} に出品をスケジュールしました`,
          pending: '出品キューに追加しました（まもなく実行されます）',
        };
        toast.success(messages[status]);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(`保存エラー: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [product?.id, product?.sku, selectedMarketplaces, pricingResults, englishTitle, imageUrls, scheduleDate]);
  
  // =====================================================
  // 商品がない場合
  // =====================================================
  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
        商品データがありません
      </div>
    );
  }
  
  // =====================================================
  // 利益計算結果をソート（利益順）
  // =====================================================
  const sortedResults = [...pricingResults].sort((a, b) => b.profitJpy - a.profitJpy);
  const maxProfitJpy = sortedResults[0]?.profitJpy || 0;
  
  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>
        
        {/* ================================ */}
        {/* 左サイドバー: マーケットプレイス選択 */}
        {/* ================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* 商品情報 */}
          <Card title="商品情報">
            <div style={{ fontSize: '10px', color: T.textMuted, marginBottom: '0.25rem' }}>
              SKU: {product.sku || '-'}
            </div>
            <div style={{ fontSize: '11px', color: T.text, fontWeight: 500, marginBottom: '0.25rem', lineHeight: 1.3 }}>
              {(japaneseTitle || englishTitle).substring(0, 50)}{(japaneseTitle || englishTitle).length > 50 ? '...' : ''}
            </div>
            {japaneseTitle && englishTitle && (
              <div style={{ fontSize: '9px', color: T.textSubtle, marginBottom: '0.5rem' }}>
                EN: {englishTitle.substring(0, 30)}...
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <StatBox 
                label="仕入値" 
                value={costPriceJpy > 0 ? `¥${costPriceJpy.toLocaleString()}` : '未設定'} 
              />
              <StatBox label="重量" value={`${weightGrams}g`} />
            </div>
            {costPriceJpy <= 0 && (
              <div style={{ 
                marginTop: '0.5rem', 
                padding: '0.375rem', 
                background: `${T.warning}15`, 
                borderRadius: '4px',
                fontSize: '9px',
                color: T.warning,
              }}>
                ⚠️ 仕入れ価格が未設定です
              </div>
            )}
          </Card>
          
          {/* マーケットプレイス選択 */}
          <Card title="マーケットプレイス選択">
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <MiniButton onClick={selectAllMarketplaces}>全選択</MiniButton>
              <MiniButton onClick={clearSelection}>クリア</MiniButton>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '250px', overflow: 'auto' }}>
              {enabledMarketplaces.map(mp => {
                const isSelected = selectedMarketplaces.includes(mp.id);
                const color = MP_COLORS[mp.id] || T.accent;
                
                return (
                  <label
                    key={mp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.5rem',
                      borderRadius: '4px',
                      background: isSelected ? `${color}15` : T.highlight,
                      border: `1px solid ${isSelected ? color : 'transparent'}`,
                      cursor: 'pointer',
                      fontSize: '10px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMarketplace(mp.id)}
                      style={{ accentColor: color }}
                    />
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: color,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? color : T.text }}>
                      {mp.displayName}
                    </span>
                    <span style={{ marginLeft: 'auto', color: T.textSubtle, fontSize: '8px' }}>
                      {mp.currency}
                    </span>
                  </label>
                );
              })}
            </div>
            
            <div style={{ 
              marginTop: '0.5rem', 
              padding: '0.375rem', 
              background: T.highlight, 
              borderRadius: '4px',
              fontSize: '10px',
              color: T.textMuted,
              textAlign: 'center',
            }}>
              {selectedMarketplaces.length}件選択中
            </div>
          </Card>
          
          {/* 計算ボタン */}
          <button
            onClick={handleCalculate}
            disabled={isCalculating || selectedMarketplaces.length === 0}
            style={{
              padding: '0.625rem 1rem',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              background: T.accent,
              color: '#fff',
              cursor: selectedMarketplaces.length > 0 ? 'pointer' : 'not-allowed',
              opacity: selectedMarketplaces.length > 0 ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {isCalculating ? (
              <><Loader2 size={14} className="animate-spin" /> 計算中...</>
            ) : (
              <><Calculator size={14} /> 一括利益計算</>
            )}
          </button>
        </div>
        
        {/* ================================ */}
        {/* 右メインエリア: 計算結果 */}
        {/* ================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* 計算結果がない場合 */}
          {pricingResults.length === 0 ? (
            <Card title="利益比較マトリックス">
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                color: T.textMuted,
                fontSize: '12px',
              }}>
                <Store size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <div>マーケットプレイスを選択して「一括利益計算」をクリック</div>
              </div>
            </Card>
          ) : (
            <>
              {/* サマリー */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '0.5rem' 
              }}>
                <SummaryCard 
                  label="計算件数" 
                  value={`${pricingResults.length}件`}
                  icon={<Store size={14} />}
                />
                <SummaryCard 
                  label="黒字" 
                  value={`${pricingResults.filter(r => r.isProfitable).length}件`}
                  color={T.success}
                  icon={<TrendingUp size={14} />}
                />
                <SummaryCard 
                  label="最高利益" 
                  value={`¥${Math.round(maxProfitJpy).toLocaleString()}`}
                  color={T.success}
                  icon={<TrendingUp size={14} />}
                />
                <SummaryCard 
                  label="ベスト" 
                  value={sortedResults[0]?.marketplaceName || '-'}
                  color={MP_COLORS[sortedResults[0]?.marketplace] || T.accent}
                />
              </div>
              
              {/* 利益比較テーブル */}
              <Card title="利益比較マトリックス">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                    <thead>
                      <tr style={{ background: T.highlight }}>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>マーケットプレイス</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>販売価格</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>送料</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>手数料</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>利益 (JPY)</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>利益率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedResults.map((result, index) => {
                        const color = MP_COLORS[result.marketplace] || T.accent;
                        const isTop = index === 0;
                        
                        return (
                          <tr 
                            key={result.marketplace}
                            style={{ 
                              background: isTop ? `${T.success}10` : 'transparent',
                              borderBottom: `1px solid ${T.panelBorder}`,
                            }}
                          >
                            <td style={tdStyle}>
                              {isTop ? (
                                <span style={{ 
                                  background: T.success, 
                                  color: '#fff', 
                                  padding: '2px 6px', 
                                  borderRadius: '4px',
                                  fontSize: '8px',
                                  fontWeight: 700,
                                }}>
                                  BEST
                                </span>
                              ) : (
                                <span style={{ color: T.textMuted }}>{index + 1}</span>
                              )}
                            </td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <span style={{ 
                                  width: '8px', 
                                  height: '8px', 
                                  borderRadius: '50%', 
                                  background: color,
                                  flexShrink: 0,
                                }} />
                                <span style={{ fontWeight: 600, color: color }}>
                                  {result.marketplaceName}
                                </span>
                              </div>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace' }}>
                              {formatCurrency(result.suggestedPrice, result.currency)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', color: T.textMuted }}>
                              {formatCurrency(result.shippingCost, result.currency)}
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', color: T.textMuted }}>
                              {formatCurrency(result.totalFees, result.currency)}
                            </td>
                            <td style={{ 
                              ...tdStyle, 
                              textAlign: 'right', 
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: result.isProfitable ? T.success : T.error,
                            }}>
                              ¥{Math.round(result.profitJpy).toLocaleString()}
                            </td>
                            <td style={{ 
                              ...tdStyle, 
                              textAlign: 'right',
                              color: result.profitMargin >= 15 ? T.success : result.profitMargin >= 10 ? T.warning : T.error,
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                                {result.profitMargin >= 15 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {result.profitMargin.toFixed(1)}%
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
              
              {/* アクションボタン */}
              <Card title="出品アクション">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  
                  {/* 下書き保存 */}
                  <div>
                    <ActionButton
                      onClick={() => saveToQueue('draft')}
                      disabled={isSaving}
                      icon={<Save size={14} />}
                      label="下書き保存"
                      description="あとで編集"
                      color={T.textMuted}
                    />
                  </div>
                  
                  {/* スケジュール */}
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <input
                        type="datetime-local"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.375rem',
                          fontSize: '10px',
                          borderRadius: '4px',
                          border: `1px solid ${T.panelBorder}`,
                        }}
                      />
                    </div>
                    <ActionButton
                      onClick={() => saveToQueue('scheduled')}
                      disabled={isSaving || !scheduleDate}
                      icon={<Clock size={14} />}
                      label="スケジュール"
                      description="指定日時に出品"
                      color={T.warning}
                    />
                  </div>
                  
                  {/* 即時出品 */}
                  <div>
                    <ActionButton
                      onClick={() => saveToQueue('pending')}
                      disabled={isSaving}
                      icon={<Rocket size={14} />}
                      label="即時出品"
                      description="今すぐキューに追加"
                      color={T.success}
                      primary
                    />
                  </div>
                </div>
                
                {/* 警告 */}
                {pricingResults.some(r => !r.isProfitable) && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    background: `${T.warning}15`,
                    border: `1px solid ${T.warning}40`,
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: T.warning,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}>
                    <AlertTriangle size={12} />
                    一部のマーケットプレイスで赤字になります
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

// =====================================================
// サブコンポーネント
// =====================================================

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ 
      padding: '0.75rem', 
      borderRadius: '6px', 
      background: T.panel, 
      border: `1px solid ${T.panelBorder}` 
    }}>
      <div style={{ 
        fontSize: '9px', 
        textTransform: 'uppercase', 
        fontWeight: 600, 
        color: T.textSubtle, 
        marginBottom: '0.5rem' 
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ 
      padding: '0.375rem', 
      borderRadius: '4px', 
      background: T.highlight, 
      textAlign: 'center' 
    }}>
      <div style={{ fontSize: '8px', color: T.textSubtle }}>{label}</div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: T.text }}>{value}</div>
    </div>
  );
}

function SummaryCard({ 
  label, 
  value, 
  color = T.accent,
  icon
}: { 
  label: string; 
  value: string; 
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{ 
      padding: '0.625rem', 
      borderRadius: '6px', 
      background: T.panel, 
      border: `1px solid ${T.panelBorder}`,
      textAlign: 'center',
    }}>
      <div style={{ 
        fontSize: '8px', 
        textTransform: 'uppercase', 
        color: T.textSubtle, 
        marginBottom: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
      }}>
        {icon}
        {label}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function MiniButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.25rem 0.5rem',
        fontSize: '9px',
        borderRadius: '3px',
        border: `1px solid ${T.panelBorder}`,
        background: T.panel,
        color: T.textMuted,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function ActionButton({ 
  onClick, 
  disabled, 
  icon, 
  label, 
  description,
  color,
  primary 
}: { 
  onClick: () => void; 
  disabled: boolean; 
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '0.625rem',
        borderRadius: '6px',
        border: primary ? 'none' : `1px solid ${T.panelBorder}`,
        background: primary ? color : T.panel,
        color: primary ? '#fff' : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
        {icon}
        <span style={{ fontSize: '11px', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: '8px', opacity: 0.8 }}>{description}</div>
    </button>
  );
}

// =====================================================
// ユーティリティ
// =====================================================

const thStyle: React.CSSProperties = {
  padding: '0.5rem',
  textAlign: 'left',
  fontWeight: 600,
  color: T.textMuted,
  borderBottom: `2px solid ${T.panelBorder}`,
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem',
  verticalAlign: 'middle',
};

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'JPY': '¥',
    'GBP': '£',
    'EUR': '€',
    'AUD': 'A$',
    'SGD': 'S$',
    'MYR': 'RM',
    'THB': '฿',
    'PHP': '₱',
    'TWD': 'NT$',
    'VND': '₫',
    'KRW': '₩',
  };
  
  const symbol = symbols[currency] || currency;
  
  if (currency === 'JPY' || currency === 'KRW' || currency === 'VND') {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  
  return `${symbol}${value.toFixed(2)}`;
}
