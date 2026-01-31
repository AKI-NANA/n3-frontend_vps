# 🚀 半自動パイプライン実装計画

## 📋 実装概要

### 目的
スクレイピング済み商品を「SM選択待ち」「承認待ち」で**人間確認が必要な箇所で自動停止**しながら、一気通貫で処理する機能を実装する。

### 設計原則
1. ✅ **既存の個別ボタンは全て継続使用可能**
2. ✅ **既存の一括ボタンも全て継続使用可能**
3. 🔥 **NEW**: パイプライン実行ボタンを追加

---

## 🎯 実装するコンポーネント

### 1. パイプライン実行ボタン

#### ファイルパス
```
app/tools/editing-n3/components/pipeline/
├── smart-pipeline-button.tsx       # メインボタン
├── pipeline-progress-modal.tsx     # 進行状況モーダル
├── pipeline-stop-modal.tsx         # 停止確認モーダル
└── index.ts                        # エクスポート
```

#### ボタン配置場所
**`app/tools/editing-n3/components/header/n3-sub-toolbar.tsx`**

```tsx
{/* 🔥 NEW: スマートパイプラインボタン */}
{selectedProducts && selectedProducts.length > 0 && (
  <>
    <SmartPipelineButton
      selectedProducts={selectedProducts}
      onComplete={onRefresh}
    />
    <N3Divider orientation="vertical" />
  </>
)}

{/* 既存の監査ボタンなど */}
<BulkAuditButton ... />
```

---

## 🔄 パイプライン処理フロー

### Phase 1: データ取得・基本処理
```typescript
// ステップ1: 翻訳（日本語 → 英語）
if (!product.english_title) {
  await translateProduct(product.id);
}

// ステップ2: カテゴリ取得
if (!product.ebay_category_id) {
  await fetchCategory(product.id);
}

// ステップ3: サイズ・重量推定
if (!product.listing_data?.weight_g) {
  await estimateSize(product.id);
}

// ステップ4: 送料計算
if (!product.listing_data?.shipping_cost_usd) {
  await calculateShipping(product.id);
}

// ステップ5: 利益計算
if (!product.listing_data?.ddu_profit_usd) {
  await calculateProfit(product.id);
}
```

### Phase 2: SM分析 → 人間確認必須
```typescript
// ステップ6: SM競合分析
const smResult = await analyzeSM(product.id);

// 🚨 停止ポイント1: SM未選択
if (!product.sm_selected_competitor_id) {
  // ステータスを「SM選択待ち」に変更
  await updateProductStatus(product.id, {
    workflow_status: 'sm_selection_required',
    pipeline_stop_reason: 'SM competitor not selected'
  });
  
  // モーダルを開いて人間に選択させる
  openSMSelectionModal(product, smResult.candidates);
  
  // ここで処理を停止（次の商品へ）
  continue;
}
```

### Phase 3: HTML生成 → 承認待ち
```typescript
// ステップ7: HTML生成
if (!product.html_content) {
  await generateHTML(product.id);
}

// 🚨 停止ポイント2: AI推定データの承認待ち
if (product.has_ai_estimated_data) {
  // ステータスを「承認待ち」に変更
  await updateProductStatus(product.id, {
    workflow_status: 'ready_for_approval',
    approval_required_fields: ['weight_g', 'shipping_cost_usd', 'profit_amount_usd']
  });
  
  // 承認待ちタブに表示
  continue;
}
```

---

## 🎨 UI/UX設計

### ボタンデザイン

```tsx
<button
  onClick={handlePipelineStart}
  disabled={selectedProducts.length === 0 || isProcessing}
  style={{
    height: 28,
    padding: '0 12px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }}
>
  <Zap size={14} />
  {isProcessing ? '処理中...' : `スマートパイプライン (${selectedProducts.length}件)`}
</button>
```

### 進行状況モーダル

```
┌─────────────────────────────────────────────────┐
│ 🚀 スマートパイプライン実行中                    │
├─────────────────────────────────────────────────┤
│                                                 │
│ 処理中: 15 / 50 件                              │
│                                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 30%                                             │
│                                                 │
│ 現在の処理:                                     │
│ ✅ 翻訳完了                                     │
│ ✅ カテゴリ取得完了                             │
│ 🔄 SM分析中...                                  │
│ ⏸️  HTML生成待機中                              │
│                                                 │
│ ⚠️ SM選択待ち: 3件                              │
│ ⏸️ 承認待ち: 8件                                │
│                                                 │
│ [ 一時停止 ]  [ キャンセル ]                    │
└─────────────────────────────────────────────────┘
```

