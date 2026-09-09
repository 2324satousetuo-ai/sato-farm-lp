export const PRICE_STAGES = ['A', 'B', 'C'];
export const DEFAULT_PRICE_STAGE = 'A';

// 8商品 × 3段階。金額は口座振込用の確定値（丸めない）。
const PRICE_ROWS = [
  ['30kg', 0, 20000, 18000, 16000],
  ['20kg相当', 0, 16000, 14400, 12800],
  ['15kg相当', 0, 13000, 11700, 10400],
  ['10kg相当', 0, 10000, 9000, 8000],
  ['30kg', 1, 22000, 20000, 18000],
  ['20kg相当', 1, 18000, 16200, 14400],
  ['15kg相当', 1, 15000, 13500, 12000],
  ['10kg相当', 1, 12000, 10800, 9600],
];

export const PRICE_CATALOG = PRICE_ROWS.reduce((catalog, [weightLabel, milled, priceA, priceB, priceC]) => {
  const key = priceKey(weightLabel, milled);
  catalog.A[key] = priceA;
  catalog.B[key] = priceB;
  catalog.C[key] = priceC;
  return catalog;
}, { A: {}, B: {}, C: {} });

export function isPriceStage(value) {
  return PRICE_STAGES.includes(value);
}

export function priceKey(weightLabel, milled) {
  return String(weightLabel) + '|' + (milled === 1 || milled === true ? '1' : '0');
}

export function productPriceKey(product) {
  return priceKey(product && product.weight_label, product && product.milled);
}

export function catalogPrice(product, stage) {
  const table = PRICE_CATALOG[stage];
  if (!table || !product) return null;
  const price = table[productPriceKey(product)];
  return typeof price === 'number' ? price : null;
}

export function quoteAmountsForProduct(product, stage) {
  const listed = catalogPrice(product, stage);
  if (listed == null) {
    const fallback = product && typeof product.price === 'number' ? product.price : null;
    return {
      catalogPrice: fallback,
      productPrice: fallback,
      millingFee: 0,
    };
  }

  const milled = product.milled === 1 || product.milled === true;
  if (!milled) {
    return {
      catalogPrice: listed,
      productPrice: listed,
      millingFee: 0,
    };
  }

  const brownPrice = catalogPrice({ weight_label: product.weight_label, milled: 0 }, stage);
  if (brownPrice == null) {
    return {
      catalogPrice: listed,
      productPrice: listed,
      millingFee: 0,
    };
  }

  return {
    catalogPrice: listed,
    productPrice: brownPrice,
    millingFee: listed - brownPrice,
  };
}

export function applyCatalogPrices(products, stage) {
  return (products || []).map((product) => {
    const amounts = quoteAmountsForProduct(product, stage);
    if (amounts.catalogPrice == null) {
      return product;
    }
    return {
      ...product,
      price: amounts.catalogPrice,
      milling_fee: amounts.millingFee,
    };
  });
}
