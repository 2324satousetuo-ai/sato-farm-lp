(function () {
  'use strict';

  const form = document.getElementById('rice-register-form');
  if (!form) {
    return;
  }

  const isEn = document.documentElement.lang === 'en';
  const messages = isEn
    ? {
        nameRequired: 'Please enter your name.',
        emailInvalid: 'Please enter a valid email address.',
        contactRequired: 'Please enter either an email address or a phone number.',
        intentRequired: 'Please select your purchase interest level.',
        privacyRequired: 'Please agree to the privacy policy.',
        fileProtocol: 'Registration is not available from a saved HTML file. Please use the live site.',
        submitting: 'Registering…',
        failed: 'We could not complete your registration. Please try again later.',
      }
    : {
        nameRequired: '入力してください。',
        emailInvalid: '正しいメールアドレスを入力してください。',
        contactRequired: 'メールアドレスまたは電話番号のいずれかは必須です',
        intentRequired: '購入関心レベルを選択してください。',
        privacyRequired: 'プライバシーポリシーへの同意が必要です。',
        fileProtocol: '保存したHTMLファイルからは登録できません。公開サイトからお試しください。',
        submitting: '登録中…',
        failed: '登録を完了できませんでした。しばらくしてから再度お試しください。',
      };
  const serverErrorMap = {
    '入力してください。': messages.nameRequired,
    '正しいメールアドレスを入力してください。': messages.emailInvalid,
    'メールアドレスまたは電話番号のいずれかは必須です': messages.contactRequired,
    '購入関心レベルを選択してください。': messages.intentRequired,
    'プライバシーポリシーへの同意が必要です。': messages.privacyRequired,
    '登録を完了できませんでした。しばらくしてから再度お試しください。': messages.failed,
    'このメールアドレスは既に登録されています': isEn
      ? 'This email address is already registered.'
      : 'このメールアドレスは既に登録されています',
    'この電話番号は既に登録されています': isEn
      ? 'This phone number is already registered.'
      : 'この電話番号は既に登録されています',
    '電話番号は9〜11桁で入力してください。': isEn
      ? 'Please enter a phone number with 9–11 digits.'
      : '電話番号は9〜11桁で入力してください。',
    '使用できない文字が含まれています。': isEn
      ? 'This field contains characters that cannot be used.'
      : '使用できない文字が含まれています。',
    '名前は80文字以内で入力してください。': isEn
      ? 'Please enter a name of 80 characters or fewer.'
      : '名前は80文字以内で入力してください。',
    '電話番号は30文字以内で入力してください。': isEn
      ? 'Please enter a phone number of 30 characters or fewer.'
      : '電話番号は30文字以内で入力してください。',
  };

  function localizeMessage(message) {
    return serverErrorMap[message] || message;
  }

  const submitBtn = form.querySelector('[type="submit"]');
  const statusEl = form.querySelector('.form-status');
  const completeUrl = form.dataset.completeUrl || 'register-complete.html';
  let submitting = false;

  function setStatus(message, type) {
    if (!statusEl) {
      return;
    }
    statusEl.textContent = message;
    statusEl.classList.remove('form-status--error', 'form-status--info', 'form-status--success');
    if (type) {
      statusEl.classList.add('form-status--' + type);
    }
  }

  function setFieldError(fieldName, message) {
    const errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
    if (errorEl) {
      errorEl.textContent = message || '';
    }

    if (fieldName === 'purchase_intent') {
      form.querySelectorAll('input[name="purchase_intent"]').forEach(function (input) {
        input.classList.toggle('error', !!message);
      });
      return;
    }

    if (fieldName === 'privacy_agreed') {
      const input = form.querySelector('#register-privacy');
      if (input) {
        input.classList.toggle('error', !!message);
      }
      return;
    }

    if (fieldName === 'contact') {
      ['email', 'phone'].forEach(function (name) {
        const input = form.querySelector('[name="' + name + '"]');
        if (input) {
          input.classList.toggle('error', !!message);
        }
      });
      return;
    }

    const input = form.querySelector('[name="' + fieldName + '"]');
    if (input) {
      input.classList.toggle('error', !!message);
    }
  }

  function clearErrors() {
    ['name', 'email', 'phone', 'contact', 'purchase_intent', 'privacy_agreed'].forEach(function (fieldName) {
      setFieldError(fieldName, '');
    });
  }

  function validateClient() {
    const name = (form.elements.name && form.elements.name.value || '').trim();
    const email = (form.elements.email && form.elements.email.value || '').trim();
    const phone = (form.elements.phone && form.elements.phone.value || '').trim();
    const purchaseIntent = form.querySelector('input[name="purchase_intent"]:checked');
    const privacy = form.querySelector('#register-privacy');
    let valid = true;

    if (!name) {
      setFieldError('name', messages.nameRequired);
      valid = false;
    }

    if (email && form.elements.email.validity && form.elements.email.validity.typeMismatch) {
      setFieldError('email', messages.emailInvalid);
      valid = false;
    }

    if (!email && !phone) {
      setFieldError('contact', messages.contactRequired);
      valid = false;
    }

    if (!purchaseIntent) {
      setFieldError('purchase_intent', messages.intentRequired);
      valid = false;
    }

    if (!privacy || !privacy.checked) {
      setFieldError('privacy_agreed', messages.privacyRequired);
      valid = false;
    }

    return valid;
  }

  form.querySelectorAll('input').forEach(function (field) {
    field.addEventListener('input', function () {
      const errorName = field.name === 'privacy_agreed' ? 'privacy_agreed' : field.name;
      setFieldError(errorName, '');
      if (field.name === 'email' || field.name === 'phone') {
        setFieldError('contact', '');
      }
    });
    field.addEventListener('change', function () {
      const errorName = field.name === 'privacy_agreed' ? 'privacy_agreed' : field.name;
      setFieldError(errorName, '');
      if (field.name === 'email' || field.name === 'phone') {
        setFieldError('contact', '');
      }
    });
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    clearErrors();
    setStatus('', null);

    if (!validateClient()) {
      return;
    }

    if (window.location.protocol === 'file:') {
      setStatus(messages.fileProtocol, 'error');
      return;
    }

    submitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    setStatus(messages.submitting, 'info');

    const payload = {
      name: (form.elements.name.value || '').trim(),
      email: (form.elements.email.value || '').trim(),
      phone: (form.elements.phone && form.elements.phone.value || '').trim(),
      purchase_intent: form.querySelector('input[name="purchase_intent"]:checked').value,
      privacy_agreed: form.querySelector('#register-privacy').checked,
      website: (form.elements.website && form.elements.website.value) || '',
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(function () {
        return {};
      });

      if (response.ok && data.ok) {
        window.location.href = new URL(completeUrl, window.location.href).href;
        return;
      }

      if (data.errors) {
        Object.keys(data.errors).forEach(function (fieldName) {
          setFieldError(fieldName, localizeMessage(data.errors[fieldName]));
        });
        setStatus('', null);
      } else {
        setStatus(localizeMessage(data.message) || messages.failed, 'error');
      }

      submitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    } catch (error) {
      setStatus(messages.failed, 'error');
      submitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
})();
