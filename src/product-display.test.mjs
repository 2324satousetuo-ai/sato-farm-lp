import assert from 'node:assert/strict';
import { formatProductDisplayName } from './product-display.js';

const names = [
  [{ weight_label: '30kg', milled: 0 }, '玄米30kg'],
  [{ weight_label: '20kg相当', actual_weight_kg: 19.5, milled: 0 }, '玄米20kg相当(実質19.5kg)'],
  [{ weight_label: '15kg相当', actual_weight_kg: 14.5, milled: 0 }, '玄米15kg相当(実質14.5kg)'],
  [{ weight_label: '10kg相当', actual_weight_kg: 9.5, milled: 0 }, '玄米10kg相当(実質9.5kg)'],
  [{ weight_label: '30kg', milled: 1 }, '標準精米（白米）実質27kg(玄米30kgを精米)'],
  [{ weight_label: '20kg相当', milled: 1 }, '標準精米（白米）実質18kg(玄米20kgを精米)'],
  [{ weight_label: '15kg相当', milled: 1 }, '標準精米（白米）実質13.5kg(玄米15kgを精米)'],
  [{ weight_label: '10kg相当', milled: 1 }, '標準精米（白米）実質9kg(玄米10kgを精米)'],
];

for (const [product, expected] of names) {
  assert.equal(formatProductDisplayName(product), expected);
}
