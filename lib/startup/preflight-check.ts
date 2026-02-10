// lib/startup/preflight-check.ts
/**
 * ✈️ Phase G: Pre-flight Check
 * 
 * 起動前の全項目チェック
 */

import { createClient } from '@/lib/supabase';

// ============================================================
// 型定義
// ============================================================

export type CheckStatus = 'pending' | 'checking' | 'passed' | 'failed' | 'warning';

export interface CheckResult {
  id: string;
  name: string;
  category: 'secrets' | 'api' | 'database' | 'n8n' | 'dispatch' | 'approval';
  status: CheckStatus;
  message: string;
  details?: string;
  critical: boolean;
  checkedAt: Date;
}

export interface PreflightResult {
  passed: boolean;
  score: number;
  checks: CheckResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  canStartProd: boolean;
  blockers: string[];
  timestamp: Date;
}

// ============================================================
// 必須Secrets
// ============================================================

const REQUIRED_SECRETS = {
  critical: [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', name: 'Supabase URL' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', name: 'Supabase Service Key' },
    { key: 'EBAY_CLIENT_ID', name: 'eBay Client ID' },
    { key: 'EBAY_CLIENT_SECRET', name: 'eBay Client Secret' },
  ],
  optional: [
    { key: 'CHATWORK_API_KEY', name: 'ChatWork API Key' },
    { key: 'OPENAI_API_KEY', name: 'OpenAI API Key' },
    { key: 'GEMINI_API_KEY', name: 'Gemini API Key' },
  ],
};

// ============================================================
// Secrets Check
// ============================================================

async function checkSecrets(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  
  // Critical Secrets
  for (const secret of REQUIRED_SECRETS.critical) {
    const value = process.env[secret.key];
    const exists = !!value && value.length > 0;
    
    results.push({
      id: `secret-${secret.key}`,
      name: secret.name,
      category: 'secrets',
      status: exists ? 'passed' : 'failed',
      message: exists ? '設定済み' : '未設定',
      critical: true,
      checkedAt: new Date(),
    });
  }
  
  // Optional Secrets
  for (const secret of REQUIRED_SECRETS.optional) {
    const value = process.env[secret.key];
    const exists = !!value && value.length > 0;
    
    results.push({
      id: `secret-${secret.key}`,
      name: secret.name,
      category: 'secrets',
      status: exists ? 'passed' : 'warning',
      message: exists ? '設定済み' : '未設定（オプション）',
      critical: false,
      checkedAt: new Date(),
    });
  }
  
  return results;
}

// ============================================================
// API Health Check
// ============================================================

async function checkApiHealth(baseUrl: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  
  const endpoints = [
    { path: '/api/dispatch', name: 'Dispatch API' },
    { path: '/api/automation/settings', name: 'Automation API' },
    { path: '/api/system/analysis', name: 'Analysis API' },
  ];
  
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${endpoint.path}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      results.push({
        id: `api-${endpoint.path}`,
        name: endpoint.name,
        category: 'api',
        status: res.ok ? 'passed' : 'failed',
        message: res.ok ? `応答OK (${res.status})` : `エラー (${res.status})`,
        critical: true,
        checkedAt: new Date(),
      });
    } catch (error: any) {
      results.push({
        id: `api-${endpoint.path}`,
        name: endpoint.name,
        category: 'api',
        status: 'failed',
        message: `接続失敗: ${error.message}`,
        critical: true,
        checkedAt: new Date(),
      });
    }
  }
  
  return results;
}

// ============================================================
// Database Integrity Check
// ============================================================

async function checkDatabaseIntegrity(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const supabase = createClient();
  
  const tables = [
    { name: 'products_master', label: 'Products Master', required: true },
    { name: 'n3_automation_settings', label: 'Automation Settings', required: true },
    { name: 'n3_system_flags', label: 'System Flags', required: true },
    { name: 'n3_user_roles', label: 'User Roles', required: true },
  ];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results.push({
          id: `db-${table.name}`,
          name: table.label,
          category: 'database',
          status: 'failed',
          message: `アクセス失敗: ${error.message}`,
          critical: table.required,
          checkedAt: new Date(),
        });
      } else {
        results.push({
          id: `db-${table.name}`,
          name: table.label,
          category: 'database',
          status: 'passed',
          message: `OK (${count} rows)`,
          critical: table.required,
          checkedAt: new Date(),
        });
      }
    } catch (error: any) {
      results.push({
        id: `db-${table.name}`,
        name: table.label,
        category: 'database',
        status: 'failed',
        message: `エラー: ${error.message}`,
        critical: table.required,
        checkedAt: new Date(),
      });
    }
  }
  
  return results;
}

// ============================================================
// n8n Status Check
// ============================================================

