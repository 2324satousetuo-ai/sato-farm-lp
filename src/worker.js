import {
  buildOrderConfirmationEmail,
  buildOrderShippedEmail,
  formatProductName,
  getBankTransferAccount,
} from './order-emails.js';
import {
  REGISTRATION_EMAIL_SUBJECT,
  REGISTRATION_EMAIL_TEXT,
} from './registration-email.js';
import { sendEmail } from './send-email.js';
import {
  isHoneypotTriggered,
  normalizeEmail,
  validateRegistration,
} from './validate.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/register') {
      if (request.method === 'POST') {
        return handleRegister(request, env);
      }
      return json({ ok: false, message: 'Method Not Allowed' }, 405);
    }

    const directSalesResponse = await handleDirectSales(request, env, url);
    if (directSalesResponse) {
      return directSalesResponse;
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleRegister(request, env) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, message: 'Forbidden' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: '不正なリクエストです。' }, 400);
  }

  if (isHoneypotTriggered(body)) {
    return json({ ok: true });
  }

  const errors = validateRegistration(body);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, errors }, 400);
  }

  const name = String(body.name).trim();
  const emailOriginal = String(body.email).trim();
  const emailNormalized = normalizeEmail(emailOriginal);
  const purchaseIntent = String(body.purchase_intent);

  if (!env.DB) {
    return json({ ok: false, message: '登録を完了できませんでした。しばらくしてから再度お試しください。' }, 500);
  }

  const memberId = crypto.randomUUID();
  const deliveryId = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO members (
           id, name, email_original, email_normalized, purchase_intent, line_user_id,
           created_at, updated_at, member_level
         ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 1)`
      ).bind(memberId, name, emailOriginal, emailNormalized, purchaseIntent, now, now),
      env.DB.prepare(
        `INSERT INTO email_deliveries (
           id, member_id, email_type, status, attempt_count, created_at
         ) VALUES (?, ?, 'registration_complete', 'pending', 0, ?)`
      ).bind(deliveryId, memberId, now),
    ]);
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return json(
        {
          ok: false,
          errors: { email: 'このメールアドレスは既に登録されています' },
        },
        409
      );
    }
    console.error('member_insert_failed', error);
    return json(
      { ok: false, message: '登録を完了できませんでした。しばらくしてから再度お試しください。' },
      500
    );
  }

  await sendEmail(
    env,
    emailNormalized,
    REGISTRATION_EMAIL_SUBJECT,
    REGISTRATION_EMAIL_TEXT,
    'registration_complete',
    memberId,
    { deliveryId, memberId }
  );

  return json({ ok: true });
}

async function handleDirectSales(request, env, url) {
  const path = url.pathname;

  try {
    if (path === '/api/products' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT id, weight_label, actual_weight_kg, milled, price, milling_fee, size_class
         FROM products
         WHERE status = 'available'
         ORDER BY milled, actual_weight_kg DESC`
      ).all();
      return json({
        success: true,
        products: results,
        bankAccount: getBankTransferAccount(env),
      });
    }

    if (path === '/api/quote' && request.method === 'POST') {
      if (!isSameOrigin(request)) {
        return json({ success: false, error: 'Forbidden' }, 403);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ success: false, error: '不正なリクエストです。' }, 400);
      }
      if (!body.productId || !body.prefecture) {
        return json({ success: false, error: 'productId と prefecture は必須です' }, 400);
      }
      const quote = await calculateQuote(env, {
        productId: body.productId,
        prefecture: body.prefecture,
        pickupDiscount: !!body.pickupDiscount,
      });
      return json({
        success: true,
        product: {
          id: quote.product.id,
          label: quote.product.weight_label,
          milled: !!quote.product.milled,
        },
        productPrice: quote.productPrice,
        millingFee: quote.millingFee,
        shippingFee: quote.shippingFee,
        totalAmount: quote.totalAmount,
      });
    }

    if (path === '/api/order' && request.method === 'POST') {
      if (!isSameOrigin(request)) {
        return json({ success: false, error: 'Forbidden' }, 403);
      }
      return handleCreateOrder(request, env);
    }

    const orderDetailMatch = path.match(/^\/api\/order\/(\d+)$/);
    if (orderDetailMatch && request.method === 'GET') {
      const orderId = orderDetailMatch[1];
      const order = await env.DB.prepare(
        `SELECT o.*, m.name AS member_name,
                p.weight_label, p.milled, z.zone_name
         FROM orders o
         JOIN members m ON o.member_id = m.id
         JOIN products p ON o.product_id = p.id
         JOIN shipping_zones z ON o.shipping_zone_id = z.id
         WHERE o.id = ?`
      )
        .bind(orderId)
        .first();

      if (!order) {
        return json({ success: false, error: '注文が見つかりません' }, 404);
      }
      return json({ success: true, order });
    }

    const paidMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/paid$/);
    if (paidMatch && request.method === 'POST') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      const orderId = paidMatch[1];
      const existing = await env.DB.prepare(
        'SELECT payment_status FROM orders WHERE id = ?'
      )
        .bind(orderId)
        .first();

      if (!existing) {
        return json({ success: false, error: '注文が見つかりません' }, 404);
      }
      if (existing.payment_status === 'paid') {
        return json({ success: false, error: 'この注文は既に入金確認済みです' }, 409);
      }

      await env.DB.prepare(
        `UPDATE orders
         SET payment_status = 'paid', paid_at = datetime('now'), status = 'preparing'
         WHERE id = ?`
      )
        .bind(orderId)
        .run();

      return json({
        success: true,
        message: '入金確認を記録し、発送準備OKにしました。作業指示書を発行できます。',
      });
    }

    const completedMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/completed$/);
    if (completedMatch && request.method === 'POST') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      return markOrderCompleted(env, completedMatch[1]);
    }

    if (path === '/api/admin/orders' && request.method === 'GET') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      const { results } = await env.DB.prepare(
        `SELECT o.id, o.status, o.payment_status, o.total_amount, o.ordered_at,
                o.recipient_name, o.shipping_postal_code, o.shipping_prefecture,
                o.shipping_address, o.shipping_phone,
                p.weight_label, p.milled
         FROM orders o
         JOIN products p ON o.product_id = p.id
         WHERE o.status IN ('pending_payment', 'preparing')
         ORDER BY o.ordered_at ASC`
      ).all();
      return json({ success: true, orders: results });
    }
  } catch (error) {
    console.error('direct_sales_failed', error);
    return json(
      { success: false, error: error && error.message ? error.message : '処理に失敗しました' },
      500
    );
  }

  return null;
}

