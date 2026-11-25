(function () {
  'use strict';
  var arena = document.getElementById('arena');
  if (!arena) return;
  var mouse = document.getElementById('mouse');
  var msg = document.getElementById('arena-msg');
  var scoreEl = document.getElementById('score');
  var timeEl = document.getElementById('time');
  var bestEl = document.getElementById('best');
  var startBtn = document.getElementById('start');
  var score = 0, time = 30, best = 0, playing = false, timer = null, mover = null;

  try { best = parseInt(localStorage.getItem('cats-best'), 10) || 0; } catch (e) {}
  bestEl.textContent = best;

  function place() {
    var w = Math.max(0, arena.clientWidth - 70);
    var h = Math.max(0, arena.clientHeight - 70);
    mouse.style.left = Math.random() * w + 'px';
    mouse.style.top = Math.random() * h + 'px';
  }
  function loop() {
    place();
    mover = setTimeout(loop, Math.max(450, 1000 - score * 25));
  }
  function finish() {
    playing = false;
    clearInterval(timer);
    clearTimeout(mover);
    mouse.hidden = true;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem('cats-best', best); } catch (e) {}
      msg.textContent = 'Новий рекорд: ' + score + '! 🏆';
    } else {
      msg.textContent = 'Час вийшов. Ви піймали мишей: ' + score;
    }
    msg.hidden = false;
    startBtn.textContent = 'Грати ще раз';
    startBtn.disabled = false;
  }
  function start() {
    score = 0; time = 30; playing = true;
    scoreEl.textContent = 0; timeEl.textContent = time;
    msg.hidden = true; mouse.hidden = false;
    startBtn.disabled = true;
    loop();
    timer = setInterval(function () {
      time--;
      timeEl.textContent = time;
      if (time <= 0) finish();
    }, 1000);
  }
  mouse.addEventListener('click', function () {
    if (!playing) return;
    score++;
    scoreEl.textContent = score;
    clearTimeout(mover);
    loop();
  });
  startBtn.addEventListener('click', start);
})();