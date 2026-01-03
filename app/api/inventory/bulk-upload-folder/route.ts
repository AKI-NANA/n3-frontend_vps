/**
 * フォルダ構造対応 画像一括登録API
 * POST /api/inventory/bulk-upload-folder
 * 
 * 機能:
 * 1. フォルダ構造（webkitdirectory）を受け取る
 * 2. サブフォルダごとに1商品として登録
 * 3. ZIPファイルを受け取り、解凍して同様に登録（jszip使用）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import JSZip from 'jszip';

// アップロード用アイテム型定義
type UploadItem = {
  data: Buffer | File; // Supabaseにアップロードするデータ
  contentType: string;
  path: string;
};

// SKU生成関数
async function generateSKU(prefix: string, supabase: any): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  const { count } = await supabase
    .from('inventory_master')
    .select('*', { count: 'exact', head: true })
    .like('sku', `${prefix}-${dateStr}-%`);

  const seq = ((count || 0) + 1).toString().padStart(4, '0');
  return `${prefix}-${dateStr}-${seq}`;
}

// フォルダ構造を解析（通常アップロード）
function parseWebkitDirectory(files: File[], relativePaths: string[]): Map<string, UploadItem[]> {
  const folders = new Map<string, UploadItem[]>();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = relativePaths[i] || file.name;
    const parts = relativePath.split('/').filter(p => p);
    
    // 画像ファイルのみ処理
    if (!file.type.startsWith('image/')) continue;
    
    let folderName: string;
    if (parts.length <= 1) {
      folderName = `個別_${file.name.replace(/\.[^/.]+$/, '')}`;
    } else {
      // フォルダ選択時のパス構造: UploadRoot/ProductA/img.jpg
      // ZIPや環境によっては ProductA/img.jpg となることもあるため
      // 階層の深さに応じて商品名フォルダを決定
      folderName = parts.length >= 2 ? parts[1] : parts[0];
    }
    
    // システムフォルダを除外
    if (folderName.startsWith('.') || folderName.startsWith('__')) continue;
    
    if (!folders.has(folderName)) {
      folders.set(folderName, []);
    }
    
    folders.get(folderName)!.push({
      data: file,
      contentType: file.type,
      path: relativePath
    });
  }
  
  return folders;
}

// ZIPファイルを解析（JSZip使用）
async function parseZipFile(zipFile: File): Promise<Map<string, UploadItem[]>> {
  const buffer = await zipFile.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const folders = new Map<string, UploadItem[]>();

  // ZIP内のファイルを走査
  const filePromises: Promise<void>[] = [];

  zip.forEach((relativePath, entry) => {
    filePromises.push(async () => {
      if (entry.dir) return;
      if (entry.name.startsWith('__MACOSX')) return;
      if (entry.name.split('/').pop()?.startsWith('.')) return; // .DS_Store等

      // 拡張子で画像判定
      const ext = entry.name.split('.').pop()?.toLowerCase();
      if (!ext || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return;

      const parts = relativePath.split('/').filter(p => p);
      let folderName: string;

      if (parts.length <= 1) {
        folderName = `個別_${entry.name.replace(/\.[^/.]+$/, '')}`;
      } else {
        // ZIPの場合、ルートフォルダが含まれる場合と含まれない場合がある
        // parts[0] が商品名のケースが多い
        folderName = parts.length >= 2 ? parts[1] : parts[0];
      }

      if (folderName.startsWith('.') || folderName.startsWith('__')) {
        return;
      }

      // MIMEタイプ推定
      let contentType = 'image/jpeg';
      if (ext === 'png') contentType = 'image/png';
      else if (ext === 'gif') contentType = 'image/gif';
      else if (ext === 'webp') contentType = 'image/webp';

      // データをバッファとして取得
      const content = await entry.async('nodebuffer');

      if (!folders.has(folderName)) {
        folders.set(folderName, []);
      }

      folders.get(folderName)!.push({
        data: content, // Buffer
        contentType,
        path: relativePath
      });
    })();
  });

  await Promise.all(filePromises);
  return folders;
}

export async function POST(req: NextRequest) {
  try {
    console.log('📦 bulk-upload-folder API開始');
    
    const formData = await req.formData();
    
    // パラメータ取得
    const skuPrefix = formData.get('skuPrefix') as string || 'BULK';
    const storageLocation = formData.get('storageLocation') as string || 'env';
    
    // inventoryType バリデーション
    let inventoryType = formData.get('inventoryType') as string;
    if (inventoryType !== 'stock' && inventoryType !== 'mu' && inventoryType !== 'dropship') {
      console.warn(`⚠️ 無効なinventoryType "${inventoryType}" を検知。"stock" に補正します。`);
      inventoryType = 'stock';
    }

    // ファイル処理の分岐
    let folderMap: Map<string, UploadItem[]>;
    const zipFile = formData.get('zip') as File | null;

    if (zipFile) {
      console.log(`  📦 ZIPファイルを処理中: ${zipFile.name}`);
      folderMap = await parseZipFile(zipFile);
    } else {
      const files = formData.getAll('files') as File[];
      const relativePaths = formData.getAll('relativePaths') as string[];
      console.log(`  📂 通常ファイルを処理中: ${files.length}ファイル`);
      folderMap = parseWebkitDirectory(files, relativePaths);
    }
    
    console.log(`  📊 検出された商品数: ${folderMap.size}`);
    
    if (folderMap.size === 0) {
      return NextResponse.json(
        { error: '有効な画像が見つかりませんでした' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    const results: any[] = [];
    const errors: { folderName: string; error: string }[] = [];
    
    // 各フォルダ（商品）を処理
    for (const [folderName, items] of folderMap.entries()) {
      try {
        console.log(`  🏷️ 処理中: ${folderName} (${items.length}枚)`);
        
        // SKU生成
        const sku = await generateSKU(skuPrefix, supabase);
        
        // 画像をアップロード
        const imageUrls: string[] = [];
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          
          try {
            const timestamp = Date.now();
            const ext = item.contentType.split('/')[1] || 'jpg';
            const fileName = `${sku}_${i + 1}_${timestamp}.${ext}`;
            
            const { error: uploadError } = await supabase.storage
              .from('images')
              .upload(`products/${fileName}`, item.data, {
                contentType: item.contentType,
                upsert: false
              });
            
            if (uploadError) {
              console.error(`    ❌ 画像アップロードエラー:`, uploadError);
              continue;
            }
            
            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(`products/${fileName}`);
            
            imageUrls.push(urlData.publicUrl);
          } catch (imgError: any) {
            console.error(`    ❌ 画像処理エラー:`, imgError);
          }
        }
        
        if (imageUrls.length === 0) {
          errors.push({ folderName, error: '画像のアップロードに失敗しました' });
          continue;
        }
        
        // 商品名を生成（フォルダ名から）
        const productName = folderName
          .replace(/^個別_/, '')
          .replace(/_/g, ' ')
          .trim();
        
        const now = new Date().toISOString();
        
        // inventory_master に登録
        const insertData = {
          sku,
          unique_id: sku,
          product_name: productName,
          physical_quantity: 1,
          listing_quantity: 1,
          storage_location: storageLocation,
          images: imageUrls,
          is_manual_entry: true,
          product_type: 'single', // 固定
          inventory_type: inventoryType, // バリデーション済み
          source_data: {
            created_by: 'bulk_upload_folder',
            folder_name: folderName,
            image_count: imageUrls.length,
            uploaded_at: now,
            source_type: zipFile ? 'zip_upload' : 'folder_upload'
          },
          created_at: now,
          updated_at: now,
        };
        
        const { data, error: insertError } = await supabase
          .from('inventory_master')
          .insert(insertData)
          .select('id, sku, product_name, images')
          .single();
        
        if (insertError) {
          console.error(`    ❌ DB登録エラー:`, insertError);
          errors.push({ folderName, error: insertError.message });
          continue;
        }
        
        results.push({
          id: data.id,
          sku: data.sku,
          productName: data.product_name,
          imageCount: imageUrls.length,
          images: imageUrls,
        });
        
        console.log(`    ✅ 登録完了: ${sku} (${imageUrls.length}枚)`);
        
      } catch (folderError: any) {
        console.error(`  ❌ フォルダ処理エラー (${folderName}):`, folderError);
        errors.push({ folderName, error: folderError.message || '不明なエラー' });
      }
    }
    
    console.log(`📊 完了: 成功${results.length}件, 失敗${errors.length}件`);
    
    return NextResponse.json({
      success: true,
      registered: results.length,
      failed: errors.length,
      totalImages: results.reduce((sum, r) => sum + r.imageCount, 0),
      products: results,
      errors,
    });
    
  } catch (error: any) {
    console.error('❌ bulk-upload-folder エラー:', error);
    // Errorオブジェクトからメッセージを明示的に抽出して返す
    return NextResponse.json(
      { error: error.message || 'サーバー内部エラーが発生しました' },
      { status: 500 }
    );
  }
}