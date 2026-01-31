/**
 * eBay Inventory Item 取得API
 * 
 * GET /api/ebay/inventory/item?sku=XXX&account=green
 * 
 * eBayに登録されているInventory Itemの詳細を取得
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/ebay/oauth'

const EBAY_API_BASE = 'https://api.ebay.com'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sku = searchParams.get('sku')
    const account = searchParams.get('account') || 'green'
    
    if (!sku) {
      return NextResponse.json(
        { success: false, error: 'SKU is required' },
        { status: 400 }
      )
    }
    
    console.log(`\n🔍 Inventory Item取得: SKU=${sku}, account=${account}`)
    
    // アクセストークン取得
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    
    // Inventory Item取得
    const inventoryResponse = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US'
        }
      }
    )
    
    if (!inventoryResponse.ok) {
      const error = await inventoryResponse.json()
      console.error('❌ Inventory Item取得エラー:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { 
          success: false, 
          error: error.errors?.[0]?.message || 'Inventory Item not found',
          details: error
        },
        { status: inventoryResponse.status }
      )
    }
    
    const inventoryItem = await inventoryResponse.json()
    console.log('✅ Inventory Item取得成功')
    
    // Offer情報も取得
    const offerResponse = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/offer?sku=${encodeURIComponent(sku)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US'
        }
      }
    )
    
    let offers = null
    if (offerResponse.ok) {
      const offerData = await offerResponse.json()
      offers = offerData.offers || []
      console.log(`✅ Offer取得: ${offers.length}件`)
    }
    
    return NextResponse.json({
      success: true,
      sku,
      account,
      inventoryItem: {
        sku: inventoryItem.sku,
        condition: inventoryItem.condition,
        conditionDescription: inventoryItem.conditionDescription,
        availability: inventoryItem.availability,
        product: {
          title: inventoryItem.product?.title,
          description: inventoryItem.product?.description?.substring(0, 200) + '...',
          descriptionLength: inventoryItem.product?.description?.length,
          imageUrls: inventoryItem.product?.imageUrls,
          aspects: inventoryItem.product?.aspects
        },
        packageWeightAndSize: inventoryItem.packageWeightAndSize
      },
      offers: offers?.map((offer: any) => ({
        offerId: offer.offerId,
        status: offer.status,
        listingId: offer.listing?.listingId,
        categoryId: offer.categoryId,
        listingDescription: offer.listingDescription?.substring(0, 200) + '...',
        listingDescriptionLength: offer.listingDescription?.length,
        price: offer.pricingSummary?.price,
        listingPolicies: offer.listingPolicies,
        merchantLocationKey: offer.merchantLocationKey
      }))
    })
    
  } catch (error: any) {
    console.error('❌ エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
