/**
 * 独り言の Markdown 原稿を、公開用 HTML に写す。
 * VS Code からは「サイトに載せる」タスク、または npm run サイトに載せる で実行する。
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

function parseMeta(line, lang) {
  if (lang === "ja") {
    const m = line.match(/独り言\s*[　 ]\s*(\d{4})\.(\d{1,2})\.(\d{1,2})/);
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    return {
      category: "独り言",
      datetime: `${year}-${pad2(month)}-${pad2(day)}`,
      display: `${year}.${month}.${day}`,
    };
  }
  const m = line.match(/Random Thoughts\s*[　 ]\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/i);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  const day = Number(m[2]);
  const year = Number(m[3]);
  if (!month) return null;
  return {
    category: "Random Thoughts",
    datetime: `${year}-${pad2(month)}-${pad2(day)}`,
    display: `${m[1]} ${day}, ${year}`,
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

function updateHtml(html, note, titleSuffix, body) {
  const titleText = note.titleMd.replace(/\*\*/g, "");
  let next = html;
  next = replaceFirst(next, /<title>[^<]*<\/title>/, `<title>${escapeHtml(titleText)}${titleSuffix}</title>`);
  next = replaceFirst(
    next,
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeAttr(titleText)}${titleSuffix}">`,
  );
  next = replaceFirst(
    next,
    /<time datetime="[^"]*">[^<]*<\/time>/,
    `<time datetime="${note.datetime}">${note.display}</time>`,
  );
  next = replaceFirst(
    next,
    /<h1 class="blog-article__title">[\s\S]*?<\/h1>/,
    `<h1 class="blog-article__title">${inline(note.titleMd)}</h1>`,
  );
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
    console.log("※ トップページ原稿（LP.md / LP-en.md）の直しは、この命令では写しません。Cursor に頼んでください。");
  } catch {
    // git が使えないときは無視
  }
}

function publish() {
  const written = [];
  const skippedNew = [];
  const unchanged = [];

  for (const target of TARGETS) {
    for (const mdFile of listMarkdown(target.mdDir)) {
      const slug = path.basename(mdFile, ".md");
      const htmlFile = path.join(target.htmlDir, `${slug}.html`);
      if (!fs.existsSync(htmlFile)) {
        skippedNew.push(rel(mdFile));
        continue;
      }
      const md = decodeMdEntities(readUtf8(mdFile));
      const html = readUtf8(htmlFile);
      let note;
      let body;
      let next;
      try {
        note = parseNote(md, target.lang);
        body = renderBody(note.bodyLines, html);
        next = updateHtml(html, note, target.titleSuffix, body);
      } catch (error) {
        throw new Error(`${rel(mdFile)}: ${error.message}`);
      }
      const titleText = note.titleMd.replace(/\*\*/g, "");
      const currentTitle = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
      const currentH1 = (html.match(/<h1 class="blog-article__title">([\s\S]*?)<\/h1>/) || [])[1] || "";
      const same =
        plainText(currentTitle) === plainText(`${titleText}${target.titleSuffix}`) &&
        plainText(currentH1) === plainText(inline(note.titleMd)) &&
        html.includes(`datetime="${note.datetime}"`) &&
        html.includes(`>${note.display}</time>`) &&
        plainText(extractBody(html)) === plainText(body);
      if (same) {
        unchanged.push(rel(mdFile));
        continue;
      }
      if (!dryRun) fs.writeFileSync(htmlFile, next, "utf8");
      written.push(rel(htmlFile));
    }
  }

  return { written, skippedNew, unchanged };
}

function addAndPush(written) {
  if (!written.length) {
    console.log("GitHub へ送る変更はありません。");
    return;
  }
  const mdFiles = written.map((htmlRel) => {
    if (htmlRel.startsWith("blog-en/notes/")) {
      return `原稿/blog-en/notes/${path.basename(htmlRel, ".html")}.md`;
    }
    return `原稿/blog/notes/${path.basename(htmlRel, ".html")}.md`;
  });
  const files = [...written, ...mdFiles];
  const changed = git(["status", "--porcelain", "--", ...files]);
  if (!changed) {
    console.log("GitHub へ送る変更はありません。");
    return;
  }
  git(["add", "--", ...files]);
  git(["commit", "-m", "独り言の原稿をサイトへ写す。", "--", ...files]);
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
  const { written, skippedNew } = publish();

  if (written.length) {
    console.log(dryRun ? "写す対象:" : "写しました:");
    for (const file of written) console.log(`  ${file}`);
  } else {
    console.log("写す直しはありません。公開ページは原稿と同じ文面です。");
  }

  if (skippedNew.length) {
    console.log("ページがまだない原稿（新しい記事の掲載は Cursor へ）:");
    for (const file of skippedNew) console.log(`  ${file}`);
  }

  if (dryRun) return;
  if (doPush) addAndPush(written);
  else if (written.length) {
    console.log("");
    console.log("サイトに載せるには、VS Code でタスク「サイトに載せる」を実行するか、ターミナルで次を打ってください。");
    console.log("  npm run サイトに載せる");
  }
}

try {
  main();
} catch (error) {
  console.error("失敗しました。");
  console.error(error.message || error);
  process.exitCode = 1;
}
