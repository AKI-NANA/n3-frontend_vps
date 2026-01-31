// app/tools/research-hub/tools/ebay-research-tool.tsx
/**
 * 🛍️ eBay Research Tool
 * eBay商品検索・競合分析
 */

'use client';

import React, { useState } from 'react';
import { Search, ExternalLink, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { ToolExecutionPanel } from '@/components/n3/empire/base-hub-layout';

export function EbayResearchTool() {
  const [results, setResults] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<'keyword' | 'seller' | 'completed'>('keyword');
  
  const fields = [
    {
      id: 'query',
      label: searchType === 'seller' ? 'セラーID' : '検索キーワード',
      type: 'text' as const,
      placeholder: searchType === 'seller' ? 'seller_username' : '商品名やブランド名',
      required: true,
    },
    {
      id: 'category',
      label: 'カテゴリ',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'すべてのカテゴリ' },
        { value: '220', label: 'おもちゃ・ホビー' },
        { value: '1', label: 'コレクターズアイテム' },
        { value: '293', label: '家電' },
        { value: '11450', label: '衣料品' },
      ],
    },
    {
      id: 'condition',
      label: '商品状態',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'すべて' },
        { value: 'new', label: '新品' },
        { value: 'used', label: '中古' },
        { value: 'refurbished', label: 'リファービッシュ' },
      ],
      defaultValue: 'all',
    },
    {
      id: 'priceMin',
      label: '最低価格 ($)',
      type: 'number' as const,
      placeholder: '0',
    },
    {
      id: 'priceMax',
      label: '最高価格 ($)',
      type: 'number' as const,
      placeholder: '1000',
    },
    {
      id: 'marketplace',
      label: 'マーケットプレイス',
      type: 'select' as const,
      options: [
        { value: 'EBAY_US', label: 'eBay US' },
        { value: 'EBAY_UK', label: 'eBay UK' },
        { value: 'EBAY_DE', label: 'eBay DE' },
        { value: 'EBAY_AU', label: 'eBay AU' },
      ],
      defaultValue: 'EBAY_US',
    },
    {
      id: 'sortBy',
      label: 'ソート',
      type: 'select' as const,
      options: [
        { value: 'best_match', label: 'ベストマッチ' },
        { value: 'price_asc', label: '価格（安い順）' },
        { value: 'price_desc', label: '価格（高い順）' },
        { value: 'ending_soonest', label: '終了間近' },
        { value: 'newly_listed', label: '新着順' },
      ],
      defaultValue: 'best_match',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* 検索タイプ切り替え */}
      <div className="flex gap-2">
        {[
          { id: 'keyword', label: 'キーワード検索' },
          { id: 'seller', label: 'セラー分析' },
          { id: 'completed', label: '落札相場' },
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setSearchType(type.id as any)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${searchType === type.id
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }
            `}
          >
            {type.label}
          </button>
        ))}
      </div>
      
      {/* 検索フォーム */}
      <ToolExecutionPanel
        toolId="research-ebay-search"
        title={
          searchType === 'keyword' ? 'eBay商品検索' :
          searchType === 'seller' ? 'セラー分析' :
          '落札相場検索'
        }
        description={
          searchType === 'keyword' ? 'eBay Browse APIで商品を検索。価格、在庫、競合を分析。' :
          searchType === 'seller' ? '競合セラーの出品リスト、価格帯、評価を分析。' :
          '過去90日間の落札履歴から相場を分析。'
        }
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
                    <div className="w-24 h-24 flex-shrink-0 bg-white rounded overflow-hidden">
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
                      <span className="flex items-center gap-1 text-green-500 font-bold">
                        <DollarSign className="w-3 h-3" />
                        ${item.price?.toFixed(2) || 'N/A'}
                        {item.shippingCost && (
                          <span className="text-[var(--text-muted)] font-normal">
                            +${item.shippingCost.toFixed(2)} 送料
                          </span>
                        )}
                      </span>
                      {item.bids !== undefined && (
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                          <Users className="w-3 h-3" />
                          {item.bids} 入札
                        </span>
                      )}
                      {item.watchers && (
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                          👁 {item.watchers} ウォッチ
                        </span>
                      )}
                      {item.endTime && (
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                          <Clock className="w-3 h-3" />
                          {item.endTime}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`
                        px-2 py-0.5 rounded text-xs
                        ${item.condition === 'New' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-[var(--highlight)] text-[var(--text-muted)]'
                        }
                      `}>
                        {item.condition}
                      </span>
                      {item.sellerFeedback && (
                        <span className="px-2 py-0.5 bg-[var(--highlight)] rounded text-xs">
                          セラー評価: {item.sellerFeedback}%
                        </span>
                      )}
                      {item.freeShipping && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 rounded text-xs">
                          送料無料
                        </span>
                      )}
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
                      eBay
                    </a>
                    <button
                      onClick={() => {/* 商品登録処理 */}}
                      className="px-3 py-1.5 bg-[var(--accent)] text-white rounded text-xs hover:opacity-90"
                    >
                      登録
                    </button>
                    <button
                      onClick={() => {/* ウォッチリスト追加 */}}
                      className="px-3 py-1.5 bg-[var(--highlight)] rounded text-xs hover:bg-[var(--panel-border)]"
                    >
                      ウォッチ
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

export default EbayResearchTool;
