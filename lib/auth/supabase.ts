/**
 * Supabase クライアント設定
 * @deprecated このファイルは廃止予定です。代わりに '@/lib/supabase/client' を使用してください。
 */

// 統一されたSupabaseクライアントをインポート
import { supabase } from '@/lib/supabase/client'
export { supabase, createClient as createSupabaseServerClient } from '@/lib/supabase/client'

/**
 * Supabase から認証ユーザーを取得
 */
export async function getAuthUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return null
  }
  return data.user
}

/**
 * ユーザープロフィール取得
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

/**
 * ユーザープロフィール作成または更新
 */
export async function upsertUserProfile(userId: string, profile: any) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile })
    .select()
    .single()

  if (error) {
    console.error('Error upserting user profile:', error)
    return null
  }

  return data
}
