const PURCHASE_INTENTS = new Set(['lv1', 'lv2', 'lv3']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function validateRegistration(body) {
  const errors = {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const purchaseIntent = typeof body.purchase_intent === 'string' ? body.purchase_intent : '';

  if (!name) {
    errors.name = '入力してください。';
  } else if (CONTROL_CHARS.test(name)) {
    errors.name = '使用できない文字が含まれています。';
  } else if (Array.from(name).length > 80) {
    errors.name = '名前は80文字以内で入力してください。';
  }

  if (!email) {
    errors.email = '入力してください。';
  } else if (/\s/.test(email) || !EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.email = '正しいメールアドレスを入力してください。';
  }

  if (!purchaseIntent) {
    errors.purchase_intent = '購入関心レベルを選択してください。';
  } else if (!PURCHASE_INTENTS.has(purchaseIntent)) {
    errors.purchase_intent = '購入関心レベルを選択してください。';
  }

  if (body.privacy_agreed !== true) {
    errors.privacy_agreed = 'プライバシーポリシーへの同意が必要です。';
  }

  return errors;
}

export function isHoneypotTriggered(body) {
  return typeof body.website === 'string' && body.website.trim() !== '';
}
