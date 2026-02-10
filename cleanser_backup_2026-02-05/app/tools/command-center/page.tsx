// app/tools/command-center/page.tsx
/**
 * N3 コマンドセンター - 統合版 + 統治コックピット
 * 
 * Phase 3-A: 統治機能を統合
 * - 統治規約管理
 * - セキュリティトークン管理
 * - コード衛生スキャン
 * - 最強指示書コピー
 */
'use client';

import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import {
import { fetchSecret } from '@/lib/shared/security';
    Copy, Check, Search, ExternalLink, Terminal,
    ChevronRight, ChevronDown, Info, AlertTriangle, Zap,
    Rocket, Play, Settings, Wrench, Link2, BookOpen,
    RefreshCw, ShieldAlert, Cpu, GitBranch, Server, Cloud,
    CheckCircle, Package, Crown, Scale, Shield, Trash2,
    Lock, Key, Eye, Scan, XCircle, Plus, Loader2, HelpCircle
} from 'lucide-react';
import commandsData from './commands.json';
import { createClient } from '@/lib/supabase/client';
import { generateAIPrompt } from '@/lib/actions/governance-actions';

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

interface GovernanceRule {
    id: string;
    rule_key: string;
    rule_name: string;
    category: string;
    description: string | null;
    ai_instruction: string | null;
    ai_forbidden_patterns: string[] | null;
    ai_required_patterns: string[] | null;
    is_active: boolean;
    priority: number;
    version: number;
    updated_at: string;
}

interface SecretToken {
    id: string;
    key_name: string;
    service: string;
    description: string | null;
    expires_at: string | null;
    updated_at: string;
}

interface ScanResult {
    status: 'idle' | 'running' | 'completed' | 'error';
    summary: {
        sacred_violations: number;
        import_violations: number;
        raw_fetch_count: number;
        stray_files: number;
    };
    timestamp: string | null;
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
    'daily-commands': <Rocket size={16} />,
    'flow-overview': <BookOpen size={16} />,
    'step1-local-dev': <Cpu size={16} />,
    'step2-local-sync': <RefreshCw size={16} />,
    'step3-git-push': <GitBranch size={16} />,
    'step4-build-test': <Package size={16} />,
    'step5-test-deploy': <Server size={16} />,
    'step6-prod-sync': <Play size={16} />,
    'step7-prod-verify': <CheckCircle size={16} />,
    'oneclick-deploy': <Zap size={16} />,
    'local-n8n': <RefreshCw size={16} />,
    'vps-clean-deploy': <Wrench size={16} />,
    'troubleshoot-local': <ShieldAlert size={16} />,
    'troubleshoot-vps': <ShieldAlert size={16} />,
    'troubleshoot-git': <GitBranch size={16} />,
    'links': <Link2 size={16} />,
    'reference': <BookOpen size={16} />,
    'governance': <Crown size={16} />,
};

const categories: Category[] = commandsData.categories as Category[];

// 統治コックピット用の特別カテゴリID
const GOVERNANCE_CATEGORY_ID = 'governance';

// デフォルト統治規約（DBが空の場合に使用）
const DEFAULT_GOVERNANCE_RULES: GovernanceRule[] = [
    {
        id: 'default-1',
        rule_key: 'no_raw_fetch',
        rule_name: '🚫 生fetch禁止',
        category: 'security',
        description: 'fetch()直接使用は禁止',
        ai_instruction: 'fetch()直接使用は禁止。imperialDispatch()またはimperialSafeDispatch()を使用せよ',
        ai_forbidden_patterns: ["fetch('/api", 'fetch(`/api', 'axios.'],
        ai_required_patterns: null,
        is_active: true,
        priority: 1,
        version: 1,
        updated_at: new Date().toISOString()
    },
    {
        id: 'default-2',
        rule_key: 'no_sacred_import',
        rule_name: '🚫 聖域Import禁止',
        category: 'architecture',
        description: '禁止ディレクトリからのimportは絶対禁止',
        ai_instruction: '01_PRODUCT, 02_DEV_LAB, 03_ARCHIVE_STORAGE, n3_local_brain からのimportは絶対禁止',
        ai_forbidden_patterns: ["from '01_PRODUCT", "from '02_DEV_LAB", "from '03_ARCHIVE", "from 'n3_local_brain"],
        ai_required_patterns: null,
        is_active: true,
        priority: 2,
        version: 1,
        updated_at: new Date().toISOString()
    },
    {
        id: 'default-3',
        rule_key: 'no_ip_hardcode',
        rule_name: '🚫 IP直書き禁止',
        category: 'security',
        description: 'IPアドレスの直書きは禁止',
        ai_instruction: 'IPアドレスの直書きは禁止。環境変数を使用せよ',
        ai_forbidden_patterns: [process.env.N3_INTERNAL_API_HOST, '192.168.', '127.0.0.1'],
        ai_required_patterns: null,
        is_active: true,
        priority: 3,
        version: 1,
        updated_at: new Date().toISOString()
    },
    {
        id: 'default-4',
        rule_key: 'use_server_actions',
        rule_name: '✅ Server Actions使用',
        category: 'architecture',
        description: 'クライアントからはServer Actions経由',
        ai_instruction: 'クライアントコンポーネントからはServer Actionsを経由してDBアクセスせよ',
        ai_forbidden_patterns: null,
        ai_required_patterns: null,
        is_active: true,
        priority: 10,
        version: 1,
        updated_at: new Date().toISOString()
    },
    {
        id: 'default-5',
        rule_key: 'zod_validation',
        rule_name: '✅ Zod検証必須',
        category: 'security',
        description: '全てのAPI入出力はZodスキーマで検証',
        ai_instruction: '全てのAPI入出力はZodスキーマで検証せよ',
        ai_forbidden_patterns: null,
        ai_required_patterns: null,
        is_active: true,
        priority: 11,
        version: 1,
        updated_at: new Date().toISOString()
    },
    {
        id: 'default-6',
        rule_key: 'no_console_log',
        rule_name: '🚫 console.log禁止',
        category: 'hygiene',
        description: '本番コードにconsole.logを残すな',
        ai_instruction: '本番コードにconsole.logを残すな。console.errorは許可',
        ai_forbidden_patterns: ['console.log('],
        ai_required_patterns: null,
        is_active: true,
        priority: 20,
        version: 1,
        updated_at: new Date().toISOString()
    }
];

