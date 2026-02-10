import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface EmsShippingRate {
  costJPY: number
  costUSD: number
  serviceName: string
  deliveryDays: string
}

/**
 * ebay_shipping_master からEMS送料を取得
 * @param countryCode 国コード（例: 'US', 'SG', 'TH'）
 * @param weightKg 重量（kg）
 * @returns EMS送料情報
 */
export async function getEmsShipping(
  countryCode: string,
  weightKg: number
): Promise<EmsShippingRate> {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase
    .from('ebay_shipping_master')
    .select('base_rate_jpy, shipping_cost_with_margin_usd, service_code')
    .eq('service_code', 'JPPOST_EMS')
    .eq('country_code', countryCode.toUpperCase())
    .lte('weight_from_kg', weightKg)
    .gte('weight_to_kg', weightKg)
    .single()

  if (error || !data) {
    console.warn(`EMS rate not found for ${countryCode} / ${weightKg}kg:`, error)
    // フォールバック: 概算計算
    return {
      costJPY: Math.round(2000 + weightKg * 1500),
      costUSD: Math.round((2000 + weightKg * 1500) / 150),
      serviceName: 'EMS (概算)',
      deliveryDays: '3-7日'
    }
  }

  return {
    costJPY: data.base_rate_jpy || 0,
    costUSD: data.shipping_cost_with_margin_usd || 0,
    serviceName: 'EMS',
    deliveryDays: '3-7日'
  }
}

/**
 * 複数国のEMS送料を一括取得
 */
export async function getEmsShippingBulk(
  countryCodes: string[],
  weightKg: number
): Promise<Record<string, EmsShippingRate>> {
  const results: Record<string, EmsShippingRate> = {}

  await Promise.all(
    countryCodes.map(async (code) => {
      results[code] = await getEmsShipping(code, weightKg)
    })
  )

  return results
}

/**
 * EMS対応国リスト（主要国）
 */
export const EMS_SUPPORTED_COUNTRIES = {
  // 東南アジア
  SG: { name: 'シンガポール', zone: 1 },
  MY: { name: 'マレーシア', zone: 1 },
  TH: { name: 'タイ', zone: 1 },
  VN: { name: 'ベトナム', zone: 1 },
  PH: { name: 'フィリピン', zone: 1 },
  ID: { name: 'インドネシア', zone: 1 },
  TW: { name: '台湾', zone: 1 },

  // 東アジア
  CN: { name: '中国', zone: 1 },
  KR: { name: '韓国', zone: 1 },
  HK: { name: '香港', zone: 1 },

  // 北米
  US: { name: 'アメリカ', zone: 2 },
  CA: { name: 'カナダ', zone: 2 },

  // 欧州
  GB: { name: 'イギリス', zone: 3 },
  DE: { name: 'ドイツ', zone: 3 },
  FR: { name: 'フランス', zone: 3 },
  IT: { name: 'イタリア', zone: 3 },
  ES: { name: 'スペイン', zone: 3 },

  // オセアニア
  AU: { name: 'オーストラリア', zone: 2 }
}
