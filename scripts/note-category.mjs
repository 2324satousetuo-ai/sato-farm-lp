/**
 * 独り言 / 記事 の自動判定。
 *
 * 独り言：独り言の色彩が強い。口調は ～だ、～する、～と思う。
 * 記事：読者や顧客を意識した内容。口調は です・ます。
 *
 * 英語原稿は、対になる日本語原稿の判定に合わせる。
 * 直接実行すると、日本語原稿の判定結果を表示する。
 *
 *   node scripts/note-category.mjs
 *   node scripts/note-category.mjs 原稿/blog/notes/foo.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractTopicsFromTitle, parseManualTokens, topicLabel } from "./note-topics.mjs";

const READER_MARKERS = [
  "お客様",
  "ご案内",
  "会員登録",
  "ご注文",
  "お届け",
  "ご購入",
  "ご登録",
  "ご覧ください",
  "いただけ",
  "ませんか",
  "お願いいたします",
  "お願い致します",
];

const POLITE_RE = /です[。！？\s「」『』（）]|でした[。！？\s]|ます[。！？\s「」『』（）]|ました[。！？\s]|ません[。！？\s]|ください[。！？\s]|でしょう[。！？\s]|いたします[。！？\s]|いただきます[。！？\s]/g;
const PLAIN_RE = /だ[。！？]|だった[。！？]|である[。！？]|と思う[。！？]|のだ[。！？]|からだ[。！？]/g;

export const CATEGORY = {
  ja: { note: "独り言", article: "記事" },
  en: { note: "Random Thoughts", article: "Article" },
};

export function categoryLabel(kind, lang) {
  return kind === "article" ? CATEGORY[lang].article : CATEGORY[lang].note;
}

export function readLinkLabel(kind, lang) {
  if (lang === "en") return kind === "article" ? "Read the article" : "Read the note";
  return kind === "article" ? "記事を読む" : "独り言を読む";
}

function count(re, text) {
  const m = text.match(re);
  return m ? m.length : 0;
}

function stripForClassify(text) {
  return String(text || "")
    .replace(/^>.*$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/`[^`]+`/g, "");
}

export function classifyJapaneseBody(title, body) {
  const text = stripForClassify(`${title}\n${body}`);
  const polite = count(POLITE_RE, text);
  const plain = count(PLAIN_RE, text);
  const readerHits = READER_MARKERS.filter((marker) => text.includes(marker)).length;
  const total = polite + plain;
  const politeRatio = total ? polite / total : 0;

  const asArticle =
    (polite >= 5 && politeRatio >= 0.6 && readerHits >= 2) ||
    (polite >= 10 && politeRatio >= 0.75 && readerHits >= 1);

  return {
    kind: asArticle ? "article" : "note",
    polite,
    plain,
    readerHits,
    politeRatio,
  };
}

export function parseCategoryLine(line, lang) {
  if (lang === "ja") {
    const m = String(line || "").match(/^(独り言|記事)(固定)?[　 ]+(.+)$/);
    if (!m) return null;
    const tail = m[3].trim();
    const date = tail.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})\s*$/);
    if (!date) return null;
    return {
      kind: m[1] === "記事" ? "article" : "note",
      locked: Boolean(m[2]),
      keywords: parseManualTokens(tail.slice(0, date.index)),
      year: Number(date[1]),
      month: Number(date[2]),
      day: Number(date[3]),
    };
  }
  const m = String(line || "").match(/^(Random Thoughts|Article)( Fixed)?[　 ]+(.+)$/i);
  if (!m) return null;
  const tail = m[3].trim();
  const date = tail.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s*$/);
  if (!date) return null;
  return {
    kind: /^article$/i.test(m[1]) ? "article" : "note",
    locked: Boolean(m[2]),
    keywords: parseManualTokens(tail.slice(0, date.index)),
    monthName: date[1],
    day: Number(date[2]),
    year: Number(date[3]),
  };
}

function keywordMiddle(parsed) {
  const keywords = (parsed?.keywords || []).filter(Boolean).slice(0, 3);
  return keywords.length ? `${keywords.join("　")}　` : "";
}

export function formatCategoryLine(kind, parsed, lang, locked = false) {
  const mid = keywordMiddle(parsed);
  if (lang === "ja") {
    return `${categoryLabel(kind, "ja")}${locked ? "固定" : ""}　${mid}${parsed.year}.${parsed.month}.${parsed.day}`;
  }
  const lock = locked ? " Fixed" : "";
  return `${categoryLabel(kind, "en")}${lock}　${mid}${parsed.monthName} ${parsed.day}, ${parsed.year}`;
}

export function replaceCategoryLine(md, nextLine) {
  return md.replace(/^(独り言|記事)(固定)?\s*[　 ].+$/m, nextLine).replace(
    /^(Random Thoughts|Article)( Fixed)?\s*[　 ].+$/im,
    nextLine,
  );
}

export function lpReadLinkLabel(kind, lang) {
  if (lang === "en") return kind === "article" ? "Read the article" : "Read the post";
  return readLinkLabel(kind, lang);
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
    const meta = parseCategoryLine(lines.find((line) => parseCategoryLine(line, "ja")) || "", "ja");
    const bodyStart = lines.findIndex((line) => parseCategoryLine(line, "ja")) + 1;
    const judged = classifyJapaneseBody(title, lines.slice(Math.max(bodyStart, 1)).join("\n"));
    const current = meta ? (meta.kind === "article" ? "記事" : "独り言") : "?";
    const next = judged.kind === "article" ? "記事" : "独り言";
    const mark = current === next ? " " : "*";
    const topics = extractTopicsFromTitle(title).map((id) => topicLabel(id, "ja")).join("・") || "—";
    console.log(
      `${mark} ${path.basename(file)}\t${current} → ${next}\t${topics}\tですます:${judged.polite} だ:${judged.plain} 読者:${judged.readerHits}`,
    );
  }
}
