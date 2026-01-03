/**
 * 棚卸し画像アップロードAPI
 * POST: Supabase Storageへのアップロード
 * 
 * 注意: Vercelの5MB制限があるため、大きな画像は直接Supabase Storageへ
 * アップロードすることを推奨。このAPIは小さな画像用のフォールバック。
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSessionFromRequest } from '@/lib/inventory-count/auth'

// バケット名
const BUCKET_NAME = 'inventory-count-images'

/**
 * POST /api/inventory-count/upload
 * 画像をアップロードし、公開URLを返す
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'external_counter') {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    
    // FormDataから画像を取得
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const inventoryMasterId = formData.get('inventory_master_id') as string | null
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'ファイルが選択されていません' },
        { status: 400 }
      )
    }
    
    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'JPEG, PNG, WebP, HEIC形式の画像のみアップロードできます' },
        { status: 400 }
      )
    }
    
    // ファイルサイズチェック（5MB以下）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 }
      )
    }
    
    // ファイル名を生成（衝突回避）
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = inventoryMasterId 
      ? `${inventoryMasterId}/${timestamp}_${random}.${ext}`
      : `general/${timestamp}_${random}.${ext}`
    
    // Supabase Storageにアップロード
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('[InventoryCount] Upload error:', error)
      
      // バケットが存在しない場合のエラーハンドリング
      if (error.message.includes('bucket') || error.message.includes('not found')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'ストレージの設定が完了していません。管理者に連絡してください。',
            detail: error.message
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: 'アップロードに失敗しました' },
        { status: 500 }
      )
    }
    
    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)
    
    console.log(`[InventoryCount] 画像アップロード成功: ${fileName}`)
    console.log(`  担当者: ${session.name}`)
    console.log(`  URL: ${urlData.publicUrl}`)
    
    return NextResponse.json({
      success: true,
      data: {
        path: data.path,
        url: urlData.publicUrl,
        fileName: file.name,
        size: file.size,
        type: file.type
      }
    })
    
  } catch (error: any) {
    console.error('[InventoryCount] Upload API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'サーバーエラー' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/inventory-count/upload
 * 署名付きアップロードURLを発行（大きなファイル用）
 * クライアントから直接Supabase Storageにアップロードする場合に使用
 */
export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'external_counter') {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const inventoryMasterId = searchParams.get('inventory_master_id')
    const fileType = searchParams.get('file_type') || 'image/jpeg'
    
    // ファイル名を生成
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = fileType.split('/')[1] || 'jpg'
    const fileName = inventoryMasterId 
      ? `${inventoryMasterId}/${timestamp}_${random}.${ext}`
      : `general/${timestamp}_${random}.${ext}`
    
    // 署名付きURLを生成（有効期限: 10分）
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(fileName)
    
    if (error) {
      console.error('[InventoryCount] Signed URL error:', error)
      return NextResponse.json(
        { success: false, error: '署名付きURLの生成に失敗しました' },
        { status: 500 }
      )
    }
    
    // 公開URLも生成
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)
    
    return NextResponse.json({
      success: true,
      data: {
        signedUrl: data.signedUrl,
        token: data.token,
        path: fileName,
        publicUrl: publicUrlData.publicUrl,
        expiresIn: 600 // 10分
      }
    })
    
  } catch (error: any) {
    console.error('[InventoryCount] Signed URL API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'サーバーエラー' },
      { status: 500 }
    )
  }
}
