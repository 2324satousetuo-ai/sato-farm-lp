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

const BROWN_SOURCE_LABEL = {
  '30kg': '玄米30kg',
  '20kg相当': '玄米20kg',
  '15kg相当': '玄米15kg',
  '10kg相当': '玄米10kg',
};

export function formatProductDisplayName(product) {
  const weightLabel = product && product.weight_label;
  if (!weightLabel) return 'お米';
  const milled = product.milled === 1 || product.milled === true;
  if (!milled) {
    if (weightLabel === '30kg') return '玄米30kg';
    const actual = product.actual_weight_kg ?? BROWN_ACTUAL_KG[weightLabel];
    return '玄米' + weightLabel + '(実質' + actual + 'kg)';
  }
  const yieldKg = MILLED_YIELD_KG[weightLabel];
  const brown = BROWN_SOURCE_LABEL[weightLabel] || '玄米' + weightLabel;
  if (yieldKg == null) {
    return '標準精米（白米）(' + brown + 'を精米)';
  }
  return '標準精米（白米）実質' + yieldKg + 'kg(' + brown + 'を精米)';
}
