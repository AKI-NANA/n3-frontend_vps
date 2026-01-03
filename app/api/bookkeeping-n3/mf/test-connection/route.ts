// app/api/bookkeeping-n3/mf/test-connection/route.ts
/**
 * MFクラウド API 接続テスト
 * 
 * MF API ドキュメント: https://api.biz.moneyforward.com/index.html
 */

import { NextRequest, NextResponse } from 'next/server';

const MF_API_BASE = 'https://api.biz.moneyforward.com';

// MFクラウドの主要エンドポイント
const MF_ENDPOINTS = {
  // 認証
  authorize: 'https://id.moneyforward.com/oauth/authorize',
  token: 'https://id.moneyforward.com/oauth/token',
  
  // 事業所
  offices: '/api/v3/offices',
  
  // 勘定科目
  accountItems: '/api/v3/account_items',
  
  // 取引（明細）
  walletables: '/api/v3/walletables', // 口座一覧
  walletTxns: '/api/v3/wallet_txns',  // 明細一覧
  
  // 仕訳
  journals: '/api/v3/journals',
  manualJournals: '/api/v3/manual_journals',
  
  // 税区分
  taxes: '/api/v3/taxes',
  
  // 取引先
  partners: '/api/v3/partners',
};

export async function GET(request: NextRequest) {
  const clientId = process.env.MONEYFORWARD_CLIENT_ID;
  const clientSecret = process.env.MONEYFORWARD_CLIENT_SECRET;
  const redirectUri = process.env.MONEYFORWARD_REDIRECT_URI;
  
  // 認証情報の確認
  const authStatus = {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasRedirectUri: !!redirectUri,
    clientIdPreview: clientId ? `${clientId.substring(0, 8)}...` : null,
  };
  
  // OAuth認証URLの生成
  const authUrl = new URL(MF_ENDPOINTS.authorize);
  authUrl.searchParams.set('client_id', clientId || '');
  authUrl.searchParams.set('redirect_uri', redirectUri || '');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'office:read account_items:read wallet_txns:read journals:read journals:write');
  
  return NextResponse.json({
    success: true,
    message: 'MFクラウド API 設定情報',
    data: {
      authStatus,
      endpoints: MF_ENDPOINTS,
      oauthUrl: authUrl.toString(),
      nextSteps: [
        '1. 上記のoauthUrlにアクセスしてMFクラウドで認証',
        '2. リダイレクト先でauthorization_codeを取得',
        '3. codeを使ってaccess_tokenを取得',
        '4. access_tokenでAPIを呼び出し',
      ],
      apiDocumentation: 'https://api.biz.moneyforward.com/index.html',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, code, accessToken, officeId } = body;
    
    const clientId = process.env.MONEYFORWARD_CLIENT_ID;
    const clientSecret = process.env.MONEYFORWARD_CLIENT_SECRET;
    const redirectUri = process.env.MONEYFORWARD_REDIRECT_URI;
    
    // アクション: トークン取得
    if (action === 'get_token' && code) {
      const tokenResponse = await fetch(MF_ENDPOINTS.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri || '',
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      return NextResponse.json({
        success: tokenResponse.ok,
        data: tokenData,
      });
    }
    
    // アクション: 事業所一覧取得
    if (action === 'get_offices' && accessToken) {
      const response = await fetch(`${MF_API_BASE}${MF_ENDPOINTS.offices}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      return NextResponse.json({
        success: response.ok,
        data,
      });
    }
    
    // アクション: 勘定科目一覧取得
    if (action === 'get_account_items' && accessToken && officeId) {
      const response = await fetch(
        `${MF_API_BASE}${MF_ENDPOINTS.accountItems}?office_id=${officeId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      
      return NextResponse.json({
        success: response.ok,
        data,
        message: '勘定科目一覧を取得しました',
      });
    }
    
    // アクション: 口座一覧取得
    if (action === 'get_walletables' && accessToken && officeId) {
      const response = await fetch(
        `${MF_API_BASE}${MF_ENDPOINTS.walletables}?office_id=${officeId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      
      return NextResponse.json({
        success: response.ok,
        data,
        message: '口座一覧を取得しました',
      });
    }
    
    // アクション: 明細一覧取得
    if (action === 'get_wallet_txns' && accessToken && officeId) {
      const response = await fetch(
        `${MF_API_BASE}${MF_ENDPOINTS.walletTxns}?office_id=${officeId}&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      
      return NextResponse.json({
        success: response.ok,
        data,
        message: '明細一覧を取得しました',
      });
    }
    
    // アクション: 税区分一覧取得
    if (action === 'get_taxes' && accessToken && officeId) {
      const response = await fetch(
        `${MF_API_BASE}${MF_ENDPOINTS.taxes}?office_id=${officeId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      
      return NextResponse.json({
        success: response.ok,
        data,
        message: '税区分一覧を取得しました',
      });
    }
    
    return NextResponse.json({
      success: false,
      error: '不明なアクションです',
      availableActions: [
        'get_token',
        'get_offices',
        'get_account_items',
        'get_walletables',
        'get_wallet_txns',
        'get_taxes',
      ],
    });
    
  } catch (error) {
    console.error('[MF API] エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
