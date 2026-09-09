-- トップのアクセス数。外部 CountAPI が Cloudflare の挑戦画面で止まったため、自前で持つ。
-- 初期値 3750 は、切れる直前にサイトで見ていた数字（2026.9.9）。
CREATE TABLE page_views (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL CHECK (count >= 0)
);

INSERT INTO page_views (key, count) VALUES ('sato-farm-nakanojo-lp', 3750);
