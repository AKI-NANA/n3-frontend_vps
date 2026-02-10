import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // URLからアカウント情報を取得
    const { searchParams } = new URL(request.url);
    const account = searchParams.get('account') || 'green';
    
    // アカウント別にClient IDとRuNameを取得
    const accountUpper = account.toUpperCase();
    const clientId = process.env[`EBAY_CLIENT_ID_${accountUpper}`] || process.env.EBAY_CLIENT_ID;
    const ruName = process.env[`EBAY_RUNAME_${accountUpper}`] || process.env.EBAY_RUNAME_GREEN;
    
    // 🔥 ローカル開発用のコールバックURL
    const redirectUri = encodeURIComponent('http://localhost:3000/api/ebay/auth/callback');

    console.log('🔑 Account for credentials:', account, '->', accountUpper);
    console.log('🔑 Using RuName:', ruName);
    console.log('🔑 Redirect URI:', redirectUri);

    // 環境変数のチェック
    if (!clientId) {
      console.error('❌ EBAY_CLIENT_ID_MJT または EBAY_CLIENT_ID が設定されていません')
      return NextResponse.json(
        { error: 'EBAY_CLIENT_IDが設定されていません' },
        { status: 500 }
      )
    }

    console.log('🔑 eBay認証リダイレクト開始')
    console.log('Account:', account)
    console.log('Client ID:', clientId.substring(0, 20) + '...')
    console.log('RuName:', ruName)

    // ✅ eBay Developer Portalで許可されているスコープのみを使用
    const scope = encodeURIComponent(
      'https://api.ebay.com/oauth/api_scope ' +
      'https://api.ebay.com/oauth/api_scope/sell.account ' +
      'https://api.ebay.com/oauth/api_scope/sell.fulfillment ' +
      'https://api.ebay.com/oauth/api_scope/sell.inventory ' +
      'https://api.ebay.com/oauth/api_scope/sell.marketing ' +
      'https://api.ebay.com/oauth/api_scope/sell.analytics.readonly'
    );

    // 本番環境のeBay認証URL（実際のコールバックURLを使用）
    // 🔧 prompt=login で毎回ログイン画面を強制表示（別アカウントでログインできるようにする）
    const authUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${account}&prompt=login`;

    console.log('✅ リダイレクトURL生成成功')
    console.log('Auth URL:', authUrl)

    // 直接認証URLにリダイレクト（prompt=loginで毎回ログイン画面を表示）
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('❌ eBay認証リダイレクトエラー:', error)
    return NextResponse.json(
      {
        error: '認証リダイレクトに失敗しました',
        details: error.message
      },
      { status: 500 }
    )
  }
}
