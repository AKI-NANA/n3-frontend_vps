import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // 総動画数
    const { count: totalVideos } = await supabase
      .from('media_content')
      .select('*', { count: 'exact', head: true });
    
    // 公開済み動画数
    const { count: publishedVideos } = await supabase
      .from('media_content')
      .select('*', { count: 'exact', head: true })
      .eq('publish_status', 'published');
    
    // 下書き動画数
    const { count: draftVideos } = await supabase
      .from('media_content')
      .select('*', { count: 'exact', head: true })
      .eq('publish_status', 'draft');
    
    // レンダリング中の数
    const { count: renderingCount } = await supabase
      .from('media_content')
      .select('*', { count: 'exact', head: true })
      .eq('render_status', 'rendering');
    
    // YouTube統計を集計
    const { data: viewsData } = await supabase
      .from('media_content')
      .select('metadata')
      .eq('publish_status', 'published');
    
    let totalViews = 0;
    let totalLikes = 0;
    
    if (viewsData) {
      for (const item of viewsData) {
        if (item.metadata) {
          totalViews += item.metadata.youtube_views || 0;
          totalLikes += item.metadata.youtube_likes || 0;
        }
      }
    }
    
    // UTM経由のShopifyクリック（仮実装）
    const shopifyClicks = Math.floor(totalViews * 0.02); // 2%コンバージョン仮定
    
    return NextResponse.json({
      totalVideos: totalVideos || 0,
      publishedVideos: publishedVideos || 0,
      draftVideos: draftVideos || 0,
      renderingCount: renderingCount || 0,
      totalViews,
      totalLikes,
      shopifyClicks
    });
    
  } catch (error) {
    console.error('統計API エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
