-- 直販注文テーブル。既存の members（UUID/TEXT）は再作成しない。
-- orders.member_id は members.id と同じ TEXT。
-- 注文フォームの住所を残すため、members に配送先カラムだけ足す。
-- member_level は実績（1〜5）。purchase_intent（意思の lv1〜lv3）とは別列。

ALTER TABLE members ADD COLUMN postal_code TEXT;
ALTER TABLE members ADD COLUMN prefecture TEXT;
ALTER TABLE members ADD COLUMN address TEXT;
ALTER TABLE members ADD COLUMN phone TEXT;
ALTER TABLE members ADD COLUMN member_level INTEGER NOT NULL DEFAULT 1 CHECK (member_level IN (1, 2, 3, 4, 5));

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  weight_label TEXT NOT NULL,
  actual_weight_kg REAL NOT NULL,
  milled INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL,
  milling_fee INTEGER NOT NULL DEFAULT 0,
  size_class TEXT,
  weight_surcharge INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available',
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE shipping_zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_name TEXT NOT NULL UNIQUE
);

CREATE TABLE prefecture_zone_map (
  prefecture TEXT PRIMARY KEY,
  zone_id INTEGER NOT NULL REFERENCES shipping_zones(id)
);

CREATE TABLE shipping_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id INTEGER NOT NULL REFERENCES shipping_zones(id),
  size_class TEXT NOT NULL,
  base_rate INTEGER NOT NULL,
  UNIQUE(zone_id, size_class)
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL REFERENCES members(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  shipping_zone_id INTEGER NOT NULL REFERENCES shipping_zones(id),
  pickup_discount INTEGER NOT NULL DEFAULT 0,
  product_price INTEGER,
  milling_fee INTEGER DEFAULT 0,
  shipping_fee INTEGER,
  total_amount INTEGER,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  payment_status TEXT NOT NULL DEFAULT 'pending_payment',
  paid_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  actual_weight_measured REAL,
  ship_date TEXT,
  tracking_number TEXT,
  ordered_at TEXT DEFAULT (datetime('now')),
  notes TEXT
);

CREATE TABLE order_confirmations (
  order_id INTEGER PRIMARY KEY REFERENCES orders(id),
  confirmed_packaging INTEGER DEFAULT 0,
  confirmed_damage_risk INTEGER DEFAULT 0,
  confirmed_weight_variance INTEGER DEFAULT 0,
  confirmed_bank_fee INTEGER DEFAULT 0,
  confirmed_milling_standard INTEGER DEFAULT 0,
  confirmed_milling_loss INTEGER DEFAULT 0
);

CREATE INDEX idx_orders_member ON orders(member_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_products_status ON products(status);

-- 商品マスタ（8パターン）。サイズは2026.8.19中之条郵便局で実測。
INSERT INTO products (weight_label, actual_weight_kg, milled, price, milling_fee, size_class, weight_surcharge, status) VALUES
  ('30kg',     30.0, 0, 20000, 0,    '120', 560, 'available'),
  ('30kg',     30.0, 1, 22000, 2000, '120', 560, 'available'),
  ('20kg相当', 19.5, 0, 16000, 0,    '120', 0,   'available'),
  ('20kg相当', 19.5, 1, 18000, 2000, '120', 0,   'available'),
  ('15kg相当', 14.5, 0, 13000, 0,    '100', 0,   'available'),
  ('15kg相当', 14.5, 1, 15000, 2000, '100', 0,   'available'),
  ('10kg相当',  9.5, 0, 10000, 0,    '100', 0,   'available'),
  ('10kg相当',  9.5, 1, 12000, 2000, '100', 0,   'available');

INSERT INTO shipping_zones (zone_name) VALUES
  ('群馬県内'),
  ('東北・関東・信越・北陸・東海'),
  ('近畿'),
  ('中国・四国'),
  ('北海道・九州'),
  ('沖縄');

INSERT INTO shipping_rates (zone_id, size_class, base_rate) VALUES
  (1, '100', 1450), (1, '120', 1770),
  (2, '100', 1500), (2, '120', 1830),
  (3, '100', 1620), (3, '120', 1940),
  (4, '100', 1780), (4, '120', 2080),
  (5, '100', 2020), (5, '120', 2340),
  (6, '100', 2160), (6, '120', 2490);

INSERT INTO prefecture_zone_map (prefecture, zone_id) VALUES
  ('群馬県', 1),
  ('青森県', 2), ('岩手県', 2), ('宮城県', 2), ('秋田県', 2), ('山形県', 2), ('福島県', 2),
  ('茨城県', 2), ('栃木県', 2), ('埼玉県', 2), ('千葉県', 2), ('東京都', 2), ('神奈川県', 2),
  ('新潟県', 2), ('山梨県', 2), ('長野県', 2),
  ('富山県', 2), ('石川県', 2), ('福井県', 2),
  ('静岡県', 2), ('愛知県', 2), ('岐阜県', 2), ('三重県', 2),
  ('滋賀県', 3), ('京都府', 3), ('大阪府', 3), ('兵庫県', 3), ('奈良県', 3), ('和歌山県', 3),
  ('鳥取県', 4), ('島根県', 4), ('岡山県', 4), ('広島県', 4), ('山口県', 4),
  ('徳島県', 4), ('香川県', 4), ('愛媛県', 4), ('高知県', 4),
  ('北海道', 5),
  ('福岡県', 5), ('佐賀県', 5), ('長崎県', 5), ('熊本県', 5), ('大分県', 5), ('宮崎県', 5), ('鹿児島県', 5),
  ('沖縄県', 6);
