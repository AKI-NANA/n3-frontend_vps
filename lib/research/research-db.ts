/**
 * リサーチ結果のDB保存
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export interface ResearchResult {
  search_keyword: string
  ebay_item_id: string
  title: string
  price_usd: number
  sold_count: number
  category_id?: string
  category_name?: string
  condition?: string
  seller_username?: string
  image_url?: string
  view_item_url?: string
  lowest_price_usd?: number
  average_price_usd?: number
  competitor_count?: number
  estimated_weight_g?: number
  listing_type?: string
  location_country?: string
  location_city?: string
  shipping_cost_usd?: number
}

/**
 * リサーチ結果をDBに保存
 */
export async function saveResearchResults(results: ResearchResult[]): Promise<void> {
  if (!results || results.length === 0) {
    console.log('保存するリサーチ結果がありません')
    return
  }

  try {
    // テーブルが存在しない場合はスキップ
    const { error } = await supabase
      .from('research_results')
      .upsert(
        results.map(r => ({
          ...r,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'ebay_item_id' }
      )

    if (error) {
      // テーブルが存在しない場合は警告のみ
      if (error.code === '42P01') {
        console.warn('⚠️ research_results テーブルが存在しません。スキップします。')
        return
      }
      console.error('リサーチ結果保存エラー:', error)
    } else {
      console.log(`✅ ${results.length}件のリサーチ結果を保存しました`)
    }
  } catch (error) {
    console.error('リサーチ結果保存の予期しないエラー:', error)
  }
}

/**
 * キーワードでリサーチ結果を取得
 */
export async function getResearchResultsByKeyword(keyword: string): Promise<ResearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('research_results')
      .select('*')
      .ilike('search_keyword', `%${keyword}%`)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('リサーチ結果取得エラー:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('リサーチ結果取得の予期しないエラー:', error)
    return []
  }
}
