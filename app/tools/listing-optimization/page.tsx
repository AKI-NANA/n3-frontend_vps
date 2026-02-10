/**
 * AI出品最適化 - 統合ページ
 *
 * 3つのツールを1つに統合:
 * - 出品最適化（ヘルススコア）
 * - SEO最適化
 * - 出品エディタ（AI改善提案）
 *
 * タブ構成:
 * 1. ヘルススコア - AIImprovementPanel
 * 2. AI改善提案 - AIImprovementsTab
 * 3. SEO最適化 - SEOOptimizerTab
 * 4. 一括適用 - BatchApplyTab
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { AIImprovementPanel } from '@/components/listing/ai-improvement-panel';
import { SEOOptimizerTab } from './components/seo-optimizer-tab';
import { AIImprovementsTab } from './components/ai-improvements-tab';
import { BatchApplyTab } from './components/batch-apply-tab';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Loader2,
  ChevronRight,
  Package,
  Zap,
  Activity,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  sku: string;
  title?: string;
  title_en?: string;
  primary_image_url?: string;
  listing_price?: number;
  keywords?: string[];
  description?: string;
  ai_health_score?: {
    overallScore: number;
    breakdown: any;
  };
  ai_last_analyzed_at?: string;
}

interface SEOSuggestions {
  suggested_title?: string;
  seo_keywords?: string[];
  title_feedback?: string;
  image_feedback?: string;
}

interface BatchResult {
  sku: string;
  success: boolean;
  message?: string;
  scoreBefore?: number;
  scoreAfter?: number;
}

export default function IntegratedListingOptimizationPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'health';

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'critical' | 'needs-improvement' | 'good' | 'excellent'>('all');
  const [sortBy, setSortBy] = useState<'score-asc' | 'score-desc' | 'recent'>('score-asc');
  const [activeTab, setActiveTab] = useState(initialTab);

  // SEO最適化用のステート
  const [seoSuggestions, setSeoSuggestions] = useState<SEOSuggestions | null>(null);
  const [seoLoading, setSeoLoading] = useState(false);

  // バッチ処理用のステート
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);

  const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, scoreFilter, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('products_master')
        .select('id, sku, title, title_en, primary_image_url, listing_price, keywords, description, ai_health_score, ai_last_analyzed_at')
        .not('title', 'is', null)
        .limit(100)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load products:', error);
        return;
      }

      setProducts(data || []);

      // 最初の商品を選択
      if (data && data.length > 0) {
        setSelectedProduct(data[0]);
      }
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.sku?.toLowerCase().includes(query) ||
          p.title?.toLowerCase().includes(query) ||
          p.title_en?.toLowerCase().includes(query)
      );
    }

    // スコアフィルター
    if (scoreFilter !== 'all') {
      filtered = filtered.filter((p) => {
        const score = p.ai_health_score?.overallScore || 0;
        switch (scoreFilter) {
          case 'critical':
            return score < 40;
          case 'needs-improvement':
            return score >= 40 && score < 70;
          case 'good':
            return score >= 70 && score < 90;
          case 'excellent':
            return score >= 90;
          default:
            return true;
        }
      });
    }

    // ソート
    filtered.sort((a, b) => {
      const scoreA = a.ai_health_score?.overallScore || 0;
      const scoreB = b.ai_health_score?.overallScore || 0;

      switch (sortBy) {
        case 'score-asc':
          return scoreA - scoreB;
        case 'score-desc':
          return scoreB - scoreA;
        case 'recent':
          return (
            new Date(b.ai_last_analyzed_at || 0).getTime() -
            new Date(a.ai_last_analyzed_at || 0).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500">優秀</Badge>;
    if (score >= 70) return <Badge className="bg-blue-500">良好</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-500">要改善</Badge>;
    return <Badge className="bg-red-500">緊急</Badge>;
  };

  const toggleProductSelection = (productId: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setSelectedIds(newSet);
  };

  // SEO分析
  const handleSEOAnalyze = async () => {
    if (!selectedProduct) return;
    setSeoLoading(true);
    setSeoSuggestions(null);

    try {
      const response = await fetch('/api/seo-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          optimization_type: 'full',
          apply_suggestions: false,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSeoSuggestions(data.ai_suggestions);
      } else {
        console.error('SEO analyze failed:', data.error);
      }
    } catch (error) {
      console.error('SEO analyze error:', error);
    } finally {
      setSeoLoading(false);
    }
  };

  // SEO適用
  const handleSEOApply = async (type: 'title' | 'keywords' | 'full') => {
    if (!selectedProduct) return;

    try {
      const response = await fetch('/api/seo-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          optimization_type: type,
          apply_suggestions: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // 商品リストを更新
        await loadProducts();
        alert(`SEO最適化を適用しました！\nスコア: ${data.health_score_before} → ${data.health_score_after}`);
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error) {
      console.error('SEO apply error:', error);
      alert('最適化の適用に失敗しました');
    }
  };

  // AI改善提案適用
  const handleApplyImprovement = (improvement: any) => {
    console.log('Apply improvement:', improvement);
    // TODO: 改善提案を適用するロジックを実装
  };

  // AI改善提案却下
  const handleRejectImprovement = (improvement: any) => {
    console.log('Reject improvement:', improvement);
    // TODO: 改善提案を却下するロジックを実装
  };

  // バッチ分析
  const handleBatchAnalyze = async () => {
    console.log('Batch analyze:', Array.from(selectedIds));
    // TODO: バッチ分析ロジックを実装
  };

  // バッチ適用
  const handleBatchApply = async (type: 'all' | 'high-confidence') => {
    console.log('Batch apply:', type, Array.from(selectedIds));
    // デモ用の結果
    setBatchResults([
      { sku: 'SKU-001', success: true, scoreBefore: 65, scoreAfter: 82 },
      { sku: 'SKU-002', success: true, scoreBefore: 45, scoreAfter: 71 },
      { sku: 'SKU-003', success: false, message: 'API エラー' },
    ]);
  };

  const stats = {
    total: products.length,
    analyzed: products.filter((p) => p.ai_health_score).length,
    critical: products.filter((p) => (p.ai_health_score?.overallScore || 0) < 40).length,
    needsImprovement: products.filter(
      (p) => (p.ai_health_score?.overallScore || 0) >= 40 && (p.ai_health_score?.overallScore || 0) < 70
    ).length,
    good: products.filter(
      (p) => (p.ai_health_score?.overallScore || 0) >= 70 && (p.ai_health_score?.overallScore || 0) < 90
    ).length,
    excellent: products.filter((p) => (p.ai_health_score?.overallScore || 0) >= 90).length,
    avgScore:
      products.length > 0
        ? Math.round(
            products.reduce((sum, p) => sum + (p.ai_health_score?.overallScore || 0), 0) / products.length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            AI出品最適化
          </h1>
          <p className="text-muted-foreground mt-1">
            ヘルススコア分析 | AI改善提案 | SEO最適化 | 一括適用
          </p>
        </div>
        <Button onClick={loadProducts} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          更新
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">総商品数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.analyzed}</div>
            <p className="text-xs text-muted-foreground">分析済み</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">緊急 (&lt;40)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.needsImprovement}</div>
            <p className="text-xs text-muted-foreground">要改善 (40-69)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.good}</div>
            <p className="text-xs text-muted-foreground">良好 (70-89)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.excellent}</div>
            <p className="text-xs text-muted-foreground">優秀 (90+)</p>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ: 2カラムレイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左: 商品リスト */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>商品リスト ({filteredProducts.length})</span>
                {selectedIds.size > 0 && (
                  <Badge variant="secondary">{selectedIds.size}件選択中</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 検索 */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="SKU・タイトルで検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* フィルター */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={scoreFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setScoreFilter('all')}
                >
                  全て
                </Button>
                <Button
                  size="sm"
                  variant={scoreFilter === 'critical' ? 'default' : 'outline'}
                  onClick={() => setScoreFilter('critical')}
                >
                  緊急
                </Button>
                <Button
                  size="sm"
                  variant={scoreFilter === 'needs-improvement' ? 'default' : 'outline'}
                  onClick={() => setScoreFilter('needs-improvement')}
                >
                  要改善
                </Button>
                <Button
                  size="sm"
                  variant={scoreFilter === 'good' ? 'default' : 'outline'}
                  onClick={() => setScoreFilter('good')}
                >
                  良好
                </Button>
              </div>

              {/* ソート */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={sortBy === 'score-asc' ? 'default' : 'outline'}
                  onClick={() => setSortBy('score-asc')}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  スコア昇順
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'score-desc' ? 'default' : 'outline'}
                  onClick={() => setSortBy('score-desc')}
                >
                  <TrendingDown className="h-4 w-4 mr-1" />
                  スコア降順
                </Button>
              </div>

              {/* 商品一覧 */}
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredProducts.map((product) => {
                    const score = product.ai_health_score?.overallScore || 0;
                    const isSelected = selectedProduct?.id === product.id;
                    const isChecked = selectedIds.has(product.id);

                    return (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition ${
                          isSelected ? 'ring-2 ring-purple-600 bg-purple-50 dark:bg-purple-950/20' : 'hover:bg-accent'
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleProductSelection(product.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="flex items-start gap-3 flex-1"
                              onClick={() => setSelectedProduct(product)}
                            >
                              {product.primary_image_url && (
                                <img
                                  src={product.primary_image_url}
                                  alt={product.title || product.sku}
                                  className="w-16 h-16 object-cover rounded border"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {product.title_en || product.title || product.sku}
                                </p>
                                <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {score > 0 ? (
                                    <>
                                      <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                                        {score}
                                      </span>
                                      {getScoreBadge(score)}
                                    </>
                                  ) : (
                                    <Badge variant="outline">未分析</Badge>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 右: タブ付きパネル */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="health" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">ヘルススコア</span>
              </TabsTrigger>
              <TabsTrigger value="improvements" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI改善提案</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">SEO最適化</span>
              </TabsTrigger>
              <TabsTrigger value="batch" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">一括適用</span>
              </TabsTrigger>
            </TabsList>

            {/* タブ1: ヘルススコア */}
            <TabsContent value="health">
              {selectedProduct ? (
                <AIImprovementPanel
                  productId={selectedProduct.id}
                  productTitle={selectedProduct.title_en || selectedProduct.title}
                  primaryImage={selectedProduct.primary_image_url}
                  onApplyImprovement={handleApplyImprovement}
                />
              ) : (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold">商品を選択してください</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      左のリストから商品を選択すると、AI改善提案が表示されます
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* タブ2: AI改善提案 */}
            <TabsContent value="improvements">
              <AIImprovementsTab
                productId={selectedProduct?.id}
                onApply={handleApplyImprovement}
                onReject={handleRejectImprovement}
              />
            </TabsContent>

            {/* タブ3: SEO最適化 */}
            <TabsContent value="seo">
              <SEOOptimizerTab
                productId={selectedProduct?.id}
                currentData={{
                  title: selectedProduct?.title_en || selectedProduct?.title || '',
                  keywords: selectedProduct?.keywords || [],
                  description: selectedProduct?.description || '',
                }}
                suggestions={seoSuggestions}
                healthScore={selectedProduct?.ai_health_score?.overallScore || 0}
                loading={seoLoading}
                onAnalyze={handleSEOAnalyze}
                onApply={handleSEOApply}
              />
            </TabsContent>

            {/* タブ4: 一括適用 */}
            <TabsContent value="batch">
              <BatchApplyTab
                selectedProducts={products.filter(p => selectedIds.has(p.id))}
                onBatchAnalyze={handleBatchAnalyze}
                onBatchApply={handleBatchApply}
                results={batchResults}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
