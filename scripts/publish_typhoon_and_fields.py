# -*- coding: utf-8 -*-
"""Publish 2026-08-13 note: typhoon-and-fields."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "typhoon-and-fields"
DATE = "2026-08-13"
DATE_JA = "2026.8.13"
DATE_EN = "August 13, 2026"
TITLE_JA = "台風の非常識と、畑の正直さ"
TITLE_EN = "The Unusual Typhoon and the Honesty of the Fields"

BODY_JA = """
<p>台風15号が茨城県に初上陸した。しかも東から西へという、教科書の常識を裏切る進路。台風一過の青空もなく、雨だけがじわじわ降り続く。ニュースでは大きな被害を受けた地域も映し出され、胸が痛む。</p>
<p>一方、中之条は幸いだった。風雨は荒れず、乾ききった畑にはようやくの恵みの雨。自然は同じ台風でも、場所によってまるで別の顔を見せる。つくづく、人間の都合で語れる相手ではない。</p>
<p>雨が降る前、秋野菜に向けて除草した畑は、乾燥しすぎてボコボコだった。雨乞いしても降らなかった空が、台風とともにようやく応えてくれた。台風を挟んで昨日今日と、引き続き除草作業を進めている。</p>
<p>藪に埋もれていた、さやえんどうの種取りも同時進行だ。雨に濡れて地面に落ちれば、せっかく熟した種がすぐ芽を出してしまう。10月に播く予定の種だから、一さやずつ救い出す。面倒だが、次につながる大事な仕事だ。</p>
<p>そしてキュウリ。手塩にかけてきた一本が、突然枯れた。明らかに異変だ。株元を掘れば、根切り虫が潜んでいるはず。放置すれば次の苗もやられる。一株の異変を見逃さないことが、被害を広げない唯一の知恵になる。</p>
<p>続く台風17号も大型で、再び関東直撃の気配を見せている。自然が「常識通り」に動くとは限らない。雨にも風にも備えるが、自然を人の都合で動かすことはできない。</p>
<p>出穂し、これから登熟に向かう田んぼも心配だ。天候に支配され、虫に振り回され、それでも田畑を見回る。農業とは、そんな毎日の積み重ねだ。</p>
<p>だからこそ、固定観念に頼らない。「例年こうだから」ではなく、今年はどうなのかを自分の目で確かめる。</p>
<p>畑は今日も教えてくれる。<br><strong>常識を疑え。そして、自分の目で確かめろ。</strong> 農業は、教科書だけではできない。</p>
""".strip()

BODY_EN = """
<p>Typhoon No. 15 made landfall in Ibaraki Prefecture for the first time. What was even more unusual was its path—from east to west, going against what we normally expect from a typhoon. There was no clear blue sky after the storm. Instead, the rain just kept falling slowly. The news showed areas that had suffered serious damage, and it was painful to watch.</p>
<p>Fortunately, Nakanojo was spared. The wind and rain were not severe, and for our fields, the rain was a long-awaited gift. Even the same typhoon can show a completely different face depending on the place. Once again, I feel that nature is not something we can understand only from a human point of view.</p>
<p>Before the rain came, the fields I had cleared of weeds for the autumn vegetables were extremely dry and rough. I had been waiting and waiting for rain, but the sky would not answer. Finally, the typhoon brought the rain we needed. Even with the typhoon between yesterday and today, I have continued clearing weeds in the fields.</p>
<p>At the same time, I am collecting seeds from peas that had been hidden in the bushes. If the seeds get wet and fall onto the ground, the ripe seeds may quickly start to grow. These seeds are for planting in October, so I have to rescue the pods one by one. It is a tedious job, but it is important work for the next season.</p>
<p>And then there are the cucumbers. One plant that I had carefully grown suddenly died. Something was clearly wrong. If I dig around the base of the plant, I will probably find a cutworm. If I leave it alone, the next plant may suffer the same fate. Noticing even one sick or dying plant can help prevent the problem from spreading.</p>
<p>Typhoon No. 17 is also large and appears to be heading toward the Kanto region again. Nature does not always move as we expect. We can prepare for rain and wind, but we cannot make nature follow our plans.</p>
<p>I am also worried about the rice fields. The rice has begun to produce ears, and the grains are now entering the stage when they start to fill. Weather at this time is very important.</p>
<p>Farmers are controlled by the weather, troubled by insects, and still go out every day to check the fields. That is farming. It is a daily accumulation of small observations and decisions.</p>
<p>That is why I do not want to depend too much on fixed ideas. Instead of thinking, “This is how it usually happens,” I want to look carefully and ask, “What is happening this year?”</p>
<p>The fields teach me something every day.</p>
<p>Question what you think you know. And see for yourself.</p>
<p>Farming cannot be done by following a textbook alone.</p>
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
