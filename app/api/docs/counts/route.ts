// app/api/docs/counts/route.ts
/**
 * ドキュメントカテゴリ別件数取得API
 * 一回のリクエストで全カテゴリの件数を返す
 */

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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
  
  return 'guides';
}

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const docsDir = path.join(projectRoot, 'docs');
    
    const counts: Record<string, number> = {
      errors: 0,
      guides: 0,
      api: 0,
      architecture: 0,
      deployment: 0,
    };
    
    async function scanDir(dir: string) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            await scanDir(fullPath);
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const category = inferCategory(entry.name);
            counts[category]++;
          }
        }
      } catch (error) {
        console.error(`ディレクトリスキャンエラー:`, error);
      }
    }
    
    await scanDir(docsDir);
    
    return NextResponse.json({ counts });
  } catch (error: any) {
    console.error('[docs/counts] エラー:', error);
    return NextResponse.json({ counts: {}, error: error.message });
  }
}
