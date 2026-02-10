// app/api/docs/list/route.ts
/**
 * ドキュメント一覧取得API
 * ファイルシステムから直接読み込み
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface DocItem {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  status: 'active' | 'deprecated' | 'draft';
}

// カテゴリとディレクトリのマッピング
const CATEGORY_DIRS: Record<string, string[]> = {
  errors: ['docs/errors'],
  guides: ['docs'],  // ルートのGUIDE, SETUP系
  api: ['docs'],     // API, SPEC系
  architecture: ['docs', 'docs/plans'], // PLAN, DESIGN系
  deployment: ['docs'], // DEPLOY, VPS系
};

// ファイル名からカテゴリを推測
function inferCategory(fileName: string): string {
  const name = fileName.toUpperCase();
  
  if (name.includes('ERROR') || name.includes('FIX') || name.includes('TROUBLESHOOT')) {
    return 'errors';
  }
  if (name.includes('DEPLOY') || name.includes('VPS') || name.includes('VERCEL') || name.includes('PRODUCTION')) {
    return 'deployment';
  }
  if (name.includes('API') || name.includes('SPEC') || name.includes('INTEGRATION')) {
    return 'api';
  }
  if (name.includes('PLAN') || name.includes('DESIGN') || name.includes('ARCHITECTURE') || name.includes('SCHEMA')) {
    return 'architecture';
  }
  if (name.includes('GUIDE') || name.includes('SETUP') || name.includes('README') || name.includes('GETTING_STARTED')) {
    return 'guides';
  }
  
  // デフォルト
  return 'guides';
}

// ファイル名からタグを抽出
function extractTags(fileName: string): string[] {
  const tags: string[] = [];
  const name = fileName.toUpperCase();
  
  if (name.includes('EBAY')) tags.push('eBay');
  if (name.includes('AMAZON')) tags.push('Amazon');
  if (name.includes('QOO10')) tags.push('Qoo10');
  if (name.includes('SUPABASE')) tags.push('Supabase');
  if (name.includes('VERCEL')) tags.push('Vercel');
  if (name.includes('VPS')) tags.push('VPS');
  if (name.includes('AI')) tags.push('AI');
  if (name.includes('SHIPPING')) tags.push('Shipping');
  if (name.includes('INVENTORY')) tags.push('Inventory');
  if (name.includes('LISTING')) tags.push('Listing');
  if (name.includes('SECURITY')) tags.push('Security');
  if (name.includes('DATABASE') || name.includes('SCHEMA')) tags.push('Database');
  if (name.includes('MIGRATION')) tags.push('Migration');
  if (name.includes('SESSION') || name.includes('HANDOVER')) tags.push('Handover');
  if (name.includes('N3')) tags.push('N3');
  
  return tags.length > 0 ? tags : ['General'];
}

// タイトルを整形
function formatTitle(fileName: string): string {
  return fileName
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'errors';
    
    const projectRoot = process.cwd();
    const docsDir = path.join(projectRoot, 'docs');
    
    // docsディレクトリ内のすべてのmdファイルをスキャン
    const docs: DocItem[] = [];
    
    async function scanDir(dir: string, relativePath: string = '') {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
          
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            await scanDir(fullPath, relPath);
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const stat = await fs.stat(fullPath);
            const inferredCategory = inferCategory(entry.name);
            
            // 要求されたカテゴリに一致するもののみ
            if (inferredCategory === category) {
              docs.push({
                id: relPath.replace(/[\/\.]/g, '-'),
                title: formatTitle(entry.name),
                description: `docs/${relPath}`,
                category: inferredCategory,
                path: `docs/${relPath}`,
                createdAt: stat.birthtime.toISOString(),
                updatedAt: stat.mtime.toISOString(),
                tags: extractTags(entry.name),
                status: 'active',
              });
            }
          }
        }
      } catch (error) {
        console.error(`ディレクトリスキャンエラー (${dir}):`, error);
      }
    }
    
    await scanDir(docsDir);
    
    // 更新日時で降順ソート
    docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    return NextResponse.json({ 
      docs, 
      source: 'filesystem',
      total: docs.length,
    });
  } catch (error: any) {
    console.error('[docs/list] エラー:', error);
    return NextResponse.json({ docs: [], source: 'error', error: error.message });
  }
}
