# -*- coding: utf-8 -*-
"""Publish 2026-08-05 note: cucumber-eggplant (local preview; push separately)."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "cucumber-eggplant"
DATE = "2026-08-05"
DATE_JA = "2026.8.5"
DATE_EN = "August 5, 2026"
TITLE_JA = "夏の主役、キュウリとナス ― 似て非なる二人の物語"
TITLE_EN = "The Stars of Summer: Cucumber and Eggplant — Similar, Yet So Different"

FIGURE_JA = """
<figure class="blog-article__figure">
  <img src="../../images/yasai01.jpg" alt="収穫したキュウリとナス、そしてかぼちゃの花" width="1200" height="675" loading="lazy">
  <figcaption>左：収穫したキュウリとナス　／　右：かぼちゃの花</figcaption>
</figure>
""".strip()

FIGURE_EN = """
<figure class="blog-article__figure">
  <img src="../../images/yasai01.jpg" alt="Harvested cucumbers and eggplants, and a pumpkin flower" width="1200" height="675" loading="lazy">
  <figcaption>Left: harvested cucumbers and eggplants / Right: a pumpkin flower</figcaption>
</figure>
""".strip()

BODY_JA = f"""
<p>夏野菜といえば、キュウリとナス。どちらもアジア生まれで、歴史が古く、調理の幅も広い。何より、体を冷やしてくれる夏の救世主という点で、まるで幼馴染のように気が合う。</p>
<p>しかし、性格まで同じとは限らない。</p>
{FIGURE_JA}
<p>キュウリはウリ科で、生まれながらの「生食派」。果実の九割以上が水分という、ほとんど飲み物のような野菜だ。栄養は控えめだが、かじった瞬間の清涼感は唯一無二。サラダでも浅漬けでも、とにかく「生」でこそ輝く。</p>
<p>一方、ナスはナス科で根っからの「加熱派」。油との相性が抜群で、炒めれば旨味がとろりと溶け出す。皮にはポリフェノールが詰まっているので、「皮ごと」が基本。焼いても揚げても煮ても美味しい、懐の深い役者だ。</p>
<p>育て方も対照的だ。キュウリはつる性で、支柱に絡ませる「誘引」が欠かせない。ナスは直立性で、「三本仕立て」を基本に脇芽を整理しながら形を整える。共通点は、水分管理と定期的な追肥が命綱ということ。肥料切れはすぐに実付きに響き、少し手を抜けばたちまち機嫌を損ねる。</p>
<p>我が家の畑では今、ナスが「更新剪定」の時期。夏の盛りを過ぎて収量が落ちてきたら、思い切って枝を切り戻し、秋まで長く収穫を続ける。遅まきのナスも今まさに成長中だ。キュウリもこまめな水やりが欠かせない。怠ればすぐ曲がったり苦味が出たりする。「今日はいいや」が通用しない野菜である。</p>
<p>食べ方は正反対。キュウリは「生で爽やかに」、ナスは「加熱で旨味を引き出す」。それでも、漬物や和え物に使える点は共通している。ぬか漬けにすれば、どちらも栄養価がぐんと上がる。栄養面でも、キュウリは「水分中心で控えめ」、ナスは「ポリフェノールを含む抗酸化野菜」と住み分けがはっきりしている。</p>
<p>つる性と直立性。生食と加熱。挙げればきりがないほど違う二人だ。それでも同じ夏に、同じ畑で、同じように水を欲しがりながら育っている。似ているようで違い、違うようで似ている。案外、いいコンビなのだ。</p>
<p>食卓に並べば、キュウリのシャキシャキとナスのとろり。夏の食卓は、この対照的な二人がいてこそ完成する。今年もどちらも、しっかり育てていきたい。</p>
""".strip()

BODY_EN = f"""
<p>When people think of summer vegetables, cucumbers and eggplants often come first. They are almost like childhood friends. Both came from Asia, both have a long history, and both can be cooked in many ways. Most of all, they help cool our bodies during the hot summer.</p>
<p>But their personalities are not the same.</p>
{FIGURE_EN}
<p>The cucumber belongs to the gourd family. It is a vegetable made for eating fresh. More than 95% of it is water, so it is almost like a drink. It does not have many nutrients, but its cool and crisp taste is special. It shines in salads and simple Japanese pickles.</p>
<p>The eggplant belongs to the nightshade family. It is at its best when cooked. It goes very well with oil, and cooking makes it soft and full of flavor. The skin has many healthy polyphenols, so it is good to eat it with the skin on. Eggplants taste great grilled, fried, or simmered.</p>
<p>They also grow in very different ways. Cucumbers are climbing plants and need poles or strings to grow upward. Eggplants grow upright, and farmers usually keep three main stems and remove extra shoots. But they share one important point: both need careful watering and regular fertilizer. If they do not get enough water or food, they quickly stop producing good fruit.</p>
<p>In our field, the eggplants are now in the stage of renewal pruning. When the harvest becomes smaller in late summer, we cut back many branches so the plants can keep producing until autumn. Younger eggplants are also growing well. Cucumbers need daily care too. Without enough water, they become bent or bitter. They never accept the idea of “Maybe tomorrow.”</p>
<p>People eat them in very different ways. Cucumbers are best fresh, while eggplants become delicious after cooking. Still, they share something: both are good for pickles and Japanese dressed dishes. When made into rice-bran pickles, their nutritional value becomes even higher. Nutritionally, cucumbers are mostly water, while eggplants contain antioxidant polyphenols.</p>
<p>One climbs. One stands tall. One is best raw. The other is best cooked. They are different in many ways. Yet they grow together in the same field, in the same summer, asking for the same water and care. They are different, but also alike. They make a great team.</p>
<p>On the dinner table, cucumbers are crisp and refreshing, while eggplants are soft and rich. Summer meals would not be complete without both of them. This year again, I will grow them with care.</p>
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
