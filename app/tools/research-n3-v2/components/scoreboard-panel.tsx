/**
 * Scoreboard Panel
 * スコアリング結果の表示
 */

'use client';

import React from 'react';
import { TrendingUp, Award, AlertTriangle, Target } from 'lucide-react';

interface ScoreboardPanelProps {
  items: any[];
}

export default function ScoreboardPanel({ items }: ScoreboardPanelProps) {
  // Sort items by total score
  const sortedItems = [...items].sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0));
  const topItems = sortedItems.slice(0, 10);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">スコアボード</h2>
          <p className="text-sm text-gray-500 mt-1">高スコア商品のランキング</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white
                  ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.marketplace.toUpperCase()} - {item.identifier}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{item.scores?.total || 0}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">{item.profitMargin?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-gray-500">Profit</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
