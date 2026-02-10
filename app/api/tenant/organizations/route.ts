// app/api/tenant/organizations/route.ts
/**
 * 🏢 Tenant Organizations API
 * 
 * Phase 4A: Tenant Layer
 * 
 * GET - ユーザーの組織一覧取得
 * POST - 新規組織作成
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

// 現在のユーザーIDを取得（認証システムに依存）
async function getCurrentUserId(): Promise<string | null> {
  // 実際の実装では認証システムからユーザーIDを取得
  // ここではシンプルなcookieベースの例
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
// GET - ユーザーの組織一覧取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    // 認証がない場合でもデモ用にダミーデータを返す
    if (!userId) {
      // デモモード: デフォルト組織を返す
      return NextResponse.json({
        success: true,
        organizations: [
          {
            id: 'demo-org-001',
            name: 'Demo Organization',
            slug: 'demo-org',
            plan: 'free',
            settings: {},
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      });
    }
    
    const supabase = getSupabaseClient();
    
    // ユーザーが所属する組織を取得
    const { data: members, error: memberError } = await supabase
      .from('organization_members')
      .select(`
        organization_id,
        role,
        organizations (
          id,
          name,
          slug,
          plan,
          plan_expires_at,
          settings,
          metadata,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .not('accepted_at', 'is', null);
    
    if (memberError) {
      // テーブルが存在しない場合はデモデータを返す
      if (memberError.code === '42P01') {
        return NextResponse.json({
          success: true,
          organizations: [
            {
              id: 'demo-org-001',
              name: 'Demo Organization',
              slug: 'demo-org',
              plan: 'free',
              settings: {},
              metadata: {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        });
      }
      
      console.error('[Tenant API] Member fetch error:', memberError);
      return NextResponse.json(
        { success: false, error: memberError.message },
        { status: 500 }
      );
    }
    
    const organizations = (members || []).map((m: any) => ({
      id: m.organizations.id,
      name: m.organizations.name,
      slug: m.organizations.slug,
      plan: m.organizations.plan,
      planExpiresAt: m.organizations.plan_expires_at,
      settings: m.organizations.settings || {},
      metadata: m.organizations.metadata || {},
      createdAt: m.organizations.created_at,
      updatedAt: m.organizations.updated_at,
    }));
    
    return NextResponse.json({
      success: true,
      organizations,
    });
    
  } catch (error) {
    console.error('[Tenant API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST - 新規組織作成
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, plan = 'free' } = body;
    
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Organization name is required (min 2 characters)' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);
    
    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: name.trim(),
        slug,
        plan,
        settings: {},
        metadata: {},
      })
      .select()
      .single();
    
    if (orgError) {
      console.error('[Tenant API] Org create error:', orgError);
      return NextResponse.json(
        { success: false, error: orgError.message },
        { status: 500 }
      );
    }
    
    // Add user as admin member
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: userId,
        role: 'admin',
        accepted_at: new Date().toISOString(),
      });
    
    if (memberError) {
      // Rollback org creation
      await supabase.from('organizations').delete().eq('id', org.id);
      console.error('[Tenant API] Member create error:', memberError);
      return NextResponse.json(
        { success: false, error: memberError.message },
        { status: 500 }
      );
    }
    
    // Audit log
    await supabase.from('audit_logs').insert({
      organization_id: org.id,
      user_id: userId,
      action: 'organization_created',
      resource_type: 'organization',
      resource_id: org.id,
      details: { name, plan, slug },
    }).catch(() => {});  // Ignore audit log errors
    
    return NextResponse.json({
      success: true,
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
        settings: org.settings || {},
        metadata: org.metadata || {},
        createdAt: org.created_at,
        updatedAt: org.updated_at,
      },
    });
    
  } catch (error) {
    console.error('[Tenant API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
