// app/tools/research-hub/tools/arbitrage-scan-tool.tsx
/**
 * 🔀 Arbitrage Scan Tool
 * 国際価格差・アービトラージ検出
 */

'use client';

import React, { useState } from 'react';
import { Shuffle, DollarSign, TrendingUp, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { ToolExecutionPanel } from '@/components/n3/empire/base-hub-layout';

export function ArbitrageScanTool() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  
  const fields = [
    {
      id: 'sourceRegion',
      label: '仕入れ地域',
      type: 'select' as const,
      options: [
        { value: 'jp', label: '日本' },
        { value: 'us', label: 'アメリカ' },
        { value: 'cn', label: '中国' },
        { value: 'uk', label: 'イギリス' },
      ],
      defaultValue: 'jp',
      required: true,
    },
    {
      id: 'targetRegion',
      label: '販売地域',
      type: 'select' as const,
      options: [
        { value: 'us', label: 'アメリカ' },
        { value: 'uk', label: 'イギリス' },
        { value: 'de', label: 'ドイツ' },
        { value: 'au', label: 'オーストラリア' },
      ],
      defaultValue: 'us',
      required: true,
    },
    {
      id: 'category',
      label: 'カテゴリ',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'すべて' },
        { value: 'toys', label: 'おもちゃ' },
        { value: 'collectibles', label: 'コレクターズ' },
        { value: 'anime', label: 'アニメグッズ' },
        { value: 'vintage', label: 'ヴィンテージ' },
      ],
      defaultValue: 'all',
    },
    {
      id: 'minProfit',
      label: '最低利益率 (%)',
      type: 'number' as const,
      placeholder: '20',
      defaultValue: 20,
    },
    {
      id: 'includeShipping',
      label: '送料込み計算',
      type: 'checkbox' as const,
      defaultValue: true,
    },
  ];
  
  return (
    <div className="space-y-6">
      <ToolExecutionPanel
        toolId="research-arbitrage-scan"
        title="アービトラージスキャン"
        description="国際価格差を自動検出。仕入れ価格、送料、関税を含めた利益計算を行います。"
        fields={fields}
        onSuccess={(result) => {
          if (result?.opportunities) {
            setOpportunities(result.opportunities);
          }
        }}
      />
      
      {/* 検出結果 */}
      {opportunities.length > 0 && (
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
          <div className="p-4 border-b border-[var(--panel-border)]">
            <h3 className="font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              アービトラージ機会 ({opportunities.length}件)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--highlight)]">
                <tr>
                  <th className="px-4 py-2 text-left">商品名</th>
                  <th className="px-4 py-2 text-right">仕入価格</th>
                  <th className="px-4 py-2 text-right">販売価格</th>
                  <th className="px-4 py-2 text-right">送料</th>
                  <th className="px-4 py-2 text-right">利益</th>
                  <th className="px-4 py-2 text-right">利益率</th>
                  <th className="px-4 py-2 text-center">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--panel-border)]">
                {opportunities.map((opp, index) => (
                  <tr key={index} className="hover:bg-[var(--highlight)]">
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate">{opp.title}</div>
                      <div className="text-xs text-[var(--text-muted)]">{opp.asin || opp.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-blue-500">${opp.sourcePrice?.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-green-500">${opp.targetPrice?.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-muted)]">
                      ${opp.shippingCost?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-green-500">
                      ${opp.profit?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${opp.profitMargin >= 30 
                          ? 'bg-green-500/20 text-green-500' 
                          : opp.profitMargin >= 20 
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-[var(--highlight)] text-[var(--text-muted)]'
                        }
                      `}>
                        {opp.profitMargin?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={opp.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-[var(--panel-border)] rounded"
                          title="仕入先を開く"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {/* 商品登録処理 */}}
                          className="px-2 py-1 bg-[var(--accent)] text-white text-xs rounded hover:opacity-90"
                        >
                          登録
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArbitrageScanTool;