async function calculateQuote(env, { productId, prefecture, pickupDiscount }) {
  const product = await env.DB.prepare(
    "SELECT * FROM products WHERE id = ? AND status = 'available'"
  )
    .bind(productId)
    .first();

  if (!product) {
    throw new Error('指定された商品が見つからないか、現在受付停止中です');
  }

  const zoneRow = await env.DB.prepare(
    'SELECT zone_id FROM prefecture_zone_map WHERE prefecture = ?'
  )
    .bind(prefecture)
    .first();

  if (!zoneRow) {
    throw new Error('配送先都道府県が正しくありません: ' + prefecture);
  }

  const rateRow = await env.DB.prepare(
    'SELECT base_rate FROM shipping_rates WHERE zone_id = ? AND size_class = ?'
  )
    .bind(zoneRow.zone_id, product.size_class)
    .first();

  if (!rateRow) {
    throw new Error('送料が見つかりません（ゾーン・サイズ区分の組み合わせ不備）');
  }

  let shippingFee = rateRow.base_rate + (product.weight_surcharge || 0);
  if (pickupDiscount) {
    shippingFee -= 120;
  }

  const productPrice = product.price;
  const millingFee = product.milling_fee || 0;
  const totalAmount = productPrice + millingFee + shippingFee;

  return {
    product,
    zoneId: zoneRow.zone_id,
    productPrice,
    millingFee,
    shippingFee,
    totalAmount,
  };
}

function isAdmin(request, env) {
  const secret = request.headers.get('X-Admin-Secret');
  return Boolean(secret && env.ADMIN_SECRET && secret === env.ADMIN_SECRET);
}

