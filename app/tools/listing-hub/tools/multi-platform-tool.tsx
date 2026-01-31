// app/tools/listing-hub/tools/multi-platform-tool.tsx
/**
 * 🌍 Multi-Platform Listing Tool
 * 複数マーケットプレイスへの同時出品
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Rocket, CheckCircle, AlertCircle, Loader2, Search, Filter } from 'lucide-react';
import { useDispatch } from '@/components/n3/empire/base-hub-layout';

// マーケットプレイス定義
const MARKETPLACES = [
  { id: 'ebay_us', name: 'eBay US', icon: '🇺🇸', color: 'bg-blue-500' },
  { id: 'ebay_uk', name: 'eBay UK', icon: '🇬🇧', color: 'bg-blue-600' },
  { id: 'ebay_de', name: 'eBay DE', icon: '🇩🇪', color: 'bg-blue-700' },
  { id: 'amazon_us', name: 'Amazon US', icon: '🇺🇸', color: 'bg-orange-500' },
  { id: 'amazon_jp', name: 'Amazon JP', icon: '🇯🇵', color: 'bg-orange-600' },
  { id: 'qoo10', name: 'Qoo10', icon: '🛒', color: 'bg-red-500' },
  { id: 'shopify', name: 'Shopify', icon: '🛍️', color: 'bg-green-500' },
  { id: 'mercari', name: 'メルカリ', icon: '📦', color: 'bg-red-400' },
];

const ACCOUNTS = [
  { id: 'mjt', name: 'MJT (メイン)', status: 'active' },
  { id: 'green', name: 'GREEN (サブ)', status: 'active' },
  { id: 'mystical', name: 'Mystical Japan', status: 'active' },
];

export function MultiPlatformTool() {
  const { execute, loading, error } = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>(['ebay_us']);
  const [selectedAccount, setSelectedAccount] = useState('mjt');
  const [listingAction, setListingAction] = useState<'list_now' | 'schedule' | 'draft'>('list_now');
  const [scheduleTime, setScheduleTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  
  // 商品一覧取得（モック）
  useEffect(() => {
    // 実際はSupabaseから取得
    setProducts([
      { id: 1, title: 'ポケモンカード 25周年記念セット', sku: 'PKM-25TH-001', price: 149.99, status: 'ready', image: null },
      { id: 2, title: 'ドラゴンボール 一番くじ フィギュア', sku: 'DBZ-ICH-002', price: 89.99, status: 'ready', image: null },
      { id: 3, title: '鬼滅の刃 炭治郎 フィギュア', sku: 'KMY-TAN-003', price: 59.99, status: 'ready', image: null },
      { id: 4, title: 'ワンピース ルフィ ギア5', sku: 'ONE-G5-004', price: 199.99, status: 'draft', image: null },
      { id: 5, title: 'ナルト 疾風伝 フィギュア', sku: 'NRT-SHI-005', price: 79.99, status: 'ready', image: null },
    ]);
  }, []);
  
  const toggleProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const toggleMarketplace = (mpId: string) => {
    setSelectedMarketplaces(prev =>
      prev.includes(mpId)
        ? prev.filter(id => id !== mpId)
        : [...prev, mpId]
    );
  };
  
  const handleListing = async () => {
    if (selectedProducts.length === 0) {
      alert('出品する商品を選択してください');
      return;
    }
    if (selectedMarketplaces.length === 0) {
      alert('出品先マーケットプレイスを選択してください');
      return;
    }
    
    try {
      await execute('listing-multi-platform', 'execute', {
        productIds: selectedProducts,
        marketplaces: selectedMarketplaces,
        account: selectedAccount,
        action: listingAction,
        scheduleTime: listingAction === 'schedule' ? scheduleTime : null,
      });
      
      alert('出品処理を開始しました');
      setSelectedProducts([]);
    } catch (err) {
      console.error('Listing error:', err);
    }
  };
  
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* マーケットプレイス選択 */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          出品先マーケットプレイス
        </h3>
        <div className="flex flex-wrap gap-2">
          {MARKETPLACES.map(mp => (
            <button
              key={mp.id}
              onClick={() => toggleMarketplace(mp.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedMarketplaces.includes(mp.id)
                  ? `${mp.color} text-white`
                  : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }
              `}
            >
              <span>{mp.icon}</span>
              {mp.name}
              {selectedMarketplaces.includes(mp.id) && (
                <CheckCircle className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* アカウント・アクション選択 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4">
          <label className="block text-sm font-medium mb-2">アカウント</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded"
          >
            {ACCOUNTS.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4">
          <label className="block text-sm font-medium mb-2">アクション</label>
          <select
            value={listingAction}
            onChange={(e) => setListingAction(e.target.value as any)}
            className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded"
          >
            <option value="list_now">今すぐ出品</option>
            <option value="schedule">スケジュール出品</option>
            <option value="draft">下書き保存</option>
          </select>
        </div>
        
        {listingAction === 'schedule' && (
          <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4">
            <label className="block text-sm font-medium mb-2">出品日時</label>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded"
            />
          </div>
        )}
      </div>
      
      {/* 商品選択 */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)] flex items-center justify-between">
          <h3 className="font-bold">商品選択 ({selectedProducts.length}件選択中)</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="商品を検索..."
                className="pl-9 pr-3 py-1.5 bg-[var(--background)] border border-[var(--panel-border)] rounded text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-[var(--panel-border)] max-h-96 overflow-y-auto">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`
                flex items-center gap-4 p-4 cursor-pointer transition-colors
                ${selectedProducts.includes(product.id)
                  ? 'bg-[var(--accent)]/10'
                  : 'hover:bg-[var(--highlight)]'
                }
              `}
            >
              {/* チェックボックス */}
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center
                ${selectedProducts.includes(product.id)
                  ? 'bg-[var(--accent)] border-[var(--accent)]'
                  : 'border-[var(--panel-border)]'
                }
              `}>
                {selectedProducts.includes(product.id) && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
              
              {/* 画像 */}
              <div className="w-12 h-12 bg-[var(--highlight)] rounded flex items-center justify-center text-xl">
                📦
              </div>
              
              {/* 情報 */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{product.title}</div>
                <div className="text-xs text-[var(--text-muted)]">SKU: {product.sku}</div>
              </div>
              
              {/* 価格 */}
              <div className="text-right">
                <div className="font-bold text-green-500">${product.price}</div>
                <div className={`
                  text-xs px-2 py-0.5 rounded
                  ${product.status === 'ready' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-yellow-500/20 text-yellow-500'
                  }
                `}>
                  {product.status === 'ready' ? '準備完了' : '下書き'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 出品ボタン */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--text-muted)]">
          {selectedProducts.length}件の商品を{selectedMarketplaces.length}つのマーケットプレイスに出品
        </div>
        <button
          onClick={handleListing}
          disabled={loading || selectedProducts.length === 0 || selectedMarketplaces.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              処理中...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              出品開始
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}

export default MultiPlatformTool;
