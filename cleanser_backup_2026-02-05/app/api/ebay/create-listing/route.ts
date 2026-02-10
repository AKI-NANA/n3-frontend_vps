/**
 * eBay 即時出品API - ebay_default_policies対応版 (v2.1)
 * 
 * 🔥 ポリシーID取得の優先順位 (修正版):
 * 1. 🔥 固定ポリシーID（システム標準）- 最優先
 * 2. 商品のlisting_data
 * 3. ebay_default_policiesテーブル
 * 4. 環境変数（フォールバック）
 * 
 * ※ Return Policy IDは固定IDがある場合、常にそれを使用
 *   (商品データやDBの旧IDを上書き)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { euResponsiblePersonService } from '@/lib/services/eu-responsible-person-service'
import { selectShippingPolicy } from '@/lib/services/shipping-policy-service'
import { fetchSecret } from '@/lib/shared/security';

// ========================================
// 🔥 固定ポリシーID（システム標準）
// Return PolicyはeBay Seller Hubで設定済みの最新IDを使用
// ※ これらのIDは最優先で使用される（DB/商品データより優先）
// ========================================
const FIXED_POLICIES: Record<string, Record<string, { return?: string; payment?: string; fulfillment?: string }>> = {
  mjt: {
    EBAY_US: {
      return: '251686527012',  // Return Accepted 30days (最新)
      // payment と fulfillment はDBから取得
    },
    EBAY_UK: {
      return: '251686527012',
    },
    EBAY_DE: {
      return: '251686527012',
    },
    EBAY_AU: {
      return: '251686527012',
    }
  },
  green: {
    EBAY_US: {
      payment: '251686504012',   // GREEN Payment Policy
      return: '251686527012',    // GREEN Return Policy
    },
    EBAY_UK: {
      payment: '251686504012',
      return: '251686527012',
    },
    EBAY_DE: {
      payment: '251686504012',
      return: '251686527012',
    },
    EBAY_AU: {
      payment: '251686504012',
      return: '251686527012',
    }
  },
  'mystical-japan-treasures': {
    EBAY_US: {},
    EBAY_UK: {},
    EBAY_DE: {},
    EBAY_AU: {}
  }
};

/**
 * Location情報を自動取得（eBay API直接呼び出し版）
 */
async function ensureLocation(
  accountId: string,
  userToken: string,
  supabase: any
): Promise<string | null> {
  
  // DBに既にある場合はそれを返す
  const { data: existing, error: dbError } = await supabase
    .from('ebay_locations')
    .select('merchant_location_key, location_name')
    .eq('account_id', accountId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (dbError) {
  }

  if (existing?.merchant_location_key) {
    return existing.merchant_location_key
  }

  // eBay APIから直接取得

  try {
    const response = await fetch('https://api.ebay.com/sell/inventory/v1/location', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US',
        'Accept-Language': 'en-US'
      }
    })

    if (response.ok) {
      const data = await response.json()
      
      // DBに保存
      if (data.locations && data.locations.length > 0) {
        for (const location of data.locations) {
          const { error: upsertError } = await supabase
            .from('ebay_locations')
            .upsert({
              account_id: accountId,
              merchant_location_key: location.merchantLocationKey,
              location_name: location.name,
              location_type: location.locationType,
              address: location.location?.address,
              location_data: location,
              is_active: true,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'account_id,merchant_location_key'
            })
          
          if (upsertError) {
          } else {
          }
        }
        
        const firstLocation = data.locations[0]
        return firstLocation.merchantLocationKey
      } else {
      }
    } else {
      const errorText = await response.text()
    }
  } catch (error: any) {
  }

  // 環境変数フォールバック
  const envLocation = await fetchSecret('EBAY_LOCATION_KEY')
  if (envLocation) {
    return envLocation
  }

  return null
}

/**
 * カテゴリ別Condition情報を自動取得
 */
