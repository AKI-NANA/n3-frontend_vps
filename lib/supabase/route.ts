// lib/supabase/route.ts
/**
 * API Route専用のSupabaseクライアント
 * cookies()を使わないシンプルな実装
 */
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

/**
 * API Route用のSupabaseクライアントを取得
 * Service Role Keyを使用してフルアクセス
 */
export function createClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[supabase/route] 環境変数が設定されていません:', {
      url: !!supabaseUrl,
      key: !!supabaseKey
    })
    throw new Error('Supabase環境変数が未設定')
  }

  console.log('[supabase/route] Supabaseクライアント初期化:', supabaseUrl)

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public'
    }
  })

  return supabaseInstance
}

// 非同期版（互換性のため）
export async function createClientAsync(): Promise<SupabaseClient> {
  return createClient()
}
