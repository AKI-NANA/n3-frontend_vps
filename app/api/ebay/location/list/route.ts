/**
 * eBay Location取得API
 * アカウントの発送元住所（merchantLocationKey）を取得してDBに保存
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
  const accountUpper = accountId.toUpperCase()
  const clientId = process.env[`EBAY_CLIENT_ID_${accountUpper}`] || process.env.EBAY_CLIENT_ID
  const clientSecret = process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] || process.env.EBAY_CLIENT_SECRET
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
    const accountId = searchParams.get('account') || 'mjt'

    const token = await getValidToken(accountId)
    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 401 })
    }

    console.log('🔍 [Location] 取得開始:', accountId)

    const response = await fetch('https://api.ebay.com/sell/inventory/v1/location', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Language': 'en-US',
        'Accept-Language': 'en-US'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Location] 取得失敗:', errorText)
      return NextResponse.json({ error: errorText }, { status: response.status })
    }

    const data = await response.json()
    console.log('✅ [Location] 取得成功:', data)

    // DBに保存
    const supabase = await createClient()
    
    if (data.locations && data.locations.length > 0) {
      // 各Locationを保存
      for (const location of data.locations) {
        const { error } = await supabase
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

        if (error) {
          console.error('❌ [Location] DB保存失敗:', error)
        } else {
          console.log('✅ [Location] DB保存:', location.merchantLocationKey)
        }
      }
    }

    return NextResponse.json({
      success: true,
      accountId,
      locations: data.locations || [],
      total: data.total || 0
    })

  } catch (error: any) {
    console.error('❌ [Location] エラー:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
