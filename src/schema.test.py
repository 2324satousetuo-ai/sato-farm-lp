import sqlite3
from pathlib import Path

con = sqlite3.connect(":memory:")
for path in sorted(Path("migrations").glob("*.sql")):
    con.executescript(path.read_text(encoding="utf-8"))
cur = con.cursor()

cur.execute(
    "INSERT INTO members (id,name,email_original,email_normalized,purchase_intent) VALUES (?,?,?,?,?)",
    ("m1", "佐藤 節雄", "Example@Gmail.com", "example@gmail.com", "lv1"),
)
cur.execute(
    "INSERT INTO email_deliveries (id,member_id,email_type,status) VALUES (?,?,?,?)",
    ("d1", "m1", "registration_complete", "pending"),
)

try:
    cur.execute(
        "INSERT INTO members (id,name,email_original,email_normalized,purchase_intent) VALUES (?,?,?,?,?)",
        ("m2", "別の人", "example@gmail.com", "example@gmail.com", "lv2"),
    )
    raise SystemExit("FAIL: duplicate email was allowed")
except sqlite3.IntegrityError:
    print("OK duplicate email rejected")

cur.execute(
    "INSERT INTO members (id,name,email_original,email_normalized,purchase_intent,line_user_id) VALUES (?,?,?,?,?,NULL)",
    ("m3", "山田", "b@example.com", "b@example.com", "lv3"),
)
print("OK multiple NULL line_user_id")

try:
    cur.execute(
        "INSERT INTO email_deliveries (id,member_id,email_type,status) VALUES (?,?,?,?)",
        ("d2", "m1", "registration_complete", "pending"),
    )
    raise SystemExit("FAIL: duplicate delivery was allowed")
except sqlite3.IntegrityError:
    print("OK duplicate registration delivery rejected")

cur.execute(
    """INSERT INTO orders (
         id, member_id, product_id, shipping_zone_id, pickup_discount,
         payment_method, payment_status, status
       ) VALUES (1, 'm1', 1, 1, 0, 'bank_transfer', 'pending_payment', 'pending_payment')"""
)
cur.execute(
    """INSERT INTO orders (
         id, member_id, product_id, shipping_zone_id, pickup_discount,
         payment_method, payment_status, status
       ) VALUES (2, 'm1', 1, 1, 0, 'bank_transfer', 'pending_payment', 'pending_payment')"""
)
cur.execute(
    "INSERT INTO email_deliveries (id,member_id,email_type,status,order_id) VALUES (?,?,?,?,?)",
    ("d3", "m1", "order_confirmation", "pending", 1),
)
cur.execute(
    "INSERT INTO email_deliveries (id,member_id,email_type,status,order_id) VALUES (?,?,?,?,?)",
    ("d4", "m1", "order_confirmation", "pending", 2),
)
print("OK same member can have confirmation per order")

try:
    cur.execute(
        "INSERT INTO email_deliveries (id,member_id,email_type,status,order_id) VALUES (?,?,?,?,?)",
        ("d5", "m1", "order_confirmation", "pending", 1),
    )
    raise SystemExit("FAIL: duplicate order delivery was allowed")
except sqlite3.IntegrityError:
    print("OK duplicate order delivery rejected")

row = cur.execute("SELECT name,email_normalized,purchase_intent FROM members WHERE id='m1'").fetchone()
assert row == ("佐藤 節雄", "example@gmail.com", "lv1"), row
print("OK original member not overwritten")

cur.execute(
    "UPDATE email_deliveries SET status='failed', last_error='RESEND_API_KEY is not configured' WHERE id='d1'"
)
assert cur.execute("SELECT COUNT(*) FROM members").fetchone()[0] == 2
print("OK member kept after email failed")
print("sqlite schema tests passed")
