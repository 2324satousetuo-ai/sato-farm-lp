import assert from 'node:assert/strict';
import {
  hasSendableEmail,
  isHoneypotTriggered,
  normalizeEmail,
  normalizePhoneKey,
  validateRegistration,
} from '../src/validate.js';

const valid = {
  name: '佐藤 節雄',
  email: 'Example@Gmail.com',
  purchase_intent: 'lv2',
  privacy_agreed: true,
};

assert.deepEqual(validateRegistration(valid), {});
assert.deepEqual(validateRegistration({ ...valid, email: '', phone: '0279-75-2711' }), {});
assert.equal(normalizeEmail(valid.email), 'example@gmail.com');
assert.equal(normalizeEmail('  TARO@SatoFarms.COM  '), 'taro@satofarms.com');
assert.equal(normalizePhoneKey('080-1256-8883'), '08012568883');
assert.equal(normalizePhoneKey('０８０１２５６８８８３'), '08012568883');
assert.equal(hasSendableEmail(''), false);
assert.equal(hasSendableEmail('a@example.com'), true);

assert.equal(validateRegistration({ ...valid, name: '' }).name, '入力してください。');
assert.equal(
  validateRegistration({ ...valid, email: '', phone: '' }).contact,
  'メールアドレスまたは電話番号のいずれかは必須です'
);
assert.equal(
  validateRegistration({ ...valid, email: 'not-an-email' }).email,
  '正しいメールアドレスを入力してください。'
);
assert.equal(
  validateRegistration({ ...valid, email: 'a b@example.com' }).email,
  '正しいメールアドレスを入力してください。'
);
assert.equal(
  validateRegistration({ ...valid, purchase_intent: '' }).purchase_intent,
  '購入関心レベルを選択してください。'
);
assert.equal(
  validateRegistration({ ...valid, privacy_agreed: false }).privacy_agreed,
  'プライバシーポリシーへの同意が必要です。'
);
assert.ok(!validateRegistration({ ...valid, name: '山田　太郎' }).name);
assert.ok(!validateRegistration({ ...valid, name: '佐藤・節雄' }).name);
assert.equal(isHoneypotTriggered({ website: 'http://spam.example' }), true);
assert.equal(isHoneypotTriggered({ website: '' }), false);

console.log('validate tests passed');
