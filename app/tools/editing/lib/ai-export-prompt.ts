// app/tools/editing/lib/ai-export-prompt.ts
/**
 * AI解析用プロンプト生成ユーティリティ（完全版）
 * 
 * 取得項目:
 * 1. 原産国（SellerMirrorデータ照合 + 新規調査）
 * 2. 市場調査データ（最安値、平均価格、競合数、販売数）
 * 3. サイズ3辺（width_cm, length_cm, height_cm）
 * 4. 重量（weight_g）
 * 5. 英語タイトルリライト（eBay SEO最適化、80文字以内）
 * 6. HTS推測（既存ツールの結果を含む）
 * 7. 素材（material）
 * 8. その他必要項目
 * 
 * 🔥 v2.0: AI監査用JSONエクスポート機能追加
 */

interface ProductForAI {
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

// ============================================================
// 🔥 AI監査用JSONエクスポート（新機能）
// ============================================================

/**
 * AI監査用の構造化データを生成
 * HTSコード、利益計算、配送設定の妥当性をAIがチェックするためのデータ
 */
export function generateAIAuditData(products: ProductForAI[]): object[] {
  return products.map(p => {
    const listingData = p.listing_data || {}
    const ebayData = p.ebay_api_data || {}
    
    // コスト計算
    const purchasePrice = p.purchase_price_jpy || p.cost_price || p.price_jpy || 0
    const exchangeRate = listingData.exchange_rate || 150
    const finalPrice = listingData.ddp_price_usd || 0
    const ebayFee = finalPrice * 0.132
    const paypalFee = finalPrice * 0.029 + 0.30
    const shippingCost = listingData.shipping_cost_usd || 0
    const purchasePriceUsd = purchasePrice / exchangeRate
    const estimatedProfit = finalPrice - purchasePriceUsd - ebayFee - paypalFee - shippingCost
    
    return {
      // 1. 商品基本情報
      basicInfo: {
        sku: p.sku || '',
        productId: p.id,
        title: p.english_title || p.title_en || p.title || '',
        titleJa: p.title || '',
        categoryId: ebayData.category_id || p.ebay_category_id || p.category_id || '',
        categoryName: p.category_name || '',
        material: listingData.item_specifics?.Material || p.material || 'Not specified',
        countryOfOrigin: listingData.item_specifics?.['Country/Region of Manufacture'] || p.origin_country || 'Unknown',
        condition: listingData.condition || listingData.condition_en || p.condition_name || p.condition || 'Used',
        conditionId: listingData.condition_id || 3000,
        conditionDescriptors: listingData.condition_descriptors || null,
      },
      
      // 2. コスト計算の根拠
      costBreakdown: {
        purchasePriceJpy: purchasePrice,
        exchangeRate: exchangeRate,
        purchasePriceUsd: Math.round(purchasePriceUsd * 100) / 100,
        finalPriceUsd: finalPrice,
        ebayFeeUsd: Math.round(ebayFee * 100) / 100,
        ebayFeePercent: 13.2,
        paymentFeeUsd: Math.round(paypalFee * 100) / 100,
        shippingCostUsd: shippingCost,
        estimatedProfitUsd: Math.round(estimatedProfit * 100) / 100,
        profitMarginPercent: finalPrice > 0 ? Math.round((estimatedProfit / finalPrice) * 10000) / 100 : 0,
      },
      
      // 3. 物流データ
      logistics: {
        weightGrams: listingData.weight_g || p.weight_g || 0,
        dimensions: {
          lengthCm: listingData.length_cm || p.length_cm || 0,
          widthCm: listingData.width_cm || p.width_cm || 0,
          heightCm: listingData.height_cm || p.height_cm || 0,
        },
        shippingPolicyId: listingData.shipping_policy_id?.toString() || '',
        shippingPolicyName: listingData.shipping_policy_name || '',
        carrierCode: listingData.carrier_code || 'JAPANPOST',
      },
      
      // 4. 税務データ
      taxCompliance: {
        htsCode: listingData.hts_code || p.hts_code || '',
        htsDescription: listingData.hts_description || '',
        dutyRatePercent: listingData.duty_rate || p.hts_duty_rate || 0,
        confidenceLevel: p.hts_confidence || 'unknown',
      },
      
      // 5. 市場データ
      marketData: {
        lowestPriceUsd: p.sm_lowest_price || listingData.sm_lowest_price || null,
        averagePriceUsd: p.sm_average_price || listingData.sm_average_price || null,
        competitorCount: p.sm_competitor_count || listingData.sm_competitor_count || null,
        salesCount: p.sm_sales_count || listingData.sm_sales_count || null,
      },
      
      // 6. 在庫情報
      inventory: {
        quantity: p.stock_quantity || p.current_stock || 1,
      },
      
      // 7. Item Specifics
      itemSpecifics: listingData.item_specifics || {},
      
      // 8. eBay API送信予定データ
      ebayApiPayload: {
        inventoryItem: {
          sku: p.sku,
          condition: listingData.condition || 'USED_EXCELLENT',
          conditionId: listingData.condition_id || 4000,
          conditionDescriptors: listingData.condition_descriptors || null,
        },
        offer: {
          categoryId: ebayData.category_id || p.ebay_category_id || '',
          price: finalPrice,
          quantity: p.stock_quantity || p.current_stock || 1,
        },
      },
      
      // 9. データ品質フラグ
      dataQuality: {
        hasPurchasePrice: purchasePrice > 0,
        hasFinalPrice: finalPrice > 0,
        hasWeight: (listingData.weight_g || p.weight_g || 0) > 0,
        hasDimensions: (listingData.length_cm || p.length_cm || 0) > 0,
        hasHtsCode: !!(listingData.hts_code || p.hts_code),
        hasOriginCountry: !!(listingData.item_specifics?.['Country/Region of Manufacture'] || p.origin_country),
        hasConditionDescriptors: !!listingData.condition_descriptors,
        isProfitable: estimatedProfit > 0,
      },
    }
  })
}

/**
 * AI監査用プロンプト（JSONデータ + 検証指示）を生成
 */
export function generateAIAuditPrompt(products: ProductForAI[]): string {
  const auditData = generateAIAuditData(products)
  
  // 警告が必要な商品をカウント
  const warnings = {
    noHts: products.filter(p => !(p.listing_data?.hts_code || p.hts_code)).length,
    noOrigin: products.filter(p => !(p.listing_data?.item_specifics?.['Country/Region of Manufacture'] || p.origin_country)).length,
    noWeight: products.filter(p => !(p.listing_data?.weight_g || p.weight_g)).length,
    noProfit: auditData.filter((d: any) => !d.dataQuality.isProfitable).length,
    noConditionDescriptors: products.filter(p => !p.listing_data?.condition_descriptors).length,
  }
  
  return `あなたはeBay輸出の専門コンサルタント、および国際物流・税関のスペシャリストです。
以下のJSONデータを分析し、出品の「安全性」と「利益の妥当性」を多角的に検証してください。

【対象商品】${products.length}件

【警告サマリー】
- HTSコード未設定: ${warnings.noHts}件
- 原産国未設定: ${warnings.noOrigin}件
- 重量未設定: ${warnings.noWeight}件
- 赤字の可能性: ${warnings.noProfit}件
- Condition Descriptors未設定: ${warnings.noConditionDescriptors}件

【検証ステップ】

1. **HTSコードの整合性**: 
   - 商品タイトルと素材から判断して、設定されたHTSコード（関税番号）は米国税関の基準で適切か？
   - トレカ: 4911.91.40 (紙製) または 9504.40.00 (カードゲーム)
   - フィギュア: 9503.00.00
   - カメラ: 9006.59
   - 時計: 9102.xx

2. **関税リスクの評価**: 
   - このHTSコードに基づき、バイヤーが支払うべき想定関税率は正しいか？
   - アンチダンピング税等のリスクはないか？

3. **価格計算の正確性**: 
   - 為替、手数料、送料、原価から計算された「最終利益」に計算ミスはないか？
   - eBay手数料: 13.2%
   - 決済手数料: 2.9% + $0.30

4. **物流の妥当性**: 
   - 商品重量に対し、選択された配送ポリシーの料金設定は赤字のリスクがないか？

5. **eBay規約遵守**: 
   - このカテゴリで必須とされるAspects（属性）は全て網羅されているか？

6. **Condition設定**: 
   - conditionIdとconditionDescriptorsは、カテゴリに対して適切か？
   - トレカカテゴリ(183454等)は conditionId: 4000 + conditionDescriptors が必須

【入力データ (JSON)】
${JSON.stringify(auditData, null, 2)}

【出力形式】
各商品について以下の形式でレポートしてください：

## [SKU: xxx] 商品名
- ✅ 正常: [項目]
- ⚠️ 警告: [項目] - 理由
- ❌ エラー: [項目] - 理由と修正方法

最後に全体のサマリーを記載してください。`
}

/**
 * AIエクスポート用プロンプト生成（選択商品のCSV + 分析指示）
 */
export function generateAIExportPrompt(products: ProductForAI[]): string {
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

  // HTS/原産国が不明な商品をリストアップ
  const needsHTSCheck = products.filter(p => 
    !p.hts_code || 
    p.hts_confidence === 'uncertain' || 
    p.hts_confidence === 'low'
  )
  
  const needsOriginCheck = products.filter(p => 
    !p.origin_country || 
    p.origin_country === 'UNKNOWN'
  )

  const needsSizeCheck = products.filter(p => 
    !p.length_cm || !p.width_cm || !p.height_cm || !p.weight_g
  )

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI商品データ完全分析 - 一括取得プロンプト
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 対象商品: ${products.length}件
⚠️ HTS要確認: ${needsHTSCheck.length}件
⚠️ 原産国要確認: ${needsOriginCheck.length}件
⚠️ サイズ要確認: ${needsSizeCheck.length}件

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 商品データ（CSV形式）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${csvContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 取得すべきデータ項目（各商品について以下を全て取得）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

各商品について、以下の順番で処理してください：

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【1】原産国の確定（最重要・赤字リスクあり）                    │
└─────────────────────────────────────────────────────────────────┘

**手順:**
1. **既存データの確認**
   - CSVの「既存原産国」列にデータがある場合 → それを使用（信頼度: high）
   - SellerMirror（SM）データに原産国情報がある場合 → それを使用（信頼度: medium）
   
2. **新規調査（既存データがない/UNKNOWNの場合）**
   以下の方法で必ず実データを確認：
   
   a) メーカー公式サイト
      - 商品ページで "Made in XX" を確認
      - 製品仕様書で "Country of Origin" を確認
   
   b) Amazon Japan / 楽天市場
      - 商品詳細ページで原産国表記を確認
      - レビューコメントで「〇〇製」の記載を探す
   
