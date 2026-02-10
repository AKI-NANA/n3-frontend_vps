/**
 * Yahoo Auctions Research Panel
 */

'use client';

import React, { useState } from 'react';
import { Search, Globe, Package, AlertCircle } from 'lucide-react';

interface YahooResearchPanelProps {
  onBatchSubmit: (ids: string[]) => void;
}

export default function YahooResearchPanel({ onBatchSubmit }: YahooResearchPanelProps) {
  const [inputText, setInputText] = useState('');

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Yahoo Auctions Research</h2>
          <p className="text-sm text-gray-500 mt-1">ヤフオクの商品リサーチ</p>
        </div>
        <div className="p-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="商品ID or URLを入力..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={() => {
              const lines = inputText.split('\n').filter(l => l.trim());
              onBatchSubmit(lines);
              setInputText('');
            }}
            className="mt-4 w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            リサーチ開始
          </button>
        </div>
      </div>
    </div>
  );
}
