// lib/n8n/secret-vault.ts
// 🔐 N3 Empire OS - Secret Vault
// APIキー・認証情報の暗号化・分離管理

import crypto from 'crypto';

// ========================================
// 型定義
// ========================================

export type SecretType = 
  | 'ebay_api' 
  | 'amazon_api' 
  | 'shopee_api' 
  | 'stripe_api' 
  | 'paypal_api' 
  | 'chatwork_api'
  | 'oauth_token'
  | 'database_credential'
  | 'custom';

export interface SecretEntry {
  id: string;
  ref_id: string;  // 参照ID（n8nからはこれのみ使用）
  tenant_id: string;
  secret_type: SecretType;
  encrypted_value: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  last_used_at?: string;
  is_active: boolean;
}

export interface SecretVaultConfig {
  encryption_algorithm: string;
  key_derivation_iterations: number;
  iv_length: number;
  salt_length: number;
}

// ========================================
// 設定
// ========================================

const DEFAULT_CONFIG: SecretVaultConfig = {
  encryption_algorithm: 'aes-256-gcm',
  key_derivation_iterations: 100000,
  iv_length: 16,
  salt_length: 32,
};

// マスターキーは環境変数から取得
const getMasterKey = (): string => {
  const key = process.env.N3_SECRET_VAULT_MASTER_KEY;
  if (!key) {
    console.warn('N3_SECRET_VAULT_MASTER_KEY not set, using fallback (NOT SECURE)');
    return 'n3-empire-vault-key-change-in-production-32chars';
  }
  return key;
};

// ========================================
// 暗号化・復号
// ========================================

/**
 * 暗号化キーを派生
 */
function deriveKey(masterKey: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(
    masterKey,
    salt,
    DEFAULT_CONFIG.key_derivation_iterations,
    32,
    'sha256'
  );
}

/**
 * 値を暗号化
 */
