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

function idempotencyKey(kind, referenceId) {
  return String(kind).replace(/_/g, '-') + '/' + referenceId;
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
           last_error = ?,
           sent_at = ?
       WHERE id = ? AND status = 'pending'`
    )
      .bind(providerMessageId, lastError, sentAt, deliveryId)
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

async function ensureDelivery(env, { deliveryId, memberId, kind, orderId }) {
  if (deliveryId) {
    return deliveryId;
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    await env.DB.prepare(
      `INSERT INTO email_deliveries (
         id, member_id, email_type, status, attempt_count, created_at, order_id
       ) VALUES (?, ?, ?, 'pending', 0, ?, ?)`
    )
      .bind(id, memberId, kind, now, orderId ?? null)
      .run();
    return id;
  } catch (error) {
    if (isUniqueConstraint(error)) {
      const existing = await env.DB.prepare(
        orderId == null
          ? `SELECT id FROM email_deliveries
             WHERE member_id = ? AND email_type = ? AND order_id IS NULL`
          : `SELECT id FROM email_deliveries
             WHERE member_id = ? AND email_type = ? AND order_id = ?`
      )
        .bind(...(orderId == null ? [memberId, kind] : [memberId, kind, orderId]))
        .first();
      return existing && existing.id ? existing.id : id;
    }
    throw error;
  }
}

/**
 * 共通のメール送信。会員登録も産直もここを通す。
 * kind: email_type（registration_complete / order_confirmation / order_shipped）
 * referenceId: 冪等キー用。会員登録は memberId、産直は orderId。
 */
export async function sendEmail(env, to, subject, text, kind, referenceId, options = {}) {
  if (!to || !String(to).trim()) {
    return { status: 'skipped' };
  }

  const memberId = options.memberId || referenceId;
  const orderId = options.orderId == null ? null : options.orderId;
  const deliveryId = await ensureDelivery(env, {
    deliveryId: options.deliveryId,
    memberId,
    kind,
    orderId,
  });

  if (!env.RESEND_API_KEY) {
    await updateDelivery(env, deliveryId, {
      status: 'failed',
      lastError: 'RESEND_API_KEY is not configured',
    });
    return { deliveryId, status: 'failed' };
  }

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey(kind, referenceId),
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [to],
        reply_to: env.MAIL_REPLY_TO,
        subject,
        text,
        ...(options.html ? { html: options.html } : {}),
      }),
    });
  } catch (error) {
    await updateDelivery(env, deliveryId, {
      status: 'failed',
      lastError: 'network_error: ' + String((error && error.message) || error),
    });
    return { deliveryId, status: 'failed' };
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    await updateDelivery(env, deliveryId, {
      status: 'failed',
      lastError: 'resend_response_unreadable status=' + response.status,
    });
    return { deliveryId, status: 'failed' };
  }

  if (response.ok && data && data.id) {
    await updateDelivery(env, deliveryId, {
      status: 'sent',
      providerMessageId: data.id,
    });
    return { deliveryId, status: 'sent' };
  }

  if (response.status === 409) {
    await updateDelivery(env, deliveryId, {
      status: 'sent',
      providerMessageId: data && data.id ? data.id : null,
      lastError: 'resend_conflict（冪等性による再受理）: ' + JSON.stringify(data),
    });
    return { deliveryId, status: 'sent' };
  }

  await updateDelivery(env, deliveryId, {
    status: 'failed',
    lastError: 'resend_http_' + response.status + ': ' + JSON.stringify(data),
  });
  return { deliveryId, status: 'failed' };
}

export { idempotencyKey, updateDelivery };
