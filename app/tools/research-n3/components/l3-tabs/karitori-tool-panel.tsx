'use client';

import React, { memo, useState } from 'react';
import { RefreshCw, Bell, Eye, ShoppingCart, XCircle, Plus, Trash2, Settings } from 'lucide-react';
import { N3Button, N3Divider, N3Input } from '@/components/n3';
import type { KaritoriCategory } from '@/app/tools/research-table/types/research';

// ============================================================
// KaritoriToolPanel - Container Component
// ============================================================
// 刈り取りタブ用ツールパネル
// - Hooksを呼び出せる
// - 子要素間のgap/marginを定義
// ============================================================

export interface KaritoriToolPanelProps {
  // 統計
  stats: {
    watching: number;
    alert: number;
    purchased: number;
    skipped: number;
  };
  // カテゴリ
  categories: KaritoriCategory[];
  // 設定
  autoBuyCriteria: {
    minProfitRate: number;
    maxBsr: number;
  };
  // 状態
  loading?: boolean;
  selectedCount: number;
  // ハンドラー
  onRefresh: () => void;
  onAddCategory: (name: string, keyword: string) => void;
  onRemoveCategory: (id: string) => void;
  onStartWatching: () => void;
  onSetAlert: () => void;
  onPurchase: () => void;
  onSkip: () => void;
  onUpdateCriteria: (criteria: { minProfitRate: number; maxBsr: number }) => void;
}

export const KaritoriToolPanel = memo(function KaritoriToolPanel({
  stats,
  categories,
  autoBuyCriteria,
  loading = false,
  selectedCount,
  onRefresh,
  onAddCategory,
  onRemoveCategory,
  onStartWatching,
  onSetAlert,
  onPurchase,
  onSkip,
  onUpdateCriteria,
}: KaritoriToolPanelProps) {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryKeyword, setNewCategoryKeyword] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryKeyword) {
      onAddCategory(newCategoryName, newCategoryKeyword);
      setNewCategoryName('');
      setNewCategoryKeyword('');
      setShowCategoryForm(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
      {/* Stats Row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: '8px 12px',
          background: 'var(--highlight)',
          borderRadius: 6,
          fontSize: 12,
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)' }}>監視中: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-info)' }}>{stats.watching}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>アラート: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>{stats.alert}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>購入済: </span>
          <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{stats.purchased}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>スキップ: </span>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{stats.skipped}</span>
        </div>
        {selectedCount > 0 && (
          <>
            <N3Divider orientation="vertical" style={{ height: 16 }} />
            <div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                {selectedCount}件選択中
              </span>
            </div>
          </>
        )}
      </div>

      {/* Auto-Buy Criteria */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '6px 12px',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: 6,
          fontSize: 11,
        }}
      >
        <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>自動購入条件:</span>
        <span style={{ color: 'var(--text)' }}>
          利益率 ≥ {autoBuyCriteria.minProfitRate}% & BSR ≤ {autoBuyCriteria.maxBsr.toLocaleString()}
        </span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            padding: '2px 6px',
            fontSize: 10,
            background: 'transparent',
            border: '1px solid var(--panel-border)',
            borderRadius: 4,
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <Settings size={10} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: 12,
            background: 'var(--panel)',
            border: '1px solid var(--panel-border)',
            borderRadius: 6,
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              最低利益率 (%)
            </label>
            <N3Input
              type="number"
              value={autoBuyCriteria.minProfitRate}
              onChange={(e) => onUpdateCriteria({ ...autoBuyCriteria, minProfitRate: Number(e.target.value) })}
              size="sm"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              最大BSR
            </label>
            <N3Input
              type="number"
              value={autoBuyCriteria.maxBsr}
              onChange={(e) => onUpdateCriteria({ ...autoBuyCriteria, maxBsr: Number(e.target.value) })}
              size="sm"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <N3Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={14} />
          更新
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        <N3Button
          variant="secondary"
          size="sm"
          onClick={onStartWatching}
          disabled={selectedCount === 0}
        >
          <Eye size={14} />
          監視開始
        </N3Button>

        <N3Button
          variant="secondary"
          size="sm"
          onClick={onSetAlert}
          disabled={selectedCount === 0}
        >
          <Bell size={14} />
          アラート設定
        </N3Button>

        <N3Divider orientation="vertical" style={{ height: 28 }} />

        <N3Button
          variant="primary"
          size="sm"
          onClick={onPurchase}
          disabled={selectedCount === 0}
        >
          <ShoppingCart size={14} />
          購入
        </N3Button>

        <N3Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          disabled={selectedCount === 0}
        >
          <XCircle size={14} />
          スキップ
        </N3Button>
      </div>

      {/* Categories Section */}
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
            監視カテゴリ ({categories.length})
          </span>
          <N3Button
            variant="ghost"
            size="xs"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
          >
            <Plus size={12} />
            追加
          </N3Button>
        </div>

        {/* Add Category Form */}
        {showCategoryForm && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: 8,
              background: 'var(--highlight)',
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
            <N3Input
              placeholder="カテゴリ名"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              size="sm"
              style={{ flex: 1 }}
            />
            <N3Input
              placeholder="検索キーワード"
              value={newCategoryKeyword}
              onChange={(e) => setNewCategoryKeyword(e.target.value)}
              size="sm"
              style={{ flex: 1 }}
            />
            <N3Button variant="primary" size="sm" onClick={handleAddCategory}>
              追加
            </N3Button>
          </div>
        )}

        {/* Category List */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 8px',
                background: cat.is_active ? 'rgba(59, 130, 246, 0.1)' : 'var(--highlight)',
                border: `1px solid ${cat.is_active ? 'var(--color-primary)' : 'var(--panel-border)'}`,
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              <span style={{ color: 'var(--text)' }}>{cat.category_name}</span>
              <span style={{ color: 'var(--text-muted)' }}>({cat.high_profits_count})</span>
              <button
                onClick={() => onRemoveCategory(cat.id)}
                style={{
                  padding: 2,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

KaritoriToolPanel.displayName = 'KaritoriToolPanel';

export default KaritoriToolPanel;
