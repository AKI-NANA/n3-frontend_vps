// app/tools/editing-n3/components/l3-tabs/ComplianceTab/filter-management-panel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Plus, Trash2, Download, Search } from 'lucide-react';
import { N3Button, N3Input, N3Checkbox } from '@/components/n3';

type FilterType = 'PATENT' | 'EXPORT' | 'MALL' | 'VERO';

interface FilterKeyword {
  id: string;
  keyword: string;
  filter_type: FilterType;
  priority: number;
  is_active: boolean;
  detection_count: number;
  description?: string;
}

const FILTER_TYPES: { id: FilterType; label: string; color: string }[] = [
  { id: 'PATENT', label: '特許', color: 'rgb(239, 68, 68)' },
  { id: 'EXPORT', label: '輸出規制', color: 'rgb(245, 158, 11)' },
  { id: 'MALL', label: 'モール規約', color: 'rgb(59, 130, 246)' },
  { id: 'VERO', label: 'VERO', color: 'rgb(139, 92, 246)' },
];

export function FilterManagementPanel() {
  const [keywords, setKeywords] = useState<FilterKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<FilterType>('PATENT');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [newKeyword, setNewKeyword] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const demoData: FilterKeyword[] = [
      { id: '1', keyword: 'Nintendo', filter_type: 'PATENT', priority: 1, is_active: true, detection_count: 45, description: '任天堂関連' },
      { id: '2', keyword: 'Sony PlayStation', filter_type: 'PATENT', priority: 1, is_active: true, detection_count: 32 },
      { id: '3', keyword: 'military', filter_type: 'EXPORT', priority: 1, is_active: true, detection_count: 8 },
      { id: '4', keyword: 'weapon', filter_type: 'EXPORT', priority: 1, is_active: true, detection_count: 3 },
      { id: '5', keyword: 'replica', filter_type: 'MALL', priority: 2, is_active: true, detection_count: 67 },
      { id: '6', keyword: 'counterfeit', filter_type: 'MALL', priority: 1, is_active: true, detection_count: 12 },
      { id: '7', keyword: 'Louis Vuitton', filter_type: 'VERO', priority: 1, is_active: true, detection_count: 89 },
      { id: '8', keyword: 'Gucci', filter_type: 'VERO', priority: 1, is_active: true, detection_count: 56 },
    ];
    
    setKeywords(demoData);
    setLoading(false);
  };

  const filteredKeywords = keywords.filter(k => {
    if (k.filter_type !== activeType) return false;
    if (searchQuery && !k.keyword.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleAdd = () => {
    if (!newKeyword.trim()) return;
    
    const newItem: FilterKeyword = {
      id: `new-${Date.now()}`,
      keyword: newKeyword.trim(),
      filter_type: activeType,
      priority: 1,
      is_active: true,
      detection_count: 0,
      description: newDescription.trim() || undefined,
    };
    
    setKeywords([newItem, ...keywords]);
    setNewKeyword('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const handleDelete = () => {
    setKeywords(keywords.filter(k => !selectedIds.has(k.id)));
    setSelectedIds(new Set());
  };

  const getTypeCounts = () => {
    return FILTER_TYPES.map(t => ({
      ...t,
      count: keywords.filter(k => k.filter_type === t.id).length,
    }));
  };

  return (
    <div style={{ padding: 16 }}>
      {/* タイプタブ */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        padding: 8,
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        {getTypeCounts().map(type => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 6,
              background: activeType === type.id ? type.color : 'transparent',
              color: activeType === type.id ? 'white' : 'var(--text-muted)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {type.label}
            <span style={{
              padding: '2px 6px',
              borderRadius: 10,
              fontSize: 11,
              background: activeType === type.id ? 'rgba(255,255,255,0.2)' : 'var(--highlight)',
            }}>
              {type.count}
            </span>
          </button>
        ))}
      </div>

      {/* ツールバー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
      }}>
        <N3Input
          placeholder="キーワード検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          style={{ width: 200 }}
        />
        
        <N3Button size="sm" variant="secondary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={14} />
          追加
        </N3Button>
        
        {selectedIds.size > 0 && (
          <N3Button size="sm" variant="ghost" style={{ color: 'var(--color-error)' }} onClick={handleDelete}>
            <Trash2 size={14} />
            削除 ({selectedIds.size})
          </N3Button>
        )}
        
        <div style={{ flex: 1 }} />
        
        <N3Button size="sm" variant="ghost">
          <Download size={14} />
          CSV
        </N3Button>
      </div>

      {/* 追加フォーム */}
      {showAddForm && (
        <div style={{
          marginBottom: 16,
          padding: 16,
          background: 'var(--highlight)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <N3Input
              placeholder="キーワード"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              size="sm"
              style={{ flex: 1 }}
            />
            <N3Input
              placeholder="説明（任意）"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              size="sm"
              style={{ flex: 1 }}
            />
            <N3Button size="sm" variant="primary" onClick={handleAdd}>
              追加
            </N3Button>
            <N3Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              キャンセル
            </N3Button>
          </div>
        </div>
      )}

      {/* キーワードリスト */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          読み込み中...
        </div>
      ) : (
        <div style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: 12, width: 40, background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>
                  <N3Checkbox
                    checked={selectedIds.size === filteredKeywords.length && filteredKeywords.length > 0}
                    onChange={() => {
                      if (selectedIds.size === filteredKeywords.length) {
                        setSelectedIds(new Set());
                      } else {
                        setSelectedIds(new Set(filteredKeywords.map(k => k.id)));
                      }
                    }}
                  />
                </th>
                <th style={{ padding: 12, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>キーワード</th>
                <th style={{ padding: 12, textAlign: 'center', width: 80, background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>優先度</th>
                <th style={{ padding: 12, textAlign: 'center', width: 80, background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>状態</th>
                <th style={{ padding: 12, textAlign: 'center', width: 80, background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>検出数</th>
                <th style={{ padding: 12, textAlign: 'left', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)' }}>説明</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map((keyword, index) => (
                <tr key={keyword.id} style={{ background: index % 2 === 0 ? 'var(--highlight)' : 'transparent' }}>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)' }}>
                    <N3Checkbox
                      checked={selectedIds.has(keyword.id)}
                      onChange={() => toggleSelect(keyword.id)}
                    />
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', fontWeight: 500 }}>
                    {keyword.keyword}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      background: keyword.priority === 1 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                      color: keyword.priority === 1 ? 'rgb(239, 68, 68)' : 'var(--text-muted)',
                    }}>
                      {keyword.priority === 1 ? '高' : '中'}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: keyword.is_active ? 'rgb(34, 197, 94)' : 'var(--text-muted)',
                      display: 'inline-block',
                    }} />
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', textAlign: 'center', fontFamily: 'monospace' }}>
                    {keyword.detection_count}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid var(--panel-border)', color: 'var(--text-muted)', fontSize: 12 }}>
                    {keyword.description || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
