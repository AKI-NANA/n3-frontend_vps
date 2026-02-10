# Research N3 統合プロジェクト - 完全版修正指示書

**作成日**: 2024-12-14
**更新日**: 2024-12-14（Gemini注意点統合）
**目的**: Design CatalogのResearch N3プレビューを完成させ、統合リサーチツールとして実用化する

---

## ⚠️ Geminiからの5つの重要注意点

### 注意点1: API・データ層の統合と責任分解の徹底

**現状の問題:**
- `research-table`: 直接Supabaseを操作（`researchApi.ts`、クライアント側）
- `research-n3`: Next.js APIルート経由予定（`useResearchIntegrated.ts`）

**対応方針:**
```
✅ 全てのデータアクセスをNext.js APIルート経由に統一
✅ researchApi.tsをサーバーサイドに移動/再構築
✅ research-tableも新APIルート経由に修正
✅ Next.js APIレイヤーで認証チェック
✅ Supabaseクレデンシャルがクライアントに露出しない設計
```

### 注意点2: CSS変数（Theme）定義の統一と適用

**現状の問題:**
- N3コンポーネントは`var(--text-muted)`等のCSS変数を直接使用
- 変数定義の場所と適用範囲が不明確

**対応方針:**
```
✅ 最上位レイアウトでCSS変数を定義
✅ グローバルCSS（globals.css）での定義確認
✅ N3デザインカタログ全体に適用確認
✅ 必要に応じてTailwind設定でカスタムクラス化
```

### 注意点3: 型定義（Types）の最優先統合と厳格化

**現状の問題:**
- 型定義が`research-table/types/research.ts`にある
- 各コンポーネントで型が散在

**対応方針（Phase 0で完了）:**
```
✅ 型定義を /types/research.ts に移動
✅ WorkflowStatus, KaritoriStatus等を集約
✅ 全コンポーネントが共有型を参照
✅ Phase 1着手前に完了必須
```

### 注意点4: L3フィルターのカウント計算負荷の考慮

**現状の問題:**
- クライアント側で全件フィルタリングしてカウント計算
- 数千〜数万件でパフォーマンス問題

**対応方針:**
```
✅ API/DB側で集計（Supabase RPC関数）
✅ カウントは別JSONとして取得
✅ useResearchFiltersはAPIから集計結果を受け取る
✅ 初期はクライアント計算→将来的にAPI集計に移行
```

### 注意点5: コンポーネントの「状態」と「ロジック」の分離徹底

**現状の問題:**
- Presentational層とContainer層の分離が不徹底

**対応方針:**
```
✅ Presentationalコンポーネント: Propsをそのまま描画
✅ ロジック（承認、刈り取り変更等）: Container層に集約
✅ コールバック関数はPropsで渡す
✅ 内部状態（ホバー、モーダル開閉）のみコンポーネント内
```

---

## 📊 現状分析サマリー

### 1. データフロー全体像

```
┌─────────────────────────────────────────────────────────────────┐
│                      リサーチデータ取得                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [eBay]                                                         │
│    ├── batch-research: セラーSoldデータ大量取得                  │
│    └── research-hub: キーワード検索                              │
│                                                                 │
│  [Amazon]                                                       │
│    └── amazon-research: PA-API検索（未設定）                     │
│                                                                 │
│  [Yahoo/楽天/BUYMA]                                              │
│    └── 個別ツール or 手動                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              research_repository テーブル (Supabase)             │
│  source: ebay_sold | ebay_seller | amazon | yahoo | rakuten     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     research-table (4タブ)                       │
│  ┌──────────┬──────────┬──────────┬──────────┐                   │
│  │リサーチ結果│刈り取り監視│仕入先探索 │承認待ち   │                   │
│  └──────────┴──────────┴──────────┴──────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                       承認ワークフロー
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      products_master                            │
│                   (出品可能な商品マスタ)                          │
└─────────────────────────────────────────────────────────────────┘
```

### 2. 既存コンポーネント状態

#### ✅ 完成度が高いもの（research-table）

