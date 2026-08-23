const PURCHASE_INTENTS = new Set(['lv1', 'lv2', 'lv3']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const CONTACT_REQUIRED = 'メールアドレスまたは電話番号のいずれかは必須です';

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function normalizePhoneKey(phone) {
  return String(phone || '')
    .replace(/[０-９]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
    })
    .replace(/[-ー－−‐\s　()（）]/g, '');
}

export function hasSendableEmail(email) {
  return Boolean(String(email || '').trim());
}

export function validateMemberContact(email, phone) {
  const errors = {};
  const emailValue = typeof email === 'string' ? email.trim() : '';
  const phoneValue = typeof phone === 'string' ? phone.trim() : '';

  if (emailValue) {
    if (/\s/.test(emailValue) || !EMAIL_PATTERN.test(emailValue) || emailValue.length > 254) {
      errors.email = '正しいメールアドレスを入力してください。';
    }
  }

  if (phoneValue) {
    if (CONTROL_CHARS.test(phoneValue)) {
      errors.phone = '使用できない文字が含まれています。';
    } else if (Array.from(phoneValue).length > 30) {
      errors.phone = '電話番号は30文字以内で入力してください。';
    }
  }

  if (!emailValue && !phoneValue) {
    errors.contact = CONTACT_REQUIRED;
  }

  return errors;
}

export function validateRegistration(body) {
  const errors = {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const purchaseIntent = typeof body.purchase_intent === 'string' ? body.purchase_intent : '';

  if (!name) {
    errors.name = '入力してください。';
  } else if (CONTROL_CHARS.test(name)) {
    errors.name = '使用できない文字が含まれています。';
  } else if (Array.from(name).length > 80) {
    errors.name = '名前は80文字以内で入力してください。';
  }

  Object.assign(errors, validateMemberContact(body.email, body.phone));

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
