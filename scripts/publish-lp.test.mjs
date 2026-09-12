import assert from "node:assert/strict";
import {
  applyFaqToHtml,
  applyHarvestToHtml,
  harvestJsonText,
  parseFaq,
  parseHarvest,
  renderFaqList,
  renderHarvestBlock,
} from "./publish-lp.mjs";

const jaMd = `## 商品・栽培

### 収穫状況

- 収穫しました　にんにく・キャベツ・じゃがいも
- 収穫中です　キュウリ、なす / ニンジン

---

## よくある質問

### 一般の方も購入できますか？

販売先は友人・知人・ご近所様です。

### 注文・問い合わせ方法は？

固定電話 [0279-75-2711](tel:0279752711) まで。

### 「佐藤農園」の名称について

法人登録した名称ではありません。
URLは登録済みです。⇒satofarms.com

### 趣味・関心事／心配事は何ですか？

- 健康づくり（ジョギング）
- 生成AI Cursor Pro、VS Code、Obsidian、GitHub、Netlify→Cloudflare
- FX（外国為替）トレード：戦績は不甲斐ない。

---

## アクセス
`;

const enMd = `## Products

### Harvest

- Harvested　Garlic / Cabbage / Potato
- Currently harvesting　Cucumber, Eggplant

---

## Frequently asked questions

### What is available now?

Cabbage at ¥100 is currently available.

### Hobbies/Interests/Concerns

- Watching MLB
- **Tech & AI:** Utilizing generative AI tools like Cursor and Obsidian.

---

## Directions
`;

const jaHarvest = parseHarvest(jaMd, "ja");
assert.deepEqual(jaHarvest.harvested, ["にんにく", "キャベツ", "じゃがいも"]);
assert.deepEqual(jaHarvest.harvesting, ["キュウリ", "なす", "ニンジン"]);

const enHarvest = parseHarvest(enMd, "en");
assert.deepEqual(enHarvest.harvested, ["Garlic", "Cabbage", "Potato"]);
assert.deepEqual(enHarvest.harvesting, ["Cucumber", "Eggplant"]);

const jaFaq = parseFaq(jaMd, "ja");
assert.equal(jaFaq.length, 4);
assert.equal(jaFaq[0].title, "一般の方も購入できますか？");
assert.match(jaFaq[1].body, /0279-75-2711/);
assert.match(jaFaq[2].body, /satofarms\.com/);
assert.match(jaFaq[3].body, /健康づくり/);

const enFaq = parseFaq(enMd, "en");
assert.equal(enFaq.length, 2);
assert.equal(enFaq[1].title, "Hobbies/Interests/Concerns");

const harvestHtml = renderHarvestBlock(jaHarvest.harvested, jaHarvest.harvesting, "ja");
assert.match(harvestHtml, /収穫しました/);
assert.match(harvestHtml, /products__harvest-crop">にんにく</);
assert.match(harvestHtml, /products__harvest-crop">ニンジン</);
assert.doesNotMatch(harvestHtml, /トマト/);

const emptyHarvest = renderHarvestBlock([], [], "en");
assert.match(emptyHarvest, /Currently harvesting/);
assert.match(emptyHarvest, />—</);

const faqHtml = renderFaqList(jaFaq);
assert.match(faqHtml, /id="faq-hobbies"/);
assert.match(faqHtml, /href="tel:0279752711"/);
assert.match(faqHtml, /faq-item__hobbies/);
assert.match(faqHtml, /faq-item__hobby--block/);
assert.match(faqHtml, /satofarms\.com/);
assert.equal((faqHtml.match(/<details class="faq-item"/g) || []).length, 4);

const enFaqHtml = renderFaqList(enFaq);
assert.match(enFaqHtml, /id="faq-hobbies"/);
assert.match(enFaqHtml, /<strong>Tech &amp; AI:<\/strong>/);

const page = `<section>
        <ul class="products__harvest">
          <li>old</li>
        </ul>
        <div class="faq__list">
          <details class="faq-item"><summary>old</summary></details>
        </div>
      </section>`;

const next = applyFaqToHtml(
  applyHarvestToHtml(page, ["にんにく"], ["キュウリ"], "ja"),
  jaFaq,
);
assert.match(next, /にんにく/);
assert.match(next, /一般の方も購入できますか？/);
assert.doesNotMatch(next, />old</);

const sameHarvest = applyHarvestToHtml(harvestHtml, jaHarvest.harvested, jaHarvest.harvesting, "ja");
assert.equal(sameHarvest, harvestHtml);

const json = harvestJsonText(jaHarvest, enHarvest);
assert.match(json, /"harvested_ja"/);
assert.match(json, /"Cucumber"/);

console.log("publish-lp: ok");
