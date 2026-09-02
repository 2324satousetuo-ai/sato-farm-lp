/**
 * ブログ原稿の Markdown を、公開用 HTML に写す。
 * 新しい原稿の初回掲載（記事ページ・一覧・新着・トップの案内）も行う。
 * VS Code からは「サイトに載せる」タスク、または npm run サイトに載せる で実行する。
 * 話題バッジはタイトルを主に、本文は空き枠の補充。英語は対になる日本語と同じ話題にする。
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatDateLine,
  lpReadLinkLabel,
  parseDateLine,
  readLinkLabel,
  replaceDateLine,
} from "./note-category.mjs";
import { resolveNoteTopics, topicLabel } from "./note-topics.mjs";

const CSS_VERSION = 42;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const doPush = args.has("--push");
const dryRun = args.has("--dry-run");

const MONTHS = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const TARGETS = [
  {
    lang: "ja",
    mdDir: path.join(root, "原稿", "blog", "notes"),
    htmlDir: path.join(root, "blog", "notes"),
    titleSuffix: "｜佐藤農園ブログ",
  },
  {
    lang: "en",
    mdDir: path.join(root, "原稿", "blog-en", "notes"),
    htmlDir: path.join(root, "blog-en", "notes"),
    titleSuffix: " | Sato Farms Blog",
  },
];

function readUtf8(file) {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function decodeMdEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/g, "&");
}

function listMarkdown(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
    .map((name) => path.join(dir, name));
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(text) {
  return escapeHtml(text).replaceAll('"', "&quot;");
}

function inline(text) {
  const slots = [];
  const stash = (html) => {
    const key = `\u0000${slots.length}\u0000`;
    slots.push(html);
    return key;
  };

  let out = text.replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escapeHtml(code)}</code>`));
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
    stash(`<a href="${escapeAttr(href)}">${escapeHtml(label)}</a>`),
  );
  out = out.replace(/\*\*([\s\S]+?)\*\*/g, (_, bold) => stash(`<strong>${escapeHtml(bold)}</strong>`));
  out = out.replace(/\*([^*\n]+)\*/g, (_, italic) => stash(`<em>${escapeHtml(italic)}</em>`));
  out = out.replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,!?;:]|$)/g, (_, lead, italic) =>
    `${lead}${stash(`<em>${escapeHtml(italic)}</em>`)}`,
  );
  out = escapeHtml(out);
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => slots[Number(i)]);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function notesNavLabel(lang) {
  return lang === "en" ? "Farm Blog" : "農園ブログ";
}

function parseMeta(line, lang) {
  const parsed = parseDateLine(line, lang);
  if (!parsed) return null;
  if (lang === "ja") {
    return {
      parsed,
      keywords: parsed.keywords || [],
      datetime: `${parsed.year}-${pad2(parsed.month)}-${pad2(parsed.day)}`,
      display: `${parsed.year}.${parsed.month}.${parsed.day}`,
    };
  }
  const month = MONTHS[parsed.monthName.toLowerCase()];
  if (!month) return null;
  return {
    parsed,
    keywords: parsed.keywords || [],
    datetime: `${parsed.year}-${pad2(month)}-${pad2(parsed.day)}`,
    display: `${parsed.monthName} ${parsed.day}, ${parsed.year}`,
  };
}

function isBlank(line) {
  return line.trim() === "";
}

function isHeading(line) {
  return /^##\s+/.test(line);
}

function isListItem(line) {
  return /^\s*[-*]\s+/.test(line);
}

function isImage(line) {
  return /^!\[/.test(line.trim());
}

function parseImage(line) {
  const m = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)/);
  if (!m) return null;
  return { alt: m[1], src: m[2] };
}

function isQuoteLine(line) {
  return /^>\s?/.test(line);
}

function isCaptionLine(line) {
  const t = line.trim();
  if (!t) return false;
  if (isHeading(t) || isListItem(t) || isImage(t) || isQuoteLine(t) || t.startsWith("#")) return false;
  return t.length <= 80;
}

function renderParagraph(lines) {
  return `<p>${inline(lines.join("\n")).replaceAll("\n", "<br>")}</p>`;
}

function existingImgTag(html, src) {
  const re = new RegExp(`<img\\b[^>]*\\bsrc="${escapeAttr(src).replaceAll("/", "\\/")}"[^>]*>`, "i");
  const m = html.match(re);
  return m ? m[0] : null;
}

