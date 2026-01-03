import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getEbayAccessToken } from '@/lib/ebay/token';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const EBAY_API_URL = 'https://api.ebay.com/sell/account/v1/payment_policy';
const EBAY_MARKETPLACE_ID = 'EBAY_US';

interface EbayPolicy {
  paymentPolicyId: string;
  name: string;
}

export async function POST(request: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await request.json().catch(() => ({}));
    const account = body.account || 'green';

    console.log(`[${account}] eBay Payment Policy取得開始...`);

    const ebayToken = await getEbayAccessToken(account as 'green' | 'mjt');

    const apiUrl = `${EBAY_API_URL}?marketplace_id=${EBAY_MARKETPLACE_ID}`;
    const ebayResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${ebayToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!ebayResponse.ok) {
      const errorText = await ebayResponse.text();
      throw new Error(`eBay API Error: ${ebayResponse.status} - ${errorText}`);
    }

    const ebayData = await ebayResponse.json();
    const ebayPolicies: EbayPolicy[] = ebayData.paymentPolicies || [];

    console.log(`[${account}] eBayから ${ebayPolicies.length} 件のPayment Policyを取得`);

    const policyMap = new Map<string, string>();
    ebayPolicies.forEach((policy) => {
      policyMap.set(policy.name, policy.paymentPolicyId);
    });

    let successCount = 0;
    let errorCount = 0;
    let newPolicies = 0;
    const errors: string[] = [];

    const { data: dbPolicies, error: fetchError } = await supabase
      .from('payment_policies')
      .select('id, policy_name, ebay_policy_id');

    if (fetchError) {
      throw new Error(`DB取得エラー: ${fetchError.message}`);
    }

    console.log(`[${account}] データベースから ${dbPolicies?.length || 0} 件のPayment Policyを取得`);

    for (const dbPolicy of dbPolicies || []) {
      const ebayPolicyId = policyMap.get(dbPolicy.policy_name);

      if (ebayPolicyId) {
        const isNew = !dbPolicy.ebay_policy_id;

        const { error: updateError } = await supabase
          .from('payment_policies')
          .update({ ebay_policy_id: ebayPolicyId })
          .eq('id', dbPolicy.id);

        if (updateError) {
          console.error(`更新エラー (${dbPolicy.policy_name}):`, updateError);
          errors.push(`${dbPolicy.policy_name}: ${updateError.message}`);
          errorCount++;
        } else {
          successCount++;
          if (isNew) {
            newPolicies++;
          }
          console.log(`✓ [${account}] ${dbPolicy.policy_name} → ${ebayPolicyId}`);
        }
      } else {
        console.log(`⚠ [${account}] ${dbPolicy.policy_name}: eBayに存在しません`);
      }
    }

    console.log(`[${account}] Payment Policy完了: 成功=${successCount}, 失敗=${errorCount}, 新規=${newPolicies}`);

    return NextResponse.json({
      success: true,
      account,
      successCount,
      errorCount,
      newPolicies,
      total: dbPolicies?.length || 0,
      ebayTotal: ebayPolicies.length,
      errors: errors.slice(0, 20),
    });

  } catch (error) {
    console.error('Payment Policy同期エラー:', error);
    return NextResponse.json(
      {
        error: 'Payment Policy同期に失敗しました',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
