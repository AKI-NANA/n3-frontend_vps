// lib/api.ts
/**
 * N3 Empire OS - レガシーPHP API統合
 * 
 * 【帝国法典】
 * - console.log 禁止
 * - エラーは imperialErrorLog 経由
 * - 環境変数は NEXT_PUBLIC_* のみ許可
 * 
 * ⚠️ このファイルはレガシーPHPバックエンドとの互換性維持用です
 * 新規開発では Supabase + Server Actions を使用してください
 */

import { imperialErrorLog } from "@/lib/shared/imperial-logger";

// ============================================================
// 型定義
// ============================================================

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

// ============================================================
// 設定
// ============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ============================================================
// コア関数
// ============================================================

/**
 * 汎用API呼び出し関数
 * PHPバックエンドとの通信用
 */
export async function apiCall<T = unknown>(
  action: string,
  data?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const formData = new FormData();
    formData.append('action', action);
    
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await fetch(`${API_BASE_URL}/index.php`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await imperialErrorLog('Legacy API Error', `Action: ${action}, Error: ${errorMessage}`);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ============================================================
// 便利関数（レガシー互換）
// ============================================================

export async function getDashboardStats(): Promise<ApiResponse> {
  return apiCall('get_dashboard_stats');
}

export async function getProducts(page = 1, perPage = 50): Promise<ApiResponse> {
  return apiCall('get_data', { page, per_page: perPage });
}

export async function addProduct(productData: Record<string, unknown>): Promise<ApiResponse> {
  return apiCall('add_item', productData);
}

export async function getInventory(page = 1): Promise<ApiResponse> {
  return apiCall('get_inventory', { page });
}

export async function getEbayData(): Promise<ApiResponse> {
  return apiCall('get_real_data');
}

export async function healthCheck(): Promise<ApiResponse> {
  return apiCall('health_check');
}

export async function testDatabase(type: 'mysql' | 'postgresql' = 'postgresql'): Promise<ApiResponse> {
  return apiCall('test_database', { type });
}

export async function startEbaySync(quantity = 100): Promise<ApiResponse> {
  return apiCall('start_data_fetch', { platform: 'ebay', quantity });
}
