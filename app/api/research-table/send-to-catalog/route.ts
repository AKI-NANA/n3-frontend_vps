// app/api/research-table/send-to-catalog/route.ts
/**
 * リサーチ結果をCatalog承認待ちに送信
 * status = 'research_pending' に更新
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDsが必要です' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('research_repository')
      .update({ 
        status: 'research_pending',
        updated_at: new Date().toISOString()
      })
      .in('id', ids)
      .in('status', ['new', 'analyzing', 'approved'])
      .select('id, asin, title');

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ 
      success: true, 
      updated: data?.length || 0,
      items: data
    });

  } catch (error: any) {
    console.error('Send to catalog error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
