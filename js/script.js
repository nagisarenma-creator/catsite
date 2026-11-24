(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Меню на телефоні */
  var toggle = document.getElementById('menu-toggle');
  document.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () { if (toggle) toggle.checked = false; });
  });

  /* Смуга прокрутки */
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  function updateBar() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();

  /* Випадковий факт */
  var btn = document.getElementById('fact-btn');
  var out = document.getElementById('fact-text');
  if (btn && out) {
    var facts = [
      'Кішка може видавати понад сто різних звуків, а собака лише близько десяти.',
      'Вуса допомагають котові відчувати ширину отвору, у який він хоче пролізти.',
      'Кошенята народжуються глухими й сліпими та розплющують очі приблизно через тиждень.',
      'Кіт проводить уві сні до двох третин свого життя.',
      'У кішок є ще й третя повіка, яку видно, коли вони дуже розслаблені.',
      'Кішки ходять, ставлячи задню лапу в слід передньої, тому їхні сліди такі акуратні.'
    ];
    var last = -1;
    btn.addEventListener('click', function () {
      var i;
      do { i = Math.floor(Math.random() * facts.length); } while (i === last);
      last = i;
      out.textContent = facts[i];
    });
  }

  /* Очі кота стежать за курсором */
  var pupils = document.querySelectorAll('.eye');
  if (pupils.length) {
    document.addEventListener('pointermove', function (e) {
      pupils.forEach(function (eye) {
        var r = eye.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = e.clientX - cx, dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var max = r.width * 0.2;
        var m = Math.min(dist, max);
        eye.style.setProperty('--px', (dx / dist * m) + 'px');
        eye.style.setProperty('--py', (dy / dist * m) + 'px');
      });
    });
  }

  /* Лічильники в цифрах */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var end = parseFloat(el.dataset.count);
    var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = pre + end.toLocaleString('uk-UA') + suf; return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1400, 1);
      var v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v.toLocaleString('uk-UA') + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    var co = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        if (it.isIntersecting) { runCounter(it.target); co.unobserve(it.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* Велике фото при наведенні та перегляд на весь екран */
  var frames = Array.prototype.slice.call(document.querySelectorAll('.card .ph, .gallery .ph'));
  function imgOf(f) { return f.querySelector('img'); }

  var peek = document.createElement('div');
  peek.className = 'peek';
  peek.setAttribute('aria-hidden', 'true');
  peek.innerHTML = '<img alt="">';
  document.body.appendChild(peek);
  var pimg = peek.firstChild;
  var mx = 0, my = 0;

  function placePeek() {
    var w = peek.offsetWidth, h = peek.offsetHeight;
    var x = mx + 26;
    if (x + w > window.innerWidth - 12) x = mx - w - 26;
    if (x < 12) x = 12;
    var y = Math.max(12, Math.min(window.innerHeight - h - 12, my - h / 2));
    peek.style.left = x + 'px';
    peek.style.top = y + 'px';
  }
  pimg.addEventListener('load', placePeek);

  if (fine) {
    frames.forEach(function (f) {
      f.addEventListener('mouseenter', function (e) {
        var im = imgOf(f);
        if (!im) return;
        mx = e.clientX; my = e.clientY;
        pimg.src = im.currentSrc || im.src;
        peek.classList.add('on');
        placePeek();
      });
      f.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        placePeek();
      });
      f.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
    });
  }

  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Перегляд фото');
  lb.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Закрити">×</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Попереднє фото">‹</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Наступне фото">›</button>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('figcaption');
  var list = [], cur = 0;

  function show(i) {
    cur = (i + list.length) % list.length;
    var im = imgOf(list[cur]);
    lbImg.src = im.currentSrc || im.src;
    lbImg.alt = im.alt;
    lbCap.textContent = im.alt;
  }
  function openLb(frame) {
    list = frames.filter(function (f) { return imgOf(f); });
    var i = list.indexOf(frame);
    if (i < 0) return;
    peek.classList.remove('on');
    show(i);
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('on');
    document.body.style.overflow = '';
  }
  frames.forEach(function (f) {
    f.addEventListener('click', function () { if (imgOf(f)) openLb(f); });
    f.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && imgOf(f)) { e.preventDefault(); openLb(f); }
    });
  });
  window.addEventListener('load', function () {
    frames.forEach(function (f) {
      if (imgOf(f)) { f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-label', 'Відкрити фото на весь екран'); }
    });
  });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  /* Далі лише анімації, які можна вимкнути */
  if (reduce) return;

  /* Поява блоків при прокрутці */
  var items = document.querySelectorAll('.card, .fact, .gallery figure, .stat');
  var ro = new IntersectionObserver(function (list2) {
    list2.forEach(function (it) {
      if (it.isIntersecting) { it.target.classList.add('in'); ro.unobserve(it.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.setProperty('--d', (i % 3) * 0.1 + 's');
    ro.observe(el);
  });

  /* 3D-нахил карток і блік */
  if (fine) {
    document.querySelectorAll('.card, .gallery figure').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 10) + 'deg) rotateY(' + ((x - 0.5) * 10) + 'deg) scale(1.03)';
        el.style.setProperty('--gx', (x * 100) + '%');
        el.style.setProperty('--gy', (y * 100) + '%');
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* Коти */
  var layer = document.createElement('div');
  layer.className = 'cat-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  if (fine) {
    var COUNT = 5, GAP = 30, chain = [], mouse = { x: -100, y: -100 }, started = false;
    for (var i = 0; i < COUNT; i++) {
      var el = document.createElement('span');
      el.className = 'follow-cat';
      el.textContent = '🐈';
      el.style.fontSize = (30 - i * 3) + 'px';
      layer.appendChild(el);
      chain.push({ el: el, x: -100, y: -100, flip: 1, alpha: 1 - i * 0.14 });
    }
    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (!started) {
        started = true;
        chain.forEach(function (c) { c.x = mouse.x; c.y = mouse.y; c.el.style.opacity = c.alpha; });
      }
    });
    var tick = function () {
      chain.forEach(function (c, idx) {
        if (idx === 0) {
          var dx0 = mouse.x + 18 - c.x;
          c.x += dx0 * 0.25;
          c.y += (mouse.y + 18 - c.y) * 0.25;
          if (Math.abs(dx0) > 1.5) c.flip = dx0 > 0 ? -1 : 1;
        } else {
          var prev = chain[idx - 1];
          var dx = prev.x - c.x, dy = prev.y - c.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > GAP) {
            var k = ((dist - GAP) / dist) * 0.3;
            c.x += dx * k; c.y += dy * k;
          }
          if (Math.abs(dx) > 1.5) c.flip = dx > 0 ? -1 : 1;
        }
        c.el.style.transform = 'translate(' + c.x + 'px,' + c.y + 'px) scaleX(' + c.flip + ')';
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  var lastY = window.scrollY, lastSpawn = 0;
  function spawnRunners(down) {
    if (layer.querySelectorAll('.runner').length > 9) return;
    for (var i = 0; i < 3; i++) {
      var r = document.createElement('span');
      r.className = 'runner ' + (down ? 'to-right' : 'to-left');
      var inner = document.createElement('span');
      inner.className = 'bob';
      inner.textContent = '🐈';
      r.appendChild(inner);
      r.style.top = (10 + Math.random() * 75) + 'vh';
      r.style.fontSize = (1.6 + Math.random() * 1.2) + 'rem';
      r.style.animationDuration = (3 + Math.random() * 2.5) + 's';
      r.style.animationDelay = (i * 0.25) + 's';
      r.addEventListener('animationend', function (e) {
        if (e.target === e.currentTarget) e.currentTarget.remove();
      });
      layer.appendChild(r);
    }
  }
  window.addEventListener('scroll', function () {
    var y = window.scrollY, d = y - lastY, now = Date.now();
    lastY = y;
    if (Math.abs(d) < 20 || now - lastSpawn < 700) return;
    lastSpawn = now;
    spawnRunners(d > 0);
  }, { passive: true });
})();