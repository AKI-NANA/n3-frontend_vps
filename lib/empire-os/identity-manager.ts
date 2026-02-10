// lib/empire-os/identity-manager.ts
// 🛡️ N3 Empire OS V8 Phase 2 - Identity Manager
// テナント別ブラウザプロファイル・プロキシ・指紋管理

import crypto from 'crypto';

// ========================================
// 型定義
// ========================================

export interface ProxyConfig {
  type: 'residential' | 'datacenter' | 'mobile' | 'none';
  host: string | null;
  port: number | null;
  username: string | null;
  password_vault_id: string | null; // 復号はSecret Vault経由
  country: string;
  sticky_session: boolean;
  rotation_interval_minutes: number;
}

export interface FingerprintConfig {
  user_agent: string | null;
  accept_language: string;
  platform: string;
  screen_resolution: string;
  timezone: string;
  webgl_vendor: string;
  webgl_renderer: string;
  canvas_noise: number;
  audio_noise: number;
  ja4_fingerprint: string | null;
  tls_fingerprint: string | null;
}

export interface SessionConfig {
  persist_cookies: boolean;
  cookie_vault_id: string | null;
  session_lifetime_hours: number;
  auto_refresh: boolean;
}

export interface UsageStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  last_success_at: string | null;
  last_failure_at: string | null;
  ban_count: number;
  last_ban_at: string | null;
}

export interface BrowserProfile {
  id: string;
  tenant_id: string;
  profile_code: string;
  profile_name: string;
  target_platform: string;
  target_region: string;
  proxy_config: ProxyConfig;
  fingerprint_config: FingerprintConfig;
  session_config: SessionConfig;
  usage_stats: UsageStats;
  is_active: boolean;
  health_status: 'healthy' | 'degraded' | 'banned' | 'unknown';
  last_health_check_at: string | null;
}

export interface IdentityContext {
  profile_id: string;
  profile_code: string;
  tenant_id: string;
  target_platform: string;
  
  // 解決済みプロキシ（パスワード復号済み）
  proxy: {
    enabled: boolean;
    url: string | null;
    type: string;
  };
  
  // ブラウザ指紋
  fingerprint: FingerprintConfig;
  
  // セッション情報
  session: {
    id: string;
    expires_at: string;
  };
  
  // 使用統計
  stats: UsageStats;
}

// ========================================
// デフォルト設定
// ========================================

const DEFAULT_USER_AGENTS: Record<string, string[]> = {
  desktop_windows: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  ],
  desktop_mac: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  ],
  mobile_ios: [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  ],
  mobile_android: [
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  ],
};

const DEFAULT_WEBGL_CONFIGS = [
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA GeForce GTX 1060 Direct3D11 vs_5_0 ps_5_0)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)' },
  { vendor: 'Google Inc. (Intel)', renderer: 'ANGLE (Intel UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)' },
  { vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD Radeon RX 580 Series Direct3D11 vs_5_0 ps_5_0)' },
];

const TIMEZONE_BY_REGION: Record<string, string> = {
  JP: 'Asia/Tokyo',
  US: 'America/New_York',
  UK: 'Europe/London',
  DE: 'Europe/Berlin',
  AU: 'Australia/Sydney',
  SG: 'Asia/Singapore',
};

const ACCEPT_LANGUAGE_BY_REGION: Record<string, string> = {
  JP: 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
  US: 'en-US,en;q=0.9',
  UK: 'en-GB,en;q=0.9,en-US;q=0.8',
  DE: 'de-DE,de;q=0.9,en;q=0.8',
  AU: 'en-AU,en;q=0.9,en-US;q=0.8',
  SG: 'en-SG,en;q=0.9,zh-Hans;q=0.8',
};

// ========================================
// プロファイル生成
// ========================================

/**
 * ランダムなUser-Agentを選択
 */
export function getRandomUserAgent(type: 'desktop_windows' | 'desktop_mac' | 'mobile_ios' | 'mobile_android' = 'desktop_windows'): string {
  const agents = DEFAULT_USER_AGENTS[type] || DEFAULT_USER_AGENTS.desktop_windows;
  return agents[Math.floor(Math.random() * agents.length)];
}

