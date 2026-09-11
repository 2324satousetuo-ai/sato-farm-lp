import {
  buildOrderConfirmationEmail,
  buildOrderShippedEmail,
  formatProductName,
  getBankTransferAccount,
  normalizeTrackingNumber,
} from './order-emails.js';
import { applyCatalogPrices, quoteAmountsForProduct } from './price-catalog.js';
import { hitPageView } from './page-views.js';
import {
  attachOrderToPriceOffer,
  isOfferToken,
  isPriceOfferAction,
  listPriceOfferCampaigns,
  listPriceOfferRecipients,
  previewPriceOffer,
  publicOriginFromRequest,
  recordPriceOfferResponse,
  sendPriceOfferCampaign,
} from './price-offer.js';
import { getCurrentPriceStage, isPriceAdmin, setPriceStage } from './price-stage.js';
import {
  REGISTRATION_EMAIL_SUBJECT,
  REGISTRATION_EMAIL_TEXT,
} from './registration-email.js';
import { sendEmail } from './send-email.js';
import {
  hasSendableEmail,
  isHoneypotTriggered,
  normalizeEmail,
  normalizePhoneKey,
  validateMemberContact,
  validateRegistration,
} from './validate.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/visits') {
      if (request.method !== 'GET') {
        return json({ ok: false, message: 'Method Not Allowed' }, 405);
      }
      if (!isSameOrigin(request)) {
        return json({ ok: false, message: 'Forbidden' }, 403);
      }
      try {
        const value = await hitPageView(env);
        return json({ value });
      } catch (error) {
        console.error('page_view_failed', error);
        return json({ ok: false, message: 'counter_failed' }, 500);
      }
    }

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
  const emailOriginal = typeof body.email === 'string' ? body.email.trim() : '';
  const emailNormalized = emailOriginal ? normalizeEmail(emailOriginal) : '';
  const phone = typeof body.phone === 'string' && body.phone.trim() ? body.phone.trim() : null;
  const purchaseIntent = String(body.purchase_intent);

  if (!env.DB) {
    return json({ ok: false, message: '登録を完了できませんでした。しばらくしてから再度お試しください。' }, 500);
  }

  if (!emailNormalized && phone) {
    const existingPhone = await findMemberByPhone(env, phone);
    if (existingPhone) {
      return json(
        {
          ok: false,
          errors: { phone: 'この電話番号は既に登録されています' },
        },
        409
      );
    }
  }

  const memberId = crypto.randomUUID();
  const deliveryId = crypto.randomUUID();
  const now = new Date().toISOString();
  const memberInsert = env.DB.prepare(
    `INSERT INTO members (
       id, name, email_original, email_normalized, purchase_intent, line_user_id,
       created_at, updated_at, member_level, phone
     ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 1, ?)`
  ).bind(memberId, name, emailOriginal, emailNormalized, purchaseIntent, now, now, phone);

  try {
    if (emailNormalized) {
      await env.DB.batch([
        memberInsert,
        env.DB.prepare(
          `INSERT INTO email_deliveries (
             id, member_id, email_type, status, attempt_count, created_at
           ) VALUES (?, ?, 'registration_complete', 'pending', 0, ?)`
        ).bind(deliveryId, memberId, now),
      ]);
    } else {
      await memberInsert.run();
    }
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

  if (hasSendableEmail(emailNormalized)) {
    await sendEmail(
      env,
      emailNormalized,
      REGISTRATION_EMAIL_SUBJECT,
      REGISTRATION_EMAIL_TEXT,
      'registration_complete',
      memberId,
      { deliveryId, memberId }
    );
  }

  return json({ ok: true });
}

