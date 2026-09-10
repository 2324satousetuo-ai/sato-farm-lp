import assert from 'node:assert/strict';
import {
  buildShippingInstruction,
  clearAdminSecret,
  formatPaidDateJa,
  formatPostalCode,
  formatYenAmount,
  orderQuantityKg,
  readAdminSecret,
  saveAdminSecret,
} from '../admin/shipping-instruction-data.js';

function memoryStore(initial = {}) {
  const data = { ...initial };
  return {
    getItem(key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null; },
    setItem(key, value) { data[key] = String(value); },
    removeItem(key) { delete data[key]; },
  };
}

const sessionOnly = { sessionStorage: memoryStore({ satofarms_admin_secret: 'from-session' }), localStorage: memoryStore() };
assert.equal(readAdminSecret(sessionOnly), 'from-session');

const localOnly = { sessionStorage: memoryStore(), localStorage: memoryStore({ satofarms_admin_secret: 'from-local' }) };
assert.equal(readAdminSecret(localOnly), 'from-local');

const emptyStore = { sessionStorage: memoryStore(), localStorage: memoryStore() };
assert.equal(readAdminSecret(emptyStore), '');
saveAdminSecret(emptyStore, 'copied-secret');
assert.equal(readAdminSecret(emptyStore), 'copied-secret');
clearAdminSecret(emptyStore);
assert.equal(readAdminSecret(emptyStore), '');

assert.equal(orderQuantityKg({ weight_label: '30kg', milled: 0, actual_weight_kg: 30 }), 30);
assert.equal(orderQuantityKg({ weight_label: '20kg相当', milled: 0, actual_weight_kg: 19.5 }), 19.5);
assert.equal(orderQuantityKg({ weight_label: '15kg相当', milled: false }), 14.5);
assert.equal(orderQuantityKg({ weight_label: '10kg相当', milled: 0 }), 9.5);
assert.equal(orderQuantityKg({ weight_label: '30kg', milled: 1 }), 27);
assert.equal(orderQuantityKg({ weight_label: '20kg相当', milled: true }), 18);
assert.equal(orderQuantityKg({ weight_label: '15kg相当', milled: 1 }), 13.5);
assert.equal(orderQuantityKg({ weight_label: '10kg相当', milled: 1 }), 9);

assert.equal(formatYenAmount(12345), '12,345円');
assert.equal(formatPostalCode('3770008'), '377-0008');
assert.equal(formatPostalCode('377-0008'), '377-0008');
assert.equal(formatPaidDateJa('2026-09-10 01:15:00'), '2026年9月10日');

const brown = buildShippingInstruction({
  id: 12,
  paid_at: '2026-09-10 01:15:00',
  total_amount: 21830,
  shipping_postal_code: '3770008',
  shipping_prefecture: '群馬県',
  shipping_address: '吾妻郡中之条町伊勢町15-6',
  recipient_name: '佐藤節雄',
  weight_label: '20kg相当',
  milled: 0,
  actual_weight_kg: 19.5,
  notes: '玄関前に置いてください',
});

assert.deepEqual(brown, {
  orderId: '12',
  paidDate: '2026年9月10日',
  amount: '21,830円',
  postal: '377-0008',
  prefecture: '群馬県',
  address: '吾妻郡中之条町伊勢町15-6',
  recipient: '佐藤節雄',
  brown: true,
  milled: false,
  quantityKg: '19.5',
  notes: '玄関前に置いてください',
});

const milled = buildShippingInstruction({
  id: 3,
  paid_at: '2026-09-09T15:30:00Z',
  total_amount: 22000,
  shipping_postal_code: '1000001',
  shipping_prefecture: '東京都',
  shipping_address: '千代田区千代田1-1',
  recipient_name: '山田花子',
  weight_label: '30kg',
  milled: 1,
  notes: '  ',
});

assert.equal(milled.brown, false);
assert.equal(milled.milled, true);
assert.equal(milled.quantityKg, '27');
assert.equal(milled.notes, '');
assert.equal(milled.paidDate, '2026年9月10日');