---

## 🔧 実装ファイル詳細

### 1. SmartPipelineButton.tsx

```typescript
// app/tools/editing-n3/components/pipeline/smart-pipeline-button.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { Zap, Pause, X } from 'lucide-react';
import type { Product } from '@/app/tools/editing/types/product';

interface SmartPipelineButtonProps {
  selectedProducts: Product[];
  onComplete: () => Promise<void>;
}

export function SmartPipelineButton({
  selectedProducts,
  onComplete,
}: SmartPipelineButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  
  const handleStart = useCallback(async () => {
    if (selectedProducts.length === 0) return;
    
    setIsProcessing(true);
    setShowProgressModal(true);
    
    try {
      // パイプライン実行API呼び出し
      const response = await fetch('/api/pipeline/smart-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProducts.map(p => p.id),
          stopOnSMSelection: true,
          stopOnApproval: true,
        }),
      });
      
      const result = await response.json();
      
      // 完了後のリフレッシュ
      await onComplete();
      
      // 結果通知
      if (result.smSelectionRequired > 0) {
        alert(`SM選択が必要な商品: ${result.smSelectionRequired}件`);
      }
      if (result.approvalRequired > 0) {
        alert(`承認待ち商品: ${result.approvalRequired}件`);
      }
      
    } catch (error) {
      console.error('パイプライン実行エラー:', error);
      alert('パイプライン実行中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
      setShowProgressModal(false);
    }
  }, [selectedProducts, onComplete]);
  
  return (
    <>
      <button
        onClick={handleStart}
        disabled={selectedProducts.length === 0 || isProcessing}
        style={{
          height: 28,
          padding: '0 12px',
          background: isProcessing 
            ? 'var(--text-muted)' 
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: '12px',
          fontWeight: 600,
          cursor: selectedProducts.length === 0 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          opacity: selectedProducts.length === 0 ? 0.5 : 1,
        }}
      >
        <Zap size={14} />
        {isProcessing ? '処理中...' : `スマート実行 (${selectedProducts.length})`}
      </button>
      
      {/* 進行状況モーダル */}
      {showProgressModal && (
        <PipelineProgressModal
          onClose={() => setShowProgressModal(false)}
        />
      )}
    </>
  );
}
```

---

### 2. APIエンドポイント

#### ファイルパス
```
app/api/pipeline/
├── smart-execute/
│   └── route.ts           # パイプライン実行API
└── status/
    └── route.ts           # 進行状況取得API
```

#### smart-execute/route.ts