   c) 商品パッケージ画像
      - 画像URLから商品画像を確認
      - パッケージや本体の表記を読み取る
   
   d) 信頼できる小売店
      - ヨドバシ、ビックカメラなどの商品情報
   
   **❌ 禁止事項:**
   - ブランド名からの推測（例: SONYだから日本製 → 実際は中国製の可能性大）
   - カテゴリからの推測（例: アニメグッズだから日本製 → 中国製が多い）
   
   **原産国コード（ISO 3166-1 alpha-2）:**
   
   **主要アジア:**
   - JP: 日本
   - CN: 中国
   - KR: 韓国
   - TW: 台湾
   - HK: 香港
   - VN: ベトナム
   - TH: タイ
   - SG: シンガポール
   - MY: マレーシア
   - ID: インドネシア
   - PH: フィリピン
   - IN: インド
   - PK: パキスタン
   - BD: バングラデシュ
   
   **北米・南米:**
   - US: アメリカ
   - CA: カナダ
   - MX: メキシコ
   - BR: ブラジル
   - AR: アルゼンチン
   - CL: チリ
   
   **ヨーロッパ:**
   - GB: イギリス
   - DE: ドイツ
   - FR: フランス
   - IT: イタリア
   - ES: スペイン
   - NL: オランダ
   - BE: ベルギー
   - SE: スウェーデン
   - PL: ポーランド
   - CZ: チェコ
   - HU: ハンガリー
   - RO: ルーマニア
   - PT: ポルトガル
   - AT: オーストリア
   - CH: スイス
   
   **オセアニア:**
   - AU: オーストラリア
   - NZ: ニュージーランド
   
   **中東・アフリカ:**
   - AE: アラブ首長国連邦
   - SA: サウジアラビア
   - IL: イスラエル
   - TR: トルコ
   - ZA: 南アフリカ
   - EG: エジプト
   
   **その他:**
   - UNKNOWN: どうしても確認できない場合のみ
   - NEEDS_MANUAL_CHECK: 断定できない場合（手動確認必要）
   
   ⚠️ 不明な場合は「NEEDS_MANUAL_CHECK」として、赤字リスクを回避してください。

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【2】市場調査データの取得（SellerMirrorデータ活用）            │
└─────────────────────────────────────────────────────────────────┘

