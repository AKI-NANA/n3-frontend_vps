/**
 * eBay Marketing API - 広告確認
 * 
 * GET /api/ebay/marketing/check-ad?listingId=XXX&account=green
 * 
 * 指定した出品の広告設定を確認
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/ebay/oauth'

const EBAY_API_BASE = 'https://api.ebay.com'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')
    const account = searchParams.get('account') || 'green'
    
    if (!listingId) {
      return NextResponse.json(
        { success: false, error: 'listingId is required' },
        { status: 400 }
      )
    }
    
    console.log(`\n🔍 広告確認: listingId=${listingId}, account=${account}`)
    
    // アクセストークン取得
    const accountKey = account === 'green' || account === 'GREEN' ? 'account2' : 'account1'
    const accessToken = await getAccessToken(accountKey as 'account1' | 'account2')
    
    // キャンペーン一覧取得
    const campaignsResponse = await fetch(
      `${EBAY_API_BASE}/sell/marketing/v1/ad_campaign?campaign_status=RUNNING&campaign_type=COST_PER_SALE`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US'
        }
      }
    )
    
    if (!campaignsResponse.ok) {
      const error = await campaignsResponse.json()
      console.error('❌ キャンペーン取得エラー:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { success: false, error: 'キャンペーン取得失敗', details: error },
        { status: 500 }
      )
    }
    
    const campaignsData = await campaignsResponse.json()
    const campaigns = campaignsData.campaigns || []
    
    console.log(`✅ キャンペーン数: ${campaigns.length}`)
    
    // 各キャンペーンで広告を検索
    let foundAd = null
    
    for (const campaign of campaigns) {
      // キャンペーンの広告一覧を取得
      const adsResponse = await fetch(
        `${EBAY_API_BASE}/sell/marketing/v1/ad_campaign/${campaign.campaignId}/ad?listing_ids=${listingId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': 'en-US'
          }
        }
      )
      
      if (adsResponse.ok) {
        const adsData = await adsResponse.json()
        if (adsData.ads && adsData.ads.length > 0) {
          foundAd = {
            campaignId: campaign.campaignId,
            campaignName: campaign.campaignName,
            campaignStatus: campaign.campaignStatus,
            ad: adsData.ads[0]
          }
          break
        }
      }
    }
    
    if (foundAd) {
      console.log(`✅ 広告発見: ${foundAd.campaignName}`)
      return NextResponse.json({
        success: true,
        listingId,
        isPromoted: true,
        campaign: {
          campaignId: foundAd.campaignId,
          campaignName: foundAd.campaignName,
          campaignStatus: foundAd.campaignStatus
        },
        ad: {
          adId: foundAd.ad.adId,
          listingId: foundAd.ad.listingId,
          bidPercentage: foundAd.ad.bidPercentage,
          status: foundAd.ad.status
        }
      })
    }
    
    console.log(`⚠️ 広告未設定`)
    return NextResponse.json({
      success: true,
      listingId,
      isPromoted: false,
      campaigns: campaigns.map((c: any) => ({
        campaignId: c.campaignId,
        campaignName: c.campaignName
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
