-- 公開中の価格段階は1行だけ。A/B/Cの金額自体はコード側のカタログが正本。
CREATE TABLE price_stage (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  stage TEXT NOT NULL CHECK (stage IN ('A', 'B', 'C')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO price_stage (id, stage) VALUES (1, 'A');

CREATE TABLE price_stage_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_stage TEXT NOT NULL CHECK (from_stage IN ('A', 'B', 'C')),
  to_stage TEXT NOT NULL CHECK (to_stage IN ('A', 'B', 'C')),
  changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
