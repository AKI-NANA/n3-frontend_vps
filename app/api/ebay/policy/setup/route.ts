/**
 * eBay Policy自動設定API
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // トークン取得
    const { data: tokenData } = await supabase
      .from('ebay_tokens')
      .select('access_token')
      .eq('account', 'mjt')
      .eq('is_active', true)
      .single()
    
    const userToken = tokenData?.access_token
    if (!userToken) {
      return NextResponse.json({ error: 'TOKEN missing' }, { status: 400 })
    }

    const body = await req.json()
    const { accountId = 'main_account', marketplace = 'EBAY_US' } = body

    console.log('🔧 Setup starting:', { accountId, marketplace })

    const endpoints = {
      payment: 'https://api.ebay.com/sell/account/v1/payment_policy',
      return: 'https://api.ebay.com/sell/account/v1/return_policy',
      fulfillment: 'https://api.ebay.com/sell/account/v1/fulfillment_policy'
    }

    const [paymentRes, returnRes, fulfillmentRes] = await Promise.allSettled([
      fetch(endpoints.payment + '?marketplace_id=EBAY_US', { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }}),
      fetch(endpoints.return + '?marketplace_id=EBAY_US', { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }}),
      fetch(endpoints.fulfillment + '?marketplace_id=EBAY_US', { headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }})
    ])

    const policies = { payment: null as any, return: null as any, fulfillment: null as any }

    if (paymentRes.status === 'fulfilled' && paymentRes.value.ok) {
      const data = await paymentRes.value.json()
      policies.payment = data.paymentPolicies?.[0]
    }
    if (returnRes.status === 'fulfilled' && returnRes.value.ok) {
      const data = await returnRes.value.json()
      policies.return = data.returnPolicies?.[0]
    }
    if (fulfillmentRes.status === 'fulfilled' && fulfillmentRes.value.ok) {
      const data = await fulfillmentRes.value.json()
      policies.fulfillment = data.fulfillmentPolicies?.[0]
    }

    const missing = []
    if (!policies.payment) missing.push('payment')
    if (!policies.return) missing.push('return')
    if (!policies.fulfillment) missing.push('fulfillment')

    if (missing.length === 3) {
      return NextResponse.json({ error: 'No policies found' }, { status: 400 })
    }

    // DBに保存
    const saved = []

    if (policies.payment) {
      await supabase.from('ebay_default_policies').upsert({
        policy_type: 'payment',
        policy_id: policies.payment.paymentPolicyId,
        policy_name: policies.payment.name,
        account_id: accountId,
        marketplace: marketplace,
        is_active: true
      }, { onConflict: 'policy_type,account_id,marketplace' })
      saved.push({ type: 'payment', id: policies.payment.paymentPolicyId, name: policies.payment.name })
    }

    if (policies.return) {
      await supabase.from('ebay_default_policies').upsert({
        policy_type: 'return',
        policy_id: policies.return.returnPolicyId,
        policy_name: policies.return.name,
        account_id: accountId,
        marketplace: marketplace,
        is_active: true
      }, { onConflict: 'policy_type,account_id,marketplace' })
      saved.push({ type: 'return', id: policies.return.returnPolicyId, name: policies.return.name })
    }

    if (policies.fulfillment) {
      await supabase.from('ebay_default_policies').upsert({
        policy_type: 'fulfillment',
        policy_id: policies.fulfillment.fulfillmentPolicyId,
        policy_name: policies.fulfillment.name,
        account_id: accountId,
        marketplace: marketplace,
        is_active: true
      }, { onConflict: 'policy_type,account_id,marketplace' })
      saved.push({ type: 'fulfillment', id: policies.fulfillment.fulfillmentPolicyId, name: policies.fulfillment.name })
    }

    return NextResponse.json({ success: true, saved, missing })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
