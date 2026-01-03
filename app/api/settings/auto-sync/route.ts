import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // system_settingsテーブルから自動同期設定を取得
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('setting_key', 'auto_sync_config')
      .single()

    if (error) {
      // テーブルまたはレコードが存在しない場合はデフォルト値を返す
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          settings: {
            vercelAutoSync: false,
            vercelSyncInterval: 30,
            vpsAutoSync: false
          },
          isDefault: true
        })
      }

      return NextResponse.json(
        { error: '設定の取得に失敗しました', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      settings: data?.setting_value || {
        vercelAutoSync: false,
        vercelSyncInterval: 30,
        vpsAutoSync: false
      },
      isDefault: false
    })
  } catch (error) {
    console.error('❌ 自動同期設定の取得エラー:', error)
    return NextResponse.json(
      {
        error: '自動同期設定の取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vercelAutoSync, vercelSyncInterval, vpsAutoSync } = body

    // バリデーション
    if (typeof vercelAutoSync !== 'boolean' || typeof vpsAutoSync !== 'boolean') {
      return NextResponse.json(
        { error: '不正なリクエスト', details: 'vercelAutoSync と vpsAutoSync はboolean型である必要があります' },
        { status: 400 }
      )
    }

    if (typeof vercelSyncInterval !== 'number' || vercelSyncInterval < 1 || vercelSyncInterval > 1440) {
      return NextResponse.json(
        { error: '不正なリクエスト', details: 'vercelSyncInterval は1〜1440の数値である必要があります' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const settingsData = {
      vercelAutoSync,
      vercelSyncInterval,
      vpsAutoSync
    }

    // system_settingsテーブルにupsert
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        setting_key: 'auto_sync_config',
        setting_value: settingsData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'setting_key'
      })
      .select()

    if (error) {
      console.error('❌ DB保存エラー:', error)

      // テーブルが存在しない場合のエラーメッセージ
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return NextResponse.json(
          {
            error: 'データベーステーブルが存在しません',
            details: 'system_settings テーブルを作成する必要があります',
            suggestion: 'Supabaseダッシュボードで以下のSQLを実行してください:\n\nCREATE TABLE system_settings (\n  id SERIAL PRIMARY KEY,\n  setting_key TEXT NOT NULL UNIQUE,\n  setting_value JSONB NOT NULL,\n  updated_at TIMESTAMP DEFAULT NOW()\n);',
            settings: settingsData
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          error: 'データベースへの保存に失敗しました',
          details: error.message,
          settings: settingsData
        },
        { status: 500 }
      )
    }

    console.log('✅ 自動同期設定をDBに保存しました')

    return NextResponse.json({
      success: true,
      message: '✅ 自動同期設定を保存しました',
      settings: settingsData
    })
  } catch (error) {
    console.error('❌ 自動同期設定の保存エラー:', error)

    return NextResponse.json(
      {
        error: '自動同期設定の保存に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
