#!/bin/bash

echo "🧹 Vercel用にファイルをクリーンアップ中..."

# ============================================
# 未完成のAPIルート（完全削除）
# ============================================

# スケジューラー・バッチ処理系
rm -rf app/api/scheduler
rm -rf app/api/cron
rm -rf app/api/batch-research

# 財務・ERP系
rm -rf app/api/finance
rm -rf app/api/erp

# 管理・認証系
rm -rf app/api/admin/credentials
rm -rf app/api/admin/generate-hs-keywords
rm -rf app/api/auth/tokens

# B2B・パートナーシップ系
rm -rf app/api/b2b

# メッセージング・自動応答系
rm -rf app/api/messaging
rm -rf app/api/tools/auto-responder

# AI・最適化系
rm -rf app/api/ai
rm -rf app/api/seo-optimize
rm -rf app/api/seo-manager

# リサーチ・分析系（一部）
rm -rf app/api/research/wholesaler-finder
rm -rf app/api/origin-country
rm -rf app/api/research  # research全体を削除
rm -rf app/api/dropship  # dropship全体を削除
rm -rf app/api/score     # score全体を削除
rm -rf app/api/offers    # offers全体を削除
rm -rf app/api/arbitrage # arbitrage全体を削除
rm -rf app/api/webhooks  # webhooks全体を削除
rm -rf app/api/dashboard # dashboard全体を削除

# 同期・統合系（一部）
rm -rf app/api/sync/apply-resolution
rm -rf app/api/sync/ebay-to-queue
rm -rf app/api/sync/mercari-to-inventory  # mercari-to-inventoryも削除
rm -rf app/api/sync/local-capacity        # local-capacityも削除

# VPS・インフラ系
rm -rf app/api/vps
rm -rf app/api/wisdom-core

# その他未完成API
rm -rf app/api/profit-calculator

# ============================================
# 開発中のツールページ
# ============================================

rm -rf app/tools/karitori-dashboard
rm -rf app/tools/fulfillment-board
rm -rf app/tools/design-catalog
rm -rf app/tools/simple-ebay-manager
rm -rf app/tools/ebay-profit-calculator
rm -rf app/tools/product-research
rm -rf app/tools/price-optimizer
rm -rf app/tools/sync-master-hub
rm -rf app/tools/ai-governance-hub
rm -rf app/tools/message-hub
rm -rf app/tools/scheduler-monitor
rm -rf app/tools/inventory-dashboard

# ============================================
# レガシーライブラリ・サービス
# ============================================

# バッチ処理系
rm -rf lib/batch-processor
rm -rf lib/utils/batch-processor.ts
rm -rf lib/utils/parallel-processor.ts
rm -rf lib/utils/concurrency-control.ts

# SEO・健康スコア系
rm -rf lib/seo-health-manager

# 自動オファー系（レガシー）
rm -rf lib/services/auto-offer
rm -rf lib/services/offers/AutoOfferService.ts

# その他未完成サービス
rm -rf lib/services/arbitrage
rm -rf lib/services/hts
rm -rf lib/research
rm -rf lib/email
rm -rf lib/external
rm -rf lib/finance
rm -rf lib/erp
rm -rf lib/scoring
rm -rf lib/dropship  # dropshipも削除

# ============================================
# サービスディレクトリ（未完成）
# ============================================

rm -rf services/cron
rm -rf services/messaging
rm -rf services/auth
rm -rf services/RepeatOrderManager.ts
rm -rf services/mall

echo "✅ クリーンアップ完了"
echo ""
echo "📊 削除したファイル:"
echo "  - API routes: cron, finance, b2b, erp, ai, messaging, etc."
echo "  - Tool pages: design-catalog, karitori-dashboard, etc."
echo "  - Services: cron, messaging, auth"
echo "  - Libraries: batch-processor, seo-health-manager, etc."
