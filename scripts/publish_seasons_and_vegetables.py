# -*- coding: utf-8 -*-
"""Publish 2026-08-04 note: seasons-and-vegetables."""
from __future__ import annotations

import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUG = "seasons-and-vegetables"
DATE = "2026-08-04"
DATE_JA = "2026.8.4"
DATE_EN = "August 4, 2026"
TITLE_JA = "佐藤農園の四季と野菜づくり"
TITLE_EN = "The Four Seasons and Vegetable Growing at Sato Farms"

BODY_JA = """
<h2>夏から秋へ。畑は次の季節の支度へ</h2>
<p>我が家の畑では、トマト、ナス、キュウリなどの夏野菜が最盛期を迎えている。一方で、役目を終えた株の片付けも始まり、畑は早くも秋野菜の植え付け準備へと移っていく。</p>
<p>今年のカボチャも順調に育ち、まもなく収穫の時期を迎える。</p>
<h2>秋から冬、そして春へ続く種まき</h2>
<p>秋の主役は、大根と白菜だ。</p>
<p>11月末までにしっかり育てるため、白菜はお盆の頃に種をまき、大根はその直後に直播きする。どちらも遅くとも9月10日までには種まきを終える。</p>
<p>秋の味覚であるいんげん豆は8月中に、真冬の食卓を支えるホウレンソウ、小松菜、春菊は9月中旬までに種をまく。５回目の種まきになるキュウリも9月初旬までなら十分間に合う。</p>
<p>10月に入ると気温は一気に下がり、野菜の生長は緩やかになる。だから秋の畑仕事は、まさに時間との勝負だ。</p>
<p>そして畑の時間は、すでに来年の春へ向かっている。</p>
<ul>
  <li><strong>9月中</strong>：5月収穫の「かき菜」</li>
  <li><strong>9月末</strong>：6月収穫のタマネギ</li>
  <li><strong>10月</strong>：5月収穫のサヤエンドウ</li>
</ul>
<h2>失敗を糧に、来年への雪辱を期す</h2>
<p>「種をまけば育つ」ほど、農業は甘くない。</p>
<p>今年は管理が行き届かず、レタス、枝豆、オクラで発芽不良となり、完敗だった。</p>
<p>この悔しさは、必ず来年の栽培で晴らす。</p>
<p>うまくいかなかった経験もまた、次の美味しさにつながる大切な財産だ。</p>
<h2>半年の冬を越えて味わう、春の喜び</h2>
<p>春の楽しみは、桜の開花だけではない。</p>
<p>ほぼ同じ時期に収穫を迎える「かき菜」と「サヤエンドウ」の初物を味わう瞬間だ。</p>
<p>半年以上前に種をまき、厳しい冬を耐え抜いてようやく収穫を迎える野菜。その一口には、言葉では表せない美味しさがある。</p>
<p>一年を通して、新鮮な野菜を届けたい。</p>
<p>その思いを胸に、今日も土と向き合い、一つひとつの作業を積み重ねている。</p>
""".strip()

BODY_EN = """
<h2>From Summer to Autumn: Getting Ready for the Next Season</h2>
<p>At our farm, summer vegetables such as tomatoes, eggplants, and cucumbers are now at their best.</p>
<p>At the same time, we start removing plants that have finished growing. The fields are already getting ready for autumn vegetables.</p>
<p>Our pumpkins are also growing well, and they will be ready to harvest very soon.</p>
<h2>Sowing Seeds for Autumn, Winter, and Next Spring</h2>
<p>The main vegetables for autumn are daikon radish and Chinese cabbage.</p>
<p>To harvest them by the end of November, we sow Chinese cabbage seeds around the Obon holiday in August. We sow daikon seeds soon after that. We finish sowing both by September 10 at the latest.</p>
<p>We sow green beans during August. We sow spinach, komatsuna, and garland chrysanthemum by the middle of September so we can enjoy them in winter.</p>
<p>We also sow cucumbers for the fifth time. If we sow the seeds by early September, we can still harvest them.</p>
<p>In October, the weather quickly becomes colder, and vegetables grow more slowly. That is why autumn is our busiest season.</p>
<p>At the same time, we are already preparing for next spring.</p>
<ul>
  <li><strong>September:</strong> Sow <em>Kakina</em> (Japanese mustard greens) for harvest in May.</li>
  <li><strong>Late September:</strong> Sow onions for harvest in June.</li>
  <li><strong>October:</strong> Sow snow peas for harvest in May.</li>
</ul>
<h2>Learning from Failure</h2>
<p>Farming is not as easy as simply planting seeds.</p>
<p>This year, we did not take good enough care of some crops. Lettuce, edamame, and okra did not sprout well, and we were disappointed.</p>
<p>But we will do better next year.</p>
<p>Even our failures help us grow better vegetables in the future.</p>
<h2>The Joy of Spring After a Long Winter</h2>
<p>One of my greatest joys in spring is not only seeing the cherry blossoms.</p>
<p>It is also tasting the first <em>Kakina</em> and snow peas of the season.</p>
<p>We sow these seeds more than six months before harvest. They grow through the long, cold winter before they reach our table.</p>
<p>That first bite has a special taste that is hard to describe.</p>
<p>We want to bring fresh vegetables to your table throughout the year.</p>
<p>With that hope in our hearts, we work with the soil every day, one step at a time.</p>
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
  <link rel="stylesheet" href="../../style.css?v=20">
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
  <link rel="stylesheet" href="../../style.css?v=20">
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
