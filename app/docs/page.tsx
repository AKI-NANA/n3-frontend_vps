// app/docs/page.tsx
/**
 * N3 Manual - ドキュメント閲覧ページ
 * 
 * Phase I Task Group A: Docs/Manual表示復旧
 * 
 * 機能:
 * - /docs/*.md を動的ロード
 * - 左: ドキュメント一覧
 * - 右: Markdown Viewer
 * - 見出しアンカー対応
 * - ダークモード追従
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  BookOpen, FileText, ChevronRight, Search, RefreshCw,
  ExternalLink, Copy, Check, Hash, ArrowLeft, FolderOpen,
  Code, AlertCircle, Rocket, Database, Settings
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

// ============================================================
// 型定義
// ============================================================

interface DocFile {
  name: string;
  path: string;
  category: string;
  description?: string;
  updatedAt?: string;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

// ============================================================
// ドキュメント定義（静的）
// ============================================================

const DOCS_CATEGORIES = [
  { id: 'guides', label: 'ガイド', icon: BookOpen, color: '#3b82f6' },
  { id: 'errors', label: 'エラー集', icon: AlertCircle, color: '#ef4444' },
  { id: 'migrations', label: 'マイグレーション', icon: Database, color: '#10b981' },
  { id: 'deployment', label: 'デプロイ', icon: Rocket, color: '#8b5cf6' },
  { id: 'dev', label: '開発', icon: Code, color: '#f59e0b' },
];

// 静的ドキュメントリスト（実際のファイルと同期が必要）
const STATIC_DOCS: DocFile[] = [
  // ガイド
  { name: 'ESSENTIAL.md', path: 'ESSENTIAL.md', category: 'guides', description: 'N3 Essential Guide' },
  { name: 'README.md', path: 'README.md', category: 'guides', description: 'n8n ワークフロー統合ガイド' },
  // エラー集
  { name: 'TROUBLESHOOTING.md', path: 'TROUBLESHOOTING.md', category: 'errors', description: 'トラブルシューティング' },
  // デプロイ
  { name: 'DEPLOYMENT_MANUAL.md', path: 'DEPLOYMENT_MANUAL.md', category: 'deployment', description: 'Vercelデプロイマニュアル' },
  // マイグレーション
  { name: 'PHASE_A_COMPLETION_REPORT.md', path: 'docs/PHASE_A_COMPLETION_REPORT.md', category: 'migrations', description: 'Phase A 完了レポート' },
  { name: 'PHASE_B_COMPLETION_REPORT.md', path: 'docs/PHASE_B_COMPLETION_REPORT.md', category: 'migrations', description: 'Phase B 完了レポート' },
  { name: 'PHASE_C_COMPLETION_REPORT.md', path: 'docs/PHASE_C_COMPLETION_REPORT.md', category: 'migrations', description: 'Phase C 完了レポート' },
  { name: 'PHASE_H1_REPORT.md', path: 'docs/PHASE_H1_REPORT.md', category: 'migrations', description: 'Phase H1 レポート' },
  { name: 'PHASE_H2_REPORT.md', path: 'docs/PHASE_H2_REPORT.md', category: 'migrations', description: 'Phase H2 レポート' },
  // 開発
  { name: 'HUB_IMPLEMENTATION_REPORT.md', path: 'docs/HUB_IMPLEMENTATION_REPORT.md', category: 'dev', description: 'Hub実装レポート' },
  { name: 'UI_STATE_MACHINE_ANALYSIS.md', path: 'docs/UI_STATE_MACHINE_ANALYSIS.md', category: 'dev', description: 'UI State Machine分析' },
];

// ============================================================
// ユーティリティ
// ============================================================

function extractTOC(markdown: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TableOfContentsItem[] = [];
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    items.push({ id, text, level });
  }
  
  return items;
}

// ============================================================
// サブコンポーネント
// ============================================================

const CopyButton = memo(function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 12px',
        borderRadius: 6,
        border: '1px solid var(--panel-border)',
        background: 'var(--panel)',
        color: 'var(--text-muted)',
        fontSize: 12,
        cursor: 'pointer',
      }}
      title="コピー"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'コピー完了' : 'コピー'}
    </button>
  );
});

const TableOfContents = memo(function TableOfContents({ 
  items, 
  activeId,
  onItemClick,
}: { 
  items: TableOfContentsItem[];
  activeId: string | null;
  onItemClick: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <nav style={{ padding: 16 }}>
      <div style={{ 
        fontSize: 12, 
        fontWeight: 600, 
        color: 'var(--text-muted)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        目次
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 4 }}>
            <button
              onClick={() => onItemClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                width: '100%',
                textAlign: 'left',
                padding: '6px 8px',
                paddingLeft: (item.level - 1) * 12 + 8,
                borderRadius: 4,
                border: 'none',
                background: activeId === item.id ? 'var(--accent)' : 'transparent',
                color: activeId === item.id ? 'white' : 'var(--text-muted)',
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Hash size={12} style={{ opacity: 0.5 }} />
              <span style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
});

const DocListItem = memo(function DocListItem({
  doc,
  isSelected,
  onClick,
}: {
  doc: DocFile;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        textAlign: 'left',
        padding: '12px 16px',
        borderRadius: 8,
        border: 'none',
        background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <ChevronRight 
        size={16} 
        style={{ 
          marginTop: 2,
          color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
          transform: isSelected ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.15s ease',
        }} 
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontSize: 14, 
          fontWeight: isSelected ? 600 : 500,
          color: isSelected ? 'var(--accent)' : 'var(--text)',
          marginBottom: 2,
        }}>
          {doc.name}
        </div>
        {doc.description && (
          <div style={{ 
            fontSize: 12, 
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {doc.description}
          </div>
        )}
      </div>
    </button>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState('guides');
  const [selectedDoc, setSelectedDoc] = useState<DocFile | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTocId, setActiveTocId] = useState<string | null>(null);

  // カテゴリでフィルタ
  const filteredDocs = useMemo(() => {
    let docs = STATIC_DOCS.filter(d => d.category === selectedCategory);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      docs = docs.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query)
      );
    }
    return docs;
  }, [selectedCategory, searchQuery]);

  // TOC抽出
  const toc = useMemo(() => extractTOC(content), [content]);

  // ドキュメント読み込み
  const loadDocument = useCallback(async (doc: DocFile) => {
    setSelectedDoc(doc);
    setLoading(true);
    setContent('');

    try {
      // APIから取得を試みる
      const res = await fetch(`/api/docs/content?path=${encodeURIComponent(doc.path)}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || '# ドキュメントが見つかりません');
      } else {
        // フォールバック: サンプルコンテンツ
        setContent(getSampleContent(doc));
      }
    } catch (error) {
      console.error('ドキュメント読み込みエラー:', error);
      setContent(getSampleContent(doc));
    } finally {
      setLoading(false);
    }
  }, []);

  // TOCアイテムクリック
  const handleTocClick = useCallback((id: string) => {
    setActiveTocId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // 初期ドキュメント読み込み
  useEffect(() => {
    if (filteredDocs.length > 0 && !selectedDoc) {
      loadDocument(filteredDocs[0]);
    }
  }, [filteredDocs, selectedDoc, loadDocument]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
    }}>
      {/* ヘッダー */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid var(--panel-border)',
        background: 'var(--panel)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link 
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--panel-alt)',
              color: 'var(--text-muted)',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <BookOpen size={24} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            N3 Manual
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--panel-border)',
            background: 'var(--panel-alt)',
            width: 280,
          }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="ドキュメントを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: 14,
              }}
            />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左サイドバー: カテゴリ + ドキュメント一覧 */}
        <aside style={{
          width: 320,
          flexShrink: 0,
          borderRight: '1px solid var(--panel-border)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--panel)',
        }}>
          {/* カテゴリタブ */}
          <div style={{
            display: 'flex',
            gap: 4,
            padding: '12px 16px',
            borderBottom: '1px solid var(--panel-border)',
            overflowX: 'auto',
          }}>
            {DOCS_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedDoc(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: isActive ? cat.color : 'transparent',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ドキュメント一覧 */}
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            {filteredDocs.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40,
                color: 'var(--text-muted)',
              }}>
                <FolderOpen size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                <p style={{ fontSize: 14 }}>ドキュメントがありません</p>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <DocListItem
                  key={doc.path}
                  doc={doc}
                  isSelected={selectedDoc?.path === doc.path}
                  onClick={() => loadDocument(doc)}
                />
              ))
            )}
          </div>
        </aside>

        {/* メインビュー: Markdown */}
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* コンテンツエリア */}
          <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
            {loading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
                <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
              </div>
            ) : selectedDoc ? (
              <article className="docs-markdown">
                {/* ドキュメントヘッダー */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--panel-border)',
                }}>
                  <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
                      {selectedDoc.name.replace('.md', '')}
                    </h1>
                    {selectedDoc.description && (
                      <p style={{ 
                        fontSize: 14, 
                        color: 'var(--text-muted)',
                        margin: '8px 0 0 0',
                      }}>
                        {selectedDoc.description}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <CopyButton content={content} />
                    <a
                      href={`vscode://file${selectedDoc.path}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--panel-border)',
                        background: 'var(--panel)',
                        color: 'var(--text-muted)',
                        fontSize: 12,
                        textDecoration: 'none',
                      }}
                      title="VSCodeで開く"
                    >
                      <ExternalLink size={14} />
                      VSCode
                    </a>
                  </div>
                </div>

                {/* Markdownコンテンツ */}
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children, ...props }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return <h1 id={id} {...props}>{children}</h1>;
                      },
                      h2: ({ children, ...props }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return <h2 id={id} {...props}>{children}</h2>;
                      },
                      h3: ({ children, ...props }) => {
                        const text = String(children);
                        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return <h3 id={id} {...props}>{children}</h3>;
                      },
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </article>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-muted)',
              }}>
                <FileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <p style={{ fontSize: 16 }}>ドキュメントを選択してください</p>
              </div>
            )}
          </div>

          {/* 右サイドバー: TOC */}
          {toc.length > 0 && (
            <aside style={{
              width: 240,
              flexShrink: 0,
              borderLeft: '1px solid var(--panel-border)',
              overflow: 'auto',
              background: 'var(--panel)',
            }}>
              <TableOfContents 
                items={toc} 
                activeId={activeTocId}
                onItemClick={handleTocClick}
              />
            </aside>
          )}
        </main>
      </div>

      {/* グローバルスタイル */}
      <style jsx global>{`
        .docs-markdown .markdown-body {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text);
        }

        .docs-markdown .markdown-body h1,
        .docs-markdown .markdown-body h2,
        .docs-markdown .markdown-body h3 {
          margin-top: 32px;
          margin-bottom: 16px;
          font-weight: 600;
          color: var(--text);
        }

        .docs-markdown .markdown-body h1 {
          font-size: 28px;
          border-bottom: 2px solid var(--panel-border);
          padding-bottom: 12px;
        }

        .docs-markdown .markdown-body h2 {
          font-size: 22px;
          border-bottom: 1px solid var(--panel-border);
          padding-bottom: 8px;
        }

        .docs-markdown .markdown-body h3 {
          font-size: 18px;
        }

        .docs-markdown .markdown-body pre {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
        }

        .docs-markdown .markdown-body code {
          background: var(--panel);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 14px;
        }

        .docs-markdown .markdown-body pre code {
          background: none;
          padding: 0;
        }

        .docs-markdown .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }

        .docs-markdown .markdown-body th,
        .docs-markdown .markdown-body td {
          border: 1px solid var(--panel-border);
          padding: 12px 16px;
          text-align: left;
        }

        .docs-markdown .markdown-body th {
          background: var(--panel);
          font-weight: 600;
        }

        .docs-markdown .markdown-body blockquote {
          border-left: 4px solid var(--accent);
          padding-left: 16px;
          margin-left: 0;
          color: var(--text-muted);
          font-style: italic;
        }

        .docs-markdown .markdown-body ul,
        .docs-markdown .markdown-body ol {
          padding-left: 24px;
        }

        .docs-markdown .markdown-body li {
          margin: 8px 0;
        }

        .docs-markdown .markdown-body a {
          color: var(--accent);
          text-decoration: none;
        }

        .docs-markdown .markdown-body a:hover {
          text-decoration: underline;
        }

        .docs-markdown .markdown-body hr {
          border: none;
          border-top: 1px solid var(--panel-border);
          margin: 32px 0;
        }

        .docs-markdown .markdown-body img {
          max-width: 100%;
          border-radius: 8px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// サンプルコンテンツ（フォールバック用）
// ============================================================

function getSampleContent(doc: DocFile): string {
  if (doc.name === 'ESSENTIAL.md') {
    return `# N3 Essential Guide

## 構成
- フロントエンド: Next.js 15 (localhost:3000)
- DB: Supabase PostgreSQL (zdzfpucdyxdlavkgrvil.supabase.co)
- 自動化: n8n (VPS: 160.16.120.186:5678)

## ディレクトリ
- app/tools/editing-n3/: 商品編集
- app/tools/listing-n3/: 出品管理
- app/tools/operations-n3/: 運用
- app/api/: APIルート
- lib/: ライブラリ

## 主要テーブル
- products_master: 商品マスター
- inventory_master: 在庫
- ebay_tokens: eBay認証
- ebay_shipping_policies: 配送ポリシー

## 環境
- 開発: ~/n3-frontend_new (localhost:3000)
- 本番: ~/n3-frontend_vercel (Vercel)

## デプロイ
\`\`\`bash
cd ~/n3-frontend_vercel
./sync-from-dev.sh editing-n3
git push origin main
\`\`\`
`;
  }

  if (doc.name === 'README.md') {
    return `# N3 n8n ワークフロー統合ガイド

## 概要
N3システムは、ツール（Next.js）とn8n（自動化エンジン）の両方で動作します。

## 環境変数
\`\`\`bash
USE_N8N=true
N8N_BASE_URL=http://160.16.120.186:5678
\`\`\`

## ワークフロー一覧
| ファイル名 | 用途 |
|-----------|------|
| N3-LISTING-WEBHOOK-CORRECTED.json | 出品処理 |
| N3-SCHEDULE-CRON-COMPLETE.json | スケジュール実行 |
| N3-INVENTORY-SYNC.json | 在庫同期 |
`;
  }

  return `# ${doc.name.replace('.md', '')}

このドキュメントの内容を読み込み中...

ファイルパス: \`${doc.path}\`
`;
}
