-- 産直メール用。会員登録メールは order_id が NULL のまま、従来どおり一意。
ALTER TABLE email_deliveries ADD COLUMN order_id INTEGER REFERENCES orders(id);

DROP INDEX idx_email_deliveries_member_type;

CREATE UNIQUE INDEX idx_email_deliveries_member_type
  ON email_deliveries(member_id, email_type)
  WHERE order_id IS NULL;

CREATE UNIQUE INDEX idx_email_deliveries_member_type_order
  ON email_deliveries(member_id, email_type, order_id)
  WHERE order_id IS NOT NULL;
