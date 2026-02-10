# 🎯 Research N3実装 - 実際に使えるツール統合ガイド

## 📋 現状分析

### ✅ 完了している部分
- 11個のL3フィルタータブUI
- 動的ツールパネル切り替え
- モックデータ表示

### ❌ 不足している部分
**実際に使える機能がない** - 表示だけで実行できない

---

## 🔧 実装すべき実際の機能

### 1. Amazon Research（amazon-researchから）

**実装する機能**:
```typescript
// 商品検索
const handleAmazonSearch = async (keywords: string) => {
  const response = await fetch('/api/amazon/search', {
    method: 'POST',
    body: JSON.stringify({ keywords, filters })
  });
};

// 統計更新
const loadStats = async () => {
  const response = await fetch('/api/amazon/stats');
  setStats(response.data);
};
```

**必要なコンポーネント**:
- 検索バー（Input + Button）
- フィルターパネル（価格、評価、Prime）
- 統計カード（4枚: 登録数、平均スコア、高利益、在庫）
- 商品カードグリッド

### 2. Batch Research（batch-researchから）

**実装する機能**:
```typescript
// バッチジョブ作成
const createBatchJob = async (jobConfig) => {
  const response = await fetch('/api/batch-research/jobs', {
    method: 'POST',
    body: JSON.stringify({
      job_name, description, target_seller_ids,
      date_start, date_end, split_unit
    })
  });
};

// ジョブ一覧取得
const fetchJobs = async () => {
  const response = await fetch('/api/batch-research/jobs?limit=10');
  setJobs(response.data.jobs);
};

// ジョブ詳細表示
router.push(`/tools/batch-research/${jobId}`);
```

**必要なコンポーネント**:
- ジョブ作成フォーム
- ジョブ一覧テーブル（status、progress、created_at）
- 推定タスク数計算
- 進捗バー

### 3. Product Sourcing（product-sourcingから）

**実装する機能**:
```typescript
// 仕入先登録
const addSupplier = async (name, url, isRepeat) => {
  await addDoc(collection(db, 'supplier_contacts'), {
    companyName: name,
    websiteUrl: url,
    isRepeatCandidate: isRepeat
  });
};

// メール生成（Gemini API）
const generateEmail = async (productId, supplierId) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    body: JSON.stringify({ prompt: emailTemplate })
  });
};
```

**必要なコンポーネント**:
- 仕入先管理テーブル
- 商品リスト
- メール生成フォーム
- メールプレビュー

### 4. Rakuten Arbitrage（rakuten-arbitrageから）

**実装する機能**:
```typescript
// 楽天商品検索
const searchRakuten = async (keywords: string) => {
  // 楽天APIで商品検索
};

// BSRチェック
const checkBSR = async (asin: string) => {
  // AmazonでBSR確認
};

// 利益計算
const calculateProfit = (rakutenPrice, amazonPrice) => {
  const amazonFee = amazonPrice * 0.15;
  const profit = amazonPrice - rakutenPrice - amazonFee;
  return { profit, margin: (profit / amazonPrice) * 100 };
};
```

**必要なコンポーネント**:
- 検索バー
- 商品比較テーブル
- 利益計算結果表示

### 5. BUYMA Simulator（buyma-simulatorから）

**実装する機能**:
```typescript
// 利益シミュレーション
const simulateProfit = (sourcePrice, sellingPrice) => {
  const commission = sellingPrice * BUYMA_COMMISSION_RATE;
  const profit = sellingPrice - sourcePrice - commission;
  return { profit, margin: (profit / sellingPrice) * 100 };
};

// ドラフト作成
const createDraft = async (product) => {
  await addDoc(collection(db, 'buyma_drafts'), {
    ...product,
    status: 'draft',
    createdAt: serverTimestamp()
  });
};
```

**必要なコンポーネント**:
- シミュレーター入力フォーム
- 計算結果表示
- ドラフト一覧テーブル

---

## 🚀 実装手順

### Step 1: 各ツールパネルの機能実装

#### AmazonResearchToolPanel.tsx
```typescript
export function AmazonResearchToolPanel({
  stats, loading, selectedCount, onRefresh
}: AmazonResearchToolPanelProps) {
  const [keywords, setKeywords] = useState('');
  const [filters, setFilters] = useState({
    minPrice: undefined,
    maxPrice: undefined,
    primeOnly: false
  });

  const handleSearch = async () => {
    const response = await fetch('/api/amazon/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords, ...filters })
    });
    
    if (response.ok) {
      onRefresh(); // 親コンポーネントのデータ更新
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* 統計カード */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard label="登録商品数" value={stats.total} />
        <StatsCard label="平均スコア" value={stats.avgScore} />
        <StatsCard label="高利益商品" value={stats.highProfit} />
        <StatsCard label="在庫あり" value={stats.inStock} />
      </div>

      {/* 検索バー */}
      <div className="flex gap-2">
        <Input
          placeholder="キーワードまたはASINを入力..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          検索
        </Button>
      </div>

      {/* フィルター */}
      <SearchFilters filters={filters} onChange={setFilters} />
    </div>
  );
}
```

