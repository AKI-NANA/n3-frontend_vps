/**
 * eBay配送ポリシーをデータベースに同期
 * - RT16～RT29のポリシーのみ対象
 * - すでに存在するポリシーはスキップ
 * - payment_policy_id と return_policy_id を含めて保存
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface PolicyData {
  policyId?: string
  fulfillmentPolicyId?: string
  name: string
  description?: string
  rateTableId?: string | null
  shippingOptions?: any[]
  handlingTime?: {
    value: number
    unit: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const { account, policies, paymentPolicyId, returnPolicyId } = await req.json()

    console.log('📥 [Policy Sync] Starting:', {
      account,
      policiesCount: policies.length,
      paymentPolicyId,
      returnPolicyId
    })

    if (!account || !policies || !Array.isArray(policies)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 既存のポリシーIDを取得
    const { data: existingPolicies } = await supabase
      .from('ebay_shipping_policies')
      .select('policy_id')
      .eq('account_id', account)

    const existingIds = new Set(existingPolicies?.map(p => p.policy_id) || [])

    let successCount = 0
    let skippedCount = 0
    let failedCount = 0

    for (const policy of policies as PolicyData[]) {
      // Policy IDを取得（複数フィールドに対応）
      const policyId = policy.policyId || policy.fulfillmentPolicyId
      
      if (!policyId) {
        console.error(`⚠️  Policy ID not found for: ${policy.name}`)
        failedCount++
        continue
      }
      
      // すでに存在する場合はスキップ
      if (existingIds.has(policyId)) {
        console.log(`⏭️  Skip (already exists): ${policy.name}`)
        skippedCount++
        continue
      }

      try {
        // Rate Table番号を抽出（複数パターンに対応）
        let rtNumber = null
        
        // パターン1: rateTableIdから抽出 (RT_Express_1 → 1)
        if (policy.rateTableId) {
          const match1 = policy.rateTableId.match(/RT_Express_(\d+)/)
          if (match1) rtNumber = parseInt(match1[1])
        }
        
        // パターン2: ポリシー名から抽出 (RT16_P500 → 16, RT29 → 29)
        if (!rtNumber && policy.name) {
          const match2 = policy.name.match(/RT(\d+)/)
          if (match2) rtNumber = parseInt(match2[1])
        }
        
        console.log(`🔢 ${policy.name}: Policy ID = ${policyId}, RT Number = ${rtNumber}, Rate Table ID = ${policy.rateTableId}`)

        // 重量を抽出（RT16_P500 → 500）
        const weightMatch = policy.name.match(/P(\d+)/)
        const weightGrams = weightMatch ? parseInt(weightMatch[1]) : null

        // Handling Time
        const handlingDays = policy.handlingTime?.value || 3

        // Shipping Services
        const domesticService = policy.shippingOptions?.find(
          opt => opt.optionType === 'DOMESTIC'
        )?.shippingServices?.[0]?.shippingServiceCode || null

        const intlService = policy.shippingOptions?.find(
          opt => opt.optionType === 'INTERNATIONAL'
        )?.shippingServices?.[0]?.shippingServiceCode || null

        const { error: insertError } = await supabase
          .from('ebay_shipping_policies')
          .insert({
            account_id: account,
            policy_id: policyId,
            policy_name: policy.name,
            policy_description: policy.description || null,
            rate_table_id: policy.rateTableId || null,
            rate_table_number: rtNumber,
            weight_range_min: weightGrams ? weightGrams - 100 : null,
            weight_range_max: weightGrams,
            handling_time_days: handlingDays,
            domestic_service_code: domesticService,
            international_service_code: intlService,
            payment_policy_id: paymentPolicyId,
            return_policy_id: returnPolicyId,
            is_active: true
          })

        if (insertError) {
          console.error(`❌ Insert failed for ${policy.name}:`, insertError.message)
          failedCount++
        } else {
          console.log(`✅ Inserted: ${policy.name}`)
          successCount++
        }
      } catch (err) {
        console.error(`❌ Error processing ${policy.name}:`, err)
        failedCount++
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        success: successCount,
        skipped: skippedCount,
        failed: failedCount
      }
    })

  } catch (error: any) {
    console.error('❌ Fatal error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
