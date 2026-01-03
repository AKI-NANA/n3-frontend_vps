/**
 * 受注詳細更新API
 * PATCH /api/orders/v2/update-order-details
 *
 * 【機能】
 * 1. 仕入れ値、送料、URLの編集
 * 2. 仕入れステータスの更新（完了日時・担当者ログ付き）
 * 3. 利益の自動再計算
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { ProfitCalculator } from '@/lib/services/profit-calculator';

export const dynamic = 'force-dynamic';

interface UpdateOrderRequest {
  orderId: string; // UUID
  updates: {
    // 仕入れ関連
    actual_sourcing_url?: string;
    cost_price?: number;
    final_shipping_cost?: number;

    // 仕入れステータス
    is_sourced?: boolean;
    sourcing_status?: '未仕入れ' | '仕入れ済み' | 'キャンセル';
    sourcing_date?: string;

    // その他
    credit_card_id?: string;
    notes?: string;
  };
  userId?: string; // 担当者ID（将来的に認証から取得）
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateOrderRequest = await request.json();
    const { orderId, updates, userId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: '注文IDが指定されていません' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 1. 既存の注文データを取得
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders_v2')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { success: false, error: '注文が見つかりません' },
        { status: 404 }
      );
    }

    // 2. 更新データの準備
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: userId || 'system',
    };

    // 3. 仕入れ済みにする場合、ログを記録
    if (updates.is_sourced === true && !existingOrder.is_sourced) {
      updateData.sourcing_date = new Date().toISOString();
      updateData.sourcing_status = '仕入れ済み';

      // ログをnotesに追記
      const logEntry = `\n[${new Date().toISOString()}] 仕入れ完了 by ${userId || 'system'}`;
      updateData.notes = (existingOrder.notes || '') + logEntry;
    }

    // 4. 利益を再計算（仕入れ値または送料が更新された場合）
    if (updates.cost_price !== undefined || updates.final_shipping_cost !== undefined) {
      const calculationInput = {
        marketplace: existingOrder.marketplace,
        sale_price: existingOrder.sale_price,
        items: existingOrder.items,
        cost_price: updates.cost_price ?? existingOrder.cost_price,
        estimated_cost_price: existingOrder.estimated_cost_price,
        shipping_cost: updates.final_shipping_cost ?? existingOrder.final_shipping_cost,
        estimated_shipping_cost: existingOrder.estimated_shipping_cost,
        platform_fee_rate: existingOrder.platform_fee_rate,
      };

      const result = ProfitCalculator.calculate(calculationInput);

      // 利益計算結果を反映
      updateData.final_profit = result.final_profit;
      updateData.profit_margin = result.profit_margin;
      updateData.is_negative_profit_risk = result.is_negative_profit_risk;
      updateData.risk_reason = result.risk_reason;

      // 仕入れ値と送料が両方確定した場合、利益確定フラグをON
      if (
        (updates.cost_price !== undefined || existingOrder.cost_price) &&
        (updates.final_shipping_cost !== undefined || existingOrder.final_shipping_cost)
      ) {
        updateData.is_profit_confirmed = true;
      }
    }

    // 5. データベースを更新
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders_v2')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: '注文を更新しました',
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
