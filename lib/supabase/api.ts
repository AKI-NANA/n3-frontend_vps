// lib/supabase/api.ts
// APIルート専用のSupabaseクライアント（cookiesを使わない）
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * APIルート内で使用するSupabaseクライアントを取得
 * 
 * 使い方:
 * ```ts
 * import { getSupabaseForApi } from '@/lib/supabase/api'
 * 
 * export async function POST(req: NextRequest) {
 *   const supabase = getSupabaseForApi()
 *   // ...
 * }
 * ```
 */
export function getSupabaseForApi() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase環境変数が設定されていません')
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

// エイリアス（既存コードとの互換性）
export const createApiClient = getSupabaseForApi
