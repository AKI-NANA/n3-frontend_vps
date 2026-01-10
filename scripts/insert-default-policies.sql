-- .env.localの値をDBに保存
-- ⚠️ 実際のポリシーIDに置き換えてください

-- まずテーブルを作成（まだの場合）
-- scripts/create-default-policies-table.sql を先に実行

-- 既存のデータをクリア（必要な場合）
-- DELETE FROM ebay_default_policies;

-- 1. Payment Policy
INSERT INTO ebay_default_policies (
  policy_type, 
  policy_id, 
  policy_name, 
  account_id, 
  marketplace
) VALUES (
  'payment',
  'YOUR_PAYMENT_POLICY_ID_HERE',  -- ← .env.localの値
  'Standard Payment Policy',
  'main_account',
  'EBAY_US'
) ON CONFLICT (policy_type, account_id, marketplace) 
DO UPDATE SET 
  policy_id = EXCLUDED.policy_id,
  policy_name = EXCLUDED.policy_name,
  updated_at = NOW();

-- 2. Return Policy
INSERT INTO ebay_default_policies (
  policy_type, 
  policy_id, 
  policy_name, 
  account_id, 
  marketplace
) VALUES (
  'return',
  'YOUR_RETURN_POLICY_ID_HERE',  -- ← .env.localの値
  '30-Day Return Policy',
  'main_account',
  'EBAY_US'
) ON CONFLICT (policy_type, account_id, marketplace) 
DO UPDATE SET 
  policy_id = EXCLUDED.policy_id,
  policy_name = EXCLUDED.policy_name,
  updated_at = NOW();

-- 3. Fulfillment Policy（既にebay_fulfillment_policiesにある場合はそこから取得）
-- もしくは直接指定
INSERT INTO ebay_default_policies (
  policy_type, 
  policy_id, 
  policy_name, 
  account_id, 
  marketplace
) VALUES (
  'fulfillment',
  'YOUR_FULFILLMENT_POLICY_ID_HERE',  -- ← .env.localの値
  'USA DDP Standard Shipping',
  'main_account',
  'EBAY_US'
) ON CONFLICT (policy_type, account_id, marketplace) 
DO UPDATE SET 
  policy_id = EXCLUDED.policy_id,
  policy_name = EXCLUDED.policy_name,
  updated_at = NOW();

-- 4. 確認
SELECT 
  policy_type,
  policy_id,
  policy_name,
  account_id,
  is_active
FROM ebay_default_policies
ORDER BY policy_type;

-- 期待される結果:
-- policy_type | policy_id       | policy_name                    | account_id   | is_active
-- ------------|-----------------|--------------------------------|--------------|----------
-- fulfillment | 123456789       | USA DDP Standard Shipping      | main_account | true
-- payment     | 987654321       | Standard Payment Policy        | main_account | true
-- return      | 456789123       | 30-Day Return Policy           | main_account | true
