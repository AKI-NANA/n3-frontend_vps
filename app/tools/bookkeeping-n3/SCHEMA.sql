-- ============================================================
-- N3 記帳オートメーションシステム - データベーススキーマ
-- ============================================================
-- 実行方法: Supabase SQL Editor で実行
-- ⚠️ 順序重要: ルールテーブル → 取引テーブル → マスタ → ビュー
-- ============================================================

-- ============================================================
-- 1. mf_bookkeeping_rules (ルールエンジン) - 先に作成
-- ============================================================

CREATE TABLE IF NOT EXISTS mf_bookkeeping_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ルール識別
  rule_name TEXT NOT NULL,
  rule_description TEXT,
  
  -- マッチング条件
  keyword TEXT NOT NULL,                  -- 判定用キーワード（例: "ｱﾏｿﾞﾝ"）
  match_type TEXT DEFAULT 'partial',      -- partial | exact | regex
  source_name_filter TEXT,                -- 特定の取引元のみに適用
  amount_min INTEGER,                     -- 金額下限
  amount_max INTEGER,                     -- 金額上限
  
  -- 記帳設定
  target_category TEXT NOT NULL,          -- 勘定科目（例: 仕入高）
  target_sub_category TEXT,               -- 補助科目
  tax_code TEXT DEFAULT '課税仕入 10%',   -- 税区分
  
  -- ルール優先度・状態
  priority INTEGER DEFAULT 100,           -- 適用優先度（小さいほど優先）
  status TEXT DEFAULT 'active',           -- active | draft | archived
  
  -- AI生成情報
  ai_confidence_score NUMERIC(3,2),
  ai_generation_prompt TEXT,
  
  -- 使用統計
  applied_count INTEGER DEFAULT 0,
  last_applied_at TIMESTAMPTZ,
  
  -- メタデータ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_mf_bookkeeping_rules_keyword ON mf_bookkeeping_rules(keyword);
CREATE INDEX IF NOT EXISTS idx_mf_bookkeeping_rules_status ON mf_bookkeeping_rules(status);
CREATE INDEX IF NOT EXISTS idx_mf_bookkeeping_rules_priority ON mf_bookkeeping_rules(priority);

-- ============================================================
-- 2. mf_raw_transactions (生データ一時保管)
-- ============================================================

CREATE TABLE IF NOT EXISTS mf_raw_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 取引識別情報
  mf_transaction_id TEXT UNIQUE,           -- MFクラウドのオリジナルID（重複排除用）
  account_id TEXT,                          -- 取引元ID（銀行/カード識別）
  source_name TEXT NOT NULL,               -- 取り込み元名（例: 楽天カード, 住信SBI）
  source_type TEXT DEFAULT 'CREDIT_CARD',  -- BANK | CREDIT_CARD
  
  -- 取引内容
  transaction_date DATE NOT NULL,
  raw_memo TEXT NOT NULL,                   -- 摘要欄の生テキスト
  amount INTEGER NOT NULL,                  -- 金額（正=入金, 負=出金）
  
  -- ワークフロー状態
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | simulated | submitted | ignored
  
  -- ルール適用結果（simulated 時に設定）
  matched_rule_id UUID REFERENCES mf_bookkeeping_rules(id),
  simulated_debit_account TEXT,
  simulated_credit_account TEXT,
  simulated_tax_code TEXT,
  confidence_score NUMERIC(3,2),
  
  -- MFクラウド送信結果
  mf_journal_id TEXT,
  submitted_at TIMESTAMPTZ,
  
  -- メタデータ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_mf_raw_transactions_status ON mf_raw_transactions(status);
CREATE INDEX IF NOT EXISTS idx_mf_raw_transactions_date ON mf_raw_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_mf_raw_transactions_source ON mf_raw_transactions(source_name);

-- 更新日時自動更新トリガー
CREATE OR REPLACE FUNCTION update_mf_raw_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mf_raw_transactions_updated_at ON mf_raw_transactions;
CREATE TRIGGER trigger_mf_raw_transactions_updated_at
  BEFORE UPDATE ON mf_raw_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_mf_raw_transactions_updated_at();

-- ============================================================
-- 3. mf_accounts (勘定科目マスタ)
-- ============================================================

