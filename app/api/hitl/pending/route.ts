// app/api/hitl/pending/route.ts
// N3 Empire OS V8 Phase 2 - 承認待ち一覧API

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tenantId = searchParams.get('tenant_id') || '0';
  const actionType = searchParams.get('action_type');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  
  try {
    let query = supabase
      .from('user_actions')
      .select('*')
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('requested_at', { ascending: false })
      .limit(limit);
    
    if (tenantId !== '0') query = query.eq('tenant_id', tenantId);
    if (actionType) query = query.eq('action_type', actionType);
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: data || [], count: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action_codes, decision, decided_by, reason } = body;
    
    if (!action_codes?.length || !['approved', 'rejected'].includes(decision)) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
    
    const results: { action_code: string; success: boolean; error?: string }[] = [];
    
    for (const actionCode of action_codes) {
      const { error } = await supabase
        .from('user_actions')
        .update({
          status: decision,
          decided_at: new Date().toISOString(),
          decided_by: decided_by || 'batch_api',
          decision,
          decision_reason: reason,
        })
        .eq('action_code', actionCode)
        .eq('status', 'pending');
      
      results.push({ action_code: actionCode, success: !error, error: error?.message });
    }
    
    return NextResponse.json({
      success: true,
      processed: results.length,
      success_count: results.filter(r => r.success).length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
