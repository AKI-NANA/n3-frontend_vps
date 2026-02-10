// app/api/upload/zip/route.ts
/**
 * ZIPアップロードAPI（入れ子構造対応）
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { NextResponse } from 'next/server';
import { processZipFileWithOptions, type ZipProcessOptions } from '@/lib/services/upload/zip-processor';
import { createClient } from '@supabase/supabase-js';

// Supabase クライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================
// POST: ZIPファイルをアップロード・処理
// ============================================================

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsJson = formData.get('options') as string;
    const saveToDb = formData.get('saveToDb') === 'true';
    const uploadToStorage = formData.get('uploadToStorage') === 'true';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // オプションをパース
    let options: ZipProcessOptions = {};
    if (optionsJson) {
      try {
        options = JSON.parse(optionsJson);
      } catch (e) {
        console.warn('Invalid options JSON, using defaults');
      }
    }
    
    // Base64変換は storage 未使用時のみ
    options.convertToBase64 = !uploadToStorage;
    
    // ZIP処理
    console.log(`[ZIP Upload] Processing: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    const result = await processZipFileWithOptions(file, options);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }
    
    console.log(`[ZIP Upload] Extracted: ${result.totalImages} images in ${result.productGroups.length} groups`);
    
    // Supabase Storage にアップロード
    if (uploadToStorage) {
      for (const group of result.productGroups) {
        const folderName = group.sku || group.name || group.id;
        
        for (const image of group.images) {
          const storagePath = `products/${folderName}/${image.filename}`;
          
          try {
            const { data, error } = await supabase.storage
              .from('images')
              .upload(storagePath, image.data, {
                contentType: image.mimeType,
                upsert: true,
              });
            
            if (error) {
              console.error(`[ZIP Upload] Storage error for ${storagePath}:`, error.message);
            } else {
              // 公開URLを取得
              const { data: urlData } = supabase.storage
                .from('images')
                .getPublicUrl(storagePath);
              
              // 結果に追加
              (image as any).storageUrl = urlData.publicUrl;
            }
          } catch (e: any) {
            console.error(`[ZIP Upload] Upload error:`, e.message);
          }
        }
      }
    }
    
    // DBに保存
    if (saveToDb) {
      const insertedProducts: any[] = [];
      
      for (const group of result.productGroups) {
        // メイン画像URL
        const mainImage = group.images.find(i => i.isMain) || group.images[0];
        const primaryImageUrl = (mainImage as any)?.storageUrl || mainImage?.base64 || null;
        
        // 全画像URL
        const allImageUrls = group.images
          .map(i => (i as any).storageUrl || i.base64)
          .filter(Boolean);
        
        const productData = {
          product_name: group.metadata.title || group.name,
          sku: group.sku,
          primary_image_url: primaryImageUrl,
          images: allImageUrls,
          image_count: group.images.length,
          cost_price: group.metadata.price || null,
          storage_location: group.folderPath || null,
          workflow_status: 'draft',
          ai_analysis_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { data, error } = await supabase
          .from('products_master')
          .insert(productData)
          .select()
          .single();
        
        if (error) {
          console.error(`[ZIP Upload] DB insert error:`, error.message);
        } else {
          insertedProducts.push(data);
        }
      }
      
      return NextResponse.json({
        success: true,
        totalFiles: result.totalFiles,
        totalImages: result.totalImages,
        groupCount: result.productGroups.length,
        processingTime: result.processingTime,
        insertedProducts: insertedProducts.length,
        products: insertedProducts,
      });
    }
    
    // DB保存なしの場合
    return NextResponse.json({
      success: true,
      totalFiles: result.totalFiles,
      totalImages: result.totalImages,
      groupCount: result.productGroups.length,
      processingTime: result.processingTime,
      productGroups: result.productGroups.map(g => ({
        id: g.id,
        name: g.name,
        sku: g.sku,
        folderPath: g.folderPath,
        imageCount: g.images.length,
        metadata: g.metadata,
        images: g.images.map(i => ({
          filename: i.filename,
          path: i.path,
          mimeType: i.mimeType,
          size: i.size,
          isMain: i.isMain,
          base64: i.base64?.substring(0, 100) + '...',
          storageUrl: (i as any).storageUrl,
        })),
      })),
    });
    
  } catch (error: any) {
    console.error('[ZIP Upload] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// GET: 処理状況の確認
// ============================================================

export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'ready',
    maxFileSizeMB: 100,
    supportedFormats: ['zip'],
    features: [
      'nested_folders',
      'auto_grouping',
      'sku_extraction',
      'main_image_detection',
      'storage_upload',
      'db_save',
    ],
  });
}