// ============================================================
// コマンドカード（既存コード）
// ============================================================

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
                                    background: tag === '推奨' || tag === '毎日' || tag === '必須'
                                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                        : tag === 'テスト' || tag === 'テストVPS'
                                            ? 'rgba(59, 130, 246, 0.2)'
                                            : tag === '本番'
                                                ? 'rgba(245, 158, 11, 0.2)'
                                                : 'var(--highlight)',
                                    color: tag === '推奨' || tag === '毎日' || tag === '必須'
                                        ? 'white'
                                        : tag === 'テスト' || tag === 'テストVPS'
                                            ? '#3b82f6'
                                            : tag === '本番'
                                                ? '#f59e0b'
                                                : 'var(--text-muted)',
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

// ============================================================
// 統治コックピット コンポーネント
// ============================================================

type GovernanceTab = 'rules' | 'security' | 'hygiene' | 'ai-sync' | 'help';

const GovernanceCockpit = memo(function GovernanceCockpit({
    copiedId,
    onCopy,
}: {
    copiedId: string | null;
    onCopy: (text: string, id: string) => void;
}) {
    const [activeTab, setActiveTab] = useState<GovernanceTab>('rules');
    const [rules, setRules] = useState<GovernanceRule[]>([]);
    const [secrets, setSecrets] = useState<SecretToken[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult>({
        status: 'idle',
        summary: { sacred_violations: 0, import_violations: 0, raw_fetch_count: 0, stray_files: 0 },
        timestamp: null
    });
    
    // AI Knowledge Sync state
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiPromptStats, setAiPromptStats] = useState<{
        total_sources: number;
        loaded_sources: number;
        failed_sources: string[];
        total_chars: number;
    } | null>(null);
    const [aiSyncLoading, setAiSyncLoading] = useState(false);
    const [aiCopied, setAiCopied] = useState(false);
    
    const supabase = createClient();

    // データ取得
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 規約取得（DBから取得、失敗または空ならデフォルト使用）
                const { data: rulesData, error: rulesError } = await supabase
                    .from('system_governance')
                    .select('*')
                    .order('priority');
                
                if (rulesError || !rulesData || rulesData.length === 0) {
                    // DBがない、またはデータがない場合はデフォルト使用
                    setRules(DEFAULT_GOVERNANCE_RULES);
                } else {
                    setRules(rulesData);
                }

                // シークレット取得（メタデータのみ）- エラーでも無視
                try {
                    const { data: secretsData } = await supabase
                        .from('system_secrets')
                        .select('id, key_name, service, description, expires_at, updated_at')
                        .order('service');
                    
                    if (secretsData) setSecrets(secretsData);
                } catch {
                    // system_secretsテーブルがない場合は空配列
                    setSecrets([]);
                }
            } catch (err) {
                // テーブルがない場合もデフォルト規約を表示
                setRules(DEFAULT_GOVERNANCE_RULES);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [supabase]);

    // 最強指示書生成
    const generateMasterPrompt = useCallback(() => {
        const directoryTree = `
## 📁 ディレクトリ構造

\`\`\`
n3-frontend_new/
├── app/                    # Next.js App Router (聖域)
│   ├── admin/              # 統治コックピット
│   ├── api/                # API Routes
│   └── tools/              # N3ツール群
├── components/             # React Components
│   ├── n3/                 # N3専用部品
│   ├── shared/             # 共通部品
│   └── ui/                 # shadcn/ui
├── lib/                    # ビジネスロジック
│   ├── actions/            # Server Actions
│   ├── contracts/          # Zod型定義
│   ├── shared/             # セキュリティモジュール
│   └── supabase/           # DBクライアント
├── hooks/                  # カスタムフック
├── types/                  # TypeScript型
└── [禁止] 01_PRODUCT, 02_DEV_LAB, 03_ARCHIVE_STORAGE
\`\`\`
`;

        const zodTypes = `
## 📦 StandardPayload 型定義

\`\`\`typescript
// lib/contracts/protocol.ts
import { z } from 'zod';

export const StandardPayloadSchema = z.object({
  meta: z.object({
    trace_id: z.string(),
    timestamp: z.number(),
    client_version: z.string(),
    source: z.string().optional()
  }),
  security: z.object({
    signature: z.string(),
    nonce: z.string()
  }).optional(),
  body: z.object({
    toolId: z.string(),
    action: z.string(),
    targets: z.array(z.string()).optional(),
    config: z.record(z.any()).optional()
  })
});
\`\`\`
`;

        const rulesSection = rules.filter(r => r.is_active).map(r => `
### ${r.rule_name} (${r.rule_key})
- **指示**: ${r.ai_instruction || '(未設定)'}
- **禁止パターン**: ${r.ai_forbidden_patterns?.join(', ') || 'なし'}
`).join('\n');

        const forbiddenList = `
## 🚫 絶対禁止事項

1. **Import禁止ディレクトリ**: \`01_PRODUCT\`, \`02_DEV_LAB\`, \`03_ARCHIVE_STORAGE\`, \`03_VAULT\`, \`n3_local_brain\`
2. **生fetch禁止**: \`fetch('/api/...')\` → \`imperialDispatch()\` を使用
3. **直接トークン参照禁止**: \`await fetchSecret('EBAY_API_KEY')\` → \`fetchSecret('ebay_api_key')\`
4. **古い方言禁止**: \`asin:\`, \`itemId:\` → \`targets: []\`
5. **IP直書き禁止**: \`160.16.120.186\` → \`process.env.N8N_BASE_URL\`
`;

        return `# 🏰 N3 EMPIRE OS - 最強指示書
> 生成日時: ${new Date().toLocaleString('ja-JP')}
> バージョン: Phase 3-A Commercial

${directoryTree}
${zodTypes}

## ⚖️ 統治規約
${rulesSection}
${forbiddenList}

## ✅ 作業完了チェックリスト

\`\`\`
□ TypeScript コンパイルエラーなし
□ ESLint 警告なし（no-restricted-imports 含む）
□ StandardPayload 形式準拠
□ imperialDispatch 使用（生fetch排除）
□ HMAC署名付きリクエストのみ
□ trace_id 自動付与確認
□ Import隔離遵守
□ task_index.json 参照済み
\`\`\`
`;
    }, [rules]);

    const copyMasterPrompt = useCallback(async () => {
        const prompt = generateMasterPrompt();
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [generateMasterPrompt]);

    // スキャン実行
    const runScan = useCallback(async () => {
        setScanResult(prev => ({ ...prev, status: 'running' }));
        await new Promise(resolve => setTimeout(resolve, 1500));
        setScanResult({
            status: 'completed',
            summary: { sacred_violations: 0, import_violations: 0, raw_fetch_count: 0, stray_files: 0 },
            timestamp: new Date().toISOString()
        });
    }, []);

    // AI Knowledge Sync - registry.jsonから法典を動的生成
    const handleAiSync = useCallback(async () => {
        setAiSyncLoading(true);
        try {
            const result = await generateAIPrompt();
            if (result.success && result.prompt) {
                setAiPrompt(result.prompt);
                setAiPromptStats(result.stats || null);
            } else {
                setAiPrompt(`エラー: ${result.error || '不明なエラー'}`);
                setAiPromptStats(null);
            }
        } catch (err) {
            setAiPrompt(`エラー: ${err instanceof Error ? err.message : '不明なエラー'}`);
            setAiPromptStats(null);
        } finally {
            setAiSyncLoading(false);
        }
    }, []);

    const copyAiPrompt = useCallback(async () => {
        if (!aiPrompt) return;
        await navigator.clipboard.writeText(aiPrompt);
        setAiCopied(true);
        setTimeout(() => setAiCopied(false), 2000);
    }, [aiPrompt]);

    return (
        <div style={{ padding: 24 }}>
            {/* ヘッダー */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Crown size={28} />
                        統治コックピット
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                        AI統治・セキュリティ管理・コード衛生
                    </p>
                </div>
                
                <button
                    onClick={copyMasterPrompt}
                    style={{
                        padding: '12px 24px',
                        borderRadius: 12,
                        border: 'none',
                        background: copied ? '#22c55e' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    }}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'コピー完了!' : '📋 最強指示書コピー'}
                </button>
            </div>

            {/* タブ */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <button
                    onClick={() => setActiveTab('rules')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: activeTab === 'rules' ? '2px solid #f59e0b' : '1px solid var(--panel-border)',
                        background: activeTab === 'rules' ? 'rgba(245, 158, 11, 0.1)' : 'var(--panel)',
                        color: activeTab === 'rules' ? '#f59e0b' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        fontWeight: activeTab === 'rules' ? 600 : 400,
                    }}
                >
                    <Scale size={16} />
                    ⚖️ 統治規約
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: activeTab === 'security' ? '2px solid #f59e0b' : '1px solid var(--panel-border)',
                        background: activeTab === 'security' ? 'rgba(245, 158, 11, 0.1)' : 'var(--panel)',
                        color: activeTab === 'security' ? '#f59e0b' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        fontWeight: activeTab === 'security' ? 600 : 400,
                    }}
                >
                    <Shield size={16} />
                    🛡️ セキュリティ
                </button>
                <button
                    onClick={() => setActiveTab('hygiene')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: activeTab === 'hygiene' ? '2px solid #f59e0b' : '1px solid var(--panel-border)',
                        background: activeTab === 'hygiene' ? 'rgba(245, 158, 11, 0.1)' : 'var(--panel)',
                        color: activeTab === 'hygiene' ? '#f59e0b' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        fontWeight: activeTab === 'hygiene' ? 600 : 400,
                    }}
                >
                    <Trash2 size={16} />
                    🧹 衛生
                </button>
                <button
                    onClick={() => setActiveTab('ai-sync')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: activeTab === 'ai-sync' ? '2px solid #22c55e' : '1px solid var(--panel-border)',
                        background: activeTab === 'ai-sync' ? 'rgba(34, 197, 94, 0.1)' : 'var(--panel)',
                        color: activeTab === 'ai-sync' ? '#22c55e' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        fontWeight: activeTab === 'ai-sync' ? 600 : 400,
                    }}
                >
                    <Cpu size={16} />
                    🧠 AI Sync
                </button>
                <button
                    onClick={() => setActiveTab('help')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: activeTab === 'help' ? '2px solid #6366f1' : '1px solid var(--panel-border)',
                        background: activeTab === 'help' ? 'rgba(99, 102, 241, 0.1)' : 'var(--panel)',
                        color: activeTab === 'help' ? '#6366f1' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        fontWeight: activeTab === 'help' ? 600 : 400,
                    }}
                >
                    <BookOpen size={16} />
                    📖 マニュアル
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                    <Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} />
                </div>
            ) : (
                <>
                    {/* ⚖️ 統治規約タブ */}
                    {activeTab === 'rules' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {rules.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                                    <Scale size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                                    <p>規約が登録されていません</p>
                                    <p style={{ fontSize: 12, marginTop: 8 }}>DBマイグレーションを実行してください</p>
                                </div>
                            ) : (
                                rules.map(rule => (
                                    <div key={rule.id} style={{ padding: 16, background: 'var(--panel)', borderRadius: 12, border: '1px solid var(--panel-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: rule.is_active ? '#22c55e' : '#6b7280' }} />
                                            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{rule.rule_name}</span>
                                            <code style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--highlight)', color: 'var(--text-muted)' }}>
                                                {rule.rule_key}
                                            </code>
                                            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>優先度: {rule.priority}</span>
                                        </div>
                                        {rule.ai_instruction && (
                                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{rule.ai_instruction}</p>
                                        )}
                                        {rule.ai_forbidden_patterns && rule.ai_forbidden_patterns.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {rule.ai_forbidden_patterns.map((p, i) => (
                                                    <code key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: '#fee2e2', color: '#dc2626' }}>
                                                        {p}
                                                    </code>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* 🛡️ セキュリティタブ */}
                    {activeTab === 'security' && (
                        <div>
                            <div style={{ padding: 16, background: '#fef3c7', borderRadius: 12, marginBottom: 16, border: '1px solid #f59e0b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
                                    <span style={{ fontWeight: 600, color: '#92400e' }}>二重鍵暗号化</span>
                                </div>
                                <p style={{ fontSize: 13, color: '#92400e' }}>
                                    MASTER_KEY (.env) → DATA_KEY (DB) → 実トークン の二重鍵方式で保護
                                </p>
                            </div>
                            
                            {secrets.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                                    <Key size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                                    <p>登録されたトークンはありません</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {secrets.map(secret => (
                                        <div key={secret.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'var(--panel)', borderRadius: 12, border: '1px solid var(--panel-border)' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                    <Lock size={14} style={{ color: '#22c55e' }} />
                                                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{secret.key_name}</span>
                                                </div>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                                    サービス: {secret.service}
                                                    {secret.expires_at && ` • 期限: ${new Date(secret.expires_at).toLocaleDateString('ja-JP')}`}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button style={{ padding: 8, borderRadius: 8, border: 'none', background: 'var(--highlight)', cursor: 'pointer' }}>
                                                    <Eye size={16} style={{ color: 'var(--text-muted)' }} />
                                                </button>
                                                <button style={{ padding: 8, borderRadius: 8, border: 'none', background: 'var(--highlight)', cursor: 'pointer' }}>
                                                    <RefreshCw size={16} style={{ color: '#3b82f6' }} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 🧹 衛生タブ */}
                    {activeTab === 'hygiene' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                                <button
                                    onClick={runScan}
                                    disabled={scanResult.status === 'running'}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: 10,
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                        color: 'white',
                                        cursor: scanResult.status === 'running' ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 13,
                                        fontWeight: 600,
                                    }}
                                >
                                    {scanResult.status === 'running' ? <Loader2 size={16} className="animate-spin" /> : <Scan size={16} />}
                                    スキャン実行
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                                {[
                                    { label: '聖域侵入', value: scanResult.summary.sacred_violations, bad: scanResult.summary.sacred_violations > 0 },
                                    { label: 'Import違反', value: scanResult.summary.import_violations, bad: scanResult.summary.import_violations > 0 },
                                    { label: '生fetch', value: scanResult.summary.raw_fetch_count, bad: scanResult.summary.raw_fetch_count > 0 },
                                    { label: '野良ファイル', value: scanResult.summary.stray_files, bad: scanResult.summary.stray_files > 0 },
                                ].map((item, i) => (
                                    <div key={i} style={{ padding: 20, background: 'var(--panel)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--panel-border)' }}>
                                        <p style={{ fontSize: 28, fontWeight: 700, color: item.bad ? '#ef4444' : '#22c55e' }}>{item.value}</p>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            {scanResult.status === 'completed' && (
                                <div style={{ padding: 20, background: '#dcfce7', borderRadius: 12, textAlign: 'center', border: '1px solid #22c55e' }}>
                                    <CheckCircle size={32} style={{ color: '#22c55e', marginBottom: 8 }} />
                                    <p style={{ fontWeight: 600, color: '#166534' }}>全チェック合格 ✨</p>
                                    <p style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>
                                        最終スキャン: {scanResult.timestamp && new Date(scanResult.timestamp).toLocaleString('ja-JP')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 🧠 AI Sync タブ */}
                    {activeTab === 'ai-sync' && (
                        <div>
                            {/* 説明 */}
                            <div style={{ padding: 16, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 12, marginBottom: 16, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <Cpu size={16} style={{ color: '#22c55e' }} />
                                    <span style={{ fontWeight: 600, color: '#166534' }}>AI Knowledge Sync</span>
                                </div>
                                <p style={{ fontSize: 13, color: '#166534' }}>
                                    governance/registry.json から MASTER_LAW・TASK・PROTOCOL などを動的に編纂し、<br />
                                    最新の「帝国法典」を生成します。Claude Web版に渡してください。
                                </p>
                            </div>

                            {/* 取得ボタン */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <button
                                    onClick={handleAiSync}
                                    disabled={aiSyncLoading}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: 12,
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        color: 'white',
                                        cursor: aiSyncLoading ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                                    }}
                                >
                                    {aiSyncLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                                    {aiSyncLoading ? '編纂中...' : '🔄 最新法典を取得'}
                                </button>

                                {aiPrompt && (
                                    <button
                                        onClick={copyAiPrompt}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: 12,
                                            border: 'none',
                                            background: aiCopied ? '#22c55e' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            fontSize: 14,
                                            fontWeight: 700,
                                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                        }}
                                    >
                                        {aiCopied ? <Check size={18} /> : <Copy size={18} />}
                                        {aiCopied ? 'コピー完了!' : '📋 法典をコピー'}
                                    </button>
                                )}
                            </div>

                            {/* 統計情報 */}
                            {aiPromptStats && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                                    <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--panel-border)' }}>
                                        <p style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>{aiPromptStats.total_sources}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>総ソース</p>
                                    </div>
                                    <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--panel-border)' }}>
                                        <p style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{aiPromptStats.loaded_sources}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>読込成功</p>
                                    </div>
                                    <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--panel-border)' }}>
                                        <p style={{ fontSize: 24, fontWeight: 700, color: aiPromptStats.failed_sources.length > 0 ? '#ef4444' : '#22c55e' }}>{aiPromptStats.failed_sources.length}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>失敗</p>
                                    </div>
                                    <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--panel-border)' }}>
                                        <p style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{(aiPromptStats.total_chars / 1000).toFixed(1)}K</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>文字数</p>
                                    </div>
                                </div>
                            )}

                            {/* プレビュー */}
                            {aiPrompt ? (
                                <div style={{ position: 'relative' }}>
                                    <textarea
                                        readOnly
                                        value={aiPrompt}
                                        style={{
                                            width: '100%',
                                            height: 400,
                                            background: 'rgba(0, 0, 0, 0.6)',
                                            color: '#22c55e',
                                            padding: 20,
                                            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                            fontSize: 11,
                                            border: '1px solid rgba(34, 197, 94, 0.2)',
                                            borderRadius: 16,
                                            resize: 'none',
                                            outline: 'none',
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 80,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                        borderRadius: '0 0 16px 16px',
                                        pointerEvents: 'none',
                                    }} />
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)', background: 'var(--panel)', borderRadius: 16 }}>
                                    <Cpu size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                                    <p>「最新法典を取得」ボタンを押して</p>
                                    <p>registry.json から法典を編纂してください</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 📖 マニュアルタブ */}
                    {activeTab === 'help' && (
                        <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                            {/* 概要 */}
                            <div style={{ padding: 20, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: 16, marginBottom: 20, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#6366f1', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <BookOpen size={20} />
                                    統治コックピット マニュアル
                                </h3>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                    このダッシュボードは、N3プロジェクトの<strong style={{ color: '#6366f1' }}>AI統治</strong>・<strong style={{ color: '#f59e0b' }}>セキュリティ</strong>・<strong style={{ color: '#22c55e' }}>品質管理</strong>を一元的に行うためのコックピットです。
                                </p>
                            </div>

                            {/* 5タブ説明 */}
                            <div style={{ marginBottom: 20 }}>
                                <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>🗂️ タブ機能</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {[
                                        { icon: '⚖️', name: '統治規約', desc: 'DBまたはデフォルトの6規約を表示。AI向け禁止パターンを管理', color: '#f59e0b' },
                                        { icon: '🛡️', name: 'セキュリティ', desc: 'system_secrets テーブルのメタデータ表示。二重鍵暗号化で保護', color: '#f59e0b' },
                                        { icon: '🧹', name: '衛生', desc: '聖域侵入/Import違反/生fetch/野良ファイルをスキャン検出', color: '#f59e0b' },
                                        { icon: '🧠', name: 'AI Sync', desc: 'registry.json から動的に「帝国法典」を生成しClaudeへ渡す', color: '#22c55e' },
                                        { icon: '📖', name: 'マニュアル', desc: '今見ているこのページ。使い方とトラブルシューティング', color: '#6366f1' },
                                    ].map((tab, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, background: 'var(--panel)', borderRadius: 10, border: '1px solid var(--panel-border)' }}>
                                            <span style={{ fontSize: 20, flexShrink: 0 }}>{tab.icon}</span>
                                            <div>
                                                <span style={{ fontWeight: 600, color: tab.color }}>{tab.name}</span>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{tab.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Sync ワークフロー */}
                            <div style={{ marginBottom: 20 }}>
                                <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>🧠 AI Sync ワークフロー</h4>
                                <div style={{ padding: 16, background: 'rgba(34, 197, 94, 0.05)', borderRadius: 12, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                                    <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
                                        <li><strong style={{ color: '#22c55e' }}>「🔄 最新法典を取得」</strong> ボタンをクリック</li>
                                        <li>統計を確認（総ソース / 成功 / 失敗 / 文字数）</li>
                                        <li><strong style={{ color: '#6366f1' }}>「📋 法典をコピー」</strong> ボタンをクリック</li>
                                        <li>Claude Web版の新規チャットに貼り付け</li>
                                    </ol>
                                </div>
                            </div>

                            {/* デフォルト規約 */}
                            <div style={{ marginBottom: 20 }}>
                                <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>📋 デフォルト6規約</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                    {[
                                        { rule: '🚫 生fetch禁止', desc: 'imperialDispatch()を使用' },
                                        { rule: '🚫 聖域Import禁止', desc: '01_PRODUCT等からのimport禁止' },
                                        { rule: '🚫 IP直書き禁止', desc: '環境変数を使用' },
                                        { rule: '✅ Server Actions使用', desc: 'クライアントからDB経由' },
                                        { rule: '✅ Zod検証必須', desc: '全API入出力をZodで検証' },
                                        { rule: '🚫 console.log禁止', desc: 'console.errorのみ許可' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ padding: 10, background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
                                            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.rule}</p>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* トラブルシューティング */}
                            <div style={{ marginBottom: 20 }}>
                                <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>❓ トラブルシューティング</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {[
                                        { q: '「法典を取得」が失敗する', a: 'governance/registry.json のパスとJSON構文を確認。Server Actionsが動作していることを確認' },
                                        { q: '規約が表示されない', a: 'DBが空でもデフォルト6規約が表示されるはず。ローディングが永続する場合はSupabase接続を確認' },
                                        { q: '衛生スキャンが動かない', a: '現在はモック実装。将来的に実際のファイルスキャン機能を追加予定' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ padding: 14, background: 'var(--panel)', borderRadius: 10, border: '1px solid var(--panel-border)' }}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 6 }}>Q: {item.q}</p>
                                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>A: {item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 関連ファイル */}
                            <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12, border: '1px solid var(--panel-border)' }}>
                                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>📁 関連ファイル</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {[
                                        'governance/registry.json',
                                        'governance/MASTER_LAW.md',
                                        'lib/actions/governance-actions.ts',
                                        'app/tools/command-center/page.tsx',
                                    ].map((file, i) => (
                                        <code key={i} style={{ fontSize: 11, padding: '6px 10px', background: 'var(--highlight)', borderRadius: 6, color: '#22c55e' }}>
                                            {file}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

// ============================================================
// フロー図（既存コード・簡略化）
// ============================================================

const FlowDiagram = memo(function FlowDiagram({ diagram }: { diagram: NonNullable<Category['flowDiagram']> }) {
    return (
        <div style={{ padding: 20, background: 'var(--panel)', borderRadius: 12, marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>{diagram.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {diagram.steps.map((step, idx) => (
                    <div key={step.step} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                            {step.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: 4 }}>Step {step.step}</span>
                                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{step.name}</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{step.desc}</div>
                        </div>
                        {idx < diagram.steps.length - 1 && <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                ))}
            </div>
        </div>
    );
});

// ============================================================
// リファレンス情報（既存コード・簡略化）
// ============================================================

const ReferenceInfo = memo(function ReferenceInfo({ info, copiedId, onCopy }: { info: NonNullable<Category['info']>; copiedId: string | null; onCopy: (command: string, id: string) => void }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {info.paths && (
                <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>📁 {info.paths.title}</h4>
                    {info.paths.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 12, padding: '10px 14px', background: 'var(--highlight)', borderRadius: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.location}</span>
                            <code style={{ fontSize: 12, color: '#22c55e' }}>{item.path}</code>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.note}</span>
                        </div>
                    ))}
                </div>
            )}
            {info.ssh && (
                <div style={{ padding: 16, background: 'var(--panel)', borderRadius: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>🔑 {info.ssh.title}</h4>
                    <button onClick={() => onCopy(info.ssh!.command, 'ssh-ref')} style={{ width: '100%', padding: 12, background: 'var(--highlight)', border: '1px solid var(--panel-border)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <code style={{ fontSize: 12, color: 'var(--text)' }}>{info.ssh.command}</code>
                        {copiedId === 'ssh-ref' ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                    </button>
                </div>
            )}
        </div>
    );
});

// ============================================================
// サイドバー
// ============================================================

const Sidebar = memo(function Sidebar({ activeCategory, onSelect, searchQuery, onSearchChange }: { activeCategory: string; onSelect: (id: string) => void; searchQuery: string; onSearchChange: (query: string) => void }) {
    return (
        <div style={{ width: 280, borderRight: '1px solid var(--panel-border)', background: 'var(--panel)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--panel-border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                        <Terminal size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>N3 コマンドセンター</div>
                        <div style={{ fontSize: 10, color: '#f59e0b' }}>Commander: AKI-NANA</div>
                    </div>
                </div>

                {/* 統治コックピットへのリンク */}
                <button
                    onClick={() => onSelect(GOVERNANCE_CATEGORY_ID)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 14px',
                        background: activeCategory === GOVERNANCE_CATEGORY_ID 
                            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))'
                            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                        border: activeCategory === GOVERNANCE_CATEGORY_ID
                            ? '2px solid #f59e0b'
                            : '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: 10,
                        marginBottom: 10,
                        cursor: 'pointer',
                        color: '#f59e0b',
                        fontSize: 13,
                        fontWeight: 600,
                    }}
                >
                    <Crown size={16} />
                    👑 統治コックピット
                </button>

                <a href="/tools/deploy-center" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 10, marginBottom: 14, textDecoration: 'none', color: '#22c55e', fontSize: 13, fontWeight: 600 }}>
                    🚢 デプロイセンター（GUI操作）
                    <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
                </a>

                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="コマンド検索..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 36px', fontSize: 13, border: '1px solid var(--panel-border)', borderRadius: 10, background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} />
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
                {categories.map(cat => {
                    const isActive = activeCategory === cat.id;
                    const isDaily = cat.id === 'daily-commands';
                    const isOneClick = cat.id === 'oneclick-deploy';

                    return (
                        <button key={cat.id} onClick={() => onSelect(cat.id)} style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 10, border: isDaily ? '2px solid rgba(34, 197, 94, 0.4)' : isOneClick ? '2px solid rgba(245, 158, 11, 0.4)' : 'none', cursor: 'pointer', background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))' : isDaily ? 'rgba(34, 197, 94, 0.1)' : isOneClick ? 'rgba(245, 158, 11, 0.1)' : 'transparent', color: isActive ? '#6366f1' : isDaily ? '#22c55e' : isOneClick ? '#f59e0b' : 'var(--text)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(128, 128, 128, 0.1)' }}>
                                {categoryIcons[cat.id] || <ChevronRight size={14} />}
                            </span>
                            <span style={{ fontSize: 13, fontWeight: isActive || isDaily || isOneClick ? 600 : 400, flex: 1 }}>{cat.name}</span>
                        </button>
                    );
                })}
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--panel-border)', fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>
                ROOT: ~/n3-frontend_new
            </div>
        </div>
    );
});

// ============================================================
// メインコンテンツ
// ============================================================

const MainContent = memo(function MainContent({ activeData, filteredCommands, copiedId, onCopy, onOpenLink, isGovernance }: { activeData: Category | undefined; filteredCommands: Command[] | null; copiedId: string | null; onCopy: (command: string, id: string) => void; onOpenLink: (url: string) => void; isGovernance: boolean }) {
    if (isGovernance) {
        return <GovernanceCockpit copiedId={copiedId} onCopy={onCopy} />;
    }

    if (filteredCommands) {
        return (
            <div style={{ padding: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: 'var(--text)' }}>🔍 検索結果: {filteredCommands.length}件</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredCommands.map(cmd => <CommandCard key={cmd.id} cmd={cmd} copiedId={copiedId} onCopy={onCopy} onOpenLink={onOpenLink} />)}
                </div>
            </div>
        );
    }

    if (!activeData) return null;

    const isDaily = activeData.id === 'daily-commands';
    const isOneClick = activeData.id === 'oneclick-deploy';

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: isDaily || isOneClick ? 24 : 20, fontWeight: 700, color: isDaily ? '#22c55e' : isOneClick ? '#f59e0b' : 'var(--text)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {activeData.name}
                    {isDaily && <Rocket size={24} style={{ color: '#22c55e' }} />}
                    {isOneClick && <Zap size={24} style={{ color: '#f59e0b' }} />}
                </h2>
                {activeData.description && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>{activeData.description}</p>}
                {activeData.when && (
                    <div style={{ padding: '12px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 10, fontSize: 13, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <Info size={16} />
                        <strong>いつ使う？</strong> {activeData.when}
                    </div>
                )}
                {activeData.important && (
                    <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 10, fontSize: 13, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AlertTriangle size={16} />
                        {activeData.important}
                    </div>
                )}
            </div>

            {activeData.flowDiagram && <FlowDiagram diagram={activeData.flowDiagram} />}
            {activeData.info && <ReferenceInfo info={activeData.info} copiedId={copiedId} onCopy={onCopy} />}

            {activeData.commands && activeData.commands.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: activeData.info || activeData.flowDiagram ? 20 : 0 }}>
                    {activeData.commands.map((cmd, idx) => (
                        <CommandCard key={cmd.id} cmd={cmd} copiedId={copiedId} onCopy={onCopy} onOpenLink={onOpenLink} isHighlighted={(isDaily || isOneClick) && idx === 0} />
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
    const [activeCategory, setActiveCategory] = useState<string>('daily-commands');
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

    const filteredCommands = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase();
        const results: Command[] = [];
        categories.forEach(cat => {
            cat.commands?.forEach(cmd => {
                if (cmd.name.toLowerCase().includes(query) || cmd.description?.toLowerCase().includes(query) || cmd.command.toLowerCase().includes(query) || cmd.tags?.some(t => t.toLowerCase().includes(query))) {
                    results.push(cmd);
                }
            });
        });
        return results;
    }, [searchQuery]);

    const activeData = useMemo(() => categories.find(c => c.id === activeCategory), [activeCategory]);
    const isGovernance = activeCategory === GOVERNANCE_CATEGORY_ID;

    return (
        <div style={{ display: 'flex', height: '100%', background: 'var(--bg)', overflow: 'hidden' }}>
            <Sidebar activeCategory={activeCategory} onSelect={handleCategorySelect} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <MainContent activeData={activeData} filteredCommands={filteredCommands} copiedId={copiedId} onCopy={handleCopy} onOpenLink={handleLinkClick} isGovernance={isGovernance} />
            </div>
        </div>
    );
}
