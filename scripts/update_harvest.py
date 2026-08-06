# -*- coding: utf-8 -*-
"""Update the LP harvest status (JA/EN) from the terminal.

Usage:
  python scripts/update_harvest.py
      Interactive prompts (recommended)

  python scripts/update_harvest.py --show
      Show current values

  python scripts/update_harvest.py --apply
      Apply data/harvest.json to index.html / index-en.html without prompts
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "harvest.json"
JA_HTML = ROOT / "index.html"
EN_HTML = ROOT / "index-en.html"

HARVEST_BLOCK_RE = re.compile(
    r'(<ul class="products__harvest">)(.*?)(</ul>)',
    flags=re.S,
)


def split_items(text: str) -> list[str]:
    text = text.strip()
    if not text:
        return []
    # Allow comma / Japanese comma / slash separators
    parts = re.split(r"[,、/／]+", text)
    return [p.strip() for p in parts if p.strip()]


def join_display(items: list[str], lang: str) -> str:
    if not items:
        return "—"
    if len(items) == 1:
        return items[0]
    sep = "・" if lang == "ja" else ", "
    return sep.join(items)


def build_block_clean(harvested: list[str], harvesting: list[str], lang: str) -> str:
    if lang == "ja":
        label1, label2 = "収穫しました", "収穫中です"
    else:
        label1, label2 = "Harvested", "Currently harvesting"

    def detail(items: list[str]) -> str:
        if not items:
            return '<span class="products__harvest-detail">—</span>'
        if len(items) == 1:
            return f'<span class="products__harvest-detail">{items[0]}</span>'
        crops = "\n".join(
            f'              <span class="products__harvest-crop">{item}</span>'
            for item in items
        )
        return (
            '<span class="products__harvest-detail">\n'
            f"{crops}\n"
            "            </span>"
        )

    return f"""<ul class="products__harvest">
          <li class="products__harvest-item products__harvest-item--row">
            <span class="products__harvest-label">{label1}</span>
            {detail(harvested)}
          </li>
          <li class="products__harvest-item products__harvest-item--row">
            <span class="products__harvest-label">{label2}</span>
            {detail(harvesting)}
          </li>
        </ul>"""


def load_data() -> dict:
    if DATA.exists():
        return json.loads(DATA.read_text(encoding="utf-8"))
    return {
        "harvested_ja": [],
        "harvesting_ja": [],
        "harvested_en": [],
        "harvesting_en": [],
    }


def save_data(data: dict) -> None:
    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def apply_to_html(data: dict) -> None:
    for path, lang, harvested_key, harvesting_key in (
        (JA_HTML, "ja", "harvested_ja", "harvesting_ja"),
        (EN_HTML, "en", "harvested_en", "harvesting_en"),
    ):
        html = path.read_text(encoding="utf-8")
        block = build_block_clean(data[harvested_key], data[harvesting_key], lang)
        new_html, n = HARVEST_BLOCK_RE.subn(block, html, count=1)
        if n != 1:
            raise SystemExit(f"Could not find products__harvest in {path.name}")
        path.write_text(new_html, encoding="utf-8")
        print(f"updated: {path.relative_to(ROOT)}")


def show(data: dict) -> None:
    print("【現在の収穫状況】")
    print("  収穫しました:", join_display(data.get("harvested_ja", []), "ja"))
    print("  収穫中です  :", join_display(data.get("harvesting_ja", []), "ja"))
    print("  Harvested           :", join_display(data.get("harvested_en", []), "en"))
    print("  Currently harvesting:", join_display(data.get("harvesting_en", []), "en"))


def prompt_line(label: str, current: list[str], lang: str) -> list[str]:
    shown = join_display(current, lang)
    print()
    print(label)
    print(f"  いま: {shown}")
    print("  入力例: キャベツ, 玉ねぎ, じゃがいも")
    print("  （空欄のまま Enter でいまの内容を維持）")
    try:
        answer = input("> ").strip()
    except EOFError:
        return current
    if not answer:
        return current
    return split_items(answer)


def interactive() -> None:
    data = load_data()
    show(data)
    print()
    print("======= 収穫状況を更新します =======")
    print("カンマ（,）または読点（、）で区切って入力してください。")

    data["harvested_ja"] = prompt_line(
        "① 収穫しました（日本語）", data.get("harvested_ja", []), "ja"
    )
    data["harvesting_ja"] = prompt_line(
        "② 収穫中です（日本語）", data.get("harvesting_ja", []), "ja"
    )
    data["harvested_en"] = prompt_line(
        "③ Harvested (English)", data.get("harvested_en", []), "en"
    )
    data["harvesting_en"] = prompt_line(
        "④ Currently harvesting (English)", data.get("harvesting_en", []), "en"
    )

    print()
    print("======= 確認 =======")
    show(data)
    print()
    try:
        ok = input("この内容でLPを更新しますか？ (y/n) > ").strip().lower()
    except EOFError:
        ok = "n"
    if ok not in ("y", "yes", "Ｙ", "ｙ"):
        print("キャンセルしました。")
        return

    save_data(data)
    apply_to_html(data)
    print()
    print("完了しました。")
    print("公開する場合は、いつもどおりコミット／push（または Netlify アップロード）をしてください。")


def main() -> None:
    # Windows console UTF-8
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
            sys.stdin.reconfigure(encoding="utf-8")
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="Update LP harvest status (JA/EN)")
    parser.add_argument("--show", action="store_true", help="Show current values")
    parser.add_argument("--apply", action="store_true", help="Apply data/harvest.json to HTML")
    args = parser.parse_args()

    data = load_data()
    if args.show:
        show(data)
        return
    if args.apply:
        apply_to_html(data)
        print("applied data/harvest.json")
        return
    interactive()


if __name__ == "__main__":
    main()
