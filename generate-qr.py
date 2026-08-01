#!/usr/bin/env python3
"""佐藤農園LP 案内用QRコード生成スクリプト"""

from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_M

ROOT = Path(__file__).resolve().parent
IMAGES = ROOT / "images"
CONFIG = ROOT / "site-url.config"

MAPS_URL = (
    "https://www.google.com/maps/search/?api=1&query="
    "%E7%BE%A4%E9%A6%AC%E7%9C%8C%E5%90%BE%E5%A6%BB%E9%83%A1%E4%B8%AD%E4%B9%8B%E6%9D%A1%E7%94%BA%E4%8A%8A%E5%8B%A2%E7%94%BA15-6"
)


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


def make_qr(data: str, path: Path, box_size: int, border: int) -> None:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#1a2e26", back_color="#ffffff")
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)
    print(f"作成: {path}")


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)

    make_qr(MAPS_URL, IMAGES / "maps-qr.png", box_size=10, border=2)
    make_qr(MAPS_URL, IMAGES / "maps-qr-print.png", box_size=20, border=3)

    site_url = read_site_url()
    if site_url:
        make_qr(site_url, IMAGES / "guide-qr.png", box_size=10, border=2)
        make_qr(site_url, IMAGES / "guide-qr-print.png", box_size=20, border=3)
        make_qr(site_url, IMAGES / "url-qr.png", box_size=10, border=2)
        print(f"サイトURL: {site_url}")
    else:
        print()
        print("サイト案内用QRは未作成です。")
        print("site-url.config に URL= を設定して、もう一度実行してください。")

    print()
    print("完了。印刷用ページ: qr-print.html")


if __name__ == "__main__":
    main()
