// ファイル: /app/api/tools/queue-content/route.ts
// 生成されたコンテンツを投稿キューに追加するAPI

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { GeneratedContent } from '@/types/ai';

/**
 * コンテンツを投稿キューに追加
 * POST /api/tools/queue-content
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 入力検証
        const {
            site_id,
            persona_id,
            content_title,
            article_markdown,
            image_prompts = [],
            final_affiliate_links = [],
            platform = 'wordpress',
            scheduled_at = new Date().toISOString(),
        } = body;

        if (!site_id || !persona_id) {
            return NextResponse.json(
                { success: false, error: 'site_id と persona_id は必須です' },
                { status: 400 }
            );
        }

        if (!content_title || !article_markdown) {
            return NextResponse.json(
                { success: false, error: 'content_title と article_markdown は必須です' },
                { status: 400 }
            );
        }

        // 投稿キューに追加
        const { data, error } = await supabase
            .from('generated_content_queue')
            .insert([
                {
                    site_id,
                    persona_id,
                    content_title,
                    article_markdown,
                    image_prompts,
                    final_affiliate_links,
                    platform,
                    scheduled_at,
                    status: 'pending',
                },
            ])
            .select();

        if (error) {
            console.error('キュー追加エラー:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'コンテンツをキューに追加しました',
            queue_item: data[0],
        });
    } catch (error: any) {
        console.error('予期しないエラー:', error);
        return NextResponse.json(
            { success: false, error: error.message || '予期しないエラーが発生しました' },
            { status: 500 }
        );
    }
}

/**
 * 投稿キューの一覧を取得
 * GET /api/tools/queue-content
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'pending';
        const limit = parseInt(searchParams.get('limit') || '50');
        const site_id = searchParams.get('site_id');

        let query = supabase
            .from('generated_content_queue')
            .select('*')
            .eq('status', status)
            .order('scheduled_at', { ascending: true })
            .limit(limit);

        // サイトIDでフィルタ（オプション）
        if (site_id) {
            query = query.eq('site_id', parseInt(site_id));
        }

        const { data, error } = await query;

        if (error) {
            console.error('キュー取得エラー:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            queue_items: data,
            count: data.length,
        });
    } catch (error: any) {
        console.error('予期しないエラー:', error);
        return NextResponse.json(
            { success: false, error: error.message || '予期しないエラーが発生しました' },
            { status: 500 }
        );
    }
}

/**
 * キューアイテムのステータスを更新
 * PATCH /api/tools/queue-content
 */
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status, post_url } = body;

        if (!id || !status) {
            return NextResponse.json(
                { success: false, error: 'id と status は必須です' },
                { status: 400 }
            );
        }

        const updateData: any = {
            status,
            updated_at: new Date().toISOString(),
        };

        if (post_url) {
            updateData.post_url = post_url;
        }

        const { data, error } = await supabase
            .from('generated_content_queue')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) {
            console.error('キュー更新エラー:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'キューアイテムを更新しました',
            queue_item: data[0],
        });
    } catch (error: any) {
        console.error('予期しないエラー:', error);
        return NextResponse.json(
            { success: false, error: error.message || '予期しないエラーが発生しました' },
            { status: 500 }
        );
    }
}

/**
 * キューアイテムを削除
 * DELETE /api/tools/queue-content
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'id パラメータは必須です' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('generated_content_queue')
            .delete()
            .eq('id', parseInt(id));

        if (error) {
            console.error('キュー削除エラー:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'キューアイテムを削除しました',
        });
    } catch (error: any) {
        console.error('予期しないエラー:', error);
        return NextResponse.json(
            { success: false, error: error.message || '予期しないエラーが発生しました' },
            { status: 500 }
        );
    }
}