function imgTag(src, alt, currentHtml) {
  const found = existingImgTag(currentHtml, src);
  if (found) {
    if (/alt="/.test(found)) return found.replace(/alt="[^"]*"/, `alt="${escapeAttr(alt)}"`);
    return found.replace("<img", `<img alt="${escapeAttr(alt)}"`);
  }
  return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy">`;
}

function renderImages(figures, currentHtml) {
  const inner = figures
    .map(
      (fig) => `<figure class="blog-article__figure">
  ${imgTag(fig.src, fig.alt, currentHtml)}
  <figcaption>${inline(fig.caption)}</figcaption>
</figure>`,
    )
    .join("\n");
  return `<div class="blog-article__photos">
${inner}
</div>`;
}

function renderBody(lines, currentHtml) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (isBlank(lines[i])) {
      i += 1;
      continue;
    }

    if (isHeading(lines[i])) {
      out.push(`<h2>${inline(lines[i].replace(/^##\s+/, ""))}</h2>`);
      i += 1;
      continue;
    }

    if (isImage(lines[i])) {
      const figures = [];
      while (i < lines.length) {
        while (i < lines.length && isBlank(lines[i])) i += 1;
        if (i >= lines.length || !isImage(lines[i])) break;
        const img = parseImage(lines[i]);
        i += 1;
        while (i < lines.length && isBlank(lines[i])) i += 1;
        let caption = img.alt;
        if (i < lines.length && isCaptionLine(lines[i]) && !isImage(lines[i])) {
          caption = lines[i].trim();
          i += 1;
        }
        figures.push({ ...img, caption });
      }
      if (figures.length) out.push(renderImages(figures, currentHtml));
      continue;
    }

    if (isListItem(lines[i])) {
      const items = [];
      while (i < lines.length) {
        if (isBlank(lines[i])) {
          let j = i + 1;
          while (j < lines.length && isBlank(lines[j])) j += 1;
          if (j < lines.length && isListItem(lines[j])) {
            i = j;
            continue;
          }
          break;
        }
        if (!isListItem(lines[i])) break;
        items.push(`  <li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i += 1;
      }
      out.push(`<ul>\n${items.join("\n")}\n</ul>`);
      continue;
    }

    if (isQuoteLine(lines[i])) {
      const quoteLines = [];
      if (lines[i].trim() === ">") {
        i += 1;
        while (i < lines.length && isBlank(lines[i])) i += 1;
        while (i < lines.length) {
          if (isBlank(lines[i])) {
            i += 1;
            continue;
          }
          if (isHeading(lines[i]) || isListItem(lines[i]) || isImage(lines[i])) break;
          if (lines[i].trim().length <= 40 && quoteLines.length) break;
          const para = [];
          while (i < lines.length && !isBlank(lines[i]) && !isHeading(lines[i]) && !isListItem(lines[i]) && !isImage(lines[i])) {
            para.push(lines[i].replace(/^>\s?/, ""));
            i += 1;
          }
          if (para.length) quoteLines.push(renderParagraph(para));
        }
      } else {
        while (i < lines.length && (isQuoteLine(lines[i]) || (quoteLines.length && isBlank(lines[i])))) {
          if (isBlank(lines[i]) || lines[i].trim() === ">") {
            i += 1;
            continue;
          }
          quoteLines.push(renderParagraph([lines[i].replace(/^>\s?/, "")]));
          i += 1;
        }
      }
      if (quoteLines.length) out.push(`<blockquote>\n${quoteLines.join("\n")}\n</blockquote>`);
      continue;
    }

    const para = [];
    while (
      i < lines.length &&
      !isBlank(lines[i]) &&
      !isHeading(lines[i]) &&
      !isListItem(lines[i]) &&
      !isImage(lines[i]) &&
      !isQuoteLine(lines[i])
    ) {
      para.push(lines[i]);
      i += 1;
    }
    if (para.length) out.push(renderParagraph(para));
  }
  return out.join("\n");
}

function parseNote(md, lang) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length && isBlank(lines[i])) i += 1;
  if (!lines[i] || !lines[i].startsWith("# ")) {
    throw new Error("先頭に # タイトル がありません");
  }
  const titleMd = lines[i].replace(/^#\s+/, "");
  i += 1;
  while (i < lines.length && isBlank(lines[i])) i += 1;
  const meta = parseMeta(lines[i] || "", lang);
  if (!meta) {
    throw new Error(`日付の行が読めません: ${lines[i] || "(空)"}`);
  }
  i += 1;
  const bodyLines = lines.slice(i);
  while (bodyLines.length && isBlank(bodyLines[0])) bodyLines.shift();
  while (bodyLines.length && isBlank(bodyLines[bodyLines.length - 1])) bodyLines.pop();
  return { titleMd, ...meta, bodyLines };
}

function replaceFirst(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`置き場所が見つかりません: ${pattern}`);
  }
  return html.replace(pattern, () => replacement);
}

function replaceBody(html, body) {
  const startToken = '<div class="blog-article__body">';
  const start = html.indexOf(startToken);
  if (start < 0) throw new Error("本文の入れ物が見つかりません");
  const innerStart = start + startToken.length;
  let depth = 1;
  let i = innerStart;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose < 0) throw new Error("本文の閉じタグが見つかりません");
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) {
        return `${html.slice(0, innerStart)}\n${body}\n        ${html.slice(nextClose)}`;
      }
      i = nextClose + 6;
    }
  }
  throw new Error("本文の閉じタグが見つかりません");
}

function updateHtml(html, note, titleSuffix, body, lang) {
  const titleText = note.titleMd.replace(/\*\*/g, "");
  const notesNav = notesNavLabel(lang);
  let next = html;
  next = replaceFirst(next, /<title>[^<]*<\/title>/, `<title>${escapeHtml(titleText)}${titleSuffix}</title>`);
  next = replaceFirst(
    next,
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeAttr(titleText)}${titleSuffix}">`,
  );
  next = replaceFirst(next, /<p class="blog-article__meta">[\s\S]*?<\/p>/, articleMetaHtml(note));
  if (/<nav class="blog-breadcrumb"[\s\S]*?<\/nav>/.test(next)) {
    next = next.replace(/<nav class="blog-breadcrumb"[\s\S]*?<\/nav>/, (block) =>
      block.replace(
        /<span>(?:独り言|記事|Random Thoughts|Article|Notes|農園ブログ|Farm Blog)<\/span>/,
        `<span>${escapeHtml(notesNav)}</span>`,
      ),
    );
  }
  if (/<a href="\.\.\/#notes">[^<]*<\/a>/.test(next)) {
    next = replaceFirst(next, /<a href="\.\.\/#notes">[^<]*<\/a>/, `<a href="../#notes">${notesNav}</a>`);
  }
  next = replaceFirst(
    next,
    /<h1 class="blog-article__title">[\s\S]*?<\/h1>/,
    `<h1 class="blog-article__title">${inline(note.titleMd)}</h1>`,
  );
  next = next.replace(/style\.css\?v=\d+/, `style.css?v=${CSS_VERSION}`);
  next = replaceBody(next, body);
  return next;
}

function plainText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBody(html) {
  const startToken = '<div class="blog-article__body">';
  const start = html.indexOf(startToken);
  if (start < 0) return "";
  const innerStart = start + startToken.length;
  let depth = 1;
  let i = innerStart;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose < 0) return html.slice(innerStart);
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) return html.slice(innerStart, nextClose);
      i = nextClose + 6;
    }
  }
  return html.slice(innerStart);
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
  }).trim();
}

