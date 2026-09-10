const BROWN_ACTUAL_KG = {
  '30kg': 30,
  '20kg相当': 19.5,
  '15kg相当': 14.5,
  '10kg相当': 9.5,
};

const MILLED_YIELD_KG = {
  '30kg': 27,
  '20kg相当': 18,
  '15kg相当': 13.5,
  '10kg相当': 9,
};

export function isMilledProduct(order) {
  return order && (order.milled === 1 || order.milled === true);
}

export function orderQuantityKg(order) {
  if (!order) return null;
  if (isMilledProduct(order)) {
    const yieldKg = MILLED_YIELD_KG[order.weight_label];
    return yieldKg == null ? null : yieldKg;
  }
  const actual = order.actual_weight_kg ?? BROWN_ACTUAL_KG[order.weight_label];
  return actual == null ? null : Number(actual);
}

export function formatKg(value) {
  if (value == null || value === '') return '';
  const num = Number(value);
  if (Number.isNaN(num)) return '';
  return String(num);
}

export function formatYenAmount(value) {
  if (value == null || value === '') return '';
  const num = Number(value);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('ja-JP') + '円';
}

export function formatPostalCode(value) {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 7) return digits.slice(0, 3) + '-' + digits.slice(3);
  return String(value).trim();
}

export function formatPaidDateJa(paidAt) {
  if (!paidAt) return '';
  const raw = String(paidAt).trim();
  const iso = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const hasZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(iso);
  const date = new Date(hasZone ? iso : iso + 'Z');
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  if (!year || !month || !day) return '';
  return year + '年' + month + '月' + day + '日';
}

export const ADMIN_SECRET_KEY = 'satofarms_admin_secret';

export function readAdminSecret(store) {
  const session = store && store.sessionStorage;
  const local = store && store.localStorage;
  try {
    return (session && session.getItem(ADMIN_SECRET_KEY)) || (local && local.getItem(ADMIN_SECRET_KEY)) || '';
  } catch {
    return '';
  }
}

export function saveAdminSecret(store, secret) {
  if (!store || !secret) return;
  try {
    if (store.sessionStorage) store.sessionStorage.setItem(ADMIN_SECRET_KEY, secret);
    if (store.localStorage) store.localStorage.setItem(ADMIN_SECRET_KEY, secret);
  } catch {
    /* ignore quota / private-mode failures */
  }
}

export function clearAdminSecret(store) {
  if (!store) return;
  try {
    if (store.sessionStorage) store.sessionStorage.removeItem(ADMIN_SECRET_KEY);
    if (store.localStorage) store.localStorage.removeItem(ADMIN_SECRET_KEY);
  } catch {
    /* ignore */
  }
}

export function buildShippingInstruction(order) {
  const milled = isMilledProduct(order);
  return {
    orderId: order && order.id != null ? String(order.id) : '',
    paidDate: formatPaidDateJa(order && order.paid_at),
    amount: formatYenAmount(order && order.total_amount),
    postal: formatPostalCode(order && order.shipping_postal_code),
    prefecture: order && order.shipping_prefecture ? String(order.shipping_prefecture) : '',
    address: order && order.shipping_address ? String(order.shipping_address) : '',
    recipient: order && order.recipient_name ? String(order.recipient_name) : '',
    brown: !milled,
    milled,
    quantityKg: formatKg(orderQuantityKg(order)),
    notes: order && order.notes ? String(order.notes).trim() : '',
  };
}
