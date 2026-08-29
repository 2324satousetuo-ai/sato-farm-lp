/**
 * ブログ原稿の日付行。話題は note-topics.mjs。
 *
 * 新しい書き方:
 *   2026.8.28
 *   コシヒカリ　2026.8.27
 *   August 28, 2026
 *   Rice　August 27, 2026
 *
 * 古い「独り言／記事」行も読む。書き戻すときは新しい形にする。
 *
 *   node scripts/note-category.mjs
 *   node scripts/note-category.mjs 原稿/blog/notes/foo.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseManualTokens, resolveNoteTopics, topicLabel } from "./note-topics.mjs";

const JA_DATE = /(\d{4})\.(\d{1,2})\.(\d{1,2})\s*$/;
const EN_DATE = /([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s*$/;
const JA_PREFIX = /^(?:独り言|記事)(?:固定)?[　 ]+/;
const EN_PREFIX = /^(?:Random Thoughts|Article)(?: Fixed)?[　 ]+/i;

export function readLinkLabel(lang) {
  return lang === "en" ? "Read" : "読む";
}

export function lpReadLinkLabel(lang) {
  return readLinkLabel(lang);
}

function keywordMiddle(parsed) {
  const keywords = (parsed?.keywords || []).filter(Boolean).slice(0, 3);
  return keywords.length ? `${keywords.join("　")}　` : "";
}

export function parseDateLine(line, lang) {
  let text = String(line || "").trim();
  if (!text) return null;
  if (lang === "ja") {
    text = text.replace(JA_PREFIX, "");
    const date = text.match(JA_DATE);
    if (!date) return null;
    return {
      keywords: parseManualTokens(text.slice(0, date.index)),
      year: Number(date[1]),
      month: Number(date[2]),
      day: Number(date[3]),
    };
  }
  text = text.replace(EN_PREFIX, "");
  const date = text.match(EN_DATE);
  if (!date) return null;
  return {
    keywords: parseManualTokens(text.slice(0, date.index)),
    monthName: date[1],
    day: Number(date[2]),
    year: Number(date[3]),
  };
}

export function parseCategoryLine(line, lang) {
  return parseDateLine(line, lang);
}

export function formatDateLine(parsed, lang) {
  const mid = keywordMiddle(parsed);
  if (lang === "ja") {
    return `${mid}${parsed.year}.${parsed.month}.${parsed.day}`;
  }
  return `${mid}${parsed.monthName} ${parsed.day}, ${parsed.year}`;
}

export function formatCategoryLine(parsed, lang) {
  return formatDateLine(parsed, lang);
}

export function replaceDateLine(md, nextLine) {
  const next = String(md || "")
    .replace(/^(?:独り言|記事)(?:固定)?[　 ].+$/m, nextLine)
    .replace(/^(?:Random Thoughts|Article)(?: Fixed)?[　 ].+$/im, nextLine);
  if (next !== md) return next;
  return String(md || "")
    .replace(/^(?:[^\n]*?[　 ])?\d{4}\.\d{1,2}\.\d{1,2}\s*$/m, nextLine)
    .replace(/^(?:[^\n]*?[　 ])?[A-Za-z]+\s+\d{1,2},\s*\d{4}\s*$/im, nextLine);
}

export function replaceCategoryLine(md, nextLine) {
  return replaceDateLine(md, nextLine);
}

function isMain() {
  const self = fileURLToPath(import.meta.url);
  const argv1 = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return Boolean(argv1) && path.normalize(self) === path.normalize(argv1);
}

if (isMain()) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const targets = process.argv.slice(2);
  const files = targets.length
    ? targets.map((file) => path.resolve(file))
    : fs
        .readdirSync(path.join(root, "原稿", "blog", "notes"))
        .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
        .map((name) => path.join(root, "原稿", "blog", "notes", name));

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const lines = raw.split("\n");
    const title = (lines[0] || "").replace(/^#\s+/, "");
    const metaLine = lines.find((line) => parseDateLine(line, "ja")) || "";
    const meta = parseDateLine(metaLine, "ja");
    const bodyStart = lines.findIndex((line) => parseDateLine(line, "ja")) + 1;
    const body = lines.slice(Math.max(bodyStart, 1)).join("\n");
    const topics = resolveNoteTopics({
      title,
      body,
      keywords: meta?.keywords,
    })
      .map((id) => topicLabel(id, "ja"))
      .join("・") || "—";
    const date = meta ? `${meta.year}.${meta.month}.${meta.day}` : "?";
    const manual = meta?.keywords?.length ? meta.keywords.join("・") : "自動";
    console.log(`${path.basename(file)}\t${date}\t${manual}\t${topics}`);
  }
}
