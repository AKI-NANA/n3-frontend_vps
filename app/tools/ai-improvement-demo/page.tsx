// ============================================
// UI-5 デモページ: AI改善提案パネル
// ============================================

'use client';

import React, { useState } from 'react';
import AIImprovementPanel from '@/components/seo/ai-improvement-panel';

export default function AIImprovementDemoPage() {
  const [title, setTitle] = useState('Nintendo Switch Pro Controller Black');
  const [description, setDescription] = useState(
    'This is a brand new Nintendo Switch Pro Controller in black color. Great condition, never used.'
  );

  const handleApplyTitle = (newTitle: string) => {
    setTitle(newTitle);
    alert('タイトルが適用されました！');
  };

  const handleApplyDescription = (newDescription: string) => {
    setDescription(newDescription);
    alert('説明文が適用されました！');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI改善提案パネル - デモ
          </h1>
          <p className="text-gray-600">
            商品編集モーダルで使用できるAI改善提案パネルのデモです
          </p>
        </div>

        {/* 現在の商品情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            現在の商品情報
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明文
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* AI改善提案パネル */}
        <AIImprovementPanel
          productId="PROD-001"
          currentTitle={title}
          currentDescription={description}
          currentImages={[
            'https://via.placeholder.com/300',
            'https://via.placeholder.com/300/ff0000',
            'https://via.placeholder.com/300/00ff00',
          ]}
          healthScore={35}
          onApplyTitle={handleApplyTitle}
          onApplyDescription={handleApplyDescription}
        />
      </div>
    </div>
  );
}