/**
 * ランダムなWebGL設定を選択
 */
export function getRandomWebGLConfig(): { vendor: string; renderer: string } {
  return DEFAULT_WEBGL_CONFIGS[Math.floor(Math.random() * DEFAULT_WEBGL_CONFIGS.length)];
}

/**
 * 画面解像度リストからランダム選択
 */
export function getRandomScreenResolution(): string {
  const resolutions = ['1920x1080', '2560x1440', '1366x768', '1536x864', '1440x900', '1600x900'];
  return resolutions[Math.floor(Math.random() * resolutions.length)];
}

/**
 * キャンバス/オーディオノイズ値を生成（0.0001〜0.001の範囲）
 */
export function generateNoiseValue(): number {
  return 0.0001 + Math.random() * 0.0009;
}

/**
 * JA4フィンガープリント生成（簡易版）
 */
export function generateJA4Fingerprint(): string {
  // 実際のJA4は複雑だが、ここでは識別用のランダム文字列
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 't13d';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + '_' + crypto.randomBytes(6).toString('hex');
}

/**
 * セッションID生成
 */
export function generateSessionId(): string {
  return 'sess_' + crypto.randomBytes(16).toString('hex');
}

/**
 * 新しいFingerprintConfigを生成
 */
export function generateFingerprintConfig(region: string = 'JP', deviceType: 'desktop' | 'mobile' = 'desktop'): FingerprintConfig {
  const webgl = getRandomWebGLConfig();
  const platform = deviceType === 'desktop' ? 'Win32' : 'iPhone';
  const uaType = deviceType === 'desktop' ? 'desktop_windows' : 'mobile_ios';
  
  return {
    user_agent: getRandomUserAgent(uaType as any),
    accept_language: ACCEPT_LANGUAGE_BY_REGION[region] || ACCEPT_LANGUAGE_BY_REGION.JP,
    platform,
    screen_resolution: deviceType === 'desktop' ? getRandomScreenResolution() : '390x844',
    timezone: TIMEZONE_BY_REGION[region] || TIMEZONE_BY_REGION.JP,
    webgl_vendor: webgl.vendor,
    webgl_renderer: webgl.renderer,
    canvas_noise: generateNoiseValue(),
    audio_noise: generateNoiseValue(),
    ja4_fingerprint: generateJA4Fingerprint(),
    tls_fingerprint: null,
  };
}

/**
 * デフォルトのProxyConfigを生成
 */
export function createDefaultProxyConfig(region: string = 'JP'): ProxyConfig {
  return {
    type: 'none',
    host: null,
    port: null,
    username: null,
    password_vault_id: null,
    country: region,
    sticky_session: true,
    rotation_interval_minutes: 0,
  };
}

/**
 * デフォルトのSessionConfigを生成
 */
export function createDefaultSessionConfig(): SessionConfig {
  return {
    persist_cookies: true,
    cookie_vault_id: null,
    session_lifetime_hours: 24,
    auto_refresh: true,
  };
}

/**
 * デフォルトのUsageStatsを生成
 */
export function createDefaultUsageStats(): UsageStats {
  return {
    total_requests: 0,
    successful_requests: 0,
    failed_requests: 0,
    last_success_at: null,
    last_failure_at: null,
    ban_count: 0,
    last_ban_at: null,
  };
}

// ========================================
// Identity Context 構築
// ========================================

/**
 * プロファイルからIdentityContextを構築
 */
export async function buildIdentityContext(
  profile: BrowserProfile,
  decryptSecret: (vaultId: string) => Promise<string | null>
): Promise<IdentityContext> {
  // プロキシURLを構築（パスワードは復号）
  let proxyUrl: string | null = null;
  if (profile.proxy_config.type !== 'none' && profile.proxy_config.host) {
    const password = profile.proxy_config.password_vault_id 
      ? await decryptSecret(profile.proxy_config.password_vault_id)
      : null;
    
    const auth = profile.proxy_config.username 
      ? `${profile.proxy_config.username}:${password || ''}@`
      : '';
    
    proxyUrl = `http://${auth}${profile.proxy_config.host}:${profile.proxy_config.port}`;
  }
  
  // セッション有効期限を計算
  const sessionExpiresAt = new Date();
  sessionExpiresAt.setHours(sessionExpiresAt.getHours() + profile.session_config.session_lifetime_hours);
  
  return {
    profile_id: profile.id,
    profile_code: profile.profile_code,
    tenant_id: profile.tenant_id,
    target_platform: profile.target_platform,
    
    proxy: {
      enabled: profile.proxy_config.type !== 'none' && !!proxyUrl,
      url: proxyUrl,
      type: profile.proxy_config.type,
    },
    
    fingerprint: profile.fingerprint_config,
    
    session: {
      id: generateSessionId(),
      expires_at: sessionExpiresAt.toISOString(),
    },
    
    stats: profile.usage_stats,
  };
}

