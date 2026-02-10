/**
 * 画像一括登録API
 * POST /api/inventory/bulk-upload
 * 
 * 機能:
 * 1. 複数画像をアップロード
 * 2. 各画像に自動SKU付与（ITEM-000001形式）
 * 3. products_masterに一括登録（draft状態で）
 * 
 * 変更履歴:
 * - 2025-12-10: inventory_master → products_master に変更
 *               未出品商品として登録し、データ編集画面で編集可能に
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// SKU生成関数（products_master用）
async function generateBulkSKUsFromProducts(count: number, supabase: any): Promise<string[]> {
  // 最新のSKUを取得（ITEM-で始まるもののみ）
  const { data, error } = await supabase
    .from('products_master')
    .select('sku')
    .like('sku', 'ITEM-%')
    .order('sku', { ascending: false })
    .limit(1)
  
  let startNumber = 1
  
  if (!error && data && data.length > 0) {
    const latestSKU = data[0].sku
    const match = latestSKU.match(/ITEM-(\d{6})/)
    
    if (match) {
      startNumber = parseInt(match[1], 10) + 1
    }
  }
  
  // 連番でSKUを生成
  const skus: string[] = []
  for (let i = 0; i < count; i++) {
    const number = (startNumber + i).toString().padStart(6, '0')
    skus.push(`ITEM-${number}`)
  }
  
  return skus
}

export async function POST(req: NextRequest) {
  try {
    console.log('📦 bulk-upload API開始（products_master版）')
    
    // FormDataを取得
    const formData = await req.formData()
    const imageFiles = formData.getAll('images') as File[]
    const category = formData.get('category') as string || 'Toys & Hobbies'
    const condition = formData.get('condition') as string || 'Used'
    const productType = formData.get('marketplace') as string || 'stock' // stock or dropship
    
    console.log(`  - 画像数: ${imageFiles.length}`)
    console.log(`  - カテゴリ: ${category}`)
    console.log(`  - コンディション: ${condition}`)
    console.log(`  - 商品タイプ: ${productType}`)
    
    // 画像が選択されているか確認
    if (imageFiles.length === 0) {
      console.log('❌ 画像が選択されていません')
      return NextResponse.json(
        { error: '画像が選択されていません' },
        { status: 400 }
      )
    }
    
    console.log(`📦 画像一括登録開始: ${imageFiles.length}枚`)
    
    // Supabaseクライアント作成
    const supabase = await createClient()
    
    // SKUを一括生成（products_masterから）
    let skus: string[] = []
    try {
      skus = await generateBulkSKUsFromProducts(imageFiles.length, supabase)
      console.log(`  ✅ SKU生成完了: ${skus[0]} ～ ${skus[skus.length - 1]}`)
    } catch (skuError: any) {
      console.error('❌ SKU生成エラー:', skuError)
      return NextResponse.json(
        { error: `SKU生成失敗: ${skuError.message}` },
        { status: 500 }
      )
    }
    
    // 画像を一括アップロード
    const imageUrls: string[] = []
    const uploadErrors: Array<{ filename: string; error: string }> = []
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const sku = skus[i]
      
      try {
        console.log(`  📤 アップロード中: ${file.name} (${i + 1}/${imageFiles.length})`)
        
        // ファイル名を生成
        const timestamp = Date.now()
        const extension = file.name.split('.').pop() || 'jpg'
        const fileName = `${sku}_${timestamp}.${extension}`
        
        // ArrayBufferに変換
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Supabase Storageにアップロード
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`products/${fileName}`, buffer, {
            contentType: file.type,
            upsert: false
          })
        
        if (error) {
          console.error(`  ❌ Storage エラー (${file.name}):`, error)
          uploadErrors.push({ filename: file.name, error: error.message })
          imageUrls.push('')
          continue
        }
        
        // 公開URLを取得
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`products/${fileName}`)
        
        imageUrls.push(urlData.publicUrl)
        console.log(`  ✅ アップロード成功: ${fileName}`)
        
      } catch (uploadError: any) {
        console.error(`  ❌ アップロードエラー (${file.name}):`, uploadError)
        uploadErrors.push({ filename: file.name, error: uploadError.message })
        imageUrls.push('')
      }
    }
    
    console.log(`  📊 アップロード結果: 成功${imageUrls.filter(u => u).length}枚, 失敗${uploadErrors.length}枚`)
    
    // products_masterに一括登録（draft状態で）
    // ※ products_masterに存在するカラムのみ使用
    const productsToInsert = imageFiles.map((file, index) => ({
      // 基本情報
      sku: skus[index],
      title: `未設定 - ${file.name.replace(/\.[^/.]+$/, '')}`, // 拡張子を除去
      
      // 画像
      primary_image_url: imageUrls[index] || null,
      gallery_images: imageUrls[index] ? [imageUrls[index]] : [],
      
      // 商品タイプ・状態
      product_type: productType === 'dropship' ? 'dropship' : 'stock',
      listing_status: 'draft', // 未出品
      
      // 在庫
      inventory_quantity: 1,
      physical_quantity: 1,
      
      // カテゴリ・コンディション
      category: category,
      condition_name: condition,
      
      // ソース情報（NOT NULL制約対応）
      source: 'manual',
      source_system: 'manual',
      source_id: `manual-${skus[index]}`,
    }))
    
    console.log(`  📝 DB登録開始: ${productsToInsert.length}件`)
    
    const { data, error } = await supabase
      .from('products_master')
      .insert(productsToInsert)
      .select()
    
    if (error) {
      console.error('❌ データベース登録エラー:', error)
      return NextResponse.json(
        { error: `データベース登録失敗: ${error.message}` },
        { status: 500 }
      )
    }
    
    console.log(`  ✅ products_master登録完了: ${data.length}件（draft状態）`)
    
    // 登録結果を整形
    const results = data.map((product, index) => ({
      id: product.id,
      sku: product.sku,
      filename: imageFiles[index].name,
      imageUrl: imageUrls[index] || '',
      listing_status: 'draft',
    }))
    
    return NextResponse.json({
      success: true,
      registered: data.length,
      failed: uploadErrors.length,
      products: results,
      errors: uploadErrors,
      message: `${data.length}件を下書きとして登録しました。データ編集画面で編集できます。`
    })
    
  } catch (error: any) {
    console.error('❌ 一括登録エラー:', error)
    console.error('エラースタック:', error.stack)
    return NextResponse.json(
      { error: `一括登録エラー: ${error.message}` },
      { status: 500 }
    )
  }
}

// POSTのみ許可
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
