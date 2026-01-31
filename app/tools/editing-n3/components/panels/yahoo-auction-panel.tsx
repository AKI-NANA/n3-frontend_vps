/**
 * Yahoo Auction 専用設定パネル
 * 
 * マーケットプレイスが yahoo-auction の時のみ表示される
 * 差分パネルコンポーネント
 * 
 * @version 1.0.0
 * @date 2026-01-30
 */

'use client';

import React, { memo, useState, useCallback, useEffect, useMemo } from 'react';
import { 
  Tag, Package, Truck, FileText, Calculator, 
  ChevronDown, ChevronRight, Search, Check, 
  AlertTriangle, Info, Eye, Edit3, X
} from 'lucide-react';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface YahooAuctionPanelProps {
  product: Product;
  onUpdate: (updates: Partial<YahooAuctionData>) => void;
  onOpenProfitCalculator?: () => void;
  onOpenHtmlEditor?: () => void;
  readOnly?: boolean;
}

export interface YahooAuctionData {
  title_ja?: string;
  description_html?: string;
  category_id?: string;
  category_name?: string;
  condition?: string;
  condition_note?: string;
  auction_type?: 'auction' | 'fixed';
  start_price?: number;
  buy_now_price?: number;
  shipping_template_id?: string;
  shipping_payer?: '出品者' | '落札者';
  calculated_selling_price?: number;
  calculated_profit_rate?: number;
  validation_errors?: string[];
  validation_warnings?: string[];
}

interface ShippingTemplate {
  id: string;
  name: string;
  description?: string;
  default_shipping_cost: number;
}

// ============================================================
// 定数
// ============================================================

const CONDITION_OPTIONS = [
  { value: '新品', label: '新品', color: '#10b981' },
  { value: '未使用に近い', label: '未使用に近い', color: '#22c55e' },
  { value: '目立った傷や汚れなし', label: '目立った傷や汚れなし', color: '#84cc16' },
  { value: 'やや傷や汚れあり', label: 'やや傷や汚れあり', color: '#eab308' },
  { value: '傷や汚れあり', label: '傷や汚れあり', color: '#f97316' },
  { value: '全体的に状態が悪い', label: '全体的に状態が悪い', color: '#ef4444' },
  { value: 'ジャンク', label: 'ジャンク', color: '#dc2626' },
];

const AUCTION_TYPE_OPTIONS = [
  { value: 'fixed', label: '定額（フリマ）', description: '即決価格のみ' },
  { value: 'auction', label: 'オークション', description: '開始価格から入札' },
];

const DEFAULT_SHIPPING_TEMPLATES: ShippingTemplate[] = [
  { id: 'yupack_default', name: 'ゆうパック（標準）', default_shipping_cost: 800 },
  { id: 'takkyubin', name: '宅急便（ヤマト）', default_shipping_cost: 850 },
  { id: 'nekopos', name: 'ネコポス（小物用）', default_shipping_cost: 210 },
  { id: 'yupacket', name: 'ゆうパケット（薄物用）', default_shipping_cost: 230 },
];

// ============================================================
// メインコンポーネント
// ============================================================

