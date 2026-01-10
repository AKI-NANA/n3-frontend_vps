-- デフォルトポリシー設定SQL
-- Supabase SQL Editorで実行してください

-- 1. テーブルにis_defaultカラムを追加（既にある場合はスキップ）
ALTER TABLE ebay_payment_policies 
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

ALTER TABLE ebay_return_policies 
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

ALTER TABLE ebay_fulfillment_policies 
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- 2. 既存のポリシーからデフォルトを設定
-- ⚠️ 実際のpolicy_idに置き換えてください

-- Payment Policy（例: 最初のポリシーをデフォルトに）
UPDATE ebay_payment_policies 
SET is_default = true 
WHERE policy_id = (
  SELECT policy_id 
  FROM ebay_payment_policies 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Return Policy（例: 最初のポリシーをデフォルトに）
UPDATE ebay_return_policies 
SET is_default = true 
WHERE policy_id = (
  SELECT policy_id 
  FROM ebay_return_policies 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Fulfillment Policy（例: 最初のポリシーをデフォルトに）
UPDATE ebay_fulfillment_policies 
SET is_default = true 
WHERE policy_id = (
  SELECT policy_id 
  FROM ebay_fulfillment_policies 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- 3. 確認
SELECT 
  'Payment' as policy_type,
  policy_id,
  name,
  is_default
FROM ebay_payment_policies
WHERE is_default = true

UNION ALL

SELECT 
  'Return' as policy_type,
  policy_id,
  name,
  is_default
FROM ebay_return_policies
WHERE is_default = true

UNION ALL

SELECT 
  'Fulfillment' as policy_type,
  policy_id,
  name,
  is_default
FROM ebay_fulfillment_policies
WHERE is_default = true;