async function markOrderCompleted(env, orderId) {
  const existing = await env.DB.prepare(
    `SELECT o.status, o.payment_status, o.member_id, o.tracking_number,
            m.email_normalized,
            p.weight_label, p.milled
     FROM orders o
     JOIN members m ON o.member_id = m.id
     JOIN products p ON o.product_id = p.id
     WHERE o.id = ?`
  )
    .bind(orderId)
    .first();

  if (!existing) {
    return json({ success: false, error: '注文が見つかりません' }, 404);
  }
  if (existing.status === 'completed') {
    return json({ success: false, error: 'この注文は既に発送完了です' }, 409);
  }
  if (existing.payment_status !== 'paid' || existing.status !== 'preparing') {
    return json(
      { success: false, error: '入金確認後の発送準備中の注文のみ、発送完了にできます' },
      409
    );
  }

  await env.DB.batch([
    env.DB.prepare(`UPDATE orders SET status = 'completed' WHERE id = ?`).bind(orderId),
    env.DB.prepare(
      `UPDATE members
       SET member_level = 4, updated_at = datetime('now')
       WHERE id = ? AND member_level < 4`
    ).bind(existing.member_id),
  ]);

  const shipped = buildOrderShippedEmail({
    orderId,
    productName: formatProductName(existing),
    trackingNumber: existing.tracking_number,
  });
  await sendEmail(
    env,
    existing.email_normalized,
    shipped.subject,
    shipped.text,
    'order_shipped',
    String(orderId),
    { memberId: existing.member_id, orderId, html: shipped.html }
  );

  return json({
    success: true,
    message: '発送完了を記録しました。',
  });
}

