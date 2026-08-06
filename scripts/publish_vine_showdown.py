# -*- coding: utf-8 -*-
"""Publish 2026-08-07 note: vine-showdown."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "vine-showdown"
DATE = "2026-08-07"
DATE_JA = "2026.8.7"
DATE_EN = "August 7, 2026"
TITLE_JA = "畑のツル選手権！カボチャVSさつまいも"
TITLE_EN = "The Great Vine Showdown: Pumpkin vs. Sweet Potato"

BODY_JA = """
<p><strong>ツルの伸び方でわかる働き方の流儀</strong></p>
<p>カボチャは、種から蒔いた。さつまいもは、苗を買ってきた。<br>スタート地点からして、もう違う。</p>
<p>一方は土に種を落とすところから始まる正真正銘の「生え抜き」。もう一方は、よそで育ててもらった苗を連れてくる「中途採用組」。<br>なのに、畑に並べば同じように地面を這うツル植物。<br>「お前たち、本当に親戚か？」<br>そう聞きたくなるほど、ここから先の生き方がまったく違う。</p>
<p>カボチャとさつまいも。どちらも地面を這うツル植物。だが夏の畑を歩くと、まるで別の生き物を育てているような気になる。</p>
<p>まずカボチャ。まるで『拡大路線の企業』のような性格だ。<br>朝、畑に行くと、昨日よりツルが伸びている。「おはよう」と声をかける間もなく、もう隣の畝まで進出している。節という節から根を下ろし、「本社移転しました」「新支店オープンしました」と、節から根を下ろし、どんどん新しい“支店”を増やしていく。<br>止める術はない。というより、止めてはいけない。<br>カボチャの世界では、伸びること＝稼ぐことだ。ツルが長くなればなるほど、葉が増え、光合成が進み、実が育つ。まさに「攻めの経営」。農家は黙って見守るしかない。むしろ「その調子だ、もっと行け」と応援団になる。</p>
<p>一方のさつまいも。こちらは方向性がまるで違う。<br>こいつも負けじとツルを伸ばすのだが、目的地が謎だ。「あっちに畝の隙間がある」「こっちに日当たりの良さそうな場所がある」と、まるで散歩感覚でふらふら広がっていく。葉はワサワサ茂り、見た目だけは元気いっぱい。<br>だが、この「元気」が曲者なのだ。<br>さつまいもは、ツルの節から根を出す癖がある。地面に根を張ってしまうと、そこにも栄養が流れ始める。すると本来イモに集まるはずの養分が、あちこちに分散してしまう。<br>つまり、地上で寄り道すればするほど、本業のイモづくりが細ってしまう。まるで副業に手を出しすぎて本業の売上が落ちる人みたいな話である。<br>だから農家は、このツルを容赦なく引っぺがす。<br>「ツル返し」という、いわば強制送還作業だ。<br>伸びた先で根を下ろそうとしていたツルを、えいやっと持ち上げて向きを変える。さつまいも本人にしてみれば、<br>「せっかく良い場所を見つけたのに！」<br>と抗議したいところだろう。だが農家は容赦しない。「お前の仕事は地下だ、地上で油を売るな」と。</p>
<p>面白いのは、この正反対の性格が、そのまま秋の収穫に直結することだ。<br>カボチャは、地上でのツルの活躍がそのまま実の大きさに比例する。伸びた分だけ、稼いだ分だけ、実る。わかりやすい成果主義。<br>さつまいもは逆で、地上のツルを抑え込めば抑え込むほど、地下でどっしり太る。地味な我慢が、秋にゴロゴロとしたイモになって返ってくる。<br>同じ「ツルを伸ばす」という行為なのに、片方は褒められ、片方は叱られる。こんな理不尽な話があるだろうか。<br>だが考えてみれば、人間社会も似たようなものかもしれない。<br>前へ前へと突き進んで結果を出すタイプもいれば、余計な動きを抑えて、じっくり地力を蓄えるタイプもいる。<br>佐藤農園の畑は、性格の違う社員をうまく活かす名経営者のようだ。どちらも秋には、堂々とした姿で収穫の時を迎える。</p>
""".strip()

BODY_EN = """
<p><strong>How a Vine Grows Reveals a Way of Working</strong></p>
<p>The pumpkin starts from a seed. The sweet potato starts from a purchased seedling. A "homegrown" worker and a "new hire," yet both end up crawling across the same field.</p>
<p>But from here on, their personalities split completely.</p>
<p>The pumpkin is an aggressive "expansion company." Every morning its vine is longer, crossing into the next row and dropping roots at every joint—opening new "branch offices." The more it spreads, the more leaves it makes, the more sunlight it captures, and the bigger the pumpkins grow. All the farmer can do is cheer.</p>
<p>The sweet potato wanders. It stretches its vine toward sunny spots or open spaces, looking lively. But each joint tries to root, pulling nutrients away from the tuber underground. So the farmer performs "vine turning"—picking up the vine and flipping it back before it can settle in the wrong place. The sweet potato might protest, "But I found such a nice spot!"—but its real job is underground.</p>
<p>These opposite styles lead to opposite harvests. Pumpkins reward above-ground growth—more vine, more fruit. Sweet potatoes reward restraint—less wandering, bigger tubers.</p>
<p>The same act—growing a vine—earns praise for one and scolding for the other. People are similar: some succeed by charging forward, others by quietly building strength.</p>
<p>Sato Farms knows how to bring out both types. And come autumn, each plant shows its best.</p>
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
