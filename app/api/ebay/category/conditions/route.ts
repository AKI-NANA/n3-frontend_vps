/**
 * eBay カテゴリ別有効Condition取得API
 * カテゴリごとに使用可能なConditionをeBay APIから取得してDBに保存
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
  const clientId = process.env.EBAY_CLIENT_ID_MJT || process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET_MJT || process.env.EBAY_CLIENT_SECRET
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const accountId = searchParams.get('account') || 'mjt'

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId required' }, { status: 400 })
    }

    const token = await getValidToken(accountId)
    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 401 })
    }

    console.log('🔍 [Category Conditions] 取得開始:', categoryId)

    // 🔥 方法1: Trading API - GetCategoryFeatures (最も確実)
    const tradingApiUrl = 'https://api.ebay.com/ws/api.dll'
    const tradingPayload = `<?xml version="1.0" encoding="utf-8"?>
<GetCategoryFeaturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${token}</eBayAuthToken>
  </RequesterCredentials>
  <CategoryID>${categoryId}</CategoryID>
  <DetailLevel>ReturnAll</DetailLevel>
  <FeatureID>ConditionValues</FeatureID>
  <ViewAllNodes>true</ViewAllNodes>
</GetCategoryFeaturesRequest>`

    console.log('📤 [Trading API] GetCategoryFeatures リクエスト送信...')

    const tradingResponse = await fetch(tradingApiUrl, {
      method: 'POST',
      headers: {
        'X-EBAY-API-SITEID': '0', // US
        'X-EBAY-API-COMPATIBILITY-LEVEL': '1193',
        'X-EBAY-API-CALL-NAME': 'GetCategoryFeatures',
        'Content-Type': 'text/xml;charset=utf-8'
      },
      body: tradingPayload
    })

    if (!tradingResponse.ok) {
      const errorText = await tradingResponse.text()
      console.error('❌ [Trading API] エラー:', tradingResponse.status, errorText)
    } else {
      const xmlText = await tradingResponse.text()
      console.log('✅ [Trading API] レスポンス受信')
      console.log('📄 [XML Raw]:', xmlText.substring(0, 2000)) // 最初の2000文字

      // XMLからCondition情報を抽出
      const conditionMatches = xmlText.matchAll(/<Condition>[\s\S]*?<ID>(\d+)<\/ID>[\s\S]*?<DisplayName>(.*?)<\/DisplayName>[\s\S]*?<\/Condition>/g)
      const conditions = []
      
      for (const match of conditionMatches) {
        conditions.push({
          valueId: match[1],
          value: match[2]
        })
      }

      console.log('✅ [Condition抽出結果]:', conditions)

      if (conditions.length > 0) {
        // DBに保存
        const supabase = await createClient()
        const { error } = await supabase
          .from('ebay_category_conditions')
          .upsert({
            category_id: categoryId,
            conditions: conditions,
            raw_data: { source: 'trading_api', xml: xmlText },
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'category_id'
          })

        if (error) {
          console.error('❌ [DB保存失敗]:', error)
        } else {
          console.log('✅ [DB保存完了]')
        }

        return NextResponse.json({
          success: true,
          categoryId,
          conditions,
          total: conditions.length,
          source: 'trading_api'
        })
      }
    }

    // 🔥 方法2: Taxonomy API (フォールバック)
    console.log('🔄 [Taxonomy API] リトライ...')
    
    const taxonomyUrl = `https://api.ebay.com/commerce/taxonomy/v1/category_tree/0/get_item_aspects_for_category?category_id=${categoryId}`
    
    const taxonomyResponse = await fetch(taxonomyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'en-US'
      }
    })

    if (!taxonomyResponse.ok) {
      const errorText = await taxonomyResponse.text()
      console.error('❌ [Taxonomy API] エラー:', taxonomyResponse.status, errorText)
      
      return NextResponse.json({
        error: 'Condition情報取得失敗',
        details: errorText,
        categoryId,
        conditions: [],
        total: 0
      }, { status: taxonomyResponse.status })
    }

    const taxonomyData = await taxonomyResponse.json()
    console.log('✅ [Taxonomy API] レスポンス:', JSON.stringify(taxonomyData, null, 2))

    // Condition抽出
    const conditionAspect = taxonomyData.aspects?.find((aspect: any) => 
      aspect.localizedAspectName?.toLowerCase() === 'condition'
    )

    const conditions = conditionAspect?.aspectValues?.map((value: any) => ({
      value: value.localizedValue,
      valueId: value.localizedValue.toUpperCase().replace(/ /g, '_')
    })) || []

    console.log('✅ [Taxonomy Condition抽出]:', conditions)

    // DBに保存
    if (conditions.length > 0) {
      const supabase = await createClient()
      const { error } = await supabase
        .from('ebay_category_conditions')
        .upsert({
          category_id: categoryId,
          conditions: conditions,
          raw_data: taxonomyData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'category_id'
        })

      if (error) {
        console.error('❌ [DB保存失敗]:', error)
      } else {
        console.log('✅ [DB保存完了]')
      }
    }

    return NextResponse.json({
      success: true,
      categoryId,
      conditions,
      total: conditions.length,
      source: 'taxonomy_api'
    })

  } catch (error: any) {
    console.error('❌ [Category Conditions] エラー:', error)
    return NextResponse.json({ 
      error: error.message,
      categoryId: new URL(request.url).searchParams.get('categoryId'),
      conditions: [],
      total: 0
    }, { status: 500 })
  }
}
