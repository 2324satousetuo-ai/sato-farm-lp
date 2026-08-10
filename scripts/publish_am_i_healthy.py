# -*- coding: utf-8 -*-
"""Publish 2026-08-11 note: am-i-healthy."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "am-i-healthy"
DATE = "2026-08-11"
DATE_JA = "2026.8.11"
DATE_EN = "August 11, 2026"
TITLE_JA = "健康か？"
TITLE_EN = "Am I Healthy?"

BODY_JA = """
<p>健康でなければ、畑に立てない。<br>しかし、あまり元気ではない。持病もいろいろある。いつ脳梗塞で倒れるか。それが、いつも心配だ。</p>
<p>だからこそ、健康管理が欠かせない。<br>朝、コップ一杯の水を飲む。同時に、一包のサプリを飲む。そして、早朝の畑に立とうと努める。<br>夜型人間なので、なかなか難しい。それでも、ときどき朝5時前に畑に立てる。そんな朝は、これ以上ない健康の証のように感じる。</p>
<p>良いと分かっていても、できないこともある。<br>白湯だ。妻はよく飲んでいる。健康的だそうだが、うまいと思ったことがない。だから、飲まない。<br>酒は好きだ。毎日、少量飲む。休肝日ができているかは、正直あやしい。<br>食事は三食が基本。自家製の米と野菜をベースに、妻の献立には全幅の信頼を寄せている。</p>
<p>炎天下の畑にも、立たないわけにはいかない。<br>雑草との格闘で、昨夏は二度ほど嘔吐した。一昨年はスキー場で極度のめまいに襲われ、倒れた。<br>「終わった」そう感じた瞬間だった。<br>それでも、この冬はほぼ100日、スキー場に立った。<br>だから、まだ大丈夫なのだろう。</p>
<p>健康へのこだわりも、それなりにある。<br>飲料水は、高価な浄水器を通した水を飲んでいる。これが実にうまい。米の研ぎ汁にも、この水を使う。<br>サプリは飲み始めて、5年ほどになる。<br>長い間、小馬鹿にしていた。サプリなんて必要ない。そう思っていた。<br>しかし今は、シニアの健康維持には、一つくらい頼れるものがあってもいい。そう考えるようになった。<br>これも、決して安くはない。それでも、自分に合うものに出会えた。ありがたいことだ。</p>
<p>完璧な健康ではない。<br>むしろ、不安を抱えながらの毎日だ。<br>それでも、こうして今日も畑に立つ。<br>田んぼにも立つ。</p>
<p>それが、今の自分にとっての健康なのだと思う。</p>
""".strip()

BODY_EN = """
<p>If I am not healthy, I cannot work in the fields.<br>But to be honest, I am not always in good shape. I have several health problems. I am always worried that I might have a stroke one day.</p>
<p>That is why I try to take care of my health.<br>In the morning, I drink a glass of water. At the same time, I take one pack of supplements.<br>Then I try to go out to the fields early in the morning.<br>I am a night person, so getting up early is not easy for me.<br>Still, sometimes I can stand in the fields before 5 a.m. On such mornings, I feel that I am truly healthy.</p>
<p>There are also things that I know are good for me, but I just cannot do them.<br>One example is hot water.<br>My wife often drinks it. She says it is good for her health. But I have never thought it tasted good.<br>So I don't drink it.</p>
<p>I like alcohol. I drink a small amount every day. To be honest, I am not sure if I have enough days without alcohol.</p>
<p>Eating three meals a day is also important. I mainly eat rice and vegetables that we grow ourselves. And I trust my wife's cooking completely.</p>
<p>Even on very hot days, I have to work in the fields.<br>Last summer, I vomited twice while fighting weeds in the heat.<br>The year before that, I had a very bad dizzy spell at the ski resort and fell down.<br>For a moment, I thought, "This is the end."</p>
<p>Even so, I worked at the ski resort for almost 100 days last winter.<br>So, I guess I am still doing OK.</p>
<p>I also have a few things I care about when it comes to my health.<br>For drinking water, I use an expensive water filter. The water tastes really good. I even use this water when I wash our rice.<br>I started taking supplements about five years ago.<br>For many years, I made fun of people who took them. I thought supplements were not necessary.<br>But now I think that, as I get older, it is good to have at least one thing that I can trust for my health.<br>They are not cheap, but I found one that works well for me.<br>I am thankful for that.</p>
<p>I am not perfectly healthy.<br>In fact, I live with some worries about my health.</p>
<p>Even so, I still stand in the fields every day.<br>I still stand in the rice fields, too.</p>
<p>I think that is what being healthy means to me now.</p>
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
