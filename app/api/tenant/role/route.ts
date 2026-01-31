// app/api/tenant/role/route.ts
/**
 * 👤 Tenant Role API
 * 
 * Phase 4A: Tenant Layer
 * 
 * GET - ユーザーの組織内ロール取得
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Supabase Client
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// 現在のユーザーIDを取得
async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('n3_session');
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionCookie.value);
    return session.userId || null;
  } catch {
    return null;
  }
}

// ============================================================
// GET - ロール取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'organizationId is required' },
        { status: 400 }
      );
    }
    
    const userId = await getCurrentUserId();
    
    // デモモード
    if (!userId || organizationId === 'demo-org-001') {
      return NextResponse.json({
        success: true,
        role: 'admin',
      });
    }
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .single();
    
    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Not a member of this organization' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      role: data.role,
    });
    
  } catch (error) {
    console.error('[Role API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
