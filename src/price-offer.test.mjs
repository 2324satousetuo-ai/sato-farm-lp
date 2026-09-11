import assert from 'node:assert/strict';
import {
  PRICE_OFFER_SUBJECT,
  attachOrderToPriceOffer,
  buildOfferUrls,
  buildPriceOfferEmail,
  chunkItems,
  deliverPriceOfferBatch,
  formatJstDate,
  isOfferToken,
  isPreviewEmail,
  isPriceOfferAction,
  isPurchaseIntent,
  memberHasSendableEmail,
  nextResponseState,
  publicOriginFromRequest,
  recordPriceOfferResponse,
  responseStatusLabel,
  samplePriceOfferEmail,
} from './price-offer.js';

assert.equal(isPurchaseIntent('lv3'), true);
assert.equal(isPurchaseIntent('lv2'), true);
assert.equal(isPurchaseIntent('lv4'), false);
assert.equal(isPriceOfferAction('buy'), true);
assert.equal(isPriceOfferAction('hold'), true);
assert.equal(isPriceOfferAction('pass'), true);
assert.equal(isPriceOfferAction('maybe'), false);
assert.equal(isOfferToken('8f3a1c2e-4b5d-6789-abcd-ef0123456789'), true);
assert.equal(isOfferToken('not-a-token'), false);
assert.equal(isOfferToken(''), false);

assert.equal(formatJstDate('2026-09-11T00:00:00.000Z'), '2026-09-11 09:00');
assert.equal(formatJstDate('2026-09-11T15:06:00.000Z'), '2026-09-12 00:06');
assert.equal(formatJstDate(''), '');

assert.equal(
  publicOriginFromRequest(new Request('https://satofarms.com/api/admin/price-offers')),
  'https://satofarms.com'
);

const urls = buildOfferUrls('https://satofarms.com/', '8f3a1c2e-4b5d-6789-abcd-ef0123456789');
assert.equal(urls.simulatorUrl, 'https://satofarms.com/simulator.html');
assert.equal(
  urls.buyUrl,
  'https://satofarms.com/api/price-offer/respond?t=8f3a1c2e-4b5d-6789-abcd-ef0123456789&a=buy'
);
assert.equal(
  urls.holdUrl,
  'https://satofarms.com/price-offer.html?t=8f3a1c2e-4b5d-6789-abcd-ef0123456789&a=hold'
);
assert.equal(
  urls.passUrl,
  'https://satofarms.com/price-offer.html?t=8f3a1c2e-4b5d-6789-abcd-ef0123456789&a=pass'
);
assert.equal(
  urls.orderUrl,
  'https://satofarms.com/order.html?offer=8f3a1c2e-4b5d-6789-abcd-ef0123456789'
);

const email = buildPriceOfferEmail({ name: '山田 太郎', urls });
assert.equal(email.subject, PRICE_OFFER_SUBJECT);
assert.match(email.text, /^山田 太郎様/);
assert.match(email.text, /シミュレーターでご確認いただけます/);
assert.match(email.text, /https:\/\/satofarms\.com\/simulator\.html/);
assert.doesNotMatch(email.text, /20,?000/);
assert.match(email.text, /【購入する】/);
assert.match(email.text, /【保留】/);
assert.match(email.text, /【見送る】/);
assert.match(email.html, /山田 太郎様/);
assert.match(email.html, /href="https:\/\/satofarms\.com\/simulator\.html"/);
assert.equal(buildPriceOfferEmail({ name: '  ', urls }).text.startsWith('お客様'), true);
assert.doesNotMatch(buildPriceOfferEmail({ name: '  ', urls }).text, /^お客様様/);

assert.equal(responseStatusLabel({}), '未回答');
assert.equal(responseStatusLabel({ response: 'hold' }), '保留');
assert.equal(responseStatusLabel({ response: 'pass' }), '見送る');
assert.equal(responseStatusLabel({ response: 'buy' }), '購入する（未注文）');
assert.equal(responseStatusLabel({ response: 'buy', order_id: 12 }), '購入する（注文済み No.12）');
assert.equal(responseStatusLabel({ order_id: 3 }), '購入する（注文済み No.3）');

assert.deepEqual(nextResponseState({ response: null, order_id: null }, 'hold'), {
  response: 'hold',
  changed: true,
  locked: false,
});
assert.deepEqual(nextResponseState({ response: 'hold', order_id: null }, 'pass'), {
  response: 'pass',
  changed: true,
  locked: false,
});
assert.deepEqual(nextResponseState({ response: 'buy', order_id: 9 }, 'pass'), {
  response: 'buy',
  changed: false,
  locked: true,
});

assert.deepEqual(chunkItems([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
assert.deepEqual(chunkItems([], 100), []);

assert.equal(
  memberHasSendableEmail({ email_normalized: 'a@example.com', email_original: '' }),
  true
);
assert.equal(memberHasSendableEmail({ email_normalized: '', email_original: '' }), false);
assert.equal(memberHasSendableEmail({ email_normalized: '', email_original: 'b@example.com' }), true);

function createResponseDb(row, onUpdate) {
  return {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async first() {
              return row;
            },
            async run() {
              if (onUpdate) onUpdate({ sql, args });
              return { meta: {} };
            },
          };
        },
      };
    },
  };
}

