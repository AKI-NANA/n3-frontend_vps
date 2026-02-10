// app/api/database/migrate-ai-hub/route.ts
// AI統一メッセージハブ用マイグレーションSQLを表示

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // マイグレーションファイルを読み込み
    const migrationsDir = path.join(process.cwd(), 'supabase/migrations')
    const aiProposalsPath = path.join(migrationsDir, '20251123_ai_proposals.sql')
    const aiProposalsSql = fs.readFileSync(aiProposalsPath, 'utf-8')

    // HTMLとしてフォーマットして返す
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>統一AIメッセージハブ - DBマイグレーション</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Monaco', 'Menlo', monospace;
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      background: #1e1e1e;
      color: #d4d4d4;
    }
    h1 {
      color: #4fc3f7;
      border-bottom: 3px solid #4fc3f7;
      padding-bottom: 10px;
      margin-top: 0;
    }
    h2 {
      color: #81c784;
      border-bottom: 2px solid #81c784;
      padding-bottom: 8px;
      margin-top: 30px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      border: none;
      color: white;
      font-size: 2em;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 1.1em;
      opacity: 0.9;
    }
    .instructions {
      background: #2d2d2d;
      border-left: 4px solid #4fc3f7;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .instructions h2 {
      margin-top: 0;
      color: #4fc3f7;
      border: none;
    }
    .instructions ol {
      margin: 10px 0;
      padding-left: 25px;
    }
    .instructions li {
      margin: 10px 0;
      line-height: 1.6;
    }
    .instructions a {
      color: #4fc3f7;
      text-decoration: none;
      font-weight: bold;
    }
    .instructions a:hover {
      text-decoration: underline;
    }
    .feature-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .feature-card {
      background: #2d2d2d;
      border: 2px solid #3d3d3d;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    .feature-card:hover {
      border-color: #4fc3f7;
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(79, 195, 247, 0.3);
    }
    .feature-card h3 {
      margin-top: 0;
      color: #81c784;
      font-size: 1.2em;
    }
    .feature-card ul {
      margin: 10px 0;
      padding-left: 20px;
      color: #9cdcfe;
    }
    .feature-card li {
      margin: 5px 0;
    }
    .sql-container {
      position: relative;
      margin: 30px 0;
    }
    pre {
      background: #2d2d2d;
      border: 1px solid #3d3d3d;
      border-radius: 5px;
      padding: 20px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.6;
      max-height: 600px;
      overflow-y: auto;
    }
    .copy-button {
      position: sticky;
      top: 10px;
      float: right;
      background: #4fc3f7;
      color: #1e1e1e;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      z-index: 10;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .copy-button:hover {
      background: #29b6f6;
    }
    .copy-button:active {
      background: #0288d1;
    }
    .success-message {
      display: none;
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 15px 30px;
      border-radius: 5px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      font-weight: bold;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .info-box {
      background: #d1ecf1;
      border-left: 4px solid #0c5460;
      color: #0c5460;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .info-box strong {
      color: #0a3d47;
    }
    .stats {
      display: flex;
      gap: 30px;
      margin: 30px 0;
      justify-content: center;
    }
    .stat-card {
      background: #2d2d2d;
      border: 2px solid #4fc3f7;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      min-width: 150px;
    }
    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      color: #4fc3f7;
    }
    .stat-label {
      font-size: 0.9em;
      color: #9cdcfe;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤖 統一AIメッセージハブ - データベースマイグレーション</h1>
    <p>全AI機能の提案を一元管理：承認・却下・再実行を実現</p>
  </div>

  <div class="instructions">
    <h2>📋 実行手順</h2>
    <ol>
      <li>下の「SQLをコピー」ボタンをクリック</li>
      <li><a href="https://supabase.com/dashboard" target="_blank">Supabaseダッシュボード</a>を開く</li>
      <li>プロジェクトを選択</li>
      <li>左メニューから「SQL Editor」を選択</li>
      <li>「New Query」をクリック</li>
      <li>コピーしたSQLを貼り付け</li>
      <li>「Run」ボタンをクリックして実行</li>
    </ol>
  </div>

  <div class="info-box">
    <strong>📊 含まれる機能:</strong><br>
    このマイグレーションは、出品提案、画像生成、データエンリッチメント、市場調査など、全AI機能の提案を一つのテーブルで管理します。
    既存の <code>products_master.listing_data</code> と <code>ebay_api_data</code> からデータを移行する関数も含まれています。
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-number">${aiProposalsSql.split('\n').length.toLocaleString()}</div>
      <div class="stat-label">行数</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${(aiProposalsSql.length / 1024).toFixed(1)}</div>
      <div class="stat-label">KB</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">7</div>
      <div class="stat-label">提案タイプ</div>
    </div>
  </div>

  <h2>🎯 主要機能</h2>
  <div class="feature-cards">
    <div class="feature-card">
      <h3>📦 ai_proposals テーブル</h3>
      <ul>
        <li>UUID プライマリキー</li>
        <li>7種類の提案タイプ対応</li>
        <li>JSONB で柔軟なデータ格納</li>
        <li>ステータス管理（pending/approved/rejected/completed/failed）</li>
        <li>AIコスト・処理時間トラッキング</li>
      </ul>
    </div>

    <div class="feature-card">
      <h3>🔄 再実行トラッキング</h3>
      <ul>
        <li>実行ログを JSONB で保存</li>
        <li>親提案IDによる履歴管理</li>
        <li>リトライカウント</li>
        <li>エラーメッセージ保存</li>
      </ul>
    </div>

    <div class="feature-card">
      <h3>📊 ビュー (3種類)</h3>
      <ul>
        <li>v_ai_proposals_dashboard - ダッシュボード集計</li>
        <li>v_ai_proposals_by_product - 商品別履歴</li>
        <li>v_ai_cost_analysis - コスト分析</li>
      </ul>
    </div>

    <div class="feature-card">
      <h3>🔧 ヘルパー関数</h3>
      <ul>
        <li>migrate_listing_data_to_proposals()</li>
        <li>既存データの自動移行</li>
        <li>listing_data → listing_proposal</li>
        <li>ebay_api_data → market_research</li>
      </ul>
    </div>

    <div class="feature-card">
      <h3>🎨 提案タイプ</h3>
      <ul>
        <li>listing_proposal - 出品提案</li>
        <li>image_generation - 画像生成</li>
        <li>data_enrichment - データエンリッチメント</li>
        <li>market_research - 市場調査</li>
        <li>html_generation - HTML生成</li>
        <li>bookkeeping_rule - 帳簿ルール</li>
        <li>seo_optimization - SEO最適化</li>
      </ul>
    </div>

    <div class="feature-card">
      <h3>⚡ パフォーマンス</h3>
      <ul>
        <li>6種類のインデックス</li>
        <li>GIN インデックス（JSONB）</li>
        <li>自動 updated_at トリガー</li>
        <li>RLS セキュリティ有効</li>
      </ul>
    </div>
  </div>

  <h2>📝 SQL内容</h2>
  <div class="sql-container">
    <button class="copy-button" onclick="copySql()">📋 SQLをコピー</button>
    <pre id="sql-content">${escapeHtml(aiProposalsSql)}</pre>
  </div>

  <div class="success-message" id="success-message">
    ✅ SQLをクリップボードにコピーしました！
  </div>

  <h2>🚀 マイグレーション後の作業</h2>
  <div class="info-box">
    <strong>1. 既存データを移行:</strong><br>
    <code>SELECT migrate_listing_data_to_proposals();</code>
    <br><br>
    <strong>2. 外部キー制約を追加（オプション）:</strong><br>
    <code>ALTER TABLE ai_proposals ADD CONSTRAINT fk_ai_proposals_product FOREIGN KEY (product_id) REFERENCES products_master(item_id) ON DELETE CASCADE;</code>
    <br><br>
    <strong>3. UI実装:</strong> /ai-hub/proposals ページを作成
  </div>

  <script>
    function copySql() {
      const sqlContent = document.getElementById('sql-content').textContent;
      navigator.clipboard.writeText(sqlContent).then(() => {
        const message = document.getElementById('success-message');
        message.style.display = 'block';
        setTimeout(() => {
          message.style.display = 'none';
        }, 3000);
      }).catch(err => {
        alert('コピーに失敗しました: ' + err);
      });
    }
  </script>
</body>
</html>
`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'マイグレーションファイルの読み込みに失敗しました',
      },
      { status: 500 }
    )
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
