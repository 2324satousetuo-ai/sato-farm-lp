import {
  REGISTRATION_EMAIL_SUBJECT,
  REGISTRATION_EMAIL_TEXT,
} from './registration-email.js';
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
           id, name, email_original, email_normalized, purchase_intent, line_user_id, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?)`
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

  await sendRegistrationEmail(env, {
    deliveryId,
    memberId,
    to: emailNormalized,
  });

  return json({ ok: true });
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

async function sendRegistrationEmail(env, { deliveryId, memberId, to }) {
  if (!env.RESEND_API_KEY) {
    await updateDelivery(env, deliveryId, {
      status: 'failed',
      lastError: 'RESEND_API_KEY is not configured',
    });
    return;
  }

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json',
        'Idempotency-Key': 'registration-complete/' + memberId,
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [to],
        reply_to: env.MAIL_REPLY_TO,
        subject: REGISTRATION_EMAIL_SUBJECT,
        text: REGISTRATION_EMAIL_TEXT,
      }),
    });
  } catch (error) {
    await updateDelivery(env, deliveryId, {
      lastError: 'network_error: ' + String((error && error.message) || error),
    });
    return;
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    await updateDelivery(env, deliveryId, {
      lastError: 'resend_response_unreadable status=' + response.status,
    });
    return;
  }

  if (response.ok && data && data.id) {
    await updateDelivery(env, deliveryId, {
      status: 'sent',
      providerMessageId: data.id,
    });
    return;
  }

  if (response.status === 409) {
    await updateDelivery(env, deliveryId, {
      lastError: 'resend_conflict: ' + JSON.stringify(data),
    });
    return;
  }

  await updateDelivery(env, deliveryId, {
    status: 'failed',
    lastError: 'resend_http_' + response.status + ': ' + JSON.stringify(data),
  });
}

async function updateDelivery(env, deliveryId, fields) {
  const status = fields.status || null;
  const lastError = fields.lastError || null;
  const providerMessageId = fields.providerMessageId || null;
  const sentAt = status === 'sent' ? new Date().toISOString() : null;

  if (status === 'sent') {
    await env.DB.prepare(
      `UPDATE email_deliveries
       SET status = 'sent',
           provider_message_id = ?,
           attempt_count = attempt_count + 1,
           last_error = NULL,
           sent_at = ?
       WHERE id = ? AND status = 'pending'`
    )
      .bind(providerMessageId, sentAt, deliveryId)
      .run();
    return;
  }

  if (status === 'failed') {
    await env.DB.prepare(
      `UPDATE email_deliveries
       SET status = 'failed',
           attempt_count = attempt_count + 1,
           last_error = ?
       WHERE id = ? AND status = 'pending'`
    )
      .bind(lastError, deliveryId)
      .run();
    return;
  }

  await env.DB.prepare(
    `UPDATE email_deliveries
     SET attempt_count = attempt_count + 1,
         last_error = ?
     WHERE id = ? AND status = 'pending'`
  )
    .bind(lastError, deliveryId)
    .run();
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
