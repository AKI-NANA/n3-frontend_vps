/**
 * 出品停止（Delisting）エンドポイント
 * POST /api/listing/delist
 *
 * 商品の出品を停止し、排他的ロックを解放します
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ExclusiveLockManager } from '@/services/ExclusiveLockManager';
import { Platform } from '@/types/strategy';

interface DelistRequest {
  sku: string;
  platform: Platform;
  reason?: string;  // 停止理由（オプション）
}

export async function POST(request: NextRequest) {
  try {
    const body: DelistRequest = await request.json();
    const { sku, platform, reason } = body;

    if (!sku || !platform) {
      return NextResponse.json(
        {
          success: false,
          error: 'SKU and platform are required',
        },
        { status: 400 }
      );
    }

    console.log(`🛑 出品停止処理開始: ${sku} on ${platform}`);

    const supabase = await createClient();

    // 1. 商品ステータスを「出品停止」に更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        status: '出品停止',
        execution_status: 'skipped',
        updated_at: new Date().toISOString(),
      })
      .eq('sku', sku);

    if (updateError) {
      console.error(`❌ 商品ステータス更新エラー: ${sku}`, updateError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to update product status: ${updateError.message}`,
        },
        { status: 500 }
      );
    }

    // 2. 排他的ロックを解放
    const lockReleased = await ExclusiveLockManager.releaseLock(sku);

    if (!lockReleased) {
      console.warn(`⚠️ ロック解放失敗または既に解放済み: ${sku}`);
      // ロック解放失敗でもステータスは更新されているので成功扱い
    } else {
      console.log(`🔓 排他的ロック解放成功: ${sku}`);
    }

    // 3. 出品停止ログを記録
    await supabase.from('listing_result_logs').insert({
      sku,
      platform,
      account_id: 0,  // 手動停止の場合はaccount_id=0
      success: true,
      error_code: 'DELISTED',
      error_message: reason || 'Manual delisting',
      created_at: new Date().toISOString(),
    });

    console.log(`✅ 出品停止完了: ${sku} on ${platform}`);

    return NextResponse.json({
      success: true,
      message: `Successfully delisted ${sku} from ${platform}`,
      lock_released: lockReleased,
    });
  } catch (error) {
    console.error('❌ 出品停止エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * バッチ出品停止エンドポイント
 * PUT /api/listing/delist
 */
export async function PUT(request: NextRequest) {
  try {
    const body: { skus: string[]; platform: Platform; reason?: string } =
      await request.json();
    const { skus, platform, reason } = body;

    if (!skus || skus.length === 0 || !platform) {
      return NextResponse.json(
        {
          success: false,
          error: 'SKUs array and platform are required',
        },
        { status: 400 }
      );
    }

    console.log(`🛑 バッチ出品停止開始: ${skus.length}件 on ${platform}`);

    const supabase = await createClient();
    const results: { sku: string; success: boolean; error?: string }[] = [];

    // 各SKUを順次処理
    for (const sku of skus) {
      try {
        // ステータス更新
        const { error: updateError } = await supabase
          .from('products_master')
          .update({
            status: '出品停止',
            execution_status: 'skipped',
            updated_at: new Date().toISOString(),
          })
          .eq('sku', sku);

        if (updateError) {
          results.push({
            sku,
            success: false,
            error: updateError.message,
          });
          continue;
        }

        // ロック解放
        await ExclusiveLockManager.releaseLock(sku);

        // ログ記録
        await supabase.from('listing_result_logs').insert({
          sku,
          platform,
          account_id: 0,
          success: true,
          error_code: 'DELISTED',
          error_message: reason || 'Batch manual delisting',
          created_at: new Date().toISOString(),
        });

        results.push({ sku, success: true });
      } catch (error) {
        results.push({
          sku,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // レート制限対策
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log(
      `✅ バッチ出品停止完了: 成功 ${successCount}件 / 失敗 ${failureCount}件`
    );

    return NextResponse.json({
      success: true,
      processed: skus.length,
      succeeded: successCount,
      failed: failureCount,
      results,
    });
  } catch (error) {
    console.error('❌ バッチ出品停止エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 古いロックの自動クリーンアップ（定期実行用）
 * DELETE /api/listing/delist?cleanup=true
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cleanup = searchParams.get('cleanup');

    if (cleanup !== 'true') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid cleanup parameter',
        },
        { status: 400 }
      );
    }

    console.log('🧹 古い排他的ロックのクリーンアップ開始');

    const supabase = await createClient();

    // 30日以上前のロックを自動解放
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: oldLocks, error: fetchError } = await supabase
      .from('exclusive_locks')
      .select('*')
      .eq('is_active', true)
      .lt('locked_at', thirtyDaysAgo.toISOString());

    if (fetchError) {
      throw new Error(`Failed to fetch old locks: ${fetchError.message}`);
    }

    if (!oldLocks || oldLocks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No old locks to clean up',
        cleaned: 0,
      });
    }

    // ロックを解放
    const { error: updateError } = await supabase
      .from('exclusive_locks')
      .update({
        is_active: false,
        unlocked_at: new Date().toISOString(),
      })
      .in(
        'lock_id',
        oldLocks.map((lock) => lock.lock_id)
      );

    if (updateError) {
      throw new Error(`Failed to release old locks: ${updateError.message}`);
    }

    console.log(`✅ クリーンアップ完了: ${oldLocks.length}件のロックを解放`);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${oldLocks.length} old locks`,
      cleaned: oldLocks.length,
      locks: oldLocks.map((lock) => ({
        sku: lock.sku,
        platform: lock.locked_platform,
        locked_at: lock.locked_at,
      })),
    });
  } catch (error) {
    console.error('❌ クリーンアップエラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
