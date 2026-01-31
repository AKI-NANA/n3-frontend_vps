// app/api/gemini-prompt/route.ts
/**
 * Gemini用プロンプト生成API
 * 
 * 選択した商品のデータを取得し、AIデータ補完用のプロンプトを生成
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabaseクライアント（サービスロール）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type DataType = 'basic' | 'customs' | 'market' | 'both'

interface ProductForPrompt {
  id: string
  sku: string
  title: string
  title_en?: string
  english_title?: string
  price_jpy?: number
  cost_price?: number
  purchase_price_jpy?: number
  msrp?: number
  release_date?: string
  category_name?: string
  category_id?: string
  ebay_category_id?: string
  length_cm?: number
  width_cm?: number
  height_cm?: number
  weight_g?: number
  condition?: string
  condition_name?: string
  primary_image_url?: string
  gallery_images?: string[]
  brand?: string
  hts_code?: string
  hts_confidence?: string
  hts_duty_rate?: number
  origin_country?: string
  material?: string
  sm_lowest_price?: number
  sm_average_price?: number
  sm_competitor_count?: number
  sm_sales_count?: number
  listing_data?: any
  ebay_api_data?: any
  stock_quantity?: number
  current_stock?: number
}

/**
 * プロンプト生成
 */
function generatePrompt(products: ProductForPrompt[], dataType: DataType): string {
  // CSV生成
  const headers = [
    'SKU',
    '商品ID',
    '商品名(日本語)',
    '現在の英語タイトル',
    '仕入価格(円)',
    '定価(円)',
    'カテゴリ名',
    '現在の長さ(cm)',
    '現在の幅(cm)',
    '現在の高さ(cm)',
    '現在の重さ(g)',
    '状態',
    '画像URL',
    'ブランド',
    '既存HTSコード',
    'HTS信頼度',
    '既存原産国',
    '素材',
    'SM最安値($)',
    'SM平均価格($)',
    'SM競合数',
    'SM販売数'
  ]

  const csvRows = [headers.join(',')]

  products.forEach(p => {
    const row = [
      p.sku || '',
      p.id || '',
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.title_en || p.english_title || '').replace(/"/g, '""')}"`,
      p.cost_price || p.purchase_price_jpy || '',
      p.msrp || p.price_jpy || '',
      `"${(p.category_name || '').replace(/"/g, '""')}"`,
      p.length_cm || p.listing_data?.length_cm || '',
      p.width_cm || p.listing_data?.width_cm || '',
      p.height_cm || p.listing_data?.height_cm || '',
      p.weight_g || p.listing_data?.weight_g || '',
      `"${(p.condition || '').replace(/"/g, '""')}"`,
      `"${(p.primary_image_url || (Array.isArray(p.gallery_images) ? p.gallery_images[0] : '') || '').replace(/"/g, '""')}"`,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      p.hts_code || '',
      p.hts_confidence || 'uncertain',
      p.origin_country || '',
      `"${(p.material || '').replace(/"/g, '""')}"`,
      p.sm_lowest_price || p.listing_data?.sm_lowest_price || '',
      p.sm_average_price || p.listing_data?.sm_average_price || '',
      p.sm_competitor_count || p.listing_data?.sm_competitor_count || '',
      p.sm_sales_count || p.listing_data?.sm_sales_count || ''
    ]
    csvRows.push(row.join(','))
  })

  const csvContent = csvRows.join('\n')

  // データタイプに応じたプロンプト生成
  let instructions = ''
  let outputFields = ''

  if (dataType === 'basic' || dataType === 'both') {
    instructions += `
【基本データ取得】
- 英語タイトル: eBay SEO最適化された80文字以内のタイトル
- サイズ: 長さ(cm), 幅(cm), 高さ(cm)
- 重量: グラム単位
`
    outputFields += `
    "english_title": "最適化された英語タイトル（80文字以内）",
    "length_cm": 数値,
    "width_cm": 数値,
    "height_cm": 数値,
    "weight_g": 数値,
`
  }

  if (dataType === 'customs' || dataType === 'both') {
    instructions += `
【関税情報取得】
- HTSコード: 米国関税番号（例: 9503.00.00）
- 原産国: ISO 2文字コード（JP/CN/US等）
- 素材: 主要素材（Plastic/Metal/Paper等）
- 関税率: パーセンテージ
`
    outputFields += `
    "hts_code": "HTSコード（例: 9503.00.00）",
    "hts_confidence": "high|medium|low",
    "origin_country": "2文字ISOコード（JP/CN/US等）",
    "material": "主要素材",
    "duty_rate": 関税率,
`
  }

  if (dataType === 'market' || dataType === 'both') {
    instructions += `
【市場調査データ取得】
- 最安値(USD): eBayでの最安価格
- 平均価格(USD): eBayでの平均価格
- 競合数: 同一商品を出品している出品者数
- 販売数: 過去30日の推定販売数
- プレミア率: 定価に対する現在価格の比率
- 廃盤状況: ACTIVE/DISCONTINUED_RECENT/DISCONTINUED_OLD/LIMITED_EDITION/UNKNOWN
- コミュニティスコア: 0-100点
`
    outputFields += `
    "sm_lowest_price": 最安値(USD),
    "sm_average_price": 平均価格(USD),
    "sm_competitor_count": 競合数,
    "sm_sales_count": 販売数,
    "premium_rate": プレミア率(%),
    "discontinued_status": "ACTIVE|DISCONTINUED_RECENT|DISCONTINUED_OLD|LIMITED_EDITION|UNKNOWN",
    "community_score": 0-100,
`
  }

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI商品データ取得プロンプト
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 対象商品: ${products.length}件
📋 取得データ: ${dataType === 'both' ? '全データ' : dataType === 'basic' ? '基本データ' : dataType === 'customs' ? '関税情報' : '市場調査'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 商品データ（CSV形式）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${csvContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 取得項目
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${instructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 出力フォーマット（JSON配列 - 必須）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

以下のJSON形式で全商品のデータを返してください：

\`\`\`json
[
  {
    "sku": "SKU",
${outputFields}
    "notes": "特記事項"
  }
]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 処理開始
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

上記のCSVデータを1商品ずつ処理し、指定されたデータを取得してJSON配列で出力してください。

⚠️ 注意事項:
1. 原産国は必ず実データで確認（推測禁止）
2. 不明なデータは null または "UNKNOWN"
3. JSON出力時は必ず \`\`\`json で囲む
4. SKUは必ず含める（データベース更新時のキー）

それでは処理を開始してください！`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds, dataType = 'both' } = body

    console.log(`[gemini-prompt] プロンプト生成: ${productIds?.length || 0}件, タイプ: ${dataType}`)

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '商品IDが指定されていません' },
        { status: 400 }
      )
    }

    // 商品データを取得
    const { data: products, error } = await supabase
      .from('products_master')
      .select('*')
      .in('id', productIds)

    if (error) {
      console.error('[gemini-prompt] DB取得エラー:', error)
      return NextResponse.json(
        { success: false, error: `データベースエラー: ${error.message}` },
        { status: 500 }
      )
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    console.log(`[gemini-prompt] ${products.length}件の商品データを取得`)

    // プロンプト生成
    const prompt = generatePrompt(products as ProductForPrompt[], dataType as DataType)

    return NextResponse.json({
      success: true,
      prompt,
      productCount: products.length,
      dataType
    })

  } catch (error: any) {
    console.error('[gemini-prompt] エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