| コンポーネント | パス | 機能 |
|--------------|------|------|
| `ResearchTable.tsx` | research-table/components/ | 12カラムテーブル、展開行、ソート |
| `KaritoriTable.tsx` | research-table/components/ | 刈り取り監視、自動購入判定 |
| `SupplierTable.tsx` | research-table/components/ | 仕入先探索 |
| `ApprovalTable.tsx` | research-table/components/ | 承認ワークフロー、推奨判定 |
| `StatusLight.tsx` | research-table/components/shared/ | ステータス表示 |
| `ScoreDisplay.tsx` | research-table/components/shared/ | スコア表示+バー |
| `RiskBadge.tsx` | research-table/components/shared/ | リスクバッジ |
| `ProfitDisplay.tsx` | research-table/components/shared/ | 利益率表示 |
| `useResearchData.ts` | research-table/hooks/ | データ取得フック |
| `researchApi.ts` | research-table/lib/ | Supabase API |
| `research.ts` | research-table/types/ | 型定義（非常に整理） |

#### ⚠️ 発展途上（research-n3）

| コンポーネント | パス | 状態 |
|--------------|------|------|
| `ResearchN3PreviewDemo.tsx` | design-catalog/ | UI表示のみ、モックデータ |
| `ResearchToolPanel.tsx` | research-n3/components/L3Tabs/ | 基本機能あり |
| `KaritoriToolPanel.tsx` | research-n3/components/L3Tabs/ | 基本機能あり |
| `SupplierToolPanel.tsx` | research-n3/components/L3Tabs/ | 基本機能あり |
| `ApprovalToolPanel.tsx` | research-n3/components/L3Tabs/ | 基本機能あり |
| `ResearchItemCard.tsx` | research-n3/components/cards/ | 基本表示あり |
| `useResearchIntegrated.ts` | research-n3/hooks/ | React Query統合済み |

#### ❌ 不足しているもの

| 機能 | 必要なコンポーネント |
|------|---------------------|
| リストビュー（テーブル） | N3デザイン版ResearchTable |
| 詳細モーダル | ResearchDetailModal |
| 共有UIパーツ（N3版） | StatusLight, ScoreDisplay等のN3対応 |

---

## 🎯 修正計画

### Phase 0: 前提作業（最優先・Phase 1着手前に完了必須）

#### 0-1. 型定義の統合

```bash
# 1. 型定義ファイルを共有ディレクトリに移動
mv /app/tools/research-table/types/research.ts /types/research.ts

# 2. 全ての参照を更新
# research-table/components/*.tsx
# research-n3/components/*.tsx
# research-n3/hooks/*.ts
```

#### 0-2. CSS変数の定義確認

```css
/* /app/globals.css または N3テーマファイルで定義確認 */
:root {
  --bg: ...;
  --panel: ...;
  --text: ...;
  --text-muted: ...;
  --accent: ...;
  --success: ...;
  --warning: ...;
  --error: ...;
  --info: ...;
  --panel-border: ...;
  --highlight: ...;
}
```

#### 0-3. APIルート構造の設計

```
/app/api/research/
├── route.ts              # GET: 一覧取得, POST: 新規作成
├── stats/route.ts        # GET: 統計取得（カウント集計）
├── bulk-update/route.ts  # POST: 一括更新
└── [id]/
    ├── route.ts          # GET: 詳細, PATCH: 更新, DELETE: 削除
    ├── approve/route.ts  # POST: 承認
    ├── reject/route.ts   # POST: 却下
    └── promote/route.ts  # POST: 昇格
```

---

### Phase 1: 共有UIコンポーネントの移植（優先度: ★★★）

research-tableの`shared/`コンポーネントをN3デザインに対応させて`components/n3/`に追加

#### 1-1. N3StatusLight.tsx（新規作成）

**設計原則（注意点5）:**
- Propsを受け取り描画するのみ
- ロジックなし、状態なし
- 型は共有の `/types/research.ts` から import

