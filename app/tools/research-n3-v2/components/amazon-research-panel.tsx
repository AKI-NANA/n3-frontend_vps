/**
 * Amazon Research Panel
 * Keepa API統合によるASIN一括リサーチ
 */

'use client';

import React, { useState, useRef } from 'react';
import {
  Search, Upload, AlertCircle, CheckCircle, Info,
  Globe, Package, TrendingUp, DollarSign,
  Copy, ExternalLink, RefreshCw, Settings,
} from 'lucide-react';

interface AmazonResearchPanelProps {
  onBatchSubmit: (asins: string[]) => void;
  apiStatus?: any;
}

const AMAZON_REGIONS = [
  { code: 'JP', name: '日本', domain: 5 },
  { code: 'US', name: 'アメリカ', domain: 1 },
  { code: 'UK', name: 'イギリス', domain: 3 },
  { code: 'DE', name: 'ドイツ', domain: 4 },
  { code: 'FR', name: 'フランス', domain: 6 },
  { code: 'CA', name: 'カナダ', domain: 7 },
  { code: 'IT', name: 'イタリア', domain: 8 },
  { code: 'ES', name: 'スペイン', domain: 9 },
];

export default function AmazonResearchPanel({
  onBatchSubmit,
  apiStatus,
}: AmazonResearchPanelProps) {
  const [inputText, setInputText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('JP');
  const [researchMode, setResearchMode] = useState<'asin' | 'keyword' | 'seller'>('asin');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    const lines = inputText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (researchMode === 'asin') {
      // Validate ASINs (should be 10 characters)
      const validAsins = lines.filter(asin => /^[A-Z0-9]{10}$/.test(asin));
      if (validAsins.length > 0) {
        onBatchSubmit(validAsins);
        setInputText('');
      } else {
        alert('有効なASINを入力してください（10文字の英数字）');
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const asinCount = inputText.split('\n').filter(line => line.trim()).length;
  const estimatedTokens = asinCount * 2; // Rough estimate
  const hasApiKey = apiStatus?.hasApiKey;
  const tokensLeft = apiStatus?.tokensLeft;

  return (
    <div className="p-6 space-y-6">
      {/* API Status Alert */}
      {!hasApiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900">Keepa API未設定</h3>
            <p className="text-sm text-amber-700 mt-1">
              Keepa APIキーが設定されていません。環境変数に KEEPA_API_KEY を設定してください。
            </p>
            <a
              href="https://keepa.com/#!api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
            >
              Keepa APIを取得 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Amazon Product Research</h2>
          <p className="text-sm text-gray-500 mt-1">
            ASIN、キーワード、またはセラーIDを入力してリサーチを開始
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Research Mode Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[
              { id: 'asin' as const, label: 'ASIN', icon: Package },
              { id: 'keyword' as const, label: 'キーワード', icon: Search },
              { id: 'seller' as const, label: 'セラー', icon: TrendingUp },
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setResearchMode(mode.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md
                  transition-all font-medium text-sm
                  ${researchMode === mode.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Region Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              マーケットプレイス
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AMAZON_REGIONS.map(region => (
                <button
                  key={region.code}
                  onClick={() => setSelectedRegion(region.code)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${selectedRegion === region.code
                      ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="mr-1">{region.code}</span>
                  <span className="text-xs text-gray-500">{region.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {researchMode === 'asin' && 'ASIN入力 (1行に1つ)'}
                {researchMode === 'keyword' && 'キーワード入力 (1行に1つ)'}
                {researchMode === 'seller' && 'セラーID入力 (1行に1つ)'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  貼り付け
                </button>
                <button
                  onClick={() => setInputText('')}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  クリア
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                researchMode === 'asin'
                  ? "B08N5WRWNW\nB07XJ8BKDS\nB09YV3K3SY\n..."
                  : researchMode === 'keyword'
                  ? "wireless headphones\nsmart watch\n..."
                  : "seller_id_1\nseller_id_2\n..."
              }
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
              spellCheck={false}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {asinCount > 0 && `${asinCount} items`}
              </span>
              {tokensLeft !== undefined && (
                <span className="text-xs text-gray-500">
                  推定消費: {estimatedTokens} tokens / 残り: {tokensLeft} tokens
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!inputText.trim() || !hasApiKey}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            リサーチ開始
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-semibold text-blue-900">使い方のヒント</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• ASINは10文字の英数字です（例: B08N5WRWNW）</li>
              <li>• 複数のASINを一度に処理する場合は、1行に1つずつ入力してください</li>
              <li>• ExcelやGoogleスプレッドシートから直接コピー&ペーストできます</li>
              <li>• 最大1000個まで一括処理可能です（API制限による）</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">最近のリサーチ</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[
              { time: '5分前', count: 25, region: 'JP', status: 'completed' },
              { time: '1時間前', count: 100, region: 'US', status: 'completed' },
              { time: '3時間前', count: 50, region: 'UK', status: 'processing' },
            ].map((search, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    search.status === 'completed' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
                  }`} />
                  <div>
                    <p className="text-sm text-gray-900">{search.count} ASINs</p>
                    <p className="text-xs text-gray-500">{search.time} • {search.region}</p>
                  </div>
                </div>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  再実行
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
