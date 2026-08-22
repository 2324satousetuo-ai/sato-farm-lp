var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/registration-email.js
var REGISTRATION_EMAIL_SUBJECT = "\u4F50\u85E4\u8FB2\u5712\u306E\u304A\u7C73\u306B\u3054\u767B\u9332\u3044\u305F\u3060\u304D\u3001\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059";
var REGISTRATION_EMAIL_TEXT = [
  "\u3053\u306E\u305F\u3073\u306F\u3001\u4F50\u85E4\u8FB2\u5712\u306E\u304A\u7C73\u306B\u95A2\u5FC3\u3092\u6301\u3063\u3066\u3044\u305F\u3060\u304D\u3001\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059\u3002",
  "",
  "\u4F50\u85E4\u8FB2\u5712\u3067\u306F\u3001\u9650\u3089\u308C\u305F\u53CE\u7A6B\u91CF\u306E\u304A\u7C73\u3092\u3001\u3067\u304D\u308B\u3060\u3051\u9854\u306E\u898B\u3048\u308B\u5F62\u3067\u304A\u5C4A\u3051\u3057\u305F\u3044\u3068\u8003\u3048\u3066\u3044\u307E\u3059\u3002",
  "",
  "\u7530\u690D\u3048\u304B\u3089\u751F\u80B2\u3001\u53CE\u7A6B\u307E\u3067\u3002",
  "\u305D\u306E\u5E74\u306E\u304A\u7C73\u304C\u3069\u306E\u3088\u3046\u306B\u80B2\u3063\u3066\u3044\u304F\u306E\u304B\u3082\u3001\u30D6\u30ED\u30B0\u3067\u304A\u4F1D\u3048\u3057\u3066\u3044\u304D\u307E\u3059\u3002",
  "",
  "\u4ECA\u5E74\u306E\u53CE\u7A6B\u91CF\u3084\u304A\u7C73\u306E\u72B6\u614B\u3092\u898B\u306A\u304C\u3089\u3001\u8CA9\u58F2\u4FA1\u683C\u3068\u6570\u91CF\u3092\u6C7A\u3081\u308B\u4E88\u5B9A\u3067\u3059\u3002",
  "\u8CA9\u58F2\u306E\u6E96\u5099\u304C\u6574\u3044\u307E\u3057\u305F\u3089\u3001\u6539\u3081\u3066\u3054\u6848\u5185\u3057\u307E\u3059\u3002",
  "",
  "\u307E\u305A\u306F\u3001\u3054\u767B\u9332\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F\u3002",
  "",
  "\u4F50\u85E4\u8FB2\u5712"
].join("\n");

