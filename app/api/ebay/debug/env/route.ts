import { NextResponse } from 'next/server';

/**
 * デバッグ用API: 環境変数の確認
 * GET /api/ebay/debug/env
 */
export async function GET() {
  try {
    const envVars = {
      // eBay関連環境変数（値は伏せ字）
      ebay: {
        EBAY_CLIENT_ID_MJT: {
          exists: !!process.env.EBAY_CLIENT_ID_MJT,
          length: process.env.EBAY_CLIENT_ID_MJT?.length || 0,
          preview: process.env.EBAY_CLIENT_ID_MJT?.substring(0, 10) + '...' || null
        },
        EBAY_CLIENT_SECRET_MJT: {
          exists: !!process.env.EBAY_CLIENT_SECRET_MJT,
          length: process.env.EBAY_CLIENT_SECRET_MJT?.length || 0,
          preview: process.env.EBAY_CLIENT_SECRET_MJT?.substring(0, 10) + '...' || null
        },
        EBAY_CLIENT_ID_GREEN: {
          exists: !!process.env.EBAY_CLIENT_ID_GREEN,
          length: process.env.EBAY_CLIENT_ID_GREEN?.length || 0,
          preview: process.env.EBAY_CLIENT_ID_GREEN?.substring(0, 10) + '...' || null
        },
        EBAY_CLIENT_SECRET_GREEN: {
          exists: !!process.env.EBAY_CLIENT_SECRET_GREEN,
          length: process.env.EBAY_CLIENT_SECRET_GREEN?.length || 0,
          preview: process.env.EBAY_CLIENT_SECRET_GREEN?.substring(0, 10) + '...' || null
        },
        EBAY_CLIENT_ID: {
          exists: !!process.env.EBAY_CLIENT_ID,
          length: process.env.EBAY_CLIENT_ID?.length || 0,
          preview: process.env.EBAY_CLIENT_ID?.substring(0, 10) + '...' || null
        },
        EBAY_REDIRECT_URI_LOCAL: {
          exists: !!process.env.EBAY_REDIRECT_URI_LOCAL,
          value: process.env.EBAY_REDIRECT_URI_LOCAL || null
        },
        EBAY_REDIRECT_URI_PRODUCTION: {
          exists: !!process.env.EBAY_REDIRECT_URI_PRODUCTION,
          value: process.env.EBAY_REDIRECT_URI_PRODUCTION || null
        },
        EBAY_REDIRECT_URI: {
          exists: !!process.env.EBAY_REDIRECT_URI,
          value: process.env.EBAY_REDIRECT_URI || null
        }
      },

      // Supabase関連環境変数
      supabase: {
        NEXT_PUBLIC_SUPABASE_URL: {
          exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          value: process.env.NEXT_PUBLIC_SUPABASE_URL || null
        },
        NEXT_PUBLIC_SUPABASE_ANON_KEY: {
          exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
          preview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...' || null
        },
        SUPABASE_SERVICE_ROLE_KEY: {
          exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
          preview: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...' || null
        }
      },

      // アプリケーション設定
      app: {
        NEXT_PUBLIC_APP_URL: {
          exists: !!process.env.NEXT_PUBLIC_APP_URL,
          value: process.env.NEXT_PUBLIC_APP_URL || null
        },
        NODE_ENV: {
          value: process.env.NODE_ENV
        }
      }
    };

    // 問題の可能性がある設定を診断
    const diagnostics = {
      warnings: [] as string[],
      errors: [] as string[]
    };

    // eBay認証情報のチェック
    if (!envVars.ebay.EBAY_CLIENT_ID_MJT.exists && !envVars.ebay.EBAY_CLIENT_ID.exists) {
      diagnostics.errors.push('EBAY_CLIENT_ID_MJT または EBAY_CLIENT_ID が設定されていません');
    }

    if (!envVars.ebay.EBAY_CLIENT_ID_GREEN.exists) {
      diagnostics.warnings.push('EBAY_CLIENT_ID_GREEN が設定されていません（greenアカウント認証に必要）');
    }

    if (!envVars.ebay.EBAY_CLIENT_SECRET_GREEN.exists) {
      diagnostics.warnings.push('EBAY_CLIENT_SECRET_GREEN が設定されていません（greenアカウント認証に必要）');
    }

    // Redirect URIのチェック
    if (!envVars.ebay.EBAY_REDIRECT_URI_PRODUCTION.exists && !envVars.ebay.EBAY_REDIRECT_URI.exists) {
      diagnostics.errors.push('EBAY_REDIRECT_URI_PRODUCTION または EBAY_REDIRECT_URI が設定されていません');
    }

    // Supabase設定のチェック
    if (!envVars.supabase.NEXT_PUBLIC_SUPABASE_URL.exists) {
      diagnostics.errors.push('NEXT_PUBLIC_SUPABASE_URL が設定されていません');
    }

    if (!envVars.supabase.SUPABASE_SERVICE_ROLE_KEY.exists) {
      diagnostics.errors.push('SUPABASE_SERVICE_ROLE_KEY が設定されていません');
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envVars,
      diagnostics
    });
  } catch (error: any) {
    console.error('❌ デバッグAPI エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