```typescript
// /components/n3/N3StatusLight.tsx

'use client';

import type { WorkflowStatus, KaritoriStatus } from '@/types/research'; // 共有型を使用

interface N3StatusLightProps {
  status: WorkflowStatus | KaritoriStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const WORKFLOW_CONFIG: Record<WorkflowStatus, { color: string; label: string }> = {
  new: { color: 'bg-[var(--text-muted)]', label: '新規' },
  analyzing: { color: 'bg-[var(--warning)] animate-pulse', label: '分析中' },
  approved: { color: 'bg-[var(--success)]', label: '承認済' },
  rejected: { color: 'bg-[var(--error)]', label: '却下' },
  promoted: { color: 'bg-[var(--accent)]', label: '昇格済' },
};

const KARITORI_CONFIG: Record<KaritoriStatus, { color: string; label: string }> = {
  none: { color: 'bg-[var(--panel-border)]', label: '-' },
  watching: { color: 'bg-[var(--info)]', label: '監視中' },
  alert: { color: 'bg-[var(--warning)] animate-pulse', label: 'アラート' },
  purchased: { color: 'bg-[var(--success)]', label: '購入済' },
  skipped: { color: 'bg-[var(--error)]', label: 'スキップ' },
};

export function N3StatusLight({ status, size = 'md', showLabel = false }: N3StatusLightProps) {
  const isWorkflow = status in WORKFLOW_CONFIG;
  const config = isWorkflow 
    ? WORKFLOW_CONFIG[status as WorkflowStatus] 
    : KARITORI_CONFIG[status as KaritoriStatus];

  const sizeClass = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className={`rounded-full ${sizeClass} ${config.color}`} title={config.label} />
      {showLabel && (
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{config.label}</span>
      )}
    </div>
  );
}
```

#### 1-2. N3ScoreDisplay.tsx（新規作成）

**設計原則（注意点5）:**
- 純粋なPresentationalコンポーネント
- スコア計算ロジックは持たない（Propsで受け取る）

```typescript
// /components/n3/N3ScoreDisplay.tsx

// 'use client' は不要（状態・副作用なし）

interface N3ScoreDisplayProps {
  score?: number | null;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
}

export function N3ScoreDisplay({ score, maxScore = 100, size = 'md', showBar = false }: N3ScoreDisplayProps) {
  if (score === null || score === undefined) {
    return <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>-</span>;
  }

  const pct = Math.min((score / maxScore) * 100, 100);
  const getColor = () => {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 60) return 'var(--info)';
    if (pct >= 40) return 'var(--warning)';
    return 'var(--error)';
  };

  const fontSize = { sm: 10, md: 12, lg: 14 }[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: 'monospace', fontSize, fontWeight: 600, color: getColor() }}>
        {score.toFixed(1)}
      </span>
      {showBar && (
        <div style={{ width: 48, height: 6, background: 'var(--highlight)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: getColor(), borderRadius: 3 }} />
        </div>
      )}
    </div>
  );
}
```

#### 1-3. N3RiskBadge.tsx（新規作成）

**設計原則（注意点5）:**
- リスク判定ロジックは外部で行う
- このコンポーネントは結果を表示するだけ

```typescript
// /components/n3/N3RiskBadge.tsx

import { AlertTriangle, Shield, AlertCircle } from 'lucide-react';
import type { RiskLevel } from '@/types/research'; // 共有型を使用

interface N3RiskBadgeProps {
  level?: RiskLevel | null;
  section301Risk?: boolean;
  veroRisk?: boolean;
  showDetails?: boolean;
}

const CONFIG: Record<RiskLevel, { bg: string; text: string; Icon: typeof Shield; label: string }> = {
  low: { bg: 'rgba(16,185,129,0.1)', text: 'var(--success)', Icon: Shield, label: 'Low' },
  medium: { bg: 'rgba(245,158,11,0.1)', text: 'var(--warning)', Icon: AlertCircle, label: 'Medium' },
  high: { bg: 'rgba(239,68,68,0.1)', text: 'var(--error)', Icon: AlertTriangle, label: 'High' },
};

export function N3RiskBadge({ level, section301Risk, veroRisk, showDetails }: N3RiskBadgeProps) {
  if (!level) return <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>-</span>;

  const { bg, text, Icon, label } = CONFIG[level];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 500,
        background: bg, color: text,
      }}>
        <Icon size={12} />
        {label}
      </span>
      {showDetails && (section301Risk || veroRisk) && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {section301Risk && (
            <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 2, background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>
              301条
            </span>
          )}
          {veroRisk && (
            <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 2, background: 'rgba(147,51,234,0.1)', color: '#9333ea' }}>
              VeRO
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

#### 1-4. N3ProfitBadge.tsx（新規作成）

```typescript
// /components/n3/N3ProfitBadge.tsx

interface N3ProfitBadgeProps {
  margin?: number | null;
}