```typescript
// app/api/pipeline/smart-execute/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface PipelineRequest {
  productIds: number[];
  stopOnSMSelection: boolean;
  stopOnApproval: boolean;
}

interface PipelineResult {
  processed: number;
  smSelectionRequired: number;
  approvalRequired: number;
  errors: Array<{ productId: number; error: string }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: PipelineRequest = await request.json();
    const { productIds, stopOnSMSelection, stopOnApproval } = body;
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const result: PipelineResult = {
      processed: 0,
      smSelectionRequired: 0,
      approvalRequired: 0,
      errors: [],
    };
    
    // 各商品を順次処理
    for (const productId of productIds) {
      try {
        // 商品データ取得
        const { data: product, error: fetchError } = await supabase
          .from('products_master')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (fetchError || !product) {
          result.errors.push({ productId, error: 'Product not found' });
          continue;
        }
        
        // ============================================================
        // Phase 1: 基本処理
        // ============================================================
        
        // 1. 翻訳
        if (!product.english_title) {
          await fetch(`/api/products/${productId}/translate`, { method: 'POST' });
        }
        
        // 2. カテゴリ取得
        if (!product.ebay_category_id) {
          await fetch(`/api/products/${productId}/category`, { method: 'POST' });
        }
        
        // 3. サイズ推定
        if (!product.listing_data?.weight_g) {
          await fetch(`/api/products/${productId}/estimate-size`, { method: 'POST' });
        }
        
        // 4. 送料計算
        if (!product.listing_data?.shipping_cost_usd) {
          await fetch(`/api/products/${productId}/calculate-shipping`, { method: 'POST' });
        }
        
        // 5. 利益計算
        if (!product.listing_data?.ddu_profit_usd) {
          await fetch(`/api/products/${productId}/calculate-profit`, { method: 'POST' });
        }
        
        // ============================================================
        // Phase 2: SM分析 → 停止ポイント1
        // ============================================================
        
        // SM分析実行
        const smResponse = await fetch(`/api/products/${productId}/analyze-sm`, {
          method: 'POST',
        });
        const smResult = await smResponse.json();
        
        // SM未選択の場合は停止
        if (stopOnSMSelection && !product.sm_selected_competitor_id) {
          await supabase
            .from('products_master')
            .update({
              workflow_status: 'sm_selection_required',
              pipeline_stop_reason: 'SM competitor not selected',
            })
            .eq('id', productId);
          
          result.smSelectionRequired++;
          continue;
        }
        
        // ============================================================
        // Phase 3: HTML生成 → 停止ポイント2
        // ============================================================
        
        // HTML生成
        if (!product.html_content) {
          await fetch(`/api/products/${productId}/generate-html`, { method: 'POST' });
        }
        
        // AI推定データがある場合は承認待ちで停止
        const hasAIEstimated = 
          product.listing_data?.weight_g_source === 'ai_estimated' ||
          product.listing_data?.shipping_cost_source === 'ai_estimated';
        
        if (stopOnApproval && hasAIEstimated) {
          await supabase
            .from('products_master')
            .update({
              workflow_status: 'ready_for_approval',
              approval_required_fields: ['weight_g', 'shipping_cost_usd', 'profit_amount_usd'],
            })
            .eq('id', productId);
          
          result.approvalRequired++;
          continue;
        }
        
        // ============================================================
        // 完了
        // ============================================================
        
        await supabase
          .from('products_master')
          .update({
            workflow_status: 'approved',
            ready_to_list: true,
          })
          .eq('id', productId);
        
        result.processed++;
        
      } catch (error) {
        console.error(`Product ${productId} processing error:`, error);
        result.errors.push({
          productId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Pipeline execution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### 3. SM選択モーダル強化

**既存ファイル**: `app/tools/editing-n3/components/modals/sm-competitor-selection-modal.tsx`

#### 追加機能

```typescript
// パイプライン停止からの自動起動
useEffect(() => {
  window.addEventListener('pipeline:sm-selection-required', handleAutoOpen);
  return () => {
    window.removeEventListener('pipeline:sm-selection-required', handleAutoOpen);
  };
}, []);

const handleAutoOpen = useCallback((event: CustomEvent) => {
  const { productId, candidates } = event.detail;
  // モーダルを開いてSM選択UI表示
  setTargetProduct(productId);
  setCandidates(candidates);
  setIsOpen(true);
}, []);
```

---

### 4. 利益計算内訳ポップアップ

#### ファイル: `profit-breakdown-modal.tsx`

```typescript
// app/tools/editing-n3/components/modals/profit-breakdown-modal.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { DollarSign, Package, Truck, AlertTriangle } from 'lucide-react';
import type { Product } from '@/app/tools/editing/types/product';

interface ProfitBreakdownModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onShippingMethodChange: (method: 'fedex' | 'economy') => Promise<void>;
}

