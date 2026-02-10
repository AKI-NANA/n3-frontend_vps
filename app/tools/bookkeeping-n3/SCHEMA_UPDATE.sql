-- ============================================================
-- N3 記帳ルール テーブル拡張
-- ============================================================
-- 既存の mf_bookkeeping_rules テーブルに新しいカラムを追加

-- 新しいカラムを追加（存在しない場合のみ）
DO $$
BEGIN
  -- match_source: キーワードの抽出元
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'match_source') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN match_source TEXT DEFAULT '摘要';
  END IF;
  
  -- 貸方科目関連
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'credit_account') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN credit_account TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'credit_sub_account') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN credit_sub_account TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'credit_tax_code') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN credit_tax_code TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'credit_invoice') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN credit_invoice TEXT;
  END IF;
  
  -- 借方インボイス
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'debit_invoice') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN debit_invoice TEXT;
  END IF;
  
  -- スプレッドシート連携
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'source_spreadsheet_id') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN source_spreadsheet_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'source_spreadsheet_url') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN source_spreadsheet_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mf_bookkeeping_rules' AND column_name = 'imported_at') THEN
    ALTER TABLE mf_bookkeeping_rules ADD COLUMN imported_at TIMESTAMPTZ;
  END IF;
  
END $$;

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_mf_bookkeeping_rules_match_source ON mf_bookkeeping_rules(match_source);
CREATE INDEX IF NOT EXISTS idx_mf_bookkeeping_rules_keyword_source ON mf_bookkeeping_rules(keyword, match_source);

-- 確認
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mf_bookkeeping_rules'
ORDER BY ordinal_position;
