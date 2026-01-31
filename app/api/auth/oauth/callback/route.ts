// app/api/auth/oauth/callback/route.ts
// ========================================
// 🔐 N3 Empire OS V8.2.1-Autonomous
// OAuthコールバック処理（API-001/API-002対応）
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthManager } from '@/lib/auth/oauth-manager';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    // エラーチェック
    if (error) {
      const redirectUrl = new URL('/tools/settings-n3', request.nextUrl.origin);
      redirectUrl.searchParams.set('oauth_error', error);
      redirectUrl.searchParams.set('oauth_error_description', errorDescription || 'Unknown error');
      return NextResponse.redirect(redirectUrl);
    }
    
    if (!code || !state) {
      const redirectUrl = new URL('/tools/settings-n3', request.nextUrl.origin);
      redirectUrl.searchParams.set('oauth_error', 'missing_params');
      redirectUrl.searchParams.set('oauth_error_description', 'Missing code or state parameter');
      return NextResponse.redirect(redirectUrl);
    }
    
    const oauth = getOAuthManager();
    const result = await oauth.handleCallback(state, code);
    
    const redirectUrl = new URL('/tools/settings-n3', request.nextUrl.origin);
    
    if (result.success) {
      redirectUrl.searchParams.set('oauth_success', 'true');
      redirectUrl.searchParams.set('oauth_provider', result.provider);
    } else {
      redirectUrl.searchParams.set('oauth_error', 'callback_failed');
      redirectUrl.searchParams.set('oauth_error_description', result.error || 'Callback processing failed');
    }
    
    return NextResponse.redirect(redirectUrl);
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    const redirectUrl = new URL('/tools/settings-n3', request.nextUrl.origin);
    redirectUrl.searchParams.set('oauth_error', 'server_error');
    redirectUrl.searchParams.set('oauth_error_description', error instanceof Error ? error.message : 'Server error');
    
    return NextResponse.redirect(redirectUrl);
  }
}
