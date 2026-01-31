// app/tools/command-center/page.tsx
/**
 * N3 コマンドセンター
 * デプロイフロー順に整理されたコマンド集
 * 
 * 改良版:
 * - ワンクリックセクションを最上部に目立たせる
 * - フローの流れを視覚化
 * - React.memo による再レンダリング抑制
 */
'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  Copy, Check, Search, ExternalLink, Terminal,
  ChevronRight, ChevronDown, Info, AlertTriangle, Zap, 
  Rocket, Moon, Play, Settings, Wrench, Link2, BookOpen
} from 'lucide-react';
import commandsData from './commands.json';

// ============================================================
// 型定義
// ============================================================

interface Command {
  id: string;
  name: string;
  description?: string;
  command: string;
  highlight?: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'pink';
  tags?: string[];
  isLink?: boolean;
  detail?: string;
}

interface FlowItem {
  location: string;
  path: string;
  note: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  when?: string;
  important?: string;
  isInfoOnly?: boolean;
  flowDiagram?: {
    title: string;
    steps: { step: number; name: string; desc: string; icon: string }[];
    note?: string;
  };
  info?: {
    paths?: { title: string; items: FlowItem[] };
    flow?: { title: string; items: FlowItem[] };
    ssh?: { title: string; host: string; user: string; command: string };
    ports?: { title: string; items: { port: number; use: string }[] };
  };
  commands: Command[];
}

// ============================================================
// 定数
// ============================================================

const highlightColors: Record<string, { bg: string; border: string; text: string }> = {
  green: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' },
  blue: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', text: '#3b82f6' },
  orange: { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)', text: '#f97316' },
  red: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444' },
  purple: { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)', text: '#8b5cf6' },
  pink: { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.4)', text: '#ec4899' },
};

const categoryIcons: Record<string, React.ReactNode> = {
  'oneclick': <Rocket size={16} />,
  'auto-flow-detail': <Moon size={16} />,
  'production-deploy': <Play size={16} />,
  'daily-dev': <Terminal size={16} />,
  'clean': <Wrench size={16} />,
  'setup': <Settings size={16} />,
  'troubleshoot': <AlertTriangle size={16} />,
  'links': <Link2 size={16} />,
  'reference': <BookOpen size={16} />,
};

const categories: Category[] = commandsData.categories as Category[];

// ============================================================
// コンポーネント
// ============================================================

// コマンドカード
const CommandCard = memo(function CommandCard({
  cmd,
  copiedId,
  onCopy,
  onOpenLink,
  isHighlighted = false,
}: {
  cmd: Command;
  copiedId: string | null;
  onCopy: (command: string, id: string) => void;
  onOpenLink: (url: string) => void;
  isHighlighted?: boolean;
}) {
  const colors = cmd.highlight ? highlightColors[cmd.highlight] : null;
  const isCopied = copiedId === cmd.id;

  const handleClick = useCallback(() => {
    if (cmd.isLink) {
      onOpenLink(cmd.command);
    } else {
      onCopy(cmd.command, cmd.id);
    }
  }, [cmd, onCopy, onOpenLink]);

  return (
    <div
      style={{
        padding: isHighlighted ? '18px 20px' : '14px 16px',
        background: colors?.bg || 'var(--panel)',
        border: `${isHighlighted ? '2px' : '1px'} solid ${colors?.border || 'var(--panel-border)'}`,
        borderRadius: 12,
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: isHighlighted ? 16 : 14, 
              fontWeight: 600, 
              color: colors?.text || 'var(--text)' 
            }}>
              {cmd.name}
            </span>
            {cmd.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: tag === '推奨' || tag === 'ワンクリック' 
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'var(--highlight)',
                  color: tag === '推奨' || tag === 'ワンクリック' ? 'white' : 'var(--text-muted)',
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          {cmd.description && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
              {cmd.description}
            </div>
          )}
          <code
            style={{
              display: 'block',
              fontSize: 11,
              color: 'var(--text)',
              background: 'rgba(0,0,0,0.2)',
              padding: '10px 12px',
              borderRadius: 8,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              maxHeight: 120,
            }}
          >
            {cmd.command}
          </code>
          {cmd.detail && (
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginTop: 10,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 6,
              }}
            >
              <Info size={12} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{cmd.detail}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleClick}
          style={{
            padding: isHighlighted ? '12px 20px' : '10px 16px',
            borderRadius: 10,
            border: 'none',
            background: isCopied 
              ? '#22c55e' 
              : cmd.isLink 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : cmd.highlight === 'green'
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'var(--highlight)',
            color: isCopied || cmd.isLink || cmd.highlight === 'green' ? 'white' : 'var(--text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: cmd.highlight === 'green' ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none',
          }}
        >
          {isCopied ? (
            <><Check size={16} /> コピー済</>
          ) : cmd.isLink ? (
            <><ExternalLink size={16} /> 開く</>
          ) : (
            <><Copy size={16} /> コピー</>
          )}
        </button>
      </div>
    </div>
  );
});

