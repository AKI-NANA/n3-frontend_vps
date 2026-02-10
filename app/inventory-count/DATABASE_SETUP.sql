-- ============================================================
-- N3 棚卸しツール データベースセットアップ
-- 実行場所: Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. inventory_master テーブルにカラム追加
-- ============================================================
ALTER TABLE inventory_master 
ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_counted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS counted_by VARCHAR(100),
ADD COLUMN IF NOT EXISTS inventory_images TEXT[];

-- インデックス追加（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_inventory_master_storage_location 
ON inventory_master(storage_location);

CREATE INDEX IF NOT EXISTS idx_inventory_master_last_counted_at 
ON inventory_master(last_counted_at);

COMMENT ON COLUMN inventory_master.storage_location IS '保管場所（例: A-1-3, B棚上段）';
COMMENT ON COLUMN inventory_master.last_counted_at IS '最終棚卸し日時';
COMMENT ON COLUMN inventory_master.counted_by IS '棚卸し実施者';
COMMENT ON COLUMN inventory_master.inventory_images IS '棚卸し時の写真URL配列';

-- ============================================================
-- 2. inventory_count_log テーブル作成（履歴管理）
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_count_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_master_id UUID NOT NULL REFERENCES inventory_master(id) ON DELETE CASCADE,
  
  -- 棚卸し結果
  counted_quantity INTEGER NOT NULL,
  previous_quantity INTEGER,  -- 変更前の数量（差分確認用）
  location VARCHAR(100),
  images TEXT[],
  notes TEXT,
  
  -- 実施者情報
  counted_by VARCHAR(100) NOT NULL,
  counted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- メタデータ
  device_info JSONB,  -- ブラウザ/デバイス情報
  ip_address VARCHAR(45),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_inventory_count_log_master_id 
ON inventory_count_log(inventory_master_id);

CREATE INDEX IF NOT EXISTS idx_inventory_count_log_counted_at 
ON inventory_count_log(counted_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_count_log_counted_by 
ON inventory_count_log(counted_by);

COMMENT ON TABLE inventory_count_log IS '棚卸し作業の履歴ログ（全ての棚卸し操作を不変の記録として保存）';

-- ============================================================
-- 3. Supabase Storage バケット作成
-- ============================================================
-- Supabase Dashboard → Storage → Create new bucket
-- バケット名: inventory-count-images
-- Public: false (RLSで制御)

-- ストレージポリシー（Supabase Dashboard → Storage → Policies で設定）
-- INSERT: authenticated users only
-- SELECT: authenticated users only

-- ============================================================
-- 4. RLSポリシー設定
-- ============================================================

-- inventory_count_log のRLS有効化
ALTER TABLE inventory_count_log ENABLE ROW LEVEL SECURITY;

-- 外注担当者はINSERTのみ許可（閲覧・編集・削除は不可）
-- 注意: 実際の認証はアプリケーション側で行うため、
-- ここでは service_role キーを使用する前提
CREATE POLICY "Allow insert for external counters" ON inventory_count_log
  FOR INSERT
  WITH CHECK (true);

-- 管理者のみ閲覧可能
CREATE POLICY "Allow select for admins" ON inventory_count_log
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- 5. 棚卸しサマリービュー（管理用）
-- ============================================================
CREATE OR REPLACE VIEW inventory_count_summary AS
SELECT 
  im.id,
  im.sku,
  im.product_name,
  im.physical_quantity AS current_quantity,
  im.storage_location,
  im.last_counted_at,
  im.counted_by,
  im.inventory_images,
  (
    SELECT COUNT(*) 
    FROM inventory_count_log icl 
    WHERE icl.inventory_master_id = im.id
  ) AS count_history_count,
  (
    SELECT icl.counted_quantity 
    FROM inventory_count_log icl 
    WHERE icl.inventory_master_id = im.id 
    ORDER BY icl.counted_at DESC 
    LIMIT 1
  ) AS last_counted_quantity,
  (
    SELECT icl.notes 
    FROM inventory_count_log icl 
    WHERE icl.inventory_master_id = im.id 
    ORDER BY icl.counted_at DESC 
    LIMIT 1
  ) AS last_notes
FROM inventory_master im
WHERE im.physical_quantity > 0 OR im.last_counted_at IS NOT NULL;

COMMENT ON VIEW inventory_count_summary IS '棚卸し状況サマリー（管理者向け）';

-- ============================================================
-- 6. 検証クエリ
-- ============================================================

-- カラム追加の確認
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'inventory_master' 
-- AND column_name IN ('storage_location', 'last_counted_at', 'counted_by', 'inventory_images');

-- テーブル作成の確認
-- SELECT * FROM inventory_count_log LIMIT 1;

-- ビューの確認
-- SELECT * FROM inventory_count_summary LIMIT 5;
