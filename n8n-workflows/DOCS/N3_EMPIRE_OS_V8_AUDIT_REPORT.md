# 🔬 N3 Empire OS V8.2.1 完全監査レポート

## 自律コマース・ロジックの監査結果と統合提案

**監査日**: 2026年1月24日  
**監査対象**: 84+ n8nワークフロー（PRODUCTION/V8_UNSINKABLE）  
**基準**: 「人間は承認のみ」完全自律型コマースOS

---

## 📊 エグゼクティブサマリー

### 現状評価: **72/100点**（良好だが重要な欠落あり）

| カテゴリ | 現状スコア | 理想スコア | ギャップ |
|---------|-----------|-----------|---------|
| インテリジェント・スコアリング | 65 | 100 | ⚠️ -35 |
| SM戦略モデル最適解選択 | 45 | 100 | 🚨 -55 |
| 動的フィルタリング | 70 | 100 | ⚠️ -30 |
| 高度な加工・最適化 | 80 | 100 | ✅ -20 |
| リソース最適化（枠管理） | 30 | 100 | 🚨 -70 |
| 多販路・同期整合性 | 75 | 100 | ⚠️ -25 |

---

## 🚨 重大な欠陥リスト

### 1. 【CRITICAL】戦略モデル（SM）自律選択の欠落

**現状**: 目利きエージェント（V7）でスコアリングは実装済みだが、**複数の戦略から最適解を自律判断するロジックが存在しない**

```javascript
// 現状のスコアリング（【リサーチ】01_14-リサーチ-目利きエージェント_V7.json）
const verdict = score >= 70 ? 'immediate' : score >= 50 ? 'high' : score >= 30 ? 'medium' : 'low';
// ❌ 問題: 単一の閾値による判定のみ。市場状況・在庫状況による戦略切替なし
```

**欠落しているロジック**:
- 在庫回転率に基づく「薄利多売」vs「高利益追求」の動的切替
- 季節性・トレンド変動による価格戦略の自動調整
- 競合状況（出品数/売れ行き比率）による参入可否判断

**修正提案**:
```javascript
// === V8.2.1 SM自律選択ロジック ===
function selectOptimalStrategy(item, context) {
  const strategies = {
    aggressive_margin: { targetMargin: 0.30, minTurnover: 5, maxCompetitors: 50 },
    balanced: { targetMargin: 0.20, minTurnover: 10, maxCompetitors: 100 },
    volume_rotation: { targetMargin: 0.12, minTurnover: 30, maxCompetitors: 200 },
    defensive: { targetMargin: 0.35, minTurnover: 2, maxCompetitors: 20 }
  };

  // 市場状況スコアリング
  const competitionRatio = item.active_listings / Math.max(item.sold_last_30d, 1);
  const seasonalMultiplier = getSeasonalMultiplier(item.category_id, new Date());
  const inventoryPressure = context.current_inventory / context.target_inventory;

  // 戦略選択マトリックス
  if (competitionRatio < 2 && item.trend_score > 70) return { ...strategies.aggressive_margin, reason: '低競合・高トレンド' };
  if (inventoryPressure > 1.5) return { ...strategies.volume_rotation, reason: '在庫圧力解消' };
  if (seasonalMultiplier > 1.2) return { ...strategies.aggressive_margin, reason: '季節需要' };
  if (competitionRatio > 10) return { ...strategies.defensive, reason: '過競争市場' };
  
  return { ...strategies.balanced, reason: 'デフォルト' };
}
```

---

### 2. 【CRITICAL】出品枠最適化エンジンの完全欠落

**現状**: 出品スコアリングディスパッチャーはスコア順で出品を実行するが、**アカウント別の出品上限・カテゴリ枠を考慮していない**

```javascript
// 現状（【司令塔】01_11-出品管理-スコアリングディスパッチャー_V5.json）
const immediate = products.filter(p => p.tier === 'immediate');
return immediate.slice(0, 20).map(p => ({ json: p }));
// ❌ 問題: アカウントの出品残枠、カテゴリ枠上限を無視
```

**欠落しているロジック**:
- eBayアカウント別の月間出品上限（MJT: 5000枠、GREEN: 2000枠など）
- カテゴリ別の出品枠制限（Video Games: 1000枠など）
- 利益最大化のための枠割り当て最適化（ナップサック問題の近似解法）

