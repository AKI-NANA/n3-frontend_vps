// lib/supabase/server.ts
/**
 * サーバーサイド専用Supabaseクライアント
 * 
 * ⚠️ 重要: このファイルはRoute Handler/Server Componentでのみ使用
 * ブラウザ側では lib/supabase/client.ts を使用してください
 * 
 * 🔥 v2: 環境変数読み込みのデバッグログ追加
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 🔥 環境変数の存在チェック（起動時に一度だけログ）
const ENV_CHECK_DONE = { done: false };

export async function createClient() {
  const cookieStore = await cookies()

  // 🔥 サーバー側ではSERVICE_ROLE_KEYを優先使用
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // 🔥 デバッグ: 環境変数の状態を一度だけログ
  if (!ENV_CHECK_DONE.done) {
    ENV_CHECK_DONE.done = true;
    console.log('[Supabase Server] 🔍 環境変数チェック:', {
      url: supabaseUrl ? `✅ ${supabaseUrl.substring(0, 30)}...` : '❌ 未設定',
      serviceKey: supabaseServiceKey ? `✅ (${supabaseServiceKey.length}文字)` : '❌ 未設定',
      anonKey: supabaseAnonKey ? `✅ (${supabaseAnonKey.length}文字)` : '❌ 未設定',
    });
  }
  
  // URLが未設定の場合はエラー
  if (!supabaseUrl) {
    console.error('[Supabase Server] ❌ NEXT_PUBLIC_SUPABASE_URL が未設定です');
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }
  
  // キー選択: service_role > anon
  const supabaseKey = supabaseServiceKey || supabaseAnonKey;
  if (!supabaseKey) {
    console.error('[Supabase Server] ❌ SUPABASE_SERVICE_ROLE_KEY も NEXT_PUBLIC_SUPABASE_ANON_KEY も未設定です');
    throw new Error('Supabase API key is not configured');
  }

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
