// app/api/inventory/update-location/route.ts
/**
 * 保管場所更新API
 * 
 * inventory_masterのstorage_locationを更新
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, storage_location, counted_by } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'IDが必要です' },
        { status: 400 }
      );
    }
    
    // inventory_master を更新
    const { error } = await supabase
      .from('inventory_master')
      .update({
        storage_location,
        counted_by,
        last_counted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) {
      console.error('[update-location] Error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('[update-location] Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
