/**
 * eBayアカウントのセラーID確認API
 * GET /api/ebay/verify-seller
 * 
 * 目的: MJTとGREENが同じセラーIDを共有しているか確認
 */

import { NextRequest, NextResponse } from 'next/server'
import { SecureEbayApiClient } from '@/lib/ebay/secure-ebay-token-manager'

export async function GET(req: NextRequest) {
  const results: any[] = []
  
  for (const account of ['mjt', 'green']) {
    try {
      console.log(`\n=== ${account.toUpperCase()} アカウントの検証 ===`)
      
      const secureClient = new SecureEbayApiClient(account)
      const token = await secureClient.tokenManager.getAccessToken()
      
      if (!token) {
        results.push({
          account,
          error: 'トークン取得失敗',
          seller_id: null
        })
        continue
      }
      
      console.log(`✅ ${account} トークン取得成功: ${token.substring(0, 20)}...`)
      
      // GetUser APIでセラーIDを取得
      const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${token}</eBayAuthToken>
  </RequesterCredentials>
  <ErrorLanguage>en_US</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
</GetUserRequest>`

      const response = await fetch(
        'https://api.ebay.com/ws/api.dll',
        {
          method: 'POST',
          headers: {
            'X-EBAY-API-SITEID': '0',
            'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
            'X-EBAY-API-CALL-NAME': 'GetUser',
            'X-EBAY-API-IAF-TOKEN': token,
            'Content-Type': 'text/xml'
          },
          body: xmlRequest
        }
      )
      
      const xmlText = await response.text()
      
      // セラーIDを抽出
      const userIdMatch = xmlText.match(/<UserID>([^<]*)<\/UserID>/)
      const sellerId = userIdMatch ? userIdMatch[1] : 'N/A'
      
      // エラーチェック
      if (xmlText.includes('<Ack>Failure</Ack>')) {
        const errorMatch = xmlText.match(/<ShortMessage>([^<]*)<\/ShortMessage>/)
        results.push({
          account,
          error: errorMatch ? errorMatch[1] : 'Unknown error',
          seller_id: null,
          token_prefix: token.substring(0, 20)
        })
      } else {
        results.push({
          account,
          seller_id: sellerId,
          token_prefix: token.substring(0, 20),
          error: null
        })
      }
      
      console.log(`📊 ${account}: セラーID = ${sellerId}`)
      
    } catch (error: any) {
      results.push({
        account,
        error: error.message,
        seller_id: null
      })
    }
  }
  
  // 結論
  const mjtResult = results.find(r => r.account === 'mjt')
  const greenResult = results.find(r => r.account === 'green')
  
  const isSameSeller = mjtResult?.seller_id && greenResult?.seller_id && 
                        mjtResult.seller_id === greenResult.seller_id
  
  return NextResponse.json({
    success: true,
    accounts: results,
    conclusion: {
      same_seller: isSameSeller,
      mjt_seller_id: mjtResult?.seller_id || null,
      green_seller_id: greenResult?.seller_id || null,
      recommendation: isSameSeller 
        ? 'MJTとGREENは同じセラーです。出品データはMJTのみから取得すれば十分です。GREENはRate Table取得用として使用してください。'
        : 'MJTとGREENは異なるセラーです。両方から出品データを取得する必要があります。'
    }
  })
}
