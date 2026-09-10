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

const auth = { 'X-Admin-Secret': testEnv.ADMIN_SECRET };

async function createPaidOrder(email) {
  const products = await read(await worker.fetch(jsonRequest('/api/products', 'GET'), testEnv));
  if (!products.data.success || !products.data.products.length) {
    throw new Error('products API failed');
  }

  const register = await read(
    await worker.fetch(
      jsonRequest('/api/register', 'POST', {
        name: '追跡試験',
        email,
        purchase_intent: 'lv2',
        privacy_agreed: true,
      }),
      testEnv
    )
  );
  if (!register.data.ok) {
    throw new Error('register failed: ' + JSON.stringify(register.data));
  }

  const order = await read(
    await worker.fetch(
      jsonRequest('/api/order', 'POST', {
        member: {
          name: '追跡試験',
          email,
          postalCode: '377-0423',
          prefecture: '群馬県',
          address: '伊勢町15-6',
          phone: '08012568883',
        },
        productId: products.data.products[0].id,
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
  if (!order.data.success || !order.data.orderId) {
    throw new Error('order failed: ' + JSON.stringify(order.data));
  }

  const paid = await read(
    await worker.fetch(
      jsonRequest('/api/admin/orders/' + order.data.orderId + '/paid', 'POST', null, auth),
      testEnv
    )
  );
  if (!paid.data.success) {
    throw new Error('paid failed: ' + JSON.stringify(paid.data));
  }

  return order.data.orderId;
}

async function deliveryTypes(orderId) {
  const member = await env.DB.prepare(
    `SELECT member_id FROM orders WHERE id = ?`
  )
    .bind(orderId)
    .first();
  const { results } = await env.DB.prepare(
    `SELECT email_type FROM email_deliveries WHERE member_id = ? AND order_id = ?`
  )
    .bind(member.member_id, orderId)
    .all();
  return results.map((row) => row.email_type);
}

try {
  const stamp = Date.now();
  const withTrackingId = await createPaidOrder('local-tracking-' + stamp + '@example.com');
  const withoutTrackingId = await createPaidOrder('local-tracking-empty-' + stamp + '@example.com');

  const preparingTracking = await read(
    await worker.fetch(
      jsonRequest(
        '/api/admin/orders/' + withTrackingId + '/tracking',
        'POST',
        { trackingNumber: '1111-2222-3333' },
        auth
      ),
      testEnv
    ),
    false
  );
  if (preparingTracking.status !== 409) {
    throw new Error('tracking before complete should be 409: ' + JSON.stringify(preparingTracking));
  }

  const tooLong = await read(
    await worker.fetch(
      jsonRequest(
        '/api/admin/orders/' + withTrackingId + '/completed',
        'POST',
        { trackingNumber: 'x'.repeat(41) },
        auth
      ),
      testEnv
    ),
    false
  );
  if (tooLong.status !== 400) {
    throw new Error('too-long tracking should be 400: ' + JSON.stringify(tooLong));
  }

  const completedWith = await read(
    await worker.fetch(
      jsonRequest(
        '/api/admin/orders/' + withTrackingId + '/completed',
        'POST',
        { trackingNumber: '  1234-5678-9012  ' },
        auth
      ),
      testEnv
    )
  );
  if (!completedWith.data.success) {
    throw new Error('completed with tracking failed: ' + JSON.stringify(completedWith.data));
  }

  const completedWithout = await read(
    await worker.fetch(
      jsonRequest('/api/admin/orders/' + withoutTrackingId + '/completed', 'POST', null, auth),
      testEnv
    )
  );
  if (!completedWithout.data.success) {
    throw new Error('completed without tracking failed: ' + JSON.stringify(completedWithout.data));
  }

  const withRow = await env.DB.prepare(
    'SELECT status, tracking_number, ship_date FROM orders WHERE id = ?'
  )
    .bind(withTrackingId)
    .first();
  if (withRow.status !== 'completed' || withRow.tracking_number !== '1234-5678-9012' || !withRow.ship_date) {
    throw new Error('tracked order not saved as expected: ' + JSON.stringify(withRow));
  }

  const withoutRow = await env.DB.prepare(
    'SELECT status, tracking_number, ship_date FROM orders WHERE id = ?'
  )
    .bind(withoutTrackingId)
    .first();
  if (withoutRow.status !== 'completed' || withoutRow.tracking_number || !withoutRow.ship_date) {
    throw new Error('empty tracking order not saved as expected: ' + JSON.stringify(withoutRow));
  }

  const active = await read(
    await worker.fetch(jsonRequest('/api/admin/orders', 'GET', null, auth), testEnv)
  );
  const activeIds = (active.data.orders || []).map((row) => Number(row.id));
  if (activeIds.includes(Number(withTrackingId)) || activeIds.includes(Number(withoutTrackingId))) {
    throw new Error('completed orders should not appear in active list');
  }

  const shipped = await read(
    await worker.fetch(jsonRequest('/api/admin/orders/shipped', 'GET', null, auth), testEnv)
  );
  const shippedWith = (shipped.data.orders || []).find((row) => Number(row.id) === Number(withTrackingId));
  const shippedWithout = (shipped.data.orders || []).find(
    (row) => Number(row.id) === Number(withoutTrackingId)
  );
  if (!shippedWith || shippedWith.tracking_number !== '1234-5678-9012') {
    throw new Error('shipped list missing tracked order: ' + JSON.stringify(shippedWith));
  }
  if (!shippedWithout || shippedWithout.tracking_number) {
    throw new Error('shipped list missing empty-tracking order: ' + JSON.stringify(shippedWithout));
  }

  const beforeTypes = await deliveryTypes(withTrackingId);
  if (!beforeTypes.includes('order_shipped')) {
    throw new Error('missing order_shipped delivery after complete');
  }

  const saved = await read(
    await worker.fetch(
      jsonRequest(
        '/api/admin/orders/' + withTrackingId + '/tracking',
        'POST',
        { trackingNumber: '9999-0000-1111' },
        auth
      ),
      testEnv
    )
  );
  if (!saved.data.success) {
    throw new Error('tracking overwrite failed: ' + JSON.stringify(saved.data));
  }

  const overwritten = await env.DB.prepare('SELECT tracking_number FROM orders WHERE id = ?')
    .bind(withTrackingId)
    .first();
  if (overwritten.tracking_number !== '9999-0000-1111') {
    throw new Error('tracking was not overwritten: ' + JSON.stringify(overwritten));
  }

  const afterTypes = await deliveryTypes(withTrackingId);
  const shippedCount = afterTypes.filter((type) => type === 'order_shipped').length;
  if (shippedCount !== 1) {
    throw new Error('tracking save should not resend mail: ' + JSON.stringify(afterTypes));
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        withTrackingId,
        withoutTrackingId,
      },
      null,
      2
    )
  );
} finally {
  await dispose();
}
