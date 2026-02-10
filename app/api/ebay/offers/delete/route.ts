/**
 * eBay Offer 削除API
 * 
 * 指定されたOfferを削除
 * - 「幽霊Offer」（未公開の予約票）のクリーンアップに使用
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/ebay/oauth'

const EBAY_API_BASE = 'https://api.ebay.com'

// 共通ヘッダーを生成（Accept-Languageを確実に文字列で設定）
function getHeaders(accessToken: string): HeadersInit {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Accept-Language': 'en-US',
    'Content-Language': 'en-US'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerId, account = 'mjt' } = body
    
    if (!offerId) {
      return NextResponse.json(
        { success: false, error: 'offerIdは必須です' },
        { status: 400 }
      )
    }
    
    console.log(`\n========================================`)
    console.log(`🗑️ eBay Offer削除`)
    console.log(`  offerId: ${offerId}`)
    console.log(`  account: ${account}`)
    console.log(`========================================`)

    // アクセストークン取得
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    const headers = getHeaders(accessToken)
    
    // Offer削除
    const response = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/offer/${offerId}`,
      {
        method: 'DELETE',
        headers: headers
      }
    )
    
    // 204 No Contentは成功
    if (response.status === 204 || response.ok) {
      console.log(`✅ Offer削除成功: ${offerId}`)
      return NextResponse.json({
        success: true,
        message: `Offer ${offerId} を削除しました`,
        offerId: offerId
      })
    }
    
    const error = await response.json()
    console.error('❌ Offer削除エラー:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        success: false,
        error: error.errors?.[0]?.message || 'Offer削除に失敗しました',
        details: error
      },
      { status: response.status }
    )
    
  } catch (error: any) {
    console.error('❌ Offer削除エラー:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Offer削除に失敗しました'
      },
      { status: 500 }
    )
  }
}

/**
 * 一括削除（DELETE メソッド）
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerIds, account = 'mjt', deleteGhostsOnly = true } = body
    
    console.log(`\n========================================`)
    console.log(`🗑️ eBay Offer一括削除`)
    console.log(`  account: ${account}`)
    console.log(`  offerIds: ${offerIds?.length || 0}件指定`)
    console.log(`  deleteGhostsOnly: ${deleteGhostsOnly}`)
    console.log(`========================================`)

    // アクセストークン取得
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    const headers = getHeaders(accessToken)
    
    // offerIdsが指定されていない場合は、幽霊Offerを自動取得
    let targetOfferIds = offerIds || []
    
    if (targetOfferIds.length === 0 && deleteGhostsOnly) {
      console.log('🔍 幽霊Offerを自動検索中...')
      
      // まずInventory Itemsを取得
      const inventoryUrl = `${EBAY_API_BASE}/sell/inventory/v1/inventory_item?limit=200`
      const inventoryResponse = await fetch(inventoryUrl, {
        method: 'GET',
        headers: headers
      })
      
      if (!inventoryResponse.ok) {
        const error = await inventoryResponse.json()
        console.error('❌ Inventory Items取得エラー:', JSON.stringify(error, null, 2))
        return NextResponse.json(
          { 
            success: false,
            error: 'Inventory Itemsの取得に失敗しました',
            details: error
          },
          { status: inventoryResponse.status }
        )
      }
      
      const inventoryData = await inventoryResponse.json()
      const inventoryItems = inventoryData.inventoryItems || []
      const skus = inventoryItems.map((item: any) => item.sku)
      
      console.log(`📦 ${skus.length}件のInventory Itemsを取得`)
      
      // 各SKUのOfferをチェック
      const ghostOffers: { offerId: string; sku: string }[] = []
      
      for (const itemSku of skus) {
        try {
          const offerUrl = `${EBAY_API_BASE}/sell/inventory/v1/offer?sku=${encodeURIComponent(itemSku)}`
          const offerResponse = await fetch(offerUrl, {
            method: 'GET',
            headers: headers
          })
          
          if (offerResponse.ok) {
            const offerData = await offerResponse.json()
            const offers = offerData.offers || []
            
            // 未公開のOfferを抽出
            offers
              .filter((offer: any) => offer.status !== 'PUBLISHED')
              .forEach((offer: any) => {
                ghostOffers.push({
                  offerId: offer.offerId,
                  sku: offer.sku
                })
              })
          }
          
          // レート制限対策
          await new Promise(resolve => setTimeout(resolve, 50))
          
        } catch (e) {
          console.warn(`⚠️ SKU ${itemSku} のOffer取得スキップ`)
        }
      }
      
      targetOfferIds = ghostOffers.map(o => o.offerId)
      console.log(`👻 ${targetOfferIds.length}件の幽霊Offerを検出`)
      
      if (ghostOffers.length > 0) {
        console.log(`   対象SKU: ${ghostOffers.map(o => o.sku).join(', ')}`)
      }
    }
    
    if (targetOfferIds.length === 0) {
      console.log('✅ 削除対象のOfferはありません')
      return NextResponse.json({
        success: true,
        message: '削除対象のOfferがありません',
        deleted: 0
      })
    }
    
    // 各Offerを削除
    const results: { offerId: string; success: boolean; error?: string }[] = []
    
    for (const offerId of targetOfferIds) {
      try {
        const response = await fetch(
          `${EBAY_API_BASE}/sell/inventory/v1/offer/${offerId}`,
          {
            method: 'DELETE',
            headers: headers
          }
        )
        
        if (response.status === 204 || response.ok) {
          results.push({ offerId, success: true })
          console.log(`  ✅ ${offerId}`)
        } else {
          const error = await response.json()
          results.push({ 
            offerId, 
            success: false, 
            error: error.errors?.[0]?.message || 'Unknown error'
          })
          console.log(`  ❌ ${offerId}: ${error.errors?.[0]?.message}`)
        }
        
        // レート制限対策
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (e: any) {
        results.push({ offerId, success: false, error: e.message })
        console.log(`  ❌ ${offerId}: ${e.message}`)
      }
    }
    
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    
    console.log(`\n📊 結果: ${successCount}件成功, ${failCount}件失敗`)
    
    return NextResponse.json({
      success: failCount === 0,
      message: `${successCount}件のOfferを削除しました${failCount > 0 ? `（${failCount}件失敗）` : ''}`,
      deleted: successCount,
      failed: failCount,
      results: results
    })
    
  } catch (error: any) {
    console.error('❌ Offer一括削除エラー:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Offer一括削除に失敗しました'
      },
      { status: 500 }
    )
  }
}
