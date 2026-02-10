// lib/services/upload/zip-processor.ts
/**
 * ZIP ファイル処理サービス（入れ子構造対応）
 * 
 * 機能:
 * 1. 深いネスト構造のZIPファイル解析
 * 2. 商品単位での自動グルーピング
 * 3. 画像ファイルの抽出・変換
 * 4. メタデータ抽出（フォルダ名からSKU等）
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import JSZip from 'jszip';

// ============================================================
// 型定義
// ============================================================

export interface ZipFileEntry {
  name: string;
  path: string;
  relativePath: string;
  isDirectory: boolean;
  depth: number;
  size: number;
  lastModified: Date;
}

export interface ProductGroup {
  id: string;
  name: string;
  sku: string | null;
  folderPath: string;
  images: ExtractedImage[];
  metadata: ProductMetadata;
  depth: number;
}

export interface ExtractedImage {
  filename: string;
  path: string;
  data: Blob;
  base64?: string;
  mimeType: string;
  size: number;
  isMain: boolean;
  sortOrder: number;
}

export interface ProductMetadata {
  title?: string;
  sku?: string;
  category?: string;
  price?: number;
  quantity?: number;
  condition?: string;
  notes?: string;
  extractedFrom: 'folder_name' | 'file_name' | 'csv' | 'json';
}

export interface ZipProcessResult {
  success: boolean;
  totalFiles: number;
  totalImages: number;
  productGroups: ProductGroup[];
  skippedFiles: string[];
  errors: string[];
  processingTime: number;
}

export interface ZipProcessOptions {
  /** 商品グルーピングの階層深度（1=ルート直下、2=2階層目...） */
  groupingDepth?: number | 'auto';
  /** 画像ファイルのみ抽出 */
  imagesOnly?: boolean;
  /** Base64に変換 */
  convertToBase64?: boolean;
  /** メイン画像の判定パターン */
  mainImagePatterns?: RegExp[];
  /** 無視するファイル/フォルダパターン */
  ignorePatterns?: RegExp[];
  /** 最大ファイルサイズ（MB） */
  maxFileSizeMB?: number;
  /** SKU抽出パターン */
  skuPattern?: RegExp;
}

// ============================================================
// 定数
// ============================================================

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];

const DEFAULT_IGNORE_PATTERNS = [
  /^__MACOSX\//,
  /\/\./,
  /\.DS_Store$/,
  /Thumbs\.db$/,
  /desktop\.ini$/,
];

const DEFAULT_MAIN_IMAGE_PATTERNS = [
  /^main\./i,
  /^cover\./i,
  /^primary\./i,
  /^1\./,
  /^01\./,
  /_main\./i,
  /_cover\./i,
  /-main\./i,
  /-cover\./i,
];

const DEFAULT_SKU_PATTERN = /^([A-Z]{2,4}[-_]?\d{3,10})/i;

// ============================================================
// ヘルパー関数
// ============================================================

function isImageFile(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return IMAGE_EXTENSIONS.includes(ext);
}

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function getPathDepth(path: string): number {
  return path.split('/').filter(p => p && !p.startsWith('.')).length;
}

function extractMetadataFromFolderName(folderName: string, skuPattern: RegExp): ProductMetadata {
  const metadata: ProductMetadata = {
    extractedFrom: 'folder_name',
  };
  
  const skuMatch = folderName.match(skuPattern);
  if (skuMatch) {
    metadata.sku = skuMatch[1];
  }
  
  const priceMatch = folderName.match(/[_\-\s](\d{2,6})円?$/);
  if (priceMatch) {
    metadata.price = parseInt(priceMatch[1], 10);
  }
  
  let title = folderName;
  if (metadata.sku) {
    title = title.replace(skuPattern, '').trim();
  }
  if (priceMatch) {
    title = title.replace(/[_\-\s]\d{2,6}円?$/, '').trim();
  }
  title = title.replace(/^[_\-\s]+|[_\-\s]+$/g, '');
  
  if (title) {
    metadata.title = title;
  }
  
  return metadata;
}

function detectOptimalGroupingDepth(entries: ZipFileEntry[]): number {
  const imagePaths = entries
    .filter(e => !e.isDirectory && isImageFile(e.name))
    .map(e => e.path);
  
  if (imagePaths.length === 0) return 1;
  
  const depthCounts = new Map<number, Set<string>>();
  
  for (const path of imagePaths) {
    const parts = path.split('/').filter(Boolean);
    for (let depth = 1; depth < parts.length; depth++) {
      const parentPath = parts.slice(0, depth).join('/');
      if (!depthCounts.has(depth)) {
        depthCounts.set(depth, new Set());
      }
      depthCounts.get(depth)!.add(parentPath);
    }
  }
  
  const targetProductCount = Math.max(1, Math.floor(imagePaths.length / 5));
  
  let bestDepth = 1;
  let bestDiff = Infinity;
  
  depthCounts.forEach((folders, depth) => {
    const diff = Math.abs(folders.size - targetProductCount);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestDepth = depth;
    }
  });
  
  return bestDepth;
}

// ============================================================
// メイン処理クラス
// ============================================================

export class ZipProcessor {
  private options: Required<ZipProcessOptions>;
  
