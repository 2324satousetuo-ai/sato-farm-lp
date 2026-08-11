# -*- coding: utf-8 -*-
"""Publish 2026-08-12 note: no-google-translate."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "no-google-translate"
DATE = "2026-08-12"
DATE_JA = "2026.8.12"
DATE_EN = "August 12, 2026"
TITLE_JA = "佐藤農園LPが「Google翻訳」を使わない理由"
TITLE_EN = "Why Sato Farms' LP Does Not Use Google Translate"

BODY_JA = """
<p>佐藤農園のLPでは、Google翻訳を使わない。</p>
<p>速いし、便利だし、まあ悪くない。<br>でも、あれで訳すと、文章が急に「無味」になる。</p>
<p>畑のちょっとした出来事や、農家の実感や、時々こぼれる独り言みたいなユーモア。<br>そういう「味」は、機械の直訳では抜け落ちる。</p>
<p>たとえば、これ。</p>
<p>「欲張って三本食べた。うまかった。文句なしに、うまかった。」</p>
<p>意味は通じる。<br>でも、あの「間」は英語にすると固くなる。</p>
<p>対話しながら訳せば、英語の読者が自然に読めるリズムにできる。</p>
<p>I ate three of them. Maybe I was a little greedy.<br>But they were good. Really good.</p>
<p>こういう調整は、辞書では出てこない。</p>
<p>もう一つ、別の場面で気づいたことがある。</p>
<p>「かぼちゃとさつまいもの、つるの張り合い」を書いたとき、そのまま訳すと、ただの植物の説明になった。</p>
<p>畑を知らない人には、何が面白いのか伝わらない。</p>
<p>対話しながら直すと、つる同士が場所を取り合う、あの少し滑稽な感じが、ようやく英語にも残った。</p>
<ul>
  <li>Google翻訳は速いが、文章の「味」が出ない。</li>
  <li>対話方式は文章の「味」を残せる。農業用語の扱いにも融通がきく。そして、語彙のレベルも読者に合わせられる。</li>
</ul>
<p>要するに、Google翻訳は「置き換え」。<br>対話方式は「編集」。</p>
<p>そのくらい違う。</p>
<p>佐藤農園のLPは、ただの農業情報ではない。</p>
<p>二十年、畑に立ってきた人間が、自分の言葉で農業を語る場所だ。</p>
<p>だから英語版も、正しいだけの英語にはしたくない。</p>
<p>「この人が書いた文章だな」と感じられる英語にしたい。</p>
<p>それが、このLPの価値だと思っている。</p>
""".strip()

BODY_EN = """
<p>At Sato Farms, we do not use Google Translate for our LP.</p>
<p>It is fast, convenient, and, to be fair, not bad at all.<br>But when we use it, the writing suddenly loses its flavor.</p>
<p>Small moments in the field.<br>The real feelings of a farmer.<br>The little bits of humor that slip out like an offhand remark.</p>
<p>Those things can easily disappear in a direct machine translation.</p>
<p>Here is an example.</p>
<p>I ate three of them. Maybe I was a little greedy.<br>But they were good. Really good.</p>
<p>The meaning is easy to translate.<br>But that little pause in the original can sound stiff in English.</p>
<p>When I work on the translation through conversation, I can adjust the wording and keep a natural rhythm for English readers.</p>
<p>This kind of adjustment does not come from a dictionary.</p>
<p>I noticed something else when I wrote about pumpkin vines and sweet potato vines fighting for space.</p>
<p>A direct translation turned it into a simple explanation of plants.</p>
<p>For someone who does not know much about farming, the funny part was lost.</p>
<p>But by talking through the meaning and adjusting the wording, we were able to keep that slightly silly image of the vines pushing each other for space.</p>
<ul>
  <li><strong>Google Translate is fast, but it can lose the flavor of the writing.</strong></li>
  <li><strong>Conversation-based translation can keep that flavor.</strong> It also gives us more flexibility with farming terms, and we can adjust the vocabulary to suit the reader.</li>
</ul>
<p>In short, <strong>Google Translate is “replacement.”</strong><br><strong>Conversation is “editing.”</strong></p>
<p>That is the difference.</p>
<p>Sato Farms' LP is not just a collection of farming information.</p>
<p>It is a place where a person who has stood in the fields for twenty years talks about farming in his own words.</p>
<p>So the English version should not be just correct English.</p>
<p>It should still sound like the person who wrote it.</p>
<p>That, I believe, is part of what makes this LP valuable.</p>
""".strip()


def page_ja() -> str:
    esc = H.escape(TITLE_JA)
    return f"""<!DOCTYPE html>
<html lang="ja" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{esc}｜佐藤農園ブログ">
  <link rel="alternate" hreflang="ja" href="{SLUG}.html">
  <link rel="alternate" hreflang="en" href="../../blog-en/notes/{SLUG}.html">
  <meta name="google" content="notranslate">
  <title>{esc}｜佐藤農園ブログ</title>
  <link rel="canonical" href="https://satofarms.com/blog/notes/{SLUG}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../style.css?v=21">
