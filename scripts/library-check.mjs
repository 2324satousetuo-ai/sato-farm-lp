/**
 * 農園図書館にまだ入っていない原稿を出す。
 * node scripts/library-check.mjs
 * 未掲載があれば終了コード 1。棚への振り分けは自動ではしない。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data/library.json"), "utf8"));
const known = new Set(
  Object.keys(catalog.articles || {}).map((file) => file.replace(/\.html$/i, "").toLowerCase()),
);

const notesDir = path.join(root, "原稿/blog/notes");
const missing = fs
  .readdirSync(notesDir)
  .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
  .map((name) => name.replace(/\.md$/i, ""))
  .filter((stem) => !known.has(stem.toLowerCase()))
  .sort();

const shelfIds = new Set();
const unknownOnShelf = [];
for (const shelf of catalog.shelves || []) {
  if (shelfIds.has(shelf.id)) unknownOnShelf.push(`棚idが重複: ${shelf.id}`);
  shelfIds.add(shelf.id);
  for (const file of shelf.items || []) {
    if (!catalog.articles?.[file]) unknownOnShelf.push(`${shelf.id}: articles にない ${file}`);
  }
}

if (unknownOnShelf.length) {
  console.log(unknownOnShelf.join("\n"));
}
if (missing.length) {
  console.log("まだ棚に入っていない原稿:");
  for (const stem of missing) console.log(`- ${stem}.md`);
  process.exitCode = 1;
} else if (!unknownOnShelf.length) {
  console.log("原稿はすべて、いずれかの棚に入っています。");
}
