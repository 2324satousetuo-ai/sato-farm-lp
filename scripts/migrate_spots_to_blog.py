# -*- coding: utf-8 -*-
"""Extract LP #spots sections into blog/links pages and slim the LP teasers."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

JA_SHELL = """<!DOCTYPE html>
<html lang="ja" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="佐藤農園ブログ・名所URL集。中之条町と吾妻郡の観光・温泉・文化のリンク集です。">
  <link rel="alternate" hreflang="ja" href="index.html">
  <link rel="alternate" hreflang="en" href="../../blog-en/links/">
  <meta name="google" content="notranslate">
  <title>名所URL集｜佐藤農園ブログ</title>
  <link rel="canonical" href="https://satofarms.com/blog/links/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../style.css?v=16">
</head>
<body class="notranslate blog-page">
  <div id="top" class="page-top-anchor" tabindex="-1" aria-hidden="true"></div>
  <header class="header blog-header">
    <div class="header__inner">
      <a href="../../index.html" class="logo">佐藤農園<span>ブログ</span></a>
      <div class="header__tools">
        <div class="header__actions">
          <a href="../../blog-en/links/" class="header__lang-btn" lang="en">English</a>
          <button class="nav-toggle" type="button" aria-label="メニューを開く" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <nav class="nav" aria-label="メインナビゲーション">
          <a href="../../index.html">トップ</a>
          <a href="../">ブログ</a>
          <a href="../news/">新着</a>
          <a href="../field-report/">近況</a>
          <a href="./" aria-current="page">URL集</a>
          <a href="../../index.html#contact" class="nav__cta">お問い合わせ</a>
        </nav>
      </div>
    </div>
  </header>

  <main>
    <header class="blog-page-hero">
      <div class="container">
        <nav class="blog-breadcrumb" aria-label="パンくずリスト">
          <a href="../../index.html">トップ</a><span aria-hidden="true">/</span>
          <a href="../">ブログ</a><span aria-hidden="true">/</span>
          <span>名所URL集</span>
        </nav>
        <p class="blog-page-hero__label">Links</p>
        <h1 class="blog-page-hero__title">名所URL集</h1>
        <p class="blog-page-hero__lead">中之条町と吾妻郡の温泉・自然・文化へのリンク集です。リンクは小さなポップアップで開きます。</p>
      </div>
    </header>

    <section class="spots section" id="spots">
      <div class="container container--spots">
{inner}
      </div>
    </section>

    <nav class="blog-article__nav" aria-label="フッターナビ" style="padding-bottom: 2rem;">
      <div class="container">
        <a href="../">← ブログ一覧へ</a>
        <a href="../../blog-en/links/" lang="en">English</a>
      </div>
    </nav>
  </main>

  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__logo">佐藤農園</p>
      <p class="footer__note"><a href="../">ブログ一覧へ</a> · <a href="../../index.html">トップへ</a></p>
      <p class="footer__copy">&copy; 2026 佐藤農園</p>
    </div>
  </footer>
  <script src="../../script.js"></script>
</body>
</html>
"""

EN_SHELL = """<!DOCTYPE html>
<html lang="en" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sato Farms blog sightseeing links for Nakanojo Town and Agatsuma County.">
  <link rel="alternate" hreflang="en" href="index.html">
  <link rel="alternate" hreflang="ja" href="../../blog/links/">
  <meta name="google" content="notranslate">
  <title>Sightseeing Links | Sato Farms Blog</title>
  <link rel="canonical" href="https://satofarms.com/blog-en/links/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&family=Noto+Serif:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../style.css?v=16">