**修正提案**:
```javascript
// === V8.2.1 枠最適化エンジン ===
async function optimizeSlotAllocation(products, accounts) {
  // 各アカウントの残枠を取得
  const accountSlots = await Promise.all(accounts.map(async (acc) => {
    const [used, limit] = await getAccountListingStatus(acc.id);
    return { 
      account_id: acc.id, 
      remaining: limit - used,
      category_limits: await getCategoryLimits(acc.id)
    };
  }));

  // 商品を利益期待値でソート
  const sortedProducts = products.map(p => ({
    ...p,
    expected_profit: p.profit_margin * p.estimated_sell_rate * p.price_usd
  })).sort((a, b) => b.expected_profit - a.expected_profit);

  // 貪欲法による枠割り当て
  const assignments = [];
  for (const product of sortedProducts) {
    const eligibleAccounts = accountSlots.filter(acc => 
      acc.remaining > 0 &&
      (acc.category_limits[product.category_id]?.remaining ?? Infinity) > 0
    );

    if (eligibleAccounts.length === 0) continue;

    // 最も枠に余裕のあるアカウントに割り当て
    const bestAccount = eligibleAccounts.reduce((a, b) => 
      a.remaining > b.remaining ? a : b
    );

    assignments.push({ product, account: bestAccount.account_id });
    bestAccount.remaining--;
    if (bestAccount.category_limits[product.category_id]) {
      bestAccount.category_limits[product.category_id].remaining--;
    }
  }

  return assignments;
}
```

---

### 3. 【HIGH】再帰的データ補完フローの欠落

**現状**: AI補完DDP計算は単一パスで処理し、**不足データを検知しても自動再取得しない**

```javascript
// 現状（【価格計算】01_04-価格計算-AI補完DDP計算_V5.json）
if (!htsCode) { htsCode = '9504.40.00'; htsSource = 'default'; confidence = 50; }
// ❌ 問題: 信頼度50%のまま処理続行。外部API照会による補完なし
```

**欠落しているロジック**:
- HTS/重量/原産国の信頼度が閾値以下の場合のeBay Browse API自動照会
- 競合商品からのItem Specifics自動抽出
- 失敗時の代替ソース（Amazon、他モールのカタログ）への自動フォールバック

**修正提案**:
```javascript
// === V8.2.1 再帰的データ補完 ===
async function enrichWithFallback(product, depth = 0) {
  const MAX_DEPTH = 3;
  const CONFIDENCE_THRESHOLD = 75;

  if (depth >= MAX_DEPTH) {
    return { ...product, _enrichment_warning: '最大再帰深度到達' };
  }

  let enriched = await primaryEnrichment(product);

  // 信頼度チェック
  if (enriched.confidence_score < CONFIDENCE_THRESHOLD) {
    const sources = [
      { name: 'eBay Browse API', fn: enrichFromEbayBrowse },
      { name: 'Amazon Catalog', fn: enrichFromAmazonCatalog },
      { name: 'Competitor Listings', fn: enrichFromCompetitors }
    ];

    for (const source of sources) {
      try {
        const supplemental = await source.fn(product);
        enriched = mergeEnrichments(enriched, supplemental);
        
        if (enriched.confidence_score >= CONFIDENCE_THRESHOLD) {
          enriched._enrichment_source = source.name;
          break;
        }
      } catch (e) {
        console.warn(`${source.name} failed: ${e.message}`);
      }
    }
  }

  // まだ不十分なら再帰
  if (enriched.confidence_score < CONFIDENCE_THRESHOLD && depth < MAX_DEPTH - 1) {
    return enrichWithFallback(enriched, depth + 1);
  }

  return enriched;
}
```

---

### 4. 【HIGH】多販路価格整合性エンジンの不完全性

**現状**: GlobalStockKillerは在庫同期のみで、**販路別の手数料・送料・為替を考慮した価格同期がない**

```javascript
// 現状（【在庫】01_07-在庫同期-GlobalStockKiller_V5.json）
const newQuantity = Math.max(0, previousQuantity + quantityChange);
// ❌ 問題: 数量のみ同期。価格は販路間で乖離したまま
```

