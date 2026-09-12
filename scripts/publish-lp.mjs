/**
 * LP原稿の「収穫状況」と「よくある質問」を、トップページHTMLへ写す。
 * publish-notes.mjs から呼ばれる。VS Code の「サイトに載せる」でも動く。
 */
import fs from "node:fs";
import path from "node:path";

const HARVEST = {
  ja: {
    heading: "収穫状況",
    harvested: "収穫しました",
    harvesting: "収穫中です",
  },
  en: {
    heading: "Harvest",
    harvested: "Harvested",
    harvesting: "Currently harvesting",
  },
};

const FAQ_HEADING = {
  ja: "よくある質問",
  en: "Frequently asked questions",
};

function readUtf8(file) {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
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

  let out = String(text).replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escapeHtml(code)}</code>`));
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
    stash(`<a href="${escapeAttr(href)}">${escapeHtml(label)}</a>`),
  );
  out = out.replace(/\*\*([\s\S]+?)\*\*/g, (_, bold) => stash(`<strong>${escapeHtml(bold)}</strong>`));
  out = out.replace(/\*([^*\n]+)\*/g, (_, italic) => stash(`<em>${escapeHtml(italic)}</em>`));
  out = escapeHtml(out);
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => slots[Number(i)]);
}

function extractSection(md, heading, level) {
  const token = `${"#".repeat(level)} ${heading}`;
  const idx = md.indexOf(token);
  if (idx < 0) throw new Error(`見出しがありません: ${heading}`);
  const after = md.indexOf("\n", idx);
  const rest = after < 0 ? "" : md.slice(after + 1);
  const stop = level === 2 ? /\n## / : /\n(?:## |### )/;
  const end = rest.search(stop);
  return (end < 0 ? rest : rest.slice(0, end))
    .replace(/(?:\n+---\s*)+$/g, "")
    .replace(/\n+$/, "");
}

function splitCrops(text) {
  const raw = text.replace(/^[　\s]+/, "").replace(/[　\s]+$/, "");
  if (!raw || raw === "—" || raw === "-") return [];
  return raw
    .split(/[,、/／・]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseHarvest(md, lang) {
  const labels = HARVEST[lang];
  const section = extractSection(md, labels.heading, 3);
  const result = { harvested: [], harvesting: [] };
  for (const line of section.split("\n")) {
    const m = line.match(/^\s*[-*]\s+(.+)$/);
    if (!m) continue;
    const rest = m[1];
    if (rest.startsWith(labels.harvesting)) {
      result.harvesting = splitCrops(rest.slice(labels.harvesting.length));
    } else if (rest.startsWith(labels.harvested)) {
      result.harvested = splitCrops(rest.slice(labels.harvested.length));
    }
  }
  return result;
}

export function parseFaq(md, lang) {
  const section = extractSection(md, FAQ_HEADING[lang], 2);
  const matches = [...section.matchAll(/^### (.+)$/gm)];
  return matches.map((match, i) => {
    const title = match[1].trim();
    const start = match.index + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : section.length;
    const body = section
      .slice(start, end)
      .replace(/^\n+/, "")
      .replace(/(?:\n+---\s*)+$/g, "")
      .replace(/\n+$/, "");
    return { title, body };
  });
}

function isHobbiesTitle(title) {
  return /趣味|Hobbies/i.test(title);
}

function isHobbyBlock(text) {
  const plain = text.replace(/\*\*/g, "");
  if (plain.length >= 50) return true;
  if (/：/.test(plain)) return true;
  if (/\*\*[^*]+?\*\*:/.test(text)) return true;
  return false;
}

export function renderHarvestBlock(harvested, harvesting, lang) {
  const labels = HARVEST[lang];

  function detail(items) {
    if (!items.length) return '<span class="products__harvest-detail">—</span>';
    if (items.length === 1) {
      return `<span class="products__harvest-detail">${escapeHtml(items[0])}</span>`;
    }
    const crops = items.map((item) => `              <span class="products__harvest-crop">${escapeHtml(item)}</span>`).join("\n");
    return `<span class="products__harvest-detail">\n${crops}\n            </span>`;
  }

  return `<ul class="products__harvest">
          <li class="products__harvest-item products__harvest-item--row">
            <span class="products__harvest-label">${labels.harvested}</span>
            ${detail(harvested)}
          </li>
          <li class="products__harvest-item products__harvest-item--row">
            <span class="products__harvest-label">${labels.harvesting}</span>
            ${detail(harvesting)}
          </li>
        </ul>`;
}

function renderFaqBody(title, body) {
  const lines = body.split("\n");
  const nonEmpty = lines.filter((line) => line.trim());
  const allList = nonEmpty.length > 0 && nonEmpty.every((line) => /^\s*[-*]\s+/.test(line));
  const hobbies = isHobbiesTitle(title);

  if (allList) {
    const items = nonEmpty.map((line) => line.replace(/^\s*[-*]\s+/, ""));
    const ulClass = hobbies ? ' class="faq-item__hobbies"' : "";
    const lis = items.map((text) => {
      const cls = hobbies && isHobbyBlock(text) ? ' class="faq-item__hobby--block"' : "";
      return `              <li${cls}>${inline(text)}</li>`;
    });
    return `            <ul${ulClass}>\n${lis.join("\n")}\n            </ul>`;
  }

  const blocks = body
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n+$/, "").replace(/^\n+/, ""))
    .filter(Boolean);
  return blocks
    .map((block) => `            <p>${inline(block).replaceAll("\n", "<br>")}</p>`)
    .join("\n");
}

export function renderFaqList(items) {
  return items
    .map((item) => {
      const id = isHobbiesTitle(item.title) ? ' id="faq-hobbies"' : "";
      return `          <details class="faq-item"${id}>
            <summary>${inline(item.title)}</summary>