// src/validate.js
var PURCHASE_INTENTS = /* @__PURE__ */ new Set(["lv1", "lv2", "lv3"]);
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}
__name(normalizeEmail, "normalizeEmail");
function validateRegistration(body) {
  const errors = {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const purchaseIntent = typeof body.purchase_intent === "string" ? body.purchase_intent : "";
  if (!name) {
    errors.name = "\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  } else if (CONTROL_CHARS.test(name)) {
    errors.name = "\u4F7F\u7528\u3067\u304D\u306A\u3044\u6587\u5B57\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002";
  } else if (Array.from(name).length > 80) {
    errors.name = "\u540D\u524D\u306F80\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  }
  if (!email) {
    errors.email = "\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  } else if (/\s/.test(email) || !EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.email = "\u6B63\u3057\u3044\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  }
  if (!purchaseIntent) {
    errors.purchase_intent = "\u8CFC\u5165\u95A2\u5FC3\u30EC\u30D9\u30EB\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  } else if (!PURCHASE_INTENTS.has(purchaseIntent)) {
    errors.purchase_intent = "\u8CFC\u5165\u95A2\u5FC3\u30EC\u30D9\u30EB\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  }
  if (body.privacy_agreed !== true) {
    errors.privacy_agreed = "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC\u3078\u306E\u540C\u610F\u304C\u5FC5\u8981\u3067\u3059\u3002";
  }
  return errors;
}
__name(validateRegistration, "validateRegistration");
function isHoneypotTriggered(body) {
  return typeof body.website === "string" && body.website.trim() !== "";
}
__name(isHoneypotTriggered, "isHoneypotTriggered");

// src/worker.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/register") {
      if (request.method === "POST") {
        return handleRegister(request, env);
      }
      return json({ ok: false, message: "Method Not Allowed" }, 405);
    }
    const directSalesResponse = await handleDirectSales(request, env, url);
    if (directSalesResponse) {
      return directSalesResponse;
    }
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response("Not found", { status: 404 });
  }
};
async function handleRegister(request, env) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, message: "Forbidden" }, 403);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "\u4E0D\u6B63\u306A\u30EA\u30AF\u30A8\u30B9\u30C8\u3067\u3059\u3002" }, 400);
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
    return json({ ok: false, message: "\u767B\u9332\u3092\u5B8C\u4E86\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3057\u3070\u3089\u304F\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002" }, 500);
  }
  const memberId = crypto.randomUUID();
  const deliveryId = crypto.randomUUID();
  const now = (/* @__PURE__ */ new Date()).toISOString();
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
      ).bind(deliveryId, memberId, now)
    ]);
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return json(
        {
          ok: false,
          errors: { email: "\u3053\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059" }
        },
        409
      );
    }
    console.error("member_insert_failed", error);
    return json(
      { ok: false, message: "\u767B\u9332\u3092\u5B8C\u4E86\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3057\u3070\u3089\u304F\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002" },
      500
    );
  }
  await sendRegistrationEmail(env, {
    deliveryId,
    memberId,
    to: emailNormalized
  });
  return json({ ok: true });
}
__name(handleRegister, "handleRegister");
async function handleDirectSales(request, env, url) {
  const path = url.pathname;
  try {
    if (path === "/api/products" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        `SELECT id, weight_label, actual_weight_kg, milled, price, milling_fee, size_class
         FROM products
         WHERE status = 'available'
         ORDER BY milled, actual_weight_kg DESC`
      ).all();
      return json({ success: true, products: results });
    }
    if (path === "/api/quote" && request.method === "POST") {
      if (!isSameOrigin(request)) {
        return json({ success: false, error: "Forbidden" }, 403);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ success: false, error: "\u4E0D\u6B63\u306A\u30EA\u30AF\u30A8\u30B9\u30C8\u3067\u3059\u3002" }, 400);
      }
      if (!body.productId || !body.prefecture) {
        return json({ success: false, error: "productId \u3068 prefecture \u306F\u5FC5\u9808\u3067\u3059" }, 400);
      }
      const quote = await calculateQuote(env, {
        productId: body.productId,
        prefecture: body.prefecture,
        pickupDiscount: !!body.pickupDiscount
      });
      return json({
        success: true,
        product: {
          id: quote.product.id,
          label: quote.product.weight_label,
          milled: !!quote.product.milled
        },
        productPrice: quote.productPrice,
        millingFee: quote.millingFee,
        shippingFee: quote.shippingFee,
        totalAmount: quote.totalAmount
      });
    }
    if (path === "/api/order" && request.method === "POST") {
      if (!isSameOrigin(request)) {
        return json({ success: false, error: "Forbidden" }, 403);
      }
      return handleCreateOrder(request, env);
    }
    const orderDetailMatch = path.match(/^\/api\/order\/(\d+)$/);
    if (orderDetailMatch && request.method === "GET") {
      const orderId = orderDetailMatch[1];
      const order = await env.DB.prepare(
        `SELECT o.*, m.name AS member_name, m.postal_code, m.prefecture, m.address, m.phone,
                p.weight_label, p.milled, z.zone_name
         FROM orders o
         JOIN members m ON o.member_id = m.id
         JOIN products p ON o.product_id = p.id
         JOIN shipping_zones z ON o.shipping_zone_id = z.id
         WHERE o.id = ?`
      ).bind(orderId).first();
      if (!order) {
        return json({ success: false, error: "\u6CE8\u6587\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093" }, 404);
      }
      return json({ success: true, order });
    }
    const paidMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/paid$/);
    if (paidMatch && request.method === "POST") {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: "\u8A8D\u8A3C\u30A8\u30E9\u30FC" }, 401);
      }
      const orderId = paidMatch[1];
      const existing = await env.DB.prepare(
        "SELECT payment_status FROM orders WHERE id = ?"
      ).bind(orderId).first();
      if (!existing) {
        return json({ success: false, error: "\u6CE8\u6587\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093" }, 404);
      }
      if (existing.payment_status === "paid") {
        return json({ success: false, error: "\u3053\u306E\u6CE8\u6587\u306F\u65E2\u306B\u5165\u91D1\u78BA\u8A8D\u6E08\u307F\u3067\u3059" }, 409);
      }
      await env.DB.prepare(
        `UPDATE orders
         SET payment_status = 'paid', paid_at = datetime('now'), status = 'preparing'
         WHERE id = ?`
      ).bind(orderId).run();
      return json({
        success: true,
        message: "\u5165\u91D1\u78BA\u8A8D\u3092\u8A18\u9332\u3057\u3001\u767A\u9001\u6E96\u5099OK\u306B\u3057\u307E\u3057\u305F\u3002\u4F5C\u696D\u6307\u793A\u66F8\u3092\u767A\u884C\u3067\u304D\u307E\u3059\u3002"
      });
    }
    const completedMatch = path.match(/^\/api\/admin\/orders\/(\d+)\/completed$/);
    if (completedMatch && request.method === "POST") {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: "\u8A8D\u8A3C\u30A8\u30E9\u30FC" }, 401);
      }
      return markOrderCompleted(env, completedMatch[1]);
    }
    if (path === "/api/admin/orders" && request.method === "GET") {
      if (!isAdmin(request, env)) {
        return json({ success: false, error: "\u8A8D\u8A3C\u30A8\u30E9\u30FC" }, 401);
      }
      const { results } = await env.DB.prepare(
        `SELECT o.id, o.status, o.payment_status, o.total_amount, o.ordered_at,
                m.name AS member_name, p.weight_label, p.milled
         FROM orders o
         JOIN members m ON o.member_id = m.id
         JOIN products p ON o.product_id = p.id
         WHERE o.status IN ('pending_payment', 'preparing')
         ORDER BY o.ordered_at ASC`
      ).all();
      return json({ success: true, orders: results });
    }
  } catch (error) {
    console.error("direct_sales_failed", error);
    return json(
      { success: false, error: error && error.message ? error.message : "\u51E6\u7406\u306B\u5931\u6557\u3057\u307E\u3057\u305F" },
      500
    );
  }
  return null;
}
__name(handleDirectSales, "handleDirectSales");
async function calculateQuote(env, { productId, prefecture, pickupDiscount }) {
  const product = await env.DB.prepare(
    "SELECT * FROM products WHERE id = ? AND status = 'available'"
  ).bind(productId).first();
  if (!product) {
    throw new Error("\u6307\u5B9A\u3055\u308C\u305F\u5546\u54C1\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u304B\u3001\u73FE\u5728\u53D7\u4ED8\u505C\u6B62\u4E2D\u3067\u3059");
  }
  const zoneRow = await env.DB.prepare(
    "SELECT zone_id FROM prefecture_zone_map WHERE prefecture = ?"
  ).bind(prefecture).first();
  if (!zoneRow) {
    throw new Error("\u914D\u9001\u5148\u90FD\u9053\u5E9C\u770C\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093: " + prefecture);
  }
  const rateRow = await env.DB.prepare(
    "SELECT base_rate FROM shipping_rates WHERE zone_id = ? AND size_class = ?"
  ).bind(zoneRow.zone_id, product.size_class).first();
  if (!rateRow) {
    throw new Error("\u9001\u6599\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\uFF08\u30BE\u30FC\u30F3\u30FB\u30B5\u30A4\u30BA\u533A\u5206\u306E\u7D44\u307F\u5408\u308F\u305B\u4E0D\u5099\uFF09");
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
    totalAmount
  };
}
__name(calculateQuote, "calculateQuote");
function isAdmin(request, env) {
  const secret = request.headers.get("X-Admin-Secret");
  return Boolean(secret && env.ADMIN_SECRET && secret === env.ADMIN_SECRET);
}
__name(isAdmin, "isAdmin");
async function markOrderCompleted(env, orderId) {
  const existing = await env.DB.prepare(
    "SELECT status, payment_status, member_id FROM orders WHERE id = ?"
  ).bind(orderId).first();
  if (!existing) {
    return json({ success: false, error: "\u6CE8\u6587\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093" }, 404);
  }
  if (existing.status === "completed") {
    return json({ success: false, error: "\u3053\u306E\u6CE8\u6587\u306F\u65E2\u306B\u767A\u9001\u5B8C\u4E86\u3067\u3059" }, 409);
  }
  if (existing.payment_status !== "paid" || existing.status !== "preparing") {
    return json(
      { success: false, error: "\u5165\u91D1\u78BA\u8A8D\u5F8C\u306E\u767A\u9001\u6E96\u5099\u4E2D\u306E\u6CE8\u6587\u306E\u307F\u3001\u767A\u9001\u5B8C\u4E86\u306B\u3067\u304D\u307E\u3059" },
      409
    );
  }
  await env.DB.batch([
    env.DB.prepare(`UPDATE orders SET status = 'completed' WHERE id = ?`).bind(orderId),
    env.DB.prepare(
      `UPDATE members
       SET member_level = 4, updated_at = datetime('now')
       WHERE id = ? AND member_level < 4`
    ).bind(existing.member_id)
  ]);
  return json({
    success: true,
    message: "\u767A\u9001\u5B8C\u4E86\u3092\u8A18\u9332\u3057\u307E\u3057\u305F\u3002"
  });
}
__name(markOrderCompleted, "markOrderCompleted");
async function handleCreateOrder(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "\u4E0D\u6B63\u306A\u30EA\u30AF\u30A8\u30B9\u30C8\u3067\u3059\u3002" }, 400);
  }
  const memberInput = body.member || {};
  if (!memberInput.name || !memberInput.email || !memberInput.prefecture || !memberInput.address || !body.productId) {
    return json(
      { success: false, error: "\u4F1A\u54E1\u60C5\u5831\uFF08\u6C0F\u540D\u30FB\u30E1\u30FC\u30EB\u30FB\u90FD\u9053\u5E9C\u770C\u30FB\u4F4F\u6240\uFF09\u3068 productId \u306F\u5FC5\u9808\u3067\u3059" },
      400
    );
  }
  const confirmations = body.confirmations || {};
  if (!confirmations.packaging || !confirmations.damageRisk || !confirmations.weightVariance || !confirmations.bankFee) {
    return json({ success: false, error: "\u5FC5\u9808\u306E\u78BA\u8A8D\u4E8B\u9805\u306B\u3059\u3079\u3066\u30C1\u30A7\u30C3\u30AF\u304C\u5165\u3063\u3066\u3044\u307E\u305B\u3093" }, 400);
  }
  const quote = await calculateQuote(env, {
    productId: body.productId,
    prefecture: memberInput.prefecture,
    pickupDiscount: !!body.pickupDiscount
  });
  if (quote.product.milled && (!confirmations.millingStandard || !confirmations.millingLoss)) {
    return json({ success: false, error: "\u7CBE\u7C73\u5546\u54C1\u306B\u306F\u7CBE\u7C73\u95A2\u9023\u306E\u78BA\u8A8D\u4E8B\u9805\u304C\u5FC5\u9808\u3067\u3059" }, 400);
  }
  if (!env.DB) {
    return json({ success: false, error: "\u6CE8\u6587\u3092\u5B8C\u4E86\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3057\u3070\u3089\u304F\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002" }, 500);
  }
  const memberId = await findOrCreateMemberForOrder(env, memberInput);
  const orderResult = await env.DB.prepare(
    `INSERT INTO orders (
       member_id, product_id, shipping_zone_id, pickup_discount,
       product_price, milling_fee, shipping_fee, total_amount,
       payment_method, payment_status, status
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'bank_transfer', 'pending_payment', 'pending_payment')`
  ).bind(
    memberId,
    body.productId,
    quote.zoneId,
    body.pickupDiscount ? 1 : 0,
    quote.productPrice,
    quote.millingFee,
    quote.shippingFee,
    quote.totalAmount
  ).run();
  const orderId = orderResult.meta.last_row_id;
  await env.DB.prepare(
    `INSERT INTO order_confirmations (
       order_id, confirmed_packaging, confirmed_damage_risk, confirmed_weight_variance,
       confirmed_bank_fee, confirmed_milling_standard, confirmed_milling_loss
     ) VALUES (?, 1, 1, 1, 1, ?, ?)`
  ).bind(orderId, confirmations.millingStandard ? 1 : 0, confirmations.millingLoss ? 1 : 0).run();
  return json({
    success: true,
    orderId,
    totalAmount: quote.totalAmount,
    message: "\u3054\u6CE8\u6587\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\u3002\u3054\u6848\u5185\u3059\u308B\u53E3\u5EA7\u3078\u304A\u632F\u308A\u8FBC\u307F\u3092\u304A\u9858\u3044\u3044\u305F\u3057\u307E\u3059\u3002"
  });
}
__name(handleCreateOrder, "handleCreateOrder");
async function findOrCreateMemberForOrder(env, memberInput) {
  const name = String(memberInput.name).trim();
  const emailOriginal = String(memberInput.email).trim();
  const emailNormalized = normalizeEmail(emailOriginal);
  const postalCode = memberInput.postalCode ? String(memberInput.postalCode).trim() : null;
  const prefecture = String(memberInput.prefecture).trim();
  const address = String(memberInput.address).trim();
  const phone = memberInput.phone ? String(memberInput.phone).trim() : null;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const existing = await env.DB.prepare(
    "SELECT id FROM members WHERE email_normalized = ?"
  ).bind(emailNormalized).first();
  if (existing) {
    await env.DB.prepare(
      `UPDATE members
       SET name = ?, postal_code = ?, prefecture = ?, address = ?, phone = ?, updated_at = ?
       WHERE id = ?`
    ).bind(name, postalCode, prefecture, address, phone, now, existing.id).run();
    return existing.id;
  }
  const memberId = crypto.randomUUID();
  try {
    await env.DB.prepare(
      `INSERT INTO members (
         id, name, email_original, email_normalized, purchase_intent, line_user_id,
         created_at, updated_at, postal_code, prefecture, address, phone, member_level
       ) VALUES (?, ?, ?, ?, 'lv3', NULL, ?, ?, ?, ?, ?, ?, 1)`
    ).bind(
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
    ).run();
    return memberId;
  } catch (error) {
    if (isUniqueConstraint(error)) {
      const raced = await env.DB.prepare(
        "SELECT id FROM members WHERE email_normalized = ?"
      ).bind(emailNormalized).first();
      if (raced) {
        return raced.id;
      }
    }
    throw error;
  }
}
__name(findOrCreateMemberForOrder, "findOrCreateMemberForOrder");
function isSameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) {
    return true;
  }
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
__name(isSameOrigin, "isSameOrigin");
function isUniqueConstraint(error) {
  const text = [
    error && error.message,
    error && error.cause && error.cause.message,
    String(error)
  ].filter(Boolean).join(" ");
  return /UNIQUE constraint failed/i.test(text) || /SQLITE_CONSTRAINT/i.test(text);
}
__name(isUniqueConstraint, "isUniqueConstraint");
async function sendRegistrationEmail(env, { deliveryId, memberId, to }) {
  if (!env.RESEND_API_KEY) {
    await updateDelivery(env, deliveryId, {
      status: "failed",
      lastError: "RESEND_API_KEY is not configured"
    });
    return;
  }
  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": "registration-complete/" + memberId
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [to],
        reply_to: env.MAIL_REPLY_TO,
        subject: REGISTRATION_EMAIL_SUBJECT,
        text: REGISTRATION_EMAIL_TEXT
      })
    });
  } catch (error) {
    await updateDelivery(env, deliveryId, {
      status: "failed",
      lastError: "network_error: " + String(error && error.message || error)
    });
    return;
  }
  let data = {};
  try {
    data = await response.json();
  } catch {
    await updateDelivery(env, deliveryId, {
      status: "failed",
      lastError: "resend_response_unreadable status=" + response.status
    });
    return;
  }
  if (response.ok && data && data.id) {
    await updateDelivery(env, deliveryId, {
      status: "sent",
      providerMessageId: data.id
    });
    return;
  }
  if (response.status === 409) {
    await updateDelivery(env, deliveryId, {
      status: "sent",
      providerMessageId: data && data.id ? data.id : null,
      lastError: "resend_conflict\uFF08\u51AA\u7B49\u6027\u306B\u3088\u308B\u518D\u53D7\u7406\uFF09: " + JSON.stringify(data)
    });
    return;
  }
  await updateDelivery(env, deliveryId, {
    status: "failed",
    lastError: "resend_http_" + response.status + ": " + JSON.stringify(data)
  });
}
__name(sendRegistrationEmail, "sendRegistrationEmail");
async function updateDelivery(env, deliveryId, fields) {
  const status = fields.status || null;
  const lastError = fields.lastError || null;
  const providerMessageId = fields.providerMessageId || null;
  const sentAt = status === "sent" ? (/* @__PURE__ */ new Date()).toISOString() : null;
  if (status === "sent") {
    await env.DB.prepare(
      `UPDATE email_deliveries
       SET status = 'sent',
           provider_message_id = ?,
           attempt_count = attempt_count + 1,
           last_error = ?,
           sent_at = ?
       WHERE id = ? AND status = 'pending'`
    ).bind(providerMessageId, lastError, sentAt, deliveryId).run();
    return;
  }
  if (status === "failed") {
    await env.DB.prepare(
      `UPDATE email_deliveries
       SET status = 'failed',
           attempt_count = attempt_count + 1,
           last_error = ?
       WHERE id = ? AND status = 'pending'`
    ).bind(lastError, deliveryId).run();
    return;
  }
  await env.DB.prepare(
    `UPDATE email_deliveries
     SET attempt_count = attempt_count + 1,
         last_error = ?
     WHERE id = ? AND status = 'pending'`
  ).bind(lastError, deliveryId).run();
}
__name(updateDelivery, "updateDelivery");
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
__name(json, "json");
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