export function N3ProfitBadge({ margin }: N3ProfitBadgeProps) {
  if (margin === null || margin === undefined) {
    return <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>-</span>;
  }

  const getStyle = () => {
    if (margin >= 20) return { bg: 'rgba(16,185,129,0.1)', color: 'var(--success)' };
    if (margin >= 10) return { bg: 'rgba(245,158,11,0.1)', color: 'var(--warning)' };
    if (margin >= 0) return { bg: 'rgba(251,146,60,0.1)', color: '#fb923c' };
    return { bg: 'rgba(239,68,68,0.1)', color: 'var(--error)' };
  };

  const style = getStyle();

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 6px', borderRadius: 4,
      fontSize: 10, fontWeight: 600,
      background: style.bg, color: style.color,
    }}>
      {margin >= 0 ? '+' : ''}{margin.toFixed(1)}%
    </span>
  );
}
```

### Phase 2: ResearchItemCardの強化（優先度: ★★★）

現在のResearchItemCardを強化し、research-tableの情報量を持つカードに改善

#### 2-1. 改善点

```
現状のResearchItemCard:
- 画像、タイトル、ステータス、価格、利益率
- 承認/却下ボタン

必要な追加項目:
- スコア表示（バー付き）
- リスクバッジ
- ソース表示（Yahoo/Amazon/楽天/BUYMA）
- 仕入先情報（表示/非表示切替）
- 刈り取りステータス（watching/alertの場合）
- 展開して詳細表示（オプション）
```

#### 2-2. ResearchItemCardV2.tsx（新規作成）

```typescript
// /app/tools/research-n3/components/cards/ResearchItemCardV2.tsx

// 詳細設計:
// - カード上部: 画像 + タイトル + ソースバッジ
// - カード中部: 価格情報（売価/仕入価格/利益率）
// - カード下部: スコア + リスク + ステータス
// - ホバー時: 詳細オーバーレイ（仕入先/HTS/競合数）
// - フッター: アクションボタン（承認/却下/監視開始）

// 設計原則（注意点5）:
// - ロジック（onApprove, onReject等）はContainer層からProps経由で受け取る
// - このコンポーネントは描画に専念
```

### Phase 3: リストビュー（テーブル）の追加（優先度: ★★★）

research-tableのResearchTable.tsxをN3デザインに移植

#### 3-1. N3ResearchTable.tsx（新規作成）

```typescript
// /app/tools/research-n3/components/tables/N3ResearchTable.tsx

