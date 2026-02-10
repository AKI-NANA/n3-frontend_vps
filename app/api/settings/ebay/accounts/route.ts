import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CredentialManager } from '@/lib/services/credential-manager'

/**
 * GET /api/settings/ebay/accounts
 * eBayアカウント一覧を取得
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: accounts, error } = await supabase
      .from('ebay_accounts')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    // 認証情報のステータスをチェック（暗号化された値は返さない）
    const accountsWithStatus = await Promise.all(
      (accounts || []).map(async (account) => {
        try {
          // 認証情報が存在するかチェック
          const hasCredentials = await CredentialManager.hasCredentials(
            'ebay',
            account.account_key
          )

          return {
            ...account,
            has_credentials: hasCredentials
          }
        } catch (error) {
          return {
            ...account,
            has_credentials: false
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      accounts: accountsWithStatus
    })
  } catch (error: any) {
    console.error('❌ eBayアカウント取得エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'アカウント取得に失敗しました'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/ebay/accounts
 * 新しいeBayアカウントを追加
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      account_key,
      display_name,
      description,
      ebay_user_id,
      marketplace,
      client_id,
      client_secret,
      refresh_token
    } = body

    // バリデーション
    if (!account_key || !display_name) {
      return NextResponse.json(
        {
          success: false,
          error: 'アカウントキーと表示名は必須です'
        },
        { status: 400 }
      )
    }

    // アカウントキーの形式チェック（小文字英数字とアンダースコアのみ）
    if (!/^[a-z0-9_]+$/.test(account_key)) {
      return NextResponse.json(
        {
          success: false,
          error: 'アカウントキーは小文字英数字とアンダースコアのみ使用できます'
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. eBayアカウントレコードを作成
    const { data: account, error: accountError } = await supabase
      .from('ebay_accounts')
      .insert({
        account_key,
        display_name,
        description,
        ebay_user_id,
        marketplace: marketplace || 'EBAY_US',
        auth_status: refresh_token ? 'active' : 'pending',
        is_active: true
      })
      .select()
      .single()

    if (accountError) {
      if (accountError.code === '23505') {
        // 重複エラー
        return NextResponse.json(
          {
            success: false,
            error: 'このアカウントキーは既に使用されています'
          },
          { status: 409 }
        )
      }
      throw accountError
    }

    // 2. 認証情報を暗号化して保存（提供された場合）
    if (client_id || client_secret || refresh_token) {
      const credentials: Array<{
        type: string
        value: string
      }> = []

      if (client_id) {
        credentials.push({ type: 'client_id', value: client_id })
      }
      if (client_secret) {
        credentials.push({ type: 'client_secret', value: client_secret })
      }
      if (refresh_token) {
        credentials.push({ type: 'refresh_token', value: refresh_token })
      }

      // 並列で認証情報を保存
      await Promise.all(
        credentials.map((cred) =>
          CredentialManager.saveCredential({
            platform: 'ebay',
            account: account_key,
            credential_type: cred.type,
            value: cred.value
          })
        )
      )
    }

    return NextResponse.json({
      success: true,
      message: 'eBayアカウントを追加しました',
      account
    })
  } catch (error: any) {
    console.error('❌ eBayアカウント追加エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'アカウント追加に失敗しました'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/settings/ebay/accounts
 * eBayアカウント情報を更新
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      account_key,
      display_name,
      description,
      ebay_user_id,
      marketplace,
      is_active,
      client_id,
      client_secret,
      refresh_token
    } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'アカウントIDは必須です'
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. アカウント情報を更新
    const updateData: any = {}
    if (display_name !== undefined) updateData.display_name = display_name
    if (description !== undefined) updateData.description = description
    if (ebay_user_id !== undefined) updateData.ebay_user_id = ebay_user_id
    if (marketplace !== undefined) updateData.marketplace = marketplace
    if (is_active !== undefined) updateData.is_active = is_active

    const { data: account, error: accountError } = await supabase
      .from('ebay_accounts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (accountError) {
      throw accountError
    }

    // 2. 認証情報を更新（提供された場合）
    if (account_key && (client_id || client_secret || refresh_token)) {
      const credentials: Array<{
        type: string
        value: string
      }> = []

      if (client_id) {
        credentials.push({ type: 'client_id', value: client_id })
      }
      if (client_secret) {
        credentials.push({ type: 'client_secret', value: client_secret })
      }
      if (refresh_token) {
        credentials.push({ type: 'refresh_token', value: refresh_token })
      }

      await Promise.all(
        credentials.map((cred) =>
          CredentialManager.saveCredential({
            platform: 'ebay',
            account: account_key,
            credential_type: cred.type,
            value: cred.value
          })
        )
      )
    }

    return NextResponse.json({
      success: true,
      message: 'eBayアカウントを更新しました',
      account
    })
  } catch (error: any) {
    console.error('❌ eBayアカウント更新エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'アカウント更新に失敗しました'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/settings/ebay/accounts
 * eBayアカウントを削除（論理削除 - is_active = false）
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const hardDelete = searchParams.get('hard_delete') === 'true'

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'アカウントIDは必須です'
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    if (hardDelete) {
      // 物理削除
      const { error } = await supabase
        .from('ebay_accounts')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }
    } else {
      // 論理削除（非アクティブ化）
      const { error } = await supabase
        .from('ebay_accounts')
        .update({ is_active: false, auth_status: 'disabled' })
        .eq('id', id)

      if (error) {
        throw error
      }
    }

    return NextResponse.json({
      success: true,
      message: hardDelete
        ? 'eBayアカウントを完全に削除しました'
        : 'eBayアカウントを無効化しました'
    })
  } catch (error: any) {
    console.error('❌ eBayアカウント削除エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'アカウント削除に失敗しました'
      },
      { status: 500 }
    )
  }
}
