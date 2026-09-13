-- 玄米15kg / 標準精米15kg は仕分け負荷のため販売停止。
-- 既存注文の参照は残す。公開一覧と新規見積・注文からは外す。
UPDATE products
SET status = 'hidden', updated_at = datetime('now')
WHERE weight_label = '15kg相当';