async function handleDirectSales(request, env, url) {
  const path = url.pathname;

  try {
    if (path === '/api/products' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT id, weight_label, actual_weight_kg, milled, price, milling_fee, size_class, status
         FROM products
         WHERE status IN ('available', 'preparing')
         ORDER BY milled, actual_weight_kg DESC`
      ).all();
      const stage = await getCurrentPriceStage(env);
      return json({
        success: true,
        products: applyCatalogPrices(results, stage),
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
      return markOrderCompleted(env, completedMatch[1], request);
    }

    const trackingMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/tracking$/);
    if (trackingMatch && request.method === 'POST') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      return updateOrderTracking(env, trackingMatch[1], request);
    }

    if (path === '/api/admin/orders/shipped' && request.method === 'GET') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      const { results } = await env.DB.prepare(
        `SELECT o.id, o.status, o.payment_status, o.total_amount, o.ordered_at, o.paid_at,
                o.ship_date, o.tracking_number,
                o.recipient_name, o.shipping_postal_code, o.shipping_prefecture,
                o.shipping_address, o.shipping_phone, o.notes,
                p.weight_label, p.milled, p.actual_weight_kg
         FROM orders o
         JOIN products p ON o.product_id = p.id
         WHERE o.status = 'completed'
         ORDER BY o.ship_date DESC, o.id DESC`
      ).all();
      return json({ success: true, orders: results });
    }

    if (path === '/api/admin/orders' && request.method === 'GET') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      const { results } = await env.DB.prepare(
        `SELECT o.id, o.status, o.payment_status, o.total_amount, o.ordered_at, o.paid_at,
                o.recipient_name, o.shipping_postal_code, o.shipping_prefecture,
                o.shipping_address, o.shipping_phone, o.notes,
                p.weight_label, p.milled, p.actual_weight_kg
         FROM orders o
         JOIN products p ON o.product_id = p.id
         WHERE o.status IN ('pending_payment', 'preparing')
         ORDER BY o.ordered_at ASC`
      ).all();
      return json({ success: true, orders: results });
    }

    if (path === '/api/admin/members' && request.method === 'GET') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      const { results } = await env.DB.prepare(
        `SELECT name, email_original, phone, purchase_intent, created_at
         FROM members
         ORDER BY created_at DESC`
      ).all();
      return json({ success: true, members: results });
    }

    if (path === '/api/price-offer/respond' && request.method === 'GET') {
      return handlePriceOfferRespondGet(request, env, url);
    }

    if (path === '/api/price-offer/respond' && request.method === 'POST') {
      if (!isSameOrigin(request)) {
        return json({ success: false, error: 'Forbidden' }, 403);
      }
      return handlePriceOfferRespondPost(request, env);
    }

    if (path === '/api/admin/price-offers/preview' && request.method === 'GET') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      const targetIntent = url.searchParams.get('target') || 'lv3';
      try {
        const preview = await previewPriceOffer(env, targetIntent);
        return json({ success: true, ...preview });
      } catch (error) {
        return priceOfferError(error);
      }
    }

    if (path === '/api/admin/price-offers' && request.method === 'GET') {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      try {
        const campaigns = await listPriceOfferCampaigns(env);
        const requestedId = url.searchParams.get('campaignId');
        const campaignId = requestedId || (campaigns[0] && campaigns[0].id) || null;
        const recipients = campaignId ? await listPriceOfferRecipients(env, campaignId) : [];
        return json({ success: true, campaigns, campaignId, recipients });
      } catch (error) {
        return priceOfferError(error);
      }
    }

    if (path === '/api/admin/price-offers' && request.method === 'POST') {
      if (!isSameOrigin(request)) {
        return json({ success: false, error: 'Forbidden' }, 403);
      }
      if (!isAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ success: false, error: '不正なリクエストです。' }, 400);
      }
      const targetIntent = (body && body.targetIntent) || 'lv3';
      if (targetIntent !== 'lv3') {
        return json({ success: false, error: '今回送信できるのは Lv.3 のみです' }, 400);
      }
      try {
        const result = await sendPriceOfferCampaign(env, {
          targetIntent,
          origin: publicOriginFromRequest(request),
        });
        return json({ success: true, ...result });
      } catch (error) {
        return priceOfferError(error);
      }
    }

    if (path === '/api/admin/price-stage' && request.method === 'GET') {
      if (!isPriceAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      const stage = await getCurrentPriceStage(env);
      return json({ success: true, stage });
    }

    if (path === '/api/admin/price-stage' && request.method === 'POST') {
      if (!isSameOrigin(request)) {
        return json({ success: false, error: 'Forbidden' }, 403);
      }
      if (!isPriceAdmin(request, env)) {
        return json({ success: false, error: '認証エラー' }, 401);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ success: false, error: '不正なリクエストです。' }, 400);
      }
      try {
        const result = await setPriceStage(env, body && body.stage);
        return json({
          success: true,
          stage: result.stage,
          changed: result.changed,
          fromStage: result.fromStage,
        });
      } catch (error) {
        if (error && error.code === 'invalid_stage') {
          return json({ success: false, error: '段階は A・B・C のいずれかを指定してください' }, 400);
        }
        throw error;
      }
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

  const stage = await getCurrentPriceStage(env);
  const amounts = quoteAmountsForProduct(product, stage);
  const catalogPrice = amounts.catalogPrice == null ? product.price : amounts.catalogPrice;
  const productPrice = amounts.productPrice == null ? catalogPrice : amounts.productPrice;
  const millingFee = amounts.millingFee || 0;
  const totalAmount = catalogPrice + shippingFee;

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

function priceOfferError(error) {
  const code = error && error.code;
  if (code === 'invalid_intent') {
    return json({ success: false, error: '対象の会員レベルが正しくありません' }, 400);
  }
  if (code === 'invalid_token' || code === 'invalid_action') {
    return json({ success: false, error: '回答リンクが正しくありません' }, 400);
  }
  if (code === 'not_found') {
    return json({ success: false, error: '回答リンクが見つかりません' }, 404);
  }
  if (code === 'no_recipients') {
    return json({ success: false, error: '送信できるメールアドレスの会員がいません' }, 400);
  }
  throw error;
}

function priceOfferHtmlError(message, status) {
  return new Response(
    '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>佐藤農園</title></head><body style="font-family:sans-serif;line-height:1.7;padding:32px;"><p>' +
      String(message) +
      '</p><p><a href="/">トップページへ</a></p></body></html>',
    {
      status: status || 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    }
  );
}

function handlePriceOfferRespondGet(request, env, url) {
  const token = String(url.searchParams.get('t') || '').trim();
  const action = String(url.searchParams.get('a') || '').trim();
  const origin = publicOriginFromRequest(request);

  if (!isOfferToken(token) || !isPriceOfferAction(action)) {
    return Response.redirect(origin + '/price-offer.html?error=invalid', 302);
  }

  if (action !== 'buy') {
    return Response.redirect(
      origin + '/price-offer.html?t=' + encodeURIComponent(token) + '&a=' + encodeURIComponent(action),
      302
    );
  }

  return recordPriceOfferResponse(env, { token, action: 'buy' })
    .then(() => Response.redirect(origin + '/order.html?offer=' + encodeURIComponent(token), 302))
    .catch((error) => {
      if (error && (error.code === 'invalid_token' || error.code === 'not_found' || error.code === 'invalid_action')) {
        return Response.redirect(origin + '/price-offer.html?error=invalid', 302);
      }
      console.error('price_offer_respond_get_failed', error);
      return priceOfferHtmlError('回答の記録に失敗しました。しばらくしてから再度お試しください。', 500);
    });
}

async function handlePriceOfferRespondPost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: '不正なリクエストです。' }, 400);
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const action = typeof body.action === 'string' ? body.action.trim() : '';
  if (action === 'buy') {
    return json({ success: false, error: '購入するは注文フォームからお進みください' }, 400);
  }

  try {
    const result = await recordPriceOfferResponse(env, { token, action });
    return json({ success: true, action: result.action, locked: result.locked });
  } catch (error) {
    return priceOfferError(error);
  }
}

async function markOrderCompleted(env, orderId, request) {
  const parsed = await readOptionalJsonBody(request);
  if (parsed.error) {
    return json({ success: false, error: parsed.error }, 400);
  }

  const trackingNumber = normalizeTrackingNumber(
    parsed.body && parsed.body.trackingNumber
  );
  if (trackingNumber == null) {
    return json({ success: false, error: '追跡番号の形式が正しくありません' }, 400);
  }

  const existing = await env.DB.prepare(
    `SELECT o.status, o.payment_status, o.member_id,
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
    env.DB.prepare(
      `UPDATE orders
       SET status = 'completed',
           tracking_number = ?,
           ship_date = datetime('now')
       WHERE id = ?`
    ).bind(trackingNumber || null, orderId),
    env.DB.prepare(
      `UPDATE members
       SET member_level = 4, updated_at = datetime('now')
       WHERE id = ? AND member_level < 4`
    ).bind(existing.member_id),
  ]);

  let emailPreview = null;
  if (hasSendableEmail(existing.email_normalized)) {
    const shipped = buildOrderShippedEmail({
      orderId,
      productName: formatProductName(existing),
      trackingNumber,
    });
    emailPreview = { subject: shipped.subject, text: shipped.text };
    await sendEmail(
      env,
      existing.email_normalized,
      shipped.subject,
      shipped.text,
      'order_shipped',
      String(orderId),
      { memberId: existing.member_id, orderId, html: shipped.html }
    );
  }

  const payload = {
    success: true,
    message: '発送完了を記録しました。',
  };
  if (String((env && env.PREVIEW_EMAIL) || '') === '1') {
    payload.emailPreview = emailPreview || {
      subject: '',
      text: '送信先メールがないため、発送メールは作成していません。',
    };
  }
  return json(payload);
}