// ========================================
// ヘルスチェック
// ========================================

export type HealthCheckResult = {
  profile_id: string;
  status: 'healthy' | 'degraded' | 'banned' | 'error';
  latency_ms: number;
  ip_address: string | null;
  geo_location: string | null;
  error?: string;
  checked_at: string;
};

/**
 * プロファイルのヘルスチェック
 */
export async function checkProfileHealth(
  profile: BrowserProfile,
  testUrl: string = 'https://httpbin.org/ip'
): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // プロキシが有効な場合はプロキシ経由でリクエスト
    // 注意: 実際の実装ではnode-fetchやgot + proxy-agentを使用
    // ここでは簡略化のため直接fetchを想定
    
    const response = await fetch(testUrl, {
      headers: {
        'User-Agent': profile.fingerprint_config.user_agent || 'N3-HealthCheck/1.0',
        'Accept-Language': profile.fingerprint_config.accept_language,
      },
      signal: AbortSignal.timeout(10000),
    });
    
    const latency = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        profile_id: profile.id,
        status: 'degraded',
        latency_ms: latency,
        ip_address: null,
        geo_location: null,
        error: `HTTP ${response.status}`,
        checked_at: new Date().toISOString(),
      };
    }
    
    const data = await response.json();
    
    return {
      profile_id: profile.id,
      status: 'healthy',
      latency_ms: latency,
      ip_address: data.origin || null,
      geo_location: null, // GeoIP lookup would be done separately
      checked_at: new Date().toISOString(),
    };
    
  } catch (error: any) {
    const latency = Date.now() - startTime;
    
    // 接続拒否やタイムアウトはBAN判定の可能性
    const isBanned = error.message?.includes('403') || error.message?.includes('blocked');
    
    return {
      profile_id: profile.id,
      status: isBanned ? 'banned' : 'error',
      latency_ms: latency,
      ip_address: null,
      geo_location: null,
      error: error.message,
      checked_at: new Date().toISOString(),
    };
  }
}

// ========================================
// n8n用テンプレート
// ========================================

export const N8N_IDENTITY_MANAGER_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - Identity Manager ノード
// ブラウザ操作/API呼び出しの前に配置
// ========================================

const tenantId = $json.tenant_context?.tenant_id || $env.DEFAULT_TENANT_ID || '0';
const targetPlatform = $json.target_platform || 'default';
const profileCode = $json.profile_code; // 任意指定

// プロファイル取得
const profileQuery = profileCode 
  ? { tenant_id: tenantId, profile_code: profileCode, target_platform: targetPlatform, is_active: true }
  : { tenant_id: tenantId, target_platform: targetPlatform, is_active: true, health_status: 'healthy' };

// Supabase経由でプロファイル取得（n8n Supabaseノード使用）
const profile = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/core.browser_profiles',
  qs: {
    select: '*',
    ...profileQuery,
    order: 'usage_stats->total_requests.asc', // 使用回数少ない順
    limit: 1
  },
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY
  },
  json: true
});

if (!profile || profile.length === 0) {
  // プロファイルなし → デフォルトで続行
  return [{
    json: {
      ...($input.first().json),
      identity_context: {
        enabled: false,
        reason: 'No active profile found'
      }
    }
  }];
}

const selectedProfile = profile[0];

