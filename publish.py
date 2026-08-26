#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
佐藤農園LP 記事自動登録スクリプト
4カ所のHTMLを自動更新します：
  ① blog/news/index.html（日本語新着）
  ② blog/index.html（日本語ブログ一覧）
  ③ blog-en/news/index.html（英語新着）
  ④ blog-en/index.html（英語ブログ一覧）
"""

import re
import os
from datetime import datetime

# ベースパス
BASE = r"C:\Users\節雄\OneDrive\デスクトップ\佐藤農園LP"

def get_title_from_html(filepath):
    """HTMLファイルの<title>タグからタイトルを自動取得"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'<title>(.*?)</title>', content)
        if match:
            title = match.group(1).strip()
            # 「｜佐藤農園ブログ」などを除去
            title = re.sub(r'\s*[|｜].*$', '', title).strip()
            return title
    except Exception as e:
        print(f"  ⚠️ ファイル読込エラー: {e}")
    return None

def insert_top_of_bloglist(html_content, new_item):
    """<ul class="blog-list">の直後に新エントリを挿入"""
    pattern = r'(<ul class="blog-list">)'
    replacement = r'\1\n' + new_item
    return re.sub(pattern, replacement, html_content, count=1)

def update_file(filepath, new_item):
    """ファイルを読み込み・更新・保存"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = insert_top_of_bloglist(content, new_item)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  ✅ 更新完了: {os.path.relpath(filepath, BASE)}")
    except Exception as e:
        print(f"  ❌ エラー: {filepath}\n     {e}")

# ============================================================
print()
print("=" * 52)
print("    佐藤農園LP  記事自動登録スクリプト")
print("=" * 52)
print()

# --- 入力 ---
date_str = input("① 公開日（例：2026-08-27）: ").strip()
ja_filename = input("② 日本語ファイル名（例：corn-civet）: ").strip()
en_filename = input("③ 英語ファイル名（例：corn-civet）: ").strip()
badge_ja   = input("④ カテゴリ（日本語）（例：独り言 農業 FX）: ").strip()
badge_en   = input("⑤ カテゴリ（英語）（例：Note Farm FX）: ").strip()
badge_cls  = input("⑥ バッジクラス（例：note farm fx）: ").strip()

# --- 日付変換 ---
try:
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    date_display = f"{date_obj.year}.{date_obj.month}.{date_obj.day}"
except ValueError:
    print("❌ 日付の形式が正しくありません。例：2026-08-27")
    input("Enterキーで終了")
    exit()

# --- タイトル自動取得 ---
ja_html_path = os.path.join(BASE, "blog", "notes", ja_filename + ".html")
en_html_path = os.path.join(BASE, "blog-en", "notes", en_filename + ".html")

print()
print("タイトルを自動取得中...")

ja_title = get_title_from_html(ja_html_path)
en_title = get_title_from_html(en_html_path)

if ja_title:
    print(f"  日本語タイトル: {ja_title}")
else:
    ja_title = input("  日本語タイトルを手入力: ").strip()

if en_title:
    print(f"  英語タイトル:   {en_title}")
else:
    en_title = input("  英語タイトルを手入力: ").strip()

# --- 確認 ---
print()
print("─" * 52)
print("  以下の内容で4カ所を更新します：")
print(f"  日付    : {date_str}  （表示: {date_display}）")
print(f"  日本語  : {ja_title}  [{badge_ja}]")
print(f"  英語    : {en_title}  [{badge_en}]")
print("─" * 52)
confirm = input("  よろしいですか？（y / n）: ").strip().lower()

if confirm != 'y':
    print("キャンセルしました。")
    input("Enterキーで終了")
    exit()

# --- HTMLブロック生成 ---

# ① blog/news/index.html（日本語新着）
ja_news = f'''\
        <li class="blog-list__item">
          <div class="blog-list__row blog-list__row--news">
            <time class="blog-list__date" datetime="{date_str}">{date_display}</time>
            <p class="blog-list__title">「{ja_title}」－<a href="../notes/{ja_filename}.html">読む</a></p>
            <span class="blog-list__badge blog-list__badge--{badge_cls}">{badge_ja}</span>
          </div>
        </li>'''

# ② blog/index.html（日本語ブログ一覧）
ja_blog = f'''\
        <li class="blog-list__item">
          <a class="blog-list__row" href="notes/{ja_filename}.html">
            <time class="blog-list__date" datetime="{date_str}">{date_display}</time>
            <p class="blog-list__title">{ja_title}</p>
            <span class="blog-list__badge blog-list__badge--{badge_cls}">{badge_ja}</span>
          </a>
        </li>'''

# ③ blog-en/news/index.html（英語新着）
en_news = f'''\
        <li class="blog-list__item">
          <div class="blog-list__row blog-list__row--news">
            <time class="blog-list__date" datetime="{date_str}">{date_display}</time>
            <p class="blog-list__title">"{en_title}"－<a href="../notes/{en_filename}.html">Read</a></p>
            <span class="blog-list__badge blog-list__badge--{badge_cls}">{badge_en}</span>
          </div>
        </li>'''

# ④ blog-en/index.html（英語ブログ一覧）
en_blog = f'''\
        <li class="blog-list__item">
          <a class="blog-list__row" href="notes/{en_filename}.html">
            <time class="blog-list__date" datetime="{date_str}">{date_display}</time>
            <p class="blog-list__title">{en_title}</p>
            <span class="blog-list__badge blog-list__badge--{badge_cls}">{badge_en}</span>
          </a>
        </li>'''

# --- ファイル更新 ---
print()
print("更新中...")
update_file(os.path.join(BASE, "blog",    "news",  "index.html"), ja_news)
update_file(os.path.join(BASE, "blog",             "index.html"), ja_blog)
update_file(os.path.join(BASE, "blog-en", "news",  "index.html"), en_news)
update_file(os.path.join(BASE, "blog-en",          "index.html"), en_blog)

print()
print("=" * 52)
print("  4カ所の更新が完了しました！")
print()
print("  次のステップ：")
print("  webup.bat をダブルクリックしてWebアップ！")
print("=" * 52)
print()
input("Enterキーで終了")
