# -*- coding: utf-8 -*-
"""Publish 2026-08-02 note: grass-and-water."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "grass-and-water"
DATE = "2026-08-02"
DATE_JA = "2026.8.2"
DATE_EN = "August 2, 2026"
TITLE_JA = "草を刈り、水を引く。八月最初の恒例行事"
TITLE_EN = "Cutting Grass, Bringing Water"

BODY_JA = """
<p>盆の気配が近づく八月最初の週末。農家の予定帳は、毎年同じ共同作業で埋まる。</p>
<p>土曜は、生家のある長野原町応桑の共同墓地へ向かう。朝六時集合を目指して五十分車を走らせた。着いた頃には皆すでに三十分前から作業を始めていた。</p>
<p>年に一度、墓地所有者が集まり、背丈ほどに伸びた雑草を刈払機でなぎ払う。自分の墓だけではない。墓地全体の際まできれいに刈り込み、お盆を迎える。それが、この地域に昔から受け継がれてきた習わしだ。</p>
<p>共同作業を終えると、一度生家へ戻って一休みした。その後、再び墓地へ向かい、両親と祖父母が眠る墓石を水洗いした。おおぼら山を見晴らす静かな野辺で、ご先祖様に静かに手を合わせる。そのひとときが、毎年の節目になっている。</p>
<p>翌日の日曜は、中之条町「間歩堰用水路」の共同除草である。</p>
<p>名久田川の取入口を前日にせき止め、この日は稲作耕作者全員が集まる。一年間たまった泥やコケをさらい、水路脇の草を刈る。泥まみれ、汗まみれの二時間。田んぼへ命の水を送り続けるために欠かせない仕事だ。</p>
<p>刈払機の刃先に神経を集中させ、目の前の藪を切り開いた瞬間だった。左手首に鋭い痛みが走る。「しまった。今年もやられた。」</p>
<p>アシナガバチの巣を直撃したらしい。十匹近くが一斉に飛び出した。一か所刺されただけで済んだのは、不幸中の幸いだった。家へ戻る頃には左腕はみるみる腫れ上がっていた。</p>
<p>同じ日には近くの公園の草刈り作業もあった。しかし、田んぼの命を支える用水路の作業を優先した。</p>
<p>両日とも刈払機を持参。作業効率は高い反面、一歩間違えば大きな事故にもつながる。それでも、この汗がなければ、秋に黄金色の稲穂は実らない。</p>
<p>気になるのは、人手不足である。地域の共同作業は、担い手が減れば続けられない。</p>
<p>参加者は年々減り、顔ぶれはシニア世代が目立つ。欠席すれば出不足金二千円。それでも問題は、お金ではない。</p>
<p>地域の人と顔を合わせ、ともに汗を流し、この土地を守る。その積み重ねが地域を支え、農業を支えている。</p>
<p>墓を守ることも、水を守ることも、突き詰めれば命を守ることだ。<br>ご先祖様から受け継いだこの土地を、次の世代へつなぐために。<br>今年も、草を刈り、水を引く。それが、この地で生きる農家の日常である。</p>
""".strip()

BODY_EN = """
<h2>The First Weekend of August</h2>
<p>The first weekend of August always feels special.<br>As Obon, the Japanese season to honor our ancestors, gets closer, my schedule is filled with the same community work every year.</p>
<p>On Saturday morning, I drove about 50 minutes to the community cemetery in Okuwa, where I was born.<br>We were supposed to meet at 6:00 a.m., but when I arrived, everyone had already been working for almost 30 minutes.</p>
<p>Once a year, all the families who own graves there gather together.<br>We cut the tall grass with brush cutters, not only around our own family graves but throughout the entire cemetery.<br>This has been our tradition for many years.</p>
<p>After the work, I went back to my parents' house for a short rest.<br>Later, I returned to our family grave, where my parents and grandparents are buried.<br>I washed the gravestone with clean water and stood quietly, looking across Mt. Obora.<br>Then I offered a silent prayer to my ancestors.</p>
<p>On Sunday morning, it was time for another community job.<br>This time, we cleaned the Mabu Irrigation Canal in Nakanojo.<br>The water from the Nakuta River had been stopped the day before, so everyone who grows rice could work together.</p>
<p>We removed mud and moss from the canal and cut the grass along the banks.<br>It was two hours of hard work, covered in mud and sweat.<br>But this work is very important.<br>Without clean irrigation water, we cannot grow rice.</p>
<p>While I was carefully using my brush cutter, something suddenly happened.<br>A sharp pain shot through my left wrist.<br><em>"Oh no... not again."</em></p>
<p>I had accidentally struck a paper wasp nest.<br>About ten wasps flew out at once.<br>Luckily, I was stung only once.<br>Even so, by the time I got home, my arm had become badly swollen.</p>
<p>There was also a grass-cutting event at a nearby park that same day.<br>But I chose to help with the irrigation canal because water is the lifeline of our rice fields.</p>
<p>I brought my own brush cutter on both days.<br>It makes the work much faster, but it can also be dangerous if we are not careful.<br>Still, without this hard work, there would be no golden rice fields in autumn.</p>
<p>One thing worries me.<br>Every year, fewer people join these community activities.<br>Most of the people who still come are older farmers.<br>If someone is absent, they must pay a small fee.<br>But the real problem is not the money.</p>
<p>Working together, talking with neighbors, and taking care of our land are what keep our community alive.</p>
<p>Taking care of our family graves and protecting the water for our rice fields may seem like different jobs.<br>But in the end, both are about protecting life.</p>
<p>Our ancestors left this land to us.<br>Now it is our turn to care for it and pass it on to the next generation.</p>
<p>So this year, once again, I cut the grass and helped bring water to the fields.<br>For me, this is simply what it means to live as a farmer.</p>
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
