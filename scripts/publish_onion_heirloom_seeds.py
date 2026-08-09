# -*- coding: utf-8 -*-
"""Publish 2026-08-10 note: onion-heirloom-seeds."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "onion-heirloom-seeds"
DATE = "2026-08-10"
DATE_JA = "2026.8.10"
DATE_EN = "August 10, 2026"
TITLE_JA = "玉ねぎの種購入：固定種に決めた"
TITLE_EN = "Buying Onion Seeds: I Chose Heirloom Varieties"

BODY_JA = """
<p>今年は玉ねぎの種を買う予定など、まったく無かった。ところが今、方針は大きく変わった。<strong>種は買う。しかも、固定種限定でいく。</strong></p>
<p>その決意を静かに固めることになったのは、畑で立ち尽くした、あの一瞬の出来事がきっかけだった。</p>
<p>花は咲いた。茎もしっかり上がった。風に揺れる花房は、まるで「今年もちゃんとやりますよ」と語りかけてくるようだった。ところが──玉がない。種房（しゅぼう）の中が、驚くほど静かで、空っぽだった。その静けさが胸に残り、私はしばらく畑の真ん中で動けなかった。ただ、風の音だけが耳に入ってきた。</p>
<p>思い返せば、一昨年の秋にまいた種袋の玉ねぎは、昨春に見事な大収穫となった。その勢いで、収穫した球の一部を植え直し、初めての自家採種に挑戦した。黒い種がざらざらと落ちるあの感触は、農家にとって小さな歓びだ。</p>
<p>「玉ねぎは自家採種でいける」──そう思ったのは自然な流れだった。その種を昨年の秋にまくと、また今春には大収穫。二代目も力強く育ち、畑はにぎやかだった。</p>
<p>「佐藤農園の玉ねぎは、このサイクルで続けられる」そう信じて疑わなかった。そしてこの夏。三代目の種取りに挑んだ私は、冒頭の“空っぽの花房”に出会ったという次第だ。花は咲く。茎は立つ。なのに、種房だけが静かに欠けている。黒い種が一粒もない。まるで玉ねぎが「そろそろ別の道を選びなさい」と静かに告げてきたようだった。</p>
<p>調べてみると、これは玉ねぎの<strong>F1の宿命</strong>。一代目は力が強く、二代目もなんとか踏ん張る。しかし三代目になると、花を咲かせる力はあっても、“種をつくる力”がふっと消えてしまう。自然の摂理は、時に静かで、時に厳しい。農業は、思い通りにならないところが面白い。</p>
<p>今年の玉ねぎが見せた“静かな空白”を受け止め、私は決めた。この秋は固定種をまく。昔ながらの、世代を重ねても揺らがない玉ねぎだ。</p>
<p>来年の春、畑に立つとき、どんな姿を見せてくれるだろうか。</p>
<p>佐藤農園の玉ねぎは、ここから新しい物語に入る。</p>
<p>（固定種：<strong>札幌黄</strong>・<strong>泉州黄玉葱</strong>・<strong>愛知赤玉葱</strong>）</p>
<p>（F1は、違う性質を持つ親を掛け合わせて作った「最初の世代」。そのF1から種を採ると、F2（2代目）になる。さらに種を採れば、<strong>F3（3代目）</strong>。）</p>
""".strip()

BODY_EN = """
<p>I had no plan to buy onion seeds this year. But now my plan has changed. <strong>I will buy seeds. And I will choose heirloom varieties only.</strong></p>
<p>This decision came from one moment in my field.</p>
<p>The onions had flowers. The stalks were strong and tall. The round flower heads moved gently in the wind. They looked as if they were saying, “We are doing well again this year.”</p>
<p>But then—<strong>there were no seeds.</strong> The seed heads were completely empty.</p>
<p>I was shocked. I stood in the middle of the field and could not move. Only the sound of the wind reached my ears.</p>
<p>Two autumns ago, I planted onion seeds from a seed packet. The next spring, I had a great harvest. So I planted some of the onions again and tried to collect my own seeds for the first time.</p>
<p>When the black seeds fell into my hand, I felt a small joy. I thought, “I can grow onions from my own seeds. I can keep doing this.”</p>
<p>I planted those seeds last autumn. Again, I had a good harvest this spring. The second generation grew well, and the field was full of strong onions.</p>
<p>I believed that <strong>Sato Farms</strong> could continue growing onions in this cycle.</p>
<p>Then came this summer.</p>
<p>I tried to collect seeds from the third generation. And I found the empty flower heads. The flowers were there. The stalks were strong. But there were no seeds. Not even one black seed.</p>
<p>It felt as if the onions were quietly saying: “It is time to choose another way.”</p>
<p>I learned something important. F1 onions grow very well in the first generation. The second generation may still grow fine. But the third generation often cannot make seeds. This is the nature of F1 plants.</p>
<p>Farming is interesting because things do not always go as planned.</p>
<p>So I made my decision. This autumn, I will plant heirloom onion seeds. They are old varieties that can make seeds again and again.</p>
<p>Next spring, when I stand in the field, what will I see? <strong>A new story for Sato Farms’ onions begins here.</strong></p>
<h2>Heirloom varieties</h2>
<ul>
  <li><strong>Sapporo Yellow</strong></li>
  <li><strong>Senshu Yellow</strong></li>
  <li><strong>Aichi Red</strong></li>
</ul>
<h2>About F1</h2>
<ul>
  <li><strong>F1</strong> is the <em>first generation</em>, made by crossing two plants with different qualities.</li>
  <li>Seeds from F1 plants become <strong>F2</strong>.</li>
  <li>Seeds from F2 plants become <strong>F3</strong>.</li>
</ul>
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