**既存データの確認:**
CSVの以下の列にデータがある場合、それを優先使用：
- SM最安値($): SellerMirrorから取得済みの最安値
- SM平均価格($): SellerMirrorから取得済みの平均価格
- SM競合数: SellerMirrorから取得済みの競合出品者数
- SM販売数: SellerMirrorから取得済みの販売実績

**新規調査（既存データがない場合）:**
以下のサイトで検索して取得：
- eBay（英語タイトルまたは型番で検索）
- Amazon.com
- 専門マーケットプレイス

取得項目:
- 最安値（USD）
- 平均価格（USD）
- 競合出品者数
- 過去30日の販売数（推定可）

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【3】サイズ・重量の推定/確認                                   │
└─────────────────────────────────────────────────────────────────┘

**既存データの確認:**
CSVの「現在の〇〇」列にデータがある場合、妥当性をチェック：
- 明らかに間違っている場合（例: フィギュアなのに100cm）→ 修正
- 合理的な範囲内 → そのまま使用

**新規取得/推定:**
1. メーカー公式サイトで製品仕様を確認
2. Amazon/楽天の商品情報を確認
3. 類似商品の平均値から推定
4. カテゴリの典型的なサイズから推定

**目安:**
- トレカ: 6cm × 9cm × 0.1cm, 5g
- フィギュア(小): 10cm × 8cm × 15cm, 200g
- フィギュア(大): 20cm × 15cm × 30cm, 1000g
- ゲームソフト: 13.5cm × 19cm × 1.5cm, 150g
- 書籍: 15cm × 21cm × 2cm, 300g

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【4】英語タイトルのリライト（eBay SEO最適化）                 │
└─────────────────────────────────────────────────────────────────┘

