window.confetti = function (x, y) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var colors = ['#f28a1e', '#ffd08a', '#1d5fa8', '#ffffff'];
  for (var i = 0; i < 40; i++) {
    var p = document.createElement('span');
    p.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:8px;height:12px;border-radius:2px;z-index:200;pointer-events:none;background:' + colors[i % 4];
    document.body.appendChild(p);
    var a = Math.random() * Math.PI * 2;
    var d = 80 + Math.random() * 180;
    var dx = Math.cos(a) * d;
    var dy = Math.sin(a) * d - 80;
    var anim = p.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + dx + 'px,' + (dy + 260) + 'px) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0 }
    ], { duration: 1200 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.3,1)' });
    anim.onfinish = (function (el) { return function () { el.remove(); }; })(p);
  }
};