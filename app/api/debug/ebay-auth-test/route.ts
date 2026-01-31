// app/api/debug/ebay-auth-test/route.ts
/**
 * eBay認証テストAPI
 * 
 * 目的：
 * 1. 複数のClient Secret候補をテストして正しいものを特定
 * 2. 各APIタイプ（Browse API / Trading API）で使われる環境変数を確認
 * 3. 認証成功時のトークン情報を返却
 */

import { NextRequest, NextResponse } from 'next/server'

interface AuthTestResult {
  name: string
  clientId: string | undefined
  clientSecretPrefix: string | undefined
  success: boolean
  status?: number
  error?: string
  tokenInfo?: {
    tokenType: string
    expiresIn: number
    scope: string
  }
}

/**
 * 認証テスト実行
 */
async function testAuthentication(
  name: string,
  clientId: string | undefined,
  clientSecret: string | undefined
): Promise<AuthTestResult> {
  const result: AuthTestResult = {
    name,
    clientId: clientId ? `${clientId.substring(0, 30)}...` : undefined,
    clientSecretPrefix: clientSecret ? `${clientSecret.substring(0, 15)}...` : undefined,
    success: false
  }

  if (!clientId || !clientSecret) {
    result.error = '環境変数が設定されていません'
    return result
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    console.log(`🔍 [${name}] 認証テスト中...`)
    console.log(`   Client ID: ${clientId.substring(0, 30)}...`)
    console.log(`   Client Secret: ${clientSecret.substring(0, 15)}...`)

    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'https://api.ebay.com/oauth/api_scope'
      })
    })

    result.status = response.status
    const responseText = await response.text()

    if (!response.ok) {
      console.error(`❌ [${name}] 認証失敗 (${response.status}):`, responseText.substring(0, 200))
      
      // エラー詳細を解析
      try {
        const errorJson = JSON.parse(responseText)
        result.error = errorJson.error_description || errorJson.error || responseText.substring(0, 200)
      } catch {
        result.error = responseText.substring(0, 200)
      }
      
      return result
    }

    const data = JSON.parse(responseText)
    console.log(`✅ [${name}] 認証成功！`)

    result.success = true
    result.tokenInfo = {
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      scope: data.scope
    }

    return result

  } catch (error: any) {
    console.error(`❌ [${name}] 認証テストエラー:`, error.message)
    result.error = error.message
    return result
  }
}

