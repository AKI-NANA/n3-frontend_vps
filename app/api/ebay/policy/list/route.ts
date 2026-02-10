/**
 * eBay Policy取得API - 自動トークン更新対応
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getValidToken(accountName: string = 'mjt') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ebay_tokens')
    .select('*')
    .eq('account', accountName)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    console.error('❌ Token not found:', accountName)
    return null
  }

  // 期限チェック：30分以内に切れる場合は更新
  const expiresAt = new Date(data.expires_at)
  const now = new Date()
  const minutesRemaining = (expiresAt.getTime() - now.getTime()) / 1000 / 60

  if (minutesRemaining > 30) {
    console.log(`✅ Token valid for ${Math.floor(minutesRemaining)} minutes`)
    return data.access_token
  }

  // トークンを更新
  console.log('🔄 Token expiring soon, refreshing...')
  
  const clientId = process.env.EBAY_CLIENT_ID_MJT || process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET_MJT || process.env.EBAY_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    console.error('❌ Client credentials missing')
    return null
  }

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

  if (!response.ok) {
    console.error('❌ Token refresh failed')
    return null
  }

  const tokenData = await response.json()
  const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

  // DBを更新
  await supabase
    .from('ebay_tokens')
    .update({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || data.refresh_token,
      expires_at: newExpiresAt,
      updated_at: new Date().toISOString()
    })
    .eq('account', accountName)

  console.log('✅ Token refreshed successfully')
  return tokenData.access_token
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const accountName = searchParams.get('account') || 'mjt'

    console.log('🔍 [Policy API] Starting:', { type, accountName })

    const userToken = await getValidToken(accountName)

    if (!userToken) {
      return NextResponse.json(
        { error: 'Failed to get valid token' },
        { status: 400 }
      )
    }

    const endpoints = {
      payment: 'https://api.ebay.com/sell/account/v1/payment_policy',
      return: 'https://api.ebay.com/sell/account/v1/return_policy',
      fulfillment: 'https://api.ebay.com/sell/account/v1/fulfillment_policy'
    }

    if (type && endpoints[type as keyof typeof endpoints]) {
      const endpoint = endpoints[type as keyof typeof endpoints]
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        return NextResponse.json({ error: errorText }, { status: response.status })
      }

      return NextResponse.json(await response.json())
    }

    const [paymentRes, returnRes, fulfillmentRes] = await Promise.allSettled([
      fetch(endpoints.payment + '?marketplace_id=EBAY_US&limit=200', { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }}),
      fetch(endpoints.return + '?marketplace_id=EBAY_US&limit=200', { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }}),
      fetch(endpoints.fulfillment + '?marketplace_id=EBAY_US&limit=200', { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }})
    ])

    const result: any = { payment: [], return: [], fulfillment: [], errors: [] }

    // Payment Policies - ページネーション対応
    if (paymentRes.status === 'fulfilled' && paymentRes.value.ok) {
      let data = await paymentRes.value.json()
      result.payment = data.paymentPolicies || []
      
      // 次のページを取得
      while (data.next) {
        const nextRes = await fetch(data.next, { 
          headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }
        })
        if (nextRes.ok) {
          data = await nextRes.json()
          result.payment.push(...(data.paymentPolicies || []))
        } else {
          break
        }
      }
      console.log('✅ Payment policies:', result.payment.length)
    } else {
      const error = paymentRes.status === 'fulfilled' ? await paymentRes.value.text() : (paymentRes as any).reason
      result.errors.push({ type: 'payment', error })
      console.error('❌ Payment error:', error)
    }

    // Return Policies - ページネーション対応
    if (returnRes.status === 'fulfilled' && returnRes.value.ok) {
      let data = await returnRes.value.json()
      result.return = data.returnPolicies || []
      
      while (data.next) {
        const nextRes = await fetch(data.next, { 
          headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }
        })
        if (nextRes.ok) {
          data = await nextRes.json()
          result.return.push(...(data.returnPolicies || []))
        } else {
          break
        }
      }
      console.log('✅ Return policies:', result.return.length)
    } else {
      const error = returnRes.status === 'fulfilled' ? await returnRes.value.text() : (returnRes as any).reason
      result.errors.push({ type: 'return', error })
      console.error('❌ Return error:', error)
    }

    // Fulfillment Policies - ページネーション対応
    if (fulfillmentRes.status === 'fulfilled' && fulfillmentRes.value.ok) {
      let data = await fulfillmentRes.value.json()
      result.fulfillment = data.fulfillmentPolicies || []
      console.log('📊 [Pagination] First page:', result.fulfillment.length, 'policies')
      console.log('📊 [Pagination] Has next?', !!data.next)
      if (data.next) {
        console.log('📊 [Pagination] Next URL:', data.next)
      }
      
      let pageCount = 1
      while (data.next) {
        pageCount++
        console.log(`📊 [Pagination] Fetching page ${pageCount}...`)
        const nextRes = await fetch(data.next, { 
          headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }
        })
        if (nextRes.ok) {
          data = await nextRes.json()
          const newPolicies = data.fulfillmentPolicies || []
          result.fulfillment.push(...newPolicies)
          console.log(`✅ Page ${pageCount}: +${newPolicies.length} policies (total: ${result.fulfillment.length})`)
        } else {
          console.error(`❌ Page ${pageCount} failed:`, nextRes.status)
          break
        }
      }
      console.log('✅ Fulfillment policies: ', result.fulfillment.length, `(${pageCount} pages)`)
    } else {
      const error = fulfillmentRes.status === 'fulfilled' ? await fulfillmentRes.value.text() : (fulfillmentRes as any).reason
      result.errors.push({ type: 'fulfillment', error })
      console.error('❌ Fulfillment error:', error)
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: result.payment.length + result.return.length + result.fulfillment.length,
        payment: result.payment.length,
        return: result.return.length,
        fulfillment: result.fulfillment.length,
        hasErrors: result.errors.length > 0
      },
      policies: result
    })

  } catch (error: any) {
    console.error('❌ Fatal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
