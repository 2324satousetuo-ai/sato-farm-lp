import assert from 'node:assert/strict';
import { idempotencyKey, sendEmail } from './send-email.js';

assert.equal(idempotencyKey('registration_complete', 'member-1'), 'registration-complete/member-1');
assert.equal(idempotencyKey('order_confirmation', '12'), 'order-confirmation/12');
assert.equal(idempotencyKey('order_shipped', '12'), 'order-shipped/12');

function createMockDb(existingDelivery) {
  const updates = [];
  return {
    updates,
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              if (/UPDATE email_deliveries/.test(sql)) {
                updates.push({ sql, args });
              }
              return { meta: {} };
            },
            async first() {
              return existingDelivery || null;
            },
          };
        },
      };
    },
  };
}

const originalFetch = globalThis.fetch;
try {
  const db = createMockDb();
  const env = {
    DB: db,
    RESEND_API_KEY: '',
    MAIL_FROM: '佐藤農園 <noreply@satofarms.com>',
    MAIL_REPLY_TO: '2324satou.setuo@gmail.com',
  };

  const result = await sendEmail(
    env,
    'example@gmail.com',
    '件名',
    '本文',
    'registration_complete',
    'member-1',
    { deliveryId: 'd1', memberId: 'member-1' }
  );
  assert.equal(result.status, 'failed');
  assert.equal(db.updates[0].args[0], 'RESEND_API_KEY is not configured');

  let captured;
  globalThis.fetch = async (url, init) => {
    captured = { url, init };
    return {
      ok: true,
      status: 200,
      async json() {
        return { id: 're_123' };
      },
    };
  };

  env.RESEND_API_KEY = 'test-key';
  const sent = await sendEmail(
    env,
    'example@gmail.com',
    '佐藤農園のお米にご登録いただき、ありがとうございます',
    '本文',
    'registration_complete',
    'member-1',
    { deliveryId: 'd2', memberId: 'member-1' }
  );
  assert.equal(sent.status, 'sent');
  assert.equal(captured.url, 'https://api.resend.com/emails');
  assert.equal(captured.init.headers['Idempotency-Key'], 'registration-complete/member-1');
  const body = JSON.parse(captured.init.body);
  assert.deepEqual(body.to, ['example@gmail.com']);
  assert.equal(body.from, env.MAIL_FROM);
  assert.equal(body.html, undefined);

  const withHtml = await sendEmail(
    env,
    'example@gmail.com',
    '件名',
    '本文',
    'order_confirmation',
    '1',
    { memberId: 'member-1', orderId: 1, html: '<p align="right">佐藤農園</p>' }
  );
  assert.equal(withHtml.status, 'sent');
  const htmlBody = JSON.parse(captured.init.body);
  assert.match(htmlBody.html, /佐藤農園/);
} finally {
  globalThis.fetch = originalFetch;
}

console.log('send-email tests passed');