await assert.rejects(
  () => recordPriceOfferResponse({ DB: createResponseDb(null) }, { token: 'bad', action: 'hold' }),
  /invalid_token/
);

const token = '8f3a1c2e-4b5d-6789-abcd-ef0123456789';
await assert.rejects(
  () => recordPriceOfferResponse({ DB: createResponseDb(null) }, { token, action: 'hold' }),
  /not_found/
);

const recorded = await recordPriceOfferResponse(
  { DB: createResponseDb({ id: token, response: null, order_id: null }) },
  { token, action: 'hold' }
);
assert.deepEqual(recorded, { token, action: 'hold', locked: false, orderId: null });

const locked = await recordPriceOfferResponse(
  { DB: createResponseDb({ id: token, response: 'buy', order_id: 4 }) },
  { token, action: 'pass' }
);
assert.equal(locked.locked, true);
assert.equal(locked.action, 'buy');

const attached = await attachOrderToPriceOffer(
  {
    DB: createResponseDb({ id: token, order_id: null }, ({ sql, args }) => {
      assert.match(sql, /SET order_id/);
      assert.equal(args[0], 77);
      assert.equal(args[2], token);
    }),
  },
  { token, orderId: 77 }
);
assert.deepEqual(attached, { attached: true });

const skipped = await attachOrderToPriceOffer(
  { DB: createResponseDb(null) },
  { token: 'nope', orderId: 1 }
);
assert.deepEqual(skipped, { attached: false });

function createBatchDb(updates) {
  return {
    prepare(sql) {
      return {
        bind(...args) {
          return { sql, args };
        },
      };
    },
    async batch(statements) {
      updates.push(...statements);
    },
  };
}

const noKeyUpdates = [];
const noKey = await deliverPriceOfferBatch(
  { DB: createBatchDb(noKeyUpdates), RESEND_API_KEY: '' },
  {
    campaignId: 'camp-1',
    origin: 'https://satofarms.com',
    recipients: [{ id: token, name: '山田', email: 'a@example.com' }],
  }
);
assert.deepEqual(noKey, { sent: 0, failed: 1, skipped: 0 });
assert.match(noKeyUpdates[0].sql, /send_status/);
assert.equal(noKeyUpdates[0].args[0], 'failed');

const originalFetch = globalThis.fetch;
const sentUpdates = [];
globalThis.fetch = async (url, init) => {
  assert.equal(url, 'https://api.resend.com/emails/batch');
  assert.equal(init.headers['Idempotency-Key'], 'price-offer/camp-2/0');
  const body = JSON.parse(init.body);
  assert.equal(body.length, 1);
  assert.deepEqual(body[0].to, ['a@example.com']);
  assert.equal(body[0].subject, PRICE_OFFER_SUBJECT);
  assert.match(body[0].text, /山田様/);
  return {
    ok: true,
    status: 200,
    async json() {
      return { data: [{ id: 're_batch_1' }] };
    },
  };
};
try {
  const sent = await deliverPriceOfferBatch(
    {
      DB: createBatchDb(sentUpdates),
      RESEND_API_KEY: 'test-key',
      MAIL_FROM: '佐藤農園 <noreply@satofarms.com>',
      MAIL_REPLY_TO: '2324satou.setuo@gmail.com',
    },
    {
      campaignId: 'camp-2',
      origin: 'https://satofarms.com',
      recipients: [{ id: token, name: '山田', email: 'a@example.com' }],
    }
  );
  assert.deepEqual(sent, { sent: 1, failed: 0, skipped: 0 });
  assert.equal(sentUpdates[0].args[0], 're_batch_1');
  assert.equal(sentUpdates[0].args[1], token);
} finally {
  globalThis.fetch = originalFetch;
}

assert.equal(isPreviewEmail({ PREVIEW_EMAIL: '1' }), true);
assert.equal(isPreviewEmail({ PREVIEW_EMAIL: '0' }), false);

const previewUpdates = [];
let previewFetchCalled = false;
globalThis.fetch = async () => {
  previewFetchCalled = true;
  throw new Error('preview must not call Resend');
};
try {
  const previewed = await deliverPriceOfferBatch(
    {
      DB: createBatchDb(previewUpdates),
      RESEND_API_KEY: 'must-not-use',
      PREVIEW_EMAIL: '1',
    },
    {
      campaignId: 'camp-preview',
      origin: 'https://satofarms.com',
      recipients: [{ id: token, name: '山田', email: 'a@example.com' }],
    }
  );
  assert.deepEqual(previewed, { sent: 1, failed: 0, skipped: 0, previewOnly: true });
  assert.equal(previewFetchCalled, false);
  assert.equal(previewUpdates[0].args[0], token);
  const sample = samplePriceOfferEmail('https://satofarms.com', {
    id: token,
    name: '山田',
  });
  assert.equal(sample.subject, PRICE_OFFER_SUBJECT);
  assert.match(sample.text, /山田様/);
  assert.doesNotMatch(sample.text, /20,?000/);
  assert.equal(sample.urls.simulatorUrl, 'https://satofarms.com/simulator.html');
} finally {
  globalThis.fetch = originalFetch;
}
