(function () {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const formConfig = window.SATO_FARM_FORM_CONFIG || {};
  const web3formsAccessKey = String(formConfig.web3formsAccessKey || '').trim();

  function setFormStatus(form, message, type) {
    const statusEl = form.querySelector('.form-status');
    if (!statusEl) {
      return;
    }
    statusEl.textContent = message;
    statusEl.classList.remove('form-status--error', 'form-status--info', 'form-status--success');
    if (type) {
      statusEl.classList.add('form-status--' + type);
    }
  }

  function validateInquiryForm(form) {
    const isEn = document.documentElement.lang === 'en';
    let valid = true;

    form.querySelectorAll('[required]').forEach((field) => {
      const errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
      const message = field.validity.valueMissing
        ? (isEn ? 'This field is required.' : '入力してください。')
        : field.validity.typeMismatch
          ? (isEn ? 'Please enter a valid email address.' : '正しいメールアドレスを入力してください。')
          : '';

      field.classList.toggle('error', !!message);
      if (errorEl) {
        errorEl.textContent = message;
      }
      if (message) {
        valid = false;
      }
    });

    return valid;
  }

  async function submitViaWeb3Forms(form) {
    const isEn = document.documentElement.lang === 'en';
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.access_key = web3formsAccessKey;
    payload.subject = isEn ? '[Sato Farm] Website contact' : '【佐藤農園】ホームページお問い合わせ';
    payload.from_name = isEn ? 'Sato Farm website' : '佐藤農園ホームページ';
    payload.botcheck = '';

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'web3forms_failed');
    }
  }

  async function submitViaNetlify(form) {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    });

    if (!response.ok) {
      throw new Error('netlify_failed');
    }
  }

  document.querySelectorAll('.inquiry-form').forEach((form) => {
    form.querySelectorAll('[required]').forEach((field) => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
        if (errorEl) {
          errorEl.textContent = '';
        }
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const isEn = document.documentElement.lang === 'en';
      const thankYou = form.dataset.thankYou || 'thank-you.html';
      const submitBtn = form.querySelector('[type="submit"]');

      if (!validateInquiryForm(form)) {
        setFormStatus(form, '', null);
        return;
      }

      if (window.location.protocol === 'file:') {
        setFormStatus(
          form,
          isEn
            ? 'Please submit from the published website (not a saved HTML file). Or call 0279-75-2711 / email 2324satou.setuo@gmail.com.'
            : '保存したHTMLファイルからは送信できません。公開サイト（Netlify）からお試しください。お急ぎの場合は 0279-75-2711 または 2324satou.setuo@gmail.com へ。',
          'error'
        );
        return;
      }

      submitBtn.disabled = true;
      setFormStatus(form, isEn ? 'Sending…' : '送信中…', 'info');

      try {
        if (web3formsAccessKey) {
          await submitViaWeb3Forms(form);
        } else {
          await submitViaNetlify(form);
        }
        window.location.href = new URL(thankYou, window.location.href).href;
      } catch (error) {
        const fallback = isEn
          ? 'Could not send your message. Please call 0279-75-2711 or email 2324satou.setuo@gmail.com.'
          : '送信できませんでした。お電話（0279-75-2711）またはメール（2324satou.setuo@gmail.com）でご連絡ください。';
        const setupHint = !web3formsAccessKey && !isEn
          ? ' メール受信の設定（Web3Forms）が未完了の可能性があります。'
          : !web3formsAccessKey && isEn
            ? ' Email delivery may not be configured yet (Web3Forms).'
            : '';
        setFormStatus(form, fallback + setupHint, 'error');
        submitBtn.disabled = false;
      }
    });
  });

  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const topTarget = document.getElementById('top');
      if (topTarget) {
        topTarget.focus({ preventScroll: true });
      }
      window.scrollTo(0, 0);
    });
  });

  function openFaqItem(id) {
    const details = document.getElementById(id);
    if (!(details instanceof HTMLDetailsElement)) {
      return false;
    }

    details.open = true;
    if (location.hash !== '#' + id) {
      history.pushState(null, '', '#' + id);
    }
    details.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  function closeHobbiesPopup(popup) {
    popup.hidden = true;
    document.body.classList.remove('faq-popup-open');
  }

  function openHobbiesPopup() {
    const source = document.getElementById('faq-hobbies');
    if (!source) {
      return;
    }

    const isEn = document.documentElement.lang === 'en';
    let popup = document.getElementById('faq-hobbies-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'faq-hobbies-popup';
      popup.className = 'faq-popup';
      popup.hidden = true;
      popup.innerHTML =
        '<div class="faq-popup__backdrop" data-faq-popup-close></div>' +
        '<div class="faq-popup__panel" role="dialog" aria-modal="true" aria-labelledby="faq-hobbies-popup-title">' +
        '<button type="button" class="faq-popup__close" data-faq-popup-close aria-label="' +
        (isEn ? 'Close' : '閉じる') +
        '">×</button>' +
        '<h3 class="faq-popup__title" id="faq-hobbies-popup-title"></h3>' +
        '<div class="faq-popup__content"></div>' +
        '</div>';
      document.body.appendChild(popup);

      popup.querySelectorAll('[data-faq-popup-close]').forEach((el) => {
        el.addEventListener('click', () => closeHobbiesPopup(popup));
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !popup.hidden) {
          closeHobbiesPopup(popup);
        }
      });
    }

    const summary = source.querySelector('summary');
    const list = source.querySelector('.faq-item__hobbies');
    popup.querySelector('.faq-popup__title').textContent = summary ? summary.textContent.trim() : '';
    const content = popup.querySelector('.faq-popup__content');
    content.replaceChildren();
    if (list) {
      content.appendChild(list.cloneNode(true));
    }

    popup.hidden = false;
    document.body.classList.add('faq-popup-open');
    popup.querySelector('.faq-popup__close').focus();
  }

  document.querySelectorAll('.profile__faq-nav__link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openHobbiesPopup();
    });
  });

  if (location.hash === '#faq-hobbies') {
    openFaqItem('faq-hobbies');
  }

  window.addEventListener('hashchange', () => {
    if (location.hash === '#faq-hobbies') {
      openFaqItem('faq-hobbies');
    }
  });

  function openPopup(url, windowName, size) {
    const width = size?.width ?? 520;
    const height = size?.height ?? 620;
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));
    const features = [
      'popup=yes',
      'width=' + width,
      'height=' + height,
      'left=' + left,
      'top=' + top,
      'scrollbars=yes',
      'resizable=yes',
    ].join(',');

    const popup = window.open(url, windowName, features);
    if (popup) {
      popup.opener = null;
      return popup;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    return null;
  }

  function attachGuidePopup(link, windowName) {
    link.removeAttribute('target');
    link.rel = 'external noopener noreferrer';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openPopup(link.href, windowName);
    });
  }

  document.querySelectorAll('.access__maps-link').forEach((link, index) => {
    attachGuidePopup(link, 'accessGuide' + index);
  });

  const spotsSection = document.querySelector('#spots');
  if (spotsSection) {
    spotsSection.querySelectorAll('.spots__link').forEach((link, index) => {
      attachGuidePopup(link, 'spotGuide' + index);
    });
  }

  document.querySelectorAll('.offer__pdf-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openPopup(link.href, 'hanayukariPdf', { width: 900, height: 700 });
    });
  });

  const counterEls = document.querySelectorAll('.visit-counter');
  if (counterEls.length) {
    const labelEls = document.querySelectorAll('.visit-counter-label');
    const storageKey = 'satoFarmPageViews';
    const counterKey = 'sato-farm-nakanojo-lp';
    const locale = document.documentElement.lang === 'en' ? 'en-US' : 'ja-JP';
    const isEn = document.documentElement.lang === 'en';

    const showCount = (count) => {
      const text = Number(count).toLocaleString(locale);
      counterEls.forEach((el) => {
        el.textContent = text;
      });
    };

    const useLocalCounter = () => {
      labelEls.forEach((el) => {
        el.textContent = isEn ? 'Views (this device)' : '表示回数（この端末）';
      });
      const count = (parseInt(localStorage.getItem(storageKey), 10) || 0) + 1;
      localStorage.setItem(storageKey, String(count));
      showCount(count);
    };

    fetch('https://countapi.mileshilliard.com/api/v1/hit/' + counterKey)
      .then((response) => {
        if (!response.ok) {
          throw new Error('counter_failed');
        }
        return response.json();
      })
      .then((data) => {
        if (typeof data.value === 'number') {
          showCount(data.value);
          return;
        }
        throw new Error('counter_invalid');
      })
      .catch(useLocalCounter);
  }

  document.querySelectorAll('.access__guide-qr-site').forEach((img) => {
    const item = img.closest('.access__guide-qr-item--site');
    if (!item) {
      return;
    }
    img.addEventListener('error', () => {
      item.hidden = true;
    });
    if (img.complete && img.naturalWidth === 0) {
      item.hidden = true;
    }
  });
})();
