/**
 * eBayトークン確認API
 * GET /api/ebay/check-tokens
 * 
 * DBに保存されているトークンを確認
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase環境変数が未設定' }, { status: 500 })
  }

  const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

  // 両方のアカウントのトークンを取得
  const { data: tokens, error } = await supabase
    .from('ebay_tokens')
    .select('account, refresh_token, access_token, expires_at, updated_at')
    .in('account', ['mjt', 'green'])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 環境変数からも取得
  const envTokens = {
    mjt: {
      client_id_prefix: process.env.EBAY_CLIENT_ID_MJT?.substring(0, 20) || 'N/A',
      refresh_token_prefix: process.env.EBAY_REFRESH_TOKEN_MJT?.substring(0, 30) || 'N/A',
    },
    green: {
      client_id_prefix: process.env.EBAY_CLIENT_ID_GREEN?.substring(0, 20) || 'N/A',
      refresh_token_prefix: process.env.EBAY_REFRESH_TOKEN_GREEN?.substring(0, 30) || 'N/A',
    }
  }

  // 結果を整形
  const result = tokens?.map(t => ({
    account: t.account,
    refresh_token_prefix: t.refresh_token?.substring(0, 40) + '...',
    access_token_prefix: t.access_token?.substring(0, 40) + '...',
    expires_at: t.expires_at,
    updated_at: t.updated_at,
    is_expired: t.expires_at ? new Date(t.expires_at) < new Date() : true
  }))

  return NextResponse.json({
    db_tokens: result,
    env_tokens: envTokens,
    message: 'トークン情報を確認してください。refresh_tokenの先頭が一致しているか確認してください。'
  })
}
