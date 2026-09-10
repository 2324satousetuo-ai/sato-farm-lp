import { formatProductDisplayName } from './product-display.js';

export function getBankTransferAccount(env) {
  return String((env && env.BANK_TRANSFER_ACCOUNT) || '').trim();
}

export function formatProductName(product) {
  return formatProductDisplayName(product);
}

export function formatYen(amount) {
  return '¥' + Number(amount).toLocaleString('ja-JP');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const TRACKING_NUMBER_MAX_LENGTH = 40;

export function normalizeTrackingNumber(value) {
  if (value == null) return '';
  if (typeof value === 'number' && Number.isFinite(value)) {
    value = String(value);
  }
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length > TRACKING_NUMBER_MAX_LENGTH) return null;
  return trimmed;
}

const EMAIL_SIGNATURE = '佐藤農園（佐藤節雄）';

function buildEmailHtml(lines) {
  const paragraphs = lines.map((line) => {
    if (line === EMAIL_SIGNATURE) {
      return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr><td align="right" style="font-family:sans-serif;font-size:16px;line-height:1.7;">' +
        escapeHtml(EMAIL_SIGNATURE) +
        '</td></tr>' +
        '</table>'
      );
    }
    if (line === '') {
      return '<p style="margin:0;font-family:sans-serif;font-size:16px;line-height:1.7;">&nbsp;</p>';
    }
    return (
      '<p style="margin:0;font-family:sans-serif;font-size:16px;line-height:1.7;">' +
      escapeHtml(line) +
      '</p>'
    );
  });
  return paragraphs.join('');
}

export function buildOrderConfirmationEmail({ orderId, productName, totalAmount, bankAccount }) {
  const subject = '佐藤農園にご注文いただき、ありがとうございます';
  const lines = [
    'このたびは、佐藤農園のお米をご注文いただき、ありがとうございます。',
    '',
    'ご注文を受け付けました。下記口座へお振り込みをお願いいたします。',
    '',
    '注文番号　No.' + orderId,
    '商品　' + productName,
    'お振込金額　' + formatYen(totalAmount),
    '',
    'お振込先',
    bankAccount,
    '',
    '振込時は通信欄に注文番号をご記入ください。',
    '',
    '入金を確認できましたら、発送の準備に入ります。',
    '発送が済みましたら、改めてご連絡いたします。',
    '',
    EMAIL_SIGNATURE,
  ];

  return { subject, text: lines.join('\n'), html: buildEmailHtml(lines) };
}

export function buildOrderShippedEmail({ orderId, productName, trackingNumber }) {
  const subject = '佐藤農園から、お米を発送しました';
  const lines = [
    'ご注文のお米を発送しました。',
    '',
    '注文番号　No.' + orderId,
    '商品　' + productName,
  ];

  const tracking = normalizeTrackingNumber(trackingNumber) || '';
  if (tracking) {
    lines.push('追跡番号　' + tracking);
  }

  lines.push(
    '',
    '到着まで、今しばらくお待ちください。',
    '',
    EMAIL_SIGNATURE
  );

  return { subject, text: lines.join('\n'), html: buildEmailHtml(lines) };
}
