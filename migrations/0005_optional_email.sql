-- メールなし会員を複数登録できるようにする。
-- 空文字の email_normalized は一意制約の対象外（既存のメール会員はそのまま一意）。
DROP INDEX idx_members_email_normalized;

CREATE UNIQUE INDEX idx_members_email_normalized
  ON members(email_normalized)
  WHERE email_normalized != '';
