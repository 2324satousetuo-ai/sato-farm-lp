import assert from "node:assert/strict";
import {
  extractTopicsFromBody,
  extractTopicsFromTitle,
  parseManualTokens,
  resolveNoteTopics,
  topicLabel,
  topicsFromTokens,
} from "./note-topics.mjs";
import { formatDateLine, parseDateLine, readLinkLabel } from "./note-category.mjs";

assert.deepEqual(extractTopicsFromTitle("コシヒカリ――美味しさと、農家の技術が育てた米"), ["rice", "farming"]);
assert.deepEqual(extractTopicsFromTitle("夏の主役、キュウリとナス ― 似て非なる二人の物語"), ["vegetables"]);
assert.deepEqual(extractTopicsFromTitle("白菜の種まきと、自然の猛威。そして「日本の底力」"), ["vegetables", "fields"]);
assert.deepEqual(extractTopicsFromTitle("AIとの付き合い方を見直す日。Cursorから無料のVS Codeへ、そして自動化へ"), ["ai"]);
assert.deepEqual(extractTopicsFromTitle("しばらくお休みします"), []);
assert.deepEqual(extractTopicsFromTitle("健康か？"), ["health"]);
assert.deepEqual(extractTopicsFromTitle("夜明け前の畑と田んぼからはじまる物語"), ["rice", "fields"]);
assert.deepEqual(extractTopicsFromTitle("光・風・水が織りなす稲田の朝"), ["rice"]);
assert.deepEqual(extractTopicsFromTitle("命が芽吹く「花水」の季節"), []);
assert.deepEqual(extractTopicsFromTitle("草を刈り、水を引く。八月最初の恒例行事"), []);
assert.deepEqual(extractTopicsFromTitle("吾妻の温泉"), ["azuma"]);

assert.deepEqual(extractTopicsFromBody("5月20日に田植えを終えて。田んぼを満たす。稲の花。中之条町。"), ["rice", "azuma"]);
assert.deepEqual(extractTopicsFromBody("コップ一杯の水を飲む。英語版の原稿。"), []);
assert.deepEqual(extractTopicsFromBody("Cursor Proくん、またやってくれました。"), ["ai"]);
assert.deepEqual(
  extractTopicsFromBody("朝、コップ一杯の水を飲む。畑に立つ。田んぼにも立つ。野菜を食べる。"),
  ["rice", "vegetables", "fields"],
);

assert.deepEqual(parseManualTokens("コシヒカリ"), ["コシヒカリ"]);
assert.deepEqual(topicsFromTokens(["コシヒカリ"]), ["rice"]);
assert.deepEqual(topicsFromTokens(["田んぼ", "AI"]), ["rice", "ai"]);
assert.deepEqual(topicsFromTokens(["Rice"]), ["rice"]);
assert.deepEqual(parseManualTokens(""), []);

assert.deepEqual(
  resolveNoteTopics({ title: "コシヒカリ――美味しさと、農家の技術が育てた米", keywords: ["AI"] }),
  ["ai"],
);
assert.deepEqual(
  resolveNoteTopics({ title: "しばらくお休みします", forcedTopics: ["fields"] }),
  ["fields"],
);
assert.deepEqual(
  resolveNoteTopics({
    title: "しばらくお休みします",
    body: "Cursor Proくん、またやってくれました。",
  }),
  ["ai"],
);
assert.deepEqual(
  resolveNoteTopics({
    title: "健康か？",
    body: "畑に立つ。田んぼにも立つ。野菜を食べる。水を飲む。",
  }),
  ["health", "rice", "vegetables"],
);
assert.deepEqual(
  resolveNoteTopics({
    title: "毎日の「面倒」をなくす。2ヶ月かけて作った原稿アップの仕組み",
    body: "佐藤農園のLPでは、日本語版と英語版の原稿を更新してきた。Cursorの課金枠。",
  }),
  ["ai"],
);

const ja = parseDateLine("コシヒカリ　2026.8.27", "ja");
assert.deepEqual(ja.keywords, ["コシヒカリ"]);
assert.equal(ja.year, 2026);
assert.equal(ja.month, 8);
assert.equal(ja.day, 27);
assert.equal(formatDateLine(ja, "ja"), "コシヒカリ　2026.8.27");

const plain = parseDateLine("2026.8.19", "ja");
assert.deepEqual(plain.keywords, []);
assert.equal(formatDateLine(plain, "ja"), "2026.8.19");

const legacy = parseDateLine("記事　コシヒカリ　2026.8.27", "ja");
assert.deepEqual(legacy.keywords, ["コシヒカリ"]);
assert.equal(formatDateLine(legacy, "ja"), "コシヒカリ　2026.8.27");

const legacyPlain = parseDateLine("独り言　2026.8.19", "ja");
assert.deepEqual(legacyPlain.keywords, []);
assert.equal(formatDateLine(legacyPlain, "ja"), "2026.8.19");

const locked = parseDateLine("記事固定　2026.8.16", "ja");
assert.deepEqual(locked.keywords, []);
assert.equal(formatDateLine(locked, "ja"), "2026.8.16");

const en = parseDateLine("Rice　August 27, 2026", "en");
assert.deepEqual(en.keywords, ["Rice"]);
assert.equal(formatDateLine(en, "en"), "Rice　August 27, 2026");

const enPlain = parseDateLine("August 19, 2026", "en");
assert.deepEqual(enPlain.keywords, []);
assert.equal(formatDateLine(enPlain, "en"), "August 19, 2026");

const enLegacy = parseDateLine("Random Thoughts　August 19, 2026", "en");
assert.deepEqual(enLegacy.keywords, []);
assert.equal(formatDateLine(enLegacy, "en"), "August 19, 2026");

assert.equal(topicLabel("azuma", "ja"), "地域・吾妻");
assert.equal(topicLabel("azuma", "en"), "Azuma");
assert.equal(readLinkLabel("ja"), "読む");
assert.equal(readLinkLabel("en"), "Read");

console.log("note-topics: ok");
