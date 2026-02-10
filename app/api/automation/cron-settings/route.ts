/**
 * Cron設定API
 * VPS cronジョブの間隔・有効/無効を管理
 * 
 * GET: 全てのcron設定を取得
 * PUT: 特定のcron設定を更新
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export interface CronSetting {
  id: string
  cron_type: 'listing' | 'inventory_monitoring' | 'inventory_sync'
  enabled: boolean
  interval_minutes: number
  description: string
  last_run_at: string | null
  next_run_at: string | null
  run_count: number
  success_count: number
  error_count: number
  last_error: string | null
  last_result: any
  created_at: string
  updated_at: string
}

/**
 * GET /api/automation/cron-settings
 * 全てのcron設定を取得
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('cron_settings')
      .select('*')
      .order('cron_type')
    
    if (error) {
      // テーブルが存在しない場合はデフォルト値を返す
      if (error.code === '42P01') {
        console.warn('⚠️ cron_settingsテーブルが存在しません。デフォルト値を返します。')
        return NextResponse.json({
          success: true,
          settings: getDefaultSettings(),
          table_exists: false,
        })
      }
      throw error
    }
    
    // データがない場合はデフォルト値を返す
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        settings: getDefaultSettings(),
        table_exists: true,
      })
    }
    
    return NextResponse.json({
      success: true,
      settings: data as CronSetting[],
      table_exists: true,
    })
  } catch (error: any) {
    console.error('❌ Cron設定取得エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Cron設定の取得に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/automation/cron-settings
 * 特定のcron設定を更新
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { cron_type, enabled, interval_minutes } = body
    
    if (!cron_type) {
      return NextResponse.json(
        { success: false, error: 'cron_typeが必要です' },
        { status: 400 }
      )
    }
    
    const validTypes = ['listing', 'inventory_monitoring', 'inventory_sync']
    if (!validTypes.includes(cron_type)) {
      return NextResponse.json(
        { success: false, error: `無効なcron_type: ${cron_type}` },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // 更新データを構築
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }
    
    if (enabled !== undefined) {
      updateData.enabled = enabled
    }
    
    if (interval_minutes !== undefined) {
      // 最小1分、最大1440分（24時間）
      const clampedInterval = Math.max(1, Math.min(1440, interval_minutes))
      updateData.interval_minutes = clampedInterval
    }
    
    // 既存レコードの確認
    const { data: existing, error: fetchError } = await supabase
      .from('cron_settings')
      .select('id')
      .eq('cron_type', cron_type)
      .single()
    
    let result
    
    if (existing) {
      // 更新
      result = await supabase
        .from('cron_settings')
        .update(updateData)
        .eq('cron_type', cron_type)
        .select()
        .single()
    } else {
      // 新規作成
      const defaultDescriptions: Record<string, string> = {
        listing: 'スケジュール出品実行',
        inventory_monitoring: '無在庫商品の在庫監視',
        inventory_sync: '有在庫商品の在庫同期',
      }
      
      result = await supabase
        .from('cron_settings')
        .insert({
          cron_type,
          description: defaultDescriptions[cron_type],
          ...updateData,
        })
        .select()
        .single()
    }
    
    if (result.error) throw result.error
    
    console.log(`✅ Cron設定更新: ${cron_type}`, updateData)
    
    return NextResponse.json({
      success: true,
      setting: result.data,
      message: `${cron_type}の設定を更新しました`,
    })
  } catch (error: any) {
    console.error('❌ Cron設定更新エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Cron設定の更新に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/automation/cron-settings
 * 実行ログを記録（cronワーカーから呼ばれる）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cron_type, status, processed_count, success_count, error_count, result, error_message, duration_ms } = body
    
    if (!cron_type || !status) {
      return NextResponse.json(
        { success: false, error: 'cron_typeとstatusが必要です' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // 実行ログを記録
    const { data: logData, error: logError } = await supabase
      .from('cron_execution_logs')
      .insert({
        cron_type,
        status,
        processed_count: processed_count || 0,
        success_count: success_count || 0,
        error_count: error_count || 0,
        result,
        error_message,
        duration_ms,
        completed_at: status !== 'running' ? new Date().toISOString() : null,
      })
      .select()
      .single()
    
    if (logError && logError.code !== '42P01') {
      console.error('実行ログ記録エラー:', logError)
    }
    
    // cron_settingsを更新
    const updateData: any = {
      last_run_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    if (status === 'completed') {
      updateData.run_count = supabase.rpc('increment', { row_id: cron_type, column: 'run_count' })
      updateData.success_count = supabase.rpc('increment', { row_id: cron_type, column: 'success_count' })
      updateData.last_result = result
      updateData.last_error = null
    } else if (status === 'error') {
      updateData.error_count = supabase.rpc('increment', { row_id: cron_type, column: 'error_count' })
      updateData.last_error = error_message
    }
    
    // 簡易的な更新（RPC使わない版）
    const { data: currentSetting } = await supabase
      .from('cron_settings')
      .select('run_count, success_count, error_count')
      .eq('cron_type', cron_type)
      .single()
    
    if (currentSetting) {
      const simpleUpdate: any = {
        last_run_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        run_count: (currentSetting.run_count || 0) + 1,
      }
      
      if (status === 'completed') {
        simpleUpdate.success_count = (currentSetting.success_count || 0) + 1
        simpleUpdate.last_result = result
        simpleUpdate.last_error = null
      } else if (status === 'error') {
        simpleUpdate.error_count = (currentSetting.error_count || 0) + 1
        simpleUpdate.last_error = error_message
      }
      
      await supabase
        .from('cron_settings')
        .update(simpleUpdate)
        .eq('cron_type', cron_type)
    }
    
    return NextResponse.json({
      success: true,
      log_id: logData?.id,
      message: '実行ログを記録しました',
    })
  } catch (error: any) {
    console.error('❌ 実行ログ記録エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '実行ログの記録に失敗しました',
      },
      { status: 500 }
    )
  }
}

/**
 * デフォルト設定を返す
 */
function getDefaultSettings(): CronSetting[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'default-listing',
      cron_type: 'listing',
      enabled: true,
      interval_minutes: 10,
      description: 'スケジュール出品実行 - 設定した日時に自動で出品',
      last_run_at: null,
      next_run_at: null,
      run_count: 0,
      success_count: 0,
      error_count: 0,
      last_error: null,
      last_result: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'default-inventory_monitoring',
      cron_type: 'inventory_monitoring',
      enabled: true,
      interval_minutes: 60,
      description: '無在庫商品の在庫監視 - 仕入先の在庫変動を検知',
      last_run_at: null,
      next_run_at: null,
      run_count: 0,
      success_count: 0,
      error_count: 0,
      last_error: null,
      last_result: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'default-inventory_sync',
      cron_type: 'inventory_sync',
      enabled: true,
      interval_minutes: 15,
      description: '有在庫商品の在庫同期 - 各マーケットプレイスに在庫数を同期',
      last_run_at: null,
      next_run_at: null,
      run_count: 0,
      success_count: 0,
      error_count: 0,
      last_error: null,
      last_result: null,
      created_at: now,
      updated_at: now,
    },
  ]
}
