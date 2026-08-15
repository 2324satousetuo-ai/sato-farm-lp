CREATE TABLE members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email_original TEXT NOT NULL,
  email_normalized TEXT NOT NULL,
  purchase_intent TEXT NOT NULL CHECK (purchase_intent IN ('lv1', 'lv2', 'lv3')),
  line_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_members_email_normalized
  ON members(email_normalized);

CREATE UNIQUE INDEX idx_members_line_user_id
  ON members(line_user_id)
  WHERE line_user_id IS NOT NULL;

CREATE TABLE email_deliveries (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  provider_message_id TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  sent_at TEXT,
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE UNIQUE INDEX idx_email_deliveries_member_type
  ON email_deliveries(member_id, email_type);

CREATE INDEX idx_email_deliveries_status
  ON email_deliveries(status);
