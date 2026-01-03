/**
 * eBay デバッグAPI - ポリシー設定状況確認
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('account') || 'mjt'
    const marketplace = searchParams.get('marketplace') || 'EBAY_US'

    const supabase = await createClient()

    // 1. ebay_default_policies テーブルを確認
    const { data: policies, error: policiesError } = await supabase
      .from('ebay_default_policies')
      .select('*')
      .eq('account_id', accountId)
      .eq('marketplace', marketplace)

    // 2. ebay_tokens テーブルを確認
    const { data: token, error: tokenError } = await supabase
      .from('ebay_tokens')
      .select('account, is_active, expires_at, updated_at')
      .eq('account', accountId)
      .single()

    // 3. ebay_locations テーブルを確認
    const { data: locations, error: locationsError } = await supabase
      .from('ebay_locations')
      .select('merchant_location_key, location_name, is_active')
      .eq('account_id', accountId)

    // 4. 固定ポリシー設定を確認
    const FIXED_POLICIES: Record<string, Record<string, { return?: string; payment?: string; fulfillment?: string }>> = {
      mjt: {
        EBAY_US: { return: '251686527012' },
        EBAY_UK: { return: '251686527012' },
        EBAY_DE: { return: '251686527012' },
        EBAY_AU: { return: '251686527012' },
      },
      green: {
        EBAY_US: {},
        EBAY_UK: {},
        EBAY_DE: {},
        EBAY_AU: {},
      }
    }

    const fixedPolicy = FIXED_POLICIES[accountId]?.[marketplace] || {}

    // 5. 環境変数を確認（値は伏せる）
    const envPolicies = {
      payment: !!process.env.EBAY_PAYMENT_POLICY_ID,
      return: !!process.env.EBAY_RETURN_POLICY_ID,
      fulfillment: !!process.env.EBAY_FULFILLMENT_POLICY_ID,
      location: !!process.env.EBAY_LOCATION_KEY,
    }

    // 6. 最終的に使用されるポリシーを判定
    const dbPayment = policies?.find(p => p.policy_type === 'payment')
    const dbReturn = policies?.find(p => p.policy_type === 'return')
    const dbFulfillment = policies?.find(p => p.policy_type === 'fulfillment')

    const effectivePolicies = {
      payment: {
        source: dbPayment ? 'DB' : envPolicies.payment ? 'ENV' : 'MISSING',
        id: dbPayment?.policy_id || (envPolicies.payment ? '[ENV]' : null),
        name: dbPayment?.policy_name || null,
      },
      return: {
        source: dbReturn ? 'DB' : fixedPolicy.return ? 'FIXED' : envPolicies.return ? 'ENV' : 'MISSING',
        id: dbReturn?.policy_id || fixedPolicy.return || (envPolicies.return ? '[ENV]' : null),
        name: dbReturn?.policy_name || (fixedPolicy.return ? 'Return Accepted 30days' : null),
      },
      fulfillment: {
        source: dbFulfillment ? 'DB' : envPolicies.fulfillment ? 'ENV' : 'MISSING',
        id: dbFulfillment?.policy_id || (envPolicies.fulfillment ? '[ENV]' : null),
        name: dbFulfillment?.policy_name || null,
      },
    }

    // 7. 問題点を特定
    const issues: string[] = []
    
    if (effectivePolicies.payment.source === 'MISSING') {
      issues.push('❌ Payment Policy IDが設定されていません')
    }
    if (effectivePolicies.return.source === 'MISSING') {
      issues.push('❌ Return Policy IDが設定されていません')
    }
    if (effectivePolicies.fulfillment.source === 'MISSING') {
      issues.push('❌ Fulfillment Policy IDが設定されていません')
    }
    if (!token) {
      issues.push('❌ eBayトークンが見つかりません')
    } else if (token.expires_at && new Date(token.expires_at) < new Date()) {
      issues.push('❌ eBayトークンが期限切れです')
    }
    if (!locations || locations.length === 0) {
      issues.push('⚠️ Location情報が登録されていません（出品時に自動取得を試みます）')
    }

    // 8. 解決策を提示
    let solution = ''
    if (issues.length > 0) {
      solution = `
【解決方法】

1. ポリシーIDを取得:
   GET http://localhost:3000/api/ebay/list-policies?account=${accountId}
   GET http://localhost:3000/api/ebay/policy?type=payment&account=${accountId}
   GET http://localhost:3000/api/ebay/policy?type=return&account=${accountId}

2. ebay_default_policiesテーブルにINSERT:
   INSERT INTO ebay_default_policies (account_id, marketplace, policy_type, policy_id, policy_name, is_active) VALUES
   ('${accountId}', '${marketplace}', 'payment', 'YOUR_PAYMENT_ID', 'Payment Policy', true),
   ('${accountId}', '${marketplace}', 'return', 'YOUR_RETURN_ID', 'Return Policy', true),
   ('${accountId}', '${marketplace}', 'fulfillment', 'YOUR_FULFILLMENT_ID', 'Shipping Policy', true);

3. トークンが期限切れの場合:
   /tools/api-test ページでトークンを再取得してください
`
    }

    return NextResponse.json({
      success: true,
      account: accountId,
      marketplace: marketplace,
      
      // DB内のポリシー
      dbPolicies: policies || [],
      
      // 固定ポリシー
      fixedPolicies: fixedPolicy,
      
      // 環境変数（有無のみ）
      envPolicies: envPolicies,
      
      // 最終的に使用されるポリシー
      effectivePolicies: effectivePolicies,
      
      // トークン状態
      token: token ? {
        account: token.account,
        is_active: token.is_active,
        expires_at: token.expires_at,
        isExpired: token.expires_at ? new Date(token.expires_at) < new Date() : true,
        updated_at: token.updated_at,
      } : null,
      
      // Location情報
      locations: locations || [],
      
      // 問題点
      issues: issues,
      issueCount: issues.length,
      
      // 解決策
      solution: issues.length > 0 ? solution : null,
      
      // 出品可能かどうか
      canList: issues.filter(i => i.startsWith('❌')).length === 0,
    })

  } catch (error: any) {
    console.error('Debug API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