async function updateOrderTracking(env, orderId, request) {
  const parsed = await readOptionalJsonBody(request);
  if (parsed.error) {
    return json({ success: false, error: parsed.error }, 400);
  }

  const trackingNumber = normalizeTrackingNumber(
    parsed.body && parsed.body.trackingNumber
  );
  if (trackingNumber == null) {
    return json({ success: false, error: '追跡番号の形式が正しくありません' }, 400);
  }

  const existing = await env.DB.prepare('SELECT status FROM orders WHERE id = ?')
    .bind(orderId)
    .first();

  if (!existing) {
    return json({ success: false, error: '注文が見つかりません' }, 404);
  }
  if (existing.status !== 'completed') {
    return json(
      { success: false, error: '発送完了後の注文のみ、追跡番号を記録できます' },
      409
    );
  }

  await env.DB.prepare(`UPDATE orders SET tracking_number = ? WHERE id = ?`)
    .bind(trackingNumber || null, orderId)
    .run();

  return json({
    success: true,
    message: '追跡番号を保存しました。メールは再送していません。',
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
  if (!memberInput.name || !memberInput.prefecture || !memberInput.address || !body.productId) {
    return json(
      { success: false, error: '会員情報（氏名・都道府県・住所）と productId は必須です' },
      400
    );
  }

  const contactErrors = validateMemberContact(memberInput.email, memberInput.phone);
  if (Object.keys(contactErrors).length > 0) {
    return json(
      {
        success: false,
        error: contactErrors.contact || contactErrors.email || contactErrors.phone,
      },
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

  const notes = body.notes == null ? '' : String(body.notes).trim();
  if (notes.length > 1000) {
    return json({ success: false, error: '備考は1000文字以内でご記入ください' }, 400);
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
       shipping_address, shipping_phone, notes
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'bank_transfer', 'pending_payment', 'pending_payment', ?, ?, ?, ?, ?, ?, ?)`
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
      member.phone,
      notes || null
    )
    .run();

  const orderId = orderResult.meta.last_row_id;

  const priceOfferToken =
    typeof body.priceOfferToken === 'string' ? body.priceOfferToken.trim() : '';
  if (priceOfferToken) {
    try {
      await attachOrderToPriceOffer(env, { token: priceOfferToken, orderId });
    } catch (error) {
      console.error('price_offer_attach_failed', error);
    }
  }

  await env.DB.prepare(
    `INSERT INTO order_confirmations (
       order_id, confirmed_packaging, confirmed_damage_risk, confirmed_weight_variance,
       confirmed_bank_fee, confirmed_milling_standard, confirmed_milling_loss
     ) VALUES (?, 1, 1, 1, 1, ?, ?)`
  )
    .bind(orderId, confirmations.millingStandard ? 1 : 0, confirmations.millingLoss ? 1 : 0)
    .run();

  const bankAccount = getBankTransferAccount(env);
  if (hasSendableEmail(member.email_normalized)) {
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
  }

  return json({
    success: true,
    orderId,
    totalAmount: quote.totalAmount,
    bankAccount,
    message: 'ご注文を受け付けました。ご案内する口座へお振り込みをお願いいたします。',
  });
}

async function findMemberByPhone(env, phone) {
  const trimmed = String(phone || '').trim();
  const key = normalizePhoneKey(trimmed);
  if (!key) {
    return null;
  }

  const exact = await env.DB.prepare('SELECT id FROM members WHERE phone = ?')
    .bind(trimmed)
    .first();
  if (exact) {
    return exact;
  }

  const { results } = await env.DB.prepare(
    `SELECT id, phone FROM members WHERE phone IS NOT NULL AND TRIM(phone) != ''`
  ).all();
  return (results || []).find((row) => normalizePhoneKey(row.phone) === key) || null;
}

async function findOrCreateMemberForOrder(env, memberInput) {
  const name = String(memberInput.name).trim();
  const emailOriginal = typeof memberInput.email === 'string' ? memberInput.email.trim() : '';
  const emailNormalized = emailOriginal ? normalizeEmail(emailOriginal) : '';
  const postalCode = memberInput.postalCode ? String(memberInput.postalCode).trim() : null;
  const prefecture = String(memberInput.prefecture).trim();
  const address = String(memberInput.address).trim();
  const phone = memberInput.phone ? String(memberInput.phone).trim() : null;
  const now = new Date().toISOString();

  let existing = null;
  if (emailNormalized) {
    existing = await env.DB.prepare('SELECT id FROM members WHERE email_normalized = ?')
      .bind(emailNormalized)
      .first();
  } else if (phone) {
    existing = await findMemberByPhone(env, phone);
  }

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
    if (isUniqueConstraint(error) && emailNormalized) {
      const raced = await env.DB.prepare('SELECT id FROM members WHERE email_normalized = ?')
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

async function readOptionalJsonBody(request) {
  const text = await request.text();
  if (!text || !String(text).trim()) return { body: {} };
  try {
    const parsed = JSON.parse(text);
    if (parsed == null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { error: '不正なリクエストです。' };
    }
    return { body: parsed };
  } catch {
    return { error: '不正なリクエストです。' };
  }
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