**欠落しているロジック**:
- eBay → Amazon → Qoo10 間の価格整合性計算
- 為替変動時の全販路自動価格調整
- 販路別禁止商品ルールの動的適用

**修正提案**:
```javascript
// === V8.2.1 多販路価格整合性エンジン ===
function calculateCrossMarketplacePrices(baseProduct, targetMarketplaces) {
  const MARKETPLACE_CONFIG = {
    'ebay_us': { fvf: 0.1295, payment: 0.029, shipping_min: 15, currency: 'USD', rate: 1 },
    'amazon_us': { fvf: 0.15, fba: 4.50, referral_min: 1, currency: 'USD', rate: 1 },
    'qoo10_jp': { fvf: 0.10, payment: 0.034, shipping_min: 800, currency: 'JPY', rate: 150 },
    'shopee_sg': { fvf: 0.06, payment: 0.02, shipping_min: 5, currency: 'SGD', rate: 0.74 }
  };

  const baseCostJPY = baseProduct.purchase_price;
  const targetMarginMin = 0.10;

  return targetMarketplaces.map(mp => {
    const config = MARKETPLACE_CONFIG[mp];
    const costLocal = baseCostJPY / config.rate;
    
    // 逆算: 売価 = (原価 + 固定費) / (1 - 変動費率 - 利益率)
    const fixedCosts = (config.fba || 0) + config.shipping_min;
    const variableRate = config.fvf + config.payment;
    const minPrice = (costLocal + fixedCosts) / (1 - variableRate - targetMarginMin);
    
    // 競合価格との整合性チェック
    const competitorPrice = baseProduct.competitor_prices?.[mp];
    const recommendedPrice = competitorPrice 
      ? Math.max(minPrice, competitorPrice * 0.95) // 競合の5%下限
      : minPrice * 1.15; // デフォルトは最低価格の15%上

    return {
      marketplace: mp,
      currency: config.currency,
      min_price: Math.ceil(minPrice),
      recommended_price: Math.ceil(recommendedPrice),
      expected_margin: ((recommendedPrice - costLocal - fixedCosts) / recommendedPrice - variableRate) * 100
    };
  });
}
```

---

### 5. 【MEDIUM】V8 Auth-Gate/Policy-Validatorの不完全な統合

**現状**: V8テンプレートは完成しているが、**既存の84ワークフローの大半がV6アーキテクチャのまま**

```javascript
// V6（多くの既存WF）
const crypto = require('crypto');
const computedHmac = crypto.createHmac('sha256', secret).update(timestamp + '.' + bodyString).digest('hex');
// ⚠️ 問題: Auth-Gateは実装済みだが、Identity-Manager・Policy-Validatorが欠落

// V8テンプレート（00_V8_GOLDEN_TEMPLATE.json）では完全実装済み
// Auth-Gate → Identity-Manager → MAIN-LOGIC → Policy-Validator → HitL → Audit-Log
```

**欠落しているノード**:
- `Identity-Manager`: プロキシ・指紋・認証情報の動的供給（V6では手動設定）
- `Policy-Validator`: リスク検知の自動判定（V6では閾値ハードコード）
- `HitL承認キュー`: 高リスク操作の承認待ち機構（V6では通知のみ）

---

### 6. 【MEDIUM】赤字絶対回避ロジックの穴

**現状**: DDP価格計算では利益率チェックがあるが、**為替急変・関税率変更時の動的再計算がない**

```javascript
// 現状（【価格計算】01_04）
if (profit < 0) { workflowStatus = 'review'; isRedFlag = true; errorReason = '赤字:$' + profit.toFixed(2); }
// ⚠️ 問題: 出品後の為替変動による赤字転落を防げない
```

**修正提案**: 為替変動トリガーによる全商品再計算ワークフローの追加

---

## 📋 V8.2.1への統合アドバイス

### 共通パーツとして追加すべきノード（152ツール量産時）

#### 1. `SM戦略セレクター` （新規共通ノード）
```javascript
// 全ての出品系WFに挿入
{
  "name": "🎯 SM戦略セレクター",
  "type": "n8n-nodes-base.code",
  "jsCode": `
    const strategies = {
      aggressive: { margin: 0.30, turnover: 5 },
      balanced: { margin: 0.20, turnover: 15 },
      volume: { margin: 0.12, turnover: 30 }
    };
    
    const market = await getMarketConditions($json.category_id);
    const inventory = await getInventoryPressure($json.user_id);
    
    const selected = selectStrategy(market, inventory, strategies);
    return [{ json: { ...$json, _strategy: selected } }];
  `
}
```

