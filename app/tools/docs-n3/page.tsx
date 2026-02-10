// app/tools/docs-n3/page.tsx
/**
 * N3 ドキュメント管理ページ
 * 
 * 機能:
 * - タブでカテゴリ別にドキュメント管理
 * - Markdownプレビュー
 * - ドキュメント一覧テーブル
 * - 新規ドキュメント追加
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, AlertTriangle, Book, Rocket, Settings, Plus, 
  Search, Calendar, Tag, ExternalLink, ChevronRight,
  RefreshCw, Trash2, Edit, Eye, Copy, Check, Zap, Bot
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ============================================================
// 型定義
// ============================================================

interface DocItem {
  id: string;
  title: string;
  description: string;
  category: DocCategory;
  path: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  status: 'active' | 'deprecated' | 'draft';
}

type DocCategory = 'errors' | 'guides' | 'api' | 'architecture' | 'deployment' | 'n8n' | 'ai';

interface TabConfig {
  id: DocCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}

// ============================================================
// 定数
// ============================================================

const TABS: TabConfig[] = [
  { id: 'errors', label: 'エラー集', icon: <AlertTriangle size={16} />, color: '#ef4444' },
  { id: 'guides', label: 'ガイド', icon: <Book size={16} />, color: '#3b82f6' },
  { id: 'n8n', label: 'n8nワークフロー', icon: <Zap size={16} />, color: '#F59E0B' },
  { id: 'ai', label: 'AIエージェント', icon: <Bot size={16} />, color: '#8B5CF6' },
  { id: 'api', label: 'API仕様', icon: <FileText size={16} />, color: '#8b5cf6' },
  { id: 'architecture', label: 'アーキテクチャ', icon: <Settings size={16} />, color: '#06b6d4' },
  { id: 'deployment', label: 'デプロイ', icon: <Rocket size={16} />, color: '#22c55e' },
];

// ============================================================
// メインコンポーネント
// ============================================================

export default function DocsN3Page() {
  const [activeTab, setActiveTab] = useState<DocCategory>('errors');
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [tabCounts, setTabCounts] = useState<Record<DocCategory, number>>({} as Record<DocCategory, number>);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // カテゴリ別件数を初回のみ取得（一括取得API使用）
  useEffect(() => {
    const loadAllCounts = async () => {
      try {
        const res = await fetch('/api/docs/counts');
        if (res.ok) {
          const data = await res.json();
          setTabCounts(data.counts || {});
        }
      } catch (error) {
        console.error('カウント取得エラー:', error);
      }
    };
    loadAllCounts();
  }, []); // 初回のみ

  // ドキュメント読み込み
  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/docs/list?category=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setDocs(data.docs || []);
      } else {
        // APIがない場合はモックデータ
        setDocs(getMockDocs(activeTab));
      }
    } catch (error) {
      console.error('ドキュメント読み込みエラー:', error);
      setDocs(getMockDocs(activeTab));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadDocs();
    setSelectedDoc(null);
  }, [loadDocs]);

  // ドキュメント選択
  const handleSelectDoc = async (doc: DocItem) => {
    if (doc.content) {
      setSelectedDoc(doc);
      return;
    }
    
    try {
      const res = await fetch(`/api/docs/content?path=${encodeURIComponent(doc.path)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedDoc({ ...doc, content: data.content });
      } else {
        // フォールバック：ファイルシステムから読み込む
        const content = await fetchLocalContent(doc.path);
        setSelectedDoc({ ...doc, content });
      }
    } catch (error) {
      console.error('コンテンツ読み込みエラー:', error);
      const content = await fetchLocalContent(doc.path);
      setSelectedDoc({ ...doc, content });
    }
  };

  // フィルタリング
  const filteredDocs = docs.filter(doc => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="docs-n3-page">
      {/* ヘッダー */}
      <header className="docs-header">
        <div className="docs-header-left">
          <h1>
            <FileText size={24} />
            N3 ドキュメント
          </h1>
          <span className="docs-count">{docs.length} 件</span>
        </div>
        <div className="docs-header-right">
          <div className="docs-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="ドキュメントを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="docs-btn primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            追加
          </button>
          <button className="docs-btn" onClick={loadDocs}>
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* タブ */}
      <nav className="docs-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`docs-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ '--tab-color': tab.color } as React.CSSProperties}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className="tab-count">
              {activeTab === tab.id ? docs.length : (tabCounts[tab.id] || 0)}
            </span>
          </button>
        ))}
      </nav>

      {/* メインコンテンツ */}
      <div className="docs-content">
        {/* ドキュメント一覧 */}
        <aside className="docs-list">
          {loading ? (
            <div className="docs-loading">
              <RefreshCw className="spin" size={20} />
              <span>読み込み中...</span>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="docs-empty">
              <FileText size={32} />
              <p>ドキュメントがありません</p>
            </div>
          ) : (
            <table className="docs-table">
              <thead>
                <tr>
                  <th>タイトル</th>
                  <th>ステータス</th>
                  <th>更新日</th>
                  <th>タグ</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr 
                    key={doc.id}
                    className={selectedDoc?.id === doc.id ? 'selected' : ''}
                    onClick={() => handleSelectDoc(doc)}
                  >
                    <td className="doc-title-cell">
                      <ChevronRight size={14} className="doc-arrow" />
                      <span className="doc-title">{doc.title}</span>
                      <span className="doc-desc">{doc.description}</span>
                    </td>
                    <td>
                      <span className={`doc-status ${doc.status}`}>
                        {doc.status === 'active' ? '有効' : doc.status === 'deprecated' ? '非推奨' : '下書き'}
                      </span>
                    </td>
                    <td className="doc-date">{formatDate(doc.updatedAt)}</td>
                    <td className="doc-tags">
                      {doc.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="doc-tag">{tag}</span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="doc-tag more">+{doc.tags.length - 2}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </aside>

        {/* プレビュー */}
        <main className="docs-preview">
          {selectedDoc ? (
            <>
              <div className="preview-header">
                <h2>{selectedDoc.title}</h2>
                <div className="preview-actions">
                  <CopyButton content={selectedDoc.content || ''} />
                  <button className="docs-btn" title="編集">
                    <Edit size={16} />
                  </button>
                  <a 
                    href={`vscode://file${selectedDoc.path}`}
                    className="docs-btn"
                    title="VSCodeで開く"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
              <div className="preview-meta">
                <span><Calendar size={12} /> {formatDate(selectedDoc.updatedAt)}</span>
                <span><Tag size={12} /> {selectedDoc.tags.join(', ')}</span>
              </div>
              <div className="preview-content markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedDoc.content || '読み込み中...'}
                </ReactMarkdown>
              </div>
            </>
          ) : (
            <div className="preview-empty">
              <Eye size={48} />
              <p>ドキュメントを選択してプレビュー</p>
            </div>
          )}
        </main>
      </div>

      {/* 追加モーダル */}
      {showAddModal && (
        <AddDocModal 
          category={activeTab}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            loadDocs();
          }}
        />
      )}

      <style jsx>{`
        .docs-n3-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        .docs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--panel-border);
          background: var(--glass);
        }

        .docs-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .docs-header-left h1 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .docs-count {
          background: var(--accent);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .docs-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .docs-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          padding: 8px 12px;
          width: 280px;
        }

        .docs-search input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-size: 14px;
        }

        .docs-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          background: var(--panel);
          color: var(--text);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .docs-btn:hover {
          background: var(--panel-hover);
          border-color: var(--accent);
        }

        .docs-btn.primary {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }

        .docs-btn.primary:hover {
          opacity: 0.9;
        }

        .docs-tabs {
          display: flex;
          gap: 4px;
          padding: 12px 24px;
          background: var(--panel);
          border-bottom: 1px solid var(--panel-border);
        }

        .docs-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .docs-tab:hover {
          background: var(--panel-hover);
          color: var(--text);
        }

        .docs-tab.active {
          background: var(--tab-color);
          color: white;
        }

        .tab-count {
          background: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
        }

        .docs-tab:not(.active) .tab-count {
          background: var(--panel-border);
        }

        .docs-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          overflow: hidden;
        }

        .docs-list {
          border-right: 1px solid var(--panel-border);
          overflow: auto;
        }

        .docs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .docs-table th {
          position: sticky;
          top: 0;
          background: var(--panel);
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 1px solid var(--panel-border);
        }

        .docs-table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--panel-border);
          font-size: 13px;
        }

        .docs-table tr {
          cursor: pointer;
          transition: background 0.2s;
        }

        .docs-table tr:hover {
          background: var(--panel-hover);
        }

        .docs-table tr.selected {
          background: rgba(var(--accent-rgb), 0.1);
        }

        .doc-title-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .doc-arrow {
          display: none;
          color: var(--accent);
        }

        .docs-table tr.selected .doc-arrow {
          display: inline;
        }

        .doc-title {
          font-weight: 500;
          color: var(--text);
        }

        .doc-desc {
          font-size: 12px;
          color: var(--text-muted);
        }

        .doc-status {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }

        .doc-status.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .doc-status.deprecated {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .doc-status.draft {
          background: rgba(234, 179, 8, 0.2);
          color: #eab308;
        }

        .doc-date {
          color: var(--text-muted);
          font-size: 12px;
        }

        .doc-tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .doc-tag {
          background: var(--panel-border);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          color: var(--text-muted);
        }

        .doc-tag.more {
          background: var(--accent);
          color: white;
        }

        .docs-preview {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--bg);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--panel-border);
        }

        .preview-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .preview-actions {
          display: flex;
          gap: 8px;
        }

        .preview-meta {
          display: flex;
          gap: 16px;
          padding: 12px 24px;
          font-size: 12px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--panel-border);
        }

        .preview-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .preview-content {
          flex: 1;
          padding: 24px;
          overflow: auto;
        }

        .preview-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          gap: 12px;
        }

        .docs-loading, .docs-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          color: var(--text-muted);
          gap: 12px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Markdown スタイル */
        .markdown-body {
          font-size: 14px;
          line-height: 1.7;
        }

        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          border-bottom: 1px solid var(--panel-border);
          padding-bottom: 8px;
        }

        .markdown-body h1 { font-size: 24px; }
        .markdown-body h2 { font-size: 20px; }
        .markdown-body h3 { font-size: 16px; border-bottom: none; }

        .markdown-body pre {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
        }

        .markdown-body code {
          background: var(--panel);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
        }

        .markdown-body pre code {
          background: none;
          padding: 0;
        }

        .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }

        .markdown-body th, .markdown-body td {
          border: 1px solid var(--panel-border);
          padding: 8px 12px;
          text-align: left;
        }

        .markdown-body th {
          background: var(--panel);
          font-weight: 600;
        }

        .markdown-body blockquote {
          border-left: 4px solid var(--accent);
          padding-left: 16px;
          margin-left: 0;
          color: var(--text-muted);
        }

        .markdown-body ul, .markdown-body ol {
          padding-left: 24px;
        }

        .markdown-body li {
          margin: 8px 0;
        }

        .markdown-body a {
          color: var(--accent);
          text-decoration: none;
        }

        .markdown-body a:hover {
          text-decoration: underline;
        }

        .markdown-body hr {
          border: none;
          border-top: 1px solid var(--panel-border);
          margin: 24px 0;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// サブコンポーネント
// ============================================================

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="docs-btn" onClick={handleCopy} title="コピー">
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

function AddDocModal({ 
  category, 
  onClose, 
  onSave 
}: { 
  category: DocCategory;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/docs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          content,
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        onSave();
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>新規ドキュメント追加</h3>
        
        <div className="form-group">
          <label>タイトル</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="ERR-003: エラー名"
          />
        </div>

        <div className="form-group">
          <label>説明</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="エラーの概要"
          />
        </div>

        <div className="form-group">
          <label>タグ（カンマ区切り）</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Next.js, webpack, 無限ループ"
          />
        </div>

        <div className="form-group">
          <label>内容（Markdown）</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="## 症状&#10;&#10;## 原因&#10;&#10;## 解決策"
            rows={12}
          />
        </div>

        <div className="modal-actions">
          <button className="docs-btn" onClick={onClose}>キャンセル</button>
          <button 
            className="docs-btn primary" 
            onClick={handleSave}
            disabled={saving || !title.trim()}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: var(--panel);
            border: 1px solid var(--panel-border);
            border-radius: 12px;
            padding: 24px;
            width: 600px;
            max-height: 80vh;
            overflow: auto;
          }

          .modal-content h3 {
            margin: 0 0 20px;
            font-size: 18px;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-muted);
          }

          .form-group input, .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            background: var(--bg);
            border: 1px solid var(--panel-border);
            border-radius: 8px;
            color: var(--text);
            font-size: 14px;
            font-family: inherit;
          }

          .form-group textarea {
            resize: vertical;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
          }

          .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: var(--accent);
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 24px;
          }
        `}</style>
      </div>
    </div>
  );
}

