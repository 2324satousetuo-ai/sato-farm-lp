import { getCurrentPriceStage } from './price-stage.js';
import { hasSendableEmail } from './validate.js';

export const PRICE_OFFER_SUBJECT = '佐藤農園のお米、今年の価格が決まりました';
export const PRICE_OFFER_INTENTS = ['lv1', 'lv2', 'lv3'];
export const PRICE_OFFER_ACTIONS = ['buy', 'hold', 'pass'];
export const PRICE_OFFER_BATCH_SIZE = 100;

const OFFER_TOKEN_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPurchaseIntent(value) {
  return PRICE_OFFER_INTENTS.includes(value);
}

export function isPriceOfferAction(value) {
  return PRICE_OFFER_ACTIONS.includes(value);
}

export function isOfferToken(value) {
  return OFFER_TOKEN_RE.test(String(value || '').trim());
}

export function formatJstDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value || '';
  return value('year') + '-' + value('month') + '-' + value('day') + ' ' + value('hour') + ':' + value('minute');
}

export function publicOriginFromRequest(request) {
  return new URL(request.url).origin;
}

export function buildOfferUrls(origin, recipientId) {
  const base = String(origin || '').replace(/\/$/, '');
  const token = encodeURIComponent(recipientId);
  return {
    simulatorUrl: base + '/simulator.html',
    buyUrl: base + '/api/price-offer/respond?t=' + token + '&a=buy',
    holdUrl: base + '/price-offer.html?t=' + token + '&a=hold',
    passUrl: base + '/price-offer.html?t=' + token + '&a=pass',
    orderUrl: base + '/order.html?offer=' + token,
    confirmUrl: base + '/price-offer.html',
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function recipientGreeting(name) {
  const trimmed = String(name || '').trim();
  return trimmed ? trimmed + '様' : 'お客様';
}

export function buildPriceOfferEmail({ name, urls }) {
  const greeting = recipientGreeting(name);
  const subject = PRICE_OFFER_SUBJECT;
  const lines = [
    greeting,
    '',
    'いつも佐藤農園のお米にご関心をお寄せいただき、ありがとうございます。',
    '',
    '今年のお米の価格が決まりましたので、ご案内いたします。',
    '',
    '価格の詳細は、こちらのシミュレーターでご確認いただけます。',
    urls.simulatorUrl,
    '',
    '以下のリンクから、ご希望をお知らせください。',
    '',
    '【購入する】',
    urls.buyUrl,
    '【保留】',
    urls.holdUrl,
    '【見送る】',
    urls.passUrl,
    '',
    '佐藤農園',
  ];

  const htmlLines = [
    '<p style="margin:0 0 1em;font-family:sans-serif;font-size:16px;line-height:1.7;">' +
      escapeHtml(greeting) +
      '</p>',
    '<p style="margin:0 0 1em;font-family:sans-serif;font-size:16px;line-height:1.7;">いつも佐藤農園のお米にご関心をお寄せいただき、ありがとうございます。</p>',
    '<p style="margin:0 0 1em;font-family:sans-serif;font-size:16px;line-height:1.7;">今年のお米の価格が決まりましたので、ご案内いたします。</p>',
    '<p style="margin:0 0 1em;font-family:sans-serif;font-size:16px;line-height:1.7;">価格の詳細は、こちらの<a href="' +
      escapeHtml(urls.simulatorUrl) +
      '">シミュレーター</a>でご確認いただけます。</p>',
    '<p style="margin:0 0 1em;font-family:sans-serif;font-size:16px;line-height:1.7;">以下のリンクから、ご希望をお知らせください。</p>',
    '<p style="margin:0 0 0.4em;font-family:sans-serif;font-size:16px;line-height:1.7;"><a href="' +
      escapeHtml(urls.buyUrl) +
      '">【購入する】</a></p>',
    '<p style="margin:0 0 0.4em;font-family:sans-serif;font-size:16px;line-height:1.7;"><a href="' +
      escapeHtml(urls.holdUrl) +
      '">【保留】</a></p>',
    '<p style="margin:0 0 1em;font-family:sans-serif;font-size:16px;line-height:1.7;"><a href="' +
      escapeHtml(urls.passUrl) +
      '">【見送る】</a></p>',
    '<p style="margin:0;font-family:sans-serif;font-size:16px;line-height:1.7;">佐藤農園</p>',
  ];

  return { subject, text: lines.join('\n'), html: htmlLines.join('') };
}

export function responseStatusLabel(recipient) {
  const orderId = recipient && recipient.order_id;
  const response = recipient && recipient.response;
  if (orderId) {
    return '購入する（注文済み No.' + orderId + '）';
  }
  if (response === 'buy') return '購入する（未注文）';
  if (response === 'hold') return '保留';
  if (response === 'pass') return '見送る';
  return '未回答';
}

export function nextResponseState(current, action) {
  if (current && current.order_id) {
    return {
      response: current.response || 'buy',
      changed: false,
      locked: true,
    };
  }
  return {
    response: action,
    changed: !current || current.response !== action,
    locked: false,
  };
}

export function chunkItems(items, size) {
  const chunks = [];
  const step = Number(size) > 0 ? Number(size) : PRICE_OFFER_BATCH_SIZE;
  for (let i = 0; i < items.length; i += step) {
    chunks.push(items.slice(i, i + step));
  }
  return chunks;
}

export function memberHasSendableEmail(member) {
  return hasSendableEmail(member && (member.email_normalized || member.email_original));
}

export function isPreviewEmail(env) {
  return String((env && env.PREVIEW_EMAIL) || '') === '1';
}

export function samplePriceOfferEmail(origin, recipient) {
  const urls = buildOfferUrls(origin, recipient && recipient.id);
  const built = buildPriceOfferEmail({
    name: recipient && recipient.name,
    urls,
  });
  return { ...built, urls };
}

function sendableAddress(member) {
  return String((member && (member.email_normalized || member.email_original)) || '').trim();
}

export async function previewPriceOffer(env, targetIntent) {
  if (!isPurchaseIntent(targetIntent)) {
    const error = new Error('invalid_intent');
    error.code = 'invalid_intent';
    throw error;
  }

  const stage = await getCurrentPriceStage(env);
  const { results } = await env.DB.prepare(
    `SELECT id, name, email_original, email_normalized
     FROM members
     WHERE purchase_intent = ?
     ORDER BY created_at DESC`
  )
    .bind(targetIntent)
    .all();

  const members = results || [];
  const withEmail = members.filter(memberHasSendableEmail);
  const withoutEmail = members.length - withEmail.length;

  const lastCampaign = await env.DB.prepare(
    `SELECT c.id, c.target_intent, c.price_stage, c.subject, c.created_at,
            (SELECT COUNT(*) FROM price_offer_recipients r
             WHERE r.campaign_id = c.id AND r.send_status = 'sent') AS sent_count
     FROM price_offer_campaigns c
     WHERE c.target_intent = ?
     ORDER BY c.created_at DESC
     LIMIT 1`
  )
    .bind(targetIntent)
    .first();

  return {
    targetIntent,
    priceStage: stage,
    memberCount: members.length,
    withEmailCount: withEmail.length,
    withoutEmailCount: withoutEmail,
    lastCampaign: lastCampaign || null,
  };
}

export async function listPriceOfferCampaigns(env) {
  const { results } = await env.DB.prepare(
    `SELECT id, target_intent, price_stage, subject, created_at
     FROM price_offer_campaigns
     ORDER BY created_at DESC`
  ).all();
  return results || [];
}

export async function listPriceOfferRecipients(env, campaignId) {
  const { results } = await env.DB.prepare(
    `SELECT r.id, r.email, r.send_status, r.response, r.responded_at, r.order_id,
            r.last_error, r.created_at,
            m.name, m.purchase_intent
     FROM price_offer_recipients r
     JOIN members m ON m.id = r.member_id
     WHERE r.campaign_id = ?
     ORDER BY m.name COLLATE NOCASE ASC, r.created_at ASC`
  )
    .bind(campaignId)
    .all();

  return (results || []).map((row) => ({
    ...row,
    statusLabel: responseStatusLabel(row),
  }));
}

export async function sendPriceOfferCampaign(env, { targetIntent, origin }) {
  if (!isPurchaseIntent(targetIntent)) {
    const error = new Error('invalid_intent');
    error.code = 'invalid_intent';
    throw error;
  }
  if (!env || !env.DB) {
    const error = new Error('database_unavailable');
    error.code = 'database_unavailable';
    throw error;
  }

  const preview = await previewPriceOffer(env, targetIntent);
  if (preview.withEmailCount === 0) {
    const error = new Error('no_recipients');
    error.code = 'no_recipients';
    throw error;
  }

  const { results } = await env.DB.prepare(
    `SELECT id, name, email_original, email_normalized
     FROM members
     WHERE purchase_intent = ?
     ORDER BY created_at ASC`
  )
    .bind(targetIntent)
    .all();

  const targets = (results || []).filter(memberHasSendableEmail);
  const campaignId = crypto.randomUUID();
  const now = new Date().toISOString();
  const recipients = targets.map((member) => ({
    id: crypto.randomUUID(),
    memberId: member.id,
    name: member.name,
    email: sendableAddress(member),
  }));

  const inserts = [
    env.DB.prepare(
      `INSERT INTO price_offer_campaigns (id, target_intent, price_stage, subject, created_at)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(campaignId, targetIntent, preview.priceStage, PRICE_OFFER_SUBJECT, now),
  ];

  for (const recipient of recipients) {
    inserts.push(
      env.DB.prepare(
        `INSERT INTO price_offer_recipients (
           id, campaign_id, member_id, email, send_status, created_at
         ) VALUES (?, ?, ?, ?, 'pending', ?)`
      ).bind(recipient.id, campaignId, recipient.memberId, recipient.email, now)
    );
  }

  await env.DB.batch(inserts);

  const sendResult = await deliverPriceOfferBatch(env, {
    campaignId,
    origin,
    recipients,
  });

  return {
    campaignId,
    targetIntent,
    priceStage: preview.priceStage,
    subject: PRICE_OFFER_SUBJECT,
    sent: sendResult.sent,
    failed: sendResult.failed,
    skipped: sendResult.skipped,
    previewOnly: !!sendResult.previewOnly,
    emailPreview: recipients[0] ? samplePriceOfferEmail(origin, recipients[0]) : null,
  };
}

export async function deliverPriceOfferBatch(env, { campaignId, origin, recipients }) {
  if (isPreviewEmail(env)) {
    await env.DB.batch(
      recipients.map((recipient) =>
        env.DB.prepare(
          `UPDATE price_offer_recipients
           SET send_status = 'sent', provider_message_id = 'preview', last_error = NULL
           WHERE id = ?`
        ).bind(recipient.id)
      )
    );
    return { sent: recipients.length, failed: 0, skipped: 0, previewOnly: true };
  }

  if (!env.RESEND_API_KEY) {
    await markRecipients(env, recipients, {
      sendStatus: 'failed',
      lastError: 'RESEND_API_KEY is not configured',
    });
    return { sent: 0, failed: recipients.length, skipped: 0 };
  }

  let sent = 0;
  let failed = 0;
  const chunks = chunkItems(recipients, PRICE_OFFER_BATCH_SIZE);

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const emails = chunk.map((recipient) => {
      const built = buildPriceOfferEmail({
        name: recipient.name,
        urls: buildOfferUrls(origin, recipient.id),
      });
      return {
        from: env.MAIL_FROM,
        to: [recipient.email],
        reply_to: env.MAIL_REPLY_TO,
        subject: built.subject,
        text: built.text,
        html: built.html,
      };
    });

    let response;
    let data = {};
    try {
      response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + env.RESEND_API_KEY,
          'Content-Type': 'application/json',
          'Idempotency-Key': 'price-offer/' + campaignId + '/' + index,
        },
        body: JSON.stringify(emails),
      });
      try {
        data = await response.json();
      } catch {
        data = {};
      }
    } catch (error) {
      await markRecipients(env, chunk, {
        sendStatus: 'failed',
        lastError: 'network_error: ' + String((error && error.message) || error),
      });
      failed += chunk.length;
      continue;
    }

    if (response.ok && Array.isArray(data.data) && data.data.length === chunk.length) {
      const updates = chunk.map((recipient, emailIndex) => {
        const providerId = data.data[emailIndex] && data.data[emailIndex].id;
        return env.DB.prepare(
          `UPDATE price_offer_recipients
           SET send_status = 'sent', provider_message_id = ?, last_error = NULL
           WHERE id = ?`
        ).bind(providerId || null, recipient.id);
      });
      await env.DB.batch(updates);
      sent += chunk.length;
      continue;
    }

    await markRecipients(env, chunk, {
      sendStatus: 'failed',
      lastError: 'resend_http_' + response.status + ': ' + JSON.stringify(data),
    });
    failed += chunk.length;
  }

  return { sent, failed, skipped: 0 };
}

async function markRecipients(env, recipients, { sendStatus, lastError }) {
  if (!recipients.length) return;
  await env.DB.batch(
    recipients.map((recipient) =>
      env.DB.prepare(
        `UPDATE price_offer_recipients
         SET send_status = ?, last_error = ?
         WHERE id = ?`
      ).bind(sendStatus, lastError || null, recipient.id)
    )
  );
}

export async function recordPriceOfferResponse(env, { token, action }) {
  if (!isOfferToken(token)) {
    const error = new Error('invalid_token');
    error.code = 'invalid_token';
    throw error;
  }
  if (!isPriceOfferAction(action)) {
    const error = new Error('invalid_action');
    error.code = 'invalid_action';
    throw error;
  }

  const row = await env.DB.prepare(
    `SELECT id, response, order_id FROM price_offer_recipients WHERE id = ?`
  )
    .bind(token)
    .first();

  if (!row) {
    const error = new Error('not_found');
    error.code = 'not_found';
    throw error;
  }

  const next = nextResponseState(row, action);
  if (!next.locked) {
    const now = new Date().toISOString();
    await env.DB.prepare(
      `UPDATE price_offer_recipients
       SET response = ?, responded_at = ?
       WHERE id = ? AND order_id IS NULL`
    )
      .bind(next.response, now, token)
      .run();
  }

  return {
    token,
    action: next.response,
    locked: next.locked,
    orderId: row.order_id || null,
  };
}

export async function attachOrderToPriceOffer(env, { token, orderId }) {
  if (!isOfferToken(token) || orderId == null || orderId === '') {
    return { attached: false };
  }

  const row = await env.DB.prepare(
    `SELECT id, order_id FROM price_offer_recipients WHERE id = ?`
  )
    .bind(token)
    .first();

  if (!row || row.order_id) {
    return { attached: false, already: Boolean(row && row.order_id) };
  }

  const now = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE price_offer_recipients
     SET order_id = ?, response = 'buy', responded_at = COALESCE(responded_at, ?)
     WHERE id = ? AND order_id IS NULL`
  )
    .bind(orderId, now, token)
    .run();

  return { attached: true };
}
