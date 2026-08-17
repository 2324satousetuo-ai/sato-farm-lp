(function () {
  'use strict';

  const form = document.getElementById('rice-register-form');
  if (!form) {
    return;
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

    const input = form.querySelector('[name="' + fieldName + '"]');
    if (input) {
      input.classList.toggle('error', !!message);
    }
  }

  function clearErrors() {
    ['name', 'email', 'purchase_intent', 'privacy_agreed'].forEach(function (fieldName) {
      setFieldError(fieldName, '');
    });
  }

  function validateClient() {
    const name = (form.elements.name && form.elements.name.value || '').trim();
    const email = (form.elements.email && form.elements.email.value || '').trim();
    const purchaseIntent = form.querySelector('input[name="purchase_intent"]:checked');
    const privacy = form.querySelector('#register-privacy');
    let valid = true;

    if (!name) {
      setFieldError('name', '入力してください。');
      valid = false;
    }

    if (!email) {
      setFieldError('email', '入力してください。');
      valid = false;
    } else if (form.elements.email.validity && form.elements.email.validity.typeMismatch) {
      setFieldError('email', '正しいメールアドレスを入力してください。');
      valid = false;
    }

    if (!purchaseIntent) {
      setFieldError('purchase_intent', '購入関心レベルを選択してください。');
      valid = false;
    }

    if (!privacy || !privacy.checked) {
      setFieldError('privacy_agreed', 'プライバシーポリシーへの同意が必要です。');
      valid = false;
    }

    return valid;
  }

  form.querySelectorAll('input').forEach(function (field) {
    field.addEventListener('input', function () {
      const errorName = field.name === 'privacy_agreed' ? 'privacy_agreed' : field.name;
      setFieldError(errorName, '');
    });
    field.addEventListener('change', function () {
      const errorName = field.name === 'privacy_agreed' ? 'privacy_agreed' : field.name;
      setFieldError(errorName, '');
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
      setStatus('保存したHTMLファイルからは登録できません。公開サイトからお試しください。', 'error');
      return;
    }

    submitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    setStatus('登録中…', 'info');

    const payload = {
      name: (form.elements.name.value || '').trim(),
      email: (form.elements.email.value || '').trim(),
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
          setFieldError(fieldName, data.errors[fieldName]);
        });
        setStatus('', null);
      } else {
        setStatus(data.message || '登録を完了できませんでした。しばらくしてから再度お試しください。', 'error');
      }

      submitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    } catch (error) {
      setStatus('登録を完了できませんでした。しばらくしてから再度お試しください。', 'error');
      submitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
})();
