# -*- coding: utf-8 -*-
"""Publish 2026-08-08 note: corn-civet."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "corn-civet"
DATE = "2026-08-08"
DATE_JA = "2026.8.8"
DATE_EN = "August 8, 2026"
TITLE_JA = "とうもろこし――ハクビシンとの知恵比べ"
TITLE_EN = "Corn — A Battle of Wits with the Civet"

BODY_JA = """
<p>昨日、妻が採れたてのハニーバンタムを五本もらってきた。欲張って三本食べた。うまかった。文句なしに、うまかった。だから、毎年作ってきた。ところが、今年は作らなかった。理由は、毎度のことだ。ハクビシンである。</p>
<p>とうもろこしは、育つ姿を見るのが楽しい。葉が伸び、実が膨らみ、ひげ（絹糸）が黒くなってくる。「そろそろ採れるぞ」と、毎朝畑へ行くのが楽しみになる。</p>
<p>ところが、ここからが問題だ。「明日あたり、採れるかな」そう思って翌朝、畑へ行く。ない。正確には、あるにはある。しかし、無残な姿だ。実はかじられ、畑は荒らされ、ほぼ全滅。</p>
<p>「何匹来たんだ」犯人はハクビシン。一匹なのか、二匹なのか。それとも大集団なのか。夜のことなので、こちらには分からない。</p>
<p>ただ、相手はかなりの知恵者だ。ネットを張れば下から穴を掘る。穴をふさげば、今度はネットを食い破る。こちらが一手打つと、向こうは二手先を行く。電線を渡っている姿を見たこともある。まったく、どこからでも来る。</p>
<p>何年もやられてきた。迷ったあげく、今年はとうとう白旗をあげた。作るのを休んだ。</p>
<p>だから、今年の五本は、よそからいただいたものだ。ありがたく味わって食べた。</p>
<p>先日、地元の長老からハクビシン退治の話を聞いた。罠を仕掛け、餌にはリンゴを使う。それで何匹も捕まえたという。これはぜひ、もっと詳しく教わらねばならない。</p>
<p>そして、もう一つ、自分なりにたどり着いた答えがある。新聞紙だ。実が膨らみ始めたら、早めにひとつひとつ新聞紙で包んで隠す。地味な作戦だが、今のところこれが一番効く。</p>
<p>ハクビシンとの知恵比べ。来年は新聞紙の城を築いて、もう一度挑んでみよう。</p>
<p>なにしろ、とうもろこしは、うまい。三本食べてしまった男が言うのだから、間違いない。</p>
""".strip()

BODY_EN = """
<p>Yesterday, my wife came home with five freshly picked ears of Honey Bantam corn.<br>I got greedy and ate three.<br>They were delicious.<br>No doubt about it. They were really good.<br>That is why I have grown corn every year.<br>But not this year.<br>The reason is the same as always.<br>The civets (the masked palm civet, a clever nocturnal visitor in our area).</p>
<p>There is something special about watching corn grow. The leaves get taller, the ears begin to swell, and the silks slowly turn dark. Every morning, I look at them and think, “Maybe I can pick them tomorrow.”</p>
<p>But that is where the trouble begins.<br>“Maybe tomorrow.”<br>The next morning, I go to the field.<br>Nothing.<br>Well, not exactly nothing— but nothing worth calling corn anymore.<br>The corn is still there.<br>But it has been destroyed.<br>The ears have been chewed, the field has been messed up, and almost everything is gone.</p>
<p>“How many came here last night?”<br>The culprits are civets.<br>One? Two? Or maybe a whole gang?<br>I have no idea. It happens at night.</p>
<p>But one thing is certain.<br>They are clever.<br>Put up a net, and they dig a hole underneath it.<br>Block the hole, and they chew through the net.<br>I make one move, and they make two.<br>I have even seen one walking along an electric wire.<br>They seem to be able to come from anywhere.</p>
<p>I have been fighting them for years.<br>That is why corn has become one of the crops where my hard work is least likely to pay off.<br>After much hesitation, I finally raised the white flag this year.<br>I stopped growing corn.</p>
<p>So the five ears we had this year came from someone else's field.<br>I was very grateful, and I enjoyed every bite.</p>
<p>One month ago, a local old-timer told me about his way of dealing with civets.<br>He sets traps and uses apples as bait.<br>He says he has caught quite a few of them that way.<br>I definitely need to learn more about how he does it.</p>
<p>And I have found another solution of my own.<br>Newspaper.<br>As soon as the ears begin to swell, I cover each one with newspaper so the civets cannot see them.<br>It is a very simple strategy.<br>But so far, it works better than anything else I have tried.</p>
<p>The battle of wits with the civets is not over.<br>Next year, I think I will build a castle of newspapers and give it another try.</p>
<p>After all, corn is delicious.<br>I should know.<br>I ate three ears myself.</p>
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