// プロキシパスワード復号（必要な場合）
let proxyUrl = null;
if (selectedProfile.proxy_config.type !== 'none' && selectedProfile.proxy_config.host) {
  let password = '';
  
  if (selectedProfile.proxy_config.password_vault_id) {
    // Secret Vault経由で復号
    const secretResponse = await $http.request({
      method: 'POST',
      url: $env.N3_API_URL + '/api/security/decrypt-secret',
      headers: {
        'Content-Type': 'application/json',
        'X-N3-Internal-Token': $env.N3_INTERNAL_TOKEN
      },
      body: {
        ref_id: selectedProfile.proxy_config.password_vault_id,
        tenant_id: tenantId
      },
      json: true
    });
    password = secretResponse.value || '';
  }
  
  const auth = selectedProfile.proxy_config.username 
    ? selectedProfile.proxy_config.username + ':' + password + '@'
    : '';
  
  proxyUrl = 'http://' + auth + selectedProfile.proxy_config.host + ':' + selectedProfile.proxy_config.port;
}

// Identity Context構築
const identityContext = {
  enabled: true,
  profile_id: selectedProfile.id,
  profile_code: selectedProfile.profile_code,
  tenant_id: tenantId,
  target_platform: selectedProfile.target_platform,
  
  // プロキシ設定
  proxy: {
    enabled: !!proxyUrl,
    url: proxyUrl,
    type: selectedProfile.proxy_config.type
  },
  
  // ブラウザ指紋
  headers: {
    'User-Agent': selectedProfile.fingerprint_config.user_agent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': selectedProfile.fingerprint_config.accept_language,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br'
  },
  
  fingerprint: selectedProfile.fingerprint_config,
  
  // セッション情報
  session: {
    id: 'sess_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
    timezone: selectedProfile.fingerprint_config.timezone
  },
  
  // 統計
  stats: selectedProfile.usage_stats
};

// 使用回数インクリメント（非同期で良い）
$http.request({
  method: 'PATCH',
  url: $env.SUPABASE_URL + '/rest/v1/core.browser_profiles?id=eq.' + selectedProfile.id,
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  },
  body: {
    usage_stats: {
      ...selectedProfile.usage_stats,
      total_requests: selectedProfile.usage_stats.total_requests + 1
    }
  },
  json: true
}).catch(() => {}); // エラーは無視

return [{
  json: {
    ...($input.first().json),
    identity_context: identityContext
  }
}];
`;

// ========================================
// n8n HTTPリクエスト用ヘルパー
// ========================================

export const N8N_IDENTITY_HTTP_WRAPPER_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - Identity HTTP Wrapper
// Identity Manager ノードの後、HTTPリクエストの前に配置
// HTTP Request ノードの設定に以下を適用
// ========================================

const identity = $json.identity_context;

// HTTPリクエストオプション
const httpOptions = {
  // ヘッダー設定
  headers: identity?.enabled 
    ? { ...(identity.headers || {}), ...($json.custom_headers || {}) }
    : $json.custom_headers || {},
  
  // プロキシ設定
  proxy: identity?.proxy?.enabled 
    ? identity.proxy.url 
    : undefined,
  
  // タイムアウト
  timeout: 30000,
  
  // リダイレクト
  followRedirect: true,
  maxRedirects: 5,
  
  // SSL検証（本番では有効に）
  rejectUnauthorized: true
};

// 次のHTTP Requestノードで使用する設定を出力
return [{
  json: {
    ...($input.first().json),
    _http_options: httpOptions
  }
}];
`;

// ========================================
// エクスポート
// ========================================

export default {
  // 生成関数
  generateFingerprintConfig,
  createDefaultProxyConfig,
  createDefaultSessionConfig,
  createDefaultUsageStats,
  
  // ヘルパー
  getRandomUserAgent,
  getRandomWebGLConfig,
  getRandomScreenResolution,
  generateNoiseValue,
  generateJA4Fingerprint,
  generateSessionId,
  
  // Identity Context
  buildIdentityContext,
  
  // ヘルスチェック
  checkProfileHealth,
  
  // n8nテンプレート
  N8N_IDENTITY_MANAGER_TEMPLATE,
  N8N_IDENTITY_HTTP_WRAPPER_TEMPLATE,
  
  // 定数
  DEFAULT_USER_AGENTS,
  TIMEZONE_BY_REGION,
  ACCEPT_LANGUAGE_BY_REGION,
};
