import assert from 'node:assert/strict';
import { hitPageView, PAGE_VIEW_KEY } from './page-views.js';
import worker from './worker.js';

function createDb(startCount) {
  let count = startCount;
  let boundKey;
  return {
    prepare(sql) {
      return {
        bind(key) {
          boundKey = key;
          return this;
        },
        async first() {
          if (typeof boundKey !== 'string') {
            throw new Error('missing bind');
          }
          if (!/INSERT INTO page_views/.test(sql) || !/RETURNING count/.test(sql)) {
            throw new Error('unexpected sql: ' + sql);
          }
          count = count == null ? 1 : count + 1;
          return { count };
        },
      };
    },
  };
}

assert.equal(PAGE_VIEW_KEY, 'sato-farm-nakanojo-lp');

await assert.rejects(() => hitPageView({}), /database_unavailable/);
await assert.rejects(() => hitPageView({ DB: null }), /database_unavailable/);

const missingTableDb = {
  prepare() {
    return {
      bind() {
        return this;
      },
      async first() {
        throw new Error('no such table: page_views');
      },
    };
  },
};
await assert.rejects(() => hitPageView({ DB: missingTableDb }), /database_unavailable/);

const db = createDb(3750);
assert.equal(await hitPageView({ DB: db }), 3751);
assert.equal(await hitPageView({ DB: db }), 3752);

const emptyDb = createDb(null);
assert.equal(await hitPageView({ DB: emptyDb }), 1);

const invalidDb = {
  prepare() {
    return {
      bind() {
        return this;
      },
      async first() {
        return { count: 'nope' };
      },
    };
  },
};
await assert.rejects(() => hitPageView({ DB: invalidDb }), /counter_invalid/);

const workerDb = createDb(3750);
const env = { DB: workerDb };

const hit = await worker.fetch(new Request('http://127.0.0.1/api/visits'), env);
assert.equal(hit.status, 200);
assert.deepEqual(await hit.json(), { value: 3751 });

const posted = await worker.fetch(
  new Request('http://127.0.0.1/api/visits', { method: 'POST' }),
  env
);
assert.equal(posted.status, 405);

const crossOrigin = await worker.fetch(
  new Request('http://127.0.0.1/api/visits', {
    headers: { Origin: 'https://example.com' },
  }),
  env
);
assert.equal(crossOrigin.status, 403);

console.log('page-views tests passed');
