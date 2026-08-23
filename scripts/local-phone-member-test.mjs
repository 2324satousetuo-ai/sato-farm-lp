import { getPlatformProxy } from 'wrangler';
import worker from '../src/worker.js';

const { env, dispose } = await getPlatformProxy({ persist: true });
const testEnv = {
  ...env,
  ADMIN_SECRET: env.ADMIN_SECRET || 'local-test-secret',
};

function jsonRequest(path, method, body, headers = {}) {
  return new Request('http://127.0.0.1' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body == null ? undefined : JSON.stringify(body),
  });
}

async function read(response, expectOk = true) {
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (expectOk && !response.ok) {
    throw new Error(response.status + ' ' + text);
  }
  return { status: response.status, data };
}

const stamp = Date.now();
const phone = '080-' + String(stamp).slice(-4) + '-' + String(stamp).slice(-8, -4);
const email = 'local-email-member-' + stamp + '@example.com';

try {
  const bothEmpty = await read(
    await worker.fetch(
      jsonRequest('/api/register', 'POST', {
        name: '試験 空欄',
        email: '',
        phone: '',
        purchase_intent: 'lv1',
        privacy_agreed: true,
      }),
      env
    ),
    false
  );
  if (bothEmpty.status !== 400 || bothEmpty.data.errors.contact !== 'メールアドレスまたは電話番号のいずれかは必須です') {
    throw new Error('expected contact required: ' + JSON.stringify(bothEmpty));
  }

  const phoneOnly = await read(
    await worker.fetch(
      jsonRequest('/api/register', 'POST', {
        name: '試験 電話のみ',
        email: '',
        phone,
        purchase_intent: 'lv2',
        privacy_agreed: true,
      }),
      env
    )
  );
  if (!phoneOnly.data.ok) {
    throw new Error('phone-only register failed: ' + JSON.stringify(phoneOnly));
  }

  const phoneMember = await env.DB.prepare(
    'SELECT id, email_normalized, phone FROM members WHERE phone = ?'
  )
    .bind(phone)
    .first();
  if (!phoneMember || phoneMember.email_normalized !== '') {
    throw new Error('phone-only member not stored as expected: ' + JSON.stringify(phoneMember));
  }

  const { results: phoneDeliveries } = await env.DB.prepare(
    'SELECT email_type FROM email_deliveries WHERE member_id = ?'
  )
    .bind(phoneMember.id)
    .all();
  if (phoneDeliveries.length) {
    throw new Error('phone-only member should not have email_deliveries');
  }

  const phoneDup = await read(
    await worker.fetch(
      jsonRequest('/api/register', 'POST', {
        name: '試験 電話重複',
        email: '',
        phone: phone.replace(/-/g, ''),
        purchase_intent: 'lv1',
        privacy_agreed: true,
      }),
      env
    ),
    false
  );
  if (phoneDup.status !== 409 || !phoneDup.data.errors.phone) {
    throw new Error('expected phone duplicate: ' + JSON.stringify(phoneDup));
  }

  const emailMember = await read(
    await worker.fetch(
      jsonRequest('/api/register', 'POST', {
        name: '試験 メール会員',
        email,
        purchase_intent: 'lv3',
        privacy_agreed: true,
      }),
      env
    )
  );
  if (!emailMember.data.ok) {
    throw new Error('email register failed: ' + JSON.stringify(emailMember));
  }

  const emailDup = await read(
    await worker.fetch(
      jsonRequest('/api/register', 'POST', {
        name: '試験 メール重複',
        email,
        purchase_intent: 'lv1',
        privacy_agreed: true,
      }),
      env
    ),
    false
  );
  if (emailDup.status !== 409 || !emailDup.data.errors.email) {
    throw new Error('expected email duplicate: ' + JSON.stringify(emailDup));
  }

  const products = await read(await worker.fetch(jsonRequest('/api/products', 'GET'), env));
  const product = products.data.products[0];

  const phoneOrder = await read(
    await worker.fetch(
      jsonRequest('/api/order', 'POST', {
        member: {
          name: '試験 電話注文',
          email: '',
          postalCode: '377-0423',
          prefecture: '群馬県',
          address: '伊勢町15-6',
          phone,
        },
        productId: product.id,
        desiredTiming: 'asap',
        confirmations: {
          packaging: true,
          damageRisk: true,
          weightVariance: true,
          bankFee: true,
          millingStandard: true,
          millingLoss: true,
        },
      }),
      env
    )
  );
  if (!phoneOrder.data.success) {
    throw new Error('phone-only order failed: ' + JSON.stringify(phoneOrder));
  }

  const reused = await env.DB.prepare('SELECT member_id FROM orders WHERE id = ?')
    .bind(phoneOrder.data.orderId)
    .first();
  if (reused.member_id !== phoneMember.id) {
    throw new Error('phone-only order should reuse the same member');
  }

  const paid = await read(
    await worker.fetch(
      jsonRequest('/api/admin/orders/' + phoneOrder.data.orderId + '/paid', 'POST', null, {
        'X-Admin-Secret': testEnv.ADMIN_SECRET,
      }),
      testEnv
    )
  );
  if (!paid.data.success) {
    throw new Error('phone-only paid failed: ' + JSON.stringify(paid));
  }

  const completed = await read(
    await worker.fetch(
      jsonRequest('/api/admin/orders/' + phoneOrder.data.orderId + '/completed', 'POST', null, {
        'X-Admin-Secret': testEnv.ADMIN_SECRET,
      }),
      testEnv
    )
  );
  if (!completed.data.success) {
    throw new Error('phone-only completed failed: ' + JSON.stringify(completed));
  }

  const finishedOrder = await env.DB.prepare(
    'SELECT status, payment_status FROM orders WHERE id = ?'
  )
    .bind(phoneOrder.data.orderId)
    .first();
  if (finishedOrder.status !== 'completed' || finishedOrder.payment_status !== 'paid') {
    throw new Error('phone-only order did not finish as expected: ' + JSON.stringify(finishedOrder));
  }

  const { results: afterOrderDeliveries } = await env.DB.prepare(
    'SELECT email_type FROM email_deliveries WHERE member_id = ?'
  )
    .bind(phoneMember.id)
    .all();
  if (afterOrderDeliveries.length) {
    throw new Error('phone-only order should not create email_deliveries');
  }

  const noContactOrder = await read(
    await worker.fetch(
      jsonRequest('/api/order', 'POST', {
        member: {
          name: '試験 連絡先なし',
          email: '',
          prefecture: '群馬県',
          address: '伊勢町15-6',
          phone: '',
        },
        productId: product.id,
        confirmations: {
          packaging: true,
          damageRisk: true,
          weightVariance: true,
          bankFee: true,
        },
      }),
      env
    ),
    false
  );
  if (noContactOrder.status !== 400 || !String(noContactOrder.data.error).includes('メールアドレスまたは電話番号')) {
    throw new Error('expected order contact required: ' + JSON.stringify(noContactOrder));
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        phoneMemberId: phoneMember.id,
        phoneOrderId: phoneOrder.data.orderId,
        phoneOrderStatus: finishedOrder.status,
        phonePaymentStatus: finishedOrder.payment_status,
        email,
      },
      null,
      2
    )
  );
} finally {
  await dispose();
}