// 移植元: /app/tools/research-table/components/ResearchTable.tsx
// 変更点:
// 1. Tailwind CSS → インラインスタイル + CSS変数
// 2. n3-table, n3-checkbox → N3コンポーネント
// 3. 色の定義 → var(--accent), var(--success) 等
// 4. ロジックはProps経由でContainer層から受け取る（注意点5）
```

### Phase 4: ToolPanel強化（優先度: ★★☆）

#### 4-1. 各ToolPanelに必要な機能

| パネル | 現状 | 必要な追加機能 |
|--------|------|---------------|
| ResearchToolPanel | 基本ボタンのみ | 検索実行、AI分析起動、一括操作 |
| KaritoriToolPanel | 基本表示 | カテゴリ管理UI、判定基準設定 |
| SupplierToolPanel | 基本表示 | メール生成、コンタクト状態管理 |
| ApprovalToolPanel | 基本表示 | 推奨フィルター、一括承認/却下 |

### Phase 5: API連携（優先度: ★★☆）

#### 5-1. 必要なAPIエンドポイント

| エンドポイント | 状態 | 用途 |
|---------------|------|------|
| `/api/research` | ⚠️ 要確認 | 一覧取得 |
| `/api/research/[id]` | ⚠️ 要確認 | 詳細/更新/削除 |
| `/api/research/stats` | ⚠️ 要確認 | 統計（カウント集計） |
| `/api/research/bulk-update` | ⚠️ 要確認 | 一括更新 |
| `/api/research/[id]/approve` | ⚠️ 要確認 | 承認 |
| `/api/research/[id]/reject` | ⚠️ 要確認 | 却下 |
| `/api/research/[id]/promote` | ⚠️ 要確認 | 昇格 |

---

## 📋 実装順序チェックリスト

### Week 0: 前提作業（Phase 1着手前に完了必須）

- [ ] **0-1** `/types/research.ts` に型定義を統合
- [ ] **0-2** research-table/components の型参照を更新
- [ ] **0-3** research-n3/components の型参照を更新
- [ ] **0-4** CSS変数の定義場所と適用範囲を確認
- [ ] **0-5** `/api/research/route.ts` の存在確認
- [ ] **0-6** `/api/research/stats/route.ts` の設計（カウント集計用）

### Week 1: 基盤コンポーネント

- [ ] **1-1** N3StatusLight.tsx 作成
- [ ] **1-2** N3ScoreDisplay.tsx 作成
- [ ] **1-3** N3RiskBadge.tsx 作成
- [ ] **1-4** N3ProfitBadge.tsx 作成
- [ ] **1-5** components/n3/index.ts にエクスポート追加
- [ ] **1-6** Design Catalogでプレビュー確認

### Week 2: カード強化

- [ ] **2-1** ResearchItemCardV2.tsx 設計
- [ ] **2-2** ResearchItemCardV2.tsx 実装
- [ ] **2-3** ResearchN3PreviewDemoで使用
- [ ] **2-4** カード/リスト切替動作確認

### Week 3: テーブルビュー

- [ ] **3-1** N3ResearchTable.tsx 移植
- [ ] **3-2** 展開行の実装
- [ ] **3-3** ソート機能の実装
- [ ] **3-4** 選択機能の実装

### Week 4: ToolPanel強化

- [ ] **4-1** ResearchToolPanel 機能追加
- [ ] **4-2** KaritoriToolPanel カテゴリ管理UI
- [ ] **4-3** ApprovalToolPanel 推奨フィルター
- [ ] **4-4** ToolPanel切替動作確認

### Week 5: API統合

- [ ] **5-1** APIエンドポイント存在確認
- [ ] **5-2** 不足APIの実装
- [ ] **5-3** useResearchIntegrated.ts と接続
- [ ] **5-4** 実データでの動作確認

### Week 6: 統合テスト

- [ ] **6-1** Design Catalogプレビュー完成確認
- [ ] **6-2** /tools/research-n3 ページ更新
- [ ] **6-3** research-tableとの機能比較
- [ ] **6-4** 本番デプロイ準備

---

## 🎨 UIデザイン仕様

### カラーパレット（CSS変数）

```css
--bg: 背景色
--panel: パネル背景
--highlight: ハイライト/ホバー
--text: メインテキスト
--text-muted: サブテキスト
--accent: アクセントカラー（青）
--success: 成功（緑）
--warning: 警告（黄/オレンジ）
--error: エラー（赤）
--info: 情報（水色）
--panel-border: ボーダー色
```

### コンポーネントサイズ規約

```
テキスト:
- 9px: 最小ラベル、バッジ内
- 10px: サブテキスト、統計値
- 12px: 通常テキスト
- 13px: カードタイトル
- 14px: セクションタイトル

スペーシング:
- 4px: 最小間隔
- 8px: コンパクト間隔
- 12px: 標準間隔
- 16px: セクション間隔
- 24px: 大きな区切り
```

---

## 📁 ファイル構成（完成後）

```
/types/
└── research.ts                       # 統合型定義（Phase 0で移動）

/app/api/research/
├── route.ts                          # 一覧/作成
├── stats/route.ts                    # 統計（カウント集計）
├── bulk-update/route.ts              # 一括更新
└── [id]/
    ├── route.ts                      # 詳細/更新/削除
    ├── approve/route.ts              # 承認
    ├── reject/route.ts               # 却下
    └── promote/route.ts              # 昇格

/app/tools/research-n3/
├── page.tsx                          # メインページ（Container層）
├── RESEARCH_N3_INTEGRATION_GUIDE.md  # この指示書
├── components/
│   ├── L3Tabs/
│   │   ├── index.ts
│   │   ├── ResearchToolPanel.tsx     # 強化
│   │   ├── KaritoriToolPanel.tsx     # 強化
│   │   ├── SupplierToolPanel.tsx
│   │   ├── ApprovalToolPanel.tsx     # 強化
│   │   ├── AmazonResearchToolPanel.tsx
│   │   ├── RakutenResearchToolPanel.tsx
│   │   └── BuymaResearchToolPanel.tsx
│   ├── cards/
│   │   ├── index.ts
│   │   ├── ResearchItemCard.tsx      # 既存
│   │   └── ResearchItemCardV2.tsx    # 新規（強化版）
│   ├── tables/
│   │   ├── index.ts
│   │   └── N3ResearchTable.tsx       # 新規
│   └── layouts/
│       └── ResearchN3PageLayout.tsx
├── hooks/
│   ├── index.ts
│   └── useResearchIntegrated.ts      # 既存
└── types/
    └── (削除 → /types/research.ts に統合)

