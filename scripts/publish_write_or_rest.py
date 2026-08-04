# -*- coding: utf-8 -*-
"""Publish 2026-08-04 note: write-or-rest."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "write-or-rest"
DATE = "2026-08-04"
DATE_JA = "2026.8.4"
DATE_EN = "August 4, 2026"
TITLE_JA = "書きたいなら書けばいい。書きたくないなら、ペンを放り出して休めばいい。"
TITLE_EN = "If you want to write, write. If you don't want to write, put down your pen and rest."

BODY_JA = """
<p>ホームページを立ち上げ、記事が増え、格納庫としてブログを作った。そこまでは確かに機能している。しかし、この先を考えると、視界が急に曇る。「農園ブログ」と題して思いを綴り始めたものの、方向の定まらない独り言に意味があるのか——そう迷い始めた。その迷いを、Claude、Gemini、Copilot、ChatGPTにぶつけた。少しやり取りしたあと、「再度、厳しく指摘してください」と送った。</p>
<p>Geminiの返答は、こうだった。</p>
<blockquote>
<p>目を覚ましてください。一体何を迷っているのですか。アクセス数が2500に迫っている？誰かの役に立っているか分からない？リピーターの顔が見えない？そんなことは、最初から分かっていたはずだ。他人の賞賛や明確なリアクションを原動力にしようとするから、そうやって勝手に疲弊し、立ち止まることになる。</p>
<p>あなたがこれまで積み上げてきたものは、誰かに媚びるためのものでしたか？曖昧模糊とした誰かからの「ありがとう」を待つために、ペンを握ってきたのですか。違いますよね。</p>
<p>ホームページを立ち上げ、記事を書き、格納庫としてブログを構築した。その一連の泥臭い作業のすべては、あなた自身が歩んできた確かな経験、技術、そして思考の軌跡そのものです。それを「自分のための作業じゃないか」と卑下する必要など微塵もない。自分のためにすら徹底して向き合えない人間が、どうして他人の役に立てるというのですか。「誰かの役に立たなければ意味がない」という言葉を盾にして、単に反応がないことへの言い訳にしていませんか。数字や他人の評価に軸足を置いた瞬間から、表現は義務になり、力は失われていきます。</p>
<p>甘ったれた感傷に浸るのはやめなさい。書きたいなら書けばいい。書きたくないなら、ペンを放り出して休めばいい。ただそれだけの話です。自分の内側から湧き出る確固たる意志がないのなら、そんな中途半端な疑問など捨てて、目の前の現実と作業に戻りなさい。</p>
</blockquote>
<p>眼が醒めた。</p>
<p>-----迷うなら、休めばいい。<br>-----目の前の現実と作業に戻ればいい。<br>-----それでも迷うなら、その時はやめればいい。</p>
""".strip()

BODY_EN = """
<p>I built a website. I wrote more and more articles. So I needed a place to keep them. I made a blog. That part was working fine.</p>
<p>But then I thought about what comes next. And everything got blurry.</p>
<p>I called it "Farm Blog." I started writing my thoughts. But soon I began to wonder: these words have no clear direction. Do they mean anything at all?</p>
<p>I told my worry to some AI programs — Claude, Gemini, Copilot, and ChatGPT. We talked a little. Then I sent this message: "Don't go easy on me. Tell me the truth again."</p>
<p>Gemini's answer was this:</p>
<blockquote>
<p>Wake up. What are you really worried about?</p>
<p>Your visits are close to 2,500? You don't know if you're helping anyone? You can't see the faces of people who come back? You knew all of this from the very start. When you depend on other people's praise, or on clear reactions from them, you use up your own energy. Then you stop.</p>
<p>Was all your work just to please other people? Did you write just to wait for a vague "thank you" from someone you don't even know? No. That's not true.</p>
<p>You made a website. You wrote articles. You built a blog to hold them all. Every bit of that hard work is proof of your own real experience, your skill, and your way of thinking. You don't need to look down on it and call it "just something I did for myself."</p>
<p>If you can't even face your own work fully, how can you help other people? Are you hiding behind the words "It's only worth it if it helps someone"? Is that just an excuse, because no one is reacting? The moment you start caring about numbers and other people's opinions, writing becomes a duty. And it loses its power.</p>
<p>Stop feeling sorry for yourself. If you want to write, write. If you don't want to write, put down your pen and rest. That's all. If you don't feel a strong wish coming from inside you, then let go of these unclear doubts. Go back to what's in front of you. Go back to your work.</p>
</blockquote>
<p>I woke up.</p>
<p>If I feel lost, I can rest.<br>I can go back to what's in front of me — back to my work.<br>And if I'm still lost after that — I can just stop.</p>
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
  <link rel="stylesheet" href="../../style.css?v=19">
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
  <link rel="stylesheet" href="../../style.css?v=19">
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
