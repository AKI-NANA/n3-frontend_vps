// lib/guards/webhook-firewall.ts
/**
 * 🔥 Webhook Firewall - n8n Webhook保護
 * 
 * Phase 4E: Security Hardening
 * 
 * 機能:
 * - IP Whitelist
 * - Signature Verification
 * - Rate Limiting
 */

import crypto from 'crypto';

// ============================================================
// 型定義
// ============================================================

export interface WebhookFirewallConfig {
  ipWhitelist: string[];
  signatureRequired: boolean;
  signatureHeader: string;
  signatureSecret: string;
  maxRequestsPerMinute: number;
}

export interface WebhookFirewallResult {
  allowed: boolean;
  reason?: string;
  code?: string;
}

// ============================================================
// デフォルト設定
// ============================================================

const DEFAULT_CONFIG: WebhookFirewallConfig = {
  ipWhitelist: [
    '127.0.0.1',
    '::1',
    '160.16.120.186',  // VPS n8n
    // Vercel IPs are dynamic, so we rely on signature
  ],
  signatureRequired: true,
  signatureHeader: 'x-n3-signature',
  signatureSecret: process.env.N8N_WEBHOOK_SECRET || 'n3-empire-secret',
  maxRequestsPerMinute: 60,
};

// ============================================================
// IP Rate Limiter
// ============================================================

const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

function checkIpRateLimit(ip: string, maxRequests: number): boolean {
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);
  
  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
}

// ============================================================
// Signature Verification
// ============================================================

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ============================================================
// Webhook Firewall Check
// ============================================================

export function checkWebhookFirewall(
  ip: string,
  signature: string | null,
  payload: string,
  config: Partial<WebhookFirewallConfig> = {}
): WebhookFirewallResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  
  // IP Whitelist Check (skip if signature is valid)
  const ipAllowed = cfg.ipWhitelist.some(allowedIp => {
    if (allowedIp.includes('/')) {
      // CIDR not implemented, skip
      return false;
    }
    return ip === allowedIp || ip.endsWith(allowedIp);
  });
  
  // Signature Check
  if (cfg.signatureRequired) {
    if (!signature) {
      // If IP is whitelisted, allow without signature
      if (!ipAllowed) {
        return {
          allowed: false,
          reason: 'Missing webhook signature',
          code: 'MISSING_SIGNATURE',
        };
      }
    } else {
      const signatureValid = verifyWebhookSignature(payload, signature, cfg.signatureSecret);
      if (!signatureValid) {
        return {
          allowed: false,
          reason: 'Invalid webhook signature',
          code: 'INVALID_SIGNATURE',
        };
      }
    }
  }
  
  // If neither IP nor signature is valid
  if (!ipAllowed && !signature) {
    return {
      allowed: false,
      reason: 'Request not authorized',
      code: 'UNAUTHORIZED',
    };
  }
  
  // Rate Limit Check
  if (!checkIpRateLimit(ip, cfg.maxRequestsPerMinute)) {
    return {
      allowed: false,
      reason: 'Webhook rate limit exceeded',
      code: 'RATE_LIMIT',
    };
  }
  
  return { allowed: true };
}

// ============================================================
// API Key Verification
// ============================================================

export async function verifyApiKey(
  apiKey: string,
  supabase: any
): Promise<{ valid: boolean; organizationId?: string; scopes?: string[] }> {
  if (!apiKey || !apiKey.startsWith('n3_')) {
    return { valid: false };
  }
  
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('organization_id, scopes, expires_at, is_active')
    .eq('key_hash', keyHash)
    .single();
  
  if (error || !data) {
    return { valid: false };
  }
  
  if (!data.is_active) {
    return { valid: false };
  }
  
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false };
  }
  
  // Update last used
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', keyHash);
  
  return {
    valid: true,
    organizationId: data.organization_id,
    scopes: data.scopes,
  };
}

// ============================================================
// Generate Webhook Signature
// ============================================================

export function generateWebhookSignature(
  payload: string,
  secret?: string
): string {
  const s = secret || DEFAULT_CONFIG.signatureSecret;
  return crypto
    .createHmac('sha256', s)
    .update(payload)
    .digest('hex');
}
