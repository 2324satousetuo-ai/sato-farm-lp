(function () {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  const headerFold = document.querySelector('.header-fold');
  const siteHeader = document.querySelector('.header');
  if (headerFold && siteHeader) {
    const foldKey = 'sato-header-folded';
    const applyFold = (folded) => {
      siteHeader.classList.toggle('is-folded', folded);
      headerFold.setAttribute('aria-expanded', folded ? 'false' : 'true');
      headerFold.setAttribute(
        'aria-label',
        folded ? headerFold.getAttribute('data-open-label') : headerFold.getAttribute('data-close-label')
      );
    };
    try {
      if (sessionStorage.getItem(foldKey) === '1') applyFold(true);
    } catch (err) {
      /* storage unavailable */
    }
    headerFold.addEventListener('click', () => {
      const folded = !siteHeader.classList.contains('is-folded');
      applyFold(folded);
      try {
        sessionStorage.setItem(foldKey, folded ? '1' : '0');
      } catch (err) {
        /* storage unavailable */
      }
    });
  }

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
    payload.subject = isEn ? '[Sato Farms] Website contact' : '【佐藤農園】ホームページお問い合わせ';
    payload.from_name = isEn ? 'Sato Farms website' : '佐藤農園ホームページ';
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

    fetch('/api/visits', { cache: 'no-store' })
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
function scrollAnchor(target) {
  if (!target || target.id === 'top') return target;
  var heading = target.querySelector('h2');
  if (!heading) return target;
  if (heading.getBoundingClientRect().top - target.getBoundingClientRect().top < 180) return target;
  var label = heading.previousElementSibling;
  if (label && label.classList.contains('section__label')) return label;
  return heading;
}

function scrollToSection(target) {
  var anchor = scrollAnchor(target);
  if (!anchor || (target && target.id === 'top')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  var header = document.querySelector('.header');
  var headerH = header ? header.getBoundingClientRect().height : 72;
  var top = anchor.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

window.addEventListener('DOMContentLoaded', function() {
  var sectionIds = ['top'];
  document.querySelectorAll('main > section[id]').forEach(function (section) {
    sectionIds.push(section.id);
  });
  var currentIndex = -1;

  var arrowBtn = document.querySelector('.scroll-arrow');
  if (arrowBtn) {
    arrowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      currentIndex++;
      if (currentIndex >= sectionIds.length) {
        currentIndex = 0;
      }
      var target = document.getElementById(sectionIds[currentIndex]);
      if (target) {
        scrollToSection(target);
      }
    });
  }

  // Old LP anchors (#news / #field-report / #soliloquy / #spots): highlight the "moved to blog" notice
  var legacyHashes = {
    news: true,
    'field-report': true,
    soliloquy: true,
    spots: true
  };

  function clearLegacyAnchorHighlight() {
    document.querySelectorAll('.is-legacy-anchor').forEach(function (el) {
      el.classList.remove('is-legacy-anchor');
    });
    document.querySelectorAll('.lp-moved-notice.is-emphasized').forEach(function (el) {
      el.classList.remove('is-emphasized');
    });
  }

  function highlightLegacyAnchorFromHash() {
    clearLegacyAnchorHighlight();
    var id = (window.location.hash || '').replace(/^#/, '');
    if (!legacyHashes[id]) {
      return;
    }
    var section = document.getElementById(id);
    if (!section) {
      return;
    }
    section.classList.add('is-legacy-anchor');
    var notice = section.querySelector('.lp-moved-notice[data-legacy-hash="' + id + '"]');
    if (notice) {
      notice.classList.add('is-emphasized');
    }
  }

  highlightLegacyAnchorFromHash();
  window.addEventListener('hashchange', highlightLegacyAnchorFromHash);
});

(function () {
  var me = document.currentScript;
  var src = me ? me.getAttribute('src') || '' : '';
  var base = src.replace(/script\.js(?:\?.*)?$/, '');

  function text(value) {
    return value == null ? '' : String(value);
  }

  function langOf() {
    return document.documentElement.lang === 'en' ? 'en' : 'ja';
  }

  function articleFile(article, file, lang) {
    if (lang === 'en' && article && article.enFile) return article.enFile;
    return file;
  }

  function titleOf(article, lang) {
    if (!article) return '';
    return text(article[lang] || article.ja || article.en);
  }

  function shelfName(shelf, lang) {
    var name = shelf && shelf.name;
    if (!name) return '';
    return text(name[lang] || name.ja || name.en);
  }

  function ensureCss() {
    if (document.querySelector('link[href*="library.css"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'library.css?v=3';
    link.setAttribute('data-library-css', '');
    document.head.appendChild(link);
  }

  function libraryHome(hash) {
    var suffix = hash ? '#' + String(hash).replace(/^#/, '') : '';
    var path = location.pathname || '';
    if (/\/(?:blog|blog-en)\/notes\//.test(path)) return '../library/' + suffix;
    if (/\/(?:blog|blog-en)\/library(?:\/|\/index\.html)?$/.test(path)) return suffix || './';
    if (/\/blog-en(?:\/|\/index\.html)?$/.test(path)) return 'library/' + suffix;
    if (/\/blog(?:\/|\/index\.html)?$/.test(path)) return 'library/' + suffix;
    return (langOf() === 'en' ? 'blog-en/library/' : 'blog/library/') + suffix;
  }

  function currentNoteFile() {
    var name = (location.pathname || '').split('/').pop() || '';
    return /\.html$/i.test(name) && name.toLowerCase() !== 'index.html' ? name : '';
  }

  function shelvesForFile(catalog, file) {
    if (!file) return [];
    var articles = catalog.articles || {};
    return (catalog.shelves || []).filter(function (shelf) {
      return (shelf.items || []).some(function (item) {
        var article = articles[item];
        return item === file || (article && article.enFile === file);
      });
    });
  }

  function fillShelfLink(link, shelf, index, lang) {
    var no = document.createElement('span');
    no.className = 'library-shelf__no';
    no.textContent = String(index + 1);
    var name = document.createElement('span');
    name.className = 'library-shelf__name';
    name.textContent = shelfName(shelf, lang);
    link.appendChild(no);
    link.appendChild(name);
  }

  function renderEntrance(catalog, mount) {
    var lang = langOf();
    var list = document.createElement('ul');
    list.className = 'library-shelves';
    (catalog.shelves || []).forEach(function (shelf, index) {
      var li = document.createElement('li');
      var link = document.createElement('a');
      link.className = 'library-shelf';
      link.href = libraryHome(shelf.id);
      fillShelfLink(link, shelf, index, lang);
      li.appendChild(link);
      list.appendChild(li);
    });
    mount.replaceChildren(list);
  }

  function renderCatalog(catalog, mount) {
    var lang = langOf();
    var articles = catalog.articles || {};
    var shelves = catalog.shelves || [];
    var jump = document.createElement('nav');
    jump.className = 'library-jump';
    jump.setAttribute('aria-label', lang === 'en' ? 'Shelves' : '棚');
    var board = document.createElement('div');
    board.className = 'library-board';

    shelves.forEach(function (shelf, index) {
      var jumpLink = document.createElement('a');
      jumpLink.className = 'library-jump__link';
      jumpLink.href = '#' + shelf.id;
      jumpLink.textContent = (index + 1) + ' ' + shelfName(shelf, lang);
      jump.appendChild(jumpLink);

      var room = document.createElement('section');
      room.className = 'library-room';
      room.id = shelf.id;
      var title = document.createElement('h2');
      title.className = 'library-room__title';
      title.textContent = (index + 1) + ' ' + shelfName(shelf, lang);
      var count = document.createElement('p');
      count.className = 'library-room__count';
      count.textContent = lang === 'en'
        ? (shelf.items || []).length + ' titles'
        : (shelf.items || []).length + '題';
      var items = document.createElement('ul');
      items.className = 'library-room__list';
      (shelf.items || []).forEach(function (file) {
        var li = document.createElement('li');
        var card = document.createElement('p');
        card.className = 'library-card';
        card.textContent = titleOf(articles[file], lang);
        li.appendChild(card);
        items.appendChild(li);
      });
      var back = document.createElement('p');
      back.className = 'library-room__back';
      var backLink = document.createElement('a');
      backLink.href = '#library-top';
      backLink.textContent = lang === 'en' ? 'Back to the shelves' : '棚の一覧へ';
      back.appendChild(backLink);
      room.appendChild(title);
      room.appendChild(count);
      room.appendChild(items);
      room.appendChild(back);
      board.appendChild(room);
    });

    mount.replaceChildren(jump, board);
    var hashId = (location.hash || '').replace(/^#/, '');
    var room = hashId ? document.getElementById(hashId) : null;
    if (room && room.classList.contains('library-room')) scrollToSection(room);
  }

  function renderCorner(catalog, mount) {
    var lang = langOf();
    var heading = document.createElement('h2');
    heading.className = 'section__title';
    heading.textContent = lang === 'en' ? 'Farm Library' : '農園図書館';
    var lead = document.createElement('p');
    lead.className = 'library-lead';
    lead.textContent = lang === 'en'
      ? 'This article sits on the shelves below. The Farm Library holds every title.'
      : 'この記事がある棚です。十の棚の題名は、農園図書館にまとめてあります。';
    var home = document.createElement('a');
    home.className = 'library-return';
    home.href = libraryHome();
    home.textContent = lang === 'en' ? 'Open the Farm Library' : '農園図書館を見る';
    var list = document.createElement('ul');
    list.className = 'library-corner__shelves';
    shelvesForFile(catalog, currentNoteFile()).forEach(function (shelf) {
      var li = document.createElement('li');
      var link = document.createElement('a');
      link.href = libraryHome(shelf.id);
      link.textContent = shelfName(shelf, lang);
      li.appendChild(link);
      list.appendChild(li);
    });
    mount.replaceChildren(heading, lead, home, list);
  }

  function mountCorner() {
    var article = document.querySelector('.blog-article .container');
    if (!article || document.getElementById('library-corner')) return null;
    var corner = document.createElement('section');
    corner.id = 'library-corner';
    corner.className = 'library-corner';
    corner.setAttribute('aria-label', langOf() === 'en' ? 'Farm Library' : '農園図書館');
    var nav = article.querySelector('.blog-article__nav');
    if (nav) article.insertBefore(corner, nav);
    else article.appendChild(corner);
    return corner;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var entrance = document.getElementById('library-mount');
    var catalogMount = document.getElementById('library-catalog');
    var corner = document.querySelector('.blog-article') ? mountCorner() : null;
    if (!entrance && !catalogMount && !corner) return;
    ensureCss();
    fetch(base + 'data/library.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('library_failed');
        return response.json();
      })
      .then(function (catalog) {
        if (entrance) renderEntrance(catalog, entrance);
        if (catalogMount) renderCatalog(catalog, catalogMount);
        if (corner) renderCorner(catalog, corner);
      })
      .catch(function () {
        var message = langOf() === 'en' ? 'The shelves could not be loaded.' : '棚を読み込めませんでした。';
        if (entrance) entrance.textContent = message;
        if (catalogMount) catalogMount.textContent = message;
        if (corner) corner.textContent = message;
      });
  });
})();