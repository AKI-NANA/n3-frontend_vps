/**
 * eBay Research Panel
 * eBay Browse API統合による商品リサーチ
 */

'use client';

import React, { useState } from 'react';
import {
  Search, Globe, TrendingUp, Package,
  AlertCircle, ExternalLink, Filter,
  DollarSign, Calendar, Award, Users,
  Copy, Download, RefreshCw,
} from 'lucide-react';

interface EbayResearchPanelProps {
  onBatchSubmit: (itemIds: string[]) => void;
  apiStatus?: any;
}

const EBAY_MARKETS = [
  { id: 'EBAY_US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { id: 'EBAY_UK', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { id: 'EBAY_DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { id: 'EBAY_AU', name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { id: 'EBAY_CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
];

const SEARCH_FILTERS = {
  condition: [
    { value: 'NEW', label: '新品' },
    { value: 'USED', label: '中古' },
    { value: 'REFURBISHED', label: '整備済み' },
  ],
  listingType: [
    { value: 'AUCTION', label: 'オークション' },
    { value: 'BUY_IT_NOW', label: '即決' },
    { value: 'BOTH', label: '両方' },
  ],
  sortBy: [
    { value: 'BEST_MATCH', label: 'ベストマッチ' },
    { value: 'PRICE_LOW', label: '価格（安い順）' },
    { value: 'PRICE_HIGH', label: '価格（高い順）' },
    { value: 'END_TIME_SOONEST', label: '終了時間（早い順）' },
  ],
};

type SearchMode = 'item' | 'keyword' | 'seller' | 'sold';

export default function EbayResearchPanel({
  onBatchSubmit,
  apiStatus,
}: EbayResearchPanelProps) {
  const [searchMode, setSearchMode] = useState<SearchMode>('sold');
  const [inputText, setInputText] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('EBAY_US');
  const [filters, setFilters] = useState({
    condition: 'NEW',
    listingType: 'BOTH',
    sortBy: 'BEST_MATCH',
    priceMin: '',
    priceMax: '',
    sellerId: '',
  });

  const isAuthorized = apiStatus?.isAuthorized;

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    const lines = inputText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (searchMode === 'item') {
      // Process item IDs
      onBatchSubmit(lines);
    } else if (searchMode === 'keyword') {
      // Process keywords - would trigger different API
      console.log('Keyword search:', lines);
    } else if (searchMode === 'seller') {
      // Process seller analysis
      console.log('Seller analysis:', lines);
    } else if (searchMode === 'sold') {
      // Search sold listings
      console.log('Sold listings search:', lines);
    }

    setInputText('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* API Status */}
      {!isAuthorized && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900">eBay API未接続</h3>
            <p className="text-sm text-red-700 mt-1">
              eBay APIの認証が必要です。設定画面から認証を完了してください。
            </p>
            <a
              href="/tools/settings-n3?tab=ebay"
              className="inline-flex items-center gap-1 mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
            >
              eBay API設定へ <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Search Mode Selection */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">eBay Product Research</h2>
          <p className="text-sm text-gray-500 mt-1">
            売れ筋商品の分析とセラーリサーチ
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Mode Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'sold' as const, label: '売れ筋分析', icon: TrendingUp, color: 'text-green-600' },
              { id: 'keyword' as const, label: 'キーワード', icon: Search, color: 'text-blue-600' },
              { id: 'seller' as const, label: 'セラー分析', icon: Users, color: 'text-purple-600' },
              { id: 'item' as const, label: 'Item ID', icon: Package, color: 'text-orange-600' },
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setSearchMode(mode.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${searchMode === mode.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <mode.icon className={`w-5 h-5 mx-auto mb-1 ${
                  searchMode === mode.id ? 'text-indigo-600' : mode.color
                }`} />
                <p className={`text-xs font-medium ${
                  searchMode === mode.id ? 'text-indigo-900' : 'text-gray-700'
                }`}>
                  {mode.label}
                </p>
              </button>
            ))}
          </div>

          {/* Market Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              マーケットプレイス
            </label>
            <div className="flex gap-2">
              {EBAY_MARKETS.map(market => (
                <button
                  key={market.id}
                  onClick={() => setSelectedMarket(market.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all
                    ${selectedMarket === market.id
                      ? 'bg-red-100 text-red-700 border-2 border-red-300'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span>{market.flag}</span>
                  <span>{market.currency}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters (for sold/keyword modes) */}
          {(searchMode === 'sold' || searchMode === 'keyword') && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    商品状態
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {SEARCH_FILTERS.condition.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    出品形式
                  </label>
                  <select
                    value={filters.listingType}
                    onChange={(e) => setFilters({ ...filters, listingType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {SEARCH_FILTERS.listingType.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    並び順
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {SEARCH_FILTERS.sortBy.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    最低価格
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                      placeholder="0"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    最高価格
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                      placeholder="999999"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {searchMode === 'item' && 'Item ID入力 (1行に1つ)'}
                {searchMode === 'keyword' && 'キーワード入力'}
                {searchMode === 'seller' && 'セラーID入力'}
                {searchMode === 'sold' && 'キーワード入力（売れ筋検索）'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.readText().then(text => setInputText(text))}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  貼り付け
                </button>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                searchMode === 'item'
                  ? "123456789012\n234567890123\n..."
                  : searchMode === 'keyword' || searchMode === 'sold'
                  ? "vintage rolex watch\ncanon camera lens\n..."
                  : "seller_name_1\nseller_name_2\n..."
              }
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
              spellCheck={false}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!inputText.trim() || !isAuthorized}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            {searchMode === 'sold' ? '売れ筋分析開始' : 'リサーチ開始'}
          </button>
        </div>
      </div>

      {/* Top Selling Categories */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">人気カテゴリ</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Electronics', count: 15234, trend: 'up' },
              { name: 'Collectibles', count: 8923, trend: 'up' },
              { name: 'Fashion', count: 7654, trend: 'down' },
              { name: 'Home & Garden', count: 6543, trend: 'up' },
              { name: 'Sporting Goods', count: 5432, trend: 'stable' },
              { name: 'Toys & Hobbies', count: 4321, trend: 'up' },
            ].map((category, index) => (
              <button
                key={index}
                className="flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">{category.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{category.count.toLocaleString()}</span>
                  {category.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                  {category.trend === 'down' && <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
