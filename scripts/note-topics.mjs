/**
 * ブログの話題バッジ。独り言 / 記事とは別軸。
 *
 * タイトルから辞書で自動付与する。日付行に 1〜3 語あれば、そちらを優先する。
 * 例: 記事　コシヒカリ　2026.8.27
 *
 *   node scripts/note-topics.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const TOPIC_ORDER = [
  "rice",
  "vegetables",
  "fields",
  "farming",
  "ai",
  "skiing",
  "english",
  "health",
  "food",
  "drinks",
  "family",
  "azuma",
  "fx",
  "hobbies",
];

export const TOPICS = [
  {
    id: "rice",
    ja: "田んぼ",
    en: "Rice",
    keywords: {
      ja: ["コシヒカリ", "米", "田んぼ", "稲", "収穫", "田植え"],
      en: ["Koshihikari", "rice", "paddy", "rice field"],
    },
  },
  {
    id: "vegetables",
    ja: "野菜",
    en: "Vegetables",
    keywords: {
      ja: ["じゃがいも", "キャベツ", "白菜", "きゅうり", "野菜", "トマト", "なす"],
      en: ["potato", "cabbage", "cucumber", "vegetable", "tomato", "eggplant"],
    },
  },
  {
    id: "fields",
    ja: "畑",
    en: "Fields",
    keywords: {
      ja: ["畑", "草むしり", "耕す", "土", "肥料", "種まき"],
      en: ["field", "weeding", "till", "soil", "fertilizer", "sowing"],
    },
  },
  {
    id: "farming",
    ja: "農業全般",
    en: "Farming",
    keywords: {
      ja: ["農業", "農家", "農園", "農作業", "出荷", "販売"],
      en: ["farming", "farmer", "farmwork", "shipping"],
    },
  },
  {
    id: "ai",
    ja: "AI",
    en: "AI",
    keywords: {
      ja: ["AI", "Cursor", "自動化", "Python", "プログラム", "VS Code", "VSコード", "VSCode"],
      en: ["AI", "Cursor", "automation", "Python", "program", "VS Code", "VSCode"],
    },
  },
  {
    id: "skiing",
    ja: "スキー",
    en: "Skiing",
    keywords: {
      ja: ["スキー", "ゲレンデ", "雪", "インストラクター"],
      en: ["ski", "slope", "snow", "instructor"],
    },
  },
  {
    id: "english",
    ja: "英語学習",
    en: "English",
    keywords: {
      ja: ["英語", "英検", "リスニング", "英作文"],
      en: ["English", "Eiken", "listening", "composition"],
    },
  },
  {
    id: "health",
    ja: "健康",
    en: "Health",
    keywords: {
      ja: ["健康", "体調", "運動", "サプリ"],
      en: ["health", "condition", "exercise", "supplement"],
    },
  },
  {
    id: "food",
    ja: "食べる",
    en: "Food",
    keywords: {
      ja: ["食べる", "料理", "レシピ", "食事", "ご飯", "おかず"],
      en: ["cook", "recipe", "meal", "dishes"],
    },
  },
  {
    id: "drinks",
    ja: "飲む",
    en: "Drinks",
    keywords: {
      ja: ["飲む", "お茶", "コーヒー", "白湯", "水", "お酒"],
      en: ["drink", "tea", "coffee", "sake", "alcohol"],
    },
  },
  {
    id: "family",
    ja: "家族",
    en: "Family",
    keywords: {
      ja: ["家族", "妻", "息子", "娘", "子供", "孫"],
      en: ["family", "wife", "son", "daughter", "child", "grandchild"],
    },
  },
  {
    id: "azuma",
    ja: "地域・吾妻",
    en: "Azuma",
    keywords: {
      ja: ["吾妻", "中之条", "群馬", "地域", "町", "温泉"],
      en: ["Azuma", "Nakanojo", "Gunma", "onsen"],
    },
  },
  {
    id: "fx",
    ja: "FX",
    en: "FX",
    keywords: {
      ja: ["FX", "為替", "ドル", "円", "トレード", "相場"],
      en: ["FX", "forex", "dollar", "yen", "trade"],
    },
  },
  {
    id: "hobbies",
    ja: "趣味",
    en: "Hobbies",
    keywords: {
      ja: ["趣味", "読書", "音楽", "映画"],
      en: ["hobby", "reading", "music", "movie", "film"],
    },
  },
];

const LATIN_WORD = /^(?:[A-Za-z][A-Za-z0-9+.#]*)$/;
const MAX_TOPICS = 3;
const BLOCKED_COMPOUNDS = {
  なす: ["織りなす", "みなす", "見なす"],
  水: ["花水", "水やり", "水稲", "水を引く", "水管理"],
};

function toHiragana(text) {
  return String(text || "").replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  );
}

function escapeRe(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rawTermIndex(haystack, term, from = 0) {
  const text = String(haystack || "");
  if (term === "円") {
    const slice = text.slice(from);
    const m = slice.match(/(?<![万億])円/);
    return m ? from + m.index : -1;
  }
  if (LATIN_WORD.test(term) || /[A-Za-z]/.test(term)) {
    const re = new RegExp(`(?:^|[^A-Za-z])(${escapeRe(term)})(?![A-Za-z])`, "ig");
    re.lastIndex = from;
    const m = re.exec(text);
    if (!m) return -1;
    return m.index + m[0].length - m[1].length;
  }
  const folded = toHiragana(text);
  return folded.indexOf(toHiragana(term), from);
}

function coveredByLongerTerm(haystack, idx, term) {
  return TERMS.some((other) => {
    if (other.surface.length <= term.length) return false;
    let from = 0;
    while (from <= idx) {
      const otherIdx = rawTermIndex(haystack, other.surface, from);
      if (otherIdx < 0 || otherIdx > idx) return false;
      if (otherIdx <= idx && otherIdx + other.surface.length >= idx + term.length) return true;
      from = otherIdx + 1;
    }
    return false;
  });
}

function insideBlockedCompound(haystack, idx, term) {
  const blocked = BLOCKED_COMPOUNDS[term] || BLOCKED_COMPOUNDS[toHiragana(term)] || [];
  const foldedHay = toHiragana(haystack);
  const foldedTerm = toHiragana(term);
  return blocked.some((compound) => {
    const foldedCompound = toHiragana(compound);
    const inner = foldedCompound.indexOf(foldedTerm);
    if (inner < 0) return false;
    let from = 0;
    while (from <= idx) {
      const cIdx = foldedHay.indexOf(foldedCompound, from);
      if (cIdx < 0) return false;
      if (cIdx + inner === idx) return true;
      from = cIdx + 1;
    }
    return false;
  });
}

function termIndex(haystack, term) {
  let from = 0;
  while (from < String(haystack || "").length) {
    const idx = rawTermIndex(haystack, term, from);
    if (idx < 0) return -1;
    if (
      !coveredByLongerTerm(haystack, idx, term) &&
      !insideBlockedCompound(haystack, idx, term) &&
      !(term === "水" && /[・、]/.test(String(haystack)[idx - 1] || ""))
    ) {
      return idx;
    }
    from = idx + 1;
  }
  return -1;
}

function allTerms() {
  const terms = [];
  for (const topic of TOPICS) {
    terms.push({ topic: topic.id, surface: topic.ja });
    if (topic.en !== topic.ja) terms.push({ topic: topic.id, surface: topic.en });
    for (const word of [...topic.keywords.ja, ...topic.keywords.en]) {
      terms.push({ topic: topic.id, surface: word });
    }
  }
  const seen = new Set();
  return terms
    .filter((term) => {
      const key = `${term.topic}\t${toHiragana(term.surface).toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.surface.length - a.surface.length || a.topic.localeCompare(b.topic));
}

const TERMS = allTerms();

export function topicLabel(id, lang) {
  const topic = TOPICS.find((item) => item.id === id);
  if (!topic) return id;
  return lang === "en" ? topic.en : topic.ja;
}

export function parseManualTokens(middle) {
  const text = String(middle || "").trim();
  if (!text) return [];
  const hits = [];
  for (const term of TERMS) {
    const idx = termIndex(text, term.surface);
    if (idx >= 0) hits.push({ ...term, idx });
  }
  hits.sort((a, b) => a.idx - b.idx || b.surface.length - a.surface.length);
  const topics = [];
  const tokens = [];
  for (const hit of hits) {
    if (topics.includes(hit.topic)) continue;
    topics.push(hit.topic);
    tokens.push(hit.surface);
    if (topics.length >= MAX_TOPICS) break;
  }
  return tokens;
}

export function topicsFromTokens(tokens) {
  const found = [];
  for (const token of tokens || []) {
    const text = String(token || "").trim();
    if (!text) continue;
    const exact = TERMS.find(
      (term) => toHiragana(text).toLowerCase() === toHiragana(term.surface).toLowerCase(),
    );
    const topic = exact?.topic || TERMS.find((term) => termIndex(text, term.surface) >= 0)?.topic;
    if (topic && !found.includes(topic)) found.push(topic);
    if (found.length >= MAX_TOPICS) break;
  }
  return TOPIC_ORDER.filter((id) => found.includes(id)).slice(0, MAX_TOPICS);
}

export function extractTopicsFromTitle(title) {
  const text = String(title || "").replace(/\*\*/g, "");
  const found = new Set();
  for (const term of TERMS) {
    if (termIndex(text, term.surface) >= 0) found.add(term.topic);
  }
  return TOPIC_ORDER.filter((id) => found.has(id)).slice(0, MAX_TOPICS);
}

export function resolveNoteTopics({ title, keywords, forcedTopics } = {}) {
  if (Array.isArray(forcedTopics)) return forcedTopics.slice(0, MAX_TOPICS);
  const manual = topicsFromTokens(keywords);
  if (manual.length) return manual;
  return extractTopicsFromTitle(title);
}

function isMain() {
  const self = fileURLToPath(import.meta.url);
  const argv1 = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return Boolean(argv1) && path.normalize(self) === path.normalize(argv1);
}

if (isMain()) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const dir = path.join(root, "原稿", "blog", "notes");
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
    .map((name) => path.join(dir, name));

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const title = (raw.split("\n")[0] || "").replace(/^#\s+/, "");
    const topics = extractTopicsFromTitle(title);
    const labels = topics.map((id) => topicLabel(id, "ja")).join("・") || "—";
    console.log(`${path.basename(file)}\t${labels}\t${title}`);
  }
}