export function encryptSecret(plainText: string): {
  encrypted: string;
  salt: string;
  iv: string;
  tag: string;
} {
  const masterKey = getMasterKey();
  const salt = crypto.randomBytes(DEFAULT_CONFIG.salt_length);
  const iv = crypto.randomBytes(DEFAULT_CONFIG.iv_length);
  const key = deriveKey(masterKey, salt);
  
  const cipher = crypto.createCipheriv(DEFAULT_CONFIG.encryption_algorithm, key, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = (cipher as any).getAuthTag();
  
  return {
    encrypted,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

/**
 * 値を復号
 */
export function decryptSecret(
  encrypted: string,
  salt: string,
  iv: string,
  tag: string
): string {
  const masterKey = getMasterKey();
  const key = deriveKey(masterKey, Buffer.from(salt, 'hex'));
  
  const decipher = crypto.createDecipheriv(
    DEFAULT_CONFIG.encryption_algorithm,
    key,
    Buffer.from(iv, 'hex')
  );
  
  (decipher as any).setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// ========================================
// 参照ID生成
// ========================================

/**
 * 一意の参照IDを生成
 */
export function generateRefId(secretType: SecretType, tenantId: string): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `${secretType}_${tenantId}_${timestamp}_${random}`;
}

// ========================================
// シークレットエントリ管理
// ========================================

/**
 * シークレットエントリを作成（DB保存用）
 */
export function createSecretEntry(
  tenantId: string,
  secretType: SecretType,
  plainValue: string,
  metadata?: Record<string, any>,
  expiresAt?: Date
): Omit<SecretEntry, 'id'> {
  const { encrypted, salt, iv, tag } = encryptSecret(plainValue);
  const refId = generateRefId(secretType, tenantId);
  
  // 暗号化データをJSON形式で保存
  const encryptedValue = JSON.stringify({ encrypted, salt, iv, tag });
  
  return {
    ref_id: refId,
    tenant_id: tenantId,
    secret_type: secretType,
    encrypted_value: encryptedValue,
    metadata,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: expiresAt?.toISOString(),
    is_active: true,
  };
}

/**
 * シークレットエントリを復号
 */
export function decryptSecretEntry(entry: Pick<SecretEntry, 'encrypted_value'>): string {
  const { encrypted, salt, iv, tag } = JSON.parse(entry.encrypted_value);
  return decryptSecret(encrypted, salt, iv, tag);
}

// ========================================
// APIキー検証
// ========================================

/**
 * APIキーの有効期限チェック
 */
export function isSecretExpired(entry: Pick<SecretEntry, 'expires_at'>): boolean {
  if (!entry.expires_at) return false;
  return new Date(entry.expires_at) < new Date();
}

/**
 * APIキーの形式検証（基本チェック）
 */
export function validateApiKeyFormat(
  secretType: SecretType,
  value: string
): { valid: boolean; error?: string } {
  switch (secretType) {
    case 'ebay_api':
      // eBay OAuth Token は長い文字列
      if (value.length < 100) {
        return { valid: false, error: 'eBay API token is too short' };
      }
      if (!value.startsWith('v^1.1') && !value.startsWith('AgAAAA')) {
        return { valid: false, error: 'Invalid eBay token format' };
      }
      return { valid: true };
      
    case 'amazon_api':
      // Amazon SP-API refresh token
      if (value.length < 50) {
        return { valid: false, error: 'Amazon API token is too short' };
      }
      return { valid: true };
      
    case 'stripe_api':
      // Stripe API key format: sk_live_... or sk_test_...
      if (!value.startsWith('sk_')) {
        return { valid: false, error: 'Invalid Stripe API key format' };
      }
      return { valid: true };
      
    case 'chatwork_api':
      // ChatWork API token: 32文字の英数字
      if (!/^[a-f0-9]{32}$/.test(value)) {
        return { valid: false, error: 'Invalid ChatWork API key format' };
      }
      return { valid: true };
      
    default:
      // 基本チェック：空でないこと
      if (!value || value.length < 10) {
        return { valid: false, error: 'API key is too short' };
      }
      return { valid: true };
  }
}

// ========================================
// n8n統合
// ========================================

/**
 * n8n用のシークレット取得関数
 * n8nからは参照IDのみで呼び出し、復号はサーバーサイドで実行
 */
export async function getSecretByRefId(
  refId: string,
  supabaseClient: any
): Promise<{ value: string; metadata?: Record<string, any> } | null> {
  try {
    const { data, error } = await supabaseClient
      .from('secret_vault')
      .select('encrypted_value, metadata, expires_at, is_active')
      .eq('ref_id', refId)
      .single();
    
    if (error || !data) {
      console.error('Secret not found:', refId);
      return null;
    }
    
    if (!data.is_active) {
      console.error('Secret is inactive:', refId);
      return null;
    }
    
    if (isSecretExpired(data)) {
      console.error('Secret is expired:', refId);
      return null;
    }
    
    const value = decryptSecretEntry(data);
    return { value, metadata: data.metadata };
    
  } catch (err) {
    console.error('Failed to get secret:', err);
    return null;
  }
}

// ========================================
// DBスキーマ（Supabase用SQL）
// ========================================

export const SECRET_VAULT_SCHEMA = `
-- ========================================
-- N3 Empire OS - Secret Vault テーブル
-- APIキー・認証情報の暗号化保存
-- ========================================

CREATE TABLE IF NOT EXISTS secret_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_id VARCHAR(100) UNIQUE NOT NULL,  -- 参照ID（n8nから使用）
  tenant_id VARCHAR(50) NOT NULL,
  secret_type VARCHAR(50) NOT NULL,      -- ebay_api, amazon_api, stripe_api, etc.
  encrypted_value TEXT NOT NULL,         -- JSON形式の暗号化データ
  metadata JSONB DEFAULT '{}',           -- 追加情報（アカウント名など）
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,                -- 有効期限
  last_used_at TIMESTAMPTZ,              -- 最終使用日時
  is_active BOOLEAN DEFAULT true,
  
  -- インデックス
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_secret_vault_ref_id ON secret_vault(ref_id);
CREATE INDEX IF NOT EXISTS idx_secret_vault_tenant ON secret_vault(tenant_id);
CREATE INDEX IF NOT EXISTS idx_secret_vault_type ON secret_vault(secret_type);
CREATE INDEX IF NOT EXISTS idx_secret_vault_active ON secret_vault(is_active) WHERE is_active = true;

-- RLS (Row Level Security) ポリシー
ALTER TABLE secret_vault ENABLE ROW LEVEL SECURITY;

-- オーナーのみ全アクセス可
CREATE POLICY secret_vault_owner_policy ON secret_vault
  FOR ALL
  USING (tenant_id = '0' OR auth.jwt() ->> 'tenant_id' = tenant_id);

-- 使用日時更新関数
CREATE OR REPLACE FUNCTION update_secret_last_used()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_used_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 参照ID取得ビュー（n8n用、値は含まない）
CREATE OR REPLACE VIEW secret_vault_refs AS
SELECT 
  ref_id,
  tenant_id,
  secret_type,
  metadata,
  expires_at,
  last_used_at,
  is_active
FROM secret_vault
WHERE is_active = true;

-- シークレットローテーション用関数
CREATE OR REPLACE FUNCTION rotate_secret(
  p_ref_id VARCHAR(100),
  p_new_encrypted_value TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE secret_vault
  SET 
    encrypted_value = p_new_encrypted_value,
    updated_at = NOW()
  WHERE ref_id = p_ref_id AND is_active = true;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 期限切れシークレット無効化関数
CREATE OR REPLACE FUNCTION deactivate_expired_secrets()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE secret_vault
  SET is_active = false
  WHERE expires_at < NOW() AND is_active = true;
  
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql;
`;

// ========================================
// n8n用テンプレート
// ========================================

export const N8N_SECRET_VAULT_TEMPLATE = `
// ========================================
// N3 Empire OS - Secret Vault アクセスノード
// APIキーが必要なノードの前に配置
// ========================================

// 参照IDはDBまたは環境変数から取得
const ref_id = $json.api_ref_id || $env.EBAY_API_REF_ID;

if (!ref_id) {
  throw new Error('API参照IDが設定されていません');
}

// Next.js API経由で復号（n8nからは直接復号しない）
const response = await fetch($env.N3_API_URL + '/api/security/decrypt-secret', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-N3-Internal-Token': $env.N3_INTERNAL_TOKEN,
  },
  body: JSON.stringify({ ref_id }),
});

if (!response.ok) {
  throw new Error('シークレット取得に失敗しました');
}

const result = await response.json();

if (!result.success) {
  throw new Error(result.error || 'シークレット復号エラー');
}

// 復号した値を次のノードへ
return [{
  json: {
    ...($input.first().json),
    _decrypted_api_key: result.value,  // 先頭アンダースコアで内部使用を明示
    _api_metadata: result.metadata,
  }
}];
`;

// ========================================
// エクスポート
// ========================================

export default {
  // 暗号化
  encryptSecret,
  decryptSecret,
  
  // エントリ管理
  generateRefId,
  createSecretEntry,
  decryptSecretEntry,
  
  // 検証
  isSecretExpired,
  validateApiKeyFormat,
  
  // n8n統合
  getSecretByRefId,
  
  // スキーマ
  SECRET_VAULT_SCHEMA,
  
  // n8nテンプレート
  N8N_SECRET_VAULT_TEMPLATE,
};
