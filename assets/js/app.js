/*
 * Kodla — uygulama mantığı
 * Yönlendirme (#/bolum/14), arama, kategori filtreleri, dil seçimi,
 * kenar çubuğu, bölüm detay görünümü ve kod kopyalama.
 */
(function () {
  'use strict';

  var D = window.KODLA;
  var icon = D.icon;
  var CHAPTERS = D.chapters.slice().sort(function (a, b) { return a.n - b.n; });
  var BY_N = {};
  CHAPTERS.forEach(function (c) { BY_N[c.n] = c; });

  // ---------- Sabitler ----------
  var MODULES = [
    { m: 1, icon: 'led', t: ['Temel Giriş ve Çıkışlar', 'Basic Inputs & Outputs'], s: ['LED, buton, PWM, analog okuma ve ses', 'LEDs, buttons, PWM, analog input and sound'] },
    { m: 2, icon: 'dht', t: ['Sensörler ve Çevresel Ölçüm', 'Sensors & Environmental Sensing'], s: ['Sıcaklık, nem, mesafe, hareket ve gaz', 'Temperature, humidity, distance, motion and gas'] },
    { m: 3, icon: 'servo', t: ['Ekranlar ve Sürücüler', 'Displays & Drivers'], s: ['LCD, OLED, LED matris ve motorlar', 'LCD, OLED, LED matrix and motors'] },
    { m: 4, icon: 'home', t: ['Haberleşme ve İleri Uygulamalar', 'Communication & Advanced Projects'], s: ['RFID, RTC, Bluetooth ve bitirme projeleri', 'RFID, RTC, Bluetooth and capstone projects'] }
  ];

  var CATS = [
    { id: 'all', t: ['Tümü', 'All'] },
    { id: 'basic', t: ['Temel Seviye', 'Fundamentals'] },
    { id: 'sensors', t: ['Sensörler & Ekranlar', 'Sensors & Displays'] },
    { id: 'motors', t: ['Motorlar & Modüller', 'Motors & Modules'] },
    { id: 'advanced', t: ['İleri Projeler', 'Advanced Projects'] }
  ];

  var LEVELS = { 1: ['Başlangıç', 'Beginner'], 2: ['Orta', 'Intermediate'], 3: ['İleri', 'Advanced'] };

  var UI = {
    tr: {
      searchPh: 'Bölüm, sensör veya modül ara…',
      noResults: 'Sonuç bulunamadı',
      chapter: 'Bölüm',
      module: 'Modül',
      chapters: 'bölüm',
      heroEyebrow: 'Arduino Uno ve Nano için 42 bölüm',
      heroTitle: 'Arduino\'yu <em>adım adım</em> öğren.',
      heroText: 'İlk LED\'den akıllı ev prototipine kadar. Her bölümde malzeme listesi, bağlantı şeması ve çalışan kod var.',
      start: 'Başla',
      continueAt: 'Kaldığın yerden devam et',
      statChapters: 'Bölüm',
      statModules: 'Modül',
      statDone: 'Tamamlanan',
      allChapters: 'Tüm Bölümler',
      filtered: 'Filtrelenmiş sonuçlar',
      clear: 'Filtreyi temizle',
      emptyTitle: 'Eşleşen bölüm yok',
      emptyText: 'Farklı bir anahtar kelime dene veya kategori filtresini sıfırla.',
      compat: 'Arduino Uno / Nano Uyumlu',
      parts: 'Gerekli Malzemeler',
      wiring: 'Devre Bağlantı Şeması',
      wiringHint: 'Bağlantıları sırayla yap. Devreyi kurarken Arduino\'nun USB bağlantısını çıkar.',
      code: 'Kod',
      copy: 'Kodu Kopyala',
      copied: 'Kopyalandı!',
      download: '.ino indir',
      libs: 'Gerekli Kütüphaneler',
      libsHint: 'Arduino IDE > Araçlar > Kütüphaneleri Yönet menüsünden kur.',
      tip: 'Not',
      lines: 'satır',
      prev: 'Önceki Bölüm',
      next: 'Sonraki Bölüm',
      markDone: 'Tamamlandı olarak işaretle',
      isDone: 'Tamamlandı',
      progress: 'İlerleme',
      home: 'Ana Sayfa',
      legendPwr: 'Güç',
      legendGnd: 'Toprak',
      legendSig: 'Sinyal',
      footer: 'Arduino Uno ve Nano dersleri.',
      menu: 'Bölümler'
    },
    en: {
      searchPh: 'Search chapters, sensors or modules…',
      noResults: 'No results found',
      chapter: 'Chapter',
      module: 'Module',
      chapters: 'chapters',
      heroEyebrow: '42 chapters for Arduino Uno and Nano',
      heroTitle: 'Learn Arduino <em>step by step</em>.',
      heroText: 'From your first LED to a smart home prototype. Every chapter has a parts list, a wiring guide and working code.',
      start: 'Start',
      continueAt: 'Continue where you left off',
      statChapters: 'Chapters',
      statModules: 'Modules',
      statDone: 'Completed',
      allChapters: 'All Chapters',
      filtered: 'Filtered results',
      clear: 'Clear filters',
      emptyTitle: 'No matching chapters',
      emptyText: 'Try another keyword or reset the category filter.',
      compat: 'Arduino Uno / Nano Compatible',
      parts: 'Required Components',
      wiring: 'Wiring Guide',
      wiringHint: 'Make the connections in order. Unplug the Arduino\'s USB cable while wiring.',
      code: 'Code',
      copy: 'Copy Code',
      copied: 'Copied!',
      download: 'Download .ino',
      libs: 'Required Libraries',
      libsHint: 'Install via Arduino IDE > Tools > Manage Libraries.',
      tip: 'Note',
      lines: 'lines',
      prev: 'Previous Chapter',
      next: 'Next Chapter',
      markDone: 'Mark as completed',
      isDone: 'Completed',
      progress: 'Progress',
      home: 'Home',
      legendPwr: 'Power',
      legendGnd: 'Ground',
      legendSig: 'Signal',
      footer: 'Arduino lessons for Uno and Nano.',
      menu: 'Chapters'
    }
  };

  // ---------- Durum ----------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('kodla.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('kodla.' + k, JSON.stringify(v)); } catch (e) { /* gizli mod */ } }
  };

  var state = {
    lang: store.get('lang', 'tr'),
    cat: 'all',
    query: '',
    view: 'home',
    n: null,
    done: store.get('done', []),
    collapsed: {}
  };
  if (state.lang !== 'tr' && state.lang !== 'en') state.lang = 'tr';

  // ---------- Yardımcılar ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function L(v) { return Array.isArray(v) ? v[state.lang === 'en' ? 1 : 0] : v; }
  function T(k) { return UI[state.lang][k]; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fold(s) {
    return String(s)
      .replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase()
      .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
      .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  }
  function isDone(n) { return state.done.indexOf(n) !== -1; }
  function codeFor(c) { return D.localizeCode(c.code, state.lang); }

  // Arama dizini: her iki dildeki başlıklar, açıklama, etiketler ve malzemeler
  var INDEX = {};
  CHAPTERS.forEach(function (c) {
    var parts = c.parts.map(function (p) { return Array.isArray(p[1]) ? p[1].join(' ') : p[1]; }).join(' ');
    INDEX[c.n] = fold([c.n, 'bolum ' + c.n, 'chapter ' + c.n, c.t.join(' '), c.d.join(' '), c.tags, parts, (c.libs || []).join(' ')].join(' '));
  });

  function matches(c) {
    if (state.cat !== 'all' && c.cat !== state.cat) return false;
    var q = fold(state.query.trim());
    if (!q) return true;
    return q.split(/\s+/).every(function (w) { return INDEX[c.n].indexOf(w) !== -1; });
  }

  function filtered() { return CHAPTERS.filter(matches); }

  // ---------- Statik metinler ----------
  function renderChrome() {
    document.documentElement.lang = state.lang;
    $('#search').placeholder = T('searchPh');
    $$('[data-i18n]').forEach(function (el) { el.textContent = T(el.getAttribute('data-i18n')); });
    $$('.lang-btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === state.lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    $('#cats').innerHTML = CATS.map(function (c) {
      var count = c.id === 'all' ? CHAPTERS.length : CHAPTERS.filter(function (x) { return x.cat === c.id; }).length;
      return '<button class="chip' + (state.cat === c.id ? ' active' : '') + '" data-cat="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' +
        esc(L(c.t)) + '<span class="chip-count">' + count + '</span></button>';
    }).join('');
    renderProgress();
  }

  function renderProgress() {
    var pct = Math.round(state.done.length / CHAPTERS.length * 100);
    $('#progress-fill').style.width = pct + '%';
    $('#progress-text').textContent = state.done.length + ' / ' + CHAPTERS.length;
  }

  // ---------- Kenar çubuğu ----------
  function renderSidebar() {
    var list = filtered();
    var html = MODULES.map(function (mod) {
      var items = list.filter(function (c) { return c.m === mod.m; });
      if (!items.length) return '';
      var all = CHAPTERS.filter(function (c) { return c.m === mod.m; });
      var first = all[0].n, last = all[all.length - 1].n;
      var collapsed = state.collapsed[mod.m] && !state.query;
      return '<div class="side-mod' + (collapsed ? ' collapsed' : '') + '">' +
        '<button class="side-mod-head" data-mod="' + mod.m + '" aria-expanded="' + !collapsed + '">' +
          '<span class="side-mod-num">' + mod.m + '</span>' +
          '<span class="side-mod-text"><b>' + esc(L(mod.t)) + '</b><small>' + T('chapter') + ' ' + first + ' – ' + last + '</small></span>' +
          icon('chevron', 'side-chev') +
        '</button>' +
        '<ul class="side-list">' + items.map(function (c) {
          var active = state.view === 'chapter' && state.n === c.n;
          return '<li><a href="#/bolum/' + c.n + '" class="side-item' + (active ? ' active' : '') + (isDone(c.n) ? ' done' : '') + '"' + (active ? ' aria-current="page"' : '') + '>' +
            '<span class="side-n">' + String(c.n).padStart(2, '0') + '</span>' +
            '<span class="side-t">' + esc(L(c.t)) + '</span>' +
            '<span class="side-dot lvl-' + c.lvl + '" title="' + esc(L(LEVELS[c.lvl])) + '">' + (isDone(c.n) ? icon('check') : '') + '</span>' +
          '</a></li>';
        }).join('') + '</ul></div>';
    }).join('');

    $('#side-nav').innerHTML = html || '<div class="side-empty">' + icon('search') + '<span>' + T('noResults') + '</span></div>';

    var active = $('.side-item.active');
    if (active) {
      var box = $('#side-nav');
      var top = active.offsetTop - box.offsetTop;
      if (top < box.scrollTop + 40 || top > box.scrollTop + box.clientHeight - 80) {
        box.scrollTo({ top: top - box.clientHeight / 3, behavior: 'smooth' });
      }
    }
  }

  // ---------- Ana sayfa ----------
  function chapterCard(c, i) {
    return '<a href="#/bolum/' + c.n + '" class="card glass reveal" style="--d:' + Math.min(i, 12) * 35 + 'ms">' +
      '<div class="card-top">' +
        '<span class="card-ico">' + icon(c.icon) + '</span>' +
        '<span class="badge-n">' + T('chapter') + ' ' + c.n + '</span>' +
        (isDone(c.n) ? '<span class="card-done" title="' + T('isDone') + '">' + icon('check') + '</span>' : '') +
      '</div>' +
      '<h3>' + esc(L(c.t)) + '</h3>' +
      '<p>' + esc(L(c.d)) + '</p>' +
      '<div class="card-foot">' +
        '<span class="lvl lvl-' + c.lvl + '"><i></i>' + esc(L(LEVELS[c.lvl])) + '</span>' +
        '<span class="card-parts">' + icon('package') + c.parts.length + '</span>' +
        icon('arrowRight', 'card-go') +
      '</div></a>';
  }

  function renderHome() {
    var list = filtered();
    var isFiltered = state.cat !== 'all' || state.query.trim();
    var nextUp = CHAPTERS.filter(function (c) { return !isDone(c.n); })[0];
    var resume = state.done.length && nextUp;

    var hero = isFiltered ? '' :
      '<section class="hero reveal">' +
        '<div class="hero-body">' +
          '<span class="eyebrow">' + T('heroEyebrow') + '</span>' +
          '<h1>' + T('heroTitle') + '</h1>' +
          '<p>' + T('heroText') + '</p>' +
          '<div class="hero-cta">' +
            '<a class="btn btn-primary" href="#/bolum/' + (resume ? nextUp.n : 1) + '">' + (resume ? T('continueAt') : T('start')) + icon('arrowRight') + '</a>' +
          '</div>' +
        '</div>' +
        '<img class="hero-logo" src="assets/img/kodla-kare.png" alt="" width="240" height="240">' +
      '</section>' +
      '<section class="stats">' +
        stat(CHAPTERS.length, T('statChapters'), 'book') +
        stat(MODULES.length, T('statModules'), 'layers') +
        stat(state.done.length, T('statDone'), 'check') +
      '</section>';

    var body;
    if (!list.length) {
      body = '<div class="empty glass reveal">' + icon('search') + '<h3>' + T('emptyTitle') + '</h3><p>' + T('emptyText') + '</p>' +
        '<button class="btn btn-ghost" data-action="clear">' + T('clear') + '</button></div>';
    } else {
      body = MODULES.map(function (mod) {
        var items = list.filter(function (c) { return c.m === mod.m; });
        if (!items.length) return '';
        return '<section class="mod-section">' +
          '<header class="mod-head reveal">' +
            '<span class="mod-ico">' + icon(mod.icon) + '</span>' +
            '<div><span class="mod-label">' + T('module') + ' ' + mod.m + '</span><h2>' + esc(L(mod.t)) + '</h2><p>' + esc(L(mod.s)) + '</p></div>' +
            '<span class="mod-count">' + items.length + ' ' + T('chapters') + '</span>' +
          '</header>' +
          '<div class="cards">' + items.map(chapterCard).join('') + '</div>' +
        '</section>';
      }).join('');
    }

    var head = isFiltered
      ? '<div class="filter-head reveal"><h2>' + T('filtered') + ' <span>' + list.length + '</span></h2>' +
        '<button class="btn btn-ghost btn-sm" data-action="clear">' + icon('close') + T('clear') + '</button></div>'
      : '';

    return hero + head + body;
  }

  function stat(v, label, ic) {
    return '<div class="stat glass reveal"><span class="stat-ico">' + icon(ic) + '</span><b>' + v + '</b><span>' + label + '</span></div>';
  }

  // ---------- Bölüm detayı ----------
  // Bağlantı hedefini renk sınıfına çevirir: güç, toprak, sinyal veya karışık
  function pinClass(s) {
    var t = String(s).toUpperCase();
    var gnd = /GND|\(−\)/.test(t);
    var pwr = /(^|[^.\d])(5V|3\.3V)|VIN|\(\+\)/.test(t);
    if (gnd && (pwr || /PIN/.test(t))) return 'mix';
    if (gnd) return 'gnd';
    if (pwr) return 'pwr';
    return 'sig';
  }

  function renderChapter(c) {
    var idx = CHAPTERS.indexOf(c);
    var prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
    var mod = MODULES[c.m - 1];
    var code = codeFor(c);
    var lines = D.highlight(code);
    var done = isDone(c.n);

    var parts = c.parts.map(function (p, i) {
      return '<div class="part glass reveal" style="--d:' + i * 40 + 'ms">' +
        '<span class="part-ico">' + icon(p[0]) + '</span>' +
        '<span class="part-name">' + esc(L(p[1])) + '</span>' +
        '<span class="part-qty">×' + p[2] + '</span>' +
      '</div>';
    }).join('');

    var wiring = c.wire.map(function (w, i) {
      var cls = pinClass(L(w[1]));
      return '<li class="wire-step reveal" style="--d:' + i * 45 + 'ms">' +
        '<span class="wire-num">' + (i + 1) + '</span>' +
        '<div class="wire-body">' +
          '<div class="wire-row">' +
            '<span class="pin pin-from">' + esc(L(w[0])) + '</span>' +
            '<span class="wire-line ' + cls + '"><i></i></span>' +
            '<span class="pin pin-to ' + cls + '">' + esc(L(w[1])) + '</span>' +
          '</div>' +
          (w[2] ? '<p class="wire-note">' + esc(L(w[2])) + '</p>' : '') +
        '</div>' +
      '</li>';
    }).join('');

    var libs = c.libs ? '<section class="block">' +
      '<h2 class="block-title">' + icon('package') + T('libs') + '</h2>' +
      '<div class="libs">' + c.libs.map(function (l) { return '<span class="lib">' + icon('book') + esc(L(l)) + '</span>'; }).join('') + '</div>' +
      '<p class="muted small">' + T('libsHint') + '</p></section>' : '';

    var codeHtml = lines.map(function (ln, i) {
      return '<span class="ln"><span class="ln-n">' + (i + 1) + '</span><span class="ln-c">' + (ln || ' ') + '</span></span>';
    }).join('');

    return '' +
      '<nav class="crumbs reveal"><a href="#/">' + T('home') + '</a>' + icon('chevron') +
        '<span>' + T('module') + ' ' + c.m + ' · ' + esc(L(mod.t)) + '</span>' + icon('chevron') +
        '<span class="cur">' + T('chapter') + ' ' + c.n + '</span></nav>' +

      '<header class="ch-head glass reveal">' +
        '<span class="ch-ico">' + icon(c.icon) + '</span>' +
        '<div class="ch-head-body">' +
          '<div class="badges">' +
            '<span class="badge badge-accent">' + T('chapter') + ' ' + c.n + '</span>' +
            '<span class="badge lvl-badge lvl-' + c.lvl + '"><i></i>' + esc(L(LEVELS[c.lvl])) + '</span>' +
            '<span class="badge badge-compat">' + icon('chip') + T('compat') + '</span>' +
          '</div>' +
          '<h1>' + esc(L(c.t)) + '</h1>' +
          '<p>' + esc(L(c.d)) + '</p>' +
        '</div>' +
        '<button class="btn btn-done' + (done ? ' is-done' : '') + '" data-action="toggle-done" aria-pressed="' + done + '">' +
          icon('check') + '<span>' + (done ? T('isDone') : T('markDone')) + '</span></button>' +
      '</header>' +

      '<section class="block">' +
        '<h2 class="block-title">' + icon('package') + T('parts') + '<span class="block-count">' + c.parts.length + '</span></h2>' +
        '<div class="parts">' + parts + '</div>' +
      '</section>' +

      '<section class="block">' +
        '<h2 class="block-title">' + icon('plug') + T('wiring') + '</h2>' +
        '<div class="wire-meta"><p class="muted small">' + T('wiringHint') + '</p>' +
          '<div class="legend"><span><i class="pwr"></i>' + T('legendPwr') + '</span><span><i class="gnd"></i>' + T('legendGnd') + '</span><span><i class="sig"></i>' + T('legendSig') + '</span></div>' +
        '</div>' +
        '<ol class="wiring glass">' + wiring + '</ol>' +
      '</section>' +

      libs +

      '<section class="block">' +
        '<h2 class="block-title">' + icon('code') + T('code') + '</h2>' +
        '<div class="codebox reveal">' +
          '<div class="code-bar">' +
            '<span class="dots"><i></i><i></i><i></i></span>' +
            '<span class="code-file">bolum_' + String(c.n).padStart(2, '0') + '.ino</span>' +
            '<span class="code-meta">Arduino C++ · ' + lines.length + ' ' + T('lines') + '</span>' +
            '<button class="btn btn-ghost btn-sm" data-action="download" title="' + T('download') + '">' + icon('arrowRight', 'rot90') + '<span class="hide-sm">' + T('download') + '</span></button>' +
            '<button class="btn btn-copy" data-action="copy" aria-live="polite">' +
              '<span class="copy-ico">' + icon('copy') + icon('check') + '</span>' +
              '<span class="copy-label">' + T('copy') + '</span>' +
            '</button>' +
          '</div>' +
          '<pre class="code"><code>' + codeHtml + '</code></pre>' +
        '</div>' +
      '</section>' +

      (c.tip ? '<aside class="tip glass reveal">' + icon('bulb') + '<div><b>' + T('tip') + '</b><p>' + esc(L(c.tip)) + '</p></div></aside>' : '') +

      '<nav class="pager">' +
        (prev ? '<a class="pager-link glass" href="#/bolum/' + prev.n + '">' + icon('arrowLeft') + '<span><small>' + T('prev') + '</small><b>' + prev.n + '. ' + esc(L(prev.t)) + '</b></span></a>' : '<span></span>') +
        (next ? '<a class="pager-link glass next" href="#/bolum/' + next.n + '"><span><small>' + T('next') + '</small><b>' + next.n + '. ' + esc(L(next.t)) + '</b></span>' + icon('arrowRight') + '</a>' : '<span></span>') +
      '</nav>';
  }

  // ---------- Görünüm ----------
  function render(scrollTop) {
    var main = $('#content');
    var c = state.view === 'chapter' ? BY_N[state.n] : null;
    main.innerHTML = c ? renderChapter(c) : renderHome();
    document.title = c ? (c.n + '. ' + L(c.t) + ' · Kodla') : 'Kodla · Arduino ' + (state.lang === 'en' ? 'Tutorials' : 'Eğitimleri');
    renderSidebar();
    observeReveals();
    if (scrollTop) window.scrollTo(0, 0);
  }

  function observeReveals() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---------- Yönlendirme ----------
  function route() {
    var m = location.hash.match(/^#\/(?:bolum|chapter)\/(\d+)/);
    if (m && BY_N[+m[1]]) { state.view = 'chapter'; state.n = +m[1]; }
    else { state.view = 'home'; state.n = null; }
    closeDrawer();
    closeResults();
    render(true);
  }

  // ---------- Arama açılır listesi ----------
  var resultIdx = -1;

  function renderResults() {
    var box = $('#results');
    var q = state.query.trim();
    if (!q) { closeResults(); return; }
    var list = filtered().slice(0, 8);
    resultIdx = list.length ? 0 : -1;
    box.innerHTML = list.length
      ? list.map(function (c, i) {
          return '<a href="#/bolum/' + c.n + '" class="result' + (i === 0 ? ' sel' : '') + '" role="option">' +
            '<span class="result-ico">' + icon(c.icon) + '</span>' +
            '<span class="result-t"><b>' + esc(L(c.t)) + '</b><small>' + T('chapter') + ' ' + c.n + ' · ' + esc(L(MODULES[c.m - 1].t)) + '</small></span>' +
            '<span class="lvl-dot lvl-' + c.lvl + '"></span></a>';
        }).join('')
      : '<div class="result-empty">' + T('noResults') + ' — “' + esc(q) + '”</div>';
    box.classList.add('open');
    $('#search').setAttribute('aria-expanded', 'true');
  }

  function closeResults() {
    $('#results').classList.remove('open');
    $('#search').setAttribute('aria-expanded', 'false');
    resultIdx = -1;
  }

  function moveResult(d) {
    var items = $$('#results .result');
    if (!items.length) return;
    resultIdx = (resultIdx + d + items.length) % items.length;
    items.forEach(function (el, i) { el.classList.toggle('sel', i === resultIdx); });
    items[resultIdx].scrollIntoView({ block: 'nearest' });
  }

  // ---------- Kopyalama / indirme ----------
  function copyText(text) {
    // Pano API'si yoksa veya izin reddedilirse eski yönteme düş
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); }
      document.body.removeChild(ta);
    });
  }

  var copyTimer;
  function handleCopy(btn) {
    var c = BY_N[state.n];
    copyText(codeFor(c)).then(function () {
      btn.classList.remove('copied');
      void btn.offsetWidth;                 // animasyonu yeniden başlat
      btn.classList.add('copied');
      $('.copy-label', btn).textContent = T('copied');
      $('.codebox').classList.add('flash');
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () {
        btn.classList.remove('copied');
        $('.copy-label', btn).textContent = T('copy');
        var cb = $('.codebox');
        if (cb) cb.classList.remove('flash');
      }, 2200);
    });
  }

  function handleDownload() {
    var c = BY_N[state.n];
    var blob = new Blob([codeFor(c)], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bolum_' + String(c.n).padStart(2, '0') + '.ino';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  // ---------- Mobil çekmece ----------
  function openDrawer() { document.body.classList.add('drawer-open'); }
  function closeDrawer() { document.body.classList.remove('drawer-open'); }

  // ---------- Olaylar ----------
  function bind() {
    window.addEventListener('hashchange', route);

    var search = $('#search');
    search.addEventListener('input', function () {
      state.query = search.value;
      $('.search').classList.toggle('has-value', !!search.value);
      renderResults();
      renderSidebar();
      if (state.view === 'home') { $('#content').innerHTML = renderHome(); observeReveals(); }
    });
    search.addEventListener('focus', function () { if (state.query.trim()) renderResults(); });
    search.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveResult(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveResult(-1); }
      else if (e.key === 'Enter') {
        var sel = $$('#results .result')[resultIdx];
        if (sel) { location.hash = sel.getAttribute('href'); search.blur(); }
      } else if (e.key === 'Escape') { closeResults(); search.blur(); }
    });
    $('#search-clear').addEventListener('click', function () {
      search.value = '';
      search.dispatchEvent(new Event('input'));
      search.focus();
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search')) closeResults();

      var t = e.target.closest('[data-cat],[data-lang],[data-mod],[data-action]');
      if (!t) return;

      if (t.hasAttribute('data-cat')) {
        state.cat = t.getAttribute('data-cat');
        renderChrome();
        if (state.view !== 'home') location.hash = '#/';
        else render(false);
      } else if (t.hasAttribute('data-lang')) {
        state.lang = t.getAttribute('data-lang');
        store.set('lang', state.lang);
        renderChrome();
        render(false);
        if (state.query.trim() && document.activeElement === search) renderResults();
        if (t.closest('#welcome')) closeWelcome();
      } else if (t.hasAttribute('data-mod')) {
        var m = +t.getAttribute('data-mod');
        state.collapsed[m] = !state.collapsed[m];
        t.parentNode.classList.toggle('collapsed');
        t.setAttribute('aria-expanded', !state.collapsed[m]);
      } else {
        var a = t.getAttribute('data-action');
        if (a === 'copy') handleCopy(t);
        else if (a === 'download') handleDownload();
        else if (a === 'clear') {
          state.cat = 'all';
          state.query = '';
          search.value = '';
          $('.search').classList.remove('has-value');
          renderChrome();
          render(false);
        } else if (a === 'toggle-done') {
          var n = state.n;
          state.done = isDone(n) ? state.done.filter(function (x) { return x !== n; }) : state.done.concat(n);
          store.set('done', state.done);
          t.classList.toggle('is-done', isDone(n));
          t.setAttribute('aria-pressed', isDone(n));
          $('span', t).textContent = isDone(n) ? T('isDone') : T('markDone');
          if (isDone(n)) { t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop'); }
          renderProgress();
          renderSidebar();
        } else if (a === 'menu') openDrawer();
        else if (a === 'close-menu') closeDrawer();
        else if (a === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    document.addEventListener('keydown', function (e) {
      var typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        search.focus();
        search.select();
      } else if (!typing && state.view === 'chapter' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        var i = CHAPTERS.indexOf(BY_N[state.n]) + (e.key === 'ArrowRight' ? 1 : -1);
        if (CHAPTERS[i]) location.hash = '#/bolum/' + CHAPTERS[i].n;
      } else if (e.key === 'Escape') closeDrawer();
    });

    var header = $('.topbar');
    var topBtn = $('.to-top');
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
      topBtn.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
  }

  // Yapışkan kenar çubuğu için üst bar yüksekliğini CSS'e aktar
  function syncHeaderHeight() {
    document.documentElement.style.setProperty('--head-h', $('.topbar').offsetHeight + 'px');
  }

  // ---------- Giriş ekranı: her oturumun başında dil seçimi ----------
  function openWelcome() {
    var w = $('#welcome');
    $$('.welcome-btn', w).forEach(function (b) {
      b.classList.toggle('last', b.getAttribute('data-lang') === state.lang);
    });
    w.hidden = false;
    document.body.classList.add('welcome-open');
    requestAnimationFrame(function () { w.classList.add('show'); });
    var last = $('.welcome-btn.last', w);
    if (last) last.focus();
  }

  function closeWelcome() {
    var w = $('#welcome');
    try { sessionStorage.setItem('kodla.welcomed', '1'); } catch (e) { /* gizli mod */ }
    w.classList.remove('show');
    document.body.classList.remove('welcome-open');
    setTimeout(function () { w.hidden = true; }, 450);
  }

  function shouldWelcome() {
    try { return !sessionStorage.getItem('kodla.welcomed'); } catch (e) { return true; }
  }

  // ---------- Başlat ----------
  window.addEventListener('resize', syncHeaderHeight);
  $('#year').textContent = new Date().getFullYear();
  renderChrome();
  syncHeaderHeight();
  bind();
  route();
  if (shouldWelcome()) openWelcome();
})();
