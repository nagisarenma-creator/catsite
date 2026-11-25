(function () {
  'use strict';

  /* ===== Відлік до виставки ===== */
  var cd = document.getElementById('count');
  if (cd) {
    var target = new Date(cd.dataset.date).getTime();
    var ids = ['cd-d', 'cd-h', 'cd-m', 'cd-s'];
    var tick = function () {
      var left = target - Date.now();
      if (isNaN(target) || left <= 0) {
        cd.outerHTML = '<p class="count-done">Виставка вже відкрита! 🎉</p>';
        return;
      }
      var v = [
        Math.floor(left / 86400000),
        Math.floor(left / 3600000) % 24,
        Math.floor(left / 60000) % 60,
        Math.floor(left / 1000) % 60
      ];
      ids.forEach(function (id, i) {
        var el = document.getElementById(id);
        if (el) el.textContent = v[i];
      });
      setTimeout(tick, 1000);
    };
    tick();
  }

  /* ===== Голосування глядачів ===== */
  var box = document.getElementById('results');
  var cards = document.querySelectorAll('.card');
  if (!box || !cards.length) return;

  var KEY = 'cats-votes', MY = 'cats-myvote';
  var votes = {}, mine = null, names = [];
  try {
    votes = JSON.parse(localStorage.getItem(KEY)) || {};
    mine = localStorage.getItem(MY);
  } catch (e) {}

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(votes));
      if (mine) localStorage.setItem(MY, mine); else localStorage.removeItem(MY);
    } catch (e) {}
  }

  cards.forEach(function (card) {
    var name = card.querySelector('h3').textContent;
    names.push(name);
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'vote-btn';
    b.dataset.name = name;
    card.querySelector('.txt').appendChild(b);
    b.addEventListener('click', function (e) {
      if (mine) return;
      votes[name] = (votes[name] || 0) + 1;
      mine = name;
      if (window.confetti) confetti(e.clientX, e.clientY);
      save();
      render();
    });
  });

  function render() {
    var total = 0, best = 0, leader = null;
    names.forEach(function (n) {
      var c = votes[n] || 0;
      total += c;
      if (c > best) { best = c; leader = n; }
    });

    cards.forEach(function (card) {
      var n = card.querySelector('h3').textContent;
      var b = card.querySelector('.vote-btn');
      var old = card.querySelector('.crown');
      if (old) old.remove();
      if (leader === n) {
        var cr = document.createElement('span');
        cr.className = 'crown';
        cr.textContent = '👑 Лідер';
        card.appendChild(cr);
      }
      b.disabled = !!mine;
      b.classList.toggle('mine', mine === n);
      b.textContent = mine === n ? '❤ Ваш голос' : (mine ? 'Голос віддано' : '♡ Голосувати');
    });

    box.innerHTML = '';
    names.forEach(function (n) {
      var c = votes[n] || 0;
      var pct = total ? Math.round(c / total * 100) : 0;
      var row = document.createElement('div');
      row.className = 'row' + (leader === n ? ' top' : '');
      row.innerHTML = '<span>' + n + '</span><div class="track"><div class="fill"></div></div><span>' + c + '</span>';
      box.appendChild(row);
      var f = row.querySelector('.fill');
      requestAnimationFrame(function () { requestAnimationFrame(function () { f.style.width = pct + '%'; }); });
    });

    var t = document.getElementById('total');
    if (t) t.textContent = total ? 'Усього голосів: ' + total : 'Голосів ще немає. Станьте першим!';
  }

  var reset = document.getElementById('reset');
  if (reset) {
    reset.addEventListener('click', function () {
      votes = {}; mine = null; save(); render();
    });
  }
  render();
})();