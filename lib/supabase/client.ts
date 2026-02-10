// lib/supabase/client.ts
/**
 * Supabase Client - シングルトンパターン
 * 
 * ⚠️ 重要: このファイルは一度だけ初期化されるシングルトンです
 * createClient()を直接呼び出さず、exportされた`supabase`を使用してください
 */
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

// 環境変数
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://zdzfpucdyxdlavkgrvil.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NjIxMjAsImV4cCI6MjA1MDQzODEyMH0.T8qJO0KwfC3YmIRE1dYpA2z82_kpMXwvFJL3P3QGu7M'

// シングルトンインスタンス
let supabaseInstance: SupabaseClient | null = null
let isInitialized = false

/**
 * シングルトンSupabaseクライアントを取得
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }
  
  // 初回のみログ出力
  if (!isInitialized && typeof window !== 'undefined') {
    console.log('✅ Supabase初期化:', supabaseUrl)
    isInitialized = true
  }
  
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,  // セッションを永続化
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'Prefer': 'return=representation'
      }
    }
  })
  
  return supabaseInstance
}

// エクスポート: 常に同じインスタンスを返す
export const supabase = getSupabaseClient()

/**
 * @deprecated このメソッドは非推奨です。代わりに`supabase`を直接使用してください。
 * 互換性のために残していますが、内部的には同じシングルトンを返します。
 */
export function createClient(): SupabaseClient {
  // 新しいインスタンスを作成せず、シングルトンを返す
  return getSupabaseClient()
}

// TypeScript型定義
export type HSCode = {
  code: string
  description: string
  base_duty: number
  section301: boolean
  section301_rate?: number
  category?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export type EbayCategoryFee = {
  id: number
  category_key: string
  category_name: string
  category_path?: string
  fvf: number
  cap?: number
  insertion_fee: number
  paypal_fee_percent?: number
  paypal_fee_fixed?: number
  active: boolean
  is_select_category?: boolean
  created_at?: string
  updated_at?: string
}

export type ShippingPolicy = {
  id: number
  policy_name: string
  ebay_policy_id?: string
  weight_min: number
  weight_max: number
  size_min: number
  size_max: number
  price_min: number
  price_max: number
  active: boolean
  created_at?: string
  updated_at?: string
  zones?: ShippingZone[]
}

export type ShippingZone = {
  id: number
  policy_id: number
  country_code: string
  display_shipping: number
  actual_cost: number
  handling_ddp?: number
  handling_ddu: number
  created_at?: string
  updated_at?: string
}

export type ProfitMarginSetting = {
  id: number
  setting_type: 'default' | 'category' | 'country' | 'condition'
  setting_key: string
  default_margin: number
  min_margin: number
  min_amount: number
  max_margin: number
  active: boolean
  created_at?: string
  updated_at?: string
}

export type ExchangeRate = {
  id: number
  currency_from: string
  currency_to: string
  spot_rate: number
  buffer_percent: number
  safe_rate: number
  source?: string
  created_at?: string
}

export type OriginCountry = {
  code: string
  name: string
  name_ja?: string
  fta_agreements?: string[]
  active: boolean
  created_at?: string
  updated_at?: string
}
