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

async function read(response) {
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    throw new Error(pathLabel(response) + ' ' + response.status + ' ' + text);
  }
  return data;
}

function pathLabel(response) {
  return response.url || 'response';
}

try {
  const products = await read(await worker.fetch(jsonRequest('/api/products', 'GET'), testEnv));
  if (!products.success || !products.products.length) {
    throw new Error('products API failed');
  }

  const email = 'local-order-mail-test-' + Date.now() + '@example.com';
  const register = await read(
    await worker.fetch(
      jsonRequest('/api/register', 'POST', {
        name: 'ローカル試験',
        email,
        purchase_intent: 'lv2',
        privacy_agreed: true,
      }),
      testEnv
    )
  );
  if (!register.ok) {
    throw new Error('register failed: ' + JSON.stringify(register));
  }

  const order = await read(
    await worker.fetch(
      jsonRequest('/api/order', 'POST', {
        member: {
          name: 'ローカル試験',
          email,
          postalCode: '377-0423',
          prefecture: '群馬県',
          address: '伊勢町15-6',
          phone: '08012568883',
        },
        productId: products.products[0].id,
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
      testEnv
    )
  );
  if (!order.success || !order.orderId) {
    throw new Error('order failed: ' + JSON.stringify(order));
  }

  const paid = await read(
    await worker.fetch(
      jsonRequest('/api/admin/orders/' + order.orderId + '/paid', 'POST', null, {
        'X-Admin-Secret': testEnv.ADMIN_SECRET,
      }),
      testEnv
    )
  );
  if (!paid.success) {
    throw new Error('paid failed: ' + JSON.stringify(paid));
  }

  const completed = await read(
    await worker.fetch(
      jsonRequest('/api/admin/orders/' + order.orderId + '/completed', 'POST', null, {
        'X-Admin-Secret': testEnv.ADMIN_SECRET,
      }),
      testEnv
    )
  );
  if (!completed.success) {
    throw new Error('completed failed: ' + JSON.stringify(completed));
  }

  const member = await env.DB.prepare(
    'SELECT id FROM members WHERE email_normalized = ?'
  )
    .bind(email)
    .first();
  const { results: deliveries } = await env.DB.prepare(
    `SELECT email_type, status, order_id, last_error
     FROM email_deliveries
     WHERE member_id = ?
     ORDER BY created_at`
  )
    .bind(member.id)
    .all();

  const types = deliveries.map((row) => row.email_type);
  if (!types.includes('registration_complete')) {
    throw new Error('missing registration_complete delivery');
  }
  if (!types.includes('order_confirmation')) {
    throw new Error('missing order_confirmation delivery');
  }
  if (!types.includes('order_shipped')) {
    throw new Error('missing order_shipped delivery');
  }

  const orderMails = deliveries.filter((row) => row.order_id != null);
  if (orderMails.some((row) => Number(row.order_id) !== Number(order.orderId))) {
    throw new Error('order email was not tied to the order id');
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        orderId: order.orderId,
        deliveries: deliveries.map((row) => ({
          type: row.email_type,
          status: row.status,
          order_id: row.order_id,
          last_error: row.last_error,
        })),
      },
      null,
      2
    )
  );
} finally {
  await dispose();
}
