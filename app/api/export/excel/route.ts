/**
 * Excelエクスポート API
 * 
 * POST /api/export/excel
 * 
 * リクエスト:
 * { data: object[], filename?: string }
 * 
 * レスポンス:
 * CSVファイル（Excel互換）
 * 
 * 注: xlsxパッケージがない場合はCSVで出力
 * TODO: npm install xlsx してXLSX出力に切り替え
 */

import { NextRequest, NextResponse } from 'next/server';

// CSVエスケープ
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// JSONをCSVに変換
function jsonToCSV(data: object[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const headerRow = headers.map(escapeCSV).join(',');
  
  const dataRows = data.map((row: any) =>
    headers.map((h) => escapeCSV(row[h])).join(',')
  );
  
  // BOM付きUTF-8（Excel対応）
  return '\uFEFF' + [headerRow, ...dataRows].join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, filename = 'export' } = body;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Data array is required' },
        { status: 400 }
      );
    }
    
    // CSV形式で出力（Excel互換）
    const csv = jsonToCSV(data);
    const buffer = Buffer.from(csv, 'utf-8');
    
    // レスポンス（Excel互換CSV）
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    });
  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate file' },
      { status: 500 }
    );
  }
}
