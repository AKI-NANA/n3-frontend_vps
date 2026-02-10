// app/tools/stocktake/page.tsx
/**
 * 外注用棚卸しツール
 * 
 * 機能:
 * - plus1保管場所の商品一覧表示
 * - 新規商品登録（画像、数、タイトル、色、サイズ）
 * - 商品情報の編集
 * - 在庫数の調整
 * 
 * データは inventory_master と連携
 */

'use client';

import React, { useState } from 'react';
import { Plus, Package, RefreshCw, Search } from 'lucide-react';
import { useStocktake, type StocktakeProduct } from './hooks';
import { StocktakeCard, NewProductModal, EditProductModal } from './components';

export default function StocktakePage() {
  const {
    products,
    loading,
    error,
    saving,
    stats,
    loadProducts,
    createProduct,
    updateProduct,
    updateQuantity,
    uploadImage,
  } = useStocktake();

  const [showNewModal, setShowNewModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StocktakeProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 検索フィルター
  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.product_name?.toLowerCase().includes(query) ||
      p.sku?.toLowerCase().includes(query) ||
      p.color?.toLowerCase().includes(query) ||
      p.size?.toLowerCase().includes(query)
    );
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f3f4f6',
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={24} style={{ color: '#22c55e' }} />
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
              棚卸し
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#dcfce7',
                color: '#16a34a',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Plus1
            </span>
          </div>
          
          <button
            onClick={() => loadProducts()}
            disabled={loading}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* 統計バー */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '8px',
            marginBottom: '12px',
          }}
        >
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
              {stats.totalCount}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>商品数</div>
          </div>
          <div style={{ width: '1px', background: '#e5e7eb' }} />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>
              {stats.totalQuantity}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>総在庫</div>
          </div>
          <div style={{ width: '1px', background: '#e5e7eb' }} />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6' }}>
              {stats.todayCount}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>本日登録</div>
          </div>
        </div>

        {/* 検索バー */}
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="商品名・SKUで検索..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={{ padding: '16px' }}>
        {loading && products.length === 0 ? (
          <div
            style={{
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            <div>読み込み中...</div>
          </div>
        ) : error ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              background: '#fef2f2',
              borderRadius: '8px',
              color: '#dc2626',
            }}
          >
            エラー: {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ marginBottom: '8px' }}>
              {searchQuery ? '検索結果がありません' : '商品がありません'}
            </div>
            <div style={{ fontSize: '13px' }}>
              下の「+」ボタンで新規登録できます
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
            }}
          >
            {filteredProducts.map((product) => (
              <StocktakeCard
                key={product.id}
                product={product}
                onQuantityChange={updateQuantity}
                onEdit={setEditingProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* 新規登録ボタン（FAB） */}
      <button
        onClick={() => setShowNewModal(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: '#22c55e',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          zIndex: 50,
        }}
      >
        <Plus size={28} />
      </button>

      {/* 新規登録モーダル */}
      <NewProductModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSubmit={createProduct}
        onUploadImage={uploadImage}
      />

      {/* 編集モーダル */}
      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={updateProduct}
        onUploadImage={uploadImage}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
