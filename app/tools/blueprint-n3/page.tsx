// app/tools/blueprint-n3/page.tsx
// Blueprint N3 - N3 Empire OS 神経系マップ
// 修正日: 2026-01-30 - キャッシュ問題対応版
'use client';

import React, { useState, useMemo } from 'react';
import {
  Map as MapIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Circle,
  Search,
  ExternalLink,
  Eye,
  Code,
  Database,
  Zap,
  Brain,
  Network,
  FileCode,
  Download,
  BookOpen,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { N3WorkspaceLayout, type L2Tab } from '@/components/layouts';

// ============================================================
// 型定義（インラインで定義してキャッシュ問題を回避）
// ============================================================
type WorkflowStatus = 'active' | 'partial' | 'planned' | 'deprecated';
type WorkflowCategory = 'listing' | 'inventory' | 'research' | 'pricing' | 'orders' | 'shipping' | 'sync' | 'ai' | 'media' | 'translation' | 'defense' | 'command' | 'finance' | 'notification' | 'system' | 'module';
type TechStack = 'n8n' | 'python' | 'typescript' | 'sql' | 'shell';
type AIComponent = 'claude' | 'gemini' | 'gpt4' | 'elevenlabs' | 'midjourney' | 'whisper' | 'none';

interface WorkflowNode {
  id: string;
  name: string;
  nameJp: string;
  description: string;
  category: WorkflowCategory;
  status: WorkflowStatus;
  techStack: TechStack[];
  aiComponents: AIComponent[];
  hasUI: boolean;
  hasAPI: boolean;
  hasDB: boolean;
  webhookPath?: string;
  n8nWorkflowId?: string;
  dependencies: string[];
  triggers: string[];
  simpleExplain?: string;
  whenRuns?: string;
  whatHappens?: string;
  logic?: string;
  selfHealing?: boolean;
  autoApproval?: boolean;
  pythonScripts?: string[];
}

interface PythonScript {
  id: string;
  name: string;
  description: string;
}

// ============================================================
// カテゴリ設定
// ============================================================
const CATEGORY_CONFIG: Record<WorkflowCategory, { icon: string; color: string; label: string }> = {
  listing: { icon: '📦', color: '#10b981', label: '出品' },
  inventory: { icon: '📊', color: '#3b82f6', label: '在庫' },
  research: { icon: '🔍', color: '#8b5cf6', label: 'リサーチ' },
  pricing: { icon: '💰', color: '#f59e0b', label: '価格' },
  orders: { icon: '📋', color: '#ec4899', label: '注文' },
  shipping: { icon: '🚚', color: '#06b6d4', label: '配送' },
  sync: { icon: '🔄', color: '#6366f1', label: '同期' },
  ai: { icon: '🤖', color: '#14b8a6', label: 'AI' },
  media: { icon: '🎬', color: '#f97316', label: 'メディア' },
  translation: { icon: '🌐', color: '#0ea5e9', label: '翻訳' },
  defense: { icon: '🛡️', color: '#ef4444', label: '防衛' },
  command: { icon: '🎯', color: '#a855f7', label: '司令塔' },
  finance: { icon: '💵', color: '#22c55e', label: '財務' },
  notification: { icon: '🔔', color: '#eab308', label: '通知' },
  system: { icon: '⚙️', color: '#6b7280', label: 'システム' },
  module: { icon: '🧩', color: '#78716c', label: 'モジュール' },
};

// ============================================================
// Pythonスクリプト一覧
// ============================================================
const PYTHON_SCRIPTS: PythonScript[] = [
  { id: 'image-washer', name: 'image_washer.py', description: 'AI画像指紋消し' },
  { id: 'pdf-parser', name: 'pdf_parser.py', description: 'PDF過去問抽出' },
  { id: 'lip-sync', name: 'lip_sync.py', description: 'リップシンクデータ生成' },
  { id: 'competitor-scraper', name: 'competitor_scraper.py', description: '競合スクレイピング' },
  { id: 'hts-classifier', name: 'hts_classifier.py', description: 'HTS関税コード分類' },
  { id: 'psa-grader', name: 'psa_grader.py', description: 'PSAグレード予測' },
  { id: 'video-render', name: 'video_render.py', description: '動画レンダリング' },
  { id: 'ocr-engine', name: 'ocr_engine.py', description: '日本語OCR' },
];

// ============================================================
// ワークフローレジストリ（主要なもの抜粋）
// ============================================================
const WORKFLOW_REGISTRY: WorkflowNode[] = [
  // === 出品 (listing) ===
  { id: 'listing-reserve', name: 'listing-reserve', nameJp: '📦 出品予約', description: '選択商品をeBay/Amazonに出品予約', category: 'listing', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/listing-reserve', dependencies: ['notify-chatwork'], triggers: ['schedule-cron'], simpleExplain: '商品を選んで出品ボタンを押すとeBayに自動登録', selfHealing: true },
  { id: 'listing-batch', name: 'listing-batch', nameJp: '📦 バッチ出品', description: '大量商品を一括出品', category: 'listing', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/listing-batch', dependencies: ['listing-reserve'], triggers: [], simpleExplain: '100件以上の商品を一気に出品' },
  { id: 'listing-relist', name: 'listing-relist', nameJp: '🔁 再出品', description: '売れなかった商品を自動再出品', category: 'listing', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/listing-relist', dependencies: [], triggers: ['schedule-cron'], simpleExplain: '売れなかった商品を自動で再出品', selfHealing: true, autoApproval: true },
  { id: 'listing-end', name: 'listing-end', nameJp: '⏹️ 出品終了', description: '商品の出品を終了', category: 'listing', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/listing-end', dependencies: [], triggers: [], simpleExplain: '出品をやめたい商品をeBayから取り下げ' },
  { id: 'listing-title-optimize', name: 'listing-title-optimize', nameJp: '✨ タイトル最適化', description: 'AIでSEO最適なタイトル生成', category: 'listing', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['claude', 'gemini'], hasUI: true, hasAPI: true, hasDB: false, webhookPath: '/webhook/listing-title', dependencies: [], triggers: [], simpleExplain: 'AIが売れるタイトルを考える' },

  // === 在庫 (inventory) ===
  { id: 'inventory-sync-all', name: 'inventory-sync-all', nameJp: '🔄 全在庫同期', description: '全マーケットプレイスの在庫を一括同期', category: 'inventory', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/inventory-sync', dependencies: ['listing-revise-quantity'], triggers: ['schedule-cron'], simpleExplain: 'eBay/Amazon/全部の在庫数を揃える', selfHealing: true },
  { id: 'inventory-monitoring', name: 'inventory-monitoring', nameJp: '👁️ 在庫監視', description: '仕入先の在庫状況をスクレイピング監視', category: 'inventory', status: 'active', techStack: ['n8n', 'python'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/inventory-monitoring', dependencies: ['notify-chatwork'], triggers: ['schedule-cron'], simpleExplain: '仕入先サイトを見張って売り切れを検知', pythonScripts: ['competitor_scraper.py'], selfHealing: true },
  { id: 'inventory-auto-delist', name: 'inventory-auto-delist', nameJp: '🚫 自動取り下げ', description: '在庫切れ商品を自動で出品停止', category: 'inventory', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: false, hasAPI: true, hasDB: true, webhookPath: '/webhook/inventory-delist', dependencies: ['listing-end'], triggers: ['inventory-monitoring'], simpleExplain: '在庫0になったら自動で出品を止める', autoApproval: true, selfHealing: true },

  // === 価格 (pricing) ===
  { id: 'pricing-profit-calc', name: 'pricing-profit-calc', nameJp: '💰 利益計算', description: '販売価格から利益を自動計算', category: 'pricing', status: 'active', techStack: ['n8n', 'typescript', 'sql'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/pricing-profit', dependencies: [], triggers: ['listing-reserve'], simpleExplain: '売値を入れるといくら儲かるか自動計算', logic: '売価 - 原価 - 手数料 - 送料 = 利益' },
  { id: 'pricing-dynamic', name: 'pricing-dynamic', nameJp: '📈 動的価格調整', description: '需要/在庫に応じて価格を自動調整', category: 'pricing', status: 'partial', techStack: ['n8n', 'typescript'], aiComponents: ['gemini'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/pricing-dynamic', dependencies: ['listing-revise-price'], triggers: ['schedule-cron'], simpleExplain: '売れ行きに応じて自動で値段を上げ下げ' },
  { id: 'pricing-min-profit-guard', name: 'pricing-min-profit-guard', nameJp: '🛡️ 最低利益保証', description: '赤字になる価格設定を防止', category: 'pricing', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: false, hasAPI: true, hasDB: true, webhookPath: '/webhook/pricing-guard', dependencies: [], triggers: ['listing-reserve', 'pricing-dynamic'], simpleExplain: '絶対に赤字にならないようにストッパー', selfHealing: true },

  // === AI ===
  { id: 'ai-enrich-product', name: 'ai-enrich-product', nameJp: '🤖 AI商品拡充', description: 'AIで商品情報を自動補完・拡充', category: 'ai', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['claude', 'gemini'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/ai-enrich', dependencies: [], triggers: [], simpleExplain: '画像と商品名から、AIが詳しい情報を補完', logic: '画像 + タイトル → Gemini分析 → Claude構造化' },
  { id: 'ai-condition-grade', name: 'ai-condition-grade', nameJp: '📊 コンディション判定', description: 'AIで商品状態をグレーディング', category: 'ai', status: 'active', techStack: ['n8n', 'python'], aiComponents: ['claude', 'gemini'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/ai-condition', dependencies: [], triggers: [], simpleExplain: '写真を見て「これはNear Mint」とかグレードをつける', pythonScripts: ['psa_grader.py'] },
  { id: 'ai-translate-listing', name: 'ai-translate-listing', nameJp: '🌐 AI翻訳', description: '商品情報を多言語翻訳', category: 'ai', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['claude'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/ai-translate', dependencies: [], triggers: [], simpleExplain: '日本語の商品説明を英語に自動翻訳' },
  { id: 'ai-inquiry-response', name: 'ai-inquiry-response', nameJp: '💬 AI問い合わせ対応', description: 'バイヤーからの問い合わせにAIが回答案を生成', category: 'ai', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['claude'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/ai-inquiry', dependencies: ['notify-chatwork'], triggers: [], simpleExplain: 'バイヤーからの質問にAIが返信案を作る', autoApproval: false },

  // === リサーチ (research) ===
  { id: 'research-competitor', name: 'research-competitor', nameJp: '🔍 競合分析', description: '競合セラーの出品を分析', category: 'research', status: 'active', techStack: ['n8n', 'python'], aiComponents: ['gemini'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/research-competitor', dependencies: [], triggers: ['schedule-cron'], simpleExplain: 'ライバルがどんな商品をいくらで売ってるか分析', pythonScripts: ['competitor_scraper.py'] },
  { id: 'research-sold-analysis', name: 'research-sold-analysis', nameJp: '📊 売れ筋分析', description: 'eBay Sold Listingsを分析', category: 'research', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/research-sold', dependencies: [], triggers: ['schedule-cron'], simpleExplain: '最近何が売れてるか分析' },

  // === 防衛 (defense) ===
  { id: 'defense-vero-check', name: 'defense-vero-check', nameJp: '🛡️ VERO確認', description: 'eBay VERO違反をチェック', category: 'defense', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/defense-vero', dependencies: [], triggers: ['listing-reserve'], simpleExplain: '出品禁止ブランドかチェック' },
  { id: 'defense-ban-monitor', name: 'defense-ban-monitor', nameJp: '⚠️ アカウント監視', description: 'アカウント制限兆候を監視', category: 'defense', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/defense-ban', dependencies: ['notify-chatwork'], triggers: ['schedule-cron'], simpleExplain: 'アカウント制限の兆候を警告' },

  // === 同期 (sync) ===
  { id: 'sync-ebay-inventory', name: 'sync-ebay-inventory', nameJp: '🔄 eBay在庫同期', description: 'eBay在庫をDBと同期', category: 'sync', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/sync-ebay', dependencies: [], triggers: ['schedule-cron'], simpleExplain: 'eBayとDBの在庫数を揃える', selfHealing: true },
  { id: 'sync-orders-all', name: 'sync-orders-all', nameJp: '🔄 全注文同期', description: '全プラットフォームの注文を同期', category: 'sync', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/sync-orders', dependencies: ['orders-new'], triggers: ['schedule-cron'], selfHealing: true },
  { id: 'sync-token-refresh', name: 'sync-token-refresh', nameJp: '🔑 トークン更新', description: 'OAuthトークンを自動更新', category: 'sync', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: false, hasAPI: true, hasDB: true, webhookPath: '/webhook/sync-token', dependencies: [], triggers: ['schedule-cron'], selfHealing: true, autoApproval: true },

  // === 通知 (notification) ===
  { id: 'notify-chatwork', name: 'notify-chatwork', nameJp: '💬 ChatWork通知', description: 'ChatWorkにメッセージを送信', category: 'notification', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: false, webhookPath: '/webhook/notify-chatwork', dependencies: [], triggers: [] },
  { id: 'notify-daily-summary', name: 'notify-daily-summary', nameJp: '📊 日次サマリー', description: '1日の売上/出品サマリーを通知', category: 'notification', status: 'active', techStack: ['n8n', 'sql'], aiComponents: ['none'], hasUI: false, hasAPI: true, hasDB: true, webhookPath: '/webhook/notify-summary', dependencies: ['notify-chatwork'], triggers: ['schedule-cron'], autoApproval: true },

  // === 注文 (orders) ===
  { id: 'orders-new', name: 'orders-new', nameJp: '📋 新規注文取込', description: 'eBay/Amazonから新規注文を取込', category: 'orders', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/orders-new', dependencies: ['notify-chatwork'], triggers: ['schedule-cron'], selfHealing: true },
  { id: 'orders-ship-notify', name: 'orders-ship-notify', nameJp: '📦 発送通知', description: 'バイヤーに発送完了を通知', category: 'orders', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/orders-ship', dependencies: [], triggers: ['shipping-label-create'] },

  // === 配送 (shipping) ===
  { id: 'shipping-label-create', name: 'shipping-label-create', nameJp: '🏷️ 送り状作成', description: 'EMS/ePacketの送り状を作成', category: 'shipping', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/shipping-label', dependencies: ['orders-ship-notify'], triggers: [] },
  { id: 'shipping-tracking-update', name: 'shipping-tracking-update', nameJp: '📍 追跡更新', description: '追跡番号のステータスを更新', category: 'shipping', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/shipping-tracking', dependencies: [], triggers: ['schedule-cron'] },

  // === 財務 (finance) ===
  { id: 'finance-sales-report', name: 'finance-sales-report', nameJp: '📊 売上レポート', description: '売上データをレポート化', category: 'finance', status: 'active', techStack: ['n8n', 'sql'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/finance-sales', dependencies: [], triggers: ['schedule-cron'] },
  { id: 'finance-profit-report', name: 'finance-profit-report', nameJp: '💰 利益レポート', description: '利益データをレポート化', category: 'finance', status: 'active', techStack: ['n8n', 'sql'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/finance-profit', dependencies: [], triggers: ['schedule-cron'] },

  // === メディア (media) ===
  { id: 'media-video-create', name: 'media-video-create', nameJp: '🎬 動画生成', description: 'Remotionで動画を自動生成', category: 'media', status: 'partial', techStack: ['n8n', 'typescript', 'python'], aiComponents: ['claude', 'elevenlabs'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/media-video', dependencies: ['ai-voice-generate'], triggers: [], pythonScripts: ['video_render.py', 'lip_sync.py'] },

  // === 司令塔 (command) ===
  { id: 'schedule-cron', name: 'schedule-cron', nameJp: '⏰ スケジュール実行', description: 'cron形式で定期実行を管理', category: 'command', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/schedule-cron', n8nWorkflowId: 'N3-SCHEDULE-CRON-COMPLETE', dependencies: [], triggers: [], selfHealing: true },
  { id: 'command-health-check', name: 'command-health-check', nameJp: '🏥 ヘルスチェック', description: 'システム全体の健全性を確認', category: 'command', status: 'active', techStack: ['n8n', 'typescript'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/command-health', dependencies: ['notify-chatwork'], triggers: ['schedule-cron'], selfHealing: true },
  { id: 'command-emergency-stop', name: 'command-emergency-stop', nameJp: '🛑 緊急停止', description: '全ワークフローを緊急停止', category: 'command', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: false, webhookPath: '/webhook/command-stop', dependencies: ['notify-chatwork'], triggers: [] },

  // === システム (system) ===
  { id: 'system-backup', name: 'system-backup', nameJp: '💾 バックアップ', description: 'DBをバックアップ', category: 'system', status: 'active', techStack: ['n8n', 'shell', 'sql'], aiComponents: ['none'], hasUI: false, hasAPI: true, hasDB: true, webhookPath: '/webhook/system-backup', dependencies: [], triggers: ['schedule-cron'], autoApproval: true },
  { id: 'system-error-report', name: 'system-error-report', nameJp: '🐛 エラーレポート', description: 'エラーをレポート化', category: 'system', status: 'active', techStack: ['n8n', 'sql'], aiComponents: ['none'], hasUI: true, hasAPI: true, hasDB: true, webhookPath: '/webhook/system-error', dependencies: ['notify-chatwork'], triggers: ['schedule-cron'] },

  // === 共通モジュール (module) ===
  { id: 'module-error-handler', name: 'module-error-handler', nameJp: '🛠️ エラーハンドラー', description: '共通エラー処理モジュール', category: 'module', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: false, hasAPI: false, hasDB: false, dependencies: ['notify-chatwork'], triggers: [], selfHealing: true },
  { id: 'module-retry-logic', name: 'module-retry-logic', nameJp: '🔄 リトライロジック', description: '共通リトライ処理モジュール', category: 'module', status: 'active', techStack: ['n8n'], aiComponents: ['none'], hasUI: false, hasAPI: false, hasDB: false, dependencies: [], triggers: [], selfHealing: true },
];

// ============================================================
// ヘルパー関数
// ============================================================
function getWorkflowById(id: string): WorkflowNode | undefined {
  return WORKFLOW_REGISTRY.find(w => w.id === id);
}

function getWorkflowsByCategory(category: WorkflowCategory): WorkflowNode[] {
  return WORKFLOW_REGISTRY.filter(w => w.category === category);
}

function getWorkflowDependencies(id: string): WorkflowNode[] {
  const wf = getWorkflowById(id);
  if (!wf) return [];
  return wf.dependencies.map(d => getWorkflowById(d)).filter(Boolean) as WorkflowNode[];
}

function getWorkflowTriggers(id: string): WorkflowNode[] {
  return WORKFLOW_REGISTRY.filter(w => w.triggers.includes(id));
}

function getCategorySummary(): Array<{ category: WorkflowCategory; total: number; active: number; partial: number; planned: number }> {
  const cats = Object.keys(CATEGORY_CONFIG) as WorkflowCategory[];
  return cats.map(cat => {
    const wfs = getWorkflowsByCategory(cat);
    return {
      category: cat,
      total: wfs.length,
      active: wfs.filter(w => w.status === 'active').length,
      partial: wfs.filter(w => w.status === 'partial').length,
      planned: wfs.filter(w => w.status === 'planned').length,
    };
  }).filter(s => s.total > 0);
}

function generateMarkdownExport(): string {
  const now = new Date().toISOString().split('T')[0];
  let md = `# N3 Empire OS - 神経系マニュアル\n\n生成日: ${now}\n\n`;
  const cats = Object.keys(CATEGORY_CONFIG) as WorkflowCategory[];
  for (const cat of cats) {
    const cfg = CATEGORY_CONFIG[cat as WorkflowCategory];
    const wfs = getWorkflowsByCategory(cat as WorkflowCategory);
    if (wfs.length === 0) continue;
    md += `## ${cfg.icon} ${cfg.label} (${wfs.length}件)\n\n`;
    for (const w of wfs) {
      const st = w.status === 'active' ? '✅' : w.status === 'partial' ? '⚠️' : '📋';
      md += `### ${st} ${w.nameJp}\n- ID: \`${w.id}\`\n- ${w.description}\n`;
      if (w.simpleExplain) md += `- かんたん: ${w.simpleExplain}\n`;
      md += `\n`;
    }
  }
  return md;
}

// ============================================================
// タブ定義
// ============================================================
const BLUEPRINT_TABS: L2Tab[] = [
  { id: 'overview', label: '概要', icon: MapIcon, color: '#6366f1' },
  { id: 'workflows', label: 'ワークフロー', icon: Zap, color: '#8B5CF6' },
  { id: 'relations', label: '接続関係', icon: Network, color: '#EC4899' },
  { id: 'ai-points', label: 'AI判断', icon: Brain, color: '#14b8a6' },
  { id: 'scripts', label: 'Scripts', icon: FileCode, color: '#F59E0B' },
];

// ============================================================
// UIコンポーネント
// ============================================================
function StatusBadge({ status }: { status: WorkflowStatus }) {
  const config = {
    active: { color: '#10b981', bg: '#10b98120', label: '稼働中' },
    partial: { color: '#f59e0b', bg: '#f59e0b20', label: '部分' },
    planned: { color: '#3b82f6', bg: '#3b82f620', label: '計画' },
    deprecated: { color: '#6b7280', bg: '#6b728020', label: '非推奨' },
  }[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
      background: config.bg, color: config.color,
    }}>
      {status === 'active' && <CheckCircle2 size={9} />}
      {status === 'partial' && <AlertCircle size={9} />}
      {status === 'planned' && <Circle size={9} />}
      {status === 'deprecated' && <XCircle size={9} />}
      {config.label}
    </span>
  );
}

function TechBadge({ tech }: { tech: string }) {
  const colors: Record<string, string> = {
    n8n: '#FF6D5A', python: '#3776AB', typescript: '#3178C6', sql: '#336791', shell: '#4EAA25',
  };
  return (
    <span style={{
      padding: '1px 5px', borderRadius: 3, fontSize: 8, fontWeight: 600,
      background: (colors[tech] || '#6b7280') + '20', color: colors[tech] || '#6b7280',
    }}>
      {tech}
    </span>
  );
}

function AIBadge({ ai }: { ai: string }) {
  if (ai === 'none') return null;
  const colors: Record<string, string> = {
    claude: '#D97706', gemini: '#4285F4', gpt4: '#10A37F',
    elevenlabs: '#000000', midjourney: '#7C3AED', whisper: '#74AA9C',
  };
  return (
    <span style={{
      padding: '1px 5px', borderRadius: 3, fontSize: 8, fontWeight: 600,
      background: (colors[ai] || '#6b7280') + '20', color: colors[ai] || '#6b7280',
    }}>
      🤖{ai}
    </span>
  );
}

function ImplementationDots({ hasUI, hasAPI, hasDB }: { hasUI: boolean; hasAPI: boolean; hasDB: boolean }) {
  const items = [
    { label: 'UI', has: hasUI, icon: Eye },
    { label: 'API', has: hasAPI, icon: Code },
    { label: 'DB', has: hasDB, icon: Database },
  ];
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {items.map(({ label, has, icon: Icon }) => (
        <div
          key={label}
          title={`${label}: ${has ? '✓' : '✗'}`}
          style={{
            width: 18, height: 18, borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: has ? '#10b98120' : '#6b728015',
            color: has ? '#10b981' : '#6b728050',
          }}
        >
          <Icon size={10} />
        </div>
      ))}
    </div>
  );
}

// MDダウンロード関数
function downloadMarkdown() {
  const md = generateMarkdownExport();
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `N3_Empire_OS_Manual_${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================
// Overview Content
// ============================================================
function OverviewContent() {
  const summary = useMemo(() => getCategorySummary(), []);
  const totalWorkflows = WORKFLOW_REGISTRY.length;
  const activeWorkflows = WORKFLOW_REGISTRY.filter(w => w.status === 'active').length;
  const partialWorkflows = WORKFLOW_REGISTRY.filter(w => w.status === 'partial').length;
  const aiWorkflows = WORKFLOW_REGISTRY.filter(w => w.aiComponents.some(a => a !== 'none')).length;
  const selfHealingWorkflows = WORKFLOW_REGISTRY.filter(w => w.selfHealing).length;

  return (
    <div style={{ padding: 12, height: '100%', overflow: 'auto' }}>
      {/* MDダウンロードボタン */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button
          onClick={downloadMarkdown}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
            border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Download size={14} />
          マニュアルMDダウンロード
        </button>
      </div>

      <div style={{
        padding: 12, background: 'linear-gradient(135deg, #6366f108, #8b5cf608)',
        border: '1px solid #6366f120', borderRadius: 8, marginBottom: 12,
      }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: '#6366f1' }}>
          🧠 N3 Empire OS - 神経系統計
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[
            { label: '総WF', value: totalWorkflows, color: '#6366f1' },
            { label: '稼働中', value: activeWorkflows, color: '#10b981' },
            { label: '部分実装', value: partialWorkflows, color: '#f59e0b' },
            { label: 'AI搭載', value: aiWorkflows, color: '#ec4899' },
            { label: '自己修復', value: selfHealingWorkflows, color: '#14b8a6' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: 10, background: 'var(--panel)', borderRadius: 6, textAlign: 'center',
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>カテゴリ別内訳</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {summary.sort((a, b) => b.total - a.total).map((cat) => {
          const config = CATEGORY_CONFIG[cat.category];
          const progress = cat.total > 0 ? Math.round((cat.active / cat.total) * 100) : 0;
          return (
            <div key={cat.category} style={{
              padding: 10, background: 'var(--panel)', borderRadius: 6,
              border: '1px solid var(--panel-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>{config?.icon || '📁'}</span>
                <span style={{ fontSize: 10, fontWeight: 500 }}>{cat.category}</span>
                <span style={{
                  marginLeft: 'auto', fontSize: 9,
                  padding: '1px 5px', background: 'var(--panel-alt)', borderRadius: 3,
                }}>
                  {cat.total}
                </span>
              </div>
              <div style={{
                height: 3, background: 'var(--panel-border)',
                borderRadius: 2, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progress}%`, height: '100%',
                  background: config?.color || '#6b7280', borderRadius: 2,
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9 }}>
                <span style={{ color: '#10b981' }}>✓{cat.active}</span>
                <span style={{ color: '#f59e0b' }}>⚠{cat.partial}</span>
                <span style={{ color: 'var(--text-muted)' }}>{progress}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 12, padding: 10, background: '#FF6D5A08',
        border: '1px solid #FF6D5A20', borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#FF6D5A' }}>⚡ n8n Dashboard</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>VPS: 160.16.120.186:5678</div>
        </div>
        <button
          onClick={() => window.open('http://160.16.120.186:5678', '_blank')}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px',
            background: '#FF6D5A', color: 'white', border: 'none', borderRadius: 4,
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <ExternalLink size={12} />開く
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Workflow Card Component
// ============================================================
function WorkflowCard({ workflow }: { workflow: WorkflowNode }) {
  const [expanded, setExpanded] = useState(false);
  const config = CATEGORY_CONFIG[workflow.category];

  return (
    <div style={{
      background: 'var(--panel)',
      borderRadius: 8,
      border: '1px solid var(--panel-border)',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      {/* ヘッダー */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--panel-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 16 }}>{config?.icon || '📁'}</span>
          <span style={{
            fontSize: 11, fontWeight: 600, flex: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {workflow.nameJp}
          </span>
          <StatusBadge status={workflow.status} />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
          {workflow.techStack.map(tech => <TechBadge key={tech} tech={tech} />)}
          {workflow.aiComponents.filter(a => a !== 'none').map(ai => <AIBadge key={ai} ai={ai} />)}
        </div>
        {workflow.selfHealing && (
          <span style={{
            fontSize: 8, padding: '1px 4px',
            background: '#14b8a615', color: '#14b8a6', borderRadius: 3, marginRight: 4,
          }}>
            🔄修復
          </span>
        )}
        {workflow.autoApproval && (
          <span style={{
            fontSize: 8, padding: '1px 4px',
            background: '#8b5cf615', color: '#8b5cf6', borderRadius: 3,
          }}>
            🤖自動
          </span>
        )}
      </div>

      {/* 説明 */}
      <div style={{ padding: '8px 12px', fontSize: 10, color: 'var(--text-muted)' }}>
        {workflow.description}
      </div>

      {/* 高校生向け解説（展開可能） */}
      {workflow.simpleExplain && (
        <div style={{ borderTop: '1px solid var(--panel-border)' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: '100%', padding: '6px 12px', background: '#3b82f608',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              color: '#3b82f6', fontSize: 10, fontWeight: 500,
            }}
          >
            <BookOpen size={12} />
            かんたん解説
            {expanded ? <ChevronDown size={12} style={{ marginLeft: 'auto' }} /> : <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
          </button>
          {expanded && (
            <div style={{ padding: '8px 12px', background: '#3b82f605', fontSize: 10 }}>
              <div style={{ marginBottom: 6 }}>
                <strong style={{ color: '#3b82f6' }}>📝 何をする？</strong>
                <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{workflow.simpleExplain}</div>
              </div>
              {workflow.whenRuns && (
                <div style={{ marginBottom: 6 }}>
                  <strong style={{ color: '#f59e0b' }}>⏰ いつ動く？</strong>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{workflow.whenRuns}</div>
                </div>
              )}
              {workflow.whatHappens && (
                <div>
                  <strong style={{ color: '#10b981' }}>🎯 結果</strong>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{workflow.whatHappens}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* フッター */}
      <div style={{
        padding: '6px 12px', background: 'var(--panel-alt)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <ImplementationDots hasUI={workflow.hasUI} hasAPI={workflow.hasAPI} hasDB={workflow.hasDB} />
        {workflow.webhookPath && (
          <code style={{
            fontSize: 8, padding: '1px 4px',
            background: '#3b82f610', color: '#3b82f6', borderRadius: 3,
          }}>
            {workflow.webhookPath}
          </code>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Workflow List Content
// ============================================================
function WorkflowListContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const categories = useMemo(() => Object.keys(CATEGORY_CONFIG), []);

  const filteredWorkflows = useMemo(() => {
    return WORKFLOW_REGISTRY.filter(w => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!w.name.toLowerCase().includes(q) &&
            !w.nameJp.toLowerCase().includes(q) &&
            !w.description.toLowerCase().includes(q)) return false;
      }
      if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
      return true;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div style={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 検索・フィルター */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexShrink: 0 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={12} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="検索..."
            style={{
              width: '100%', padding: '6px 8px 6px 26px',
              background: 'var(--panel)', border: '1px solid var(--panel-border)',
              borderRadius: 4, fontSize: 11, color: 'var(--text)',
            }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '6px 8px', background: 'var(--panel)',
            border: '1px solid var(--panel-border)', borderRadius: 4,
            fontSize: 11, color: 'var(--text)',
          }}
        >
          <option value="all">全カテゴリ ({WORKFLOW_REGISTRY.length})</option>
          {categories.map(cat => {
            const count = WORKFLOW_REGISTRY.filter(w => w.category === cat).length;
            return <option key={cat} value={cat}>{CATEGORY_CONFIG[cat as WorkflowCategory].icon} {cat} ({count})</option>;
          })}
        </select>
        <button
          onClick={downloadMarkdown}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px',
            background: '#6366f1', color: 'white', border: 'none', borderRadius: 4,
            fontSize: 10, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Download size={12} />MD
        </button>
      </div>

      {/* 件数表示 */}
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
        {filteredWorkflows.length}件表示
      </div>

      {/* 3列カードグリッド */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {filteredWorkflows.map(w => <WorkflowCard key={w.id} workflow={w} />)}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Relations Content
// ============================================================
function RelationsContent() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowNode | null>(null);
  const keyWorkflows = useMemo(() =>
    WORKFLOW_REGISTRY.filter(w => w.dependencies.length > 0 || w.triggers.length > 0)
      .sort((a, b) => (b.dependencies.length + b.triggers.length) - (a.dependencies.length + a.triggers.length))
      .slice(0, 25)
  , []);
  const dependencies = selectedWorkflow ? getWorkflowDependencies(selectedWorkflow.id) : [];
  const triggers = selectedWorkflow ? getWorkflowTriggers(selectedWorkflow.id) : [];

  return (
    <div style={{ padding: 12, height: '100%', display: 'flex', gap: 12 }}>
      <div style={{ width: 260, flexShrink: 0, overflow: 'auto' }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>主要ワークフロー</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {keyWorkflows.map(w => (
            <button
              key={w.id}
              onClick={() => setSelectedWorkflow(w)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
                background: selectedWorkflow?.id === w.id ? '#6366f115' : 'var(--panel)',
                border: `1px solid ${selectedWorkflow?.id === w.id ? '#6366f1' : 'var(--panel-border)'}`,
                borderRadius: 4, cursor: 'pointer', textAlign: 'left', color: 'var(--text)',
              }}
            >
              <span style={{ fontSize: 12 }}>{CATEGORY_CONFIG[w.category]?.icon || '📁'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 10, fontWeight: 500,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {w.nameJp}
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                  依存:{w.dependencies.length} / トリガー:{w.triggers.length}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {selectedWorkflow ? (
          <>
            <div style={{
              padding: 12, background: 'linear-gradient(135deg, #6366f108, #8b5cf608)',
              border: '1px solid #6366f120', borderRadius: 6, marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{CATEGORY_CONFIG[selectedWorkflow.category]?.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{selectedWorkflow.nameJp}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{selectedWorkflow.description}</div>
                </div>
              </div>
              {selectedWorkflow.logic && (
                <div style={{
                  padding: 8, background: 'var(--panel)',
                  borderRadius: 4, fontSize: 10, fontFamily: 'monospace',
                }}>
                  <strong>ロジック:</strong> {selectedWorkflow.logic}
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <h4 style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: '#3b82f6' }}>
                  ⬆️ 呼び出し先 ({dependencies.length})
                </h4>
                {dependencies.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {dependencies.map(dep => (
                      <div key={dep.id} style={{
                        padding: 8, background: 'var(--panel)', borderRadius: 4,
                        border: '1px solid var(--panel-border)',
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 500 }}>
                          {CATEGORY_CONFIG[dep.category]?.icon} {dep.nameJp}
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{dep.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>なし</div>
                )}
              </div>
              <div>
                <h4 style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: '#ec4899' }}>
                  ⬇️ トリガー元 ({triggers.length})
                </h4>
                {triggers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {triggers.map(trig => (
                      <div key={trig.id} style={{
                        padding: 8, background: 'var(--panel)', borderRadius: 4,
                        border: '1px solid var(--panel-border)',
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 500 }}>
                          {CATEGORY_CONFIG[trig.category]?.icon} {trig.nameJp}
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{trig.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>なし</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', color: 'var(--text-muted)', fontSize: 12,
          }}>
            左からワークフローを選択
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// AI Points Content
// ============================================================
function AIPointsContent() {
  const aiWorkflows = useMemo(() => WORKFLOW_REGISTRY.filter(w => w.aiComponents.some(a => a !== 'none')), []);
  const aiStats = useMemo(() => {
    const stats: Record<string, number> = {};
    aiWorkflows.forEach(w => w.aiComponents.filter(a => a !== 'none').forEach(ai => {
      stats[ai] = (stats[ai] || 0) + 1;
    }));
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [aiWorkflows]);

  return (
    <div style={{ padding: 12, height: '100%', overflow: 'auto' }}>
      <div style={{
        padding: 12, background: 'linear-gradient(135deg, #14b8a608, #ec489808)',
        border: '1px solid #14b8a620', borderRadius: 8, marginBottom: 12,
      }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: '#14b8a6' }}>
          🤖 AI コンポーネント使用状況
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {aiStats.map(([ai, count]) => (
            <div key={ai} style={{
              padding: '8px 12px', background: 'var(--panel)', borderRadius: 6, textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{count}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{ai}</div>
            </div>
          ))}
        </div>
      </div>
      <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
        AI搭載ワークフロー ({aiWorkflows.length}件)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {aiWorkflows.map(w => (
          <div key={w.id} style={{
            padding: 10, background: 'var(--panel)', borderRadius: 6,
            border: '1px solid var(--panel-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{CATEGORY_CONFIG[w.category]?.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 500 }}>{w.nameJp}</span>
              <StatusBadge status={w.status} />
              {w.autoApproval && (
                <span style={{
                  fontSize: 8, padding: '1px 4px',
                  background: '#8b5cf615', color: '#8b5cf6', borderRadius: 3,
                }}>
                  🤖自動承認
                </span>
              )}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>{w.description}</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {w.aiComponents.filter(a => a !== 'none').map(ai => <AIBadge key={ai} ai={ai} />)}
            </div>
            {w.logic && (
              <div style={{
                marginTop: 6, padding: 6, background: 'var(--panel-alt)',
                borderRadius: 4, fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)',
              }}>
                {w.logic}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Scripts Content
// ============================================================
function ScriptsContent() {
  const pythonWorkflows = useMemo(() => WORKFLOW_REGISTRY.filter(w => w.techStack.includes('python') || w.pythonScripts?.length), []);
  const tsWorkflows = useMemo(() => WORKFLOW_REGISTRY.filter(w => w.techStack.includes('typescript')), []);

  return (
    <div style={{ padding: 12, height: '100%', overflow: 'auto' }}>
      <div style={{
        padding: 12, background: '#3776AB08', border: '1px solid #3776AB20',
        borderRadius: 8, marginBottom: 12,
      }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: '#3776AB' }}>
          🐍 Python スクリプト
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {PYTHON_SCRIPTS.map(script => (
            <div key={script.id} style={{ padding: 8, background: 'var(--panel)', borderRadius: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }}>{script.name}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{script.description}</div>
            </div>
          ))}
        </div>
      </div>
      <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Python連携WF ({pythonWorkflows.length}件)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
        {pythonWorkflows.map(w => (
          <div key={w.id} style={{
            padding: 8, background: 'var(--panel)', borderRadius: 4,
            border: '1px solid var(--panel-border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 12 }}>{CATEGORY_CONFIG[w.category]?.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 500 }}>{w.nameJp}</div>
              {w.pythonScripts && (
                <div style={{ fontSize: 9, color: '#3776AB', fontFamily: 'monospace' }}>
                  {w.pythonScripts.join(', ')}
                </div>
              )}
            </div>
            <StatusBadge status={w.status} />
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>TypeScript連携WF ({tsWorkflows.length}件)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {tsWorkflows.map(w => (
          <div key={w.id} style={{
            padding: 8, background: 'var(--panel)', borderRadius: 4,
            border: '1px solid var(--panel-border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 12 }}>{CATEGORY_CONFIG[w.category]?.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 500 }}>{w.nameJp}</div>
            </div>
            <StatusBadge status={w.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Main Page Component
// ============================================================
export default function BlueprintN3Page() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewContent />;
      case 'workflows': return <WorkflowListContent />;
      case 'relations': return <RelationsContent />;
      case 'ai-points': return <AIPointsContent />;
      case 'scripts': return <ScriptsContent />;
      default: return <OverviewContent />;
    }
  };

  return (
    <N3WorkspaceLayout
      title="Blueprint"
      subtitle="帝国の神経系マップ"
      tabs={BLUEPRINT_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      accentColor="#6366f1"
    >
      {renderTabContent()}
    </N3WorkspaceLayout>
  );
}