export async function GET(request: NextRequest) {
  console.log('🔐 eBay認証テスト開始')
  console.log('=' .repeat(60))

  // 環境変数一覧（デバッグ用）
  const envVars = {
    EBAY_CLIENT_ID: process.env.EBAY_CLIENT_ID,
    EBAY_CLIENT_SECRET: process.env.EBAY_CLIENT_SECRET,
    EBAY_CLIENT_ID_MJT: process.env.EBAY_CLIENT_ID_MJT,
    EBAY_CLIENT_SECRET_MJT: process.env.EBAY_CLIENT_SECRET_MJT,
    EBAY_CLIENT_ID_GREEN: process.env.EBAY_CLIENT_ID_GREEN,
    EBAY_CLIENT_SECRET_GREEN: process.env.EBAY_CLIENT_SECRET_GREEN,
    EBAY_APP_ID: process.env.EBAY_APP_ID,
  }

  console.log('📋 環境変数の状態:')
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      console.log(`   ${key}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`   ${key}: ❌ 未設定`)
    }
  })
  console.log('')

  const results: AuthTestResult[] = []

  // テスト1: メイン環境変数（Browse APIで使用）
  console.log('📡 テスト1: EBAY_CLIENT_ID + EBAY_CLIENT_SECRET')
  const test1 = await testAuthentication(
    'メイン（Browse API用）',
    process.env.EBAY_CLIENT_ID,
    process.env.EBAY_CLIENT_SECRET
  )
  results.push(test1)
  console.log('')

  // テスト2: MJTアカウント用
  console.log('📡 テスト2: EBAY_CLIENT_ID_MJT + EBAY_CLIENT_SECRET_MJT')
  const test2 = await testAuthentication(
    'MJTアカウント',
    process.env.EBAY_CLIENT_ID_MJT,
    process.env.EBAY_CLIENT_SECRET_MJT
  )
  results.push(test2)
  console.log('')

  // テスト3: GREENアカウント用
  console.log('📡 テスト3: EBAY_CLIENT_ID_GREEN + EBAY_CLIENT_SECRET_GREEN')
  const test3 = await testAuthentication(
    'GREENアカウント',
    process.env.EBAY_CLIENT_ID_GREEN,
    process.env.EBAY_CLIENT_SECRET_GREEN
  )
  results.push(test3)
  console.log('')

  // テスト4: クロスチェック（メインID + MJT Secret）
  console.log('📡 テスト4: EBAY_CLIENT_ID + EBAY_CLIENT_SECRET_MJT（クロスチェック）')
  const test4 = await testAuthentication(
    'クロスチェック（ID=メイン, Secret=MJT）',
    process.env.EBAY_CLIENT_ID,
    process.env.EBAY_CLIENT_SECRET_MJT
  )
  results.push(test4)
  console.log('')

  // 結果サマリー
  console.log('=' .repeat(60))
  console.log('📊 テスト結果サマリー:')
  results.forEach(r => {
    const status = r.success ? '✅ 成功' : '❌ 失敗'
    console.log(`   ${r.name}: ${status}`)
  })

  const successfulTests = results.filter(r => r.success)
  const failedTests = results.filter(r => !r.success)

  // 推奨アクション
  let recommendation = ''
  
  if (successfulTests.length === 0) {
    recommendation = '⚠️ すべての認証テストが失敗しました。eBay Developer Portalで正しいClient Secretを確認してください。'
  } else if (test1.success) {
    recommendation = '✅ メイン環境変数（EBAY_CLIENT_ID + EBAY_CLIENT_SECRET）は正常です。Browse APIは動作するはずです。'
  } else if (test4.success && !test1.success) {
    recommendation = '⚠️ EBAY_CLIENT_SECRETが間違っています！EBAY_CLIENT_SECRET_MJTの値をEBAY_CLIENT_SECRETにコピーしてください。'
  } else if (test2.success || test3.success) {
    recommendation = '⚠️ アカウント別の認証は成功していますが、メイン環境変数（Browse API用）の設定を確認してください。'
  }

  console.log('')
  console.log('💡 推奨アクション:')
  console.log(`   ${recommendation}`)

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      success: successfulTests.length,
      failed: failedTests.length
    },
    recommendation,
    results,
    envVarStatus: {
      EBAY_CLIENT_ID: !!process.env.EBAY_CLIENT_ID,
      EBAY_CLIENT_SECRET: !!process.env.EBAY_CLIENT_SECRET,
      EBAY_CLIENT_ID_MJT: !!process.env.EBAY_CLIENT_ID_MJT,
      EBAY_CLIENT_SECRET_MJT: !!process.env.EBAY_CLIENT_SECRET_MJT,
      EBAY_CLIENT_ID_GREEN: !!process.env.EBAY_CLIENT_ID_GREEN,
      EBAY_CLIENT_SECRET_GREEN: !!process.env.EBAY_CLIENT_SECRET_GREEN,
    },
    hint: {
      browseApiUsedVars: ['EBAY_CLIENT_ID', 'EBAY_CLIENT_SECRET'],
      tradingApiUsedVars: ['EBAY_CLIENT_ID_MJT/GREEN', 'EBAY_CLIENT_SECRET_MJT/GREEN'],
      findingApiUsedVars: ['EBAY_APP_ID または EBAY_CLIENT_ID_MJT（認証不要）'],
    }
  })
}

// POSTでも同じテストを実行（便利のため）
export async function POST(request: NextRequest) {
  return GET(request)
}
