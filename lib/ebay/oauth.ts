// lib/ebay/oauth.ts
/**
 * eBay OAuth 2.0 Token管理
 * 
 * Refresh Tokenを使って毎回Access Tokenを取得する
 * - Access Token: 2時間有効
 * - Refresh Token: 18ヶ月有効（DBに保存）
 */

import { createClient } from '@supabase/supabase-js'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// トークンキャッシュ（同一プロセス内での再利用）
interface TokenCache {
  accessToken: string
  expiresAt: Date
}

const tokenCache: Record<string, TokenCache> = {}

// アカウント名のマッピング
const ACCOUNT_MAP: Record<string, string> = {
  'account1': 'mjt',
  'account2': 'green',
  'mjt': 'mjt',
  'MJT': 'mjt',
  'green': 'green',
  'GREEN': 'green'
}

/**
 * アクセストークン取得（自動リフレッシュ対応）
 * 
 * 1. キャッシュに有効なトークンがあれば返す
 * 2. DBのトークンが有効ならそれを使う
 * 3. 期限切れならRefresh Tokenで新しいAccess Tokenを取得
 */
export async function getAccessToken(account: 'account1' | 'account2' | string): Promise<string> {
  const accountName = ACCOUNT_MAP[account] || account
  
  console.log(`🔑 [OAuth] アクセストークン取得: account=${accountName}`)
  
  // 1. メモリキャッシュをチェック（有効期限5分前まで使用）
  const cached = tokenCache[accountName]
  if (cached && cached.expiresAt > new Date(Date.now() + 5 * 60 * 1000)) {
    console.log(`✅ [OAuth] キャッシュから取得（有効期限: ${cached.expiresAt.toISOString()}）`)
    return cached.accessToken
  }
  
  // 2. DBからトークン情報を取得
  const { data: tokenData, error: fetchError } = await supabase
    .from('ebay_tokens')
    .select('*')
    .eq('account', accountName)
    .eq('is_active', true)
    .single()
  
  if (fetchError || !tokenData) {
    console.error(`❌ [OAuth] トークン取得エラー: account=${accountName}`, fetchError)
    throw new Error(`eBayトークンが見つかりません: ${accountName}。ebay_tokensテーブルを確認してください。`)
  }
  
  // 3. 有効期限をチェック（5分の余裕を持つ）
  const expiresAt = new Date(tokenData.expires_at)
  const now = new Date()
  const minutesRemaining = (expiresAt.getTime() - now.getTime()) / 1000 / 60
  
  console.log(`📊 [OAuth] トークン状態: 残り${Math.floor(minutesRemaining)}分`)
  
  // 4. まだ有効ならそのまま使用
  if (minutesRemaining > 5) {
    console.log(`✅ [OAuth] DBのトークンを使用（有効期限: ${expiresAt.toISOString()}）`)
    
    // キャッシュに保存
    tokenCache[accountName] = {
      accessToken: tokenData.access_token,
      expiresAt: expiresAt
    }
    
    return tokenData.access_token
  }
  
  // 5. 期限切れまたは期限間近 → Refresh Tokenで更新
  console.log(`🔄 [OAuth] トークン更新中...`)
  
  const newAccessToken = await refreshAccessToken(accountName, tokenData.refresh_token)
  
  return newAccessToken
}

/**
 * Refresh Tokenを使ってAccess Tokenを更新
 */
