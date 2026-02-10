/**
 * KaritoriTable: 刈り取り監視テーブル
 * karitori-dashboardからの移行版（Firebase→Supabase）
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, Loader2, AlertCircle, CheckCircle2, XCircle, RefreshCw, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResearchItem, KaritoriCategory } from '../types/research';
import { ProfitBadge, PriceDisplay } from './shared/profit-display';

interface KaritoriTableProps {
  alerts: ResearchItem[];
  categories: KaritoriCategory[];
  loading: boolean;
  processing: string | null;
  onLoadAlerts: (minProfitRate?: number, maxBsr?: number) => Promise<void>;
  onLoadCategories: () => Promise<void>;
  onAddCategory: (data: { category_name: string; search_keyword: string; manufacturer?: string }) => Promise<KaritoriCategory | null>;
  onDeleteCategory: (id: string) => Promise<boolean>;
  onPurchaseDecision: (item: ResearchItem, forceSkip?: boolean) => Promise<{ status: string; reason: string } | null>;
  onStartWatching: (item: ResearchItem, targetPrice?: number) => Promise<ResearchItem | null>;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

// 判定基準
const MIN_PROFIT_RATE = 20; // 20%
const MAX_BSR_FOR_AUTO = 5000; // 5000位以下

export function KaritoriTable({
  alerts,
  categories,
  loading,
  processing,
  onLoadAlerts,
  onLoadCategories,
  onAddCategory,
  onDeleteCategory,
  onPurchaseDecision,
  onStartWatching,
  showToast,
}: KaritoriTableProps) {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    category_name: '',
    search_keyword: '',
    manufacturer: '',
  });
  const [filterCriteria, setFilterCriteria] = useState({
    minProfitRate: MIN_PROFIT_RATE,
    maxBsr: MAX_BSR_FOR_AUTO,
  });

  // 初回ロード
  useEffect(() => {
    onLoadAlerts(filterCriteria.minProfitRate, filterCriteria.maxBsr);
    onLoadCategories();
  }, []);

  // カテゴリ追加
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.category_name || !categoryForm.search_keyword) {
      showToast('カテゴリ名と検索キーワードは必須です', 'error');
      return;
    }

    const result = await onAddCategory(categoryForm);
    if (result) {
      setCategoryForm({ category_name: '', search_keyword: '', manufacturer: '' });
      setShowCategoryForm(false);
      showToast('カテゴリを追加しました');
    }
  };

  // ステータスバッジ
  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'auto-bought':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3" />
            自動購入
          </span>
        );
      case 'manual-skipped':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            見送り
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3" />
            判定待ち
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* フィルター設定 */}
      <div className="n3-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-text-muted" />
            <span className="text-xs font-medium">自動購入判定基準</span>
          </div>
          <button
            onClick={() => onLoadAlerts(filterCriteria.minProfitRate, filterCriteria.maxBsr)}
            className="n3-btn n3-btn-secondary n3-btn-xs"
            disabled={loading}
          >
            <RefreshCw className={cn('w-3 h-3 mr-1', loading && 'animate-spin')} />
            更新
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>利益率:</span>
            <input
              type="number"
              value={filterCriteria.minProfitRate}
              onChange={(e) => setFilterCriteria(prev => ({ ...prev, minProfitRate: Number(e.target.value) }))}
              className="n3-input n3-input-xs w-16"
            />
            <span>% 超</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>BSR順位:</span>
            <input
              type="number"
              value={filterCriteria.maxBsr}
              onChange={(e) => setFilterCriteria(prev => ({ ...prev, maxBsr: Number(e.target.value) }))}
              className="n3-input n3-input-xs w-20"
            />
            <span>位 以下</span>
          </div>
          <div className="ml-4 px-3 py-1.5 bg-blue-50 rounded text-blue-900 text-[10px]">
            両方の条件を満たす場合のみ自動購入実行（AND条件）
          </div>
        </div>
      </div>

      {/* カテゴリ管理 */}
      <div className="n3-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold">廃盤・希少性高騰カテゴリ管理</h3>
            <p className="text-[10px] text-text-muted">追跡したいジャンル・メーカーを登録</p>
          </div>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="n3-btn n3-btn-primary n3-btn-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            カテゴリ追加
          </button>
        </div>

        {/* カテゴリ追加フォーム */}
        {showCategoryForm && (
          <form onSubmit={handleAddCategory} className="mb-4 p-3 bg-highlight rounded">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label className="text-[10px] text-text-muted">カテゴリ名 *</label>
                <input
                  type="text"
                  placeholder="例: Lego 限定版"
                  value={categoryForm.category_name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, category_name: e.target.value }))}
                  className="n3-input n3-input-xs w-full"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-text-muted">検索キーワード *</label>
                <input
                  type="text"
                  placeholder="例: LEGO exclusive"
                  value={categoryForm.search_keyword}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, search_keyword: e.target.value }))}
                  className="n3-input n3-input-xs w-full"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-text-muted">メーカー</label>
                <input
                  type="text"
                  placeholder="例: LEGO"
                  value={categoryForm.manufacturer}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, manufacturer: e.target.value }))}
                  className="n3-input n3-input-xs w-full"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="n3-btn n3-btn-primary n3-btn-xs"
                disabled={processing === 'add-category'}
              >
                {processing === 'add-category' ? (
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                ) : (
                  <Plus className="w-3 h-3 mr-1" />
                )}
                登録
              </button>
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="n3-btn n3-btn-ghost n3-btn-xs"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}

        {/* カテゴリ一覧 */}
        <div className="n3-table-container">
          <table className="n3-table">
            <thead>
              <tr>
                <th>カテゴリ名</th>
                <th>検索キーワード</th>
                <th>メーカー</th>
                <th className="text-right">高騰実績</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-text-muted py-4">
                    登録されたカテゴリがありません
                  </td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id}>
                    <td className="font-medium">{category.category_name}</td>
                    <td>{category.search_keyword}</td>
                    <td>{category.manufacturer || '-'}</td>
                    <td className="text-right">
                      <span className="font-mono">{category.high_profits_count}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => onDeleteCategory(category.id)}
                        className="p-1 hover:bg-red-50 rounded text-red-500"
                        disabled={processing === `delete-${category.id}`}
                      >
                        {processing === `delete-${category.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* アラート一覧 */}
      <div className="n3-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold">刈り取りアラート一覧</h3>
            <p className="text-[10px] text-text-muted">
              利益率{filterCriteria.minProfitRate}%超 AND BSR {filterCriteria.maxBsr.toLocaleString()}位以下の条件で自動購入を判定
            </p>
          </div>
          <span className="text-[10px] text-text-muted">
            {alerts.length}件
          </span>
        </div>

        <div className="n3-table-container">
          <table className="n3-table">
            <thead>
              <tr>
                <th>ASIN</th>
                <th className="min-w-[200px]">商品名</th>
                <th className="text-right">価格</th>
                <th className="text-right">利益率</th>
                <th className="text-right">BSR順位</th>
                <th>ステータス</th>
                <th>判定理由</th>
                <th className="w-28">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-text-muted" />
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-text-muted py-8">
                    アラートがありません
                  </td>
                </tr>
              ) : (
                alerts.map(alert => (
                  <tr key={alert.id}>
                    <td className="font-mono text-[10px]">{alert.asin || '-'}</td>
                    <td className="max-w-[200px] truncate" title={alert.title}>
                      {alert.title}
                    </td>
                    <td className="text-right">
                      <PriceDisplay price={alert.current_price_jpy || alert.sold_price_jpy} currency="JPY" size="sm" />
                    </td>
                    <td className="text-right">
                      <span className={cn(
                        'font-semibold',
                        (alert.profit_margin || 0) > 20 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {alert.profit_margin?.toFixed(1) || '-'}%
                      </span>
                    </td>
                    <td className="text-right">
                      <span className={cn(
                        'font-semibold',
                        (alert.bsr_rank || 0) <= 5000 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {alert.bsr_rank?.toLocaleString() || '-'}位
                      </span>
                    </td>
                    <td>{getStatusBadge(alert.purchase_status)}</td>
                    <td className="text-[10px] text-text-muted max-w-[150px] truncate" title={alert.karitori_reason}>
                      {alert.karitori_reason || '-'}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {alert.purchase_status === 'pending' || !alert.purchase_status ? (
                          <>
                            <button
                              onClick={() => onPurchaseDecision(alert)}
                              className="n3-btn n3-btn-primary n3-btn-xs"
                              disabled={processing === `purchase-${alert.id}`}
                            >
                              {processing === `purchase-${alert.id}` ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <ShoppingCart className="w-3 h-3 mr-0.5" />
                                  判定
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => onPurchaseDecision(alert, true)}
                              className="n3-btn n3-btn-ghost n3-btn-xs"
                              disabled={!!processing}
                            >
                              見送り
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-text-muted">判定済み</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
