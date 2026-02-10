/**
 * トークン自動更新ヘルパー
 * 
 * Access Token: 2時間（30分以内に切れる場合は更新）
 * Refresh Token: 18ヶ月（自動Rotation対応）
 */

import { createClient } from '@/lib/supabase/server'

export async function getValidToken(accountName: string = 'mjt') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ebay_tokens')
    .select('*')
    .eq('account', accountName)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    console.error('❌ Token not found:', accountName)
    return null
  }

  // Access Token期限チェック（30分以内に切れる場合は更新）
  const expiresAt = new Date(data.expires_at)
  const now = new Date()
  const minutesRemaining = (expiresAt.getTime() - now.getTime()) / 1000 / 60

  if (minutesRemaining > 30) {
    console.log(`✅ Token valid for ${Math.floor(minutesRemaining)} minutes`)
    return data.access_token
  }

  // トークンを更新
  console.log('🔄 Token expiring soon, refreshing...')
  
  const clientId = process.env.EBAY_CLIENT_ID_MJT || process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET_MJT || process.env.EBAY_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    console.error('❌ Client credentials missing')
    return null
  }

  const authCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  try {
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authCredentials}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: data.refresh_token
      })
    })

    if (!response.ok) {
      console.error('❌ Token refresh failed:', response.status)
      return null
    }

    const tokenData = await response.json()
    const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

    // 🔥 重要: Refresh Token Rotationに対応
    const newRefreshToken = tokenData.refresh_token || data.refresh_token

    // DBを更新
    const { error: updateError } = await supabase
      .from('ebay_tokens')
      .update({
        access_token: tokenData.access_token,
        refresh_token: newRefreshToken, // 新しいRefresh Tokenがあれば更新
        expires_at: newExpiresAt,
        token_type: tokenData.token_type || 'Bearer',
        updated_at: new Date().toISOString()
      })
      .eq('account', accountName)

    if (updateError) {
      console.error('❌ DB update failed:', updateError)
      return null
    }

    if (tokenData.refresh_token) {
      console.log('✅ Token refreshed + NEW Refresh Token (Rotation)')
    } else {
      console.log('✅ Token refreshed successfully')
    }

    return tokenData.access_token

  } catch (error) {
    console.error('❌ Token refresh error:', error)
    return null
  }
}
