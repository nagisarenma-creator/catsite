(function () {
  'use strict';
  var root = document.documentElement, KEY = 'cats-theme';
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var saved = read();
  var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-btn';
  var bar = document.querySelector('.bar');
  if (bar) bar.appendChild(btn);

  function apply() {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    btn.textContent = dark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', dark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
  }
  btn.addEventListener('click', function () {
    dark = !dark;
    save(dark ? 'dark' : 'light');
    apply();
  });
  apply();

  /* Кнопка «Нагору» */
  var top = document.createElement('button');
  top.type = 'button';
  top.className = 'to-top';
  top.textContent = '↑';
  top.setAttribute('aria-label', 'Повернутися нагору');
  document.body.appendChild(top);
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', function () {
    top.classList.toggle('on', window.scrollY > 600);
  }, { passive: true });
})();