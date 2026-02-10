// lib/services/image/bundle-image-generator.ts
/**
 * セット品（Bundle）トップ画像自動生成サービス
 * 
 * 【機能】
 * - 2つ以上の商品をセットにした際、各商品の1枚目画像を合体
 * - 2枚: 左右分割
 * - 3枚: 3分割（上1＋下2）
 * - 4枚: 田の字型
 * - 5枚以上: 2x3グリッド
 * - 出力: 1600px正方形（eBay推奨サイズ）
 * 
 * 【効果】
 * - 検索結果で「セット商品」であることが一目瞭然
 * - CTR（クリック率）向上
 */

import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

export interface BundleImageConfig {
  outputSize: number;           // 出力サイズ（デフォルト: 1600）
  gap: number;                  // 画像間の隙間（デフォルト: 10）
  backgroundColor: string;      // 背景色（デフォルト: #FFFFFF）
  borderRadius: number;         // 角丸（デフォルト: 8）
  quality: number;              // JPEG品質（デフォルト: 90）
  addBadge: boolean;            // 「SET」バッジを追加
  badgeText?: string;           // バッジテキスト（デフォルト: "SET"）
}

export interface BundleImageInput {
  imageUrls: string[];          // 各商品の1枚目画像URL
  sku: string;                  // セット商品のSKU
  config?: Partial<BundleImageConfig>;
}

export interface BundleImageResult {
  success: boolean;
  outputUrl?: string;
  buffer?: Buffer;
  error?: string;
  processingTimeMs: number;
}

// ============================================================
// デフォルト設定
// ============================================================

const DEFAULT_CONFIG: BundleImageConfig = {
  outputSize: 1600,
  gap: 10,
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
  quality: 90,
  addBadge: true,
  badgeText: 'SET',
};

const STORAGE_BUCKET = 'inventory-images';

// ============================================================
// レイアウト計算
// ============================================================

interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 画像数に応じたレイアウトを計算
 */
function calculateLayout(
  imageCount: number, 
  outputSize: number, 
  gap: number
): ImagePosition[] {
  const positions: ImagePosition[] = [];
  
  if (imageCount === 1) {
    // 1枚: 全面
    positions.push({
      x: 0,
      y: 0,
      width: outputSize,
      height: outputSize,
    });
  } else if (imageCount === 2) {
    // 2枚: 左右分割
    const halfWidth = (outputSize - gap) / 2;
    positions.push(
      { x: 0, y: 0, width: halfWidth, height: outputSize },
      { x: halfWidth + gap, y: 0, width: halfWidth, height: outputSize }
    );
  } else if (imageCount === 3) {
    // 3枚: 上1＋下2
    const topHeight = (outputSize - gap) * 0.55;
    const bottomHeight = (outputSize - gap) * 0.45;
    const halfWidth = (outputSize - gap) / 2;
    
    positions.push(
      { x: 0, y: 0, width: outputSize, height: topHeight },
      { x: 0, y: topHeight + gap, width: halfWidth, height: bottomHeight },
      { x: halfWidth + gap, y: topHeight + gap, width: halfWidth, height: bottomHeight }
    );
  } else if (imageCount === 4) {
    // 4枚: 田の字型
    const cellSize = (outputSize - gap) / 2;
    positions.push(
      { x: 0, y: 0, width: cellSize, height: cellSize },
      { x: cellSize + gap, y: 0, width: cellSize, height: cellSize },
      { x: 0, y: cellSize + gap, width: cellSize, height: cellSize },
      { x: cellSize + gap, y: cellSize + gap, width: cellSize, height: cellSize }
    );
  } else {
    // 5枚以上: 2x3グリッド（最大6枚）
    const cols = 3;
    const rows = 2;
    const cellWidth = (outputSize - gap * (cols - 1)) / cols;
    const cellHeight = (outputSize - gap * (rows - 1)) / rows;
    
    for (let i = 0; i < Math.min(imageCount, 6); i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.push({
        x: col * (cellWidth + gap),
        y: row * (cellHeight + gap),
        width: cellWidth,
        height: cellHeight,
      });
    }
  }
  
  return positions;
}

// ============================================================
// 画像処理
// ============================================================

/**
 * URLから画像Bufferを取得
 */
async function fetchImageBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * 画像をリサイズしてBufferで返す
 */
async function resizeImage(
  buffer: Buffer,
  width: number,
  height: number,
  borderRadius: number = 0
): Promise<Buffer> {
  let pipeline = sharp(buffer)
    .resize(Math.round(width), Math.round(height), {
      fit: 'cover',
      position: 'center',
    });
  
  // 角丸を適用（SVGマスクを使用）
  if (borderRadius > 0) {
    const roundedCorners = Buffer.from(
      `<svg><rect x="0" y="0" width="${Math.round(width)}" height="${Math.round(height)}" rx="${borderRadius}" ry="${borderRadius}"/></svg>`
    );
    
    pipeline = pipeline
      .composite([{
        input: roundedCorners,
        blend: 'dest-in',
      }]);
  }
  
  return pipeline.png().toBuffer();
}

