// lib/auth/oauth-manager.ts
// ========================================
// 🔐 N3 Empire OS V8.2.1-Autonomous
// UI-001/UI-011/API-001/API-002: OAuth統合管理
// eBay/Amazon/その他のOAuth認証を統一管理
// ========================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ========================================
// 型定義
// ========================================

export type OAuthProvider = 'ebay' | 'amazon' | 'google' | 'shopee' | 'rakuten';

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
  redirectUri: string;
  usePKCE?: boolean;
}

export interface OAuthState {
  stateToken: string;
  provider: OAuthProvider;
  codeVerifier?: string;
  redirectUri: string;
  expiresAt: Date;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
}

export interface CredentialStatus {
  provider: OAuthProvider;
  accountCode: string;
  isConnected: boolean;
  isValid: boolean;
  expiresAt?: Date;
  lastValidatedAt?: Date;
  error?: string;
}

// ========================================
// OAuth設定
// ========================================

export const OAUTH_CONFIGS: Record<OAuthProvider, Partial<OAuthConfig>> = {
  ebay: {
    provider: 'ebay',
    authorizationUrl: 'https://auth.ebay.com/oauth2/authorize',
    tokenUrl: 'https://api.ebay.com/identity/v1/oauth2/token',
    scopes: [
      'https://api.ebay.com/oauth/api_scope',
      'https://api.ebay.com/oauth/api_scope/sell.inventory',
      'https://api.ebay.com/oauth/api_scope/sell.marketing',
      'https://api.ebay.com/oauth/api_scope/sell.account',
      'https://api.ebay.com/oauth/api_scope/sell.fulfillment'
    ]
  },
  amazon: {
    provider: 'amazon',
    authorizationUrl: 'https://sellercentral.amazon.com/apps/authorize/consent',
    tokenUrl: 'https://api.amazon.com/auth/o2/token',
    scopes: [],
    usePKCE: false
  },
  google: {
    provider: 'google',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
    usePKCE: true
  },
  shopee: {
    provider: 'shopee',
    authorizationUrl: 'https://partner.shopeemobile.com/api/v2/shop/auth_partner',
    tokenUrl: 'https://partner.shopeemobile.com/api/v2/auth/token/get',
    scopes: []
  },
  rakuten: {
    provider: 'rakuten',
    authorizationUrl: 'https://api.rms.rakuten.co.jp/es/1.0/auth/authorize',
    tokenUrl: 'https://api.rms.rakuten.co.jp/es/1.0/auth/token',
    scopes: []
  }
};

// ========================================
// OAuthマネージャークラス
// ========================================

export class OAuthManager {
  private supabase: SupabaseClient;
  private encryptionKey: Buffer;
  
  constructor(supabaseUrl?: string, supabaseKey?: string, encryptionKey?: string) {
    this.supabase = createClient(
      supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.encryptionKey = Buffer.from(
      encryptionKey || process.env.CREDENTIAL_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
      'hex'
    );
  }
  
  // ========================================
  // OAuth認証フロー
  // ========================================
  
  /**
   * OAuth認証URLを生成
   */
  async generateAuthUrl(
    tenantId: string,
    provider: OAuthProvider,
    accountCode: string = 'default'
  ): Promise<{ authUrl: string; state: string }> {
    const config = await this.getFullConfig(provider);
    
    // ステートトークンを生成
    const stateToken = crypto.randomBytes(32).toString('hex');
    
    // PKCEコードベリファイアを生成（必要な場合）
    let codeVerifier: string | undefined;
    let codeChallenge: string | undefined;
    
    if (config.usePKCE) {
      codeVerifier = crypto.randomBytes(32).toString('base64url');
      codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');
    }
    
    // ステートをDBに保存
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分
    
    await this.supabase.from('security.oauth_states').insert({
      tenant_id: tenantId,
      state_token: stateToken,
      provider,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      code_verifier: codeVerifier,
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    });
    
    // 認証URLを構築
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state: stateToken
    });
    
    if (codeChallenge) {
      params.set('code_challenge', codeChallenge);
      params.set('code_challenge_method', 'S256');
    }
    