async function refreshAccessToken(accountName: string, refreshToken: string): Promise<string> {
  // 認証情報を取得（アカウント別またはデフォルト）
  const clientId = accountName === 'green' 
    ? (process.env.EBAY_CLIENT_ID_GREEN || process.env.EBAY_CLIENT_ID)
    : (process.env.EBAY_CLIENT_ID_MJT || process.env.EBAY_CLIENT_ID)
  
  const clientSecret = accountName === 'green'
    ? (process.env.EBAY_CLIENT_SECRET_GREEN || process.env.EBAY_CLIENT_SECRET)
    : (process.env.EBAY_CLIENT_SECRET_MJT || process.env.EBAY_CLIENT_SECRET)
  
  if (!clientId || !clientSecret) {
    throw new Error('eBay OAuth認証情報（EBAY_CLIENT_ID, EBAY_CLIENT_SECRET）が設定されていません')
  }
  
  if (!refreshToken) {
    throw new Error(`Refresh Tokenが設定されていません: ${accountName}`)
  }
  
  const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  
  console.log(`📡 [OAuth] eBay APIにトークン更新リクエスト...`)
  
  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authCredentials}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`❌ [OAuth] トークン更新失敗:`, errorText)
    
    // エラー詳細を解析
    try {
      const errorJson = JSON.parse(errorText)
      if (errorJson.error === 'invalid_grant') {
        throw new Error(`Refresh Tokenが無効です。eBay再認証が必要です: ${accountName}`)
      }
    } catch {}
    
    throw new Error(`eBayトークン更新失敗: ${errorText}`)
  }
  
  const tokenData = await response.json()
  
  console.log(`✅ [OAuth] 新しいAccess Token取得成功`)
  
  // 有効期限を計算
  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)
  
  // 新しいRefresh Tokenがあれば更新（Token Rotation対応）
  const newRefreshToken = tokenData.refresh_token || refreshToken
  const hasNewRefreshToken = !!tokenData.refresh_token
  
  if (hasNewRefreshToken) {
    console.log(`🔄 [OAuth] 新しいRefresh Tokenも取得（Rotation）`)
  }
  
  // DBを更新
  const { error: updateError } = await supabase
    .from('ebay_tokens')
    .update({
      access_token: tokenData.access_token,
      refresh_token: newRefreshToken,
      expires_at: expiresAt.toISOString(),
      token_type: tokenData.token_type || 'Bearer',
      updated_at: new Date().toISOString()
    })
    .eq('account', accountName)
  
  if (updateError) {
    console.error(`⚠️ [OAuth] DB更新エラー（トークンは有効）:`, updateError)
  } else {
    console.log(`💾 [OAuth] DB更新完了（有効期限: ${expiresAt.toISOString()}）`)
  }
  
  // キャッシュに保存
  tokenCache[accountName] = {
    accessToken: tokenData.access_token,
    expiresAt: expiresAt
  }
  
  return tokenData.access_token
}

/**
 * トークンキャッシュをクリア
 */
export function clearTokenCache(account?: string) {
  if (account) {
    const accountName = ACCOUNT_MAP[account] || account
    delete tokenCache[accountName]
    console.log(`🗑️ [OAuth] キャッシュクリア: ${accountName}`)
  } else {
    Object.keys(tokenCache).forEach(key => delete tokenCache[key])
    console.log(`🗑️ [OAuth] 全キャッシュクリア`)
  }
}

/**
 * トークン状態を確認（デバッグ用）
 */
export async function checkTokenStatus(account: string): Promise<{
  account: string
  hasToken: boolean
  isValid: boolean
  expiresAt?: string
  minutesRemaining?: number
}> {
  const accountName = ACCOUNT_MAP[account] || account
  
  const { data: tokenData, error } = await supabase
    .from('ebay_tokens')
    .select('access_token, expires_at, is_active')
    .eq('account', accountName)
    .single()
  
  if (error || !tokenData) {
    return {
      account: accountName,
      hasToken: false,
      isValid: false
    }
  }
  
  const expiresAt = new Date(tokenData.expires_at)
  const now = new Date()
  const minutesRemaining = (expiresAt.getTime() - now.getTime()) / 1000 / 60
  
  return {
    account: accountName,
    hasToken: true,
    isValid: minutesRemaining > 0 && tokenData.is_active,
    expiresAt: expiresAt.toISOString(),
    minutesRemaining: Math.floor(minutesRemaining)
  }
}
