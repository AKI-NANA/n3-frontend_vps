// app/api/inventory/upload-image/route.ts
/**
 * 棚卸し画像アップロードAPI
 * 
 * 修正: 
 * 1. Supabase Storageのバケット名を 'images' に統一 (Bucket not found回避)
 * 2. レスポンス形式をフロントエンドの期待 ({ url: ... }) に合わせる
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const inventoryMasterId = formData.get('inventory_master_id') as string;
    
    if (!file || !inventoryMasterId) {
      return NextResponse.json(
        { success: false, error: 'ファイルとIDが必要です' },
        { status: 400 }
      );
    }
    
    // ファイルサイズチェック（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 }
      );
    }
    
    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '対応形式: JPEG, PNG, WebP, HEIC' },
        { status: 400 }
      );
    }
    
    // ファイル名生成
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${inventoryMasterId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    
    // Supabase Storageにアップロード
    // ★修正: バケット名を 'images' に統一 (inventory-images -> images)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images') 
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });
    
    if (uploadError) {
      console.error('[upload-image] Upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }
    
    // 公開URLを取得
    // ★修正: バケット名を 'images' に統一
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
    
    const imageUrl = urlData.publicUrl;
    
    // API側でもDB更新 (念のため)
    // images(jsonb) と inventory_images(text[]) 両方を更新
    const { data: product } = await supabase
      .from('inventory_master')
      .select('images') 
      .eq('id', inventoryMasterId)
      .single();
    
    const currentImages = product?.images || [];
    const newImages = [...currentImages, imageUrl];
    
    await supabase
      .from('inventory_master')
      .update({
        images: newImages,           
        inventory_images: newImages, 
        updated_at: new Date().toISOString(),
      })
      .eq('id', inventoryMasterId);
    
    // ★重要: フロントエンドが期待するフラットな構造でURLを返す
    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName,
    });
    
  } catch (error: any) {
    console.error('[upload-image] Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}