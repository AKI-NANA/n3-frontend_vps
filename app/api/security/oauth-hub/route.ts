// app/api/security/oauth-hub/route.ts
// 🔐 N3 Empire OS - OAuth Hub
// テナント単位のeBay/Amazon等のOAuth連携管理

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import SecretVault from '@/lib/n8n/secret-vault';

// ========================================
// 環境変数
// ========================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// サポートするOAuthプロバイダー
const OAUTH_PROVIDERS = {
  ebay: {
    name: 'eBay',
    auth_url: 'https://auth.ebay.com/oauth2/authorize',
    token_url: 'https://api.ebay.com/identity/v1/oauth2/token',
    scopes: ['https://api.ebay.com/oauth/api_scope', 'https://api.ebay.com/oauth/api_scope/sell.inventory', 'https://api.ebay.com/oauth/api_scope/sell.marketing', 'https://api.ebay.com/oauth/api_scope/sell.account', 'https://api.ebay.com/oauth/api_scope/sell.fulfillment'],
  },
  amazon: {
    name: 'Amazon SP-API',
    auth_url: 'https://sellercentral.amazon.com/apps/authorize/consent',
    token_url: 'https://api.amazon.com/auth/o2/token',
    scopes: [],
  },
  shopee: {
    name: 'Shopee',
    auth_url: 'https://partner.shopeemobile.com/api/v2/shop/auth_partner',
    token_url: 'https://partner.shopeemobile.com/api/v2/auth/token/get',
    scopes: [],
  },
  qoo10: {
    name: 'Qoo10',
    auth_url: '', // API Key方式
    token_url: '',
    scopes: [],
  },
};

