import assert from "node:assert/strict";
import {
  extractTopicsFromTitle,
  parseManualTokens,
  resolveNoteTopics,
  topicLabel,
  topicsFromTokens,
} from "./note-topics.mjs";
import { formatCategoryLine, parseCategoryLine } from "./note-category.mjs";

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

const ja = parseCategoryLine("記事　コシヒカリ　2026.8.27", "ja");
assert.equal(ja.kind, "article");
assert.deepEqual(ja.keywords, ["コシヒカリ"]);
assert.equal(ja.year, 2026);
assert.equal(ja.month, 8);
assert.equal(ja.day, 27);
assert.equal(formatCategoryLine("article", ja, "ja", false), "記事　コシヒカリ　2026.8.27");

const plain = parseCategoryLine("独り言　2026.8.19", "ja");
assert.deepEqual(plain.keywords, []);
assert.equal(formatCategoryLine("note", plain, "ja", false), "独り言　2026.8.19");

const locked = parseCategoryLine("記事固定　2026.8.16", "ja");
assert.equal(locked.locked, true);
assert.deepEqual(locked.keywords, []);

const en = parseCategoryLine("Article　Rice　August 27, 2026", "en");
assert.equal(en.kind, "article");
assert.deepEqual(en.keywords, ["Rice"]);
assert.equal(formatCategoryLine("article", en, "en", false), "Article　Rice　August 27, 2026");

const enPlain = parseCategoryLine("Random Thoughts　August 19, 2026", "en");
assert.deepEqual(enPlain.keywords, []);
assert.equal(topicLabel("azuma", "ja"), "地域・吾妻");
assert.equal(topicLabel("azuma", "en"), "Azuma");

console.log("note-topics: ok");
