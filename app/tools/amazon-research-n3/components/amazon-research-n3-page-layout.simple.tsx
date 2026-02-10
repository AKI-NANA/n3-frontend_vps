// app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.simple.tsx
/**
 * Amazon Research N3 - シンプル版（デバッグ用）
 */

'use client';

import React, { useState } from 'react';
import { Search, Bot, History } from 'lucide-react';
import { N3CollapsibleHeader, N3Button } from '@/components/n3';

export function AmazonResearchN3PageLayoutSimple() {
  const [activeTab, setActiveTab] = useState('research');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* ヘッダー */}
      <N3CollapsibleHeader title="Amazon Research N3" defaultExpanded={true}>
        <div style={{ padding: 16 }}>
          {/* タブ */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <N3Button
              onClick={() => setActiveTab('research')}
              variant={activeTab === 'research' ? 'primary' : 'secondary'}
              size="sm"
            >
              <Search size={14} />
              リサーチ
            </N3Button>
            <N3Button
              onClick={() => setActiveTab('automation')}
              variant={activeTab === 'automation' ? 'primary' : 'secondary'}
              size="sm"
            >
              <Bot size={14} />
              自動化
            </N3Button>
            <N3Button
              onClick={() => setActiveTab('history')}
              variant={activeTab === 'history' ? 'primary' : 'secondary'}
              size="sm"
            >
              <History size={14} />
              履歴
            </N3Button>
          </div>
        </div>
      </N3CollapsibleHeader>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
        {activeTab === 'research' && (
          <div>
            <h2>リサーチタブ</h2>
            <p>Amazon商品リサーチ機能</p>
          </div>
        )}
        
        {activeTab === 'automation' && (
          <div>
            <h2>自動化タブ</h2>
            <p>自動化設定（準備中）</p>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div>
            <h2>履歴タブ</h2>
            <p>リサーチ履歴（準備中）</p>
          </div>
        )}
      </div>
    </div>
  );
}
