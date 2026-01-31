// lib/guards/api-key-manager.ts
/**
 * 🔑 API Key Manager - API Key生成・管理
 * 
 * Phase 4E: Security Hardening
 * 
 * 機能:
 * - API Key生成
 * - Key Rotation
 * - Token検証
 * - 失効処理
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
}

export interface CreateApiKeyResult {
  apiKey: ApiKey;
  fullKey: string;  // 一度だけ返される完全なキー
}

export interface ApiKeyValidation {
  valid: boolean;
  organizationId?: string;
  scopes?: string[];
  reason?: string;
}

// ============================================================
// Supabase Client
// ============================================================

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// ============================================================
// Key Generation
// ============================================================

/**
 * 新しいAPIキーを生成
 */
export async function generateApiKey(
  organizationId: string,
  name: string,
  options?: {
    scopes?: string[];
    expiresInDays?: number;
    createdBy?: string;
  }
): Promise<CreateApiKeyResult> {
  const supabase = getSupabaseClient();
  
  // ランダムキー生成: n3_{prefix}_{secret}
  const prefix = crypto.randomBytes(4).toString('hex');
  const secret = crypto.randomBytes(32).toString('base64url');
  const fullKey = `n3_${prefix}_${secret}`;
  
  // ハッシュ化して保存
  const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');
  
  // 有効期限
  let expiresAt: string | null = null;
  if (options?.expiresInDays) {
    const expires = new Date();
    expires.setDate(expires.getDate() + options.expiresInDays);
    expiresAt = expires.toISOString();
  }
  
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      organization_id: organizationId,
      name,
      key_hash: keyHash,
      key_prefix: `n3_${prefix}`,
      scopes: options?.scopes || ['dispatch'],
      expires_at: expiresAt,
      is_active: true,
      created_by: options?.createdBy,
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create API key: ${error.message}`);
  }
  
  return {
    apiKey: {
      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      keyPrefix: data.key_prefix,
      scopes: data.scopes,
      expiresAt: data.expires_at,
      isActive: data.is_active,
      createdAt: data.created_at,
      createdBy: data.created_by,
    },
    fullKey,  // 一度だけ返される
  };
}

/**
 * APIキーを検証
 */
export async function validateApiKey(apiKey: string): Promise<ApiKeyValidation> {
  if (!apiKey || !apiKey.startsWith('n3_')) {
    return { valid: false, reason: 'Invalid key format' };
  }
  
  const supabase = getSupabaseClient();
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('organization_id, scopes, expires_at, is_active')
    .eq('key_hash', keyHash)
    .single();
  
  if (error || !data) {
    return { valid: false, reason: 'Key not found' };
  }
  
  if (!data.is_active) {
    return { valid: false, reason: 'Key is inactive' };
  }
  
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, reason: 'Key has expired' };
  }
  
  // 最終使用日時を更新
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

/**
 * APIキーをローテーション（新しいキーを生成し、古いキーを失効）
 */
export async function rotateApiKey(
  keyId: string,
  organizationId: string,
  options?: {
    gracePeriodHours?: number;
    createdBy?: string;
  }
): Promise<CreateApiKeyResult> {
  const supabase = getSupabaseClient();
  
  // 既存のキー情報を取得
  const { data: oldKey, error: fetchError } = await supabase
    .from('api_keys')
    .select('*')
    .eq('id', keyId)
    .eq('organization_id', organizationId)
    .single();
  
  if (fetchError || !oldKey) {
    throw new Error('API key not found');
  }
  
  // 新しいキーを生成
  const newKeyResult = await generateApiKey(organizationId, `${oldKey.name} (rotated)`, {
    scopes: oldKey.scopes,
    createdBy: options?.createdBy,
  });
  
  // 古いキーを失効（猶予期間がある場合は遅延失効）
  if (options?.gracePeriodHours && options.gracePeriodHours > 0) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + options.gracePeriodHours);
    
    await supabase
      .from('api_keys')
      .update({
        expires_at: expiresAt.toISOString(),
        name: `${oldKey.name} (expired)`,
      })
      .eq('id', keyId);
  } else {
    // 即座に失効
    await supabase
      .from('api_keys')
      .update({
        is_active: false,
        name: `${oldKey.name} (revoked)`,
      })
      .eq('id', keyId);
  }
  
  // Audit log
  await supabase.from('audit_logs').insert({
    organization_id: organizationId,
    user_id: options?.createdBy,
    action: 'api_key_rotated',
    resource_type: 'api_key',
    resource_id: keyId,
    details: {
      old_key_id: keyId,
      new_key_id: newKeyResult.apiKey.id,
      grace_period_hours: options?.gracePeriodHours || 0,
    },
  }).catch(() => {});
  
  return newKeyResult;
}

/**
 * APIキーを失効
 */
export async function revokeApiKey(
  keyId: string,
  organizationId: string,
  revokedBy?: string
): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('api_keys')
    .update({
      is_active: false,
    })
    .eq('id', keyId)
    .eq('organization_id', organizationId);
  
  if (error) {
    throw new Error(`Failed to revoke API key: ${error.message}`);
  }
  
  // Audit log
  await supabase.from('audit_logs').insert({
    organization_id: organizationId,
    user_id: revokedBy,
    action: 'api_key_revoked',
    resource_type: 'api_key',
    resource_id: keyId,
    details: {},
  }).catch(() => {});
}

/**
 * 組織のAPIキー一覧を取得
 */
export async function listApiKeys(organizationId: string): Promise<ApiKey[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to list API keys: ${error.message}`);
  }
  
  return (data || []).map((k: any) => ({
    id: k.id,
    organizationId: k.organization_id,
    name: k.name,
    keyPrefix: k.key_prefix,
    scopes: k.scopes,
    lastUsedAt: k.last_used_at,
    expiresAt: k.expires_at,
    isActive: k.is_active,
    createdAt: k.created_at,
    createdBy: k.created_by,
  }));
}

/**
 * 期限切れのキーをクリーンアップ
 */
export async function cleanupExpiredKeys(): Promise<number> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('api_keys')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .eq('is_active', false)
    .select('id');
  
  if (error) {
    console.error('[ApiKeyManager] Cleanup error:', error);
    return 0;
  }
  
  return data?.length || 0;
}