/components/n3/
├── index.ts                          # エクスポート追加
├── N3StatusLight.tsx                 # 新規
├── N3ScoreDisplay.tsx                # 新規
├── N3RiskBadge.tsx                   # 新規
└── N3ProfitBadge.tsx                 # 新規

/app/tools/design-catalog/categories/layout/
└── ResearchN3PreviewDemo.tsx         # 更新
```

---

## ⚠️ 重要な注意事項（Gemini指摘統合版）

### 1. 型定義の統合（注意点3）

**最優先対応:**
- `research-table/types/research.ts` を `/types/research.ts` に移動
- 全コンポーネントで共有型を import
- Phase 1着手前に完了必須

### 2. APIとの整合性（注意点1）

**統一方針:**
- 全データアクセスをNext.js APIルート経由に統一
- `researchApi.ts` のロジックを `/api/research/route.ts` に移植
- クライアントコードはAPIルートを呼ぶだけ
- Supabase Service Role Keyはサーバーサイドのみ

```typescript
// ❌ クライアントから直接Supabase（現在のresearch-table）
import { supabase } from '@/lib/supabase/client';
const { data } = await supabase.from('research_repository').select();

// ✅ APIルート経由（目標の姿）
const response = await fetch('/api/research');
const { data } = await response.json();
```

### 3. カウント計算のパフォーマンス（注意点4）

**段階的対応:**
```
Phase 1-4: クライアント側計算（items.filter().length）
Phase 5以降: API側集計（Supabase RPC）に移行
```

**API側集計の実装例:**
```typescript
// /api/research/stats/route.ts
export async function GET() {
  const { data } = await supabase.rpc('get_research_counts');
  // returns: { total: 1234, new: 100, analyzing: 50, ... }
  return NextResponse.json(data);
}
```

### 4. Container/Presentational分離（注意点5）

**アーキテクチャ:**
```
ResearchN3Page.tsx (Container)
├── useResearchIntegrated() でデータ取得
├── ハンドラー関数を定義（handleApprove, handleReject等）
└── Presentationalコンポーネントにprops渡し
    ├── N3ResearchTable (表示のみ)
    ├── ResearchItemCardV2 (表示のみ)
    └── ToolPanel (表示のみ)
```

**コンポーネント設計:**
```typescript
// ❌ コンポーネント内でロジック
function ResearchItemCard({ item }) {
  const handleApprove = async () => {
    await fetch(`/api/research/${item.id}/approve`, { method: 'POST' });
  };
  return <button onClick={handleApprove}>承認</button>;
}

// ✅ ロジックはContainer層、コンポーネントはコールバック受け取り
function ResearchItemCard({ item, onApprove }) {
  return <button onClick={() => onApprove(item.id)}>承認</button>;
}
```

### 5. 既存ツールとの関係

- `research-table`: API統一後も残す（完成度が高い、N3化も検討）
- `research-hub`: 将来的に統合またはリダイレクト
- `batch-research`: 独立機能として維持

### 6. テスト順序

1. Phase 0完了確認（型統合、API存在確認）
2. Design Catalogでプレビュー完成
3. /tools/research-n3で実データ接続
4. research-tableとの機能比較
5. 本番デプロイ

---

## 📝 次のアクション（Gemini指摘反映版）

**Phase 0（最優先・Phase 1着手前）:**

1. **型定義の統合**
   - `/types/research.ts` を作成
   - `research-table/types/research.ts` の内容を移動
   - 全参照を更新

2. **CSS変数の確認**
   - `/app/globals.css` でN3変数の定義確認
   - 不足があれば追加

3. **APIルートの確認/作成**
   - `/api/research/route.ts` の存在確認
   - 不足なら `researchApi.ts` からロジック移植

**Phase 1以降:**

4. Phase 1の共有UIコンポーネント作成
5. Design Catalogのプレビューに組み込み
6. 視覚的に確認

**確認が必要なこと:**

1. `/api/research/*` APIの存在確認 → Phase 0で対応
2. `research_repository`テーブルのスキーマ確認
3. Vercelデプロイ時の動作確認
4. Supabase RLS設定の確認（API経由でも適用されるか）

---

**作成者**: Claude (Anthropic)
**レビュー**: Gemini（5つの重要注意点）
**承認待ち**: アリタヒロアキ様