export const YahooAuctionPanel = memo(function YahooAuctionPanel({
  product,
  onUpdate,
  onOpenProfitCalculator,
  onOpenHtmlEditor,
  readOnly = false,
}: YahooAuctionPanelProps) {
  // yahoo_auction_data を取得
  const yahooData: YahooAuctionData = useMemo(() => {
    return (product as any).yahoo_auction_data || {};
  }, [product]);
  
  // カテゴリ検索
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryResults, setCategoryResults] = useState<any[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // セクション開閉
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    category: true,
    shipping: true,
    price: true,
    description: false,
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  // カテゴリ検索
  const searchCategories = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCategoryResults([]);
      return;
    }
    
    setLoadingCategories(true);
    try {
      const res = await fetch(`/api/yahoo-auction/categories/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setCategoryResults(data.categories || []);
      }
    } catch (e) {
      console.error('カテゴリ検索エラー:', e);
    } finally {
      setLoadingCategories(false);
    }
  }, []);
  
  // カテゴリ検索（デバウンス）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (categorySearch) {
        searchCategories(categorySearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [categorySearch, searchCategories]);
  
  // 更新ハンドラー
  const handleFieldChange = useCallback((field: keyof YahooAuctionData, value: any) => {
    onUpdate({ [field]: value });
  }, [onUpdate]);
  
  // 検証エラー表示
  const validationErrors = yahooData.validation_errors || [];
  const validationWarnings = yahooData.validation_warnings || [];
  const hasErrors = validationErrors.length > 0;
  const hasWarnings = validationWarnings.length > 0;
  
  return (
    <div style={{
      background: 'var(--panel)',
      border: '2px solid #ff0033',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #ff0033 0%, #cc0029 100%)',
        color: 'white',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>🔴</span>
          <span style={{ fontWeight: 600, fontSize: '13px' }}>ヤフオク専用設定</span>
        </div>
        {hasErrors && (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <AlertTriangle size={12} />
            {validationErrors.length}件のエラー
          </div>
        )}
      </div>
      
      {/* エラー/警告表示 */}
      {(hasErrors || hasWarnings) && (
        <div style={{ padding: '8px 14px', background: hasErrors ? '#fef2f2' : '#fffbeb' }}>
          {validationErrors.map((err, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <X size={10} /> {err}
            </div>
          ))}
          {validationWarnings.map((warn, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <AlertTriangle size={10} /> {warn}
            </div>
          ))}
        </div>
      )}
      
      {/* === 基本設定セクション === */}
      <Section 
        title="基本設定" 
        icon={<Edit3 size={14} />}
        expanded={expandedSections.basic}
        onToggle={() => toggleSection('basic')}
      >
        {/* 日本語タイトル */}
        <Field label="日本語タイトル" required hint="65文字以内">
          <input
            type="text"
            value={yahooData.title_ja || ''}
            onChange={(e) => handleFieldChange('title_ja', e.target.value)}
            maxLength={65}
            disabled={readOnly}
            placeholder="商品タイトル（日本語）"
            style={inputStyle}
          />
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>
            {(yahooData.title_ja || '').length}/65
          </div>
        </Field>
        
        {/* 商品の状態 */}
        <Field label="商品の状態" required>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {CONDITION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleFieldChange('condition', opt.value)}
                disabled={readOnly}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: yahooData.condition === opt.value 
                    ? `2px solid ${opt.color}` 
                    : '1px solid var(--panel-border)',
                  background: yahooData.condition === opt.value 
                    ? `${opt.color}15` 
                    : 'var(--bg-solid)',
                  color: yahooData.condition === opt.value ? opt.color : 'var(--text)',
                  cursor: readOnly ? 'default' : 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>
        
        {/* 出品形式 */}
        <Field label="出品形式" required>
          <div style={{ display: 'flex', gap: '8px' }}>
            {AUCTION_TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleFieldChange('auction_type', opt.value)}
                disabled={readOnly}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: yahooData.auction_type === opt.value 
                    ? '2px solid #ff0033' 
                    : '1px solid var(--panel-border)',
                  background: yahooData.auction_type === opt.value 
                    ? '#ff003310' 
                    : 'var(--bg-solid)',
                  color: yahooData.auction_type === opt.value ? '#ff0033' : 'var(--text)',
                  cursor: readOnly ? 'default' : 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 600 }}>{opt.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
        </Field>
      </Section>
      
      {/* === カテゴリセクション === */}
      <Section 
        title="カテゴリ" 
        icon={<Tag size={14} />}
        expanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
        badge={yahooData.category_id ? '✓' : '未設定'}
        badgeColor={yahooData.category_id ? '#10b981' : '#ef4444'}
      >
        {/* 選択中のカテゴリ */}
        {yahooData.category_id && (
          <div style={{
            padding: '8px 10px',
            background: '#10b98110',
            border: '1px solid #10b981',
            borderRadius: '6px',
            marginBottom: '8px',
            fontSize: '11px',
          }}>
            <div style={{ color: '#10b981', fontWeight: 600, marginBottom: '2px' }}>
              選択中: {yahooData.category_name || yahooData.category_id}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              ID: {yahooData.category_id}
            </div>
          </div>
        )}
        
        {/* カテゴリ検索 */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }} />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setShowCategoryDropdown(true);
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              disabled={readOnly}
              placeholder="カテゴリを検索..."
              style={{
                ...inputStyle,
                paddingLeft: '32px',
              }}
            />
          </div>
          
          {/* 検索結果ドロップダウン */}
          {showCategoryDropdown && categorySearch.length >= 2 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 100,
            }}>
              {loadingCategories ? (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  検索中...
                </div>
              ) : categoryResults.length > 0 ? (
                categoryResults.map(cat => (
                  <button
                    key={cat.category_id}
                    onClick={() => {
                      handleFieldChange('category_id', cat.category_id);
                      handleFieldChange('category_name', cat.category_path_string || cat.category_name);
                      setCategorySearch('');
                      setShowCategoryDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--panel-border)',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--text)' }}>
                      {cat.category_path_string || cat.category_name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      ID: {cat.category_id}
                    </div>
                  </button>
                ))
              ) : (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  該当するカテゴリがありません
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
      
      {/* === 発送設定セクション === */}
      <Section 
        title="発送設定" 
        icon={<Truck size={14} />}
        expanded={expandedSections.shipping}
        onToggle={() => toggleSection('shipping')}
      >
        {/* 送料負担 */}
        <Field label="送料負担">
          <div style={{ display: 'flex', gap: '8px' }}>
            {['出品者', '落札者'].map(payer => (
              <button
                key={payer}
                onClick={() => handleFieldChange('shipping_payer', payer as '出品者' | '落札者')}
                disabled={readOnly}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  border: yahooData.shipping_payer === payer
                    ? '2px solid #ff0033'
                    : '1px solid var(--panel-border)',
                  background: yahooData.shipping_payer === payer
                    ? '#ff003310'
                    : 'var(--bg-solid)',
                  color: yahooData.shipping_payer === payer ? '#ff0033' : 'var(--text)',
                  cursor: readOnly ? 'default' : 'pointer',
                }}
              >
                {payer}負担
              </button>
            ))}
          </div>
        </Field>
        
        {/* 発送方法テンプレート */}
        <Field label="発送方法テンプレート" required>
          <select
            value={yahooData.shipping_template_id || ''}
            onChange={(e) => handleFieldChange('shipping_template_id', e.target.value)}
            disabled={readOnly}
            style={inputStyle}
          >
            <option value="">選択してください</option>
            {DEFAULT_SHIPPING_TEMPLATES.map(tmpl => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name} (¥{tmpl.default_shipping_cost})
              </option>
            ))}
          </select>
        </Field>
      </Section>
      
      {/* === 価格設定セクション === */}
      <Section 
        title="価格設定" 
        icon={<Calculator size={14} />}
        expanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* 開始価格（オークションの場合） */}
          {yahooData.auction_type === 'auction' && (
            <Field label="開始価格">
              <input
                type="number"
                value={yahooData.start_price || ''}
                onChange={(e) => handleFieldChange('start_price', Number(e.target.value))}
                disabled={readOnly}
                placeholder="1"
                style={inputStyle}
              />
            </Field>
          )}
          
          {/* 即決価格 */}
          <Field label={yahooData.auction_type === 'auction' ? '即決価格' : '販売価格'}>
            <input
              type="number"
              value={yahooData.buy_now_price || yahooData.calculated_selling_price || ''}
              onChange={(e) => handleFieldChange('buy_now_price', Number(e.target.value))}
              disabled={readOnly}
              placeholder="0"
              style={inputStyle}
            />
          </Field>
        </div>
        
        {/* 利益計算ボタン */}
        {onOpenProfitCalculator && (
          <button
            onClick={onOpenProfitCalculator}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '8px',
              fontSize: '12px',
              fontWeight: 600,
              border: '2px solid #ff0033',
              borderRadius: '6px',
              background: '#ff003310',
              color: '#ff0033',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Calculator size={14} />
            利益計算を開く
            {yahooData.calculated_profit_rate !== undefined && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 6px',
                background: yahooData.calculated_profit_rate >= 0 ? '#10b981' : '#ef4444',
                color: 'white',
                borderRadius: '4px',
                fontSize: '10px',
              }}>
                {yahooData.calculated_profit_rate.toFixed(1)}%
              </span>
            )}
          </button>
        )}
      </Section>
      
      {/* === 商品説明セクション === */}
      <Section 
        title="商品説明HTML" 
        icon={<FileText size={14} />}
        expanded={expandedSections.description}
        onToggle={() => toggleSection('description')}
        badge={yahooData.description_html ? '✓' : '未作成'}
        badgeColor={yahooData.description_html ? '#10b981' : '#f59e0b'}
      >
        {yahooData.description_html ? (
          <div style={{
            padding: '8px',
            background: 'var(--highlight)',
            borderRadius: '4px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            maxHeight: '100px',
            overflow: 'hidden',
          }}>
            {yahooData.description_html.substring(0, 200)}...
          </div>
        ) : (
          <div style={{
            padding: '12px',
            background: '#fef3c7',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#92400e',
            textAlign: 'center',
          }}>
            商品説明HTMLが未作成です
          </div>
        )}
        
        {onOpenHtmlEditor && (
          <button
            onClick={onOpenHtmlEditor}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '8px',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid var(--panel-border)',
              borderRadius: '4px',
              background: 'var(--bg-solid)',
              color: 'var(--text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Edit3 size={14} />
            HTML編集
          </button>
        )}
      </Section>
    </div>
  );
});

// ============================================================
// サブコンポーネント
// ============================================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}

function Section({ title, icon, expanded, onToggle, badge, badgeColor, children }: SectionProps) {
  return (
    <div style={{ borderBottom: '1px solid var(--panel-border)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--highlight)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', flex: 1 }}>
          {title}
        </span>
        {badge && (
          <span style={{
            padding: '2px 6px',
            fontSize: '10px',
            borderRadius: '4px',
            background: `${badgeColor}20`,
            color: badgeColor,
          }}>
            {badge}
          </span>
        )}
      </button>
      {expanded && (
        <div style={{ padding: '12px 14px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--text-muted)',
        marginBottom: '4px',
      }}>
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
        {hint && (
          <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 400 }}>
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// 共通スタイル
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontSize: '12px',
  border: '1px solid var(--panel-border)',
  borderRadius: '4px',
  background: 'var(--bg-solid)',
  color: 'var(--text)',
};

export default YahooAuctionPanel;