export function ProfitBreakdownModal({
  product,
  isOpen,
  onClose,
  onShippingMethodChange,
}: ProfitBreakdownModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'fedex' | 'economy'>(
    product.listing_data?.shipping_method || 'fedex'
  );
  
  const handleMethodChange = useCallback(async (method: 'fedex' | 'economy') => {
    setSelectedMethod(method);
    await onShippingMethodChange(method);
  }, [onShippingMethodChange]);
  
  if (!isOpen) return null;
  
  const listingData = product.listing_data;
  const isAIEstimated = listingData?.weight_g_source === 'ai_estimated';
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
    }}>
      <div style={{
        background: 'var(--panel)',
        borderRadius: 8,
        width: 500,
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}>
        {/* ヘッダー */}
        <div style={{
          padding: 16,
          borderBottom: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            <DollarSign size={16} style={{ display: 'inline', marginRight: 6 }} />
            利益計算の内訳
          </h3>
          <button onClick={onClose} style={{ cursor: 'pointer' }}>✕</button>
        </div>
        
        {/* AI推定警告 */}
        {isAIEstimated && (
          <div style={{
            margin: 16,
            padding: 12,
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: 6,
            display: 'flex',
            gap: 8,
          }}>
            <AlertTriangle size={16} color="#fbbf24" />
            <div style={{ fontSize: 12 }}>
              <strong>AI推定データ</strong>
              <br />
              重量・送料はAIが推定した値です。必ず確認してください。
            </div>
          </div>
        )}
        
        {/* 重量情報 */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            <Package size={14} style={{ display: 'inline', marginRight: 4 }} />
            商品サイズ・重量
          </div>
          <table style={{ width: '100%', fontSize: 12 }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0' }}>重量</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>
                  {listingData?.weight_g || '---'} g
                  {isAIEstimated && (
                    <span style={{ marginLeft: 6, color: '#fbbf24', fontSize: 10 }}>
                      (AI推定)
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0' }}>サイズ</td>
                <td style={{ textAlign: 'right' }}>
                  {listingData?.width_cm} × {listingData?.length_cm} × {listingData?.height_cm} cm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* 配送方法選択 */}
        <div style={{ padding: 16, borderTop: '1px solid var(--panel-border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            <Truck size={14} style={{ display: 'inline', marginRight: 4 }} />
            配送方法
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* FedEx */}
            <button
              onClick={() => handleMethodChange('fedex')}
              style={{
                flex: 1,
                padding: 12,
                border: selectedMethod === 'fedex' ? '2px solid var(--accent)' : '1px solid var(--panel-border)',
                borderRadius: 6,
                background: selectedMethod === 'fedex' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600 }}>FedEx</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                ${listingData?.fedex_cost || '---'}
              </div>
            </button>
            
            {/* Economy */}
            <button
              onClick={() => handleMethodChange('economy')}
              style={{
                flex: 1,
                padding: 12,
                border: selectedMethod === 'economy' ? '2px solid var(--accent)' : '1px solid var(--panel-border)',
                borderRadius: 6,
                background: selectedMethod === 'economy' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600 }}>Economy</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                ${listingData?.economy_cost || '---'}
              </div>
            </button>
          </div>
        </div>
        
        {/* 利益計算 */}
        <div style={{ padding: 16, borderTop: '1px solid var(--panel-border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            利益計算
          </div>
          <table style={{ width: '100%', fontSize: 12 }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0' }}>販売価格</td>
                <td style={{ textAlign: 'right' }}>${listingData?.listing_price_usd || '---'}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: 'var(--text-muted)' }}>- 仕入原価</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                  ${product.cost_price || '---'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: 'var(--text-muted)' }}>- 送料</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                  ${listingData?.shipping_cost_usd || '---'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: 'var(--text-muted)' }}>- eBay手数料</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                  ${listingData?.ebay_fee_usd || '---'}
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>純利益 (DDU)</td>
                <td style={{ textAlign: 'right', fontWeight: 600, fontSize: 14 }}>
                  ${listingData?.ddu_profit_usd?.toFixed(2) || '---'}
                  <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: 11 }}>
                    ({listingData?.ddu_profit_margin?.toFixed(1) || '---'}%)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* フッター */}
        <div style={{
          padding: 16,
          borderTop: '1px solid var(--panel-border)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 実装チェックリスト

### Phase 1: パイプラインボタン本体
- [ ] `smart-pipeline-button.tsx` 作成
- [ ] `pipeline-progress-modal.tsx` 作成
- [ ] `n3-sub-toolbar.tsx` にボタン追加
- [ ] ボタンの表示/非表示ロジック実装

### Phase 2: APIエンドポイント
- [ ] `/api/pipeline/smart-execute/route.ts` 作成
- [ ] `/api/pipeline/status/route.ts` 作成（進行状況取得）
- [ ] エラーハンドリング実装
- [ ] ロールバック機構実装

### Phase 3: 停止ポイント実装
- [ ] SM選択待ちステータス追加
- [ ] 承認待ちステータス追加
- [ ] SM選択モーダルの自動起動
- [ ] 承認UIの自動表示

### Phase 4: 内訳ポップアップ
- [ ] `profit-breakdown-modal.tsx` 作成
- [ ] 配送方法切り替えAPI連携
- [ ] リアルタイム再計算実装
- [ ] AI推定データの警告表示

### Phase 5: 統合テスト
- [ ] 個別ボタンとの共存確認
- [ ] 一括ボタンとの共存確認
- [ ] パイプライン中断・再開テスト
- [ ] エラー時のリカバリーテスト

---

## 🔄 データフロー図

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ユーザーが商品を選択して「スマートパイプライン」ボタン押下 │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. POST /api/pipeline/smart-execute                         │
│    - productIds: [1, 2, 3, ...]                             │
│    - stopOnSMSelection: true                                │
│    - stopOnApproval: true                                   │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. 各商品を順次処理（for loop）                             │
│    ┌──────────────────────────────────────────────┐         │
│    │ 3-1. 翻訳 → カテゴリ → サイズ → 送料 → 利益  │         │
│    └──────────────────┬───────────────────────────┘         │
│                       ▼                                     │
│    ┌──────────────────────────────────────────────┐         │
│    │ 3-2. SM分析                                  │         │
│    │      ├─ SM未選択? → STOP (SM選択待ち)       │         │
│    │      └─ 選択済み → 次へ                      │         │
│    └──────────────────┬───────────────────────────┘         │
│                       ▼                                     │
│    ┌──────────────────────────────────────────────┐         │
│    │ 3-3. HTML生成                                │         │
│    │      ├─ AI推定データあり? → STOP (承認待ち) │         │
│    │      └─ 問題なし → 承認済み                  │         │
│    └──────────────────────────────────────────────┘         │
└────────────────────┬────────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. 結果を返す                                               │
│    {                                                        │
│      processed: 15,              // 完了件数                │
│      smSelectionRequired: 3,     // SM選択待ち              │
│      approvalRequired: 8,        // 承認待ち                │
│      errors: []                  // エラー                  │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚨 重要な注意点

### 1. 既存機能との共存
- ✅ 個別ボタン（翻訳、カテゴリなど）は**そのまま使える**
- ✅ 一括ボタンも**そのまま使える**
- 🔥 パイプラインボタンは**新規追加**

### 2. 停止ポイントの明確化
- SM選択待ち → **`workflow_status='sm_selection_required'`**
- 承認待ち → **`workflow_status='ready_for_approval'`**
- これらのステータスは既存の承認フローと統合

### 3. AI推定データの扱い
- 重量推定 → **`listing_data.weight_g_source='ai_estimated'`**
- 送料計算 → **`listing_data.shipping_cost_source='ai_estimated'`**
- これらのフラグで承認要否を判定

---

## 📅 実装優先度

### 🔴 High Priority（次回セッション最優先）
1. ✅ `smart-pipeline-button.tsx` - ボタン本体
2. ✅ `/api/pipeline/smart-execute/route.ts` - API
3. ✅ `n3-sub-toolbar.tsx` への統合

### 🟡 Medium Priority
4. `pipeline-progress-modal.tsx` - 進行状況表示
5. SM選択モーダルの自動起動機能

### 🟢 Low Priority
6. `profit-breakdown-modal.tsx` - 内訳ポップアップ
7. エラーリカバリー機構
8. パフォーマンス最適化

---

## 🎯 成功基準

### 機能面
- [x] scraped タブの表示
- [ ] スマートパイプラインボタンの表示
- [ ] SM選択で自動停止
- [ ] 承認待ちで自動停止
- [ ] 内訳ポップアップでの配送方法切り替え

### UX面
- [ ] 処理中の進行状況がわかる
- [ ] エラー時の原因が明確
- [ ] 既存ボタンとの使い分けが自然
- [ ] 人間確認箇所で必ず止まる

---

## 📝 次回セッション開始時の手順

1. このドキュメントを開く
2. 「Phase 1: パイプラインボタン本体」から実装開始
3. 各チェックリストを順番に消化
4. 動作確認 → デプロイ

---

**作成日**: 2026-01-17  
**作成者**: Claude (Sonnet 4)  
**対象セッション**: 次回以降
