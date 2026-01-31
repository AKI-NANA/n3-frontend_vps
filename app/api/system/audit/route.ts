// app/api/system/audit/route.ts
/**
 * 🔒 Phase H-5: Audit Log API
 * 
 * 全重要操作のログを記録
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AuditLogEntry {
  id?: string;
  timestamp: string;
  user_id: string;
  user_name?: string;
  action: string;
  action_category: 'kill_switch' | 'execution' | 'startup' | 'config' | 'approval' | 'system';
  target_type?: string;
  target_id?: string;
  before_state?: Record<string, any>;
  after_state?: Record<string, any>;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
}

// POST: Create audit log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      action_category,
      target_type,
      target_id,
      before_state,
      after_state,
      metadata,
      success = true,
      error_message,
    } = body;

    if (!action || !action_category) {
      return NextResponse.json({ 
        success: false, 
        error: 'action and action_category are required' 
      }, { status: 400 });
    }

    const entry: Partial<AuditLogEntry> = {
      timestamp: new Date().toISOString(),
      user_id: 'system', // TODO: 認証連携後は実ユーザーID
      user_name: 'System',
      action,
      action_category,
      target_type,
      target_id,
      before_state,
      after_state,
      metadata,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      success,
      error_message,
    };

    // Supabaseに保存（テーブルがない場合はメモリに保存）
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(entry)
        .select()
        .single();

      if (error) {
        // テーブルがない場合はコンソールにログ出力
        console.log('[AUDIT]', JSON.stringify(entry, null, 2));
        
        return NextResponse.json({
          success: true,
          logged: true,
          storage: 'console',
          entry,
        });
      }

      return NextResponse.json({
        success: true,
        logged: true,
        storage: 'database',
        entry: data,
      });
    } catch (dbError) {
      // DBエラー時もコンソールにログ出力
      console.log('[AUDIT]', JSON.stringify(entry, null, 2));
      
      return NextResponse.json({
        success: true,
        logged: true,
        storage: 'console',
        entry,
      });
    }
  } catch (error: any) {
    console.error('[Audit API Error]', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// GET: Get audit logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const action_category = searchParams.get('category');
    const since = searchParams.get('since');

    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (action_category) {
      query = query.eq('action_category', action_category);
    }

    if (since) {
      query = query.gte('timestamp', since);
    }

    const { data, error } = await query;

    if (error) {
      // テーブルがない場合は空配列
      return NextResponse.json({
        success: true,
        logs: [],
        total: 0,
        note: 'audit_logs table not found',
      });
    }

    return NextResponse.json({
      success: true,
      logs: data || [],
      total: data?.length || 0,
    });
  } catch (error: any) {
    console.error('[Audit API Error]', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