// フロー図
const FlowDiagram = memo(function FlowDiagram({
  items,
  title,
}: {
  items: FlowItem[];
  title: string;
}) {
  return (
    <div style={{ padding: 20, background: 'var(--panel)', borderRadius: 12, marginBottom: 16 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
        {title}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
              }}
            >
              {item.location}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <code style={{ fontSize: 12, color: '#22c55e' }}>{item.path}</code>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.note}</div>
            </div>
            {idx < items.length - 1 && (
              <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

// リファレンス情報
const ReferenceInfo = memo(function ReferenceInfo({
  info,
  copiedId,
  onCopy,
}: {
  info: NonNullable<Category['info']>;
  copiedId: string | null;
  onCopy: (command: string, id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* フォルダ構成 */}
      {info.paths && (
        <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>
            📁 {info.paths.title}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {info.paths.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto',
                  gap: 12,
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'var(--highlight)',
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.location}</span>
                <code style={{ fontSize: 12, color: '#22c55e', fontFamily: 'monospace' }}>{item.path}</code>
                <span
                  style={{
                    fontSize: 10,
                    color: item.note.includes('⚠️') ? '#ef4444' : 'var(--text-muted)',
                    fontWeight: item.note.includes('⚠️') ? 600 : 400,
                  }}
                >
                  {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* データの流れ */}
      {info.flow && <FlowDiagram items={info.flow.items} title={`📊 ${info.flow.title}`} />}

      {/* SSH */}
      {info.ssh && (
        <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>
            🔑 {info.ssh.title}
          </h4>
          <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Host</span>
              <code style={{ display: 'block', fontSize: 13, color: '#3b82f6', marginTop: 2 }}>{info.ssh.host}</code>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>User</span>
              <code style={{ display: 'block', fontSize: 13, color: '#3b82f6', marginTop: 2 }}>{info.ssh.user}</code>
            </div>
          </div>
          <button
            onClick={() => onCopy(info.ssh!.command, 'ssh-ref')}
            style={{
              width: '100%',
              padding: 12,
              background: 'var(--highlight)',
              border: '1px solid var(--panel-border)',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <code style={{ fontSize: 12, color: 'var(--text)' }}>{info.ssh.command}</code>
            {copiedId === 'ssh-ref' ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
          </button>
        </div>
      )}

      {/* ポート */}
      {info.ports && (
        <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>
            🔌 {info.ports.title}
          </h4>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {info.ports.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 16px',
                  background: 'var(--highlight)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <code style={{ fontSize: 16, fontWeight: 700, color: '#8b5cf6' }}>{item.port}</code>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.use}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// サイドバー
const Sidebar = memo(function Sidebar({
  activeCategory,
  onSelect,
  searchQuery,
  onSearchChange,
}: {
  activeCategory: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  return (
    <div style={{
      width: 260,
      borderRight: '1px solid var(--panel-border)',
      background: 'var(--panel)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* ヘッダー */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--panel-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ef4444, #f97316)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
          }}>
            <Terminal size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>コマンドセンター</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>デプロイ・同期・トラブル解決</div>
          </div>
        </div>
        
        {/* デプロイセンターへのリンク */}
        <a
          href="/tools/deploy-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 14px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 10,
            marginBottom: 14,
            textDecoration: 'none',
            color: '#22c55e',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          🚢 デプロイセンター（GUI操作）
          <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
        </a>
        
        {/* 検索 */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="コマンド検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              fontSize: 13,
              border: '1px solid var(--panel-border)',
              borderRadius: 10,
              background: 'var(--bg)',
              color: 'var(--text)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* カテゴリ一覧 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          const isOneClick = cat.id === 'oneclick';
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 10,
                border: isOneClick ? '2px solid rgba(34, 197, 94, 0.4)' : 'none',
                cursor: 'pointer',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'
                  : isOneClick 
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'transparent',
                color: isActive ? '#6366f1' : isOneClick ? '#22c55e' : 'var(--text)',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: 6,
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(128, 128, 128, 0.1)',
              }}>
                {categoryIcons[cat.id] || <ChevronRight size={14} />}
              </span>
              <span style={{ 
                fontSize: 13, 
                fontWeight: isActive || isOneClick ? 600 : 400,
                flex: 1,
              }}>
                {cat.name}
              </span>
              {isOneClick && (
                <Zap size={14} style={{ color: '#f59e0b' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

// メインコンテンツ
const MainContent = memo(function MainContent({
  activeData,
  filteredCommands,
  copiedId,
  onCopy,
  onOpenLink,
}: {
  activeData: Category | undefined;
  filteredCommands: Command[] | null;
  copiedId: string | null;
  onCopy: (command: string, id: string) => void;
  onOpenLink: (url: string) => void;
}) {
  // 検索結果表示
  if (filteredCommands) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: 'var(--text)' }}>
          🔍 検索結果: {filteredCommands.length}件
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredCommands.map(cmd => (
            <CommandCard 
              key={cmd.id} 
              cmd={cmd} 
              copiedId={copiedId} 
              onCopy={onCopy} 
              onOpenLink={onOpenLink} 
            />
          ))}
        </div>
      </div>
    );
  }

  if (!activeData) return null;

  const isOneClick = activeData.id === 'oneclick';

  return (
    <div style={{ padding: 24 }}>
      {/* カテゴリヘッダー */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ 
          fontSize: isOneClick ? 24 : 20, 
          fontWeight: 700, 
          color: isOneClick ? '#22c55e' : 'var(--text)', 
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          {activeData.name}
          {isOneClick && <Zap size={24} style={{ color: '#f59e0b' }} />}
        </h2>
        {activeData.description && (
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>
            {activeData.description}
          </p>
        )}
        {activeData.when && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 10,
            fontSize: 13,
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
          }}>
            <Info size={16} />
            <div>
              <strong>いつ使う？</strong>
              <span style={{ marginLeft: 8 }}>{activeData.when}</span>
            </div>
          </div>
        )}
        {activeData.important && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 10,
            fontSize: 13,
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <AlertTriangle size={16} />
            {activeData.important}
          </div>
        )}
      </div>

      {/* リファレンス情報 */}
      {activeData.info && (
        <ReferenceInfo info={activeData.info} copiedId={copiedId} onCopy={onCopy} />
      )}

      {/* コマンド一覧 */}
      {activeData.commands && activeData.commands.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: activeData.info ? 20 : 0 }}>
          {activeData.commands.map((cmd, idx) => (
            <CommandCard 
              key={cmd.id} 
              cmd={cmd} 
              copiedId={copiedId} 
              onCopy={onCopy} 
              onOpenLink={onOpenLink}
              isHighlighted={isOneClick && idx === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export default function CommandCenterPage() {
  const [activeCategory, setActiveCategory] = useState<string>('oneclick');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback(async (command: string, id: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const handleLinkClick = useCallback((url: string) => {
    if (url.startsWith('/')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  }, []);

  const handleCategorySelect = useCallback((id: string) => {
    setActiveCategory(id);
    setSearchQuery('');
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 検索結果
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results: Command[] = [];
    categories.forEach(cat => {
      cat.commands?.forEach(cmd => {
        if (
          cmd.name.toLowerCase().includes(query) ||
          cmd.description?.toLowerCase().includes(query) ||
          cmd.command.toLowerCase().includes(query) ||
          cmd.tags?.some(t => t.toLowerCase().includes(query))
        ) {
          results.push(cmd);
        }
      });
    });
    return results;
  }, [searchQuery]);

  // アクティブカテゴリ
  const activeData = useMemo(() => {
    return categories.find(c => c.id === activeCategory);
  }, [activeCategory]);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      background: 'var(--bg)', 
      overflow: 'hidden' 
    }}>
      <Sidebar
        activeCategory={activeCategory}
        onSelect={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MainContent
          activeData={activeData}
          filteredCommands={filteredCommands}
          copiedId={copiedId}
          onCopy={handleCopy}
          onOpenLink={handleLinkClick}
        />
      </div>
    </div>
  );
}
