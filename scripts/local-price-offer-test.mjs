import assert from 'node:assert/strict';
import { getPlatformProxy } from 'wrangler';
import worker from '../src/worker.js';

const { env, dispose } = await getPlatformProxy({ persist: true });
const testEnv = {
  ...env,
  ADMIN_SECRET: env.ADMIN_SECRET || 'local-preview-secret',
  RESEND_API_KEY: 'test-resend-key',
  MAIL_FROM: env.MAIL_FROM || '佐藤農園 <noreply@satofarms.com>',
  MAIL_REPLY_TO: env.MAIL_REPLY_TO || '2324satou.setuo@gmail.com',
};

function jsonRequest(path, method, body, headers = {}) {
  return new Request('http://127.0.0.1' + path, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1', ...headers },
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
  return { status: response.status, data, location: response.headers.get('Location') };
}

const stamp = Date.now();
const memberId = crypto.randomUUID();
const email = 'price-offer-test-' + stamp + '@example.com';
const auth = { 'X-Admin-Secret': testEnv.ADMIN_SECRET };
const originalFetch = globalThis.fetch;
let batchPayload = null;
const campaignIds = [];

function mailedTestMember() {
  return Array.isArray(batchPayload) && batchPayload.some((mail) => /試験 価格案内様/.test(mail.text));
}

globalThis.fetch = async (url, init) => {
  if (String(url).includes('api.resend.com/emails/batch')) {
    batchPayload = JSON.parse(init.body);
    return {
      ok: true,
      status: 200,
      async json() {
        return { data: batchPayload.map((_, index) => ({ id: 're_test_' + index })) };
      },
    };
  }
  return originalFetch(url, init);
};

try {
  await testEnv.DB.prepare(
    `INSERT INTO members (
       id, name, email_original, email_normalized, purchase_intent,
       created_at, updated_at, member_level
     ) VALUES (?, ?, ?, ?, 'lv3', datetime('now'), datetime('now'), 1)`
  )
    .bind(memberId, '試験 価格案内', email, email)
    .run();

  const unauthorized = await read(
    await worker.fetch(jsonRequest('/api/admin/price-offers/preview?target=lv3', 'GET'), testEnv)
  );
  assert.equal(unauthorized.status, 401);

  const preview = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-offers/preview?target=lv3', 'GET', null, auth),
      testEnv
    )
  );
  assert.equal(preview.status, 200);
  assert.equal(preview.data.success, true);
  assert.ok(preview.data.withEmailCount >= 1);

  const blockedLv2 = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-offers', 'POST', { targetIntent: 'lv2' }, auth),
      testEnv
    )
  );
  assert.equal(blockedLv2.status, 400);

  const missingAudience = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-offers', 'POST', { targetIntent: 'lv3' }, auth),
      testEnv
    )
  );
  assert.equal(missingAudience.status, 400);

  const sent = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-offers', 'POST', { targetIntent: 'lv3', audience: 'unsent' }, auth),
      testEnv
    )
  );
  assert.equal(sent.status, 200, JSON.stringify(sent.data));
  assert.equal(sent.data.success, true);
  campaignIds.push(sent.data.campaignId);
  assert.ok(sent.data.sent >= 1);
  assert.ok(Array.isArray(batchPayload) && batchPayload.length >= 1);
  assert.equal(mailedTestMember(), true);
  assert.ok(batchPayload.every((mail) => /simulator\.html/.test(mail.text)));
  assert.ok(batchPayload.every((mail) => !/20,?000/.test(mail.text)));

  batchPayload = null;
  const unsentAgain = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-offers', 'POST', { targetIntent: 'lv3', audience: 'unsent' }, auth),
      testEnv
    )
  );
  if (unsentAgain.status === 200) {
    campaignIds.push(unsentAgain.data.campaignId);
    assert.equal(mailedTestMember(), false);
  } else {
    assert.equal(unsentAgain.status, 400);
  }

  batchPayload = null;
  const unanswered = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-offers', 'POST', { targetIntent: 'lv3', audience: 'unanswered' }, auth),
      testEnv
    )
  );
  assert.equal(unanswered.status, 200, JSON.stringify(unanswered.data));
  campaignIds.push(unanswered.data.campaignId);
  assert.equal(mailedTestMember(), true);

  const listed = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-offers?campaignId=' + sent.data.campaignId, 'GET', null, auth),
      testEnv
    )
  );
  assert.equal(listed.status, 200);
  const self = (listed.data.recipients || []).find((row) => row.email === email);
  assert.ok(self, 'test recipient missing');
  assert.equal(self.statusLabel, '未回答');

  const holdGet = await read(
    await worker.fetch(
      new Request('http://127.0.0.1/api/price-offer/respond?t=' + self.id + '&a=hold'),
      testEnv
    )
  );
  assert.equal(holdGet.status, 302);
  assert.match(String(holdGet.location), /price-offer\.html/);

  const stillOpen = await testEnv.DB.prepare(
    'SELECT response FROM price_offer_recipients WHERE id = ?'
  )
    .bind(self.id)
    .first();
  assert.equal(stillOpen.response, null);

  const holdPost = await read(
    await worker.fetch(
      jsonRequest('/api/price-offer/respond', 'POST', { token: self.id, action: 'hold' }),
      testEnv
    )
  );
  assert.equal(holdPost.status, 200, JSON.stringify(holdPost.data));
  assert.equal(holdPost.data.action, 'hold');

  batchPayload = null;
  const unansweredAfterHold = await read(
    await worker.fetch(
      jsonRequest('/api/admin/price-offers', 'POST', { targetIntent: 'lv3', audience: 'unanswered' }, auth),
      testEnv
    )
  );
  if (unansweredAfterHold.status === 200) {
    campaignIds.push(unansweredAfterHold.data.campaignId);
    assert.equal(mailedTestMember(), false);
  } else {
    assert.equal(unansweredAfterHold.status, 400);
  }

  const buy = await read(
    await worker.fetch(
      new Request('http://127.0.0.1/api/price-offer/respond?t=' + self.id + '&a=buy'),
      testEnv
    )
  );
  assert.equal(buy.status, 302);
  assert.match(String(buy.location), /order\.html\?offer=/);

  const afterBuy = await testEnv.DB.prepare(
    'SELECT response, order_id FROM price_offer_recipients WHERE id = ?'
  )
    .bind(self.id)
    .first();
  assert.equal(afterBuy.response, 'buy');
  assert.equal(afterBuy.order_id, null);

  await attachCleanup(testEnv, memberId, campaignIds);
  console.log('local-price-offer-test: ok');
} catch (error) {
  await attachCleanup(testEnv, memberId, campaignIds);
  throw error;
} finally {
  globalThis.fetch = originalFetch;
  await dispose();
}

async function attachCleanup(testEnv, memberId, campaignIds) {
  try {
    for (const campaignId of campaignIds || []) {
      await testEnv.DB.prepare('DELETE FROM price_offer_recipients WHERE campaign_id = ?')
        .bind(campaignId)
        .run();
      await testEnv.DB.prepare('DELETE FROM price_offer_campaigns WHERE id = ?')
        .bind(campaignId)
        .run();
    }
    await testEnv.DB.prepare(
      `DELETE FROM price_offer_recipients
       WHERE member_id = ?`
    )
      .bind(memberId)
      .run();
    await testEnv.DB.prepare('DELETE FROM members WHERE id = ?').bind(memberId).run();
  } catch (error) {
    console.error('cleanup_failed', error);
  }
}
