// lib/n8n/workflows/index.ts
// 🏰 N3 Empire OS - n8nワークフローモジュール
// すべてのワークフロー関連機能の中央エントリポイント

export * from './listing-workflows';
export * from './inventory-workflows';
export * from './research-workflows';
export * from './automation-workflows';
export * from './standard-templates';

// 標準テンプレートをデフォルトエクスポート
import ALL_TEMPLATES from './standard-templates';
export default ALL_TEMPLATES;
