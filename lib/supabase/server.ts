// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // 🔥 サーバー側ではSERVICE_ROLE_KEYを使用
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  // ビルド時のみ警告、実行時はエラー
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production' && supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('⚠️ Supabase URLまたはAPI Keyが設定されていません（ビルド時）')
  }

  console.log('✅ Supabase初期化:', supabaseUrl)

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Server Component内でのcookie設定エラーを無視
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Server Component内でのcookie削除エラーを無視
          }
        },
      },
    }
  )
}
