// lib/n8n/listing-webhook.ts
/**
 * n8n Webhook連携
 * eBay出品をn8n経由で実行
 */

const N8N_WEBHOOK_URL = 'http://160.16.120.186:5678/webhook/n3-ebay-listing';

export interface ListingRequest {
  sku: string;
  product_id?: number;
  title: string;
  description?: string;
  price: number;
  stock: number;
  ebay_category_id?: string;
  main_image_url?: string;
}

export async function submitToN8n(listing: ListingRequest) {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listing),
    });

    if (!response.ok) {
      throw new Error(`n8n Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ n8n Response:', result);
    return result;
  } catch (error) {
    console.error('❌ n8n Connection Error:', error);
    throw error;
  }
}

// 複数商品の一括送信
export async function submitBulkToN8n(listings: ListingRequest[]) {
  const results = [];
  
  for (const listing of listings) {
    try {
      const result = await submitToN8n(listing);
      results.push({ success: true, sku: listing.sku, result });
    } catch (error) {
      results.push({ success: false, sku: listing.sku, error });
    }
    
    // レート制限対策（1秒待機）
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}
