# -*- coding: utf-8 -*-
"""Add a prominent back-to-LP bar on all blog pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

JA_BAR = """  <div class="blog-home-bar">
    <div class="container blog-home-bar__inner">
      <a class="blog-home-bar__btn" href="{href}">← 佐藤農園トップへ戻る</a>
    </div>
  </div>
"""

EN_BAR = """  <div class="blog-home-bar">
    <div class="container blog-home-bar__inner">
      <a class="blog-home-bar__btn" href="{href}">← Back to Sato Farms Home</a>
    </div>
  </div>
"""


def home_href(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel.startswith("blog-en/"):
        depth = rel.count("/")
        # blog-en/index.html -> ../index-en.html
        # blog-en/notes/x.html -> ../../index-en.html
        prefix = "../" * depth
        return f"{prefix}index-en.html"
    if rel.startswith("blog/"):
        depth = rel.count("/")
        prefix = "../" * depth
        return f"{prefix}index.html"
    raise ValueError(path)


def process(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "blog-home-bar" in text:
        return False
    if "blog-page" not in text:
        return False

    href = home_href(path)
    is_en = path.as_posix().replace("\\", "/").find("/blog-en/") >= 0 or path.parent.name == "blog-en" or "blog-en" in path.parts
    # More reliable: path under blog-en
    is_en = "blog-en" in path.relative_to(ROOT).parts
    bar = (EN_BAR if is_en else JA_BAR).format(href=href)

    if "<footer" not in text:
        return False
    new = text.replace("<footer", bar + "<footer", 1)
    # bump css cache for blog pages
    new = new.replace("style.css?v=16", "style.css?v=17")
    if new == text:
        return False
    path.write_text(new, encoding="utf-8")
    return True


def main() -> None:
    updated = []
    for base in (ROOT / "blog", ROOT / "blog-en"):
        for path in base.rglob("*.html"):
            if process(path):
                updated.append(str(path.relative_to(ROOT)))
    print(f"updated {len(updated)}")
    for u in updated:
        print(u)


if __name__ == "__main__":
    main()