    // プロバイダ固有のパラメータ
    if (provider === 'amazon') {
      params.set('application_id', config.clientId);
    }
    
    const authUrl = `${config.authorizationUrl}?${params.toString()}`;
    
    return { authUrl, state: stateToken };
  }
  
  /**
   * OAuth コールバックを処理
   */
  async handleCallback(
    stateToken: string,
    authorizationCode: string
  ): Promise<{ success: boolean; provider: OAuthProvider; error?: string }> {
    // ステートを検証
    const { data: stateData, error: stateError } = await this.supabase
      .from('security.oauth_states')
      .select('*')
      .eq('state_token', stateToken)
      .eq('status', 'pending')
      .single();
    
    if (stateError || !stateData) {
      return { success: false, provider: 'ebay', error: 'Invalid or expired state token' };
    }
    
    if (new Date(stateData.expires_at) < new Date()) {
      return { success: false, provider: stateData.provider, error: 'State token expired' };
    }
    
    const provider = stateData.provider as OAuthProvider;
    const config = await this.getFullConfig(provider);
    
    try {
      // トークンを取得
      const tokens = await this.exchangeCodeForTokens(
        config,
        authorizationCode,
        stateData.code_verifier
      );
      
      // トークンを暗号化して保存
      await this.saveCredentials(
        stateData.tenant_id,
        provider,
        'default',
        tokens
      );
      
      // ステートを完了にマーク
      await this.supabase
        .from('security.oauth_states')
        .update({
          status: 'completed',
          authorization_code: authorizationCode,
          completed_at: new Date().toISOString()
        })
        .eq('id', stateData.id);
      
      // n8nと同期
      await this.syncToN8n(stateData.tenant_id, provider, 'default');
      
      return { success: true, provider };
      
    } catch (error) {
      // エラーを記録
      await this.supabase
        .from('security.oauth_states')
        .update({
          status: 'error',
          error_code: 'TOKEN_EXCHANGE_FAILED',
          error_description: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', stateData.id);
      
      return {
        success: false,
        provider,
        error: error instanceof Error ? error.message : 'Token exchange failed'
      };
    }
  }
  
  /**
   * 認証コードをトークンに交換
   */
  private async exchangeCodeForTokens(
    config: OAuthConfig,
    code: string,
    codeVerifier?: string
  ): Promise<OAuthTokens> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret
    });
    
    if (codeVerifier) {
      body.set('code_verifier', codeVerifier);
    }
    
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body.toString()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    const expiresIn = data.expires_in || 7200;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    
    let refreshTokenExpiresAt: Date | undefined;
    if (data.refresh_token_expires_in) {
      refreshTokenExpiresAt = new Date(Date.now() + data.refresh_token_expires_in * 1000);
    } else if (data.refresh_token) {
      // デフォルト: 18ヶ月
      refreshTokenExpiresAt = new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000);
    }
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type || 'Bearer',
      expiresIn,
      expiresAt,
      refreshTokenExpiresAt,
      scope: data.scope
    };
  }
  
  // ========================================
  // 認証情報管理
  // ========================================
  
  /**
   * 認証情報を暗号化して保存
   */
  async saveCredentials(
    tenantId: string,
    provider: OAuthProvider,
    accountCode: string,
    tokens: OAuthTokens
  ): Promise<void> {
    const dataToEncrypt = JSON.stringify({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      scope: tokens.scope
    });
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    
    let encrypted = cipher.update(dataToEncrypt, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    const encryptedData = Buffer.from(`${iv.toString('hex')}:${authTag}:${encrypted}`, 'utf8');
    
    await this.supabase.from('security.encrypted_credentials').upsert({
      tenant_id: tenantId,
      provider,
      account_code: accountCode,
      credential_name: `${provider}_${accountCode}`,
      encrypted_data: encryptedData,
      encryption_key_id: 'default',
      encryption_algorithm: 'AES-256-GCM',
      token_type: tokens.tokenType,
      token_expires_at: tokens.expiresAt.toISOString(),
      refresh_token_expires_at: tokens.refreshTokenExpiresAt?.toISOString(),
      last_validated_at: new Date().toISOString(),
      is_valid: true
    }, {
      onConflict: 'tenant_id,provider,account_code'
    });
  }
  
  /**
   * 認証情報を復号化して取得
   */
  async getCredentials(
    tenantId: string,
    provider: OAuthProvider,
    accountCode: string = 'default'
  ): Promise<OAuthTokens | null> {
    const { data, error } = await this.supabase
      .from('security.encrypted_credentials')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('provider', provider)
      .eq('account_code', accountCode)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    try {
      const encryptedStr = data.encrypted_data.toString('utf8');
      const [ivHex, authTagHex, encrypted] = encryptedStr.split(':');
      
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      const credentials = JSON.parse(decrypted);
      
      return {
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        tokenType: data.token_type,
        expiresIn: 0,
        expiresAt: new Date(data.token_expires_at),
        refreshTokenExpiresAt: data.refresh_token_expires_at 
          ? new Date(data.refresh_token_expires_at) 
          : undefined,
        scope: credentials.scope
      };
    } catch (error) {
      console.error('Credential decryption failed:', error);
      return null;
    }
  }
  
  /**
   * トークンをリフレッシュ
   */
  async refreshTokens(
    tenantId: string,
    provider: OAuthProvider,
    accountCode: string = 'default'
  ): Promise<{ success: boolean; error?: string }> {
    const currentTokens = await this.getCredentials(tenantId, provider, accountCode);
    
    if (!currentTokens?.refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }
    
    const config = await this.getFullConfig(provider);
    
    try {
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: currentTokens.refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret
      });
      
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: body.toString()
      });
      
      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      const newTokens: OAuthTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || currentTokens.refreshToken,
        tokenType: data.token_type || 'Bearer',
        expiresIn: data.expires_in || 7200,
        expiresAt: new Date(Date.now() + (data.expires_in || 7200) * 1000),
        refreshTokenExpiresAt: currentTokens.refreshTokenExpiresAt,
        scope: data.scope || currentTokens.scope
      };
      
      await this.saveCredentials(tenantId, provider, accountCode, newTokens);
      
      // リフレッシュ履歴を記録
      const { data: credData } = await this.supabase
        .from('security.encrypted_credentials')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('provider', provider)
        .eq('account_code', accountCode)
        .single();
      
      if (credData) {
        await this.supabase.from('security.token_refresh_history').insert({
          tenant_id: tenantId,
          credential_id: credData.id,
          refresh_type: 'manual',
          triggered_by: 'oauth_manager',
          success: true,
          new_expires_at: newTokens.expiresAt.toISOString()
        });
      }
      
      // n8nと同期
      await this.syncToN8n(tenantId, provider, accountCode);
      
      return { success: true };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refresh failed'
      };
    }
  }
  
  /**
   * 認証状態を取得
   */
  async getCredentialStatus(
    tenantId: string,
    provider: OAuthProvider,
    accountCode: string = 'default'
  ): Promise<CredentialStatus> {
    const { data, error } = await this.supabase
      .from('security.encrypted_credentials')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('provider', provider)
      .eq('account_code', accountCode)
      .single();
    
    if (error || !data) {
      return {
        provider,
        accountCode,
        isConnected: false,
        isValid: false
      };
    }
    
    const now = new Date();
    const expiresAt = data.token_expires_at ? new Date(data.token_expires_at) : null;
    const isExpired = expiresAt ? expiresAt < now : false;
    
    return {
      provider,
      accountCode,
      isConnected: true,
      isValid: data.is_valid && !isExpired,
      expiresAt: expiresAt || undefined,
      lastValidatedAt: data.last_validated_at ? new Date(data.last_validated_at) : undefined,
      error: data.validation_error || undefined
    };
  }
  
  /**
   * 全プロバイダーの認証状態を取得
   */
  async getAllCredentialStatuses(tenantId: string): Promise<CredentialStatus[]> {
    const providers: OAuthProvider[] = ['ebay', 'amazon', 'google', 'shopee', 'rakuten'];
    
    return Promise.all(
      providers.map(provider => this.getCredentialStatus(tenantId, provider))
    );
  }
  
  // ========================================
  // n8n連携
  // ========================================
  
  /**
   * n8nの認証情報と同期
   */
  async syncToN8n(
    tenantId: string,
    provider: OAuthProvider,
    accountCode: string
  ): Promise<{ success: boolean; error?: string }> {
    const n8nApiUrl = process.env.N8N_API_URL;
    const n8nApiKey = process.env.N8N_API_KEY;
    
    if (!n8nApiUrl || !n8nApiKey) {
      return { success: false, error: 'n8n API not configured' };
    }
    
    const tokens = await this.getCredentials(tenantId, provider, accountCode);
    
    if (!tokens) {
      return { success: false, error: 'No credentials found' };
    }
    
    try {
      // n8n credential IDを取得
      const { data: credData } = await this.supabase
        .from('security.encrypted_credentials')
        .select('n8n_credential_id')
        .eq('tenant_id', tenantId)
        .eq('provider', provider)
        .eq('account_code', accountCode)
        .single();
      
      const n8nCredentialId = credData?.n8n_credential_id;
      
      if (!n8nCredentialId) {
        // 新規作成
        const response = await fetch(`${n8nApiUrl}/api/v1/credentials`, {
          method: 'POST',
          headers: {
            'X-N8N-API-KEY': n8nApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: `${provider}_${accountCode}`,
            type: `${provider}OAuth2Api`,
            data: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              expiresAt: tokens.expiresAt.toISOString()
            }
          })
        });
        
        if (response.ok) {
          const newCred = await response.json();
          
          // IDを保存
          await this.supabase
            .from('security.encrypted_credentials')
            .update({
              n8n_credential_id: newCred.id,
              n8n_synced_at: new Date().toISOString()
            })
            .eq('tenant_id', tenantId)
            .eq('provider', provider)
            .eq('account_code', accountCode);
        }
      } else {
        // 既存を更新
        await fetch(`${n8nApiUrl}/api/v1/credentials/${n8nCredentialId}`, {
          method: 'PATCH',
          headers: {
            'X-N8N-API-KEY': n8nApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              expiresAt: tokens.expiresAt.toISOString()
            }
          })
        });
        
        await this.supabase
          .from('security.encrypted_credentials')
          .update({ n8n_synced_at: new Date().toISOString() })
          .eq('tenant_id', tenantId)
          .eq('provider', provider)
          .eq('account_code', accountCode);
      }
      
      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'n8n sync failed';
      
      await this.supabase
        .from('security.encrypted_credentials')
        .update({ n8n_sync_error: errorMessage })
        .eq('tenant_id', tenantId)
        .eq('provider', provider)
        .eq('account_code', accountCode);
      
      return { success: false, error: errorMessage };
    }
  }
  
  // ========================================
  // ヘルパー
  // ========================================
  
  /**
   * フル設定を取得（環境変数から補完）
   */
  private async getFullConfig(provider: OAuthProvider): Promise<OAuthConfig> {
    const baseConfig = OAUTH_CONFIGS[provider];
    
    const envPrefix = provider.toUpperCase();
    
    return {
      provider,
      clientId: process.env[`${envPrefix}_CLIENT_ID`] || '',
      clientSecret: process.env[`${envPrefix}_CLIENT_SECRET`] || '',
      authorizationUrl: baseConfig.authorizationUrl || '',
      tokenUrl: baseConfig.tokenUrl || '',
      scopes: baseConfig.scopes || [],
      redirectUri: process.env[`${envPrefix}_REDIRECT_URI`] || 
                   `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/${provider}/callback`,
      usePKCE: baseConfig.usePKCE
    };
  }
}

// ========================================
// シングルトンインスタンス
// ========================================

let oauthManagerInstance: OAuthManager | null = null;

export function getOAuthManager(): OAuthManager {
  if (!oauthManagerInstance) {
    oauthManagerInstance = new OAuthManager();
  }
  return oauthManagerInstance;
}

export function createOAuthManager(
  supabaseUrl?: string,
  supabaseKey?: string,
  encryptionKey?: string
): OAuthManager {
  return new OAuthManager(supabaseUrl, supabaseKey, encryptionKey);
}

export default {
  OAuthManager,
  getOAuthManager,
  createOAuthManager,
  OAUTH_CONFIGS
};
