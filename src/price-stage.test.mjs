import assert from 'node:assert/strict';
import { getCurrentPriceStage, isPriceAdmin, setPriceStage } from './price-stage.js';

function requestWithSecret(secret) {
  return new Request('http://127.0.0.1/api/admin/price-stage', {
    headers: secret ? { 'X-Admin-Secret': secret } : {},
  });
}

assert.equal(isPriceAdmin(requestWithSecret('abc'), { ADMIN_SECRET: 'abc' }), true);
assert.equal(
  isPriceAdmin(requestWithSecret('price-ok'), {
    PRICE_ADMIN_SECRET: 'price-ok',
    ADMIN_SECRET: 'other',
  }),
  false
);
assert.equal(isPriceAdmin(requestWithSecret('nope'), { ADMIN_SECRET: 'abc' }), false);
assert.equal(isPriceAdmin(requestWithSecret('abc'), {}), false);
assert.equal(isPriceAdmin(requestWithSecret(''), { ADMIN_SECRET: 'abc' }), false);

assert.equal(await getCurrentPriceStage({}), 'A');
assert.equal(await getCurrentPriceStage({ DB: null }), 'A');

const missingTableDb = {
  prepare() {
    return {
      async first() {
        throw new Error('no such table: price_stage');
      },
    };
  },
};
assert.equal(await getCurrentPriceStage({ DB: missingTableDb }), 'A');

const stageBDb = {
  prepare() {
    return {
      async first() {
        return { stage: 'B' };
      },
    };
  },
};
assert.equal(await getCurrentPriceStage({ DB: stageBDb }), 'B');

const invalidStageDb = {
  prepare() {
    return {
      async first() {
        return { stage: 'Z' };
      },
    };
  },
};
assert.equal(await getCurrentPriceStage({ DB: invalidStageDb }), 'A');

let batchSql = [];
const writableDb = {
  prepare(sql) {
    return {
      bind(...args) {
        batchSql.push({ sql, args });
        return this;
      },
      async first() {
        return { stage: 'A' };
      },
    };
  },
  async batch(statements) {
    this.statements = statements;
  },
};

const unchanged = await setPriceStage({ DB: writableDb }, 'A');
assert.deepEqual(unchanged, { stage: 'A', changed: false, fromStage: 'A' });
assert.equal(batchSql.length, 0);

const changed = await setPriceStage({ DB: writableDb }, 'C');
assert.deepEqual(changed, { stage: 'C', changed: true, fromStage: 'A' });
assert.equal(batchSql.length, 2);
assert.match(batchSql[0].sql, /INSERT INTO price_stage/);
assert.deepEqual(batchSql[0].args, ['C']);
assert.match(batchSql[1].sql, /INSERT INTO price_stage_history/);
assert.deepEqual(batchSql[1].args, ['A', 'C']);

await assert.rejects(() => setPriceStage({ DB: writableDb }, 'Z'), /invalid_stage/);
await assert.rejects(() => setPriceStage({}, 'B'), /database_unavailable/);
