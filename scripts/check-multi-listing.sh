#!/bin/bash

# =====================================================
# 多販路出品システム - 動作確認スクリプト
# =====================================================

echo "🔍 多販路出品システム 動作確認"
echo "================================"

# Phase 0: ファイル確認
echo ""
echo "📁 Phase 0: 共通基盤ファイル確認"
echo "--------------------------------"

files=(
  "lib/marketplace/multi-marketplace-types.ts"
  "lib/marketplace/marketplace-configs.ts"
  "lib/marketplace/unified-pricing-service.ts"
  "lib/marketplace/index.ts"
  "app/api/v2/pricing/multi-marketplace/route.ts"
  "app/api/v2/listing-queue/route.ts"
  "sql/create_listing_queue.sql"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (NOT FOUND)"
  fi
done

# Phase 1: UIファイル確認
echo ""
echo "📁 Phase 1: UIコンポーネント確認"
echo "--------------------------------"

ui_files=(
  "components/ProductModal/components/Tabs/TabMultiListing.tsx"
  "components/ProductModal/FullFeaturedModal.tsx"
  "components/ProductModal/components/TabNavigation.tsx"
)

for file in "${ui_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (NOT FOUND)"
  fi
done

# TabMultiListingがFullFeaturedModalにインポートされているか確認
echo ""
echo "🔗 インポート確認"
echo "--------------------------------"

if grep -q "TabMultiListing" components/ProductModal/FullFeaturedModal.tsx; then
  echo "✅ TabMultiListing が FullFeaturedModal にインポートされています"
else
  echo "❌ TabMultiListing が FullFeaturedModal にインポートされていません"
fi

if grep -q "multi-listing" components/ProductModal/components/TabNavigation.tsx; then
  echo "✅ multi-listing タブが TabNavigation に追加されています"
else
  echo "❌ multi-listing タブが TabNavigation に追加されていません"
fi

echo ""
echo "================================"
echo "📋 次のステップ:"
echo "1. Supabase で sql/create_listing_queue.sql を実行"
echo "2. npm run dev でローカルサーバーを起動"
echo "3. 商品モーダルで「Multi-List」タブを確認"
echo "================================"
