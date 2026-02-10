'use client';

/**
 * 仕入れ先承認UIページ
 * AIが特定した仕入れ先候補を人間が最終承認する
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SupplierDatabaseService } from '@/services/ai_pipeline/supplier-database-service';
import { SupplierCandidate } from '@/types/supplier';
import { supabase } from '@/lib/supabase/client';

interface ProductWithCandidates {
  id: string;
  title: string;
  english_title?: string;
  sm_sales_count?: number;
  sm_competitor_count?: number;
  sm_profit_margin?: number;
  provisional_ui_score?: number;
  final_ui_score?: number;
  ddp_price_usd?: number;
  candidates: SupplierCandidate[];
}

export default function SupplierApprovalPage() {
  const searchParams = useSearchParams();
  const productIdFromUrl = searchParams.get('product_id');

  const [products, setProducts] = useState<ProductWithCandidates[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCandidates | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (productIdFromUrl && products.length > 0) {
      const product = products.find((p) => p.id === productIdFromUrl);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [productIdFromUrl, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // AI_COMPLETEDステータスの商品を取得
      const { data: researchData, error } = await supabase
        .from('products_master')
        .select('*')
        .eq('research_status', 'AI_COMPLETED')
        .order('provisional_ui_score', { ascending: false, nullsFirst: false })
        .limit(100);

      if (error) throw error;

      // 各商品の仕入れ先候補を取得
      const productsWithCandidates: ProductWithCandidates[] = await Promise.all(
        (researchData || []).map(async (product) => {
          const candidates = await supplierDbService.getSupplierCandidates(product.id);
          return {
            id: product.id,
            title: product.title,
            english_title: product.english_title,
            sm_sales_count: product.sm_sales_count,
            sm_competitor_count: product.sm_competitor_count,
            sm_profit_margin: product.sm_profit_margin,
            provisional_ui_score: product.provisional_ui_score,
            final_ui_score: product.final_ui_score,
            ddp_price_usd: product.ddp_price_usd,
            candidates,
          };
        })
      );

      setProducts(productsWithCandidates);
    } catch (error) {
      console.error('商品データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCandidate = async (
    productId: string,
    candidateId: string
  ) => {
    const confirmed = confirm(
      'この仕入れ先を承認し、最終Uiスコアを確定しますか？'
    );
    if (!confirmed) return;

    setApproving(true);
    try {
      const response = await fetch('/api/research/supplier/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          candidate_id: candidateId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`承認完了！最終Uiスコア: ${result.final_ui_score?.toLocaleString()}点`);

        // データ再読み込み
        await loadProducts();

        // 選択中の商品をクリア
        setSelectedProduct(null);
      } else {
        alert(`エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('承認エラー:', error);
      alert('承認に失敗しました');
    } finally {
      setApproving(false);
    }
  };

  const handleRejectProduct = async (productId: string) => {
    const confirmed = confirm(
      '本当にこの商品を却下しますか？research_statusをSCOREDに戻します。'
    );
    if (!confirmed) return;

    try {
      await supplierDbService.updateResearchStatus(productId, 'SCORED');
      alert('商品を却下しました');
      await loadProducts();
      setSelectedProduct(null);
    } catch (error) {
      console.error('却下エラー:', error);
      alert('却下に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">仕入れ先承認</h1>
          <p className="mt-2 text-gray-600">
            AIが特定した仕入れ先候補を確認し、最終承認を行います
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側: 商品リスト */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">承認待ち商品</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {products.length}件
                </p>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    読み込み中...
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    承認待ちの商品がありません
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedProduct?.id === product.id
                          ? 'bg-blue-50 border-l-4 border-l-blue-500'
                          : ''
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.title || product.english_title || 'N/A'}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">暫定スコア:</span>
                          <span className="font-medium">
                            {product.provisional_ui_score?.toLocaleString() || '-'}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">候補数:</span>
                          <span className="font-medium text-green-600">
                            {product.candidates.length}件
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 右側: 仕入れ先候補詳細 */}
          <div className="lg:col-span-2">
            {!selectedProduct ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                左側から商品を選択してください
              </div>
            ) : (
              <div className="space-y-6">
                {/* 商品情報 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    商品情報
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">商品名:</span>
                      <p className="text-gray-900 font-medium">
                        {selectedProduct.title || selectedProduct.english_title}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <span className="text-sm text-gray-500">販売数:</span>
                        <p className="text-lg font-bold text-gray-900">
                          {selectedProduct.sm_sales_count || 0}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">競合数:</span>
                        <p className="text-lg font-bold text-gray-900">
                          {selectedProduct.sm_competitor_count || 0}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">利益率:</span>
                        <p className="text-lg font-bold text-gray-900">
                          {selectedProduct.sm_profit_margin
                            ? `${selectedProduct.sm_profit_margin.toFixed(1)}%`
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          eBay販売価格:
                        </span>
                        <p className="text-lg font-bold text-gray-900">
                          {selectedProduct.ddp_price_usd
                            ? `$${selectedProduct.ddp_price_usd.toFixed(2)}`
                            : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-sm text-gray-500">
                        暫定Uiスコア:
                      </span>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedProduct.provisional_ui_score?.toLocaleString() || '-'}
                        <span className="text-sm text-gray-500 ml-2">点</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 仕入れ先候補リスト */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    仕入れ先候補（{selectedProduct.candidates.length}件）
                  </h2>

                  {selectedProduct.candidates.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      候補が見つかりませんでした
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedProduct.candidates.map((candidate, index) => (
                        <div
                          key={candidate.id || index}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                候補 #{index + 1}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {candidate.supplier_platform}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                ¥{candidate.candidate_price_jpy.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                +送料 ¥
                                {candidate.estimated_domestic_shipping_jpy.toLocaleString()}
                              </p>
                              <p className="text-sm font-medium text-gray-700 mt-1">
                                総額: ¥{candidate.total_cost_jpy.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                            <div>
                              <span className="text-gray-500">信頼度:</span>
                              <div className="mt-1">
                                <div className="bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 rounded-full h-2"
                                    style={{
                                      width: `${candidate.confidence_score * 100}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600">
                                  {(candidate.confidence_score * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                マッチング手法:
                              </span>
                              <p className="font-medium text-gray-900 mt-1">
                                {candidate.matching_method}
                              </p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <span className="text-sm text-gray-500">URL:</span>
                            <a
                              href={candidate.supplier_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline block truncate"
                            >
                              {candidate.supplier_url}
                            </a>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleApproveCandidate(
                                  selectedProduct.id,
                                  candidate.id
                                )
                              }
                              disabled={approving}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              {approving ? '承認中...' : 'この候補を承認'}
                            </button>
                            <button
                              onClick={() =>
                                window.open(candidate.supplier_url, '_blank')
                              }
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              確認
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* アクション */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    その他のアクション
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRejectProduct(selectedProduct.id)}
                      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      この商品を却下
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
