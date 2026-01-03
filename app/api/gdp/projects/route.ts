// Global Data Pulse - Projects API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase設定を.env.localから取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// POSTとGETハンドラーをエクスポート
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, sourceUrl, languages, schedulePost, generateVideo, priority } = body;

    // バリデーション
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Supabaseが設定されている場合のみDB操作
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // プロジェクトをDBに作成
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: topic,
          topic: topic,
          source_url: sourceUrl,
          status: 'pending',
          buzz_score: 80,
          metadata: {
            languages: languages || ['ja', 'en', 'zh'],
            schedule_post: schedulePost ?? true,
            generate_video: generateVideo ?? true
          }
        })
        .select()
        .single();

      if (projectError) {
        console.error('Project creation error:', projectError);
        return NextResponse.json(
          { error: 'Failed to create project' },
          { status: 500 }
        );
      }

      // 生成キューに追加
      const { error: queueError } = await supabase
        .from('generation_queue')
        .insert({
          project_id: project.id,
          task_type: 'content_generation',
          priority: priority || 50,
          status: 'queued',
          input_data: {
            topic,
            source_url: sourceUrl,
            languages: languages || ['ja', 'en', 'zh'],
            schedule_post: schedulePost ?? true,
            generate_video: generateVideo ?? true
          }
        });

      if (queueError) {
        console.error('Queue error:', queueError);
      }

      return NextResponse.json({
        success: true,
        project_id: project.id,
        message: 'Project created and queued for processing'
      });
    } else {
      // Supabaseが設定されていない場合はモックレスポンス
      const mockProjectId = `mock_${Date.now()}`;
      
      return NextResponse.json({
        success: true,
        project_id: mockProjectId,
        message: 'Project created (mock mode - configure Supabase for full functionality)',
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Supabaseが設定されている場合
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      let query = supabase
        .from('projects')
        .select(`
          *,
          contents(*)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: projects, error } = await query;

      if (error) {
        console.error('Fetch error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch projects' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        projects: projects || [],
        total: projects?.length || 0
      });
    } else {
      // モックデータを返す
      const mockProjects = [
        {
          id: 'mock1',
          title: 'AI投資が2026年に5000億ドルに到達',
          topic: 'AI投資が2026年に5000億ドルに到達',
          status: 'completed',
          buzz_score: 92,
          created_at: new Date().toISOString(),
          contents: []
        },
        {
          id: 'mock2',
          title: '量子コンピューターの商用化が加速',
          topic: '量子コンピューターの商用化が加速',
          status: 'generating',
          buzz_score: 85,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          contents: []
        }
      ];

      return NextResponse.json({
        success: true,
        projects: mockProjects,
        total: mockProjects.length,
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
