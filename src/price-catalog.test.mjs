import assert from 'node:assert/strict';
import {
  PRICE_CATALOG,
  PRICE_STAGES,
  applyCatalogPrices,
  catalogPrice,
  quoteAmountsForProduct,
} from './price-catalog.js';

assert.deepEqual(PRICE_STAGES, ['A', 'B', 'C']);

const expected = {
  A: {
    '30kg|0': 20000,
    '20kg相当|0': 16000,
    '15kg相当|0': 13000,
    '10kg相当|0': 10000,
    '30kg|1': 22000,
    '20kg相当|1': 18000,
    '15kg相当|1': 15000,
    '10kg相当|1': 12000,
  },
  B: {
    '30kg|0': 18000,
    '20kg相当|0': 14400,
    '15kg相当|0': 11700,
    '10kg相当|0': 9000,
    '30kg|1': 20000,
    '20kg相当|1': 16200,
    '15kg相当|1': 13500,
    '10kg相当|1': 10800,
  },
  C: {
    '30kg|0': 16000,
    '20kg相当|0': 12800,
    '15kg相当|0': 10400,
    '10kg相当|0': 8000,
    '30kg|1': 18000,
    '20kg相当|1': 14400,
    '15kg相当|1': 12000,
    '10kg相当|1': 9600,
  },
};

assert.deepEqual(PRICE_CATALOG, expected);

assert.equal(catalogPrice({ weight_label: '30kg', milled: 0 }, 'A'), 20000);
assert.equal(catalogPrice({ weight_label: '20kg相当', milled: 1 }, 'B'), 16200);
assert.equal(catalogPrice({ weight_label: 'unknown', milled: 0 }, 'A'), null);

assert.deepEqual(quoteAmountsForProduct({ weight_label: '30kg', milled: 0 }, 'A'), {
  catalogPrice: 20000,
  productPrice: 20000,
  millingFee: 0,
});
assert.deepEqual(quoteAmountsForProduct({ weight_label: '30kg', milled: 1 }, 'A'), {
  catalogPrice: 22000,
  productPrice: 20000,
  millingFee: 2000,
});
assert.deepEqual(quoteAmountsForProduct({ weight_label: '20kg相当', milled: 1 }, 'B'), {
  catalogPrice: 16200,
  productPrice: 14400,
  millingFee: 1800,
});
assert.deepEqual(quoteAmountsForProduct({ weight_label: '10kg相当', milled: 1 }, 'C'), {
  catalogPrice: 9600,
  productPrice: 8000,
  millingFee: 1600,
});

const sample = [
  { id: 1, weight_label: '30kg', milled: 0, price: 20000, milling_fee: 0, status: 'available' },
  { id: 2, weight_label: '30kg', milled: 1, price: 22000, milling_fee: 2000, status: 'available' },
];
const overlaid = applyCatalogPrices(sample, 'C');
assert.equal(overlaid[0].price, 16000);
assert.equal(overlaid[0].milling_fee, 0);
assert.equal(overlaid[1].price, 18000);
assert.equal(overlaid[1].milling_fee, 2000);
assert.equal(overlaid[0].id, 1);
assert.equal(overlaid[0].status, 'available');
assert.equal(Object.prototype.hasOwnProperty.call(overlaid[0], 'stage'), false);

const fallback = quoteAmountsForProduct({ weight_label: 'mystery', milled: 1, price: 999 }, 'A');
assert.deepEqual(fallback, { catalogPrice: 999, productPrice: 999, millingFee: 0 });
