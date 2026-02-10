/**
 * eBay配送ポリシー選択サービス
 * 商品の重量に基づいて適切な配送ポリシーを選択
 */

import { createClient } from '@/lib/supabase/server'

interface ShippingPolicyResult {
  fulfillmentPolicyId: string
  paymentPolicyId: string
  returnPolicyId: string
  policyName: string
  rateTableId: string | null
}

/**
 * 商品重量に基づいて最適な配送ポリシーを取得
 * @param accountId eBayアカウントID (green, mjt)
 * @param weightGrams 商品重量（グラム）
 * @returns 配送ポリシー情報
 */
export async function selectShippingPolicy(
  accountId: string,
  weightGrams: number
): Promise<ShippingPolicyResult | null> {
  try {
    const supabase = await createClient()

    // 重量範囲に合致するポリシーを検索
    const { data, error } = await supabase
      .from('ebay_shipping_policies')
      .select('*')
      .eq('account_id', accountId)
      .eq('is_active', true)
      .lte('weight_range_min', weightGrams)
      .gte('weight_range_max', weightGrams)
      .order('weight_range_max', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      console.error('❌ Policy selection error:', error)
      
      // フォールバック: 最小重量のポリシーを取得
      const { data: fallbackData } = await supabase
        .from('ebay_shipping_policies')
        .select('*')
        .eq('account_id', accountId)
        .eq('is_active', true)
        .order('weight_range_max', { ascending: true })
        .limit(1)
        .single()

      if (!fallbackData) return null

      return {
        fulfillmentPolicyId: fallbackData.policy_id,
        paymentPolicyId: fallbackData.payment_policy_id,
        returnPolicyId: fallbackData.return_policy_id,
        policyName: fallbackData.policy_name,
        rateTableId: fallbackData.rate_table_id
      }
    }

    return {
      fulfillmentPolicyId: data.policy_id,
      paymentPolicyId: data.payment_policy_id,
      returnPolicyId: data.return_policy_id,
      policyName: data.policy_name,
      rateTableId: data.rate_table_id
    }

  } catch (err) {
    console.error('❌ selectShippingPolicy error:', err)
    return null
  }
}

/**
 * 固定ポリシーIDを使用する場合のフォールバック
 */
export async function getDefaultPolicies(
  accountId: string
): Promise<{ paymentPolicyId: string; returnPolicyId: string }> {
  // green アカウントのデフォルト値
  if (accountId === 'green') {
    return {
      paymentPolicyId: '251686504012',
      returnPolicyId: '251686527012'
    }
  }

  // mjt アカウントのデフォルト値
  if (accountId === 'mjt') {
    return {
      paymentPolicyId: '251686527012', // 要確認
      returnPolicyId: '251686527012'
    }
  }

  // その他のアカウント（DBから取得を推奨）
  return {
    paymentPolicyId: '',
    returnPolicyId: ''
  }
}

/**
 * 全アクティブポリシーを取得
 */
export async function getAllActivePolicies(accountId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ebay_shipping_policies')
    .select('*')
    .eq('account_id', accountId)
    .eq('is_active', true)
    .order('weight_range_max', { ascending: true })

  if (error) {
    console.error('❌ getAllActivePolicies error:', error)
    return []
  }

  return data || []
}