async function handleCreateOrder(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: '不正なリクエストです。' }, 400);
  }

  const memberInput = body.member || {};
  if (
    !memberInput.name ||
    !memberInput.email ||
    !memberInput.prefecture ||
    !memberInput.address ||
    !body.productId
  ) {
    return json(
      { success: false, error: '会員情報（氏名・メール・都道府県・住所）と productId は必須です' },
      400
    );
  }

  const confirmations = body.confirmations || {};
  if (
    !confirmations.packaging ||
    !confirmations.damageRisk ||
    !confirmations.weightVariance ||
    !confirmations.bankFee
  ) {
    return json({ success: false, error: '必須の確認事項にすべてチェックが入っていません' }, 400);
  }

  const quote = await calculateQuote(env, {
    productId: body.productId,
    prefecture: memberInput.prefecture,
    pickupDiscount: !!body.pickupDiscount,
  });

  if (quote.product.milled && (!confirmations.millingStandard || !confirmations.millingLoss)) {
    return json({ success: false, error: '精米商品には精米関連の確認事項が必須です' }, 400);
  }

  if (!env.DB) {
    return json({ success: false, error: '注文を完了できませんでした。しばらくしてから再度お試しください。' }, 500);
  }

  const desiredTiming = parseDesiredTiming(body.desiredTiming ?? body.desired_timing);
  if (!desiredTiming) {
    return json({ success: false, error: '購入希望時期の指定が正しくありません' }, 400);
  }

  const memberId = await findOrCreateMemberForOrder(env, memberInput);

  const member = await env.DB.prepare(
    'SELECT name, email_normalized, postal_code, prefecture, address, phone FROM members WHERE id = ?'
  )
    .bind(memberId)
    .first();

  if (!member) {
    return json({ success: false, error: '会員情報を保存できませんでした。' }, 500);
  }

  const orderResult = await env.DB.prepare(
    `INSERT INTO orders (
       member_id, product_id, shipping_zone_id, pickup_discount,
       product_price, milling_fee, shipping_fee, total_amount,
       payment_method, payment_status, status,
       desired_timing,
       recipient_name, shipping_postal_code, shipping_prefecture,
       shipping_address, shipping_phone
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'bank_transfer', 'pending_payment', 'pending_payment', ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      memberId,
      body.productId,
      quote.zoneId,
      body.pickupDiscount ? 1 : 0,
      quote.productPrice,
      quote.millingFee,
      quote.shippingFee,
      quote.totalAmount,
      desiredTiming,
      member.name,
      member.postal_code,
      member.prefecture,
      member.address,
      member.phone
    )
    .run();

  const orderId = orderResult.meta.last_row_id;

  await env.DB.prepare(
    `INSERT INTO order_confirmations (
       order_id, confirmed_packaging, confirmed_damage_risk, confirmed_weight_variance,
       confirmed_bank_fee, confirmed_milling_standard, confirmed_milling_loss
     ) VALUES (?, 1, 1, 1, 1, ?, ?)`
  )
    .bind(orderId, confirmations.millingStandard ? 1 : 0, confirmations.millingLoss ? 1 : 0)
    .run();

  const bankAccount = getBankTransferAccount(env);
  const confirmation = buildOrderConfirmationEmail({
    orderId,
    productName: formatProductName(quote.product),
    totalAmount: quote.totalAmount,
    bankAccount,
  });
  await sendEmail(
    env,
    member.email_normalized,
    confirmation.subject,
    confirmation.text,
    'order_confirmation',
    String(orderId),
    { memberId, orderId, html: confirmation.html }
  );

  return json({
    success: true,
    orderId,
    totalAmount: quote.totalAmount,
    bankAccount,
    message: 'ご注文を受け付けました。ご案内する口座へお振り込みをお願いいたします。',
  });
}

async function findOrCreateMemberForOrder(env, memberInput) {
  const name = String(memberInput.name).trim();
  const emailOriginal = String(memberInput.email).trim();
  const emailNormalized = normalizeEmail(emailOriginal);
  const postalCode = memberInput.postalCode ? String(memberInput.postalCode).trim() : null;
  const prefecture = String(memberInput.prefecture).trim();
  const address = String(memberInput.address).trim();
  const phone = memberInput.phone ? String(memberInput.phone).trim() : null;
  const now = new Date().toISOString();

  const existing = await env.DB.prepare(
    'SELECT id FROM members WHERE email_normalized = ?'
  )
    .bind(emailNormalized)
    .first();

  if (existing) {
    await env.DB.prepare(
      `UPDATE members
       SET name = ?, postal_code = ?, prefecture = ?, address = ?, phone = ?, updated_at = ?
       WHERE id = ?`
    )
      .bind(name, postalCode, prefecture, address, phone, now, existing.id)
      .run();
    return existing.id;
  }

  const memberId = crypto.randomUUID();
  try {
    await env.DB.prepare(
      `INSERT INTO members (
         id, name, email_original, email_normalized, purchase_intent, line_user_id,
         created_at, updated_at, postal_code, prefecture, address, phone, member_level
       ) VALUES (?, ?, ?, ?, 'lv3', NULL, ?, ?, ?, ?, ?, ?, 1)`
    )
      .bind(
        memberId,
        name,
        emailOriginal,
        emailNormalized,
        now,
        now,
        postalCode,
        prefecture,
        address,
        phone
      )
      .run();
    return memberId;
  } catch (error) {
    if (isUniqueConstraint(error)) {
      const raced = await env.DB.prepare(
        'SELECT id FROM members WHERE email_normalized = ?'
      )
        .bind(emailNormalized)
        .first();
      if (raced) {
        await env.DB.prepare(
          `UPDATE members
           SET name = ?, postal_code = ?, prefecture = ?, address = ?, phone = ?, updated_at = ?
           WHERE id = ?`
        )
          .bind(name, postalCode, prefecture, address, phone, now, raced.id)
          .run();
        return raced.id;
      }
    }
    throw error;
  }
}

const DESIRED_TIMING_VALUES = ['asap', 'specific_month', 'after_new_year', 'march', 'anytime'];

function parseDesiredTiming(value) {
  if (value == null || value === '') {
    return 'asap';
  }
  const timing = String(value);
  return DESIRED_TIMING_VALUES.includes(timing) ? timing : null;
}

function isSameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) {
    return true;
  }
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function isUniqueConstraint(error) {
  const text = [
    error && error.message,
    error && error.cause && error.cause.message,
    String(error),
  ]
    .filter(Boolean)
    .join(' ');
  return /UNIQUE constraint failed/i.test(text) || /SQLITE_CONSTRAINT/i.test(text);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