</head>
<body class="notranslate blog-page">
  <div id="top" class="page-top-anchor" tabindex="-1" aria-hidden="true"></div>
  <header class="header blog-header">
    <div class="header__inner">
      <a href="../../index-en.html" class="logo">Sato Farms<span>Blog</span></a>
      <div class="header__tools">
        <div class="header__actions">
          <a href="../../blog/links/" class="header__lang-btn" lang="ja">日本語</a>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <nav class="nav" aria-label="Main navigation">
          <a href="../../index-en.html">Home</a>
          <a href="../">Blog</a>
          <a href="../news/">News</a>
          <a href="../field-report/">Updates</a>
          <a href="./" aria-current="page">Links</a>
          <a href="../../index-en.html#contact" class="nav__cta">Contact</a>
        </nav>
      </div>
    </div>
  </header>

  <main>
    <header class="blog-page-hero">
      <div class="container">
        <nav class="blog-breadcrumb" aria-label="Breadcrumb">
          <a href="../../index-en.html">Home</a><span aria-hidden="true">/</span>
          <a href="../">Blog</a><span aria-hidden="true">/</span>
          <span>Sightseeing Links</span>
        </nav>
        <p class="blog-page-hero__label">Links</p>
        <h1 class="blog-page-hero__title">Sightseeing Links</h1>
        <p class="blog-page-hero__lead">Hot springs, nature, and culture around Nakanojo and Agatsuma. Links open in a small popup.</p>
      </div>
    </header>

    <section class="spots section" id="spots">
      <div class="container container--spots">
{inner}
      </div>
    </section>

    <nav class="blog-article__nav" aria-label="Footer nav" style="padding-bottom: 2rem;">
      <div class="container">
        <a href="../">← Back to blog</a>
        <a href="../../blog/links/" lang="ja">日本語</a>
      </div>
    </nav>
  </main>

  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__logo">Sato Farms</p>
      <p class="footer__note"><a href="../">Blog index</a> · <a href="../../index-en.html">Home</a></p>
      <p class="footer__copy">&copy; 2026 Sato Farms</p>
    </div>
  </footer>
  <script src="../../script.js"></script>
</body>
</html>
"""

JA_TEASER = """    <section class="spots section section--alt spots--teaser" id="spots">
      <div class="container">
        <p class="section__label">Links</p>
        <h2 class="section__title">名所URL集</h2>
        <p class="lp-moved-notice" data-legacy-hash="spots">
          中之条町・吾妻郡の名所リンク集は <a href="blog/links/">ブログの名所URL集</a> へ移しました。
        </p>
        <p class="spots__lead">温泉・自然・文化へのリンクをまとめています。興味のある方はブログ側をご覧ください。</p>
        <p class="lp-blog-more"><a href="blog/links/">名所URL集を見る →</a></p>
      </div>
    </section>
"""

EN_TEASER = """    <section class="spots section section--alt spots--teaser" id="spots">
      <div class="container">
        <p class="section__label">Links</p>
        <h2 class="section__title">Sightseeing Links</h2>
        <p class="lp-moved-notice" data-legacy-hash="spots">
          The full sightseeing link list now lives on the <a href="blog-en/links/">blog links page</a>.
        </p>
        <p class="spots__lead">Hot springs, nature, and culture around Nakanojo and Agatsuma—browse the full list on the blog.</p>
        <p class="lp-blog-more"><a href="blog-en/links/">See sightseeing links →</a></p>
      </div>
    </section>
"""


def extract_spots_inner(html: str) -> str:
    m = re.search(
        r'<section class="spots section section--alt" id="spots">\s*'
        r'<div class="container container--spots">\s*'
        r'<p class="section__label">Links</p>\s*'
        r'(.*?)\s*</div>\s*</section>',
        html,
        flags=re.S,
    )
    if not m:
        raise SystemExit("spots section not found")
    return m.group(1).strip()


def replace_spots(html: str, teaser: str) -> str:
    new, n = re.subn(
        r'    <section class="spots section section--alt" id="spots">.*?</section>\n',
        teaser + "\n",
        html,
        count=1,
        flags=re.S,
    )
    if n != 1:
        raise SystemExit(f"replace failed, count={n}")
    return new


def main() -> None:
    ja_lp = ROOT / "index.html"
    en_lp = ROOT / "index-en.html"
    ja_html = ja_lp.read_text(encoding="utf-8")
    en_html = en_lp.read_text(encoding="utf-8")

    ja_inner = extract_spots_inner(ja_html)
    en_inner = extract_spots_inner(en_html)

    ja_dir = ROOT / "blog" / "links"
    en_dir = ROOT / "blog-en" / "links"
    ja_dir.mkdir(parents=True, exist_ok=True)
    en_dir.mkdir(parents=True, exist_ok=True)

    (ja_dir / "index.html").write_text(JA_SHELL.format(inner=ja_inner), encoding="utf-8")
    (en_dir / "index.html").write_text(EN_SHELL.format(inner=en_inner), encoding="utf-8")

    ja_lp.write_text(replace_spots(ja_html, JA_TEASER), encoding="utf-8")
    en_lp.write_text(replace_spots(en_html, EN_TEASER), encoding="utf-8")
    print("wrote blog/links and blog-en/links; slimmed LP spots")


if __name__ == "__main__":
    main()
