// app/tools/operations/lib/ai-export-prompt.ts
// コピー元: editing/lib/ai-export-prompt.ts
/**
 * AI解析用プロンプト生成ユーティリティ
 * HTS自動判定結果を含めた市場調査データ取得
 */

interface ProductForAI {
  id: string; sku: string; title: string; title_en?: string; english_title?: string; price_jpy: number; msrp?: number; release_date?: string; category_name?: string; category_id?: string; length_cm?: number; width_cm?: number; height_cm?: number; weight_g?: number; condition?: string; image_url?: string; brand?: string; hts_code?: string; hts_confidence?: string; origin_country?: string; material?: string; ebay_api_data?: any
}

interface HTSAutoResult { productId: string; htsCode?: string; confidence?: string; matchedKeywords?: string[]; source?: string; error?: string }

export async function generateAIAnalysisPrompt(products: ProductForAI[], autoHTSResults?: HTSAutoResult[]): Promise<string> {
  const headers = ['SKU','商品ID','商品名(日本語)','英語タイトル','仕入価格(円)','定価(円)','発売日','カテゴリ名','カテゴリID','長さ(cm)','幅(cm)','高さ(cm)','重さ(g)','状態','画像URL','ブランド','自動判定HTS','HTS信頼度','原産国']
  const csvRows = [headers.join(',')]
  
  products.forEach(p => {
    const autoResult = autoHTSResults?.find(r => r.productId === p.id)
    const row = [p.sku || '', p.id || '', `"${(p.title || '').replace(/"/g, '""')}"`, `"${(p.title_en || p.english_title || '').replace(/"/g, '""')}"`, p.price_jpy || '', p.msrp || p.price_jpy || '', p.release_date || '不明', `"${(p.category_name || '').replace(/"/g, '""')}"`, p.category_id || '', p.length_cm || '', p.width_cm || '', p.height_cm || '', p.weight_g || '', `"${(p.condition || '').replace(/"/g, '""')}"`, `"${(p.image_url || '').replace(/"/g, '""')}"`, `"${(p.brand || '').replace(/"/g, '""')}"`, autoResult?.htsCode || p.hts_code || '要確認', autoResult?.confidence || p.hts_confidence || 'uncertain', p.origin_country || '']
    csvRows.push(row.join(','))
  })
  
  const csvContent = csvRows.join('\n')
  const uncertainHTSProducts = products.filter((p) => { const autoResult = autoHTSResults?.find(r => r.productId === p.id); const htsCode = autoResult?.htsCode || p.hts_code; const confidence = autoResult?.confidence || p.hts_confidence; return !htsCode || htsCode === '要確認' || confidence === 'uncertain' || confidence === 'low' })

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI商品分析 - 市場調査 + HTS判定 + 基本情報取得
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 対象商品: ${products.length}件
${uncertainHTSProducts.length > 0 ? `⚠️ HTS要確認商品: ${uncertainHTSProducts.length}件` : '✅ 全商品のHTSコード自動判定済み'}

以下の商品データを**慎重に**分析してください：

${csvContent}

${uncertainHTSProducts.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ HTS自動判定失敗リスト（要手動判定）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

以下の${uncertainHTSProducts.length}商品は自動判定に失敗しました。

${uncertainHTSProducts.map((p, idx) => { const autoResult = autoHTSResults?.find(r => r.productId === p.id); return `【商品${idx + 1}】 SKU: ${p.sku} | 商品名: ${p.title} | カテゴリ: ${p.category_name || 'なし'} | 自動判定結果: ${autoResult?.htsCode || '失敗'}（信頼度: ${autoResult?.confidence || 'uncertain'}）` }).join('\n')}

**HTS判定の優先順位:** 1. カテゴリー優先品（95類=玩具、91類=時計、90類=光学機器など） 2. 機能優先品（84/85類=機械・電気機器） 3. 素材優先品（39類=プラスチック、73類=鉄鋼など）
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 処理手順
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【ステップ1】基本商品情報の取得
✅ 英語タイトル生成（80文字以内、eBay SEO最適化）
✅ サイズ・重量
✅ HTSコード（Harmonized Tariff Schedule）
✅ 原産国（必ず実データに基づく）
✅ 関税率取得

【ステップ2】市場調査データ取得
✅ 日本国内の相場・品薄情報（F_Price_Premium）
✅ コミュニティの話題性（F_Community_Score）
✅ 日本市場全体の流通量（C_Supply_Japan）
✅ メーカーの生産計画（S_Flag_Discontinued）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 出力フォーマット（JSON配列）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`json
[
  {
    "product_id": "商品UUID",
    "sku": "SKU",
    "status": "✅ 処理完了",
    "basic_info": {
      "title_en_new": "英語タイトル（新品・VERO対応ブランド名なし版）",
      "title_en_used": "英語タイトル（中古用・ブランド名あり版）",
      "hts_code": "HTSコード",
      "hts_confidence": "high/medium/low/uncertain",
      "origin_country": "原産国コード",
      "customs_rate": 関税率(%),
      "length_cm": 長さ, "width_cm": 幅, "height_cm": 高さ, "weight_g": 重さ
    },
    "market_research": {
      "f_price_premium": プレミア率(%),
      "f_community_score": コミュニティスコア(0-10),
      "c_supply_japan": 日本市場流通量(件数),
      "s_flag_discontinued": "discontinued/limited/restock_scheduled/in_production/unknown"
    }
  }
]
\`\`\`

更新完了後、「✅ Supabase更新完了: {件数}件」と表示してください。
`
}

// 同期版（後方互換性のため）
export function generateAIAnalysisPromptSync(products: ProductForAI[]): string {
  const headers = ['SKU','商品ID','商品名(日本語)','英語タイトル','仕入価格(円)','定価(円)','発売日','カテゴリ名','カテゴリID','長さ(cm)','幅(cm)','高さ(cm)','重さ(g)','状態','画像URL','ブランド']
  const csvRows = [headers.join(',')]
  products.forEach(p => {
    const row = [p.sku || '', p.id || '', `"${(p.title || '').replace(/"/g, '""')}"`, `"${(p.title_en || p.english_title || '').replace(/"/g, '""')}"`, p.price_jpy || '', p.msrp || p.price_jpy || '', p.release_date || '不明', `"${(p.category_name || '').replace(/"/g, '""')}"`, p.category_id || '', p.length_cm || '', p.width_cm || '', p.height_cm || '', p.weight_g || '', `"${(p.condition || '').replace(/"/g, '""')}"`, `"${(p.image_url || '').replace(/"/g, '""')}"`, `"${(p.brand || '').replace(/"/g, '""')}"`]
    csvRows.push(row.join(','))
  })
  const csvContent = csvRows.join('\n')
  return `【簡易版プロンプト】\n${csvContent}\n\n※ HTS自動判定を使用する場合は、市場調査モーダルから生成してください。`
}
