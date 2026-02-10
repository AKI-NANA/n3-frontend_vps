/**
 * eBay Offers 一覧取得API
 * 
 * アカウントに紐づく全てのOffer（予約票）を取得
 * - 「幽霊Offer」（未公開の予約票）の調査に使用
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const account = searchParams.get('account') || 'mjt'
    const sku = searchParams.get('sku')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    console.log(`\n========================================`)
    console.log(`📋 eBay Offers一覧取得`)
    console.log(`  account: ${account}`)
    console.log(`  sku: ${sku || '(全件取得)'}`)
    console.log(`  limit: ${limit}, offset: ${offset}`)
    console.log(`========================================`)

    // アクセストークン取得
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    const headers = getHeaders(accessToken)
    
    // 特定のSKUが指定されている場合
    if (sku && sku.trim() !== '') {
      return await getOffersForSku(sku, account, headers)
    }
    
    // 全件取得: まずInventory Itemsを取得
    console.log(`📡 Inventory Items取得中...`)
    const inventoryUrl = `${EBAY_API_BASE}/sell/inventory/v1/inventory_item?limit=${limit}&offset=${offset}`
    
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
          error: error.errors?.[0]?.message || 'Inventory Items取得に失敗しました',
          details: error
        },
        { status: inventoryResponse.status }
      )
    }
    
    const inventoryData = await inventoryResponse.json()
    const inventoryItems = inventoryData.inventoryItems || []
    const skus = inventoryItems.map((item: any) => item.sku)
    
    console.log(`✅ ${skus.length}件のInventory Itemsを取得`)
    
    // 各SKUに対してOfferを取得
    const allOffers: any[] = []
    const statusCounts: Record<string, number> = {}
    let processedCount = 0
    
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
          
          offers.forEach((offer: any) => {
            allOffers.push(offer)
            const status = offer.status || 'UNKNOWN'
            statusCounts[status] = (statusCounts[status] || 0) + 1
          })
        }
        
        processedCount++
        
        // 進捗表示（10件ごと）
        if (processedCount % 10 === 0) {
          console.log(`  処理中: ${processedCount}/${skus.length}`)
        }
        
        // レート制限対策
        await new Promise(resolve => setTimeout(resolve, 50))
        
      } catch (e) {
        console.warn(`⚠️ SKU ${itemSku} のOffer取得スキップ:`, e)
      }
    }
    
    console.log(`✅ ${allOffers.length}件のOfferを取得`)
    
    // 未公開（幽霊）Offerを抽出
    const unpublishedOffers = allOffers.filter((offer: any) => 
      offer.status !== 'PUBLISHED'
    )
    
    console.log(`📊 ステータス内訳:`, JSON.stringify(statusCounts, null, 2))
    console.log(`👻 幽霊Offer: ${unpublishedOffers.length}件`)
    
    return NextResponse.json({
      success: true,
      account: account,
      total: allOffers.length,
      inventoryItemCount: skus.length,
      offset: offset,
      limit: limit,
      hasMore: inventoryData.next ? true : false,
      statusCounts: statusCounts,
      unpublishedCount: unpublishedOffers.length,
      offers: allOffers.map((offer: any) => ({
        offerId: offer.offerId,
        sku: offer.sku,
        status: offer.status,
        listingId: offer.listing?.listingId,
        marketplaceId: offer.marketplaceId,
        format: offer.format,
        availableQuantity: offer.availableQuantity,
        price: offer.pricingSummary?.price,
        createdAt: offer.listing?.createdDate,
        isGhost: offer.status !== 'PUBLISHED'
      })),
      ghostOffers: unpublishedOffers.map((offer: any) => ({
        offerId: offer.offerId,
        sku: offer.sku,
        status: offer.status
      }))
    })
    
  } catch (error: any) {
    console.error('❌ Offers一覧取得エラー:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Offers一覧取得に失敗しました'
      },
      { status: 500 }
    )
  }
}

/**
 * 特定SKUのOffer取得
 */
async function getOffersForSku(sku: string, account: string, headers: HeadersInit) {
  const offerUrl = `${EBAY_API_BASE}/sell/inventory/v1/offer?sku=${encodeURIComponent(sku)}`
  
  console.log(`📡 API URL: ${offerUrl}`)
  
  const response = await fetch(offerUrl, {
    method: 'GET',
    headers: headers
  })
  
  if (!response.ok) {
    const error = await response.json()
    console.error('❌ eBay API エラー:', JSON.stringify(error, null, 2))
    
    // 404の場合はOfferがないだけ
    if (response.status === 404) {
      return NextResponse.json({
        success: true,
        account: account,
        total: 0,
        offers: [],
        ghostOffers: [],
        message: `SKU "${sku}" にはOfferがありません`
      })
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: error.errors?.[0]?.message || 'Offers取得に失敗しました',
        details: error
      },
      { status: response.status }
    )
  }
  
  const data = await response.json()
  const offers = data.offers || []
  
  console.log(`✅ ${offers.length}件のOfferを取得`)
  
  const statusCounts: Record<string, number> = {}
  offers.forEach((offer: any) => {
    const status = offer.status || 'UNKNOWN'
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })
  
  const unpublishedOffers = offers.filter((offer: any) => 
    offer.status !== 'PUBLISHED'
  )
  
  return NextResponse.json({
    success: true,
    account: account,
    sku: sku,
    total: offers.length,
    statusCounts: statusCounts,
    unpublishedCount: unpublishedOffers.length,
    offers: offers.map((offer: any) => ({
      offerId: offer.offerId,
      sku: offer.sku,
      status: offer.status,
      listingId: offer.listing?.listingId,
      marketplaceId: offer.marketplaceId,
      format: offer.format,
      availableQuantity: offer.availableQuantity,
      price: offer.pricingSummary?.price,
      createdAt: offer.listing?.createdDate,
      isGhost: offer.status !== 'PUBLISHED'
    })),
    ghostOffers: unpublishedOffers.map((offer: any) => ({
      offerId: offer.offerId,
      sku: offer.sku,
      status: offer.status
    }))
  })
}
