#!/bin/bash
# build-test-all.sh
# 3つの環境でビルドテストを実行し、結果を表示

echo ""
echo "============================================"
echo "  N3 ビルドテスト（3環境）"
echo "============================================"
echo ""

DEV_DIR=~/n3-frontend_new
VERCEL_DIR=~/n3-frontend_vercel
VPS_DIR=~/n3-frontend_vps

DEV_OK=false
VERCEL_OK=false
VPS_OK=false

# 開発環境テスト
echo "🔵 [1/3] 開発環境をテスト中..."
cd "$DEV_DIR"
if npm run build > /dev/null 2>&1; then
    echo "✅ 開発環境: 成功"
    DEV_OK=true
else
    echo "❌ 開発環境: 失敗"
fi
echo ""

# Vercel環境テスト
echo "☁️  [2/3] Vercel環境をテスト中..."
if [ -d "$VERCEL_DIR" ]; then
    cd "$VERCEL_DIR"
    if npm run build > /dev/null 2>&1; then
        echo "✅ Vercel環境: 成功"
        VERCEL_OK=true
    else
        echo "❌ Vercel環境: 失敗"
    fi
else
    echo "⚠️  Vercel環境: ディレクトリなし"
fi
echo ""

# VPS環境テスト
echo "🖥️  [3/3] VPS環境をテスト中..."
if [ -d "$VPS_DIR" ]; then
    cd "$VPS_DIR"
    if npm run build > /dev/null 2>&1; then
        echo "✅ VPS環境: 成功"
        VPS_OK=true
    else
        echo "❌ VPS環境: 失敗"
    fi
else
    echo "⚠️  VPS環境: ディレクトリなし"
fi
echo ""

# 結果サマリー
echo "============================================"
echo "  📊 ビルドテスト結果"
echo "============================================"
echo ""
echo "  開発環境:   $([ "$DEV_OK" = true ] && echo "✅ OK" || echo "❌ NG")"
echo "  Vercel環境: $([ "$VERCEL_OK" = true ] && echo "✅ OK" || echo "❌ NG")"
echo "  VPS環境:    $([ "$VPS_OK" = true ] && echo "✅ OK" || echo "❌ NG")"
echo ""

if [ "$DEV_OK" = true ] && [ "$VERCEL_OK" = true ] && [ "$VPS_OK" = true ]; then
    echo "============================================"
    echo "  🎉 全環境ビルド成功！"
    echo "  → Git Push しても大丈夫です！"
    echo "============================================"
    exit 0
else
    echo "============================================"
    echo "  ⚠️  ビルド失敗があります"
    echo "  → 問題を修正してから再度テストしてください"
    echo ""
    echo "  詳細を確認するには:"
    if [ "$DEV_OK" = false ]; then
        echo "    cd ~/n3-frontend_new && npm run build"
    fi
    if [ "$VERCEL_OK" = false ]; then
        echo "    cd ~/n3-frontend_vercel && npm run build"
    fi
    if [ "$VPS_OK" = false ]; then
        echo "    cd ~/n3-frontend_vps && npm run build"
    fi
    echo "============================================"
    exit 1
fi
