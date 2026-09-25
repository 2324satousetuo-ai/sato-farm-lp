#!/usr/bin/env python3
"""佐藤農園LP 案内用QRコード生成スクリプト"""

from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_M

ROOT = Path(__file__).resolve().parent
IMAGES = ROOT / "images"
CONFIG = ROOT / "site-url.config"

# 案内用QRは画面上で小さく出る。日本語住所をそのまま入れると模様が細かくなり、
# スマホのカメラが読み取れなくなる。番地まで特定できる短い英字URLにする。
MAPS_URL = "https://maps.google.com/?q=15-6+Isemachi+Nakanojo+Gunma"


def read_site_url() -> str | None:
    if not CONFIG.exists():
        return None
    for line in CONFIG.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("URL="):
            value = line.split("=", 1)[1].strip()
            return value or None
    return None


def make_qr(data: str, path: Path, box_size: int) -> None:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=box_size,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#000000", back_color="#ffffff")
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)
    print(f"作成: {path}")


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)

    make_qr(MAPS_URL, IMAGES / "maps-qr.png", box_size=10)
    make_qr(MAPS_URL, IMAGES / "maps-qr-print.png", box_size=20)

    site_url = read_site_url()
    if site_url:
        make_qr(site_url, IMAGES / "guide-qr.png", box_size=10)
        make_qr(site_url, IMAGES / "guide-qr-print.png", box_size=20)
        make_qr(site_url, IMAGES / "url-qr.png", box_size=10)
        print(f"サイトURL: {site_url}")
    else:
        print()
        print("サイト案内用QRは未作成です。")
        print("site-url.config に URL= を設定して、もう一度実行してください。")

    print()
    print("完了。印刷用ページ: qr-print.html")


if __name__ == "__main__":
    main()
