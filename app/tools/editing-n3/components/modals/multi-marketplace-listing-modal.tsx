/**
 * MultiMarketplaceListingModal - 多販路一括出品モーダル
 * 
 * Phase 10: 複数販路への一括出品UI
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X, ShoppingBag, Globe, Check, AlertCircle, Loader2,
  DollarSign, TrendingUp, Calendar, Play, Clock, Info
} from 'lucide-react';
import { 
  multiMarketplaceListingService, 
  type MarketplaceId,
  type ListingRequest 
} from '@/lib/marketplace/multi-marketplace-listing-service';

// ============================================================
// 型定義
// ============================================================

interface Product {
  id: number;
  sku?: string;
  title_en?: string;
  title_ja?: string;
  listing_price?: number;
  cost_price?: number;
  profit_margin?: number;
  stock_quantity?: number;
  workflow_status?: string;
  marketplace_listings?: Record<string, any>;
}

interface MultiMarketplaceListingModalProps {
  products: Product[];
  onClose: () => void;
  onComplete?: (results: any[]) => void;
}

interface MarketplaceOption {
  id: MarketplaceId;
  label: string;
  region: string;
  currency: string;
  feeRate: number;
  enabled: boolean;
  listed?: boolean;
  estimatedProfit?: number;
}

// ============================================================
// 定数
// ============================================================

const MARKETPLACE_OPTIONS: MarketplaceOption[] = [
  // eBay
  { id: 'ebay_us', label: 'eBay US', region: '🇺🇸', currency: 'USD', feeRate: 0.1315, enabled: true },
  { id: 'ebay_uk', label: 'eBay UK', region: '🇬🇧', currency: 'GBP', feeRate: 0.1315, enabled: true },
  { id: 'ebay_de', label: 'eBay DE', region: '🇩🇪', currency: 'EUR', feeRate: 0.1315, enabled: true },
  { id: 'ebay_au', label: 'eBay AU', region: '🇦🇺', currency: 'AUD', feeRate: 0.1315, enabled: true },
  
  // Qoo10
  { id: 'qoo10_jp', label: 'Qoo10 JP', region: '🇯🇵', currency: 'JPY', feeRate: 0.12, enabled: true },
  
  // Shopee
  { id: 'shopee_sg', label: 'Shopee SG', region: '🇸🇬', currency: 'SGD', feeRate: 0.08, enabled: true },
  { id: 'shopee_my', label: 'Shopee MY', region: '🇲🇾', currency: 'MYR', feeRate: 0.08, enabled: false },
  { id: 'shopee_th', label: 'Shopee TH', region: '🇹🇭', currency: 'THB', feeRate: 0.08, enabled: false },
  
  // Shopify
  { id: 'shopify', label: 'Shopify', region: '🌐', currency: 'USD', feeRate: 0.029, enabled: true },
  
  // Amazon
  { id: 'amazon_jp', label: 'Amazon JP', region: '🇯🇵', currency: 'JPY', feeRate: 0.15, enabled: false },
  { id: 'amazon_us', label: 'Amazon US', region: '🇺🇸', currency: 'USD', feeRate: 0.15, enabled: false },
];

// ============================================================
// メインコンポーネント
// ============================================================

export function MultiMarketplaceListingModal({
  products,
  onClose,
  onComplete,
}: MultiMarketplaceListingModalProps) {
  // 状態
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<MarketplaceId[]>(['ebay_us']);
  const [listingMode, setListingMode] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [step, setStep] = useState<'select' | 'confirm' | 'progress' | 'complete'>('select');

  // 計算
  const totalProducts = products.length;
  const totalListings = totalProducts * selectedMarketplaces.length;

  // 販路オプション（出品済みフラグ付き）
  const marketplaceOptionsWithStatus = useMemo(() => {
    return MARKETPLACE_OPTIONS.map(mp => {
      // 最初の商品で出品済みかどうかを判定
      const firstProduct = products[0];
      const listed = firstProduct?.marketplace_listings?.[mp.id]?.status === 'listed';
      return { ...mp, listed };
    });
  }, [products]);

  // 販路選択トグル
  const toggleMarketplace = (id: MarketplaceId) => {
    setSelectedMarketplaces(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  // 全選択/解除
  const toggleAll = (select: boolean) => {
    if (select) {
      setSelectedMarketplaces(
        marketplaceOptionsWithStatus
          .filter(mp => mp.enabled && !mp.listed)
          .map(mp => mp.id)
      );
    } else {
      setSelectedMarketplaces([]);
    }
  };

  // 出品実行
  const handleSubmit = async () => {
    if (selectedMarketplaces.length === 0) return;

    setStep('progress');
    setIsSubmitting(true);

    const allResults: any[] = [];
    
    for (const product of products) {
      const scheduleAt = listingMode === 'schedule' && scheduleDate && scheduleTime
        ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
        : undefined;

      const result = await multiMarketplaceListingService.requestListing({
        productMasterId: product.id,
        marketplaces: selectedMarketplaces,
        options: {
          scheduleAt,
          priority: 'normal',
        },
      });

      allResults.push({
        productId: product.id,
        sku: product.sku,
        ...result,
      });
    }

    setResults(allResults);
    setIsSubmitting(false);
    setStep('complete');
    onComplete?.(allResults);
  };

  // 販路カードレンダリング
  const renderMarketplaceCard = (mp: MarketplaceOption & { listed?: boolean }) => {
    const isSelected = selectedMarketplaces.includes(mp.id);
    const isDisabled = !mp.enabled || mp.listed;

    return (
      <button
        key={mp.id}
        onClick={() => !isDisabled && toggleMarketplace(mp.id)}
        disabled={isDisabled}
        className={`
          relative p-3 rounded-lg border-2 transition-all text-left
          ${isDisabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' 
            : isSelected
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        {/* チェックマーク */}
        {isSelected && !isDisabled && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}

        {/* 出品済みバッジ */}
        {mp.listed && (
          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
            出品済み
          </div>
        )}

        {/* コンテンツ */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{mp.region}</span>
          <span className="font-medium text-sm">{mp.label}</span>
        </div>
        <div className="text-xs text-gray-500">
          <span className="mr-2">{mp.currency}</span>
          <span>手数料 {(mp.feeRate * 100).toFixed(1)}%</span>
        </div>
        
        {!mp.enabled && (
          <div className="mt-1 text-xs text-orange-500">
            近日対応予定
          </div>
        )}
      </button>
    );
  };

  // ステップ: 販路選択
  const renderSelectStep = () => (
    <>
      {/* 商品情報 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">出品対象</span>
          <span className="font-bold">{totalProducts}商品</span>
        </div>
        {products.length === 1 && (
          <div className="text-sm">
            <div className="font-medium truncate">{products[0].title_en || products[0].title_ja}</div>
            <div className="text-gray-500">SKU: {products[0].sku || 'N/A'}</div>
          </div>
        )}
      </div>

      {/* 販路選択 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">出品先を選択</h4>
          <div className="flex gap-2">
            <button
              onClick={() => toggleAll(true)}
              className="text-xs text-blue-600 hover:underline"
            >
              全選択
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => toggleAll(false)}
              className="text-xs text-gray-600 hover:underline"
            >
              解除
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {marketplaceOptionsWithStatus.map(renderMarketplaceCard)}
        </div>
      </div>

      {/* スケジュール設定 */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">出品タイミング</h4>
        <div className="flex gap-3">
          <button
            onClick={() => setListingMode('now')}
            className={`flex-1 p-3 rounded-lg border-2 transition ${
              listingMode === 'now' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Play className="w-5 h-5 mx-auto mb-1" />
            <div className="text-sm font-medium">即時出品</div>
          </button>
          <button
            onClick={() => setListingMode('schedule')}
            className={`flex-1 p-3 rounded-lg border-2 transition ${
              listingMode === 'schedule' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-sm font-medium">スケジュール</div>
          </button>
        </div>

        {listingMode === 'schedule' && (
          <div className="mt-3 flex gap-3">
            <input
              type="date"
              value={scheduleDate}
              onChange={e => setScheduleDate(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              min={new Date().toISOString().split('T')[0]}
            />
            <input
              type="time"
              value={scheduleTime}
              onChange={e => setScheduleTime(e.target.value)}
              className="w-32 px-3 py-2 border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* サマリー */}
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <div className="flex items-center gap-2 text-blue-800">
          <Info className="w-4 h-4" />
          <span className="text-sm">
            {totalProducts}商品 × {selectedMarketplaces.length}販路 = <strong>{totalListings}件</strong>の出品リクエスト
          </span>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          onClick={() => setStep('confirm')}
          disabled={selectedMarketplaces.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          確認へ進む
        </button>
      </div>
    </>
  );

  // ステップ: 確認
  const renderConfirmStep = () => (
    <>
      <div className="mb-6">
        <h4 className="font-medium mb-3">出品内容の確認</h4>
        
        <div className="border rounded-lg divide-y">
          <div className="p-3 flex justify-between">
            <span className="text-gray-600">対象商品</span>
            <span className="font-medium">{totalProducts}件</span>
          </div>
          <div className="p-3 flex justify-between">
            <span className="text-gray-600">出品先販路</span>
            <span className="font-medium">{selectedMarketplaces.length}件</span>
          </div>
          <div className="p-3 flex justify-between">
            <span className="text-gray-600">合計リクエスト</span>
            <span className="font-bold text-blue-600">{totalListings}件</span>
          </div>
          <div className="p-3 flex justify-between">
            <span className="text-gray-600">タイミング</span>
            <span className="font-medium">
              {listingMode === 'now' ? '即時' : `${scheduleDate} ${scheduleTime}`}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">選択した販路</h4>
        <div className="flex flex-wrap gap-2">
          {selectedMarketplaces.map(id => {
            const mp = MARKETPLACE_OPTIONS.find(m => m.id === id);
            return mp ? (
              <span key={id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {mp.region} {mp.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setStep('select')}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          戻る
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          出品を実行
        </button>
      </div>
    </>
  );

  // ステップ: 進行中
  const renderProgressStep = () => (
    <div className="text-center py-8">
      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
      <h4 className="font-medium mb-2">出品リクエストを送信中...</h4>
      <p className="text-sm text-gray-500">
        {totalListings}件のリクエストをキューに追加しています
      </p>
    </div>
  );

  // ステップ: 完了
  const renderCompleteStep = () => {
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;
    const totalQueued = results.reduce((sum, r) => sum + (r.queueIds?.length || 0), 0);

    return (
      <>
        <div className="text-center py-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            failCount === 0 ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {failCount === 0 ? (
              <Check className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            )}
          </div>
          <h4 className="font-medium text-lg mb-2">
            {failCount === 0 ? '出品リクエスト完了！' : '一部エラーがあります'}
          </h4>
          <p className="text-sm text-gray-500">
            {totalQueued}件のリクエストをキューに追加しました
          </p>
        </div>

        <div className="border rounded-lg divide-y mb-6">
          <div className="p-3 flex justify-between">
            <span className="text-gray-600">成功</span>
            <span className="font-medium text-green-600">{successCount}件</span>
          </div>
          {failCount > 0 && (
            <div className="p-3 flex justify-between">
              <span className="text-gray-600">失敗</span>
              <span className="font-medium text-red-600">{failCount}件</span>
            </div>
          )}
          <div className="p-3 flex justify-between">
            <span className="text-gray-600">キュー追加</span>
            <span className="font-bold text-blue-600">{totalQueued}件</span>
          </div>
        </div>

        {/* エラー詳細 */}
        {results.some(r => r.errors?.length > 0) && (
          <div className="mb-6 p-3 bg-red-50 rounded-lg text-sm">
            <h5 className="font-medium text-red-800 mb-2">エラー詳細:</h5>
            <ul className="list-disc list-inside text-red-600">
              {results.flatMap(r => r.errors || []).slice(0, 5).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            閉じる
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">多販路一括出品</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-64px)]">
          {step === 'select' && renderSelectStep()}
          {step === 'confirm' && renderConfirmStep()}
          {step === 'progress' && renderProgressStep()}
          {step === 'complete' && renderCompleteStep()}
        </div>
      </div>
    </div>
  );
}

export default MultiMarketplaceListingModal;