// ============================================================
// ユーティリティ
// ============================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

async function fetchLocalContent(path: string): Promise<string> {
  // ローカルファイルの内容を取得（デモ用）
  const mockContents: Record<string, string> = {
    'docs/errors/ERROR_CATALOG.md': `# N3 開発エラーカタログ

## ERR-001: 無限コンパイル/リロードループ

### 症状
ターミナルに同じページへのGETリクエストが無限に出続け、Macが重くなる。

### 原因
1. Webpack watchOptionsの\`poll: 5000\`設定
2. useEffectの依存配列に関数が含まれている
3. Supabaseクライアントの重複生成

### 解決策
\`\`\`typescript
// next.config.ts
config.watchOptions = {
  poll: false,
  aggregateTimeout: 500,
};
\`\`\`

---

## ERR-002: Turbopack CSSパースエラー

### 症状
Turbopackでビルド時にCSSパースエラーが発生。

### 解決策
\`--webpack\`オプションで起動する。
`,
  };

  return mockContents[path] || '# ドキュメントが見つかりません';
}

function getMockDocs(category: DocCategory): DocItem[] {
  const mockData: Record<DocCategory, DocItem[]> = {
    errors: [
      {
        id: 'err-001',
        title: 'ERR-001: 無限コンパイル/リロードループ',
        description: 'ページが無限にリロードされる問題',
        category: 'errors',
        path: 'docs/errors/ERROR_CATALOG.md',
        createdAt: '2024-12-22T00:00:00Z',
        updatedAt: '2024-12-22T00:00:00Z',
        tags: ['Next.js', 'webpack', '無限ループ', 'HMR'],
        status: 'active',
      },
      {
        id: 'err-002',
        title: 'ERR-002: Turbopack CSSパースエラー',
        description: 'Turbopackでビルド時にCSSエラー',
        category: 'errors',
        path: 'docs/errors/ERROR_CATALOG.md',
        createdAt: '2024-12-22T00:00:00Z',
        updatedAt: '2024-12-22T00:00:00Z',
        tags: ['Turbopack', 'CSS', 'Tailwind'],
        status: 'active',
      },
    ],
    guides: [
      {
        id: 'guide-001',
        title: 'トラブルシューティングガイド',
        description: '緊急時のクイックガイド',
        category: 'guides',
        path: 'TROUBLESHOOTING.md',
        createdAt: '2024-12-22T00:00:00Z',
        updatedAt: '2024-12-22T00:00:00Z',
        tags: ['緊急対応', 'キャッシュ'],
        status: 'active',
      },
    ],
    n8n: [
      {
        id: 'n8n-001',
        title: '自律型出品ハブ (Listing Hub)',
        description: 'eBay, Amazon, Qoo10等へのマルチプラットフォーム出品の中央司令塔',
        category: 'n8n',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/出品/N3_V8.2.1_AUTONOMOUS_LISTING_HUB.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['出品', 'eBay', 'Amazon', '自動化'],
        status: 'active',
      },
      {
        id: 'n8n-002',
        title: 'Global Stock Killer',
        description: '緊急時に全販路の在庫を一括停止するキルスイッチ',
        category: 'n8n',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/在庫/【在庫】01_GlobalStockKiller_V8-ARMORED.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['在庫', '緊急停止', '防衛'],
        status: 'active',
      },
      {
        id: 'n8n-003',
        title: '自律型SMエージェント',
        description: 'SellerMirrorを使った競合分析の自動化',
        category: 'n8n',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/リサーチ/N3_V8.2.1_AUTONOMOUS_SM_AGENT.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['リサーチ', 'SM分析', '競合調査'],
        status: 'active',
      },
      {
        id: 'n8n-004',
        title: '目利きエージェント',
        description: 'AIによる商品価値判定',
        category: 'n8n',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/リサーチ/【リサーチ】01_14-リサーチ-目利きエージェント_V7.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['リサーチ', 'AI', '価値判定'],
        status: 'active',
      },
      {
        id: 'n8n-005',
        title: '多販路受注統合ハブ',
        description: '全販路からの受注を統合管理',
        category: 'n8n',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/受注/【受注】01_09-受注-多販路受注統合ハブ_V5.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['受注', '統合', 'マルチチャネル'],
        status: 'active',
      },
      {
        id: 'n8n-006',
        title: '11言語自動翻訳',
        description: '商品情報を11言語に自動翻訳',
        category: 'n8n',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/翻訳/【翻訳】03_52d-メディア-多言語展開-11言語自動変換_V5.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['翻訳', '多言語', 'グローバル'],
        status: 'active',
      },
    ],
    ai: [
      {
        id: 'ai-001',
        title: 'AI自動返信',
        description: '問い合わせへのAI自動返信システム',
        category: 'ai',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/AI/【AI】01_11-問い合わせ-AI自動返信_V5.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['AI', '自動返信', 'CS'],
        status: 'active',
      },
      {
        id: 'ai-002',
        title: 'AIカテゴリマッピング',
        description: 'AIによるカテゴリ自動分類',
        category: 'ai',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/AI/【AI】02_46-AIカテゴリマッピング-category-mapper_V5.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['AI', 'カテゴリ', '自動分類'],
        status: 'active',
      },
      {
        id: 'ai-003',
        title: 'AEO AIエンジン最適化',
        description: 'AIエンジン最適化によるSEO強化',
        category: 'ai',
        path: '02_DEV_LAB/n8n-workflows/PRODUCTION/AI/【AI】03_53-AEO-AIエンジン最適化_V5.json',
        createdAt: '2025-01-26T00:00:00Z',
        updatedAt: '2025-01-26T00:00:00Z',
        tags: ['AI', 'AEO', 'SEO'],
        status: 'active',
      },
    ],
    api: [],
    architecture: [],
    deployment: [
      {
        id: 'deploy-001',
        title: 'Vercelデプロイマニュアル',
        description: '本番環境への反映手順',
        category: 'deployment',
        path: 'DEPLOYMENT_MANUAL.md',
        createdAt: '2024-12-22T00:00:00Z',
        updatedAt: '2024-12-22T00:00:00Z',
        tags: ['Vercel', 'デプロイ', 'CI/CD'],
        status: 'active',
      },
    ],
  };

  return mockData[category] || [];
}
