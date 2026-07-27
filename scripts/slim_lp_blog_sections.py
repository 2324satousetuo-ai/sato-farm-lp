# -*- coding: utf-8 -*-
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NEWS_JA = """    <section class="news section" id="news">
      <div class="container container--news">
        <div class="news__header">
          <p class="section__label">News</p>
          <div class="news__title-row">
            <h2 class="section__title">新着情報</h2>
          </div>
        </div>
        <ul class="news__list">
          <li class="news__item">
            <time class="news__date" datetime="2026-07-27">2026.7.27</time>
            <p class="news__text"><span class="news__headline">「VSコードとClaude AI、実に優秀だ。」を更新しました。</span>—<a href="blog/notes/vscode-claude.html">記事を読む</a></p>
          </li>
          <li class="news__item">
            <time class="news__date" datetime="2026-07-26">2026.7.26</time>
            <p class="news__text"><span class="news__headline">「完全無消毒キャベツ、たった2ヶ月の奇跡物語」を更新しました。</span>—<a href="blog/notes/cabbage-miracle.html">記事を読む</a></p>
          </li>
          <li class="news__item">
            <time class="news__date" datetime="2026-07-25">2026.7.25</time>
            <p class="news__text"><span class="news__headline">「ドットコムは、旗である。---satofarms.com」を更新しました。</span>—<a href="blog/notes/dotcom-flag.html">記事を読む</a></p>
          </li>
        </ul>
        <p class="lp-blog-more"><a href="blog/news/">新着情報の一覧を見る（15件） →</a></p>
      </div>
    </section>"""

FIELD_JA = """    <section class="field-report section section--alt field-report--teaser" id="field-report">
      <div class="container">
        <p class="section__label">Farm Report</p>
        <h2 class="section__title">田畑の近況報告</h2>
        <p class="field-report__lead">畑と田んぼの様子を、写真と短文で不定期に更新しています。</p>
        <div class="field-report__grid field-report__grid--teaser">
          <article class="field-report__item">
            <figure class="field-report__figure">
              <div class="field-report__photo">
                <img src="images/field-report/003.jpg" alt="トリトマとゆりの花" loading="lazy" width="800" height="533">
              </div>
              <figcaption class="field-report__caption">2026.7.15. トリトマとゆりの花。</figcaption>
            </figure>
          </article>
          <article class="field-report__item">
            <figure class="field-report__figure">
              <div class="field-report__photo">
                <img src="images/field-report/001.jpg" alt="田んぼの様子" loading="lazy" width="800" height="600">
              </div>
              <figcaption class="field-report__caption">2026.7.5. 田んぼの様子。</figcaption>
            </figure>
          </article>
        </div>
        <p class="lp-blog-more"><a href="blog/field-report/">近況の写真と「じゃがいも全滅記」を見る →</a></p>
      </div>
    </section>"""

SOLILOQUY_JA = """    <section class="soliloquy section lp-blog-teaser" id="soliloquy">
      <div class="container container--soliloquy">
        <p class="section__label">Blog</p>
        <h2 class="section__title">農園ブログ</h2>
        <p class="lp-blog-teaser__lead">独り言・新着・近況は専用ページへ移しました。おすすめの記事だけこちらに載せています。</p>
        <ul class="lp-blog-teaser__list">
          <li>
            <a class="lp-blog-teaser__card" href="blog/notes/vscode-claude.html">
              <time datetime="2026-07-27">2026.7.27</time>
              <strong>VSコードとClaude AI、実に優秀だ。</strong>
              <span>ほぼ無料布陣でLPを回しつつ、Cursorの新しい持ち場を考える話。</span>
            </a>
          </li>
          <li>
            <a class="lp-blog-teaser__card" href="blog/notes/cabbage-miracle.html">
              <time datetime="2026-07-26">2026.7.26</time>
              <strong>完全無消毒キャベツ、たった2ヶ月の奇跡物語</strong>
              <span>青虫くんとの真剣勝負。１個100円の、季節限定のこだわり。</span>
            </a>
          </li>
          <li>
            <a class="lp-blog-teaser__card" href="blog/notes/dotcom-flag.html">
              <time datetime="2026-07-25">2026.7.25</time>
              <strong>ドットコムは、旗である。---satofarms.com</strong>
              <span>ビジネスプランではなく、ここに立っているという意思の旗。</span>
            </a>
          </li>
        </ul>
        <p class="lp-blog-more"><a class="btn btn--primary" href="blog/">ブログ一覧を見る</a></p>
      </div>
    </section>"""

NEWS_EN = """    <section class="news section" id="news">
      <div class="container container--news">
        <div class="news__header">
          <p class="section__label">News</p>
          <div class="news__title-row">
            <h2 class="section__title">What's New</h2>
          </div>
        </div>
        <ul class="news__list">
          <li class="news__item">
            <time class="news__date" datetime="2026-07-27">July 27, 2026</time>
            <p class="news__text"><span class="news__headline">VS Code and Claude AI: A Surprisingly Powerful Duo</span>—<a href="blog-en/notes/vscode-claude.html">Read the post</a>.</p>
          </li>
          <li class="news__item">
            <time class="news__date" datetime="2026-07-26">July 26, 2026</time>
            <p class="news__text"><span class="news__headline">The Two-Month Miracle: A Cabbage Story You Won’t Believe</span>—<a href="blog-en/notes/cabbage-miracle.html">Read the post</a>.</p>
          </li>
          <li class="news__item">
            <time class="news__date" datetime="2026-07-25">July 25, 2026</time>
            <p class="news__text"><span class="news__headline">A .com Is My Flag---satofarms.com</span>—<a href="blog-en/notes/dotcom-flag.html">Read the post</a>.</p>
          </li>
        </ul>
        <p class="lp-blog-more"><a href="blog-en/news/">See all news (15 items) →</a></p>
      </div>
    </section>"""

