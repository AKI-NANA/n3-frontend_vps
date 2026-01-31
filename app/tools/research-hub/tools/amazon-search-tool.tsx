// app/tools/research-hub/tools/amazon-search-tool.tsx
/**
 * 🛒 Amazon Search Tool
 * Research Hub内のAmazon商品検索ツール
 */

'use client';

import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, TrendingUp, DollarSign, Package } from 'lucide-react';
import { useDispatch, ToolExecutionPanel } from '@/components/n3/empire/base-hub-layout';
import { DEFAULT_FIELDS_BY_CATEGORY } from '@/components/n3/empire/tool-definitions';

// ============================================================
// Amazon Search Tool
// ============================================================

export function AmazonSearchTool() {
  const { execute, loading, error, activeJobs } = useDispatch();
  const [results, setResults] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState<'keyword' | 'asin' | 'seller'>('keyword');
  
  const handleSearch = async (params: any) => {
    try {
      const result = await execute('research-amazon-search', 'execute', {
        ...params,
        mode: searchMode,
      });
      
      if (result?.items) {
        setResults(result.items);
      }
    } catch (err) {
      console.error('Amazon search error:', err);
    }
  };
  
  const fields = [
    {
      id: 'keywords',
      label: '検索キーワード',
      labelEn: 'Keywords',
      type: 'text' as const,
      placeholder: searchMode === 'asin' ? 'B0XXXXXXXX, B0YYYYYYYY' : '商品名やブランド名',
      required: true,
    },
    {
      id: 'category',
      label: 'カテゴリ',
      labelEn: 'Category',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'すべてのカテゴリ' },
        { value: 'toys', label: 'おもちゃ・ゲーム' },
        { value: 'collectibles', label: 'コレクターズアイテム' },
        { value: 'electronics', label: '家電・電子機器' },
        { value: 'fashion', label: 'ファッション' },
        { value: 'home', label: 'ホーム&キッチン' },
      ],
    },
    {
      id: 'priceMin',
      label: '最低価格 ($)',
      labelEn: 'Min Price',
      type: 'number' as const,
      placeholder: '0',
    },
    {
      id: 'priceMax',
      label: '最高価格 ($)',
      labelEn: 'Max Price',
      type: 'number' as const,
      placeholder: '1000',
    },
    {
      id: 'region',
      label: '地域',
      labelEn: 'Region',
      type: 'select' as const,
      options: [
        { value: 'us', label: 'Amazon US' },
        { value: 'jp', label: 'Amazon JP' },
        { value: 'uk', label: 'Amazon UK' },
        { value: 'de', label: 'Amazon DE' },
      ],
      defaultValue: 'us',
    },
    {
      id: 'sortBy',
      label: 'ソート',
      labelEn: 'Sort By',
      type: 'select' as const,
      options: [
        { value: 'relevance', label: '関連度' },
        { value: 'price_asc', label: '価格（安い順）' },
        { value: 'price_desc', label: '価格（高い順）' },
        { value: 'sales', label: '売上ランキング' },
        { value: 'reviews', label: 'レビュー数' },
      ],
      defaultValue: 'relevance',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* 検索モード切り替え */}
      <div className="flex gap-2">
        {[
          { id: 'keyword', label: 'キーワード検索' },
          { id: 'asin', label: 'ASIN検索' },
          { id: 'seller', label: 'セラー検索' },
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => setSearchMode(mode.id as any)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${searchMode === mode.id
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }
            `}
          >
            {mode.label}
          </button>
        ))}
      </div>
      
      {/* 検索フォーム */}
      <ToolExecutionPanel
        toolId="research-amazon-search"
        title="Amazon商品検索"
        description="Amazon PA-APIを使用して商品情報を取得します。価格差、在庫状況、レビュー数などを分析。"
        fields={fields}
        onSuccess={(result) => {
          if (result?.items) {
            setResults(result.items);
          }
        }}
      />
      
      {/* 検索結果 */}
      {results.length > 0 && (
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
          <div className="p-4 border-b border-[var(--panel-border)]">
            <h3 className="font-bold">検索結果 ({results.length}件)</h3>
          </div>
          <div className="divide-y divide-[var(--panel-border)]">
            {results.map((item, index) => (
              <div key={index} className="p-4 hover:bg-[var(--highlight)] transition-colors">
                <div className="flex gap-4">
                  {/* 画像 */}
                  {item.image && (
                    <div className="w-20 h-20 flex-shrink-0 bg-white rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      <span className="flex items-center gap-1 text-green-500">
                        <DollarSign className="w-3 h-3" />
                        ${item.price?.toFixed(2) || 'N/A'}
                      </span>
                      {item.salesRank && (
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                          <TrendingUp className="w-3 h-3" />
                          #{item.salesRank.toLocaleString()}
                        </span>
                      )}
                      {item.reviews && (
                        <span className="text-[var(--text-muted)]">
                          ⭐ {item.rating} ({item.reviews}件)
                        </span>
                      )}
                      {item.availability && (
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {item.availability}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-[var(--text-muted)]">
                      ASIN: {item.asin}
                    </div>
                  </div>
                  
                  {/* アクション */}
                  <div className="flex flex-col gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-[var(--highlight)] rounded text-xs hover:bg-[var(--panel-border)]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Amazon
                    </a>
                    <button
                      onClick={() => {/* 商品登録処理 */}}
                      className="px-3 py-1.5 bg-[var(--accent)] text-white rounded text-xs hover:opacity-90"
                    >
                      登録
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AmazonSearchTool;
