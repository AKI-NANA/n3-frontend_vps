// app/(external)/stocktake/page.tsx
/**
 * 外注用棚卸しツール（高速化版 + ページネーション）
 */

'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Plus, Package, RefreshCw, Search, Camera, Grid, List, Lock, Key, Upload, ExternalLink, ChevronLeft, ChevronRight, Filter, FileSpreadsheet } from 'lucide-react';
import { useStocktake, type StocktakeProduct, STORAGE_LOCATIONS } from './hooks';
import { StocktakeCard, NewProductModal, EditProductModal, StocktakeList, ProductDetailModal, BulkUploadModal } from './components';
import { createClient } from '@/lib/supabase/client';

const STOCKTAKE_PASSWORD = process.env.NEXT_PUBLIC_STOCKTAKE_PASSWORD || 'plus1stock';

// ページサイズオプション
const PAGE_SIZE_OPTIONS = [60, 120, 240];
const DEFAULT_PAGE_SIZE = 120;

export default function StocktakePage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const { 
    products, 
    loading, 
    loadingMore,
    error, 
    stats, 
    hasMore,
    totalCount,
    loadProducts, 
    loadMore,
    search,
    createProduct, 
    updateQuantity, 
    updateLocation, 
    addImage, 
    uploadImage, 
    updateProduct 
  } = useStocktake();

  const [showNewModal, setShowNewModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [syncingSpreadsheet, setSyncingSpreadsheet] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StocktakeProduct | null>(null);
  const [detailProduct, setDetailProduct] = useState<StocktakeProduct | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'stocktake'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // ページネーション
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthenticated(true);
      } else {
        setAuthenticated(localStorage.getItem('stocktake_auth') === 'true');
      }
    };
    checkAuth();
  }, []);

  // パスワード認証
  const handlePasswordSubmit = () => {
    if (password === STOCKTAKE_PASSWORD) {
      localStorage.setItem('stocktake_auth', 'true');
      setAuthenticated(true);
    } else {
      setAuthError('パスワードが違います');
    }
  };

  // 検索（デバウンス）
  useEffect(() => {
    const timer = setTimeout(() => {
      search(localSearchQuery);
      setCurrentPage(1); // 検索時は1ページ目に戻る
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearchQuery, search]);

  // フィルタリング（クライアント側）
  const filteredProducts = useMemo(() => {
    let result = products;
    
    // 登録分フィルター
    if (filterMode === 'stocktake') {
      result = result.filter(p => p.isStocktakeRegistered);
    }
    
    // 保管場所フィルター
    if (locationFilter !== 'all') {
      result = result.filter(p => p.storage_location === locationFilter);
    }
    
    return result;
  }, [products, filterMode, locationFilter]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // ページ変更
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // フィルター変更時にページリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [filterMode, locationFilter]);

  const canFullEdit = (p: StocktakeProduct) => p.isStocktakeRegistered;

  // スプレッドシート同期
  const handleSyncSpreadsheet = async () => {
    setSyncingSpreadsheet(true);
    try {
      const res = await fetch('/api/sync/stocktake-spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`スプレッドシートに${data.syncedCount}件同期しました！\n\n${data.spreadsheetUrl}`);
        window.open(data.spreadsheetUrl, '_blank');
      } else {
        alert(`同期エラー: ${data.error}`);
      }
    } catch (err: any) {
      alert(`エラー: ${err.message}`);
    } finally {
      setSyncingSpreadsheet(false);
    }
  };

  // ローディング画面
  if (authenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <RefreshCw size={24} className="animate-spin" />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}`}</style>
      </div>
    );
  }

  // ログイン画面
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 32, maxWidth: 320, width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Package size={28} style={{ color: '#22c55e' }} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>棚卸しツール</h1>
          </div>
          
          {authError && (
            <div style={{ padding: 10, marginBottom: 16, borderRadius: 8, background: '#fef2f2', color: '#dc2626', fontSize: 13, textAlign: 'center' }}>
              {authError}
            </div>
          )}
          
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Key size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()} 
              placeholder="パスワード" 
              style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, boxSizing: 'border-box' }} 
            />
          </div>
          
          <button 
            onClick={handlePasswordSubmit} 
            style={{ width: '100%', padding: 14, borderRadius: 8, border: 'none', background: '#22c55e', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            <Lock size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            ログイン
          </button>
        </div>
      </div>
    );
  }

  // メイン画面
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom: '1px solid #e5e7eb', padding: '6px 10px' }}>
        {/* 1行目: タイトル + 統計 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Package size={16} style={{ color: '#22c55e' }} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>棚卸し</span>
          <span style={{ padding: '1px 5px', borderRadius: 8, background: '#dcfce7', color: '#16a34a', fontSize: 9, fontWeight: 600 }}>Plus1</span>
          
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
            <span><strong>{filteredProducts.length}</strong>/{totalCount}件</span>
            <span style={{ color: '#22c55e' }}><strong>{stats.totalQuantity}</strong>個</span>
          </div>
          
          {/* 表示切替 */}
          <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '4px 6px', border: 'none', background: viewMode === 'grid' ? '#3b82f6' : 'white', color: viewMode === 'grid' ? 'white' : '#6b7280', cursor: 'pointer' }}>
              <Grid size={12} />
            </button>
            <button onClick={() => setViewMode('list')} style={{ padding: '4px 6px', border: 'none', background: viewMode === 'list' ? '#3b82f6' : 'white', color: viewMode === 'list' ? 'white' : '#6b7280', cursor: 'pointer' }}>
              <List size={12} />
            </button>
          </div>
          
          <button onClick={() => loadProducts(true)} disabled={loading} style={{ width: 26, height: 26, borderRadius: 4, border: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="再読み込み">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
          
          {/* スプレッドシートを開く */}
          <a 
            href="https://docs.google.com/spreadsheets/d/1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM/edit" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ width: 26, height: 26, borderRadius: 4, border: '1px solid #22c55e', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#16a34a', textDecoration: 'none' }} 
            title="スプレッドシートを開く"
          >
            <FileSpreadsheet size={12} />
          </a>
          
          {/* スプレッドシートに同期 */}
          <button onClick={handleSyncSpreadsheet} disabled={syncingSpreadsheet} style={{ width: 26, height: 26, borderRadius: 4, border: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: syncingSpreadsheet ? '#9ca3af' : '#3b82f6' }} title="スプレッドシートに同期（データ書き込み）">
            <Upload size={12} className={syncingSpreadsheet ? 'animate-spin' : ''} />
          </button>
          
          <a href="/tools/editing-n3" target="_blank" rel="noopener noreferrer" style={{ width: 26, height: 26, borderRadius: 4, border: '1px solid #e5e7eb', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', textDecoration: 'none' }} title="管理ツール">
            <ExternalLink size={12} />
          </a>
        </div>
        
        {/* 2行目: フィルター + 検索 */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* タイプフィルター */}
          <button onClick={() => setFilterMode('all')} style={{ padding: '3px 8px', borderRadius: 4, border: 'none', background: filterMode === 'all' ? '#3b82f6' : '#e5e7eb', color: filterMode === 'all' ? 'white' : '#6b7280', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
            全商品
          </button>
          <button onClick={() => setFilterMode('stocktake')} style={{ padding: '3px 8px', borderRadius: 4, border: 'none', background: filterMode === 'stocktake' ? '#22c55e' : '#e5e7eb', color: filterMode === 'stocktake' ? 'white' : '#6b7280', fontSize: 10, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Camera size={10} />登録分
          </button>
          
          {/* 保管場所フィルター */}
          <select 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{ padding: '3px 6px', borderRadius: 4, border: '1px solid #e5e7eb', fontSize: 10, background: 'white', cursor: 'pointer' }}
          >
            <option value="all">全場所</option>
            {STORAGE_LOCATIONS.map(loc => (
              <option key={loc.value} value={loc.value}>{loc.label}</option>
            ))}
          </select>
          
          {/* ページサイズ */}
          <select 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            style={{ padding: '3px 6px', borderRadius: 4, border: '1px solid #e5e7eb', fontSize: 10, background: 'white', cursor: 'pointer' }}
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}件</option>
            ))}
          </select>
          
          {/* 検索 */}
          <div style={{ position: 'relative', flex: 1, minWidth: 120 }}>
            <Search size={12} style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
              type="text" 
              value={localSearchQuery} 
              onChange={e => setLocalSearchQuery(e.target.value)} 
              placeholder="検索..." 
              style={{ width: '100%', padding: '4px 6px 4px 24px', borderRadius: 4, border: '1px solid #e5e7eb', fontSize: 11, boxSizing: 'border-box' }} 
            />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main ref={scrollContainerRef} style={{ flex: 1, padding: 6, overflowY: 'auto' }}>
        {loading && products.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
            <RefreshCw size={24} className="animate-spin" />
            <p style={{ marginTop: 8, fontSize: 12 }}>読み込み中...</p>
          </div>
        ) : error ? (
          <div style={{ padding: 16, textAlign: 'center', background: '#fef2f2', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
            エラー: {error}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
            <Package size={36} style={{ opacity: 0.5 }} />
            <p style={{ marginTop: 8, fontSize: 12 }}>商品がありません</p>
          </div>
        ) : viewMode === 'list' ? (
          <StocktakeList 
            products={paginatedProducts} 
            canEdit={() => true} 
            onQuantityChange={updateQuantity} 
            onLocationChange={updateLocation} 
            onEdit={setEditingProduct} 
            onDetail={setDetailProduct} 
          />
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', // 最小110px、自動調整
            gap: 6,
            maxWidth: '100%',
          }}>
            {paginatedProducts.map(p => (
              <StocktakeCard 
                key={p.id} 
                product={p} 
                canEdit={true} 
                canFullEdit={canFullEdit(p)} 
                onQuantityChange={updateQuantity} 
                onEdit={canFullEdit(p) ? setEditingProduct : undefined} 
                onTap={setDetailProduct} 
              />
            ))}
          </div>
        )}
      </main>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div style={{ 
          position: 'sticky', 
          bottom: 0, 
          background: 'white', 
          borderTop: '1px solid #e5e7eb', 
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
          {/* 前へボタン */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ 
              padding: '6px 14px', 
              borderRadius: 6, 
              border: '1px solid #e5e7eb', 
              background: currentPage === 1 ? '#f3f4f6' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontWeight: 500,
              color: currentPage === 1 ? '#9ca3af' : '#374151',
            }}
          >
            <ChevronLeft size={18} />
            前へ
          </button>
          
          {/* ページ選択ドロップダウン */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #e5e7eb',
                background: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: 70,
                textAlign: 'center',
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span style={{ fontSize: 14, color: '#374151' }}>
              / {totalPages} ページ
            </span>
          </div>
          
          {/* 次へボタン */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ 
              padding: '6px 14px', 
              borderRadius: 6, 
              border: '1px solid #e5e7eb', 
              background: currentPage === totalPages ? '#f3f4f6' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontWeight: 500,
              color: currentPage === totalPages ? '#9ca3af' : '#374151',
            }}
          >
            次へ
            <ChevronRight size={18} />
          </button>
          
          {/* 件数表示 */}
          <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>
            （全{filteredProducts.length}件）
          </span>
        </div>
      )}

      {/* FAB */}
      <div style={{ position: 'fixed', bottom: totalPages > 1 ? 60 : 18, right: 18, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 50 }}>
        <button onClick={() => setShowBulkModal(true)} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: '#3b82f6', boxShadow: '0 4px 12px rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
          <Upload size={20} />
        </button>
        <button onClick={() => setShowNewModal(true)} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: '#22c55e', boxShadow: '0 4px 12px rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
          <Plus size={22} />
        </button>
      </div>

      {/* モーダル */}
      <NewProductModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} onSubmit={createProduct} onUploadImage={uploadImage} />
      <BulkUploadModal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} onSuccess={() => loadProducts(true)} />
      <EditProductModal isOpen={!!editingProduct} product={editingProduct} onClose={() => setEditingProduct(null)} onSubmit={updateProduct} onAddImage={addImage} onUploadImage={uploadImage} />
      <ProductDetailModal isOpen={!!detailProduct} product={detailProduct} onClose={() => setDetailProduct(null)} onQuantityChange={updateQuantity} onLocationChange={updateLocation} />

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}`}</style>
    </div>
  );
}
