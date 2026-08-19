# -*- coding: utf-8 -*-
"""Convert blog note HTML articles into Markdown manuscripts."""
from __future__ import annotations

import html
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class BodyToMarkdown(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self._skip = 0
        self._in_pre = False
        self._href: str | None = None
        self._link_text: list[str] = []
        self._li_level = 0
        self._heading: int | None = None
        self._heading_text: list[str] = []
        self._in_figcaption = False
        self._figcaption: list[str] = []
        self._pending_img: tuple[str, str] | None = None
        self._in_code = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if self._skip:
            if tag in {"script", "style"}:
                self._skip += 1
            return
        attr = dict(attrs)
        if tag in {"script", "style"}:
            self._skip = 1
            return
        if tag == "br":
            self._add("  \n")
            return
        if tag in {"p", "div"} and attr.get("class") not in {
            "blog-article__photos",
            "blog-article__figure",
        }:
            self._ensure_blank()
            return
        if tag == "figure":
            self._ensure_blank()
            return
        if tag == "figcaption":
            self._in_figcaption = True
            self._figcaption = []
            return
        if tag == "img":
            src = attr.get("src") or ""
            alt = attr.get("alt") or ""
            self._pending_img = (src, alt)
            return
        if tag in {"strong", "b"}:
            self._add("**")
            return
        if tag in {"em", "i"}:
            self._add("*")
            return
        if tag in {"code"}:
            self._in_code = True
            self._add("`")
            return
        if tag == "a":
            self._href = attr.get("href") or ""
            self._link_text = []
            return
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self._heading = int(tag[1])
            self._heading_text = []
            self._ensure_blank()
            return
        if tag in {"ul", "ol"}:
            self._ensure_blank()
            self._li_level += 1
            return
        if tag == "li":
            indent = "  " * max(self._li_level - 1, 0)
            self._add(f"\n{indent}- ")
            return
        if tag == "blockquote":
            self._ensure_blank()
            self._add("> ")
            return
        if tag == "hr":
            self._ensure_blank()
            self._add("---\n\n")
            return

    def handle_endtag(self, tag: str) -> None:
        if self._skip:
            if tag in {"script", "style"}:
                self._skip -= 1
            return
        if tag in {"p"}:
            self._ensure_blank()
            return
        if tag == "figcaption":
            self._in_figcaption = False
            caption = "".join(self._figcaption).strip()
            if self._pending_img:
                src, alt = self._pending_img
                self._add(f"![{alt}]({src})\n\n")
                self._pending_img = None
            if caption:
                self._add(f"{caption}\n\n")
            return
        if tag == "figure":
            if self._pending_img:
                src, alt = self._pending_img
                self._add(f"![{alt}]({src})\n\n")
                self._pending_img = None
            self._ensure_blank()
            return
        if tag in {"strong", "b"}:
            self._add("**")
            return
        if tag in {"em", "i"}:
            self._add("*")
            return
        if tag == "code":
            self._in_code = False
            self._add("`")
            return
        if tag == "a":
            text = "".join(self._link_text)
            href = self._href or ""
            if href:
                self._add(f"[{text}]({href})")
            else:
                self._add(text)
            self._href = None
            self._link_text = []
            return
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            level = self._heading or 2
            text = "".join(self._heading_text).strip()
            self._add(f"{'#' * level} {text}\n\n")
            self._heading = None
            self._heading_text = []
            return
        if tag in {"ul", "ol"}:
            self._li_level = max(self._li_level - 1, 0)
            self._ensure_blank()
            return
        if tag == "li":
            return

    def handle_data(self, data: str) -> None:
        if self._skip:
            return
        if self._in_figcaption:
            self._figcaption.append(data)
            return
        if self._heading is not None:
            self._heading_text.append(data)
            return
        if self._href is not None:
            self._link_text.append(data)
            return
        if not data:
            return
        if self._in_code:
            self._add(data)
            return
        text = data.replace("\r\n", "\n")
        self._add(text)

    def _add(self, text: str) -> None:
        self.parts.append(text)

    def _ensure_blank(self) -> None:
        joined = "".join(self.parts)
        if not joined:
            return
        if joined.endswith("\n\n"):
            return
        if joined.endswith("\n"):
            self.parts.append("\n")
        else:
            self.parts.append("\n\n")

    def markdown(self) -> str:
        if self._pending_img:
            src, alt = self._pending_img
            self.parts.append(f"![{alt}]({src})\n\n")
            self._pending_img = None
        text = "".join(self.parts)
        text = html.unescape(text)
        text = re.sub(r"[ \t]+\n", "\n", text)
        text = re.sub(r"^[ \t]+(!\[)", r"\1", text, flags=re.M)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip() + "\n"


def extract(html_text: str, pattern: str) -> str:
    match = re.search(pattern, html_text, re.S)
    return match.group(1).strip() if match else ""


def convert_article(src: Path, dest: Path) -> None:
    raw = src.read_text(encoding="utf-8")
    title = extract(raw, r'<h1 class="blog-article__title">(.*?)</h1>')
    category = extract(raw, r'<span class="blog-article__category">(.*?)</span>')
    date = extract(raw, r"<time[^>]*>(.*?)</time>")
    datetime_attr = extract(raw, r'<time[^>]*datetime="([^"]+)"')
    body_html = extract(raw, r'<div class="blog-article__body">(.*?)</div>\s*<nav class="blog-article__nav"')
    title = re.sub(r"<[^>]+>", "", title)
    category = re.sub(r"<[^>]+>", "", category)
    date = re.sub(r"<[^>]+>", "", date)

    parser = BodyToMarkdown()
    parser.feed(body_html)
    parser.close()
    body = parser.markdown()

    lines = [f"# {title}", ""]
    meta = []
    if category:
        meta.append(category)
    if date:
        meta.append(date if not datetime_attr else date)
    if meta:
        lines.append("　".join(meta))
        lines.append("")
    lines.append(body.rstrip())
    lines.append("")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    pairs = [
        (ROOT / "blog" / "notes", ROOT / "原稿" / "blog" / "notes"),
        (ROOT / "blog-en" / "notes", ROOT / "原稿" / "blog-en" / "notes"),
    ]
    count = 0
    for src_dir, dest_dir in pairs:
        for html_path in sorted(src_dir.glob("*.html")):
            if html_path.name.startswith("_"):
                continue
            convert_article(html_path, dest_dir / (html_path.stem + ".md"))
            count += 1
    print(f"converted {count} articles")


if __name__ == "__main__":
    main()