#### 2. `枠オプティマイザー` （新規共通ノード）
```javascript
{
  "name": "📊 枠オプティマイザー",
  "type": "n8n-nodes-base.code",
  "jsCode": `
    const slots = await getAccountSlots($json._tenant_id);
    const optimized = knapsackAllocate($json.products, slots);
    return optimized.map(o => ({ json: o }));
  `
}
```

#### 3. `再帰エンリッチャー` （新規共通ノード）
```javascript
{
  "name": "🔄 再帰エンリッチャー",
  "type": "n8n-nodes-base.code",
  "jsCode": `
    const THRESHOLD = 75;
    let data = $json;
    let depth = 0;
    
    while (data.confidence < THRESHOLD && depth < 3) {
      const sources = ['eBay', 'Amazon', 'Catalog'];
      for (const src of sources) {
        try {
          const enriched = await enrichFrom(src, data);
          if (enriched.confidence >= THRESHOLD) {
            return [{ json: { ...enriched, _source: src } }];
          }
          data = enriched;
        } catch (e) { }
      }
      depth++;
    }
    return [{ json: { ...data, _warning: 'low_confidence' } }];
  `
}
```

#### 4. `多販路価格シンクロナイザー` （新規共通ノード）
```javascript
{
  "name": "🔗 多販路価格シンクロナイザー",
  "type": "n8n-nodes-base.code",
  "jsCode": `
    const marketplaces = ['ebay_us', 'amazon_us', 'qoo10_jp'];
    const prices = calculateCrossMarketplacePrices($json.base_product, marketplaces);
    
    // 整合性チェック
    const inconsistent = prices.filter(p => p.expected_margin < 5);
    if (inconsistent.length > 0) {
      return [{ json: { _error: true, _reason: 'margin_below_threshold', details: inconsistent } }];
    }
    
    return [{ json: { ...$json, _marketplace_prices: prices } }];
  `
}
```

---

## 🔧 修正用コードスニペット

### n8n Sub-Workflow: SM自律選択

```json
{
  "name": "【共通】SM自律戦略セレクター_V8.2.1",
  "nodes": [
    {
      "name": "📥 入力受信",
      "type": "n8n-nodes-base.executeWorkflowTrigger",
      "parameters": {}
    },
    {
      "name": "📊 市場データ取得",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT category_id, AVG(sold_count_30d) as avg_sold, COUNT(*) as listing_count, AVG(price_usd) as avg_price FROM marketplace_analytics WHERE category_id = $1 AND captured_at > NOW() - INTERVAL '7 days' GROUP BY category_id",
        "options": { "queryParams": "={{ [$json.category_id] }}" }
      }
    },
    {
      "name": "🎯 戦略選択ロジック",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const market = $node['📊 市場データ取得'].json;\nconst product = $node['📥 入力受信'].json;\n\nconst competitionRatio = market.listing_count / Math.max(market.avg_sold, 1);\nconst pricePosition = product.target_price / market.avg_price;\n\nlet strategy, reason;\n\nif (competitionRatio < 3 && product.trend_score > 70) {\n  strategy = { name: 'aggressive', targetMargin: 0.30, maxCompetitors: 50 };\n  reason = '低競合高トレンド：攻撃的価格設定';\n} else if (competitionRatio > 10) {\n  strategy = { name: 'defensive', targetMargin: 0.35, maxCompetitors: 20 };\n  reason = '過競争市場：高マージン防御';\n} else if (pricePosition < 0.8) {\n  strategy = { name: 'volume', targetMargin: 0.12, maxCompetitors: 200 };\n  reason = '価格優位：回転率重視';\n} else {\n  strategy = { name: 'balanced', targetMargin: 0.20, maxCompetitors: 100 };\n  reason = 'バランス戦略';\n}\n\nreturn [{ json: { ...product, _strategy: strategy, _strategy_reason: reason } }];"
      }
    },
    {
      "name": "📤 結果返却",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "mode": "raw",
        "jsonOutput": "={{ $json }}"
      }
    }
  ],
  "connections": {
    "📥 入力受信": { "main": [[{ "node": "📊 市場データ取得" }]] },
    "📊 市場データ取得": { "main": [[{ "node": "🎯 戦略選択ロジック" }]] },
    "🎯 戦略選択ロジック": { "main": [[{ "node": "📤 結果返却" }]] }
  }
}
```

