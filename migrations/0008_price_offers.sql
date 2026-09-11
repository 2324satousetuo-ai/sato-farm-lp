-- 価格案内の一斉送信。会員登録メール（email_deliveries）とは別履歴。
-- 1回の送信が campaigns 1行。会員1人×その回が recipients 1行。

CREATE TABLE price_offer_campaigns (
  id TEXT PRIMARY KEY,
  target_intent TEXT NOT NULL CHECK (target_intent IN ('lv1', 'lv2', 'lv3')),
  price_stage TEXT NOT NULL CHECK (price_stage IN ('A', 'B', 'C')),
  subject TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE price_offer_recipients (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES price_offer_campaigns(id),
  member_id TEXT NOT NULL REFERENCES members(id),
  email TEXT NOT NULL,
  send_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (send_status IN ('pending', 'sent', 'failed', 'skipped')),
  provider_message_id TEXT,
  last_error TEXT,
  response TEXT CHECK (response IN ('buy', 'hold', 'pass')),
  responded_at TEXT,
  order_id INTEGER REFERENCES orders(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (campaign_id, member_id)
);

CREATE INDEX idx_price_offer_campaigns_intent_created
  ON price_offer_campaigns(target_intent, created_at DESC);

CREATE INDEX idx_price_offer_recipients_campaign
  ON price_offer_recipients(campaign_id);

CREATE INDEX idx_price_offer_recipients_order
  ON price_offer_recipients(order_id);