async function ensureCategoryConditions(
  categoryId: string,
  accountId: string,
  userToken: string,
  supabase: any
): Promise<void> {
  // DBに既にある場合はスキップ
  const { data: existing } = await supabase
    .from('ebay_category_conditions')
    .select('conditions')
    .eq('category_id', categoryId)
    .single()

  if (existing?.conditions && existing.conditions.length > 0) {
    return
  }

  // APIから取得

  try {
    const conditionApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ebay/category/conditions?categoryId=${categoryId}&account=${accountId}`
    
    const response = await fetch(conditionApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
    } else {
    }
  } catch (error) {
  }
}

/**
 * eBay Condition マッピング（Inventory Item用は文字列）
 */
async function mapConditionToInventoryFormat(
  condition: string, 
  categoryId: string | undefined,
  supabase: any
): Promise<string> {

  // 🔥 DBからカテゴリ別有効Conditionを取得
  if (categoryId) {
    const { data, error } = await supabase
      .from('ebay_category_conditions')
      .select('conditions')
      .eq('category_id', categoryId)
      .single()

    if (data?.conditions && Array.isArray(data.conditions) && data.conditions.length > 0) {
      // 🔥 Condition ID -> Name マッピングテーブル
      const conditionIdToName: Record<string, string> = {
        '1000': 'NEW',
        '1500': 'NEW_OTHER',
        '1750': 'NEW_WITH_DEFECTS',
        '2000': 'MANUFACTURER_REFURBISHED',
        '2500': 'SELLER_REFURBISHED',
        '2750': 'LIKE_NEW',        // トレカ: Graded
        '3000': 'USED_EXCELLENT',  // トレカ: Used  
        '4000': 'USED_VERY_GOOD',  // トレカ: Ungraded
        '5000': 'USED_GOOD',
        '6000': 'USED_ACCEPTABLE',
        '7000': 'FOR_PARTS_OR_NOT_WORKING',
      }

      const validConditions = data.conditions
        .map((c: any) => c.valueId || c.value)
        .filter((v: string) => v && v.length > 0)

      
      // 現在のconditionが有効か確認
      const targetCondition = condition.toUpperCase().replace(/ /g, '_')

      // 🔥 数値IDの場合は名前に変換
      if (/^\d+$/.test(targetCondition)) {
        const conditionName = conditionIdToName[targetCondition]
        if (conditionName) {
          return conditionName
        }
      }
      if (validConditions.includes(targetCondition)) {
        return targetCondition
      }
      
      // マッピング: USED_EXCELLENT → LIKE_NEWなど
      const conditionMapping: Record<string, string[]> = {
        'USED_EXCELLENT': ['LIKE_NEW', 'VERY_GOOD', 'GOOD'],
        'USED_VERY_GOOD': ['LIKE_NEW', 'VERY_GOOD', 'GOOD'],
        'USED_GOOD': ['VERY_GOOD', 'GOOD', 'LIKE_NEW'],
        'USED_ACCEPTABLE': ['GOOD', 'ACCEPTABLE', 'VERY_GOOD'],
      }
      
      const candidates = conditionMapping[targetCondition] || []
      for (const candidate of candidates) {
        if (validConditions.includes(candidate)) {
          return candidate
        }
      }
      
      // 🔥 デフォルト: 最初の有効ConditionをIDからNameに変換
      const fallbackId = validConditions[0]
      
      // 🔥 数値IDの場合は必ず変換
      if (/^\d+$/.test(fallbackId)) {
        const fallbackName = conditionIdToName[fallbackId]
        if (fallbackName) {
          return fallbackName
        }
        // マッピングになければ安全なデフォルト
        return 'USED_EXCELLENT'
      }
      
      return fallbackId
    } else {
    }
  }
  
  // 🔥 フォールバック: カテゴリ別固定マッピング
  const tradingCardCategories = ['183454', '2536', '261328']
  if (categoryId && tradingCardCategories.includes(categoryId)) {
    const cardConditionMap: Record<string, string> = {
      'NEW': 'NEW',
      'USED_EXCELLENT': 'LIKE_NEW',
      'USED_VERY_GOOD': 'LIKE_NEW',
      'USED_GOOD': 'VERY_GOOD',
      'USED_ACCEPTABLE': 'GOOD',
      // 🔥 数値ID対応
      '1000': 'NEW',
      '2750': 'LIKE_NEW',      // Graded
      '3000': 'USED_EXCELLENT', // Used
      '4000': 'USED_VERY_GOOD', // Ungraded
    }
    const result = cardConditionMap[condition] || 'LIKE_NEW'
    return result
  }
  
  // 通常カテゴリ
  const conditionMap: Record<string, string> = {
    'NEW': 'NEW',
    'NEW_WITH_TAGS': 'NEW',
    'NEW_WITHOUT_TAGS': 'NEW_WITHOUT_TAGS',
    'NEW_WITH_DEFECTS': 'NEW_WITH_DEFECTS',
    'MANUFACTURER_REFURBISHED': 'REFURBISHED',
    'SELLER_REFURBISHED': 'REFURBISHED',
    'USED_EXCELLENT': 'USED_EXCELLENT',
    'USED_VERY_GOOD': 'USED_VERY_GOOD',
    'USED_GOOD': 'USED_GOOD',
    'USED_ACCEPTABLE': 'USED_ACCEPTABLE',
    'FOR_PARTS_OR_NOT_WORKING': 'FOR_PARTS_OR_NOT_WORKING',
    // 🔥 数値IDフォールバック
    '1000': 'NEW',
    '3000': 'USED_EXCELLENT',
    '4000': 'USED_VERY_GOOD',
    '5000': 'USED_GOOD',
  }
  
  const result = conditionMap[condition] || 'USED_EXCELLENT'
  return result
}

async function getValidToken(accountId: string = 'mjt') {
  const supabase = await createClient()
  const { data } = await supabase
    .from('ebay_tokens')
    .select('*')
    .eq('account', accountId)
    .eq('is_active', true)
    .single()
  
  if (!data) return null

  const expiresAt = new Date(data.expires_at)
  const minutesRemaining = (expiresAt.getTime() - Date.now()) / 1000 / 60

  if (minutesRemaining > 30) {
    return data.access_token
  }

  // トークン更新
  const clientId = await fetchSecret('EBAY_CLIENT_ID_MJT') || await fetchSecret('EBAY_CLIENT_ID')
  const clientSecret = await fetchSecret('EBAY_CLIENT_SECRET_MJT') || await fetchSecret('EBAY_CLIENT_SECRET')
  if (!clientId || !clientSecret) return null

  const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authCredentials}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: data.refresh_token
    })
  })

  if (!response.ok) return null

  const tokenData = await response.json()
  const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

  await supabase.from('ebay_tokens').update({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token || data.refresh_token,
    expires_at: newExpiresAt,
    updated_at: new Date().toISOString()
  }).eq('account', accountId)

  return tokenData.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const userToken = await getValidToken(body.accountId || 'mjt')

    if (!userToken) {
      return NextResponse.json(
        { error: 'User token not found. Please get token at /tools/api-test' },
        { status: 400 }
      )
    }

    const accountId = body.accountId || 'mjt'

    const { 
      productId,
      title, 
      description, 
      price, 
      quantity, 
      category,
      sku,
      brand,
      manufacturer,
      imageUrls,
      condition = 'USED_EXCELLENT',
      marketplace = 'EBAY_US',
      // EU責任者情報
      eu_responsible_company_name,
      eu_responsible_address_line1,
      eu_responsible_address_line2,
      eu_responsible_city,
      eu_responsible_state_or_province,
      eu_responsible_postal_code,
      eu_responsible_country,
      eu_responsible_email,
      eu_responsible_phone,
      eu_responsible_contact_url
    } = body

    if (!title || !price || !sku) {
      return NextResponse.json(
        { error: 'title, price, sku は必須です' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // ========================================
    // 🔥 Condition情報を事前取得
    // ========================================
    if (category) {
      await ensureCategoryConditions(category, accountId, userToken, supabase)
    }

    // ========================================
    // 🔥 ポリシーID取得（修正版: 固定ID最優先）
    // ========================================
    let paymentPolicyId: string | null = null
    let returnPolicyId: string | null = null
    let fulfillmentPolicyId: string | null = null

    // 1️⃣ 🔥 固定ポリシーID（システム標準）を最優先で適用
    const fixedPolicy = FIXED_POLICIES[accountId]?.[marketplace]
    if (fixedPolicy) {
      if (fixedPolicy.return) {
        returnPolicyId = fixedPolicy.return
      }
      if (fixedPolicy.payment) {
        paymentPolicyId = fixedPolicy.payment
      }
      if (fixedPolicy.fulfillment) {
        fulfillmentPolicyId = fixedPolicy.fulfillment
      }
    }

    // 2️⃣ 商品データから取得（固定IDがない場合のみ）
    if (productId && (!paymentPolicyId || !fulfillmentPolicyId)) {
      const { data: product, error } = await supabase
        .from('products_master')
        .select('listing_data')
        .eq('id', productId)
        .single()

      if (!error && product?.listing_data) {
        const listingData = product.listing_data
        
        // 🔥 固定IDがない場合のみ商品データを使用
        if (!paymentPolicyId && listingData.payment_policy_id) {
          paymentPolicyId = listingData.payment_policy_id
        }
        // 🔥 Return Policyは固定IDを優先（商品データの旧IDを使わない）
        if (!returnPolicyId && listingData.return_policy_id) {
          // ※ 固定IDがある場合はすでに設定済みなので、ここは固定IDがない場合のみ
          returnPolicyId = listingData.return_policy_id
        }
        if (!fulfillmentPolicyId) {
          fulfillmentPolicyId = listingData.fulfillment_policy_id || listingData.shipping_policy_id
          if (fulfillmentPolicyId) {
          }
        }
      }
    }

    // 3️⃣ ebay_default_policiesから取得（まだ不足がある場合）
    if (!paymentPolicyId || !returnPolicyId || !fulfillmentPolicyId) {

      const { data: defaultPolicies, error } = await supabase
        .from('ebay_default_policies')
        .select('policy_type, policy_id, policy_name')
        .eq('account_id', accountId)
        .eq('marketplace', marketplace)
        .eq('is_active', true)

      if (!error && defaultPolicies) {
        for (const policy of defaultPolicies) {
          if (policy.policy_type === 'payment' && !paymentPolicyId) {
            paymentPolicyId = policy.policy_id
          }
          if (policy.policy_type === 'return' && !returnPolicyId) {
            returnPolicyId = policy.policy_id
          }
          if (policy.policy_type === 'fulfillment' && !fulfillmentPolicyId) {
            fulfillmentPolicyId = policy.policy_id
          }
        }
      }
    }

    // 4️⃣ 環境変数から取得（最後の手段）
    if (!paymentPolicyId) {
      paymentPolicyId = await fetchSecret('EBAY_PAYMENT_POLICY_ID')
      if (paymentPolicyId) console.log('⚠️ Payment Policy (ENV):', paymentPolicyId)
    }
    if (!returnPolicyId) {
      returnPolicyId = await fetchSecret('EBAY_RETURN_POLICY_ID')
      if (returnPolicyId) console.log('⚠️ Return Policy (ENV):', returnPolicyId)
    }
    if (!fulfillmentPolicyId) {
      fulfillmentPolicyId = await fetchSecret('EBAY_FULFILLMENT_POLICY_ID')
      if (fulfillmentPolicyId) console.log('⚠️ Fulfillment Policy (ENV):', fulfillmentPolicyId)
    }

    // それでもない場合はエラー
    if (!paymentPolicyId || !returnPolicyId || !fulfillmentPolicyId) {
      
      return NextResponse.json(
        { 
          error: 'ポリシーIDが設定されていません',
          missing: {
            payment: !paymentPolicyId,
            return: !returnPolicyId,
            fulfillment: !fulfillmentPolicyId
          },
          solution: `以下のSQLを実行してください:
          
INSERT INTO ebay_default_policies (policy_type, policy_id, policy_name, account_id) VALUES
('payment', 'YOUR_ID', 'Payment Policy', '${accountId}'),
('return', 'YOUR_ID', 'Return Policy', '${accountId}'),
('fulfillment', 'YOUR_ID', 'Fulfillment Policy', '${accountId}');`
        },
        { status: 400 }
      )
    }

    // ========================================
    // Location Key取得（自動取得対応）
    // ========================================
    let merchantLocationKey = await ensureLocation(accountId, userToken, supabase)

    // 🔥 Location が見つからない場合のみフォールバック処理
    // Note: 'default'や'NARA_WAREHOUSE'などDBに登録されたキーはそのまま使用
    const useInlineLocation = !merchantLocationKey
    if (useInlineLocation) {
      merchantLocationKey = `INLINE_${Date.now()}` // 一時的なキー
    } else {
    }

    // ========================================
    // STEP 0: Item Specifics動的構築（全カテゴリ対応）
    // ========================================
    let aspects: Record<string, string[]> = {}
    let missingRequiredFields: string[] = []

    if (category) {
      
      try {
        const categorySpecificsUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ebay/category-specifics`
        const specificsResponse = await fetch(categorySpecificsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: category })
        })

        if (specificsResponse.ok) {
          const specificsData = await specificsResponse.json()

          // 商品データを取得
          let listingData: any = {}
          if (productId) {
            const { data: product } = await supabase
              .from('products_master')
              .select('listing_data, scraped_data')
              .eq('id', productId)
              .single()

            listingData = product?.listing_data || {}
          }

          // 🔥 汎用マッピングテーブル（優先順位付き）
          const fieldMappings: Record<string, string[]> = {
            'Brand': ['brand', 'manufacturer', 'maker'],
            'Manufacturer': ['manufacturer', 'maker', 'brand'],
            'Color': ['color', 'colour', 'main_color'],
            'Size': ['size', 'size_us', 'size_eu', 'size_uk', 'size_jp'],
            'Material': ['material', 'fabric', 'composition'],
            'Style': ['style', 'design_style'],
            'Pattern': ['pattern', 'design_pattern'],
            'Model': ['model', 'model_number', 'model_name'],
            'Type': ['type', 'product_type', 'item_type'],
            'Country/Region of Manufacture': ['country_of_origin', 'made_in', 'origin_country'],
            'UPC': ['upc', 'upc_code'],
            'EAN': ['ean', 'ean_code'],
            'MPN': ['mpn', 'manufacturer_part_number'],
            'ISBN': ['isbn', 'isbn13', 'isbn10'],
            // トレーディングカード専用
            'Game': ['ebay_game', 'game', 'game_name', 'tcg_name', 'card_game'],
            'Set': ['ebay_set', 'set_name', 'series'],
            'Card Name': ['ebay_card_name', 'card_name', 'character'],
            'Card Number': ['ebay_card_number', 'card_number', 'number'],
            'Grade': ['ebay_grade', 'grade', 'grading'],
            'Language': ['ebay_language', 'language', 'lang'],
            'Features': ['ebay_features', 'features', 'special_features'],
          }

          // 🔥 フォールバック値テーブル
          const fallbackValues: Record<string, string> = {
            'Brand': 'Unbranded',
            'Manufacturer': 'Unknown',
            'Size': 'One Size',
            'Color': 'Multicolor',
            'Material': 'Not Specified',
            'Country/Region of Manufacture': 'Unknown',
            'Game': 'Other TCG',
          }

          // === 必須項目の処理 ===
          const allFields = [...(specificsData.requiredFields || []), ...(specificsData.recommendedFields || [])]
          
          for (const field of allFields) {
            const aspectName = field.name
            let value: string | null = null

            // 1. 直接パラメータから取得
            if (aspectName === 'Brand' && brand) {
              value = brand
            } else if (aspectName === 'Manufacturer' && manufacturer) {
              value = manufacturer
            }

            // 2. マッピングテーブルから検索
            if (!value && fieldMappings[aspectName]) {
              for (const key of fieldMappings[aspectName]) {
                if (listingData[key] && typeof listingData[key] === 'string' && listingData[key].trim()) {
                  value = listingData[key].trim()
                  break
                }
              }
            }

            // 3. 完全一致で検索（ebay_プレフィックス付き）
            if (!value) {
              const ebayKey = `ebay_${aspectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
              if (listingData[ebayKey]) {
                value = listingData[ebayKey]
              }
            }

            // 4. 選択肢がある場合は最初の選択肢を使用
            if (!value && field.options && field.options.length > 0) {
              // "Does Not Apply" や "N/A" があればそれを使用
              const naOption = field.options.find((opt: string) => 
                opt.toLowerCase().includes('not apply') || 
                opt.toLowerCase() === 'n/a' ||
                opt.toLowerCase() === 'none'
              )
              if (naOption) {
                value = naOption
              }
            }

            // 5. フォールバック値を使用
            if (!value && fallbackValues[aspectName]) {
              value = fallbackValues[aspectName]
            }

            // 6. 必須項目なのに値がない場合
            if (!value && field.required) {
              missingRequiredFields.push(aspectName)
            } else if (value) {
              aspects[aspectName] = [value]
            }
          }

        } else {
          // 最低限Brandだけは設定
          if (brand) aspects.Brand = [brand]
        }
      } catch (error) {
        // 最低限Brandだけは設定
        if (brand) aspects.Brand = [brand]
      }
    } else {
      // カテゴリ未指定の場合もBrandは設定
      if (brand) aspects.Brand = [brand]
    }

    // === 必須項目欠損チェック ===
    if (missingRequiredFields.length > 0) {
      return NextResponse.json(
        {
          error: '必須Item Specificsが不足しています',
          missing: missingRequiredFields,
          solution: `以下の項目を商品データ(listing_data)に追加してください: ${missingRequiredFields.join(', ')}`,
          availableAspects: aspects
        },
        { status: 400 }
      )
    }

    // ========================================
    // STEP 1: Inventory Item 作成
    // ========================================
    
    // EU責任者情報の準備
    let responsiblePersons: any[] = []
    
    if (eu_responsible_company_name && eu_responsible_company_name !== 'N/A') {
      const responsiblePerson: any = {
        companyName: eu_responsible_company_name,
        addressLine1: eu_responsible_address_line1,
        city: eu_responsible_city,
        postalCode: eu_responsible_postal_code,
        country: eu_responsible_country,
        types: ['EU_RESPONSIBLE_PERSON']
      }

      if (eu_responsible_address_line2) responsiblePerson.addressLine2 = eu_responsible_address_line2
      if (eu_responsible_state_or_province) responsiblePerson.stateOrProvince = eu_responsible_state_or_province
      if (eu_responsible_email) responsiblePerson.email = eu_responsible_email
      if (eu_responsible_phone) responsiblePerson.phone = eu_responsible_phone
      if (eu_responsible_contact_url) responsiblePerson.contactUrl = eu_responsible_contact_url

      responsiblePersons = [responsiblePerson]
    } else if (manufacturer || brand) {
      // DBから検索
      const euPerson = await euResponsiblePersonService.findResponsiblePerson(
        manufacturer || brand,
        brand
      )

      if (euPerson) {
        const responsiblePerson: any = {
          companyName: euPerson.company_name,
          addressLine1: euPerson.address_line1,
          city: euPerson.city,
          postalCode: euPerson.postal_code,
          country: euPerson.country,
          types: ['EU_RESPONSIBLE_PERSON']
        }

        if (euPerson.address_line2) responsiblePerson.addressLine2 = euPerson.address_line2
        if (euPerson.state_or_province) responsiblePerson.stateOrProvince = euPerson.state_or_province
        if (euPerson.email) responsiblePerson.email = euPerson.email
        if (euPerson.phone) responsiblePerson.phone = euPerson.phone
        if (euPerson.contact_url) responsiblePerson.contactUrl = euPerson.contact_url

        responsiblePersons = [responsiblePerson]
      }
    }

    // 🔥 Conditionマッピング実行
    const mappedCondition = await mapConditionToInventoryFormat(condition, category, supabase)

    // Inventory Item ペイロード
    const inventoryPayload: any = {
      product: {
        title: title,
        description: description || title,
        imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : undefined,
        aspects: Object.keys(aspects).length > 0 ? aspects : undefined
      },
      condition: mappedCondition,
      availability: {
        shipToLocationAvailability: {
          quantity: quantity || 1
        }
      }
    }

    // regulatory追加
    if (responsiblePersons.length > 0) {
      inventoryPayload.product.regulatory = {
        responsiblePersons: responsiblePersons
      }
    }

    // 🔥 指数バックオフ付き再試行ロジック
    let inventoryResponse
    let lastError = null
    const maxRetries = 3
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (attempt > 1) {
        const delayMs = Math.pow(2, attempt - 1) * 1000 // 2秒, 4秒, 8秒
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
      
      inventoryResponse = await fetch(
        `https://api.ebay.com/sell/inventory/v1/inventory_item/${sku}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
            'Content-Language': 'en-US',
            'Accept-Language': 'en-US'
          },
          body: JSON.stringify(inventoryPayload)
        }
      )

      if (inventoryResponse.ok) {
        break
      }
      
      lastError = await inventoryResponse.text()
      
      // エラーID 25001（システムエラー）の場合のみ再試行
      if (lastError.includes('"errorId":25001')) {
        continue
      } else {
        // その他のエラーは即座に失敗
        break
      }
    }

    if (!inventoryResponse!.ok) {
      const errorText = lastError || await inventoryResponse!.text()
      let parsedError: any = {}
      try {
        parsedError = JSON.parse(errorText)
      } catch (e) {
        parsedError = { rawError: errorText }
      }

      
      // 🔥 エラーIDを抽出
      const errorId = parsedError.errors?.[0]?.errorId || 'UNKNOWN'
      const errorMessage = parsedError.errors?.[0]?.message || parsedError.rawError || 'Unknown error'
      
      if (errorId === 2004 || errorId === '2004') {
      }
      
      return NextResponse.json(
        {
          error: 'Inventory Item作成失敗',
          step: 'INVENTORY_ITEM_CREATION',
          status: inventoryResponse!.status,
          errorId: errorId,
          errorMessage: errorMessage,
          details: parsedError,
          usedCondition: mappedCondition,
          attempts: maxRetries,
          solution: errorId === 2004 || errorId === '2004' 
            ? 'OAuthトークンのスコープを確認してください。sell.inventoryが必要です。'
            : '詳細はerrorMessageを参照してください。'
        },
        { status: inventoryResponse!.status }
      )
    }

    // ========================================
    // STEP 2: Offer 作成または取得
    // ========================================

    // 🔥 既存Offerを検索
    let offerId = null

    const getOffersResponse = await fetch(
      `https://api.ebay.com/sell/inventory/v1/offer?sku=${sku}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US',
          'Accept-Language': 'en-US'
        }
      }
    )

    if (getOffersResponse.ok) {
      const offersData = await getOffersResponse.json()
      if (offersData.offers && offersData.offers.length > 0) {
        const existingOfferId = offersData.offers[0].offerId
        
        // 🔥 既存Offerを削除
        const deleteResponse = await fetch(
          `https://api.ebay.com/sell/inventory/v1/offer/${existingOfferId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json',
              'Content-Language': 'en-US',
              'Accept-Language': 'en-US'
            }
          }
        )

        if (deleteResponse.ok || deleteResponse.status === 204) {
        } else {
          const errorText = await deleteResponse.text()
        }
      }
    }

    // Offerがない場合は新規作成
    if (!offerId) {

      const offerPayload: any = {
        sku: sku,
        marketplaceId: marketplace,
        format: 'FIXED_PRICE',
        availableQuantity: quantity || 1,
        categoryId: category || '293',
        listingDescription: description || title,
        listingPolicies: {
          paymentPolicyId: paymentPolicyId,
          returnPolicyId: returnPolicyId,
          fulfillmentPolicyId: fulfillmentPolicyId
        },
        pricingSummary: {
          price: {
            currency: 'USD',
            value: price.toString()
          }
        },
        // 🔥 inventoryLocationKey を使用（merchantLocationKey ではなく）
        merchantLocationKey: merchantLocationKey
      }

      const offerResponse = await fetch(
        'https://api.ebay.com/sell/inventory/v1/offer',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
            'Content-Language': 'en-US',
            'Accept-Language': 'en-US'
          },
          body: JSON.stringify(offerPayload)
        }
      )

      if (!offerResponse.ok) {
        const errorText = await offerResponse.text()
        let parsedError: any = {}
        try {
          parsedError = JSON.parse(errorText)
        } catch (e) {
          parsedError = { rawError: errorText }
        }

        
        // 🔥 エラーIDを抽出
        const errorId = parsedError.errors?.[0]?.errorId || 'UNKNOWN'
        const errorMessage = parsedError.errors?.[0]?.message || parsedError.rawError || 'Unknown error'
        
        if (errorId === 25002 || errorId === '25002') {
        } else if (errorId === 2004 || errorId === '2004') {
        }
        
        return NextResponse.json(
          {
            error: 'Offer作成失敗',
            step: 'OFFER_CREATION',
            status: offerResponse.status,
            errorId: errorId,
            errorMessage: errorMessage,
            details: parsedError,
            usedCondition: mappedCondition,
            usedLocationKey: merchantLocationKey,
            solution: errorId === 25002 || errorId === '25002'
              ? 'eBay Seller Hubで住所を登録し、有効なmerchantLocationKeyを取得してください。'
              : errorId === 2004 || errorId === '2004'
              ? 'OAuthトークンのスコープを確認してください。'
              : '詳細はerrorMessageを参照してください。'
          },
          { status: offerResponse.status }
        )
      }

      const offerData = await offerResponse.json()
      offerId = offerData.offerId

    }

    // ========================================
    // STEP 3: Publish
    // ========================================

    const publishResponse = await fetch(
      `https://api.ebay.com/sell/inventory/v1/offer/${offerId}/publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US',
          'Accept-Language': 'en-US'
        }
      }
    )

    if (!publishResponse.ok) {
      const errorText = await publishResponse.text()
      let parsedError: any = {}
      try {
        parsedError = JSON.parse(errorText)
      } catch (e) {
        parsedError = { rawError: errorText }
      }

      
      // 🔥 エラーIDを抽出
      const errorId = parsedError.errors?.[0]?.errorId || 'UNKNOWN'
      const errorMessage = parsedError.errors?.[0]?.message || parsedError.rawError || 'Unknown error'
      
      return NextResponse.json(
        {
          error: 'Publish失敗',
          step: 'PUBLISH',
          status: publishResponse.status,
          errorId: errorId,
          errorMessage: errorMessage,
          details: parsedError,
          usedCondition: mappedCondition,
          offerId: offerId,
          solution: '詳細はerrorMessageを参照してください。'
        },
        { status: publishResponse.status }
      )
    }

    const publishData = await publishResponse.json()
    const listingId = publishData.listingId

    return NextResponse.json({
      success: true,
      data: {
        listingId: listingId,
        offerId: offerId,
        sku: sku
      },
      policies: {
        payment: paymentPolicyId,
        return: returnPolicyId,
        fulfillment: fulfillmentPolicyId
      },
      usedCondition: mappedCondition,
      hasEUInfo: responsiblePersons.length > 0,
      message: '出品が完了しました'
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '出品に失敗しました' },
      { status: 500 }
    )
  }
}
