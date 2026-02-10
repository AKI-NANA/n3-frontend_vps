// app/api/currency/convert/route.ts
/**
 * 通貨変換API - ハイブリッドAI監査パイプライン
 * 
 * USD基準価格を各国通貨に変換
 * 
 * @created 2025-01-16
 */
import { NextRequest, NextResponse } from 'next/server'
import { 
  convertPriceForMarketplace, 
  convertToUsd,
  getExchangeRate,
  getAllRatesFromUsd 
} from '@/lib/services/currency/exchange-service'

/**
 * POST: 価格変換
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { basePriceUsd, targetMarketplace, fromCurrency, toCurrency } = body

    // パターン1: マーケットプレイス指定での変換
    if (basePriceUsd !== undefined && targetMarketplace) {
      const convertedPrice = await convertPriceForMarketplace(basePriceUsd, targetMarketplace)
      
      return NextResponse.json({
        success: true,
        convertedPrice,
      })
    }

    // パターン2: 通貨間の直接変換
    if (fromCurrency && toCurrency && body.price !== undefined) {
      const rate = await getExchangeRate(fromCurrency, toCurrency)
      const convertedPrice = Math.round(body.price * rate * 100) / 100

      return NextResponse.json({
        success: true,
        convertedPrice: {
          price: convertedPrice,
          currency: toCurrency,
          originalPrice: body.price,
          originalCurrency: fromCurrency,
          rate,
        },
      })
    }

    // パターン3: USD変換
    if (body.price !== undefined && fromCurrency) {
      const usdPrice = await convertToUsd(body.price, fromCurrency)

      return NextResponse.json({
        success: true,
        usdPrice,
        originalPrice: body.price,
        originalCurrency: fromCurrency,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid parameters' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('❌ 通貨変換エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET: 為替レート取得
 */
export async function GET(request: NextRequest) {
  try {
    const from = request.nextUrl.searchParams.get('from') || 'USD'
    const to = request.nextUrl.searchParams.get('to')
    const all = request.nextUrl.searchParams.get('all')

    // 全レート取得
    if (all === 'true' || all === '1') {
      const rates = await getAllRatesFromUsd()
      return NextResponse.json({
        success: true,
        baseCurrency: 'USD',
        rates,
        updatedAt: new Date().toISOString(),
      })
    }

    // 特定のレート取得
    if (to) {
      const rate = await getExchangeRate(from, to)
      return NextResponse.json({
        success: true,
        from,
        to,
        rate,
        updatedAt: new Date().toISOString(),
      })
    }

    // デフォルト: 主要通貨レート
    const rates = await getAllRatesFromUsd()
    return NextResponse.json({
      success: true,
      baseCurrency: 'USD',
      rates,
      updatedAt: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('❌ 為替レート取得エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