</head>
<body class="notranslate blog-page">
  <div id="top" class="page-top-anchor" tabindex="-1" aria-hidden="true"></div>
  <header class="header blog-header">
    <div class="header__inner">
      <a href="../../index.html" class="logo">佐藤農園<span>ブログ</span></a>
      <div class="header__tools">
        <div class="header__actions">
          <a href="../../blog-en/notes/{SLUG}.html" class="header__lang-btn" lang="en">English</a>
          <button class="nav-toggle" type="button" aria-label="メニューを開く" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <nav class="nav" aria-label="メインナビゲーション">
          <a href="../../index.html">トップ</a>
          <a href="../">ブログ</a>
          <a href="../#notes">独り言</a>
          <a href="../../index.html#contact" class="nav__cta">お問い合わせ</a>
        </nav>
      </div>
    </div>
  </header>
  <main>
    <article class="blog-article">
      <div class="container">
        <nav class="blog-breadcrumb" aria-label="パンくずリスト">
          <a href="../../index.html">トップ</a><span aria-hidden="true">/</span>
          <a href="../">ブログ</a><span aria-hidden="true">/</span>
          <span>独り言</span>
        </nav>
        <p class="blog-article__meta">
          <span class="blog-article__category">独り言</span>
          <time datetime="{DATE}">{DATE_JA}</time>
        </p>
        <h1 class="blog-article__title">{esc}</h1>
        <div class="blog-article__body">
{BODY_JA}
        </div>
        <nav class="blog-article__nav" aria-label="記事フッターナビ">
          <a href="../">← ブログ一覧へ</a>
          <a href="../../blog-en/notes/{SLUG}.html" lang="en">English</a>
        </nav>
      </div>
    </article>
  </main>
  <div class="blog-home-bar">
    <div class="container blog-home-bar__inner">
      <a class="blog-home-bar__btn" href="../../index.html">← 佐藤農園トップへ戻る</a>
    </div>
  </div>
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


def page_en() -> str:
    esc = H.escape(TITLE_EN)
    return f"""<!DOCTYPE html>
<html lang="en" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{esc} | Sato Farms Blog">
  <link rel="alternate" hreflang="en" href="{SLUG}.html">
  <link rel="alternate" hreflang="ja" href="../../blog/notes/{SLUG}.html">
  <meta name="google" content="notranslate">
  <title>{esc} | Sato Farms Blog</title>
  <link rel="canonical" href="https://satofarms.com/blog-en/notes/{SLUG}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&family=Noto+Serif:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../style.css?v=21">
</head>
<body class="notranslate blog-page">
  <div id="top" class="page-top-anchor" tabindex="-1" aria-hidden="true"></div>
  <header class="header blog-header">
    <div class="header__inner">
      <a href="../../index-en.html" class="logo">Sato Farms<span>Blog</span></a>
      <div class="header__tools">
        <div class="header__actions">
          <a href="../../blog/notes/{SLUG}.html" class="header__lang-btn" lang="ja">日本語</a>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <nav class="nav" aria-label="Main navigation">
          <a href="../../index-en.html">Home</a>
          <a href="../">Blog</a>
          <a href="../#notes">Notes</a>
          <a href="../../index-en.html#contact" class="nav__cta">Contact</a>
        </nav>
      </div>
    </div>
  </header>
  <main>
    <article class="blog-article">
      <div class="container">
        <nav class="blog-breadcrumb" aria-label="Breadcrumb">
          <a href="../../index-en.html">Home</a><span aria-hidden="true">/</span>
          <a href="../">Blog</a><span aria-hidden="true">/</span>
          <span>Notes</span>
        </nav>
        <p class="blog-article__meta">
          <span class="blog-article__category">Random Thoughts</span>
          <time datetime="{DATE}">{DATE_EN}</time>
        </p>
        <h1 class="blog-article__title">{esc}</h1>
        <div class="blog-article__body">
{BODY_EN}
        </div>
        <nav class="blog-article__nav" aria-label="Article footer">
          <a href="../">← Back to blog</a>
          <a href="../../blog/notes/{SLUG}.html" lang="ja">日本語</a>
        </nav>
      </div>
    </article>
  </main>
  <div class="blog-home-bar">
    <div class="container blog-home-bar__inner">
      <a class="blog-home-bar__btn" href="../../index-en.html">← Back to Sato Farms Home</a>
    </div>
  </div>
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


def main() -> None:
    ja_path = ROOT / "blog" / "notes" / f"{SLUG}.html"
    en_path = ROOT / "blog-en" / "notes" / f"{SLUG}.html"
    ja_path.write_text(page_ja(), encoding="utf-8")
    en_path.write_text(page_en(), encoding="utf-8")
    print("wrote", ja_path)
    print("wrote", en_path)


if __name__ == "__main__":
    main()