${renderFaqBody(item.title, item.body)}
          </details>`;
    })
    .join("\n");
}

export function applyHarvestToHtml(html, harvested, harvesting, lang) {
  const block = renderHarvestBlock(harvested, harvesting, lang);
  if (!/<ul class="products__harvest">[\s\S]*?<\/ul>/.test(html)) {
    throw new Error("収穫状況の入れ物が見つかりません");
  }
  return html.replace(/<ul class="products__harvest">[\s\S]*?<\/ul>/, block);
}

export function applyFaqToHtml(html, items) {
  const startToken = '<div class="faq__list">';
  const start = html.indexOf(startToken);
  if (start < 0) throw new Error("よくある質問の入れ物が見つかりません");
  const innerStart = start + startToken.length;
  const end = html.indexOf("</div>", innerStart);
  if (end < 0) throw new Error("よくある質問の閉じタグが見つかりません");
  return `${html.slice(0, innerStart)}\n${renderFaqList(items)}\n        ${html.slice(end)}`;
}

function writeIfChanged(file, next, dryRun) {
  const current = fs.existsSync(file) ? readUtf8(file) : "";
  if (next === current) return false;
  if (!dryRun) fs.writeFileSync(file, next, "utf8");
  return true;
}

export function harvestJsonText(ja, en) {
  return `${JSON.stringify(
    {
      harvested_ja: ja.harvested,
      harvesting_ja: ja.harvesting,
      harvested_en: en.harvested,
      harvesting_en: en.harvesting,
    },
    null,
    2,
  )}\n`;
}

export function syncLpMarkdown(root, { dryRun = false } = {}) {
  const written = [];
  const jaMd = readUtf8(path.join(root, "原稿", "LP.md"));
  const enMd = readUtf8(path.join(root, "原稿", "LP-en.md"));
  const harvestJa = parseHarvest(jaMd, "ja");
  const harvestEn = parseHarvest(enMd, "en");
  const faqJa = parseFaq(jaMd, "ja");
  const faqEn = parseFaq(enMd, "en");

  if (!faqJa.length) throw new Error("日本語のよくある質問が読めません");
  if (!faqEn.length) throw new Error("英語のよくある質問が読めません");

  const jobs = [
    [path.join(root, "index.html"), "ja", harvestJa, faqJa],
    [path.join(root, "index-en.html"), "en", harvestEn, faqEn],
  ];

  for (const [file, lang, harvest, faq] of jobs) {
    let html = readUtf8(file);
    html = applyHarvestToHtml(html, harvest.harvested, harvest.harvesting, lang);
    html = applyFaqToHtml(html, faq);
    if (writeIfChanged(file, html, dryRun)) {
      written.push(path.relative(root, file).replaceAll("\\", "/"));
    }
  }

  const jsonFile = path.join(root, "data", "harvest.json");
  if (writeIfChanged(jsonFile, harvestJsonText(harvestJa, harvestEn), dryRun)) {
    written.push(path.relative(root, jsonFile).replaceAll("\\", "/"));
  }

  return written;
}
