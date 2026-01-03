// Global Data Pulse - Queue API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET(request: NextRequest) {
  try {
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: queue, error } = await supabase
        .from('generation_queue')
        .select('*')
        .in('status', ['queued', 'processing'])
        .order('priority', { ascending: false })
        .order('created_at')
        .limit(20);

      if (error) {
        console.error('Queue fetch error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch queue' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        queue: queue || []
      });
    } else {
      // モックデータ
      return NextResponse.json({
        success: true,
        queue: [],
        mock: true
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