// ========================================
// POST: OAuth開始/トークン保存
// ========================================

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    const body = await request.json();
    const { action, provider, tenant_id, account_name, code, redirect_uri, refresh_token, access_token, expires_in } = body;

    if (!provider || !OAUTH_PROVIDERS[provider as keyof typeof OAUTH_PROVIDERS]) {
      return NextResponse.json(
        { success: false, error: 'Invalid provider', requestId },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });

    // ========================================
    // アクション: 認証URL生成
    // ========================================
    if (action === 'get_auth_url') {
      const providerConfig = OAUTH_PROVIDERS[provider as keyof typeof OAUTH_PROVIDERS];
      
      if (!providerConfig.auth_url) {
        return NextResponse.json({
          success: true,
          message: `${providerConfig.name}はAPIキー方式です。キーを直接登録してください。`,
          type: 'api_key',
          requestId,
        });
      }

      // state生成（CSRF対策）
      const state = Buffer.from(JSON.stringify({
        tenant_id: tenant_id || '0',
        account_name: account_name || 'default',
        provider,
        timestamp: Date.now(),
      })).toString('base64url');

      // 認証URLを構築
      const params = new URLSearchParams({
        client_id: process.env[`${provider.toUpperCase()}_CLIENT_ID`] || '',
        response_type: 'code',
        redirect_uri: redirect_uri || `${process.env.NEXT_PUBLIC_BASE_URL}/api/security/oauth-hub/callback`,
        scope: providerConfig.scopes.join(' '),
        state,
      });

      const authUrl = `${providerConfig.auth_url}?${params.toString()}`;

      return NextResponse.json({
        success: true,
        auth_url: authUrl,
        state,
        requestId,
      });
    }

    // ========================================
    // アクション: トークン交換（コールバックから）
    // ========================================
    if (action === 'exchange_token') {
      if (!code) {
        return NextResponse.json(
          { success: false, error: 'Authorization code is required', requestId },
          { status: 400 }
        );
      }

      const providerConfig = OAUTH_PROVIDERS[provider as keyof typeof OAUTH_PROVIDERS];
      
      // トークン交換リクエスト
      const tokenResponse = await fetch(providerConfig.token_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${process.env[`${provider.toUpperCase()}_CLIENT_ID`]}:${process.env[`${provider.toUpperCase()}_CLIENT_SECRET`]}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirect_uri || `${process.env.NEXT_PUBLIC_BASE_URL}/api/security/oauth-hub/callback`,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error(`[oauth-hub:${requestId}] Token exchange failed:`, errorText);
        return NextResponse.json(
          { success: false, error: 'Token exchange failed', details: errorText, requestId },
          { status: 400 }
        );
      }

      const tokenData = await tokenResponse.json();
      
      // トークンを暗号化して保存
      return await saveOAuthToken(
        supabase,
        tenant_id || '0',
        provider,
        account_name || 'default',
        tokenData.access_token,
        tokenData.refresh_token,
        tokenData.expires_in,
        requestId
      );
    }

    // ========================================
    // アクション: 直接トークン保存（手動入力/リフレッシュ結果）
    // ========================================
    if (action === 'save_token') {
      if (!access_token) {
        return NextResponse.json(
          { success: false, error: 'Access token is required', requestId },
          { status: 400 }
        );
      }

      return await saveOAuthToken(
        supabase,
        tenant_id || '0',
        provider,
        account_name || 'default',
        access_token,
        refresh_token,
        expires_in,
        requestId
      );
    }

    // ========================================
    // アクション: トークンリフレッシュ
    // ========================================
    if (action === 'refresh_token') {
      const ref_id = body.ref_id;
      
      if (!ref_id) {
        return NextResponse.json(
          { success: false, error: 'ref_id is required for refresh', requestId },
          { status: 400 }
        );
      }

      // 既存のリフレッシュトークンを取得
      const { data: existingSecret, error: fetchError } = await supabase
        .from('secret_vault')
        .select('encrypted_value, metadata')
        .eq('ref_id', ref_id)
        .single();

      if (fetchError || !existingSecret) {
        return NextResponse.json(
          { success: false, error: 'Token not found', requestId },
          { status: 404 }
        );
      }

      const decryptedData = JSON.parse(SecretVault.decryptSecretEntry(existingSecret));
      const existingRefreshToken = decryptedData.refresh_token;

      if (!existingRefreshToken) {
        return NextResponse.json(
          { success: false, error: 'No refresh token available', requestId },
          { status: 400 }
        );
      }

      const providerConfig = OAUTH_PROVIDERS[provider as keyof typeof OAUTH_PROVIDERS];

      // リフレッシュリクエスト
      const refreshResponse = await fetch(providerConfig.token_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${process.env[`${provider.toUpperCase()}_CLIENT_ID`]}:${process.env[`${provider.toUpperCase()}_CLIENT_SECRET`]}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: existingRefreshToken,
        }),
      });

      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text();
        console.error(`[oauth-hub:${requestId}] Token refresh failed:`, errorText);
        return NextResponse.json(
          { success: false, error: 'Token refresh failed', details: errorText, requestId },
          { status: 400 }
        );
      }

      const newTokenData = await refreshResponse.json();

      // 新しいトークンを保存（既存のref_idを更新）
      const tokenPayload = JSON.stringify({
        access_token: newTokenData.access_token,
        refresh_token: newTokenData.refresh_token || existingRefreshToken,
        token_type: newTokenData.token_type || 'Bearer',
      });

      const encrypted = SecretVault.encryptSecret(tokenPayload);
      const encryptedValue = JSON.stringify(encrypted);

      const expiresAt = newTokenData.expires_in
        ? new Date(Date.now() + newTokenData.expires_in * 1000).toISOString()
        : null;

      const { error: updateError } = await supabase
        .from('secret_vault')
        .update({
          encrypted_value: encryptedValue,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('ref_id', ref_id);

      if (updateError) {
        console.error(`[oauth-hub:${requestId}] Token update failed:`, updateError);
        return NextResponse.json(
          { success: false, error: 'Token update failed', requestId },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Token refreshed successfully',
        ref_id,
        expires_at: expiresAt,
        requestId,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action', requestId },
      { status: 400 }
    );

  } catch (error) {
    console.error(`[oauth-hub:${requestId}] Error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      },
      { status: 500 }
    );
  }
}

// ========================================
// GET: OAuth接続一覧取得
// ========================================

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id') || '0';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from('secret_vault')
      .select('ref_id, secret_type, metadata, expires_at, last_used_at, is_active, created_at')
      .eq('tenant_id', tenant_id)
      .in('secret_type', ['ebay_api', 'amazon_api', 'shopee_api', 'qoo10_api', 'oauth_token'])
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, requestId },
        { status: 500 }
      );
    }

    // 接続状態を判定
    const connections = data?.map((item) => {
      const isExpired = item.expires_at && new Date(item.expires_at) < new Date();
      return {
        ...item,
        status: item.is_active ? (isExpired ? 'expired' : 'active') : 'inactive',
        provider: item.metadata?.provider || item.secret_type.replace('_api', ''),
        account_name: item.metadata?.account_name || 'default',
      };
    }) || [];

    return NextResponse.json({
      success: true,
      data: connections,
      count: connections.length,
      requestId,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      },
      { status: 500 }
    );
  }
}

// ========================================
// ヘルパー関数: トークン保存
// ========================================

async function saveOAuthToken(
  supabase: any,
  tenant_id: string,
  provider: string,
  account_name: string,
  access_token: string,
  refresh_token?: string,
  expires_in?: number,
  requestId?: string
) {
  const tokenPayload = JSON.stringify({
    access_token,
    refresh_token: refresh_token || null,
    token_type: 'Bearer',
  });

  const encrypted = SecretVault.encryptSecret(tokenPayload);
  const encryptedValue = JSON.stringify(encrypted);
  const ref_id = SecretVault.generateRefId('oauth_token', tenant_id);

  const expiresAt = expires_in
    ? new Date(Date.now() + expires_in * 1000).toISOString()
    : null;

  const entry = {
    ref_id,
    tenant_id,
    secret_type: 'oauth_token' as const,
    encrypted_value: encryptedValue,
    metadata: {
      provider,
      account_name,
      has_refresh_token: !!refresh_token,
    },
    expires_at: expiresAt,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error: insertError } = await supabase
    .from('secret_vault')
    .upsert(entry, { onConflict: 'ref_id' });

  if (insertError) {
    console.error(`[oauth-hub:${requestId}] Token save failed:`, insertError);
    return NextResponse.json(
      { success: false, error: 'Token save failed', requestId },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Token saved successfully',
    ref_id,
    expires_at: expiresAt,
    requestId,
  });
}
