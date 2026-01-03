// app/api/ebay/get-item-details-trading/route.ts
/**
 * eBay Trading API GetItem
 * 
 * より詳細な商品情報を取得（重量・寸法・互換性リスト等）
 * 注意: Trading APIは自分のリスティングに対してのみ完全なデータを返す
 *       他のセラーの商品は一部のデータのみ取得可能
 */
import { NextRequest, NextResponse } from 'next/server'

const EBAY_TRADING_API = 'https://api.ebay.com/ws/api.dll'

interface GetItemRequest {
  itemId: string
  /** 他人のリスティングも取得する場合はfalse（制限あり） */
  ownListing?: boolean
}

/**
 * Trading API GetItem を呼び出し
 */
async function callGetItem(itemId: string, authToken: string) {
  const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${authToken}</eBayAuthToken>
  </RequesterCredentials>
  <ItemID>${itemId}</ItemID>
  <DetailLevel>ReturnAll</DetailLevel>
  <IncludeItemSpecifics>true</IncludeItemSpecifics>
  <IncludeItemCompatibilityList>true</IncludeItemCompatibilityList>
</GetItemRequest>`

  const response = await fetch(EBAY_TRADING_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'X-EBAY-API-SITEID': '0', // US
      'X-EBAY-API-COMPATIBILITY-LEVEL': '1193',
      'X-EBAY-API-CALL-NAME': 'GetItem',
      'X-EBAY-API-APP-NAME': process.env.EBAY_CLIENT_ID || '',
      'X-EBAY-API-DEV-NAME': process.env.EBAY_DEV_ID || '',
      'X-EBAY-API-CERT-NAME': process.env.EBAY_CLIENT_SECRET || ''
    },
    body: xmlRequest
  })

  const xmlText = await response.text()
  return xmlText
}

/**
 * XMLからItem Specificsを抽出
 */
function extractItemSpecifics(xml: string): Record<string, string> {
  const specifics: Record<string, string> = {}
  
  // NameValueList を探す
  const nvlRegex = /<NameValueList>([\s\S]*?)<\/NameValueList>/g
  let match
  
  while ((match = nvlRegex.exec(xml)) !== null) {
    const content = match[1]
    const nameMatch = content.match(/<Name>([^<]+)<\/Name>/)
    const valueMatch = content.match(/<Value>([^<]+)<\/Value>/)
    
    if (nameMatch && valueMatch) {
      specifics[nameMatch[1]] = valueMatch[1]
    }
  }
  
  return specifics
}

/**
 * XMLから重量を抽出（グラムで返す）
 */
function extractWeight(xml: string): number | undefined {
  // ShippingPackageDetails > WeightMajor / WeightMinor を探す
  const majorMatch = xml.match(/<WeightMajor[^>]*>([^<]+)<\/WeightMajor>/)
  const minorMatch = xml.match(/<WeightMinor[^>]*>([^<]+)<\/WeightMinor>/)
  
  if (majorMatch || minorMatch) {
    const majorLbs = majorMatch ? parseFloat(majorMatch[1]) : 0
    const minorOz = minorMatch ? parseFloat(minorMatch[1]) : 0
    
    // ポンド・オンスをグラムに変換
    const totalGrams = (majorLbs * 453.592) + (minorOz * 28.3495)
    return Math.round(totalGrams)
  }
  
  // ShippingDetails > CalculatedShippingRate > WeightMajor
  const calcMajorMatch = xml.match(/<CalculatedShippingRate>[\s\S]*?<WeightMajor[^>]*>([^<]+)<\/WeightMajor>/)
  const calcMinorMatch = xml.match(/<CalculatedShippingRate>[\s\S]*?<WeightMinor[^>]*>([^<]+)<\/WeightMinor>/)
  
  if (calcMajorMatch || calcMinorMatch) {
    const majorLbs = calcMajorMatch ? parseFloat(calcMajorMatch[1]) : 0
    const minorOz = calcMinorMatch ? parseFloat(calcMinorMatch[1]) : 0
    const totalGrams = (majorLbs * 453.592) + (minorOz * 28.3495)
    return Math.round(totalGrams)
  }
  
  return undefined
}

/**
 * XMLから寸法を抽出（cmで返す）
 */
function extractDimensions(xml: string): { length: number; width: number; height: number } | undefined {
  // ShippingPackageDetails > PackageLength/Width/Depth を探す
  const lengthMatch = xml.match(/<PackageLength[^>]*>([^<]+)<\/PackageLength>/)
  const widthMatch = xml.match(/<PackageWidth[^>]*>([^<]+)<\/PackageWidth>/)
  const depthMatch = xml.match(/<PackageDepth[^>]*>([^<]+)<\/PackageDepth>/)
  
  if (lengthMatch && widthMatch && depthMatch) {
    // 単位を確認（デフォルトはインチ）
    const unitMatch = xml.match(/<PackageLength[^>]*unit="([^"]+)"/)
    const unit = unitMatch ? unitMatch[1] : 'inches'
    
    let length = parseFloat(lengthMatch[1])
    let width = parseFloat(widthMatch[1])
    let height = parseFloat(depthMatch[1])
    
    // インチならcmに変換
    if (unit === 'inches' || unit === 'in') {
      length = length * 2.54
      width = width * 2.54
      height = height * 2.54
    }
    
    return {
      length: Math.round(length * 10) / 10,
      width: Math.round(width * 10) / 10,
      height: Math.round(height * 10) / 10
    }
  }
  
  return undefined
}

/**
 * XMLから基本情報を抽出
 */
function extractBasicInfo(xml: string) {
  const getElement = (name: string): string | undefined => {
    const match = xml.match(new RegExp(`<${name}>([^<]+)</${name}>`))
    return match ? match[1] : undefined
  }
  
  return {
    itemId: getElement('ItemID'),
    title: getElement('Title'),
    primaryCategory: getElement('CategoryID'),
    categoryName: getElement('CategoryName'),
    conditionID: getElement('ConditionID'),
    conditionDisplayName: getElement('ConditionDisplayName'),
    currentPrice: getElement('CurrentPrice'),
    currency: xml.match(/<CurrentPrice[^>]*currencyID="([^"]+)"/)?.[1],
    country: getElement('Country'),
    location: getElement('Location'),
    sku: getElement('SKU'),
    quantity: getElement('Quantity'),
    quantitySold: getElement('QuantitySold')
  }
}

/**
 * XMLから画像URLを抽出
 */
function extractImages(xml: string): string[] {
  const images: string[] = []
  const urlRegex = /<PictureURL>([^<]+)<\/PictureURL>/g
  let match
  
  while ((match = urlRegex.exec(xml)) !== null) {
    images.push(match[1])
  }
  
  return images
}

export async function POST(request: NextRequest) {
  try {
    const body: GetItemRequest = await request.json()
    const { itemId } = body

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'itemId は必須です' },
        { status: 400 }
      )
    }

    // itemIdからv1|形式を除去
    const cleanItemId = itemId.startsWith('v1|') 
      ? itemId.split('|')[1] 
      : itemId

    console.log('🔍 Trading API GetItem:', cleanItemId)

    // 認証トークンを取得
    const authToken = process.env.EBAY_USER_TOKEN_MJT || process.env.EBAY_USER_TOKEN
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'EBAY_USER_TOKEN が設定されていません' },
        { status: 500 }
      )
    }

    // GetItem API呼び出し
    const xmlResponse = await callGetItem(cleanItemId, authToken)

    // エラーチェック
    if (xmlResponse.includes('<Ack>Failure</Ack>')) {
      const errorMatch = xmlResponse.match(/<ShortMessage>([^<]+)<\/ShortMessage>/)
      const error = errorMatch ? errorMatch[1] : 'Unknown error'
      console.error('❌ Trading API Error:', error)
      
      return NextResponse.json({
        success: false,
        error: `Trading API Error: ${error}`,
        // エラーでもBrowse APIへのフォールバックを示唆
        fallback: 'Use Browse API instead'
      }, { status: 400 })
    }

    // データ抽出
    const basicInfo = extractBasicInfo(xmlResponse)
    const itemSpecifics = extractItemSpecifics(xmlResponse)
    const weight = extractWeight(xmlResponse)
    const dimensions = extractDimensions(xmlResponse)
    const images = extractImages(xmlResponse)

    const itemDetails = {
      itemId: basicInfo.itemId || cleanItemId,
      title: basicInfo.title,
      itemSpecifics,
      weight,
      dimensions,
      categoryId: basicInfo.primaryCategory,
      categoryName: basicInfo.categoryName,
      condition: basicInfo.conditionDisplayName,
      conditionId: basicInfo.conditionID,
      price: basicInfo.currentPrice ? parseFloat(basicInfo.currentPrice) : undefined,
      currency: basicInfo.currency,
      country: basicInfo.country,
      location: basicInfo.location,
      sku: basicInfo.sku,
      quantity: basicInfo.quantity ? parseInt(basicInfo.quantity) : undefined,
      quantitySold: basicInfo.quantitySold ? parseInt(basicInfo.quantitySold) : undefined,
      images,
      // Item Specificsから主要情報を抽出
      brand: itemSpecifics['Brand'],
      model: itemSpecifics['Model'] || itemSpecifics['MPN'],
      color: itemSpecifics['Color'],
      material: itemSpecifics['Material'],
      countryOfManufacture: itemSpecifics['Country/Region of Manufacture'] || itemSpecifics['Country of Manufacture'],
      // データソース
      dataSource: 'trading_api'
    }

    console.log('✅ Trading API 詳細取得成功:', {
      itemId: itemDetails.itemId,
      title: itemDetails.title?.slice(0, 50),
      specsCount: Object.keys(itemSpecifics).length,
      weight,
      dimensions,
      imagesCount: images.length
    })

    return NextResponse.json({
      success: true,
      itemDetails,
      // 生XMLは大きいので返さない
    })

  } catch (error: any) {
    console.error('❌ Trading API GetItem エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