FIELD_EN = """    <section class="field-report section section--alt field-report--teaser" id="field-report">
      <div class="container">
        <p class="section__label">Farm Report</p>
        <h2 class="section__title">Field &amp; Paddy Updates</h2>
        <p class="field-report__lead">Photos and short notes from our fields and paddies, updated from time to time.</p>
        <div class="field-report__grid field-report__grid--teaser">
          <article class="field-report__item">
            <figure class="field-report__figure">
              <div class="field-report__photo">
                <img src="images/field-report/003.jpg" alt="Red hot pokers and lilies" loading="lazy" width="800" height="533">
              </div>
              <figcaption class="field-report__caption">July 15, 2026. Red hot pokers and lilies.</figcaption>
            </figure>
          </article>
          <article class="field-report__item">
            <figure class="field-report__figure">
              <div class="field-report__photo">
                <img src="images/field-report/001.jpg" alt="Rice paddy scene" loading="lazy" width="800" height="600">
              </div>
              <figcaption class="field-report__caption">July 5, 2026. Our rice paddies.</figcaption>
            </figure>
          </article>
        </div>
        <p class="lp-blog-more"><a href="blog-en/field-report/">See all photos and “The Potato Massacre” →</a></p>
      </div>
    </section>"""

SOLILOQUY_EN = """    <section class="soliloquy section lp-blog-teaser" id="soliloquy">
      <div class="container container--soliloquy">
        <p class="section__label">Blog</p>
        <h2 class="section__title">Farm Blog</h2>
        <p class="lp-blog-teaser__lead">Notes, news, and farm updates now live on dedicated pages. Here are a few featured posts.</p>
        <ul class="lp-blog-teaser__list">
          <li>
            <a class="lp-blog-teaser__card" href="blog-en/notes/vscode-claude.html">
              <time datetime="2026-07-27">July 27, 2026</time>
              <strong>VS Code and Claude AI: A Surprisingly Powerful Duo</strong>
              <span>Running the site with an almost-free toolkit—and giving Cursor a new job.</span>
            </a>
          </li>
          <li>
            <a class="lp-blog-teaser__card" href="blog-en/notes/cabbage-miracle.html">
              <time datetime="2026-07-26">July 26, 2026</time>
              <strong>The Two-Month Miracle: A Cabbage Story You Won’t Believe</strong>
              <span>A two-month war with caterpillars. Chemical-free, ¥100 each, seasonal only.</span>
            </a>
          </li>
          <li>
            <a class="lp-blog-teaser__card" href="blog-en/notes/dotcom-flag.html">
              <time datetime="2026-07-25">July 25, 2026</time>
              <strong>A .com Is My Flag---satofarms.com</strong>
              <span>Not a business plan—a flag that says, “I am here.”</span>
            </a>
          </li>
        </ul>
        <p class="lp-blog-more"><a class="btn btn--primary" href="blog-en/">View the blog</a></p>
      </div>
    </section>"""


def replace_section(html: str, section_id: str, new_block: str) -> str:
    pattern = rf'(    <section class="[^"]*" id="{section_id}">.*?</section>)'
    m = re.search(pattern, html, flags=re.S)
    if not m:
        raise SystemExit(f"missing section {section_id}")
    return html[: m.start(1)] + new_block + html[m.end(1) :]


def main() -> None:
    ja_path = ROOT / "index.html"
    ja = ja_path.read_text(encoding="utf-8")
    ja = ja.replace(
        """        <a href="#news">新着</a>
        <a href="#about">農園について</a>
        <a href="#nakanojo">中之条町</a>
        <a href="#products">商品</a>
        <a href="#field-report">近況</a>
        <a href="#profile">プロフィール</a>
        <a href="#soliloquy">独り言</a>""",
        """        <a href="#news">新着</a>
        <a href="#about">農園について</a>
        <a href="#nakanojo">中之条町</a>
        <a href="#products">商品</a>
        <a href="#field-report">近況</a>
        <a href="#profile">プロフィール</a>
        <a href="blog/">ブログ</a>
        <a href="#soliloquy">おすすめ</a>""",
    )
    ja = replace_section(ja, "news", NEWS_JA)
    ja = replace_section(ja, "field-report", FIELD_JA)
    ja = replace_section(ja, "soliloquy", SOLILOQUY_JA)
    ja_path.write_text(ja, encoding="utf-8")
    print("updated index.html")

    en_path = ROOT / "index-en.html"
    en = en_path.read_text(encoding="utf-8")
    en = en.replace(
        """        <a href="#news">News</a>
        <a href="#about">About</a>
        <a href="#nakanojo">Nakanojo</a>
        <a href="#products">Products</a>
        <a href="#field-report">Updates</a>
        <a href="#profile">Profile</a>
        <a href="#soliloquy">Notes</a>""",
        """        <a href="#news">News</a>
        <a href="#about">About</a>
        <a href="#nakanojo">Nakanojo</a>
        <a href="#products">Products</a>
        <a href="#field-report">Updates</a>
        <a href="#profile">Profile</a>
        <a href="blog-en/">Blog</a>
        <a href="#soliloquy">Featured</a>""",
    )
    en = replace_section(en, "news", NEWS_EN)
    en = replace_section(en, "field-report", FIELD_EN)
    en = replace_section(en, "soliloquy", SOLILOQUY_EN)
    en_path.write_text(en, encoding="utf-8")
    print("updated index-en.html")


if __name__ == "__main__":
    main()
