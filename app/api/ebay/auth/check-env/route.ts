import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

  // 動的にRedirect URIを構築
  const protocol = isLocalhost ? 'http' : 'https';
  const dynamicRedirectUri = `${protocol}://${host}/api/ebay/auth/callback`;

  return NextResponse.json({
    host,
    environment: isLocalhost ? 'local' : 'production',
    envVars: {
      EBAY_CLIENT_ID_MJT: process.env.EBAY_CLIENT_ID_MJT ? '✅ 設定済み' : '❌ 未設定',
      EBAY_CLIENT_SECRET_MJT: process.env.EBAY_CLIENT_SECRET_MJT ? '✅ 設定済み' : '❌ 未設定',
    },
    redirectUriConfig: {
      method: '動的生成（現在のホストから自動構築）',
      activeRedirectUri: dynamicRedirectUri
    }
  });
}