async function checkN8nStatus(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const n8nUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
  
  // n8n Server Health
  try {
    const res = await fetch(`${n8nUrl}/healthz`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    
    results.push({
      id: 'n8n-server',
      name: 'n8n Server',
      category: 'n8n',
      status: res.ok ? 'passed' : 'failed',
      message: res.ok ? 'オンライン' : `エラー (${res.status})`,
      critical: true,
      checkedAt: new Date(),
    });
  } catch (error: any) {
    results.push({
      id: 'n8n-server',
      name: 'n8n Server',
      category: 'n8n',
      status: 'failed',
      message: `接続失敗: ${error.message}`,
      critical: true,
      checkedAt: new Date(),
    });
  }
  
  // Webhook Test
  try {
    const res = await fetch(`${n8nUrl}/webhook-test/health`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
      signal: AbortSignal.timeout(5000),
    });
    
    results.push({
      id: 'n8n-webhook',
      name: 'n8n Webhook',
      category: 'n8n',
      status: res.ok || res.status === 404 ? 'passed' : 'warning',
      message: res.ok ? '応答OK' : 'Webhookテスト不可（正常の場合あり）',
      critical: false,
      checkedAt: new Date(),
    });
  } catch (error: any) {
    results.push({
      id: 'n8n-webhook',
      name: 'n8n Webhook',
      category: 'n8n',
      status: 'warning',
      message: `接続確認不可: ${error.message}`,
      critical: false,
      checkedAt: new Date(),
    });
  }
  
  return results;
}

// ============================================================
// Dispatch Ready Check
// ============================================================

async function checkDispatchReady(baseUrl: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  
  try {
    const res = await fetch(`${baseUrl}/api/dispatch`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    
    if (res.ok) {
      const data = await res.json();
      
      results.push({
        id: 'dispatch-status',
        name: 'Dispatch Status',
        category: 'dispatch',
        status: data.enabled !== false ? 'passed' : 'failed',
        message: data.enabled !== false ? '有効' : 'Kill Switch によりブロック中',
        details: `登録ツール: ${data.registeredTools || 0}`,
        critical: true,
        checkedAt: new Date(),
      });
      
      results.push({
        id: 'dispatch-tools',
        name: 'Registered Tools',
        category: 'dispatch',
        status: (data.registeredTools || 0) > 0 ? 'passed' : 'warning',
        message: `${data.registeredTools || 0} ツール登録済み`,
        critical: false,
        checkedAt: new Date(),
      });
    } else {
      results.push({
        id: 'dispatch-status',
        name: 'Dispatch Status',
        category: 'dispatch',
        status: 'failed',
        message: `API応答エラー (${res.status})`,
        critical: true,
        checkedAt: new Date(),
      });
    }
  } catch (error: any) {
    results.push({
      id: 'dispatch-status',
      name: 'Dispatch Status',
      category: 'dispatch',
      status: 'failed',
      message: `接続失敗: ${error.message}`,
      critical: true,
      checkedAt: new Date(),
    });
  }
  
  return results;
}

// ============================================================
// メイン Pre-flight Check
// ============================================================

export async function runPreflightCheck(baseUrl?: string): Promise<PreflightResult> {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // 並列チェック実行
  const [secrets, api, database, n8n, dispatch] = await Promise.all([
    checkSecrets(),
    checkApiHealth(url),
    checkDatabaseIntegrity(),
    checkN8nStatus(),
    checkDispatchReady(url),
  ]);
  
  const allChecks = [...secrets, ...api, ...database, ...n8n, ...dispatch];
  
  // サマリー計算
  const summary = {
    total: allChecks.length,
    passed: allChecks.filter(c => c.status === 'passed').length,
    failed: allChecks.filter(c => c.status === 'failed').length,
    warnings: allChecks.filter(c => c.status === 'warning').length,
  };
  
  // ブロッカー抽出（criticalで失敗したもの）
  const blockers = allChecks
    .filter(c => c.critical && c.status === 'failed')
    .map(c => `${c.name}: ${c.message}`);
  
  // スコア計算
  const criticalChecks = allChecks.filter(c => c.critical);
  const criticalPassed = criticalChecks.filter(c => c.status === 'passed').length;
  const score = criticalChecks.length > 0 
    ? Math.round((criticalPassed / criticalChecks.length) * 100)
    : 0;
  
  return {
    passed: blockers.length === 0,
    score,
    checks: allChecks,
    summary,
    canStartProd: blockers.length === 0 && score >= 90,
    blockers,
    timestamp: new Date(),
  };
}

// ============================================================
// 個別チェック
// ============================================================

export { checkSecrets, checkApiHealth, checkDatabaseIntegrity, checkN8nStatus, checkDispatchReady };
