// app/api/automation/settings/route.ts
/**
 * Phase C-2: Automation Settings API
 * 
 * 自動化設定の取得・更新
 * 
 * GET: 全設定取得
 * POST: 設定更新（単一/バッチ）
 * PUT: 全自動ON/OFF
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// 型定義
// ============================================================

interface AutomationSetting {
  id: string;
  tool_id: string;
  tool_name: string;
  category: string;
  enabled: boolean;
  cron_expression: string | null;
  run_window_start: string | null;
  run_window_end: string | null;
  timezone: string;
  priority: number;
  max_concurrent: number;
  timeout_seconds: number;
  retry_count: number;
  retry_delay_seconds: number;
  depends_on: string[] | null;
  last_run_at: string | null;
  last_status: string | null;
  last_error: string | null;
  next_run_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================================
// GET: 全設定取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const enabledOnly = searchParams.get('enabled') === 'true';
    
    let query = supabase
      .from('automation_settings')
      .select('*')
      .order('priority', { ascending: true })
      .order('tool_name', { ascending: true });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (enabledOnly) {
      query = query.eq('enabled', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      // テーブルが存在しない場合はモックデータを返す
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          settings: getMockSettings(),
          source: 'mock',
          message: 'automation_settings テーブルが存在しません。SQLを実行してください。',
        });
      }
      throw error;
    }
    
    // カテゴリ別集計
    const byCategory: Record<string, AutomationSetting[]> = {};
    const stats = {
      total: data.length,
      enabled: 0,
      disabled: 0,
      running: 0,
      error: 0,
    };
    
    data.forEach((setting: AutomationSetting) => {
      if (!byCategory[setting.category]) {
        byCategory[setting.category] = [];
      }
      byCategory[setting.category].push(setting);
      
      if (setting.enabled) stats.enabled++;
      else stats.disabled++;
      
      if (setting.last_status === 'running') stats.running++;
      if (setting.last_status === 'error') stats.error++;
    });
    
    return NextResponse.json({
      success: true,
      settings: data,
      byCategory,
      stats,
      source: 'database',
    });
    
  } catch (error: any) {
    console.error('Automation settings GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      settings: getMockSettings(),
      source: 'mock',
    });
  }
}

// ============================================================
// POST: 設定更新
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, toolId, toolIds, updates } = body;
    
    // 単一ツール更新
    if (action === 'update' && toolId) {
      const { data, error } = await supabase
        .from('automation_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('tool_id', toolId)
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        setting: data,
        message: `${toolId} の設定を更新しました`,
      });
    }
    
    // トグル（有効/無効切り替え）
    if (action === 'toggle' && toolId) {
      // 現在の状態を取得
      const { data: current, error: fetchError } = await supabase
        .from('automation_settings')
        .select('enabled')
        .eq('tool_id', toolId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newEnabled = !current.enabled;
      
      const { data, error } = await supabase
        .from('automation_settings')
        .update({
          enabled: newEnabled,
          updated_at: new Date().toISOString(),
        })
        .eq('tool_id', toolId)
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        setting: data,
        message: `${toolId} を ${newEnabled ? '有効' : '無効'} にしました`,
      });
    }
    
    // バッチ更新
    if (action === 'batch_update' && toolIds && Array.isArray(toolIds)) {
      const results = [];
      
      for (const id of toolIds) {
        const { data, error } = await supabase
          .from('automation_settings')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('tool_id', id)
          .select()
          .single();
        
        if (!error) {
          results.push(data);
        }
      }
      
      return NextResponse.json({
        success: true,
        updated: results.length,
        settings: results,
        message: `${results.length}件の設定を更新しました`,
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Automation settings POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// ============================================================
// PUT: 全自動ON/OFF（マスタースイッチ）
// ============================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, category } = body;
    
    if (action === 'enable_all') {
      let query = supabase
        .from('automation_settings')
        .update({ enabled: true, updated_at: new Date().toISOString() });
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.select();
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        updated: data?.length || 0,
        message: category ? `${category}カテゴリの全自動化を有効にしました` : '全自動化を有効にしました',
      });
    }
    
    if (action === 'disable_all') {
      let query = supabase
        .from('automation_settings')
        .update({ enabled: false, updated_at: new Date().toISOString() });
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.select();
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        updated: data?.length || 0,
        message: category ? `${category}カテゴリの全自動化を無効にしました` : '全自動化を無効にしました（緊急停止）',
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use enable_all or disable_all',
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Automation settings PUT error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// ============================================================
// モックデータ（テーブル未作成時用）
// ============================================================

function getMockSettings(): AutomationSetting[] {
  return [
    {
      id: 'mock-1',
      tool_id: 'stock-killer',
      tool_name: '【在庫】GlobalStockKiller',
      category: 'inventory',
      enabled: false,
      cron_expression: '0 3 * * *',
      run_window_start: '03:00',
      run_window_end: '06:00',
      timezone: 'Asia/Tokyo',
      priority: 1,
      max_concurrent: 1,
      timeout_seconds: 300,
      retry_count: 3,
      retry_delay_seconds: 60,
      depends_on: null,
      last_run_at: null,
      last_status: null,
      last_error: null,
      next_run_at: null,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      tool_id: 'research-agent',
      tool_name: '【リサーチ】自律型リサーチAgent',
      category: 'research',
      enabled: false,
      cron_expression: '0 1 * * *',
      run_window_start: '01:00',
      run_window_end: '05:00',
      timezone: 'Asia/Tokyo',
      priority: 3,
      max_concurrent: 1,
      timeout_seconds: 600,
      retry_count: 2,
      retry_delay_seconds: 120,
      depends_on: null,
      last_run_at: null,
      last_status: null,
      last_error: null,
      next_run_at: null,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-3',
      tool_id: 'listing-local',
      tool_name: '【出品】ローカル-eBay出品処理',
      category: 'listing',
      enabled: false,
      cron_expression: '0 6 * * *',
      run_window_start: '06:00',
      run_window_end: '09:00',
      timezone: 'Asia/Tokyo',
      priority: 2,
      max_concurrent: 1,
      timeout_seconds: 300,
      retry_count: 3,
      retry_delay_seconds: 60,
      depends_on: ['research-agent'],
      last_run_at: null,
      last_status: null,
      last_error: null,
      next_run_at: null,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-4',
      tool_id: 'sentinel-monitor',
      tool_name: '【司令塔】Sentinel監視',
      category: 'system',
      enabled: true,
      cron_expression: '*/5 * * * *',
      run_window_start: null,
      run_window_end: null,
      timezone: 'Asia/Tokyo',
      priority: 1,
      max_concurrent: 1,
      timeout_seconds: 60,
      retry_count: 1,
      retry_delay_seconds: 30,
      depends_on: null,
      last_run_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      last_status: 'success',
      last_error: null,
      next_run_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-5',
      tool_id: 'defense-ban-monitor',
      tool_name: '【防衛】BAN検知・自動対策',
      category: 'defense',
      enabled: true,
      cron_expression: '*/30 * * * *',
      run_window_start: null,
      run_window_end: null,
      timezone: 'Asia/Tokyo',
      priority: 1,
      max_concurrent: 1,
      timeout_seconds: 120,
      retry_count: 2,
      retry_delay_seconds: 60,
      depends_on: null,
      last_run_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      last_status: 'success',
      last_error: null,
      next_run_at: new Date().toISOString(),
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}
