import assert from 'node:assert/strict';
import { getPlatformProxy } from 'wrangler';
import worker from '../src/worker.js';

const { env, dispose } = await getPlatformProxy({ persist: true });
const testEnv = {
  ...env,
  ADMIN_SECRET: env.ADMIN_SECRET || 'local-preview-secret',
};

function jsonRequest(path, method, body, headers = {}) {
  return new Request('http://127.0.0.1' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body == null ? undefined : JSON.stringify(body),
  });
}

async function read(response) {
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: response.status, data };
}

function productMap(products) {
  const map = {};
  for (const product of products) {
    map[product.weight_label + '|' + (product.milled ? '1' : '0')] = product;
  }
  return map;
}

try {
  const unauthorized = await read(
    await worker.fetch(jsonRequest('/api/admin/price-stage', 'GET'), testEnv)
  );
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorized.data.success, false);

  const wrongGet = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-stage', 'GET', null, { 'X-Admin-Secret': 'wrong-password' }),
      testEnv
    )
  );
  assert.equal(wrongGet.status, 401);
  assert.equal(wrongGet.data.success, false);

  const wrongPost = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-stage', 'POST', { stage: 'B' }, { 'X-Admin-Secret': 'wrong-password' }),
      testEnv
    )
  );
  assert.equal(wrongPost.status, 401);
  assert.equal(wrongPost.data.success, false);

  const auth = { 'X-Admin-Secret': testEnv.ADMIN_SECRET };

  const current = await read(
    await worker.fetch(jsonRequest('/api/admin/price-stage', 'GET', null, auth), testEnv)
  );
  assert.equal(current.status, 200);
  assert.equal(current.data.success, true);
  assert.equal(current.data.stage, 'A');

  const productsA = await read(await worker.fetch(jsonRequest('/api/products', 'GET'), testEnv));
  assert.equal(productsA.status, 200);
  assert.equal(productsA.data.success, true);
  assert.equal(Object.prototype.hasOwnProperty.call(productsA.data, 'stage'), false);
  const mapA = productMap(productsA.data.products);
  assert.equal(mapA['30kg|0'].price, 20000);
  assert.equal(mapA['30kg|1'].price, 22000);
  assert.equal(mapA['20kg相当|0'].price, 16000);
  assert.equal(mapA['20kg相当|1'].price, 18000);

  const milledA = mapA['30kg|1'];
  const quoteA = await read(
    await worker.fetch(
      jsonRequest('/api/quote', 'POST', { productId: milledA.id, prefecture: '群馬県' }),
      testEnv
    )
  );
  assert.equal(quoteA.data.success, true);
  assert.equal(quoteA.data.productPrice, 20000);
  assert.equal(quoteA.data.millingFee, 2000);
  assert.equal(quoteA.data.totalAmount, 22000 + quoteA.data.shippingFee);

  const switched = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-stage', 'POST', { stage: 'B' }, auth),
      testEnv
    )
  );
  assert.equal(switched.status, 200);
  assert.equal(switched.data.stage, 'B');
  assert.equal(switched.data.changed, true);
  assert.equal(switched.data.fromStage, 'A');

  const productsB = await read(await worker.fetch(jsonRequest('/api/products', 'GET'), testEnv));
  const mapB = productMap(productsB.data.products);
  assert.equal(mapB['30kg|0'].price, 18000);
  assert.equal(mapB['20kg相当|1'].price, 16200);
  assert.equal(Object.prototype.hasOwnProperty.call(mapB['30kg|0'], 'stage'), false);

  const quoteB = await read(
    await worker.fetch(
      jsonRequest('/api/quote', 'POST', { productId: mapB['20kg相当|1'].id, prefecture: '群馬県' }),
      testEnv
    )
  );
  assert.equal(quoteB.data.productPrice, 14400);
  assert.equal(quoteB.data.millingFee, 1800);
  assert.equal(quoteB.data.totalAmount, 16200 + quoteB.data.shippingFee);

  await worker.fetch(
    jsonRequest('/api/admin/price-stage', 'POST', { stage: 'A' }, auth),
    testEnv
  );

  console.log('price-stage local API tests passed');
} catch (error) {
  try {
    await worker.fetch(
      jsonRequest(
        '/api/admin/price-stage',
        'POST',
        { stage: 'A' },
        { 'X-Admin-Secret': testEnv.ADMIN_SECRET }
      ),
      testEnv
    );
  } catch {
    // Keep the original failure.
  }
  throw error;
} finally {
  await dispose();
}
