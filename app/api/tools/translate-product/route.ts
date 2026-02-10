// app/api/tools/translate-product/route.ts
/**
 * 🔥 v2.0: workflow_status 自動遷移対応
 * 
 * 翻訳完了後、workflow_status を 'translate' → 'scout' に更新
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * シンプルな翻訳関数（Google翻訳API使用）
 */
async function translateText(text: string): Promise<string> {
  if (!text) return text
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(text)}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translated = data[0].map((item: any) => item[0]).join('')
      console.log(`  📝 翻訳: "${text.substring(0, 30)}..." → "${translated.substring(0, 30)}..."`)
      return translated
    }
    
    return text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

/**
 * 商品データの翻訳API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, title, description, condition } = body

    console.log('🌐 商品データ翻訳開始')
    console.log(`  Product ID: ${productId}`)

    const translations: any = {}

    // タイトル翻訳
    if (title) {
      console.log(`  📝 タイトル翻訳: "${title.substring(0, 50)}..."`)
      const englishTitle = await translateText(title)
      translations.title = englishTitle
      console.log(`  ✅ → "${englishTitle.substring(0, 50)}..."`)
    }

    // 説明翻訳
    if (description) {
      console.log(`  📄 説明翻訳中...`)
      const englishDescription = await translateText(description)
      translations.description = englishDescription
      console.log(`  ✅ 説明翻訳完了: ${englishDescription.substring(0, 50)}...`)
    }

    // 状態翻訳
    if (condition) {
      console.log(`  🏷️ 状態翻訳: "${condition}"`)
      const englishCondition = await translateText(condition)
      translations.condition = englishCondition
      console.log(`  ✅ → "${englishCondition}"`)
    }

    // データベースに保存（productIdがある場合）
    if (productId) {
      console.log('  💾 データベースに保存中...')
      
      // 🔥 既存のデータを取得
      const { data: existingProduct, error: fetchError } = await supabase
        .from('products_master')
        .select('listing_data, workflow_status')
        .eq('id', productId)
        .single()
      
      if (fetchError) {
        console.error('  ❌ 既存データ取得エラー:', fetchError)
      }
      
      const existingListingData = existingProduct?.listing_data || {}
      const currentStatus = existingProduct?.workflow_status
      
      // 🔥 更新データを構築
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      // 🔥 english_title と title_en の両方を更新
      if (translations.title) {
        updateData.english_title = translations.title  // 🔥 追加
        updateData.title_en = translations.title
      }
      
      if (translations.description) {
        updateData.description_en = translations.description
      }
      
      // listing_data にも保存
      updateData.listing_data = {
        ...existingListingData,
        english_title: translations.title,
        description_en: translations.description,
        condition_en: translations.condition,
        translated_at: new Date().toISOString()
      }
      
      // 🔥 workflow_status を 'translate' → 'scout' に更新
      // 翻訳フェーズからのみ遷移させる
      if (currentStatus === 'translate' || currentStatus === 'translating' || !currentStatus) {
        updateData.workflow_status = 'scout'
        console.log('  🚀 workflow_status: translate → scout')
      }
      
      const { error: updateError } = await supabase
        .from('products_master')
        .update(updateData)
        .eq('id', productId)

      if (updateError) {
        console.error('  ❌ DB保存エラー:', updateError)
        return NextResponse.json({
          success: false,
          error: 'DB保存失敗: ' + updateError.message
        }, { status: 500 })
      }

      console.log('  ✅ データベース保存完了')
      console.log(`  ✅ 次フェーズ: scout（SM検索待ち）`)
    }

    return NextResponse.json({
      success: true,
      translations,
      nextPhase: 'scout',
      message: '翻訳が完了しました。SM検索フェーズに移行しました。'
    })

  } catch (error: any) {
    console.error('❌ 翻訳エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || '翻訳に失敗しました' },
      { status: 500 }
    )
  }
}
