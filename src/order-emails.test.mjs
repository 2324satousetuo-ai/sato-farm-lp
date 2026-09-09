import assert from 'node:assert/strict';
import {
  buildOrderConfirmationEmail,
  buildOrderShippedEmail,
  formatProductName,
  formatYen,
  getBankTransferAccount,
} from './order-emails.js';

const BANK_TRANSFER_ACCOUNT = getBankTransferAccount({
  BANK_TRANSFER_ACCOUNT: '楽天銀行　ダンス（208）　普通　2095392　サトウ セツオ',
});
assert.equal(BANK_TRANSFER_ACCOUNT, '楽天銀行　ダンス（208）　普通　2095392　サトウ セツオ');
assert.equal(getBankTransferAccount({}), '');

assert.equal(formatProductName({ weight_label: '30kg', milled: 0 }), '玄米30kg');
assert.equal(
  formatProductName({ weight_label: '20kg相当', actual_weight_kg: 19.5, milled: 0 }),
  '玄米20kg相当(実質19.5kg)'
);
assert.equal(
  formatProductName({ weight_label: '20kg相当', milled: 1 }),
  '標準精米（白米）実質18kg(玄米20kgを精米)'
);
assert.equal(formatYen(22330), '¥22,330');

const confirmation = buildOrderConfirmationEmail({
  orderId: 7,
  productName: '玄米30kg',
  totalAmount: 22330,
  bankAccount: BANK_TRANSFER_ACCOUNT,
});
assert.match(confirmation.subject, /ご注文/);
assert.match(confirmation.text, /注文番号　No\.7/);
assert.match(confirmation.text, /玄米30kg/);
assert.match(confirmation.text, /¥22,330/);
assert.match(confirmation.text, new RegExp(BANK_TRANSFER_ACCOUNT));
assert.match(confirmation.text, /振込時は通信欄に注文番号をご記入ください/);
assert.match(confirmation.html, /align="right"/);
assert.match(confirmation.html, /佐藤農園（佐藤節雄）/);
assert.match(confirmation.text, /佐藤農園（佐藤節雄）/);

const shipped = buildOrderShippedEmail({
  orderId: 7,
  productName: '玄米30kg',
  trackingNumber: '1234-5678-90',
});
assert.match(shipped.subject, /発送/);
assert.match(shipped.text, /注文番号　No\.7/);
assert.match(shipped.text, /追跡番号　1234-5678-90/);

const shippedNoTracking = buildOrderShippedEmail({
  orderId: 8,
  productName: '玄米10kg相当(実質9.5kg)',
  trackingNumber: null,
});
assert.doesNotMatch(shippedNoTracking.text, /追跡番号/);

console.log('order-emails tests passed');