**要件:**
- 80文字以内（eBay推奨）
- 主要キーワードを前方配置
- ブランド名・型番・商品タイプを含む
- 自然な英語表現

**構造:**
\`[Brand] [Product Type] [Key Features] [Condition] [Additional Info]\`

**例:**
- ❌ 悪い: "Japanese Anime Figure Collectible Item"
- ✅ 良い: "Bandai One Piece Luffy Gear 5 Figure 1/7 Scale Limited Edition New"

**VERO対応（オプション）:**
- ブランド名なし版も生成（中古品用）
- 例: "One Piece Luffy Gear 5 Figure 1/7 Scale Collectible Pre-Owned"

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【5】HTSコードの推定/確認                                      │
└─────────────────────────────────────────────────────────────────┘

**既存データの確認:**
CSVの「既存HTSコード」列にデータがあり、信頼度が "high" または "medium" の場合:
- そのまま使用
- ただし明らかに間違っている場合は修正

**新規推定（既存データがない/uncertainの場合）:**

**判定優先順位:**
1. **カテゴリー優先品**
   - 9503: 玩具・フィギュア・プラモデル
   - 4911.91: トレーディングカード
   - 9102: 腕時計
   - 9006: カメラ・光学機器
   - 9208: オルゴール
   - 8523: ゲームソフト（物理メディア）

2. **機能優先品**
   - 8471: コンピュータ・周辺機器
   - 8517: 通信機器
   - 8528: モニター・ディスプレイ

3. **素材優先品**
   - 3926: プラスチック製品
   - 7326: 鉄鋼製品
   - 4901: 書籍

**主要HTSコード参考表:**
- 4911.91.40: トレーディングカード（紙製）
- 9503.00.00: 玩具（フィギュア、プラモデル含む）
- 9504.40.00: トランプ・カードゲーム
- 9102.11: 腕時計（自動巻）
- 9006.59: デジタルカメラ
- 8523.49: ゲームソフト（ディスク）
- 4901.99: 書籍・雑誌

不明な場合: "9999.99.9999" + 理由を記載

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【6】素材（Material）の特定                                    │
└─────────────────────────────────────────────────────────────────┘

商品の主要素材を特定：
- Plastic（プラスチック、PVC、ABS）
- Metal（金属、合金）
- Paper（紙、カードボード）
- Textile（布、繊維）
- Wood（木材）
- Glass（ガラス）
- Mixed（複合素材）

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【7】その他の補足情報                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【７】市場分析データ（スコア計算用）                          │
└─────────────────────────────────────────────────────────────────┘

**廃盤状況 (discontinued_status):**
- ACTIVE: 現行品（通常販売中）
- DISCONTINUED_RECENT: 廃盤（1年以内）
- DISCONTINUED_OLD: 廃盤（1年以上）
- LIMITED_EDITION: 限定品（生産数が限られている）
- UNKNOWN: 不明

**プレミア率 (premium_rate):**
- 定価に対する現在価格の比率
- 例: 定価$100の商品が$150 → premium_rate: 150%
- 計算式: (current_price / msrp) * 100

**国内流通量 (domestic_availability):**
- ABUNDANT: 豊富（100+在庫）
- MODERATE: 中程度（20-99在庫）
- SCARCE: 少ない（5-19在庫）
- RARE: 希少（1-4在庫）
- OUT_OF_STOCK: 在庫なし

**コミュニティスコア (community_score):**
- レビュー数、評価、フォーラムでの人気度
- 0-100点で評価
- 計算方法: 
  * レビュー数 > 100 → +30点
  * 平均評価 > 4.5 → +40点
  * フォーラム言及数 > 50 → +30点

**将来価値予測 (future_value_trend):**
- INCREASING: 上昇傾向（コレクター需要增、価格上昇中）
- STABLE: 安定（価格変動少）
- DECREASING: 下降傾向（人気低下、価格下落中）
- UNKNOWN: 不明

**人気キャラクター/シリーズ (popular_character_series):**
- 例: "Pokemon", "One Piece", "Star Wars", "Marvel"
- 人気度: HIGH / MEDIUM / LOW / NONE

**商品特性 (product_characteristics):**
- is_easy_to_ship: 発送しやすい（小型・軽量・壊れにくい）
- bulk_order_potential: 大量注文されやすい
- turnover_rate: 回転率（HIGH / MEDIUM / LOW）
- price_stability: 価格安定性（STABLE / VOLATILE）

**サイズ・重量評価 (size_weight_rating):**
- COMPACT: コンパクト（<15cm, <200g） → 高スコア
- MEDIUM: 中型（15-30cm, 200-1000g） → 中スコア
- LARGE: 大型（>30cm, >1000g） → 低スコア

┌─────────────────────────────────────────────────────────────────┐
│ ✅ 【８】その他の補足情報                                          │
└─────────────────────────────────────────────────────────────────┘

以下も可能な範囲で取得：
- 発売日（release_date）
- メーカー名（manufacturer）
- 型番（model_number）
- JAN/UPC/EAN（barcode）
- VERO該当の可能性（is_vero_risk）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 出力フォーマット（JSON配列 - 必須）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

以下のJSON形式で全商品のデータを返してください：

\`\`\`json
[
  {
    "product_id": "商品UUID",
    "sku": "SKU",
    
    "origin_country": {
      "code": "2文字ISOコード (JP/CN/US/KR/TW/HK/VN/TH/SG/MY/ID/PH/IN/GB/DE/FR/IT/ES/NL/BE/AU/NZ/MX/BR/AE/TR/ZA/NEEDS_MANUAL_CHECK/UNKNOWN)",
      "confidence": "confirmed|suspected|unknown",
      "source": "データ取得元（例: Package marking/Official site/Amazon listing/MANUAL_CHECK_REQUIRED）",
      "manual_verification_required": true/false,
      "notes": "補足情報（例: パッケージに'Made in China'表記あり）"
    },
    
    "market_data": {
      "lowest_price_usd": 最安値,
      "average_price_usd": 平均価格,
      "competitor_count": 競合数,
      "sales_count": 販売数,
      "data_source": "SellerMirror|eBay|Amazon|推定"
    },
    
    "dimensions": {
      "length_cm": 長さ,
      "width_cm": 幅,
      "height_cm": 高さ,
      "weight_g": 重量,
      "confidence": "confirmed|estimated",
      "source": "メーカー公式|Amazon|推定"
    },
    
    "title_rewrite": {
      "optimized_title": "最適化された英語タイトル（80文字以内）",
      "title_no_brand": "ブランド名なし版（VERO対応、オプション）",
      "keywords": ["主要", "キーワード", "リスト"]
    },
    
    "hts_classification": {
      "hts_code": "HTSコード（例: 9503.00.00）",
      "confidence": "high|medium|low|uncertain",
      "description": "HTSコード説明",
      "duty_rate": 関税率,
      "source": "既存データ|新規推定"
    },
    
    "material": {
      "primary": "主要素材",
      "secondary": "副次素材（オプション）",
      "details": "詳細（例: PVC + ABS樹脂）"
    },
    
    "market_analysis": {
      "discontinued_status": "ACTIVE|DISCONTINUED_RECENT|DISCONTINUED_OLD|LIMITED_EDITION|UNKNOWN",
      "premium_rate": プレミア率(%),
      "domestic_availability": "ABUNDANT|MODERATE|SCARCE|RARE|OUT_OF_STOCK",
      "community_score": 0-100点,
      "future_value_trend": "INCREASING|STABLE|DECREASING|UNKNOWN",
      "popular_character_series": "人気キャラ/シリーズ名",
      "popularity_level": "HIGH|MEDIUM|LOW|NONE"
    },
    
    "product_characteristics": {
      "is_easy_to_ship": true/false,
      "bulk_order_potential": true/false,
      "turnover_rate": "HIGH|MEDIUM|LOW",
      "price_stability": "STABLE|VOLATILE",
      "size_weight_rating": "COMPACT|MEDIUM|LARGE"
    },
    
    "additional_info": {
      "release_date": "発売日（YYYY-MM-DD）",
      "manufacturer": "メーカー名",
      "model_number": "型番",
      "barcode": "JAN/UPC/EAN",
      "vero_risk": true/false
    },
    
    "data_quality": {
      "origin_confirmed": true/false,
      "market_data_available": true/false,
      "dimensions_confirmed": true/false,
      "hts_reliable": true/false
    },
    
    "notes": "特記事項・注意点"
  }
]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 処理手順
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 上記のCSVデータを1商品ずつ処理
2. 各商品について【1】〜【7】の全項目を取得
3. 取得完了ごとに "✅ [SKU] 完了" と表示
4. 全商品処理完了後、JSON配列を出力
5. **重要**: JSON出力後、必ず以下を実行

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ データベース自動更新（MCP Supabaseツール使用）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JSON出力完了後、MCPツール \`supabase\` を使って以下のSQLを自動実行：

\`\`\`sql
UPDATE products
SET 
  title_en = '[最適化タイトル]',
  origin_country = '[原産国コード]',
  hts_code = '[HTSコード]',
  hts_confidence = '[信頼度]',
  material = '[素材]',
  listing_data = COALESCE(listing_data, '{}'::jsonb) || jsonb_build_object(
    'length_cm', [長さ],
    'width_cm', [幅],
    'height_cm', [高さ],
    'weight_g', [重量],
    'sm_lowest_price', [最安値],
    'sm_average_price', [平均価格],
    'sm_competitor_count', [競合数],
    'sm_sales_count', [販売数],
    'title_no_brand', '[ブランドなしタイトル]',
    'origin_source', '[原産国ソース]',
    'dimensions_source', '[サイズソース]',
    'ai_updated_at', NOW()
  ),
  updated_at = NOW()
WHERE id = '[商品UUID]';
\`\`\`

各商品の更新完了ごとに "✅ DB更新完了: [SKU]" と表示

全商品更新完了後:
"🎉 データベース更新完了: ${products.length}件"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 処理開始 - 全自動モード
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

上記の手順で、全${products.length}件の商品データを取得し、JSON出力後に自動でSupabaseに保存してください。

⚠️ 重要な注意事項:
1. 原産国は必ず実データで確認（推測禁止）
2. SellerMirrorデータがあれば優先使用
3. 不明なデータは "UNKNOWN" または null
4. HTSコードの誤りは関税追加請求のリスクあり
5. 全商品処理後、必ずSupabase更新を実行

それでは処理を開始してください！
`
}
