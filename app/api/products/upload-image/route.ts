// app/api/products/upload-image/route.ts
/**
 * 商品画像アップロードAPI
 * 
 * 機能:
 * - 画像ファイルをSupabase Storageにアップロード
 * - products_masterのmanual_imagesカラムに追加
 * - 画像の最適化（リサイズ、圧縮）オプション
 * 
 * v1.0: 初期実装
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 許可するファイル形式
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const file = formData.get('file') as File | null
    const productId = formData.get('productId') as string | null
    const sku = formData.get('sku') as string | null
    const imageType = formData.get('imageType') as string || 'manual' // manual | supplier
    
    // バリデーション
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが指定されていません' },
        { status: 400 }
      )
    }
    
    if (!productId && !sku) {
      return NextResponse.json(
        { error: 'productIdまたはskuが必要です' },
        { status: 400 }
      )
    }
    
    // ファイル形式チェック
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `許可されていないファイル形式です: ${file.type}` },
        { status: 400 }
      )
    }
    
    // ファイルサイズチェック
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `ファイルサイズが大きすぎます（最大10MB）: ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      )
    }
    
    // 商品情報取得
    let product
    if (productId) {
      const { data, error } = await supabase
        .from('products_master')
        .select('id, sku, manual_images, supplier_images, gallery_images')
        .eq('id', productId)
        .single()
      
      if (error || !data) {
        return NextResponse.json(
          { error: '商品が見つかりません' },
          { status: 404 }
        )
      }
      product = data
    } else if (sku) {
      const { data, error } = await supabase
        .from('products_master')
        .select('id, sku, manual_images, supplier_images, gallery_images')
        .eq('sku', sku)
        .single()
      
      if (error || !data) {
        return NextResponse.json(
          { error: '商品が見つかりません' },
          { status: 404 }
        )
      }
      product = data
    }
    
    // ファイル名生成（SKU + タイムスタンプ + ランダム文字列）
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${product.sku}_${timestamp}_${randomStr}.${ext}`
    const storagePath = `products/${fileName}`
    
    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Supabase Storageにアップロード
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('❌ Storage Upload Error:', uploadError)
      return NextResponse.json(
        { error: `アップロードに失敗しました: ${uploadError.message}` },
        { status: 500 }
      )
    }
    
    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath)
    
    const imageUrl = urlData.publicUrl
    
    console.log(`✅ Image uploaded: ${imageUrl}`)
    
    // 既存の画像配列を取得
    const existingManualImages = Array.isArray(product.manual_images) 
      ? product.manual_images 
      : []
    const existingSupplierImages = Array.isArray(product.supplier_images) 
      ? product.supplier_images 
      : []
    const existingGalleryImages = Array.isArray(product.gallery_images) 
      ? product.gallery_images 
      : []
    
    // 更新するカラムを決定
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    }
    
    if (imageType === 'manual') {
      updates.manual_images = [...existingManualImages, imageUrl]
      // gallery_imagesにも追加（後方互換性）
      updates.gallery_images = [...existingGalleryImages, imageUrl]
    } else if (imageType === 'supplier') {
      updates.supplier_images = [...existingSupplierImages, imageUrl]
    }
    
    // DBを更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update(updates)
      .eq('id', product.id)
    
    if (updateError) {
      console.error('❌ DB Update Error:', updateError)
      // ストレージにアップロードした画像を削除（ロールバック）
      await supabase.storage.from('images').remove([storagePath])
      
      return NextResponse.json(
        { error: `DB更新に失敗しました: ${updateError.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      imageUrl,
      storagePath,
      imageType,
      productId: product.id,
      sku: product.sku,
      totalImages: {
        manual: updates.manual_images?.length || existingManualImages.length,
        supplier: updates.supplier_images?.length || existingSupplierImages.length,
        gallery: updates.gallery_images?.length || existingGalleryImages.length,
      }
    })
    
  } catch (error: any) {
    console.error('❌ Upload Error:', error)
    return NextResponse.json(
      { error: error.message || 'アップロードに失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * 複数画像の一括アップロード
 */
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const files = formData.getAll('files') as File[]
    const productId = formData.get('productId') as string | null
    const sku = formData.get('sku') as string | null
    const imageType = formData.get('imageType') as string || 'manual'
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'ファイルが指定されていません' },
        { status: 400 }
      )
    }
    
    if (!productId && !sku) {
      return NextResponse.json(
        { error: 'productIdまたはskuが必要です' },
        { status: 400 }
      )
    }
    
    // 商品情報取得
    let product
    const query = supabase
      .from('products_master')
      .select('id, sku, manual_images, supplier_images, gallery_images')
    
    if (productId) {
      const { data, error } = await query.eq('id', productId).single()
      if (error || !data) {
        return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 })
      }
      product = data
    } else if (sku) {
      const { data, error } = await query.eq('sku', sku).single()
      if (error || !data) {
        return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 })
      }
      product = data
    }
    
    const results: { success: boolean; url?: string; error?: string; fileName: string }[] = []
    const uploadedUrls: string[] = []
    
    for (const file of files) {
      // ファイル形式チェック
      if (!ALLOWED_TYPES.includes(file.type)) {
        results.push({ success: false, error: '許可されていない形式', fileName: file.name })
        continue
      }
      
      // ファイルサイズチェック
      if (file.size > MAX_FILE_SIZE) {
        results.push({ success: false, error: 'ファイルサイズ超過', fileName: file.name })
        continue
      }
      
      try {
        // ファイル名生成
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `${product.sku}_${timestamp}_${randomStr}.${ext}`
        const storagePath = `products/${fileName}`
        
        // アップロード
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(storagePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          results.push({ success: false, error: uploadError.message, fileName: file.name })
          continue
        }
        
        // 公開URL取得
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(storagePath)
        
        uploadedUrls.push(urlData.publicUrl)
        results.push({ success: true, url: urlData.publicUrl, fileName: file.name })
        
      } catch (err: any) {
        results.push({ success: false, error: err.message, fileName: file.name })
      }
    }
    
    // 成功した画像をDBに保存
    if (uploadedUrls.length > 0) {
      const existingManualImages = Array.isArray(product.manual_images) ? product.manual_images : []
      const existingSupplierImages = Array.isArray(product.supplier_images) ? product.supplier_images : []
      const existingGalleryImages = Array.isArray(product.gallery_images) ? product.gallery_images : []
      
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString()
      }
      
      if (imageType === 'manual') {
        updates.manual_images = [...existingManualImages, ...uploadedUrls]
        updates.gallery_images = [...existingGalleryImages, ...uploadedUrls]
      } else if (imageType === 'supplier') {
        updates.supplier_images = [...existingSupplierImages, ...uploadedUrls]
      }
      
      await supabase
        .from('products_master')
        .update(updates)
        .eq('id', product.id)
    }
    
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    
    return NextResponse.json({
      success: true,
      uploaded: successCount,
      failed: failCount,
      results,
      totalImages: {
        manual: (Array.isArray(product.manual_images) ? product.manual_images.length : 0) + 
                (imageType === 'manual' ? uploadedUrls.length : 0),
        supplier: (Array.isArray(product.supplier_images) ? product.supplier_images.length : 0) +
                  (imageType === 'supplier' ? uploadedUrls.length : 0),
      }
    })
    
  } catch (error: any) {
    console.error('❌ Bulk Upload Error:', error)
    return NextResponse.json(
      { error: error.message || '一括アップロードに失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * 画像削除
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, productId, sku, imageType = 'manual' } = body
    
    console.log('\n========== 画像削除API開始 ==========')
    console.log('リクエスト:', { imageUrl, productId, sku, imageType })
    
    if (!imageUrl) {
      console.log('❌ imageUrlがありません')
      return NextResponse.json({ error: 'imageUrlが必要です' }, { status: 400 })
    }
    
    if (!productId && !sku) {
      console.log('❌ productId/skuがありません')
      return NextResponse.json({ error: 'productIdまたはskuが必要です' }, { status: 400 })
    }
    
    // 商品情報取得
    let product
    const query = supabase
      .from('products_master')
      .select('id, sku, primary_image_url, manual_images, supplier_images, gallery_images, listing_images, listing_data')
    
    if (productId) {
      const { data, error } = await query.eq('id', productId).single()
      if (error) {
        console.log('❌ 商品取得エラー:', error)
        return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 })
      }
      product = data
    } else if (sku) {
      const { data, error } = await query.eq('sku', sku).single()
      if (error) {
        console.log('❌ 商品取得エラー:', error)
        return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 })
      }
      product = data
    }
    
    console.log('現在の商品データ:', {
      id: product.id,
      primary_image_url: product.primary_image_url,
      manual_images: product.manual_images,
      supplier_images: product.supplier_images,
      gallery_images: product.gallery_images,
      listing_images: product.listing_images,
      listing_data_image_urls: product.listing_data?.image_urls,
    })
    
    // URLからストレージパスを抽出
    let storagePath = null
    try {
      const urlObj = new URL(imageUrl)
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)/)
      storagePath = pathMatch ? pathMatch[1] : null
      console.log('ストレージパス:', storagePath)
    } catch (e) {
      console.log('⚠️ URLパース失敗:', e)
    }
    
    // Supabase Storageから削除（パスが抽出できた場合のみ）
    if (storagePath) {
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove([storagePath])
      
      if (deleteError) {
        console.warn('⚠️ Storage削除警告:', deleteError.message)
      } else {
        console.log('✅ Storageから削除完了')
      }
    }
    
    // 全ての画像配列から削除
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    }
    
    // primary_image_urlが削除対象の場合、nullに設定
    if (product.primary_image_url === imageUrl) {
      updates.primary_image_url = null
      console.log('→ primary_image_urlをnullに設定')
    }
    
    if (Array.isArray(product.manual_images)) {
      const filtered = product.manual_images.filter((url: string) => url !== imageUrl)
      if (filtered.length !== product.manual_images.length) {
        updates.manual_images = filtered
        console.log(`→ manual_images: ${product.manual_images.length} -> ${filtered.length}`)
      }
    }
    if (Array.isArray(product.supplier_images)) {
      const filtered = product.supplier_images.filter((url: string) => url !== imageUrl)
      if (filtered.length !== product.supplier_images.length) {
        updates.supplier_images = filtered
        console.log(`→ supplier_images: ${product.supplier_images.length} -> ${filtered.length}`)
      }
    }
    if (Array.isArray(product.gallery_images)) {
      const filtered = product.gallery_images.filter((url: string) => url !== imageUrl)
      if (filtered.length !== product.gallery_images.length) {
        updates.gallery_images = filtered
        console.log(`→ gallery_images: ${product.gallery_images.length} -> ${filtered.length}`)
      }
    }
    if (Array.isArray(product.listing_images)) {
      const filtered = product.listing_images.filter((url: string) => url !== imageUrl)
      if (filtered.length !== product.listing_images.length) {
        updates.listing_images = filtered
        console.log(`→ listing_images: ${product.listing_images.length} -> ${filtered.length}`)
      }
    }
    
    // 🔥 listing_data.image_urlsからも削除
    if (product.listing_data?.image_urls && Array.isArray(product.listing_data.image_urls)) {
      const filtered = product.listing_data.image_urls.filter((url: string) => url !== imageUrl)
      if (filtered.length !== product.listing_data.image_urls.length) {
        updates.listing_data = {
          ...product.listing_data,
          image_urls: filtered,
          image_count: filtered.length,
        }
        console.log(`→ listing_data.image_urls: ${product.listing_data.image_urls.length} -> ${filtered.length}`)
      }
    }
    
    console.log('更新内容:', Object.keys(updates))
    
    // DB更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update(updates)
      .eq('id', product.id)
    
    if (updateError) {
      console.log('❌ DB更新エラー:', updateError)
      return NextResponse.json(
        { error: `DB更新に失敗しました: ${updateError.message}` },
        { status: 500 }
      )
    }
    
    console.log('✅ DB更新完了')
    console.log('========== 画像削除API終了 ==========\n')
    
    return NextResponse.json({
      success: true,
      deletedUrl: imageUrl,
      productId: product.id,
      updatedFields: Object.keys(updates)
    })
    
  } catch (error: any) {
    console.error('❌ Delete Error:', error)
    return NextResponse.json(
      { error: error.message || '削除に失敗しました' },
      { status: 500 }
    )
  }
}