  constructor(options: ZipProcessOptions = {}) {
    this.options = {
      groupingDepth: options.groupingDepth ?? 'auto',
      imagesOnly: options.imagesOnly ?? true,
      convertToBase64: options.convertToBase64 ?? false,
      mainImagePatterns: options.mainImagePatterns ?? DEFAULT_MAIN_IMAGE_PATTERNS,
      ignorePatterns: options.ignorePatterns ?? DEFAULT_IGNORE_PATTERNS,
      maxFileSizeMB: options.maxFileSizeMB ?? 10,
      skuPattern: options.skuPattern ?? DEFAULT_SKU_PATTERN,
    };
  }
  
  async processZip(file: File | Blob): Promise<ZipProcessResult> {
    const startTime = Date.now();
    const result: ZipProcessResult = {
      success: false,
      totalFiles: 0,
      totalImages: 0,
      productGroups: [],
      skippedFiles: [],
      errors: [],
      processingTime: 0,
    };
    
    try {
      const zip = await JSZip.loadAsync(file);
      const entries = await this.getEntries(zip);
      result.totalFiles = entries.length;
      
      const groupingDepth = this.options.groupingDepth === 'auto'
        ? detectOptimalGroupingDepth(entries)
        : this.options.groupingDepth;
      
      console.log(`[ZipProcessor] Grouping depth: ${groupingDepth}`);
      
      const groups = await this.groupByProduct(zip, entries, groupingDepth);
      result.productGroups = groups;
      result.totalImages = groups.reduce((sum, g) => sum + g.images.length, 0);
      result.success = true;
      
    } catch (error: any) {
      result.errors.push(error.message);
    }
    
    result.processingTime = Date.now() - startTime;
    return result;
  }
  
  private async getEntries(zip: JSZip): Promise<ZipFileEntry[]> {
    const entries: ZipFileEntry[] = [];
    
    zip.forEach((relativePath, zipEntry) => {
      const shouldIgnore = this.options.ignorePatterns.some(p => p.test(relativePath));
      if (shouldIgnore) return;
      
      entries.push({
        name: zipEntry.name.split('/').pop() || zipEntry.name,
        path: relativePath,
        relativePath,
        isDirectory: zipEntry.dir,
        depth: getPathDepth(relativePath),
        size: 0,
        lastModified: zipEntry.date,
      });
    });
    
    return entries;
  }
  
  private async groupByProduct(
    zip: JSZip,
    entries: ZipFileEntry[],
    groupingDepth: number
  ): Promise<ProductGroup[]> {
    const groups = new Map<string, ProductGroup>();
    const imageEntries = entries.filter(e => !e.isDirectory && isImageFile(e.name));
    
    for (const entry of imageEntries) {
      const parts = entry.path.split('/').filter(Boolean);
      
      let groupPath: string;
      let groupName: string;
      
      if (parts.length <= groupingDepth) {
        groupPath = '';
        groupName = 'root';
      } else {
        groupPath = parts.slice(0, groupingDepth).join('/');
        groupName = parts[groupingDepth - 1];
      }
      
      if (!groups.has(groupPath)) {
        const metadata = extractMetadataFromFolderName(groupName, this.options.skuPattern);
        
        groups.set(groupPath, {
          id: `group-${groups.size + 1}`,
          name: groupName,
          sku: metadata.sku || null,
          folderPath: groupPath,
          images: [],
          metadata,
          depth: groupingDepth,
        });
      }
      
      const group = groups.get(groupPath)!;
      
      try {
        const zipEntry = zip.file(entry.path);
        if (!zipEntry) continue;
        
        const blob = await zipEntry.async('blob');
        if (blob.size > this.options.maxFileSizeMB * 1024 * 1024) {
          console.warn(`[ZipProcessor] Skipping large file: ${entry.path}`);
          continue;
        }
        
        const isMain = this.options.mainImagePatterns.some(p => p.test(entry.name));
        
        const extractedImage: ExtractedImage = {
          filename: entry.name,
          path: entry.path,
          data: blob,
          mimeType: getMimeType(entry.name),
          size: blob.size,
          isMain,
          sortOrder: group.images.length,
        };
        
        if (this.options.convertToBase64) {
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          extractedImage.base64 = `data:${extractedImage.mimeType};base64,${base64}`;
        }
        
        group.images.push(extractedImage);
        
      } catch (error: any) {
        console.error(`[ZipProcessor] Error extracting ${entry.path}:`, error);
      }
    }
    
    for (const group of groups.values()) {
      group.images.sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return a.filename.localeCompare(b.filename);
      });
      
      group.images.forEach((img, idx) => {
        img.sortOrder = idx;
      });
    }
    
    return Array.from(groups.values());
  }
}

const defaultProcessor = new ZipProcessor();

export async function processZipFile(file: File | Blob): Promise<ZipProcessResult> {
  return defaultProcessor.processZip(file);
}

export async function processZipFileWithOptions(
  file: File | Blob,
  options: ZipProcessOptions
): Promise<ZipProcessResult> {
  const processor = new ZipProcessor(options);
  return processor.processZip(file);
}

export default ZipProcessor;
