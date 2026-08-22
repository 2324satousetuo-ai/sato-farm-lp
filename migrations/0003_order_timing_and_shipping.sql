-- 購入希望時期と、注文時点の配送先スナップショット。
-- 会員が後から住所を変えても、過去の注文の届け先は変わらない。

ALTER TABLE orders ADD COLUMN desired_timing TEXT NOT NULL DEFAULT 'asap'
  CHECK (desired_timing IN ('asap', 'specific_month', 'after_new_year', 'march', 'anytime'));

ALTER TABLE orders ADD COLUMN recipient_name TEXT;
ALTER TABLE orders ADD COLUMN shipping_postal_code TEXT;
ALTER TABLE orders ADD COLUMN shipping_prefecture TEXT;
ALTER TABLE orders ADD COLUMN shipping_address TEXT;
ALTER TABLE orders ADD COLUMN shipping_phone TEXT;
