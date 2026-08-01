# -*- coding: utf-8 -*-
"""Publish 2026-08-01 note: tilling-dotcom."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "tilling-dotcom"
DATE = "2026-08-01"
DATE_JA = "2026.8.1"
DATE_EN = "August 1, 2026"
TITLE_JA = "畑を耕すように、ドットコムを耕す"
TITLE_EN = "Growing a Dot-Com Like Growing a Field"

BODY_JA = """
<h2>Netlifyという、最初の畑</h2>
<p>ホームページを始めたとき、最初に借りたのはNetlifyという「無料の畑」だった。ドラッグ&amp;ドロップ一つで、世界に公開できる。プログラミング初心者の私には、十分すぎるほどありがたい仕組みだった。</p>
<p>ところが、ある日突然、その畑に「そろそろ地代をいただきます」という知らせが届いた。無料で始めたはずが、気づけば課金の通知。シニアの私には、なかなかの衝撃だった。</p>
<h2>乗り換え先を探して</h2>
<p>このまま払い続けるのか。それとも、別の場所に引っ越すのか。調べているうちに出会ったのが、Cloudflareという新しい畑だった。GitHubというところにコードを預けておけば、そこから自動でホームページを公開してくれるという。GitHubは、いわば畑のそばにある“倉庫”のようなものだ。種（コード）をそこに保管しておけば、Cloudflareがそれを畑にまいて育ててくれる。</p>
<p>言葉にすれば簡単だ。だが、実際はそう簡単ではない。ターミナルという黒い画面に向かい、<code>git</code>という呪文のようなコマンドを何度も打ち込んだ。文字が反応しない、押しても動かない、突然古い内容が表示される――トラブルの連続だった。それでも一つひとつ確かめながら、なんとかGitHubとCloudflareを繋ぎ、無事に新しい畑へ引っ越すことができた。</p>
<h2>旗を立てる</h2>
<p>引っ越しが一段落したところで、もう一つ大きな決断をした。<strong>satofarms.com</strong>という、自分だけのドメイン(住所)を取得したのだ。商才があるわけではない。何をするか、明確な計画があるわけでもない。それでも、ホームページを育てていく上で、自分の住所を持つことは、ごく自然な流れだと思えた。</p>
<p>ドットコムは、ビジネスプランではない。旗である。「私はここに立っている」。その意思を示す旗だ。まず旗を立てる。何が始まるのかは、その先で見えてくる。</p>
<h2>この1週間、両方の畑を同時に耕してみた</h2>
<p>そして、今、Cloudflareのほうに一本化した。無料に戻ったことになる。</p>
<h2>この一本道の、その先に</h2>
<p>satofarms.comは、今はまだ一枚のランディングページに過ぎない。しかし、この住所を起点に、いくつか夢が描けている。</p>
<p>畑と田んぼの記録を、日本語だけでなく英語でも綴っていく。海外の誰かが、これをきっかけに中之条を、四万温泉を訪ねてきてくれるかもしれない。「日本の米づくりは、こんなにも美しいのか」と、驚いてくれる日が来るかもしれない。</p>
<p>将来的には、音声で話した言葉が、AIの力を借りてそのまま記事になる。そんな仕組みも思い描いている。農作業の合間にひと言つぶやくだけで、記事が公開される――そんなことも、やがて可能になるかもしれない。</p>
<p>もちろん、これらはまだ仮説の域を出ない。夢物語に終わるかもしれない。それでも、挑戦しなければ、可能性はゼロのままだ。</p>
<p>畑仕事も、ホームページ作りも、似ている。種をまき、水をやり、雑草を抜き、気長に育てる。今日もまた一つ、小さな作業を積み重ねながら、satofarms.comという畑を耕している。</p>
""".strip()

BODY_EN = """
<h2>My First Field: Netlify</h2>
<p>When I started my website, my first home was a free service called <strong>Netlify</strong>. It let me publish my website to the world with a simple drag and drop. For a beginner like me, it was a wonderful tool.</p>
<p>Then one day, I received a message saying it was almost time to pay. I thought it would stay free, so the notice came as a surprise. For a senior beginner like me, it was quite a shock.</p>
<h2>Looking for a New Home</h2>
<p>Should I keep paying? Or should I move to a new place?</p>
<p>While looking for another option, I found <strong>Cloudflare</strong>. I learned that if I saved my website files on <strong>GitHub</strong>, Cloudflare could publish my website automatically.</p>
<p>GitHub is like a storage shed beside the field — you keep your seeds (your code) there, and Cloudflare plants them for you. It sounded easy.</p>
<p>But it was not.</p>
<p>I spent many hours looking at the black Terminal screen and typing strange <code>git</code> commands again and again. Sometimes nothing happened. Sometimes the screen showed old files. Sometimes I only saw error messages.</p>
<p>Even so, I checked each problem one by one. In the end, I successfully connected GitHub and Cloudflare and moved my website to its new home.</p>
<h2>Raising My Flag</h2>
<p>After the move, I made another important decision.</p>
<p>I bought my own domain name: <strong>satofarms.com</strong><br>A domain name is like an address on the Internet.</p>
<p>I am not a business expert. I do not have a perfect plan for the future.<br>Still, having my own address felt like the right next step.</p>
<p>A dot-com is not just a business plan.<br>It is a flag. It says, <strong>“I am here.”</strong><br>First, you raise the flag.<br>What comes next will reveal itself over time.</p>
<h2>One Week with Two Fields</h2>
<p>For one week, I kept both websites running: the old one on Netlify and the new one on Cloudflare (satofarms.com). Today, I decided to move everything to Cloudflare. <strong>In doing so, I returned to a fully free setup once again.</strong></p>
<h2>The Road Ahead</h2>
<p>Right now, <strong>satofarms.com</strong> is only a simple landing page.<br>But I already have many dreams for it.</p>
<p>I want to write about my rice fields and vegetable gardens in both Japanese and English.<br>Maybe someone from another country will read my stories and decide to visit Nakanojo or Shima Onsen.<br>Maybe someone will think,<br><em>“Rice farming in Japan is so beautiful.”</em></p>
<p>In the future, I also hope to use AI.<br>I dream of speaking into my phone while working in the fields, and having my words become a blog post automatically.<br>Maybe that day is not so far away.</p>
<p>Of course, these are still only ideas.<br>They may never become reality.<br>But if I never try, the chance will always be zero.</p>
<p>Farming and building a website are very similar.<br>You plant seeds. You water them. You pull the weeds.<br>Then you wait with patience.</p>
<p>Today, I am still taking one small step at a time, growing <strong>satofarms.com</strong> just as I grow my fields.</p>
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
  <link rel="stylesheet" href="../../style.css?v=18">
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
  <link rel="stylesheet" href="../../style.css?v=18">
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