function warnIfLpChanged() {
  try {
    const names = git(["diff", "--name-only", "HEAD", "--", "原稿/LP.md", "原稿/LP-en.md"]);
    if (!names) return;
    console.log("※ トップページ原稿のうち、新着・農園ブログ以外の直しは、この命令では写しません。");
  } catch {
    // git が使えないときは無視
  }
}

function applyTopics(note, topics, lang) {
  return {
    ...note,
    topics,
    topicLabels: topics.map((id) => topicLabel(id, lang)),
  };
}

function articleCategoryHtml(note) {
  return (note.topicLabels || [])
    .map((label) => `<span class="blog-article__category blog-article__category--topic">${escapeHtml(label)}</span>`)
    .join("\n          ");
}

function articleMetaHtml(note) {
  const cats = articleCategoryHtml(note);
  const time = `<time datetime="${note.datetime}">${note.display}</time>`;
  if (!cats) {
    return `<p class="blog-article__meta">
          ${time}
        </p>`;
  }
  return `<p class="blog-article__meta">
          ${cats}
          ${time}
        </p>`;
}

function articleShell(lang, slug) {
  const seedSlug = "koshihikari-field-time";
  const dir = lang === "ja" ? path.join(root, "blog", "notes") : path.join(root, "blog-en", "notes");
  const seed = path.join(dir, `${seedSlug}.html`);
  if (!fs.existsSync(seed)) {
    throw new Error(`ひな型がありません: ${rel(seed)}`);
  }
  return readUtf8(seed).replaceAll(`${seedSlug}.html`, `${slug}.html`);
}

function teaserExcerpt(bodyLines) {
  const lines = bodyLines
    .map((line) =>
      line
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .trim(),
    )
    .filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (lines[i].length <= 80) return lines[i];
  }
  return lines[lines.length - 1] || "";
}

function listingMeta(slug, note) {
  return {
    slug,
    topics: note.topics || [],
    topicLabels: note.topicLabels || [],
    title: note.titleMd.replace(/\*\*/g, ""),
    datetime: note.datetime,
    display: note.display,
    excerpt: teaserExcerpt(note.bodyLines),
  };
}

