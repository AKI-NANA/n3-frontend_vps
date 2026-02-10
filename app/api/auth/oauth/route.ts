// app/api/auth/oauth/route.ts
// ========================================
// 🔐 N3 Empire OS V8.2.1-Autonomous
// OAuth統合API（UI-001/UI-011対応）
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthManager, OAuthProvider } from '@/lib/auth/oauth-manager';

// ========================================
// POST: OAuth認証開始
// ========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, accountCode, tenantId } = body;
    
    // バリデーション
    if (!provider) {
      return NextResponse.json(
        { error: 'provider is required' },
        { status: 400 }
      );
    }
    
    const validProviders: OAuthProvider[] = ['ebay', 'amazon', 'google', 'shopee', 'rakuten'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: `Invalid provider. Must be one of: ${validProviders.join(', ')}` },
        { status: 400 }
      );
    }
    
    const oauth = getOAuthManager();
    
    const { authUrl, state } = await oauth.generateAuthUrl(
      tenantId || '00000000-0000-0000-0000-000000000000',
      provider,
      accountCode || 'default'
    );
    
    return NextResponse.json({
      success: true,
      authUrl,
      state,
      provider
    });
    
  } catch (error) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

// ========================================
// GET: 認証状態を取得
// ========================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || '00000000-0000-0000-0000-000000000000';
    const provider = searchParams.get('provider') as OAuthProvider | null;
    
    const oauth = getOAuthManager();
    
    if (provider) {
      const status = await oauth.getCredentialStatus(tenantId, provider);
      return NextResponse.json({ success: true, status });
    }
    
    const statuses = await oauth.getAllCredentialStatuses(tenantId);
    return NextResponse.json({ success: true, statuses });
    
  } catch (error) {
    console.error('OAuth status error:', error);
    return NextResponse.json(
      { error: 'Failed to get OAuth status' },
      { status: 500 }
    );
  }
}

// ========================================
// PUT: トークンをリフレッシュ
// ========================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, accountCode, tenantId } = body;
    
    if (!provider) {
      return NextResponse.json(
        { error: 'provider is required' },
        { status: 400 }
      );
    }
    
    const oauth = getOAuthManager();
    
    const result = await oauth.refreshTokens(
      tenantId || '00000000-0000-0000-0000-000000000000',
      provider,
      accountCode || 'default'
    );
    
    if (result.success) {
      return NextResponse.json({ success: true, message: 'Token refreshed successfully' });
    } else {
      return NextResponse.json(
        { error: 'Token refresh failed', details: result.error },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('OAuth refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