#### BatchResearchToolPanel.tsx
```typescript
export function BatchResearchToolPanel({
  stats, loading, selectedCount, onRefresh
}: BatchResearchToolPanelProps) {
  const [jobs, setJobs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchJobs = async () => {
    const response = await fetch('/api/batch-research/jobs?limit=10');
    const data = await response.json();
    setJobs(data.jobs);
  };

  const createJob = async (jobConfig) => {
    const response = await fetch('/api/batch-research/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobConfig)
    });
    
    if (response.ok) {
      fetchJobs();
      setShowCreateForm(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* 統計 */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard label="総ジョブ数" value={stats.totalJobs} />
        <StatsCard label="実行中" value={stats.running} />
        <StatsCard label="完了" value={stats.completed} />
        <StatsCard label="保留中" value={stats.pending} />
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2">
        <Button onClick={() => setShowCreateForm(true)}>
          新規ジョブ作成
        </Button>
        <Button variant="outline" onClick={fetchJobs}>
          更新
        </Button>
      </div>

      {/* ジョブ一覧 */}
      <JobsTable jobs={jobs} onViewDetails={(id) => router.push(`/tools/batch-research/${id}`)} />

      {/* 作成フォームモーダル */}
      {showCreateForm && (
        <CreateJobModal
          onSubmit={createJob}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}
```

### Step 2: モーダル・フォームコンポーネント作成

**CreateJobModal.tsx**:
```typescript
export function CreateJobModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    job_name: '',
    description: '',
    target_seller_ids: '',
    date_start: '',
    date_end: '',
    split_unit: 'week'
  });

  const [estimatedTasks, setEstimatedTasks] = useState(0);

  // 推定タスク数計算
  useEffect(() => {
    if (formData.target_seller_ids && formData.date_start && formData.date_end) {
      const sellerCount = formData.target_seller_ids.split(',').length;
      const daysDiff = calculateDaysDiff(formData.date_start, formData.date_end);
      const ranges = formData.split_unit === 'day' ? daysDiff : Math.ceil(daysDiff / 7);
      setEstimatedTasks(sellerCount * ranges);
    }
  }, [formData]);

  return (
    <Modal onClose={onClose}>
      <h3>新規バッチジョブ作成</h3>
      
      <Input
        label="ジョブ名"
        value={formData.job_name}
        onChange={(e) => setFormData({...formData, job_name: e.target.value})}
      />
      
      <Textarea
        label="説明"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      
      {/* セラーID、日付範囲など */}
      
      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p>推定タスク数: <strong>{estimatedTasks}</strong></p>
        <p>推定完了時間: <strong>{formatTime(estimatedTasks * 7)}</strong></p>
      </div>

      <Button onClick={() => onSubmit(formData)}>作成</Button>
    </Modal>
  );
}
```

### Step 3: API Routes実装

**app/api/amazon/search/route.ts**:
```typescript
export async function POST(req: Request) {
  const { keywords, minPrice, maxPrice, primeOnly } = await req.json();
  
  // Amazon PA API呼び出し
  const products = await searchAmazon(keywords, { minPrice, maxPrice, primeOnly });
  
  // Supabaseに保存
  await supabase
    .from('amazon_research_products')
    .insert(products.map(p => ({
      asin: p.asin,
      title: p.title,
      price: p.price,
      rating: p.rating,
      bsr: p.bsr,
      profit_score: calculateProfitScore(p)
    })));
  
  return Response.json({ success: true, products });
}
```

---

## 📝 次のセッション実装優先順位

### Priority 1: Amazon Research（最重要）
- ✅ UIは完成済み
- ⏳ 検索機能実装
- ⏳ API routes作成
- ⏳ Supabase統合

### Priority 2: Batch Research
- ✅ UIは完成済み
- ⏳ ジョブ管理機能実装
- ⏳ API routes作成

### Priority 3: Product Sourcing
- ⏳ 仕入先管理実装
- ⏳ メール生成機能

### Priority 4: Rakuten/BUYMA
- ⏳ 基本機能実装

---

**作成日**: 2025-12-14  
**ステータス**: 実装ガイド完成  
**次回タスク**: Amazon Research機能実装