function publishNote(target, mdFile, forcedTopics) {
  const slug = path.basename(mdFile, ".md");
  const htmlFile = path.join(target.htmlDir, `${slug}.html`);
  const created = !fs.existsSync(htmlFile);
  const rawMd = readUtf8(mdFile);
  const md = decodeMdEntities(rawMd);
  const html = created ? articleShell(target.lang, slug) : readUtf8(htmlFile);
  let note;
  let body;
  let next;
  try {
    note = parseNote(md, target.lang);
    const topics = resolveNoteTopics({
      title: note.titleMd,
      body: note.bodyLines.join("\n"),
      keywords: note.keywords,
      forcedTopics,
    });
    note = applyTopics(note, topics, target.lang);
    if (note.parsed) {
      const nextLine = formatDateLine(note.parsed, target.lang);
      const nextMd = replaceDateLine(rawMd, nextLine);
      if (nextMd !== rawMd && !dryRun) fs.writeFileSync(mdFile, nextMd, "utf8");
    }
    body = renderBody(note.bodyLines, html);
    next = updateHtml(html, note, target.titleSuffix, body, target.lang);
  } catch (error) {
    throw new Error(`${rel(mdFile)}: ${error.message}`);
  }
  const meta = listingMeta(slug, note);
  const titleText = meta.title;
  const currentTitle = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const currentH1 = (html.match(/<h1 class="blog-article__title">([\s\S]*?)<\/h1>/) || [])[1] || "";
  const currentTopics = [...html.matchAll(/blog-article__category--topic">([^<]*)<\/span>/g)].map((m) => m[1]);
  const hasKindBadge = /blog-article__category--(?:note|article)"/.test(html);
  const sameTopics =
    currentTopics.length === note.topicLabels.length &&
    currentTopics.every((label, i) => label === note.topicLabels[i]);
  const same =
    !created &&
    plainText(currentTitle) === plainText(`${titleText}${target.titleSuffix}`) &&
    plainText(currentH1) === plainText(inline(note.titleMd)) &&
    html.includes(`datetime="${note.datetime}"`) &&
    html.includes(`>${note.display}</time>`) &&
    !hasKindBadge &&
    sameTopics &&
    html.includes(`style.css?v=${CSS_VERSION}`) &&
    html.includes(`>${notesNavLabel(target.lang)}</a>`) &&
    plainText(extractBody(html)) === plainText(body);
  if (same) {
    return { ...meta, unchanged: rel(mdFile) };
  }
  if (!dryRun) fs.writeFileSync(htmlFile, next, "utf8");
  return { ...meta, created, written: rel(htmlFile) };
}

function rowBadgesHtml(topics, lang) {
  if (!topics?.length) return "";
  const inner = topics
    .map((id) => `<span class="blog-list__badge blog-list__badge--topic">${escapeHtml(topicLabel(id, lang))}</span>`)
    .join("");
  return `<span class="blog-list__badges">${inner}</span>`;
}

function metaForSlug(slugMeta, slug) {
  if (slugMeta[slug]) return slugMeta[slug];
  const key = Object.keys(slugMeta).find((name) => name.toLowerCase() === String(slug).toLowerCase());
  return key ? slugMeta[key] : null;
}

function replaceRowBadges(inner, badges) {
  let out = inner.replace(
    /\s*<span class="blog-list__badges">(?:<span class="blog-list__badge[^"]*"[^>]*>[^<]*<\/span>)*<\/span>\s*$/,
    "",
  );
  out = out.replace(/(?:\s*<span class="blog-list__badge[^"]*"[^>]*>[^<]*<\/span>)+\s*$/, "");
  if (!badges) return out;
  return `${out}\n              ${badges}`;
}

function bumpStylesheet(html) {
  return html.replace(/style\.css\?v=\d+/, `style.css?v=${CSS_VERSION}`);
}

function restyleBlogIndex(html, lang) {
  if (lang === "ja") {
    return html
      .replaceAll(">独り言・記事<", ">農園ブログ<")
      .replace(
        'content="佐藤農園ブログ。独り言、新着情報、田畑の近況報告をまとめた一覧ページです。"',
        'content="佐藤農園ブログ。新着情報、田畑の近況報告をまとめた一覧ページです。"',
      )
      .replace(
        "独り言・新着情報・田畑の近況・名所URL集を、専用の一覧と記事ページへ移しています。",
        "ブログ・新着情報・田畑の近況・名所URL集を、専用の一覧と記事ページへ移しています。",
      )
      .replace(
        "<strong>移行完了：</strong>独り言・新着・近況・名所URL集をブログへ移し、LPは軽量化済みです。",
        "<strong>移行完了：</strong>ブログ・新着・近況・名所URL集を専用ページへ移し、LPは軽量化済みです。",
      )
      .replace(
        "独り言は「だ・する・と思う」のつぶやき。記事は「です・ます」の、読者・お客様への案内です。",
        "話題バッジは、タイトルと本文から自動で付きます。日付行に語を書けば上書きできます。",
      );
  }
  return html
    .replaceAll(">Notes & Articles<", ">Farm Blog<")
    .replace(
      'content="Sato Farms blog: Random Thoughts, news, and farm updates in one place."',
      'content="Sato Farms blog: posts, news, and farm updates in one place."',
    )
    .replace(
      "Random Thoughts, news, field updates, and sightseeing links live on dedicated pages—",
      "Posts, news, field updates, and sightseeing links live on dedicated pages—",
    )
    .replace(
      "<strong>Migration complete:</strong> Notes, news, farm updates, and sightseeing links live on the blog; the LP is slimmed down.",
      "<strong>Migration complete:</strong> Posts, news, farm updates, and sightseeing links live on the blog; the LP is slimmed down.",
    )
    .replace(
      "Random Thoughts are informal asides. Articles speak to readers and customers.",
      "Topic badges come from the title and body. Add a word on the date line to override.",
    );
}

function restyleNewsPage(html, lang) {
  if (lang === "ja") {
    return html.replace(
      "お知らせアーカイブです。関連する独り言・記事・近況・商品へリンクしています。",
      "お知らせアーカイブです。関連するブログ・近況・商品へリンクしています。",
    );
  }
  return html;
}

function listingSlugMeta(items) {
  const map = {};
  for (const item of items) {
    if (item.slug) map[item.slug] = item;
  }
  return map;
}

function newsItemTitleHtml(item, lang) {
  const href = `../notes/${item.slug}.html`;
  if (lang === "ja") {
    return `「${escapeHtml(item.title)}」—<a href="${href}">${escapeHtml(readLinkLabel("ja"))}</a>`;
  }
  return `${escapeHtml(item.title)}—<a href="${href}">${escapeHtml(readLinkLabel("en"))}</a>.`;
}

function lpNewsHeadline(item, lang) {
  return lang === "ja" ? `「${escapeHtml(item.title)}」` : escapeHtml(item.title);
}

function updateLpMarkdownNews(file, slugMeta, lang) {
  if (!fs.existsSync(file)) return null;
  let md = readUtf8(file);
  const heading = lang === "ja" ? "新着情報" : "What's New";
  const section = markdownSectionItems(md, heading);
  const itemLines = section.lines.slice(section.itemIdx, section.itemEnd);
  const nextItems = itemLines.map((line) => {
    const m = line.match(/blog(?:-en)?\/notes\/([^")\s]+)\.html/);
    if (!m) return line;
    const meta = metaForSlug(slugMeta, m[1]);
    if (!meta?.title) return line;
    if (line.includes(meta.title)) return line;
    return lpMarkdownNewsLine(meta, lang);
  });
  let next =
    md.slice(0, section.afterHeading + 1) +
    [...section.lines.slice(0, section.itemIdx), ...nextItems, ...section.lines.slice(section.itemEnd)].join("\n") +
    md.slice(section.sectionEnd);
  next =
    lang === "ja"
      ? next.replace(/\[(?:記事を読む|独り言を読む)\]/g, "[読む]")
      : next.replace(/\[(?:Read the article|Read the note|Read the post)\]/g, "[Read]");
  if (next === md) return null;
  if (!dryRun) fs.writeFileSync(file, next, "utf8");
  return rel(file);
}

function updateListPage(file, slugMeta, lang) {
  if (!fs.existsSync(file)) return null;
  const html = readUtf8(file);
  let next = restyleBlogIndex(html, lang).replace(
    /(<a class="blog-list__row" href="notes\/([^"]+)\.html">)([\s\S]*?)<\/a>/g,
    (all, start, slug, inner) => {
      const meta = metaForSlug(slugMeta, slug);
      if (!meta) return all;
      let body = inner;
      if (meta.title) {
        body = body.replace(
          /<p class="blog-list__title">[\s\S]*?<\/p>/,
          `<p class="blog-list__title">${escapeHtml(meta.title)}</p>`,
        );
      }
      return `${start}${replaceRowBadges(body, rowBadgesHtml(meta.topics, lang))}</a>`;
    },
  );
  next = bumpStylesheet(next);
  if (next === html) return null;
  if (!dryRun) fs.writeFileSync(file, next, "utf8");
  return rel(file);
}

function updateNewsPage(file, slugMeta, lang) {
  if (!fs.existsSync(file)) return null;
  const html = readUtf8(file);
  let next = restyleNewsPage(html, lang).replace(/<div class="blog-list__row blog-list__row--news">[\s\S]*?<\/div>/g, (block) => {
    const m = block.match(/notes\/([^"]+)\.html/);
    if (!m) return block;
    const meta = metaForSlug(slugMeta, m[1]);
    if (!meta) return block;
    const linkLabel = readLinkLabel(lang);
    let out = block;
    const titleHtml = (block.match(/<p class="blog-list__title">([\s\S]*?)<\/p>/) || [])[1] || "";
    if (meta.title && !plainText(titleHtml).includes(meta.title)) {
      out = out.replace(
        /<p class="blog-list__title">[\s\S]*?<\/p>/,
        `<p class="blog-list__title">${newsItemTitleHtml(meta, lang)}</p>`,
      );
    } else {
      out = out.replace(/—see (<a href="\.\.\/notes\/[^"]+\.html">)[^<]*(<\/a>)/, `—$1${linkLabel}$2`);
      out = out.replace(/(<a href="\.\.\/notes\/[^"]+\.html">)[^<]*(<\/a>)/, `$1${linkLabel}$2`);
    }
    const badges = rowBadgesHtml(meta.topics, lang);
    if (/blog-list__badges|blog-list__badge/.test(out)) {
      out = out.replace(
        /\s*<span class="blog-list__badges">(?:<span class="blog-list__badge[^"]*"[^>]*>[^<]*<\/span>)*<\/span>/,
        badges ? `\n              ${badges}` : "",
      );
    } else if (badges) {
      out = out.replace(/<\/div>\s*$/, `\n              ${badges}\n            </div>`);
    }
    return out;
  });
  next = bumpStylesheet(next);
  if (next === html) return null;
  if (!dryRun) fs.writeFileSync(file, next, "utf8");
  return rel(file);
}

function updateLpNews(file, slugMeta, lang) {
  if (!fs.existsSync(file)) return null;
  const html = readUtf8(file);
  let next = html.replace(/<li class="news__item">[\s\S]*?<\/li>/g, (block) => {
    const m = block.match(/blog(?:-en)?\/notes\/([^"]+)\.html/);
    if (!m) return block;
    const meta = metaForSlug(slugMeta, m[1]);
    if (!meta?.title) return block;
    const headlineHtml = (block.match(/<span class="news__headline">([\s\S]*?)<\/span>/) || [])[1] || "";
    if (plainText(headlineHtml).includes(meta.title)) return block;
    return block.replace(
      /<span class="news__headline">[\s\S]*?<\/span>/,
      `<span class="news__headline">${lpNewsHeadline(meta, lang)}</span>`,
    );
  });
  next = next.replace(
    /<a href="(blog(?:-en)?\/notes\/)([^"]+)\.html"([^>]*)>([^<]*)<\/a>/g,
    (all, prefix, slug, attrs, text) => {
      const meta = metaForSlug(slugMeta, slug);
      if (!meta) return all;
      if (!/記事を読む|独り言を読む|読む|Read the article|Read the note|Read the post|Read/.test(text)) return all;
      const cleaned = attrs.replace(/\s*class="[^"]*"/, "");
      return `<a href="${prefix}${slug}.html" class="news__kind"${cleaned}>${lpReadLinkLabel(lang)}</a>`;
    },
  );
  next = bumpStylesheet(next);
  if (next === html) return null;
  if (!dryRun) fs.writeFileSync(file, next, "utf8");
  return rel(file);
}

function updateTeaser(file, slugMeta, lang) {
  if (!fs.existsSync(file)) return null;
  const html = readUtf8(file);
  let next = html.replace(
    /<a class="lp-blog-teaser__card" href="(blog(?:-en)?\/notes\/)([^"]+)\.html">([\s\S]*?)<\/a>/g,
    (all, prefix, slug, inner) => {
      const meta = metaForSlug(slugMeta, slug);
      if (!meta) return all;
      const badges = rowBadgesHtml(meta.topics, lang);
      let body = inner;
      if (/lp-blog-teaser__meta/.test(body)) {
        body = body.replace(
          /(<time[\s\S]*?<\/time>)[\s\S]*?(?=<\/div>)/,
          badges ? `$1\n              ${badges}` : `$1`,
        );
      } else {
        body = body.replace(
          /<time([^>]*)>([^<]*)<\/time>/,
          `<div class="lp-blog-teaser__meta"><time$1>$2</time>\n              ${badges}</div>`,
        );
      }
      return `<a class="lp-blog-teaser__card" href="${prefix}${slug}.html">${body}</a>`;
    },
  );
  next = bumpStylesheet(next);
  if (next === html) return null;
  if (!dryRun) fs.writeFileSync(file, next, "utf8");
  return rel(file);
}

function ulRange(html, ulClass) {
  const open = `<ul class="${ulClass}">`;
  const start = html.indexOf(open);
  if (start < 0) throw new Error(`リストが見つかりません: ${ulClass}`);
  const innerStart = start + open.length;
  const end = html.indexOf("</ul>", innerStart);
  if (end < 0) throw new Error(`リストの閉じタグが見つかりません: ${ulClass}`);
  return { innerStart, end };
}

function insertIntoFirstUl(html, ulClass, itemHtml, hrefNeedle, max) {
  const { innerStart, end } = ulRange(html, ulClass);
  const inner = html.slice(innerStart, end);
  if (inner.includes(hrefNeedle)) return html;
  const items = inner.match(/<li[\s\S]*?<\/li>/g) || [];
  const kept = [itemHtml.trim(), ...items];
  const nextItems = max ? kept.slice(0, max) : kept;
  return `${html.slice(0, innerStart)}\n${nextItems.join("\n")}\n        ${html.slice(end)}`;
}

function replaceFirstUlItems(html, ulClass, itemHtmls) {
  const { innerStart, end } = ulRange(html, ulClass);
  return `${html.slice(0, innerStart)}\n${itemHtmls.map((item) => item.trim()).join("\n")}\n        ${html.slice(end)}`;
}

function markdownSectionItems(md, heading) {
  const headingToken = `## ${heading}`;
  const headingIdx = md.indexOf(headingToken);
  if (headingIdx < 0) throw new Error(`見出しがありません: ${heading}`);
  const afterHeading = md.indexOf("\n", headingIdx);
  const nextHeading = md.indexOf("\n## ", afterHeading);
  const sectionEnd = nextHeading === -1 ? md.length : nextHeading;
  const section = md.slice(afterHeading + 1, sectionEnd);
  const lines = section.split("\n");
  const itemIdx = lines.findIndex((line) => line.startsWith("- "));
  if (itemIdx < 0) throw new Error(`リストがありません: ${heading}`);
  let j = itemIdx;
  while (j < lines.length && lines[j].startsWith("- ")) j += 1;
  return { afterHeading, sectionEnd, lines, itemIdx, itemEnd: j };
}

function insertMarkdownNews(md, heading, newLine, hrefNeedle, max) {
  const section = markdownSectionItems(md, heading);
  const itemLines = section.lines.slice(section.itemIdx, section.itemEnd);
  if (itemLines.some((line) => line.includes(hrefNeedle))) return md;
  const nextItems = [newLine, ...itemLines].slice(0, max);
  const newSection = [
    ...section.lines.slice(0, section.itemIdx),
    ...nextItems,
    ...section.lines.slice(section.itemEnd),
  ].join("\n");
  return md.slice(0, section.afterHeading + 1) + newSection + md.slice(section.sectionEnd);
}

function replaceMarkdownList(md, heading, newLines) {
  const section = markdownSectionItems(md, heading);
  const newSection = [
    ...section.lines.slice(0, section.itemIdx),
    ...newLines,
    ...section.lines.slice(section.itemEnd),
  ].join("\n");
  return md.slice(0, section.afterHeading + 1) + newSection + md.slice(section.sectionEnd);
}

function blogListItemHtml(item, lang) {
  return `          <li class="blog-list__item">
            <a class="blog-list__row" href="notes/${item.slug}.html">
              <time class="blog-list__date" datetime="${item.datetime}">${escapeHtml(item.display)}</time>
              <p class="blog-list__title">${escapeHtml(item.title)}</p>
              ${rowBadgesHtml(item.topics, lang)}
            </a>
          </li>`;
}

function newsArchiveItemHtml(item, lang) {
  return `          <li class="blog-list__item">
            <div class="blog-list__row blog-list__row--news">
              <time class="blog-list__date" datetime="${item.datetime}">${escapeHtml(item.display)}</time>
              <p class="blog-list__title">${newsItemTitleHtml(item, lang)}</p>
              ${rowBadgesHtml(item.topics, lang)}
            </div>
          </li>`;
}

function lpNewsItemHtml(item, lang) {
  const href = lang === "ja" ? `blog/notes/${item.slug}.html` : `blog-en/notes/${item.slug}.html`;
  const headline = lpNewsHeadline(item, lang);
  const link = `<a href="${href}" class="news__kind">${escapeHtml(lpReadLinkLabel(lang))}</a>`;
  const text =
    lang === "ja"
      ? `<span class="news__headline">${headline}</span>—${link}`
      : `<span class="news__headline">${headline}</span>—${link}.`;
  const indent = lang === "ja" ? "        " : "          ";
  return `${indent}<li class="news__item">
${indent}    <time class="news__date" datetime="${item.datetime}">${escapeHtml(item.display)}</time>
${indent}    <p class="news__text">${text}</p>
${indent}</li>`;
}

function teaserItemHtml(item, lang) {
  const href = lang === "ja" ? `blog/notes/${item.slug}.html` : `blog-en/notes/${item.slug}.html`;
  return `          <li>
            <a class="lp-blog-teaser__card" href="${href}">
              <div class="lp-blog-teaser__meta"><time datetime="${item.datetime}">${escapeHtml(item.display)}</time>
              ${rowBadgesHtml(item.topics, lang)}</div>
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.excerpt)}</span>
            </a>
          </li>`;
}

function lpMarkdownNewsLine(item, lang) {
  const href =
    lang === "ja" ? `../blog/notes/${item.slug}.html` : `../blog-en/notes/${item.slug}.html`;
  if (lang === "ja") {
    return `- ${item.display}　「${item.title}」— [${readLinkLabel("ja")}](${href})`;
  }
  return `- ${item.display}　${item.title}—[${lpReadLinkLabel("en")}](${href}).`;
}

function lpMarkdownTeaserLine(item, lang) {
  const href =
    lang === "ja" ? `../blog/notes/${item.slug}.html` : `../blog-en/notes/${item.slug}.html`;
  return `- ${item.display}　[${item.title}](${href})　${item.excerpt}`;
}

function writeIfChanged(file, next) {
  const current = readUtf8(file);
  if (next === current) return null;
  if (!dryRun) fs.writeFileSync(file, next, "utf8");
  return rel(file);
}

function latestNotes(items, n = 3) {
  return [...items]
    .filter((item) => item.slug && item.datetime)
    .sort((a, b) => b.datetime.localeCompare(a.datetime) || a.slug.localeCompare(b.slug))
    .slice(0, n);
}

function syncLpTeaser(lang, items) {
  const written = [];
  const latest = latestNotes(items, 3);
  if (!latest.length) return written;
  const lpHtml = path.join(root, lang === "ja" ? "index.html" : "index-en.html");
  const lpMd = path.join(root, "原稿", lang === "ja" ? "LP.md" : "LP-en.md");
  const htmlChanged = writeIfChanged(
    lpHtml,
    replaceFirstUlItems(
      readUtf8(lpHtml),
      "lp-blog-teaser__list",
      latest.map((item) => teaserItemHtml(item, lang)),
    ),
  );
  if (htmlChanged) written.push(htmlChanged);
  const mdChanged = writeIfChanged(
    lpMd,
    replaceMarkdownList(
      readUtf8(lpMd),
      lang === "ja" ? "農園ブログ" : "Farm Blog",
      latest.map((item) => lpMarkdownTeaserLine(item, lang)),
    ),
  );
  if (mdChanged) written.push(mdChanged);
  return written;
}

function addNewNoteListings(item, lang) {
  const written = [];
  const listFile = path.join(root, lang === "ja" ? "blog" : "blog-en", "index.html");
  const newsFile = path.join(root, lang === "ja" ? "blog" : "blog-en", "news", "index.html");
  const lpHtml = path.join(root, lang === "ja" ? "index.html" : "index-en.html");
  const lpMd = path.join(root, "原稿", lang === "ja" ? "LP.md" : "LP-en.md");
  const noteHref = `notes/${item.slug}.html`;
  const lpHref = lang === "ja" ? `blog/notes/${item.slug}.html` : `blog-en/notes/${item.slug}.html`;
  const mdHref = lang === "ja" ? `../blog/notes/${item.slug}.html` : `../blog-en/notes/${item.slug}.html`;
  const newsMax = lang === "ja" ? 10 : 5;

  const listChanged = writeIfChanged(
    listFile,
    insertIntoFirstUl(readUtf8(listFile), "blog-list", blogListItemHtml(item, lang), noteHref),
  );
  if (listChanged) written.push(listChanged);

  const newsChanged = writeIfChanged(
    newsFile,
    insertIntoFirstUl(readUtf8(newsFile), "blog-list", newsArchiveItemHtml(item, lang), noteHref),
  );
  if (newsChanged) written.push(newsChanged);

  const lpChanged = writeIfChanged(
    lpHtml,
    insertIntoFirstUl(readUtf8(lpHtml), "news__list", lpNewsItemHtml(item, lang), lpHref, newsMax),
  );
  if (lpChanged) written.push(lpChanged);

  const mdChanged = writeIfChanged(
    lpMd,
    insertMarkdownNews(
      readUtf8(lpMd),
      lang === "ja" ? "新着情報" : "What's New",
      lpMarkdownNewsLine(item, lang),
      mdHref,
      newsMax,
    ),
  );
  if (mdChanged) written.push(mdChanged);

  return written;
}

function publish() {
  const written = [];
  const missingPair = [];
  const unchanged = [];
  const slugMeta = {};
  const created = [];
  const listings = { ja: [], en: [] };

  const ja = TARGETS.find((t) => t.lang === "ja");
  const en = TARGETS.find((t) => t.lang === "en");

  for (const mdFile of listMarkdown(ja.mdDir)) {
    const result = publishNote(ja, mdFile);
    if (result.unchanged) unchanged.push(result.unchanged);
    if (result.written) written.push(result.written);
    if (result.created) created.push({ ...result, lang: "ja" });
    if (result.slug) {
      slugMeta[result.slug] = result;
      listings.ja.push(result);
    }
  }

  const jaSlugs = new Set(listMarkdown(ja.mdDir).map((file) => path.basename(file, ".md")));
  const enSlugs = new Set(listMarkdown(en.mdDir).map((file) => path.basename(file, ".md")));

  const jaSlugLower = new Set([...jaSlugs].map((slug) => slug.toLowerCase()));
  const enSlugLower = new Set([...enSlugs].map((slug) => slug.toLowerCase()));

  for (const mdFile of listMarkdown(en.mdDir)) {
    const slug = path.basename(mdFile, ".md");
    if (!jaSlugLower.has(slug.toLowerCase())) missingPair.push(rel(mdFile));
    const jaMeta = metaForSlug(slugMeta, slug);
    const result = publishNote(en, mdFile, jaMeta?.topics);
    if (result.unchanged) unchanged.push(result.unchanged);
    if (result.written) written.push(result.written);
    if (result.created) created.push({ ...result, lang: "en" });
    if (result.slug) listings.en.push(result);
  }

  for (const slug of jaSlugs) {
    if (!enSlugLower.has(slug.toLowerCase())) missingPair.push(rel(path.join(ja.mdDir, `${slug}.md`)));
  }

  created.sort((a, b) => a.datetime.localeCompare(b.datetime) || a.slug.localeCompare(b.slug));
  for (const item of created) {
    written.push(...addNewNoteListings(item, item.lang));
  }

  written.push(...syncLpTeaser("ja", listings.ja));
  written.push(...syncLpTeaser("en", listings.en));

  const jaListings = listingSlugMeta(listings.ja);
  const enListings = listingSlugMeta(listings.en);

  for (const file of [
    updateListPage(path.join(root, "blog", "index.html"), jaListings, "ja"),
    updateListPage(path.join(root, "blog-en", "index.html"), enListings, "en"),
    updateNewsPage(path.join(root, "blog", "news", "index.html"), jaListings, "ja"),
    updateNewsPage(path.join(root, "blog-en", "news", "index.html"), enListings, "en"),
    updateLpNews(path.join(root, "index.html"), jaListings, "ja"),
    updateLpNews(path.join(root, "index-en.html"), enListings, "en"),
    updateTeaser(path.join(root, "index.html"), jaListings, "ja"),
    updateTeaser(path.join(root, "index-en.html"), enListings, "en"),
    updateLpMarkdownNews(path.join(root, "原稿", "LP.md"), jaListings, "ja"),
    updateLpMarkdownNews(path.join(root, "原稿", "LP-en.md"), enListings, "en"),
  ]) {
    if (file) written.push(file);
  }

  return { written: [...new Set(written)], missingPair, unchanged, created };
}

function addAndPush(written, created = []) {
  if (!written.length) {
    console.log("GitHub へ送る変更はありません。");
    return;
  }
  const mdFiles = written.flatMap((htmlRel) => {
    if (htmlRel.startsWith("blog-en/notes/")) {
      return [`原稿/blog-en/notes/${path.basename(htmlRel, ".html")}.md`];
    }
    if (htmlRel.startsWith("blog/notes/")) {
      return [`原稿/blog/notes/${path.basename(htmlRel, ".html")}.md`];
    }
    if (htmlRel === "index.html") return ["原稿/LP.md"];
    if (htmlRel === "index-en.html") return ["原稿/LP-en.md"];
    return [];
  });
  const files = [...written, ...mdFiles];
  const changed = git(["status", "--porcelain", "--", ...files]);
  if (!changed) {
    console.log("GitHub へ送る変更はありません。");
    return;
  }
  git(["add", "--", ...files]);
  const message = created.length ? "新しい原稿をサイトへ載せる。" : "ブログの原稿をサイトへ写す。";
  git(["commit", "-m", message, "--", ...files]);
  try {
    git(["push"], { stdio: "inherit" });
  } catch (error) {
    console.error("コミットは済みました。push はまだです。");
    throw error;
  }
  console.log("コミットも push も完了しています。");
}

function main() {
  console.log(doPush ? "原稿をサイト用HTMLに写し、GitHub へ送ります。" : "原稿をサイト用HTMLに写します。まだ GitHub へは送りません。");
  warnIfLpChanged();
  const { written, missingPair, created } = publish();

  if (created.length) {
    console.log(dryRun ? "新しく載せる原稿:" : "新しい原稿を載せました:");
    for (const item of created) console.log(`  ${item.lang === "ja" ? "日本語" : "英語"} ${item.slug}`);
  }

  if (written.length) {
    console.log(dryRun ? "写す対象:" : "写しました:");
    for (const file of written) console.log(`  ${file}`);
  } else {
    console.log("写す直しはありません。公開ページは原稿と同じ文面です。");
  }

  if (missingPair.length) {
    console.log("対になる日英の原稿がまだそろっていません:");
    for (const file of missingPair) console.log(`  ${file}`);
  }

  if (dryRun) return;
  if (doPush) addAndPush(written, created);
  else if (written.length) {
    console.log("");
    console.log("サイトに載せるには、VS Code でタスク「サイトに載せる」を実行するか、ターミナルで次を打ってください。");
    console.log("  npm run サイトに載せる");
  }
}

function isMain() {
  const self = fileURLToPath(import.meta.url);
  const argv1 = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return Boolean(argv1) && path.normalize(self) === path.normalize(argv1);
}

if (isMain()) {
  try {
    main();
  } catch (error) {
    console.error("失敗しました。");
    console.error(error.message || error);
    process.exitCode = 1;
  }
}

export {
  insertIntoFirstUl,
  insertMarkdownNews,
  replaceFirstUlItems,
  replaceMarkdownList,
  latestNotes,
  teaserExcerpt,
  lpMarkdownNewsLine,
  lpMarkdownTeaserLine,
};
