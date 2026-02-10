/**
 * Analysis Results Panel
 * リサーチ結果の分析表示
 */

'use client';

import React from 'react';
import {
  Package, TrendingUp, DollarSign, AlertTriangle,
  CheckCircle, XCircle, Clock, Eye,
} from 'lucide-react';

interface AnalysisResultsPanelProps {
  items: any[];
  selectedItems: Set<string>;
  onSelectItem: (id: string) => void;
}

export default function AnalysisResultsPanel({
  items,
  selectedItems,
  onSelectItem,
}: AnalysisResultsPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'analyzing':
        return <Clock className="w-4 h-4 text-amber-500 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Package className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">データがありません</p>
        <p className="text-sm mt-2">リサーチを実行してデータを追加してください</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">総アイテム</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">完了</p>
              <p className="text-2xl font-bold text-green-600">
                {items.filter(i => i.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">平均利益率</p>
              <p className="text-2xl font-bold text-blue-600">
                {(items
                  .filter(i => i.profitMargin)
                  .reduce((acc, i) => acc + i.profitMargin, 0) / items.length || 0
                ).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">高スコア</p>
              <p className="text-2xl font-bold text-purple-600">
                {items.filter(i => i.scores?.total >= 70).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && items.every(i => selectedItems.has(i.id))}
                    onChange={() => {
                      if (items.every(i => selectedItems.has(i.id))) {
                        items.forEach(i => onSelectItem(i.id));
                      } else {
                        items.forEach(i => !selectedItems.has(i.id) && onSelectItem(i.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title / ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketplace
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scores
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${selectedItems.has(item.id) ? 'bg-indigo-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => onSelectItem(item.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {getStatusIcon(item.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.identifier}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {item.marketplace.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {item.currency === 'JPY' ? '¥' : '$'}
                      {item.price.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {item.profitMargin && (
                      <p className={`text-sm font-medium ${
                        item.profitMargin >= 30 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {item.profitMargin.toFixed(1)}%
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {item.scores && (
                        <>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(item.scores.total)}`}>
                            {item.scores.total}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