CREATE TABLE IF NOT EXISTS mf_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mf_account_id TEXT UNIQUE,
  account_name TEXT NOT NULL,
  account_type TEXT,
  parent_id UUID REFERENCES mf_accounts(id),
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期データ
INSERT INTO mf_accounts (account_name, account_type, display_order) VALUES
  ('仕入高', '費用', 1),
  ('支払手数料', '費用', 2),
  ('発送費', '費用', 3),
  ('広告宣伝費', '費用', 4),
  ('通信費', '費用', 5),
  ('消耗品費', '費用', 6),
  ('雑費', '費用', 7),
  ('売上高', '収益', 10),
  ('普通預金', '資産', 20),
  ('クレジットカード', '負債', 30),
  ('未払金', '負債', 31),
  ('買掛金', '負債', 32)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. mf_tax_codes (税区分マスタ)
-- ============================================================

CREATE TABLE IF NOT EXISTS mf_tax_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  rate NUMERIC(5,2),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期データ
INSERT INTO mf_tax_codes (code, name, rate, display_order) VALUES
  ('tax_10_purchase', '課税仕入 10%', 10.00, 1),
  ('tax_8_purchase', '課税仕入 8%（軽減）', 8.00, 2),
  ('tax_10_sales', '課税売上 10%', 10.00, 3),
  ('tax_8_sales', '課税売上 8%（軽減）', 8.00, 4),
  ('tax_exempt', '非課税', 0.00, 5),
  ('tax_free', '不課税', 0.00, 6),
  ('tax_export', '輸出免税', 0.00, 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. テストデータ投入
-- ============================================================

-- サンプル取引データ
INSERT INTO mf_raw_transactions (source_name, source_type, transaction_date, raw_memo, amount, status)
VALUES
  ('楽天カード', 'CREDIT_CARD', '2025-01-15', 'ｱﾏｿﾞﾝ ｼﾞｬﾊﾟﾝ 1/15', -5800, 'pending'),
  ('楽天カード', 'CREDIT_CARD', '2025-01-16', 'STRIPE 決済手数料', -350, 'pending'),
  ('住信SBI', 'BANK', '2025-01-17', 'ヤマト運輸 代引精算', -1200, 'pending'),
  ('楽天カード', 'CREDIT_CARD', '2025-01-18', 'AWS TOKYO', -8500, 'pending'),
  ('楽天カード', 'CREDIT_CARD', '2025-01-19', 'VERCEL INC', -2000, 'pending'),
  ('楽天カード', 'CREDIT_CARD', '2025-01-20', 'ｱﾏｿﾞﾝ ｼﾞｬﾊﾟﾝ 仕入', -12300, 'pending'),
  ('楽天カード', 'CREDIT_CARD', '2025-01-21', 'GOOGLE CLOUD JAPAN', -3500, 'pending'),
  ('楽天カード', 'CREDIT_CARD', '2025-01-22', 'SUPABASE PTE', -2500, 'pending'),
  ('住信SBI', 'BANK', '2025-01-23', '佐川急便 集荷代', -980, 'pending'),
  ('楽天カード', 'CREDIT_CARD', '2025-01-24', 'GITHUB INC', -400, 'pending')
ON CONFLICT DO NOTHING;

-- サンプルルールデータ
INSERT INTO mf_bookkeeping_rules (rule_name, keyword, match_type, target_category, tax_code, priority, status)
VALUES
  ('Amazon仕入れ', 'ｱﾏｿﾞﾝ', 'partial', '仕入高', '課税仕入 10%', 10, 'active'),
  ('AWS利用料', 'AWS', 'partial', '通信費', '課税仕入 10%', 20, 'active'),
  ('Stripe手数料', 'STRIPE', 'partial', '支払手数料', '課税仕入 10%', 30, 'active'),
  ('ヤマト運輸', 'ヤマト', 'partial', '発送費', '課税仕入 10%', 40, 'active'),
  ('佐川急便', '佐川', 'partial', '発送費', '課税仕入 10%', 40, 'active'),
  ('Google Cloud', 'GOOGLE CLOUD', 'partial', '通信費', '課税仕入 10%', 50, 'active'),
  ('Vercel利用料', 'VERCEL', 'partial', '通信費', '課税仕入 10%', 50, 'active'),
  ('Supabase利用料', 'SUPABASE', 'partial', '通信費', '課税仕入 10%', 50, 'active'),
  ('GitHub利用料', 'GITHUB', 'partial', '通信費', '課税仕入 10%', 50, 'active')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 完了メッセージ
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '✅ N3記帳オートメーション スキーマ作成完了';
  RAISE NOTICE '   - mf_bookkeeping_rules: ルールエンジン';
  RAISE NOTICE '   - mf_raw_transactions: 生データ保管';
  RAISE NOTICE '   - mf_accounts: 勘定科目マスタ';
  RAISE NOTICE '   - mf_tax_codes: 税区分マスタ';
  RAISE NOTICE '   - テストデータ: 10件の取引 + 9件のルール';
END $$;