/**
 * 「SET」バッジを生成
 */
async function createBadge(text: string, size: number): Promise<Buffer> {
  const badgeWidth = Math.round(size * 0.2);
  const badgeHeight = Math.round(size * 0.08);
  const fontSize = Math.round(badgeHeight * 0.6);
  
  const svg = `
    <svg width="${badgeWidth}" height="${badgeHeight}">
      <rect x="0" y="0" width="${badgeWidth}" height="${badgeHeight}" rx="8" ry="8" fill="#FF6B35"/>
      <text x="${badgeWidth / 2}" y="${badgeHeight / 2 + fontSize * 0.35}" 
            font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" 
            fill="white" text-anchor="middle">${text}</text>
    </svg>
  `;
  
  return sharp(Buffer.from(svg)).png().toBuffer();
}

// ============================================================
// メイン関数
// ============================================================

/**
 * セット品のトップ画像を生成
 */
export async function generateBundleImage(
  input: BundleImageInput
): Promise<BundleImageResult> {
  const startTime = Date.now();
  const config = { ...DEFAULT_CONFIG, ...input.config };
  
  try {
    // 画像が2枚未満の場合はエラー
    if (input.imageUrls.length < 2) {
      return {
        success: false,
        error: 'At least 2 images are required for bundle image',
        processingTimeMs: Date.now() - startTime,
      };
    }
    
    // 最大6枚に制限
    const imageUrls = input.imageUrls.slice(0, 6);
    
    console.log(`[BundleImage] Generating for ${imageUrls.length} images, SKU: ${input.sku}`);
    
    // 1. レイアウトを計算
    const layout = calculateLayout(imageUrls.length, config.outputSize, config.gap);
    
    // 2. 各画像を取得・リサイズ
    const compositeInputs: sharp.OverlayOptions[] = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const position = layout[i];
      
      try {
        const originalBuffer = await fetchImageBuffer(url);
        const resizedBuffer = await resizeImage(
          originalBuffer,
          position.width,
          position.height,
          config.borderRadius
        );
        
        compositeInputs.push({
          input: resizedBuffer,
          left: Math.round(position.x),
          top: Math.round(position.y),
        });
      } catch (error) {
        console.error(`[BundleImage] Failed to process image ${i + 1}:`, error);
        // エラーの場合はプレースホルダーを使用
        const placeholder = await sharp({
          create: {
            width: Math.round(position.width),
            height: Math.round(position.height),
            channels: 4,
            background: { r: 200, g: 200, b: 200, alpha: 1 },
          },
        }).png().toBuffer();
        
        compositeInputs.push({
          input: placeholder,
          left: Math.round(position.x),
          top: Math.round(position.y),
        });
      }
    }
    
    // 3. ベース画像を作成して合成
    let composite = sharp({
      create: {
        width: config.outputSize,
        height: config.outputSize,
        channels: 4,
        background: config.backgroundColor,
      },
    }).composite(compositeInputs);
    
    // 4. バッジを追加
    if (config.addBadge && config.badgeText) {
      const badgeBuffer = await createBadge(config.badgeText, config.outputSize);
      const badgeWidth = Math.round(config.outputSize * 0.2);
      
      composite = sharp(await composite.png().toBuffer()).composite([{
        input: badgeBuffer,
        left: config.outputSize - badgeWidth - 20,
        top: 20,
      }]);
    }
    
    // 5. JPEG出力
    const outputBuffer = await composite.jpeg({ quality: config.quality }).toBuffer();
    
    // 6. Supabase Storageにアップロード
    const supabase = await createClient();
    const timestamp = Date.now();
    const fileName = `${input.sku}_bundle_${timestamp}.jpg`;
    const filePath = `bundles/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, outputBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });
    
    if (uploadError) {
      console.error('[BundleImage] Upload error:', uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`,
        buffer: outputBuffer,
        processingTimeMs: Date.now() - startTime,
      };
    }
    
    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    
    console.log(`[BundleImage] Generated successfully: ${urlData.publicUrl}`);
    
    return {
      success: true,
      outputUrl: urlData.publicUrl,
      buffer: outputBuffer,
      processingTimeMs: Date.now() - startTime,
    };
    
  } catch (error) {
    console.error('[BundleImage] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * 複数セット品の画像を一括生成
 */
export async function batchGenerateBundleImages(
  inputs: BundleImageInput[],
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, BundleImageResult>> {
  const results = new Map<string, BundleImageResult>();
  
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const result = await generateBundleImage(input);
    results.set(input.sku, result);
    onProgress?.(i + 1, inputs.length);
    
    // レートリミット対策
    if (i < inputs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}

// ============================================================
// エクスポート
// ============================================================

export default {
  generateBundleImage,
  batchGenerateBundleImages,
  calculateLayout,
  DEFAULT_CONFIG,
};
