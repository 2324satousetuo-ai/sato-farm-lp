# -*- coding: utf-8 -*-
"""Publish 2026-08-09 note: food-self-sufficiency-37."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "food-self-sufficiency-37"
DATE = "2026-08-09"
DATE_JA = "2026.8.9"
DATE_EN = "August 9, 2026"
TITLE_JA = "食料自給率＝過去最低の37％。この先どうなる？ いや、どうすべきか。"
TITLE_EN = "Japan's Food Self-Sufficiency Rate Falls to a Record Low of 37% — What Happens Next? No, What Should We Do?"

BODY_JA = """
<p>2026年8月、農林水産省が公表した数字は「37％」。カロリーベースで前年度からさらに下がり、ついに過去最低を更新した。</p>
<p>1965年度に73％あった自給率は、この60年あまりで36ポイント低下した。食生活の変化とともに下がり続け、今や37％。危機感は何度も語られてきたはずなのに、私たちは悪化の一途をただ見過ごしてきた。</p>
<p>そして「37％」。</p>
<p>この数字を聞いて、背筋が伸びる日本人がどれほどいるだろう。</p>
<p>安全や国産への敬意よりも、1円でも安い外国産を追い求めてきた私たち。その積み重ねが今の現在地だとしたら、まず考え直すべきは私たち自身ではないか。</p>
<h2>自給率低下の大きな要因は、主食「米」を食べなくなったこと</h2>
<p>米は今なお、ほぼ100％を国内で賄える数少ない食料だ。</p>
<p>しかし、1人当たりの年間消費量は、ピーク時の118.3kg（1962年度）から、近年では50kg台へと半分以下に落ち込んだ。</p>
<p>一方で、肉・乳製品・小麦・油脂など、海外依存度の高い品目が食卓の主役になった。</p>
<p>私たちの食卓が変わった。</p>
<p>その結果、日本の食料自給率も下がってきた。</p>
<p>だが、問題はそれだけではない。数字の裏には、もっと深い「脆さ」が潜んでいる。</p>
<h2>“国産”のはずの農産物も、実は外国に支えられている</h2>
<p>化学肥料の原料の大部分は海外に依存している。野菜の種子に至っては、約9割が海外で採種されたものだ。</p>
<p>国産の農産物であっても、その生産を支えている肥料、種子、飼料、燃料などをたどれば、海外につながっている。</p>
<p>世界情勢の悪化や円安、物流の混乱が起これば、日本の農業も大きな影響を受ける。</p>
<p>つまり、37％という数字だけでは、日本の本当の脆さは見えてこない。</p>
<h2>中山間地の農地は「効率」では測れない価値を持つ</h2>
<p>戦後、私たちの食生活は大きく変わった。学校給食などを通じてパン食が広がり、その後、食生活の洋風化が進んだ。</p>
<p>その一方で、農業者の高齢化と担い手不足が進み、農地の維持も難しくなっている。</p>
<p>特に中山間地域では、傾斜地が多く、大規模化や機械化が平地ほど容易ではない。そこに人口減少と高齢化が重なっている。</p>
<p>平地の大規模水田は、これからの生産効率を支える大きな柱だ。効率化も必要である。</p>
<p>しかし同時に、中山間地の小さな田んぼや棚田にも、代えがたい意味がある。</p>
<p>農地を維持することで、水源の涵養、洪水や土砂崩れの防止、景観の保全など、多面的な機能が発揮される。</p>
<p>どちらか一方ではない。</p>
<p>平地の大規模農業と、中山間地の小規模農業。</p>
<p>その両方を守ることが、日本の食料基盤を支える。</p>
<h2>答えは、難しくない。国産を選ぶこと。足元の農地を支えること。</h2>
<p>そこから始めるしかない。</p>
<p>土に触れ、田んぼに立つたび、私は強くそう思う。</p>
<p>国を守るということは、案外、遠いところにある話ではない。</p>
<p>今日、何を食べるか。</p>
<p>その一食も、日本の農業を支えている。</p>
<p>そして、その一食の先に、日本の食料安全保障がある。</p>
""".strip()

BODY_EN = """
<p>In August 2026, Japan's Ministry of Agriculture announced a new number: <strong>37%</strong>.</p>
<p>This is Japan's food self-sufficiency rate based on calories. It fell one point from the previous year and reached a record low.</p>
<p>In 1965, the rate was 73%. In just over 60 years, it has fallen by 36 points.</p>
<p>Our eating habits have changed, and the rate has continued to fall. We have talked about this problem many times. But we have simply watched it get worse.</p>
<p>And now, <strong>37%</strong>.</p>
<p>How many Japanese people hear this number and feel that something is seriously wrong?</p>
<p>For years, we have often chosen cheaper imported food instead of thinking about the importance of safe, locally grown food.</p>
<p>If this has brought us to where we are today, perhaps we should first look at ourselves.</p>
<h2>One major reason is that we eat less rice</h2>
<p>Rice is still one of the few foods that Japan can produce almost 100% by itself.</p>
<p>But Japanese people eat much less rice than before.</p>
<p>In 1962, each person ate about 118.3 kg of rice a year. In recent years, the amount has fallen to around 50 kg. It is less than half of what it was.</p>
<p>At the same time, we eat more meat, dairy products, wheat, cooking oil, and other foods that depend heavily on imports.</p>
<p>Our eating habits have changed.</p>
<p>And because of that, Japan's food self-sufficiency rate has also fallen.</p>
<p>But that is not the whole problem.</p>
<p>There is a deeper weakness behind these numbers.</p>
<h2>Even "Japanese food" depends on other countries</h2>
<p>Much of the raw material used to make chemical fertilizer comes from other countries.</p>
<p>About 90% of vegetable seeds used in Japan are also produced overseas.</p>
<p>So even when food is grown in Japan, the farming behind it may depend on other countries for fertilizer, seeds, animal feed, and fuel.</p>
<p>If there is a war, a weak yen, or serious problems with transportation, Japanese farming could also be badly affected.</p>
<p>In other words, the 37% figure does not show the whole story.</p>
<p>Japan's food system may be weaker than the number suggests.</p>
<h2>Small farms in mountain areas have value beyond efficiency</h2>
<p>After World War II, the way Japanese people ate changed greatly.</p>
<p>Bread became more common through school lunches, and later, Western-style food became more popular.</p>
<p>At the same time, the number of farmers fell, farmers became older, and there were fewer young people taking over farms.</p>
<p>This problem is especially serious in mountain areas, where large machines and large farms are more difficult.</p>
<p>Large rice farms in flat areas are important. They can produce rice efficiently, and we need more efficient farming in the future.</p>
<p>But small rice fields and rice terraces in mountain areas are also important.</p>
<p>By keeping these fields, we help protect water, prevent floods and landslides, and keep local communities and beautiful landscapes alive.</p>
<p>These are values that cannot be measured only by efficiency.</p>
<p>We need both.</p>
<p>Large farms in flat areas.</p>
<p>Small farms in mountain areas.</p>
<p>Protecting both is important for Japan's food supply.</p>
<h2>The answer is not so difficult. Choose Japanese food. Support local farms.</h2>
<p>That is where we have to start.</p>
<p>Whenever I work in the soil or stand in a rice field, I strongly feel this.</p>
<p>Protecting our country is not something far away from us.</p>
<p>It starts with something very simple.</p>
<p>What do we eat today?</p>
<p>Every meal can help support Japanese farmers.</p>
<p>And beyond that meal is something much bigger:</p>
<p><strong>Japan's food security.</strong></p>
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
