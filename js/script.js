(function () {
  'use strict';

  /* Закриваємо меню на телефоні після вибору пункту */
  var toggle = document.getElementById('menu-toggle');
  document.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (toggle) toggle.checked = false;
    });
  });

  /* Випадковий факт на головній */
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

  /* Якщо людина просила менше анімації, коти не з'являються */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var layer = document.createElement('div');
  layer.className = 'cat-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  /* 1. Ланцюжок котів за курсором (тільки там, де є миша) */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var COUNT = 5;
    var GAP = 30;
    var chain = [];
    var mouse = { x: -100, y: -100 };
    var started = false;

    for (var i = 0; i < COUNT; i++) {
      var el = document.createElement('span');
      el.className = 'follow-cat';
      el.textContent = '🐈';
      el.style.fontSize = (30 - i * 3) + 'px';
      layer.appendChild(el);
      chain.push({ el: el, x: -100, y: -100, flip: 1, alpha: 1 - i * 0.14 });
    }

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!started) {
        started = true;
        chain.forEach(function (c) {
          c.x = mouse.x;
          c.y = mouse.y;
          c.el.style.opacity = c.alpha;
        });
      }
    });

    var tick = function () {
      chain.forEach(function (c, idx) {
        var tx, ty;
        if (idx === 0) {
          tx = mouse.x + 18;
          ty = mouse.y + 18;
          var dx0 = tx - c.x;
          c.x += dx0 * 0.25;
          c.y += (ty - c.y) * 0.25;
          if (Math.abs(dx0) > 1.5) c.flip = dx0 > 0 ? -1 : 1;
        } else {
          var prev = chain[idx - 1];
          var dx = prev.x - c.x;
          var dy = prev.y - c.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > GAP) {
            var k = ((dist - GAP) / dist) * 0.3;
            c.x += dx * k;
            c.y += dy * k;
          }
          if (Math.abs(dx) > 1.5) c.flip = dx > 0 ? -1 : 1;
        }
        c.el.style.transform = 'translate(' + c.x + 'px,' + c.y + 'px) scaleX(' + c.flip + ')';
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* 2. Коти пробігають екраном, коли гортаємо сторінку */
  var lastY = window.scrollY;
  var lastSpawn = 0;

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
    var y = window.scrollY;
    var d = y - lastY;
    lastY = y;
    var now = Date.now();
    if (Math.abs(d) < 20 || now - lastSpawn < 700) return;
    lastSpawn = now;
    spawnRunners(d > 0);
  }, { passive: true });
})();

document.addEventListener("DOMContentLoaded", () => {
  // 1. Полоска прогресса скролла
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + "%";
  });

  // 2. 3D-наклон карточек при движении курсора
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});