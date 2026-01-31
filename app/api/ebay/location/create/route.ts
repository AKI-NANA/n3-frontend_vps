/**
 * eBay Location作成API
 * 奈良県の発送元住所を登録
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
  const clientId = process.env.EBAY_CLIENT_ID_GREEN || process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET_GREEN || process.env.EBAY_CLIENT_SECRET
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
    const { 
      accountId = 'green',
      name,
      addressLine1,
      addressLine2,
      city,
      stateOrProvince,
      postalCode,
      country = 'JP'
    } = body

    // ユニークなmerchantLocationKeyを生成（タイムスタンプ使用）
    const merchantLocationKey = `NARA_${Date.now()}`

    // 🔥 eBay APIの正確な仕様に合わせたペイロード
    const locationPayload = {
      location: {
        address: {
          addressLine1: addressLine1 || '160 Kasugano-cho',
          addressLine2: addressLine2,
          city: city || 'Nara',
          stateOrProvince: stateOrProvince || 'Nara',
          postalCode: postalCode || '630-8212',
          country: country
        }
      },
      name: name || 'Nara Warehouse',
      merchantLocationStatus: 'ENABLED',
      locationTypes: ['WAREHOUSE']
    }

    const token = await getValidToken(accountId)
    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 401 })
    }

    console.log('📍 [Location Create] 作成開始:', accountId, merchantLocationKey)
    console.log('📦 [Payload]:', JSON.stringify(locationPayload, null, 2))

    // 🔥 PUTメソッドでmerchantLocationKeyをURLに含める
    const response = await fetch(`https://api.ebay.com/sell/inventory/v1/location/${merchantLocationKey}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US',
        'Accept-Language': 'en-US'
      },
      body: JSON.stringify(locationPayload)
    })

    const responseText = await response.text()
    console.log('📊 [Response Status]:', response.status)
    console.log('📊 [Response Body]:', responseText)

    if (!response.ok) {
      let parsedError: any = {}
      try {
        parsedError = JSON.parse(responseText)
      } catch (e) {
        parsedError = { rawError: responseText }
      }

      console.error('❌ [Location Create] 作成失敗')
      console.error('🚨 Error Details:', JSON.stringify(parsedError, null, 2))
      
      const errorId = parsedError.errors?.[0]?.errorId || 'UNKNOWN'
      const errorMessage = parsedError.errors?.[0]?.message || parsedError.rawError || 'Unknown error'
      
      if (errorId === 2004 || errorId === '2004') {
        console.error('🔥 致命的な認証/権限エラー (Error ID: 2004)')
        console.error('🔴 原因: greenアカウントがInventory APIを使用する権限を持っていない可能性')
        console.error('🛠️ 解決策:')
        console.error('  1. eBay Developer Portalでアプリのスコープに"sell.inventory"が含まれているか確認')
        console.error('  2. OAuthトークンを再発行')
        console.error('  3. eBay Seller Hubで手動登録: https://www.ebay.com/sh/prf/address')
      }

      return NextResponse.json({ 
        error: errorMessage,
        errorId: errorId,
        details: parsedError,
        solution: errorId === 2004 || errorId === '2004'
          ? 'API経由でのLocation作成は権限不足です。eBay Seller Hubで手動登録してください。'
          : '詳細はerrorMessageを参照してください。'
      }, { status: response.status })
    }

    // PUTは204 No Contentを返すことがある
    let data: any = { merchantLocationKey }
    if (response.status !== 204 && responseText) {
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.warn('⚠️ ResponseはJSONではありません')
      }
    }
    
    console.log('✅ [Location Create] 作成成功:', merchantLocationKey)

    // DBに保存
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('ebay_locations')
      .upsert({
        account_id: accountId,
        merchant_location_key: merchantLocationKey,
        location_name: locationPayload.name,
        location_type: 'WAREHOUSE',
        address: locationPayload.location.address,
        location_data: data,
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'account_id,merchant_location_key'
      })

    if (error) {
      console.error('❌ [Location Create] DB保存失敗:', error)
    } else {
      console.log('✅ [Location Create] DB保存成功:', merchantLocationKey)
    }

    return NextResponse.json({
      success: true,
      accountId,
      merchantLocationKey: merchantLocationKey,
      name: locationPayload.name,
      message: 'Location作成完了。.env.localのEBAY_LOCATION_KEYをこの値に更新してください。'
    })

  } catch (error: any) {
    console.error('❌ [Location Create] エラー:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