### n8n Sub-Workflow: 枠最適化エンジン

```json
{
  "name": "【共通】出品枠オプティマイザー_V8.2.1",
  "nodes": [
    {
      "name": "📥 商品リスト受信",
      "type": "n8n-nodes-base.executeWorkflowTrigger"
    },
    {
      "name": "📊 アカウント枠状況取得",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT a.account_id, a.monthly_listing_limit, COALESCE(COUNT(l.id), 0) as used_count, a.monthly_listing_limit - COALESCE(COUNT(l.id), 0) as remaining FROM ebay_accounts a LEFT JOIN marketplace_listings l ON l.account_id = a.account_id AND l.created_at > DATE_TRUNC('month', NOW()) AND l.status != 'ended' WHERE a.user_id = $1 AND a.status = 'active' GROUP BY a.account_id, a.monthly_listing_limit",
        "options": { "queryParams": "={{ [$json.user_id] }}" }
      }
    },
    {
      "name": "🧮 ナップサック割り当て",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const products = $node['📥 商品リスト受信'].json.products || [];\nconst accounts = Array.isArray($node['📊 アカウント枠状況取得'].json) ? $node['📊 アカウント枠状況取得'].json : [$node['📊 アカウント枠状況取得'].json];\n\n// 利益期待値でソート\nconst sorted = products.map(p => ({\n  ...p,\n  expected_value: (p.profit_margin || 0.1) * (p.sell_probability || 0.5) * (p.price_usd || 50)\n})).sort((a, b) => b.expected_value - a.expected_value);\n\nconst assignments = [];\nconst accountSlots = accounts.map(a => ({ ...a, remaining: parseInt(a.remaining) || 0 }));\n\nfor (const product of sorted) {\n  const available = accountSlots.filter(a => a.remaining > 0);\n  if (available.length === 0) break;\n  \n  // 最も余裕のあるアカウントに割り当て\n  const best = available.reduce((a, b) => a.remaining > b.remaining ? a : b);\n  assignments.push({ product_id: product.id, account_id: best.account_id, expected_value: product.expected_value });\n  best.remaining--;\n}\n\nreturn [{ json: { assignments, unassigned: sorted.length - assignments.length, total_expected_value: assignments.reduce((s, a) => s + a.expected_value, 0) } }];"
      }
    }
  ],
  "connections": {
    "📥 商品リスト受信": { "main": [[{ "node": "📊 アカウント枠状況取得" }]] },
    "📊 アカウント枠状況取得": { "main": [[{ "node": "🧮 ナップサック割り当て" }]] }
  }
}
```

---

## 📈 優先度別ロードマップ

### Phase 1: 即時対応（1-2週間）
1. ✅ 全84WFをV8テンプレートベースに統一
2. ✅ SM戦略セレクター共通ノードの作成・挿入
3. ✅ 赤字絶対回避の為替変動トリガー追加

### Phase 2: 短期対応（2-4週間）
4. 🔧 出品枠オプティマイザーの実装・テスト
5. 🔧 再帰的データ補完フローの全面導入
6. 🔧 多販路価格シンクロナイザーの開発

### Phase 3: 中期対応（1-2ヶ月）
7. 📊 AIスコアリングエンジンの精度向上
8. 📊 季節性・トレンド予測モデルの統合
9. 📊 リアルタイム競合モニタリングの強化

---

## 🎯 結論

現在のN3 Empire OSは**堅牢な基盤**を持っているが、「完全自律型」を名乗るには**戦略的意思決定レイヤー**が不足している。

特に以下の3点が最優先：
1. **SM自律戦略セレクター**: 「出品すべきか」だけでなく「どの戦略で」を自律判断
2. **出品枠オプティマイザー**: 有限リソースの最大効率活用
3. **再帰的データ補完**: 不完全なデータを自動で完全化

これらを統合することで、真の「人間は承認のみ」システムが完成する。
